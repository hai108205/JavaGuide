---
title: Tổng hợp câu hỏi phỏng vấn Spring thường gặp
description: Giải thích chi tiết các câu hỏi phỏng vấn về Spring Framework, bao gồm IoC Container, nguyên lý AOP, vòng đời Bean, Dependency Injection và các kiến thức cốt lõi khác của Spring.
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring面试题,Spring框架,Bean生命周期,IoC,AOP,依赖注入,事务,Spring常见问题
---

Bài viết này chủ yếu muốn thông qua một số câu hỏi để giúp mọi người hiểu sâu hơn về Spring, vì vậy sẽ không đề cập quá nhiều code!

Nhiều câu hỏi dưới đây bản thân tôi trong quá trình sử dụng Spring cũng chưa từng chú ý đến, tôi đã tạm thời tra cứu rất nhiều tài liệu và sách để bổ sung. Trên mạng cũng có nhiều bài viết tổng hợp câu hỏi thường gặp / câu hỏi phỏng vấn về Spring, tôi cảm thấy phần lớn đều sao chép lẫn nhau, hơn nữa nhiều câu hỏi cũng không hay lắm, một số câu trả lời cũng có vấn đề. Vì vậy, tôi đã dành thời gian rảnh một tuần để tổng hợp lại, hy vọng sẽ có ích cho mọi người.

## Spring Cơ Bản

### Spring Framework là gì?

Spring là một framework phát triển Java mã nguồn mở, nhẹ (lightweight), nhằm nâng cao hiệu suất phát triển của lập trình viên và khả năng bảo trì của hệ thống.

Thông thường khi nói đến Spring framework, chúng ta đều đang nói đến Spring Framework, nó là tập hợp của nhiều module, sử dụng các module này có thể hỗ trợ chúng ta phát triển một cách thuận tiện, ví dụ như Spring hỗ trợ IoC (Inversion of Control: Đảo ngược điều khiển) và AOP (Aspect-Oriented Programming: Lập trình hướng khía cạnh), có thể dễ dàng truy cập cơ sở dữ liệu, có thể dễ dàng tích hợp các thành phần bên thứ ba (email, tác vụ, lập lịch, cache, v.v.), hỗ trợ tốt cho unit test, hỗ trợ phát triển ứng dụng RESTful Java.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/38ef122122de4375abcd27c3de8f60b4.png)

Tư tưởng cốt lõi nhất của Spring là không phát minh lại bánh xe, dùng ngay khi mở hộp (out-of-the-box), nâng cao hiệu suất phát triển.

Spring dịch ra có nghĩa là mùa xuân, có thể thấy mục tiêu và sứ mệnh của nó là mang mùa xuân đến cho các lập trình viên Java! Cảm động!

🤐 Nói thêm một câu: **Sự phổ biến của một ngôn ngữ thường cần một ứng dụng killer, Spring chính là một framework ứng dụng killer của hệ sinh thái Java.**

Các chức năng cốt lõi mà Spring cung cấp chủ yếu là IoC và AOP. Học Spring, nhất định phải hiểu rõ tư tưởng cốt lõi của IoC và AOP!

- Trang chủ Spring: <https://spring.io/>
- Địa chỉ GitHub: <https://github.com/spring-projects/spring-framework>

### Spring bao gồm những module nào?

**Phiên bản Spring 4.x**:

![Spring4.x主要模块](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/jvme0c60b4606711fc4a0b6faf03230247a.png)

**Phiên bản Spring 5.x**:

![Spring5.x主要模块](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/20200831175708.png)

Trong phiên bản Spring 5.x, thành phần Portlet của module Web đã bị loại bỏ (deprecated), đồng thời bổ sung thành phần WebFlux để xử lý reactive bất đồng bộ.

Quan hệ phụ thuộc giữa các module của Spring như sau:

![Spring 各个模块的依赖关系](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/20200902100038.png)

#### Core Container

Module cốt lõi của Spring framework, cũng có thể nói là module nền tảng, chủ yếu cung cấp hỗ trợ cho IoC dependency injection. Hầu như tất cả các chức năng khác của Spring đều cần phụ thuộc vào module này, chúng ta có thể thấy điều này từ biểu đồ quan hệ phụ thuộc giữa các module ở trên.

- **spring-core**: Các lớp công cụ (utility class) cốt lõi cơ bản của Spring framework.
- **spring-beans**: Cung cấp hỗ trợ cho việc tạo, cấu hình và quản lý bean.
- **spring-context**: Cung cấp hỗ trợ cho quốc tế hóa (i18n), truyền sự kiện (event propagation), tải tài nguyên (resource loading), v.v.
- **spring-expression**: Cung cấp hỗ trợ cho ngôn ngữ biểu thức SpEL (Spring Expression Language), chỉ phụ thuộc vào module core, không phụ thuộc vào các module khác, có thể sử dụng độc lập.

#### AOP

