---
title: BigDecimal chi tiết
description: Giải thích chi tiết cách sử dụng BigDecimal: giải quyết vấn đề mất độ chính xác của số dấu phẩy động, nắm vững các phép cộng trừ nhân chia, quy tắc làm tròn RoundingMode, phương thức so sánh compareTo, phù hợp với các tình huống yêu cầu độ chính xác cao như tính toán tài chính.
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: BigDecimal,浮点数精度,小数运算,RoundingMode舍入模式,BigDecimal比较,金额计算,精度丢失
---

"Sổ tay phát triển Java của Alibaba" có đề cập: "Để tránh mất độ chính xác, có thể sử dụng `BigDecimal` để thực hiện các phép toán với số dấu phẩy động".

Phép toán với số dấu phẩy động thực sự có nguy cơ mất độ chính xác sao? Quả thực là có!

Mã ví dụ:

```java
float a = 2.0f - 1.9f;
float b = 1.8f - 1.7f;
System.out.println(a);// 0.100000024
System.out.println(b);// 0.099999905
System.out.println(a == b);// false
```

**Tại sao phép toán với số dấu phẩy động `float` hoặc `double` lại có nguy cơ mất độ chính xác?**

Điều này liên quan mật thiết đến cơ chế lưu trữ số thập phân của máy tính. Chúng ta biết rằng máy tính sử dụng hệ nhị phân, và khi máy tính biểu diễn một con số, độ rộng là có giới hạn. Nhiều số thập phân khi chuyển sang nhị phân sẽ trở thành số thập phân vô hạn tuần hoàn, chỉ có thể được làm tròn thành số hữu hạn chữ số, do đó tồn tại nguy cơ mất độ chính xác. Tuy nhiên, những giá trị như 0.5, 0.25 có thể được biểu diễn dưới dạng số nhị phân hữu hạn thì có thể được biểu diễn chính xác.

Ví dụ, 0.2 trong hệ thập phân không thể chuyển đổi chính xác thành số nhị phân:

```java
// Quá trình chuyển đổi 0.2 sang số nhị phân là liên tục nhân với 2, cho đến khi không còn phần thập phân,
// trong quá trình tính toán này, phần nguyên thu được sắp xếp từ trên xuống dưới chính là kết quả nhị phân.
0.2 * 2 = 0.4 -> 0
0.4 * 2 = 0.8 -> 0
0.8 * 2 = 1.6 -> 1
0.6 * 2 = 1.2 -> 1
0.2 * 2 = 0.4 -> 0（xảy ra vòng lặp）
...
```

