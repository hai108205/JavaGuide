---
title: Tổng hợp các nguyên nhân gây Blocking thường gặp trong Redis
description: Tổng hợp toàn diện các nguyên nhân gây Blocking thường gặp trong Redis, bao gồm các kịch bản như lệnh O(n), thao tác bigkey, ghi log AOF ra đĩa, tạo RDB snapshot, đồng bộ master-slave, giúp bạn chẩn đoán và phòng ngừa các vấn đề hiệu năng của Redis.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis Blocking,Vấn đề hiệu năng Redis,Lệnh O(n),bigkey,Ghi AOF ra đĩa,RDB snapshot,Đồng bộ master-slave,Bộ nhớ đạt giới hạn
---

> Bài viết này được tổng hợp và hoàn thiện từ: <https://mp.weixin.qq.com/s/0Nqfq_eQrUb12QH6eBbHXA>, tác giả: A Q nói code (阿 Q 说代码)

Bài viết này sẽ tổng hợp chi tiết các tình huống có thể dẫn đến Redis Blocking, đây cũng là những yếu tố then chốt ảnh hưởng đến hiệu năng của Redis, cần đặc biệt chú ý khi sử dụng Redis!

## Lệnh O(n)

Phần lớn các lệnh trong Redis đều có độ phức tạp thời gian O(1), nhưng cũng có một số ít lệnh có độ phức tạp thời gian O(n), ví dụ:

- `KEYS *`: Trả về tất cả key khớp với quy tắc.
- `HGETALL`: Trả về tất cả các cặp key-value trong một Hash.
- `LRANGE`: Trả về các phần tử trong phạm vi chỉ định của List.
- `SMEMBERS`: Trả về tất cả các phần tử trong Set.
- `SINTER`/`SUNION`/`SDIFF`: Tính giao/hợp/hiệu của nhiều Set.
- ……

Do các lệnh này có độ phức tạp thời gian O(n), đôi khi còn quét toàn bộ bảng (full table scan), khi n tăng lên thì thời gian thực thi cũng càng dài, từ đó gây Blocking cho client. Tuy nhiên, những lệnh này không phải là tuyệt đối không được dùng, nhưng cần xác định rõ giá trị N. Ngoài ra, nếu có nhu cầu duyệt, có thể dùng `HSCAN`, `SSCAN`, `ZSCAN` để thay thế.

Ngoài những lệnh có độ phức tạp thời gian O(n) có thể gây Blocking, còn có một số lệnh có độ phức tạp thời gian có thể trên O(N), ví dụ:

- `ZRANGE`/`ZREVRANGE`: Trả về tất cả các phần tử trong phạm vi xếp hạng chỉ định của Sorted Set chỉ định. Độ phức tạp thời gian là O(log(n)+m), n là tổng số phần tử, m là số phần tử trả về, khi m và n khá lớn thì độ phức tạp O(n) còn nhỏ hơn.
- `ZREMRANGEBYRANK`/`ZREMRANGEBYSCORE`: Xóa tất cả các phần tử trong phạm vi xếp hạng chỉ định/phạm vi score chỉ định của Sorted Set. Độ phức tạp thời gian là O(log(n)+m), n là tổng số phần tử, m là số phần tử bị xóa, khi m và n khá lớn thì độ phức tạp O(n) còn nhỏ hơn.
- ……

## SAVE tạo RDB snapshot

Redis cung cấp hai lệnh để tạo file RDB snapshot:

- `save`: Thao tác lưu đồng bộ, sẽ Blocking main thread của Redis;
- `bgsave`: fork ra một tiến trình con, tiến trình con thực thi, không Blocking main thread của Redis, là tùy chọn mặc định.

Mặc định, cấu hình mặc định của Redis sử dụng lệnh `bgsave`. Nếu dùng thủ công lệnh `save` để tạo file RDB snapshot thì sẽ Blocking main thread.

## AOF

### Blocking do ghi log AOF

Cơ chế Persistence AOF của Redis là ghi log sau khi thực thi xong lệnh, điều này khác với các cơ sở dữ liệu quan hệ (như MySQL) thường ghi log trước khi thực thi lệnh (để thuận tiện cho khôi phục sự cố).