- **spring-aspects**: Module này cung cấp hỗ trợ tích hợp với AspectJ.
- **spring-aop**: Cung cấp triển khai lập trình hướng khía cạnh.
- **spring-instrument**: Cung cấp chức năng thêm agent cho JVM. Cụ thể, nó cung cấp một weaving agent cho Tomcat, có thể chuyển các tệp class cho Tomcat, giống như các tệp này được class loader tải lên. Không hiểu cũng không sao, kịch bản sử dụng của module này rất hạn chế.

#### Data Access/Integration

Danh sách module dưới đây chủ yếu dựa trên Spring Framework 5.x. Spring Framework hiện đại đã loại bỏ tích hợp của một số công nghệ cũ, khi sử dụng thực tế nên tham khảo danh sách module chính thức của phiên bản Spring mục tiêu.

- **spring-jdbc**: Cung cấp JDBC trừu tượng để truy cập cơ sở dữ liệu. Các cơ sở dữ liệu khác nhau đều có API riêng để thao tác cơ sở dữ liệu, trong khi chương trình Java chỉ cần tương tác với JDBC API, như vậy sẽ che giấu đi sự khác biệt của cơ sở dữ liệu.
- **spring-tx**: Cung cấp hỗ trợ cho transaction.
- **spring-orm**: Trong Spring Framework 5.x cung cấp hỗ trợ cho các công nghệ ORM như Hibernate, JPA; các phiên bản Spring trước đó còn cung cấp tích hợp iBATIS.
- **spring-oxm**: Cung cấp trừu tượng OXM (Object-to-XML Mapping). Các phiên bản Spring khác nhau hỗ trợ các triển khai cụ thể khác nhau, ví dụ JAXB; Castor, XMLBeans, JiBX thuộc về tích hợp phiên bản cũ.
- **spring-jms**: Dịch vụ tin nhắn (messaging). Từ Spring Framework 4.1 trở đi, nó còn cung cấp kế thừa cho module spring-messaging.

#### Spring Web

- **spring-web**: Cung cấp một số hỗ trợ cơ bản nhất cho việc triển khai chức năng Web.
- **spring-webmvc**: Cung cấp triển khai Spring MVC.
- **spring-websocket**: Cung cấp hỗ trợ cho WebSocket, WebSocket cho phép client và server giao tiếp hai chiều.
- **spring-webflux**: Cung cấp hỗ trợ cho WebFlux. WebFlux là web framework reactive, non-blocking được giới thiệu từ Spring Framework 5.0, có thể chạy trên Netty, cũng có thể chạy trên Servlet container hỗ trợ non-blocking I/O. Việc ứng dụng có non-blocking end-to-end hay không còn phụ thuộc vào data access và các lời gọi downstream khác có chứa thao tác blocking hay không.

#### Messaging

**spring-messaging** là một module mới được thêm vào từ Spring 4.0, trách nhiệm chính là tích hợp một số ứng dụng truyền tin nhắn (messaging) cơ bản cho Spring framework.

#### Spring Test

Đội ngũ Spring đề cao phát triển hướng kiểm thử (TDD - Test-Driven Development). Với sự trợ giúp của IoC, unit test và integration test trở nên đơn giản hơn.

Module test của Spring hỗ trợ khá tốt cho JUnit (framework unit test), TestNG (tương tự JUnit), Mockito (chủ yếu dùng để mock object), PowerMock (giải quyết các vấn đề của Mockito như không thể mock phương thức final, static, private), v.v.

### ⭐️Spring, Spring MVC, Spring Boot có quan hệ gì với nhau?

Nhiều người không phân biệt được ba thứ Spring, Spring MVC, Spring Boot! Ở đây giới thiệu đơn giản về ba thứ này, thực ra rất đơn giản, không có gì cao siêu cả.

Spring bao gồm nhiều module chức năng (vừa đề cập ở trên), trong đó quan trọng nhất là module Spring-Core (chủ yếu cung cấp hỗ trợ IoC dependency injection), các module khác trong Spring (ví dụ Spring MVC) về cơ bản đều cần phụ thuộc vào module này để triển khai chức năng.

Hình dưới đây tương ứng với phiên bản Spring 4.x. Spring 5.0 đã giới thiệu WebFlux để xử lý reactive, và dần loại bỏ hỗ trợ liên quan đến Portlet; thành phần module của các phiên bản Spring hiện đại vui lòng tham khảo tài liệu chính thức.

