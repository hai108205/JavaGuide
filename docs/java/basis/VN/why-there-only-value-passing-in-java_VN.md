---
title: Java truyền tham trị (pass-by-value) chi tiết
description: Giải thích chi tiết tại sao Java chỉ có truyền tham trị: phân tích cơ chế truyền tham số trong Java qua các ví dụ, làm rõ các hiểu lầm phổ biến về truyền tham trị và truyền tham chiếu, hiểu bản chất khác biệt giữa tham số thực và tham số hình thức.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java值传递,引用传递,参数传递,形参实参,对象引用,方法调用,Java传参机制
---

Trước khi bắt đầu, chúng ta hãy cùng làm rõ hai khái niệm sau:

- Tham số thực (Arguments) & Tham số hình thức (Parameters)
- Truyền tham trị (Pass-by-value) & Truyền tham chiếu (Pass-by-reference)

## Tham số thực & Tham số hình thức

Khai báo phương thức có thể sử dụng **tham số** (phương thức có tham số), tham số trong ngôn ngữ lập trình được chia thành:

- **Tham số thực (Arguments)**: dùng để truyền vào hàm/phương thức, phải có giá trị xác định.
- **Tham số hình thức (Parameters)**: dùng để định nghĩa hàm/phương thức, nhận tham số thực, không cần có giá trị xác định.

```java
String hello = "Hello!";
// hello là tham số thực
sayHello(hello);
// str là tham số hình thức
void sayHello(String str) {
    System.out.println(str);
}
```

## Truyền tham trị & Truyền tham chiếu

Ngôn ngữ lập trình truyền tham số thực vào phương thức (hoặc hàm) theo hai cách:

- **Truyền tham trị (Pass-by-value)**: phương thức nhận bản sao của giá trị tham số thực, sẽ tạo ra một bản sao.
- **Truyền tham chiếu (Pass-by-reference)**: phương thức nhận trực tiếp địa chỉ của tham số thực chứ không phải giá trị của tham số thực, đây chính là con trỏ. Lúc này tham số hình thức chính là tham số thực, bất kỳ thay đổi nào trên tham số hình thức đều ảnh hưởng đến tham số thực, bao gồm cả việc gán lại.

Nhiều ngôn ngữ lập trình (như C++, Pascal) cung cấp cả hai cách truyền tham số, tuy nhiên trong Java chỉ có truyền tham trị.

## Tại sao Java chỉ có truyền tham trị?

**Tại sao nói Java chỉ có truyền tham trị?** Không cần dài dòng, tôi sẽ chứng minh qua 3 ví dụ.

### Ví dụ 1: Truyền tham số kiểu nguyên thủy

Code:

```java
public static void main(String[] args) {
    int num1 = 10;
    int num2 = 20;
    swap(num1, num2);
    System.out.println("num1 = " + num1);
    System.out.println("num2 = " + num2);
}

public static void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    System.out.println("a = " + a);
    System.out.println("b = " + b);
}
```

Output:

```plain
a = 20
b = 10
num1 = 10
num2 = 20
```

Phân tích:

Trong phương thức `swap()`, việc hoán đổi giá trị của `a` và `b` không ảnh hưởng đến `num1` và `num2`. Bởi vì giá trị của `a` và `b` chỉ là bản sao từ `num1` và `num2`. Nói cách khác, `a` và `b` tương đương với bản sao của `num1` và `num2`, nội dung bản sao có thay đổi thế nào cũng không ảnh hưởng đến bản gốc.

