---
title: Giải thích chi tiết Query Cache trong MySQL
description: Phân tích chuyên sâu nguyên lý hoạt động, cấu hình quản lý cùng ưu nhược điểm của Query Cache trong MySQL, lý giải vì sao MySQL 8.0 loại bỏ tính năng Query Cache, và các khuyến nghị thực hành tốt nhất trong môi trường Production.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: Query Cache MySQL,Query Cache,Cơ chế Cache MySQL,Vô hiệu hóa Cache,MySQL 8.0,Tối ưu hiệu năng truy vấn,Quản lý bộ nhớ MySQL
---

Cache là một phương pháp tối ưu hiệu năng hệ thống hiệu quả và thực dụng, dù là hệ điều hành, hay các loại phần mềm ứng dụng và dịch vụ Web, đều áp dụng rộng rãi cơ chế Cache.

Tuy nhiên, các DBA có kinh nghiệm đều khuyến nghị trong môi trường Production nên tắt Query Cache (Bộ nhớ đệm truy vấn) đi kèm của MySQL. Hơn nữa, từ MySQL 5.7.20 trở đi, Query Cache đã mặc định bị loại bỏ (deprecated). Từ MySQL 8.0 trở về sau, tính năng Query Cache còn bị xóa bỏ hoàn toàn.

Tại sao lại như vậy? Query Cache thật sự vô dụng đến thế sao?

Mang theo vài câu hỏi sau, chúng ta chính thức bước vào bài viết.

- Query Cache của MySQL là gì? Phạm vi áp dụng?
- Quy tắc Cache của MySQL là gì?
- Ưu nhược điểm của Cache trong MySQL là gì?
- Cache trong MySQL ảnh hưởng thế nào đến hiệu năng?

## Giới thiệu Query Cache trong MySQL

Kiến trúc hệ thống MySQL như hình dưới đây:

![](https://oss.javaguide.cn/github/javaguide/mysql/mysql-architecture.png)

Để nâng cao tốc độ phản hồi của các câu lệnh truy vấn hoàn toàn giống nhau, MySQL Server sẽ tính Hash câu lệnh truy vấn để được một giá trị Hash. MySQL Server không xử lý gì với SQL, SQL phải hoàn toàn nhất quán thì giá trị Hash mới giống nhau. Sau khi có được giá trị Hash, thông qua giá trị Hash đó để khớp kết quả của truy vấn trong Query Cache.

- Nếu khớp (trúng Cache), sẽ trả trực tiếp tập kết quả (Result Set) của truy vấn về Client, không cần phân tích và thực thi truy vấn nữa.
- Nếu không khớp (không trúng Cache), sẽ lưu giá trị Hash và tập kết quả vào Query Cache, để sử dụng sau này.

Nghĩa là, **một câu lệnh truy vấn (select) khi đến MySQL Server, sẽ vào Query Cache xem trước, nếu đã từng được thực thi thì trả trực tiếp tập kết quả về Client.**

![](https://oss.javaguide.cn/javaguide/13526879-3037b144ed09eb88.png)

## Quản lý và cấu hình Query Cache trong MySQL

Thông qua câu lệnh `show variables like '%query_cache%'` có thể xem các thông tin liên quan đến Query Cache.

Với các phiên bản trước 8.0, thông tin in ra có thể như sau:

```bash
mysql> show variables like '%query_cache%';
+------------------------------+---------+
| Variable_name                | Value   |
+------------------------------+---------+
| have_query_cache             | YES     |
| query_cache_limit            | 1048576 |
| query_cache_min_res_unit     | 4096    |
| query_cache_size             | 599040  |
| query_cache_type             | ON      |
| query_cache_wlock_invalidate | OFF     |
+------------------------------+---------+
6 rows in set (0.02 sec)
```

Với phiên bản 8.0 trở về sau, thông tin in ra như sau:

```bash
mysql> show variables like '%query_cache%';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | NO    |
+------------------+-------+
1 row in set (0.01 sec)
```

Ở đây chúng ta sẽ giải thích các thông tin được in ra từ câu lệnh `show variables like '%query_cache%';` ở phiên bản trước 8.0.

- **`have_query_cache`:** MySQL Server này có hỗ trợ Query Cache hay không, nếu là YES thì hỗ trợ, ngược lại là không hỗ trợ.
- **`query_cache_limit`:** Kết quả truy vấn tối đa được Query Cache của MySQL, kết quả truy vấn lớn hơn giá trị này sẽ không được Cache.
- **`query_cache_min_res_unit`:** Kích thước (byte) của khối nhỏ nhất được phân bổ trong Query Cache. Khi truy vấn đang tiến hành, MySQL lưu kết quả truy vấn vào Query Cache, nhưng nếu kết quả cần lưu khá lớn, vượt quá giá trị `query_cache_min_res_unit`, lúc này MySQL sẽ vừa truy xuất kết quả vừa lưu dữ liệu, nghĩa là trong một lần truy vấn, MySQL có thể phải thực hiện thao tác phân bổ bộ nhớ nhiều lần. Điều chỉnh `query_cache_min_res_unit` hợp lý có thể tối ưu bộ nhớ.
- **`query_cache_size`:** Lượng bộ nhớ được phân bổ để Cache kết quả truy vấn, đơn vị là byte, và giá trị phải là bội số nguyên của 1024. Tài liệu chính thức của MySQL 5.7 cho thấy giá trị mặc định là `1048576` (1 MB), khi đặt là 0 sẽ vô hiệu hóa Query Cache. Giá trị mặc định giữa các phiên bản nhỏ khác nhau có sự khác biệt, khuyến nghị chỉ định rõ trong file cấu hình, không dựa vào hành vi mặc định.
- **`query_cache_type`:** Thiết lập loại Query Cache, mặc định là ON. Thiết lập giá trị GLOBAL có thể thiết lập loại cho tất cả kết nối Client phía sau. Client có thể thiết lập giá trị SESSION để ảnh hưởng đến cách sử dụng Query Cache của chính nó.
- **`query_cache_wlock_invalidate`**: Nếu một bảng nào đó bị khóa, có trả dữ liệu trong Cache hay không, mặc định ở trạng thái tắt, môi trường Production thường khuyến nghị giữ cấu hình mặc định này.

Các giá trị có thể có của `query_cache_type` (`query_cache_type` trong MySQL 5.6/5.7 là biến động (dynamic variable), **nhưng có điều kiện**: nếu khi khởi động Instance mà `query_cache_type=0`, Server sẽ bỏ qua việc phân bổ Mutex của Query Cache, lúc này việc sửa động qua `SET GLOBAL` sẽ báo lỗi, phải sửa file cấu hình và khởi động lại; nếu khi khởi động khác 0, thì có thể thông qua `SET GLOBAL query_cache_type=N` để có hiệu lực trực tuyến, không cần khởi động lại):

- 0 hoặc OFF: Tắt tính năng truy vấn.
- 1 hoặc ON: Bật tính năng Query Cache, nhưng không Cache các truy vấn bắt đầu bằng `Select SQL_NO_CACHE`.
- 2 hoặc DEMAND: Bật tính năng Query Cache, nhưng chỉ Cache các truy vấn bắt đầu bằng `Select SQL_CACHE`.

**Khuyến nghị**:

- `query_cache_size` không khuyến nghị đặt quá lớn. Không gian quá lớn không những chiếm chỗ không gian của các cấu trúc bộ nhớ khác trong Instance, mà còn tăng chi phí tìm kiếm trong Cache. Khuyến nghị dựa theo quy cách của Instance, đặt giá trị ban đầu trong khoảng từ 10MB đến 100MB, sau đó điều chỉnh theo tình hình vận hành thực tế.
- Khuyến nghị vô hiệu hóa Query Cache bằng cách đặt `query_cache_size` là 0, thay vì chỉ dựa vào `query_cache_type`. Cả hai tuy đều là biến động, nhưng `query_cache_size=0` sẽ bỏ qua hoàn toàn việc phân bổ bộ nhớ Cache và đường dẫn kiểm tra, vô hiệu hóa triệt để hơn.

  Trước phiên bản 8.0, thêm cấu hình sau vào `my.cnf`, khởi động lại MySQL để bật Query Cache

```properties
query_cache_type=1
query_cache_size=614400
```

Hoặc, trong trường hợp khi khởi động Instance mà `query_cache_type` khác 0, cũng có thể thông qua các câu lệnh sau để bật Query Cache trực tuyến (nếu giá trị khởi động là 0 thì câu lệnh này sẽ báo lỗi, cần sửa file cấu hình rồi khởi động lại):

```sql
set global query_cache_type=1;
set global query_cache_size=614400;
```

Dọn Cache thủ công có thể dùng ba câu SQL sau:

- `flush query cache;`: Dọn phân mảnh bộ nhớ của Query Cache.
- `reset query cache;`: Xóa tất cả truy vấn khỏi Query Cache.
- `flush tables;` Đóng tất cả các bảng đang mở, đồng thời thao tác này sẽ xóa sạch nội dung trong Query Cache.

## Cơ chế Cache trong MySQL

### Quy tắc Cache

- Query Cache sẽ lưu câu lệnh truy vấn và tập kết quả vào bộ nhớ (thường ở dạng key-value, trong đó Key là giá trị Hash được tính chung từ văn bản câu lệnh truy vấn, Database hiện tại, Character Set của Client và phiên bản giao thức cùng các tham số môi trường khác, Value là tập kết quả của truy vấn), lần sau truy vấn sẽ lấy trực tiếp từ bộ nhớ.
- Kết quả được Cache chia sẻ qua các sessions, nên kết quả Cache mà một Client truy vấn được, Client khác cũng có thể sử dụng.
- SQL phải hoàn toàn nhất quán thì mới trúng Query Cache (chữ hoa chữ thường, dấu cách, Database đang dùng, phiên bản giao thức, Character Set,... phải nhất quán). Khi kiểm tra Query Cache, MySQL Server không xử lý gì với SQL, nó sử dụng chính xác truy vấn mà Client gửi đến.
- Không Cache tập kết quả của truy vấn con (Subquery) trong truy vấn, chỉ Cache tập kết quả cuối cùng của truy vấn.
- Các hàm không xác định sẽ không bao giờ được Cache, ví dụ `now()`, `curdate()`, `last_insert_id()`, `rand()`,...
- Không Cache các truy vấn sinh ra cảnh báo (Warnings).
- Tập kết quả vượt quá `query_cache_limit` (mặc định 1 MB) sẽ không được Cache.
- Nếu trong truy vấn có chứa bất kỳ hàm do người dùng tự định nghĩa, Stored Function, biến người dùng, bảng tạm, bảng hệ thống trong Database mysql, thì kết quả truy vấn cũng không được Cache.
- Sau khi Cache được thiết lập, hệ thống Query Cache của MySQL sẽ theo dõi từng bảng liên quan trong truy vấn, nếu những bảng này (dữ liệu hoặc cấu trúc) thay đổi, thì tất cả dữ liệu Cache liên quan đến bảng đó đều sẽ bị vô hiệu.
- Cache của MySQL gần như không có tác dụng trong môi trường phân tách Database và phân tách bảng (Sharding). Nguyên nhân là: truy vấn thường được định tuyến qua Middleware (như ShardingSphere, MyCat) đến các MySQL Instance khác nhau, mỗi Instance duy trì Query Cache độc lập riêng; Middleware khi định tuyến thường viết lại SQL (thêm điều kiện Shard Key,...), dẫn đến câu lệnh sau khi viết lại có giá trị Hash không nhất quán với câu lệnh gốc, Cache không thể trúng.
- Không Cache các truy vấn sử dụng `SQL_NO_CACHE`.
- ……

Ví dụ về tùy chọn `SELECT` của Query Cache:

```sql
SELECT SQL_CACHE id, name FROM customer;# Sẽ được Cache
SELECT SQL_NO_CACHE id, name FROM customer;# Không được Cache
```

### Quản lý bộ nhớ trong cơ chế Cache

Query Cache được lưu hoàn toàn trong bộ nhớ, nên trước khi cấu hình và sử dụng nó, chúng ta cần tìm hiểu cách nó sử dụng bộ nhớ.

Query Cache của MySQL sử dụng công nghệ Memory Pool (bộ nhớ đệm), tự quản lý việc giải phóng và phân bổ bộ nhớ, chứ không thông qua hệ điều hành. Đơn vị cơ bản sử dụng của Memory Pool là block có độ dài thay đổi, dùng để lưu các thông tin như loại, kích thước, dữ liệu,... Cache của một tập kết quả sẽ xâu chuỗi các block này lại bằng danh sách liên kết (Linked List). Độ dài ngắn nhất của block là `query_cache_min_res_unit`.

Khi Server khởi động, sẽ khởi tạo bộ nhớ cần thiết cho Cache, là một khối trống hoàn chỉnh. Khi truy vấn bắt đầu trả kết quả, do lúc này không thể biết trước tập kết quả hoàn chỉnh lớn bao nhiêu, MySQL sẽ xin Memory Pool một khối dữ liệu cơ bản có kích thước `query_cache_min_res_unit` trước. Nếu tập kết quả vượt quá dung lượng khối đó, thì trong quá trình sinh kết quả sẽ tiếp tục xin khối dữ liệu mới theo nhu cầu, và xâu chuỗi chúng lại bằng danh sách liên kết.

Việc phân bổ khối bộ nhớ cần khóa khối không gian trước, nên thao tác rất chậm, MySQL sẽ cố gắng tránh thao tác này, chọn khối bộ nhớ nhỏ nhất có thể, nếu không đủ thì tiếp tục xin, nếu sau khi lưu xong còn dư thì giải phóng phần thừa.

Cùng với việc đọc/ghi đồng thời (Concurrent) diễn ra, các khối Cache có kích thước khác nhau được giải phóng một cách không có thứ tự và ngẫu nhiên, cộng thêm không gian nhỏ còn thừa khi phân bổ (nhỏ hơn `query_cache_min_res_unit`) không thể tái sử dụng, trong Memory Pool sẽ nhanh chóng sinh ra lượng lớn khối bộ nhớ trống không liên tục (tương tự phân mảnh ngoài ở tầng hệ điều hành), từ đó kích hoạt việc tiêu tốn cho chỉnh lý bộ nhớ thường xuyên hơn.

## Ưu nhược điểm của Query Cache trong MySQL

**Ưu điểm:**

- Truy vấn bằng Query Cache xảy ra sau khi MySQL nhận yêu cầu truy vấn từ Client, sau khi xác minh quyền truy vấn và trước khi phân tích SQL truy vấn. Nghĩa là, sau khi MySQL nhận SQL truy vấn từ Client, chỉ cần thực hiện xác minh quyền tương ứng, sẽ thông qua Query Cache để tìm kết quả, thậm chí không cần qua module Optimizer để phân tích và tối ưu Execution Plan, càng không cần bất kỳ tương tác nào với Storage Engine.
- Do Query Cache dựa trên bộ nhớ, trả trực tiếp kết quả truy vấn tương ứng từ bộ nhớ, nên giảm được lượng lớn I/O đĩa và tính toán CPU. **Nhưng ưu điểm này chỉ đúng trong tình huống tĩnh có độ đồng thời thấp và đọc nhiều ghi ít**; trong môi trường đa nhân, đồng thời cao, sự tranh chấp khốc liệt của Mutex toàn cục `LOCK_query_cache` sẽ khiến lượng lớn Thread rơi vào trạng thái chờ khóa (có thể thấy `Waiting for query cache lock` qua `SHOW PROCESSLIST`), TPS/QPS thực tế ngược lại giảm mạnh.

**Nhược điểm:**

- MySQL sẽ tính Hash cho mỗi truy vấn loại SELECT nhận được, rồi tìm xem kết quả Cache của truy vấn này có tồn tại không. Tuy chi phí CPU của việc tính Hash và tìm kiếm là rất nhỏ, nhưng Query Cache ở tầng dưới phụ thuộc vào một Mutex toàn cục duy nhất (`LOCK_query_cache`) để đảm bảo an toàn đồng thời. Một khi liên quan đến đồng thời cao, hàng nghìn hàng vạn câu lệnh truy vấn cùng lúc tranh giành Mutex này để kiểm tra hoặc ghi Cache, xung đột khóa cực kỳ khốc liệt và chi phí chuyển đổi ngữ cảnh Thread sẽ trở thành nút thắt hiệu năng chí mạng.
- Vấn đề vô hiệu hóa của Query Cache. Nếu bảng thay đổi tương đối thường xuyên, sẽ khiến tỷ lệ vô hiệu hóa của Query Cache rất cao. Thay đổi của bảng không chỉ chỉ sự thay đổi của dữ liệu trong bảng, mà còn bao gồm bất kỳ thay đổi nào của cấu trúc bảng hoặc Index.
- Các câu lệnh truy vấn khác nhau nhưng kết quả truy vấn giống nhau đều sẽ được Cache, như vậy sẽ gây tiêu tốn quá mức tài nguyên bộ nhớ. Sự khác biệt về chữ hoa chữ thường, dấu cách hoặc chú thích của câu lệnh truy vấn, Query Cache đều coi là các truy vấn khác nhau (vì giá trị Hash của chúng sẽ khác nhau).
- Việc thiết lập các biến hệ thống liên quan không hợp lý sẽ gây ra lượng lớn phân mảnh bộ nhớ, như vậy sẽ dẫn đến Query Cache thường xuyên phải dọn dẹp bộ nhớ.

## Ảnh hưởng của Query Cache trong MySQL đến hiệu năng

Trong MySQL Server, việc bật Query Cache sẽ mang lại tiêu tốn thêm cho cả đọc và ghi của Database:

- **Thao tác đọc cần giữ khóa để kiểm tra**: Trước khi truy vấn đọc bắt đầu phải kiểm tra trúng Cache, điều này cần lấy Shared Lock (khóa chia sẻ) `LOCK_query_cache`. Dưới áp lực đồng thời cao, lượng lớn yêu cầu đọc cùng lúc tranh giành khóa sẽ tạo thành hàng đợi.
- **Chi phí ghi Cache**: Nếu truy vấn đọc có thể Cache, sau khi thực thi cần ghi kết quả vào Cache, liên quan đến thao tác phân bổ bộ nhớ và xâu chuỗi danh sách liên kết, cũng cần giữ khóa.
- **Thao tác ghi kích hoạt vô hiệu hóa toàn cục**: Khi ghi dữ liệu vào bảng, phải vô hiệu hóa tất cả Cache của bảng đó. Điều này cần lấy Exclusive Lock (khóa độc quyền) để quét toàn bộ vùng Cache, `query_cache_size` càng lớn thì thời gian giữ khóa càng lâu. Thiết kế Mutex toàn cục duy nhất của Query Cache khiến thao tác ghi sẽ chặn tất cả yêu cầu đọc/ghi khác, đây cũng là nguyên nhân hàng đầu khiến MySQL 8.0 loại bỏ nó.
- **Transaction dài của InnoDB làm vấn đề trầm trọng hơn**: Dưới tính năng MVCC, trước khi Transaction commit, Cache liên quan không thể sử dụng. Transaction dài không những giảm tỷ lệ trúng Cache, Exclusive Lock do thao tác ghi kích hoạt còn chặn việc đọc Cache của **các bảng không liên quan khác**.

Có thể thông qua câu lệnh sau để xem tình hình sử dụng Query Cache, phán đoán xem có đáng bật không:

```sql
SHOW STATUS LIKE 'Qcache%';
```

Giải thích các chỉ số quan trọng:

| Biến trạng thái | Ý nghĩa |
| :--------------------- | :----------------------------------------------------------------- |
| `Qcache_hits` | Số lần trúng Cache |
| `Qcache_inserts` | Số lần truy vấn được ghi vào Cache |
| `Qcache_not_cached` | Số lần truy vấn không được Cache (không thể Cache hoặc không trúng) |
| `Qcache_lowmem_prunes` | Số mục Cache bị loại bỏ do thiếu bộ nhớ, liên tục tăng cho thấy không gian Cache không đủ hoặc phân mảnh nghiêm trọng |
| `Qcache_free_memory` | Bộ nhớ trống còn lại của Cache (byte) |

Công thức tham khảo tính tỷ lệ trúng:

```
Tỷ lệ trúng = Qcache_hits / (Qcache_hits + Qcache_inserts + Qcache_not_cached)
```

Nếu tỷ lệ trúng trong thời gian dài thấp hơn 50%, cho thấy Workload (tải công việc) không phù hợp với Query Cache, khuyến nghị tắt. Ngoài ra, còn cần quan tâm tỷ số giữa `Qcache_lowmem_prunes` và `Qcache_inserts`: nếu tỷ số cực cao, nghĩa là dữ liệu vừa ghi vào Cache đã nhanh chóng bị loại do phân mảnh bộ nhớ hoặc thiếu không gian, lúc này bật Cache là thuần lỗ. Khi `Qcache_lowmem_prunes` liên tục tăng, có thể thực thi `FLUSH QUERY CACHE` để chỉnh lý phân mảnh bộ nhớ, hoặc giảm giá trị `query_cache_min_res_unit` một cách thích hợp.

## Tổng kết

Query Cache trong MySQL tuy có thể nâng cao hiệu năng truy vấn của Database, nhưng bản thân cơ chế Query Cache cũng đưa vào chi phí quản lý thêm, sau mỗi lần truy vấn đều phải thực hiện một thao tác Cache, sau khi vô hiệu hóa còn phải hủy bỏ.

Query Cache là cơ chế Cache chỉ phù hợp với tương đối ít tình huống. Nếu ứng dụng của bạn rất ít cập nhật Database, thì Query Cache sẽ phát huy tác dụng rõ rệt. Điển hình như hệ thống Blog, thường thì Blog cập nhật tương đối chậm, bảng dữ liệu tương đối ổn định không đổi, lúc này tác dụng của Query Cache sẽ khá rõ ràng.

Tổng kết ngắn gọn các tình huống áp dụng của Query Cache:

- Dữ liệu bảng không sửa thường xuyên, dữ liệu tương đối tĩnh.
- Độ lặp lại của truy vấn (Select) cao.
- Tập kết quả truy vấn nhỏ hơn 1 MB.

Đối với một hệ thống cập nhật thường xuyên, tác dụng của Query Cache rất nhỏ bé, trong một số trường hợp bật Query Cache còn khiến hiệu năng giảm sút.

Tổng kết ngắn gọn các tình huống không áp dụng của Query Cache:

- Dữ liệu trong bảng, cấu trúc bảng hoặc Index thay đổi thường xuyên
- Truy vấn lặp lại rất ít
- Tập kết quả truy vấn rất lớn

《高性能 MySQL》(High Performance MySQL) viết như sau:

> Theo kinh nghiệm của chúng tôi, trong môi trường áp lực đồng thời cao, Query Cache sẽ dẫn đến hiệu năng hệ thống giảm sút, thậm chí treo cứng. Nếu bạn nhất định phải sử dụng Query Cache, thì đừng đặt bộ nhớ quá lớn, và chỉ sử dụng khi có lợi ích rõ ràng (số lần sửa đổi nội dung Database tương đối ít).

**Quả thật là như vậy! Trong dự án thực tế, càng khuyến nghị sử dụng Cache cục bộ (ví dụ Caffeine) hoặc Cache phân tán (ví dụ Redis), hiệu năng tốt hơn, thông dụng hơn.**

## Tham khảo

- 《高性能 MySQL》(High Performance MySQL)
- Cơ chế Cache của MySQL: <https://zhuanlan.zhihu.com/p/55947158>
- Thiết lập và sử dụng Query Cache của RDS MySQL - Tài liệu Alibaba Cloud Database RDS: <https://help.aliyun.com/document_detail/41717.html>
- 8.10.3 The MySQL Query Cache - Tài liệu chính thức của MySQL: <https://dev.mysql.com/doc/refman/5.7/en/query-cache.html>

<!-- @include: @article-footer.snippet.md -->
