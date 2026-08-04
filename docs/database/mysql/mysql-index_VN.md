---
title: Giải thích chi tiết Index trong MySQL
description: Giải thích chi tiết Index trong MySQL, phân tích sâu cấu trúc Index B+ Tree, điểm khác biệt giữa Clustered Index và Secondary Index, Composite Index và nguyên tắc Leftmost Prefix, tối ưu hóa Covering Index và Index Condition Pushdown, cùng các tình huống Index mất hiệu lực thường gặp.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: MySQL Index,B+ Tree Index,Clustered Index,Covering Index,Composite Index,Index Condition Pushdown,Back to Table,Index mất hiệu lực,nguyên tắc Leftmost Prefix
---

> Cảm ơn [WT-AHA](https://github.com/WT-AHA) đã hoàn thiện bài viết này, PR liên quan: <https://github.com/Snailclimb/JavaGuide/pull/1648> .

Bất kỳ ai từng trải qua vài buổi phỏng vấn chắc hẳn đều biết rằng kiến thức về Index (chỉ mục) trong cơ sở dữ liệu xuất hiện với tần suất cao đến mức khó tin.

Ngoài việc rất quan trọng cho quá trình chuẩn bị phỏng vấn, việc sử dụng Index hợp lý còn giúp cải thiện hiệu năng SQL một cách rõ rệt, đây là một phương pháp tối ưu SQL có hiệu quả cao so với chi phí bỏ ra.

## Giới thiệu về Index

**Index là một cấu trúc dữ liệu dùng để truy vấn và tìm kiếm dữ liệu nhanh, bản chất của nó có thể được xem là một cấu trúc dữ liệu đã được sắp xếp.**

Tác dụng của Index tương tự như mục lục của một cuốn sách. Ví dụ: khi tra từ điển, nếu không có mục lục, chúng ta chỉ có thể lật từng trang để tìm chữ cần tra, tốc độ rất chậm; nếu có mục lục, chúng ta chỉ cần tìm vị trí của chữ trong mục lục trước, sau đó lật thẳng đến trang đó là xong.

Cấu trúc dữ liệu bên dưới của Index có rất nhiều loại, các cấu trúc Index phổ biến gồm: B Tree, B+ Tree, Hash và cây đỏ đen (Red-Black Tree). Trong MySQL, dù là Innodb hay MyISAM thì đều sử dụng B+ Tree làm cấu trúc Index.

## Ưu và nhược điểm của Index

**Ưu điểm của Index:**

1. **Tốc độ truy vấn tăng vọt (mục đích chính)**: Thông qua Index, cơ sở dữ liệu có thể **giảm đáng kể lượng dữ liệu cần quét**, định vị trực tiếp đến các bản ghi thỏa mãn điều kiện, từ đó tăng tốc độ tìm kiếm dữ liệu một cách rõ rệt và giảm số lần I/O đĩa.
2. **Đảm bảo tính duy nhất của dữ liệu**: Bằng cách tạo **Unique Index (chỉ mục duy nhất)**, có thể đảm bảo giá trị của một cột (hoặc tổ hợp nhiều cột) trong bảng là duy nhất, chẳng hạn như ID người dùng, email, v.v. Bản thân Primary Key (khóa chính) cũng là một dạng Unique Index.
3. **Tăng tốc sắp xếp và phân nhóm**: Nếu các cột liên quan trong mệnh đề ORDER BY hoặc GROUP BY của truy vấn đã có Index, cơ sở dữ liệu thường có thể tận dụng trực tiếp đặc tính đã được sắp xếp sẵn của Index để tránh các thao tác sắp xếp bổ sung, từ đó nâng cao hiệu năng.

**Nhược điểm của Index:**

1. **Tốn thời gian tạo và bảo trì**: Bản thân việc tạo Index đã cần thời gian, đặc biệt khi thao tác trên bảng lớn. Quan trọng hơn, khi dữ liệu trong bảng được **thêm, xóa, sửa (các thao tác DML)**, ngoài việc thao tác trên chính dữ liệu, các Index liên quan cũng phải được cập nhật và bảo trì động, điều này sẽ **làm giảm hiệu suất thực thi của các thao tác DML đó**.
2. **Chiếm không gian lưu trữ**: Index bản chất cũng là một cấu trúc dữ liệu, cần được lưu trữ dưới dạng file vật lý (hoặc cấu trúc trong bộ nhớ), do đó sẽ **chiếm thêm một phần không gian đĩa**. Index càng nhiều, càng lớn thì không gian chiếm dụng càng nhiều.
3. **Có thể bị dùng sai hoặc mất hiệu lực**: Nếu thiết kế Index không hợp lý, hoặc câu truy vấn viết không tốt, bộ tối ưu hóa (optimizer) của cơ sở dữ liệu có thể không chọn sử dụng Index (hoặc chọn sai Index), ngược lại còn làm giảm hiệu năng.

**Vậy dùng Index thì có chắc chắn tăng hiệu năng truy vấn không?**

**Không nhất thiết.** Trong hầu hết trường hợp, sử dụng Index hợp lý quả thực nhanh hơn nhiều so với quét toàn bảng (full table scan). Nhưng cũng có ngoại lệ:

- **Lượng dữ liệu quá nhỏ**: Nếu dữ liệu trong bảng rất ít (ví dụ chỉ vài trăm bản ghi), quét toàn bảng có thể còn nhanh hơn tra cứu qua Index, vì bản thân việc đi qua Index cũng có chi phí.
- **Tỷ lệ tập kết quả truy vấn quá lớn**: Nếu dữ liệu cần truy vấn chiếm phần lớn toàn bảng (ví dụ vượt quá 20%-30%), optimizer có thể cho rằng quét toàn bảng sẽ có lợi hơn, vì chi phí Back to Table (quay lại bảng) nhiều lần qua Index (I/O ngẫu nhiên) có thể cao hơn một lần quét toàn bảng tuần tự.
- **Index không được bảo trì đúng cách hoặc thông tin thống kê đã lỗi thời**: Khiến optimizer đưa ra phán đoán sai.

## Lựa chọn cấu trúc dữ liệu bên dưới của Index

### Bảng Hash

Bảng Hash (Hash Table) là tập hợp các cặp key-value, thông qua key có thể nhanh chóng lấy ra value tương ứng, vì vậy bảng Hash có thể tìm kiếm dữ liệu rất nhanh (gần O(1)).

**Vì sao có thể nhanh chóng lấy ra value thông qua key?** Nguyên nhân nằm ở **thuật toán Hash** (còn gọi là thuật toán băm). Thông qua thuật toán Hash, chúng ta có thể nhanh chóng tìm ra index tương ứng với key, tìm được index thì cũng tìm được value tương ứng.

```java
hash = hashfunc(key)
index = hash % array_size
```

![](https://oss.javaguide.cn/github/javaguide/database/mysql20210513092328171.png)

Tuy nhiên! Thuật toán Hash có vấn đề **xung đột Hash (Hash Collision)**, nghĩa là nhiều key khác nhau cuối cùng lại cho ra cùng một index. Thông thường, cách giải quyết phổ biến là **phương pháp chaining (danh sách chuỗi)**. Phương pháp chaining lưu các dữ liệu bị xung đột Hash vào một danh sách liên kết. Ví dụ, trước JDK1.8, `HashMap` dùng phương pháp chaining để giải quyết xung đột Hash. Tuy nhiên, từ JDK1.8 trở đi, để nâng cao hiệu suất tìm kiếm khi danh sách liên kết quá dài, `HashMap` đã đưa thêm cây đỏ đen vào.

![](https://oss.javaguide.cn/github/javaguide/database/mysql20210513092224836.png)

Để giảm thiểu xung đột Hash, một hàm Hash tốt nên phân bố dữ liệu "đều" trên toàn bộ tập hợp các giá trị Hash có thể.

Storage engine InnoDB của MySQL không trực tiếp hỗ trợ Hash Index thông thường, tuy nhiên trong InnoDB tồn tại một loại "Adaptive Hash Index" (chỉ mục Hash thích ứng) đặc biệt. Adaptive Hash Index không phải là Hash Index thuần túy theo nghĩa truyền thống, mà là sự kết hợp đặc điểm của B+Tree và Hash Index để thích ứng tốt hơn với mô hình truy cập dữ liệu và nhu cầu hiệu năng trong ứng dụng thực tế. Mỗi Hash bucket của Adaptive Hash Index thực chất là một cấu trúc B+Tree nhỏ. Cấu trúc B+Tree này có thể lưu nhiều cặp key-value chứ không chỉ một key. Điều này giúp giảm độ dài của chuỗi xung đột Hash và nâng cao hiệu quả của Index. Giới thiệu chi tiết về Adaptive Hash Index có thể xem bài viết [Các loại "Buffer" trong MySQL: Adaptive Hash Index](https://mp.weixin.qq.com/s/ra4v1XR5pzSWc-qtGO-dBg).

Vì bảng Hash nhanh như vậy, **tại sao MySQL không sử dụng nó làm cấu trúc dữ liệu cho Index?** Nguyên nhân chính là Hash Index không hỗ trợ truy vấn sắp xếp và truy vấn phạm vi. Nếu chúng ta cần sắp xếp dữ liệu trong bảng hoặc thực hiện truy vấn phạm vi, Hash Index sẽ không đáp ứng được. Hơn nữa, mỗi lần I/O chỉ lấy được một phần tử.

Hãy thử tưởng tượng một tình huống:

```java
SELECT * FROM tb1 WHERE id < 500;
```

Trong loại truy vấn phạm vi này, lợi thế của B+ Tree rất lớn, chỉ cần duyệt các leaf node nhỏ hơn 500 là đủ. Trong khi đó Hash Index định vị dựa trên thuật toán Hash, chẳng lẽ phải thực hiện tính Hash cho từng dữ liệu từ 1 đến 499 để định vị sao? Đây chính là nhược điểm lớn nhất của Hash.

### Cây tìm kiếm nhị phân (BST)

Cây tìm kiếm nhị phân (Binary Search Tree) là một cấu trúc dữ liệu dựa trên cây nhị phân, có các đặc điểm sau:

1. Giá trị của tất cả các node thuộc cây con bên trái đều nhỏ hơn giá trị của node gốc.
2. Giá trị của tất cả các node thuộc cây con bên phải đều lớn hơn giá trị của node gốc.
3. Cây con bên trái và cây con bên phải cũng đều là cây tìm kiếm nhị phân.

Khi cây tìm kiếm nhị phân ở trạng thái cân bằng, tức là độ sâu cây con trái và phải của mỗi node trong cây chênh lệch không quá 1, thì độ phức tạp thời gian truy vấn là O(log2(N)), hiệu quả tương đối cao. Tuy nhiên, khi cây tìm kiếm nhị phân không cân bằng, ví dụ trong trường hợp xấu nhất (chèn các node theo thứ tự đã sắp xếp), cây sẽ thoái hóa thành danh sách liên kết tuyến tính (còn gọi là cây lệch - oblique tree), khiến hiệu suất truy vấn giảm mạnh, độ phức tạp thời gian thoái hóa thành O(N).

![Cây lệch](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/oblique-tree.png)

Nói cách khác, **hiệu năng của cây tìm kiếm nhị phân phụ thuộc rất nhiều vào mức độ cân bằng của nó, điều này khiến nó không phù hợp làm cấu trúc dữ liệu cho Index bên dưới của MySQL.**

Để giải quyết vấn đề này và nâng cao hiệu quả truy vấn, người ta đã phát minh ra nhiều cấu trúc dữ liệu cải tiến dựa trên cây tìm kiếm nhị phân, chẳng hạn như cây nhị phân cân bằng (AVL), B-Tree, B+Tree, v.v.

### Cây AVL

Cây AVL là cây tìm kiếm nhị phân tự cân bằng được phát minh sớm nhất trong khoa học máy tính, tên của nó được lấy từ tên viết tắt của hai nhà phát minh G.M. Adelson-Velsky và E.M. Landis. Đặc điểm của cây AVL là đảm bảo chênh lệch chiều cao cây con trái và phải của bất kỳ node nào không vượt quá 1, vì vậy còn được gọi là cây nhị phân cân bằng theo chiều cao; độ phức tạp thời gian của thao tác tìm kiếm, chèn và xóa trong trường hợp trung bình và xấu nhất đều là O(logn).

![](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/avl-tree.png)

Cây AVL sử dụng các phép xoay để duy trì sự cân bằng. Có bốn phép xoay chính: xoay LL, xoay RR, xoay LR và xoay RL. Trong đó xoay LL và xoay RR lần lượt dùng để xử lý mất cân bằng trái-trái và phải-phải, còn xoay LR và xoay RL dùng để xử lý mất cân bằng trái-phải và phải-trái.

Do cây AVL cần thực hiện các phép xoay thường xuyên để giữ cân bằng nên sẽ phát sinh chi phí tính toán khá lớn, từ đó làm giảm hiệu năng của các thao tác ghi trong cơ sở dữ liệu. Hơn nữa, khi sử dụng cây AVL, mỗi node của cây chỉ lưu một dữ liệu, và mỗi lần thực hiện I/O đĩa chỉ đọc được dữ liệu của một node; nếu dữ liệu cần truy vấn nằm rải rác trên nhiều node thì sẽ cần nhiều lần I/O đĩa. **I/O đĩa là thao tác tốn thời gian, khi thiết kế Index cho cơ sở dữ liệu, chúng ta cần ưu tiên xem xét làm thế nào để giảm thiểu số lần I/O đĩa.**

Trong thực tế, cây AVL không được sử dụng nhiều.

### Cây đỏ đen (Red-Black Tree)

Cây đỏ đen là một loại cây tìm kiếm nhị phân tự cân bằng, thông qua việc đổi màu và thực hiện phép xoay khi chèn và xóa node, cây luôn được giữ ở trạng thái cân bằng, nó có các đặc điểm sau:

1. Mỗi node chỉ có thể là màu đỏ hoặc màu đen;
2. Node gốc luôn luôn màu đen;
3. Mỗi node lá đều là node rỗng (node NIL) màu đen;
4. Nếu một node là màu đỏ, thì các node con của nó phải là màu đen (điều ngược lại không nhất thiết đúng);
5. Mỗi đường đi từ một node bất kỳ đến các node lá hoặc node con rỗng của nó phải chứa cùng số lượng node màu đen (tức là cùng chiều cao đen).

![Cây đỏ đen](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/red-black-tree.png)

Khác với cây AVL, cây đỏ đen không theo đuổi sự cân bằng nghiêm ngặt mà chỉ cân bằng ở mức tương đối. Chính vì vậy, hiệu suất truy vấn của cây đỏ đen giảm đôi chút, vì tính cân bằng của cây đỏ đen tương đối yếu, có thể khiến chiều cao của cây lớn, điều này có thể khiến một số dữ liệu cần nhiều lần I/O đĩa mới truy vấn được, đây cũng là lý do chính khiến MySQL không chọn cây đỏ đen. Cũng chính vì vậy, hiệu suất thao tác chèn và xóa của cây đỏ đen được nâng cao đáng kể, vì khi chèn và xóa node, cây đỏ đen chỉ cần thực hiện O(1) phép xoay và đổi màu là có thể giữ được trạng thái cân bằng cơ bản, không cần thực hiện O(logn) phép xoay như cây AVL.

**Ứng dụng của cây đỏ đen khá rộng rãi, TreeMap, TreeSet và HashMap từ JDK1.8 trở đi đều sử dụng cây đỏ đen ở tầng bên dưới. Đối với dữ liệu nằm trong bộ nhớ, cây đỏ đen thể hiện hiệu năng rất xuất sắc.**

Về so sánh cơ bản giữa cây tìm kiếm nhị phân, cây AVL, cây đỏ đen, B Tree và B+ Tree, có thể xem trước [Giải thích chi tiết cấu trúc cây](../../cs-basics/data-structure/tree.md) và [Giải thích chi tiết cây đỏ đen](../../cs-basics/data-structure/red-black-tree.md).

### B Tree & B+ Tree

B Tree còn được gọi là B- Tree, tên đầy đủ là **cây tìm kiếm cân bằng đa nhánh (Multi-way Balanced Search Tree)**, B+ Tree là một biến thể của B Tree. Chữ B trong B Tree và B+ Tree có nghĩa là `Balanced` (cân bằng).

Hiện nay hầu hết các hệ thống cơ sở dữ liệu và hệ thống file đều sử dụng B-Tree hoặc biến thể của nó là B+Tree làm cấu trúc Index.

**B Tree và B+ Tree có điểm gì giống và khác nhau?**

- Tất cả các node của B Tree đều lưu cả key (khóa) và data (dữ liệu), trong khi B+ Tree chỉ có leaf node lưu key và data, các internal node (node nội) khác chỉ lưu key.
- Các leaf node của B Tree đều độc lập với nhau; các leaf node của B+ Tree có một chuỗi tham chiếu (reference chain) trỏ đến leaf node kề bên cạnh nó.
- Quá trình tìm kiếm của B Tree tương đương với việc thực hiện tìm kiếm nhị phân trên keyword của mỗi node trong phạm vi, có thể chưa đến leaf node thì việc tìm kiếm đã kết thúc. Còn hiệu suất tìm kiếm của B+ Tree rất ổn định, mọi thao tác tìm kiếm đều là quá trình đi từ node gốc đến leaf node, việc tìm kiếm tuần tự trên các leaf node rất rõ ràng.
- Khi thực hiện truy vấn phạm vi trong B Tree, trước tiên tìm giới hạn dưới của truy vấn, sau đó duyệt B Tree theo thứ tự giữa (in-order traversal) cho đến khi tìm thấy giới hạn trên; còn truy vấn phạm vi của B+ Tree chỉ cần duyệt trên danh sách liên kết là được.

Tổng kết lại, so với B Tree, B+ Tree có các ưu điểm: số lần I/O ít hơn, hiệu suất truy vấn ổn định hơn và phù hợp hơn với truy vấn phạm vi.

Nếu chỉ muốn ôn nhanh B Tree và B+ Tree từ góc độ cấu trúc dữ liệu, có thể quay lại phần ôn tập phỏng vấn trong [Giải thích chi tiết cấu trúc cây](../../cs-basics/data-structure/tree.md).

Trong MySQL, cả engine MyISAM và engine InnoDB đều sử dụng B+Tree làm cấu trúc Index, tuy nhiên cách triển khai của hai bên không giống nhau. (Nội dung dưới đây được tổng hợp từ cuốn 《Java 工程师修炼之道》)

> Trong engine MyISAM, trường data của leaf node B+Tree lưu địa chỉ của bản ghi dữ liệu. Khi tìm kiếm bằng Index, trước tiên tìm kiếm Index theo thuật toán tìm kiếm B+Tree, nếu Key chỉ định tồn tại thì lấy giá trị trường data của nó, sau đó dùng giá trị trường data làm địa chỉ để đọc bản ghi dữ liệu tương ứng. Cách này được gọi là "**Non-Clustered Index (chỉ mục không phân cụm)**".
>
> Trong engine InnoDB, bản thân file dữ liệu cũng chính là file Index. So với MyISAM - nơi file Index và file dữ liệu tách rời nhau - file dữ liệu của bảng trong InnoDB bản thân nó là một cấu trúc Index được tổ chức theo B+Tree, trường data của leaf node lưu bản ghi dữ liệu đầy đủ. Key của Index này là Primary Key của bảng dữ liệu, vì vậy bản thân file dữ liệu của bảng InnoDB chính là Primary Index (chỉ mục chính). Cách này được gọi là "**Clustered Index (chỉ mục phân cụm)**", còn các Index còn lại đều là **Secondary Index (chỉ mục phụ)**, trường data của Secondary Index lưu giá trị Primary Key của bản ghi tương ứng chứ không phải địa chỉ, đây cũng là điểm khác biệt so với MyISAM. Khi tìm kiếm theo Primary Index, chỉ cần tìm đến node chứa key là có thể lấy dữ liệu; khi tìm kiếm theo Secondary Index, cần lấy giá trị Primary Key trước, rồi đi qua Primary Index một lần nữa. Vì vậy, khi thiết kế bảng, không nên dùng trường quá dài làm Primary Key, cũng không nên dùng trường không đơn điệu làm Primary Key, vì như vậy sẽ khiến Primary Index bị phân tách (split) thường xuyên.

## Tổng kết các loại Index

Phân loại theo khía cạnh cấu trúc dữ liệu:

- BTree Index: Loại Index mặc định và được sử dụng nhiều nhất trong MySQL. Chỉ có leaf node lưu value, non-leaf node chỉ có con trỏ và key. Các storage engine MyISAM và InnoDB đều triển khai BTree Index bằng B+Tree, nhưng cách triển khai của hai bên khác nhau (đã giới thiệu ở phần trước).
- Hash Index: Dạng tương tự cặp key-value, một lần là định vị được ngay.
- RTree Index: Thường không được sử dụng, chỉ hỗ trợ kiểu dữ liệu geometry, ưu điểm nằm ở truy vấn phạm vi, hiệu quả thấp, thường được thay thế bằng các công cụ tìm kiếm như ElasticSearch.
- Full-text Index (chỉ mục toàn văn): Thực hiện tách từ trên nội dung văn bản rồi tiến hành tìm kiếm. Hiện tại chỉ có thể tạo Full-text Index trên các cột `CHAR`, `VARCHAR`, `TEXT`. Thường không được sử dụng, hiệu quả thấp, thường được thay thế bằng các công cụ tìm kiếm như ElasticSearch.

Phân loại theo khía cạnh cách lưu trữ bên dưới:

- Clustered Index (chỉ mục phân cụm): Index có cấu trúc Index và dữ liệu được lưu cùng nhau, Primary Key Index trong InnoDB thuộc loại Clustered Index.
- Non-Clustered Index (chỉ mục không phân cụm): Index có cấu trúc Index và dữ liệu được lưu tách rời nhau, Secondary Index (chỉ mục phụ) thuộc loại Non-Clustered Index. Engine MyISAM của MySQL, bất kể Primary Key hay non-Primary Key, đều sử dụng Non-Clustered Index.

Phân loại theo khía cạnh ứng dụng:

- Primary Key Index (chỉ mục khóa chính): Tăng tốc truy vấn + giá trị cột duy nhất (không được phép NULL) + mỗi bảng chỉ có một.
- Index thông thường (Normal Index): Chỉ tăng tốc truy vấn.
- Unique Index (chỉ mục duy nhất): Tăng tốc truy vấn + giá trị cột duy nhất (có thể NULL).
- Covering Index (chỉ mục bao phủ): Một Index chứa (hay nói cách khác là bao phủ) giá trị của tất cả các trường cần truy vấn.
- Composite Index (chỉ mục kết hợp): Nhiều cột hợp thành một Index, chuyên dùng cho tìm kiếm kết hợp, hiệu quả của nó cao hơn Index Merge (gộp Index).
- Full-text Index (chỉ mục toàn văn): Thực hiện tách từ trên nội dung văn bản rồi tiến hành tìm kiếm. Hiện tại chỉ có thể tạo Full-text Index trên các cột `CHAR`, `VARCHAR`, `TEXT`. Thường không được sử dụng, hiệu quả thấp, thường được thay thế bằng các công cụ tìm kiếm như ElasticSearch.
- Prefix Index (chỉ mục tiền tố): Tạo Index trên một vài ký tự đầu tiên của văn bản, dữ liệu được tạo ra nhỏ hơn so với Index thông thường, vì chỉ lấy một vài ký tự đầu.

Các tính năng Index mới được triển khai trong MySQL 8.x:

- Invisible Index (chỉ mục ẩn): Còn gọi là chỉ mục không nhìn thấy, không được optimizer sử dụng, nhưng vẫn cần được bảo trì, thường dùng trong các tình huống soft delete (xóa mềm) và phát hành theo kiểu gray release (phát hành xám). Primary Key không thể được thiết lập thành ẩn (bao gồm cả thiết lập tường minh hoặc ngầm định).
- Descending Index (chỉ mục giảm dần): Các phiên bản trước đã hỗ trợ chỉ định Index giảm dần bằng desc, nhưng thực tế Index được tạo ra vẫn là Index tăng dần thông thường. Phải đến phiên bản MySQL 8.x mới thực sự hỗ trợ Descending Index. Ngoài ra, trong phiên bản MySQL 8.x, không còn thực hiện sắp xếp ngầm định cho câu lệnh GROUP BY.
- Functional Index (chỉ mục hàm): Từ phiên bản MySQL 8.0.13 bắt đầu hỗ trợ sử dụng giá trị của hàm hoặc biểu thức trong Index, tức là Index có thể chứa hàm hoặc biểu thức.

## Primary Key Index (chỉ mục khóa chính)

Cột Primary Key của bảng dữ liệu sử dụng chính là Primary Key Index.

Một bảng dữ liệu chỉ có thể có một Primary Key, và Primary Key không được null, không được trùng lặp.

Trong các bảng InnoDB của MySQL, khi không chỉ định tường minh Primary Key của bảng, InnoDB sẽ tự động kiểm tra trước xem trong bảng có trường nào có Unique Index và không cho phép giá trị null hay không, nếu có thì chọn trường đó làm Primary Key mặc định, nếu không InnoDB sẽ tự động tạo một Primary Key tự tăng (auto increment) 6 Byte.

![Primary Key Index](https://oss.javaguide.cn/github/javaguide/open-source-project/cluster-index.png)

## Secondary Index

Dữ liệu được lưu ở leaf node của Secondary Index (chỉ mục phụ) là giá trị của Primary Key, nói cách khác, thông qua Secondary Index có thể định vị vị trí của Primary Key, Secondary Index còn được gọi là chỉ mục phụ trợ / chỉ mục không phải khóa chính.

Unique Index, Index thông thường, Prefix Index, v.v. đều thuộc Secondary Index.

PS: Bạn nào chưa hiểu có thể tạm thời để đó, tiếp tục đọc xuống dưới, phần sau sẽ có câu trả lời, cũng có thể tự tìm kiếm thêm.

1. **Unique Index (Unique Key)**: Unique Index cũng là một dạng ràng buộc (constraint). Cột thuộc tính của Unique Index không được có dữ liệu trùng lặp, nhưng cho phép dữ liệu NULL, một bảng cho phép tạo nhiều Unique Index. Mục đích của việc tạo Unique Index phần lớn là để đảm bảo tính duy nhất của dữ liệu trên cột thuộc tính đó, chứ không phải vì hiệu quả truy vấn.
2. **Index thông thường (Index)**: Tác dụng duy nhất của Index thông thường là để truy vấn dữ liệu nhanh. Một bảng cho phép tạo nhiều Index thông thường, và cho phép dữ liệu trùng lặp và NULL.
3. **Prefix Index (Prefix)**: Prefix Index chỉ áp dụng cho dữ liệu kiểu chuỗi. Prefix Index là tạo Index trên một vài ký tự đầu tiên của văn bản, dữ liệu được tạo ra nhỏ hơn so với Index thông thường, vì chỉ lấy một vài ký tự đầu.
4. **Full-text Index (Full Text)**: Full-text Index chủ yếu để tìm kiếm thông tin từ khóa trong dữ liệu văn bản lớn, là một kỹ thuật được các cơ sở dữ liệu công cụ tìm kiếm sử dụng hiện nay. Trước Mysql5.6 chỉ có engine MyISAM hỗ trợ Full-text Index, từ 5.6 trở đi InnoDB cũng đã hỗ trợ Full-text Index.

Secondary Index:

![Secondary Index](https://oss.javaguide.cn/github/javaguide/open-source-project/no-cluster-index.png)

## Clustered Index và Non-Clustered Index

### Clustered Index (chỉ mục phân cụm)

#### Giới thiệu về Clustered Index

Clustered Index (chỉ mục phân cụm) là Index có cấu trúc Index và dữ liệu được lưu cùng nhau, nó không phải là một loại Index độc lập. Primary Key Index trong InnoDB thuộc loại Clustered Index.

Trong MySQL, file `.ibd` của bảng dùng engine InnoDB chứa cả Index và dữ liệu của bảng đó, đối với bảng dùng engine InnoDB, mỗi non-leaf node của Index (B+ Tree) lưu Index, còn leaf node lưu Index và dữ liệu tương ứng với Index đó.

#### Ưu và nhược điểm của Clustered Index

**Ưu điểm**:

- **Tốc độ truy vấn rất nhanh**: Tốc độ truy vấn của Clustered Index rất nhanh, vì bản thân toàn bộ B+ Tree là một cây cân bằng đa nhánh, các leaf node cũng đều có thứ tự, định vị được node của Index thì tương đương với việc định vị được dữ liệu. So với Non-Clustered Index, Clustered Index bớt được một lần thao tác I/O đọc dữ liệu.
- **Tối ưu cho tìm kiếm có sắp xếp và tìm kiếm phạm vi**: Clustered Index rất nhanh đối với tìm kiếm có sắp xếp và tìm kiếm phạm vi trên Primary Key.

**Nhược điểm**:

- **Phụ thuộc vào dữ liệu có thứ tự**: Vì B+ Tree là cây cân bằng đa nhánh, nếu dữ liệu của Index không có thứ tự thì cần sắp xếp khi chèn, nếu dữ liệu là kiểu số nguyên thì không sao, còn với dữ liệu vừa dài vừa khó so sánh như chuỗi hoặc UUID thì tốc độ chèn hoặc tìm kiếm chắc chắn sẽ chậm hơn.
- **Chi phí cập nhật lớn**: Nếu dữ liệu của cột Index bị sửa đổi thì Index tương ứng cũng sẽ bị sửa đổi, hơn nữa leaf node của Clustered Index còn lưu cả dữ liệu, chi phí sửa đổi chắc chắn khá lớn, vì vậy đối với Primary Key Index, Primary Key thường không được phép sửa đổi.

### Non-Clustered Index (chỉ mục không phân cụm)

#### Giới thiệu về Non-Clustered Index

Non-Clustered Index (chỉ mục không phân cụm) là Index có cấu trúc Index và dữ liệu được lưu tách rời nhau, nó không phải là một loại Index độc lập. Secondary Index (chỉ mục phụ) thuộc loại Non-Clustered Index. Engine MyISAM của MySQL, bất kể Primary Key hay non-Primary Key, đều sử dụng Non-Clustered Index.

Leaf node của Non-Clustered Index không nhất thiết lưu con trỏ dữ liệu, vì leaf node của Secondary Index lưu chính Primary Key, dựa vào Primary Key để quay lại bảng (Back to Table) tra cứu dữ liệu.

#### Ưu và nhược điểm của Non-Clustered Index

**Ưu điểm**:

Chi phí cập nhật nhỏ hơn so với Clustered Index. Chi phí cập nhật của Non-Clustered Index không lớn như Clustered Index, vì leaf node của Non-Clustered Index không lưu dữ liệu.

**Nhược điểm**:

- **Phụ thuộc vào dữ liệu có thứ tự**: Giống như Clustered Index, Non-Clustered Index cũng phụ thuộc vào dữ liệu có thứ tự.
- **Có thể phải truy vấn lần hai (Back to Table)**: Đây có lẽ là nhược điểm lớn nhất của Non-Clustered Index. Sau khi tìm được con trỏ hoặc Primary Key tương ứng với Index, có thể còn phải dựa vào con trỏ hoặc Primary Key để tra cứu tiếp trong file dữ liệu hoặc trong bảng.

Đây là ảnh chụp màn hình file của bảng trong MySQL:

![File của bảng MySQL](https://oss.javaguide.cn/github/javaguide/database/mysql20210420165311654.png)

Clustered Index và Non-Clustered Index:

![Clustered Index và Non-Clustered Index](https://oss.javaguide.cn/github/javaguide/database/mysql20210420165326946.png)

#### Non-Clustered Index có nhất định phải Back to Table không (Covering Index)?

**Non-Clustered Index không nhất định phải Back to Table.**

Hãy thử tưởng tượng một tình huống, người dùng định dùng SQL để truy vấn tên người dùng, và trường tên người dùng vừa đúng đã có Index.

```sql
 SELECT name FROM table WHERE name='guang19';
```

Vậy thì key của Index này bản thân nó đã là name, tìm được name tương ứng thì trả về trực tiếp là được, không cần Back to Table.

Ngay cả với MyISAM cũng vậy, mặc dù Primary Key Index của MyISAM quả thực cần Back to Table, vì leaf node của Primary Key Index lưu con trỏ. Nhưng!**nếu SQL truy vấn chính là Primary Key thì sao?**

```sql
SELECT id FROM table WHERE id=1;
```

Key của bản thân Primary Key Index chính là Primary Key, tìm được rồi trả về là xong. Trường hợp này được gọi là Covering Index (chỉ mục bao phủ).

## Covering Index và Composite Index

### Covering Index (chỉ mục bao phủ)

Nếu một Index chứa (hay nói cách khác là bao phủ) giá trị của tất cả các trường cần truy vấn, chúng ta gọi đó là **Covering Index (chỉ mục bao phủ)**.

Trong storage engine InnoDB, leaf node của Index không phải Primary Key chứa giá trị của Primary Key. Điều này có nghĩa là, khi sử dụng Index không phải Primary Key để truy vấn, cơ sở dữ liệu sẽ tìm Primary Key tương ứng trước, sau đó thông qua Primary Key Index để định vị và tìm kiếm dữ liệu đầy đủ của hàng. Quá trình này được gọi là "Back to Table" (quay lại bảng).

**Covering Index tức là các trường cần truy vấn vừa đúng là các trường của Index, khi đó chỉ cần dựa vào Index đó là có thể tra được dữ liệu, không cần Back to Table.**

> Ví dụ Primary Key Index, nếu một câu SQL cần truy vấn Primary Key thì chỉ cần dựa vào Primary Key Index là tra được Primary Key. Hoặc ví dụ Index thông thường, nếu một câu SQL cần truy vấn name, và trường name vừa đúng có Index,
> thì chỉ cần dựa vào Index này là tra được dữ liệu, cũng không cần Back to Table.

![Covering Index](https://oss.javaguide.cn/github/javaguide/database/mysql20210420165341868.png)

Ở đây chúng ta sẽ đơn giản minh họa hiệu quả của Covering Index.

1. Tạo một bảng tên là `cus_order` để thực tế kiểm thử cách sắp xếp này. Để tiện cho việc kiểm thử, bảng `cus_order` chỉ có 3 trường là `id`, `score`, `name`.

```sql
CREATE TABLE `cus_order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL,
  `name` varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8mb4;
```

2. Định nghĩa một stored procedure (thủ tục lưu trữ) đơn giản để chèn 1 triệu dữ liệu kiểm thử.

```sql
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `BatchinsertDataToCusOder`(IN start_num INT,IN max_num INT)
BEGIN
      DECLARE i INT default start_num;
      WHILE i < max_num DO
          insert into `cus_order`(`id`, `score`, `name`)
          values (i,RAND() * 1000000,CONCAT('user', i));
          SET i = i + 1;
      END WHILE;
  END;;
DELIMITER ;
```

Sau khi định nghĩa stored procedure xong, chúng ta thực thi stored procedure là được!

```sql
CALL BatchinsertDataToCusOder(1, 1000000); # Chèn hơn 1 triệu dữ liệu ngẫu nhiên
```

Đợi một lát, 1 triệu dữ liệu kiểm thử sẽ được chèn xong!

3. Tạo Covering Index và sử dụng lệnh `EXPLAIN` để phân tích.

Để có thể sắp xếp 1 triệu dữ liệu này theo `score`, chúng ta cần thực thi câu lệnh SQL dưới đây.

```sql
#Sắp xếp giảm dần
SELECT `score`,`name` FROM `cus_order` ORDER BY `score` DESC;
```

Sử dụng lệnh `EXPLAIN` để phân tích câu lệnh SQL này, thông qua `Using filesort` ở cột `Extra`, chúng ta thấy rằng Covering Index chưa được sử dụng.

![](https://oss.javaguide.cn/github/javaguide/mysql/not-using-covering-index-demo.png)

Tuy nhiên điều này cũng là đương nhiên, vì hiện tại chúng ta vẫn chưa tạo Index mà!

Ở đây chúng ta tạo Composite Index trên hai trường `score` và `name`:

```sql
ALTER TABLE `cus_order` ADD INDEX id_score_name(score, name);
```

Sau khi tạo xong, dùng lệnh `EXPLAIN` để phân tích lại câu lệnh SQL này một lần nữa.

![](https://oss.javaguide.cn/github/javaguide/mysql/using-covering-index-demo.png)

Thông qua `Using index` ở cột `Extra`, có thể thấy câu lệnh SQL này đã sử dụng thành công Covering Index.

Giới thiệu chi tiết về lệnh `EXPLAIN` vui lòng xem bài viết: [Phân tích kế hoạch thực thi trong MySQL](./mysql-query-execution-plan.md).

### Composite Index (chỉ mục kết hợp)

Sử dụng nhiều trường trong bảng để tạo Index, đó chính là **Composite Index**, còn gọi là **Combined Index (chỉ mục tổ hợp)** hoặc **Composite Index (chỉ mục phức hợp)**.

Tạo Composite Index trên hai trường `score` và `name`:

```sql
ALTER TABLE `cus_order` ADD INDEX id_score_name(score, name);
```

### Nguyên tắc khớp tiền tố trái nhất (Leftmost Prefix)

Nguyên tắc khớp tiền tố trái nhất (Leftmost Prefix Matching) chỉ rằng khi sử dụng Composite Index, MySQL sẽ dựa vào thứ tự các trường trong Index, lần lượt khớp các trường trong điều kiện truy vấn từ trái sang phải. Nếu điều kiện truy vấn khớp với trường ngoài cùng bên trái của Index, thì MySQL sẽ sử dụng Index để lọc dữ liệu, như vậy có thể nâng cao hiệu quả truy vấn.

Nguyên tắc khớp trái nhất sẽ tiếp tục khớp sang phải cho đến khi gặp truy vấn phạm vi (như >, <). Đối với các truy vấn phạm vi như >=, <=, BETWEEN và khớp tiền tố LIKE, việc khớp sẽ không dừng lại.

Giả sử có một Composite Index `(column1, column2, column3)`, tất cả các tiền tố từ trái sang phải của nó là `(column1)`, `(column1, column2)`, `(column1, column2, column3)` (tạo 1 Composite Index tương đương với tạo 3 Index), tất cả các truy vấn chứa những cột này đều sẽ đi qua Index mà không quét toàn bảng.

Khi sử dụng Composite Index, chúng ta có thể đặt trường có độ phân biệt (cardinality) cao ở ngoài cùng bên trái, điều này cũng giúp lọc được nhiều dữ liệu hơn.

Ở đây chúng ta sẽ đơn giản minh họa hiệu quả của khớp tiền tố trái nhất.

1. Tạo một bảng tên là `student`, bảng này chỉ có 3 trường là `id`, `name`, `class`.

```sql
CREATE TABLE `student` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `class` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name_class_idx` (`name`,`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

2. Dưới đây chúng ta lần lượt kiểm thử ba câu lệnh SQL khác nhau.

![](https://oss.javaguide.cn/github/javaguide/database/mysql/leftmost-prefix-matching-rule.png)

```sql
# Có thể trúng Index
SELECT * FROM student WHERE name = 'Anne Henry';
EXPLAIN SELECT * FROM student WHERE name = 'Anne Henry' AND class = 'lIrm08RYVk';
# Không thể trúng Index
SELECT * FROM student WHERE class = 'lIrm08RYVk';
```

Hãy xem thêm một câu hỏi phỏng vấn thường gặp: nếu có `Composite Index (a, b, c)`, truy vấn `a=1 AND c=1` có đi qua Index không? Còn `c=1` thì sao? Còn `b=1 AND c=1` thì sao? Còn `b = 1 AND a = 1 AND c = 1` thì sao?

Đừng vội xem đáp án bên dưới, hãy dành cho mình 3 phút để suy nghĩ.

1. Truy vấn `a=1 AND c=1`: Theo nguyên tắc khớp tiền tố trái nhất, truy vấn có thể sử dụng phần tiền tố của Index. Vì vậy, truy vấn này chỉ sử dụng Index trên `a=1`, sau đó lọc kết quả theo `c=1`.
2. Truy vấn `c=1`: Do truy vấn không chứa cột ngoài cùng bên trái `a`, theo nguyên tắc khớp tiền tố trái nhất, toàn bộ Index không thể được sử dụng.
3. Truy vấn `b=1 AND c=1`: Cùng tình huống với trường hợp thứ hai, toàn bộ Index không được sử dụng.
4. Truy vấn `b=1 AND a=1 AND c=1`: Truy vấn này có thể sử dụng Index. Khi query optimizer phân tích câu lệnh SQL, đối với Composite Index, sẽ sắp xếp lại các điều kiện truy vấn để tận dụng Index. Điều kiện `b=1` và `a=1` sẽ được sắp xếp lại, trở thành `a=1 AND b=1 AND c=1`.

Phiên bản MySQL 8.0.13 đã giới thiệu Index Skip Scan (quét nhảy Index, viết tắt là ISS), nó có thể nâng cao hiệu quả truy vấn trong một số tình huống truy vấn Index nhất định. Trước khi có ISS, các truy vấn Composite Index không thỏa mãn nguyên tắc khớp tiền tố trái nhất sẽ thực hiện quét toàn bảng. Còn ISS cho phép MySQL tránh quét toàn bảng trong một số trường hợp, ngay cả khi điều kiện truy vấn không khớp tiền tố trái nhất. Tuy nhiên, tính năng này khá "vô dụng" (ít hữu dụng), không thể so sánh với trong Oracle, và MySQL 8.0.31 còn báo cáo một bug: [Bug #109145 Using index for skip scan cause incorrect result](https://bugs.mysql.com/bug.php?id=109145) (đã được sửa trong các phiên bản sau). Cá nhân tôi khuyên chỉ cần biết có tính năng này là được, không cần đi sâu, trong dự án thực tế cũng chưa chắc dùng đến.

## Index Condition Pushdown (đẩy điều kiện xuống Index)

**Index Condition Pushdown (đẩy điều kiện xuống Index, viết tắt là ICP)** là một tính năng tối ưu Index được cung cấp từ phiên bản **MySQL 5.6**, nó cho phép storage engine trong quá trình duyệt Index thực thi một phần điều kiện trong mệnh đề `WHERE`, trực tiếp lọc bỏ các bản ghi không thỏa mãn điều kiện, từ đó giảm số lần Back to Table và nâng cao hiệu quả truy vấn.

Giả sử chúng ta có một bảng tên là `user`, trong đó có 4 trường `id`, `username`, `zipcode` và `birthdate`, đã tạo Composite Index `(zipcode, birthdate)`.

```sql
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `zipcode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `birthdate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_zipcode_birthdate` (`zipcode`,`birthdate`) ) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4;

# Truy vấn người dùng có zipcode là 431200 và sinh nhật trong tháng 3
SELECT * FROM user WHERE zipcode = '431200' AND MONTH(birthdate) = 3;
```

- Trước khi có Index Condition Pushdown, dù trường `zipcode` sử dụng Index có thể giúp chúng ta nhanh chóng định vị người dùng có `zipcode = '431200'`, nhưng chúng ta vẫn cần thực hiện thao tác Back to Table cho từng người dùng tìm được để lấy dữ liệu người dùng đầy đủ, rồi mới phán đoán `MONTH(birthdate) = 3`.
- Sau khi có Index Condition Pushdown, storage engine sẽ đồng thời phán đoán `MONTH(birthdate) = 3` trong khi sử dụng Index của trường `zipcode` để tìm người dùng có `zipcode = '431200'`. Như vậy, chỉ những bản ghi đồng thời thỏa mãn điều kiện mới được trả về, giảm số lần Back to Table.

![](https://oss.javaguide.cn/github/javaguide/database/mysql/index-condition-pushdown.png)

![](https://oss.javaguide.cn/github/javaguide/database/mysql/index-condition-pushdown-graphic-illustration.png)

Tiếp theo chúng ta sẽ nói về nguyên lý cụ thể của Index Condition Pushdown, trước tiên hãy xem sơ đồ kiến trúc tóm tắt của MySQL dưới đây.

![](https://oss.javaguide.cn/javaguide/13526879-3037b144ed09eb88.png)

MySQL có thể được chia đơn giản thành hai tầng: tầng Server và tầng storage engine. Tầng Server xử lý các thao tác như phân giải, phân tích, tối ưu hóa, cache truy vấn và tương tác với client, còn tầng storage engine chịu trách nhiệm lưu trữ và đọc dữ liệu, MySQL hỗ trợ nhiều storage engine như InnoDB, MyISAM, Memory, v.v.

**Pushdown (đẩy xuống)** trong Index Condition Pushdown thực chất là chỉ việc chuyển một phần công việc vốn do tầng trên (tầng Server) đảm nhận xuống cho tầng dưới (tầng storage engine) xử lý.

Ở đây chúng ta kết hợp nguyên lý Index Condition Pushdown để giải thích lại ví dụ đã nêu ở trên.

Trước khi có Index Condition Pushdown:

- Tầng storage engine trước tiên dựa vào trường Index `zipcode` để tìm tất cả Primary Key ID của người dùng có `zipcode = '431200'`, sau đó thực hiện Back to Table lần hai để lấy dữ liệu người dùng đầy đủ;
- Tầng storage engine chuyển toàn bộ dữ liệu người dùng có `zipcode = '431200'` lên tầng Server, tầng Server dựa vào điều kiện `MONTH(birthdate) = 3` để lọc thêm một lần nữa.

Sau khi có Index Condition Pushdown:

- Tầng storage engine trước tiên dựa vào trường Index `zipcode` để tìm tất cả người dùng có `zipcode = '431200'`, sau đó trực tiếp phán đoán `MONTH(birthdate) = 3`, lọc ra các Primary Key ID thỏa mãn điều kiện;
- Back to Table lần hai, dựa vào các Primary Key ID thỏa mãn điều kiện để lấy dữ liệu người dùng đầy đủ;
- Tầng storage engine chuyển toàn bộ dữ liệu người dùng thỏa mãn điều kiện lên tầng Server.

Có thể thấy, **ngoài việc giảm số lần Back to Table, Index Condition Pushdown còn có thể giảm lượng dữ liệu truyền giữa tầng storage engine và tầng Server.**

Cuối cùng, tổng kết phạm vi áp dụng của Index Condition Pushdown:

1. Áp dụng cho truy vấn của engine InnoDB và engine MyISAM.
2. Áp dụng cho các truy vấn phạm vi có kế hoạch thực thi là range, ref, eq_ref, ref_or_null.
3. Đối với bảng InnoDB, chỉ dùng cho Non-Clustered Index. Mục tiêu của Index Condition Pushdown là giảm số lần đọc toàn bộ hàng, từ đó giảm thao tác I/O. Đối với Clustered Index của InnoDB, bản ghi đầy đủ đã được đọc vào InnoDB buffer. Trong trường hợp này, sử dụng Index Condition Pushdown sẽ không giảm được I/O.
4. Subquery (truy vấn con) không thể sử dụng Index Condition Pushdown, vì subquery thường tạo bảng tạm (temporary table) để xử lý kết quả, mà những bảng tạm này không có Index.
5. Stored procedure (thủ tục lưu trữ) không thể sử dụng Index Condition Pushdown, vì storage engine không thể gọi stored function (hàm lưu trữ).

## Một số gợi ý để sử dụng Index đúng cách

### Chọn trường phù hợp để tạo Index

- **Trường không NULL**: Dữ liệu của trường Index nên cố gắng không NULL, vì đối với các trường có dữ liệu NULL, cơ sở dữ liệu khá khó tối ưu hóa. Nếu trường thường xuyên được truy vấn nhưng không thể tránh khỏi NULL, nên sử dụng các giá trị ngắn có ngữ nghĩa rõ ràng như 0, 1, true, false để thay thế.
- **Trường được truy vấn thường xuyên**: Trường chúng ta tạo Index nên là trường được sử dụng rất thường xuyên trong các thao tác truy vấn.
- **Trường được dùng làm điều kiện truy vấn**: Trường được dùng làm điều kiện truy vấn WHERE nên được cân nhắc tạo Index.
- **Trường thường xuyên cần sắp xếp**: Index đã được sắp xếp sẵn, như vậy truy vấn có thể tận dụng thứ tự của Index để tăng tốc thời gian sắp xếp trong truy vấn.
- **Trường thường xuyên được dùng để join**: Trường thường được dùng để join có thể là một số cột khóa ngoại (foreign key), đối với cột khóa ngoại không nhất thiết phải tạo foreign key, chỉ là cột đó liên quan đến mối quan hệ giữa các bảng. Đối với trường thường xuyên được dùng trong truy vấn join, có thể cân nhắc tạo Index để nâng cao hiệu quả truy vấn join nhiều bảng.

### Tránh Index mất hiệu lực

Index mất hiệu lực cũng là một trong những nguyên nhân chính gây ra truy vấn chậm (slow query), các tình huống thường gặp khiến Index mất hiệu lực gồm hai loại dưới đây:

**1. Cách viết SQL xung đột với logic bên dưới (phá vỡ tính có thứ tự của B+Tree)**

Loại vấn đề này phổ biến nhất, bản chất là điều kiện truy vấn khiến B+Tree bên dưới mất đi khả năng định vị nhanh bằng "tìm kiếm nhị phân".

- **Vi phạm nguyên tắc tiền tố trái nhất**: Bỏ qua cột dẫn đầu (leading column) của Composite Index, hoặc gặp truy vấn phạm vi (như `>`, `<`, `BETWEEN`, `LIKE "abc%"`) khiến các cột tiếp theo bị gián đoạn khả năng định vị chính xác, bị giáng cấp thành quét phạm vi kèm lọc.
- **Xử lý trên cột Index**: Thực hiện tính toán số học hoặc áp dụng hàm lên cột Index ở vế trái của `WHERE`, khiến dữ liệu gốc bị thay đổi về mặt logic, trở nên vô thứ tự trong cây Index.
- **Chuyển đổi kiểu ngầm định (ẩn và chết người)**: Khi "cột kiểu chuỗi" so sánh với "giá trị kiểu số", MySQL sẽ mặc định áp hàm chuyển đổi lên cột, trực tiếp phá vỡ tính có thứ tự của cây.
- **Ký tự đại diện đứng trước trong truy vấn mờ LIKE**: Như `LIKE "%abc"`, tính không xác định của ký tự tiền tố khiến optimizer không thể xác định điểm bắt đầu của vùng quét.
- **Bẫy sắp xếp ORDER BY**: Cột sắp xếp không trúng Index, hướng sắp xếp không khớp với cấu trúc Index, v.v. sẽ kích hoạt sắp xếp bổ sung trong bộ nhớ hoặc trên đĩa (`Using filesort`).

**2. Quyết định chi phí của optimizer (sự đánh đổi dựa trên chi phí I/O)**

Loại vấn đề này không phải bản thân Index không dùng được, mà là optimizer của MySQL sau khi tính toán cho rằng "không đi qua Index thông thường" thì tổng chi phí lại nhỏ hơn.

- **`SELECT \*` vô tội vạ khiến chi phí Back to Table quá tải**: Khi truy vấn nhiều cột không được Index bao phủ, nếu lượng dữ liệu trúng khá lớn (thường vượt quá 20%~30%), optimizer sẽ phán đoán I/O tuần tự của quét toàn bảng tốt hơn I/O ngẫu nhiên của việc Back to Table thường xuyên, từ đó chủ động từ bỏ Index.
- **Điều kiện `OR` dẫn đến quét toàn bảng**: Chỉ cần một trong hai phía của điều kiện nối bằng `OR` không có Index tương ứng, sẽ kích hoạt quét toàn bảng. Ngay cả khi cả hai phía đều có Index, nếu chi phí dự kiến của Index Merge (gộp Index) quá cao, vẫn sẽ bị từ bỏ.
- **Danh sách `IN` quá dài gây sai lệch ước lượng**: Khi độ dài danh sách `IN` vượt ngưỡng hệ thống (mặc định 200), optimizer sẽ chuyển từ thăm dò chính xác (Index Dive) sang ước lượng thống kê thô, rất dễ do thông tin thống kê lỗi thời mà phán đoán sai chi phí thực thi.

Giới thiệu chi tiết: [Tổng kết các tình huống Index mất hiệu lực trong MySQL](https://javaguide.cn/database/mysql/mysql-index-invalidation.html).

### Trường thường xuyên được cập nhật nên cân nhắc kỹ trước khi tạo Index

Mặc dù Index mang lại hiệu quả cho truy vấn, nhưng chi phí bảo trì Index cũng không nhỏ. Nếu một trường không thường được truy vấn mà lại thường xuyên bị sửa đổi, thì càng không nên tạo Index trên trường đó.

### Giới hạn số lượng Index trên mỗi bảng

Index không phải càng nhiều càng tốt, nên giữ số Index trên một bảng không vượt quá 5! Index có thể tăng hiệu quả, nhưng cũng có thể giảm hiệu quả.

Index có thể tăng hiệu quả truy vấn, nhưng cũng sẽ giảm hiệu quả của thao tác chèn và cập nhật, thậm chí trong một số trường hợp còn giảm hiệu quả truy vấn.

Vì khi MySQL optimizer chọn cách tối ưu truy vấn, sẽ dựa vào thông tin thống kê để đánh giá từng Index có thể sử dụng được, nhằm tạo ra một kế hoạch thực thi tốt nhất, nếu đồng thời có rất nhiều Index đều có thể dùng cho truy vấn, sẽ làm tăng thời gian MySQL optimizer tạo ra kế hoạch thực thi, cũng sẽ làm giảm hiệu năng truy vấn.

### Ưu tiên cân nhắc tạo Composite Index thay vì Index một cột

Vì Index cần chiếm không gian đĩa, có thể hiểu đơn giản là mỗi Index đều tương ứng với một cây B+ Tree. Nếu một bảng có quá nhiều trường, quá nhiều Index, thì khi dữ liệu của bảng này đạt đến một quy mô nhất định, không gian mà Index chiếm dụng cũng rất nhiều, và khi sửa đổi Index, thời gian tiêu tốn cũng khá lớn. Nếu là Composite Index, nhiều trường nằm trên một Index, sẽ tiết kiệm được rất nhiều không gian đĩa, và hiệu quả của thao tác sửa đổi dữ liệu cũng được nâng cao.

### Chú ý tránh Index dư thừa

Index dư thừa chỉ các Index có chức năng giống nhau, nếu đã trúng Index(a, b) thì chắc chắn sẽ trúng Index(a), vậy Index(a) chính là Index dư thừa. Ví dụ hai Index (name,city) và (name) chính là Index dư thừa, truy vấn nào đã trúng Index trước thì chắc chắn sẽ trúng Index sau. Trong hầu hết trường hợp, nên cố gắng mở rộng Index đã có thay vì tạo Index mới.

### Trường kiểu chuỗi nên dùng Prefix Index thay cho Index thông thường

Prefix Index chỉ giới hạn ở kiểu chuỗi, chiếm ít không gian hơn so với Index thông thường, vì vậy có thể cân nhắc dùng Prefix Index thay cho Index thông thường.

### Xóa Index lâu ngày không được sử dụng

Xóa Index lâu ngày không được sử dụng, sự tồn tại của Index không dùng đến sẽ gây ra hao tổn hiệu năng không cần thiết.

MySQL 5.7 có thể truy vấn những Index nào chưa bao giờ được sử dụng thông qua view `schema_unused_indexes` trong cơ sở dữ liệu `sys`.

### Biết cách phân tích câu lệnh SQL có đi qua Index hay không

Chúng ta có thể sử dụng lệnh `EXPLAIN` để phân tích **kế hoạch thực thi (Execution Plan)** của SQL, như vậy sẽ biết câu lệnh có trúng Index hay không. Kế hoạch thực thi là cách thực thi cụ thể của một câu lệnh SQL sau khi được bộ tối ưu hóa truy vấn (query optimizer) của MySQL tối ưu hóa.

`EXPLAIN` không thực sự thực thi câu lệnh liên quan, mà thông qua **bộ tối ưu hóa truy vấn** để phân tích câu lệnh, tìm ra phương án truy vấn tối ưu nhất và hiển thị thông tin tương ứng.

Định dạng đầu ra của `EXPLAIN` như sau:

```sql
mysql> EXPLAIN SELECT `score`,`name` FROM `cus_order` ORDER BY `score` DESC;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra          |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
|  1 | SIMPLE      | cus_order | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 997572 |   100.00 | Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
1 row in set, 1 warning (0.00 sec)
```

Ý nghĩa của từng trường như sau:

| **Tên cột**   | **Ý nghĩa**                                                  |
| ------------- | ------------------------------------------------------------ |
| id            | Số thứ tự định danh của truy vấn SELECT                     |
| select_type   | Loại truy vấn tương ứng với từ khóa SELECT                   |
| table         | Tên bảng được sử dụng                                        |
| partitions    | Partition khớp, đối với bảng không phân vùng, giá trị là NULL |
| type          | Phương thức truy cập bảng                                    |
| possible_keys | Index có thể được sử dụng                                    |
| key           | Index thực tế được sử dụng                                   |
| key_len       | Độ dài của Index được chọn                                   |
| ref           | Khi truy vấn đẳng trị bằng Index, cột hoặc hằng số được so sánh với Index |
| rows          | Số hàng dự kiến cần đọc                                      |
| filtered      | Tỷ lệ phần trăm số bản ghi còn lại sau khi lọc theo điều kiện bảng |
| Extra         | Thông tin bổ sung                                            |

Vì giới hạn về độ dài, ở đây tôi chỉ giới thiệu đơn giản về kế hoạch thực thi của MySQL, giới thiệu chi tiết vui lòng xem bài viết: [Phân tích kế hoạch thực thi trong MySQL](./mysql-query-execution-plan.md).

## Đọc thêm về cấu trúc dữ liệu

Khi tìm hiểu Index trong MySQL, nên quay lại bản thân cấu trúc cây để xem qua một lượt:

- [Giải thích chi tiết cấu trúc cây](../../cs-basics/data-structure/tree.md): So sánh cây tìm kiếm nhị phân, AVL, cây đỏ đen, B Tree và B+ Tree.
- [Giải thích chi tiết cây đỏ đen](../../cs-basics/data-structure/red-black-tree.md): Hiểu sự đánh đổi của cây tìm kiếm tự cân bằng trong bộ nhớ, rồi so sánh vì sao B+ Tree phù hợp hơn cho Index trên đĩa.

<!-- @include: @article-footer.snippet.md -->
