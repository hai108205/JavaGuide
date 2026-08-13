---
title: Maven 最佳实践
description: 总结 Maven 在 Java 项目中的常见最佳实践，涵盖标准目录结构、编译版本、依赖管理、Profile、Maven Wrapper、CI 构建和插件使用。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Maven坐标,Maven仓库,Maven生命周期,Maven多模块管理,Maven Wrapper,依赖管理
---

> Bài viết này được JavaGuide dịch và hoàn thiện, địa chỉ bài gốc: <https://medium.com/@AlexanderObregon/maven-best-practices-tips-and-tricks-for-java-developers-438eca03f72b> .

Maven là công cụ tự động hóa build được sử dụng rộng rãi cho các dự án Java. Nó đơn giản hóa quá trình build và giúp chúng ta quản lý dependency. Phần giới thiệu chi tiết về Maven có thể tham khảo trong bài viết này: [Maven 核心概念总结](./maven-core-concepts.md).

Bài viết này không đi sâu vào các khái niệm cơ bản của Maven, mà chủ yếu thảo luận những vấn đề thực tiễn dễ gặp lỗi trong dự án: cấu trúc thư mục, phiên bản compile, phiên bản dependency, cấu hình môi trường, Wrapper, CI và quản lý plugin.

## Cấu trúc thư mục chuẩn của Maven

Maven tuân theo một cấu trúc thư mục chuẩn để duy trì sự nhất quán giữa các dự án. Tuân thủ cấu trúc này giúp các lập trình viên khác dễ dàng hiểu dự án của chúng ta hơn.

Cấu trúc thư mục chuẩn của một dự án Maven như sau:

```groovy
src/
  main/
    java/
    resources/
  test/
    java/
    resources/
pom.xml
```

- `src/main/java`: thư mục mã nguồn
- `src/main/resources`: thư mục file tài nguyên
- `src/test/java`: thư mục mã test
- `src/test/resources`: thư mục file tài nguyên test

Đây chỉ là ví dụ tối giản nhất về thư mục của một dự án Maven. Trong dự án thực tế, chúng ta còn chia nhỏ hơn nữa theo quy chuẩn của dự án.

## Chỉ định rõ phiên bản compile của Java

Đừng phụ thuộc vào phiên bản compile mặc định của Maven hay của plugin, dự án nên khai báo rõ phiên bản Java mục tiêu trong `pom.xml`. Với các dự án Java hiện đại, nên ưu tiên dùng `maven.compiler.release`, tương ứng với `javac --release`, an toàn hơn so với việc cấu hình riêng lẻ `source` và `target`.

Cần lưu ý rằng `javac --release` chỉ có từ JDK 9 trở đi; Maven Compiler Plugin từ phiên bản 3.13.0 trở về sau cũng hỗ trợ `maven.compiler.release` trên JDK 8 và sẽ tự động chuyển đổi thành `source` và `target`. Nếu dự án vẫn dùng plugin hoặc môi trường build cũ hơn, hãy cấu hình tường minh `source` và `target`.

Ví dụ, nếu dự án cần compile theo Java 17, có thể viết như sau:

```xml
<properties>
  <maven.compiler.release>17</maven.compiler.release>
</properties>
```

Nếu cần cấu hình trực tiếp Maven Compiler Plugin, cũng có thể viết như sau:

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.15.0</version>
      <configuration>
        <release>17</release>
      </configuration>
    </plugin>
  </plugins>
</build>
```

Giá trị của `release` không nên viết theo định dạng cũ như `1.8`. Ví dụ Java 8 viết `8`, Java 17 viết `17`, Java 21 viết `21`.

## Quản lý dependency hiệu quả

Hệ thống quản lý dependency của Maven là một trong những tính năng mạnh mẽ nhất của nó. Trong POM cha, việc định nghĩa phiên bản dependency dùng chung thông qua `dependencyManagement` giúp tránh tình trạng mỗi module con phải viết một phiên bản riêng, từ đó giảm xác suất xảy ra xung đột dependency.

Ví dụ, giả sử chúng ta có một module cha và hai module con A và B, muốn sử dụng JUnit 5 trong tất cả các module, ta có thể định nghĩa phiên bản JUnit thông qua `<dependencyManagement>` trong file `pom.xml` của module cha:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

Trong file `pom.xml` của các module con A và B, chỉ cần tham chiếu `groupId` và `artifactId` của JUnit là đủ:

```xml
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
  </dependency>
</dependencies>
```

Với các hệ sinh thái đã cung cấp sẵn BOM như Spring Boot, Spring Cloud, hãy ưu tiên import BOM chính thức, sau đó bỏ qua phiên bản của các dependency cụ thể trong module nghiệp vụ. Cách này giúp giảm các vấn đề tương thích phát sinh do "ghép phiên bản thủ công".

## Sử dụng profile cho từng môi trường khác nhau

Profile trong Maven cho phép chúng ta cấu hình thiết lập build cho các môi trường khác nhau, ví dụ development, testing và production. Định nghĩa profile trong file `pom.xml` và kích hoạt chúng bằng tham số dòng lệnh:

```xml
<profiles>
  <profile>
    <id>development</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
      <environment>dev</environment>
    </properties>
  </profile>
  <profile>
    <id>production</id>
    <properties>
      <environment>prod</environment>
    </properties>
  </profile>
