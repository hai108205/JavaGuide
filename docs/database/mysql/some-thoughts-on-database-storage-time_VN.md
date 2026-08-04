---
title: Gợi ý lựa chọn kiểu dữ liệu ngày giờ trong MySQL
description: So sánh chuyên sâu sự khác biệt giữa DATETIME và TIMESTAMP trong MySQL, phân tích các khác biệt về xử lý múi giờ, không gian lưu trữ, phạm vi giá trị, và đưa ra các gợi ý thực hành tốt nhất cho việc lựa chọn kiểu dữ liệu ngày giờ.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MySQL lưu trữ thời gian,DATETIME,TIMESTAMP,Timestamp,Xử lý múi giờ,Lựa chọn kiểu ngày giờ,Hàm ngày giờ MySQL
---

Trong công việc phát triển phần mềm hằng ngày, lưu trữ thời gian là một nhu cầu cơ bản và phổ biến. Dù là ghi lại thời gian thao tác dữ liệu, thời gian phát sinh giao dịch tài chính, hay thời gian khởi hành của chuyến đi, thời gian đặt hàng của người dùng, v.v., thông tin thời gian luôn gắn chặt với logic nghiệp vụ và chức năng hệ thống của chúng ta. Vì vậy, việc lựa chọn và sử dụng đúng kiểu dữ liệu ngày giờ của MySQL là vô cùng quan trọng; sự đúng đắn của nó thậm chí có thể ảnh hưởng đáng kể đến tính chính xác của nghiệp vụ và sự ổn định của hệ thống.

Bài viết này nhằm giúp các lập trình viên nhìn nhận lại và hiểu sâu các cách lưu trữ thời gian khác nhau trong MySQL, để có thể đưa ra lựa chọn phù hợp hơn với kịch bản nghiệp vụ của dự án.

## Không nên dùng chuỗi (string) để lưu trữ ngày giờ

Giống như nhiều người mới học cơ sở dữ liệu, ở giai đoạn học tập ban đầu, tác giả cũng từng thử dùng kiểu chuỗi (như VARCHAR) để lưu trữ ngày và giờ, thậm chí từng cho rằng đây là một cách đơn giản và trực quan. Dù sao thì định dạng như 'YYYY-MM-DD HH:MM:SS' trông cũng rõ ràng và dễ hiểu.

Nhưng đây là cách làm không đúng, chủ yếu sẽ có hai vấn đề sau:

1. **Hiệu quả không gian**: so với kiểu ngày giờ tích hợp sẵn của MySQL, chuỗi thường cần chiếm nhiều không gian lưu trữ hơn để biểu diễn cùng một thông tin thời gian.
2. **Hiệu quả truy vấn và tính toán thấp**:
   - **Thao tác so sánh phức tạp và kém hiệu quả**: việc so sánh ngày giờ dựa trên chuỗi cần thực hiện từng ký tự theo thứ tự từ điển; điều này không chỉ thiếu trực quan (ví dụ, '2024-05-01' sẽ nhỏ hơn '2024-1-10') mà hiệu quả còn thấp hơn nhiều so với so sánh số hoặc thời điểm bằng kiểu ngày giờ nguyên bản.
   - **Chức năng tính toán bị hạn chế**: không thể trực tiếp sử dụng các hàm ngày giờ phong phú do cơ sở dữ liệu cung cấp để tính toán (ví dụ, tính khoảng cách giữa hai ngày, cộng trừ ngày), mà cần chuyển đổi định dạng trước, làm tăng độ phức tạp.
   - **Hiệu năng Index không tốt**: Index dựa trên chuỗi khi xử lý truy vấn phạm vi (như tìm dữ liệu trong một khoảng thời gian cụ thể) thường có hiệu quả và tính linh hoạt kém hơn Index của kiểu ngày giờ nguyên bản.

## Lựa chọn giữa DATETIME và TIMESTAMP

`DATETIME` và `TIMESTAMP` là hai kiểu dữ liệu rất phổ biến trong MySQL, dùng để lưu trữ dữ liệu chứa thông tin ngày và giờ. Cả hai đều có thể lưu giá trị thời gian chính xác đến giây (từ MySQL 5.6.4+ hỗ trợ độ chính xác cao hơn với fractional seconds). Vậy trong ứng dụng thực tế, chúng ta nên lựa chọn giữa hai kiểu này như thế nào?

Dưới đây chúng ta so sánh chúng theo một số khía cạnh quan trọng:

### Thông tin múi giờ

Kiểu `DATETIME` lưu trữ **giá trị ngày giờ theo nghĩa đen (literal)**, bản thân nó **không chứa bất kỳ thông tin múi giờ nào**. Khi bạn chèn một giá trị `DATETIME`, MySQL lưu trữ chính xác thời gian mà bạn cung cấp, không thực hiện bất kỳ chuyển đổi múi giờ nào.

