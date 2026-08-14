---
title: Phân tích ưu nhược điểm của xác thực JWT
description: Phân tích chuyên sâu ưu nhược điểm của xác thực JWT, giải thích các vấn đề như JWT không thể chủ động vô hiệu hóa, gia hạn Token và các giải pháp tương ứng.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: JWT,Token认证,无状态认证,JWT缺点,刷新令牌,注销失效,安全风险,替代方案
---

Trong các buổi phỏng vấn tuyển dụng, phần lớn ứng viên tôi gặp đều sử dụng JWT cho phần xác thực đăng nhập. Khi hỏi về các câu hỏi khái niệm JWT và lý do sử dụng JWT, hầu hết đều trả lời được ít nhiều. Nhưng khi hỏi đến các vấn đề tồn tại của JWT và giải pháp, chỉ một số ít ứng viên trả lời tốt.

JWT không phải là viên đạn bạc, nó có nhiều khiếm khuyết, và trong nhiều trường hợp không phải là lựa chọn tối ưu. Trong bài viết này, chúng ta cùng tìm hiểu ưu nhược điểm của xác thực JWT và cách giải quyết các vấn đề thường gặp, để hiểu tại sao nhiều người không còn khuyến nghị sử dụng JWT nữa.

Về khái niệm cơ bản của JWT, vui lòng xem bài viết tôi đã viết: [JWT 基本概念详解](https://javaguide.cn/system-design/security/jwt-intro.html).

## Ưu điểm của JWT

So với phương thức xác thực Session, sử dụng JWT để xác thực có 4 ưu điểm chính sau đây.

### Không trạng thái (Stateless)

JWT tự chứa tất cả thông tin cần thiết cho việc xác thực, do đó, server của chúng ta không cần lưu trữ thông tin JWT. Điều này rõ ràng làm tăng tính khả dụng và khả năng mở rộng của hệ thống, giảm đáng kể áp lực lên phía server.

Tuy nhiên, chính vì tính không trạng thái của JWT, nó cũng dẫn đến nhược điểm lớn nhất: **Không thể kiểm soát!**

Ví dụ, nếu chúng ta muốn hủy bỏ một JWT trong thời hạn hiệu lực của nó hoặc thay đổi quyền của nó, thì sẽ không có hiệu lực ngay lập tức, thường phải đợi đến khi hết hạn mới được. Một ví dụ khác, khi người dùng Logout, JWT vẫn còn hiệu lực. Trừ khi chúng ta thêm logic xử lý bổ sung ở backend, chẳng hạn như lưu trữ các JWT đã hết hiệu lực, backend kiểm tra JWT có hợp lệ trước rồi mới xử lý. Các giải pháp cụ thể sẽ được giới thiệu chi tiết ở phần sau, ở đây chỉ đề cập sơ qua.

### Sử dụng Authorization Header giúp giảm rủi ro CSRF truyền thống

**CSRF（Cross Site Request Forgery）** thường được dịch là **giả mạo yêu cầu跨站 (Cross Site Request Forgery)**, thuộc lĩnh vực tấn công mạng. So với các phương thức tấn công bảo mật như SQL injection, XSS, CSRF ít được biết đến hơn. Nhưng nó thực sự là một rủi ro bảo mật mà chúng ta phải cân nhắc khi phát triển hệ thống. Ngay cả sản phẩm Gmail của Google, một hình mẫu kỹ thuật trong ngành, cũng từng bị phát hiện lỗ hổng CSRF vào năm 2007, gây tổn thất lớn cho người dùng Gmail.

**Vậy chính xác giả mạo yêu cầu跨站 là gì?** Nói đơn giản là sử dụng danh tính của bạn để làm những việc xấu (gửi các yêu cầu không thân thiện với bạn, chẳng hạn như chuyển tiền trái phép).

Ví dụ đơn giản: Tiểu Tráng đăng nhập vào một ngân hàng trực tuyến, anh ấy vào khu vực bài đăng của ngân hàng, thấy một bài đăng có liên kết ghi "Quản lý tài chính khoa học, lợi nhuận hàng năm trên vạn", Tiểu Tráng tò mò nhấp vào liên kết này, kết quả phát hiện tài khoản của mình bị mất 10000 tệ. Chuyện gì đã xảy ra? Hóa ra hacker đã giấu một yêu cầu trong liên kết, yêu cầu này trực tiếp lợi dụng danh tính của Tiểu Tráng để gửi yêu cầu chuyển tiền đến ngân hàng, tức là thông qua Cookie của bạn để gửi yêu cầu đến ngân hàng.

```html
<a href="http://www.mybank.com/Transfer?bankId=11&money=10000"
  >Quản lý tài chính khoa học, lợi nhuận hàng năm trên vạn</a
>
```

Tấn công CSRF truyền thống lợi dụng đặc điểm trình duyệt tự động đính kèm thông tin xác thực, thông tin xác thực phổ biến nhất là `SessionID` trong Cookie. Ngay cả khi kẻ tấn công không thể đọc `SessionID`, chúng vẫn có thể dụ trình duyệt mang nó đi gửi yêu cầu đến trang đích.

Ngoài ra, không nhất thiết phải nhấp vào liên kết mới đạt được hiệu quả tấn công, trong nhiều trường hợp, chỉ cần bạn mở một trang, tấn công CSRF đã có thể xảy ra.

```html
<img src="http://www.mybank.com/Transfer?bankId=11&money=10000" />
```

**Vậy tại sao khi sử dụng JWT thường nói rủi ro CSRF thấp hơn?**

Nếu client đặt JWT làm Bearer Token, đưa nó vào HTTP `Authorization` Header một cách rõ ràng, trình duyệt sẽ không tự động đính kèm nó vào các yêu cầu跨站 như Cookie, do đó có thể giảm loại rủi ro CSRF truyền thống này. Điều phát huy tác dụng ở đây là phương thức truyền tải thông tin xác thực, chứ không phải bản thân định dạng dữ liệu JWT.

Tuy nhiên, không thể vì thế mà mặc định lưu JWT vào `localStorage`. Bất kỳ script độc hại nào trong cùng một trang nguồn gốc đều có thể đọc Web Storage, một lỗ hổng XSS có thể dẫn đến access token hoặc refresh token bị đánh cắp trực tiếp. Ứng dụng web cần kết hợp với mô hình mối đe dọa để chọn giải pháp, ví dụ sử dụng Cookie có thuộc tính `HttpOnly`, `Secure`, `SameSite` phù hợp, hoặc sử dụng Backend For Frontend（BFF）để giữ token ở phía server.

Nếu sử dụng Cookie để lưu thông tin đăng nhập, thì phải đồng thời làm tốt phòng chống CSRF, ví dụ như CSRF Token, kiểm tra `Origin`/`Referer` và `SameSite` Cookie. `SameSite` thường nên được sử dụng như một lớp phòng thủ theo chiều sâu, không thể thay thế CSRF Token một cách độc lập trong tất cả các triển khai.

Phòng chống XSS không thể dựa vào một "bộ lọc chuỗi đáng ngờ" chung chung. Cách làm đáng tin cậy hơn là mã hóa chính xác dữ liệu khi xuất ra các ngữ cảnh khác nhau như HTML, thuộc tính, JavaScript, CSS, URL; khi thực sự cho phép người dùng gửi HTML, sử dụng thư viện lọc HTML trưởng thành được cập nhật liên tục; sau đó cung cấp phòng thủ theo chiều sâu thông qua các cơ chế như CSP.

### Phù hợp với ứng dụng di động

Sử dụng Session để xác thực cần lưu một phần thông tin ở phía server, và phương thức này phụ thuộc vào Cookie (cần Cookie để lưu `SessionId`), nên không phù hợp với ứng dụng di động.

Tuy nhiên, sử dụng JWT để xác thực sẽ không gặp vấn đề này, vì chỉ cần JWT có thể được lưu trữ ở client là có thể sử dụng, hơn nữa JWT còn có thể sử dụng跨语言.

> Tại sao sử dụng Session để xác thực không phù hợp với ứng dụng di động?
>
> 1. Quản lý trạng thái: Session dựa trên quản lý trạng thái phía server, trong khi ứng dụng di động thường là không trạng thái. Kết nối của thiết bị di động có thể không ổn định hoặc bị gián đoạn, do đó khó duy trì trạng thái phiên dài hạn. Nếu sử dụng Session để xác thực, ứng dụng di động cần thường xuyên duy trì phiên với server, tăng chi phí mạng và độ phức tạp;
> 2. Tính tương thích: Ứng dụng di động thường hướng đến nhiều nền tảng, như iOS, Android và Web. Mỗi nền tảng có thể có cách quản lý và lưu trữ Session khác nhau, có thể dẫn đến vấn đề tương thích跨平台;
> 3. Bảo mật: Thiết bị di động thường ở trong môi trường mạng không đáng tin cậy, tồn tại rủi ro rò rỉ dữ liệu và tấn công. Lưu trữ thông tin phiên nhạy cảm trên thiết bị di động làm tăng rủi ro bị tấn công tiềm ẩn.

### Thân thiện với Single Sign-On (SSO)

Sử dụng Session để xác thực, khi triển khai SSO, cần phải lưu thông tin Session của người dùng trên một máy tính, và còn gặp phải vấn đề Cookie跨域 phổ biến. Nhưng sử dụng JWT để xác thực, JWT được lưu ở client, sẽ không tồn tại những vấn đề này.

## Các vấn đề thường gặp của xác thực JWT và giải pháp

### JWT vẫn còn hiệu lực trong các tình huống như đăng xuất

Các tình huống cụ thể tương tự bao gồm:

- Đăng xuất (Logout);
- Thay đổi mật khẩu;
- Server thay đổi quyền hoặc vai trò của người dùng;
- Tài khoản người dùng bị khóa/xóa;
- Người dùng bị server cưỡng chế đăng xuất;
- Người dùng bị đá khỏi hệ thống;
- ……

Vấn đề này không tồn tại trong phương thức xác thực Session, vì trong xác thực Session, khi gặp tình huống này, server chỉ cần xóa bản ghi Session tương ứng là được. Nhưng sử dụng phương thức xác thực JWT thì không dễ giải quyết. Chúng ta cũng đã nói, JWT một khi đã được phát hành, nếu backend không thêm logic khác, nó sẽ vẫn có hiệu lực cho đến khi hết hạn.

Vậy làm thế nào để giải quyết vấn đề này? Sau khi tham khảo nhiều tài liệu, tôi tóm tắt 4 giải pháp sau:

**1. Lưu JWT vào cơ sở dữ liệu**

Lưu các JWT hợp lệ vào cơ sở dữ liệu, khuyến nghị sử dụng cơ sở dữ liệu bộ nhớ như Redis. Nếu cần làm cho một JWT hết hiệu lực, chỉ cần xóa JWT đó khỏi Redis. Tuy nhiên, cách này dẫn đến mỗi lần sử dụng JWT đều phải truy vấn Redis xem JWT có tồn tại hay không, và vi phạm nguyên tắc không trạng thái của JWT.

**2. Cơ chế danh sách đen (Blacklist)**

Tương tự như cách trên, sử dụng cơ sở dữ liệu bộ nhớ như Redis để duy trì một danh sách đen, nếu muốn làm cho một JWT hết hiệu lực thì thêm JWT đó vào **danh sách đen** là được. Sau đó, mỗi lần sử dụng JWT để gửi yêu cầu sẽ kiểm tra xem JWT này có tồn tại trong danh sách đen trước.

Hai giải pháp đầu có cốt lõi là lưu trữ các JWT hợp lệ hoặc đưa JWT được chỉ định vào danh sách đen.

Mặc dù cả hai giải pháp này đều vi phạm nguyên tắc không trạng thái của JWT, nhưng trong các dự án thực tế chúng ta thường vẫn sử dụng chúng.

**3. Sửa đổi khóa bí mật (Secret):**

Chúng ta tạo một khóa bí mật riêng cho mỗi người dùng, nếu muốn làm cho một JWT hết hiệu lực, chúng ta chỉ cần sửa đổi khóa bí mật của người dùng tương ứng. Tuy nhiên, cách này so với hai cách dùng cơ sở dữ liệu bộ nhớ ở trên mang lại tác hại lớn hơn:

- Nếu dịch vụ là phân tán, thì mỗi lần phát hành JWT mới đều phải đồng bộ khóa bí mật trên nhiều máy. Vì vậy, bạn cần lưu khóa bí mật trong cơ sở dữ liệu hoặc dịch vụ bên ngoài khác, như vậy thì không khác gì mấy so với xác thực Session.
- Nếu người dùng đồng thời mở hệ thống trên hai trình duyệt, hoặc cũng mở trên điện thoại, nếu họ đăng xuất từ một nơi, thì những nơi khác đều phải đăng nhập lại, điều này là không thể chấp nhận được.

**4. Giữ thời hạn token ngắn và thường xuyên luân chuyển**

Một cách rất đơn giản. Tuy nhiên, sẽ dẫn đến trạng thái đăng nhập của người dùng không được ghi nhận lâu dài, và cần người dùng thường xuyên đăng nhập.

Ngoài ra, việc giải quyết vấn đề JWT vẫn còn hiệu lực sau khi đổi mật khẩu thì tương đối dễ dàng. Một cách mà tôi cho là tốt: **Sử dụng giá trị hash của mật khẩu người dùng để ký JWT. Do đó, nếu mật khẩu thay đổi, bất kỳ token nào trước đó sẽ tự động không thể xác minh.**

### Vấn đề gia hạn JWT

Thời hạn hiệu lực của JWT thường được khuyến nghị đặt không quá dài, vậy sau khi JWT hết hạn thì xác thực như thế nào, làm sao để triển khai làm mới JWT động, tránh việc người dùng phải thường xuyên đăng nhập lại?

Trước tiên hãy xem cách làm thông thường trong xác thực Session: **Giả sử thời hạn Session là 30 phút, nếu trong 30 phút người dùng có truy cập, thì kéo dài thời hạn Session thêm 30 phút.**

Với xác thực JWT, chúng ta nên giải quyết vấn đề gia hạn như thế nào? Sau khi tham khảo nhiều tài liệu, tôi tóm tắt 4 giải pháp sau:

**1. Tương tự như cách làm trong xác thực Session (không khuyến nghị)**

Giải pháp này phù hợp với phần lớn tình huống. Giả sử server đặt thời hạn JWT là 30 phút, mỗi lần server kiểm tra, nếu phát hiện thời hạn JWT sắp hết, server sẽ tạo lại JWT mới cho client. Client mỗi lần gửi yêu cầu đều kiểm tra JWT cũ và mới, nếu không khớp thì cập nhật JWT cục bộ. Vấn đề của cách này là chỉ khi sắp hết hạn mới cập nhật JWT, không thân thiện với client.

**2. Mỗi lần gửi yêu cầu đều trả về JWT mới (không khuyến nghị)**

Ý tưởng của giải pháp này rất đơn giản, nhưng chi phí sẽ khá lớn, đặc biệt là khi server phải lưu trữ và duy trì JWT.

**3. Đặt thời hạn JWT đến nửa đêm (không khuyến nghị)**

Giải pháp này là một cách thỏa hiệp, đảm bảo phần lớn người dùng ban ngày có thể đăng nhập bình thường, phù hợp với các hệ thống có yêu cầu bảo mật không cao.

**4. Sử dụng Access Token ngắn hạn và Refresh Token dài hạn (khuyến nghị)**

Thứ nhất là access token ngắn hạn, ví dụ hết hạn sau nửa giờ; thứ hai là refresh token có vòng đời dài hơn, chỉ dùng để lấy access token mới. Cả hai không nhất thiết phải sử dụng định dạng JWT. Refresh token có quyền cao, thời gian tồn tại dài, là thông tin xác thực mà kẻ tấn công nhắm đến để đánh cắp, không thể vì tần suất sử dụng thấp mà cho rằng "khó bị rò rỉ".

Sau khi client đăng nhập, mỗi lần truy cập mang theo access token. Khi access token hết hạn, client thông qua refresh token được bảo vệ để đổi lấy access token mới. Ứng dụng trình duyệt không nên mặc định đặt refresh token vào `localStorage`, có thể thông qua BFF hoặc Cookie được bảo vệ để giảm rủi ro token bị script đọc trực tiếp.

Nhược điểm của giải pháp này là:

- Cần client phối hợp;
- Khi người dùng đăng xuất, đổi mật khẩu hoặc xảy ra các sự kiện bảo mật khác, cần thu hồi ủy quyền làm mới tương ứng;
- Trong quá trình yêu cầu lại JWT sẽ có khoảng thời gian ngắn JWT không khả dụng (có thể giải quyết bằng cách đặt bộ hẹn giờ ở client, khi access JWT sắp hết hạn, chủ động dùng refresh JWT để lấy access JWT mới trước);
- Đối với public client, authorization server cần sử dụng luân chuyển refresh token và phát hiện replay token cũ, hoặc sử dụng refresh token ràng buộc người gửi (sender-constrained). Refresh token cũng nên được ràng buộc với client, phạm vi ủy quyền và resource server, đồng thời đặt thời gian hết hạn không hoạt động (idle expiration).

### Kích thước JWT quá lớn

JWT có cấu trúc phức tạp (Header, Payload và Signature), chứa nhiều thông tin bổ sung hơn, còn phải mã hóa Base64Url, điều này làm cho JWT có kích thước lớn, tăng chi phí truyền tải mạng.

Cấu trúc JWT:

![JWT 组成](https://oss.javaguide.cn/javaguide/system-design/jwt/jwt-composition.png)

Ví dụ JWT：

```plain
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Giải pháp:

- Giảm thiểu thông tin trong JWT Payload, chỉ giữ lại thông tin người dùng và quyền cần thiết.
- Trước khi truyền JWT, sử dụng thuật toán nén (như GZIP) để nén JWT nhằm giảm kích thước.
- Trong một số trường hợp, sử dụng Token truyền thống có thể phù hợp hơn. Token truyền thống thường chỉ là một định danh duy nhất, thông tin tương ứng (ví dụ User ID, thời gian hết hạn Token, thông tin quyền) được lưu ở phía server, thường lưu qua Redis.

## Tổng kết

Một ưu điểm rất quan trọng của JWT là không trạng thái, nhưng trên thực tế, nếu chúng ta muốn sử dụng JWT hợp lý trong dự án thực tế để làm xác thực đăng nhập, thì vẫn cần lưu trữ thông tin JWT.

JWT cũng không phải là viên đạn bạc, có nhiều khiếm khuyết, việc chọn JWT hay Session cụ thể còn phải xem nhu cầu thực tế của dự án. Tuyệt đối không nên thổi phồng JWT mà coi thường các giải pháp xác thực khác.

Ngoài ra, không dùng JWT mà sử dụng trực tiếp Token thông thường (ID được tạo ngẫu nhiên, không chứa thông tin cụ thể) kết hợp với Redis để làm xác thực cũng là một lựa chọn khả thi.

## Tham khảo

- RFC 9700 - Best Current Practice for OAuth 2.0 Security：<https://www.rfc-editor.org/rfc/rfc9700.html>
- OWASP Session Management Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- OWASP Cross Site Scripting Prevention Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html>
- JWT 超详细分析：<https://learnku.com/articles/17883>
- How to log out when using JWT：<https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6>
- CSRF protection with JSON Web JWTs：<https://medium.com/@agungsantoso/csrf-protection-with-json-web-JWTs-83e0f2fcbcc>
- Invalidating JSON Web JWTs：<https://stackoverflow.com/questions/21978658/invalidating-json-web-JWTs>

<!-- @include: @article-footer.snippet.md -->
