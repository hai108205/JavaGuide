---
title: 开发工具知识体系：Maven、Gradle、Git、GitHub、Docker 与 IDEA
description: 后端开发工具学习路线，涵盖 Maven、Gradle、Git、GitHub、Docker、IDEA、项目构建、依赖管理、版本控制、代码协作和容器化部署。
category: 开发工具
tag:
  - 开发工具
  - Maven
  - Git
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: 开发工具,Maven,Gradle,Git,GitHub,Docker,IDEA,依赖管理,项目构建,版本控制,容器化部署,后端开发
---

<!-- @include: @small-advertisement.snippet.md -->

**Hệ thống kiến thức về công cụ phát triển** này hướng đến việc học backend và phát triển hằng ngày, được sắp xếp theo trình tự "build dự án -> quản lý dependency -> version control -> cộng tác hiệu quả -> triển khai bằng container", tổng hợp các bài viết về công cụ phát triển trên trang này.

Công cụ phát triển không chỉ là biết gõ vài câu lệnh, mà quan trọng hơn là hiểu vai trò của chúng trong cộng tác nhóm, quy chuẩn kỹ thuật, tính nhất quán của môi trường và hiệu quả bàn giao.

## Phù hợp với ai

- Những bạn đang học backend development, cần bổ sung các công cụ kỹ thuật thường dùng.
- Những người chuẩn bị phỏng vấn tuyển dụng, muốn trả lời chắc chắn hơn các câu hỏi về Maven, Git, Docker.
- Những developer đã viết được code nghiệp vụ nhưng chưa nắm vững về xung đột dependency, cộng tác nhánh Git, quản lý image và container của Docker.
- Những kỹ sư muốn nâng cao hiệu quả build dự án, cộng tác code, bàn giao môi trường và phát triển hằng ngày.

## Trọng tâm học tập

- Maven và Gradle giải quyết các vấn đề về build dự án, quản lý dependency, lifecycle, Wrapper và mở rộng bằng plugin.
- Git là năng lực nền tảng của cộng tác nhóm; trọng tâm không phải là học thuộc lệnh, mà là hiểu về working directory, staging area, commit, branch, merge và xử lý conflict.
- GitHub không chỉ là nền tảng host code, mà còn phục vụ cộng tác open source, thể hiện cá nhân, đọc code, tự động hóa bằng Actions và quản lý dự án.
- Docker chủ yếu giải quyết các vấn đề về tính nhất quán của môi trường, cô lập khi triển khai, phân phối image, dựng nhanh các dịch vụ phụ thuộc cục bộ và orchestration ứng dụng đa container.
- Kiến thức về công cụ tốt nhất nên luyện tập cùng dự án thực tế; chỉ đọc lý thuyết đơn thuần thì dễ hiểu nhưng không dùng được.

## Thứ tự đọc gợi ý

1. [Tổng hợp khái niệm cốt lõi của Git](./git/git-intro.md): trước tiên nắm vững version control, commit, branch, merge và quy trình cộng tác.
2. [Tổng hợp khái niệm cốt lõi của Maven](./maven/maven-core-concepts.md): hiểu về build dự án Java, POM, coordinate, repository, dependency và lifecycle.
3. [Thực hành tốt nhất với Maven](./maven/maven-best-practices.md): bổ sung quản lý phiên bản dependency, BOM, Maven Wrapper, CI và các quy tắc sử dụng hằng ngày.
4. [Tổng hợp khái niệm cốt lõi của Docker](./docker/docker-intro.md): xây dựng nhận thức cơ bản về image, container, registry và Docker engine.
5. [Docker thực chiến](./docker/docker-in-action.md): luyện tập quản lý container, build image, volume và xử lý sự cố thường gặp thông qua câu lệnh và tình huống.
6. [Tổng hợp khái niệm cốt lõi của Gradle](./gradle/gradle-core-concepts.md) và [Tổng hợp các mẹo hữu ích trên GitHub](./git/github-tips.md): bổ sung Gradle Wrapper, GitHub Actions và kỹ năng đọc code theo nhu cầu dự án.

