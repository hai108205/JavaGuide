---
title: "Chuyên đề Xác thực - Ủy quyền và Bảo mật Dữ liệu: JWT, SSO, Hệ thống Phân quyền, Mã hóa, Che giấu và Kiểm tra Dữ liệu"
description: Lộ trình học phỏng vấn về Xác thực - Ủy quyền và Bảo mật Dữ liệu, bao gồm Session, Token, OAuth2, JWT, SSO, RBAC, thuật toán mã hóa, che giấu dữ liệu, kiểm tra dữ liệu và bảo mật mật khẩu.
category: 系统设计
tag:
  - 认证授权
  - 数据安全
  - 后端面试
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: 认证授权,Authentication,Authorization,Session,Token,OAuth2,JWT,SSO,RBAC,权限系统,加密算法,敏感词过滤,数据脱敏,数据校验,密码安全,后端面试
---

Chuyên đề Xác thực - Ủy quyền và Bảo mật Dữ liệu tập trung vào một chuỗi liên kết rất cơ bản nhưng chi phí sai sót rất cao trong hệ thống backend: người dùng đăng nhập như thế nào, danh tính được truyền đi ra sao, quyền hạn được phán đoán thế nào, dữ liệu nhạy cảm được bảo vệ ra sao, dữ liệu đầu vào được kiểm tra như thế nào.

Bảo mật không phải là việc mà một framework hay một annotation nào đó có thể bao quát hết. Nó cần được thiết kế đồng thời từ nhiều khâu: xác thực, ủy quyền, truyền tải, lưu trữ, hiển thị, kiểm tra đầu vào và kiểm toán.

## Đối tượng phù hợp

- Backend developer đang tìm hiểu về đăng nhập - xác thực, hệ thống phân quyền và bảo mật dữ liệu.
- Các bạn đang chuẩn bị cho câu hỏi phỏng vấn về xác thực - ủy quyền, JWT, SSO, RBAC, che giấu dữ liệu.
- Kỹ sư cần thiết kế phương án phân quyền backend, hệ thống người dùng, hiển thị dữ liệu nhạy cảm hoặc kiểm tra dữ liệu trong dự án.
- Độc giả đã từng sử dụng các framework như Spring Security, Sa-Token, Shiro nhưng muốn bổ sung kiến thức nền tảng.

## Trọng tâm học tập

- Xác thực (Authentication) giải quyết câu hỏi "Bạn là ai", Ủy quyền (Authorization) giải quyết câu hỏi "Bạn có thể làm gì", hai khái niệm này không thể đánh đồng.
- Session, Token, JWT, OAuth2, SSO phù hợp với các tình huống khác nhau, không thể chỉ dùng tiêu chí "stateless (phi trạng thái)" để đánh giá ưu nhược điểm.
- Ưu điểm và vấn đề của JWT đều rất rõ ràng, trọng tâm nằm ở kiểm soát hiệu lực, gia hạn, rủi ro rò rỉ và quản trị phía server.
- Hệ thống phân quyền thường cần được mô hình hóa từ các chiều: người dùng, vai trò, quyền, tài nguyên, tổ chức, phạm vi dữ liệu.
- Bảo mật dữ liệu bao gồm cả lưu trữ mã hóa, hiển thị che giấu, kiểm tra đầu vào, lọc từ nhạy cảm và bảo mật mật khẩu.
- Phương án bảo mật phải cân nhắc đến chi phí triển khai, trải nghiệm người dùng, khả năng kiểm toán và năng lực xử lý sự cố.

## Thứ tự đọc đề xuất

1. [Giải thích chi tiết khái niệm cơ bản về Xác thực - Ủy quyền](./basis-of-authority-certification_VN.md): Phân biệt trước các khái niệm Authentication, Authorization, Session, Token, OAuth2.
2. [Giải thích chi tiết khái niệm cơ bản về JWT](./jwt-intro_VN.md) và [Phân tích ưu nhược điểm của JWT](./advantages-and-disadvantages-of-jwt.md): Hiểu cách hoạt động, ưu điểm và hạn chế của JWT.
3. [Giải thích chi tiết về SSO](./sso-intro.md): Hiểu về trung tâm xác thực thống nhất, đăng nhập xuyên hệ thống và đồng bộ trạng thái đăng nhập.
4. [Giải thích chi tiết thiết kế hệ thống phân quyền](./design-of-authority-system.md): Áp dụng xác thực - ủy quyền vào thiết kế hệ thống phân quyền RBAC.
5. [Tổng hợp các thuật toán mã hóa phổ biến](./encryption-algorithms.md), [Tổng hợp phương án che giấu dữ liệu](./data-desensitization.md), [Tại sao cả frontend và backend đều cần kiểm tra dữ liệu?](./data-validation.md): Bổ sung kiến thức nền tảng về bảo mật dữ liệu.
6. Sau đó đọc tiếp [Tổng hợp phương án lọc từ nhạy cảm](./sentive-words-filter.md) và [Tại sao khi quên mật khẩu chỉ có thể đặt lại, không thể cho bạn biết mật khẩu cũ?](./why-password-reset-instead-of-retrieval.md) tùy theo tình huống nghiệp vụ.

