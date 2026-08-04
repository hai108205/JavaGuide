---
title: Giải thích chi tiết 5 kiểu dữ liệu cơ bản của Redis
description: Giải thích chi tiết cách sử dụng và kịch bản ứng dụng của 5 kiểu dữ liệu cơ bản trong Redis gồm String, List, Set, Hash, Zset, phân tích sâu nguyên lý cài đặt của các cấu trúc dữ liệu tầng dưới như SDS, Skip List, Zip List.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Kiểu dữ liệu Redis,String,List,Set,Hash,Zset,SDS,Skip List,Zip List,Lệnh Redis
---

Redis có tổng cộng 5 kiểu dữ liệu cơ bản: String (chuỗi), List (danh sách), Set (tập hợp), Hash (bảng băm), Zset (tập hợp có thứ tự).

5 kiểu dữ liệu này được cung cấp trực tiếp cho người dùng sử dụng, là hình thức lưu trữ dữ liệu. Cài đặt tầng dưới của chúng chủ yếu dựa vào 8 cấu trúc dữ liệu sau: Simple Dynamic String (SDS - chuỗi động đơn giản), LinkedList (danh sách liên kết đôi), Dict (bảng băm/từ điển), SkipList (Skip List), Intset (tập hợp số nguyên), ZipList (danh sách nén), QuickList (danh sách nhanh).

Cấu trúc dữ liệu tầng dưới tương ứng với 5 kiểu dữ liệu cơ bản của Redis được thể hiện trong bảng dưới đây:

| String | List                         | Hash          | Set          | Zset              |
| :----- | :--------------------------- | :------------ | :----------- | :---------------- |
| SDS    | LinkedList/ZipList/QuickList | Dict、ZipList | Dict、Intset | ZipList、SkipList |

Trước Redis 3.2, cài đặt tầng dưới của List là LinkedList hoặc ZipList. Từ Redis 3.2 trở đi, QuickList - sự kết hợp giữa LinkedList và ZipList - được giới thiệu, và cài đặt tầng dưới của List trở thành QuickList. Từ Redis 7.0, ZipList bị thay thế bởi ListPack.

Bạn có thể tìm thấy phần giới thiệu rất chi tiết về kiểu dữ liệu/cấu trúc dữ liệu của Redis trên trang chủ chính thức của Redis:

- [Redis Data Structures](https://redis.com/redis-enterprise/data-structures/)
- [Redis Data types tutorial](https://redis.io/docs/manual/data-types/data-types-tutorial/)

Trong tương lai, cùng với việc phát hành phiên bản Redis mới, có thể sẽ xuất hiện các cấu trúc dữ liệu mới. Thông qua việc tra cứu phần giới thiệu tương ứng trên trang chủ Redis, bạn luôn có thể có được thông tin đáng tin cậy nhất.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220720181630203.png)

## String (chuỗi)

### Giới thiệu

String là kiểu dữ liệu đơn giản nhất đồng thời cũng là kiểu được dùng nhiều nhất trong Redis.

String là một kiểu dữ liệu an toàn nhị phân (binary-safe), có thể dùng để lưu trữ bất kỳ loại dữ liệu nào như chuỗi, số nguyên, số thực dấu phẩy động, hình ảnh (mã hóa hoặc giải mã base64 của hình ảnh, hoặc đường dẫn của hình ảnh), đối tượng đã được tuần tự hóa (serialized object).

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719124403897.png)

Mặc dù Redis được viết bằng ngôn ngữ C, nhưng Redis không sử dụng cách biểu diễn chuỗi của C, mà tự xây dựng một loại **Simple Dynamic String** (chuỗi động đơn giản, viết tắt là **SDS**). So với chuỗi nguyên bản của C, SDS của Redis không chỉ có thể lưu dữ liệu văn bản mà còn có thể lưu dữ liệu nhị phân, và độ phức tạp để lấy độ dài chuỗi là O(1) (chuỗi C là O(N)). Ngoài ra, SDS API của Redis là an toàn, không gây ra tràn bộ đệm (buffer overflow).

### Các lệnh thường dùng

