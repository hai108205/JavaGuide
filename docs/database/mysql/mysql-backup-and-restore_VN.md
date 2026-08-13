---
title: "Giải thích chi tiết Backup và Restore trong MySQL: mysqldump, XtraBackup, binlog và PITR"
description: Giải thích chi tiết về Backup và Restore trong MySQL, trình bày về mysqldump, MySQL Shell, Percona XtraBackup, binlog, PITR, RTO/RPO, diễn tập phục hồi và những hiểu lầm phổ biến khi Backup.
category: Cơ sở dữ liệu
tag:
  - MySQL
  - Backup và Restore
head:
  - - meta
    - name: keywords
      content: MySQL Backup,MySQL Restore,mysqldump,mysqlbinlog,MySQL Shell,Percona XtraBackup,binlog,PITR,Full Backup,Incremental Backup,Logical Backup,Physical Backup,RTO,RPO
---

Sự cố Database đáng sợ nhất trên Production, nhiều khi không phải là MySQL Process bị chết.

Process chết còn có thể khởi động lại, Master chết còn có thể chuyển sang Slave. Điều thực sự phiền phức là dữ liệu bị xóa, bị script sai sửa mất, ổ đĩa hỏng, hoặc khi Migration phát hiện thiếu mất một loạt bảng. Lúc này, Replication chủ-tớ, redo log, undo log đều không đủ dùng, thứ cuối cùng có thể cứu vãn tình thế thường là phương án Backup và Restore.

Bài này chỉ nói về Backup và Restore trong MySQL, không mở rộng sang PostgreSQL, Redis hay các sản phẩm Backup của nhà cung cấp Cloud. Các câu lệnh chủ yếu được kiểm chứng theo MySQL 8.4 LTS, đồng thời tham khảo tài liệu hiện hành của MySQL 9.7 tính đến ngày 2026-06-25; tên tham số, yêu cầu quyền và tính tương thích của công cụ giữa các phiên bản sẽ có khác biệt, trước khi áp dụng lên Production nhất định phải lấy `mysqldump --help`, `mysqlbinlog --help` và tài liệu công cụ trong chính môi trường của mình làm chuẩn.

## Backup rốt cuộc giải quyết vấn đề gì?

Trước tiên hãy tách riêng vài khái niệm dễ bị trộn lẫn:

- **Crash Recovery (Phục hồi sau sự cố)**: Sau khi MySQL downtime bất thường, InnoDB dựa vào các cơ chế như redo log, undo log để đưa Database về trạng thái nhất quán. Điều này giải quyết vấn đề nhất quán của Storage Engine sau khi Process Crash, máy khởi động lại.
- **Replication chủ-tớ / Chuyển đổi High Availability (HA)**: Khi Master không khả dụng, chuyển Traffic sang Slave hoặc Master mới. Điều này giải quyết vấn đề khả dụng của dịch vụ, nhưng các thao tác ghi sai thường sẽ được đồng bộ sang Slave.
- **Backup Restore (Phục hồi từ Backup)**: Phục hồi từ một bản sao dữ liệu lịch sử nào đó, rồi dựa vào binlog để replay (phát lại) đến một thời điểm chỉ định. Điều này giải quyết vấn đề mất dữ liệu, xóa nhầm sửa nhầm, hỏng ổ đĩa, Migration chéo môi trường và lưu trữ phục vụ Audit.

Replication chủ-tớ không thể thay thế Backup.

Nếu một câu lệnh `DROP TABLE` thực thi thành công trên Master, khả năng cao nó cũng sẽ được đồng bộ sang Slave. Replication càng nhanh thì lỗi càng lan nhanh. Giá trị của Backup nằm ở việc giữ lại một trạng thái lịch sử độc lập, cho bạn cơ hội quay về thời điểm trước khi sự cố xảy ra.

## RTO và RPO quyết định chiến lược Backup

Chiến lược Backup không thể chỉ hỏi "mỗi ngày Backup mấy lần". Câu hỏi thực tế hơn gồm hai điều:

- **RPO (Recovery Point Objective)**: Chấp nhận mất dữ liệu tối đa trong bao lâu?
- **RTO (Recovery Time Objective)**: Chấp nhận tối đa bao lâu để phục hồi dịch vụ?

Nếu nghiệp vụ chấp nhận mất 1 ngày dữ liệu, có lẽ mỗi ngày một lần Full Backup là đủ. Nếu dữ liệu dạng đơn hàng, thanh toán, tồn kho chỉ được phép mất tối đa vài phút, thì chỉ Full Backup không đủ, còn phải giữ binlog để phục hồi tăng cường (Incremental Restore). Nếu Database lên đến vài trăm GB, việc Restore file SQL có thể chạy rất lâu, RTO lại yêu cầu phục hồi trong 30 phút, thì phải cân nhắc nghiêm túc Physical Backup, làm nóng Slave dự phòng, diễn tập phục hồi và quy trình chuyển đổi.