## Bài viết cốt lõi

### Xác thực - Ủy quyền

- [Giải thích chi tiết khái niệm cơ bản về Xác thực - Ủy quyền](./basis-of-authority-certification_VN.md): Giải thích các kiến thức cốt lõi về Authentication, Authorization, Session, Token, OAuth2.
- [Giải thích chi tiết khái niệm cơ bản về JWT](./jwt-intro_VN.md): Giải thích cấu trúc thành phần, thuật toán chữ ký, nguyên lý hoạt động và ứng dụng đăng nhập - xác thực của JSON Web Token.
- [Phân tích ưu nhược điểm của JWT](./advantages-and-disadvantages-of-jwt.md): Phân tích các vấn đề như JWT không thể chủ động vô hiệu hóa, gia hạn Token và giải pháp.
- [Giải thích chi tiết về SSO](./sso-intro.md): Giải thích về trung tâm xác thực thống nhất, giao thức CAS, hiện thực đăng nhập cross-domain và cơ chế đồng bộ trạng thái đăng nhập.
- [Giải thích chi tiết thiết kế hệ thống phân quyền](./design-of-authority-system.md): Dựa trên RBAC, giải thích mô hình hóa hệ thống phân quyền, kiểm soát truy cập và thiết kế quản lý backend.

### Bảo mật Dữ liệu

- [Tổng hợp các thuật toán mã hóa phổ biến](./encryption-algorithms.md): Hệ thống hóa nguyên lý và tình huống ứng dụng của các thuật toán như AES, RSA, MD5, SHA.
- [Tổng hợp phương án lọc từ nhạy cảm](./sentive-words-filter.md): Từ so khớp thô (brute-force) đến Trie Tree, AC Automaton, giải thích tiến hóa thuật toán lọc từ nhạy cảm và thực tiễn kỹ thuật.
- [Tổng hợp phương án che giấu dữ liệu](./data-desensitization.md): Giải thích quy tắc và phương pháp hiện thực che giấu dữ liệu nhạy cảm như số điện thoại, CMND, thẻ ngân hàng.
- [Tại sao cả frontend và backend đều cần kiểm tra dữ liệu?](./data-validation.md): Giải thích tầm quan trọng của kiểm tra tham số, kiểm tra quyền, và cách ngăn chặn vượt qua kiểm tra frontend.
- [Tại sao khi quên mật khẩu chỉ có thể đặt lại, không thể cho bạn biết mật khẩu cũ?](./why-password-reset-instead-of-retrieval.md): Giải thích về hash mật khẩu, salt, Bcrypt và bảo mật truyền tải mật khẩu.

## Câu hỏi thường gặp

- Xác thực (Authentication) và Ủy quyền (Authorization) khác nhau thế nào?
- Session và Token khác nhau thế nào?
- JWT gồm những phần nào? Chữ ký giải quyết vấn đề gì?
- Tại sao JWT không thể tự nhiên chủ động vô hiệu hóa? Có những giải pháp nào?
- OAuth2 và JWT có mối quan hệ gì?
- Quy trình cốt lõi của SSO là gì?
- Mô hình phân quyền RBAC thiết kế như thế nào? Mối quan hệ giữa người dùng, vai trò, quyền, tài nguyên là gì?
- Mã hóa đối xứng, mã hóa bất đối xứng và thuật toán hash lần lượt phù hợp với tình huống nào?
- Tại sao mật khẩu không được lưu dạng plain text? Tại sao quên mật khẩu chỉ có thể đặt lại?
- Che giấu dữ liệu nên thực hiện ở tầng lưu trữ, tầng dịch vụ hay tầng hiển thị?
- Tại sao backend nhất định phải kiểm tra dữ liệu?
- Có những phương án hiện thực lọc từ nhạy cảm phổ biến nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức Thiết kế Hệ thống](../)
- [Chuyên đề cơ bản về Thiết kế Hệ thống](../basis/)
- [Chuyên đề Spring & Spring Boot](../framework/spring/)
- [Hệ thống kiến thức High Availability](../../high-availability/)
- [An ninh mạng máy tính](../../cs-basics/network/network-attack-means.md)

<!-- @include: @article-footer.snippet.md -->
