---
title: Giải thích chi tiết về Design Pattern trong Spring
description: Giải thích chi tiết về Design Pattern trong Spring Framework, bao gồm Factory Pattern, Proxy Pattern, Singleton Pattern, Template Method và các ứng dụng thực tế trong mã nguồn Spring.
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring设计模式,工厂模式,代理模式,模板方法,单例,策略模式,适配器模式,Spring源码
---

"Hai câu hỏi 'JDK sử dụng những Design Pattern nào? Spring sử dụng những Design Pattern nào?' khá phổ biến trong các buổi phỏng vấn."

Tôi đã tìm kiếm trên mạng về các bài giảng giải thích Design Pattern trong Spring, hầu hết đều na ná nhau và phần lớn đã cũ. Vì vậy, tôi đã dành vài ngày để tự tổng hợp lại.

Do năng lực cá nhân có hạn, nếu có bất kỳ sai sót nào trong bài viết, mong mọi người góp ý. Ngoài ra, bài viết có giới hạn về độ dài, nên đối với Design Pattern cũng như một số phần giải thích mã nguồn, tôi chỉ đề cập sơ lược. Mục đích chính của bài viết này là ôn lại các Design Pattern được sử dụng trong Spring.

## Inversion of Control (IoC) và Dependency Injection (DI)

**IoC (Inversion of Control - Đảo ngược điều khiển)** là một khái niệm cực kỳ quan trọng trong Spring, nó không phải là một công nghệ, mà là một tư tưởng thiết kế nhằm giảm sự phụ thuộc (decoupling). Mục đích chính của IoC là sử dụng một "bên thứ ba" (IoC Container trong Spring) để thực hiện việc giảm sự phụ thuộc giữa các đối tượng có quan hệ phụ thuộc lẫn nhau (IoC Container quản lý các đối tượng, bạn chỉ cần sử dụng chúng), từ đó giảm độ kết dính (coupling) giữa các đoạn mã.

**IoC là một nguyên tắc (principle), không phải là một pattern. Các pattern dưới đây (nhưng không giới hạn) là những pattern triển khai nguyên tắc IoC.**