Một tổ hợp thường thấy là:

- Mỗi ngày hoặc mỗi tuần thực hiện một lần Full Backup.
- Bật binlog, và giữ Log đủ lâu theo yêu cầu RPO.
- File Backup và binlog không đặt trên cùng một ổ đĩa, cùng một Failure Domain (miền lỗi).
- Định kỳ Restore Backup lên một máy mới, ghi lại thời gian thực tế tiêu tốn.

binlog giữ 30 ngày không có nghĩa RPO chắc chắn chỉ là vài giây. Thực sự phục hồi được đến đâu phụ thuộc vào bản binlog hoàn chỉnh, đọc được, đã được sao chép sang Failure Domain độc lập cuối cùng. Trên Production còn phải xem `sync_binlog`, `innodb_flush_log_at_trx_commit`, độ trễ Archive binlog, tiến trình Archive có từng bị gián đoạn không, chuỗi file binlog có liên tục không. MySQL 8.4 mặc định `sync_binlog=1`, `innodb_flush_log_at_trx_commit=1`, hai giá trị này thiên về an toàn; nếu vì hiệu năng mà giảm mức bảo đảm Persistence, thì phải tính khả năng mất các Transaction gần nhất vào RPO.

Vì vậy, hệ thống yêu cầu RPO cấp phút thậm chí cấp giây, không chỉ cần giám sát "trên đĩa còn bao nhiêu ngày binlog", mà còn phải giám sát "binlog đã Archive an toàn mới nhất cách hiện tại bao lâu".

Ở đây có một giới hạn rất thực tế: tốc độ phục hồi có liên quan đến lượng dữ liệu, hiệu năng ổ đĩa, số lượng Index, băng thông mạng và phương pháp Import. Khi chưa có dữ liệu diễn tập, RTO chỉ có thể coi là mong muốn, không thể coi là cam kết.

## Có những phương pháp Backup nào?

Backup trong MySQL thường có ba nhóm phân loại, mỗi nhóm trả lời một câu hỏi khác nhau.

Theo việc Database có đang phục vụ trong lúc Backup hay không:

| Loại                      | Mô tả                                                                | Tình huống áp dụng                                                                     |
| ------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Cold Backup (Backup lạnh) | Dừng MySQL rồi sao chép file dữ liệu                                 | Hệ thống nhỏ, tình huống có Maintenance Window (cửa sổ bảo trì) rộng rãi               |
| Warm Backup (Backup ấm)   | Backup khi MySQL đang chạy, nhưng có thể khóa hoặc ảnh hưởng đến ghi | Tình huống yêu cầu khả dụng ở mức trung bình, chấp nhận ảnh hưởng trong thời gian ngắn |
| Hot Backup (Backup nóng)  | Backup khi MySQL đang chạy, cố gắng không chặn đọc/ghi của nghiệp vụ | Database Production, Database lớn, tình huống Maintenance Window rất ngắn              |

Theo nội dung file Backup:

| Loại                            | Mô tả                                           | Công cụ tiêu biểu                           |
| ------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| Logical Backup (Backup logic)   | Xuất nội dung logic như SQL, CSV                | `mysqldump`, MySQL Shell dump utilities     |
| Physical Backup (Backup vật lý) | Sao chép file vật lý như file dữ liệu, file Log | Percona XtraBackup, MySQL Enterprise Backup |

Theo phạm vi Backup:

| Loại                                   | Mô tả                                                   |
| -------------------------------------- | ------------------------------------------------------- |
| Full Backup (Backup toàn bộ)           | Backup toàn bộ dữ liệu tại một thời điểm                |
| Incremental Backup (Backup tăng cường) | Backup dữ liệu hoặc Log thay đổi kể từ lần Backup trước |
| Differential Backup (Backup khác biệt) | Backup dữ liệu thay đổi kể từ lần Full Backup trước     |

Trong phỏng vấn rất hay hỏi các phân loại này, nhưng trên Production điều thực sự phải đạt được chỉ có một: file Backup có Restore ra được dữ liệu mà nghiệp vụ cần hay không. Phân loại chỉ là ngôn ngữ để chọn phương án, Restore thành công mới là kết quả.

## Dùng mysqldump để Logical Backup

`mysqldump` là công cụ Logical Backup đi kèm MySQL, nó xuất ra một loạt câu lệnh SQL, dùng những câu lệnh này có thể dựng lại cấu trúc Database, bảng và dữ liệu bảng. Ưu điểm của nó là đơn giản, thông dụng, tiện xem, cũng phù hợp cho Migration chéo môi trường. Nhược điểm cũng rõ ràng: dữ liệu lớn thì Backup chậm, Restore còn chậm hơn, vì quá trình Restore phải thực thi lại SQL, ghi dữ liệu, dựng Index.

