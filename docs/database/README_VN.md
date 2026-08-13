---
title: "Hệ thống kiến thức Cơ sở dữ liệu: SQL, MySQL, Redis, MongoDB và Elasticsearch"
description: Lộ trình học và ôn tập Cơ sở dữ liệu dành cho phỏng vấn và phát triển Backend, bao gồm SQL, chỉ mục MySQL, giao dịch, nhật ký, MVCC, kế hoạch thực thi, Redis Cache, MongoDB và Elasticsearch.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu
  - MySQL
  - Redis
sitemap:
  changefreq: weekly
  priority: 0.95
head:
  - - meta
    - name: keywords
      content: Cơ sở dữ liệu,Câu hỏi phỏng vấn Cơ sở dữ liệu,SQL,MySQL,Redis,MongoDB,Elasticsearch,MySQL Index,MySQL Transaction,MySQL Log,MVCC,Redis Cache,Redis Persistence,Redis Cluster,Phỏng vấn Backend
---

<!-- @include: @small-advertisement.snippet.md -->

Tài liệu **Hệ thống kiến thức Cơ sở dữ liệu** này được xây dựng dành cho việc học Backend, thực hành kỹ thuật và ôn tập phỏng vấn, sắp xếp theo lộ trình: **Kiến thức nền tảng → SQL → MySQL → Redis → NoSQL và Công cụ tìm kiếm**, đồng thời tổng hợp các bài viết liên quan trên website.

Nếu bạn không có nhiều thời gian, hãy ưu tiên đọc **Tổng hợp câu hỏi phỏng vấn Cơ sở dữ liệu**, **Tổng hợp cú pháp SQL**, **Tổng hợp câu hỏi phỏng vấn MySQL** và **Tổng hợp câu hỏi phỏng vấn Redis (Phần 1)** để nhanh chóng nắm được những chủ đề quan trọng nhất.

## Phù hợp với ai?

- Lập trình viên Backend đang học một cách bài bản về Cơ sở dữ liệu, SQL, MySQL và Redis.
- Sinh viên chuẩn bị phỏng vấn tuyển dụng hoặc lập trình viên chuyển việc.
- Kỹ sư phần mềm muốn bổ sung kiến thức về Index, Transaction, Log, Execution Plan, Cache Consistency, Redis Persistence và Redis Cluster.
- Lập trình viên đã từng phát triển các ứng dụng CRUD nhưng chưa hiểu sâu về nguyên lý hoạt động, tối ưu hiệu năng và cách lựa chọn các hệ quản trị NoSQL.

## Nội dung trọng tâm

- Cơ sở dữ liệu quan hệ và NoSQL phù hợp để giải quyết những bài toán nào? Ranh giới lựa chọn giữa chúng là gì?
- Làm thế nào để thành thạo truy vấn SQL, Aggregate, Join, Subquery và Transaction?
- Làm thế nào để kết nối các chủ đề MySQL Index, Transaction Isolation, MVCC, ba loại Log và Execution Plan thành một hệ thống kiến thức thống nhất?
- Vì sao Redis có hiệu năng cao? Cần hiểu như thế nào về Data Structure, Cache Strategy, Persistence, Blocking và Cluster?
- MongoDB và Elasticsearch thường được hỏi những nội dung nào trong phỏng vấn Backend và khi lựa chọn công nghệ cho hệ thống?

## Thứ tự học được khuyến nghị

