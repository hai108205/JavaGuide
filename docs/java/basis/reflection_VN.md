---
title: Giải thích chi tiết về Java Reflection
description: Đi sâu vào nguyên lý và ứng dụng của Java Reflection: nắm vững các API cốt lõi Class, Method, Field, hiểu cách Reflection được sử dụng trong các framework như Spring, MyBatis, và tìm hiểu cách triển khai Dynamic Proxy.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java反射,反射机制,Class类,Method方法,Field字段,动态代理,框架原理,运行时操作
---

## Reflection là gì?

Nếu bạn đã từng nghiên cứu nguyên lý bên dưới của các framework hoặc tự viết framework, chắc hẳn bạn không còn xa lạ với khái niệm Reflection.

Reflection được coi là linh hồn của framework, chủ yếu bởi vì nó cho phép chúng ta phân tích class và thực thi các phương thức trong class tại thời điểm runtime.

Thông qua Reflection, bạn có thể lấy thông tin về field, method, constructor của class, đồng thời gọi hoặc đọc/ghi chúng trong phạm vi được phép bởi access control và module boundary. Phạm vi của các API cũng khác nhau, ví dụ `getMethods()` trả về các public method có thể truy cập, trong khi `getDeclaredMethods()` trả về các method được khai báo trong class hiện tại nhưng không bao gồm method kế thừa.

## Bạn có biết các tình huống ứng dụng của Reflection không?

Thông thường, phần lớn thời gian chúng ta viết code nghiệp vụ, hiếm khi tiếp xúc trực tiếp với các tình huống sử dụng Reflection.

Tuy nhiên, điều này không có nghĩa là Reflection vô dụng. Ngược lại, chính nhờ có Reflection mà bạn mới có thể dễ dàng sử dụng các framework khác nhau. Các framework như Spring/Spring Boot, MyBatis, v.v. đều sử dụng rất nhiều Reflection.

**Các framework này cũng sử dụng rất nhiều Dynamic Proxy, và việc triển khai Dynamic Proxy cũng phụ thuộc vào Reflection.**

Ví dụ dưới đây là đoạn code triển khai Dynamic Proxy thông qua JDK, trong đó sử dụng class Reflection `Method` để gọi phương thức được chỉ định.

```java
public class DebugInvocationHandler implements InvocationHandler {
    /**
     * 代理类中的真实对象
     */
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }


    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        System.out.println("after method " + method.getName());
        return result;
    }
}

```

Ngoài ra, một công cụ mạnh mẽ khác trong Java là **Annotation** cũng được triển khai bằng Reflection.

Tại sao khi bạn sử dụng Spring, chỉ với một annotation `@Component` là đã khai báo một class thành Spring Bean? Tại sao bạn chỉ cần một annotation `@Value` là có thể đọc được giá trị trong file cấu hình? Rốt cuộc chúng hoạt động như thế nào?

Tất cả những điều này là nhờ bạn có thể phân tích class dựa trên Reflection, sau đó lấy được annotation trên class/thuộc tính/phương thức/tham số của phương thức. Sau khi lấy được annotation, bạn có thể thực hiện các xử lý tiếp theo.

## Ưu nhược điểm của Reflection

**Ưu điểm**: Giúp code của chúng ta linh hoạt hơn, cung cấp sự tiện lợi cho các chức năng out-of-the-box của các framework.

**Nhược điểm**: Cho phép chúng ta có khả năng phân tích và thao tác class tại runtime, điều này cũng làm tăng vấn đề bảo mật. Ví dụ như có thể bỏ qua kiểm tra an toàn của tham số generic (kiểm tra an toàn của tham số generic diễn ra tại compile-time). Ngoài ra, hiệu năng của Reflection cũng kém hơn một chút, tuy nhiên đối với framework thì ảnh hưởng thực tế không đáng kể. Bài viết liên quan: [Java Reflection: Why is it so slow?](https://stackoverflow.com/questions/1392351/java-reflection-why-is-it-so-slow)

## Reflection thực chiến

### Bốn cách lấy Class Object

Nếu chúng ta muốn lấy động những thông tin này, chúng ta cần dựa vào Class Object. Class Object cho chương trình đang chạy biết về các method, biến và thông tin khác của một class. Java cung cấp bốn cách để lấy Class Object:

**1. Khi biết class cụ thể, có thể sử dụng:**

```java
Class alunbarClass = TargetObject.class;
```

Cách này phù hợp với tình huống đã biết kiểu cụ thể tại compile-time, việc lấy class literal không kích hoạt khởi tạo class.

**2. Thông qua `Class.forName()` truyền vào đường dẫn đầy đủ của class:**

```java
Class alunbarClass1 = Class.forName("cn.javaguide.TargetObject");
```

**3. Thông qua instance đối tượng `instance.getClass()`:**

```java
TargetObject o = new TargetObject();
Class alunbarClass2 = o.getClass();
```

**4. Thông qua class loader `xxxClassLoader.loadClass()` truyền vào đường dẫn class:**

```java
ClassLoader.getSystemClassLoader().loadClass("cn.javaguide.TargetObject");
```

Lấy Class Object thông qua class loader sẽ không thực hiện khởi tạo, nghĩa là không thực hiện hàng loạt bước bao gồm khởi tạo, static block và static object sẽ không được thực thi.

### Một số thao tác cơ bản với Reflection

1. Tạo một class `TargetObject` để chúng ta thao tác với Reflection.

```java
package cn.javaguide;

public class TargetObject {
    private String value;

    public TargetObject() {
        value = "JavaGuide";
    }

    public void publicMethod(String s) {
        System.out.println("I love " + s);
    }

    private void privateMethod() {
        System.out.println("value is " + value);
    }
}
```

2. Sử dụng Reflection để thao tác với method và thuộc tính của class này

```java
package cn.javaguide;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchFieldException {
        /**
         * 获取 TargetObject 类的 Class 对象并且创建 TargetObject 类实例
         */
        Class<?> targetClass = Class.forName("cn.javaguide.TargetObject");
        TargetObject targetObject = (TargetObject) targetClass.getDeclaredConstructor().newInstance();
        /**
         * 获取 TargetObject 类中定义的所有方法
         */
        Method[] methods = targetClass.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method.getName());
        }

        /**
         * 获取指定方法并调用
         */
        Method publicMethod = targetClass.getDeclaredMethod("publicMethod",
                String.class);

        publicMethod.invoke(targetObject, "JavaGuide");

        /**
         * 获取指定参数并对参数进行修改
         */
        Field field = targetClass.getDeclaredField("value");
        //为了对类中的参数进行修改我们取消安全检查
        field.setAccessible(true);
        field.set(targetObject, "JavaGuide");

        /**
         * 调用 private 方法
         */
        Method privateMethod = targetClass.getDeclaredMethod("privateMethod");
        //为了调用private方法我们取消安全检查
        privateMethod.setAccessible(true);
        privateMethod.invoke(targetObject);
    }
}

```

Nội dung output:

```plain
publicMethod
privateMethod
I love JavaGuide
value is JavaGuide
```

**Lưu ý**: Có độc giả đã đề cập rằng đoạn code trên khi chạy sẽ ném ra ngoại lệ `ClassNotFoundException`, nguyên nhân cụ thể là do bạn chưa thay thế tên package trong đoạn code này bằng package chứa `TargetObject` mà bạn đã tạo.
Có thể tham khảo bài viết: <https://www.cnblogs.com/chanshuyi/p/head_first_of_reflection.html>.

```java
Class<?> targetClass = Class.forName("cn.javaguide.TargetObject");
```

<!-- @include: @article-footer.snippet.md -->