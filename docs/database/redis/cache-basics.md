---
title: Tổng hợp các câu hỏi phỏng vấn thường gặp về kiến thức nền tảng Cache
description: Giải thích chi tiết tư tưởng cốt lõi của Cache, sự khác biệt giữa Cache cục bộ và Cache phân tán, thiết kế kiến trúc Cache đa tầng. Bao gồm các giải pháp Cache phổ biến như Caffeine, Redis, cùng các giải pháp cho Cache Consistency. Phù hợp cho lập trình viên Java học thiết kế kiến trúc Cache.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Cache,Cache cục bộ,Cache phân tán,Cache đa tầng,Caffeine,Redis,Cache Consistency,Thiết kế hệ thống,Java Cache,Guava Cache
---

> **Câu hỏi phỏng vấn liên quan**:
>
> - Tại sao phải sử dụng Cache?
> - Cache cục bộ (Local Cache) nên được triển khai như thế nào?
> - Tại sao phải có Cache phân tán (Distributed Cache)?/Tại sao không dùng trực tiếp Cache cục bộ?
> - Tại sao phải sử dụng Cache đa tầng (Multi-level Cache)?
> - Cache đa tầng phù hợp với những kịch bản nghiệp vụ nào?

## Tư tưởng cơ bản của Cache

Nhiều bạn chỉ biết rằng Cache có thể nâng cao hiệu năng hệ thống và giảm **thời gian phản hồi** (Response Time) của yêu cầu, nhưng lại không nắm rõ tư tưởng bản chất của Cache là gì.

Tư tưởng cơ bản của Cache thực ra rất đơn giản, chính là sự vận dụng của chiến lược tối ưu hiệu năng kinh điển mà chúng ta đã rất quen thuộc: **đánh đổi không gian lấy thời gian**. Đánh đổi không gian lấy thời gian nghĩa là dùng nhiều không gian lưu trữ hơn để lưu một số dữ liệu có thể được sử dụng lại hoặc tính toán lại, từ đó giảm thời gian truy xuất hoặc tính toán lại dữ liệu.

Nói đến đánh đổi không gian lấy thời gian, ngoài Cache ra, bạn còn có thể nghĩ đến ví dụ nào khác không? Dưới đây liệt kê thêm một vài ví dụ thường gặp:

- **Index (chỉ mục)**: Index là một cấu trúc dữ liệu riêng biệt được tổ chức từ một số cột hoặc trường trong bảng cơ sở dữ liệu theo một quy tắc sắp xếp nhất định. Tuy cần chiếm thêm không gian, nhưng nó có thể nâng cao đáng kể hiệu quả truy vấn và giảm chi phí sắp xếp dữ liệu.
- **Trường dư thừa trong bảng cơ sở dữ liệu**: Lưu trữ dư thừa những dữ liệu thường được truy vấn kết hợp vào cùng một bảng, nhằm giảm truy vấn liên kết giữa nhiều bảng, từ đó nâng cao hiệu năng truy vấn và giảm áp lực cho cơ sở dữ liệu.
- **CDN (Content Delivery Network - Mạng phân phối nội dung)**: Phân phối tài nguyên tĩnh đến nhiều nút biên (edge node) để truy cập gần nhất có thể, từ đó tăng tốc độ truy cập tài nguyên tĩnh và giảm tải cho máy chủ gốc cũng như băng thông.

Lập trình cần biết quy nạp và tổng kết, xâu chuỗi những gì mình đã học lại với nhau! Nếu khi phỏng vấn bạn có thể trao đổi được những điều này, người phỏng vấn chắc chắn sẽ có ấn tượng tốt về bạn.

Đừng thần thánh hóa Cache quá mức, mặc dù hiệu quả nâng cao hiệu năng hệ thống mà nó mang lại so với chi phí bỏ ra quả thực rất cao. Khi học và ứng dụng Cache, bạn sẽ thấy tư tưởng của Cache thực tế được sử dụng rất nhiều trong CPU, hệ điều hành và nhiều nơi khác.

