---
title: Bản dịch tiếng Việt《Java 8 Guide》
description: Dịch và tổng hợp tutorial Java 8, bao gồm Lambda, method reference, interface default method, Stream và các tính năng mới với code ví dụ.
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 8,指南,Lambda,方法引用,默认方法,Stream API,函数式接口,Date/Time API
---

# Bản dịch tiếng Việt《Java 8 Guide》

JDK 8 được phát hành vào ngày 18 tháng 3 năm 2014, đây là một phiên bản LTS (Long-Term Support), là một trong những phiên bản quan trọng nhất trong lịch sử Java. Cho đến nay, hiện có năm phiên bản Long-Term Support là JDK 8, JDK 11, JDK 17, JDK 21 và JDK 25.

JDK 8 giới thiệu rất nhiều tính năng mới quan trọng, bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- Lambda expression
- Method reference
- Interface default method
- Stream API
- Functional interface
- Optional class
- Date/Time API
- Nâng cấp annotation

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 24:

![](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

Mức độ phổ biến của Java 8 ngày càng cao, nhiều người nhắc đến rằng trong phỏng vấn, kiến thức về Java 8 cũng là điểm hỏi rất thường gặp. Đáp ứng yêu cầu và nhu cầu của mọi người, tôi định tổng kết phần kiến thức này. Vốn định tự tổng kết, sau đó thấy trên GitHub có một kho lưu trữ liên quan, địa chỉ:
[https://github.com/winterbe/java8-tutorial](https://github.com/winterbe/java8-tutorial). Kho lưu trữ này bằng tiếng Anh, tôi đã dịch và thêm, sửa một phần nội dung, dưới đây là phần chính.

---

Chào mừng bạn đọc bài giới thiệu của tôi về Java 8. Tutorial này sẽ hướng dẫn bạn từng bước qua tất cả các tính năng ngôn ngữ mới. Dựa trên các đoạn code ví dụ ngắn gọn, bạn sẽ học cách sử dụng default interface method, lambda expression, method reference và repeatable annotation. Đến cuối bài viết, bạn sẽ quen thuộc với các thay đổi API mới nhất như stream, functional interface, class mở rộng Map và Date API mới. Không có các đoạn văn dài dòng khô khan, chỉ có một loạt đoạn code có chú thích.

## Default Method của Interface

Java 8 cho phép chúng ta thêm implementation method không phải abstract vào interface bằng cách dùng từ khóa `default`. Tính năng này còn được gọi là [virtual extension method](http://stackoverflow.com/a/24102730).

Ví dụ đầu tiên:

```java
interface Formula{

    double calculate(int a);

    default double sqrt(int a) {
        return Math.sqrt(a);
    }

}
```

Trong interface Formula, ngoài abstract method tính công thức interface, còn định nghĩa default method `sqrt`. Class implement interface này chỉ cần implement abstract method `calculate`. Default method `sqrt` có thể dùng trực tiếp. Tất nhiên bạn cũng có thể trực tiếp tạo object thông qua interface, rồi implement default method trong interface là được, chúng ta minh họa cách này bằng code.

```java
public class Main {

  public static void main(String[] args) {
    // Truy cập interface thông qua anonymous inner class
    Formula formula = new Formula() {
        @Override
        public double calculate(int a) {
            return sqrt(a * 100);
        }
    };

    System.out.println(formula.calculate(100));     // 100.0
    System.out.println(formula.sqrt(16));           // 4.0

  }

}
```

formula được implement như một anonymous object. Code này rất dễ hiểu, 6 dòng code thực hiện tính `sqrt(a * 100)`. Trong phần tiếp theo, chúng ta sẽ thấy trong Java 8 có một cách tốt hơn và tiện hơn để implement đối tượng method đơn.

**Chú thích của người dịch:** Dù là abstract class hay interface, đều có thể truy cập thông qua anonymous inner class. Không thể trực tiếp tạo object thông qua abstract class hoặc interface. Đối với việc truy cập interface thông qua anonymous inner class ở trên, chúng ta có thể hiểu thế này: một inner class implement abstract method trong interface và trả về một object inner class, sau đó chúng ta để reference của interface trỏ đến object này.

## Lambda expression

Trước tiên xem trong Java phiên bản cũ cách sắp xếp chuỗi:

```java
List<String> names = Arrays.asList("peter", "anna", "mike", "xenia");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return b.compareTo(a);
    }
});
```

Chỉ cần truyền cho static method `Collections.sort` một đối tượng List cùng một comparator để sắp xếp theo thứ tự được chỉ định. Cách làm thông thường là tạo một anonymous comparator object rồi truyền cho method `sort`.

Trong Java 8 bạn không cần thiết phải dùng cách anonymous object truyền thống này nữa, Java 8 cung cấp cú pháp ngắn gọn hơn, lambda expression:

```java
Collections.sort(names, (String a, String b) -> {
    return b.compareTo(a);
});
```

Có thể thấy, code trở nên ngắn hơn và dễ đọc hơn, nhưng thực tế còn có thể viết ngắn hơn:

```java
Collections.sort(names, (String a, String b) -> b.compareTo(a));
```

Đối với function body chỉ có một dòng code, bạn có thể bỏ dấu ngoặc nhọn {} và từ khóa return, nhưng bạn còn có thể viết ngắn hơn nữa:

```java
names.sort((a, b) -> b.compareTo(a));
```

Class List tự nó có method `sort`. Và Java compiler có thể tự động suy ra kiểu tham số, nên bạn có thể không cần viết lại kiểu. Tiếp theo chúng ta xem lambda expression còn có cách dùng nào khác.

## Functional interface

**Chú thích của người dịch:** Phần này trong nguyên văn giải thích không rõ ràng, nên đã sửa lại!

Các nhà thiết kế ngôn ngữ Java đã đầu tư rất nhiều công sức để suy nghĩ làm thế nào khiến các function hiện có hỗ trợ Lambda một cách thân thiện. Cách cuối cùng được áp dụng là: thêm khái niệm functional interface. **"functional interface" là interface chỉ chứa một abstract method duy nhất, nhưng có thể có nhiều non-abstract method (chính là default method nhắc đến ở trên).** Giống như interface vậy, nó có thể làm target type cho lambda expression. `java.lang.Runnable` và `java.util.concurrent.Callable` là hai ví dụ điển hình nhất của functional interface. Java 8 bổ sung một annotation đặc biệt `@FunctionalInterface`, nhưng annotation này thường không bắt buộc. Chỉ cần interface thỏa mãn định nghĩa functional interface, Java compiler có thể coi nó làm target type cho lambda expression. Nói chung khuyến nghị khai báo `@FunctionalInterface` annotation trên interface, như vậy khi compiler phát hiện interface được đánh dấu không thỏa mãn yêu cầu functional interface sẽ báo lỗi, như hình dưới đây.

![@FunctionalInterface annotation](https://oss.javaguide.cn/github/javaguide/java/@FunctionalInterface.png)

Ví dụ:

```java
@FunctionalInterface
public interface Converter<F, T> {
  T convert(F from);
}
```

```java
    // TODO 将数字字符串转换为整数类型
    Converter<String, Integer> converter = (from) -> Integer.valueOf(from);
    Integer converted = converter.convert("123");
    System.out.println(converted.getClass()); //class java.lang.Integer
```

**Chú thích của người dịch:** Hầu hết functional interface không cần chúng ta tự viết, Java 8 đều đã implement sẵn cho chúng ta, các interface này đều nằm trong package java.util.function.

## Method và Constructor reference

Code trong phần trước còn có thể biểu diễn bằng static method reference:

```java
    Converter<String, Integer> converter = Integer::valueOf;
    Integer converted = converter.convert("123");
    System.out.println(converted.getClass());   //class java.lang.Integer
```

Java 8 cho phép bạn truyền method hoặc constructor reference thông qua từ khóa `::`. Ví dụ trên cho thấy cách tham chiếu static method. Nhưng chúng ta cũng có thể tham chiếu method của đối tượng:

```java
class Something {
    String startsWith(String s) {
        return String.valueOf(s.charAt(0));
    }
}
```

```java
Something something = new Something();
Converter<String, String> converter = something::startsWith;
String converted = converter.convert("Java");
System.out.println(converted);    // "J"
```

Tiếp theo xem constructor dùng từ khóa `::` để tham chiếu như thế nào, trước tiên chúng ta định nghĩa một class đơn giản chứa nhiều constructor:

```java
class Person {
    String firstName;
    String lastName;

    Person() {}

    Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

Tiếp theo chúng ta chỉ định một interface object factory dùng để tạo đối tượng Person:

```java
interface PersonFactory<P extends Person> {
    P create(String firstName, String lastName);
}
```

Ở đây chúng ta dùng constructor reference để gắn kết chúng lại, thay vì thủ công implement một factory hoàn chỉnh:

```java
PersonFactory<Person> personFactory = Person::new;
Person person = personFactory.create("Peter", "Parker");
```

Chúng ta chỉ cần dùng `Person::new` để lấy reference tới constructor của class Person, Java compiler sẽ tự động chọn constructor phù hợp dựa theo kiểu tham số của method `PersonFactory.create`.

## Phạm vi Lambda expression

### Truy cập biến cục bộ

Chúng ta có thể trực tiếp truy cập biến cục bộ bên ngoài trong lambda expression:

```java
final int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);

stringConverter.convert(2);     // 3
```

Nhưng khác với anonymous object, biến num ở đây có thể không khai báo là final, code này vẫn đúng:

```java
int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);

stringConverter.convert(2);     // 3
```

Tuy nhiên num ở đây phải không được sửa đổi bởi code phía sau (tức ngầm có ngữ nghĩa của final), ví dụ dưới đây không thể biên dịch:

```java
int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);
num = 3;//Trong lambda expression cố gắng sửa đổi num đồng thời cũng không được phép.
```

### Truy cập field và static variable

So với biến cục bộ, trong lambda expression chúng ta có quyền đọc-ghi cả instance field và static variable. Hành vi này nhất quán với anonymous object.

```java
class Lambda4 {
    static int outerStaticNum;
    int outerNum;

    void testScopes() {
        Converter<Integer, String> stringConverter1 = (from) -> {
            outerNum = 23;
            return String.valueOf(from);
        };

        Converter<Integer, String> stringConverter2 = (from) -> {
            outerStaticNum = 72;
            return String.valueOf(from);
        };
    }
}
```

### Truy cập default method của interface

Còn nhớ ví dụ formula ở phần đầu không? Interface `Formula` định nghĩa một default method `sqrt`, có thể truy cập method này từ mọi instance formula chứa anonymous object. Điều này không áp dụng cho lambda expression.

Không thể truy cập default method từ lambda expression, nên code dưới đây không thể biên dịch:

```java
Formula formula = (a) -> sqrt(a * 100);
```

## Built-in Functional Interfaces

JDK 1.8 API bao gồm nhiều built-in functional interface. Một số interface trong đó khá phổ biến trong Java phiên bản cũ như: `Comparator` hay `Runnable`, các interface này đều được bổ sung `@FunctionalInterface` annotation để có thể dùng trên lambda expression.

Nhưng Java 8 API cũng cung cấp rất nhiều functional interface hoàn toàn mới để công việc lập trình của bạn thuận tiện hơn, một số interface đến từ thư viện [Google Guava](https://code.google.com/p/guava-libraries/), dù bạn đã rất quen thuộc với chúng, vẫn cần xem những thứ này được mở rộng để dùng trên lambda như thế nào.

### Predicate

Interface Predicate là interface **kiểu khẳng định** chỉ có một tham số trả về giá trị kiểu boolean. Interface này bao gồm nhiều default method để kết hợp Predicate thành các logic phức tạp khác (ví dụ: và, hoặc, phủ định):

**Chú thích của người dịch:** Source code của interface Predicate như sau

```java
package java.util.function;
import java.util.Objects;

@FunctionalInterface
public interface Predicate<T> {

    // Method này nhận một kiểu truyền vào, trả về một giá trị boolean. Method này dùng để phán đoán.
    boolean test(T t);

    // and method tương tự như toán tử quan hệ "&&", cả hai bên đều đúng mới trả về true
    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }
    // Tương tự như toán tử quan hệ "!", phủ định phán đoán
    default Predicate<T> negate() {
        return (t) -> !test(t);
    }
    // or method tương tự như toán tử quan hệ "||", chỉ cần một bên đúng là trả về true
    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }
   // Method này nhận một đối tượng Object, trả về kiểu Predicate. Method này dùng để phán đoán test method thứ nhất và test method thứ hai có giống nhau (equal) hay không.
    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