**Điều này sẽ gây ra vấn đề gì?** Nếu ứng dụng của bạn cần hỗ trợ nhiều múi giờ, hoặc múi giờ của server, client có thể thay đổi, thì khi sử dụng `DATETIME`, ứng dụng phải tự xử lý việc chuyển đổi và diễn giải múi giờ. Nếu xử lý không đúng (ví dụ, giả định tất cả thời gian được lưu trữ đều thuộc cùng một múi giờ, nhưng môi trường thực tế đã thay đổi), có thể dẫn đến hỗn loạn trong việc hiển thị hoặc tính toán thời gian.

**`TIMESTAMP` có liên quan đến múi giờ**. Khi lưu trữ, MySQL sẽ chuyển giá trị thời gian trong múi giờ của phiên (session) hiện tại sang UTC (Giờ phối hợp quốc tế) để lưu trữ nội bộ. Khi truy vấn trường `TIMESTAMP`, MySQL lại chuyển thời gian UTC đã lưu trữ về múi giờ được thiết lập trong phiên hiện tại để hiển thị.

Điều này có nghĩa là, đối với trường `TIMESTAMP` của cùng một bản ghi, khi truy vấn với thiết lập múi giờ của phiên khác nhau, có thể thấy biểu diễn giờ địa phương khác nhau, nhưng chúng đều tương ứng với cùng một thời điểm tuyệt đối (thời gian UTC). Điều này rất hữu ích cho các ứng dụng cần hỗ trợ toàn cầu hóa, đa múi giờ.

Dưới đây hãy demo thực tế!

Câu lệnh SQL tạo bảng:

```sql
CREATE TABLE `time_zone_test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_time` datetime DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Chèn một bản ghi dữ liệu (giả sử múi giờ của phiên hiện tại là mặc định của hệ thống, ví dụ UTC+0):

```sql
INSERT INTO time_zone_test(date_time,time_stamp) VALUES(NOW(),NOW());
```

Truy vấn dữ liệu (trong cùng một phiên múi giờ):

```sql
SELECT date_time, time_stamp FROM time_zone_test;
```

Kết quả:

```plain
+---------------------+---------------------+
| date_time           | time_stamp          |
+---------------------+---------------------+
| 2020-01-11 09:53:32 | 2020-01-11 09:53:32 |
+---------------------+---------------------+
```

Bây giờ, đổi múi giờ của phiên hiện tại sang múi giờ phía Đông thứ tám (UTC+8):

```sql
SET time_zone = '+8:00';
```

Truy vấn dữ liệu lần nữa:

```bash
# Giá trị TIMESTAMP tự động được chuyển sang giờ UTC+8
+---------------------+---------------------+
| date_time           | time_stamp          |
+---------------------+---------------------+
| 2020-01-11 09:53:32 | 2020-01-11 17:53:32 |
+---------------------+---------------------+
```

**Mở rộng: Các câu lệnh SQL thường dùng để thiết lập múi giờ trong MySQL**

```sql
# Xem múi giờ của phiên hiện tại
SELECT @@session.time_zone;
# Thiết lập múi giờ của phiên hiện tại
SET time_zone = 'Europe/Helsinki';
SET time_zone = "+00:00";
# Xem thiết lập múi giờ toàn cục của cơ sở dữ liệu
SELECT @@global.time_zone;
# Thiết lập múi giờ toàn cục
SET GLOBAL time_zone = '+8:00';
SET GLOBAL time_zone = 'Europe/Helsinki';
```

### Không gian lưu trữ

Hình dưới đây là không gian lưu trữ mà các kiểu ngày giờ trong MySQL chiếm (link tài liệu chính thức: <https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html>):

![](https://oss.javaguide.cn/github/javaguide/FhRGUVHFK0ujRPNA75f6CuOXQHTE.jpeg)

Trước MySQL 5.6.4, không gian lưu trữ của DateTime và TIMESTAMP là cố định, lần lượt là 8 byte và 4 byte. Nhưng từ MySQL 5.6.4 trở đi, không gian lưu trữ của chúng thay đổi tùy theo độ chính xác mili giây khác nhau; phạm vi của DateTime là 5~8 byte, phạm vi của TIMESTAMP là 4~7 byte.

### Phạm vi biểu diễn

Phạm vi thời gian mà `TIMESTAMP` biểu diễn nhỏ hơn, chỉ đến năm 2038:

- `DATETIME`: từ '1000-01-01 00:00:00.000000' đến '9999-12-31 23:59:59.999999'
- `TIMESTAMP`: từ '1970-01-01 00:00:01.000000' UTC đến '2038-01-19 03:14:07.999999' UTC

### Hiệu năng

Do `TIMESTAMP` cần chuyển đổi giữa UTC và múi giờ của phiên hiện tại khi lưu trữ và truy xuất, quá trình này có thể liên quan đến chi phí tính toán bổ sung, đặc biệt là khi cần gọi interface tầng thấp của hệ điều hành để lấy hoặc xử lý thông tin múi giờ. Mặc dù cơ sở dữ liệu và hệ điều hành hiện đại đã tối ưu hóa điều này, nhưng trong một số kịch bản có độ đồng thời cực cao hoặc cực kỳ nhạy cảm về độ trễ, `DATETIME` do không liên quan đến chuyển đổi múi giờ nên logic xử lý tương đối đơn giản và trực tiếp hơn, có thể thể hiện ưu thế hiệu năng nhẹ.

Để có được hành vi có thể dự đoán và có thể giảm chi phí chuyển đổi của `TIMESTAMP`, cách làm được khuyến nghị là quản lý múi giờ thống nhất ở tầng ứng dụng, hoặc thiết lập tường minh tham số `time_zone` ở cấp kết nối cơ sở dữ liệu/phiên, thay vì phụ thuộc vào mặc định của server hoặc múi giờ của hệ điều hành.

## Numeric Timestamp có phải là lựa chọn tốt hơn không?

Ngoài hai kiểu nói trên, trong thực tế cũng thường dùng kiểu số nguyên (`INT` hoặc `BIGINT`) để lưu trữ cái gọi là "Unix Timestamp" (tức tổng số giây, hoặc số mili giây tính từ 00:00:00 UTC ngày 1 tháng 1 năm 1970 đến thời điểm mục tiêu).

Cách lưu trữ này có một số ưu điểm mà kiểu `TIMESTAMP` có, hơn nữa hiệu quả của các thao tác như sắp xếp và so sánh ngày giờ khi sử dụng nó sẽ cao hơn, và cũng tiện lợi khi làm việc giữa các hệ thống, vì dù sao cũng chỉ lưu giá trị số. Nhược điểm cũng rất rõ ràng, đó là tính dễ đọc của dữ liệu quá kém, bạn không thể nhìn trực tiếp thời gian cụ thể.

Định nghĩa của timestamp như sau:

> Định nghĩa của timestamp được tính bắt đầu từ một thời điểm gốc; thời điểm gốc này là 「1970-1-1 00:00:00 +0:00」. Bắt đầu từ thời điểm này, dùng số nguyên để biểu diễn, tính bằng giây; theo sự trôi qua của thời gian, số nguyên thời gian này không ngừng tăng lên. Như vậy, chỉ cần một giá trị số là có thể biểu diễn thời gian một cách hoàn hảo, hơn nữa giá trị số này là một giá trị tuyệt đối, tức là dù ở bất kỳ góc nào trên Trái Đất, timestamp biểu diễn thời gian này đều giống nhau, giá trị số sinh ra đều giống nhau, và không có khái niệm múi giờ, nên trong việc truyền tải thời gian giữa các hệ thống đều không cần chuyển đổi bổ sung, chỉ khi hiển thị cho người dùng mới chuyển sang giờ địa phương ở định dạng chuỗi.

Thao tác thực tế trong cơ sở dữ liệu:

```sql
-- Chuyển chuỗi ngày giờ sang Unix Timestamp (giây)
mysql> SELECT UNIX_TIMESTAMP('2020-01-11 09:53:32');
+---------------------------------------+
| UNIX_TIMESTAMP('2020-01-11 09:53:32') |
+---------------------------------------+
|                            1578707612 |
+---------------------------------------+
1 row in set (0.00 sec)

