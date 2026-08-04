---
title: Tổng hợp kiến thức cơ bản về cú pháp SQL
description: Tổng hợp kiến thức cơ bản về cú pháp SQL, giải thích có hệ thống DDL (định nghĩa dữ liệu), DML (thao tác dữ liệu), DQL (truy vấn dữ liệu), DCL (kiểm soát dữ liệu), bao gồm các kiến thức cốt lõi về thao tác bảng, ràng buộc, index, transaction, truy vấn kết nối.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu cơ bản
  - SQL
head:
  - - meta
    - name: keywords
      content: Cú pháp SQL,DDL,DML,DQL,DCL,CREATE,SELECT,INSERT,UPDATE,DELETE,JOIN kết nối,Subquery
---

> Bài viết này được tổng hợp và hoàn thiện từ hai tài liệu sau:
>
> - [Hướng dẫn cấp tốc cú pháp SQL](https://juejin.cn/post/6844903790571700231)
> - [Hướng dẫn MySQL đầy đủ](https://www.begtut.com/mysql/mysql-tutorial.html)

## Khái niệm cơ bản

### Thuật ngữ cơ sở dữ liệu

- `Cơ sở dữ liệu (database)` - Container lưu trữ dữ liệu có tổ chức (thường là một tệp hoặc một nhóm tệp).
- `Bảng dữ liệu (table)` - Danh sách có cấu trúc của một loại dữ liệu cụ thể.
- `Lược đồ (schema)` - Thông tin về bố cục và đặc tính của cơ sở dữ liệu và bảng. Schema định nghĩa cách dữ liệu được lưu trữ trong bảng, bao gồm việc lưu trữ loại dữ liệu nào, dữ liệu được phân tách ra sao, cách đặt tên từng phần thông tin, v.v. Cả cơ sở dữ liệu và bảng đều có schema.
- `Cột (column)` - Một trường trong bảng. Mọi bảng đều được tạo thành từ một hoặc nhiều cột.
- `Hàng (row)` - Một bản ghi trong bảng.
- `Khóa chính (primary key)` - Một cột (hoặc một nhóm cột) mà giá trị của nó có thể định danh duy nhất mỗi hàng trong bảng.

### Cú pháp SQL

SQL (Structured Query Language), chuẩn SQL được quản lý bởi ủy ban tiêu chuẩn ANSI, nên được gọi là ANSI SQL. Mỗi DBMS có cách triển khai riêng, chẳng hạn như PL/SQL, Transact-SQL, v.v.

#### Cấu trúc cú pháp SQL

![](https://oss.javaguide.cn/p3-juejin/cb684d4c75fc430e92aaee226069c7da~tplv-k3u1fbpfcp-zoom-1.png)

Cấu trúc cú pháp SQL bao gồm:

- **`Mệnh đề (clause)`** - Là thành phần cấu tạo nên câu lệnh và truy vấn. (Trong một số trường hợp, chúng là tùy chọn.)
- **`Biểu thức (expression)`** - Có thể tạo ra bất kỳ giá trị vô hướng nào, hoặc bảng cơ sở dữ liệu gồm các cột và hàng.
- **`Vị từ (predicate)`** - Đưa ra điều kiện cho logic ba giá trị (3VL) của SQL (true/false/unknown) hoặc giá trị chân lý Boolean cần được đánh giá, và giới hạn tác động của câu lệnh và truy vấn, hoặc thay đổi luồng chương trình.
- **`Truy vấn (query)`** - Truy xuất dữ liệu dựa trên các điều kiện cụ thể. Đây là một thành phần quan trọng của SQL.
- **`Câu lệnh (statement)`** - Có thể ảnh hưởng lâu dài đến schema và dữ liệu, cũng có thể kiểm soát transaction của cơ sở dữ liệu, luồng chương trình, kết nối, phiên hoặc chẩn đoán.

#### Điểm cần chú ý về cú pháp SQL

- **Câu lệnh SQL không phân biệt hoa thường**, nhưng tên bảng, tên cột và giá trị trong cơ sở dữ liệu có phân biệt hoa thường hay không phụ thuộc vào DBMS và cấu hình cụ thể. Ví dụ: `SELECT` và `select`, `Select` là như nhau.
- **Nhiều câu lệnh SQL phải được phân tách bằng dấu chấm phẩy (`;`)**.
- Khi xử lý câu lệnh SQL, **mọi khoảng trắng đều bị bỏ qua**.

Câu lệnh SQL có thể viết trên một dòng, hoặc chia thành nhiều dòng.

```sql
-- Câu lệnh SQL một dòng

UPDATE user SET username='robot', password='robot' WHERE username = 'root';

-- Câu lệnh SQL nhiều dòng
UPDATE user
SET username='robot', password='robot'
WHERE username = 'root';
```

SQL hỗ trợ ba loại chú thích:

```sql
## Chú thích 1
-- Chú thích 2
/* Chú thích 3 */
```

### Phân loại SQL

#### Ngôn ngữ định nghĩa dữ liệu (DDL)

Ngôn ngữ định nghĩa dữ liệu (Data Definition Language, DDL) là phần ngôn ngữ trong SQL chịu trách nhiệm định nghĩa cấu trúc dữ liệu và định nghĩa các đối tượng cơ sở dữ liệu.

Chức năng chính của DDL là **định nghĩa đối tượng cơ sở dữ liệu**.

Các lệnh cốt lõi của DDL là `CREATE`, `ALTER`, `DROP`.

#### Ngôn ngữ thao tác dữ liệu (DML)

Ngôn ngữ thao tác dữ liệu (Data Manipulation Language, DML) là các câu lệnh lập trình dùng cho thao tác cơ sở dữ liệu, thực hiện công việc truy cập đối tượng và dữ liệu trong cơ sở dữ liệu.

Chức năng chính của DML là **truy cập dữ liệu**, vì vậy cú pháp của nó chủ yếu là **đọc và ghi cơ sở dữ liệu**.

Các lệnh cốt lõi của DML là `INSERT`, `UPDATE`, `DELETE`, `SELECT`. Bốn lệnh này gọi chung là CRUD (Create, Read, Update, Delete), tức thêm, xóa, sửa, truy vấn.

#### Ngôn ngữ kiểm soát transaction (TCL)

Ngôn ngữ kiểm soát transaction (Transaction Control Language, TCL) dùng để **quản lý các transaction trong cơ sở dữ liệu**. Chúng dùng để quản lý các thay đổi do câu lệnh DML tạo ra. Nó cũng cho phép nhóm các câu lệnh thành các transaction logic.

Các lệnh cốt lõi của TCL là `COMMIT`, `ROLLBACK`.

#### Ngôn ngữ kiểm soát dữ liệu (DCL)

Ngôn ngữ kiểm soát dữ liệu (Data Control Language, DCL) là loại lệnh có thể kiểm soát quyền truy cập dữ liệu, nó có thể kiểm soát quyền hạn của tài khoản người dùng cụ thể đối với các đối tượng cơ sở dữ liệu như bảng dữ liệu, view, stored procedure, hàm do người dùng định nghĩa, v.v.

Các lệnh cốt lõi của DCL là `GRANT`, `REVOKE`.

DCL chủ yếu **kiểm soát quyền truy cập của người dùng**, vì vậy cách dùng lệnh của nó không phức tạp, các quyền có thể kiểm soát bằng DCL gồm: `CONNECT`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `EXECUTE`, `USAGE`, `REFERENCES`.

Tùy theo DBMS và thực thể bảo mật khác nhau, việc kiểm soát quyền được hỗ trợ cũng khác nhau.

**Trước tiên chúng ta sẽ giới thiệu cách dùng câu lệnh DML. Chức năng chính của DML là đọc ghi cơ sở dữ liệu để thực hiện thêm, xóa, sửa, truy vấn.**

## Thêm xóa sửa truy vấn

Thêm xóa sửa truy vấn, còn gọi là CRUD, là thao tác cơ bản nhất trong các thao tác cơ bản của cơ sở dữ liệu.

### Chèn dữ liệu

Câu lệnh `INSERT INTO` dùng để chèn bản ghi mới vào bảng.

**Chèn toàn bộ một hàng**

```sql
# Chèn một hàng
INSERT INTO user
VALUES (10, 'root', 'root', 'xxxx@163.com');
# Chèn nhiều hàng
INSERT INTO user
VALUES (10, 'root', 'root', 'xxxx@163.com'), (12, 'user1', 'user1', 'xxxx@163.com'), (18, 'user2', 'user2', 'xxxx@163.com');
```

**Chèn một phần của hàng**

```sql
INSERT INTO user(username, password, email)
VALUES ('admin', 'admin', 'xxxx@163.com');
```

**Chèn dữ liệu từ kết quả truy vấn**

```sql
INSERT INTO user(username)
SELECT name
FROM account;
```

### Cập nhật dữ liệu

Câu lệnh `UPDATE` dùng để cập nhật bản ghi trong bảng.

```sql
UPDATE user
SET username='robot', password='robot'
WHERE username = 'root';
```

### Xóa dữ liệu

- Câu lệnh `DELETE` dùng để xóa bản ghi trong bảng.
- `TRUNCATE TABLE` có thể xóa sạch bảng, tức là xóa tất cả các hàng. Lưu ý: câu lệnh `TRUNCATE` không thuộc cú pháp DML mà thuộc cú pháp DDL.

**Xóa dữ liệu chỉ định trong bảng**

```sql
DELETE FROM user
WHERE username = 'robot';
```

**Xóa sạch dữ liệu trong bảng**

```sql
TRUNCATE TABLE user;
```

### Truy vấn dữ liệu

Câu lệnh `SELECT` dùng để truy vấn dữ liệu từ cơ sở dữ liệu.

`DISTINCT` dùng để trả về các giá trị duy nhất không trùng lặp. Nó tác động lên tất cả các cột, nghĩa là chỉ được coi là giống nhau khi giá trị của tất cả các cột đều giống nhau.

`LIMIT` giới hạn số hàng trả về. Có thể có hai tham số, tham số thứ nhất là hàng bắt đầu, tính từ 0; tham số thứ hai là tổng số hàng trả về.

- `ASC`: sắp xếp tăng dần (mặc định)
- `DESC`: sắp xếp giảm dần

**Truy vấn một cột**

```sql
SELECT prod_name
FROM products;
```

**Truy vấn nhiều cột**

```sql
SELECT prod_id, prod_name, prod_price
FROM products;
```

**Truy vấn tất cả các cột**

```sql
SELECT *
FROM products;
```

**Truy vấn các giá trị khác nhau**

```sql
SELECT DISTINCT
vend_id FROM products;
```

**Giới hạn kết quả truy vấn**

```sql
-- Trả về 5 dòng đầu
SELECT * FROM mytable LIMIT 5;
SELECT * FROM mytable LIMIT 0, 5;
-- Trả về dòng thứ 3 ~ 5
SELECT * FROM mytable LIMIT 2, 3;
```

## Sắp xếp

`order by` dùng để sắp xếp tập kết quả theo một hoặc nhiều cột. Mặc định sắp xếp bản ghi theo thứ tự tăng dần, nếu cần sắp xếp bản ghi theo thứ tự giảm dần, có thể dùng từ khóa `desc`.

Khi `order by` sắp xếp theo nhiều cột, cột sắp xếp trước đặt trước, cột sắp xếp sau đặt sau. Và các cột khác nhau có thể có quy tắc sắp xếp khác nhau.

```sql
SELECT * FROM products
ORDER BY prod_price DESC, prod_name ASC;
```

## Nhóm

**`group by`**:

- Mệnh đề `group by` nhóm các bản ghi thành các hàng tổng hợp.
- `group by` trả về một bản ghi cho mỗi nhóm.
- `group by` thường liên quan đến các hàm tổng hợp như `count`, `max`, `sum`, `avg`, v.v.
- `group by` có thể nhóm theo một hoặc nhiều cột.
- Sau khi `group by` sắp xếp theo trường nhóm, `order by` có thể sắp xếp theo trường tổng hợp.

**Nhóm**

```sql
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers GROUP BY cust_name;
```

**Nhóm xong rồi sắp xếp**

```sql
SELECT cust_name, COUNT(cust_address) AS addr_num
FROM Customers GROUP BY cust_name
ORDER BY cust_name DESC;
```

**`having`**:

- `having` dùng để lọc kết quả `group by` đã tổng hợp.
- `having` thường được dùng kèm với `group by`.
- `where` và `having` có thể cùng xuất hiện trong một truy vấn.

**Lọc dữ liệu bằng WHERE và HAVING**

```sql
SELECT cust_name, COUNT(*) AS NumberOfOrders
FROM Customers
WHERE cust_email IS NOT NULL
GROUP BY cust_name
HAVING COUNT(*) > 1;
```

**`having` so với `where`**:

- `where`: lọc các hàng chỉ định, phía sau không thể thêm hàm tổng hợp (hàm nhóm). `where` đứng trước `group by`.
- `having`: lọc các nhóm, thường dùng kèm với `group by`, không thể dùng riêng lẻ. `having` đứng sau `group by`.

## Subquery

Subquery (truy vấn con) là truy vấn SQL được lồng bên trong một truy vấn lớn hơn, còn gọi là truy vấn nội bộ hoặc lựa chọn nội bộ, câu lệnh chứa subquery còn được gọi là truy vấn ngoại bộ hoặc lựa chọn ngoại bộ. Nói đơn giản, subquery là việc lấy kết quả của một truy vấn `select` (truy vấn con) làm nguồn dữ liệu hoặc điều kiện phán đoán cho một câu lệnh SQL khác (truy vấn chính).

Subquery có thể được nhúng trong câu lệnh `SELECT`, `INSERT`, `UPDATE` và `DELETE`, cũng có thể dùng cùng với các toán tử `=`, `<`, `>`, `IN`, `BETWEEN`, `EXISTS`, v.v.

Subquery thường dùng sau mệnh đề `WHERE` và mệnh đề `FROM`:

- Khi dùng trong mệnh đề `WHERE`, tùy theo toán tử khác nhau, subquery có thể trả về dữ liệu một hàng một cột, nhiều hàng một cột, hoặc một hàng nhiều cột. Subquery phải trả về giá trị có thể dùng làm điều kiện truy vấn của mệnh đề `WHERE`.
- Khi dùng trong mệnh đề `FROM`, thường trả về dữ liệu nhiều hàng nhiều cột, tương đương với việc trả về một bảng tạm, như vậy mới phù hợp với quy tắc phía sau `FROM` là một bảng. Cách làm này có thể thực hiện truy vấn liên kết nhiều bảng.

> Lưu ý: Cơ sở dữ liệu MySQL từ phiên bản 4.1 mới bắt đầu hỗ trợ subquery, các phiên bản trước đó không hỗ trợ.

Cú pháp cơ bản của subquery dùng trong mệnh đề `WHERE` như sau:

```sql
select column_name [, column_name ]
from   table1 [, table2 ]
where  column_name operator
    (select column_name [, column_name ]
    from table1 [, table2 ]
    [where])
```

- Subquery cần đặt trong dấu ngoặc đơn `( )`.
- `operator` biểu thị toán tử dùng cho mệnh đề where.

Cú pháp cơ bản của subquery dùng trong mệnh đề `FROM` như sau:

```sql
select column_name [, column_name ]
from (select column_name [, column_name ]
      from table1 [, table2 ]
      [where]) as temp_table_name
where  condition
```

Kết quả trả về của subquery dùng trong `FROM` tương đương với một bảng tạm, vì vậy cần dùng từ khóa AS để đặt tên cho bảng tạm đó.

**Subquery của subquery**

```sql
SELECT cust_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                  FROM orders
                  WHERE order_num IN (SELECT order_num
                                      FROM orderitems
                                      WHERE prod_id = 'RGAN01'));
```

Truy vấn nội bộ trước tiên được thực thi trước truy vấn cha của nó, để kết quả của truy vấn nội bộ có thể được truyền cho truy vấn ngoại bộ. Có thể tham khảo quá trình thực thi trong hình dưới:

![](https://oss.javaguide.cn/p3-juejin/c439da1f5d4e4b00bdfa4316b933d764~tplv-k3u1fbpfcp-zoom-1.png)

### WHERE

- Mệnh đề `WHERE` dùng để lọc bản ghi, tức thu hẹp phạm vi dữ liệu truy cập.
- Sau `WHERE` là một điều kiện trả về `true` hoặc `false`.
- `WHERE` có thể dùng cùng với `SELECT`, `UPDATE` và `DELETE`.
- Các toán tử có thể dùng trong mệnh đề `WHERE`.

| Toán tử | Mô tả                                                                  |
| ------- | ---------------------------------------------------------------------- |
| =       | Bằng                                                                   |
| <>      | Không bằng. Chú thích: trong một số phiên bản SQL, toán tử này có thể viết là != |
| >       | Lớn hơn                                                                |
| <       | Nhỏ hơn                                                                |
| >=      | Lớn hơn hoặc bằng                                                      |
| <=      | Nhỏ hơn hoặc bằng                                                      |
| BETWEEN | Trong một khoảng nào đó                                                |
| LIKE    | Tìm kiếm theo một mẫu nào đó                                           |
| IN      | Chỉ định nhiều giá trị có thể có cho một cột                           |

**Mệnh đề `WHERE` trong câu lệnh `SELECT`**

```ini
SELECT * FROM Customers
WHERE cust_name = 'Kids Place';
```

**Mệnh đề `WHERE` trong câu lệnh `UPDATE`**

```ini
UPDATE Customers
SET cust_name = 'Jack Jones'
WHERE cust_name = 'Kids Place';
```

**Mệnh đề `WHERE` trong câu lệnh `DELETE`**

```ini
DELETE FROM Customers
WHERE cust_name = 'Kids Place';
```

### IN và BETWEEN

- Toán tử `IN` dùng trong mệnh đề `WHERE`, có tác dụng chọn một giá trị bất kỳ trong một vài giá trị cụ thể được chỉ định.
- Toán tử `BETWEEN` dùng trong mệnh đề `WHERE`, có tác dụng chọn các giá trị nằm trong một khoảng nào đó.

**Ví dụ IN**

```sql
SELECT *
FROM products
WHERE vend_id IN ('DLL01', 'BRS01');
```

**Ví dụ BETWEEN**

```sql
SELECT *
FROM products
WHERE prod_price BETWEEN 3 AND 5;
```

### AND, OR, NOT

- `AND`, `OR`, `NOT` là các lệnh xử lý logic cho điều kiện lọc.
- `AND` có độ ưu tiên cao hơn `OR`, để làm rõ thứ tự xử lý, có thể dùng `()`.
- Toán tử `AND` biểu thị cả điều kiện bên trái và bên phải đều phải thỏa mãn.
- Toán tử `OR` biểu thị chỉ cần thỏa mãn một trong hai điều kiện bên trái hoặc bên phải.
- Toán tử `NOT` dùng để phủ định một điều kiện.

**Ví dụ AND**

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE vend_id = 'DLL01' AND prod_price <= 4;
```

**Ví dụ OR**

```ini
SELECT prod_id, prod_name, prod_price
FROM products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```

**Ví dụ NOT**

```sql
SELECT *
FROM products
WHERE prod_price NOT BETWEEN 3 AND 5;
```

### LIKE

- Toán tử `LIKE` dùng trong mệnh đề `WHERE`, có tác dụng xác định chuỗi có khớp với mẫu hay không.
- Chỉ dùng `LIKE` khi trường là giá trị văn bản.
- `LIKE` hỗ trợ hai tùy chọn khớp bằng ký tự đại diện (wildcard): `%` và `_`.
- Đừng lạm dụng wildcard, khớp với wildcard nằm ở đầu sẽ rất chậm.
- `%` biểu thị bất kỳ ký tự nào xuất hiện với số lần bất kỳ.
- `_` biểu thị bất kỳ ký tự nào xuất hiện một lần.

**Ví dụ %**

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE prod_name LIKE '%bean bag%';
```

**Ví dụ \_**

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE prod_name LIKE '__ inch teddy bear';
```

## Kết nối (JOIN)

JOIN có nghĩa là "kết nối", đúng như tên gọi, mệnh đề SQL JOIN dùng để kết hợp hai hoặc nhiều bảng lại với nhau để truy vấn.

Khi kết nối bảng, cần chọn một trường trong mỗi bảng và so sánh giá trị của các trường này, hai bản ghi có giá trị giống nhau sẽ được gộp thành một. **Bản chất của kết nối bảng là gộp các bản ghi của các bảng khác nhau lại, tạo thành một bảng mới. Tất nhiên, bảng mới này chỉ là tạm thời, nó chỉ tồn tại trong phạm vi truy vấn hiện tại**.

Cú pháp cơ bản để kết nối hai bảng bằng `JOIN` như sau:

```sql
select table1.column1, table2.column2...
from table1
join table2
on table1.common_column1 = table2.common_column2;
```

`table1.common_column1 = table2.common_column2` là điều kiện kết nối, chỉ những bản ghi thỏa mãn điều kiện này mới được gộp thành một hàng. Bạn có thể dùng nhiều toán tử để kết nối bảng, ví dụ =, >, <, <>, <=, >=, !=, `between`, `like` hoặc `not`, nhưng phổ biến nhất là dùng =.

Khi hai bảng có trường trùng tên, để giúp database engine phân biệt trường thuộc bảng nào, khi viết tên trường trùng cần thêm tên bảng. Tất nhiên, nếu tên trường được viết là duy nhất trong hai bảng, cũng có thể không cần dùng định dạng trên, chỉ cần viết tên trường là đủ.

Ngoài ra, nếu tên trường liên kết của hai bảng giống nhau, cũng có thể dùng mệnh đề `USING` thay cho `ON`, ví dụ:

```sql
# join....on
select c.cust_name, o.order_num
from Customers c
inner join Orders o
on c.cust_id = o.cust_id
order by c.cust_name;

# Nếu tên trường liên kết của hai bảng giống nhau, cũng có thể dùng mệnh đề USING: join....using()
select c.cust_name, o.order_num
from Customers c
inner join Orders o
using(cust_id)
order by c.cust_name;
```

**Sự khác nhau giữa `ON` và `WHERE`**:

- Khi kết nối bảng, SQL sẽ tạo ra một bảng tạm mới dựa trên điều kiện kết nối. `ON` chính là điều kiện kết nối, nó quyết định việc tạo ra bảng tạm.
- `WHERE` là sau khi bảng tạm đã được tạo, tiếp tục lọc dữ liệu trong bảng tạm, tạo ra tập kết quả cuối cùng, lúc này đã không còn JOIN-ON nữa.

Vì vậy tóm lại: **SQL trước tiên tạo ra một bảng tạm dựa trên ON, sau đó dựa trên WHERE để lọc bảng tạm**.

SQL cho phép thêm một số từ khóa bổ trợ bên trái `JOIN`, từ đó tạo thành các loại kết nối khác nhau, như bảng dưới:

| Loại kết nối                             | Mô tả                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| INNER JOIN kết nối trong                 | (Cách kết nối mặc định) Chỉ trả về hàng khi cả hai bảng đều có bản ghi thỏa mãn điều kiện.    |
| LEFT JOIN / LEFT OUTER JOIN kết nối trái (ngoài) | Trả về tất cả các hàng trong bảng trái, ngay cả khi bảng phải không có hàng nào thỏa mãn điều kiện. |
| RIGHT JOIN / RIGHT OUTER JOIN kết nối phải (ngoài) | Trả về tất cả các hàng trong bảng phải, ngay cả khi bảng trái không có hàng nào thỏa mãn điều kiện. |
| FULL JOIN / FULL OUTER JOIN kết nối đầy đủ (ngoài) | Chỉ cần một trong hai bảng có bản ghi thỏa mãn điều kiện là trả về hàng.                      |
| SELF JOIN                                | Kết nối một bảng với chính nó, giống như bảng đó là hai bảng. Để phân biệt hai bảng, trong câu lệnh SQL cần đổi tên ít nhất một bảng. |
| CROSS JOIN                               | Kết nối chéo, trả về tích Descartes của tập bản ghi từ hai hoặc nhiều bảng được kết nối.      |

Hình dưới minh họa 7 cách dùng liên quan đến LEFT JOIN, RIGHT JOIN, INNER JOIN, OUTER JOIN.

![](https://oss.javaguide.cn/p3-juejin/701670942f0f45d3a3a2187cd04a12ad~tplv-k3u1fbpfcp-zoom-1.png)

Nếu không thêm bất kỳ từ bổ trợ nào, chỉ viết `JOIN`, thì mặc định là `INNER JOIN`

Đối với `INNER JOIN`, còn có một cách viết ẩn, gọi là "**kết nối trong ẩn**", tức là không có từ khóa `INNER JOIN`, dùng câu lệnh `WHERE` để thực hiện chức năng kết nối trong

```sql
# Kết nối trong ẩn
select c.cust_name, o.order_num
from Customers c, Orders o
where c.cust_id = o.cust_id
order by c.cust_name;

# Kết nối trong tường minh
select c.cust_name, o.order_num
from Customers c inner join Orders o
using(cust_id)
order by c.cust_name;
```

## Kết hợp (UNION)

Toán tử `UNION` kết hợp kết quả của hai hoặc nhiều truy vấn, và tạo ra một tập kết quả chứa các hàng được trích xuất từ các truy vấn tham gia trong `UNION`.

Quy tắc cơ bản của `UNION`:

- Số cột và thứ tự cột của tất cả các truy vấn phải giống nhau.
- Kiểu dữ liệu của các cột liên quan trong bảng của mỗi truy vấn phải giống nhau hoặc tương thích.
- Tên cột trả về thường được lấy từ truy vấn đầu tiên.

Mặc định, toán tử `UNION` chọn các giá trị khác nhau. Nếu cho phép giá trị trùng lặp, hãy dùng `UNION ALL`.

```sql
SELECT column_name(s) FROM table1
UNION ALL
SELECT column_name(s) FROM table2;
```

Tên cột trong tập kết quả của `UNION` luôn bằng tên cột trong câu lệnh `SELECT` đầu tiên của `UNION`.

`JOIN` so với `UNION`:

- Trong `JOIN`, các cột được kết nối của các bảng có thể khác nhau, nhưng trong `UNION`, số cột và thứ tự cột của tất cả các truy vấn phải giống nhau.
- `UNION` đặt các hàng sau truy vấn lại với nhau (đặt theo chiều dọc), còn `JOIN` đặt các cột sau truy vấn lại với nhau (đặt theo chiều ngang), tức là tạo thành tích Descartes.

## Hàm

Hàm của các cơ sở dữ liệu khác nhau thường không giống nhau, vì vậy không thể chuyển đổi giữa các hệ thống. Phần này chủ yếu lấy hàm của MySQL làm ví dụ.

### Xử lý văn bản

| Hàm                  | Mô tả                                  |
| -------------------- | -------------------------------------- |
| `LEFT()`, `RIGHT()`  | Ký tự bên trái hoặc bên phải           |
| `LOWER()`, `UPPER()` | Chuyển thành chữ thường hoặc chữ hoa   |
| `LTRIM()`, `RTRIM()` | Loại bỏ khoảng trắng bên trái hoặc bên phải |
| `LENGTH()`           | Độ dài, tính theo byte                 |
| `SOUNDEX()`          | Chuyển thành giá trị ngữ âm            |

Trong đó, **`SOUNDEX()`** có thể chuyển một chuỗi thành mẫu chữ-số mô tả biểu diễn ngữ âm của nó.

```sql
SELECT *
FROM mytable
WHERE SOUNDEX(col1) = SOUNDEX('apple')
```

### Xử lý ngày và giờ

- Định dạng ngày: `YYYY-MM-DD`
- Định dạng giờ: `HH:MM:SS`

| Hàm             | Mô tả                                  |
| --------------- | -------------------------------------- |
| `AddDate()`     | Tăng một ngày (ngày, tuần, v.v.)       |
| `AddTime()`     | Tăng một khoảng thời gian (giờ, phút, v.v.) |
| `CurDate()`     | Trả về ngày hiện tại                   |
| `CurTime()`     | Trả về giờ hiện tại                    |
| `Date()`        | Trả về phần ngày của ngày giờ          |
| `DateDiff()`    | Tính hiệu hai ngày                     |
| `Date_Add()`    | Hàm tính toán ngày rất linh hoạt       |
| `Date_Format()` | Trả về chuỗi ngày hoặc giờ đã định dạng |
| `Day()`         | Trả về phần ngày trong tháng của một ngày |
| `DayOfWeek()`   | Với một ngày, trả về thứ trong tuần tương ứng |
| `Hour()`        | Trả về phần giờ của một thời gian      |
| `Minute()`      | Trả về phần phút của một thời gian     |
| `Month()`       | Trả về phần tháng của một ngày         |
| `Now()`         | Trả về ngày và giờ hiện tại            |
| `Second()`      | Trả về phần giây của một thời gian     |
| `Time()`        | Trả về phần giờ của một ngày giờ       |
| `Year()`        | Trả về phần năm của một ngày           |

### Xử lý số

| Hàm    | Mô tả          |
| ------ | -------------- |
| SIN()  | Sin            |
| COS()  | Cos            |
| TAN()  | Tang           |
| ABS()  | Giá trị tuyệt đối |
| SQRT() | Căn bậc hai    |
| MOD()  | Số dư          |
| EXP()  | Số mũ          |
| PI()   | Số Pi          |
| RAND() | Số ngẫu nhiên  |

### Tổng hợp

| Hàm       | Mô tả                          |
| --------- | ------------------------------ |
| `AVG()`   | Trả về giá trị trung bình của một cột |
| `COUNT()` | Trả về số hàng của một cột     |
| `MAX()`   | Trả về giá trị lớn nhất của một cột |
| `MIN()`   | Trả về giá trị nhỏ nhất của một cột |
| `SUM()`   | Trả về tổng giá trị của một cột |

`AVG()` sẽ bỏ qua các hàng NULL.

Dùng `DISTINCT` có thể làm cho hàm tổng hợp chỉ tổng hợp các giá trị khác nhau.

```sql
SELECT AVG(DISTINCT col1) AS avg_col
FROM mytable
```

**Tiếp theo, chúng ta sẽ giới thiệu cách dùng câu lệnh DDL. Chức năng chính của DDL là định nghĩa các đối tượng cơ sở dữ liệu (như: cơ sở dữ liệu, bảng dữ liệu, view, index, v.v.)**

## Định nghĩa dữ liệu

### Cơ sở dữ liệu (DATABASE)

#### Tạo cơ sở dữ liệu

```sql
CREATE DATABASE test;
```

#### Xóa cơ sở dữ liệu

```sql
DROP DATABASE test;
```

#### Chọn cơ sở dữ liệu

```sql
USE test;
```

### Bảng dữ liệu (TABLE)

#### Tạo bảng dữ liệu

**Tạo thông thường**

```sql
CREATE TABLE user (
  id int(10) unsigned NOT NULL COMMENT 'Id',
  username varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Tên người dùng',
  password varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Mật khẩu',
  email varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Email'
) COMMENT='Bảng người dùng';
```

**Tạo bảng mới dựa trên bảng đã có**

```sql
CREATE TABLE vip_user AS
SELECT * FROM user;
```

#### Xóa bảng dữ liệu

```sql
DROP TABLE user;
```

#### Sửa bảng dữ liệu

**Thêm cột**

```sql
ALTER TABLE user
ADD age int(3);
```

**Xóa cột**

```sql
ALTER TABLE user
DROP COLUMN age;
```

**Sửa cột**

```sql
ALTER TABLE `user`
MODIFY COLUMN age tinyint;
```

**Thêm khóa chính**

```sql
ALTER TABLE user
ADD PRIMARY KEY (id);
```

**Xóa khóa chính**

```sql
ALTER TABLE user
DROP PRIMARY KEY;
```

### View

Định nghĩa:

- View là bảng trực quan dựa trên tập kết quả của câu lệnh SQL.
- View là bảng ảo, bản thân nó không chứa dữ liệu, nên cũng không thể thao tác index trên nó. Thao tác trên view giống như thao tác trên bảng thông thường.

Tác dụng:

- Đơn giản hóa các thao tác SQL phức tạp, chẳng hạn các kết nối phức tạp;
- Chỉ sử dụng một phần dữ liệu của bảng thực tế;
- Thông qua việc chỉ cấp quyền truy cập view cho người dùng, đảm bảo tính an toàn của dữ liệu;
- Thay đổi định dạng và biểu diễn dữ liệu.

![mysql view](https://oss.javaguide.cn/p3-juejin/ec4c975296ea4a7097879dac7c353878~tplv-k3u1fbpfcp-zoom-1.jpeg)

#### Tạo view

```sql
CREATE VIEW top_10_user_view AS
SELECT id, username
FROM user
WHERE id < 10;
```

#### Xóa view

```sql
DROP VIEW top_10_user_view;
```

### Index

**Index (chỉ mục) là một cấu trúc dữ liệu dùng để truy vấn và truy xuất dữ liệu nhanh, bản chất của nó có thể xem là một cấu trúc dữ liệu đã được sắp xếp.**

Tác dụng của index giống như mục lục của một cuốn sách. Ví dụ: khi tra từ điển, nếu không có mục lục, chúng ta chỉ có thể lật từng trang để tìm chữ cần tra, tốc độ rất chậm. Nếu có mục lục, chúng ta chỉ cần tìm vị trí của chữ trong mục lục trước, sau đó lật thẳng đến trang đó là được.

**Ưu điểm**:

- Sử dụng index có thể tăng đáng kể tốc độ truy xuất dữ liệu (giảm đáng kể lượng dữ liệu cần truy xuất), đây cũng là lý do chính để tạo index.
- Thông qua việc tạo index duy nhất, có thể đảm bảo tính duy nhất của mỗi hàng dữ liệu trong bảng cơ sở dữ liệu.

**Nhược điểm**:

- Tạo index và bảo trì index cần tốn nhiều thời gian. Khi thêm xóa sửa dữ liệu trong bảng, nếu dữ liệu có index, thì index cũng cần được sửa động, sẽ làm giảm hiệu suất thực thi SQL.
- Index cần dùng tệp vật lý để lưu trữ, cũng tốn một khoảng không gian nhất định.

Tuy nhiên, **dùng index có chắc chắn tăng hiệu năng truy vấn không?**

Trong hầu hết các trường hợp, truy vấn bằng index đều nhanh hơn quét toàn bảng. Nhưng nếu lượng dữ liệu trong cơ sở dữ liệu không lớn, thì dùng index cũng chưa chắc mang lại cải thiện đáng kể.

Về giới thiệu chi tiết của index, hãy xem bài viết [Giải thích chi tiết MySQL Index](https://javaguide.cn/database/mysql/mysql-index.html) do tôi viết.

#### Tạo index

```sql
CREATE INDEX user_index
ON user (id);
```

#### Thêm index

```sql
ALTER table user ADD INDEX user_index(id)
```

#### Tạo index duy nhất

```sql
CREATE UNIQUE INDEX user_index
ON user (id);
```

#### Xóa index

```sql
ALTER TABLE user
DROP INDEX user_index;
```

### Ràng buộc

Ràng buộc SQL dùng để quy định quy tắc dữ liệu trong bảng.

Nếu tồn tại hành vi dữ liệu vi phạm ràng buộc, hành vi đó sẽ bị ràng buộc chấm dứt.

Ràng buộc có thể được quy định khi tạo bảng (thông qua câu lệnh CREATE TABLE), hoặc quy định sau khi bảng đã được tạo (thông qua câu lệnh ALTER TABLE).

Các loại ràng buộc:

- `NOT NULL` - Chỉ định cột không được lưu giá trị NULL.
- `UNIQUE` - Đảm bảo mỗi hàng của cột phải có giá trị duy nhất.
- `PRIMARY KEY` - Kết hợp của NOT NULL và UNIQUE. Đảm bảo một cột (hoặc kết hợp của hai hay nhiều cột) có định danh duy nhất, giúp tìm một bản ghi cụ thể trong bảng dễ dàng và nhanh hơn.
- `FOREIGN KEY` - Đảm bảo tính toàn vẹn tham chiếu của dữ liệu trong một bảng khớp với giá trị trong bảng khác.
- `CHECK` - Đảm bảo giá trị trong cột thỏa mãn điều kiện chỉ định.
- `DEFAULT` - Quy định giá trị mặc định khi cột chưa được gán giá trị.

Sử dụng điều kiện ràng buộc khi tạo bảng:

```sql
CREATE TABLE Users (
  Id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Id tự tăng',
  Username VARCHAR(64) NOT NULL UNIQUE DEFAULT 'default' COMMENT 'Tên người dùng',
  Password VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT 'Mật khẩu',
  Email VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT 'Địa chỉ email',
  Enabled TINYINT(4) DEFAULT NULL COMMENT 'Có hiệu lực hay không',
  PRIMARY KEY (Id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Bảng người dùng';
```

**Tiếp theo, chúng ta sẽ giới thiệu cách dùng câu lệnh TCL. Chức năng chính của TCL là quản lý các transaction trong cơ sở dữ liệu.**

## Xử lý transaction

Không thể rollback câu lệnh `SELECT`, rollback câu lệnh `SELECT` cũng không có ý nghĩa; cũng không thể rollback câu lệnh `CREATE` và `DROP`.

**MySQL mặc định là commit ẩn**, mỗi khi thực thi một câu lệnh thì coi câu lệnh đó như một transaction rồi commit. Khi xuất hiện câu lệnh `START TRANSACTION`, sẽ tắt commit ẩn; khi câu lệnh `COMMIT` hoặc `ROLLBACK` thực thi xong, transaction sẽ tự động đóng, khôi phục lại commit ẩn.

Thông qua `set autocommit=0` có thể hủy bỏ tự động commit, cho đến khi `set autocommit=1` mới commit; cờ `autocommit` áp dụng cho từng kết nối chứ không phải cho server.

Các lệnh:

- `START TRANSACTION` - Lệnh dùng để đánh dấu điểm bắt đầu của transaction.
- `SAVEPOINT` - Lệnh dùng để tạo điểm lưu (savepoint).
- `ROLLBACK TO` - Lệnh dùng để rollback đến điểm lưu chỉ định; nếu không có điểm lưu nào được đặt, thì rollback về câu lệnh `START TRANSACTION`.
- `COMMIT` - Commit transaction.

```sql
-- Bắt đầu transaction
START TRANSACTION;

-- Thao tác chèn A
INSERT INTO `user`
VALUES (1, 'root1', 'root1', 'xxxx@163.com');

-- Tạo điểm lưu updateA
SAVEPOINT updateA;

-- Thao tác chèn B
INSERT INTO `user`
VALUES (2, 'root2', 'root2', 'xxxx@163.com');

-- Rollback về điểm lưu updateA
ROLLBACK TO updateA;

-- Commit transaction, chỉ có thao tác A có hiệu lực
COMMIT;
```

**Tiếp theo, chúng ta sẽ giới thiệu cách dùng câu lệnh DCL. Chức năng chính của DCL là kiểm soát quyền truy cập của người dùng.**

## Kiểm soát quyền

Để cấp quyền cho tài khoản người dùng, có thể dùng lệnh `GRANT`. Để thu hồi quyền của người dùng, có thể dùng lệnh `REVOKE`. Ở đây lấy MySQL làm ví dụ, giới thiệu ứng dụng thực tế của kiểm soát quyền.

Cú pháp cấp quyền `GRANT`:

```sql
GRANT privilege,[privilege],.. ON privilege_level
TO user [IDENTIFIED BY password]
[REQUIRE tsl_option]
[WITH [GRANT_OPTION | resource_option]];
```

Giải thích đơn giản:

1. Sau từ khóa `GRANT`, chỉ định một hoặc nhiều quyền. Nếu cấp nhiều quyền cho người dùng, thì mỗi quyền được phân tách bằng dấu phẩy.
2. `ON privilege_level` xác định cấp độ áp dụng của quyền. MySQL hỗ trợ cấp global (`*.*`), database (`database.*`), table (`database.table`) và cấp cột. Nếu dùng cấp quyền theo cột, thì phải chỉ định một cột hoặc danh sách các cột phân tách bằng dấu phẩy sau mỗi quyền.
3. `user` là người dùng được cấp quyền. Nếu người dùng đã tồn tại, câu lệnh `GRANT` sẽ sửa quyền của người dùng đó. Nếu không, câu lệnh `GRANT` sẽ tạo người dùng mới. Mệnh đề tùy chọn `IDENTIFIED BY` cho phép bạn đặt mật khẩu mới cho người dùng.
4. `REQUIRE tsl_option` chỉ định người dùng có bắt buộc phải kết nối đến database server thông qua kết nối an toàn như SSL, X059 hay không.
5. Mệnh đề tùy chọn `WITH GRANT OPTION` cho phép bạn cấp quyền đang có cho người dùng khác hoặc thu hồi quyền từ người dùng khác. Ngoài ra, bạn có thể dùng mệnh đề `WITH` để phân bổ tài nguyên của MySQL database server, ví dụ đặt số kết nối hoặc số câu lệnh mà người dùng có thể dùng mỗi giờ. Điều này rất hữu ích trong các môi trường chia sẻ như MySQL shared hosting.

Cú pháp thu hồi quyền `REVOKE`:

```sql
REVOKE   privilege_type [(column_list)]
        [, priv_type [(column_list)]]...
ON [object_type] privilege_level
FROM user [, user]...
```

Giải thích đơn giản:

1. Sau từ khóa `REVOKE`, chỉ định danh sách quyền cần thu hồi từ người dùng. Cần phân tách các quyền bằng dấu phẩy.
2. Chỉ định cấp độ quyền cần thu hồi trong mệnh đề `ON`.
3. Chỉ định tài khoản người dùng cần thu hồi quyền trong mệnh đề `FROM`.

`GRANT` và `REVOKE` có thể kiểm soát quyền truy cập ở một số cấp độ:

- Toàn bộ server, dùng `GRANT ALL` và `REVOKE ALL`;
- Toàn bộ cơ sở dữ liệu, dùng `ON database.*`;
- Bảng cụ thể, dùng `ON database.table`;
- Cột cụ thể;
- Stored procedure cụ thể.

Tài khoản mới tạo không có bất kỳ quyền nào. Tài khoản được định nghĩa dưới dạng `username@host`, `username@%` sử dụng tên máy chủ mặc định. Thông tin tài khoản của MySQL được lưu trong cơ sở dữ liệu mysql.

```sql
USE mysql;
SELECT user FROM user;
```

Bảng dưới minh họa tất cả các quyền được phép dùng với câu lệnh `GRANT` và `REVOKE`:

| **Quyền**               | **Mô tả**                                                                                               | **Cấp độ** |        |          |          |     |     |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ---------- | ------ | -------- | -------- | --- | --- |
| **Global**              | Cơ sở dữ liệu                                                                                           | **Bảng**   | **Cột** | **Chương trình** | **Proxy** |     |     |
| ALL [PRIVILEGES]        | Cấp tất cả các quyền của cấp truy cập được chỉ định, ngoại trừ GRANT OPTION                             |            |        |          |          |     |     |
| ALTER                   | Cho phép người dùng dùng câu lệnh ALTER TABLE                                                           | X          | X      | X        |          |     |     |
| ALTER ROUTINE           | Cho phép người dùng thay đổi hoặc xóa stored routine                                                    | X          | X      |          |          | X   |     |
| CREATE                  | Cho phép người dùng tạo cơ sở dữ liệu và bảng                                                           | X          | X      | X        |          |     |     |
| CREATE ROUTINE          | Cho phép người dùng tạo stored routine                                                                  | X          | X      |          |          |     |     |
| CREATE TABLESPACE       | Cho phép người dùng tạo, thay đổi hoặc xóa tablespace và nhóm tệp nhật ký                               | X          |        |          |          |     |     |
| CREATE TEMPORARY TABLES | Cho phép người dùng dùng CREATE TEMPORARY TABLE để tạo bảng tạm                                         | X          | X      |          |          |     |     |
| CREATE USER             | Cho phép người dùng dùng các câu lệnh CREATE USER, DROP USER, RENAME USER và REVOKE ALL PRIVILEGES.     | X          |        |          |          |     |     |
| CREATE VIEW             | Cho phép người dùng tạo hoặc sửa view.                                                                  | X          | X      | X        |          |     |     |
| DELETE                  | Cho phép người dùng dùng DELETE                                                                         | X          | X      | X        |          |     |     |
| DROP                    | Cho phép người dùng xóa cơ sở dữ liệu, bảng và view                                                     | X          | X      | X        |          |     |     |
| EVENT                   | Cho phép sử dụng event của event scheduler.                                                             | X          | X      |          |          |     |     |
| EXECUTE                 | Cho phép người dùng thực thi stored routine                                                             | X          | X      | X        |          |     |     |
| FILE                    | Cho phép người dùng đọc bất kỳ tệp nào trong thư mục cơ sở dữ liệu.                                     | X          |        |          |          |     |     |
| GRANT OPTION            | Cho phép người dùng có quyền cấp hoặc thu hồi quyền của tài khoản khác.                                 | X          | X      | X        |          | X   | X   |
| INDEX                   | Cho phép người dùng tạo hoặc xóa index.                                                                 | X          | X      | X        |          |     |     |
| INSERT                  | Cho phép người dùng dùng câu lệnh INSERT                                                                | X          | X      | X        | X        |     |     |
| LOCK TABLES             | Cho phép người dùng dùng LOCK TABLES trên bảng có quyền SELECT                                          | X          | X      |          |          |     |     |
| PROCESS                 | Cho phép người dùng dùng câu lệnh SHOW PROCESSLIST để xem tất cả tiến trình.                            | X          |        |          |          |     |     |
| PROXY                   | Cho phép user proxy.                                                                                    |            |        |          |          |     |     |
| REFERENCES              | Cho phép người dùng tạo khóa ngoại                                                                      | X          | X      | X        | X        |     |     |
| RELOAD                  | Cho phép người dùng dùng thao tác FLUSH                                                                 | X          |        |          |          |     |     |
| REPLICATION CLIENT      | Cho phép người dùng truy vấn để xem vị trí của master server hoặc slave server                          | X          |        |          |          |     |     |
| REPLICATION SLAVE       | Cho phép replication slave đọc các sự kiện binary log từ master server.                                 | X          |        |          |          |     |     |
| SELECT                  | Cho phép người dùng dùng câu lệnh SELECT                                                                | X          | X      | X        | X        |     |     |
| SHOW DATABASES          | Cho phép người dùng hiển thị tất cả cơ sở dữ liệu                                                       | X          |        |          |          |     |     |
| SHOW VIEW               | Cho phép người dùng dùng câu lệnh SHOW CREATE VIEW                                                      | X          | X      | X        |          |     |     |
| SHUTDOWN                | Cho phép người dùng dùng lệnh mysqladmin shutdown                                                       | X          |        |          |          |     |     |
| SUPER                   | Cho phép người dùng dùng các thao tác quản trị khác, như CHANGE MASTER TO, KILL, PURGE BINARY LOGS, SET GLOBAL và lệnh mysqladmin | X          |        |          |          |     |     |
| TRIGGER                 | Cho phép người dùng dùng thao tác TRIGGER.                                                              | X          | X      | X        |          |     |     |
| UPDATE                  | Cho phép người dùng dùng câu lệnh UPDATE                                                                | X          | X      | X        | X        |     |     |
| USAGE                   | Tương đương với "không có quyền"                                                                        |            |        |          |          |     |     |

### Tạo tài khoản

```sql
CREATE USER myuser IDENTIFIED BY 'mypassword';
```

### Sửa tên tài khoản

```sql
UPDATE user SET user='newuser' WHERE user='myuser';
FLUSH PRIVILEGES;
```

### Xóa tài khoản

```sql
DROP USER myuser;
```

### Xem quyền

```sql
SHOW GRANTS FOR myuser;
```

### Cấp quyền

```sql
GRANT SELECT, INSERT ON *.* TO myuser;
```

### Thu hồi quyền

```sql
REVOKE SELECT, INSERT ON *.* FROM myuser;
```

### Đổi mật khẩu

```sql
SET PASSWORD FOR myuser = 'mypass';
```

## Stored procedure

Stored procedure (thủ tục lưu trữ) có thể xem là xử lý hàng loạt của một chuỗi các thao tác SQL. Stored procedure có thể được gọi bởi trigger, stored procedure khác và các ứng dụng như Java, Python, PHP, v.v.

![mysql stored procedure](https://oss.javaguide.cn/p3-juejin/60afdc9c9a594f079727ec64a2e698a3~tplv-k3u1fbpfcp-zoom-1.jpeg)

Lợi ích của việc dùng stored procedure:

- Đóng gói mã, đảm bảo mức độ an toàn nhất định;
- Tái sử dụng mã;
- Do được biên dịch trước nên có hiệu năng rất cao.

Tạo stored procedure:

- Khi tạo stored procedure trong dòng lệnh cần tùy chỉnh ký tự phân tách, vì dòng lệnh lấy `;` làm ký tự kết thúc, mà trong stored procedure cũng chứa dấu chấm phẩy, nên sẽ nhầm lẫn coi phần dấu chấm phẩy này là ký tự kết thúc, gây ra lỗi cú pháp.
- Bao gồm ba loại tham số `in`, `out` và `inout`.
- Gán giá trị cho biến đều cần dùng câu lệnh `select into`.
- Mỗi lần chỉ có thể gán giá trị cho một biến, không hỗ trợ thao tác trên tập hợp.

Cần lưu ý: **"Cẩm nang phát triển Java" của Alibaba nghiêm cấm sử dụng stored procedure. Vì stored procedure khó debug và khó mở rộng, tính khả chuyển cũng kém hơn.**

![](https://oss.javaguide.cn/p3-juejin/93a5e011ade4450ebfa5d82057532a49~tplv-k3u1fbpfcp-zoom-1.png)

Rốt cuộc có nên dùng trong dự án hay không, vẫn phải xem nhu cầu thực tế của dự án, cân nhắc kỹ lợi hại là được!

### Tạo stored procedure

```sql
DROP PROCEDURE IF EXISTS `proc_adder`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_adder`(IN a int, IN b int, OUT sum int)
BEGIN
    DECLARE c int;
    if a is null then set a = 0;
    end if;

    if b is null then set b = 0;
    end if;

    set sum  = a + b;
END
;;
DELIMITER ;
```

### Sử dụng stored procedure

```less
set @b=5;
call proc_adder(2,@b,@s);
select @s as sum;
```

## Cursor

Cursor (con trỏ) là một truy vấn cơ sở dữ liệu được lưu trữ trên DBMS server, nó không phải là một câu lệnh `SELECT`, mà là tập kết quả được truy xuất bởi câu lệnh đó.

Sử dụng cursor trong stored procedure có thể duyệt qua từng hàng của một tập kết quả.

Cursor chủ yếu dùng cho các ứng dụng tương tác, trong đó người dùng cần cuộn dữ liệu trên màn hình, và xem hoặc thay đổi dữ liệu.

Các bước rõ ràng khi sử dụng cursor:

- Trước khi dùng cursor, phải khai báo (định nghĩa) nó. Quá trình này thực tế không truy xuất dữ liệu, nó chỉ định nghĩa câu lệnh `SELECT` và các tùy chọn cursor sẽ dùng.

- Sau khi khai báo, phải mở cursor để sử dụng. Quá trình này dùng câu lệnh SELECT đã định nghĩa trước đó để thực sự truy xuất dữ liệu.

- Đối với cursor đã có dữ liệu, lấy ra (truy xuất) từng hàng theo nhu cầu.

- Khi kết thúc sử dụng cursor, phải đóng cursor, nếu có thể, giải phóng cursor (tùy thuộc vào

  DBMS cụ thể).

```sql
DELIMITER $
CREATE  PROCEDURE getTotal()
BEGIN
    DECLARE total INT;
    -- Tạo biến nhận dữ liệu từ cursor
    DECLARE sid INT;
    DECLARE sname VARCHAR(10);
    -- Tạo biến tổng
    DECLARE sage INT;
    -- Tạo biến cờ kết thúc
    DECLARE done INT DEFAULT false;
    -- Tạo cursor
    DECLARE cur CURSOR FOR SELECT id,name,age from cursor_table where age>30;
    -- Chỉ định giá trị trả về khi vòng lặp cursor kết thúc
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
    SET total = 0;
    OPEN cur;
    FETCH cur INTO sid, sname, sage;
    WHILE(NOT done)
    DO
        SET total = total + 1;
        FETCH cur INTO sid, sname, sage;
    END WHILE;

    CLOSE cur;
    SELECT total;
END $
DELIMITER ;

-- Gọi stored procedure
call getTotal();
```

## Trigger

Trigger là một đối tượng cơ sở dữ liệu liên quan đến thao tác bảng, khi sự kiện chỉ định xuất hiện trên bảng chứa trigger, đối tượng này sẽ được gọi, tức là sự kiện thao tác bảng kích hoạt việc thực thi trigger trên bảng.

Chúng ta có thể dùng trigger để theo dõi audit, ghi lại các thay đổi vào một bảng khác.

Ưu điểm của việc dùng trigger:

- Trigger SQL cung cấp một phương pháp khác để kiểm tra tính toàn vẹn của dữ liệu.
- Trigger SQL có thể bắt lỗi trong logic nghiệp vụ ở tầng cơ sở dữ liệu.
- Trigger SQL cung cấp một phương pháp khác để chạy các tác vụ theo lịch. Bằng cách dùng trigger SQL, bạn không cần chờ chạy tác vụ theo lịch, vì trigger sẽ tự động được gọi trước hoặc sau khi thay đổi dữ liệu trong bảng.
- Trigger SQL rất hữu ích cho việc audit các thay đổi dữ liệu trong bảng.

Nhược điểm của việc dùng trigger:

- Trigger SQL chỉ có thể cung cấp kiểm tra mở rộng, và không thể thay thế tất cả các kiểm tra. Phải hoàn thành một số kiểm tra đơn giản ở tầng ứng dụng. Ví dụ, bạn có thể dùng JavaScript để kiểm tra dữ liệu nhập của người dùng ở phía client, hoặc dùng ngôn ngữ kịch bản phía server (như JSP, PHP, ASP.NET, Perl) để kiểm tra dữ liệu nhập của người dùng ở phía server.
- Trigger SQL được gọi và thực thi một cách vô hình từ ứng dụng client, vì vậy rất khó để biết chuyện gì đang xảy ra ở tầng cơ sở dữ liệu.
- Trigger SQL có thể làm tăng chi phí của database server.

MySQL không cho phép dùng câu lệnh CALL trong trigger, tức là không thể gọi stored procedure.

> Lưu ý: Trong MySQL, dấu chấm phẩy `;` là ký tự kết thúc câu lệnh, gặp dấu chấm phẩy nghĩa là đoạn câu lệnh đó đã kết thúc, MySQL có thể bắt đầu thực thi. Vì vậy, khi trình thông dịch gặp dấu chấm phẩy trong hành động thực thi của trigger thì sẽ bắt đầu thực thi, sau đó sẽ báo lỗi, vì không tìm thấy END khớp với BEGIN.
>
> Lúc này sẽ cần dùng lệnh `DELIMITER` (DELIMITER có nghĩa là ký tự phân giới, ký tự phân tách). Đây là một lệnh, không cần ký tự kết thúc câu lệnh, cú pháp là: `DELIMITER new_delimiter`. `new_delimiter` có thể đặt thành ký hiệu có độ dài 1 hoặc nhiều ký tự, mặc định là dấu chấm phẩy `;`, chúng ta có thể đổi nó thành ký hiệu khác, như `$` - `DELIMITER $`. Sau đó, các câu lệnh kết thúc bằng dấu chấm phẩy, trình thông dịch sẽ không có phản ứng gì, chỉ khi gặp `$`, mới coi là kết thúc câu lệnh. Lưu ý, sau khi dùng xong, chúng ta phải nhớ đổi nó trở lại.

Trước phiên bản MySQL 5.7.2, có thể định nghĩa tối đa sáu trigger cho mỗi bảng.

- `BEFORE INSERT` - Kích hoạt trước khi chèn dữ liệu vào bảng.
- `AFTER INSERT` - Kích hoạt sau khi chèn dữ liệu vào bảng.
- `BEFORE UPDATE` - Kích hoạt trước khi cập nhật dữ liệu trong bảng.
- `AFTER UPDATE` - Kích hoạt sau khi cập nhật dữ liệu trong bảng.
- `BEFORE DELETE` - Kích hoạt trước khi xóa dữ liệu khỏi bảng.
- `AFTER DELETE` - Kích hoạt sau khi xóa dữ liệu khỏi bảng.

Tuy nhiên, từ phiên bản MySQL 5.7.2 trở đi, có thể định nghĩa nhiều trigger cho cùng một sự kiện kích hoạt và thời điểm hành động.

**`NEW` và `OLD`**:

- Trong MySQL định nghĩa các từ khóa `NEW` và `OLD`, dùng để biểu thị hàng dữ liệu trong bảng chứa trigger đã kích hoạt trigger đó.
- Trong trigger loại `INSERT`, `NEW` dùng để biểu thị dữ liệu mới sắp (`BEFORE`) hoặc đã (`AFTER`) được chèn;
- Trong trigger loại `UPDATE`, `OLD` dùng để biểu thị dữ liệu gốc sắp hoặc đã bị sửa, `NEW` dùng để biểu thị dữ liệu mới sắp hoặc đã được sửa thành;
- Trong trigger loại `DELETE`, `OLD` dùng để biểu thị dữ liệu gốc sắp hoặc đã bị xóa;
- Cách dùng: `NEW.columnName` (columnName là tên một cột nào đó của bảng dữ liệu tương ứng)

### Tạo trigger

> Gợi ý: Để hiểu các điểm chính của trigger, cần tìm hiểu trước về lệnh tạo trigger.

Lệnh `CREATE TRIGGER` dùng để tạo trigger.

Cú pháp:

```sql
CREATE TRIGGER trigger_name
trigger_time
trigger_event
ON table_name
FOR EACH ROW
BEGIN
  trigger_statements
END;
```

Giải thích:

- `trigger_name`: tên trigger
- `trigger_time`: thời điểm kích hoạt của trigger. Giá trị là `BEFORE` hoặc `AFTER`.
- `trigger_event`: sự kiện lắng nghe của trigger. Giá trị là `INSERT`, `UPDATE` hoặc `DELETE`.
- `table_name`: đối tượng lắng nghe của trigger. Chỉ định tạo trigger trên bảng nào.
- `FOR EACH ROW`: giám sát cấp hàng, cách viết cố định của MySQL, các DBMS khác thì khác.
- `trigger_statements`: hành động thực thi của trigger. Là danh sách của một hoặc nhiều câu lệnh SQL, mỗi câu lệnh trong danh sách đều phải kết thúc bằng dấu chấm phẩy `;`.

Khi điều kiện kích hoạt của trigger được thỏa mãn, sẽ thực thi hành động của trigger giữa `BEGIN` và `END`.

Ví dụ:

```sql
DELIMITER $
CREATE TRIGGER `trigger_insert_user`
AFTER INSERT ON `user`
FOR EACH ROW
BEGIN
    INSERT INTO `user_history`(user_id, operate_type, operate_time)
    VALUES (NEW.id, 'add a user',  now());
END $
DELIMITER ;
```

### Xem trigger

```sql
SHOW TRIGGERS;
```

### Xóa trigger

```sql
DROP TRIGGER IF EXISTS trigger_insert_user;
```

## Bài viết đề xuất

- [Lập trình viên Backend cần biết: Hướng dẫn tối ưu hiệu năng SQL! Nhận ngay hơn 35 đề xuất tối ưu!](https://mp.weixin.qq.com/s/I-ZT3zGTNBZ6egS7T09jyQ)
- [Lập trình viên Backend cần biết: 30 lời khuyên để viết SQL chất lượng cao](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486461&idx=1&sn=60a22279196d084cc398936fe3b37772&chksm=cea24436f9d5cd20a4fa0e907590f3e700d7378b3f608d7b33bb52cfb96f503b7ccb65a1deed&token=1987003517&lang=zh_CN#rd)

<!-- @include: @article-footer.snippet.md -->