![Spring主要模块](https://oss.javaguide.cn/github/javaguide/jvme0c60b4606711fc4a0b6faf03230247a.png)

Spring MVC là một module rất quan trọng trong Spring, chủ yếu trao cho Spring khả năng nhanh chóng xây dựng ứng dụng Web theo kiến trúc MVC. MVC là viết tắt của Model (Mô hình), View (Giao diện), Controller (Bộ điều khiển), tư tưởng cốt lõi của nó là tổ chức code bằng cách tách biệt logic nghiệp vụ, dữ liệu và hiển thị.

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

Sử dụng Spring để phát triển có quá nhiều cấu hình rườm rà, ví dụ như khi kích hoạt một số tính năng Spring, cần phải cấu hình tường minh bằng XML hoặc Java. Thế là, Spring Boot ra đời!

Spring nhằm đơn giản hóa việc phát triển ứng dụng doanh nghiệp J2EE. Spring Boot nhằm đơn giản hóa việc phát triển Spring (giảm tệp cấu hình, dùng ngay khi mở hộp!).

Spring Boot chỉ đơn giản hóa cấu hình, nếu bạn cần xây dựng ứng dụng Web theo kiến trúc MVC, bạn vẫn cần sử dụng Spring MVC làm MVC framework, chỉ là Spring Boot giúp bạn đơn giản hóa rất nhiều cấu hình của Spring MVC, thực sự đạt được dùng ngay khi mở hộp!

## Spring IoC

### ⭐️IoC là gì?

IoC (Inversion of Control) tức là Đảo ngược điều khiển / Điều khiển đảo ngược. Đây là một tư tưởng chứ không phải là một triển khai kỹ thuật. Nó mô tả vấn đề tạo và quản lý đối tượng trong lĩnh vực phát triển Java.

Ví dụ: lớp A phụ thuộc vào lớp B

- **Cách phát triển truyền thống**: Thường là trong lớp A thủ công thông qua từ khóa `new` để tạo ra một đối tượng B
- **Cách phát triển sử dụng tư tưởng IoC**: Không tạo đối tượng thông qua từ khóa `new`, mà thông qua IoC Container (Spring framework) để giúp chúng ta khởi tạo (instantiate) đối tượng. Chúng ta cần đối tượng nào, trực tiếp lấy từ IoC Container là được.

Từ sự so sánh hai cách phát triển trên có thể thấy: chúng ta "đánh mất một quyền lực" (quyền tạo và quản lý đối tượng), nhưng đổi lại cũng nhận được một lợi ích (không cần phải lo lắng về hàng loạt việc như tạo, quản lý đối tượng)

**Tại sao gọi là Đảo ngược điều khiển?**

- **Điều khiển (Control)**: Chỉ quyền tạo đối tượng (khởi tạo, quản lý)
- **Đảo ngược (Inversion)**: Quyền điều khiển được giao cho môi trường bên ngoài (IoC Container)

![IoC 图解](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration.png)

### ⭐️IoC giải quyết vấn đề gì?

Tư tưởng của IoC là hai bên không phụ thuộc lẫn nhau, do container bên thứ ba quản lý tài nguyên liên quan. Điều này có lợi ích gì?

1. Mức độ coupling (sự phụ thuộc) giữa các đối tượng được giảm xuống;
2. Tài nguyên trở nên dễ quản lý hơn; ví dụ như sử dụng Spring container thì rất dễ dàng triển khai một singleton.

Ví dụ: Có một thao tác với User, sử dụng cấu trúc hai tầng Service và Dao để phát triển

Trong trường hợp không sử dụng tư tưởng IoC, tầng Service muốn sử dụng triển khai cụ thể của tầng Dao, cần thông qua từ khóa `new` trong `UserServiceImpl` để thủ công tạo ra lớp triển khai cụ thể `UserDaoImpl` của `IUserDao` (không thể trực tiếp `new` lớp interface).

Rất hoàn hảo, cách này cũng có thể triển khai được, nhưng chúng ta hãy tưởng tượng kịch bản sau:

Trong quá trình phát triển đột nhiên nhận được một yêu cầu mới, phát triển một lớp triển khai cụ thể khác cho interface `IUserDao`. Vì tầng Service phụ thuộc vào triển khai cụ thể của `IUserDao`, nên chúng ta cần sửa đổi đối tượng được `new` trong `UserServiceImpl`. Nếu chỉ có một lớp tham chiếu đến triển khai cụ thể của `IUserDao`, có thể cảm thấy cũng ổn, sửa cũng không tốn nhiều công sức, nhưng nếu có rất nhiều nơi đều tham chiếu đến triển khai cụ thể của `IUserDao`, một khi cần thay đổi cách triển khai của `IUserDao`, thì việc sửa đổi sẽ rất đau đầu.

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration-dao-service.png)

Sử dụng tư tưởng IoC, chúng ta giao quyền điều khiển (tạo, quản lý) đối tượng cho IoC Container quản lý, khi sử dụng chúng ta trực tiếp "xin" IoC Container là được

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration-dao.png)

### Spring Bean là gì?

Nói một cách đơn giản, Bean chỉ những đối tượng được IoC Container quản lý.

Chúng ta cần nói cho IoC Container biết cần quản lý những đối tượng nào, điều này được định nghĩa thông qua configuration metadata. Configuration metadata có thể là tệp XML, annotation hoặc lớp cấu hình Java.

