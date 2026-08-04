---
title: Phân tích Execution Plan trong MySQL
description: Giải thích chi tiết ý nghĩa từng cột trong Execution Plan của EXPLAIN trong MySQL, bao gồm các trường quan trọng như id, select_type, type, key, rows, Extra, giúp bạn phân tích nút thắt hiệu năng SQL và tối ưu hóa có mục tiêu.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: Execution Plan trong MySQL,EXPLAIN,Query Optimizer,Phân tích hiệu năng SQL,Index Hit,type Access Type,Extra Field,Tối ưu Slow Query
---

Bước đầu tiên để tối ưu hóa SQL là đọc hiểu Execution Plan (Kế hoạch thực thi) của câu lệnh SQL. Trong bài viết này, chúng ta sẽ cùng tìm hiểu các kiến thức liên quan đến Execution Plan của `EXPLAIN` trong MySQL.

> **Lưu ý về phiên bản**: Nội dung bài viết dựa trên MySQL phiên bản 5.7+ và 8.0+. Cột `filtered` và `partitions` khả dụng từ MySQL 5.7+, tính năng `EXPLAIN ANALYZE` và Hash Join yêu cầu MySQL 8.0.18+ và 8.0.20+.

## Execution Plan là gì?

**Execution Plan** là phương thức thực thi cụ thể của một câu lệnh SQL sau khi được tối ưu hóa bởi **Query Optimizer (Bộ tối ưu hóa truy vấn) của MySQL**.

Execution Plan thường được sử dụng trong các tình huống phân tích và tối ưu hiệu năng SQL. Thông qua kết quả của `EXPLAIN`, chúng ta có thể biết được các thông tin như thứ tự truy vấn của các bảng dữ liệu, loại thao tác truy vấn dữ liệu, những Index nào có thể được sử dụng, những Index nào thực sự được sử dụng, mỗi bảng dữ liệu có bao nhiêu dòng được truy vấn, v.v.

## Làm thế nào để lấy Execution Plan?

MySQL cung cấp cho chúng ta lệnh `EXPLAIN` để lấy các thông tin liên quan của Execution Plan.

Cần lưu ý rằng câu lệnh `EXPLAIN` tiêu chuẩn không thực sự thực thi câu lệnh liên quan, mà thông qua Query Optimizer để phân tích câu lệnh, tìm ra phương án truy vấn tối ưu nhất và hiển thị thông tin tương ứng.

MySQL 8.0.18 đã giới thiệu `EXPLAIN ANALYZE`, nó sẽ **thực sự thực thi** truy vấn và đưa ra thời gian thực tế cũng như số dòng của từng bước, đáng tin cậy hơn so với dữ liệu ước tính của `EXPLAIN` tiêu chuẩn, phù hợp để điều tra chuyên sâu Slow Query trong môi trường test:

```sql
mysql> EXPLAIN ANALYZE SELECT * FROM users WHERE age = 25\G
*************************** 1. row ***************************
EXPLAIN: -> Covering index lookup on users using idx_age_score_name (age=25)
(cost=1.52 rows=12) (actual time=0.0272..0.0344 rows=12 loops=1)
```

Ngoài ra, `EXPLAIN FORMAT=JSON` có thể xuất dữ liệu mô hình chi phí của Optimizer (`query_cost`), phản ánh chi phí thực tế của từng bước tốt hơn so với dạng bảng, đặc biệt hữu ích khi tối ưu JOIN nhiều bảng hoặc Subquery:

```sql
mysql> EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age = 25\G
*************************** 1. row ***************************
EXPLAIN: {
  "query_block": {
    "select_id": 1,
    "cost_info": {
      "query_cost": "1.52"
    },
    "table": {
      "table_name": "users",
      "access_type": "ref",
      "key": "idx_age_score_name",
      "rows_examined_per_scan": 12,
      "filtered": "100.00",
      "using_index": true
    }
  }
}
```

Execution Plan của `EXPLAIN` hỗ trợ các câu lệnh `SELECT`, `DELETE`, `INSERT`, `REPLACE` và `UPDATE`. Chúng ta thường dùng nó để phân tích câu lệnh truy vấn `SELECT`, cách sử dụng rất đơn giản, cú pháp như sau:

```sql
EXPLAIN SELECT 查询语句；
```

Chúng ta cùng xem nhanh Execution Plan của một câu lệnh truy vấn:

**Ví dụ 1: Truy vấn bảng đơn (sử dụng Index)**

```sql
-- Cấu trúc bảng: users(id, age, score, name, address), Composite Index idx_age_score_name(age, score, name)
mysql> EXPLAIN SELECT * FROM users WHERE age = 25;
+----+-------------+-------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys       | key                 | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | users | NULL       | ref  | idx_age_score_name  | idx_age_score_name  | 5       | const |   12 |   100.00 | Using index |
+----+-------------+-------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------------+
```

**Ví dụ 2: Truy vấn UNION (trường hợp id là NULL)**

```sql
mysql> EXPLAIN SELECT * FROM users WHERE id = 1 UNION SELECT * FROM users WHERE id = 2;
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type  | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | PRIMARY      | users      | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
|  2 | UNION        | users      | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
|  3 | UNION RESULT | <union1,2> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  | NULL |     NULL | Using temporary |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
```

Có thể thấy, kết quả Execution Plan có tổng cộng 12 cột, ý nghĩa của các cột được tổng kết trong bảng sau:

| **Tên cột**   | **Ý nghĩa**                                                  |
| ------------- | ------------------------------------------------------------ |
| id            | Số định danh tuần tự của truy vấn SELECT                     |
| select_type   | Loại truy vấn tương ứng với từ khóa SELECT                   |
| table         | Tên bảng được sử dụng                                        |
| partitions    | Partition khớp, với bảng không phân vùng thì giá trị là NULL |
| type          | Phương thức truy cập bảng                                    |
| possible_keys | Index có thể được sử dụng                                    |
| key           | Index thực sự được sử dụng                                   |
| key_len       | Độ dài của Index được chọn                                   |
| ref           | Khi truy vấn đẳng trị sử dụng Index, cột hoặc hằng số được so sánh với Index |
| rows          | Số dòng dự kiến cần đọc                                      |
| filtered      | Tỷ lệ phần trăm số bản ghi còn lại sau khi lọc theo điều kiện của bảng |
| Extra         | Thông tin bổ sung                                            |

## Làm thế nào để phân tích kết quả EXPLAIN?

Để phân tích kết quả thực thi của câu lệnh `EXPLAIN`, chúng ta cần hiểu rõ các trường quan trọng trong Execution Plan.

### id

`SELECT` identifier, dùng để đánh dấu thứ tự thực thi của mỗi câu lệnh `SELECT`.

Quy tắc đọc hiểu cột `id`:

- **id giống nhau**: thực thi lần lượt từ trên xuống dưới (thường xuất hiện trong tình huống JOIN nhiều bảng)
- **id khác nhau**: giá trị id càng lớn, độ ưu tiên thực thi càng cao (Subquery được thực thi trước truy vấn bên ngoài)
- **id là NULL**: cho biết đây là tập kết quả của UNION RESULT hoặc bảng DERIVED, không cần thực thi truy vấn riêng

**Ví dụ**:

```sql
mysql> EXPLAIN SELECT * FROM users WHERE id = 1
    -> UNION
    -> SELECT * FROM users WHERE id = 2\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: users
         type: const
*************************** 2. row ***************************
           id: 2
  select_type: UNION
        table: users
         type: const
*************************** 3. row ***************************
           id: NULL
  select_type: UNION RESULT
        table: <union1,2>
         type: ALL
        Extra: Using temporary
```

Dòng thứ ba có `id = NULL`, table = `<union1,2>`, cho biết đây là kết quả hợp nhất của hai truy vấn trước đó.

### select_type

Loại truy vấn, chủ yếu dùng để phân biệt các truy vấn phức tạp như truy vấn thông thường, truy vấn UNION, Subquery, v.v. Các giá trị thường gặp:

- **SIMPLE**: Truy vấn đơn giản, không chứa UNION hoặc Subquery.
- **PRIMARY**: Nếu truy vấn chứa Subquery hoặc các phần khác, SELECT bên ngoài sẽ được đánh dấu là PRIMARY.
- **SUBQUERY**: SELECT đầu tiên trong Subquery.
- **UNION**: Trong câu lệnh UNION, SELECT xuất hiện sau UNION.
- **DERIVED**: Subquery xuất hiện trong FROM sẽ được đánh dấu là DERIVED.
- **UNION RESULT**: Kết quả của truy vấn UNION.

### table

Tên bảng được dùng trong truy vấn, mỗi dòng đều có tên bảng tương ứng, ngoài bảng thông thường, tên bảng cũng có thể là các giá trị sau:

- **`<unionM,N>`** : Dòng này tham chiếu kết quả UNION của các dòng có id là M và N;
- **`<derivedN>`** : Dòng này tham chiếu kết quả Derived Table được tạo ra từ bảng có id là N. Derived Table có thể được sinh ra từ Subquery trong câu lệnh FROM.
- **`<subqueryN>`** : Dòng này tham chiếu kết quả Materialized Subquery được tạo ra từ bảng có id là N.

### type (quan trọng)

Loại thực thi truy vấn, mô tả cách truy vấn được thực thi. **Thứ tự từ tốt nhất đến kém nhất**:

`system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL`

**Quy tắc kinh nghiệm đánh giá hiệu năng**:

- **Xuất sắc** (ít nhất phải đạt): `system`, `const`, `eq_ref`, `ref`, `range`
- **Cần chú ý**: `index_merge`, `index` (Full Index Scan, vẫn có rủi ro hiệu năng khi dữ liệu lớn)
- **Cần tối ưu**: `ALL` (Full Table Scan)

**Lưu ý**: Thứ tự này phản ánh **hiệu quả truy cập bảng đơn**, không đại diện cho hiệu năng truy vấn tổng thể. Ví dụ `type=ref` kèm theo nhiều Back to Table có thể chậm hơn Covering Index của `type=index`.

Ý nghĩa cụ thể của một số loại thường gặp như sau:

- **system**: Bảng chỉ có một dòng dữ liệu (hoặc là bảng trống), và Storage Engine có thể thống kê chính xác số dòng. Áp dụng cho các engine như MyISAM, Memory, InnoDB (khi bảng chỉ có 1 dòng, InnoDB sẽ tối ưu thành const), v.v. Là trường hợp đặc biệt của loại truy cập const.
- **const**: Bảng có tối đa một dòng khớp, một lần truy vấn là tìm thấy, thường dùng khi sử dụng tất cả các trường của Primary Key hoặc Unique Index làm điều kiện truy vấn.
- **eq_ref**: Khi JOIN nhiều bảng, mỗi dòng của bảng trước chỉ có một dòng tương ứng trong bảng hiện tại. Là phương thức JOIN tốt nhất ngoài system và const, thường dùng khi sử dụng tất cả các trường của Primary Key hoặc Unique NOT NULL Index làm điều kiện JOIN (đảm bảo nghiêm ngặt khớp một-một).
- **ref**: Sử dụng Index thông thường làm điều kiện truy vấn, kết quả truy vấn có thể tìm thấy nhiều dòng phù hợp điều kiện (khác biệt với eq_ref: một dòng điều khiển có thể khớp với nhiều dòng được điều khiển).
- **index Merge**: Khi mệnh đề WHERE chứa nhiều điều kiện phạm vi, và mỗi điều kiện có thể sử dụng Index khác nhau, MySQL sẽ hợp nhất kết quả quét của nhiều Index. Cột key liệt kê các Index được sử dụng, cột Extra hiển thị thuật toán hợp nhất:

  - `Using union(...)`: lấy hợp của kết quả nhiều Index (điều kiện OR)
  - `Using sort_union(...)`: sắp xếp kết quả Index trước rồi mới lấy hợp (điều kiện OR, cột Index không có thứ tự)
  - `Using intersection(...)`: lấy giao của kết quả nhiều Index (điều kiện AND)

  **Ví dụ**:

  ```sql
  -- Điều kiện OR kích hoạt index merge union
  EXPLAIN SELECT * FROM employees WHERE emp_no = 10001 OR dept_no = 'd001';
  -- Extra: Using union(PRIMARY,dept_no_index)
  ```

