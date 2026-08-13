---
title: Tổng hợp các câu hỏi phỏng vấn MySQL thường gặp
description: "Giải thích chi tiết các câu hỏi phỏng vấn MySQL tần suất cao: kiến trúc cơ bản, InnoDB Engine, nguyên lý Index, B+ Tree, Transaction ACID, MVCC, redo/undo/binlog, Row Lock/Table Lock, tối ưu Slow Query — một bài nắm trọn các điểm bắt buộc của kỳ phỏng vấn công ty lớn!"
category: Cơ sở dữ liệu
tag:
  - MySQL
  - Phỏng vấn công ty lớn
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn MySQL,Kiến trúc cơ bản MySQL,InnoDB Storage Engine,MySQL Index,B+ Tree Index,Transaction Isolation Level,redo log,undo log,binlog,MVCC,Row Lock,Tối ưu Slow Query
---

## Nền tảng MySQL

### Cơ sở dữ liệu quan hệ là gì?

Đúng như tên gọi, cơ sở dữ liệu quan hệ (RDB, Relational Database) là loại cơ sở dữ liệu được xây dựng trên nền tảng mô hình quan hệ. Mô hình quan hệ thể hiện mối liên hệ giữa các dữ liệu được lưu trữ trong cơ sở dữ liệu (một-một, một-nhiều, nhiều-nhiều).

Trong cơ sở dữ liệu quan hệ, dữ liệu của chúng ta được lưu trữ trong các bảng khác nhau (ví dụ bảng người dùng), mỗi hàng trong bảng lưu trữ một bản ghi dữ liệu (ví dụ thông tin của một người dùng).

