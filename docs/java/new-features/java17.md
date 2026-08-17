---
title: Tổng quan các tính năng mới Java 17 (Quan trọng)
description: Tổng hợp các cập nhật quan trọng và JEP của JDK 17, bao gồm sealed class, record class và pattern matching và các tính năng khác.
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 17,JDK17,LTS,密封类,记录类,模式匹配,API 更新,JEP
---

Java 17 được phát hành chính thức vào ngày 14 tháng 9 năm 2021, là một phiên bản Long-Term Support (LTS).

Hình dưới đây là mốc thời gian hỗ trợ Oracle JDK do Oracle chính thức cung cấp. Có thể thấy, Java 17 có thể được hỗ trợ tối đa đến tháng 9 năm 2029.

![](https://oss.javaguide.cn/github/javaguide/java/new-features/4c1611fad59449edbbd6e233690e9fa7.png)

Java 17 sẽ là phiên bản Long-Term Support (LTS) quan trọng nhất kể từ Java 8, là thành quả của tám năm nỗ lực của cộng đồng Java. Spring 6.x và Spring Boot 3.x hỗ trợ tối thiểu chính là Java 17.

JDK 17 có tổng cộng 14 tính năng mới, bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- [JEP 356: Enhanced Pseudo-Random Number Generators (bộ sinh số ngẫu nhiên giả nâng cao)](https://openjdk.java.net/jeps/356)
- [JEP 398: Deprecate the Applet API for Removal (đánh dấu ngừng dùng Applet API để tiến tới gỡ bỏ)](https://openjdk.java.net/jeps/398)
- [JEP 406: Pattern Matching for switch (Preview) (pattern matching cho switch, xem trước)](https://openjdk.java.net/jeps/406)
- [JEP 407: Remove RMI Activation (gỡ bỏ cơ chế kích hoạt RMI)](https://openjdk.java.net/jeps/407)
- [JEP 409: Sealed Classes (sealed class, chuyển chính thức)](https://openjdk.java.net/jeps/409)
- [JEP 410: Remove the Experimental AOT and JIT Compiler (gỡ bỏ trình biên dịch AOT và JIT thử nghiệm)](https://openjdk.java.net/jeps/410)
- [JEP 411: Deprecate the Security Manager for Removal (đánh dấu ngừng dùng Security Manager để tiến tới gỡ bỏ)](https://openjdk.java.net/jeps/411)
- [JEP 412: Foreign Function & Memory API (Incubator) (API hàm và bộ nhớ ngoài, ấp ủ lần một)](https://openjdk.java.net/jeps/412)
- [JEP 414: Vector API (Second Incubator) (vector API, ấp ủ lần hai)](https://openjdk.java.net/jeps/414)

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 16:

![](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

Bài đọc liên quan: [Tài liệu OpenJDK Java 17](https://openjdk.java.net/projects/jdk/17/).

## JEP 356: Enhanced Pseudo-Random Number Generators (bộ sinh số ngẫu nhiên giả nâng cao)

Trước JDK 17, chúng ta có thể nhờ vào `Random`, `ThreadLocalRandom` và `SplittableRandom` để sinh số ngẫu nhiên. Tuy nhiên, 3 class này đều có khiếm khuyết riêng, và thiếu hỗ trợ các algorithm PRNG (pseudorandom number generator) phổ biến.

Java 17 bổ sung loại interface và implementation mới cho pseudorandom number generator (PRNG, còn gọi là deterministic random bit generator), giúp developer dễ dàng hoán đổi sử dụng các algorithm PRNG khác nhau trong ứng dụng.

> [PRNG](https://ctf-wiki.org/crypto/streamcipher/prng/intro/) dùng để sinh ra dãy số gần với dãy số ngẫu nhiên tuyệt đối. Nói chung, PRNG phụ thuộc vào một giá trị khởi tạo, còn gọi là seed, để sinh ra dãy số ngẫu nhiên giả tương ứng. Chỉ cần seed được xác định, số ngẫu nhiên do PRNG sinh ra là hoàn toàn xác định, do đó dãy số ngẫu nhiên nó sinh ra không thực sự ngẫu nhiên.

Ví dụ sử dụng:

```java
RandomGeneratorFactory<RandomGenerator> l128X256MixRandom = RandomGeneratorFactory.of("L128X256MixRandom");
// Dùng timestamp làm seed ngẫu nhiên
RandomGenerator randomGenerator = l128X256MixRandom.create(System.currentTimeMillis());
// Sinh số ngẫu nhiên
randomGenerator.nextInt(10);
```

## JEP 398: Deprecate the Applet API for Removal (đánh dấu ngừng dùng Applet API để tiến tới gỡ bỏ)

Applet API dùng để viết các applet Java chạy ở phía trình duyệt web, đã bị loại khỏi cuộc chơi từ nhiều năm trước, không còn lý do để sử dụng nữa.

Applet API đã bị đánh dấu ngừng dùng trong Java 9 ([JEP 289](https://openjdk.java.net/jeps/289)), nhưng không phải để gỡ bỏ.

## JEP 406: Pattern Matching for switch (pattern matching cho switch, xem trước)

Cũng giống như `instanceof`, `switch` cũng ngay lập tức bổ sung chức năng tự động chuyển đổi khớp kiểu.

Ví dụ code `instanceof`:

```java
// Old code
if (o instanceof String) {
    String s = (String)o;
    ... use s ...
}

// New code
if (o instanceof String s) {
    ... use s ...
}
```

Ví dụ code `switch`:

```java
// Old code
static String formatter(Object o) {
    String formatted = "unknown";
    if (o instanceof Integer i) {
        formatted = String.format("int %d", i);
    } else if (o instanceof Long l) {
        formatted = String.format("long %d", l);
    } else if (o instanceof Double d) {
        formatted = String.format("double %f", d);
    } else if (o instanceof String s) {
        formatted = String.format("String %s", s);
    }
    return formatted;
}

// New code
static String formatterPatternSwitch(Object o) {
    return switch (o) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case Double d  -> String.format("double %f", d);
        case String s  -> String.format("String %s", s);
        default        -> o.toString();
    };
}

```

Việc phán đoán giá trị `null` cũng được tối ưu hóa.

```java
// Old code
static void testFooBar(String s) {
    if (s == null) {
        System.out.println("oops!");
        return;
    }
    switch (s) {
        case "Foo", "Bar" -> System.out.println("Great");
        default           -> System.out.println("Ok");
    }
}

// New code
static void testFooBar(String s) {
    switch (s) {
        case null         -> System.out.println("Oops");
        case "Foo", "Bar" -> System.out.println("Great");
        default           -> System.out.println("Ok");
    }
}
```

## JEP 407: Remove RMI Activation (gỡ bỏ cơ chế kích hoạt RMI)

Xóa cơ chế kích hoạt Remote Method Invocation (RMI), đồng thời giữ lại phần còn lại của RMI. Cơ chế kích hoạt RMI đã lỗi thời và không còn được sử dụng.

## JEP 409: Sealed Classes (sealed class)

Sealed class do [JEP 360](https://openjdk.java.net/jeps/360) đề xuất xem trước, được tích hợp vào Java 15. Trong JDK 16, sealed class được cải tiến (kiểm tra tham chiếu chặt chẽ hơn và mối quan hệ thừa kế của sealed class), do [JEP 397](https://openjdk.java.net/jeps/397) đề xuất xem trước lại.

Trong [Tổng quan các tính năng mới Java 14 & 15](./java14-15.md), tôi đã giới thiệu chi tiết về sealed class, ở đây không giới thiệu thêm nữa.

## JEP 410: Remove the Experimental AOT and JIT Compiler (gỡ bỏ trình biên dịch AOT và JIT thử nghiệm)

Trong [JEP 295](https://openjdk.java.net/jeps/295) của Java 9, đã giới thiệu trình biên dịch Ahead-of-Time (AOT) thử nghiệm, biên dịch class Java thành native code trước khi khởi động virtual machine.

Java 17 xóa trình biên dịch Ahead-of-Time (AOT) và Just-In-Time (JIT) thử nghiệm, vì trình biên dịch này từ khi ra mắt đến nay ít được sử dụng, khối lượng công việc cần thiết để bảo trì nó rất lớn. Giữ lại interface trình biên dịch JVM cấp Java (JVMCI) thử nghiệm, để developer có thể tiếp tục sử dụng phiên bản trình biên dịch được xây dựng bên ngoài để thực hiện biên dịch JIT.

## JEP 411: Deprecate the Security Manager for Removal (đánh dấu ngừng dùng Security Manager để tiến tới gỡ bỏ)

Ngừng dùng Security Manager để có thể gỡ bỏ trong các phiên bản tương lai.

Security Manager có từ thời Java 1.0, trong nhiều năm qua, nó không phải là phương pháp chính để bảo vệ code Java phía client, và cũng hiếm khi được dùng để bảo vệ code phía server. Để thúc đẩy Java phát triển về phía trước, Java 17 ngừng dùng Security Manager, để cùng gỡ bỏ với Applet API phiên bản cũ ([JEP 398](https://openjdk.java.net/jeps/398)).

## JEP 412: Foreign Function & Memory API (API hàm và bộ nhớ ngoài, ấp ủ)

Chương trình Java có thể thông qua API này để tương tác với code và dữ liệu nằm ngoài Java runtime. Bằng cách gọi hiệu quả các hàm ngoài (tức code nằm ngoài JVM) và truy cập an toàn bộ nhớ ngoài (tức bộ nhớ không do JVM quản lý), API này giúp chương trình Java có thể gọi thư viện native và xử lý dữ liệu native, mà không nguy hiểm và mong manh như JNI.

Foreign function and memory API trải qua vòng ấp ủ đầu tiên trong Java 17, do [JEP 412](https://openjdk.java.net/jeps/412) đề xuất. Vòng ấp ủ thứ hai do [JEP 419](https://openjdk.org/jeps/419) đề xuất và được tích hợp vào Java 18, vòng xem trước do [JEP 424](https://openjdk.org/jeps/424) đề xuất và được tích hợp vào Java 19.

Trong [Tổng quan các tính năng mới Java 19](./java19.md), tôi đã giới thiệu chi tiết về foreign function and memory API, ở đây không giới thiệu thêm nữa.

## JEP 414: Vector API (vector API, ấp ủ lần hai)

Vector (Vector) API ban đầu do [JEP 338](https://openjdk.java.net/jeps/338) đề xuất, và được tích hợp vào Java 16 như [incubator API](http://openjdk.java.net/jeps/11). Vòng ấp ủ thứ hai do [JEP 414](https://openjdk.java.net/jeps/414) đề xuất và được tích hợp vào Java 17, vòng ấp ủ thứ ba do [JEP 417](https://openjdk.java.net/jeps/417) đề xuất và được tích hợp vào Java 18, vòng thứ tư do [JEP 426](https://openjdk.java.net/jeps/426) đề xuất và được tích hợp vào Java 19.

Incubator API này cung cấp một vòng lặp khởi đầu của API để biểu diễn một số phép tính vector, các phép tính này khi chạy được biên dịch một cách đáng tin cậy thành các lệnh phần cứng vector tối ưu trên kiến trúc CPU được hỗ trợ, từ đó đạt được hiệu suất tốt hơn so với phép tính scalar tương đương, tận dụng tối đa công nghệ Single Instruction Multiple Data (SIMD) (một loại lệnh có trên hầu hết CPU hiện đại). Mặc dù HotSpot hỗ trợ tự động vector hóa, nhưng tập hợp các thao tác scalar có thể chuyển đổi là hạn chế và dễ bị ảnh hưởng bởi các thay đổi code. API này sẽ giúp developer dễ dàng viết các algorithm vector hiệu suất cao, di động được bằng Java.

Trong [Tổng quan các tính năng mới Java 18](./java18.md), tôi đã giới thiệu chi tiết về vector API, ở đây không giới thiệu thêm nữa.

<!-- @include: @article-footer.snippet.md -->
