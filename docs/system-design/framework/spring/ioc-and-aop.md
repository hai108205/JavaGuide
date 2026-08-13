---
title: IoC & AOP chi tiết (hiểu nhanh)
description: Giải thích chi tiết nguyên lý cốt lõi của Spring IoC và AOP, đi sâu vào cơ chế thực hiện của Đảo ngược điều khiển, Tiêm phụ thuộc, Lập trình hướng khía cạnh và Dynamic Proxy.
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: IoC,DI,AOP,Spring IoC容器,依赖注入,切面编程,动态代理,Spring原理
---

Bài viết này sẽ giải thích IoC & AOP thông qua các câu hỏi sau:

- IoC là gì?
- IoC giải quyết vấn đề gì?
- Sự khác biệt giữa IoC và DI?
- AOP là gì?
- AOP giải quyết vấn đề gì?
- Các tình huống ứng dụng của AOP là gì?
- Tại sao AOP được gọi là lập trình hướng khía cạnh (Aspect-Oriented Programming)?
- Các phương thức triển khai AOP là gì?

Trước tiên cần làm rõ: IoC & AOP không phải do Spring đề xuất, chúng đã tồn tại trước Spring, chỉ là lúc đó thiên về lý thuyết nhiều hơn. Spring đã hiện thực hóa rất tốt hai tư tưởng này ở cấp độ kỹ thuật.

## IoC (Inversion of Control)

### IoC là gì?

IoC (Inversion of Control) tức là Đảo ngược điều khiển / Điều khiển đảo ngược. Đây là một tư tưởng chứ không phải là một cách triển khai kỹ thuật. Nó mô tả vấn đề tạo và quản lý đối tượng trong lĩnh vực phát triển Java.

Ví dụ: Giả sử class A phụ thuộc vào class B

- **Cách phát triển truyền thống**: Thường là trong class A, ta dùng từ khóa `new` để tạo thủ công một đối tượng của class B.
- **Cách phát triển sử dụng tư tưởng IoC**: Không tạo đối tượng bằng từ khóa `new`, mà để IoC container (Spring framework) giúp chúng ta khởi tạo đối tượng. Khi cần đối tượng nào, ta lấy trực tiếp từ IoC container.

Qua sự so sánh hai cách phát triển trên, ta thấy: chúng ta "mất đi một quyền" (quyền tạo và quản lý đối tượng), nhưng đổi lại có được một lợi ích (không cần phải lo lắng về một loạt các công việc như tạo và quản lý đối tượng nữa).

**Tại sao gọi là Đảo ngược điều khiển?**

- **Điều khiển (Control)**: Chỉ quyền tạo đối tượng (khởi tạo, quản lý)
- **Đảo ngược (Inversion)**: Trao quyền điều khiển cho môi trường bên ngoài (IoC container)

![IoC 图解](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration.png)

### IoC giải quyết vấn đề gì?

Tư tưởng của IoC là hai bên không phụ thuộc lẫn nhau, mà do một container bên thứ ba quản lý các tài nguyên liên quan. Điều này mang lại lợi ích gì?

1. Mức độ liên kết (coupling) hay mức độ phụ thuộc giữa các đối tượng giảm xuống;
2. Tài nguyên trở nên dễ quản lý hơn; ví dụ nếu bạn dùng Spring container, rất dễ dàng để triển khai một singleton.

Ví dụ: Hiện có một thao tác với User, được phát triển theo cấu trúc hai tầng Service và Dao.

Khi không sử dụng tư tưởng IoC, nếu tầng Service muốn sử dụng class triển khai cụ thể của tầng Dao, cần phải dùng từ khóa `new` trong `UserServiceImpl` để tạo thủ công class triển khai cụ thể `UserDaoImpl` của `IUserDao` (không thể `new` trực tiếp interface).

Rất hoàn hảo, cách này cũng có thể thực hiện được, nhưng hãy thử tưởng tượng tình huống sau:

Trong quá trình phát triển, đột nhiên nhận được một yêu cầu mới, cần phát triển một class triển khai cụ thể khác cho interface `IUserDao`. Vì tầng Service phụ thuộc vào class triển khai cụ thể của `IUserDao`, nên ta cần sửa đối tượng được `new` trong `UserServiceImpl`. Nếu chỉ có một class tham chiếu đến class triển khai cụ thể của `IUserDao`, có lẽ cũng không sao, sửa cũng không quá vất vả, nhưng nếu có rất nhiều nơi tham chiếu đến class triển khai cụ thể của `IUserDao`, một khi cần thay đổi cách triển khai của `IUserDao`, thì việc sửa đổi sẽ rất đau đầu.

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration-dao-service.png)

Sử dụng tư tưởng IoC, ta giao quyền điều khiển đối tượng (tạo, quản lý) cho IoC container, khi cần sử dụng ta chỉ cần "xin" IoC container là được.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/IoC&Aop-ioc-illustration-dao.png)

