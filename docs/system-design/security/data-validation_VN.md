---
title: Tại sao cả frontend và backend đều cần kiểm tra dữ liệu (Data Validation)?
description: Giải thích chi tiết về sự cần thiết của kiểm tra dữ liệu ở cả frontend và backend, bao gồm tầm quan trọng của kiểm tra tham số, kiểm tra quyền và các biện pháp bảo vệ an toàn chống lại việc vượt qua kiểm tra frontend.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 数据校验,前端校验,后端校验,参数校验,权限校验,输入验证,安全防护,防注入
---

> Câu hỏi phỏng vấn liên quan：
>
> - Frontend đã kiểm tra rồi, backend còn cần kiểm tra nữa không?
> - Frontend đã làm kiểm tra dữ liệu rồi, tại sao backend còn cần làm lại một lần nữa những kiểm tra giống hệt (thậm chí còn nghiêm ngặt hơn)?
> - Frontend/Backend cần kiểm tra những nội dung gì?

Khi chúng ta làm phát triển Web hàng ngày, bất kể là viết trang frontend hay interface backend, đều không thể tách rời việc làm việc với dữ liệu. Vậy làm thế nào để đảm bảo những dữ liệu truyền qua truyền lại này là đáng tin cậy và an toàn? Điều này phải dựa vào **kiểm tra dữ liệu (Data Validation)**. Hơn nữa, công việc này, frontend phải làm, backend **càng phải làm**, còn phải thêm **kiểm tra quyền (Permission/Authorization Check)** là "ổ khóa" quan trọng này, thiếu một thứ cũng không được!

Tại sao nói như vậy? Bạn nghĩ xem, kiểm tra frontend chủ yếu là vì trải nghiệm người dùng và chặn lại một số dữ liệu "điền bậy" rõ ràng, nhưng người am hiểu kỹ thuật vượt qua kiểm tra frontend thực sự quá dễ dàng (ví dụ như dùng trực tiếp các công cụ như Postman để gửi request). Vì vậy, **kiểm tra backend mới là tuyến phòng thủ cuối cùng, cũng là tuyến phòng thủ cứng rắn nhất cho an toàn hệ thống và tính chính xác của dữ liệu**. Nó phải đảm bảo dữ liệu đi vào hệ thống không chỉ đúng định dạng, mà còn phải phù hợp với quy tắc nghiệp vụ, quan trọng nhất là, người thực hiện thao tác này phải có **quyền**!

