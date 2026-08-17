---
title: Tổng hợp câu hỏi phỏng vấn SQL thường gặp (1)
description: Phần đầu tiên của chuỗi câu hỏi phỏng vấn SQL thường gặp, bao gồm truy vấn dữ liệu với SELECT, lọc dữ liệu với WHERE, sắp xếp với ORDER BY, loại bỏ trùng lặp với DISTINCT, phân trang với LIMIT và các thao tác truy vấn cơ bản khác, kèm theo phân tích đề thi thực tế từ Nowcoder.
category: Cơ sở dữ liệu
tag:
  - Cơ sở dữ liệu
  - SQL
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn SQL,Truy vấn SELECT,Điều kiện WHERE,Sắp xếp ORDER BY,Loại bỏ trùng lặp DISTINCT,Phân trang LIMIT,SQL cơ bản
---

> Đề bài lấy từ: [牛客题霸 - SQL 必知必会](https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=298)

## Truy vấn dữ liệu

`SELECT` được dùng để truy vấn dữ liệu từ cơ sở dữ liệu.

### Truy vấn tất cả ID từ bảng Customers

Cho bảng `Customers` như sau:

| cust_id |
| ------- |
| A       |
| B       |
| C       |

Hãy viết câu lệnh SQL để truy vấn tất cả `cust_id` từ bảng `Customers`.

Đáp án:

```sql
SELECT cust_id
FROM Customers
```

### Truy vấn và liệt kê danh sách các sản phẩm đã được đặt hàng

Bảng `OrderItems` có cột `prod_id` khác rỗng, đại diện cho id sản phẩm, chứa tất cả các sản phẩm đã được đặt hàng (một số sản phẩm đã được đặt nhiều lần).

| prod_id |
| ------- |
| a1      |
| a2      |
| a3      |
| a4      |
| a5      |
| a6      |
| a7      |

Hãy viết câu lệnh SQL để truy vấn và liệt kê danh sách đã loại bỏ trùng lặp của tất cả các sản phẩm đã được đặt hàng (`prod_id`).

Đáp án:

```sql
SELECT DISTINCT prod_id
FROM OrderItems
```

Kiến thức: `DISTINCT` được dùng để trả về các giá trị duy nhất (không trùng lặp) trong một cột.

### Truy vấn tất cả các cột

Cho bảng `Customers` (bảng có cột `cust_id` đại diện cho id khách hàng, `cust_name` đại diện cho tên khách hàng)

| cust_id | cust_name |
| ------- | --------- |
| a1      | andy      |
| a2      | ben       |
| a3      | tony      |
| a4      | tom       |
| a5      | an        |
| a6      | lee       |
| a7      | hex       |

Hãy viết câu lệnh SQL để truy vấn tất cả các cột.

Đáp án:

```sql
SELECT cust_id, cust_name
FROM Customers
```

## Sắp xếp dữ liệu truy vấn

`ORDER BY` được dùng để sắp xếp tập kết quả theo một hoặc nhiều cột. Mặc định các bản ghi được sắp xếp theo thứ tự tăng dần; nếu cần sắp xếp theo thứ tự giảm dần, có thể dùng từ khóa `DESC`.

### Truy vấn tên khách hàng và sắp xếp

Cho bảng `Customers`, trong đó `cust_id` đại diện cho id khách hàng, `cust_name` đại diện cho tên khách hàng.

| cust_id | cust_name |
| ------- | --------- |
| a1      | andy      |
| a2      | ben       |
| a3      | tony      |
| a4      | tom       |
| a5      | an        |
| a6      | lee       |
| a7      | hex       |

Truy vấn tất cả tên khách hàng (`cust_name`) từ `Customers` và hiển thị kết quả theo thứ tự từ Z đến A.

Đáp án:

```sql
SELECT cust_name
FROM Customers
ORDER BY cust_name DESC
```

### Sắp xếp theo ID khách hàng và ngày đặt hàng

Cho bảng `Orders`:

| cust_id | order_num | order_date          |
| ------- | --------- | ------------------- |
| andy    | aaaa      | 2021-01-01 00:00:00 |
| andy    | bbbb      | 2021-01-01 12:00:00 |
| bob     | cccc      | 2021-01-10 12:00:00 |
| dick    | dddd      | 2021-01-11 00:00:00 |

Hãy viết câu lệnh SQL để truy vấn ID khách hàng (`cust_id`) và số đơn hàng (`order_num`) từ bảng `Orders`, trước tiên sắp xếp kết quả theo ID khách hàng, sau đó sắp xếp theo ngày đặt hàng theo thứ tự giảm dần.

Đáp án:

```sql
# Sắp xếp theo tên cột
# Chú ý: sắp xếp giảm dần theo order_date, chứ không phải order_num
SELECT cust_id, order_num
FROM Orders
ORDER BY cust_id,order_date DESC
```

Kiến thức: Khi `order by` sắp xếp theo nhiều cột, cột cần sắp xếp trước đặt ở phía trước, cột sắp xếp sau đặt ở phía sau. Và các cột khác nhau có thể có quy tắc sắp xếp khác nhau.

### Sắp xếp theo số lượng và giá

Giả sử có bảng `OrderItems`:

| quantity | item_price |
| -------- | ---------- |
| 1        | 100        |
| 10       | 1003       |
| 2        | 500        |

Hãy viết câu lệnh SQL để hiển thị số lượng (`quantity`) và giá (`item_price`) trong bảng `OrderItems`, sắp xếp theo số lượng từ nhiều đến ít, rồi theo giá từ cao đến thấp.

Đáp án:

```sql
SELECT quantity, item_price
FROM OrderItems
ORDER BY quantity DESC,item_price DESC
```

### Kiểm tra câu lệnh SQL

Cho bảng `Vendors`:

| vend_name |
| --------- |
| 海底捞    |
| 小龙坎    |
| 大龙燚    |

Câu lệnh SQL dưới đây có vấn đề không? Hãy sửa lại cho đúng để nó có thể chạy chính xác, và kết quả trả về được sắp xếp theo `vend_name` theo thứ tự giảm dần.

```sql
SELECT vend_name,
FROM Vendors
ORDER vend_name DESC
```

Sau khi sửa:

```sql
SELECT vend_name
FROM Vendors
ORDER BY vend_name DESC
```

Kiến thức:

- Dấu phẩy dùng để phân tách giữa các cột với nhau.
- ORDER BY phải có BY, cần viết đầy đủ và đặt đúng vị trí.

## Lọc dữ liệu

`WHERE` có thể lọc dữ liệu trả về.

Các toán tử dưới đây có thể được sử dụng trong mệnh đề `WHERE`:

| Toán tử | Mô tả                                                                                        |
| :------ | :------------------------------------------------------------------------------------------- |
| =       | Bằng                                                                                         |
| <>      | Không bằng. **Chú thích:** Trong một số phiên bản SQL, toán tử này có thể được viết thành != |
| >       | Lớn hơn                                                                                      |
| <       | Nhỏ hơn                                                                                      |
| >=      | Lớn hơn hoặc bằng                                                                            |
| <=      | Nhỏ hơn hoặc bằng                                                                            |
| BETWEEN | Nằm trong một khoảng nào đó                                                                  |
| LIKE    | Tìm kiếm theo một mẫu (pattern) nào đó                                                       |
| IN      | Chỉ định nhiều giá trị có thể có cho một cột                                                 |

### Trả về các sản phẩm có giá cố định

Cho bảng `Products`:

| prod_id | prod_name      | prod_price |
| ------- | -------------- | ---------- |
| a0018   | sockets        | 9.49       |
| a0019   | iphone13       | 600        |
| b0018   | gucci t-shirts | 1000       |

【Câu hỏi】Truy vấn ID sản phẩm (`prod_id`) và tên sản phẩm (`prod_name`) từ bảng `Products`, chỉ trả về các sản phẩm có giá 9.49 đô la.

Đáp án:

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_price = 9.49
```

### Trả về các sản phẩm có giá cao hơn

Cho bảng `Products`:

| prod_id | prod_name      | prod_price |
| ------- | -------------- | ---------- |
| a0018   | sockets        | 9.49       |
| a0019   | iphone13       | 600        |
| b0019   | gucci t-shirts | 1000       |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn ID sản phẩm (`prod_id`) và tên sản phẩm (`prod_name`) từ bảng `Products`, chỉ trả về các sản phẩm có giá 9 đô la hoặc cao hơn.

Đáp án:

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_price >= 9
```

### Trả về sản phẩm và sắp xếp theo giá

Cho bảng `Products`:

| prod_id | prod_name | prod_price |
| ------- | --------- | ---------- |
| a0011   | egg       | 3          |
| a0019   | sockets   | 4          |
| b0019   | coffee    | 15         |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về tên sản phẩm (`prod_name`) và giá (`prod_price`) của tất cả các sản phẩm trong bảng `Products` có giá từ 3 đô la đến 6 đô la, sau đó sắp xếp kết quả theo giá.

Đáp án:

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 3 AND 6
ORDER BY prod_price