![ioc-patterns](https://oss.javaguide.cn/github/javaguide/ioc-patterns.png)

**Spring IoC Container giống như một nhà máy (factory), khi chúng ta cần tạo một đối tượng, chỉ cần cấu hình tệp cấu hình/annotation là xong, hoàn toàn không cần quan tâm đến việc đối tượng được tạo ra như thế nào.** IoC Container chịu trách nhiệm tạo đối tượng, kết nối các đối tượng lại với nhau, cấu hình các đối tượng đó, và quản lý toàn bộ vòng đời của các đối tượng này từ khi tạo ra cho đến khi chúng bị hủy hoàn toàn.

Trong một dự án thực tế, nếu một lớp Service có hàng trăm thậm chí hàng nghìn lớp làm nền tảng cho nó, chúng ta cần khởi tạo Service này, bạn có thể phải tìm hiểu tất cả các hàm khởi tạo (constructor) của các lớp nền tảng của Service đó mỗi lần, điều này có thể khiến người ta phát điên. Nếu sử dụng IoC, bạn chỉ cần cấu hình xong, sau đó tham chiếu đến nó ở nơi cần dùng là được, điều này giúp tăng đáng kể khả năng bảo trì của dự án và giảm độ khó khi phát triển.

> Về cách hiểu Spring IoC, bạn nên xem câu trả lời này trên Zhihu: <https://www.zhihu.com/question/23277575/answer/169698662> , rất hay.

**Hiểu Inversion of Control như thế nào?** Lấy một ví dụ: "Đối tượng a phụ thuộc vào đối tượng b, khi đối tượng a cần sử dụng đối tượng b thì phải tự mình tạo ra nó. Nhưng khi hệ thống đưa vào IoC Container, đối tượng a và đối tượng b mất đi liên kết trực tiếp. Lúc này, khi đối tượng a cần sử dụng đối tượng b, chúng ta có thể yêu cầu IoC Container tạo một đối tượng b và tiêm (inject) vào đối tượng a." Quá trình đối tượng a nhận được đối tượng phụ thuộc b, từ hành vi chủ động trở thành hành vi bị động, quyền điều khiển bị đảo ngược, đó chính là nguồn gốc của cái tên Inversion of Control (Đảo ngược điều khiển).

**DI (Dependency Injection - Tiêm phụ thuộc) là một Design Pattern để thực hiện Inversion of Control, Dependency Injection chính là việc truyền biến instance (instance variable) vào trong một đối tượng.**

## Factory Design Pattern (Mẫu thiết kế Nhà máy)

Spring sử dụng Factory Pattern thông qua `BeanFactory` hoặc `ApplicationContext` để tạo các đối tượng bean.

**So sánh hai loại:**

- `BeanFactory`: Cung cấp các khả năng cơ bản của Spring IoC Container. Khi sử dụng trực tiếp `BeanFactory` cơ bản, container thường không chủ động khởi tạo trước tất cả các singleton bean, mà chỉ tạo bean khi có yêu cầu đầu tiên.
- `ApplicationContext`: Mở rộng từ `BeanFactory`, bổ sung thêm các khả năng như phát hành sự kiện (event publishing), quốc tế hóa (i18n), nạp tài nguyên (resource loading), và mặc định sẽ khởi tạo trước các singleton bean không lười (non-lazy) trong giai đoạn khởi động container; các `prototype` bean và các bean được đánh dấu lazy sẽ không bị tạo toàn bộ cùng một lúc vì lý do này.

Ba lớp triển khai phổ biến của `ApplicationContext`:

1. `ClassPathXmlApplicationContext`: Coi tệp ngữ cảnh như là tài nguyên classpath.
2. `FileSystemXmlApplicationContext`: Nạp thông tin định nghĩa ngữ cảnh từ tệp XML trong hệ thống tệp.
3. `XmlWebApplicationContext`: Nạp thông tin định nghĩa ngữ cảnh từ tệp XML trong hệ thống Web.

Example:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class App {
  public static void main(String[] args) {
    ApplicationContext context = new FileSystemXmlApplicationContext(
        "C:/work/IOC Containers/springframework.applicationcontext/src/main/resources/bean-factory-config.xml");

    HelloApplicationContext obj = (HelloApplicationContext) context.getBean("helloApplicationContext");
    obj.getMsg();
  }
}
```

## Singleton Design Pattern (Mẫu thiết kế Đơn nhất)

Trong hệ thống của chúng ta, có một số đối tượng mà chúng ta chỉ cần duy nhất một instance, ví dụ như: thread pool, cache, hộp thoại (dialog), registry, đối tượng log, driver cho các thiết bị như máy in, card đồ họa. Thực tế, những loại đối tượng này chỉ có thể có một instance duy nhất, nếu tạo ra nhiều instance có thể dẫn đến một số vấn đề, chẳng hạn như: hành vi chương trình bất thường, sử dụng tài nguyên quá mức hoặc kết quả không nhất quán.

**Lợi ích của việc sử dụng Singleton Pattern:**

- Đối với các đối tượng được sử dụng thường xuyên, có thể bỏ qua thời gian tạo đối tượng, đối với những đối tượng nặng (heavyweight object), đây là một khoản tiết kiệm chi phí hệ thống rất đáng kể;
- Do số lần thực hiện thao tác `new` giảm đi, tần suất sử dụng bộ nhớ hệ thống cũng giảm theo, điều này sẽ giảm áp lực cho GC (Garbage Collection) và rút ngắn thời gian tạm dừng GC.

**Phạm vi (scope) mặc định của bean trong Spring chính là singleton (đơn nhất).** Ngoài phạm vi singleton, bean trong Spring còn có các phạm vi sau:

- **prototype** : Mỗi lần lấy sẽ tạo ra một instance bean mới. Nói cách khác, gọi `getBean()` hai lần liên tiếp sẽ nhận được hai instance Bean khác nhau.
- **request** (chỉ khả dụng trong Web Application) : Mỗi HTTP request sẽ tạo ra một bean mới (request bean), bean đó chỉ có hiệu lực trong phạm vi HTTP request hiện tại.
- **session** (chỉ khả dụng trong Web Application) : Mỗi HTTP request đến từ một session mới sẽ tạo ra một bean mới (session bean), bean đó chỉ có hiệu lực trong phạm vi HTTP session hiện tại.
- **application** (chỉ khả dụng trong Web Application): Mỗi `ServletContext` tương ứng với một instance Bean, bean đó chỉ có hiệu lực trong vòng đời của Web Application hiện tại. Các phiên bản Spring cũ còn cung cấp phạm vi `globalSession` độc lập cho ứng dụng Portlet, phạm vi này không thuộc danh sách phạm vi tiêu chuẩn hiện tại.
- **websocket** (chỉ khả dụng trong Web Application): Mỗi phiên WebSocket sẽ tạo ra một bean mới.

Spring triển khai Singleton Pattern thông qua một phương thức đặc biệt là sử dụng `ConcurrentHashMap` để tạo ra singleton registry (bảng đăng ký đơn nhất).

Mã nguồn cốt lõi triển khai Singleton trong Spring:

```java
// 通过 ConcurrentHashMap（线程安全） 实现单例注册表
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(64);

public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
        Assert.notNull(beanName, "'beanName' must not be null");
        synchronized (this.singletonObjects) {
            // 检查缓存中是否存在实例
            Object singletonObject = this.singletonObjects.get(beanName);
            if (singletonObject == null) {
                //...省略了很多代码
                try {
                    singletonObject = singletonFactory.getObject();
                }
                //...省略了很多代码
                // 如果实例对象在不存在，我们注册到单例注册表中。
                addSingleton(beanName, singletonObject);
            }
            return (singletonObject != NULL_OBJECT ? singletonObject : null);
        }
    }
    //将对象添加到单例注册表
    protected void addSingleton(String beanName, Object singletonObject) {
            synchronized (this.singletonObjects) {
                this.singletonObjects.put(beanName, (singletonObject != null ? singletonObject : NULL_OBJECT));

            }
        }
}
```

**Singleton Bean có tồn tại vấn đề thread safety (an toàn luồng) không?**

Phần lớn thời gian chúng ta không sử dụng đa luồng (multi-threading) trong dự án, nên ít người quan tâm đến vấn đề này. Singleton Bean tồn tại vấn đề thread safety, chủ yếu là vì khi nhiều luồng cùng thao tác trên cùng một đối tượng sẽ tồn tại cạnh tranh tài nguyên (resource contention).

Có hai cách giải quyết phổ biến:

1. Trong Bean, cố gắng tránh định nghĩa các biến thành viên (member variable) có thể thay đổi (mutable).
2. Định nghĩa một biến thành viên `ThreadLocal` trong lớp, lưu các biến thành viên có thể thay đổi cần thiết vào trong `ThreadLocal` (cách được khuyến nghị).

Tuy nhiên, phần lớn Bean thực tế đều là stateless (không có biến instance - instance variable) (ví dụ như Dao, Service), trong trường hợp này, Bean là thread-safe.

## Proxy Design Pattern (Mẫu thiết kế Ủy nhiệm)

### Ứng dụng của Proxy Pattern trong AOP

**AOP (Aspect-Oriented Programming - Lập trình hướng khía cạnh)** có thể đóng gói những logic hoặc trách nhiệm không liên quan đến nghiệp vụ, nhưng được các module nghiệp vụ gọi chung (ví dụ như xử lý transaction, quản lý log, kiểm soát quyền truy cập), giúp giảm mã trùng lặp trong hệ thống, giảm độ kết dính giữa các module, và có lợi cho khả năng mở rộng cũng như bảo trì trong tương lai.

Spring AOP được xây dựng dựa trên Dynamic Proxy (Ủy nhiệm động), nếu đối tượng cần ủy nhiệm (proxy) đã triển khai một interface nào đó, thì Spring AOP sẽ sử dụng **JDK Proxy** để tạo đối tượng proxy, còn đối với những đối tượng không triển khai interface, không thể sử dụng JDK Proxy để ủy nhiệm, lúc này Spring AOP sẽ sử dụng **Cglib** để tạo ra một lớp con của đối tượng bị ủy nhiệm làm proxy, như hình dưới đây:

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/SpringAOPProcess.jpg)

Tất nhiên, bạn cũng có thể sử dụng AspectJ, Spring AOP đã tích hợp AspectJ, AspectJ có thể coi là framework AOP hoàn chỉnh nhất trong hệ sinh thái Java.

Sau khi sử dụng AOP, chúng ta có thể trừu tượng hóa một số chức năng chung, và sử dụng trực tiếp ở những nơi cần dùng, điều này giúp đơn giản hóa đáng kể lượng mã. Khi cần thêm chức năng mới cũng rất thuận tiện, điều này cũng cải thiện khả năng mở rộng của hệ thống. Các tình huống như chức năng log, quản lý transaction... đều sử dụng AOP.

### Spring AOP và AspectJ AOP có gì khác nhau?

**Spring AOP thuộc loại enhancement (tăng cường) lúc chạy (runtime), còn AspectJ là enhancement lúc biên dịch (compile-time).** Spring AOP dựa trên Proxy (Proxying), còn AspectJ dựa trên thao tác bytecode (Bytecode Manipulation).

Spring AOP đã tích hợp AspectJ, AspectJ có thể coi là framework AOP hoàn chỉnh nhất trong hệ sinh thái Java. AspectJ so với Spring AOP có chức năng mạnh mẽ hơn, nhưng Spring AOP thì tương đối đơn giản hơn.

Nếu số lượng aspect (khía cạnh) của chúng ta ít, thì sự khác biệt về hiệu năng giữa hai loại là không lớn. Nhưng khi có quá nhiều aspect, tốt nhất nên chọn AspectJ, nó nhanh hơn Spring AOP rất nhiều.

## Template Method (Mẫu thiết kế Phương thức Khuôn mẫu)

Template Method Pattern là một Behavioral Design Pattern (Mẫu thiết kế Hành vi), nó định nghĩa khung xương (skeleton) của một thuật toán trong một thao tác, và trì hoãn một số bước cho các lớp con. Template Method cho phép lớp con định nghĩa lại cách triển khai của một số bước cụ thể trong thuật toán mà không thay đổi cấu trúc của thuật toán đó.

```java
public abstract class Template {
    //这是我们的模板方法
    public final void TemplateMethod(){
        PrimitiveOperation1();
        PrimitiveOperation2();
        PrimitiveOperation3();
    }

