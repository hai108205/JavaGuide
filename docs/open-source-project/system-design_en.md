---
title: Java High-Quality Open-Source System Design Projects
description: Curated Java open-source system design projects, covering essential infrastructure components such as web frameworks, microservices, message queues, search engines, and databases.
category: Open-Source Projects
icon: "mdi:palette-swatch-outline"
---

## Basic Frameworks

### Web Frameworks

- [Spring Boot](https://github.com/spring-projects/spring-boot "spring-boot"): Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications, with an embedded web server that lets you run your project like a regular Java program. Additionally, most Spring Boot projects require only minimal configuration, which differs from Spring's heavy configuration approach.
- [SOFABoot](https://github.com/sofastack/sofa-boot): SOFABoot is built on top of Spring Boot, adding capabilities such as Readiness Check, class isolation, and log space isolation. It also provides companion components: SOFARPC (RPC framework), SOFABolt (Netty-based remote communication framework), SOFARegistry (service registry)... For details, see: [SOFAStack](https://github.com/sofastack).
- [Solon](https://gitee.com/opensolon/solon): A homegrown Java enterprise application development framework for all scenarios.
- [Javalin](https://github.com/tipsy/javalin): A lightweight web framework supporting both Java and Kotlin, used by companies such as Microsoft, Red Hat, and Uber.
- [Play Framework](https://github.com/playframework/playframework): A high-velocity web framework for Java and Scala.
- [Blade](https://github.com/lets-blade/blade): A simple and efficient web framework based on Java8 + Netty4.

### Microservices / Cloud-Native

- [Armeria](https://github.com/line/armeria): A microservice framework suited for any situation. Build any type of microservice with your preferred technologies, including [gRPC](https://grpc.io/), [Thrift](https://thrift.apache.org/), [Kotlin](https://kotlinlang.org/), [Retrofit](https://square.github.io/retrofit/), [Reactive Streams](https://www.reactive-streams.org/), [Spring Boot](https://spring.io/projects/spring-boot), and [Dropwizard](https://www.dropwizard.io/).
- [Quarkus](https://github.com/quarkusio/quarkus): A Kubernetes-native, container-first framework for writing Java applications.
- [Helidon](https://github.com/helidon-io/helidon): A set of Java libraries for writing microservices, supporting both Helidon MP and Helidon SE programming models.

### API Documentation

- [Swagger](https://swagger.io/): A mainstream RESTful API documentation tool that provides a set of tools and specifications, enabling developers to more easily create and maintain readable, user-friendly, and interactive API documentation.
- [Knife4j](https://doc.xiaominfo.com/): An enhanced solution integrating both Swagger2 and OpenAPI3.

### Bean Mapping

- [MapStruct](https://github.com/mapstruct/mapstruct) (Recommended): A Java annotation processor compliant with the JSR269 specification, used to generate type-safe and high-performance mappings for Java Beans. It generates get/set code at compile time, with no reflection involved, causing no additional performance overhead.
- [MapStruct Plus](https://github.com/linpeilie/mapstruct-plus): An enhanced version of MapStruct, supporting automatic generation of Mapper interfaces.
- [JMapper](https://github.com/jmapper-framework/jmapper-core): A high-performance and easy-to-use Bean mapping framework.

### Others

- [Guice](https://github.com/google/guice): A lightweight dependency injection framework open-sourced by Google, essentially a minimal-functionality, lightweight Spring Boot. It is quite practical in certain scenarios, such as when your project only needs dependency injection without features like AOP.
- [Spring Batch](https://github.com/spring-projects/spring-batch): Spring Batch is a lightweight yet comprehensive batch processing framework, primarily used for batch processing scenarios such as reading large volumes of records from databases, files, or queues. Note, however: Spring Batch is not a scheduling framework. Many excellent enterprise scheduling frameworks exist in both commercial and open-source domains, such as Quartz, XXL-JOB, and Elastic-Job. It is designed to work alongside schedulers, not to replace them.

## Authentication & Authorization

### Permission & Authentication

- [Sa-Token](https://github.com/dromara/sa-token): A lightweight Java permission and authentication framework. It supports authentication, authorization, single sign-on, forced logout, auto-renewal, and more. Compared to Spring Security and Shiro, Sa-Token offers more built-in, out-of-the-box features and is simpler to use.
- [Spring Security](https://github.com/spring-projects/spring-security): The official Spring security framework, capable of handling authentication, authorization, encryption, and session management. It is currently the most widely used Java security framework.
- [Shiro](https://github.com/apache/shiro): A Java security framework with functionality similar to Spring Security, but simpler to use.

### Third-Party Login

- [WxJava](https://github.com/Wechat-Group/WxJava): WxJava (WeChat Development Java SDK), supporting backend development for WeChat Pay, Open Platform, Mini Programs, WeCom / Enterprise WeChat, and Official Accounts.
- [JustAuth](https://github.com/justauth/JustAuth): A small yet comprehensive and elegant third-party login open-source component. It has already integrated with dozens of domestic and international platforms, including GitHub, Gitee, Alipay, Sina Weibo, WeChat, Google, Facebook, Twitter, StackOverflow, and more.

### Single Sign-On (SSO)

- [CAS](https://github.com/apereo/cas): An enterprise multilingual web single sign-on solution.
- [MaxKey](https://gitee.com/dromara/MaxKey): A single sign-on authentication system providing secure, standards-based, and open Identity Management (IDM), Access Management (AM), Single Sign-On (SSO), RBAC permission management, and resource management.
- [Keycloak](https://github.com/keycloak/keycloak): A free and open-source identity and access management system with highly configurable single sign-on capabilities.

## Network Communication

- [Netty](https://github.com/netty/netty): An NIO-based client-server framework that enables rapid and straightforward development of network applications.
- [Retrofit](https://github.com/square/retrofit): A type-safe HTTP client for Android and Java. Retrofit uses the [OkHttp](https://square.github.io/okhttp/) library (a widely adopted network framework) for its HTTP requests.
- [Forest](https://gitee.com/dromara/forest): A lightweight HTTP client API framework that makes sending HTTP/HTTPS requests in Java no longer a challenge. It sits at a higher level than OkHttp and HttpClient, serving as an excellent helper for wrapping calls to third-party RESTful API client interfaces, and is an alternative to Retrofit and Feign.
- [netty-websocket-spring-boot-starter](https://github.com/YeautyYE/netty-websocket-spring-boot-starter): Helps you use Netty to develop WebSocket servers in Spring Boot with annotation-based development as simple as spring-websocket.

## Database

### Database Connection Pool

- [Druid](https://github.com/alibaba/druid): Produced by Alibaba's Database Business Unit, a database connection pool built for monitoring.
- [HikariCP](https://github.com/brettwooldridge/HikariCP): A reliable, high-performance JDBC connection pool. Spring Boot 2.0 selected HikariCP as its default database connection pool.

### Database Frameworks

- [MyBatis-Plus](https://github.com/baomidou/mybatis-plus): A [MyBatis](http://www.mybatis.org/mybatis-3/) enhancement tool that builds on top of MyBatis — enhancing without altering, born to simplify development and boost efficiency.
- [MyBatis-Flex](https://gitee.com/mybatis-flex/mybatis-flex): An elegant MyBatis enhancement framework with zero third-party dependencies, supporting CRUD, paginated queries, multi-table queries, and batch operations.
- [jOOQ](https://github.com/jOOQ/jOOQ): The best way to write SQL in Java.
- [Redisson](https://github.com/redisson/redisson "redisson"): Redisson is a Java in-memory data grid built on top of Redis. It fully leverages the advantages of the Redis key-value database to provide Java developers with a range of commonly used utility classes with distributed characteristics — for example, distributed Java objects (`Set`, `SortedSet`, `Map`, `List`, `Queue`, `Deque`, etc.) and distributed locks. For a detailed introduction, see: [Redisson Project Introduction](https://github.com/redisson/redisson/wiki/Redisson%E9%A1%B9%E7%9B%AE%E4%BB%8B%E7%BB%8D "Redisson Project Introduction").

### Data Synchronization

- [Canal](https://github.com/alibaba/canal "canal") [kə'næl]: Canal, meaning waterway/pipe/channel, is primarily used for parsing MySQL database incremental logs to provide incremental data subscription and consumption.
- [DataX](https://github.com/alibaba/DataX "DataX"): DataX is an offline data synchronization tool/platform widely used within the Alibaba Group, enabling efficient data synchronization across heterogeneous data sources including MySQL, Oracle, SqlServer, Postgre, HDFS, Hive, ADS, HBase, TableStore (OTS), MaxCompute (ODPS), DRDS, and more. Related project: [DataX-Web](https://github.com/WeiYe-Jing/datax-web) (a visual web interface for DataX — select a data source and generate a data synchronization task with one click).

Other: [Flinkx](https://github.com/DTStack/flinkx) (a Flink-based distributed data synchronization tool).

### Time-Series Database

- [IoTDB](https://github.com/apache/iotdb): A homegrown time-series database written in Java, providing services for data collection, storage, and analysis. It seamlessly integrates with Hadoop, Spark, and visualization tools (such as Grafana), meeting the demands for massive data storage, high-throughput data ingestion, and complex data query analysis in the Industrial IoT domain.
- [KairosDB](https://github.com/kairosdb/kairosdb): A fast, distributed, and scalable time-series database built on Cassandra.

## Search Engines

- [Elasticsearch](https://github.com/elastic/elasticsearch "elasticsearch") (Recommended): An open-source, distributed, RESTful search engine.
- [Meilisearch](https://github.com/meilisearch/meilisearch): A powerful, fast, open-source search engine that is easy to use and deploy, with built-in support for Chinese search (no additional configuration required).
- [Solr](https://lucene.apache.org/solr/): Solr (pronounced "solar") is the open-source enterprise search platform from the Apache Lucene project.
- [Easy-ES](https://gitee.com/dromara/easy-es): A no-brainer ElasticSearch ORM framework.

## Testing

### Testing Frameworks

- [JUnit](http://junit.org/): A Java testing framework.
- [Mockito](https://github.com/mockito/mockito): Mockito is a mocking framework that lets you write beautiful unit tests with an elegant and concise API. (It replaces objects that are difficult to construct with virtual objects, serving as substitutes for real objects during debugging.)
- [PowerMock](https://github.com/powermock/powermock): Mockito alone is not enough for writing unit tests, as Mockito cannot mock private methods, final methods, or static methods. PowerMock is a framework primarily designed to extend other mock frameworks such as Mockito and EasyMock. It uses a custom class loader to manipulate bytecode, breaking through Mockito's limitations on mocking static methods, constructors, final classes, final methods, and private methods.
- [WireMock](https://github.com/tomakehurst/wiremock): A tool for simulating HTTP services (Mock your APIs).
- [Testcontainers](https://github.com/testcontainers/testcontainers-java): A JUnit-compatible testing library providing lightweight, disposable support for common database testing, Selenium web browsers, or any other instances that can run in Docker containers.

Related Reading:

- [The Practical Test Pyramid - Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html) (An excellent article, though in English.)
- [A Brief Discussion on PowerMock](https://juejin.im/post/6844903982058618894)

### Testing Platforms

- [MeterSphere](https://github.com/metersphere/metersphere): A one-stop open-source continuous testing platform covering test tracking, API testing, performance testing, team collaboration, and more — fully compatible with open-source and mainstream standards such as JMeter, Postman, and Swagger.
- [Apifox](https://www.apifox.cn/): API documentation, API debugging, API Mock, and API automated testing.

### API Debugging

- [Reqable](https://reqable.com/zh-CN/): A new-generation open-source API development tool. Reqable = Fiddler + Charles + Postman, making API debugging faster.
- [Insomnia](https://insomnia.rest/): Debug APIs like a human, not a robot. A personal favorite — a beautifully designed, lightweight API development tool that I use regularly.
- [RapidAPI](https://paw.cloud/): A full-featured HTTP client, but Mac-only.
- [Postcat](https://github.com/Postcatlab/postcat): An extensible, open-source API tool platform.
- [Postman](https://www.getpostman.com/): One of the most commonly used API testing tools among developers.
- [Hoppscotch](https://github.com/liyasthomas/postwoman "postwoman") (formerly Postwoman): An open-source API testing tool. Officially positioned as an open-source alternative to products like Postman and Insomnia.
- [Restful Fast Request](https://gitee.com/dromara/fast-request): Postman for IntelliJ IDEA — an API debugging tool + API management tool + API search tool.

## Job Scheduling

- [Quartz](https://github.com/quartz-scheduler/quartz): A wildly popular open-source job scheduling framework, the veteran and de facto reference standard in the Java scheduled-task domain. Many other job scheduling frameworks are built on top of `quartz` — for example, Dangdang's `elastic-job` is a distributed scheduling solution developed on top of `quartz`.
- [XXL-JOB](https://github.com/xuxueli/xxl-job): XXL-JOB is a distributed task scheduling platform with core design goals of rapid development, easy learning, lightweight footprint, and easy extensibility. It has been open-sourced and adopted in the production lines of multiple companies — ready to use out of the box.
- [Elastic-Job](http://elasticjob.io/index_zh.html): Elastic-Job is a distributed scheduling solution open-sourced by Dangdang, based on Quartz and ZooKeeper. It consists of two independent sub-projects, Elastic-Job-Lite and Elastic-Job-Cloud. Generally, Elastic-Job-Lite alone is sufficient.
- [EasyScheduler](https://github.com/analysys/EasyScheduler "EasyScheduler") (now renamed DolphinScheduler, an Apache Incubator project): A distributed, easily extensible, visual workflow task scheduling platform, primarily addressing the problem of "complex task dependencies without the ability to directly monitor task health status."
- [PowerJob](https://gitee.com/KFCFans/PowerJob): A new-generation distributed job scheduling and computing framework, supporting CRON, API, fixed-rate, and fixed-delay scheduling strategies. It provides workflows to orchestrate tasks and resolve dependencies. Easy to use, powerful, and well-documented — welcome to integrate! <http://www.powerjob.tech/>.

## Workflow

1. [Flowable](https://github.com/flowable/flowable-engine): Forked from Activiti5, feature-rich, introducing advanced capabilities on top of Activiti, such as stronger support for CMMN (Case Management Model and Notation), DMN (Decision Model and Notation), and more flexible integration options.
2. [Activiti](https://github.com/Activiti/Activiti): Relatively conservative in feature expansion, suitable for traditional enterprise applications requiring a stable BPMN 2.0 workflow engine.
3. [Warm-Flow](https://gitee.com/dromara/warm-flow): A homegrown open-source workflow engine — concise and lightweight yet far from simple. Fully featured, with independent and extensible components.
4. [FlowLong](https://gitee.com/aizuda/flowlong): A homegrown open-source workflow engine, purpose-built for Chinese-style approval processes.

## Distributed Systems

### API Gateway

- [Kong](https://github.com/Kong/kong "kong"): Kong is a cloud-native, fast, scalable, distributed microservice abstraction layer (also known as an API gateway, API middleware, or in some cases, a service mesh). Released as an open-source project in 2015, its core value lies in high performance and extensibility.
- [ShenYu](https://github.com/Dromara/soul "soul"): A scalable, high-performance, reactive API gateway solution for all microservices.
- [Spring Cloud Gateway](https://github.com/spring-cloud/spring-cloud-gateway): A high-performance gateway built on Spring Framework 5.x and Spring Boot 2.x.
- [Zuul](https://github.com/Netflix/zuul): Zuul is an L7 application gateway that provides dynamic routing, monitoring, resiliency, security, and more.

### Configuration Center

- [Apollo](https://github.com/ctripcorp/apollo "apollo") (Recommended): Apollo is a distributed configuration center developed by Ctrip's Framework Department. It centralizes management of configurations across different environments and clusters, pushes configuration changes to application endpoints in real time, and features standardized permission and process governance — well-suited for microservice configuration management scenarios.
- [Nacos](https://github.com/alibaba/nacos) (Recommended): Nacos is a service registration and discovery component provided by Spring Cloud Alibaba, similar to Consul and Eureka. It also offers distributed configuration management capabilities.
- [Spring Cloud Config](https://github.com/spring-cloud/spring-cloud-config): Spring Cloud Config is the earliest configuration center in the Spring Cloud family. Although Consul was later released and can replace configuration center functionality, Config remains suitable for Spring Cloud projects, enabling the feature with simple configuration.
- [Consul](https://github.com/hashicorp/consul): Consul is an open-source tool launched by HashiCorp, providing service governance, configuration center, control bus, and other capabilities within a microservice system. Each of these features can be used independently as needed, or together to build a full-service mesh — in short, Consul provides a complete service mesh solution.

### Distributed Tracing

- [Skywalking](https://github.com/apache/skywalking "skywalking"): Application performance monitoring for distributed systems, especially designed for microservices, cloud-native, and container-based distributed system architectures.
- [Zipkin](https://github.com/openzipkin/zipkin "zipkin"): Zipkin is a distributed tracing system. It helps collect timing data needed to troubleshoot latency issues in service architectures. Features include collection and lookup of such data.
- [CAT](https://github.com/dianping/cat "cat"): CAT serves as a foundational component for server-side projects, providing multi-language clients including Java, C/C++, Node.js, Python, and Go. It has been deeply integrated into Meituan-Dianping's infrastructure middleware framework (MVC framework, RPC framework, database framework, cache framework, message queue, configuration system, etc.), delivering rich system performance metrics, health status, and real-time alerts to all of Meituan-Dianping's business lines.

Related Reading: [Skywalking Official Comparison of Mainstream Open-Source Tracing Systems](https://skywalking.apache.org/zh/blog/2019-03-29-introduction-of-skywalking-and-simple-practice.html)

### Distributed Lock

- [Lock4j](https://gitee.com/baomidou/lock4j): A high-performance distributed lock supporting various backends such as Redisson and ZooKeeper.
- [Redisson](https://github.com/redisson/redisson "redisson"): Redisson offers comprehensive and powerful support for distributed locks, going far beyond simple Redis lock implementations.

## High Performance

### Multithreading

- [Hippo4j](https://github.com/opengoofy/hippo4j): An asynchronous thread pool framework supporting dynamic thread pool changes, monitoring, and alerting — easy to integrate without modifying any code. Supports multiple usage modes, designed to enhance system runtime assurance.
- [Dynamic Tp](https://github.com/dromara/dynamic-tp): A lightweight dynamic thread pool with built-in monitoring and alerting, integrated management of third-party middleware thread pools, based on mainstream configuration centers (currently supports Nacos, Apollo, ZooKeeper, Consul, Etcd; customizable via SPI).
- [asyncTool](https://gitee.com/jd-platform-opensource/asyncTool): A multithreading utility library open-sourced by a JD.com engineer, extensively using `CompletableFuture`. It handles arbitrary multi-threaded parallel, serial, blocking, dependency, and callback scenarios, allowing flexible composition of thread execution order with full-chain execution result callbacks.

### Caching

#### Local Cache

- [Caffeine](https://github.com/ben-manes/caffeine): A powerful local cache solution with outstanding performance.
- [Guava](https://github.com/google/guava): Google's core Java library, which includes a fairly complete local cache implementation.
- [OHC](https://github.com/snazy/ohc): A Java off-heap cache solution (no longer maintained since 2021).

#### Distributed Cache

- [Redis](https://github.com/redis/redis): An in-memory database written in C, the go-to choice for distributed caching.
- [Dragonfly](https://github.com/dragonflydb/dragonfly): An in-memory database built for modern application workloads, fully compatible with Redis and Memcached APIs — no code changes required when migrating. Claimed to be the world's fastest in-memory database.
- [KeyDB](https://github.com/Snapchat/KeyDB): A high-performance fork of Redis, focused on multithreading, memory efficiency, and high throughput.

#### Multi-Level Cache

- [J2Cache](https://gitee.com/ld/J2Cache): A two-level Java caching framework based on local memory and Redis.
- [JetCache](https://github.com/alibaba/jetcache): A caching framework open-sourced by Alibaba, supporting multi-level caching, automatic distributed cache refresh, TTL, and more.

### Message Queues

**Distributed Queues**:

- [RocketMQ](https://github.com/apache/rocketmq "RocketMQ"): A high-performance, high-throughput distributed messaging middleware open-sourced by Alibaba.
- [Kafka](https://github.com/apache/kafka "Kafka"): Kafka is a distributed, publish/subscribe-based messaging system.
- [RabbitMQ](https://github.com/rabbitmq "RabbitMQ"): A message queue developed in Erlang, implementing the AMQP (Advanced Message Queue Protocol).

**In-Memory Queues**:

- [Disruptor](https://github.com/LMAX-Exchange/disruptor): Disruptor is a high-performance queue developed by LMAX, a UK-based foreign exchange trading company. It was originally created to solve the latency problem of in-memory queues (performance testing revealed latency on the same order of magnitude as I/O operations).

### Read/Write Splitting and Database Sharding

- [ShardingSphere](https://github.com/apache/shardingsphere): ShardingSphere is an ecosystem of open-source distributed database middleware solutions, consisting of three independent products: Sharding-JDBC, Sharding-Proxy, and Sharding-Sidecar (planned).
- [MyCat](https://github.com/MyCatApache/MyCat2): MyCat is a database sharding middleware. Its two most commonly used features are read/write splitting and database/table sharding. MyCat was developed by community enthusiasts through secondary development on top of Alibaba's Cobar, resolving some of Cobar's existing issues at the time and adding many new features.
- [dynamic-datasource-spring-boot-starter](https://github.com/baomidou/dynamic-datasource-spring-boot-starter): A Spring Boot-based starter for quickly integrating multiple data sources, supporting multi-data-source, dynamic data source, primary-replica separation, read/write splitting, and distributed transactions.

## High Availability

### Rate Limiting

Distributed Rate Limiting:

- [Sentinel](https://github.com/alibaba/Sentinel) (Recommended): A high-availability protection component for distributed service architectures, primarily centered on traffic management. It helps users safeguard microservice stability from multiple dimensions, including flow control, circuit breaking, and system adaptive protection.
- [Hystrix](https://github.com/Netflix/Hystrix): Similar to Sentinel.

Related Reading: [Sentinel vs. Hystrix Comparison](https://sentinelguard.io/zh-cn/blog/sentinel-vs-hystrix.html).

Standalone Rate Limiting:

- [Bucket4j](https://github.com/vladimir-bukhtoyarov/bucket4j): An excellent rate-limiting library based on the token bucket / leaky bucket algorithm.
- [Resilience4j](https://github.com/resilience4j/resilience4j): A lightweight fault-tolerance component inspired by Hystrix.

### Monitoring

- [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin): Manage and monitor Spring Boot applications.
- [Metrics](https://github.com/dropwizard/metrics): Capture JVM and application-level metrics so you know what's going on.

### Logging

- Classic ELK Trio: Originally, ELK was an acronym for three open-source projects: Elasticsearch, Logstash, and Kibana.
- New-Generation ELK Architecture: Elasticsearch + Logstash + Kibana + Beats.
- EFK: The F in EFK stands for [Fluentd](https://github.com/fluent/fluentd).
- [TLog](https://gitee.com/dromara/TLog): A lightweight distributed log tagging and tracing marvel — integrable in 10 minutes, automatically tagging logs to complete microservice distributed tracing.

## Bytecode Manipulation

- [ASM](https://asm.ow2.io/): A general-purpose Java bytecode manipulation and analysis framework. It can be used to modify existing classes directly in binary form or to dynamically generate classes.
- [Byte Buddy](https://github.com/raphw/byte-buddy): A Java bytecode generation and manipulation library used to create and modify Java classes at runtime without requiring a compiler.
- [Javassist](https://github.com/jboss-javassist/javassist): A class library for dynamically editing Java bytecode.
- [Recaf](https://github.com/Col-E/Recaf): A modern Java bytecode editor based on ASM (Java bytecode manipulation framework), simplifying the process of editing compiled Java applications.
