---
title: Index mất hiệu lực do chuyển đổi ngầm định trong MySQL
description: Phân tích chuyên sâu nguyên nhân và các tình huống khiến Index mất hiệu lực do chuyển đổi kiểu ngầm định trong MySQL, thông qua các ví dụ thực tế minh họa vấn đề hiệu năng khi so sánh giữa chuỗi và số, đồng thời đưa ra các thực hành tốt nhất để tránh Index mất hiệu lực.
category: Cơ sở dữ liệu
tag:
  - MySQL
  - Tối ưu hiệu năng
head:
  - - meta
    - name: keywords
      content: Chuyển đổi ngầm định trong MySQL,Index mất hiệu lực,chuyển đổi kiểu dữ liệu,tối ưu hiệu năng MySQL,kiểu dữ liệu không khớp,quét toàn bảng,tối ưu SQL
---

> Phiên bản MySQL được sử dụng trong lần kiểm thử này là `5.7.26`, cùng với việc các phiên bản MySQL được cập nhật, một số tính năng có thể thay đổi, bài viết này không đảm bảo các quan điểm và kết luận nêu ra đều chính xác tuyệt đối trên mọi phiên bản MySQL, vui lòng tự phân biệt sự khác biệt giữa các phiên bản.
>
> Bài gốc: <https://www.guitu18.com/post/2019/11/24/61.html>

## Lời mở đầu

Tối ưu hóa cơ sở dữ liệu là một nhiệm vụ lâu dài và gian nan, muốn làm tối ưu thì phải hiểu sâu các đặc tính khác nhau của cơ sở dữ liệu. Trong quá trình phát triển, chúng ta thường gặp một số vấn đề khó hiểu mà nguyên nhân rất đơn giản nhưng hậu quả gây ra lại rất nghiêm trọng, những vấn đề kiểu này thường còn khó định vị, mất nhiều thời gian và công sức để điều tra, cuối cùng phát hiện ra là do một sơ suất rất nhỏ gây ra, hoặc là do không hiểu một đặc tính kỹ thuật nào đó mà sinh ra.

Ở tầng cơ sở dữ liệu, phổ biến nhất có lẽ là Index mất hiệu lực, và ban đầu do lượng dữ liệu nhỏ nên còn khó bị phát hiện. Nhưng cùng với sự mở rộng nghiệp vụ và sự gia tăng lượng dữ liệu, vấn đề hiệu năng dần dần sẽ lộ ra, nếu xử lý không kịp thời còn rất dễ gây ra hiệu ứng quả cầu tuyết, cuối cùng dẫn đến cơ sở dữ liệu bị treo thậm chí tê liệt. Nguyên nhân khiến Index mất hiệu lực có thể có rất nhiều, các blog kỹ thuật liên quan đã có quá nhiều, hôm nay tôi muốn ghi lại là **Index mất hiệu lực do chuyển đổi ngầm định (implicit conversion) gây ra**.

## Chuẩn bị dữ liệu

Trước tiên sử dụng stored procedure (thủ tục lưu trữ) để tạo ra 10 triệu bản ghi dữ liệu kiểm thử,
bảng kiểm thử tổng cộng đã tạo 7 trường (bao gồm cả Primary Key), `num1` và `num2` lưu các số tuần tự giống như `ID`, trong đó `num2` là kiểu chuỗi.
`type1` và `type2` đều lưu kết quả lấy phần dư của Primary Key chia cho 5, mục đích là mô phỏng dữ liệu dạng type thường dùng trong ứng dụng thực tế, nhưng `type2` không được tạo Index.
`str1` và `str2` đều lưu một chuỗi ngẫu nhiên có độ dài 20 ký tự, `str1` không được phép `NULL`, `str2` cho phép `NULL`, tương ứng khi tạo dữ liệu kiểm thử tôi cũng sẽ tạo ra một lượng nhỏ giá trị `NULL` ở trường `str2` (mỗi 100 bản ghi dữ liệu sẽ sinh ra một giá trị `NULL`).

```sql
-- Tạo bảng dữ liệu kiểm thử
DROP TABLE IF EXISTS test1;
CREATE TABLE `test1` (
    `id` int(11) NOT NULL,
    `num1` int(11) NOT NULL DEFAULT '0',
    `num2` varchar(11) NOT NULL DEFAULT '',
    `type1` int(4) NOT NULL DEFAULT '0',
    `type2` int(4) NOT NULL DEFAULT '0',
    `str1` varchar(100) NOT NULL DEFAULT '',
    `str2` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `num1` (`num1`),
    KEY `num2` (`num2`),
    KEY `type1` (`type1`),
    KEY `str1` (`str1`),
    KEY `str2` (`str2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- Tạo stored procedure
