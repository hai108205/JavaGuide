---
title: Chuyên đề Java Core - Cú pháp, Lập trình hướng đối tượng, Generic, Reflection, Proxy và Serialization
description: Lộ trình học và ôn tập Java Core, bao gồm cú pháp cơ bản, lập trình hướng đối tượng, từ khóa, truyền tham số, Generic, Reflection, Proxy, Serialization, SPI, Unsafe và các cú pháp mở rộng (Syntax Sugar).
category: Java
tag:
  - Java
  - Java Core
  - Phỏng vấn Java
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: Java Core,Câu hỏi phỏng vấn Java Core,Từ khóa Java,Truyền tham trị Java,Java Generic,Java Reflection,Java Proxy,Java Serialization,Java SPI,Java Unsafe,Java Syntax Sugar
---

Java Core là nền tảng để tiếp tục học về **Collection Framework, lập trình đồng thời (Concurrent), JVM, Spring** và các middleware khác. Phần này không chỉ dừng lại ở việc ghi nhớ cú pháp, mà quan trọng hơn là hiểu được **mô hình đối tượng của Java, cơ chế truyền tham số, Generic Type Erasure, Reflection, Dynamic Proxy, Serialization** và các cơ chế mở rộng được nhiều framework sử dụng.

## Phù hợp với ai?

- Người mới bắt đầu học Java một cách bài bản và muốn kết nối các kiến thức nền tảng thành một hệ thống hoàn chỉnh.
- Người chuẩn bị phỏng vấn Java Core và muốn nhanh chóng rà soát lại kiến thức.
- Lập trình viên đã từng phát triển dự án Java nhưng chưa hiểu sâu về Reflection, Proxy, Generic, SPI hay Serialization.
- Kỹ sư phần mềm muốn bổ sung kiến thức nền trước khi tìm hiểu Collection, Concurrent, JVM hoặc mã nguồn Spring.

## Nội dung trọng tâm

- Cú pháp Java, lập trình hướng đối tượng, xử lý ngoại lệ, các lớp thường dùng, từ khóa và các chi tiết quan trọng trong ngôn ngữ.
- Mối quan hệ giữa truyền tham trị, biến tham chiếu, tính thay đổi của đối tượng và cơ chế gọi phương thức.
- Generic, Wildcard, Type Erasure và ảnh hưởng của chúng đối với Collection, thiết kế API và Reflection.
- Reflection, Dynamic Proxy, SPI và các cơ chế nền tảng thường gặp trong framework.
- Serialization, `BigDecimal`, `Unsafe` và các "bẫy" thường gặp trong dự án thực tế cũng như trong phỏng vấn.

## Thứ tự học được khuyến nghị

1. [Tổng hợp câu hỏi phỏng vấn Java Core (Phần 1)](./java-basic-questions-01.md): Ôn lại cú pháp Java, lập trình hướng đối tượng và các lớp thường dùng.
2. [Tổng hợp câu hỏi phỏng vấn Java Core (Phần 2)](./java-basic-questions-02.md) và [Phần 3](./java-basic-questions-03.md): Bổ sung kiến thức về Exception, Generic, Reflection, Annotation và các lỗi thường gặp.
3. [Tổng hợp từ khóa Java](./java-keyword-summary.md) và [Giải thích cơ chế truyền tham trị trong Java](./why-there-only-value-passing-in-java.md): Làm rõ các khái niệm nền tảng dễ gây nhầm lẫn.
4. [Generic & Wildcard](./generics-and-wildcards.md), [Reflection](./reflection.md), [Proxy](./proxy.md): Hiểu các cơ chế được sử dụng phổ biến trong các framework.
5. [Serialization](./serialization.md), [SPI](./spi.md), [Unsafe](./unsafe.md): Tiếp tục bổ sung kiến thức phục vụ phát triển thực tế và đọc mã nguồn.

## Các bài viết cốt lõi

### Câu hỏi phỏng vấn Java Core

