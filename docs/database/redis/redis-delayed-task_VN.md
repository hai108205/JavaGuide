---
title: Hiện thực Delayed Task dựa trên Redis như thế nào?
description: "Giải thích chi tiết hai phương án hiện thực Delayed Task dựa trên Redis: lắng nghe sự kiện hết hạn và Delayed Queue của Redisson, phân tích ưu nhược điểm, vấn đề độ tin cậy và kịch bản áp dụng của từng phương án."
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis Delayed Task,Delayed Queue,Lắng nghe sự kiện hết hạn,Redisson DelayedQueue,Đơn hàng hết hạn,Scheduled Task
---

Chức năng hiện thực Delayed Task (tác vụ trì hoãn) dựa trên Redis chỉ có hai phương án sau:

1. Lắng nghe sự kiện hết hạn của Redis
2. Delayed Queue tích hợp sẵn của Redisson

Khi phỏng vấn, bạn có thể nói trước rằng mình đã cân nhắc cả hai phương án này, nhưng cuối cùng phát hiện phương án lắng nghe sự kiện hết hạn của Redis tồn tại rất nhiều vấn đề, vì vậy cuối cùng bạn đã chọn phương án DelayedQueue tích hợp sẵn của Redisson.

Lúc này người phỏng vấn có thể hỏi thêm một số câu hỏi liên quan, chúng ta sẽ đề cập ở phần sau, chuẩn bị trước là được.

Ngoài ra, ngoài những vấn đề được giới thiệu dưới đây, các vấn đề thường gặp liên quan đến Redis bạn nên ôn lại hết một lượt, không loại trừ khả năng người phỏng vấn sẽ hỏi thêm một số vấn đề khác về Redis.

### Nguyên lý hiện thực chức năng Delayed Task bằng lắng nghe sự kiện hết hạn của Redis?

Redis 2.0 giới thiệu chức năng Publish/Subscribe (pub/sub). Trong pub/sub, có một khái niệm gọi là **channel (kênh)**, khá giống với khái niệm **topic (chủ đề)** trong Message Queue.

pub/sub liên quan đến hai vai trò: Publisher (bên phát) và Subscriber (bên đăng ký, còn gọi là Consumer):

- Publisher gửi message đến channel chỉ định thông qua `PUBLISH`.
- Subscriber đăng ký channel mà nó quan tâm thông qua `SUBSCRIBE`. Hơn nữa, Subscriber có thể đăng ký một hoặc nhiều channel.

