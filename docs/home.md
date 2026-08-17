---
icon: "mdi:head-lightbulb-outline"
title: Hướng dẫn phỏng vấn Java (Tổng hợp câu hỏi phỏng vấn Backend JavaGuide)
description: Hướng dẫn phỏng vấn Java JavaGuide, tổng hợp có hệ thống các câu hỏi lý thuyết kinh điển và câu hỏi phỏng vấn Backend, bao quát Java cơ bản, Collections, Concurrency, JVM, Spring, MySQL, Redis, Thiết kế hệ thống và Hệ thống phân tán, phù hợp cho việc ôn tập tuyển dụng Fresher và người có kinh nghiệm.
sitemap:
  changefreq: weekly
  priority: 1
head:
  - - meta
    - name: keywords
      content: Phỏng vấn Java, Hướng dẫn phỏng vấn Java, Lý thuyết phỏng vấn Java, Câu hỏi phỏng vấn Java, Phỏng vấn Java cơ bản, Phỏng vấn JVM, Phỏng vấn Concurrency, Phỏng vấn Thread pool, Phỏng vấn Spring, Phỏng vấn MySQL, Phỏng vấn Redis, Phỏng vấn thiết kế hệ thống, Phỏng vấn hệ thống phân tán, Phỏng vấn backend
---

<!-- @include: @small-advertisement.snippet.md -->

<!-- markdownlint-disable MD024 -->

JavaGuide là một tài liệu **Hướng dẫn phỏng vấn Java** và **Ôn tập phỏng vấn Backend chung** được hệ thống hóa, nội dung bao quát các điểm kiến thức cốt lõi như: Java cơ bản, Collections, Lập trình đồng thời (Concurrency), JVM, Spring/Spring Boot, MySQL, Redis, Hệ thống phân tán, Xử lý đồng thời cao (High Concurrency), Tính sẵn sàng cao (High Availability) và Thiết kế hệ thống.

Nếu bạn đang chuẩn bị cho các đợt tuyển dụng tại trường (Fresher), tuyển dụng người có kinh nghiệm hoặc nhảy việc, bạn có thể bắt đầu từ [Kế hoạch vượt qua phỏng vấn Backend Java](./interview-preparation/backend-interview-plan.md), sau đó ôn tập dần theo các học phần bên dưới với các câu hỏi lý thuyết Java kinh điển và câu hỏi phỏng vấn Backend có tần suất hỏi cao.

Toàn bộ nội dung trên trang web này đều được mã nguồn mở và miễn phí. Hoan nghênh mọi người cùng [bảo trì và hoàn thiện](http://localhost:8080/javaguide/contribution-guideline.html). Nếu thấy hữu ích, xin hãy cho một Star!

- **Địa chỉ dự án**: <https://github.com/Snailclimb/JavaGuide>
- **Đọc trực tuyến**: <https://javaguide.cn/>

## Tài liệu tham khảo thêm

- [Các dự án mã nguồn mở Java chất lượng](./open-source-project/)：Tuyển chọn các dự án mã nguồn mở Java trên Gitee/GitHub phù hợp để học tập, thực chiến và đưa vào CV.
- [Giới thiệu sách công nghệ chất lượng](./books/)：Bao quát các lĩnh vực: Kiến thức cơ bản về Khoa học Máy tính (CS), Cơ sở dữ liệu, Công cụ tìm kiếm, Hệ thống phân tán, Kiến trúc sẵn sàng cao (High Availability), v.v.

## Chuẩn bị phỏng vấn

- [⭐Kế hoạch vượt qua phỏng vấn Backend Java (Bao quát hệ thống Backend chung)](./interview-preparation/backend-interview-plan.md) (Nhất định phải đọc :+1:)
- [Làm thế nào để chuẩn bị phỏng vấn Java một cách hiệu quả?](./interview-preparation/teach-you-how-to-prepare-for-the-interview-hand-in-hand.md)
- [Tổng hợp các trọng tâm phỏng vấn Backend Java](./interview-preparation/key-points-of-interview.md)
- [Lộ trình học Java (Phiên bản mới nhất, hơn 40k chữ)](./interview-preparation/java-roadmap.md)
- [Hướng dẫn viết CV cho lập trình viên](./interview-preparation/resume-guide.md)
- [Hướng dẫn trình bày kinh nghiệm dự án](./interview-preparation/project-experience-guide.md)
- [Quá căng thẳng khi phỏng vấn thì phải làm sao?](./interview-preparation/how-to-handle-interview-nerves.md)
- [Phỏng vấn Fresher không có kinh nghiệm thực tập thì làm thế nào? Kinh nghiệm thực tập viết ra sao?](./interview-preparation/internship-experience.md)

## Java

### Cơ bản

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn** : (Nhất định phải đọc :+1: )：

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp trong Java cơ bản (Phần 1)](./java/basis/java-basic-questions-01.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp trong Java cơ bản (Phần 2)](./java/basis/java-basic-questions-02.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp trong Java cơ bản (Phần 3)](./java/basis/java-basic-questions-03.md)

