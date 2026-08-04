---
title: Tổng hợp câu hỏi phỏng vấn SQL thường gặp (5)
description: Bài thứ năm trong chuỗi tổng hợp câu hỏi phỏng vấn SQL thường gặp, giải thích chi tiết kỹ thuật xử lý giá trị NULL, bao gồm hàm IFNULL, COALESCE, cùng với thống kê có điều kiện và tính tỷ lệ hoàn thành bằng CASE WHEN.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu cơ bản
  - SQL
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn SQL,Xử lý giá trị NULL,IFNULL,COALESCE,CASE WHEN,Thống kê có điều kiện,Tính tỷ lệ hoàn thành
---

> Đề bài lấy từ: [Nowcoder Đề bá - Thử thách SQL nâng cao](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=240)

Các câu hỏi mức khá khó hoặc khó có thể tùy theo tình hình thực tế của bản thân và nhu cầu phỏng vấn để quyết định có bỏ qua hay không.

## Xử lý giá trị rỗng

### Thống kê số lượng chưa hoàn thành và tỷ lệ chưa hoàn thành của các đề thi có trạng thái chưa hoàn thành

**Mô tả**:

Hiện có bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số), dữ liệu như sau:

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:01 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | 2021-05-02 10:30:01 | 81     |
| 3   | 1001 | 9001    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |

Hãy thống kê số lượng chưa hoàn thành incomplete_cnt và tỷ lệ chưa hoàn thành incomplete_rate của các đề thi có trạng thái chưa hoàn thành. Kết quả đầu ra từ dữ liệu mẫu như sau:

| exam_id | incomplete_cnt | complete_rate |
| ------- | -------------- | ------------- |
| 9001    | 1              | 0.333         |

Giải thích: Đề thi 9001 có 3 bản ghi đã được làm, trong đó hai lần hoàn thành, 1 lần chưa hoàn thành, vì vậy số lượng chưa hoàn thành là 1, tỷ lệ chưa hoàn thành là 0.333 (giữ lại 3 chữ số thập phân)

**Hướng giải**:

Câu này chỉ cần chú ý một điểm là một bên có điều kiện ràng buộc, một bên không có điều kiện ràng buộc; hoặc lần lượt truy vấn các điều kiện rồi gộp lại; hoặc trực tiếp thực hiện phán đoán điều kiện bên trong select.

**Đáp án**:

Cách viết 1:

```sql
SELECT
    exam_id,
    (COUNT(*) - COUNT(submit_time)) AS incomplete_cnt,
    ROUND((COUNT(*) - COUNT(submit_time)) / COUNT(*), 3) AS incomplete_rate
FROM
    exam_record
GROUP BY
    exam_id
HAVING
    (COUNT(*) - COUNT(submit_time)) > 0;
```

Dùng `COUNT(*)` để thống kê tổng số bản ghi trong nhóm, `COUNT(submit_time)` chỉ thống kê số bản ghi có trường `submit_time` khác NULL (tức số đã hoàn thành). Lấy hai giá trị trừ nhau sẽ được số chưa hoàn thành.

Cách viết 2:

```sql
SELECT
    exam_id,
    COUNT(CASE WHEN submit_time IS NULL THEN 1 END) AS incomplete_cnt,
    ROUND(COUNT(CASE WHEN submit_time IS NULL THEN 1 END) / COUNT(*), 3) AS incomplete_rate
FROM
    exam_record
GROUP BY
    exam_id
HAVING
    COUNT(CASE WHEN submit_time IS NULL THEN 1 END) > 0;
```

Sử dụng biểu thức `CASE`, khi điều kiện thỏa mãn thì trả về một giá trị khác `NULL` (ví dụ 1), ngược lại trả về `NULL`. Sau đó dùng hàm `COUNT` để thống kê số lượng giá trị khác `NULL`.

Cách viết 3:

```sql
SELECT
    exam_id,
    SUM(submit_time IS NULL) AS incomplete_cnt,
    ROUND(SUM(submit_time IS NULL) / COUNT(*), 3) AS incomplete_rate
FROM
    exam_record
GROUP BY
    exam_id
HAVING
    incomplete_cnt > 0;
```

Dùng hàm `SUM` để tính tổng một biểu thức. Khi `submit_time` là `NULL`, biểu thức `(submit_time IS NULL)` có giá trị là 1 (TRUE), ngược lại là 0 (FALSE). Cộng các giá trị 1 và 0 này lại sẽ được số lượng chưa hoàn thành.

### Thời gian trung bình và điểm trung bình của người dùng cấp 0 với đề thi độ khó cao

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký), dữ liệu như sau:

| id  | uid  | nick_name | achievement | level | job  | register_time       |
| --- | ---- | --------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号 | 10          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号 | 2100        | 6     | 算法 | 2020-01-01 10:00:00 |

Bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` thể loại đề thi, `difficulty` độ khó của đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành), dữ liệu như sau:

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | SQL  | easy       | 60       | 2020-01-01 10:00:00 |
| 3   | 9004    | 算法 | medium     | 80       | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số), dữ liệu như sau:

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | (NULL)              | (NULL) |
| 3   | 1001 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 4   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:32:00 | 20     |
| 5   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 6   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 7   | 1002 | 9002    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |

Hãy đầu ra thời gian trung bình và điểm trung bình của tất cả các đề thi độ khó cao mà mỗi người dùng cấp 0 đã thi, đề chưa hoàn thành được xử lý mặc định bằng thời lượng làm bài tối đa của đề và 0 điểm. Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | avg_score | avg_time_took |
| ---- | --------- | ------------- |
| 1001 | 33        | 36.7          |

Giải thích: Người dùng cấp 0 có 1001, đề thi độ khó cao có 9001, bản ghi 1001 làm đề 9001 có 3 bản, lần lượt mất 20 phút, chưa hoàn thành (thời lượng đề thi 60 phút), 30 phút (chưa đủ 31 phút), điểm số lần lượt là 80 điểm, chưa hoàn thành (xử lý 0 điểm), 20 điểm. Vì vậy thời gian trung bình của người này là 110/3=36.7 (giữ lại một chữ số thập phân), điểm trung bình là 33 điểm (lấy phần nguyên)

**Hướng giải**: Câu này dùng `IF` để phán đoán là tiện nhất, vì liên quan đến phán đoán giá trị NULL. Tất nhiên `case when` cũng được, về cơ bản là giống nhau. Điểm khó của câu này nằm ở việc xử lý giá trị rỗng, còn các điều kiện truy vấn khác, tôi tin là không làm khó được mọi người.

**Đáp án**:

```sql
SELECT UID,
       round(avg(new_socre)) AS avg_score,
       round(avg(time_diff), 1) AS avg_time_took