    protected void  PrimitiveOperation1(){
        //当前类实现
    }

    //被子类实现的方法
    protected abstract void PrimitiveOperation2();
    protected abstract void PrimitiveOperation3();

}
public class TemplateImpl extends Template {

    @Override
    public void PrimitiveOperation2() {
        //当前类实现
    }

    @Override
    public void PrimitiveOperation3() {
        //当前类实现
    }
}

```

Trong Spring, các lớp thao tác với cơ sở dữ liệu có hậu tố Template như `JdbcTemplate`, `HibernateTemplate`... đều sử dụng Template Method Pattern. Thông thường, chúng ta sử dụng kế thừa (inheritance) để triển khai Template Method Pattern, nhưng Spring không sử dụng cách này, mà sử dụng Callback Pattern kết hợp với Template Method Pattern, vừa đạt được hiệu quả tái sử dụng mã, đồng thời tăng tính linh hoạt.

## Observer Pattern (Mẫu thiết kế Quan sát viên)

Observer Pattern là một Object Behavioral Pattern (Mẫu thiết kế Hành vi Đối tượng). Nó thể hiện mối quan hệ phụ thuộc giữa các đối tượng, khi một đối tượng thay đổi, tất cả các đối tượng phụ thuộc vào nó cũng sẽ phản ứng lại. Mô hình Spring Event-Driven (Sự kiện điều khiển) chính là một ứng dụng kinh điển của Observer Pattern. Mô hình Spring Event-Driven rất hữu ích, có thể giảm sự kết dính (decouple) mã của chúng ta trong nhiều tình huống. Ví dụ như mỗi lần thêm sản phẩm, chúng ta đều cần cập nhật lại chỉ mục sản phẩm, lúc này có thể sử dụng Observer Pattern để giải quyết vấn đề này.

### Ba vai trò trong mô hình Spring Event-Driven

#### Vai trò Event (Sự kiện)

`ApplicationEvent` (trong package `org.springframework.context`) đóng vai trò là event, đây là một abstract class, nó kế thừa từ `java.util.EventObject` và triển khai interface `java.io.Serializable`.

Spring mặc định tồn tại các event sau, chúng đều là các lớp triển khai của `ApplicationContextEvent` (kế thừa từ `ApplicationContextEvent`):

- `ContextStartedEvent`: Event được kích hoạt sau khi `ApplicationContext` khởi động;
- `ContextStoppedEvent`: Event được kích hoạt sau khi `ApplicationContext` dừng;
- `ContextRefreshedEvent`: Event được kích hoạt sau khi `ApplicationContext` khởi tạo hoặc làm mới (refresh) hoàn tất;
- `ContextClosedEvent`: Event được kích hoạt sau khi `ApplicationContext` đóng.

![ApplicationEvent-Subclass](https://oss.javaguide.cn/github/javaguide/ApplicationEvent-Subclass.png)

#### Vai trò Event Listener (Trình lắng nghe sự kiện)

`ApplicationListener` đóng vai trò là event listener, nó là một interface, bên trong chỉ định nghĩa một phương thức `onApplicationEvent()` để xử lý `ApplicationEvent`. Mã nguồn của interface `ApplicationListener` như sau, có thể thấy từ định nghĩa interface, event trong interface chỉ cần triển khai `ApplicationEvent` là được. Vì vậy, trong Spring, chúng ta chỉ cần triển khai phương thức `onApplicationEvent()` của interface `ApplicationListener` là có thể hoàn thành việc lắng nghe event.

```java
package org.springframework.context;
import java.util.EventListener;
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E var1);
}
```

#### Vai trò Event Publisher (Trình phát hành sự kiện)

`ApplicationEventPublisher` đóng vai trò là event publisher, nó cũng là một interface.

```java
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        this.publishEvent((Object)event);
    }

    void publishEvent(Object var1);
}