| Lệnh                            | Giới thiệu                                             |
| ------------------------------- | ------------------------------------------------------ |
| SET key value                   | Đặt giá trị cho key chỉ định                           |
| SETNX key value                 | Chỉ đặt giá trị cho key khi key không tồn tại          |
| GET key                         | Lấy giá trị của key chỉ định                           |
| MSET key1 value1 key2 value2 …… | Đặt giá trị cho một hoặc nhiều key chỉ định            |
| MGET key1 key2 ...              | Lấy giá trị của một hoặc nhiều key chỉ định            |
| STRLEN key                      | Trả về độ dài của giá trị chuỗi được lưu tại key       |
| INCR key                        | Tăng giá trị số được lưu tại key lên một               |
| DECR key                        | Giảm giá trị số được lưu tại key đi một                |
| EXISTS key                      | Kiểm tra key chỉ định có tồn tại không                 |
| DEL key (chung)                 | Xóa key chỉ định                                       |
| EXPIRE key seconds (chung)      | Đặt thời gian hết hạn cho key chỉ định                 |

Để biết thêm các lệnh Redis String và hướng dẫn sử dụng chi tiết, hãy xem phần giới thiệu tương ứng trên trang chủ Redis: <https://redis.io/commands/?group=string> .

**Thao tác cơ bản**:

```bash
> SET key value
OK
> GET key
"value"
> EXISTS key
(integer) 1
> STRLEN key
(integer) 5
> DEL key
(integer) 1
> GET key
(nil)
```

**Đặt hàng loạt**:

```bash
> MSET key1 value1 key2 value2
OK
> MGET key1 key2 # Lấy hàng loạt value tương ứng với nhiều key
1) "value1"
2) "value2"
```

**Bộ đếm (có thể dùng khi nội dung chuỗi là số nguyên):**

```bash
> SET number 1
OK
> INCR number # Tăng giá trị số được lưu tại key lên một
(integer) 2
> GET number
"2"
> DECR number # Giảm giá trị số được lưu tại key đi một
(integer) 1
> GET number
"1"
```

**Đặt thời gian hết hạn (mặc định là không bao giờ hết hạn)**:

```bash
> EXPIRE key 60
(integer) 1
> SETEX key 60 value # Đặt giá trị và đặt thời gian hết hạn
OK
> TTL key
(integer) 56
```

### Kịch bản ứng dụng

**Kịch bản cần lưu trữ dữ liệu thông thường**

- Ví dụ: Cache Session, Token, địa chỉ hình ảnh, đối tượng đã tuần tự hóa (so với lưu bằng Hash thì tiết kiệm bộ nhớ hơn).
- Lệnh liên quan: `SET`, `GET`.

**Kịch bản cần đếm số**

- Ví dụ: số lượng yêu cầu của người dùng trong một đơn vị thời gian (có thể dùng cho việc giới hạn tần suất đơn giản), số lượt truy cập trang trong một đơn vị thời gian.
- Lệnh liên quan: `SET`, `GET`, `INCR`, `DECR` .

**Khóa phân tán (Distributed Lock)**

Lợi dụng lệnh `SETNX key value` có thể cài đặt một khóa phân tán đơn giản nhất (tồn tại một số khiếm khuyết, thông thường không khuyến nghị cài đặt khóa phân tán theo cách này).

## List (danh sách)

### Giới thiệu

List trong Redis thực chất là cài đặt của cấu trúc dữ liệu linked list. Tôi đã giới thiệu chi tiết cấu trúc dữ liệu linked list trong bài viết [Cấu trúc dữ liệu tuyến tính: mảng, linked list, stack, queue](https://javaguide.cn/cs-basics/data-structure/linear-data-structure.html), ở đây tôi không giới thiệu thêm nữa.

Nhiều ngôn ngữ lập trình cấp cao đều có sẵn cài đặt của linked list, ví dụ `LinkedList` trong Java, nhưng ngôn ngữ C không cài đặt linked list, vì vậy Redis tự cài đặt cấu trúc dữ liệu linked list của riêng mình. Cài đặt List của Redis là một **danh sách liên kết đôi (doubly linked list)**, tức có thể hỗ trợ tìm kiếm và duyệt ngược, thao tác tiện lợi hơn, tuy nhiên phải trả thêm một phần chi phí bộ nhớ.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719124413287.png)

