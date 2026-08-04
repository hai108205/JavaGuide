---
title: Tổng hợp các khuyến nghị quy phạm tối ưu hiệu năng cao trong MySQL
description: Tổng hợp các khuyến nghị quy phạm tối ưu hiệu năng cao trong MySQL, bao gồm quy phạm đặt tên cơ sở dữ liệu, quy phạm thiết kế bảng, quy phạm thiết kế trường, quy phạm thiết kế Index, quy phạm viết SQL, v.v., giúp bạn xây dựng hệ thống cơ sở dữ liệu hiệu quả và ổn định.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: Quy phạm tối ưu MySQL,Quy phạm thiết kế cơ sở dữ liệu,Thiết kế Index,Quy phạm viết SQL,Tối ưu Slow Query,Lựa chọn kiểu dữ liệu trường,Thiết kế cấu trúc bảng
---

> Tác giả: 听风 (Tingfeng) Bài viết gốc: <https://www.cnblogs.com/huchong/p/10219318.html>.
>
> JavaGuide đã được tác giả cấp phép, đồng thời đã hoàn thiện và bổ sung nội dung bài viết gốc.

## Quy phạm đặt tên cơ sở dữ liệu

- Tên tất cả các đối tượng cơ sở dữ liệu phải sử dụng chữ thường và được phân tách bằng dấu gạch dưới.
- Tên tất cả các đối tượng cơ sở dữ liệu cấm sử dụng từ khóa dành riêng của MySQL (nếu tên bảng chứa từ khóa khi truy vấn, cần đặt nó trong dấu nháy đơn).
- Việc đặt tên đối tượng cơ sở dữ liệu phải đạt được yêu cầu nhìn tên biết nghĩa, và tốt nhất không vượt quá 32 ký tự.
- Bảng tạm (tmp) phải có tiền tố `tmp_` và hậu tố là ngày tháng, bảng backup phải có tiền tố `bak_` và hậu tố là ngày tháng (timestamp).
- Tên cột và kiểu dữ liệu của tất cả các cột lưu trữ cùng một dữ liệu phải nhất quán (thường là cột liên kết, nếu khi truy vấn kiểu của cột liên kết không nhất quán sẽ tự động xảy ra chuyển đổi kiểu dữ liệu ngầm, làm cho Index trên cột mất hiệu lực, dẫn đến hiệu suất truy vấn giảm).

## Quy phạm thiết kế cơ bản của cơ sở dữ liệu

### Tất cả các bảng phải sử dụng InnoDB Storage Engine

Trong trường hợp không có yêu cầu đặc biệt (tức là các chức năng mà InnoDB không đáp ứng được như: lưu trữ dạng cột, dữ liệu không gian, v.v.), tất cả các bảng phải sử dụng InnoDB Storage Engine (trước MySQL 5.5 mặc định sử dụng MyISAM, từ 5.6 trở đi mặc định là InnoDB).

InnoDB hỗ trợ Transaction, hỗ trợ Row-level Lock, khả năng phục hồi tốt hơn, hiệu năng tốt hơn khi concurrency cao.

### Character Set của cơ sở dữ liệu và bảng thống nhất sử dụng UTF8

Khả năng tương thích tốt hơn, thống nhất Character Set có thể tránh được lỗi hiển thị ký tự do chuyển đổi Character Set gây ra, các Character Set khác nhau khi so sánh cần phải chuyển đổi trước sẽ làm Index mất hiệu lực, nếu trong cơ sở dữ liệu có nhu cầu lưu trữ biểu tượng emoji, Character Set cần sử dụng là utf8mb4.

Khuyến nghị đọc bài viết này mà tôi đã viết: [Giải thích chi tiết Character Set trong MySQL](../character-set.md).

### Tất cả bảng và trường đều cần thêm chú thích

Sử dụng mệnh đề comment để thêm chú thích cho bảng và cột, duy trì Data Dictionary ngay từ đầu.

### Cố gắng kiểm soát dung lượng dữ liệu của bảng đơn, khuyến nghị kiểm soát trong vòng 5 triệu dòng

5 triệu dòng không phải là giới hạn của cơ sở dữ liệu MySQL, quá lớn sẽ gây ra vấn đề rất lớn khi thay đổi cấu trúc bảng, backup, phục hồi.