![Mối quan hệ giữa các bảng trong cơ sở dữ liệu quan hệ](https://oss.javaguide.cn/java-guide-blog/5e3c1a71724a38245aa43b02_99bf70d46cc247be878de9d3a88f0c44.png)

Hầu hết các cơ sở dữ liệu quan hệ đều sử dụng SQL để thao tác với dữ liệu trong cơ sở dữ liệu. Và hầu hết các cơ sở dữ liệu quan hệ đều hỗ trợ bốn đặc tính của Transaction (ACID).

**Có những cơ sở dữ liệu quan hệ phổ biến nào?**

MySQL, PostgreSQL, Oracle, SQL Server, SQLite (lưu trữ lịch sử trò chuyện cục bộ của WeChat dùng SQLite) ……

### SQL là gì?

SQL là ngôn ngữ truy vấn có cấu trúc (Structured Query Language), chuyên dùng để làm việc với cơ sở dữ liệu, mục đích là cung cấp một phương pháp đơn giản và hiệu quả để đọc/ghi dữ liệu từ cơ sở dữ liệu.

Gần như tất cả các cơ sở dữ liệu quan hệ chính thống đều hỗ trợ SQL, khả năng áp dụng rất rộng. Hơn nữa, một số cơ sở dữ liệu phi quan hệ cũng tương thích SQL hoặc sử dụng ngôn ngữ truy vấn tương tự SQL.

SQL có thể giúp chúng ta:

- Tạo mới cơ sở dữ liệu, bảng dữ liệu, trường (field);
- Thêm, xóa, sửa, truy vấn dữ liệu trong cơ sở dữ liệu;
- Tạo mới View, hàm, Stored Procedure;
- Thực hiện phân tích dữ liệu đơn giản trên dữ liệu trong cơ sở dữ liệu;
- Kết hợp với Hive, Spark SQL để làm Big Data;
- Kết hợp với SQLFlow để làm Machine Learning;
- ……

### MySQL là gì?

![](https://oss.javaguide.cn/github/javaguide/csdn/20210327143351823.png)

**MySQL là một cơ sở dữ liệu quan hệ, chủ yếu dùng để lưu trữ bền vững (Persistence) một số dữ liệu trong hệ thống của chúng ta, ví dụ như thông tin người dùng.**

Vì MySQL là cơ sở dữ liệu mã nguồn mở, miễn phí và khá trưởng thành, nên MySQL được sử dụng rộng rãi trong đủ loại hệ thống. Bất kỳ ai cũng có thể tải xuống và chỉnh sửa theo nhu cầu cá nhân dưới giấy phép GPL (General Public License). Cổng mặc định của MySQL là **3306**.

### ⭐️MySQL có những ưu điểm gì?

Câu hỏi này thực chất là hỏi về lý do MySQL phổ biến đến vậy.

Thành công của MySQL có thể quy cho lợi thế tổng hợp trên ba phương diện: **hệ sinh thái, tính năng và vận hành**.

**Thứ nhất, xét từ góc độ hệ sinh thái và chi phí, lợi thế cạnh tranh của nó rất sâu.**

- **Mã nguồn mở, miễn phí:** Đây là nền tảng giúp nó phổ biến rộng rãi. Bất kỳ công ty hay cá nhân nào cũng có thể sử dụng miễn phí, giảm đáng kể rào cản kỹ thuật và chi phí ban đầu.
- **Cộng đồng lớn, hệ sinh thái hoàn thiện:** Sau vài chục năm phát triển, MySQL sở hữu cộng đồng cực kỳ năng động và hệ sinh thái phong phú. Điều này có nghĩa là dù bạn gặp vấn đề gì, gần như đều có thể tìm thấy giải pháp trên mạng; đồng thời, tất cả các ngôn ngữ lập trình, framework, công cụ ORM, hệ thống giám sát chính thống trên thị trường đều hỗ trợ MySQL hoàn hảo. Tài liệu của nó cũng rất phong phú, tài nguyên học tập có sẵn khắp nơi.

**Thứ hai, xét về tính năng kỹ thuật cốt lõi, nó rất mạnh mẽ và cân bằng.**

- **Hỗ trợ Transaction mạnh mẽ:** Đây là nền tảng tồn tại của nó với tư cách cơ sở dữ liệu quan hệ. Đáng nói là, Isolation Level mặc định Repeatable Read (REPEATABLE-READ) của InnoDB, thông qua cơ chế MVCC và Next-Key Lock, phần lớn đã tránh được vấn đề Phantom Read, điều mà ở nhiều cơ sở dữ liệu khác cần Isolation Level cao hơn mới làm được, cân bằng cả hiệu năng lẫn tính nhất quán. Giới thiệu chi tiết có thể đọc bài viết này của tác giả: [Giải thích chi tiết Transaction Isolation Level của MySQL](https://javaguide.cn/database/mysql/transaction-isolation-level.html).
- **Hiệu năng và khả năng mở rộng xuất sắc:** Bản thân MySQL đã trải qua thử thách khắc nghiệt của các nghiệp vụ Internet quy mô lớn, hiệu năng đơn máy rất xuất sắc. Quan trọng hơn, xoay quanh mở rộng theo chiều ngang, nó đã hình thành một bộ giải pháp kiến trúc rất trưởng thành, ví dụ như Master-Slave Replication, Read-Write Separation, cũng như chia database chia table thông qua middleware. Điều này giúp nó có thể gánh vác nghiệp vụ ở mọi quy mô từ công ty khởi nghiệp đến nền tảng Internet lớn.

**Thứ ba, xét từ góc độ vận hành và sử dụng, nó rất "thân thiện".**

- **Dùng được ngay, dễ bắt đầu:** So với các cơ sở dữ liệu thương mại lớn như Oracle, việc cài đặt, cấu hình và sử dụng hằng ngày của MySQL đều rất đơn giản, trực quan, đường cong học tập thoải, rất thân thiện với developer và DBA sơ cấp.
- **Chi phí bảo trì thấp:** Nhờ tính đơn giản và cộng đồng lớn, việc tìm kiếm nhân sự vận hành và giải pháp liên quan tương đối dễ dàng, chi phí bảo trì tổng thể cũng thấp hơn.

Đáng nói là trong vài năm gần đây, đà phát triển của PostgreSQL rất mạnh, thậm chí vượt qua MySQL. Trên mạng xuất hiện nhiều bài viết công kích, hạ thấp MySQL, tác giả cho rằng bất kỳ hành vi công kích vô não một bên hoặc tâng bốc quá mức bên nào đều không nên.

Tác giả cũng từng viết một bài chia sẻ quan điểm về hai đại diện của cơ sở dữ liệu quan hệ này, ai quan tâm có thể xem: [MySQL bị đẩy xuống vị trí thứ hai rồi?](https://mp.weixin.qq.com/s/APWD-PzTcTqGUuibAw7GGw).

## Kiểu trường (Field Type) của MySQL

Kiểu trường của MySQL có thể chia đơn giản thành ba nhóm lớn:

- **Kiểu số**: số nguyên (TINYINT, SMALLINT, MEDIUMINT, INT và BIGINT), số thực dấu phẩy động (FLOAT và DOUBLE), số thực dấu phẩy tĩnh (DECIMAL), kiểu dữ liệu bit field (BIT)
- **Kiểu chuỗi**: CHAR, VARCHAR, TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT, BINARY, TINYBLOB, BLOB, MEDIUMBLOB và LONGBLOB, v.v., được dùng nhiều nhất là CHAR và VARCHAR.
- **Kiểu ngày giờ**: YEAR, TIME, DATE, DATETIME và TIMESTAMP, v.v.

Hình dưới đây không phải do tôi vẽ, tôi cũng quên đã lưu từ đâu, nhưng tổng kết khá tốt.

![Tổng kết các kiểu trường thường gặp của MySQL](https://oss.javaguide.cn/github/javaguide/mysql/summary-of-mysql-field-types.png)

Kiểu trường của MySQL khá nhiều, ở đây tôi sẽ chọn một số kiểu trường được sử dụng thường xuyên trong phát triển hằng ngày và hay được hỏi trong phỏng vấn, giới thiệu chi tiết dưới dạng câu hỏi phỏng vấn. Nếu không có ghi chú đặc biệt, tất cả đều áp dụng cho InnoDB Storage Engine.

Ngoài ra, khuyến nghị đọc chương 4 của cuốn "High Performance MySQL (bản thứ ba)", có giới thiệu chi tiết về tối ưu kiểu trường trong MySQL.

### ⭐️Thuộc tính UNSIGNED của kiểu số nguyên dùng để làm gì?

Các kiểu số nguyên trong MySQL có thể sử dụng thuộc tính tùy chọn UNSIGNED để biểu diễn số nguyên không dấu, không cho phép giá trị âm. Sử dụng thuộc tính UNSIGNED có thể tăng gấp đôi giới hạn trên của số nguyên dương, vì không cần lưu giá trị âm.

Ví dụ, phạm vi giá trị của kiểu TINYINT UNSIGNED là 0 ~ 255, trong khi kiểu TINYINT thông thường có phạm vi giá trị là -128 ~ 127. Phạm vi giá trị của kiểu INT UNSIGNED là 0 ~ 4,294,967,295, trong khi kiểu INT thông thường có phạm vi giá trị là -2,147,483,648 ~ 2,147,483,647.

Đối với cột ID tăng dần từ 0, sử dụng thuộc tính UNSIGNED rất phù hợp, vì không cho phép giá trị âm và có giới hạn trên lớn hơn, cung cấp nhiều giá trị ID hơn để sử dụng.

### Sự khác nhau giữa CHAR và VARCHAR là gì?

CHAR và VARCHAR là hai kiểu chuỗi được dùng phổ biến nhất, khác biệt chính giữa chúng là: **CHAR là chuỗi có độ dài cố định, VARCHAR là chuỗi có độ dài thay đổi.**

CHAR khi lưu trữ sẽ đệm thêm dấu cách vào bên phải để đạt độ dài chỉ định, khi truy xuất sẽ bỏ dấu cách đi; VARCHAR khi lưu trữ cần dùng 1 hoặc 2 byte bổ sung để ghi lại độ dài chuỗi, khi truy xuất không cần xử lý gì thêm.

CHAR phù hợp hơn để lưu chuỗi ngắn hoặc chuỗi có độ dài gần như nhau, ví dụ mật khẩu sau khi mã hóa bằng thuật toán Bcrypt, thuật toán MD5, số chứng minh nhân dân. Kiểu VARCHAR phù hợp để lưu chuỗi có độ dài không xác định hoặc chênh lệch lớn, ví dụ biệt danh người dùng, tiêu đề bài viết, v.v.

M trong CHAR(M) và VARCHAR(M) đều đại diện cho số lượng ký tự tối đa có thể lưu, dù là chữ cái, chữ số hay chữ Trung Quốc, mỗi ký tự chỉ chiếm một đơn vị.

### Sự khác nhau giữa VARCHAR(100) và VARCHAR(10) là gì?

VARCHAR(100) và VARCHAR(10) đều là kiểu có độ dài thay đổi, biểu thị khả năng lưu trữ tối đa 100 ký tự và 10 ký tự. Do đó, VARCHAR(100) có thể đáp ứng nhu cầu lưu trữ ký tự phạm vi rộng hơn, có tính mở rộng nghiệp vụ tốt hơn. Còn VARCHAR(10) khi lưu vượt quá 10 ký tự thì phải sửa cấu trúc bảng mới được.

Tuy VARCHAR(100) và VARCHAR(10) có phạm vi ký tự lưu trữ được khác nhau, nhưng khi lưu cùng một chuỗi, dung lượng đĩa chiếm dụng thực tế là như nhau, đây cũng là điểm nhiều người dễ hiểu nhầm.

Tuy nhiên, VARCHAR(100) sẽ tiêu tốn nhiều bộ nhớ hơn. Đó là vì kiểu VARCHAR khi thao tác trong bộ nhớ thường được cấp phát khối bộ nhớ có kích thước cố định để lưu giá trị, tức là dùng độ dài định nghĩa trong kiểu chuỗi. Ví dụ khi sắp xếp, VARCHAR(100) sẽ tính theo độ dài 100, do đó tiêu tốn nhiều bộ nhớ hơn.

### Sự khác nhau giữa DECIMAL và FLOAT/DOUBLE là gì?

Khác biệt giữa DECIMAL và FLOAT là: **DECIMAL là số thực dấu phẩy tĩnh (Fixed-point), FLOAT/DOUBLE là số thực dấu phẩy động (Floating-point). DECIMAL có thể lưu giá trị thập phân chính xác, FLOAT/DOUBLE chỉ có thể lưu giá trị thập phân gần đúng.**

DECIMAL dùng để lưu số thập phân có yêu cầu về độ chính xác, ví dụ dữ liệu liên quan đến tiền tệ, có thể tránh được tổn thất độ chính xác do số thực dấu phẩy động gây ra.

Trong Java, kiểu DECIMAL của MySQL tương ứng với lớp Java `java.math.BigDecimal`.

### Vì sao không khuyến nghị sử dụng TEXT và BLOB?

Kiểu TEXT tương tự CHAR (0-255 byte) và VARCHAR (0-65,535 byte), nhưng có thể lưu chuỗi dài hơn, tức dữ liệu văn bản dài, ví dụ nội dung blog.

| Kiểu       | Kích thước lưu được  | Công dụng                  |
| ---------- | -------------------- | -------------------------- |
| TINYTEXT   | 0-255 byte           | Chuỗi văn bản thông thường |
| TEXT       | 0-65,535 byte        | Chuỗi văn bản dài          |
| MEDIUMTEXT | 0-16,772,150 byte    | Dữ liệu văn bản khá lớn    |
| LONGTEXT   | 0-4,294,967,295 byte | Dữ liệu văn bản cực lớn    |

Kiểu BLOB chủ yếu dùng để lưu đối tượng nhị phân lớn, ví dụ file hình ảnh, âm thanh, video, v.v.

| Kiểu       | Kích thước lưu được | Công dụng                             |
| ---------- | ------------------- | ------------------------------------- |
| TINYBLOB   | 0-255 byte          | Chuỗi nhị phân văn bản ngắn           |
| BLOB       | 0-65KB              | Chuỗi nhị phân                        |
| MEDIUMBLOB | 0-16MB              | Dữ liệu văn bản dài dạng nhị phân     |
| LONGBLOB   | 0-4GB               | Dữ liệu văn bản cực lớn dạng nhị phân |

Trong phát triển hằng ngày, kiểu TEXT ít được sử dụng, nhưng thỉnh thoảng vẫn dùng đến, còn kiểu BLOB thì gần như không dùng. Nếu phạm vi độ dài dự kiến có thể được VARCHAR đáp ứng, khuyến nghị tránh dùng TEXT.

Quy phạm cơ sở dữ liệu thường không khuyến nghị dùng kiểu BLOB và TEXT, hai kiểu này có một số nhược điểm và hạn chế, ví dụ:

- Không thể có giá trị mặc định.
- Khi sử dụng bảng tạm (Temporary Table) không thể dùng bảng tạm trong bộ nhớ, chỉ có thể tạo bảng tạm trên đĩa (sách "High Performance MySQL" có đề cập).
- Hiệu suất truy xuất thấp hơn.
- Không thể tạo Index trực tiếp, cần chỉ định độ dài tiền tố.
- Có thể tiêu tốn nhiều băng thông mạng và IO.
- Có thể làm chậm các thao tác DML trên bảng.
- ……

### ⭐️Sự khác nhau giữa DATETIME và TIMESTAMP là gì? Chọn như thế nào?

Kiểu DATETIME không có thông tin múi giờ, TIMESTAMP thì liên quan đến múi giờ.

TIMESTAMP chỉ cần 4 byte dung lượng lưu trữ, nhưng DATETIME cần tới 8 byte. Tuy nhiên, điều này cũng gây ra một vấn đề: phạm vi thời gian mà Timestamp biểu diễn được nhỏ hơn.

- DATETIME: từ '1000-01-01 00:00:00.000000' đến '9999-12-31 23:59:59.999999'
- Timestamp: từ '1970-01-01 00:00:01.000000' UTC đến '2038-01-19 03:14:07.999999' UTC

Ưu thế cốt lõi của `TIMESTAMP` nằm ở khả năng xử lý múi giờ được tích hợp sẵn. Cơ sở dữ liệu chịu trách nhiệm lưu trữ UTC và tự động chuyển đổi dựa trên múi giờ của phiên (Session), đơn giản hóa việc phát triển ứng dụng cần xử lý đa múi giờ. Nếu ứng dụng cần xử lý đa múi giờ, hoặc muốn cơ sở dữ liệu tự quản lý việc chuyển đổi múi giờ, `TIMESTAMP` là lựa chọn tự nhiên (chú ý giới hạn phạm vi thời gian của nó, tức vấn đề năm 2038).

Nếu kịch bản ứng dụng không liên quan đến chuyển đổi múi giờ, hoặc muốn ứng dụng kiểm soát hoàn toàn logic múi giờ, và cần biểu diễn thời gian sau năm 2038, `DATETIME` là lựa chọn chắc chắn hơn.

Về so sánh chi tiết giữa hai kiểu cũng như khuyến nghị chọn kiểu lưu trữ ngày tháng, hãy tham khảo bài viết này của tôi: [Khuyến nghị lưu trữ dữ liệu thời gian trong MySQL](./some-thoughts-on-database-storage-time.md).

### Sự khác nhau giữa NULL và '' là gì?

`NULL` và `''` (chuỗi rỗng) là hai giá trị hoàn toàn khác nhau, chúng biểu diễn các ý nghĩa khác nhau và có hành vi khác nhau trong cơ sở dữ liệu. `NULL` đại diện cho dữ liệu bị thiếu hoặc chưa biết, còn `''` biểu diễn một chuỗi rỗng đã biết chắc chắn tồn tại. Khác biệt chính của chúng như sau:

1. **Ý nghĩa**:
   - `NULL` đại diện cho một giá trị không xác định, nó không bằng bất kỳ giá trị nào, kể cả chính nó. Do đó, kết quả của `SELECT NULL = NULL` là `NULL`, chứ không phải `true` hay `false`. `NULL` có nghĩa là thông tin bị thiếu hoặc chưa biết. Mặc dù `NULL` không bằng bất kỳ giá trị nào, nhưng trong một số thao tác, hệ thống cơ sở dữ liệu sẽ xử lý các giá trị `NULL` như cùng một nhóm, ví dụ: `DISTINCT`, `GROUP BY`, `ORDER BY`. Cần lưu ý rằng, việc các thao tác này xử lý giá trị `NULL` như cùng một nhóm không có nghĩa là các giá trị `NULL` bằng nhau. Chúng chỉ được xử lý đặc biệt trong các thao tác cụ thể, nhằm đảm bảo tính đúng đắn và nhất quán của kết quả. Cách xử lý này là để thuận tiện cho thao tác dữ liệu, chứ không làm thay đổi ngữ nghĩa của `NULL`.
   - `''` biểu diễn một chuỗi rỗng, nó là một giá trị đã biết.
2. **Dung lượng lưu trữ**:
   - Dung lượng lưu trữ của `NULL` phụ thuộc vào cách cài đặt của cơ sở dữ liệu, thường cần một chút không gian để đánh dấu giá trị này là rỗng.
   - Dung lượng lưu trữ của `''` thường nhỏ hơn, vì nó chỉ lưu cờ đánh dấu chuỗi rỗng, không cần lưu ký tự thực tế.
3. **Phép toán so sánh**:
   - Kết quả so sánh bất kỳ giá trị nào với `NULL` (ví dụ `=`, `!=`, `>`, `<`, v.v.) đều là `NULL`, biểu thị kết quả không xác định. Để xác định một giá trị có phải `NULL` hay không, bắt buộc phải dùng `IS NULL` hoặc `IS NOT NULL`.
   - `''` có thể được so sánh như các chuỗi khác. Ví dụ, kết quả của `'' = ''` là `true`.
4. **Hàm tổng hợp (Aggregate Function)**:
   - Hầu hết các hàm tổng hợp (ví dụ `SUM`, `AVG`, `MIN`, `MAX`) sẽ bỏ qua giá trị `NULL`.
   - `COUNT(*)` sẽ đếm tất cả số hàng, bao gồm cả hàng chứa giá trị `NULL`. `COUNT(tên cột)` sẽ đếm số hàng có giá trị khác `NULL` trong cột chỉ định.
   - Chuỗi rỗng `''` sẽ được tính vào hàm tổng hợp. Ví dụ, `SUM` sẽ coi nó là 0, `MIN` và `MAX` sẽ coi nó là một chuỗi rỗng.

Sau khi đọc phần giới thiệu trên, tin rằng bạn cũng đã có câu trả lời cho một câu hỏi phỏng vấn tần suất cao khác: "Vì sao MySQL không khuyến nghị dùng `NULL` làm giá trị mặc định của cột?"

### ⭐️Kiểu Boolean được biểu diễn như thế nào?

MySQL không có kiểu boolean riêng, `BOOL` và `BOOLEAN` là từ đồng nghĩa của `TINYINT(1)`, thường dùng 0 biểu diễn false, khác 0 biểu diễn true. `BIT(1)` là kiểu bit field, cũng có thể lưu 0 hoặc 1, nhưng nó không phải là ánh xạ thực tế của `BOOL`/`BOOLEAN`.

### ⭐️Lưu số điện thoại bằng INT hay VARCHAR?

Để lưu số điện thoại, **khuyến nghị mạnh mẽ dùng kiểu VARCHAR**, không dùng INT hay BIGINT. Nguyên nhân chính như sau:

1. **Tính tương thích và toàn vẹn định dạng:**
   - Số điện thoại có thể chứa số 0 ở đầu (như mã vùng điện thoại cố định của một số khu vực), tiền tố mã quốc gia ('+'), thậm chí có thể kèm ký tự phân tách ('-' hoặc dấu cách). Các kiểu số như INT hoặc BIGINT sẽ tự động làm mất những thông tin định dạng quan trọng này (ví dụ số 0 ở đầu bị bỏ đi, '+' và '-' không lưu được).
   - VARCHAR có thể lưu nguyên dạng mọi định dạng số, dù là số điện thoại nội địa 11 chữ số hay số quốc tế kèm mã quốc gia, đều tương thích hoàn hảo.
2. **Không dùng cho tính toán số học:** Số điện thoại tuy trông như chữ số, nhưng chúng ta không bao giờ thực hiện phép toán toán học với nó (ví dụ tính tổng, tính trung bình). Về bản chất nó là một định danh (Identifier), giống chuỗi ký tự hơn. Dùng VARCHAR phù hợp với tính chất dữ liệu của nó hơn.
3. **Tính linh hoạt khi truy vấn:**
   - Trong nghiệp vụ thường cần truy vấn theo đoạn số (tiền tố), ví dụ tìm tất cả người dùng có số bắt đầu bằng "138". Dùng kiểu VARCHAR kết hợp với truy vấn SQL như `LIKE '138%'` vừa trực quan vừa hiệu quả.
   - Nếu dùng kiểu số, việc khớp tiền tố tương tự thường cần chuyển đổi bằng hàm phức tạp (như CAST hoặc SUBSTRING), hoặc dùng truy vấn phạm vi (như `WHERE phone >= 13800000000 AND phone < 13900000000`), cách viết vừa rườm rà, vừa có thể không tận dụng được Index, dẫn đến giảm hiệu năng.
4. **Yêu cầu lưu trữ mã hóa (cực kỳ quan trọng):**
   - Vì yêu cầu bảo mật dữ liệu và tuân thủ quyền riêng tư, thông tin cá nhân nhạy cảm như số điện thoại thường bắt buộc phải được lưu trữ mã hóa trong cơ sở dữ liệu.
   - Dữ liệu sau mã hóa (bản mã) là một chuỗi dài (thường gồm chữ cái, chữ số, ký hiệu, hoặc được mã hóa Base64/Hex), kiểu INT hoặc BIGINT hoàn toàn không thể lưu được bản mã này. Chỉ có các kiểu như VARCHAR, TEXT hoặc BLOB mới làm được.

**Về việc chọn độ dài VARCHAR:**

- **Nếu không lưu trữ mã hóa (cực kỳ không khuyến nghị!):** Xét đến số quốc tế và ký tự định dạng có thể có, VARCHAR(20) đến VARCHAR(32) thường là phạm vi an toàn, đủ bao phủ tuyệt đại đa số định dạng số điện thoại trên thế giới. VARCHAR(15) có thể không đủ cho một số số có mã quốc gia và ký tự định dạng.
- **Nếu lưu trữ mã hóa (cách làm chuẩn được khuyến nghị):** Độ dài phải được tính toán và thiết lập chính xác dựa trên độ dài bản mã tối đa mà thuật toán mã hóa tạo ra, cùng phương thức mã hóa có thể dùng (như Base64 làm độ dài tăng khoảng 1/3). Thường sẽ cần độ dài VARCHAR lớn hơn, ví dụ VARCHAR(128), VARCHAR(256) hoặc dài hơn.

Cuối cùng, dùng một bảng để tổng kết:

| Tiêu chí so sánh             | Kiểu VARCHAR (khuyến nghị)                     | Kiểu INT/BIGINT (không khuyến nghị)            | Giải thích/Ghi chú                                                                                                 |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Tương thích định dạng**    | ✔ Lưu được số 0 đầu, "+", "-", dấu cách, v.v. | ✘ Tự động mất số 0 đầu, không lưu được ký hiệu | VARCHAR lưu nguyên dạng mọi định dạng số điện thoại, INT/BIGINT chỉ hỗ trợ số thuần, số 0 đầu sẽ biến mất          |
| **Tính toàn vẹn**            | ✔ Không mất bất kỳ thông tin định dạng nào    | ✘ Mất thông tin định dạng                      | Ví dụ "013800012345" lưu vào INT sẽ thành 13800012345, "+" cũng không lưu được                                     |
| **Không dùng cho tính toán** | ✔ Phù hợp lưu "định danh"                     | ✘ Chỉ phù hợp tính toán số học                 | Số điện thoại bản chất là định danh chuỗi, không tính toán toán học, VARCHAR sát với công dụng thực tế hơn         |
| **Tính linh hoạt truy vấn**  | ✔ Hỗ trợ `LIKE '138%'`, v.v.                  | ✘ Truy vấn tiền tố bất tiện hoặc hiệu năng kém | Dùng VARCHAR có thể truy vấn hiệu quả theo đoạn số/tiền tố, kiểu số cần chuyển sang chuỗi hoặc xử lý phức tạp khác |
| **Hỗ trợ lưu trữ mã hóa**    | ✔ Lưu được bản mã (chữ cái, ký hiệu, v.v.)    | ✘ Không thể lưu bản mã                         | Bản mã sau khi mã hóa số điện thoại là chuỗi/nhị phân, chỉ VARCHAR, TEXT, BLOB, v.v. mới tương thích               |
| **Khuyến nghị độ dài**       | 15~20 (chưa mã hóa), mã hóa thì tùy tình hình  | Không có ý nghĩa                               | Khi không mã hóa VARCHAR(15~20) là phổ biến, sau khi mã hóa độ dài phụ thuộc thuật toán và phương thức mã hóa      |

## Kiến trúc cơ bản của MySQL

> Khuyến nghị đọc kèm bài viết [Quá trình thực thi câu lệnh SQL trong MySQL](./how-sql-executed-in-mysql.md) để hiểu kiến trúc cơ bản của MySQL. Ngoài ra, "luồng thực thi của một câu lệnh SQL trong MySQL" cũng là câu hỏi khá thường gặp trong phỏng vấn.

Hình dưới đây là sơ đồ kiến trúc đơn giản của MySQL, từ hình này bạn có thể thấy rất rõ một câu lệnh SQL từ client được thực thi bên trong MySQL như thế nào.

![](https://oss.javaguide.cn/javaguide/13526879-3037b144ed09eb88.png)

Từ hình trên có thể thấy, MySQL chủ yếu được cấu thành từ các phần sau:

- **Connector (Bộ kết nối):** Liên quan đến xác thực danh tính và quyền (khi đăng nhập vào MySQL).
- **Query Cache (Bộ nhớ đệm truy vấn):** Khi thực thi câu lệnh truy vấn, sẽ truy vấn Cache trước (đã bị loại bỏ từ phiên bản MySQL 8.0, vì tính năng này không mấy hữu dụng).
- **Analyzer (Bộ phân tích):** Nếu không trúng Cache, câu lệnh SQL sẽ đi qua Analyzer, nói đơn giản Analyzer sẽ xem câu lệnh SQL của bạn định làm gì trước, rồi kiểm tra cú pháp câu lệnh SQL có đúng không.
- **Optimizer (Bộ tối ưu):** Thực thi theo phương án mà MySQL cho là tối ưu nhất.
- **Executor (Bộ thực thi):** Thực thi câu lệnh, sau đó nhận dữ liệu trả về từ Storage Engine. Trước khi thực thi câu lệnh sẽ kiểm tra xem có quyền hay không, nếu không có quyền sẽ báo lỗi.
- **Storage Engine dạng plugin**: Chủ yếu chịu trách nhiệm lưu trữ và đọc dữ liệu, sử dụng kiến trúc dạng plugin, hỗ trợ nhiều Storage Engine như InnoDB, MyISAM, Memory, v.v. InnoDB là Storage Engine mặc định của MySQL, trong tuyệt đại đa số kịch bản, dùng InnoDB là lựa chọn tốt nhất.

## Storage Engine của MySQL

Cốt lõi của MySQL nằm ở Storage Engine, muốn học sâu MySQL nhất định phải nghiên cứu kỹ Storage Engine của MySQL.

### MySQL hỗ trợ những Storage Engine nào? Mặc định dùng cái nào?

MySQL hỗ trợ nhiều Storage Engine, bạn có thể dùng lệnh `SHOW ENGINES` để xem tất cả Storage Engine mà MySQL hỗ trợ.

![Xem tất cả Storage Engine mà MySQL cung cấp](https://oss.javaguide.cn/github/javaguide/mysql/image-20220510105408703.png)

Từ hình trên chúng ta có thể thấy, Storage Engine mặc định hiện tại của MySQL là InnoDB. Và trong tất cả các Storage Engine, chỉ có InnoDB là Storage Engine hỗ trợ Transaction, nghĩa là chỉ InnoDB hỗ trợ Transaction.

Phiên bản MySQL tôi dùng ở đây là 8.x, giữa các phiên bản MySQL khác nhau có thể có khác biệt.

Trước MySQL 5.5.5, MyISAM là Storage Engine mặc định của MySQL. Từ phiên bản 5.5.5 trở đi, InnoDB là Storage Engine mặc định của MySQL.

Bạn có thể dùng lệnh `SELECT VERSION()` để xem phiên bản MySQL của mình.

```bash
mysql> SELECT VERSION();
+-----------+
| VERSION() |
+-----------+
| 8.0.27    |
+-----------+
1 row in set (0.00 sec)
```

Bạn cũng có thể dùng lệnh `SHOW VARIABLES LIKE '%storage_engine%'` để xem trực tiếp Storage Engine mặc định hiện tại của MySQL.

```bash
mysql> SHOW VARIABLES  LIKE '%storage_engine%';
+---------------------------------+-----------+
| Variable_name                   | Value     |
+---------------------------------+-----------+
| default_storage_engine          | InnoDB    |
| default_tmp_storage_engine      | InnoDB    |
| disabled_storage_engines        |           |
| internal_tmp_mem_storage_engine | TempTable |
+---------------------------------+-----------+
4 rows in set (0.00 sec)
```

Nếu bạn muốn tìm hiểu sâu từng Storage Engine và sự khác biệt giữa chúng, khuyến nghị đọc phần giới thiệu tương ứng trong tài liệu chính thức của MySQL (phỏng vấn không hỏi chi tiết đến vậy, biết là được):

- Giới thiệu chi tiết InnoDB Storage Engine: <https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html> .
- Giới thiệu chi tiết các Storage Engine khác: <https://dev.mysql.com/doc/refman/8.0/en/storage-engines.html> .

![](https://oss.javaguide.cn/github/javaguide/mysql/image-20220510155143458.png)

### Bạn có biết kiến trúc Storage Engine của MySQL không?

Storage Engine của MySQL sử dụng **kiến trúc dạng plugin**, hỗ trợ nhiều Storage Engine, chúng ta thậm chí có thể thiết lập Storage Engine khác nhau cho từng bảng dữ liệu khác nhau để phù hợp với nhu cầu của từng kịch bản. **Storage Engine dựa trên bảng, chứ không phải dựa trên cơ sở dữ liệu.**

Hình dưới đây thể hiện kiến trúc MySQL với Storage Engine có thể cắm (Pluggable):

![MySQL architecture diagram showing connectors, interfaces, pluggable storage engines, the file system with files and logs.](https://oss.javaguide.cn/github/javaguide/mysql/mysql-architecture.png)

Bạn còn có thể tự viết một Storage Engine của riêng mình dựa trên giao diện chuẩn thực thi Storage Engine mà MySQL định nghĩa. Những Storage Engine không do chính thức cung cấp này có thể gọi là Storage Engine bên thứ ba, phân biệt với Storage Engine chính thức. InnoDB hiện đang được dùng nhiều nhất thực ra ban đầu cũng là một Storage Engine bên thứ ba, sau này vì quá xuất sắc nên đã được Oracle mua lại trực tiếp.

Tài liệu chính thức của MySQL cũng có giới thiệu cách viết một Storage Engine tùy chỉnh, địa chỉ: <https://dev.mysql.com/doc/internals/en/custom-engine.html> .

### ⭐️MyISAM và InnoDB khác nhau ở điểm nào?

Trước MySQL 5.5, MyISAM Engine là Storage Engine mặc định của MySQL, có thể nói là một thời huy hoàng.

Tuy hiệu năng của MyISAM cũng ổn, các tính năng cũng khá tốt (ví dụ Full-text Index, nén, hàm không gian, v.v.). Nhưng MyISAM không hỗ trợ Transaction và Row-level Lock, và khiếm khuyết lớn nhất là không thể khôi phục an toàn sau khi crash.

Từ phiên bản MySQL 5.5 trở đi, InnoDB là Storage Engine mặc định của MySQL.

Vào chủ đề chính! Dưới đây chúng ta cùng so sánh đơn giản hai Engine này:

**1. Có hỗ trợ Row-level Lock không**

MyISAM chỉ có Table-level Lock (table-level locking), còn InnoDB hỗ trợ Row-level Lock (row-level locking) và Table-level Lock, mặc định là Row-level Lock.

Nói cách khác, MyISAM cứ khóa là khóa cả bảng, trong trường hợp ghi đồng thời thì thật ngớ ngẩn! Đây cũng là lý do hiệu năng của InnoDB khi ghi đồng thời tốt hơn nhiều!

**2. Có hỗ trợ Transaction không**

MyISAM không hỗ trợ Transaction.

InnoDB hỗ trợ Transaction, đã cài đặt bốn Isolation Level do chuẩn SQL định nghĩa, có khả năng commit và rollback Transaction. Và Isolation Level REPEATABLE-READ (đọc lặp lại) mà InnoDB dùng mặc định có thể giải quyết vấn đề Phantom Read (dựa trên MVCC và Next-Key Lock).

Về giới thiệu chi tiết Transaction của MySQL, có thể xem bài viết này của tôi: [Giải thích chi tiết Transaction Isolation Level của MySQL](./transaction-isolation-level.md).

**3. Có hỗ trợ Foreign Key không**

MyISAM không hỗ trợ, còn InnoDB hỗ trợ.

Foreign Key rất hữu ích cho việc duy trì tính nhất quán dữ liệu, nhưng có tổn thất nhất định về hiệu năng. Do đó, thông thường chúng tôi không khuyến nghị sử dụng Foreign Key trong dự án sản xuất thực tế, chỉ cần ràng buộc trong code nghiệp vụ là được!

"Java Development Manual" của Alibaba cũng quy định rõ ràng cấm sử dụng Foreign Key.

![](https://oss.javaguide.cn/github/javaguide/mysql/image-20220510090309427.png)

Tuy nhiên, nếu ràng buộc trong code thì yêu cầu năng lực của lập trình viên cao hơn, cụ thể có dùng Foreign Key hay không vẫn phải tùy tình hình thực tế của dự án.

Tổng kết: Nhìn chung chúng tôi cũng không khuyến nghị dùng Foreign Key ở tầng cơ sở dữ liệu, tầng ứng dụng có thể giải quyết được. Tuy nhiên, cách này sẽ đe dọa tính nhất quán của dữ liệu. Có dùng Foreign Key hay không vẫn phải tùy dự án của bạn mà quyết định.

**4. Có hỗ trợ khôi phục an toàn sau khi cơ sở dữ liệu crash bất thường không**

MyISAM không hỗ trợ, còn InnoDB hỗ trợ.

Cơ sở dữ liệu dùng InnoDB sau khi crash bất thường, khi khởi động lại sẽ đảm bảo cơ sở dữ liệu khôi phục về trạng thái trước khi crash. Quá trình khôi phục này phụ thuộc vào `redo log`.

**5. Có hỗ trợ MVCC không**

MyISAM không hỗ trợ, còn InnoDB hỗ trợ.

Nói thật, so sánh này hơi thừa, vì MyISAM đến Row-level Lock còn không hỗ trợ. MVCC có thể xem là phiên bản nâng cấp của Row-level Lock, có thể giảm hiệu quả thao tác khóa, nâng cao hiệu năng.

**6. Cách cài đặt Index khác nhau.**

Tuy MyISAM Engine và InnoDB Engine đều dùng B+Tree làm cấu trúc Index, nhưng cách cài đặt của hai bên không giống nhau.

Trong InnoDB Engine, file dữ liệu của nó chính là file Index. So với MyISAM, nơi file Index và file dữ liệu tách biệt, file dữ liệu bảng của InnoDB bản thân được tổ chức theo cấu trúc Index B+Tree, vùng data của node lá trong cây lưu bản ghi dữ liệu đầy đủ.

Về khác biệt chi tiết, khuyến nghị xem bài viết này của tôi: [Giải thích chi tiết MySQL Index](./mysql-index.md).

**7. Hiệu năng có chênh lệch.**

Hiệu năng của InnoDB mạnh hơn MyISAM, dù ở chế độ đọc-ghi hỗn hợp hay chỉ đọc, khi số nhân CPU tăng lên, khả năng đọc ghi của InnoDB tăng tuyến tính. MyISAM vì đọc ghi không thể đồng thời, khả năng xử lý của nó không liên quan đến số nhân.

![So sánh hiệu năng InnoDB và MyISAM](https://oss.javaguide.cn/github/javaguide/mysql/innodb-myisam-performance-comparison.png)

**8. Chiến lược và cơ chế Cache dữ liệu cài đặt khác nhau.**

InnoDB dùng Buffer Pool để Cache trang dữ liệu và trang Index, MyISAM dùng Key Cache chỉ Cache trang Index mà không Cache trang dữ liệu.

**Tổng kết**:

- InnoDB hỗ trợ khóa cấp hàng (Row-level Lock), MyISAM không hỗ trợ, chỉ hỗ trợ khóa cấp bảng (Table-level Lock).
- MyISAM không hỗ trợ Transaction. InnoDB hỗ trợ Transaction, đã cài đặt bốn Isolation Level do chuẩn SQL định nghĩa.
- MyISAM không hỗ trợ Foreign Key, còn InnoDB hỗ trợ.
- MyISAM không hỗ trợ MVCC, còn InnoDB hỗ trợ.
- Tuy MyISAM Engine và InnoDB Engine đều dùng B+Tree làm cấu trúc Index, nhưng cách cài đặt của hai bên không giống nhau.
- MyISAM không hỗ trợ khôi phục an toàn sau khi cơ sở dữ liệu crash bất thường, còn InnoDB hỗ trợ.
- Hiệu năng của InnoDB mạnh hơn MyISAM.

Cuối cùng, chia sẻ thêm một hình ảnh, hình này so sánh chi tiết một số Storage Engine thường gặp của MySQL.

![So sánh một số Storage Engine thường gặp của MySQL](https://oss.javaguide.cn/github/javaguide/mysql/comparison-of-common-mysql-storage-engines.png)

### Chọn MyISAM và InnoDB như thế nào?

Hầu hết thời gian chúng ta dùng InnoDB Storage Engine, trong một số trường hợp thiên về đọc, dùng MyISAM cũng phù hợp. Tuy nhiên, với điều kiện dự án của bạn không bận tâm việc MyISAM không hỗ trợ Transaction, khôi phục sau crash, v.v. (nhưng~ thường thì chúng ta đều bận tâm mà).

Cuốn "High Performance MySQL" có một đoạn viết như sau:

> Đừng dễ dàng tin vào những kinh nghiệm kiểu như "MyISAM nhanh hơn InnoDB", kết luận này thường không tuyệt đối. Trong nhiều kịch bản chúng ta đã biết, tốc độ của InnoDB có thể bỏ xa MyISAM, đặc biệt là ứng dụng dùng Clustered Index, hoặc dữ liệu cần truy cập đều có thể đặt vào bộ nhớ.

Do đó, với các hệ thống nghiệp vụ phát triển hằng ngày của chúng ta, gần như không tìm được lý do gì để dùng MyISAM, cứ dùng InnoDB mặc định là được!

## ⭐️MySQL Index

Các vấn đề liên quan đến Index của MySQL khá nhiều và cũng cực kỳ quan trọng, giới thiệu chi tiết hơn có thể đọc bài viết này của tác giả: [Giải thích chi tiết MySQL Index](./mysql-index.md) .

### Index là gì?

**Index (chỉ mục) là một cấu trúc dữ liệu dùng để truy vấn và truy xuất dữ liệu nhanh, bản chất của nó có thể xem là một cấu trúc dữ liệu đã được sắp xếp.**

Tác dụng của Index giống như mục lục của cuốn sách. Ví dụ: khi tra từ điển, nếu không có mục lục, chúng ta chỉ có thể lật từng trang để tìm chữ cần tra, tốc độ rất chậm; nếu có mục lục, chúng ta chỉ cần tìm vị trí của chữ trong mục lục trước, sau đó lật thẳng đến trang đó là được.

Cấu trúc dữ liệu bên dưới của Index có rất nhiều loại, cấu trúc Index thường gặp là: B Tree, B+ Tree, Hash và Red-Black Tree. Trong MySQL, dù là InnoDB hay MyISAM, đều sử dụng B+ Tree làm cấu trúc Index.

**Ưu điểm của Index:**

1. **Tốc độ truy vấn tăng vọt (mục đích chính)**: Thông qua Index, cơ sở dữ liệu có thể **giảm đáng kể lượng dữ liệu cần quét**, định vị trực tiếp bản ghi thỏa mãn điều kiện, từ đó tăng tốc độ truy xuất dữ liệu rõ rệt, giảm số lần I/O đĩa.
2. **Đảm bảo tính duy nhất của dữ liệu**: Thông qua việc tạo **Unique Index**, có thể đảm bảo giá trị của một cột (hoặc tổ hợp nhiều cột) trong bảng là duy nhất, ví dụ ID người dùng, email, v.v. Primary Key bản thân nó chính là một loại Unique Index.
3. **Tăng tốc sắp xếp và phân nhóm**: Nếu cột liên quan trong mệnh đề ORDER BY hoặc GROUP BY của truy vấn có Index, cơ sở dữ liệu thường có thể tận dụng trực tiếp đặc tính đã sắp xếp sẵn của Index, tránh thao tác sắp xếp bổ sung, từ đó nâng cao hiệu năng.

**Nhược điểm của Index:**

1. **Tốn thời gian tạo và bảo trì**: Bản thân việc tạo Index cần thời gian, đặc biệt khi thao tác trên bảng lớn. Quan trọng hơn, khi **thêm, xóa, sửa (thao tác DML)** dữ liệu trong bảng, không chỉ thao tác trên dữ liệu, các Index liên quan cũng phải được cập nhật và bảo trì động, điều này sẽ **làm giảm hiệu suất thực thi của các thao tác DML đó**.
2. **Chiếm dung lượng lưu trữ**: Index bản chất cũng là một cấu trúc dữ liệu, cần được lưu trữ dưới dạng file vật lý (hoặc cấu trúc trong bộ nhớ), do đó sẽ **chiếm thêm một phần dung lượng đĩa nhất định**. Index càng nhiều, càng lớn thì dung lượng chiếm càng nhiều.
3. **Có thể bị dùng sai hoặc mất hiệu lực**: Nếu thiết kế Index không hợp lý, hoặc câu truy vấn viết không tốt, Optimizer của cơ sở dữ liệu có thể không chọn sử dụng Index (hoặc chọn sai Index), ngược lại dẫn đến giảm hiệu năng.

**Vậy dùng Index thì nhất định tăng hiệu năng truy vấn không?**

**Không nhất định.** Trong hầu hết trường hợp, sử dụng Index hợp lý quả thực nhanh hơn nhiều so với quét toàn bảng. Nhưng cũng có ngoại lệ:

- **Lượng dữ liệu quá nhỏ**: Nếu dữ liệu trong bảng rất ít (ví dụ chỉ vài trăm dòng), quét toàn bảng có thể nhanh hơn tra qua Index, vì bản thân việc đi qua Index cũng có chi phí.
- **Tỷ lệ tập kết quả truy vấn quá lớn**: Nếu dữ liệu cần truy vấn chiếm phần lớn cả bảng (ví dụ vượt quá 20%-30%), Optimizer có thể cho rằng quét toàn bảng có lợi hơn, vì chi phí nhiều lần quay lại bảng (I/O ngẫu nhiên) qua Index có thể cao hơn một lần quét toàn bảng tuần tự.
- **Index không được bảo trì hoặc thông tin thống kê lỗi thời**: Khiến Optimizer đưa ra phán đoán sai.

### Vì sao Index nhanh?

Lý do cốt lõi khiến Index nhanh là nó **giảm đáng kể số lần I/O đĩa**.

Bản chất của nó là một **cấu trúc dữ liệu đã sắp xếp**, giống như mục lục của cuốn sách, giúp chúng ta không phải lật từng trang (quét toàn bảng).

Trong MySQL, cấu trúc dữ liệu này là **B+ Tree**. Cấu trúc B+ Tree chủ yếu được tối ưu ở hai phương diện:

1. Đặc điểm của B+ Tree là "thấp và béo", một bảng có hàng chục triệu dữ liệu, chiều cao cây Index có thể chỉ 3-4 tầng. Điều này có nghĩa là, nhiều nhất chỉ cần **3-4 lần I/O đĩa**, là có thể định vị chính xác dữ liệu cần tìm, trong khi quét toàn bảng có thể cần hàng nghìn hàng vạn lần, nên tốc độ cực nhanh.
2. Node lá của B+ Tree **được nối với nhau bằng danh sách liên kết**. Sau khi tìm được điểm đầu, có thể men theo danh sách liên kết **đọc tuần tự**, điều này rất thân thiện với đĩa, còn có thể kích hoạt đọc trước (Read-ahead).

### Cấu trúc dữ liệu bên dưới của MySQL Index là gì?

Trong MySQL, MyISAM Engine và InnoDB Engine đều sử dụng B+ Tree làm cấu trúc Index, giới thiệu chi tiết có thể tham khảo bài viết này của tác giả: [Giải thích chi tiết MySQL Index](https://javaguide.cn/database/mysql/mysql-index.html).

### Vì sao InnoDB không dùng Hash làm cấu trúc dữ liệu của Index?

> Tôi phát hiện nhiều ứng viên thậm chí cả người phỏng vấn đều hiểu nhầm câu hỏi này, họ mặc nhiên cho rằng tầng đáy của MySQL không dùng Hash hay B Tree làm cấu trúc dữ liệu của Index.
>
> Thực tế, dù là đặt câu hỏi hay trả lời câu hỏi này đều phải phân biệt rõ Storage Engine. Ví dụ MEMORY Engine hỗ trợ cả Hash và B Tree.

Tầng đáy của Hash Index là bảng Hash (Hash Table). Ưu điểm của nó là, khi thực hiện **truy vấn chính xác theo giá trị bằng nhau**, độ phức tạp thời gian lý thuyết là **O(1)**, tốc độ cực nhanh. Ví dụ `WHERE id = 123`.

Nhưng nó có một số nhược điểm chí mạng đối với cơ sở dữ liệu đa dụng:

1. **Không hỗ trợ truy vấn phạm vi:** Đây là nguyên nhân chủ yếu nhất. Một đặc điểm của hàm Hash là nó ánh xạ các giá trị đầu vào liền kề (ví dụ `id=100` và `id=101`) đến các vị trí hoàn toàn không liền kề trong bảng Hash. Sự phá vỡ thứ tự này khiến chúng ta không thể xử lý các truy vấn phạm vi như `WHERE age > 30` hoặc `BETWEEN 100 AND 200`. Để hoàn thành loại truy vấn này, Hash Index chỉ có thể thoái hóa thành quét toàn bảng.
2. **Không hỗ trợ sắp xếp:** Tương tự, vì giá trị Hash là vô trật tự, nên chúng ta không thể dùng Hash Index để tối ưu mệnh đề `ORDER BY`.
3. **Không hỗ trợ truy vấn theo một phần khóa Index:** Đối với Composite Index, ví dụ `(col1, col2)`, Hash Index bắt buộc phải dùng tất cả các cột Index để truy vấn, nó không thể chỉ dùng riêng `col1` để tăng tốc truy vấn.
4. **Vấn đề xung đột Hash:** Khi các khóa khác nhau tạo ra cùng một giá trị Hash, cần thêm danh sách liên kết hoặc địa chỉ mở (open addressing) để giải quyết, điều này làm giảm hiệu năng.

Vì truy vấn phạm vi và sắp xếp là thao tác cực kỳ phổ biến trong truy vấn cơ sở dữ liệu, một cấu trúc Index không hỗ trợ những tính năng này rõ ràng không thể làm loại Index mặc định, đa dụng.

### Vì sao InnoDB không dùng B Tree làm cấu trúc dữ liệu của Index?

B Tree và B+ Tree đều là cây tìm kiếm cân bằng đa nhánh (multi-way balanced search tree) xuất sắc, rất phù hợp với lưu trữ trên đĩa, vì chúng đều "thấp và béo", có thể tận dụng tối đa mỗi lần I/O đĩa.

Nhưng B+ Tree là phiên bản tăng cường của B Tree, nó có một số tối ưu quan trọng cho kịch bản cơ sở dữ liệu:

1. **Hiệu suất I/O cao hơn:** Trong B+ Tree, chỉ node lá mới lưu dữ liệu (hoặc con trỏ dữ liệu), còn node không phải lá chỉ lưu khóa Index. Vì node không phải lá không lưu dữ liệu, nên chúng có thể chứa nhiều khóa Index hơn. Điều này có nghĩa là "fan-out" (số nhánh) của B+ Tree lớn hơn, với cùng lượng dữ liệu, B+ Tree thường thấp hơn B Tree, cũng có nghĩa là số lần I/O đĩa cần để tìm dữ liệu ít hơn.
2. **Hiệu năng truy vấn ổn định hơn:** Trong B+ Tree, bất kỳ lần truy vấn nào cũng phải đi từ node gốc đến node lá mới tìm được dữ liệu, nên độ dài đường đi truy vấn là cố định. Còn trong B Tree, nếu may mắn, có thể tìm được dữ liệu ngay ở node không phải lá, nhưng không may thì vẫn phải đi đến node lá, điều này khiến hiệu năng truy vấn không ổn định.
3. **Cực kỳ thân thiện với truy vấn phạm vi:** Đây là ưu thế cốt lõi nhất của B+ Tree. Tất cả node lá của nó được nối với nhau bằng danh sách liên kết hai chiều. Khi thực hiện truy vấn phạm vi (ví dụ `WHERE id > 100`), chỉ cần tìm node lá của `id=100` thông qua cấu trúc cây, sau đó có thể men theo danh sách liên kết quét tuần tự về sau, không cần quay ngược lên node tầng trên. Điều này giúp hiệu suất truy vấn phạm vi tăng lên đáng kể.

### Covering Index là gì?

Nếu một Index chứa (hay nói cách khác là phủ) giá trị của tất cả các trường cần truy vấn, chúng ta gọi đó là **Covering Index**.

Trong InnoDB Storage Engine, node lá của Index không phải Primary Key chứa giá trị của Primary Key. Điều này có nghĩa là, khi dùng Index không phải Primary Key để truy vấn, cơ sở dữ liệu sẽ tìm giá trị Primary Key tương ứng trước, sau đó thông qua Primary Key Index để định vị và truy xuất dữ liệu đầy đủ của hàng. Quá trình này được gọi là "quay lại bảng" (Table Lookup).

**Covering Index tức là trường cần truy vấn vừa đúng là trường của Index, khi đó chỉ cần dựa vào Index đó là có thể tra được dữ liệu, không cần quay lại bảng.**

### Hãy giải thích Composite Index của MySQL và nguyên tắc tiền tố trái nhất (Leftmost Prefix)

Dùng nhiều trường trong bảng để tạo Index thì gọi là **Composite Index**, còn gọi là **Combined Index** hoặc **Composite Index (Index phức hợp)**.

Lấy hai trường `score` và `name` tạo Composite Index:

```sql
ALTER TABLE `cus_order` ADD INDEX id_score_name(score, name);
```

Nguyên tắc khớp tiền tố trái nhất chỉ rằng khi sử dụng Composite Index, MySQL sẽ dựa theo thứ tự trường trong Index, từ trái sang phải lần lượt khớp các trường trong điều kiện truy vấn. Nếu điều kiện truy vấn khớp với trường ngoài cùng bên trái của Index, thì MySQL sẽ dùng Index để lọc dữ liệu, như vậy có thể nâng cao hiệu suất truy vấn.

Nguyên tắc khớp trái nhất sẽ tiếp tục khớp sang phải, cho đến khi gặp truy vấn phạm vi (như >, <) thì dừng. Đối với truy vấn phạm vi kiểu >=, <=, BETWEEN và khớp tiền tố LIKE, sẽ không dừng khớp (bài đọc thêm: [Một kết luận sai lầm mà cả mạng đều nói về nguyên tắc khớp trái nhất của Composite Index](https://mp.weixin.qq.com/s/8qemhRg5MgXs1So5YCv0fQ)).

Giả sử có một Composite Index `(column1, column2, column3)`, tất cả tiền tố từ trái sang phải của nó là `(column1)`, `(column1, column2)`, `(column1, column2, column3)` (tạo 1 Composite Index tương đương tạo 3 Index), tất cả truy vấn chứa các cột này đều sẽ đi qua Index mà không quét toàn bảng.

Khi sử dụng Composite Index, chúng ta có thể đặt trường có độ phân biệt cao ở ngoài cùng bên trái, như vậy cũng có thể lọc được nhiều dữ liệu hơn.

Ở đây chúng ta đơn giản minh họa hiệu quả của khớp tiền tố trái nhất.

1. Tạo một bảng tên là `student`, bảng này chỉ có 3 trường `id`, `name`, `class`.

```sql
CREATE TABLE `student` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `class` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name_class_idx` (`name`,`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

2. Dưới đây chúng ta lần lượt kiểm tra ba câu lệnh SQL khác nhau.

![](https://oss.javaguide.cn/github/javaguide/database/mysql/leftmost-prefix-matching-rule.png)

```sql
# Có thể trúng Index
SELECT * FROM student WHERE name = 'Anne Henry';
EXPLAIN SELECT * FROM student WHERE name = 'Anne Henry' AND class = 'lIrm08RYVk';
# Không thể trúng Index
SELECT * FROM student WHERE class = 'lIrm08RYVk';
```

Xem thêm một câu hỏi phỏng vấn thường gặp: nếu có Index `Composite Index (a, b, c)`, truy vấn `a=1 AND c=1` có đi qua Index không? `c=1` thì sao? `b=1 AND c=1` thì sao? `b = 1 AND a = 1 AND c = 1` thì sao?

Đừng vội xem đáp án bên dưới, hãy dành cho mình 3 phút để suy nghĩ.

1. Truy vấn `a=1 AND c=1`: Theo nguyên tắc khớp tiền tố trái nhất, truy vấn có thể dùng phần tiền tố của Index. Do đó, truy vấn này chỉ dùng Index cho `a=1`, sau đó lọc kết quả với `c=1`.
2. Truy vấn `c=1`: Vì truy vấn không chứa cột ngoài cùng bên trái `a`, theo nguyên tắc khớp tiền tố trái nhất, toàn bộ Index không thể được sử dụng.
3. Truy vấn `b=1 AND c=1`: Cùng tình huống với loại thứ hai, toàn bộ Index đều không được dùng.
4. Truy vấn `b=1 AND a=1 AND c=1`: Truy vấn này có thể dùng được Index. Khi Query Optimizer phân tích câu lệnh SQL, đối với Composite Index, sẽ sắp xếp lại các điều kiện truy vấn để dùng được Index. Sẽ sắp xếp lại điều kiện `b=1` và `a=1`, thành `a=1 AND b=1 AND c=1`.

Phiên bản MySQL 8.0.13 đã giới thiệu Index Skip Scan (gọi tắt ISS), nó có thể nâng cao hiệu suất truy vấn trong một số kịch bản truy vấn Index. Trước khi có ISS, truy vấn Composite Index không thỏa mãn nguyên tắc khớp tiền tố trái nhất sẽ thực hiện quét toàn bảng. Còn ISS cho phép MySQL trong một số trường hợp tránh quét toàn bảng, dù điều kiện truy vấn không khớp tiền tố trái nhất. Tuy nhiên, tính năng này khá vô dụng, không thể so với trong Oracle, MySQL 8.0.31 còn báo cáo một bug: [Bug #109145 Using index for skip scan cause incorrect result](https://bugs.mysql.com/bug.php?id=109145) (các phiên bản sau đã sửa). Cá nhân tôi khuyên chỉ cần biết có thứ này là được, không cần đào sâu, dự án thực tế cũng chưa chắc dùng đến.

### SELECT \* có làm Index mất hiệu lực không?

`SELECT *` không trực tiếp làm Index mất hiệu lực (nếu không đi qua Index thì phần lớn là do phạm vi truy vấn trong where quá rộng), nhưng nó có thể gây ra một số vấn đề hiệu năng khác như lãng phí truyền tải mạng và xử lý dữ liệu, không thể dùng Covering Index.

### Những trường nào phù hợp để tạo Index?

- **Trường không có giá trị NULL**: Dữ liệu của trường Index nên cố gắng không là NULL, vì đối với trường có dữ liệu là NULL, cơ sở dữ liệu khó tối ưu. Nếu trường thường xuyên được truy vấn, nhưng không tránh được NULL, khuyến nghị dùng các giá trị ngắn có ngữ nghĩa rõ ràng như 0, 1, true, false để thay thế.
- **Trường được truy vấn thường xuyên**: Trường chúng ta tạo Index nên là trường có thao tác truy vấn rất thường xuyên.
- **Trường được dùng làm điều kiện truy vấn**: Trường được dùng làm điều kiện truy vấn trong WHERE nên được cân nhắc tạo Index.
- **Trường thường xuyên cần sắp xếp**: Index đã được sắp xếp sẵn, như vậy truy vấn có thể tận dụng thứ tự của Index, tăng tốc thời gian truy vấn sắp xếp.
- **Trường thường xuyên được dùng để JOIN**: Trường thường dùng để JOIN có thể là một số cột Foreign Key, đối với cột Foreign Key không nhất thiết phải tạo Foreign Key, chỉ là cột đó liên quan đến mối quan hệ giữa các bảng. Đối với trường thường xuyên được dùng trong truy vấn JOIN, có thể cân nhắc tạo Index, nâng cao hiệu suất truy vấn JOIN nhiều bảng.

### Những nguyên nhân nào khiến Index mất hiệu lực?

1. Đã tạo Composite Index, nhưng điều kiện truy vấn không tuân thủ nguyên tắc khớp trái nhất;
2. Thực hiện tính toán, hàm, chuyển đổi kiểu, v.v. trên cột có Index;
3. Truy vấn LIKE bắt đầu bằng % ví dụ `LIKE '%abc';`;
4. Điều kiện truy vấn dùng OR, và trong điều kiện trước sau của OR có một cột không có Index, các Index liên quan đều sẽ không được dùng;
5. Khi phạm vi giá trị của IN khá lớn sẽ khiến Index mất hiệu lực, chuyển sang quét toàn bảng (kịch bản mất hiệu lực của NOT IN và IN giống nhau);
6. Xảy ra [chuyển đổi ngầm (Implicit Conversion)](https://javaguide.cn/database/mysql/index-invalidation-caused-by-implicit-conversion.html "Chuyển đổi ngầm");

## Query Cache của MySQL

Query Cache của MySQL là Cache kết quả truy vấn. Khi thực thi câu lệnh truy vấn, sẽ tra Cache trước, nếu trong Cache có kết quả truy vấn tương ứng, sẽ trả về trực tiếp.

Thêm cấu hình sau vào `my.cnf`, khởi động lại MySQL để bật Query Cache

```properties
query_cache_type=1
query_cache_size=600000
```

MySQL thực thi các lệnh sau cũng có thể bật Query Cache

```properties
set global  query_cache_type=1;
set global  query_cache_size=600000;
```

Query Cache sẽ trả về trực tiếp kết quả trong Cache khi điều kiện truy vấn và dữ liệu giống nhau. Nhưng cần lưu ý, điều kiện khớp của Query Cache rất nghiêm ngặt, bất kỳ khác biệt nhỏ nào cũng khiến Cache không trúng. Điều kiện truy vấn ở đây bao gồm bản thân câu truy vấn, cơ sở dữ liệu đang dùng hiện tại, và các yếu tố khác có thể ảnh hưởng đến kết quả, như phiên bản giao thức client, v.v.

**Các trường hợp Query Cache không trúng:**

1. Bất kỳ sự khác nhau về ký tự nào giữa hai truy vấn đều khiến Cache không trúng.
2. Nếu truy vấn chứa bất kỳ hàm do người dùng tự định nghĩa, Stored Function, biến người dùng, bảng tạm, bảng hệ thống trong database MySQL nào, kết quả truy vấn của nó cũng sẽ không được Cache.
3. Sau khi Cache được thiết lập, hệ thống Query Cache của MySQL sẽ theo dõi từng bảng liên quan trong truy vấn, nếu các bảng này (dữ liệu hoặc cấu trúc) thay đổi, thì tất cả dữ liệu Cache liên quan đến bảng đó đều sẽ mất hiệu lực.

**Cache tuy có thể nâng cao hiệu suất truy vấn của cơ sở dữ liệu, nhưng Cache đồng thời cũng mang lại chi phí bổ sung, sau mỗi lần truy vấn đều phải thực hiện một thao tác Cache, sau khi mất hiệu lực còn phải hủy.** Do đó, bật Query Cache cần thận trọng, đặc biệt với các ứng dụng thiên về ghi. Nếu bật, cần chú ý kiểm soát hợp lý kích thước không gian Cache, thông thường kích thước đặt ở vài chục MB là phù hợp. Ngoài ra, còn có thể dùng `sql_cache` và `sql_no_cache` để kiểm soát câu truy vấn nào đó có cần Cache hay không:

```sql
SELECT sql_no_cache COUNT(*) FROM usr;
```

Từ MySQL 5.6, Query Cache đã bị vô hiệu hóa mặc định. Từ MySQL 8.0, đã không còn hỗ trợ Query Cache (cụ thể có thể tham khảo bài viết này: [MySQL 8.0: Retiring Support for the Query Cache](https://dev.mysql.com/blog-archive/mysql-8-0-retiring-support-for-the-query-cache/)).

![MySQL 8.0: Retiring Support for the Query Cache](https://oss.javaguide.cn/github/javaguide/mysql/mysql8.0-retiring-support-for-the-query-cache.png)

## ⭐️MySQL Log

Đáp án của các câu hỏi trên có thể tìm thấy trong **「Phần câu hỏi phỏng vấn kỹ thuật」** của [《Java Interview Guide》(trả phí, nhấn link để nhận voucher)](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html).

![Phần câu hỏi phỏng vấn kỹ thuật của 《Java Interview Guide》](https://oss.javaguide.cn/javamianshizhibei/technical-interview-questions.png)

Địa chỉ bài viết: <https://www.yuque.com/snailclimb/mf2z3k/zr4kfk> (lấy mật khẩu: <https://t.zsxq.com/avfM0>).

## ⭐️MySQL Transaction

### Transaction là gì?

Chúng ta hãy tưởng tượng một kịch bản, trong đó cần chèn nhiều dữ liệu liên quan vào cơ sở dữ liệu, không may là quá trình này có thể gặp những vấn đề sau:

- Cơ sở dữ liệu đột ngột bị treo giữa chừng vì lý do nào đó.
- Client đột ngột không kết nối được cơ sở dữ liệu vì lý do mạng.
- Khi truy cập cơ sở dữ liệu đồng thời, nhiều thread cùng ghi vào cơ sở dữ liệu, ghi đè lên thay đổi của nhau.
- ……

Bất kỳ vấn đề nào ở trên đều có thể dẫn đến dữ liệu không nhất quán. Để đảm bảo tính nhất quán của dữ liệu, hệ thống phải có khả năng xử lý những vấn đề này. Transaction chính là cơ chế ưu tiên được trừu tượng hóa để đơn giản hóa những vấn đề này. Khái niệm Transaction bắt nguồn từ cơ sở dữ liệu, hiện tại đã trở thành một khái niệm khá rộng.

**Transaction là gì?** Tóm gọn trong một câu, **Transaction là một nhóm thao tác về mặt logic, hoặc là tất cả đều được thực thi, hoặc là tất cả đều không được thực thi.**

Ví dụ kinh điển nhất của Transaction và thường được đem ra nói đến là chuyển tiền. Giả sử Tiểu Minh muốn chuyển cho Tiểu Hồng 1000 đồng, việc chuyển tiền này liên quan đến hai thao tác quan trọng, hai thao tác này bắt buộc phải cùng thành công hoặc cùng thất bại.

1. Giảm số dư của Tiểu Minh 1000 đồng
2. Tăng số dư của Tiểu Hồng 1000 đồng.

Transaction sẽ xem hai thao tác này như một thể thống nhất về mặt logic, thể thống nhất này chứa các thao tác hoặc đều thành công, hoặc đều thất bại. Như vậy sẽ không xuất hiện tình huống số dư của Tiểu Minh giảm mà số dư của Tiểu Hồng lại không tăng.

![Sơ đồ minh họa Transaction](https://oss.javaguide.cn/github/javaguide/mysql/%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

### Database Transaction là gì?

Trong hầu hết trường hợp, khi chúng ta nói về Transaction, nếu không chỉ rõ là **Distributed Transaction**, thì thường là nói đến **Database Transaction**.

Database Transaction là thứ chúng ta tiếp xúc nhiều nhất trong phát triển hằng ngày. Nếu dự án của bạn thuộc kiến trúc monolith, thì thứ bạn tiếp xúc thường chính là Database Transaction.

**Vậy Database Transaction có tác dụng gì?**

Nói đơn giản, Database Transaction có thể đảm bảo nhiều thao tác với cơ sở dữ liệu (tức là các câu lệnh SQL) cấu thành một thể thống nhất về mặt logic. Các thao tác cơ sở dữ liệu cấu thành thể thống nhất logic này tuân theo: **hoặc là tất cả thực thi thành công, hoặc là tất cả không thực thi**.

```sql
# Bắt đầu một Transaction
START TRANSACTION;
# Nhiều câu lệnh SQL
SQL1,SQL2...
## Commit Transaction
COMMIT;
```

![Sơ đồ minh họa Database Transaction](https://oss.javaguide.cn/github/javaguide/mysql/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

Ngoài ra, Transaction của cơ sở dữ liệu quan hệ (ví dụ: `MySQL`, `SQL Server`, `Oracle`, v.v.) đều có đặc tính **ACID**:

![ACID](https://oss.javaguide.cn/github/javaguide/mysql/ACID.png)

1. **Atomicity (Tính nguyên tử)** (`Atomicity`): Transaction là đơn vị thực thi nhỏ nhất, không cho phép chia nhỏ. Tính nguyên tử của Transaction đảm bảo các hành động hoặc là hoàn thành tất cả, hoặc là hoàn toàn không có tác dụng gì;
2. **Consistency (Tính nhất quán)** (`Consistency`): Trước và sau khi thực thi Transaction, dữ liệu phải nhất quán, ví dụ trong nghiệp vụ chuyển tiền, dù Transaction thành công hay không, tổng số tiền của người chuyển và người nhận phải không đổi;
3. **Isolation (Tính cô lập)** (`Isolation`): Khi truy cập cơ sở dữ liệu đồng thời, Transaction của một người dùng không bị các Transaction khác can thiệp, giữa các Transaction đồng thời, cơ sở dữ liệu là độc lập;
4. **Durability (Tính bền vững)** (`Durability`): Sau khi một Transaction được commit, thay đổi của nó đối với dữ liệu trong cơ sở dữ liệu là bền vững, dù cơ sở dữ liệu gặp sự cố cũng không bị ảnh hưởng.

🌈 Ở đây cần bổ sung thêm một điểm: **Chỉ khi đảm bảo được Durability, Atomicity, Isolation của Transaction, thì Consistency mới được đảm bảo. Nói cách khác A, I, D là phương tiện, C là mục đích!** Chắc hẳn mọi người cũng giống tôi, bị khái niệm ACID này đánh lừa rất lâu! Tôi cũng nhờ xem khóa học công khai [《Software Architecture Course của Zhou Zhiming》](https://time.geekbang.org/opencourse/intro/100064201) của thầy Zhou Zhiming mới hiểu rõ (hãy đọc nhiều sách hay!!!).

![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID-%3EC.png)

Ngoài ra, tác giả của DDIA tức là cuốn [《Designing Data-Intensive Application (Thiết kế hệ thống ứng dụng dữ liệu chuyên sâu)》](https://book.douban.com/subject/30329536/) đã nói trong cuốn sách của mình như sau:

> Atomicity, isolation, and durability are properties of the database, whereas consis‐
> tency (in the ACID sense) is a property of the application. The application may rely
> on the database’s atomicity and isolation properties in order to achieve consistency,
> but it’s not up to the database alone.
>
> Dịch ra có nghĩa là: Atomicity, Isolation và Durability là thuộc tính của cơ sở dữ liệu, còn Consistency (theo nghĩa ACID) là thuộc tính của ứng dụng. Ứng dụng có thể dựa vào thuộc tính Atomicity và Isolation của cơ sở dữ liệu để đạt được Consistency, nhưng điều này không chỉ phụ thuộc vào cơ sở dữ liệu. Do đó, chữ C không thuộc về ACID.

Cuốn sách 《Designing Data-Intensive Application (Thiết kế hệ thống ứng dụng dữ liệu chuyên sâu)》này rất đáng đọc, đáng đọc nhiều lần! Trên Douban có gần 90% người đọc xong cuốn sách này đã đánh giá 5 sao. Ngoài ra, bản dịch tiếng Trung đã được mở nguồn trên GitHub, địa chỉ: [https://github.com/Vonng/ddia](https://github.com/Vonng/ddia) .

![](https://oss.javaguide.cn/github/javaguide/books/ddia.png)

### Transaction đồng thời gây ra những vấn đề gì?

Trong ứng dụng điển hình, nhiều Transaction chạy đồng thời, thường xuyên thao tác trên cùng dữ liệu để hoàn thành nhiệm vụ riêng (nhiều người dùng thao tác trên cùng một dữ liệu). Đồng thời tuy là cần thiết, nhưng có thể dẫn đến những vấn đề sau.

#### Dirty Read (Đọc bẩn)

Một Transaction đọc dữ liệu và sửa đổi dữ liệu đó, sửa đổi này có thể nhìn thấy được đối với các Transaction khác, dù Transaction hiện tại chưa commit. Lúc này một Transaction khác đọc dữ liệu chưa commit này, nhưng Transaction đầu tiên đột ngột rollback, khiến dữ liệu không được commit vào cơ sở dữ liệu, vậy dữ liệu mà Transaction thứ hai đọc được chính là dữ liệu bẩn, đây cũng là nguồn gốc của Dirty Read.

Ví dụ: Transaction 1 đọc dữ liệu A=20 trong một bảng nào đó, Transaction 1 sửa A=A-1, Transaction 2 đọc được A = 19, Transaction 1 rollback khiến sửa đổi trên A không được commit vào cơ sở dữ liệu, giá trị của A vẫn là 20.

![Dirty Read](https://oss.javaguide.cn/github/javaguide/database/mysql/concurrency-consistency-issues-dirty-reading.png)

#### Lost Update (Mất cập nhật)

Khi một Transaction đang đọc một dữ liệu, một Transaction khác cũng truy cập dữ liệu đó, vậy thì sau khi Transaction đầu tiên sửa dữ liệu này, Transaction thứ hai cũng sửa dữ liệu này. Như vậy kết quả sửa đổi trong Transaction đầu tiên bị mất, do đó gọi là Lost Update.

Ví dụ: Transaction 1 đọc dữ liệu A=20 trong một bảng nào đó, Transaction 2 cũng đọc A=20, Transaction 1 sửa A=A-1 trước, Transaction 2 sau đó cũng sửa A=A-1, kết quả cuối cùng A=19, sửa đổi của Transaction 1 bị mất.

![Lost Update](https://oss.javaguide.cn/github/javaguide/database/mysql/concurrency-consistency-issues-missing-modifications.png)

#### Unrepeatable Read (Đọc không lặp lại)

Chỉ việc đọc cùng một dữ liệu nhiều lần trong một Transaction. Khi Transaction này chưa kết thúc, một Transaction khác cũng truy cập dữ liệu đó. Vậy thì, giữa hai lần đọc dữ liệu trong Transaction đầu tiên, do sửa đổi của Transaction thứ hai khiến dữ liệu đọc được hai lần có thể không giống nhau. Đây chính là tình huống dữ liệu đọc được hai lần trong một Transaction không giống nhau, do đó gọi là Unrepeatable Read.

Ví dụ: Transaction 1 đọc dữ liệu A=20 trong một bảng nào đó, Transaction 2 cũng đọc A=20, Transaction 1 sửa A=A-1, Transaction 2 đọc lại A =19, lúc này kết quả đọc khác với kết quả đọc lần đầu.

![Unrepeatable Read](https://oss.javaguide.cn/github/javaguide/database/mysql/concurrency-consistency-issues-unrepeatable-read.png)

#### Phantom Read (Đọc bóng ma)

Phantom Read tương tự Unrepeatable Read. Nó xảy ra khi một Transaction đọc một vài hàng dữ liệu, sau đó một Transaction đồng thời khác chèn thêm một số dữ liệu. Trong truy vấn sau đó, Transaction đầu tiên sẽ phát hiện thêm một số bản ghi vốn không tồn tại, giống như xảy ra ảo giác, nên gọi là Phantom Read.

Ví dụ: Transaction 2 đọc dữ liệu trong một phạm vi nào đó, Transaction 1 chèn dữ liệu mới vào phạm vi này, Transaction 2 đọc lại dữ liệu trong phạm vi này phát hiện so với kết quả đọc lần đầu có thêm dữ liệu mới.

![Phantom Read](https://oss.javaguide.cn/github/javaguide/database/mysql/concurrency-consistency-issues-phantom-read.png)

### Unrepeatable Read và Phantom Read khác nhau ở điểm nào?

- Unrepeatable Read: Trong cùng một Transaction, cùng một bản ghi bị Transaction khác sửa hoặc xóa, khiến việc đọc lại thấy nội dung hoặc sự tồn tại của bản ghi thay đổi.
- Phantom Read: Trong cùng một Transaction, cùng một điều kiện phạm vi khi thực thi nhiều lần, tập bản ghi thỏa mãn điều kiện thay đổi, xuất hiện bản ghi thêm mới hoặc biến mất.

Phantom Read thực ra có thể xem là một trường hợp đặc biệt của Unrepeatable Read, lý do chủ yếu tách riêng Phantom Read ra là vì giải pháp giải quyết Phantom Read và Unrepeatable Read khác nhau.

Ví dụ: Khi thực thi thao tác `delete` và `update`, có thể khóa trực tiếp bản ghi, đảm bảo an toàn cho Transaction. Còn khi thực thi thao tác `insert`, vì Record Lock chỉ có thể khóa bản ghi đã tồn tại, để tránh chèn bản ghi mới, cần dựa vào Gap Lock. Nghĩa là khi thực thi thao tác `insert` cần dựa vào Next-Key Lock (Record Lock+Gap Lock) để khóa nhằm đảm bảo không xuất hiện Phantom Read.

### Có những phương thức kiểm soát Transaction đồng thời nào?

Phương thức kiểm soát Transaction đồng thời trong MySQL chỉ có hai loại: **Lock** và **MVCC**. Lock có thể xem là chế độ kiểm soát bi quan, Multiversion Concurrency Control (MVCC, Kiểm soát đồng thời đa phiên bản) có thể xem là chế độ kiểm soát lạc quan.

Trong phương thức kiểm soát bằng **Lock**, dùng Lock để kiểm soát rõ ràng tài nguyên chia sẻ chứ không phải thông qua biện pháp điều phối, trong MySQL chủ yếu thông qua **Read-Write Lock** để thực hiện kiểm soát đồng thời.

- **Shared Lock (Khóa S)**: Còn gọi là Read Lock, Transaction khi đọc bản ghi sẽ lấy Shared Lock, cho phép nhiều Transaction cùng lấy (Lock tương thích).
- **Exclusive Lock (Khóa X)**: Còn gọi là Write Lock/Exclusive Lock, Transaction khi sửa bản ghi sẽ lấy Exclusive Lock, không cho phép nhiều Transaction cùng lấy. Nếu một bản ghi đã bị khóa bằng Exclusive Lock, thì Transaction khác không thể thêm bất kỳ loại Lock nào lên bản ghi này (Lock không tương thích).

Read-Write Lock có thể thực hiện đọc-đọc song song, nhưng không thể thực hiện ghi-đọc, ghi-ghi song song. Ngoài ra, tùy theo Lock Granularity (độ hạt của khóa) khác nhau, lại được chia thành **Table-level Lock (table-level locking)** và **Row-level Lock (row-level locking)**. InnoDB không chỉ hỗ trợ Table-level Lock, còn hỗ trợ Row-level Lock, mặc định là Row-level Lock. Row-level Lock có độ hạt nhỏ hơn, chỉ cần khóa bản ghi liên quan (khóa một hoặc nhiều hàng bản ghi), nên đối với thao tác ghi đồng thời, hiệu năng của InnoDB cao hơn. Dù là Table-level Lock hay Row-level Lock, đều tồn tại hai loại Shared Lock (Share Lock, khóa S) và Exclusive Lock (Exclusive Lock, khóa X).

**MVCC** là phương pháp kiểm soát đồng thời đa phiên bản, tức là lưu nhiều phiên bản cho một dữ liệu, thông qua tính khả kiến của Transaction để đảm bảo Transaction nhìn được phiên bản mà nó nên thấy. Thường có một bộ cấp phát phiên bản toàn cục để đặt số phiên bản cho mỗi hàng dữ liệu, số phiên bản là duy nhất.

Phương tiện mà MVCC dựa vào để cài đặt trong MySQL chủ yếu là: **trường ẩn, read view, undo log**.

- undo log: undo log dùng để ghi lại nhiều phiên bản dữ liệu của một hàng dữ liệu nào đó.
- read view và trường ẩn: dùng để phán đoán tính khả kiến của dữ liệu phiên bản hiện tại.

Về cài đặt cụ thể MVCC của InnoDB có thể xem bài viết này: [Cài đặt MVCC của InnoDB Storage Engine](./innodb-implementation-of-mvcc.md) .

### Chuẩn SQL định nghĩa những Transaction Isolation Level nào?

Chuẩn SQL định nghĩa bốn Transaction Isolation Level, dùng để cân bằng giữa Isolation của Transaction và hiệu năng đồng thời. Level càng cao, tính nhất quán dữ liệu càng tốt, nhưng hiệu năng đồng thời có thể càng thấp. Bốn level này là:

- **READ-UNCOMMITTED (Đọc chưa commit)**: Isolation Level thấp nhất, cho phép đọc thay đổi dữ liệu chưa được commit, có thể dẫn đến Dirty Read, Phantom Read hoặc Unrepeatable Read. Level này trong thực tế rất ít được sử dụng, vì nó đảm bảo tính nhất quán dữ liệu quá yếu.
- **READ-COMMITTED (Đọc đã commit)**: Cho phép đọc dữ liệu đã commit của Transaction đồng thời, có thể ngăn Dirty Read, nhưng Phantom Read hoặc Unrepeatable Read vẫn có thể xảy ra. Đây là Isolation Level mặc định của hầu hết cơ sở dữ liệu (như Oracle, SQL Server).
- **REPEATABLE-READ (Đọc lặp lại)**: Kết quả đọc nhiều lần đối với cùng một trường đều nhất quán, trừ khi dữ liệu bị chính Transaction của mình sửa đổi, có thể ngăn Dirty Read và Unrepeatable Read, nhưng Phantom Read vẫn có thể xảy ra. Isolation Level mặc định của MySQL InnoDB Storage Engine chính là REPEATABLE READ. Và InnoDB ở level này thông qua cơ chế MVCC (Multiversion Concurrency Control) và Next-Key Locks (Gap Lock+Row Lock), phần lớn đã giải quyết vấn đề Phantom Read.
- **SERIALIZABLE (Tuần tự hóa)**: Isolation Level cao nhất, hoàn toàn tuân thủ ACID. Tất cả Transaction lần lượt thực thi từng cái một, như vậy giữa các Transaction hoàn toàn không thể can thiệp lẫn nhau, nghĩa là level này có thể ngăn Dirty Read, Unrepeatable Read và Phantom Read.

| Isolation Level  | Dirty Read | Unrepeatable Read (Non-Repeatable Read) | Phantom Read            |
| ---------------- | ---------- | --------------------------------------- | ----------------------- |
| READ UNCOMMITTED | √          | √                                       | √                       |
| READ COMMITTED   | ×          | √                                       | √                       |
| REPEATABLE READ  | ×          | ×                                       | √ (chuẩn) / ≈× (InnoDB) |
| SERIALIZABLE     | ×          | ×                                       | ×                       |

### Isolation Level mặc định của MySQL là gì?

Isolation Level mặc định của MySQL InnoDB Storage Engine là **REPEATABLE READ**. Có thể xem bằng các lệnh sau:

- Trước MySQL 8.0: `SELECT @@tx_isolation;`
- Từ MySQL 8.0 trở đi: `SELECT @@transaction_isolation;`

```sql
mysql> SELECT @@tx_isolation;
+-----------------+
| @@tx_isolation  |
+-----------------+
| REPEATABLE-READ |
+-----------------+
```

Về giới thiệu chi tiết Transaction Isolation Level của MySQL, có thể xem bài viết này của tôi: [Giải thích chi tiết Transaction Isolation Level của MySQL](./transaction-isolation-level.md).

### Isolation Level của MySQL có được cài đặt dựa trên Lock không?

Isolation Level của MySQL được cài đặt dựa trên Lock và cơ chế MVCC cùng nhau.

Isolation Level SERIALIZABLE được cài đặt bằng Lock, Isolation Level READ-COMMITTED và REPEATABLE-READ được cài đặt dựa trên MVCC. Tuy nhiên, các Isolation Level khác ngoài SERIALIZABLE cũng có thể cần dùng đến cơ chế Lock, ví dụ REPEATABLE-READ trong trường hợp Current Read cần dùng đọc có khóa để đảm bảo không xuất hiện Phantom Read.

## MySQL Lock

Lock là một phương thức kiểm soát Transaction đồng thời thường gặp.

### Bạn có biết Table-level Lock và Row-level Lock không? Khác nhau ở điểm nào?

MyISAM chỉ hỗ trợ Table-level Lock (table-level locking), cứ khóa là khóa cả bảng, trong trường hợp ghi đồng thời thì hiệu năng rất kém. InnoDB không chỉ hỗ trợ Table-level Lock (table-level locking), còn hỗ trợ Row-level Lock (row-level locking), mặc định là Row-level Lock.

Row-level Lock có độ hạt nhỏ hơn, chỉ cần khóa bản ghi liên quan (khóa một hoặc nhiều hàng bản ghi), nên đối với thao tác ghi đồng thời, hiệu năng của InnoDB cao hơn.

**So sánh Table-level Lock và Row-level Lock**:

- **Table-level Lock:** Loại Lock có độ hạt khóa lớn nhất trong MySQL (ngoại trừ Global Lock), là Lock được thêm lên trường không có Index, khóa toàn bộ bảng đang thao tác hiện tại, cài đặt đơn giản, tiêu tốn tài nguyên cũng ít, khóa nhanh, không xuất hiện Deadlock. Tuy nhiên, xác suất xảy ra xung đột Lock cao nhất, hiệu suất dưới tải đồng thời cao cực thấp. Table-level Lock không liên quan đến Storage Engine, MyISAM và InnoDB Engine đều hỗ trợ Table-level Lock.
- **Row-level Lock:** Loại Lock có độ hạt khóa nhỏ nhất trong MySQL, là **Lock được thêm lên trường có Index**, chỉ khóa bản ghi hàng đang thao tác hiện tại. Row-level Lock có thể giảm đáng kể xung đột trong thao tác cơ sở dữ liệu. Độ hạt khóa của nó nhỏ nhất, mức độ đồng thời cao, nhưng chi phí khóa cũng lớn nhất, khóa chậm, sẽ xuất hiện Deadlock. Row-level Lock liên quan đến Storage Engine, được cài đặt ở tầng Storage Engine.

### Khi sử dụng Row-level Lock cần lưu ý điều gì?

Row Lock của InnoDB là Lock được thêm lên trường có Index, Table-level Lock là Lock được thêm lên trường không có Index. Khi thực thi câu lệnh `UPDATE`, `DELETE`, nếu trường trong điều kiện `WHERE` không trúng Unique Index hoặc Index mất hiệu lực, sẽ dẫn đến quét toàn bảng và khóa tất cả bản ghi hàng trong bảng. Điều này trong phát triển công việc hằng ngày của chúng ta thường gặp, nhất định phải chú ý nhiều!!!

Tuy nhiên, nhiều lúc dù đã dùng Index cũng có thể vẫn đi quét toàn bảng, đây là do Optimizer của MySQL.

### InnoDB có mấy loại Row Lock?

Row Lock của InnoDB được thực hiện bằng cách khóa bản ghi trên trang dữ liệu Index, MySQL InnoDB hỗ trợ ba cách khóa hàng:

- **Record Lock**: Lock thuộc về một bản ghi hàng đơn lẻ.
- **Gap Lock**: Khóa một phạm vi, không bao gồm bản ghi.
- **Next-Key Lock**: Record Lock+Gap Lock, khóa một phạm vi, bao gồm bản ghi, mục đích chủ yếu là để giải quyết vấn đề Phantom Read (đã đề cập ở phần Transaction của MySQL). Record Lock chỉ có thể khóa bản ghi đã tồn tại, để tránh chèn bản ghi mới, cần dựa vào Gap Lock.

**Ở Isolation Level mặc định REPEATABLE-READ của InnoDB, Row Lock mặc định dùng Next-Key Lock. Nhưng nếu Index đang thao tác là Unique Index hoặc Primary Key, InnoDB sẽ tối ưu Next-Key Lock, hạ cấp nó thành Record Lock, tức là chỉ khóa bản thân Index, chứ không phải phạm vi.**

### Shared Lock và Exclusive Lock thì sao?

Dù là Table-level Lock hay Row-level Lock, đều tồn tại hai loại Shared Lock (Share Lock, khóa S) và Exclusive Lock (Exclusive Lock, khóa X):

- **Shared Lock (khóa S)**: Còn gọi là Read Lock, Transaction khi đọc bản ghi sẽ lấy Shared Lock, cho phép nhiều Transaction cùng lấy (Lock tương thích).
- **Exclusive Lock (khóa X)**: Còn gọi là Write Lock/Exclusive Lock, Transaction khi sửa bản ghi sẽ lấy Exclusive Lock, không cho phép nhiều Transaction cùng lấy. Nếu một bản ghi đã bị khóa bằng Exclusive Lock, thì Transaction khác không thể thêm bất kỳ loại Lock nào lên Transaction này (Lock không tương thích).

Exclusive Lock không tương thích với bất kỳ Lock nào, Shared Lock chỉ tương thích với Shared Lock.

|        | Khóa S         | Khóa X   |
| :----- | :------------- | :------- |
| Khóa S | Không xung đột | Xung đột |
| Khóa X | Xung đột       | Xung đột |

Do sự tồn tại của MVCC, đối với câu lệnh `SELECT` thông thường, InnoDB sẽ không thêm bất kỳ Lock nào. Tuy nhiên, bạn có thể thêm rõ ràng Shared Lock hoặc Exclusive Lock bằng các câu lệnh sau.

```sql
# Shared Lock có thể dùng trong MySQL 5.7 và MySQL 8.0
SELECT ... LOCK IN SHARE MODE;
# Shared Lock có thể dùng trong MySQL 8.0
SELECT ... FOR SHARE;
# Exclusive Lock
SELECT ... FOR UPDATE;
```

### Intention Lock có tác dụng gì?

Nếu cần dùng đến Table Lock, làm sao để phán đoán bản ghi trong bảng không có Row Lock, việc duyệt từng hàng chắc chắn không được, hiệu năng quá kém. Chúng ta cần dùng đến một thứ gọi là Intention Lock để nhanh chóng phán đoán có thể dùng Table Lock lên một bảng nào đó hay không.

Intention Lock là Table-level Lock, có hai loại:

- **Intention Shared Lock (IS Lock)**: Transaction có ý định thêm Shared Lock (khóa S) lên một số bản ghi trong bảng, trước khi thêm Shared Lock bắt buộc phải lấy IS Lock của bảng đó trước.
- **Intention Exclusive Lock (IX Lock)**: Transaction có ý định thêm Exclusive Lock (khóa X) lên một số bản ghi trong bảng, trước khi thêm Exclusive Lock bắt buộc phải lấy IX Lock của bảng đó trước.

**Intention Lock do Data Engine tự duy trì, người dùng không thể thao tác thủ công Intention Lock, trước khi thêm Shared/Exclusive Lock cho hàng dữ liệu, InnoDB sẽ lấy Intention Lock tương ứng của bảng chứa hàng dữ liệu đó trước.**

Giữa các Intention Lock với nhau là tương thích lẫn nhau.

|         | Khóa IS     | Khóa IX     |
| ------- | ----------- | ----------- |
| Khóa IS | Tương thích | Tương thích |
| Khóa IX | Tương thích | Tương thích |

Intention Lock và Shared Lock cũng như Exclusive Lock loại trừ lẫn nhau (ở đây chỉ Shared Lock và Exclusive Lock cấp bảng, Intention Lock không loại trừ với Shared Lock và Exclusive Lock cấp hàng).

|        | Khóa IS     | Khóa IX  |
| ------ | ----------- | -------- |
| Khóa S | Tương thích | Loại trừ |
| Khóa X | Loại trừ    | Loại trừ |

Mô tả tương ứng trong cuốn sách "MySQL Technology Insider InnoDB Storage Engine" có lẽ là lỗi đánh máy.

![](https://oss.javaguide.cn/github/javaguide/mysql/image-20220511171419081.png)

### Current Read và Snapshot Read khác nhau ở điểm nào?

**Snapshot Read** (đọc nhất quán không khóa) chính là câu lệnh `SELECT` đơn thuần, nhưng không bao gồm hai loại câu lệnh `SELECT` dưới đây:

```sql
SELECT ... FOR UPDATE
# Shared Lock có thể dùng trong MySQL 5.7 và MySQL 8.0
SELECT ... LOCK IN SHARE MODE;
# Shared Lock có thể dùng trong MySQL 8.0
SELECT ... FOR SHARE;
```

Snapshot tức là phiên bản lịch sử của bản ghi, mỗi hàng bản ghi có thể tồn tại nhiều phiên bản lịch sử (kỹ thuật đa phiên bản).

Trong trường hợp Snapshot Read, nếu bản ghi đang đọc đang thực thi thao tác UPDATE/DELETE, thao tác đọc sẽ không vì thế mà chờ giải phóng X Lock trên bản ghi, mà sẽ đọc một Snapshot của hàng.

Chỉ ở Transaction Isolation Level RC (Read Committed) và RR (Repeatable Read), InnoDB mới dùng đọc nhất quán không khóa:

- Ở level RC, đối với dữ liệu Snapshot, đọc nhất quán không khóa luôn đọc dữ liệu Snapshot mới nhất của hàng bị khóa.
- Ở level RR, đối với dữ liệu Snapshot, đọc nhất quán không khóa luôn đọc phiên bản dữ liệu hàng tại thời điểm Transaction này bắt đầu.

Snapshot Read khá phù hợp với kịch bản nghiệp vụ có yêu cầu nhất quán dữ liệu không quá cao và theo đuổi hiệu năng cực cao.

**Current Read** (đọc nhất quán có khóa) chính là thêm X Lock hoặc S Lock cho bản ghi hàng.

Một số loại câu lệnh SQL thường gặp của Current Read như sau:

```sql
# Thêm một X Lock cho bản ghi đang đọc
SELECT...FOR UPDATE
# Thêm một S Lock cho bản ghi đang đọc
SELECT...LOCK IN SHARE MODE
# Thêm một S Lock cho bản ghi đang đọc
SELECT...FOR SHARE
# Thêm một X Lock cho bản ghi đang sửa đổi
INSERT...
UPDATE...
DELETE...
```

### Bạn có biết Auto-increment Lock không?

> Một kiến thức không quá quan trọng, chỉ cần tìm hiểu đơn giản là được.

Khi thiết kế bảng trong cơ sở dữ liệu quan hệ, thường sẽ có một cột làm Primary Key tự tăng. Primary Key tự tăng trong InnoDB sẽ liên quan đến một loại Table-level Lock khá đặc biệt — **Auto-increment Lock (AUTO-INC Locks)**.

```sql
CREATE TABLE `sequence_id` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `stub` CHAR(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `stub` (`stub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Nói chính xác hơn, không chỉ Primary Key tự tăng, cột `AUTO_INCREMENT` đều sẽ liên quan đến Auto-increment Lock, vì trường không phải Primary Key cũng có thể đặt tự tăng.

Nếu một Transaction đang chèn dữ liệu vào bảng có cột tự tăng, sẽ lấy Auto-increment Lock trước, không lấy được thì có thể bị chặn. Hành vi chặn ở đây chỉ là một trong những hành vi của Auto-increment Lock, có thể hiểu Auto-increment Lock là một giao diện, cài đặt cụ thể của nó có nhiều loại. Hạng mục cấu hình cụ thể là `innodb_autoinc_lock_mode` (giới thiệu từ MySQL 5.1.22), các giá trị có thể chọn như sau:

| innodb_autoinc_lock_mode | Giới thiệu                                 |
| :----------------------- | :----------------------------------------- |
| 0                        | Chế độ truyền thống                        |
| 1                        | Chế độ liên tục (mặc định trước MySQL 8.0) |
| 2                        | Chế độ xen kẽ (mặc định từ MySQL 8.0)      |

Trong chế độ xen kẽ, tất cả câu lệnh "INSERT-LIKE" (tất cả câu lệnh chèn, bao gồm: `INSERT`, `REPLACE`, `INSERT…SELECT`, `REPLACE…SELECT`, `LOAD DATA`, v.v.) đều không dùng Table-level Lock, mà dùng cài đặt Mutex Lock hạng nhẹ, nhiều câu lệnh chèn có thể thực thi đồng thời, tốc độ nhanh hơn, khả năng mở rộng cũng tốt hơn.

Tuy nhiên, nếu cơ sở dữ liệu MySQL của bạn có nhu cầu đồng bộ Master-Slave và định dạng lưu trữ Binlog là Statement, đừng đặt chế độ Auto-increment Lock của InnoDB thành chế độ xen kẽ, nếu không sẽ có vấn đề nhất quán dữ liệu. Đó là vì trong tình huống đồng thời, thứ tự thực thi của câu lệnh chèn không được đảm bảo.

> Nếu MySQL dùng định dạng Statement, thì đồng bộ Master-Slave của MySQL thực tế đồng bộ từng câu lệnh SQL một.

Cuối cùng, giới thiệu thêm một bài viết: [Vì sao Primary Key tự tăng của MySQL không đơn điệu cũng không liên tục](https://draveness.me/whys-the-design-mysql-auto-increment/) .

## ⭐️Tối ưu hiệu năng MySQL

Về tổng kết các khuyến nghị tối ưu hiệu năng MySQL, hãy xem bài viết này: [Tổng kết khuyến nghị quy phạm tối ưu hiệu năng cao MySQL](./mysql-high-performance-optimization-specification-recommendations.md) .

### Có thể dùng MySQL lưu trữ file trực tiếp (ví dụ hình ảnh) không?

Có thể thì có thể, chỉ cần lưu dữ liệu nhị phân tương ứng của file trực tiếp là được. Tuy nhiên, vẫn khuyến nghị không nên lưu file trong cơ sở dữ liệu, sẽ ảnh hưởng nghiêm trọng đến hiệu năng cơ sở dữ liệu, tiêu tốn quá nhiều dung lượng lưu trữ.

Có thể chọn dùng dịch vụ lưu trữ file dùng được ngay do các nhà cung cấp dịch vụ đám mây cung cấp, trưởng thành ổn định, giá cũng khá thấp.

![](https://oss.javaguide.cn/github/javaguide/mysql/oss-search.png)

Cũng có thể chọn tự xây dựng dịch vụ lưu trữ file, thực hiện cũng không khó, dựa trên các dự án mã nguồn mở như FastDFS, MinIO (khuyến nghị), v.v. là có thể thực hiện dịch vụ file phân tán.

**Cơ sở dữ liệu chỉ lưu thông tin địa chỉ file, file do dịch vụ lưu trữ file chịu trách nhiệm lưu trữ.**

### MySQL lưu trữ địa chỉ IP như thế nào?

Có thể chuyển đổi địa chỉ IP thành dữ liệu kiểu số nguyên để lưu trữ, hiệu năng tốt hơn, chiếm dung lượng cũng nhỏ hơn.

MySQL cung cấp hai phương thức để xử lý địa chỉ IP

- `INET_ATON()`: chuyển IP thành số nguyên không dấu (4-8 byte)
- `INET_NTOA()`: chuyển IP kiểu số nguyên thành địa chỉ

Trước khi chèn dữ liệu, dùng `INET_ATON()` để chuyển địa chỉ IP thành số nguyên trước, khi hiển thị dữ liệu, dùng `INET_NTOA()` để chuyển IP kiểu số nguyên thành địa chỉ hiển thị là được.

### Có những phương tiện tối ưu SQL thường gặp nào?

**「Phần câu hỏi phỏng vấn kỹ thuật」** của [《Java Interview Guide》(trả phí)](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) có một bài viết giới thiệu chi tiết các phương tiện tối ưu SQL thường gặp, rất toàn diện, rõ ràng dễ hiểu!

![Các phương tiện tối ưu SQL thường gặp](https://oss.javaguide.cn/javamianshizhibei/javamianshizhibei-sql-optimization.png)

Địa chỉ bài viết: https://www.yuque.com/snailclimb/mf2z3k/abc2sv (lấy mật khẩu: <https://t.zsxq.com/avfM0>).

### Phân tích hiệu năng SQL như thế nào?

Chúng ta có thể dùng lệnh `EXPLAIN` để phân tích **Execution Plan (kế hoạch thực thi)** của SQL. Execution Plan là cách thực thi cụ thể của một câu lệnh SQL sau khi được Query Optimizer của MySQL tối ưu.

`EXPLAIN` không thực sự thực thi câu lệnh liên quan, mà thông qua **Query Optimizer** để phân tích câu lệnh, tìm ra phương án truy vấn tối ưu nhất, và hiển thị thông tin tương ứng.

`EXPLAIN` áp dụng cho câu lệnh `SELECT`, `DELETE`, `INSERT`, `REPLACE` và `UPDATE`, chúng ta thường phân tích truy vấn `SELECT` nhiều hơn.

Ở đây chúng ta đơn giản minh họa cách dùng `EXPLAIN`.

Định dạng đầu ra của `EXPLAIN` như sau:

```sql
mysql> EXPLAIN SELECT `score`,`name` FROM `cus_order` ORDER BY `score` DESC;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra          |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
|  1 | SIMPLE      | cus_order | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 997572 |   100.00 | Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
1 row in set, 1 warning (0.00 sec)
```

Ý nghĩa của từng trường như sau:

| **Tên cột**   | **Ý nghĩa**                                                               |
| ------------- | ------------------------------------------------------------------------- |
| id            | Định danh chuỗi của truy vấn SELECT                                       |
| select_type   | Loại truy vấn tương ứng với từ khóa SELECT                                |
| table         | Tên bảng được dùng                                                        |
| partitions    | Partition khớp, đối với bảng không phân vùng, giá trị là NULL             |
| type          | Phương thức truy cập bảng                                                 |
| possible_keys | Index có thể được dùng                                                    |
| key           | Index thực tế được dùng                                                   |
| key_len       | Độ dài của Index được chọn                                                |
| ref           | Khi dùng truy vấn bằng nhau qua Index, cột hoặc hằng số so sánh với Index |
| rows          | Số hàng dự kiến đọc                                                       |
| filtered      | Tỷ lệ phần trăm bản ghi còn lại sau khi lọc theo điều kiện bảng           |
| Extra         | Thông tin bổ sung                                                         |

Vì giới hạn độ dài, ở đây tôi chỉ giới thiệu đơn giản về Execution Plan của MySQL, giới thiệu chi tiết hãy xem bài viết: [Execution Plan của SQL](./mysql-query-execution-plan.md).

### Bạn có biết Read-Write Separation và chia database chia table không?

Các vấn đề liên quan đến Read-Write Separation và chia database chia table khá nhiều, vì vậy, tôi đã viết riêng một bài để giới thiệu: [Giải thích chi tiết Read-Write Separation và chia database chia table](../../high-performance/read-and-write-separation-and-library-subtable.md).

### Tối ưu Deep Pagination (phân trang sâu) như thế nào?

[Giới thiệu Deep Pagination và khuyến nghị tối ưu](../../high-performance/deep-pagination-optimization.md)

### Tách dữ liệu nóng-lạnh (Data Cold-Hot Separation) như thế nào?

[Giải thích chi tiết tách dữ liệu nóng-lạnh](../../high-performance/data-cold-hot-separation.md)

### Tối ưu hiệu năng MySQL như thế nào?

Tối ưu hiệu năng MySQL là một công trình mang tính hệ thống, liên quan đến nhiều phương diện, trong phỏng vấn không thể trình bày hết mọi mặt. Do đó, khuyến nghị triển khai theo hướng "điểm-đường-mặt", bắt đầu từ vấn đề cốt lõi, sau đó mở rộng dần, thể hiện chiều sâu suy nghĩ và khả năng giải quyết vấn đề của bạn.

**1. Nắm bắt cốt lõi: Định vị và phân tích Slow SQL**

Bước đầu tiên của tối ưu hiệu năng luôn là tìm ra nút thắt cổ chai. Khi phỏng vấn, khuyến nghị bắt đầu từ **định vị và phân tích Slow SQL**, điều này không chỉ thể hiện tư duy giải quyết vấn đề của bạn, còn thể hiện sự thành thạo của bạn đối với giám sát hiệu năng cơ sở dữ liệu:

- **Công cụ giám sát:** Giới thiệu các công cụ giám sát Slow SQL thường dùng, như **Slow Query Log của MySQL**, **Performance Schema**, v.v., nói rõ mức độ quen thuộc của bạn với các công cụ này và cách định vị vấn đề thông qua chúng.
- **Lệnh EXPLAIN:** Nói rõ cách dùng lệnh `EXPLAIN`, phân tích Query Plan, tình trạng sử dụng Index, có thể kết hợp trường hợp thực tế để thể hiện cách đọc kết quả phân tích, ví dụ thứ tự thực thi, tình trạng sử dụng Index, quét toàn bảng, v.v.

**2. Từ điểm đến mặt: Index, cấu trúc bảng và tối ưu SQL**

Sau khi định vị được Slow SQL, tiếp theo là tối ưu cho vấn đề cụ thể. Ở đây có thể trọng tâm giới thiệu các kỹ thuật tối ưu về Index, cấu trúc bảng và quy phạm viết SQL:

- **Tối ưu Index:** Đây là trọng điểm của tối ưu hiệu năng MySQL, có thể giới thiệu nguyên tắc tạo Index, Covering Index, nguyên tắc khớp tiền tố trái nhất, v.v. Nếu có thể kết hợp ứng dụng thực tế trong dự án của bạn để nói cách chọn Index phù hợp, sẽ được cộng thêm điểm.
- **Tối ưu cấu trúc bảng:** Tối ưu thiết kế cấu trúc bảng, bao gồm chọn kiểu trường phù hợp, tránh trường dư thừa, sử dụng hợp lý thiết kế chuẩn hóa và phi chuẩn hóa, v.v.
- **Tối ưu SQL:** Tránh dùng `SELECT *`, cố gắng dùng trường cụ thể, dùng truy vấn JOIN thay Subquery, sử dụng hợp lý truy vấn phân trang, thao tác hàng loạt, v.v., đều là những chi tiết cần chú ý trong quá trình viết SQL.

**3. Phương án nâng cao: Tối ưu kiến trúc**

Khi người phỏng vấn khá hài lòng với kiến thức tối ưu cơ bản, có thể thảo luận sâu hơn về một số phương án tối ưu tầng kiến trúc. Dưới đây là một số chiến lược tối ưu kiến trúc thường gặp:

- **Read-Write Separation:** Tách thao tác đọc và thao tác ghi sang các instance cơ sở dữ liệu khác nhau, nâng cao khả năng xử lý đồng thời của cơ sở dữ liệu.
- **Chia database chia table:** Phân tán dữ liệu sang nhiều instance cơ sở dữ liệu hoặc bảng dữ liệu, giảm lượng dữ liệu đơn bảng, nâng cao hiệu suất truy vấn. Nhưng cần cân nhắc tính phức tạp và chi phí bảo trì mà nó mang lại, sử dụng thận trọng.
- **Tách dữ liệu nóng-lạnh**: Dựa trên tần suất truy cập dữ liệu và tầm quan trọng nghiệp vụ, chia dữ liệu thành dữ liệu lạnh và dữ liệu nóng, dữ liệu lạnh thường lưu trữ trong môi trường chi phí thấp, hiệu năng thấp, dữ liệu nóng lưu trữ trong môi trường lưu trữ hiệu năng cao.
- **Cơ chế Cache:** Dùng middleware Cache như Redis, v.v., Cache dữ liệu nóng vào bộ nhớ, giảm áp lực cơ sở dữ liệu. Cách này rất thường dùng, hiệu quả nâng cao rất rõ ràng, tỷ lệ hiệu quả/chi phí cực cao!

**4. Các phương tiện tối ưu khác**

Ngoài định vị Slow SQL, tối ưu Index và tối ưu kiến trúc, còn có thể đề cập đến một số phương tiện tối ưu khác, thể hiện hiểu biết toàn diện của bạn về tinh chỉnh hiệu năng MySQL:

- **Cấu hình Connection Pool:** Cấu hình Connection Pool cơ sở dữ liệu hợp lý (như **kích thước Connection Pool**, **thời gian timeout**, v.v.), có thể nâng cao hiệu quả kết nối cơ sở dữ liệu, tránh chi phí kết nối thường xuyên.
- **Cấu hình phần cứng:** Nâng cao hiệu năng phần cứng cũng là một trong những phương tiện tối ưu quan trọng. Dùng server hiệu năng cao, tăng bộ nhớ, dùng ổ cứng **SSD**, v.v. nâng cấp phần cứng, đều có thể nâng cao hiệu năng tổng thể của cơ sở dữ liệu một cách hiệu quả.

**5. Tổng kết**

Trong phỏng vấn, khuyến nghị lần lượt giới thiệu theo thứ tự ưu tiên: định vị Slow SQL, [tối ưu Index](./mysql-index.md), thiết kế cấu trúc bảng và [tối ưu SQL](../../high-performance/sql-optimization.md), v.v. Tối ưu tầng kiến trúc, như [Read-Write Separation và chia database chia table](../../high-performance/read-and-write-separation-and-library-subtable.md), [tách dữ liệu nóng-lạnh](../../high-performance/data-cold-hot-separation.md) nên dùng làm phương tiện cuối cùng, trừ khi có nút thắt cổ chai hiệu năng rõ ràng trong kịch bản cụ thể, nếu không không nên dễ dàng sử dụng, vì tính phức tạp mà nó đưa vào sẽ mang lại chi phí bảo trì bổ sung.

## Tài liệu học MySQL khuyến nghị

[**Sách khuyến nghị**](../../books/database.md#mysql) .

**Bài viết khuyến nghị** :

- [Loạt bài hướng dẫn MySQL của Nhất Thụ Nhất Khê](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3NTc3NjM4Nw==&action=getalbum&album_id=2372043523518300162&scene=173&from_msgid=2247484308&from_itemidx=1&count=3&nolastread=1#wechat_redirect)
- [Loạt bài hướng dẫn MySQL của Yes](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzkxNTE3NjQ3MA==&action=getalbum&album_id=1903249596194095112&scene=173&from_msgid=2247490365&from_itemidx=1&count=3&nolastread=1#wechat_redirect)
- [Viết xong bài này khả năng tối ưu SQL của tôi trực tiếp lên tầm cao mới - Biến thành Phái Đại Tinh - 2022](https://juejin.cn/post/7161964571853815822)
- [Giải thích chi tiết hai vạn chữ! Chuyên đề Lock của InnoDB! - Cậu bé nhặt ốc vít - 2022](https://juejin.cn/post/7094049650428084232)
- [Primary Key tự tăng của MySQL nhất định liên tục không? - Thịt bò Phi Thiên nhỏ - 2022](https://mp.weixin.qq.com/s/qci10h9rJx_COZbHV3aygQ)
- [Hiểu sâu nguyên lý tầng đáy của MySQL Index - Kỹ thuật Công trình Tencent - 2020](https://zhuanlan.zhihu.com/p/113917726)

## Tham khảo

- "High Performance MySQL" chương 7 Tính năng cao cấp của MySQL
- "MySQL Technology Insider InnoDB Storage Engine" chương 6 Lock
- Relational Database: <https://www.omnisci.com/technical-glossary/relational-database>
- Một bài viết hiểu rõ varchar trong mysql lưu được bao nhiêu chữ Hán, chữ số, và sự khác nhau giữa varchar(100) và varchar(10): <https://www.cnblogs.com/zhuyeshen/p/11642211.html>
- Chia sẻ kỹ thuật | Isolation Level: Hiểu đúng về Phantom Read: <https://opensource.actionsky.com/20210818-mysql/>
- MySQL Server Logs - MySQL 5.7 Reference Manual: <https://dev.mysql.com/doc/refman/5.7/en/server-logs.html>
- Redo Log - MySQL 5.7 Reference Manual: <https://dev.mysql.com/doc/refman/5.7/en/innodb-redo-log.html>
- Locking Reads - MySQL 5.7 Reference Manual: <https://dev.mysql.com/doc/refman/5.7/en/innodb-locking-reads.html>
- Hiểu sâu Row Lock và Table Lock của cơ sở dữ liệu <https://zhuanlan.zhihu.com/p/52678870>
- Giải thích chi tiết tác dụng của Intention Lock trong MySQL InnoDB: <https://juejin.cn/post/6844903666332368909>
- Phân tích sâu Auto-increment Lock của MySQL: <https://juejin.cn/post/6968420054287253540>
- Trong cơ sở dữ liệu, Unrepeatable Read và Phantom Read rốt cuộc nên phân biệt như thế nào?: <https://www.zhihu.com/question/392569386>

<!-- @include: @article-footer.snippet.md -->