# Hoặc
SELECT prod_name, prod_price
FROM Products
WHERE prod_price >= 3 AND prod_price <= 6
ORDER BY prod_price
```

### Trả về nhiều sản phẩm hơn

Bảng `OrderItems` gồm có: số đơn hàng `order_num`, số lượng sản phẩm `quantity`

| order_num | quantity |
| --------- | -------- |
| a1        | 105      |
| a2        | 1100     |
| a2        | 200      |
| a4        | 1121     |
| a5        | 10       |
| a2        | 19       |
| a7        | 5        |

【Câu hỏi】Truy vấn tất cả các số đơn hàng (`order_num`) khác nhau và không trùng lặp từ bảng `OrderItems`, trong đó mỗi đơn hàng phải chứa từ 100 sản phẩm trở lên.

Đáp án:

```sql
SELECT order_num
FROM OrderItems
GROUP BY order_num
HAVING SUM(quantity) >= 100
```

## Lọc dữ liệu nâng cao

Toán tử `AND` và `OR` được dùng để lọc bản ghi dựa trên nhiều hơn một điều kiện, cả hai có thể được sử dụng kết hợp. `AND` yêu cầu cả 2 điều kiện đều phải đúng, còn `OR` chỉ cần 1 trong 2 điều kiện đúng là đủ.

### Truy vấn tên nhà cung cấp

Bảng `Vendors` có các trường tên nhà cung cấp (`vend_name`), quốc gia của nhà cung cấp (`vend_country`), bang của nhà cung cấp (`vend_state`)

| vend_name | vend_country | vend_state |
| --------- | ------------ | ---------- |
| apple     | USA          | CA         |
| vivo      | CNA          | shenzhen   |
| huawei    | CNA          | xian       |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn tên nhà cung cấp (`vend_name`) từ bảng `Vendors`, chỉ trả về các nhà cung cấp ở bang California (điều này đòi hỏi lọc theo quốc gia [USA] và bang [CA], vì biết đâu ở quốc gia khác cũng tồn tại một bang tên là CA)

Đáp án:

```sql
SELECT vend_name
FROM Vendors
WHERE vend_country = 'USA' AND vend_state = 'CA'
```

### Truy vấn và liệt kê danh sách các sản phẩm đã được đặt hàng

Bảng `OrderItems` chứa tất cả các sản phẩm đã được đặt hàng (một số sản phẩm đã được đặt nhiều lần).

| prod_id | order_num | quantity |
| ------- | --------- | -------- |
| BR01    | a1        | 105      |
| BR02    | a2        | 1100     |
| BR02    | a2        | 200      |
| BR03    | a4        | 1121     |
| BR017   | a5        | 10       |
| BR02    | a2        | 19       |
| BR017   | a7        | 5        |

【Câu hỏi】Hãy viết câu lệnh SQL để tìm tất cả các đơn hàng đã đặt sản phẩm `BR01`, `BR02` hoặc `BR03` với số lượng ít nhất 100. Bạn cần trả về số đơn hàng (`order_num`), ID sản phẩm (`prod_id`) và số lượng (`quantity`) của bảng `OrderItems`, đồng thời lọc theo ID sản phẩm và số lượng.

Đáp án:

```sql
SELECT order_num, prod_id, quantity
FROM OrderItems
WHERE prod_id IN ('BR01', 'BR02', 'BR03') AND quantity >= 100
```

### Trả về tên và giá của tất cả sản phẩm có giá từ 3 đô la đến 6 đô la

Cho bảng `Products`:

| prod_id | prod_name | prod_price |
| ------- | --------- | ---------- |
| a0011   | egg       | 3          |
| a0019   | sockets   | 4          |
| b0019   | coffee    | 15         |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về tên sản phẩm (`prod_name`) và giá (`prod_price`) của tất cả các sản phẩm có giá từ 3 đô la đến 6 đô la, sử dụng toán tử AND, sau đó sắp xếp kết quả theo giá theo thứ tự tăng dần.

Đáp án:

```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price >= 3 and prod_price <= 6
ORDER BY prod_price
```

### Kiểm tra câu lệnh SQL

Bảng nhà cung cấp `Vendors` có các trường tên nhà cung cấp `vend_name`, quốc gia của nhà cung cấp `vend_country`, bang của nhà cung cấp `vend_state`

| vend_name | vend_country | vend_state |
| --------- | ------------ | ---------- |
| apple     | USA          | CA         |
| vivo      | CNA          | shenzhen   |
| huawei    | CNA          | xian       |

【Câu hỏi】Sửa lại câu lệnh SQL dưới đây cho đúng để nó trả về kết quả chính xác.

```sql
SELECT vend_name
FROM Vendors
ORDER BY vend_name
WHERE vend_country = 'USA' AND vend_state = 'CA';
```

Sau khi sửa:

```sql
SELECT vend_name
FROM Vendors
WHERE vend_country = 'USA' AND vend_state = 'CA'
ORDER BY vend_name
```

Câu lệnh `ORDER BY` phải được đặt sau `WHERE`.

## Lọc dữ liệu bằng ký tự đại diện (Wildcard)

Ký tự đại diện (Wildcard) trong SQL phải được sử dụng cùng với toán tử `LIKE`

Trong SQL, có thể sử dụng các ký tự đại diện sau:

| Ký tự đại diện                   | Mô tả                                                |
| :------------------------------- | :--------------------------------------------------- |
| `%`                              | Đại diện cho không hoặc nhiều ký tự                  |
| `_`                              | Chỉ thay thế một ký tự duy nhất                      |
| `[charlist]`                     | Bất kỳ ký tự đơn nào trong danh sách ký tự           |
| `[^charlist]` hoặc `[!charlist]` | Bất kỳ ký tự đơn nào không nằm trong danh sách ký tự |

### Truy vấn tên sản phẩm và mô tả (phần 1)

Bảng `Products` như sau:

| prod_name | prod_desc      |
| --------- | -------------- |
| a0011     | usb            |
| a0019     | iphone13       |
| b0019     | gucci t-shirts |
| c0019     | gucci toy      |
| d0019     | lego toy       |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn tên sản phẩm (`prod_name`) và mô tả (`prod_desc`) từ bảng `Products`, chỉ trả về tên các sản phẩm có phần mô tả chứa từ `toy`.

Đáp án:

```sql
SELECT prod_name, prod_desc
FROM Products
WHERE prod_desc LIKE '%toy%'
```

### Truy vấn tên sản phẩm và mô tả (phần 2)

Bảng `Products` như sau:

| prod_name | prod_desc      |
| --------- | -------------- |
| a0011     | usb            |
| a0019     | iphone13       |
| b0019     | gucci t-shirts |
| c0019     | gucci toy      |
| d0019     | lego toy       |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn tên sản phẩm (`prod_name`) và mô tả (`prod_desc`) từ bảng `Products`, chỉ trả về các sản phẩm mà phần mô tả không chứa từ `toy`, cuối cùng sắp xếp kết quả theo "tên sản phẩm".

Đáp án:

```sql
SELECT prod_name, prod_desc
FROM Products
WHERE prod_desc NOT LIKE '%toy%'
ORDER BY prod_name
```

### Truy vấn tên sản phẩm và mô tả (phần 3)

Bảng `Products` như sau:

| prod_name | prod_desc        |
| --------- | ---------------- |
| a0011     | usb              |
| a0019     | iphone13         |
| b0019     | gucci t-shirts   |
| c0019     | gucci toy        |
| d0019     | lego carrots toy |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn tên sản phẩm (`prod_name`) và mô tả (`prod_desc`) từ bảng `Products`, chỉ trả về các sản phẩm có phần mô tả đồng thời chứa cả `toy` và `carrots`. Có nhiều cách để thực hiện thao tác này, nhưng với bài tập thử thách này, hãy sử dụng `AND` và hai phép so sánh `LIKE`.

Đáp án:

```sql
SELECT prod_name, prod_desc
FROM Products
WHERE prod_desc LIKE '%toy%' AND prod_desc LIKE "%carrots%"
```

### Truy vấn tên sản phẩm và mô tả (phần 4)

Bảng `Products` như sau:

| prod_name | prod_desc        |
| --------- | ---------------- |
| a0011     | usb              |
| a0019     | iphone13         |
| b0019     | gucci t-shirts   |
| c0019     | gucci toy        |
| d0019     | lego toy carrots |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn tên sản phẩm (prod_name) và mô tả (prod_desc) từ bảng Products, chỉ trả về các sản phẩm có phần mô tả đồng thời chứa cả toy và carrots theo **thứ tự trước sau**. Gợi ý: chỉ cần dùng `LIKE` với ba ký hiệu `%` là đủ.

Đáp án:

```sql
SELECT prod_name, prod_desc
FROM Products
WHERE prod_desc LIKE '%toy%carrots%'
```

## Tạo trường tính toán (Calculated Field)

### Bí danh (Alias)

Cách dùng phổ biến của bí danh (Alias) là đổi tên các trường cột của bảng trong kết quả truy vấn (để phù hợp với yêu cầu báo cáo cụ thể hoặc yêu cầu của khách hàng). Cho bảng `Vendors` đại diện cho thông tin nhà cung cấp, gồm `vend_id` là id nhà cung cấp, `vend_name` là tên nhà cung cấp, `vend_address` là địa chỉ nhà cung cấp, `vend_city` là thành phố của nhà cung cấp.

| vend_id | vend_name     | vend_address | vend_city |
| ------- | ------------- | ------------ | --------- |
| a001    | tencent cloud | address1     | shenzhen  |
| a002    | huawei cloud  | address2     | dongguan  |
| a003    | aliyun cloud  | address3     | hangzhou  |
| a003    | netease cloud | address4     | guangzhou |

【Câu hỏi】Hãy viết câu lệnh SQL để truy vấn `vend_id`, `vend_name`, `vend_address` và `vend_city` từ bảng `Vendors`, đổi tên `vend_name` thành `vname`, đổi tên `vend_city` thành `vcity`, đổi tên `vend_address` thành `vaddress`, và sắp xếp kết quả theo tên nhà cung cấp theo thứ tự tăng dần.

Đáp án:

```sql
SELECT vend_id, vend_name AS vname, vend_address AS vaddress, vend_city AS vcity
FROM Vendors
ORDER BY vname
# as có thể được lược bỏ
SELECT vend_id, vend_name vname, vend_address vaddress, vend_city vcity
FROM Vendors
ORDER BY vname
```

### Giảm giá

Cửa hàng mẫu của chúng ta đang có chương trình khuyến mãi giảm giá, tất cả sản phẩm đều giảm 10%. Bảng `Products` chứa `prod_id` là id sản phẩm, `prod_price` là giá sản phẩm.

【Câu hỏi】Hãy viết câu lệnh SQL để trả về `prod_id`, `prod_price` và `sale_price` từ bảng `Products`. `sale_price` là một trường tính toán chứa giá khuyến mãi. Gợi ý: có thể nhân với 0.9 để được 90% giá gốc (tức giảm giá 10%).

Đáp án:

```sql
SELECT prod_id, prod_price, prod_price * 0.9 AS sale_price
FROM Products
```

Chú ý: `sale_price` là tên đặt cho kết quả tính toán, chứ không phải tên cột có sẵn.

## Sử dụng hàm để xử lý dữ liệu

### Tên đăng nhập của khách hàng

Cửa hàng của chúng ta đã đi vào hoạt động và đang tạo tài khoản khách hàng. Tất cả người dùng đều cần tên đăng nhập, tên đăng nhập mặc định là sự kết hợp giữa tên của họ và thành phố nơi họ sống.

Cho bảng `Customers` như sau:

| cust_id | cust_name | cust_contact | cust_city |
| ------- | --------- | ------------ | --------- |
| a1      | Andy Li   | Andy Li      | Oak Park  |
| a2      | Ben Liu   | Ben Liu      | Oak Park  |
| a3      | Tony Dai  | Tony Dai     | Oak Park  |
| a4      | Tom Chen  | Tom Chen     | Oak Park  |
| a5      | An Li     | An Li        | Oak Park  |
| a6      | Lee Chen  | Lee Chen     | Oak Park  |
| a7      | Hex Liu   | Hex Liu      | Oak Park  |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về ID khách hàng (`cust_id`), tên khách hàng (`cust_name`) và tên đăng nhập (`user_login`), trong đó tên đăng nhập toàn bộ là chữ in hoa, được tạo thành từ hai ký tự đầu tiên của người liên hệ khách hàng (`cust_contact`) và ba ký tự đầu tiên của thành phố nơi khách hàng sống (`cust_city`). Gợi ý: cần sử dụng hàm, phép nối chuỗi và bí danh.

Đáp án:

```sql
SELECT cust_id, cust_name, UPPER(CONCAT(SUBSTRING(cust_contact, 1, 2), SUBSTRING(cust_city, 1, 3))) AS user_login
FROM Customers
```

Kiến thức:

- Hàm cắt chuỗi `SUBSTRING()`: cắt chuỗi, `substring(str ,n ,m)` (n là vị trí bắt đầu cắt, m là số ký tự cần cắt) trả về chuỗi str được cắt m ký tự bắt đầu từ ký tự thứ n;
- Hàm nối chuỗi `CONCAT()`: nối hai hoặc nhiều chuỗi thành một chuỗi, select concat(A,B): nối chuỗi A và chuỗi B.

- Hàm viết hoa `UPPER()`: chuyển chuỗi được chỉ định thành chữ in hoa.

### Trả về số đơn hàng và ngày đặt hàng của tất cả đơn hàng trong tháng 1 năm 2020

Bảng đơn hàng `Orders` như sau:

| order_num | order_date          |
| --------- | ------------------- |
| a0001     | 2020-01-01 00:00:00 |
| a0002     | 2020-01-02 00:00:00 |
| a0003     | 2020-01-01 12:00:00 |
| a0004     | 2020-02-01 00:00:00 |
| a0005     | 2020-03-01 00:00:00 |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về số đơn hàng (`order_num`) và ngày đặt hàng (`order_date`) của tất cả đơn hàng trong tháng 1 năm 2020, và sắp xếp theo ngày đặt hàng theo thứ tự tăng dần

Đáp án:

```sql
SELECT order_num, order_date
FROM Orders
WHERE month(order_date) = '01' AND YEAR(order_date) = '2020'
ORDER BY order_date
```

Cũng có thể dùng ký tự đại diện để làm:

```sql
SELECT order_num, order_date
FROM Orders
WHERE order_date LIKE '2020-01%'
ORDER BY order_date
```

Kiến thức:

- Định dạng ngày: `YYYY-MM-DD`
- Định dạng thời gian: `HH:MM:SS`

Các hàm thường dùng liên quan đến xử lý ngày và thời gian:

| Hàm             | Mô tả                                            |
| --------------- | ------------------------------------------------ |
| `ADDDATE()`     | Cộng thêm một khoảng ngày (ngày, tuần, v.v.)     |
| `ADDTIME()`     | Cộng thêm một khoảng thời gian (giờ, phút, v.v.) |
| `CURDATE()`     | Trả về ngày hiện tại                             |
| `CURTIME()`     | Trả về thời gian hiện tại                        |
| `DATE()`        | Trả về phần ngày của giá trị ngày giờ            |
| `DATEDIFF`      | Tính chênh lệch giữa hai ngày                    |
| `DATE_FORMAT()` | Trả về chuỗi ngày hoặc giờ đã được định dạng     |
| `DAY()`         | Trả về phần ngày trong tháng của một ngày        |
| `DAYOFWEEK()`   | Với một ngày, trả về thứ tương ứng trong tuần    |
| `HOUR()`        | Trả về phần giờ của một thời gian                |
| `MINUTE()`      | Trả về phần phút của một thời gian               |
| `MONTH()`       | Trả về phần tháng của một ngày                   |
| `NOW()`         | Trả về ngày và giờ hiện tại                      |
| `SECOND()`      | Trả về phần giây của một thời gian               |
| `TIME()`        | Trả về phần thời gian của giá trị ngày giờ       |
| `YEAR()`        | Trả về phần năm của một ngày                     |

## Tổng hợp dữ liệu

Các hàm liên quan đến tổng hợp dữ liệu:

| Hàm       | Mô tả                                 |
| --------- | ------------------------------------- |
| `AVG()`   | Trả về giá trị trung bình của một cột |
| `COUNT()` | Trả về số dòng của một cột            |
| `MAX()`   | Trả về giá trị lớn nhất của một cột   |
| `MIN()`   | Trả về giá trị nhỏ nhất của một cột   |
| `SUM()`   | Trả về tổng giá trị của một cột       |

### Xác định tổng số sản phẩm đã bán

Bảng `OrderItems` đại diện cho các sản phẩm đã bán, `quantity` đại diện cho số lượng sản phẩm đã bán.

| quantity |
| -------- |
| 10       |
| 100      |
| 1000     |
| 10001    |
| 2        |
| 15       |

【Câu hỏi】Hãy viết câu lệnh SQL để xác định tổng số sản phẩm đã bán.

Đáp án:

```sql
SELECT Sum(quantity) AS items_ordered
FROM OrderItems
```

### Xác định tổng số sản phẩm đã bán của mặt hàng BR01

Bảng `OrderItems` đại diện cho các sản phẩm đã bán, `quantity` đại diện cho số lượng sản phẩm đã bán, mặt hàng là `prod_id`.

| quantity | prod_id |
| -------- | ------- |
| 10       | AR01    |
| 100      | AR10    |
| 1000     | BR01    |
| 10001    | BR010   |

【Câu hỏi】Hãy sửa lại câu lệnh đã tạo để xác định tổng số sản phẩm đã bán của mặt hàng (`prod_id`) là "BR01".

Đáp án:

```sql
SELECT Sum(quantity) AS items_ordered
FROM OrderItems
WHERE prod_id = 'BR01'
```

### Xác định giá của sản phẩm đắt nhất có giá không quá 10 đô la trong bảng Products

Bảng `Products` như sau, `prod_price` đại diện cho giá sản phẩm.

| prod_price |
| ---------- |
| 9.49       |
| 600        |
| 1000       |

【Câu hỏi】Hãy viết câu lệnh SQL để xác định giá (`prod_price`) của sản phẩm đắt nhất có giá không quá 10 đô la trong bảng `Products`. Đặt tên trường tính toán được là `max_price`.

Đáp án:

```sql
SELECT Max(prod_price) AS max_price
FROM Products
WHERE prod_price <= 10
```

## Nhóm dữ liệu

`GROUP BY`:

- Mệnh đề `GROUP BY` nhóm các bản ghi thành các dòng tổng hợp.
- `GROUP BY` trả về một bản ghi cho mỗi nhóm.
- `GROUP BY` thường liên quan đến các hàm tổng hợp như `COUNT`, `MAX`, `SUM`, `AVG`, v.v.
- `GROUP BY` có thể nhóm theo một hoặc nhiều cột.
- `GROUP BY` sắp xếp theo các trường được nhóm, sau đó `ORDER BY` có thể sắp xếp theo các trường tổng hợp.

`HAVING`:

- `HAVING` được dùng để lọc kết quả `GROUP BY` đã tổng hợp.
- `HAVING` bắt buộc phải dùng cùng với `GROUP BY`.
- `WHERE` và `HAVING` có thể xuất hiện trong cùng một truy vấn.

`HAVING` và `WHERE`:

- `WHERE`: lọc các dòng được chỉ định, phía sau không thể thêm hàm tổng hợp (hàm nhóm).
- `HAVING`: lọc các nhóm, bắt buộc phải dùng cùng với `GROUP BY`, không thể sử dụng đơn lẻ.

### Trả về số dòng của mỗi số đơn hàng

Bảng `OrderItems` chứa mỗi sản phẩm của mỗi đơn hàng

| order_num |
| --------- |
| a002      |
| a002      |
| a002      |
| a004      |
| a007      |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về số dòng (`order_lines`) của mỗi số đơn hàng (`order_num`), và sắp xếp kết quả theo `order_lines` theo thứ tự tăng dần.

Đáp án:

```sql
SELECT order_num, Count(order_num) AS order_lines
FROM OrderItems
GROUP BY order_num
ORDER BY order_lines
```

Kiến thức:

1. `count(*)` và `count(tên cột)` đều được, điểm khác biệt là `count(tên cột)` thống kê số dòng không phải NULL;
2. `order by` được thực thi cuối cùng, nên có thể sử dụng bí danh cột;
3. Khi nhóm và tổng hợp, nhất định đừng quên thêm `group by`, nếu không sẽ chỉ có một dòng kết quả.

### Sản phẩm có chi phí thấp nhất của mỗi nhà cung cấp

Cho bảng `Products`, chứa trường `prod_price` đại diện cho giá sản phẩm, `vend_id` đại diện cho id nhà cung cấp

| vend_id | prod_price |
| ------- | ---------- |
| a0011   | 100        |
| a0019   | 0.1        |
| b0019   | 1000       |
| b0019   | 6980       |
| b0019   | 20         |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về trường có tên `cheapest_item`, trường này chứa sản phẩm có chi phí thấp nhất của mỗi nhà cung cấp (sử dụng `prod_price` trong bảng `Products`), sau đó sắp xếp kết quả theo thứ tự tăng dần từ chi phí thấp nhất đến cao nhất.

Đáp án:

```sql
SELECT vend_id, Min(prod_price) AS cheapest_item
FROM Products
GROUP BY vend_id
ORDER BY cheapest_item
```

### Trả về số đơn hàng của tất cả đơn hàng có tổng số lượng không nhỏ hơn 100

`OrderItems` đại diện cho bảng sản phẩm đơn hàng, bao gồm: số đơn hàng `order_num` và số lượng đơn hàng `quantity`.

| order_num | quantity |
| --------- | -------- |
| a1        | 105      |
| a2        | 1100     |
| a2        | 200      |
| a4        | 1121     |
| a5        | 10       |
| a2        | 19       |
| a7        | 5        |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về số đơn hàng của tất cả đơn hàng có tổng số lượng không nhỏ hơn 100, kết quả cuối cùng được sắp xếp theo số đơn hàng theo thứ tự tăng dần.

Đáp án:

```sql
# Tổng hợp trực tiếp
SELECT order_num
FROM OrderItems
GROUP BY order_num
HAVING Sum(quantity) >= 100
ORDER BY order_num