**Giải chi tiết các điểm kiến thức quan trọng**：

- [Tại sao trong Java chỉ có truyền tham trị (Pass-by-value)?](./java/basis/why-there-only-value-passing-in-java.md)
- [Giải chi tiết về Serialization (Tuần tự hóa) trong Java](./java/basis/serialization.md)
- [Giải chi tiết về Generics & Wildcards](./java/basis/generics-and-wildcards.md)
- [Giải chi tiết về cơ chế Reflection trong Java](./java/basis/reflection.md)
- [Giải chi tiết về Design Pattern Proxy trong Java](./java/basis/proxy.md)
- [Giải chi tiết về BigDecimal](./java/basis/bigdecimal.md)
- [Giải chi tiết về class ma thuật Unsafe trong Java](./java/basis/unsafe.md)
- [Giải chi tiết về cơ chế SPI trong Java](./java/basis/spi.md)
- [Giải chi tiết về Syntactic Sugar (Cú pháp kẹo ngọt) trong Java](./java/basis/syntactic-sugar.md)

### Collections (Tập hợp)

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn**：

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Java Collections (Phần 1)](./java/collection/java-collection-questions-01.md) (Nhất định phải đọc :+1:)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Java Collections (Phần 2)](./java/collection/java-collection-questions-02.md) (Nhất định phải đọc :+1:)
- [Tổng hợp các lưu ý khi sử dụng Java Collections](./java/collection/java-collection-precautions-for-use.md)

**Phân tích Mã nguồn (Source Code)**：

- [Phân tích mã nguồn cốt lõi ArrayList + Cơ chế mở rộng dung lượng](./java/collection/arraylist-source-code.md)
- [Phân tích mã nguồn cốt lõi LinkedList](./java/collection/linkedlist-source-code.md)
- [Phân tích mã nguồn cốt lõi HashMap + Cấu trúc dữ liệu bên dưới](./java/collection/hashmap-source-code.md)
- [Phân tích mã nguồn cốt lõi ConcurrentHashMap + Cấu trúc dữ liệu bên dưới](./java/collection/concurrent-hash-map-source-code.md)
- [Phân tích mã nguồn cốt lõi LinkedHashMap](./java/collection/linkedhashmap-source-code.md)
- [Phân tích mã nguồn cốt lõi CopyOnWriteArrayList](./java/collection/copyonwritearraylist-source-code.md)
- [Phân tích mã nguồn cốt lõi ArrayBlockingQueue](./java/collection/arrayblockingqueue-source-code.md)
- [Phân tích mã nguồn cốt lõi PriorityQueue](./java/collection/priorityqueue-source-code.md)
- [Phân tích mã nguồn cốt lõi DelayQueue](./java/collection/priorityqueue-source-code.md)

### I/O

- [Tổng hợp kiến thức cơ bản về I/O](./java/io/io-basis.md)
- [Tổng hợp các Design Pattern trong I/O](./java/io/io-design-patterns.md)
- [Giải chi tiết về các Mô hình I/O (I/O Models)](./java/io/io-model.md)
- [Tổng hợp kiến thức cốt lõi về NIO](./java/io/nio-basis.md)

### Concurrency (Lập trình đồng thời)

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn** : (Nhất định phải đọc :+1:)

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Java Concurrency (Phần 1)](./java/concurrent/java-concurrent-questions-01.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Java Concurrency (Phần 2)](./java/concurrent/java-concurrent-questions-02.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Java Concurrency (Phần 3)](./java/concurrent/java-concurrent-questions-03.md)