```xml
<!-- Constructor-arg with 'value' attribute -->
<bean id="..." class="...">
   <constructor-arg value="..."/>
</bean>
```

Hình dưới đây minh họa đơn giản cách IoC Container sử dụng configuration metadata để quản lý đối tượng.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/062b422bd7ac4d53afd28fb74b2bc94d.png)

Hai package `org.springframework.beans` và `org.springframework.context` là nền tảng triển khai IoC, nếu muốn nghiên cứu source code liên quan đến IoC, có thể xem thử

### Những annotation nào dùng để khai báo một lớp là Bean?

- `@Component`: Annotation đa năng (generic), có thể đánh dấu bất kỳ lớp nào là thành phần (`Spring` component). Nếu một Bean không biết thuộc tầng nào, có thể sử dụng annotation `@Component` để đánh dấu.
- `@Repository`: Tương ứng với tầng persistence (tầng Dao), chủ yếu dùng cho các thao tác liên quan đến cơ sở dữ liệu.
- `@Service`: Tương ứng với tầng service, chủ yếu liên quan đến một số logic phức tạp, cần sử dụng tầng Dao.
- `@Controller`: Tương ứng với tầng controller của Spring MVC, chủ yếu dùng để nhận yêu cầu của người dùng và gọi tầng `Service` để trả dữ liệu về cho trang frontend.

### Sự khác biệt giữa @Component và @Bean là gì?

- Annotation `@Component` tác động lên lớp (class), trong khi annotation `@Bean` tác động lên phương thức (method).
- `@Component` thường được tự động phát hiện (auto-detect) và tự động lắp ráp (auto-wire) vào Spring Container thông qua classpath scanning (chúng ta có thể sử dụng annotation `@ComponentScan` để định nghĩa đường dẫn cần quét, từ đó tìm ra các lớp được đánh dấu cần lắp ráp và tự động lắp ráp vào Spring bean container). Annotation `@Bean` thường là chúng ta định nghĩa tạo ra bean này trong phương thức được đánh dấu annotation đó, `@Bean` nói với Spring đây là một instance của lớp nào đó, khi tôi cần dùng nó thì trả lại cho tôi.
- Annotation `@Bean` có tính tùy chỉnh (customizability) cao hơn annotation `@Component`, hơn nữa nhiều trường hợp chúng ta chỉ có thể thông qua annotation `@Bean` để đăng ký bean. Ví dụ như khi chúng ta tham chiếu đến lớp trong thư viện bên thứ ba cần lắp ráp vào `Spring` container, thì chỉ có thể thực hiện thông qua `@Bean`.

Ví dụ sử dụng annotation `@Bean`:

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

}
```

Code ở trên tương đương với cấu hình xml dưới đây

```xml
<beans>
    <bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

Ví dụ dưới đây là trường hợp không thể thực hiện được thông qua `@Component`.

```java
@Bean
public OneService getService(status) {
    case (status)  {
        when 1:
                return new serviceImpl1();
        when 2:
                return new serviceImpl2();
        when 3:
                return new serviceImpl3();
    }
}
```

### Những annotation nào dùng để inject Bean?

`@Autowired` do Spring cung cấp, cùng với `@Resource` và `@Inject` do Jakarta specification cung cấp, đều có thể dùng để inject Bean.

| Annotation   | Package                                        | Source                                 |
| ------------ | ---------------------------------------------- | -------------------------------------- |
| `@Autowired` | `org.springframework.beans.factory.annotation` | Spring 2.5+                            |
| `@Resource`  | `jakarta.annotation`（Spring 6+）              | Jakarta Annotations / JSR-250          |
| `@Inject`    | `jakarta.inject`（Spring 6+）                  | Jakarta Dependency Injection / JSR-330 |

`@Autowired` và `@Resource` được sử dụng nhiều hơn.

### ⭐️Sự khác biệt giữa @Autowired và @Resource là gì?

`@Autowired` là annotation có sẵn của Spring, logic inject mặc định là **trước tiên khớp theo kiểu (byType), nếu tồn tại nhiều Bean cùng kiểu, thì tiếp tục thử lọc theo tên (byName)**.

Cụ thể:

1. Ưu tiên tìm Bean khớp trong Spring Container theo kiểu của interface / class. Nếu chỉ tìm thấy một Bean khớp kiểu, inject trực tiếp, không cần quan tâm đến tên;
2. Nếu tìm thấy nhiều Bean cùng kiểu (ví dụ một interface có nhiều lớp triển khai), thì sẽ thử khớp thông qua **tên thuộc tính hoặc tên tham số** với tên của Bean (tên Bean mặc định là tên lớp với chữ cái đầu viết thường, trừ khi được chỉ định tường minh qua `@Bean(name = "...")` hoặc `@Component("...")`).

Khi một interface có nhiều lớp triển khai:

- Nếu tên thuộc tính trùng với tên của một Bean nào đó, thì inject Bean đó;
- Nếu tên thuộc tính không khớp với tên của bất kỳ Bean nào, sẽ ném ra `NoUniqueBeanDefinitionException`, lúc này cần thông qua `@Qualifier` để chỉ định tường minh tên Bean cần inject.

Ví dụ minh họa:

```java
// SmsService 接口有两个实现类：SmsServiceImpl1、SmsServiceImpl2（均被 Spring 管理）

// 报错：byType 匹配到多个 Bean，且属性名 "smsService" 与两个实现类的默认名称（smsServiceImpl1、smsServiceImpl2）都不匹配
@Autowired
private SmsService smsService;

// 正确：属性名 "smsServiceImpl1" 与实现类 SmsServiceImpl1 的默认名称匹配
@Autowired
private SmsService smsServiceImpl1;

// 正确：通过 @Qualifier 显式指定 Bean 名称 "smsServiceImpl1"
@Autowired
@Qualifier(value = "smsServiceImpl1")
private SmsService smsService;
```

Trong thực tiễn phát triển, chúng tôi vẫn khuyến nghị sử dụng annotation `@Qualifier` để chỉ định tường minh tên thay vì phụ thuộc vào tên biến.

`@Resource` có nguồn gốc từ specification **JSR-250**. Trong JDK 6 đến JDK 10, `javax.annotation.Resource` từng được cung cấp kèm JDK; từ JDK 11 trở đi cần thêm dependency API riêng. Dự án Spring 5/Java EE 8 thường sử dụng `javax.annotation-api`, dự án Spring 6/Jakarta EE 9 trở lên sử dụng `jakarta.annotation-api`.

Logic xử lý của Spring đối với `@Resource` (trường hợp không tham số) như sau:

1. **Khớp theo tên (byName):** Mặc định lấy tên trường (Field Name) làm tên bean để tìm trong container. Nếu tìm thấy Bean với tên đó, inject trực tiếp.
2. **Quay lui khớp theo kiểu (byType):** Nếu **không** tìm thấy Bean cùng tên, Spring sẽ lùi một bước, thử tìm theo **kiểu** của trường. **Kết quả khớp theo kiểu**
   - **Tìm thấy 1 Bean**: Inject thành công.
   - **Tìm thấy 0 Bean**: Ném ra ngoại lệ (`NoSuchBeanDefinitionException`).
   - **Tìm thấy >1 Bean**: Ném ra ngoại lệ (`NoUniqueBeanDefinitionException`).

`@Resource` có hai thuộc tính quan trọng và thường dùng trong phát triển hàng ngày: `name` (tên), `type` (kiểu).

```java
public @interface Resource {
    String name() default "";
    Class<?> type() default Object.class;
}
```

Nếu chỉ định thuộc tính `name` thì cách inject là `byName`, nếu chỉ định thuộc tính `type` thì cách inject là `byType`, nếu đồng thời chỉ định thuộc tính `name` và `type` (không khuyến nghị làm vậy) thì cách inject là `byType`+`byName`.

```java
// 报错，byName 和 byType 都无法匹配到 bean
@Resource
private SmsService smsService;
// 正确注入 SmsServiceImpl1 对象对应的 bean
@Resource
private SmsService smsServiceImpl1;
// 正确注入 SmsServiceImpl1 对象对应的 bean（比较推荐这种方式）
@Resource(name = "smsServiceImpl1")
private SmsService smsService;
```

**Tóm tắt đơn giản**:

- `@Autowired` là annotation do Spring cung cấp, `@Resource` là annotation do Jakarta Annotations/JSR-250 specification cung cấp.
- `@Autowired` có cách inject mặc định là `byType` (khớp theo kiểu), `@Resource` có cách inject mặc định là `byName` (khớp theo tên).
- Khi một interface có nhiều lớp triển khai, cả `@Autowired` và `@Resource` đều cần thông qua tên mới có thể khớp chính xác đến Bean tương ứng. `@Autowired` có thể thông qua annotation `@Qualifier` để chỉ định tường minh tên, `@Resource` có thể thông qua thuộc tính `name` để chỉ định tường minh tên.
- `@Autowired` hỗ trợ sử dụng trên constructor, method, field và parameter. `@Resource` chủ yếu dùng cho inject trên field và method, không hỗ trợ sử dụng trên constructor hoặc parameter.

Xét đến việc `@Resource` có ngữ nghĩa rõ ràng hơn (ưu tiên tên), và là tiêu chuẩn Java, có thể giảm sự phụ thuộc chặt chẽ (tight coupling) vào Spring framework, chúng tôi thường **khuyến nghị sử dụng `@Resource`** hơn, đặc biệt là trong các kịch bản cần inject theo tên. Còn `@Autowired` kết hợp với constructor injection, có ưu thế trong việc triển khai tính bất biến (immutability) và tính bắt buộc (mandatory) của dependency injection, cũng là một thực tiễn rất tốt.