![](https://oss.javaguide.cn/github/javaguide/java/basis/java-value-passing-01.png)

Qua ví dụ trên, chúng ta đã biết một phương thức không thể sửa đổi tham số kiểu dữ liệu nguyên thủy, còn tham chiếu đối tượng (object reference) làm tham số thì lại khác, hãy xem ví dụ 2.

### Ví dụ 2: Truyền tham số kiểu tham chiếu 1

Code:

```java
  public static void main(String[] args) {
      int[] arr = { 1, 2, 3, 4, 5 };
      System.out.println(arr[0]);
      change(arr);
      System.out.println(arr[0]);
  }

  public static void change(int[] array) {
      // Đổi phần tử đầu tiên của mảng thành 0
      array[0] = 0;
  }
```

Output:

```plain
1
0
```

Phân tích:

![](https://oss.javaguide.cn/github/javaguide/java/basis/java-value-passing-02.png)

Xem ví dụ này, nhiều người chắc chắn sẽ nghĩ Java dùng truyền tham chiếu cho tham số kiểu tham chiếu.

Thực ra không phải vậy, thứ được truyền ở đây vẫn là giá trị, tuy nhiên giá trị này là bản sao của tham chiếu đối tượng.

Nói cách khác, tham số của phương thức `change` sao chép giá trị tham chiếu được lưu trong `arr`, do đó tham số hình thức và `arr` cùng trỏ đến một đối tượng mảng. Điều này giải thích tại sao việc sửa đổi nội dung mảng thông qua tham số hình thức có thể được bên gọi quan sát thấy.

Để phản bác mạnh mẽ hơn rằng Java không dùng truyền tham chiếu cho tham số kiểu tham chiếu, chúng ta hãy xem ví dụ sau!

### Ví dụ 3: Truyền tham số kiểu tham chiếu 2

```java
public class Person {
    private String name;
   // Bỏ qua constructor, Getter & Setter
}

public static void main(String[] args) {
    Person xiaoZhang = new Person("小张");
    Person xiaoLi = new Person("小李");
    swap(xiaoZhang, xiaoLi);
    System.out.println("xiaoZhang:" + xiaoZhang.getName());
    System.out.println("xiaoLi:" + xiaoLi.getName());
}

public static void swap(Person person1, Person person2) {
    Person temp = person1;
    person1 = person2;
    person2 = temp;
    System.out.println("person1:" + person1.getName());
    System.out.println("person2:" + person2.getName());
}
```

Output:

```plain
person1:小李
person2:小张
xiaoZhang:小张
xiaoLi:小李
```

Phân tích:

Chuyện gì thế này??? Hoán đổi hai tham số hình thức kiểu tham chiếu không hề ảnh hưởng đến tham số thực!

Tham số `person1` và `person2` của phương thức `swap` chỉ sao chép giá trị tham chiếu được lưu trong tham số thực `xiaoZhang` và `xiaoLi`. Do đó, hoán đổi `person1` và `person2` chỉ là hoán đổi bản sao tham chiếu mà mỗi tham số hình thức lưu giữ, không hề thay đổi giá trị của biến `xiaoZhang` và `xiaoLi` ở bên gọi.

![](https://oss.javaguide.cn/github/javaguide/java/basis/java-value-passing-03.png)

## Truyền tham chiếu trông như thế nào?

Đến đây, tôi tin bạn đã biết trong Java chỉ có truyền tham trị, không có truyền tham chiếu.
Nhưng rốt cuộc truyền tham chiếu trông ra sao? Dưới đây lấy code `C++` làm ví dụ để bạn thấy bộ mặt thật của truyền tham chiếu.

```C++
#include <iostream>

void incr(int& num)
{
    std::cout << "incr before: " << num << "\n";
    num++;
    std::cout << "incr after: " << num << "\n";
}

int main()
{
    int age = 10;
    std::cout << "invoke before: " << age << "\n";
    incr(age);
    std::cout << "invoke after: " << age << "\n";
}
```

Kết quả:

```plain
invoke before: 10
incr before: 10
incr after: 11
invoke after: 11
```

Phân tích: Có thể thấy, trong hàm `incr`, việc sửa đổi tham số hình thức có thể ảnh hưởng đến giá trị của tham số thực. Lưu ý: tham số hình thức của `incr` ở đây dùng kiểu dữ liệu `int&` mới là truyền tham chiếu, nếu dùng `int` thì vẫn là truyền tham trị nhé!

## Tại sao Java không đưa truyền tham chiếu vào?

Truyền tham chiếu có vẻ rất tốt, có thể sửa trực tiếp giá trị tham số thực trong phương thức, nhưng tại sao Java không đưa truyền tham chiếu vào?

**Lưu ý: Dưới đây là quan điểm cá nhân, không đến từ Java chính thức:**

1. Vì lý do bảo mật, các thao tác bên trong phương thức đối với giá trị đều không được biết bởi bên gọi (định nghĩa phương thức là interface, bên gọi không quan tâm đến triển khai cụ thể). Bạn hãy thử tưởng tượng, nếu cầm thẻ ngân hàng đi rút tiền, rút 100 nhưng bị trừ 200, thật đáng sợ phải không.
2. Cha đẻ của Java - James Gosling ngay từ đầu đã nhìn thấy nhiều hạn chế của C và C++, vì vậy ông muốn thiết kế một ngôn ngữ mới - Java. Khi thiết kế Java, ông tuân theo nguyên tắc đơn giản dễ dùng, loại bỏ nhiều "tính năng" mà lập trình viên dễ mắc lỗi nếu không cẩn thận, những thứ trong ngôn ngữ ít đi, lập trình viên cũng ít thứ phải học hơn.

## Tổng kết

Trong Java, cách truyền tham số thực vào phương thức (hoặc hàm) là **truyền tham trị**:

- Nếu tham số là kiểu nguyên thủy, rất đơn giản, thứ được truyền là bản sao của giá trị hằng (literal) của kiểu nguyên thủy, sẽ tạo ra một bản sao.
- Nếu tham số là kiểu tham chiếu, thứ được truyền là bản sao của giá trị tham chiếu. Tham số hình thức và tham số thực ban đầu cùng trỏ đến một đối tượng, nhưng gán lại cho tham số hình thức sẽ không làm thay đổi biến tham số thực.

## Tham khảo

- 《Java 核心技术卷 Ⅰ》基础知识第十版第四章 4.5 小节
- [Java 到底是值传递还是引用传递？ - Hollis 的回答 - 知乎](https://www.zhihu.com/question/31203609/answer/576030121)
- [Oracle Java Tutorials - Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html)
- [Interview with James Gosling, Father of Java](https://mappingthejourney.com/single-post/2017/06/29/episode-3-interview-with-james-gosling-father-of-java/)

<!-- @include: @article-footer.snippet.md -->