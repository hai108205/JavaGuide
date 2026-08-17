---
title: Phân Tích Chi Tiết Nguyên Lý Tự Động Cấu Hình (Auto-Assembly) Của Spring Boot
description: Phân tích chuyên sâu nguyên lý tự động cấu hình của Spring Boot, giải thích chi tiết @EnableAutoConfiguration, cơ chế nạp SpringFactories và nguyên lý hoạt động của các annotation điều kiện.
category: 框架
tag:
  - SpringBoot
head:
  - - meta
    - name: keywords
      content: Spring Boot tự động cấu hình,AutoConfiguration,EnableAutoConfiguration,SpringFactories,annotation điều kiện,Starter,Spring Boot nguyên lý
---

> Tác giả: [Miki-byte-1024](https://github.com/Miki-byte-1024) & [Snailclimb](https://github.com/Snailclimb)

Mỗi khi nhắc đến Spring Boot, người phỏng vấn rất thích hỏi câu này: "Hãy trình bày nguyên lý tự động cấu hình (auto-assembly) của Spring Boot?".

Tôi nghĩ chúng ta có thể trả lời từ các khía cạnh sau:

1. Tự động cấu hình của Spring Boot là gì?
2. Spring Boot triển khai tự động cấu hình như thế nào? Làm thế nào để nạp theo nhu cầu (on-demand)?
3. Làm thế nào để triển khai một Starter?

Do giới hạn độ dài, bài viết này chưa đi sâu, các bạn cũng có thể trực tiếp sử dụng debug để xem qua mã nguồn phần tự động cấu hình của Spring Boot.

## Lời Mở Đầu

Những ai đã từng sử dụng Spring, chắc hẳn vẫn còn nỗi ám ảnh bị cấu hình XML thống trị. Ngay cả khi Spring sau này đã giới thiệu cấu hình dựa trên annotation, chúng ta vẫn cần dùng XML hoặc Java để cấu hình tường minh khi kích hoạt một số tính năng của Spring hoặc tích hợp dependency bên thứ ba.

Ví dụ nhé. Khi chưa có Spring Boot, để viết một RESTful Web Service, chúng ta còn phải thực hiện cấu hình như sau.

```java
@Configuration
public class RESTConfiguration
{
    @Bean
    public View jsonTemplate() {
        MappingJackson2JsonView view = new MappingJackson2JsonView();
        view.setPrettyPrint(true);
        return view;
    }

    @Bean
    public ViewResolver viewResolver() {
        return new BeanNameViewResolver();
    }
}
```

`spring-servlet.xml`

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context/ http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/mvc/ http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <context:component-scan base-package="com.howtodoinjava.demo" />
    <mvc:annotation-driven />

    <!-- JSON Support -->
    <bean name="viewResolver" class="org.springframework.web.servlet.view.BeanNameViewResolver"/>
    <bean name="jsonTemplate" class="org.springframework.web.servlet.view.json.MappingJackson2JsonView"/>

</beans>
```

Tuy nhiên, với dự án Spring Boot, chúng ta chỉ cần thêm dependency liên quan, không cần cấu hình, chỉ cần khởi động method `main` bên dưới là xong.

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

Hơn nữa, chúng ta có thể cấu hình dự án thông qua file cấu hình toàn cục `application.properties` hoặc `application.yml` của Spring Boot, chẳng hạn như thay đổi cổng (port), cấu hình thuộc tính JPA, v.v.

**Tại sao Spring Boot dùng lại sướng đến thế?** Điều này có được là nhờ vào tính năng tự động cấu hình. **Tự động cấu hình có thể nói là cốt lõi của Spring Boot, vậy rốt cuộc tự động cấu hình là gì?**

## Tự Động Cấu Hình Của Spring Boot Là Gì?

Hiện nay khi nhắc đến tự động cấu hình, chúng ta thường liên tưởng đến Spring Boot. Nhưng thực ra, Spring Framework đã triển khai tính năng này từ lâu. Spring Boot chỉ dựa trên nền tảng đó, thông qua cơ chế SPI, để tối ưu hóa thêm một bước.

> Trong Spring Boot 2.6 trở về trước, các lớp tự động cấu hình chủ yếu được đăng ký thông qua file `META-INF/spring.factories` trong các jar bên ngoài. Spring Boot 2.7 đã giới thiệu `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`, đồng thời tương thích với cách đăng ký cũ; Spring Boot 3.0 đã loại bỏ hỗ trợ đăng ký lớp tự động cấu hình thông qua key `EnableAutoConfiguration` trong `spring.factories`, nhưng các mục đích sử dụng khác của `spring.factories` không bị ảnh hưởng.

Khi chưa có Spring Boot, nếu cần tích hợp dependency bên thứ ba, chúng ta phải cấu hình thủ công, rất phiền phức. Nhưng với Spring Boot, chúng ta chỉ cần thêm trực tiếp một starter là được. Ví dụ, nếu bạn muốn sử dụng Redis trong dự án, chỉ cần thêm starter tương ứng vào dự án.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

Sau khi thêm starter, chúng ta chỉ cần một vài annotation và một số cấu hình đơn giản là có thể sử dụng các chức năng do thành phần bên thứ ba cung cấp.

Theo tôi, tự động cấu hình có thể được hiểu đơn giản là: **Thông qua annotation hoặc một số cấu hình đơn giản là có thể triển khai một chức năng nào đó với sự trợ giúp của Spring Boot.**

## Spring Boot Triển Khai Tự Động Cấu Hình Như Thế Nào?

Trước tiên hãy xem annotation cốt lõi của Spring Boot: `SpringBootApplication`.

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
<1.>@SpringBootConfiguration
<2.>@ComponentScan
<3.>@EnableAutoConfiguration
public @interface SpringBootApplication {

}

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration //Thực ra nó cũng là một lớp cấu hình
public @interface SpringBootConfiguration {
}
```

Có thể xem `@SpringBootApplication` như là tập hợp của các annotation `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`. Theo tài liệu chính thức của Spring Boot, chức năng của ba annotation này lần lượt là:

- `@EnableAutoConfiguration`: Kích hoạt cơ chế tự động cấu hình của Spring Boot
- `@Configuration`: Cho phép đăng ký thêm bean hoặc import các lớp cấu hình khác vào context
- `@ComponentScan`: Quét các bean được đánh dấu bởi `@Component` (`@Service`, `@Controller`), annotation này mặc định sẽ quét tất cả các lớp trong package chứa lớp khởi động (startup class), có thể tùy chỉnh để không quét một số bean nhất định. Như hình bên dưới, container sẽ loại trừ `TypeExcludeFilter` và `AutoConfigurationExcludeFilter`.

![](https://oss.javaguide.cn/p3-juejin/bcc73490afbe4c6ba62acde6a94ffdfd~tplv-k3u1fbpfcp-watermark.png)

`@EnableAutoConfiguration` là annotation quan trọng để triển khai tự động cấu hình, chúng ta sẽ bắt đầu phân tích từ annotation này.

### @EnableAutoConfiguration: Annotation Cốt Lõi Triển Khai Tự Động Cấu Hình

`EnableAutoConfiguration` chỉ là một annotation đơn giản, việc triển khai chức năng cốt lõi của tự động cấu hình thực sự được thực hiện thông qua lớp `AutoConfigurationImportSelector`.

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage //Tác dụng: đăng ký tất cả các component trong package main vào container
@Import({AutoConfigurationImportSelector.class}) //Nạp lớp tự động cấu hình xxxAutoconfiguration
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

Bây giờ chúng ta sẽ tập trung phân tích xem lớp `AutoConfigurationImportSelector` thực sự đã làm gì?

### AutoConfigurationImportSelector: Nạp Lớp Tự Động Cấu Hình

Dưới đây lấy đoạn trích mã nguồn của Spring Boot 2.1.x làm ví dụ để phân tích `AutoConfigurationImportSelector`. Những đoạn code này đã được lược bỏ một số phần triển khai không ảnh hưởng đến luồng chính, không thể biên dịch độc lập như một lớp hoàn chỉnh. Các phiên bản Spring Boot 2.7 trở lên đọc các lớp tự động cấu hình ứng viên chủ yếu từ file `AutoConfiguration.imports`, cấu trúc mã nguồn cụ thể có khác biệt so với đoạn mã phiên bản cũ bên dưới.

Hệ thống kế thừa của lớp `AutoConfigurationImportSelector` như sau:

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

}

public interface DeferredImportSelector extends ImportSelector {

}

public interface ImportSelector {
    String[] selectImports(AnnotationMetadata var1);
}
```

Có thể thấy, lớp `AutoConfigurationImportSelector` đã triển khai interface `ImportSelector`, cũng tức là đã triển khai method `selectImports` trong interface này, method này chủ yếu dùng để **lấy tất cả các fully qualified class name của các lớp thỏa mãn điều kiện, những lớp này cần được nạp vào IoC container**.

```java
private static final String[] NO_IMPORTS = new String[0];

public String[] selectImports(AnnotationMetadata annotationMetadata) {
        // <1>.Kiểm tra xem công tắc tự động cấu hình đã được bật chưa
        if (!this.isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        } else {
          //<2>.Lấy tất cả các bean cần được cấu hình
            AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader.loadMetadata(this.beanClassLoader);
            AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(autoConfigurationMetadata, annotationMetadata);
            return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
        }
    }
```

Ở đây chúng ta cần tập trung chú ý vào method `getAutoConfigurationEntry()`, method này chịu trách nhiệm chính trong việc nạp các lớp tự động cấu hình.

Chuỗi lời gọi của method này như sau:

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/3c1200712655443ca4b38500d615bb70~tplv-k3u1fbpfcp-watermark.png)

Bây giờ chúng ta kết hợp với mã nguồn của `getAutoConfigurationEntry()` để phân tích chi tiết:

```java
private static final AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationEntry();

AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
        //<1>.
        if (!this.isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        } else {
            //<2>.
            AnnotationAttributes attributes = this.getAttributes(annotationMetadata);
            //<3>.
            List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
            //<4>.
            configurations = this.removeDuplicates(configurations);
            Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);
            this.checkExcludedClasses(configurations, exclusions);
            configurations.removeAll(exclusions);
            configurations = this.filter(configurations, autoConfigurationMetadata);
            this.fireAutoConfigurationImportEvents(configurations, exclusions);
            return new AutoConfigurationImportSelector.AutoConfigurationEntry(configurations, exclusions);
        }
    }
