---
title: Giải thích chi tiết về Proxy Pattern trong Java
description: Giải thích chi tiết nguyên lý và cách triển khai Proxy Pattern trong Java: so sánh sự khác biệt giữa static proxy và dynamic proxy, phân tích sâu cơ chế JDK dynamic proxy và CGLIB proxy, hiểu cách triển khai cross-cutting concerns trong AOP.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java代理模式,静态代理,动态代理,JDK动态代理,CGLIB代理,AOP,设计模式,代理实现
---

## 1. Proxy Pattern

Proxy Pattern là một design pattern tương đối dễ hiểu. Nói một cách đơn giản, **chúng ta sử dụng proxy object để thay thế cho việc truy cập trực tiếp vào real object (đối tượng thực), nhờ đó có thể cung cấp thêm các chức năng bổ sung mà không cần sửa đổi target object gốc, mở rộng chức năng của target object.**

**Vai trò chính của Proxy Pattern là mở rộng chức năng của target object, ví dụ như bạn có thể thêm một số thao tác tùy chỉnh trước và sau khi một phương thức của target object được thực thi.**

Lấy một ví dụ: cô dâu nhờ dì của mình thay mặt xử lý các câu hỏi của chú rể, mọi câu hỏi mà cô dâu nhận được đều đã được dì xử lý và lọc qua. Dì ở đây có thể được xem là proxy object của bạn, hành vi (phương thức) được ủy quyền là nhận và trả lời câu hỏi của chú rể.