### IoC và DI có khác biệt không?

IoC (Inverse of Control: Đảo ngược điều khiển) là một tư tưởng thiết kế hoặc một mẫu (pattern) nào đó. Tư tưởng thiết kế này chính là **trao quyền tạo đối tượng vốn được thực hiện thủ công trong chương trình cho một bên thứ ba, chẳng hạn như IoC container.** Đối với Spring framework mà chúng ta thường dùng, IoC container thực chất là một Map (key, value), trong Map chứa các đối tượng khác nhau. Tuy nhiên, IoC cũng được ứng dụng trong các ngôn ngữ khác, không phải là đặc trưng riêng của Spring.

Cách triển khai phổ biến nhất và hợp lý nhất của IoC được gọi là Dependency Injection (Tiêm phụ thuộc), viết tắt là DI.

Martin Fowler (lão Mã) trong một bài viết đã đề cập đến việc đổi tên IoC thành DI, nguyên văn như sau, địa chỉ bài viết: <https://martinfowler.com/articles/injection.html>.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/martin-fowler-injection.png)

Đại ý của Martin Fowler là IoC quá phổ biến và không biểu đạt rõ ý nghĩa, khiến nhiều người bối rối, vì vậy sử dụng DI để chỉ định chính xác mẫu này thì tốt hơn.

## AOP (Aspect-Oriented Programming)

Phần này sẽ không đề cập quá nhiều thuật ngữ chuyên môn, mục đích cốt lõi là giải thích rõ tư tưởng của AOP.

### AOP là gì?

AOP (Aspect-Oriented Programming) tức là Lập trình hướng khía cạnh, AOP là sự kế thừa của OOP (Lập trình hướng đối tượng), hai cái bổ sung cho nhau, không hề đối lập.

Mục đích của AOP là tách các mối quan tâm xuyên suốt (cross-cutting concerns) (như ghi log, quản lý giao dịch, kiểm soát quyền, giới hạn tần suất gọi API (rate limiting), tính lũy đẳng của API (idempotency), v.v.) ra khỏi logic nghiệp vụ cốt lõi, thông qua dynamic proxy, thao tác bytecode và các kỹ thuật khác, để đạt được việc tái sử dụng và giảm liên kết (decoupling) code, nâng cao khả năng bảo trì và mở rộng của code. Mục đích của OOP là đóng gói logic nghiệp vụ theo thuộc tính và hành vi của đối tượng, thông qua các khái niệm như class, object, kế thừa, đa hình, để đạt được việc module hóa và phân tầng code (cũng có thể tái sử dụng code), nâng cao khả năng đọc và bảo trì của code.

### Tại sao AOP được gọi là lập trình hướng khía cạnh?

Sở dĩ AOP được gọi là lập trình hướng khía cạnh, là vì tư tưởng cốt lõi của nó chính là tách các mối quan tâm xuyên suốt (cross-cutting concerns) ra khỏi logic nghiệp vụ cốt lõi, tạo thành từng **khía cạnh (Aspect)**.

![面向切面编程图解](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/aop-program-execution.jpg)

Tiện đây tổng kết lại các thuật ngữ chính của AOP (không hiểu cũng không sao, có thể tiếp tục đọc phần sau):

- **Mối quan tâm xuyên suốt (cross-cutting concerns)**: Hành vi chung xuất hiện trong nhiều class hoặc object (như ghi log, quản lý giao dịch, kiểm soát quyền, giới hạn tần suất gọi API (rate limiting), tính lũy đẳng của API (idempotency), v.v.).
- **Khía cạnh (Aspect)**: Class dùng để đóng gói các mối quan tâm xuyên suốt, một khía cạnh là một class. Một Aspect có thể định nghĩa nhiều Advice, dùng để thực hiện các chức năng cụ thể.
- **Điểm kết nối (JoinPoint)**: JoinPoint là một thời điểm cụ thể khi phương thức được gọi hoặc thực thi (như gọi phương thức, ném ngoại lệ, v.v.).
- **Advice (Lời khuyên)**: Advice là thao tác mà Aspect thực hiện tại một JoinPoint nào đó. Có năm loại Advice, lần lượt là Before Advice, After Advice, AfterReturning Advice, AfterThrowing Advice và Around Advice. Bốn loại Advice đầu đều được thực thi trước và sau phương thức mục tiêu, còn Around Advice có thể kiểm soát quá trình thực thi của phương thức mục tiêu.
- **Điểm cắt (Pointcut)**: Một Pointcut là một biểu thức (expression), được dùng để khớp (match) những JoinPoint nào cần được Aspect tăng cường (enhance). Pointcut có thể được định nghĩa thông qua annotation, biểu thức chính quy (regex), phép toán logic, v.v. Ví dụ: `execution(* com.xyz.service..*(..))` khớp với các class hoặc interface trong package `com.xyz.service` và các package con của nó.
- **Dệt (Weaving)**: Weaving là quá trình kết nối Aspect và đối tượng mục tiêu, tức là áp dụng Advice vào các JoinPoint được Pointcut khớp. Có hai thời điểm Weaving phổ biến, lần lượt là Compile-Time Weaving (dệt lúc biên dịch, như AspectJ) và Runtime Weaving (dệt lúc chạy, như AspectJ, Spring AOP).

