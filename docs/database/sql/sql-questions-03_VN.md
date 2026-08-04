---
title: Tổng hợp câu hỏi phỏng vấn SQL thường gặp (Phần 3)
description: Phần 3 của loạt bài tổng hợp câu hỏi phỏng vấn SQL thường gặp, đi sâu vào cách sử dụng các Aggregate Function COUNT, SUM, AVG, MAX, MIN, cùng các kỹ thuật nâng cao như GROUP BY, lọc bằng HAVING và tính trung bình cắt cụt (truncated average).
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu cơ bản
  - SQL
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn SQL,Aggregate Function,COUNT,SUM,AVG,MAX,MIN,GROUP BY,HAVING,Trung bình cắt cụt
---

> Các câu hỏi được lấy từ: [牛客题霸 - Thử thách SQL nâng cao](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=240)

Với các câu hỏi khá khó hoặc khó, bạn có thể dựa vào tình hình thực tế của bản thân và yêu cầu phỏng vấn để quyết định có nên bỏ qua hay không.

## Aggregate Function (Hàm tổng hợp)

### Điểm trung bình cắt cụt của đề thi SQL độ khó cao (khá khó)

**Mô tả**: Đội ngũ vận hành của NowCoder muốn xem điểm số của mọi người trong các đề thi độ khó cao thuộc danh mục SQL.

Hãy giúp họ tính từ bảng dữ liệu `exam_record` giá trị trung bình cắt cụt (truncated average) (giá trị trung bình sau khi loại bỏ một điểm cao nhất và một điểm thấp nhất) của tất cả người dùng đã hoàn thành đề thi SQL độ khó cao.

Dữ liệu mẫu: `examination_info` (`exam_id` là ID đề thi, tag là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành)

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | 算法 | medium     | 80       | 2020-08-02 10:00:00 |

Dữ liệu mẫu: `exam_record` (uid là ID người dùng, exam_id là ID đề thi, start_time là thời gian bắt đầu làm bài, submit_time là thời gian nộp bài, score là điểm)

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:01 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | 2021-05-02 10:30:01 | 81     |
| 3   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:31:01 | 84     |
| 4   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 5   | 1001 | 9001    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 6   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 7   | 1002 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 8   | 1002 | 9001    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |
| 9   | 1003 | 9001    | 2021-09-07 12:01:01 | 2021-09-07 10:31:01 | 50     |
| 10  | 1004 | 9001    | 2021-09-06 10:01:01 | (NULL)              | (NULL) |

Dựa trên dữ liệu đầu vào, kết quả truy vấn của bạn như sau:

| tag | difficulty | clip_avg_score |
| --- | ---------- | -------------- |
| SQL | hard       | 81.7           |

Từ bảng `examination_info` có thể thấy, đề thi 9001 là đề thi SQL độ khó cao, các điểm số ghi nhận được khi làm đề thi này là [80,81,84,90,50], sau khi loại bỏ điểm cao nhất và điểm thấp nhất còn lại [80,81,84], điểm trung bình là 81.6666667, giữ lại một chữ số thập phân là 81.7

**Mô tả đầu vào:**

Dữ liệu đầu vào có ít nhất 3 điểm hợp lệ

**Hướng tiếp cận 1:** Muốn tìm đề thi SQL độ khó cao, chắc chắn cần JOIN với bảng examination_info, sau đó lọc ra đề thi có độ khó cao. Từ examination_info ta biết exam_id của đề SQL độ khó cao là 9001, vậy lát nữa sẽ dùng điều kiện exam_id = 9001 để truy vấn;

Trước tiên tìm các bản ghi của đề thi 9001 `select * from exam_record where exam_id = 9001`

Sau đó tìm điểm cao nhất `select max(score) 最高分 from exam_record where exam_id = 9001`

Tiếp theo tìm điểm thấp nhất `select min(score) 最低分 from exam_record where exam_id = 9001`

Trong tập kết quả điểm số truy vấn được, để loại bỏ điểm cao nhất và thấp nhất, cách trực quan nhất có thể nghĩ đến là dùng NOT IN hoặc NOT EXISTS đều được, ở đây dùng NOT IN.

Trước tiên viết phần thân chính `select tag, difficulty, round(avg(score), 1) clip_avg_score from examination_info info INNER JOIN exam_record record`

**Mẹo nhỏ**: Hàm `ROUND()` trong MYSQL, `ROUND(X)` trả về số nguyên gần nhất với tham số X, `ROUND(X,D)` trả về X với giá trị được giữ đến D chữ số thập phân, chữ số thứ D được làm tròn theo quy tắc bốn bỏ năm lên.

Sau đó ghép các "mảnh" câu lệnh ở trên lại với nhau. Lưu ý trong NOT IN, hai Subquery được liên kết bằng UNION ALL, dùng UNION để gộp kết quả của max và min vào cùng một cột, tạo thành hiệu ứng một cột nhiều dòng.

**Đáp án 1:**

```sql
SELECT tag, difficulty, ROUND(AVG(score), 1) clip_avg_score
	FROM examination_info info  INNER JOIN exam_record record
		WHERE info.exam_id = record.exam_id
			AND  record.exam_id = 9001
				AND record.score NOT IN(
					SELECT MAX(score)
						FROM exam_record
							WHERE exam_id = 9001
								UNION ALL
					SELECT MIN(score)
						FROM exam_record
							WHERE exam_id = 9001
				)
```

Đây là cách giải trực quan và dễ nghĩ đến nhất, nhưng vẫn còn chỗ cải tiến. Cách này xem như là "lách luật" để qua ải, thực ra nếu viết nghiêm ngặt đúng yêu cầu đề bài thì phải viết như sau:

```sql
SELECT tag,
       difficulty,
       ROUND(AVG(score), 1) clip_avg_score
FROM examination_info info
INNER JOIN exam_record record
WHERE info.exam_id = record.exam_id
  AND record.exam_id =
    (SELECT examination_info.exam_id
     FROM examination_info
     WHERE tag = 'SQL'
       AND difficulty = 'hard' )
  AND record.score NOT IN
    (SELECT MAX(score)
     FROM exam_record
     WHERE exam_id =
         (SELECT examination_info.exam_id
          FROM examination_info
          WHERE tag = 'SQL'
            AND difficulty = 'hard' )
     UNION ALL SELECT MIN(score)
     FROM exam_record
     WHERE exam_id =
         (SELECT examination_info.exam_id
          FROM examination_info
          WHERE tag = 'SQL'
            AND difficulty = 'hard' ) )
```

Tuy nhiên bạn sẽ thấy câu lệnh bị lặp lại rất nhiều, vì vậy có thể dùng `WITH` để tách phần dùng chung ra.

**Giới thiệu mệnh đề `WITH`**:

Mệnh đề `WITH`, còn được gọi là Common Table Expression (Biểu thức bảng chung, CTE), là cách định nghĩa một bảng tạm thời trong truy vấn SQL. Nó cho phép chúng ta tạo một tập kết quả có tên tạm thời bên trong truy vấn và tham chiếu đến tập kết quả đó ngay trong cùng một truy vấn.

Cách dùng cơ bản:

```sql
WITH cte_name (column1, column2, ..., columnN) AS (
    -- Thân truy vấn
    SELECT ...
    FROM ...
    WHERE ...
)
-- Truy vấn chính
SELECT ...
FROM cte_name
WHERE ...
```

Mệnh đề `WITH` gồm các thành phần sau:

- `cte_name`: Đặt tên cho bảng tạm thời, có thể tham chiếu trong truy vấn chính.
- `(column1, column2, ..., columnN)`: Tùy chọn, chỉ định tên cột của bảng tạm thời.
- `AS`: Bắt buộc, biểu thị bắt đầu định nghĩa bảng tạm thời.
- `Thân truy vấn CTE`: Câu lệnh truy vấn thực tế, dùng để định nghĩa dữ liệu trong bảng tạm thời.

Một trong những công dụng chính của mệnh đề `WITH` là tăng tính dễ đọc và dễ bảo trì của truy vấn, đặc biệt khi liên quan đến nhiều Subquery lồng nhau hoặc cần dùng lại cùng một logic truy vấn. Bằng cách đưa các logic này vào một bảng tạm thời có tên, chúng ta có thể tổ chức truy vấn rõ ràng hơn và loại bỏ mã lặp.

Ngoài ra, mệnh đề `WITH` còn có thể thực hiện truy vấn đệ quy trong các truy vấn phức tạp. Truy vấn đệ quy cho phép chúng ta thực hiện nhiều lần lặp trên cùng một bảng trong một truy vấn duy nhất, từng bước xây dựng tập kết quả. Điều này rất hữu ích trong các tình huống xử lý dữ liệu phân cấp, cơ cấu tổ chức và cấu trúc cây.

**Chi tiết nhỏ**: MySQL phiên bản 5.7 và các phiên bản trước đó không hỗ trợ sử dụng trực tiếp alias trong mệnh đề `WITH`.

Dưới đây là đáp án sau khi cải tiến:

```sql
WITH t1 AS
  (SELECT record.*,
          info.tag,
          info.difficulty
   FROM exam_record record
   INNER JOIN examination_info info ON record.exam_id = info.exam_id
   WHERE info.tag = "SQL"
     AND info.difficulty = "hard" )
SELECT tag,
       difficulty,
       ROUND(AVG(score), 1)
FROM t1
WHERE score NOT IN
    (SELECT max(score)
     FROM t1
     UNION SELECT min(score)
     FROM t1)
```

**Hướng tiếp cận 2:**

- Lọc đề thi SQL độ khó cao: `where tag="SQL" and difficulty="hard"`
- Tính trung bình cắt cụt: `(tổng - giá trị lớn nhất - giá trị nhỏ nhất) / (tổng số - 2)`:
  - `(sum(score) - max(score) - min(score)) / (count(score) - 2)`
  - Có một nhược điểm là nếu giá trị lớn nhất và nhỏ nhất xuất hiện nhiều lần thì phương pháp này khó lọc chính xác, nhưng đề bài đã nói rõ -----> **`giá trị trung bình sau khi loại bỏ một điểm cao nhất và một điểm thấp nhất`**, nên ở đây có thể dùng công thức này.

**Đáp án 2:**

```sql
SELECT info.tag,
       info.difficulty,
       ROUND((SUM(record.score)- MIN(record.score)- MAX(record.score)) / (COUNT(record.score)- 2), 1) AS clip_avg_score
FROM examination_info info,
     exam_record record
WHERE info.exam_id = record.exam_id
  AND info.tag = "SQL"
  AND info.difficulty = "hard";
```

### Thống kê số lần làm bài

Có bảng ghi nhận làm bài thi `exam_record`, hãy thống kê từ đó tổng số lần làm bài `total_pv`, số lần làm bài đã hoàn thành `complete_pv` và số đề thi đã hoàn thành `complete_exam_cnt`.

Dữ liệu mẫu của bảng `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:01 | 80     |
| 2   | 1001 | 9001    | 2021-05-02 10:01:01 | 2021-05-02 10:30:01 | 81     |
| 3   | 1001 | 9001    | 2021-06-02 19:01:01 | 2021-06-02 19:31:01 | 84     |
| 4   | 1001 | 9002    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 5   | 1001 | 9001    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 6   | 1001 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 7   | 1002 | 9002    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 8   | 1002 | 9001    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |
| 9   | 1003 | 9001    | 2021-09-07 12:01:01 | 2021-09-07 10:31:01 | 50     |
| 10  | 1004 | 9001    | 2021-09-06 10:01:01 | (NULL)              | (NULL) |

Kết quả đầu ra mẫu:

| total_pv | complete_pv | complete_exam_cnt |
| -------- | ----------- | ----------------- |
| 10       | 7           | 2                 |

Giải thích: Tính đến thời điểm hiện tại có 10 bản ghi làm bài thi, số lần làm bài đã hoàn thành là 7 (bỏ dở giữa chừng được xem là chưa hoàn thành, với thời gian nộp bài và điểm số là NULL), các đề thi đã hoàn thành gồm 2 đề là 9001 và 9002.

**Hướng tiếp cận**: Nhìn thấy yêu cầu thống kê số lần, điều đầu tiên phải nghĩ đến là dùng hàm `COUNT`. Vấn đề là cần thống kê các loại bản ghi khác nhau thì phải viết thế nào? Dùng Subquery có thể giải quyết bài toán này (bài này dùng CASE WHEN cũng viết được, cách giải tương tự, chỉ khác về logic); trước tiên, hãy cùng tìm hiểu cách dùng cơ bản của `COUNT`;

Cú pháp cơ bản của hàm `COUNT()` như sau:

```sql
COUNT(expression)
```

Trong đó, `expression` có thể là tên cột, biểu thức, hằng số hoặc ký tự đại diện (wildcard). Dưới đây là một số ví dụ cách dùng thường gặp:

1. Đếm số lượng tất cả các dòng trong bảng:

```sql
SELECT COUNT(*) FROM table_name;
```

2. Đếm số lượng giá trị khác NULL của một cột cụ thể:

```sql
SELECT COUNT(column_name) FROM table_name;
```

3. Đếm số dòng thỏa mãn điều kiện:

```sql
SELECT COUNT(*) FROM table_name WHERE condition;
```

4. Kết hợp với `GROUP BY` để đếm số dòng của mỗi nhóm sau khi gom nhóm:

```sql
SELECT column_name, COUNT(*) FROM table_name GROUP BY column_name;
```

5. Đếm số tổ hợp duy nhất của các cột khác nhau:

```sql
SELECT COUNT(DISTINCT column_name1, column_name2) FROM table_name;
```

Khi sử dụng hàm `COUNT()`, nếu không chỉ định tham số nào hoặc dùng `COUNT(*)`, nó sẽ đếm tất cả các dòng. Còn nếu dùng tên cột, nó chỉ đếm số giá trị khác NULL của cột đó.

Ngoài ra, kết quả của hàm `COUNT()` là một số nguyên. Ngay cả khi kết quả là 0, nó cũng không trả về NULL, điểm này cần ghi nhớ.

**Đáp án**:

```sql
SELECT
	count(*) total_pv,
	( SELECT count(*) FROM exam_record WHERE submit_time IS NOT NULL ) complete_pv,
	( SELECT COUNT( DISTINCT exam_id, score IS NOT NULL OR NULL ) FROM exam_record ) complete_exam_cnt
FROM
	exam_record
```

Ở đây cần nói kỹ về câu `COUNT( DISTINCT exam_id, score IS NOT NULL OR NULL )`: nó kiểm tra score có phải là NULL hay không, nếu đúng thì trả về TRUE, nếu không thì trả về NULL; lưu ý nếu không thêm `or null` thì trong trường hợp khác NULL chỉ trả về FALSE, tức là trả về 0;

Bản thân `COUNT` không thể đếm số dòng trên nhiều cột, việc thêm `DISTINCT` khiến nhiều cột trở thành một thể thống nhất, từ đó có thể đếm được số dòng xuất hiện; `COUNT DISTINCT` khi tính toán chỉ trả về các dòng khác NULL, điểm này cũng cần chú ý;

Ngoài ra qua bài này chúng ta học được một mẫu câu thường dùng khi COUNT kèm điều kiện ------> `count( biểu_thức_điều_kiện_của_cột or null)`

### Điểm thấp nhất không nhỏ hơn điểm trung bình

**Mô tả**: Hãy tìm từ bảng ghi nhận làm bài thi điểm thấp nhất của người dùng có điểm thi SQL không nhỏ hơn điểm trung bình của các đề thi cùng loại đó.

Dữ liệu mẫu của bảng exam_record (uid là ID người dùng, exam_id là ID đề thi, start_time là thời gian bắt đầu làm bài, submit_time là thời gian nộp bài, score là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2020-01-02 09:01:01 | 2020-01-02 09:21:01 | 80     |
| 2   | 1002 | 9001    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 89     |
| 3   | 1002 | 9002    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 4   | 1002 | 9003    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5   | 1002 | 9001    | 2021-02-02 19:01:01 | 2021-02-02 19:30:01 | 87     |
| 6   | 1002 | 9002    | 2021-05-05 18:01:01 | 2021-05-05 18:59:02 | 90     |
| 7   | 1003 | 9002    | 2021-02-06 12:01:01 | (NULL)              | (NULL) |
| 8   | 1003 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 9   | 1004 | 9003    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |

Bảng `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành)

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | SQL  | easy       | 60       | 2020-02-01 10:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2020-08-02 10:00:00 |

Dữ liệu đầu ra mẫu:

| min_score_over_avg |
| ------------------ |
| 87                 |

**Giải thích**: Đề thi 9001 và 9002 thuộc danh mục SQL, điểm số khi làm hai đề thi này là [80,89,87,90], điểm trung bình là 86.5, điểm thấp nhất không nhỏ hơn điểm trung bình là 87

**Hướng tiếp cận**: Loại bài này thoạt nhìn quả thực rất phức tạp, vì không biết bắt đầu từ đâu, nhưng khi đọc kỹ đề bài, chúng ta phải học cách nắm bắt thông tin then chốt trong đề. Với bài này: `Hãy tìm từ bảng ghi nhận làm bài thi điểm thấp nhất của người dùng có điểm thi SQL không nhỏ hơn điểm trung bình của các đề thi cùng loại đó.` Bạn có thể trích xuất ngay những thông tin hữu hiệu nào từ đó để làm hướng giải?

Điều thứ nhất: Tìm ==điểm thi SQL==

Điều thứ hai: ==Điểm trung bình== của các đề thi loại này

Điều thứ ba: ==Điểm thấp nhất của người dùng== với các đề thi loại này

Sau đó "cây cầu" nối ở giữa chính là ==không nhỏ hơn==

Sau khi tách nhỏ các điều kiện, trước tiên hoàn thành từng bước

```sql
-- Tìm điểm của các bản ghi có tag là 'SQL'   【80, 89,87,90】
-- Sau đó tính điểm trung bình của nhóm này
select  ROUND(AVG(score), 1) from  examination_info info INNER JOIN exam_record record
	where info.exam_id = record.exam_id
	and tag= 'SQL'
```

Sau đó tìm điểm thấp nhất của các đề thi loại này, tiếp theo đem tập kết quả `【80, 89,87,90】` so sánh với điểm trung bình là có thể ra đáp án cuối cùng.