### Những cách inject Bean nào tồn tại?

Các cách phổ biến của Dependency Injection (DI):

1. Constructor Injection: Inject dependency thông qua constructor của lớp.
1. Setter Injection: Inject dependency thông qua phương thức Setter của lớp.
1. Field Injection: Inject dependency trực tiếp trên field của lớp bằng cách sử dụng annotation (như `@Autowired` hoặc `@Resource`).

Ví dụ Constructor Injection:

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Ví dụ Setter Injection:

```java
@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Ví dụ Field Injection:

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //...
}
```

### ⭐️Constructor Injection hay Setter Injection?

Spring có câu trả lời chính thức cho câu hỏi này: <https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-setter-injection>.

Ở đây tôi chủ yếu trích xuất, tổng hợp và hoàn thiện khuyến nghị chính thức của Spring.

**Spring chính thức khuyến nghị Constructor Injection**, cách inject này có những ưu điểm sau:

1. Tính đầy đủ của dependency: Đảm bảo tất cả các dependency bắt buộc được inject khi đối tượng được tạo, tránh rủi ro NullPointerException.
2. Tính bất biến (Immutability): Có lợi cho việc tạo đối tượng bất biến (immutable object), nâng cao thread safety.
3. Đảm bảo khởi tạo: Component đã được khởi tạo hoàn toàn trước khi sử dụng, giảm thiểu lỗi tiềm ẩn.
4. Tiện lợi cho testing: Trong unit test, có thể trực tiếp truyền dependency giả lập (mock) thông qua constructor, mà không cần phụ thuộc vào Spring Container để inject.

Constructor Injection phù hợp để xử lý **dependency bắt buộc**, còn **Setter Injection** thì phù hợp hơn cho **dependency tùy chọn (optional)**, những dependency này có thể có giá trị mặc định hoặc được thiết lập động trong vòng đời của đối tượng. Mặc dù `@Autowired` có thể dùng cho Setter method để xử lý dependency bắt buộc, nhưng Constructor Injection vẫn là lựa chọn tốt hơn.

Trong một số trường hợp (ví dụ lớp bên thứ ba không cung cấp Setter method), Constructor Injection có thể là **lựa chọn duy nhất**.

### ⭐️Bean có những scope (phạm vi) nào?

Trong Spring, Bean thường có các scope sau:

- **singleton**: Trong IoC Container chỉ có duy nhất một instance bean. Bean trong Spring mặc định đều là singleton, là ứng dụng của singleton design pattern.
- **prototype**: Mỗi lần lấy sẽ tạo ra một instance bean mới. Nói cách khác, gọi `getBean()` hai lần liên tiếp, sẽ nhận được hai instance Bean khác nhau.
- **request** (chỉ khả dụng trong Web application): Mỗi HTTP request sẽ tạo ra một bean mới (request bean), bean đó chỉ có hiệu lực trong HTTP request hiện tại.
- **session** (chỉ khả dụng trong Web application): Mỗi HTTP request từ một session mới sẽ tạo ra một bean mới (session bean), bean đó chỉ có hiệu lực trong HTTP session hiện tại.
- **application/global-session** (chỉ khả dụng trong Web application): Mỗi Web application khi khởi động tạo ra một Bean (application Bean), bean đó chỉ có hiệu lực trong thời gian ứng dụng hiện tại khởi động.
- **websocket** (chỉ khả dụng trong Web application): Mỗi phiên WebSocket tạo ra một bean mới.

**Làm thế nào để cấu hình scope của bean?**

Cách dùng xml:

```xml
<bean id="..." class="..." scope="singleton"></bean>
```

Cách dùng annotation:

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```

### ⭐️Bean có thread-safe không?

Bean trong Spring Framework có thread-safe hay không, phụ thuộc vào scope và trạng thái (state) của nó.

Ở đây chúng tôi lấy hai scope được sử dụng phổ biến nhất là prototype và singleton làm ví dụ để giới thiệu. Hầu như tất cả các kịch bản, scope của Bean đều sử dụng singleton mặc định, tập trung chú ý vào scope singleton là đủ.

Với scope prototype, mỗi lần lấy từ container sẽ tạo ra một instance bean mới, có thể giảm xác suất chia sẻ ở tầng container, nhưng bản thân scope không cung cấp đảm bảo thread-safe: nếu bên gọi chia sẻ cùng một instance prototype cho nhiều thread, vẫn có thể xảy ra cạnh tranh tài nguyên (race condition). Với scope singleton, trong IoC Container chỉ có duy nhất một instance bean, dễ xảy ra vấn đề cạnh tranh trạng thái chia sẻ hơn (phụ thuộc vào việc Bean có stateful hay không).

Ví dụ Bean có trạng thái (Stateful Bean):

```java
// 定义了一个购物车类，其中包含一个保存用户的购物车里商品的 List
@Component
public class ShoppingCart {
    private List<String> items = new ArrayList<>();

