---
title: Tại sao Redis dùng Skip List để cài đặt Sorted Set
description: Giải thích chi tiết lý do Sorted Set (Zset) của Redis chọn Skip List thay vì Red-Black Tree hay B+ Tree, phân tích nguyên lý cấu trúc dữ liệu của Skip List, độ phức tạp thời gian và cài đặt trong mã nguồn Redis.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis Skip List,SkipList,Sorted Set,Zset,Nguyên lý Skip List,So sánh cây cân bằng,Cấu trúc dữ liệu Redis
---

## Mở đầu

Trong vài năm gần đây, khi phỏng vấn Redis thường đề cập đến thiết kế tầng dưới (underlying design) của các cấu trúc dữ liệu phổ biến, trong đó có một câu hỏi phỏng vấn khá thú vị: "Tại sao tầng dưới của Sorted Set trong Redis lại dùng Skip List mà không dùng cây cân bằng (balanced tree), Red-Black Tree hay B+ Tree?".

Bài viết này lấy câu hỏi phỏng vấn thường gặp ở các công ty lớn này làm điểm khởi đầu, giúp bạn đọc hiểu chi tiết về cấu trúc dữ liệu Skip List.

Nếu bạn chỉ muốn tìm hiểu nhanh về chỉ mục đa cấp (multi-level index), độ phức tạp truy vấn và khung trả lời phỏng vấn của Skip List, bạn có thể đọc trước [Tổng hợp câu hỏi phỏng vấn về Skip List](../../cs-basics/data-structure/skip-list.md), rồi quay lại bài này để xem cài đặt mã nguồn của Redis ZSet.

Toàn bộ mạch nội dung của bài viết được thể hiện như hình dưới đây. Tác giả sẽ đi từ cách sử dụng cơ bản của Sorted Set đến phân tích và cài đặt mã nguồn của Skip List, giúp bạn có hiểu biết sâu sắc và nắm vững hơn về Skip List - cấu trúc cài đặt tầng dưới của Sorted Set trong Redis.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005468.png)

## Ứng dụng của Skip List trong Redis

Trước tiên, chúng ta cần tìm hiểu cách sử dụng của Sorted Set - cấu trúc dữ liệu trong Redis có dùng đến Skip List. Redis có một cấu trúc dữ liệu khá thường dùng gọi là **Sorted Set (tập hợp có thứ tự, viết tắt là zset)**. Đúng như tên gọi, đây là một tập hợp đảm bảo có thứ tự và các phần tử là duy nhất, nên nó thường được dùng cho các kịch bản cần thống kê, xếp hạng như bảng xếp hạng (leaderboard).

Ở đây, chúng ta sẽ minh họa việc cài đặt bảng xếp hạng thông qua dòng lệnh. Có thể thấy tác giả lần lượt nhập 3 người dùng: **xiaoming**, **xiaohong**, **xiaowang**, với **score** lần lượt là 60, 80, 60, cuối cùng được sắp xếp theo điểm số giảm dần.

```bash

127.0.0.1:6379> zadd rankList 60 xiaoming
(integer) 1
127.0.0.1:6379> zadd rankList 80 xiaohong
(integer) 1
127.0.0.1:6379> zadd rankList 60 xiaowang
(integer) 1

# Trả về các thành viên trong khoảng chỉ định của sorted set, theo index, điểm số từ cao xuống thấp
127.0.0.1:6379> ZREVRANGE rankList 0 100 WITHSCORES
1) "xiaohong"
2) "80"
3) "xiaowang"
4) "60"
5) "xiaoming"
6) "60"
```

Lúc này, chúng ta dùng lệnh `object` để xem cấu trúc dữ liệu của zset, có thể thấy Sorted Set hiện tại vẫn được lưu trữ dưới dạng **ziplist (Zip List - danh sách nén)**.

```bash
127.0.0.1:6379> object encoding rankList
"ziplist"
```

Vì người thiết kế cân nhắc rằng dữ liệu Redis được lưu trữ trong bộ nhớ, để tiết kiệm không gian bộ nhớ quý giá, khi phần tử của Sorted Set nhỏ hơn 64 byte và số lượng ít hơn 128, ziplist sẽ được sử dụng. Giá trị mặc định của ngưỡng này đến từ hai cấu hình dưới đây.

```bash
zset-max-ziplist-value 64
zset-max-ziplist-entries 128
```

Một khi phần tử nào đó trong Sorted Set vượt quá một trong hai ngưỡng này, nó sẽ chuyển sang **skiplist** (thực tế là dict + skiplist, đồng thời mượn thêm dictionary để nâng cao hiệu quả khi lấy phần tử chỉ định).

Chúng ta hãy thử thêm một phần tử lớn hơn 64 byte, có thể thấy lưu trữ tầng dưới của Sorted Set chuyển sang skiplist.

```bash
127.0.0.1:6379> zadd rankList 90 yigemingzihuichaoguo64zijiedeyonghumingchengyongyuceshitiaobiaodeshijiyunyong
(integer) 1

# Vượt quá ngưỡng, chuyển sang skip list
127.0.0.1:6379> object encoding rankList
"skiplist"
```

Nói cách khác, ZSet có hai loại cài đặt khác nhau, lần lượt là ziplist và skiplist. Quy tắc cụ thể về việc dùng cấu trúc nào để lưu trữ như sau:

- Khi đối tượng Sorted Set đồng thời thỏa mãn hai điều kiện sau, sử dụng ziplist:
  1. Số lượng cặp key-value mà ZSet lưu trữ ít hơn 128;
  2. Độ dài của mỗi phần tử nhỏ hơn 64 byte.
- Nếu không thỏa mãn hai điều kiện trên, sử dụng skiplist.

## Tự tay viết một Skip List

Để trả lời tốt hơn câu hỏi ở trên cũng như hiểu và nắm vững Skip List hơn, chúng ta có thể tự tay viết một Skip List đơn giản để giúp bạn đọc hiểu cấu trúc dữ liệu này.

