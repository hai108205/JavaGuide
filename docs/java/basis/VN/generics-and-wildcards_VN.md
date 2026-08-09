---
title: Generics & Wildcards chi tiết
description: Phân tích toàn diện Java Generics và Wildcards - hiểu sâu về cơ chế Type Erasure, cách dùng upper-bound và lower-bound wildcard, nguyên tắc PECS, nắm vững kỹ thuật lập trình generics.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java泛型,通配符,类型擦除,泛型边界,PECS原则,泛型方法,上界下界通配符,泛型接口
---

## Generics

### Generics là gì? Có tác dụng gì?

**Java Generics (Generics)** là một tính năng mới được giới thiệu từ JDK 5. Sử dụng tham số generics giúp tăng cường khả năng đọc và độ ổn định của code. **Trừ khi có ghi chú riêng, các hành vi dưới đây dựa trên Java 8.**

Trình biên dịch có thể kiểm tra tham số generics và thông qua tham số generics có thể chỉ định kiểu đối tượng được truyền vào. Ví dụ `ArrayList<Person> persons = new ArrayList<Person>()` chỉ định rằng `ArrayList` này chỉ có thể nhận đối tượng kiểu `Person`, nếu truyền kiểu khác sẽ báo lỗi (từ JDK 7 có thể viết `new ArrayList<>()`, trình biên dịch sẽ tự suy luận tham số kiểu).

```java
ArrayList<E> extends AbstractList<E>
```

Ngoài ra, `List` nguyên thủy (raw type) trả về kiểu `Object`, cần ép kiểu thủ công mới sử dụng được, còn khi dùng generics trình biên dịch sẽ tự động chuyển đổi kiểu.

### Có những cách sử dụng generics nào?

Generics thường có ba cách sử dụng: **Generic Class**, **Generic Interface**, **Generic Method**.

**1. Generic Class**:

```java
//T ở đây có thể viết tùy ý thành bất kỳ định danh nào, các tham số dạng T, E, K, V thường được dùng để biểu thị generics
//Khi khởi tạo generic class, phải chỉ định kiểu cụ thể của T
public class Generic<T>{

    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey(){
        return key;
    }
}
```

Cách khởi tạo generic class:

```java
Generic<Integer> genericInteger = new Generic<Integer>(123456);
// Từ JDK 7 có thể viết: new Generic<>(123456)
```

**2. Generic Interface**:

```java
public interface Generator<T> {
    public T method();
}
```

Triển khai generic interface, không chỉ định kiểu:

```java
class GeneratorImpl<T> implements Generator<T>{
    @Override
    public T method() {
        return null;
    }
}
```

Triển khai generic interface, chỉ định kiểu:

```java
class GeneratorImpl implements Generator<String> {
    @Override
    public String method() {
        return "hello";
    }
}
```

**3. Generic Method**:

```java
   public static < E > void printArray( E[] inputArray )
   {
         for ( E element : inputArray ){
            System.out.printf( "%s ", element );
         }
         System.out.println();
    }
```

Sử dụng:

```java
// Tạo mảng các kiểu khác nhau: Integer, Double và Character
Integer[] intArray = { 1, 2, 3 };
String[] stringArray = { "Hello", "World" };
printArray( intArray  );
printArray( stringArray  );
```

### Generics được dùng ở đâu trong dự án?

- Interface trả về kết quả chung tùy chỉnh `CommonResult<T>` thông qua tham số `T` có thể chỉ định động kiểu dữ liệu trả về dựa trên kiểu kết quả cụ thể
- Định nghĩa lớp xử lý `Excel` `ExcelUtil<T>` dùng để chỉ định động kiểu dữ liệu xuất `Excel`
- Xây dựng lớp tiện ích collection (tham khảo các phương thức `sort`, `binarySearch` trong `Collections`).
- ……

### Cơ chế Type Erasure là gì? Tại sao cần erasure?

**Java Generics được triển khai thông qua Type Erasure: instance generics không giữ lại tham số kiểu cụ thể trong runtime, nhưng file class vẫn có thể giữ lại thông tin khai báo generics trong các thuộc tính như `Signature` và có thể đọc được thông qua reflection API.**

Trình biên dịch trong quá trình biên dịch sẽ động xóa (erase) generics `T` thành `Object` hoặc xóa `T extends xxx` thành kiểu giới hạn `xxx` tương ứng.

Type Erasure cho phép code generics tương thích với các thư viện Java và code nhị phân có từ trước khi generics ra đời. Trình biên dịch sẽ duy trì type safety và ngữ nghĩa đa hình thông qua các phép ép kiểu và bridge method cần thiết.

Phần giải thích trên có thể hơi trừu tượng, tôi lấy một ví dụ:

```java
List<Integer> list = new ArrayList<>();

list.add(12);
//1. Thêm trực tiếp trong thời gian biên dịch sẽ báo lỗi
list.add("a");
Class<? extends List> clazz = list.getClass();
Method add = clazz.getDeclaredMethod("add", Object.class);
//2. Trong runtime thêm qua reflection thì được
add.invoke(list, "kl");

System.out.println(list)
```

