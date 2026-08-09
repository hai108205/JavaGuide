---
title: Tổng hợp từ khóa Java
description: Tổng hợp hệ thống các từ khóa Java thường dùng: giải thích chi tiết cách dùng và phân biệt các từ khóa final, static, this, super, volatile, transient, synchronized, giúp lập trình viên Java nắm vững cú pháp cốt lõi.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java关键字,final关键字,static关键字,this关键字,super关键字,volatile,transient,synchronized
---

# Tổng hợp từ khóa final, static, this, super

## Từ khóa final

**Từ khóa final, có nghĩa là cuối cùng, không thể thay đổi, được dùng để sửa đổi (modify) lớp, phương thức và biến, có các đặc điểm sau:**

1. Lớp được final sửa đổi không thể bị kế thừa (extend), tất cả các phương thức thành viên trong lớp final sẽ được ngầm định chỉ định là phương thức final;

2. Phương thức được final sửa đổi không thể bị ghi đè (override);

3. Biến được final sửa đổi chỉ có thể được gán giá trị một lần. Nếu là biến kiểu dữ liệu nguyên thủy, giá trị của nó không thể thay đổi sau khi khởi tạo; nếu là biến kiểu tham chiếu, sau khi khởi tạo không thể trỏ đến đối tượng khác, nhưng bản thân đối tượng được tham chiếu vẫn có thể thay đổi. Chỉ những biến final thỏa mãn điều kiện "constant variable" của JLS mới là hằng số compile-time.

Giải thích: Có hai lý do để sử dụng phương thức final:

1. Khóa phương thức, ngăn bất kỳ lớp kế thừa nào sửa đổi ngữ nghĩa của nó;
2. Hiệu năng. Trong các phiên bản Java cũ, phương thức final sẽ được chuyển thành lời gọi nội tuyến (inline). Nhưng nếu phương thức quá lớn, có thể không thấy bất kỳ cải thiện hiệu năng nào từ lời gọi nội tuyến (các phiên bản Java hiện tại không cần sử dụng phương thức final để tối ưu hóa này nữa).

## Từ khóa static

**Từ khóa static chủ yếu có bốn tình huống sử dụng sau:**

1. **Sửa đổi biến thành viên và phương thức thành viên:** Thành viên được static sửa đổi thuộc về lớp, không thuộc về một đối tượng riêng lẻ của lớp đó, được tất cả các đối tượng trong lớp chia sẻ, có thể và được khuyến nghị gọi thông qua tên lớp. Vị trí lưu trữ cụ thể của biến static là chi tiết triển khai của JVM; lấy HotSpot từ JDK 8 trở đi làm ví dụ, metadata của lớp nằm trong Metaspace của native memory, còn biến static của lớp nằm trong Java heap. Cú pháp gọi: `TênLớp.TênBiếnStatic` `TênLớp.TênPhươngThứcStatic()`
2. **Khối mã static:** Khối mã static được định nghĩa trong lớp, bên ngoài phương thức, khối mã static thực thi trước khối mã non-static (khối mã static —> khối mã non-static —> phương thức khởi tạo). Dù lớp đó tạo bao nhiêu đối tượng, khối mã static cũng chỉ thực thi một lần.
3. **Lớp nội bộ static (static chỉ có thể sửa đổi lớp nội bộ):** Có một sự khác biệt lớn nhất giữa lớp nội bộ static và lớp nội bộ non-static: lớp nội bộ non-static sau khi biên dịch sẽ ngầm lưu giữ một tham chiếu, tham chiếu này trỏ đến lớp ngoài (outer class) đã tạo ra nó, nhưng lớp nội bộ static thì không có. Không có tham chiếu này đồng nghĩa với: 1. Việc tạo nó không phụ thuộc vào việc tạo lớp ngoài. 2. Nó không thể sử dụng bất kỳ biến thành viên và phương thức non-static nào của lớp ngoài.
4. **Static import (dùng để import tài nguyên static trong lớp, tính năng mới từ 1.5):** Cú pháp: `import static` hai từ khóa này dùng kết hợp có thể chỉ định import tài nguyên static cụ thể trong một lớp nào đó, và không cần dùng tên lớp để gọi thành viên static trong lớp, có thể trực tiếp sử dụng biến thành viên static và phương thức thành viên static.

## Từ khóa this

Từ khóa this dùng để tham chiếu đến instance hiện tại của lớp. Ví dụ:

```java
class Manager {
    Employees[] employees;
    void manageEmployees() {
        int totalEmp = this.employees.length;
        System.out.println("Total employees: " + totalEmp);
        this.report();
    }
    void report() { }
}
```

Trong ví dụ trên, từ khóa this được dùng ở hai vị trí:

- this.employees.length: truy cập biến của instance hiện tại của lớp Manager.
- this.report(): gọi phương thức của instance hiện tại của lớp Manager.

Từ khóa này là tùy chọn, điều đó có nghĩa là nếu ví dụ trên không sử dụng từ khóa this thì cũng hoạt động tương tự. Tuy nhiên, sử dụng từ khóa this có thể làm cho mã nguồn dễ đọc và dễ hiểu hơn.

## Từ khóa super

Từ khóa super dùng để truy cập biến và phương thức của lớp cha từ lớp con. Ví dụ:

```java
public class Super {
    protected int number;
    protected void showNumber() {
        System.out.println("number = " + number);
    }
}
public class Sub extends Super {
    void bar() {
        super.number = 10;
        super.showNumber();
    }
}
```

Trong ví dụ trên, lớp Sub truy cập biến thành viên number của lớp cha và gọi phương thức `showNumber()` của lớp cha Super.

**Các vấn đề cần lưu ý khi sử dụng this và super:**

- Khi sử dụng `super()` trong constructor để gọi constructor khác của lớp cha, câu lệnh này phải nằm ở dòng đầu tiên của constructor, nếu không trình biên dịch sẽ báo lỗi. Tương tự, khi dùng this để gọi constructor khác trong cùng lớp, cũng phải đặt ở dòng đầu tiên.
- this, super không thể dùng trong phương thức static.

**Giải thích ngắn gọn:**

Thành viên được static sửa đổi thuộc về lớp, trong ngữ cảnh static không có instance hiện tại, do đó không thể sử dụng `this`. `super` cũng không phải là một tham chiếu độc lập trỏ đến "đối tượng lớp cha", mà là một dạng cú pháp giới hạn dùng để truy cập thành viên lớp cha hoặc gọi constructor lớp cha, do đó cũng không thể sử dụng trong ngữ cảnh static.

## Tham khảo

- <https://www.codejava.net/java-core/the-java-language/java-keywords>
- <https://blog.csdn.net/u013393958/article/details/79881037>

# Chi tiết từ khóa static

## Từ khóa static chủ yếu có bốn tình huống sử dụng sau

1. Sửa đổi biến thành viên và phương thức thành viên
2. Khối mã static
3. Sửa đổi lớp (chỉ có thể sửa đổi lớp nội bộ)
4. Static import (dùng để import tài nguyên static trong lớp, tính năng mới từ 1.5)

### Sửa đổi biến thành viên và phương thức thành viên (thường dùng)

Thành viên được static sửa đổi thuộc về lớp, không thuộc về một đối tượng riêng lẻ của lớp đó, được tất cả các đối tượng trong lớp chia sẻ, có thể và được khuyến nghị gọi thông qua tên lớp. Vị trí lưu trữ cụ thể của biến static là chi tiết triển khai của JVM.

Method Area, giống như Java heap, là vùng dữ liệu runtime được chia sẻ giữa các thread. Đặc tả JVM quy định nó lưu trữ thông tin cấu trúc của mỗi lớp, chẳng hạn như runtime constant pool, dữ liệu field và method, cũng như mã của method và constructor. Cách bố trí lưu trữ cụ thể do triển khai JVM quyết định.

Trong HotSpot JDK 7 trở về trước, Method Area chủ yếu được triển khai bằng Permanent Generation (PermGen), nhưng Method Area và PermGen không hoàn toàn tương đương. JDK 8 đã loại bỏ PermGen: metadata của lớp được chuyển sang lưu trong Metaspace thuộc native memory, còn string constant và biến static của lớp nằm trong Java heap.

Cú pháp gọi:

- `TênLớp.TênBiếnStatic`
- `TênLớp.TênPhươngThứcStatic()`

Nếu biến hoặc phương thức được khai báo là private thì có nghĩa là thuộc tính hoặc phương thức đó chỉ có thể được truy cập bên trong lớp chứ không thể truy cập từ bên ngoài lớp.

Phương thức kiểm thử:

```java
public class StaticBean {
    String name;
    //静态变量
    static int age;
    public StaticBean(String name) {
        this.name = name;
    }
    //静态方法
    static void sayHello() {
        System.out.println("Hello i am java");
    }
    @Override
    public String toString() {
        return "StaticBean{"+
                "name=" + name + ",age=" + age +
                "}";
    }
}
```

```java
public class StaticDemo {
    public static void main(String[] args) {
        StaticBean staticBean = new StaticBean("1");
        StaticBean staticBean2 = new StaticBean("2");
        StaticBean staticBean3 = new StaticBean("3");
        StaticBean staticBean4 = new StaticBean("4");
        StaticBean.age = 33;
        System.out.println(staticBean + " " + staticBean2 + " " + staticBean3 + " " + staticBean4);
        //StaticBean{name=1,age=33} StaticBean{name=2,age=33} StaticBean{name=3,age=33} StaticBean{name=4,age=33}
        StaticBean.sayHello();//Hello i am java
    }
}
```

