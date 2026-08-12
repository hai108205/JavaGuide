---
title: Tổng quan các tính năng mới Java 10
description: Tổng quan về các cập nhật chính của JDK 10, tập trung vào type inference của var và các cải tiến nền tảng khác.
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 10,JDK10,var 局部变量类型推断,垃圾回收改进,性能
---

**Java 10** được phát hành vào ngày 20 tháng 3 năm 2018, đây là một phiên bản không phải LTS (Long-Term Support), Oracle chỉ hỗ trợ trong sáu tháng.

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 25:

![ Số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 25](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

Bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- [JEP 286: Local-Variable Type Inference (type inference biến cục bộ)](https://openjdk.org/jeps/286)
- [JEP 304: Garbage-Collector Interface (interface bộ thu gom rác)](https://openjdk.org/jeps/304)
- [JEP 307: Parallel Full GC for G1 (G1 song song Full GC)](https://openjdk.org/jeps/307)
- [JEP 310: Application Class-Data Sharing (chia sẻ dữ liệu lớp ứng dụng)](https://openjdk.org/jeps/310)
- [JEP 317: Experimental Java-Based JIT Compiler (trình biên dịch JIT dựa trên Java thử nghiệm)](https://openjdk.org/jeps/317)

## JEP 286: Local-Variable Type Inference

Vì có rất nhiều nhà phát triển Java mong muốn Java giới thiệu local-variable type inference (type inference biến cục bộ), nên khi Java 10 ra đời nó đã xuất hiện, xem như là sự thỏa lòng mong đợi của mọi người!

Java 10 cung cấp từ khóa `var` để khai báo biến cục bộ.

```java
var id = 0;
var codefx = new URL("https://mp.weixin.qq.com/");
var list = new ArrayList<>();
var list = List.of(1, 2, 3);
var map = new HashMap<String, String>();
var p = Paths.of("src/test/java/Java9FeaturesTest.java");
var numbers = List.of("a", "b", "c");
for (var n : numbers)
    System.out.print(n+ " ");
```

`var` chỉ có thể dùng cho khai báo biến cục bộ có initializer (bộ khởi tạo), cũng có thể dùng cho biến cục bộ trong vòng lặp `for` cơ bản hoặc tăng cường (enhanced), cũng như biến tài nguyên trong `try`-with-resources. Nó không thể dùng cho field, tham số phương thức hoặc kiểu trả về.

```java
var count = null; //❌biên dịch không qua, không thể khai báo là null
var r = () -> Math.random();//❌biên dịch không qua, không thể khai báo là Lambda expression
var array = {1, 2, 3};//❌biên dịch không qua, không thể khai báo mảng
```

`var` không làm thay đổi sự thật rằng Java là một ngôn ngữ static typing (kiểu tĩnh), trình biên dịch chịu trách nhiệm suy ra kiểu.

Ngoài ra, trong Scala và Kotlin đã có từ khóa `val` (từ khóa kết hợp `final var`).

## JEP 304: Garbage-Collector Interface

Trong cấu trúc JDK trước đây, các thành phần tạo nên bộ thu gom rác (GC) bị phân tán rải rác ở nhiều nơi trong codebase. Java 10 tách biệt source code của các bộ thu gom rác khác nhau bằng cách giới thiệu một bộ interface bộ thu gom rác thuần khiết.

## JEP 307: Parallel Full GC for G1

Từ Java 9, G1 đã trở thành bộ thu gom rác mặc định. G1 được thiết kế như một bộ thu gom rác latency thấp, nhằm tránh thực hiện Full GC, nhưng Full GC của G1 trong Java 9 vẫn dùng single-thread để thực hiện mark-sweep algorithm (thuật toán đánh dấu - dọn dẹp), điều này có thể khiến bộ thu gom rác kích hoạt Full GC khi không thể thu hồi bộ nhớ.

Để giảm bớt tình trạng dừng ứng dụng (application pause) do Full GC gây ra, từ Java 10, Full GC của G1 được đổi thành sử dụng nhiều parallel working thread để thực hiện mark, sweep và compaction. Thay đổi này rút ngắn thời gian dừng của Full GC, nhưng không trực tiếp giảm số lần kích hoạt Full GC.

## JEP 310: **Chia sẻ dữ liệu lớp ứng dụng (mở rộng tính năng CDS)**

Java 5 đã giới thiệu cơ chế chia sẻ dữ liệu lớp (Class Data Sharing, gọi tắt là CDS), cho phép xử lý trước một tập hợp các system class thành tệp lưu trữ chia sẻ, để thực hiện memory mapping khi chạy, từ đó giảm thời gian khởi động của chương trình Java và mức chiếm dụng bộ nhớ của nhiều JVM. AppCDS cho phép thêm application class vào shared archive trước đây chỉ được cung cấp như tính năng thương mại trong Oracle JDK.

Java 10 mở rộng thêm trên cơ sở tính năng CDS hiện có và mở khóa AppCDS, cho phép đưa application class vào shared archive. Quy trình điển hình là trước tiên tạo danh sách lớp ứng dụng, sau đó dựa theo danh sách lớp để tạo shared archive, khi khởi động sau này sẽ tải archive đó thông qua memory mapping; bản thân văn bản danh sách lớp không phải là cache mà JVM trực tiếp tải khi khởi động sau đó.

## JEP 317: **Trình biên dịch JIT dựa trên Java thử nghiệm**

Graal là một trình biên dịch JIT được viết bằng ngôn ngữ Java, là nền tảng của trình biên dịch Ahead-of-Time (AOT) thử nghiệm được giới thiệu trong JDK 9.

HotSpot VM của Oracle đi kèm với hai trình biên dịch JIT được viết bằng C++: C1 và C2. Trong Java 10 (Linux/x64, macOS/x64), theo mặc định HotSpot vẫn sử dụng C2, nhưng bằng cách thêm các tham số `-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler` vào lệnh java, bạn có thể thay C2 bằng Graal.

## Cải tiến API

Không phải tất cả các thay đổi API đều được phát hành thông qua JEP (Java Enhancement Proposal).

Trong quy trình phát triển của JDK: **JEP** thường dùng cho những thay đổi lớn, ví dụ giới thiệu tính năng ngôn ngữ mới (như `var`), cơ chế JVM mới (như ZGC) hoặc tái cấu trúc thư viện ở quy mô lớn. Các thao tác thêm vài static method vào các class hiện có như `List.copyOf()` thường được xem là bảo trì thư viện thông thường. Chúng được các nhà phát triển JDK trực tiếp gửi và đánh giá thông qua ticket (phiếu) của **JBS (JDK Bug System)**, sau đó được phát hành trực tiếp cùng phiên bản.

### Cải tiến collection

`List`, `Set`, `Map` cung cấp static method `copyOf()` trả về một bản sao bất biến (immutable) của collection được truyền vào.

```java
static <E> List<E> copyOf(Collection<? extends E> coll) {
    return ImmutableCollections.listCopy(coll);
}
```

Collection được tạo bằng `copyOf()` là immutable collection, không thể thực hiện các thao tác thêm, xóa, thay thế, sắp xếp..., nếu không sẽ báo lỗi `java.lang.UnsupportedOperationException`. IDEA cũng sẽ có gợi ý tương ứng.

![Collection được tạo bằng `copyOf()` là immutable collection](https://oss.javaguide.cn/java-guide-blog/image-20210816154125579.png)

Và trong `java.util.stream.Collectors` đã bổ sung static method để thu thập các phần tử của stream thành immutable collection.

```java
var list = new ArrayList<>();
list.stream().collect(Collectors.toUnmodifiableList());
list.stream().collect(Collectors.toUnmodifiableSet());
```

### Cải tiến Optional

`Optional` bổ sung thêm phương thức `orElseThrow()` không tham số, là phiên bản rút gọn của `orElseThrow(Supplier<? extends X> exceptionSupplier)` có tham số, khi không có giá trị sẽ mặc định ném ra ngoại lệ NoSuchElementException.

```java
Optional<String> optional = Optional.empty();
String result = optional.orElseThrow();
```

## Khác

- **Kiểm soát thread cục bộ**: Trong Java 10, kiểm soát thread giới thiệu khái niệm JVM safe-point, cho phép thực hiện thread callback mà không cần chạy global JVM safe-point, được thực hiện bởi chính thread hoặc JVM thread, đồng thời giữ thread ở trạng thái blocked, cách này giúp có thể dừng một thread đơn lẻ thay vì chỉ có thể bật hoặc dừng tất cả các thread.
- **Cấp phát heap trên thiết bị lưu trữ dự phòng**: Trong Java 10, cho phép JVM sử dụng heap phù hợp với các loại cơ chế lưu trữ khác nhau, thực hiện cấp phát bộ nhớ heap trên các thiết bị bộ nhớ tùy chọn.
- ……

## Tham khảo

- Java 10 Features and Enhancements : <https://howtodoinjava.com/java10/java10-features/>

- Guide to Java10 : <https://www.baeldung.com/java-10-overview>

- 4 Class Data Sharing : <https://docs.oracle.com/javase/10/vm/class-data-sharing.htm#JSJVM-GUID-7EAA3411-8CF0-4D19-BD05-DF5E1780AA91>

<!-- @include: @article-footer.snippet.md -->