-- Chuyển Unix Timestamp (giây) sang định dạng ngày giờ
mysql> SELECT FROM_UNIXTIME(1578707612);
+---------------------------+
| FROM_UNIXTIME(1578707612) |
+---------------------------+
| 2020-01-11 09:53:32       |
+---------------------------+
1 row in set (0.01 sec)
```

## PostgreSQL không có DATETIME

Vì có bạn đọc nhắc đến kiểu thời gian của PostgreSQL (PG), nên ở đây bổ sung thêm. Địa chỉ mô tả về kiểu thời gian trong tài liệu chính thức của PG: <https://www.postgresql.org/docs/current/datatype-datetime.html>.

![Tổng kết kiểu thời gian trong PostgreSQL](https://oss.javaguide.cn/github/javaguide/mysql/pg-datetime-types.png)

Có thể thấy, PG không có kiểu tên là `DATETIME`:

- `TIMESTAMP WITHOUT TIME ZONE` của PG về chức năng gần nhất với `DATETIME` của MySQL. Nó lưu trữ ngày và giờ, nhưng không chứa bất kỳ thông tin múi giờ nào, lưu trữ giá trị theo nghĩa đen.
- `TIMESTAMP WITH TIME ZONE` của PG (hoặc `TIMESTAMPTZ`) tương đương với `TIMESTAMP` của MySQL. Khi lưu trữ, nó sẽ chuyển giá trị đầu vào sang UTC, và khi truy xuất sẽ chuyển đổi theo múi giờ của phiên hiện tại để hiển thị.

Đối với tuyệt đại đa số kịch bản ứng dụng cần ghi lại thời điểm phát sinh chính xác, `TIMESTAMPTZ` là lựa chọn được khuyến nghị nhất, vững chắc nhất trong PostgreSQL, vì nó xử lý tốt nhất sự phức tạp của múi giờ.

## Tổng kết

Trong MySQL, thời gian rốt cuộc nên lưu trữ như thế nào cho tốt? `DATETIME`? `TIMESTAMP`? Hay numeric timestamp?

Không có viên đạn bạc nào cả; nhiều lập trình viên sẽ thấy numeric timestamp thực sự rất tốt, hiệu quả cao lại tương thích đủ đường, nhưng nhiều người lại thấy nó biểu diễn không đủ trực quan.

Tác giả của cuốn sách kinh điển 《高性能 MySQL》(High Performance MySQL) chính là người khuyến nghị dùng TIMESTAMP, lý do là biểu diễn thời gian bằng số không đủ trực quan. Dưới đây là nguyên văn:

<img src="https://oss.javaguide.cn/github/javaguide/%E9%AB%98%E6%80%A7%E8%83%BDmysql-%E4%B8%8D%E6%8E%A8%E8%8D%90%E7%94%A8%E6%95%B0%E5%80%BC%E6%97%B6%E9%97%B4%E6%88%B3.jpg" style="zoom:50%;" />

Mỗi cách đều có ưu thế riêng, tùy theo kịch bản thực tế mà lựa chọn cách phù hợp nhất mới là điều quan trọng. Dưới đây làm thêm một so sánh đơn giản về ba cách này, để mọi người tham khảo khi lựa chọn kiểu dữ liệu lưu trữ thời gian đúng trong phát triển thực tế:

| Kiểu dữ liệu          | Không gian lưu trữ | Định dạng ngày giờ                 | Phạm vi ngày giờ                                              | Có kèm thông tin múi giờ không |
| --------------------- | ------------------ | ---------------------------------- | ------------------------------------------------------------- | ------------------------------ |
| DATETIME              | 5~8 byte           | YYYY-MM-DD hh:mm:ss[.fraction]     | 1000-01-01 00:00:00[.000000] ～ 9999-12-31 23:59:59[.999999]  | Không                          |
| TIMESTAMP             | 4~7 byte           | YYYY-MM-DD hh:mm:ss[.fraction]     | 1970-01-01 00:00:01[.000000] ～ 2038-01-19 03:14:07[.999999]  | Có                             |
| Numeric timestamp     | 4 byte             | Toàn số như 1578707612             | Thời gian sau 1970-01-01 00:00:01                             | Không                          |

**Tóm tắt gợi ý lựa chọn:**

- Ưu thế cốt lõi của `TIMESTAMP` nằm ở khả năng xử lý múi giờ được tích hợp sẵn. Cơ sở dữ liệu chịu trách nhiệm lưu trữ UTC và tự động chuyển đổi dựa trên múi giờ của phiên, đơn giản hóa việc phát triển các ứng dụng cần xử lý đa múi giờ. Nếu ứng dụng cần xử lý đa múi giờ, hoặc muốn cơ sở dữ liệu tự động quản lý việc chuyển đổi múi giờ, `TIMESTAMP` là lựa chọn tự nhiên (chú ý giới hạn phạm vi thời gian của nó, tức vấn đề năm 2038).
- Nếu kịch bản ứng dụng không liên quan đến chuyển đổi múi giờ, hoặc muốn ứng dụng kiểm soát hoàn toàn logic múi giờ, và cần biểu diễn thời gian sau năm 2038, `DATETIME` là lựa chọn vững chắc hơn.
- Nếu cực kỳ quan tâm đến hiệu năng so sánh, hoặc cần thường xuyên truyền dữ liệu thời gian giữa các hệ thống, và có thể chấp nhận hy sinh tính dễ đọc (hoặc luôn chuyển đổi ở tầng ứng dụng), numeric timestamp là một lựa chọn mạnh mẽ.

<!-- @include: @article-footer.snippet.md -->
