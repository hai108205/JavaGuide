---
title: Tổng hợp câu hỏi phỏng vấn SQL thường gặp (Phần 4)
description: Bài thứ tư trong chuỗi tổng hợp câu hỏi phỏng vấn SQL thường gặp, giải thích chi tiết cách dùng và kịch bản áp dụng của các Window Function trong MySQL 8.0 như ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu cơ bản
  - SQL
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn SQL,Window Function,ROW_NUMBER,RANK,DENSE_RANK,NTILE,LAG,LEAD,MySQL 8.0
---

> Nguồn câu hỏi: [Nowcoder 题霸 - Thử thách SQL nâng cao](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=240)

Với các câu hỏi khó hoặc rất khó, bạn có thể dựa vào tình hình thực tế của bản thân và yêu cầu của buổi phỏng vấn để quyết định có nên bỏ qua hay không.

## Window Function chuyên dụng

Phiên bản MySQL 8.0 đã giới thiệu hỗ trợ cho Window Function (hàm cửa sổ). Dưới đây là các Window Function thường gặp trong MySQL và cách dùng của chúng:

1. `ROW_NUMBER()`: Gán một giá trị số nguyên duy nhất cho mỗi hàng trong tập kết quả truy vấn.

```sql
SELECT col1, col2, ROW_NUMBER() OVER (ORDER BY col1) AS row_num
FROM table;
```

2. `RANK()`: Tính thứ hạng của mỗi hàng trong kết quả sắp xếp.

```sql
SELECT col1, col2, RANK() OVER (ORDER BY col1 DESC) AS ranking
FROM table;
```

3. `DENSE_RANK()`: Tính thứ hạng của mỗi hàng trong kết quả sắp xếp, giữ nguyên các thứ hạng bằng nhau.

```sql
SELECT col1, col2, DENSE_RANK() OVER (ORDER BY col1 DESC) AS ranking
FROM table;
```

4. `NTILE(n)`: Chia kết quả thành n nhóm (bucket) tương đối đều nhau và gán một số định danh cho mỗi nhóm.

```sql
SELECT col1, col2, NTILE(4) OVER (ORDER BY col1) AS bucket
FROM table;
```

5. `SUM()`, `AVG()`,`COUNT()`, `MIN()`, `MAX()`: Các hàm tổng hợp (Aggregate Function) này cũng có thể kết hợp với Window Function để tính tổng, trung bình, đếm, giá trị nhỏ nhất và lớn nhất của cột chỉ định trong cửa sổ.

```sql
SELECT col1, col2, SUM(col1) OVER () AS sum_col
FROM table;
```

6. `LEAD()` và `LAG()`: Hàm LEAD dùng để lấy giá trị của hàng cách hàng hiện tại một độ lệch (offset) nhất định ở phía sau, còn hàm LAG dùng để lấy giá trị của hàng cách hàng hiện tại một độ lệch nhất định ở phía trước.

```sql
SELECT col1, col2, LEAD(col1, 1) OVER (ORDER BY col1) AS next_col1,
                 LAG(col1, 1) OVER (ORDER BY col1) AS prev_col1
FROM table;
```

7. `FIRST_VALUE()` và `LAST_VALUE()`: Hàm FIRST_VALUE dùng để lấy giá trị đầu tiên của cột chỉ định trong cửa sổ, hàm LAST_VALUE dùng để lấy giá trị cuối cùng của cột chỉ định trong cửa sổ.

```sql
SELECT col1, col2, FIRST_VALUE(col2) OVER (PARTITION BY col1 ORDER BY col2) AS first_val,
                 LAST_VALUE(col2) OVER (PARTITION BY col1 ORDER BY col2) AS last_val
FROM table;
```

Window Function thường cần được dùng kèm với mệnh đề OVER để định nghĩa kích thước cửa sổ, quy tắc sắp xếp và cách phân nhóm.

### Top 3 điểm số của mỗi loại đề thi

**Mô tả**:

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` loại đề thi, `difficulty` độ khó đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, score điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 78     |
| 2   | 1002 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 81     |
| 3   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81     |
| 4   | 1003 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 86     |
| 5   | 1003 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:51 | 89     |
| 6   | 1004 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:30:01 | 85     |
| 7   | 1005 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:31:02 | 85     |
| 8   | 1006 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:21:01 | 84     |
| 9   | 1003 | 9003    | 2021-09-08 12:01:01 | 2021-09-08 12:11:01 | 40     |
| 10  | 1003 | 9002    | 2021-09-01 14:01:01 | (NULL)              | (NULL) |

Hãy tìm top 3 điểm số của mỗi loại đề thi. Nếu hai người có điểm số cao nhất bằng nhau, chọn người có điểm số thấp nhất lớn hơn; nếu vẫn bằng nhau, chọn người có uid lớn hơn. Kết quả đầu ra từ dữ liệu mẫu như sau:

| tid  | uid  | ranking |
| ---- | ---- | ------- |
| SQL  | 1003 | 1       |
| SQL  | 1004 | 2       |
| SQL  | 1002 | 3       |
| 算法 | 1005 | 1       |
| 算法 | 1006 | 2       |
| 算法 | 1003 | 3       |

**Giải thích**: Các tag đề thi có bản ghi làm bài và có điểm là SQL và 算法 (Thuật toán). Với đề thi SQL, các người dùng 1001, 1002, 1003, 1004 có điểm, điểm cao nhất lần lượt là 81, 81, 89, 85, điểm thấp nhất lần lượt là 78, 81, 86, 40. Vì vậy, xếp hạng theo điểm cao nhất trước rồi đến điểm thấp nhất, lấy top 3 là 1003, 1004, 1002.

**Đáp án**:

```sql
SELECT tag,
       UID,
       ranking