## Bài viết cốt lõi

### Build dự án và quản lý dependency

- [Chuyên đề Maven](./maven/): trình bày rõ các khái niệm cốt lõi và thực hành tốt nhất của Maven, là chuyên đề công cụ được dùng nhiều nhất khi build dự án Java backend.
- [Tổng hợp khái niệm cốt lõi của Maven](./maven/maven-core-concepts.md): hiểu về POM, coordinate, repository, dependency scope, lifecycle, plugin và dự án đa module.
- [Thực hành tốt nhất với Maven](./maven/maven-best-practices.md): tổng hợp cấu trúc thư mục chuẩn, phiên bản compile, quản lý dependency, Maven Wrapper, CI và các khuyến nghị thực hành thường dùng.
- [Tổng hợp khái niệm cốt lõi của Gradle](./gradle/gradle-core-concepts.md): tìm hiểu Gradle, Groovy/Kotlin DSL, Gradle Wrapper, plugin và Task cùng các khái niệm cốt lõi khác.

### Version control và cộng tác code

- [Chuyên đề Git](./git/): xoay quanh các khái niệm cốt lõi của Git, workflow và các mẹo nâng cao hiệu quả trên GitHub.
- [Tổng hợp khái niệm cốt lõi của Git](./git/git-intro.md): hiểu về version control, working directory, staging area, commit, branch, merge, conflict và remote repository.
- [Tổng hợp các mẹo hữu ích trên GitHub](./git/github-tips.md): tổng hợp các mẹo về trang cá nhân, badge dự án, đọc code, Actions, Explore/Trending và cộng tác open source.

### Container hóa và môi trường cục bộ

- [Chuyên đề Docker](./docker/): từ khái niệm cốt lõi đến thao tác thực chiến, giúp hiểu về bàn giao bằng container và tính nhất quán của môi trường.
- [Tổng hợp khái niệm cốt lõi của Docker](./docker/docker-intro.md): hiểu về container, image, registry, Docker engine cũng như sự khác nhau giữa container và máy ảo.
- [Docker thực chiến](./docker/docker-in-action.md): hoàn thành thực hành nhập môn Docker thông qua image, container, network, volume, log và câu lệnh xử lý sự cố.

### IDE và công cụ nâng cao hiệu quả

- [Hướng dẫn IDEA](https://gitee.com/SnailClimb/awesome-idea-tutorial): tổng hợp cấu hình, plugin, phím tắt và mẹo nâng cao hiệu quả thường dùng của IntelliJ IDEA.

## Câu hỏi thường gặp

- POM, coordinate, repository và dependency scope của Maven lần lượt là gì?
- Mối quan hệ giữa lifecycle và plugin của Maven là gì?
- Dự án đa module trong Maven quản lý dependency chung và phiên bản build thông qua BOM, `dependencyManagement` và Maven Wrapper như thế nào?
- Gradle và Maven khác nhau ở điểm nào? Khi nào cần tìm hiểu Gradle?
- Working directory, staging area, local repository và remote repository của Git lần lượt là gì?
- Git merge và rebase khác nhau ở điểm nào? Nên xử lý conflict như thế nào?
- Ngoài host code, GitHub còn có thể giúp developer làm những gì thông qua Profile README, Actions, Codespaces và Explore/Trending?
- Docker image và container có mối quan hệ gì? Container và máy ảo khác nhau ở điểm nào?
- Tại sao Docker có thể giải quyết vấn đề môi trường không nhất quán giữa development, test và deployment? Compose phù hợp để giải quyết vấn đề gì?

## Chuyên đề liên quan

- [Chuẩn bị phỏng vấn](../interview-preparation/)
- [Java cơ bản](../java/basis/java-basic-questions-01.md)
- [Spring&Spring Boot](../system-design/framework/spring/)
- [Dự án open source](../open-source-project/)

<!-- @include: @article-footer.snippet.md -->