### Các lệnh thường dùng

| Lệnh                        | Giới thiệu                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| RPUSH key value1 value2 ... | Thêm một hoặc nhiều phần tử vào cuối (bên phải) của list chỉ định |
| LPUSH key value1 value2 ... | Thêm một hoặc nhiều phần tử vào đầu (bên trái) của list chỉ định  |
| LSET key index value        | Đặt giá trị tại vị trí index của list chỉ định thành value        |
| LPOP key                    | Xóa và lấy phần tử đầu tiên (ngoài cùng bên trái) của list       |
| RPOP key                    | Xóa và lấy phần tử cuối cùng (ngoài cùng bên phải) của list      |
| LLEN key                    | Lấy số lượng phần tử của list                                     |
| LRANGE key start end        | Lấy các phần tử giữa start và end của list                        |

Để biết thêm các lệnh Redis List và hướng dẫn sử dụng chi tiết, hãy xem phần giới thiệu tương ứng trên trang chủ Redis: <https://redis.io/commands/?group=list> .

**Cài đặt queue thông qua `RPUSH/LPOP` hoặc `LPUSH/RPOP`**:

```bash
> RPUSH myList value1
(integer) 1
> RPUSH myList value2 value3
(integer) 3
> LPOP myList
"value1"
> LRANGE myList 0 1
1) "value2"
2) "value3"
> LRANGE myList 0 -1
1) "value2"
2) "value3"
```

**Cài đặt stack thông qua `RPUSH/RPOP` hoặc `LPUSH/LPOP`**:

```bash
> RPUSH myList2 value1 value2 value3
(integer) 3
> RPOP myList2 # Lấy phần tử ngoài cùng bên phải của list ra
"value3"
```

Tôi đã vẽ riêng một hình để giúp mọi người dễ hiểu hơn về các lệnh `RPUSH` , `LPOP` , `LPUSH` , `RPOP`:

![](https://oss.javaguide.cn/github/javaguide/database/redis/redis-list.png)

**Xem các phần tử của list trong phạm vi index tương ứng bằng `LRANGE`**:

```bash
> RPUSH myList value1 value2 value3
(integer) 3
> LRANGE myList 0 1
1) "value1"
2) "value2"
> LRANGE myList 0 -1
1) "value1"
2) "value2"
3) "value3"
```

Thông qua lệnh `LRANGE`, bạn có thể dựa vào List để thực hiện truy vấn phân trang, hiệu năng rất cao!

**Xem độ dài linked list bằng `LLEN`**:

```bash
> LLEN myList
(integer) 3
```

### Kịch bản ứng dụng

**Hiển thị luồng thông tin (information feed)**

- Ví dụ: bài viết mới nhất, tin tức mới nhất.
- Lệnh liên quan: `LPUSH`, `LRANGE`.

**Hàng đợi tin nhắn (Message Queue)**

`List` có thể được dùng để làm hàng đợi tin nhắn, chỉ là chức năng quá đơn giản và tồn tại nhiều khiếm khuyết, không khuyến nghị làm như vậy.

Tương đối mà nói, cấu trúc dữ liệu `Stream` mới được thêm vào từ Redis 5.0 phù hợp để làm hàng đợi tin nhắn hơn, chỉ là chức năng vẫn còn rất sơ sài. So với các hàng đợi tin nhắn chuyên nghiệp, vẫn còn nhiều điểm hạn chế, ví dụ vấn đề mất tin nhắn và tích lũy tin nhắn khó giải quyết.

## Hash (bảng băm)

### Giới thiệu

Hash trong Redis là một bảng ánh xạ kiểu String giữa các cặp field-value (cặp key-value), đặc biệt phù hợp để lưu trữ đối tượng. Khi thao tác sau này, bạn có thể trực tiếp sửa giá trị của một số field nào đó trong đối tượng này.

Hash tương tự như `HashMap` trước JDK1.8, cài đặt bên trong cũng gần giống (mảng + linked list). Tuy nhiên, Hash của Redis được tối ưu nhiều hơn.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719124421703.png)