FROM
  (SELECT b.tag AS tag,
          a.uid AS UID,
          ROW_NUMBER() OVER (PARTITION BY b.tag
                             ORDER BY b.tag,
                                      max(a.score) DESC,
                                      min(a.score) DESC,
                                      a.uid DESC) AS ranking
   FROM exam_record a
   LEFT JOIN examination_info b ON a.exam_id = b.exam_id
   GROUP BY b.tag,
            a.uid) t
WHERE ranking <= 3
```
### Đề thi có chênh lệch giữa thời gian làm bài nhanh thứ hai và chậm thứ hai lớn hơn một nửa thời lượng đề thi (khó)

**Mô tả**:

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` loại đề thi, `difficulty` độ khó đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | hard       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:51:01 | 78     |
| 2   | 1001 | 9002    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 81     |
| 3   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81     |
| 4   | 1003 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:59:01 | 86     |
| 5   | 1003 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:51 | 89     |
| 6   | 1004 | 9002    | 2021-09-01 19:01:01 | 2021-09-01 19:30:01 | 85     |
| 7   | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:02 | 85     |
| 8   | 1006 | 9001    | 2021-09-07 10:02:01 | 2021-09-07 10:21:01 | 84     |
| 9   | 1003 | 9001    | 2021-09-08 12:01:01 | 2021-09-08 12:11:01 | 40     |
| 10  | 1003 | 9002    | 2021-09-01 14:01:01 | (NULL)              | (NULL) |
| 11  | 1005 | 9001    | 2021-09-01 14:01:01 | (NULL)              | (NULL) |
| 12  | 1003 | 9003    | 2021-09-08 15:01:01 | (NULL)              | (NULL) |

Hãy tìm thông tin đề thi có chênh lệch giữa thời gian làm bài nhanh thứ hai và chậm thứ hai lớn hơn một nửa thời lượng đề thi, sắp xếp theo ID đề thi giảm dần. Kết quả đầu ra từ dữ liệu mẫu như sau:

| exam_id | duration | release_time        |
| ------- | -------- | ------------------- |
| 9001    | 60       | 2021-09-01 06:00:00 |

**Giải thích**: Đề thi 9001 có các thời gian làm bài là 50 phút, 58 phút, 30 phút 1 giây, 19 phút, 10 phút. Chênh lệch giữa thời gian làm bài nhanh thứ hai và chậm thứ hai là 50 phút - 19 phút = 31 phút, thời lượng đề thi là 60 phút, vì vậy thỏa mãn điều kiện lớn hơn một nửa thời lượng đề thi; đầu ra gồm ID đề thi, thời lượng và thời gian phát hành.

**Hướng giải:**

Bước một, tìm thứ hạng theo thời gian hoàn thành (xuôi và ngược) của mỗi đề thi, tức bảng a;

Bước hai, INNER JOIN với bảng thông tin đề thi b, nhóm theo ID đề thi, dùng `having` để lọc dữ liệu ở vị trí thứ hạng thứ hai, chuyển đổi giây sang phút rồi so sánh, cuối cùng sắp xếp theo ID đề thi giảm dần là xong.

**Đáp án**:

```sql
SELECT a.exam_id,
       b.duration,
       b.release_time
FROM
  (SELECT exam_id,
          row_number() OVER (PARTITION BY exam_id
                             ORDER BY timestampdiff(SECOND, start_time, submit_time) DESC) rn1,
          row_number() OVER (PARTITION BY exam_id
                            ORDER BY timestampdiff(SECOND, start_time, submit_time) ASC) rn2,
                                              timestampdiff(SECOND, start_time, submit_time) timex
   FROM exam_record
   WHERE score IS NOT NULL ) a
INNER JOIN examination_info b ON a.exam_id = b.exam_id
GROUP BY a.exam_id
HAVING (max(IF (rn1 = 2, a.timex, 0))- max(IF (rn2 = 2, a.timex, 0)))/ 60 > b.duration / 2
ORDER BY a.exam_id DESC
```

### Khoảng thời gian tối đa giữa hai lần làm bài liên tiếp (khó)

**Mô tả**

Hiện có bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score |
| --- | ---- | ------- | ------------------- | ------------------- | ----- |
| 1   | 1006 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:21:02 | 84    |
| 2   | 1006 | 9001    | 2021-09-01 12:11:01 | 2021-09-01 12:31:01 | 89    |
| 3   | 1006 | 9002    | 2021-09-06 10:01:01 | 2021-09-06 10:21:01 | 81    |
| 4   | 1005 | 9002    | 2021-09-05 10:01:01 | 2021-09-05 10:21:01 | 81    |
| 5   | 1005 | 9001    | 2021-09-05 10:31:01 | 2021-09-05 10:51:01 | 81    |

Hãy tính trong số những người có ít nhất hai ngày làm bài thi trong năm 2021, khoảng thời gian tối đa `days_window` giữa hai lần làm bài liên tiếp trong năm đó. Dựa trên quy luật lịch sử của năm đó, trung bình người này sẽ làm bao nhiêu đề thi trong `days_window` ngày; sắp xếp kết quả theo khoảng thời gian tối đa và số đề thi trung bình giảm dần. Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | days_window | avg_exam_cnt |
| ---- | ----------- | ------------ |
| 1006 | 6           | 2.57         |

