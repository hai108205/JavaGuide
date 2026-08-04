---
title: Cách InnoDB Storage Engine triển khai MVCC
description: Phân tích chuyên sâu nguyên lý triển khai MVCC của InnoDB Storage Engine, giải thích chi tiết Hidden Column, Undo Log Version Chain, cơ chế ReadView, cùng sự khác biệt giữa Snapshot Read và Current Read, giúp hiểu rõ MySQL thực hiện Transaction Isolation như thế nào.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MVCC,Multi-Version Concurrency Control,InnoDB,Snapshot Read,Current Read,Consistent View,ReadView,undo log,Hidden Column,Transaction Isolation
---

## Multi-Version Concurrency Control (Điều khiển đồng thời đa phiên bản)

MVCC là một cơ chế điều khiển đồng thời, được sử dụng để duy trì tính nhất quán và tính cô lập của dữ liệu khi có nhiều Transaction đồng thời cùng đọc và ghi cơ sở dữ liệu. Cơ chế này được thực hiện bằng cách duy trì nhiều phiên bản dữ liệu trên mỗi hàng dữ liệu (row). Khi một Transaction sửa đổi dữ liệu, InnoDB sẽ **trực tiếp cập nhật hàng dữ liệu hiện tại** (cập nhật tại chỗ), đồng thời lưu **dữ liệu phiên bản cũ vào Undo Log**. Khi các Transaction khác thực hiện Snapshot Read (đọc theo snapshot), chúng sẽ dựa vào **ReadView** và **Version Chain trong Undo Log** để đọc được Consistent View (khung nhìn nhất quán) của dữ liệu tại một thời điểm nhất định, từ đó tránh việc thao tác đọc bị chặn bởi thao tác ghi.

1. Thao tác đọc (SELECT):

Khi một Transaction thực hiện thao tác đọc, nó sẽ sử dụng Snapshot Read. Snapshot Read được tạo dựa trên trạng thái của cơ sở dữ liệu tại thời điểm Transaction bắt đầu, do đó Transaction sẽ không đọc các sửa đổi mà các Transaction khác chưa commit. Cơ chế hoạt động cụ thể như sau:

- Đối với thao tác đọc, Transaction sẽ tìm các hàng dữ liệu thỏa mãn điều kiện và chọn phiên bản dữ liệu phù hợp với thời điểm bắt đầu của Transaction để đọc.
- Nếu một hàng dữ liệu có nhiều phiên bản, Transaction sẽ chọn phiên bản mới nhất không muộn hơn thời điểm bắt đầu của nó, đảm bảo Transaction chỉ đọc dữ liệu đã tồn tại trước khi nó bắt đầu.
- Transaction đọc dữ liệu snapshot, nên các sửa đổi của những Transaction đồng thời khác trên hàng dữ liệu sẽ không ảnh hưởng đến thao tác đọc của Transaction hiện tại.

2. Thao tác ghi (INSERT, UPDATE, DELETE):

Khi một Transaction thực hiện thao tác ghi, nó sẽ tạo ra một phiên bản dữ liệu mới và ghi dữ liệu đã sửa đổi vào cơ sở dữ liệu. Cơ chế hoạt động cụ thể như sau:

- Đối với thao tác ghi, Transaction sẽ tạo một phiên bản mới cho hàng dữ liệu cần sửa đổi và ghi dữ liệu đã sửa đổi vào phiên bản mới.
- Phiên bản mới của dữ liệu sẽ mang version number của Transaction hiện tại, để các Transaction khác có thể đọc đúng phiên bản dữ liệu tương ứng.
- Phiên bản dữ liệu gốc vẫn tồn tại để các Transaction khác sử dụng cho Snapshot Read, điều này đảm bảo các Transaction khác không bị ảnh hưởng bởi thao tác ghi của Transaction hiện tại.

3. Commit và rollback Transaction:

- Khi một Transaction được commit, các sửa đổi mà nó thực hiện sẽ trở thành phiên bản mới nhất của cơ sở dữ liệu và có thể được nhìn thấy bởi các Transaction khác.
- Khi một Transaction bị rollback, các sửa đổi mà nó thực hiện sẽ bị hủy bỏ và không thể được nhìn thấy bởi các Transaction khác.