![Chức năng Publish/Subscribe (pub/sub) của Redis](https://oss.javaguide.cn/github/javaguide/database/redis/redis-pub-sub.png)

Trong mô hình pub/sub, Producer cần chỉ định message gửi đến channel nào, còn Consumer đăng ký channel tương ứng để nhận message.

Trong Redis có rất nhiều channel mặc định, các channel này do chính Redis gửi message đến, chứ không phải code do chúng ta tự viết. Trong đó, `__keyevent@0__:expired` là một channel mặc định, chịu trách nhiệm lắng nghe sự kiện hết hạn của key. Nghĩa là, khi một key hết hạn, Redis sẽ publish một sự kiện key hết hạn vào channel `__keyevent@<db>__:expired`.

Chúng ta chỉ cần lắng nghe channel này là có thể lấy được message của key hết hạn, từ đó hiện thực chức năng Delayed Task.

Chức năng này được Redis chính thức gọi là **keyspace notifications**, tác dụng là giám sát thời gian thực sự thay đổi của key và value trong Redis.

### Chức năng Delayed Task hiện thực bằng lắng nghe sự kiện hết hạn của Redis có những khiếm khuyết gì?

**1. Tính kịp thời kém**

Một đoạn giới thiệu trong tài liệu chính thức đã giải thích nguyên nhân tính kịp thời kém, địa chỉ: <https://redis.io/docs/manual/keyspace-notifications/#timing-of-expired-events> .

![Sự kiện hết hạn của Redis](https://oss.javaguide.cn/github/javaguide/database/redis/redis-timing-of-expired-events.png)

Ý chính của đoạn này là: message sự kiện hết hạn được publish khi máy chủ Redis xóa key, chứ không phải ngay sau khi key hết hạn là publish ngay.

Chúng ta biết rằng có hai chiến lược xóa dữ liệu hết hạn thường dùng:

1. **Xóa lười (Lazy Expiration)**: chỉ kiểm tra hết hạn dữ liệu khi lấy key. Cách này thân thiện nhất với CPU, nhưng có thể khiến quá nhiều key hết hạn không được xóa.
2. **Xóa định kỳ (Periodic Expiration)**: cách một khoảng thời gian, trích ra một loạt key để thực hiện thao tác xóa key hết hạn. Hơn nữa, tầng dưới của Redis sẽ giới hạn thời gian và tần suất thực thi thao tác xóa để giảm ảnh hưởng của thao tác xóa đến thời gian CPU.

Xóa định kỳ thân thiện hơn với bộ nhớ, xóa lười thân thiện hơn với CPU. Mỗi cách đều có ưu điểm riêng, nên Redis áp dụng **xóa định kỳ + xóa lười**.

Vì vậy, sẽ tồn tại trường hợp chúng ta đã đặt thời gian hết hạn cho key, nhưng đến thời điểm chỉ định key vẫn chưa bị xóa, do đó sự kiện hết hạn không được publish.

**2. Mất message**

Message trong mô hình pub/sub của Redis không hỗ trợ Persistence, điều này khác với Message Queue. Trong mô hình pub/sub của Redis, Publisher gửi message đến channel chỉ định, Subscriber lắng nghe channel tương ứng để nhận message. Khi không có Subscriber, message sẽ bị bỏ trực tiếp, Redis không lưu message đó.

**3. Tiêu thụ message trùng lặp khi có nhiều instance dịch vụ**

Mô hình pub/sub của Redis hiện tại chỉ có chế độ broadcast, nghĩa là khi Producer publish một message đến channel cụ thể, tất cả Consumer đăng ký channel liên quan đều nhận được message đó.

Lúc này, chúng ta cần chú ý vấn đề nhiều instance dịch vụ xử lý trùng lặp message, điều này sẽ làm tăng khối lượng phát triển code và độ khó bảo trì.

### Nguyên lý Delayed Queue của Redisson là gì? Có ưu điểm gì?

Redisson là một Redis client mã nguồn mở dành cho ngôn ngữ Java, cung cấp rất nhiều chức năng dùng được ngay, ví dụ nhiều hiện thực Distributed Lock, Delayed Queue.

Chúng ta có thể dựa vào Delayed Queue RDelayedQueue tích hợp sẵn của Redisson để hiện thực chức năng Delayed Task.

Delayed Queue RDelayedQueue của Redisson được hiện thực dựa trên SortedSet của Redis. SortedSet là một tập hợp có thứ tự, mỗi phần tử trong đó đều có thể đặt một score, đại diện cho trọng số của phần tử đó. Redisson lợi dụng đặc tính này, chèn các task cần thực thi trì hoãn vào SortedSet, và đặt thời gian hết hạn tương ứng của chúng làm score.

Redisson định kỳ dùng lệnh `zrangebyscore` để quét các phần tử đã hết hạn trong SortedSet, sau đó xóa các phần tử hết hạn này khỏi SortedSet, và đưa chúng vào danh sách message sẵn sàng (ready message list). Danh sách message sẵn sàng là một Blocking Queue, khi có message đi vào sẽ được Consumer lắng nghe thấy. Cách này tránh việc Consumer phải polling toàn bộ SortedSet, nâng cao hiệu quả thực thi.

So với chức năng Delayed Task hiện thực bằng lắng nghe sự kiện hết hạn của Redis, cách này có những ưu điểm sau:

1. **Giảm khả năng mất message**: message trong DelayedQueue sẽ được Persistence, ngay cả khi Redis crash, theo cơ chế Persistence, cũng chỉ có thể mất một chút message, ảnh hưởng không lớn. Tất nhiên, bạn cũng có thể dùng phương pháp quét cơ sở dữ liệu làm cơ chế bù đắp.
2. **Message không tồn tại vấn đề tiêu thụ trùng lặp**: mỗi client đều lấy task từ cùng một queue mục tiêu, không tồn tại vấn đề tiêu thụ trùng lặp.

So với Delayed Queue tích hợp sẵn của Redisson, Message Queue có thể thông qua việc đảm bảo độ tin cậy của tiêu thụ message, điều khiển số lượng Producer và Consumer của message... để đạt được throughput cao hơn và độ tin cậy mạnh hơn, trong dự án thực tế phương án Delayed Message của Message Queue là lựa chọn hàng đầu.