**Đáp án**:

```sql
SELECT MIN(score) AS min_score_over_avg
FROM examination_info info
INNER JOIN exam_record record
WHERE info.exam_id = record.exam_id
  AND tag= 'SQL'
  AND score >=
    (SELECT ROUND(AVG(score), 1)
     FROM examination_info info
     INNER JOIN exam_record record
     WHERE info.exam_id = record.exam_id
       AND tag= 'SQL' )
```

Thực ra yêu cầu của loại bài này nhìn tưởng chừng rất "lắt léo", nhưng nếu bình tĩnh rà soát một lượt, tách điều kiện lớn thành các điều kiện nhỏ, sau khi tách xong thì ghép tất cả các điều kiện lại. Chỉ cần nhớ kỹ: **nắm thân chính, gỡ nhánh phụ**, vấn đề sẽ được giải quyết dễ dàng.

## Truy vấn gom nhóm (GROUP BY)

### Số ngày hoạt động trung bình và số người dùng hoạt động hàng tháng

**Mô tả**: Bản ghi làm bài của người dùng trong khu vực làm đề thi trên NowCoder được lưu trong bảng `exam_record`, nội dung như sau:

Bảng `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm)

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-07-02 09:01:01 | 2021-07-02 09:21:01 | 80     |
| 2   | 1002 | 9001    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 81     |
| 3   | 1002 | 9002    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 4   | 1002 | 9003    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5   | 1002 | 9001    | 2021-07-02 19:01:01 | 2021-07-02 19:30:01 | 82     |
| 6   | 1002 | 9002    | 2021-07-05 18:01:01 | 2021-07-05 18:59:02 | 90     |
| 7   | 1003 | 9002    | 2021-07-06 12:01:01 | (NULL)              | (NULL) |
| 8   | 1003 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 9   | 1004 | 9003    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 10  | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81     |
| 11  | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 12  | 1006 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |
| 13  | 1007 | 9002    | 2020-09-02 12:11:01 | 2020-09-02 12:31:01 | 89     |

Hãy tính số ngày hoạt động trung bình trong khu vực làm đề thi của mỗi tháng trong năm 2021 `avg_active_days` và số người dùng hoạt động hàng tháng (Monthly Active Users) `mau`, kết quả đầu ra mẫu của dữ liệu trên như sau:

| month  | avg_active_days | mau |
| ------ | --------------- | --- |
| 202107 | 1.50            | 2   |
| 202109 | 1.25            | 4   |

**Giải thích**: Tháng 7 năm 2021 có 2 người hoạt động, tổng cộng hoạt động 3 ngày (1001 hoạt động 1 ngày, 1002 hoạt động 2 ngày), số ngày hoạt động trung bình là 1.5; tháng 9 năm 2021 có 4 người hoạt động, tổng cộng hoạt động 5 ngày, số ngày hoạt động trung bình là 1.25, kết quả giữ lại 2 chữ số thập phân.

Lưu ý: Ở đây "hoạt động" nghĩa là có hành vi ==nộp bài==.

**Hướng tiếp cận**: Đọc xong đề bài, trước tiên chú ý phần được đánh dấu; thông thường khi cần tính số ngày và số người hoạt động hàng tháng, phải nghĩ ngay đến các hàm ngày tháng liên quan; bài này chúng ta cũng tách nhỏ vấn đề rồi giải quyết; trước tiên tính số người hoạt động, chắc chắn phải dùng `COUNT()`, ở đây có một cái bẫy, không biết mọi người có để ý không? Người dùng 1002 đã làm hai đề thi khác nhau trong tháng 9, nên phải chú ý loại trùng, nếu không khi thống kê số người hoạt động sẽ bị sai; thứ hai là phải biết định dạng ngày tháng, như bảng trên, đề bài yêu cầu hiển thị theo định dạng ngày `202107`, phải dùng `DATE_FORMAT` để định dạng.

Cách dùng cơ bản:

`DATE_FORMAT(date_value, format)`

- Tham số `date_value` là giá trị ngày hoặc giờ cần định dạng.
- Tham số `format` là định dạng ngày hoặc giờ được chỉ định (giống với định dạng ngày trong Java).

**Đáp án**:

```sql
SELECT DATE_FORMAT(submit_time, '%Y%m') MONTH,
                                        round(count(DISTINCT UID, DATE_FORMAT(submit_time, '%Y%m%d')) / count(DISTINCT UID), 2) avg_active_days,
                                        COUNT(DISTINCT UID) mau
FROM exam_record
WHERE YEAR (submit_time) = 2021
GROUP BY MONTH
```

Nói thêm một chút, dùng `COUNT(DISTINCT uid, DATE_FORMAT(submit_time, '%Y%m%d'))` có thể đếm số lượng giá trị tổ hợp của cột `uid` và cột `submit_time` sau khi được định dạng theo năm, tháng và ngày.

### Tổng số bài luyện mỗi tháng và số bài luyện trung bình mỗi ngày

**Mô tả**: Hiện có bảng ghi nhận luyện bài `practice_record`, nội dung mẫu như sau:

| id  | uid  | question_id | submit_time         | score |
| --- | ---- | ----------- | ------------------- | ----- |
| 1   | 1001 | 8001        | 2021-08-02 11:41:01 | 60    |
| 2   | 1002 | 8001        | 2021-09-02 19:30:01 | 50    |
| 3   | 1002 | 8001        | 2021-09-02 19:20:01 | 70    |
| 4   | 1002 | 8002        | 2021-09-02 19:38:01 | 70    |
| 5   | 1003 | 8002        | 2021-08-01 19:38:01 | 80    |

Hãy thống kê từ đó tổng số bài luyện trong tháng của người dùng `month_q_cnt` và số bài luyện trung bình mỗi ngày `avg_day_q_cnt` của từng tháng trong năm 2021 (sắp xếp theo tháng tăng dần), cùng với tình hình tổng thể của cả năm, kết quả đầu ra mẫu của dữ liệu như sau:

| submit_month | month_q_cnt | avg_day_q_cnt |
| ------------ | ----------- | ------------- |
| 202108       | 2           | 0.065         |
| 202109       | 3           | 0.100         |
| 2021 汇总    | 5           | 0.161         |

**Giải thích**: Tháng 8 năm 2021 có tổng cộng 2 bản ghi luyện bài, số bài luyện trung bình mỗi ngày là 2/31=0.065 (giữ lại 3 chữ số thập phân); tháng 9 năm 2021 có tổng cộng 3 bản ghi luyện bài, số bài luyện trung bình mỗi ngày là 3/30=0.100; cả năm 2021 có tổng cộng 5 bản ghi luyện bài (giá trị trung bình của tổng kết năm không có ý nghĩa thực tế, ở đây chúng ta tính theo 31 ngày là 5/31=0.161)

> NowCoder đã áp dụng phiên bản MySQL mới nhất, nếu kết quả chạy của bạn báo lỗi: ONLY_FULL_GROUP_BY, ý nghĩa là: đối với thao tác gom nhóm GROUP BY, nếu một cột trong SELECT không xuất hiện trong GROUP BY thì câu SQL đó không hợp lệ, vì cột không nằm trong mệnh đề GROUP BY, nghĩa là các cột được truy vấn phải xuất hiện sau GROUP BY nếu không sẽ báo lỗi, hoặc cột đó phải nằm trong một Aggregate Function.

**Hướng tiếp cận:**

Nhìn thấy dữ liệu mẫu phải liên tưởng ngay đến các hàm liên quan, ví dụ `submit_month` cần dùng `DATE_FORMAT` để định dạng ngày. Sau đó truy vấn số bài luyện của mỗi tháng.

Số bài luyện của mỗi tháng

```sql
SELECT MONTH ( submit_time ), COUNT( question_id )
FROM
	practice_record
GROUP BY
	MONTH (submit_time)
```

Tiếp theo, cột thứ ba cần dùng hàm `DAY(LAST_DAY(date_value))` để tìm số ngày trong tháng của một ngày cho trước.

Mã mẫu như sau:

```sql
SELECT DAY(LAST_DAY('2023-07-08')) AS days_in_month;
-- Kết quả: 31

SELECT DAY(LAST_DAY('2023-02-01')) AS days_in_month;
-- Kết quả: 28 (tháng Hai trong năm nhuận)

SELECT DAY(LAST_DAY(NOW())) AS days_in_current_month;
-- Kết quả: 31 (số ngày của tháng hiện tại)
```

Dùng hàm `LAST_DAY()` để lấy ngày cuối cùng của tháng chứa ngày cho trước, sau đó dùng hàm `DAY()` để trích xuất số ngày của ngày đó. Như vậy sẽ có được số ngày của tháng được chỉ định.

Cần lưu ý, hàm `LAST_DAY()` trả về một giá trị ngày, còn hàm `DAY()` dùng để trích xuất phần ngày (day) từ giá trị ngày đó.

Sau khi phân tích như trên, có thể viết ngay đáp án. Bài này phức tạp ở chỗ xử lý ngày tháng, còn logic bên trong không hề khó.

**Đáp án**:

```sql
SELECT DATE_FORMAT(submit_time, '%Y%m') submit_month,
       count(question_id) month_q_cnt,
       ROUND(COUNT(question_id) / DAY (LAST_DAY(submit_time)), 3) avg_day_q_cnt