4. Thu hồi phiên bản:

Để ngăn số lượng phiên bản trong cơ sở dữ liệu tăng lên vô hạn, MVCC sẽ định kỳ thu hồi các phiên bản. Cơ chế thu hồi sẽ xóa dữ liệu phiên bản cũ không còn cần thiết, từ đó giải phóng không gian lưu trữ.

MVCC thực hiện điều khiển đồng thời bằng cách tạo nhiều phiên bản dữ liệu và sử dụng Snapshot Read. Thao tác đọc sử dụng snapshot của dữ liệu phiên bản cũ, thao tác ghi tạo phiên bản mới và đảm bảo phiên bản gốc vẫn khả dụng. Nhờ vậy, các Transaction khác nhau có thể thực thi đồng thời ở một mức độ nhất định mà không gây nhiễu lẫn nhau, từ đó nâng cao hiệu năng xử lý đồng thời và tính nhất quán dữ liệu của cơ sở dữ liệu.

## Consistent Non-locking Read và Locking Read

### Consistent Non-locking Read

Đối với việc triển khai [**Consistent Nonlocking Reads (đọc nhất quán không khóa)**](https://dev.mysql.com/doc/refman/5.7/en/innodb-consistent-read.html), cách làm thông thường là thêm một trường version number hoặc timestamp, khi cập nhật dữ liệu thì đồng thời tăng version number thêm 1 hoặc cập nhật timestamp. Khi truy vấn, hệ thống sẽ so sánh version number hiện tại đang khả dụng với version number của bản ghi tương ứng; nếu version của bản ghi nhỏ hơn version khả dụng thì bản ghi đó được coi là khả dụng.

Trong `InnoDB` Storage Engine, [multi versioning (đa phiên bản)](https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html) chính là phần triển khai cho non-locking read. Nếu hàng đang đọc đang bị thực thi thao tác `DELETE` hoặc `UPDATE`, thao tác đọc sẽ không chờ giải phóng khóa trên hàng đó. Thay vào đó, `InnoDB` Storage Engine sẽ đọc dữ liệu snapshot của hàng đó. Với cách đọc dữ liệu lịch sử như vậy, chúng ta gọi là Snapshot Read.

Ở hai Isolation Level là `Repeatable Read` và `Read Committed`, nếu thực thi câu lệnh `select` thông thường (không bao gồm `select ... lock in share mode`, `select ... for update`) thì sẽ sử dụng `Consistent Non-locking Read (MVCC)`. Và ở mức `Repeatable Read`, `MVCC` thực hiện được Repeatable Read đồng thời ngăn chặn một phần Phantom Read.

### Locking Read

Nếu thực thi các câu lệnh sau đây thì đó là [**Locking Reads (đọc có khóa)**](https://dev.mysql.com/doc/refman/5.7/en/innodb-locking-reads.html)

- `select ... lock in share mode`
- `select ... for update`
- Các thao tác `insert`, `update`, `delete`

Với Locking Read, dữ liệu được đọc là phiên bản mới nhất, cách đọc này còn được gọi là `Current Read (đọc hiện tại)`. Locking Read sẽ khóa các bản ghi đọc được:

- `select ... lock in share mode`: khóa `S` được đặt trên bản ghi, các Transaction khác cũng có thể đặt khóa `S`; nếu đặt khóa `x` thì sẽ bị chặn.

- `select ... for update`, `insert`, `update`, `delete`: khóa `X` được đặt trên bản ghi, và các Transaction khác không thể đặt bất kỳ khóa nào.

Với Consistent Non-locking Read, ngay cả khi bản ghi cần đọc đã bị Transaction khác đặt khóa `X`, bản ghi vẫn có thể được đọc, tức là đọc dữ liệu snapshot. Như đã nói ở trên, ở mức `Repeatable Read`, `MVCC` ngăn chặn được một phần Phantom Read; chữ "một phần" ở đây có nghĩa là trong trường hợp `Consistent Non-locking Read`, chỉ có thể đọc được dữ liệu được chèn trước lần truy vấn đầu tiên (dựa vào Read View để xác định tính khả dụng của dữ liệu, Read View được tạo ở lần truy vấn đầu tiên). Nhưng! Nếu là `Current Read`, mỗi lần đọc đều là dữ liệu mới nhất, lúc này nếu giữa hai lần truy vấn có Transaction khác chèn dữ liệu thì sẽ xảy ra Phantom Read. Vì vậy, **khi `InnoDB` triển khai `Repeatable Read`, nếu thực thi Current Read thì sẽ sử dụng `Next-key Lock` trên bản ghi được đọc để ngăn các Transaction khác chèn dữ liệu vào khoảng trống (gap)**.

## Cách InnoDB triển khai MVCC

Việc triển khai `MVCC` dựa vào: **Hidden Field, Read View, undo log**. Trong phần triển khai nội bộ, `InnoDB` dựa vào `DB_TRX_ID` của hàng dữ liệu và `Read View` để xác định tính khả dụng của dữ liệu; nếu không khả dụng thì sẽ thông qua `DB_ROLL_PTR` của hàng dữ liệu để tìm phiên bản lịch sử trong `undo log`. Mỗi Transaction có thể đọc được phiên bản dữ liệu khác nhau; trong cùng một Transaction, người dùng chỉ có thể nhìn thấy các sửa đổi đã được commit trước khi Transaction đó tạo `Read View` và các sửa đổi do chính Transaction đó thực hiện.

### Hidden Field

Ở bên trong, `InnoDB` Storage Engine thêm vào mỗi hàng dữ liệu ba [Hidden Field](https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html):

- `DB_TRX_ID (6 byte)`: biểu thị id của Transaction thực hiện insert hoặc update gần nhất trên hàng đó. Ngoài ra, thao tác `delete` ở bên trong được xem như một update, chỉ khác là sẽ được đánh dấu là đã xóa trong trường `deleted_flag` của `Record header`.
- `DB_ROLL_PTR (7 byte)`: rollback pointer, trỏ đến `undo log` của hàng đó. Nếu hàng chưa từng được update thì giá trị này rỗng.
- `DB_ROW_ID (6 byte)`: nếu không đặt Primary Key và bảng không có unique index non-null nào, `InnoDB` sẽ sử dụng id này để tạo Clustered Index.

### ReadView

```c
class ReadView {
  /* ... */
private:
  trx_id_t m_low_limit_id;      /* Các Transaction có ID lớn hơn hoặc bằng ID này đều không khả dụng */

  trx_id_t m_up_limit_id;       /* Các Transaction có ID nhỏ hơn ID này đều khả dụng */

  trx_id_t m_creator_trx_id;    /* ID của Transaction tạo ra Read View này */

  trx_id_t m_low_limit_no;      /* Transaction Number, các Undo Log có Number nhỏ hơn Number này đều có thể bị Purge */

  ids_t m_ids;                  /* Danh sách các Transaction đang hoạt động tại thời điểm tạo Read View */

  m_closed;                     /* Đánh dấu Read View đã close hay chưa */
}
```

[`Read View`](https://github.com/facebook/mysql-8.0/blob/8.0/storage/innobase/include/read0types.h#L298) chủ yếu được dùng để xác định tính khả dụng, bên trong lưu trữ "các Transaction đang hoạt động khác mà hiện tại không khả dụng đối với Transaction này".

Chủ yếu gồm các trường sau:

- `m_low_limit_id`: Transaction ID lớn nhất từng xuất hiện + 1, tức là Transaction ID tiếp theo sẽ được cấp. Các phiên bản dữ liệu có ID lớn hơn hoặc bằng ID này đều không khả dụng.
- `m_up_limit_id`: Transaction ID nhỏ nhất trong danh sách Transaction đang hoạt động `m_ids`; nếu `m_ids` rỗng thì `m_up_limit_id` bằng `m_low_limit_id`. Các phiên bản dữ liệu có ID nhỏ hơn ID này đều khả dụng.
- `m_ids`: danh sách ID của các Transaction đang hoạt động chưa commit khác tại thời điểm tạo `Read View`. Khi tạo `Read View`, các Transaction ID chưa commit hiện tại sẽ được ghi lại; sau đó dù chúng có sửa đổi giá trị của hàng bản ghi thì đối với Transaction hiện tại vẫn không khả dụng. `m_ids` không bao gồm chính Transaction hiện tại và các Transaction đã commit (đang ở trong bộ nhớ).
- `m_creator_trx_id`: ID của Transaction tạo ra `Read View` này.

**Sơ đồ tính khả dụng của Transaction** ([nguồn hình](https://leviathan.vip/2019/03/20/InnoDB%E7%9A%84%E4%BA%8B%E5%8A%A1%E5%88%86%E6%9E%90-MVCC/#MVCC-1)):

![trans_visible](./images/mvvc/trans_visible.png)

### undo-log

`undo log` chủ yếu có hai tác dụng:

- Khi Transaction rollback, dùng để khôi phục dữ liệu về trạng thái trước khi sửa đổi.
- Tác dụng còn lại là phục vụ `MVCC`: khi đọc bản ghi, nếu bản ghi đó đang bị Transaction khác chiếm giữ hoặc phiên bản hiện tại không khả dụng đối với Transaction này, thì có thể thông qua `undo log` để đọc dữ liệu phiên bản trước đó, từ đó thực hiện non-locking read.

**Trong `InnoDB` Storage Engine, `undo log` được chia thành hai loại: `insert undo log` và `update undo log`:**

1. **`insert undo log`**: là `undo log` sinh ra trong thao tác `insert`. Vì bản ghi của thao tác `insert` chỉ khả dụng đối với chính Transaction đó, không khả dụng với các Transaction khác, nên `undo log` này có thể được xóa trực tiếp sau khi Transaction commit. Không cần thực hiện thao tác `purge`.

**Trạng thái ban đầu của dữ liệu khi `insert`:**

![](./images/mvvc/317e91e1-1ee1-42ad-9412-9098d5c6a9ad.png)

2. **`update undo log`**: `undo log` sinh ra trong thao tác `update` hoặc `delete`. `undo log` này có thể cần cung cấp cho cơ chế `MVCC`, nên không thể xóa ngay khi Transaction commit. Khi commit sẽ được đưa vào danh sách liên kết `undo log`, chờ `purge thread` thực hiện xóa cuối cùng.

**Khi dữ liệu được sửa đổi lần đầu tiên:**

![](./images/mvvc/c52ff79f-10e6-46cb-b5d4-3c9cbcc1934a.png)

**Khi dữ liệu được sửa đổi lần thứ hai:**

![](./images/mvvc/6a276e7a-b0da-4c7b-bdf7-c0c7b7b3b31c.png)

Các sửa đổi trên cùng một hàng bản ghi, dù từ các Transaction khác nhau hay cùng một Transaction, sẽ khiến `undo log` của hàng đó trở thành một danh sách liên kết; đầu danh sách là bản ghi mới nhất, cuối danh sách là bản ghi cũ nhất.

### Thuật toán xác định tính khả dụng của dữ liệu

Trong `InnoDB` Storage Engine, sau khi tạo một Transaction mới, trước khi thực thi mỗi câu lệnh `select`, một snapshot (Read View) sẽ được tạo, **trong snapshot lưu trữ ID của các Transaction đang hoạt động (chưa commit) trong hệ thống cơ sở dữ liệu hiện tại**. Nói đơn giản, đó là danh sách ID của các Transaction khác trong hệ thống hiện tại mà Transaction này không được phép nhìn thấy (tức m_ids). Khi người dùng muốn đọc một hàng bản ghi nào đó trong Transaction này, `InnoDB` sẽ so sánh `DB_TRX_ID` của hàng bản ghi đó với một số biến trong `Read View` và ID của Transaction hiện tại để xác định có thỏa mãn điều kiện khả dụng hay không.

[Thuật toán so sánh cụ thể](https://github.com/facebook/mysql-8.0/blob/8.0/storage/innobase/include/read0types.h#L161) như sau ([nguồn hình](https://leviathan.vip/2019/03/20/InnoDB%E7%9A%84%E4%BA%8B%E5%8A%A1%E5%88%86%E6%9E%90-MVCC/#MVCC-1)):

![](./images/mvvc/8778836b-34a8-480b-b8c7-654fe207a8c2.png)

1. Nếu DB_TRX_ID của bản ghi < m_up_limit_id, điều đó cho thấy Transaction sửa đổi hàng này gần nhất (DB_TRX_ID) đã commit trước khi Transaction hiện tại tạo snapshot, nên giá trị của hàng bản ghi này khả dụng đối với Transaction hiện tại.

2. Nếu DB_TRX_ID >= m_low_limit_id, điều đó cho thấy Transaction sửa đổi hàng này gần nhất (DB_TRX_ID) chỉ sửa đổi hàng này sau khi Transaction hiện tại tạo snapshot, nên giá trị của hàng bản ghi này không khả dụng đối với Transaction hiện tại. Chuyển sang bước 5.

3. Nếu m_ids rỗng, điều đó cho thấy Transaction sửa đổi hàng này đã commit trước khi Transaction hiện tại tạo snapshot, nên giá trị của hàng bản ghi này khả dụng đối với Transaction hiện tại.

4. Nếu m_up_limit_id <= DB_TRX_ID < m_low_limit_id, cho thấy Transaction sửa đổi hàng này gần nhất (DB_TRX_ID) có thể đang ở "trạng thái hoạt động" hoặc "trạng thái đã commit" tại thời điểm Transaction hiện tại tạo snapshot; vì vậy cần tìm kiếm trong danh sách Transaction đang hoạt động m_ids (trong mã nguồn sử dụng tìm kiếm nhị phân, vì danh sách đã được sắp xếp).

   - Nếu tìm thấy DB_TRX_ID trong danh sách Transaction đang hoạt động m_ids, cho thấy: ① trước khi Transaction hiện tại tạo snapshot, giá trị của hàng bản ghi này đã được Transaction có ID là DB_TRX_ID sửa đổi nhưng chưa commit; hoặc ② sau khi Transaction hiện tại tạo snapshot, giá trị của hàng bản ghi này đã được Transaction có ID là DB_TRX_ID sửa đổi. Trong các trường hợp này, giá trị của hàng bản ghi này đều không khả dụng đối với Transaction hiện tại. Chuyển sang bước 5.

   - Nếu không tìm thấy trong danh sách Transaction đang hoạt động, cho thấy "Transaction có id là trx_id" sau khi sửa đổi "giá trị của hàng bản ghi này" đã commit trước khi "Transaction hiện tại" tạo snapshot, nên hàng bản ghi này khả dụng đối với Transaction hiện tại.

5. Lấy bản ghi snapshot từ `undo log` mà con trỏ DB_ROLL_PTR của hàng bản ghi này trỏ đến, dùng DB_TRX_ID của bản ghi snapshot để quay lại bước 1 tiếp tục xác định, cho đến khi tìm được phiên bản snapshot thỏa mãn hoặc trả về rỗng.

## Sự khác biệt của MVCC ở Isolation Level RC và RR

Ở các Isolation Level `RC` và `RR` (Isolation Level mặc định của InnoDB Storage Engine), `InnoDB` Storage Engine đều sử dụng `MVCC` (non-locking consistent read), nhưng thời điểm tạo `Read View` lại khác nhau.

- Ở Isolation Level RC, trước **mỗi lần `select`** đều tạo một `Read View` (danh sách m_ids).
- Ở Isolation Level RR, chỉ tạo một `Read View` (danh sách m_ids) trước **lần `select` đầu tiên** sau khi Transaction bắt đầu.

## MVCC giải quyết vấn đề Non-repeatable Read

Mặc dù RC và RR đều đọc dữ liệu snapshot thông qua `MVCC`, nhưng do **thời điểm tạo Read View khác nhau**, nên ở mức RR thực hiện được Repeatable Read.

Ví dụ:

![](./images/mvvc/6fb2b9a1-5f14-4dec-a797-e4cf388ed413.png)

### Quá trình tạo ReadView ở mức RC

**1. Giả sử thời điểm là T4, lúc này Version Chain của hàng dữ liệu id = 1 là:**

![](./images/mvvc/a3fd1ec6-8f37-42fa-b090-7446d488fd04.png)

Vì ở mức RC, mỗi lần truy vấn đều tạo `Read View`, và các Transaction 101, 102 chưa commit, nên trong `Read View` do Transaction `103` tạo ra, danh sách Transaction đang hoạt động **`m_ids` là: [101,102]**, `m_low_limit_id` là: 104, `m_up_limit_id` là: 101, `m_creator_trx_id` là: 103.

- Lúc này `DB_TRX_ID` của bản ghi mới nhất là 101, m_up_limit_id <= 101 < m_low_limit_id, nên cần tìm trong danh sách `m_ids`; thấy `DB_TRX_ID` tồn tại trong danh sách, vậy bản ghi này không khả dụng.
- Dựa vào `DB_ROLL_PTR` tìm bản ghi phiên bản trước trong `undo log`, `DB_TRX_ID` của bản ghi trước vẫn là 101, không khả dụng.
- Tiếp tục tìm bản ghi trước đó, `DB_TRX_ID` là 1, thỏa mãn 1 < m_up_limit_id, khả dụng, nên Transaction 103 truy vấn được dữ liệu là `name = 菜花`.

**2. Thời điểm là T6, Version Chain của dữ liệu là:**

![](./images/mvvc/528559e9-dae8-4d14-b78d-a5b657c88391.png)

Vì ở mức RC, `Read View` được tạo lại; lúc này Transaction 101 đã commit, 102 chưa commit, nên trong `Read View` lúc này, danh sách Transaction đang hoạt động **`m_ids`: [102]**, `m_low_limit_id` là: 104, `m_up_limit_id` là: 102, `m_creator_trx_id` là: 103.

- Lúc này `DB_TRX_ID` của bản ghi mới nhất là 102, m_up_limit_id <= 102 < m_low_limit_id, nên cần tìm trong danh sách `m_ids`; thấy `DB_TRX_ID` tồn tại trong danh sách, vậy bản ghi này không khả dụng.

- Dựa vào `DB_ROLL_PTR` tìm bản ghi phiên bản trước trong `undo log`, `DB_TRX_ID` của bản ghi trước là 101, thỏa mãn 101 < m_up_limit_id, bản ghi khả dụng, nên tại thời điểm `T6` truy vấn được dữ liệu là `name = 李四`, không nhất quán với kết quả truy vấn tại thời điểm T4 — Non-repeatable Read!

**3. Thời điểm là T9, Version Chain của dữ liệu là:**

![](./images/mvvc/6f82703c-36a1-4458-90fe-d7f4edbac71a.png)

`Read View` được tạo lại; lúc này Transaction 101 và 102 đều đã commit, nên **m_ids** rỗng, khi đó m_up_limit_id = m_low_limit_id = 104; Transaction ID của phiên bản mới nhất là 102, thỏa mãn 102 < m_low_limit_id, khả dụng, kết quả truy vấn là `name = 赵六`.

> **Tổng kết:** **Ở Isolation Level RC, Transaction tạo và thiết lập Read View mới vào lúc bắt đầu mỗi lần truy vấn, nên dẫn đến Non-repeatable Read.**

### Quá trình tạo ReadView ở mức RR

Ở Isolation Level Repeatable Read, chỉ tạo một Read View (danh sách m_ids) ở lần đọc dữ liệu đầu tiên sau khi Transaction bắt đầu.

**1. Version Chain tại thời điểm T4 là:**

![](./images/mvvc/0e906b95-c916-4f30-beda-9cb3e49746bf.png)

Khi thực thi câu lệnh `select` hiện tại, một `Read View` được tạo; lúc này **`m_ids`: [101,102]**, `m_low_limit_id` là: 104, `m_up_limit_id` là: 101, `m_creator_trx_id` là: 103.

Lúc này giống với mức RC:

- `DB_TRX_ID` của bản ghi mới nhất là 101, m_up_limit_id <= 101 < m_low_limit_id, nên cần tìm trong danh sách `m_ids`; thấy `DB_TRX_ID` tồn tại trong danh sách, vậy bản ghi này không khả dụng.
- Dựa vào `DB_ROLL_PTR` tìm bản ghi phiên bản trước trong `undo log`, `DB_TRX_ID` của bản ghi trước vẫn là 101, không khả dụng.
- Tiếp tục tìm bản ghi trước đó, `DB_TRX_ID` là 1, thỏa mãn 1 < m_up_limit_id, khả dụng, nên Transaction 103 truy vấn được dữ liệu là `name = 菜花`.

**2. Tại thời điểm T6:**

![](./images/mvvc/79ed6142-7664-4e0b-9023-cf546586aa39.png)

Ở mức RR, `Read View` chỉ được tạo một lần, nên lúc này vẫn tiếp tục sử dụng **`m_ids`: [101,102]**, `m_low_limit_id` là: 104, `m_up_limit_id` là: 101, `m_creator_trx_id` là: 103.

- `DB_TRX_ID` của bản ghi mới nhất là 102, m_up_limit_id <= 102 < m_low_limit_id, nên cần tìm trong danh sách `m_ids`; thấy `DB_TRX_ID` tồn tại trong danh sách, vậy bản ghi này không khả dụng.

- Dựa vào `DB_ROLL_PTR` tìm bản ghi phiên bản trước trong `undo log`, `DB_TRX_ID` của bản ghi trước là 101, không khả dụng.

- Tiếp tục dựa vào `DB_ROLL_PTR` tìm bản ghi phiên bản trước trong `undo log`, `DB_TRX_ID` của bản ghi trước vẫn là 101, không khả dụng.

- Tiếp tục tìm bản ghi trước đó, `DB_TRX_ID` là 1, thỏa mãn 1 < m_up_limit_id, khả dụng, nên Transaction 103 truy vấn được dữ liệu là `name = 菜花`.

**3. Tại thời điểm T9:**

![](./images/mvvc/cbbedbc5-0e3c-4711-aafd-7f3d68a4ed4e.png)

Lúc này tình huống hoàn toàn giống T6; vì `Read View` đã được tạo rồi, nên vẫn tiếp tục sử dụng **`m_ids`: [101,102]**, do đó kết quả truy vấn vẫn là `name = 菜花`.

## MVCC + Next-key-Lock ngăn chặn Phantom Read

Ở mức RR, `InnoDB` Storage Engine thông qua `MVCC` và `Next-key Lock` để giải quyết vấn đề Phantom Read:

**1. Thực thi `select` thông thường, lúc này dữ liệu được đọc theo cách Snapshot Read của `MVCC`**

Trong trường hợp Snapshot Read, Isolation Level RR chỉ tạo `Read View` ở lần truy vấn đầu tiên sau khi Transaction bắt đầu và sử dụng cho đến khi Transaction commit. Vì vậy, sau khi tạo `Read View`, các phiên bản bản ghi được update hoặc insert bởi các Transaction khác đều không khả dụng đối với Transaction hiện tại, thực hiện được Repeatable Read và ngăn chặn "Phantom Read" trong Snapshot Read.

**2. Thực thi các thao tác Current Read như select...for update/lock in share mode, insert, update, delete**

Với Current Read, dữ liệu đọc được luôn là mới nhất; nếu các Transaction khác có chèn bản ghi mới và bản ghi đó nằm trong phạm vi truy vấn của Transaction hiện tại thì sẽ xảy ra Phantom Read! `InnoDB` sử dụng [Next-key Lock](https://dev.mysql.com/doc/refman/5.7/en/innodb-locking.html#innodb-next-key-locks) để ngăn chặn tình huống này. Khi thực thi Current Read, ngoài việc khóa các bản ghi đọc được, các khoảng trống (gap) của chúng cũng bị khóa, ngăn các Transaction khác chèn dữ liệu vào phạm vi truy vấn. Chỉ cần không cho phép chèn thì sẽ không xảy ra Phantom Read.

## Tham khảo

- **《MySQL 技术内幕 InnoDB 存储引擎第 2 版》**
- [Mối quan hệ giữa Transaction Isolation Level và Lock trong InnoDB](https://tech.meituan.com/2014/08/20/innodb-lock.html)
- [MySQL Transaction và MVCC thực hiện Isolation Level như thế nào](https://blog.csdn.net/qq_35190492/article/details/109044141)
- [Phân tích Transaction InnoDB - MVCC](https://leviathan.vip/2019/03/20/InnoDB%E7%9A%84%E4%BA%8B%E5%8A%A1%E5%88%86%E6%9E%90-MVCC/)

<!-- @include: @article-footer.snippet.md -->
