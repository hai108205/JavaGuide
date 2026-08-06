---
title: Giải thích chi tiết SSO (Single Sign-On)
description: Giải thích chi tiết nguyên lý SSO (Single Sign-On), bao gồm thiết kế trung tâm xác thực thống nhất, giao thức CAS, triển khai đăng nhập跨域 và cơ chế đồng bộ trạng thái đăng nhập.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: SSO,单点登录,统一认证,登录态,票据,TGT,ST,CAS协议,跨域登录
---

> Bài viết này được ủy quyền đăng lại từ: <https://ken.io/note/sso-design-implement> Tác giả: ken.io

## Giới thiệu SSO

### SSO là gì?

SSO là viết tắt của Single Sign On, tức **đăng nhập một lần (Single Sign-On)**. SSO là trong nhiều hệ thống ứng dụng, người dùng chỉ cần đăng nhập một lần là có thể truy cập tất cả các hệ thống ứng dụng tin cậy lẫn nhau.

Ví dụ bạn đăng nhập vào trung tâm tài khoản NetEase（<https://reg.163.com/>）sau đó truy cập các trang sau đều ở trạng thái đã đăng nhập.

- NetEase Live [https://v.163.com](https://v.163.com/)
- NetEase Blog [https://blog.163.com](https://blog.163.com/)
- NetEase HuaTian [https://love.163.com](https://love.163.com/)
- NetEase Kaola [https://www.kaola.com](https://www.kaola.com/)
- NetEase Lofter [http://www.lofter.com](http://www.lofter.com/)

### SSO có lợi ích gì?

1. **Góc độ người dùng** : Người dùng có thể đăng nhập một lần sử dụng nhiều lần, không cần ghi nhớ nhiều bộ tên người dùng và mật khẩu, tiết kiệm thời gian.
2. **Góc độ quản trị viên hệ thống** : Quản trị viên chỉ cần duy trì tốt một trung tâm tài khoản thống nhất là được, tiện lợi.
3. **Góc độ phát triển hệ thống mới:** Khi phát triển hệ thống mới chỉ cần tích hợp trực tiếp với trung tâm tài khoản thống nhất, đơn giản hóa quy trình phát triển, tiết kiệm thời gian.

## Thiết kế và triển khai SSO

Bài viết này chủ yếu là để thảo luận về cách thiết kế và triển khai một hệ thống SSO.

Sau đây là các chức năng cốt lõi cần triển khai:

- Đăng nhập một lần (Single Sign-On)
- Đăng xuất một lần (Single Sign-Out)
- Hỗ trợ đăng nhập một lần跨域
- Hỗ trợ đăng xuất một lần跨域

### Ứng dụng cốt lõi và phụ thuộc

![单点登录（SSO）设计](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-system.png-kblb.png)

| Ứng dụng/Mô-đun/Đối tượng | Mô tả                                |
| ----------------- | ----------------------------------- |
| Trang web前台          | Trang web cần đăng nhập                      |
| SSO站点-登录     | Cung cấp trang đăng nhập                      |
| SSO站点-登出     | Cung cấp điểm truy cập đăng xuất đăng nhập                  |
| SSO服务-登录     | Cung cấp dịch vụ đăng nhập                        |
| SSO服务-登录状态 | Cung cấp dịch vụ kiểm tra trạng thái đăng nhập/truy vấn thông tin đăng nhập |
| SSO服务-登出     | Cung cấp dịch vụ đăng xuất đăng nhập cho người dùng              |
| Cơ sở dữ liệu            | Lưu trữ thông tin tài khoản người dùng                    |
| Cache              | Lưu trữ thông tin đăng nhập của người dùng, thường sử dụng Redis  |

### Lưu trữ và kiểm tra trạng thái đăng nhập của người dùng

Các Web framework phổ biến triển khai Session đều là tạo một SessionId lưu trong Cookie của trình duyệt. Sau đó lưu nội dung Session trong bộ nhớ phía server, điều này [ken.io](https://ken.io/) cũng đã đề cập trong bài [Session 工作原理](https://ken.io/note/session-principle-skill) trước đây. Tổng thể cũng mượn ý tưởng này.

Sau khi người dùng đăng nhập thành công, SSO站点 thiết lập phiên đăng nhập của riêng mình. Định danh phiên trong trình duyệt nên được lưu trong Cookie có các thuộc tính `Secure`, `HttpOnly` và `SameSite` phù hợp; Cookie nên chỉ áp dụng cho máy chủ hiện tại, không nên mở rộng trực tiếp ra toàn bộ tên miền cha chỉ để chia sẻ trạng thái đăng nhập. Ứng dụng di động nên sử dụng trình duyệt hệ thống để hoàn thành quy trình ủy quyền chuẩn, và lưu thông tin xác thực cần thiết trong các bộ lưu trữ an toàn như Keychain, Keystore. Bài viết này chủ yếu thảo luận về SSO dựa trên Web站点.

Khi người dùng duyệt trang cần đăng nhập, client gửi AuthToken cho SSO服务 để kiểm tra trạng thái đăng nhập/lấy thông tin đăng nhập của người dùng.

Đối với việc lưu trữ thông tin đăng nhập, khuyến nghị sử dụng Redis, sử dụng Redis集群 để lưu trữ thông tin đăng nhập, vừa đảm bảo tính khả dụng cao, vừa có thể mở rộng tuyến tính. Đồng thời cũng có thể làm cho SSO服务 đáp ứng nhu cầu负载均衡/khả năng mở rộng.

| Đối tượng      | Mô tả                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| AuthToken | Sử dụng định danh có entropy cao, không thể đoán trước được tạo bởi bộ sinh số ngẫu nhiên an toàn mật mã, và thiết lập cơ chế hết hạn, luân chuyển và thu hồi. Không sử dụng phiên bản UUID có thể đoán trước, cũng không tự mã hóa UserName+dấu thời gian rồi dùng làm token phiên |
| 登录信息  | Thông thường là cache UserId, UserName                                                                                                                   |

### Người dùng đăng nhập/Kiểm tra đăng nhập

**Sơ đồ时序 đăng nhập**

![SSO系统设计-登录时序图](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-login-sequence.png-kbrb.png)

Hình trên mô tả cách chia sẻ AuthToken giữa nhiều tên miền con thông qua Cookie tên miền cha. Hệ thống mới không khuyến nghị đặt `Domain` của Cookie xác thực thành `.test.com`: cách này sẽ gửi cùng một thông tin xác thực đến tất cả các tên miền con phù hợp, bất kỳ tên miền con yếu, bị bỏ hoang hoặc bị chiếm quyền nào cũng có thể mở rộng bề mặt tấn công.

Cách làm an toàn hơn là để SSO站点 và các业务站点分别 duy trì phiên host-only. Khi业务站点 cần đăng nhập, chuyển hướng đến SSO站点, SSO站点 sử dụng Cookie của mình để xác định người dùng đã đăng nhập hay chưa, sau đó thông qua mã ủy quyền dùng một lần, có thời hạn ngắn để trả kết quả xác thực về cho业务站点, phía后端业务站点 dùng mã này để đổi lấy thông tin người dùng và thiết lập phiên cục bộ.

**Lấy thông tin đăng nhập/Kiểm tra trạng thái đăng nhập**

![SSO系统设计-登录信息获取/登录状态校验](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-logincheck-sequence.png-kbrb.png)

### Người dùng đăng xuất

SSO登出 không chỉ là xóa một Cookie:

1. SSO服务端 thu hồi phiên đăng nhập trung tâm và các ủy quyền làm mới liên quan.
2. SSO站点 xóa Cookie phiên của mình.
3. Tùy theo giao thức và rủi ro nghiệp vụ, thông qua kênh trước (front-channel) hoặc kênh sau (back-channel) thông báo cho各业务站点清理 phiên cục bộ, và xử lý các tình huống như thông báo thất bại,站点离线.

**Sơ đồ时序 đăng xuất**

![SSO系统设计-用户登出](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-logout-sequence.png-kbrb.png)

### Đăng nhập, đăng xuất跨域

SSO跨域 không nên cố gắng giải quyết vấn đề đọc ghi Cookie跨域, mà nên thông qua chuyển hướng trình duyệt chuẩn và trao đổi token后端 để thiết lập phiên riêng cho各站点. Lựa chọn phổ biến là OpenID Connect Authorization Code Flow.

Ý tưởng cốt lõi để giải quyết跨域 là:

- Sau khi đăng nhập hoàn tất, SSO服务 chỉ trả về mã ủy quyền dùng một lần, có thời hạn ngắn cho địa chỉ callback đã được đăng ký trước và khớp chính xác. Backend业务站点 sử dụng mã ủy quyền này để đổi lấy kết quả xác thực, và thiết lập phiên riêng của mình, không sao chép cùng một Bearer Token dài hạn giữa các tên miền.
- Yêu cầu ủy quyền cần kiểm tra `state`; khi sử dụng OpenID Connect còn phải kiểm tra Issuer, Audience và chữ ký, và khi sử dụng `nonce` thì phải xác minh giá trị của nó. Public client khi sử dụng Authorization Code Flow còn nên sử dụng PKCE.
- Đăng xuất跨站 sử dụng thông báo kênh trước hoặc kênh sau được định nghĩa bởi giao thức, và cho phép业务站点 khi thông báo thất bại có thể hội tụ trạng thái thông qua hết hạn phiên, thu hồi token và kiểm tra lại.

**Đăng nhập跨域 (tên miền chính đã đăng nhập)**

![SSO系统设计-跨域登录（主域名已登录）](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-crossdomain-login-loggedin-sequence.png-kbrb.png)

**Đăng nhập跨域 (tên miền chính chưa đăng nhập)**

![SSO系统设计-跨域登录（主域名未登录）](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-crossdomain-login-unlogin-sequence.png-kbrb.png)

**Đăng xuất跨域**

![SSO系统设计-跨域登出](https://oss.javaguide.cn/github/javaguide/system-design/security/sso/sso-crossdomain-logout-sequence.png-kbrb.png)

Các sơ đồ时序 ở trên đến từ giải pháp đăng lại gốc, chủ yếu dùng để giúp hiểu quan hệ chuyển hướng đăng nhập và thông báo, trong đó các chi tiết như truyền trực tiếp AuthToken, chia sẻ Cookie tên miền cha không nên dùng làm cơ sở triển khai cho hệ thống mới. Hệ thống mới nên tuân theo quy chuẩn bảo mật hiện hành của giao thức OpenID Connect/OAuth đã chọn.

## Ghi chú

- Về giải pháp: Thiết kế giải pháp lần này chủ yếu là cung cấp ý tưởng triển khai. Đăng nhập người dùng APP không nên chỉ thêm một "APP签名" tự định nghĩa rồi coi là giải pháp bảo mật, khuyến nghị sử dụng trình duyệt hệ thống để hoàn thành OpenID Connect/OAuth Authorization Code Flow, và sử dụng PKCE; APP không thể được coi là môi trường đáng tin cậy có thể bảo quản vĩnh viễn client secret.
- Về sơ đồ时序: Sơ đồ时序 không bao gồm tất cả các tình huống, chỉ liệt kê các tình huống cốt lõi/chính, ngoài ra đối với một số thông báo không ảnh hưởng đến việc hiểu ý tưởng thì có thể lược bỏ.

## Tham khảo

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [RFC 9700：Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

<!-- @include: @article-footer.snippet.md -->