- [Tổng hợp câu hỏi phỏng vấn Java Core (Phần 1)](./java-basic-questions-01.md): Bao gồm đặc điểm của Java, cú pháp cơ bản, lập trình hướng đối tượng, các lớp thường dùng và những lỗi dễ gặp.
- [Tổng hợp câu hỏi phỏng vấn Java Core (Phần 2)](./java-basic-questions-02.md): Tiếp tục với Exception, Generic, Reflection, Annotation và các kiến thức nền tảng.
- [Tổng hợp câu hỏi phỏng vấn Java Core (Phần 3)](./java-basic-questions-03.md): Bổ sung các chủ đề nâng cao và các câu hỏi chi tiết hơn.

### Cơ chế của ngôn ngữ Java

- [Tổng hợp từ khóa Java](./java-keyword-summary.md): Giải thích vai trò của `final`, `static`, `this`, `super` và các từ khóa quan trọng khác.
- [Giải thích cơ chế truyền tham trị trong Java](./why-there-only-value-passing-in-java.md): Làm rõ vì sao Java chỉ hỗ trợ truyền tham trị và ý nghĩa thực sự của việc truyền biến tham chiếu.
- [Generic & Wildcard](./generics-and-wildcards.md): Hiểu cú pháp Generic, Wildcard trên/dưới, Type Erasure và các tình huống sử dụng phổ biến.
- [Syntax Sugar trong Java](./syntactic-sugar.md): Tìm hiểu cách trình biên dịch xử lý Enhanced For, Auto Boxing/Unboxing, Enum, Lambda và các cú pháp mở rộng khác.

### Các cơ chế nền tảng của framework

- [Reflection trong Java](./reflection.md): Hiểu đối tượng `Class`, cơ chế Reflection, chi phí hiệu năng và các tình huống sử dụng.
- [Proxy trong Java](./proxy.md): Nắm vững Static Proxy, JDK Dynamic Proxy và CGLIB Proxy.
- [Cơ chế SPI trong Java](./spi.md): Hiểu cơ chế khám phá dịch vụ (Service Discovery) và mở rộng theo dạng plugin.
- [Serialization trong Java](./serialization.md): Tìm hiểu quy trình tuần tự hóa, `serialVersionUID`, các rủi ro bảo mật và các giải pháp thay thế.

### Những kiến thức thực tế

- [BigDecimal](./bigdecimal.md): Nắm vững cách xử lý phép tính tiền tệ, độ chính xác, chế độ làm tròn và cách khởi tạo đúng.
- [Nên dùng `long` hay `BigDecimal` để lưu số tiền?](./money-long-vs-bigdecimal.md): Phân biệt lưu trữ và tính toán tiền tệ, đơn vị nhỏ nhất, làm tròn, tràn số và thiết kế cột trong cơ sở dữ liệu.
- [Lớp đặc biệt `Unsafe` trong Java](./unsafe.md): Tìm hiểu Off-Heap Memory, CAS, Object Field Offset và các khả năng cấp thấp thường xuất hiện trong mã nguồn JDK.

## Những câu hỏi xuất hiện nhiều

- Java là ngôn ngữ truyền tham trị hay truyền tham chiếu? Vì sao đối tượng truyền vào phương thức vẫn có thể bị thay đổi?
- `==` và `equals()` khác nhau như thế nào? Vì sao khi ghi đè `equals()` cũng phải ghi đè `hashCode()`?
- Khi nào nên dùng `String`, `StringBuilder` và `StringBuffer`?
- `final`, `static`, `this` và `super` có vai trò gì?
- Type Erasure là gì? `List<String>` và `List<Integer>` có gì khác nhau khi chạy chương trình?
- Vì sao Reflection chậm hơn lời gọi thông thường? Những trường hợp nào nên sử dụng Reflection?
- Khác biệt giữa JDK Dynamic Proxy và CGLIB Proxy là gì?
- Vì sao không nên sử dụng trực tiếp cơ chế Serialization mặc định của Java?
- Vì sao nên khởi tạo `BigDecimal` từ chuỗi (`String`) thay vì từ `double`?
- Khi xử lý tiền tệ, nên lưu bằng `long` (đơn vị nhỏ nhất) hay `BigDecimal`?

## Chuyên đề liên quan

- [Hệ thống kiến thức Java](../)
- [Chuyên đề Java Collection](../collection/)
- [Chuyên đề Java Concurrent](../concurrent/)
- [Chuyên đề JVM](../jvm/)
- [Spring](../../system-design/framework/spring/)

<!-- @include: @article-footer.snippet.md -->