**Giải chi tiết các điểm kiến thức quan trọng**：

- [Giải chi tiết về Optimistic Lock (Khóa lạc quan) và Pessimistic Lock (Khóa bi quan)](./java/concurrent/optimistic-lock-and-pessimistic-lock.md)
- [Giải chi tiết về CAS (Compare-And-Swap)](./java/concurrent/cas.md)
- [Giải chi tiết về JMM (Java Memory Model - Mô hình bộ nhớ Java)](./java/concurrent/jmm.md)
- **Thread Pool**：[Giải chi tiết về Java Thread Pool](./java/concurrent/java-thread-pool-summary.md)、[Thực hành tốt nhất (Best Practices) với Java Thread Pool](./java/concurrent/java-thread-pool-best-practices.md)
- [Giải chi tiết về ThreadLocal](./java/concurrent/threadlocal.md)
- [Tổng hợp các Collections đồng thời (Concurrent Collections) trong Java](./java/concurrent/java-concurrent-collections.md)
- [Tổng hợp các class Atomic](./java/concurrent/atomic-classes.md)
- [Giải chi tiết về AQS (AbstractQueuedSynchronizer)](./java/concurrent/aqs.md)
- [Giải chi tiết về CompletableFuture](./java/concurrent/completablefuture-intro.md)

### JVM (Nhất định phải đọc :+1:)