Chúng ta đều biết rằng linked list có thứ tự (ordered linked list) có thời gian trung bình cho các thao tác thêm, truy vấn, xóa đều là **O(n)**, tức tăng tuyến tính. Vì vậy, một khi số lượng node đạt đến một quy mô nhất định, hiệu năng của nó sẽ rất kém. Còn với Skip List, chúng ta hoàn toàn có thể hiểu là trên cơ sở linked list gốc, xây dựng thêm chỉ mục đa cấp, thông qua việc tra cứu và định vị bằng chỉ mục đa cấp để đưa độ phức tạp thời gian của các thao tác thêm, xóa, sửa, tra cứu về **O(log n)**.

Có thể nói như vậy hơi trừu tượng, chúng ta hãy xem một ví dụ. Với Skip List trong hình dưới đây, linked list gốc của nó lưu trữ theo thứ tự các số từ 1 đến 10, có 2 cấp chỉ mục, số lượng chỉ mục ở mỗi cấp đều bằng một nửa số phần tử của tầng bên dưới.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005436.png)

Giả sử chúng ta cần truy vấn phần tử 6, quy trình làm việc của nó như sau:

1. Bắt đầu từ chỉ mục cấp 2, trước tiên đi đến node 4.
2. Xem node kế tiếp (successor node) của 4, đó là chỉ mục cấp 2 của 8. Giá trị này lớn hơn 6, nghĩa là các chỉ mục tiếp theo sau chỉ mục cấp 2 đều lớn hơn 6, không cần tìm kiếm thêm nữa, chúng ta di chuyển chỉ mục xuống dưới để tìm.
3. Đi đến chỉ mục cấp 1 của 4, so sánh node kế tiếp của nó là 6, kết thúc tìm kiếm.

So với linked list có thứ tự gốc cần đến 6 lần, Skip List của chúng ta thông qua việc xây dựng chỉ mục đa cấp, chỉ cần 2 lần đã định vị trực tiếp được phần tử mục tiêu, độ phức tạp truy vấn được tối ưu trực tiếp thành **O(log n)**.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005524.png)

Thao tác thêm tương ứng cũng cùng một nguyên lý. Giả sử chúng ta cần thêm phần tử 7 vào Sorted Set này, chúng ta cần thông qua Skip List để tìm **giá trị lớn nhất nhỏ hơn phần tử 7**, tức vị trí của phần tử 6 trong hình dưới đây, chèn nó vào sau phần tử 6, để chỉ mục của phần tử 6 trỏ đến node 7 mới chèn. Quy trình làm việc như sau:

1. Bắt đầu từ chỉ mục cấp 2, định vị đến chỉ mục của phần tử 4.
2. Xem chỉ mục kế tiếp của chỉ mục 4 là 8, chỉ mục tiếp tục tiến xuống dưới.
3. Đi đến chỉ mục cấp 1, phát hiện chỉ mục kế tiếp của chỉ mục 4 là 6, nhỏ hơn phần tử chèn 7, con trỏ tiến đến vị trí chỉ mục 6.
4. Tiếp tục so sánh node kế tiếp của 6 là chỉ mục 8, lớn hơn phần tử 7, chỉ mục tiếp tục đi xuống.
5. Cuối cùng chúng ta đi đến node gốc của 6, phát hiện node kế tiếp của nó là 7, con trỏ không còn không gian để đi xuống nữa. Từ đó ta biết phần tử 6 chính là giá trị lớn nhất nhỏ hơn phần tử chèn 7, vì vậy chèn phần tử 7 vào.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005480.png)

Ở đây chúng ta lại gặp một vấn đề, liệu có cần xây dựng chỉ mục cho phần tử 7 không, chỉ mục cao bao nhiêu là phù hợp?

Phần trên chúng ta đã đề cập, trường hợp lý tưởng là mỗi tầng chỉ mục có số phần tử bằng một nửa số phần tử của tầng bên dưới. Giả sử chúng ta có tổng cộng 16 phần tử, số phần tử tương ứng ở mỗi cấp chỉ mục sẽ là:

```bash
1. 一级索引:16/2=8
2. 二级索引:8/2 =4
3. 三级索引:4/2=2
```

Từ đó, dùng phương pháp quy nạp toán học ta có:

```bash
1. 一级索引:16/2=16/2^1=8
2. 二级索引:8/2 => 16/2^2 =4
3. 三级索引:4/2=>16/2^3=2
```

Giả sử số phần tử là n, vậy công thức tính số phần tử r tương ứng ở tầng chỉ mục thứ k là:

```bash
r=n/2^k
```

Tương tự, chúng ta suy luận chiều cao tối đa của chỉ mục. Thông thường số phần tử ở chỉ mục cấp cao nhất là 2. Ta đặt tổng số phần tử là n, chiều cao chỉ mục là h, thay vào công thức trên ta được:

```bash
2= n/2^h
=> 2*2^h=n
=> 2^(h+1)=n
=> h+1=log2^n
=> h=log2^n -1
```

Redis lại là cơ sở dữ liệu trong bộ nhớ, chúng ta giả sử số phần tử tối đa là **65536**, thay **65536** vào công thức trên ta thấy chiều cao tối đa là 16. Vì vậy, chúng ta khuyến nghị sau khi thêm một phần tử, chiều cao chỉ mục được xây dựng cho nó không vượt quá 16.

Vì chúng ta cần đảm bảo tốt nhất là mỗi chỉ mục cấp trên bằng một nửa chỉ mục cấp dưới, khi cài đặt thuật toán sinh chiều cao, chúng ta có thể thiết kế như sau:

1. Việc tính chiều cao của Skip List bắt đầu từ linked list gốc, tức mặc định chiều cao của phần tử được chèn là 1, đại diện không có chỉ mục, chỉ có node phần tử.
2. Thiết kế một phương thức sinh chiều cao chỉ mục level cho phần tử được chèn.
3. Thực hiện một phép toán ngẫu nhiên, giá trị ngẫu nhiên nằm trong khoảng 0-1.
4. Nếu số ngẫu nhiên lớn hơn 0.5 thì thêm một cấp chỉ mục cho phần tử hiện tại. Như vậy chúng ta đảm bảo xác suất sinh chỉ mục cấp 1 là **50%**, điều này cũng đảm bảo rằng trong trường hợp lý tưởng, chỉ mục cấp 1 chỉ có một nửa số phần tử được sinh chỉ mục.
5. Tương tự, mỗi lần giá trị thu được từ thuật toán ngẫu nhiên lớn hơn 0.5, chiều cao chỉ mục tăng thêm 1. Như vậy có thể đảm bảo xác suất sinh chỉ mục cấp 2 của node là **25%**, chỉ mục cấp 3 là **12.5%**...

Quay lại ví dụ trên, sau khi chèn 7, thông qua thuật toán ngẫu nhiên chúng ta được 2, tức cần xây dựng chỉ mục cấp 1 cho nó:

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005505.png)

Cuối cùng, chúng ta nói về thao tác xóa. Giả sử chúng ta cần xóa phần tử 10, chúng ta phải định vị giá trị lớn nhất nhỏ hơn 10 ở **mỗi tầng** của Skip List hiện tại. Các bước thực hiện chỉ mục như sau:

1. Node kế tiếp của chỉ mục cấp 2 là 4 là 8, con trỏ tiến lên.
2. Chỉ mục 8 không có node kế tiếp, tầng này không có phần tử cần xóa, con trỏ đi thẳng xuống dưới.
3. Node kế tiếp của chỉ mục cấp 1 là 8 là 10, nghĩa là chỉ mục cấp 1 là 8 khi thực hiện xóa cần ngắt liên kết giữa con trỏ của nó và chỉ mục cấp 1 là 10, xóa 10 đi.
4. Sau khi chỉ mục cấp 1 định vị xong, con trỏ đi xuống, node kế tiếp là 9, con trỏ tiến lên.
5. Node kế tiếp của 9 là 10, tương tự cần cho nó trỏ đến null, xóa 10 đi.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005503.png)

### Định nghĩa mẫu

Sau khi có ý tưởng tổng thể, chúng ta có thể bắt đầu cài đặt một Skip List. Trước tiên định nghĩa **Node** trong Skip List. Từ các minh họa ở trên có thể thấy mỗi **Node** đều bao gồm các thành phần sau:

1. Giá trị **value** được lưu trữ.
2. Địa chỉ của node kế tiếp.
3. Chỉ mục đa cấp.

Để thống nhất quản lý địa chỉ node kế tiếp của **Node** và địa chỉ phần tử mà chỉ mục đa cấp trỏ đến, tác giả thiết lập trong **Node** một mảng **forwards**, dùng để ghi lại node kế tiếp của node linked list gốc và node kế tiếp mà chỉ mục đa cấp trỏ đến.

Lấy hình dưới đây làm ví dụ, mảng **forwards** của chúng ta có độ dài 5, trong đó **index 0** ghi lại địa chỉ node kế tiếp của node linked list gốc, còn lại từ dưới lên trên biểu thị node kế tiếp từ chỉ mục cấp 1 đến chỉ mục cấp 4.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005347.png)

Như vậy chúng ta có định nghĩa code như sau. Có thể thấy tác giả đặt độ dài mảng là cố định 16 **(phần trên đã suy luận khuyến nghị chiều cao tối đa là 16)**, mặc định **data** là -1, chiều cao tối đa của node **maxLevel** được khởi tạo là 1. Lưu ý giá trị **maxLevel** này đại diện cho tổng chiều cao của linked list gốc cộng với chỉ mục.

```java
/**
 * Chiều cao tối đa của chỉ mục Skip List là 16
 */
private static final int MAX_LEVEL = 16;

class Node {
    private int data = -1;
    private Node[] forwards = new Node[MAX_LEVEL];
    private int maxLevel = 0;

}
```

### Thêm phần tử

Sau khi định nghĩa node xong, trước tiên chúng ta cài đặt thao tác thêm phần tử. Khi thêm phần tử, bước đầu tiên đương nhiên là thiết lập **data**, bước này chúng ta trực tiếp lấy **value** truyền vào gán cho **data**.

Tiếp theo là thiết lập chiều cao **maxLevel**. Phần trên chúng ta đã đưa ra ý tưởng, chiều cao mặc định là 1, tức chỉ có một node linked list gốc, thông qua thuật toán ngẫu nhiên mỗi lần lớn hơn 0.5 thì chiều cao chỉ mục tăng 1. Từ đó ta có thuật toán tính chiều cao `randomLevel()`:

```java
/**
 * Về lý thuyết, số phần tử trong chỉ mục cấp 1 nên chiếm 50% dữ liệu gốc, chỉ mục cấp 2 chiếm 25%, chỉ mục cấp 3 chiếm 12.5%, cho đến tầng cao nhất.
 * Vì ở đây xác suất thăng cấp của mỗi tầng là 50%. Với mỗi node mới được chèn, đều cần gọi randomLevel để sinh ra số tầng hợp lý.
 * Phương thức randomLevel này sẽ sinh ngẫu nhiên một số trong khoảng 1~MAX_LEVEL, và:
 * Xác suất 50% trả về 1
 * Xác suất 25% trả về 2
 * Xác suất 12.5% trả về 3 ...
 * @return
 */
private int randomLevel() {
    int level = 1;
    while (Math.random() > PROB && level < MAX_LEVEL) {
        ++level;
    }
    return level;
}
```

Sau đó thiết lập địa chỉ node kế tiếp của **Node** cần chèn hiện tại và chỉ mục của **Node**. Bước này hơi phức tạp một chút. Chúng ta giả sử chiều cao của node hiện tại là 4, tức 1 node cộng 3 chỉ mục, vì vậy chúng ta tạo một mảng **maxOfMinArr** có độ dài 4, duyệt qua các node chỉ mục ở mỗi tầng để tìm giá trị lớn nhất nhỏ hơn **value** hiện tại.

