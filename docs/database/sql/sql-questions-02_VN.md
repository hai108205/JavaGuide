---
title: Tổng hợp câu hỏi phỏng vấn SQL thường gặp (Phần 2)
description: Bài thứ hai trong chuỗi tổng hợp câu hỏi phỏng vấn SQL thường gặp, giải thích chi tiết các câu lệnh DML thao tác dữ liệu như INSERT, UPDATE, DELETE, bao gồm các kỹ thuật thực chiến như chèn hàng loạt, nhập dữ liệu từ bảng khác, chèn kèm cập nhật.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu cơ bản
  - SQL
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn SQL,INSERT chèn dữ liệu,UPDATE cập nhật,DELETE xóa,chèn hàng loạt,REPLACE INTO,Thao tác dữ liệu
---

> Nguồn câu hỏi: [Nowcoder 题霸 - Thử thách SQL nâng cao](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=240)

## Thao tác thêm, xóa, sửa dữ liệu

Tổng hợp các cách chèn bản ghi trong SQL:

- **Chèn thông thường (tất cả các trường)**: `INSERT INTO table_name VALUES (value1, value2, ...)`
- **Chèn thông thường (chỉ định trường)**: `INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...)`
- **Chèn nhiều bản ghi cùng lúc**: `INSERT INTO table_name (column1, column2, ...) VALUES (value1_1, value1_2, ...), (value2_1, value2_2, ...), ...`
- **Nhập dữ liệu từ bảng khác**: `INSERT INTO table_name SELECT * FROM table_name2 [WHERE key=value]`
- **Chèn kèm cập nhật**: `REPLACE INTO table_name VALUES (value1, value2, ...)` (Lưu ý: nguyên lý của cách này là khi phát hiện khóa chính hoặc khóa của Unique Index bị trùng thì sẽ xóa bản ghi cũ rồi chèn lại)

### Chèn bản ghi (Phần 1)

**Mô tả**: Hệ thống backend của Nowcoder ghi lại lịch sử làm bài thi của mỗi người dùng vào bảng `exam_record`. Dưới đây là chi tiết bản ghi làm bài của hai người dùng:

- Người dùng 1001 bắt đầu làm đề thi 9001 lúc 22 giờ 11 phút 12 giây ngày 01/09/2021 và nộp bài sau 50 phút, đạt 90 điểm;
- Người dùng 1002 bắt đầu làm đề thi 9002 lúc 07 giờ 01 phút 02 giây ngày 04/09/2021 và thoát khỏi nền tảng sau 10 phút.

Bảng bản ghi làm bài thi `exam_record` đã được tạo sẵn, cấu trúc như sau. Hãy dùng một câu lệnh duy nhất để chèn hai bản ghi này vào bảng.

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | ---- | --- | -------------- | ------- | ------------------ |
| id          | int(11)    | NO   | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    | NO   |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    | NO   |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   | NO   |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

**Đáp án**:

```sql
// Có khóa chính tự tăng, không cần gán giá trị thủ công
INSERT INTO exam_record (uid, exam_id, start_time, submit_time, score) VALUES
(1001, 9001, '2021-09-01 22:11:12', '2021-09-01 23:01:12', 90),
(1002, 9002, '2021-09-04 07:01:02', NULL, NULL);
```

### Chèn bản ghi (Phần 2)

**Mô tả**: Hiện có bảng bản ghi làm bài thi `exam_record`, cấu trúc như bảng dưới, chứa bản ghi làm bài thi của người dùng trong nhiều năm. Do dữ liệu ngày càng nhiều, chi phí bảo trì ngày càng lớn, cần tinh gọn nội dung bảng dữ liệu và sao lưu dữ liệu lịch sử.

Bảng `exam_record`:

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | ---- | --- | -------------- | ------- | ------------------ |
| id          | int(11)    | NO   | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    | NO   |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    | NO   |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   | NO   |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

Chúng ta đã tạo một bảng mới `exam_record_before_2021` để sao lưu các bản ghi làm bài thi trước năm 2021, cấu trúc giống với bảng `exam_record`. Hãy nhập các bản ghi làm bài thi đã hoàn thành trước năm 2021 vào bảng này.

**Đáp án**:

