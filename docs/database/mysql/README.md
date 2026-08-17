---
title: "Chuyên đề MySQL: Index, Transaction, Log, Sao lưu khôi phục, MVCC và Tối ưu hiệu năng"
description: Lộ trình học MySQL cho phỏng vấn và tối ưu hiệu năng, bao quát Index, Index mất hiệu lực, Transaction Isolation Level, MVCC, binlog, redo log, undo log, sao lưu khôi phục, Execution Plan và tối ưu SQL.
category: Cơ sở dữ liệu
tag:
  - MySQL
  - Cơ sở dữ liệu
  - Phỏng vấn Backend
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: MySQL,Câu hỏi phỏng vấn MySQL,MySQL Index,Index mất hiệu lực,Transaction Isolation Level,MVCC,binlog,redo log,undo log,Sao lưu MySQL,Khôi phục MySQL,Execution Plan,Quá trình thực thi SQL,Tối ưu hiệu năng MySQL,Phỏng vấn Backend
---

MySQL là một trong những hệ quản trị cơ sở dữ liệu quan hệ được sử dụng phổ biến nhất trong phát triển Backend, đồng thời cũng là chuyên đề dễ bị hỏi sâu đến cùng trong các buổi phỏng vấn về cơ sở dữ liệu. Khi học MySQL, nên triển khai xoay quanh các mạch chính sau: "Index làm cho truy vấn nhanh hơn như thế nào, Transaction đảm bảo tính nhất quán ra sao, Log đảm bảo khôi phục và replication như thế nào, sao lưu dự phòng cho các sự cố dữ liệu ra sao, Execution Plan giúp xác định SQL chậm như thế nào".

## Phù hợp với ai?

- Lập trình viên Backend muốn học một cách hệ thống về nguyên lý MySQL và tối ưu hiệu năng.
- Các bạn đang chuẩn bị cho các câu hỏi phỏng vấn liên quan đến MySQL Index, Transaction, MVCC, Log và Execution Plan.
- Những người đã viết được SQL thông thường nhưng chưa thành thạo về phân tích SQL chậm, thiết kế Index và các vấn đề về Transaction.
- Kỹ sư cần xử lý các vấn đề về hiệu năng MySQL, tính nhất quán dữ liệu và thiết kế trường trong dự án.

## Trọng tâm học tập

- B+ Tree Index, Clustered Index, Secondary Index, Covering Index và Back to Table lần lượt là gì?
- Những cách viết SQL nào khiến Index mất hiệu lực, làm sao xác minh thông qua Execution Plan?
- Transaction Isolation Level của MySQL ảnh hưởng đến Dirty Read, Non-repeatable Read và Phantom Read như thế nào?
- InnoDB thực hiện Snapshot Read thông qua MVCC, undo log và Read View như thế nào?
- binlog, redo log, undo log lần lượt giải quyết những vấn đề nào trong replication, khôi phục khi crash và rollback Transaction?
- MySQL khôi phục đến một thời điểm chỉ định thông qua full backup, binlog và PITR như thế nào?
- Tối ưu SQL chậm nên xác định từng lớp từ tạo bảng, Index, cách viết SQL đến Execution Plan như thế nào?

## Thứ tự đọc được khuyến nghị

1. [Tổng hợp câu hỏi phỏng vấn MySQL thường gặp](./mysql-questions-01.md): Trước tiên xây dựng danh sách các câu hỏi tần suất cao về MySQL.
2. [Giải thích chi tiết MySQL Index](./mysql-index.md), [Tổng hợp các tình huống MySQL Index mất hiệu lực](./mysql-index-invalidation.md): Hiểu nguyên lý Index và các tình huống mất hiệu lực thường gặp.
3. [Giải thích chi tiết Transaction Isolation Level trong MySQL](./transaction-isolation-level.md), [Cơ chế MVCC của InnoDB Storage Engine](./innodb-implementation-of-mvcc.md): Nắm vững Transaction và Consistent Read.
4. [Giải thích chi tiết ba loại Log trong MySQL](./mysql-logs.md), [Giải thích chi tiết Sao lưu và Khôi phục MySQL](./mysql-backup-and-restore.md), [Quá trình thực thi câu lệnh SQL trong MySQL](./how-sql-executed-in-mysql.md): Hiểu chuỗi ghi dữ liệu, commit, khôi phục và thực thi.
5. [Phân tích Execution Plan trong MySQL](./mysql-query-execution-plan.md), [Tổng hợp các khuyến nghị quy chuẩn tối ưu hiệu năng cao MySQL](./mysql-high-performance-optimization-specification-recommendations.md): Đưa nguyên lý vào thực tế SQL chậm và quy chuẩn kỹ thuật.

## Các bài viết cốt lõi

### Tổng quan và quy chuẩn