![](https://oss.javaguide.cn/github/javaguide/system-design/security/user-input-validation.png)

## Kiểm tra frontend

Kiểm tra frontend giống như một người gác cổng tận tâm, mục đích chính là lúc người dùng đang điền dữ liệu, liền nhanh chóng thông báo cho họ biết chỗ nào không đúng, để họ sửa, tránh việc điền cả buổi, kết quả backend báo không được, còn phải làm lại. Lợi ích của việc này rất rõ ràng：

1. **Trải nghiệm người dùng tốt：** Khi nhập liệu đã có gợi ý, sai là biết ngay, sửa rất tiện, người dùng cảm thấy mượt mà không bực mình.
2. **Giảm áp lực cho backend：** Chặn lại một số dữ liệu rõ ràng sai định dạng, thiếu trường bắt buộc ngay ở frontend, giảm bớt request không hợp lệ gửi đến backend, tiết kiệm tài nguyên máy chủ và lưu lượng mạng. Cần lưu ý là, backend vẫn phải kiểm tra, chỉ là thêm kiểm tra frontend có thể giảm rất nhiều request không hợp lệ.

Vậy frontend thường phải kiểm tra những gì?

- **Kiểm tra trường bắt buộc:** Cơ bản nhất, chỗ cần điền thì không được để trống.
- **Kiểm tra định dạng:** Ví dụ email phải giống dạng email (như `xxx@xx.com`), số điện thoại di động phải là 11 chữ số v.v. Biểu thức chính quy (regex) lúc này sẽ phát huy tác dụng.
- **Kiểm tra nhập trùng lặp：** Đảm bảo nội dung hai lần nhập giống nhau, ví dụ như trường "xác nhận mật khẩu" khi đăng ký.
- **Kiểm tra phạm vi/độ dài:** Tuổi không thể là số âm chứ? Độ dài mật khẩu phải từ 6 đến 20 ký tự chứ? Những thứ này đều phải để ý.
- **Kiểm tra tính hợp lệ/nghiệp vụ:** Ví dụ tên người dùng đã được đăng ký chưa? Sản phẩm đã chọn còn hàng tồn kho không? Cái này phải dựa theo nghiệp vụ cụ thể, cần phối hợp với backend để làm.
- **Kiểm tra upload tập tin：**Hạn chế loại tập tin (như chỉ hỗ trợ định dạng `.jpg`, `.png`) và kích thước tập tin.
- **Kiểm tra an toàn:** Phòng chống những ý đồ xấu như XSS (Cross-Site Scripting), xử lý một chút đối với những thứ người dùng nhập vào, đừng để script của người khác viết chạy trên trang của chúng ta.
- ...v.v., tùy theo nhu cầu nghiệp vụ.

Tóm lại, cốt lõi của kiểm tra frontend là **dẫn dắt người dùng nhập đúng** và **nâng cao trải nghiệm tương tác**.

## Kiểm tra backend

Kiểm tra frontend chỉ là tuyến phòng thủ đầu tiên, mặc dù đã nâng cao trải nghiệm người dùng, nhưng dù sao cũng có thể bị vượt qua, thứ thực sự đóng vai trò quyết định là kiểm tra backend. Backend cần phải giữ thái độ "có thể có vấn đề" đối với tất cả dữ liệu từ frontend truyền đến, tiến hành rà soát toàn diện. Kiểm tra backend không chỉ phải bao phủ các kiểm tra cơ bản của frontend (như định dạng, phạm vi, độ dài v.v.), mà còn cần xác minh nghiêm ngặt hơn, sâu sắc hơn, đảm bảo an toàn hệ thống và tính nhất quán của dữ liệu. Dưới đây là nội dung trọng tâm của kiểm tra backend：

1. **Kiểm tra tính toàn vẹn:** Các trường được yêu cầu rõ ràng trong tài liệu interface phải tồn tại, ví dụ `userId` và `orderId`. Nếu thiếu bất kỳ trường bắt buộc nào, backend phải trả về lỗi ngay lập tức, từ chối xử lý request.
2. **Kiểm tra tính hợp lệ/tồn tại:** Xác minh dữ liệu truyền vào có thực sự hợp lệ hay không. Ví dụ, `productId` truyền đến có tồn tại trong cơ sở dữ liệu không? `couponId` đã hết hạn hoặc đã được sử dụng chưa? Điều này thường cần thông qua việc truy vấn database hoặc gọi service khác để xác nhận.
3. **Kiểm tra tính nhất quán:** Đối với các thao tác liên quan đến nhiều đối tượng dữ liệu, xác minh chúng có phù hợp với logic nghiệp vụ hay không. Ví dụ, trước khi cập nhật trạng thái đơn hàng, cần đảm bảo trạng thái hiện tại của đơn hàng cho phép sửa đổi, không thể nhảy trực tiếp từ "chưa thanh toán" sang "đã hoàn thành". Kiểm tra tính nhất quán là mấu chốt để đảm bảo tính chính xác của luồng dữ liệu.
4. **Kiểm tra an toàn:** Backend phải phòng chống các loại tấn công độc hại, bao gồm nhưng không giới hạn ở XSS, SQL Injection v.v. Tất cả đầu vào từ bên ngoài đều phải được lọc và xác minh nghiêm ngặt, ví dụ sử dụng tham số hóa truy vấn (parameterized query) để ngăn SQL Injection, hoặc escape dữ liệu HTML trả về để tránh tấn công cross-site scripting.
5. ...Về cơ bản, những kiểm tra mà frontend làm được, backend vì lý do an toàn đều phải làm lại một lần.

Trong Java backend, mỗi lần đều viết tay if-else để làm những kiểm tra cơ bản này thực sự quá mệt mỏi. May mắn là cộng đồng Java đã cung cấp cho chúng ta bộ quy phạm tiêu chuẩn **Bean Validation**. Nó cho phép chúng ta sử dụng **annotation**, khai báo trực tiếp quy tắc kiểm tra trên thuộc tính của JavaBean (ví dụ như đối tượng DTO của chúng ta), rất tiện lợi.

- **JSR 303 (1.0):** Đặt nền móng, giới thiệu `@NotNull`, `@Size`, `@Min`, `@Max` những người bạn cũ này.
- **JSR 349 (1.1):** Tăng cường kiểm tra tham số phương thức và giá trị trả về, còn có kiểm tra nhóm (group validation) v.v.
- **JSR 380 (2.0):** Ôm trọn Java 8, hỗ trợ API ngày giờ mới, còn thêm `@NotEmpty`, `@NotBlank`, `@Email` và các annotation thực dụng hơn.

Spring Boot giai đoạn đầu (khoảng trước 2.3.x): spring-boot-starter-web đã tích hợp sẵn `hibernate-validator`, bạn không cần thêm gì cả.

Spring Boot 2.3.x trở về sau: Để linh hoạt hơn, các dependency liên quan đến kiểm tra đã được tách riêng ra. Bạn cần thêm thủ công dependency `spring-boot-starter-validation`：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Quy phạm Bean Validation và các triển khai của nó (như Hibernate Validator) cung cấp annotation phong phú, dùng để định nghĩa quy tắc kiểm tra theo kiểu khai báo. Dưới đây là một số annotation thường dùng và giải thích：

- `@NotNull`: Kiểm tra phần tử được chú thích (bất kỳ loại nào) không được là `null`.
- `@NotEmpty`: Kiểm tra phần tử được chú thích (như `CharSequence`, `Collection`, `Map`, `Array`) không được là `null` và kích thước/độ dài của nó không được là 0. Lưu ý：đối với chuỗi, `@NotEmpty` cho phép chuỗi chứa ký tự khoảng trắng, như `" "`.
- `@NotBlank`: Kiểm tra `CharSequence` được chú thích (như `String`) không được là `null`, và độ dài sau khi loại bỏ khoảng trắng đầu cuối phải lớn hơn 0. (tức là, không được là chuỗi khoảng trắng).
- `@Null`: Kiểm tra phần tử được chú thích phải là `null`.
- `@AssertTrue` / `@AssertFalse`: Kiểm tra phần tử loại `boolean` hoặc `Boolean` được chú thích phải là `true` / `false`.
- `@Min(value)` / `@Max(value)`: Kiểm tra giá trị của loại số được chú thích (hoặc biểu diễn chuỗi của nó) phải lớn hơn hoặc bằng / nhỏ hơn hoặc bằng `value` được chỉ định. Áp dụng cho loại số nguyên (`byte`, `short`, `int`, `long`, `BigInteger` v.v.).
- `@DecimalMin(value)` / `@DecimalMax(value)`: Chức năng tương tự `@Min` / `@Max`, nhưng áp dụng cho loại số bao gồm số thập phân (`BigDecimal`, `BigInteger`, `CharSequence`, `byte`, `short`, `int`, `long` và các lớp wrapper của chúng). `value` phải là biểu diễn chuỗi của số.
- `@Size(min=, max=)`: Kiểm tra kích thước/độ dài của phần tử được chú thích (như `CharSequence`, `Collection`, `Map`, `Array`) phải nằm trong phạm vi `min` và `max` được chỉ định (bao gồm biên).
- `@Digits(integer=, fraction=)`: Kiểm tra giá trị của loại số được chú thích (hoặc biểu diễn chuỗi của nó), số chữ số phần nguyên phải ≤ `integer`, số chữ số phần thập phân phải ≤ `fraction`.
- `@Pattern(regexp=, flags=)`: Kiểm tra `CharSequence` được chú thích (như `String`) có khớp với biểu thức chính quy (`regexp`) được chỉ định hay không. `flags` có thể chỉ định chế độ khớp (như không phân biệt chữ hoa chữ thường).
- `@Email`: Kiểm tra `CharSequence` được chú thích (như `String`) có phù hợp với định dạng Email hay không (tích hợp sẵn một biểu thức chính quy tương đối lỏng).
- `@Past` / `@Future`: Kiểm tra loại ngày hoặc thời gian được chú thích (`java.util.Date`, `java.util.Calendar`, các loại trong gói `java.time` của JSR 310) có ở trước / sau thời gian hiện tại hay không.
- `@PastOrPresent` / `@FutureOrPresent`: Tương tự `@Past` / `@Future`, nhưng cho phép bằng với thời gian hiện tại.
- ……

Khi phương thức Controller sử dụng annotation `@RequestBody` để nhận body request và liên kết nó với một đối tượng, có thể thêm annotation `@Valid` trước tham số đó để kích hoạt kiểm tra đối với đối tượng đó. Nếu xác minh thất bại, nó sẽ ném ra `MethodArgumentNotValidException`.

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @NotNull(message = "classId không được để trống")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name không được để trống")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "giá trị sex không nằm trong phạm vi tùy chọn")
    @NotNull(message = "sex không được để trống")
    private String sex;

    @Email(message = "định dạng email không đúng")
    @NotNull(message = "email không được để trống")
    private String email;
}


