---
title: Tổng hợp câu hỏi phỏng vấn Java Core (Phần dưới)
description: "Tổng hợp câu hỏi phỏng vấn về các tính năng nâng cao của Java: giải thích sâu về cơ chế xử lý Exception, nguyên lý Generics, ứng dụng Reflection, cách sử dụng Annotation, cơ chế SPI, serialization, mô hình I/O (BIO/NIO/AIO), syntactic sugar và các kiến thức trọng tâm khác."
category: Java
tag:
  - Java Core
head:
  - - meta
    - name: keywords
      content: Java Exception,Generics,Reflection,Annotation,SPI,Serialization,I/O,Syntactic Sugar,try-with-resources,BIO NIO AIO,Câu hỏi phỏng vấn Java
---

## Exception

**Tổng quan sơ đồ phân cấp lớp Exception trong Java**：

![Sơ đồ phân cấp lớp Exception trong Java](https://oss.javaguide.cn/github/javaguide/java/basis/types-of-exceptions-in-java.png)

### Exception và Error khác nhau như thế nào？

Trong Java, tất cả các exception đều có một tổ tiên chung là lớp `Throwable` trong gói `java.lang`. Lớp `Throwable` có hai lớp con quan trọng:

- **`Exception`** : Là exception mà bản thân chương trình có thể xử lý, có thể bắt bằng `catch`. `Exception` lại được chia thành Checked Exception (exception phải được kiểm tra, bắt buộc xử lý) và Unchecked Exception (exception không bắt buộc kiểm tra, có thể không xử lý).
- **`Error`**：`Error` thuộc loại lỗi mà chương trình không thể xử lý, ~~chúng ta không thể dùng `catch` để bắt~~ không khuyến khích dùng `catch` để bắt. Ví dụ như lỗi thực thi máy ảo Java (`VirtualMachineError`), lỗi thiếu bộ nhớ máy ảo (`OutOfMemoryError`), lỗi định nghĩa lớp (`NoClassDefFoundError`) v.v. Khi các exception này xảy ra, Java Virtual Machine (JVM) thường sẽ chọn cách kết thúc thread.

### Sự khác biệt giữa ClassNotFoundException và NoClassDefFoundError

- `ClassNotFoundException` là Exception, xảy ra khi không tìm thấy lớp trong quá trình tải động như sử dụng reflection, có thể dự đoán trước và có thể bắt để xử lý.
- `NoClassDefFoundError` là Error, biểu thị rằng JVM hoặc class loader không tìm thấy định nghĩa lớp khi cố gắng tải nó. Ngoài việc thiếu JAR lúc runtime, còn có thể bị kích hoạt bởi các tình huống như khởi tạo lớp thất bại sau đó lại sử dụng lớp đó lần nữa. Nó thường sẽ kết thúc thread hiện tại, nhưng không có nghĩa là toàn bộ JVM chắc chắn không thể tiếp tục chạy.

### ⭐️ Checked Exception và Unchecked Exception khác nhau như thế nào？

**Checked Exception** tức là exception phải được kiểm tra. Trong quá trình biên dịch mã Java, nếu Checked Exception không được xử lý bởi từ khóa `catch` hoặc `throws`, thì mã sẽ không thể biên dịch thành công.

Ví dụ như đoạn mã thao tác I/O dưới đây：

![](https://oss.javaguide.cn/github/javaguide/java/basis/checked-exception.png)

Ngoại trừ `RuntimeException` và các lớp con của nó, tất cả các lớp `Exception` khác và lớp con của chúng đều thuộc Checked Exception. Các Checked Exception phổ biến gồm: exception liên quan đến I/O, `ClassNotFoundException`, `SQLException`...

**Unchecked Exception** tức là **exception không bắt buộc kiểm tra**. Trong quá trình biên dịch mã Java, chúng ta có thể không xử lý Unchecked Exception mà vẫn biên dịch thành công.

`RuntimeException` và các lớp con của nó thuộc Unchecked Exception; theo phân loại của JLS, `Error` và các lớp con của nó cũng thuộc Unchecked Exception. Các `RuntimeException` phổ biến gồm：

- `NullPointerException` (lỗi con trỏ null)
- `IllegalArgumentException` (lỗi tham số, ví dụ như sai kiểu tham số đầu vào của phương thức)
- `NumberFormatException` (lỗi định dạng khi chuyển chuỗi thành số, là lớp con của `IllegalArgumentException`)
- `ArrayIndexOutOfBoundsException` (lỗi vượt quá chỉ số mảng)
- `ClassCastException` (lỗi ép kiểu)
- `ArithmeticException` (lỗi số học)
- `SecurityException` (lỗi bảo mật, ví dụ như không đủ quyền)
- `UnsupportedOperationException` (lỗi thao tác không được hỗ trợ, ví dụ như tạo trùng lặp cùng một người dùng)
- ……

![](https://oss.javaguide.cn/github/javaguide/java/basis/unchecked-exception.png)

### Bạn thích sử dụng Checked Exception hay Unchecked Exception hơn？

Mặc định sử dụng Unchecked Exception, chỉ dùng Checked Exception khi thực sự cần thiết.

Chúng ta có thể coi Unchecked Exception (ví dụ `NullPointerException`) là Bug của mã nguồn. Đối với Bug, cách tốt nhất là để nó lộ ra rồi sửa mã, thay vì dùng `try-catch` để che giấu nó.

Nói chung, chỉ sử dụng Checked Exception trong một trường hợp duy nhất: khi exception đó là một phần của logic nghiệp vụ và phía gọi bắt buộc phải xử lý nó. Ví dụ, một exception số dư không đủ. Đây không phải là bug, mà là một nhánh nghiệp vụ bình thường, tôi cần dùng Checked Exception để buộc phía gọi phải xử lý tình huống này, chẳng hạn như nhắc người dùng nạp tiền. Như vậy vừa đảm bảo tính toàn vẹn của logic nghiệp vụ then chốt, vừa giúp mã nguồn giữ được sự ngắn gọn nhất có thể.

### Lớp Throwable có những phương thức thường dùng nào？

- `String getMessage()`: Trả về thông tin chi tiết khi exception xảy ra
- `String toString()`: Trả về mô tả ngắn gọn khi exception xảy ra
- `String getLocalizedMessage()`: Trả về thông tin đã được bản địa hóa của đối tượng exception. Ghi đè phương thức này bằng lớp con của `Throwable` có thể tạo ra thông tin bản địa hóa. Nếu lớp con không ghi đè phương thức này, thì thông tin trả về sẽ giống với kết quả của `getMessage()`
- `void printStackTrace()`: In thông tin exception được đóng gói trong đối tượng `Throwable` ra console

### Sử dụng try-catch-finally như thế nào？

- Khối `try`：Dùng để bắt exception. Phía sau nó có thể có không hoặc nhiều khối `catch`, nếu không có khối `catch` thì bắt buộc phải có một khối `finally`.
- Khối `catch`：Dùng để xử lý exception mà try đã bắt được.
- Khối `finally`：Dù có bắt hoặc xử lý exception hay không, các câu lệnh trong khối `finally` đều sẽ được thực thi. Khi gặp câu lệnh `return` trong khối `try` hoặc khối `catch`, khối `finally` sẽ được thực thi trước khi phương thức trả về.

Ví dụ mã nguồn：

```java
try {
    System.out.println("Try to do something");
    throw new RuntimeException("RuntimeException");
} catch (Exception e) {
    System.out.println("Catch Exception -> " + e.getMessage());
} finally {
    System.out.println("Finally");
}
```

Kết quả：

```plain
Try to do something
Catch Exception -> RuntimeException
Finally
```

**Lưu ý：Không sử dụng return trong khối finally!** Khi cả khối try và khối finally đều có câu lệnh return, câu lệnh return trong khối try sẽ bị bỏ qua. Đó là vì giá trị trả về của return trong try sẽ được tạm lưu vào một biến cục bộ, khi thực thi đến return trong finally, giá trị của biến cục bộ này sẽ trở thành giá trị trả về của return trong finally.

Ví dụ mã nguồn：

```java
public static void main(String[] args) {
    System.out.println(f(2));
}

public static int f(int value) {
    try {
        return value * value;
    } finally {
        if (value == 2) {
            return 0;
        }
    }
}
```

Kết quả：

```plain
0
```

### Mã trong finally có chắc chắn được thực thi không？

Không hẳn! Trong một số trường hợp, mã trong finally sẽ không được thực thi.

Ví dụ như trước khi finally được thực thi, máy ảo bị kết thúc, thì mã trong finally sẽ không được thực thi.

```java
try {
    System.out.println("Try to do something");
    throw new RuntimeException("RuntimeException");
} catch (Exception e) {
    System.out.println("Catch Exception -> " + e.getMessage());
    // Kết thúc máy ảo Java đang chạy hiện tại
    System.exit(1);
} finally {
    System.out.println("Finally");
}
```

Kết quả：

```plain
Try to do something
Catch Exception -> RuntimeException
```

Ngoài ra, nếu tiến trình JVM bị buộc kết thúc, ví dụ như gọi `Runtime.halt()`, hệ điều hành trực tiếp kết thúc tiến trình hoặc máy bị mất điện, khối `finally` cũng có thể không kịp thực thi. Các uncaught exception thông thường ngay cả khi cuối cùng dẫn đến việc kết thúc thread hiện tại, trước khi thread kết thúc, `finally` vẫn sẽ được thực thi theo quy tắc ngôn ngữ.

Issue liên quan：<https://github.com/Snailclimb/JavaGuide/issues/190>。

🧗🏻 Nâng cao：Phân tích nguyên lý thực thi đằng sau syntactic sugar `try catch finally` từ góc độ bytecode.

### Sử dụng `try-with-resources` thay thế `try-catch-finally` như thế nào？

1. **Phạm vi áp dụng (định nghĩa resource)：** Bất kỳ đối tượng nào implement `java.lang.AutoCloseable` hoặc `java.io.Closeable`
2. **Thứ tự thực thi giữa đóng resource và khối finally：** Trong câu lệnh `try-with-resources`, bất kỳ khối catch hoặc finally nào cũng chạy sau khi resource đã khai báo được đóng

《Effective Java》đã chỉ rõ：

> Đối với các resource bắt buộc phải đóng, chúng ta luôn nên ưu tiên sử dụng `try-with-resources` thay vì `try-finally`. Mã sinh ra sẽ ngắn gọn hơn, rõ ràng hơn, và exception sinh ra cũng hữu ích hơn cho chúng ta. Câu lệnh `try-with-resources` giúp chúng ta dễ dàng viết mã cho các resource bắt buộc phải đóng hơn, điều mà `try-finally` gần như không thể làm được.

Trong Java, các resource như `InputStream`, `OutputStream`, `Scanner`, `PrintWriter` đều cần chúng ta gọi phương thức `close()` để đóng thủ công. Thông thường chúng ta sử dụng câu lệnh `try-catch-finally` để thực hiện yêu cầu này, như sau：

```java
//Đọc nội dung tệp văn bản
Scanner scanner = null;
try {
    scanner = new Scanner(new File("D://read.txt"));
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} finally {
    if (scanner != null) {
        scanner.close();
    }
}
```

Sử dụng câu lệnh `try-with-resources` từ Java 7 trở đi để cải tiến đoạn mã trên:

```java
try (Scanner scanner = new Scanner(new File("test.txt"))) {
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException fnfe) {
    fnfe.printStackTrace();
}
```

Tất nhiên khi cần đóng nhiều resource, sử dụng `try-with-resources` cũng rất đơn giản, nếu bạn vẫn dùng `try-catch-finally` có thể sẽ gây ra nhiều vấn đề.

Bằng cách sử dụng dấu chấm phẩy để phân tách, bạn có thể khai báo nhiều resource trong khối `try-with-resources`.

```java
try (BufferedInputStream bin = new BufferedInputStream(new FileInputStream(new File("test.txt")));
     BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream(new File("out.txt")))) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}
```

### ⭐️ Cần lưu ý những gì khi sử dụng Exception？

- Không định nghĩa exception là biến static, vì điều đó sẽ làm rối loạn thông tin exception stack. Mỗi lần ném exception thủ công, chúng ta cần new một đối tượng exception mới để ném ra.
- Thông tin exception được ném ra nhất định phải có ý nghĩa.
- Khuyến khích ném exception cụ thể hơn, ví dụ khi lỗi định dạng chuyển chuỗi thành số thì nên ném `NumberFormatException` thay vì lớp cha `IllegalArgumentException`.
- Tránh ghi log trùng lặp：Nếu tại nơi bắt exception đã ghi đủ thông tin (bao gồm loại exception, thông báo lỗi và stack trace v.v.), thì khi ném lại exception này trong mã nghiệp vụ, không nên ghi lại cùng một thông tin lỗi. Ghi log trùng lặp sẽ làm phình to tệp log, và có thể che giấu nguyên nhân thực sự của vấn đề, khiến vấn đề khó theo dõi và giải quyết hơn.
- ……

## Generics

### Generics là gì？Có tác dụng gì？

**Java Generics** là một tính năng mới được giới thiệu từ JDK 5. Sử dụng tham số generic có thể tăng cường tính dễ đọc và tính ổn định của mã nguồn.

Trình biên dịch có thể kiểm tra tham số generic, và thông qua tham số generic có thể chỉ định kiểu đối tượng được truyền vào. Ví dụ như dòng mã `ArrayList<Person> persons = new ArrayList<Person>()` đã chỉ rõ rằng đối tượng `ArrayList` này chỉ có thể nhận đối tượng `Person`, nếu truyền đối tượng kiểu khác sẽ báo lỗi.

```java
ArrayList<E> extends AbstractList<E>
```

Ngoài ra, `List` nguyên thủy trả về kiểu `Object`, cần phải ép kiểu thủ công mới sử dụng được, còn sau khi dùng generic thì trình biên dịch sẽ tự động chuyển đổi.

### Có những cách sử dụng generic nào？

Generic thường có ba cách sử dụng:**Lớp generic**, **Interface generic**, **Phương thức generic**.

**1.Lớp generic**：

```java
//T ở đây có thể viết tùy ý thành bất kỳ định danh nào, các tham số dạng T, E, K, V thường được dùng để biểu thị generic
//Khi khởi tạo lớp generic, phải chỉ định kiểu cụ thể của T
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

Cách khởi tạo lớp generic：

```java
Generic<Integer> genericInteger = new Generic<Integer>(123456);
```

**2.Interface generic**：

```java
public interface Generator<T> {
    public T method();
}
```

Implement interface generic, không chỉ định kiểu：

```java
class GeneratorImpl<T> implements Generator<T>{
    @Override
    public T method() {
        return null;
    }
}
```

Implement interface generic, chỉ định kiểu：

```java
class GeneratorImpl implements Generator<String> {
    @Override
    public String method() {
        return "hello";
    }
}
```

**3.Phương thức generic**：

```java
   public static < E > void printArray( E[] inputArray )
   {
         for ( E element : inputArray ){
            System.out.printf( "%s ", element );
         }
         System.out.println();
    }
```

Sử dụng：

```java
// Tạo các mảng kiểu khác nhau：Integer, Double và Character
Integer[] intArray = { 1, 2, 3 };
String[] stringArray = { "Hello", "World" };
printArray( intArray  );
printArray( stringArray  );
```

> Lưu ý：`public static <E> void printArray(E[] inputArray)` là phương thức generic static. Ngữ cảnh static không có instance hiện tại, do đó không thể tham chiếu đến tham số kiểu được khai báo ở cấp lớp; điều này không liên quan đến việc "phương thức static được tải trước". Phương thức static có thể khai báo và sử dụng tham số kiểu `<E>` của riêng nó.

### Trong dự án, bạn đã sử dụng generic ở đâu？

- Kết quả trả về chung của custom interface `CommonResult<T>` thông qua tham số `T` có thể chỉ định động kiểu dữ liệu của kết quả dựa trên kiểu trả về cụ thể
- Định nghĩa lớp xử lý `Excel` là `ExcelUtil<T>` để chỉ định động kiểu dữ liệu xuất `Excel`
- Xây dựng lớp tiện ích collection (tham khảo phương thức `sort`, `binarySearch` trong `Collections`).
- ……

## ⭐️ Reflection

Để tìm hiểu chi tiết về reflection, xem bài viết này [Giải thích chi tiết cơ chế Reflection trong Java](https://javaguide.cn/java/basis/reflection.html)。

### Reflection là gì？

Nói một cách đơn giản, Java Reflection là một **khả năng thu thập thông tin của lớp và thao tác với lớp hoặc đối tượng (phương thức, thuộc tính) một cách động trong thời gian chạy**.

Thông thường, mã chúng ta viết đã xác định kiểu ngay từ lúc biên dịch, gọi phương thức nào, truy cập field nào đều rõ ràng. Nhưng reflection cho phép chúng ta **trong lúc runtime** mới khám phá một lớp có những phương thức nào, những thuộc tính nào, constructor của nó ra sao, đồng thời trong phạm vi cho phép của access control và module boundary, có thể động tạo đối tượng, gọi phương thức hoặc sửa đổi thuộc tính.

Chính khả năng "tự soi chiếu chính mình" và thao tác trong thời gian chạy này đã khiến reflection trở thành **nền tảng của nhiều framework và thư viện đa năng**. Nó giúp mã nguồn linh hoạt hơn, có thể xử lý các kiểu chưa biết tại thời điểm biên dịch.

### Reflection có ưu nhược điểm gì？

**Ưu điểm：**

1. **Tính linh hoạt và tính động**：Reflection cho phép chương trình động tải lớp, tạo đối tượng, gọi phương thức và truy cập field trong thời gian chạy, thích ứng và mở rộng hành vi của chương trình một cách động dựa trên nhu cầu thực tế (như tệp cấu hình, đầu vào người dùng, annotation v.v.). Nhiều framework Java hiện đại (như Spring, Hibernate, MyBatis) chính là dựa trên đặc tính này để thực hiện các chức năng cốt lõi như dependency injection (DI), aspect-oriented programming (AOP), object-relational mapping (ORM), xử lý annotation, có thể nói reflection là nền tảng không thể thiếu cho việc phát triển framework.
2. **Tính giải ghép (decoupling) và tính tổng quát**：Thông qua reflection, có thể viết mã tổng quát hơn, tái sử dụng cao hơn và giải ghép cao hơn, giảm sự phụ thuộc giữa các module. Ví dụ, có thể thực hiện sao chép đối tượng tổng quát, serialization, Bean utility v.v. thông qua reflection.

**Nhược điểm：**

1. **Chi phí hiệu năng**：Thao tác reflection thường chậm hơn so với gọi mã trực tiếp. Vì liên quan đến các yếu tố như phân giải kiểu động, tra cứu phương thức và hạn chế tối ưu của trình biên dịch JIT. Tuy nhiên, đối với hầu hết các kịch bản framework, tổn thất hiệu năng này thường có thể chấp nhận được, hoặc bản thân framework sẽ thực hiện một số tối ưu hóa caching.
2. **Vấn đề bảo mật**：Reflection khi thỏa mãn các điều kiện về access check, module open relationship, có thể vượt qua một phần access check của ngôn ngữ Java (như truy cập field và phương thức `private`), có khả năng phá vỡ tính đóng gói. Ngoài ra, reflection còn có thể vượt qua kiểm tra generic lúc biên dịch, gây ra rủi ro an toàn kiểu. Module boundary từ Java 9 trở đi có thể từ chối các truy cập reflection sâu kiểu này và ném ra `InaccessibleObjectException`.
3. **Tính dễ đọc và bảo trì mã nguồn**：Lạm dụng reflection sẽ khiến mã nguồn trở nên phức tạp, khó hiểu và khó debug. Lỗi thường chỉ lộ ra lúc runtime, không dễ phát hiện như lỗi lúc biên dịch.

Bài đọc liên quan：[Java Reflection: Why is it so slow?](https://stackoverflow.com/questions/1392351/java-reflection-why-is-it-so-slow)。

### Các kịch bản ứng dụng của reflection？

Chúng ta khi viết mã nghiệp vụ hàng ngày có thể rất ít khi trực tiếp tiếp xúc với Java Reflection. Nhưng có thể bạn không nhận ra, bạn đang tận hưởng sự tiện lợi mà reflection mang lại mỗi ngày! **Rất nhiều framework phổ biến, như Spring/Spring Boot, MyBatis v.v., tầng底层 đều sử dụng rộng rãi cơ chế reflection**, nhờ đó chúng mới có thể linh hoạt và mạnh mẽ như vậy.

Dưới đây liệt kê một vài kịch bản phổ biến nhất để giúp mọi người hiểu.

**1.Dependency Injection và Inversion of Control (IoC)**

Các IoC framework tiêu biểu như Spring/Spring Boot, khi khởi động sẽ quét các lớp có annotation cụ thể (như `@Component`, `@Service`, `@Repository`, `@Controller`), sử dụng reflection để khởi tạo đối tượng (Bean), và thông qua reflection để inject dependency (như `@Autowired`, constructor injection v.v.).

**2.Xử lý Annotation**

Bản thân annotation chỉ là một "đánh dấu", phải có người đọc đánh dấu này mới biết phải làm gì. Reflection chính là "trình đọc" đó. Framework thông qua reflection kiểm tra xem trên lớp, phương thức, field có annotation cụ thể nào không, sau đó dựa trên thông tin annotation để thực thi logic tương ứng. Ví dụ, khi thấy `@Value`, sẽ dùng reflection đọc nội dung annotation, đi tìm giá trị tương ứng trong tệp cấu hình, rồi lại dùng reflection để gán giá trị cho field.

**3.Dynamic Proxy và AOP**

Muốn tự động thêm một chút gia vị trước và sau khi gọi một phương thức nào đó (ví dụ như ghi log, mở transaction, kiểm tra quyền)？AOP (Aspect-Oriented Programming) chính là để làm việc đó, còn dynamic proxy là thủ đoạn thường dùng để thực hiện AOP. Dynamic Proxy đi kèm JDK (Proxy và InvocationHandler) không thể tách rời khỏi reflection. Khi đối tượng proxy gọi phương thức của đối tượng thực bên trong, chính là thông qua `Method.invoke` của reflection để hoàn thành.

```java
public class DebugInvocationHandler implements InvocationHandler {
    private final Object target; // Đối tượng thực

    public DebugInvocationHandler(Object target) { this.target = target; }

    // proxy: đối tượng proxy, method: phương thức được gọi, args: tham số phương thức
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Logic aspect：Trước khi gọi phương thức " + method.getName());
        // Thông qua reflection gọi phương thức cùng tên của đối tượng thực
        Object result = method.invoke(target, args);
        System.out.println("Logic aspect：Sau khi gọi phương thức " + method.getName());
        return result;
    }
}
```

**4.Object-Relational Mapping (ORM)**

Các framework như MyBatis, Hibernate, có thể giúp bạn tự động biến từng dòng dữ liệu truy vấn từ cơ sở dữ liệu thành từng đối tượng Java. Làm sao nó biết field cơ sở dữ liệu tương ứng với thuộc tính Java nào？Vẫn là nhờ reflection. Nó thông qua reflection lấy danh sách thuộc tính của lớp Java, sau đó ánh xạ kết quả truy vấn theo tên hoặc cấu hình, rồi lại dùng reflection gọi setter hoặc trực tiếp sửa giá trị field. Ngược lại, khi lưu đối tượng vào cơ sở dữ liệu, cũng dùng reflection đọc giá trị thuộc tính để ghép SQL.

## Proxy

Để tìm hiểu chi tiết về Java Proxy, có thể xem bài viết [Giải thích chi tiết Proxy Pattern trong Java](https://javaguide.cn/java/basis/proxy.html) do tác giả viết.

### Làm thế nào để triển khai dynamic proxy？

Dynamic proxy là một design pattern rất mạnh mẽ, nó cho phép chúng ta **không sửa đổi mã nguồn**, mà vẫn có thể **tăng cường chức năng (Enhancement)** cho các phương thức của một lớp hoặc đối tượng.

Trong Java, có hai cách chính để triển khai dynamic proxy：**JDK Dynamic Proxy** và **CGLIB Dynamic Proxy**.

**Cách thứ nhất：JDK Dynamic Proxy**

Do Java chính thức cung cấp, yêu cầu cốt lõi là lớp mục tiêu phải implement một hoặc nhiều interface. JDK Dynamic Proxy khi chạy, sẽ sử dụng phương thức `Proxy.newProxyInstance()`, động tạo ra một instance của lớp proxy đã implement các interface này. Lớp proxy này được sinh ra trong bộ nhớ, bạn không thể nhìn thấy tệp `.java` hay `.class` của nó.

Khi bạn gọi bất kỳ phương thức nào của đối tượng proxy, lời gọi này đều sẽ được chuyển tiếp đến phương thức `invoke` của interface `InvocationHandler` mà chúng ta cung cấp. Trong phương thức `invoke`, chúng ta có thể thêm logic tăng cường của riêng mình trước hoặc sau khi gọi phương thức gốc (phương thức mục tiêu).

**Cách thứ hai：CGLIB Dynamic Proxy**

CGLIB là một thư viện sinh mã bên thứ ba. Nguyên lý của nó hoàn toàn khác với JDK, nó không yêu cầu lớp bị proxy phải implement interface. Khi chạy, nó động sinh ra lớp con của lớp mục tiêu làm lớp proxy (thông qua kỹ thuật thao tác bytecode ASM). Sau đó, nó sẽ ghi đè tất cả các phương thức không phải `final`, `private` và `static` trong lớp cha (tức là lớp bị proxy).

Khi bạn gọi bất kỳ phương thức nào của đối tượng proxy, lời gọi này sẽ bị phương thức `intercept` của interface `MethodInterceptor` của CGLIB chặn lại. Cũng giống như phương thức `invoke` của `InvocationHandler`, chúng ta có thể thêm logic tăng cường của mình trước hoặc sau khi gọi phương thức lớp cha gốc trong phương thức `intercept`.

### Static proxy và dynamic proxy khác nhau như thế nào？

Sự khác biệt cốt lõi giữa static proxy và dynamic proxy nằm ở **thời điểm xác lập quan hệ proxy, tính linh hoạt trong triển khai và chi phí bảo trì**.

| Chiều so sánh                   | Static Proxy                                                                                                                                                          | Dynamic Proxy                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thời điểm xác lập quan hệ proxy | Lúc biên dịch（sau khi biên dịch sinh ra tệp bytecode `.class` cố định）                                                                                              | Lúc runtime（động sinh bytecode lớp proxy và tải vào JVM）                                                                                                          |
| Cách thức triển khai            | Viết thủ công lớp proxy trước khi biên dịch, thường thông qua composition và delegation để gọi đối tượng mục tiêu                                                     | Không cần viết thủ công lớp proxy cụ thể, đóng gói logic tăng cường thông qua `Handler`/`Interceptor`                                                               |
| Phụ thuộc interface             | Không bắt buộc；static proxy dựa trên interface thường cho lớp proxy và lớp mục tiêu tuân theo cùng một interface                                                     | JDK Dynamic Proxy hướng interface, CGLIB và các sub-class proxy hướng lớp implementation có thể kế thừa                                                             |
| Lượng mã và khả năng bảo trì    | Lượng mã lớn（càng nhiều lớp mục tiêu, càng nhiều lớp proxy），chi phí bảo trì cao；khi interface thêm phương thức mới, lớp mục tiêu và lớp proxy cần đồng bộ sửa đổi | Lượng mã cực ít（logic tăng cường tổng quát có thể tái sử dụng），khả năng bảo trì tốt；giải ghép với interface, thay đổi interface không ảnh hưởng đến logic proxy |
| Ưu điểm cốt lõi                 | Triển khai đơn giản, logic trực quan, không phụ thuộc framework bên ngoài                                                                                             | Tính linh hoạt mạnh, tính tái sử dụng cao, giảm mã trùng lặp, thích ứng với kịch bản phức tạp                                                                       |
| Kịch bản ứng dụng điển hình     | Decorator pattern đơn giản, nhu cầu tăng cường cho số lượng nhỏ lớp cố định                                                                                           | Spring AOP, RPC framework（như Dubbo）, ORM framework                                                                                                               |

### ⭐️ JDK Dynamic Proxy và CGLIB Dynamic Proxy khác nhau như thế nào？

1. JDK Dynamic Proxy là của Java chính thức, nó yêu cầu lớp bị proxy phải implement interface. Nguyên lý của nó là động sinh ra một lớp implementation của interface để làm proxy. CGLIB là của bên thứ ba, nó không cần interface. Nguyên lý của nó là động sinh ra một lớp con của lớp bị proxy để làm proxy. Nhưng cũng chính vì là kế thừa, nên nó không thể proxy lớp `final`, và phương thức bị proxy cũng không thể là `final` hoặc `private`.
2. Về hiệu năng của cả hai, phần lớn trường hợp JDK Dynamic Proxy đều tốt hơn, cùng với việc nâng cấp phiên bản JDK, ưu thế này càng rõ rệt.

### ⭐️ Giới thiệu các kịch bản ứng dụng thực tế của dynamic proxy trong framework

Kịch bản ứng dụng điển hình nhất của dynamic proxy chính là **Spring AOP**.

AOP (Aspect-Oriented Programming：Lập trình hướng khía cạnh) có thể đóng gói những logic hoặc trách nhiệm không liên quan đến nghiệp vụ, nhưng lại được các module nghiệp vụ cùng gọi (ví dụ như xử lý transaction, quản lý log, kiểm soát quyền v.v.), giúp giảm mã trùng lặp trong hệ thống, giảm độ ghép nối giữa các module, đồng thời có lợi cho khả năng mở rộng và bảo trì trong tương lai.

Spring AOP chính là dựa trên dynamic proxy, nếu đối tượng cần proxy đã implement một interface nào đó, thì Spring AOP sẽ sử dụng **JDK Proxy** để tạo đối tượng proxy, còn đối với đối tượng không implement interface, thì không thể dùng JDK Proxy để proxy được, lúc này Spring AOP sẽ sử dụng **Cglib** để sinh ra một lớp con của đối tượng bị proxy làm proxy, như hình dưới đây：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/230ae587a322d6e4d09510161987d346.jpeg)

## Annotation

### Annotation là gì？

`Annotation` là tính năng mới được giới thiệu từ Java 5, có thể coi là một loại chú thích đặc biệt, chủ yếu dùng để trang trí cho lớp, phương thức hoặc biến, cung cấp một số thông tin cho chương trình sử dụng lúc biên dịch hoặc lúc chạy.

Annotation về bản chất là một interface đặc biệt kế thừa `Annotation`：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {

}

public interface Override extends Annotation{

}
```

JDK cung cấp rất nhiều annotation có sẵn（ví dụ `@Override`、`@Deprecated`）, đồng thời, chúng ta còn có thể tự định nghĩa annotation.

### Có những cách phân giải annotation nào？

Annotation chỉ có hiệu lực sau khi được phân giải, có hai cách phân giải phổ biến：

- **Quét trực tiếp lúc biên dịch**：Trình biên dịch khi biên dịch mã Java sẽ quét annotation tương ứng và xử lý, ví dụ một phương thức sử dụng annotation `@Override`, trình biên dịch khi biên dịch sẽ phát hiện phương thức hiện tại có ghi đè phương thức tương ứng của lớp cha hay không.
- **Xử lý qua reflection lúc chạy**：Các annotation đi kèm trong framework (ví dụ `@Value`, `@Component` của Spring framework) đều được xử lý thông qua reflection.

## ⭐️ SPI

Để tìm hiểu chi tiết về SPI, xem bài viết này [Giải thích chi tiết cơ chế Java SPI](https://javaguide.cn/java/basis/spi.html)。

### SPI là gì?

SPI tức là Service Provider Interface, nghĩa đen là："Interface của nhà cung cấp dịch vụ", cách hiểu của tôi là：một interface được cung cấp riêng cho nhà cung cấp dịch vụ hoặc nhà phát triển mở rộng chức năng framework sử dụng.

SPI tách biệt service interface và implementation service cụ thể, giải ghép giữa phía gọi service và phía triển khai service, có thể nâng cao khả năng mở rộng, khả năng bảo trì của chương trình. Sửa đổi hoặc thay thế implementation service không cần sửa đổi phía gọi.

Rất nhiều framework đều sử dụng cơ chế SPI của Java, ví dụ như：Spring framework, driver tải cơ sở dữ liệu, interface log, và cả triển khai mở rộng của Dubbo v.v.

<img src="https://oss.javaguide.cn/github/javaguide/java/basis/spi/22e1830e0b0e4115a882751f6c417857tplv-k3u1fbpfcp-zoom-1.jpeg" style="zoom:50%;" />

### SPI và API khác nhau như thế nào？

**Vậy SPI và API có gì khác nhau？**

Nhắc đến SPI thì không thể không nói đến API (Application Programming Interface), xét theo nghĩa rộng thì chúng đều thuộc về interface, và rất dễ nhầm lẫn. Dưới đây dùng một hình ảnh để minh họa：

![SPI VS API](https://oss.javaguide.cn/github/javaguide/java/basis/spi-vs-api.png)

Thông thường giữa các module đều giao tiếp thông qua interface, do đó chúng ta đưa vào một "interface" giữa phía gọi service và phía triển khai service (còn gọi là nhà cung cấp service).

- Khi phía triển khai cung cấp interface và implementation, chúng ta có thể gọi interface của phía triển khai để có được khả năng mà phía triển khai cung cấp cho chúng ta, đây chính là **API**. Trong trường hợp này, interface và implementation đều được đặt trong gói của phía triển khai. Phía gọi gọi chức năng của phía triển khai thông qua interface, mà không cần quan tâm đến chi tiết triển khai cụ thể.
- Khi interface tồn tại ở phía gọi, đây chính là **SPI**. Phía gọi interface xác định quy tắc interface, sau đó các nhà cung cấp khác nhau dựa trên quy tắc này để triển khai interface, từ đó cung cấp service.

Một ví dụ dễ hiểu：Công ty H là một công ty công nghệ, thiết kế một con chip mới, bây giờ cần sản xuất hàng loạt, mà trên thị trường có rất nhiều công ty sản xuất chip, lúc này, chỉ cần công ty H chỉ định tiêu chuẩn sản xuất chip (định nghĩa tiêu chuẩn interface), thì các công ty chip hợp tác này (nhà cung cấp service) sẽ giao chip mang đặc sắc riêng của mình theo tiêu chuẩn (cung cấp các implementation khác nhau, nhưng kết quả đưa ra là giống nhau).

### Ưu nhược điểm của SPI？

Thông qua cơ chế SPI có thể nâng cao đáng kể tính linh hoạt của thiết kế interface, nhưng cơ chế SPI cũng tồn tại một số nhược điểm, ví dụ như：

- `ServiceLoader` sẽ định vị và khởi tạo provider theo nhu cầu；nếu phía gọi duyệt toàn bộ provider để chọn implementation, thì mới kích hoạt việc tải toàn bộ provider khả dụng.
- Một instance `ServiceLoader` đơn lẻ không đảm bảo an toàn đa luồng；giữa các instance khác nhau không tồn tại quy tắc "đồng thời `load` thì nhất định xung đột".

## ⭐️ Serialization và Deserialization

Để tìm hiểu chi tiết về serialization và deserialization, xem bài viết này [Giải thích chi tiết Java Serialization](https://javaguide.cn/java/basis/serialization.html), trong đó đề cập đến các điểm kiến thức và câu hỏi phỏng vấn toàn diện hơn.

### Serialization là gì？Deserialization là gì？

Nếu chúng ta cần lưu trữ lâu dài đối tượng Java, ví dụ như lưu đối tượng Java vào tệp, hoặc truyền đối tượng Java qua mạng, những kịch bản này đều cần dùng đến serialization.

Nói một cách đơn giản：

- **Serialization**：Chuyển đổi cấu trúc dữ liệu hoặc đối tượng thành dạng có thể lưu trữ hoặc truyền tải, thường là luồng byte nhị phân, cũng có thể là định dạng văn bản như JSON, XML
- **Deserialization**：Quá trình chuyển đổi dữ liệu được sinh ra trong quá trình serialization trở lại thành cấu trúc dữ liệu hoặc đối tượng ban đầu

Đối với ngôn ngữ lập trình hướng đối tượng như Java, chúng ta serialization đều là đối tượng (Object) tức là lớp (Class) đã được khởi tạo, nhưng trong ngôn ngữ bán hướng đối tượng như C++, struct (cấu trúc) định nghĩa kiểu cấu trúc dữ liệu, còn class tương ứng với kiểu đối tượng.

Dưới đây là các kịch bản ứng dụng phổ biến của serialization và deserialization：

- Đối tượng trước khi truyền qua mạng (ví dụ như khi gọi phương thức từ xa RPC) cần được serialization trước, sau khi nhận được đối tượng đã serialization cần phải deserialization；
- Trước khi lưu đối tượng vào tệp cần serialization, đọc đối tượng từ tệp ra cần deserialization；
- Trước khi lưu đối tượng vào cơ sở dữ liệu (như Redis) cần dùng serialization, đọc đối tượng từ cơ sở dữ liệu cache ra cần deserialization；
- Khi cần chuyển đối tượng thành biểu diễn byte để lưu trữ lâu dài hoặc truyền qua các component, thường cần serialization；đối tượng Java thông thường khi sử dụng trong bộ nhớ JVM không cần serialization.

Wikipedia giới thiệu về serialization như sau：

> **Serialization** trong xử lý dữ liệu của khoa học máy tính, là chỉ quá trình chuyển đổi cấu trúc dữ liệu hoặc trạng thái đối tượng thành định dạng có thể sử dụng được (ví dụ như lưu thành tệp, lưu trong bộ đệm, hoặc gửi qua mạng), để sau này trong cùng hoặc một môi trường máy tính khác, có thể khôi phục lại trạng thái ban đầu. Khi lấy lại byte theo định dạng serialization, có thể sử dụng nó để tạo ra bản sao có cùng ngữ nghĩa với đối tượng gốc. Đối với nhiều đối tượng, như các đối tượng phức tạp sử dụng nhiều tham chiếu, quá trình tái tạo serialization này không hề dễ dàng. Serialization đối tượng trong lập trình hướng đối tượng, không bao quát các hàm mà đối tượng gốc liên quan. Quá trình này còn được gọi là object marshalling. Thao tác ngược lại trích xuất cấu trúc dữ liệu từ một chuỗi byte, là deserialization (còn gọi là unmarshalling).

Tóm lại：**Mục đích chính của serialization là chuyển đổi đối tượng thành biểu diễn phù hợp cho truyền tải mạng hoặc lưu trữ lâu dài vào hệ thống tệp, cơ sở dữ liệu, cache và các phương tiện khác.**

![](https://oss.javaguide.cn/github/javaguide/a478c74d-2c48-40ae-9374-87aacf05188c.png)

<p style="text-align:right;font-size:13px;color:gray">https://www.corejavaguru.com/java/serialization/interview-questions-1</p>

**Giao thức serialization tương ứng với tầng nào trong mô hình 4 tầng TCP/IP？**

Chúng ta biết rằng hai bên giao tiếp mạng phải áp dụng và tuân thủ cùng một giao thức. Mô hình 4 tầng TCP/IP như dưới đây, giao thức serialization thuộc tầng nào？

1. Tầng Application
2. Tầng Transport
3. Tầng Network
4. Tầng Network Interface

![Mô hình 4 tầng TCP/IP](https://oss.javaguide.cn/github/javaguide/cs-basics/network/tcp-ip-4-model.png)

Như hình trên, trong mô hình giao thức 7 tầng OSI, những gì tầng Presentation làm chủ yếu là xử lý dữ liệu người dùng của tầng Application chuyển đổi thành luồng nhị phân. Ngược lại, chính là chuyển đổi luồng nhị phân thành dữ liệu người dùng của tầng Application. Điều này chẳng phải tương ứng với serialization và deserialization sao？

Bởi vì, tầng Application, tầng Presentation và tầng Session trong mô hình giao thức 7 tầng OSI tương ứng đều thuộc tầng Application trong mô hình 4 tầng TCP/IP, cho nên giao thức serialization thuộc về một phần của tầng Application trong giao thức TCP/IP.

### Nếu có một số field không muốn serialization thì làm thế nào？

Đối với biến không muốn serialization, sử dụng từ khóa `transient` để trang trí.

Tác dụng của từ khóa `transient` là：ngăn chặn các biến được trang trí bởi từ khóa này trong instance bị serialization；khi đối tượng được deserialization, giá trị biến được trang trí bởi `transient` sẽ không được lưu trữ lâu dài và khôi phục.

Về `transient` còn có vài điểm cần lưu ý：

- `transient` chỉ có thể trang trí biến, không thể trang trí lớp và phương thức.
- Biến được `transient` trang trí, sau khi deserialization giá trị biến sẽ được đặt thành giá trị mặc định của kiểu. Ví dụ, nếu là trang trí kiểu `int`, thì sau khi deserialization kết quả sẽ là `0`.
- Biến `static` vì không thuộc về bất kỳ đối tượng (Object) nào, cho nên dù có từ khóa `transient` trang trí hay không, đều sẽ không bị serialization.

### Các giao thức serialization phổ biến有哪些？

Cách serialization đi kèm JDK thường không được sử dụng, vì hiệu suất serialization thấp và tồn tại vấn đề bảo mật. Các giao thức serialization thường dùng hơn có Hessian, Kryo, Protobuf, ProtoStuff, đây đều là các giao thức serialization dựa trên nhị phân.

Còn như JSON và XML thuộc về cách serialization dạng văn bản. Mặc dù khả năng đọc tốt hơn, nhưng hiệu năng kém hơn, thường không được lựa chọn.

### Tại sao không khuyến khích sử dụng serialization đi kèm JDK？

Chúng ta rất ít hoặc gần như không bao giờ trực tiếp sử dụng cách serialization đi kèm JDK, nguyên nhân chính có những điểm sau：

- **Không hỗ trợ gọi cross-language** : Nếu gọi service được phát triển bằng ngôn ngữ khác thì không hỗ trợ.
- **Hiệu năng kém**：So với các framework serialization khác, hiệu năng thấp hơn, nguyên nhân chính là mảng byte sau khi serialization có kích thước lớn, dẫn đến chi phí truyền tải tăng.
- **Tồn tại vấn đề bảo mật**：Bản thân serialization và deserialization không có vấn đề. Nhưng khi dữ liệu đầu vào của deserialization có thể bị người dùng kiểm soát, thì kẻ tấn công có thể thông qua việc xây dựng đầu vào độc hại, khiến deserialization sinh ra đối tượng không mong đợi, trong quá trình đó thực thi mã tùy ý được xây dựng. Bài đọc liên quan：[Ứng dụng bảo mật：Lỗ hổng JAVA Deserialization](https://cryin.github.io/blog/secure-development-java-deserialization-vulnerability/)。

## I/O

Để tìm hiểu chi tiết về I/O, xem các bài viết dưới đây, trong đó đề cập đến các điểm kiến thức và câu hỏi phỏng vấn toàn diện hơn.

- [Tổng hợp kiến thức cơ bản Java IO](https://javaguide.cn/java/io/io-basis.html)
- [Tổng hợp Design Pattern trong Java IO](https://javaguide.cn/java/io/io-design-patterns.html)
- [Giải thích chi tiết mô hình Java IO](https://javaguide.cn/java/io/io-model.html)

### Bạn có hiểu về Java IO Stream không？

IO tức là `Input/Output`, đầu vào và đầu ra. Quá trình dữ liệu nhập vào bộ nhớ máy tính là đầu vào, ngược lại xuất ra bộ nhớ ngoài (như cơ sở dữ liệu, tệp, máy chủ từ xa) là đầu ra. Quá trình truyền dữ liệu giống như dòng nước, vì vậy được gọi là IO Stream. IO Stream trong Java được chia thành input stream và output stream, còn dựa trên cách xử lý dữ liệu lại được chia thành byte stream và character stream.

Hơn 40 lớp của Java IO Stream đều được派生 từ 4 abstract class cơ sở sau đây.

- `InputStream`/`Reader`: Lớp cơ sở của tất cả input stream, cái trước là byte input stream, cái sau là character input stream.
- `OutputStream`/`Writer`: Lớp cơ sở của tất cả output stream, cái trước là byte output stream, cái sau là character output stream.

### Tại sao I/O Stream lại chia thành byte stream và character stream？

Bản chất câu hỏi là muốn hỏi：**Dù là đọc ghi tệp hay gửi nhận mạng, đơn vị lưu trữ nhỏ nhất của thông tin đều là byte, vậy tại sao thao tác I/O Stream lại chia thành thao tác byte stream và thao tác character stream？**

Cá nhân tôi cho rằng chủ yếu có hai lý do：

- Character stream là do Java Virtual Machine chuyển đổi byte mà có, quá trình này cũng khá tốn thời gian；
- Nếu chúng ta không biết kiểu mã hóa, trong quá trình sử dụng byte stream rất dễ xảy ra vấn đề lỗi font.

### Trong Java IO có những Design Pattern nào？

Đáp án tham khảo：[Tổng hợp Design Pattern trong Java IO](https://javaguide.cn/java/io/io-design-patterns.html)

### ⭐️ Sự khác biệt giữa BIO、NIO và AIO？

Đáp án tham khảo：[Giải thích chi tiết mô hình Java IO](https://javaguide.cn/java/io/io-model.html)

## Syntactic Sugar

### Syntactic Sugar là gì？

**Syntactic Sugar** là chỉ một loại cú pháp đặc biệt được ngôn ngữ lập trình thiết kế ra để thuận tiện cho lập trình viên phát triển chương trình, loại cú pháp này không hề ảnh hưởng đến chức năng của ngôn ngữ lập trình. Cùng thực hiện một chức năng, mã viết dựa trên syntactic sugar thường đơn giản ngắn gọn hơn và dễ đọc hơn.

Ví dụ, `for-each` trong Java chính là một syntactic sugar thường dùng, nguyên lý của nó thực chất là dựa trên vòng lặp for thông thường và iterator.

```java
String[] strs = {"JavaGuide", "Tài khoản công khai：JavaGuide", "Blog：https://javaguide.cn/"};
for (String s : strs) {
    System.out.println(s);
}
```

Tuy nhiên, JVM thực ra không thể nhận diện syntactic sugar, syntactic sugar của Java muốn được thực thi chính xác, cần phải thông qua trình biên dịch tiến hành desugar, tức là trong giai đoạn biên dịch chương trình chuyển đổi nó thành cú pháp cơ bản mà JVM nhận biết được. Điều này cũng gián tiếp nói lên rằng, trong Java thứ thực sự hỗ trợ syntactic sugar là trình biên dịch Java chứ không phải JVM. Nếu bạn xem mã nguồn của `com.sun.tools.javac.main.JavaCompiler`, bạn sẽ phát hiện trong `compile()` có một bước là gọi `desugar()`, phương thức này chính là phụ trách thực hiện việc desugar.

### Trong Java có những syntactic sugar phổ biến nào？

Các syntactic sugar phổ biến nhất trong Java chủ yếu có generic, autoboxing/unboxing, varargs, enum, inner class, enhanced for loop, cú pháp try-with-resources, lambda expression v.v.

Để tìm hiểu chi tiết về các syntactic sugar này, xem bài viết này [Giải thích chi tiết Syntactic Sugar trong Java](./syntactic-sugar.md)。

<!-- @include: @article-footer.snippet.md -->