```sql
INSERT INTO exam_record_before_2021 (uid, exam_id, start_time, submit_time, score)
SELECT uid,exam_id,start_time,submit_time,score
FROM exam_record
WHERE YEAR(submit_time) < 2021;
```

### Chèn bản ghi (Phần 3)

**Mô tả**: Hiện có một đề thi SQL độ khó cao với ID 9003, thời lượng làm bài là một tiếng rưỡi. Hãy chèn thời điểm phát hành là 2021-01-01 00:00:00 vào bảng thông tin đề thi `examination_info`. Bất kể đề thi có ID này đã tồn tại hay chưa, câu lệnh chèn vẫn phải thành công. Hãy thử chèn.

Bảng thông tin đề thi `examination_info`:

| Filed        | Type        | Null | Key | Extra          | Default | Comment                |
| ------------ | ----------- | ---- | --- | -------------- | ------- | ---------------------- |
| id           | int(11)     | NO   | PRI | auto_increment | (NULL)  | ID tự tăng             |
| exam_id      | int(11)     | NO   | UNI |                | (NULL)  | ID đề thi              |
| tag          | varchar(32) | YES  |     |                | (NULL)  | Nhãn danh mục          |
| difficulty   | varchar(8)  | YES  |     |                | (NULL)  | Độ khó                 |
| duration     | int(11)     | NO   |     |                | (NULL)  | Thời lượng (số phút)   |
| release_time | datetime    | YES  |     |                | (NULL)  | Thời gian phát hành    |

**Đáp án**:

```sql
REPLACE INTO examination_info VALUES
 (NULL, 9003, "SQL", "hard", 90, "2021-01-01 00:00:00");
```
### Cập nhật bản ghi (Phần 1)

**Mô tả**: Hiện có bảng thông tin đề thi `examination_info`, cấu trúc bảng như hình dưới:

| Filed        | Type     | Null | Key | Extra          | Default | Comment             |
| ------------ | -------- | ---- | --- | -------------- | ------- | ------------------- |
| id           | int(11)  | NO   | PRI | auto_increment | (NULL)  | ID tự tăng          |
| exam_id      | int(11)  | NO   | UNI |                | (NULL)  | ID đề thi           |
| tag          | char(32) | YES  |     |                | (NULL)  | Nhãn danh mục       |
| difficulty   | char(8)  | YES  |     |                | (NULL)  | Độ khó              |
| duration     | int(11)  | NO   |     |                | (NULL)  | Thời lượng          |
| release_time | datetime | YES  |     |                | (NULL)  | Thời gian phát hành |

Hãy sửa toàn bộ trường `tag` có giá trị `PYTHON` trong bảng **examination_info** thành `Python`.

**Hướng giải**: Bài này có hai hướng giải. Cách dễ nghĩ đến nhất là dùng trực tiếp `update + where` để chỉ định điều kiện cập nhật; cách thứ hai là tìm và thay thế dựa trên trường cần sửa.

**Đáp án 1**:

```sql
UPDATE examination_info SET tag = 'Python' WHERE tag='PYTHON'
```

**Đáp án 2**:

```sql
UPDATE examination_info
SET tag = REPLACE(tag,'PYTHON','Python')

# REPLACE (trường đích, "nội dung cần tìm", "nội dung thay thế")
```

### Cập nhật bản ghi (Phần 2)

**Mô tả**: Hiện có bảng bản ghi làm bài thi exam_record, chứa bản ghi làm bài thi của người dùng trong nhiều năm, cấu trúc như bảng dưới: Bảng bản ghi làm bài thi `exam_record`: **`submit_time`** là thời gian hoàn thành (hãy chú ý câu này)

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | ---- | --- | -------------- | ------- | ------------------ |
| id          | int(11)    | NO   | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    | NO   |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    | NO   |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   | NO   |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

**Yêu cầu đề bài**: Hãy sửa toàn bộ bản ghi ==chưa hoàn thành== trong bảng `exam_record` có thời gian bắt đầu làm bài ==trước== ngày 01/09/2021 thành hoàn thành thụ động, tức là: đổi thời gian hoàn thành thành '2099-01-01 00:00:00' và đổi điểm số thành 0.

