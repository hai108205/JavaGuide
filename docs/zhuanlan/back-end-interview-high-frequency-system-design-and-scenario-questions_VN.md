---

title: Bộ câu hỏi phỏng vấn System Design Backend thường gặp | Scenario Questions | Seckill System | Short URL System (Kèm đáp án)
description: Phân tích các câu hỏi System Design và Scenario Questions thường gặp trong phỏng vấn Backend, bao gồm Seckill System, Short URL System, xử lý dữ liệu quy mô lớn, Distributed ID và hơn 30 câu hỏi kinh điển, phù hợp để chuẩn bị phỏng vấn Backend tại các công ty công nghệ lớn.
category: Knowledge Planet
head:
  - - meta
    - name: keywords
      content: câu hỏi phỏng vấn System Design,câu hỏi Scenario,Backend System Design,thiết kế Seckill System,thiết kế Short URL System,câu hỏi xử lý dữ liệu lớn,Distributed System Design,câu hỏi phỏng vấn thường gặp,Case Study System Design,Backend Scenario Questions

---

## Giới thiệu

**"System Design & Scenario Questions Backend thường gặp trong phỏng vấn"** là một **nội san** thuộc [Knowledge Planet](../about-the-author/zhishixingqiu-two-years.md) của tôi, tổng hợp một cách có hệ thống các **System Design Case** và **Scenario Questions** thường xuất hiện trong các buổi phỏng vấn Backend.

### Tại sao bạn cần nội san này?

Trong những năm gần đây, các buổi phỏng vấn kỹ thuật tại Trung Quốc ngày càng cạnh tranh. Ngày càng nhiều công ty như **Alibaba, Meituan, ByteDance, Tencent** bắt đầu đưa **System Design** và **Scenario Questions** vào quy trình phỏng vấn nhằm đánh giá toàn diện hơn năng lực của ứng viên — cả **Campus Recruitment** lẫn **Experienced Hire**.

> Rất nhiều ứng viên có thể học thuộc lòng các câu hỏi lý thuyết một cách thành thạo, nhưng lại "đứng hình" khi gặp những câu hỏi mở như: **"Làm thế nào để thiết kế một Seckill System?"**

**Đặc điểm khi đánh giá System Design và Scenario Questions:**

* ✅ Không có một đáp án chuẩn duy nhất; trọng tâm là **quá trình tư duy và năng lực kiến trúc (Architecture)**.
* ✅ Đánh giá khả năng tổng hợp và vận dụng các kỹ thuật như **High Concurrency, High Availability, Distributed System**.
* ✅ Đánh giá khả năng giải quyết vấn đề thực tế và **kinh nghiệm Engineering**.
* ⚠️ Một buổi phỏng vấn thông thường không chỉ gồm Scenario Questions; thường sẽ xen kẽ khoảng **1–2 câu** để đánh giá năng lực này.

Vì vậy, **"System Design & Scenario Questions Backend thường gặp trong phỏng vấn"** đã ra đời!

### Nội san này mang lại gì cho bạn?

**1. Điểm cộng trong phỏng vấn**

Nếu trả lời tốt các câu hỏi **System Design** và **Scenario Questions**, bạn sẽ tạo được ấn tượng rất tốt với interviewer. Chỉ cần chuẩn bị đúng cách, bạn có thể tạo ra sự khác biệt so với các ứng viên khác.

**2. Nâng cao tư duy System Design**

Ngay cả khi không chuẩn bị cho phỏng vấn, nội san này vẫn giúp bạn xây dựng **framework tư duy System Design**, từ đó nâng cao khả năng giải quyết các vấn đề thực tế.

**3. Tham khảo để áp dụng vào Project thực tế**

Nhiều case trong nội san có thể được áp dụng trực tiếp vào project của bạn, chẳng hạn:

* **Third-party OAuth Login** (đăng nhập bằng WeChat/QQ)
* Cách triển khai **Delayed Task** đúng cách với Redis
* Thiết kế và triển khai **Dynamic Thread Pool**
* Nhiều phương án triển khai **Distributed Lock**

## Tổng quan nội dung

### 📐 System Design Case

