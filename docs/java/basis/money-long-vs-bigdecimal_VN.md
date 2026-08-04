---
title: Java dùng long hay BigDecimal cho số tiền?
description: Hướng dẫn chọn kiểu dữ liệu tiền tệ trong Java: giải thích khi nào dùng long lưu đơn vị tiền tệ nhỏ nhất, khi nào dùng BigDecimal để tính toán chính xác, cùng các vấn đề về làm tròn, tràn số, chuyển đổi đơn vị và thiết kế trường cơ sở dữ liệu.
category: Java
tag:
  - Java基础
  - Java金额计算
head:
  - - meta
    - name: keywords
      content: Java金额类型,long存金额,Long存分,BigDecimal金额计算,金额精度,金额舍入,DECIMAL,BIGINT
---

Trong phần bình luận của một bài viết về kiểu dữ liệu cho trường số tiền, tôi thấy một số câu trả lời hoàn toàn khác nhau: có người khăng khăng dùng `Long` để lưu đơn vị xu, có người nói các tình huống như lãi suất, tỷ giá thì phải dùng `BigDecimal`, lại có người nhắc đến việc truyền string trực tiếp trong API.

Những ý kiến này không bàn về cùng một thứ. Dùng `Long` lưu xu, là nói về cách lưu trữ số tiền; lãi suất và tỷ giá dùng `BigDecimal`, là nói về cách tính toán số tiền; API truyền string, thường chỉ là định dạng truyền dữ liệu.

Số tiền đã xác định đơn vị nhỏ nhất có thể dùng `long` để lưu. Trong quá trình tính toán cần giữ lại phần thập phân, hoặc cần chỉ định rõ cách làm tròn, thì dùng `BigDecimal`. Hai kiểu dữ liệu này có thể cùng xuất hiện trong một hệ thống.

Phương án Long được đề cập dưới đây đều chỉ việc dùng số nguyên để lưu đơn vị tiền tệ nhỏ nhất. Khi code Java tham gia tính toán, thường dùng kiểu nguyên thủy `long`, khi cần biểu thị giá trị null mới dùng kiểu wrapper `Long`.

| Mục so sánh             | `long`                                           | `BigDecimal`                                |
| ----------------------- | ------------------------------------------------ | ------------------------------------------- |
| Cách biểu diễn          | Số nguyên với đơn vị nhỏ nhất cố định            | Số thập phân có `scale`                     |
| Trường hợp sử dụng phổ biến | Tiền đơn hàng, số dư, số tiền đã ghi sổ (đã xác định đơn vị nhỏ nhất) | Tính chiết khấu, thuế, lãi suất, tỷ giá     |
| Rủi ro chính            | Nhầm lẫn đơn vị, tràn số âm thầm, khó mở rộng độ chính xác | Cách khởi tạo, quy tắc làm tròn, khác biệt `scale` |
| Kiểu dữ liệu DB phổ biến | `BIGINT`                                         | `DECIMAL(p, s)`                             |

## Tại sao không dùng double cho số tiền?

`double` và `float` lưu trữ số dấu phẩy động nhị phân. Nhiều số thập phân hữu hạn chữ số, khi chuyển sang nhị phân sẽ trở thành số thập phân vô hạn tuần hoàn, chỉ có thể lấy một giá trị gần đúng nhất có thể biểu diễn được.

```java
double a = 1.0;
double b = 0.9;

System.out.println(a - b);
// 0.09999999999999998

System.out.println(0.1 + 0.1 + 0.1);
// 0.30000000000000004
```

Sai số này không liên quan đến cách triển khai của Java, các ngôn ngữ sử dụng số dấu phẩy động nhị phân IEEE 754 đều gặp phải. Tính toán tiền tệ thường yêu cầu kết quả tuân theo độ chính xác thập phân và quy tắc làm tròn rõ ràng, giá trị gần đúng rất khó đáp ứng yêu cầu này.

`new BigDecimal(0.1)` có thể hiển thị đầy đủ giá trị gần đúng được lưu trong `double`:

```java
System.out.println(new BigDecimal(0.1));
// 0.1000000000000000055511151231257827021181583404541015625
```

Đây cũng là lý do tại sao đối tượng số tiền không nên được khởi tạo từ `double`. Một giá trị đã phát sinh sai số, khi chuyển sang `BigDecimal` sẽ không tự động khôi phục lại số thập phân ban đầu.

## Những loại số tiền nào phù hợp dùng Long?

Nếu nghiệp vụ quy định số tiền RMB thống nhất chính xác đến xu, thì `19.99` tệ có thể được lưu thành `1999` xu. Phép cộng trừ đều thực hiện trên số nguyên, không phát sinh sai số thập phân.

```java
long priceCents = 1_999L;
long shippingCents = 500L;
long totalCents = Math.addExact(priceCents, shippingCents);
```