1. [Tổng hợp câu hỏi phỏng vấn Cơ sở dữ liệu](./basis.md) và [Tổng hợp câu hỏi phỏng vấn NoSQL](./nosql.md): Làm quen với các loại cơ sở dữ liệu, Transaction, Chuẩn hóa (Normalization), các nhóm NoSQL và các tình huống sử dụng điển hình.
2. [Tổng hợp cú pháp SQL](./sql/sql-syntax-summary.md): Bổ sung kiến thức về truy vấn, lọc, sắp xếp, tổng hợp, Join, Subquery, INSERT, UPDATE và DELETE.
3. [Chuyên đề MySQL](./mysql/): Tập trung vào Index, Transaction Isolation, MVCC, ba loại Log, quy trình thực thi truy vấn và Execution Plan.
4. [Chuyên đề Redis](./redis/): Học về Cache, Data Structure, chiến lược đọc/ghi Cache, Persistence, Blocking, Memory Fragmentation và Cluster.
5. [Chuyên đề MongoDB](./mongodb/) và [Tổng hợp câu hỏi phỏng vấn Elasticsearch](./elasticsearch/elasticsearch-questions-01.md): Bổ sung kiến thức về cơ sở dữ liệu tài liệu và công cụ tìm kiếm tùy theo yêu cầu công việc.

## Các bài viết cốt lõi

### Kiến thức nền tảng và SQL

Phần này giúp xây dựng nền tảng chung về cơ sở dữ liệu, tập trung vào các loại cơ sở dữ liệu, Transaction, Character Set, SQL và các dạng truy vấn phổ biến.

- [Tổng hợp câu hỏi phỏng vấn Cơ sở dữ liệu](./basis.md): Tổng hợp các khái niệm nền tảng, đặc tính ACID, kiểm soát đồng thời, chuẩn hóa dữ liệu và các câu hỏi thường gặp.
- [Tổng hợp câu hỏi phỏng vấn NoSQL](./nosql.md): Tìm hiểu Key-Value Store, Document Database, Column Family Database, Graph Database và các tình huống sử dụng.
- [Giải thích Character Set: Character Set là gì? Sử dụng như thế nào?](./character-set.md): Hiểu Character Set, Encoding, nguyên nhân lỗi hiển thị ký tự và cấu hình Character Set trong MySQL.
- [Chuyên đề SQL](./sql/): Từ cú pháp SQL cơ bản đến các câu hỏi phỏng vấn phổ biến.
- [Tổng hợp cú pháp SQL](./sql/sql-syntax-summary.md): Bao gồm SELECT, WHERE, ORDER BY, GROUP BY, Aggregate, JOIN, Subquery và thao tác chỉnh sửa dữ liệu.

### MySQL

MySQL là một trong những chủ đề quan trọng nhất trong phỏng vấn Backend. Khi học, nên kết nối các nội dung **Index → Execution Plan → Transaction → MVCC → Log → Tối ưu hiệu năng** thành một chuỗi kiến thức hoàn chỉnh.

- [Chuyên đề MySQL](./mysql/): Kết nối Index, Transaction, MVCC, Log, Execution Plan và tối ưu hiệu năng.
- [Tổng hợp câu hỏi phỏng vấn MySQL](./mysql/mysql-questions-01.md): Nhanh chóng xây dựng danh sách các chủ đề trọng tâm.
- [Giải thích MySQL Index](./mysql/mysql-index.md): Hiểu cấu trúc dữ liệu của Index, Leftmost Prefix, Covering Index, Back to Table và nguyên tắc thiết kế Index.
- [Transaction Isolation Level trong MySQL](./mysql/transaction-isolation-level.md): Hiểu Dirty Read, Non-repeatable Read, Phantom Read và sự đánh đổi giữa các mức cô lập.
- [Cơ chế MVCC của InnoDB](./mysql/innodb-implementation-of-mvcc.md): Tìm hiểu Read View, Hidden Column, Undo Log và Snapshot Read.
- [Ba loại Log trong MySQL](./mysql/mysql-logs.md): Hiểu vai trò và mối quan hệ giữa Binlog, Redo Log và Undo Log.
- [Phân tích Execution Plan trong MySQL](./mysql/mysql-query-execution-plan.md): Thành thạo EXPLAIN và cách phân tích các câu lệnh SQL chậm.

### Redis