### Khối mã static

Khối mã static được định nghĩa trong lớp, bên ngoài phương thức, khối mã static thực thi trước khối mã non-static (khối mã static —> khối mã non-static —> phương thức khởi tạo). Dù lớp đó tạo bao nhiêu đối tượng, khối mã static cũng chỉ thực thi một lần.

Cú pháp của khối mã static là

```plain
static {
语句体;
}
```

Một lớp có thể có nhiều khối mã static, vị trí có thể đặt tùy ý, nó không nằm trong bất kỳ thân phương thức nào. Khối mã static thực thi khi lớp được khởi tạo (initialization); nếu có nhiều khối, JVM sẽ thực thi chúng theo thứ tự xuất hiện trong lớp, mỗi khối mã chỉ thực thi một lần. Việc tải lớp (loading) có thể xảy ra trước khi khởi tạo (initialization).

![](https://oss.javaguide.cn/github/javaguide/88531075.jpg)

Khối mã static có thể gán giá trị cho biến static được định nghĩa sau nó, nhưng không thể truy cập (đọc).

### Lớp nội bộ static

Có một sự khác biệt lớn nhất giữa lớp nội bộ static và lớp nội bộ non-static, chúng ta biết rằng lớp nội bộ non-static sau khi biên dịch sẽ ngầm lưu giữ một tham chiếu, tham chiếu này trỏ đến lớp ngoài đã tạo ra nó, nhưng lớp nội bộ static thì không có. Không có tham chiếu này đồng nghĩa với:

1. Việc tạo nó không phụ thuộc vào việc tạo lớp ngoài.
2. Nó không thể sử dụng bất kỳ biến thành viên và phương thức non-static nào của lớp ngoài.

Ví dụ (lớp nội bộ static triển khai Singleton pattern)

```java
public class Singleton {
    //声明为 private 避免调用默认构造方法创建对象
    private Singleton() {
    }
   // 声明为 private 表明静态内部该类只能在该 Singleton 类中被访问
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    public static Singleton getUniqueInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

Khi gọi `getUniqueInstance()` và lần đầu tiên chủ động sử dụng `SingletonHolder.INSTANCE`, `SingletonHolder` mới được khởi tạo (initialization), lúc này `INSTANCE` được khởi tạo. JVM có thể tải (load) `SingletonHolder` sớm hơn, nhưng sẽ không vì thế mà thực thi khởi tạo static của nó, và có thể đảm bảo lớp đó chỉ được khởi tạo một lần.

Cách này không chỉ có lợi ích của lazy initialization, mà còn được JVM cung cấp hỗ trợ về thread-safe.

### Static import

Cú pháp: import static

Hai từ khóa này dùng kết hợp có thể chỉ định import tài nguyên static cụ thể trong một lớp nào đó, và không cần dùng tên lớp để gọi thành viên static trong lớp, có thể trực tiếp sử dụng biến thành viên static và phương thức thành viên static

```java
 //将Math中的所有静态资源导入，这时候可以直接使用里面的静态方法，而不用通过类名进行调用
 //如果只想导入单一某个静态方法，只需要将*换成对应的方法名即可
import static java.lang.Math.*;//换成import static java.lang.Math.max;即可指定单一静态方法max导入
public class Demo {
  public static void main(String[] args) {
    int max = max(1,2);
    System.out.println(max);
  }
}
```

## Nội dung bổ sung

### Phương thức static và phương thức non-static

Phương thức static thuộc về bản thân lớp, phương thức non-static thuộc về từng đối tượng được tạo ra từ lớp đó. Nếu phương thức của bạn thực hiện thao tác không phụ thuộc vào các biến và phương thức riêng lẻ của lớp, hãy đặt nó là static (điều này sẽ làm cho footprint của chương trình nhỏ hơn). Nếu không, nó nên là non-static.

Ví dụ

```java
class Foo {
    int i;
    public Foo(int i) {
       this.i = i;
    }
    public static String method1() {
       return "An example string that doesn't depend on i (an instance variable)";
    }
    public int method2() {
       return this.i + 1;  //Depends on i
    }
}
```

Bạn có thể gọi phương thức static như thế này: `Foo.method1()`. Nếu bạn thử dùng cách này để gọi method2 sẽ thất bại. Nhưng cách này thì được

```java
Foo bar = new Foo(1);
bar.method2();
```

Tổng kết:

- Khi gọi phương thức static từ bên ngoài, có thể dùng cách "TênLớp.TênPhươngThức", cũng có thể dùng cách "TênĐốiTượng.TênPhươngThức". Còn phương thức instance chỉ có cách sau. Nói cách khác, gọi phương thức static có thể không cần tạo đối tượng.
- Phương thức static khi truy cập thành viên của lớp hiện tại, chỉ cho phép truy cập thành viên static (tức là biến thành viên static và phương thức static), mà không cho phép truy cập biến thành viên instance và phương thức instance; phương thức instance thì không có hạn chế này

### `static{}` khối mã static và `{}` khối mã non-static (khối mã khởi tạo instance)

Điểm giống nhau: đều có thể định nghĩa nhiều khối trong cùng một lớp; nhiều khối mã static trong cùng một lớp được đưa vào quá trình khởi tạo lớp theo thứ tự văn bản, nhiều khối khởi tạo instance được đưa vào quá trình khởi tạo instance theo thứ tự văn bản.

Điểm khác nhau: khối mã static thực thi một lần khi lớp được khởi tạo, thời điểm kích hoạt không nhất thiết là lần `new` đầu tiên; khối mã non-static (khối khởi tạo instance) thực thi mỗi lần khởi tạo instance mới, và được đưa vào quá trình khởi tạo instance cùng với các instance field initializer theo thứ tự văn bản. Chúng chạy sau khi constructor lớp cha trả về, trước khi các câu lệnh tiếp theo của constructor thực thi; nếu constructor ủy nhiệm (delegate) cho constructor khác trong cùng lớp thông qua `this(...)`, thì quá trình khởi tạo này được thực hiện bởi constructor trong chuỗi ủy nhiệm thực sự gọi constructor lớp cha. Khối mã trần trong phương thức thông thường chỉ là khối mã cục bộ, không phải khối khởi tạo instance.

> **🐛 Chỉnh sửa (xem: [issue #677](https://github.com/Snailclimb/JavaGuide/issues/677))**: Khối mã static có thể thực thi khi lần đầu tiên new đối tượng, nhưng không nhất thiết chỉ thực thi khi lần đầu tiên new. Ví dụ như khi tạo đối tượng Class thông qua `Class.forName("ClassDemo")` cũng sẽ thực thi, tức là new hoặc `Class.forName("ClassDemo")` đều sẽ thực thi khối mã static.
> Thông thường, nếu có một số mã như các biến hoặc đối tượng thường dùng nhất của dự án phải được thực thi khi dự án khởi động, thì cần sử dụng khối mã static, loại mã này được thực thi chủ động. Nếu chúng ta muốn thiết kế có thể gọi phương thức trong lớp mà không cần tạo đối tượng, ví dụ: lớp `Arrays`, lớp `Character`, lớp `String`, v.v., thì cần sử dụng phương thức static, sự khác biệt giữa hai loại là khối mã static được thực thi tự động còn phương thức static được thực thi khi được gọi.

Ví dụ：

```java
public class Test {
    public Test() {
        System.out.print("默认构造方法！--");
    }
    //非静态代码块
    {
        System.out.print("非静态代码块！--");
    }
    //静态代码块
    static {
        System.out.print("静态代码块！--");
    }
    private static void test() {
        System.out.print("静态方法中的内容! --");
        {
            System.out.print("静态方法中的代码块！--");
        }
    }
    public static void main(String[] args) {
        Test test = new Test();
        Test.test();//静态代码块！--静态方法中的内容! --静态方法中的代码块！--
    }
}
```

Đoạn mã trên xuất ra:

```plain
静态代码块！--非静态代码块！--默认构造方法！--静态方法中的内容! --静态方法中的代码块！--
```

Khi chỉ thực thi `Test.test();` thì xuất ra:

```plain
静态代码块！--静态方法中的内容! --静态方法中的代码块！--
```

Khi chỉ thực thi `Test test = new Test();` thì xuất ra:

```plain
静态代码块！--非静态代码块！--默认构造方法！--
```

Sự khác biệt giữa khối mã non-static và constructor là: khối mã non-static dùng để khởi tạo thống nhất cho tất cả các đối tượng, còn constructor dùng để khởi tạo cho đối tượng tương ứng, bởi vì constructor có thể có nhiều, chạy constructor nào thì sẽ tạo ra đối tượng như thế nào, nhưng dù tạo đối tượng nào, cũng sẽ thực thi khối mã khởi tạo (instance initializer) giống nhau trước. Nói cách khác, khối mã khởi tạo định nghĩa nội dung khởi tạo chung của các đối tượng khác nhau.

### Tham khảo

- <https://blog.csdn.net/chen13579867831/article/details/78995480>
- <https://www.cnblogs.com/chenssy/p/3388487.html>
- <https://www.cnblogs.com/Qian123/p/5713440.html>

<!-- @include: @article-footer.snippet.md -->