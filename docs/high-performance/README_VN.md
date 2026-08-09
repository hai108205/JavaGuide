---

title: Hệ thống kiến thức về hệ thống hiệu năng cao - CDN, cân bằng tải, tối ưu cơ sở dữ liệu, bộ nhớ đệm và hàng đợi thông điệp
description: Lộ trình học tập và ôn phỏng vấn về hệ thống hiệu năng cao, bao gồm CDN, cân bằng tải, tách đọc/ghi, phân tách cơ sở dữ liệu và bảng, phân tách dữ liệu nóng/lạnh, phân trang sâu, tối ưu SQL, hàng đợi thông điệp và các hệ thống MQ phổ biến.
category: Hiệu năng cao
tag:

* Hiệu năng cao
* Thiết kế hệ thống
* Phỏng vấn Backend
  sitemap:
  changefreq: weekly
  priority: 0.95
  head:
* * meta
  * name: keywords
    content: hệ thống hiệu năng cao,thiết kế hệ thống hiệu năng cao,câu hỏi phỏng vấn hệ thống hiệu năng cao,CDN,cân bằng tải,tách đọc ghi,phân tách cơ sở dữ liệu và bảng,phân tách dữ liệu nóng lạnh,phân trang sâu,tối ưu SQL,hàng đợi thông điệp,Kafka,RocketMQ,RabbitMQ,Disruptor,phỏng vấn Backend

---

## Tổng quan

**Hệ thống kiến thức về hệ thống hiệu năng cao** này dành cho việc học Backend, thiết kế hệ thống và ôn tập phỏng vấn. Nội dung tập trung vào các bài viết về hiệu năng cao trên website, xoay quanh các mục tiêu: **giảm độ trễ, tăng thông lượng, điều tiết lưu lượng, giảm áp lực lên cơ sở dữ liệu và tối ưu đường đi của dữ liệu**.

Nếu bạn có ít thời gian, nên đọc trước [Tổng hợp câu hỏi phỏng vấn về thiết kế hệ thống hiệu năng cao](./high-performance-interview-questions.md) để nhanh chóng nắm được danh sách các vấn đề thường gặp. Nếu muốn xây dựng nền tảng một cách có hệ thống, bạn có thể học theo thứ tự được đề xuất bên dưới.

Khi học phần này, không nên chỉ ghi nhớ tên các giải pháp như “thêm cache, thêm MQ, phân tách cơ sở dữ liệu và bảng”. Tối ưu hiệu năng thực tế giống một bài toán **phân tích toàn bộ chuỗi xử lý** hơn: request đi từ phía người dùng, qua CDN, cân bằng tải, dịch vụ ứng dụng, cache, cơ sở dữ liệu và hàng đợi thông điệp; bất kỳ khâu nào cũng có thể trở thành nút thắt cổ chai.

Chỉ khi có thể giải thích rõ **nút thắt nằm ở đâu, tại sao chọn giải pháp đó và giải pháp sẽ phát sinh những vấn đề mới nào**, bạn mới thực sự nắm vững kiến thức.

## Đối tượng phù hợp

* Các lập trình viên Backend đang học một cách có hệ thống về thiết kế hệ thống hiệu năng cao.
* Những người đang chuẩn bị phỏng vấn Backend cho chương trình tuyển dụng sinh viên mới tốt nghiệp, tuyển dụng có kinh nghiệm hoặc các công ty công nghệ lớn.
* Các kỹ sư muốn bổ sung năng lực thực tế về CDN, cân bằng tải, tối ưu cơ sở dữ liệu, hàng đợi thông điệp và các lĩnh vực liên quan.
* Những người đã gặp các vấn đề như SQL chậm, phân trang sâu, lưu lượng truy cập tập trung vào một số điểm nóng, hàng đợi thông điệp bị tồn đọng hoặc cơ sở dữ liệu chịu tải cao nhưng chưa có phương pháp xử lý một cách hệ thống.

## Trọng tâm học tập

* Khi nói đến tối ưu hệ thống hiệu năng cao, thực chất chúng ta đang tối ưu **độ trễ, thông lượng, hiệu suất sử dụng tài nguyên hay trải nghiệm mà người dùng cảm nhận**?
* CDN, cân bằng tải, cache, tối ưu cơ sở dữ liệu và hàng đợi thông điệp lần lượt giải quyết những nút thắt nào trong chuỗi xử lý?
* Tách đọc/ghi, phân tách cơ sở dữ liệu và bảng, phân tách dữ liệu nóng/lạnh và tối ưu phân trang sâu phù hợp với những tình huống nào?
* Kafka, RocketMQ, RabbitMQ và Disruptor có vai trò gì và khác nhau như thế nào khi lựa chọn công nghệ?
* Khi phỏng vấn, làm thế nào để trả lời các câu hỏi về hiệu năng cao theo mạch **“xác định nút thắt → lựa chọn giải pháp → phân tích đánh đổi → rủi ro khi triển khai”**?