**Hướng giải**: Hãy chú ý từ khóa trong đề bài (đã được tô sáng) `" xxx 时间 "` (thời gian xxx) với điều kiện "trước", vậy thì ở đây cần nghĩ ngay đến việc so sánh thời gian. Có thể dùng trực tiếp `xxx_time < "2021-09-01 00:00:00",` hoặc dùng hàm `date()` để so sánh; điều kiện thứ hai là `"未完成"` (chưa hoàn thành), tức thời gian hoàn thành là NULL, cũng chính là thời gian nộp bài trong đề bài ----- `submit_time 为 NULL` (submit_time là NULL).

**Đáp án**:

```sql
UPDATE exam_record SET submit_time = '2099-01-01 00:00:00', score = 0 WHERE DATE(start_time) < "2021-09-01" AND submit_time IS null
```

### Xóa bản ghi (Phần 1)

**Mô tả**: Hiện có bảng bản ghi làm bài thi `exam_record`, chứa bản ghi làm bài thi của người dùng trong nhiều năm, cấu trúc như bảng dưới:

Bảng bản ghi làm bài thi `exam_record:` **`start_time`** là thời gian bắt đầu đề thi, `submit_time` là thời gian nộp bài, tức thời gian kết thúc.

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | ---- | --- | -------------- | ------- | ------------------ |
| id          | int(11)    | NO   | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    | NO   |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    | NO   |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   | NO   |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

**Yêu cầu**: Hãy xóa các bản ghi trong bảng `exam_record` có thời gian làm bài nhỏ hơn tròn 5 phút và điểm số không đạt (mức đạt là 60 điểm);

**Hướng giải**: Bài này tuy là luyện tập thao tác xóa, nhưng nhìn kỹ thì thực chất là kiểm tra cách dùng các hàm thời gian. Việc so sánh số phút được nhắc đến ở đây thường dùng các hàm **`TIMEDIFF`** và **`TIMESTAMPDIFF`**, cách dùng của hai hàm hơi khác nhau, hàm sau linh hoạt hơn, chọn hàm nào tùy thói quen cá nhân.

1.　 `TIMEDIFF`: Chênh lệch giữa hai thời điểm

```sql
TIMEDIFF(time1, time2)
```

Cả hai tham số đều bắt buộc, đều là một biểu thức thời gian hoặc ngày giờ. Nếu tham số chỉ định không hợp lệ hoặc là NULL, hàm sẽ trả về NULL.

Với bài này, có thể dùng bên trong hàm minute, vì TIMEDIFF tính ra chênh lệch thời gian, bọc thêm hàm MINUTE bên ngoài thì giá trị tính được chính là số phút.

2. `TIMESTAMPDIFF`: Dùng để tính chênh lệch thời gian giữa hai ngày

```sql
TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2)
# Giải thích tham số
#unit: Đơn vị chênh lệch thời gian trả về khi so sánh ngày, các giá trị thường dùng như sau:
SECOND：giây
MINUTE：phút
HOUR：giờ
DAY：ngày
WEEK：tuần
MONTH：tháng
QUARTER：quý
YEAR：năm
# Hàm TIMESTAMPDIFF trả về kết quả datetime_expr2 - datetime_expr1 (nói dễ hiểu:  thời điểm sau - thời điểm trước, tức 2-1), trong đó datetime_expr1 và datetime_expr2 có thể là giá trị kiểu DATE hoặc DATETIME (nói dễ hiểu: có thể là "2023-01-01", cũng có thể là "2023-01-01- 00:00:00")
```

Bài này cần so sánh số phút, vậy thì là TIMESTAMPDIFF(MINUTE, thời gian bắt đầu, thời gian kết thúc) < 5

**Đáp án**:

```sql
DELETE FROM exam_record WHERE MINUTE (TIMEDIFF(submit_time , start_time)) < 5 AND score < 60
```

```sql
DELETE FROM exam_record WHERE TIMESTAMPDIFF(MINUTE, start_time, submit_time) < 5 AND score < 60
```
### Xóa bản ghi (Phần 2)

**Mô tả**: Hiện có bảng bản ghi làm bài thi `exam_record`, chứa bản ghi làm bài thi của người dùng trong nhiều năm, cấu trúc như bảng dưới:

Bảng bản ghi làm bài thi `exam_record`: `start_time` là thời gian bắt đầu đề thi, `submit_time` là thời gian nộp bài, tức thời gian kết thúc; nếu chưa hoàn thành thì giá trị này để trống.

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | :--: | --- | -------------- | ------- | ------------------ |
| id          | int(11)    |  NO  | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    |  NO  |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    |  NO  |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   |  NO  |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

**Yêu cầu**: Trong các bản ghi ==chưa hoàn thành== ==hoặc== có thời gian làm bài nhỏ hơn tròn 5 phút của bảng `exam_record`, hãy xóa 3 bản ghi có thời gian bắt đầu làm bài sớm nhất.

**Hướng giải**: Bài này khá đơn giản, nhưng cần chú ý thông tin đề bài đưa ra: thời gian kết thúc, nếu chưa hoàn thành thì để trống — đây thực chất chính là một điều kiện.

Điều kiện còn lại là nhỏ hơn 5 phút, tương tự bài trước, nhưng ở đây là **hoặc**, tức chỉ cần thỏa mãn một trong hai điều kiện; ngoài ra bài này cũng kiểm tra nhẹ cách dùng ORDER BY và LIMIT.

**Đáp án**:

```sql
DELETE FROM exam_record WHERE submit_time IS null OR TIMESTAMPDIFF(MINUTE, start_time, submit_time) < 5
ORDER BY start_time
LIMIT 3
# Mặc định là asc, desc là sắp xếp giảm dần
```

### Xóa bản ghi (Phần 3)

**Mô tả**: Hiện có bảng bản ghi làm bài thi exam_record, chứa bản ghi làm bài thi của người dùng trong nhiều năm, cấu trúc như bảng dưới:

| Filed       | Type       | Null | Key | Extra          | Default | Comment            |
| ----------- | ---------- | :--: | --- | -------------- | ------- | ------------------ |
| id          | int(11)    |  NO  | PRI | auto_increment | (NULL)  | ID tự tăng         |
| uid         | int(11)    |  NO  |     |                | (NULL)  | ID người dùng      |
| exam_id     | int(11)    |  NO  |     |                | (NULL)  | ID đề thi          |
| start_time  | datetime   |  NO  |     |                | (NULL)  | Thời gian bắt đầu  |
| submit_time | datetime   | YES  |     |                | (NULL)  | Thời gian nộp bài  |
| score       | tinyint(4) | YES  |     |                | (NULL)  | Điểm số            |

**Yêu cầu**: Hãy xóa toàn bộ bản ghi trong bảng `exam_record` ==và đặt lại khóa chính tự tăng==

**Hướng giải**: Bài này kiểm tra sự khác nhau giữa ba câu lệnh xóa, hãy chú ý phần được tô sáng: yêu cầu đặt lại khóa chính;

- `DROP`: Xóa sạch bảng, xóa cả cấu trúc bảng, không thể hoàn tác
- `TRUNCATE`: Định dạng lại bảng, không xóa cấu trúc bảng, không thể hoàn tác
- `DELETE`: Xóa dữ liệu, có thể hoàn tác

Lý do chọn `TRUNCATE` ở đây: TRUNCATE chỉ tác dụng lên bảng; `TRUNCATE` xóa toàn bộ các hàng trong bảng nhưng cấu trúc bảng cùng các ràng buộc, Index,... vẫn giữ nguyên; `TRUNCATE` đặt lại giá trị tự tăng của bảng; sau khi dùng `TRUNCATE`, không gian mà bảng và Index chiếm dụng sẽ được đưa về kích thước ban đầu.

Bài này cũng có thể dùng `DELETE`, nhưng sau khi xóa xong còn phải `ALTER` cấu trúc bảng thủ công để đặt lại giá trị ban đầu cho khóa chính;

Tương tự, cũng có thể dùng `DROP` để xóa trực tiếp toàn bộ bảng, bao gồm cả cấu trúc bảng, rồi tạo lại bảng mới.

**Đáp án**:

```sql
TRUNCATE  exam_record;
```

## Thao tác bảng và Index

### Tạo bảng mới

**Mô tả**: Hiện có bảng thông tin người dùng, chứa thông tin của những người dùng đã đăng ký trên nền tảng trong nhiều năm. Cùng với sự lớn mạnh không ngừng của nền tảng Nowcoder, số lượng người dùng tăng rất nhanh. Để phục vụ hiệu quả cho những người dùng hoạt động tích cực, cần tách một nhóm người dùng sang một bảng mới.