- [Tổng hợp câu hỏi phỏng vấn MySQL thường gặp](./mysql-questions-01.md): Xâu chuỗi các điểm hỏi tần suất cao như Index, Transaction, Lock, Log, Storage Engine và tối ưu SQL.
- [Tổng hợp các khuyến nghị quy chuẩn tối ưu hiệu năng cao MySQL](./mysql-high-performance-optimization-specification-recommendations.md): Tổng hợp các khuyến nghị tối ưu từ góc độ tạo bảng, trường, Index, SQL, Transaction và quy chuẩn phát triển.
- [Một nghìn dòng ghi chú học tập MySQL](./a-thousand-lines-of-mysql-study-notes.md): Phù hợp để kiểm tra lại phần còn thiếu và ôn nhanh các kiến thức MySQL thường gặp.

### Index và Execution Plan

- [Giải thích chi tiết MySQL Index](./mysql-index.md): Hiểu cấu trúc dữ liệu của Index, Clustered Index, Secondary Index, Covering Index, Leftmost Prefix và thiết kế Index.
- [Tổng hợp các tình huống MySQL Index mất hiệu lực](./mysql-index-invalidation.md): Tổng hợp các cách viết khiến Index mất hiệu lực thường gặp và hướng kiểm tra.
- [MySQL Index mất hiệu lực do chuyển đổi ngầm](./index-invalidation-caused-by-implicit-conversion.md): Tập trung vào vấn đề Index mất hiệu lực do chuyển đổi kiểu dữ liệu ngầm.
- [Phân tích Execution Plan trong MySQL](./mysql-query-execution-plan.md): Nắm vững các trường quan trọng của EXPLAIN như type, key, rows, Extra.

### Transaction, MVCC và Log

- [Giải thích chi tiết Transaction Isolation Level trong MySQL](./transaction-isolation-level.md): Hiểu Read Uncommitted, Read Committed, Repeatable Read, Serializable và các bất thường khi đọc đồng thời.
- [Cơ chế MVCC của InnoDB Storage Engine](./innodb-implementation-of-mvcc.md): Hiểu trường ẩn, undo log, Read View và phán đoán tính khả kiến.
- [Giải thích chi tiết ba loại Log trong MySQL](./mysql-logs.md): Hiểu vai trò, thời điểm ghi và Two-Phase Commit của binlog, redo log, undo log.
- [Giải thích chi tiết Sao lưu và Khôi phục MySQL](./mysql-backup-and-restore.md): Hiểu mysqldump, XtraBackup, binlog, PITR, RTO/RPO và diễn tập khôi phục.

### Quá trình thực thi và chi tiết kỹ thuật

- [Quá trình thực thi câu lệnh SQL trong MySQL](./how-sql-executed-in-mysql.md): Hiểu sự phối hợp giữa Connector, Query Cache, Analyzer, Optimizer, Executor và Storage Engine.
- [Giải thích chi tiết Query Cache trong MySQL](./mysql-query-cache.md): Hiểu cách hoạt động của Query Cache, nguyên nhân mất hiệu lực và bối cảnh bị loại bỏ.
- [Auto-increment Primary Key của MySQL có nhất định liên tục không?](./mysql-auto-increment-primary-key-continuous.md): Hiểu mối quan hệ giữa phân bổ giá trị tự động tăng, rollback, chèn hàng loạt và tính liên tục của Primary Key.
- [Khuyến nghị lựa chọn kiểu ngày tháng trong MySQL](./some-thoughts-on-database-storage-time.md): So sánh các tình huống sử dụng phù hợp của các kiểu DATE, DATETIME, TIMESTAMP, v.v.

## Các câu hỏi tần suất cao

- Vì sao MySQL khuyến nghị sử dụng B+ Tree Index?
- Clustered Index và Secondary Index khác nhau như thế nào? Back to Table và Covering Index là gì?
- Nguyên tắc Leftmost Prefix là gì? Những tình huống nào khiến Index mất hiệu lực?
- Làm thế nào để phán đoán một câu SQL có sử dụng Index phù hợp hay không thông qua EXPLAIN?
- Bốn Transaction Isolation Level của MySQL lần lượt giải quyết vấn đề gì?
- MVCC được triển khai như thế nào? Read View có những trường quan trọng nào?
- binlog, redo log, undo log khác nhau như thế nào? Two-Phase Commit giải quyết vấn đề gì?
- MySQL thực hiện khôi phục theo thời điểm (Point-in-Time Recovery) thông qua full backup và binlog như thế nào?
- Tối ưu SQL chậm nên bắt đầu từ những khía cạnh nào?
- Vì sao Auto-increment Primary Key không nhất định liên tục?
- Nên lựa chọn DATETIME và TIMESTAMP như thế nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức Cơ sở dữ liệu](../)
- [Chuyên đề SQL](../sql/)
- [Hệ thống kiến thức Hệ thống hiệu năng cao](../../high-performance/)
- [Hệ thống kiến thức Hệ thống sẵn sàng cao](../../high-availability/)

<!-- @include: @article-footer.snippet.md -->