## Mạch trả lời khi phỏng vấn

Khi trả lời câu hỏi thiết kế hệ thống hiệu năng cao, có thể triển khai theo trình tự sau:

1. **Xác định mục tiêu trước**: QPS, RT, P99, khối lượng dữ liệu, tỷ lệ đọc/ghi, yêu cầu về tính nhất quán và các ràng buộc về chi phí.
2. **Xác định nút thắt**: băng thông ở tầng truy cập, thread pool của ứng dụng, SQL chậm, tranh chấp khóa, tỷ lệ cache hit, tình trạng tồn đọng của MQ, các dependency phía sau.
3. **Lựa chọn giải pháp**: tầng truy cập sử dụng CDN/cân bằng tải; tầng ứng dụng sử dụng cache/giới hạn lưu lượng/bất đồng bộ hóa; tầng dữ liệu sử dụng index/tách đọc ghi/phân tách cơ sở dữ liệu và bảng/phân tách dữ liệu nóng lạnh; tầng điều tiết lưu lượng sử dụng MQ.
4. **Phân tích đánh đổi**: độ phức tạp do giải pháp mang lại, rủi ro về tính nhất quán, chi phí vận hành, phương án rollback và các chỉ số giám sát.

Trong phỏng vấn, điều tối kỵ là vừa bắt đầu đã “ném” ra hàng loạt tên công nghệ. Ví dụ, khi “truy vấn đơn hàng chậm”, không nhất thiết phải phân tách cơ sở dữ liệu và bảng. Nguyên nhân có thể đơn giản chỉ là **thiếu index, phân trang sâu, quá nhiều dữ liệu lịch sử hoặc truy vấn tập trung vào một cửa hàng đang có lưu lượng lớn**.

Hãy làm rõ bối cảnh trước rồi mới đưa ra giải pháp. Cách trả lời như vậy sẽ chắc chắn và thuyết phục hơn.

## Thứ tự đọc đề xuất

1. [Tổng hợp câu hỏi phỏng vấn về thiết kế hệ thống hiệu năng cao](./high-performance-interview-questions.md): Trước tiên xây dựng danh sách các vấn đề thường gặp về cache, cơ sở dữ liệu, hàng đợi thông điệp, cân bằng tải và các chủ đề liên quan.
2. [Giải thích chi tiết nguyên lý hoạt động của CDN](./cdn.md) và [Giải thích chi tiết nguyên lý và thuật toán cân bằng tải](./load-balancing.md): Hiểu về tầng truy cập và cơ chế phân phối request.
3. [Giải thích chi tiết về tách đọc/ghi và phân tách cơ sở dữ liệu, bảng](./read-and-write-separation-and-library-subtable.md), [Tổng hợp các phương pháp tối ưu SQL phổ biến](./sql-optimization.md), [Giới thiệu phân trang sâu và các đề xuất tối ưu](./deep-pagination-optimization.md): Hoàn thiện kiến thức cốt lõi về tối ưu hiệu năng cơ sở dữ liệu.
4. [Tổng hợp kiến thức cơ bản về hàng đợi thông điệp](./message-queue/message-queue.md): Hiểu về xử lý bất đồng bộ, giảm phụ thuộc, điều tiết lưu lượng, độ tin cậy của thông điệp, thứ tự thông điệp và tính idempotent.
5. Sau đó, tùy theo công nghệ sử dụng, có thể đi sâu vào [Tổng hợp các câu hỏi thường gặp về Kafka](./message-queue/kafka-questions-01.md), [Tổng hợp các câu hỏi thường gặp về RocketMQ](./message-queue/rocketmq-questions.md), [Tổng hợp các câu hỏi thường gặp về RabbitMQ](./message-queue/rabbitmq-questions.md).

## Các bài viết trọng tâm

### Tầng truy cập và phân phối request

* [Giải thích chi tiết nguyên lý hoạt động của CDN](./cdn.md): Tìm hiểu cơ chế điều phối GSLB, chiến lược cache, pre-warming và refresh cache, tối ưu tỷ lệ cache hit và chống hotlink.
* [Giải thích chi tiết nguyên lý và thuật toán cân bằng tải](./load-balancing.md): Tìm hiểu cân bằng tải Layer 4/Layer 7, cân bằng tải phía server/phía client và các thuật toán điều phối phổ biến.