    public void addItem(String item) {
        items.add(item);
    }

    public List<String> getItems() {
        return items;
    }
}
```

Tuy nhiên, phần lớn Bean thực tế đều là stateless (không định nghĩa biến thành viên có thể thay đổi) (ví dụ Dao, Service), trong trường hợp này, Bean là thread-safe.

Ví dụ Bean không trạng thái (Stateless Bean):

```java
// 定义了一个用户服务，它仅包含业务逻辑而不保存任何状态。
@Component
public class UserService {

    public User findUserById(Long id) {
        //...
    }
    //...
}
```

Đối với vấn đề thread-safe của singleton Bean có trạng thái (stateful), ba cách giải quyết phổ biến là:

1. **Tránh biến thành viên có thể thay đổi (mutable)**: Cố gắng thiết kế Bean là stateless.
2. **Sử dụng `ThreadLocal`**: Lưu biến thành viên có thể thay đổi trong `ThreadLocal`, đảm bảo độc lập giữa các thread.
3. **Sử dụng cơ chế đồng bộ (synchronization)**: Sử dụng `synchronized` hoặc `ReentrantLock` để kiểm soát đồng bộ, đảm bảo thread safety.

Ở đây lấy `ThreadLocal` làm ví dụ, minh họa kịch bản `ThreadLocal` lưu thông tin đăng nhập của người dùng:

```java
public class UserThreadLocal {

    private UserThreadLocal() {}

    private static final ThreadLocal<SysUser> LOCAL = ThreadLocal.withInitial(() -> null);

    public static void put(SysUser sysUser) {
        LOCAL.set(sysUser);
    }

    public static SysUser get() {
        return LOCAL.get();
    }

    public static void remove() {
        LOCAL.remove();
    }
}
```

### ⭐️Bạn có hiểu về vòng đời (lifecycle) của Bean không?

1. **Tạo instance của Bean**: Bean Container trước tiên sẽ tìm định nghĩa Bean trong tệp cấu hình, sau đó chọn chiến lược khởi tạo thích hợp (factory method, constructor autowiring hoặc khởi tạo đơn giản) thông qua Java Reflection API để tạo instance của Bean.
2. **Gán / điền giá trị thuộc tính cho Bean**: Thiết lập các thuộc tính và dependency liên quan cho Bean, ví dụ xử lý các annotation như `@Autowired`, `@Value`, `@Resource` được đánh dấu trên field hoặc Setter method.
3. **Khởi tạo Bean (Initialization)**:
   - Nếu Bean implements interface `BeanNameAware`, gọi phương thức `setBeanName()`, truyền vào tên của Bean.
   - Nếu Bean implements interface `BeanClassLoaderAware`, gọi phương thức `setBeanClassLoader()`, truyền vào instance của `ClassLoader`.
   - Nếu Bean implements interface `BeanFactoryAware`, gọi phương thức `setBeanFactory()`, truyền vào instance của `BeanFactory`.
   - Tương tự như trên, nếu implements các interface `*.Aware` khác, thì gọi phương thức tương ứng.
   - Nếu có đối tượng `BeanPostProcessor` liên quan đến Spring Container đã tải Bean này, thực thi phương thức `postProcessBeforeInitialization()`
   - Nếu Bean implements interface `InitializingBean`, thực thi phương thức `afterPropertiesSet()`.
   - Nếu Bean trong tệp cấu hình có chứa thuộc tính `init-method`, thực thi phương thức được chỉ định.
   - Nếu có đối tượng `BeanPostProcessor` liên quan đến Spring Container đã tải Bean này, thực thi phương thức `postProcessAfterInitialization()`.
4. **Hủy Bean (Destruction)**: Hủy không có nghĩa là lập tức hủy Bean, mà là ghi lại phương thức hủy của Bean, sau này khi cần hủy Bean hoặc hủy container, thì gọi các phương thức này để giải phóng tài nguyên mà Bean đang nắm giữ.
   - Nếu Bean implements interface `DisposableBean`, thực thi phương thức `destroy()`.
   - Nếu Bean trong tệp cấu hình có chứa thuộc tính `destroy-method`, thực thi phương thức hủy Bean được chỉ định. Hoặc, cũng có thể trực tiếp thông qua annotation `@PreDestroy` đánh dấu phương thức được thực thi trước khi Bean bị hủy.

Trong phương thức `doCreateBean()` của `AbstractAutowireCapableBeanFactory` có thể thấy lần lượt thực thi 4 giai đoạn này:

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // 1. 创建 Bean 的实例
    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    Object exposedObject = bean;
    try {
        // 2. Bean 属性赋值/填充
        populateBean(beanName, mbd, instanceWrapper);
        // 3. Bean 初始化
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // 4. 销毁 Bean-注册回调接口
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }

    return exposedObject;
}
```

Interface `Aware` cho phép Bean có thể lấy được tài nguyên của Spring Container.