### Các lệnh thường dùng

| Lệnh                                      | Giới thiệu                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| HSET key field value                      | Đặt giá trị cho field chỉ định trong hash table chỉ định                       |
| HSETNX key field value                    | Chỉ đặt giá trị cho field chỉ định khi field đó không tồn tại                  |
| HMSET key field1 value1 field2 value2 ... | Đồng thời đặt một hoặc nhiều cặp field-value vào hash table chỉ định           |
| HGET key field                            | Lấy giá trị của field chỉ định trong hash table chỉ định                       |
| HMGET key field1 field2 ...               | Lấy giá trị của một hoặc nhiều field chỉ định trong hash table chỉ định        |
| HGETALL key                               | Lấy tất cả các cặp key-value trong hash table chỉ định                         |
| HEXISTS key field                         | Kiểm tra field chỉ định có tồn tại trong hash table chỉ định không             |
| HDEL key field1 field2 ...                | Xóa một hoặc nhiều field của hash table                                        |
| HLEN key                                  | Lấy số lượng field trong hash table chỉ định                                   |
| HINCRBY key field increment               | Thực hiện phép toán trên field chỉ định trong hash chỉ định (số dương là cộng, số âm là trừ) |

Để biết thêm các lệnh Redis Hash và hướng dẫn sử dụng chi tiết, hãy xem phần giới thiệu tương ứng trên trang chủ Redis: <https://redis.io/commands/?group=hash> .

**Mô phỏng lưu trữ dữ liệu đối tượng**:

```bash
> HMSET userInfoKey name "guide" description "dev" age 24
OK
> HEXISTS userInfoKey name # Kiểm tra field chỉ định có tồn tại trong value tương ứng với key không.
(integer) 1
> HGET userInfoKey name # Lấy giá trị của field chỉ định được lưu trong hash table.
"guide"
> HGET userInfoKey age
"24"
> HGETALL userInfoKey # Lấy tất cả field và value của key chỉ định trong hash table
1) "name"
2) "guide"
3) "description"
4) "dev"
5) "age"
6) "24"
> HSET userInfoKey name "GuideGeGe"
> HGET userInfoKey name
"GuideGeGe"
> HINCRBY userInfoKey age 2
(integer) 26
```

### Kịch bản ứng dụng

**Kịch bản lưu trữ dữ liệu đối tượng**

- Ví dụ: thông tin người dùng, thông tin sản phẩm, thông tin bài viết, thông tin giỏ hàng.
- Lệnh liên quan: `HSET` (đặt giá trị cho một field), `HMSET` (đặt giá trị cho nhiều field), `HGET` (lấy giá trị của một field), `HMGET` (lấy giá trị của nhiều field).

## Set (tập hợp)

### Giới thiệu

Kiểu Set trong Redis là một tập hợp không có thứ tự, các phần tử trong tập hợp không có thứ tự trước sau nhưng đều là duy nhất, hơi giống với `HashSet` trong Java. Khi bạn cần lưu trữ một danh sách dữ liệu nhưng không muốn xuất hiện dữ liệu trùng lặp, Set là một lựa chọn rất tốt. Hơn nữa, Set cung cấp interface quan trọng để kiểm tra một phần tử nào đó có nằm trong tập hợp Set hay không, điều này cũng là thứ mà List không thể cung cấp.

Bạn có thể dựa vào Set để dễ dàng thực hiện các phép toán giao (intersection), hợp (union), hiệu (difference). Ví dụ, bạn có thể lưu tất cả những người mà một người dùng theo dõi vào một tập hợp, lưu tất cả người hâm mộ của họ vào một tập hợp. Như vậy, Set có thể thực hiện rất tiện lợi các chức năng như cùng theo dõi, cùng người hâm mộ, cùng sở thích. Quá trình này chính là quá trình tính giao của tập hợp.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719124430264.png)

### Các lệnh thường dùng