Tài liệu chính thức của MySQL cũng nhắc rõ, `mysqldump` không phải phương án nhanh cho Backup và Restore quy mô lớn; khi lượng dữ liệu tăng lên, Physical Backup thường phù hợp hơn.

Một câu lệnh Backup toàn bộ Database InnoDB thiên hướng Production có thể viết như sau:

```bash
mysqldump \
  --host=127.0.0.1 \
  --user=backup_user \
  --password \
  --all-databases \
  --single-transaction \
  --routines \
  --events \
  --triggers \
  --source-data=2 \
  > mysql-full-backup.sql
```

Vài tham số cần giải thích riêng:

- `--single-transaction`: Trước khi bắt đầu Backup mở một Transaction đọc nhất quán (Consistent Read), phù hợp với bảng InnoDB. Nó thường không cần khóa bảng liên tục trong suốt quá trình xuất, nhưng câu lệnh trong bài còn dùng `--source-data=2`, `mysqldump` sẽ lấy Global Read Lock (khóa đọc toàn cục) trong thời gian ngắn ở giai đoạn khởi động, dùng để đồng bộ Snapshot nhất quán với vị trí binlog. Vì vậy cách nói chính xác hơn là "không chặn ghi nghiệp vụ trong thời gian dài", chứ không phải "hoàn toàn không khóa". Nếu trộn lẫn các bảng phi Transaction như MyISAM, MEMORY, trong thời gian Backup những bảng này vẫn có thể thay đổi.
- `--routines` và `--events`: Xuất cả Stored Procedure, Function và Event. Tài liệu MySQL 8.4 nói rõ, các định nghĩa liên quan nằm trong Data Dictionary, `--all-databases` không đồng nghĩa với việc tự động mang theo những Object này.
- `--triggers`: Trigger mặc định sẽ được xuất, viết rõ ra là để ý đồ của script Backup rõ ràng hơn.
- `--source-data=2`: Ghi tên file và vị trí binlog hiện tại vào file dump, và giữ lại dưới dạng chú thích SQL. `--master-data` thường thấy trong tài liệu cũ, trong tài liệu mới đã là Alias (bí danh) đã bị loại bỏ (deprecated) của `--source-data`.

Nếu chỉ Backup một Database:

```bash
mysqldump \
  --host=127.0.0.1 \
  --user=backup_user \
  --password \
  --single-transaction \
  --routines \
  --events \
  --triggers \
  --source-data=2 \
  order_db \
  > order_db.sql
```

Cách viết này chủ yếu xuất các Object trong `order_db`, sẽ không tự động viết `CREATE DATABASE order_db` và `USE order_db` thành một script tạo Database hoàn chỉnh. Khi Restore, hoặc tạo Database trước, hoặc khi Backup đổi sang dùng `--databases order_db`:

```bash
mysqldump \
  --host=127.0.0.1 \
  --user=backup_user \
  --password \
  --single-transaction \
  --routines \
  --events \
  --triggers \
  --source-data=2 \
  --databases order_db \
  > order_db.sql
```

`--databases` sẽ thêm `CREATE DATABASE` và `USE` vào trong dump. Nếu bạn chỉ muốn Import dữ liệu vào một Database cùng tên đã tồn tại, giữ cách viết trước đó cũng được, nhưng câu lệnh Restore phải chỉ rõ Database đích.

Nếu file Backup rất lớn, có thể nén trực tiếp:

```bash
mysqldump \
  --host=127.0.0.1 \
  --user=backup_user \
  --password \
  --single-transaction \
  --routines \
  --events \
  --triggers \
  order_db | gzip > order_db.sql.gz
```

Khi Restore thực thi:

```bash
mysql --host=127.0.0.1 --user=root --password < mysql-full-backup.sql
```

File nén có thể Restore như sau:

```bash
mysql --host=127.0.0.1 --user=root --password \
  -e "CREATE DATABASE IF NOT EXISTS order_db"

gunzip -c order_db.sql.gz | mysql --host=127.0.0.1 --user=root --password order_db
```

`mysqldump` có một vài cái bẫy thường gặp:

- Quyền của User Backup không đủ, View, Trigger, Stored Procedure, Event không được xuất đầy đủ.
- Khi dùng `--single-transaction`, trong thời gian Backup lại thực thi các DDL như `ALTER TABLE`, `DROP TABLE`, `TRUNCATE TABLE`, có thể khiến Backup thất bại hoặc nội dung không như mong đợi.
- Không ghi lại vị trí binlog, sau này không thể từ Full Backup tiếp tục phục hồi theo thời điểm (Point-in-Time Recovery).
- Khi Restore Backup vào môi trường đã bật GTID, đừng dựa vào mặc định `--set-gtid-purged=AUTO`. Tài liệu chính thức nói rằng, mặc định khi nguồn bật GTID, dump có thể ghi `SET @@GLOBAL.gtid_purged` và `SET @@SESSION.sql_log_bin=0`; dump một phần Database cũng có thể mang theo GTID của Transaction thuộc Database khác trong `gtid_executed` của Instance nguồn. Khi Import vào Database kiểm thử, Database tạm thời, hay Instance đích đã có lịch sử GTID, thường phải đánh giá rõ có dùng `--set-gtid-purged=OFF` hay không; nếu tạo Node Replication mới thì có thể cần giữ GTID. Mấu chốt là chọn một cách tường minh, đừng chép nguyên giá trị mặc định.
- `--source-data=2` ghi lại vị trí binlog cấp Instance, không phải Log tăng cường "chỉ thuộc về Database này". PITR cho một Database đơn lẻ phiền phức hơn PITR cho cả Instance, đặc biệt phải cân nhắc Transaction chéo Database, Stored Procedure, Trigger và `binlog_format`, không thể đơn giản replay nguyên xi binlog của cả Instance vào Database đích.

Database nhỏ, môi trường kiểm thử, Migration chéo phiên bản, xuất lượng dữ liệu nhỏ, `mysqldump` rất tiện dụng. Database Production hàng trăm GB mà vẫn chỉ dựa vào nó để Restore, thời gian phục hồi thường sẽ khiến người ta khó chịu.

## MySQL Shell Dump Utilities: Logical Backup song song

Nếu bạn muốn giữ tính di động của Logical Backup, lại chê `mysqldump` xuất và Import đơn luồng quá chậm, có thể xem qua MySQL Shell Dump Utilities.

MySQL Shell cung cấp vài loại hàm `util`:

```javascript
util.dumpInstance("/backup/mysql/instance", { threads: 8 });
util.dumpSchemas(["order_db"], "/backup/mysql/order_db", { threads: 8 });
util.dumpTables("order_db", ["orders", "order_item"], "/backup/mysql/orders", {
  threads: 8,
});
util.loadDump("/backup/mysql/order_db", { threads: 8 });
```

Định vị của nó vẫn là Logical Backup, nhưng hỗ trợ dump / load song song, nén, thông tin tiến độ, Checksum và xuất ra Object Storage. Trong tài liệu chính thức, giá trị mặc định của `threads` là 4, có thể tăng lên tùy theo tải của Instance, mạng và khả năng ghi của đầu đích.

Nhưng đừng hiểu nhầm nó là thứ thay thế Physical Backup. Thứ nó xuất vẫn là Object logic và file dữ liệu, khi Restore vẫn phải dựng lại bảng, Index và Object; Database lớn mà RTO quá gấp, Physical Backup thường vẫn ổn định hơn.

## Dùng binlog để phục hồi tăng cường (Incremental Restore)

Full Backup chỉ có thể phục hồi đến đúng thời điểm Backup. Muốn phục hồi đến thời điểm muộn hơn, cần dựa vào binlog.

binlog ghi lại các Event có sửa đổi dữ liệu, cũng là nền tảng của Replication chủ-tớ và phục hồi theo thời điểm (Point-in-Time Recovery) trong MySQL. PITR (Point-in-Time Recovery) thường là trước tiên phục hồi một bản Full Backup, rồi từ vị trí binlog tương ứng với bản Backup đó bắt đầu replay Log, cho đến thời điểm đích hoặc vị trí đích.

Một ví dụ đơn giản hóa:

1. Lúc 02:00 sáng thực hiện một lần Full Backup, trong file dump có ghi `binlog.000120` và vị trí `154`.
2. Lúc 10:21 sáng có người xóa nhầm một loạt dữ liệu của bảng `order_item`.
3. Khi phục hồi, trước tiên Import bản Full Backup lúc 02:00.
4. Sau đó dùng `mysqlbinlog` để replay `binlog.000120` và các Log sau đó, dừng lại trước câu lệnh xóa nhầm.

Phục hồi theo thời gian có thể viết như sau:

```bash
mysqlbinlog \
  --start-position=154 \
  --stop-datetime="2026-06-25 10:20:59" \
  binlog.000120 binlog.000121 \
  | mysql --binary-mode --host=127.0.0.1 --user=root --password
```

Dừng theo thời gian phù hợp để nhanh chóng thu hẹp phạm vi, nhưng không thể coi đó là thời gian nghiệp vụ chính xác tuyệt đối. `mysqlbinlog` sẽ diễn giải `--stop-datetime` theo múi giờ cục bộ của máy thực thi câu lệnh, và dừng khi gặp Event đầu tiên có Timestamp lớn hơn hoặc bằng giá trị đích. Khi phục hồi trên Production, cách làm ổn định hơn thường là dùng phạm vi thời gian để xuất một đoạn binlog ra kiểm tra trước, tìm Event hoặc ranh giới Transaction tương ứng với thao tác nhầm, rồi dùng `--stop-position` để replay lần cuối.