`long` phù hợp với các giá trị đã hoàn thành làm tròn như tiền đơn hàng, số dư tài khoản, số tiền thanh toán, trong cơ sở dữ liệu có thể dùng `BIGINT`.

Khi lưu trữ trong cơ sở dữ liệu, tên trường tốt nhất nên kèm theo đơn vị, như vậy nhìn sẽ trực quan hơn:

```sql
CREATE TABLE orders (
    id           BIGINT PRIMARY KEY,
    amount_cents BIGINT NOT NULL
);
```

Nếu dùng `amount`, thì `amount = 100` rốt cuộc là 100 tệ hay 100 xu, chỉ nhìn giá trị thì không thể phán đoán được. Đổi thành `amount_cents = 100`, thì khác hẳn.

**Khi dùng long cần chú ý điều gì?**

Lưu số tiền thống nhất thành xu, độ chính xác cũng bị cố định ở hai chữ số thập phân. Kết quả trung gian của tỷ giá, lãi suất, thuế hoặc tính phí theo lượng sử dụng có thể cần bốn, sáu, thậm chí nhiều chữ số thập phân hơn, những phép tính này không thể tiếp tục dùng "xu" để tính cứng được.

Còn phải đề phòng tràn số. `+` và `*` thông thường sau khi tràn sẽ không báo lỗi, code xử lý số tiền có thể dùng `Math.addExact()`, `Math.subtractExact()` và `Math.multiplyExact()` thay thế:

```java
long subtotalCents = Math.multiplyExact(unitPriceCents, quantity);
long balanceCents = Math.subtractExact(currentBalanceCents, paymentCents);
```

Phép nhân còn phải kiểm tra kết quả trung gian. Số tiền cuối cùng không vượt quá `Long.MAX_VALUE`, không có nghĩa là `đơn giá × số lượng × hệ số` ở bước nào đó cũng sẽ không bị tràn.

Hệ thống đa tiền tệ cũng không thể giả định tất cả các loại tiền tệ đều có hai chữ số thập phân. Số tiền ít nhất phải đi kèm với loại tiền tệ, số chữ số của đơn vị nhỏ nhất do loại tiền tệ hoặc quy tắc nghiệp vụ quyết định, không thể suy ra từ một giá trị `long` đơn độc.

## Những loại số tiền nào phù hợp dùng BigDecimal?

Chiết khấu, thuế, lãi suất và quy đổi tỷ giá thường phát sinh kết quả trung gian vượt quá đơn vị nhỏ nhất của tiền tệ.

`BigDecimal` dùng số nguyên độ chính xác tùy ý và `scale` để biểu diễn số thập phân, có thể giữ lại những giá trị trung gian này, sau đó làm tròn tại vị trí do nghiệp vụ quy định.

```java
BigDecimal price = new BigDecimal("19.99");
BigDecimal discountRate = new BigDecimal("0.95");

BigDecimal discountedPrice = price.multiply(discountRate);
// 18.9905
```

Hằng số tiền tệ trực tiếp dùng string để khởi tạo. API truyền tới là string thì chuyển thẳng sang `BigDecimal`, trường cơ sở dữ liệu là `DECIMAL` thì map thẳng thành `BigDecimal`, không cần chuyển qua `double` ở giữa.

**Nếu `divide()` không chia hết thì làm thế nào?**

Lúc này cần chỉ định số chữ số giữ lại và cách làm tròn.

Đoạn code dưới đây có nghĩa là giữ lại hai chữ số thập phân, và sử dụng `HALF_UP` (làm tròn nửa lên). Nếu gọi trực tiếp `a.divide(b)`, chương trình sẽ ném ra `ArithmeticException`.

```java
BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("3");

System.out.println(a.divide(b, 2, RoundingMode.HALF_UP)); // 3.33
```

Còn một điểm cần chú ý: `BigDecimal` là lớp bất biến (immutable), kết quả phép toán phải dùng biến mới để nhận, hoặc gán lại. Lần đầu gọi `add()` không nhận giá trị trả về, `amount` vẫn là `10.00`:

```java
BigDecimal amount = new BigDecimal("10.00");

amount.add(new BigDecimal("2.00"));
System.out.println(amount); // vẫn là 10.00

amount = amount.add(new BigDecimal("2.00"));
System.out.println(amount); // 12.00
```

So sánh độ lớn của số tiền thường dùng `compareTo()`. `equals()` còn so sánh cả `scale`, nên `1.0` và `1.00` gọi `equals()` cho kết quả là `false`:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b));         // false
System.out.println(a.compareTo(b) == 0); // true
```

Sự khác biệt này cũng ảnh hưởng đến `HashMap` và `HashSet`. Nếu dùng `BigDecimal` làm key, tốt nhất nên thống nhất `scale` trước, nếu không `1.0` và `1.00` sẽ bị coi là hai key khác nhau.

## Long và BigDecimal có thể dùng cùng nhau không?

Có thể. Lấy ví dụ đơn giá sản phẩm `19.99` tệ, mua 3 cái, chiết khấu `0.95`, khi tính toán dùng `BigDecimal`, số tiền thanh toán cuối cùng lại chuyển thành `long` với đơn vị xu:

```java
BigDecimal unitPrice = new BigDecimal("19.99");
BigDecimal discountRate = new BigDecimal("0.95");
long quantity = 3L;