# Truy vấn con (Subquery)
SELECT a.order_num
FROM (SELECT order_num, Sum(quantity) AS sum_num
    FROM OrderItems
    GROUP BY order_num
    HAVING sum_num >= 100) a
ORDER BY a.order_num
```

Kiến thức:

- `where`: lọc các dòng được chỉ định, phía sau không thể thêm hàm tổng hợp (hàm nhóm).
- `having`: lọc các nhóm, dùng cùng với `group by`, không thể sử dụng đơn lẻ.

### Tính tổng

Bảng `OrderItems` đại diện cho thông tin đơn hàng, bao gồm các trường: số đơn hàng `order_num` và `item_price` giá bán sản phẩm, `quantity` số lượng sản phẩm.

| order_num | item_price | quantity |
| --------- | ---------- | -------- |
| a1        | 10         | 105      |
| a2        | 1          | 1100     |
| a2        | 1          | 200      |
| a4        | 2          | 1121     |
| a5        | 5          | 10       |
| a2        | 1          | 19       |
| a7        | 7          | 5        |

【Câu hỏi】Hãy viết câu lệnh SQL, tổng hợp theo số đơn hàng, trả về tất cả số đơn hàng có tổng giá trị đơn hàng không nhỏ hơn 1000, kết quả cuối cùng được sắp xếp theo số đơn hàng theo thứ tự tăng dần.

Gợi ý: Tổng giá trị = item_price nhân với quantity

Đáp án:

```sql
SELECT order_num, Sum(item_price * quantity) AS total_price
FROM OrderItems
GROUP BY order_num
HAVING total_price >= 1000
ORDER BY order_num
```

### Kiểm tra câu lệnh SQL

Bảng `OrderItems` chứa `order_num` là số đơn hàng

| order_num |
| --------- |
| a002      |
| a002      |
| a002      |
| a004      |
| a007      |

【Câu hỏi】Hãy sửa lại đoạn mã dưới đây cho đúng rồi thực thi

```sql
SELECT order_num, COUNT(*) AS items
FROM OrderItems
GROUP BY items
HAVING COUNT(*) >= 3
ORDER BY items, order_num;
```

Sau khi sửa:

```sql
SELECT order_num, COUNT(*) AS items
FROM OrderItems
GROUP BY order_num
HAVING items >= 3
ORDER BY items, order_num;
```

## Sử dụng truy vấn con (Subquery)

Truy vấn con (Subquery) là truy vấn SQL được lồng bên trong một truy vấn lớn hơn, còn được gọi là truy vấn nội bộ (inner query) hoặc lựa chọn nội bộ (inner select); câu lệnh chứa truy vấn con được gọi là truy vấn bên ngoài (outer query) hoặc lựa chọn bên ngoài (outer select). Nói đơn giản, truy vấn con là việc sử dụng kết quả của một truy vấn `SELECT` (truy vấn con) làm nguồn dữ liệu hoặc điều kiện phán đoán cho một câu lệnh SQL khác (truy vấn chính).

Truy vấn con có thể được nhúng trong các câu lệnh `SELECT`, `INSERT`, `UPDATE` và `DELETE`, và cũng có thể được sử dụng cùng với các toán tử như `=`, `<`, `>`, `IN`, `BETWEEN`, `EXISTS`.

Truy vấn con thường được dùng sau mệnh đề `WHERE` và mệnh đề `FROM`:

- Khi dùng trong mệnh đề `WHERE`, tùy theo toán tử khác nhau, truy vấn con có thể trả về dữ liệu một dòng một cột, nhiều dòng một cột, hoặc một dòng nhiều cột. Truy vấn con cần trả về giá trị có thể dùng làm điều kiện truy vấn của mệnh đề WHERE.
- Khi dùng trong mệnh đề `FROM`, thường trả về dữ liệu nhiều dòng nhiều cột, tương đương với việc trả về một bảng tạm thời, như vậy mới phù hợp với quy tắc phía sau `FROM` là một bảng. Cách làm này có thể thực hiện truy vấn liên hợp nhiều bảng.

> Chú ý: Cơ sở dữ liệu MySQL từ phiên bản 4.1 mới bắt đầu hỗ trợ truy vấn con, các phiên bản trước đó không hỗ trợ.

Cú pháp cơ bản của truy vấn con dùng trong mệnh đề `WHERE` như sau:

```sql
SELECT column_name [, column_name ]
FROM table1 [, table2 ]
WHERE column_name operator
(SELECT column_name [, column_name ]
FROM table1 [, table2 ]
[WHERE])
```

- Truy vấn con cần được đặt trong dấu ngoặc đơn `( )`.
- `operator` đại diện cho toán tử dùng trong mệnh đề `WHERE`, có thể là toán tử so sánh (như `=`, `<`, `>`, `<>`, v.v.) hoặc toán tử logic (như `IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`, v.v.), cụ thể tùy theo yêu cầu.

Cú pháp cơ bản của truy vấn con dùng trong mệnh đề `FROM` như sau:

```sql
SELECT column_name [, column_name ]
FROM (SELECT column_name [, column_name ]
      FROM table1 [, table2 ]
      [WHERE]) AS temp_table_name [, ...]
