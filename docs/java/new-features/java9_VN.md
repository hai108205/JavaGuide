---
title: Tổng quan các tính năng mới Java 9
description: Phân tích hệ thống module hóa của Java 9 và các cập nhật như jlink, hiểu tác động đối với runtime image và cách sử dụng thư viện.
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 9,JDK9,模块化,JPMS,jlink,集合工厂方法,新 API
---

**Java 9** được phát hành vào ngày 21 tháng 9 năm 2017. Là phiên bản mới ra đời sau Java 8 tới 3 năm rưỡi, Java 9 mang đến rất nhiều thay đổi lớn, trong đó thay đổi quan trọng nhất là sự ra đời của Java Platform Module System, ngoài ra còn có các tính năng như collection, `Stream`...

JDK 9 không phải là LTS (Long-Term Support). Các phiên bản LTS hiện tại mà Oracle liệt kê bao gồm JDK 8, JDK 11, JDK 17, JDK 21 và JDK 25.

Bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- [JEP 222: Java Shell Tool (JShell)](https://openjdk.org/jeps/222)
- [JEP 261: Module System (hệ thống module hóa)](https://openjdk.org/jeps/261)
- [JEP 248: G1 Becomes the Default Garbage Collector (G1 trở thành bộ thu gom rác mặc định)](https://openjdk.org/jeps/248)
- [JEP 254: Compact Strings (chuỗi compact)](https://openjdk.org/jeps/254)
- [JEP 193: Variable Handles (variable handle)](https://openjdk.org/jeps/193)

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 25:

![](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

## JEP 222: Java Shell Tool (JShell)

JShell là một công cụ tiện ích mới được bổ sung trong Java 9. Cung cấp cho Java công cụ tương tác dòng lệnh thời gian thực tương tự như Python.

Trong JShell, bạn có thể trực tiếp nhập biểu thức và xem kết quả thực thi của nó.

![](https://oss.javaguide.cn/java-guide-blog/image-20210816083417616.png)

**JShell mang lại cho chúng ta những lợi ích gì?**

1. Giảm rào cản để viết ra dòng "Hello World!" Java đầu tiên, có thể nâng cao hứng thú học tập của người mới.
2. Khi xử lý các logic nhỏ đơn giản, xác minh các vấn đề nhỏ đơn giản, hiệu quả hơn so với IDE (không phải để thay thế IDE, đối với việc xác minh logic phức tạp, IDE phù hợp hơn, hai bên bổ trợ cho nhau).
3. ……

**Code của JShell và code biên dịch được thông thường, khác nhau ở điểm gì?**

1. Một khi câu lệnh được nhập xong, JShell sẽ biên dịch và thực thi code ở nền, sau đó trả về kết quả ngay lập tức, không cần người dùng thủ công chạy `javac` và `java`.
2. JShell hỗ trợ khai báo lại biến, biến khai báo sau sẽ ghi đè biến khai báo trước.
3. JShell hỗ trợ các biểu thức độc lập như phép cộng thông thường `1 + 1`.
4. ……

## JEP 261: Module System (hệ thống module hóa)

Hệ thống module hóa là một phần của [Jigsaw Project](https://openjdk.java.net/projects/jigsaw/), đưa thực hành phát triển module hóa vào nền tảng Java, giúp code của chúng ta có tính tái sử dụng tốt hơn!

**Hệ thống module hóa là gì?** Định nghĩa chính thức là:

> A uniquely named, reusable group of related packages, as well as resources (such as images and XML files) and a module descriptor.

Nói một cách đơn giản, bạn có thể coi một module là một nhóm các package, tài nguyên và tệp mô tả module (`module-info.java`) được đặt tên duy nhất và có thể tái sử dụng.

Bất kỳ tệp jar nào, chỉ cần thêm một tệp mô tả module (`module-info.java`), là có thể nâng cấp trở thành một module.

![](https://oss.javaguide.cn/java-guide-blog/module-structure.png)

Sau khi giới thiệu hệ thống module hóa, JDK được tổ chức lại thành 94 module. Ứng dụng Java có thể thông qua công cụ **[jlink](http://openjdk.java.net/jeps/282) mới** (Jlink là công cụ dòng lệnh mới được phát hành cùng Java 9. Nó cho phép developer tạo ra JRE nhẹ, tùy chỉnh riêng cho ứng dụng Java dựa trên module), tạo ra runtime image tùy chỉnh chỉ chứa các module JDK mà ứng dụng phụ thuộc. Điều này có thể giảm thiểu rất nhiều kích thước của môi trường chạy Java.

Chúng ta có thể dùng từ khóa `exports` để kiểm soát những package nào được phép mở cho bên ngoài sử dụng, và những package đó có thể mở cho những module nào.

```java
module my.module {
    //exports công khai tất cả thành viên public của package được chỉ định
    exports com.my.package.name;
}

module my.module {
    // exports ... to xuất theo định hướng package được chỉ định cho module được chỉ định
    exports com.my.package.name to com.specific.module;
}
```

Muốn tìm hiểu sâu về module hóa trong Java 9, có thể tham khảo các bài viết dưới đây:

- [《Project Jigsaw: Module System Quick-Start Guide》](https://openjdk.java.net/projects/jigsaw/quick-start)
- [《Java 9 Modules: part 1》](https://stacktraceguru.com/java9/module-introduction)
- [Java 9 揭秘（2. 模块化系统）](http://www.cnblogs.com/IcanFixIt/p/6947763.html)

## JEP 248: G1 Becomes the Default Garbage Collector (G1 trở thành bộ thu gom rác mặc định)

Trong Java 8, bộ thu gom rác mặc định là Parallel Scavenge (new generation) + Parallel Old (old generation). Đến Java 9, CMS garbage collector bị loại bỏ, **G1 (Garbage-First Garbage Collector)** trở thành bộ thu gom rác mặc định.

G1 được giới thiệu từ Java 7, sau hai phiên bản hoạt động xuất sắc đã trở thành bộ thu gom rác mặc định.

## JEP 193: Variable Handles (variable handle)

Variable handle là một tham chiếu tới một biến hoặc một nhóm biến, bao gồm static field, non-static field, phần tử mảng và thành phần trong cấu trúc dữ liệu ngoài heap, v.v.

Ý nghĩa của variable handle tương tự như method handle `MethodHandle` hiện có, được biểu diễn bởi class Java `java.lang.invoke.VarHandle`, có thể sử dụng các phương pháp như phương thức tìm kiếm của instance `java.lang.invoke.MethodHandles.Lookup` để tạo đối tượng `VarHandle`.

Sự xuất hiện của `VarHandle` thay thế một phần thao tác của `java.util.concurrent.atomic` và `sun.misc.Unsafe`. Và cung cấp một loạt thao tác memory barrier chuẩn, dùng để kiểm soát memory ordering một cách chi tiết hơn. Về độ an toàn, tính khả dụng, hiệu suất đều tốt hơn API hiện có.

## Cải tiến API

Không phải tất cả các thay đổi API đều được phát hành thông qua JEP (Java Enhancement Proposal).

Trong quy trình phát triển của JDK: **JEP** thường dùng cho những thay đổi lớn, ví dụ giới thiệu tính năng ngôn ngữ mới, cơ chế JVM mới hoặc tái cấu trúc thư viện ở quy mô lớn. Các thao tác thêm vài factory method vào các class hiện có như `List.of()` thường được xem là bảo trì thư viện thông thường. Chúng được các nhà phát triển JDK trực tiếp gửi và đánh giá thông qua ticket (phiếu) của **JBS (JDK Bug System)**, sau đó được phát hành trực tiếp cùng phiên bản.

### Cải tiến collection

Bổ sung các factory method như `List.of()`, `Set.of()`, `Map.of()` và `Map.ofEntries()` để tạo immutable collection (có phần tham khảo guava):

```java
List.of("Java", "C++");
Set.of("Java", "C++");
Map.of("Java", 1, "C++", 2);
```

Collection được tạo bằng `of()` là immutable collection, không thể thực hiện các thao tác thêm, xóa, thay thế, sắp xếp..., nếu không sẽ báo lỗi `java.lang.UnsupportedOperationException`.

### Cải tiến Stream

`Stream` bổ sung các method mới `ofNullable()`, `dropWhile()`, `takeWhile()` cũng như method overload của `iterate()`.

Trong Java 9, method `ofNullable()` có thể dựa theo một giá trị có thể là `null` để tạo `Stream` một phần tử hoặc rỗng. Java 8 đã có thể tạo stream rỗng thông qua `Stream.empty()`, nhưng không có method tiện lợi chuyển trực tiếp giá trị nullable thành stream này.

```java
Stream<String> stringStream = Stream.ofNullable("Java");
System.out.println(stringStream.count());// 1
Stream<String> nullStream = Stream.ofNullable(null);
System.out.println(nullStream.count());//0
```

Method `takeWhile()` có thể từ `Stream` lần lượt lấy các phần tử thỏa mãn điều kiện, kết thúc việc lấy khi không thỏa mãn điều kiện nữa.

```java
List<Integer> integerList = List.of(11, 33, 66, 8, 9, 13);
integerList.stream().takeWhile(x -> x < 50).forEach(System.out::println);// 11 33
```

Hiệu quả của method `dropWhile()` ngược lại với `takeWhile()`.

```java
List<Integer> integerList2 = List.of(11, 33, 66, 8, 9, 13);
integerList2.stream().dropWhile(x -> x < 50).forEach(System.out::println);// 66 8 9 13
```

Method overload mới của `iterate()` cung cấp một tham số `Predicate` (điều kiện phán đoán) để quyết định khi nào kết thúc vòng lặp.

```java
public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) {
}
// Method overload mới được bổ sung
public static<T> Stream<T> iterate(T seed, Predicate<? super T> hasNext, UnaryOperator<T> next) {

}
```

So sánh cách sử dụng của hai bên như sau, method overload mới của `iterate()` linh hoạt hơn một chút.

```java
// Dùng method iterate() gốc để xuất ra số 1~10
Stream.iterate(1, i -> i + 1).limit(10).forEach(System.out::println);
// Dùng method overload mới của iterate() để xuất ra số 1~10
Stream.iterate(1, i -> i <= 10, i -> i + 1).forEach(System.out::println);
```

### Cải tiến Optional

Class `Optional` bổ sung các method như `ifPresentOrElse()`, `or()` và `stream()`.

Method `ifPresentOrElse()` nhận hai tham số `Consumer` và `Runnable`, nếu `Optional` không rỗng thì gọi tham số `Consumer`, rỗng thì gọi tham số `Runnable`.

```java
public void ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)

Optional<Object> objectOptional = Optional.empty();
objectOptional.ifPresentOrElse(System.out::println, () -> System.out.println("Empty!!!"));// Empty!!!
```

Method `or()` nhận một tham số `Supplier`, nếu `Optional` rỗng thì trả về giá trị `Optional` do tham số `Supplier` chỉ định.

```java
public Optional<T> or(Supplier<? extends Optional<? extends T>> supplier)

Optional<Object> objectOptional = Optional.empty();
objectOptional.or(() -> Optional.of("java")).ifPresent(System.out::println);//java
```

### Cải tiến String

Trong Java 8 và các phiên bản trước, `String` luôn được lưu trữ bằng `char[]`. Sau Java 9, implementation của `String` đổi sang dùng mảng `byte[]` để lưu trữ chuỗi, tiết kiệm không gian.

```java
public final class String implements java.io.Serializable,Comparable<String>, CharSequence {
    // Chú thích @Stable biểu thị biến được sửa đổi nhiều nhất một lần, gọi là "ổn định" (stable).
    @Stable
    private final byte[] value;
}
```

### Cải tiến interface

Java 9 cho phép sử dụng private method trong interface. Nhờ vậy, cách sử dụng interface linh hoạt hơn, hơi giống một abstract class phiên bản đơn giản hóa.

```java
public interface MyInterface {
    private void methodPrivate(){
    }
}
```

### Cải tiến IO

Trước Java 9, chúng ta chỉ có thể khai báo biến trong khối `try-with-resources`:

```java
try (Scanner scanner = new Scanner(new File("testRead.txt"));
    PrintWriter writer = new PrintWriter(new File("testWrite.txt"))) {
    // omitted
}
```

Sau Java 9, trong câu lệnh `try-with-resources` có thể sử dụng biến effectively-final.

```java
final Scanner scanner = new Scanner(new File("testRead.txt"));
PrintWriter writer = new PrintWriter(new File("testWrite.txt"));
try (scanner; writer) {
    // omitted
}
```

**Biến effectively-final là gì?** Nói một cách đơn giản là biến không được sửa bởi `final` nhưng giá trị sau khi khởi tạo chưa từng thay đổi.

Như code phía trên đã minh họa, ngay cả khi biến `writer` không được khai báo tường minh là `final`, nhưng sau khi được gán giá trị lần đầu thì nó sẽ không thay đổi nữa, do đó, nó chính là biến effectively-final.

### Process API

Java 9 bổ sung interface `java.lang.ProcessHandle` để quản lý process gốc, đặc biệt phù hợp để quản lý các process chạy lâu dài.

```java
// Lấy process của JVM đang chạy hiện tại
ProcessHandle currentProcess = ProcessHandle.current();
// Xuất ra id của process
System.out.println(currentProcess.pid());
// Xuất ra thông tin của process
System.out.println(currentProcess.info());
```

Tổng quan interface `ProcessHandle`:

![](https://oss.javaguide.cn/java-guide-blog/image-20210816104614414.png)

### Các cải tiến API khác

**Reactive Streams**

Trong Java 9, class `java.util.concurrent.Flow` bổ sung các interface cốt lõi của spec reactive stream.

`Flow` bao gồm 4 interface cốt lõi như `Flow.Publisher`, `Flow.Subscriber`, `Flow.Subscription` và `Flow.Processor`. Java 9 còn cung cấp `SubmissionPublisher` như một implementation của `Flow.Publisher`.

Để tìm hiểu chi tiết hơn về reactive stream trong Java 9, bạn nên xem bài viết [Java 9 揭秘（17. Reactive Streams ）- 林本托](https://www.cnblogs.com/IcanFixIt/p/7245377.html).

## Khác

- **Cải tiến platform logging API**: Java 9 cho phép cấu hình cùng một implementation log cho JDK và ứng dụng. Bổ sung `System.LoggerFinder` để quản lý implementation logger mà JDK sử dụng. Khi chạy, JVM chỉ có một instance `LoggerFinder` ở phạm vi hệ thống. Chúng ta có thể thêm implementation `System.LoggerFinder` của riêng mình để JDK và ứng dụng sử dụng các framework logging khác như SLF4J.
- **Cải tiến class `CompletableFuture`**: Bổ sung vài method mới (`completeAsync`, `orTimeout`, v.v.).
- **Cải tiến engine Nashorn**: Nashorn là engine JavaScript được giới thiệu từ Java 8, Java 9 thực hiện một số cải tiến cho Nashorn, triển khai một số tính năng mới của ES6 (đã bị không dùng nữa trong Java 11).
- **Tính năng mới của I/O stream**: Bổ sung method mới để đọc và sao chép dữ liệu chứa trong `InputStream`.
- **Cải thiện hiệu năng bảo mật của ứng dụng**: Java 9 bổ sung 4 thuật toán băm SHA-3 là SHA3-224, SHA3-256, SHA3-384 và SHA3-512.
- **Cải tiến method handle**: Method handle được giới thiệu từ Java 7, Java 9 bổ sung thêm nhiều static method trong class `java.lang.invoke.MethodHandles` để tạo các loại method handle khác nhau.
- ……

## Tham khảo

- Java version history：<https://en.wikipedia.org/wiki/Java_version_history>
- Release Notes for JDK 9 and JDK 9 Update Releases : <https://www.oracle.com/java/technologies/javase/9-all-relnotes.html>
- 《深入剖析 Java 新特性》-极客时间 - JShell：怎么快速验证简单的小问题？
- New Features in Java 9: <https://www.baeldung.com/new-java-9>
- Java – Try with Resources：<https://www.baeldung.com/java-try-with-resources>

<!-- @include: @article-footer.snippet.md -->