### Các loại Advice phổ biến trong AOP là gì?

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/aspectj-advice-types.jpg)

- **Before**: Kích hoạt trước khi phương thức của đối tượng mục tiêu được gọi
- **After**: Kích hoạt sau khi phương thức của đối tượng mục tiêu được gọi
- **AfterReturning**: Kích hoạt sau khi phương thức của đối tượng mục tiêu gọi hoàn tất và trả về kết quả
- **AfterThrowing**: Kích hoạt sau khi phương thức của đối tượng mục tiêu ném ra / kích hoạt ngoại lệ trong quá trình chạy. AfterReturning và AfterThrowing loại trừ lẫn nhau. Nếu phương thức gọi thành công không có ngoại lệ, sẽ có giá trị trả về; nếu phương thức ném ra ngoại lệ, sẽ không có giá trị trả về.
- **Around**: Điều khiển việc gọi phương thức của đối tượng mục tiêu theo kiểu lập trình. Around là loại Advice có phạm vi thao tác lớn nhất trong tất cả các loại Advice, vì nó có thể trực tiếp lấy được đối tượng mục tiêu cũng như phương thức cần thực thi, do đó Around Advice có thể tùy ý thao tác trước và sau khi phương thức của đối tượng mục tiêu được gọi, thậm chí không gọi phương thức của đối tượng mục tiêu.

### AOP giải quyết vấn đề gì?

OOP không thể xử lý tốt một số hành vi chung phân tán trong nhiều class hoặc object (như ghi log, quản lý giao dịch, kiểm soát quyền, giới hạn tần suất gọi API (rate limiting), tính lũy đẳng của API (idempotency), v.v.), những hành vi này thường được gọi là **mối quan tâm xuyên suốt (cross-cutting concerns)**. Nếu ta lặp lại việc triển khai những hành vi này trong mỗi class hoặc object, sẽ dẫn đến code dư thừa, phức tạp và khó bảo trì.

AOP có thể tách các mối quan tâm xuyên suốt (cross-cutting concerns) (như ghi log, quản lý giao dịch, kiểm soát quyền, giới hạn tần suất gọi API (rate limiting), tính lũy đẳng của API (idempotency), v.v.) ra khỏi **logic nghiệp vụ cốt lõi (core concerns, mối quan tâm cốt lõi)**, thực hiện sự phân tách các mối quan tâm (separation of concerns).

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/crosscut-logic-and-businesslogic-separation%20%20%20%20%20%20.png)

Lấy ghi log làm ví dụ để giới thiệu, giả sử chúng ta cần ghi log theo định dạng thống nhất cho một số phương thức, trước khi sử dụng công nghệ AOP, chúng ta cần phải viết logic ghi log lặp đi lặp lại cho từng phương thức, toàn là logic trùng lặp.

```java
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

public CommonResponse<Object> method2() {
      // 业务逻辑
      xxService.method2();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

// ...
```

Sau khi sử dụng công nghệ AOP, chúng ta có thể đóng gói logic ghi log thành một Aspect, sau đó thông qua Pointcut và Advice để chỉ định những phương thức nào cần thực hiện thao tác ghi log.

```java

// 日志注解
@Target({ElementType.PARAMETER,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 描述
     */
    String description() default "";

    /**
     * 方法类型 INSERT DELETE UPDATE OTHER
     */
    MethodType methodType() default MethodType.OTHER;
}

// 日志切面
@Component
@Aspect
public class LogAspect {
  // 切入点，所有被 Log 注解标注的方法
  @Pointcut("@annotation(cn.javaguide.annotation.Log)")
  public void webLog() {
  }

   /**
   * 环绕通知
   */
  @Around("webLog()")
  public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
    // 省略具体的处理逻辑
  }

  // 省略其他代码
}
```

Như vậy, chỉ với một dòng annotation là ta có thể thực hiện ghi log:

```java
@Log(description = "method1",methodType = MethodType.INSERT)
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      return CommonResponse.success();
}
```

### Các tình huống ứng dụng của AOP là gì?

