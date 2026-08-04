---
title: Chuyên đề Redis: Cache, Cấu trúc dữ liệu, Persistence, Cluster, Blocking và Thực hành kỹ thuật
description: Lộ trình học Redis và Cache cho phỏng vấn, bao gồm Cache Penetration, Cache Breakdown, Cache Avalanche, chiến lược đọc/ghi, cấu trúc dữ liệu Redis, Persistence, vấn đề Blocking, Delayed Task và Cluster.
category: Cơ sở dữ liệu
tag:
  - Redis
  - Cache
  - Phỏng vấn Backend
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: Redis,Câu hỏi phỏng vấn Redis,Cache,Cache Penetration,Cache Breakdown,Cache Avalanche,Cấu trúc dữ liệu Redis,Redis Persistence,Redis Cluster,Redis Blocking,Redis Skip List,Redis Delayed Task,Redis Message Queue,Phỏng vấn Backend
---

Redis là một trong những Cache và kho dữ liệu trong bộ nhớ hiệu năng cao được sử dụng phổ biến nhất trong phát triển Backend. Khi học Redis, không thể chỉ dừng lại ở các lệnh và kiểu dữ liệu, mà còn phải hiểu các chiến lược đọc/ghi Cache, cấu trúc dữ liệu bên dưới, Persistence, nguyên nhân Blocking, quản lý bộ nhớ, Replication và Cluster cùng các vấn đề kỹ thuật khác.

## Phù hợp với ai?

- Lập trình viên Backend muốn học một cách hệ thống về nguyên lý Redis, thiết kế Cache và thực hành kỹ thuật.
- Các bạn đang chuẩn bị cho các câu hỏi phỏng vấn về cấu trúc dữ liệu Redis, Persistence, Cluster, sẵn sàng cao và Cache Consistency.
- Những độc giả đã sử dụng Redis trong dự án nhưng chưa đủ quen thuộc với các vấn đề bất thường của Cache, Blocking, Memory Fragmentation và cơ chế Cluster.
- Kỹ sư cần triển khai Delayed Task, Message Queue, bảng xếp hạng, giỏ hàng và các năng lực khác dựa trên Redis.

## Trọng tâm học tập

- Các cấu trúc dữ liệu thường dùng của Redis lần lượt phù hợp với những kịch bản nghiệp vụ nào, encoding bên dưới ảnh hưởng đến hiệu năng ra sao?
- Các vấn đề Cache Penetration, Cache Breakdown, Cache Avalanche và Cache Consistency nên thiết kế giải pháp như thế nào?
- Trong Persistence của Redis, RDB, AOF, AOF Rewrite và Hybrid Persistence khác nhau như thế nào?
- Vì sao Redis có thể bị Blocking, làm thế nào để xác định lệnh chậm, Big Key, Hot Key và ảnh hưởng của Persistence?
- Replication (master-slave), Sentinel và Cluster lần lượt giải quyết vấn đề gì, Failover có những quy trình then chốt nào?
- Khi triển khai Delayed Task, Message Queue dựa trên Redis có những giới hạn năng lực và rủi ro độ tin cậy nào?

## Thứ tự đọc được khuyến nghị

1. [Tổng hợp các câu hỏi phỏng vấn thường gặp về kiến thức nền tảng Cache](./cache-basics.md): Trước tiên hiểu các kịch bản sử dụng Cache, các vấn đề bất thường của Cache và vấn đề tính nhất quán.
2. [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 1)](./redis-questions-01.md), [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 2)](./redis-questions-02.md): Xây dựng danh sách các vấn đề Redis tần suất cao.
3. [Giải thích chi tiết 5 kiểu dữ liệu cơ bản của Redis](./redis-data-structures-01.md), [Giải thích chi tiết 3 kiểu dữ liệu đặc biệt của Redis](./redis-data-structures-02.md): Nắm vững một cách hệ thống cấu trúc dữ liệu và kịch bản ứng dụng.
4. [Giải thích chi tiết 3 chiến lược đọc/ghi Cache thường dùng](./3-commonly-used-cache-read-and-write-strategies.md), [Giải thích chi tiết cơ chế Persistence của Redis](./redis-persistence.md): Bổ sung năng lực Cache Consistency và khôi phục dữ liệu.
5. [Tổng hợp các nguyên nhân gây Blocking thường gặp trong Redis](./redis-common-blocking-problems-summary.md), [Giải thích chi tiết Redis Cluster](./redis-cluster.md): Đặt Redis vào môi trường production để hiểu.

