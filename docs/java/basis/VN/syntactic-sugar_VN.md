---
title: Java Syntactic Sugar Chi Tiết
description: Phân tích chuyên sâu nguyên lý Syntactic Sugar trong Java: giải thích cơ chế biên dịch của autoboxing/unboxing, type erasure, enhanced for, varargs, enum, Lambda và các loại syntactic sugar khác, giúp tránh các lỗi thường gặp khi sử dụng.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java语法糖,自动装箱拆箱,泛型擦除,增强for循环,可变参数,枚举,内部类,Lambda表达式,语法糖原理
---

> 作者：Hollis
>
> 原文：<https://mp.weixin.qq.com/s/o4XdEMq1DL-nBS-f8Za5Aw>

Syntactic sugar là một chủ đề thường gặp trong phỏng vấn Java ở các công ty lớn.

Bài viết này đi từ góc độ nguyên lý biên dịch Java, đi sâu vào bytecode và class file, phân tích cặn kẽ nguyên lý và cách sử dụng syntactic sugar trong Java, giúp bạn vừa học cách dùng syntactic sugar, vừa hiểu được cơ chế đằng sau chúng.

## Syntactic sugar là gì?

**Syntactic Sugar** (cú pháp đường) là một thuật ngữ do nhà khoa học máy tính người Anh Peter.J.Landin đặt ra, dùng để chỉ một loại cú pháp được thêm vào ngôn ngữ lập trình, không làm thay đổi chức năng của ngôn ngữ nhưng giúp lập trình viên sử dụng thuận tiện hơn. Nói ngắn gọn, syntactic sugar giúp chương trình ngắn gọn hơn và dễ đọc hơn.