| Lệnh                                  | Giới thiệu                                                        |
| ------------------------------------- | ----------------------------------------------------------------- |
| SADD key member1 member2 ...          | Thêm một hoặc nhiều phần tử vào tập hợp chỉ định                  |
| SMEMBERS key                          | Lấy tất cả phần tử trong tập hợp chỉ định                         |
| SCARD key                             | Lấy số lượng phần tử của tập hợp chỉ định                         |
| SISMEMBER key member                  | Kiểm tra phần tử chỉ định có nằm trong tập hợp chỉ định không     |
| SINTER key1 key2 ...                  | Lấy giao của tất cả các tập hợp được đưa vào                      |
| SINTERSTORE destination key1 key2 ... | Lưu giao của tất cả các tập hợp được đưa vào vào destination      |
| SUNION key1 key2 ...                  | Lấy hợp của tất cả các tập hợp được đưa vào                       |
| SUNIONSTORE destination key1 key2 ... | Lưu hợp của tất cả các tập hợp được đưa vào vào destination       |
| SDIFF key1 key2 ...                   | Lấy hiệu của tất cả các tập hợp được đưa vào                      |
| SDIFFSTORE destination key1 key2 ...  | Lưu hiệu của tất cả các tập hợp được đưa vào vào destination      |
| SPOP key count                        | Xóa ngẫu nhiên và lấy một hoặc nhiều phần tử trong tập hợp        |
| SRANDMEMBER key count                 | Lấy ngẫu nhiên số lượng phần tử chỉ định trong tập hợp            |

Để biết thêm các lệnh Redis Set và hướng dẫn sử dụng chi tiết, hãy xem phần giới thiệu tương ứng trên trang chủ Redis: <https://redis.io/commands/?group=set> .

**Thao tác cơ bản**:

```bash
> SADD mySet value1 value2
(integer) 2
> SADD mySet value1 # Không cho phép có phần tử trùng lặp, vì vậy thêm thất bại
(integer) 0
> SMEMBERS mySet
1) "value1"
2) "value2"
> SCARD mySet
(integer) 2
> SISMEMBER mySet value1
(integer) 1
> SADD mySet2 value2 value3
(integer) 2
```

- `mySet` : `value1`, `value2` .
- `mySet2`: `value2`, `value3` .

**Tính giao**:

```bash
> SINTERSTORE mySet3 mySet mySet2
(integer) 1
> SMEMBERS mySet3
1) "value2"
```

**Tính hợp**:

```bash
> SUNION mySet mySet2
1) "value3"
2) "value2"
3) "value1"
```

**Tính hiệu**:

```bash
> SDIFF mySet mySet2 # Hiệu là tập hợp gồm tất cả các phần tử thuộc mySet nhưng không thuộc A
1) "value1"
```

### Kịch bản ứng dụng

**Kịch bản dữ liệu cần lưu không được trùng lặp**

- Ví dụ: thống kê UV của website (với các kịch bản có lượng dữ liệu khổng lồ thì `HyperLogLog` phù hợp hơn), lượt thích bài viết, lượt thích trạng thái, v.v.
- Lệnh liên quan: `SCARD` (lấy số lượng của tập hợp) .

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719073733851.png)

**Kịch bản cần lấy giao, hợp và hiệu của nhiều nguồn dữ liệu**

- Ví dụ: bạn chung (giao), người hâm mộ chung (giao), cùng theo dõi (giao), gợi ý kết bạn (hiệu), gợi ý âm nhạc (hiệu), gợi ý kênh đăng ký (hiệu + giao), v.v.
- Lệnh liên quan: `SINTER` (giao), `SINTERSTORE` (giao), `SUNION` (hợp), `SUNIONSTORE` (hợp), `SDIFF` (hiệu), `SDIFFSTORE` (hiệu).

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719074543513.png)

**Kịch bản cần lấy ngẫu nhiên phần tử trong nguồn dữ liệu**

- Ví dụ: hệ thống bốc thăm trúng thưởng, điểm danh ngẫu nhiên, v.v.
- Lệnh liên quan: `SPOP` (lấy ngẫu nhiên phần tử trong tập hợp và xóa, phù hợp với kịch bản không cho phép trúng thưởng trùng lặp), `SRANDMEMBER` (lấy ngẫu nhiên phần tử trong tập hợp, phù hợp với kịch bản cho phép trúng thưởng trùng lặp).

