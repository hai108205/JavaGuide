---
title: Tổng hợp phương pháp làm mờ dữ liệu (Data Desensitization)
description: Giải thích chi tiết các phương pháp làm mờ dữ liệu, bao gồm quy tắc làm mờ cho các dữ liệu nhạy cảm như số điện thoại, căn cước, thẻ ngân hàng và phương pháp triển khai bằng công cụ Hutool.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 数据脱敏,隐私保护,手机号脱敏,身份证脱敏,掩码规则,敏感数据,测试数据,合规
---

<!-- @include: @article-header.snippet.md -->

> Bài viết này được chuyển ngữ và hoàn thiện từ [Hutool：一行代码搞定数据脱敏 - 京东云开发者](https://mp.weixin.qq.com/s/1qFWczesU50ndPPLtABHFg)。

## Làm mờ dữ liệu là gì

### Định nghĩa làm mờ dữ liệu

Làm mờ dữ liệu (Data Desensitization) được định nghĩa trong Bách khoa toàn thư Baidu như sau：

> Làm mờ dữ liệu, là chỉ việc biến đổi dữ liệu của một số thông tin nhạy cảm thông qua các quy tắc làm mờ, nhằm thực hiện bảo vệ đáng tin cậy dữ liệu riêng tư nhạy cảm. Như vậy có thể sử dụng an toàn tập dữ liệu thật đã được làm mờ trong các môi trường phát triển, kiểm thử và phi sản xuất (non-production) khác cũng như môi trường gia công bên ngoài. Trong các tình huống liên quan đến dữ liệu bảo mật khách hàng hoặc một số dữ liệu nhạy cảm thương mại, trong điều kiện không vi phạm quy tắc hệ thống, tiến hành cải tạo dữ liệu thật và cung cấp cho việc kiểm thử sử dụng, như số căn cước, số điện thoại, số thẻ, mã khách hàng và các thông tin cá nhân khác đều cần được làm mờ dữ liệu. Đây là một trong những kỹ thuật an toàn cơ sở dữ liệu.

Tổng thể mà nói, làm mờ dữ liệu là chỉ việc biến đổi dữ liệu của một số thông tin nhạy cảm thông qua các quy tắc làm mờ, nhằm thực hiện bảo vệ đáng tin cậy dữ liệu riêng tư nhạy cảm.

Trong quá trình làm mờ dữ liệu, thường sẽ áp dụng các thuật toán và kỹ thuật khác nhau, để xử lý dữ liệu theo các nhu cầu và tình huống khác nhau. Ví dụ, đối với số căn cước, có thể sử dụng thuật toán che giấu (masking) để giữ lại một số chữ số đầu, các vị trí khác thay thế bằng "X" hoặc "\*"; đối với họ tên, có thể sử dụng thuật toán giả mạo (pseudonymization), thay thế tên thật bằng tên giả được sinh ngẫu nhiên.

### Các quy tắc làm mờ thường dùng

Các quy tắc làm mờ thường dùng là để bảo vệ tính an toàn của dữ liệu nhạy cảm, biến đổi hoặc sửa đổi chúng khi xử lý và lưu trữ dữ liệu nhạy cảm.

Dưới đây là một số quy tắc làm mờ phổ biến：

- Thay thế (thường dùng)：Thay thế các ký tự hoặc chuỗi ký tự cụ thể trong dữ liệu nhạy cảm bằng các ký tự khác. Ví dụ, thay thế các chữ số ở giữa số thẻ tín dụng bằng dấu sao（\*）hoặc ký tự khác.
- Xóa：Xóa ngẫu nhiên một phần nội dung trong dữ liệu nhạy cảm. Ví dụ, xóa ngẫu nhiên 3 chữ số của số điện thoại.
- Sắp xếp lại：Xáo trộn thứ tự của một số ký tự hoặc trường trong dữ liệu gốc. Ví dụ, hoán đổi xen kẽ các vị trí ngẫu nhiên của số căn cước.
- Thêm nhiễu：Thêm vào dữ liệu một số sai số hoặc nhiễu, đạt được hiệu quả làm mờ dữ liệu. Ví dụ, thêm một số ký tự được sinh ngẫu nhiên vào dữ liệu nhạy cảm.
- Mã hóa hoặc Token hóa (thường dùng)：Khi cần khôi phục văn bản gốc, có thể sử dụng thuật toán mã hóa có bảo vệ tính toàn vẹn；khi không cần khôi phục văn bản gốc, có thể tùy theo mục đích sử dụng chọn cắt ngắn (truncation), token hóa hoặc HMAC với khóa độc lập. MD5, SHA-256 và các hàm băm khác không phải là thuật toán mã hóa, băm không khóa trực tiếp đối với dữ liệu có cấu trúc như số thẻ ngân hàng còn có thể bị liệt kê (enumeration). Có thể tham khảo bài viết tổng hợp thuật toán mã hóa phổ biến tại đây：<https://javaguide.cn/system-design/security/encryption-algorithms.html> 。
- ……

## Các công cụ làm mờ thường dùng

### Hutool

Hutool là một thư viện công cụ cơ bản Java, đóng gói các phương thức JDK về tập tin, luồng, mã hóa giải mã, chuyển mã, biểu thức chính quy, luồng, XML v.v., tổ hợp thành các lớp Util khác nhau, đồng thời cung cấp các thành phần sau：

|       Module       |                                                  Giới thiệu                                                   |
| :----------------: | :-----------------------------------------------------------------------------------------------------------: |
|     hutool-aop     |                        Đóng gói JDK dynamic proxy, cung cấp hỗ trợ AOP không dùng IOC                         |
| hutool-bloomFilter |                        Bộ lọc Bloom, cung cấp bộ lọc Bloom của một số thuật toán Hash                         |
|    hutool-cache    |                                           Triển khai cache đơn giản                                           |
|    hutool-core     |                             Lõi, bao gồm thao tác Bean, ngày tháng, các Util v.v.                             |
|    hutool-cron     |                   Module tác vụ định thời, cung cấp tác vụ định thời dạng biểu thức Crontab                   |
|   hutool-crypto    |            Module mã hóa giải mã, cung cấp đóng gói thuật toán đối xứng, bất đối xứng và tóm lược             |
|     hutool-db      |                    Thao tác dữ liệu sau khi đóng gói JDBC, dựa trên tư tưởng ActiveRecord                     |
|     hutool-dfa     |                                   Tìm kiếm đa từ khóa dựa trên mô hình DFA                                    |
|    hutool-extra    | Module mở rộng, đóng gói bên thứ ba（template engine, mail, Servlet, QR code, Emoji, FTP, phân đoạn từ v.v.） |
|    hutool-http     |                                Đóng gói Http client dựa trên HttpUrlConnection                                |
|     hutool-log     |                              Cổng giao tiếp log tự động nhận diện triển khai log                              |
|   hutool-script    |                                  Đóng gói thực thi script, ví dụ Javascript                                   |
|   hutool-setting   |                          Đóng gói tập tin cấu hình Setting và Properties mạnh mẽ hơn                          |
|   hutool-system    |                              Đóng gói gọi tham số hệ thống（thông tin JVM v.v.）                              |
|    hutool-json     |                                                Triển khai JSON                                                |
|   hutool-captcha   |                                        Triển khai mã xác nhận hình ảnh                                        |
|     hutool-poi     |                                       Đóng gói Excel và Word trong POI                                        |
|   hutool-socket    |                                 Đóng gói Socket dựa trên NIO và AIO của Java                                  |
|     hutool-jwt     |                                   Đóng gói triển khai JSON Web Token (JWT)                                    |

Có thể giới thiệu riêng từng module theo nhu cầu, cũng có thể giới thiệu tất cả module thông qua `hutool-all`, công cụ làm mờ dữ liệu được sử dụng trong bài viết này nằm trong module `hutool.core`.

Phiên bản Hutool mới nhất hiện tại hỗ trợ các loại dữ liệu làm mờ như sau, cơ bản bao phủ các thông tin nhạy cảm phổ biến.

1. ID người dùng
2. Họ tên tiếng Trung
3. Số căn cước
4. Số điện thoại bàn
5. Số điện thoại di động
6. Địa chỉ
7. Email
8. Mật khẩu
9. Biển số xe Trung Quốc đại lục, bao gồm xe thông thường, xe năng lượng mới
10. Thẻ ngân hàng

#### Một dòng code thực hiện làm mờ

Phương thức làm mờ do Hutool cung cấp như hình dưới đây：

![](https://oss.javaguide.cn/github/javaguide/system-design/security/2023-08-01-10-2119fnVCIDozqHgRGx.png)

Lưu ý：Hutool làm mờ bằng cách sử dụng \* để thay thế thông tin nhạy cảm, triển khai cụ thể nằm trong phương thức StrUtil.hide, nếu chúng ta muốn tùy chỉnh ký hiệu ẩn, thì có thể sao chép mã nguồn của Hutool ra, rồi triển khai lại.

Dưới đây lấy ví dụ làm mờ số điện thoại di động, số thẻ ngân hàng, số căn cước, thông tin mật khẩu, sau đây là code kiểm thử tương ứng.

```java
import cn.hutool.core.util.DesensitizedUtil;
import org.junit.Test;
import org.springframework.boot.test.context.Spring BootTest;

/**
 *
 * @description: Hutool triển khai làm mờ dữ liệu
 */
@Spring BootTest
public class HuToolDesensitizationTest {

    @Test
    public void testPhoneDesensitization(){
        String phone="13723231234";
        System.out.println(DesensitizedUtil.mobilePhone(phone)); //Kết quả：137****1234
    }
    @Test
    public void testBankCardDesensitization(){
        String bankCard="6217000130008255666";
        System.out.println(DesensitizedUtil.bankCard(bankCard)); //Kết quả：6217 **** **** *** 5666
    }

    @Test
    public void testIdCardNumDesensitization(){
        String idCardNum="411021199901102321";
        //Chỉ hiển thị 4 chữ số đầu và 2 chữ số cuối
        System.out.println(DesensitizedUtil.idCardNum(idCardNum,4,2)); //Kết quả：4110************21
    }
    @Test
    public void testPasswordDesensitization(){
        String password="www.jd.com_35711";
        System.out.println(DesensitizedUtil.password(password)); //Kết quả：****************
    }
}
```

Trên đây là sử dụng lớp công cụ đã được Hutool đóng gói sẵn để thực hiện làm mờ dữ liệu.

Cần đặc biệt lưu ý：mật khẩu không thuộc loại trường thông thường "sau khi làm mờ vẫn có thể tiếp tục hiển thị hoặc lưu trữ". Mật khẩu nên được xử lý càng sớm càng tốt tại đầu vào phía máy chủ bằng thuật toán băm mật khẩu chuyên dụng, không được lưu trữ, trả về hoặc ghi vào log dưới dạng văn bản gốc. `password()` ở đây chỉ biểu thị việc thay thế toàn bộ chuỗi bằng `*`, không thể thay thế cho việc băm mật khẩu.

#### Kết hợp Jackson thông qua chú thích (annotation) để thực hiện làm mờ

Bây giờ đã có lớp công cụ làm mờ dữ liệu, nếu phía frontend cần hiển thị dữ liệu ở nhiều nơi, chúng ta không thể ở mỗi nơi đều gọi một lớp công cụ, như vậy code sẽ trở nên quá dư thừa, vậy làm thế nào để thông qua chú thích một cách thanh lịch để hoàn thành làm mờ dữ liệu?

Nếu dự án là web project dựa trên Spring Boot, thì có thể lợi dụng tính năng tuần tự hóa tùy chỉnh jackson đi kèm với Spring Boot. Nguyên lý triển khai của nó thực ra chính là khi json tiến hành tuần tự hóa để render cho frontend, thì tiến hành làm mờ.

**Bước 1：Enum chiến lược làm mờ.**

```java
/**
 * @author
 * @description: Enum chiến lược làm mờ
 */
public enum DesensitizationTypeEnum {
    //Tùy chỉnh
    MY_RULE,
    //ID người dùng
    USER_ID,
    //Tên tiếng Trung
    CHINESE_NAME,
    //Số căn cước
    ID_CARD,
    //Số điện thoại bàn
    FIXED_PHONE,
    //Số điện thoại di động
    MOBILE_PHONE,
    //Địa chỉ
    ADDRESS,
    //Email
    EMAIL,
    //Mật khẩu
    PASSWORD,
    //Biển số xe Trung Quốc đại lục, bao gồm xe thông thường, xe năng lượng mới
    CAR_LICENSE,
    //Thẻ ngân hàng
    BANK_CARD
}
```

Trên đây biểu thị các loại làm mờ được hỗ trợ.

**Bước 2：Định nghĩa một chú thích Desensitization dùng để làm mờ.**

- `@Retention (RetentionPolicy.RUNTIME)`：Có hiệu lực khi chạy (runtime).
- `@Target (ElementType.FIELD)`：Có thể dùng trên trường (field).
- `@JacksonAnnotationsInside`：Có thể click vào xem bên trong, đây là một meta-annotation, chủ yếu dùng để đóng gói các chú thích khác cùng sử dụng.
- `@JsonSerialize`：Như đã nói ở trên, tác dụng của chú thích này là có thể tùy chỉnh tuần tự hóa, có thể dùng trên chú thích, phương thức, trường, lớp, có hiệu lực khi chạy v.v., dựa vào phương thức ghi đè trong lớp tuần tự hóa được cung cấp để thực hiện tuần tự hóa tùy chỉnh.

```java
/**
 * @author
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotationsInside
@JsonSerialize(using = DesensitizationSerialize.class)
public @interface Desensitization {
    /**
     * Loại dữ liệu làm mờ, khi là MY_RULE, startInclude và endExclude có hiệu lực
     */
    DesensitizationTypeEnum type() default DesensitizationTypeEnum.MY_RULE;

    /**
     * Vị trí bắt đầu làm mờ (bao gồm)
     */
    int startInclude() default 0;

    /**
     * Vị trí kết thúc làm mờ (không bao gồm)
     */
    int endExclude() default 0;
}
```

Chú ý：Chỉ khi sử dụng enum làm mờ tùy chỉnh `MY_RULE`, vị trí bắt đầu và vị trí kết thúc mới có hiệu lực.

**Bước 3：Tạo lớp tuần tự hóa tùy chỉnh**

Bước này là mấu chốt để chúng ta thực hiện làm mờ dữ liệu. Lớp tuần tự hóa tùy chỉnh kế thừa `JsonSerializer`, triển khai interface `ContextualSerializer`, và ghi đè hai phương thức.

```java
/**
 * @author
 * @description: Lớp tuần tự hóa tùy chỉnh
 */
@AllArgsConstructor
@NoArgsConstructor
public class DesensitizationSerialize extends JsonSerializer<String> implements ContextualSerializer {
    private DesensitizationTypeEnum type;

    private Integer startInclude;

    private Integer endExclude;

    @Override
    public void serialize(String str, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        switch (type) {
            // Làm mờ loại tùy chỉnh
            case MY_RULE:
                jsonGenerator.writeString(CharSequenceUtil.hide(str, startInclude, endExclude));
                break;
            // Làm mờ userId
            case USER_ID:
                jsonGenerator.writeString(String.valueOf(DesensitizedUtil.userId()));
                break;
            // Làm mờ tên tiếng Trung
            case CHINESE_NAME:
                jsonGenerator.writeString(DesensitizedUtil.chineseName(String.valueOf(str)));
                break;
            // Làm mờ căn cước
            case ID_CARD:
                jsonGenerator.writeString(DesensitizedUtil.idCardNum(String.valueOf(str), 1, 2));
                break;
            // Làm mờ điện thoại bàn
            case FIXED_PHONE:
                jsonGenerator.writeString(DesensitizedUtil.fixedPhone(String.valueOf(str)));
                break;
            // Làm mờ số điện thoại di động
            case MOBILE_PHONE:
                jsonGenerator.writeString(DesensitizedUtil.mobilePhone(String.valueOf(str)));
                break;
            // Làm mờ địa chỉ
            case ADDRESS:
                jsonGenerator.writeString(DesensitizedUtil.address(String.valueOf(str), 8));
                break;
            // Làm mờ email
            case EMAIL:
                jsonGenerator.writeString(DesensitizedUtil.email(String.valueOf(str)));
                break;
            // Làm mờ mật khẩu
            case PASSWORD:
                jsonGenerator.writeString(DesensitizedUtil.password(String.valueOf(str)));
                break;
            // Làm mờ biển số xe Trung Quốc
            case CAR_LICENSE:
                jsonGenerator.writeString(DesensitizedUtil.carLicense(String.valueOf(str)));
                break;
            // Làm mờ thẻ ngân hàng
            case BANK_CARD:
                jsonGenerator.writeString(DesensitizedUtil.bankCard(String.valueOf(str)));
                break;
            default:
        }

    }

    @Override
    public JsonSerializer<?> createContextual(SerializerProvider serializerProvider, BeanProperty beanProperty) throws JsonMappingException {
        if (beanProperty != null) {
            // Phán đoán loại dữ liệu có phải là String hay không
            if (Objects.equals(beanProperty.getType().getRawClass(), String.class)) {
                // Lấy chú thích đã định nghĩa
                Desensitization desensitization = beanProperty.getAnnotation(Desensitization.class);
                // Là null
                if (desensitization == null) {
                    desensitization = beanProperty.getContextAnnotation(Desensitization.class);
                }
                // Không phải null
                if (desensitization != null) {
                    // Tạo instance của lớp tuần tự hóa đã định nghĩa và trả về, tham số đầu vào là type, vị trí bắt đầu, vị trí kết thúc được định nghĩa trong chú thích.
                    return new DesensitizationSerialize(desensitization.type(), desensitization.startInclude(),
                            desensitization.endExclude());
                }
            }

            return serializerProvider.findValueSerializer(beanProperty.getType(), beanProperty);
        }
        return serializerProvider.findNullValueSerializer(null);
    }
}
```

Sau ba bước trên, đã hoàn thành việc thực hiện làm mờ dữ liệu thông qua chú thích, dưới đây chúng ta kiểm thử một chút.

Đầu tiên định nghĩa một pojo để kiểm thử, thêm chiến lược làm mờ vào trường tương ứng.

```java
/**
 *
 * @description:
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestPojo {

    private String userName;

    @Desensitization(type = DesensitizationTypeEnum.MOBILE_PHONE)
    private String phone;

    @Desensitization(type = DesensitizationTypeEnum.MY_RULE, startInclude = 0, endExclude = 2)
    private String address;
}
```

Tiếp theo viết một controller kiểm thử

```java
@RestController
public class TestController {

    @RequestMapping("/test")
    public TestPojo testDesensitization(){
        TestPojo testPojo = new TestPojo();
        testPojo.setUserName("我是用户名");
        testPojo.setAddress("地球中国-北京市通州区京东总部2号楼");
        testPojo.setPhone("13782946666");
        return testPojo;
    }

}
```

![](https://oss.javaguide.cn/github/javaguide/system-design/security/2023-08-02-16-497DdCBy8vbf2D69g.png)

Có thể thấy chúng ta đã thực hiện thành công làm mờ dữ liệu.

### Apache ShardingSphere

ShardingSphere là một hệ sinh thái được tạo thành từ bộ giải pháp middleware cơ sở dữ liệu phân tán mã nguồn mở, nó bao gồm 3 sản phẩm độc lập là Sharding-JDBC, Sharding-Proxy và Sharding-Sidecar（đang lên kế hoạch）. Chúng đều cung cấp các chức năng phân mảnh dữ liệu tiêu chuẩn hóa, giao dịch phân tán và quản trị cơ sở dữ liệu.

Apache ShardingSphere có một module làm mờ dữ liệu, module này tích hợp các chức năng làm mờ dữ liệu thường dùng. Nguyên lý cơ bản của nó là phân tích và chặn SQL do người dùng nhập vào, dựa vào cấu hình làm mờ của người dùng để tiến hành viết lại SQL, từ đó thực hiện mã hóa trường văn bản gốc và giải mã trường đã mã hóa. Cuối cùng thực hiện lưu trữ, truy vấn mã hóa và giải mã mà người dùng không cảm nhận được.

Thông qua Apache ShardingSphere có thể tự động hóa và minh bạch hóa quá trình làm mờ dữ liệu, người dùng không cần quan tâm đến chi tiết triển khai trung gian của việc làm mờ. Hơn nữa, cung cấp nhiều chiến lược làm mờ có sẵn, của bên thứ ba (AKS), người dùng chỉ cần cấu hình đơn giản là có thể sử dụng.

Địa chỉ tài liệu chính thức：<https://shardingsphere.apache.org/document/4.1.1/cn/features/orchestration/encrypt/> 。

### FastJSON

Khi phát triển dự án Web hàng ngày, ngoài công cụ tuần tự hóa mặc định đi kèm Spring, FastJson cũng là một công cụ tuần tự hóa giao diện Spring Web Restful rất thường dùng.

FastJSON thực hiện làm mờ dữ liệu chủ yếu có hai cách：

- Dựa trên chú thích `@JSONField` để thực hiện：cần tùy chỉnh một lớp dùng để tuần tự hóa làm mờ, sau đó trên trường cần làm mờ thông qua `serializeUsing` trong `@JSONField` chỉ định là loại tuần tự hóa tùy chỉnh của chúng ta.
- Dựa trên bộ lọc tuần tự hóa：cần triển khai interface `ValueFilter`, ghi đè phương thức `process` để hoàn thành làm mờ tùy chỉnh, sau đó khi chuyển đổi JSON sử dụng chiến lược chuyển đổi tùy chỉnh. Triển khai cụ thể có thể tham khảo bài viết này： <https://juejin.cn/post/7067916686141161479>。

### Mybatis-Mate

Trước tiên giới thiệu mối quan hệ giữa ba bên MyBatis, MyBatis-Plus và Mybatis-Mate：

- MyBatis là một framework tầng persistence xuất sắc, nó hỗ trợ SQL tùy chỉnh, stored procedure và ánh xạ nâng cao.
- MyBatis-Plus là một công cụ tăng cường cho MyBatis, có thể đơn giản hóa đáng kể công việc phát triển tầng persistence.
- Mybatis-Mate là module cấp doanh nghiệp được cung cấp cho MyBatis-Plus, nhằm xử lý dữ liệu một cách nhanh nhẹn và thanh lịch hơn. Tuy nhiên, trước khi sử dụng cần cấu hình mã cấp phép（trả phí）.

Mybatis-Mate hỗ trợ làm mờ từ khóa nhạy cảm, tích hợp sẵn 9 loại quy tắc làm mờ thường dùng như số điện thoại di động, email, số thẻ ngân hàng v.v.

```java
@FieldSensitive("testStrategy")
private String username;

@Configuration
public class SensitiveStrategyConfig {

    /**
     * Tiêm chiến lược làm mờ
     */
    @Bean
    public ISensitiveStrategy sensitiveStrategy() {
        // Tùy chỉnh xử lý làm mờ loại testStrategy
        return new SensitiveStrategy().addStrategy("testStrategy", t -> t + "***test***");
    }
}

// Bỏ qua xử lý làm mờ, dùng cho tình huống chỉnh sửa
RequestDataTransfer.skipSensitive();
```

### MyBatis-Flex

Tương tự như MybatisPlus, MyBatis-Flex cũng là một framework tăng cường MyBatis. MyBatis-Flex cũng cung cấp chức năng làm mờ dữ liệu, và có thể sử dụng miễn phí.

MyBatis-Flex cung cấp chú thích `@ColumnMask()`, cùng 9 loại quy tắc làm mờ tích hợp sẵn, sử dụng ngay：

```java
/**
 * Các phương thức làm mờ dữ liệu tích hợp sẵn
 */
public class Masks {
    /**
     * Làm mờ số điện thoại di động
     */
    public static final String MOBILE = "mobile";
    /**
     * Làm mờ điện thoại bàn
     */
    public static final String FIXED_PHONE = "fixed_phone";
    /**
     * Làm mờ số căn cước
     */
    public static final String ID_CARD_NUMBER = "id_card_number";
    /**
     * Làm mờ tên tiếng Trung
     */
    public static final String CHINESE_NAME = "chinese_name";
    /**
     * Làm mờ địa chỉ
     */
    public static final String ADDRESS = "address";
    /**
     * Làm mờ email
     */
    public static final String EMAIL = "email";
    /**
     * Làm mờ mật khẩu
     */
    public static final String PASSWORD = "password";
    /**
     * Làm mờ biển số xe
     */
    public static final String CAR_LICENSE = "car_license";
    /**
     * Làm mờ số thẻ ngân hàng
     */
    public static final String BANK_CARD_NUMBER = "bank_card_number";
    //...
}
```

Ví dụ sử dụng：

```java
@Table("tb_account")
public class Account {

    @Id(keyType = KeyType.Auto)
    private Long id;

    @ColumnMask(Masks.CHINESE_NAME)
    private String userName;

    @ColumnMask(Masks.EMAIL)
    private String email;

}
```

Nếu các quy tắc làm mờ tích hợp sẵn này không đáp ứng yêu cầu của bạn, bạn còn có thể tùy chỉnh quy tắc làm mờ.

1、Đăng ký quy tắc làm mờ mới thông qua `MaskManager`：

```java
MaskManager.registerMaskProcessor("tên quy tắc tùy chỉnh"
        , data -> {
            return data;
        })
```

2、Sử dụng quy tắc làm mờ tùy chỉnh

```java
@Table("tb_account")
public class Account {

    @Id(keyType = KeyType.Auto)
    private Long id;

    @ColumnMask("tên quy tắc tùy chỉnh")
    private String userName;
}
```

Hơn nữa, đối với tình huống cần bỏ qua xử lý làm mờ, ví dụ vào trang chỉnh sửa để sửa dữ liệu người dùng, MyBatis-Flex cũng cung cấp hỗ trợ tương ứng：

1. **`MaskManager#execWithoutMask`**（khuyến nghị）：Phương thức này sử dụng mẫu thiết kế template method, đảm bảo bỏ qua xử lý làm mờ và thực thi logic liên quan xong sẽ tự động khôi phục xử lý làm mờ.
2. **`MaskManager#skipMask`**：Bỏ qua xử lý làm mờ.
3. **`MaskManager#restoreMask`**：Khôi phục xử lý làm mờ, đảm bảo các thao tác tiếp theo tiếp tục sử dụng logic làm mờ.

Phương thức `MaskManager#execWithoutMask` được triển khai như sau：

```java
public static <T> T execWithoutMask(Supplier<T> supplier) {
    try {
        skipMask();
        return supplier.get();
    } finally {
        restoreMask();
    }
}
```

Phương thức `skipMask` và `restoreMask` của `MaskManager` thường sử dụng cùng nhau, khuyến nghị mẫu `try{...}finally{...}`.

## Tổng kết

Bài viết này chủ yếu giới thiệu：

- Định nghĩa làm mờ dữ liệu：làm mờ dữ liệu là chỉ việc biến đổi dữ liệu của một số thông tin nhạy cảm thông qua các quy tắc làm mờ, nhằm thực hiện bảo vệ đáng tin cậy dữ liệu riêng tư nhạy cảm.
- Các quy tắc làm mờ thường dùng：thay thế, xóa, sắp xếp lại, thêm nhiễu và mã hóa.
- Các công cụ làm mờ thường dùng：Hutool, Apache ShardingSphere, FastJSON, Mybatis-Mate và MyBatis-Flex.

## Tham khảo

- OWASP Cryptographic Storage Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html>
- PCI SSC FAQ 1492 - PAN masking：<https://www.pcisecuritystandards.org/faqs/1492/>
- Trang web chính thức của Hutool： <https://hutool.cn/docs/#/>
- Bàn về cách tùy chỉnh làm mờ dữ liệu：<https://juejin.cn/post/7046567603971719204>
- FastJSON thực hiện làm mờ dữ liệu：<https://juejin.cn/post/7067916686141161479>

<!-- @include: @article-footer.snippet.md -->