FROM
  (SELECT er.uid,
          IF (er.submit_time IS NOT NULL, TIMESTAMPDIFF(MINUTE, start_time, submit_time), ef.duration) AS time_diff,
          IF (er.submit_time IS NOT NULL,er.score,0) AS new_socre
   FROM exam_record er
   LEFT JOIN user_info uf ON er.uid = uf.uid
   LEFT JOIN examination_info ef ON er.exam_id = ef.exam_id
   WHERE uf.LEVEL = 0 AND ef.difficulty = 'hard' ) t
GROUP BY UID
ORDER BY UID
```

## Câu lệnh điều kiện nâng cao

### Lọc người dùng theo quy tắc biệt danh, điểm thành tích và ngày hoạt động (khá khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name   | achievement | level | job  | register_time       |
| --- | ---- | ----------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号   | 1000        | 2     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号   | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 进击的 3 号 | 2200        | 5     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号   | 2500        | 6     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 5 号   | 3000        | 7     | C++  | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80     |
| 3   | 1001 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | (NULL)              | (NULL) |
| 4   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:32:00 | 20     |
| 6   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 11  | 1002 | 9001    | 2020-01-01 12:01:01 | 2020-01-01 12:31:01 | 81     |
| 12  | 1002 | 9002    | 2020-02-01 12:01:01 | 2020-02-01 12:31:01 | 82     |
| 13  | 1002 | 9002    | 2020-02-02 12:11:01 | 2020-02-02 12:31:01 | 83     |
| 7   | 1002 | 9002    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |
| 16  | 1002 | 9001    | 2021-09-06 12:01:01 | 2021-09-06 12:21:01 | 80     |
| 17  | 1002 | 9001    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 18  | 1002 | 9001    | 2021-09-07 12:01:01 | (NULL)              | (NULL) |
| 8   | 1003 | 9003    | 2021-02-06 12:01:01 | (NULL)              | (NULL) |
| 9   | 1003 | 9001    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 89     |
| 10  | 1004 | 9002    | 2021-08-06 12:01:01 | (NULL)              | (NULL) |
| 14  | 1005 | 9001    | 2021-02-01 11:01:01 | 2021-02-01 11:31:01 | 84     |
| 15  | 1006 | 9001    | 2021-02-01 11:01:01 | 2021-02-01 11:31:01 | 84     |

Bảng bản ghi luyện đề `practice_record` (`uid` ID người dùng, `question_id` ID câu hỏi, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | question_id | submit_time         | score |
| --- | ---- | ----------- | ------------------- | ----- |
| 1   | 1001 | 8001        | 2021-08-02 11:41:01 | 60    |
| 2   | 1002 | 8001        | 2021-09-02 19:30:01 | 50    |
| 3   | 1002 | 8001        | 2021-09-02 19:20:01 | 70    |
| 4   | 1002 | 8002        | 2021-09-02 19:38:01 | 70    |
| 5   | 1003 | 8002        | 2021-09-01 19:38:01 | 80    |

Hãy tìm thông tin người dùng có biệt danh bắt đầu bằng 『牛客』 và kết thúc bằng 『号』, điểm thành tích trong khoảng 1200~2500, và lần hoạt động gần nhất (trả lời câu hỏi hoặc làm đề thi) là vào tháng 9 năm 2021.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | nick_name | achievement |
| ---- | --------- | ----------- |
| 1002 | 牛客 2 号 | 1200        |

**Giải thích**: Người có biệt danh bắt đầu bằng 『牛客』, kết thúc bằng 『号』 và điểm thành tích trong khoảng 1200~2500 là 1002, 1004;

Lần hoạt động gần nhất của 1002 ở khu đề thi là tháng 9 năm 2021, lần hoạt động gần nhất ở khu câu hỏi là tháng 9 năm 2021; lần hoạt động gần nhất của 1004 ở khu đề thi là tháng 8 năm 2021, khu câu hỏi không hoạt động.

Vì vậy người thỏa mãn điều kiện cuối cùng chỉ có 1002.

**Hướng giải**:

Trước tiên dựa vào điều kiện để liệt kê các câu truy vấn chính

Biệt danh bắt đầu bằng 『牛客』 và kết thúc bằng 『号』: `nick_name LIKE "牛客%号"`

Điểm thành tích trong khoảng 1200~2500: `achievement BETWEEN 1200 AND 2500`

Điều kiện thứ ba vì đã giới hạn là tháng 9, nên cứ viết trực tiếp: `( date_format( record.submit_time, '%Y%m' )= 202109 OR date_format( pr.submit_time, '%Y%m' )= 202109 )`

**Đáp án**:

```sql
SELECT DISTINCT u_info.uid,
                u_info.nick_name,
                u_info.achievement
FROM user_info u_info
LEFT JOIN exam_record record ON record.uid = u_info.uid
LEFT JOIN practice_record pr ON u_info.uid = pr.uid
WHERE u_info.nick_name LIKE "牛客%号"
  AND u_info.achievement BETWEEN 1200
  AND 2500
  AND (date_format(record.submit_time, '%Y%m')= 202109
       OR date_format(pr.submit_time, '%Y%m')= 202109)