- **range**: Truy vấn phạm vi trên cột Index, cột key trong Execution Plan cho biết Index nào được sử dụng.
- **index**: Full Index Scan, truy vấn duyệt qua toàn bộ cây Index. Tương tự ALL (Full Table Scan) nhưng thường có chi phí thấp hơn: kích thước bản ghi Index nhỏ hơn nhiều so với dữ liệu dòng đầy đủ, số trang I/O cần đọc để đọc cùng số dòng ít hơn; nếu đồng thời thỏa mãn điều kiện Covering Index thì còn tránh được Back to Table. Nhưng trên các bảng siêu lớn (hàng trăm triệu dòng trở lên), Full Index Scan cũng có thể sinh ra lượng lớn I/O, không thể vì cấp độ type cao hơn ALL mà bỏ qua chi phí của nó.
- **ALL**: Full Table Scan.

### possible_keys

Cột possible_keys biểu thị các Index mà MySQL có thể sử dụng khi thực thi truy vấn. Nếu cột này là NULL thì nghĩa là không có Index nào có thể được sử dụng; trong trường hợp này, cần kiểm tra các cột được dùng trong câu lệnh WHERE, xem có thể cải thiện hiệu năng truy vấn bằng cách thêm Index cho một hoặc nhiều cột đó hay không.

### key (quan trọng)

Cột key biểu thị Index mà MySQL thực sự sử dụng. Nếu là NULL thì nghĩa là không sử dụng Index.

### key_len

Cột key_len biểu thị độ dài tối đa của Index mà MySQL thực sự sử dụng; khi sử dụng Composite Index, có thể là tổng độ dài của nhiều cột. Càng ngắn càng tốt với điều kiện đáp ứng yêu cầu. Nếu cột key hiển thị NULL thì cột key_len cũng hiển thị NULL.

### rows

Cột rows biểu thị số dòng **ước tính** cần đọc để tìm được bản ghi cần thiết, dựa trên thống kê của bảng và tình trạng sử dụng Index, giá trị càng nhỏ càng tốt.

Cần lưu ý rằng giá trị này là ước tính chứ không phải giá trị chính xác. Thống kê của InnoDB dựa trên lấy mẫu ngẫu nhiên các trang Index:

- Số trang lấy mẫu được điều khiển bởi `innodb_stats_persistent_sample_pages` (mặc định 20 trang)
- Khi dữ liệu bảng biến động thường xuyên hoặc sau khi import dữ liệu hàng loạt, sai lệch giữa giá trị ước tính và số dòng thực tế có thể lên tới 10%~50% hoặc hơn
- **Bẫy bảng nhỏ**: khi bảng có rất ít dòng (ví dụ < 100 dòng), Optimizer có thể bỏ qua Index và chọn Full Table Scan, vì ước tính chi phí của Full Table Scan thấp hơn

**Phương pháp xác minh**:

```sql
-- Số dòng ước tính trong Execution Plan
mysql> EXPLAIN SELECT * FROM users WHERE age = 25\G
rows: 12

-- Số dòng thực tế (lưu ý: cẩn thận khi dùng COUNT(*) trên bảng lớn)
mysql> SELECT COUNT(*) FROM users WHERE age = 25;
+----------+
| COUNT(*) |
+----------+
|       12 |
+----------+
```

Khi gặp trường hợp Execution Plan không khớp với hiệu năng thực tế, có thể thực thi `ANALYZE TABLE` để lấy mẫu lại, sau đó quan sát sự thay đổi của Execution Plan.

### filtered

Cột filtered biểu thị tỷ lệ phần trăm bản ghi còn lại (**ước tính**) sau khi dữ liệu do Storage Engine trả về được lọc theo điều kiện WHERE ở tầng Server (giá trị phần trăm, 0~100). Công thức tính: `filtered = (số dòng sau khi lọc điều kiện / số dòng Storage Engine trả về) × 100`.

**Quy tắc đọc hiểu**:

- Khi `filtered = 100`: tất cả các dòng Storage Engine trả về đều thỏa mãn điều kiện WHERE (trường hợp lý tưởng)
- Khi `filtered < 100`: một số dòng bị lọc bỏ ở tầng Server, cho thấy Index không bao phủ được tất cả điều kiện truy vấn
- **Tình huống JOIN**: Optimizer dùng `rows × (filtered / 100)` để ước tính số dòng mà bảng hiện tại truyền cho bảng tiếp theo (fan-out)

Trường này đặc biệt quan trọng trong tình huống JOIN nhiều bảng: fan-out càng lớn, số dòng bảng được điều khiển mà bảng điều khiển cần khớp càng nhiều. Vì vậy khi giá trị `filtered` rất thấp, cho thấy hiệu suất lọc khá tốt; còn khi `rows` rất lớn mà `filtered` lại không cao thì đó là tín hiệu của nút thắt hiệu năng tiềm ẩn, nên ưu tiên giảm fan-out thông qua Index Condition Pushdown (ICP) hoặc Index phù hợp hơn.

### Extra (quan trọng)

Cột này chứa thông tin bổ sung về cách MySQL phân tích truy vấn, thông qua những thông tin này, có thể hiểu chính xác hơn MySQL thực sự thực thi truy vấn như thế nào. Các giá trị thường gặp:

- **Using filesort**: MySQL không thể tận dụng Index để hoàn thành yêu cầu sắp xếp của ORDER BY hoặc GROUP BY, cần thực thi thêm một thao tác sắp xếp sau khi trả về tập kết quả. Khi kích thước tập kết quả nằm trong `sort_buffer_size`, sắp xếp được hoàn thành trong bộ nhớ; vượt quá thì phải nhờ đến file tạm trên đĩa. "filesort" là tên gọi còn lại từ lịch sử, không có nghĩa là nhất định sinh ra I/O đĩa.
- **Using temporary**: MySQL cần tạo bảng tạm để lưu kết quả truy vấn, thường gặp trong ORDER BY và GROUP BY.
- **Using index**: Cho thấy truy vấn đã sử dụng Covering Index, không cần Back to Table, hiệu suất truy vấn rất cao.
- **Using index condition**: Cho thấy Query Optimizer đã chọn sử dụng tính năng Index Condition Pushdown.
- **Using where**: Tầng MySQL Server áp dụng lọc điều kiện WHERE bổ sung cho các dòng do Storage Engine trả về. Ngay cả khi đã sử dụng Index (như `type=ref`), nếu Index chỉ thỏa mãn một phần điều kiện truy vấn, các điều kiện còn lại vẫn cần được lọc ở tầng Server, khi đó cũng sẽ xuất hiện `Using where`.
- **Using join buffer (Block Nested Loop)**: Khi truy vấn JOIN, bảng được điều khiển không sử dụng Index, MySQL sẽ đọc dữ liệu bảng điều khiển vào JOIN buffer trước, sau đó duyệt qua bảng được điều khiển để khớp (độ phức tạp O(N×M)).
- **Using join buffer (hash join)**: MySQL 8.0.18 giới thiệu thuật toán Hash Join, **chỉ dùng cho JOIN đẳng trị** (như `t1.id = t2.id`), từ 8.0.20 mặc định thay thế BNL. Độ phức tạp của Hash Join là giai đoạn xây dựng O(N) + giai đoạn dò tìm O(M), hiệu quả hơn O(N×M) của BNL.

  **Tình huống ngoại lệ** (vẫn quay về BNL):

  - JOIN không đẳng trị (như `t1.id > t2.id`)
  - Điều kiện JOIN chứa hàm hoặc biểu thức
  - Khi bảng được điều khiển có Index khả dụng (khi đó sẽ sử dụng Index Nested Loop)

Nhắc nhở ở đây, khi cột Extra chứa Using filesort hoặc Using temporary, hiệu năng của MySQL có thể gặp vấn đề, cần hạn chế tối đa.

## Tham khảo

- <https://dev.mysql.com/doc/refman/8.0/en/explain-output.html>
- <https://dev.mysql.com/doc/refman/8.0/en/explain.html>
- <https://juejin.cn/post/6953444668973514789>

<!-- @include: @article-footer.snippet.md -->
