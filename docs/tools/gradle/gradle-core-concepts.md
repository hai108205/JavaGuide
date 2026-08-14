---
title: Gradle 核心概念总结
description: Gradle 是一个运行在 JVM 上的自动化构建工具，支持灵活的任务编排、依赖管理、插件扩展和多项目构建。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Gradle,Groovy,Gradle Wrapper,Gradle 包装器,Gradle 插件
---

> Phần nội dung này chủ yếu được tổng hợp từ tài liệu chính thức của Gradle, đã được lược bớt, chỉ giữ lại những phần quan trọng, không đi vào thực chiến mà chủ yếu giới thiệu các khái niệm quan trọng.

Phần nội dung về Gradle này là nội dung tùy chọn, bạn có thể dựa vào nhu cầu của bản thân để quyết định có học hay không. Trong các dự án Java backend tại Việt Nam, Maven vẫn phổ biến hơn, nhưng trong Android, một số dự án Spring Boot cũng như các dự án cần tùy biến cao quy trình build, Gradle cũng được sử dụng rất nhiều.

## Giới thiệu về Gradle

Tài liệu chính thức của Gradle giới thiệu về Gradle như sau:

> Gradle is an open-source [build automation](https://en.wikipedia.org/wiki/Build_automation) tool flexible enough to build almost any type of software. Gradle makes few assumptions about what you’re trying to build or how to build it. This makes Gradle particularly flexible.
>
> Gradle là một công cụ tự động hóa build mã nguồn mở, đủ linh hoạt để build gần như mọi loại phần mềm. Gradle đưa ra rất ít giả định về những gì bạn đang cố build hoặc cách build nó. Điều này khiến Gradle đặc biệt linh hoạt.

Nói một cách đơn giản, Gradle là một công cụ tự động hóa build dự án chạy trên JVM, giúp chúng ta hoàn thành các tác vụ build như biên dịch, kiểm thử, đóng gói và phát hành.

Đối với lập trình viên, Gradle có 3 tác dụng chính:

1. **Build dự án**: Cung cấp cách build dự án tự động hóa chuẩn mực, đa nền tảng.
2. **Quản lý dependency**: Quản lý thuận tiện các tài nguyên mà dự án phụ thuộc (các file jar), tránh xung đột phiên bản giữa các tài nguyên.
3. **Cấu trúc phát triển thống nhất**: Cung cấp cấu trúc dự án chuẩn mực, thống nhất.

Script build của Gradle có thể được viết bằng Groovy DSL hoặc Kotlin DSL. Hiện nay trong các dự án mới, Kotlin DSL cũng rất phổ biến, vì gợi ý kiểu (type hint) và hỗ trợ IDE của nó thường tốt hơn.

## Giới thiệu về Groovy

Gradle là một chương trình chạy trên JVM, script build có thể được viết bằng Groovy hoặc Kotlin. Trước đây, rất nhiều ví dụ về Gradle sử dụng Groovy DSL, vì vậy việc tìm hiểu trước một chút cú pháp Groovy sẽ rất hữu ích khi đọc các dự án cũ.

Groovy là ngôn ngữ kịch bản chạy trên JVM, là ngôn ngữ động được xây dựng dựa trên phần mở rộng của Java, cú pháp của nó rất giống Java và có thể sử dụng thư viện class của Java. Groovy có thể dùng cho lập trình hướng đối tượng, cũng có thể dùng như một ngôn ngữ kịch bản thuần túy. Trong thiết kế ngôn ngữ, nó tiếp thu các tính năng ưu việt của Java, Python, Ruby và Smalltalk, chẳng hạn như chuyển đổi kiểu động, closure và hỗ trợ metaprogramming.

Chúng ta có thể học Groovy theo cách học Java, chi phí học tập tương đối thấp, ngay cả khi trong quá trình phát triển mà quên mất cú pháp Groovy, bạn vẫn có thể dùng cú pháp Java để tiếp tục viết code.

Có rất nhiều ngôn ngữ dựa trên JVM, chẳng hạn như Groovy, Kotlin, Java, Scala, chúng cuối cùng đều được biên dịch thành file bytecode Java và chạy trên JVM.

## Ưu điểm của Gradle

Gradle là hệ thống build thế hệ mới, có nhiều ưu điểm như hiệu quả và linh hoạt, được sử dụng rộng rãi trong phát triển Java. Không chỉ Android chọn nó làm hệ thống build chính thức, ngày càng nhiều dự án Java như Spring Boot cũng dần dần chuyển sang Gradle.

- Về tính linh hoạt, Gradle hỗ trợ viết script bằng ngôn ngữ Groovy, chú trọng tính linh hoạt của quá trình build, phù hợp với các dự án có độ phức tạp cao, có thể hoàn thành những quy trình build rất phức tạp.
- Về độ chi tiết, độ chi tiết của build trong Gradle được chia nhỏ đến từng task. Và toàn bộ mã nguồn Task của nó đều là mã nguồn mở, sau khi nắm vững toàn bộ quy trình đóng gói này, chúng ta có thể sửa đổi các Task của nó để thay đổi động quy trình thực thi.
- Về khả năng mở rộng, Gradle hỗ trợ cơ chế plugin, vì vậy chúng ta có thể tái sử dụng các plugin này, đơn giản và thuận tiện như việc tái sử dụng thư viện.

## Giới thiệu về Gradle Wrapper

Tài liệu chính thức của Gradle giới thiệu về Gradle Wrapper như sau:

> The recommended way to execute any Gradle build is with the help of the Gradle Wrapper (in short just “Wrapper”). The Wrapper is a script that invokes a declared version of Gradle, downloading it beforehand if necessary. As a result, developers can get up and running with a Gradle project quickly without having to follow manual installation processes saving your company time and money.
>
> Cách được khuyến nghị để thực thi bất kỳ bản build Gradle nào là nhờ sự trợ giúp của Gradle Wrapper (gọi tắt là "Wrapper"). Wrapper là một script gọi đến phiên bản Gradle đã được khai báo, và sẽ tải phiên bản đó về trước nếu cần. Nhờ đó, lập trình viên có thể nhanh chóng khởi động và chạy dự án Gradle mà không cần làm theo quy trình cài đặt thủ công, giúp công ty tiết kiệm thời gian và tiền bạc.

Chúng ta có thể gọi Gradle Wrapper là trình bao bọc (wrapper) của Gradle, nó đóng gói Gradle một lần nữa, để tất cả các phương thức build của Gradle chạy dưới sự trợ giúp của trình bao bọc này.

Sơ đồ quy trình làm việc của Gradle Wrapper như sau (nguồn ảnh từ [giới thiệu trong tài liệu chính thức của Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)):

![Quy trình làm việc của Wrapper](https://oss.javaguide.cn/github/javaguide/csdn/efa7a0006b04051e2b84cd116c6ccdfc.png)

Toàn bộ quy trình chủ yếu được chia thành 3 bước sau:

1. Đầu tiên, khi mới khởi tạo, nếu phiên bản được chỉ định chưa được tải về, nó sẽ tải file nén của phiên bản tương ứng từ máy chủ của Gradle;
2. Sau khi tải xong, cần giải nén và thực thi file batch;
3. Các lần build dự án sau đó đều sẽ tái sử dụng phiên bản Gradle đã được giải nén này.

Gradle Wrapper mang lại cho chúng ta những lợi ích sau:

1. Chuẩn hóa dự án trên một phiên bản Gradle nhất định, từ đó giúp bản build đáng tin cậy và ổn định hơn.
2. Cho phép chạy dự án Gradle ngay cả khi máy tính của chúng ta không cài đặt môi trường Gradle.
3. Việc cung cấp phiên bản Gradle mới cho các người dùng và môi trường thực thi khác nhau (ví dụ IDE hoặc máy chủ CI) đơn giản như việc thay đổi định nghĩa của Wrapper.

### Tạo Gradle Wrapper

Nếu muốn tạo Gradle Wrapper lần đầu tiên, máy local cần có sẵn Gradle dùng được. Gradle đã tích hợp sẵn Wrapper Task, chỉ cần chạy lệnh `gradle wrapper` tại thư mục gốc của dự án là có thể tạo ra Gradle Wrapper.

Khi thực thi lệnh `gradle wrapper`, có thể chỉ định một số tham số để điều khiển việc tạo wrapper. Cụ thể có các tham số cấu hình sau:

- `--gradle-version`: Dùng để chỉ định phiên bản Gradle sử dụng.
- `--gradle-distribution-url`: Dùng để chỉ định URL tải bản phân phối Gradle, giá trị này thường có dạng như `https://services.gradle.org/distributions/gradle-${gradleVersion}-bin.zip`.
- `--gradle-distribution-sha256-sum`: Dùng để chỉ định giá trị checksum SHA-256 của file nén bản phân phối, giúp giảm rủi ro file tải về bị giả mạo.

Sau khi thực thi lệnh `gradle wrapper`, Gradle Wrapper sẽ được tạo xong, trong thư mục gốc của dự án sẽ sinh ra các file sau:

```plain
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
└── gradlew.bat
```

Ý nghĩa của từng file như sau:

- `gradle-wrapper.jar`: Chứa mã logic vận hành của Gradle runtime.
- `gradle-wrapper.properties`: Định nghĩa số phiên bản Gradle và các thuộc tính hành vi của Gradle runtime.
- `gradlew`: Script wrapper dùng để thực thi lệnh Gradle trên nền tảng Linux/macOS.
- `gradlew.bat`: Script wrapper dùng để thực thi lệnh Gradle trên nền tảng Windows.

Nội dung của file `gradle-wrapper.properties` như sau:

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-6.0.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

- `distributionBase`: Thư mục cha lưu trữ Gradle sau khi giải nén.
- `distributionPath`: Thư mục con của thư mục được chỉ định bởi `distributionBase`. `distributionBase+distributionPath` chính là thư mục cụ thể lưu trữ Gradle sau khi giải nén.
- `distributionUrl`: Địa chỉ tải file nén của phiên bản Gradle được chỉ định.
- `zipStoreBase`: Thư mục cha lưu trữ file nén Gradle sau khi tải về.
- `zipStorePath`: Thư mục con của thư mục được chỉ định bởi `zipStoreBase`. `zipStoreBase+zipStorePath` chính là vị trí lưu trữ file nén Gradle.

### Cập nhật Gradle Wrapper

Có 2 cách để cập nhật Gradle Wrapper:

1. Sửa trực tiếp trường `distributionUrl`, sau đó thực thi lệnh Gradle.
2. Thực thi `./gradlew wrapper --gradle-version [version]`.

Lệnh dưới đây sẽ nâng cấp phiên bản Gradle lên 9.5.1.

```shell
./gradlew wrapper --gradle-version 9.5.1
```

Thuộc tính `distributionUrl` trong file `gradle-wrapper.properties` cũng sẽ thay đổi theo.

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-9.5.1-bin.zip
```

Sau khi dự án đã tạo Wrapper, các bản build hằng ngày nên ưu tiên sử dụng `./gradlew build`, thay vì dùng trực tiếp `gradle build` được cài trên máy local. Cách này đảm bảo các thành viên trong nhóm và CI sử dụng cùng một phiên bản Gradle.

### Tùy chỉnh Gradle Wrapper

Gradle đã tích hợp sẵn Wrapper Task, vì vậy khi build Gradle Wrapper sẽ sinh ra file thuộc tính của Gradle Wrapper, file thuộc tính này có thể được thiết lập bằng cách tùy chỉnh Wrapper Task. Ví dụ chúng ta muốn đổi phiên bản Gradle cần tải về thành 9.5.1, có thể thiết lập như sau:

```groovy
tasks.wrapper {
    gradleVersion = '9.5.1'
}
```

Cũng có thể thiết lập địa chỉ tải file nén bản phân phối Gradle và đường dẫn lưu trữ local sau khi giải nén Gradle cùng các cấu hình khác.

```groovy
tasks.wrapper {
    gradleVersion = '9.5.1'
    distributionUrl = '../../gradle-9.5.1-bin.zip'
    distributionPath = 'wrapper/dists'
}
```

Thuộc tính `distributionUrl` có thể được đặt thành thư mục local của dự án, bạn cũng có thể đặt thành địa chỉ mạng.

## Task trong Gradle

Trong Gradle, task (nhiệm vụ) là đơn vị công việc đơn lẻ của một lần thực thi build.

Quá trình build của Gradle được thực hiện dựa trên Task, khi bạn chạy dự án, thực tế là đang thực thi một loạt các Task, chẳng hạn Task biên dịch mã nguồn Java, Task tạo file jar.

Cách khai báo Task như sau (còn có một vài cách khai báo khác):

```groovy
// Khai báo một Task có tên là helloTask
task helloTask{
     doLast{
       println "Hello"
     }
}
```

Sau khi tạo một Task, có thể thêm các Action khác nhau vào Task tùy theo nhu cầu, "doLast" ở trên chính là thêm một Action vào cuối hàng đợi.

```groovy
 //Thêm Action vào đầu hàng đợi Action
 Task doFirst(Action<? super Task> action);
 Task doFirst(Closure action);

 //Thêm Action vào cuối hàng đợi Action
 Task doLast(Action<? super Task> action);
 Task doLast(Closure action);

 //Xóa tất cả các Action
 Task deleteAllActions();
```

Trong một Task có thể có nhiều Action, các Action được thực thi từ đầu hàng đợi đến cuối hàng đợi.

Action đại diện cho từng hàm, phương thức, mỗi Task là một đồ thị thực thi gồm một loạt Action được sắp xếp theo thứ tự.

Từ khóa để khai báo dependency của Task là `dependsOn`, hỗ trợ khai báo một hoặc nhiều dependency:

```groovy
task first {
 doLast {
        println "+++++first+++++"
    }
}
task second {
 doLast {
        println "+++++second+++++"
    }
}

// Chỉ định dependency nhiều task
task print(dependsOn :[second,first]) {
 doLast {
      logger.quiet "指定多个task依赖"
    }
}

// Chỉ định dependency một task
task third(dependsOn : print) {
 doLast {
      println '+++++third+++++'
    }
}
```

Trước khi thực thi một Task, các Task mà nó phụ thuộc sẽ được thực thi trước.

Chúng ta còn có thể thiết lập Task mặc định, trong script dù chúng ta không gọi Task mặc định thì nó vẫn được thực thi.

```groovy
defaultTasks 'clean', 'run'

task clean {
    doLast {
        println 'Default Cleaning!'
    }
}

task run {
    doLast {
        println 'Default Running!'
    }
}
```

Bản thân Gradle cũng tích hợp sẵn rất nhiều Task, chẳng hạn copy (sao chép file), delete (xóa file).

```groovy
task deleteFile(type: Delete) {
    delete "C:\\Users\\guide\\Desktop\\test"
}
```

## Plugin trong Gradle

Gradle cung cấp một bộ cơ chế build cốt lõi, còn plugin của Gradle là các logic build cụ thể chạy trên cơ chế này, về bản chất chúng giống với file `.gradle`. Bạn có thể xem plugin Gradle như một công cụ đóng gói một loạt Task và thực thi chúng.

Plugin Gradle chủ yếu được chia thành hai loại:

- Script plugin: Script plugin là một file script bình thường, nó có thể được import vào các script build khác.
- Binary plugin / Object plugin: Được định nghĩa trong một module plugin riêng biệt, các module khác áp dụng plugin thông qua Plugin ID. Vì cách này thân thiện hơn trong việc phát hành và tái sử dụng, nên các plugin Gradle mà chúng ta thường gặp đều ở dạng binary plugin.

Mặc dù plugin Gradle về bản chất không khác gì file .gradle, file `.gradle` cũng có thể thực hiện chức năng tương tự plugin Gradle. Tuy nhiên, plugin Gradle sử dụng module độc lập để đóng gói logic build, dù xét về mặt phát triển hay sử dụng, trải nghiệm tổng thể của plugin Gradle đều thân thiện hơn.

- **Tái sử dụng logic:** Cung cấp cùng một logic cho nhiều dự án tương tự nhau tái sử dụng, giảm chi phí bảo trì trùng lặp các logic tương tự. Tất nhiên file .gradle cũng có thể tái sử dụng logic, nhưng khả năng đóng gói của plugin Gradle tốt hơn;
- **Phát hành component:** Có thể phát hành plugin lên Maven repository để quản lý, các dự án khác có thể phụ thuộc thông qua plugin ID. Tất nhiên file .gradle cũng có thể đặt ở một đường dẫn từ xa để các dự án khác tham chiếu;
- **Cấu hình build:** Plugin Gradle có thể khai báo plugin extension để phơi bày các thuộc tính có thể cấu hình, cung cấp khả năng tùy chỉnh. Tất nhiên file .gradle cũng làm được, nhưng cách thực hiện sẽ phức tạp hơn.

## Vòng đời build của Gradle

Vòng đời build của Gradle có ba giai đoạn: **giai đoạn khởi tạo, giai đoạn cấu hình** và **giai đoạn thực thi**.

![](https://oss.javaguide.cn/github/javaguide/csdn/dadbdf59fccd9a2ebf60a2d018541e52.png)

Giữa giai đoạn khởi tạo và giai đoạn cấu hình, sau khi giai đoạn cấu hình kết thúc, và sau khi giai đoạn thực thi kết thúc, chúng ta đều có thể thêm các Hook tùy chỉnh.

![](https://oss.javaguide.cn/github/javaguide/csdn/5c297ccc4dac83229ff3e19caee9d1d2.png)

### Giai đoạn khởi tạo

Gradle hỗ trợ build đơn dự án và đa dự án. Trong giai đoạn khởi tạo, Gradle xác định những dự án nào sẽ tham gia vào bản build, và tạo một [Project instance](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html) cho mỗi dự án. Về bản chất, đây là quá trình thực thi script `settings.gradle`, từ đó đọc xem toàn bộ dự án có bao nhiêu Project instance.

### Giai đoạn cấu hình

Trong giai đoạn cấu hình, Gradle sẽ phân tích file `build.gradle` của mỗi project, tạo tập con các task cần thực thi và xác định mối quan hệ giữa các task, để giai đoạn thực thi chạy theo thứ tự, đồng thời thực hiện một số cấu hình khởi tạo cho các task.

Mỗi file `build.gradle` tương ứng với một đối tượng Project, mã được thực thi trong giai đoạn cấu hình bao gồm các câu lệnh, closure khác nhau trong `build.gradle` cũng như các câu lệnh cấu hình trong Task.

Sau khi giai đoạn cấu hình kết thúc, Gradle sẽ dựa vào mối quan hệ dependency giữa các Task để tạo ra một **đồ thị có hướng không chu trình (DAG)**.

### Giai đoạn thực thi

Trong giai đoạn thực thi, Gradle dựa trên tập con các task cần thực thi đã được tạo và cấu hình ở giai đoạn cấu hình để thực thi các task.

## Tham khảo

- Tài liệu chính thức của Gradle: <https://docs.gradle.org/current/userguide/userguide.html>
- Hướng dẫn nhập môn Gradle: <https://www.imooc.com/wiki/gradlebase>
- Nhập môn nhanh Groovy chỉ cần bài này là đủ: <https://cloud.tencent.com/developer/article/1358357>
- 【Gradle】Giải thích chi tiết vòng đời của Gradle: <https://juejin.cn/post/7067719629874921508>
- Cầm tay chỉ việc tùy chỉnh Gradle plugin —— Gradle series(2): <https://www.cnblogs.com/pengxurui/p/16281537.html>
- Hướng dẫn vượt chướng ngại vật Gradle -- Hiểu về Plugin, Task và quy trình build: <https://juejin.cn/post/6889090530593112077>

<!-- @include: @article-footer.snippet.md -->