Nếu đã tìm chính xác vị trí Event, dùng vị trí sẽ đáng tin cậy hơn thời gian:

```bash
mysqlbinlog \
  --start-position=154 \
  --stop-position=987654 \
  binlog.000120 \
  | mysql --binary-mode --host=127.0.0.1 --user=root --password
```

Khi chỉ định nhiều file binlog cùng lúc, `--start-position` chỉ có tác dụng với file đầu tiên trong câu lệnh, `--stop-position` chỉ có tác dụng với file cuối cùng, các file ở giữa sẽ được xử lý trọn vẹn. Vị trí là Offset (độ lệch) byte trong file binlog, không phải Event thứ mấy, và phải rơi vào đúng ranh giới Event hợp lệ.

`mysql --binary-mode` không phải tham số trang trí. Tài liệu chính thức đề cập, nếu trong output của binlog chứa các ký tự rỗng như `\0`, không thêm `--binary-mode` thì `mysql` Client có thể không phân tích đúng được.

MySQL hiện đại thường có binlog định dạng `ROW`. Định dạng này ghi lại thay đổi theo dòng, không nhất định nhìn thấy SQL gốc. Khi điều tra thao tác nhầm, có thể dùng cách sau để giải mã Row Event thành chú thích dễ đọc:

```bash
mysqlbinlog --base64-output=DECODE-ROWS -vv binlog.000120 > binlog.000120.readable.sql
```

Lưu ý, output này chủ yếu dùng để kiểm tra thủ công. Tài liệu chính thức cũng nhắc, nếu muốn thực thi lại output của `mysqlbinlog`, mặc định `--base64-output=AUTO` mới là hành vi an toàn; không nên dùng các chế độ như `DECODE-ROWS` để replay chính thức.

Phục hồi bằng binlog có vài tiền đề:

- MySQL phải được bật binary logging từ trước.
- Thời gian giữ binlog phải phủ được yêu cầu RPO của bạn.
- Trong Full Backup phải tìm được file và vị trí binlog khởi đầu, hoặc có thông tin GTID.
- Trước khi phục hồi tốt nhất nên xác minh trên Instance cách ly, đừng trực tiếp replay binlog chưa chắc chắn vào Database Production.

Bản thân file binlog cũng cần được Backup. Tài liệu chính thức của MySQL từng đưa ra một cách Backup binlog liên tục:

```bash
mysqlbinlog \
  --read-from-remote-server \
  --host=127.0.0.1 \
  --user=binlog_backup \
  --password \
  --raw \
  --stop-never \
  --connection-server-id=330610 \
  --result-file=/backup/mysql/binlog/ \
  binlog.000999
```

Câu lệnh này sẽ kéo binlog ở định dạng nhị phân gốc, và sau khi đến cuối file Log cuối cùng hiện tại sẽ tiếp tục chờ Event mới. Nó khác với Slave Replication, khi kết nối bị đứt sẽ không tự động kết nối lại như Slave, nên script Production còn cần kèm theo Process Daemon (tiến trình giám sát), cảnh báo và tiếp tục truyền từ điểm đứt.

Việc kéo binlog liên tục còn có vài điểm dễ bị bỏ sót:

- Tài khoản đọc binlog từ xa cần quyền liên quan đến Replication. Tài liệu MySQL 8.4 đối với `--read-from-remote-server` vẫn ghi là quyền `REPLICATION SLAVE`; các phiên bản và mô hình quyền khác nhau có thể có khác biệt, khi tạo tài khoản phải xác nhận theo tài liệu của phiên bản hiện tại.
- `--stop-never` khiến `mysqlbinlog` kết nối liên tục với nguồn bằng một server ID, trên Production khuyến nghị cấu hình tường minh `--connection-server-id`, tránh xung đột với Node Replication hoặc một tiến trình `mysqlbinlog` khác.
- Chế độ `--raw` mặc định sẽ dùng tên file trùng với binlog nguồn để ghi vào thư mục hiện tại; nếu file đã tồn tại sẽ bị ghi đè. Hãy dùng `--result-file` để chỉ định thư mục hoặc tiền tố riêng, đồng thời giám sát quyền và dung lượng của thư mục.
- Nếu nguồn bật mã hóa binlog, bản sao mà `mysqlbinlog` kéo về vẫn sẽ ở định dạng chưa mã hóa tại phía Backup. Đường truyền phải dùng TLS, thư mục Backup cũng phải được mã hóa, kiểm soát truy cập và bảo vệ chống xóa.

## Dùng XtraBackup để Physical Backup

Logical Backup xuất ra SQL, Physical Backup sao chép file dữ liệu và file Log liên quan của MySQL. Lượng dữ liệu càng lớn, ưu thế của Physical Backup càng rõ: Backup và Restore gần với sao chép file hơn, không cần replay từng câu lệnh `INSERT`.