```

Phương thức `publishEvent()` của interface `ApplicationEventPublisher` được triển khai trong lớp `AbstractApplicationContext`, đọc phần triển khai của phương thức này, bạn sẽ phát hiện ra rằng thực tế event được phát tán (broadcast) ra ngoài thông qua `ApplicationEventMulticaster`. Nội dung cụ thể quá nhiều, sẽ không phân tích ở đây, có thể sẽ có một bài viết riêng đề cập đến sau.

### Tóm tắt quy trình Event trong Spring

1. Định nghĩa một event: Triển khai một lớp kế thừa từ `ApplicationEvent`, và viết constructor tương ứng;
2. Định nghĩa một event listener: Triển khai interface `ApplicationListener`, ghi đè phương thức `onApplicationEvent()`;
3. Sử dụng event publisher để phát hành message: Có thể phát hành message thông qua phương thức `publishEvent()` của `ApplicationEventPublisher`.

Example:

```java
// 定义一个事件,继承自ApplicationEvent并且写相应的构造函数
public class DemoEvent extends ApplicationEvent{
    private static final long serialVersionUID = 1L;

    private String message;

    public DemoEvent(Object source,String message){
        super(source);
        this.message = message;
    }

    public String getMessage() {
         return message;
          }


// 定义一个事件监听者,实现ApplicationListener接口，重写 onApplicationEvent() 方法；
@Component
public class DemoListener implements ApplicationListener<DemoEvent>{