Ví dụ, **CPU Cache** lưu Cache dữ liệu bộ nhớ, dùng để giải quyết vấn đề tốc độ xử lý của **CPU** không khớp với tốc độ truy cập bộ nhớ; bộ nhớ (RAM) lưu Cache dữ liệu ổ cứng, dùng để giải quyết vấn đề tốc độ **I/O** ổ cứng quá chậm.

![Sơ đồ mô hình Cache của CPU](https://oss.javaguide.cn/github/javaguide/java/concurrent/cpu-cache.png)

Thêm một ví dụ khác, để nâng cao tốc độ chuyển đổi từ địa chỉ ảo sang địa chỉ vật lý, hệ điều hành đã đưa vào **Translation Lookaside Buffer** (**TLB**, còn được gọi là bảng nhanh) trên nền tảng cơ chế bảng trang (page table).

![Dịch địa chỉ sau khi thêm TLB](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/physical-virtual-address-translation-mmu.png)

Lấy trình duyệt chúng ta dùng hằng ngày làm ví dụ, nó sẽ lưu Cache các hình ảnh hoặc tệp tĩnh đã từng truy cập (Cache của trình duyệt), nhờ vậy lần sau khi truy cập cùng một trang, tốc độ tải sẽ được cải thiện đáng kể.

![](https://oss.javaguide.cn/github/javaguide/database/redis/chrome-clear-cache.png)

Cache mà chúng ta dùng trong phát triển hằng ngày thường lưu dữ liệu trong **RAM** (bộ nhớ), tốc độ truy cập cực nhanh. Để tránh mất dữ liệu trong bộ nhớ sau khi khởi động lại hoặc gặp sự cố, nhiều middleware Cache (như **Redis**) cung cấp cơ chế Persistence (bền vững hóa) ra đĩa. So với cơ sở dữ liệu quan hệ (như **MySQL**), tốc độ truy cập và mức độ hỗ trợ đồng thời của Cache đều cao hơn vài bậc độ lớn (order of magnitude). Thêm một tầng Cache phía trên cơ sở dữ liệu là biện pháp cốt lõi để bảo vệ tầng lưu trữ bên dưới và nâng cao thông lượng (throughput) của hệ thống.

## Phân loại Cache

Tiếp theo, chúng ta hãy xem Cache dùng trong phát triển hằng ngày thường được chia thành mấy loại.

### Cache cục bộ (Local Cache)

#### Cache cục bộ là gì?

Loại này thực tế được dùng khá nhiều trong nhiều dự án, đặc biệt là với kiến trúc monolith (đơn khối). Khi lượng dữ liệu không lớn và không có yêu cầu phân tán, sử dụng Cache cục bộ là hoàn toàn ổn.

Cache cục bộ nằm bên trong ứng dụng, ưu điểm lớn nhất là ứng dụng và Cache cùng tồn tại trong một tiến trình, tốc độ truy cập Cache cục bộ rất nhanh, không có chi phí mạng phát sinh thêm.

Kiến trúc monolith thường gặp như hình dưới, chúng ta sử dụng **Nginx** để làm **cân bằng tải (Load Balancing)**, triển khai hai ứng dụng giống nhau lên máy chủ, hai dịch vụ dùng chung một cơ sở dữ liệu và đều sử dụng Cache cục bộ.

![Sơ đồ Cache cục bộ](https://oss.javaguide.cn/github/javaguide/database/redis/local-cache.png)

**Chú ý:** Khi sử dụng Cache cục bộ ở chế độ Cluster, bắt buộc phải cân nhắc **chiến lược cân bằng tải**. Nếu Nginx sử dụng **Round-Robin (luân phiên)** mặc định, yêu cầu của cùng một người dùng sẽ rơi ngẫu nhiên vào các máy khác nhau, dẫn đến tỷ lệ Cache cục bộ trúng (hit rate) cực thấp. Giải pháp như sau:

1. **Tầng Gateway**: Sử dụng Consistent Hashing (băm nhất quán) hoặc Sticky Session, đảm bảo yêu cầu của cùng một người dùng luôn được chuyển đến cùng một máy.
2. **Tầng ứng dụng**: Chỉ dùng Cache cục bộ cho dữ liệu **"gần như không bao giờ thay đổi trên phạm vi toàn cục"** (như từ điển cấu hình), chứ không dùng cho dữ liệu theo chiều người dùng.

#### Có những giải pháp Cache cục bộ nào?

**1. `HashMap` và `ConcurrentHashMap` có sẵn trong JDK.**

`ConcurrentHashMap` có thể được xem là phiên bản thread-safe của `HashMap`, cả hai đều lưu trữ dữ liệu dạng key/value. Tuy nhiên, trong phần lớn trường hợp, người ta không dùng hai cấu trúc này làm Cache, vì chúng chỉ cung cấp chức năng lưu Cache chứ không có các chức năng khác như thời gian hết hạn. Một framework Cache hoàn chỉnh tối thiểu phải cung cấp: **thời gian hết hạn**, **cơ chế loại bỏ (eviction)**, **thống kê tỷ lệ trúng (hit rate)** — ba điểm này.

**2. `Ehcache`, `Guava Cache`, `Spring Cache` là ba framework Cache cục bộ được sử dụng nhiều hơn cả.**

- So với hai framework còn lại, `Ehcache` nặng hơn. Tuy nhiên, so với `Guava Cache` và `Spring Cache`, `Ehcache` hỗ trợ nhúng vào hibernate và mybatis để làm Cache đa tầng, có thể Persistence dữ liệu Cache ra đĩa cục bộ, đồng thời cũng cung cấp giải pháp Cluster (khá vô dụng, có thể bỏ qua).
- `Guava Cache` và `Spring Cache` khá giống nhau. `Guava` được sử dụng nhiều hơn `Spring Cache` một chút, nó cung cấp API rất tiện dụng, đồng thời có các chức năng như thiết lập thời gian hiệu lực của Cache. Cài đặt bên trong của nó cũng khá gọn gàng, nhiều chỗ có tư tưởng tương đồng với `ConcurrentHashMap`.
- Sử dụng annotation của `Spring Cache` để triển khai Cache thì code nhìn rất sạch sẽ và thanh lịch, nhưng cũng dễ xảy ra vấn đề như Cache Penetration (xuyên thủng Cache), tràn bộ nhớ.

**3. Nhân tố mới nổi Caffeine.**

So với `Guava`, `Caffeine` vượt trội hơn về mọi mặt, ví dụ như hiệu năng, thông thường nên dùng nó để thay thế `Guava`. Hơn nữa, cách sử dụng `Guava` và `Caffeine` rất giống nhau!

Ví dụ code tạo Cache cục bộ bằng `Caffeine`, sử dụng Builder Pattern:

```java
// Ví dụ tạo Cache cục bộ bằng Caffeine
Cache<String, String> cache = Caffeine.newBuilder()
        // Thiết lập hết hạn sau 60 ngày kể từ khi ghi
        .expireAfterWrite(60, TimeUnit.DAYS)
        // Dung lượng ban đầu
        .initialCapacity(100)
        // Giới hạn số lượng tối đa
        .maximumSize(500)
        // Bật chức năng thống kê
        .recordStats()
        .build();
```

#### Cache cục bộ có những điểm đau nào?

Ưu điểm của Cache cục bộ rất rõ ràng: **ít phụ thuộc**, **nhẹ**, **đơn giản**, **chi phí thấp**.

Tuy nhiên, Cache cục bộ tồn tại những nhược điểm sau:

- **Cache cục bộ gắn chặt với ứng dụng, hỗ trợ không tốt cho kiến trúc phân tán**, ví dụ khi cùng một dịch vụ được triển khai trên nhiều máy, Cache giữa các dịch vụ không thể chia sẻ với nhau, vì Cache cục bộ chỉ tồn tại trên máy hiện tại.
- **Dung lượng Cache cục bộ bị giới hạn rõ rệt bởi máy triển khai dịch vụ.** Nếu dịch vụ hiện tại của hệ thống tiêu tốn nhiều bộ nhớ, thì dung lượng khả dụng cho Cache cục bộ sẽ rất ít.

### Cache phân tán (Distributed Cache)

#### Cache phân tán là gì?

Chúng ta có thể xem Cache phân tán (Distributed Cache) như một dịch vụ cơ sở dữ liệu trong bộ nhớ, tác dụng cuối cùng của nó là cung cấp dịch vụ dữ liệu Cache.

Cache phân tán tồn tại độc lập, tách rời khỏi ứng dụng, nhiều ứng dụng có thể trực tiếp sử dụng chung một dịch vụ Cache phân tán.

Như hình dưới đây là một kiến trúc đơn giản sử dụng Cache phân tán. Chúng ta sử dụng Nginx để cân bằng tải, triển khai hai ứng dụng giống nhau lên máy chủ, hai dịch vụ dùng chung một cơ sở dữ liệu và Cache.

![Cache phân tán](https://oss.javaguide.cn/github/javaguide/database/redis/distributed-cache.png)

Sau khi sử dụng Cache phân tán, dịch vụ Cache có thể được triển khai trên một máy chủ riêng biệt, ngay cả khi cùng một dịch vụ được triển khai trên nhiều máy thì vẫn sử dụng cùng một bản Cache. Hơn nữa, hiệu năng, dung lượng và chức năng của dịch vụ Cache phân tán độc lập đều mạnh mẽ hơn.

**Trong thiết kế hệ thống phần mềm không có viên đạn bạc (silver bullet), việc đưa vào bất kỳ công nghệ nào cũng thường giống như con dao hai lưỡi.** Sử dụng đúng cách sẽ mang lại lợi ích rất lớn cho hệ thống. Ngược lại, chỉ tốn công sức mà không được gì.

Nói đơn giản, sau khi đưa Cache phân tán vào hệ thống, thường sẽ phát sinh những vấn đề sau:

- **Độ phức tạp của hệ thống tăng lên**: Sau khi đưa Cache vào, bạn phải duy trì tính nhất quán dữ liệu giữa Cache và cơ sở dữ liệu, duy trì Cache nóng (hot Cache), đảm bảo tính sẵn sàng cao của dịch vụ Cache, v.v.
- **Chi phí phát triển hệ thống thường tăng lên**: Đưa Cache vào nghĩa là hệ thống cần một dịch vụ Cache riêng biệt, điều này tốn chi phí tương ứng, mà chi phí này còn khá đắt đỏ, vì tiêu tốn tài nguyên bộ nhớ quý giá.

#### Có những giải pháp Cache phân tán nào?

Nói về Cache phân tán, lâu đời và được sử dụng nhiều nhất vẫn là **Memcached** và **Redis**. Tuy nhiên, hiện nay gần như không còn dự án nào dùng **Memcached** để làm Cache nữa, tất cả đều dùng trực tiếp **Redis**.

Memcached khá phổ biến vào thời kỳ Cache phân tán mới bắt đầu nổi lên. Về sau, cùng với sự phát triển của Redis, mọi người dần chuyển sang sử dụng Redis mạnh mẽ hơn.

Một số công ty lớn cũng đã open-source các cơ sở dữ liệu lưu trữ KV phân tán hiệu năng cao tương tự Redis, ví dụ [Tendis](https://github.com/Tencent/Tendis) do Tencent open-source. Tendis dựa trên dự án open-source nổi tiếng [RocksDB](https://github.com/facebook/rocksdb) làm storage engine, tương thích 100% với giao thức Redis và tất cả data model của Redis 4.0. Về so sánh giữa Redis và Tendis, phía Tencent đã từng đăng một bài viết: [Redis vs Tendis: Bật mí kiến trúc phiên bản lưu trữ hỗn hợp nóng-lạnh](https://mp.weixin.qq.com/s/MeYkfOIdnU6LYlsGb24KjQ), có thể tham khảo sơ qua.

Tuy nhiên, từ lịch sử commit trên Github của dự án Tendis có thể thấy, bản open-source của Tendis gần như không còn được bảo trì và cập nhật nữa, cộng thêm mức độ quan tâm không cao, số công ty sử dụng cũng khá ít. Vì vậy, không khuyến nghị bạn dùng Tendis để triển khai Cache phân tán.

Hiện tại, những giải pháp thay thế Redis được giới chuyên môn công nhận nhiều hơn là hai dự án Cache phân tán open-source sau (đều nổi lên nhờ "ăn theo" Redis):

- [Dragonfly](https://github.com/dragonflydb/dragonfly): Một cơ sở dữ liệu trong bộ nhớ được xây dựng cho nhu cầu tải của các ứng dụng hiện đại, tương thích hoàn toàn với API của Redis và Memcached, khi di chuyển không cần sửa bất kỳ dòng code nào, tự xưng là cơ sở dữ liệu trong bộ nhớ nhanh nhất thế giới.
- [KeyDB](https://github.com/Snapchat/KeyDB): Một nhánh hiệu năng cao của Redis, tập trung vào đa luồng, hiệu quả bộ nhớ và thông lượng cao.

Tuy nhiên, cá nhân tôi vẫn khuyên chọn Redis làm lựa chọn hàng đầu cho Cache phân tán, vì nó đã được kiểm chứng trong môi trường production nhiều năm, hệ sinh thái cũng rất tốt, tài liệu cũng rất đầy đủ.

### Cache đa tầng (Multi-level Cache)

#### Cache đa tầng là gì? Tại sao phải dùng?

Ở đây chúng ta chỉ bàn đơn giản về giải pháp Cache đa tầng **Cache cục bộ + Cache phân tán**, đây cũng là cách triển khai Cache đa tầng phổ biến nhất.

Lúc này chắc hẳn nhiều bạn sẽ thắc mắc: **Đã dùng Cache phân tán rồi, tại sao còn phải dùng Cache cục bộ?**

Cache cục bộ và Cache phân tán tuy đều là Cache, nhưng tốc độ truy cập Cache cục bộ nhanh hơn Cache phân tán rất nhiều, bởi vì truy cập Cache cục bộ không có chi phí mạng phát sinh thêm, điều này chúng ta cũng đã đề cập ở trên.

Tuy nhiên, trong đa số trường hợp, chúng ta cũng không khuyến nghị sử dụng Cache đa tầng, vì nó làm tăng gánh nặng bảo trì (ví dụ bạn cần đảm bảo tính nhất quán dữ liệu giữa Cache tầng 1 và Cache tầng 2). Hơn nữa, hiệu quả nâng cao thực tế mà nó mang lại đối với phần lớn kịch bản nghiệp vụ cũng không đáng kể.

Ở đây tóm tắt đơn giản hai kịch bản nghiệp vụ phù hợp với Cache đa tầng:

- Dữ liệu Cache không bị sửa đổi thường xuyên, tương đối ổn định;
- Lượng truy cập dữ liệu đặc biệt lớn, ví dụ kịch bản flash sale (giảm giá chớp nhoáng).

Trong giải pháp Cache đa tầng, Cache tầng thứ nhất (L1) sử dụng bộ nhớ cục bộ (ví dụ Caffeine), Cache tầng thứ hai (L2) sử dụng Cache phân tán (ví dụ Redis).

![Cache đa tầng](https://oss.javaguide.cn/javaguide/database/redis/multilevel-cache.png)

Khi đọc dữ liệu Cache, chúng ta đọc từ L1 trước, nếu không đọc được thì mới đọc từ L2. Cách này có thể giảm áp lực cho L2, giảm số lần đọc L2. Nếu L2 cũng không có dữ liệu này, thì mới truy vấn cơ sở dữ liệu, sau khi truy vấn dữ liệu thành công thì ghi dữ liệu vào cả L1 và L2.

Các triển khai open-source của Cache đa tầng được khuyến nghị:

- [J2Cache](https://gitee.com/ld/J2Cache): Framework Cache Java hai tầng dựa trên bộ nhớ cục bộ và Redis.
- [JetCache](https://github.com/alibaba/jetcache): Framework Cache do Alibaba open-source, hỗ trợ Cache đa tầng, tự động làm mới Cache phân tán, TTL và các chức năng khác.

#### Làm thế nào để đảm bảo Cache Consistency cho Cache đa tầng?

Trong hệ thống Cache đa tầng, chi phí để đảm bảo tính nhất quán mạnh (strong consistency) quá cao, các framework Cache có chức năng Cache đa tầng trong ngành về cơ bản đều chỉ đảm bảo tính nhất quán cuối cùng (eventual consistency). Ví dụ, có thể sử dụng cơ chế Publish/Subscribe của Redis, Redis Stream hoặc Message Queue để đảm bảo rằng khi Cache cục bộ của một instance thay đổi, các instance khác có thể cập nhật Cache cục bộ của mình kịp thời, nhằm duy trì Cache Consistency.

Giải pháp của đội kỹ thuật Zhengcaiyun (政采云) là Canal + tin nhắn broadcast, dưới đây giới thiệu đơn giản:

1. DB sửa dữ liệu: Trước tiên thực hiện sửa dữ liệu trong cơ sở dữ liệu.
2. Thông qua việc lắng nghe tin nhắn Canal, kích hoạt cập nhật Cache: Sử dụng Canal để lắng nghe các thao tác thay đổi của cơ sở dữ liệu, khi phát hiện dữ liệu thay đổi thì kích hoạt cập nhật Cache.
3. Đồng bộ Redis Cache: Đối với Redis Cache, vì trong Cluster chỉ chia sẻ một bản dữ liệu, nên trực tiếp đồng bộ Cache là được.
4. Đồng bộ Cache cục bộ: Do Cache cục bộ phân tán trên các JVM instance khác nhau, cần nhờ đến cơ chế tin nhắn broadcast qua Message Queue (MQ), gửi thông báo cập nhật đến từng instance nghiệp vụ, từ đó đồng bộ Cache cục bộ.

Giới thiệu chi tiết: [Thiết kế và thực chiến hệ thống Cache đa tầng phân tán](https://juejin.cn/post/7225634879152570405)

## Đọc thêm về cấu trúc dữ liệu

Các vấn đề về Cache thường được truy đến tận cấu trúc dữ liệu cụ thể:

- [Giải thích chi tiết Bloom Filter](../../cs-basics/data-structure/bloom-filter.md): Hiểu về Cache Penetration, tỷ lệ dương tính giả và khó khăn trong việc xóa.
- [Tổng hợp câu hỏi phỏng vấn về LRU Cache](../../cs-basics/data-structure/lru-cache.md): Hiểu chiến lược loại bỏ của Cache cục bộ, cách viết bằng `LinkedHashMap` và tư tưởng thay thế trang (page replacement).
- [Tổng hợp câu hỏi phỏng vấn về Hash Table](../../cs-basics/data-structure/hash-table.md): Hiểu ánh xạ key của Cache, xung đột hash và mở rộng bảng.

## Tham khảo

- Những điều về Cache: https://tech.meituan.com/2017/03/17/cache-about.html
- Phân tích thiết kế Cache của hệ thống phân tán: https://segmentfault.com/a/1190000041689802