Percona XtraBackup là công cụ Physical Backup mã nguồn mở thường dùng trong thực tế MySQL. Nó có thể Backup dữ liệu của các Storage Engine như InnoDB / XtraDB khi MySQL đang chạy, thường dùng cho Hot Backup trong môi trường Production. Tuy nhiên "Hot Backup" chủ yếu là nói với các Engine dạng Transaction như InnoDB; tài liệu Percona cũng nói rõ, khi sao chép dữ liệu phi InnoDB thì bảng InnoDB sẽ bị khóa, Instance dùng lẫn nhiều Storage Engine cần đánh giá riêng mức ảnh hưởng.

Một quy trình Full Backup tối thiểu như sau:

```bash
xtrabackup --backup --target-dir=/data/backups/mysql/base
```

Sau khi Backup xong không thể dùng để khởi động ngay, cần prepare trước, để file dữ liệu đạt trạng thái nhất quán:

```bash
xtrabackup --prepare --target-dir=/data/backups/mysql/base
```

`--prepare` sẽ áp dụng redo / undo, để các file trong thư mục Backup hình thành Snapshot nhất quán. Bước này không được gián đoạn; nếu sau bản Backup này còn phải tiếp tục gộp Incremental Backup, cần dùng `--apply-log-only` theo tài liệu Percona để giữ trạng thái trước khi Rollback các Transaction chưa commit.

Khi Restore phải dừng MySQL, và đảm bảo `datadir` đích trống:

```bash
systemctl stop mysqld

mv /var/lib/mysql /var/lib/mysql.bak.$(date +%F-%H%M%S)
install -d -o mysql -g mysql /var/lib/mysql

xtrabackup --copy-back --target-dir=/data/backups/mysql/base

chown -R mysql:mysql /var/lib/mysql

systemctl start mysqld
```

Những câu lệnh dạng này nhìn không phức tạp, nơi thực sự dễ xảy ra vấn đề là tính tương thích phiên bản. Tài liệu Percona viết rất rõ: XtraBackup 8.4 chỉ hỗ trợ MySQL 8.4 và Percona Server for MySQL 8.4, không hỗ trợ MySQL 8.0 hay 9.x; MySQL 8.0 phải xem phạm vi hỗ trợ của dòng XtraBackup 8.0. Môi trường Production đừng dùng "số phiên bản gần giống nhau" để phán đoán xem có Backup và Restore được không.

XtraBackup cũng hỗ trợ Incremental Backup, ví dụ dựa trên một bản Full Backup để tiếp tục Backup dữ liệu thay đổi:

```bash
xtrabackup \
  --backup \
  --target-dir=/data/backups/mysql/inc1 \
  --incremental-basedir=/data/backups/mysql/base
```

Thứ tự prepare, cách gộp và các bước phục hồi của chuỗi Incremental rất dễ viết sai. Khi Team chưa diễn tập thành thạo, không nên vừa bắt đầu đã đặt cược khả năng phục hồi vào chuỗi Incremental phức tạp. Cách ổn định hơn là trước tiên đảm bảo "Full Physical Backup + binlog" phục hồi được, rồi tùy theo lượng dữ liệu và áp lực cửa sổ thời gian mà thêm Incremental Backup.

Nếu sau khi Restore bằng XtraBackup còn tiếp tục làm PITR, điểm bắt đầu đừng dựa vào phỏng đoán. `xtrabackup_binlog_info` trong thư mục Backup sẽ ghi file và vị trí binlog tại thời điểm Backup:

```bash
cat /data/backups/mysql/base/xtrabackup_binlog_info
```

Sau khi phục hồi Full Physical Backup, từ vị trí mà file này đưa ra bắt đầu dùng `mysqlbinlog` để replay Log tiếp theo.

## Chọn Logical Backup hay Physical Backup?

Có thể chọn theo lượng dữ liệu, mục tiêu phục hồi và năng lực vận hành.

| Tình huống                                                                   | Phương pháp phù hợp hơn                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Database nhỏ, Database kiểm thử, xuất bảng đơn lẻ, Migration chéo môi trường | `mysqldump`                                                                     |
| Cần xem hoặc sửa thủ công nội dung Backup                                    | `mysqldump`                                                                     |
| Migration logic quy mô vừa, muốn Import/Xuất song song                       | MySQL Shell Dump Utilities                                                      |
| Database lớn, cửa sổ phục hồi ngắn, chủ yếu là bảng InnoDB                   | XtraBackup hoặc MySQL Enterprise Backup                                         |
| Cần phục hồi theo thời điểm (Point-in-Time)                                  | Full Backup + binlog                                                            |
| Instance Cloud Database                                                      | Ưu tiên dùng Snapshot / PITR của nhà cung cấp Cloud, sau đó xuất ra để xác minh |

