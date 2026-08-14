---
title: Thực hành các tính năng mới Java 8
description: Hướng dẫn thực hành các tính năng mới cốt lõi của Java 8, bao gồm Lambda, Stream, Optional, Date/Time API và interface default method...
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 8,Lambda,Stream API,Optional,Date/Time API,默认方法,函数式接口
---

> Bài viết này đến từ đóng góp của [cowbi](https://github.com/cowbi)~

<!-- markdownlint-disable MD024 -->

JDK 8 được phát hành vào ngày 18 tháng 3 năm 2014, đây là một phiên bản LTS (Long-Term Support), cũng là một trong những phiên bản được sử dụng rộng rãi lâu dài trong hệ sinh thái Java. Các phiên bản LTS hiện tại mà Oracle liệt kê bao gồm JDK 8, JDK 11, JDK 17, JDK 21 và JDK 25.

JDK 8 giới thiệu rất nhiều tính năng mới quan trọng, bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- Lambda expression
- Stream API
- Optional class
- Date-Time API
- Interface default method
- Functional interface

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 24:

![](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

Oracle phát hành Java 8 (JDK 1.8) vào năm 2014, sau đó nó được sử dụng lâu dài và rộng rãi trong hệ sinh thái Java. Nhiều lập trình viên vẫn chưa hiểu rõ một số tính năng mới của nó, đặc biệt là những developer quen thuộc với các phiên bản trước Java 8, ví dụ như tôi.

Để không bị tụt lại quá xa so với mọi người, vẫn cần thiết tổng kết sắp xếp lại những tính năng mới này. So với jdk.7, nó có nhiều thay đổi hay nói là tối ưu hóa, ví dụ trong interface có thể có static method, và có thể có method body (phần thân phương thức), điểm này làm đảo lộn nhận thức trước đây; trong cấu trúc dữ liệu `java.util.HashMap` bổ sung cây đỏ-đen; còn có Lambda expression nổi tiếng, v.v. Bài viết này không thể chia sẻ hết tất cả các tính năng mới cho mọi người, chỉ liệt kê những tính năng mới thường dùng để giảng giải chi tiết. Xem thêm nội dung liên quan tại [giới thiệu về tính năng mới của Java 8 trên trang chủ](https://www.oracle.com/java/technologies/javase/8-whats-new.html).

## Interface

Mục đích thiết kế ban đầu của interface là hướng tới trừu tượng hóa, nâng cao tính mở rộng. Điều này cũng để lại một chút tiếc nuối, khi Interface được sửa đổi, class implement nó cũng phải sửa theo.

Để giải quyết vấn đề không tương thích giữa việc sửa đổi interface với implementation hiện có. Method mới của interface có thể được sửa bằng `default` hoặc `static`, như vậy có thể có method body, class implement cũng không cần ghi đè method này.

Trong một interface có thể có nhiều method được chúng sửa, sự khác biệt của 2 modifier này chủ yếu cũng là sự khác biệt giữa method thông thường và static method.

1. Method được sửa bằng `default`, là instance method thông thường, có thể dùng `this` để gọi, có thể được lớp con kế thừa, ghi đè.
2. Method được sửa bằng `static`, cách dùng giống static method của class thông thường. Nhưng nó không thể được lớp con kế thừa, chỉ có thể dùng `Interface` để gọi.

Chúng ta xem một ví dụ thực tế.

```java
public interface InterfaceNew {
    static void sm() {
        System.out.println("interface提供的方式实现");
    }
    static void sm2() {
        System.out.println("interface提供的方式实现");
    }

    default void def() {
        System.out.println("interface default方法");
    }
    default void def2() {
        System.out.println("interface default2方法");
    }
    //须要实现类重写
    void f();
}

public interface InterfaceNew1 {
    default void def() {
        System.out.println("InterfaceNew1 default方法");
    }
}
```

Nếu có một class vừa implement interface `InterfaceNew` vừa implement interface `InterfaceNew1`, cả hai đều có `def()`, và interface `InterfaceNew` cùng interface `InterfaceNew1` không có mối quan hệ kế thừa, thì lúc này bắt buộc phải ghi đè `def()`. Nếu không, khi biên dịch sẽ báo lỗi.

```java
public class InterfaceNewImpl implements InterfaceNew , InterfaceNew1{
    public static void main(String[] args) {
        InterfaceNewImpl interfaceNew = new InterfaceNewImpl();
        interfaceNew.def();
    }

    @Override
    public void def() {
        InterfaceNew1.super.def();
    }

    @Override
    public void f() {
    }
}
```

**Trong Java 8, interface và abstract class khác nhau ở điểm nào?**

Nhiều bạn nghĩ rằng: "Vì interface cũng có thể có implementation method của riêng mình, có vẻ như không còn khác biệt nhiều so với abstract class."

Thực ra chúng vẫn có sự khác biệt

1. Sự khác biệt giữa interface và class, có vẻ là nói thừa, chủ yếu có:

   - Interface đa implementation, class đơn kế thừa
   - Instance method không có method body trong interface ẩn trở thành `public abstract`, field ẩn trở thành `public static final`; ngoài ra, interface còn có thể khai báo method `default`, `static`, v.v. Member của abstract class có thể dùng nhiều modifier hơn

2. Method của interface giống như một plugin mở rộng hơn. Còn method của abstract class là để kế thừa.

Đã đề cập từ đầu bài, interface bổ sung method sửa bằng `default` và `static`, để giải quyết vấn đề không tương thích giữa việc sửa đổi interface với implementation hiện có, không phải để thay thế `abstract class`. Khi sử dụng, chỗ nào nên dùng abstract class vẫn phải dùng abstract class, đừng vì tính năng mới của interface mà thay thế nó.

**Hãy nhớ interface vĩnh viễn khác với class.**

## functional interface (functional interface)

**Định nghĩa**: còn gọi là SAM interface, tức Single Abstract Method interface, là interface có đúng một abstract method, nhưng có thể có nhiều non-abstract method.

Trong java 8 có hẳn một package chứa functional interface là `java.util.function`, tất cả interface trong package này đều có annotation `@FunctionalInterface`, cung cấp functional programming.

Trong các package khác cũng có functional interface, một số không có annotation `@FunctionalInterface`, nhưng chỉ cần thỏa mãn định nghĩa functional interface là functional interface, không liên quan đến việc có annotation `@FunctionalInterface` hay không, annotation chỉ đóng vai trò ép buộc chuẩn hóa định nghĩa khi biên dịch. Nó được sử dụng rộng rãi trong Lambda expression.

## Lambda expression

Tiếp theo nói về Lambda expression nổi tiếng. Đây là tính năng mới quan trọng nhất thúc đẩy việc phát hành Java 8. Là thay đổi lớn nhất kể từ Generics (`Generics`) và Annotation (`Annotation`).

Sử dụng Lambda expression có thể làm cho code trở nên ngắn gọn, gọn gàng hơn. Giúp java cũng có thể hỗ trợ _functional programming_ đơn giản.

> Lambda expression là một anonymous function (hàm ẩn danh), java 8 cho phép truyền hàm làm tham số vào method.

### Cú pháp

```java
(parameters) -> expression 或
(parameters) ->{ statements; }
```

### Thực hành Lambda

Chúng ta dùng các ví dụ thường dùng để cảm nhận sự tiện lợi mà Lambda mang lại

#### Thay thế anonymous inner class

Trước đây cách duy nhất để truyền tham số động cho method là dùng inner class. Ví dụ

**1. Interface `Runnable`**

```java
new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("The runable now is using!");
            }
}).start();
//dùng lambda
new Thread(() -> System.out.println("It's a lambda function!")).start();
```

**2. Interface `Comparator`**

```java
List<Integer> strings = Arrays.asList(1, 2, 3);

Collections.sort(strings, new Comparator<Integer>() {
@Override
public int compare(Integer o1, Integer o2) {
    return Integer.compare(o1, o2);}
});

//Lambda
Collections.sort(strings, (Integer o1, Integer o2) -> Integer.compare(o1, o2));
//tách ra
Comparator<Integer> comparator = (Integer o1, Integer o2) -> Integer.compare(o1, o2);
Collections.sort(strings, comparator);
```

**3. Interface `Listener`**

```java
JButton button = new JButton();
button.addItemListener(new ItemListener() {
@Override
public void itemStateChanged(ItemEvent e) {
   e.getItem();
}
});
//lambda
button.addItemListener(e -> e.getItem());
```

**4. Interface tùy chỉnh**

3 ví dụ trên là những ví dụ phổ biến nhất trong quá trình phát triển của chúng ta, từ đó cũng có thể cảm nhận được sự tiện lợi và gọn gàng mà Lambda mang lại. Nó chỉ giữ lại code thực sự dùng đến, bỏ đi toàn bộ code vô dụng. Vậy nó có yêu cầu gì với interface không? Chúng ta phát hiện các anonymous inner class này chỉ ghi đè một method của interface, tất nhiên cũng chỉ có một method cần ghi đè. Đây chính là **functional interface** mà chúng ta nhắc đến ở trên, tức là chỉ cần tham số của method là functional interface thì đều có thể dùng Lambda expression.

```java
@FunctionalInterface
public interface Comparator<T>{
    int compare(T o1, T o2);
}

@FunctionalInterface
public interface Runnable{
    void run();
}
```

Chúng ta tự định nghĩa một functional interface

```java
@FunctionalInterface
public interface LambdaInterface {
 void f();
}
//Sử dụng
public class LambdaClass {
    public static void forEg() {
        lambdaInterfaceDemo(()-> System.out.println("自定义函数式接口"));
    }
    //Tham số functional interface
    static void lambdaInterfaceDemo(LambdaInterface i){
        i.f();
    }
}
```

#### Lặp collection

```java
void lamndaFor() {
        List<String> strings = Arrays.asList("1", "2", "3");
        //foreach truyền thống
        for (String s : strings) {
            System.out.println(s);
        }
        //Lambda foreach
        strings.forEach((s) -> System.out.println(s));
        //hoặc
        strings.forEach(System.out::println);
     //map
        Map<Integer, String> map = new HashMap<>();
        map.forEach((k,v)->System.out.println(v));
}
```

#### Method reference

Java 8 cho phép dùng từ khóa `::` để truyền method hoặc constructor reference, dù thế nào đi nữa, kiểu trả về của biểu thức phải là functional-interface.

```java
public class LambdaClassSuper {
    LambdaInterface sf(){
        return null;
    }
}

public class LambdaClass extends LambdaClassSuper {
    public static LambdaInterface staticF() {
        return null;
    }

    public LambdaInterface f() {
        return null;
    }

    void show() {
        //1. Gọi static function, kiểu trả về phải là functional-interface
        LambdaInterface t = LambdaClass::staticF;

        //2. Gọi instance method
        LambdaClass lambdaClass = new LambdaClass();
        LambdaInterface lambdaInterface = lambdaClass::f;

        //3. Gọi method trên superclass
        LambdaInterface superf = super::sf;

        //4. Gọi constructor
        LambdaInterface tt = LambdaClassSuper::new;
    }
}
```

#### Truy cập biến

```java
int i = 0;
Collections.sort(strings, (Integer o1, Integer o2) -> o1 - i);
//i =3;
```

Lambda expression có thể tham chiếu biến cục bộ bên ngoài, nhưng biến đó phải là `final` hoặc effectively final (sau khi khởi tạo không gán giá trị nữa). Compiler sẽ không tự động thêm modifier `final` cho biến.

## Stream

java bổ sung package `java.util.stream`, nó đại khái giống với stream trước đây. Trước đây tiếp xúc nhiều nhất là resource stream, ví dụ `java.io.FileInputStream`, thông qua stream đưa file từ nơi này đến nơi khác, nó chỉ là kẻ vận chuyển nội dung, không thực hiện thao tác _CRUD_ nào đối với nội dung file.

`Stream` vẫn không lưu trữ dữ liệu, điểm khác là nó có thể Retrieve (truy xuất) và xử lý logic dữ liệu trong collection, bao gồm lọc, sắp xếp, thống kê, đếm, v.v. Có thể hình dung nó như câu lệnh Sql.

Dữ liệu nguồn của nó có thể là `Collection`, `Array`, v.v. Vì tham số method của nó đều là kiểu functional interface, nên nói chung được dùng kết hợp với Lambda.

### Loại stream

1. stream ser全.createStream (stream nối tiếp)
2. parallelStream (stream song song), có thể thực thi đa luồng

### Các method thường dùng

Tiếp theo chúng ta xem các method thường dùng của `java.util.stream.Stream`

```java
/**
* Trả về một stream nối tiếp (serial stream)
*/
default Stream<E> stream()

/**
* Trả về một stream song song (parallel stream)
*/
default Stream<E> parallelStream()

/**
* Trả về stream của T
*/
public static<T> Stream<T> of(T t)

/**
* Trả về stream tuần tự có các phần tử là giá trị được chỉ định.
*/
public static<T> Stream<T> of(T... values) {
    return Arrays.stream(values);
}


/**
* Lọc, trả về stream bao gồm các phần tử của stream này khớp với predicate đã cho
*/
Stream<T> filter(Predicate<? super T> predicate);

/**
* Tất cả phần tử của stream này có khớp với predicate được cung cấp hay không.
*/
boolean allMatch(Predicate<? super T> predicate)

/**
* Có phần tử bất kỳ nào của stream này khớp với predicate được cung cấp hay không.
*/
boolean anyMatch(Predicate<? super T> predicate);

/**
* Trả về một Builder của Stream.
*/
public static<T> Builder<T> builder();

/**
* Dùng Collector quy nạp các phần tử của stream này
*/
<R, A> R collect(Collector<? super T, A, R> collector);

/**
 * Trả về số phần tử trong stream này.
*/
long count();

/**
* Trả về stream bao gồm các phần tử khác nhau của stream này (theo Object.equals(Object) ).
*/
Stream<T> distinct();

/**
 * Duyệt
*/
void forEach(Consumer<? super T> action);

/**
* Dùng để lấy stream có số lượng được chỉ định, độ dài cắt ngắn không vượt quá maxSize .
*/
Stream<T> limit(long maxSize);

/**
* Dùng để ánh xạ mỗi phần tử đến kết quả tương ứng
*/
<R> Stream<R> map(Function<? super T, ? extends R> mapper);

/**
* Sắp xếp theo Comparator được cung cấp.
*/
Stream<T> sorted(Comparator<? super T> comparator);

/**
* Bỏ đi n phần tử đầu tiên trong stream này, trả về stream mới bao gồm các phần tử còn lại.
*/
Stream<T> skip(long n);

/**
* Trả về một mảng bao gồm các phần tử của stream này.
*/
Object[] toArray();

/**
* Dùng hàm generator được cung cấp để trả về một mảng bao gồm các phần tử của stream này, để phân bổ mảng được trả về, cũng như bất kỳ mảng nào khác có thể cần thiết để phân vùng thực thi hoặc điều chỉnh kích thước.
*/
<A> A[] toArray(IntFunction<A[]> generator);

/**
* Hợp nhất stream
*/
public static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)
```

### Thực hành

Bài viết này liệt kê cách sử dụng các method tiêu biểu của `Stream`, nhiều cách sử dụng hơn vẫn phải xem Api.

```java
@Test
public void test() {
  List<String> strings = Arrays.asList("abc", "def", "gkh", "abc");
    //Trả về stream thỏa mãn điều kiện
    Stream<String> stringStream = strings.stream().filter(s -> "abc".equals(s));
    //Tính số lượng stream thỏa mãn điều kiện
    long count = stringStream.count();

    //forEach duyệt -> in phần tử
    strings.stream().forEach(System.out::println);

    //limit lấy stream có 1 phần tử
    Stream<String> limit = strings.stream().limit(1);
    //toArray ví dụ muốn xem limitStream này chứa gì, ví dụ chuyển thành String[], ví dụ lặp
    String[] array = limit.toArray(String[]::new);

    //map thực hiện thao tác trên mỗi phần tử trả về stream mới
    Stream<String> map = strings.stream().map(s -> s + "22");

    //sorted sắp xếp và in
    strings.stream().sorted().forEach(System.out::println);

    //Collectors collect đưa abc vào container
    List<String> collect = strings.stream().filter(string -> "abc".equals(string)).collect(Collectors.toList());
    //Chuyển list thành string, mỗi phần tử phân tách bằng dấu ,
    String mergedString = strings.stream().filter(string -> !string.isEmpty()).collect(Collectors.joining(","));

    //Thống kê mảng, ví dụ dùng
    List<Integer> number = Arrays.asList(1, 2, 5, 4);

    IntSummaryStatistics statistics = number.stream().mapToInt((x) -> x).summaryStatistics();
    System.out.println("列表中最大的数 : "+statistics.getMax());
    System.out.println("列表中最小的数 : "+statistics.getMin());
    System.out.println("平均数 : "+statistics.getAverage());
    System.out.println("所有数之和 : "+statistics.getSum());

    //concat hợp nhất stream
    List<String> strings2 = Arrays.asList("xyz", "jqx");
    Stream.concat(strings2.stream(),strings.stream()).count();

    //Lưu ý một Stream chỉ có thể thao tác một lần, không thể ngắt giữa chừng, nếu không sẽ báo lỗi.
    Stream stream = strings.stream();
    //Sử dụng lần đầu
    stream.limit(2);
    //Sử dụng lần hai
    stream.forEach(System.out::println);
    //Báo lỗi java.lang.IllegalStateException: stream has already been operated upon or closed

    //Có thể gọi liên tục trong cùng một pipeline
    strings.stream().limit(2).forEach(System.out::println);
}
```

### Thực thi trễ (lazy execution)

Khi thực thi method trả về `Stream`, không thực hiện ngay, mà chờ đến khi trả về method không phải `Stream` mới thực hiện. Vì lấy được `Stream` không thể dùng trực tiếp, mà cần xử lý thành kiểu thông thường. `Stream` ở đây có thể hình dung là binary stream (2 thứ hoàn toàn khác nhau), lấy được cũng không hiểu.

Chúng ta phân tích method `filter` dưới đây.

```java
@Test
public void laziness(){
  List<String> strings = Arrays.asList("abc", "def", "gkh", "abc");
  Stream<Integer> stream = strings.stream().filter(new Predicate() {
      @Override
      public boolean test(Object o) {
        System.out.println("Predicate.test 执行");
        return true;
        }
      });

   System.out.println("count 执行");
   stream.count();
}
/*-------Kết quả thực thi--------*/
count 执行
Predicate.test 执行
Predicate.test 执行
Predicate.test 执行
Predicate.test 执行
```

Theo thứ tự thực thi thì phải in 4 lần "`Predicate.test` 执行" trước, rồi mới in "`count` 执行". Kết quả thực tế lại ngược lại. Điều đó chứng tỏ method trong filter không thực thi ngay, mà đợi đến khi gọi method `count()` mới thực thi.

Trên đây đều là ví dụ stream nối tiếp. Parallel `parallelStream` khi sử dụng method giống với nối tiếp. Điểm khác chính là `parallelStream` có thể thực thi đa luồng, được dựa trên framework ForkJoin để thực hiện, có thời gian mọi người có thể tìm hiểu framework `ForkJoin` và `ForkJoinPool`. Ở đây có thể hiểu đơn giản nó được thực hiện thông qua thread pool, như vậy sẽ liên quan đến các vấn đề như thread-safe, tiêu hao thread. Dưới đây chúng ta thông qua code để trải nghiệm việc thực thi đa luồng của parallel stream.

```java
@Test
public void parallelStreamTest(){
   List<Integer> numbers = Arrays.asList(1, 2, 5, 4);
   numbers.parallelStream() .forEach(num->System.out.println(Thread.currentThread().getName()+">>"+num));
}
//Kết quả thực thi
main>>5
ForkJoinPool.commonPool-worker-2>>4
ForkJoinPool.commonPool-worker-11>>1
ForkJoinPool.commonPool-worker-9>>2
```

Từ kết quả chúng ta thấy, for-each dùng đến đa luồng.

### Tóm tắt

Từ source code và ví dụ, chúng ta có thể tổng kết ra một số đặc điểm của stream

1. Thông qua chaining programming (lập trình nối chuỗi) đơn giản, giúp nó có thể tiện lợi xử lý lại dữ liệu sau khi duyệt xử lý.
2. Tham số method đều là kiểu functional interface
3. Một Stream chỉ có thể thao tác một lần, thao tác xong là đóng, tiếp tục sử dụng stream này sẽ báo lỗi.
4. Stream không lưu dữ liệu, không thay đổi nguồn dữ liệu

## Optional

Trong [giới thiệu về Optional trong sổ tay phát triển của Alibaba](https://share.weiyun.com/ThuqEbD5) có viết như thế này:

> Phòng chống NPE là tu dưỡng cơ bản của lập trình viên, chú ý các kịch bản phát sinh NPE:
>
> 1. Kiểu trả về là kiểu dữ liệu cơ bản, khi return đối tượng kiểu wrapper, quá trình auto-unboxing có thể phát sinh NPE.
>
> Ví dụ ngược: public int f() { return 对象 Integer}, nếu là null, tự động mở khung (unbox) ném NPE.
>
> 2. Kết quả truy vấn database có thể là null.
> 3. Phần tử trong collection dù isNotEmpty, phần tử dữ liệu lấy ra cũng có thể là null.
> 4. Khi remote call trả về đối tượng, đều yêu cầu phán đoán null pointer, phòng chống NPE.
> 5. Đối với dữ liệu lấy từ Session, đề nghị kiểm tra NPE, tránh null pointer.
> 6. Gọi nối tiếp obj.getA().getB().getC()；một loạt câu gọi, dễ phát sinh NPE.
>
> Ví dụ đúng: dùng Optional class của JDK8 để phòng chống vấn đề NPE.

Ở đây đề xuất dùng `Optional` để biểu đạt tường minh "có thể không có kết quả", nhằm giảm bớt một phần rủi ro NPE (`java.lang.NullPointerException`). Optional hoặc chứa một giá trị không phải `null`, hoặc rỗng, không lưu `null` bên trong. Dưới đây chúng ta thông qua source code từng bước vén tấm màn `Optional`.

Giả sử có một class `Zoo`, bên trong có một thuộc tính `Dog`, yêu cầu lấy `age` của `Dog`.

```java
class Zoo {
   private Dog dog;
}

class Dog {
   private int age;
}
```

Cách giải quyết NPE truyền thống như sau:

```java
Zoo zoo = getZoo();
if(zoo != null){
   Dog dog = zoo.getDog();
   if(dog != null){
      int age = dog.getAge();
      System.out.println(age);
   }
}
```

Kiểm tra từng lớp đối tượng không rỗng, có người nói cách này xấu xí không thanh lịch, tôi không nghĩ vậy. Ngược lại cảm thấy rất gọn gàng, dễ đọc, dễ hiểu. Mọi người thấy sao?

`Optional` được thực hiện như thế này:

```java
Optional.ofNullable(zoo).map(o -> o.getDog()).map(d -> d.getAge()).ifPresent(age ->
    System.out.println(age)
);
```

Có phải ngắn gọn hơn nhiều không nhỉ?

### Cách tạo một Optional

Trong ví dụ trên, `Optional.ofNullable` là một trong những cách tạo Optional. Chúng ta xem trước ý nghĩa của nó và các method source code khác tạo Optional.

```java
/**
* Common instance for {@code empty()}. 全局EMPTY对象
*/
private static final Optional<?> EMPTY = new Optional<>();

/**
* Giá trị được Optional duy trì
*/
private final T value;

/**
* Nếu value là null thì trả về EMPTY, ngược lại trả về of(T)
*/
public static <T> Optional<T> ofNullable(T value) {
   return value == null ? empty() : of(value);
}
/**
* Trả về đối tượng EMPTY
*/
public static<T> Optional<T> empty() {
   Optional<T> t = (Optional<T>) EMPTY;
   return t;
}
/**
* Trả về đối tượng Optional
*/
public static <T> Optional<T> of(T value) {
    return new Optional<>(value);
}
/**
* Phương thức khởi tạo private, gán giá trị cho value
*/
private Optional(T value) {
  this.value = Objects.requireNonNull(value);
}
/**
* Vậy nên nếu value trong of(T value) là null, sẽ ném ra ngoại lệ NullPointerException, như vậy có vẻ không xử lý được vấn đề NPE
*/
public static <T> T requireNonNull(T obj) {
  if (obj == null)
         throw new NullPointerException();
  return obj;
}
```

Sự khác biệt chính giữa method `ofNullable` và method `of` là: khi value là `null`, `ofNullable` trả về Optional rỗng, còn `of` sẽ ném ra `NullPointerException`. Khi `null` biểu thị "không có giá trị" hợp lệ thì dùng `ofNullable`; khi tham số theo quy ước bắt buộc không được là `null` thì có thể dùng `of` để sớm phơi bày lỗi.

**`map()` và `flatMap()` khác nhau ở điểm gì?**

`map` và `flatMap` đều là áp dụng một hàm lên mỗi phần tử trong collection, nhưng điểm khác là `map` trả về một collection mới, `flatMap` là ánh xạ mỗi phần tử thành một collection, cuối cùng lại làm phẳng collection này.

Trong kịch bản ứng dụng thực tế, nếu `map` trả về mảng, thì cuối cùng nhận được là mảng hai chiều, dùng `flatMap` là để làm phẳng mảng hai chiều này thành mảng một chiều.

```java
public class MapAndFlatMapExample {
    public static void main(String[] args) {
        List<String[]> listOfArrays = Arrays.asList(
                new String[]{"apple", "banana", "cherry"},
                new String[]{"orange", "grape", "pear"},
                new String[]{"kiwi", "melon", "pineapple"}
        );

        List<String[]> mapResult = listOfArrays.stream()
                .map(array -> Arrays.stream(array).map(String::toUpperCase).toArray(String[]::new))
                .collect(Collectors.toList());

        System.out.println("Using map:");
        mapResult.forEach(arrays-> System.out.println(Arrays.toString(arrays)));

        List<String> flatMapResult = listOfArrays.stream()
                .flatMap(array -> Arrays.stream(array).map(String::toUpperCase))
                .collect(Collectors.toList());

        System.out.println("Using flatMap:");
        System.out.println(flatMapResult);
    }
}

```

Kết quả chạy:

```plain
Using map:
[[APPLE, BANANA, CHERRY], [ORANGE, GRAPE, PEAR], [KIWI, MELON, PINEAPPLE]]

Using flatMap:
[APPLE, BANANA, CHERRY, ORANGE, GRAPE, PEAR, KIWI, MELON, PINEAPPLE]
```

Cách hiểu đơn giản nhất là `flatMap()` có thể khai triển kết quả của `map()`.

Trong `Optional`, khi dùng `map()`, nếu hàm ánh xạ trả về một giá trị thông thường, nó sẽ gói giá trị này trong một `Optional` mới. Còn khi dùng `flatMap`, nếu hàm ánh xạ trả về một `Optional`, nó sẽ làm phẳng `Optional` được trả về này, không gói thành `Optional` lồng nhau nữa.

Dưới đây là một đoạn code ví dụ so sánh:

```java
public static void main(String[] args) {
        int userId = 1;

        // Code dùng flatMap
        String cityUsingFlatMap = getUserById(userId)
                .flatMap(OptionalExample::getAddressByUser)
                .map(Address::getCity)
                .orElse("Unknown");

        System.out.println("User's city using flatMap: " + cityUsingFlatMap);

        // Code không dùng flatMap
        Optional<Optional<Address>> optionalAddress = getUserById(userId)
                .map(OptionalExample::getAddressByUser);

        String cityWithoutFlatMap;
        if (optionalAddress.isPresent()) {
            Optional<Address> addressOptional = optionalAddress.get();
            if (addressOptional.isPresent()) {
                Address address = addressOptional.get();
                cityWithoutFlatMap = address.getCity();
            } else {
                cityWithoutFlatMap = "Unknown";
            }
        } else {
            cityWithoutFlatMap = "Unknown";
        }

        System.out.println("User's city without flatMap: " + cityWithoutFlatMap);
    }
```

Trong `Stream` và `Optional`, sử dụng đúng `flatMap` có thể giảm bớt rất nhiều code không cần thiết.

### Phán đoán value có phải null hay không

```java
/**
* value có phải null hay không
*/
public boolean isPresent() {
    return value != null;
}
/**
* Nếu value không null thì thực thi consumer.accept
*/
public void ifPresent(Consumer<? super T> consumer) {
   if (value != null)
    consumer.accept(value);
}
```

### Lấy value

```java
/**
* Return the value if present, otherwise invoke {@code other} and return
* the result of that invocation.
* Nếu value != null trả về value, ngược lại trả về kết quả thực thi của other
*/
public T orElseGet(Supplier<? extends T> other) {
    return value != null ? value : other.get();
}

/**
* Nếu value != null trả về value, ngược lại trả về T
*/
public T orElse(T other) {
    return value != null ? value : other;
}

/**
* Nếu value != null trả về value, ngược lại ném ra ngoại lệ do tham số trả về
*/
public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
}
/**
* value là null ném NoSuchElementException, không rỗng trả về value.
*/
public T get() {
  if (value == null) {
      throw new NoSuchElementException("No value present");
  }
  return value;
}
```

### Lọc giá trị

```java
/**
* 1. Nếu là empty trả về empty
* 2. predicate.test(value)==true trả về this, ngược lại trả về empty
*/
public Optional<T> filter(Predicate<? super T> predicate) {
        Objects.requireNonNull(predicate);
        if (!isPresent())
            return this;
        else
            return predicate.test(value) ? this : empty();
}
```

### Tóm tắt

Xem xong source code `Optional` có thể phát hiện, `of()` yêu cầu tham số không `null`, `get()` khi Optional rỗng ném ra là `NoSuchElementException`, còn `flatMap()` dùng để làm phẳng kết quả ánh xạ trả về Optional, không phải method nên tránh. Thông thường nên căn cứ theo việc giá trị có được phép thiếu hay không để chọn `of()` hoặc `ofNullable()`, và ưu tiên dùng các method như `orElse`, `orElseGet`, `orElseThrow` để xử lý giá trị rỗng. Cuối cùng tổng hợp dùng các method tần suất cao của `Optional`.

```java
Optional.ofNullable(zoo).map(o -> o.getDog()).map(d -> d.getAge()).filter(v->v==1).orElse(3);
```

## Date-Time API

Đây là bổ sung mạnh mẽ cho `java.util.Date`, giải quyết hầu hết các điểm yếu của class Date:

1. Không thread-safe
2. Xử lý timezone phiền phức
3. Các loại format, và tính toán thời gian rườm rà
4. Thiết kế có khiếm khuyết, class Date đồng thời chứa cả ngày và giờ; còn có java.sql.Date, dễ gây nhầm lẫn.

Chúng ta so sánh sự khác nhau giữa java.util.Date và Date mới thông qua các ví dụ thời gian thường dùng. Code dùng `java.util.Date` nên sửa đổi rồi.

### Các class chính của java.time

`java.util.Date` vừa chứa ngày vừa chứa giờ, còn `java.time` đã tách chúng ra

```java
LocalDateTime.class //ngày+giờ format: yyyy-MM-ddTHH:mm:ss.SSS
LocalDate.class //ngày format: yyyy-MM-dd
LocalTime.class //giờ format: HH:mm:ss
```

### Format

**Trước Java 8:**

```java
public void oldFormat(){
    Date now = new Date();
    //format yyyy-MM-dd
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    String date  = sdf.format(now);
    System.out.println(String.format("date format : %s", date));

    //format HH:mm:ss
    SimpleDateFormat sdft = new SimpleDateFormat("HH:mm:ss");
    String time = sdft.format(now);
    System.out.println(String.format("time format : %s", time));

    //format yyyy-MM-dd HH:mm:ss
    SimpleDateFormat sdfdt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String datetime = sdfdt.format(now);
    System.out.println(String.format("dateTime format : %s", datetime));
}
```

**Sau Java 8:**

```java
public void newFormat(){
    //format yyyy-MM-dd
    LocalDate date = LocalDate.now();
    System.out.println(String.format("date format : %s", date));

    //format HH:mm:ss
    LocalTime time = LocalTime.now().withNano(0);
    System.out.println(String.format("time format : %s", time));

    //format yyyy-MM-dd HH:mm:ss
    LocalDateTime dateTime = LocalDateTime.now();
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    String dateTimeStr = dateTime.format(dateTimeFormatter);
    System.out.println(String.format("dateTime format : %s", dateTimeStr));
}
```

### Chuyển chuỗi sang định dạng ngày

**Trước Java 8:**

```java
//Đã bị ngừng dùng
Date date = new Date("2021-01-26");
//Thay thế bằng
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
Date date1 = sdf.parse("2021-01-26");
```

**Sau Java 8:**

```java
LocalDate date = LocalDate.of(2021, 1, 26);
LocalDate.parse("2021-01-26");

LocalDateTime dateTime = LocalDateTime.of(2021, 1, 26, 12, 12, 22);
LocalDateTime.parse("2021-01-26T12:12:22");

LocalTime time = LocalTime.of(12, 12, 22);
LocalTime.parse("12:12:22");
```

**Trước Java 8** chuyển đổi đều cần nhờ đến class `SimpleDateFormat`, còn **sau Java 8** chỉ cần method `of` hoặc `parse` của `LocalDate`, `LocalTime`, `LocalDateTime`.

### Tính toán ngày

Dưới đây chỉ lấy ví dụ **ngày sau một tuần**, các đơn vị khác (năm, tháng, ngày, nửa ngày, giờ, v.v.) đại khái tương tự. Ngoài ra, các đơn vị này đều được định nghĩa trong enum _java.time.temporal.ChronoUnit_.

**Trước Java 8:**

```java
public void afterDay(){
     //Ngày sau một tuần
     SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
     Calendar ca = Calendar.getInstance();
     ca.add(Calendar.DATE, 7);
     Date d = ca.getTime();
     String after = formatDate.format(d);
     System.out.println("一周后日期：" + after);

   //Tính khoảng cách bao nhiêu ngày giữa hai ngày, cách tính khoảng cách bao nhiêu năm, bao nhiêu tháng tương tự
     String dates1 = "2021-12-23";
   String dates2 = "2021-02-26";
     SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
     Date date1 = format.parse(dates1);
     Date date2 = format.parse(dates2);
     int day = (int) ((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
     System.out.println(dates1 + "和" + dates2 + "相差" + day + "天");
     //Kết quả：2021-02-26和2021-12-23相差300天
}
```

**Sau Java 8:**

```java
public void pushWeek(){
     //Ngày sau một tuần
     LocalDate localDate = LocalDate.now();
     //Cách 1
     LocalDate after = localDate.plus(1, ChronoUnit.WEEKS);
     //Cách 2
     LocalDate after2 = localDate.plusWeeks(1);
     System.out.println("一周后日期：" + after);

     //Tính khoảng cách bao nhiêu ngày giữa hai ngày, tính khoảng cách bao nhiêu năm, bao nhiêu tháng
     LocalDate date1 = LocalDate.parse("2021-02-26");
     LocalDate date2 = LocalDate.parse("2021-12-23");
     Period period = Period.between(date1, date2);
     System.out.println("date1 到 date2 相隔："
                + period.getYears() + "年"
                + period.getMonths() + "月"
                + period.getDays() + "天");
   //Kết quả in ra là "date1 到 date2 相隔：0年9月27天"
     //Ở đây số ngày period.getDays() nhận được là số ngày trừ đi năm tháng, không phải tổng số ngày
     //Nếu muốn lấy tổng số ngày thuần túy nên dùng method dưới đây
     long day = date2.toEpochDay() - date1.toEpochDay();
     System.out.println(date1 + "和" + date2 + "相差" + day + "天");
     //Kết quả in ra：2021-02-26和2021-12-23相差300天
}
```

### Lấy ngày được chỉ định

Ngoài việc tính toán ngày rườm rà, việc lấy một ngày cụ thể cũng rất phiền phức, ví dụ lấy ngày cuối cùng, ngày đầu tiên của tháng này.

**Trước Java 8:**

```java
public void getDay() {

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        //Lấy ngày đầu tiên của tháng hiện tại：
        Calendar c = Calendar.getInstance();
        c.set(Calendar.DAY_OF_MONTH, 1);
        String first = format.format(c.getTime());
        System.out.println("first day:" + first);

        //Lấy ngày cuối cùng của tháng hiện tại
        Calendar ca = Calendar.getInstance();
        ca.set(Calendar.DAY_OF_MONTH, ca.getActualMaximum(Calendar.DAY_OF_MONTH));
        String last = format.format(ca.getTime());
        System.out.println("last day:" + last);

        //Ngày cuối cùng của năm hiện tại
        Calendar currCal = Calendar.getInstance();
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(Calendar.YEAR, currCal.get(Calendar.YEAR));
        calendar.roll(Calendar.DAY_OF_YEAR, -1);
        Date time = calendar.getTime();
        System.out.println("last day:" + format.format(time));
}
```

**Sau Java 8:**

```java
public void getDayNew() {
    LocalDate today = LocalDate.now();
    //Lấy ngày đầu tiên của tháng hiện tại：
    LocalDate firstDayOfThisMonth = today.with(TemporalAdjusters.firstDayOfMonth());
    // Lấy ngày cuối cùng của tháng này
    LocalDate lastDayOfThisMonth = today.with(TemporalAdjusters.lastDayOfMonth());
    //Lấy ngày kế tiếp：
    LocalDate nextDay = lastDayOfThisMonth.plusDays(1);
    //Ngày cuối cùng của năm hiện tại
    LocalDate lastday = today.with(TemporalAdjusters.lastDayOfYear());
    //Chủ nhật cuối cùng của năm 2021, nếu dùng Calendar thì chết vì phiền phức.
    LocalDate lastMondayOf2021 = LocalDate.parse("2021-12-31").with(TemporalAdjusters.lastInMonth(DayOfWeek.SUNDAY));
}
```

Trong `java.time.temporal.TemporalAdjusters` còn có rất nhiều algorithm tiện lợi, ở đây không đưa mọi người xem Api nữa, đều rất đơn giản, xem là hiểu ngay.

### JDBC và java8

Hiện tại mối quan hệ tương ứng giữa kiểu thời gian jdbc và kiểu thời gian java8 là

1. `Date` ---> `LocalDate`
2. `Time` ---> `LocalTime`
3. `Timestamp` ---> `LocalDateTime`

Trước JDBC 4.2, thường dùng `java.sql.Date`, `java.sql.Time` và `java.sql.Timestamp` để biểu diễn các kiểu thời gian SQL này.

### Múi giờ

> Múi giờ: phân chia múi giờ chính thức là cứ mỗi 15° kinh độ chia một múi giờ, toàn cầu có 24 múi giờ, mỗi múi giờ chênh nhau 1 giờ. Nhưng để thuận tiện cho hành chính, thường gộp 1 quốc gia hoặc 1 tỉnh vào cùng nhau, ví dụ nước ta diện tích rộng lớn, trải dài khoảng 5 múi giờ, trên thực tế chỉ dùng chuẩn giờ của múi giờ thứ 8 phía Đông tức giờ Bắc Kinh làm chuẩn.

Đối tượng `java.util.Date` thực chất lưu số mili giây đã trôi qua từ 0 giờ ngày 1 tháng 1 năm 1970 (GMT) đến thời điểm mà đối tượng Date biểu diễn. Tức là dù new Date ở múi giờ nào, số mili giây nó ghi lại đều giống nhau, không liên quan đến múi giờ. Nhưng khi sử dụng nên chuyển nó thành giờ địa phương, điều này liên quan đến việc quốc tế hóa thời gian. `java.util.Date` bản thân không hỗ trợ quốc tế hóa, cần nhờ đến `TimeZone`.

```java
//Giờ Bắc Kinh：Wed Jan 27 14:05:29 CST 2021
Date date = new Date();

SimpleDateFormat bjSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//Múi giờ Bắc Kinh
bjSdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
System.out.println("毫秒数:" + date.getTime() + ", 北京时间:" + bjSdf.format(date));

//Múi giờ Tokyo
SimpleDateFormat tokyoSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
tokyoSdf.setTimeZone(TimeZone.getTimeZone("Asia/Tokyo"));  // set múi giờ Tokyo
System.out.println("毫秒数:" + date.getTime() + ", 东京时间:" + tokyoSdf.format(date));

//Nếu print trực tiếp sẽ tự động chuyển thành giờ của múi giờ hiện tại
System.out.println(date);
//Wed Jan 27 14:05:29 CST 2021
```

Trong tính năng mới đã giới thiệu `java.time.ZonedDateTime` để biểu diễn thời gian kèm múi giờ. Có thể xem nó như là `LocalDateTime + ZoneId`.

```java
//Giờ của múi giờ hiện tại
ZonedDateTime zonedDateTime = ZonedDateTime.now();
System.out.println("当前时区时间: " + zonedDateTime);

//Giờ Tokyo
ZoneId zoneId = ZoneId.of(ZoneId.SHORT_IDS.get("JST"));
ZonedDateTime tokyoTime = zonedDateTime.withZoneSameInstant(zoneId);
System.out.println("东京时间: " + tokyoTime);

// ZonedDateTime chuyển LocalDateTime
LocalDateTime localDateTime = tokyoTime.toLocalDateTime();
System.out.println("东京时间转当地时间: " + localDateTime);

//LocalDateTime chuyển ZonedDateTime
ZonedDateTime localZoned = localDateTime.atZone(ZoneId.systemDefault());
System.out.println("本地时区时间: " + localZoned);

//Kết quả in ra
当前时区时间: 2021-01-27T14:43:58.735+08:00[Asia/Shanghai]
东京时间: 2021-01-27T15:43:58.735+09:00[Asia/Tokyo]
东京时间转当地时间: 2021-01-27T15:43:58.735
当地时区时间: 2021-01-27T15:43:58.735+08:00[Asia/Shanghai]
```

### Tóm tắt

Thông qua việc so sánh sự khác biệt giữa `Date` mới và cũ ở trên, tất nhiên chỉ liệt kê một phần khác biệt về mặt chức năng, nhiều chức năng hơn vẫn phải tự mình khám phá. Tóm lại date-time-api mang lại lợi ích cho các thao tác ngày. Trong công việc hằng ngày gặp các thao tác kiểu date, ưu tiên hàng đầu nghĩ đến date-time-api, thực sự không giải quyết được mới nghĩ đến Date cũ.

## Tổng kết

Các tính năng mới của java 8 mà chúng ta tổng kết sắp xếp có

- Interface & functional interface
- Lambda
- Stream
- Optional
- Date time-api

Đây đều là những tính năng khá thường dùng trong phát triển. Tổng kết lại phát hiện chúng thật tuyệt, mà tôi lại không áp dụng sớm hơn. Luôn cảm thấy học tính năng mới của java 8 khá phiền phức, vẫn dùng cách thực hiện cũ. Kỳ thực những tính năng mới này vài ngày là nắm được, một khi đã nắm được, hiệu quả sẽ tăng lên rất nhiều. Kỳ thực chúng ta tăng lương cũng là tăng tiền học, không học rốt cuộc sẽ bị đào thải, khủng hoảng tuổi 35 sẽ đến sớm hơn.

<!-- @include: @article-footer.snippet.md -->