Thêm một ví dụ nữa: do vấn đề type erasure, việc overload method dưới đây sẽ báo lỗi.

```java
public void print(List<String> list)  { }
public void print(List<Integer> list) { }
```

![Vấn đề type erasure của generics](https://oss.javaguide.cn/github/javaguide/java/basis/generics-runtime-erasure.png)

Lý do cũng rất đơn giản, sau khi type erasure, `List<String>` và `List<Integer>` sau khi biên dịch đều trở thành `List`.

**Trình biên dịch đã xóa generics, vậy tại sao còn dùng generics? Dùng Object thay thế không được sao?**

Câu hỏi này thực chất đang khảo sát gián tiếp tác dụng của generics:

- Dùng generics có thể kiểm tra kiểu trong thời gian biên dịch.

- Dùng `Object` cần thêm ép kiểu thủ công, làm giảm khả năng đọc code, tăng xác suất lỗi.

- Generics có thể sử dụng self-bounded type như `T extends Comparable`.

### Bridge Method là gì?

Bridge Method (`Bridge Method`) được dùng để đảm bảo tính đa hình khi kế thừa generic class.

```java
class Node<T> {
    public T data;
    public Node(T data) { this.data = data; }
    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

  	// Node<T> sau khi type erasure trở thành setData(Object data), nhưng lớp con MyNode không ghi đè phương thức đó, nên trình biên dịch sẽ thêm bridge method này để đảm bảo tính đa hình
   	public void setData(Object data) {
        setData((Integer) data);
    }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}
```

⚠️**Lưu ý**: Bridge method do trình biên dịch tự động sinh ra, không phải viết tay.

### Generics có những hạn chế gì? Tại sao?

Các hạn chế của generics thường do cơ chế type erasure gây ra. Sau khi erase thành `Object` thì không thể phán đoán kiểu.

- Có thể khai báo biến kiểu `T`, nhưng không thể trực tiếp khởi tạo tham số kiểu qua `new T()`.
- Tham số generics không thể là kiểu nguyên thủy (primitive type). Vì kiểu nguyên thủy không phải lớp con của `Object`, nên dùng kiểu tham chiếu (reference type) tương ứng thay thế.
- Không thể khởi tạo mảng của tham số generics. Sau khi erase thành `Object` thì không thể phán đoán kiểu.
- Không thể khởi tạo mảng generics.
- Generics không thể dùng `instanceof` để kiểm tra runtime đối với tham số kiểu T; `getClass()` sau khi erase cũng không thể phân biệt các tham số generics khác nhau (ví dụ `List<String>` và `List<Integer>` đều nhận được `List.class`).
- Không thể triển khai cùng một interface với hai tham số generics khác nhau, sau khi erase các bridge method của nhiều lớp cha sẽ xung đột.
- Ngữ cảnh `static` của class không thể tham chiếu đến tham số kiểu được khai báo trong class đó, nhưng static generic method có thể khai báo và sử dụng tham số kiểu của riêng nó.
- ……

### Đoạn code sau có biên dịch được không, tại sao?

```java
public final class Algorithm {
    public static <T> T max(T x, T y) {
        return x > y ? x : y;
    }
}
```

Không thể biên dịch, vì x và y đều sẽ bị erase thành kiểu `Object`, `Object` không thể dùng `>` để so sánh.

```java
public class Singleton<T> {

    public static T getInstance() {
        if (instance == null)
            instance = new Singleton<T>();

        return instance;
    }

    private static T instance = null;
}
```

Không thể biên dịch, vì static field và static method của class không thể tham chiếu đến tham số kiểu `T` được khai báo trong class. Static method có thể khai báo tham số kiểu của riêng nó, ví dụ `public static <T> T getInstance()`.

## Wildcard

### Wildcard là gì? Có tác dụng gì?

Kiểu generics là cố định, trong một số tình huống sử dụng không được linh hoạt lắm, thế là wildcard ra đời! Wildcard cho phép tham số kiểu thay đổi, dùng để giải quyết vấn đề generics không thể covariance.

Ví dụ:

```java
// Giới hạn kiểu là lớp con của Person
<? extends Person>
// Giới hạn kiểu là lớp cha của Manager
<? super Manager>
```

### Wildcard `?` và generics `T` thường dùng khác nhau thế nào?

- `T` có thể dùng để khai báo biến hoặc hằng số còn `?` thì không.
- `T` thường dùng để khai báo generic class hoặc method, wildcard `?` thường dùng cho code gọi generic method và tham số hình thức.
- `T` trong thời gian biên dịch sẽ bị erase thành kiểu giới hạn hoặc `Object`. Wildcard `?` trong nội bộ method sẽ bị trình biên dịch "capture" thành một kiểu cụ thể nhưng chưa biết (capture), do đó không thể ghi phần tử nào ngoài `null` vào `List<?>`, nhưng có thể kết hợp với generic method để sử dụng.

### Unbounded Wildcard là gì?

Unbounded Wildcard có thể nhận bất kỳ dữ liệu kiểu generics nào, dùng để triển khai các method đơn giản không phụ thuộc vào tham số kiểu cụ thể, có thể capture tham số kiểu và giao cho generic method xử lý.

```java
void testMethod(Person<?> p) {
  // Generic method tự xử lý
}
```

**`List<?>` và `List` có khác nhau không?** Tất nhiên là có!

- `List<?> list` biểu thị kiểu phần tử của `list` là **một kiểu chưa biết nhưng cố định** (tức là "tồn tại một kiểu `T` nào đó, list là `List<T>`"), do đó trình biên dịch không cho phép thêm bất kỳ phần tử nào ngoài `null` vào, để tránh mất type safety.
- `List list` là raw type, sẽ bỏ qua một phần kiểm tra kiểu generics, không tương đương với `List<Object>`. Thêm phần tử vào raw type thường sinh ra cảnh báo unchecked và có thể đẩy lỗi kiểu sang runtime.

```java
List<?> list = new ArrayList<>();
list.add("sss");//báo lỗi
List list2 = new ArrayList<>();
list2.add("sss");//cảnh báo
```

### Upper-Bounded Wildcard là gì? Lower-Bounded Wildcard là gì?

Khi sử dụng generics, chúng ta còn có thể giới hạn biên trên và biên dưới cho tham số kiểu generics được truyền vào, ví dụ: **tham số kiểu chỉ được phép truyền vào kiểu cha hoặc kiểu con của một kiểu nào đó**.

**Upper-Bounded Wildcard `extends`** biểu thị tham số kiểu phải là kiểu được chỉ định hoặc kiểu con của nó.

Ví dụ:

```java
// Giới hạn phải là lớp con của Person
<? extends Person>
```

Có thể đặt nhiều biên kiểu, còn có thể giới hạn kiểu `T`.

```java
<T extends T1 & T2>
<T extends XXX>
```

**Lower-Bounded Wildcard `super`** biểu thị tham số kiểu phải là kiểu được chỉ định hoặc kiểu cha của nó.

Ví dụ:

```java
//  Giới hạn phải là lớp cha của Employee
List<? super Employee>
```

**`? extends xxx` và `? super xxx` khác nhau thế nào?**

Phạm vi nhận tham số kiểu của hai loại này khác nhau. Đối với `List<? extends Xxx>`, có thể đọc ra dưới dạng `Xxx`, nhưng ngoài `null` ra thì không thể ghi vào một cách an toàn; đối với `List<? super Xxx>`, có thể ghi `Xxx` và kiểu con của nó, kết quả đọc ra chỉ có thể coi an toàn là `Object`.

**Nguyên tắc PECS (Producer Extends, Consumer Super)**: khi **lấy** phần tử từ cấu trúc dữ liệu thì dùng `extends` (Producer - nhà sản xuất); khi **ghi** phần tử vào cấu trúc dữ liệu thì dùng `super` (Consumer - người tiêu thụ). Ví dụ: `List<? extends Number>` chỉ có thể đọc `Number` từ đó, không thể ghi vào; `List<? super Integer>` có thể ghi `Integer` và lớp con của nó, khi đọc ra thì nhận được `Object`. `Collections.copy(List<? super T> dest, List<? extends T> src)` chính là cách dùng điển hình: đọc từ `src`, ghi vào `dest`.

**`T extends xxx` và `? extends xxx` khác nhau thế nào?**

`T extends xxx` dùng để khai báo tham số kiểu có upper bound, sau khi erase thành `xxx`; `? extends xxx` dùng cho tham số wildcard trong kiểu được tham số hóa, có thể xuất hiện ở các vị trí như field, biến cục bộ, tham số method và kiểu trả về.

**`Class<?>` và `Class` khác nhau thế nào?**

Dùng trực tiếp `Class` sẽ có cảnh báo kiểu, dùng `Class<?>` thì không, vì `Class` là một generic class, nhận raw type sẽ sinh ra cảnh báo.

### Đoạn code sau có biên dịch được không, tại sao?

```java
class Shape { /* ... */ }
class Circle extends Shape { /* ... */ }
class Rectangle extends Shape { /* ... */ }

class Node<T> { /* ... */ }

Node<Circle> nc = new Node<>();
Node<Shape>  ns = nc;
```

Không thể, vì `Node<Circle>` không phải là lớp con của `Node<Shape>`.

```java
class Shape { /* ... */ }
class Circle extends Shape { /* ... */ }
class Rectangle extends Shape { /* ... */ }

class Node<T> { /* ... */ }
class ChildNode<T> extends Node<T>{

}
ChildNode<Circle> nc = new ChildNode<>();
Node<Circle>  ns = nc;
```

Có thể biên dịch, `ChildNode<Circle>` là lớp con của `Node<Circle>`.

```java
public static void print(List<? extends Number> list) {
    for (Number n : list)
        System.out.print(n + " ");
    System.out.println();
}
```

Có thể biên dịch, `List<? extends Number>` có thể lấy phần tử ra, nhưng không thể gọi `add()` để thêm phần tử.

## Tham khảo

- Java official documentation: https://docs.oracle.com/javase/tutorial/java/generics/index.html
- Java basic - hiểu rõ generics trong một bài viết: https://www.cnblogs.com/XiiX/p/14719568.html