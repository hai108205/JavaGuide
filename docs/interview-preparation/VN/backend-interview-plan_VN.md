---
title: Kế hoạch vượt qua phỏng vấn Java Backend phiên bản mới nhất 2026 (bao gồm hệ thống kiến thức Backend tổng quát)
description: Kế hoạch vượt qua phỏng vấn Java Backend: Sắp xếp theo đúng mức độ ưu tiên thực tế của phỏng vấn, bao gồm kinh nghiệm dự án, Java cốt lõi, MySQL/Redis, framework, thiết kế hệ thống, kiến thức nền tảng máy tính, hệ thống phân tán và JVM, phù hợp cho chuẩn bị tuyển dụng sinh viên mới/tuyển dụng có kinh nghiệm.
category: 面试准备
icon: mdi:star-outline
head:
  - - meta
    - name: keywords
      content: Java后端面试,面试准备计划,面试指南,八股文,校招,社招,项目经验,Java面试
---

<!-- markdownlint-disable MD033 -->

Kế hoạch này sắp xếp theo đúng **mức độ ưu tiên thực tế** của phỏng vấn, trình tự như sau:
**「Kinh nghiệm dự án và đào sâu CV → Java cốt lõi/MySQL/Redis → Ứng dụng framework → Thiết kế hệ thống và câu hỏi tình huống → Kiến thức nền tảng máy tính → Hệ thống phân tán/High Concurrency → JVM」**

Mỗi giai đoạn đều tương ứng với các bài viết chọn lọc cụ thể trên trang, thuận tiện cho bạn tra cứu và đánh bại từng mục tiêu.

