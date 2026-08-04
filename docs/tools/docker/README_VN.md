---
title: "Chuyên đề Docker: container, image, repository, volume, network và triển khai container hóa"
description: "Lộ trình học Docker và container hóa phục vụ phỏng vấn, bao gồm container, image, repository, Docker Engine, volume, network, các lệnh thường dùng và thực hành triển khai container hóa."
category: Công cụ phát triển
tag:
  - Docker
  - Container
  - Triển khai
sitemap:
  changefreq: weekly
  priority: 0.85
head:
  - - meta
    - name: keywords
      content: Docker,container,image,repository,Docker Engine,volume,network,triển khai container hóa,nhất quán môi trường,phát triển backend
---

Docker là công cụ container hóa rất phổ biến trong phát triển backend, thường được dùng để khởi chạy nhanh các dịch vụ phụ thuộc như MySQL, Redis, Kafka ngay trên máy local, cũng như trong môi trường kiểm thử và triển khai phân phối. Khi học Docker, hãy kết hợp việc nắm vững các khái niệm cốt lõi với thực hành câu lệnh.

## Phù hợp với ai

- Lập trình viên backend muốn nhanh chóng hiểu nền tảng container hóa của Docker.
- Người cần dùng Docker để dựng môi trường phát triển local, môi trường kiểm thử hoặc các dịch vụ phụ thuộc.
- Người chuẩn bị phỏng vấn, cần trình bày rõ về container, image, volume, network và sự khác biệt giữa container với máy ảo.
- Kỹ sư đã biết copy-paste lệnh Docker nhưng chưa hiểu rõ cách build image, vòng đời container và cơ chế lưu trữ dữ liệu bền vững.

## Trọng tâm học tập

- Container giải quyết bài toán cô lập và nhất quán môi trường chạy ứng dụng.
- Image là template tĩnh, container là instance của image khi chạy, còn repository dùng để phân phối và tái sử dụng image.
- Các lệnh Docker thường dùng cần nắm vững theo nhóm: quản lý image, vòng đời container, xem log, ánh xạ cổng (port mapping) và truy cập vào bên trong container.
- Volume dùng để lưu trữ dữ liệu bền vững và mount thư mục từ máy host, còn network dùng cho giao tiếp giữa các container và giữa container với dịch vụ bên ngoài.
- Docker Compose dùng để định nghĩa và chạy ứng dụng đa container, phù hợp với môi trường phát triển local và orchestration dịch vụ đơn giản.
- Docker không phải giải pháp triển khai vạn năng; với môi trường production, cần xem xét thêm về bảo mật image, giới hạn tài nguyên, log, monitoring và khả năng orchestration.

## Thứ tự đọc đề xuất

1. [Tổng hợp khái niệm cốt lõi của Docker](./docker-intro.md): trước tiên hãy hiểu về container, image, repository, Docker Engine và sự khác biệt giữa container với máy ảo.
2. [Thực hành Docker](./docker-in-action.md): luyện tập qua các lệnh thực tế như kéo image, khởi chạy container, ánh xạ cổng, volume, xem log và triển khai các dịch vụ thường gặp.
3. Kết hợp luyện tập với một dự án Java: dùng Docker khởi chạy các dịch vụ mà ứng dụng phụ thuộc như MySQL, Redis, sau đó quan sát log, thư mục dữ liệu và ánh xạ cổng.

## Bài viết chính

- [Tổng hợp khái niệm cốt lõi của Docker](./docker-intro.md): giải thích về container, image, repository, Docker Engine, kiến trúc Docker, Docker Compose, cùng sự khác biệt giữa Docker và máy ảo.
- [Thực hành Docker](./docker-in-action.md): thông qua các lệnh thường dùng và kịch bản thực tế để hiểu quản lý image, quản lý container, triển khai dịch vụ, dựng môi trường local và xử lý sự cố thường gặp.

## Câu hỏi thường gặp

- Docker chủ yếu giải quyết vấn đề gì?
- Container và máy ảo khác nhau như thế nào?
- Mối quan hệ giữa image và container là gì?
- Dockerfile, image, container, repository lần lượt là gì?
- Vì sao dữ liệu có thể bị mất sau khi xóa container? Volume giải quyết vấn đề gì?
- Ánh xạ cổng và network của container lần lượt giải quyết vấn đề gì?
- Làm sao để xem log của container, truy cập vào container, dừng và xóa container?
- `docker compose` phù hợp giải quyết vấn đề gì? Khác với việc chạy riêng lẻ `docker run` như thế nào?
- Docker có giá trị gì trong từng môi trường phát triển, kiểm thử và triển khai?

## Chuyên đề liên quan

- [Hệ thống kiến thức công cụ phát triển](../)
- [Chuyên đề Git](../git/)
- [Chuyên đề Maven](../maven/)
- [Thiết kế hệ thống sẵn sàng cao](../../high-availability/)

<!-- @include: @article-footer.snippet.md -->