GROUP BY u_info.uid
```

### Lọc bản ghi làm bài theo quy tắc biệt danh và quy tắc đề thi (khá khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name    | achievement | level | job  | register_time       |
| --- | ---- | ------------ | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号    | 1900        | 2     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号    | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂ | 2200        | 5     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号    | 2500        | 6     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 555 号  | 2000        | 7     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 666666       | 3000        | 6     | C++  | 2020-01-01 10:00:00 |

Bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` thể loại đề thi, `difficulty` độ khó của đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag | difficulty | duration | release_time        |
| --- | ------- | --- | ---------- | -------- | ------------------- |
| 1   | 9001    | C++ | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | c#  | hard       | 80       | 2020-01-01 10:00:00 |
| 3   | 9003    | SQL | medium     | 70       | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | (NULL)              | (NULL) |
| 4   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:32:00 | 20     |
| 3   | 1001 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 5   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 6   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 11  | 1002 | 9001    | 2020-01-01 12:01:01 | 2020-01-01 12:31:01 | 81     |
| 16  | 1002 | 9001    | 2021-09-06 12:01:01 | 2021-09-06 12:21:01 | 80     |
| 17  | 1002 | 9001    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 18  | 1002 | 9001    | 2021-09-07 12:01:01 | (NULL)              | (NULL) |
| 7   | 1002 | 9002    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |
| 12  | 1002 | 9002    | 2020-02-01 12:01:01 | 2020-02-01 12:31:01 | 82     |
| 13  | 1002 | 9002    | 2020-02-02 12:11:01 | 2020-02-02 12:31:01 | 83     |
| 9   | 1003 | 9001    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 89     |
| 8   | 1003 | 9003    | 2021-02-06 12:01:01 | (NULL)              | (NULL) |
| 10  | 1004 | 9002    | 2021-08-06 12:01:01 | (NULL)              | (NULL) |
| 14  | 1005 | 9001    | 2021-02-01 11:01:01 | 2021-02-01 11:31:01 | 84     |
| 15  | 1006 | 9001    | 2021-02-01 11:01:01 | 2021-09-01 11:31:01 | 84     |