Có thể sử dụng các biện pháp như lưu trữ dữ liệu lịch sử (áp dụng cho dữ liệu log), phân tách cơ sở dữ liệu và bảng (áp dụng cho dữ liệu nghiệp vụ) để kiểm soát dung lượng dữ liệu.

### Thận trọng khi sử dụng bảng phân vùng (Partition Table) của MySQL

Partition Table về mặt vật lý thể hiện là nhiều file, về mặt logic thể hiện là một bảng.

Thận trọng khi lựa chọn Partition Key, hiệu suất truy vấn liên partition có thể thấp hơn.

Khuyến nghị sử dụng phương thức phân tách bảng vật lý để quản lý dữ liệu lớn.

### Các cột thường được sử dụng cùng nhau đặt vào một bảng

Tránh nhiều thao tác liên kết hơn.

### Cấm tạo trường dự phòng trong bảng

- Việc đặt tên trường dự phòng rất khó đạt được yêu cầu nhìn tên biết nghĩa.
- Trường dự phòng không thể xác định được kiểu dữ liệu sẽ lưu trữ, nên không thể chọn kiểu phù hợp.
- Việc thay đổi kiểu của trường dự phòng sẽ khóa bảng.

### Cấm lưu trữ dữ liệu nhị phân lớn như file (ví dụ hình ảnh) trong cơ sở dữ liệu

Lưu trữ file trong cơ sở dữ liệu ảnh hưởng nghiêm trọng đến hiệu năng cơ sở dữ liệu, tiêu tốn quá nhiều dung lượng lưu trữ.

Dữ liệu nhị phân lớn như file (ví dụ hình ảnh) thường được lưu trữ trên File Server, cơ sở dữ liệu chỉ lưu trữ thông tin địa chỉ file.

### Đừng bị ràng buộc bởi các chuẩn cơ sở dữ liệu (Database Normal Form)

Nói chung, khi thiết kế cơ sở dữ liệu quan hệ cần thỏa mãn chuẩn ba (Third Normal Form), nhưng để thỏa mãn chuẩn ba, chúng ta có thể phải tách ra nhiều bảng. Mà khi truy vấn cần phải liên kết nhiều bảng để truy vấn, đôi khi để nâng cao hiệu suất truy vấn, sẽ giảm bớt yêu cầu về chuẩn, lưu một lượng thông tin dư thừa nhất định trong bảng, còn gọi là phản chuẩn (Denormalization). Nhưng cần chú ý phản chuẩn nhất định phải ở mức độ vừa phải.

### Cấm thực hiện Stress Test cơ sở dữ liệu trên môi trường production

### Cấm kết nối trực tiếp từ môi trường development, môi trường test đến cơ sở dữ liệu môi trường production

Nguy cơ bảo mật cực kỳ lớn, phải giữ sự kính sợ đối với môi trường production!

## Quy phạm thiết kế trường cơ sở dữ liệu

### Ưu tiên chọn kiểu dữ liệu nhỏ nhất phù hợp với nhu cầu lưu trữ

Số byte lưu trữ càng nhỏ, dung lượng chiếm dụng càng nhỏ, hiệu năng cũng càng tốt.

**a. Một số chuỗi có thể chuyển đổi sang kiểu số để lưu trữ, ví dụ có thể chuyển đổi địa chỉ IP sang dữ liệu kiểu số nguyên.**

Số là liên tục, hiệu năng tốt hơn, dung lượng chiếm dụng cũng nhỏ hơn.

MySQL cung cấp hai phương thức để xử lý địa chỉ IP:

- `INET_ATON()`: chuyển IP sang số nguyên không dấu (4-8 byte);
- `INET_NTOA()`: chuyển IP kiểu số nguyên sang địa chỉ.

Trước khi chèn dữ liệu, dùng `INET_ATON()` để chuyển địa chỉ IP sang số nguyên trước; khi hiển thị dữ liệu, sử dụng `INET_NTOA()` để chuyển IP kiểu số nguyên sang địa chỉ hiển thị là được.

**b. Đối với dữ liệu không âm (như ID tự tăng, IP kiểu số nguyên, tuổi), ưu tiên sử dụng số nguyên không dấu để lưu trữ.**

Số nguyên không dấu so với số nguyên có dấu có thể có thêm gấp đôi dung lượng lưu trữ:

```sql
SIGNED INT -2147483648~2147483647
UNSIGNED INT 0~4294967295
```

