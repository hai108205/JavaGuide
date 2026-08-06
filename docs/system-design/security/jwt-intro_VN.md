---
title: Giải thích chi tiết khái niệm cơ bản về JWT
description: Giải thích chi tiết khái niệm cơ bản về JWT, bao gồm cấu trúc thành phần, thuật toán chữ ký, nguyên lý hoạt động và ứng dụng trong đăng nhập - xác thực của JSON Web Token.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: JWT,JSON Web Token,Token认证,无状态,Header Payload Signature,签名算法,登录鉴权,CSRF
---

<!-- @include: @article-header.snippet.md -->

## JWT là gì?

JWT (JSON Web Token) hiện là giải pháp xác thực cross-domain phổ biến nhất, là một cơ chế xác thực - ủy quyền dựa trên Token. Từ tên đầy đủ của JWT có thể thấy, bản thân JWT cũng là Token, một loại Token được chuẩn hóa theo cấu trúc JSON.

JWT tự chứa tất cả thông tin cần thiết cho việc xác minh danh tính, do đó, server của chúng ta không cần lưu trữ thông tin Session. Điều này rõ ràng làm tăng tính sẵn sàng (availability) và khả năng mở rộng (scalability) của hệ thống, giảm đáng kể áp lực lên phía server.

Có thể thấy, **JWT phù hợp hơn với nguyên tắc "Stateless (phi trạng thái)" khi thiết kế RESTful API**.

Nếu client đặt JWT như Bearer Token hiển thị đưa vào `Authorization` Header, trình duyệt sẽ không tự động đính kèm nó như Cookie, do đó có thể giảm rủi ro CSRF truyền thống. Tuy nhiên, điều này phụ thuộc vào cách truyền tải và lưu trữ thông tin xác thực, chứ không phải bản thân định dạng JWT; nếu đặt JWT vào Cookie, vẫn cần phòng chống CSRF.

Tôi có giới thiệu chi tiết về ưu điểm và nhược điểm của việc sử dụng JWT để xác thực danh tính trong bài viết [Phân tích ưu nhược điểm của JWT](./advantages-and-disadvantages-of-jwt.md).