### Cơ sở dữ liệu và tối ưu truy cập dữ liệu

* [Giải thích chi tiết về tách đọc/ghi và phân tách cơ sở dữ liệu, bảng](./read-and-write-separation-and-library-subtable.md): Tìm hiểu replication giữa master và replica, tách đọc/ghi, phân tách theo chiều dọc, phân tách theo chiều ngang và các vấn đề phát sinh sau khi phân tách cơ sở dữ liệu và bảng.
* [Giải thích chi tiết về phân tách dữ liệu nóng/lạnh](./data-cold-hot-separation.md): Tìm hiểu cách xác định dữ liệu nóng/lạnh, lưu trữ phân tầng, tính nhất quán khi di chuyển dữ liệu và tối ưu truy vấn dữ liệu lạnh.
* [Tổng hợp các phương pháp tối ưu SQL phổ biến](./sql-optimization.md): Hệ thống hóa các phương pháp thực tế như xác định SQL chậm, tối ưu index, viết lại truy vấn và tối ưu phân trang.
* [Giới thiệu phân trang sâu và các đề xuất tối ưu](./deep-pagination-optimization.md): Tìm hiểu vấn đề hiệu năng của phân trang sâu và các giải pháp như truy vấn theo phạm vi, tối ưu bằng subquery, delayed join và covering index.

### Hàng đợi thông điệp và xử lý bất đồng bộ để điều tiết tải

* [Chuyên đề về hàng đợi thông điệp](./message-queue/): Từ kiến thức cơ bản về hàng đợi thông điệp đến phạm vi sử dụng của Kafka, RocketMQ, RabbitMQ và Disruptor.
* [Tổng hợp kiến thức cơ bản về hàng đợi thông điệp](./message-queue/message-queue.md): Tìm hiểu các kịch bản sử dụng, mô hình thông điệp, độ tin cậy, thứ tự, tính idempotent và cách xử lý tình trạng tồn đọng thông điệp.
* [Tổng hợp các câu hỏi thường gặp về Kafka](./message-queue/kafka-questions-01.md): Nắm vững kiến trúc Kafka, nguyên lý đạt hiệu năng cao, độ tin cậy của thông điệp, thứ tự thông điệp và Rebalance.
* [Tổng hợp các câu hỏi thường gặp về RocketMQ](./message-queue/rocketmq-questions.md): Tìm hiểu kiến trúc RocketMQ, các loại thông điệp, cơ chế lưu trữ, độ tin cậy và các tính năng mới trong phiên bản 5.x.
* [Tổng hợp các câu hỏi thường gặp về RabbitMQ](./message-queue/rabbitmq-questions.md): Tìm hiểu AMQP, các loại Exchange, cơ chế xác nhận, Dead Letter Queue, Delay Queue, Quorum Queue và Streams.
* [Tổng hợp các câu hỏi thường gặp về Disruptor](./message-queue/disruptor-questions.md): Tìm hiểu RingBuffer, Sequencer, WaitStrategy, thiết kế không khóa (lock-free) và kỹ thuật padding cache line.

## Các câu hỏi thường gặp

* Khi tối ưu hệ thống hiệu năng cao, trước tiên nên xác định những chỉ số nào?
* CDN và cân bằng tải lần lượt giải quyết vấn đề gì?
* Cân bằng tải Layer 4 và Layer 7 khác nhau như thế nào?
* Tách đọc/ghi gây ra những vấn đề gì về tính nhất quán? Xử lý độ trễ giữa master và replica như thế nào?
* Sau khi phân tách cơ sở dữ liệu và bảng, xử lý Distributed ID, JOIN giữa các cơ sở dữ liệu và giao dịch phân tán như thế nào?
* Tại sao phân trang sâu lại chậm? Có những phương án tối ưu nào?
* Hàng đợi thông điệp làm thế nào để đảm bảo thông điệp không bị mất, không bị xử lý trùng và không bị sai thứ tự?
* Nên lựa chọn Kafka, RocketMQ hay RabbitMQ như thế nào?
* Nên xác định nguyên nhân và xử lý tình trạng tồn đọng thông điệp như thế nào?

## Các chuyên đề liên quan

* [Hệ thống kiến thức về hệ thống có tính sẵn sàng cao](../high-availability/)
* [Hệ thống kiến thức về hệ thống phân tán](../distributed-system/)
* [Cơ sở dữ liệu](../database/)
* [Thiết kế hệ thống](../system-design/)