## Sorted Set (tập hợp có thứ tự)

### Giới thiệu

Sorted Set tương tự như Set, nhưng so với Set, Sorted Set tăng thêm một tham số trọng số `score`, làm cho các phần tử trong tập hợp có thể được sắp xếp có thứ tự theo `score`, ngoài ra còn có thể thông qua khoảng của `score` để lấy danh sách phần tử. Hơi giống sự kết hợp giữa `HashMap` và `TreeSet` trong Java.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719124437791.png)

### Các lệnh thường dùng

| Lệnh                                          | Giới thiệu                                                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ZADD key score1 member1 score2 member2 ...    | Thêm một hoặc nhiều phần tử vào Sorted Set chỉ định                                                                               |
| ZCARD KEY                                     | Lấy số lượng phần tử của Sorted Set chỉ định                                                                                      |
| ZSCORE key member                             | Lấy giá trị score của phần tử chỉ định trong Sorted Set chỉ định                                                                  |
| ZINTERSTORE destination numkeys key1 key2 ... | Lưu giao của tất cả các Sorted Set được đưa vào vào destination, thực hiện phép tổng hợp SUM trên giá trị score của các phần tử giống nhau, numkeys là số lượng tập hợp |
| ZUNIONSTORE destination numkeys key1 key2 ... | Tính hợp, các phần khác tương tự ZINTERSTORE                                                                                      |
| ZDIFFSTORE destination numkeys key1 key2 ...  | Tính hiệu, các phần khác tương tự ZINTERSTORE                                                                                     |
| ZRANGE key start end                          | Lấy các phần tử giữa start và end của Sorted Set chỉ định (score từ thấp đến cao)                                                 |
| ZREVRANGE key start end                       | Lấy các phần tử giữa start và end của Sorted Set chỉ định (score từ cao xuống thấp)                                               |
| ZREVRANK key member                           | Lấy thứ hạng của phần tử chỉ định trong Sorted Set chỉ định (sắp xếp score từ lớn đến nhỏ)                                        |

Để biết thêm các lệnh Redis Sorted Set và hướng dẫn sử dụng chi tiết, hãy xem phần giới thiệu tương ứng trên trang chủ Redis: <https://redis.io/commands/?group=sorted-set> .

**Thao tác cơ bản**:

```bash
> ZADD myZset 2.0 value1 1.0 value2
(integer) 2
> ZCARD myZset
2
> ZSCORE myZset value1
2.0
> ZRANGE myZset 0 1
1) "value2"
2) "value1"
> ZREVRANGE myZset 0 1
1) "value1"
2) "value2"
> ZADD myZset2 4.0 value2 3.0 value3
(integer) 2

```

- `myZset` : `value1`(2.0), `value2`(1.0) .
- `myZset2`: `value2` (4.0), `value3`(3.0) .

**Lấy thứ hạng của phần tử chỉ định**:

```bash
> ZREVRANK myZset value1
0
> ZREVRANK myZset value2
1
```

**Tính giao**:

```bash
> ZINTERSTORE myZset3 2 myZset myZset2
1
> ZRANGE myZset3 0 1 WITHSCORES
value2
5
```

**Tính hợp**:

```bash
> ZUNIONSTORE myZset4 2 myZset myZset2
3
> ZRANGE myZset4 0 2 WITHSCORES
value1
2
value3
3
value2
5
```

**Tính hiệu**:

```bash
> ZDIFF 2 myZset myZset2 WITHSCORES
value1
2
```

### Kịch bản ứng dụng

**Kịch bản cần lấy ngẫu nhiên phần tử trong nguồn dữ liệu và sắp xếp theo một trọng số nào đó**

- Ví dụ: các loại bảng xếp hạng như bảng xếp hạng tặng quà trong phòng livestream, bảng xếp hạng số bước chân WeChat của bạn bè, bảng xếp hạng hạng (rank) trong Vương Giả Vinh Diệu, bảng xếp hạng độ nóng của chủ đề, v.v.
- Lệnh liên quan: `ZRANGE` (sắp xếp từ nhỏ đến lớn), `ZREVRANGE` (sắp xếp từ lớn đến nhỏ), `ZREVRANK` (thứ hạng của phần tử chỉ định).