[JOIN type JOIN table_name ON condition]
WHERE condition;
```

- Kết quả trả về của truy vấn con dùng trong `FROM` tương đương với một bảng tạm thời, nên cần sử dụng từ khóa AS để đặt tên cho bảng tạm thời đó.
- Truy vấn con cần được đặt trong dấu ngoặc đơn `( )`.
- Có thể chỉ định nhiều tên bảng tạm thời và sử dụng câu lệnh `JOIN` để nối các bảng này.

### Trả về danh sách khách hàng đã mua sản phẩm có giá từ 10 đô la trở lên

`OrderItems` đại diện cho bảng sản phẩm đơn hàng, chứa các trường số đơn hàng: `order_num`, giá đơn hàng: `item_price`; bảng `Orders` đại diện cho bảng thông tin đơn hàng, chứa `id` khách hàng: `cust_id` và số đơn hàng: `order_num`

Bảng `OrderItems`:

| order_num | item_price |
| --------- | ---------- |
| a1        | 10         |
| a2        | 1          |
| a2        | 1          |
| a4        | 2          |
| a5        | 5          |
| a2        | 1          |
| a7        | 7          |

Bảng `Orders`:

| order_num | cust_id |
| --------- | ------- |
| a1        | cust10  |
| a2        | cust1   |
| a2        | cust1   |
| a4        | cust2   |
| a5        | cust5   |
| a2        | cust1   |
| a7        | cust7   |

【Câu hỏi】Sử dụng truy vấn con để trả về danh sách khách hàng đã mua sản phẩm có giá từ 10 đô la trở lên, kết quả không cần sắp xếp.

Đáp án:

```sql
SELECT cust_id
FROM Orders
WHERE order_num IN (SELECT DISTINCT order_num
    FROM OrderItems
    where item_price >= 10)
