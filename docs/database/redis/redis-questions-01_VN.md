---
title: Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 1)
description: Tổng hợp câu hỏi phỏng vấn Redis mới nhất (Phần 1): giải thích chuyên sâu về nền tảng Redis, năm cấu trúc dữ liệu thông dụng, nguyên lý mô hình Single Thread, cơ chế Persistence, chiến lược Eviction và Expire của Memory, triển khai Distributed Lock và Message Queue. Phù hợp cho các lập trình viên đang chuẩn bị phỏng vấn Backend!
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn Redis,Nền tảng Redis,Cấu trúc dữ liệu Redis,Mô hình thread Redis,Persistence Redis,Quản lý Memory Redis,Tối ưu hiệu năng Redis,Distributed Lock Redis,Message Queue Redis,Delayed Queue Redis,Chiến lược Cache Redis,Single Thread Redis,Multi Thread Redis,Chiến lược Expire Redis,Chiến lược Eviction Redis
---

## Nền tảng Redis

### Redis là gì?

[Redis](https://redis.io/) (**RE**mote **DI**ctionary **S**erver) là một cơ sở dữ liệu NoSQL mã nguồn mở (giấy phép BSD) được phát triển dựa trên ngôn ngữ C. Khác với các cơ sở dữ liệu truyền thống, dữ liệu của Redis được lưu trong Memory (bộ nhớ trong, cơ sở dữ liệu in-memory, có hỗ trợ Persistence - lưu trữ bền vững), vì vậy tốc độ đọc ghi rất nhanh, được ứng dụng rộng rãi trong lĩnh vực Cache phân tán (Distributed Cache). Hơn nữa, Redis lưu trữ dữ liệu dạng cặp KV (Key-Value).

Để đáp ứng các kịch bản nghiệp vụ khác nhau, Redis tích hợp sẵn nhiều kiểu dữ liệu (ví dụ String, Hash, Sorted Set, Bitmap, HyperLogLog, GEO). Đồng thời, Redis còn hỗ trợ Transaction (giao dịch), Persistence, Lua script, mô hình Publish-Subscribe (xuất bản - đăng ký) và nhiều giải pháp Cluster sẵn sàng sử dụng ngay (Redis Sentinel, Redis Cluster).

![Tổng quan các kiểu dữ liệu của Redis](https://oss.javaguide.cn/github/javaguide/database/redis/redis-overview-of-data-types-2023-09-28.jpg)

Redis không có phụ thuộc bên ngoài, Linux và OS X là hai hệ điều hành mà Redis được phát triển và kiểm thử nhiều nhất, khuyến nghị chính thức là triển khai Redis trên Linux cho môi trường production.

Với việc học cá nhân, bạn có thể tự cài đặt Redis trên máy hoặc trải nghiệm thực tế Redis thông qua [môi trường Redis trực tuyến](https://try.redis.io/) do trang chủ Redis cung cấp (một số ít lệnh không sử dụng được).

![try-redis](https://oss.javaguide.cn/github/javaguide/database/redis/try.redis.io.png)

Trên thế giới có rất nhiều website sử dụng Redis, [techstacks.io](https://techstacks.io/) có duy trì riêng một [danh sách các trang phổ biến sử dụng Redis](https://techstacks.io/tech/redis), nếu quan tâm bạn có thể xem qua.

### ⭐️Tại sao Redis lại nhanh đến vậy?

Bên trong Redis đã thực hiện rất nhiều tối ưu hiệu năng, quan trọng nhất là 4 điểm dưới đây:

1. **Hoàn toàn thao tác trên Memory (Memory-Based Storage)**: Đây là nguyên nhân chủ yếu nhất. Mọi thao tác đọc ghi dữ liệu của Redis đều diễn ra trong Memory, tốc độ truy cập ở mức nano giây, trong khi các cơ sở dữ liệu truyền thống đọc ghi đĩa thường xuyên với tốc độ ở mức mili giây, hai bên chênh nhau vài bậc độ lớn.
2. **Mô hình I/O hiệu quả (I/O Multiplexing & Single-Threaded Event Loop)**: Redis sử dụng Event Loop (vòng lặp sự kiện) Single Thread (đơn luồng) kết hợp với kỹ thuật I/O Multiplexing (ghép kênh I/O), cho phép một thread duy nhất xử lý đồng thời các sự kiện I/O (như đọc ghi) trên nhiều kết nối mạng, tránh được vấn đề chuyển đổi ngữ cảnh và tranh chấp khóa trong mô hình đa luồng. Tuy là Single Thread, nhưng kết hợp giữa hiệu quả của thao tác Memory và I/O Multiplexing giúp Redis dễ dàng xử lý lượng lớn yêu cầu đồng thời (mô hình thread của Redis sẽ được giới thiệu chi tiết ở phần sau).
3. **Cấu trúc dữ liệu nội bộ được tối ưu (Optimized Data Structures)**: Redis cung cấp nhiều kiểu dữ liệu (như String, List, Hash, Set, Sorted Set, v.v.), triển khai nội bộ sử dụng các phương pháp mã hóa được tối ưu cao (như ziplist, quicklist, skiplist, hashtable, v.v.). Redis sẽ dựa vào kích thước và kiểu dữ liệu để động lựa chọn phương pháp mã hóa nội bộ phù hợp nhất, nhằm đạt được sự cân bằng tối ưu giữa hiệu năng và hiệu suất không gian.
4. **Giao thức giao tiếp đơn giản hiệu quả (Simple Protocol - RESP)**: Redis sử dụng giao thức RESP (REdis Serialization Protocol) do chính họ thiết kế. Giao thức này triển khai đơn giản, hiệu năng phân giải tốt, và an toàn với nhị phân (binary-safe). Chi phí tuần tự hóa/giải tuần tự hóa khi giao tiếp giữa client và server rất nhỏ, góp phần nâng cao tốc độ tương tác tổng thể.

> Bức ảnh dưới đây tổng kết khá tốt, xin chia sẻ, nguồn từ [Why is Redis so fast?](https://twitter.com/alexxubyte/status/1498703822528544770).

![why-redis-so-fast](https://oss.javaguide.cn/github/javaguide/database/redis/why-redis-so-fast.png)

Vậy đã nhanh như thế, tại sao không dùng Redis luôn làm cơ sở dữ liệu chính? Chủ yếu là vì chi phí Memory quá cao, và cơ chế Persistence dữ liệu mà Redis cung cấp vẫn có nguy cơ mất dữ liệu.

### Ngoài Redis, bạn còn biết giải pháp Cache phân tán nào khác không?

Nếu trong phỏng vấn bị hỏi câu này, điều interviewer chủ yếu muốn xem là:

1. Khi chọn Redis làm giải pháp Cache phân tán, bạn đã nghiên cứu và suy nghĩ kỹ lưỡng hay chưa, hay chỉ vì Redis là công nghệ "hot" hiện tại.
2. Độ rộng kiến thức của bạn trong lĩnh vực Cache phân tán.

Nếu bạn biết các giải pháp khác, và có thể giải thích tại sao cuối cùng lại chọn Redis (tiến thêm một bước!), điều này sẽ cộng thêm khá nhiều điểm cho màn phỏng vấn của bạn!

Dưới đây cùng điểm qua một số lựa chọn công nghệ Cache phân tán phổ biến.

Về Cache phân tán, khá lâu đời đồng thời được sử dụng nhiều vẫn là **Memcached** và **Redis**. Tuy nhiên, hiện tại gần như không còn thấy dự án nào dùng **Memcached** để làm Cache nữa, đều trực tiếp dùng **Redis**.

Memcached khá thông dụng vào thời kỳ Cache phân tán mới bắt đầu nổi lên. Về sau, cùng với sự phát triển của Redis, mọi người dần chuyển sang sử dụng Redis mạnh mẽ hơn.

Một số công ty lớn cũng đã mã nguồn mở các cơ sở dữ liệu lưu trữ KV phân tán hiệu năng cao tương tự Redis, ví dụ [**Tendis**](https://github.com/Tencent/Tendis) do Tencent mở nguồn. Tendis dựa trên dự án mã nguồn mở nổi tiếng [RocksDB](https://github.com/facebook/rocksdb) làm storage engine, tương thích 100% với giao thức Redis và tất cả các mô hình dữ liệu của Redis 4.0. Về so sánh giữa Redis và Tendis, phía Tencent từng đăng một bài viết: [Redis vs Tendis：冷热混合存储版架构揭秘](https://mp.weixin.qq.com/s/MeYkfOIdnU6LYlsGb24KjQ), có thể tham khảo đơn giản.

Tuy nhiên, từ lịch sử commit trên Github của dự án Tendis có thể thấy, bản mở nguồn của Tendis gần như đã không còn được bảo trì cập nhật, cộng thêm mức độ quan tâm không cao, số công ty sử dụng cũng khá ít. Vì vậy, không khuyến nghị bạn dùng Tendis để triển khai Cache phân tán.

Hiện tại, các sản phẩm thay thế Redis được giới trong ngành công nhận nhiều hơn vẫn là hai dự án Cache phân tán mã nguồn mở dưới đây (đều nổi lên nhờ "ăn theo" Redis):

- [Dragonfly](https://github.com/dragonflydb/dragonfly): Một cơ sở dữ liệu in-memory được xây dựng cho nhu cầu tải của các ứng dụng hiện đại, hoàn toàn tương thích với API của Redis và Memcached, khi chuyển đổi không cần sửa bất kỳ dòng code nào, tự xưng là cơ sở dữ liệu in-memory nhanh nhất thế giới.
- [KeyDB](https://github.com/Snapchat/KeyDB): Một nhánh hiệu năng cao của Redis, tập trung vào đa luồng, hiệu quả Memory và throughput cao.

Tuy nhiên, cá nhân tôi vẫn khuyến nghị chọn Redis đầu tiên cho Cache phân tán, dù sao đã trải qua kiểm chứng nhiều năm như vậy, hệ sinh thái rất tốt, tài liệu cũng rất đầy đủ!

PS: Vì vấn đề dung lượng, ở đây tôi không giới thiệu và so sánh chi tiết các lựa chọn Cache phân tán kể trên, nếu quan tâm, bạn có thể tự nghiên cứu thêm.

### Hãy nêu điểm khác biệt và điểm chung giữa Redis và Memcached

Hiện nay các công ty thường dùng Redis để triển khai Cache, và bản thân Redis cũng ngày càng mạnh mẽ hơn! Tuy nhiên, việc nắm rõ điểm khác biệt và điểm chung giữa Redis và Memcached giúp chúng ta khi lựa chọn công nghệ có thể đưa ra quyết định có lý có cứ!

**Điểm chung**:

1. Đều là cơ sở dữ liệu dựa trên Memory, thường được dùng làm Cache.
2. Đều có chiến lược Expire (hết hạn).
3. Hiệu năng của cả hai đều rất cao.

**Điểm khác biệt**:

1. **Kiểu dữ liệu**: Redis hỗ trợ kiểu dữ liệu phong phú hơn (hỗ trợ kịch bản ứng dụng phức tạp hơn). Redis không chỉ hỗ trợ dữ liệu kiểu k/v đơn giản, đồng thời còn cung cấp khả năng lưu trữ các cấu trúc dữ liệu như list, set, zset, hash; trong khi Memcached chỉ hỗ trợ kiểu dữ liệu k/v đơn giản nhất.
2. **Persistence dữ liệu**: Redis hỗ trợ Persistence dữ liệu, có thể giữ dữ liệu trong Memory lên đĩa, khi khởi động lại có thể nạp lại để sử dụng; còn Memcached lưu toàn bộ dữ liệu trong Memory. Nói cách khác, Redis có cơ chế khôi phục thảm họa, còn Memcached thì không.
3. **Hỗ trợ chế độ Cluster**: Memcached không có chế độ Cluster nguyên bản, cần dựa vào client để ghi dữ liệu theo dạng shard (phân mảnh) vào Cluster; còn Redis từ phiên bản 3.0 đã hỗ trợ nguyên bản chế độ Cluster.
4. **Mô hình thread**: Memcached là mô hình mạng đa luồng, non-blocking IO multiplexing; còn Redis sử dụng mô hình Single Thread với IO multiplexing (Redis 6.0 đưa thêm đa luồng vào cho việc đọc ghi dữ liệu mạng).
5. **Hỗ trợ tính năng**: Redis hỗ trợ mô hình Publish-Subscribe, Lua script, Transaction, v.v., còn Memcached thì không. Hơn nữa, Redis hỗ trợ nhiều ngôn ngữ lập trình hơn.
6. **Xóa dữ liệu hết hạn**: Chiến lược xóa dữ liệu hết hạn của Memcached chỉ dùng Lazy Deletion (xóa trì hoãn), còn Redis sử dụng đồng thời cả Lazy Deletion và Periodic Deletion (xóa định kỳ).

Tin rằng sau khi xem so sánh ở trên, chúng ta gần như không còn lý do gì để chọn Memcached làm Cache phân tán cho dự án của mình nữa.

### ⭐️Tại sao phải dùng Redis?

**1. Tốc độ truy cập nhanh hơn**

Dữ liệu của cơ sở dữ liệu truyền thống lưu trên đĩa, còn Redis dựa trên Memory, tốc độ truy cập Memory nhanh hơn đĩa rất nhiều. Sau khi đưa Redis vào, chúng ta có thể đưa một số dữ liệu được truy cập thường xuyên vào Redis, như vậy lần sau có thể đọc trực tiếp từ Memory, tốc độ có thể tăng vài chục lần thậm chí hàng trăm lần.

**2. High Concurrency (đồng thời cao)**

Thông thường các cơ sở dữ liệu như MySQL có QPS khoảng 4k (cấu hình 4 nhân 8g), nhưng khi dùng Redis Cache thì dễ dàng đạt 5w+, thậm chí có thể đạt 10w+ (với Redis đơn máy, Redis Cluster thì còn cao hơn).

> QPS (Query Per Second): số truy vấn server có thể thực hiện mỗi giây;

Có thể thấy, số lượng yêu cầu mà thao tác trực tiếp với Cache có thể chịu được lớn hơn rất nhiều so với truy cập trực tiếp cơ sở dữ liệu, vì vậy chúng ta có thể cân nhắc chuyển một phần dữ liệu trong cơ sở dữ liệu sang Cache, như vậy một phần yêu cầu của người dùng sẽ đến thẳng Cache mà không cần đi qua cơ sở dữ liệu. Từ đó, chúng ta nâng cao được mức độ đồng thời của toàn hệ thống.

**3. Chức năng toàn diện**

Redis ngoài việc dùng làm Cache, còn có thể dùng cho Distributed Lock (khóa phân tán), Rate Limiting (giới hạn lưu lượng), Message Queue (hàng đợi tin nhắn), Delayed Queue (hàng đợi trì hoãn), v.v., chức năng rất mạnh mẽ!

### ⭐️Tại sao dùng Redis mà không dùng Cache cục bộ (Local Cache)?

| Đặc điểm | Local Cache | Redis |
| ------------ | ------------------------------------ | -------------------------------- |
| Tính nhất quán dữ liệu | Khi triển khai trên nhiều server tồn tại vấn đề dữ liệu không nhất quán | Dữ liệu nhất quán |
| Giới hạn Memory | Bị giới hạn bởi Memory của một server | Triển khai độc lập, không gian Memory lớn hơn |
| Nguy cơ mất dữ liệu | Server gặp sự cố là mất dữ liệu | Có thể Persistence, dữ liệu khó bị mất |
| Quản lý bảo trì | Phân tán, quản lý bất tiện | Quản lý tập trung, cung cấp công cụ quản lý phong phú |
| Độ phong phú chức năng | Chức năng hạn chế, thường chỉ cung cấp lưu trữ cặp Key-Value đơn giản | Chức năng phong phú, hỗ trợ nhiều cấu trúc dữ liệu và tính năng |

Về giới thiệu chi tiết Local Cache, Distributed Cache và Multi-level Cache (Cache đa tầng), có thể xem bài viết này do tôi viết: [Tổng hợp câu hỏi phỏng vấn thường gặp về nền tảng Cache](http://localhost:8080/database/redis/cache-basics.html).

### Có những chiến lược đọc ghi Cache phổ biến nào?

Về giới thiệu chi tiết các chiến lược đọc ghi Cache phổ biến, có thể xem bài viết này do tôi viết: [Giải thích chi tiết 3 chiến lược đọc ghi Cache thường dùng](https://javaguide.cn/database/redis/3-commonly-used-cache-read-and-write-strategies.html).

### Redis Module là gì? Có tác dụng gì?

Từ phiên bản 4.0, Redis hỗ trợ mở rộng chức năng thông qua Module để đáp ứng các nhu cầu đặc biệt. Các Module này được nạp vào Redis dưới dạng thư viện liên kết động (file so), đây là một cách triển khai mở rộng chức năng động rất linh hoạt, đáng để học hỏi!

Mỗi người chúng ta đều có thể dựa trên Redis để tùy biến phát triển Module của riêng mình, ví dụ triển khai chức năng search engine, Distributed Lock tùy chỉnh và Rate Limiting phân tán tùy chỉnh.

Hiện tại, các Module được Redis chính thức khuyến nghị gồm:

- [RediSearch](https://github.com/RediSearch/RediSearch): Module dùng để triển khai search engine.
- [RedisJSON](https://github.com/RedisJSON/RedisJSON): Module dùng để xử lý dữ liệu JSON.
- [RedisGraph](https://github.com/RedisGraph/RedisGraph): Module dùng để triển khai cơ sở dữ liệu đồ thị.
- [RedisTimeSeries](https://github.com/RedisTimeSeries/RedisTimeSeries): Module dùng để xử lý dữ liệu chuỗi thời gian.
- [RedisBloom](https://github.com/RedisBloom/RedisBloom): Module dùng để triển khai Bloom Filter.
- [RedisAI](https://github.com/RedisAI/RedisAI): Module dùng để thực thi mô hình Deep Learning/Machine Learning và quản lý dữ liệu của chúng.
- [RedisCell](https://github.com/brandur/redis-cell): Module dùng để triển khai Rate Limiting phân tán.
- ……

Về giới thiệu chi tiết các Module của Redis, có thể xem tài liệu chính thức: <https://redis.io/modules>.

## ⭐️Ứng dụng Redis

### Ngoài làm Cache, Redis còn làm được gì?

- **Distributed Lock**: Dùng Redis để làm Distributed Lock là một cách khá phổ biến. Thông thường, chúng ta đều dựa trên Redisson để triển khai Distributed Lock. Về giới thiệu chi tiết Redis triển khai Distributed Lock, có thể xem bài viết này do tôi viết: [Giải thích chi tiết Distributed Lock](https://javaguide.cn/distributed-system/distributed-lock.html).
- **Rate Limiting**: Thường triển khai Rate Limiting bằng cách Redis + Lua script. Nếu không muốn tự viết Lua script, bạn cũng có thể trực tiếp dùng `RRateLimiter` trong Redisson để triển khai Rate Limiting phân tán, triển khai bên dưới của nó chính là dựa trên Lua code + thuật toán Token Bucket.
- **Message Queue**: Cấu trúc dữ liệu List có sẵn của Redis có thể dùng làm một hàng đợi đơn giản. Cấu trúc dữ liệu kiểu Stream được thêm vào từ Redis 5.0 càng phù hợp hơn để làm Message Queue. Nó khá giống Kafka, có khái niệm topic và consumer group, hỗ trợ Persistence tin nhắn và cơ chế ACK.
- **Delayed Queue**: Redisson tích hợp sẵn Delayed Queue (triển khai dựa trên Sorted Set).
- **Distributed Session**: Dùng kiểu dữ liệu String hoặc Hash để lưu dữ liệu Session, tất cả các server đều có thể truy cập.
- **Kịch bản nghiệp vụ phức tạp**: Thông qua Redis và các cấu trúc dữ liệu mà phần mở rộng của Redis (ví dụ Redisson) cung cấp, chúng ta có thể hoàn thành rất nhiều kịch bản nghiệp vụ phức tạp một cách thuận tiện, ví dụ dùng Bitmap thống kê người dùng hoạt động, dùng Sorted Set duy trì bảng xếp hạng, dùng HyperLogLog thống kê UV và PV của website.
- ……

### Làm thế nào để triển khai Distributed Lock dựa trên Redis?

Về giới thiệu chi tiết Redis triển khai Distributed Lock, có thể xem bài viết này do tôi viết: [Giải thích chi tiết Distributed Lock](https://javaguide.cn/distributed-system/distributed-lock-implementations.html).

### Redis có thể làm Message Queue không? Triển khai thế nào?

Nói kết luận trước:

- **Nếu nghiệp vụ đơn giản, lưu lượng nhỏ, theo đuổi hiệu năng cực cao**, và có thể chấp nhận mất dữ liệu với xác suất cực nhỏ, thì dùng **Redis Stream** là lựa chọn tối ưu, vì nó tiết kiệm chi phí triển khai và bảo trì MQ, có thể tái sử dụng thành phần Redis sẵn có (phần lớn các dự án cần dùng MQ thường cũng cần Redis).
- **Nếu là nghiệp vụ cấp tài chính, dữ liệu khổng lồ, cần đảm bảo nghiêm ngặt không mất tin nhắn**, bắt buộc phải chọn các MQ trưởng thành hơn như **Kafka, RabbitMQ**.

Vấn đề này khá quan trọng, cũng hữu ích khi lựa chọn công nghệ, tôi đã viết riêng một bài giới thiệu và phân tích chi tiết, khuyến nghị các bạn có thời gian hãy đọc kỹ vài lần và lưu lại: [Redis có thể làm Message Queue không? Triển khai thế nào?](https://javaguide.cn/database/redis/redis-stream-mq.html).

### Làm thế nào để triển khai Delayed Task dựa trên Redis?

> Câu hỏi tương tự:
>
> - Đơn hàng chưa thanh toán sau 10 phút sẽ hết hiệu lực, dùng Redis triển khai thế nào?
> - Lì xì (red packet) không được nhận trong 24 giờ sẽ tự động hoàn lại, dùng Redis triển khai thế nào?

Chức năng triển khai Delayed Task (tác vụ trì hoãn) dựa trên Redis chỉ có hai giải pháp sau:

1. Lắng nghe sự kiện Expire của Redis.
2. Delayed Queue tích hợp sẵn của Redisson.

Lắng nghe sự kiện Expire của Redis tồn tại các vấn đề như tính kịp thời kém, mất tin nhắn, tiêu thụ tin nhắn trùng lặp khi có nhiều service instance, không được khuyến nghị sử dụng.

Delayed Queue tích hợp sẵn của Redisson có những ưu điểm dưới đây:

1. **Giảm khả năng mất tin nhắn**: Tin nhắn trong DelayedQueue sẽ được Persistence, kể cả khi Redis gặp sự cố, theo cơ chế Persistence, cũng chỉ có thể mất một chút tin nhắn, ảnh hưởng không lớn. Tất nhiên, bạn cũng có thể dùng phương pháp quét cơ sở dữ liệu làm cơ chế bù đắp.
2. **Tin nhắn không tồn tại vấn đề tiêu thụ trùng lặp**: Mỗi client đều lấy tác vụ từ cùng một hàng đợi mục tiêu, không tồn tại vấn đề tiêu thụ trùng lặp.

Về giới thiệu chi tiết Redis triển khai Delayed Task, có thể xem bài viết này do tôi viết: [Làm thế nào để triển khai Delayed Task dựa trên Redis?](./redis-delayed-task.md).

## ⭐️Kiểu dữ liệu Redis

Về giới thiệu chi tiết 5 kiểu dữ liệu cơ bản và 3 kiểu dữ liệu đặc biệt của Redis, hãy xem hai bài viết dưới đây và [tài liệu chính thức của Redis](https://redis.io/docs/data-types/):

- [Giải thích chi tiết 5 kiểu dữ liệu cơ bản của Redis](https://javaguide.cn/database/redis/redis-data-structures-01.html)
- [Giải thích chi tiết 3 kiểu dữ liệu đặc biệt của Redis](https://javaguide.cn/database/redis/redis-data-structures-02.html)

### Redis có những kiểu dữ liệu thường dùng nào?

Các kiểu dữ liệu thường gặp trong Redis gồm:

- **5 kiểu dữ liệu cơ bản**: String (chuỗi), List (danh sách), Set (tập hợp), Hash (bảng băm), Zset (tập hợp có thứ tự).
- **3 kiểu dữ liệu đặc biệt**: HyperLogLog (thống kê cardinality - lực lượng), Bitmap (bản đồ bit), Geospatial (vị trí địa lý).

Ngoài những kiểu kể trên, còn có một số kiểu khác như [Bloom filter (bộ lọc Bloom)](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html), Bitfield (trường bit).

### Các kịch bản ứng dụng của String là gì?

String là kiểu dữ liệu đơn giản nhất đồng thời cũng được dùng nhiều nhất trong Redis. Đây là kiểu dữ liệu an toàn với nhị phân (binary-safe), có thể dùng để lưu bất kỳ loại dữ liệu nào như chuỗi, số nguyên, số thực dấu phẩy động, ảnh (mã hóa hoặc giải mã base64 của ảnh, hoặc đường dẫn ảnh), đối tượng đã tuần tự hóa.

Các kịch bản ứng dụng thường gặp của String như sau:

- Cache dữ liệu thông thường (ví dụ Session, Token, đối tượng đã tuần tự hóa, đường dẫn ảnh);
- Đếm số, ví dụ số yêu cầu của người dùng trong một đơn vị thời gian (có thể dùng cho Rate Limiting đơn giản), số lượt truy cập trang trong một đơn vị thời gian;
- Distributed Lock (dùng lệnh `SETNX key value` có thể triển khai một Distributed Lock đơn giản nhất);
- ……

Về giới thiệu chi tiết String, hãy xem bài viết này: [Giải thích chi tiết 5 kiểu dữ liệu cơ bản của Redis](https://javaguide.cn/database/redis/redis-data-structures-01.html).

### String hay Hash lưu trữ dữ liệu đối tượng thì tốt hơn?

So sánh đơn giản giữa hai kiểu:

- **Cách lưu trữ đối tượng**: String lưu trữ dữ liệu đối tượng đã tuần tự hóa, lưu cả đối tượng hoàn chỉnh, thao tác đơn giản trực tiếp. Hash lưu riêng từng field của đối tượng, có thể lấy thông tin của một phần field, cũng có thể sửa hoặc thêm một phần field, tiết kiệm lưu lượng mạng. Nếu một số field trong đối tượng thường xuyên thay đổi hoặc thường cần truy vấn riêng thông tin từng field, Hash sẽ rất phù hợp.
- **Tiêu hao Memory**: Hash thường tiết kiệm Memory hơn String, đặc biệt khi số field nhiều và độ dài field ngắn. Redis tối ưu cho các Hash nhỏ (ví dụ lưu bằng ziplist), càng giảm mức chiếm dụng Memory.
- **Lưu trữ đối tượng phức tạp**: String thuận tiện hơn khi xử lý các đối tượng lồng nhau nhiều tầng hoặc có cấu trúc phức tạp, vì không cần xử lý lưu trữ và thao tác riêng từng field.
- **Hiệu năng**: Thao tác trên String thường có độ phức tạp thời gian O(1), vì nó lưu cả đối tượng hoàn chỉnh, thao tác đơn giản trực tiếp, hiệu năng đọc ghi tổng thể tốt. Hash do cần xử lý các thao tác thêm xóa sửa tra trên nhiều field, trong trường hợp field nhiều và thường xuyên thay đổi, có thể phát sinh thêm chi phí hiệu năng.

Tổng kết:

- Trong đa số trường hợp, **String** phù hợp hơn để lưu trữ dữ liệu đối tượng, đặc biệt khi cấu trúc đối tượng đơn giản và đọc ghi tổng thể là thao tác chủ yếu.
- Nếu bạn cần thao tác thường xuyên trên một phần field của đối tượng hoặc muốn tiết kiệm Memory, **Hash** có thể là lựa chọn tốt hơn.

### Triển khai bên dưới của String là gì?

Redis được viết bằng ngôn ngữ C, nhưng triển khai bên dưới của kiểu String trong Redis không phải là chuỗi trong ngôn ngữ C (tức mảng ký tự kết thúc bằng ký tự null `\0`), mà tự viết [SDS](https://github.com/antirez/sds) (Simple Dynamic String, chuỗi động đơn giản) để làm triển khai bên dưới.

SDS ban đầu là chuỗi C do tác giả Redis thiết kế cho việc phát triển C hằng ngày, sau đó được ứng dụng vào Redis, và trải qua rất nhiều chỉnh sửa hoàn thiện để phù hợp với thao tác hiệu năng cao.

Một phần source code của SDS trong Redis 7.0 như sau (<https://github.com/redis/redis/blob/7.0/src/sds.h>):

```c
/* Note: sdshdr5 is never used, we just access the flags byte directly.
 * However is here to document the layout of type 5 SDS strings. */
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* used */
    uint8_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
```

Qua source code có thể thấy, SDS có tổng cộng năm cách triển khai: SDS_TYPE_5 (không được dùng), SDS_TYPE_8, SDS_TYPE_16, SDS_TYPE_32, SDS_TYPE_64, trong đó chỉ bốn loại sau thực sự được dùng. Redis sẽ dựa vào độ dài khởi tạo để quyết định dùng loại nào, từ đó giảm mức sử dụng Memory.

| Loại | Byte | Bit |
| -------- | ---- | --- |
| sdshdr5 | < 1 | <8 |
| sdshdr8 | 1 | 8 |
| sdshdr16 | 2 | 16 |
| sdshdr32 | 4 | 32 |
| sdshdr64 | 8 | 64 |

Bốn loại triển khai sau đều bao gồm 4 thuộc tính dưới đây:

- `len`: độ dài chuỗi, tức số byte đã sử dụng.
- `alloc`: tổng kích thước không gian ký tự khả dụng, alloc-len chính là kích thước không gian còn lại của SDS.
- `buf[]`: mảng thực sự lưu trữ chuỗi.
- `flags`: ba bit thấp lưu cờ kiểu (type flag).

SDS so với chuỗi trong ngôn ngữ C có những cải tiến sau:

1. **Tránh được buffer overflow**: Khi chuỗi trong ngôn ngữ C bị sửa (ví dụ nối chuỗi), một khi không cấp phát đủ không gian Memory có độ dài cần thiết, sẽ gây ra buffer overflow. Khi SDS bị sửa, trước tiên sẽ dựa vào thuộc tính len để kiểm tra kích thước không gian có đáp ứng yêu cầu không, nếu không đủ, sẽ mở rộng lên kích thước cần thiết trước rồi mới thực hiện thao tác sửa.
2. **Độ phức tạp lấy độ dài chuỗi thấp hơn**: Độ dài chuỗi trong ngôn ngữ C thường phải duyệt qua từng ký tự để đếm, độ phức tạp thời gian là O(n). Việc lấy độ dài của SDS chỉ cần đọc trực tiếp thuộc tính len, độ phức tạp thời gian là O(1).
3. **Giảm số lần cấp phát Memory**: Để tránh mỗi lần sửa (tăng/giảm) chuỗi đều phải cấp phát lại Memory (chuỗi trong ngôn ngữ C là như vậy), SDS triển khai hai chiến lược tối ưu là pre-allocation (cấp phát trước không gian) và lazy free (giải phóng không gian trì hoãn). Khi SDS cần tăng chuỗi, Redis sẽ cấp phát Memory cho SDS, và dựa theo thuật toán cụ thể cấp phát thêm Memory dư, như vậy giảm được số lần cấp phát lại Memory khi thực hiện liên tiếp các thao tác tăng chuỗi. Khi SDS cần giảm chuỗi, phần Memory này sẽ không được thu hồi ngay, mà được ghi nhận lại, chờ sử dụng sau này (hỗ trợ giải phóng thủ công, có API tương ứng).
4. **An toàn với nhị phân (binary-safe)**: Chuỗi trong ngôn ngữ C dùng ký tự null `\0` làm ký hiệu kết thúc chuỗi, điều này tồn tại một số vấn đề, như một số file nhị phân (ví dụ ảnh, video, âm thanh) có thể chứa ký tự null, chuỗi C không thể lưu đúng. SDS dùng thuộc tính len để phán đoán chuỗi đã kết thúc hay chưa, không tồn tại vấn đề này.

🤐 Nói thêm một chút, trong nhiều bài viết, định nghĩa SDS như dưới đây:

```c
struct sdshdr {
    unsigned int len;
    unsigned int free;
    char buf[];
};
```

Điều này cũng không sai, trước Redis 3.2 định nghĩa đúng là như vậy. Về sau, do cách định nghĩa này có vấn đề, định nghĩa của `len` và `free` dùng 4 byte, gây lãng phí. Từ Redis 3.2 trở đi, Redis đã cải tiến định nghĩa SDS, chia thành 5 loại như hiện tại.

### Thông tin giỏ hàng nên lưu bằng String hay Hash thì tốt hơn?

Do các mặt hàng trong giỏ hàng được sửa và thay đổi thường xuyên, thông tin giỏ hàng nên dùng Hash để lưu trữ:

- id người dùng làm key
- id mặt hàng làm field, số lượng mặt hàng làm value

![Hash duy trì thông tin giỏ hàng đơn giản](https://oss.javaguide.cn/github/javaguide/database/redis/hash-shopping-cart.png)

Vậy việc duy trì thông tin giỏ hàng của người dùng cụ thể nên thao tác thế nào?

- Người dùng thêm mặt hàng là thêm field và value mới vào Hash;
- Truy vấn thông tin giỏ hàng là duyệt Hash tương ứng;
- Thay đổi số lượng mặt hàng thì sửa trực tiếp giá trị value tương ứng (trực tiếp set hoặc làm phép tính đều được);
- Xóa mặt hàng là xóa field tương ứng trong Hash;
- Xóa sạch giỏ hàng thì xóa trực tiếp key tương ứng là được.

Ở đây chỉ lấy kịch bản giỏ hàng có nghiệp vụ đơn giản làm ví dụ, trong kịch bản thương mại điện tử thực tế, field chỉ lưu một id mặt hàng thì không thể đáp ứng được nhu cầu.

### Dùng Redis triển khai một bảng xếp hạng như thế nào?

Trong Redis có một kiểu dữ liệu tên là `Sorted Set` (tập hợp có thứ tự) thường xuyên được dùng trong các kịch bản bảng xếp hạng, ví dụ bảng xếp hạng tặng quà trong phòng livestream, bảng xếp hạng số bước chân WeChat trong vòng bạn bè, bảng xếp hạng hạng rank trong Vương Giả Vinh Diệu, bảng xếp hạng độ hot của chủ đề, v.v.

Một số lệnh Redis liên quan: `ZRANGE` (sắp xếp từ nhỏ đến lớn), `ZREVRANGE` (sắp xếp từ lớn đến nhỏ), `ZREVRANK` (hạng của phần tử chỉ định).

![](https://oss.javaguide.cn/github/javaguide/database/redis/2021060714195385.png)

Trong phần 「技术面试题篇」 của [《Java 面试指北》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) có một bài viết giới thiệu chi tiết cách dùng Sorted Set để thiết kế một bảng xếp hạng, bạn nào quan tâm có thể xem.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719071115140.png)

### Tại sao bên dưới tập hợp có thứ tự của Redis lại dùng Skip List mà không dùng cây cân bằng, cây đỏ đen hay cây B+?

Câu hỏi phỏng vấn này được nhiều công ty lớn thích hỏi, độ khó cũng khá cao.

- Cây cân bằng vs Skip List: độ phức tạp thời gian của thao tác thêm, xóa và truy vấn trên cây cân bằng cũng giống Skip List, đều là **O(log n)**. Với truy vấn phạm vi, cây cân bằng cũng có thể đạt hiệu quả như Skip List thông qua duyệt cây theo thứ tự giữa (in-order traversal). Nhưng mỗi thao tác thêm hoặc xóa đều cần đảm bảo sự cân bằng tuyệt đối giữa node trái và node phải của toàn cây, chỉ cần mất cân bằng là phải dùng thao tác xoay để giữ cân bằng, quá trình này khá tốn thời gian. Skip List ra đời chính là để khắc phục một số nhược điểm của cây cân bằng. Skip List sử dụng cân bằng theo xác suất thay vì cân bằng bắt buộc nghiêm ngặt, vì vậy, thuật toán thêm và xóa trong Skip List đơn giản hơn rất nhiều so với thuật toán tương đương của cây cân bằng, tốc độ cũng nhanh hơn nhiều.
- Cây đỏ đen vs Skip List: so với cây đỏ đen, triển khai của Skip List cũng đơn giản hơn, không cần dùng xoay và đổi màu (biến đổi đỏ đen) để đảm bảo cân bằng đen. Hơn nữa, với thao tác tìm dữ liệu theo khoảng, hiệu quả của cây đỏ đen không cao bằng Skip List.
- Cây B+ vs Skip List: cây B+ phù hợp hơn để làm một trong những cấu trúc chỉ mục thường dùng trong cơ sở dữ liệu và hệ thống file, tư tưởng cốt lõi của nó là thông qua số lần IO ít nhất có thể để định vị được càng nhiều chỉ mục càng tốt nhằm lấy được dữ liệu truy vấn. Với cơ sở dữ liệu in-memory như Redis, nó không cần những thứ này, vì Redis là cơ sở dữ liệu in-memory nên không thể lưu trữ lượng dữ liệu lớn, vì vậy với chỉ mục không cần duy trì theo cách cây B+, chỉ cần duy trì ngẫu nhiên theo xác suất là được, tiết kiệm Memory. Hơn nữa khi dùng Skip List để triển khai zset thì đơn giản hơn so với cây B+, khi thêm chỉ cần thông qua chỉ mục để chèn dữ liệu vào vị trí phù hợp trong danh sách liên kết rồi duy trì ngẫu nhiên chỉ mục ở độ cao nhất định là được, cũng không cần như cây B+ khi thêm mà phát hiện mất cân bằng còn phải tách và gộp node.

Ngoài ra, tôi còn viết riêng một bài từ cách sử dụng cơ bản của tập hợp có thứ tự đến phân tích source code và triển khai của Skip List, giúp bạn hiểu và nắm vững sâu hơn về Skip List trong triển khai bên dưới của tập hợp có thứ tự trong Redis: [Tại sao Redis dùng Skip List để triển khai tập hợp có thứ tự](https://javaguide.cn/database/redis/redis-skiplist.html). Nếu chỉ muốn lướt qua trước cấu trúc cơ bản, độ phức tạp và truy vấn phạm vi của Skip List, có thể xem [Tổng hợp câu hỏi phỏng vấn Skip List](https://javaguide.cn/cs-basics/data-structure/skip-list.html).

### Kịch bản ứng dụng của Set là gì?

`Set` trong Redis là một tập hợp không có thứ tự, các phần tử trong tập hợp không có thứ tự trước sau nhưng đều duy nhất, hơi giống `HashSet` trong Java.

Các kịch bản ứng dụng thường gặp của `Set` như sau:

- Kịch bản dữ liệu lưu trữ không được trùng lặp: thống kê UV của website (kịch bản có lượng dữ liệu khổng lồ thì `HyperLogLog` vẫn phù hợp hơn), like bài viết, like bài đăng động, v.v.
- Kịch bản cần lấy giao, hợp và hiệu của nhiều nguồn dữ liệu: bạn chung (giao), người theo dõi chung (giao), mối quan tâm chung (giao), gợi ý kết bạn (hiệu), gợi ý âm nhạc (hiệu), gợi ý kênh đăng ký (hiệu + giao), v.v.
- Kịch bản cần lấy ngẫu nhiên phần tử trong nguồn dữ liệu: hệ thống bốc thăm, gọi tên ngẫu nhiên, v.v.

### Dùng Set triển khai hệ thống bốc thăm như thế nào?

Nếu muốn dùng `Set` để triển khai một hệ thống bốc thăm đơn giản, chỉ cần dùng trực tiếp mấy lệnh dưới đây:

- `SADD key member1 member2 ...`: thêm một hoặc nhiều phần tử vào tập hợp chỉ định.
- `SPOP key count`: xóa ngẫu nhiên và lấy một hoặc nhiều phần tử trong tập hợp chỉ định, phù hợp với kịch bản không cho phép trúng thưởng trùng lặp.
- `SRANDMEMBER key count`: lấy ngẫu nhiên số lượng phần tử chỉ định trong tập hợp chỉ định, phù hợp với kịch bản cho phép trúng thưởng trùng lặp.

### Dùng Bitmap thống kê người dùng hoạt động như thế nào?

Bitmap lưu trữ các số nhị phân liên tục (0 và 1), thông qua Bitmap, chỉ cần một bit để biểu thị giá trị hoặc trạng thái tương ứng của một phần tử nào đó, key chính là bản thân phần tử tương ứng. Chúng ta biết 8 bit có thể tạo thành một byte, vì vậy bản thân Bitmap sẽ tiết kiệm rất lớn không gian lưu trữ.

Bạn có thể xem Bitmap như một mảng lưu các số nhị phân (0 và 1), chỉ số (index) của mỗi phần tử trong mảng gọi là offset (độ lệch).

![img](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220720194154133.png)

Nếu muốn dùng Bitmap để thống kê người dùng hoạt động, có thể dùng ngày (chính xác đến ngày) làm key, sau đó dùng ID người dùng làm offset, nếu trong ngày có hoạt động thì đặt thành 1.

Khởi tạo dữ liệu:

```bash
> SETBIT 20210308 1 1
(integer) 0
> SETBIT 20210308 2 1
(integer) 0
> SETBIT 20210309 1 1
(integer) 0
```

Thống kê tổng số người dùng hoạt động từ 20210308~20210309:

```bash
> BITOP and desk1 20210308 20210309
(integer) 1
> BITCOUNT desk1
(integer) 1
```

Thống kê số người dùng hoạt động online từ 20210308~20210309:

```bash
> BITOP or desk2 20210308 20210309
(integer) 1
> BITCOUNT desk2
(integer) 2
```

### HyperLogLog phù hợp với kịch bản nào?

HyperLogLog (HLL) là một cấu trúc dữ liệu xác suất rất khéo léo, nó chuyên giải quyết một loại bài toán big data rất hóc búa: trong dữ liệu khổng lồ, dùng Memory cực nhỏ để ước tính số lượng phần tử không trùng lặp trong một tập hợp, tức là cardinality (lực lượng) mà chúng ta thường nói.

Sự đánh đổi cốt lõi nhất mà HLL thực hiện là dùng một chút tổn thất về độ chính xác để đổi lấy việc tiết kiệm không gian Memory khổng lồ. Nó đưa ra không phải một con số chính xác 100%, mà là một giá trị gần đúng với sai số chuẩn rất nhỏ (mặc định trong Redis là 0.81%).

**Dựa trên sự đánh đổi cốt lõi này, HyperLogLog phù hợp nhất với các kịch bản có đặc điểm sau:**

1. **Lượng dữ liệu khổng lồ, nhạy cảm về Memory:** Đây là chiến trường chính của HLL. Ví dụ, cần thống kê số khách truy cập độc lập hằng ngày của một App có DAU (người dùng hoạt động hằng ngày) cấp trăm triệu. Nếu dùng Set truyền thống để lưu ID người dùng, một ID chiếm vài chục byte, hàng trăm triệu ID có thể cần vài GB thậm chí vài chục GB Memory, điều này không thể chấp nhận được trong nhiều kịch bản. Còn HLL, trong Redis chỉ cần cố định 12KB Memory, là có thể xử lý cardinality cấp con số thiên văn, đây là một ưu điểm mang tính đột phá.
2. **Yêu cầu về độ chính xác của kết quả không phải 100%:** Đây là tiền đề để dùng HLL. Ví dụ, product manager muốn biết UV (số khách truy cập độc lập) của một bài đăng hot là khoảng 10 triệu hay 10,1 triệu, sự khác biệt nhỏ này thường không ảnh hưởng đến quyết định kinh doanh. Nhưng nếu kịch bản là thống kê số giao dịch chính xác của một hệ thống giao dịch, thì HLL hoàn toàn không phù hợp, vì kịch bản tài chính yêu cầu chính xác 100%.

**Vì vậy, các kịch bản ứng dụng cụ thể của HyperLogLog rất rõ ràng:**

- **Thống kê UV (Unique Visitor) của website/App:** Ví dụ thống kê mỗi ngày có bao nhiêu IP hoặc ID người dùng khác nhau truy cập trang chủ.
- **Thống kê từ khóa của search engine:** Thống kê mỗi ngày có bao nhiêu người dùng khác nhau tìm kiếm một từ khóa nào đó.
- **Thống kê tương tác mạng xã hội:** Ví dụ thống kê một bài Weibo được bao nhiêu người dùng khác nhau chia sẻ lại.

Trong những kịch bản này, chúng ta quan tâm đến bậc độ lớn và xu hướng, chứ không phải sự khác biệt ở hàng đơn vị.

Cuối cùng, triển khai của Redis còn rất thông minh, bên trong nó sẽ dựa vào độ lớn của cardinality để tự động chuyển đổi giữa **ma trận thưa** (sparse, chiếm không gian nhỏ hơn) và **ma trận dày đặc** (dense, cố định 12KB), càng tối ưu thêm việc sử dụng Memory. Tóm lại, khi bạn cần đếm không trùng lặp trên dữ liệu khổng lồ, và có thể chấp nhận sai số nhỏ, HyperLogLog chính là lựa chọn duy nhất.

### Dùng HyperLogLog thống kê UV của trang như thế nào?

Dùng HyperLogLog thống kê UV của trang chủ yếu cần dùng hai lệnh dưới đây:

- `PFADD key element1 element2 ...`: thêm một hoặc nhiều phần tử vào HyperLogLog.
- `PFCOUNT key1 key2`: lấy số đếm duy nhất của một hoặc nhiều HyperLogLog.

1. Thêm ID của mỗi người dùng truy cập trang chỉ định vào `HyperLogLog`.

```bash
PFADD PAGE_1:UV USER1 USER2 ...... USERn
```

2. Thống kê UV của trang chỉ định.

```bash
PFCOUNT PAGE_1:UV
```

### Nếu muốn phán đoán một phần tử có không thuộc một tập hợp phần tử khổng lồ hay không, dùng kiểu dữ liệu gì?

Đây là kịch bản ứng dụng kinh điển của Bloom Filter. Bloom Filter có thể cho bạn biết một phần tử chắc chắn không tồn tại hoặc có thể tồn tại, nó cũng có hiệu suất không gian cực cao và một tỷ lệ dương tính giả nhất định, nhưng tuyệt đối không bỏ sót. Nghĩa là, Bloom Filter nói phần tử nào đó tồn tại, xác suất nhỏ sẽ là phán đoán sai. Bloom Filter nói phần tử nào đó không tồn tại, thì phần tử đó chắc chắn không tồn tại.

Sơ đồ nguyên lý đơn giản của Bloom Filter như sau:

![Sơ đồ nguyên lý đơn giản của Bloom Filter](https://oss.javaguide.cn/github/javaguide/cs-basics/algorithms/bloom-filter-simple-schematic-diagram.png)

Khi một chuỗi cần được thêm vào Bloom Filter, chuỗi này trước tiên được nhiều hàm hash tạo ra các giá trị hash khác nhau, sau đó đặt chỉ số tương ứng trong mảng bit thành 1 (khi khởi tạo mảng bit, tất cả các vị trí đều là 0). Khi lưu chuỗi giống nhau lần thứ hai, vì các vị trí tương ứng trước đó đã được đặt thành 1, nên dễ dàng biết giá trị này đã tồn tại (việc loại trùng rất thuận tiện).

Nếu chúng ta cần phán đoán một chuỗi nào đó có trong Bloom Filter hay không, chỉ cần thực hiện lại tính hash giống hệt trên chuỗi đã cho, sau khi có giá trị thì phán đoán xem mỗi phần tử trong mảng bit có đều là 1 không, nếu đều là 1, thì giá trị này có trong Bloom Filter, nếu tồn tại một giá trị không phải 1, thì phần tử đó không có trong Bloom Filter.

Về dương tính giả, khó xóa, cách dùng Guava và RedisBloom của Bloom Filter, có thể xem tiếp [Giải thích chi tiết Bloom Filter](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html).

## ⭐️Cơ chế Persistence của Redis (quan trọng)

Các vấn đề liên quan đến cơ chế Persistence của Redis (RDB Persistence, AOF Persistence, Persistence hỗn hợp RDB và AOF) khá nhiều, cũng khá quan trọng, vì vậy tôi đã tách riêng một bài viết để tổng hợp các kiến thức và vấn đề liên quan đến cơ chế Persistence của Redis: [Giải thích chi tiết cơ chế Persistence của Redis](https://javaguide.cn/database/redis/redis-persistence.html).

## ⭐️Mô hình thread của Redis (quan trọng)

Với các lệnh đọc ghi, Redis luôn là mô hình Single Thread. Tuy nhiên, từ phiên bản Redis 4.0 trở đi đã đưa thêm đa luồng để thực hiện một số thao tác xóa bất đồng bộ các cặp Key-Value lớn, từ phiên bản Redis 6.0 trở đi đã đưa thêm đa luồng để xử lý yêu cầu mạng (nâng cao hiệu năng đọc ghi IO mạng).

### Bạn có hiểu về mô hình Single Thread của Redis không?

**Redis thiết kế và phát triển một bộ mô hình xử lý sự kiện hiệu quả dựa trên mô hình Reactor** (mô hình thread của Netty cũng dựa trên mô hình Reactor, mô hình Reactor xứng đáng là nền tảng của IO hiệu năng cao), bộ mô hình xử lý sự kiện này tương ứng với file event handler (bộ xử lý sự kiện file) trong Redis. Do file event handler chạy theo cách Single Thread, nên chúng ta thường nói Redis là mô hình Single Thread.

Trong cuốn 《Redis 设计与实现》 (Thiết kế và triển khai Redis) có một đoạn giới thiệu về file event handler như sau, tôi thấy viết khá hay.

> Redis phát triển bộ xử lý sự kiện mạng của riêng mình dựa trên mô hình Reactor: bộ xử lý này được gọi là file event handler.
>
> - File event handler sử dụng chương trình I/O Multiplexing (ghép kênh) để đồng thời lắng nghe nhiều socket, và dựa trên tác vụ mà socket đang thực hiện để gắn các bộ xử lý sự kiện khác nhau cho socket.
> - Khi socket được lắng nghe sẵn sàng thực hiện các thao tác như accept (đáp ứng kết nối), read (đọc), write (ghi), close (đóng), sự kiện file tương ứng với thao tác sẽ được sinh ra, lúc này file event handler sẽ gọi bộ xử lý sự kiện đã gắn trước đó của socket để xử lý các sự kiện này.
>
> **Tuy file event handler chạy theo cách Single Thread, nhưng thông qua việc sử dụng chương trình I/O Multiplexing để lắng nghe nhiều socket**, file event handler vừa triển khai được mô hình giao tiếp mạng hiệu năng cao, vừa có thể kết nối tốt với các module khác cũng chạy theo cách Single Thread trong Redis server, điều này giữ được tính đơn giản của thiết kế Single Thread bên trong Redis.

**Đã là Single Thread, thì làm sao lắng nghe lượng lớn kết nối client?**

Redis thông qua **chương trình IO Multiplexing** để lắng nghe lượng lớn kết nối từ client (hay nói cách khác là lắng nghe nhiều socket), nó sẽ đăng ký các sự kiện và kiểu quan tâm (đọc, ghi) vào kernel và lắng nghe xem mỗi sự kiện có xảy ra hay không.

Lợi ích của cách này rất rõ ràng: **việc sử dụng kỹ thuật I/O Multiplexing khiến Redis không cần tạo thêm thread thừa để lắng nghe lượng lớn kết nối của client, giảm tiêu hao tài nguyên** (rất giống component `Selector` trong NIO).

File event handler chủ yếu bao gồm 4 phần:

- Nhiều socket (kết nối client)
- Chương trình IO Multiplexing (then chốt để hỗ trợ nhiều kết nối client)
- Bộ phân phát sự kiện file (gắn socket với bộ xử lý sự kiện tương ứng)
- Bộ xử lý sự kiện (bộ xử lý đáp ứng kết nối, bộ xử lý yêu cầu lệnh, bộ xử lý phản hồi lệnh)

![File event handler](https://oss.javaguide.cn/github/javaguide/database/redis/redis-event-handler.png)

### Tại sao trước Redis 6.0 không dùng đa luồng?

Tuy nói Redis là mô hình Single Thread, nhưng thực tế, **từ phiên bản Redis 4.0 trở đi đã thêm hỗ trợ cho đa luồng.**

Tuy nhiên, đa luồng mà Redis 4.0 thêm vào chủ yếu nhắm đến một số lệnh thao tác xóa các cặp Key-Value lớn, sử dụng các lệnh này sẽ dùng các thread khác ngoài main thread để "xử lý bất đồng bộ", từ đó giảm ảnh hưởng lên main thread.

Vì vậy, từ Redis 4.0 trở đi đã thêm một số lệnh bất đồng bộ:

- `UNLINK`: có thể xem là phiên bản bất đồng bộ của lệnh `DEL`.
- `FLUSHALL ASYNC`: dùng để xóa tất cả key của tất cả database, không giới hạn ở database đang `SELECT`.
- `FLUSHDB ASYNC`: dùng để xóa tất cả key trong database đang `SELECT`.

![redis4.0 more thread](https://oss.javaguide.cn/github/javaguide/database/redis/redis4.0-more-thread.png)

Nhìn chung, cho đến trước Redis 6.0, các thao tác chính của Redis vẫn được xử lý bằng Single Thread.

**Vậy tại sao trước Redis 6.0 không dùng đa luồng?** Tôi cho rằng nguyên nhân chính có 3 điểm:

- Lập trình Single Thread dễ dàng và dễ bảo trì hơn;
- Nút thắt hiệu năng của Redis không nằm ở CPU, chủ yếu ở Memory và mạng;
- Đa luồng sẽ tồn tại các vấn đề như deadlock, chuyển đổi ngữ cảnh thread, thậm chí ảnh hưởng đến hiệu năng.

Đọc thêm: [Tại sao Redis chọn mô hình Single Thread?](https://draveness.me/whys-the-design-redis-single-thread/).

### Tại sao từ Redis 6.0 trở đi lại đưa vào đa luồng?

**Redis 6.0 đưa vào đa luồng chủ yếu để nâng cao hiệu năng đọc ghi IO mạng**, vì đây được xem là một nút thắt hiệu năng trong Redis (nút thắt của Redis chủ yếu bị giới hạn bởi Memory và mạng).

Tuy Redis 6.0 đưa vào đa luồng, nhưng đa luồng của Redis chỉ được dùng cho các thao tác tốn thời gian như đọc ghi dữ liệu mạng, việc thực thi lệnh vẫn là Single Thread thực thi tuần tự. Vì vậy, bạn cũng không cần lo lắng về vấn đề thread safety (an toàn luồng).

Đa luồng của Redis 6.0 mặc định bị vô hiệu hóa, chỉ dùng main thread. Nếu cần bật thì phải đặt số IO thread > 1, cần sửa file cấu hình redis `redis.conf`:

```bash
io-threads 4 #nếu đặt 1 thì chỉ bật main thread, trang chủ khuyến nghị máy 4 nhân nên đặt 2 hoặc 3 thread, máy 8 nhân khuyến nghị đặt 6 thread
```

Ngoài ra:

- Số lượng io-threads một khi đã đặt, không thể thay đổi động thông qua config.
- Khi đã đặt ssl, io-threads sẽ không hoạt động.

Sau khi bật đa luồng, mặc định chỉ dùng đa luồng cho IO writes (ghi), tức gửi dữ liệu cho client, nếu cần bật đa luồng cho IO reads (đọc), cũng cần sửa file cấu hình redis `redis.conf`:

```bash
io-threads-do-reads yes
```

Nhưng theo mô tả của trang chủ, bật đa luồng cho đọc không cải thiện được nhiều, vì vậy thông thường không khuyến nghị bật.

Đọc thêm:

- [Tính năng mới Redis 6.0 - 13 câu hỏi liên hoàn về đa luồng!](https://mp.weixin.qq.com/s/FZu3acwK6zrCBZQ_3HoUgw)
- [Giải mã toàn diện mô hình mạng đa luồng của Redis](https://segmentfault.com/a/1190000039223696) (khuyến nghị)

### Bạn có hiểu về background thread của Redis không?

Tuy chúng ta thường nói Redis là mô hình Single Thread (logic chính được hoàn thành bằng Single Thread), nhưng thực tế còn có một số background thread (luồng nền) dùng để thực hiện các thao tác tốn thời gian:

- Thông qua background thread `bio_close_file` để giải phóng tài nguyên file tạm thời sinh ra trong các quá trình như AOF / RDB.
- Thông qua background thread `bio_aof_fsync` gọi hàm `fsync` để buộc ghi dữ liệu chưa được đồng bộ từ buffer của kernel hệ thống xuống đĩa (file AOF).
- Thông qua background thread `bio_lazy_free` để giải phóng không gian Memory mà các đối tượng lớn (đã xóa) chiếm dụng.

Trong file `bio.h` có định nghĩa (phiên bản Redis 6.0, địa chỉ source code: <https://github.com/redis/redis/blob/6.0/src/bio.h>):

```java
#ifndef __BIO_H
#define __BIO_H

/* Exported API */
void bioInit(void);
void bioCreateBackgroundJob(int type, void *arg1, void *arg2, void *arg3);
unsigned long long bioPendingJobsOfType(int type);
unsigned long long bioWaitStepOfType(int type);
time_t bioOlderJobOfType(int type);
void bioKillThreads(void);

/* Background job opcodes */
#define BIO_CLOSE_FILE    0 /* Deferred close(2) syscall. */
#define BIO_AOF_FSYNC     1 /* Deferred AOF fsync. */
#define BIO_LAZY_FREE     2 /* Deferred objects freeing. */
#define BIO_NUM_OPS       3

#endif
```

Về giới thiệu chi tiết background thread của Redis, có thể xem bài viết [Redis 6.0 có những background thread nào?](https://juejin.cn/post/7102780434739626014).

## ⭐️Quản lý Memory của Redis

### Việc đặt thời gian Expire cho dữ liệu Cache trong Redis có tác dụng gì?

Thông thường, khi lưu dữ liệu Cache chúng ta đều đặt một thời gian Expire (hết hạn). Tại sao vậy?

Memory là hữu hạn và quý giá, nếu không đặt thời gian Expire cho dữ liệu Cache, thì mức chiếm dụng Memory sẽ tăng liên tục, cuối cùng có thể dẫn đến vấn đề OOM. Thông qua việc đặt thời gian Expire hợp lý, Redis sẽ tự động xóa dữ liệu tạm thời không cần đến, nhường chỗ cho dữ liệu Cache mới.

Redis có sẵn chức năng đặt thời gian Expire cho dữ liệu Cache, ví dụ:

```bash
127.0.0.1:6379> expire key 60 # dữ liệu sẽ hết hạn sau 60s
(integer) 1
127.0.0.1:6379> setex key 60 value # dữ liệu sẽ hết hạn sau 60s (setex:[set] + [ex]pire)
OK
127.0.0.1:6379> ttl key # xem dữ liệu còn bao lâu nữa thì hết hạn
(integer) 56
```

Chú ý ⚠️: Trong Redis, ngoài kiểu chuỗi có lệnh riêng `setex` để đặt thời gian Expire, các phương pháp khác đều cần dựa vào lệnh `expire` để đặt thời gian Expire. Ngoài ra, lệnh `persist` có thể xóa bỏ thời gian Expire của một key.

**Thời gian Expire ngoài việc giúp giảm tiêu hao Memory, còn tác dụng nào khác không?**

Rất nhiều khi, kịch bản nghiệp vụ của chúng ta cần dữ liệu nào đó chỉ tồn tại trong một khoảng thời gian, ví dụ mã xác minh SMS có thể chỉ có hiệu lực trong 1 phút, Token đăng nhập của người dùng có thể chỉ có hiệu lực trong 1 ngày.

Nếu dùng cơ sở dữ liệu truyền thống để xử lý, thường là phải tự phán đoán hết hạn, như vậy phiền phức hơn và hiệu năng kém hơn nhiều.

### Redis phán đoán dữ liệu đã hết hạn như thế nào?

Redis thông qua một thứ gọi là expire dictionary (từ điển hết hạn, có thể xem như bảng hash) để lưu thời gian hết hạn của dữ liệu. Key của expire dictionary trỏ đến một key nào đó trong Redis database, value của expire dictionary là một số nguyên kiểu long long, số nguyên này lưu thời gian hết hạn của key trong database mà nó trỏ đến (UNIX timestamp với độ chính xác mili giây).

![Expire dictionary của Redis](https://oss.javaguide.cn/github/javaguide/database/redis/redis-expired-dictionary.png)

Expire dictionary được lưu trong cấu trúc redisDb:

```c
typedef struct redisDb {
    ...

    dict *dict;     //không gian key của database, lưu tất cả cặp Key-Value trong database
    dict *expires   // expire dictionary, lưu thời gian hết hạn của key
    ...
} redisDb;
```

Khi truy vấn một key, Redis trước tiên kiểm tra key đó có tồn tại trong expire dictionary hay không (độ phức tạp thời gian là O(1)), nếu không có thì trả về trực tiếp, nếu có thì cần phán đoán xem key này đã hết hạn chưa, hết hạn thì xóa key rồi trả về null.

### Bạn có biết về chiến lược xóa key hết hạn của Redis không?

Giả sử bạn đặt một loạt key chỉ sống được 1 phút, vậy sau 1 phút, Redis xóa loạt key này như thế nào?

Các chiến lược xóa dữ liệu hết hạn thường dùng gồm mấy loại dưới đây:

1. **Lazy Deletion (xóa trì hoãn)**: chỉ kiểm tra hết hạn khi lấy/truy vấn key. Cách này thân thiện nhất với CPU, nhưng có thể khiến quá nhiều key hết hạn không được xóa.
2. **Periodic Deletion (xóa định kỳ)**: định kỳ rút ngẫu nhiên một loạt key từ các key đã đặt thời gian hết hạn, sau đó kiểm tra từng key xem đã hết hạn chưa, hết hạn thì xóa key. So với Lazy Deletion, Periodic Deletion thân thiện hơn với Memory, nhưng không thân thiện lắm với CPU.
3. **Delayed Queue (hàng đợi trì hoãn)**: đưa các key đã đặt thời gian hết hạn vào một delayed queue, đến hạn thì xóa key. Cách này đảm bảo mỗi key hết hạn đều được xóa, nhưng duy trì delayed queue quá phiền phức, bản thân hàng đợi cũng chiếm tài nguyên.
4. **Scheduled Deletion (xóa theo lịch)**: mỗi key đã đặt thời gian hết hạn sẽ bị xóa ngay khi đến thời điểm đã đặt. Phương pháp này đảm bảo trong Memory không có key hết hạn, nhưng áp lực lên CPU lớn nhất, vì cần đặt một timer cho mỗi key.

**Redis áp dụng chiến lược xóa nào?**

Redis áp dụng chiến lược kết hợp **Periodic Deletion + Lazy Deletion**, đây cũng là lựa chọn của phần lớn các framework Cache. Periodic Deletion thân thiện hơn với Memory, Lazy Deletion thân thiện hơn với CPU. Mỗi loại có ưu điểm riêng, kết hợp sử dụng vừa đảm bảo thân thiện với CPU, vừa đảm bảo thân thiện với Memory.

Dưới đây chúng ta sẽ giới thiệu chi tiết xem Periodic Deletion trong Redis cụ thể được thực hiện như thế nào.

Quá trình Periodic Deletion của Redis là ngẫu nhiên (định kỳ rút ngẫu nhiên một loạt key từ các key đã đặt thời gian hết hạn), nên không đảm bảo tất cả key hết hạn đều được xóa ngay lập tức. Điều này cũng giải thích tại sao có key đã hết hạn nhưng chưa bị xóa. Hơn nữa, bên dưới Redis sẽ giới hạn thời gian và tần suất thực hiện thao tác xóa để giảm ảnh hưởng của thao tác xóa lên thời gian CPU.

Ngoài ra, Periodic Deletion còn chịu ảnh hưởng của thời gian thực thi và tỷ lệ key hết hạn:

- Nếu thời gian thực thi đã vượt ngưỡng, thì ngắt vòng lặp Periodic Deletion lần này, để tránh dùng quá nhiều thời gian CPU.
- Nếu tỷ lệ key hết hạn trong loạt này vượt quá một tỷ lệ nhất định, sẽ lặp lại quy trình xóa này, để dọn dẹp key hết hạn tích cực hơn. Tương ứng, nếu tỷ lệ key hết hạn thấp hơn tỷ lệ này, sẽ ngắt vòng lặp Periodic Deletion lần này, tránh làm quá nhiều việc mà thu hồi được rất ít Memory.

Ngưỡng thời gian thực thi của phiên bản Redis 7.2 là **25ms**, giá trị đặt cho tỷ lệ key hết hạn là **10%**.

```c
#define ACTIVE_EXPIRE_CYCLE_FAST_DURATION 1000 /* Microseconds. */
#define ACTIVE_EXPIRE_CYCLE_SLOW_TIME_PERC 25 /* Max % of CPU to use. */
#define ACTIVE_EXPIRE_CYCLE_ACCEPTABLE_STALE 10 /* % of stale keys after which
                                                   we do extra efforts. */
```

**Số lượng rút ngẫu nhiên mỗi lần là bao nhiêu?**

Trong `expire.c` có định nghĩa số lượng rút ngẫu nhiên mỗi lần, phiên bản Redis 7.2 là 20, nghĩa là mỗi lần sẽ chọn ngẫu nhiên 20 key đã đặt thời gian hết hạn để phán đoán xem đã hết hạn chưa.

```c
#define ACTIVE_EXPIRE_CYCLE_KEYS_PER_LOOP 20 /* Keys for each DB loop. */
```

**Làm sao kiểm soát tần suất thực hiện Periodic Deletion?**

Trong Redis, tần suất Periodic Deletion được kiểm soát bởi tham số **hz**. hz mặc định là 10, nghĩa là thực thi 10 lần mỗi giây, tức mỗi giây thực hiện 10 lần thử để tìm và xóa key hết hạn.

Phạm vi giá trị của hz là 1~500. Tăng giá trị tham số hz sẽ nâng cao tần suất Periodic Deletion. Nếu bạn muốn thực thi Periodic Deletion thường xuyên hơn, có thể tăng giá trị hz cho phù hợp, nhưng điều này sẽ tăng mức sử dụng CPU. Theo khuyến nghị chính thức của Redis, giá trị hz không khuyến nghị vượt quá 100, với phần lớn người dùng thì giá trị mặc định 10 là đủ.

Dưới đây là chú thích chính thức của tham số hz, tôi đã dịch các thông tin quan trọng trong đó (phiên bản Redis 7.2).

![Chú thích về hz trong redis.conf](https://oss.javaguide.cn/github/javaguide/database/redis/redis.conf-hz.png)

Một tham số tương tự là **dynamic-hz**, khi tham số này được bật, Redis sẽ tính động một giá trị dựa trên hz. Redis cung cấp và mặc định bật khả năng sử dụng giá trị hz thích ứng (adaptive),

Hai tham số này đều nằm trong file cấu hình Redis `redis.conf`:

```properties
# mặc định là 10
hz 10
# mặc định bật
dynamic-hz yes
```

Nói thêm, ngoài tác vụ định kỳ xóa key hết hạn, còn có một số tác vụ định kỳ khác như đóng kết nối client đã timeout, cập nhật thông tin thống kê, tần suất thực thi của các tác vụ định kỳ này cũng được quyết định bởi tham số hz.

**Tại sao Periodic Deletion không xóa tất cả key hết hạn?**

Như vậy sẽ ảnh hưởng quá lớn đến hiệu năng. Nếu số lượng key của chúng ta rất lớn, việc duyệt qua từng key để kiểm tra rất tốn thời gian, sẽ ảnh hưởng nghiêm trọng đến hiệu năng. Mục đích Redis thiết kế chiến lược này là để cân bằng giữa Memory và hiệu năng.

**Tại sao sau khi key hết hạn không xóa nó ngay lập tức? Như vậy chẳng phải lãng phí rất nhiều không gian Memory sao?**

Vì khá khó thực hiện, hay nói cách khác chi phí của cách xóa này quá cao. Giả sử chúng ta dùng delayed queue làm chiến lược xóa, sẽ tồn tại những vấn đề dưới đây:

1. Chi phí của bản thân hàng đợi có thể rất lớn: khi key nhiều, một delayed queue có thể không chứa nổi.
2. Duy trì delayed queue quá phiền phức: sửa thời gian hết hạn của key là cần điều chỉnh vị trí của nó trong delayed queue, và còn cần đưa thêm cơ chế kiểm soát đồng thời.

### Làm gì khi lượng lớn key hết hạn cùng lúc?

Khi trong Redis có lượng lớn key hết hạn cùng một thời điểm, có thể dẫn đến các vấn đề sau:

- **Tăng độ trễ yêu cầu**: Redis khi xử lý key hết hạn cần tiêu hao tài nguyên CPU, nếu số lượng key hết hạn lớn, sẽ khiến mức chiếm dụng CPU của Redis instance tăng cao, từ đó ảnh hưởng tốc độ xử lý các yêu cầu khác, gây tăng độ trễ.
- **Chiếm dụng Memory quá cao**: Key hết hạn tuy đã mất hiệu lực, nhưng trước khi Redis thực sự xóa chúng, vẫn chiếm không gian Memory. Nếu key hết hạn không được dọn kịp thời, có thể dẫn đến chiếm dụng Memory quá cao, thậm chí gây tràn Memory.

Để tránh những vấn đề này, có thể áp dụng các giải pháp sau:

1. **Cố gắng tránh key hết hạn cùng lúc**: khi đặt thời gian hết hạn cho key hãy đặt ngẫu nhiên một chút.
2. **Bật cơ chế lazy free**: sửa file cấu hình `redis.conf`, đặt tham số `lazyfree-lazy-expire` thành `yes`, là có thể bật cơ chế lazy free. Sau khi bật cơ chế lazy free, Redis sẽ xóa key hết hạn bất đồng bộ ở background, không chặn main thread chạy, từ đó giảm ảnh hưởng lên hiệu năng của Redis.

### Bạn có biết về chiến lược Eviction Memory của Redis không?

> Câu hỏi liên quan: MySQL có 2000w dữ liệu, Redis chỉ lưu 20w dữ liệu, làm sao đảm bảo dữ liệu trong Redis đều là dữ liệu hot?

Chiến lược Eviction (loại bỏ) Memory của Redis chỉ được kích hoạt khi Memory đang chạy đạt đến ngưỡng Memory tối đa đã cấu hình, ngưỡng này được định nghĩa bởi tham số `maxmemory` trong `redis.conf`. Trên hệ điều hành 64 bit, `maxmemory` mặc định là 0, nghĩa là không giới hạn kích thước Memory. Trên hệ điều hành 32 bit, giá trị Memory tối đa mặc định là 3GB.

Bạn có thể dùng lệnh `config get maxmemory` để xem giá trị của `maxmemory`.

```bash
> config get maxmemory
maxmemory
0
```

Redis cung cấp 6 chiến lược Eviction Memory:

1. **volatile-lru (least recently used)**: chọn dữ liệu ít được sử dụng gần đây nhất từ tập dữ liệu đã đặt thời gian hết hạn (`server.db[i].expires`) để loại bỏ.
2. **volatile-ttl**: chọn dữ liệu sắp hết hạn từ tập dữ liệu đã đặt thời gian hết hạn (`server.db[i].expires`) để loại bỏ.
3. **volatile-random**: chọn dữ liệu bất kỳ từ tập dữ liệu đã đặt thời gian hết hạn (`server.db[i].expires`) để loại bỏ.
4. **allkeys-lru (least recently used)**: loại bỏ dữ liệu ít được sử dụng gần đây nhất từ tập dữ liệu (`server.db[i].dict`).
5. **allkeys-random**: chọn dữ liệu bất kỳ từ tập dữ liệu (`server.db[i].dict`) để loại bỏ.
6. **no-eviction** (chiến lược Eviction Memory mặc định): cấm Eviction dữ liệu, khi Memory không đủ để chứa dữ liệu ghi mới, thao tác ghi mới sẽ báo lỗi.

Từ phiên bản 4.0 trở đi thêm hai loại dưới đây:

7. **volatile-lfu (least frequently used)**: chọn dữ liệu ít được sử dụng thường xuyên nhất từ tập dữ liệu đã đặt thời gian hết hạn (`server.db[i].expires`) để loại bỏ.
8. **allkeys-lfu (least frequently used)**: loại bỏ dữ liệu ít được sử dụng thường xuyên nhất từ tập dữ liệu (`server.db[i].dict`).

`allkeys-xxx` nghĩa là loại bỏ dữ liệu từ tất cả các cặp Key-Value, còn `volatile-xxx` nghĩa là loại bỏ dữ liệu từ các cặp Key-Value đã đặt thời gian hết hạn.

Trong `config.c` có định nghĩa mảng enum của các chiến lược Eviction Memory:

```c
configEnum maxmemory_policy_enum[] = {
    {"volatile-lru", MAXMEMORY_VOLATILE_LRU},
    {"volatile-lfu", MAXMEMORY_VOLATILE_LFU},
    {"volatile-random",MAXMEMORY_VOLATILE_RANDOM},
    {"volatile-ttl",MAXMEMORY_VOLATILE_TTL},
    {"allkeys-lru",MAXMEMORY_ALLKEYS_LRU},
    {"allkeys-lfu",MAXMEMORY_ALLKEYS_LFU},
    {"allkeys-random",MAXMEMORY_ALLKEYS_RANDOM},
    {"noeviction",MAXMEMORY_NO_EVICTION},
    {NULL, 0}
};
```

Bạn có thể dùng lệnh `config get maxmemory-policy` để xem chiến lược Eviction Memory hiện tại của Redis.

```bash
> config get maxmemory-policy
maxmemory-policy
noeviction
```

Có thể dùng lệnh `config set maxmemory-policy chiến lược Eviction Memory` để sửa chiến lược Eviction Memory, có hiệu lực ngay, nhưng cách này sẽ mất hiệu lực sau khi khởi động lại Redis. Sửa tham số `maxmemory-policy` trong `redis.conf` sẽ không bị mất hiệu lực do khởi động lại, tuy nhiên, cần khởi động lại thì thay đổi mới có hiệu lực.

```properties
maxmemory-policy noeviction
```

Về giải thích chi tiết các chiến lược Eviction, có thể tham khảo tài liệu chính thức của Redis: <https://redis.io/docs/reference/eviction/>.

## Tham khảo

- 《Redis 开发与运维》 (Phát triển và vận hành Redis)
- 《Redis 设计与实现》 (Thiết kế và triển khai Redis)
- 《Redis 核心原理与实战》 (Nguyên lý cốt lõi và thực chiến Redis)
- Sổ tay lệnh Redis: <https://www.redis.com.cn/commands.html>
- Hướng dẫn sử dụng RedisSearch cuối cùng, bạn xứng đáng sở hữu!: <https://mp.weixin.qq.com/s/FA4XVAXJksTOHUXMsayy2g>
- WHY Redis choose single thread (vs multi threads): [https://medium.com/@jychen7/sharing-redis-single-thread-vs-multi-threads-5870bd44d153](https://medium.com/@jychen7/sharing-redis-single-thread-vs-multi-threads-5870bd44d153)

<!-- @include: @article-footer.snippet.md -->