![](https://oss.javaguide.cn/github/javaguide/database/redis/2021060714195385.png)

Phần "Chuyên đề câu hỏi phỏng vấn kỹ thuật" trong [《Java 面试指北》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) có một bài viết giới thiệu chi tiết cách sử dụng Sorted Set để thiết kế và xây dựng một bảng xếp hạng.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220719071115140.png)

**Kịch bản dữ liệu cần lưu có mức ưu tiên hoặc mức độ quan trọng**, ví dụ hàng đợi tác vụ có ưu tiên (priority task queue).

- Ví dụ: hàng đợi tác vụ có ưu tiên.
- Lệnh liên quan: `ZRANGE` (sắp xếp từ nhỏ đến lớn), `ZREVRANGE` (sắp xếp từ lớn đến nhỏ), `ZREVRANK` (thứ hạng của phần tử chỉ định).

## Tổng kết

| Kiểu dữ liệu | Giải thích                                                                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String       | Kiểu dữ liệu an toàn nhị phân, có thể dùng để lưu trữ bất kỳ loại dữ liệu nào như chuỗi, số nguyên, số thực dấu phẩy động, hình ảnh (mã hóa hoặc giải mã base64 của hình ảnh, hoặc đường dẫn của hình ảnh), đối tượng đã tuần tự hóa. |
| List         | Cài đặt List của Redis là một danh sách liên kết đôi, tức có thể hỗ trợ tìm kiếm và duyệt ngược, thao tác tiện lợi hơn, tuy nhiên phải trả thêm một phần chi phí bộ nhớ.                                                          |
| Hash         | Một bảng ánh xạ kiểu String giữa các cặp field-value (cặp key-value), đặc biệt phù hợp để lưu trữ đối tượng. Khi thao tác sau này, bạn có thể trực tiếp sửa giá trị của một số field nào đó trong đối tượng này.                  |
| Set          | Tập hợp không có thứ tự, các phần tử trong tập hợp không có thứ tự trước sau nhưng đều là duy nhất, hơi giống với `HashSet` trong Java.                                                                                           |
| Zset         | So với Set, Sorted Set tăng thêm một tham số trọng số `score`, làm cho các phần tử trong tập hợp có thể được sắp xếp có thứ tự theo `score`, ngoài ra còn có thể thông qua khoảng của `score` để lấy danh sách phần tử. Hơi giống sự kết hợp giữa `HashMap` và `TreeSet` trong Java. |

## Đọc thêm về cấu trúc dữ liệu

Các kiểu dữ liệu của Redis sử dụng rất nhiều cấu trúc dữ liệu cơ sở ở phía sau. Nếu muốn bổ sung kiến thức tầng dưới từ góc độ phỏng vấn, bạn có thể kết hợp đọc cùng các bài viết sau:

- [Giải thích chi tiết cấu trúc dữ liệu tuyến tính](../../cs-basics/data-structure/linear-data-structure.md): Hiểu mối quan hệ giữa List, queue và linked list.
- [Tổng hợp câu hỏi phỏng vấn về Hash Table](../../cs-basics/data-structure/hash-table.md): Hiểu cách tìm kiếm và xử lý xung đột của các cấu trúc như Hash, Set.
- [Tổng hợp câu hỏi phỏng vấn về Skip List](../../cs-basics/data-structure/skip-list.md): Hiểu sự đánh đổi cấu trúc đằng sau khả năng truy vấn theo khoảng và xếp hạng của Sorted Set.

## Tham khảo

- Redis Data Structures: <https://redis.com/redis-enterprise/data-structures/> .
- Redis Commands: <https://redis.io/commands/> .
- Redis Data types tutorial: <https://redis.io/docs/manual/data-types/data-types-tutorial/> .
- Lưu trữ thông tin đối tượng trong Redis dùng Hash hay String: <https://segmentfault.com/a/1190000040032006>

<!-- @include: @article-footer.snippet.md -->
