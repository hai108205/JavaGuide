---
title: Tổng quan các tính năng mới Java 11 (Quan trọng)
description: Tổng hợp các cập nhật của JDK 11, tập trung vào HTTP client mới và các tính năng thực dụng như cải tiến string.
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 11,JDK11,LTS,HTTP 客户端,字符串 API,移除特性
---

Java 11 được phát hành chính thức vào ngày 25 tháng 9 năm 2018, đây là một phiên bản rất quan trọng! Java 11 là phiên bản Long-Term-Support đầu tiên sau Java 8. Theo lộ trình hỗ trợ hiện tại của Oracle, Extended Support của Java 11 sẽ kéo dài đến tháng 1 năm 2032.

Hình dưới đây là mốc thời gian hỗ trợ Oracle JDK do Oracle chính thức cung cấp.

![Mốc thời gian hỗ trợ Oracle JDK do Oracle chính thức cung cấp](https://oss.javaguide.cn/github/javaguide/java/new-features/4c1611fad59449edbbd6e233690e9fa7.png)

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 25:

![ Số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 25](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

Bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- [JEP 321: HTTP Client (Standard)](https://openjdk.org/jeps/321)
- [JEP 323: Local-Variable Syntax for Lambda Parameters](https://openjdk.org/jeps/323)
- [JEP 330: Launch Single-File Source-Code Programs](https://openjdk.org/jeps/330)
- [JEP 333: ZGC: A Scalable Low-Latency Garbage Collector (Experimental)](https://openjdk.org/jeps/333)

## JEP 321: HTTP Client (HTTP client, phiên bản chuẩn)

Java 11 chuẩn hóa HTTP Client API đã được giới thiệu trong Java 9 và cập nhật trong Java 10. Trong khi ấp ủ (incubator) ở hai phiên bản trước, HTTP Client gần như đã được viết lại hoàn toàn, và hiện tại hỗ trợ đầy đủ asynchronous non-blocking.

Và trong Java 11, tên package của HTTP Client được đổi từ `jdk.incubator.http` thành `java.net.http`, API này cung cấp ngữ nghĩa non-blocking request và response thông qua `CompletableFuture`. Cách sử dụng cũng rất đơn giản, như sau:

```java
var request = HttpRequest.newBuilder()
    .uri(URI.create("https://javastack.cn"))
    .GET()
    .build();
var client = HttpClient.newHttpClient();

// Đồng bộ
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());

// Bất đồng bộ
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println);
```

## JEP 333: ZGC (bộ thu gom rác low-latency mở rộng được, thử nghiệm)

**ZGC tức là Z Garbage Collector**, là một bộ thu gom rác mở rộng được (scalable), low-latency.

ZGC được thiết kế chủ yếu để đáp ứng các mục tiêu sau:

- Thời gian dừng của GC không quá 10ms
- Có thể xử lý cả heap nhỏ vài trăm MB, cũng có thể xử lý heap lớn vài TB
- Khả năng thông lượng của ứng dụng không giảm quá 15% (so với algorithm thu hồi của G1)
- Tiện lợi khi trên cơ sở này giới thiệu các tính năng GC mới và đặt nền móng cho việc tối ưu hóa sử dụng colored pointers và Load barriers
- Hiện tại chỉ hỗ trợ nền tảng Linux/x64

ZGC hiện đang **ở giai đoạn thử nghiệm**, chỉ hỗ trợ nền tảng Linux/x64. Lưu ý: ZGC trở thành tính năng chính thức trong Java 15, và Java 21 giới thiệu Generational ZGC.

Tương tự như ParNew trong CMS và G1, ZGC cũng sử dụng algorithm mark-copy (đánh dấu - sao chép), nhưng ZGC đã có cải tiến lớn đối với algorithm này.

Trong ZGC, tình huống xảy ra Stop The World sẽ ít hơn!

Chi tiết có thể xem: [《Khám phá và thực hành bộ thu gom rác thế hệ mới ZGC》](https://tech.meituan.com/2020/08/06/new-zgc-practice-in-meituan.html)

## JEP 323: Local-Variable Syntax for Lambda Parameters (cú pháp biến cục bộ cho tham số Lambda)

Từ Java 10, đã giới thiệu tính năng quan trọng là local-variable type inference (type inference biến cục bộ). Type inference cho phép dùng từ khóa var làm kiểu của biến cục bộ thay vì kiểu thực tế, trình biên dịch suy ra kiểu dựa trên giá trị gán cho biến.

Trong Java 10, từ khóa var có một vài giới hạn:

- Chỉ có thể dùng cho biến cục bộ
- Khi khai báo phải khởi tạo
- Không thể dùng làm tham số phương thức
- Không thể dùng trong Lambda expression

Bắt đầu từ Java 11, cho phép developer dùng var để khai báo tham số trong Lambda expression.

```java
// Hai cách dưới đây tương đương nhau
Consumer<String> consumer = (var i) -> System.out.println(i);
Consumer<String> consumer = (String i) -> System.out.println(i);
```

## JEP 330: Launch Single-File Source-Code Programs (khởi chạy chương trình source code một tệp)

Điều này có nghĩa là chúng ta có thể chạy source code Java của một tệp duy nhất. Tính năng này cho phép dùng Java interpreter để trực tiếp thực thi source code Java. Source code được biên dịch trong bộ nhớ, sau đó được thực thi bởi interpreter, không cần tạo ra tệp `.class` trên đĩa. Ràng buộc duy nhất là tất cả các class liên quan phải được định nghĩa trong cùng một tệp Java.

Đặc biệt hữu ích cho người mới học Java muốn thử nghiệm các chương trình đơn giản, và có thể dùng cùng với jshell, ở một mức độ nào đó tăng cường khả năng dùng Java để viết các chương trình dạng script.

## Cải tiến API

Không phải tất cả các thay đổi API đều được phát hành thông qua JEP (Java Enhancement Proposal).

Trong quy trình phát triển của JDK: **JEP** thường dùng cho những thay đổi lớn, ví dụ giới thiệu tính năng ngôn ngữ mới (như `var`), cơ chế JVM mới (như ZGC) hoặc tái cấu trúc thư viện ở quy mô lớn. Các thao tác thêm vài method vào các class hiện có như `String.isBlank()` thường được xem là bảo trì thư viện thông thường. Chúng được các nhà phát triển JDK trực tiếp gửi và đánh giá thông qua ticket (phiếu) của **JBS (JDK Bug System)**, sau đó được phát hành trực tiếp cùng phiên bản.

### Cải tiến String

Java 11 bổ sung một loạt phương thức xử lý string:

```java
// Kiểm tra chuỗi có phải chuỗi rỗng không
" ".isBlank();//true
// Loại bỏ khoảng trắng đầu và cuối chuỗi
" Java ".strip();// "Java"
// Loại bỏ khoảng trắng đầu chuỗi
" Java ".stripLeading();   // "Java "
// Loại bỏ khoảng trắng cuối chuỗi
" Java ".stripTrailing();  // "Java"
// Lặp lại chuỗi bao nhiêu lần
"Java".repeat(3);             // "JavaJavaJava"
// Trả về tập hợp các chuỗi được phân tách bởi line terminator.
"A\nB\nC".lines().count();    // 3
"A\nB\nC".lines().collect(Collectors.toList());
```

### Cải tiến Optional

Bổ sung thêm phương thức `isEmpty()` để kiểm tra đối tượng `Optional` được chỉ định có rỗng hay không.

```java
var op = Optional.empty();
System.out.println(op.isEmpty());//Kiểm tra đối tượng Optional được chỉ định có rỗng hay không
```

## Các tính năng mới khác

- **Bộ thu gom rác mới Epsilon**: một implementation GC hoàn toàn tiêu cực, phân bổ tài nguyên bộ nhớ hạn chế, giảm thiểu tối đa mức chiếm dụng bộ nhớ và thời gian trễ thông lượng bộ nhớ.
- **Heap Profiling chi phí thấp**: Java 11 cung cấp một phương pháp sampling cấp phát heap Java chi phí thấp, có thể lấy được thông tin đối tượng được cấp phát trong heap Java, và có thể truy cập thông tin heap thông qua JVMTI.
- **Giao thức TLS 1.3**: Java 11 bao gồm implementation spec Transport Layer Security (TLS) 1.3 (RFC 8446), thay thế TLS trong các phiên bản trước, bao gồm cả TLS 1.2, đồng thời cải tiến các tính năng TLS khác, ví dụ OCSP stapling extension (RFC 6066, RFC 6961), cũng như session hash và extended master secret extension (RFC 7627), cũng có nhiều cải tiến về mặt bảo mật và hiệu suất.
- **Java Flight Recorder**: Flight recorder trước đây là một công cụ phân tích của JDK bản thương mại, nhưng trong Java 11, code của nó được đưa vào codebase công khai, nhờ vậy mọi người đều có thể sử dụng tính năng này.
- ......

## Tham khảo

- JDK 11 Release Notes：<https://www.oracle.com/java/technologies/javase/11-relnote-issues.html>
- Java 11 – Features and Comparison：<https://www.geeksforgeeks.org/java-11-features-and-comparison/>

<!-- @include: @article-footer.snippet.md -->