Bảng thông tin người dùng ban đầu:

| Filed         | Type        | Null | Key | Default           | Extra          | Comment              |
| ------------- | ----------- | ---- | --- | ----------------- | -------------- | -------------------- |
| id            | int(11)     | NO   | PRI | (NULL)            | auto_increment | ID tự tăng           |
| uid           | int(11)     | NO   | UNI | (NULL)            |                | ID người dùng        |
| nick_name     | varchar(64) | YES  |     | (NULL)            |                | Biệt danh            |
| achievement   | int(11)     | YES  |     | 0                 |                | Điểm thành tích      |
| level         | int(11)     | YES  |     | (NULL)            |                | Cấp độ người dùng    |
| job           | varchar(32) | YES  |     | (NULL)            |                | Hướng nghề nghiệp    |
| register_time | datetime    | YES  |     | CURRENT_TIMESTAMP |                | Thời gian đăng ký    |

Với vai trò là Data Analyst, hãy **tạo bảng thông tin người dùng chất lượng cao user_info_vip**, cấu trúc bảng giống với bảng thông tin người dùng.

Kết quả cần trả về như bảng dưới đây. Hãy viết câu lệnh tạo bảng để ghi lại toàn bộ các ràng buộc và mô tả trong bảng vào bảng.

| Filed         | Type        | Null | Key | Default           | Extra          | Comment              |
| ------------- | ----------- | ---- | --- | ----------------- | -------------- | -------------------- |
| id            | int(11)     | NO   | PRI | (NULL)            | auto_increment | ID tự tăng           |
| uid           | int(11)     | NO   | UNI | (NULL)            |                | ID người dùng        |
| nick_name     | varchar(64) | YES  |     | (NULL)            |                | Biệt danh            |
| achievement   | int(11)     | YES  |     | 0                 |                | Điểm thành tích      |
| level         | int(11)     | YES  |     | (NULL)            |                | Cấp độ người dùng    |
| job           | varchar(32) | YES  |     | (NULL)            |                | Hướng nghề nghiệp    |
| register_time | datetime    | YES  |     | CURRENT_TIMESTAMP |                | Thời gian đăng ký    |

**Hướng giải**: Nếu bài này cho tên bảng cũ thì có thể dùng trực tiếp `create table bảng_mới as select * from bảng_cũ;`, nhưng bài này không cho tên bảng cũ nên phải tự tạo bảng, chỉ cần chú ý tạo giá trị mặc định và khóa là được, khá đơn giản. (Lưu ý: nếu thực thi trên Nowcoder, hãy chú ý nội dung comment phải khớp với comment trong đề bài, bao gồm cả chữ hoa chữ thường, nếu không sẽ không qua được test; các ký tự cũng phải được thiết lập)

Đáp án:

```sql
CREATE TABLE IF NOT EXISTS user_info_vip(
    id INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT'自增ID',
    uid INT(11) UNIQUE NOT NULL COMMENT '用户ID',
    nick_name VARCHAR(64) COMMENT'昵称',
    achievement INT(11) DEFAULT 0 COMMENT '成就值',
    `level` INT(11) COMMENT '用户等级',
    job VARCHAR(32) COMMENT '职业方向',
    register_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
)CHARACTER SET UTF8
```
### Sửa bảng

**Mô tả**: Hiện có bảng thông tin người dùng `user_info`, chứa thông tin của những người dùng đã đăng ký trên nền tảng trong nhiều năm.

**Bảng thông tin người dùng `user_info`:**

| Filed         | Type        | Null | Key | Default           | Extra          | Comment              |
| ------------- | ----------- | ---- | --- | ----------------- | -------------- | -------------------- |
| id            | int(11)     | NO   | PRI | (NULL)            | auto_increment | ID tự tăng           |
| uid           | int(11)     | NO   | UNI | (NULL)            |                | ID người dùng        |
| nick_name     | varchar(64) | YES  |     | (NULL)            |                | Biệt danh            |
| achievement   | int(11)     | YES  |     | 0                 |                | Điểm thành tích      |
| level         | int(11)     | YES  |     | (NULL)            |                | Cấp độ người dùng    |
| job           | varchar(32) | YES  |     | (NULL)            |                | Hướng nghề nghiệp    |
| register_time | datetime    | YES  |     | CURRENT_TIMESTAMP |                | Thời gian đăng ký    |

