---
title: Giải thích chi tiết cơ chế Persistence của Redis
description: Phân tích chuyên sâu nguyên lý hoạt động, cách cấu hình và so sánh ưu nhược điểm của ba cơ chế Persistence trong Redis gồm RDB Snapshot, AOF Log và Hybrid Persistence, giúp bạn chọn được chiến lược Persistence phù hợp với kịch bản nghiệp vụ.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis Persistence,RDB,AOF,Hybrid Persistence,bgsave,Phục hồi dữ liệu,Backup Redis,fork tiến trình con
---

Khi sử dụng Cache, chúng ta thường cần Persistence (持久化) dữ liệu trong bộ nhớ, tức là ghi dữ liệu từ bộ nhớ xuống ổ cứng. Phần lớn lý do là để tái sử dụng dữ liệu về sau (ví dụ khởi động lại máy, phục hồi dữ liệu sau sự cố máy móc), hoặc để đồng bộ dữ liệu (ví dụ các node Master và Slave trong Redis Cluster đồng bộ dữ liệu thông qua file RDB).

Một điểm khác biệt rất quan trọng giữa Redis và Memcached là Redis hỗ trợ Persistence, hơn nữa hỗ trợ tới 3 phương thức Persistence:

- Snapshot (snapshotting, RDB)
- Append-Only File (append-only file, AOF)
- Hybrid Persistence kết hợp RDB và AOF (bổ sung từ Redis 4.0)

Địa chỉ tài liệu chính thức: <https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/> .