FROM practice_record
WHERE DATE_FORMAT(submit_time, '%Y') = '2021'
GROUP BY submit_month
UNION ALL
SELECT '2021汇总' AS submit_month,
       count(question_id) month_q_cnt,
       ROUND(COUNT(question_id) / 31, 3) avg_day_q_cnt
FROM practice_record
WHERE DATE_FORMAT(submit_time, '%Y') = '2021'
ORDER BY submit_month
```

Trong kết quả đầu ra mẫu, vì dòng cuối cùng cần ra dữ liệu tổng kết nên phải dùng `UNION ALL` để thêm vào tập kết quả; đừng quên cuối cùng phải sắp xếp!

### Người dùng hợp lệ có số đề thi chưa hoàn thành lớn hơn 1 (khá khó)

**Mô tả**: Hiện có bảng ghi nhận làm bài thi `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm), dữ liệu mẫu như sau:

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-07-02 09:01:01 | 2021-07-02 09:21:01 | 80     |
| 2   | 1002 | 9001    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 81     |
| 3   | 1002 | 9002    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 4   | 1002 | 9003    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5   | 1002 | 9001    | 2021-07-02 19:01:01 | 2021-07-02 19:30:01 | 82     |
| 6   | 1002 | 9002    | 2021-07-05 18:01:01 | 2021-07-05 18:59:02 | 90     |
| 7   | 1003 | 9002    | 2021-07-06 12:01:01 | (NULL)              | (NULL) |
| 8   | 1003 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 9   | 1004 | 9003    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 10  | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81     |
| 11  | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 12  | 1006 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |
| 13  | 1007 | 9002    | 2020-09-02 12:11:01 | 2020-09-02 12:31:01 | 89     |

Còn có bảng thông tin đề thi `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành), dữ liệu mẫu như sau:

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | SQL  | easy       | 60       | 2020-02-01 10:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2020-08-02 10:00:00 |

Hãy thống kê dữ liệu của từng người dùng hợp lệ trong năm 2021 có số lần làm đề thi chưa hoàn thành lớn hơn 1 (người dùng hợp lệ là người có số lần hoàn thành đề thi ít nhất là 1 và số lần chưa hoàn thành nhỏ hơn 5), đầu ra gồm ID người dùng, số lần làm đề thi chưa hoàn thành, số lần hoàn thành đề thi, tập hợp tag các đề thi đã làm, sắp xếp theo số đề thi chưa hoàn thành từ nhiều đến ít. Kết quả đầu ra của dữ liệu mẫu như sau:

| uid  | incomplete_cnt | complete_cnt | detail                                                                      |
| ---- | -------------- | ------------ | --------------------------------------------------------------------------- |
| 1002 | 2              | 4            | 2021-09-01:算法;2021-07-02:SQL;2021-09-02:SQL;2021-09-05:SQL;2021-07-05:SQL |

**Giải thích**: Trong các bản ghi làm bài năm 2021, ngoại trừ 1004, các người dùng khác đều thỏa mãn định nghĩa người dùng hợp lệ, nhưng chỉ có 1002 có số đề thi chưa hoàn thành lớn hơn 1, vì vậy chỉ xuất ra 1002, trong detail là tập hợp các đề thi {ngày:tag} mà 1002 đã làm, ngày và tag được nối bằng **:**, giữa các phần tử nối bằng **;**.

**Hướng tiếp cận:**

Đọc kỹ đề bài, phân tích thấy: trước tiên phải JOIN bảng, vì phần sau cần xuất ra `tag`;

Lọc dữ liệu năm 2021

```sql
SELECT *
FROM exam_record er
LEFT JOIN examination_info ei ON er.exam_id = ei.exam_id
WHERE YEAR (er.start_time)= 2021
```

Gom nhóm theo uid, sau đó phán đoán điều kiện của từng người dùng, đề bài yêu cầu `số đề thi hoàn thành ít nhất là 1, số đề thi chưa hoàn thành phải lớn hơn 1 và nhỏ hơn 5`

Vậy lát nữa khi viết SQL, điều kiện sẽ là: `chưa_hoàn_thành > 1 and đã_hoàn_thành >=1 and chưa_hoàn_thành < 5`

Vì cuối cùng cần nối chuỗi, hơn nữa còn phải nối tổ hợp, có thể dùng hàm `GROUP_CONCAT`, dưới đây giới thiệu ngắn gọn cách dùng của hàm này:

Định dạng cơ bản:

```sql
GROUP_CONCAT([DISTINCT] expr [ORDER BY {unsigned_integer | col_name | expr} [ASC | DESC] [, ...]]             [SEPARATOR sep])
```

- `expr`: Cột hoặc biểu thức cần nối.
- `DISTINCT`: Tham số tùy chọn, dùng để loại trùng. Khi chỉ định `DISTINCT`, các giá trị giống nhau chỉ xuất hiện một lần.
- `ORDER BY`: Tham số tùy chọn, dùng để sắp xếp các giá trị sau khi nối. Có thể chọn sắp xếp tăng dần (`ASC`) hoặc giảm dần (`DESC`).
- `SEPARATOR sep`: Tham số tùy chọn, dùng để đặt ký tự phân tách cho các giá trị sau khi nối. (Bài này cần dùng tham số này để đặt dấu ;)

Hàm `GROUP_CONCAT()` thường được dùng trong mệnh đề `GROUP BY`, nối giá trị của một nhóm dòng thành một chuỗi, và trả về dưới dạng tổng hợp trong tập kết quả.

**Đáp án**:

```sql
SELECT a.uid,
       SUM(CASE
               WHEN a.submit_time IS NULL THEN 1
           END) AS incomplete_cnt,
       SUM(CASE
               WHEN a.submit_time IS NOT NULL THEN 1
           END) AS complete_cnt,
       GROUP_CONCAT(DISTINCT CONCAT(DATE_FORMAT(a.start_time, '%Y-%m-%d'), ':', b.tag)
                    ORDER BY start_time SEPARATOR ";") AS detail
FROM exam_record a
LEFT JOIN examination_info b ON a.exam_id = b.exam_id
WHERE YEAR (a.start_time)= 2021
GROUP BY a.uid
HAVING incomplete_cnt > 1
AND complete_cnt >= 1
AND incomplete_cnt < 5
ORDER BY incomplete_cnt DESC
```

- `SUM(CASE WHEN a.submit_time IS NULL THEN 1 END)` thống kê số bản ghi chưa hoàn thành của mỗi người dùng.
- `SUM(CASE WHEN a.submit_time IS NOT NULL THEN 1 END)` thống kê số bản ghi đã hoàn thành của mỗi người dùng.
- `GROUP_CONCAT(DISTINCT CONCAT(DATE_FORMAT(a.start_time, '%Y-%m-%d'), ':', b.tag) ORDER BY a.start_time SEPARATOR ';')` nối ngày thi và tag của mỗi người dùng thành một chuỗi với các phần được phân tách bằng dấu phẩy, và sắp xếp theo thời gian bắt đầu thi.

## Nested Subquery (Truy vấn con lồng nhau)

### Danh mục yêu thích của người dùng có số đề thi hoàn thành trung bình mỗi tháng không nhỏ hơn 3 (khá khó)

**Mô tả**: Hiện có bảng ghi nhận làm bài thi `exam_record` (`uid`: ID người dùng, `exam_id`: ID đề thi, `start_time`: thời gian bắt đầu làm bài, `submit_time`: thời gian nộp bài, nếu chưa nộp thì là NULL, `score`: điểm), dữ liệu mẫu như sau:

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-07-02 09:01:01 | (NULL)              | (NULL) |
| 2   | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:21:01 | 60     |
| 3   | 1002 | 9002    | 2021-09-02 12:01:01 | 2021-09-02 12:31:01 | 70     |
| 4   | 1002 | 9001    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 81     |
| 5   | 1002 | 9002    | 2021-07-06 12:01:01 | (NULL)              | (NULL) |
| 6   | 1003 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 7   | 1003 | 9003    | 2021-09-08 12:01:01 | 2021-09-08 12:11:01 | 40     |
| 8   | 1003 | 9001    | 2021-09-08 13:01:01 | (NULL)              | (NULL) |
| 9   | 1003 | 9002    | 2021-09-08 14:01:01 | (NULL)              | (NULL) |
| 10  | 1003 | 9003    | 2021-09-08 15:01:01 | (NULL)              | (NULL) |
| 11  | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 12  | 1005 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 13  | 1005 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |

Bảng thông tin đề thi `examination_info` (`exam_id`: ID đề thi, `tag`: danh mục đề thi, `difficulty`: độ khó của đề thi, `duration`: thời lượng làm bài, `release_time`: thời gian phát hành), dữ liệu mẫu như sau:

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2020-01-01 10:00:00 |
| 2   | 9002    | C++  | easy       | 60       | 2020-02-01 10:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2020-08-02 10:00:00 |

Hãy thống kê từ bảng các danh mục mà những người dùng có "số đề thi hoàn thành trung bình mỗi tháng" không nhỏ hơn 3 yêu thích làm, cùng với số lần làm, xuất ra theo số lần giảm dần, kết quả đầu ra mẫu như sau:

| tag  | tag_cnt |
| ---- | ------- |
| C++  | 4       |
| SQL  | 2       |
| 算法 | 1       |

**Giải thích**: Người dùng 1002 và 1005 đều có số đề thi hoàn thành trong tháng 09 năm 2021 là 3, các người dùng khác đều nhỏ hơn 3; sau đó kết quả phân bố tag các đề thi mà 1002 và 1005 đã làm, sắp xếp theo số lần làm giảm dần, lần lượt là C++, SQL, 算法.

**Hướng tiếp cận**: Bài này kiểm tra Subquery kết hợp, trọng tâm nằm ở `trung bình mỗi tháng >= 3`, nhưng cá nhân tôi cho rằng ở đây đề bài diễn đạt chưa rõ ràng, nên nói thẳng là tra tháng 9 thì sẽ dễ hiểu hơn nhiều; ở đây không phải mỗi tháng đều phải >= 3, cũng không phải tổng số lần làm bài / số tháng làm bài. Đừng hiểu sai.

Trước tiên truy vấn xem những người dùng nào có số lần làm bài trung bình mỗi tháng lớn hơn 3

```sql
SELECT UID
FROM exam_record record
GROUP BY UID,
         MONTH (start_time)
