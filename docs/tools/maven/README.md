---
title: "Chuyên đề Maven: POM, tọa độ, repository, quản lý dependency, lifecycle, plugin và dự án đa module"
description: Lộ trình học Maven phục vụ phỏng vấn và xây dựng dự án, bao gồm POM, tọa độ, repository, phạm vi dependency, lifecycle, plugin, dự án đa module, Maven Wrapper và các best practice, phù hợp với lập trình viên Java backend.
category: Công cụ phát triển
tag:
  - Maven
  - Xây dựng dự án
  - Quản lý dependency
sitemap:
  changefreq: weekly
  priority: 0.85
head:
  - - meta
    - name: keywords
      content: Maven,POM,tọa độ Maven,repository Maven,quản lý dependency,phạm vi dependency,lifecycle Maven,plugin Maven,dự án đa module,xây dựng dự án Java
---

Maven là công cụ build và quản lý dependency phổ biến nhất trong các dự án Java backend. Khi học Maven, đừng chỉ biết copy `pom.xml`, mà còn phải hiểu các khái niệm nền tảng như tọa độ, repository, dependency bắc cầu (transitive dependency), lifecycle, plugin và quản lý đa module.

## Phù hợp với ai

- Những bạn đang học cách build dự án Java và quản lý dependency.
- Lập trình viên đang dùng Maven để viết dự án, nhưng hay gặp vướng mắc khi xử lý xung đột dependency, phiên bản không thống nhất, quản lý đa module hoặc build trên CI.
- Người đang chuẩn bị phỏng vấn, cần trình bày rõ ràng các khái niệm cốt lõi và best practice của Maven.
- Kỹ sư cần bảo trì các dự án Spring Boot, microservice hoặc dự án Java đa module.

## Trọng tâm học tập

- POM là cấu hình cốt lõi của dự án Maven, còn tọa độ (coordinates) dùng để định danh duy nhất một artifact.
- Repository của Maven gồm local repository, private repository (nexus/artifactory) và central repository; quá trình phân giải dependency sẽ tìm kiếm theo một thứ tự nhất định.
- Phạm vi dependency (scope), dependency bắc cầu, loại trừ dependency (exclusion) và quản lý phiên bản quyết định dự án cuối cùng sẽ dùng những file Jar nào.
- Lifecycle định nghĩa các giai đoạn build, còn plugin chịu trách nhiệm thực thi các tác vụ thực sự như compile, test, đóng gói.
- Maven Wrapper giúp cố định phiên bản Maven mà dự án sử dụng, phù hợp với làm việc nhóm và môi trường CI.
- Với dự án đa module, cần đặc biệt chú ý đến POM cha, `dependencyManagement`, `pluginManagement` và ranh giới giữa các module.

## Thứ tự đọc gợi ý

1. [Tổng hợp khái niệm cốt lõi của Maven](./maven-core-concepts.md): trước tiên hãy hiểu POM, tọa độ, repository, dependency, lifecycle, plugin và dự án đa module.
2. [Best practice với Maven](./maven-best-practices.md): sau đó học về cấu trúc thư mục chuẩn, phiên bản compile, BOM, quản lý phiên bản dependency, Maven Wrapper, CI và các thực hành phổ biến.
3. Kết hợp xem `pom.xml` trong một dự án Spring Boot: tập trung vào project cha, phạm vi dependency, cấu hình plugin và dependency tree cuối cùng.

## Bài viết chính

- [Tổng hợp khái niệm cốt lõi của Maven](./maven-core-concepts.md): giới thiệu có hệ thống về vai trò của Maven, POM, tọa độ, repository, dependency, lifecycle, plugin và dự án đa module.
- [Best practice với Maven](./maven-best-practices.md): tổng hợp cấu trúc thư mục chuẩn, phiên bản compile, thống nhất phiên bản dependency, Maven Wrapper, CI và các khuyến nghị sử dụng hằng ngày.

## Câu hỏi thường gặp

- Maven là gì? Nó chủ yếu giải quyết những vấn đề nào?
- POM, groupId, artifactId, version lần lượt là gì?
- Local repository, private repository và central repository khác nhau như thế nào?
- Dependency bắc cầu (transitive dependency) trong Maven là gì? Làm sao để xác định và xử lý xung đột dependency?
- `dependencyManagement` và `dependencies` khác nhau ở điểm nào?
- Lifecycle và plugin trong Maven có mối quan hệ gì?
- Vì sao dự án nhóm nên commit Maven Wrapper?
- Các phạm vi dependency như `compile`, `provided`, `runtime`, `test` khác nhau ra sao?
- Vì sao dự án đa module thường cần một POM cha?

## Chuyên đề liên quan

- [Hệ thống kiến thức công cụ phát triển](../)
- [Tổng hợp khái niệm cốt lõi của Gradle](../gradle/gradle-core-concepts.md)
- [Chuyên đề Git](../git/)
- [Java cơ bản](../../java/basis/java-basic-questions-01.md)

<!-- @include: @article-footer.snippet.md -->