![Quá trình ghi log của AOF](https://oss.javaguide.cn/github/javaguide/database/redis/redis-aof-write-log-disc.png)

**Tại sao lại ghi log sau khi thực thi xong lệnh?**

- Tránh chi phí kiểm tra phát sinh thêm, AOF ghi log sẽ không kiểm tra cú pháp của lệnh;
- Ghi log sau khi lệnh thực thi xong sẽ không Blocking lệnh đang thực thi hiện tại.

Cách này cũng mang đến rủi ro (khi giới thiệu về AOF Persistence ở phần trước tôi cũng đã đề cập):

- Nếu Redis gặp sự cố ngay sau khi vừa thực thi xong lệnh thì thay đổi tương ứng sẽ bị mất;
- **Có thể Blocking việc thực thi của các lệnh khác sau đó (việc ghi log AOF được thực hiện trong main thread của Redis)**.

### Blocking do ghi AOF ra đĩa (flush)

Sau khi bật AOF Persistence, mỗi khi thực thi một lệnh làm thay đổi dữ liệu trong Redis, Redis sẽ ghi lệnh đó vào buffer AOF `server.aof_buf`, sau đó dựa vào cấu hình `appendfsync` để quyết định khi nào đồng bộ nó vào file AOF trên đĩa.

Trong file cấu hình của Redis tồn tại ba cách AOF Persistence khác nhau (chiến lược `fsync`), lần lượt là:

1. `appendfsync always`: Sau khi main thread gọi `write` thực hiện thao tác ghi, **main thread** sẽ ngay lập tức gọi hàm `fsync` để đồng bộ file AOF (ghi ra đĩa), sau khi `fsync` hoàn tất thì luồng mới trả về. Chiến lược `always` do **main thread trực tiếp thực thi fsync**, chứ không phải background thread. Cách này dữ liệu an toàn nhất, nhưng mỗi thao tác ghi đều Blocking đồng bộ main thread, làm giảm nghiêm trọng hiệu năng của Redis (`write` + `fsync`).
2. `appendfsync everysec`: Sau khi main thread gọi `write` thực hiện thao tác ghi thì trả về ngay lập tức, do background thread (luồng `aof_fsync`) mỗi giây gọi hàm `fsync` (system call) để đồng bộ file AOF một lần (`write`+`fsync`, khoảng cách `fsync` là 1 giây)
3. `appendfsync no`: Sau khi main thread gọi `write` thực hiện thao tác ghi thì trả về ngay lập tức, để hệ điều hành quyết định khi nào thực hiện đồng bộ, trên Linux thường là 30 giây một lần (`write` nhưng không `fsync`, thời điểm `fsync` do hệ điều hành quyết định).

Khi background thread (luồng `aof_fsync`) gọi hàm `fsync` để đồng bộ file AOF thì cần phải chờ cho đến khi ghi xong. Khi áp lực đĩa quá lớn, thao tác `fsync` sẽ bị Blocking, main thread khi gọi hàm `write` cũng sẽ bị Blocking. Sau khi `fsync` hoàn tất, main thread thực thi `write` mới có thể trả về thành công.

Về giới thiệu chi tiết quy trình làm việc của AOF, có thể xem: [Giải thích chi tiết cơ chế Persistence của Redis](./redis-persistence.md), sẽ giúp ích cho việc hiểu về Blocking khi ghi AOF ra đĩa.

### Blocking do AOF rewrite

1. fork ra một tiến trình con để viết lại file, khi thực thi lệnh `BGREWRITEAOF`, máy chủ Redis sẽ duy trì một buffer AOF rewrite, buffer này sẽ ghi lại tất cả các lệnh ghi mà máy chủ thực thi trong thời gian tiến trình con tạo file AOF mới.
2. Sau khi tiến trình con hoàn tất công việc tạo file AOF mới, máy chủ sẽ nối (append) tất cả nội dung trong buffer rewrite vào cuối file AOF mới, để trạng thái cơ sở dữ liệu được lưu trong file AOF mới nhất quán với trạng thái cơ sở dữ liệu hiện tại.
3. Cuối cùng, máy chủ dùng file AOF mới thay thế file AOF cũ, qua đó hoàn tất thao tác viết lại file AOF.

Blocking xuất hiện trong quá trình của bước 2, quá trình ghi dữ liệu mới trong buffer vào file mới sẽ phát sinh **Blocking**.

Bài đọc liên quan: [Phân tích vấn đề Blocking khi Redis AOF rewrite](https://cloud.tencent.com/developer/article/1633077).

## Key lớn (Big Key)

Nếu value tương ứng của một key chiếm bộ nhớ tương đối lớn, thì key đó có thể được xem là bigkey. Cụ thể bao nhiêu mới được coi là lớn? Có một tiêu chuẩn tham khảo không thật sự chính xác:

- value kiểu string vượt quá 1MB
- value kiểu phức hợp (list, hash, set, sorted set, v.v.) chứa số phần tử vượt quá 5000 (đối với value kiểu phức hợp, không nhất thiết chứa càng nhiều phần tử thì càng chiếm nhiều bộ nhớ).

Các vấn đề Blocking do big key gây ra như sau:

- Client Blocking do timeout: Do Redis thực thi lệnh bằng xử lý đơn luồng, mà khi thao tác với big key lại khá tốn thời gian, nên sẽ Blocking Redis, từ góc nhìn của client thì thấy rất lâu rất lâu không có phản hồi.
- Gây Blocking mạng: Mỗi lần lấy big key phát sinh lưu lượng mạng khá lớn, nếu một key có kích thước 1 MB, lượng truy cập mỗi giây là 1000, thì mỗi giây sẽ phát sinh lưu lượng 1000MB, điều này là thảm họa đối với máy chủ có card mạng gigabit thông thường.
- Blocking worker thread: Nếu dùng del để xóa big key thì sẽ Blocking worker thread, như vậy sẽ không thể xử lý các lệnh tiếp theo.

### Tìm big key

Khi sử dụng tham số `--bigkeys` có sẵn của Redis để tìm big key, tốt nhất nên chọn thực thi lệnh đó trên replica node, vì khi thực thi trên master node sẽ **Blocking** master node.

- Chúng ta cũng có thể dùng lệnh SCAN để tìm big key;

- Thông qua việc phân tích file RDB để tìm ra big key, giải pháp này có tiền đề là Redis sử dụng RDB Persistence. Trên mạng có sẵn công cụ:

- - redis-rdb-tools: Công cụ viết bằng Python dùng để phân tích file RDB snapshot của Redis
  - rdb_bigkeys: Công cụ viết bằng Go dùng để phân tích file RDB snapshot của Redis, hiệu năng tốt hơn.

### Xóa big key

Bản chất của thao tác xóa là giải phóng không gian bộ nhớ mà cặp key-value chiếm dụng.

Giải phóng bộ nhớ chỉ là bước đầu tiên, để quản lý không gian bộ nhớ hiệu quả hơn, khi ứng dụng giải phóng bộ nhớ, **hệ điều hành cần chèn khối bộ nhớ đã giải phóng vào một danh sách liên kết các khối bộ nhớ trống (free memory block list)**, để tiện cho việc quản lý và tái phân phối sau này. Quá trình này bản thân nó cần một khoảng thời gian nhất định, và sẽ **Blocking** ứng dụng đang giải phóng bộ nhớ hiện tại.

Vì vậy, nếu giải phóng một lượng lớn bộ nhớ cùng lúc, thời gian thao tác danh sách khối bộ nhớ trống sẽ tăng lên, tương ứng sẽ gây Blocking main thread của Redis, nếu main thread bị Blocking thì tất cả các request khác đều có thể bị timeout, timeout ngày càng nhiều sẽ làm cạn kiệt kết nối Redis, phát sinh đủ loại bất thường.

Khi xóa big key, khuyến nghị áp dụng cách xóa theo từng đợt và xóa bất đồng bộ.

## Xóa sạch cơ sở dữ liệu

Xóa sạch cơ sở dữ liệu cũng cùng lý lẽ với việc xóa big key ở trên, `flushdb`, `flushall` cũng liên quan đến việc xóa và giải phóng tất cả các cặp key-value, cũng là điểm gây Blocking của Redis.

## Mở rộng Cluster

Redis Cluster có thể mở rộng/thu hẹp node một cách động, quá trình này hiện tại vẫn ở trạng thái bán tự động, cần có sự can thiệp thủ công.

Khi mở rộng/thu hẹp, cần thực hiện di chuyển dữ liệu. Mà Redis để đảm bảo tính nhất quán của việc di chuyển, tất cả thao tác di chuyển đều là thao tác đồng bộ.

Khi thực thi di chuyển, Redis ở cả hai đầu đều sẽ rơi vào trạng thái Blocking với thời gian dài ngắn khác nhau, đối với Key nhỏ thì thời gian này có thể bỏ qua, nhưng nếu một khi mức sử dụng bộ nhớ của Key quá lớn, nghiêm trọng sẽ kích hoạt Failover trong Cluster, gây ra những chuyển đổi không cần thiết.

## Swap (trao đổi bộ nhớ)

**Swap là gì?** Swap dịch sát nghĩa là trao đổi, Swap trong Linux thường được gọi là trao đổi bộ nhớ hoặc phân vùng swap (swap partition). Tương tự như bộ nhớ ảo (virtual memory) trong Windows, chính là khi bộ nhớ không đủ, lấy một phần không gian ổ cứng ảo hóa thành bộ nhớ để sử dụng, từ đó giải quyết tình huống dung lượng bộ nhớ không đủ. Vì vậy, tác dụng của phân vùng Swap là hy sinh ổ cứng, tăng thêm bộ nhớ, giải quyết vấn đề VPS không đủ bộ nhớ hoặc bộ nhớ đầy tràn.

Swap đối với Redis là cực kỳ chí mạng, một tiền đề quan trọng để Redis đảm bảo hiệu năng cao là tất cả dữ liệu nằm trong bộ nhớ. Nếu hệ điều hành đổi một phần bộ nhớ mà Redis sử dụng ra ổ cứng, do tốc độ đọc/ghi giữa bộ nhớ và ổ cứng chênh lệch vài bậc độ lớn, sẽ dẫn đến hiệu năng của Redis sau khi xảy ra swap giảm sút nghiêm trọng.

Cách kiểm tra để nhận biết Redis xảy ra Swap như sau:

1. Tra cứu số tiến trình (process ID) của Redis

```bash
redis-cli -p 6383 info server | grep process_id
process_id: 4476
```

2. Dựa vào số tiến trình để tra cứu thông tin trao đổi bộ nhớ

```bash
cat /proc/4476/smaps | grep Swap
Swap: 0kB
Swap: 0kB
Swap: 4kB
Swap: 0kB
Swap: 0kB
.....
```

Nếu lượng trao đổi đều là 0KB hoặc cá biệt là 4KB thì bình thường.

Các phương pháp phòng ngừa trao đổi bộ nhớ:

- Đảm bảo máy có đủ bộ nhớ khả dụng
- Đảm bảo tất cả các Redis instance đều được thiết lập bộ nhớ khả dụng tối đa (maxmemory), phòng ngừa trường hợp cực đoan bộ nhớ Redis tăng không kiểm soát
- Giảm ưu tiên sử dụng swap của hệ thống, ví dụ `echo 10 > /proc/sys/vm/swappiness`

## Tranh chấp CPU

Redis là ứng dụng CPU-intensive điển hình, không khuyến nghị triển khai cùng với các dịch vụ CPU-intensive đa nhân khác. Khi các tiến trình khác tiêu thụ CPU quá mức, sẽ ảnh hưởng nghiêm trọng đến thông lượng của Redis.

Có thể dùng `redis-cli --stat` để lấy tình trạng sử dụng Redis hiện tại. Dùng lệnh `top` để lấy thông tin tỷ lệ sử dụng CPU của tiến trình. Dùng thống kê `info commandstats` để phân tích thời gian tiêu hao bất hợp lý của lệnh, xem có phải do độ phức tạp thuật toán cao hoặc vấn đề tối ưu bộ nhớ quá mức hay không.

## Vấn đề mạng

Các vấn đề mạng như từ chối kết nối, độ trễ mạng, soft interrupt của card mạng cũng có thể dẫn đến Redis Blocking.

## Tham khảo

- Phân tích và tổng hợp 6 nhóm kịch bản Redis Blocking: <https://mp.weixin.qq.com/s/eaZCEtTjTuEmXfUubVHjew>
- Ghi chú phát triển và vận hành Redis - Cơn ác mộng của Redis - Blocking: <https://mp.weixin.qq.com/s/TDbpz9oLH6ifVv6ewqgSgA>

<!-- @include: @article-footer.snippet.md -->
