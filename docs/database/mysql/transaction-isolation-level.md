---
title: Giải thích chi tiết Transaction Isolation Level trong MySQL
description: Giải thích chi tiết đặc điểm và sự khác biệt của bốn Transaction Isolation Level trong MySQL (Read Uncommitted, Read Committed, Repeatable Read, Serializable), phân tích các vấn đề đồng thời như Dirty Read, Non-repeatable Read, Phantom Read, cùng cách InnoDB giải quyết Phantom Read thông qua MVCC và cơ chế Lock.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MySQL Transaction Isolation Level,Read Uncommitted,Read Committed,Repeatable Read,Serializable,Dirty Read,Non-repeatable Read,Phantom Read,MVCC,Gap Lock
---

> Bài viết này được hoàn thành bởi [SnailClimb](https://github.com/Snailclimb) và [guang19](https://github.com/guang19).

Về phần giới thiệu tổng quan cơ bản của Transaction, hãy xem bài viết này: [Tổng hợp kiến thức & câu hỏi phỏng vấn MySQL thường gặp](./mysql-questions-01.md#MySQL-事务)

## Tổng kết Transaction Isolation Level

Chuẩn SQL định nghĩa bốn Transaction Isolation Level, dùng để cân bằng giữa tính cô lập (Isolation) của Transaction và hiệu năng xử lý đồng thời. Mức càng cao thì tính nhất quán dữ liệu càng tốt, nhưng hiệu năng xử lý đồng thời có thể càng thấp. Bốn mức đó là:

- **READ-UNCOMMITTED (Đọc chưa commit)**: Isolation Level thấp nhất, cho phép đọc các thay đổi dữ liệu chưa được commit, có thể dẫn đến Dirty Read, Phantom Read hoặc Non-repeatable Read. Mức này rất ít được sử dụng trong thực tế vì sự đảm bảo về tính nhất quán dữ liệu quá yếu.
- **READ-COMMITTED (Đọc đã commit)**: cho phép đọc dữ liệu đã commit của các Transaction đồng thời, có thể ngăn Dirty Read, nhưng Phantom Read hoặc Non-repeatable Read vẫn có thể xảy ra. Đây là Isolation Level mặc định của hầu hết các hệ quản trị cơ sở dữ liệu (như Oracle, SQL Server).
- **REPEATABLE-READ (Đọc lặp lại)**: kết quả của nhiều lần đọc trên cùng một trường đều nhất quán, trừ khi dữ liệu bị sửa đổi bởi chính Transaction hiện tại; có thể ngăn Dirty Read và Non-repeatable Read, nhưng Phantom Read vẫn có thể xảy ra. Isolation Level mặc định của MySQL InnoDB Storage Engine chính là REPEATABLE READ. Hơn nữa, ở mức này, InnoDB thông qua cơ chế MVCC (Multi-Version Concurrency Control) và Next-Key Locks (Gap Lock + Record Lock) đã giải quyết vấn đề Phantom Read ở mức độ rất lớn.
- **SERIALIZABLE (Tuần tự hóa)**: Isolation Level cao nhất, tuân thủ hoàn toàn ACID. Tất cả các Transaction được thực thi lần lượt từng cái một, nhờ vậy giữa các Transaction hoàn toàn không thể gây nhiễu lẫn nhau, nghĩa là mức này có thể ngăn Dirty Read, Non-repeatable Read cũng như Phantom Read.

| Isolation Level  | Dirty Read | Non-repeatable Read | Phantom Read            |
| ---------------- | ---------- | ------------------- | ----------------------- |
| READ UNCOMMITTED | √          | √                   | √                       |
| READ COMMITTED   | ×          | √                   | √                       |
| REPEATABLE READ  | ×          | ×                   | √ (chuẩn) / ≈× (InnoDB) |
| SERIALIZABLE     | ×          | ×                   | ×                       |

**Truy vấn mức mặc định:**

Isolation Level mặc định của MySQL InnoDB Storage Engine là **REPEATABLE READ**. Có thể kiểm tra bằng các lệnh sau:

- Trước MySQL 8.0: `SELECT @@tx_isolation;`
- Từ MySQL 8.0 trở đi: `SELECT @@transaction_isolation;`

```bash
mysql> SELECT @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
```

**Cách REPEATABLE READ của InnoDB xử lý Phantom Read:**

Trong định nghĩa Isolation Level của chuẩn SQL, REPEATABLE READ không thể ngăn Phantom Read. Nhưng phần triển khai của InnoDB đã tránh được Phantom Read ở mức độ rất lớn thông qua các cơ chế sau:

- **Snapshot Read**: câu lệnh SELECT thông thường, được thực hiện thông qua cơ chế **MVCC**. Khi Transaction khởi động, một snapshot dữ liệu được tạo ra; các lần Snapshot Read sau đó đều đọc phiên bản dữ liệu này, từ đó tránh nhìn thấy các hàng mới được chèn bởi các Transaction khác (Phantom Read) hoặc các hàng bị sửa đổi (Non-repeatable Read).
- **Current Read**: các thao tác như `SELECT ... FOR UPDATE`, `SELECT ... LOCK IN SHARE MODE`, `INSERT`, `UPDATE`, `DELETE`. InnoDB sử dụng **Next-Key Lock** để khóa các Index Record được quét cùng phạm vi (gap) giữa chúng, ngăn các Transaction khác chèn bản ghi mới vào phạm vi này, từ đó tránh Phantom Read. Next-Key Lock là sự kết hợp của Record Lock và Gap Lock.

Điều đáng chú ý là, mặc dù thường cho rằng Isolation Level càng cao thì tính đồng thời càng kém, nhưng InnoDB Storage Engine đã tối ưu mức REPEATABLE READ thông qua cơ chế MVCC. Đối với nhiều kịch bản chỉ đọc thông thường hoặc đọc nhiều ghi ít, hiệu năng của nó **có thể không khác biệt đáng kể so với READ COMMITTED**. Tuy nhiên, trong các kịch bản ghi nhiều và xung đột đồng thời cao, cơ chế Gap Lock của RR có thể gây ra nhiều chờ khóa hơn so với RC.

Ngoài ra, trong một số kịch bản đặc thù, như Distributed Transaction (XA Transactions) yêu cầu tính nhất quán nghiêm ngặt, InnoDB có thể yêu cầu hoặc khuyến nghị sử dụng Isolation Level SERIALIZABLE để đảm bảo tính nhất quán dữ liệu toàn cục.

Chương 7.7 của cuốn 《MySQL 技术内幕：InnoDB 存储引擎(第 2 版)》viết như sau:

> InnoDB Storage Engine cung cấp hỗ trợ cho XA Transaction, và thông qua XA Transaction để hỗ trợ triển khai Distributed Transaction. Distributed Transaction là loại giao dịch cho phép nhiều tài nguyên giao dịch (transactional resources) độc lập cùng tham gia vào một Transaction toàn cục. Tài nguyên giao dịch thường là hệ quản trị cơ sở dữ liệu quan hệ, nhưng cũng có thể là các loại tài nguyên khác. Transaction toàn cục yêu cầu tất cả các Transaction tham gia trong đó hoặc đều commit, hoặc đều rollback, điều này đặt ra yêu cầu cao hơn đối với các đòi hỏi ACID vốn có của Transaction. Ngoài ra, khi sử dụng Distributed Transaction, Isolation Level của InnoDB Storage Engine phải được đặt thành SERIALIZABLE.

## Demo tình huống thực tế

Dưới đây tôi sẽ sử dụng 2 cửa sổ dòng lệnh MySQL để mô phỏng vấn đề Dirty Read trên cùng một dữ liệu bởi nhiều thread (nhiều Transaction).

Trong cấu hình mặc định của dòng lệnh MySQL, các Transaction đều tự động commit, tức là sau khi thực thi câu lệnh SQL, thao tác COMMIT sẽ được thực hiện ngay. Nếu muốn mở một Transaction một cách tường minh, cần sử dụng lệnh: `START TRANSACTION`.

Chúng ta có thể thiết lập Isolation Level bằng lệnh sau.

```sql
SET [SESSION|GLOBAL] TRANSACTION ISOLATION LEVEL [READ UNCOMMITTED|READ COMMITTED|REPEATABLE READ|SERIALIZABLE]
```

Chúng ta cùng xem lại một số câu lệnh điều khiển đồng thời được sử dụng trong các thao tác thực tế dưới đây:

- `START TRANSACTION` | `BEGIN`: mở một Transaction một cách tường minh.
- `COMMIT`: commit Transaction, làm cho tất cả các sửa đổi đối với cơ sở dữ liệu trở thành vĩnh viễn.
- `ROLLBACK`: rollback sẽ kết thúc Transaction của người dùng và hủy bỏ tất cả các sửa đổi chưa commit đang được thực hiện.

### Dirty Read (Đọc chưa commit)

![](<https://oss.javaguide.cn/github/javaguide/2019-31-1%E8%84%8F%E8%AF%BB(%E8%AF%BB%E6%9C%AA%E6%8F%90%E4%BA%A4)%E5%AE%9E%E4%BE%8B.jpg>)

### Tránh Dirty Read (Đọc đã commit)

![](https://oss.javaguide.cn/github/javaguide/2019-31-2%E8%AF%BB%E5%B7%B2%E6%8F%90%E4%BA%A4%E5%AE%9E%E4%BE%8B.jpg)

### Non-repeatable Read

Vẫn là hình minh họa Read Committed ở trên, tuy đã tránh được Read Uncommitted, nhưng lại xuất hiện trường hợp một Transaction chưa kết thúc mà đã xảy ra vấn đề Non-repeatable Read.

![](https://oss.javaguide.cn/github/javaguide/2019-32-1%E4%B8%8D%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB%E5%AE%9E%E4%BE%8B.jpg)

### Repeatable Read

![](https://oss.javaguide.cn/github/javaguide/2019-33-2%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB.jpg)

### Phantom Read

#### Demo tình huống xuất hiện Phantom Read

![](https://oss.javaguide.cn/github/javaguide/phantom_read.png)

SQL script 1 khi truy vấn lần đầu các bản ghi có lương bằng 500 chỉ có một bản ghi; SQL script 2 chèn thêm một bản ghi có lương bằng 500 rồi commit; sau đó SQL script 1 trong cùng một Transaction sử dụng Current Read để truy vấn lại thì phát hiện xuất hiện hai bản ghi có lương bằng 500 — đây chính là Phantom Read.

Lưu ý: ví dụ này về bản chất là do ngữ nghĩa đọc của lần Snapshot Read đầu tiên và lần Current Read thứ hai khác nhau. Ở mức RR, MVCC có thể đảm bảo Snapshot Read không xảy ra Phantom Read, Next-Key Lock có thể ràng buộc Current Read; nhưng khi trộn lẫn Snapshot Read và Current Read trong cùng một Transaction, kết quả nhìn thấy ở hai lần đọc có thể khác nhau.

#### Cách giải quyết Phantom Read

Có nhiều cách giải quyết Phantom Read, nhưng tư tưởng cốt lõi của chúng là: khi một Transaction đang thao tác dữ liệu của một bảng nào đó, các Transaction khác không được phép thêm mới hoặc xóa dữ liệu trong bảng đó. Các cách giải quyết Phantom Read chủ yếu gồm:

1. Điều chỉnh Isolation Level của Transaction thành `SERIALIZABLE`.
2. Ở Isolation Level Repeatable Read, thêm Table Lock cho bảng mà Transaction đang thao tác.
3. Ở Isolation Level Repeatable Read, thêm `Next-key Lock (Record Lock + Gap Lock)` cho bảng mà Transaction đang thao tác.

### Tham khảo

- 《MySQL 技术内幕：InnoDB 存储引擎》
- <https://dev.MySQL.com/doc/refman/5.7/en/>
- [Mysql Lock: Bảy câu hỏi xoáy vào linh hồn](https://tech.youzan.com/seven-questions-about-the-lock-of-MySQL/)
- [Mối quan hệ giữa Transaction Isolation Level và Lock trong InnoDB](https://tech.meituan.com/2014/08/20/innodb-lock.html)

<!-- @include: @article-footer.snippet.md -->