**c. Kiểu dữ liệu số nhỏ (ví dụ tuổi, biểu thị trạng thái như 0/1) ưu tiên sử dụng kiểu TINYINT.**

### Tránh sử dụng kiểu dữ liệu TEXT, BLOB, kiểu TEXT thường gặp nhất có thể lưu trữ dữ liệu 64k

**a. Khuyến nghị tách cột BLOB hoặc TEXT sang bảng mở rộng riêng biệt.**

Bảng tạm trong bộ nhớ của MySQL không hỗ trợ kiểu dữ liệu lớn như TEXT, BLOB, nếu truy vấn chứa dữ liệu như vậy, khi thực hiện các thao tác như sắp xếp, không thể sử dụng bảng tạm trong bộ nhớ, bắt buộc phải sử dụng bảng tạm trên đĩa. Hơn nữa đối với loại dữ liệu này, MySQL vẫn phải thực hiện truy vấn lần hai, sẽ làm hiệu năng SQL trở nên rất kém, nhưng không có nghĩa là nhất định không được sử dụng kiểu dữ liệu như vậy.

Nếu nhất định phải sử dụng, khuyến nghị tách cột BLOB hoặc TEXT sang bảng mở rộng riêng biệt, khi truy vấn nhất định không sử dụng `select *` mà chỉ lấy ra các cột cần thiết, khi không cần dữ liệu của cột TEXT thì không truy vấn cột đó.

**2. Kiểu TEXT hoặc BLOB chỉ có thể sử dụng Prefix Index**

Vì MySQL có giới hạn về độ dài trường Index, nên kiểu TEXT chỉ có thể sử dụng Prefix Index, và cột TEXT không thể có giá trị mặc định.

### Tránh sử dụng kiểu ENUM

- Sửa đổi giá trị ENUM cần sử dụng câu lệnh ALTER.
- Thao tác ORDER BY của kiểu ENUM hiệu suất thấp, cần thao tác bổ sung.
- Kiểu dữ liệu ENUM tồn tại một số hạn chế, ví dụ khuyến nghị không sử dụng số làm giá trị enum của ENUM.

