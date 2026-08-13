---
title: Giải thích chi tiết 3 kiểu dữ liệu đặc biệt của Redis
description: Giải thích chi tiết cách sử dụng và kịch bản ứng dụng của 3 kiểu dữ liệu đặc biệt trong Redis gồm Bitmap, HyperLogLog, GEO, bao gồm cài đặt các kịch bản nghiệp vụ điển hình như thống kê điểm danh, thống kê UV, người ở gần.
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Kiểu dữ liệu đặc biệt của Redis,Bitmap,HyperLogLog,GEO,Bitmap,Thống kê cardinality,Vị trí địa lý,Thống kê điểm danh,Thống kê UV
---

Ngoài 5 kiểu dữ liệu cơ bản, Redis còn hỗ trợ 3 kiểu dữ liệu đặc biệt: Bitmap, HyperLogLog, GEO.

## Bitmap (bitmap)

### Giới thiệu

Theo giới thiệu trên trang chủ chính thức:

> Bitmaps are not an actual data type, but a set of bit-oriented operations defined on the String type which is treated like a bit vector. Since strings are binary safe blobs and their maximum length is 512 MB, they are suitable to set up to 2^32 different bits.
>
> Bitmap không phải là một kiểu dữ liệu thực sự trong Redis, mà là một tập hợp các phép toán hướng bit (bit-oriented operations) được định nghĩa trên kiểu String, trong đó String được xem như một vector bit. Vì chuỗi là các blob an toàn nhị phân (binary safe) và độ dài tối đa là 512 MB, chúng phù hợp để thiết lập tối đa 2^32 bit khác nhau.

Bitmap lưu trữ các số nhị phân liên tục (0 và 1). Thông qua Bitmap, chỉ cần một bit để biểu diễn giá trị hoặc trạng thái tương ứng của một phần tử nào đó, key chính là bản thân phần tử tương ứng. Chúng ta biết rằng 8 bit có thể tạo thành một byte, vì vậy bản thân Bitmap sẽ tiết kiệm rất lớn không gian lưu trữ.

Bạn có thể xem Bitmap như một mảng lưu trữ các số nhị phân (0 và 1), index của mỗi phần tử trong mảng được gọi là offset (độ lệch).

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220720194154133.png)

### Các lệnh thường dùng

| Lệnh                                  | Giới thiệu                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| SETBIT key offset value               | Đặt giá trị tại vị trí offset chỉ định                                                        |
| GETBIT key offset                     | Lấy giá trị tại vị trí offset chỉ định                                                        |
| BITCOUNT key start end                | Lấy số lượng phần tử có giá trị bằng 1 giữa start và end                                      |
| BITOP operation destkey key1 key2 ... | Thực hiện phép toán trên một hoặc nhiều Bitmap, các phép toán khả dụng là AND, OR, XOR và NOT |

**Minh họa thao tác cơ bản với Bitmap**:

```bash
# SETBIT sẽ trả về giá trị bit trước đó (mặc định là 0), ở đây sẽ tạo ra 7 bit
> SETBIT mykey 7 1
(integer) 0
> SETBIT mykey 7 0
(integer) 1
> GETBIT mykey 7
(integer) 0
> SETBIT mykey 6 1
(integer) 0
> SETBIT mykey 8 1
(integer) 0
# Thông qua bitcount để thống kê số lượng bit được đặt bằng 1.
> BITCOUNT mykey
(integer) 2
```

### Kịch bản ứng dụng

**Kịch bản cần lưu thông tin trạng thái (chỉ cần 0/1 để biểu diễn)**

- Ví dụ: tình trạng điểm danh của người dùng, tình trạng người dùng hoạt động, thống kê hành vi người dùng (ví dụ đã thích một video nào đó hay chưa).
- Lệnh liên quan: `SETBIT`, `GETBIT`, `BITCOUNT`, `BITOP`.

## HyperLogLog (thống kê cardinality)

### Giới thiệu

HyperLogLog là một thuật toán xác suất đếm cardinality (cardinality counting) nổi tiếng, được tối ưu và cải tiến dựa trên LogLog Counting (LLC), không phải là thứ đặc trưng của Redis. Redis chỉ cài đặt thuật toán này và cung cấp một số API dùng được ngay.

HyperLogLog mà Redis cung cấp chiếm không gian vô cùng nhỏ, chỉ cần 12k không gian là có thể lưu trữ gần `2^64` phần tử khác nhau. Điều này thật sự rất ấn tượng, đây chính là sức hấp dẫn của toán học! Hơn nữa, Redis đã tối ưu cấu trúc lưu trữ của HyperLogLog, áp dụng hai cách để đếm:

- **Ma trận thưa (sparse matrix)**: Khi số đếm còn ít, chiếm rất ít không gian.
- **Ma trận dày (dense matrix)**: Khi số đếm đạt đến một ngưỡng nào đó, chiếm 12k không gian.

Trong tài liệu chính thức của Redis có phần giải thích chi tiết tương ứng:

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220721091424563.png)

Thuật toán xác suất đếm cardinality để tiết kiệm bộ nhớ sẽ không lưu trữ trực tiếp dữ liệu gốc, mà thông qua một số phương pháp thống kê xác suất để ước tính giá trị cardinality (số phần tử chứa trong tập hợp). Vì vậy, kết quả đếm của HyperLogLog không phải là một giá trị chính xác, mà tồn tại một sai số nhất định (sai số chuẩn là `0.81%`).

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220720194154133.png)

Cách sử dụng HyperLogLog rất đơn giản, nhưng nguyên lý lại rất phức tạp. Về nguyên lý của HyperLogLog và cách cài đặt trong Redis, có thể xem bài viết này: [Giải thích nguyên lý thuật toán HyperLogLog và cách Redis ứng dụng nó](https://juejin.cn/post/6844903785744056333) .

Ngoài ra, xin giới thiệu một công cụ có thể giúp hiểu nguyên lý của HyperLogLog: [Sketch of the Day: HyperLogLog — Cornerstone of a Big Data Infrastructure](http://content.research.neustar.biz/blog/hll.html) .

Ngoài HyperLogLog, Redis còn cung cấp các cấu trúc dữ liệu xác suất (probabilistic data structure) khác, địa chỉ tài liệu chính thức tương ứng: <https://redis.io/docs/data-types/probabilistic/> .

### Các lệnh thường dùng

Các lệnh liên quan đến HyperLogLog rất ít, thường dùng nhất cũng chỉ có 3 lệnh.

| Lệnh                                      | Giới thiệu                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| PFADD key element1 element2 ...           | Thêm một hoặc nhiều phần tử vào HyperLogLog                                                                  |
| PFCOUNT key1 key2                         | Lấy số đếm duy nhất (unique count) của một hoặc nhiều HyperLogLog.                                           |
| PFMERGE destkey sourcekey1 sourcekey2 ... | Hợp nhất nhiều HyperLogLog vào destkey, destkey sẽ kết hợp nhiều nguồn để tính ra số đếm duy nhất tương ứng. |

**Minh họa thao tác cơ bản với HyperLogLog**:

```bash
> PFADD hll foo bar zap
(integer) 1
> PFADD hll zap zap zap
(integer) 0
> PFADD hll foo bar
(integer) 0
> PFCOUNT hll
(integer) 3
> PFADD some-other-hll 1 2 3
(integer) 1
> PFCOUNT hll some-other-hll
(integer) 6
> PFMERGE desthll hll some-other-hll
"OK"
> PFCOUNT desthll
(integer) 6
```

### Kịch bản ứng dụng

**Kịch bản đếm với số lượng khổng lồ (từ mức hàng triệu, hàng chục triệu trở lên)**

- Ví dụ: thống kê số ip truy cập hàng ngày/hàng tuần/hàng tháng của các website nổi tiếng, thống kê uv của các bài đăng nổi tiếng.
- Lệnh liên quan: `PFADD`, `PFCOUNT` .

## Geospatial (vị trí địa lý)

### Giới thiệu

Geospatial index (chỉ mục không gian địa lý, viết tắt là GEO) chủ yếu dùng để lưu trữ thông tin vị trí địa lý, được cài đặt dựa trên Sorted Set.

Thông qua GEO, chúng ta có thể dễ dàng thực hiện tính khoảng cách giữa hai vị trí, lấy các phần tử ở gần một vị trí chỉ định, v.v.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220720194359494.png)

### Các lệnh thường dùng

| Lệnh                                             | Giới thiệu                                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| GEOADD key longitude1 latitude1 member1 ...      | Thêm thông tin kinh độ, vĩ độ tương ứng của một hoặc nhiều phần tử vào GEO                                                                      |
| GEOPOS key member1 member2 ...                   | Trả về thông tin kinh độ, vĩ độ của các phần tử được đưa vào                                                                                    |
| GEODIST key member1 member2 M/KM/FT/MI           | Trả về khoảng cách giữa hai phần tử được đưa vào                                                                                                |
| GEORADIUS key longitude latitude radius distance | Lấy các phần tử khác trong phạm vi distance gần vị trí chỉ định, hỗ trợ các tham số ASC (từ gần đến xa), DESC (từ xa đến gần), Count (số lượng) |
| GEORADIUSBYMEMBER key member radius distance     | Tương tự lệnh GEORADIUS, chỉ khác là điểm trung tâm tham chiếu là một phần tử trong GEO                                                         |

**Thao tác cơ bản**:

```bash
> GEOADD personLocation 116.33 39.89 user1 116.34 39.90 user2 116.35 39.88 user3
3
> GEOPOS personLocation user1
116.3299986720085144
39.89000061669732844
> GEODIST personLocation user1 user2 km
1.4018
```

Thông qua công cụ trực quan hóa Redis để xem `personLocation`, quả nhiên tầng dưới chính là Sorted Set.

Dữ liệu kinh độ, vĩ độ của thông tin vị trí địa lý được lưu trong GEO được chuyển đổi thành một số nguyên thông qua thuật toán GeoHash, số nguyên này được sử dụng làm score (tham số trọng số) của Sorted Set.

![](https://oss.javaguide.cn/github/javaguide/database/redis/image-20220721201545147.png)

**Lấy các phần tử khác trong phạm vi vị trí chỉ định**:

```bash
> GEORADIUS personLocation 116.33 39.87 3 km
user3
user1
> GEORADIUS personLocation 116.33 39.87 2 km
> GEORADIUS personLocation 116.33 39.87 5 km
user3
user1
user2
> GEORADIUSBYMEMBER personLocation user1 5 km
user3
user1
user2
> GEORADIUSBYMEMBER personLocation user1 2 km
user1
user2
```

Về phân tích nguyên lý tầng dưới của lệnh `GEORADIUS`, có thể xem bài viết này của Alibaba: [Rốt cuộc Redis thực hiện chức năng "người ở gần" như thế nào?](https://juejin.cn/post/6844903966061363207) .

**Xóa phần tử**:

Tầng dưới của GEO là Sorted Set, bạn có thể sử dụng các lệnh liên quan đến Sorted Set đối với GEO.

```bash
> ZREM personLocation user1
1
> ZRANGE personLocation 0 -1
user3
user2
> ZSCORE personLocation user2
4069879562983946
```

### Kịch bản ứng dụng

**Kịch bản cần quản lý và sử dụng dữ liệu không gian địa lý**

- Ví dụ: người ở gần.
- Lệnh liên quan: `GEOADD`, `GEORADIUS`, `GEORADIUSBYMEMBER` .

## Tổng kết

| Kiểu dữ liệu     | Giải thích                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bitmap           | Bạn có thể xem Bitmap như một mảng lưu trữ các số nhị phân (0 và 1), index của mỗi phần tử trong mảng được gọi là offset (độ lệch). Thông qua Bitmap, chỉ cần một bit để biểu diễn giá trị hoặc trạng thái tương ứng của một phần tử nào đó, key chính là bản thân phần tử tương ứng. Chúng ta biết rằng 8 bit có thể tạo thành một byte, vì vậy bản thân Bitmap sẽ tiết kiệm rất lớn không gian lưu trữ. |
| HyperLogLog      | HyperLogLog mà Redis cung cấp chiếm không gian vô cùng nhỏ, chỉ cần 12k không gian là có thể lưu trữ gần `2^64` phần tử khác nhau. Tuy nhiên, kết quả đếm của HyperLogLog không phải là một giá trị chính xác, mà tồn tại một sai số nhất định (sai số chuẩn là `0.81%`).                                                                                                                                 |
| Geospatial index | Geospatial index (chỉ mục không gian địa lý, viết tắt là GEO) chủ yếu dùng để lưu trữ thông tin vị trí địa lý, được cài đặt dựa trên Sorted Set.                                                                                                                                                                                                                                                          |

## Tham khảo

- Redis Data Structures: <https://redis.com/redis-enterprise/data-structures/> .
- 《Redis 深度冒险：核心原理与应用实践》1.6 四两拨千斤——HyperLogLog
- Bloom Filter, Bitmap, HyperLogLog: <https://hogwartsrico.github.io/2020/06/08/BloomFilter-HyperLogLog-BitMap/index.html>

<!-- @include: @article-footer.snippet.md -->