## Bài viết cốt lõi

### Kiến thức nền tảng Cache và chiến lược đọc/ghi

- [Tổng hợp các câu hỏi phỏng vấn thường gặp về kiến thức nền tảng Cache](./cache-basics.md): Giải thích các kịch bản ứng dụng Cache, Cache Penetration, Cache Breakdown, Cache Avalanche, Cache Consistency và loại bỏ Cache.
- [Giải thích chi tiết 3 chiến lược đọc/ghi Cache thường dùng](./3-commonly-used-cache-read-and-write-strategies.md): So sánh các chiến lược phổ biến như Cache Aside, Read/Write Through, Write Behind.
- [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 1)](./redis-questions-01.md) và [Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 2)](./redis-questions-02.md): Xâu chuỗi Redis cơ bản, thread model, cấu trúc dữ liệu, Persistence, Cluster và các vấn đề production.

### Cấu trúc dữ liệu và ứng dụng điển hình

- [Giải thích chi tiết 5 kiểu dữ liệu cơ bản của Redis](./redis-data-structures-01.md): Hiểu cấu trúc bên dưới và kịch bản nghiệp vụ của String, List, Hash, Set, Sorted Set.
- [Giải thích chi tiết 3 kiểu dữ liệu đặc biệt của Redis](./redis-data-structures-02.md): Hiểu cách dùng và kịch bản phù hợp của Bitmap, HyperLogLog, Geospatial.
- [Tại sao Redis dùng Skip List để triển khai Sorted Set](./redis-skiplist.md): Hiểu cấu trúc Skip List, độ phức tạp truy vấn và lựa chọn triển khai của Sorted Set.
- [Làm thế nào để triển khai Delayed Task dựa trên Redis?](./redis-delayed-task.md): So sánh các cách triển khai như Expiration Event, Sorted Set, Stream.
- [Làm thế nào để triển khai Message Queue dựa trên Redis?](./redis-stream-mq.md): Hiểu sự khác biệt giữa List, Pub/Sub, Stream khi làm Message Queue.

### Persistence, bộ nhớ và Cluster

- [Giải thích chi tiết cơ chế Persistence của Redis](./redis-persistence.md): Giải thích hệ thống về RDB, AOF, AOF Rewrite và Hybrid Persistence.
- [Giải thích chi tiết Memory Fragmentation của Redis](./redis-memory-fragmentation.md): Hiểu nguyên nhân phát sinh Memory Fragmentation, quan sát chỉ số và chiến lược dọn dẹp.
- [Tổng hợp các nguyên nhân gây Blocking thường gặp trong Redis](./redis-common-blocking-problems-summary.md): Tổng hợp các nguồn gây Blocking như lệnh chậm, Big Key, Persistence, đồng bộ master-slave, CPU và mạng.
- [Giải thích chi tiết Redis Cluster](./redis-cluster.md): Hiểu Replication (master-slave), Sentinel, Cluster, di chuyển Slot và Failover.

## Câu hỏi tần suất cao

- Vì sao Redis nhanh? Đơn luồng mà vẫn hỗ trợ được concurrency cao là vì sao?
- Các kiểu dữ liệu thường gặp của Redis lần lượt phù hợp với những kịch bản nghiệp vụ nào?
- Vì sao Sorted Set sử dụng Skip List?
- Cache Penetration, Cache Breakdown, Cache Avalanche khác nhau như thế nào, xử lý ra sao?
- Làm thế nào để đảm bảo tính nhất quán giữa Cache và cơ sở dữ liệu?
- RDB và AOF khác nhau như thế nào? AOF Rewrite giải quyết vấn đề gì?
- Các nguyên nhân gây Blocking thường gặp trong Redis là gì? Làm thế nào để chẩn đoán Big Key và lệnh chậm?
- Replication (master-slave), Sentinel và Cluster của Redis khác nhau như thế nào?
- Redis triển khai Delayed Task như thế nào? Rủi ro độ tin cậy nằm ở đâu?
- Redis Stream so với Message Queue truyền thống có những giới hạn nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức Cơ sở dữ liệu](../)
- [Hệ thống kiến thức Hệ thống hiệu năng cao](../../high-performance/)
- [Hệ thống kiến thức Hệ thống sẵn sàng cao](../../high-availability/)
- [Chuyên đề Message Queue](../../high-performance/message-queue/)

<!-- @include: @article-footer.snippet.md -->