- **Tổng chu kỳ đề xuất**: 4~8 tuần (vui lòng linh hoạt rút ngắn hoặc kéo dài tùy theo công ty mục tiêu là công ty vừa và nhỏ hay công ty lớn, cũng như thời gian rảnh rỗi của bản thân).
- **Đối tượng phù hợp**: Sinh viên ngành khoa học máy tính chuẩn bị cho tuyển dụng mùa thu/mùa xuân, và lập trình viên Java có 0-5 năm kinh nghiệm chuẩn bị nhảy việc.
- **Ôn tập cấp tốc**: Các bài viết kỹ thuật được đề xuất dưới đây chủ yếu từ [JavaGuide](https://javaguide.cn/), rất toàn diện và chi tiết, nếu ôn tập cấp tốc, có thể chọn đọc các bài viết tương ứng trong [JavaGuide Interview Sprint Edition](https://interview.javaguide.cn/).

### Tổng quan kế hoạch

| Giai đoạn                                     | Thời lượng đề xuất          | Sản phẩm cốt lõi                                                | Tiêu chuẩn tự kiểm tra                                                                                             |
| --------------------------------------------- | --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Bước 0** Chuẩn bị ban đầu                   | 1~2 ngày                    | CV hoàn thiện, nhịp độ ôn tập, chuẩn bị tâm lý                   | Chọn bất kỳ một dự án, trong 30 giây nói rõ nghiệp vụ + vai trò của bạn, không bị kẹt, có trọng tâm                 |
| **Giai đoạn 1** Đào sâu dự án và CV           | Khoảng 1 tuần               | Thẻ dự án, danh sách câu hỏi bắt buộc, kịch bản diễn đạt 1/3 phút | Nói không cần script rõ bối cảnh + điểm khó + đóng góp của từng dự án; Rút ngẫu nhiên 3 câu từ danh sách câu hỏi bắt buộc trả lời được ý chính |
| **Giai đoạn 2** Java + MySQL + Redis          | 2~3 tuần                    | Hiểu kiến thức cơ bản và ghi nhớ từ khóa (cơ bản + collection + concurrency + database) | Rút ngẫu nhiên câu hỏi từ bài viết trên trang, có thể dùng lời của mình nói rõ nguyên lý và từ khóa, không phụ thuộc vào học thuộc từng chữ |
| **Giai đoạn 3** Framework                     | 1~2 tuần                    | Spring/IoC/AOP/Transaction, Design Pattern, Phân quyền và Bảo mật | Có thể nói rõ cách dùng framework trong dự án, hiểu sâu IoC và AOP, các tình huống transaction thất bại, v.v.       |
| **Thiết kế hệ thống và câu hỏi tình huống** (sau framework) | Tùy nhu cầu 0.5~1 tuần | Ý tưởng cho câu hỏi thiết kế hệ thống và tình huống (short link/flash sale/dữ liệu khổng lồ, v.v.) | Nói miệng không gợi ý được quy trình tổng thể và đánh đổi then chốt (lưu trữ, rate limiting, consistency, v.v.) của thiết kế kinh điển (như short link/flash sale) |
| **Giai đoạn 4** Kiến thức nền tảng máy tính   | Tùy nhu cầu 0.5~2 tuần      | Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu; Ứng tuyển công ty vừa và lớn thêm thuật toán | Có thể viết tay thuật toán phổ biến/bài tập viết tay; Rút ngẫu nhiên câu hỏi từ bài viết trên trang trả lời được cơ chế cốt lõi |
| **Giai đoạn 5** Hệ thống phân tán và High Concurrency | Tùy nhu cầu 1~2 tuần  | Lý thuyết phân tán, RPC, MQ, High Availability                    | Có thể nói rõ giải pháp phân tán (lock/ID/MQ, v.v.) dùng trong dự án và lý do chọn lựa                            |
| **Giai đoạn 6** JVM                           | Công ty lớn/một số công ty vừa 3~5 ngày | Bộ nhớ, GC, Class Loading, Tuning và Điều tra                   | Có thể nói rõ vùng nhớ, quá trình GC, class loading; có thể nói miệng một lần GC tuning hoặc ý tưởng điều tra OOM  |
| **Nước rút trước phỏng vấn**                  | 1~2 ngày                    | Ôn lại danh sách câu hỏi bắt buộc, luyện lại kịch bản dự án, tâm lý và thiết bị | Ôn lại danh sách câu hỏi bắt buộc một lượt có thể nhắc lại ý chính; Kịch bản 1 phút cho mỗi dự án luyện một lần không bị kẹt |

**📌 Ghi chú điều chỉnh giai đoạn:**

- Các giai đoạn ghi "tùy nhu cầu" có thể điều chỉnh theo công ty mục tiêu: Ứng tuyển ByteDance, Kuaishou, Tencent và các **công ty coi trọng thuật toán**, nhất định phải tăng cường Giai đoạn 4 (Thuật toán và Cấu trúc dữ liệu);
- Nếu CV hoặc vị trí ứng tuyển của bạn liên quan rõ ràng đến **hệ thống phân tán/microservice**, hãy tập trung hệ thống vào Giai đoạn 5;
- Nếu mục tiêu là các **bộ phận cốt lõi của công ty lớn** như Alibaba, Meituan, JD.com, hãy tập trung vào Giai đoạn 6 (JVM tầng thấp và điều tra trực tuyến).

### Bước 0: Chuẩn bị ban đầu (đề xuất 1~2 ngày)

Trước khi ôn tập kiến thức cơ bản một cách hệ thống, hãy giải quyết trước "chuẩn bị thế nào, viết CV thế nào, giữ vững tâm lý thế nào", tránh chạy sai hướng.

| Hạng mục            | Giải thích                                                      | Bài viết tương ứng                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phương pháp chuẩn bị | Xác định rõ nhịp độ ôn tập, phương pháp tự kiểm tra, phân bổ thời gian | [Làm thế nào để chuẩn bị phỏng vấn Java hiệu quả?](https://javaguide.cn/interview-preparation/teach-you-how-to-prepare-for-the-interview-hand-in-hand.html)<br />[Tổng kết trọng tâm phỏng vấn Java Backend](https://javaguide.cn/interview-preparation/key-points-of-interview.html) |
| CV                  | Một đến hai trang, dự án theo STAR, tech stack khớp với vị trí    | [Hướng dẫn viết CV cho lập trình viên](https://javaguide.cn/interview-preparation/resume-guide.html)                                                                                                                                        |
| Lộ trình học        | Kiểm tra bổ sung lỗ hổng, xác định giai đoạn hiện tại của bản thân | [Lộ trình học Java (phiên bản mới nhất, 4w+ từ)](https://javaguide.cn/interview-preparation/java-roadmap.html)                                                                                                                              |
| Dự án và kinh nghiệm | Cách đóng gói, cách trình bày khi không có dự án/thực tập         | [Hướng dẫn kinh nghiệm dự án](https://javaguide.cn/interview-preparation/project-experience-guide.html)<br />[Tuyển dụng sinh viên mới không có kinh nghiệm thực tập phải làm sao? Kinh nghiệm thực tập viết thế nào?](https://javaguide.cn/interview-preparation/internship-experience.html) |
| Tâm lý              | Giảm căng thẳng, thể hiện ổn định hơn                             | [Quá lo lắng khi phỏng vấn phải làm sao?](https://javaguide.cn/interview-preparation/how-to-handle-interview-nerves.html)                                                                                                                  |

**Điểm cốt lõi**:

- **Kỹ thuật giỏi không có nghĩa là phỏng vấn sẽ qua**, phải chuẩn bị hệ thống - học tập theo định hướng tìm việc càng sớm càng tốt, lập danh sách kỹ năng theo yêu cầu tuyển dụng.
- **Nắm vững thời điểm vàng để nộp CV**: Tuyển dụng mùa thu tháng 7-9, tuyển dụng mùa xuân tháng 3-4; thu thập thông tin tuyển dụng từ nhiều kênh (trang web chính thức, trang web tuyển dụng, Nowcoder, giới thiệu nội bộ, v.v.).
- **Dành 2-3 ngày hoàn thiện CV**, coi trọng mô tả kinh nghiệm dự án; **CV tuyển dụng sinh viên mới không quá 2 trang, tuyển dụng có kinh nghiệm không quá 3 trang**. Nhất định phải trau chuốt đóng gói, nhưng cũng tránh phóng đại sự thật trong CV, dễ bị đào sâu phát hiện khi phỏng vấn.
- **Kiến thức phỏng vấn (八股文) rất có ý nghĩa**, phát triển hàng ngày cũng sẽ dùng đến; đừng có tâm lý may rủi, sắt phải tự cứng mới rèn được.
- **Chuẩn bị trước kịch bản tự giới thiệu 1-2 phút**, có thể nói trôi chảy về nền tảng cá nhân, tech stack và định hướng tìm việc.
- **Tự kiểm tra nhiều hơn**, có thể dùng AI hỗ trợ phỏng vấn mô phỏng, tìm bạn bè cùng lớp phỏng vấn mô phỏng lẫn nhau.

### Giai đoạn 1: Đào sâu dự án và CV (khoảng 1 tuần)

**Mục tiêu**: Có thể nói rõ ràng bối cảnh từng dự án, vai trò của bạn, lựa chọn công nghệ và điểm khó, đồng thời có thể suy luận ra "câu hỏi phỏng vấn có thể bị hỏi".

**Sản phẩm đầu ra**:

- **Thẻ dự án**: Duyệt từng dự án theo CV, viết rõ cho từng dự án — bối cảnh nghiệp vụ, tech stack, module bạn phụ trách, 1~2 điểm khó và cách giải quyết, kết quả định lượng được (như QPS, thời gian phản hồi, tiết kiệm chi phí).
- **Danh sách câu hỏi bắt buộc**: Dựa trên công nghệ dùng trong dự án, liệt kê "câu hỏi bắt buộc" (ví dụ: dùng Redis cache → cấu trúc dữ liệu phổ biến của Redis, cơ chế persistence, mô hình luồng, v.v.; dùng MySQL → index, transaction, tối ưu SQL chậm, v.v.). Có thể tham khảo tổng kết câu hỏi phỏng vấn trong trang [JavaGuide](https://javaguide.cn/) để mở rộng theo dự án.
- **Kịch bản diễn đạt**: Mỗi dự án chuẩn bị phiên bản 1~2 phút (dùng khi tự giới thiệu) và phiên bản 3~5 phút (dùng khi đào sâu), có thể nói trôi chảy "tại sao chọn như vậy, gặp vấn đề gì, giải quyết thế nào".

**Đề xuất hàng ngày**: Mỗi ngày sắp xếp ít nhất 1 dự án + câu hỏi bắt buộc tương ứng, cuối tuần làm một lần tự kiểm tra không script (ghi âm hoặc nói trước gương).

**Tự kiểm tra**: Có thể nói không script rõ bối cảnh, điểm khó và đóng góp của từng dự án; câu hỏi trong danh sách câu hỏi bắt buộc trả lời được ý chính, đối với phỏng vấn công ty lớn phải chịu được đào sâu, làm được suy một ra ba.

**Không có kinh nghiệm dự án thì làm sao?**

1. **Video/Chuyên mục dự án thực chiến**: Muke, Bilibili, Lagou, GeekTime, v.v.; chọn dự án phù hợp với năng lực bản thân, không cần thiết phải ép chọn dự án microservice. [JavaGuide Official Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) đã ra mắt [⭐AI Intelligent Interview Assistance Platform + RAG Knowledge Base](https://javaguide.cn/zhuanlan/interview-guide.html) và [Handwritten RPC Framework](https://javaguide.cn/zhuanlan/handwritten-rpc-framework.html). Ngoài ra, còn chia sẻ nhiều phần giới thiệu phiên bản tối ưu và chuẩn bị phỏng vấn cho các dự án tần suất cao (như blog, giao đồ ăn, thread pool, short connection).
2. **Dự án mã nguồn mở thực chiến**: [Dự án mã nguồn mở thực chiến chất lượng cao](https://javaguide.cn/open-source-project/practical-project.html) do JavaGuide đề xuất; cải tiến hoặc thêm chức năng trên cơ sở hiểu biết.
3. **Tham gia cuộc thi do công ty lớn tổ chức**: Alibaba Tianchi Contest, v.v.; dự án đoạt giải có hàm lượng giá trị cao.

**Điểm chính khi viết kinh nghiệm dự án (Phương pháp STAR)**:

- **Situation (Bối cảnh)**: Bối cảnh dự án là gì? Cần giải quyết vấn đề gì?
- **Task (Nhiệm vụ)**: Bạn phụ trách gì trong dự án? Vai trò của bạn là gì?
- **Action (Hành động)**: Bạn đã làm cụ thể những gì? Dùng công nghệ gì? Gặp vấn đề gì? Giải quyết thế nào?
- **Result (Kết quả)**: Đạt được kết quả gì? Tốt nhất định lượng (QPS từ xxx tăng lên xxx, thời gian phản hồi giảm xx%)

**Câu hỏi tần suất cao khi giới thiệu dự án**:

- Kiến trúc kỹ thuật ghi trực tiếp tên công nghệ, không cần giải thích.
- Giảm mô tả thuần nghiệp vụ, khai thác nhiều điểm sáng kỹ thuật hơn, kết hợp mô tả tình huống nghiệp vụ cụ thể.
- Kết quả tối ưu phải định lượng (QPS, thời gian phản hồi, tiết kiệm chi phí, v.v.), dự án không thực tế thì đóng gói giá trị hợp lý.
- Nội dung công việc giới thiệu kiểm soát khoảng 6~8 mục là tốt nhất, nhiều hay ít đều có ảnh hưởng, nhất định phải có ít nhất 3-4 mục có điểm sáng kỹ thuật, có thể thu hút người phỏng vấn.
- Tránh mô tả mơ hồ (như "phụ trách phát triển"), phải cụ thể (công nghệ + tình huống + hiệu quả).
- Nhất định phải đóng gói dự án, nhưng cũng đừng đóng gói quá mức, khi chuẩn bị nghĩ nhiều hơn "nếu người phỏng vấn hỏi tại sao", đảm bảo logic tự nhất quán.

### Giai đoạn 2: Java cốt lõi + MySQL + Redis (khoảng 2~3 tuần)

**Mức độ ưu tiên**: Phần quan trọng nhất, điểm thi tần suất cao trong phỏng vấn, MySQL + Redis >= Java cơ bản/Collection/Concurrency > Kiến thức framework, công ty lớn sẽ đào sâu concurrency và tầng thấp.

**Java Cơ bản**

- [Tổng kết câu hỏi phỏng vấn Java cơ bản (Phần trên)](https://javaguide.cn/java/basis/java-basic-questions-01.html), [(Phần giữa)](https://javaguide.cn/java/basis/java-basic-questions-02.html), [(Phần dưới)](https://javaguide.cn/java/basis/java-basic-questions-03.html): Cú pháp và Lập trình hướng đối tượng, String và Copy, Exception/Generics/Reflection/SPI/Serialization/Annotation

**Java Collection**

- [Câu hỏi phỏng vấn Java Collection (Phần trên)](https://javaguide.cn/java/collection/java-collection-questions-01.html), [(Phần dưới)](https://javaguide.cn/java/collection/java-collection-questions-02.html): List/Set/Queue, HashMap, ConcurrentHashMap

**Java Concurrency** (công ty lớn nhất định đào sâu)

- [Câu hỏi phỏng vấn Java Concurrency (Phần trên)](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html), [(Phần giữa)](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html), [(Phần dưới)](https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html): Thread và Lock, synchronized/ReentrantLock, ThreadLocal/ThreadPool/Future/AQS/Virtual Thread
- [JMM](https://javaguide.cn/java/concurrent/jmm.html), [ThreadPool chi tiết](https://javaguide.cn/java/concurrent/java-thread-pool-summary.html) và [Best Practices](https://javaguide.cn/java/concurrent/java-thread-pool-best-practices.html)
- [ThreadLocal](https://javaguide.cn/java/concurrent/threadlocal.html), [AQS](https://javaguide.cn/java/concurrent/aqs.html), [CompletableFuture](https://javaguide.cn/java/concurrent/completablefuture-intro.html), [Concurrent Container phổ biến](https://javaguide.cn/java/concurrent/java-concurrent-collections.html)

**MySQL** (bắt buộc xem)

- [Tổng kết câu hỏi phỏng vấn MySQL](https://javaguide.cn/database/mysql/mysql-questions-01.html) (Cơ bản, Engine, Transaction, Index, Lock, Tối ưu)
- [MySQL Index chi tiết](https://javaguide.cn/database/mysql/mysql-index.html), [Ba loại Log](https://javaguide.cn/database/mysql/mysql-logs.html), [Transaction Isolation Level](https://javaguide.cn/database/mysql/transaction-isolation-level.html)
- [InnoDB triển khai MVCC](https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html), [Quá trình thực thi SQL](https://javaguide.cn/database/mysql/how-sql-executed-in-mysql.html)

**Redis** (bắt buộc xem)

- [Tổng kết câu hỏi phỏng vấn Redis (Phần trên)](https://javaguide.cn/database/redis/redis-questions-01.html), [Tổng kết câu hỏi phỏng vấn Redis (Phần dưới)](https://javaguide.cn/database/redis/redis-questions-02.html)
- [Redis Delayed Task](https://javaguide.cn/database/redis/redis-delayed-task.html), [Redis làm Message Queue](https://javaguide.cn/database/redis/redis-stream-mq.html)
- [5 Kiểu dữ liệu cơ bản](https://javaguide.cn/database/redis/redis-data-structures-01.html), [3 Kiểu đặc biệt](https://javaguide.cn/database/redis/redis-data-structures-02.html), [SkipList triển khai Sorted Set](https://javaguide.cn/database/redis/redis-skiplist.html)
- [Persistence](https://javaguide.cn/database/redis/redis-persistence.html), [Phân mảnh bộ nhớ](https://javaguide.cn/database/redis/redis-memory-fragmentation.html), [Nguyên nhân blocking phổ biến](https://javaguide.cn/database/redis/redis-common-blocking-problems-summary.html)

**Tự kiểm tra**: Rút ngẫu nhiên câu hỏi, có thể dùng lời của mình nói ra, không học thuộc lòng cứng nhắc, hiểu và ghi nhớ, trọng tâm ghi nhớ từ khóa. Đặc biệt phải kiểm tra trọng tâm phần MySQL và Redis, trọng tâm trong trọng tâm của phỏng vấn.

### Giai đoạn 3: Framework và Thiết kế hệ thống (khoảng 1~3 tuần)

#### Design Pattern

- [Tổng kết câu hỏi phỏng vấn Design Pattern](https://interview.javaguide.cn/system-design/design-pattern.html)

**Tự kiểm tra**: Nắm vững ít nhất hai cách viết phổ biến của Singleton Pattern; Proxy Pattern, Chain of Responsibility Pattern, Strategy Pattern nhất định phải hiểu rõ, tốt nhất có thể kết hợp với kinh nghiệm dự án hoặc cách dùng trong open source framework để trình bày.

#### Framework

**Spring / Spring Boot**

- [Câu hỏi phỏng vấn Spring](https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html), [Câu hỏi phỏng vấn SpringBoot](https://javaguide.cn/system-design/framework/spring/springboot-knowledge-and-questions-summary.html)
- [Annotation phổ biến](https://javaguide.cn/system-design/framework/spring/spring-common-annotations.html), [IoC và AOP](https://javaguide.cn/system-design/framework/spring/ioc-and-aop.html), [Spring Transaction](https://javaguide.cn/system-design/framework/spring/spring-transaction.html)
- [Design Pattern trong Spring](https://javaguide.cn/system-design/framework/spring/spring-design-patterns-summary.html), [SpringBoot Auto-Configuration](https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.html), [Nguyên lý @Async](https://javaguide.cn/system-design/framework/spring/async.html) (kiến thức nguyên lý, có thể bỏ qua nếu không đủ thời gian)
- [Câu hỏi phỏng vấn MyBatis](https://javaguide.cn/system-design/framework/mybatis/mybatis-interview.html) (không quan trọng, có thể bỏ qua, ít khi hỏi), [Câu hỏi phỏng vấn Netty](https://javaguide.cn/system-design/framework/netty.html) (chỉ cần chuẩn bị khi có dùng đến)

**Tự kiểm tra**: Có thể nói rõ Spring annotation dùng trong dự án, IoC/AOP thể hiện trong dự án, tình huống transaction thất bại.

**Phân quyền và Bảo mật**

- [Cơ bản về Authentication & Authorization](https://javaguide.cn/system-design/security/basis-of-authority-certification.html), [JWT](https://javaguide.cn/system-design/security/jwt-intro.html) và [Ưu nhược điểm](https://javaguide.cn/system-design/security/advantages-and-disadvantages-of-jwt.html), [Thiết kế hệ thống phân quyền](https://javaguide.cn/system-design/security/design-of-authority-system.html), [SSO](https://javaguide.cn/system-design/security/sso-intro.html), [Thuật toán mã hóa phổ biến](https://javaguide.cn/system-design/security/encryption-algorithms.html)

#### Thiết kế hệ thống và Câu hỏi tình huống

Người phỏng vấn thường xen kẽ một hai câu thiết kế hệ thống hoặc câu hỏi tình huống, kiểm tra ý tưởng tổng thể và đánh đổi giải pháp.

- **Tổng hợp thiết kế hệ thống / câu hỏi tình huống**: [Tổng kết câu hỏi phỏng vấn thiết kế hệ thống](https://javaguide.cn/system-design/system-design-questions.html) (nội dung trả phí trong chuyên mục [Backend Interview High-Frequency System Design & Scenario Questions](https://javaguide.cn/zhuanlan/back-end-interview-high-frequency-system-design-and-scenario-questions.html), bao gồm short link, flash sale, xử lý dữ liệu khổng lồ, v.v. 30+ câu).
- **Bài viết thiết kế có thể tham khảo trên trang** (ý tưởng có thể chuyển sang trả lời phỏng vấn miệng): [Scheduled Task](https://javaguide.cn/system-design/schedule-task.html), [Web Real-time Message Push](https://javaguide.cn/system-design/web-real-time-message-push.html).

![《Backend Interview High-Frequency System Design & Scenario Questions》](https://oss.javaguide.cn/xingqiu/back-end-interview-high-frequency-system-design-and-scenario-questions-fengmian.png)

**Tự kiểm tra**: Có thể nói miệng ý tưởng tổng thể và đánh đổi then chốt của 1~2 thiết kế hệ thống kinh điển (như short link, flash sale, rate limiting); câu hỏi tình huống (như deduplicate dữ liệu khổng lồ, third-party login) có thể nói ra giải pháp phổ biến.

### Giai đoạn 4: Kiến thức nền tảng máy tính (sắp xếp theo công ty mục tiêu)

**Mục tiêu ByteDance, Tencent và các công ty coi trọng thuật toán/nền tảng**: Dành thêm thời gian phù hợp, thuật toán và bài tập code phải làm riêng (LeetCode Hot, Sword Point Offer, v.v.); **Mục tiêu công ty vừa và nhỏ**: Có thể nén hoặc đẩy lùi.

- **Thuật toán và Bài tập code** (ứng tuyển ByteDance, Kuaishou, v.v. nhất định dành thời gian): Trước tiên xem qua [Chuyên đề Thuật toán](https://javaguide.cn/cs-basics/algorithms/) để xây dựng lộ trình, sau đó tập trung viết tay [Binary Search](https://javaguide.cn/cs-basics/algorithms/binary-search.html), [Two Pointers và Sliding Window](https://javaguide.cn/cs-basics/algorithms/two-pointers-and-sliding-window.html), [DFS/BFS](https://javaguide.cn/cs-basics/algorithms/dfs-bfs.html), [Backtracking](https://javaguide.cn/cs-basics/algorithms/backtracking.html), [Dynamic Programming](https://javaguide.cn/cs-basics/algorithms/dynamic-programming.html), [Top K](https://javaguide.cn/cs-basics/algorithms/top-k.html) những template này; kết hợp với [Sword Point Offer Solutions](https://javaguide.cn/cs-basics/algorithms/the-sword-refers-to-offer.html), LeetCode Hot 100 và các bài viết tay phổ biến (như LRU, Producer-Consumer, Singleton, v.v.). Đề xuất mỗi ngày ít nhất 1 bài, giữ cảm giác.
- **Mạng máy tính**: [Câu hỏi phỏng vấn mạng máy tính (Phần trên)](https://javaguide.cn/cs-basics/network/other-network-questions.html), [(Phần dưới)](https://javaguide.cn/cs-basics/network/other-network-questions2.html), [Toàn bộ quá trình truy cập trang web](https://javaguide.cn/cs-basics/network/the-whole-process-of-accessing-web-pages.html), [Giao thức tầng ứng dụng phổ biến](https://javaguide.cn/cs-basics/network/application-layer-protocol.html), [HTTP/HTTPS](https://javaguide.cn/cs-basics/network/http-vs-https.html), [HTTP 1.0 vs 1.1](https://javaguide.cn/cs-basics/network/http1.0-vs-http1.1.html), [DNS](https://javaguide.cn/cs-basics/network/dns.html), [TCP Three-way Handshake và Four-way Wave](https://javaguide.cn/cs-basics/network/tcp-connection-and-disconnection.html), [TCP Reliability](https://javaguide.cn/cs-basics/network/tcp-reliability-guarantee.html), [ARP](https://javaguide.cn/cs-basics/network/arp.html)
- **Hệ điều hành**: [Câu hỏi phỏng vấn hệ điều hành (Phần trên)](https://javaguide.cn/cs-basics/operating-system/operating-system-basic-questions-01.html), [(Phần dưới)](https://javaguide.cn/cs-basics/operating-system/operating-system-basic-questions-02.html), [Linux Cơ bản](https://javaguide.cn/cs-basics/operating-system/linux-intro.html)
- **Cấu trúc dữ liệu**: Trước tiên xem qua [Chuyên đề Cấu trúc dữ liệu](https://javaguide.cn/cs-basics/data-structure/), sau đó tập trung ôn lại [Array/LinkedList/Stack/Queue](https://javaguide.cn/cs-basics/data-structure/linear-data-structure.html), [Hash Table](https://javaguide.cn/cs-basics/data-structure/hash-table.html), [Tree](https://javaguide.cn/cs-basics/data-structure/tree.html), [Graph](https://javaguide.cn/cs-basics/data-structure/graph.html), [Heap](https://javaguide.cn/cs-basics/data-structure/heap.html), [Trie](https://javaguide.cn/cs-basics/data-structure/trie.html), [Union-Find](https://javaguide.cn/cs-basics/data-structure/union-find.html), [SkipList](https://javaguide.cn/cs-basics/data-structure/skip-list.html), [Red-Black Tree](https://javaguide.cn/cs-basics/data-structure/red-black-tree.html), [Bloom Filter](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html), [LRU](https://javaguide.cn/cs-basics/data-structure/lru-cache.html).

Thuật toán và cấu trúc dữ liệu đề xuất ôn tập kết hợp, đừng chỉ học thuộc khái niệm hoặc chỉ làm bài. Khi thời gian gấp đi theo lộ trình 7 ngày: độ phức tạp và sắp xếp, array/linked list, binary search/two pointer/sliding window, tree và graph, backtracking và dynamic programming, hash/heap/Top K, ôn lại bài sai. Khi thời gian đủ đi theo lộ trình 30 ngày: trước tiên xây dựng vững cấu trúc tuyến tính và hash table, sau đó làm tree graph, backtracking, dynamic programming, greedy, Top K, cuối cùng chỉ ôn lại bài sai và edge case.

**Tự kiểm tra**: Có thể vẽ toàn bộ quá trình truy cập trang web, TCP handshake và wave, v.v.; bài tập thuật toán có thể viết tay các mẫu phổ biến; OS process/thread, memory, deadlock có thể nói rõ khái niệm và ví dụ.

### Giai đoạn 5: Hệ thống phân tán và High Concurrency (theo CV và vị trí)

Nếu CV hoặc vị trí liên quan đến hệ thống phân tán/microservice/high concurrency, hãy ôn tập hệ thống một lần; nếu không thì chỉ cần ôn qua "điểm sẽ dùng trong dự án".

- **Lý thuyết phân tán**: [CAP và BASE](https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html), [Paxos](https://javaguide.cn/distributed-system/protocol/paxos-algorithm.html), [Raft](https://javaguide.cn/distributed-system/protocol/raft-algorithm.html), [ZAB](https://javaguide.cn/distributed-system/protocol/zab.html), [Gossip](https://javaguide.cn/distributed-system/protocol/gossip-protocol.html), [Consistent Hashing](https://javaguide.cn/distributed-system/protocol/consistent-hashing.html)
- **RPC**: [RPC Cơ bản](https://javaguide.cn/distributed-system/rpc/rpc-intro.html), [Dubbo](https://javaguide.cn/distributed-system/rpc/dubbo.html) (hiện tại rất ít hỏi, có thể bỏ qua)
- **Distributed ID / Gateway / Lock / Transaction** (dự án liên quan mới tập trung xem): [Distributed ID](https://javaguide.cn/distributed-system/distributed-id.html), [Hướng dẫn thiết kế](https://javaguide.cn/distributed-system/distributed-id-design.html), [API Gateway](https://javaguide.cn/distributed-system/api-gateway.html), [Spring Cloud Gateway](https://javaguide.cn/distributed-system/spring-cloud-gateway-questions.html), [Distributed Lock](https://javaguide.cn/distributed-system/distributed-lock-implementations.html), [Distributed Transaction](https://javaguide.cn/distributed-system/distributed-transaction.html)
- **High Concurrency** (dự án liên quan mới tập trung xem): [CDN](https://javaguide.cn/high-performance/cdn.html), [Read-Write Separation và Sharding](https://javaguide.cn/high-performance/read-and-write-separation-and-library-subtable.html), [Cold-Hot Separation](https://javaguide.cn/high-performance/data-cold-hot-separation.html), [SQL Optimization](https://javaguide.cn/high-performance/sql-optimization.html), [Deep Pagination](https://javaguide.cn/high-performance/deep-pagination-optimization.html), [Load Balancing](https://javaguide.cn/high-performance/load-balancing.html)
- **High Availability** (dự án liên quan mới tập trung xem): [Thiết kế hệ thống High Availability](https://javaguide.cn/high-availability/high-availability-system-design.html), [Rate Limiting](https://javaguide.cn/high-availability/limit-request.html), [Circuit Breaker và Degradation](https://javaguide.cn/high-availability/fallback-and-circuit-breaker.html), [Timeout và Retry](https://javaguide.cn/high-availability/timeout-and-retry.html), [Thiết kế Idempotency](https://javaguide.cn/high-availability/idempotency.html), [Thiết kế Redundancy](https://javaguide.cn/high-availability/redundancy.html)
- **Message Queue** (dự án liên quan mới tập trung xem): [MQ Cơ bản](https://javaguide.cn/high-performance/message-queue/message-queue.html), [Disruptor](https://javaguide.cn/high-performance/message-queue/disruptor-questions.html), [RabbitMQ](https://javaguide.cn/high-performance/message-queue/rabbitmq-questions.html), [RocketMQ](https://javaguide.cn/high-performance/message-queue/rocketmq-questions.html), [Kafka](https://javaguide.cn/high-performance/message-queue/kafka-questions-01.html)

**Tự kiểm tra**: Có thể nói rõ giải pháp phân tán dùng trong dự án (như distributed lock, ID, MQ) và lý do chọn lựa; CAP/BASE, consistent hashing, v.v. có thể lấy ví dụ minh họa.

### Giai đoạn 6: JVM (công ty lớn / một số công ty vừa)

Mục tiêu Alibaba, Meituan, Ctrip, SF Express, CMB, v.v. có thể tập trung xem; ứng tuyển doanh nghiệp nhà nước hoặc công ty nhỏ có thể bỏ qua.

- [Java Memory Area](https://javaguide.cn/java/jvm/memory-area.html), [JVM Garbage Collection](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)
- [Class File Structure](https://javaguide.cn/java/jvm/class-file-structure.html), [Class Loading Process](https://javaguide.cn/java/jvm/class-loading-process.html), [ClassLoader](https://javaguide.cn/java/jvm/classloader.html)
- Kết hợp với [Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) [Các case vấn đề trực tuyến phổ biến](https://t.zsxq.com/0bsAac47U) để hiểu tuning và điều tra (cũng có thể tham khảo bài [JVM Online Problem Diagnosis và Performance Tuning Case](https://javaguide.cn/java/jvm/jvm-in-action.html))

**Tự kiểm tra**: Có thể nói rõ vùng nhớ, các GC collector phổ biến và quá trình thu hồi, class loading và Parent Delegation Model; có thể kết hợp dự án hoặc case để nói về một lần GC tuning hoặc ý tưởng điều tra OOM.

**Java New Features** (chọn đọc theo yêu cầu vị trí): [Java 11](https://javaguide.cn/java/new-features/java11.html), [Java 17](https://javaguide.cn/java/new-features/java17.html), [Java 21](https://javaguide.cn/java/new-features/java21.html)

### Danh sách nước rút 1~2 ngày trước phỏng vấn

Khi gần đến ngày phỏng vấn, ưu tiên làm những việc sau, tránh ôn tập tạm bợ mất phương hướng:

| Hạng mục                       | Giải thích                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ôn lại danh sách câu hỏi bắt buộc | Tập trung xem "câu hỏi bắt buộc liên quan đến dự án" đã sắp xếp ở Giai đoạn 1 + các điểm thi tương ứng với "thành thạo" ghi trên CV, có thể nói miệng lại ý chính là được. |
| Luyện lại kịch bản dự án       | Mỗi dự án nói một lần phiên bản 1 phút, phiên bản 3 phút, chỗ nào bị kẹt ghi lại rồi nói lại cho trôi chảy.                                                                 |
| Xu hướng công ty/vị trí mục tiêu | Lật xem kinh nghiệm phỏng vấn của công ty đó hoặc vị trí cùng loại, xem có thiên về gì không (như thuật toán, mạng máy tính, đào sâu dự án), ôn tập có mục tiêu.            |
| Tâm lý và trạng thái           | Ngủ sớm, chuẩn bị thiết bị (phỏng vấn online) hoặc lộ trình (phỏng vấn trực tiếp), có thể xem [Quá lo lắng khi phỏng vấn phải làm sao?](https://javaguide.cn/interview-preparation/how-to-handle-interview-nerves.html). |

Sau khi phỏng vấn kết thúc, đề xuất làm một lần tổng kết ngắn: câu nào trả lời không tốt, câu nào chưa chuẩn bị đến, bổ sung vào danh sách câu hỏi bắt buộc, trước lần phỏng vấn sau tập trung ôn lại một lần.