![](https://oss.javaguide.cn/github/javaguide/java/basis/syntactic-sugar/image-20220818175953954.png)

> Thú vị là trong lĩnh vực lập trình, ngoài syntactic sugar, còn có các khái niệm syntactic salt và syntactic saccharin, nhưng do giới hạn độ dài bài viết nên sẽ không mở rộng ở đây.

Hầu như mọi ngôn ngữ lập trình chúng ta biết đều có syntactic sugar. Tác giả cho rằng, số lượng syntactic sugar là một trong những tiêu chí đánh giá một ngôn ngữ có đủ mạnh hay không. Nhiều người nói Java là một "ngôn ngữ ít đường", nhưng thực ra từ Java 7 trở đi, Java đã liên tục bổ sung nhiều loại sugar, chủ yếu trong khuôn khổ dự án "Project Coin". Mặc dù hiện nay một số người vẫn cho rằng Java là ngôn ngữ ít đường, nhưng trong tương lai nó sẽ tiếp tục phát triển theo hướng "nhiều đường" hơn.

## Java có những loại syntactic sugar phổ biến nào?

Như đã đề cập ở trên, syntactic sugar tồn tại chủ yếu để giúp lập trình viên sử dụng thuận tiện hơn. Nhưng thực ra, **Java Virtual Machine không hỗ trợ những syntactic sugar này. Các syntactic sugar sẽ được chuyển đổi ngược về cấu trúc cú pháp cơ bản đơn giản trong giai đoạn biên dịch, quá trình này gọi là desugar (giải đường).**

Nhắc đến biên dịch, chắc hẳn ai cũng biết, trong Java, lệnh `javac` có thể biên dịch file nguồn đuôi `.java` thành file đuôi `.class` chứa bytecode chạy được trên JVM. Nếu bạn xem mã nguồn của `com.sun.tools.javac.main.JavaCompiler`, bạn sẽ thấy trong phương thức `compile()` có một bước gọi `desugar()`, phương thức này chính là nơi thực hiện việc giải syntactic sugar.

Các syntactic sugar phổ biến nhất trong Java bao gồm generics, varargs, conditional compilation, autoboxing/unboxing, inner class, v.v. Bài viết này sẽ phân tích nguyên lý đằng sau những syntactic sugar này, từng bước lột bỏ lớp vỏ đường để nhìn thấy bản chất.

Chúng ta sẽ sử dụng [decompiler](https://mp.weixin.qq.com/s?__biz=MzI3NzE0NjcwMg==&mid=2650120609&idx=1&sn=5659f96310963ad57d55b48cee63c788&chksm=f36bbc80c41c3596a1e4bf9501c6280481f1b9e06d07af354474e6f3ed366fef016df673a7ba&scene=21#wechat_redirect), bạn có thể dùng [Decompilers online](http://www.javadecompilers.com/) để decompile trực tuyến class file.

### switch hỗ trợ String và Enum

Như đã đề cập, từ Java 7, syntactic sugar trong Java dần phong phú hơn, một trong những thay đổi quan trọng là `switch` bắt đầu hỗ trợ `String`.

Trước khi bắt đầu, hãy điểm qua kiến thức nền: thời kỳ đầu, `switch` trong Java hỗ trợ `byte`, `short`, `char`, `int` và các wrapper type tương ứng, không hỗ trợ `boolean`, `long`, `float`, `double`. `char` biểu diễn UTF-16 code unit, không phải kiểu ASCII. Sau đó, Java bổ sung hỗ trợ cho enum và các kiểu tham chiếu như `String`.

Vậy hãy xem `switch` hỗ trợ `String` hoạt động thế nào qua đoạn mã sau:

```java
public class switchDemoString {
    public static void main(String[] args) {
        String str = "world";
        switch (str) {
        case "hello":
            System.out.println("hello");
            break;
        case "world":
            System.out.println("world");
            break;
        default:
            break;
        }
    }
}
```

Sau khi decompile, nội dung như sau:

```java
public class switchDemoString
{
    public switchDemoString()
    {
    }
    public static void main(String args[])
    {
        String str = "world";
        String s;
        switch((s = str).hashCode())
        {
        default:
            break;
        case 99162322:
            if(s.equals("hello"))
                System.out.println("hello");
            break;
        case 113318802:
            if(s.equals("world"))
                System.out.println("world");
            break;
        }
    }
}
```

Từ đoạn mã được sinh ra bởi một phiên bản `javac` cụ thể và sau đó decompile, ta có thể thấy rằng **`switch` với `String` được chuyển đổi thành dispatch theo `hashCode()` và kiểm tra bằng `equals()`.** Đây là chiến lược triển khai của trình biên dịch, không phải dạng bytecode bắt buộc theo JLS.

Quan sát kỹ có thể thấy, thứ thực sự được `switch` là giá trị hash, sau đó dùng phương thức `equals` để kiểm tra an toàn. Việc kiểm tra này là cần thiết vì hash có thể xảy ra collision. Do đó hiệu năng của nó không bằng khi dùng `switch` với enum hoặc hằng số nguyên thuần túy, nhưng cũng không quá tệ.

### Generics

Chúng ta đều biết nhiều ngôn ngữ hỗ trợ generics, nhưng không phải ai cũng biết rằng các trình biên dịch khác nhau xử lý generics theo cách khác nhau. Thông thường, một trình biên dịch xử lý generics theo hai cách: `Code specialization` và `Code sharing`. C++ và C# sử dụng cơ chế `Code specialization`, còn Java sử dụng cơ chế `Code sharing`.

> Cơ chế Code sharing tạo ra một biểu diễn bytecode duy nhất cho mỗi kiểu generic, và ánh xạ tất cả các instance của kiểu generic đó vào biểu diễn bytecode duy nhất này. Việc ánh xạ nhiều instance của kiểu generic vào một biểu diễn bytecode duy nhất được thực hiện thông qua type erasure (xóa kiểu).

Nói cách khác, **đối với JVM, nó hoàn toàn không hiểu cú pháp như `Map<String, String> map`. Cần phải giải syntactic sugar thông qua type erasure trong giai đoạn biên dịch.**

Quá trình type erasure chính diễn ra như sau: 1. Thay thế tất cả các tham số generic bằng kiểu biên trái nhất (kiểu cha cao nhất). 2. Loại bỏ tất cả các tham số kiểu.

Đoạn mã sau:

```java
Map<String, String> map = new HashMap<String, String>();
map.put("name", "hollis");
map.put("wechat", "Hollis");
map.put("blog", "www.hollischuang.com");
```

Sau khi giải syntactic sugar sẽ trở thành:

```java
Map map = new HashMap();
map.put("name", "hollis");
map.put("wechat", "Hollis");
map.put("blog", "www.hollischuang.com");
```

Đoạn mã sau:

```java
public static <A extends Comparable<A>> A max(Collection<A> xs) {
    Iterator<A> xi = xs.iterator();
    A w = xi.next();
    while (xi.hasNext()) {
        A x = xi.next();
        if (w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```

Sau khi type erasure sẽ trở thành:

```java
 public static Comparable max(Collection xs){
    Iterator xi = xs.iterator();
    Comparable w = (Comparable)xi.next();
    while(xi.hasNext())
    {
        Comparable x = (Comparable)xi.next();
        if(w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```

**Trong JVM không có generics, chỉ có các class và method thông thường. Tất cả tham số kiểu của generic class đều bị xóa khi biên dịch, generic class không có đối tượng `Class` riêng. Ví dụ, không tồn tại `List<String>.class` hay `List<Integer>.class`, mà chỉ có `List.class`.**

### Autoboxing và Unboxing

Autoboxing là việc Java tự động chuyển đổi giá trị kiểu nguyên thủy thành đối tượng tương ứng, ví dụ chuyển biến int thành đối tượng Integer, quá trình này gọi là boxing; ngược lại, chuyển đối tượng Integer thành giá trị kiểu int, quá trình này gọi là unboxing. Vì việc boxing và unboxing ở đây được thực hiện tự động mà không cần can thiệp thủ công, nên được gọi là autoboxing và unboxing. Các kiểu nguyên thủy byte, short, char, int, long, float, double và boolean tương ứng với các wrapper class Byte, Short, Character, Integer, Long, Float, Double, Boolean.

Hãy xem một đoạn mã autoboxing:

```java
 public static void main(String[] args) {
    int i = 10;
    Integer n = i;
}
```

Sau khi decompile, mã như sau:

```java
public static void main(String args[])
{
    int i = 10;
    Integer n = Integer.valueOf(i);
}
```

Tiếp theo xem một đoạn mã unboxing:

```java
public static void main(String[] args) {

    Integer i = 10;
    int n = i;
}
```

Sau khi decompile, mã như sau:

```java
public static void main(String args[])
{
    Integer i = Integer.valueOf(10);
    int n = i.intValue();
}
```

Từ nội dung decompile có thể thấy, khi boxing, tự động gọi phương thức `valueOf(int)` của `Integer`. Còn khi unboxing, tự động gọi phương thức `intValue` của `Integer`.

Vì vậy, **quá trình boxing được thực hiện bằng cách gọi phương thức valueOf của wrapper, còn quá trình unboxing được thực hiện bằng cách gọi phương thức xxxValue của wrapper.**

### Varargs (Tham số biến đổi)

Varargs (`variable arguments`) là một tính năng được giới thiệu từ Java 1.5. Nó cho phép một phương thức nhận số lượng tham số tùy ý.

Xem đoạn mã varargs sau, trong đó phương thức `print` nhận tham số biến đổi:

```java
public static void main(String[] args)
    {
        print("Holis", "公众号:Hollis", "博客：www.hollischuang.com", "QQ：907607222");
    }

public static void print(String... strs)
{
    for (int i = 0; i < strs.length; i++)
    {
        System.out.println(strs[i]);
    }
}
```

Sau khi decompile:

```java
 public static void main(String args[])
{
    print(new String[] {
        "Holis", "\u516C\u4F17\u53F7:Hollis", "\u535A\u5BA2\uFF1Awww.hollischuang.com", "QQ\uFF1A907607222"
    });
}

public static transient void print(String strs[])
{
    for(int i = 0; i < strs.length; i++)
        System.out.println(strs[i]);

}
```

Từ mã sau khi decompile có thể thấy, khi varargs được sử dụng, đầu tiên nó sẽ tạo ra một mảng, độ dài của mảng chính là số lượng tham số thực tế được truyền vào khi gọi phương thức, sau đó đặt tất cả giá trị tham số vào mảng này, rồi truyền mảng này làm tham số cho phương thức được gọi. (Ghi chú: `transient` chỉ có ý nghĩa khi sửa biến thành viên, việc nó "sửa phương thức" ở đây là do trong javassist cùng một giá trị số được dùng để biểu diễn cả `transient` và `vararg`, xem [tại đây](https://github.com/jboss-javassist/javassist/blob/7302b8b0a09f04d344a26ebe57f29f3db43f2a3e/src/main/javassist/bytecode/AccessFlag.java#L32).)

### Enum

Java SE5 cung cấp một kiểu mới - kiểu enum trong Java, từ khóa `enum` có thể tạo ra một kiểu mới từ một tập hợp hữu hạn các giá trị có tên, và những giá trị có tên này có thể được sử dụng như các thành phần chương trình thông thường, đây là một tính năng rất hữu ích.

Để xem mã nguồn, trước tiên cần có một class, vậy enum thực chất là class gì? Là `enum` chăng? Rõ ràng không phải, `enum` cũng giống như `class`, chỉ là một từ khóa, không phải là một class. Vậy enum được duy trì bởi class nào? Hãy viết một enum đơn giản:

```java
public enum t {
    SPRING,SUMMER;
}
```

Sau đó dùng decompiler để xem đoạn mã này thực sự được triển khai thế nào, nội dung sau khi decompile:

```java
// 枚举的二进制名称仍为 t，Java 标识符区分大小写
public final class t extends Enum
{
    private t(String s, int i)
    {
        super(s, i);
    }
    public static t[] values()
    {
        t at[];
        int i;
        t at1[];
        System.arraycopy(at = ENUM$VALUES, 0, at1 = new t[i = at.length], 0, i);
        return at1;
    }

    public static t valueOf(String s)
    {
        return (t) Enum.valueOf(t.class, s);
    }

    public static final t SPRING;
    public static final t SUMMER;
    private static final t ENUM$VALUES[];
    static
    {
        SPRING = new t("SPRING", 0);
        SUMMER = new t("SUMMER", 1);
        ENUM$VALUES = (new t[] {
            SPRING, SUMMER
        });
    }
}
```

Qua mã sau khi decompile, ta thấy `public final class t extends Enum`, điều này cho thấy class này kế thừa class `Enum`; enum hiện tại không chứa constant-specific class body, do đó nó ngầm định là `final`.

**Enum class được định nghĩa bằng `enum` sẽ trực tiếp kế thừa `Enum`, do đó không thể kế thừa class khác một cách tường minh, và cũng không thể bị class thông thường kế thừa. Enum class không có constant-specific class body thì ngầm định là `final`; chỉ cần có ít nhất một hằng số enum khai báo constant-specific class body, enum class sẽ ngầm định là `sealed`, các constant-specific class body này tương ứng với các anonymous subclass được phép của nó.**

### Inner Class

Inner class còn được gọi là nested class, có thể hiểu inner class như một thành viên thông thường của outer class.

**Inner class cũng là syntactic sugar vì nó chỉ là một khái niệm ở thời điểm biên dịch. File `outer.java` định nghĩa một inner class `inner`, sau khi biên dịch thành công, sẽ sinh ra hai file `.class` hoàn toàn khác nhau, là `outer.class` và `outer$inner.class`. Tuy nhiên, JLS nghiêm cấm nested class có cùng simple name với bất kỳ enclosing class hay interface nào.**

```java
public class OuterClass {
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public static void main(String[] args) {

    }

    class InnerClass{
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

Đoạn mã trên sau khi biên dịch sẽ sinh ra hai class file: `OuterClass$InnerClass.class`, `OuterClass.class`. Khi chúng ta thử decompile `OuterClass.class`, dòng lệnh sẽ in ra nội dung sau: `Parsing OuterClass.class...Parsing inner class OuterClass$InnerClass.class... Generating OuterClass.jad`. Nó sẽ decompile cả hai file, rồi cùng sinh ra một file `OuterClass.jad`. Nội dung file như sau:

```java
public class OuterClass
{
    class InnerClass
    {
        public String getName()
        {
            return name;
        }
        public void setName(String name)
        {
            this.name = name;
        }
        private String name;
        final OuterClass this$0;

        InnerClass()
        {
            this.this$0 = OuterClass.this;
            super();
        }
    }

    public OuterClass()
    {
    }
    public String getUserName()
    {
        return userName;
    }
    public void setUserName(String userName){
        this.userName = userName;
    }
    public static void main(String args1[])
    {
    }
    private String userName;
}
```

**Tại sao inner class có thể truy cập thuộc tính private của outer class**:

Chúng ta thêm một phương thức vào InnerClass, in ra thuộc tính userName của outer class:

```java
//省略其他属性
public class OuterClass {
    private String userName;
    ......
    class InnerClass{
    ......
        public void printOut(){
            System.out.println("Username from OuterClass:"+userName);
        }
    }
}

// 此时，使用javap -p命令对OuterClass反编译结果：
public classOuterClass {
    private String userName;
    ......
    static String access$000(OuterClass);
}
// 此时，InnerClass的反编译结果：
class OuterClass$InnerClass {
    final OuterClass this$0;
    ......
    public void printOut();
}

```

Thực tế, sau khi biên dịch, bên trong instance của inner class thường có tham chiếu `this$0` trỏ đến instance của outer class. Trong các class file được sinh bởi JDK 10 trở về trước, trình biên dịch thường sử dụng các synthetic access method như `access$000` để truy cập private member giữa các nested class, do đó phương thức `printOut()` sau khi decompile sẽ gần giống như sau. Từ JDK 11 trở đi, cơ chế nest-based access control được giới thiệu, các class trong cùng một nest có thể truy cập trực tiếp private member của nhau, thường không cần synthetic access method nữa:

```java
public void printOut() {
    System.out.println("Username from OuterClass:" + OuterClass.access$000(this.this$0));
}
```

Bổ sung:

1. Trong đầu ra `javac` điển hình của JDK 10 trở về trước, anonymous inner class, local inner class, static inner class cũng có thể truy cập thuộc tính private thông qua synthetic access method; từ JDK 11 trở đi thường sử dụng nest-based access control.
2. Static inner class không có tham chiếu `this$0`
3. Anonymous inner class, local inner class sử dụng biến cục bộ bằng cách sao chép, biến đó sau khi khởi tạo sẽ không thể bị thay đổi. Dưới đây là một ví dụ:

```java
public class OuterClass {
    private String userName;

    public void test(){
        //这里i初始化为1后就不能再被修改
        int i=1;
        class Inner{
            public void printName(){
                System.out.println(userName);
                System.out.println(i);
            }
        }
    }
}
```

Sau khi decompile:

```java
//javap命令反编译Inner的结果
//i被复制进内部类，且为final
class OuterClass$1Inner {
  final int val$i;
  final OuterClass this$0;
  OuterClass$1Inner();
  public void printName();
}

```

### Conditional Compilation (Biên dịch có điều kiện)

Thông thường, mỗi dòng mã trong chương trình đều tham gia biên dịch. Nhưng đôi khi vì mục đích tối ưu mã chương trình, ta chỉ muốn biên dịch một phần nội dung, lúc này cần thêm điều kiện vào chương trình, để trình biên dịch chỉ biên dịch những đoạn mã thỏa mãn điều kiện và loại bỏ những đoạn không thỏa mãn — đây chính là conditional compilation.

Trong C hoặc CPP, có thể thực hiện conditional compilation thông qua câu lệnh tiền xử lý. Thực ra trong Java cũng có thể thực hiện conditional compilation. Hãy xem đoạn mã sau:

```java
public class ConditionalCompilation {
    public static void main(String[] args) {
        final boolean DEBUG = true;
        if(DEBUG) {
            System.out.println("Hello, DEBUG!");
        }

        final boolean ONLINE = false;

        if(ONLINE){
            System.out.println("Hello, ONLINE!");
        }
    }
}
```

Sau khi decompile, mã như sau:

```java
public class ConditionalCompilation
{

    public ConditionalCompilation()
    {
    }

    public static void main(String args[])
    {
        boolean DEBUG = true;
        System.out.println("Hello, DEBUG!");
        boolean ONLINE = false;
    }
}
```

Trước tiên, ta phát hiện trong mã sau khi decompile không có `System.out.println("Hello, ONLINE!");`, đây chính là conditional compilation. Khi `if(ONLINE)` là false, trình biên dịch đã không biên dịch đoạn mã bên trong nó.

Vì vậy, **conditional compilation trong Java được thực hiện thông qua câu lệnh if với điều kiện là hằng số. Nguyên lý của nó cũng là syntactic sugar của ngôn ngữ Java. Dựa vào điều kiện if đúng hay sai, trình biên dịch sẽ trực tiếp loại bỏ khối mã của nhánh false. Conditional compilation thực hiện theo cách này phải nằm trong thân phương thức, không thể thực hiện conditional compilation trên cấu trúc của toàn bộ Java class hay trên các thuộc tính của class. So với conditional compilation của C/C++, điều này quả thực có nhiều hạn chế hơn. Ngay từ đầu thiết kế ngôn ngữ Java đã không đưa vào chức năng conditional compilation, tuy có hạn chế, nhưng có còn hơn không.**

### Assertion

Trong Java, từ khóa `assert` được giới thiệu từ JAVA SE 1.4. Để tránh lỗi do mã Java phiên bản cũ sử dụng từ khóa `assert`, Java mặc định không bật kiểm tra assertion khi thực thi (lúc này, tất cả các câu lệnh assert đều bị bỏ qua!). Để bật kiểm tra assertion, cần dùng tùy chọn `-enableassertions` hoặc `-ea`.

Xem một đoạn mã chứa assertion:

```java
public class AssertTest {
    public static void main(String args[]) {
        int a = 1;
        int b = 1;
        assert a == b;
        System.out.println("公众号：Hollis");
        assert a != b : "Hollis";
        System.out.println("博客：www.hollischuang.com");
    }
}
```

Sau khi decompile, mã như sau:

```java
public class AssertTest {
   public AssertTest()
    {
    }
    public static void main(String args[])
{
    int a = 1;
    int b = 1;
    if(!$assertionsDisabled && a != b)
        throw new AssertionError();
    System.out.println("\u516C\u4F17\u53F7\uFF1AHollis");
    if(!$assertionsDisabled && a == b)
    {
        throw new AssertionError("Hollis");
    } else
    {
        System.out.println("\u535A\u5BA2\uFF1Awww.hollischuang.com");
        return;
    }
}

static final boolean $assertionsDisabled = !com/hollis/suguar/AssertTest.desiredAssertionStatus();

}
```

Rõ ràng, mã sau khi decompile phức tạp hơn nhiều so với mã của chúng ta. Vì vậy, sử dụng syntactic sugar assert đã giúp chúng ta tiết kiệm rất nhiều mã. **Thực ra, cơ chế cơ bản của assertion là câu lệnh if: nếu kết quả assertion là true, không làm gì cả, chương trình tiếp tục thực thi; nếu kết quả assertion là false, chương trình ném `AssertionError` để ngắt việc thực thi.** `-enableassertions` sẽ thiết lập giá trị của trường \$assertionsDisabled.

### Numeric Literal (Hằng số chữ số)

Trong Java 7, numeric literal, dù là số nguyên hay số thực, đều cho phép chèn số lượng dấu gạch dưới tùy ý giữa các chữ số. Những dấu gạch dưới này không ảnh hưởng đến giá trị của literal, mục đích chỉ là để dễ đọc hơn.

Ví dụ:

```java
public class Test {
    public static void main(String... args) {
        int i = 10_000;
        System.out.println(i);
    }
}
```

Sau khi decompile:

```java
public class Test
{
  public static void main(String[] args)
  {
    int i = 10000;
    System.out.println(i);
  }
}
```

Không thấy `_` trong kết quả decompile, vì nó chỉ là một phần cú pháp của literal trong mã nguồn, không ảnh hưởng đến giá trị số và cũng không được ghi vào class file. **Trình biên dịch phải nhận diện và kiểm tra vị trí của `_`, sau đó ghi giá trị số của literal vào bytecode.**

### for-each

Enhanced for loop (`for-each`) chắc hẳn ai cũng quen thuộc, thường xuyên dùng trong phát triển hàng ngày, nó giúp viết ít mã hơn nhiều so với vòng lặp for thông thường. Vậy syntactic sugar này được thực hiện như thế nào ở phía sau?

```java
public static void main(String... args) {
    String[] strs = {"Hollis", "公众号：Hollis", "博客：www.hollischuang.com"};
    for (String s : strs) {
        System.out.println(s);
    }
    List<String> strList = ImmutableList.of("Hollis", "公众号：Hollis", "博客：www.hollischuang.com");
    for (String s : strList) {
        System.out.println(s);
    }
}
```

Sau khi decompile, mã như sau:

```java
public static transient void main(String args[])
{
    String strs[] = {
        "Hollis", "\u516C\u4F17\u53F7\uFF1AHollis", "\u535A\u5BA2\uFF1Awww.hollischuang.com"
    };
    String args1[] = strs;
    int i = args1.length;
    for(int j = 0; j < i; j++)
    {
        String s = args1[j];
        System.out.println(s);
    }

    List strList = ImmutableList.of("Hollis", "\u516C\u4F17\u53F7\uFF1AHollis", "\u535A\u5BA2\uFF1Awww.hollischuang.com");
    String s;
    for(Iterator iterator = strList.iterator(); iterator.hasNext(); System.out.println(s))
        s = (String)iterator.next();

}
```

Mã rất đơn giản, **nguyên lý thực hiện của for-each thực chất là sử dụng vòng lặp for thông thường và iterator.**

### try-with-resource

Trong Java, đối với các tài nguyên tốn kém như thao tác file IO stream, kết nối cơ sở dữ liệu, sau khi sử dụng phải kịp thời đóng lại thông qua phương thức close, nếu không tài nguyên sẽ luôn ở trạng thái mở, có thể dẫn đến các vấn đề như memory leak.

Cách đóng tài nguyên thường dùng là giải phóng trong khối `finally`, tức gọi phương thức `close`. Ví dụ, chúng ta thường viết mã như sau:

```java
public static void main(String[] args) {
    BufferedReader br = null;
    try {
        String line;
        br = new BufferedReader(new FileReader("d:\\hollischuang.xml"));
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    } catch (IOException e) {
        // handle exception
    } finally {
        try {
            if (br != null) {
                br.close();
            }
        } catch (IOException ex) {
            // handle exception
        }
    }
}
```

Từ Java 7, JDK cung cấp một cách tốt hơn để đóng tài nguyên, sử dụng câu lệnh `try-with-resources`, viết lại đoạn mã trên, hiệu quả như sau:

```java
public static void main(String... args) {
    try (BufferedReader br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"))) {
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    } catch (IOException e) {
        // handle exception
    }
}
```

Xem này, đúng là một ân huệ lớn. Mặc dù trước đây tôi thường dùng `IOUtils` để đóng stream, chứ không dùng cách viết nhiều mã trong `finally`, nhưng syntactic sugar mới này trông có vẻ thanh lịch hơn nhiều. Hãy xem đằng sau nó:

```java
public static transient void main(String args[])
    {
        BufferedReader br;
        Throwable throwable;
        br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"));
        throwable = null;
        String line;
        try
        {
            while((line = br.readLine()) != null)
                System.out.println(line);
        }
        catch(Throwable throwable2)
        {
            throwable = throwable2;
            throw throwable2;
        }
        finally
        {
            if(br != null)
                if(throwable != null)
                    try
                    {
                        br.close();
                    }
                    catch(Throwable throwable1)
                    {
                        throwable.addSuppressed(throwable1);
                    }
                else
                    br.close();
        }
    }
}
```

**Thực ra nguyên lý đằng sau cũng rất đơn giản, những thao tác đóng tài nguyên mà chúng ta không làm, trình biên dịch đã làm thay chúng ta. Vì vậy, một lần nữa khẳng định, vai trò của syntactic sugar là giúp lập trình viên sử dụng thuận tiện hơn, nhưng cuối cùng vẫn phải chuyển thành ngôn ngữ mà trình biên dịch hiểu được.**

### Lambda Expression

Về lambda expression, có thể có người sẽ nghi ngờ, vì trên mạng có người nói nó không phải là syntactic sugar. Thực ra tôi muốn chỉnh lại quan điểm này. **Lambda expression không phải là syntactic sugar của anonymous inner class, nhưng nó cũng là một loại syntactic sugar. Cách thức triển khai thực tế phụ thuộc vào một số lambda API cấp thấp do JVM cung cấp.**

Hãy xem một lambda expression đơn giản, duyệt qua một list:

```java
public static void main(String... args) {
    List<String> strList = ImmutableList.of("Hollis", "公众号：Hollis", "博客：www.hollischuang.com");

    strList.forEach( s -> { System.out.println(s); } );
}
```

Tại sao nói nó không phải là syntactic sugar của inner class? Như đã nói ở phần inner class, inner class sau khi biên dịch sẽ có hai class file, nhưng class chứa lambda expression sau khi biên dịch chỉ có một file.

Sau khi decompile, mã như sau:

```java
public static /* varargs */ void main(String ... args) {
    ImmutableList strList = ImmutableList.of((Object)"Hollis", (Object)"\u516c\u4f17\u53f7\uff1aHollis", (Object)"\u535a\u5ba2\uff1awww.hollischuang.com");
    strList.forEach((Consumer<String>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)V, lambda$main$0(java.lang.String ), (Ljava/lang/String;)V)());
}

private static /* synthetic */ void lambda$main$0(String s) {
    System.out.println(s);
}
```

Có thể thấy, trong phương thức `forEach`, thực tế đã gọi phương thức `java.lang.invoke.LambdaMetafactory#metafactory`, tham số thứ tư `implMethod` của phương thức này chỉ định phương thức triển khai. Có thể thấy ở đây đã gọi một phương thức `lambda$main$0` để thực hiện việc in ra.

Hãy xem một ví dụ phức tạp hơn một chút, trước tiên lọc List, sau đó in ra:

```java
public static void main(String... args) {
    List<String> strList = ImmutableList.of("Hollis", "公众号：Hollis", "博客：www.hollischuang.com");

    List HollisList = strList.stream().filter(string -> string.contains("Hollis")).collect(Collectors.toList());

    HollisList.forEach( s -> { System.out.println(s); } );
}
```

Sau khi decompile, mã như sau:

```java
public static /* varargs */ void main(String ... args) {
    ImmutableList strList = ImmutableList.of((Object)"Hollis", (Object)"\u516c\u4f17\u53f7\uff1aHollis", (Object)"\u535a\u5ba2\uff1awww.hollischuang.com");
    List<Object> HollisList = strList.stream().filter((Predicate<String>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)Z, lambda$main$0(java.lang.String ), (Ljava/lang/String;)Z)()).collect(Collectors.toList());
    HollisList.forEach((Consumer<Object>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)V, lambda$main$1(java.lang.Object ), (Ljava/lang/Object;)V)());
}

private static /* synthetic */ void lambda$main$1(Object s) {
    System.out.println(s);
}

private static /* synthetic */ boolean lambda$main$0(String string) {
    return string.contains("Hollis");
}
```

Hai lambda expression lần lượt gọi hai phương thức `lambda$main$1` và `lambda$main$0`.

**Vì vậy, việc triển khai lambda expression thực tế phụ thuộc vào một số API cấp thấp, trong giai đoạn biên dịch, trình biên dịch sẽ giải syntactic sugar lambda expression, chuyển thành cách gọi các API nội bộ.**

## Những cạm bẫy có thể gặp

### Generics

**1. Khi generics gặp overload**

```java
public class GenericTypes {

    public static void method(List<String> list) {
        System.out.println("invoke method(List<String> list)");
    }

    public static void method(List<Integer> list) {
        System.out.println("invoke method(List<Integer> list)");
    }
}
```

Đoạn mã trên có hai hàm overload, vì kiểu tham số của chúng khác nhau, một cái là `List<String>`, cái kia là `List<Integer>`. Tuy nhiên, đoạn mã này không biên dịch được. Vì như chúng ta đã nói, tham số `List<Integer>` và `List<String>` sau khi biên dịch đều bị xóa, trở thành cùng một raw type List, hành động xóa kiểu khiến signature của hai phương thức này trở nên giống hệt nhau.

**2. Khi generics gặp catch**

Tham số kiểu của generics không thể dùng trong câu lệnh catch của Java exception handling. Vì exception handling được JVM thực hiện tại runtime. Do thông tin kiểu bị xóa, JVM không thể phân biệt hai kiểu exception là `MyException<String>` và `MyException<Integer>`.

**3. Khi generic class chứa biến static**

```java
public class StaticTest{
    public static void main(String[] args){
        GT<Integer> gti = new GT<Integer>();
        gti.var=1;
        GT<String> gts = new GT<String>();
        gts.var=2;
        System.out.println(gti.var);
    }
}
class GT<T>{
    public static int var=0;
    public void nothing(T x){}
}
```

Kết quả output của đoạn mã trên là: 2!

Một số bạn có thể lầm tưởng rằng các generic class là các class khác nhau, tương ứng với các bytecode khác nhau. Nhưng thực tế, do đã trải qua type erasure, tất cả các instance của generic class đều liên kết đến cùng một bản bytecode, biến static của generic class là được chia sẻ. Trong ví dụ trên, `GT<Integer>.var` và `GT<String>.var` thực chất là cùng một biến.

### Autoboxing và Unboxing

**So sánh bằng nhau giữa các đối tượng**

```java
public static void main(String[] args) {
    Integer a = 1000;
    Integer b = 1000;
    Integer c = 100;
    Integer d = 100;
    System.out.println("a == b is " + (a == b));
    System.out.println(("c == d is " + (c == d)));
}
```

Kết quả output:

```plain
a == b is false
c == d is true
```

Trong Java 5, một tính năng mới được giới thiệu trên thao tác Integer để tiết kiệm bộ nhớ và tăng hiệu năng. Các đối tượng số nguyên sử dụng cùng một object reference để thực hiện caching và tái sử dụng.

> Áp dụng cho khoảng giá trị nguyên từ -128 đến +127.
>
> Chỉ áp dụng cho autoboxing. Tạo đối tượng bằng constructor không áp dụng.

### Enhanced for loop

```java
for (Student stu : students) {
    if (stu.getId() == 2)
        students.remove(stu);
}
```

Sẽ ném ra ngoại lệ `ConcurrentModificationException`.

Ở đây liên quan đến cơ chế **fail-fast** của collection. Lấy `ArrayList` làm ví dụ, bên trong nó duy trì một biến đếm `modCount`, mỗi khi thay đổi cấu trúc collection (như thêm, xóa) thì biến đếm này sẽ tăng lên. Khi tạo `Iterator`, `modCount` hiện tại sẽ được ghi nhận là `expectedModCount`. Mỗi lần gọi `next()`, `Iterator` sẽ kiểm tra xem `modCount` có bằng `expectedModCount` hay không, nếu không bằng, nghĩa là collection đã bị thay đổi bởi cách khác trong quá trình duyệt, và sẽ ném ra ngoại lệ `java.util.ConcurrentModificationException`.

Vì vậy, `Iterator` không cho phép đối tượng đang được duyệt bị thay đổi trong quá trình làm việc. Nhưng bạn có thể dùng chính phương thức `remove()` của `Iterator` để xóa đối tượng. Phương thức `Iterator.remove()` sẽ đồng bộ cập nhật `expectedModCount` sau khi xóa phần tử, nhờ đó tránh được việc kích hoạt ngoại lệ này.

## Tổng kết

Bài viết đã giới thiệu 12 loại syntactic sugar thường dùng trong Java. Syntactic sugar đơn giản là một loại cú pháp được cung cấp cho lập trình viên để phát triển thuận tiện hơn. Nhưng loại cú pháp này chỉ có lập trình viên hiểu được. Để được thực thi, cần phải desugar, tức chuyển thành cú pháp mà JVM hiểu được. Khi chúng ta giải đường các syntactic sugar, bạn sẽ phát hiện rằng những cú pháp tiện lợi mà chúng ta dùng hàng ngày thực chất đều được tạo thành từ những cú pháp đơn giản hơn.

Với những syntactic sugar này, chúng ta có thể nâng cao đáng kể hiệu suất phát triển hàng ngày, nhưng đồng thời cũng phải tránh lạm dụng. Trước khi sử dụng, tốt nhất nên hiểu nguyên lý để tránh rơi vào cạm bẫy.

<!-- @include: @article-footer.snippet.md -->