Giả sử **value** cần chèn là 5, kết quả tìm kiếm trong mảng của chúng ta là node tiền nhiệm (predecessor node) của node hiện tại và node tiền nhiệm của chỉ mục cấp 1, chỉ mục cấp 2 đều là 4, chỉ mục cấp 3 là trống.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005299.png)

Sau đó, dựa vào mảng **maxOfMinArr** này, chúng ta định vị node kế tiếp ở mỗi tầng, để phần tử chèn 5 trỏ đến các node kế tiếp này, còn **maxOfMinArr** trỏ đến 5. Kết quả như hình dưới:

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005369.png)

Chuyển thành code sẽ có dạng như dưới đây, có phải rất đơn giản không? Chúng ta tiếp tục:

```java
/**
 * Chiều cao mặc định là 1, tức chỉ có một node duy nhất
 */
private int levelCount = 1;

/**
 * Node ở tầng thấp nhất của Skip List, tức node đầu (head node)
 */
private Node h = new Node();

public void add(int value) {
    int level = randomLevel(); // Chiều cao ngẫu nhiên của node mới

    Node newNode = new Node();
    newNode.data = value;
    newNode.maxLevel = level;

    // Mảng dùng để ghi lại node tiền nhiệm của mỗi tầng
    Node[] update = new Node[level];
    for (int i = 0; i < level; i++) {
        update[i] = h;
    }

    Node p = h;
    // Điểm sửa quan trọng: bắt đầu tìm kiếm từ tầng cao nhất hiện tại của Skip List
    for (int i = levelCount - 1; i >= 0; i--) {
        while (p.forwards[i] != null && p.forwards[i].data < value) {
            p = p.forwards[i];
        }
        // Chỉ ghi lại node tiền nhiệm của các tầng cần cập nhật
        if (i < level) {
            update[i] = p;
        }
    }

    // Chèn node mới
    for (int i = 0; i < level; i++) {
        newNode.forwards[i] = update[i].forwards[i];
        update[i].forwards[i] = newNode;
    }

    // Cập nhật tổng chiều cao của Skip List
    if (levelCount < level) {
        levelCount = level;
    }
}
```
### Truy vấn phần tử

Logic truy vấn khá đơn giản, bắt đầu định vị từ chỉ mục cấp cao nhất của Skip List để tìm giá trị lớn nhất nhỏ hơn value cần tra cứu. Lấy hình dưới làm ví dụ, chúng ta muốn tìm node 8:

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005323.png)

- **Bắt đầu từ tầng cao nhất (chỉ mục cấp 3)**: Con trỏ tìm kiếm `p` bắt đầu từ node đầu. Ở chỉ mục cấp 3, node kế tiếp `forwards[2]` của `p` (giả sử cao nhất là 3 tầng, chỉ mục bắt đầu từ 0) trỏ đến node `5`. Vì `5 < 8`, con trỏ `p` di chuyển sang phải đến node `5`. Node kế tiếp của node `5` ở chỉ mục cấp 3 là `forwards[2]` bằng `null` (hoặc trỏ đến một node lớn hơn `8`, không vẽ trong hình). Việc tìm kiếm sang phải ở tầng hiện tại kết thúc, con trỏ `p` giữ ở node `5`, **di chuyển xuống chỉ mục cấp 2**.
- **Ở chỉ mục cấp 2**: Con trỏ hiện tại `p` là node `5`. Node kế tiếp `forwards[1]` của `p` trỏ đến node `8`. Vì `8` không nhỏ hơn `8` (tức `8 < 8` là `false`), việc tìm kiếm sang phải ở tầng hiện tại kết thúc (`p` không di chuyển đến node `8`). Con trỏ `p` giữ ở node `5`, **di chuyển xuống chỉ mục cấp 1**.
- **Ở chỉ mục cấp 1**: Con trỏ hiện tại `p` là node `5`. Node kế tiếp `forwards[0]` của `p` trỏ đến node `5` ở tầng thấp nhất. Vì `5 < 8`, con trỏ `p` di chuyển sang phải đến node `5` ở tầng thấp nhất. Lúc này, con trỏ hiện tại `p` là node `5` ở tầng thấp nhất. Node kế tiếp `forwards[0]` của nó trỏ đến node `6` ở tầng thấp nhất. Vì `6 < 8`, con trỏ `p` di chuyển sang phải đến node `6` ở tầng thấp nhất. Con trỏ hiện tại `p` là node `6` ở tầng thấp nhất. Node kế tiếp `forwards[0]` của nó trỏ đến node `7` ở tầng thấp nhất. Vì `7 < 8`, con trỏ `p` di chuyển sang phải đến node `7` ở tầng thấp nhất. Con trỏ hiện tại `p` là node `7` ở tầng thấp nhất. Node kế tiếp `forwards[0]` của nó trỏ đến node `8` ở tầng thấp nhất. Vì `8` không nhỏ hơn `8` (tức `8 < 8` là `false`), việc tìm kiếm sang phải ở tầng hiện tại kết thúc. Lúc này, đã duyệt qua tất cả các tầng, vòng lặp `for` kết thúc.
- **Định vị và kiểm tra cuối cùng**: Sau khi tìm kiếm qua tất cả các tầng, con trỏ `p` cuối cùng dừng ở node `7` của tầng thấp nhất (chỉ mục cấp 0). Node này là node lớn nhất trong toàn bộ Skip List có giá trị nhỏ hơn giá trị mục tiêu `8`. Kiểm tra **node kế tiếp** của node `7` (tức `p.forwards[0]`): `p.forwards[0]` trỏ đến node `8`. Kiểm tra xem `p.forwards[0].data` (tức giá trị của node `8`) có bằng giá trị mục tiêu `8` không. Điều kiện thỏa mãn (`8 == 8`), **tìm kiếm thành công, tìm thấy node `8`**.