Ở đây đừng nghĩ việc chọn công cụ quá huyền bí. Database nhỏ dùng `mysqldump` không có vấn đề gì, script đơn giản, có sự cố cũng dễ điều tra. Khi lượng dữ liệu tăng lên, vấn đề Restore file SQL chậm sẽ ngày càng rõ, lúc đó chuyển sang Physical Backup mới thực tế.

Phương án tệ nhất thường là chỉ làm một loại Backup, và không bao giờ xác minh bằng Restore.

## Nên diễn tập phục hồi như thế nào?

Script Backup chạy thành công, chỉ nói lên rằng đã tạo ra file. File có dùng được không, phải do diễn tập phục hồi trả lời.

Một cuộc diễn tập tối thiểu có thể đi theo quy trình này:

1. Chuẩn bị một máy cách ly, cài MySQL cùng phiên bản lớn (major version).
2. Kéo bản Full Backup gần nhất và binlog tương ứng, xác nhận khóa giải mã, tài khoản, chứng chỉ và cách truy cập Object Storage đều khả dụng.
3. Phục hồi Full Backup, ghi lại thời gian tiêu tốn.
4. Replay binlog đến thời điểm chỉ định, ghi lại thời gian tiêu tốn.
5. Xác minh số lượng Database và bảng quan trọng, SQL nghiệp vụ quan trọng, Stored Procedure, Event, Trigger, tài khoản, Role và quyền.
6. Kiểm tra `charset`, `collation`, `time_zone`, `sql_mode`, công tắc chỉ đọc (read-only) và cách ly mạng, đảm bảo Instance phục hồi không bị Traffic nghiệp vụ thật kết nối nhầm.
7. Dùng ứng dụng kết nối đến Instance phục hồi, chạy một nhóm Interface Smoke Test chỉ đọc.
8. Ghi lại RTO thực tế của lần diễn tập này, thời điểm có thể phục hồi đến, các bước thất bại và thao tác thủ công.

Xác minh đừng chỉ xem MySQL có khởi động được không. Ít nhất phải kiểm tra vài loại dữ liệu:

```sql
-- Số dòng của bảng quan trọng
SELECT COUNT(*) FROM order_db.orders;

-- Thời gian ghi gần nhất
SELECT MAX(created_at) FROM order_db.orders;

-- Stored Procedure và Function
SHOW PROCEDURE STATUS WHERE Db = 'order_db';
SHOW FUNCTION STATUS WHERE Db = 'order_db';

-- Event
SHOW EVENTS FROM order_db;

-- Trigger
SHOW TRIGGERS FROM order_db;

-- Tài khoản, Role và quyền
SELECT user, host FROM mysql.user;
SHOW GRANTS FOR 'app_user'@'%';

-- Tham số môi trường quan trọng
SELECT
  @@character_set_server,
  @@collation_server,
  @@time_zone,
  @@sql_mode,
  @@read_only,
  @@super_read_only;
```

Nếu nghiệp vụ có bảng đối soát, bảng giao dịch, bảng tồn kho, phải ưu tiên xác minh những bảng này. Mục tiêu của diễn tập phục hồi rất cụ thể: sớm phát hiện những vấn đề như "Backup thiếu Object, binlog thiếu file, quyền không phục hồi được, thời gian Import vượt xa dự kiến", những thứ sẽ bị phóng đại trong sự cố.

## Những hiểu lầm phổ biến

**Hiểu lầm một: Có Slave rồi thì không cần Backup.**

Slave có thể tiếp quản Traffic đọc/ghi, nhưng không chặn được xóa nhầm sửa nhầm. SQL sai sau khi đồng bộ sang, Slave cũng sẽ thành trạng thái sai. Slave có độ trễ (Delayed Slave) có thể tranh thủ chút thời gian xử lý, nhưng vẫn không thể thay thế Backup ngoại tuyến.

**Hiểu lầm hai: Chỉ Backup dữ liệu, không Backup binlog.**

Cách làm này nhiều nhất chỉ phục hồi đến thời điểm Full Backup. Toàn bộ ghi nhận từ sau Full Backup đến trước sự cố đều không thể lấy lại, RPO sẽ bị kéo dài theo chu kỳ Backup.

**Hiểu lầm ba: File Backup và Database đặt trên cùng một máy.**

Khi hỏng ổ đĩa, sự cố phòng máy, xóa nhầm thư mục, dữ liệu và Backup có thể mất cùng lúc. Ít nhất phải sao chép sang Storage độc lập; nghiệp vụ quan trọng còn phải cân nhắc chéo phòng máy hoặc Object Storage.

**Hiểu lầm bốn: Script Backup không có cảnh báo thất bại.**

Trong thư mục Backup có file cũ, không có nghĩa lần Backup gần nhất đã thành công. Script nên kiểm tra Exit Code, kích thước file, thời gian tạo, Checksum, và gửi thông báo thất bại đến người phụ trách.

**Hiểu lầm năm: Không bao giờ Restore.**

