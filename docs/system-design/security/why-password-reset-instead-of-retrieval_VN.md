---

title: Tại sao khi quên mật khẩu chỉ có thể đặt lại, chứ không thể cho bạn biết mật khẩu gốc?
description: Giải thích chi tiết vì sao khi quên mật khẩu, website chỉ có thể cho phép bạn đặt lại mật khẩu thay vì cung cấp mật khẩu ban đầu. Nguyên nhân cốt lõi là máy chủ lưu trữ mật khẩu bằng thuật toán băm (Hash), mà Hash là thuật toán một chiều, không thể khôi phục lại dữ liệu gốc từ giá trị băm. Bài viết cũng giới thiệu về bảo mật lưu trữ mật khẩu, cơ chế Salt, Bcrypt, bảo mật truyền mật khẩu và các kiến thức liên quan.
category:

* Thiết kế hệ thống
  tag:
* An toàn dữ liệu
* Bảo mật mật khẩu
* Thuật toán Hash
* Câu hỏi phỏng vấn
  head:
* * meta
  * name: keywords
    content: đặt lại mật khẩu,khôi phục mật khẩu,thuật toán Hash,lưu trữ mật khẩu,Bcrypt,Salt,bảo mật mật khẩu,câu hỏi phỏng vấn

---

Đây là một câu hỏi khá thú vị và cũng thường xuất hiện trong các buổi phỏng vấn của nhiều công ty. Thoạt nhìn thì có vẻ đơn giản, nhưng không biết khi đặt lại mật khẩu, bạn đã từng tự hỏi vì sao lại như vậy chưa?

