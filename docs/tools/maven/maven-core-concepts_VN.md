---
title: Maven 核心概念总结
description: Apache Maven 的本质是一个软件项目管理和理解工具。基于项目对象模型 (Project Object Model，POM) 的概念，Maven 可以从一条中心信息管理项目的构建、报告和文档。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Maven坐标,Maven仓库,Maven生命周期,Maven多模块管理
---

> Phần nội dung này được tổng hợp chủ yếu từ tài liệu chính thức của Maven, có lược bớt, chỉ giữ lại những phần quan trọng; không đi vào thực chiến mà chủ yếu giới thiệu các khái niệm quan trọng.

## Giới thiệu về Maven

Tài liệu chính thức của [Maven](https://github.com/apache/maven) giới thiệu về Maven như sau:

> Apache Maven is a software project management and comprehension tool. Based on the concept of a project object model (POM), Maven can manage a project's build, reporting and documentation from a central piece of information.
>
> Bản chất của Apache Maven là một công cụ quản lý và thấu hiểu dự án phần mềm. Dựa trên khái niệm Project Object Model (POM - Mô hình đối tượng dự án), Maven có thể quản lý quá trình build, báo cáo và tài liệu của dự án từ một nguồn thông tin tập trung.

**POM là gì?** Mỗi dự án Maven đều có một file `pom.xml` nằm ở thư mục gốc, chứa thông tin chi tiết về vòng đời build của dự án. Thông qua file `pom.xml`, chúng ta có thể định nghĩa tọa độ dự án, dependency của dự án, thông tin dự án, cấu hình plugin, v.v.

Đối với developer, Maven có 3 tác dụng chính:

1. **Build dự án**: cung cấp cách build dự án tự động, chuẩn hóa và đa nền tảng.
2. **Quản lý dependency**: quản lý thuận tiện các tài nguyên (file jar) mà dự án phụ thuộc vào, tránh xung đột phiên bản giữa các tài nguyên.
3. **Cấu trúc phát triển thống nhất**: cung cấp cấu trúc dự án chuẩn hóa, thống nhất.

Về cách sử dụng cơ bản của Maven thì ở đây không giới thiệu thêm, bạn nên xem tutorial 5 phút làm quen Maven trên trang chủ: [Maven in 5 Minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html).

## Tọa độ Maven (Maven Coordinate)

Các thư viện bên thứ ba và plugin mà dự án phụ thuộc vào có thể gọi chung là artifact. Mỗi artifact đều có thể được định danh duy nhất bằng tọa độ Maven, các thành phần của tọa độ bao gồm:

- **groupId** (bắt buộc): xác định tổ chức hoặc công ty mà dự án Maven hiện tại trực thuộc. groupId thường gồm nhiều phần, thông thường phần đầu là domain, phần thứ hai là tên công ty. Domain lại chia thành org, com, cn, v.v., trong đó org là tổ chức phi lợi nhuận, com là tổ chức thương mại, cn là Trung Quốc. Lấy dự án tomcat của cộng đồng mã nguồn mở apache làm ví dụ: groupId của dự án này là org.apache, domain là org (vì tomcat là dự án phi lợi nhuận), tên công ty là apache, artifactId là tomcat.
- **artifactId** (bắt buộc): xác định tên của dự án Maven hiện tại, là định danh duy nhất của dự án, tương ứng với tên thư mục gốc của dự án.
- **version** (bắt buộc): xác định phiên bản hiện tại của dự án Maven.
- **packaging** (tùy chọn): xác định cách đóng gói của dự án Maven (ví dụ jar, war...), mặc định là jar.
- **classifier** (tùy chọn): thường dùng để phân biệt các artifact có nội dung khác nhau được build từ cùng một POM, có thể là chuỗi bất kỳ, được gắn thêm sau số phiên bản.

Chỉ cần cung cấp đúng tọa độ, bạn có thể tìm thấy artifact tương ứng trong kho Maven để sử dụng.

Ví dụ (thêm EasyExcel do Alibaba phát hành mã nguồn mở):

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.1.1</version>
</dependency>
```

Bạn có thể tìm thấy hầu như mọi artifact có sẵn trên trang web <https://mvnrepository.com/>. Nếu dự án của bạn dùng Maven làm công cụ build, chắc chắn bạn sẽ thường xuyên làm việc với trang web này.

![Kho Maven](https://oss.javaguide.cn/github/javaguide/tools/maven/mvnrepository.com.png)

## Dependency trong Maven

Nếu artifact được tạo ra từ quá trình build Maven (ví dụ file Jar) được dự án khác tham chiếu, thì artifact đó chính là dependency của dự án kia.

### Cấu hình dependency

**Ví dụ về cấu hình**:

```xml
<project>
    <dependencies>
        <dependency>
            <groupId></groupId>
            <artifactId></artifactId>
            <version></version>
            <type>...</type>
            <scope>...</scope>
            <optional>...</optional>
            <exclusions>
                <exclusion>
                  <groupId>...</groupId>
                  <artifactId>...</artifactId>
                </exclusion>
          </exclusions>
        </dependency>
      </dependencies>
</project>
```

**Giải thích cấu hình**:

- dependencies: trong một file pom.xml chỉ được có duy nhất một thẻ này, đây là thẻ tổng thể dùng để quản lý các dependency.
- dependency: nằm trong thẻ dependencies, có thể có nhiều thẻ, mỗi thẻ biểu thị một dependency của dự án.
- groupId, artifactId, version (bắt buộc): tọa độ cơ bản của dependency. Đối với bất kỳ dependency nào, tọa độ cơ bản là phần quan trọng nhất, Maven phải dựa vào tọa độ mới tìm được dependency cần thiết. Ý nghĩa cụ thể của các thành phần này đã được giải thích ở trên nên không nhắc lại ở đây.
- type (tùy chọn): kiểu của dependency, tương ứng với packaging được định nghĩa trong tọa độ dự án. Trong hầu hết trường hợp không cần khai báo thành phần này, giá trị mặc định là jar.
- scope (tùy chọn): phạm vi của dependency, giá trị mặc định là compile.
- optional (tùy chọn): đánh dấu dependency có phải là tùy chọn hay không.
- exclusions (tùy chọn): dùng để loại trừ các dependency bắc cầu (transitive dependency), ví dụ như xung đột file jar.

### Phạm vi dependency (Dependency Scope)

**classpath** dùng để chỉ định vị trí lưu trữ các file `.class`, class loader sẽ nạp các file `.class` cần thiết từ đường dẫn này vào bộ nhớ.

Maven có ba classpath khác nhau cho quá trình biên dịch, chạy test và chạy thực tế:

- **classpath biên dịch**: có hiệu lực khi biên dịch code chính
- **classpath test**: có hiệu lực khi biên dịch và chạy test code
- **classpath chạy**: có hiệu lực khi dự án chạy thực tế

Phạm vi dependency của Maven như sau:

- **compile**: phạm vi dependency biên dịch (mặc định). Với phạm vi này, dependency có hiệu lực ở cả ba giai đoạn biên dịch, test và chạy, tức là file Jar của dependency được dùng ở cả lúc biên dịch, test và chạy.
- **test**: phạm vi dependency test. Đúng như tên gọi, phạm vi này chỉ dùng cho test, không thể dùng khi biên dịch và chạy dự án. Điển hình là JUnit, nó chỉ cần thiết khi biên dịch test code và chạy test code.
- **provided**: phạm vi này có hiệu lực khi biên dịch và test, nhưng không có hiệu lực khi chạy. Ví dụ `servlet-api.jar` đã được Tomcat cung cấp sẵn, chúng ta chỉ cần nó có mặt ở giai đoạn biên dịch.
- **runtime**: phạm vi dependency khi chạy. Có hiệu lực khi test và chạy, nhưng không có hiệu lực khi biên dịch code chính. Điển hình là các driver JDBC.
- **system**: phạm vi dependency hệ thống. Khi dùng dependency phạm vi system, bắt buộc phải chỉ định đường dẫn file dependency một cách tường minh thông qua thành phần systemPath, không phụ thuộc vào việc phân giải từ kho Maven nên có thể khiến quá trình build không portable.

### Dependency bắc cầu (Transitive Dependency)

### Xung đột dependency

**1. Đối với Maven, với cùng một groupId và cùng một artifactId thì chỉ có thể dùng một version.**

```xml
<dependency>
    <groupId>in.hocg.boot</groupId>
    <artifactId>mybatis-plus-spring-boot-starter</artifactId>
    <version>1.0.48</version>
</dependency>
<!-- Chỉ sử dụng dependency phiên bản 1.0.49 -->
<dependency>
    <groupId>in.hocg.boot</groupId>
    <artifactId>mybatis-plus-spring-boot-starter</artifactId>
    <version>1.0.49</version>
</dependency>
```

Nếu hai dependency cùng loại nhưng khác version cùng tồn tại trong một file pom, chỉ có dependency được khai báo sau mới được đưa vào.

**2. Hai dependency của dự án cùng đưa vào một dependency nào đó.**

Ví dụ, dự án có quan hệ phụ thuộc như sau:

```plain
Chuỗi dependency 1: A -> B -> C -> X(1.0)
Chuỗi dependency 2: A -> D -> X(2.0)
```

Trên hai đường dẫn dependency này có hai phiên bản của X. Để tránh trùng lặp dependency, Maven sẽ chỉ chọn một trong hai để phân giải.

**Phiên bản nào của X sẽ được Maven phân giải và sử dụng?**

Khi gặp vấn đề này, Maven tuân theo hai nguyên tắc lớn: **ưu tiên đường dẫn ngắn nhất** và **ưu tiên thứ tự khai báo**. Quá trình giải quyết vấn đề này còn được gọi là **điều phối dependency Maven (Maven dependency mediation)**.

**Ưu tiên đường dẫn ngắn nhất**

```plain
Chuỗi dependency 1: A -> B -> C -> X(1.0) // dist = 3
Chuỗi dependency 2: A -> D -> X(2.0) // dist = 2
```

Chuỗi dependency 2 có đường dẫn ngắn nhất, vì vậy X(2.0) sẽ được phân giải và sử dụng.

Tuy nhiên, bạn cũng có thể nhận ra nguyên tắc ưu tiên đường dẫn ngắn nhất không phải là vạn năng; với trường hợp độ dài đường dẫn bằng nhau dưới đây thì không thể chỉ dựa vào nguyên tắc này để giải quyết:

```plain
Chuỗi dependency 1: A -> B -> X(1.0) // dist = 2
Chuỗi dependency 2: A -> D -> X(2.0) // dist = 2
```

Vì vậy, Maven định nghĩa thêm nguyên tắc ưu tiên thứ tự khai báo.

Nguyên tắc điều phối thứ nhất không thể giải quyết mọi vấn đề, ví dụ với quan hệ dependency: A->B->Y(1.0), A-> C->Y(2.0), độ dài đường dẫn dependency của Y(1.0) và Y(2.0) bằng nhau, đều là 2. Maven định nghĩa nguyên tắc điều phối thứ hai:

**Ưu tiên thứ tự khai báo**

Khi độ dài đường dẫn dependency bằng nhau, thứ tự khai báo dependency trong `pom.xml` sẽ quyết định dependency nào được phân giải và sử dụng, dependency khai báo trước nhất sẽ thắng. Trong ví dụ này, nếu dependency B được khai báo trước D thì X (1.0) sẽ được phân giải và sử dụng.

```xml
<!-- A pom.xml -->
<dependencies>
    ...
    dependency B
    ...
    dependency D
</dependencies>
```

### Loại trừ dependency

Chỉ dựa vào Maven để điều phối dependency thì trong nhiều trường hợp là không đủ, chúng ta cần thủ công loại trừ dependency.

Ví dụ, dự án hiện tại có quan hệ phụ thuộc như sau:

```plain
Chuỗi dependency 1: A -> B -> C -> X(1.5) // dist = 3
Chuỗi dependency 2: A -> D -> X(1.0) // dist = 2
```

Theo nguyên tắc ưu tiên đường dẫn ngắn nhất, X(1.0) sẽ được phân giải và sử dụng, nghĩa là thực tế chúng ta dùng X phiên bản 1.0.

Nhưng!!! Điều này gây ra một số vấn đề: nếu dependency C sử dụng một class chỉ có ở phiên bản 1.5 của X, khi chạy dự án sẽ báo lỗi `NoClassDefFoundError`. Nếu dependency C sử dụng một method chỉ có ở phiên bản 1.5 của X, khi chạy dự án sẽ báo lỗi `NoSuchMethodError`.

Giờ thì bạn đã hiểu vì sao dự án Maven của mình cứ hay báo lỗi `NoClassDefFoundError` và `NoSuchMethodError` rồi chứ?

**Giải quyết thế nào?** Chúng ta có thể dùng thẻ `exclusion` để thủ công loại trừ X(1.0).

```xml
<dependency>
    ......
    <exclusions>
      <exclusion>
        <artifactId>x</artifactId>
        <groupId>org.apache.x</groupId>
      </exclusion>
    </exclusions>
</dependency>
```

Thông thường khi giải quyết xung đột dependency, chúng ta ưu tiên giữ lại phiên bản cao hơn. Đó là vì hầu hết các jar khi nâng cấp đều giữ tương thích ngược.

Nếu phiên bản cao đã thay đổi một số class hoặc method của phiên bản thấp, thì lúc này không thể chỉ đơn giản giữ phiên bản cao, mà nên cân nhắc tối ưu dependency phía trên, ví dụ nâng cấp phiên bản của dependency phía trên.

Vẫn là ví dụ trên:

```plain
Chuỗi dependency 1: A -> B -> C -> X(1.5) // dist = 3
Chuỗi dependency 2: A -> D -> X(1.0) // dist = 2
```

Chúng ta giữ lại X phiên bản 1.5, nhưng phiên bản này đã xóa một số class có ở phiên bản 1.0. Lúc này, chúng ta có thể cân nhắc nâng cấp D lên một phiên bản tương thích với X.

## Kho Maven (Maven Repository)

Trong thế giới Maven, bất kỳ dependency, plugin hay đầu ra nào của quá trình build dự án đều có thể được gọi là **artifact**.

Tọa độ và dependency là cách biểu diễn logic của artifact trong thế giới Maven; cách biểu diễn vật lý của artifact là file, và Maven quản lý thống nhất các file này thông qua kho (repository). Mỗi artifact được định danh duy nhất bằng một bộ tọa độ. Nhờ có kho, chúng ta không cần đưa artifact vào thủ công mà chỉ cần cung cấp tọa độ là có thể tìm thấy artifact trong kho Maven.

Kho Maven được chia thành:

- **Kho cục bộ (local repository)**: một thư mục trên máy tính chạy Maven, dùng để cache các artifact tải về từ xa và chứa các artifact tạm thời chưa được phát hành. Có thể xem cấu hình đường dẫn kho cục bộ của Maven trong file `settings.xml`, đường dẫn kho cục bộ mặc định là `${user.home}/.m2/repository`.
- **Kho từ xa (remote repository)**: các kho Maven do chính thức hoặc các tổ chức khác duy trì.

Kho từ xa của Maven có thể chia thành:

- **Kho trung tâm (central repository)**: kho này do cộng đồng Maven duy trì, lưu trữ gói của hầu hết các phần mềm mã nguồn mở, đồng thời là cấu hình mặc định của Maven nên developer không cần cấu hình thêm. Ngoài ra, để thuận tiện tra cứu, còn có một [địa chỉ tìm kiếm](https://search.maven.org/), developer có thể thông qua địa chỉ này để tìm tọa độ của artifact cần thiết nhanh hơn.
- **Kho riêng (private repository)**: đây là một loại kho Maven từ xa đặc biệt, một dịch vụ kho được triển khai trong mạng nội bộ. Kho riêng thường được cấu hình làm mirror của kho từ xa trên Internet, phục vụ người dùng Maven trong mạng nội bộ.
- **Các kho công cộng khác**: một số kho công cộng tồn tại nhằm tăng tốc truy cập (ví dụ kho mirror Maven của Alibaba Cloud) hoặc vì một số artifact không có trong kho trung tâm.

Thứ tự tìm gói dependency của Maven:

1. Trước tiên tìm trong kho cục bộ, nếu có thì dùng luôn.
2. Nếu không tìm thấy trong kho cục bộ, sẽ tìm trong kho từ xa và tải gói về kho cục bộ.
3. Nếu kho từ xa cũng không tìm thấy, sẽ báo lỗi.

## Vòng đời Maven (Maven Lifecycle)

Vòng đời Maven được tạo ra nhằm trừu tượng hóa và thống nhất mọi quá trình build, bao gồm gần như tất cả các bước build: dọn dẹp dự án, khởi tạo, biên dịch, test, đóng gói, integration test, xác minh, triển khai và tạo site.

Maven định nghĩa 3 vòng đời trong `META-INF/plexus/components.xml`:

- Vòng đời `default`
- Vòng đời `clean`
- Vòng đời `site`

Các vòng đời này độc lập với nhau, mỗi vòng đời gồm nhiều giai đoạn (phase). Các phase này có thứ tự, nghĩa là phase sau phụ thuộc vào phase trước. Khi thực thi một phase nào đó, các phase đứng trước nó sẽ được thực thi trước.

Cú pháp lệnh để thực thi vòng đời Maven như sau:

```bash
mvn phase [phase2] ...[phasen]
```

### Vòng đời default

Vòng đời `default` được định nghĩa trong trường hợp chưa có plugin nào được gắn vào; đây là vòng đời chính của Maven, dùng để build ứng dụng, gồm 23 phase.

```xml
<phases>
  <!-- Xác minh dự án đã đúng chưa và mọi thông tin cần thiết đã sẵn sàng để hoàn tất quá trình build -->
  <phase>validate</phase>
  <!-- Thiết lập trạng thái khởi tạo, ví dụ như cài đặt các thuộc tính -->
  <phase>initialize</phase>
  <!-- Tạo mã nguồn cần đưa vào giai đoạn biên dịch -->
  <phase>generate-sources</phase>
  <!-- Xử lý mã nguồn -->
  <phase>process-sources</phase>
  <!-- Tạo tài nguyên cần đưa vào gói -->
  <phase>generate-resources</phase>
  <!-- Sao chép và xử lý tài nguyên vào thư mục đích, chuẩn bị cho giai đoạn đóng gói. -->
  <phase>process-resources</phase>
  <!-- Biên dịch mã nguồn của dự án -->
  <phase>compile</phase>
  <!-- Hậu xử lý các file được tạo ra sau biên dịch, ví dụ tăng cường/tối ưu bytecode cho các class Java -->
  <phase>process-classes</phase>
  <!-- Tạo mã nguồn test cần đưa vào giai đoạn biên dịch -->
  <phase>generate-test-sources</phase>
  <!-- Xử lý mã nguồn test -->
  <phase>process-test-sources</phase>
  <!-- Tạo tài nguyên test cần đưa vào giai đoạn biên dịch -->
  <phase>generate-test-resources</phase>
  <!-- Xử lý các file được tạo ra từ việc biên dịch file mã nguồn test -->
  <phase>process-test-resources</phase>
  <!-- Biên dịch mã nguồn test -->
  <phase>test-compile</phase>
  <!-- Xử lý các file được tạo ra từ việc biên dịch file mã nguồn test -->
  <phase>process-test-classes</phase>
  <!-- Chạy test bằng framework unit test phù hợp (JUnit là một trong số đó) -->
  <phase>test</phase>
  <!-- Trước khi đóng gói chính thức, thực hiện mọi thao tác cần thiết để chuẩn bị đóng gói -->
  <phase>prepare-package</phase>
  <!-- Lấy mã đã biên dịch và đóng gói thành định dạng có thể phân phối, ví dụ file JAR, WAR hoặc EAR -->
  <phase>package</phase>
  <!-- Thực hiện các thao tác cần thiết trước khi chạy integration test, ví dụ thiết lập môi trường cần thiết -->
  <phase>pre-integration-test</phase>
  <!-- Xử lý và triển khai gói phần mềm (nếu cần) đến môi trường có thể chạy integration test -->
  <phase>integration-test</phase>
  <!-- Thực hiện các thao tác cần thiết sau khi chạy integration test, ví dụ dọn dẹp môi trường -->
  <phase>post-integration-test</phase>
  <!-- Chạy các bước kiểm tra để xác minh gói đã đóng có hợp lệ và đạt chuẩn chất lượng hay không. -->
  <phase>verify</phase>
  <!-- Cài đặt gói vào kho cục bộ, có thể dùng làm dependency cho các dự án khác trên máy -->
  <phase>install</phase>
  <!-- Sao chép gói dự án cuối cùng lên kho từ xa để chia sẻ với các developer và dự án khác -->
  <phase>deploy</phase>
</phases>
```

Theo lý thuyết về quan hệ phụ thuộc giữa các phase đã đề cập ở trên, khi chạy lệnh `mvn test`, tất cả các phase từ validate đến test sẽ được thực thi; điều này cũng giải thích vì sao code của dự án được tự động biên dịch khi chạy test.

### Vòng đời clean

Mục đích của vòng đời clean là dọn dẹp dự án, gồm 3 phase:

1. pre-clean
2. clean
3. post-clean

```xml
<phases>
  <!--  Thực hiện một số công việc cần hoàn tất trước khi clean -->
  <phase>pre-clean</phase>
  <!--  Xóa tất cả các file được tạo ra từ lần build trước -->
  <phase>clean</phase>
  <!--  Thực hiện một số công việc cần hoàn tất ngay sau khi clean -->
  <phase>post-clean</phase>
</phases>
<default-phases>
  <clean>
    org.apache.maven.plugins:maven-clean-plugin:2.5:clean
  </clean>
</default-phases>
```

Theo lý thuyết về quan hệ phụ thuộc giữa các phase đã đề cập ở trên, khi chạy `mvn clean`, các phase pre-clean và clean của vòng đời clean sẽ được thực thi.

### Vòng đời site

Mục đích của vòng đời site là xây dựng và phát hành site của dự án, gồm 4 phase:

1. pre-site
2. site
3. post-site
4. site-deploy

```xml
<phases>
  <!--  Thực hiện một số công việc cần hoàn tất trước khi tạo tài liệu site -->
  <phase>pre-site</phase>
  <!--  Tạo tài liệu site của dự án -->
  <phase>site</phase>
  <!--  Thực hiện một số công việc cần hoàn tất sau khi tạo tài liệu site và chuẩn bị cho việc triển khai -->
  <phase>post-site</phase>
  <!--  Triển khai tài liệu site đã tạo lên một server cụ thể -->
  <phase>site-deploy</phase>
</phases>
<default-phases>
  <site>
    org.apache.maven.plugins:maven-site-plugin:3.3:site
  </site>
  <site-deploy>
    org.apache.maven.plugins:maven-site-plugin:3.3:deploy
  </site-deploy>
</default-phases>
```

Maven có thể dựa trên thông tin trong `pom.xml` để tự động tạo ra một site thân thiện, thuận tiện cho việc trao đổi trong team và công bố thông tin dự án.

## Plugin Maven

Về bản chất, Maven là một framework thực thi plugin; mọi quá trình thực thi đều được hoàn thành bởi từng plugin riêng lẻ. Những lệnh chúng ta dùng hằng ngày như install, clean, deploy thực chất đều là các plugin Maven ở tầng dưới. Về các plugin cốt lõi của Maven, có thể tham khảo tài liệu chính thức: <https://maven.apache.org/plugins/index.html>.

Đường dẫn plugin mặc định trên máy: `${user.home}/.m2/repository/org/apache/maven/plugins`

![](https://oss.javaguide.cn/github/javaguide/tools/maven/maven-plugins.png)

Ngoài các plugin do chính Maven cung cấp, còn có một số plugin của bên thứ ba, ví dụ plugin đo độ phủ unit test jacoco-maven-plugin, plugin giúp developer phát hiện các điểm không đúng chuẩn trong code maven-checkstyle-plugin, hay plugin phân tích chất lượng code sonar-maven-plugin. Hơn nữa, chúng ta còn có thể tự định nghĩa plugin để đáp ứng nhu cầu riêng.

Ví dụ sử dụng jacoco-maven-plugin:

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.8</version>
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

Bạn có thể hiểu plugin Maven như một tập hợp các task: người dùng có thể chạy trực tiếp task của một plugin cụ thể qua dòng lệnh, hoặc gắn task của plugin vào vòng đời build để chạy cùng vòng đời.

Plugin Maven được chia thành hai loại sau:

- **Build plugins**: thực thi trong quá trình build.
- **Reporting plugins**: thực thi trong quá trình tạo site.

## Quản lý đa module trong Maven

Quản lý đa module hiểu đơn giản là chia một dự án thành nhiều module, mỗi module chỉ đảm nhận một chức năng duy nhất. Biểu hiện trực quan là một dự án Maven không chỉ có một file `pom.xml` mà có nhiều file `pom.xml` ở các thư mục khác nhau, từ đó thực hiện quản lý đa module.

Ngoài việc giúp phát triển và quản lý dự án thuận tiện hơn, quản lý đa module còn có những lợi ích sau:

1. Giảm coupling giữa các phần code (nâng từ coupling cấp class lên coupling cấp file jar);
2. Giảm trùng lặp, tăng khả năng tái sử dụng;
3. Mỗi module đều có thể tự giải thích (thông qua tên module hoặc tài liệu module);
4. Module còn chuẩn hóa việc phân chia ranh giới code, developer dễ dàng xác định phần mình phụ trách thông qua module.

Trong mô hình đa module, có một module cha và còn lại là các module con. Module cha thường chỉ có một file `pom.xml`, không có nội dung khác. File `pom.xml` của module cha thường chỉ định nghĩa version của các dependency, danh sách các module con và các plugin. Tuy nhiên cần lưu ý: nếu dependency chỉ được dùng trong một dự án con nào đó, thì có thể khai báo trực tiếp trong pom.xml của dự án con, tránh để pom cha trở nên quá cồng kềnh.

Như hình dưới đây, dự án Dubbo được chia thành nhiều module con, ví dụ dubbo-common (module logic dùng chung), dubbo-remoting (module truyền thông từ xa), dubbo-rpc (module gọi từ xa).

![](https://oss.javaguide.cn/github/javaguide/tools/maven/dubbo-maven-multi-module.png)

## Bài viết nên đọc

- [Cơ chế phân xử trong các tình huống dependency gián tiếp của Maven (góc nhìn từ team bảo mật) - Alibaba Developer - 2022](https://mp.weixin.qq.com/s/flniMiP-eu3JSBnswfd_Ew)
- [Sử dụng hiệu quả công cụ build Java | Phần Maven - Alibaba Developer - 2022](https://mp.weixin.qq.com/s/Wvq7t2FC58jaCh4UFJ6GGQ)
- [Câu chuyện về repackaging trong Maven (góc nhìn từ team bảo mật) - Alibaba Developer - 2022](https://mp.weixin.qq.com/s/xsJkB0onUkakrVH0wejcIg)

## Tham khảo

- 《Maven thực chiến》
- Introduction to Repositories - Tài liệu chính thức của Maven: <https://maven.apache.org/guides/introduction/introduction-to-repositories.html>
- Introduction to the Build Lifecycle - Tài liệu chính thức của Maven: <https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html#Lifecycle_Reference>
- Phạm vi dependency trong Maven: <https://www.mvnbook.com/maven-dependency.html>
- Giải quyết xung đột dependency trong Maven, bài này là đủ!: <https://www.cnblogs.com/qdhxhz/p/16363532.html>
- Multi-Module Project with Maven: <https://www.baeldung.com/maven-multi-module>

<!-- @include: @article-footer.snippet.md -->