Tìm những người dùng có biệt danh gồm "牛客" + số thuần + "号" hoặc chỉ gồm số thuần, với các đề thi đã hoàn thành thuộc thể loại đề thi bắt đầu bằng chữ cái c (như C, C++, c#, v.v.), đầu ra ID đề thi và điểm trung bình, sắp xếp theo ID người dùng, điểm trung bình tăng dần. Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | exam_id | avg_score |
| ---- | ------- | --------- |
| 1002 | 9001    | 81        |
| 1002 | 9002    | 85        |
| 1005 | 9001    | 84        |
| 1006 | 9001    | 84        |

Giải thích: Người dùng có biệt danh thỏa mãn điều kiện là 1002, 1004, 1005, 1006;

Các đề thi bắt đầu bằng c là 9001, 9002;

Trong các bản ghi làm bài thỏa mãn điều kiện trên, điểm của 1002 khi hoàn thành đề 9001 là 81, 80, điểm trung bình là 81 (80.5 làm tròn được 81);

Điểm của 1002 khi hoàn thành đề 9002 là 90, 82, 83, điểm trung bình là 85;

**Hướng giải**:

Vẫn như cũ, vì đã đưa ra điều kiện, nên trước tiên viết từng điều kiện ra

Tìm người dùng có biệt danh gồm "牛客" + số thuần + "号" hoặc chỉ gồm số thuần: Ban đầu tôi viết như sau: `nick_name LIKE '牛客%号' OR nick_name REGEXP '^[0-9]+$'`, nếu trong bảng có "牛客 H 号" thì cũng sẽ lọt qua.

Vì vậy ở đây vẫn phải dùng biểu thức chính quy: `nick_name LIKE '^牛客[0-9]+号'`

Đối với thể loại đề thi bắt đầu bằng chữ cái c: `e_info.tag LIKE 'c%'` hoặc `tag regexp '^c|^C'`, cách đầu tiên cũng có thể khớp với chữ C hoa

**Đáp án**:

```sql
SELECT UID,
       exam_id,
       ROUND(AVG(score), 0) avg_score
FROM exam_record
WHERE UID IN
    (SELECT UID
     FROM user_info
     WHERE nick_name RLIKE "^牛客[0-9]+号 $"
       OR nick_name RLIKE "^[0-9]+$")
  AND exam_id IN
    (SELECT exam_id
     FROM examination_info
     WHERE tag RLIKE "^[cC]")
  AND score IS NOT NULL
GROUP BY UID,exam_id
ORDER BY UID,avg_score;
```

### Đầu ra các trường hợp khác nhau tùy theo bản ghi chỉ định có tồn tại hay không (khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name   | achievement | level | job  | register_time       |
| --- | ---- | ----------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号   | 19          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号   | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 进击的 3 号 | 22          | 0     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号   | 25          | 0     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 555 号 | 2000        | 7     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 666666      | 3000        | 6     | C++  | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | (NULL)              | (NULL) |
| 3   | 1001 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 4   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5   | 1001 | 9003    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 6   | 1001 | 9004    | 2021-09-03 12:01:01 | (NULL)              | (NULL) |
| 7   | 1002 | 9001    | 2020-01-01 12:01:01 | 2020-01-01 12:31:01 | 99     |
| 8   | 1002 | 9003    | 2020-02-01 12:01:01 | 2020-02-01 12:31:01 | 82     |
| 9   | 1002 | 9003    | 2020-02-02 12:11:01 | (NULL)              | (NULL) |
| 10  | 1002 | 9002    | 2021-05-05 18:01:01 | (NULL)              | (NULL) |
| 11  | 1002 | 9001    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 12  | 1003 | 9003    | 2021-02-06 12:01:01 | (NULL)              | (NULL) |
| 13  | 1003 | 9001    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 89     |

Hãy lọc dữ liệu trong bảng, khi có bất kỳ người dùng cấp 0 nào có số đề thi chưa hoàn thành lớn hơn 2, đầu ra số đề thi chưa hoàn thành và tỷ lệ chưa hoàn thành (giữ lại 3 chữ số thập phân) của mỗi người dùng cấp 0; nếu không tồn tại người dùng như vậy, thì đầu ra hai chỉ số này của tất cả người dùng có bản ghi làm bài. Kết quả sắp xếp theo tỷ lệ chưa hoàn thành tăng dần.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | incomplete_cnt | incomplete_rate |
| ---- | -------------- | --------------- |
| 1004 | 0              | 0.000           |
| 1003 | 1              | 0.500           |
| 1001 | 4              | 0.667           |

**Giải thích**: Người dùng cấp 0 có 1001, 1003, 1004; số đề thi đã làm và số chưa hoàn thành của họ lần lượt là: 6:4, 2:1, 0:0;

Tồn tại người dùng cấp 0 là 1001 có số đề thi chưa hoàn thành lớn hơn 2, vì vậy đầu ra số chưa hoàn thành và tỷ lệ chưa hoàn thành của ba người dùng này (1004 chưa từng làm đề thi nào, tỷ lệ chưa hoàn thành mặc định điền 0, sau khi giữ lại 3 chữ số thập phân là 0.000);

Kết quả sắp xếp theo tỷ lệ chưa hoàn thành tăng dần.

Kèm theo: Nếu 1001 không thỏa mãn 『số đề thi chưa hoàn thành lớn hơn 2』, thì cần đầu ra hai chỉ số này của 1001, 1002, 1003, vì trong bảng bản ghi làm đề thi chỉ có bản ghi làm bài của ba người dùng này.

**Hướng giải**:

Trước tiên viết SQL có thể thỏa mãn điều kiện **"người dùng cấp 0 có số đề thi chưa hoàn thành lớn hơn 2"**

```sql
SELECT ui.uid UID
FROM user_info ui
LEFT JOIN exam_record er ON ui.uid = er.uid
WHERE ui.uid IN
    (SELECT ui.uid
     FROM user_info ui
     LEFT JOIN exam_record er ON ui.uid = er.uid
     WHERE er.submit_time IS NULL
       AND ui.LEVEL = 0 )
GROUP BY ui.uid
HAVING sum(IF(er.submit_time IS NULL, 1, 0)) > 2
```

Sau đó lần lượt viết câu truy vấn SQL cho hai trường hợp:

Trường hợp 1. Truy vấn tỷ lệ đề thi chưa hoàn thành của người dùng cấp 0 tồn tại theo yêu cầu điều kiện

```sql
SELECT
	tmp1.uid uid,
	sum(
	IF
	( er.submit_time IS NULL AND er.start_time IS NOT NULL, 1, 0 )) incomplete_cnt,
	round(
		sum(
		IF
		( er.submit_time IS NULL AND er.start_time IS NOT NULL, 1, 0 ))/ count( tmp1.uid ),
		3
	) incomplete_rate
FROM
	(
	SELECT DISTINCT
		ui.uid
	FROM
		user_info ui
		LEFT JOIN exam_record er ON ui.uid = er.uid
	WHERE
		er.submit_time IS NULL
		AND ui.LEVEL = 0
	) tmp1
	LEFT JOIN exam_record er ON tmp1.uid = er.uid
GROUP BY
	tmp1.uid
ORDER BY
	incomplete_rate
```

Trường hợp 2. Truy vấn tỷ lệ đề thi chưa hoàn thành của tất cả người dùng có bản ghi làm bài khi không tồn tại yêu cầu điều kiện

```sql
SELECT
	ui.uid uid,
	sum( CASE WHEN er.submit_time IS NULL AND er.start_time IS NOT NULL THEN 1 ELSE 0 END ) incomplete_cnt,
	round(
		sum(
		IF
		( er.submit_time IS NULL AND er.start_time IS NOT NULL, 1, 0 ))/ count( ui.uid ),
		3
	) incomplete_rate
FROM
	user_info ui
	JOIN exam_record er ON ui.uid = er.uid
GROUP BY
	ui.uid
ORDER BY
	incomplete_rate
```

Ghép lại với nhau, chính là đáp án

```sql
WITH host_user AS
  (SELECT ui.uid UID
   FROM user_info ui
   LEFT JOIN exam_record er ON ui.uid = er.uid
   WHERE ui.uid IN
       (SELECT ui.uid
        FROM user_info ui
        LEFT JOIN exam_record er ON ui.uid = er.uid
        WHERE er.submit_time IS NULL
          AND ui.LEVEL = 0 )
   GROUP BY ui.uid
   HAVING sum(IF (er.submit_time IS NULL, 1, 0))> 2),
     tt1 AS
  (SELECT tmp1.uid UID,
                   sum(IF (er.submit_time IS NULL
                           AND er.start_time IS NOT NULL, 1, 0)) incomplete_cnt,
                   round(sum(IF (er.submit_time IS NULL
                                 AND er.start_time IS NOT NULL, 1, 0))/ count(tmp1.uid), 3) incomplete_rate
   FROM
     (SELECT DISTINCT ui.uid
      FROM user_info ui
      LEFT JOIN exam_record er ON ui.uid = er.uid
      WHERE er.submit_time IS NULL
        AND ui.LEVEL = 0 ) tmp1
   LEFT JOIN exam_record er ON tmp1.uid = er.uid
   GROUP BY tmp1.uid
   ORDER BY incomplete_rate),
     tt2 AS
  (SELECT ui.uid UID,
                 sum(CASE
                         WHEN er.submit_time IS NULL
                              AND er.start_time IS NOT NULL THEN 1
                         ELSE 0
                     END) incomplete_cnt,
                 round(sum(IF (er.submit_time IS NULL
                               AND er.start_time IS NOT NULL, 1, 0))/ count(ui.uid), 3) incomplete_rate
   FROM user_info ui
   JOIN exam_record er ON ui.uid = er.uid
   GROUP BY ui.uid
   ORDER BY incomplete_rate)
  (SELECT tt1.*
   FROM tt1
   LEFT JOIN
     (SELECT UID
      FROM host_user) t1 ON 1 = 1
   WHERE t1.uid IS NOT NULL )
UNION ALL
  (SELECT tt2.*
   FROM tt2
   LEFT JOIN
     (SELECT UID
      FROM host_user) t2 ON 1 = 1
   WHERE t2.uid IS NULL)
```

Phiên bản V2 (dựa trên cải tiến ở trên, đáp án được rút ngắn, logic chặt chẽ hơn):

```sql
SELECT
	ui.uid,
	SUM(
	IF
	( start_time IS NOT NULL AND score IS NULL, 1, 0 )) AS incomplete_cnt,#3.Số đề thi chưa hoàn thành
	ROUND( AVG( IF ( start_time IS NOT NULL AND score IS NULL, 1, 0 )), 3 ) AS incomplete_rate #4.Tỷ lệ chưa hoàn thành

FROM
	user_info ui
	LEFT JOIN exam_record USING ( uid )
WHERE
CASE

		WHEN (#1.Khi có bất kỳ người dùng cấp 0 nào có số đề thi chưa hoàn thành lớn hơn 2
		SELECT
			MAX( lv0_incom_cnt )
		FROM
			(
			SELECT
				SUM(
				IF
				( score IS NULL, 1, 0 )) AS lv0_incom_cnt
			FROM
				user_info
				JOIN exam_record USING ( uid )
			WHERE
				LEVEL = 0
			GROUP BY
				uid
			) table1
			)> 2 THEN
			uid IN ( #1.1Tìm ra mỗi người dùng cấp 0
			SELECT uid FROM user_info WHERE LEVEL = 0 ) ELSE uid IN ( #2.Nếu không tồn tại người dùng như vậy, tìm ra người dùng có bản ghi làm bài
			SELECT DISTINCT uid FROM exam_record )
		END
		GROUP BY
			ui.uid
	ORDER BY
	incomplete_rate #5.Kết quả sắp xếp theo tỷ lệ chưa hoàn thành tăng dần
```

### Tỷ lệ các mức điểm khác nhau theo từng cấp độ người dùng (khá khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name    | achievement | level | job  | register_time       |
| --- | ---- | ------------ | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号    | 19          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号    | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂ | 22          | 0     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号    | 25          | 0     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 555 号  | 2000        | 7     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 666666       | 3000        | 6     | C++  | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi exam_record (uid ID người dùng, exam_id ID đề thi, start_time thời gian bắt đầu làm bài, submit_time thời gian nộp bài, score điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | (NULL)              | (NULL) |
| 3   | 1001 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 75     |
| 4   | 1001 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:11:01 | 60     |
| 5   | 1001 | 9003    | 2021-09-02 12:01:01 | 2021-09-02 12:41:01 | 90     |
| 6   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:32:00 | 20     |
| 7   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 8   | 1001 | 9004    | 2021-09-03 12:01:01 | (NULL)              | (NULL) |
| 9   | 1002 | 9001    | 2020-01-01 12:01:01 | 2020-01-01 12:31:01 | 99     |
| 10  | 1002 | 9003    | 2020-02-01 12:01:01 | 2020-02-01 12:31:01 | 82     |
| 11  | 1002 | 9003    | 2020-02-02 12:11:01 | 2020-02-02 12:41:01 | 76     |

Để có được biểu hiện định tính của việc làm đề thi của người dùng, chúng ta chia điểm đề thi theo các điểm phân giới [90,75,60] thành bốn mức điểm ưu, lương, trung, kém (điểm phân giới được tính vào khoảng bên trái), hãy thống kê tỷ lệ từng mức điểm trong các đề thi đã hoàn thành của những người dùng ở các cấp độ khác nhau (kết quả giữ lại 3 chữ số thập phân), người dùng chưa từng hoàn thành đề thi nào không cần đầu ra, kết quả sắp xếp theo cấp độ người dùng giảm dần, tỷ lệ giảm dần.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| level | score_grade | ratio |
| ----- | ----------- | ----- |
| 3     | 良          | 0.667 |
| 3     | 优          | 0.333 |
| 0     | 良          | 0.500 |
| 0     | 中          | 0.167 |
| 0     | 优          | 0.167 |
| 0     | 差          | 0.167 |

Giải thích: Người dùng đã từng hoàn thành đề thi là 1001, 1002; cấp độ người dùng và mức điểm tương ứng của các đề thi đã hoàn thành như sau:

| uid  | exam_id | score | level | score_grade |
| ---- | ------- | ----- | ----- | ----------- |
| 1001 | 9001    | 80    | 0     | 良          |
| 1001 | 9002    | 75    | 0     | 良          |
| 1001 | 9002    | 60    | 0     | 中          |
| 1001 | 9003    | 90    | 0     | 优          |
| 1001 | 9001    | 20    | 0     | 差          |
| 1001 | 9002    | 89    | 0     | 良          |
| 1002 | 9001    | 99    | 3     | 优          |
| 1002 | 9003    | 82    | 3     | 良          |
| 1002 | 9003    | 76    | 3     | 良          |

Vì vậy tỷ lệ từng mức điểm của người dùng cấp 0 (chỉ có 1001) là: ưu 1/6, lương 1/6, trung 1/6, kém 3/6; tỷ lệ từng mức điểm của người dùng cấp 3 (chỉ có 1002) là: ưu 1/3, lương 2/3. Kết quả giữ lại 3 chữ số thập phân.

**Hướng giải**:

Trước tiên viết điều kiện **"chia điểm đề thi theo các điểm phân giới [90,75,60] thành bốn mức điểm ưu, lương, trung, kém"** ra, ở đây có thể dùng `case when`

```sql
CASE
		WHEN a.score >= 90 THEN
		'优'
		WHEN a.score < 90 AND a.score >= 75 THEN
		'良'
		WHEN a.score < 75 AND a.score >= 60 THEN
	'中' ELSE '差'
END
```

Điểm mấu chốt của câu này nằm ở đây, phần còn lại chỉ là ghép nối các điều kiện

**Đáp án**:

```sql
SELECT a.LEVEL,
       a.score_grade,
       ROUND(a.cur_count / b.total_num, 3) AS ratio
FROM
  (SELECT b.LEVEL AS LEVEL,
          (CASE
               WHEN a.score >= 90 THEN '优'
               WHEN a.score < 90
                    AND a.score >= 75 THEN '良'
               WHEN a.score < 75
                    AND a.score >= 60 THEN '中'
               ELSE '差'
           END) AS score_grade,
          count(1) AS cur_count
   FROM exam_record a
   LEFT JOIN user_info b ON a.uid = b.uid
   WHERE a.submit_time IS NOT NULL
   GROUP BY b.LEVEL,
            score_grade) a
LEFT JOIN
  (SELECT b.LEVEL AS LEVEL,
          count(b.LEVEL) AS total_num
   FROM exam_record a
   LEFT JOIN user_info b ON a.uid = b.uid
   WHERE a.submit_time IS NOT NULL
   GROUP BY b.LEVEL) b ON a.LEVEL = b.LEVEL
ORDER BY a.LEVEL DESC,
         ratio DESC
```

## Truy vấn giới hạn số lượng

### Ba người đăng ký sớm nhất

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name    | achievement | level | job  | register_time       |
| --- | ---- | ------------ | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号    | 19          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号    | 1200        | 3     | 算法 | 2020-02-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂ | 22          | 0     | 算法 | 2020-01-02 10:00:00 |
| 4   | 1004 | 牛客 4 号    | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 5   | 1005 | 牛客 555 号  | 4000        | 7     | C++  | 2020-01-11 10:00:00 |
| 6   | 1006 | 666666       | 3000        | 6     | C++  | 2020-11-01 10:00:00 |

Hãy tìm 3 người có thời gian đăng ký sớm nhất. Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | nick_name    | register_time       |
| ---- | ------------ | ------------------- |
| 1001 | 牛客 1       | 2020-01-01 10:00:00 |
| 1003 | 牛客 3 号 ♂ | 2020-01-02 10:00:00 |
| 1004 | 牛客 4 号    | 2020-01-02 11:00:00 |

Giải thích: Sắp xếp theo thời gian đăng ký rồi chọn ba người đầu tiên, đầu ra ID người dùng, biệt danh, thời gian đăng ký của họ.

**Đáp án**:

```sql
SELECT uid, nick_name, register_time
    FROM user_info
    ORDER BY register_time
    LIMIT 3
```

### Trang thứ ba của danh sách người hoàn thành đề thi ngay trong ngày đăng ký (khá khó)

**Mô tả**: Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name    | achievement | level | job  | register_time       |
| --- | ---- | ------------ | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1       | 19          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号    | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂ | 22          | 0     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号    | 25          | 0     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 555 号  | 4000        | 7     | 算法 | 2020-01-11 10:00:00 |
| 6   | 1006 | 牛客 6 号    | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 7   | 1007 | 牛客 7 号    | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 8   | 1008 | 牛客 8 号    | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 9   | 1009 | 牛客 9 号    | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 10  | 1010 | 牛客 10 号   | 25          | 0     | 算法 | 2020-01-02 11:00:00 |
| 11  | 1011 | 666666       | 3000        | 6     | C++  | 2020-01-02 10:00:00 |

Bảng thông tin đề thi examination_info (exam_id ID đề thi, tag thể loại đề thi, difficulty độ khó của đề thi, duration thời lượng làm bài, release_time thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | 算法 | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | 算法 | hard       | 80       | 2020-01-01 10:00:00 |
| 3   | 9003    | SQL  | medium     | 70       | 2020-01-01 10:00:00 |

Bảng bản ghi làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score |
| --- | ---- | ------- | ------------------- | ------------------- | ----- |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:59 | 80    |
| 2   | 1002 | 9003    | 2020-01-20 10:01:01 | 2020-01-20 10:10:01 | 81    |
| 3   | 1002 | 9002    | 2020-01-01 12:11:01 | 2020-01-01 12:31:01 | 83    |
| 4   | 1003 | 9002    | 2020-01-01 19:01:01 | 2020-01-01 19:30:01 | 75    |
| 5   | 1004 | 9002    | 2020-01-01 12:01:01 | 2020-01-01 12:11:01 | 60    |
| 6   | 1005 | 9002    | 2020-01-01 12:01:01 | 2020-01-01 12:41:01 | 90    |
| 7   | 1006 | 9001    | 2020-01-02 19:01:01 | 2020-01-02 19:32:00 | 20    |
| 8   | 1007 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:40:01 | 89    |
| 9   | 1008 | 9003    | 2020-01-02 12:01:01 | 2020-01-02 12:20:01 | 99    |
| 10  | 1008 | 9001    | 2020-01-02 12:01:01 | 2020-01-02 12:31:01 | 98    |
| 11  | 1009 | 9002    | 2020-01-02 12:01:01 | 2020-01-02 12:31:01 | 82    |
| 12  | 1010 | 9002    | 2020-01-02 12:11:01 | 2020-01-02 12:41:01 | 76    |
| 13  | 1011 | 9001    | 2020-01-02 10:01:01 | 2020-01-02 10:31:01 | 89    |

![](https://oss.javaguide.cn/github/javaguide/database/sql/D2B491866B85826119EE3474F10D3636.png)

Tìm những người có hướng nghề nghiệp là kỹ sư thuật toán, và đã hoàn thành đề thi loại thuật toán ngay trong ngày đăng ký, xếp hạng theo điểm cao nhất trong tất cả các kỳ thi đã tham gia. Bảng xếp hạng rất dài, chúng ta sẽ hiển thị theo phân trang, mỗi trang 3 bản, bây giờ cần bạn lấy thông tin của những người ở trang thứ 3 (số trang bắt đầu từ 1).

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | level | register_time       | max_score |
| ---- | ----- | ------------------- | --------- |
| 1010 | 0     | 2020-01-02 11:00:00 | 76        |
| 1003 | 0     | 2020-01-01 10:00:00 | 75        |
| 1004 | 0     | 2020-01-01 11:00:00 | 60        |

Giải thích: Ngoài 1011, hướng nghề nghiệp của các người dùng khác đều là kỹ sư thuật toán; đề thi loại thuật toán có 9001 và 9002, cả 11 người dùng đều hoàn thành đề thi loại thuật toán ngay trong ngày đăng ký; khi tính điểm cao nhất trong tất cả các kỳ thi của họ, chỉ có 1002 và 1008 hoàn thành hai kỳ thi, những người khác chỉ hoàn thành một kỳ thi, điểm cao nhất trong hai kỳ thi của 1002 là 81, điểm cao nhất của 1008 là 99.

Xếp hạng theo điểm cao nhất như sau:

| uid  | level | register_time       | max_score |
| ---- | ----- | ------------------- | --------- |
| 1008 | 0     | 2020-01-02 11:00:00 | 99        |
| 1005 | 7     | 2020-01-01 10:00:00 | 90        |
| 1007 | 0     | 2020-01-02 11:00:00 | 89        |
| 1002 | 3     | 2020-01-01 10:00:00 | 83        |
| 1009 | 0     | 2020-01-02 11:00:00 | 82        |
| 1001 | 0     | 2020-01-01 10:00:00 | 80        |
| 1010 | 0     | 2020-01-02 11:00:00 | 76        |
| 1003 | 0     | 2020-01-01 10:00:00 | 75        |
| 1004 | 0     | 2020-01-01 11:00:00 | 60        |
| 1006 | 0     | 2020-01-02 11:00:00 | 20        |

Mỗi trang 3 bản, trang thứ ba tức là bản thứ 7~9, trả về bản ghi hàng của 1010, 1003, 1004 là được.

**Hướng giải**:

1. Mỗi trang ba bản, tức cần lấy thông tin của những người ở trang thứ ba, phải dùng đến `limit`

2. Thống kê **thông tin và điểm số của mỗi bản ghi** của những người có hướng nghề nghiệp là kỹ sư thuật toán và đã hoàn thành đề thi loại thuật toán ngay trong ngày đăng ký, trước tiên tìm người dùng thỏa mãn điều kiện, sau đó dùng left join để kết nối tìm thông tin và điểm số của mỗi bản ghi

**Đáp án**:

```sql
SELECT t1.uid,
       LEVEL,
       register_time,
       max(score) AS max_score
FROM exam_record t
JOIN examination_info USING (exam_id)
JOIN user_info t1 ON t.uid = t1.uid
AND date(t.submit_time) = date(t1.register_time)
WHERE job = '算法'
  AND tag = '算法'
GROUP BY t1.uid,
         LEVEL,
         register_time
ORDER BY max_score DESC
LIMIT 6,3
```

## Hàm chuyển đổi văn bản

### Sửa các bản ghi bị nhập lẫn chuỗi

**Mô tả**: Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` thể loại đề thi, `difficulty` độ khó của đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag            | difficulty | duration | release_time        |
| --- | ------- | -------------- | ---------- | -------- | ------------------- |
| 1   | 9001    | 算法           | hard       | 60       | 2021-01-01 10:00:00 |
| 2   | 9002    | 算法           | hard       | 80       | 2021-01-01 10:00:00 |
| 3   | 9003    | SQL            | medium     | 70       | 2021-01-01 10:00:00 |
| 4   | 9004    | 算法,medium,80 |            | 0        | 2021-01-01 10:00:00 |

Có lần bạn nhập đề đã sơ ý nhập đồng thời thể loại đề thi tag, độ khó, thời lượng của một số bản ghi vào trường tag, hãy giúp tìm ra những bản ghi nhập sai này, và sau khi tách ra, đầu ra theo đúng loại cột.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| exam_id | tag  | difficulty | duration |
| ------- | ---- | ---------- | -------- |
| 9004    | 算法 | medium     | 80       |

**Hướng giải**:

Trước tiên hãy tìm hiểu về hàm sẽ dùng trong câu này

Hàm `SUBSTRING_INDEX` dùng để trích xuất phần của chuỗi theo ký tự phân tách chỉ định. Nó nhận ba tham số: chuỗi gốc, ký tự phân tách và số lượng phần cần trả về.

Sau đây là cú pháp của hàm `SUBSTRING_INDEX`:

```sql
SUBSTRING_INDEX(str, delimiter, count)
```

- `str`: Chuỗi gốc cần phân tách.
- `delimiter`: Chuỗi hoặc ký tự dùng để phân tách.
- `count`: Chỉ định số lượng phần cần trả về.
  - Nếu `count` lớn hơn 0, thì trả về `count` phần đầu tiên tính từ bên trái (lấy ký tự phân tách làm ranh giới).
  - Nếu `count` nhỏ hơn 0, thì trả về `count` phần đầu tiên tính từ bên phải (lấy ký tự phân tách làm ranh giới), tức là đếm từ phải sang trái.

Dưới đây là một số ví dụ minh họa cách dùng hàm `SUBSTRING_INDEX`:

1. Trích xuất phần đầu tiên trong chuỗi:

   ```sql
   SELECT SUBSTRING_INDEX('apple,banana,cherry', ',', 1);
   -- Kết quả đầu ra: 'apple'
   ```

2. Trích xuất phần cuối cùng trong chuỗi:

   ```sql
   SELECT SUBSTRING_INDEX('apple,banana,cherry', ',', -1);
   -- Kết quả đầu ra: 'cherry'
   ```

3. Trích xuất hai phần đầu tiên trong chuỗi:

   ```sql
   SELECT SUBSTRING_INDEX('apple,banana,cherry', ',', 2);
   -- Kết quả đầu ra: 'apple,banana'
   ```

4. Trích xuất hai phần cuối cùng trong chuỗi:

   ```sql
   SELECT SUBSTRING_INDEX('apple,banana,cherry', ',', -2);
   -- Kết quả đầu ra: 'banana,cherry'
   ```

**Đáp án**:

```sql
SELECT
	exam_id,
	substring_index( tag, ',', 1 ) tag,
	substring_index( substring_index( tag, ',', 2 ), ',',- 1 ) difficulty,
	substring_index( tag, ',',- 1 ) duration
FROM
	examination_info
WHERE
	difficulty = ''
```

### Xử lý cắt bớt biệt danh quá dài

**Mô tả**: Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name              | achievement | level | job  | register_time       |
| --- | ---- | ---------------------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1                 | 19          | 0     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号              | 1200        | 3     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂           | 22          | 0     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号              | 25          | 0     | 算法 | 2020-01-01 11:00:00 |
| 5   | 1005 | 牛客 5678901234 号     | 4000        | 7     | 算法 | 2020-01-11 10:00:00 |
| 6   | 1006 | 牛客 67890123456789 号 | 25          | 0     | 算法 | 2020-01-02 11:00:00 |

Biệt danh của một số người dùng đặc biệt dài, trong một số tình huống hiển thị sẽ gây rối loạn giao diện, vì vậy cần chuyển đổi những biệt danh đặc biệt dài trước khi đầu ra, hãy đầu ra thông tin người dùng có số ký tự lớn hơn 10, đối với người dùng có số ký tự lớn hơn 13 thì đầu ra 10 ký tự đầu rồi thêm ba dấu chấm: 『...』.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | nick_name          |
| ---- | ------------------ |
| 1005 | 牛客 5678901234 号 |
| 1006 | 牛客 67890123...   |

Giải thích: Người dùng có số ký tự lớn hơn 10 là 1005 và 1006, độ dài lần lượt là 13, 17; vì vậy cần cắt ngắn biệt danh của 1006 khi đầu ra.

**Hướng giải**:

Câu này liên quan đến tính toán ký tự, để tính số ký tự của chuỗi (tức độ dài của chuỗi), có thể dùng hàm `LENGTH` hoặc hàm `CHAR_LENGTH`. Điểm khác biệt giữa hai hàm này nằm ở cách xử lý ký tự đa byte.

1. Hàm `LENGTH`: Trả về số byte của chuỗi đã cho. Đối với chuỗi chứa ký tự đa byte, mỗi ký tự sẽ được tính như một byte.

Ví dụ:

```sql
SELECT LENGTH('你好'); -- Kết quả đầu ra: 6, vì mỗi chữ Hán trong '你好' chiếm 3 byte
```

1. Hàm `CHAR_LENGTH`: Trả về số ký tự của chuỗi đã cho. Đối với chuỗi chứa ký tự đa byte, mỗi ký tự sẽ được tính như một ký tự.

Ví dụ:

```sql
SELECT CHAR_LENGTH('你好'); -- Kết quả đầu ra: 2, vì trong '你好' có hai ký tự, tức hai chữ Hán
```

**Đáp án**:

```sql
SELECT
	uid,
CASE

		WHEN CHAR_LENGTH( nick_name ) > 13 THEN
		CONCAT( SUBSTR( nick_name, 1, 10 ), '...' ) ELSE nick_name
	END AS nick_name
FROM
	user_info
WHERE
	CHAR_LENGTH( nick_name ) > 10
GROUP BY
	uid;
```

### Lọc và thống kê khi lẫn lộn chữ hoa chữ thường (khá khó)

**Mô tả**:

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` thể loại đề thi, `difficulty` độ khó của đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | 算法 | hard       | 60       | 2021-01-01 10:00:00 |
| 2   | 9002    | C++  | hard       | 80       | 2021-01-01 10:00:00 |
| 3   | 9003    | C++  | hard       | 80       | 2021-01-01 10:00:00 |
| 4   | 9004    | sql  | medium     | 70       | 2021-01-01 10:00:00 |
| 5   | 9005    | C++  | hard       | 80       | 2021-01-01 10:00:00 |
| 6   | 9006    | C++  | hard       | 80       | 2021-01-01 10:00:00 |
| 7   | 9007    | C++  | hard       | 80       | 2021-01-01 10:00:00 |
| 8   | 9008    | SQL  | medium     | 70       | 2021-01-01 10:00:00 |
| 9   | 9009    | SQL  | medium     | 70       | 2021-01-01 10:00:00 |
| 10  | 9010    | SQL  | medium     | 70       | 2021-01-01 10:00:00 |

Bảng thông tin làm đề thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-01 09:01:01 | 2020-01-01 09:21:59 | 80     |
| 2   | 1002 | 9003    | 2020-01-20 10:01:01 | 2020-01-20 10:10:01 | 81     |
| 3   | 1002 | 9002    | 2020-02-01 12:11:01 | 2020-02-01 12:31:01 | 83     |
| 4   | 1003 | 9002    | 2020-03-01 19:01:01 | 2020-03-01 19:30:01 | 75     |
| 5   | 1004 | 9002    | 2020-03-01 12:01:01 | 2020-03-01 12:11:01 | 60     |
| 6   | 1005 | 9002    | 2020-03-01 12:01:01 | 2020-03-01 12:41:01 | 90     |
| 7   | 1006 | 9001    | 2020-05-02 19:01:01 | 2020-05-02 19:32:00 | 20     |
| 8   | 1007 | 9003    | 2020-01-02 19:01:01 | 2020-01-02 19:40:01 | 89     |
| 9   | 1008 | 9004    | 2020-02-02 12:01:01 | 2020-02-02 12:20:01 | 99     |
| 10  | 1008 | 9001    | 2020-02-02 12:01:01 | 2020-02-02 12:31:01 | 98     |
| 11  | 1009 | 9002    | 2020-02-02 12:01:01 | 2020-01-02 12:43:01 | 81     |
| 12  | 1010 | 9001    | 2020-01-02 12:11:01 | (NULL)              | (NULL) |
| 13  | 1010 | 9001    | 2020-02-02 12:01:01 | 2020-01-02 10:31:01 | 89     |

Thể loại tag của đề thi có thể xuất hiện tình trạng lẫn lộn chữ hoa chữ thường, trước tiên hãy lọc ra các thể loại tag có số lần làm đề thi nhỏ hơn 3, thống kê số lần làm đề thi ban đầu tương ứng sau khi chuyển chúng thành chữ hoa.

Nếu tag sau khi chuyển đổi không thay đổi, thì không đầu ra kết quả đó.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| tag | answer_cnt |
| --- | ---------- |
| C++ | 6          |

Giải thích: Các đề thi đã được làm là 9001, 9002, 9003, 9004, tag và số lần được làm của chúng như sau:

| exam_id | tag  | answer_cnt |
| ------- | ---- | ---------- |
| 9001    | 算法 | 4          |
| 9002    | C++  | 6          |
| 9003    | c++  | 2          |
| 9004    | sql  | 2          |

Các tag có số lần làm nhỏ hơn 3 là c++ và sql, mà sau khi chuyển thành chữ hoa chỉ có C++ là vốn đã có số lần làm, vì vậy đầu ra số lần làm sau khi chuyển c++ thành chữ hoa là 6.

**Hướng giải**:

Trước hết, câu này hơi rối, 9004 theo dữ liệu mẫu tra ra chỉ có 1 lần, ở đây lại hiển thị có 2 lần.

Trước tiên hãy xem các hàm chuyển đổi chữ hoa chữ thường:

1. Hàm `UPPER(s)` hoặc `UCASE(s)` có thể chuyển tất cả ký tự chữ cái trong chuỗi s thành chữ hoa;

2. Hàm `LOWER(s)` hoặc `LCASE(s)` có thể chuyển tất cả ký tự chữ cái trong chuỗi s thành chữ thường.

Điểm khó nằm ở việc kết nối cùng một bảng nhưng phải truy vấn các giá trị khác nhau

**Đáp án**:

```sql
WITH a AS
  (SELECT tag,
          COUNT(start_time) AS answer_cnt
   FROM exam_record er
   JOIN examination_info ei ON er.exam_id = ei.exam_id
   GROUP BY tag)
SELECT a.tag,
       b.answer_cnt
FROM a
INNER JOIN a AS b ON UPPER(a.tag)= b.tag #a chữ thường b chữ hoa
AND a.tag != b.tag
WHERE a.answer_cnt < 3;
```

<!-- @include: @article-footer.snippet.md -->