| Chủ đề                                                           | Kiến thức trọng tâm                                                                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| ⭐ **Thiết kế Dynamic Thread Pool như thế nào?**                  | Dynamic Thread Pool Parameter Tuning, Monitoring & Alerting, Rejection Policy, Graceful Shutdown     |
| **Thiết kế hệ thống In-app Messaging như thế nào?**              | Message Push, Unread Count, WebSocket, Message Queue                                                 |
| **Thiết kế hệ thống Weibo Feed / Information Feed như thế nào?** | Push Model vs Pull Model, Timeline, Intelligent Recommendation, Read/Write Fan-out, Caching Strategy |
| **Thiết kế hệ thống Ranking như thế nào?**                       | Redis Sorted Set, Real-time Update, Pagination, Sorting dữ liệu quy mô lớn                           |
| **Một số System Design Case điển hình (bổ sung)**                | Các case tổng hợp như Like, Coupon, Red Envelope                                                     |

### 🎯 Scenario Questions thường gặp

| Chủ đề                                                          | Kiến thức trọng tâm                                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ⭐ **Tự động hủy Order khi quá thời gian như thế nào?**          | Delayed Queue, Scheduled Task, State Machine, Idempotency                              |
| **Triển khai Delayed Task dựa trên Redis như thế nào?**         | Expiration Event Listener vs Redisson DelayedQueue, Timeliness, Reliability            |
| ⭐ **Giải quyết vấn đề upload file dung lượng lớn như thế nào?** | Multipart Upload, Resumable Upload, Instant Upload, Concurrent Upload, File Validation |
| **Triển khai chức năng xác định IP Geolocation như thế nào?**   | Lựa chọn IP Database, Offline Database vs Online API, Performance Optimization         |
| **Thống kê Website UV như thế nào?**                            | Khái niệm PV/UV/VV/IP, HyperLogLog, Deduplication                                      |
| ⭐ **Một số Backend Scenario Questions điển hình (bổ sung)**     | Rate Limiting, Idempotency, Cache Penetration và các Scenario tổng hợp                 |

### 🔐 Authentication, Security & Risk Control

| Chủ đề                                                             | Kiến thức trọng tâm                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| ⭐ **Triển khai Sensitive Word Masking trong Project như thế nào?** | Data Masking Strategy, Regex Matching, Performance Optimization, Dynamic Configuration |
| ⭐ **Truyền tải và lưu trữ Password an toàn như thế nào?**          | Salted Hashing, BCrypt, HTTPS, Replay Attack Prevention                                |
| **Triển khai Third-party OAuth Login như thế nào?**                | OAuth 2.0, Authorization Code Grant, Token Mechanism, JWT                              |
| **Thiết kế Login bằng Verification Code như thế nào?**             | Code Generation, Storage, Validation, Anti-abuse, TTL Management                       |
| **Hạn chế Login sau nhiều lần nhập sai Password như thế nào?**     | Rate Limiting Strategy, Redis Counter, Sliding Window, Distributed Rate Limiting       |

### 📊 Scenario với dữ liệu quy mô lớn

| Chủ đề                                                                                             | Kiến thức trọng tâm                                                  |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| ⭐ **Có 4 tỷ QQ ID, giới hạn 1 GB Memory, làm thế nào để Deduplicate?**                             | Bitmap, Bloom Filter, Divide and Conquer, External Sorting           |
| ⭐ **DAU lên tới hàng trăm triệu, làm thế nào để đảm bảo Video Recommendation không bị trùng lặp?** | Bloom Filter, Redis Set, Deduplication Strategy, Memory Optimization |
| ⭐ **Bài toán Big Data Top K**                                                                      | Heap Sort, Quickselect, Divide and Conquer, MapReduce                |

### 🔄 Concurrency Control & Distributed Consistency

| Chủ đề                                                                                  | Kiến thức trọng tâm                                                              |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Nhiều Rider cùng tranh giành một Order, làm thế nào để đảm bảo không bị nhận trùng?** | Distributed Lock, Optimistic Lock, Redis SETNX, Concurrency Control              |
| **Xử lý thế nào khi Withdrawal thất bại và cần hoàn tiền (Rollback)?**                  | Compensation Mechanism, Idempotent Design, State Rollback, Reconciliation System |

## Xem trước nội dung

## Đối tượng phù hợp

* 🎓 **Ứng viên Campus Recruitment**: Chuẩn bị cho các buổi phỏng vấn System Design tại các công ty công nghệ lớn.
* 👨‍💻 **Ứng viên Experienced Hire**: Nâng cao năng lực Architecture Design và tăng cơ hội nhận được offer tốt hơn.
* 🔧 **Junior/Middle-level Engineer**: Học tư duy System Design và nâng cao khả năng giải quyết vấn đề thực tế.
* 📚 **Người yêu thích công nghệ**: Tìm hiểu nguyên lý thiết kế của các hệ thống phổ biến.