![](https://oss.javaguide.cn/github/javaguide/database/redis/redis4.0-persitence.png)

**Bài viết này dựa trên Redis phiên bản 7.0+**. Cơ chế Persistence có khác biệt quan trọng giữa các phiên bản, trước khi sử dụng hãy xác nhận phiên bản Redis của bạn:

| Phiên bản      | Phương thức Persistence mặc định | Tính năng quan trọng                          |
| -------------- | -------------------------------- | --------------------------------------------- |
| **Redis 4.0**  | RDB                              | Giới thiệu Hybrid Persistence RDB+AOF         |
| **Redis 6.0**  | RDB                              | AOF vẫn cần bật thủ công                      |
| **Redis 7.0**  | RDB                              | Giới thiệu Multi-Part AOF                     |
| **Redis 7.2+** | RDB                              | Tiếp tục tối ưu hiệu năng Persistence         |

**Khác biệt hành vi quan trọng**:

- **Bộ nhớ chiếm dụng khi AOF rewrite**: Trước Redis 7.0, dữ liệu phát sinh trong thời gian rewrite phải được giữ lại trong bộ nhớ; từ 7.0+ dùng Multi-Part AOF để giải quyết.
- **Hybrid Persistence**: Redis 4.0-6.x cần bật thủ công, Redis 7.0+ được bật mặc định.

Kiểm tra phiên bản Redis của bạn:

```bash
redis-cli INFO server | grep redis_version
# Ví dụ đầu ra: redis_version:7.0.12
```

Hình dưới đây thể hiện toàn bộ quy trình của cơ chế Persistence trong Redis, bao gồm nội dung cốt lõi của bài viết này:

![Quy trình đầy đủ của cơ chế Persistence trong Redis](https://oss.javaguide.cn/github/javaguide/database/redis/redis-persistence-flow.png)

## RDB Persistence

### RDB Persistence là gì?

Redis có thể lấy được bản sao dữ liệu lưu trong bộ nhớ tại **một thời điểm nhất định** thông qua việc tạo Snapshot. Sau khi Redis tạo Snapshot, bạn có thể backup Snapshot đó, có thể copy Snapshot sang máy chủ khác để tạo bản sao máy chủ có cùng dữ liệu (cấu trúc Master-Slave của Redis, chủ yếu dùng để nâng cao hiệu năng Redis), cũng có thể giữ Snapshot tại chỗ để dùng khi khởi động lại máy chủ.

Snapshot Persistence là phương thức Persistence được Redis áp dụng mặc định, trong file cấu hình `redis.conf` mặc định có cấu hình sau:

```clojure
# Cấu hình mặc định của Redis 7.0 (định dạng một dòng)
save 3600 1 300 100 60 10000

# Ý nghĩa của từng điều kiện:
# - Có ít nhất 1 key thay đổi trong 3600 giây (1 giờ)
# - Có ít nhất 100 key thay đổi trong 300 giây (5 phút)
# - Có ít nhất 10000 key thay đổi trong 60 giây (1 phút)

# Tương đương với định dạng nhiều dòng ở phiên bản cũ:
# save 3600 1
# save 300 100
# save 60 10000
```

### Khi tạo Snapshot RDB có chặn Main Thread không?

Redis cung cấp hai lệnh để tạo file RDB Snapshot:

- `save` : thao tác lưu đồng bộ, sẽ chặn Main Thread của Redis;
- `bgsave` : fork ra một tiến trình con, tiến trình con thực hiện.

> Ở đây nói Main Thread của Redis thay vì tiến trình chính, chủ yếu là vì sau khi Redis khởi động, phần lớn công việc chính được hoàn thành theo mô hình đơn luồng. Nếu bạn muốn mô tả là tiến trình chính của Redis thì cũng không sai.

#### Phân tích chi phí hiệu năng của fork

Tuy `bgsave` được thực thi trong tiến trình con, không chặn Main Thread xử lý yêu cầu lệnh, nhưng **bản thân thao tác fork là chặn**, và sẽ gây thêm chi phí bộ nhớ (các giá trị trong bảng dưới là giá trị tham khảo, số liệu thực tế chịu ảnh hưởng của hiệu năng CPU, tỷ lệ phân mảnh bộ nhớ, tải hệ thống...):

| Kích thước tập dữ liệu | Độ trễ fork | Bộ nhớ chiếm thêm            | Mức rủi ro |
| ---------------------- | ----------- | ---------------------------- | ---------- |
| < 1GB                  | < 10ms      | ~10MB (copy bảng trang)      | Thấp       |
| 1-10GB                 | 10-100ms    | 10-100MB                     | Trung bình |
| 10-50GB                | 100ms-1s    | 100-500MB                    | Cao        |
| > 50GB                 | > 1s        | > 500MB                      | Rất cao    |

> Bài viết này lấy `bgsave` của RDB làm ví dụ để nói về ảnh hưởng hiệu năng của fork, nhưng **cơ chế tương tự cũng áp dụng cho AOF rewrite (lệnh `BGREWRITEAOF`)**. AOF rewrite cũng cần fork tiến trình con, cũng đối mặt với độ trễ fork, chi phí bộ nhớ COW và rủi ro THP. Trong môi trường Production, dù là RDB hay AOF rewrite, đều cần quan tâm các chỉ số hiệu năng liên quan đến fork.

#### Cơ chế Copy-on-Write (COW)

- Sau khi fork, tiến trình con chia sẻ các trang bộ nhớ của tiến trình cha (trang chuẩn 4KB)
- Khi tiến trình cha hoặc tiến trình con sửa đổi trang bộ nhớ, kernel sẽ copy trang đó (Copy-on-Write)
- Với tập dữ liệu lớn + tải ghi cao, sẽ xảy ra copy trang số lượng lớn, ảnh hưởng hiệu năng

#### Vấn đề "bão tuyết" bộ nhớ do THP (Transparent Huge Pages)

Các bản phân phối Linux mặc định bật **THP (Transparent Huge Pages, trang lớn trong suốt)**, kích thước 2MB. THP làm tăng xác suất trang lớn bị COW, **trong trường hợp xấu nhất**, nếu bộ nhớ được gộp thành trang lớn 2MB, thì dù client chỉ sửa 10 byte dữ liệu, kernel cũng sẽ copy nguyên trang bộ nhớ 2MB, khiến chi phí bộ nhớ của COW bị **phóng đại 512 lần** (2MB / 4KB = 512).

**Hành vi thực tế**: kernel không bắt buộc toàn bộ bộ nhớ dùng trang lớn 2MB, mà tùy tình huống quyết định động việc gộp. Chỉ khi THP gộp thành công thành trang lớn, việc sửa đổi mới kích hoạt COW 2MB. Nhưng trong kịch bản ghi đồng thời cao, điều này vẫn làm tăng đáng kể mức tiêu thụ bộ nhớ, có thể hút cạn bộ nhớ máy chủ ngay lập tức, kích hoạt **OOM Killer giết tiến trình Redis**.

**Cách kiểm chứng**:

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
# Đầu ra [always] madvise never nghĩa là đang bật (nguy hiểm!)
# Đầu ra đúng phải là always madvise [never]
```

**Giải pháp**: thêm `echo never > /sys/kernel/mm/transparent_hugepage/enabled` vào script khởi động Redis, hoặc dùng `redis-server --disable-thp yes` (hỗ trợ từ Redis 6.0+).

**Cảnh báo khi khởi động**: khi Redis phát hiện THP đang bật, nó sẽ in trong log khởi động dòng `WARNING you have Transparent Huge Pages (THP) support enabled in your kernel`, phải xử lý ngay lập tức.

#### Khuyến nghị cho môi trường Production

```bash
# 1. Giám sát các chỉ số rủi ro fork
redis-cli INFO memory | grep -E "(used_memory|used_memory_rss)"

# Ví dụ đầu ra:
# used_memory:1073741824
# used_memory_rss:1226833920
# used_memory_rss_human:1.14G

# Tính tỷ lệ RSS/USED, khi fork nên < 2
# Nếu gần hoặc vượt 2, nghĩa là rủi ro fork cao

# 2. Đặt maxmemory để giới hạn bộ nhớ Redis chiếm dụng, dành chỗ cho fork
# Đặt trong redis.conf:
# maxmemory 8gb
# maxmemory-policy allkeys-lru

# 3. Tránh kích hoạt BGSAVE thủ công vào giờ cao điểm
# Để Redis tự kích hoạt theo quy tắc cấu hình

# 4. Cân nhắc kiến trúc Replication Master-Slave + Persistence ở node Slave
# Chuyển thao tác Persistence sang node Slave, tránh chi phí fork ở node Master
```

**Giám sát và cảnh báo**:

- `rdb_last_bgsave_time_sec`: thời gian bgsave lần trước, nên < 5s
- `rdb_last_cow_size`: kích thước bộ nhớ COW của lần fork trước, nên < 10% `used_memory`

## AOF Persistence

### AOF Persistence là gì?

So với Snapshot Persistence, AOF Persistence có tính thời gian thực tốt hơn. Mặc định Redis không bật Persistence theo phương thức AOF (append only file), có thể bật qua tham số `appendonly`:

> **Chú thích phiên bản**: Redis mặc định dùng phương thức Persistence RDB. Nếu cần dùng AOF, phải đặt thủ công `appendonly yes`. Redis 7.0 giới thiệu cơ chế Multi-Part AOF để tối ưu hiệu năng AOF, nhưng không thay đổi phương thức Persistence mặc định.

```bash
appendonly yes
```

Sau khi bật AOF Persistence, mỗi khi thực thi một lệnh làm thay đổi dữ liệu trong Redis, Redis sẽ ghi lệnh đó vào AOF buffer `server.aof_buf`, sau đó ghi vào file AOF (lúc này vẫn nằm trong cache buffer của kernel hệ thống, chưa đồng bộ xuống đĩa), cuối cùng tùy theo cấu hình phương thức Persistence (chiến lược `fsync`) mà quyết định khi nào đồng bộ dữ liệu từ cache buffer của kernel xuống ổ cứng.

Chỉ khi đồng bộ xuống đĩa thì mới coi là lưu trữ bền vững, nếu không vẫn tồn tại rủi ro mất dữ liệu, ví dụ: dữ liệu trong cache buffer của kernel chưa kịp đồng bộ mà máy đã crash, thì phần dữ liệu đó coi như đã mất.

Vị trí lưu file AOF giống với vị trí file RDB, đều được đặt qua tham số `dir`, tên file mặc định là `appendonly.aof`.

### Quy trình hoạt động cơ bản của AOF như thế nào?

Việc hiện thực chức năng AOF Persistence có thể chia đơn giản thành 5 bước:

1. **Append lệnh (append)**: tất cả lệnh ghi được append vào AOF buffer.
2. **Ghi file (write)**: ghi dữ liệu trong AOF buffer vào file AOF. Bước này cần gọi hàm `write` (system call), sau khi `write` ghi dữ liệu vào buffer của kernel hệ thống thì trả về ngay (ghi trễ). Chú ý!!! Lúc này vẫn chưa đồng bộ xuống đĩa.
3. **Đồng bộ file (fsync)**: bước này mới là cốt lõi của Persistence! Tùy theo chiến lược cấu hình `appendfsync` trong file `redis.conf`, Redis sẽ gọi hàm `fsync` (system call) vào các thời điểm khác nhau. `fsync` thao tác trên từng file, buộc đồng bộ file đó xuống đĩa cứng (ghi dữ liệu của file trong kernel buffer xuống đĩa), `fsync` sẽ chặn cho đến khi ghi xong xuống đĩa mới trả về, đảm bảo dữ liệu được lưu bền vững.
4. **Rewrite file (rewrite)**: khi file AOF ngày càng lớn, cần định kỳ rewrite file AOF để đạt mục đích nén nhỏ.
5. **Nạp khi khởi động lại (load)**: khi Redis khởi động lại, có thể nạp file AOF để phục hồi dữ liệu.

> Hệ thống Linux trực tiếp cung cấp một số hàm dùng để truy cập và điều khiển file và thiết bị, các hàm này được gọi là **system call**.

Ở đây giải thích lại một lần nữa về các system call Linux đã nhắc đến ở trên:

- `write`: sau khi ghi vào buffer của kernel hệ thống thì trả về ngay (chỉ là ghi vào buffer), không đồng bộ ngay xuống đĩa cứng. Tuy nâng cao hiệu quả, nhưng cũng mang đến rủi ro mất dữ liệu. **Thao tác đồng bộ đĩa cứng phụ thuộc vào chiến lược Dirty Page Writeback của kernel Linux**, chủ yếu chịu ảnh hưởng của các tham số sau:
  - `/proc/sys/vm/dirty_expire_centisecs`: thời gian hết hạn của dirty page (mặc định 30 giây)
  - `/proc/sys/vm/dirty_writeback_centisecs`: chu kỳ đánh thức luồng writeback của kernel (mặc định 5 giây)
  - Áp lực bộ nhớ hệ thống: khi thiếu bộ nhớ sẽ kích hoạt đồng bộ tích cực hơn
- **Điều này có nghĩa là khi crash ở chế độ `appendfsync no`, lượng dữ liệu có thể mất là không kiểm soát được và không dự đoán được**, phụ thuộc vào thời điểm kernel đồng bộ lần gần nhất.
- `fsync`: `fsync` dùng để buộc flush buffer của kernel hệ thống (đồng bộ xuống đĩa), đảm bảo thao tác ghi đĩa kết thúc mới trả về.

Sơ đồ quy trình hoạt động của AOF như sau:

![Quy trình hoạt động cơ bản của AOF](https://oss.javaguide.cn/github/javaguide/database/redis/aof-work-process.png)

### Có những phương thức AOF Persistence nào?

Trong file cấu hình của Redis tồn tại ba phương thức AOF Persistence khác nhau (chiến lược `fsync`), lần lượt là:

1. `appendfsync always`: sau khi Main Thread gọi `write` thực hiện thao tác ghi, sẽ lập tức gọi hàm `fsync` để đồng bộ file AOF (flush đĩa), trong thời gian đó Main Thread bị chặn, cho đến khi `fsync` flush toàn bộ dữ liệu xuống đĩa xong mới trả về. Chiến lược `always` do **chính Main Thread trực tiếp thực thi fsync**, chứ không phải background thread. Cách này an toàn dữ liệu nhất, về lý thuyết sẽ không mất bất kỳ dữ liệu nào. Nhưng vì mỗi thao tác ghi đều chặn đồng bộ Main Thread, nên hiệu năng cực kỳ kém.
2. `appendfsync everysec`: sau khi Main Thread gọi `write` thực hiện thao tác ghi thì trả về ngay, do background thread (luồng `aof_fsync`) mỗi giây gọi hàm `fsync` (system call) một lần để đồng bộ file AOF (`write`+`fsync`, chu kỳ `fsync` là 1 giây). Cách này hầu như không ảnh hưởng hiệu năng Main Thread. Đây là sự cân bằng tuyệt vời giữa hiệu năng và an toàn dữ liệu. Tuy nhiên, khi Redis crash bất thường, thường có thể mất dữ liệu trong vòng 1 giây gần nhất.

> **Sự thật cấp Production (rủi ro mất 2 giây và chặn)**:
>
> "Mất tối đa 1 giây" là trường hợp lý tưởng. Khi I/O đĩa bận rộn, background fsync thực thi quá lâu, Main Thread khi thực thi lệnh ghi sẽ kiểm tra thời điểm hoàn thành của lần fsync trước. Nếu cách lần fsync thành công gần nhất quá 2 giây, Main Thread sẽ bị **buộc chặn** để bảo vệ bộ nhớ không bị tràn (logic phán đoán chặn trong `aof_background_fsync` của mã nguồn Redis `aof.c`).
>
> Vì vậy, **trong trường hợp crash cực đoan, có thể mất tối đa 2 giây dữ liệu**, và sự trồi sụt của đĩa sẽ trực tiếp khiến độ trễ P99 của Redis tăng vọt.
>
> **Chỉ số bắt buộc phải giám sát**: `redis-cli INFO persistence | grep aof_delayed_fsync` (ghi lại số lần tích lũy Main Thread bị fsync chặn, chỉ khi bật AOF mới có trường này).

3. `appendfsync no`: sau khi Main Thread gọi `write` thực hiện thao tác ghi thì trả về ngay, để hệ điều hành quyết định khi nào đồng bộ, trên Linux thường là 30 giây một lần (`write` nhưng không `fsync`, thời điểm `fsync` do hệ điều hành quyết định). Cách này hiệu năng tốt nhất, vì tránh được việc chặn của `fsync`. Nhưng an toàn dữ liệu kém nhất, khi crash lượng dữ liệu mất không kiểm soát được, phụ thuộc vào thời điểm đồng bộ lần trước của hệ điều hành.

Có thể thấy: **điểm khác biệt chính của 3 phương thức Persistence này nằm ở thời điểm `fsync` đồng bộ file AOF (flush đĩa)**.

Để cân bằng giữa dữ liệu và hiệu năng ghi, có thể cân nhắc tùy chọn `appendfsync everysec`, để Redis đồng bộ file AOF mỗi giây một lần, hiệu năng Redis bị ảnh hưởng tương đối ít. Thông thường, ngay cả khi hệ thống crash, người dùng cũng chỉ mất nhiều nhất dữ liệu phát sinh trong vòng một giây. Khi ổ cứng bận thực hiện thao tác ghi, Redis còn chủ động giảm tốc độ của mình để thích ứng với tốc độ ghi tối đa của ổ cứng.

> ⚠️ **Chú ý**: khi nút thắt I/O đĩa nghiêm trọng, Main Thread của Redis có thể bị chặn tới 2 giây do chờ fsync, trong thời gian đó cửa sổ mất dữ liệu mở rộng thành 2 giây. Môi trường Production nên giám sát chỉ số `aof_delayed_fsync` để đánh giá sức khỏe của đĩa.

Từ Redis 7.0.0, Redis sử dụng cơ chế **Multi Part AOF**. Đúng như tên gọi, Multi Part AOF là chia file AOF đơn lẻ trước đây thành nhiều file AOF. Trong Multi Part AOF, file AOF được chia thành ba loại, lần lượt là:

- BASE: biểu thị file AOF cơ sở, thường được tạo bởi tiến trình con thông qua rewrite, file này nhiều nhất chỉ có một.
- INCR: biểu thị file AOF tăng dần (incremental), thường được tạo khi AOFRW bắt đầu thực thi, có thể tồn tại nhiều file loại này.
- HISTORY: biểu thị file AOF lịch sử, được chuyển đổi từ BASE và INCR AOF, mỗi khi AOFRW hoàn thành thành công, BASE và INCR AOF tương ứng trước lần AOFRW này đều trở thành HISTORY, AOF loại HISTORY sẽ bị Redis tự động xóa.

Multi Part AOF không phải trọng tâm, chỉ cần biết là được, giới thiệu chi tiết có thể xem bài viết [Thiết kế và hiện thực Redis 7.0 Multi Part AOF](https://zhuanlan.zhihu.com/p/467217082) của các nhà phát triển Alibaba.

**Issue liên quan**: [Redis 的 AOF 方式 #783](https://github.com/Snailclimb/JavaGuide/issues/783).

### Vì sao AOF ghi log sau khi thực thi xong lệnh?

Cơ sở dữ liệu quan hệ (như MySQL) thường ghi log trước khi thực thi lệnh (thuận tiện cho phục hồi sự cố), còn cơ chế AOF Persistence của Redis ghi log sau khi thực thi xong lệnh.

![Quá trình ghi log của AOF](https://oss.javaguide.cn/github/javaguide/database/redis/redis-aof-write-log-disc.png)

**Vì sao lại ghi log sau khi thực thi xong lệnh?**

- Tránh chi phí kiểm tra bổ sung, AOF ghi log sẽ không kiểm tra cú pháp của lệnh;
- Ghi sau khi lệnh thực thi xong sẽ không chặn việc thực thi lệnh hiện tại.

Cách này cũng mang đến rủi ro (khi giới thiệu AOF Persistence ở phần trước tôi cũng đã nhắc đến):

- Nếu vừa thực thi xong lệnh mà Redis crash thì sẽ mất các thay đổi tương ứng;
- Có thể chặn việc thực thi của các lệnh khác sau đó (việc ghi log AOF được thực hiện trong Main Thread của Redis).

### Bạn có biết về AOF Rewrite không?

Khi AOF trở nên quá lớn, Redis có thể tự động rewrite AOF ở background để tạo ra một file AOF mới, file AOF mới này lưu trạng thái cơ sở dữ liệu giống hệt file AOF cũ, nhưng kích thước nhỏ hơn.

![AOF Rewrite](https://oss.javaguide.cn/github/javaguide/database/redis/aof-rewrite.png)

> AOF Rewrite (rewrite) là một cái tên có tính mơ hồ, chức năng này được hiện thực bằng cách đọc các cặp key-value trong cơ sở dữ liệu, chương trình không cần thực hiện bất kỳ thao tác đọc vào, phân tích hay ghi nào đối với file AOF hiện có.

Do AOF Rewrite thực hiện rất nhiều thao tác ghi, để tránh ảnh hưởng đến việc xử lý yêu cầu lệnh bình thường của Redis, Redis đặt chương trình AOF Rewrite vào tiến trình con để thực thi.

Trong thời gian rewrite file AOF, Redis còn duy trì một **AOF Rewrite Buffer**, buffer này sẽ ghi lại tất cả lệnh ghi mà máy chủ thực thi trong thời gian tiến trình con tạo file AOF mới. Sau khi tiến trình con hoàn thành việc tạo file AOF mới, máy chủ sẽ append toàn bộ nội dung trong Rewrite Buffer vào cuối file AOF mới, khiến trạng thái cơ sở dữ liệu mà file AOF mới lưu giữ nhất quán với trạng thái cơ sở dữ liệu hiện tại. Cuối cùng, máy chủ dùng file AOF mới thay thế file AOF cũ, hoàn tất thao tác rewrite file AOF.

Để bật chức năng AOF Rewrite, có thể gọi lệnh `BGREWRITEAOF` để thực thi thủ công, cũng có thể đặt hai cấu hình dưới đây để chương trình tự quyết định thời điểm kích hoạt:

- `auto-aof-rewrite-min-size`: nếu kích thước file AOF nhỏ hơn giá trị này thì sẽ không kích hoạt AOF Rewrite. Giá trị mặc định là 64 MB;
- `auto-aof-rewrite-percentage`: khi thực thi AOF Rewrite, tỷ lệ giữa kích thước AOF hiện tại (aof_current_size) và kích thước AOF ở lần rewrite trước (aof_base_size). Nếu kích thước file AOF hiện tại tăng thêm theo tỷ lệ phần trăm này, sẽ kích hoạt AOF Rewrite. Đặt giá trị này thành 0 sẽ tắt tự động AOF Rewrite. Giá trị mặc định là 100.

**Biên giới thất bại và các kịch bản rủi ro của AOF Rewrite**:

Tuy AOF Rewrite được thực thi ở tiến trình con, nhưng vẫn tồn tại các rủi ro sau cần biết:

| Kịch bản rủi ro          | Ảnh hưởng                                        | Điều kiện kích hoạt                          | Biện pháp ứng phó                                   |
| ------------------------ | ------------------------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| **fork thất bại**        | Không thể tạo tiến trình con rewrite             | Thiếu bộ nhớ, giới hạn hệ thống              | Giám sát tỷ lệ dùng bộ nhớ, đặt `maxmemory`         |
| **Đầy đĩa**              | Ghi file AOF mới thất bại                         | Dữ liệu tăng nhanh trong thời gian rewrite   | Giám sát tỷ lệ dùng đĩa (`df -h`), đặt ngưỡng cảnh báo 70% |
| **Cạn inode**            | Không thể tạo file mới                           | Hệ thống có quá nhiều file nhỏ               | Giám sát tỷ lệ dùng inode (`df -i`), dọn file tạm   |
| **Timestamp bị lùi**     | Quản lý file Multi-Part AOF hỗn loạn             | Vấn đề đồng bộ đồng hồ máy ảo                | Cấu hình dịch vụ NTP, đặt `aof-timestamp-enabled`   |
| **Tín hiệu SIGTERM**     | rewrite bị gián đoạn                             | Nhân viên vận hành khởi động lại thủ công    | Cấu hình tắt máy an toàn (`shutdown-timeout`)       |

**Khuyến nghị giám sát môi trường Production**:

```bash
# Giám sát trạng thái AOF Rewrite
redis-cli INFO persistence | grep aof_rewrite_in_progress

# Giám sát tăng trưởng kích thước file AOF
redis-cli INFO persistence | grep aof_current_size
redis-cli INFO persistence | grep aof_base_size

# Kiểm tra tỷ lệ dùng đĩa và inode
df -h /var/lib/redis
df -i /var/lib/redis

# Đặt chiến lược fsync tăng dần trong thời gian AOF Rewrite (Redis 7.0+)
# aof-rewrite-incremental-sync yes
```

Trước phiên bản Redis 7.0, nếu có lệnh ghi trong thời gian rewrite, AOF có thể sử dụng rất nhiều bộ nhớ, tất cả lệnh ghi đến trong thời gian rewrite đều được ghi xuống đĩa hai lần.

Từ phiên bản Redis 7.0, cơ chế AOF Rewrite đã được tối ưu cải tiến. Đoạn nội dung dưới đây trích từ bài viết [Nhìn quá khứ và tương lai của Redis từ bản phát hành Redis 7.0](https://mp.weixin.qq.com/s/RnoPPL7jiFSKkx3G4p57Pg) của các nhà phát triển Alibaba.

> Xử lý dữ liệu tăng dần trong thời gian AOF Rewrite luôn là một vấn đề, trước đây dữ liệu tăng dần trong thời gian ghi cần được giữ lại trong bộ nhớ, sau khi ghi xong mới ghi phần dữ liệu tăng dần này vào file AOF mới để đảm bảo tính toàn vẹn dữ liệu. Có thể thấy việc ghi AOF tiêu tốn thêm bộ nhớ và IO đĩa, đây cũng là điểm đau của việc ghi AOF trong Redis, tuy trước đây đã nhiều lần cải tiến nhưng vấn đề bản chất về tiêu hao tài nguyên vẫn chưa được giải quyết.
>
> Redis Enterprise Edition của Alibaba Cloud ban đầu cũng gặp vấn đề này, sau nhiều lần phát triển lặp nội bộ, đã hiện thực cơ chế Multi-part AOF để giải quyết, đồng thời đóng góp cho cộng đồng và phát hành cùng phiên bản 7.0 này. Phương pháp cụ thể là dùng cách lưu trữ file độc lập base (dữ liệu toàn phần) + inc (dữ liệu tăng dần), giải quyết triệt để sự lãng phí tài nguyên bộ nhớ và IO, đồng thời hỗ trợ quản lý lưu giữ các file AOF lịch sử, kết hợp với thông tin thời gian trong file AOF còn có thể hiện thực phục hồi theo thời điểm PITR (Alibaba Cloud Enterprise Edition Tair đã hỗ trợ), điều này tăng cường thêm độ tin cậy dữ liệu của Redis, đáp ứng nhu cầu rollback dữ liệu của người dùng.

**Issue liên quan**: [Mô tả Redis AOF Rewrite không chính xác #1439](https://github.com/Snailclimb/JavaGuide/issues/1439).

### File AOF kiểm chứng tính toàn vẹn dữ liệu như thế nào?

**Kết luận cốt lõi**: file AOF thuần **không có** cơ chế checksum, chỉ kiểm chứng bằng cách parse từng lệnh; checksum CRC64 chỉ tồn tại ở **phần RDB** của file Hybrid Persistence.

#### Chế độ AOF thuần: không có checksum, chỉ parse cú pháp

File AOF thuần không tính checksum CRC64 cho toàn bộ hay từng lệnh, mà kiểm chứng tính hợp lệ bằng cách parse lần lượt từng lệnh trong file.

**Vì sao không có checksum?**

AOF là log văn bản được append ghi với tần suất cao. Nếu mỗi lần append lệnh đều phải tính lại checksum CRC64 của toàn bộ file, sẽ gây gánh nặng nghiêm trọng cho CPU của Main Thread và I/O đĩa. Vì vậy Redis chọn cách nhẹ hơn: khi nạp lúc khởi động lại, đọc và parse cú pháp từng lệnh một.

Nếu trong quá trình parse phát hiện lỗi cú pháp (như lệnh không hoàn chỉnh, sai định dạng), Redis sẽ chấm dứt nạp và báo lỗi.

> **Chống chịu cắt đuôi file (tự động phục hồi)**:
>
> Khi gặp mất điện bất ngờ hoặc bị `kill -9` buộc chấm dứt, lệnh cuối cùng của file AOF rất có thể được ghi không hoàn chỉnh (chỉ ghi được một nửa). Lúc này hành vi phục hồi do cấu hình **`aof-load-truncated`** quyết định:
>
> | Giá trị cấu hình | Hành vi                                                                                          | Kịch bản áp dụng                                              |
> | ---------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
> | `yes` (mặc định) | Redis tự động bỏ lệnh không hoàn chỉnh ở cuối file, tiếp tục hoàn tất khởi động và in cảnh báo trong log | Khuyến nghị cho Production, chấp nhận mất ít dữ liệu để đổi lấy tính khả dụng |
> | `no`             | Redis từ chối khởi động và báo lỗi trực tiếp, buộc phải dùng công cụ `redis-check-aof` để xác nhận và sửa dữ liệu thủ công | Các kịch bản như tài chính, yêu cầu cực cao về toàn vẹn dữ liệu |
>
> **Kiểm chứng phục hồi cắt đuôi**:
>
> ```bash
> # Mô phỏng kịch bản mất điện: append dữ liệu rác vô nghĩa vào file AOF
> echo "truncated garbage data" >> /var/lib/redis/appendonly.aof
>
> # Khởi động lại Redis (khi aof-load-truncated=yes sẽ tự động phục hồi)
> redis-server /path/to/redis.conf
> # Đầu ra log: # Bad file format reading the append only file: make a backup of your AOF file, then use ./redis-check-aof --fix <filename>
> ```
>
> **Chế độ thất bại**: nếu **phần giữa** của file AOF (chứ không phải phần đuôi) xuất hiện dữ liệu rác do đĩa hỏng âm thầm, cơ chế tự động cắt không còn tác dụng, Redis sẽ crash trực tiếp và từ chối phục vụ. Lúc này cần dùng công cụ `redis-check-aof --fix` để sửa.

**Nguyên lý hoạt động của redis-check-aof**:

- **Giai đoạn phát hiện**: dựa theo định dạng file AOF để đọc từng lệnh, phán đoán số lượng tham số lệnh, độ dài chuỗi tham số..., cung cấp vị trí trong file của lệnh lỗi/không hoàn chỉnh
- **Giai đoạn sửa**: cắt nội dung file sau vị trí lỗi (**chú ý: sẽ mất toàn bộ dữ liệu sau điểm cắt**), file gốc sẽ được backup thành `appendonly.aof.broken`

#### Chế độ Hybrid Persistence: chiến lược kiểm chứng phân đoạn

Trong **chế độ Hybrid Persistence** (giới thiệu từ Redis 4.0), file AOF áp dụng chiến lược kiểm chứng "quản trị phân đoạn":

```
┌─────────────────────────────────────────────────────────┐
│              Cấu trúc file Hybrid Persistence           │
├─────────────────────────────────────────────────────────┤
│  Phần RDB Snapshot (nhị phân) ← checksum CRC64 bảo vệ phần này │
│  ├── Header "REDIS"                                     │
│  ├── Số hiệu cơ sở dữ liệu, cặp key-value...            │
│  ├── Cờ EOF                                             │
│  └── Checksum CRC64 (8 byte)  ← biên giới kiểm chứng ở đây │
├─────────────────────────────────────────────────────────┤
│  Phần AOF tăng dần (văn bản)  ← không có checksum, chỉ parse cú pháp │
│  ├── *3\r\n$3\r\nSET\r\n...                             │
│  └── ...                                                │
└─────────────────────────────────────────────────────────┘
```

- **Phần RDB Snapshot**: bắt đầu bằng chuỗi ký tự `REDIS` cố định, lưu Snapshot dữ liệu bộ nhớ tại một thời điểm, và kèm theo một checksum CRC64 ở cuối dữ liệu Snapshot. Checksum này **nằm chính xác ở cuối khối dữ liệu RDB**, chỉ bảo đảm tính toàn vẹn của phần Snapshot nhị phân này.
- **Phần AOF tăng dần**: ngay sau RDB Snapshot, ghi các lệnh ghi tăng dần. Phần này **vẫn không có checksum**, áp dụng kiểm chứng parse cú pháp từng lệnh giống như AOF thuần.

**Quy trình kiểm chứng khi nạp**:

1. Redis trước tiên kiểm chứng phần RDB Snapshot: tính checksum CRC64 của phần dữ liệu đó, so sánh với giá trị checksum đã lưu. Nếu không khớp, Redis từ chối khởi động.
2. Sau khi phần RDB kiểm chứng xong, parse từng lệnh AOF tăng dần. Nếu parse lỗi thì dừng nạp các lệnh sau đó (nhưng lúc này dữ liệu RDB Snapshot đã nạp thành công).

#### Giải thích các cấu hình

| Cấu hình             | Phạm vi áp dụng                                  | Giải thích                                                             |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `rdbchecksum`        | File RDB, phần RDB của Hybrid Persistence        | Điều khiển có tính checksum CRC64 hay không, không có tác dụng với phần AOF tăng dần thuần |
| `aof-load-truncated` | File AOF thuần, phần AOF tăng dần của Hybrid Persistence | Điều khiển khi bị cắt đuôi có tự động bỏ và tiếp tục khởi động hay không |

**Sửa thủ công** (người dùng nâng cao):

- Nếu không muốn sửa file AOF bằng cách cắt, có thể thử sửa thủ công
- Dùng trình soạn thảo văn bản mở file AOF (định dạng văn bản thuần), xóa hoặc sửa lệnh lỗi thủ công
- Áp dụng cho các kịch bản cụ thể khi biết rõ vị trí lỗi

## Tối ưu ở phiên bản mới

### Redis 4.0 đã tối ưu cơ chế Persistence như thế nào?

Do RDB và AOF đều có ưu điểm riêng, nên từ Redis 4.0 bắt đầu hỗ trợ Hybrid Persistence kết hợp RDB và AOF.

#### Giải thích cấu hình

```bash
# Bật AOF
appendonly yes

# Bật Hybrid Persistence (Redis 7.0+ bật mặc định)
aof-use-rdb-preamble yes

# Tối ưu điều kiện kích hoạt rewrite
auto-aof-rewrite-percentage 100   # Kích hoạt khi kích thước file AOF tăng 100% so với lần rewrite trước
auto-aof-rewrite-min-size 64mb    # File AOF đạt ít nhất 64MB mới kích hoạt rewrite
```

**Khác biệt phiên bản**:

- **Redis 4.0-6.x**: Hybrid Persistence mặc định tắt, cần cấu hình thủ công `aof-use-rdb-preamble yes`
- **Redis 7.0+**: Hybrid Persistence **bật mặc định**, không cần cấu hình thêm

#### Nguyên lý hoạt động

Nếu bật Hybrid Persistence, khi AOF Rewrite sẽ ghi nội dung RDB vào đầu file AOF. Ưu điểm của cách này là kết hợp được ưu điểm của RDB và AOF, nạp nhanh đồng thời tránh mất quá nhiều dữ liệu.

**Cấu trúc file Hybrid Persistence**:

```
┌───────────────────┐
│   RDB Header      │ ← Snapshot nhị phân (định dạng nén)
│   REDIS0009       │
│   ...             │
├───────────────────┤
│   AOF Log Entries │ ← Lệnh định dạng văn bản
│   *3\r\n$3\r\nSET\r\n$5\r\nkey01\r\n...
│   INCR counter    │
│   ...             │
└───────────────────┘
```

**Quy trình hoạt động cốt lõi**:

1. **Giai đoạn xử lý ghi**:

   - Client thực thi lệnh ghi (`SET/INCR`...)
   - Redis lập tức cập nhật dữ liệu bộ nhớ
   - Append lệnh vào AOF buffer (định dạng văn bản)

2. **Giai đoạn kích hoạt Persistence**:

   - Kích thước file AOF đạt ngưỡng (mặc định 64MB) hoặc tăng 100%
   - Kích hoạt AOF Rewrite (`BGREWRITEAOF`)

3. **Giai đoạn xây dựng file**:

   - Tiến trình con ghi dữ liệu bộ nhớ hiện tại theo định dạng RDB vào đầu file AOF mới
   - Tiến trình cha tiếp tục xử lý lệnh ghi, dữ liệu tăng dần được ghi vào Rewrite Buffer
   - Sau khi rewrite xong, append các lệnh tăng dần trong Rewrite Buffer vào cuối file AOF mới

4. **Giai đoạn phục hồi dữ liệu**:
   - Khi Redis khởi động, ưu tiên nạp phần RDB (phục hồi nhanh dữ liệu cơ sở)
   - Sau đó replay tuần tự các lệnh AOF tăng dần (phục hồi dữ liệu mới nhất)

#### So sánh ưu điểm

| Chỉ số                        | RDB thuần    | AOF thuần        | Hybrid Persistence |
| ----------------------------- | ------------ | ---------------- | ------------------ |
| **Tốc độ phục hồi**           | Nhanh (giây) | Chậm (phút)      | Nhanh (giây)       |
| **Cửa sổ mất dữ liệu**        | Cấp phút     | ≤2 giây          | ≤2 giây            |
| **Kích thước file**           | Nhỏ (nén)    | Lớn (log văn bản)| Trung bình         |
| **Ảnh hưởng ghi**             | Thấp         | Cao              | Trung bình         |
| **Khả năng đọc**              | Kém (nhị phân)| Tốt (văn bản)   | Kém (phần RDB)     |

**Dữ liệu benchmark** (tập dữ liệu 1GB, SSD):

- Phục hồi AOF thuần: 30-60 giây
- Phục hồi Hybrid Persistence: 2-5 giây (**nhanh hơn 5-10 lần**)

**Nhược điểm của Hybrid Persistence**:

- Phần RDB trong file AOF là định dạng nén, không còn là định dạng AOF, khả năng đọc kém hơn.
- Cần tốn thêm CPU để nén và giải nén RDB.

#### Vấn đề thường gặp và giải pháp

**1. Kiểm chứng cấu hình**:

```bash
# Cách 1: kiểm tra đầu file (đầu ra REDIS nghĩa là đã bật Hybrid Persistence)
head -c 5 appendonly.aof

# Cách 2: kiểm chứng qua CLI
redis-cli CONFIG GET aof-use-rdb-preamble
# Đầu ra: 1) "aof-use-rdb-preamble"
#      2) "yes"
```

**2. Phục hồi file hỏng**:

**Giải thích công cụ**:

| Công cụ             | Nguyên lý hoạt động                                                        | Phát hiện lỗi                                          | Chức năng sửa                                                        |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| **redis-check-aof** | Dựa theo định dạng file AOF đọc từng lệnh, phán đoán số lượng tham số lệnh, độ dài chuỗi tham số... | Phát hiện tính chính xác và toàn vẹn của lệnh, cung cấp vị trí lỗi | ✅ **Hỗ trợ sửa**: cắt nội dung sau vị trí lỗi, hoặc sửa thủ công |
| **redis-check-rdb** | Đọc lần lượt đầu file, phần dữ liệu, cuối file theo định dạng file RDB     | Trong quá trình đọc phán đoán nội dung có đúng không và báo lỗi | ❌ **Không hỗ trợ sửa**: chỉ phát hiện vấn đề, cần sửa thủ công      |

**Các bước phục hồi**:

```bash
# Bước 1: phát hiện vấn đề của file AOF
redis-check-aof appendonly.aof
# Đầu ra vị trí và nguyên nhân lỗi

# Bước 2: sửa file AOF (cắt từ vị trí lỗi)
redis-check-aof --fix appendonly.aof
# File AOF gốc sẽ được backup thành appendonly.aof.broken

# Bước 3: phát hiện phần RDB
redis-check-rdb appendonly.aof
# Chỉ phát hiện, không hỗ trợ tham số --fix

# Bước 4: nếu phần RDB có vấn đề, cần sửa thủ công hoặc bỏ cả file
# Lựa chọn A: sửa thủ công (cần hiểu định dạng nhị phân RDB)
# Lựa chọn B: xóa file Hybrid Persistence, chỉ dùng RDB thuần hoặc AOF thuần để phục hồi

# Bước 5: khởi động Redis
redis-server --appendonly yes --appendfilename appendonly.aof
```

> **⚠️ Lưu ý quan trọng**:
>
> - **File AOF**: `redis-check-aof --fix` sẽ cắt file từ vị trí lỗi, **mất toàn bộ dữ liệu sau điểm cắt**
> - **File RDB**: `redis-check-rdb` **không hỗ trợ sửa**, nếu phần RDB hỏng thì toàn bộ file Hybrid Persistence không thể phục hồi, chỉ có thể dựa vào backup hoặc file AOF thuần
> - **Sửa thủ công**: đối với phần RDB, nếu bắt buộc phải sửa, cần dùng trình soạn thảo hex (như `hexdump`, `xxd`) để sửa định dạng nhị phân thủ công

#### Khuyến nghị cấu hình Production

```bash
# Ví dụ cấu hình Production đầy đủ
appendonly yes
aof-use-rdb-preamble yes

# Tối ưu hiệu năng
aof-rewrite-incremental-fsync yes   # fsync tăng dần, giảm đỉnh I/O đĩa
# Kịch bản nhạy cảm độ trễ (khuyến nghị yes)
no-appendfsync-on-rewrite yes       # Tạm dừng fsync trong thời gian rewrite, tránh chặn
# Kịch bản an toàn dữ liệu (khuyến nghị no)
no-appendfsync-on-rewrite no        # Vẫn thực thi fsync trong thời gian rewrite, có thể chặn nhưng an toàn hơn

# Khuyến nghị quy hoạch dung lượng:
# - Dự phòng dung lượng đĩa gấp 2 lần bộ nhớ
# - Giữ mỗi file AOF < 16GB
# - Giám sát chỉ số aof_delayed_fsync
```

Địa chỉ tài liệu chính thức: <https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/>

![](https://oss.javaguide.cn/github/javaguide/database/redis/redis4.0-persitence.png)

### Redis 7.0 đã tối ưu cơ chế Persistence như thế nào?

Do trong quá trình AOF Rewrite tồn tại vấn đề buffer dữ liệu tăng dần trong bộ nhớ và ghi đôi xuống đĩa, nên từ Redis 7.0 bắt đầu hỗ trợ Multi-Part AOF (bật mặc định, có thể chỉ định thư mục qua cấu hình `appenddirname`).

Nếu bật Multi-Part AOF, file AOF sẽ được chia thành file base (nhiều nhất một file, Snapshot toàn phần ban đầu, có thể ở định dạng RDB hoặc AOF) và nhiều file incr (log lệnh tăng dần), trong thời gian rewrite lệnh mới được ghi trực tiếp vào file incr mới, file manifest theo dõi tất cả các phần. Ưu điểm của cách này là loại bỏ chi phí buffer bộ nhớ khi rewrite và ghi I/O kép, nâng cao hiệu năng và giảm khả năng chặn fsync. Do cấu trúc file tách rời, file INCR giữ trạng thái chỉ đọc trước khi rewrite, copy từng file tương đối an toàn; nhưng backup nhất quán xuyên file vẫn cần tạm dừng rewrite, quy trình backup tổng thể phức tạp hơn so với AOF đơn file, và với tập dữ liệu cực lớn vẫn có thể cần giám sát tài nguyên.

> **Rủi ro điểm lỗi đơn cốt lõi: file manifest bị hỏng**
>
> Multi-Part AOF dựa vào **file manifest** để theo dõi và quản lý tất cả file `base/incr/history`, đây là metadata cốt lõi của toàn bộ hệ thống log tăng dần. Nếu file manifest bị hỏng hoặc mất:
>
> | Kịch bản rủi ro                        | Ảnh hưởng                                                                  | Độ khó phục hồi                          |
> | -------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
> | **Manifest hỏng âm thầm**              | Redis khởi động không thể nhận diện và nạp đúng file AOF, cơ sở dữ liệu không thể phục hồi | Rất cao (cần dựng lại manifest thủ công) |
> | **Mất manifest do sự cố đĩa**          | Dù file base/incr còn nguyên vẹn, Redis cũng không thể tái tạo quan hệ phụ thuộc giữa các file | Rất cao (cần can thiệp thủ công)         |
>
> **Biện pháp giảm thiểu**:
>
> ```bash
> # 1. Backup file manifest (quan trọng ngang với file dữ liệu)
> cp /var/lib/redis/appendonlydir/appendonly.aof.manifest /backup/
>
> # 2. Giám sát sức khỏe đĩa (phát hiện sự cố sớm)
> smartctl -a /dev/sda | grep -E "SMART overall-health self-assessment|Media_Errors"
>
> # 3. Định kỳ kiểm chứng tính toàn vẹn của manifest (Redis tự động kiểm tra khi khởi động)
> redis-check-aof /var/lib/redis/appendonlydir/appendonly.aof.manifest
> ```
>
> **Chính thức không cung cấp công cụ sửa tự động**, môi trường Production bắt buộc phải đưa file manifest vào chiến lược backup, tầm quan trọng của nó ngang với chính file dữ liệu RDB/AOF.

## Chỉ số giám sát môi trường Production

### Chỉ số hiệu năng Persistence

```bash
# Chỉ số liên quan RDB
redis-cli INFO persistence | grep rdb_last_bgsave_time_sec
# Khuyến nghị: < 5s. Vượt 5s nghĩa là tập dữ liệu quá lớn hoặc nút thắt hiệu năng I/O

redis-cli INFO persistence | grep rdb_last_cow_size
# Khuyến nghị: < 10% used_memory. Vượt nghĩa là chi phí bộ nhớ Copy-on-Write của fork lớn

redis-cli INFO memory | grep used_memory_rss
redis-cli INFO memory | grep used_memory
# Tính: used_memory_rss / used_memory, khi fork nên < 2

# Chỉ số liên quan AOF
redis-cli INFO persistence | grep aof_rewrite_in_progress
# Kỳ vọng: 0 (không đang rewrite) hoặc 1 (đang rewrite)

redis-cli INFO persistence | grep aof_current_size
redis-cli INFO persistence | grep aof_base_size
# Giám sát tốc độ tăng trưởng, tránh rewrite quá thường xuyên

redis-cli INFO persistence | grep aof_buffer_length
# Khuyến nghị: < 4MB. Quá lớn nghĩa là tốc độ ghi của Main Thread nhanh hơn tốc độ fsync
```

### Giám sát tài nguyên hệ thống

```bash
# Tỷ lệ dùng đĩa và chờ I/O
iostat -x 1 5 | grep dm-0
# Quan tâm: %util (tỷ lệ dùng I/O), await (thời gian chờ trung bình)

# Dung lượng đĩa (dự phòng chỗ cho rewrite tạo file mới)
df -h /var/lib/redis
# Khuyến nghị: tỷ lệ dùng < 70%

# Tỷ lệ dùng inode (kịch bản nhiều file nhỏ)
df -i /var/lib/redis
# Khuyến nghị: tỷ lệ dùng < 90%

# Tỷ lệ dùng bộ nhớ
free -h
# Khuyến nghị: dự phòng ít nhất 20% bộ nhớ trống cho fork
```

### Khuyến nghị quy tắc cảnh báo

> **Giải thích nguồn chỉ số**:
>
> - **Chỉ số Redis**: lấy qua `redis-cli INFO` hoặc Redis exporter (như `redis_rss_memory`, `aof_current_size`)
> - **Chỉ số cấp node**: lấy qua node_exporter hoặc lệnh hệ thống (như `disk_usage`, bộ nhớ hệ thống, tỷ lệ dùng CPU)
>
> Các quy tắc cảnh báo dưới đây giả định sử dụng hệ thống giám sát Prometheus + Redis exporter + node_exporter.

```yaml
alert_rules:
  # ── Cảnh báo liên quan Persistence của Redis ────────────────────────────────────────
  - name: "RedisHighMemFragmentation"
    expr: redis_memory_rss_bytes / redis_memory_used_bytes > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Tỷ lệ phân mảnh bộ nhớ Redis quá cao, rủi ro fork COW tăng"
      description: >
        Instance {{ $labels.instance }} có mem_fragmentation_ratio = {{ $value | humanize }},
        vượt ngưỡng 2. Tỷ lệ phân mảnh quá cao nghĩa là số trang vật lý OS thực cấp
        nhiều hơn nhiều so với Redis tự thống kê,
        khi thực thi BGSAVE / BGREWRITEAOF kích hoạt fork, số trang COW cần copy tăng đáng kể,
        dưới tải ghi cao có thể khiến bộ nhớ tăng vọt, rủi ro OOM tăng.
        Khuyến nghị thực thi MEMORY PURGE hoặc khởi động lại instance vào giờ thấp điểm để dọn phân mảnh.

  - name: "RedisAofGrowthTooFast"
    expr: deriv(redis_aof_current_size_bytes[5m]) * 60 > 10485760
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Tốc độ ghi file AOF của Redis quá cao"
      description: >
        Tốc độ tăng trưởng AOF của instance {{ $labels.instance }} vượt 10 MB/min
        (hiện tại khoảng {{ $value | humanize1024 }}B/min).
        Ghi tốc độ cao sẽ liên tục kích hoạt auto-aof-rewrite, tăng áp lực I/O đĩa,
        và có thể gây write amplification. Khuyến nghị kiểm tra nghiệp vụ có bão lệnh nhỏ
        hoặc quét toàn phần kiểu KEYS hay không.

  - name: "RedisAofFsyncDelayed"
    expr: rate(redis_aof_delayed_fsync_total[5m]) > 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "AOF fsync của Redis bị trễ, phản hồi Main Thread bị ảnh hưởng"
      description: >
        Instance {{ $labels.instance }} liên tục tăng aof_delayed_fsync,
        Main Thread bị chặn do chờ AOF fsync hoàn thành, trực tiếp khiến P99 phản hồi lệnh kém đi.
        Nguyên nhân thường gặp: ① băng thông I/O đĩa bão hòa; ② appendfsync đặt là always;
        ③ dùng chung đĩa với tiến trình I/O cao khác. Khuyến nghị chuyển sang chiến lược everysec
        hoặc chuyển sang đĩa riêng.

  # ── Cảnh báo tài nguyên cấp node ─────────────────────────────────────────────
  - name: "RedisDiskUsageHigh"
    expr: >
      (1 - node_filesystem_avail_bytes{mountpoint="/var/lib/redis"}
         / node_filesystem_size_bytes{mountpoint="/var/lib/redis"}) * 100 > 70
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Tỷ lệ dùng đĩa dữ liệu Redis vượt 70%"
      description: >
        Tỷ lệ dùng hiện tại của mount point /var/lib/redis là {{ $value | humanize }}%.
        Trong thời gian AOF Rewrite sẽ tạm thời tạo file mới, cần dự phòng khoảng 1.5 lần
        kích thước AOF hiện tại,
        thiếu đĩa sẽ khiến rewrite thất bại và kích hoạt log lỗi Redis "MISCONF".
        RDB bgsave cũng tương tự.
      remediation: >
        1. Dọn các RDB Snapshot hết hạn và file AOF lịch sử;
        2. Tăng auto-aof-rewrite-min-size để giảm tần suất rewrite;
        3. Mở rộng đĩa hoặc chuyển thư mục dữ liệu sang phân vùng lớn hơn.
```

## Chọn RDB và AOF như thế nào?

Về ưu nhược điểm của RDB và AOF, trang chính thức cũng có giải thích khá chi tiết [Redis persistence](https://redis.io/docs/manual/persistence/), ở đây kết hợp với hiểu biết của bản thân để tóm tắt đơn giản.

**Những điểm RDB tốt hơn AOF**:

- **File gọn, phù hợp backup và Disaster Recovery**: nội dung lưu trong file RDB là dữ liệu nhị phân đã nén, lưu tập dữ liệu tại một thời điểm, file rất nhỏ, cực kỳ phù hợp để backup dữ liệu và Disaster Recovery. File AOF lưu từng lệnh ghi, tương tự binlog của MySQL, thường lớn hơn file RDB rất nhiều. Khi AOF trở nên quá lớn, Redis có thể tự động rewrite AOF ở background, file AOF mới lưu trạng thái cơ sở dữ liệu giống file AOF cũ, nhưng kích thước nhỏ hơn. Tuy nhiên, trước phiên bản Redis 7.0, nếu có lệnh ghi trong thời gian rewrite, AOF có thể sử dụng rất nhiều bộ nhớ, tất cả lệnh ghi đến trong thời gian rewrite đều được ghi xuống đĩa hai lần.
- **Tốc độ phục hồi nhanh**: dùng file RDB để phục hồi dữ liệu, chỉ cần parse và hoàn nguyên dữ liệu trực tiếp, không cần thực thi từng lệnh một, tốc độ rất nhanh. Còn AOF cần thực thi lần lượt từng lệnh ghi, tốc độ rất chậm. Nghĩa là, so với AOF, khi phục hồi tập dữ liệu lớn, RDB nhanh hơn.
- **Ưu điểm Replication Master-Slave**: trên Replica, RDB hỗ trợ **Partial Resynchronization** (đồng bộ lại một phần) sau khi khởi động lại và Failover. Replica có thể dùng RDB Snapshot để nhanh chóng đồng bộ đến trạng thái tại một thời điểm của node Master, mà không cần đồng bộ toàn phần.
- **Chi phí hiệu năng nhỏ**: RDB tối đa hóa hiệu năng Redis, vì công việc Persistence duy nhất mà tiến trình cha Redis cần làm là fork tiến trình con, tiến trình con sẽ hoàn thành tất cả công việc còn lại. Tiến trình cha không bao giờ thực thi I/O đĩa hay thao tác tương tự.

**Những điểm AOF tốt hơn RDB**:

- **An toàn dữ liệu cao hơn, hỗ trợ Persistence cấp giây**: an toàn dữ liệu của RDB không bằng AOF, không có cách nào Persistence dữ liệu theo thời gian thực hoặc cấp giây. Quá trình tạo file RDB khá nặng, tuy công việc ghi file RDB của tiến trình con BGSAVE không chặn Main Thread, nhưng sẽ ảnh hưởng đến tài nguyên CPU và tài nguyên bộ nhớ của máy, nghiêm trọng thậm chí có thể khiến dịch vụ Redis crash trực tiếp. AOF hỗ trợ mất dữ liệu cấp giây (tùy thuộc chiến lược `fsync`, nếu là `everysec`, thường mất nhiều nhất 1 giây dữ liệu; nhưng khi I/O đĩa bận rộn có thể mất 2 giây và Main Thread sẽ bị chặn), chỉ là append lệnh vào file AOF, thao tác nhẹ.
- **Tương thích phiên bản tốt**: file RDB được lưu theo định dạng nhị phân đặc định, và trong quá trình phát triển phiên bản Redis có nhiều phiên bản RDB, nên tồn tại vấn đề dịch vụ Redis phiên bản cũ không tương thích với định dạng RDB phiên bản mới.
- **Khả năng đọc và khả năng thao tác mạnh**: AOF chứa log của tất cả thao tác theo định dạng dễ hiểu và dễ parse. Bạn có thể dễ dàng xuất file AOF để phân tích, cũng có thể trực tiếp thao tác file AOF để giải quyết một số vấn đề. Ví dụ, nếu sau khi thực thi lệnh `FLUSHALL` vô tình xóa sạch mọi thứ, chỉ cần file AOF chưa bị rewrite, xóa lệnh mới nhất và khởi động lại là có thể phục hồi trạng thái trước đó.
- **Log append không có rủi ro hỏng**: log AOF là log append, không có seek, cũng không có vấn đề hỏng do mất điện. Ngay cả khi log vì lý do nào đó (đầy đĩa hoặc lý do khác) kết thúc bằng lệnh ghi dở dang, công cụ `redis-check-aof` cũng có thể dễ dàng sửa.

**Ảnh hưởng của quá trình phát triển phiên bản đến việc lựa chọn**:

| Phiên bản     | Cải tiến quan trọng                              | Ảnh hưởng đến AOF                                                        | Ý nghĩa đối với việc lựa chọn                                                          |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Redis 4.0** | Giới thiệu Hybrid Persistence (`aof-use-rdb-preamble`) | Khi AOF Rewrite, file base dùng định dạng RDB, tốc độ phục hồi tăng 5-10 lần | Giảm bớt vấn đề nạp chậm của AOF thuần, nhưng vẫn cần quan tâm chi phí bộ nhớ và I/O trong thời gian rewrite |
| **Redis 7.0** | Giới thiệu Multi-Part AOF                        | Loại bỏ triệt để vấn đề ghi đôi trong thời gian rewrite, chi phí bộ nhớ và I/O giảm mạnh | Dùng AOF đơn lẻ khả thi hơn trong Production, nhưng vấn đề chặn fork vẫn chưa được giải quyết |

**Vấn đề cốt lõi chưa được giải quyết**:

- **Chặn fork**: dù là RDB bgsave hay AOF Rewrite, bản thân thao tác fork đều chặn Main Thread (tập dữ liệu càng lớn, thời gian chặn càng lâu)
- **Khuyến nghị chính thức**: tài liệu chính thức của Redis đến nay vẫn khuyến nghị **bật đồng thời RDB và AOF**, RDB làm phương tiện Cold Backup bổ sung, ứng phó với các kịch bản cực đoan như file AOF hỏng hoặc lỗi ghi

**Tương tác giữa AOF và RDB**:

Khi AOF và RDB Persistence được bật đồng thời:

- **Tránh thao tác I/O nặng đồng thời**: Redis 2.4+ đảm bảo tránh kích hoạt AOF Rewrite khi RDB Snapshot đang diễn ra, hoặc cho phép BGSAVE trong thời gian AOF Rewrite. Điều này ngăn hai tiến trình background của Redis cùng thực hiện I/O đĩa nặng.
- **Điều phối AOF Rewrite**: khi Snapshot đang diễn ra và người dùng yêu cầu rõ ràng thao tác rewrite log (dùng BGREWRITEAOF), máy chủ sẽ trả về mã trạng thái OK, báo cho người dùng biết thao tác đã được điều phối, rewrite sẽ bắt đầu sau khi Snapshot hoàn thành.
- **Ưu tiên phục hồi khi khởi động lại**: nếu cả AOF và RDB Persistence đều được bật và Redis khởi động lại, **file AOF sẽ được dùng để tái tạo tập dữ liệu gốc**, vì nó được đảm bảo là hoàn chỉnh nhất.

**Khuyến nghị lựa chọn**:

| Kịch bản                                          | Phương án khuyến nghị                                                              | Giải thích                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Cache thuần (có thể mất)**                      | **Tắt Persistence** hoặc chỉ RDB (tần suất thấp)                                   | Tắt hoàn toàn có chi phí nhỏ nhất; nếu cần Cold Backup thì giữ RDB tần suất thấp |
| **Dữ liệu quan trọng trung bình** (session, cấu hình) | **Hybrid Persistence RDB + AOF** (Redis 4.0+)                                      | RDB tăng tốc phục hồi, AOF bổ sung tăng dần, `everysec` mất nhiều nhất 1s        |
| **Dữ liệu quan trọng cao** (dữ liệu cốt lõi nghiệp vụ) | **RDB + AOF (MP-AOF, Redis 7.0+)**, và Redis làm tầng Cache chứ không phải lưu trữ duy nhất | MP-AOF giảm chi phí rewrite; Persistence thực sự do cơ sở dữ liệu chính (MySQL...) đảm nhận |
| **Kiến trúc Master-Slave**                        | **Node Master tắt Persistence, node Slave bật AOF**                                | Node Master cấm cấu hình tự khởi động lại, tránh tập dữ liệu trống ghi đè node Slave |

## Tham khảo

- 《Redis 设计与实现》 (Thiết kế và hiện thực Redis)
- Redis persistence - Tài liệu chính thức của Redis: <https://redis.io/docs/management/persistence/>
- The difference between AOF and RDB persistence: <https://www.sobyte.net/post/2022-04/redis-rdb-and-aof/>
- Giải thích chi tiết Redis AOF Persistence - Lập trình viên Lịch Tiểu Băng: <http://remcarpediem.net/article/376c55d8/>
- Redis RDB và AOF Persistence · Analyze: <https://wingsxdu.com/posts/database/redis/rdb-and-aof/>

<!-- @include: @article-footer.snippet.md -->