- Ghi log: Tự định nghĩa annotation ghi log, sử dụng AOP, một dòng code là có thể thực hiện ghi log.
- Thống kê hiệu năng: Sử dụng AOP để thống kê thời gian thực thi của phương thức mục tiêu trước và sau khi thực thi, thuận tiện cho việc tối ưu và phân tích.
- Quản lý giao dịch: Annotation `@Transactional` cho phép Spring quản lý giao dịch cho chúng ta, ví dụ như rollback khi có ngoại lệ, loại bỏ logic quản lý giao dịch lặp đi lặp lại. Annotation `@Transactional` chính là được triển khai dựa trên AOP.
- Kiểm soát quyền: Sử dụng AOP để phán đoán trước khi phương thức mục tiêu thực thi xem người dùng có quyền cần thiết hay không, nếu có thì thực thi phương thức mục tiêu, nếu không thì không thực thi. Ví dụ, Spring Security sử dụng annotation `@PreAuthorize` với một dòng code là có thể tùy chỉnh kiểm tra quyền.
- Giới hạn tần suất gọi API (rate limiting): Sử dụng AOP để thực hiện giới hạn tần suất cho request trước khi phương thức mục tiêu thực thi thông qua các thuật toán và cách triển khai rate limiting cụ thể.
- Quản lý cache: Sử dụng AOP để đọc và cập nhật cache trước và sau khi phương thức mục tiêu thực thi.
- ...

### Các phương thức triển khai AOP là gì?

Các phương thức triển khai AOP phổ biến bao gồm dynamic proxy, thao tác bytecode, v.v.

Spring AOP được xây dựng dựa trên dynamic proxy. Nếu đối tượng cần proxy đã triển khai một interface nào đó, thì Spring AOP sẽ sử dụng **JDK Proxy** để tạo đối tượng proxy. Còn đối với đối tượng không triển khai interface, không thể sử dụng JDK Proxy để proxy, lúc này Spring AOP sẽ sử dụng CGLIB để tạo một lớp con của đối tượng bị proxy làm proxy, như hình dưới đây:

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/230ae587a322d6e4d09510161987d346.jpeg)

**Chiến lược dynamic proxy của Spring Boot và Spring có giống nhau không?** Thực ra không giống, rất nhiều người hiểu sai.

Trước Spring Boot 2.0, `spring.aop.proxy-target-class` có giá trị mặc định là `false`, khi có interface của người dùng thường sử dụng **JDK dynamic proxy**; nếu class mục tiêu không có interface khả dụng, Spring AOP vẫn sẽ chuyển sang dùng **CGLIB dynamic proxy**, chứ không chỉ vì class mục tiêu không triển khai interface mà ném ra ngoại lệ. Code tự động cấu hình AOP của Spring Boot 1.5.x như sau:

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 JDK 动态代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = true)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 时才会生效。
 // 即开发者通过属性配置明确指定使用 CGLIB 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = false)
	public static class CglibAutoProxyConfiguration {

	}

}
```

Từ Spring Boot 2.0 trở đi, nếu người dùng không cấu hình gì, mặc định sử dụng **CGLIB dynamic proxy**. Nếu cần ép buộc sử dụng JDK dynamic proxy, có thể thêm vào file cấu hình: `spring.aop.proxy-target-class=false`. Code tự động cấu hình AOP của Spring Boot 2.0 như sau:

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class,
		AnnotatedElement.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 时才会生效。
 // 即开发者通过属性配置明确指定使用 JDK 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = false)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 CGLIB 代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
	public static class CglibAutoProxyConfiguration {

	}

}
```

Tất nhiên bạn cũng có thể sử dụng **AspectJ**! Spring AOP đã tích hợp AspectJ, AspectJ có thể coi là framework AOP đầy đủ nhất trong hệ sinh thái Java.

**Spring AOP thuộc về tăng cường lúc chạy (runtime enhancement), còn AspectJ hỗ trợ dệt lúc biên dịch (compile-time), hậu biên dịch (post-compile) và dệt lúc tải class (class-load-time weaving).** Spring AOP dựa trên Proxy, còn AspectJ dựa trên thao tác bytecode (Bytecode Manipulation).

Spring AOP đã tích hợp AspectJ, AspectJ có thể coi là framework AOP đầy đủ nhất trong hệ sinh thái Java. AspectJ so với Spring AOP có chức năng mạnh mẽ hơn, nhưng Spring AOP thì tương đối đơn giản hơn.

Nếu số lượng Aspect của chúng ta ít, thì sự khác biệt về hiệu năng giữa hai bên không lớn. Nhưng khi số lượng Aspect quá nhiều, tốt nhất nên chọn AspectJ, nó nhanh hơn Spring AOP rất nhiều.

## Tham khảo

- AOP in Spring Boot, is it a JDK dynamic proxy or a Cglib dynamic proxy?：<https://www.springcloud.io/post/2022-01/springboot-aop/>
- Spring Proxying Mechanisms：<https://docs.spring.io/spring-framework/reference/core/aop/proxying.html>