Để biết thêm về số dấu phẩy động, bạn nên xem bài viết [Cơ sở hệ thống máy tính (4) Số dấu phẩy động](http://kaito-kidd.com/2018/08/08/computer-system-float-point/).

## Giới thiệu BigDecimal

`BigDecimal` có thể biểu diễn chính xác số thập phân và cung cấp các phép toán với độ chính xác và quy tắc làm tròn có thể chỉ định rõ ràng. Tuy nhiên, khi sử dụng `MathContext` với độ chính xác giới hạn, thực hiện phép chia cần làm tròn, hoặc chuyển đổi kết quả sang `float`、`double`, vẫn có thể xảy ra làm tròn.

Thông thường, phần lớn các tình huống nghiệp vụ yêu cầu kết quả phép toán số thập phân chính xác (ví dụ như các tình huống liên quan đến tiền tệ) đều được thực hiện thông qua `BigDecimal`.

"Sổ tay phát triển Java của Alibaba" có đề cập: **Đối với phép so sánh bằng nhau giữa các số dấu phẩy động, kiểu dữ liệu cơ bản không được dùng == để so sánh, kiểu dữ liệu wrapper không được dùng equals để so sánh.**

![](https://oss.javaguide.cn/javaguide/image-20211213101646884.png)

Lý do cụ thể chúng ta đã giới thiệu chi tiết ở trên, ở đây không nhắc lại nữa.

Muốn giải quyết vấn đề mất độ chính xác trong phép toán số dấu phẩy động, có thể trực tiếp sử dụng `BigDecimal` để định nghĩa giá trị số thập phân, sau đó thực hiện các phép toán số thập phân.

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("0.9");
BigDecimal c = new BigDecimal("0.8");

BigDecimal x = a.subtract(b);
BigDecimal y = b.subtract(c);

System.out.println(x.compareTo(y));// 0
```

## Các phương thức phổ biến của BigDecimal

### Tạo đối tượng

Khi sử dụng `BigDecimal`, để tránh mất độ chính xác, khuyến nghị sử dụng phương thức khởi tạo `BigDecimal(String val)` hoặc phương thức tĩnh `BigDecimal.valueOf(double val)` để tạo đối tượng.

"Sổ tay phát triển Java của Alibaba" cũng có đề cập đến phần nội dung này, như hình dưới đây.

![](https://oss.javaguide.cn/javaguide/image-20211213102222601.png)

### Cộng trừ nhân chia

Phương thức `add` dùng để cộng hai đối tượng `BigDecimal`, phương thức `subtract` dùng để trừ hai đối tượng `BigDecimal`. Phương thức `multiply` dùng để nhân hai đối tượng `BigDecimal`, phương thức `divide` dùng để chia hai đối tượng `BigDecimal`.

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("0.9");
System.out.println(a.add(b));// 1.9
System.out.println(a.subtract(b));// 0.1
System.out.println(a.multiply(b));// 0.90
System.out.println(a.divide(b));// 无法除尽，抛出 ArithmeticException 异常
System.out.println(a.divide(b, 2, RoundingMode.HALF_UP));// 1.11
```

Cần lưu ý ở đây, nên chọn overload của `divide` dựa trên việc nghiệp vụ có cho phép làm tròn hay không. Khi yêu cầu kết quả chính xác, có thể sử dụng phiên bản không chỉ định quy tắc làm tròn; nếu kết quả không thể biểu diễn chính xác sẽ ném ra `ArithmeticException`. Khi cho phép làm tròn, nên chỉ định rõ `scale` và `roundingMode`. `RoundingMode.UNNECESSARY` dùng để khẳng định kết quả không cần làm tròn, nếu thực tế cần làm tròn cũng sẽ ném ra `ArithmeticException`.

```java
public BigDecimal divide(BigDecimal divisor, int scale, RoundingMode roundingMode) {
    return divide(divisor, scale, roundingMode.oldMode);
}
```

Quy tắc làm tròn có rất nhiều loại, dưới đây liệt kê một vài:

```java
public enum RoundingMode {
   // 2.4 -> 3 , 1.6 -> 2
   // -1.6 -> -2 , -2.4 -> -3
   UP(BigDecimal.ROUND_UP),
   // 2.4 -> 2 , 1.6 -> 1
   // -1.6 -> -1 , -2.4 -> -2
   DOWN(BigDecimal.ROUND_DOWN),
   // 2.4 -> 3 , 1.6 -> 2
   // -1.6 -> -1 , -2.4 -> -2
   CEILING(BigDecimal.ROUND_CEILING),
   // 2.5 -> 2 , 1.6 -> 1
   // -1.6 -> -2 , -2.5 -> -3
   FLOOR(BigDecimal.ROUND_FLOOR),
   // 2.4 -> 2 , 1.6 -> 2
   // -1.6 -> -2 , -2.4 -> -2
   HALF_UP(BigDecimal.ROUND_HALF_UP),
   //......
}
```

### So sánh kích thước

`a.compareTo(b)` : trả về -1 nghĩa là `a` nhỏ hơn `b`, 0 nghĩa là `a` bằng `b`, 1 nghĩa là `a` lớn hơn `b`.

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("0.9");
System.out.println(a.compareTo(b));// 1
```

### Giữ lại một số chữ số thập phân

Sử dụng phương thức `setScale` để thiết lập số chữ số thập phân cần giữ lại và quy tắc làm tròn. Có khá nhiều quy tắc làm tròn, không cần phải nhớ, IDEA sẽ gợi ý.

```java
BigDecimal m = new BigDecimal("1.255433");
BigDecimal n = m.setScale(3,RoundingMode.HALF_DOWN);
System.out.println(n);// 1.255
```

## Vấn đề so sánh bằng nhau của BigDecimal

"Sổ tay phát triển Java của Alibaba" có đề cập:

![](https://oss.javaguide.cn/github/javaguide/java/basis/image-20220714161315993.png)

Mã ví dụ về vấn đề khi sử dụng phương thức `equals()` để so sánh bằng nhau với `BigDecimal`:

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("1.0");
System.out.println(a.equals(b));//false
```

Điều này là do phương thức `equals()` không chỉ so sánh giá trị (value) mà còn so sánh độ chính xác (scale), trong khi phương thức `compareTo()` khi so sánh sẽ bỏ qua độ chính xác.

Scale của 1.0 là 1, scale của 1 là 0, do đó kết quả của `a.equals(b)` là false.

![](https://oss.javaguide.cn/github/javaguide/java/basis/image-20220714164706390.png)

Phương thức `compareTo()` có thể so sánh giá trị của hai `BigDecimal`, nếu bằng nhau thì trả về 0, nếu số thứ nhất lớn hơn số thứ hai thì trả về 1, ngược lại trả về -1.

```java
BigDecimal a = new BigDecimal("1");
BigDecimal b = new BigDecimal("1.0");
System.out.println(a.compareTo(b));//0
```

## Chia sẻ lớp tiện ích BigDecimal

Trên mạng có một lớp tiện ích `BigDecimal` được khá nhiều người sử dụng, cung cấp nhiều phương thức tĩnh để đơn giản hóa các thao tác với `BigDecimal`.

Tôi đã thực hiện một số cải tiến đơn giản, chia sẻ mã nguồn:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 简化BigDecimal计算的小工具类
 */
public class BigDecimalUtil {

    /**
     * 默认除法运算精度
     */
    private static final int DEF_DIV_SCALE = 10;

    private BigDecimalUtil() {
    }

    /**
     * 使用 BigDecimal 进行加法运算，结果转换为 double 时仍可能发生舍入。
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
    public static double add(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.add(b2).doubleValue();
    }

    /**
     * 使用 BigDecimal 进行减法运算，结果转换为 double 时仍可能发生舍入。
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static double subtract(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.subtract(b2).doubleValue();
    }

    /**
     * 使用 BigDecimal 进行乘法运算，结果转换为 double 时仍可能发生舍入。
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double multiply(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
     * 小数点以后10位，以后的数字四舍六入五成双。
     *
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */
    public static double divide(double v1, double v2) {
        return divide(v1, v2, DEF_DIV_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍六入五成双。
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double divide(double v1, double v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.divide(b2, scale, RoundingMode.HALF_EVEN).doubleValue();
    }

    /**
     * 使用 HALF_EVEN 规则处理指定小数位。
     *
     * @param v     需要四舍六入五成双的数字
     * @param scale 小数点后保留几位
     * @return 四舍六入五成双后的结果
     */
    public static double round(double v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b = BigDecimal.valueOf(v);
        BigDecimal one = new BigDecimal("1");
        return b.divide(one, scale, RoundingMode.HALF_EVEN).doubleValue();
    }

    /**
     * 转换为 Float，超出 float 精度或范围时可能发生舍入或溢出
     *
     * @param v 需要被转换的数字
     * @return 返回转换结果
     */
    public static float convertToFloat(double v) {
        BigDecimal b = BigDecimal.valueOf(v);
        return b.floatValue();
    }

    /**
     * 转换为 Int，不进行舍入；小数部分会被截断，超出范围时会丢失高位
     *
     * @param v 需要被转换的数字
     * @return 返回转换结果
     */
    public static int convertsToInt(double v) {
        BigDecimal b = BigDecimal.valueOf(v);
        return b.intValue();
    }

    /**
     * 转换为 Long，不进行舍入；小数部分会被截断，超出范围时会丢失高位
     *
     * @param v 需要被转换的数字
     * @return 返回转换结果
     */
    public static long convertsToLong(double v) {
        BigDecimal b = BigDecimal.valueOf(v);
        return b.longValue();
    }

    /**
     * 返回两个数中大的一个值
     *
     * @param v1 需要被对比的第一个数
     * @param v2 需要被对比的第二个数
     * @return 返回两个数中大的一个值
     */
    public static double returnMax(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.max(b2).doubleValue();
    }

    /**
     * 返回两个数中小的一个值
     *
     * @param v1 需要被对比的第一个数
     * @param v2 需要被对比的第二个数
     * @return 返回两个数中小的一个值
     */
    public static double returnMin(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.min(b2).doubleValue();
    }

    /**
     * 精确对比两个数字
     *
     * @param v1 需要被对比的第一个数
     * @param v2 需要被对比的第二个数
     * @return 如果两个数一样则返回0，如果第一个数比第二个数大则返回1，反之返回-1
     */
    public static int compareTo(double v1, double v2) {
        BigDecimal b1 = BigDecimal.valueOf(v1);
        BigDecimal b2 = BigDecimal.valueOf(v2);
        return b1.compareTo(b2);
    }

}
```

Issue liên quan: [建议对保留规则设置为 RoundingMode.HALF_EVEN,即四舍六入五成双,#2129](https://github.com/Snailclimb/JavaGuide/issues/2129).

![RoundingMode.HALF_EVEN](https://oss.javaguide.cn/github/javaguide/java/basis/RoundingMode.HALF_EVEN.png)

## Tổng kết

Nhiều số thập phân không thể được biểu diễn chính xác bằng số nhị phân hữu hạn chữ số, do đó khi sử dụng `float` hoặc `double` để tính toán tồn tại nguy cơ mất độ chính xác.

Tuy nhiên, Java cung cấp `BigDecimal` để thao tác với số dấu phẩy động. Cài đặt của `BigDecimal` tận dụng `BigInteger`（dùng để thao tác số nguyên lớn）, điểm khác biệt là `BigDecimal` bổ sung khái niệm về vị trí thập phân.

<!-- @include: @article-footer.snippet.md -->