```

### Xác định những đơn hàng nào đã mua sản phẩm có prod_id là BR01 (phần 1)

Bảng `OrderItems` đại diện cho bảng thông tin sản phẩm đơn hàng, `prod_id` là id sản phẩm; bảng `Orders` đại diện cho bảng đơn hàng, có `cust_id` đại diện cho id khách hàng và ngày đặt hàng `order_date`

Bảng `OrderItems`:

| prod_id | order_num |
| ------- | --------- |
| BR01    | a0001     |
| BR01    | a0002     |
| BR02    | a0003     |
| BR02    | a0013     |

Bảng `Orders`:

| order_num | cust_id | order_date          |
| --------- | ------- | ------------------- |
| a0001     | cust10  | 2022-01-01 00:00:00 |
| a0002     | cust1   | 2022-01-01 00:01:00 |
| a0003     | cust1   | 2022-01-02 00:00:00 |
| a0013     | cust2   | 2022-01-01 00:20:00 |

【Câu hỏi】

Hãy viết câu lệnh SQL, sử dụng truy vấn con để xác định những đơn hàng nào (trong `OrderItems`) đã mua sản phẩm có `prod_id` là "BR01", sau đó trả về ID khách hàng (`cust_id`) và ngày đặt hàng (`order_date`) tương ứng với mỗi sản phẩm từ bảng `Orders`, sắp xếp kết quả theo ngày đặt hàng theo thứ tự tăng dần.

Đáp án:

```sql
# Cách viết 1: Truy vấn con
SELECT cust_id,order_date
FROM Orders
WHERE order_num IN
    (SELECT order_num
     FROM OrderItems
     WHERE prod_id = 'BR01' )
ORDER BY order_date;

# Cách viết 2: Nối bảng (Join)
SELECT b.cust_id, b.order_date
FROM OrderItems a,Orders b
WHERE a.order_num = b.order_num AND a.prod_id = 'BR01'
ORDER BY order_date
```

### Trả về email của tất cả khách hàng đã mua sản phẩm có prod_id là BR01 (phần 1)

Bạn muốn biết ngày đặt hàng sản phẩm BR01. Cho bảng `OrderItems` đại diện cho bảng thông tin sản phẩm đơn hàng, `prod_id` là id sản phẩm; bảng `Orders` đại diện cho bảng đơn hàng, có `cust_id` đại diện cho id khách hàng và ngày đặt hàng `order_date`; bảng `Customers` chứa `cust_email` là email khách hàng và `cust_id` là id khách hàng

Bảng `OrderItems`:

| prod_id | order_num |
| ------- | --------- |
| BR01    | a0001     |
| BR01    | a0002     |
| BR02    | a0003     |
| BR02    | a0013     |

Bảng `Orders`:

| order_num | cust_id | order_date          |
| --------- | ------- | ------------------- |
| a0001     | cust10  | 2022-01-01 00:00:00 |
| a0002     | cust1   | 2022-01-01 00:01:00 |
| a0003     | cust1   | 2022-01-02 00:00:00 |
| a0013     | cust2   | 2022-01-01 00:20:00 |

Bảng `Customers` đại diện cho thông tin khách hàng, `cust_id` là id khách hàng, `cust_email` là email khách hàng

| cust_id | cust_email        |
| ------- | ----------------- |
| cust10  | <cust10@cust.com> |
| cust1   | <cust1@cust.com>  |
| cust2   | <cust2@cust.com>  |

【Câu hỏi】Trả về email của tất cả khách hàng đã mua sản phẩm có `prod_id` là `BR01` (`cust_email` trong bảng `Customers`), kết quả không cần sắp xếp.

Gợi ý: Bài này liên quan đến câu lệnh `SELECT`, lớp trong cùng trả về `order_num` từ bảng `OrderItems`, lớp giữa trả về `cust_id` từ bảng `Customers`.

Đáp án:

```sql
# Cách viết 1: Truy vấn con
SELECT cust_email
FROM Customers
WHERE cust_id IN (SELECT cust_id
    FROM Orders
    WHERE order_num IN (SELECT order_num
        FROM OrderItems
        WHERE prod_id = 'BR01'))

# Cách viết 2: Nối bảng (inner join)
SELECT c.cust_email
FROM OrderItems a,Orders b,Customers c
WHERE a.order_num = b.order_num AND b.cust_id = c.cust_id AND a.prod_id = 'BR01'

# Cách viết 3: Nối bảng (left join)
SELECT c.cust_email
FROM Orders a LEFT JOIN
  OrderItems b ON a.order_num = b.order_num LEFT JOIN
  Customers c ON a.cust_id = c.cust_id
WHERE b.prod_id = 'BR01'
```

### Trả về tổng số tiền đơn hàng khác nhau của mỗi khách hàng

Chúng ta cần một danh sách ID khách hàng, trong đó chứa tổng số tiền họ đã đặt hàng.

Bảng `OrderItems` đại diện cho thông tin đơn hàng, bảng `OrderItems` có số đơn hàng: `order_num` và giá bán sản phẩm: `item_price`, số lượng sản phẩm: `quantity`.

| order_num | item_price | quantity |
| --------- | ---------- | -------- |
| a0001     | 10         | 105      |
| a0002     | 1          | 1100     |
| a0002     | 1          | 200      |
| a0013     | 2          | 1121     |
| a0003     | 5          | 10       |
| a0003     | 1          | 19       |
| a0003     | 7          | 5        |

Bảng `Orders` có số đơn hàng: `order_num`, id khách hàng: `cust_id`

| order_num | cust_id |
| --------- | ------- |
| a0001     | cust10  |
| a0002     | cust1   |
| a0003     | cust1   |
| a0013     | cust2   |

【Câu hỏi】

Hãy viết câu lệnh SQL để trả về ID khách hàng (`cust_id` trong bảng `Orders`), và sử dụng truy vấn con để trả về `total_ordered` nhằm trả về tổng số tiền đơn hàng của mỗi khách hàng, sắp xếp kết quả theo số tiền từ lớn đến nhỏ.

Đáp án:

```sql
# Cách viết 1: Truy vấn con
SELECT o.cust_id, SUM(tb.total_ordered) AS `total_ordered`
FROM (SELECT order_num, SUM(item_price * quantity) AS total_ordered
    FROM OrderItems
    GROUP BY order_num) AS tb,
  Orders o
WHERE tb.order_num = o.order_num
GROUP BY o.cust_id
ORDER BY total_ordered DESC;

# Cách viết 2: Nối bảng (Join)
SELECT b.cust_id, Sum(a.quantity * a.item_price) AS total_ordered
FROM OrderItems a,Orders b
WHERE a.order_num = b.order_num
GROUP BY cust_id
ORDER BY total_ordered DESC
```

Về cách viết 1, có thể tham khảo phần giới thiệu chi tiết tại: [issue#2402: Các lỗi tồn tại trong cách viết 1 và phương pháp sửa](https://github.com/Snailclimb/JavaGuide/issues/2402).

### Truy vấn tất cả tên sản phẩm và tổng số lượng đã bán tương ứng từ bảng Products

Truy vấn tất cả tên sản phẩm từ bảng `Products`: `prod_name`, id sản phẩm: `prod_id`

| prod_id | prod_name |
| ------- | --------- |
| a0001   | egg       |
| a0002   | sockets   |
| a0013   | coffee    |
| a0003   | cola      |

`OrderItems` đại diện cho bảng sản phẩm đơn hàng, sản phẩm đơn hàng: `prod_id`, số lượng đã bán: `quantity`

| prod_id | quantity |
| ------- | -------- |
| a0001   | 105      |
| a0002   | 1100     |
| a0002   | 200      |
| a0013   | 1121     |
| a0003   | 10       |
| a0003   | 19       |
| a0003   | 5        |

【Câu hỏi】

Hãy viết câu lệnh SQL để truy vấn tất cả tên sản phẩm (`prod_name`) từ bảng `Products`, cùng với cột tính toán có tên `quant_sold`, trong đó chứa tổng số sản phẩm đã bán (truy vấn bằng cách sử dụng truy vấn con và `SUM(quantity)` trên bảng `OrderItems`).

Đáp án:

```sql
# Cách viết 1: Truy vấn con
SELECT p.prod_name, tb.quant_sold
FROM (SELECT prod_id, Sum(quantity) AS quant_sold
    FROM OrderItems
    GROUP BY prod_id) AS tb,
  Products p
WHERE tb.prod_id = p.prod_id

# Cách viết 2: Nối bảng (Join)
SELECT p.prod_name, Sum(o.quantity) AS quant_sold
FROM Products p,
  OrderItems o
WHERE p.prod_id = o.prod_id
GROUP BY p.prod_name（ở đây không thể dùng p.prod_id, sẽ báo lỗi）
```

## Nối bảng (JOIN)

JOIN có nghĩa là "nối", đúng như tên gọi, mệnh đề SQL JOIN được dùng để kết hợp hai hoặc nhiều bảng lại với nhau để truy vấn.

Khi nối bảng, cần chọn một trường trong mỗi bảng và so sánh giá trị của các trường này, hai bản ghi có giá trị giống nhau sẽ được hợp nhất thành một bản ghi. **Bản chất của nối bảng là hợp nhất các bản ghi của các bảng khác nhau lại với nhau để tạo thành một bảng mới. Tất nhiên, bảng mới này chỉ là tạm thời, nó chỉ tồn tại trong phạm vi của lần truy vấn hiện tại**.

Cú pháp cơ bản để nối hai bảng bằng `JOIN` như sau:

```sql
SELECT table1.column1, table2.column2...
FROM table1
JOIN table2
ON table1.common_column1 = table2.common_column2;
```

`table1.common_column1 = table2.common_column2` là điều kiện nối, chỉ những bản ghi thỏa mãn điều kiện này mới được hợp nhất thành một dòng. Bạn có thể sử dụng nhiều toán tử để nối bảng, ví dụ =, >, <, <>, <=, >=, !=, `between`, `like` hoặc `not`, nhưng phổ biến nhất là sử dụng =.

Khi hai bảng có trường trùng tên, để giúp database engine phân biệt được trường đó thuộc bảng nào, khi viết tên trường trùng nhau cần thêm tên bảng vào. Tất nhiên, nếu tên trường được viết là duy nhất trong hai bảng, thì cũng có thể không cần dùng định dạng trên, chỉ cần viết tên trường là đủ.

Ngoài ra, nếu tên trường liên kết của hai bảng giống nhau, cũng có thể sử dụng mệnh đề `USING` để thay thế cho `ON`, ví dụ:

```sql
# join....on
SELECT c.cust_name, o.order_num
FROM Customers c
INNER JOIN Orders o
ON c.cust_id = o.cust_id
ORDER BY c.cust_name

