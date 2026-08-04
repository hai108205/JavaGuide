---
title: Quá trình thực thi câu lệnh SQL trong MySQL
description: Giải thích chi tiết quy trình thực thi hoàn chỉnh của câu lệnh SQL trong MySQL, từ Connector xác thực danh tính, Query Cache, Parser phân tích cú pháp, Optimizer sinh Execution Plan cho đến Executor gọi Storage Engine.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: Quy trình thực thi MySQL,Quá trình thực thi SQL,Connector,Parser,Optimizer,Executor,Tầng Server,Storage Engine,InnoDB
---

> Bài viết này được đóng góp bởi [木木匠](https://github.com/kinglaw1204).

Bài viết này sẽ phân tích quy trình thực thi của một câu lệnh SQL trong MySQL, bao gồm việc truy vấn SQL sẽ luân chuyển bên trong MySQL như thế nào, và việc cập nhật câu lệnh SQL được hoàn thành ra sao.

Trước khi phân tích, tôi sẽ cùng bạn xem qua kiến trúc cơ bản của MySQL. Việc nắm được MySQL được cấu thành từ những thành phần nào và tác dụng của các thành phần đó là gì, sẽ giúp chúng ta hiểu và giải quyết những vấn đề này.

## 1. Phân tích kiến trúc cơ bản của MySQL

### 1.1 Tổng quan kiến trúc cơ bản của MySQL

Hình dưới đây là sơ đồ kiến trúc tóm tắt của MySQL, từ hình này bạn có thể thấy rất rõ ràng câu lệnh SQL của người dùng được thực thi bên trong MySQL như thế nào.

Trước tiên xin giới thiệu ngắn gọn tác dụng cơ bản của một số thành phần xuất hiện trong hình để giúp mọi người hiểu bức hình này, trong mục 1.2 sẽ trình bày chi tiết tác dụng của các thành phần đó.

- **Connector (Bộ kết nối):** Liên quan đến xác thực danh tính và quyền (khi đăng nhập vào MySQL).
- **Query Cache (Bộ nhớ đệm truy vấn):** Khi thực thi câu lệnh truy vấn, sẽ tra cứu Cache trước (đã bị loại bỏ từ phiên bản MySQL 8.0, vì tính năng này không mấy thực dụng).
- **Parser (Bộ phân tích):** Nếu không trúng Cache, câu lệnh SQL sẽ đi qua Parser. Parser nói đơn giản là trước tiên xem câu lệnh SQL của bạn định làm gì, rồi kiểm tra cú pháp câu lệnh SQL của bạn có đúng không.
- **Optimizer (Bộ tối ưu):** Thực thi theo phương án mà MySQL cho là tối ưu.
- **Executor (Bộ thực thi):** Thực thi câu lệnh, sau đó nhận dữ liệu trả về từ Storage Engine. -

![](https://oss.javaguide.cn/javaguide/13526879-3037b144ed09eb88.png)

Nói đơn giản, MySQL chủ yếu chia thành tầng Server và tầng Storage Engine:

- **Tầng Server**: Chủ yếu bao gồm Connector, Query Cache, Parser, Optimizer, Executor,... Tất cả các tính năng liên Storage Engine đều được thực hiện ở tầng này, ví dụ như Stored Procedure (thủ tục lưu trữ), Trigger, View, Function,... Ngoài ra còn có một module Log dùng chung là module binlog.
- **Storage Engine (Công cụ lưu trữ)**: Chủ yếu chịu trách nhiệm lưu trữ và đọc dữ liệu, sử dụng kiến trúc dạng Plugin (cắm) có thể thay thế, hỗ trợ nhiều Storage Engine như InnoDB, MyISAM, Memory,... Trong đó Engine InnoDB có module Log riêng là module redolog. **Hiện nay Storage Engine được dùng phổ biến nhất là InnoDB, nó đã được chọn làm Storage Engine mặc định từ phiên bản MySQL 5.5.**

### 1.2 Giới thiệu các thành phần cơ bản của tầng Server

#### 1) Connector

Connector chủ yếu liên quan đến các tính năng về xác thực danh tính và quyền, giống như một người gác cổng cấp cao vậy.

Nó chủ yếu chịu trách nhiệm cho việc người dùng đăng nhập vào Database, thực hiện xác thực danh tính người dùng, bao gồm các thao tác như kiểm tra mật khẩu tài khoản, quyền,... Nếu mật khẩu tài khoản người dùng thông qua, Connector sẽ tra cứu tất cả quyền của người dùng đó trong bảng quyền, sau đó mọi phán đoán logic về quyền trong kết nối này đều dựa trên dữ liệu quyền đã đọc được tại thời điểm đó. Nghĩa là, sau này chỉ cần kết nối này không bị ngắt, dù quản trị viên có sửa quyền của người dùng đó thì người dùng này cũng không bị ảnh hưởng.

#### 2) Query Cache (đã bị loại bỏ từ phiên bản MySQL 8.0)

Query Cache chủ yếu dùng để Cache câu lệnh SELECT mà chúng ta thực thi cùng tập kết quả (Result Set) của câu lệnh đó.

Sau khi kết nối được thiết lập, khi thực thi câu lệnh truy vấn, sẽ tra cứu Cache trước. MySQL sẽ kiểm tra xem câu SQL này đã từng được thực thi chưa, và Cache dưới dạng Key-Value trong bộ nhớ, Key là câu lệnh truy vấn, Value là tập kết quả. Nếu Cache key được trúng, sẽ trả trực tiếp kết quả về Client; nếu không trúng, sẽ thực thi các thao tác tiếp theo, sau khi hoàn thành cũng sẽ Cache kết quả lại, tiện cho lần gọi sau. Tất nhiên khi thực sự thực thi truy vấn Cache vẫn sẽ kiểm tra quyền của người dùng, xem có điều kiện truy vấn bảng đó hay không.

Không khuyến khích sử dụng Cache cho các truy vấn MySQL, vì việc Cache truy vấn bị vô hiệu hóa trong các tình huống nghiệp vụ thực tế có thể xảy ra rất thường xuyên. Giả sử bạn cập nhật một bảng, thì tất cả Cache truy vấn trên bảng đó đều sẽ bị xóa sạch. Đối với dữ liệu không thường xuyên cập nhật, dùng Cache vẫn ổn.

Vì vậy, trong hầu hết các trường hợp chúng ta đều không khuyến khích sử dụng Query Cache.

Từ phiên bản MySQL 8.0 trở đi, tính năng Cache đã bị xóa, phía chính thức cũng cho rằng tính năng này ít được ứng dụng trong thực tế, nên dứt khoát xóa bỏ hoàn toàn.

#### 3) Parser

MySQL không trúng Cache, thì sẽ đi vào Parser. Parser chủ yếu dùng để phân tích câu lệnh SQL định làm gì, Parser cũng được chia thành vài bước:

**Bước một, phân tích từ vựng (Lexical Analysis)**, một câu lệnh SQL được cấu thành từ nhiều chuỗi ký tự, trước tiên phải trích xuất các từ khóa, ví dụ như select, trích xuất bảng cần truy vấn, trích xuất tên trường, trích xuất điều kiện truy vấn,... Sau khi hoàn thành các thao tác này, sẽ chuyển sang bước hai.

**Bước hai, phân tích cú pháp (Syntax Analysis)**, chủ yếu là phán đoán câu SQL bạn nhập có đúng không, có phù hợp với cú pháp của MySQL không.

Sau khi hoàn thành 2 bước này, MySQL chuẩn bị bắt đầu thực thi, nhưng thực thi như thế nào, thực thi thế nào để có kết quả tốt nhất? Lúc này cần Optimizer ra sân.

#### 4) Optimizer

Tác dụng của Optimizer là thực thi theo phương án mà nó cho là tối ưu (đôi khi cũng chưa chắc là tối ưu, bài viết này có liên quan đến việc giảng giải chuyên sâu phần kiến thức này), ví dụ như khi có nhiều Index thì chọn Index như thế nào, khi truy vấn nhiều bảng thì chọn thứ tự Join ra sao,...

Có thể nói, sau khi qua Optimizer, câu lệnh này cụ thể sẽ thực thi như thế nào đã được định xong.

#### 5) Executor

Sau khi chọn xong phương án thực thi, MySQL chuẩn bị bắt đầu thực thi. Trước tiên trước khi thực thi sẽ kiểm tra người dùng có quyền hay không, nếu không có quyền sẽ trả về thông tin lỗi, nếu có quyền sẽ gọi Interface của Engine và trả về kết quả thực thi của Interface.

## 2. Phân tích câu lệnh

### 2.1 Câu lệnh truy vấn

Đã nói nhiều như trên, vậy rốt cuộc một câu lệnh SQL được thực thi như thế nào? Thực ra SQL của chúng ta có thể chia thành hai loại, một loại là truy vấn, một loại là cập nhật (thêm, sửa, xóa). Chúng ta phân tích câu lệnh truy vấn trước, câu lệnh như sau:

```sql
select * from tb_student  A where A.age='18' and A.name=' 张三 ';
```

Kết hợp với phần trình bày ở trên, chúng ta phân tích quy trình thực thi của câu lệnh này:

- Trước tiên thông qua Connector để xác thực danh tính và lấy quyền (nếu xác thực thất bại thì từ chối trực tiếp). Ở các phiên bản trước MySQL 8.0, sau khi xác thực thông qua sẽ tra cứu Cache trước, dùng câu lệnh SQL này làm key để tra trong bộ nhớ xem có kết quả không, nếu có thì Cache trực tiếp, nếu không thì thực hiện bước tiếp theo.
- Thông qua Parser để phân tích từ vựng, trích xuất các yếu tố chính của câu lệnh SQL, ví dụ trích xuất câu lệnh trên là truy vấn select, trích xuất tên bảng cần truy vấn là tb_student, cần truy vấn tất cả các cột, điều kiện truy vấn là id='1' của bảng này. Sau đó phán đoán câu lệnh SQL này có lỗi cú pháp không, ví dụ từ khóa có đúng không,... Nếu kiểm tra không có vấn đề thì thực hiện bước tiếp theo.
- Tiếp theo là Optimizer xác định phương án thực thi. Câu lệnh SQL ở trên có thể có hai phương án thực thi: a. Trước tiên truy vấn học sinh có tên là "张三" (Trương Tam) trong bảng học sinh, sau đó phán đoán xem tuổi có phải là 18 không. b. Trước tiên tìm học sinh 18 tuổi trong số các học sinh, sau đó truy vấn học sinh có tên là "张三". Vậy Optimizer sẽ dựa trên thuật toán tối ưu của mình để chọn phương án có hiệu suất thực thi tốt nhất (Optimizer cho là tốt nhất, đôi khi chưa chắc đã là tốt nhất). Sau khi xác nhận Execution Plan (kế hoạch thực thi) thì chuẩn bị bắt đầu thực thi.

- Tiến hành kiểm tra quyền, nếu không có quyền sẽ trả về thông tin lỗi, nếu có quyền sẽ gọi Interface của Database Engine và trả về kết quả thực thi của Engine.

### 2.2 Câu lệnh cập nhật

Trên đây là quy trình thực thi của một câu lệnh SQL truy vấn, vậy tiếp theo chúng ta xem một câu lệnh cập nhật được thực thi như thế nào? Câu lệnh SQL như sau:

```plain
update tb_student A set A.age='19' where A.name=' 张三 ';
```

Chúng ta sửa tuổi của Trương Tam một chút. Trong Database thực tế chắc chắn sẽ không thiết lập trường tuổi này, nếu không sẽ bị người phụ trách kỹ thuật đánh cho. Thực ra câu lệnh này về cơ bản cũng sẽ đi theo quy trình truy vấn ở trên, chỉ là khi thực thi cập nhật chắc chắn phải ghi Log, điều này sẽ dẫn đến việc đưa vào module Log. Module Log đi kèm của MySQL là **binlog (Archive Log)**, tất cả các Storage Engine đều có thể sử dụng; Engine InnoDB mà chúng ta thường dùng còn đi kèm một module Log là **redo log (Redo Log)**. Chúng ta sẽ thảo luận quy trình thực thi của câu lệnh này dưới chế độ InnoDB. Quy trình như sau:

- Trước tiên truy vấn đến dòng dữ liệu của Trương Tam, sẽ không đi qua Query Cache, vì quy tắc thiết kế của Query Cache là chỉ phục vụ các câu lệnh dạng truy vấn.
- Sau đó lấy câu lệnh truy vấn được, đổi age thành 19, rồi gọi Interface API của Engine, ghi dòng dữ liệu này. InnoDB Engine lưu dữ liệu vào bộ nhớ, đồng thời ghi redo log, lúc này redo log chuyển sang trạng thái prepare, rồi báo cho Executor biết đã thực thi xong, có thể commit bất cứ lúc nào.
- Sau khi nhận được thông báo, Executor ghi binlog, rồi xóa sạch Query Cache của bảng đó. Việc xóa sạch lúc này đảm bảo các câu lệnh SELECT sau này sẽ không đọc phải Cache cũ —— vì Transaction sắp commit cuối cùng, dữ liệu sắp chuyển sang trạng thái mới nhất, thời điểm vô hiệu hóa Cache vừa khớp với thời điểm cập nhật thực tế của dữ liệu.
- Executor gọi Interface Engine, commit redo log sang trạng thái commit.
- Cập nhật hoàn tất.

**Chắc chắn sẽ có bạn hỏi, tại sao phải dùng hai module Log, dùng một module Log không được sao?**

Đó là vì ban đầu MySQL không có InnoDB Engine (InnoDB Engine là của công ty khác cắm vào MySQL dưới dạng Plugin), Engine đi kèm của MySQL là MyISAM. Nhưng chúng ta biết redo log là thứ riêng có của InnoDB Engine, các Storage Engine khác đều không có, điều này dẫn đến việc không có khả năng crash-safe (khả năng crash-safe nghĩa là dù Database có khởi động lại bất thường, các bản ghi đã commit trước đó đều không bị mất), binlog chỉ có thể dùng để lưu trữ (Archive).

Không phải nói dùng một module Log là không được, chỉ là InnoDB Engine chính là thông qua redo log để hỗ trợ Transaction. Vậy lại có bạn hỏi, tôi dùng hai module Log, nhưng đừng phức tạp như vậy có được không, tại sao redo log phải đưa vào trạng thái prepare (tiền commit)? Ở đây chúng ta dùng phương pháp phản chứng để giải thích tại sao phải làm như vậy?

- **Ghi redo log trước rồi commit trực tiếp, sau đó ghi binlog**, giả sử sau khi ghi xong redo log, máy bị lỗi, binlog chưa được ghi, vậy sau khi máy khởi động lại, máy này sẽ thông qua redo log để phục hồi dữ liệu, nhưng lúc này binlog không có ghi nhận dữ liệu đó, sau này khi Backup máy sẽ mất dòng dữ liệu này, đồng thời đồng bộ chủ-tớ cũng sẽ mất dòng dữ liệu này.
- **Ghi binlog trước, sau đó ghi redo log**, giả sử ghi xong binlog, máy khởi động lại bất thường, do không có redo log, máy này không thể phục hồi dòng bản ghi đó, nhưng binlog lại có ghi nhận, vậy cũng giống như lý lẽ ở trên, sẽ xảy ra tình trạng dữ liệu không nhất quán.

Nếu áp dụng cách Two-Phase Commit (Cam kết hai giai đoạn) của redo log thì khác, trước tiên ghi xong redo log, đánh dấu là prepare, ngay sau đó ghi xong binlog, rồi đánh dấu redo log là commit, là có thể ngăn chặn các vấn đề nêu trên, từ đó đảm bảo tính nhất quán của dữ liệu.
Vậy vấn đề đặt ra là, có tình huống cực đoan nào không? Giả sử redo log đang ở trạng thái prepare, binlog cũng đã ghi xong, lúc này xảy ra khởi động lại bất thường thì sẽ như thế nào?
Điều này phụ thuộc vào cơ chế xử lý của MySQL, quá trình xử lý của MySQL như sau:

- Phán đoán redo log có ở trạng thái commit không, nếu có, nói rõ binlog nhất định đã hoàn thành việc flush xuống đĩa, thì commit ngay lập tức.
- Nếu redo log chỉ ở trạng thái prepare nhưng không phải trạng thái commit, lúc này sẽ cầm XID của Transaction, sang binlog phán đoán Transaction đó đã hoàn thành flush xuống đĩa chưa, nếu có thì commit redo log, nếu không thì Rollback Transaction.

Như vậy đã giải quyết được vấn đề nhất quán dữ liệu.

## 3. Tổng kết

- MySQL chủ yếu chia thành tầng Server và tầng Engine. Tầng Server chủ yếu bao gồm Connector, Query Cache, Parser, Optimizer, Executor, đồng thời còn có một module Log (binlog), module Log này tất cả các Engine thực thi đều có thể dùng chung, redolog chỉ có ở InnoDB.
- Tầng Engine có dạng Plugin, hiện tại chủ yếu bao gồm MyISAM, InnoDB, Memory,...
- Quy trình thực thi của câu lệnh truy vấn như sau: Kiểm tra quyền (nếu trúng Cache) ---> Query Cache ---> Parser ---> Optimizer ---> Kiểm tra quyền ---> Executor ---> Engine
- Quy trình thực thi của câu lệnh cập nhật như sau: Parser ----> Kiểm tra quyền ----> Executor ---> Engine --- redo log (trạng thái prepare) ---> binlog ---> redo log (trạng thái commit)

## 4. Tham khảo

- 《MySQL 实战 45 讲》(45 bài giảng thực chiến MySQL)
- MySQL 5.6 Reference Manual:<https://dev.MySQL.com/doc/refman/5.6/en/>

<!-- @include: @article-footer.snippet.md -->
