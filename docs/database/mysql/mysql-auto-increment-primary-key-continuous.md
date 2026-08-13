---
title: Auto-Increment Primary Key trong MySQL có nhất định liên tục không?
description: Giải thích chi tiết nguyên nhân Auto-Increment Primary Key trong MySQL không liên tục, phân tích cơ chế cấp phát giá trị tự tăng trong các kịch bản như Unique Key Conflict, Transaction Rollback, Bulk Insert, cùng cấu hình và ảnh hưởng của InnoDB Auto-Increment Lock Mode.
category: Cơ sở dữ liệu
tag:
  - MySQL
  - Phỏng vấn công ty lớn
head:
  - - meta
    - name: keywords
      content: MySQL Auto-Increment Primary Key,AUTO_INCREMENT,Primary Key không liên tục,Transaction Rollback,Bulk Insert,Unique Key Conflict,innodb_autoinc_lock_mode
---

> Tác giả: 飞天小牛肉
>
> Bài gốc: <https://mp.weixin.qq.com/s/qci10h9rJx_COZbHV3aygQ>

Ai cũng biết rằng Auto-Increment Primary Key (khóa chính tự tăng) giúp Clustered Index duy trì thứ tự chèn tăng dần nhiều nhất có thể, tránh được việc truy vấn ngẫu nhiên, từ đó nâng cao hiệu quả truy vấn.

Nhưng thực tế, Auto-Increment Primary Key của MySQL không thể đảm bảo nhất định tăng liên tục.

Dưới đây hãy xem một ví dụ, tạo một bảng như sau:

![](https://oss.javaguide.cn/p3-juejin/3e6b80ba50cb425386b80924e3da0d23~tplv-k3u1fbpfcp-zoom-1.png)

## Giá trị tự tăng được lưu ở đâu?

Dùng `insert into test_pk values(null, 1, 1)` để chèn một hàng dữ liệu, sau đó thực thi lệnh `show create table` để xem định nghĩa cấu trúc bảng:

![](https://oss.javaguide.cn/p3-juejin/c17e46230bd34150966f0d86b2ad5e91~tplv-k3u1fbpfcp-zoom-1.png)

Định nghĩa cấu trúc bảng nói trên được lưu trong file cục bộ có đuôi `.frm`; trong thư mục data nằm dưới thư mục cài đặt MySQL, có thể tìm thấy file `.frm` này:

![](https://oss.javaguide.cn/p3-juejin/3ec0514dd7be423d80b9e7f2d52f5902~tplv-k3u1fbpfcp-zoom-1.png)

Từ cấu trúc bảng ở trên có thể thấy, trong định nghĩa bảng xuất hiện `AUTO_INCREMENT=2`, biểu thị rằng lần chèn dữ liệu tiếp theo, nếu cần tự động sinh giá trị tự tăng, sẽ sinh ra id = 2.

Nhưng cần lưu ý rằng, giá trị tự tăng không được lưu trong cấu trúc bảng này, tức là không nằm trong file `.frm`; các engine khác nhau có chiến lược lưu giá trị tự tăng khác nhau:

1. Giá trị tự tăng của engine MyISAM được lưu trong file dữ liệu.

2. Giá trị tự tăng của engine InnoDB thực ra được lưu trong bộ nhớ và không được persist. Lần đầu tiên mở bảng, hệ thống sẽ đi tìm giá trị lớn nhất của giá trị tự tăng `max(id)`, sau đó lấy `max(id)+1` làm giá trị tự tăng hiện tại của bảng này.

Ví dụ: hiện tại trong bảng, id lớn nhất trong các hàng dữ liệu hiện có là 1, AUTO_INCREMENT=2, đúng không. Lúc này, chúng ta xóa hàng có id=1, AUTO_INCREMENT vẫn là 2.

![](https://oss.javaguide.cn/p3-juejin/61b8dc9155624044a86d91c368b20059~tplv-k3u1fbpfcp-zoom-1.png)

Nhưng nếu khởi động lại instance MySQL ngay, sau khi khởi động lại, AUTO_INCREMENT của bảng này sẽ trở thành 1. Nghĩa là, việc MySQL khởi động lại có thể làm thay đổi giá trị AUTO_INCREMENT của một bảng.

![](https://oss.javaguide.cn/p3-juejin/27fdb15375664249a31f88b64e6e5e66~tplv-k3u1fbpfcp-zoom-1.png)

![](https://oss.javaguide.cn/p3-juejin/dee15f93e65d44d384345a03404f3481~tplv-k3u1fbpfcp-zoom-1.png)

Trên đây là thí nghiệm trên phiên bản MySQL 5.x ở máy của tôi; thực tế, **từ phiên bản MySQL 8.0 trở đi, bản ghi thay đổi giá trị tự tăng được đặt trong redo log, cung cấp khả năng persist giá trị tự tăng**, tức là thực hiện được "nếu xảy ra khởi động lại, giá trị tự tăng của bảng có thể được khôi phục theo redo log về giá trị trước khi MySQL khởi động lại".

Nghĩa là đối với ví dụ ở trên, sau khi khởi động lại instance, AUTO_INCREMENT của bảng này vẫn là 2.

Sau khi đã hiểu giá trị tự tăng của MySQL rốt cuộc được lưu ở đâu, chúng ta cùng xem cơ chế sửa đổi giá trị tự tăng, và từ đó dẫn ra kịch bản đầu tiên khiến giá trị tự tăng không liên tục.

## Các kịch bản giá trị tự tăng không liên tục

### Kịch bản giá trị tự tăng không liên tục 1

Trong MySQL, nếu trường id được định nghĩa là AUTO_INCREMENT, khi chèn một hàng dữ liệu, hành vi của giá trị tự tăng như sau:

- Nếu khi chèn dữ liệu, trường id được chỉ định là 0, null hoặc không được chỉ định giá trị, thì giá trị AUTO_INCREMENT hiện tại của bảng sẽ được điền vào trường tự tăng;
- Nếu khi chèn dữ liệu, trường id được chỉ định một giá trị cụ thể, thì sử dụng trực tiếp giá trị được chỉ định trong câu lệnh.

Tùy theo mối quan hệ về độ lớn giữa giá trị cần chèn và giá trị tự tăng hiện tại, kết quả thay đổi của giá trị tự tăng cũng sẽ khác nhau. Giả sử giá trị cần chèn lần này là `insert_num`, giá trị tự tăng hiện tại là `autoIncrement_num`:

- Nếu `insert_num < autoIncrement_num`, giá trị tự tăng của bảng không đổi.
- Nếu `insert_num >= autoIncrement_num`, cần sửa giá trị tự tăng hiện tại thành giá trị tự tăng mới.

Nghĩa là, nếu id được chèn là 100, giá trị tự tăng hiện tại là 90, `insert_num >= autoIncrement_num`, thì giá trị tự tăng sẽ được sửa thành giá trị tự tăng mới, tức 101.

Nhất định là như vậy sao?

Không hẳn~

Những bạn đã tìm hiểu về distributed id chắc chắn biết rằng, để tránh xung đột giữa Primary Key do hai database sinh ra, chúng ta có thể để id tự tăng của một database đều là số lẻ, còn database kia đều là số chẵn.

Số lẻ hay số chẵn thực ra được quyết định bởi hai tham số `auto_increment_offset` và `auto_increment_increment`; hai tham số này lần lượt biểu thị giá trị khởi đầu và bước nhảy của tự tăng, giá trị mặc định đều là 1.

Vì vậy, trong ví dụ ở trên, các bước sinh giá trị tự tăng mới thực tế là như sau: bắt đầu từ `auto_increment_offset`, với bước nhảy `auto_increment_increment`, liên tục cộng dồn cho đến khi tìm được giá trị đầu tiên lớn hơn 100, làm giá trị tự tăng mới.

Vì vậy, trong trường hợp này, giá trị tự tăng có thể là 102, 103, v.v., sẽ dẫn đến Primary Key id không liên tục.

Điều đáng tiếc hơn là, ngay cả khi hai tham số giá trị khởi đầu và bước nhảy của tự tăng đều được đặt là 1, Auto-Increment Primary Key id cũng chưa chắc đảm bảo Primary Key liên tục.

### Kịch bản giá trị tự tăng không liên tục 2

Ví dụ, bây giờ chúng ta chèn vào bảng một bản ghi (null,1,1), Primary Key sinh ra là 1, AUTO_INCREMENT= 2, đúng không.

![](https://oss.javaguide.cn/p3-juejin/c22c4f2cea234c7ea496025eb826c3bc~tplv-k3u1fbpfcp-zoom-1.png)

Lúc này tôi thực thi thêm một lệnh chèn `(null,1,1)`, rõ ràng sẽ báo lỗi `Duplicate entry`, vì chúng ta đã thiết lập một trường Unique Index `a`:

![](https://oss.javaguide.cn/p3-juejin/c0325e31398d4fa6bb1cbe08ef797b7f~tplv-k3u1fbpfcp-zoom-1.png)

Nhưng bạn sẽ ngạc nhiên phát hiện rằng, tuy chèn thất bại nhưng giá trị tự tăng vẫn tăng từ 2 lên 3!

Vì sao lại như vậy?

Chúng ta cùng phân tích luồng thực thi của câu lệnh insert này:

1. Executor gọi interface của InnoDB engine để chuẩn bị chèn một bản ghi (null,1,1);
2. InnoDB phát hiện người dùng không chỉ định giá trị của id tự tăng, bèn lấy giá trị tự tăng hiện tại của bảng `test_pk` là 2;
3. Đổi bản ghi được truyền vào thành (2,1,1);
4. Sửa giá trị tự tăng của bảng thành 3;
5. Tiếp tục thực hiện thao tác chèn dữ liệu; do đã tồn tại bản ghi có a=1 nên báo Duplicate key error, câu lệnh kết thúc.

Có thể thấy, thao tác sửa giá trị tự tăng diễn ra trước khi thực sự thực hiện thao tác chèn dữ liệu.

Khi câu lệnh này thực sự được thực thi, vì gặp xung đột Unique Key a nên hàng có id = 2 không được chèn thành công, nhưng giá trị tự tăng cũng không được sửa lại. Vì vậy, sau thời điểm này, khi chèn hàng dữ liệu mới, id tự tăng nhận được sẽ là 3. Nghĩa là, xuất hiện tình huống Auto-Increment Primary Key không liên tục.

Đến đây, chúng ta đã liệt kê được hai tình huống Auto-Increment Primary Key không liên tục:

1. Giá trị khởi đầu và bước nhảy của tự tăng được đặt khác 1
2. Unique Key Conflict

Ngoài ra, Transaction Rollback cũng gây ra tình huống này.

### Kịch bản giá trị tự tăng không liên tục 3

Bây giờ trong bảng chúng ta có một bản ghi `(1,1,1)`, AUTO_INCREMENT = 3:

![](https://oss.javaguide.cn/p3-juejin/6220fcf7dac54299863e43b6fb97de3e~tplv-k3u1fbpfcp-zoom-1.png)

Trước tiên chúng ta chèn một hàng dữ liệu `(null, 2, 2)`, tức là (3, 2, 2), và AUTO_INCREMENT trở thành 4:

![](https://oss.javaguide.cn/p3-juejin/3f02d46437d643c3b3d9f44a004ab269~tplv-k3u1fbpfcp-zoom-1.png)

Sau đó thực thi một đoạn SQL như sau:

![](https://oss.javaguide.cn/p3-juejin/faf5ce4a2920469cae697f845be717f5~tplv-k3u1fbpfcp-zoom-1.png)

Tuy chúng ta đã chèn một bản ghi (null, 3, 3), nhưng đã dùng rollback để hoàn tác, nên trong cơ sở dữ liệu không có bản ghi này:

![](https://oss.javaguide.cn/p3-juejin/6cb4c02722674dd399939d3d03a431c1~tplv-k3u1fbpfcp-zoom-1.png)

Trong trường hợp Transaction Rollback này, giá trị tự tăng không hề được rollback theo! Như hình dưới, giá trị tự tăng vẫn "cố chấp" tăng từ 4 lên 5:

![](https://oss.javaguide.cn/p3-juejin/e6eea1c927424ac7bda34a511ca521ae~tplv-k3u1fbpfcp-zoom-1.png)

Vì vậy lúc này khi chúng ta chèn thêm một hàng dữ liệu (null, 3, 3), Primary Key id sẽ tự động được gán là `5`:

![](https://oss.javaguide.cn/p3-juejin/80da69dd13b543c4a32d6ed832a3c568~tplv-k3u1fbpfcp-zoom-1.png)

Vậy thì, tại sao khi xảy ra Unique Key Conflict hoặc rollback, MySQL không sửa lại giá trị tự tăng của bảng? Nếu lùi lại thì chẳng phải sẽ không xảy ra tình trạng id tự tăng không liên tục sao?

Thực tế, nguyên nhân chính của việc này là để nâng cao hiệu năng.

Chúng ta dùng phương pháp phản chứng để kiểm chứng trực tiếp: giả sử MySQL khi Transaction Rollback sẽ sửa lại giá trị tự tăng, điều gì sẽ xảy ra?

Hiện có hai Transaction A và B thực thi song song; khi xin cấp giá trị tự tăng, để tránh hai Transaction xin trúng cùng một id tự tăng, chắc chắn phải khóa, rồi xin cấp theo thứ tự, đúng không.

1. Giả sử Transaction A xin được id = 1, Transaction B xin được id=2, lúc này giá trị tự tăng của bảng t là 3, sau đó tiếp tục thực thi.
2. Transaction B commit bình thường, nhưng Transaction A gặp Unique Key Conflict, tức là bản ghi có id = 1 chèn thất bại; nếu cho phép Transaction A lùi id tự tăng, tức là sửa giá trị tự tăng hiện tại của bảng về 1, thì sẽ xuất hiện tình huống: trong bảng đã có hàng id = 2, mà giá trị id tự tăng hiện tại là 1.
3. Tiếp theo, các Transaction khác tiếp tục thực thi sẽ xin trúng id=2. Lúc này sẽ xuất hiện lỗi "Primary Key Conflict" ở câu lệnh chèn.

![](https://oss.javaguide.cn/p3-juejin/5f26f02e60f643c9a7cab88a9f1bdce9~tplv-k3u1fbpfcp-zoom-1.png)

Và để giải quyết Primary Key Conflict này, có hai cách:

1. Mỗi lần trước khi xin id, kiểm tra trước xem id này đã tồn tại trong bảng chưa; nếu tồn tại thì bỏ qua id này.
2. Mở rộng phạm vi khóa của id tự tăng, bắt buộc phải đợi một Transaction thực thi xong và commit thì Transaction tiếp theo mới được xin id tự tăng.

Rõ ràng, chi phí của hai cách trên đều khá cao, sẽ gây ra vấn đề hiệu năng. Mà truy đến cùng nguyên nhân, chính là giả định "cho phép lùi id tự tăng" của chúng ta.

Vì vậy, InnoDB đã từ bỏ thiết kế này: câu lệnh thực thi thất bại cũng không lùi id tự tăng. Cũng chính vì vậy nên chỉ đảm bảo được id tự tăng là tăng dần, nhưng không đảm bảo là liên tục.

Tổng kết lại, chúng ta đã phân tích ba kịch bản giá trị tự tăng không liên tục; còn có kịch bản thứ tư: Bulk Insert (chèn dữ liệu hàng loạt).

### Kịch bản giá trị tự tăng không liên tục 4

Đối với các câu lệnh chèn dữ liệu hàng loạt, MySQL có một chiến lược xin cấp id tự tăng theo lô:

1. Trong quá trình thực thi câu lệnh, lần đầu tiên xin id tự tăng sẽ được cấp 1 id;
2. Sau khi dùng hết 1 id, câu lệnh này xin id tự tăng lần thứ hai sẽ được cấp 2 id;
3. Sau khi dùng hết 2 id, vẫn câu lệnh đó, xin id tự tăng lần thứ ba sẽ được cấp 4 id;
4. Cứ như vậy, cùng một câu lệnh khi xin id tự tăng, số lượng id tự tăng xin được mỗi lần đều gấp đôi lần trước.

Lưu ý, Bulk Insert nói đến ở đây không phải là câu lệnh insert thông thường chứa nhiều giá trị value!!! Vì loại câu lệnh này khi xin id tự tăng có thể tính toán chính xác cần bao nhiêu id, sau đó xin cấp một lần; sau khi xin xong, khóa có thể được giải phóng.

Còn đối với các loại câu lệnh như `insert … select`, `replace … select` và `load data`, MySQL không biết rốt cuộc cần xin bao nhiêu id, nên áp dụng chiến lược xin cấp theo lô này; dù sao nếu xin từng id một thì quá chậm.

Ví dụ, giả sử bảng hiện tại của chúng ta có dữ liệu như sau:

![](https://oss.javaguide.cn/p3-juejin/6453cfc107f94e3bb86c95072d443472~tplv-k3u1fbpfcp-zoom-1.png)

Chúng ta tạo một bảng `test_pk2` có cùng định nghĩa cấu trúc với bảng hiện tại `test_pk`:

![](https://oss.javaguide.cn/p3-juejin/45248a6dc34f431bba14d434bee2c79e~tplv-k3u1fbpfcp-zoom-1.png)

Sau đó dùng `insert...select` để chèn dữ liệu hàng loạt vào bảng `teset_pk2`:

![](https://oss.javaguide.cn/p3-juejin/c1b061e86bae484694d15ceb703b10ca~tplv-k3u1fbpfcp-zoom-1.png)

Có thể thấy, dữ liệu đã được import thành công.

Xem tiếp giá trị tự tăng của `test_pk2` là bao nhiêu:

![](https://oss.javaguide.cn/p3-juejin/0ff9039366154c738331d64ebaf88d3b~tplv-k3u1fbpfcp-zoom-1.png)

Như phân tích ở trên, là 8 chứ không phải 6.

Cụ thể mà nói, insert……select thực tế đã chèn vào bảng 5 hàng dữ liệu (1 1) (2 2) (3 3) (4 4) (5 5). Nhưng 5 hàng dữ liệu này được xin id tự tăng thành ba lần; kết hợp với chiến lược xin cấp theo lô, số lượng id tự tăng xin được mỗi lần đều gấp đôi lần trước, nên:

- Lần thứ nhất xin được một id: id=1
- Lần thứ hai được cấp hai id: id=2 và id=3
- Lần thứ ba được cấp bốn id: id=4, id = 5, id = 6, id=7

Do câu lệnh này thực tế chỉ dùng hết 5 id, nên id=6 và id=7 bị lãng phí. Sau đó, khi thực thi `insert into test_pk2 values(null,6,6)`, dữ liệu thực sự được chèn là (8,6,6):

![](https://oss.javaguide.cn/p3-juejin/51612fbac3804cff8c5157df21d6e355~tplv-k3u1fbpfcp-zoom-1.png)

## Tổng kết

Bài viết này tổng kết 4 kịch bản giá trị tự tăng không liên tục:

1. Giá trị khởi đầu và bước nhảy của tự tăng được đặt khác 1
2. Unique Key Conflict
3. Transaction Rollback
4. Bulk Insert (như câu lệnh `insert...select`)

<!-- @include: @article-footer.snippet.md -->
