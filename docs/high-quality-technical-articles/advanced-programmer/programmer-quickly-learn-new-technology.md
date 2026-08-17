---
title: Lập trình viên làm thế nào để nhanh chóng học công nghệ mới
description: "Lập trình viên làm thế nào để nhanh chóng học công nghệ mới: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn để hệ thống lại các khái niệm then chốt, câu hỏi thường gặp và điểm thực hành trọng yếu, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
tag:
  - 练级攻略
head:
  - - meta
    - name: keywords
      content: 程序员学习,技术学习方法,快速学习,官方文档,技术面试,八股文,知行合一,学习技巧
---

> **Lời giới thiệu**: Đây là một bài viết trong chuyên mục "Lộ trình luyện cấp" của [《Java 面试指北》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html), chia sẻ quan điểm của tôi về cách nhanh chóng học một công nghệ mới.
>
> ![《Java 面试指北》练级攻略篇](https://oss.javaguide.cn/javamianshizhibei/training-strategy-articles.png)

Rất nhiều khi, vì nhu cầu công việc chúng ta cần nhanh chóng học một công nghệ nào đó để áp dụng vào dự án. Hoặc là, công ty mà chúng ta muốn phỏng vấn yêu cầu một công nghệ mà trước đây chúng ta chưa từng tiếp xúc, để đáp ứng nhu cầu phỏng vấn, chúng ta cần nhanh chóng nắm vững công nghệ đó.

Là một lập trình viên tự học hoàn toàn từ con số 0, bài viết này sẽ đơn giản chia sẻ quan điểm của tôi về cách nhanh chóng học một công nghệ nào đó.

Khi học bất kỳ một công nghệ nào, trước tiên phải làm rõ công nghệ này được sinh ra để giải quyết vấn đề gì. Trước khi học sâu công nghệ này, nhất định phải hiểu công nghệ đó từ góc nhìn tổng thể, suy nghĩ xem nó được cấu thành từ những module nào, cung cấp những chức năng gì, và so với các công nghệ cùng loại thì nó có ưu điểm gì.

Ví dụ như khi chúng ta học Spring, thông qua tài liệu chính thức (official documentation) của Spring bạn có thể biết được động thái kỹ thuật mới nhất của Spring, Spring bao gồm những module nào, cũng như Spring có thể giúp bạn giải quyết những vấn đề gì.

![](https://oss.javaguide.cn/github/javaguide/system-design/web-real-time-message-push/20210506110341207.png)

Lại ví dụ như khi tôi học hàng đợi tin nhắn (message queue), tôi sẽ đi tìm hiểu hàng đợi tin nhắn này thường có vai trò gì trong hệ thống, giúp chúng ta giải quyết vấn đề gì. Hàng đợi tin nhắn có rất nhiều loại, khi cụ thể nghiên cứu một hàng đợi tin nhắn nào đó, tôi sẽ đem nó so sánh với những hàng đợi tin nhắn mà mình đã từng học. Giống như bản thân tôi khi học RocketMQ, tôi sẽ trước tiên đem nó so sánh với ActiveMQ - hàng đợi tin nhắn đầu tiên mà tôi từng học, suy nghĩ xem RocketMQ so với ActiveMQ đã có những cải tiến gì, giải quyết những điểm nghẽn (pain point) nào của ActiveMQ, hai bên có những điểm giống nhau nào, và lại có những điểm khác nhau nào.

**Cách học một công nghệ hiệu quả và nhanh nhất chính là đem công nghệ này kết nối với những công nghệ mà mình đã học trước đó, tạo thành một mạng lưới.**

Sau đó, tôi khuyên bạn trước tiên nên xem hướng dẫn trong tài liệu chính thức (official documentation), chạy thử các Demo liên quan, và làm một số dự án nhỏ.

Tuy nhiên, tài liệu chính thức thường bằng tiếng Anh, thông thường chỉ có các dự án nội địa và một số ít dự án nước ngoài là cung cấp tài liệu tiếng Trung. Hơn nữa, những gì tài liệu chính thức giới thiệu thường khá sơ sài, không thích hợp để làm tài liệu học tập cho người mới.

Nếu bạn không đọc hiểu tài liệu trên trang web chính thức, bạn cũng có thể tìm kiếm các từ khóa liên quan để xem những blog hoặc video chất lượng cao. **Nhất định đừng mới bắt đầu đã nghĩ đến việc phải hiểu cho bằng được nguyên lý của công nghệ này.**

Ví dụ như khi chúng ta học framework Spring, tôi khuyên bạn sau khi đã hiểu được vấn đề mà Spring framework giải quyết, đừng vội bắt tay nghiên cứu nguyên lý hay mã nguồn (source code) của Spring, mà trước tiên hãy thực sự trải nghiệm các chức năng cốt lõi mà Spring framework cung cấp như IoC (Inverse of Control: Đảo ngược điều khiển) và AOP (Aspect-Oriented Programming: Lập trình hướng khía cạnh), dùng Spring framework để viết một vài Demo, thậm chí là dùng Spring framework để làm một số dự án nhỏ.

Nói gọn lại một câu: **trước khi nghiên cứu nguyên lý của một công nghệ, trước tiên phải hiểu được cách sử dụng công nghệ đó.**

Quá trình học tập tiến dần từng bước như vậy có thể dần giúp bạn xây dựng niềm vui khi học, đạt được cảm giác thành tựu tức thời, tránh việc đi thẳng nghiên cứu kiến thức về nguyên lý mà bị "dội ngược" (nản chí).

**Khi nghiên cứu nguyên lý của một công nghệ nào đó, để tránh nội dung quá trừu tượng, chúng ta cũng có thể tự tay thực hành.**

Ví dụ như khi học nguyên lý của Tomcat, chúng ta phát hiện bộ xử lý đa luồng tùy chỉnh (custom thread pool) của Tomcat khá thú vị, vậy chúng ta có thể tự viết một bộ xử lý đa luồng phiên bản tùy chỉnh. Lại ví dụ như khi chúng ta học nguyên lý của Dubbo, chúng ta có thể tự tay tạo ra một framework RPC phiên bản đơn giản.

Ngoài ra, công nghệ cần dùng trong dự án và công nghệ cần dùng trong phỏng vấn thực ra có một chút khác biệt.

Nếu bạn học một công nghệ nào đó để dùng trong dự án thực tế, thì trọng tâm của bạn là học cách sử dụng công nghệ đó cùng với các phương pháp thực hành tốt nhất (best practice), tìm hiểu những vấn đề mà công nghệ đó có thể gặp phải trong quá trình sử dụng. Mục tiêu cuối cùng của bạn là công nghệ này mang lại hiệu quả thực tế cho dự án, và hiệu quả đó là tích cực.

Nếu bạn học một công nghệ nào đó chỉ đơn thuần để phỏng vấn, thì trọng tâm của bạn nên đặt vào những câu hỏi phổ biến nhất về công nghệ đó trong phỏng vấn, tức là thứ mà chúng ta vẫn thường gọi là "bát cổ văn" (八股文 - kiến thức lý thuyết kinh điển).

Rất nhiều người vừa nhắc đến "bát cổ văn" là tỏ vẻ khinh thường. Theo tôi, nếu bạn không phải học vẹt "bát cổ văn", mà đi suy nghĩ về bản chất của những câu hỏi phỏng vấn này, thì trong quá trình chuẩn bị "bát cổ văn", bạn cũng có thể làm sâu sắc thêm hiểu biết của mình về công nghệ đó.

Cuối cùng, điều quan trọng nhất đồng thời cũng là khó nhất chính là **tri hành hợp nhất (知行合一 - biết và làm phải đi đôi với nhau)! Tri hành hợp nhất! Tri hành hợp nhất!** Dù là lập trình hay bất kỳ lĩnh vực nào khác, điều quan trọng nhất không phải là bạn biết bao nhiêu, mà là phải cố gắng đạt được tri hành hợp nhất.