```

Ví dụ:

```java
Predicate<String> predicate = (s) -> s.length() > 0;

predicate.test("foo");              // true
predicate.negate().test("foo");     // false

Predicate<Boolean> nonNull = Objects::nonNull;
Predicate<Boolean> isNull = Objects::isNull;

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();
```

### Function

Interface Function nhận một tham số và tạo ra kết quả. Default method có thể dùng để nối nhiều function lại với nhau (compose, andThen):

**Chú thích của người dịch:** Source code của interface Function như sau

```java

package java.util.function;

import java.util.Objects;

@FunctionalInterface
public interface Function<T, R> {

    //Áp dụng đối tượng Function lên tham số đầu vào, rồi trả về kết quả tính toán.
    R apply(T t);
    //Tích hợp hai Function, và trả về một Function object có khả năng thực thi chức năng của hai Function object.
    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }
    //
    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

```java
Function<String, Integer> toInteger = Integer::valueOf;
Function<String, String> backToString = toInteger.andThen(String::valueOf);
backToString.apply("123");     // "123"
```

### Supplier

Interface Supplier tạo ra kết quả của kiểu generic được cung cấp. Khác với interface Function, interface Supplier không nhận tham số.

```java
Supplier<Person> personSupplier = Person::new;
personSupplier.get();   // new Person
```