```

**Bước 1**:

Kiểm tra xem công tắc tự động cấu hình đã được bật chưa. Mặc định `spring.boot.enableautoconfiguration=true`, có thể cấu hình trong `application.properties` hoặc `application.yml`

![](https://oss.javaguide.cn/p3-juejin/77aa6a3727ea4392870f5cccd09844ab~tplv-k3u1fbpfcp-watermark.png)

**Bước 2**:

Dùng để lấy `exclude` và `excludeName` trong annotation `EnableAutoConfiguration`.

![](https://oss.javaguide.cn/p3-juejin/3d6ec93bbda1453aa08c52b49516c05a~tplv-k3u1fbpfcp-zoom-1.png)

**Bước 3**

Trong mã nguồn Spring Boot 2.1.x được sử dụng trong bài viết này, khi lấy tất cả các lớp cấu hình cần được tự động cấu hình, nó sẽ đọc `META-INF/spring.factories`:

```plain
spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
```

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/58c51920efea4757aa1ec29c6d5f9e36~tplv-k3u1fbpfcp-watermark.png)

Từ hình dưới có thể thấy nội dung cấu hình của file này đều đã được chúng ta đọc vào. `XXXAutoConfiguration` có tác dụng nạp component theo nhu cầu.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/94d6e1a060ac41db97043e1758789026~tplv-k3u1fbpfcp-watermark.png)

Không chỉ file `META-INF/spring.factories` trong dependency này được đọc, các file tài nguyên cùng tên trong các jar khác trên classpath cũng sẽ được `SpringFactoriesLoader` hợp nhất và đọc. Cần lưu ý, Starter thường chỉ là jar dùng để tổng hợp dependency, mã tự động cấu hình và file đăng ký có thể được đặt trong module autoconfigure riêng biệt, cũng có thể hợp nhất với Starter, không phải mỗi Starter đều nhất thiết phải chứa `spring.factories`.

Vì vậy, bạn có thể thấy rõ rằng, Spring Boot Starter của Druid (connection pool cơ sở dữ liệu) đã tạo file `META-INF/spring.factories`.

Nếu muốn viết tự động cấu hình cho Spring Boot 2.6 trở về trước, cần sử dụng cách đăng ký này; đối với Spring Boot 3.x, tự động cấu hình nên chuyển sang dùng `AutoConfiguration.imports`.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/68fa66aeee474b0385f94d23bcfe1745~tplv-k3u1fbpfcp-watermark.png)

**Bước 4**:

Đến đây có thể người phỏng vấn sẽ hỏi bạn: "Trong `spring.factories` có nhiều cấu hình như vậy, mỗi lần khởi động đều phải nạp toàn bộ sao?".

Rõ ràng, điều này là không thực tế. Khi chúng ta debug đến bước sau, bạn sẽ phát hiện giá trị của `configurations` đã nhỏ đi.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/267f8231ae2e48d982154140af6437b0~tplv-k3u1fbpfcp-watermark.png)

Bởi vì, ở bước này đã trải qua một lượt sàng lọc, tất cả các điều kiện trong `@ConditionalOnXXX` đều thỏa mãn thì lớp đó mới có hiệu lực.

```java
@Configuration
// Kiểm tra các lớp liên quan: RabbitTemplate và Channel có tồn tại hay không
// Tồn tại thì mới nạp
@ConditionalOnClass({ RabbitTemplate.class, Channel.class })
@EnableConfigurationProperties(RabbitProperties.class)
@Import(RabbitAnnotationDrivenConfiguration.class)
public class RabbitAutoConfiguration {
}
```

Các bạn quan tâm có thể tìm hiểu chi tiết về các annotation điều kiện (conditional annotation) mà Spring Boot cung cấp:

- `@ConditionalOnBean`: Khi trong container có Bean được chỉ định
- `@ConditionalOnMissingBean`: Khi trong container không có Bean được chỉ định
- `@ConditionalOnSingleCandidate`: Khi Bean được chỉ định trong container chỉ có một, hoặc tuy có nhiều nhưng có Bean được chỉ định làm ưu tiên
- `@ConditionalOnClass`: Khi trên classpath có lớp được chỉ định
- `@ConditionalOnMissingClass`: Khi trên classpath không có lớp được chỉ định
- `@ConditionalOnProperty`: Thuộc tính được chỉ định có giá trị được chỉ định hay không
- `@ConditionalOnResource`: Liệu classpath có tài nguyên được chỉ định hay không
- `@ConditionalOnExpression`: Dựa trên biểu thức SpEL làm điều kiện phán đoán
- `@ConditionalOnJava`: Dựa trên phiên bản Java làm điều kiện phán đoán
- `@ConditionalOnJndi`: Trong điều kiện JNDI tồn tại, tìm ở vị trí được chỉ định
- `@ConditionalOnNotWebApplication`: Trong điều kiện dự án hiện tại không phải là Web project
- `@ConditionalOnWebApplication`: Trong điều kiện dự án hiện tại là Web project

## Làm Thế Nào Để Triển Khai Một Starter

Nói suông thì không thuyết phục, bây giờ chúng ta sẽ làm ngay một starter, triển khai thread pool tùy chỉnh.

Bước đầu tiên, tạo project `threadpool-spring-boot-starter`

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/1ff0ebe7844f40289eb60213af72c5a6~tplv-k3u1fbpfcp-watermark.png)

Bước thứ hai, thêm dependency liên quan đến Spring Boot

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/5e14254276604f87b261e5a80a354cc0~tplv-k3u1fbpfcp-watermark.png)

Bước thứ ba, tạo `ThreadPoolAutoConfiguration`

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/1843f1d12c5649fba85fd7b4e4a59e39~tplv-k3u1fbpfcp-watermark.png)

Bước thứ tư, đăng ký lớp tự động cấu hình. Đối với Spring Boot 2.6 trở về trước, trong package resources của project `threadpool-spring-boot-starter`, tạo file `META-INF/spring.factories`; Spring Boot 2.7 trở lên nên sử dụng `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`, đối với Spring Boot 3.x, lớp tự động cấu hình thường được đánh dấu bằng `@AutoConfiguration`.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/97b738321f1542ea8140484d6aaf0728~tplv-k3u1fbpfcp-watermark.png)

Cuối cùng, tạo project mới và thêm dependency `threadpool-spring-boot-starter`

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/edcdd8595a024aba85b6bb20d0e3fed4~tplv-k3u1fbpfcp-watermark.png)

Kiểm tra thành công!!!

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/9a265eea4de742a6bbdbbaa75f437307~tplv-k3u1fbpfcp-watermark.png)

## Tổng Kết

Spring Boot kích hoạt tự động cấu hình thông qua `@EnableAutoConfiguration`, và nạp các lớp tự động cấu hình ứng viên đã được đăng ký trên classpath. Spring Boot 2.6 trở về trước chủ yếu đăng ký qua `spring.factories`, Spring Boot 2.7 trở lên sử dụng `AutoConfiguration.imports`. Lớp tự động cấu hình sẽ kết hợp với các annotation dòng `@Conditional` để có hiệu lực theo nhu cầu; vai trò chính của Starter là tổng hợp các dependency thường dùng, không phải là quy ước tên package cố định bắt buộc để tự động cấu hình có hiệu lực.

<!-- @include: @article-footer.snippet.md -->