Bài đọc thêm: [Có khuyến nghị sử dụng kiểu enum của MySQL không? - 架构文摘 (Architecture Digest) - Zhihu](https://www.zhihu.com/question/404422255/answer/1661698499).

### Cố gắng định nghĩa tất cả các cột là NOT NULL

Trừ khi có lý do đặc biệt để sử dụng giá trị NULL, nếu không nên luôn giữ trường ở trạng thái NOT NULL.

- Index cột NULL cần thêm dung lượng để lưu trữ, nên sẽ chiếm nhiều dung lượng hơn.
- Khi so sánh và tính toán cần xử lý đặc biệt đối với giá trị NULL.

Bài đọc thêm: [Chia sẻ kỹ thuật | Lựa chọn giá trị mặc định trong MySQL (là rỗng, hay NULL)](https://opensource.actionsky.com/20190710-mysql/).

### Nhất định không dùng chuỗi để lưu trữ ngày tháng

Đối với kiểu ngày tháng, nhất định không dùng chuỗi để lưu trữ ngày tháng. Có thể cân nhắc DATETIME, TIMESTAMP và timestamp kiểu số.

Ba phương thức này đều có ưu thế riêng, dựa vào tình huống thực tế để chọn phương thức phù hợp nhất mới là điều quan trọng. Dưới đây sẽ so sánh đơn giản ba phương thức này, để mọi người lựa chọn kiểu dữ liệu lưu trữ thời gian chính xác trong phát triển thực tế:

| Kiểu         | Dung lượng lưu trữ | Định dạng ngày tháng             | Phạm vi ngày tháng                                           | Có kèm thông tin múi giờ không |
| ------------ | ------------------ | -------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| DATETIME     | 5~8 byte           | YYYY-MM-DD hh:mm:ss[.fraction] | 1000-01-01 00:00:00[.000000] ～ 9999-12-31 23:59:59[.999999] | Không                          |
| TIMESTAMP    | 4~7 byte           | YYYY-MM-DD hh:mm:ss[.fraction] | 1970-01-01 00:00:01[.000000] ～ 2038-01-19 03:14:07[.999999] | Có                             |
| Timestamp kiểu số | 4 byte        | Toàn số như 1578707612           | Thời gian sau 1970-01-01 00:00:01                            | Không                          |

Giới thiệu chi tiết về lựa chọn kiểu thời gian trong MySQL xem bài này: [Khuyến nghị lưu trữ dữ liệu kiểu thời gian trong MySQL](https://javaguide.cn/database/mysql/some-thoughts-on-database-storage-time.html).

### Dữ liệu dạng số tiền liên quan đến tài chính nhất định phải sử dụng kiểu decimal

- **Số thực không chính xác**: float, double
- **Số thực chính xác**: decimal

Kiểu decimal là số thực chính xác, khi tính toán không bị mất độ chính xác. Dung lượng chiếm dụng được quyết định bởi độ rộng định nghĩa, cứ 4 byte có thể lưu trữ 9 chữ số, và dấu chấm thập phân chiếm một byte. Hơn nữa, decimal có thể dùng để lưu trữ dữ liệu số nguyên lớn hơn bigint.

Tuy nhiên, do decimal cần thêm dung lượng và chi phí tính toán, nên cố gắng chỉ sử dụng decimal khi cần tính toán chính xác dữ liệu.

### Bảng đơn không nên chứa quá nhiều trường

Nếu một bảng chứa quá nhiều trường, có thể cân nhắc tách thành nhiều bảng, khi cần thiết thêm bảng trung gian để liên kết.

## Quy phạm thiết kế Index

### Giới hạn số lượng Index trên mỗi bảng, khuyến nghị Index trên một bảng không vượt quá 5

Index không phải càng nhiều càng tốt! Index có thể nâng cao hiệu suất, cũng có thể làm giảm hiệu suất.

Index có thể tăng hiệu suất truy vấn, nhưng cũng sẽ làm giảm hiệu suất insert và update, thậm chí một số trường hợp còn làm giảm hiệu suất truy vấn.

Vì khi MySQL Optimizer lựa chọn cách tối ưu hóa truy vấn, sẽ dựa vào thông tin thống nhất, đánh giá từng Index có thể sử dụng, để sinh ra một Execution Plan tốt nhất. Nếu đồng thời có rất nhiều Index đều có thể dùng cho truy vấn, sẽ tăng thời gian MySQL Optimizer sinh ra Execution Plan, cũng sẽ làm giảm hiệu năng truy vấn.

### Cấm sử dụng Full-text Index

Full-text Index không phù hợp với tình huống OLTP.

### Cấm tạo Index riêng cho từng cột trong bảng

Trước phiên bản 5.6, một SQL chỉ có thể sử dụng một Index trên một bảng; từ 5.6 trở đi, tuy có phương thức tối ưu Merge Index, nhưng vẫn không tốt bằng phương thức truy vấn sử dụng một Composite Index.

### Mỗi bảng InnoDB phải có một Primary Key

InnoDB là một dạng Index Organized Table: thứ tự logic lưu trữ dữ liệu và thứ tự của Index là giống nhau. Mỗi bảng đều có thể có nhiều Index, nhưng thứ tự lưu trữ của bảng chỉ có thể có một.

InnoDB tổ chức bảng theo thứ tự của Primary Key Index.

- Không sử dụng cột thường xuyên cập nhật làm Primary Key, không sử dụng Primary Key nhiều cột (tương đương Composite Index).
- Không sử dụng UUID, MD5, HASH, cột chuỗi làm Primary Key (không thể đảm bảo dữ liệu tăng theo thứ tự).
- Primary Key khuyến nghị sử dụng giá trị ID tự tăng.

### Khuyến nghị về cột Index thường gặp

- Các cột xuất hiện trong mệnh đề WHERE của câu lệnh SELECT, UPDATE, DELETE.
- Các trường chứa trong ORDER BY, GROUP BY, DISTINCT.
- Đừng tạo một Index riêng cho tất cả các cột thỏa mãn 1 và 2, thông thường tạo Composite Index cho các trường trong 1, 2 sẽ có hiệu quả tốt hơn.
- Cột liên kết khi JOIN nhiều bảng.

### Làm thế nào để chọn thứ tự cột Index

Mục đích của việc tạo Index là: hy vọng thông qua Index để tìm kiếm dữ liệu, giảm Random IO, tăng hiệu năng truy vấn, Index lọc ra càng ít dữ liệu thì dữ liệu đọc từ đĩa cũng càng ít.

- **Cột có độ phân biệt cao nhất đặt ở bên trái nhất của Composite Index**: Đây là nguyên tắc quan trọng nhất. Độ phân biệt càng cao, dữ liệu lọc ra thông qua Index càng ít, thao tác I/O cũng càng ít. Phương pháp tính độ phân biệt là `count(distinct column) / count(*)`.
- **Cột được sử dụng thường xuyên nhất đặt ở bên trái của Composite Index**: Điều này phù hợp với nguyên tắc khớp tiền tố trái nhất (Leftmost Prefix). Đặt cột điều kiện truy vấn thường dùng nhất ở bên trái nhất, có thể tận dụng Index ở mức độ lớn nhất.
- **Độ dài trường**: Độ dài trường ảnh hưởng rất nhỏ đến node không phải lá của Composite Index, vì nó lưu trữ giá trị của tất cả các trường Composite Index. Độ dài trường chủ yếu ảnh hưởng đến dung lượng lưu trữ của Primary Key và các trường chứa trong Index khác, cũng như kích thước node lá của các Index này. Vì vậy, khi lựa chọn thứ tự cột Composite Index, độ dài trường có độ ưu tiên thấp nhất. Đối với Primary Key và các trường chứa trong Index khác, chọn độ dài trường ngắn hơn có thể tiết kiệm dung lượng lưu trữ và nâng cao hiệu năng I/O.

### Tránh tạo Index dư thừa và Index trùng lặp (tăng thời gian Query Optimizer sinh ra Execution Plan)

- Ví dụ Index trùng lặp: primary key(id), index(id), unique index(id).
- Ví dụ Index dư thừa: index(a,b,c), index(a,b), index(a).

### Đối với truy vấn thường xuyên, ưu tiên cân nhắc sử dụng Covering Index

> Covering Index: là Index chứa tất cả các trường truy vấn (các trường chứa trong where, select, order by, group by)

**Lợi ích của Covering Index**:

- **Tránh truy vấn lần hai trên Index của bảng InnoDB, tức là thao tác Back to Table**: InnoDB được lưu trữ theo thứ tự của Clustered Index, đối với InnoDB, Secondary Index lưu trữ thông tin Primary Key của dòng trong node lá, nếu dùng Secondary Index để truy vấn dữ liệu, sau khi tìm được giá trị khóa tương ứng, còn phải thông qua Primary Key để truy vấn lần hai mới có thể lấy được dữ liệu thực sự cần thiết. Mà trong Covering Index, có thể lấy được tất cả dữ liệu từ giá trị khóa của Secondary Index, tránh truy vấn lần hai trên Primary Key (Back to Table), giảm thao tác IO, nâng cao hiệu suất truy vấn.
- **Có thể biến Random IO thành Sequential IO để tăng nhanh hiệu suất truy vấn**: Do Covering Index được lưu trữ theo thứ tự giá trị khóa, đối với tìm kiếm phạm vi dạng IO intensive, so với IO đọc ngẫu nhiên dữ liệu từng dòng từ đĩa thì ít hơn rất nhiều, vì vậy sử dụng Covering Index khi truy cập cũng có thể chuyển IO đọc ngẫu nhiên của đĩa thành IO tuần tự của tìm kiếm Index.

---

### Quy phạm SET Index

**Cố gắng tránh sử dụng ràng buộc khóa ngoại (Foreign Key)**

- Không khuyến nghị sử dụng ràng buộc khóa ngoại (foreign key), nhưng nhất định phải tạo Index trên khóa liên kết giữa các bảng.
- Khóa ngoại có thể dùng để đảm bảo tính toàn vẹn tham chiếu của dữ liệu, nhưng khuyến nghị thực hiện ở phía nghiệp vụ.
- Khóa ngoại sẽ ảnh hưởng đến thao tác ghi của bảng cha và bảng con từ đó làm giảm hiệu năng.

## Quy phạm phát triển SQL cơ sở dữ liệu

### Cố gắng không thực hiện tính toán trong cơ sở dữ liệu, tính toán phức tạp cần chuyển vào ứng dụng nghiệp vụ để hoàn thành

Cố gắng không thực hiện tính toán trong cơ sở dữ liệu, tính toán phức tạp cần chuyển vào ứng dụng nghiệp vụ để hoàn thành. Như vậy có thể tránh cơ sở dữ liệu bị quá tải, ảnh hưởng đến hiệu năng và tính ổn định của cơ sở dữ liệu. Tác dụng chính của cơ sở dữ liệu là lưu trữ và quản lý dữ liệu, không phải xử lý dữ liệu.

### Tối ưu các câu lệnh SQL có ảnh hưởng lớn đến hiệu năng

Phải tìm ra câu lệnh SQL cần tối ưu nhất. Hoặc là câu lệnh được sử dụng thường xuyên nhất, hoặc là câu lệnh sau khi tối ưu có cải thiện rõ rệt nhất, có thể thông qua truy vấn Slow Query Log của MySQL để phát hiện câu lệnh SQL cần tối ưu.

### Tận dụng tối đa Index đã tồn tại trên bảng

Tránh sử dụng điều kiện truy vấn có hai dấu %. Như: `a like '%123%'` (nếu không có % phía trước, chỉ có % phía sau, vẫn có thể sử dụng Index trên cột).

Một SQL chỉ có thể tận dụng một cột trong Composite Index để truy vấn phạm vi. Như: có Composite Index trên các cột a,b,c, trong điều kiện truy vấn có truy vấn phạm vi cột a, thì Index trên cột b,c sẽ không được sử dụng.

Khi định nghĩa Composite Index, nếu cột a cần dùng đến tìm kiếm phạm vi, thì phải đặt cột a ở bên phải của Composite Index, sử dụng left join hoặc not exists để tối ưu thao tác not in, vì not in cũng thường làm Index mất hiệu lực.

### Cấm sử dụng SELECT \* phải sử dụng SELECT <danh sách trường> để truy vấn

- `SELECT *` sẽ tiêu tốn nhiều CPU hơn.
- `SELECT *` các trường vô dụng làm tăng tiêu tốn tài nguyên băng thông mạng, tăng thời gian truyền dữ liệu, đặc biệt là trường lớn (như varchar, blob, text).
- `SELECT *` không thể sử dụng tối ưu Covering Index của MySQL Optimizer (dựa vào chiến lược "Covering Index" của MySQL Optimizer là phương thức tối ưu hóa truy vấn có tốc độ cực nhanh, hiệu suất cực cao, được giới chuyên môn cực kỳ khuyến nghị).
- `SELECT <danh sách trường>` có thể giảm ảnh hưởng do thay đổi cấu trúc bảng mang lại.

### Cấm sử dụng câu lệnh INSERT không chứa danh sách trường

**Không khuyến nghị**:

```sql
insert into t values ('a','b','c');
```

**Khuyến nghị**:

```sql
insert into t(c1,c2,c3) values ('a','b','c');
```

### Khuyến nghị sử dụng câu lệnh Prepared Statement để thao tác cơ sở dữ liệu

- Prepared Statement có thể tái sử dụng các plan này, giảm thời gian cần thiết để biên dịch SQL, còn có thể giải quyết vấn đề SQL Injection do SQL động mang lại.
- Chỉ truyền tham số, hiệu quả hơn truyền câu lệnh SQL.
- Câu lệnh giống nhau có thể phân tích một lần, sử dụng nhiều lần, nâng cao hiệu suất xử lý.

### Tránh chuyển đổi ngầm kiểu dữ liệu

Chuyển đổi ngầm sẽ làm Index mất hiệu lực, như:

```sql
select name,phone from customer where id = '111';
```

Giải thích chi tiết có thể xem bài viết: [Index mất hiệu lực do chuyển đổi ngầm trong MySQL](./index-invalidation-caused-by-implicit-conversion.md).

### Tránh sử dụng Subquery, có thể tối ưu Subquery thành thao tác JOIN

Thông thường khi Subquery nằm trong mệnh đề in, và Subquery là SQL đơn giản (không chứa mệnh đề union, group by, order by, limit), mới có thể chuyển Subquery thành truy vấn liên kết để tối ưu.

**Nguyên nhân hiệu năng Subquery kém**: Tập kết quả của Subquery không thể sử dụng Index, thông thường tập kết quả của Subquery sẽ được lưu trữ vào bảng tạm, bất kể là bảng tạm trong bộ nhớ hay bảng tạm trên đĩa đều không tồn tại Index, nên hiệu năng truy vấn sẽ bị ảnh hưởng nhất định. Đặc biệt đối với Subquery có tập kết quả trả về tương đối lớn, ảnh hưởng của nó đến hiệu năng truy vấn cũng càng lớn. Do Subquery sẽ sinh ra lượng lớn bảng tạm cũng không có Index, nên sẽ tiêu tốn quá nhiều tài nguyên CPU và IO, sinh ra lượng lớn Slow Query.

### Tránh sử dụng JOIN liên kết quá nhiều bảng

Đối với MySQL, tồn tại Cache liên kết, kích thước Cache có thể được thiết lập bởi tham số join_buffer_size.

Trong MySQL, đối với cùng một SQL liên kết (join) thêm một bảng, sẽ phân phối thêm một Cache liên kết, nếu trong một SQL liên kết càng nhiều bảng, dung lượng bộ nhớ chiếm dụng cũng càng lớn.

Nếu trong chương trình sử dụng lượng lớn thao tác liên kết nhiều bảng, đồng thời join_buffer_size thiết lập cũng không hợp lý, sẽ dễ gây ra tình trạng tràn bộ nhớ máy chủ, sẽ ảnh hưởng đến tính ổn định của hiệu năng cơ sở dữ liệu máy chủ.

Đồng thời đối với thao tác liên kết, sẽ sinh ra thao tác bảng tạm, ảnh hưởng hiệu suất truy vấn, MySQL cho phép liên kết tối đa 61 bảng, khuyến nghị không vượt quá 5 bảng.

### Giảm số lần tương tác với cơ sở dữ liệu

Cơ sở dữ liệu phù hợp hơn để xử lý thao tác hàng loạt, hợp nhất nhiều thao tác giống nhau lại với nhau, có thể nâng cao hiệu suất xử lý.

### Khi thực hiện phán đoán or trên cùng một cột, sử dụng in thay thế or

Giá trị của in không nên vượt quá 500. Thao tác in có thể tận dụng Index hiệu quả hơn, or trong hầu hết các trường hợp rất ít khi tận dụng được Index.

### Cấm sử dụng order by rand() để sắp xếp ngẫu nhiên

order by rand() sẽ nạp tất cả dữ liệu trong bảng thỏa mãn điều kiện vào bộ nhớ, sau đó trong bộ nhớ sắp xếp tất cả dữ liệu theo giá trị sinh ngẫu nhiên, và có thể sinh ra một giá trị ngẫu nhiên cho mỗi dòng. Nếu tập dữ liệu thỏa mãn điều kiện rất lớn, sẽ tiêu tốn lượng lớn tài nguyên CPU, IO và bộ nhớ.

Khuyến nghị lấy một giá trị ngẫu nhiên trong chương trình, sau đó lấy dữ liệu từ cơ sở dữ liệu.

### Cấm thực hiện chuyển đổi hàm và tính toán trên cột trong mệnh đề WHERE

Khi thực hiện chuyển đổi hàm hoặc tính toán trên cột sẽ dẫn đến không thể sử dụng Index.

**Không khuyến nghị**:

```sql
where date(create_time)='20190101'
```

**Khuyến nghị**:

```sql
where create_time >= '20190101' and create_time < '20190102'
```

### Khi rõ ràng không có giá trị trùng lặp, sử dụng UNION ALL thay vì UNION

- UNION sẽ đưa tất cả dữ liệu của hai tập kết quả vào bảng tạm rồi mới thực hiện thao tác loại bỏ trùng lặp.
- UNION ALL sẽ không thực hiện thao tác loại bỏ trùng lặp trên tập kết quả.

### Tách SQL lớn phức tạp thành nhiều SQL nhỏ

- SQL lớn có logic tương đối phức tạp, cần chiếm dụng lượng lớn CPU để tính toán.
- Trong MySQL, một SQL chỉ có thể sử dụng một CPU để tính toán.
- Sau khi tách SQL có thể thông qua thực thi song song để nâng cao hiệu suất xử lý.

### Chương trình kết nối đến các cơ sở dữ liệu khác nhau sử dụng các tài khoản khác nhau, cấm truy vấn liên cơ sở dữ liệu

- Để dành dư địa cho việc di chuyển cơ sở dữ liệu và phân tách cơ sở dữ liệu, bảng.
- Giảm mức độ ghép cặp (Coupling) nghiệp vụ.
- Tránh rủi ro bảo mật do quyền hạn quá lớn.

## Quy phạm thao tác cơ sở dữ liệu

### Thao tác ghi hàng loạt (UPDATE, DELETE, INSERT) vượt quá 1 triệu dòng, phải chia thành nhiều đợt để thực hiện

**Thao tác hàng loạt lớn có thể gây ra độ trễ Master-Slave nghiêm trọng**

Trong môi trường Master-Slave, thao tác hàng loạt lớn có thể gây ra độ trễ Master-Slave nghiêm trọng, thao tác ghi hàng loạt lớn thông thường đều cần thực hiện trong một khoảng thời gian nhất định, mà chỉ khi thực hiện xong trên Master, mới thực hiện trên các Slave khác, nên sẽ gây ra tình trạng độ trễ giữa Master và Slave trong thời gian dài.

**Khi log binlog ở định dạng row sẽ sinh ra lượng lớn log**

Thao tác ghi hàng loạt lớn sẽ sinh ra lượng lớn log, đặc biệt đối với dữ liệu nhị phân định dạng row, do trong định dạng row sẽ ghi lại sửa đổi của mỗi dòng dữ liệu, dữ liệu chúng ta sửa đổi một lần càng nhiều, lượng log sinh ra cũng càng nhiều, thời gian cần thiết để truyền và phục hồi log cũng càng dài, đây cũng là một nguyên nhân gây ra độ trễ Master-Slave.

**Tránh sinh ra thao tác Transaction lớn**

Sửa đổi dữ liệu hàng loạt lớn, nhất định được thực hiện trong một Transaction, điều này sẽ gây ra khóa dữ liệu hàng loạt lớn trong bảng, từ đó dẫn đến lượng lớn Blocking, Blocking sẽ ảnh hưởng rất lớn đến hiệu năng của MySQL.

Đặc biệt Blocking thời gian dài sẽ chiếm hết tất cả kết nối khả dụng của cơ sở dữ liệu, điều này sẽ làm cho các ứng dụng khác trong môi trường production không thể kết nối đến cơ sở dữ liệu, vì vậy nhất định phải chú ý thao tác ghi hàng loạt lớn phải được chia thành nhiều đợt.

### Đối với bảng lớn sử dụng pt-online-schema-change để thay đổi cấu trúc bảng

- Tránh độ trễ Master-Slave do thay đổi bảng lớn gây ra.
- Tránh khóa bảng khi thực hiện thay đổi trường của bảng.

Thay đổi cấu trúc dữ liệu của bảng lớn nhất định phải thận trọng, sẽ gây ra thao tác khóa bảng nghiêm trọng, đặc biệt là môi trường production, không thể chấp nhận được.

pt-online-schema-change đầu tiên sẽ tạo một bảng mới có cấu trúc giống với bảng gốc, và thực hiện thay đổi cấu trúc bảng trên bảng mới, sau đó sao chép dữ liệu trong bảng gốc sang bảng mới, và thêm một số Trigger trong bảng gốc. Dữ liệu mới thêm trong bảng gốc cũng được sao chép sang bảng mới, sau khi tất cả dữ liệu được sao chép xong, đổi tên bảng mới thành bảng gốc, và xóa bảng cũ. Biến một thao tác DDL ban đầu thành nhiều đợt nhỏ để thực hiện.

### Cấm cấp quyền super cho tài khoản mà chương trình sử dụng

- Khi đạt đến giới hạn số kết nối tối đa, vẫn cho phép 1 kết nối của người dùng có quyền super.
- Quyền super chỉ có thể dành cho tài khoản của DBA xử lý vấn đề sử dụng.

### Đối với tài khoản kết nối cơ sở dữ liệu của chương trình, tuân thủ nguyên tắc quyền hạn nhỏ nhất

- Tài khoản cơ sở dữ liệu mà chương trình sử dụng chỉ có thể dùng trong một DB, không được liên cơ sở dữ liệu.
- Tài khoản mà chương trình sử dụng về nguyên tắc không được có quyền drop.

## Bài đọc được khuyến nghị

- [Quy ước thiết kế MySQL mà dân kỹ thuật nhất định phải biết, đều là bài học đau thương - Alibaba Developer](https://mp.weixin.qq.com/s/XC8e5iuQtfsrEOERffEZ-Q)
- [Bàn về 15 mẹo nhỏ khi tạo bảng cơ sở dữ liệu](https://mp.weixin.qq.com/s/NM-aHaW6TXrnO6la6Jfl5A)

<!-- @include: @article-footer.snippet.md -->