    //使用onApplicationEvent接收消息
    @Override
    public void onApplicationEvent(DemoEvent event) {
        String msg = event.getMessage();
        System.out.println("接收到的信息是："+msg);
    }

}
// 发布事件，可以通过ApplicationEventPublisher  的 publishEvent() 方法发布消息。
@Component
public class DemoPublisher {

    @Autowired
    ApplicationContext applicationContext;

    public void publish(String message){
        //发布事件
        applicationContext.publishEvent(new DemoEvent(this, message));
    }
}

```

Khi gọi phương thức `publish()` của `DemoPublisher`, ví dụ như `demoPublisher.publish("你好")` , console sẽ in ra: `接收到的信息是：你好` .

## Adapter Pattern (Mẫu thiết kế Bộ chuyển đổi)

Adapter Pattern chuyển đổi một interface thành một interface khác mà phía client mong muốn, Adapter Pattern giúp các lớp có interface không tương thích có thể làm việc cùng nhau.

### Adapter Pattern trong Spring AOP

Chúng ta biết rằng Spring AOP được triển khai dựa trên Proxy Pattern, nhưng phần enhancement (tăng cường) hay Advice (thông báo) của Spring AOP sử dụng Adapter Pattern, interface liên quan là `AdvisorAdapter`.

Các loại Advice thường dùng gồm: `BeforeAdvice` (trước khi phương thức mục tiêu được gọi, thông báo trước - Before Advice), `AfterAdvice` (sau khi phương thức mục tiêu được gọi, thông báo sau - After Advice), `AfterReturningAdvice` (sau khi phương thức mục tiêu thực thi xong, trước khi return) v.v. Mỗi loại Advice đều có interceptor (bộ đánh chặn) tương ứng: `MethodBeforeAdviceInterceptor`, `AfterReturningAdviceInterceptor`, `ThrowsAdviceInterceptor` v.v.

Các Advice được định nghĩa sẵn trong Spring cần thông qua adapter tương ứng để chuyển đổi thành đối tượng kiểu `MethodInterceptor` (Method Interceptor - bộ đánh chặn phương thức) (ví dụ: `MethodBeforeAdviceAdapter` thông qua việc gọi phương thức `getInterceptor`, chuyển đổi `MethodBeforeAdvice` thành `MethodBeforeAdviceInterceptor`).

### Adapter Pattern trong Spring MVC

Trong Spring MVC, `DispatcherServlet` dựa vào thông tin request để gọi `HandlerMapping`, phân tích `Handler` tương ứng với request. Sau khi phân tích được `Handler` tương ứng (cũng chính là `Controller` mà chúng ta thường nói), bắt đầu được xử lý bởi `HandlerAdapter`. `HandlerAdapter` đóng vai trò là interface mong đợi, các lớp triển khai adapter cụ thể dùng để thích ứng với lớp mục tiêu, `Controller` đóng vai trò là lớp cần được thích ứng.

**Tại sao cần sử dụng Adapter Pattern trong Spring MVC?**

Trong Spring MVC, `Controller` có rất nhiều loại, các loại `Controller` khác nhau xử lý request thông qua các phương thức khác nhau. Nếu không sử dụng Adapter Pattern, `DispatcherServlet` sẽ trực tiếp lấy `Controller` thuộc loại tương ứng, cần phải tự mình phán đoán, giống như đoạn mã dưới đây:

```java
if(mappedHandler.getHandler() instanceof MultiActionController){
   ((MultiActionController)mappedHandler.getHandler()).xxx
}else if(mappedHandler.getHandler() instanceof XXX){
    ...
}else if(...){
   ...
}
```

Giả sử chúng ta thêm một loại `Controller` mới thì sẽ phải thêm một dòng câu lệnh if vào đoạn mã trên, cách làm này khiến chương trình khó bảo trì, đồng thời vi phạm nguyên tắc Open-Closed Principle (Nguyên tắc Đóng-Mở) trong Design Pattern – mở cho mở rộng, đóng cho sửa đổi.

## Decorator Pattern (Mẫu thiết kế Trang trí)

Decorator Pattern có thể động (dynamically) thêm một số thuộc tính hoặc hành vi bổ sung cho đối tượng. So với việc sử dụng kế thừa, Decorator Pattern linh hoạt hơn. Nói một cách đơn giản, khi chúng ta cần sửa đổi chức năng hiện có, nhưng không muốn trực tiếp sửa đổi mã nguồn gốc, hãy thiết kế một Decorator bọc bên ngoài mã nguồn gốc. Thực tế trong JDK có rất nhiều nơi sử dụng Decorator Pattern, ví dụ như họ `InputStream`, dưới lớp `InputStream` có các lớp con như `FileInputStream` (đọc tệp), `BufferedInputStream` (thêm bộ đệm, giúp tăng tốc độ đọc tệp đáng kể)... đều mở rộng chức năng của nó mà không sửa đổi mã nguồn của `InputStream`.

![装饰者模式示意图](https://oss.javaguide.cn/github/javaguide/Decorator.jpg)

## Tổng kết

Spring Framework đã sử dụng những Design Pattern nào?

- **Factory Design Pattern** : Spring sử dụng Factory Pattern thông qua `BeanFactory`, `ApplicationContext` để tạo các đối tượng bean.
- **Proxy Design Pattern** : Triển khai chức năng Spring AOP.
- **Singleton Design Pattern** : Bean trong Spring mặc định đều là singleton.
- **Template Method Pattern** : Trong Spring, các lớp thao tác với cơ sở dữ liệu có hậu tố Template như `jdbcTemplate`, `hibernateTemplate`... đều sử dụng Template Method Pattern.
- **Observer Pattern:** Mô hình Spring Event-Driven chính là một ứng dụng kinh điển của Observer Pattern.
- **Adapter Pattern** : Phần enhancement (tăng cường) hay Advice (thông báo) của Spring AOP sử dụng Adapter Pattern, trong Spring MVC cũng sử dụng Adapter Pattern để thích ứng `Controller`.
- ……

## Tham khảo

- 《Spring 技术内幕》
- <https://blog.eduonix.com/java-programming-2/learn-design-patterns-used-spring-framework/>
- <https://www.tutorialsteacher.com/ioc/inversion-of-control>
- <https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html>
- <https://juejin.im/post/5a8eb261f265da4e9e307230>
- <https://juejin.im/post/5ba28986f265da0abc2b6084>

<!-- @include: @article-footer.snippet.md -->
