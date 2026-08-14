---
title: Lộ trình học Java Backend (Phiên bản mới nhất 2026)
description: Lộ trình học Java Backend phiên bản mới nhất 2026, bao gồm Java căn bản, cơ sở dữ liệu, framework, công cụ, JVM, lập trình đồng thời, phân tán, high concurrency, high availability, microservice, phát triển ứng dụng AI và thực hành dự án, phù hợp cho việc học hệ thống Java Backend và chuẩn bị tìm việc.
category: Lộ trình học tập
head:
  - - meta
    - name: keywords
      content: Lộ trình học Java,Lộ trình học Java Backend,Lộ trình học Java 2026,Java Backend,Phỏng vấn Java,Spring Boot,MySQL,Redis,JVM,Java đồng thời,phân tán,microservice,phát triển ứng dụng AI
---

Đây là phiên bản mới nhất 2026 của lộ trình học Java, mỗi năm đều được tối ưu và cải tiến toàn diện dựa trên những yêu cầu tuyển dụng mới nhất của ngành Java Backend.

Bài viết này có lẽ là lộ trình học Java Backend kỹ công và toàn diện nhất mà bạn từng thấy, với hơn 4 vạn từ. Tuy nhiên, bạn cũng không cần lo lắng vì nội dung quá nhiều không học hết được. Tôi sẽ phân loại theo độ khó học, đưa ra những nội dung bắt buộc phải học để tìm được một công việc ở công ty nhỏ, cũng như lộ trình học tập phù hợp để từng bước nâng cao kỹ năng phát triển Java Backend.

Đối với người mới bắt đầu, bạn có thể học một cách hệ thống theo lộ trình và tài liệu được giới thiệu trong bài viết này; đối với những developer có kinh nghiệm, bạn có thể dựa vào bài viết này để học sâu hơn về phát triển Java Backend, nâng cao năng lực cạnh tranh của bản thân.

Để đảm bảo nội dung không quá hỗn tạp, bài viết này sẽ không triển khai về phương pháp học và lời khuyên trưởng thành, phần này có thể xem vài bài viết trong phần «Chương trình cuộc đời» (程序人生) của JavaGuide:

- [Lập trình viên làm thế nào để nhanh chóng học công nghệ mới](https://javaguide.cn/high-quality-technical-articles/advanced-programmer/programmer-quickly-learn-new-technology.html)
- [Chiến lược tăng trưởng kỹ thuật của lập trình viên](https://javaguide.cn/high-quality-technical-articles/advanced-programmer/the-growth-strategy-of-the-technological-giant.html)
- [Bảy lời khuyên dành cho những ai muốn trưởng thành thành developer cấp cao](https://javaguide.cn/high-quality-technical-articles/advanced-programmer/seven-tips-for-becoming-an-advanced-programmer.html)

Bài viết này cũng sẽ không đề cập đến nội dung kiến thức cơ sở máy tính, về việc học kiến thức cơ bản máy tính có thể tham khảo chia sẻ trên website của tôi: [Đề xuất sách cơ bản máy tính](https://javaguide.cn/books/cs-basics.html).

Nói thêm một câu: Đối với người mới học lập trình, tôi không khuyên bạn lên học thông qua làm dự án ngay. Thực hành quả thực rất quan trọng, nhưng nếu bạn không có nền tảng lập trình, trực tiếp nhảy vào thực chiến sẽ rất dễ thành công là không ra gì. Khuyên bạn trong giai đoạn đầu học lập trình nên xem nhiều video chất lượng cao. Đi từng bước theo video sẽ giúp bạn tránh được nhiều hầm hố, đồng thời tăng sự tự tin khi học lập trình.

## Tổng quan lộ trình học Java Backend

Tôi đã vẽ một hình, trước tiên để mọi người thấy toàn cảnh lộ trình học Java Backend và thứ tự học mà tôi khuyến nghị.

Mọi kiến thức trong hình dưới đây sẽ được giới thiệu chi tiết ở phần sau (kèm giới thiệu tài nguyên học tập).

![Tổng quan lộ trình học Java Backend](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/java-learning-route-2024.png)

Phiên bản gốc + bản PDF của hình trên, có thể theo dõi tài khoản WeChat **«JavaGuide»** và phản hồi "**lộ trình học**" để nhận.

![Tài khoản WeChat chính thức JavaGuide](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)

**Nội dung nhiều quá? Bị choảng?** Nếu bạn chỉ muốn tìm một công việc phát triển ở công ty nhỏ, khuyên bạn nên tập trung vào Java căn bản, cơ sở dữ liệu, framework thông dụng, công cụ thông dụng.

Giống những điểm kiến thức như JVM, phân tán, high concurrency, high availability, microservice, nếu bạn muốn vào công ty lớn hoặc muốn bản thân cạnh tranh hơn khi tìm việc, thì bạn cũng cần dành thêm thời gian học.

Hiện nay phỏng vấn rất cạnh tranh, muốn tìm được công việc tốt thì cần phải học nhiều hơn, luyện tập nhiều hơn. Dù hiện tại bạn học nhiều kiến thức mà sau khi đi làm có thể không dùng đến, nhưng quá trình chọn lọc phỏng vấn lại cần bạn biết những điều này. Dù sao, nhiều vị trí là nhiều người cùng cạnh tranh, để đạt hiệu quả sàng lọc, độ khó phỏng vấn thường sẽ khá lớn. Đây chính là cái gọi là: "Phỏng vấn xây tên lửa, vào làm vặn ốc".

## Công nghệ Java đã bị loại bỏ

Bài viết [Công nghệ Java đã bị loại bỏ, đừng học nữa!](https://javaguide.cn/about-the-author/deprecated-java-technologies.html) đã nêu ra những công nghệ đã bị loại bỏ trong lĩnh vực phát triển Java. Nhất định nhất định nhất định đừng học nữa! Ai khuyên bạn học những công nghệ dưới đây, cứ tát thẳng cho hắn hai cái.

**JSP**

- **Lý do**: JSP đã lỗi thời, không đáp ứng được nhu cầu phát triển Web hiện đại; kiến trúc tách frontend-backend trở thành xu thế chính.
- **Giải pháp thay thế**: template engine (như Thymeleaf, Freemarker) phổ biến hơn trong phát triển full-stack truyền thống; còn trong kiến trúc tách frontend-backend, các framework frontend hiện đại như React, Vue, Angular đã thay thế vai trò của JSP.
- **Lưu ý**: Một số dự án cũ của doanh nghiệp nhà nước (quốc doanh) và doanh nghiệp trung ương (央企) có thể vẫn còn dùng JSP, nhưng tình trạng này ngày càng hiếm.

**Struts (đặc biệt là 1.x)**

- **Lý do**: Cấu hình phức tạp, hiệu quả phát triển thấp, và tồn tại lỗ hổng bảo mật nghiêm trọng (như lỗ hổng Apache Struts 2 nổi tiếng thế giới). Ngoài ra, cộng đồng bảo trì không đủ, hệ sinh thái dần thu hẹp.
- **Giải pháp thay thế**: Spring MVC và Spring WebFlux cung cấp trải nghiệm phát triển đơn giản hơn, chức năng mạnh mẽ hơn và hỗ trợ cộng đồng hoàn thiện, hoàn toàn thay thế Struts.

**EJB (Enterprise JavaBeans)**

- **Lý do**: EJB quá phức tạp, chi phí phát triển cao, đường cong học tập dốc, trong dự án thực tế dần bị các framework nhẹ hơn thay thế.
- **Giải pháp thay thế**: Spring/Spring Boot cung cấp giải pháp phát triển cấp doanh nghiệp đơn giản và mạnh mẽ, gần như đã trở thành tiêu chuẩn thực tế của phát triển doanh nghiệp Java. Ngoài ra, Solon nội địa (Trung Quốc) và Quarkus thân thiện cloud-native đều rất tốt.

**Java Applets**

- **Lý do**: Trình duyệt hiện đại (như Chrome, Firefox, Edge) đã loại bỏ hoàn toàn hỗ trợ Java Applets, đồng thời Applets tồn tại vấn đề bảo mật nghiêm trọng.
- **Giải pháp thay thế**: HTML5, WebAssembly và các framework JavaScript hiện đại (như React, Vue) có thể mang lại trải nghiệm tương tác an toàn và hiệu quả hơn, không cần hỗ trợ plugin.

**SOAP / JAX-WS**

- **Lý do**: SOAP và JAX-WS quá phức tạp, định dạng dữ liệu dài dòng (XML), không thân thiện với hiệu quả phát triển và hiệu năng.
- **Giải pháp thay thế**: RESTful API và RPC nhẹ hơn, hiệu quả hơn, là lựa chọn hàng đầu của kiến trúc microservice hiện đại.

**RMI (Remote Method Invocation)**

- **Lý do**: RMI là công nghệ gọi từ xa thời kỳ đầu của Java, nhưng khả năng tương thích kém, cấu hình phức tạp, hiệu năng thấp.
- **Giải pháp thay thế**: RESTful API và RPC cung cấp giải pháp gọi từ xa đơn giản, hiệu quả hơn, hoàn toàn thay thế RMI.

**Swing / JavaFX**

- **Lý do**: Thị phần ứng dụng desktop trong lĩnh vực phát triển giảm mạnh, Web và mobile trở thành xu thế chính. Hệ sinh thái của Swing và JavaFX không phong phú bằng framework đa nền tảng hiện đại.
- **Giải pháp thay thế**: Framework phát triển desktop đa nền tảng (như Flutter Desktop, Electron) mang trải nghiệm hiện đại hơn.
- **Lưu ý**: Một số dự án cũ của doanh nghiệp nhà nước và doanh nghiệp trung ương có thể vẫn dùng Swing / JavaFX, nhưng tình trạng này ngày càng hiếm.

**Ant**

- **Lý do**: Ant là công cụ build dựa trên cấu hình XML, thiếu tính dễ dùng, cấu hình phức tạp.
- **Giải pháp thay thế**: Maven và Gradle cung cấp chức năng quản lý dependency và build hiệu quả hơn, trở thành lựa chọn hàng đầu của công cụ build hiện đại.

## Tự kiểm tra bằng câu hỏi phỏng vấn

Học trên giấy rút cuộc vẫn nông cạn, phải tự mình thực hành mới hiểu. Để giúp bạn nội hóa kiến thức tốt hơn, tôi đặc biệt chuẩn bị một bộ câu hỏi phỏng vấn tần suất cao hoàn toàn khớp với lộ trình học này: [Bộ câu hỏi phỏng vấn tần suất cao kèm lộ trình học Java Backend](https://t.zsxq.com/0eM78gbAr) (độc quyền của [JavaGuide Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)).

**Nguồn tài nguyên này có thể giúp bạn:**

- **Tự kiểm tra:** Kiểm tra một cách hệ thống mức độ nắm vững từng điểm kiến thức của mình.
- **Kiểm tra lỗ hổng:** Kịp thời phát hiện điểm yếu của bản thân, từ đó củng cố có mục tiêu.
- **Mô phỏng phỏng vấn:** Làm quen trước với nhịp điệu phỏng vấn và các điểm thi thường gặp.

Đặc biệt khuyến nghị mọi người dùng cách tự kiểm tra để đẩy việc học lên tầng sâu hơn.

## Java Cốt lõi

### Java Căn bản

Nếu trước đây bạn chưa từng học lập trình, tôi khuyên bạn có thể xem video hướng dẫn. Như [«Bộ video hướng dẫn Java căn bản»](https://www.bilibili.com/video/BV1PY411e7J6/) của Shang Silicon Valley (尚硅谷) và [«Học Java trong 30 ngày từ con số 0»](https://www.bilibili.com/video/BV1fh411y7R8) của thầy Hàn Thuận Bình (韩顺平) đều rất tốt.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210409143842888.png)

👉Tôi đã tổng hợp bộ video hướng dẫn & tài liệu đầy đủ nhất loạt Java Backend mới nhất của Shang Silicon Valley, bạn bè thích xem video có thể bấm link này tải về: [【Tổng hợp mới nhất】Toàn bộ hướng dẫn & dự án thực chiến Java Backend của Shang Silicon Valley](https://mp.weixin.qq.com/s/jkZthmOSDgTF1PrCeNus_A) (khuyến nghị).

![](https://oss.javaguide.cn/github/javaguide/books/88714e9becd0485aae247772b6ed9949.png)

Xem video đồng thời, kết hợp một quyển sách hay cũng rất hữu ích.

Sách Java căn bản tốt rất nhiều, ở đây tôi chỉ giới thiệu 3 quyển.

**1、《Head First Java》**

![《Head First Java》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424103035793.png)

Nội dung của sách 《Head First Java》 rất nhẹ nhàng và thú vị, có thể nói là một trong những quyển sách tôi thích nhất thời kỳ đầu học lập trình. Đồng thời, đây cũng là quyển sách khai sáng Java của tôi. Thời kỳ đầu học Java nhờ quyển sách này mà tôi mới bước chân được vào cửa ngôn ngữ Java. Tôi có thể kiên trì theo đuổi Java, quyển sách này có công rất lớn. Rất nhiều bạn bè xung quanh tôi học Java thời kỳ đầu đều đọc quyển sách này.

Có nhiều bạn sẽ hỏi: **Quyển sách này có thích hợp cho người mới lập trình đọc không?**

Cá nhân tôi thấy quyển sách này khá thích hợp cho người mới lập trình, dù sao nó cũng thuộc series "Head First".

**2、《Java 核心技术卷 1+卷 2》**

![《Java 核心技术卷 1》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424101217849.png)

Nội dung của hai quyển《Java 核心技术卷 1+卷 2》 khá nhiều, xem hết sẽ khá tốn thời gian, thích hợp làm sách tham khảo lúc đi làm. Lúc tôi học đại học từng mua hai quyển để trong ký túc xá, rảnh là giở ra xem. Cá nhân khuyên nên có chút nền tảng Java rồi mới đọc hai quyển này, nội dung giới thiệu khá chuyên sâu và toàn diện.

**3、《Java 编程的逻辑》**

《Java 编程的逻辑》 là một quyển sách hay rất khiêm tốn, so với sách nhập môn thì nội dung có chiều sâu hơn. Thích hợp cho người mới bắt đầu, đồng thời cũng thích hợp cho mọi người dùng để ôn lại kiến thức Java căn bản. Trong bài viết này có ghi chú đọc sách này: [Võ công bí kíp Java căn bản](https://mp.weixin.qq.com/s/UceEYGWM9qq9WvntV7y-Aw).

![《Java编程的逻辑》](https://oss.javaguide.cn/github/javaguide/books/image-20230721153650488.png)

Sau khi học xong Java căn bản, bạn có thể dùng những gì đã học để viết một chương trình Java đơn giản, cũng có thể thử dùng Java giải quyết một số bài toán lập trình, từ đó đem những gì học được áp dụng vào thực tiễn.

Không khuyến khích sau khi học Java căn bản lại dùng cách làm game để củng cố. Tại sao lớp luyện thi lại thích dùng cách này? Nói trắng ra là để tìm được "G spot" của bạn. Người mới học xong Java căn bản rồi làm game thường không thực tế, chi bằng tìm mấy bài toán lập trình đơn giản giải quyết, như mấy bài giải thuật đơn giản.

Nhớ tổng kết thật nhiều! Đánh chắc nền tảng! Ghi lại những thứ quan trọng. Đặt tài liệu API ở nơi mình có thể nhìn thấy, để bất cứ lúc nào cũng có thể tra cứu. Để viết ra code chất lượng hơn, hai quyển《Effective Java》、《重构》 rảnh cũng có thể xem.

Sau khi học xong phần này, hãy đảm bảo mình nắm chắc những điểm kiến thức sau:

- Cú pháp cơ bản, kiểu dữ liệu cơ bản
- Đối tượng, class, interface
- Kế thừa, generic
- Phương thức
- Ngoại lệ, assertion
- Collection
- ……

Trong quá trình học, đặc biệt khuyến nghị kết hợp với những câu hỏi thường gặp và điểm kiến thức quan trọng tôi đã tổng kết (tiện thể còn có thể chuẩn bị những câu hỏi phỏng vấn thường gặp):

- **Java căn bản**:

  - [Tổng hợp câu hỏi phỏng vấn Java căn bản thường gặp (phần 1)](https://javaguide.cn/java/basis/java-basic-questions-01.html) (khái niệm cơ bản của ngôn ngữ Java, cú pháp, kiểu dữ liệu, biến, phương thức v.v.)

  - [Tổng hợp câu hỏi phỏng vấn Java căn bản thường gặp (phần 2)](https://javaguide.cn/java/basis/java-basic-questions-02.html) (hướng đối tượng căn bản, string, so sánh và copy đối tượng v.v.)

  - [Tổng hợp câu hỏi phỏng vấn Java căn bản thường gặp (phần 3)](https://javaguide.cn/java/basis/java-basic-questions-03.html) (ngoại lệ, generic, reflection, SPI, serialization, annotation v.v.)

- **Java Collection**:

  - [Tổng hợp câu hỏi phỏng vấn Java Collection thường gặp (phần 1)](https://javaguide.cn/java/collection/java-collection-questions-01.html) (kiến thức cơ bản Java Collection, `ArrayList`, `LinkedList`, `HashSet`, `ArrayDeque`, `PriorityQueue`, `BlockingQueue` v.v.)
  - [Tổng hợp câu hỏi phỏng vấn Java Collection thường gặp (phần 2)](https://javaguide.cn/java/collection/java-collection-questions-02.html) (`HashMap`, `ConcurrentHashMap` v.v.)

### Java đồng thời (nâng cao)

Phần đồng thời hay đa luồng này hơi khó hiểu và khó thực hành. Nếu bạn vừa mới học xong Java căn bản, tôi khuyên khi học phần đồng thời trước tiên có thể đơn giản tìm hiểu kiến thức cơ bản như so sánh thread và process. Đến khi bạn hiểu sâu về Java hơn, hãy quay lại xem kỹ phần này.

Sách Java đồng thời khá nhiều quyển viết khá hay, như 《实战 Java 高并发程序设计》、《Java 并发编程之美》、《Java 并发实现原理：JDK 源码剖析》。

![《实战 Java 高并发程序设计》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424112554830.png)

![《Java 并发编程之美》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424112413660.png)

![《Java 并发实现原理：JDK 源码剖析》-Douban](https://oss.javaguide.cn/github/javaguide/books/0b1b046af81f4c94a03e292e66dd6f7d.png)

Muốn học hệ thống thì vẫn nên chọn một quyển trong đó đọc kỹ. Đương nhiên, bạn cũng có thể chọn nhiều quyển kết hợp đọc cùng lúc, gặp điểm kiến thức chưa hiểu thì lại xem giải thích của sách khác hoặc tìm blog tương ứng giải thích.

Video thì vẫn khuyến nghị thầy Chu Dương (周阳) của Shang Silicon Valley: [Video hướng dẫn lập trình đồng thời Java](https://www.bilibili.com/video/BV1ar4y1x727/).

👉Tôi đã tổng hợp bộ video hướng dẫn & tài liệu đầy đủ nhất loạt Java Backend mới nhất của Shang Silicon Valley, bạn bè thích xem video có thể bấm link này tải về: [【Tổng hợp mới nhất】Toàn bộ hướng dẫn & dự án thực chiến Java Backend của Shang Silicon Valley](https://mp.weixin.qq.com/s/jkZthmOSDgTF1PrCeNus_A) (khuyến nghị).

![](https://oss.javaguide.cn/github/javaguide/books/88714e9becd0485aae247772b6ed9949.png)

Trong quá trình học, đặc biệt khuyến nghị kết hợp với những câu hỏi thường gặp và điểm kiến thức quan trọng tôi đã tổng kết:

- [Tổng hợp câu hỏi phỏng vấn Java đồng thời thường gặp (phần 1)](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html) (kiến thức cơ bản multi-thread, ví dụ khái niệm thread và process, deadlock)
- [Tổng hợp câu hỏi phỏng vấn Java đồng thời thường gặp (phần 2)](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html) (các loại lock, ví dụ optimistic lock và pessimistic lock, từ khóa `synchronized`, `ReentrantLock`)
- [Tổng hợp câu hỏi phỏng vấn Java đồng thời thường gặp (phần 3)](https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html)(`ThreadLocal`, thread pool, `Future`, AQS, virtual thread v.v.)

### JVM (nâng cao)

JVM thuộc loại nội dung cao cấp hơn so với đồng thời, thứ tự học có thể trì hoãn hợp lý, ví dụ bạn có thể sau khi học xong kiến thức framework rồi mới quay lại xem JVM. Hơn nữa, các điểm kiến thức liên quan JVM, thường chỉ các công ty lớn (ví dụ Meituan, Alibaba) và một số công ty vừa tốt (ví dụ Ctrip, SF Express, CMB Network) mới hỏi khi phỏng vấn, phỏng vấn vào doanh nghiệp nhà nước, công ty vừa hơi kém và công ty nhỏ thì không cần chuẩn bị.

Tuy nhiên, cá nhân tôi khuyên nếu bạn học vẫn còn sức dư thì nên tranh thủ thời gian học, vẫn có ích. Đúng như câu nói chỉ khi hiểu thấu JVM mới có thể thật sự "ăn trọn" ngôn ngữ Java.

Trong công việc thực tế, công ty vừa và nhỏ thường không làm JVM tuning, nhưng lỡ gặp vấn đề như OOM, bạn biết cách tra cứu và giải quyết thì chẳng phải tốt hơn sao?

Học phần JVM này, nhất định phải chú ý kết hợp thực chiến và lý luận.

Về sách, quyển《深入理解 Java 虚拟机》 là đầu tiên phải giới thiệu.

![《深入理解 Java 虚拟机》-Douban](https://oss.javaguide.cn/github/javaguide/books/20210710104655705.png)

Quyển sách này dùng một câu để hình dung: **Chiến đấu cơ trong sách nội địa, xuất sắc thật sự!** (Thật lòng hy vọng trong nước có nhiều sách chất lượng nữa! Cố lên! 💪)

Bản đệ tam (ấn bản thứ ba) của quyển sách này đã ra mắt khá lâu, bổ sung nhiều nội dung hay như phân tích nguyên lý của các GC thế hệ mới như ZGC.

Dù là phỏng vấn hay muốn học sâu hơn trong lĩnh vực Java, bạn đều không thể rời quyển sách này. Quyển sách này không chỉ cần đọc, mà còn phải đọc nhiều lần, trong đó toàn là kiến thức "khô". Trong sách còn có những thứ cần tự mình thực hành, tôi khuyên bạn cũng nên làm theo thực hành.

Những quyển sách tương tự còn có 《实战 Java 虚拟机》、《虚拟机设计与实现:以 JVM 为例》, hai quyển này đều rất tuyệt!

![《实战 Java 虚拟机》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113158144.png)

![《虚拟机设计与实现:以 JVM 为例》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113210153.png)

Nếu bạn hứng thú với thực chiến, muốn tự tay viết một JVM đơn giản, có thể xem quyển《自己动手写 Java 虚拟机》.

![《自己动手写 Java 虚拟机》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113445246.png)

Code trong sách được viết bằng ngôn ngữ Go, sau khi hiểu rõ nguyên lý bạn có thể dùng Java bắt chước viết một cái, coi như luyện tay! Nếu hiện tại bạn chưa đủ khả năng tự mình dùng Java viết, cũng có thể tìm trên mạng nhiều bản triển khai bằng Java, ví dụ [《Zachaxy's series viết tay JVM》](https://zachaxy.github.io/tags/JVM/).

Ngoài ra, trong bài viết [《Học triển khai JVM từ ngoài vào trong》](https://www.douban.com/doulist/2545443/) mà anh R (R 大) đăng trên Douban cũng giới thiệu nhiều sách JVM hay, khuyến nghị các bạn qua xem.

Về video, thầy Tống Hồng Khang (宋红康) của Shang Silicon Valley giảng [《Bộ hướng dẫn JVM đầy đủ》](https://www.bilibili.com/video/BV1PJ411n7xZ) nội dung rất "chất", gần 400 tiết mục (bản tinh luyện cô đọng tương ứng: [《Shang Silicon Valley JVM giảng kỹ và hướng dẫn GC tối ưu》](https://www.bilibili.com/video/BV1Dz4y1A7FB/)).

Nội dung khóa học chia làm 3 phần:

1. 《Phần bộ nhớ và GC》
2. 《Phần bytecode và nạp class》
3. 《Phần giám sát hiệu năng và tối ưu》

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210409181534319.png)

👉Tôi đã tổng hợp bộ video hướng dẫn & tài liệu đầy đủ nhất loạt Java Backend mới nhất của Shang Silicon Valley, bạn bè thích xem video có thể bấm link này tải về: [【Tổng hợp mới nhất】Toàn bộ hướng dẫn & dự án thực chiến Java Backend của Shang Silicon Valley](https://mp.weixin.qq.com/s/jkZthmOSDgTF1PrCeNus_A) (khuyến nghị).

![](https://oss.javaguide.cn/github/javaguide/books/88714e9becd0485aae247772b6ed9949.png)

Trong quá trình học, đặc biệt khuyến nghị kết hợp với những câu hỏi thường gặp và điểm kiến thức quan trọng tôi đã tổng kết:

- [Giải thích chi tiết vùng bộ nhớ Java (trọng điểm)](https://javaguide.cn/java/jvm/memory-area.html)
- [Giải thích chi tiết garbage collection JVM (trọng điểm)](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)
- [Giải thích chi tiết cấu trúc class file](https://javaguide.cn/java/jvm/class-file-structure.html)
- [Giải thích chi tiết quá trình nạp class](https://javaguide.cn/java/jvm/class-loading-process.html)
- [Giải thích chi tiết class loader (trọng điểm)](https://javaguide.cn/java/jvm/classloader.html)

## Cơ sở dữ liệu

### Căn bản (tùy chọn)

Các điểm kiến thức cơ sở dữ liệu căn bản, thực ra là có thể chọn học. Đối với sinh viên ngành máy tính, lúc đại học chắc cũng từng học. Tuy nhiên, phần lớn học xong cũng coi như chưa học, ai chưa học thì cũng đừng lo!

Ở đây vẫn cung cấp một số tài liệu học tập cho các bạn muốn học kiến thức cơ bản cơ sở dữ liệu!

Về sách, đặc biệt khuyến nghị《数据库系统概念》, quyển sách này bao quát toàn bộ khái niệm hệ thống cơ sở dữ liệu, hệ thống kiến thức rõ ràng, là giáo trình kinh điển rất tuyệt để học hệ thống cơ sở dữ liệu! Không phải sách tham khảo!

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409150441742.png)

Nếu bạn thấy sách khá khô khan, mình kiên trì không nổi, tôi khuyên bạn có thể trước tiên xem một số video khá hay. Như [《Nguyên lý hệ thống cơ sở dữ liệu》](https://www.icourse163.org/course/BNU-1002842007) của Đại học Bắc Kinh Sư phạm (北京师范大学) rất tốt.

Giáo viên khóa học này giảng rất chi tiết, mà mỗi tiết bài tập thiết kế cũng rất khớp với kiến thức được giảng, phía sau còn có nhiều thí nghiệm kèm theo.

![](https://oss.javaguide.cn/github/javaguide/books/up-e113c726a41874ef5fb19f7ac14e38e16ce.png)

Nếu bạn thích thực hành, khá ngại kiến thức lý luận, tôi khuyên bạn xem [《Làm thế nào phát triển một cơ sở dữ liệu đơn giản》](https://cstack.github.io/db_tutorial/), project này sẽ chỉ dạy bạn viết một cơ sở dữ liệu đơn giản từng bước.

![](https://oss.javaguide.cn/github/javaguide/books/up-11de8cb239aa7201cc8d78fa28928b9ec7d.png)

Học trên giấy rút cuộc vẫn nông cạn, muốn biết phải tự mình làm! Đặc biệt khuyến nghị các bạn ngành CS nhất định phải thực hành thật nhiều!!!

### MySQL

Đối với phát triển Java, dù PostgreSQL cũng khá hot, nhưng MySQL mới là xu thế chính, phần lớn doanh nghiệp trong nước vẫn dùng MySQL.

Nhập môn MySQL có thể tìm xem một số video, như [《MySQL cơ sở dữ liệu từ nhập môn đến tinh thông》](https://www.bilibili.com/video/BV1Kr4y1i7ru/) của Heima (黑马). Xem video đồng thời, có thể kết hợp một quyển sách nhập môn MySQL như [《MySQL 必知必会》](https://book.douban.com/subject/3354490/).

Giai đoạn đầu không cần học quá sâu, làm rõ mấy điểm kiến thức sau là được:

1. Lệnh MySQL thường dùng:

   - Bảo mật: đăng nhập, thêm/xóa user, backup dữ liệu và khôi phục dữ liệu
   - Thao tác cơ sở dữ liệu: tạo DB tạo bảng/xóa DB xóa bảng, phân quyền user
   - ……

2. Kiểu dữ liệu, mã hóa character set thường dùng trong MySQL
3. MySQL query đơn giản, query điều kiện, query mờ, query nhiều bảng cũng như cách sắp xếp, lọc, group kết quả query……
4. MySQL dùng index, view, stored procedure, cursor, trigger
5. ……

Đi sâu hơn, có thể tìm một số sách hay để học nguyên lý nền tảng và tối ưu hiệu năng, như [《高性能 MySQL》](https://book.douban.com/subject/23008813/) và [《MySQL 技术内幕》](https://book.douban.com/subject/24708143/).

![](https://oss.javaguide.cn/github/javaguide/books/up-3d31e762933f9e50cc7170b2ebd8433917b.png)

Ngoài ra, mạnh mẽ đẩy một quyển [《MySQL 是怎样运行的》](https://book.douban.com/subject/35231266/), nội dung rất thích hợp để chuẩn bị phỏng vấn. Giảng rất chi tiết, nhưng không khô khan, nội dung rất tận tâm!

![](https://oss.javaguide.cn/github/javaguide/csdn/20210703120643370.png)

Nếu bạn muốn hiểu rõ hơn về MySQL, đồng thời cũng để chuẩn bị phỏng vấn, mấy điểm kiến thức sau đây cần đặc biệt chú ý:

1. Index: ưu nhược điểm của index, B-tree và B+tree, clustered index và non-clustered index, covering index
2. Transaction: transaction, database transaction, ACID, concurrent transaction, cấp cách ly transaction
3. Storage engine (MyISAM và InnoDB)
4. Cơ chế lock và thuật toán lock InnoDB

Trong quá trình học, đặc biệt khuyến nghị kết hợp với những câu hỏi thường gặp và điểm kiến thức quan trọng tôi đã tổng kết:

- [Tổng hợp câu hỏi phỏng vấn MySQL thường gặp](https://javaguide.cn/database/mysql/mysql-questions-01.html) (MySQL căn bản, storage engine, transaction, index, lock, tối ưu hiệu năng v.v.)
- [Giải thích chi tiết MySQL index](https://javaguide.cn/database/mysql/mysql-index.html)
- [Giải thích chi tiết ba loại log MySQL (binlog, redo log và undo log)](https://javaguide.cn/database/mysql/mysql-logs.html)
- [Giải thích chi tiết cấp cách ly transaction MySQL](https://javaguide.cn/database/mysql/transaction-isolation-level.html)
- [Triển khai MVCC của storage engine InnoDB](https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html)
- [Quá trình thực thi câu lệnh SQL trong MySQL](https://javaguide.cn/database/mysql/how-sql-executed-in-mysql.html)

### PostgreSQL (tùy chọn)

Giống MySQL, PostgreSQL cũng là cơ sở dữ liệu quan hệ mã nguồn mở miễn phí và mạnh mẽ. Slogan của PostgreSQL là "**cơ sở dữ liệu quan hệ nguồn mở tiên tiến nhất thế giới**".

![](https://oss.javaguide.cn/github/javaguide/books/image-20220702144954370.png)

Nói một cách khách quan, PostgreSQL quả thực ưu việt hơn MySQL. Tuy nhiên, hiện tại trong nước MySQL vẫn là xu thế chính, PostgreSQL là có thể chọn học.

Tài liệu tiếng Trung của PostgreSQL khuyên nên xem: [Tài liệu tiếng Trung PostgreSQL 14](http://www.postgres.cn/docs/14/index.html). Ngoài ra, về sách PostgreSQL thì xem giới thiệu ở đây: [Khuyến nghị sách cơ sở dữ liệu: PostgreSQL](https://javaguide.cn/books/database.html#postgresql).

### Redis

Nếu dự án backend dùng cache phân tán thì thường dùng Redis. Tuy nhiên, Redis không chỉ làm cache, mà còn có thể dùng làm distributed lock, hàng đợi trễ, message queue v.v..

Về video hướng dẫn miễn phí, khuyến nghị [Hỏi trả lời với Tôi 1 giờ về Redis](https://www.imooc.com/learn/839) của GeekHour (rất khuyến nghị, dễ hiểu, đơn giản giới thiệu phần lớn điểm kiến thức liên quan Redis) và [《Bộ video mới nhất series Redis 7》](https://www.bilibili.com/video/BV13R4y1v7sP/) của Shang Silicon Valley (do anh Dương 阳哥 làm ra, nội dung toàn diện hơn, phiên bản Redis mới hơn, đặc biệt khuyến nghị).

Về sách, đặc biệt khuyến nghị [《Thiết kế và triển khai Redis》](https://book.douban.com/subject/25900156/) và 《Redis 核心原理与实践》 hai quyển.[《Redis 核心原理与实践》](https://book.douban.com/subject/26612779/) quyển này ngày xuất bản tương đối gần, chủ yếu kết hợp source code để phân tích các điểm kiến thức quan trọng của Redis như các cấu trúc dữ liệu và tính năng cao cấp.

![《Thiết kế và triển khai Redis》和《Thiết kế và triển khai Redis》](https://oss.javaguide.cn/github/javaguide/books/redis-books.png)

Về chuyên mục trả phí, khuyến nghị một chuyên mục của GeekTime (极客时间) [《Công nghệ cốt lõi và thực chiến Redis》](https://time.geekbang.org/column/intro/100056701?utm_campaign=geektime_search&utm_content=geektime_search&utm_medium=geektime_search&utm_source=geektime_search&utm_term=geektime_search), dù không đề cập nhiều nội dung phiên bản Redis mới, nhưng thắng ở chỗ nội dung toàn diện và rõ ràng dễ hiểu. Lúc đó tôi xem chuyên mục này quả thực học được khá nhiều thứ, đặc biệt phần bình luận có rất nhiều bình luận xuất sắc của các sư huynh (đại thần).

Trong quá trình học, đặc biệt khuyến nghị kết hợp với những câu hỏi thường gặp và điểm kiến thức quan trọng tôi đã tổng kết:

- [Tổng hợp câu hỏi phỏng vấn cache căn bản thường gặp](https://javaguide.cn/database/redis/cache-basics.html)
- [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (phần 1)](https://javaguide.cn/database/redis/redis-questions-01.html)
- [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (phần 2)](https://javaguide.cn/database/redis/redis-questions-01.html)
- [Giải thích chi tiết 5 kiểu dữ liệu cơ bản Redis](https://javaguide.cn/database/redis/redis-data-structures-01.html)
- [Giải thích chi tiết 3 kiểu dữ liệu đặc biệt Redis](https://javaguide.cn/database/redis/redis-data-structures-02.html)
- [Giải thích chi tiết cơ chế persistent Redis](https://javaguide.cn/database/redis/redis-persistence.html)
- [Giải thích chi tiết memory fragmentation Redis](https://javaguide.cn/database/redis/redis-memory-fragmentation.html)

### MongoDB (tùy chọn)

Đối với phát triển Java Backend, MongoDB là có thể chọn học, dùng không nhiều, phỏng vấn thường cũng không hỏi, trừ khi dự án của bạn dùng MongoDB.

Ở đây không khuyến nghị video hay sách, khuyến nghị hai bài viết tôi viết:

- [Tổng hợp câu hỏi phỏng vấn MongoDB thường gặp (phần 1)](https://javaguide.cn/database/mongodb/mongodb-questions-01.html)
- [Tổng hợp câu hỏi phỏng vấn MongoDB thường gặp (phần 2)](https://javaguide.cn/database/mongodb/mongodb-questions-02.html)

## Công cụ phát triển thường dùng

Rất quan trọng! Rất quan trọng! Đặc biệt là Git và Docker.

Ngoài những công cụ dưới đây, tôi đặc biệt khuyến nghị bạn nhất định phải hiểu rõ cách dùng Github. Một số mẹo dùng Github, bạn có thể xem bài viết [Mẹo Github](https://javaguide.cn/tools/git/github-tips.html).

### IDEA

Ngạn ngữ có câu: "Muốn làm việc tốt, trước tiên phải rèn dụng cụ sắc bén!". Chọn một công cụ phát triển tốt rất hữu ích cho việc code hiệu quả cao!

Công cụ phát triển Java thường dùng có Eclipse và IDEA. Theo cá nhân tôi, IDEA là IDE thích hợp nhất cho developer Java, không có cái thứ hai (đừng cãi, cái bạn thích là tốt nhất).

Ngoài hỗ trợ code xuất sắc của bản thân IDEA (ví dụ gợi ý ngữ cảnh thông minh), trong IDEA còn có nhiều plugin phong phú giúp chúng ta phát triển hiệu quả.

Mấy năm gần đây, các AI IDE lập trình như Cursor trỗi dậy, quả thực có chút tác động lên IDEA. Nhưng nhìn tổng thể, IDEA vẫn khó bị thay thế. Dù là trải nghiệm phát triển hay khả năng refactor code, IDEA đều có ưu thế vô song. Đương nhiên, ở mảng AI hỗ trợ lập trình, phần thể hiện của IDEA quả thực hơi tụt lại. Phải biết rằng, trước kia gợi ý thông minh code chính là sở trường của nó.

[Tài liệu tiếng Trung chính thức IntelliJ IDEA năm nay chính thức ra mắt](https://mp.weixin.qq.com/s/GT-zQHLOBB25ZRf1nyyt2Q), đặc biệt khuyến nghị lấy đây làm tài liệu tin cậy hàng đầu.

**Đường dẫn tài liệu tiếng Trung chính thức IDEA**: **<https://www.jetbrains.com/zh-cn/help/idea/getting-started.html>**

Ngoài ra, [«Hướng dẫn sử dụng IDEA hiệu quả»](https://idea.javaguide.cn/) là một website tôi tạo, bên trong bao gồm những nội dung sau:

- Mẹo sử dụng IDEA
- Plugin cần thiết cho IDEA
- Nhập môn phát triển plugin IDEA
- Mẹo dùng IDEA để refactor
- Mẹo dùng IDEA xem source code

![«Trang chủ website hướng dẫn sử dụng IDEA hiệu quả](https://oss.javaguide.cn/github/awesome-idea-tutorial/awesome-idea-tutorial-website-homepage%20%20%20%20%20%20.png)

### Maven

Maven thực ra dùng khá đơn giản, một hai ngày là có thể nhập môn dùng cơ bản. Nhưng muốn dùng tốt thì khá khó, giai đoạn đầu chỉ cần biết dùng cơ bản là được.

Nói thêm một câu: trước khi học framework thường dùng có thể tranh thủ thời gian học cách dùng Maven, tuyệt đối đừng chạy khắp nơi tìm jar package, tải jar package (nếu dự án bạn làm không dùng công cụ quản lý package, thì hãy nhanh chóng đổi một hướng dẫn mới hơn).

Maven ở đây không cần khuyến nghị video hay sách gì, trực tiếp xem bài viết dưới đây là được:

- [Tổng kết khái niệm cốt lõi Maven](https://javaguide.cn/tools/maven/maven-core-concepts.html)
- [Best practice Maven](https://javaguide.cn/tools/maven/maven-best-practices.html)
- [Bốn mươi lăm hình, một vạn năm nghìn chữ! Một bài giúp bạn ra khỏi mê vụ chơi chuyến Maven!](https://juejin.cn/post/7238823745828405308)

Sau khi học xong, nhất định phải hiểu rõ mấy vấn đề sau (người mới chỉ cần hiểu hai vấn đề đầu):

1. Dự án Maven tạo thế nào? Làm sao thêm dependency?
2. Xung đột dependency Maven giải quyết thế nào?
3. Build, chạy, đóng gói dự án multi-module Maven làm thế nào?
4. Maven private server (Nexus) dựng thế nào?

### Git

Kỹ năng Git là bắt buộc đối với lập trình viên! Cố gắng trong quá trình học đem code của mình host lên Github, có một trang chủ Github đẹp là rất ăn điểm trong lúc phỏng vấn xin việc. Hơn nữa, các doanh nghiệp hiện nay đều dựa trên Git để làm version control trên nền tảng GitHub hoặc GitLab.

Học Git, đặc biệt khuyến nghị cho mọi người một website có thể tương tác học Git [Learn Git Branching](https://learngitbranching.js.org/ "Learn Git Branching"). Hiệu quả thật sự rất rất tuyệt vời, thông qua cách chơi game để bạn học các thao tác thường gặp của Git.

Toàn bộ hướng dẫn chia thành nhiều màn, mỗi màn đều có hướng dẫn rất chi tiết, còn có ảnh động chi tiết hiển thị kết quả. Hơn nữa, sau khi bạn làm sai còn có thể dùng lệnh `reset` để bắt đầu lại từ đầu.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210423182350378.png)

Nếu bạn không biết đáp án, còn có thể dùng lệnh `show solution` để xem đáp án.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210423181725451.png)

Kiểu học phản hồi tức thì này khiến quá trình trở nên thú vị! Chân thành cảm ơn tác giả của website này, quá yêu luôn!

Ngoài ra, bạn có thể xem bài viết [Giới thiệu nhập môn tối giản Git](https://javaguide.cn/tools/git/git-intro.html), những khái niệm liên quan version control và Git, thao tác thường gặp của Git bài viết này đều có giới thiệu.

Nếu muốn tìm hiểu chi tiết Git, có thể xem quyển [《Pro Git》](https://www.progit.cn/ "《Pro Git》"), giới thiệu rất toàn diện, miễn phí, hỗ trợ đọc, và có bản tiếng Trung!

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210423183640734.png)

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210423183749743.png)

Đây là một địa chỉ đọc trực tuyến khác của quyển sách này: <https://git-scm.com/book/zh/v2>.

Nếu bạn khá thích xem video hướng dẫn, có thể xem [《Chơi chuyến Git Tam Kiếm Khách》](http://gk.link/a/10qcT) của GeekTime, tác giả khóa học là Tô Linh (苏玲) phụ trách nền tảng code của Ctrip, giảng khá hay!

### Docker

Trong quy trình phát triển truyền thống, dự án của chúng ta thường cần dùng môi trường MySQL, Redis, FastDFS v.v., những môi trường này đều cần chúng ta tự tay tải về và cấu hình, quá trình cài đặt cấu hình cực kỳ phức tạp, mà thao tác trên các hệ điều hành khác nhau cũng không giống nhau.

Sự xuất hiện của Docker đã giải quyết hoàn hảo vấn đề này, chúng ta có thể cài môi trường phần mềm như MySQL, Redis trong container, khiến ứng dụng và kiến trúc môi trường tách rời, ưu thế của nó nằm ở:

1. Môi trường chạy nhất quán, có thể di chuyển dễ dàng hơn
2. Đóng gói cách ly process, container và container không ảnh hưởng lẫn nhau, tận dụng tài nguyên hệ thống hiệu quả hơn
3. Có thể thông qua image nhân bản ra nhiều container nhất quán

Giải thích khái niệm thường gặp Docker, có thể xem bài viết [Giải thích khái niệm cơ bản Docker](https://javaguide.cn/tools/docker/docker-intro.html) của JavaGuide này, từ con số 0 đến thực chiến có thể xem bài viết [Docker từ nhập môn đến làm việc](https://javaguide.cn/tools/docker/docker-in-action.html), nội dung rất chi tiết!

Ngoài ra, lại khuyến nghị cho mọi người một quyển sách mã nguồn mở chất lượng rất cao [《Docker từ nhập môn đến thực hành》](https://yeasy.gitbook.io/docker_practice/introduction/why), nội dung quyển sách này rất mới, dù sao nội dung sách là mã nguồn mở, có thể cải tiến bất cứ lúc nào.

![《Trang chủ website Docker từ nhập môn đến thực hành》](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-getting-started-practice-website-homepage.png)

Nếu muốn xem video, khuyến nghị cái này: [Hướng dẫn nhanh Docker 1 giờ](https://www.bilibili.com/video/BV11L411g7U1/), không ba hoa, kiến thức khô khá nhiều. Hơn nữa, bài giảng cũng trực tiếp chia sẻ miễn phí: [Bài giảng hướng dẫn Docker 1 giờ](https://docker.easydoc.net/doc/81170005/cCewZWoN/lTKfePfP).

![Hướng dẫn nhanh Docker 1 giờ](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/docker-1-hour-quick-start-guide.png)

Cuối cùng, sau khi học xong các thao tác thường gặp của Docker, khuyên mọi người lấy một dự án tách frontend-backend làm ví dụ, thực hành triển khai một lần. Ví dụ, bạn có thể chọn triển khai dự án CV của mình, như vậy phần kinh nghiệm dự án dán lên địa chỉ trải nghiệm trực tuyến, cũng coi là một điểm cộng rồi!

## Design pattern (Mẫu thiết kế)

Trong phát triển phần mềm có một khái niệm gọi là "**tái sử dụng phần mềm**". Nói đơn giản, tái sử dụng phần mềm là khi chúng ta xây dựng một phần mềm mới, không cần bắt đầu từ con số 0, thông qua tái sử dụng một số "bánh xe" có sẵn (framework, thư viện bên thứ ba v.v.), **design pattern**, nguyên tắc thiết kế v.v. những vật liệu sẵn có, chúng ta có thể nhanh chóng xây dựng ra một phần mềm đáp ứng yêu cầu.

Tái sử dụng phần mềm cần sự trợ giúp của design pattern. Bởi vì, trong phát triển phần mềm, design pattern có thể thông qua đóng gói sự biến đổi để nâng cao tính mở rộng và tính bảo trì của code!

Trong phát triển nghiệp vụ hằng ngày, nếu bạn không biết design pattern, bạn cũng có thể hoàn thành yêu cầu chức năng của dự án. Nhưng! CRUD thuần túy thì có gì vui chứ! Chúng ta phải suy nghĩ làm sao viết ra code nghiệp vụ chất lượng cao hơn. Ngoài ra, các framework như Spring, MyBatis đều sử dụng rất nhiều design pattern. Nếu bạn muốn hiểu rõ nguyên lý của chúng, design pattern chính là vũ khí lợi hại bắt buộc của bạn.

Design pattern không chỉ cần chúng ta học, quan trọng nhất vẫn là không ngừng thực hành thấu hiểu. Nhưng! Design pattern không phải "viên đạn bạc", **đừng vì dùng design pattern mà dùng design pattern**.

Muốn xem sách học design pattern, đầu khuyến nghị 《重学 Java 设计模式》. Ví dụ thú vị, kết hợp hình ảnh sinh động, thông qua case thực chiến giảng giải design pattern cách tuyệt vời vô đối! Mỗi chi tiết trong văn đều lộ ra sự tận tâm của tác giả! Mỗi loại design pattern thực ra đều không khó hiểu, phần lớn độc giả cần nhất vẫn là kinh nghiệm thực chiến design pattern. Nếu bạn chịu khó suy nghĩ thực hành từng case trong 《重学 Java 设计模式》, tôi tin, lý giải của bạn về design pattern nhất định sẽ lên một tầm cao mới! Lưu ý nội dung phần design pattern của bạn, thực chiến là trọng tâm nhất.

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4da6f8cc0cf4a8e8238d3d8671e0462~tplv-k3u1fbpfcp-watermark.image)

Muốn xem video học, đầu khuyến nghị video [《Shang Silicon Valley Java Design Pattern (sơ đồ giải + mổ xẻ source code framework)》](https://www.bilibili.com/video/BV1G4411c7N4).

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/029687d24c7b4882ba81b5b629c323a1~tplv-k3u1fbpfcp-watermark.image)

Video này thông qua cách sơ đồ giải + phân tích source code framework để giảng giải toàn diện nội dung liên quan design pattern, bao gồm bảy nguyên tắc design pattern, sáu mối quan hệ của class UML, 23 loại design pattern và phân loại của chúng v.v. các điểm kiến thức.

## Linux

Đối với lập trình viên Java, chúng ta cần nắm vững cách dùng cơ bản Linux, đặc biệt là các lệnh thường dùng như: lệnh chuyển thư mục, lệnh thao tác thư mục, lệnh thao tác file, lệnh nén hoặc giải nén file v.v. Những nội dung nền tảng như kiến trúc lõi Linux, nguyên lý nền tảng, không bắt buộc, có thể căn cứ tình hình bản thân quyết định có học hay không.

Đối với các bạn muốn nhanh chóng nhập môn Linux, khuyên nên đọc bài viết [Tổng kết kiến thức căn bản Linux](https://javaguide.cn/cs-basics/operating-system/linux-intro.html) tôi viết, bên trong giới thiệu một số khái niệm Linux và lệnh thường gặp mà lập trình viên Java bắt buộc phải biết.

Về video, tôi khuyến nghị [Hướng dẫn nhập môn Linux 30 phút](https://www.bilibili.com/video/BV1cq421w72c) của GeekHour, dễ hiểu, giảng thực chiến! Tuy nhiên, tương đối nghiêng về cơ bản, thích hợp cho các bạn muốn nhập môn nhanh.

Đối với các bạn muốn học hệ thống, vẫn khuyến nghị xem sách, như series《鸟哥的 Linux 私房菜》 khá hay. Tuy nhiên, nội dung có hơi nhiều, cá nhân vẫn khuyên nên dùng làm sách công cụ tham khảo hoặc chọn phần nội dung mình hứng thú để học.

![](https://oss.javaguide.cn/github/javaguide/books/linux-private-kitchen-basic-learning.png)

Đừng quên học lập trình Shell, đây cũng là thứ bắt buộc phải nắm vững, nhập môn nhanh có thể đọc bài viết [Tổng kết kiến thức căn bản lập trình Shell](https://javaguide.cn/cs-basics/operating-system/shell-intro.html) tôi viết, tổng kết biến Shell, toán tử cơ bản, điều khiển luồng, hàm những điểm kiến thức quan trọng này.

## Kiến thức cơ bản frontend

Tác giả chủ yếu làm phát triển Java Backend, hiểu biết về frontend thuộc loại nông cạn, vừa mới nhập môn (từng làm full-stack một năm), ở đây chỉ đơn giản nói chuyện quan điểm của bản thân.

Framework frontend thay đổi rất nhanh, hiện tại khá phổ biến là Vue và React. Đối với các bạn trong nước, Vue thích hợp đầu tư công sức học hơn, vì trong nước công ty dùng Vue nhiều hơn. Tuy nhiên, framework frontend không bắt buộc phải học, có thể căn cứ tình hình bản thân quyết định có học hay không.

Vậy nhưng, dù công nghệ frontend này đổi thế nào, ba kiếm khách frontend (HTML, CSS, JavaScript) là không đổi, cũng là bắt buộc phải học.

HTML và CSS so với JS thì đơn giản hơn. Bạn có thể trên [W3school](http://www.w3school.com.cn/) học một số kiến thức cơ bản về HTML, CSS, JS. Sau đó, thông qua một dự án frontend đơn giản để thực chiến một lần. Ví dụ bạn có thể làm một CV cá nhân hoặc bắt chước một website nào đó viết một trang web tương tự.

JavaScript nước sâu hơn, cũng là trọng tâm trong phỏng vấn frontend.

Học JS, nội dung JS trên [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) là bắt buộc phải xem! Nội dung trên đó rất toàn diện, chất lượng rất cao!

Ngoài ra, hướng dẫn JS mã nguồn mở [《The Modern JavaScript Tutorial》](https://javascript.info/) cực kỳ tuyệt! Hiện tại, series hướng dẫn này còn được dịch ra nhiều ngôn ngữ khác nhau.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210409151045407.png)

Nội dung hướng dẫn này chia làm 3 phần

1. Ngôn ngữ lập trình JavaScript: nhập môn JavaScript, còn giới thiệu các khái niệm cao cấp liên quan OOP v.v.
2. Trình duyệt (tài liệu, sự kiện, giao diện): học cách quản lý trang trình duyệt
3. Các bài viết khác: học theo nhu cầu các kiến thức JavaScript cao cấp khác.

Ngoài ra, trừ một số dự án cũ, hiện nay thường đều là phát triển tách frontend-backend, tức là frontend và backend có thể độc lập phát triển, test và triển khai, hai bên thông qua API để giao tiếp. Do đó, lập trình viên backend còn cần nắm vững:

- Giao thức HTTP (nội dung phần mạng máy tính, ở đây nhắc thêm một chút)
- Thiết kế và cách dùng RESTful API
- Cách giao tiếp frontend-backend thường gặp: ví dụ Ajax (kết nối ngắn), WebSocket (kết nối dài, hai chiều)

## J2EE căn bản

### Servlet

`Servlet` thuộc loại công nghệ khá cổ xưa, hiện tại bạn gần như không trực tiếp dùng API liên quan `Servlet`. Tuy nhiên, học `Servlet` giúp chúng ta làm rõ nguyên lý của các Web framework đóng gói tốt, ví dụ `Spring MVC` chẳng qua là đóng gói của `Servlet`, tầng nền của nó vẫn phụ thuộc vào `Servlet`.

Trong chương trình Java Web, `Servlet` chủ yếu phụ trách tiếp nhận yêu cầu của người dùng `HttpServletRequest`, trong `doGet()`,`doPost()` làm xử lý tương ứng, và phản hồi `HttpServletResponse` cho người dùng.

Bạn có thể thông qua sách《Head First Servlets & JSP (bản tiếng Trung)》hoặc《Hướng dẫn học Servlet và JSP》để học kiến thức cơ bản Servlet.

**Lưu ý**: JSP thì đừng học, công nghệ lỗi thời, đã bị loại bỏ rồi!

### Web server (máy chủ web)

Tomcat là một dự án dưới Apache Foundation, chủ yếu dùng làm web server.

Nếu bạn học thẳng Spring Boot, không học Tomcat cũng không ảnh hưởng gì (khuyên vẫn nên học một chút). Vì Spring Boot (`spring-boot-starter-web`) dùng Tomcat làm `Servlet` container nhúng mặc định, bạn dùng không có cảm giác gì.

Nói đơn giản, Tomcat chủ yếu triển khai 2 chức năng cốt lõi:

1. Xử lý kết nối `Socket`, phụ trách chuyển hóa byte stream mạng với đối tượng `Request` và `Response`.
2. Nạp và quản lý `Servlet`, cũng như xử lý cụ thể yêu cầu `Request`.

Nếu bạn muốn nghiên cứu sâu Tomcat, đầu chọn chuyên mục [《Tháo rời sâu Tomcat & Jetty》](http://gk.link/a/10r1C) của GeekTime. Đây là tài liệu tôi từng xem giảng giải nguyên lý nền tảng Tomcat hay nhất, đặc biệt khuyến nghị!

Chuyên mục này không chỉ giúp bạn hiểu sâu hơn về Tomcat, mà còn nâng cao tư duy của bạn về kiến trúc hệ thống, tối ưu hiệu năng v.v. lĩnh vực.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/20210512202540785.png)

Ngoài Tomcat, Nginx cũng là bắt buộc phải học!

Nginx là HTTP và reverse proxy server hiệu năng cao, thường được dùng làm reverse proxy và cân bằng tải.

Nếu bạn muốn học Nginx, có thể xem [《Nginx kiến thức cốt lõi 150 bài》](http://gk.link/a/10r1D). Nội dung rất toàn diện, từ khái niệm, code đến thực chiến, từ HTTP đến OpenResty.

## Framework thường dùng

Trong phỏng vấn thực tế, kiến thức loại framework hỏi không nhiều, học framework thường dùng chủ yếu là để đáp ứng nhu cầu phát triển dự án và yêu cầu công việc.

### Spring/SpringBoot

**Chưa học Spring có thể trực tiếp lên học SpringBoot không?**

Nói rõ ràng, hoàn toàn có thể! Hiện tại phần lớn doanh nghiệp đều dùng SpringBoot, Spring cũng không phải là nền tảng tiền đề để học Spring Boot, so với Spring thì Spring Boot dễ tiếp cận hơn! Nếu bạn chỉ muốn dùng Spring Boot để làm dự án thì cứ học thẳng Spring Boot là được.

Tuy nhiên, cá nhân vẫn khuyên trước tiên hiểu rõ hai khái niệm quan trọng là Spring AOP và IoC rồi hãy học SpringBoot. Ngoài ra, chuẩn bị phỏng vấn, các điểm kiến thức như phạm vi và vòng đời bean trong Spring, nguyên lý hoạt động chi tiết SpringMVC v.v. đều rất quan trọng, nhất định phải hiểu rõ. Khuyến nghị đọc bài viết này: [Tổng hợp câu hỏi phỏng vấn Spring thường gặp](https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html).

Học Spring Boot, vẫn khuyên nên xem nhiều [**《Tài liệu chính thức Spring Boot》**](https://spring.io/projects/spring-boot#learn), viết rất chi tiết.

Giống như việc tích hợp SpringBoot với một số công nghệ thường gặp bạn cũng phải biết làm thế nào, ví dụ SpringBoot tích hợp MyBatis, ElasticSearch, SpringSecurity, Redis v.v. Cố gắng vẫn nên thực hành một chút, viết một số Demo. Đến giai đoạn sau, thậm chí có thể độc lập làm một số dự án nhỏ để ứng dụng những kiến thức này.

Về sách, thật ra cá nhân không có khuyến nghị đặc biệt tốt, dù sao cũng là kiến thức loại framework, cập nhật thay đổi khá nhanh, nhiều nội dung sách đã lỗi thời.

Xét đến nhiều bạn khá thích đọc sách, ở đây tôi vẫn đơn giản khuyến nghị vài quyển!

Đối với các bạn muốn thực chiến, tôi đặc biệt không khuyến nghị xem sách, trực tiếp xem dự án thực chiến của Shang Silicon Valley là được. Bài viết này có thể lấy được video mới nhất và giới thiệu về dự án thực chiến của Shang Silicon Valley: [【Tổng hợp mới nhất】Toàn bộ hướng dẫn & dự án thực chiến Java Backend của Shang Silicon Valley](https://mp.weixin.qq.com/s/jkZthmOSDgTF1PrCeNus_A) (khuyến nghị).

![](https://oss.javaguide.cn/github/javaguide/books/88714e9becd0485aae247772b6ed9949.png)

Đối với các bạn chuyên nghiên cứu nguyên lý nền tảng Spring Boot, có thể xem **[《Tư tưởng lập trình Spring Boot (phần cốt lõi)》](https://book.douban.com/subject/33390560/)**.

![《Tư tưởng lập trình Spring Boot (phần cốt lõi)》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113546513.png)

Quyển sách này hơi dài dòng một chút, tuy nhiên, nguyên lý giới thiệu khá rõ ràng (không thích hợp cho người mới bắt đầu).

Nếu bạn khá thích xem video, khuyến nghị [**《Phiên bản 2023 Spring Boot3 nhập môn từ con số 0》**](https://www.bilibili.com/video/BV1Es4y1q7Bf/) của Lôi Thần 雷神 Shang Silicon Valley. Đây có thể là hướng dẫn Spring Boot miễn phí chất lượng cao nhất toàn mạng, đánh giá nổ tung!

Ngoài ra, mảng Spring Boot còn có rất nhiều hướng dẫn mã nguồn mở chất lượng cao, tôi đã tổng hợp đặt trong [Hướng dẫn công nghệ mã nguồn mở Java chất lượng cao](https://javaguide.cn/open-source-project/tutorial.html#springboot).

![](https://oss.javaguide.cn/github/javaguide/open-source-project/open-source-project-springboot-technical-course.png)

### MyBatis

MyBatis là ORM framework được dùng nhiều nhất trong nước. Khi học Spring/Spring Boot, bạn nên tiện thể học luôn MyBatis, điều này tôi đã nhắc phía trên rồi.

Ngoài ra, khuyên bạn còn nên nắm vững ít nhất một MyBatis tăng cường framework, ở đây khuyến nghị hai cái nội địa:

1. [MyBatis-Plus](https://baomidou.com/): gọi tắt MP, dựa trên MyBatis chỉ làm tăng cường không làm thay đổi, sinh ra để đơn giản hóa phát triển, nâng cao hiệu quả.
2. [MyBatis-Flex](https://mybatis-flex.com/): rất nhẹ, đồng thời sở hữu hiệu năng và tính linh hoạt cực cao.

Đối với các bạn làm dự án, cũng có thể trực tiếp chọn học dùng MyBatis tăng cường framework.

### Unit test

Với unit test, hiện tại unit test framework thường dùng có: JUnit, Mockito, Spock, PowerMock, JMockit, TestableMock v.v..

JUnit gần như là lựa chọn mặc định, nhưng nó không hỗ trợ Mock, do đó chúng ta vẫn cần chọn một công cụ Mock. Mockito và Spock là hai công cụ Mock phổ biến nhất, thường đều chọn một trong hai.

Rốt cuộc chọn Mockito hay Spock? Ở đây tôi làm một số phân tích so sánh đơn giản:

1. Spock không Mock được static method và private method, từ Mockito 3.4.0 trở đi, hỗ trợ Mock static method, cụ thể có thể xem issue này: [mockito/mockito#1013](https://github.com/mockito/mockito/issues/1013), hướng dẫn cụ thể có thể xem bài viết này: [Mocking Static Methods With Mockito](https://www.baeldung.com/mockito-mock-static-methods).
2. Spock dựa trên Groovy, test code viết ra rõ ràng dễ đọc hơn, khá chuẩn (tự mang common test structure given-when-then). Mockito không có chuẩn cấu trúc cụ thể, cần nhóm dự án tự quy ước hoặc tuân theo practice tốt của test code. Thông thường, cùng một test case, code của Spock đơn giản hơn.
3. Mockito số người dùng rộng rãi hơn, ổn định đáng tin cậy. Hơn nữa, Mockito là công cụ Mock được tích hợp mặc định trong SpringBoot Test.

Mockito và Spock đều là công cụ Mock rất tốt, tương đối mà nói, tính thích ứng của Mockito mạnh hơn một chút.

Ở đây thuận tiện khuyến nghị một số tài liệu học tập liên quan test:

1. [Hướng dẫn đào tạo unit test nội bộ Alibaba](https://mp.weixin.qq.com/s/wzGxqNv58Zig9_Izi3VhDg)
2. [Unit test rốt cuộc là gì? Nên làm thế nào?](https://javaguide.cn/system-design/basis/unit-test.html)
3. [Integration Testing in Spring](https://www.baeldung.com/integration-testing-in-spring)
4. [Testing the Web Layer](https://spring.io/guides/gs/testing-web/)
5. [Có thể là bài viết nhập môn đơn test Spock hay nhất toàn mạng:](https://mp.weixin.qq.com/s/axNE8OjFh9V9SGgaCZVgOw)
6. [Chia sẻ thực hành triển khai unit test framework Mockito](https://mp.weixin.qq.com/s/6s_5XSzKp8fckKuojSvXUw)
7. [Làm thế nào viết ra unit test hiệu quả](https://mp.weixin.qq.com/s/Y75fSX92kysSmYrhEH6QFQ)

### Netty (tùy chọn)

Netty là framework hot nhất về lập trình mạng Java, mọi người có thể căn cứ nhu cầu cá nhân quyết định có học hay không, trong phát triển doanh nghiệp thực tế dùng không nhiều.

Tuy nhiên, cá nhân khuyên các bạn học còn sức dư vẫn nên tranh thủ thời gian học nghiêm túc, đối với việc nâng cao khả năng phát triển cá nhân vẫn rất có ích.

1. Netty dựa trên NIO (NIO là một I/O model đồng bộ không chặn, trong Java 1.4 đã giới thiệu NIO). Dùng Netty có thể đơn giản hóa rất nhiều lập trình mạng như TCP và UDP socket server, hơn nữa hiệu năng và độ an toàn và nhiều mặt khác đều rất xuất sắc.
2. Những dự án mã nguồn mở hot mà chúng ta thường tiếp xúc như Dubbo, RocketMQ, Elasticsearch, gRPC, Spark, Elasticsearch v.v. đều dùng Netty.
3. Phần liên quan giao tiếp mạng dưới tầng của phần lớn microservice framework đều dựa trên Netty, ví dụ gateway Spring Cloud Gateway trong hệ sinh thái Spring Cloud.

Dưới đây là một số sách/chuyên mục khá khuyến nghị.

[《Netty 实战》](https://book.douban.com/subject/27038538/)

![《Netty 实战》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113715369.png)

Quyển sách này có thể dùng để nhập môn Netty, nội dung từ BIO nói đến NIO, sau đó mới chi tiết giới thiệu tại sao có Netty, tại sao Netty dễ dùng cũng như giảng giải các điểm kiến thức quan trọng của Netty.

Quyển sách này cơ bản giới thiệu hết các điểm kiến thức quan trọng của Netty, mà cơ bản đều giảng giải theo hình thức thực chiến.

[《Netty 进阶之路：跟着案例学 Netty》](https://book.douban.com/subject/30381214/)

![《Netty 进阶之路：跟着案例学 Netty》-Douban](https://oss.javaguide.cn/github/javaguide/books/image-20220424113747345.png)

Nội dung đều là về case thực chiến dùng Netty như rò rỉ bộ nhớ (memory leak) những thứ này. Nếu bạn thấy mình đã nhập môn Netty hoàn toàn, và muốn nắm sâu hơn về Netty, khuyến nghị bạn xem quyển sách này.

**[《Học Netty cùng Flash: Netty thực chiến chat tức thời và nguyên lý nền tảng》](https://book.douban.com/subject/35752082/)**

![](https://oss.javaguide.cn/github/javaguide/open-source-project/image-20220503085034268.png)

Quyển sách này chia làm hai phần trên và dưới, phần trên thông qua case thực chiến hệ thống chat tức thời dẫn bạn nhập môn Netty, phần dưới thông qua phân tích source code Netty giúp bạn làm rõ nguyên lý nền tảng khá quan trọng của Netty.

Về video, [Toàn bộ hướng dẫn Netty của lập trình viên Heima (黑马程序员)](https://www.bilibili.com/video/BV1py4y1E7oA) khá hay, từ kiến thức cơ bản NIO của Netty giảng lên, tương đối dễ tiếp thu.

![](https://oss.javaguide.cn/github/javaguide/open-source-project/image-20220503115418795.png)

### Workflow (tùy chọn)

Trong nước dùng nhiều open source workflow engine là Flowable và Activiti hai cái, tài liệu tham khảo cũng khá nhiều. Camunda cũng không tệ, nhẹ hơn, chức năng cũng hoàn thiện, hiệu năng và độ ổn định cũng khá tốt. Về việc chọn lựa open source flow engine, có thể tham khảo bài viết này: [Tham khảo chọn lựa open source flow engine](https://zhuanlan.zhihu.com/p/369761832).

ps: Flowable và Camunda đều phát triển từ một nhánh con của Activiti5, lý niệm của ba bên có khác biệt.

Workflow engine khá hot trong nước [LiteFlow](https://liteflow.cc/) chỉ làm luân chuyển dựa trên logic, mà không làm luân chuyển dựa trên vai trò task. Nếu bạn muốn làm luân chuyển dựa trên vai trò task, khuyến nghị dùng Flowable và Activiti hai framework này. Nói cách khác, như luồng phê duyệt (A phê duyệt xong nên B phê duyệt, rồi mới luân chuyển đến vai trò C) loại này LiteFlow không thích hợp. LiteFlow thích hợp cho nghiệp vụ có logic phức tạp, ví dụ price engine, luồng đặt hàng (order), những nghiệp vụ này thường có rất nhiều bước, những bước này hoàn toàn có thể theo độ hạt nghiệp vụ tách thành từng component độc lập, tiến hành lắp ráp tái dụng biến đổi.

Ở đây không khuyến nghị tài liệu học tập, bạn bè hứng thú có thể tự mình tìm.

## Search engine (Công cụ tìm kiếm)

Search engine dùng để nâng cao hiệu quả tìm kiếm, chức năng tương tự search engine của trình duyệt. Search engine khá phổ biến là Elasticsearch (khuyến nghị) và Solr.

Nếu bạn muốn học Elasticsearch, [Cộng đồng tiếng Trung Elastic](http://www.elasticsearch.cn/) cũng như [Blog chính thức Elastic](https://www.elastic.co/cn/blog/) đều là tài nguyên rất tốt, phía trên sẽ chia sẻ rất nhiều case thực chiến cụ thể.

Video hướng dẫn có thể xem [《ElasticSearch từ nhập môn đến tinh thông》](https://www.bilibili.com/video/BV1hh411D7sb/) của Shang Silicon Valley, phía trước giảng dựa trên ElasticSearch 7.x, phía sau thêm mới tính năng mới Elasticsearch8.x.

Sách có thể xem《一本书讲透Elasticsearch：原理、进阶与工程实践》. Quyển sách này biên soạn dựa trên phiên bản 8.x, hiện là quyển sách giảng giải Elasticsearch mới nhất toàn mạng. Nội dung bao phủ các điểm kiến thức cốt lõi của chứng chỉ chính thức Elastic, bắt nguồn từ case dự án thực tế và giải đáp vấn đề cấp doanh nghiệp.

![](https://oss.javaguide.cn/github/javaguide/books/one-book-guide-to-elasticsearch.png)

Cuối cùng, lại khuyến nghị một số bài viết và series xuất sắc liên quan ElasticSearch để giúp bạn học và dùng tốt hơn ElasticSearch:

- [Tổng hợp câu hỏi phỏng vấn Elasticsearch thường gặp - JavaGuide](https://javaguide.cn/database/elasticsearch/elasticsearch-questions-01.html)
- [Bài chi tiết nhập môn cơ bản Elasticsearch - Tencent Technology Engineering](https://mp.weixin.qq.com/s/GG_zrQlaiP2nfPOxzx_j9w)
- [Một số quy chuẩn sử dụng ElasticSearch trong công việc](https://juejin.cn/post/7244819106343518268)
- [《Series ES của công nghệ DiDi》](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU1ODEzNjI2NA==&action=getalbum&album_id=3044498415449210882&scene=173&from_msgid=2247560768&from_itemidx=1&count=3&nolastread=1#wechat_redirect)
- [《Series Elasticsearch cứng đầu》](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI2NDY1MTA3OQ==&action=getalbum&album_id=1340073242396114944&scene=173&from_msgid=2247487667&from_itemidx=1&count=3&nolastread=1#wechat_redirect) (hơn trăm bài viết lý luận + thực chiến ES, hướng dẫn ES toàn diện nhất toàn mạng. Video hướng dẫn tương ứng của một phần nội dung: <https://space.bilibili.com/471049389> )

## Phân tán & Microservice (nâng cao)

Phần nội dung này liên quan khá nhiều điểm kiến thức, tôi chỉ liệt kê phần quan trọng như distributed algorithm và protocol, config center, distributed transaction.

Học kiến thức phân tán, cá nhân khá khuyến nghị đọc sách và blog. Đương nhiên, nếu khá thích xem video, cũng có thể tìm một số video hướng dẫn hay hoặc lớp học mở để xem, dùng cách học phù hợp với bản thân là được!

**Khuyến nghị sách (nghiêng lý luận)**:

《深入理解分布式系统》 quyển sách này rất tuyệt. Tác giả dùng khối lượng lớn độ dài để giới thiệu thuật toán consensus rất quan trọng trong lĩnh vực phân tán, hơn nữa còn dựa trên Go language đưa bạn từ con số 0 triển khai thuật toán Paxos - ông tổ của thuật toán consensus.

![](https://oss.javaguide.cn/github/javaguide/books/deep-understanding-of-distributed-system.png)

《从零开始学架构》 quyển sách này nội dung tương đối toàn diện, phân tán, microservice, high concurrency, high availability đều có đề cập. Quyển sách này tương ứng với chuyên mục của GeekTime: [《Học kiến trúc từ con số 0》](http://gk.link/a/10pKZ), trong đó rất nhiều nội dung đều là của chuyên mục này, chọn một trong hai đọc là được.

![](https://oss.javaguide.cn/github/javaguide/books/20210412224443177.png)

Quyển [《Thiết kế kiến trúc phần mềm: con đường dung hợp kiến trúc công nghệ website lớn và kiến trúc nghiệp vụ》](https://book.douban.com/subject/30443578/) của thầy Dư (余老师) này tương tự 《从零开始学架构》, nội dung đồng dạng khá toàn diện, cũng rất tốt.

![img](https://oss.javaguide.cn/github/javaguide/books/20210412232441459.png)

**Khuyến nghị lớp học mở (nghiêng lý luận)**:

MIT6.824: Distributed System lớp học mở này khá kinh điển. Mỗi tiết khóa học đều tinh đọc một bài luận kinh điển trong lĩnh vực distributed system, và từ đó truyền dạy những nguyên tắc quan trọng và kỹ thuật then chốt của thiết kế và triển khai distributed system.

- [Làm thế nào mới học tốt hơn khóa học distributed system MIT6.824?](https://www.zhihu.com/question/29597104)
- [MIT6.824: Distributed System (wiki dịch tiếng Trung)](https://mit-public-courses-cn-translatio.gitbook.io/mit6-824/)
- [MIT6.824: Distributed System - Hướng dẫn tự học CS](https://csdiy.wiki/%E5%B9%B6%E8%A1%8C%E4%B8%8E%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/MIT6.824/)

**Khuyến nghị video (nghiêng thực chiến)**:

Video có thể trực tiếp học [Hướng dẫn Spring Cloud phiên bản mới nhất 2024](https://www.bilibili.com/video/BV1gW421P7RD/) của Shang Silicon Valley, khóa học này giới thiệu các component phổ biến nhất hiện tại trong SpringCloud và SpringCloud Alibaba. Học xong khóa học này, có thể trực tiếp lên tay thực chiến phát triển dự án microservice.

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/java-learning-route/shangguigu-springcloud.png)

### Lý luận & thuật toán & giao thức

Lý luận & thuật toán & giao thức phân tán quan trọng có: CAP theory, BASE theory, thuật toán Paxos, Gossip protocol, thuật toán Raft v.v..

**Khuyến nghị bài viết**:

- [Giải thích chi tiết lý luận CAP & BASE](https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html)
- [Giải thích chi tiết thuật toán Paxos](https://javaguide.cn/distributed-system/protocol/paxos-algorithm.html)
- [Giải thích chi tiết thuật toán Raft](https://javaguide.cn/distributed-system/protocol/raft-algorithm.html)
- [Giải thích chi tiết Gossip protocol](https://javaguide.cn/distributed-system/protocol/gossip-protocl.html)

### Remote call (Gọi từ xa)

Việc gọi giữa các service khác nhau thường có hai cách:

- RPC: RPC (Remote Procedure Call) tức là gọi thủ tục từ xa, thông qua RPC có thể giúp chúng ta gọi method của một service nào đó trên máy tính từ xa, quá trình này đơn giản như gọi method local. Dubbo là một RPC framework nội địa, do Alibaba open source, dùng nhiều nhất trong nước.
- HTTP client: thông qua giao thức HTTP gọi RESTful API của service khác. Feign và OpenFeign (Spring Cloud chính thức phát triển dựa trên Feign, dùng để thay thế Feign đã ngừng bảo trì) là HTTP client thường dùng nhất hiện tại.

OpenFeign và Dubbo đều là remote call framework được ứng dụng rộng rãi trong kiến trúc microservice, nhưng hai bên cách triển khai khác nhau (OpenFeign dựa trên giao thức HTTP, Dubbo hỗ trợ nhiều giao thức, còn có thể tùy chỉnh giao thức), scene thích hợp cũng có khác biệt nhất định. Dự án microservice Spring Cloud hiện tại dùng khá nhiều cách gọi dựa trên phong cách Rest là OpenFeign, cá nhân khá khuyến nghị học cái này.

Tuy nhiên, nếu dự án bạn theo hướng dẫn làm dùng Dubbo hoặc công việc cần dùng Dubbo, thì bạn có thể chủ yếu học Dubbo. Khuyến nghị bản tổng kết tôi viết:

- [Tổng kết kiến thức căn bản RPC](https://javaguide.cn/distributed-system/rpc/rpc-intro.html)
- [Tổng hợp vấn đề thường gặp Dubbo](https://javaguide.cn/distributed-system/rpc/dubbo.html)

Ngoài ra, tài liệu chính thức Dubbo nhất định phải xem, địa chỉ: <https://cn.dubbo.apache.org/zh-cn/overview/home/>.

### Đăng ký và phát hiện service

Eureka, Zookeeper, Consul, Nacos đều có thể cung cấp chức năng đăng ký và phát hiện service.

Cá nhân khá khuyến nghị học Nacos, trong nước dùng khá nhiều, chức năng cũng mạnh hơn! Ngoài cung cấp chức năng đăng ký và phát hiện service, còn có thể dùng làm config center.

Học Nacos, tài liệu chính thức nhất định phải xem: <https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html>.

Ngoài ra, lại khuyến nghị một số tài liệu học tập tôi thấy khá hay:

- [Nacos kiến trúc & nguyên lý - Alibaba Tàng Kinh Các](https://developer.aliyun.com/ebook/36) (khuyến nghị, như thiết kế lõi Nacos, nguyên lý nền tảng, best practice)

- [55 hình ăn trọn Nacos - Bất Tài Trần Mỗ](https://www.cnblogs.com/cbvlog/p/15636683.html)

- [Phân tích minh họa việc triển khai config center Nacos - JueJin](https://juejin.cn/post/6844904050840993805) (không dán quá nhiều code, nguyên lý giảng rất rõ)

- [Nacos giúp chúng ta giải quyết vấn đề gì? —— Phần quản lý cấu hình - Alibaba middleware](https://nacos.io/zh-cn/blog/5w1h-what.html)

### API Gateway

Gateway có thể cung cấp cho chúng ta các chức năng như chuyển tiếp yêu cầu, chứng thực an toàn (chứng thực danh tính/phân quyền), kiểm soát lưu lượng, cân bằng tải, giảm tải cầu chì, log, giám sát, kiểm tra tham số, chuyển đổi giao thức v.v..

Về kiến thức cơ bản API gateway và chọn lựa công nghệ khuyến nghị đọc bài viết [Tổng kết kiến thức căn bản API Gateway](https://javaguide.cn/distributed-system/api-gateway.html) tôi viết.

Dự án microservice Spring Cloud khá khuyến nghị dùng SpringCloud Gateway làm API gateway, đây là một dự án hoàn toàn mới của Spring Cloud, dùng để thay thế Netflix Zuul. Để nâng cao hiệu năng gateway, SpringCloud Gateway được triển khai dựa trên WebFlux. Mục tiêu của Spring Cloud Gateway là không chỉ cung cấp cách route thống nhất, mà còn dựa trên chuỗi Filter cung cấp chức năng cơ bản của gateway, ví dụ: bảo mật, giám sát/metrics, và limit lưu lượng.

Dưới đây là những tài liệu học tập tôi thấy khá hay:

- [Tổng hợp vấn đề thường gặp Spring Cloud Gateway - JavaGuide](https://javaguide.cn/distributed-system/spring-cloud-gateway-questions.html)
- [6000 chữ | 16 hình | hiểu sâu nguyên lý Spring Cloud Gateway - Ta Nói Kiến Trúc](https://mp.weixin.qq.com/s/XjFYsP1IUqNzWqXZdJn-Aw)
- [Spring Cloud Gateway 10 câu hỏi liên hoàn? - Bất Tài Trần Mỗ](https://www.cnblogs.com/cbvlog/p/15493160.html)
- [Spring Cloud Gateway tích hợp Alibaba Sentinel gateway limit lưu lượng thực chiến! - Bất Tài Trần Mỗ](https://www.cnblogs.com/cbvlog/p/15512189.html)
- [Thực chiến Spring Cloud Gateway phần limit lưu lượng - aneasystone](https://www.aneasystone.com/archives/2020/08/spring-cloud-gateway-current-limiting.html) (với các thuật toán limit lưu lượng và component thường gặp đều có giới thiệu)

### Config center (Trung tâm cấu hình)

Trong microservice, sự phát triển nghiệp vụ thường dẫn đến số lượng service tăng lên, từ đó dẫn đến cấu hình chương trình (địa chỉ service, tham số cơ sở dữ liệu v.v..) tăng lên.

Cách tệp cấu hình truyền thống đã không đáp ứng được nhu cầu hiện tại, chủ yếu có hai nguyên nhân: một là an toàn không được đảm bảo (cấu hình đặt trong code repo dễ bị lộ); hai là tính kịp thời kém (sửa cấu hình cần restart service mới có hiệu lực).

Spring Cloud Config, Nacos, Apollo, K8s ConfigMap đều có thể dùng làm config center.

Apollo và Nacos cá nhân tôi thích hơn. Nacos dùng thuận tay hơn, còn có thể tiện thể dùng làm registration center, Apollo trong quản lý cấu hình làm toàn diện hơn.

Cá nhân vẫn khuyến nghị học Nacos, tài liệu học đã khuyến nghị trong phần đăng ký và phát hiện service phía trên rồi.

### Distributed ID

ID là định danh duy nhất của dữ liệu, distributed ID là ID trong distributed system.

Giải pháp distributed ID có rất nhiều, ví dụ:

- Thuật toán: UUID, Snowflake (thuật toán bông tuyết)
- Open source framework: UidGenerator (Baidu), Leaf (Meituan), Tinyid (DiDi), IdGenerator (cá nhân)

Phần nội dung này tương đối đơn giản, khuyến nghị đọc hai bài viết dưới đây để học:

- [Giới thiệu & tổng hợp giải pháp triển khai Distributed ID](https://javaguide.cn/distributed-system/distributed-id.html)
- [Hướng dẫn thiết kế Distributed ID](https://javaguide.cn/distributed-system/distributed-id-design.html)

### Distributed transaction (Giao dịch phân tán)

Trong kiến trúc microservice, một hệ thống bị tách thành nhiều microservice nhỏ.

Mỗi microservice đều có thể nằm trên những máy khác nhau, hơn nữa mỗi microservice đều có thể có một cơ sở dữ liệu riêng cho mình dùng. Trong trường hợp này, một nhóm thao tác có thể liên quan đến nhiều microservice và nhiều cơ sở dữ liệu.

Lấy ví dụ: trong hệ thống thương mại điện tử, bạn tạo một đơn hàng thường liên quan đến service đơn hàng (số đơn hàng cộng một), service kho (kho trừ một) v.v. các service, những service này có cơ sở dữ liệu riêng cho mình dùng.

![Sơ đồ minh họa distributed transaction](https://cdn.jsdelivr.net/gh/javaguide-tech/blog-images-6@main/12-04-1/%E5%88%86%E5%B8%83%E5%BC%8F%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

**Vậy làm thế nào đảm bảo nhóm thao tác này hoặc là đều thực thi thành công, hoặc là đều thực thi thất bại?**

Lúc này chỉ riêng dựa vào database transaction thì không được! Chúng ta cần giới thiệu khái niệm **distributed transaction** này!

Giải pháp distributed transaction thường dùng có Seata và Hmily.

1. [Seata](https://seata.io/zh-cn/index.html "Seata"): Seata là một giải pháp distributed transaction mã nguồn mở, cam kết cung cấp dịch vụ distributed transaction hiệu năng cao và dễ dùng trong kiến trúc microservice.
2. [Hmily](https://gitee.com/shuaiqiyu/hmily "Hmily"): giải pháp distributed transaction cấp tài chính.

Hiện tại trong nước dùng khá nhiều là Seata, khuyên học cái này.

### Distributed tracing (Theo vết phân tán)

Không giống kiến trúc monolith, trong kiến trúc phân tán, yêu cầu cần gọi giữa nhiều service, việc tra cứu vấn đề sẽ rất phiền phức. Chúng ta cần hệ thống distributed tracing (theo vết phân tán) để giải quyết điểm đau này.

Hiện tại hệ thống distributed tracing cơ bản đều phát triển dựa theo bài luận 《Hệ thống theo vết của hệ thống quy mô lớn Dapper》 của Google, chủ lưu có Pinpoint, Skywalking, CAT (đương nhiên cũng có sản phẩm khác như Zipkin, Jaeger v.v., nhưng nhìn tổng thể độ hoàn thiện không bằng 3 cái kể trên) v.v..

Zipkin là công cụ distributed tracing do công ty Twitter open source, Spring Cloud Sleuth thực chất dựa trên Zipkin.

SkyWalking là công cụ distributed tracing, phân tích, cảnh báo do người Trung Quốc Ngô Thịnh (Wú Shèng, Huawei) open source, hiện là dự án mã nguồn mở dưới Apache.

Hiện tại trong nước dùng khá nhiều là SkyWalking, khuyên học cái này.

## Hiệu năng cao (nâng cao)

### CDN (chỉ cần nắm vững khái niệm và nguyên lý)

CDN là phân phát static resource đến nhiều nơi khác nhau để thực hiện truy cập gần nhất (nearby access), từ đó tăng tốc tốc độ truy cập static resource, giảm gánh nặng cho server và băng thông.

Chúng ta chỉ cần nắm vững khái niệm cơ bản và nguyên lý của CDN cùng như biết dùng dịch vụ CDN có sẵn do cloud provider cung cấp là được, không tốn quá nhiều thời gian. Khuyến nghị đọc bài viết [Tổng hợp vấn đề thường gặp CDN](https://javaguide.cn/high-performance/cdn.html) tôi viết.

### Message queue (Hàng đợi thông điệp)

Message queue trong distributed system chủ yếu để asynchronous, giảm khớp nối (decoupling) và giảm đỉnh (peak clipping).

Message queue thường dùng như sau:

1. [RocketMQ](https://github.com/apache/rocketmq "RocketMQ"): một message middleware phân tán hiệu năng cao, throughput cao do Alibaba open source.
2. [Kafka](https://github.com/apache/kafka "Kafaka"): Kafka là một message system phân tán, dựa trên phát hành / đăng ký.
3. [RabbitMQ](https://github.com/rabbitmq "RabbitMQ"): message queue phát triển dựa trên erlang, dựa trên giao thức AMQP (Advanced Message Queue - giao thức hàng đợi thông điệp cao cấp) thực hiện.
4. [Pulsar](https://github.com/apache/pulsar): nền tảng distributed message streaming cloud-native thế hệ tiếp theo.

Khuyên nên chọn một trong RocketMQ và Kafka để học sâu, các message queue khác chỉ cần hiểu là được.

Về giới thiệu khái niệm cơ bản message queue, chọn lựa công nghệ, khuyên đọc bài viết [Tổng kết kiến thức căn bản message queue](https://javaguide.cn/high-performance/message-queue/message-queue.html) tôi viết.

Khuyến nghị tài nguyên học Kafka, RocketMQ, RabbitMQ xem bài viết này của [Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html): <https://t.zsxq.com/0bEDFwgon>.

### Read-write separation & DB sharding (chỉ cần nắm vững khái niệm và nguyên lý)

Read-write separation (tách đọc ghi) chủ yếu là để phân bổ thao tác đọc và ghi của cơ sở dữ liệu đến các node cơ sở dữ liệu khác nhau. Server chính phụ trách ghi, server phụ phụ trách đọc. Ngoài ra, một chủ một phụ hoặc một chủ nhiều phụ đều được.

Read-write separation có thể nâng cao đáng kể hiệu năng đọc, nâng cao nhẹ hiệu năng ghi. Do đó, read-write separation thích hợp hơn cho scene yêu cầu đọc đồng thời đơn máy nhiều.

![Sơ đồ minh họa read-write separation](https://oss.javaguide.cn/github/javaguide/high-performance/read-and-write-separation-and-library-subtable/read-and-write-separation.png)

DB sharding (phân mảnh cơ sở dữ liệu) là để giải quyết vấn đề hiệu năng cơ sở dữ liệu liên tục suy giảm do lượng dữ liệu DB, bảng quá lớn.

Công cụ DB sharding thường gặp có: sharding-jdbc (Dangdang 当当), TSharding (Mogu Street 蘑菇街), MyCAT (dựa trên Cobar), Cobar (Alibaba).... Khuyến nghị dùng sharding-jdbc. Bởi vì, sharding-jdbc là một Java framework nhẹ, cung cấp dịch vụ dưới dạng jar package, không cần chúng ta làm thêm công việc vận hành, và tính tương thích cũng tốt.

![DB sharding](https://oss.javaguide.cn/java-guide-blog/662ea3bda90061d0b40177e3a46fefc3.jpg)

Hiện nay nhiều công ty đều dùng loại distributed relational database như TiDB, không cần chúng ta thủ công làm DB sharding, do đó chúng ta chỉ cần nắm vững khái niệm và nguyên lý thường gặp của read-write separation & DB sharding là được, không cần tốn quá nhiều thời gian thực hành, khuyến nghị đọc bài viết [Tổng hợp vấn đề thường gặp read-write separation & DB sharding](https://javaguide.cn/high-performance/read-and-write-separation-and-library-subtable.html) tôi viết.

### Cân bằng tải (Load balancing)

Hệ thống cân bằng tải thường dùng để phân phối các task như xử lý yêu cầu người dùng đến nhiều server, nhằm nâng cao hiệu năng và độ tin cậy của website, ứng dụng hoặc cơ sở dữ liệu.

Trong quá trình phát triển, cân bằng tải chúng ta tiếp xúc có thể đơn giản chia làm **cân bằng tải server-side** và **cân bằng tải client-side** hai loại. Cân bằng tải server-side có thể thông qua phần cứng (ví dụ F5, A10, Array) hoặc phần mềm (ví dụ LVS, Nginx, HAproxy) thực hiện. Các microservice framework chủ lưu trong lĩnh vực Java như Dubbo, Spring Cloud đều tích hợp sẵn giải pháp cân bằng tải client-side dùng ngay được. Dubbo thuộc loại mặc định tự mang chức năng cân bằng tải, Spring Cloud thực hiện cân bằng tải theo hình thức component, thuộc loại tùy chọn, khá thường dùng là Spring Cloud Load Balancer (chính thức, khuyến nghị) và Ribbon (Netflix, đã ngừng).

Cá nhân khuyên học một chút Nginx và Spring Cloud Load Balancer.

Khái niệm, thuật toán và giải pháp kỹ thuật thường gặp của cân bằng tải có thể xem bài viết này: [Tổng hợp vấn đề thường gặp cân bằng tải](https://javaguide.cn/high-performance/load-balancing.html).

## High availability (Tính sẵn sàng cao) (nâng cao)

High availability mô tả một hệ thống khả dụng phần lớn thời gian, có thể cung cấp dịch vụ cho chúng ta. High availability đại diện cho dù hệ thống gặp sự cố phần cứng hoặc nâng cấp hệ thống, dịch vụ vẫn khả dụng.

### Limit lưu lượng & Hạ cấp & Cầu chì

Limit lưu lượng (rate limiting) là cân nhắc từ góc độ áp lực truy cập người dùng làm thế nào đối phó với sự cố hệ thống. Limit lưu lượng nhằm giới hạn tần suất interface phía server nhận yêu cầu, phòng chống server sập. Ví dụ giới hạn yêu cầu của một interface là 100 mỗi giây, yêu cầu vượt qua giới hạn thì bỏ qua xử lý hoặc đặt vào hàng đợi chờ xử lý. Limit lưu lượng có thể ứng phó hiệu quả đột biến yêu cầu quá nhiều.

Về giới thiệu limit lưu lượng dịch vụ khuyến nghị đọc bài viết [Giải thích chi tiết service rate limiting](https://javaguide.cn/high-availability/limit-request.html) tôi viết, bên trong có giới thiệu thuật toán limit lưu lượng thường gặp cũng như giải pháp kỹ thuật limit lưu lượng đơn máy và limit lưu lượng phân tán.

Hạ cấp (degradation) là cân nhắc từ góc độ ưu tiên chức năng hệ thống làm thế nào đối phó với sự cố hệ thống. Service degradation chỉ khi áp lực server tăng vọt, căn cứ tình hình nghiệp vụ hiện tại và lưu lượng có chiến lược hạ cấp một số service và trang, từ đó giải phóng tài nguyên server để đảm bảo vận hành bình thường của task cốt lõi.

Cầu chì (circuit breaking) và hạ cấp là hai khái niệm dễ nhầm lẫn, ý nghĩa của hai bên không giống nhau. Mục đích của hạ cấp là đối phó sự cố của bản thân hệ thống, còn mục đích của cầu chì là đối phó sự cố của hệ thống bên ngoài hoặc hệ thống bên thứ ba mà hệ thống hiện tại phụ thuộc.

[Hystrix](https://github.com/Netflix/Hystrix "Hystrix") do Netflix open source và [Sentinel](https://github.com/alibaba/Sentinel "Sentinel") do Alibaba open source đều có thể triển khai limit lưu lượng, hạ cấp, cầu chì. Tuy nhiên, Hystrix đã ngừng bảo trì, khuyến nghị dùng Sentinel chức năng mạnh hơn. Ngoài ra, trong Wiki của Sentinel có so sánh component limit lưu lượng hạ cấp thường dùng, ai hứng thú có thể xem, cổng truyền: [So sánh component limit lưu lượng hạ cấp thường dùng](https://github.com/alibaba/Sentinel/wiki/常用限流降级组件对比).

[Trong wiki của Sentinel đã mô tả chi tiết khác biệt của nó với Hystrix](https://github.com/alibaba/Sentinel/wiki/Sentinel-与-Hystrix-的对比), bạn có thể xem.

Học Sentinel, tài liệu chính thức nhất định phải xem: <https://sentinelguard.io/zh-cn/docs/introduction.html>.

Ngoài ra, lại khuyến nghị một số tài liệu học tập tôi thấy khá hay:

- [Thần khí limit lưu lượng Alibaba Sentinel 17 câu hỏi liên hoàn? - Bất Tài Trần Mỗ](https://mp.weixin.qq.com/s/w8lhJfhLdh7POpPw2MyPwA)
- [Vì sao Sentinel mạnh đến vậy, tôi moi ra nguyên lý triển khai đằng sau - Nhật ký java của Tam Hữu](https://mp.weixin.qq.com/s/FewOTrevjiCfooVIVwo4Xg)
- [Thiết kế thuật toán cửa sổ trượt rate limiting Sentinel - Ông Lão Nói Kiến Trúc](https://mp.weixin.qq.com/s/Q3C3DxtCJvTE5CCl3EWF9w)

### Xếp hàng (Queuing)

Một kiểu limit lưu lượng khác, tương tự như xếp hàng trong thế giới thực. Ai chơi Liên Minh Huyền Thoại (League of Legends) chắc đều có trải nghiệm, cứ mỗi lần có sự kiện, phải trải qua một đợt xếp hàng mới vào được game.

Cách triển khai xếp hàng có nhiều loại, ví dụ chúng ta có thể nhờ cậy message queue, các blocking queue trong JDK.

### Cluster

Triển khai nhân bản cùng một service nhiều bản, tránh sự cố điểm đơn (single point of failure).

### Cơ chế timeout và retry

**Một khi yêu cầu của người dùng vượt quá một khoảng thời gian nào đó không nhận được phản hồi thì kết thúc yêu cầu này và ném ngoại lệ.** Nếu không cài đặt timeout có thể dẫn đến tốc độ phản hồi yêu cầu chậm, thậm chí khiến yêu cầu tích đọng rồi khiến hệ thống không thể tiếp tục xử lý yêu cầu.

Ngoài ra, số lần retry thường đặt là 3 lần, retry quá nhiều lần không có lợi, ngược lại còn tăng thêm áp lực server (một số scene dùng cơ chế retry khi thất bại sẽ khá không thích hợp).

## Cloud native (tùy chọn)

> **Gợi ý**: Cloud native development yêu cầu năng lực rất cao, vị trí Java Backend thường cũng không yêu cầu kỹ năng cloud native development. Do đó, phần nội dung này không khuyến nghị các bạn không hứng thú hoặc không hiểu biết về cloud native development học, có thể chọn bỏ qua.

Cloud native là một hệ thống công nghệ và phương pháp luận hoàn chỉnh để xây dựng, vận hành ứng dụng trong cloud. Hệ thống công nghệ và phương pháp luận này hiện tại chỉ là microservice + DevOps + continuous delivery + containerization.

Ngày càng nhiều ngôn ngữ lập trình, framework bắt đầu ôm lấy cloud native, ví dụ Spring ra mắt công nghệ hướng cloud native Spring Native, RedHat open source Java cloud native service framework Quarkus.

Nếu bạn khá hứng thú với lĩnh vực cloud native, khuyên bạn chú trọng quan sát những công nghệ dưới đây:

1. Microservice: SpringCloud hoặc SpringCloud Alibaba thực ra không cần học, dưới cloud native thường dựa trên Kubernetes nhắc đến phía sau để xây dựng microservice.
2. Gateway: gateway là cổng vào lưu lượng của toàn bộ kiến trúc microservice, phụ trách chứng thực ủy quyền, phân phối yêu cầu, chứng thực ủy quyền, limit lưu lượng, quản lý API, cân bằng tải v.v. công việc, là một component rất quan trọng trong kiến trúc microservice. Do đó, tôi ở đây đặc biệt đơn độc tách gateway ra nhắc một câu.
3. Log và giám sát cảnh báo: Metrics (nhờ nó chúng ta có thể vẽ ra trong Grafana các bảng điều khiển trực quan khác nhau, hiểu toàn diện hơn trạng thái vận hành hệ thống của chúng ta), Trace (nhờ nó chúng ta có thể xây dựng ra toàn cảnh lời gọi hệ thống), Logs (một số bản ghi log cần thiết).
4. Container: công nghệ container là nền tảng của sự phát triển cloud native, công cụ container đứng đầu là Docker đưa ra khẩu hiệu "một lần build, chạy khắp nơi".
5. Kubernetes: K8s được gọi là hệ điều hành của thời đại cloud native, ưu thế của ứng dụng cloud native có quan hệ mật thiết với chức năng nó cung cấp.
6. DevOps: DevOps chú trọng làm thế nào hiện thực quản lý tự động hóa toàn bộ vòng đời (phát triển, test, vận hành) của ứng dụng, từ đó thực hiện chuyển giao phần mềm nhanh hơn, chất lượng cao hơn, tần suất cao hơn, ổn định hơn. Đội DevOps thường dùng kiến trúc microservice để xây dựng ứng dụng, nhờ tích hợp liên tục và chuyển giao liên tục (CI/CD) để triển khai DevOps.
7. ServiceMesh: bạn có thể xem Service Mesh là một lớp được trừu tượng hóa riêng để đơn giản hóa công việc phát triển, thường dùng làm lớp trong suốt nối vào ứng dụng phân tán hiện có.
8. ……

Trong đó, quan trọng hơn là Kubernetes. Nếu bạn làm dự án, khuyên nên ưu tiên cân nhắc dự án liên quan Kubernetes.

Trước đây tôi từng viết một bài giới thiệu cloud native, có thể xem: [Thời đại cloud native, lập trình viên nên nắm vững những năng lực gì?](https://mp.weixin.qq.com/s/ZVbwNnvRwXxQqk7A-OA27g).

Ngoài ra, còn khuyến nghị xem bài này: [Kiến trúc cloud native 2024 cần những tech stack nào](https://crossoverjie.top/2024/04/11/ob/2024-cloud-native/).

## Phát triển ứng dụng AI (lộ trình mở rộng)

AI đã trở thành một phần của hệ thống năng lực Java Backend, nhưng không khuyến nghị ngay từ đầu nhét nó vào tuyến chính Java để học ép. Nhịp điệu ổn định hơn là: trước tiên đánh chắc Java căn bản, Spring, cơ sở dữ liệu, cache, phân tán và thực chiến dự án, rồi mới theo lộ trình dưới đây hệ thống bổ sung phát triển ứng dụng AI.

- [Lộ trình học phát triển ứng dụng AI và Agent cho developer Java/Go (phiên bản mới nhất 2026)](./java-to-ai-roadmap.md): hướng đến backend developer, theo nền tảng mô hình lớn, LLM API, Prompt, RAG, Agent, công nghiệp hóa và thực chiến dự án để tách giải đường học tập.
- [Khuyến nghị học chuyển hóa backend developer thành AI Agent (phiên bản mới nhất 2026)](./backend-to-ai-agent-roadmap.md): nếu bạn chưa chắc chắn có nên chuyển sang AI không, Java AI và Python AI chọn thế nào, có thể ném vào vị trí nào, có thể xem trước bài này.
- [Hệ thống kiến thức phát triển ứng dụng AI](../ai/): lối vào nhóm bài viết hệ thống ngoài lộ trình học, bao gồm nền tảng mô hình lớn, Agent, RAG, MCP, Prompt engineering, đánh giá và thiết kế hệ thống AI.
- [Hướng dẫn thực chiến lập trình AI](../ai-coding/): lộ trình nâng cao hiệu quả code hằng ngày, trọng điểm xem Claude Code, Codex, AI IDE, CLI Agent, quản lý ngữ cảnh và quy trình phát triển hỗ trợ AI.

Nếu bạn chỉ chuẩn bị phỏng vấn Java Backend, phần AI này có thể trước tiên hiểu khái niệm cơ bản; nếu mục tiêu là phát triển ứng dụng AI, kỹ sư Agent, khuyên nên trực tiếp theo lộ trình phát triển ứng dụng AI phía trên thúc tiến.

## Tổng kết

Đây là một lộ trình học rất chi tiết, sau khi học xong nội dung phía trên, tìm được một công việc khá tốt đã tương đối dễ dàng.

Ngoài ra, tôi cũng đã nói phía trên rồi, nếu bạn thấy nội dung nhiều quá mình học không hết hoặc nếu bạn chỉ muốn tìm một công việc phát triển ở công ty nhỏ, khuyên bạn nên tập trung vào Java căn bản, cơ sở dữ liệu, framework thông dụng, công cụ thông dụng.

Giống những điểm kiến thức như JVM, phân tán, high concurrency, high availability, microservice, nếu bạn muốn vào công ty lớn hoặc muốn bản thân cạnh tranh hơn khi tìm việc, thì bạn cũng cần dành thêm thời gian học.

Hiện nay phỏng vấn rất cạnh tranh, muốn tìm được công việc tốt thì cần phải học nhiều hơn, luyện tập nhiều hơn. Dù hiện tại bạn học nhiều kiến thức mà sau khi đi làm có thể không dùng đến, nhưng quá trình chọn lọc phỏng vấn lại cần bạn biết những điều này. Dù sao, nhiều vị trí là nhiều người cùng cạnh tranh, để đạt hiệu quả sàng lọc, độ khó phỏng vấn thường sẽ khá lớn. Đây chính là cái gọi là: "Phỏng vấn xây tên lửa, vào làm vặn ốc".

## Tài khoản WeChat (khuyến nghị)

Bản cập nhật mới nhất của lộ trình học sẽ đồng bộ trước tiên trên tài khoản WeChat, khuyến nghị mọi người theo dõi một lượt!

![Tài khoản WeChat chính thức JavaGuide](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)

## Knowledge Planet

Để giúp nhiều bạn chuẩn bị phỏng vấn Java và học Java, tôi đã tạo một [Java phỏng vấn Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) thuần túy. Dù mức thu phí chỉ bằng một phần trăm của lớp luyện thi/training camp, nhưng chất lượng nội dung trong Knowledge Planet cao hơn, dịch vụ cung cấp cũng toàn diện hơn, rất thích hợp cho các bạn chuẩn bị phỏng vấn Java và học Java.

**Chào mừng các bạn chuẩn bị phỏng vấn Java và học Java gia nhập [Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) của tôi, kiến thức khô rất nhiều, không khí học tập cũng khá tốt! Thu phí dù là giá bèo, nhưng nội dung trong planet có lẽ còn chất lượng hơn cả việc bạn tham gia training camp hàng vạn tệ.**

[![Dịch vụ Planet](https://oss.javaguide.cn/xingqiu/xingqiufuwu.png)](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)