</profiles>
```

Kích hoạt profile bằng dòng lệnh:

```bash
mvn clean install -P production
```

## Giữ pom.xml gọn gàng và ngăn nắp

File `pom.xml` được tổ chức tốt sẽ dễ bảo trì và dễ hiểu hơn. Dưới đây là một số mẹo để duy trì `pom.xml` sạch sẽ:

- Gom nhóm các dependency và plugin tương tự lại với nhau.
- Dùng comment để mô tả mục đích của dependency hoặc plugin cụ thể.
- Đặt các phiên bản dùng chung trong thẻ `<properties>`, hoặc quản lý tập trung trong `dependencyManagement` / `pluginManagement` của POM cha.

```xml
<properties>
  <junit.version>5.10.2</junit.version>
  <mockito.version>5.12.0</mockito.version>
</properties>
```

Phiên bản plugin cũng nên được khai báo tường minh. Đừng phụ thuộc vào phiên bản plugin mặc định của Maven, nếu không hành vi có thể khác nhau giữa các phiên bản Maven hoặc giữa các môi trường build khác nhau.

## Sử dụng Maven Wrapper

Maven Wrapper là công cụ dùng để quản lý và sử dụng Maven, cho phép chạy và build dự án Maven mà không cần cài đặt Maven từ trước.

Tài liệu chính thức của Maven giới thiệu về Maven Wrapper như sau:

> The Maven Wrapper is an easy way to ensure a user of your Maven build has everything necessary to run your Maven build.
>
> Maven Wrapper là một cách đơn giản để đảm bảo người dùng bản build Maven của bạn có đầy đủ mọi thứ cần thiết để chạy bản build Maven đó.

Maven Wrapper đảm bảo quá trình build sử dụng đúng phiên bản Maven, rất tiện lợi. Để sử dụng Maven Wrapper, hãy chạy lệnh sau trong thư mục dự án:

```bash
mvn wrapper:wrapper
```

Lệnh này sẽ sinh ra các file Maven Wrapper trong dự án của chúng ta. Khi đó, ta có thể dùng `./mvnw` (hoặc `./mvnw.cmd` trên Windows) thay cho `mvn` để thực thi các lệnh Maven.

Với dự án làm theo nhóm, nên commit cả `mvnw`, `mvnw.cmd` và thư mục `.mvn/wrapper/`. Như vậy thành viên mới hoặc môi trường CI không cần cài sẵn phiên bản Maven chỉ định mà vẫn build được bằng đúng phiên bản Maven mà dự án khai báo.

## Tự động hóa build bằng continuous integration

Tích hợp dự án Maven với hệ thống continuous integration (CI) (ví dụ Jenkins hoặc GitHub Actions) giúp đảm bảo mã của chúng ta được build, test và deploy tự động. CI giúp phát hiện vấn đề sớm và cung cấp quy trình build nhất quán trong toàn đội ngũ. Dưới đây là ví dụ đơn giản về workflow GitHub Actions cho dự án Maven:

```yaml
name: Java CI with Maven

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: "temurin"
          cache: "maven"

      - name: Build with Maven
        run: ./mvnw -B clean verify
```

Trong CI, nên dùng `clean verify`, lệnh này sẽ chạy test và các bước kiểm tra cần thiết. `install` sẽ cài artifact build vào repository cục bộ, chỉ cần dùng khi các bước sau đó thực sự phụ thuộc vào kết quả cài đặt cục bộ.

## Tận dụng Maven plugin để có thêm chức năng

Có rất nhiều Maven plugin dùng để mở rộng chức năng của Maven. Một số plugin phổ biến bao gồm (ba plugin đầu là plugin đi kèm Maven, ba plugin sau là plugin của bên thứ ba):

- maven-surefire-plugin: cấu hình và thực thi unit test.
- maven-failsafe-plugin: cấu hình và thực thi integration test.
- maven-javadoc-plugin: sinh tài liệu dự án theo định dạng Javadoc.
- maven-checkstyle-plugin: bắt buộc tuân thủ coding standard và best practice.
- jacoco-maven-plugin: đo độ bao phủ của unit test.
- sonar-maven-plugin: phân tích chất lượng mã nguồn.
- ……

Ví dụ sử dụng jacoco-maven-plugin:

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.12</version>
      <executions>
        <execution>
          <goals>
            <goal>prepare-agent</goal>
          </goals>
        </execution>
        <execution>
          <id>generate-code-coverage-report</id>
          <phase>test</phase>
          <goals>
            <goal>report</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

Nếu các plugin có sẵn không đáp ứng được nhu cầu, chúng ta còn có thể tự viết plugin tùy chỉnh.

Hãy khám phá các plugin có sẵn và cấu hình chúng trong file `pom.xml` để tăng cường quá trình phát triển của chúng ta.

## Tổng kết

Điều quan trọng nhất của Maven không phải là "có chạy được dự án hay không", mà là giúp cả đội ngũ sử dụng một cách build nhất quán trên môi trường local, CI và deployment. Trong dự án thực tế, nên ưu tiên làm tốt những việc sau: dùng cấu trúc thư mục chuẩn, khai báo tường minh phiên bản Java và plugin, quản lý phiên bản dependency thông qua POM cha, BOM và `dependencyManagement`, commit Maven Wrapper, đồng thời cố định JDK và lệnh build Maven trong CI.