HAVING count(submit_time) >= 3
```

Có bước này rồi tiếp tục đi sâu, chỉ cần hiểu được bước trước (ý tôi là đừng bị chữ "trung bình mỗi tháng" trong đề bài làm rối), sau đó lồng thêm một Subquery để tra xem những người dùng nào nằm trong đó, rồi truy vấn các cột cần thiết theo đề bài là được. Nhớ sắp xếp!!

```sql
SELECT tag,
       count(start_time) AS tag_cnt
FROM exam_record record
INNER JOIN examination_info info ON record.exam_id = info.exam_id
WHERE UID IN
    (SELECT UID
     FROM exam_record record
     GROUP BY UID,
              MONTH (start_time)
     HAVING count(submit_time) >= 3)
GROUP BY tag
ORDER BY tag_cnt DESC
```

### Số người làm bài và điểm trung bình trong ngày phát hành đề thi

**Mô tả**: Hiện có bảng thông tin người dùng `user_info` (`uid` là ID người dùng, `nick_name` là biệt danh, `achievement` là điểm thành tích, `level` là cấp độ, `job` là hướng nghề nghiệp, `register_time` là thời gian đăng ký), dữ liệu mẫu như sau:

| id  | uid  | nick_name | achievement | level | job  | register_time       |
| --- | ---- | --------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号 | 3100        | 7     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号 | 2100        | 6     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 | 1500        | 5     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号 | 1100        | 4     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 5 号 | 1600        | 6     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 牛客 6 号 | 3000        | 6     | C++  | 2020-01-01 10:00:00 |

**Giải thích**: Người dùng 1001 có biệt danh là 牛客 1 号, điểm thành tích là 3100, cấp độ người dùng là cấp 7, hướng nghề nghiệp là 算法, thời gian đăng ký là 2020-01-01 10:00:00

Bảng thông tin đề thi `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành), dữ liệu mẫu như sau:

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | easy       | 60       | 2020-02-01 10:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2020-08-02 10:00:00 |

Bảng ghi nhận làm bài thi `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm), dữ liệu mẫu như sau:

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-07-02 09:01:01 | 2021-09-01 09:41:01 | 70     |
| 2   | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:21:01 | 60     |
| 3   | 1002 | 9002    | 2021-09-02 12:01:01 | 2021-09-02 12:31:01 | 70     |
| 4   | 1002 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 80     |
| 5   | 1002 | 9003    | 2021-08-01 12:01:01 | 2021-08-01 12:21:01 | 60     |
| 6   | 1002 | 9002    | 2021-08-02 12:01:01 | 2021-08-02 12:31:01 | 70     |
| 7   | 1002 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 85     |
| 8   | 1002 | 9002    | 2021-07-06 12:01:01 | (NULL)              | (NULL) |
| 9   | 1003 | 9002    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 10  | 1003 | 9003    | 2021-09-08 12:01:01 | 2021-09-08 12:11:01 | 40     |
| 11  | 1003 | 9003    | 2021-09-01 13:01:01 | 2021-09-01 13:41:01 | 70     |
| 12  | 1003 | 9001    | 2021-09-08 14:01:01 | (NULL)              | (NULL) |
| 13  | 1003 | 9002    | 2021-09-08 15:01:01 | (NULL)              | (NULL) |
| 14  | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 90     |
| 15  | 1005 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 16  | 1005 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |

Hãy tính với mỗi đề thi danh mục SQL, sau khi phát hành, số người dùng cấp trên 5 làm bài trong ngày hôm đó `uv` và điểm trung bình `avg_score`, sắp xếp theo số người giảm dần, nếu số người bằng nhau thì sắp xếp theo điểm trung bình tăng dần, kết quả đầu ra của dữ liệu mẫu như sau:

| exam_id | uv  | avg_score |
| ------- | --- | --------- |
| 9001    | 3   | 81.3      |

Giải thích: Chỉ có một đề thi danh mục SQL, ID đề thi là 9001, trong ngày phát hành (2021-09-01) có 1001, 1002, 1003, 1005 đã làm bài, nhưng 1003 là người dùng cấp 5, 3 người còn lại có cấp trên 5, điểm của ba người họ là [70,80,85,90], điểm trung bình là 81.3 (giữ lại 1 chữ số thập phân).

**Hướng tiếp cận**: Bài này nhìn có vẻ rất phức tạp, nhưng trước tiên cứ tách nhỏ từng điều kiện "bên ngoài", sau đó gộp lại với nhau là ra đáp án. Với truy vấn nhiều bảng, hãy nhớ kỹ: đi từ ngoài vào trong, bóc tách từng lớp.

Trước tiên nối ba bảng lại với nhau, đồng thời đặt một số điều kiện, ví dụ đề bài yêu cầu người dùng `cấp > 5`, vậy có thể truy vấn ra trước

```sql
SELECT DISTINCT u_info.uid
FROM examination_info e_info
INNER JOIN exam_record record
INNER JOIN user_info u_info
WHERE e_info.exam_id = record.exam_id
  AND u_info.uid = record.uid
  AND u_info.LEVEL > 5
```

Tiếp theo chú ý yêu cầu trong đề bài: `sau khi mỗi đề thi danh mục SQL được phát hành, người dùng làm bài trong ngày hôm đó`, chú ý chữ ==trong ngày hôm đó==, chúng ta phải nghĩ ngay đến việc so sánh thời gian.

So sánh ngày phát hành đề thi và ngày bắt đầu thi: `DATE(e_info.release_time) = DATE(record.start_time)`; không cần lo vấn đề `submit_time` là NULL, phần sau sẽ được lọc bỏ trong WHERE.

**Đáp án**:

```sql
SELECT record.exam_id AS exam_id,
       COUNT(DISTINCT u_info.uid) AS uv,
       ROUND(SUM(record.score) / COUNT(u_info.uid), 1) AS avg_score
FROM examination_info e_info
INNER JOIN exam_record record
INNER JOIN user_info u_info
WHERE e_info.exam_id = record.exam_id
  AND u_info.uid = record.uid
  AND DATE (e_info.release_time) = DATE (record.start_time)
  AND submit_time IS NOT NULL
  AND tag = 'SQL'
  AND u_info.LEVEL > 5
GROUP BY record.exam_id
ORDER BY uv DESC,
         avg_score ASC
```

Chú ý bước gom nhóm và sắp xếp cuối cùng! Trước tiên sắp xếp theo số người, nếu bằng nhau thì sắp xếp theo điểm trung bình.

### Phân bố cấp độ người dùng của những người có điểm làm bài thi lớn hơn 80

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` là ID người dùng, `nick_name` là biệt danh, `achievement` là điểm thành tích, `level` là cấp độ, `job` là hướng nghề nghiệp, `register_time` là thời gian đăng ký):

| id  | uid  | nick_name | achievement | level | job  | register_time       |
| --- | ---- | --------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号 | 3100        | 7     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号 | 2100        | 6     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 | 1500        | 5     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号 | 1100        | 4     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 5 号 | 1600        | 6     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 牛客 6 号 | 3000        | 6     | C++  | 2020-01-01 10:00:00 |

Bảng thông tin đề thi `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | easy       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng ghi nhận làm bài thi `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:41:01 | 79     |
| 2   | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:21:01 | 60     |
| 3   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 70     |
| 4   | 1002 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 80     |
| 5   | 1002 | 9003    | 2021-08-01 12:01:01 | 2021-08-01 12:21:01 | 60     |
| 6   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 70     |
| 7   | 1002 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 85     |
| 8   | 1002 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 9   | 1003 | 9002    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 10  | 1003 | 9003    | 2021-09-08 12:01:01 | 2021-09-08 12:11:01 | 40     |
| 11  | 1003 | 9003    | 2021-09-01 13:01:01 | 2021-09-01 13:41:01 | 81     |
| 12  | 1003 | 9001    | 2021-09-01 14:01:01 | (NULL)              | (NULL) |
| 13  | 1003 | 9002    | 2021-09-08 15:01:01 | (NULL)              | (NULL) |
| 14  | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 90     |
| 15  | 1005 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 16  | 1005 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |

Thống kê phân bố cấp độ người dùng của những người có điểm làm đề thi danh mục SQL lớn hơn 80, sắp xếp theo số lượng giảm dần (đảm bảo số lượng đều khác nhau). Kết quả đầu ra của dữ liệu mẫu như sau:

| level | level_cnt |
| ----- | --------- |
| 6     | 2         |
| 5     | 1         |

Giải thích: 9001 là đề thi danh mục SQL, những người làm đề thi này đạt trên 80 điểm gồm 1002, 1003, 1005 tổng cộng 3 người, trong đó cấp 6 có hai người, cấp 5 có một người.

**Hướng tiếp cận:** Bài này dùng cùng dữ liệu với bài trước, chỉ thay đổi điều kiện truy vấn, nếu đã hiểu bài trước thì bài này giải trong vài phút.

**Đáp án**:

```sql
SELECT u_info.LEVEL AS LEVEL,
       count(u_info.uid) AS level_cnt
FROM examination_info e_info
INNER JOIN exam_record record
INNER JOIN user_info u_info
WHERE e_info.exam_id = record.exam_id
  AND u_info.uid = record.uid
  AND record.score > 80
  AND submit_time IS NOT NULL
  AND tag = 'SQL'
GROUP BY LEVEL
ORDER BY level_cnt DESC
```

## Truy vấn hợp nhất (UNION)

### Số người và số lần làm của mỗi câu hỏi và mỗi đề thi

**Mô tả**:

Hiện có bảng ghi nhận làm bài thi exam_record (uid là ID người dùng, exam_id là ID đề thi, start_time là thời gian bắt đầu làm bài, submit_time là thời gian nộp bài, score là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:41:01 | 81     |
| 2   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 70     |
| 3   | 1002 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 80     |
| 4   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 70     |
| 5   | 1004 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 85     |
| 6   | 1002 | 9002    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |

Bảng luyện bài practice_record (uid là ID người dùng, question_id là ID câu hỏi, submit_time là thời gian nộp, score là điểm):

| id  | uid  | question_id | submit_time         | score |
| --- | ---- | ----------- | ------------------- | ----- |
| 1   | 1001 | 8001        | 2021-08-02 11:41:01 | 60    |
| 2   | 1002 | 8001        | 2021-09-02 19:30:01 | 50    |
| 3   | 1002 | 8001        | 2021-09-02 19:20:01 | 70    |
| 4   | 1002 | 8002        | 2021-09-02 19:38:01 | 70    |
| 5   | 1003 | 8001        | 2021-08-02 19:38:01 | 70    |
| 6   | 1003 | 8001        | 2021-08-02 19:48:01 | 90    |
| 7   | 1003 | 8002        | 2021-08-01 19:38:01 | 80    |

Hãy thống kê số người và số lần làm của mỗi câu hỏi và mỗi đề thi, hiển thị lần lượt theo uv & pv của "đề thi" và "câu hỏi" giảm dần, kết quả đầu ra của dữ liệu mẫu như sau:

| tid  | uv  | pv  |
| ---- | --- | --- |
| 9001 | 3   | 3   |
| 9002 | 1   | 3   |
| 8001 | 3   | 5   |
| 8002 | 2   | 2   |

**Giải thích**: Về "đề thi", có 3 người luyện tổng cộng 3 lần đề 9001, 1 người làm 3 lần đề 9002; về "luyện bài", có 3 người luyện 5 lần câu 8001, có 2 người luyện 2 lần câu 8002

**Hướng tiếp cận**: Điểm khó và điểm dễ sai của bài này nằm ở vấn đề sử dụng `UNION` và `ORDER BY` cùng lúc

Có một số trường hợp như sau: dùng `UNION` với nhiều `ORDER BY` mà không có dấu ngoặc, sẽ báo lỗi!

`ORDER BY` không có tác dụng trong các mệnh đề con được nối bằng `UNION`;

Ví dụ khi không thêm dấu ngoặc:

```sql
SELECT exam_id AS tid,
       COUNT(DISTINCT UID) AS uv,
       COUNT(UID) AS pv
FROM exam_record
GROUP BY exam_id
ORDER BY uv DESC,
         pv DESC
UNION
SELECT question_id AS tid,
       COUNT(DISTINCT UID) AS uv,
       COUNT(UID) AS pv
FROM practice_record
GROUP BY question_id
ORDER BY uv DESC,
         pv DESC
```

Báo lỗi cú pháp ngay, nếu không có dấu ngoặc thì chỉ được phép có một `ORDER BY`

Còn một trường hợp `ORDER BY` không có tác dụng nữa, nhưng nó có thể phát huy tác dụng trong mệnh đề con của mệnh đề con, cách giải quyết ở đây là bọc thêm một lớp truy vấn bên ngoài.

**Đáp án**:

```sql
SELECT *
FROM
  (SELECT exam_id AS tid,
          COUNT(DISTINCT exam_record.uid) uv,
          COUNT(*) pv
   FROM exam_record
   GROUP BY exam_id
   ORDER BY uv DESC, pv DESC) t1
UNION
SELECT *
FROM
  (SELECT question_id AS tid,
          COUNT(DISTINCT practice_record.uid) uv,
          COUNT(*) pv
   FROM practice_record
   GROUP BY question_id
   ORDER BY uv DESC, pv DESC) t2;
```

### Những người thỏa mãn từng hoạt động trong hai hoạt động

**Mô tả**: Để thúc đẩy nhiều người dùng hơn học tập và tiến bộ trong việc luyện bài trên nền tảng NowCoder, chúng tôi thường xuyên phát quà cho những người dùng vừa hoạt động tích cực vừa có thành tích tốt. Giả sử trước đây chúng tôi có hai đợt hoạt động vận hành, lần lượt phát phiếu quà tặng cho những người mà lần nào điểm đề thi cũng đạt 85 điểm (activity1) và những người có ít nhất một lần hoàn thành đề thi độ khó cao trong một nửa thời gian với điểm số lớn hơn 80 (activity2).

Bây giờ, bạn cần lọc ra một lần tất cả những người thỏa mãn hai hoạt động này để bàn giao cho đội ngũ vận hành. Hãy viết một câu SQL thực hiện: xuất ra trong năm 2021, tất cả những người mà lần nào điểm đề thi cũng đạt 85 điểm cùng với những người có ít nhất một lần hoàn thành đề thi độ khó cao trong một nửa thời gian với điểm số lớn hơn 80, gồm id và số hiệu hoạt động, xuất ra theo thứ tự ID người dùng.

Hiện có bảng thông tin đề thi `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | easy       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng ghi nhận làm bài thi `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score  |
| --- | ---- | ------- | ------------------- | ------------------- | ------ |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 81     |
| 2   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 70     |
| 3   | 1003 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | **86** |
| 4   | 1003 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 89     |
| 5   | 1004 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:30:01 | 85     |

Kết quả đầu ra của dữ liệu mẫu:

| uid  | activity  |
| ---- | --------- |
| 1001 | activity2 |
| 1003 | activity1 |
| 1004 | activity1 |
| 1004 | activity2 |

**Giải thích**: Người dùng 1001 có điểm thấp nhất là 81 nên không thỏa mãn hoạt động 1, nhưng đã hoàn thành đề thi dài 60 phút trong 29 phút 59 giây với điểm 81, thỏa mãn hoạt động 2; 1003 có điểm thấp nhất là 86 nên thỏa mãn hoạt động 1, thời gian hoàn thành đều lớn hơn một nửa thời lượng đề thi nên không thỏa mãn hoạt động 2; người dùng 1004 hoàn thành đề thi đúng bằng một nửa thời gian (tròn 30 phút) với điểm 85, thỏa mãn cả hoạt động 1 và hoạt động 2.

**Hướng tiếp cận**: Bài này cần thực hiện phép trừ thời gian, phải dùng hàm `TIMESTAMPDIFF()` để tính chênh lệch phút giữa hai mốc thời gian.

Dưới đây chúng ta xem cách dùng cơ bản

Ví dụ:

```sql
TIMESTAMPDIFF(MINUTE, start_time, end_time)
```

Tham số đầu tiên của hàm `TIMESTAMPDIFF()` là đơn vị thời gian, ở đây chúng ta chọn `MINUTE` để trả về chênh lệch tính bằng phút. Tham số thứ hai là mốc thời gian sớm hơn, tham số thứ ba là mốc thời gian muộn hơn. Hàm sẽ trả về chênh lệch phút giữa chúng

Sau khi hiểu cách dùng hàm này, chúng ta quay lại xem yêu cầu của `activity1`, chỉ cần tìm điểm lớn hơn 85, vậy cứ viết phần này ra trước, hướng tiếp cận phần sau sẽ rõ ràng hơn nhiều

```sql
SELECT DISTINCT UID
FROM exam_record
WHERE score >= 85
  AND YEAR (start_time) = '2021'
```

Theo điều kiện 2, tiếp tục viết `những người hoàn thành đề thi độ khó cao trong một nửa thời gian với điểm số lớn hơn 80`

```sql
SELECT UID
FROM examination_info info
INNER JOIN exam_record record
WHERE info.exam_id = record.exam_id
  AND (TIMESTAMPDIFF(MINUTE, start_time, submit_time)) < (info.duration / 2)
  AND difficulty = 'hard'
  AND score >= 80
```

Sau đó `UNION` hai phần lại với nhau là được. (Ở đây đặc biệt chú ý vấn đề dấu ngoặc và vị trí của `ORDER BY`, cách dùng cụ thể đã được đề cập trong bài trước)

**Đáp án**:

```sql
SELECT DISTINCT UID UID,
                    'activity1' activity
FROM exam_record
WHERE UID not in
    (SELECT UID
     FROM exam_record
     WHERE score<85
       AND YEAR(submit_time) = 2021 )
UNION
SELECT DISTINCT UID UID,
                    'activity2' activity
FROM exam_record e_r
LEFT JOIN examination_info e_i ON e_r.exam_id = e_i.exam_id
WHERE YEAR(submit_time) = 2021
  AND difficulty = 'hard'
  AND TIMESTAMPDIFF(SECOND, start_time, submit_time) <= duration *30
  AND score>80
ORDER BY UID
```

## Truy vấn kết hợp bảng (JOIN)

### Số đề thi hoàn thành và số câu hỏi luyện tập của người dùng thỏa mãn điều kiện (khó)

**Mô tả**:

Hiện có bảng thông tin người dùng user_info (uid là ID người dùng, nick_name là biệt danh, achievement là điểm thành tích, level là cấp độ, job là hướng nghề nghiệp, register_time là thời gian đăng ký):

| id  | uid  | nick_name | achievement | level | job  | register_time       |
| --- | ---- | --------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号 | 3100        | 7     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号 | 2300        | 7     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 | 2500        | 7     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号 | 1200        | 5     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 5 号 | 1600        | 6     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 牛客 6 号 | 2000        | 6     | C++  | 2020-01-01 10:00:00 |

Bảng thông tin đề thi examination_info (exam_id là ID đề thi, tag là danh mục đề thi, difficulty là độ khó của đề thi, duration là thời lượng làm bài, release_time là thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | hard       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng ghi nhận làm bài thi exam_record (uid là ID người dùng, exam_id là ID đề thi, start_time là thời gian bắt đầu làm bài, submit_time là thời gian nộp bài, score là điểm):

| id  | uid  | exam_id | start_time          | submit_time         | score |
| --- | ---- | ------- | ------------------- | ------------------- | ----- |
| 1   | 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 81    |
| 2   | 1002 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81    |
| 3   | 1003 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:40:01 | 86    |
| 4   | 1003 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:51 | 89    |
| 5   | 1004 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:30:01 | 85    |
| 6   | 1005 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:02 | 85    |
| 7   | 1006 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:21:01 | 84    |
| 8   | 1006 | 9001    | 2021-09-07 10:01:01 | 2021-09-07 10:21:01 | 80    |

Bảng ghi nhận luyện bài practice_record (uid là ID người dùng, question_id là ID câu hỏi, submit_time là thời gian nộp, score là điểm):

| id  | uid  | question_id | submit_time         | score |
| --- | ---- | ----------- | ------------------- | ----- |
| 1   | 1001 | 8001        | 2021-08-02 11:41:01 | 60    |
| 2   | 1002 | 8001        | 2021-09-02 19:30:01 | 50    |
| 3   | 1002 | 8001        | 2021-09-02 19:20:01 | 70    |
| 4   | 1002 | 8002        | 2021-09-02 19:38:01 | 70    |
| 5   | 1004 | 8001        | 2021-08-02 19:38:01 | 70    |
| 6   | 1004 | 8002        | 2021-08-02 19:48:01 | 90    |
| 7   | 1001 | 8002        | 2021-08-02 19:38:01 | 70    |
| 8   | 1004 | 8002        | 2021-08-02 19:48:01 | 90    |
| 9   | 1004 | 8002        | 2021-08-02 19:58:01 | 94    |
| 10  | 1004 | 8003        | 2021-08-02 19:38:01 | 70    |
| 11  | 1004 | 8003        | 2021-08-02 19:48:01 | 90    |
| 12  | 1004 | 8003        | 2021-08-01 19:38:01 | 80    |

Hãy tìm những cao thủ tên đỏ có điểm trung bình đề thi SQL độ khó cao lớn hơn 80 và đạt cấp 7, thống kê tổng số lần hoàn thành đề thi và tổng số lần luyện câu hỏi trong năm 2021 của họ, chỉ giữ lại những người dùng có bản ghi hoàn thành đề thi trong năm 2021. Kết quả sắp xếp theo số đề thi hoàn thành tăng dần, theo số câu hỏi luyện tập giảm dần.

Kết quả đầu ra của dữ liệu mẫu như sau:

| uid  | exam_cnt | question_cnt |
| ---- | -------- | ------------ |
| 1001 | 1        | 2            |
| 1003 | 2        | 0            |

Giải thích: Người dùng 1001, 1003, 1004, 1006 thỏa mãn điểm trung bình đề thi SQL độ khó cao lớn hơn 80, nhưng chỉ có 1001, 1003 là cao thủ tên đỏ cấp 7; 1001 hoàn thành 1 lần đề thi 9001, luyện 2 lần câu hỏi; 1003 hoàn thành 2 lần đề thi 9001, 9002, không luyện câu hỏi nào (vì vậy số đếm là 0)

**Hướng tiếp cận:**

Trước tiên lọc sơ bộ các điều kiện, ví dụ truy vấn ra trước những người dùng đã làm đề thi SQL độ khó cao

```sql
SELECT
	record.uid
FROM
	exam_record record
	INNER JOIN examination_info e_info ON record.exam_id = e_info.exam_id
	JOIN user_info u_info ON record.uid = u_info.uid
WHERE
	e_info.tag = 'SQL'
	AND e_info.difficulty = 'hard'
```

Sau đó theo yêu cầu của đề bài, tiếp tục chồng thêm các điều kiện vào là được;

Nhưng ở đây lại cần chú ý:

Thứ nhất: Không được đặt điều kiện `YEAR(submit_time)= 2021` ở cuối cùng, mà phải đặt trong điều kiện `ON`, vì LEFT JOIN có trường hợp trả về toàn bộ dòng của bảng bên trái còn bảng bên phải là NULL, mục đích của việc đặt trong mệnh đề `ON` của điều kiện `JOIN` là để đảm bảo khi kết hợp hai bảng, chỉ những bản ghi thỏa mãn điều kiện năm mới được kết hợp. Như vậy tránh được việc các bản ghi của năm khác bị đưa vào kết quả. Tức là 1001 đã làm đề thi năm 2021 nhưng chưa luyện câu hỏi nào, nếu đặt điều kiện ở cuối cùng thì sẽ loại mất trường hợp này.

Thứ hai: Bắt buộc phải là `COUNT(distinct er.exam_id) exam_cnt, COUNT(distinct pr.id) question_cnt,` phải thêm DISTINCT, vì LEFT JOIN tạo ra rất nhiều giá trị trùng lặp.

**Đáp án**:

```sql
SELECT er.uid AS UID,
       count(DISTINCT er.exam_id) AS exam_cnt,
       count(DISTINCT pr.id) AS question_cnt
FROM exam_record er
LEFT JOIN practice_record pr ON er.uid = pr.uid
AND YEAR (er.submit_time)= 2021
AND YEAR (pr.submit_time)= 2021
WHERE er.uid IN
    (SELECT er.uid
     FROM exam_record er
     LEFT JOIN examination_info ei ON er.exam_id = ei.exam_id
     LEFT JOIN user_info ui ON er.uid = ui.uid
     WHERE tag = 'SQL'
       AND difficulty = 'hard'
       AND LEVEL = 7
     GROUP BY er.uid
     HAVING avg(score) > 80)
GROUP BY er.uid
ORDER BY exam_cnt,
         question_cnt DESC
```

Có thể những bạn tỉ mỉ sẽ phát hiện, tại sao rõ ràng đã giới hạn điều kiện `tag = 'SQL' AND difficulty = 'hard'`, nhưng người dùng 1003 vẫn truy vấn ra hai bản ghi thi, trong đó `tag` của một lần thi là `C++`; đây là do đặc tính của `LEFT JOIN`, ngay cả khi không có dòng nào khớp với bảng bên phải, tất cả bản ghi của bảng bên trái vẫn được giữ lại.

### Tình hình hoạt động của mỗi người dùng cấp 6/7 (khó)

**Mô tả**:

Hiện có bảng thông tin người dùng `user_info` (`uid` là ID người dùng, `nick_name` là biệt danh, `achievement` là điểm thành tích, `level` là cấp độ, `job` là hướng nghề nghiệp, `register_time` là thời gian đăng ký):

| id  | uid  | nick_name | achievement | level | job  | register_time       |
| --- | ---- | --------- | ----------- | ----- | ---- | ------------------- |
| 1   | 1001 | 牛客 1 号 | 3100        | 7     | 算法 | 2020-01-01 10:00:00 |
| 2   | 1002 | 牛客 2 号 | 2300        | 7     | 算法 | 2020-01-01 10:00:00 |
| 3   | 1003 | 牛客 3 号 | 2500        | 7     | 算法 | 2020-01-01 10:00:00 |
| 4   | 1004 | 牛客 4 号 | 1200        | 5     | 算法 | 2020-01-01 10:00:00 |
| 5   | 1005 | 牛客 5 号 | 1600        | 6     | C++  | 2020-01-01 10:00:00 |
| 6   | 1006 | 牛客 6 号 | 2600        | 7     | C++  | 2020-01-01 10:00:00 |

Bảng thông tin đề thi `examination_info` (`exam_id` là ID đề thi, `tag` là danh mục đề thi, `difficulty` là độ khó của đề thi, `duration` là thời lượng làm bài, `release_time` là thời gian phát hành):

| id  | exam_id | tag  | difficulty | duration | release_time        |
| --- | ------- | ---- | ---------- | -------- | ------------------- |
| 1   | 9001    | SQL  | hard       | 60       | 2021-09-01 06:00:00 |
| 2   | 9002    | C++  | easy       | 60       | 2021-09-01 06:00:00 |
| 3   | 9003    | 算法 | medium     | 80       | 2021-09-01 10:00:00 |

Bảng ghi nhận làm bài thi `exam_record` (`uid` là ID người dùng, `exam_id` là ID đề thi, `start_time` là thời gian bắt đầu làm bài, `submit_time` là thời gian nộp bài, `score` là điểm):

| uid  | exam_id | start_time          | submit_time         | score  |
| ---- | ------- | ------------------- | ------------------- | ------ |
| 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 78     |
| 1001 | 9001    | 2021-09-01 09:01:01 | 2021-09-01 09:31:00 | 81     |
| 1005 | 9001    | 2021-09-01 19:01:01 | 2021-09-01 19:30:01 | 85     |
| 1005 | 9002    | 2021-09-01 12:01:01 | 2021-09-01 12:31:02 | 85     |
| 1006 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:21:59 | 84     |
| 1006 | 9001    | 2021-09-07 10:01:01 | 2021-09-07 10:21:01 | 81     |
| 1002 | 9001    | 2020-09-01 13:01:01 | 2020-09-01 13:41:01 | 81     |
| 1005 | 9001    | 2021-09-01 14:01:01 | (NULL)              | (NULL) |

Bảng ghi nhận luyện bài `practice_record` (`uid` là ID người dùng, `question_id` là ID câu hỏi, `submit_time` là thời gian nộp, `score` là điểm):

| uid  | question_id | submit_time         | score |
| ---- | ----------- | ------------------- | ----- |
| 1001 | 8001        | 2021-08-02 11:41:01 | 60    |
| 1004 | 8001        | 2021-08-02 19:38:01 | 70    |
| 1004 | 8002        | 2021-08-02 19:48:01 | 90    |
| 1001 | 8002        | 2021-08-02 19:38:01 | 70    |
| 1004 | 8002        | 2021-08-02 19:48:01 | 90    |
| 1006 | 8002        | 2021-08-04 19:58:01 | 94    |
| 1006 | 8003        | 2021-08-03 19:38:01 | 70    |
| 1006 | 8003        | 2021-08-02 19:48:01 | 90    |
| 1006 | 8003        | 2020-08-01 19:38:01 | 80    |

Hãy thống kê tổng số tháng hoạt động, số ngày hoạt động năm 2021, số ngày hoạt động làm đề thi năm 2021 và số ngày hoạt động luyện câu hỏi năm 2021 của mỗi người dùng cấp 6/7, sắp xếp theo tổng số tháng hoạt động và số ngày hoạt động năm 2021 giảm dần. Kết quả đầu ra của dữ liệu mẫu như sau:

| uid  | act_month_total | act_days_2021 | act_days_2021_exam |
| ---- | --------------- | ------------- | ------------------ |
| 1006 | 3               | 4             | 1                  |
| 1001 | 2               | 2             | 1                  |
| 1005 | 1               | 1             | 1                  |
| 1002 | 1               | 0             | 0                  |
| 1003 | 0               | 0             | 0                  |

**Giải thích**: Người dùng cấp 6/7 có tổng cộng 5 người, trong đó 1006 đã hoạt động trong 3 tháng 202109, 202108, 202008, các ngày hoạt động trong năm 2021 gồm 20210907, 20210804, 20210803, 20210802 tổng cộng 4 ngày, trong năm 2021 tại khu vực làm đề thi hoạt động 1 ngày là 20210907, tại khu vực luyện câu hỏi hoạt động 3 ngày.

**Hướng tiếp cận:**

Điểm mấu chốt của bài này là sử dụng `CASE WHEN THEN`, nếu không sẽ phải viết rất nhiều `LEFT JOIN` vì sẽ tạo ra rất nhiều tập kết quả.

Câu lệnh `CASE WHEN THEN` là một biểu thức điều kiện, dùng trong SQL để thực hiện các thao tác khác nhau hoặc trả về các kết quả khác nhau dựa trên điều kiện.

Cấu trúc cú pháp như sau:

```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    ELSE result
END
```

Trong cấu trúc này, có thể thêm nhiều mệnh đề `WHEN` tùy theo nhu cầu, sau mỗi mệnh đề `WHEN` là một điều kiện (condition) và một kết quả (result). Điều kiện có thể là bất kỳ biểu thức logic nào, nếu thỏa mãn điều kiện sẽ trả về kết quả tương ứng.

Mệnh đề `ELSE` cuối cùng là tùy chọn, dùng để chỉ định kết quả trả về mặc định khi tất cả các điều kiện trước đó đều không thỏa mãn. Nếu không cung cấp mệnh đề `ELSE` thì mặc định trả về `NULL`.

Ví dụ:

```sql
SELECT score,
    CASE
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 80 THEN '良好'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END AS grade
FROM student_scores;
```

Trong ví dụ trên, dựa vào các khoảng khác nhau của điểm số học sinh (score), dùng câu lệnh CASE WHEN THEN để trả về xếp loại (grade) tương ứng. Nếu điểm lớn hơn hoặc bằng 90 thì trả về "优秀" (xuất sắc); nếu điểm lớn hơn hoặc bằng 80 thì trả về "良好" (khá giỏi); nếu điểm lớn hơn hoặc bằng 60 thì trả về "及格" (đạt); nếu không thì trả về "不及格" (không đạt).

Vậy sau khi hiểu cách dùng ở trên, quay lại nhìn bài này, yêu cầu liệt kê số ngày hoạt động khác nhau.

```sql
count(distinct act_month) as act_month_total,
count(distinct case when year(act_time)='2021'then act_day end) as act_days_2021,
count(distinct case when year(act_time)='2021' and tag='exam' then act_day end) as act_days_2021_exam,
count(distinct case when year(act_time)='2021' and tag='question'then act_day end) as act_days_2021_question
```

Ở đây tag được đánh dấu trước để tiện phân biệt các truy vấn, tách riêng phần thi và phần luyện câu hỏi.

Tìm người dùng ở khu vực làm đề thi

```sql
SELECT
		uid,
		exam_id AS ans_id,
		start_time AS act_time,
		date_format( start_time, '%Y%m' ) AS act_month,
		date_format( start_time, '%Y%m%d' ) AS act_day,
		'exam' AS tag
	FROM
		exam_record
```

Ngay sau đó là người dùng ở khu vực luyện câu hỏi

```sql
SELECT
		uid,
		question_id AS ans_id,
		submit_time AS act_time,
		date_format( submit_time, '%Y%m' ) AS act_month,
		date_format( submit_time, '%Y%m%d' ) AS act_day,
		'question' AS tag
	FROM
		practice_record
```

Cuối cùng `UNION` hai kết quả lại, đừng quên sắp xếp kết quả (bài này hơi giống tư tưởng của thuật toán chia để trị)

**Đáp án**:

```sql
SELECT user_info.uid,
       count(DISTINCT act_month) AS act_month_total,
       count(DISTINCT CASE
                          WHEN YEAR (act_time)= '2021' THEN act_day
                      END) AS act_days_2021,
       count(DISTINCT CASE
                          WHEN YEAR (act_time)= '2021'
                               AND tag = 'exam' THEN act_day
                      END) AS act_days_2021_exam,
       count(DISTINCT CASE
                          WHEN YEAR (act_time)= '2021'
                               AND tag = 'question' THEN act_day
                      END) AS act_days_2021_question
FROM
  (SELECT UID,
          exam_id AS ans_id,
          start_time AS act_time,
          date_format(start_time, '%Y%m') AS act_month,
          date_format(start_time, '%Y%m%d') AS act_day,
          'exam' AS tag
   FROM exam_record
   UNION ALL SELECT UID,
                    question_id AS ans_id,
                    submit_time AS act_time,
                    date_format(submit_time, '%Y%m') AS act_month,
                    date_format(submit_time, '%Y%m%d') AS act_day,
                    'question' AS tag
   FROM practice_record) total
RIGHT JOIN user_info ON total.uid = user_info.uid
WHERE user_info.LEVEL IN (6,
                          7)
GROUP BY user_info.uid
ORDER BY act_month_total DESC,
         act_days_2021 DESC
```

<!-- @include: @article-footer.snippet.md -->
