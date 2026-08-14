---
title: "Spring & Spring Boot Chuyên Đề: IoC, AOP, Transaction, Auto-Assembly, Annotation Thường Dùng và Source Code"
description: Lộ trình học phỏng vấn Spring và Spring Boot, bao gồm IoC, AOP, Bean Lifecycle, Transaction, Auto-Assembly, Annotation thường dùng, Design Pattern, @Async, source code và các câu hỏi phỏng vấn thường gặp.
category: 框架
tag:
  - Spring
  - Spring Boot
  - 后端面试
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: Spring,Spring Boot,Spring面试题,SpringBoot面试题,IoC,AOP,Bean生命周期,Spring事务,Spring自动装配,Spring常用注解,Spring源码,@Async,Java后端面试
---

Spring là một trong những cơ sở hạ tầng (infrastructure) quan trọng nhất của Java backend. Học Spring không chỉ đơn thuần là học thuộc annotation, mà còn cần hiểu IoC, AOP, Bean Lifecycle, Transaction, Auto-Assembly, Design Pattern và các extension point phổ biến.

Spring Boot tiến thêm một bước nữa bằng cách tích hợp cấu hình (configuration), quản lý dependency, auto-assembly và khả năng quan sát (observability) trong production, giúp phát triển ứng dụng nhanh hơn, nhưng cũng dễ khiến người học bỏ qua nguyên lý nền tảng.

## Đối tượng phù hợp

- Java backend developer đang học tập có hệ thống về Spring, Spring MVC, Spring Boot.
- Bạn đọc đang chuẩn bị cho các câu hỏi phỏng vấn tần suất cao về Spring, Spring Boot.
- Bạn đọc đã từng dùng Spring Boot để phát triển dự án, nhưng chưa hiểu sâu về IoC, AOP, Transaction và Auto-Assembly.
- Kỹ sư muốn hiểu cơ sở hạ tầng backend engineering từ góc độ nguyên lý framework.

## Trọng tâm học tập

- Spring IoC giải quyết vấn đề tạo object và quản lý dependency, AOP giải quyết vấn đề tái sử dụng logic xuyên suốt (cross-cutting concerns).
- Bean Lifecycle, Scope, Circular Dependency và Extension Point là chìa khóa để hiểu Spring Container.
- Spring Transaction cần nắm vững Propagation Behavior, Isolation Level, Rollback Rule và các tình huống transaction không hoạt động (failure scenarios).
- Cốt lõi của Spring Boot Auto-Assembly nằm ở Conditional Assembly, Configuration Binding và hệ thống Starter.
- Học annotation không chỉ học thuộc công dụng, mà còn phải biết năng lực của container đứng đằng sau nó.
- Spring source code và Design Pattern phù hợp để đào sâu hiểu biết, không khuyến khích "cày" chi tiết source code ngay từ đầu.

## Thứ tự đọc đề xuất

1. [Tổng hợp câu hỏi phỏng vấn Spring thường gặp](./spring-knowledge-and-questions-summary.md): Xây dựng danh sách câu hỏi tần suất cao về Spring trước.
2. [IoC & AOP chi tiết (hiểu nhanh)](./ioc-and-aop.md): Hiểu hai khái niệm cốt lõi nhất của Spring.
3. [Tổng hợp annotation thường dùng trong Spring&SpringMVC&SpringBoot](./spring-common-annotations.md): Liên kết annotation thường dùng với năng lực của container.
4. [Spring Transaction chi tiết](./spring-transaction.md): Tập trung nắm vững Transaction Propagation, Isolation Level, Rollback Rule và failure scenario.
5. [Nguyên lý SpringBoot Auto-Assembly chi tiết](./spring-boot-auto-assembly-principles.md): Hiểu tại sao Spring Boot có thể "dùng ngay không cần cấu hình".
6. Sau đó đọc thêm theo nhu cầu: [Design Pattern trong Spring chi tiết](./spring-design-patterns-summary.md), [Phân tích nguyên lý Async annotation](./async.md) và [Giải mã Spring Boot source code cốt lõi](./springboot-source-code.md).

## Bài viết cốt lõi

- [Tổng hợp câu hỏi phỏng vấn Spring thường gặp](./spring-knowledge-and-questions-summary.md): Bao gồm IoC Container, nguyên lý AOP, Bean Lifecycle, Dependency Injection và các kiến thức cốt lõi khác của Spring.
- [Tổng hợp câu hỏi phỏng vấn SpringBoot thường gặp](./springboot-knowledge-and-questions-summary.md): Bao gồm nguyên lý Auto-Configuration, cơ chế Starter, tải file cấu hình và Actuator monitoring.
- [IoC & AOP chi tiết (hiểu nhanh)](./ioc-and-aop.md): Giải thích Inversion of Control, Dependency Injection, Aspect-Oriented Programming và cơ chế Dynamic Proxy.
- [Tổng hợp annotation thường dùng trong Spring&SpringMVC&SpringBoot](./spring-common-annotations.md): Tổng hợp các annotation thường dùng như `@Autowired`, `@Component`, `@RequestMapping`.
- [Spring Transaction chi tiết](./spring-transaction.md): Bao gồm `@Transactional`, Transaction Propagation Behavior, Isolation Level, Transaction Failure Scenario và Rollback Rule.
- [Nguyên lý SpringBoot Auto-Assembly chi tiết](./spring-boot-auto-assembly-principles.md): Phân tích `@EnableAutoConfiguration`, cơ chế tải SpringFactories và Conditional Annotation.
- [Design Pattern trong Spring chi tiết](./spring-design-patterns-summary.md): Hiểu cách Factory Pattern, Proxy Pattern, Singleton Pattern, Template Method Pattern, v.v. được áp dụng trong Spring.
- [Phân tích nguyên lý Async annotation](./async.md): Hiểu cấu hình Async Task, thiết lập Thread Pool và cơ chế `@EnableAsync`.
- [Giải mã Spring Boot source code cốt lõi](./springboot-source-code.md): Hiểu quy trình khởi động (startup), cơ chế Auto-Configuration và SpringApplication từ góc độ source code.

## Câu hỏi tần suất cao

- IoC là gì? DI là gì?
- Spring AOP và Dynamic Proxy có mối quan hệ như thế nào?
- Spring Bean Lifecycle diễn ra như thế nào?
- Spring giải quyết Circular Dependency ra sao? Những trường hợp Circular Dependency nào không thể giải quyết?
- `@Autowired` và `@Resource` khác nhau thế nào?
- Spring Transaction Propagation Behavior gồm những loại nào?
- Các tình huống `@Transactional` không hoạt động (failure scenario) thường gặp là gì?
- Quy trình Auto-Assembly của Spring Boot là gì?
- Starter có vai trò gì? Làm thế nào để tự định nghĩa một Starter?
- Spring sử dụng những Design Pattern nào?
- Tại sao `@Async` đôi khi không hoạt động?
- Nên bắt đầu đọc Spring source code từ những entry point nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức System Design](../../)
- [Chuyên đề cơ bản về System Design](../../basis/)
- [Tổng hợp câu hỏi phỏng vấn Design Pattern thường gặp](../../design-pattern.md)
- [Tổng hợp câu hỏi phỏng vấn MyBatis thường gặp](../mybatis/mybatis-interview.md)
- [Hệ thống kiến thức Distributed System](../../../distributed-system/)

<!-- @include: @article-footer.snippet.md -->
