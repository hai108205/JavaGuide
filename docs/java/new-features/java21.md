---
title: Tổng quan các tính năng mới Java 21 (Quan trọng)
description: Tổng quan các tính năng mới quan trọng của JDK 21 và tác động thực tiễn, tập trung vào string template, Sequenced Collections, generational ZGC, virtual thread...
category: Java
tag:
  - Java新特性
head:
  - - meta
    - name: keywords
      content: Java 21,JDK21,LTS,字符串模板,Sequenced Collections,分代 ZGC,记录模式,switch 模式匹配,虚拟线程,外部函数与内存 API
---

JDK 21 được phát hành vào ngày 19 tháng 9 năm 2023, đây là một phiên bản rất quan trọng, mang tính mốc son.

JDK 21 là LTS (Long-Term Support). Các phiên bản LTS hiện tại mà Oracle liệt kê bao gồm JDK 8, JDK 11, JDK 17, JDK 21 và JDK 25.

JDK 21 có tổng cộng 15 tính năng mới, bài viết này sẽ chọn ra một số tính năng mới quan trọng hơn để giới thiệu chi tiết:

- [JEP 430: String Templates (string template)](https://openjdk.org/jeps/430)（xem trước）
- [JEP 431: Sequenced Collections (collection có thứ tự)](https://openjdk.org/jeps/431)
- [JEP 439: Generational ZGC (ZGC phân thế hệ)](https://openjdk.org/jeps/439)
- [JEP 440: Record Patterns (record pattern)](https://openjdk.org/jeps/440)
- [JEP 441: Pattern Matching for switch (pattern matching cho switch)](https://openjdk.org/jeps/441)
- [JEP 442: Foreign Function & Memory API (API hàm và bộ nhớ ngoài)](https://openjdk.org/jeps/442)（xem trước lần ba）
- [JEP 443: Unnamed Patterns and Variables (pattern và biến không tên)](https://openjdk.org/jeps/443)（xem trước）
- [JEP 444: Virtual Threads (virtual thread)](https://openjdk.org/jeps/444)
- [JEP 445: Unnamed Classes and Instance Main Methods (class không tên và instance main method)](https://openjdk.org/jeps/445)（xem trước）

Hình dưới đây là số lượng tính năng mới và thời điểm phát hành của từng phiên bản từ JDK 8 đến JDK 24:

![](https://oss.javaguide.cn/github/javaguide/java/new-features/jdk8~jdk24.png)

## JEP 430: String Templates (string template, xem trước)

String Templates (string template) là tính năng xem trước trong JDK 21. Tính năng này trải qua lần xem trước thứ hai trong JDK 22, sau đó bị rút lại, do đó trong JDK hiện tại không còn cung cấp bộ API và cú pháp này nữa.

String Templates cung cấp một cách xây dựng chuỗi động động ngắn gọn và trực quan hơn. Cú pháp xem trước của JDK 21 sử dụng `\{biểu thức}` làm embedded expression (biểu thức nhúng), và template processor (bộ xử lý mẫu) xử lý template. Biểu thức hỗ trợ biến cục bộ, static hoặc non-static field, lời gọi method, kết quả tính toán, v.v.

Trên thực tế, String Templates (string template) tồn tại trong hầu hết các ngôn ngữ lập trình:

```typescript
"Greetings {{ name }}!";  //Angular
`Greetings ${ name }!`;    //Typescript
$"Greetings { name }!"    //Visual basic
f"Greetings { name }!"    //Python
```

Khi Java chưa có String Templates, chúng ta thường dùng phép nối chuỗi hoặc method định dạng để xây dựng chuỗi:

```java
//concatenation
message = "Greetings " + name + "!";

//String.format()
message = String.format("Greetings %s!", name);  //concatenation

//MessageFormat
message = new MessageFormat("Greetings {0}!").format(name);

//StringBuilder
message = new StringBuilder().append("Greetings ").append(name).append("!").toString();
```

Những method này ít nhiều đều có nhược điểm, ví dụ khó đọc, rườm rà, phức tạp.

Java sử dụng String Templates để nối chuỗi, có thể nhúng trực tiếp biểu thức vào chuỗi mà không cần xử lý thêm:

```java
String message = STR."Greetings \{name}!";
```

Trong biểu thức template ở trên:

- STR là template processor.
- `\{name}` là biểu thức, khi chạy, các biểu thức này sẽ được thay thế bằng giá trị của biến tương ứng.

Java hiện hỗ trợ ba template processor:

- STR: tự động thực hiện string interpolation (nội suy chuỗi), tức thay thế mỗi embedded expression trong template bằng giá trị của nó (chuyển thành chuỗi).
- FMT: tương tự như STR, nhưng nó còn có thể nhận format specifier (bộ chỉ định định dạng), các format specifier này nằm ở phía bên trái của embedded expression, dùng để điều khiển kiểu xuất ra.
- RAW: không tự động xử lý string template như STR và FMT, mà trả về một đối tượng `StringTemplate`, đối tượng này chứa thông tin về văn bản và biểu thức trong template.

```java
String name = "Lokesh";

//STR
String message = STR."Greetings \{name}.";

//FMT
String message = FMT."Greetings %-12s\{name}.";

//RAW
StringTemplate st = RAW."Greetings \{name}.";
String message = STR.process(st);
```

Ngoài ba template processor đi kèm của JDK, bạn còn có thể implement interface `StringTemplate.Processor` để tạo template processor của riêng mình, chỉ cần kế thừa interface `StringTemplate.Processor`, rồi implement method `process` là được.

Chúng ta có thể dùng biến cục bộ, static/non-static field thậm chí method làm embedded expression:

```java
//variable
message = STR."Greetings \{name}!";

//method
message = STR."Greetings \{getName()}!";

//field
message = STR."Greetings \{this.name}!";
```

Còn có thể thực hiện tính toán trong biểu thức và in ra kết quả:

```java
int x = 10, y = 20;
String s = STR."\{x} + \{y} = \{x + y}";  //"10 + 20 = 30"
```

Để nâng cao tính dễ đọc, chúng ta có thể chia biểu thức nhúng thành nhiều dòng:

```java
String time = STR."The current time is \{
    //sample comment - current time in HH:mm:ss
    DateTimeFormatter
      .ofPattern("HH:mm:ss")
      .format(LocalTime.now())
  }.";
```

## JEP 431: Sequenced Collections (collection có thứ tự)

JDK 21 giới thiệu một nhóm interface collection mới: **Sequenced Collections (collection có thứ tự)**. Loại collection này có thứ tự duyệt xác định (encounter order), đồng thời cung cấp method truy cập phần tử đầu-cuối và lấy view đảo ngược.

Sequenced Collections bao gồm ba interface sau:

- [`SequencedCollection`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedCollection.html)
- [`SequencedSet`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedSet.html)
- [`SequencedMap`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedMap.html)

Interface `SequencedCollection` kế thừa interface `Collection`, cung cấp method truy cập, thêm hoặc xóa phần tử ở hai đầu collection cũng như lấy view đảo ngược của collection.

```java
interface SequencedCollection<E> extends Collection<E> {

  // New Method

  SequencedCollection<E> reversed();

  // Promoted methods from Deque<E>

  void addFirst(E);
  void addLast(E);

  E getFirst();
  E getLast();

  E removeFirst();
  E removeLast();
}
```

Interface `List` và `Deque` kế thừa interface `SequencedCollection`.

Lấy `ArrayList` làm ví dụ, minh họa hiệu quả sử dụng thực tế:

```java
ArrayList<Integer> arrayList = new ArrayList<>();

arrayList.add(1);   // List contains: [1]

arrayList.addFirst(0);  // List contains: [0, 1]
arrayList.addLast(2);   // List contains: [0, 1, 2]

Integer firstElement = arrayList.getFirst();  // 0
Integer lastElement = arrayList.getLast();  // 2

List<Integer> reversed = arrayList.reversed();
System.out.println(reversed); // Prints [2, 1, 0]
```

Interface `SequencedSet` trực tiếp kế thừa interface `SequencedCollection` và ghi đè method `reversed()`.

```java
interface SequencedSet<E> extends SequencedCollection<E>, Set<E> {

    SequencedSet<E> reversed();
}
```

Interface `SortedSet` kế thừa interface `SequencedSet`, `LinkedHashSet` implement interface `SequencedSet`.

Lấy `LinkedHashSet` làm ví dụ, minh họa hiệu quả sử dụng thực tế:

```java
LinkedHashSet<Integer> linkedHashSet = new LinkedHashSet<>(List.of(1, 2, 3));

Integer firstElement = linkedHashSet.getFirst();   // 1
Integer lastElement = linkedHashSet.getLast();    // 3

linkedHashSet.addFirst(0);  //List contains: [0, 1, 2, 3]
linkedHashSet.addLast(4);   //List contains: [0, 1, 2, 3, 4]

System.out.println(linkedHashSet.reversed());   //Prints [4, 3, 2, 1, 0]
```

Interface `SequencedMap` kế thừa interface `Map`, cung cấp method truy cập, thêm hoặc xóa cặp key-value ở hai đầu collection, lấy `SequencedSet` chứa key, `SequencedCollection` chứa value, `SequencedSet` chứa entry (cặp key-value) cũng như lấy view đảo ngược của collection.

```java
interface SequencedMap<K,V> extends Map<K,V> {

  // New Methods

  SequencedMap<K,V> reversed();

  SequencedSet<K> sequencedKeySet();
  SequencedCollection<V> sequencedValues();
  SequencedSet<Entry<K,V>> sequencedEntrySet();

  V putFirst(K, V);
  V putLast(K, V);


  // Promoted Methods from NavigableMap<K, V>

  Entry<K, V> firstEntry();
  Entry<K, V> lastEntry();

  Entry<K, V> pollFirstEntry();
  Entry<K, V> pollLastEntry();
}
```

Interface `SortedMap` kế thừa interface `SequencedMap`, `LinkedHashMap` implement interface `SequencedMap`.

Lấy `LinkedHashMap` làm ví dụ, minh họa hiệu quả sử dụng thực tế:

```java
LinkedHashMap<Integer, String> map = new LinkedHashMap<>();

map.put(1, "One");
map.put(2, "Two");
map.put(3, "Three");

map.firstEntry();   //1=One
map.lastEntry();    //3=Three

System.out.println(map);  //{1=One, 2=Two, 3=Three}

Map.Entry<Integer, String> first = map.pollFirstEntry();   //1=One
Map.Entry<Integer, String> last = map.pollLastEntry();    //3=Three

System.out.println(map);  //{2=Two}

map.putFirst(1, "One");     //{1=One, 2=Two}
map.putLast(3, "Three");    //{1=One, 2=Two, 3=Three}

System.out.println(map);  //{1=One, 2=Two, 3=Three}
System.out.println(map.reversed());   //{3=Three, 2=Two, 1=One}
```

## JEP 439: Generational ZGC (ZGC phân thế hệ)

Trong JDK 21, ZGC được mở rộng tính năng, bổ sung chức năng Generational GC. Tuy nhiên, mặc định là tắt, cần bật thông qua cấu hình:

```bash
// Kích hoạt Generational ZGC
java -XX:+UseZGC -XX:+ZGenerational ...
```

Trong các phiên bản tương lai, nhà phát hành sẽ đặt ZGenerational làm giá trị mặc định, tức mặc định bật Generational GC của ZGC. Ở các phiên bản muộn hơn, ZGC không phân thế hệ sẽ bị gỡ bỏ.

> In a future release we intend to make Generational ZGC the default, at which point -XX:-ZGenerational will select non-generational ZGC. In an even later release we intend to remove non-generational ZGC, at which point the ZGenerational option will become obsolete.
>
> Trong các phiên bản tương lai, chúng tôi dự định đặt Generational ZGC làm mặc định, khi đó -XX:-ZGenerational sẽ chọn ZGC không phân thế hệ. Trong các phiên bản muộn hơn, chúng tôi dự định gỡ bỏ ZGC không phân thế hệ, khi đó tùy chọn ZGenerational sẽ trở nên lỗi thời.

Generational ZGC khi vẫn giữ mục tiêu low-pause (tạm dừng thấp) của ZGC, chủ yếu thông qua việc thu hồi thường xuyên hơn các đối tượng trẻ để giảm rủi ro dừng do cấp phát, giảm bộ nhớ heap cần thiết và nâng cao thông lượng.

## JEP 440: Record Patterns (record pattern)

Record pattern trải qua lần xem trước đầu tiên trong Java 19, do [JEP 405](https://openjdk.org/jeps/405) đề xuất. Trong JDK 20 là lần xem trước thứ hai, do [JEP 432](https://openjdk.org/jeps/432) đề xuất. Cuối cùng, record pattern chuyển chính thức thành công trong JDK 21.

[Tổng quan các tính năng mới Java 20](./java20.md) đã giới thiệu chi tiết về record pattern, ở đây không lặp lại nữa.

## JEP 441: Pattern Matching for switch (pattern matching cho switch)

Tăng cường switch expression và câu lệnh trong Java, cho phép dùng pattern trong case label. Khi pattern khớp, sẽ thực thi code tương ứng với case label.

Trong code dưới đây, switch expression sử dụng type pattern để khớp.

```java
static String formatterPatternSwitch(Object obj) {
    return switch (obj) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case Double d  -> String.format("double %f", d);
        case String s  -> String.format("String %s", s);
        default        -> obj.toString();
    };
}
```

## JEP 442: Foreign Function & Memory API (API hàm và bộ nhớ ngoài, xem trước lần ba)

Chương trình Java có thể thông qua API này để tương tác với code và dữ liệu nằm ngoài Java runtime. Bằng cách gọi hiệu quả các hàm ngoài (tức code nằm ngoài JVM) và truy cập an toàn bộ nhớ ngoài (tức bộ nhớ không do JVM quản lý), API này giúp chương trình Java có thể gọi thư viện native và xử lý dữ liệu native, mà không nguy hiểm và mong manh như JNI.

Foreign function and memory API trải qua vòng ấp ủ đầu tiên trong Java 17, do [JEP 412](https://openjdk.java.net/jeps/412) đề xuất. Vòng ấp ủ thứ hai trong Java 18, do [JEP 419](https://openjdk.org/jeps/419) đề xuất. Lần xem trước đầu tiên trong Java 19, do [JEP 424](https://openjdk.org/jeps/424) đề xuất. Lần xem trước thứ hai trong JDK 20, do [JEP 434](https://openjdk.org/jeps/434) đề xuất. Lần xem trước thứ ba trong JDK 21, do [JEP 442](https://openjdk.org/jeps/442) đề xuất.

Trong [Tổng quan các tính năng mới Java 19](./java19.md), tôi đã giới thiệu chi tiết về foreign function and memory API, ở đây không giới thiệu thêm nữa.

## JEP 443: Unnamed Patterns and Variables (pattern và biến không tên, xem trước)

Unnamed pattern và biến không tên cho phép chúng ta dùng gạch dưới `_` để biểu diễn biến không tên cũng như các thành phần không dùng khi khớp pattern, nhằm nâng cao tính dễ đọc và dễ bảo trì của code.

Kịch bản điển hình của biến không tên là câu lệnh `try-with-resources`, biến ngoại lệ trong mệnh đề `catch` và vòng lặp `for`. Khi biến không cần dùng thì có thể dùng gạch dưới `_` thay thế, như vậy xác định rõ ràng biến không được sử dụng.

```java
try (var _ = ScopedContext.acquire()) {
  // No use of acquired resource
}
try { ... }
catch (Exception _) { ... }
catch (Throwable _) { ... }

for (int i = 0, _ = runOnce(); i < arr.length; i++) {
  ...
}
```

Unnamed pattern là một pattern vô điều kiện, không ràng buộc với bất kỳ giá trị nào. Biến unnamed pattern xuất hiện trong type pattern.

```java
if (r instanceof ColoredPoint(_, Color c)) { ... c ... }

switch (b) {
    case Box(RedBall _), Box(BlueBall _) -> processBox(b);
    case Box(GreenBall _)                -> stopProcessing();
    case Box(_)                          -> pickAnotherBox();
}
```

## JEP 444: Virtual Threads (virtual thread)

Virtual thread là một cập nhật nặng ký, nhất định phải chú trọng!

Virtual thread trải qua lần xem trước đầu tiên trong Java 19, do [JEP 425](https://openjdk.org/jeps/425) đề xuất. Trong JDK 20 là lần xem trước thứ hai. Cuối cùng, virtual thread chuyển chính thức thành công trong JDK 21.

[Tổng quan các tính năng mới Java 20](./java20.md) đã giới thiệu chi tiết về virtual thread, ở đây không lặp lại nữa.

## JEP 445: Unnamed Classes and Instance Main Methods (class không tên và instance main method, xem trước)

Tính năng này chủ yếu đơn giản hóa khai báo của method `main`. Đối với người mới học Java, khai báo method `main` này giới thiệu quá nhiều khái niệm cú pháp Java, không thuận lợi cho người mới nhanh chóng nắm bắt.

Trước khi dùng tính năng này, khai báo một `main` method:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Sau khi dùng tính năng mới này, khai báo một `main` method:

```java
class HelloWorld {
    void main() {
        System.out.println("Hello, World!");
    }
}
```

Tiếp tục tinh gọn (class không tên cho phép chúng ta không định nghĩa tên class):

```java
void main() {
   System.out.println("Hello, World!");
}
```

## Tham khảo

- Java 21 String Templates：<https://howtodoinjava.com/java/java-string-templates/>
- Java 21 Sequenced Collections：<https://howtodoinjava.com/java/sequenced-collections/>