### Consumer

Interface Consumer biểu thị thao tác thực hiện trên một tham số đầu vào đơn.

```java
Consumer<Person> greeter = (p) -> System.out.println("Hello, " + p.firstName);
greeter.accept(new Person("Luke", "Skywalker"));
```

### Comparator

Comparator là interface kinh điển trong Java cũ, Java 8 bổ sung thêm nhiều default method trên nó:

```java
Comparator<Person> comparator = (p1, p2) -> p1.firstName.compareTo(p2.firstName);

Person p1 = new Person("John", "Doe");
Person p2 = new Person("Alice", "Wonderland");

comparator.compare(p1, p2);             // > 0
comparator.reversed().compare(p1, p2);  // < 0
```

## Optional

Optional không phải functional interface, mà là container dùng để biểu thị tường minh "có thể không có giá trị". Sử dụng đúng cách nó có thể giảm bớt một phần việc kiểm tra `null` thủ công, nhưng không thể đảm bảo chương trình không còn xuất hiện `NullPointerException`. Đây là một khái niệm quan trọng của phần tiếp theo, chúng ta nhanh chóng tìm hiểu Optional hoạt động như thế nào.

Optional là một container đơn giản, nó hoặc chứa một giá trị không phải `null`, hoặc rỗng. Trong kịch bản trả về phù hợp để biểu đạt "kết quả có thể không tồn tại", có thể trả về Optional, thay vì dùng `null` để biểu thị không có kết quả.