![Đặt lại mật khẩu tài khoản](https://oss.javaguide.cn/github/javaguide/system-design/security/reset-password-page.png)

Thực ra, câu trả lời chỉ gói gọn trong một câu: **vì ngay cả máy chủ (server) cũng không biết mật khẩu gốc của bạn là gì**. Lập trình viên lưu mật khẩu gốc đã bị sa thải rồi 🤣.

Nếu máy chủ biết được mật khẩu gốc của bạn thì đó là một rủi ro bảo mật cực kỳ nghiêm trọng.

Hãy cùng phân tích ngắn gọn lý do.

Bài viết này sẽ không đi quá sâu vào các thuật toán mã hóa. Nếu quan tâm, bạn có thể tham khảo bài viết: [Tổng hợp các thuật toán mã hóa phổ biến](https://javaguide.cn/system-design/security/encryption-algorithms.html).

![](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/javaguide-security-encryption-algorithms.png)

## Vì sao máy chủ không biết mật khẩu gốc của bạn?

Những người từng phát triển phần mềm đều biết rằng, khi lưu mật khẩu vào cơ sở dữ liệu, **tuyệt đối không được lưu dưới dạng văn bản thuần (plaintext)**.

Nếu lưu trực tiếp dưới dạng plaintext thì sẽ có rất nhiều rủi ro:

1. Cơ sở dữ liệu có thể bị đánh cắp.
2. Người nội bộ có quyền truy cập cơ sở dữ liệu có thể lợi dụng trái phép.
3. Hacker sau khi xâm nhập có thể lấy ngay toàn bộ mật khẩu của người dùng.

Vì vậy, mật khẩu phải được xử lý trước khi lưu trữ. Cách xử lý phổ biến là sử dụng **thuật toán Hash**.

## Giới thiệu về thuật toán Hash

Thuật toán Hash (hay còn gọi là hàm băm hoặc thuật toán tạo digest) có nhiệm vụ tạo ra một giá trị nhận dạng có độ dài cố định từ dữ liệu đầu vào có độ dài bất kỳ. Giá trị này được gọi là **giá trị Hash (Hash value)**, **giá trị băm** hoặc **message digest** (trong bài viết này gọi chung là **giá trị Hash**).

![Minh họa hoạt động của thuật toán Hash](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/hash-function-effect-demonstration.png)

Thuật toán Hash có hai đặc điểm quan trọng:

1. **Tính không thể đảo ngược (Irreversibility)**: Không thể khôi phục lại dữ liệu gốc từ giá trị Hash. Đây là đặc điểm quan trọng nhất!
2. **Tính xác định (Deterministic)**: Cùng một đầu vào sẽ luôn tạo ra cùng một đầu ra.

Có một ví dụ rất trực quan:

**Mật khẩu bạn lưu giống như củ khoai tây đã được bào thành sợi. Không thể ghép các sợi khoai lại thành củ khoai ban đầu. Nhưng website chỉ cần lấy mật khẩu bạn nhập, "bào" thêm một lần nữa, rồi so sánh xem hai đĩa khoai tây sợi có giống nhau hay không.**

Chính hai đặc điểm này khiến thuật toán Hash rất phù hợp để lưu trữ mật khẩu: máy chủ chỉ lưu giá trị Hash của mật khẩu, còn khi xác thực thì chỉ cần so sánh giá trị Hash.

### Phân loại thuật toán Hash

Có thể chia thuật toán Hash thành hai nhóm chính:

1. **Thuật toán Hash mật mã (Cryptographic Hash Algorithm)**: Có độ an toàn cao, cung cấp khả năng đảm bảo tính toàn vẹn dữ liệu và chống giả mạo dữ liệu, đồng thời chống chịu được một số hình thức tấn công. Tuy nhiên hiệu năng thấp hơn và phù hợp với các tình huống yêu cầu bảo mật cao. Ví dụ: SHA2, SHA3, SM3, RIPEMD-160, BLAKE2...
2. **Thuật toán Hash không mật mã (Non-Cryptographic Hash Algorithm)**: Độ an toàn thấp hơn, dễ bị ảnh hưởng bởi các cuộc tấn công brute-force hoặc collision, nhưng hiệu năng cao hơn. Thường dùng trong các nghiệp vụ không yêu cầu bảo mật. Ví dụ: CRC32, MurMurHash3...

Ngoài hai nhóm trên còn có các thuật toán Hash đặc biệt khác, chẳng hạn như **thuật toán Slow Hash** có mức độ an toàn cao hơn.

### Vì sao không còn khuyến nghị sử dụng MD5?

Trước đây MD5 thường được dùng để "mã hóa" mật khẩu, nhưng hiện nay **không còn được khuyến nghị** vì các lý do sau:

1. **Khả năng chống va chạm (Collision Resistance) kém**: Có thể tạo ra nhiều đầu vào khác nhau cho cùng một giá trị MD5.
2. **Độ dài giá trị Hash ngắn**: Chỉ 128 bit nên dễ bị Rainbow Table Attack.
3. **Tốc độ tính toán quá nhanh**: Điều này lại khiến brute-force trở nên hiệu quả hơn.

Để tìm hiểu chi tiết, bạn có thể đọc bài viết: [Đừng ghi "MD5 mã hóa mật khẩu" trong CV nữa!](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247542780&idx=1&sn=fb2fe3fb53fe596cc5b22e30766e0098&scene=21#wechat_redirect)

### Vì sao cần Salt?

Chỉ sử dụng thuật toán Hash để lưu mật khẩu vẫn có nguy cơ bị **Rainbow Table Attack**. Rainbow Table là bảng tra cứu được tính toán trước, giúp kẻ tấn công nhanh chóng suy ra mật khẩu bằng cách tra cứu giá trị Hash.

**Salt** là một giá trị ngẫu nhiên được tạo riêng cho từng mật khẩu. Thuật toán Hash sẽ kết hợp Salt với mật khẩu trước khi tính toán. Salt không cần giữ bí mật, nhưng phải được tạo ngẫu nhiên và không được dùng chung giữa các người dùng.

**Vai trò của Salt:**

1. Tăng độ phức tạp và tính duy nhất của mật khẩu.
2. Vô hiệu hóa Rainbow Table Attack (vì mỗi người dùng có Salt khác nhau).
3. Ngay cả khi hai người dùng dùng cùng một mật khẩu thì giá trị Hash cũng khác nhau.

## Khuyến nghị về phương án lưu trữ mật khẩu

Mật khẩu nên được lưu bằng các thuật toán được thiết kế chuyên biệt cho lưu trữ mật khẩu và có thể điều chỉnh chi phí tính toán (computational cost), thay vì sử dụng trực tiếp các thuật toán Hash tốc độ cao như MD5, SHA-256 hoặc SHA-3. Ngay cả khi thêm Salt cho các thuật toán Hash tốc độ cao, nếu kẻ tấn công lấy được cơ sở dữ liệu thì vẫn có thể thử số lượng lớn mật khẩu ứng viên với tốc độ rất nhanh.

Đối với hệ thống mới, nên ưu tiên **Argon2id**. Nếu không thể sử dụng, có thể lựa chọn **scrypt** tùy theo môi trường triển khai; với hệ thống cũ cần tương thích thì có thể dùng **Bcrypt** được cấu hình hợp lý; còn trong môi trường yêu cầu tuân thủ **FIPS** thì có thể dùng **PBKDF2**. Các tham số cụ thể cần được đánh giá và nâng cấp định kỳ dựa trên hiệu năng của máy chủ.

### Ví dụ với Bcrypt

**Bcrypt** là thuật toán Hash được thiết kế chuyên biệt cho lưu trữ mật khẩu và thuộc nhóm **Slow Hash**. Thuật toán này tích hợp sẵn cơ chế **Salt** và tham số **cost**:

* **salt**: Chuỗi ngẫu nhiên dùng để kết hợp với mật khẩu nhằm tăng tính duy nhất.
* **cost**: Điều khiển số lần lặp, từ đó tăng thời gian và chi phí tính toán.

Salt ngẫu nhiên của Bcrypt giúp chống các cuộc tấn công tính toán trước và Rainbow Table Attack. Tham số cost giúp tăng chi phí brute-force ngoại tuyến, nhưng không thể biến một mật khẩu yếu thành mật khẩu không thể bị bẻ khóa. Ngoài ra, cần lưu ý rằng phần lớn các triển khai Bcrypt chỉ xử lý **72 byte đầu tiên** của mật khẩu; hệ thống không nên cắt bớt mật khẩu một cách âm thầm mà không thông báo cho người dùng.

Spring Security cung cấp `BCryptPasswordEncoder`. Ví dụ dưới đây minh họa cách thiết lập cost một cách tường minh; tuy nhiên đối với hệ thống mới vẫn nên ưu tiên đánh giá Argon2id.

```java
@Bean
public PasswordEncoder passwordEncoder(){
    // cost nên được xác định thông qua kiểm thử hiệu năng và điều chỉnh định kỳ theo sự cải thiện của phần cứng.
    return new BCryptPasswordEncoder(12);
}
```

## Quy trình xác thực đăng nhập

Khi bạn nhập mật khẩu để đăng nhập, quy trình xác thực diễn ra như sau:

1. Máy chủ lấy giá trị Hash của mật khẩu đã lưu trong cơ sở dữ liệu dựa trên tên người dùng. Giá trị này thường đã bao gồm thông tin về thuật toán, tham số và Salt ngẫu nhiên.
2. Máy chủ gọi phương thức xác thực do thư viện Hash mật khẩu cung cấp, chẳng hạn `PasswordEncoder#matches` của Spring Security. Không nên tự ghép Salt hoặc tự so sánh chuỗi.
3. Thư viện sẽ đọc Salt và các tham số trong dữ liệu đã lưu, tính toán lại giá trị Hash từ mật khẩu người dùng nhập, sau đó thực hiện so sánh theo cách an toàn.
4. Nếu xác thực thành công thì mật khẩu chính xác; nếu không thì mật khẩu sai. Sau khi xác thực thành công, nếu tham số Hash đã lỗi thời thì có thể tính toán lại và nâng cấp giá trị Hash.

## Khi đặt lại mật khẩu, website làm sao biết mật khẩu mới có trùng mật khẩu cũ?

Có thể bạn từng thấy một số website hiển thị thông báo: **"Mật khẩu mới không được trùng với mật khẩu cũ."** Vậy website làm sao biết được điều đó?

Nguyên lý hoàn toàn giống với việc xác thực mật khẩu:

1. Người dùng nhập mật khẩu mới.
2. Máy chủ gọi phương thức xác thực của thư viện Hash mật khẩu để so sánh mật khẩu mới với giá trị Hash cũ trong cơ sở dữ liệu, ví dụ: `passwordEncoder.matches(newPassword, oldPasswordHash)`.
3. Nếu xác thực thành công thì chứng tỏ mật khẩu mới trùng với mật khẩu cũ và yêu cầu sẽ bị từ chối.
4. Nếu khác nhau thì hệ thống sẽ tạo Salt ngẫu nhiên mới và tính lại giá trị Hash cho mật khẩu mới. Không được tái sử dụng giá trị Hash cũ hoặc tự cố định Salt.

Do đó, website hoàn toàn **không biết** mật khẩu cũ của bạn là gì; nó chỉ đang so sánh xem "hai đĩa khoai tây sợi" có giống nhau hay không.

## Bảo mật truyền mật khẩu

Những gì trình bày ở trên đều liên quan đến việc lưu trữ mật khẩu trên máy chủ. Vậy còn quá trình truyền mật khẩu thì sao?

Có một câu hỏi phỏng vấn rất phổ biến:

> Nếu nhân viên biết thuật toán mã hóa thì chẳng phải sau khi nghỉ việc họ vẫn có thể tự mô phỏng quá trình mã hóa và lấy được mật khẩu sao?

Câu trả lời là:

**Lưu trữ và truyền dữ liệu là hai vấn đề hoàn toàn tách biệt.**

Một giải pháp bảo mật mật khẩu hoàn chỉnh phải đồng thời đảm bảo **an toàn khi lưu trữ** và **an toàn khi truyền tải**.

### Sử dụng HTTPS

HTTPS là nền tảng để đảm bảo an toàn trong quá trình truyền dữ liệu.

HTTP hoạt động trên TCP, toàn bộ dữ liệu truyền đi đều ở dạng plaintext và cả client lẫn server đều không thể xác thực danh tính của đối phương.

Trong khi đó, HTTPS là HTTP chạy trên SSL/TLS, toàn bộ dữ liệu truyền đều được mã hóa.

Bạn có thể tham khảo bài viết này để hiểu rõ hơn sự khác biệt giữa HTTP và HTTPS: [HTTP vs HTTPS (Tầng ứng dụng)](https://javaguide.cn/cs-basics/network/http-vs-https.html).

Đối với các ứng dụng Web thông thường, việc cấu hình HTTPS đúng cách là nền tảng để bảo vệ việc truyền mật khẩu. Máy chủ nên mặc định sử dụng **TLS 1.3**, đồng thời hỗ trợ **TLS 1.2** khi cần tương thích; bắt buộc sử dụng HTTPS trên toàn bộ website, bật **HSTS**, xác thực chứng chỉ đúng cách và vô hiệu hóa các giao thức cũ cũng như các bộ mật mã yếu.

Việc bổ sung thêm một lớp mã hóa RSA tùy chỉnh ở phía trình duyệt thường không giải quyết được các vấn đề như client độc hại, mã JavaScript phía frontend bị xâm nhập hoặc điểm giải mã phía server bị lộ. Ngược lại, nó còn làm tăng độ phức tạp trong việc phân phối khóa, lựa chọn cơ chế padding và phòng chống replay attack. Vì vậy, không nên coi mô hình **"RSA phía client + HTTPS"** là giải pháp bắt buộc cho mọi hệ thống.

Trong một số hệ thống có yêu cầu tuân thủ hoặc mô hình đe dọa đặc biệt, có thể bổ sung thêm lớp bảo vệ ở tầng ứng dụng trên nền TLS. Tuy nhiên, nên sử dụng các giao thức đã được đánh giá kỹ lưỡng, đồng thời phải có cơ chế random challenge, kiểm tra thời hạn hiệu lực và chống replay attack, thay vì chỉ thực hiện một lần mã hóa bằng khóa công khai.

Ngoài việc mã hóa đường truyền, hệ thống còn nên giới hạn số lần thử đăng nhập, tránh ghi log chứa mật khẩu, sử dụng xác thực đa yếu tố (MFA) và phòng chống Credential Stuffing cũng như Password Spraying.

## Khi triển khai chức năng quên mật khẩu còn cần lưu ý điều gì?

Bài viết này tập trung giải thích vì sao máy chủ không thể khôi phục mật khẩu gốc. Trong thực tế, khi triển khai chức năng quên mật khẩu, vẫn cần chú ý các yêu cầu bảo mật sau:

* Dù tài khoản có tồn tại hay không, hệ thống đều phải trả về cùng một thông báo và cố gắng giữ thời gian phản hồi tương đương nhằm tránh User Enumeration.
* Reset Token phải được tạo bằng bộ sinh số ngẫu nhiên bảo mật, có đủ entropy, chỉ sử dụng một lần và hết hạn trong thời gian ngắn.
* Áp dụng Rate Limiting đối với yêu cầu đặt lại mật khẩu và quá trình xác thực Reset Token; liên kết đặt lại mật khẩu chỉ sử dụng tên miền đáng tin cậy và HTTPS để tránh rò rỉ Token thông qua Referer.
* Sau khi thay đổi mật khẩu thành công, nên gửi thông báo bảo mật cho người dùng, đồng thời vô hiệu hóa các phiên đăng nhập hiện có theo mức độ rủi ro, hoặc ít nhất cho phép người dùng đăng xuất tất cả các phiên khác chỉ bằng một thao tác.

## Tổng kết

Quay trở lại câu hỏi ban đầu:

**Vì sao khi quên mật khẩu chỉ có thể đặt lại mà không thể cho bạn biết mật khẩu gốc?**

Bởi vì máy chủ chỉ lưu **giá trị Hash của mật khẩu**, còn **thuật toán Hash là thuật toán một chiều**, không thể khôi phục lại mật khẩu gốc từ giá trị Hash. Đây là nguyên tắc cơ bản của bảo mật mật khẩu.

Nếu một website có thể trực tiếp cho bạn biết mật khẩu gốc, điều đó chứng tỏ hệ thống đang lưu mật khẩu ở **dạng plaintext hoặc dạng có thể khôi phục**, thay vì chỉ lưu giá trị Hash chuyên dụng. Đây là một lỗ hổng bảo mật nghiêm trọng. Bạn nên đổi mật khẩu ngay và kiểm tra xem mình có đang dùng lại mật khẩu đó trên các website khác hay không.

**Quan trọng hơn nữa:** Nếu bạn dùng cùng một mật khẩu trên mọi website, chỉ cần một website kém an toàn bị rò rỉ mật khẩu thì toàn bộ tài khoản của bạn đều có nguy cơ bị xâm phạm.

Vì vậy, **đừng sử dụng cùng một mật khẩu cho tất cả các website!**

## Tài liệu tham khảo

* OWASP Password Storage Cheat Sheet：https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
* OWASP Forgot Password Cheat Sheet：https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
* OWASP Transport Layer Security Cheat Sheet：https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