# Nếu tên trường liên kết của hai bảng giống nhau, cũng có thể sử dụng mệnh đề USING: JOIN....USING()
SELECT c.cust_name, o.order_num
FROM Customers c
INNER JOIN Orders o
USING(cust_id)
ORDER BY c.cust_name
```

**Sự khác biệt giữa `ON` và `WHERE`**:

- Khi nối bảng, SQL sẽ tạo ra một bảng tạm thời mới dựa trên điều kiện nối. `ON` chính là điều kiện nối, nó quyết định việc tạo ra bảng tạm thời.
- `WHERE` được thực hiện sau khi bảng tạm thời đã được tạo, tiếp tục lọc dữ liệu trong bảng tạm thời để tạo ra tập kết quả cuối cùng, lúc này đã không còn JOIN-ON nữa.

Vì vậy, tóm lại là: **SQL trước tiên tạo ra một bảng tạm thời dựa trên ON, sau đó dựa trên WHERE để lọc bảng tạm thời**.

SQL cho phép thêm một số từ khóa bổ trợ vào bên trái `JOIN`, từ đó tạo thành các loại nối khác nhau, như bảng dưới đây:

| Loại nối                                 | Mô tả                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| INNER JOIN (nối trong)                   | (Cách nối mặc định) Chỉ trả về dòng khi cả hai bảng đều có bản ghi thỏa mãn điều kiện.                                                |
| LEFT JOIN / LEFT OUTER JOIN (nối trái)   | Trả về tất cả các dòng trong bảng bên trái, ngay cả khi bảng bên phải không có dòng nào thỏa mãn điều kiện.                           |
| RIGHT JOIN / RIGHT OUTER JOIN (nối phải) | Trả về tất cả các dòng trong bảng bên phải, ngay cả khi bảng bên trái không có dòng nào thỏa mãn điều kiện.                           |
| FULL JOIN / FULL OUTER JOIN (nối đầy đủ) | Chỉ cần một trong hai bảng có bản ghi thỏa mãn điều kiện là trả về dòng.                                                              |
| SELF JOIN                                | Nối một bảng với chính nó, giống như bảng đó là hai bảng vậy. Để phân biệt hai bảng, trong câu lệnh SQL cần đổi tên ít nhất một bảng. |
| CROSS JOIN                               | Nối chéo (Cross Join), trả về tích Descartes (Cartesian product) của tập bản ghi từ hai hoặc nhiều bảng được nối.                     |

Hình dưới đây minh họa 7 cách sử dụng liên quan đến LEFT JOIN, RIGHT JOIN, INNER JOIN, OUTER JOIN.

![](https://oss.javaguide.cn/github/javaguide/csdn/d1794312b448516831369f869814ab39.png)

Nếu không thêm bất kỳ từ khóa bổ trợ nào, chỉ viết `JOIN`, thì mặc định là `INNER JOIN`

Đối với `INNER JOIN`, còn có một cách viết ẩn, gọi là "**nối trong ẩn**" (implicit inner join), tức là không có từ khóa `INNER JOIN`, sử dụng câu lệnh `WHERE` để thực hiện chức năng của nối trong

```sql
# Nối trong ẩn
SELECT c.cust_name, o.order_num
FROM Customers c,Orders o
WHERE c.cust_id = o.cust_id
ORDER BY c.cust_name

# Nối trong tường minh
SELECT c.cust_name, o.order_num
FROM Customers c
INNER JOIN Orders o
USING(cust_id)
ORDER BY c.cust_name;
```

### Trả về tên khách hàng và số đơn hàng liên quan

Bảng `Customers` có trường tên khách hàng `cust_name`, id khách hàng `cust_id`

| cust_id  | cust_name |
| -------- | --------- |
| cust10   | andy      |
| cust1    | ben       |
| cust2    | tony      |
| cust22   | tom       |
| cust221  | an        |
| cust2217 | hex       |

Bảng thông tin đơn hàng `Orders`, chứa trường `order_num` là số đơn hàng, `cust_id` là id khách hàng

| order_num | cust_id  |
| --------- | -------- |
| a1        | cust10   |
| a2        | cust1    |
| a3        | cust2    |
| a4        | cust22   |
| a5        | cust221  |
| a7        | cust2217 |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về tên khách hàng (`cust_name`) trong bảng `Customers` và số đơn hàng liên quan (`order_num`) trong bảng `Orders`, sắp xếp kết quả theo tên khách hàng rồi theo số đơn hàng theo thứ tự tăng dần. Bạn có thể thử dùng hai cách viết khác nhau, một cách sử dụng cú pháp nối bằng đẳng thức đơn giản, cách còn lại sử dụng INNER JOIN.

Đáp án:

```sql
# Nối trong ẩn
SELECT c.cust_name, o.order_num
FROM Customers c,Orders o
WHERE c.cust_id = o.cust_id
ORDER BY c.cust_name,o.order_num

# Nối trong tường minh
SELECT c.cust_name, o.order_num
FROM Customers c
INNER JOIN Orders o
USING(cust_id)
ORDER BY c.cust_name,o.order_num;
```

### Trả về tên khách hàng, số đơn hàng liên quan và tổng giá của mỗi đơn hàng

Bảng `Customers` có các trường, tên khách hàng: `cust_name`, id khách hàng: `cust_id`

| cust_id  | cust_name |
| -------- | --------- |
| cust10   | andy      |
| cust1    | ben       |
| cust2    | tony      |
| cust22   | tom       |
| cust221  | an        |
| cust2217 | hex       |

Bảng thông tin đơn hàng `Orders`, chứa các trường, số đơn hàng: `order_num`, id khách hàng: `cust_id`

| order_num | cust_id  |
| --------- | -------- |
| a1        | cust10   |
| a2        | cust1    |
| a3        | cust2    |
| a4        | cust22   |
| a5        | cust221  |
| a7        | cust2217 |

Bảng `OrderItems` có các trường, số đơn hàng của sản phẩm: `order_num`, số lượng sản phẩm: `quantity`, giá sản phẩm: `item_price`

| order_num | quantity | item_price |
| --------- | -------- | ---------- |
| a1        | 1000     | 10         |
| a2        | 200      | 10         |
| a3        | 10       | 15         |
| a4        | 25       | 50         |
| a5        | 15       | 25         |
| a7        | 7        | 7          |

【Câu hỏi】Ngoài việc trả về tên khách hàng và số đơn hàng, hãy trả về tên khách hàng (`cust_name`) trong bảng `Customers` và số đơn hàng liên quan (`order_num`) trong bảng `Orders`, thêm cột thứ ba `OrderTotal` chứa tổng giá của mỗi đơn hàng, và sắp xếp kết quả theo tên khách hàng rồi theo số đơn hàng theo thứ tự tăng dần.

```sql
# Cú pháp nối bằng đẳng thức đơn giản
SELECT c.cust_name, o.order_num, SUM(quantity * item_price) AS OrderTotal
FROM Customers c,Orders o,OrderItems oi
WHERE c.cust_id = o.cust_id AND o.order_num = oi.order_num
GROUP BY c.cust_name, o.order_num
ORDER BY c.cust_name, o.order_num
```

Chú ý, có thể có bạn sẽ viết như sau:

```sql
SELECT c.cust_name, o.order_num, SUM(quantity * item_price) AS OrderTotal
FROM Customers c,Orders o,OrderItems oi
WHERE c.cust_id = o.cust_id AND o.order_num = oi.order_num
GROUP BY c.cust_name
ORDER BY c.cust_name,o.order_num
```

Cách viết này là sai! Chỉ nhóm theo `cust_name` tuy đúng với yêu cầu đề bài, nhưng không đúng với cú pháp của `GROUP BY`.

Trong câu lệnh select, nếu không có câu lệnh `GROUP BY`, thì `cust_name`, `order_num` sẽ trả về một số giá trị, còn `sum(quantity * item_price)` chỉ trả về một giá trị, thông qua `group by` `cust_name` có thể làm cho `cust_name` và `sum(quantity * item_price)` tương ứng từng cặp với nhau, hay nói cách khác là **gom nhóm**, vì vậy tương tự, cũng cần gom nhóm cả `order_num`.

> **Nói một cách ngắn gọn, các trường trong select hoặc là đều được gom nhóm, hoặc là đều không được gom nhóm**

### Xác định những đơn hàng nào đã mua sản phẩm có prod_id là BR01 (phần 2)

Bảng `OrderItems` đại diện cho bảng thông tin sản phẩm đơn hàng, `prod_id` là id sản phẩm; bảng `Orders` đại diện cho bảng đơn hàng, có `cust_id` đại diện cho id khách hàng và ngày đặt hàng `order_date`

Bảng `OrderItems`:

| prod_id | order_num |
| ------- | --------- |
| BR01    | a0001     |
| BR01    | a0002     |
| BR02    | a0003     |
| BR02    | a0013     |

Bảng `Orders`:

| order_num | cust_id | order_date          |
| --------- | ------- | ------------------- |
| a0001     | cust10  | 2022-01-01 00:00:00 |
| a0002     | cust1   | 2022-01-01 00:01:00 |
| a0003     | cust1   | 2022-01-02 00:00:00 |
| a0013     | cust2   | 2022-01-01 00:20:00 |

【Câu hỏi】

Hãy viết câu lệnh SQL, sử dụng truy vấn con để xác định những đơn hàng nào (trong `OrderItems`) đã mua sản phẩm có `prod_id` là "BR01", sau đó trả về ID khách hàng (`cust_id`) và ngày đặt hàng (`order_date`) tương ứng với mỗi sản phẩm từ bảng `Orders`, sắp xếp kết quả theo ngày đặt hàng theo thứ tự tăng dần.

Gợi ý: Lần này hãy sử dụng nối bảng và cú pháp nối bằng đẳng thức đơn giản.

```sql
# Cách viết 1: Truy vấn con
SELECT cust_id, order_date
FROM Orders
WHERE order_num IN (SELECT order_num
    FROM OrderItems
    WHERE prod_id = 'BR01')