Các interface `Aware` chính được Spring cung cấp:

1. `BeanNameAware`: Inject beanName tương ứng với bean hiện tại;
2. `BeanClassLoaderAware`: Inject ClassLoader đã tải bean hiện tại;
3. `BeanFactoryAware`: Inject tham chiếu đến `BeanFactory` container hiện tại.

Interface `BeanPostProcessor` là điểm mở rộng (extension point) mạnh mẽ mà Spring cung cấp để sửa đổi Bean.

```java
public interface BeanPostProcessor {

	// 初始化前置处理
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	// 初始化后置处理
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

- `postProcessBeforeInitialization`: Thực thi sau khi Bean được khởi tạo instance và inject thuộc tính, trước phương thức `InitializingBean#afterPropertiesSet` và phương thức `init-method` tùy chỉnh;
- `postProcessAfterInitialization`: Tương tự như trên, nhưng thực thi sau phương thức `InitializingBean#afterPropertiesSet` và phương thức `init-method` tùy chỉnh.

`InitializingBean` và `init-method` là điểm mở rộng mà Spring cung cấp cho việc khởi tạo Bean.

```java
public interface InitializingBean {
 // 初始化逻辑
	void afterPropertiesSet() throws Exception;
}
```

Chỉ định phương thức `init-method`, chỉ định phương thức khởi tạo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demo" class="com.chaycao.Demo" init-method="init"/>

</beans>
```

**Làm thế nào để ghi nhớ?**

1. Tổng thể có thể đơn giản chia thành bốn bước: Khởi tạo instance (Instantiation) —> Gán thuộc tính (Populate Properties) —> Khởi tạo (Initialization) —> Hủy (Destruction).
2. Bước Khởi tạo (Initialization) liên quan đến khá nhiều bước, bao gồm dependency injection của interface `Aware`, xử lý của `BeanPostProcessor` trước và sau khi khởi tạo, cũng như thao tác khởi tạo của `InitializingBean` và `init-method`.
3. Bước Hủy (Destruction) sẽ đăng ký callback interface hủy liên quan, cuối cùng thông qua `DisposableBean` và `destroy-method` để tiến hành hủy.

Cuối cùng, chia sẻ thêm một sơ đồ minh họa rõ ràng (nguồn ảnh: [如何记忆 Spring Bean 的生命周期](https://chaycao.github.io/2020/02/15/如何记忆Spring-Bean的生命周期.html)).

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/spring-bean-lifestyle.png)

## Spring AOP

### ⭐️Hãy nói về hiểu biết của bạn về AOP

AOP (Aspect-Oriented Programming: Lập trình hướng khía cạnh) có thể đóng gói những logic hoặc trách nhiệm không liên quan đến nghiệp vụ, nhưng được các module nghiệp vụ cùng gọi đến (ví dụ như xử lý transaction, quản lý log, kiểm soát quyền, v.v.), giúp giảm code trùng lặp trong hệ thống, giảm mức độ coupling giữa các module, và có lợi cho khả năng mở rộng và bảo trì trong tương lai.

Spring AOP được xây dựng dựa trên dynamic proxy (proxy động), nếu đối tượng cần proxy đã implements một interface nào đó, thì Spring AOP sẽ sử dụng **JDK Proxy** để tạo proxy object, còn đối với đối tượng không implements interface, thì không thể sử dụng JDK Proxy để proxy, lúc này Spring AOP sẽ sử dụng **Cglib** để tạo ra một lớp con (subclass) của đối tượng bị proxy làm proxy, như hình dưới đây:

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/230ae587a322d6e4d09510161987d346.jpeg)

Tất nhiên bạn cũng có thể sử dụng **AspectJ**! Spring AOP đã tích hợp AspectJ, AspectJ có thể coi là framework AOP hoàn chỉnh nhất trong hệ sinh thái Java.

Một số thuật ngữ chuyên môn liên quan đến lập trình AOP (Aspect-Oriented Programming):

| Thuật ngữ                      |                               Ý nghĩa                               |
| :----------------------------- | :-----------------------------------------------------------------: |
| Mục tiêu (Target)              |                     Đối tượng được thông báo                         |
| Proxy (Proxy)                  |        Đối tượng proxy được tạo ra sau khi áp dụng advice lên target |
| Điểm kết nối (JoinPoint)       | Tất cả các phương thức được định nghĩa trong lớp của đối tượng target đều là joinpoint |
| Điểm cắt (Pointcut)            | Joinpoint bị aspect chặn / tăng cường (pointcut nhất định là joinpoint, joinpoint không nhất định là pointcut) |
| Thông báo (Advice)             | Logic / code tăng cường, tức là việc cần làm sau khi chặn được joinpoint của đối tượng target |
| Khía cạnh (Aspect)             |                   Pointcut + Advice                                   |
| Weaving (Dệt)                  |      Quá trình áp dụng advice vào đối tượng target, từ đó tạo ra proxy object      |