DROP PROCEDURE IF EXISTS pre_test1;
DELIMITER //
CREATE PROCEDURE `pre_test1`()
BEGIN
    DECLARE i INT DEFAULT 0;
    SET autocommit = 0;
    WHILE i < 10000000 DO
        SET i = i + 1;
        SET @str1 = SUBSTRING(MD5(RAND()),1,20);
        -- Cứ mỗi 100 bản ghi dữ liệu thì str2 sinh ra một giá trị null
        IF i % 100 = 0 THEN
            SET @str2 = NULL;
        ELSE
            SET @str2 = @str1;
        END IF;
        INSERT INTO test1 (`id`, `num1`, `num2`,
        `type1`, `type2`, `str1`, `str2`)
        VALUES (CONCAT('', i), CONCAT('', i),
        CONCAT('', i), i%5, i%5, @str1, @str2);
        -- Tối ưu Transaction, cứ mỗi 10 nghìn bản ghi dữ liệu thì commit Transaction một lần
        IF i % 10000 = 0 THEN
            COMMIT;
        END IF;
    END WHILE;
END;
// DELIMITER ;
-- Thực thi stored procedure
CALL pre_test1();
```

Lượng dữ liệu khá lớn, lại liên quan đến việc sử dụng `MD5` để sinh chuỗi ngẫu nhiên, nên tốc độ hơi chậm, hãy bình tĩnh chờ đợi.

Với 10 triệu bản ghi dữ liệu, tôi mất 33 phút mới chạy xong (thời gian thực tế phụ thuộc vào cấu hình phần cứng máy tính của bạn). Ở đây tôi dán vài bản ghi dữ liệu được tạo ra, đại khái trông như thế này.

![](https://oss.javaguide.cn/github/javaguide/mysqlindex-invalidation-caused-by-implicit-conversion-01.png)

## Kiểm thử SQL

Trước tiên xem nhóm SQL này, tổng cộng có bốn câu, trường `num1` của bảng dữ liệu kiểm thử là kiểu `int`, `num2` là kiểu `varchar`, nhưng dữ liệu được lưu đều là các số tuần tự giống với Primary Key `id`, cả hai trường đều đã được tạo Index.

```sql
1: SELECT * FROM `test1` WHERE num1 = 10000;
2: SELECT * FROM `test1` WHERE num1 = '10000';
3: SELECT * FROM `test1` WHERE num2 = 10000;
4: SELECT * FROM `test1` WHERE num2 = '10000';
```

Bốn câu SQL này đều được viết có chủ đích, câu 1 và 2 truy vấn trường kiểu int, câu 3 và 4 truy vấn trường kiểu `varchar`. Câu 1 và 2 hoặc câu 3 và 4 tuy truy vấn cùng một trường, nhưng một bên điều kiện là số, một bên điều kiện là chuỗi được đặt trong dấu nháy kép. Làm như vậy có gì khác biệt? Trước khi xem kết quả kiểm thử bên dưới, bạn có thể đoán được thứ tự hiệu năng của bốn câu SQL này không?

Qua kiểm thử, kết quả thực thi cuối cùng của bốn câu SQL này lại chênh lệch rất lớn, trong đó ba câu 1, 2, 4 về cơ bản đều cho kết quả ngay lập tức, khoảng 0.001~0.005 giây, với lượng dữ liệu ở mức hàng chục triệu thì kết quả như vậy có thể phán định hiệu năng của ba câu SQL này về cơ bản không có khác biệt. Nhưng câu SQL thứ ba, qua nhiều lần kiểm thử, thời gian thực thi cơ bản nằm trong khoảng 4.5~4.8 giây.

Tại sao hai câu SQL 3 và 4 hiệu quả chênh lệch lớn như vậy, nhưng hai câu 1 và 2 cũng làm đối chiếu tương tự lại không có khác biệt gì? Hãy xem kế hoạch thực thi (Execution Plan), dưới đây lần lượt là dữ liệu kế hoạch thực thi của các câu SQL 1, 2, 3, 4:

![](https://oss.javaguide.cn/github/javaguide/mysqlindex-invalidation-caused-by-implicit-conversion-02.png)

Có thể thấy, ba câu SQL 1, 2, 4 đều có thể sử dụng Index, loại kết nối đều là `ref`, số hàng quét đều là 1, nên hiệu quả rất cao. Nhìn lại câu SQL thứ ba, không dùng được Index, nên phải quét toàn bảng, `rows` trực tiếp lên đến 10 triệu, nên sự khác biệt về hiệu năng mới lớn như vậy.

Quan sát kỹ bạn sẽ phát hiện, trường `num2` mà hai câu SQL 3 và 4 truy vấn là kiểu `varchar`, câu SQL thứ 4 có điều kiện truy vấn bên phải dấu bằng được đặt trong dấu nháy kép thì dùng được Index, vậy có phải do kiểu dữ liệu truy vấn và kiểu dữ liệu của trường không khớp gây ra không? Nếu đúng như vậy thì trường `num1` mà hai câu SQL 1 và 2 truy vấn là kiểu `int`, nhưng điều kiện truy vấn của câu SQL thứ 2 bên phải có đặt dấu nháy kép tại sao vẫn dùng được Index.

Tra cứu tài liệu liên quan của MySQL thì phát hiện ra là do chuyển đổi ngầm định gây ra, hãy xem mô tả chính thức:

> Tài liệu chính thức: [12.2 Type Conversion in Expression Evaluation](https://dev.mysql.com/doc/refman/5.7/en/type-conversion.html?spm=5176.100239.blogcont47339.5.1FTben)
>
> Khi toán tử được sử dụng cùng với các toán hạng khác kiểu nhau, chuyển đổi kiểu sẽ xảy ra để làm cho các toán hạng tương thích. Một số chuyển đổi xảy ra một cách ngầm định. Ví dụ, MySQL sẽ tự động chuyển chuỗi thành số khi cần thiết, và ngược lại. Các quy tắc sau mô tả cách chuyển đổi cho các phép toán so sánh:
>
> 1. Khi ít nhất một trong hai tham số là `NULL`, kết quả so sánh cũng là `NULL`, trường hợp đặc biệt là khi sử dụng `<=>` để so sánh hai giá trị `NULL` sẽ trả về `1`, cả hai trường hợp này đều không cần chuyển đổi kiểu dữ liệu
> 2. Khi cả hai tham số đều là chuỗi, sẽ so sánh theo chuỗi, không chuyển đổi kiểu dữ liệu
> 3. Khi cả hai tham số đều là số nguyên, sẽ so sánh theo số nguyên, không chuyển đổi kiểu dữ liệu
> 4. Khi giá trị hệ thập lục phân được so sánh với giá trị không phải số, sẽ được xem như chuỗi nhị phân
> 5. Khi một tham số là `TIMESTAMP` hoặc `DATETIME`, và tham số còn lại là hằng số, hằng số sẽ được chuyển đổi thành `timestamp`
> 6. Khi một tham số là kiểu `decimal`, nếu tham số còn lại là `decimal` hoặc số nguyên, sẽ chuyển số nguyên thành `decimal` rồi so sánh, nếu tham số còn lại là số dấu phẩy động, thì sẽ chuyển `decimal` thành số dấu phẩy động rồi so sánh
> 7. **Trong tất cả các trường hợp khác, cả hai tham số đều sẽ được chuyển đổi thành số dấu phẩy động rồi mới so sánh**

Theo mô tả trong tài liệu chính thức, hai câu SQL thứ 2 và 3 của chúng ta đều xảy ra chuyển đổi ngầm định, điều kiện truy vấn của câu SQL thứ 2 là `num1 = '10000'`, bên trái là kiểu `int` bên phải là chuỗi, câu SQL thứ 3 thì ngược lại, vậy theo quy tắc chuyển đổi chính thức điều thứ 7, cả hai bên trái phải đều sẽ được chuyển đổi thành số dấu phẩy động rồi mới so sánh.

Xem câu SQL thứ 2 trước: ``SELECT * FROM `test1` WHERE num1 = '10000';`` **Bên trái là kiểu int** `10000`, chuyển thành số dấu phẩy động vẫn là `10000`, bên phải là kiểu chuỗi `'10000'`, chuyển thành số dấu phẩy động cũng là `10000`. Kết quả chuyển đổi của cả hai bên đều là duy nhất và xác định, nên không ảnh hưởng đến việc sử dụng Index.

Câu SQL thứ 3: ``SELECT * FROM `test1` WHERE num2 = 10000;`` **Bên trái là kiểu chuỗi** `'10000'`, chuyển thành số dấu phẩy động là 10000 là duy nhất, bên phải là kiểu `int` `10000` kết quả chuyển đổi cũng là duy nhất. Nhưng, vì bên trái là điều kiện tìm kiếm, `'10000'` chuyển thành `10000` tuy là duy nhất, nhưng các chuỗi khác cũng có thể chuyển thành `10000`, ví dụ `'10000a'`, `'010000'`, `'10000'` v.v. đều có thể chuyển thành số dấu phẩy động `10000`, trong tình huống như vậy, không thể dùng được Index.

Về **chuyển đổi ngầm định** này, chúng ta có thể thông qua truy vấn kiểm thử để xác minh, trước tiên chèn vào vài bản ghi dữ liệu, trong đó `num2='10000a'`, `'010000'` và `'10000'`:

```sql
INSERT INTO `test1` (`id`, `num1`, `num2`, `type1`, `type2`, `str1`, `str2`) VALUES ('10000001', '10000', '10000a', '0', '0', '2df3d9465ty2e4hd523', '2df3d9465ty2e4hd523');
INSERT INTO `test1` (`id`, `num1`, `num2`, `type1`, `type2`, `str1`, `str2`) VALUES ('10000002', '10000', '010000', '0', '0', '2df3d9465ty2e4hd523', '2df3d9465ty2e4hd523');
INSERT INTO `test1` (`id`, `num1`, `num2`, `type1`, `type2`, `str1`, `str2`) VALUES ('10000003', '10000', ' 10000', '0', '0', '2df3d9465ty2e4hd523', '2df3d9465ty2e4hd523');
```

Sau đó sử dụng câu SQL thứ ba ``SELECT * FROM `test1` WHERE num2 = 10000;`` để truy vấn:

![](https://oss.javaguide.cn/github/javaguide/mysqlindex-invalidation-caused-by-implicit-conversion-03.png)

Từ kết quả có thể thấy, ba bản ghi dữ liệu vừa chèn vào sau đó cũng đều khớp. Vậy quy tắc chuyển đổi ngầm định của chuỗi này là gì? Tại sao ba trường hợp `num2='10000a'`, `'010000'` và `'10000'` đều có thể khớp? Tra cứu các tài liệu liên quan thì phát hiện quy tắc như sau:

1. Chuỗi **không bắt đầu bằng số** đều sẽ được chuyển đổi thành `0`. Ví dụ `'abc'`, `'a123bc'`, `'abc123'` đều sẽ được chuyển thành `0`;
2. Chuỗi **bắt đầu bằng số** khi chuyển đổi sẽ được cắt, cắt từ ký tự đầu tiên đến ký tự không phải số đầu tiên thì dừng. Ví dụ `'123abc'` sẽ được chuyển thành `123`, `'012abc'` sẽ được chuyển thành `012` tức là `12`, `'5.3a66b78c'` sẽ được chuyển thành `5.3`, các trường hợp khác tương tự.

Bây giờ thực hiện các kiểm thử sau để xác minh các quy tắc trên:

![](https://oss.javaguide.cn/github/javaguide/mysqlindex-invalidation-caused-by-implicit-conversion-04.png)

Như vậy cũng đã xác nhận lại kết quả truy vấn trước đó.

Viết thêm một câu SQL để truy vấn trường str1: ``SELECT * FROM `test1` WHERE str1 = 1234;``

![](https://oss.javaguide.cn/github/javaguide/mysqlindex-invalidation-caused-by-implicit-conversion-05.png)

## Phân tích và tổng kết

Thông qua các kiểm thử trên, chúng ta phát hiện một số đặc tính của MySQL khi sử dụng toán tử:

1. Khi **kiểu dữ liệu hai bên trái phải của toán tử không khớp**, sẽ xảy ra **chuyển đổi ngầm định**.
2. Khi toán tử truy vấn where có **bên trái là kiểu số** và xảy ra chuyển đổi ngầm định, thì ảnh hưởng đến hiệu quả không lớn, nhưng vẫn không khuyến khích làm như vậy.
3. Khi toán tử truy vấn where có **bên trái là kiểu chuỗi** và xảy ra chuyển đổi ngầm định, thì sẽ dẫn đến Index mất hiệu lực, gây ra quét toàn bảng với hiệu quả cực thấp.
4. Khi chuỗi được chuyển thành kiểu số, chuỗi không bắt đầu bằng số sẽ được chuyển thành `0`, chuỗi bắt đầu bằng số sẽ được cắt lấy giá trị từ ký tự đầu tiên đến ký tự không phải số đầu tiên làm kết quả chuyển đổi.

Vì vậy, khi viết SQL chúng ta nhất định phải hình thành thói quen tốt, trường truy vấn là kiểu gì thì điều kiện bên phải dấu bằng hãy viết thành kiểu tương ứng. Đặc biệt khi trường truy vấn là chuỗi, điều kiện bên phải dấu bằng nhất định phải được đặt trong dấu nháy kép để đánh dấu đây là một chuỗi, nếu không sẽ khiến Index mất hiệu lực và kích hoạt quét toàn bảng.

<!-- @include: @article-footer.snippet.md -->