**Giải thích**: Người dùng 1006 đã làm bài thi 3 lần vào các ngày 20210901, 20210906, 20210907; khoảng thời gian tối đa giữa hai lần làm bài liên tiếp là 6 ngày (từ ngày 1 đến ngày 6). Trong 7 ngày từ ngày 1 đến ngày 7, người này làm tổng cộng 3 đề thi, trung bình mỗi ngày 3/7 = 0.428571 đề, vậy trong 6 ngày trung bình sẽ làm 0.428571\*6 = 2.57 đề thi (giữ lại hai chữ số thập phân); người dùng 1005 làm hai đề thi vào ngày 20210905 nhưng chỉ có bản ghi của một ngày nên bị lọc bỏ.

**Hướng giải:**

Phần giải thích ở trên gợi ý rằng cần khử trùng lặp bản ghi làm bài, nhưng tuyệt đối đừng bị đánh lừa — không được khử trùng lặp! Khử trùng lặp sẽ không qua được test case. Chú ý phạm vi thời gian là năm 2021;

Ngoài ra cần chú ý chênh lệch thời gian phải +1 ngày; còn phải chú ý ==chưa nộp bài cũng tính==!!!! (dù sao thì mình thấy đề bài mô tả không rõ, ra đề chưa được tốt lắm)

**Đáp án**:

```sql
SELECT UID,
       max(datediff(next_time, start_time)) + 1 AS days_window,
       round(count(start_time)/(datediff(max(start_time), min(start_time))+ 1) * (max(datediff(next_time, start_time))+ 1), 2) AS avg_exam_cnt
FROM
  (SELECT UID,
          start_time,
          lead(start_time, 1) OVER (PARTITION BY UID
                                    ORDER BY start_time) AS next_time
   FROM exam_record
   WHERE YEAR (start_time) = '2021' ) a
GROUP BY UID
HAVING count(DISTINCT date(start_time)) > 1
ORDER BY days_window DESC,
         avg_exam_cnt DESC
```
### Tình trạng hoàn thành bài thi của người dùng không có bài nào chưa hoàn thành trong ba tháng gần nhất

**Mô tả**:

Hiện có bảng bản ghi làm bài thi `exam_record` (`uid`: ID người dùng, `exam_id`: ID đề thi, `start_time`: thời gian bắt đầu làm bài, `submit_time`: thời gian nộp bài, nếu để trống thì nghĩa là chưa hoàn thành, `score`: điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1006 | 9003    | 2021-09-06 10:01:01 | 2021-09-06 10:21:02 | 84     |
| 2   | 1006 | 9001    | 2021-08-02 12:11:01 | 2021-08-02 12:31:01 | 89     |
| 3   | 1006 | 9002    | 2021-06-06 10:01:01 | 2021-06-06 10:21:01 | 81     |
| 4   | 1006 | 9002    | 2021-05-06 10:01:01 | 2021-05-06 10:21:01 | 81     |
| 5   | 1006 | 9001    | 2021-05-01 12:01:01 | (NULL)              | (NULL) |
| 6   | 1001 | 9001    | 2021-09-05 10:31:01 | 2021-09-05 10:51:01 | 81     |
| 7   | 1001 | 9003    | 2021-08-01 09:01:01 | 2021-08-01 09:51:11 | 78     |
| 8   | 1001 | 9002    | 2021-07-01 09:01:01 | 2021-07-01 09:31:00 | 81     |
| 9   | 1001 | 9002    | 2021-07-01 12:01:01 | 2021-07-01 12:31:01 | 81     |
| 10  | 1001 | 9002    | 2021-07-01 12:01:01 | (NULL)              | (NULL) |

Hãy tìm số bài thi đã hoàn thành của những người dùng mà trong ba tháng gần nhất có bản ghi làm bài thi không có bài nào ở trạng thái chưa hoàn thành, sắp xếp theo số bài thi hoàn thành và ID người dùng giảm dần. Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | exam_complete_cnt |
| ---- | ----------------- |
| 1006 | 3                 |

**Giải thích**: Ba tháng gần nhất có bản ghi làm bài thi của người dùng 1006 là 202109, 202108, 202106, số bài thi đã làm là 3, tất cả đều hoàn thành; ba tháng gần nhất có bản ghi làm bài thi của người dùng 1001 là 202109, 202108, 202107, số bài thi đã làm là 5, số bài hoàn thành là 4, vì có bài thi chưa hoàn thành nên bị lọc bỏ.

**Hướng giải:**

1. `Tìm số bài thi đã hoàn thành của những người dùng mà trong ba tháng gần nhất có bản ghi làm bài thi không có bài nào ở trạng thái chưa hoàn thành` — trước tiên đọc câu này, chắc chắn phải nhóm theo người dùng trước.
2. Ba tháng gần nhất: có thể dùng xếp hạng liên tiếp không ngắt quãng (DENSE_RANK), sắp xếp giảm dần, lấy xếp hạng <= 3.
3. Thống kê số bài đã làm.
4. Ghép các điều kiện còn lại.
5. Sắp xếp.

**Đáp án**:

```sql
SELECT UID,
       count(score) exam_complete_cnt
FROM
  (SELECT *, DENSE_RANK() OVER (PARTITION BY UID
                             ORDER BY date_format(start_time, '%Y%m') DESC) dr
   FROM exam_record) t1
WHERE dr <= 3
GROUP BY UID
HAVING count(dr)= count(score)
ORDER BY exam_complete_cnt DESC,
         UID DESC
```

### Tình trạng làm bài thi trong ba tháng gần nhất của 50% người dùng có tỷ lệ chưa hoàn thành cao (rất khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` ID người dùng, `nick_name` biệt danh, `achievement` điểm thành tích, `level` cấp độ, `job` hướng nghề nghiệp, `register_time` thời gian đăng ký):

| id  | uid  | nick_name    | achievement | level | job  | register_time       |
| --- | ---- | ------------ | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号    | 3200        | 7     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号    | 2500        | 6     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 ♂ | 2200        | 5     | 算法 | 2020-01-01 10:00:00 |

Bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` loại đề thi, `difficulty` độ khó đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag    | difficulty | duration | release_time        |
| --- | ------- | ------ | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL    | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | SQL    | hard       | 80       | 2020-01-01 10:00:00 |
| 3   | 9003    | 算法   | hard       | 80       | 2020-01-01 10:00:00 |
| 4   | 9004    | PYTHON | medium     | 70       | 2020-01-01 10:00:00 |

Bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score |
| --- | ---- | ------- | ------------------- | ------------------- | ----- |
| 1   | 1001 | 9001    | 2020-01-01 09:01:01 | 2020-01-01 09:21:59 | 90    |
| 15  | 1002 | 9001    | 2020-01-01 18:01:01 | 2020-01-01 18:59:02 | 90    |
| 13  | 1001 | 9001    | 2020-01-02 10:01:01 | 2020-01-02 10:31:01 | 89    |
| 2   | 1002 | 9001    | 2020-01-20 10:01:01 |                     |       |
| 3   | 1002 | 9001    | 2020-02-01 12:11:01 |                     |       |
| 5   | 1001 | 9001    | 2020-03-01 12:01:01 |                     |       |
| 6   | 1002 | 9001    | 2020-03-01 12:01:01 | 2020-03-01 12:41:01 | 90    |
| 4   | 1003 | 9001    | 2020-03-01 19:01:01 |                     |       |
| 7   | 1002 | 9001    | 2020-05-02 19:01:01 | 2020-05-02 19:32:00 | 90    |
| 14  | 1001 | 9002    | 2020-01-01 12:11:01 |                     |       |
| 8   | 1001 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:59:01 | 69    |
| 9   | 1001 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:20:01 | 99    |
| 10  | 1002 | 9002    | 2020-02-02 12:01:01 |                     |       |
| 11  | 1002 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:43:01 | 81    |
| 12  | 1002 | 9002    | 2020-03-02 12:11:01 |                     |       |
| 17  | 1001 | 9002    | 2020-05-05 18:01:01 |                     |       |
| 16  | 1002 | 9003    | 2020-05-06 12:01:01 |                     |       |

Hãy thống kê trong số 50% người dùng có tỷ lệ chưa hoàn thành cao trên đề thi SQL, số bài thi đã làm và số bài hoàn thành trong từng tháng của ba tháng gần nhất có bản ghi làm bài thi đối với người dùng cấp 6 và cấp 7. Sắp xếp theo ID người dùng và tháng tăng dần.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | start_month | total_cnt | complete_cnt |
| ---- | ----------- | --------- | ------------ |
| 1002 | 202002      | 3         | 1            |
| 1002 | 202003      | 2         | 1            |
| 1002 | 202005      | 2         | 1            |

Giải thích: Số bài chưa hoàn thành, tổng số bài đã làm và tỷ lệ chưa hoàn thành trên đề thi SQL của từng người dùng như sau:

| uid  | incomplete_cnt | total_cnt | incomplete_rate |
| ---- | -------------- | --------- | --------------- |
| 1001 | 3              | 7         | 0.4286          |
| 1002 | 4              | 8         | 0.5000          |
| 1003 | 1              | 1         | 1.0000          |

1001, 1002, 1003 lần lượt đứng ở vị trí 1.0, 0.5, 0.0, vì vậy 50% người dùng có tỷ lệ cao (vị trí <= 0.5) là 1002, 1003;

1003 không phải cấp 6 hay cấp 7;

Ba tháng gần nhất có bản ghi làm bài thi là 202005, 202003, 202002;

Trong ba tháng này, số bài đã làm của 1002 lần lượt là 3, 2, 2, số bài hoàn thành lần lượt là 1, 1, 1.

**Hướng giải:**

Điểm cần chú ý: bài này cần tính tổng số lần làm bài và số lần hoàn thành, còn đề thi loại SQL chỉ dùng để giới hạn xếp hạng tỷ lệ chưa hoàn thành, người dùng cấp 6, 7 bị giới hạn ở bản ghi làm bài.

Trước tiên tính xếp hạng tỷ lệ chưa hoàn thành:

```sql
SELECT UID,
       count(submit_time IS NULL
             OR NULL)/ count(start_time) AS num,
       PERCENT_RANK() OVER (
                            ORDER BY count(submit_time IS NULL
                                           OR NULL)/ count(start_time)) AS ranking
FROM exam_record
LEFT JOIN examination_info USING (exam_id)
WHERE tag = 'SQL'
GROUP BY UID
```

Sau đó tính bản ghi luyện tập trong ba tháng gần nhất:

```sql
SELECT UID,
       date_format(start_time, '%Y%m') AS month_d,
       submit_time,
       exam_id,
       dense_rank() OVER (PARTITION BY UID
                          ORDER BY date_format(start_time, '%Y%m') DESC) AS ranking
FROM exam_record
LEFT JOIN user_info USING (UID)
WHERE LEVEL IN (6,7)
```

**Đáp án**:

```sql
SELECT t1.uid,
       t1.month_d,
       count(*) AS total_cnt,
       count(t1.submit_time) AS complete_cnt
FROM-- Trước tiên tính xếp hạng tỷ lệ chưa hoàn thành

  (SELECT UID,
          count(submit_time IS NULL OR NULL)/ count(start_time) AS num,
          PERCENT_RANK() OVER (
                               ORDER BY count(submit_time IS NULL OR NULL)/ count(start_time)) AS ranking
   FROM exam_record
   LEFT JOIN examination_info USING (exam_id)
   WHERE tag = 'SQL'
   GROUP BY UID) t
INNER JOIN
  (-- Sau đó tính bản ghi luyện tập trong ba tháng gần nhất
 SELECT UID,
        date_format(start_time, '%Y%m') AS month_d,
        submit_time,
        exam_id,
        dense_rank() OVER (PARTITION BY UID
                           ORDER BY date_format(start_time, '%Y%m') DESC) AS ranking
   FROM exam_record
   LEFT JOIN user_info USING (UID)
   WHERE LEVEL IN (6,7) ) t1 USING (UID)
WHERE t1.ranking <= 3 AND t.ranking >= 0.5 -- Dùng các điều kiện giới hạn để tìm bản ghi thỏa mãn

GROUP BY t1.uid,
         t1.month_d
ORDER BY t1.uid,
         t1.month_d
```
### Tỷ lệ tăng trưởng số bài hoàn thành so với cùng kỳ năm 2020 và thay đổi thứ hạng (rất khó)

**Mô tả**:

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` loại đề thi, `difficulty` độ khó đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag    | difficulty | duration | release_time        |
| --- | ------- | ------ | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL    | hard       | 60       | 2021-01-01 10:00:00 |
| 2   | 9002    | C++    | hard       | 80       | 2021-01-01 10:00:00 |
| 3   | 9003    | 算法   | hard       | 80       | 2021-01-01 10:00:00 |
| 4   | 9004    | PYTHON | medium     | 70       | 2021-01-01 10:00:00 |

Bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score |
| --- | ---- | ------- | ------------------- | ------------------- | ----- |
| 1   | 1001 | 9001    | 2020-08-02 10:01:01 | 2020-08-02 10:31:01 | 89    |
| 2   | 1002 | 9001    | 2020-04-01 18:01:01 | 2020-04-01 18:59:02 | 90    |
| 3   | 1001 | 9001    | 2020-04-01 09:01:01 | 2020-04-01 09:21:59 | 80    |
| 5   | 1002 | 9001    | 2021-03-02 19:01:01 | 2021-03-02 19:32:00 | 20    |
| 8   | 1003 | 9001    | 2021-05-02 12:01:01 | 2021-05-02 12:31:01 | 98    |
| 13  | 1003 | 9001    | 2020-01-02 10:01:01 | 2020-01-02 10:31:01 | 89    |
| 9   | 1001 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:20:01 | 99    |
| 10  | 1002 | 9002    | 2021-02-02 12:01:01 | 2020-02-02 12:43:01 | 81    |
| 11  | 1001 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:59:01 | 69    |
| 16  | 1002 | 9002    | 2020-02-02 12:01:01 |                     |       |
| 17  | 1002 | 9002    | 2020-03-02 12:11:01 |                     |       |
| 18  | 1001 | 9002    | 2021-05-05 18:01:01 |                     |       |
| 4   | 1002 | 9003    | 2021-01-20 10:01:01 | 2021-01-20 10:10:01 | 81    |
| 6   | 1001 | 9003    | 2021-04-02 19:01:01 | 2021-04-02 19:40:01 | 89    |
| 15  | 1002 | 9003    | 2021-01-01 18:01:01 | 2021-01-01 18:59:02 | 90    |
| 7   | 1004 | 9004    | 2020-05-02 12:01:01 | 2020-05-02 12:20:01 | 99    |
| 12  | 1001 | 9004    | 2021-09-02 12:11:01 |                     |       |
| 14  | 1002 | 9004    | 2020-01-01 12:11:01 | 2020-01-01 12:31:01 | 83    |

Hãy tính tỷ lệ tăng trưởng số lần hoàn thành bài thi của từng loại đề thi trong nửa đầu năm 2021 so với cùng kỳ nửa đầu năm 2020 (định dạng phần trăm, giữ lại 1 chữ số thập phân), cùng với thay đổi thứ hạng về số lần hoàn thành; đầu ra sắp xếp theo tỷ lệ tăng trưởng và thứ hạng năm 2021 giảm dần.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| tag | exam_cnt_20 | exam_cnt_21 | growth_rate | exam_cnt_rank_20 | exam_cnt_rank_21 | rank_delta |
| --- | ----------- | ----------- | ----------- | ---------------- | ---------------- | ---------- |
| SQL | 3           | 2           | -33.3%      | 1                | 2                | 1          |

Giải thích: Nửa đầu năm 2020 có 3 tag có bản ghi hoàn thành bài thi, lần lượt là C++, SQL, PYTHON; số lần được hoàn thành lần lượt là 3, 3, 2; thứ hạng về số lần hoàn thành là 1, 1 (đồng hạng), 3;

Nửa đầu năm 2021 có 2 tag có bản ghi hoàn thành bài thi, lần lượt là 算法 (Thuật toán), SQL; số lần được hoàn thành lần lượt là 3, 2; thứ hạng về số lần hoàn thành là 1, 2; cụ thể như sau:

| tag    | start_year | exam_cnt | exam_cnt_rank |
| ------ | ---------- | -------- | ------------- |
| C++    | 2020       | 3        | 1             |
| SQL    | 2020       | 3        | 1             |
| PYTHON | 2020       | 2        | 3             |
| 算法   | 2021       | 3        | 1             |
| SQL    | 2021       | 2        | 2             |

Vì vậy tag duy nhất có thể xuất kết quả so sánh cùng kỳ là SQL: từ năm 2020 đến năm 2021, số lần hoàn thành 3=>2, giảm 33.3% (giữ lại 1 chữ số thập phân); thứ hạng 1=>2, tụt 1 hạng.

**Hướng giải:**

Điểm khó của bài này nằm ở yêu cầu kiểu dữ liệu long integer không được sinh ra dấu âm, dùng hàm cast để chuyển kiểu dữ liệu sang signed.

Ngoài ra còn dùng đến `công thức tính tỷ lệ tăng trưởng: (exam_cnt_21-exam_cnt_20)/exam_cnt_20`

Thay đổi thứ hạng về số lần hoàn thành (so với năm 2020, thứ hạng năm 2021 tăng hay giảm bao nhiêu)

Công thức tính: `exam_cnt_rank_21 - exam_cnt_rank_20`

Trong MySQL, hàm `CAST()` dùng để chuyển kiểu dữ liệu của một biểu thức sang kiểu dữ liệu khác. Cú pháp cơ bản như sau:

```sql
CAST(expression AS data_type)

-- Chuyển một chuỗi thành số nguyên
SELECT CAST('123' AS INT);
```

Ví dụ thì không cần liệt kê từng cái một, hàm này rất đơn giản.

**Đáp án**:

```sql
SELECT
  tag,
  exam_cnt_20,
  exam_cnt_21,
  concat(
    round(
      100 * (exam_cnt_21 - exam_cnt_20) / exam_cnt_20,
      1
    ),
    '%'
  ) AS growth_rate,
  exam_cnt_rank_20,
  exam_cnt_rank_21,
  cast(exam_cnt_rank_21 AS signed) - cast(exam_cnt_rank_20 AS signed) AS rank_delta
FROM
  (
    # Số lần hoàn thành và thứ hạng số lần hoàn thành của từng loại đề thi trong nửa đầu năm 2020, 2021
    SELECT
      tag,
      count(
        IF (
          date_format(start_time, '%Y%m%d') BETWEEN '20200101'
          AND '20200630',
          start_time,
          NULL
        )
      ) AS exam_cnt_20,
      count(
        IF (
          substring(start_time, 1, 10) BETWEEN '2021-01-01'
          AND '2021-06-30',
          start_time,
          NULL
        )
      ) AS exam_cnt_21,
      rank() over (
        ORDER BY
          count(
            IF (
              date_format(start_time, '%Y%m%d') BETWEEN '20200101'
              AND '20200630',
              start_time,
              NULL
            )
          ) DESC
      ) AS exam_cnt_rank_20,
      rank() over (
        ORDER BY
          count(
            IF (
              substring(start_time, 1, 10) BETWEEN '2021-01-01'
              AND '2021-06-30',
              start_time,
              NULL
            )
          ) DESC
      ) AS exam_cnt_rank_21
    FROM
      examination_info
      JOIN exam_record USING (exam_id)
    WHERE
      submit_time IS NOT NULL
    GROUP BY
      tag
  ) main
WHERE
  exam_cnt_21 * exam_cnt_20 <> 0
ORDER BY
  growth_rate DESC,
  exam_cnt_rank_21 DESC
```
## Aggregate Window Function

### Chuẩn hóa min-max cho điểm số đề thi

**Mô tả**:

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` ID đề thi, `tag` loại đề thi, `difficulty` độ khó đề thi, `duration` thời lượng làm bài, `release_time` thời gian phát hành):

| id  | exam_id | tag    | difficulty | duration | release_time        |
| --- | ------- | ------ | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL    | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | C++    | hard       | 80       | 2020-01-01 10:00:00 |
| 3   | 9003    | 算法   | hard       | 80       | 2020-01-01 10:00:00 |
| 4   | 9004    | PYTHON | medium     | 70       | 2020-01-01 10:00:00 |

Bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 6   | 1003 | 9001    | 2020-01-02 12:01:01 | 2020-01-02 12:31:01 | 68     |
| 9   | 1001 | 9001    | 2020-01-02 10:01:01 | 2020-01-02 10:31:01 | 89     |
| 1   | 1001 | 9001    | 2020-01-01 09:01:01 | 2020-01-01 09:21:59 | 90     |
| 12  | 1002 | 9002    | 2021-05-05 18:01:01 | (NULL)              | (NULL) |
| 3   | 1004 | 9002    | 2020-01-01 12:01:01 | 2020-01-01 12:11:01 | 60     |
| 2   | 1003 | 9002    | 2020-01-01 19:01:01 | 2020-01-01 19:30:01 | 75     |
| 7   | 1001 | 9002    | 2020-01-02 12:01:01 | 2020-01-02 12:43:01 | 81     |
| 10  | 1002 | 9002    | 2020-01-01 12:11:01 | 2020-01-01 12:31:01 | 83     |
| 4   | 1003 | 9002    | 2020-01-01 12:01:01 | 2020-01-01 12:41:01 | 90     |
| 5   | 1002 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:32:00 | 90     |
| 11  | 1002 | 9004    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 8   | 1001 | 9005    | 2020-01-02 12:11:01 | (NULL)              | (NULL) |

Trong tính toán dữ liệu vật lý và thống kê, có một khái niệm gọi là chuẩn hóa min-max (min-max normalization), còn được gọi là chuẩn hóa độ lệch (deviation normalization), là phép biến đổi tuyến tính trên dữ liệu gốc, ánh xạ kết quả vào khoảng [0 - 1].

Hàm chuyển đổi là:

![](https://oss.javaguide.cn/github/javaguide/database/sql/29A377601170AB822322431FCDF7EDFE.png)

Hãy lấy điểm số của người dùng khi làm đề thi độ khó cao, thực hiện chuẩn hóa min-max trong phạm vi bản ghi làm bài của mỗi đề thi rồi co giãn về khoảng [0,100], và xuất ra ID người dùng, ID đề thi, trung bình điểm số sau chuẩn hóa; cuối cùng xuất ra theo ID đề thi tăng dần, điểm chuẩn hóa giảm dần. (Ghi chú: khoảng điểm mặc định là [0,100]; nếu một đề thi trong bản ghi làm bài chỉ có một điểm duy nhất thì không cần dùng công thức, điểm sau khi chuẩn hóa và co giãn vẫn là điểm gốc).

Kết quả đầu ra từ dữ liệu mẫu như sau:

| uid  | exam_id | avg_new_score |
| ---- | ------- | ------------- |
| 1001 | 9001    | 98            |
| 1003 | 9001    | 0             |
| 1002 | 9002    | 88            |
| 1003 | 9002    | 75            |
| 1001 | 9002    | 70            |
| 1004 | 9002    | 0             |

Giải thích: Các đề thi độ khó cao là 9001, 9002, 9003;

Có 3 bản ghi làm đề thi 9001, điểm số lần lượt là 68, 89, 90; sau khi chuẩn hóa theo công thức đã cho, điểm số là: 0, 95, 100. Hai điểm số sau đều do người dùng 1001 làm, vì vậy điểm mới của người dùng 1001 đối với đề thi 9001 là (95+100)/2≈98 (chỉ giữ phần nguyên), điểm mới của người dùng 1003 đối với đề thi 9001 là 0. Kết quả cuối cùng xuất ra theo ID đề thi tăng dần, điểm chuẩn hóa giảm dần.

**Hướng giải:**

Điểm cần chú ý:

1. Lấy đề thi độ khó cao, theo điểm số của mỗi đề thi, dùng Window Function max/min (col) over() để tính giá trị lớn nhất và nhỏ nhất trong mỗi nhóm, sau đó tính theo công thức chuẩn hóa, co giãn khoảng về [0,100], tức min_max\*100.
2. Nếu một loại đề thi chỉ có một điểm duy nhất thì không cần dùng công thức chuẩn hóa, vì chỉ có một điểm nên max_score=min_score=score, kết quả sau khi áp dụng công thức có thể trở thành 0.
3. Kết quả cuối cùng nhóm theo uid, exam_id để tính trung bình sau chuẩn hóa; các bản ghi có score là NULL phải được lọc bỏ.

Cuối cùng là hãy nhìn kỹ công thức ở trên (thật lòng mà nói, bài này trông khá lắt léo).

**Đáp án**:

```sql
SELECT
  uid,
  exam_id,
  round(sum(min_max) / count(score), 0) AS avg_new_score
FROM
  (
    SELECT
      *,
      IF (
        max_score = min_score,
        score,
        (score - min_score) / (max_score - min_score) * 100
      ) AS min_max
    FROM
      (
        SELECT
          uid,
          a.exam_id,
          score,
          max(score) over (PARTITION BY a.exam_id) AS max_score,
          min(score) over (PARTITION BY a.exam_id) AS min_score
        FROM
          exam_record a
          LEFT JOIN examination_info b USING (exam_id)
        WHERE
          difficulty = 'hard'
      ) t
    WHERE
      score IS NOT NULL
  ) t1
GROUP BY
  uid,
  exam_id
ORDER BY
  exam_id ASC,
  avg_new_score DESC;
```

### Số lượt làm bài mỗi tháng và tổng số lượt làm bài lũy kế đến tháng đó của mỗi đề thi

**Mô tả:**

Hiện có bảng bản ghi làm bài thi exam_record (uid ID người dùng, exam_id ID đề thi, start_time thời gian bắt đầu làm bài, submit_time thời gian nộp bài, score điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-01 09:01:01 | 2020-01-01 09:21:59 | 90     |
| 2   | 1002 | 9001    | 2020-01-20 10:01:01 | 2020-01-20 10:10:01 | 89     |
| 3   | 1002 | 9001    | 2020-02-01 12:11:01 | 2020-02-01 12:31:01 | 83     |
| 4   | 1003 | 9001    | 2020-03-01 19:01:01 | 2020-03-01 19:30:01 | 75     |
| 5   | 1004 | 9001    | 2020-03-01 12:01:01 | 2020-03-01 12:11:01 | 60     |
| 6   | 1003 | 9001    | 2020-03-01 12:01:01 | 2020-03-01 12:41:01 | 90     |
| 7   | 1002 | 9001    | 2020-05-02 19:01:01 | 2020-05-02 19:32:00 | 90     |
| 8   | 1001 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:59:01 | 69     |
| 9   | 1004 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:20:01 | 99     |
| 10  | 1003 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:31:01 | 68     |
| 11  | 1001 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:43:01 | 81     |
| 12  | 1001 | 9002    | 2020-03-02 12:11:01 | (NULL)              | (NULL) |

Hãy xuất ra số lượt làm bài mỗi tháng và tổng số lượt làm bài lũy kế đến tháng đó của mỗi đề thi.
Kết quả đầu ra từ dữ liệu mẫu như sau:

| exam_id | start_month | month_cnt | cum_exam_cnt |
| ------- | ----------- | --------- | ------------ |
| 9001    | 202001      | 2         | 2            |
| 9001    | 202002      | 1         | 3            |
| 9001    | 202003      | 3         | 6            |
| 9001    | 202005      | 1         | 7            |
| 9002    | 202001      | 1         | 1            |
| 9002    | 202002      | 3         | 4            |
| 9002    | 202003      | 1         | 5            |

Giải thích: Đề thi 9001 có bản ghi làm bài trong 4 tháng là 202001, 202002, 202003, 202005; số lượt làm bài mỗi tháng lần lượt là 2, 1, 3, 1; tổng số lượt làm bài lũy kế đến tháng đó lần lượt là 2, 3, 6, 7.

**Hướng giải:**

Bài này chỉ có hai điểm mấu chốt: thống kê tổng số lượt làm bài lũy kế đến tháng đó, xuất ra số lượt làm bài mỗi tháng và tổng số lượt làm bài lũy kế đến tháng đó của mỗi đề thi.

Đây là phần then chốt `**sum(count(*)) over(partition by exam_id order by date_format(start_time,'%Y%m'))**`

**Đáp án**:

```sql
SELECT exam_id,
       date_format(start_time, '%Y%m') AS start_month,
       count(*) AS month_cnt,
       sum(count(*)) OVER (PARTITION BY exam_id
                           ORDER BY date_format(start_time, '%Y%m')) AS cum_exam_cnt
FROM exam_record
GROUP BY exam_id,
         start_month
```
### Tình trạng làm bài mỗi tháng và lũy kế đến tháng đó (khó)

**Mô tả**: Hiện có bảng bản ghi làm bài thi `exam_record` (`uid` ID người dùng, `exam_id` ID đề thi, `start_time` thời gian bắt đầu làm bài, `submit_time` thời gian nộp bài, `score` điểm số):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-01 09:01:01 | 2020-01-01 09:21:59 | 90     |
| 2   | 1002 | 9001    | 2020-01-20 10:01:01 | 2020-01-20 10:10:01 | 89     |
| 3   | 1002 | 9001    | 2020-02-01 12:11:01 | 2020-02-01 12:31:01 | 83     |
| 4   | 1003 | 9001    | 2020-03-01 19:01:01 | 2020-03-01 19:30:01 | 75     |
| 5   | 1004 | 9001    | 2020-03-01 12:01:01 | 2020-03-01 12:11:01 | 60     |
| 6   | 1003 | 9001    | 2020-03-01 12:01:01 | 2020-03-01 12:41:01 | 90     |
| 7   | 1002 | 9001    | 2020-05-02 19:01:01 | 2020-05-02 19:32:00 | 90     |
| 8   | 1001 | 9002    | 2020-01-02 19:01:01 | 2020-01-02 19:59:01 | 69     |
| 9   | 1004 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:20:01 | 99     |
| 10  | 1003 | 9002    | 2020-02-02 12:01:01 | 2020-02-02 12:31:01 | 68     |
| 11  | 1001 | 9002    | 2020-01-02 19:01:01 | 2020-02-02 12:43:01 | 81     |
| 12  | 1001 | 9002    | 2020-03-02 12:11:01 | (NULL)              | (NULL) |

Hãy xuất ra, kể từ khi có bản ghi làm bài của người dùng, số người dùng hoạt động trong tháng (MAU), số người dùng mới trong tháng, số người dùng mới lớn nhất trong một tháng tính lũy kế đến tháng đó và tổng số người dùng lũy kế đến tháng đó trong bản ghi làm bài thi của mỗi tháng. Kết quả xuất ra theo tháng tăng dần.

Kết quả đầu ra từ dữ liệu mẫu như sau:

| start_month | mau | month_add_uv | max_month_add_uv | cum_sum_uv |
| ----------- | --- | ------------ | ---------------- | ---------- |
| 202001      | 2   | 2            | 2                | 2          |
| 202002      | 4   | 2            | 2                | 4          |
| 202003      | 3   | 0            | 2                | 4          |
| 202005      | 1   | 0            | 2                | 4          |

| month  | 1001 | 1002 | 1003 | 1004 |
| ------ | ---- | ---- | ---- | ---- |
| 202001 | 1    | 1    |      |      |
| 202002 | 1    | 1    | 1    | 1    |
| 202003 | 1    |      | 1    | 1    |
| 202005 |      | 1    |      |      |

Từ ma trận trên có thể thấy, tháng 1 năm 2020 có 2 người dùng hoạt động (mau=2), số người dùng mới trong tháng là 2;

Tháng 2 năm 2020 có 4 người dùng hoạt động, số người dùng mới trong tháng là 2, số người dùng mới lớn nhất trong một tháng là 2, tổng số người dùng lũy kế hiện tại là 4.

**Hướng giải:**

Điểm khó:

1. Làm thế nào để tính số người dùng mới mỗi tháng

2. Tình trạng làm bài lũy kế đến tháng đó

Quy trình tổng quát:

(1) Thống kê tháng đăng nhập đầu tiên của mỗi người dùng `min()`

(2) Thống kê MAU và số người dùng mới mỗi tháng: trước tiên lấy tháng đăng nhập đầu tiên của mỗi người dùng, sau đó nhóm theo tháng đăng nhập đầu tiên và tính tổng — đó chính là số người mới của tháng đó

(3) Thống kê số người dùng mới lớn nhất trong một tháng lũy kế đến tháng đó và tổng số người dùng lũy kế đến tháng đó, cuối cùng xuất ra theo tháng tăng dần

**Đáp án**:

```sql
-- Số người dùng mới lớn nhất trong một tháng lũy kế đến tháng đó, tổng số người dùng lũy kế đến tháng đó, xuất ra theo tháng tăng dần
SELECT
	start_month,
	mau,
	month_add_uv,
	max( month_add_uv ) over ( ORDER BY start_month ),
	sum( month_add_uv ) over ( ORDER BY start_month )
FROM
	(
	-- Thống kê MAU và số người dùng mới mỗi tháng
	SELECT
		date_format( a.start_time, '%Y%m' ) AS start_month,
		count( DISTINCT a.uid ) AS mau,
		count( DISTINCT b.uid ) AS month_add_uv
	FROM
		exam_record a
		LEFT JOIN (
         -- Thống kê tháng đăng nhập đầu tiên của mỗi người dùng
		SELECT uid, min( date_format( start_time, '%Y%m' )) AS first_month FROM exam_record GROUP BY uid ) b ON date_format( a.start_time, '%Y%m' ) = b.first_month
	GROUP BY
		start_month
	) main
ORDER BY
	start_month
```

<!-- @include: @article-footer.snippet.md -->
