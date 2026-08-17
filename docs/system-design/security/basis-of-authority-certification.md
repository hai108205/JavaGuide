---
title: Giải thích chi tiết khái niệm cơ bản về Xác thực - Ủy quyền
description: Giải thích chi tiết khái niệm cơ bản về Xác thực và Ủy quyền, giải thích sự khác biệt giữa Authentication và Authorization, Session, Token, OAuth2 và các kiến thức cốt lõi khác.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 认证,授权,Authentication,Authorization,Session,Token,OAuth2,权限控制,安全基础
---

## Sự khác biệt giữa Xác thực (Authentication) và Ủy quyền (Authorization) là gì?

Đây là một vấn đề mà đại đa số mọi người đều nhầm lẫn. Trước tiên hãy bắt đầu từ cách đọc để nhận biết hai thuật ngữ này, rất nhiều người đọc nhầm chúng, vì vậy tôi khuyên bạn nên tra trước xem hai từ này thực sự đọc như thế nào và ý nghĩa cụ thể của chúng là gì.

Nói một cách đơn giản:

- **Xác thực (Authentication):** Bạn là ai.
- **Ủy quyền (Authorization):** Bạn có quyền làm gì.

Một cách diễn đạt trang trọng hơn (dài dòng hơn) là:

- **Authentication (Xác thực)** là quá trình xác minh thông tin đăng nhập của bạn (ví dụ: tên người dùng/ID người dùng và mật khẩu), thông qua đó, hệ thống biết được bạn chính là bạn, tức là hệ thống tồn tại người dùng là bạn. Vì vậy, Authentication được gọi là xác minh danh tính/người dùng.
- **Authorization (Ủy quyền)** diễn ra sau **Authentication (Xác thực)**. Ủy quyền, chỉ nhìn nghĩa thôi chắc mọi người cũng hiểu, nó chủ yếu quản lý quyền truy cập hệ thống của chúng ta. Ví dụ một số tài nguyên cụ thể chỉ những người có quyền cụ thể mới được truy cập như admin, một số thao tác trên tài nguyên hệ thống như xóa, thêm, cập nhật chỉ những người cụ thể mới có.

Xác thực:

![Xác thực đăng nhập](https://oss.javaguide.cn/github/javaguide/system-design/security/authentication-login.png)

Ủy quyền:

![Không có quyền](https://oss.javaguide.cn/github/javaguide/system-design/security/20210604161032412.png)

Hai khái niệm này thường được kết hợp sử dụng trong hệ thống của chúng ta, mục đích là để bảo vệ tính an toàn của hệ thống.

## Bạn có hiểu về mô hình RBAC không?

Mô hình kiểm soát truy cập được sử dụng phổ biến nhất trong kiểm soát quyền hệ thống chính là **mô hình RBAC**.

**RBAC là gì?** RBAC là kiểm soát truy cập dựa trên vai trò (Role-Based Access Control). Đây là một phương thức ủy quyền thông qua việc liên kết vai trò với quyền, đồng thời vai trò lại liên kết với người dùng.

Nói một cách đơn giản: một người dùng có thể có nhiều vai trò, mỗi vai trò lại có thể được gán nhiều quyền, như vậy tạo thành mô hình ủy quyền "Người dùng - Vai trò - Quyền". Trong mô hình này, giữa người dùng và vai trò, giữa vai trò và quyền tạo thành mối quan hệ nhiều-nhiều.

![Sơ đồ mô hình phân quyền RBAC](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/rbac.png)

Trong mô hình phân quyền RBAC, quyền được liên kết với vai trò, người dùng có được quyền của các vai trò đó thông qua việc trở thành thành viên của các vai trò cụ thể, điều này giúp đơn giản hóa đáng kể việc quản lý quyền.

Để hiện thực mô hình phân quyền RBAC, thiết kế bảng cơ sở dữ liệu phổ biến như sau (tổng cộng 5 bảng, 2 bảng dùng để thiết lập mối quan hệ giữa các bảng):

![](https://oss.javaguide.cn/2020-11/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AE%BE%E8%AE%A1-%E6%9D%83%E9%99%90.png)

Thông qua mô hình phân quyền này, chúng ta có thể tạo các vai trò khác nhau và gán phạm vi quyền (menu) khác nhau cho các vai trò khác nhau.

![](https://oss.javaguide.cn/github/javaguide/books%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86%E6%A8%A1%E5%9D%97.png)

Thông thường, nếu hệ thống có yêu cầu kiểm soát quyền tương đối nghiêm ngặt, thường sẽ chọn sử dụng mô hình RBAC để kiểm soát quyền.

## Cookie là gì? Vai trò của Cookie là gì?

![](https://oss.javaguide.cn/github/javaguide/system-design/security/cookie-sessionId.png)

`Cookie` và `Session` đều là các phương thức session dùng để theo dõi danh tính người dùng trình duyệt, nhưng tình huống ứng dụng của hai thứ này không giống nhau lắm.

Wikipedia định nghĩa `Cookie` như sau:

> `Cookies` là dữ liệu (thường đã được mã hóa) được một số trang web lưu trữ trên thiết bị đầu cuối cục bộ của người dùng để nhận dạng danh tính người dùng.

Nói một cách đơn giản: **`Cookie` được lưu ở phía client, thường dùng để lưu thông tin người dùng**.

Dưới đây là một số trường hợp ứng dụng của `Cookie`:

1. Chúng ta lưu thông tin người dùng đã đăng nhập trong `Cookie`, lần sau truy cập trang web, trang có thể tự động điền một số thông tin đăng nhập cơ bản cho bạn. Ngoài ra, `Cookie` còn có thể lưu tùy chọn người dùng, theme và các thông tin cài đặt khác.
2. Sử dụng `Cookie` để lưu `SessionId` hoặc `Token`, khi gửi request đến backend mang theo `Cookie`, như vậy backend có thể lấy được `Session` hoặc `Token`. Điều này giúp ghi lại trạng thái hiện tại của người dùng, vì giao thức HTTP là phi trạng thái (stateless).
3. `Cookie` còn có thể dùng để ghi lại và phân tích hành vi người dùng. Một ví dụ đơn giản: khi bạn mua sắm trực tuyến, vì giao thức HTTP không có trạng thái, nếu server muốn biết trạng thái bạn dừng lại ở trang nào hoặc đã xem những sản phẩm nào, một cách hiện thực phổ biến là lưu những thông tin này vào `Cookie`
4. ……

## Làm thế nào để sử dụng Cookie trong dự án?

Tôi lấy dự án Spring Boot làm ví dụ ở đây.

**1) Thiết lập `Cookie` trả về cho client**

```java
@GetMapping("/change-username")
public String setCookie(HttpServletResponse response) {
    // Tạo một cookie
    Cookie cookie = new Cookie("username", "Jovan");
    // Thiết lập thời gian hết hạn cookie
    cookie.setMaxAge(7 * 24 * 60 * 60); // expires in 7 days
    // Thêm vào response
    response.addCookie(cookie);

    return "Username is changed!";
}
```

**2) Sử dụng annotation `@CookieValue` do Spring framework cung cấp để lấy giá trị cookie cụ thể**

```java
@GetMapping("/")
public String readCookie(@CookieValue(value = "username", defaultValue = "Atta") String username) {
    return "Hey! My username is " + username;
}
```

**3) Đọc tất cả giá trị `Cookie`**

```java
@GetMapping("/all-cookies")
public String readAllCookies(HttpServletRequest request) {

    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        return Arrays.stream(cookies)
                .map(c -> c.getName() + "=" + c.getValue()).collect(Collectors.joining(", "));
    }

    return "No cookies";
}
```

Để biết thêm về cách sử dụng `Cookie` trong Spring Boot, bạn có thể xem bài viết này: [How to use cookies in Spring Boot](https://attacomsian.com/blog/cookies-spring-boot).

## Cookie và Session khác nhau thế nào?

**Vai trò chính của `Session` là ghi lại trạng thái của người dùng thông qua phía server.** Tình huống điển hình là giỏ hàng, khi bạn muốn thêm sản phẩm vào giỏ hàng, hệ thống không biết là người dùng nào đang thao tác, vì giao thức HTTP là phi trạng thái. Sau khi server tạo `Session` cụ thể cho người dùng cụ thể, nó có thể định danh người dùng này và theo dõi người dùng này.

Dữ liệu `Cookie` được lưu ở phía client (phía trình duyệt), dữ liệu `Session` được lưu ở phía server. Tương đối mà nói `Session` có tính bảo mật cao hơn. Nếu sử dụng `Cookie`, một số thông tin nhạy cảm không nên ghi vào `Cookie`, tốt nhất nên mã hóa thông tin `Cookie` rồi khi cần sử dụng mới giải mã ở phía server.

**Vậy, làm thế nào để sử dụng `Session` để xác thực danh tính?**

## Làm thế nào để sử dụng phương án Session-Cookie để xác thực danh tính?

Rất nhiều khi chúng ta sử dụng `SessionID` để định danh người dùng cụ thể, `SessionID` thường được chọn lưu trong Redis. Ví dụ:

1. Người dùng đăng nhập hệ thống thành công, sau đó trả về cho client `Cookie` có chứa `SessionID`.
2. Khi người dùng gửi request đến backend, sẽ mang theo `SessionID`, như vậy backend biết được trạng thái danh tính của bạn.

Quy trình chi tiết hơn về phương thức xác thực này như sau:

![](https://oss.javaguide.cn/github/javaguide/system-design/security/session-cookie-authentication-process.png)

1. Người dùng gửi tên người dùng, mật khẩu, mã xác nhận đến server để đăng nhập hệ thống.
2. Sau khi server xác minh thành công, sẽ tạo một đối tượng Session riêng cho người dùng này (có thể hiểu là một vùng nhớ trên server, lưu trữ dữ liệu trạng thái của người dùng đó, như giỏ hàng, thông tin đăng nhập, v.v.) và lưu trữ lại, đồng thời gán cho Session này một `SessionID` duy nhất.
3. Server thông qua chỉ thị `Set-Cookie` trong HTTP response header, gửi `SessionID` này đến trình duyệt của người dùng.
4. Sau khi trình duyệt nhận được `SessionID`, sẽ lưu nó dưới dạng Cookie ở máy cục bộ. Khi người dùng duy trì trạng thái đăng nhập, mỗi lần gửi request đến server đó, trình duyệt sẽ tự động mang theo Cookie chứa `SessionID` này.
5. Server nhận được request, lấy `SessionID` từ Cookie, là có thể tìm thấy đối tượng Session đã lưu trước đó, từ đó biết được đây là người dùng nào và trạng thái trước đó của họ.

Khi sử dụng Session cần lưu ý một số điểm sau:

- **Hỗ trợ Cookie phía client**: Chức năng cốt lõi phụ thuộc vào Session cần đảm bảo trình duyệt của người dùng đã bật Cookie.
- **Quản lý hết hạn Session**: Thiết lập thời gian hết hạn Session hợp lý, cân bằng giữa bảo mật và trải nghiệm người dùng.
- **Bảo mật Session ID**: Thiết lập cờ `HttpOnly` cho Cookie chứa `SessionID` có thể ngăn script phía client (như JavaScript) đánh cắp, thiết lập cờ Secure có thể đảm bảo `SessionID` chỉ được truyền qua kết nối HTTPS, tăng cường bảo mật.

Ngoài ra, Spring Session cung cấp một cơ chế quản lý thông tin session người dùng xuyên suốt nhiều ứng dụng hoặc instance. Nếu muốn tìm hiểu chi tiết, bạn có thể xem một số bài viết rất tốt dưới đây:

- [Getting Started with Spring Session](https://codeboje.de/spring-Session-tutorial/)
- [Guide to Spring Session](https://www.baeldung.com/spring-Session)
- [Sticky Sessions with Spring Session & Redis](https://medium.com/@gvnix/sticky-Sessions-with-spring-Session-redis-bdc6f7438cc3)

## Làm thế nào để triển khai phương án Session-Cookie trong môi trường nhiều server node?

Phương án Session-Cookie trong môi trường monolithic là một phương án xác thực danh tính rất tốt. Tuy nhiên, khi server được mở rộng theo chiều ngang thành nhiều node, phương án Session-Cookie sẽ phải đối mặt với thách thức.

Ví dụ: Giả sử chúng ta triển khai hai service giống hệt nhau A và B, khi người dùng đăng nhập lần đầu, Nginx thông qua cơ chế cân bằng tải (load balancing) chuyển tiếp request của người dùng đến server A, lúc này thông tin Session của người dùng được lưu ở server A. Kết quả là, khi người dùng truy cập lần thứ hai, Nginx định tuyến request đến server B, do server B không lưu thông tin Session của người dùng, dẫn đến người dùng cần phải đăng nhập lại.

**Chúng ta nên tránh tình huống trên như thế nào?**

Có một số phương án để tham khảo:

1. Tất cả request của một người dùng đều được phân phối đến cùng một server xử lý thông qua chiến lược hash đặc thù. Như vậy, mỗi server đều lưu thông tin Session của một phần người dùng. Khi server gặp sự cố, tất cả thông tin Session mà nó lưu trữ sẽ hoàn toàn mất đi.
2. Thông tin Session mà mỗi server lưu trữ đều được đồng bộ lẫn nhau, tức là mỗi server đều lưu toàn bộ thông tin Session. Mỗi khi thông tin Session của một server thay đổi, chúng ta đồng bộ nó sang các server khác. Phương án này chi phí quá lớn, và càng nhiều node, chi phí đồng bộ càng cao.
3. Sử dụng riêng một node dữ liệu mà tất cả server đều có thể truy cập (ví dụ như cache) để lưu thông tin Session. Để đảm bảo tính sẵn sàng cao (high availability), node dữ liệu cần tránh là single point.
4. Spring Session là một dự án dùng để quản lý session giữa nhiều server. Nó có thể tích hợp với nhiều loại backend storage (như Redis, MongoDB, v.v.), từ đó hiện thực quản lý session phân tán. Thông qua Spring Session, có thể lưu dữ liệu session trong storage ngoài được chia sẻ, để hiện thực đồng bộ và chia sẻ session xuyên server.

## Nếu không có Cookie thì Session còn dùng được không?

Đây là một câu hỏi phỏng vấn kinh điển!

Thông thường `SessionID` được lưu thông qua `Cookie`, giả sử bạn sử dụng phương án lưu `SessionID` bằng `Cookie`, nếu client vô hiệu hóa `Cookie`, thì `Session` sẽ không thể hoạt động bình thường.

Tuy nhiên, Session phía server không đồng nghĩa với việc nhất thiết phải sử dụng Cookie. Client không phải trình duyệt có thể mang thông tin xác thực session thông qua request header đã được thỏa thuận rõ ràng. Tuy nhiên, đừng đặt `SessionID` vào URL: ngay cả khi mã hóa nó, nó vẫn là thông tin xác thực danh tính có thể sử dụng trực tiếp, và có thể bị rò rỉ vào lịch sử trình duyệt, nhật ký truy cập, hệ thống giám sát và Referer. URL rewriting chỉ phù hợp với các tình huống kế thừa (legacy) bắt buộc phải tương thích, không nên dùng làm phương án đăng nhập cho hệ thống mới.

## Tại sao xác thực dựa trên Cookie cần quan tâm đến CSRF hơn?

**CSRF (Cross Site Request Forgery)** thường được dịch là **giả mạo request xuyên trang (cross-site request forgery)**. Vậy **giả mạo request xuyên trang** là gì? Nói đơn giản, đó là dùng danh tính của bạn để gửi đi một số request không thân thiện với bạn. Một ví dụ đơn giản:

Tiểu Tráng đăng nhập vào một ngân hàng trực tuyến, cậu ấy vào khu vực bài đăng của ngân hàng, thấy bên dưới một bài đăng có một liên kết ghi là "Quản lý tài chính khoa học, lợi nhuận hàng năm trên vạn", Tiểu Tráng tò mò nhấp vào liên kết này, kết quả phát hiện tài khoản của mình bị trừ 10000 tệ. Chuyện gì đã xảy ra? Hóa ra hacker đã giấu một request trong liên kết, request này trực tiếp lợi dụng danh tính của Tiểu Tráng để gửi một request chuyển tiền đến ngân hàng, tức là thông qua Cookie của bạn để gửi request đến ngân hàng.

```html
<a href="http://www.mybank.com/Transfer?bankId=11&money=10000"
  >Quản lý tài chính khoa học, lợi nhuận hàng năm trên vạn</a
>
```

Như đã đề cập ở trên, khi thực hiện xác thực `Session`, chúng ta thường sử dụng `Cookie` để lưu `SessionId`. Sau khi trình duyệt đăng nhập, nó sẽ tự động mang theo Cookie trong các request phù hợp với phạm vi tác dụng của Cookie, server nhận dạng người dùng thông qua `SessionId`. Nếu kẻ tấn công trực tiếp đánh cắp `SessionId`, sẽ gây ra tấn công chiếm quyền session (session hijacking); còn CSRF thường không yêu cầu kẻ tấn công đọc được Cookie, nó lợi dụng đặc tính trình duyệt sẽ tự động mang theo Cookie.

Trong xác thực `Session`, `SessionId` trong `Cookie` được trình duyệt gửi đến server, lợi dụng đặc tính này, kẻ tấn công có thể đạt được hiệu quả tấn công bằng cách khiến người dùng nhấp nhầm vào liên kết tấn công.

Nếu client đặt Token như Bearer Token, hiển thị đưa vào `Authorization` Header, trình duyệt sẽ không tự động đính kèm nó vào các request cross-site như Cookie, do đó có thể giảm rủi ro CSRF truyền thống. Thứ phát huy tác dụng ở đây là cách mang thông tin xác thực, chứ không phải bản thân định dạng Token hay JWT.

Đừng vì vậy mà mặc định lưu Token vào `localStorage` hoặc `sessionStorage`. Mã độc (malicious script) trong trang cùng nguồn (same-origin) có thể đọc Web Storage, một lỗ hổng XSS có thể trực tiếp làm rò rỉ Token. Ứng dụng trình duyệt có thể chọn Backend For Frontend (BFF) tùy theo tình huống, hoặc sử dụng Cookie có thiết lập `HttpOnly`, `Secure` và thuộc tính `SameSite` phù hợp; khi sử dụng Cookie còn cần kết hợp với các cơ chế như CSRF Token, kiểm tra `Origin`/`Referer`.

![](https://oss.javaguide.cn/github/javaguide/system-design/security/20210615161108272.png)

Cần lưu ý rằng: dù là `Cookie` hay `Token`, bản thân cơ chế xác thực đều không thể tránh được **tấn công cross-site scripting (Cross Site Scripting) XSS**. `HttpOnly` có thể giảm rủi ro script trực tiếp đọc Cookie, nhưng XSS vẫn có thể gửi request với danh tính người dùng, do đó còn cần các biện pháp phòng thủ theo chiều sâu (defense in depth) như mã hóa đầu ra (output encoding) đúng cách, làm sạch HTML (HTML sanitization) khi cần thiết và CSP.

> Tấn công cross-site scripting (Cross Site Scripting) viết tắt là CSS nhưng sẽ bị nhầm lẫn với viết tắt của Cascading Style Sheets (CSS). Vì vậy, có người viết tắt tấn công cross-site scripting là XSS.

Trong XSS, kẻ tấn công sẽ dùng nhiều cách khác nhau để tiêm mã độc vào trang của người dùng khác. Từ đó có thể thông qua script để đánh cắp thông tin như `Cookie`.

Đề xuất đọc: [Làm thế nào để phòng chống tấn công CSRF?—Meituan Technical Team](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

Thực tiễn bảo mật còn có thể tham khảo:

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## JWT là gì? JWT gồm những phần nào?

[Giải thích chi tiết khái niệm cơ bản về JWT](./jwt-intro_VN.md)

## Làm thế nào để xác thực danh tính dựa trên JWT? Làm thế nào để ngăn JWT bị giả mạo?

[Giải thích chi tiết khái niệm cơ bản về JWT](./jwt-intro_VN.md)

## SSO là gì?

SSO (Single Sign On) tức là đăng nhập một lần (single sign-on), nói về việc người dùng đăng nhập vào một trong nhiều hệ thống con thì có quyền truy cập vào các hệ thống khác liên quan đến nó. Ví dụ sau khi chúng ta đăng nhập vào JD Finance, chúng ta đồng thời cũng đăng nhập thành công vào JD Supermarket, JD International, JD Fresh và các hệ thống con khác của JD.

![Sơ đồ SSO](https://oss.javaguide.cn/github/javaguide/system-design/security/sso.png)

## SSO có lợi ích gì?

- **Góc độ người dùng**: Người dùng có thể đăng nhập một lần và sử dụng nhiều lần, không cần ghi nhớ nhiều bộ tên người dùng và mật khẩu, tiết kiệm công sức.
- **Góc độ quản trị viên hệ thống**: Quản trị viên chỉ cần duy trì tốt một trung tâm tài khoản thống nhất, tiện lợi.
- **Góc độ phát triển hệ thống mới**: Khi phát triển hệ thống mới chỉ cần trực tiếp kết nối với trung tâm tài khoản thống nhất, đơn giản hóa quy trình phát triển, tiết kiệm thời gian.

## Làm thế nào để thiết kế và hiện thực một hệ thống SSO?

[Giải thích chi tiết về SSO](./sso-intro.md)

## OAuth 2.0 là gì?

OAuth là một giao thức ủy quyền tiêu chuẩn của ngành, chủ yếu dùng để ủy quyền cho ứng dụng bên thứ ba có được quyền hạn giới hạn. Còn OAuth 2.0 là sự thiết kế lại hoàn toàn OAuth 1.0, OAuth 2.0 nhanh hơn, dễ hiện thực hơn, OAuth 1.0 đã bị loại bỏ. Chi tiết xem: [rfc6749](https://tools.ietf.org/html/rfc6749).

Thực chất nó là một cơ chế ủy quyền, mục đích cuối cùng của nó là cấp cho ứng dụng bên thứ ba một Token có thời hạn, để ứng dụng bên thứ ba có thể thông qua Token đó lấy được tài nguyên liên quan.

Tình huống sử dụng phổ biến của OAuth 2.0 là đăng nhập bên thứ ba (third-party login), khi trang web của bạn tích hợp đăng nhập bên thứ ba, thường là sử dụng giao thức OAuth 2.0.

Ngoài ra, hiện nay OAuth 2.0 cũng thường thấy trong các tình huống thanh toán (WeChat Pay, Alipay) và nền tảng phát triển (WeChat Open Platform, Alibaba Open Platform, v.v.).

Hình dưới đây là sơ đồ [Slack OAuth 2.0 đăng nhập bên thứ ba](https://api.slack.com/legacy/oauth):

![](https://oss.javaguide.cn/github/javaguide/system-design/security/20210615151716340.png)

**Đề xuất đọc:**

- [Một giải thích đơn giản về OAuth 2.0](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
- [Hiểu OAuth 2.0 trong 10 phút](https://deepzz.com/post/what-is-oauth2-protocol.html)
- [Bốn phương thức của OAuth 2.0](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
- [Hướng dẫn ví dụ đăng nhập bên thứ ba GitHub OAuth](http://www.ruanyifeng.com/blog/2019/04/github-oauth.html)

## Tham khảo

- Đừng dùng JWT thay thế session management (phần đầu): Hiểu toàn diện về Token, JWT, OAuth, SAML, SSO: <https://zhuanlan.zhihu.com/p/38942172>
- Introduction to JSON Web Tokens: <https://jwt.io/introduction>
- JSON Web Token Claims: <https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims>

<!-- @include: @article-footer.snippet.md -->