Vì vậy, cài đặt code của chúng ta cũng tương tự các bước trên, bắt đầu tìm kiếm từ chỉ mục cấp cao nhất, nếu không phải null và nhỏ hơn giá trị cần tìm thì tiếp tục tìm về phía trước, gặp node không nhỏ hơn thì tiếp tục đi xuống, cứ như vậy cho đến khi có được node lớn nhất nhỏ hơn giá trị cần tìm trong Skip List hiện tại, kiểm tra node tiền nhiệm của nó có bằng giá trị cần tìm không:

```java
public Node get(int value) {
    Node p = h; // Bắt đầu từ node đầu

    // Bắt đầu từ tầng chỉ mục cao nhất, đi dần xuống dưới
    for (int i = levelCount - 1; i >= 0; i--) {
        // Tìm kiếm sang phải ở tầng hiện tại, cho đến khi p.forwards[i] là null
        // hoặc p.forwards[i].data lớn hơn hoặc bằng giá trị mục tiêu value
        while (p.forwards[i] != null && p.forwards[i].data < value) {
            p = p.forwards[i]; // Di chuyển sang phải
        }
        // Lúc này p.forwards[i] là null, hoặc p.forwards[i].data >= value
        // hoặc p là node lớn nhất nhỏ hơn value ở tầng hiện tại (nếu tồn tại node như vậy)
    }

    // Sau khi tìm kiếm qua tất cả các tầng, p hiện là node trong linked list gốc (chỉ mục cấp 0)
    // lớn nhất và nhỏ hơn giá trị mục tiêu value (hoặc là node đầu, nếu tất cả phần tử đều lớn hơn hoặc bằng value)

    // Kiểm tra node tiếp theo của p trong linked list gốc có phải là giá trị mục tiêu không
    if (p.forwards[0] != null && p.forwards[0].data == value) {
        return p.forwards[0]; // Đã tìm thấy, trả về node đó
    }

    return null; // Không tìm thấy
}
```

### Xóa phần tử

Cuối cùng là logic xóa, cần tìm kiếm giá trị lớn nhất nhỏ hơn node cần xóa ở mỗi tầng. Giả sử chúng ta cần xóa 10:

1. Ở chỉ mục cấp 3, giá trị lớn nhất nhỏ hơn 10 là 5, tiếp tục đi xuống.
2. Ở chỉ mục cấp 2, bắt đầu tìm từ chỉ mục 5, phát hiện giá trị lớn nhất nhỏ hơn 10 là 8, tiếp tục đi xuống.
3. Tương tự, ở chỉ mục cấp 1 được 8, tiếp tục đi xuống.
4. Ở node gốc tìm thấy 9.
5. Bắt đầu từ chỉ mục cấp cao nhất, kiểm tra node kế tiếp của mỗi node nhỏ hơn 10 có phải là 10 không, nếu bằng 10 thì cho node đó trỏ đến node kế tiếp của 10, giao node 10 và chỉ mục của nó cho GC thu hồi.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005350.png)

```java
/**
 * Xóa
 *
 * @param value
 */
public void delete(int value) {
    Node p = h;
    // Tìm giá trị lớn nhất nhỏ hơn value ở các tầng node
    Node[] updateArr = new Node[levelCount];
    for (int i = levelCount - 1; i >= 0; i--) {
        while (p.forwards[i] != null && p.forwards[i].data < value) {
            p = p.forwards[i];
        }
        updateArr[i] = p;
    }
    // Kiểm tra node tiền nhiệm ở tầng gốc có bằng value không, nếu bằng thì tồn tại giá trị cần xóa
    if (p.forwards[0] != null && p.forwards[0].data == value) {
        // Bắt đầu từ chỉ mục cấp cao nhất, kiểm tra node tiền nhiệm của nó có bằng value không, nếu bằng thì cho node hiện tại trỏ đến node kế tiếp của node value
        for (int i = levelCount - 1; i >= 0; i--) {
            if (updateArr[i].forwards[i] != null && updateArr[i].forwards[i].data == value) {
                updateArr[i].forwards[i] = updateArr[i].forwards[i].forwards[i];
            }
        }
    }

    // Bắt đầu từ cấp cao nhất, kiểm tra xem có tầng chỉ mục nào trống không, nếu trống thì giảm cấp đi 1
    while (levelCount > 1 && h.forwards[levelCount - 1] == null) {
        levelCount--;
    }

}
```

### Code hoàn chỉnh và kiểm thử

Code hoàn chỉnh như dưới đây, bạn đọc có thể tự tham khảo:

```java
public class SkipList {

    /**
     * Chiều cao tối đa của chỉ mục Skip List là 16
     */
    private static final int MAX_LEVEL = 16;

    /**
     * Xác suất thêm một tầng chỉ mục cho mỗi node là một phần hai
     */
    private static final float PROB = 0.5f;

    /**
     * Chiều cao mặc định là 1, tức chỉ có một node duy nhất
     */
    private int levelCount = 1;

    /**
     * Node ở tầng thấp nhất của Skip List, tức node đầu (head node)
     */
    private Node h = new Node();

    public SkipList() {
    }

    public class Node {

        private int data = -1;
        /**
         *
         */
        private Node[] forwards = new Node[MAX_LEVEL];
        private int maxLevel = 0;

        @Override
        public String toString() {
            return "Node{"
                    + "data=" + data
                    + ", maxLevel=" + maxLevel
                    + '}';
        }
    }

    public void add(int value) {
        int level = randomLevel(); // Chiều cao ngẫu nhiên của node mới

        Node newNode = new Node();
        newNode.data = value;
        newNode.maxLevel = level;

        // Mảng dùng để ghi lại node tiền nhiệm của mỗi tầng
        Node[] update = new Node[level];
        for (int i = 0; i < level; i++) {
            update[i] = h;
        }

        Node p = h;
        // Điểm sửa quan trọng: bắt đầu tìm kiếm từ tầng cao nhất hiện tại của Skip List
        for (int i = levelCount - 1; i >= 0; i--) {
            while (p.forwards[i] != null && p.forwards[i].data < value) {
                p = p.forwards[i];
            }
            // Chỉ ghi lại node tiền nhiệm của các tầng cần cập nhật
            if (i < level) {
                update[i] = p;
            }
        }

        // Chèn node mới
        for (int i = 0; i < level; i++) {
            newNode.forwards[i] = update[i].forwards[i];
            update[i].forwards[i] = newNode;
        }

        // Cập nhật tổng chiều cao của Skip List
        if (levelCount < level) {
            levelCount = level;
        }
    }

    /**
     * Về lý thuyết, số phần tử trong chỉ mục cấp 1 nên chiếm 50% dữ liệu gốc, chỉ mục cấp 2 chiếm 25%, chỉ mục cấp 3 chiếm 12.5%, cho đến tầng cao nhất.
     * Vì ở đây xác suất thăng cấp của mỗi tầng là 50%. Với mỗi node mới được chèn, đều cần gọi randomLevel để sinh ra số tầng hợp lý. Phương thức randomLevel
     * này sẽ sinh ngẫu nhiên một số trong khoảng 1~MAX_LEVEL, và: Xác suất 50% trả về 1, xác suất 25% trả về 2, xác suất 12.5% trả về 3 ...
     *
     * @return
     */
    private int randomLevel() {
        int level = 1;
        while (Math.random() > PROB && level < MAX_LEVEL) {
            ++level;
        }
        return level;
    }

    public Node get(int value) {
        Node p = h;
        // Tìm giá trị lớn nhất nhỏ hơn value
        for (int i = levelCount - 1; i >= 0; i--) {
            while (p.forwards[i] != null && p.forwards[i].data < value) {
                p = p.forwards[i];
            }
        }
        // Nếu node kế tiếp của p bằng value thì trả về trực tiếp
        if (p.forwards[0] != null && p.forwards[0].data == value) {
            return p.forwards[0];
        }

        return null;
    }

    /**
     * Xóa
     *
     * @param value
     */
    public void delete(int value) {
        Node p = h;
        // Tìm giá trị lớn nhất nhỏ hơn value ở các tầng node
        Node[] updateArr = new Node[levelCount];
        for (int i = levelCount - 1; i >= 0; i--) {
            while (p.forwards[i] != null && p.forwards[i].data < value) {
                p = p.forwards[i];
            }
            updateArr[i] = p;
        }
        // Kiểm tra node tiền nhiệm ở tầng gốc có bằng value không, nếu bằng thì tồn tại giá trị cần xóa
        if (p.forwards[0] != null && p.forwards[0].data == value) {
            // Bắt đầu từ chỉ mục cấp cao nhất, kiểm tra node tiền nhiệm của nó có bằng value không, nếu bằng thì cho node hiện tại trỏ đến node kế tiếp của node value
            for (int i = levelCount - 1; i >= 0; i--) {
                if (updateArr[i].forwards[i] != null && updateArr[i].forwards[i].data == value) {
                    updateArr[i].forwards[i] = updateArr[i].forwards[i].forwards[i];
                }
            }
        }

        // Bắt đầu từ cấp cao nhất, kiểm tra xem có tầng chỉ mục nào trống không, nếu trống thì giảm cấp đi 1
        while (levelCount > 1 && h.forwards[levelCount - 1] == null) {
            levelCount--;
        }

    }

    public void printAll() {
        Node p = h;
        // Duyệt dựa trên tầng không chỉ mục ở dưới cùng, chỉ cần node kế tiếp không phải null thì in ra node hiện tại và di chuyển đến node kế tiếp
        while (p.forwards[0] != null) {
            System.out.println(p.forwards[0]);
            p = p.forwards[0];
        }

    }
}

```

Code kiểm thử:

```java
public static void main(String[] args) {
        SkipList skipList = new SkipList();
        for (int i = 0; i < 24; i++) {
            skipList.add(i);
        }

        System.out.println("**********输出添加结果**********");
        skipList.printAll();

        SkipList.Node node = skipList.get(22);
        System.out.println("**********查询结果:" + node+" **********");

        skipList.delete(22);
        System.out.println("**********删除结果**********");
        skipList.printAll();


    }
```

**Đặc điểm của Skip List trong Redis**:

1. Sử dụng **danh sách liên kết đôi (doubly linked list)**, khác với ví dụ ở trên, có tồn tại một con trỏ lùi (backward pointer). Chủ yếu dùng để đơn giản hóa thao tác, ví dụ khi xóa một phần tử nào đó, còn cần tìm node tiền nhiệm của phần tử đó, dùng con trỏ lùi sẽ rất tiện lợi.
2. Giá trị `score` có thể trùng nhau, nếu giá trị `score` giống nhau thì sắp xếp theo thứ tự từ điển của ele (giá trị lưu trong node, là sds).
3. Số tầng tối đa mà Skip List của Redis cho phép mặc định là 32, được định nghĩa trong mã nguồn bởi `ZSKIPLIST_MAXLEVEL`.

## So sánh với ba loại cấu trúc dữ liệu còn lại

Cuối cùng, chúng ta quay lại trả lời câu hỏi phỏng vấn ở đầu bài viết: "Tại sao tầng dưới của Sorted Set trong Redis lại dùng Skip List mà không dùng cây cân bằng, Red-Black Tree hay B+ Tree?".

### Cây cân bằng vs Skip List

Trước tiên nói về so sánh với cây cân bằng. Cây cân bằng còn được gọi là **cây AVL (AVL Tree)**, là một cây nhị phân cân bằng nghiêm ngặt, điều kiện cân bằng phải được thỏa mãn (độ cao cây con trái và cây con phải của tất cả các node chênh lệch không quá 1, tức hệ số cân bằng nằm trong phạm vi `[-1,1]`). Độ phức tạp thời gian của các thao tác chèn, xóa và truy vấn của cây cân bằng cũng giống như Skip List, đều là **O(log n)**.

Đối với truy vấn theo khoảng (range query), nó cũng có thể đạt được hiệu quả như Skip List thông qua duyệt theo thứ tự giữa (in-order traversal). Nhưng mỗi thao tác chèn hoặc xóa của nó đều cần đảm bảo sự cân bằng tuyệt đối giữa node trái và node phải của toàn bộ cây, chỉ cần mất cân bằng là phải dùng thao tác xoay (rotation) để giữ cân bằng, quá trình này khá tốn thời gian.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005312.png)