Backup không có diễn tập phục hồi, ngày thường nhìn có vẻ đỡ tốn công nhất, nhưng khi sự cố lại đắt giá nhất. Quy trình phục hồi càng lâu không chạy, càng dễ bị mắc kẹt bởi phiên bản, quyền, đường dẫn, dung lượng ổ đĩa và tham số công cụ.

**Hiểu lầm sáu: Checksum qua là bằng với phục hồi được.**

Checksum chỉ nói lên file không bị hỏng trong quá trình sao chép và lưu trữ với xác suất cao, không có nghĩa SQL Import suôn sẻ, Physical Backup khởi động được, Object quyền đầy đủ, cũng không có nghĩa chuỗi binlog liên tục. Năng lực phục hồi chỉ có thể được chứng minh bằng diễn tập phục hồi.

**Hiểu lầm bảy: File Backup ai cũng có thể sửa, có thể xóa.**

Nếu Backup dùng chung quyền với tài khoản Production, hoặc script vận hành thông thường có thể trực tiếp ghi đè, xóa, thì khi gặp xóa nhầm, Ransomware, bug script có thể cùng mất hiệu lực. Nghiệp vụ quan trọng ít nhất phải có một bản sao chéo tài khoản, chéo Failure Domain, có Versioning hoặc chính sách bất biến (Immutable), và hạn chế quyền xóa.

## Một phương án cơ bản có thể áp dụng

Nếu chưa có phương án sẵn, có thể bắt đầu từ bộ này:

- Database nghiệp vụ chủ yếu là InnoDB, lượng dữ liệu không lớn: mỗi ngày `mysqldump --single-transaction --routines --events --triggers --source-data=2` Full Backup, giữ 7 đến 30 ngày, thời gian giữ binlog phủ cùng cửa sổ đó.
- Khi lượng dữ liệu tăng lên: mỗi ngày hoặc mỗi tuần một lần XtraBackup Full Backup, tùy theo lượng ghi của nghiệp vụ quyết định có thêm Incremental Backup không, binlog Backup riêng.
- Sau khi Backup ghi xuống đĩa thì tính Checksum, sao chép sang Storage độc lập; nghiệp vụ quan trọng giữ thêm một bản sao mã hóa, chéo tài khoản, có Versioning hoặc chính sách bất biến.
- Giám sát thời gian Full Backup khả dụng mới nhất, thời gian binlog đã Archive mới nhất, tính liên tục của file binlog và trạng thái tiến trình Archive.
- Mỗi tháng ít nhất một lần diễn tập phục hồi; nghiệp vụ cốt lõi làm thêm một lần trước đợt khuyến mãi lớn, Migration, nâng cấp phiên bản.
- Viết một bản Runbook phục hồi, gồm người phụ trách, vị trí Backup, cách giải mã, câu lệnh phục hồi, cách tìm điểm bắt đầu binlog, môi trường phục hồi cách ly, SQL xác minh và hướng dẫn Rollback.

Chu kỳ ở đây chỉ là điểm khởi đầu, không phải đáp án chuẩn. Dữ liệu dạng tài chính, đơn hàng, thanh toán, y tế sẽ có yêu cầu RPO/RTO nghiêm ngặt hơn; Database báo cáo nội bộ, phân tích Log thường có thể nới lỏng. Chiến lược Backup nên định theo thiệt hại nghiệp vụ, chứ không phải định theo Template trên mạng.

## Tài liệu tham khảo

- [MySQL Reference Manual: mysqldump](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html)
- [MySQL Reference Manual: mysqlbinlog](https://dev.mysql.com/doc/refman/8.4/en/mysqlbinlog.html)
- [MySQL Reference Manual: Using mysqlbinlog to Back Up Binary Log Files](https://dev.mysql.com/doc/refman/8.4/en/mysqlbinlog-backup.html)
- [MySQL Reference Manual: Point-in-Time Recovery](https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery-binlog.html)
- [MySQL Reference Manual: Binary Logging Options and Variables](https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html)
- [MySQL Shell 8.4: Instance Dump Utility, Schema Dump Utility, and Table Dump Utility](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-shell-utilities-dump-instance-schema.html)
- [MySQL Shell 8.4: Dump Loading Utility](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-shell-utilities-load-dump.html)
- [MySQL Reference Manual: MySQL Releases: Innovation and LTS](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html)
- [Percona XtraBackup 8.4 Documentation](https://docs.percona.com/percona-xtrabackup/8.4/index.html)
- [Percona XtraBackup 8.4: Prepare a full backup](https://docs.percona.com/percona-xtrabackup/8.4/prepare-full-backup.html)
- [Percona XtraBackup 8.4: Index of files created by Percona XtraBackup](https://docs.percona.com/percona-xtrabackup/8.4/xtrabackup-files.html)
- [Percona XtraBackup 8.0 Supported Versions](https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html)

<!-- @include: @article-footer.snippet.md -->