![Understanding the Proxy Design Pattern | by Mithun Sasidharan | Medium](https://oss.javaguide.cn/2020-8/1*DjWCgTFm-xqbhbNQVsaWQw.png)

<p style="text-align:right;font-size:13px;color:gray">https://medium.com/@mithunsasidharan/understanding-the-proxy-design-pattern-5e63fe38052a</p>

Proxy Pattern có hai cách triển khai: static proxy và dynamic proxy. Trước tiên chúng ta hãy xem cách triển khai static proxy.

## 2. Static Proxy

Trong static proxy, mọi enhancement (nâng cao) đối với từng phương thức của target object đều được thực hiện thủ công (sẽ minh họa cụ thể bằng code ở phần sau), rất không linh hoạt (ví dụ: một khi interface thêm phương thức mới, cả target object và proxy object đều phải sửa đổi) và phiền phức (cần phải viết một proxy class riêng cho từng target class). Các tình huống ứng dụng thực tế rất rất ít, trong phát triển hàng ngày hầu như không thấy tình huống sử dụng static proxy.

Ở trên chúng ta đã nói về static proxy từ góc độ triển khai và ứng dụng, còn từ góc độ JVM, **static proxy biến interface, implementation class, proxy class thành các file class thực tế tại thời điểm biên dịch (compile-time).**

Các bước triển khai static proxy:

1. Định nghĩa một interface và implementation class của nó;
2. Tạo một proxy class cũng implement interface đó
3. Inject target object vào proxy class, sau đó trong phương thức tương ứng của proxy class gọi phương thức tương ứng trong target class. Bằng cách này, chúng ta có thể che chắn việc truy cập vào target object thông qua proxy class, đồng thời có thể thực hiện một số việc mình muốn trước và sau khi phương thức của target được thực thi.

Dưới đây minh họa bằng code!

**1. Định nghĩa interface gửi tin nhắn SMS**

```java
public interface SmsService {
    String send(String message);
}
```

**2. Triển khai interface gửi tin nhắn SMS**

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

**3. Tạo proxy class và cũng implement interface gửi tin nhắn SMS**

```java
public class SmsProxy implements SmsService {

    private final SmsService smsService;

    public SmsProxy(SmsService smsService) {
        this.smsService = smsService;
    }

    @Override
    public String send(String message) {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method send()");
        smsService.send(message);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method send()");
        return null;
    }
}
```

**4. Sử dụng thực tế**

```java
public class Main {
    public static void main(String[] args) {
        SmsService smsService = new SmsServiceImpl();
        SmsProxy smsProxy = new SmsProxy(smsService);
        smsProxy.send("java");
    }
}
```

Sau khi chạy đoạn code trên, console in ra:

```bash
before method send()
send message:java
after method send()
```

Có thể thấy từ kết quả đầu ra, chúng ta đã enhancement (nâng cao) phương thức `send()` của `SmsServiceImpl`.

## 3. Dynamic Proxy

So với static proxy, dynamic proxy linh hoạt hơn nhiều. Chúng ta không cần tạo một proxy class riêng cho từng target class, và cũng không bắt buộc phải implement interface, chúng ta có thể proxy trực tiếp implementation class (cơ chế CGLIB dynamic proxy).

**Từ góc độ JVM, dynamic proxy tạo ra class bytecode một cách động tại runtime và nạp vào JVM.**

Nhắc đến dynamic proxy, Spring AOP và RPC framework là hai thứ không thể không đề cập, việc triển khai của chúng đều phụ thuộc vào dynamic proxy.

**Dynamic proxy được sử dụng tương đối ít trong phát triển hàng ngày của chúng ta, nhưng trong các framework, nó gần như là một kỹ thuật bắt buộc phải dùng. Sau khi học được dynamic proxy, nó sẽ rất hữu ích cho việc hiểu và học nguyên lý của các framework khác nhau.**

Đối với Java, có nhiều cách triển khai dynamic proxy, ví dụ như **JDK Dynamic Proxy**, **CGLIB Dynamic Proxy**, v.v.

[guide-rpc-framework](https://github.com/Snailclimb/guide-rpc-framework) sử dụng JDK dynamic proxy, trước tiên chúng ta hãy xem cách sử dụng JDK dynamic proxy.

Ngoài ra, mặc dù [guide-rpc-framework](https://github.com/Snailclimb/guide-rpc-framework) không sử dụng **CGLIB Dynamic Proxy**, chúng ta vẫn sẽ giới thiệu ngắn gọn về cách sử dụng nó cũng như so sánh với **JDK Dynamic Proxy**.

### 3.1. Cơ chế JDK Dynamic Proxy

#### 3.1.1. Giới thiệu

**Trong cơ chế Java dynamic proxy, interface `InvocationHandler` và class `Proxy` là cốt lõi.**

Phương thức được sử dụng thường xuyên nhất trong class `Proxy` là: `newProxyInstance()`, phương thức này chủ yếu dùng để tạo ra một proxy object.

```java
    public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
    {
        ......
    }
```

Phương thức này có tổng cộng 3 tham số:

1. **loader**: class loader, dùng để nạp proxy object.
2. **interfaces**: một số interface được implement bởi class bị proxy;
3. **h**: object đã implement interface `InvocationHandler`;

Để triển khai dynamic proxy, còn cần phải implement `InvocationHandler` để tùy chỉnh logic xử lý. Khi dynamic proxy object của chúng ta gọi một phương thức, lời gọi phương thức này sẽ được chuyển tiếp đến phương thức `invoke` của class implement interface `InvocationHandler` để thực thi.

```java
public interface InvocationHandler {

    /**
     * 当你使用代理对象调用方法的时候实际会调用到这个方法
     */
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```

Phương thức `invoke()` có ba tham số sau:

1. **proxy**: proxy class được tạo động
2. **method**: tương ứng với phương thức được gọi bởi proxy class object
3. **args**: tham số của phương thức method hiện tại

Nói cách khác: **proxy object được tạo ra bởi phương thức `newProxyInstance()` của class `Proxy`, khi gọi phương thức, thực tế sẽ gọi đến phương thức `invoke()` của class implement interface `InvocationHandler`.** Bạn có thể tùy chỉnh logic xử lý trong phương thức `invoke()`, ví dụ như thực hiện một số việc trước và sau khi phương thức được thực thi.

#### 3.1.2. Các bước sử dụng JDK Dynamic Proxy

1. Định nghĩa một interface và implementation class của nó;
2. Tự định nghĩa `InvocationHandler` và ghi đè phương thức `invoke`, trong phương thức `invoke` chúng ta sẽ gọi phương thức gốc (phương thức của class bị proxy) và tùy chỉnh một số logic xử lý;
3. Tạo proxy object thông qua phương thức `Proxy.newProxyInstance(ClassLoader loader,Class<?>[] interfaces,InvocationHandler h)`;

#### 3.1.3. Ví dụ code

Nói như vậy có thể hơi trừu tượng và khó hiểu, tôi đưa ra một ví dụ, mọi người tự cảm nhận nhé!

**1. Định nghĩa interface gửi tin nhắn SMS**

```java
public interface SmsService {
    String send(String message);
}
```

**2. Triển khai interface gửi tin nhắn SMS**

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

**3. Định nghĩa một JDK dynamic proxy class**

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * @author shuang.kou
 * @createTime 2020年05月11日 11:23:00
 */
public class DebugInvocationHandler implements InvocationHandler {
    /**
     * 代理类中的真实对象
     */
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return result;
    }
}

```

Phương thức `invoke()`: khi dynamic proxy object của chúng ta gọi phương thức gốc, cuối cùng thực tế gọi đến là phương thức `invoke()`, sau đó phương thức `invoke()` thay chúng ta gọi phương thức gốc của object bị proxy.

**4. Factory class để lấy proxy object**

```java
public class JdkProxyFactory {
    public static Object getProxy(Object target) {
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(), // 目标类的类加载器
                target.getClass().getInterfaces(),  // 代理需要实现的接口，可指定多个
                new DebugInvocationHandler(target)   // 代理对象对应的自定义 InvocationHandler
        );
    }
}
```

`getProxy()`: chủ yếu lấy proxy object của một class nào đó thông qua phương thức `Proxy.newProxyInstance（）`

**5. Sử dụng thực tế**

```java
SmsService smsService = (SmsService) JdkProxyFactory.getProxy(new SmsServiceImpl());
smsService.send("java");
```

Sau khi chạy đoạn code trên, console in ra:

```plain
before method send
send message:java
after method send
```

### 3.2. Cơ chế CGLIB Dynamic Proxy

#### 3.2.1. Giới thiệu

**JDK Dynamic Proxy có một vấn đề chí mạng nhất là nó chỉ có thể proxy các class đã implement interface.**

**Để giải quyết vấn đề này, chúng ta có thể sử dụng cơ chế CGLIB Dynamic Proxy để tránh hạn chế đó.**

[CGLIB](https://github.com/cglib/cglib)(_Code Generation Library_) là một thư viện sinh bytecode dựa trên [ASM](http://www.baeldung.com/java-asm), nó cho phép chúng ta sửa đổi và sinh bytecode động tại runtime. CGLIB triển khai proxy thông qua cơ chế kế thừa (inheritance). Rất nhiều open-source framework nổi tiếng đều sử dụng [CGLIB](https://github.com/cglib/cglib), ví dụ như trong module AOP của Spring: nếu target object đã implement interface, mặc định sử dụng JDK Dynamic Proxy, ngược lại sử dụng CGLIB Dynamic Proxy.

**Trong cơ chế CGLIB Dynamic Proxy, interface `MethodInterceptor` và class `Enhancer` là cốt lõi.**

Bạn cần tự định nghĩa `MethodInterceptor` và ghi đè phương thức `intercept`, `intercept` dùng để intercept (chặn) và enhancement (nâng cao) phương thức của class bị proxy.

```java
public interface MethodInterceptor
extends Callback{
    // 拦截被代理类中的方法
    public Object intercept(Object obj, java.lang.reflect.Method method, Object[] args,MethodProxy proxy) throws Throwable;
}

```

1. **obj**: object bị proxy (object cần được enhancement)
2. **method**: phương thức bị intercept (phương thức cần được enhancement)
3. **args**: tham số đầu vào của phương thức
4. **proxy**: dùng để gọi phương thức gốc

Bạn có thể sử dụng class `Enhancer` để lấy class bị proxy một cách động, khi proxy class gọi phương thức, thực tế gọi đến là phương thức `intercept` trong `MethodInterceptor`.

#### 3.2.2. Các bước sử dụng CGLIB Dynamic Proxy

1. Định nghĩa một class;
2. Tự định nghĩa `MethodInterceptor` và ghi đè phương thức `intercept`, `intercept` dùng để intercept và enhancement phương thức của class bị proxy, tương tự như phương thức `invoke` trong JDK Dynamic Proxy;
3. Tạo proxy class thông qua phương thức `create()` của class `Enhancer`;

#### 3.2.3. Ví dụ code

Khác với JDK Dynamic Proxy không cần thêm dependency bổ sung. [CGLIB](https://github.com/cglib/cglib)(_Code Generation Library_) thực chất thuộc về một dự án open-source, nếu bạn muốn sử dụng nó, cần phải thêm dependency liên quan một cách thủ công.

```xml
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

**1. Triển khai một class sử dụng Alibaba Cloud để gửi tin nhắn SMS**

```java
package github.javaguide.dynamicProxy.cglibDynamicProxy;

public class AliSmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

**2. Tự định nghĩa `MethodInterceptor` (method interceptor)**

```java
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * 自定义MethodInterceptor
 */
public class DebugMethodInterceptor implements MethodInterceptor {


    /**
     * @param o           代理对象本身（注意不是原始对象，如果使用method.invoke(o, args)会导致循环调用）
     * @param method      被拦截的方法（需要增强的方法）
     * @param args        方法入参
     * @param methodProxy 高性能的方法调用机制，避免反射开销
     */
    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object object = methodProxy.invokeSuper(o, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return object;
    }

}
```

**3. Lấy proxy class**

```java
import net.sf.cglib.proxy.Enhancer;

public class CglibProxyFactory {

    public static Object getProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置被代理类
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new DebugMethodInterceptor());
        // 创建代理类
        return enhancer.create();
    }
}
```

**4. Sử dụng thực tế**

```java
AliSmsService aliSmsService = (AliSmsService) CglibProxyFactory.getProxy(AliSmsService.class);
aliSmsService.send("java");
```

Sau khi chạy đoạn code trên, console in ra:

```bash
before method send
send message:java
after method send
```

### 3.3. So sánh JDK Dynamic Proxy và CGLIB Dynamic Proxy

1. JDK Dynamic Proxy là giải pháp chính thức (của Oracle/OpenJDK), nó yêu cầu class bị proxy phải implement interface. Nguyên lý của nó là tạo động một implementation class của interface để làm proxy. CGLIB là giải pháp của bên thứ ba, nó không yêu cầu interface. Nguyên lý của nó là tạo động một subclass của class bị proxy để làm proxy. Nhưng cũng chính vì sử dụng kế thừa (inheritance), nên nó không thể proxy class được khai báo `final`, và phương thức bị proxy cũng không được là `final` hoặc `private`.
2. Xét về hiệu suất của cả hai, trong phần lớn trường hợp JDK Dynamic Proxy đều tốt hơn, và khi phiên bản JDK được nâng cấp, ưu thế này càng trở nên rõ ràng hơn.

## 4. So sánh Static Proxy và Dynamic Proxy

Sự khác biệt cốt lõi giữa static proxy và dynamic proxy nằm ở **thời điểm xác định mối quan hệ proxy, tính linh hoạt trong triển khai và chi phí bảo trì**.

| Tiêu chí so sánh              | Static Proxy                                                                                          | Dynamic Proxy                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Thời điểm xác định quan hệ proxy | Compile-time (tạo file `.class` bytecode cố định sau khi biên dịch)                                | Runtime (tạo động proxy class bytecode và nạp vào JVM)                                    |
| Cách triển khai               | Viết proxy class thủ công trước khi biên dịch, thường thông qua composition (tổ hợp) và delegation (ủy thác) gọi target object | Không cần viết proxy class cụ thể thủ công, đóng gói logic enhancement thông qua `Handler`/`Interceptor` |
| Phụ thuộc interface           | Không bắt buộc; static proxy dựa trên interface thường cho proxy class và target class tuân theo cùng một interface | JDK Dynamic Proxy hướng interface, CGLIB và các subclass proxy khác hướng implementation class có thể kế thừa |
| Lượng code và khả năng bảo trì | Lượng code lớn (càng nhiều target class, càng nhiều proxy class), chi phí bảo trì cao; khi interface thêm phương thức mới, target class và proxy class cần sửa đổi đồng bộ | Lượng code rất ít (logic enhancement chung có thể tái sử dụng), khả năng bảo trì tốt; giải phóng phụ thuộc với interface, thay đổi interface không ảnh hưởng đến proxy logic |
| Ưu điểm cốt lõi               | Triển khai đơn giản, logic trực quan, không có phụ thuộc framework bổ sung                           | Tính linh hoạt cao, khả năng tái sử dụng cao, giảm code trùng lặp, thích ứng với các tình huống phức tạp |
| Tình huống ứng dụng điển hình  | Decorator pattern đơn giản, nhu cầu enhancement cho một số ít class cố định                           | Spring AOP, RPC framework (như Dubbo), ORM framework                                      |

## 5. Tổng kết

Bài viết này chủ yếu giới thiệu hai cách triển khai của Proxy Pattern: static proxy và dynamic proxy. Bao gồm thực hành static proxy và dynamic proxy, sự khác biệt giữa static proxy và dynamic proxy, sự khác biệt giữa JDK Dynamic Proxy và CGLIB Dynamic Proxy, v.v.

Tất cả source code được đề cập trong bài viết, bạn có thể tìm thấy tại đây: [https://github.com/Snailclimb/guide-rpc-framework-learning/tree/master/src/main/java/github/javaguide/proxy](https://github.com/Snailclimb/guide-rpc-framework-learning/tree/master/src/main/java/github/javaguide/proxy)。

<!-- @include: @article-footer.snippet.md -->