**Yêu cầu:** Trong bảng thông tin người dùng, hãy thêm một cột `school` lưu tối đa 15 ký tự vào sau trường `level`; đổi tên cột `job` trong bảng thành `profession`, đồng thời đổi độ dài trường `varchar` thành 10; đặt giá trị mặc định của `achievement` là 0.

**Hướng giải**: Trước khi làm bài này, cần nắm được cú pháp cơ bản của câu lệnh ALTER:

- Thêm một cột: `ALTER TABLE tên_bảng ADD COLUMN tên_cột kiểu_dữ_liệu 【first | after tên_trường】;` (first: thêm trước cột nào đó, after thì ngược lại)
- Sửa kiểu dữ liệu hoặc ràng buộc của cột: `ALTER TABLE tên_bảng MODIFY COLUMN tên_cột kiểu_mới 【ràng_buộc_mới】;`
- Đổi tên cột: `ALTER TABLE tên_bảng change COLUMN tên_cột_cũ tên_cột_mới kiểu_dữ_liệu;`
- Xóa cột: `ALTER TABLE tên_bảng drop COLUMN tên_cột;`
- Đổi tên bảng: `ALTER TABLE tên_bảng rename 【to】 tên_bảng_mới;`
- Đưa một cột lên vị trí cột đầu tiên: `ALTER TABLE tên_bảng MODIFY COLUMN tên_cột kiểu_dữ_liệu first;`

Từ khóa `COLUMN` thực ra có thể bỏ qua không viết, ở đây vẫn liệt kê đầy đủ để đảm bảo tính chuẩn tắc.

Khi sửa, nếu có nhiều hạng mục cần sửa thì có thể viết gộp lại với nhau, nhưng cần chú ý định dạng.

**Đáp án**:

```sql
ALTER TABLE user_info
    ADD school VARCHAR(15) AFTER level,
    CHANGE job profession VARCHAR(10),
    MODIFY achievement INT(11) DEFAULT 0;
```

### Xóa bảng

**Mô tả**: Hiện có bảng bản ghi làm bài thi `exam_record`, chứa bản ghi làm bài thi của người dùng trong nhiều năm. Thông thường mỗi năm sẽ tạo một bảng sao lưu `exam_record_{YEAR}` cho bảng `exam_record`, trong đó `{YEAR}` là năm tương ứng.

Hiện tại dữ liệu ngày càng nhiều, dung lượng lưu trữ sắp cạn, hãy xóa các bảng sao lưu từ rất lâu trước đây (từ năm 2011 đến 2014) (nếu chúng tồn tại).

**Hướng giải**: Bài này rất đơn giản, cứ xóa trực tiếp là được. Nếu ngại phiền, có thể liệt kê các bảng cần xóa cách nhau bằng dấu phẩy trên cùng một dòng; chắc chắn sẽ có bạn hỏi: nếu cần xóa rất nhiều bảng thì sao? Yên tâm, nếu cần xóa nhiều bảng thì có thể viết script để xóa.

**Đáp án**:

```sql
DROP TABLE IF EXISTS exam_record_2011;
DROP TABLE IF EXISTS exam_record_2012;
DROP TABLE IF EXISTS exam_record_2013;
DROP TABLE IF EXISTS exam_record_2014;
```

### Tạo Index

**Mô tả**: Hiện có bảng thông tin đề thi `examination_info`, chứa thông tin của các loại đề thi khác nhau. Để truy vấn bảng thuận tiện và nhanh chóng hơn, cần tạo các Index sau trên bảng `examination_info`,

quy tắc như sau: tạo Index thông thường `idx_duration` trên cột `duration`, tạo Unique Index `uniq_idx_exam_id` trên cột `exam_id`, tạo Full-text Index `full_idx_tag` trên cột `tag`.

Theo yêu cầu đề bài, kết quả trả về như sau:

| examination_info | 0   | PRIMARY          | 1   | id       | A   | 0   |     |     |     | BTREE    |
| ---------------- | --- | ---------------- | --- | -------- | --- | --- | --- | --- | --- | -------- |
| examination_info | 0   | uniq_idx_exam_id | 1   | exam_id  | A   | 0   |     |     | YES | BTREE    |
| examination_info | 1   | idx_duration     | 1   | duration | A   | 0   |     |     |     | BTREE    |
| examination_info | 1   | full_idx_tag     | 1   | tag      |     | 0   |     |     | YES | FULLTEXT |

Ghi chú: Hệ thống chấm bài sẽ so sánh kết quả đầu ra thông qua câu lệnh `SHOW INDEX FROM examination_info`

**Hướng giải**: Để làm bài này, trước hết cần nắm được các loại Index thường gặp:

- B-Tree Index: B-Tree Index (hay còn gọi là cây cân bằng) là loại Index phổ biến nhất và cũng là loại mặc định. Nó phù hợp với nhiều loại điều kiện truy vấn khác nhau, có thể nhanh chóng định vị dữ liệu thỏa mãn điều kiện. B-Tree Index phù hợp với các thao tác tìm kiếm thông thường, hỗ trợ truy vấn bằng giá trị (equal-value query), truy vấn theo khoảng (range query) và sắp xếp.
- Unique Index: Unique Index tương tự B-Tree Index thông thường, điểm khác biệt là nó yêu cầu giá trị của cột được đánh Index phải là duy nhất. Điều này có nghĩa là khi chèn hoặc cập nhật dữ liệu, MySQL sẽ kiểm tra tính duy nhất của cột được đánh Index.
- Primary Key Index: Primary Key Index là một dạng Unique Index đặc biệt, dùng để định danh duy nhất mỗi hàng dữ liệu trong bảng. Mỗi bảng chỉ có thể có một Primary Key Index, nó giúp tăng tốc độ truy cập dữ liệu và đảm bảo tính toàn vẹn dữ liệu.
- Full-text Index: Full-text Index dùng để tìm kiếm toàn văn (full-text search) trong dữ liệu văn bản. Nó hỗ trợ tìm kiếm từ khóa trong các trường văn bản, chứ không chỉ đơn thuần là tìm kiếm theo giá trị bằng hoặc theo khoảng. Full-text Index phù hợp với các ứng dụng cần tìm kiếm toàn văn.

```sql
-- Ví dụ:
-- Thêm B-Tree Index:
	CREATE INDEX idx_name(tên index) ON tên_bảng (tên_trường);   -- idx_name là tên index, các câu bên dưới cũng vậy
-- Tạo Unique Index:
	CREATE UNIQUE INDEX idx_name ON tên_bảng (tên_trường);
-- Tạo Primary Key Index:
	ALTER TABLE tên_bảng ADD PRIMARY KEY (tên_trường);
-- Tạo Full-text Index
	ALTER TABLE tên_bảng ADD FULLTEXT INDEX idx_name (tên_trường);

-- Qua các ví dụ trên, có thể thấy cả create và alter đều có thể thêm Index
```

Sau khi đã có kiến thức nền tảng trên, đáp án của bài này cũng dần lộ diện.

**Đáp án**:

```sql
ALTER TABLE examination_info
    ADD INDEX idx_duration(duration),
    ADD UNIQUE INDEX uniq_idx_exam_id(exam_id),
    ADD FULLTEXT INDEX full_idx_tag(tag);
```

### Xóa Index

**Mô tả**: Hãy xóa Unique Index uniq_idx_exam_id và Full-text Index full_idx_tag trên bảng `examination_info`.

**Hướng giải**: Bài này kiểm tra cú pháp cơ bản của thao tác xóa Index:

```sql
-- Dùng DROP INDEX để xóa Index
DROP INDEX idx_name ON tên_bảng;

-- Dùng ALTER TABLE để xóa Index
ALTER TABLE employees DROP INDEX idx_email;
```

Ở đây cần lưu ý: trong MySQL, không hỗ trợ xóa nhiều Index cùng một lúc. Mỗi lần xóa Index chỉ có thể chỉ định một tên Index để xóa.

Ngoài ra, lệnh **DROP** cần được sử dụng hết sức thận trọng!!!

**Đáp án**:

```sql
DROP INDEX uniq_idx_exam_id ON examination_info;
DROP INDEX full_idx_tag ON examination_info;
```

<!-- @include: @article-footer.snippet.md -->