Mục đích ra đời của Skip List chính là để khắc phục một số nhược điểm của cây cân bằng. Người phát minh ra Skip List đã đề cập chi tiết trong bài báo [《Skip lists: a probabilistic alternative to balanced trees》](https://15721.courses.cs.cmu.edu/spring2018/papers/08-oltpindexes1/pugh-skiplists-cacm1990.pdf):

![](https://oss.javaguide.cn/github/javaguide/database/redis/skiplist-a-probabilistic-alternative-to-balanced-trees.png)

> Skip lists are a data structure that can be used in place of balanced trees. Skip lists use probabilistic balancing rather than strictly enforced balancing and as a result the algorithms for insertion and deletion in skip lists are much simpler and significantly faster than equivalent algorithms for balanced trees.
>
> Skip List là một cấu trúc dữ liệu có thể được dùng để thay thế cây cân bằng. Skip List sử dụng cân bằng xác suất (probabilistic balancing) thay vì cân bằng được áp đặt nghiêm ngặt, do đó, thuật toán chèn và xóa trong Skip List đơn giản hơn nhiều và nhanh hơn đáng kể so với thuật toán tương đương của cây cân bằng.

Tác giả ở đây cũng trích dẫn code cốt lõi của thao tác chèn trong cây AVL. Có thể thấy mỗi thao tác thêm đều cần thực hiện đệ quy một lần để định vị vị trí chèn, sau đó còn cần dựa vào việc truy ngược lên node gốc để kiểm tra các node ở mỗi tầng dọc đường có mất cân bằng không, rồi thông qua việc xoay node để điều chỉnh.

```java
// Thêm phần tử mới (key, value) vào cây tìm kiếm nhị phân
public void add(K key, V value) {
    root = add(root, key, value);
}

// Chèn phần tử (key, value) vào cây tìm kiếm nhị phân có node gốc là node, thuật toán đệ quy
// Trả về node gốc của cây tìm kiếm nhị phân sau khi chèn node mới
private Node add(Node node, K key, V value) {

    if (node == null) {
        size++;
        return new Node(key, value);
    }

    if (key.compareTo(node.key) < 0)
        node.left = add(node.left, key, value);
    else if (key.compareTo(node.key) > 0)
        node.right = add(node.right, key, value);
    else // key.compareTo(node.key) == 0
        node.value = value;

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    int balanceFactor = getBalanceFactor(node);

    // Dạng LL cần xoay phải
    if (balanceFactor > 1 && getBalanceFactor(node.left) >= 0) {
        return rightRotate(node);
    }

    // Mất cân bằng dạng RR cần xoay trái
    if (balanceFactor < -1 && getBalanceFactor(node.right) <= 0) {
        return leftRotate(node);
    }

    // Dạng LR cần xoay trái thành dạng LL trước, sau đó xoay phải
    if (balanceFactor > 1 && getBalanceFactor(node.left) < 0) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // Dạng RL
    if (balanceFactor < -1 && getBalanceFactor(node.right) > 0) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    return node;
}
```

### Red-Black Tree vs Skip List

Red-Black Tree (cây đỏ đen) cũng là một loại cây tìm kiếm nhị phân tự cân bằng (self-balancing binary search tree). Hiệu năng truy vấn của nó hơi kém hơn cây AVL, nhưng hiệu quả chèn và xóa cao hơn. Độ phức tạp thời gian của các thao tác chèn, xóa và truy vấn của Red-Black Tree cũng giống như Skip List, đều là **O(log n)**.

Red-Black Tree là một **cây cân bằng đen (black balanced tree)**, tức từ bất kỳ node nào đến một node lá khác, số node đen mà nó đi qua là như nhau. Khi thực hiện thao tác chèn, cần thông qua xoay và đổi màu (biến đổi đỏ đen) để đảm bảo cân bằng đen. Tuy nhiên, so với cây AVL thì chi phí để duy trì cân bằng nhỏ hơn một chút. Về giới thiệu chi tiết của Red-Black Tree, có thể xem bài viết này: [Red-Black Tree](https://javaguide.cn/cs-basics/data-structure/red-black-tree.html).

So với Red-Black Tree, cài đặt của Skip List cũng đơn giản hơn. Hơn nữa, với thao tác tìm kiếm dữ liệu theo khoảng, hiệu quả của Red-Black Tree không cao bằng Skip List.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005709.png)

Code cốt lõi tương ứng của thao tác thêm trong Red-Black Tree như dưới đây, bạn đọc có thể tự tham khảo để hiểu:

```java
private Node < K, V > add(Node < K, V > node, K key, V val) {

    if (node == null) {
        size++;
        return new Node(key, val);

    }

    if (key.compareTo(node.key) < 0) {
        node.left = add(node.left, key, val);
    } else if (key.compareTo(node.key) > 0) {
        node.right = add(node.right, key, val);
    } else {
        node.val = val;
    }

    // Node con trái không phải đỏ, node con phải là đỏ, xoay trái
    if (isRed(node.right) && !isRed(node.left)) {
        node = leftRotate(node);
    }

    // Chuỗi trái xoay phải
    if (isRed(node.left) && isRed(node.left.left)) {
        node = rightRotate(node);
    }

    // Đảo màu
    if (isRed(node.left) && isRed(node.right)) {
        flipColors(node);
    }

    return node;
}
```

### B+ Tree vs Skip List

Chắc hẳn bạn đọc từng sử dụng MySQL đều biết cấu trúc dữ liệu B+ Tree. B+ Tree là một cấu trúc dữ liệu thường dùng, có các đặc điểm sau:

1. **Cấu trúc cây đa phân (multi-way tree)**: Nó là một cây đa phân, mỗi node có thể chứa nhiều node con, làm giảm chiều cao của cây, hiệu quả truy vấn cao.
2. **Hiệu quả lưu trữ cao**: Trong đó node không phải lá lưu trữ nhiều key, node lá lưu trữ value, khiến mỗi node lưu trữ được nhiều key hơn, khi truy vấn theo khoảng dựa trên index thì hiệu quả truy vấn cao hơn.
3. **Tính cân bằng**: Nó cân bằng tuyệt đối, tức chiều cao các nhánh của cây chênh lệch không nhiều, đảm bảo độ phức tạp thời gian của truy vấn và chèn là **O(log n)**.
4. **Truy cập tuần tự**: Các node lá được nối với nhau bằng con trỏ linked list, truy vấn theo khoảng có hiệu quả rất tốt.
5. **Dữ liệu phân bố đều**: Khi chèn vào B+ Tree có thể dẫn đến phân bố lại dữ liệu, làm cho dữ liệu phân bố đều hơn trong toàn bộ cây, đảm bảo hiệu quả truy vấn theo khoảng và xóa.

![](https://oss.javaguide.cn/javaguide/database/redis/skiplist/202401222005649.png)

Vì vậy, B+ Tree phù hợp hơn để làm một trong những cấu trúc index thường dùng trong cơ sở dữ liệu và hệ thống file. Tư tưởng cốt lõi của nó là thông qua số lần IO ít nhất có thể để định vị được nhiều index nhất nhằm lấy dữ liệu truy vấn. Đối với cơ sở dữ liệu trong bộ nhớ như Redis, nó không mấy quan tâm đến những điều này, vì Redis là cơ sở dữ liệu trong bộ nhớ nên không thể lưu trữ lượng dữ liệu lớn, vì vậy index không cần được duy trì theo cách B+ Tree, chỉ cần duy trì ngẫu nhiên theo xác suất là được, tiết kiệm bộ nhớ. Hơn nữa, khi dùng Skip List để cài đặt zset thì đơn giản hơn so với B+ Tree, khi chèn chỉ cần thông qua index để chèn dữ liệu vào vị trí thích hợp trong linked list rồi ngẫu nhiên duy trì chỉ mục có chiều cao nhất định là được, cũng không cần giống như B+ Tree khi chèn mà phát hiện mất cân bằng thì còn phải tách và gộp node.

### Lý do mà tác giả Redis đưa ra

Tất nhiên chúng ta cũng có thể thông qua lý do mà chính tác giả Redis đưa ra:

> There are a few reasons:
> 1、They are not very memory intensive. It's up to you basically. Changing parameters about the probability of a node to have a given number of levels will make then less memory intensive than btrees.
> 2、A sorted set is often target of many ZRANGE or ZREVRANGE operations, that is, traversing the skip list as a linked list. With this operation the cache locality of skip lists is at least as good as with other kind of balanced trees.
> 3、They are simpler to implement, debug, and so forth. For instance thanks to the skip list simplicity I received a patch (already in Redis master) with augmented skip lists implementing ZRANK in O(log(N)). It required little changes to the code.

Dịch ra có nghĩa là:

> Có một vài lý do:
>
> 1、Chúng không tốn nhiều bộ nhớ. Điều này cơ bản tùy thuộc vào bạn. Thay đổi tham số về xác suất một node có số tầng nhất định sẽ làm chúng tiết kiệm bộ nhớ hơn B-Tree.
>
> 2、Sorted Set thường là mục tiêu của nhiều thao tác ZRANGE hoặc ZREVRANGE, tức là duyệt Skip List như một linked list. Với thao tác này, tính cục bộ bộ nhớ đệm (cache locality) của Skip List ít nhất cũng tốt như các loại cây cân bằng khác.
>
> 3、Chúng dễ cài đặt, gỡ lỗi, v.v. Ví dụ, nhờ sự đơn giản của Skip List, tôi đã nhận được một bản vá (đã có trong nhánh master của Redis) dùng Skip List mở rộng để cài đặt ZRANK với O(log(N)). Nó chỉ cần thay đổi rất ít code.

## Tổng kết

Bài viết này đã dùng phần lớn dung lượng để giới thiệu nguyên lý hoạt động và cài đặt của Skip List, giúp bạn đọc hiểu rõ hơn về ưu nhược điểm của cấu trúc dữ liệu này, cuối cùng kết hợp đặc điểm thao tác của từng cấu trúc dữ liệu để so sánh, từ đó giúp bạn đọc hiểu tốt hơn câu hỏi phỏng vấn này. Khuyến nghị bạn đọc khi tìm hiểu Skip List, hãy kết hợp với việc cầm bút mô phỏng để hiểu chi tiết quá trình thêm, xóa, sửa, tra cứu của Skip List.

## Đọc thêm về cấu trúc dữ liệu

Nếu muốn nhanh chóng ôn lại Skip List từ góc độ phỏng vấn, bạn có thể xem [Tổng hợp câu hỏi phỏng vấn về Skip List](../../cs-basics/data-structure/skip-list.md). Nếu muốn so sánh các cấu trúc khác đằng sau Redis ZSet, cũng có thể tiện tay ôn lại [Giải thích chi tiết Red-Black Tree](../../cs-basics/data-structure/red-black-tree.md) và [Tổng hợp câu hỏi phỏng vấn về Hash Table](../../cs-basics/data-structure/hash-table.md).

## Tham khảo

- Tại sao redis dùng skip list (skiplist) mà không dùng red-black?: <https://www.zhihu.com/question/20202931/answer/16086538>
- Skip List--Skip List (bài viết chi tiết nhất về Skip List trên mạng, không có bài thứ hai): <https://www.jianshu.com/p/9d8296562806>
- Giải thích chi tiết đối tượng Redis và cấu trúc dữ liệu tầng dưới: <https://blog.csdn.net/shark_chili3007/article/details/104171986>
- Redis Sorted Set (sorted set): <https://www.runoob.com/redis/redis-sorted-sets.html>
- So sánh Red-Black Tree và Skip List: <https://zhuanlan.zhihu.com/p/576984787>
- Tại sao zset của redis dùng Skip List mà không dùng b+ tree?: <https://blog.csdn.net/f80407515/article/details/129136998>