ORDER BY order_date

# Cách viết 2: Nối bảng inner join
SELECT cust_id, order_date
FROM Orders o INNER JOIN
  (SELECT order_num
    FROM OrderItems
    WHERE prod_id = 'BR01') tb ON o.order_num = tb.order_num
ORDER BY order_date

# Cách viết 3: Phiên bản rút gọn của cách viết 2
SELECT cust_id, order_date
FROM Orders
INNER JOIN OrderItems USING(order_num)
WHERE OrderItems.prod_id = 'BR01'
ORDER BY order_date
```

### Trả về email của tất cả khách hàng đã mua sản phẩm có prod_id là BR01 (phần 2)

Cho bảng `OrderItems` đại diện cho bảng thông tin sản phẩm đơn hàng, `prod_id` là id sản phẩm; bảng `Orders` đại diện cho bảng đơn hàng, có `cust_id` đại diện cho id khách hàng và ngày đặt hàng `order_date`; bảng `Customers` chứa `cust_email` là email khách hàng và cust_id là id khách hàng

Bảng `OrderItems`:

| prod_id | order_num |
| ------- | --------- |
| BR01    | a0001     |
| BR01    | a0002     |
| BR02    | a0003     |
| BR02    | a0013     |

Bảng `Orders`:

| order_num | cust_id | order_date          |
| --------- | ------- | ------------------- |
| a0001     | cust10  | 2022-01-01 00:00:00 |
| a0002     | cust1   | 2022-01-01 00:01:00 |
| a0003     | cust1   | 2022-01-02 00:00:00 |
| a0013     | cust2   | 2022-01-01 00:20:00 |

Bảng `Customers` đại diện cho thông tin khách hàng, `cust_id` là id khách hàng, `cust_email` là email khách hàng

| cust_id | cust_email        |
| ------- | ----------------- |
| cust10  | <cust10@cust.com> |
| cust1   | <cust1@cust.com>  |
| cust2   | <cust2@cust.com>  |

【Câu hỏi】Trả về email của tất cả khách hàng đã mua sản phẩm có `prod_id` là BR01 (`cust_email` trong bảng `Customers`), kết quả không cần sắp xếp.

Gợi ý: Bài này liên quan đến câu lệnh `SELECT`, lớp trong cùng trả về `order_num` từ bảng `OrderItems`, lớp giữa trả về `cust_id` từ bảng `Customers`, nhưng bắt buộc phải sử dụng cú pháp INNER JOIN.

```sql
SELECT cust_email
FROM Customers
INNER JOIN Orders using(cust_id)
INNER JOIN OrderItems using(order_num)
WHERE OrderItems.prod_id = 'BR01'
```

### Một cách khác để xác định khách hàng tốt nhất (phần 2)

Bảng `OrderItems` đại diện cho thông tin đơn hàng, một cách khác để xác định khách hàng tốt nhất là xem họ đã chi bao nhiêu tiền, bảng `OrderItems` có số đơn hàng `order_num` và `item_price` giá bán sản phẩm, `quantity` số lượng sản phẩm

| order_num | item_price | quantity |
| --------- | ---------- | -------- |
| a1        | 10         | 105      |
| a2        | 1          | 1100     |
| a2        | 1          | 200      |
| a4        | 2          | 1121     |
| a5        | 5          | 10       |
| a2        | 1          | 19       |
| a7        | 7          | 5        |

Bảng `Orders` chứa trường `order_num` là số đơn hàng, `cust_id` là id khách hàng

| order_num | cust_id  |
| --------- | -------- |
| a1        | cust10   |
| a2        | cust1    |
| a3        | cust2    |
| a4        | cust22   |
| a5        | cust221  |
| a7        | cust2217 |

Bảng khách hàng `Customers` có trường `cust_id` là id khách hàng, `cust_name` là tên khách hàng

| cust_id  | cust_name |
| -------- | --------- |
| cust10   | andy      |
| cust1    | ben       |
| cust2    | tony      |
| cust22   | tom       |
| cust221  | an        |
| cust2217 | hex       |

【Câu hỏi】Hãy viết câu lệnh SQL để trả về tên khách hàng và tổng số tiền (`order_num` trong bảng `OrderItems`) của các khách hàng có tổng giá trị đơn hàng không nhỏ hơn 1000.

Gợi ý: Cần tính tổng (`item_price` nhân với `quantity`). Sắp xếp kết quả theo tổng số tiền, hãy sử dụng cú pháp `INNER JOIN`.

```sql
SELECT cust_name, SUM(item_price * quantity) AS total_price
FROM Customers
INNER JOIN Orders USING(cust_id)
INNER JOIN OrderItems USING(order_num)
GROUP BY cust_name
HAVING total_price >= 1000
ORDER BY total_price
```

## Tạo nối nâng cao

### Truy vấn tên của mỗi khách hàng và tất cả số đơn hàng (phần 1)

Bảng `Customers` đại diện cho thông tin khách hàng, chứa id khách hàng `cust_id` và tên khách hàng `cust_name`

| cust_id  | cust_name |
| -------- | --------- |
| cust10   | andy      |
| cust1    | ben       |
| cust2    | tony      |
| cust22   | tom       |
| cust221  | an        |
| cust2217 | hex       |

Bảng `Orders` đại diện cho thông tin đơn hàng, chứa số đơn hàng `order_num` và id khách hàng `cust_id`

| order_num | cust_id  |
| --------- | -------- |
| a1        | cust10   |
| a2        | cust1    |
| a3        | cust2    |
| a4        | cust22   |
| a5        | cust221  |
| a7        | cust2217 |

【Câu hỏi】Sử dụng INNER JOIN để viết câu lệnh SQL, truy vấn tên của mỗi khách hàng (`cust_name` trong bảng `Customers`) và tất cả số đơn hàng (`order_num` trong bảng `Orders`), cuối cùng trả về theo tên khách hàng `cust_name` theo thứ tự tăng dần.

```sql
SELECT cust_name, order_num
FROM Customers
INNER JOIN Orders
USING(cust_id)
ORDER BY cust_name
```

### Truy vấn tên của mỗi khách hàng và tất cả số đơn hàng (phần 2)

Bảng `Orders` đại diện cho thông tin đơn hàng, chứa số đơn hàng `order_num` và id khách hàng `cust_id`

| order_num | cust_id  |
| --------- | -------- |
| a1        | cust10   |
| a2        | cust1    |
| a3        | cust2    |
| a4        | cust22   |
| a5        | cust221  |
| a7        | cust2217 |

Bảng `Customers` đại diện cho thông tin khách hàng, chứa id khách hàng `cust_id` và tên khách hàng `cust_name`

| cust_id  | cust_name |
| -------- | --------- |
| cust10   | andy      |
| cust1    | ben       |
| cust2    | tony      |
| cust22   | tom       |
| cust221  | an        |
| cust2217 | hex       |
| cust40   | ace       |

【Câu hỏi】Truy vấn tên của mỗi khách hàng (`cust_name` trong bảng `Customers`) và tất cả số đơn hàng (`order_num` trong bảng Orders), liệt kê tất cả khách hàng, ngay cả khi họ chưa từng đặt đơn hàng nào. Cuối cùng trả về theo tên khách hàng `cust_name` theo thứ tự tăng dần.

```sql
SELECT cust_name, order_num
FROM Customers
LEFT JOIN Orders
USING(cust_id)
ORDER BY cust_name
```

### Trả về tên sản phẩm và số đơn hàng liên quan

Bảng `Products` là bảng thông tin sản phẩm, chứa trường `prod_id` là id sản phẩm, `prod_name` là tên sản phẩm

| prod_id | prod_name |
| ------- | --------- |
| a0001   | egg       |
| a0002   | sockets   |
| a0013   | coffee    |
| a0003   | cola      |
| a0023   | soda      |

Bảng `OrderItems` là bảng thông tin đơn hàng, chứa trường `order_num` là số đơn hàng và id sản phẩm `prod_id`

| prod_id | order_num |
| ------- | --------- |
| a0001   | a105      |
| a0002   | a1100     |
| a0002   | a200      |
| a0013   | a1121     |
| a0003   | a10       |
| a0003   | a19       |
| a0003   | a5        |

【Câu hỏi】Sử dụng nối ngoài (left join, right join, full join) để nối bảng `Products` và bảng `OrderItems`, trả về danh sách tên sản phẩm (`prod_name`) và số đơn hàng liên quan (`order_num`), và sắp xếp theo tên sản phẩm theo thứ tự tăng dần.

```sql
SELECT prod_name, order_num
FROM Products
LEFT JOIN OrderItems
USING(prod_id)
ORDER BY prod_name
```

### Trả về tên sản phẩm và tổng số đơn hàng của mỗi sản phẩm

Bảng `Products` là bảng thông tin sản phẩm, chứa trường `prod_id` là id sản phẩm, `prod_name` là tên sản phẩm

| prod_id | prod_name |
| ------- | --------- |
| a0001   | egg       |
| a0002   | sockets   |
| a0013   | coffee    |
| a0003   | cola      |
| a0023   | soda      |

Bảng `OrderItems` là bảng thông tin đơn hàng, chứa trường `order_num` là số đơn hàng và id sản phẩm `prod_id`

| prod_id | order_num |
| ------- | --------- |
| a0001   | a105      |
| a0002   | a1100     |
| a0002   | a200      |
| a0013   | a1121     |
| a0003   | a10       |
| a0003   | a19       |
| a0003   | a5        |

【Câu hỏi】

Sử dụng OUTER JOIN để nối bảng `Products` và bảng `OrderItems`, trả về tên sản phẩm (`prod_name`) và tổng số đơn hàng của mỗi sản phẩm (không phải số đơn hàng), và sắp xếp theo tên sản phẩm theo thứ tự tăng dần.

```sql
SELECT prod_name, COUNT(order_num) AS orders
FROM Products
LEFT JOIN OrderItems
USING(prod_id)
GROUP BY prod_name
ORDER BY prod_name
```

### Liệt kê các nhà cung cấp và số lượng sản phẩm họ cung cấp

Cho bảng `Vendors` chứa `vend_id` (id nhà cung cấp)

| vend_id |
| ------- |
| a0002   |
| a0013   |
| a0003   |
| a0010   |

Cho bảng `Products` chứa `vend_id` (id nhà cung cấp) và prod_id (id sản phẩm được cung cấp)

| vend_id | prod_id              |
| ------- | -------------------- |
| a0001   | egg                  |
| a0002   | prod_id_iphone       |
| a00113  | prod_id_tea          |
| a0003   | prod_id_vivo phone   |
| a0010   | prod_id_huawei phone |

【Câu hỏi】Liệt kê các nhà cung cấp (`vend_id` trong bảng `Vendors`) và số lượng sản phẩm họ cung cấp, bao gồm cả những nhà cung cấp không có sản phẩm. Bạn cần sử dụng OUTER JOIN và hàm tổng hợp COUNT() để tính số lượng của mỗi sản phẩm trong bảng `Products`, cuối cùng sắp xếp theo vend_id theo thứ tự tăng dần.

Chú ý: Cột `vend_id` sẽ xuất hiện trong nhiều bảng, vì vậy mỗi lần tham chiếu đến nó đều cần phải định danh đầy đủ (fully qualify).

```sql
SELECT v.vend_id, COUNT(prod_id) AS prod_id
FROM Vendors v
LEFT JOIN Products p
USING(vend_id)
GROUP BY v.vend_id
ORDER BY v.vend_id
```

## Kết hợp các truy vấn (UNION)

Toán tử `UNION` kết hợp kết quả của hai hoặc nhiều truy vấn lại với nhau, và tạo ra một tập kết quả chứa các dòng được trích xuất từ các truy vấn tham gia trong `UNION`.

Các quy tắc cơ bản của `UNION`:

- Số cột và thứ tự cột của tất cả các truy vấn phải giống nhau.
- Kiểu dữ liệu của các cột liên quan đến bảng trong mỗi truy vấn phải giống nhau hoặc tương thích.
- Tên cột trả về thường được lấy từ truy vấn đầu tiên.

Mặc định, toán tử `UNION` chọn các giá trị khác nhau. Nếu cho phép các giá trị trùng lặp, hãy sử dụng `UNION ALL`.

```sql
SELECT column_name(s) FROM table1
UNION ALL
SELECT column_name(s) FROM table2;
```

Tên cột trong tập kết quả của `UNION` luôn bằng tên cột trong câu lệnh `SELECT` đầu tiên của `UNION`.

`JOIN` và `UNION`:

- Trong `JOIN`, các cột của các bảng được nối có thể khác nhau, nhưng trong `UNION`, số cột và thứ tự cột của tất cả các truy vấn phải giống nhau.
- `UNION` đặt các dòng sau khi truy vấn lại với nhau (đặt theo chiều dọc), còn `JOIN` đặt các cột sau khi truy vấn lại với nhau (đặt theo chiều ngang), tức là tạo thành một tích Descartes (Cartesian product).

### Kết hợp hai câu lệnh SELECT lại với nhau (phần 1)

Bảng `OrderItems` chứa thông tin sản phẩm đơn hàng, trường `prod_id` đại diện cho id sản phẩm, `quantity` đại diện cho số lượng sản phẩm

| prod_id | quantity |
| ------- | -------- |
| a0001   | 105      |
| a0002   | 100      |
| a0002   | 200      |
| a0013   | 1121     |
| a0003   | 10       |
| a0003   | 19       |
| a0003   | 5        |
| BNBG    | 10002    |

【Câu hỏi】Kết hợp hai câu lệnh `SELECT` lại với nhau để truy vấn id sản phẩm (`prod_id`) và `quantity` từ bảng `OrderItems`. Trong đó, một câu lệnh `SELECT` lọc các dòng có số lượng là 100, câu lệnh `SELECT` còn lại lọc các sản phẩm có id bắt đầu bằng BNBG, cuối cùng sắp xếp kết quả theo id sản phẩm theo thứ tự tăng dần.

```sql
SELECT prod_id, quantity
FROM OrderItems
WHERE quantity = 100
UNION
SELECT prod_id, quantity
FROM OrderItems
WHERE prod_id LIKE 'BNBG%'
ORDER BY prod_id;
```

> **Chú ý**: Khi sử dụng `ORDER BY` trong truy vấn `UNION`, chỉ có thể sử dụng một lần duy nhất sau câu lệnh `SELECT` cuối cùng, nó sẽ sắp xếp toàn bộ tập kết quả đã kết hợp.

### Kết hợp hai câu lệnh SELECT lại với nhau (phần 2)

Bảng `OrderItems` chứa thông tin sản phẩm đơn hàng, trường `prod_id` đại diện cho id sản phẩm, `quantity` đại diện cho số lượng sản phẩm.

| prod_id | quantity |
| ------- | -------- |
| a0001   | 105      |
| a0002   | 100      |
| a0002   | 200      |
| a0013   | 1121     |
| a0003   | 10       |
| a0003   | 19       |
| a0003   | 5        |
| BNBG    | 10002    |

【Câu hỏi】Kết hợp hai câu lệnh `SELECT` lại với nhau để truy vấn id sản phẩm (`prod_id`) và `quantity` từ bảng `OrderItems`. Trong đó, một câu lệnh `SELECT` lọc các dòng có số lượng là 100, câu lệnh `SELECT` còn lại lọc các sản phẩm có id bắt đầu bằng BNBG, cuối cùng sắp xếp kết quả theo id sản phẩm theo thứ tự tăng dần. Chú ý: **Lần này chỉ sử dụng một câu lệnh SELECT duy nhất.**

Đáp án:

Yêu cầu chỉ dùng một câu lệnh select, vậy thì dùng `or` thay vì `union`.

```sql
SELECT prod_id, quantity
FROM OrderItems
WHERE quantity = 100 OR prod_id LIKE 'BNBG%'
ORDER BY prod_id;
```

### Kết hợp tên sản phẩm trong bảng Products và tên khách hàng trong bảng Customers

Bảng `Products` chứa trường `prod_name` đại diện cho tên sản phẩm

| prod_name |
| --------- |
| flower    |
| rice      |
| ring      |
| umbrella  |

Bảng Customers đại diện cho thông tin khách hàng, cust_name đại diện cho tên khách hàng

| cust_name |
| --------- |
| andy      |
| ben       |
| tony      |
| tom       |
| an        |
| lee       |
| hex       |

【Câu hỏi】Hãy viết câu lệnh SQL để kết hợp tên sản phẩm (`prod_name`) trong bảng `Products` và tên khách hàng (`cust_name`) trong bảng `Customers` rồi trả về, sau đó sắp xếp kết quả theo tên sản phẩm theo thứ tự tăng dần.

```sql
# Tên cột trong tập kết quả của UNION luôn bằng tên cột trong câu lệnh SELECT đầu tiên của UNION.
SELECT prod_name
FROM Products
UNION
SELECT cust_name
FROM Customers
ORDER BY prod_name
```

### Kiểm tra câu lệnh SQL

Bảng `Customers` chứa các trường `cust_name` là tên khách hàng, `cust_contact` là thông tin liên hệ của khách hàng, `cust_state` là bang của khách hàng, `cust_email` là `email` của khách hàng

| cust_name | cust_contact | cust_state | cust_email        |
| --------- | ------------ | ---------- | ----------------- |
| cust10    | 8695192      | MI         | <cust10@cust.com> |
| cust1     | 8695193      | MI         | <cust1@cust.com>  |
| cust2     | 8695194      | IL         | <cust2@cust.com>  |

【Câu hỏi】Hãy sửa lại câu lệnh SQL bị sai dưới đây

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state = 'MI'
ORDER BY cust_name;
UNION
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state = 'IL'ORDER BY cust_name;
```

Sau khi sửa:

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state = 'MI'
UNION
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state = 'IL'
ORDER BY cust_name;
```

Khi kết hợp các truy vấn bằng `union`, chỉ có thể sử dụng một mệnh đề `order by`, và nó phải nằm sau câu lệnh `select` cuối cùng

Hoặc có thể dùng trực tiếp `or` để làm:

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state = 'MI' or cust_state = 'IL'
ORDER BY cust_name;
```

<!-- @include: @article-footer.snippet.md -->