BigDecimal payable = unitPrice
        .multiply(BigDecimal.valueOf(quantity))
        .multiply(discountRate)
        .setScale(2, RoundingMode.HALF_UP);

long payableCents = payable
        .movePointRight(2)
        .longValueExact();
```

Đoạn code này tính ra `payable` là `56.97`, `movePointRight(2)` chuyển nó thành `5697`. `longValueExact()` chỉ chấp nhận số nguyên trong phạm vi `long`, chỉ cần còn phần thập phân khác không hoặc giá trị vượt quá giới hạn, sẽ ném ra `ArithmeticException`.

Chuyển đổi số tiền không nên dùng trực tiếp `longValue()`, nó sẽ bỏ đi phần thập phân:

```java
long amount = new BigDecimal("19.99").longValue();
System.out.println(amount); // 19
```

Nếu số tiền đầu vào tối đa chỉ có hai chữ số thập phân, còn có thể dùng `RoundingMode.UNNECESSARY` để kiểm tra:

```java
public static long toCentsExact(BigDecimal amount) {
    return amount
            .setScale(2, RoundingMode.UNNECESSARY)
            .movePointRight(2)
            .longValueExact();
}

public static BigDecimal fromCents(long cents) {
    return BigDecimal.valueOf(cents, 2);
}
```

`19.9` có thể bù thành `19.90`, `19.999` thì sẽ ném ngoại lệ trực tiếp, không âm thầm cắt cụt hay làm tròn.

API thanh toán nhận xu, thì truyền `5697`; nhận string với đơn vị tệ, thì truyền `payable.toPlainString()`. Code chuyển đổi đặt ở tầng adapter của API, trong quá trình tính toán nghiệp vụ không nên chuyển đổi qua lại giữa kiểu dữ liệu và đơn vị.

## Cơ sở dữ liệu nên dùng BIGINT hay DECIMAL?

Trong Java dùng `long` để lưu đơn vị nhỏ nhất, trường cơ sở dữ liệu thường dùng `BIGINT`; trong Java dùng `BigDecimal`, trường cơ sở dữ liệu thường dùng `DECIMAL(p, s)`.

```sql
CREATE TABLE settlement_detail (
    id               BIGINT PRIMARY KEY,
    payable_cents    BIGINT         NOT NULL,
    exchange_rate    DECIMAL(18, 8) NOT NULL,
    settlement_amount DECIMAL(18, 2) NOT NULL
);
```

MySQL xếp cả số nguyên và `DECIMAL` vào loại giá trị chính xác. `DECIMAL(18, 2)` trong đó `18` là tổng số chữ số có nghĩa, `2` là số chữ số thập phân; nó có bao phủ được số tiền nghiệp vụ hay không, phải suy ngược từ giá trị lớn nhất, không thể thấy trường số tiền là áp dụng một độ chính xác giống nhau cho tất cả.

Đừng phụ thuộc vào MySQL tự động làm tròn khi ghi `DECIMAL`. Code Java nên gọi `setScale()` trước để làm tròn hoặc kiểm tra, rồi mới ghi kết quả vào cơ sở dữ liệu, như vậy giá trị ghi vào DB và kết quả tính toán của chương trình mới khớp nhau.

Trường số tiền có dùng `DEFAULT 0` hay không phải xem ý nghĩa nghiệp vụ. Thiếu số tiền và số tiền bằng không không phải lúc nào cũng là một chuyện, tiện tay thêm giá trị mặc định có thể che giấu việc thiếu dữ liệu. `NOT NULL` thường đáng được giữ lại, còn giá trị mặc định thì nên do quy tắc domain quyết định.

## Tổng kết

Số tiền đã hoàn thành làm tròn, đơn vị nhỏ nhất cố định, phù hợp dùng `long` để lưu; chiết khấu, thuế, lãi suất và tỷ giá cần giữ lại phần thập phân, dùng `BigDecimal`. Khi làm tròn phải ghi rõ số chữ số giữ lại và `RoundingMode`.

Hai kiểu dữ liệu có thể dùng cùng nhau. Giai đoạn tính toán giữ `BigDecimal`, sau khi xác định số tiền cuối cùng, trước tiên di chuyển dấu thập phân theo số chữ số của đơn vị nhỏ nhất, rồi dùng `longValueExact()` chuyển thành số nguyên. Tên trường phải ghi rõ đơn vị, phép toán số nguyên phải kiểm tra tràn số, việc chuyển đổi kiểu dữ liệu và đơn vị tập trung đặt trong code adapter của API hoặc cơ sở dữ liệu.