@RestController
@RequestMapping("/api")
public class PersonController {
    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

Đối với dữ liệu loại đơn giản được ánh xạ trực tiếp đến tham số phương thức (như biến đường dẫn `@PathVariable` hoặc tham số request `@RequestParam`), cách kiểm tra có chút khác biệt：

1. **Thêm annotation `@Validated` trên lớp Controller**：Annotation này do Spring cung cấp (không phải tiêu chuẩn JSR), nó cho phép Spring xử lý annotation kiểm tra tham số ở cấp phương thức. **Đây là bước bắt buộc.**
2. **Đặt annotation kiểm tra trực tiếp lên tham số phương thức**：Áp dụng trực tiếp các annotation kiểm tra như `@Min`, `@Max`, `@Size`, `@Pattern` vào tham số `@PathVariable` hoặc `@RequestParam` tương ứng.

Nhất định nhất định đừng quên thêm annotation `@Validated` lên lớp, tham số này có thể báo cho Spring đi kiểm tra tham số phương thức.

```java
@RestController
@RequestMapping("/api")
@Validated // Bước quan trọng 1: phải thêm @Validated lên lớp
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(
            @PathVariable("id")
            @Max(value = 5, message = "ID không được vượt quá 5") // Bước quan trọng 2: annotation kiểm tra đặt trực tiếp lên tham số
            Integer id
    ) {
        // Nếu id truyền vào > 5, Spring sẽ ném ra ngoại lệ ConstraintViolationException trước khi vào thân phương thức.
        // Global exception handler cũng cần xử lý ngoại lệ này.
        return ResponseEntity.ok().body(id);
    }

    @GetMapping("/person")
    public ResponseEntity<String> findPersonByName(
            @RequestParam("name")
            @NotBlank(message = "tên không được để trống") // Cũng áp dụng cho @RequestParam
            @Size(max = 10, message = "độ dài tên không được vượt quá 10")
            String name
    ) {
        return ResponseEntity.ok().body("Found person: " + name);
    }
}
```

Bean Validation chủ yếu giải quyết kiểm tra ở cấp **định dạng dữ liệu, ngữ pháp**. Nhưng chỉ có cái này thôi vẫn chưa đủ.

## Kiểm tra quyền (Permission/Authorization Check)

Định dạng dữ liệu đều đã kiểm tra qua, không có vấn đề. Nhưng, **thao tác này, người dùng hiện đang đăng nhập này, anh ta có quyền làm không?** Đây chính là vấn đề mà **kiểm tra quyền** phải giải quyết. Ví dụ：

- Người dùng thông thường có thể sửa đơn hàng của người khác không? (Không)
- Khách truy cập có thể truy cập interface quản trị backend không? (Không)
- Khách truy cập có thể quản lý thông tin của người dùng khác không? (Không)
- Người dùng VIP có thể sử dụng phiếu giảm giá độc quyền không? (Có thể)
- ……

Kiểm tra dữ liệu và kiểm tra quyền không phải trong tất cả các interface đều tuân theo cùng một thứ tự trước sau một cách nghiêm ngặt. Thông thường nên hoàn thành phân tích request, hạn chế độ dài và kiểm tra định dạng cơ bản trước, và xác nhận danh tính người dùng càng sớm càng tốt; trước khi tiết lộ với bên gọi liệu tài nguyên có tồn tại hay không hoặc trả về kết quả truy vấn, phải hoàn thành kiểm tra quyền mức thô (coarse-grained) và mức đối tượng (object-level). Khi ủy quyền phụ thuộc vào thuộc tính tài nguyên, có thể đưa trực tiếp điều kiện ủy quyền vào truy vấn, hoặc kiểm tra ngay sau khi đọc, nhưng chưa được ủy quyền thì không được tiết lộ thông tin tài nguyên ra bên ngoài. Sau đó, mới đưa kiểm tra tính nhất quán nghiệp vụ và ủy quyền mức chi tiết hơn vào Service hoặc tầng truy cập dữ liệu để thực thi theo ngữ nghĩa giao dịch (transaction).

Kiểm tra quyền quan tâm đến "**Ai (Who)** có thể thực hiện **thao tác gì (What Action)** đối với **tài nguyên nào (What Resource)**". Bất kể quy trình phân tầng như thế nào, đều không được trả về nội dung tài nguyên trong tình trạng chưa được ủy quyền, cũng không được chỉ dựa vào một lần kiểm tra của Controller hoặc frontend.

**Tại sao kiểm tra quyền quan trọng như vậy?**

- **Nền tảng an toàn：** Ngăn chặn truy cập và thao tác trái phép, bảo vệ dữ liệu người dùng và an toàn hệ thống.
- **Cách ly nghiệp vụ：** Đảm bảo các vai trò khác nhau (quản trị viên, người dùng thông thường, người dùng VIP v.v.) chỉ có thể truy cập và thao tác các chức năng trong phạm vi quyền hạn của mình.
- **Yêu cầu tuân thủ：** Nhiều quy định ngành nghề có yêu cầu nghiêm ngặt về quyền truy cập dữ liệu.

Hiện tại phương thức chủ đạo trong Java backend là sử dụng framework bảo mật trưởng thành để thực hiện kiểm tra quyền, thay vì tự viết tay (dễ sai sót và khó bảo trì).

1. **Spring Security (tiêu chuẩn ngành, khuyến nghị):** Dựa trên chuỗi bộ lọc (Filter Chain) để chặn request, tiến hành xác thực (Authentication - Bạn là ai?) và ủy quyền (Authorization - Bạn có thể làm gì?). Spring Security có chức năng mạnh mẽ, cộng đồng sôi động, tích hợp liền mạch với hệ sinh thái Spring. Tuy nhiên, cấu hình tương đối phức tạp, đường cong học tập dốc.
2. **Apache Shiro:** Một framework bảo mật phổ biến khác, so với Spring Security thì nhẹ hơn, API trực quan dễ hiểu hơn. Cũng cung cấp các chức năng xác thực, ủy quyền, quản lý phiên, mã hóa v.v. Đối với những dự án không quen thuộc với Spring hoặc thấy Spring Security quá nặng, là một lựa chọn không tồi.
3. **Sa-Token:** Framework xác thực quyền Java nhẹ do Trung Quốc phát triển. Hỗ trợ xác thực ủy quyền, đăng nhập một lần (SSO), đá người dùng offline, tự động gia hạn và các chức năng khác. So với Spring Security và Shiro, Sa-Token có nhiều chức năng tích hợp sẵn sử dụng ngay hơn, sử dụng cũng đơn giản hơn.
4. **Kiểm tra thủ công (không khuyến nghị cho tình huống phức tạp):** Trong code tầng Service hoặc Controller, thủ công lấy thông tin người dùng hiện tại (ví dụ từ SecurityContextHolder hoặc Session), rồi dùng if-else phán đoán vai trò hoặc quyền của người dùng. Logic quyền và logic nghiệp vụ bị ghép cặp (coupling), code trùng lặp, khó bảo trì, dễ bỏ sót. Chỉ phù hợp với tình huống quyền rất đơn giản.

**Giới thiệu mô hình quyền:**

- **RBAC (Role-Based Access Control):** Kiểm soát truy cập dựa trên vai trò. Gán vai trò cho người dùng, gán quyền cho vai trò. Người dùng sở hữu tổng quyền của tất cả các vai trò của mình. Đây là mô hình phổ biến nhất.
- **ABAC (Attribute-Based Access Control):** Kiểm soát truy cập dựa trên thuộc tính. Quyết định dựa trên thuộc tính người dùng, thuộc tính tài nguyên, thuộc tính thao tác và thuộc tính môi trường. Linh hoạt hơn nhưng cũng phức tạp hơn.

Trong tình huống thông thường, tuyệt đại đa số hệ thống đều sử dụng mô hình quyền RBAC hoặc phiên bản đơn giản hóa của nó. Dùng một sơ đồ để mô tả như sau：

![Sơ đồ mô hình quyền RBAC](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/rbac.png)

Về giới thiệu chi tiết thiết kế hệ thống quyền, có thể xem bài viết này：[权限系统设计详解](https://javaguide.cn/system-design/security/design-of-authority-system.html)。

## Tổng kết

Tóm lại, muốn xây dựng một ứng dụng Web an toàn, ổn định, trải nghiệm người dùng tốt, ba tuyến cửa ải là kiểm tra dữ liệu frontend-backend và kiểm tra quyền backend, đều phải thiết lập tốt, và mỗi cái có trọng tâm riêng：

- **Kiểm tra dữ liệu frontend：** Nâng cao trải nghiệm người dùng, giảm request không hợp lệ, là tuyến phòng thủ "thân thiện" đầu tiên.
- **Kiểm tra dữ liệu backend：** Đảm bảo định dạng dữ liệu đúng, phù hợp quy tắc nghiệp vụ, là tuyến phòng thủ "kỹ thuật" ngăn chặn "dữ liệu bẩn" vào kho dữ liệu. Bean Validation cho phép chúng ta dùng annotation, khai báo trực tiếp quy tắc kiểm tra trên thuộc tính của JavaBean (ví dụ như đối tượng DTO của chúng ta), rất tiện lợi.
- **Kiểm tra quyền backend：** Đảm bảo "đúng người" làm "đúng việc", là tuyến phòng thủ "an toàn" ngăn chặn thao tác vượt quyền. Các framework như Spring Security, Shiro, Sa-Token có thể giúp chúng ta thực hiện kiểm tra quyền.

## Tham khảo

- OWASP Authorization Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- Tại sao frontend và backend đều cần kiểm tra dữ liệu？: <https://juejin.cn/post/7306045519099658240>
- Thiết kế hệ thống quyền chi tiết：<https://javaguide.cn/system-design/security/design-of-authority-system.html>