Redis không chỉ là hệ thống Cache mà còn là middleware rất thường gặp trong phỏng vấn. Khi học, đừng chỉ ghi nhớ các lệnh mà hãy hiểu chiến lược Cache, Data Structure, Persistence, nguyên nhân Blocking và cơ chế Cluster.

- [Chuyên đề Redis](./redis/): Bao gồm Cache, Data Structure, Persistence, Cluster, Blocking và các kinh nghiệm triển khai thực tế.
- [Tổng hợp câu hỏi phỏng vấn về Cache](./redis/cache-basics.md): Hiểu các tình huống sử dụng Cache, Cache Penetration, Cache Breakdown, Cache Avalanche và Cache Consistency.
- [Tổng hợp câu hỏi phỏng vấn Redis (Phần 1)](./redis/redis-questions-01.md) và [Phần 2](./redis/redis-questions-02.md): Các chủ đề Redis thường gặp trong phỏng vấn.
- [Giải thích 5 kiểu dữ liệu cơ bản của Redis](./redis/redis-data-structures-01.md): Hiểu String, List, Hash, Set và Sorted Set cùng các tình huống sử dụng.
- [Cơ chế Persistence của Redis](./redis/redis-persistence.md): Tìm hiểu RDB, AOF, AOF Rewrite và Hybrid Persistence.
- [Redis Cluster](./redis/redis-cluster.md): Hiểu Replication, Sentinel, Cluster, Slot và Failover.

### NoSQL và Công cụ tìm kiếm

Sau khi đã nắm vững cơ sở dữ liệu quan hệ và Cache, bạn nên bổ sung kiến thức về Document Database, Search Engine và các hệ thống lưu trữ NoSQL để hiểu rõ giới hạn và tình huống lựa chọn từng công nghệ.

- [Chuyên đề MongoDB](./mongodb/): Bao gồm Document Model, Index, Replica Set, Sharding, Transaction và các câu hỏi phỏng vấn phổ biến.
- [Tổng hợp câu hỏi phỏng vấn MongoDB (Phần 1)](./mongodb/mongodb-questions-01.md) và [Phần 2](./mongodb/mongodb-questions-02.md): Hiểu các khái niệm cốt lõi và kinh nghiệm triển khai MongoDB.
- [Tổng hợp câu hỏi phỏng vấn Elasticsearch](./elasticsearch/elasticsearch-questions-01.md): Hiểu Inverted Index, Shard, Replica, quy trình ghi/truy vấn và các tình huống sử dụng công cụ tìm kiếm.

## Những câu hỏi xuất hiện nhiều

- Cơ sở dữ liệu quan hệ và NoSQL khác nhau như thế nào? Mỗi loại phù hợp với những bài toán nào?
- ACID là gì? Mỗi mức Transaction Isolation giải quyết vấn đề gì?
- Thứ tự thực thi của `WHERE`, `GROUP BY`, `HAVING` và `ORDER BY` trong SQL được hiểu như thế nào?
- Vì sao MySQL Index giúp tăng tốc truy vấn? Khi nào Index bị mất hiệu lực?
- InnoDB sử dụng MVCC để thực hiện Snapshot Read không khóa như thế nào?
- Binlog, Redo Log và Undo Log giải quyết những vấn đề gì?
- Làm thế nào để sử dụng `EXPLAIN` để phân tích Execution Plan của SQL?
- Vì sao Redis có hiệu năng cao? Làm thế nào để xử lý Cache Penetration, Cache Breakdown và Cache Avalanche?
- Redis Persistence, Replication, Sentinel và Cluster giải quyết những bài toán nào?
- MongoDB và Elasticsearch phù hợp với những loại hệ thống nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức Hệ thống hiệu năng cao](../high-performance/)
- [Hệ thống kiến thức Hệ thống sẵn sàng cao](../high-availability/)
- [Hệ thống kiến thức Hệ thống phân tán](../distributed-system/)
- [Thiết kế hệ thống](../system-design/)

<!-- @include: @article-footer.snippet.md -->
