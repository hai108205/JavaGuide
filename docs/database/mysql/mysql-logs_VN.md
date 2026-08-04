---
title: Giải thích chi tiết ba loại Log trong MySQL (binlog, redo log và undo log)
description: Phân tích chuyên sâu vai trò và nguyên lý của ba loại Log trong MySQL gồm binlog, redo log và undo log, giải thích chi tiết cơ chế Two-Phase Commit đảm bảo tính nhất quán dữ liệu, cùng ứng dụng của Log trong Crash Recovery và Replication chủ-tớ.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MySQL Log,binlog,redo log,undo log,Two-Phase Commit,Crash Recovery,Replication chủ-tớ,WAL,Transaction Log
---

> Bài viết này được đóng góp từ tài khoản WeChat chính thức (公号) của lập trình viên A Tinh (程序猿阿星), JavaGuide đã bổ sung và hoàn thiện thêm.

## Lời mở đầu

MySQL Log chủ yếu bao gồm các loại lớn sau: Error Log, Query Log, Slow Query Log, Transaction Log và Binary Log. Trong đó, quan trọng hơn cả là Binary Log - binlog (Archive Log) và Transaction Log - redo log (Redo Log) cùng undo log (Rollback Log).

![](https://oss.javaguide.cn/github/javaguide/01.png)

Hôm nay chúng ta sẽ cùng tìm hiểu về redo log (Redo Log), binlog (Archive Log), Two-Phase Commit và undo log (Rollback Log).

## redo log

redo log (Redo Log) là loại Log riêng có của InnoDB Storage Engine, nó giúp MySQL có được khả năng Crash Recovery (phục hồi sau sự cố).

Ví dụ, khi MySQL Instance bị lỗi hoặc downtime, lúc khởi động lại, InnoDB Storage Engine sẽ sử dụng redo log để phục hồi dữ liệu, đảm bảo tính bền vững và toàn vẹn của dữ liệu.

![](https://oss.javaguide.cn/github/javaguide/02.png)

Dữ liệu trong MySQL được quản lý theo đơn vị Page (trang). Khi bạn truy vấn một bản ghi, một Page dữ liệu sẽ được nạp từ ổ cứng lên, dữ liệu nạp lên được gọi là Data Page và được đưa vào `Buffer Pool`.

Các truy vấn sau đó sẽ tìm trong `Buffer Pool` trước, nếu không hit (miss) thì mới nạp từ ổ cứng, giúp giảm chi phí IO ổ cứng và tăng hiệu năng.

Khi cập nhật dữ liệu bảng cũng tương tự, nếu phát hiện dữ liệu cần cập nhật đã có trong `Buffer Pool` thì sẽ cập nhật trực tiếp ngay trong `Buffer Pool`.

Sau đó, "những thay đổi đã thực hiện trên Data Page nào đó" sẽ được ghi vào Redo Log Buffer (`redo log buffer`), rồi flush xuống file redo log trên đĩa.

![](https://oss.javaguide.cn/github/javaguide/03.png)

> Gợi ý về lỗi chính tả trong hình: Ở bước 4, dòng chữ "清空 redo log buffe 刷盘到 redo 日志中" (xóa redo log buffe và flush xuống redo log), từ buffe lẽ ra phải là buffer.

Trong trường hợp lý tưởng, Transaction cứ commit là sẽ thực hiện thao tác flush xuống đĩa, nhưng thực tế thời điểm flush được quyết định theo từng chiến lược khác nhau.

> Mẹo nhỏ: Mỗi bản ghi redo được cấu thành từ "Tablespace ID + Data Page ID + Offset + Độ dài dữ liệu thay đổi + Dữ liệu thay đổi cụ thể"

### Thời điểm flush xuống đĩa

Trong InnoDB Storage Engine, **redo log buffer** (Redo Log Buffer) là một vùng nhớ dùng để lưu tạm redo log. Để đảm bảo tính bền vững của Transaction và tính nhất quán của dữ liệu, InnoDB sẽ flush dữ liệu Log trong Buffer này xuống file redo log trên đĩa vào những thời điểm nhất định. Các thời điểm đó có thể tổng kết thành 6 trường hợp sau:

1. **Khi Transaction commit (quan trọng nhất)**: Khi Transaction commit, redo log trong log buffer sẽ được flush xuống đĩa (có thể điều khiển bằng tham số `innodb_flush_log_at_trx_commit`, sẽ được đề cập ở phần sau).
2. **Khi không gian redo log buffer không đủ**: Đây là chiến lược quản lý dung lượng chủ động của InnoDB, nhằm tránh việc Buffer bị viết đầy dẫn đến Block User Thread.
   - Khi không gian đã dùng của redo log buffer vượt quá **một nửa (50%)** tổng dung lượng, Background Thread sẽ **chủ động** flush phần Log này xuống đĩa, nhường chỗ cho việc ghi Log tiếp theo. Đây là một kiểu tối ưu "lo xa tính trước".
   - Nếu do Transaction lớn hoặc I/O bận rộn khiến Buffer bị **viết đầy hoàn toàn**, tất cả User Thread muốn ghi Log mới đều sẽ bị **Block**, đồng thời buộc phải thực hiện một lần flush đồng bộ, cho đến khi có không gian trống. Trường hợp này ảnh hưởng đến hiệu năng Database, nên cố gắng tránh.
3. **Khi kích hoạt Checkpoint**: Checkpoint là cơ chế cốt lõi được InnoDB thiết kế nhằm rút ngắn thời gian Crash Recovery. Khi Checkpoint được kích hoạt, InnoDB cần flush tất cả Dirty Page trước Checkpoint đó xuống đĩa. Theo nguyên tắc **Write-Ahead Logging (WAL)**, trước khi Data Page được ghi xuống đĩa, redo log tương ứng của nó phải được ghi xuống đĩa trước. Vì vậy, việc thực hiện thao tác Checkpoint chắc chắn sẽ đảm bảo redo log liên quan cũng đã được flush xuống đĩa.
4. **Background Thread flush định kỳ**: InnoDB có một master thread chạy nền, khoảng mỗi giây sẽ thực hiện một tác vụ thường lệ, trong đó bao gồm việc flush Log trong redo log buffer xuống đĩa. Cơ chế này là bảo đảm Persistence (tính bền vững) chủ yếu khi `innodb_flush_log_at_trx_commit` được đặt là 0 hoặc 2.
5. **Khi tắt Server bình thường**: Trong quá trình tắt MySQL Server một cách bình thường, để đảm bảo dữ liệu của tất cả Transaction đã commit được lưu trọn vẹn, InnoDB sẽ thực hiện một lần flush cuối cùng, xóa sạch và ghi toàn bộ Log còn lại trong redo log buffer xuống file trên đĩa.
6. **Khi chuyển đổi binlog**: Sau khi bật binlog, dưới cấu hình "song nhất" (double-one) của MySQL với `innodb_flush_log_at_trx_commit=1` và `sync_binlog=1`, để đảm bảo tính nhất quán trạng thái giữa redo log và binlog (phục vụ Crash Recovery hoặc Replication chủ-tớ), khi file binlog viết đầy hoặc khi thực thi thủ công flush logs để chuyển đổi, thao tác flush redo log sẽ được kích hoạt.

Tóm lại, InnoDB flush Redo Log trong nhiều trường hợp khác nhau để đảm bảo tính bền vững và nhất quán của dữ liệu.

Chúng ta cần chú ý thiết lập chiến lược flush đĩa đúng đắn `innodb_flush_log_at_trx_commit`. Tùy theo chiến lược flush đĩa được cấu hình trong MySQL, sau khi MySQL downtime có thể xảy ra vấn đề mất mát dữ liệu ở mức độ nhẹ.

`innodb_flush_log_at_trx_commit` có 3 giá trị, tức là có 3 chiến lược flush đĩa:

- **0**: Khi đặt là 0, nghĩa là mỗi lần Transaction commit sẽ không thực hiện thao tác flush đĩa. Cách này hiệu năng cao nhất nhưng cũng kém an toàn nhất, vì nếu MySQL bị lỗi hoặc downtime, có thể mất các Transaction trong vòng 1 giây gần nhất.
- **1**: Khi đặt là 1, nghĩa là mỗi lần Transaction commit đều thực hiện thao tác flush đĩa. Cách này hiệu năng thấp nhất nhưng cũng an toàn nhất, vì chỉ cần Transaction commit thành công, bản ghi redo log chắc chắn đã nằm trên đĩa, không mất bất kỳ dữ liệu nào.
- **2**: Khi đặt là 2, nghĩa là mỗi lần Transaction commit chỉ ghi nội dung redo log trong log buffer vào page cache (File System Cache). page cache chuyên dùng để cache file, file được cache ở đây chính là file redo log. Cách này có hiệu năng và độ an toàn nằm giữa hai cách trên.

Giá trị mặc định của chiến lược flush đĩa `innodb_flush_log_at_trx_commit` là 1, chỉ khi đặt là 1 mới không mất bất kỳ dữ liệu nào. Để đảm bảo tính bền vững của Transaction, chúng ta phải đặt giá trị này là 1.

Ngoài ra, InnoDB Storage Engine có một Background Thread, cứ mỗi `1` giây sẽ ghi nội dung trong `redo log buffer` vào File System Cache (`page cache`), sau đó gọi `fsync` để flush xuống đĩa.

![](https://oss.javaguide.cn/github/javaguide/04.png)

Nói cách khác, bản ghi redo log của một Transaction chưa commit cũng có thể được flush xuống đĩa.

**Tại sao vậy?**

Bởi vì trong quá trình thực thi Transaction, các bản ghi redo log sẽ được ghi vào `redo log buffer`, và những bản ghi redo log này sẽ được Background Thread flush xuống đĩa.

![](https://oss.javaguide.cn/github/javaguide/05.png)

Ngoài thao tác polling mỗi giây `1` lần của Background Thread, còn một trường hợp khác: khi không gian mà `redo log buffer` chiếm dụng sắp đạt đến một nửa `innodb_log_buffer_size`, Background Thread sẽ chủ động flush xuống đĩa.

Dưới đây là Flowchart của các chiến lược flush đĩa khác nhau.

#### innodb_flush_log_at_trx_commit=0

![](https://oss.javaguide.cn/github/javaguide/06.png)

Khi đặt là `0`, nếu MySQL bị lỗi hoặc downtime, có thể mất dữ liệu trong `1` giây.

#### innodb_flush_log_at_trx_commit=1

![](https://oss.javaguide.cn/github/javaguide/07.png)

Khi đặt là `1`, chỉ cần Transaction commit thành công, bản ghi redo log chắc chắn đã nằm trên ổ cứng, không mất bất kỳ dữ liệu nào.

Nếu MySQL bị lỗi hoặc downtime trong lúc Transaction đang thực thi, phần Log này bị mất, nhưng Transaction cũng chưa commit, nên mất Log cũng không gây thiệt hại gì.

#### innodb_flush_log_at_trx_commit=2

![](https://oss.javaguide.cn/github/javaguide/09.png)

Khi đặt là `2`, chỉ cần Transaction commit thành công, nội dung trong `redo log buffer` chỉ được ghi vào File System Cache (`page cache`).

Nếu chỉ MySQL bị lỗi thì không mất dữ liệu nào, nhưng nếu downtime thì có thể mất dữ liệu trong `1` giây.

### Nhóm file Log (Log File Group)

File redo log lưu trên ổ cứng không chỉ có một, mà xuất hiện dưới dạng một **nhóm file Log (Log File Group)**, kích thước của mỗi file Log `redo` đều giống nhau.

Ví dụ, có thể cấu hình một nhóm gồm `4` file, mỗi file có kích thước `1GB`, toàn bộ nhóm file Log redo log có thể ghi nội dung `4G`.

Nó sử dụng dạng mảng vòng (Ring Array), ghi từ đầu, ghi đến cuối lại quay về đầu để ghi tiếp theo vòng lặp, như hình dưới đây.

![](https://oss.javaguide.cn/github/javaguide/10.png)

Trong **nhóm file Log** này còn có hai thuộc tính quan trọng, lần lượt là `write pos, checkpoint`

- **write pos** là vị trí ghi hiện tại, vừa ghi vừa dịch chuyển về sau
- **checkpoint** là vị trí xóa hiện tại, cũng dịch chuyển về sau

Mỗi lần bản ghi redo log được flush xuống **nhóm file Log**, vị trí `write pos` sẽ dịch chuyển về sau và được cập nhật.

Mỗi lần MySQL nạp **nhóm file Log** để phục hồi dữ liệu, nó sẽ xóa sạch các bản ghi redo log đã nạp, đồng thời dịch chuyển `checkpoint` về sau và cập nhật.

Phần còn trống giữa `write pos` và `checkpoint` có thể dùng để ghi bản ghi redo log mới.

![](https://oss.javaguide.cn/github/javaguide/11.png)

Nếu `write pos` đuổi kịp `checkpoint`, nghĩa là **nhóm file Log** đã đầy, lúc này không thể ghi thêm bản ghi redo log mới, MySQL phải dừng lại, xóa bớt một số bản ghi và đẩy `checkpoint` tiến lên.

![](https://oss.javaguide.cn/github/javaguide/12.png)

Lưu ý rằng từ MySQL 8.0.30 trở đi, nhóm file Log có một số thay đổi:

> The innodb_redo_log_capacity variable supersedes the innodb_log_files_in_group and innodb_log_file_size variables, which are deprecated. When the innodb_redo_log_capacity setting is defined, the innodb_log_files_in_group and innodb_log_file_size settings are ignored; otherwise, these settings are used to compute the innodb_redo_log_capacity setting (innodb_log_files_in_group \* innodb_log_file_size = innodb_redo_log_capacity). If none of those variables are set, redo log capacity is set to the innodb_redo_log_capacity default value, which is 104857600 bytes (100MB). The maximum redo log capacity is 128GB.

> Redo log files reside in the #innodb_redo directory in the data directory unless a different directory was specified by the innodb_log_group_home_dir variable. If innodb_log_group_home_dir was defined, the redo log files reside in the #innodb_redo directory in that directory. There are two types of redo log files, ordinary and spare. Ordinary redo log files are those being used. Spare redo log files are those waiting to be used. InnoDB tries to maintain 32 redo log files in total, with each file equal in size to 1/32 \* innodb_redo_log_capacity; however, file sizes may differ for a time after modifying the innodb_redo_log_capacity setting.

Ý nghĩa là trước MySQL 8.0.30, có thể thông qua `innodb_log_files_in_group` và `innodb_log_file_size` để cấu hình số lượng file và kích thước file của nhóm file Log, nhưng từ MySQL 8.0.30 trở đi, hai biến này đã bị loại bỏ (deprecated), dù có được chỉ định thì cũng chỉ dùng để tính giá trị `innodb_redo_log_capacity`. Còn số lượng file của nhóm file Log được cố định là 32, kích thước file là `innodb_redo_log_capacity / 32`.

Về thay đổi này, chúng ta có thể kiểm chứng một chút.

Đầu tiên tạo một file cấu hình, trong đó cấu hình giá trị của `innodb_log_files_in_group` và `innodb_log_file_size`:

```properties
[mysqld]
innodb_log_file_size = 10485760
innodb_log_files_in_group = 64
```

Dùng docker khởi động một Container MySQL 8.0.32:

```bash
docker run -d -p 3312:3309 -e MYSQL_ROOT_PASSWORD=your-password -v /path/to/your/conf:/etc/mysql/conf.d --name
MySQL830 mysql:8.0.32
```

Bây giờ chúng ta xem Log khởi động:

```plain
2023-08-03T02:05:11.720357Z 0 [Warning] [MY-013907] [InnoDB] Deprecated configuration parameters innodb_log_file_size and/or innodb_log_files_in_group have been used to compute innodb_redo_log_capacity=671088640. Please use innodb_redo_log_capacity instead.
```

Ở đây cũng cho thấy hai biến `innodb_log_files_in_group` và `innodb_log_file_size` được dùng để tính `innodb_redo_log_capacity`, và đã bị loại bỏ (deprecated).

Chúng ta xem tiếp số lượng file của nhóm file Log là bao nhiêu:

![](./images/redo-log.png)

Có thể thấy vừa đúng 32 file, và kích thước mỗi file Log là `671088640 / 32 = 20971520`

Vì vậy, khi sử dụng MySQL 8.0.30 trở đi, khuyến nghị dùng biến `innodb_redo_log_capacity` để cấu hình nhóm file Log.

### Tổng kết redo log

Tin rằng mọi người đều đã hiểu tác dụng của redo log cùng thời điểm flush đĩa và hình thức lưu trữ của nó.

Bây giờ chúng ta cùng suy nghĩ một vấn đề: **Chỉ cần mỗi lần flush trực tiếp Data Page đã sửa đổi xuống đĩa là xong, cần redo log làm gì nữa?**

Chẳng phải chúng đều là flush xuống đĩa sao? Khác nhau ở đâu?

```java
1 Byte = 8bit
1 KB = 1024 Byte
1 MB = 1024 KB
1 GB = 1024 MB
1 TB = 1024 GB
```

Thực tế, kích thước Data Page là `16KB`, flush xuống đĩa khá tốn thời gian. Có khi chỉ sửa vài `Byte` dữ liệu trong Data Page, liệu có cần thiết phải flush toàn bộ Data Page xuống đĩa không?

Hơn nữa, việc flush Data Page xuống đĩa là ghi ngẫu nhiên (Random Write), vì vị trí tương ứng của một Data Page có thể nằm ở vị trí ngẫu nhiên trong file trên ổ cứng, nên hiệu năng rất kém.

Nếu ghi redo log, một bản ghi có thể chỉ chiếm vài chục `Byte`, chỉ bao gồm Tablespace ID, Data Page ID, Offset file đĩa, giá trị cập nhật, cộng thêm đây là ghi tuần tự (Sequential Write), nên tốc độ flush xuống đĩa rất nhanh.

Vì vậy, việc ghi nội dung thay đổi dưới dạng redo log có hiệu năng vượt xa cách flush Data Page, điều này cũng giúp khả năng Concurrent (xử lý đồng thời) của Database mạnh hơn.

> Thực ra Data Page trong bộ nhớ ở những thời điểm nhất định cũng sẽ được flush xuống đĩa, chúng ta gọi đó là Page Merge (hợp nhất trang), phần này sẽ được nói kỹ khi trình bày về `Buffer Pool`

## binlog

redo log là Physical Log (Log vật lý), nội dung ghi là "đã thực hiện thay đổi gì trên Data Page nào đó", thuộc về InnoDB Storage Engine.

Còn binlog là Logical Log (Log logic), nội dung ghi là logic nguyên thủy của câu lệnh, kiểu như "cộng thêm 1 vào trường c của dòng có ID=2", thuộc về tầng `MySQL Server`.

Bất kể dùng Storage Engine nào, chỉ cần có cập nhật dữ liệu bảng thì đều sinh ra binlog.

Vậy binlog rốt cuộc dùng để làm gì?

Có thể nói **Backup dữ liệu, Master-Master (chủ-chủ), Master-Slave (chủ-tớ)** của MySQL Database đều không thể thiếu binlog, cần dựa vào binlog để đồng bộ dữ liệu, đảm bảo tính nhất quán dữ liệu.

![](https://oss.javaguide.cn/github/javaguide/01-20220305234724956.png)

binlog ghi lại mọi thao tác logic liên quan đến cập nhật dữ liệu, và là ghi tuần tự.

### Định dạng ghi

binlog có ba định dạng, có thể chỉ định qua tham số `binlog_format`.

- **statement**
- **row**
- **mixed**

Khi chỉ định `statement`, nội dung được ghi là nguyên văn câu lệnh `SQL`. Ví dụ, thực thi câu lệnh `update T set update_time=now() where id=1`, nội dung được ghi như sau.

![](https://oss.javaguide.cn/github/javaguide/02-20220305234738688.png)

Khi đồng bộ dữ liệu, câu lệnh `SQL` đã ghi sẽ được thực thi, nhưng có một vấn đề: `update_time=now()` ở đây sẽ lấy thời gian hệ thống hiện tại, nếu thực thi trực tiếp sẽ dẫn đến dữ liệu không nhất quán với Database gốc.

Để giải quyết vấn đề này, chúng ta cần chỉ định là `row`, nội dung được ghi không còn là câu lệnh `SQL` đơn giản nữa mà còn bao gồm dữ liệu cụ thể của thao tác, nội dung ghi như sau.

![](https://oss.javaguide.cn/github/javaguide/03-20220305234742460.png)

Nội dung ghi của định dạng `row` không nhìn thấy thông tin chi tiết, phải dùng công cụ `mysqlbinlog` để phân tích ra.

`update_time=now()` đã trở thành thời gian cụ thể `update_time=1627112756247`, các giá trị @1, @2, @3 phía sau điều kiện đều là giá trị gốc của trường thứ 1 đến thứ 3 của dòng dữ liệu đó (**giả sử bảng này chỉ có 3 trường**).

Như vậy có thể đảm bảo tính nhất quán khi đồng bộ dữ liệu. Thông thường đều chỉ định là `row`, cách này mang lại độ tin cậy tốt hơn cho việc phục hồi và đồng bộ Database.

Nhưng định dạng này cần dung lượng lớn hơn để ghi, khá tốn không gian, khi phục hồi và đồng bộ sẽ tốn nhiều tài nguyên IO hơn, ảnh hưởng đến tốc độ thực thi.

Vì vậy có một phương án dung hòa, chỉ định là `mixed`, nội dung được ghi là sự kết hợp của hai định dạng trên.

MySQL sẽ phán đoán xem câu lệnh `SQL` này có thể gây ra dữ liệu không nhất quán hay không, nếu có thì dùng định dạng `row`, nếu không thì dùng định dạng `statement`.

### Cơ chế ghi

Thời điểm ghi binlog cũng rất đơn giản: trong quá trình thực thi Transaction, Log được ghi vào `binlog cache` trước, khi Transaction commit thì `binlog cache` mới được ghi vào file binlog.

Vì binlog của một Transaction không thể bị tách rời, bất kể Transaction lớn đến đâu cũng phải đảm bảo ghi một lần duy nhất, nên hệ thống sẽ cấp phát cho mỗi Thread một khối bộ nhớ làm `binlog cache`.

Chúng ta có thể kiểm soát kích thước binlog cache của một Thread đơn lẻ qua tham số `binlog_cache_size`. Nếu nội dung lưu trữ vượt quá tham số này thì phải lưu tạm xuống đĩa (`Swap`).

Quy trình flush binlog xuống đĩa như sau

![](https://oss.javaguide.cn/github/javaguide/04-20220305234747840.png)

- **write trong hình trên là thao tác ghi Log vào page cache của File System, chưa Persistence (ghi bền) dữ liệu xuống đĩa, nên tốc độ khá nhanh**
- **fsync trong hình trên mới là thao tác Persistence dữ liệu xuống đĩa**

Thời điểm của `write` và `fsync` có thể được điều khiển bởi tham số `sync_binlog`, mặc định là `1`.

Khi đặt là `0`, nghĩa là mỗi lần commit Transaction đều chỉ `write`, còn khi nào thực thi `fsync` thì do hệ thống tự quyết định.

![](https://oss.javaguide.cn/github/javaguide/05-20220305234754405.png)

Tuy hiệu năng được nâng cao, nhưng nếu máy downtime, binlog trong `page cache` sẽ bị mất.

Để an toàn, có thể đặt là `1`, nghĩa là mỗi lần commit Transaction đều thực thi `fsync`, giống như **quy trình flush redo log xuống đĩa**.

Cuối cùng còn một cách dung hòa, có thể đặt là `N(N>1)`, nghĩa là mỗi lần commit Transaction đều `write`, nhưng tích lũy đủ `N` Transaction mới `fsync`.

![](https://oss.javaguide.cn/github/javaguide/06-20220305234801592.png)

Trong các tình huống gặp nút thắt IO, đặt `sync_binlog` thành một giá trị tương đối lớn có thể nâng cao hiệu năng.

Tương tự, nếu máy downtime, sẽ mất binlog của `N` Transaction gần nhất.

## Two-Phase Commit (Cam kết hai giai đoạn)

redo log (Redo Log) giúp InnoDB Storage Engine có khả năng Crash Recovery.

binlog (Archive Log) đảm bảo tính nhất quán dữ liệu trong kiến trúc Cluster của MySQL.

Tuy cả hai đều là bảo đảm về mặt Persistence, nhưng trọng tâm khác nhau.

Trong quá trình thực thi câu lệnh cập nhật, cả redo log và binlog đều được ghi. Lấy đơn vị Transaction cơ bản, redo log có thể được ghi liên tục trong quá trình thực thi Transaction, còn binlog chỉ được ghi khi commit Transaction, nên thời điểm ghi của redo log và binlog khác nhau.

![](https://oss.javaguide.cn/github/javaguide/01-20220305234816065.png)

Quay lại chủ đề chính, nếu logic giữa hai loại Log redo log và binlog không nhất quán thì sẽ xảy ra vấn đề gì?

Lấy câu lệnh `update` làm ví dụ, giả sử bản ghi `id=2` có giá trị trường `c` là `0`, cập nhật giá trị trường `c` thành `1`, câu lệnh `SQL` là `update T set c=1 where id=2`.

Giả sử trong quá trình thực thi, sau khi ghi xong redo log thì xảy ra lỗi trong lúc ghi binlog, sẽ xuất hiện tình huống gì?

![](https://oss.javaguide.cn/github/javaguide/02-20220305234828662.png)

Do binlog chưa ghi xong đã gặp lỗi, lúc này trong binlog không có bản ghi thay đổi tương ứng. Vì vậy, sau này khi dùng binlog để phục hồi dữ liệu, sẽ thiếu mất lần cập nhật này, dòng phục hồi ra có giá trị `c` là `0`, còn Database gốc nhờ redo log phục hồi nên dòng này có giá trị `c` là `1`, cuối cùng dữ liệu không nhất quán.

![](https://oss.javaguide.cn/github/javaguide/03-20220305235104445.png)

Để giải quyết vấn đề nhất quán logic giữa hai loại Log, InnoDB Storage Engine sử dụng phương án **Two-Phase Commit (Cam kết hai giai đoạn)**.

Nguyên lý rất đơn giản: tách việc ghi redo log thành hai bước `prepare` và `commit`, đây chính là **Two-Phase Commit**.

![](https://oss.javaguide.cn/github/javaguide/04-20220305234956774.png)

Sau khi sử dụng **Two-Phase Commit**, dù xảy ra lỗi khi ghi binlog cũng không ảnh hưởng gì, vì khi MySQL phục hồi dữ liệu dựa trên redo log, nếu phát hiện redo log vẫn đang ở giai đoạn `prepare` và không có binlog tương ứng, nó sẽ Rollback Transaction đó.

![](https://oss.javaguide.cn/github/javaguide/05-20220305234937243.png)

Xem thêm một tình huống khác: redo log gặp lỗi ở giai đoạn đặt `commit`, vậy Transaction có bị Rollback không?

![](https://oss.javaguide.cn/github/javaguide/06-20220305234907651.png)

Sẽ không Rollback Transaction, nó sẽ thực thi logic được đóng khung trong hình trên. Tuy redo log đang ở giai đoạn `prepare`, nhưng có thể thông qua `id` của Transaction để tìm binlog tương ứng, nên MySQL cho rằng dữ liệu là đầy đủ, sẽ commit Transaction và phục hồi dữ liệu.

## undo log

> Phần nội dung này là phần bổ sung của JavaGuide:

Mọi thay đổi dữ liệu của mỗi Transaction đều được ghi vào undo log. Khi xảy ra lỗi trong quá trình thực thi Transaction hoặc cần thực hiện thao tác Rollback, MySQL có thể dùng undo log để phục hồi dữ liệu về trạng thái trước khi Transaction bắt đầu.

undo log thuộc loại Logical Log, ghi lại câu lệnh SQL. Ví dụ, Transaction thực thi một câu lệnh DELETE thì undo log sẽ ghi một câu lệnh INSERT tương ứng. Đồng thời, thông tin của undo log cũng được ghi vào redo log, vì undo log cũng cần được bảo vệ tính bền vững. Hơn nữa, bản thân undo log sẽ được xóa và dọn dẹp. Ví dụ, thao tác INSERT sau khi Transaction commit có thể được xóa ngay; thao tác UPDATE/DELETE sau khi Transaction commit sẽ không bị xóa ngay mà được đưa vào history list, do Background Thread purge dọn dẹp.

undo log được ghi theo dạng segment (đoạn), mỗi thao tác undo khi ghi sẽ chiếm một **undo log segment** (Undo Log Segment), undo log segment nằm trong **rollback segment** (Rollback Segment). Khi Transaction bắt đầu, cần cấp phát cho nó một rollback segment. Mỗi rollback segment có 1024 undo log segment, điều này giúp quản lý nhu cầu Rollback của nhiều Transaction đồng thời.

Thông thường, **rollback segment header** (thường nằm ở Page đầu tiên của Rollback Segment) chịu trách nhiệm quản lý rollback segment. rollback segment header là một phần của rollback segment, thường nằm ở Page đầu tiên của Rollback Segment. **history list** là một phần của rollback segment header, tác dụng chính của nó là ghi lại undo log của tất cả Transaction đã commit nhưng chưa được dọn dẹp (purge). Danh sách này giúp purge thread tìm được và dọn dẹp những bản ghi undo log không còn cần thiết.

Ngoài ra, việc triển khai `MVCC` phụ thuộc vào: **Hidden Field (trường ẩn), Read View, undo log**. Trong triển khai nội bộ, InnoDB thông qua `DB_TRX_ID` của dòng dữ liệu và `Read View` để phán đoán khả năng hiển thị của dữ liệu; nếu không hiển thị, sẽ thông qua `DB_ROLL_PTR` của dòng dữ liệu để tìm phiên bản lịch sử trong undo log. Mỗi Transaction có thể đọc được phiên bản dữ liệu khác nhau; trong cùng một Transaction, người dùng chỉ có thể nhìn thấy những thay đổi đã commit trước khi Transaction đó tạo `Read View` và những thay đổi do chính Transaction đó thực hiện.

## Tổng kết

> Phần nội dung này là phần bổ sung của JavaGuide:

MySQL InnoDB Engine sử dụng **redo log (Redo Log)** để đảm bảo **tính bền vững** của Transaction, sử dụng **undo log (Rollback Log)** để đảm bảo **tính nguyên tử** của Transaction.

**Backup dữ liệu, Master-Master (chủ-chủ), Master-Slave (chủ-tớ)** của MySQL Database đều không thể thiếu binlog, cần dựa vào binlog để đồng bộ dữ liệu, đảm bảo tính nhất quán dữ liệu.

## Tham khảo

- 《MySQL 实战 45 讲》(45 bài giảng thực chiến MySQL)
- 《从零开始带你成为 MySQL 实战优化高手》(Từ con số không đến cao thủ tối ưu MySQL thực chiến)
- 《MySQL 是怎样运行的：从根儿上理解 MySQL》(MySQL vận hành như thế nào: Hiểu MySQL từ gốc rễ)
- 《MySQL 技术 Innodb 存储引擎》(Công nghệ MySQL: InnoDB Storage Engine)

<!-- @include: @article-footer.snippet.md -->