Phần nội dung về JVM này chủ yếu tham khảo [Java Virtual Machine Specification - Java 8](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) và cuốn [《Hiểu sâu về Java Virtual Machine (Tái bản lần 3)》](https://book.douban.com/subject/34907497/) của thầy Châu Chí Minh (Rất khuyến khích các bạn đọc đi đọc lại nhiều lần!).

- **[Các vùng nhớ trong Java (Memory Area)](./java/jvm/memory-area.md)**
- **[Thu gom rác (Garbage Collection) trong JVM](./java/jvm/jvm-garbage-collection.md)**
- [Cấu trúc tệp Class](./java/jvm/class-file-structure.md)
- **[Quá trình nạp Class (Class Loading Process)](./java/jvm/class-loading-process.md)**
- [ClassLoader (Bộ nạp lớp)](./java/jvm/classloader.md)
- [【Chờ hoàn thiện】Tổng hợp các tham số JVM quan trọng nhất (Đã dịch và hoàn thiện một nửa)](./java/jvm/jvm-parameters-intro.md)
- [【Bài học thêm】Giải thích JVM bằng ngôn ngữ bình dân dễ hiểu](./java/jvm/jvm-intro.md)
- [Các công cụ giám sát và xử lý sự cố JDK](./java/jvm/jdk-monitoring-and-troubleshooting-tools.md)

### Tính năng mới

- **Java 8**：[Tổng hợp tính năng mới của Java 8 (Bản dịch)](./java/new-features/java8-tutorial-translate.md)、[Tổng hợp các tính năng mới thường dùng trong Java 8](./java/new-features/java8-common-new-features.md)
- [Tổng quan các tính năng mới trong Java 9](./java/new-features/java9.md)
- [Tổng quan các tính năng mới trong Java 10](./java/new-features/java10.md)
- [Tổng quan các tính năng mới trong Java 11](./java/new-features/java11.md)
- [Tổng quan các tính năng mới trong Java 12 & 13](./java/new-features/java12-13.md)
- [Tổng quan các tính năng mới trong Java 14 & 15](./java/new-features/java14-15.md)
- [Tổng quan các tính năng mới trong Java 16](./java/new-features/java16.md)
- [Tổng quan các tính năng mới trong Java 17](./java/new-features/java17.md)
- [Tổng quan các tính năng mới trong Java 18](./java/new-features/java18.md)
- [Tổng quan các tính năng mới trong Java 19](./java/new-features/java19.md)
- [Tổng quan các tính năng mới trong Java 20](./java/new-features/java20.md)
- [Tổng quan các tính năng mới trong Java 21](./java/new-features/java21.md)
- [Tổng quan các tính năng mới trong Java 22 & 23](./java/new-features/java22-23.md)
- [Tổng quan các tính năng mới trong Java 24](./java/new-features/java24.md)
- [Tổng quan các tính năng mới trong Java 25](./java/new-features/java25.md)

## Kiến thức cơ bản về Khoa học Máy tính

> Các kiến thức nền tảng về KHMT (Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu & Thuật toán) đã được tách thành một học phần độc lập, xem chi tiết tại [Tổng hợp kiến thức cơ bản KHMT](./cs-basics/).

[![Banner](https://oss.javaguide.cn/xingqiu/xingqiu.png)](./about-the-author/zhishixingqiu-two-years.md)

## Cơ sở dữ liệu (Database)

### Cơ bản

- [Tổng hợp kiến thức cơ bản về Cơ sở dữ liệu](./database/basis.md)
- [Tổng hợp kiến thức cơ bản về NoSQL](./database/nosql.md)
- [Giải chi tiết về Character Set (Bộ ký tự)](./database/character-set.md)
- SQL :
  - [Tổng hợp kiến thức cơ bản về cú pháp SQL](./database/sql/sql-syntax-summary.md)
  - [Tổng hợp các câu hỏi phỏng vấn SQL thường gặp](./database/sql/sql-questions-01.md)

### MySQL

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn：**

- **[Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về MySQL](./database/mysql/mysql-questions-01.md)** (Nhất định phải đọc :+1:)
- [Tổng hợp các đề xuất quy chuẩn tối ưu hóa hiệu suất cao trong MySQL](./database/mysql/mysql-high-performance-optimization-specification-recommendations.md)

**Kiến thức quan trọng：**

- [Giải chi tiết về Index trong MySQL](./database/mysql/mysql-index.md)
- [Tổng hợp các trường hợp làm vô hiệu hóa Index (Index Invalidation) trong MySQL](./database/mysql/mysql-index-invalidation.md)
- [Giải chi tiết (có hình ảnh) về các Mức độ cô lập giao dịch (Transaction Isolation Level) trong MySQL](./database/mysql/transaction-isolation-level.md)
- [Giải chi tiết về 3 loại Log chính trong MySQL (binlog, redo log và undo log)](./database/mysql/mysql-logs.md)
- [Cách Storage Engine InnoDB triển khai MVCC](./database/mysql/innodb-implementation-of-mvcc.md)
- [Quá trình thực thi câu lệnh SQL trong MySQL](./database/mysql/how-sql-executed-in-mysql.md)
- [Giải chi tiết về Query Cache trong MySQL](./database/mysql/mysql-query-cache.md)
- [Phân tích Kế hoạch thực thi (Execution Plan) trong MySQL](./database/mysql/mysql-query-execution-plan.md)
- [Khóa chính tự tăng (Auto-increment Primary Key) trong MySQL có chắc chắn liên tục không?](./database/mysql/mysql-auto-increment-primary-key-continuous.md)
- [Đề xuất lưu trữ dữ liệu kiểu thời gian (Time type) trong MySQL](./database/mysql/some-thoughts-on-database-storage-time.md)
- [Chuyển đổi kiểu ngầm định (Implicit conversion) làm vô hiệu hóa Index trong MySQL](./database/mysql/index-invalidation-caused-by-implicit-conversion.md)

### Redis

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn** : (Nhất định phải đọc :+1: )：

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Redis (Phần 1)](./database/redis/redis-questions-01.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Redis (Phần 2)](./database/redis/redis-questions-02.md)

**Kiến thức quan trọng：**

- [Giải chi tiết 3 chiến lược Đọc/Ghi Cache thường dùng](./database/redis/3-commonly-used-cache-read-and-write-strategies.md)
- [Redis có thể làm Message Queue được không? Triển khai như thế nào?](./database/redis/redis-stream-mq.md)
- [Giải chi tiết 5 cấu trúc dữ liệu cơ bản trong Redis](./database/redis/redis-data-structures-01.md)
- [Giải chi tiết 3 cấu trúc dữ liệu đặc biệt trong Redis](./database/redis/redis-data-structures-02.md)
- [Giải chi tiết về cơ chế Persistence (Bền vững hóa dữ liệu) trong Redis](./database/redis/redis-persistence.md)
- [Giải chi tiết về Phân mảnh bộ nhớ (Memory Fragmentation) trong Redis](./database/redis/redis-memory-fragmentation.md)
- [Tổng hợp các nguyên nhân gây Blocking (Nghẽn) thường gặp trong Redis](./database/redis/redis-common-blocking-problems-summary.md)
- [Giải chi tiết về Redis Cluster (Cụm Redis)](./database/redis/redis-cluster.md)

### MongoDB

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về MongoDB (Phần 1)](./database/mongodb/mongodb-questions-01.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về MongoDB (Phần 2)](./database/mongodb/mongodb-questions-02.md)

## Công cụ tìm kiếm (Search Engine)

[Tổng hợp các câu hỏi phỏng vấn Elasticsearch thường gặp (Trả phí)](./database/elasticsearch/elasticsearch-questions-01.md)

![JavaGuide Official WeChat Account](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)

## Công cụ phát triển

### Maven

- [Tổng hợp các khái niệm cốt lõi của Maven](./tools/maven/maven-core-concepts.md)
- [Thực hành tốt nhất (Best Practices) với Maven](./tools/maven/maven-best-practices.md)

### Gradle

[Tổng hợp các khái niệm cốt lõi của Gradle](./tools/gradle/gradle-core-concepts.md) (Tùy chọn, hiện tại trong nước sử dụng Maven vẫn phổ biến hơn)

### Docker

- [Tổng hợp các khái niệm cốt lõi của Docker](./tools/docker/docker-intro.md)
- [Thực chiến Docker](./tools/docker/docker-in-action.md)

### Git

- [Tổng hợp các khái niệm cốt lõi của Git](./tools/git/git-intro.md)
- [Tổng hợp các mẹo nhỏ hữu ích trên GitHub](./tools/git/github-tips.md)

## Thiết kế hệ thống (System Design)

- [⭐Tổng hợp các câu hỏi phỏng vấn Thiết kế hệ thống thường gặp](./system-design/system-design-questions.md)
- [⭐Tổng hợp các câu hỏi phỏng vấn Design Pattern thường gặp](https://interview.javaguide.cn/system-design/design-pattern.html)

### Cơ bản

- [Hướng dẫn ngắn gọn về RESTful API](./system-design/basis/RESTfulAPI.md)
- [Hướng dẫn ngắn gọn về Kỹ nghệ phần mềm (Software Engineering)](./system-design/basis/software-engineering.md)
- [Hướng dẫn quy tắc đặt tên code](./system-design/basis/naming.md)
- [Hướng dẫn Refactoring (Tái cấu trúc) code](./system-design/basis/refactoring.md)
- [Hướng dẫn Unit Test (Kiểm thử đơn vị)](./system-design/basis/unit-test.md)

### Các Framework thông dụng

#### Spring/SpringBoot (Nhất định phải đọc :+1:)

**Tổng hợp Kiến thức/Câu hỏi phỏng vấn** :

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Spring](./system-design/framework/spring/spring-knowledge-and-questions-summary.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về SpringBoot](./system-design/framework/spring/springboot-knowledge-and-questions-summary.md)
- [Tổng hợp các Annotation thường dùng trong Spring/Spring Boot](./system-design/framework/spring/spring-common-annotations.md)
- [Hướng dẫn nhập môn SpringBoot](https://github.com/Snailclimb/springboot-guide)

**Giải chi tiết các điểm kiến thức quan trọng**：

- [Giải chi tiết về IoC & AOP (Hiểu nhanh)](./system-design/framework/spring/ioc-and-aop.md)
- [Giải chi tiết về Transaction trong Spring](./system-design/framework/spring/spring-transaction.md)
- [Giải chi tiết về các Design Pattern trong Spring](./system-design/framework/spring/spring-design-patterns-summary.md)
- [Giải chi tiết nguyên lý Auto Assembly (Tự động lắp ráp) trong SpringBoot](./system-design/framework/spring/spring-boot-auto-assembly-principles.md)

#### MyBatis

[Tổng hợp các câu hỏi phỏng vấn MyBatis thường gặp](./system-design/framework/mybatis/mybatis-interview.md)

### Bảo mật (Security)

#### Xác thực & Cấp quyền (Authentication & Authorization)

- [Giải chi tiết các khái niệm cơ bản về Xác thực và Cấp quyền](./system-design/security/basis-of-authority-certification.md)
- [Giải chi tiết các khái niệm cơ bản về JWT](./system-design/security/jwt-intro.md)
- [Phân tích ưu nhược điểm của JWT và giải pháp cho các vấn đề thường gặp](./system-design/security/advantages-and-disadvantages-of-jwt.md)
- [Giải chi tiết về SSO (Single Sign-On - Đăng nhập một lần)](./system-design/security/sso-intro.md)
- [Giải chi tiết về Thiết kế hệ thống phân quyền](./system-design/security/design-of-authority-system.md)

#### Bảo mật dữ liệu

- [Tổng hợp các thuật toán mã hóa phổ biến](./system-design/security/encryption-algorithms.md)
- [Tổng hợp các giải pháp lọc từ ngữ nhạy cảm](./system-design/security/sentive-words-filter.md)
- [Tổng hợp các giải pháp che giấu dữ liệu (Data Desensitization)](./system-design/security/data-desensitization.md)
- [Tại sao cả Frontend và Backend đều phải Validate (xác thực) dữ liệu?](./system-design/security/data-validation.md)
- [Tại sao khi quên mật khẩu chỉ có thể reset mà không thể cho bạn biết mật khẩu cũ?](./system-design/security/why-password-reset-instead-of-retrieval.md)

### Tác vụ định kỳ (Scheduled Tasks)

[Giải chi tiết về Tác vụ định kỳ trong Java](./system-design/schedule-task.md)

### Đẩy tin nhắn Web theo thời gian thực (Web Real-Time Push)

[Giải chi tiết về Đẩy tin nhắn Web theo thời gian thực](./system-design/web-real-time-message-push.md)

## Hệ thống phân tán (Distributed System)

- [⭐Câu hỏi phỏng vấn Hệ thống phân tán tần suất cao](https://interview.javaguide.cn/distributed-system/distributed-system.html)
- [Nhập môn Hệ thống phân tán](./distributed-system/distributed-system-intro.md)

### Lý thuyết & Thuật toán & Giao thức

- [Giải mã Định lý CAP và Định lý BASE](./distributed-system/protocol/cap-and-base-theorem.md)
- [Giải chi tiết về Điều phối phân tán (Distributed Coordination)](./distributed-system/protocol/centralized-and-decentralized.md)
- [Giải chi tiết Bài toán Tướng quân Byzantine](./distributed-system/protocol/byzantine-generals-problem.md)
- [Giải mã Thuật toán Paxos](./distributed-system/protocol/paxos-algorithm.md)
- [Giải mã Thuật toán Raft](./distributed-system/protocol/raft-algorithm.md)
- [Giải mã Giao thức ZAB](./distributed-system/protocol/zab.md)
- [Giải chi tiết Giao thức Gossip](./distributed-system/protocol/gossip-protocol.md)
- [Giải chi tiết Thuật toán Consistent Hashing (Băm nhất quán)](./distributed-system/protocol/consistent-hashing.md)

### RPC

- [Tổng hợp kiến thức cơ bản về RPC](./distributed-system/rpc/rpc-intro.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Dubbo](./distributed-system/rpc/dubbo.md)

### ZooKeeper

> Hai bài viết này có thể có phần nội dung trùng lặp, khuyến khích các bạn nên đọc cả hai.

- [Tổng hợp các khái niệm liên quan đến ZooKeeper (Nhập môn)](./distributed-system/distributed-process-coordination/zookeeper/zookeeper-intro.md)
- [Tổng hợp các khái niệm liên quan đến ZooKeeper (Nâng cao)](./distributed-system/distributed-process-coordination/zookeeper/zookeeper-plus.md)

### API Gateway

- [Tổng hợp kiến thức cơ bản về API Gateway](./distributed-system/api-gateway.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Spring Cloud Gateway](./distributed-system/spring-cloud-gateway-questions.md)

### ID Phân tán (Distributed ID)

- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Distributed ID](./distributed-system/distributed-id.md)
- [Hướng dẫn thiết kế Distributed ID](./distributed-system/distributed-id-design.md)

### Khóa phân tán (Distributed Lock)

- [Giới thiệu về Distributed Lock](https://javaguide.cn/distributed-system/distributed-lock.html)
- [Tổng hợp các giải pháp triển khai Distributed Lock phổ biến](https://javaguide.cn/distributed-system/distributed-lock-implementations.html)

### Giao dịch phân tán (Distributed Transaction)

[Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Distributed Transaction](./distributed-system/distributed-transaction.md)

### Trung tâm cấu hình phân tán (Distributed Configuration Center)

[Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Trung tâm cấu hình phân tán](./distributed-system/distributed-configuration-center.md)

## Hiệu suất cao (High Performance)

### Tối ưu hóa Cơ sở dữ liệu

- [Phân tách Đọc/Ghi (Read-Write Separation) và Phân chia Database/Table (Sharding)](./high-performance/read-and-write-separation-and-library-subtable.md)
- [Phân tách dữ liệu Nóng/Lạnh](./high-performance/data-cold-hot-separation.md)
- [Tổng hợp các kỹ thuật Tối ưu hóa SQL phổ biến](./high-performance/sql-optimization.md)
- [Giới thiệu về Phân trang sâu (Deep Pagination) và Đề xuất tối ưu hóa](./high-performance/deep-pagination-optimization.md)

### Cân bằng tải (Load Balancing)

[Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Load Balancing](./high-performance/load-balancing.md)

### CDN

[Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về CDN (Content Delivery Network - Mạng phân phối nội dung)](./high-performance/cdn.md)

### Message Queue (Hàng đợi tin nhắn)

- [Tổng hợp kiến thức cơ bản về Message Queue](./high-performance/message-queue/message-queue.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Disruptor](./high-performance/message-queue/disruptor-questions.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về RabbitMQ](./high-performance/message-queue/rabbitmq-questions.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về RocketMQ](./high-performance/message-queue/rocketmq-questions.md)
- [Tổng hợp kiến thức & câu hỏi phỏng vấn thường gặp về Kafka](./high-performance/message-queue/kafka-questions-01.md)

## Tính sẵn sàng cao (High Availability)

[Hướng dẫn Thiết kế hệ thống tính sẵn sàng cao](./high-availability/high-availability-system-design.md)

### Thiết kế dự phòng (Redundancy)

[Giải chi tiết về Thiết kế dự phòng](./high-availability/redundancy.md)

### Giới hạn lượng truy cập (Rate Limiting)

[Giải chi tiết về Giới hạn lượng truy cập dịch vụ (Rate Limiting)](./high-availability/limit-request.md)

### Giảm cấp (Fallback) & Ngắt mạch (Circuit Breaker)

[Giải chi tiết về Giảm cấp & Ngắt mạch](./high-availability/fallback-and-circuit-breaker.md)

### Hết thời gian chờ (Timeout) & Thử lại (Retry)

[Giải chi tiết về Timeout & Retry](./high-availability/timeout-and-retry.md)

### Cụm (Cluster)

Triển khai dịch vụ giống nhau thành nhiều bản sao để tránh điểm lỗi đơn lẻ (Single Point of Failure).

### Thiết kế Khôi phục sau thảm họa (Disaster Recovery) và Đa trung tâm hoạt động đồng thời (Active-Active Geo-Redundancy)

**Khôi phục sau thảm họa (Disaster Recovery - DR)** = Chống chịu thảm họa (Fault Tolerance/Disaster Tolerance) + Sao lưu (Backup).

- **Sao lưu (Backup)**: Tạo nhiều bản sao lưu cho toàn bộ dữ liệu quan trọng do hệ thống sinh ra.
- **Chống chịu thảm họa (Disaster Tolerance)**: Xây dựng hai hệ thống hoàn toàn giống nhau ở các vị trí địa lý khác nhau. Khi hệ thống ở một nơi bị sập đột ngột, toàn bộ hệ thống ứng dụng có thể chuyển đổi sang hệ thống kia, nhờ vậy mà hệ thống vẫn có thể cung cấp dịch vụ bình thường.

**Đa trung tâm hoạt động đồng thời (Active-Active Geo-Redundancy)** mô tả việc triển khai dịch vụ ở các vị trí địa lý khác nhau và tất cả các dịch vụ này đều cung cấp dịch vụ ra bên ngoài CÙNG LÚC. Điểm khác biệt lớn nhất so với thiết kế DR truyền thống nằm ở chữ "Đa hoạt động (Multi-Active)", tức là tất cả các site đều đồng thời xử lý yêu cầu. Thiết kế Active-Active Geo-Redundancy nhằm đối phó với các tình huống bất ngờ như hỏa hoạn, động đất hoặc các thảm họa do thiên nhiên hay con người gây ra.