Dưới đây là định nghĩa tương đối chính thức về JWT từ [RFC 7519](https://tools.ietf.org/html/rfc7519).

> JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted. ——[JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)

## JWT gồm những phần nào?

![Cấu thành JWT](https://oss.javaguide.cn/javaguide/system-design/jwt/jwt-composition.png)

JWT về bản chất là một chuỗi ký tự, được phân tách bằng dấu (`.`) thành ba phần được mã hóa Base64:

- **Header (Phần đầu)**: Mô tả metadata của JWT, định nghĩa thuật toán tạo chữ ký và loại `Token`. Header được mã hóa Base64Url và trở thành phần đầu tiên của JWT.
- **Payload (Phần tải)**: Dùng để chứa dữ liệu thực tế cần truyền tải, bao gồm các Claim (khai báo), như `sub` (subject, chủ đề), `jti` (JWT ID). Payload được mã hóa Base64Url và trở thành phần thứ hai của JWT.
- **Signature (Chữ ký)**: Server tạo ra thông qua Payload, Header và một khóa bí mật (Secret) sử dụng thuật toán chữ ký được chỉ định trong Header (mặc định là HMAC SHA256). Chữ ký được tạo ra sẽ trở thành phần thứ ba của JWT.

JWT thường có dạng: `xxxxx.yyyyy.zzzzz`.

Ví dụ:

```plain
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Bạn có thể giải mã JWT trên trang web [jwt.io](https://jwt.io/), sau khi giải mã sẽ nhận được ba phần: Header, Payload, Signature.

Header và Payload đều là dữ liệu định dạng JSON, Signature được tạo ra từ Payload, Header và Secret (khóa bí mật) thông qua công thức tính toán và thuật toán mã hóa cụ thể.

![](https://oss.javaguide.cn/javaguide/system-design/jwt/jwt.io.png)

### Header

Header thường gồm hai phần:

- `typ` (Type): Loại token, tức là JWT.
- `alg` (Algorithm): Thuật toán chữ ký, ví dụ HS256.

Ví dụ:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Header dạng JSON được chuyển đổi thành mã hóa Base64, trở thành phần đầu tiên của JWT.

### Payload

Payload cũng là dữ liệu định dạng JSON, trong đó chứa các Claim (khai báo, chứa thông tin liên quan đến JWT).

Claim được chia thành ba loại:

- **Registered Claims (Khai báo đã đăng ký)**: Một số khai báo được định nghĩa trước, khuyến nghị sử dụng, nhưng không bắt buộc.
- **Public Claims (Khai báo công khai)**: Các khai báo mà bên phát hành JWT có thể tự định nghĩa, nhưng để tránh xung đột, nên định nghĩa chúng trong [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml).
- **Private Claims (Khai báo riêng tư)**: Các khai báo mà bên phát hành JWT tự định nghĩa do nhu cầu dự án, phù hợp hơn với tình huống dự án thực tế.

Dưới đây là một số Registered Claim phổ biến:

- `iss` (issuer): Bên phát hành JWT.
- `iat` (issued at time): Thời gian phát hành JWT.
- `sub` (subject): Chủ đề JWT.
- `aud` (audience): Bên nhận JWT.
- `exp` (expiration time): Thời gian hết hạn của JWT.
- `nbf` (not before time): Thời gian có hiệu lực của JWT, JWT có thời gian sớm hơn thời gian đã định nghĩa này sẽ không được chấp nhận xử lý.
- `jti` (JWT ID): Định danh duy nhất của JWT.

Ví dụ:

```json
{
  "uid": "ff1212f5-d8d1-4496-bf41-d2dda73de19a",
  "sub": "1234567890",
  "name": "John Doe",
  "exp": 15323232,
  "iat": 1516239022,
  "scope": ["admin", "user"]
}
```

Phần Payload mặc định là không được mã hóa, **nhất định không được lưu thông tin riêng tư vào trong Payload!!!**

Payload dạng JSON được chuyển đổi thành mã hóa Base64, trở thành phần thứ hai của JWT.

### Signature

Phần Signature là chữ ký cho hai phần đầu, tác dụng là ngăn chặn JWT (chủ yếu là payload) bị giả mạo.

Việc tạo chữ ký này cần sử dụng:

- Header + Payload.
- Khóa bí mật được lưu ở phía server (nhất định không được để rò rỉ).
- Thuật toán chữ ký.

Công thức tính chữ ký như sau:

```plain
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

Sau khi tính ra chữ ký, ghép ba phần Header, Payload, Signature thành một chuỗi, mỗi phần được phân cách bằng dấu "chấm" (`.`), chuỗi này chính là JWT.

## Làm thế nào để xác thực danh tính dựa trên JWT?

Trong ứng dụng xác thực danh tính dựa trên JWT, server tạo JWT thông qua Payload, Header và khóa bí mật rồi gửi JWT cho client. Client cần lưu token một cách an toàn tùy theo hình thức ứng dụng và mô hình mối đe dọa (threat model), các request sau đó sẽ mang theo token này.

![Sơ đồ xác thực danh tính JWT](https://oss.javaguide.cn/github/javaguide/system-design/jwt/jwt-authentication%20process.png)

Các bước được đơn giản hóa như sau:

1. Người dùng gửi tên người dùng, mật khẩu và mã xác nhận đến server để đăng nhập hệ thống;
2. Nếu tên người dùng, mật khẩu và mã xác nhận được kiểm tra chính xác, server sẽ trả về Token đã ký, tức là JWT;
3. Client nhận Token và lưu trữ an toàn; ứng dụng trình duyệt có thể sử dụng BFF để giữ token ở phía server, hoặc tùy theo tình huống sử dụng Cookie được bảo vệ;
4. Mỗi lần sau đó người dùng gửi request đến backend đều mang theo JWT này trong Header;
5. Server kiểm tra JWT và lấy thông tin liên quan đến người dùng từ đó.

Hai gợi ý:

1. Đừng mặc định lưu JWT trong `localStorage` hoặc `sessionStorage`. Bất kỳ mã độc nào trong trang cùng nguồn (same-origin) đều có thể đọc Web Storage, một lỗ hổng XSS có thể làm rò rỉ token. Khi sử dụng Cookie, nên thiết lập `HttpOnly`, `Secure` và thuộc tính `SameSite` phù hợp, đồng thời làm tốt phòng chống CSRF.
2. Cách làm phổ biến để mang JWT trong phương án không dùng Cookie là đặt nó vào trường `Authorization` của HTTP Header (`Authorization: Bearer Token`).

**[spring-security-jwt-guide](https://github.com/Snailclimb/spring-security-jwt-guide)** chính là một ví dụ đơn giản về xác thực danh tính dựa trên JWT, bạn nào quan tâm có thể xem thử.

## Làm thế nào để ngăn JWT bị giả mạo?

Khi có chữ ký được kiểm tra chính xác, ngay cả khi JWT bị rò rỉ hoặc bị chặn bắt, kẻ tấn công cũng không thể sửa đổi Header hoặc Payload và tạo ra chữ ký hợp lệ nếu không biết khóa ký. Nhưng chữ ký không cung cấp tính bảo mật (confidentiality), cũng không thể ngăn kẻ tấn công trực tiếp phát lại (replay) JWT hợp lệ bị đánh cắp.

Tại sao vậy? Bởi vì sau khi server nhận được JWT, nó sẽ phân tích ra Header, Payload và Signature chứa trong đó. Server sẽ dựa vào Header, Payload, khóa bí mật để tạo lại một Signature. So sánh Signature mới tạo với Signature trong JWT, nếu giống nhau thì chứng tỏ Header và Payload không bị sửa đổi.

Tuy nhiên, nếu khóa bí mật phía server cũng bị rò rỉ, hacker có thể đồng thời giả mạo Signature, Header, Payload. Hacker trực tiếp sửa đổi Header và Payload xong, rồi tạo lại một Signature là được.

**Nhất định phải giữ gìn khóa bí mật cẩn thận, nhất định không được để rò rỉ. Cốt lõi của bảo mật JWT nằm ở chữ ký, cốt lõi của an toàn chữ ký nằm ở khóa bí mật.**

## Làm thế nào để tăng cường tính bảo mật của JWT?

1. Sử dụng thư viện mã nguồn mở trưởng thành, đừng tự hiện thực logic mã hóa - giải mã và kiểm tra JWT.
2. Server cố định tập thuật toán được phép, không thể trực tiếp tin tưởng `alg` trong JWT Header để chọn thuật toán xác minh; khóa HMAC phải có đủ độ ngẫu nhiên và độ dài.
3. Xác minh tất cả các claim liên quan đến ứng dụng hiện tại, bao gồm `iss`, `aud`, `exp` và `nbf`, đồng thời thiết lập giới hạn rõ ràng cho độ lệch đồng hồ (clock skew) được phép.
4. Đối với các JWT có mục đích khác nhau như ID Token, Access Token, sử dụng `typ` hiển thị và quy tắc kiểm tra loại trừ lẫn nhau, ngăn một loại token bị thay thế sang tình huống khác.
5. Nhất định không được lưu thông tin riêng tư trong Payload chưa được mã hóa, cũng không được coi Claim đã nhận nhưng chưa được xác minh là đầu vào đáng tin cậy.
6. Chọn phương thức lưu trữ token an toàn tùy theo loại client, giới hạn thời gian hiệu lực, phạm vi quyền và bên nhận của token; các tình huống rủi ro cao còn cần xem xét thu hồi (revocation), phát hiện phát lại (replay detection) hoặc ràng buộc người gửi (sender constraint).
7. Khóa bí mật phải được giữ gìn cẩn thận và hỗ trợ luân chuyển (rotation). Yêu cầu bảo mật đầy đủ hơn có thể tham khảo [RFC 8725: JSON Web Token Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html).

<!-- @include: @article-footer.snippet.md -->