Chú thích của người dịch: tác dụng của mỗi method trong ví dụ đã được bổ sung.

```java
//of()：tạo một Optional cho giá trị không phải null
Optional<String> optional = Optional.of("bam");
// isPresent()：nếu giá trị tồn tại trả về true, ngược lại trả về false
optional.isPresent();           // true
//get()：nếu Optional có giá trị thì trả về nó, ngược lại ném NoSuchElementException
optional.get();                 // "bam"
//orElse()：nếu có giá trị thì trả về nó, ngược lại trả về giá trị khác được chỉ định
optional.orElse("fallback");    // "bam"
//ifPresent()：nếu instance Optional có giá trị thì gọi consumer cho nó, ngược lại không xử lý
optional.ifPresent((s) -> System.out.println(s.charAt(0)));     // "b"
```

Đọc đề xuất: [[Java8]cách sử dụng Optional đúng cách](https://blog.kaaass.net/archives/764)

## Streams (stream)

`java.util.stream.Stream` biểu thị chuỗi thao tác có thể áp dụng lần lượt trên một nhóm phần tử. Thao tác Stream chia làm hai loại là intermediate operation (thao tác trung gian) hoặc terminal operation (thao tác cuối), terminal operation trả về một kết quả tính toán kiểu cụ thể, còn intermediate operation trả về bản thân Stream, như vậy bạn có thể nối nhiều thao tác lần lượt với nhau. Stream có thể được tạo từ nhiều nguồn dữ liệu như collection, array, hàm sinh; bản thân Map không có method `stream()`, nhưng có thể tạo stream thông qua view key, value hoặc entry của nó. Thao tác Stream có thể thực thi nối tiếp hoặc song song.

Trước tiên xem Stream dùng như thế nào, trước hết tạo List dữ liệu cần dùng cho code ví dụ:

```java
List<String> stringList = new ArrayList<>();
stringList.add("ddd2");
stringList.add("aaa2");
stringList.add("bbb1");
stringList.add("aaa1");
stringList.add("bbb3");
stringList.add("ccc");
stringList.add("bbb2");
stringList.add("ddd1");
```

Java 8 mở rộng collection class, có thể tạo một Stream thông qua Collection.stream() hoặc Collection.parallelStream(). Các phần dưới đây sẽ giải thích chi tiết các thao tác Stream thường dùng:

### Filter (lọc)

Lọc thông qua một predicate interface để lọc và chỉ giữ lại các phần tử thỏa mãn điều kiện, thao tác này thuộc **intermediate operation**, nên chúng ta có thể áp dụng các thao tác Stream khác (ví dụ forEach) trên kết quả đã lọc. forEach cần một hàm để thực thi lần lượt các phần tử đã lọc. forEach là terminal operation, nên chúng ta không thể thực thi các thao tác Stream khác sau forEach.

```java
        // Test Filter (lọc)
        stringList
                .stream()
                .filter((s) -> s.startsWith("a"))
                .forEach(System.out::println);//aaa2 aaa1
```

forEach được thiết kế cho Lambda, giữ phong cách tối gọn nhất. Và bản thân lambda expression có thể tái sử dụng, rất tiện lợi.

### Sorted (sắp xếp)

Sắp xếp là một **intermediate operation**, trả về Stream đã được sắp xếp. **Nếu bạn không chỉ định một Comparator tùy chỉnh thì sẽ dùng sắp xếp mặc định.**

```java
        // Test Sort (sắp xếp)
        stringList
                .stream()
                .sorted()
                .filter((s) -> s.startsWith("a"))
                .forEach(System.out::println);// aaa1 aaa2
```

Cần lưu ý, sắp xếp chỉ tạo ra một Stream đã sắp xếp xong, không ảnh hưởng đến nguồn dữ liệu ban đầu, sau khi sắp xếp dữ liệu stringList gốc sẽ không bị sửa đổi:

```java
    System.out.println(stringList);// ddd2, aaa2, bbb1, aaa1, bbb3, ccc, bbb2, ddd1
```

### Map (ánh xạ)

Intermediate operation map sẽ lần lượt chuyển các phần tử thành object khác theo interface Function được chỉ định.

Ví dụ dưới đây cho thấy chuyển chuỗi thành chuỗi in hoa. Bạn cũng có thể dùng map để chuyển object thành kiểu khác, loại Stream mà map trả về được quyết định theo kiểu trả về của hàm mà bạn truyền vào map.

```java
        // Test thao tác Map
        stringList
                .stream()
                .map(String::toUpperCase)
                .sorted((a, b) -> b.compareTo(a))
                .forEach(System.out::println);// "DDD2", "DDD1", "CCC", "BBB3", "BBB2", "BBB1", "AAA2", "AAA1"
```

### Match (khớp)

Stream cung cấp nhiều thao tác khớp, cho phép phát hiện Predicate được chỉ định có khớp với toàn bộ Stream hay không. Tất cả thao tác khớp đều là **terminal operation**, và trả về một giá trị kiểu boolean.

```java
        // Test thao tác Match (khớp)
        boolean anyStartsWithA =
                stringList
                        .stream()
                        .anyMatch((s) -> s.startsWith("a"));
        System.out.println(anyStartsWithA);      // true

        boolean allStartsWithA =
                stringList
                        .stream()
                        .allMatch((s) -> s.startsWith("a"));

        System.out.println(allStartsWithA);      // false

        boolean noneStartsWithZ =
                stringList
                        .stream()
                        .noneMatch((s) -> s.startsWith("z"));

        System.out.println(noneStartsWithZ);      // true
```

### Count (đếm)

Đếm là một **terminal operation**, trả về số phần tử trong Stream, **kiểu trả về là long**.

```java
      //Test thao tác Count (đếm)
        long startsWithB =
                stringList
                        .stream()
                        .filter((s) -> s.startsWith("b"))
                        .count();
        System.out.println(startsWithB);    // 3
```

### Reduce (quy nạp)

Đây là một **terminal operation**, cho phép thông qua hàm được chỉ định để quy nạp nhiều phần tử trong stream thành một phần tử, kết quả sau khi quy nạp được biểu thị thông qua interface Optional:

```java
        //Test thao tác Reduce (quy nạp)
        Optional<String> reduced =
                stringList
                        .stream()
                        .sorted()
                        .reduce((s1, s2) -> s1 + "#" + s2);

        reduced.ifPresent(System.out::println);//aaa1#aaa2#bbb1#bbb2#bbb3#ccc#ddd1#ddd2
```

**Chú thích của người dịch:** Tác dụng chính của method này là kết hợp các phần tử Stream lại với nhau. Nó cung cấp một giá trị khởi đầu (seed), sau đó theo quy tắc tính toán (BinaryOperator), kết hợp với phần tử thứ nhất, thứ hai, thứ n của Stream phía trước. Theo nghĩa này, nối chuỗi, sum, min, max, average của giá trị số đều là reduce đặc biệt. Ví dụ sum của Stream tương đương `Integer sum = integers.reduce(0, (a, b) -> a+b);` cũng có trường hợp không có giá trị khởi đầu, khi đó sẽ kết hợp hai phần tử đầu tiên của Stream, trả về Optional.

```java
// Nối chuỗi, concat = "ABCD"
String concat = Stream.of("A", "B", "C", "D").reduce("", String::concat);
// Tìm giá trị nhỏ nhất, minValue = -3.0
double minValue = Stream.of(-1.5, 1.0, -3.0, -2.0).reduce(Double.MAX_VALUE, Double::min);
// Tính tổng, sumValue = 10, có giá trị khởi đầu
int sumValue = Stream.of(1, 2, 3, 4).reduce(0, Integer::sum);
// Tính tổng, sumValue = 10, không có giá trị khởi đầu
sumValue = Stream.of(1, 2, 3, 4).reduce(Integer::sum).get();
// Lọc, nối chuỗi, concat = "ace"
concat = Stream.of("a", "B", "c", "D", "e", "F").
 filter(x -> x.compareTo("Z") > 0).
 reduce("", String::concat);
```

Giống như code trên, ví dụ reduce() đầu tiên, tham số thứ nhất (ký tự trống) chính là giá trị khởi đầu, tham số thứ hai (String::concat) là BinaryOperator. Loại reduce() có giá trị khởi đầu này đều trả về object cụ thể. Còn với reduce() không có giá trị khởi đầu ở ví dụ thứ tư, do có thể không đủ phần tử, trả về Optional, hãy chú ý sự khác biệt này. Xem thêm: [IBM: Giải thích chi tiết Streams API trong Java 8](https://www.ibm.com/developerworks/cn/java/j-lo-java8streamapi/index.html)

## Parallel Streams (parallel stream)

Đã nhắc đến ở trước, Stream có hai loại nối tiếp và song song, thao tác trên Stream nối tiếp được hoàn thành lần lượt trong một thread, còn parallel Stream được thực thi đồng thời trên nhiều thread.

Ví dụ dưới đây cho thấy cách nâng cao hiệu suất thông qua parallel Stream:

Trước tiên chúng ta tạo một bảng lớn không có phần tử trùng lặp:

```java
int max = 1000000;
List<String> values = new ArrayList<>(max);
for (int i = 0; i < max; i++) {
    UUID uuid = UUID.randomUUID();
    values.add(uuid.toString());
}
```

Chúng ta lần lượt dùng hai cách nối tiếp và song song để sắp xếp, cuối cùng xem so sánh thời gian sử dụng.

### Sequential Sort (sắp xếp nối tiếp)

```java
//Sắp xếp nối tiếp
long t0 = System.nanoTime();
long count = Arrays.stream(list.stream().sorted().toArray()).count();
System.out.println(count);

long t1 = System.nanoTime();

long millis = TimeUnit.NANOSECONDS.toMillis(t1 - t0);
System.out.println(String.format("sequential sort took: %d ms", millis));
```

```plain
1000000
sequential sort took: 709 ms//Thời gian sắp xếp nối tiếp
```

### Parallel Sort (sắp xếp song song)

```java
//Sắp xếp song song
long t0 = System.nanoTime();

long count = Arrays.stream(list.parallelStream().sorted().toArray()).count();
System.out.println(count);

long t1 = System.nanoTime();

long millis = TimeUnit.NANOSECONDS.toMillis(t1 - t0);
System.out.println(String.format("parallel sort took: %d ms", millis));

```

```java
1000000
parallel sort took: 475 ms//Thời gian sắp xếp song song
```

Hai đoạn code trên gần như giống nhau, nhưng bản song song nhanh hơn khoảng 50%, thay đổi duy nhất cần làm là đổi `stream()` thành `parallelStream()`.

## Maps

Đã nhắc đến ở trước, kiểu Map không hỗ trợ stream, nhưng Map cung cấp một số method hữu ích mới để xử lý các tác vụ hằng ngày. Bản thân interface Map không có method `stream()` khả dụng, nhưng bạn có thể tạo stream chuyên dụng trên key, value hoặc thông qua `map.keySet().stream()`, `map.values().stream()` và `map.entrySet().stream()`.

Ngoài ra, Map hỗ trợ nhiều method mới và hữu ích để thực hiện các tác vụ thông thường.

```java
Map<Integer, String> map = new HashMap<>();

for (int i = 0; i < 10; i++) {
    map.putIfAbsent(i, "val" + i);
}

map.forEach((id, val) -> System.out.println(val));//val0 val1 val2 val3 val4 val5 val6 val7 val8 val9
```

`putIfAbsent` ngăn chúng ta viết thêm code khi kiểm tra null; `forEach` nhận một consumer để thao tác với từng phần tử trong map.

Ví dụ này cho thấy cách dùng hàm để tính toán code trên map:

```java
map.computeIfPresent(3, (num, val) -> val + num);
map.get(3);             // val33

map.computeIfPresent(9, (num, val) -> null);
map.containsKey(9);     // false

map.computeIfAbsent(23, num -> "val" + num);
map.containsKey(23);    // true

map.computeIfAbsent(3, num -> "bam");
map.get(3);             // val33
```

Tiếp theo xem cách xóa một mục mà key-value đều khớp trong Map:

```java
map.remove(3, "val3");
map.get(3);             // val33
map.remove(3, "val33");
map.get(3);             // null
```

Một method hữu ích khác:

```java
map.getOrDefault(42, "not found");  // not found
```

Việc merge các phần tử của Map cũng trở nên dễ dàng:

```java
map.merge(9, "val9", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9
map.merge(9, "concat", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9concat
```

Merge làm điều này: nếu key không tồn tại thì chèn vào, ngược lại thực hiện thao tác merge trên value ứng với key gốc rồi chèn lại vào map.

## Date API (API ngày)

Java 8 bao gồm một API ngày và giờ hoàn toàn mới dưới package `java.time`. Date API mới tương tự thư viện Joda-Time, nhưng chúng không giống nhau. Các ví dụ dưới đây bao quát các phần quan trọng nhất của API mới này. Người dịch đã tham khảo sách liên quan để sửa đổi phần lớn nội dung phần này.

**Chú thích của người dịch (tổng kết):**

- Class Clock cung cấp method truy cập ngày và giờ hiện tại, Clock nhạy cảm với timezone, có thể dùng để lấy số mili giây hiện tại. Một mốc thời gian cụ thể cũng có thể dùng class `Instant` để biểu thị, class `Instant` cũng có thể dùng để tạo đối tượng `java.util.Date` phiên bản cũ.

- Trong API mới, timezone được biểu thị bằng ZoneId. Timezone có thể thuận tiện dùng static method of để lấy được. Abstract class `ZoneId` (trong package `java.time`) biểu thị một định danh vùng. Nó có một static method tên là `getAvailableZoneIds`, trả về tất cả định danh vùng.

- jdk1.8 bổ sung các class như LocalDate và LocalDateTime để giải quyết phương pháp xử lý ngày, đồng thời giới thiệu một class mới DateTimeFormatter để giải quyết vấn đề định dạng ngày. Có thể dùng Instant thay Date, LocalDateTime thay Calendar, DateTimeFormatter thay SimpleDateFormat.

### Clock

Class Clock cung cấp method truy cập ngày và giờ hiện tại, Clock nhạy cảm với timezone, có thể dùng để lấy số mili giây hiện tại. Một mốc thời gian cụ thể cũng có thể dùng class `Instant` để biểu thị, class `Instant` cũng có thể dùng để tạo đối tượng `java.util.Date` phiên bản cũ.

```java
Clock clock = Clock.systemDefaultZone();
long millis = clock.millis();
System.out.println(millis);//1552379579043
Instant instant = clock.instant();
System.out.println(instant);
Date legacyDate = Date.from(instant); //2019-03-12T08:46:42.588Z
System.out.println(legacyDate);//Tue Mar 12 16:32:59 CST 2019
```

### Timezones (timezone)

Trong API mới, timezone được biểu thị bằng ZoneId. Timezone có thể thuận tiện dùng static method of để lấy được. Abstract class `ZoneId` (trong package `java.time`) biểu thị một định danh vùng. Nó có một static method tên là `getAvailableZoneIds`, trả về tất cả định danh vùng.

```java
//Xuất ra tất cả định danh vùng
System.out.println(ZoneId.getAvailableZoneIds());

ZoneId zone1 = ZoneId.of("Europe/Berlin");
ZoneId zone2 = ZoneId.of("Brazil/East");
System.out.println(zone1.getRules());// ZoneRules[currentStandardOffset=+01:00]
System.out.println(zone2.getRules());// ZoneRules[currentStandardOffset=-03:00]
```

### LocalTime (giờ địa phương)

LocalTime định nghĩa một thời gian không có thông tin timezone, ví dụ 10 giờ tối hoặc 17:30:15. Ví dụ dưới đây dùng timezone được tạo từ code phía trước để tạo hai giờ địa phương. Sau đó so sánh thời gian và tính chênh lệch thời gian giữa hai thời gian theo đơn vị giờ và phút:

```java
LocalTime now1 = LocalTime.now(zone1);
LocalTime now2 = LocalTime.now(zone2);
System.out.println(now1.isBefore(now2));  // false

long hoursBetween = ChronoUnit.HOURS.between(now1, now2);
long minutesBetween = ChronoUnit.MINUTES.between(now1, now2);

System.out.println(hoursBetween);       // -3
System.out.println(minutesBetween);     // -239
```

LocalTime cung cấp nhiều factory method để đơn giản hóa việc tạo object, bao gồm parse chuỗi thời gian.

```java
LocalTime late = LocalTime.of(23, 59, 59);
System.out.println(late);       // 23:59:59
DateTimeFormatter germanFormatter =
    DateTimeFormatter
        .ofLocalizedTime(FormatStyle.SHORT)
        .withLocale(Locale.GERMAN);

LocalTime leetTime = LocalTime.parse("13:37", germanFormatter);
System.out.println(leetTime);   // 13:37
```

### LocalDate (ngày địa phương)

LocalDate biểu thị một ngày chính xác, ví dụ 2014-03-11. Giá trị của đối tượng này là bất biến, cách dùng cơ bản giống LocalTime. Ví dụ dưới đây cho thấy cách cộng/trừ ngày/tháng/năm cho đối tượng Date. Cần lưu ý các đối tượng này là bất biến, thao tác luôn trả về một instance mới.

```java
LocalDate today = LocalDate.now();//Lấy ngày hiện tại
System.out.println("今天的日期: "+today);//2019-03-12
LocalDate tomorrow = today.plus(1, ChronoUnit.DAYS);
System.out.println("明天的日期: "+tomorrow);//2019-03-13
LocalDate yesterday = tomorrow.minusDays(2);
System.out.println("昨天的日期: "+yesterday);//2019-03-11
LocalDate independenceDay = LocalDate.of(2019, Month.MARCH, 12);
DayOfWeek dayOfWeek = independenceDay.getDayOfWeek();
System.out.println("今天是周几:"+dayOfWeek);//TUESDAY
```

Từ chuỗi parse một kiểu LocalDate đơn giản như parse LocalTime, dưới đây là ví dụ dùng `DateTimeFormatter` để parse chuỗi:

```java
    String str1 = "2014==04==12 01时06分09秒";
        //Theo chuỗi ngày, giờ cần parse để định nghĩa formatter dùng cho việc parse
        DateTimeFormatter fomatter1 = DateTimeFormatter
                .ofPattern("yyyy==MM==dd HH时mm分ss秒");

        LocalDateTime dt1 = LocalDateTime.parse(str1, fomatter1);
        System.out.println(dt1); // Xuất ra 2014-04-12T01:06:09

        String str2 = "2014$$$四月$$$13 20小时";
        DateTimeFormatter fomatter2 = DateTimeFormatter
                .ofPattern("yyy$$$MMM$$$dd HH小时");
        LocalDateTime dt2 = LocalDateTime.parse(str2, fomatter2);
        System.out.println(dt2); // Xuất ra 2014-04-13T20:00

```

Xem thêm một ví dụ dùng `DateTimeFormatter` để định dạng ngày

```java
LocalDateTime rightNow=LocalDateTime.now();
String date=DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(rightNow);
System.out.println(date);//2019-03-12T16:26:48.29
DateTimeFormatter formatter=DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
System.out.println(formatter.format(rightNow));//2019-03-12 16:26:48
```

**🐛 Hiệu chỉnh (xem: [issue#1157](https://github.com/Snailclimb/JavaGuide/issues/1157))**：khi dùng `YYYY` hiển thị năm, sẽ hiển thị năm của tuần chứa thời điểm hiện tại, trong tuần sang năm sẽ có vấn đề. Trong trường hợp bình thường đều dùng `yyyy`, để hiển thị năm chính xác.

Ví dụ hiển thị ngày sai do sang năm:

```java
LocalDateTime rightNow = LocalDateTime.of(2020, 12, 31, 12, 0, 0);
String date= DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(rightNow);
// 2020-12-31T12:00:00
System.out.println(date);
DateTimeFormatter formatterOfYYYY = DateTimeFormatter.ofPattern("YYYY-MM-dd HH:mm:ss");
// 2021-12-31 12:00:00
System.out.println(formatterOfYYYY.format(rightNow));

DateTimeFormatter formatterOfYyyy = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
// 2020-12-31 12:00:00
System.out.println(formatterOfYyyy.format(rightNow));
```

Từ hình dưới đây có thể nhìn thấy rõ hơn lỗi cụ thể, và IDEA đã thông minh gợi ý thiên về dùng `yyyy` thay vì `YYYY`.

![](https://oss.javaguide.cn/github/javaguide/java/new-features/2021042717491413.png)

### LocalDateTime (ngày giờ địa phương)

LocalDateTime đồng thời biểu thị thời gian và ngày, tương đương với việc gộp nội dung hai phần trước vào một đối tượng. LocalDateTime giống LocalTime và LocalDate, đều bất biến. LocalDateTime cung cấp một số method có thể truy cập field cụ thể.

```java
LocalDateTime sylvester = LocalDateTime.of(2014, Month.DECEMBER, 31, 23, 59, 59);

DayOfWeek dayOfWeek = sylvester.getDayOfWeek();
System.out.println(dayOfWeek);      // WEDNESDAY

Month month = sylvester.getMonth();
System.out.println(month);          // DECEMBER

long minuteOfDay = sylvester.getLong(ChronoField.MINUTE_OF_DAY);
System.out.println(minuteOfDay);    // 1439
```

Chỉ cần gắn thêm thông tin timezone, có thể chuyển nó thành mốc thời gian Instant object, Instant time point object có thể dễ dàng chuyển thành `java.util.Date` kiểu cũ.

```java
Instant instant = sylvester
        .atZone(ZoneId.systemDefault())
        .toInstant();

Date legacyDate = Date.from(instant);
System.out.println(legacyDate);     // Wed Dec 31 23:59:59 CET 2014
```

Format LocalDateTime giống format thời gian và ngày, ngoài việc dùng format định nghĩa sẵn, chúng ta cũng có thể tự định nghĩa format:

```java
DateTimeFormatter formatter =
    DateTimeFormatter
        .ofPattern("MMM dd, yyyy - HH:mm");
LocalDateTime parsed = LocalDateTime.parse("Nov 03, 2014 - 07:13", formatter);
String string = formatter.format(parsed);
System.out.println(string);     // Nov 03, 2014 - 07:13
```

Khác với java.text.NumberFormat, DateTimeFormatter phiên bản mới là bất biến, nên nó thread-safe.
Thông tin chi tiết về định dạng ngày giờ ở [đây](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html).

## Annotations (annotation)

Trong Java 8 hỗ trợ nhiều annotation, xem một ví dụ để hiểu ý nghĩa của nó.
Trước tiên định nghĩa một wrapper class annotation Hints để đặt một nhóm Hint annotation cụ thể:

```java
@Retention(RetentionPolicy.RUNTIME)
@interface Hints {
    Hint[] value();
}
@Repeatable(Hints.class)
@interface Hint {
    String value();
}
```

Java 8 cho phép chúng ta dùng cùng một loại annotation nhiều lần, chỉ cần đánh dấu `@Repeatable` cho annotation đó là được.

Ví dụ 1: dùng wrapper class làm container để lưu nhiều annotation (cách cũ)

```java
@Hints({@Hint("hint1"), @Hint("hint2")})
class Person {}
```

Ví dụ 2: dùng nhiều annotation (cách mới)

```java
@Hint("hint1")
@Hint("hint2")
class Person {}
```

Trong ví dụ thứ hai, java compiler sẽ ngầm định giúp bạn định nghĩa sẵn annotation @Hints, hiểu điểm này giúp bạn dùng reflection để lấy các thông tin này:

```java
Hint hint = Person.class.getAnnotation(Hint.class);
System.out.println(hint);                   // null
Hints hints1 = Person.class.getAnnotation(Hints.class);
System.out.println(hints1.value().length);  // 2

Hint[] hints2 = Person.class.getAnnotationsByType(Hint.class);
System.out.println(hints2.length);          // 2
```

Dù chúng ta không định nghĩa annotation `@Hints` trên class `Person`, vẫn có thể thông qua `getAnnotation(Hints.class)` để lấy annotation `@Hints`, cách thuận tiện hơn là dùng `getAnnotationsByType` có thể trực tiếp lấy tất cả annotation `@Hint`.
Ngoài ra annotation của Java 8 còn được bổ sung thêm hai target mới:

```java
@Target({ElementType.TYPE_PARAMETER, ElementType.TYPE_USE})
@interface MyAnnotation {}
```

## Where to go from here?

Về các tính năng mới của Java 8 thì viết đến đây thôi, chắc chắn còn nhiều tính năng hơn nữa chờ được khám phá. Trong JDK 1.8 còn rất nhiều thứ hữu ích, ví dụ `Arrays.parallelSort`, `StampedLock` và `CompletableFuture`, v.v.

<!-- @include: @article-footer.snippet.md -->