---
title: Tổng hợp các thuật toán mã hóa phổ biến
description: Giải thích chi tiết các thuật toán mã hóa phổ biến, bao gồm nguyên lý và tình huống ứng dụng của thuật toán mã hóa đối xứng và bất đối xứng như AES, RSA, cùng các thuật toán băm như MD5, SHA.
category: 系统设计
tag:
  - 安全
  - 哈希算法
head:
  - - meta
    - name: keywords
      content: 加密算法,AES,RSA,哈希算法,摘要算法,HTTPS,对称加密,非对称加密,BCrypt
---

Thuật toán mã hóa là một kỹ thuật sử dụng phương pháp toán học để biến đổi dữ liệu, nhằm bảo vệ an toàn dữ liệu, ngăn chặn việc đọc hoặc sửa đổi trái phép. Thuật toán mã hóa có thể chia thành ba loại lớn: thuật toán mã hóa đối xứng, thuật toán mã hóa bất đối xứng và thuật toán băm (hash algorithm, còn gọi là thuật toán tóm lược - digest algorithm).

Các tình huống phổ biến cần sử dụng thuật toán mã hóa trong phát triển hàng ngày:

1. Mật khẩu lưu trong cơ sở dữ liệu cần được thêm muối (salt) rồi sử dụng thuật toán băm (ví dụ BCrypt) để mã hóa.
2. Các dữ liệu nhạy cảm như số thẻ ngân hàng, số căn cước lưu trong cơ sở dữ liệu cần sử dụng thuật toán mã hóa đối xứng (ví dụ AES) để lưu trữ.
3. Dữ liệu nhạy cảm truyền qua mạng như số thẻ ngân hàng, số căn cước cần sử dụng HTTPS + thuật toán mã hóa bất đối xứng (như RSA) để đảm bảo an toàn dữ liệu truyền tải.
4. ……

ps: Nói một cách chặt chẽ, thuật toán băm thực ra không thuộc về thuật toán mã hóa, chỉ là có thể dùng trong một số tình huống mã hóa (ví dụ như mã hóa mật khẩu), hai loại này có thể coi là quan hệ ngang hàng. Thuật toán mã hóa thường chỉ thuật toán có thể chuyển đổi văn bản gốc (plaintext) thành văn bản mã hóa (ciphertext), và có thể thông qua một cách nào đó (như khóa - key) để khôi phục văn bản mã hóa trở lại văn bản gốc. Còn thuật toán băm là một quá trình một chiều, nó chuyển đổi thông tin đầu vào thành một giá trị băm (hash value) có độ dài cố định, trông có vẻ ngẫu nhiên, nhưng quá trình này là không thể đảo ngược, tức là không thể từ giá trị băm khôi phục lại thông tin gốc.

## Thuật toán băm (Hash Algorithm)

Thuật toán băm còn gọi là hàm băm (hash function) hoặc thuật toán tóm lược (digest algorithm), tác dụng của nó là tạo ra một định danh duy nhất có độ dài cố định cho dữ liệu có độ dài bất kỳ, còn gọi là giá trị băm, giá trị băm (hash value) hoặc tóm lược thông điệp (message digest, sau đây gọi chung là giá trị băm).

![哈希算法效果演示](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/hash-function-effect-demonstration.png)

Thuật toán băm là không thể đảo ngược, bạn không thể từ giá trị sau khi băm mà lấy lại được giá trị gốc.

Tác dụng của giá trị băm là có thể dùng để xác minh tính toàn vẹn và tính nhất quán của dữ liệu.

Hai ví dụ thực tế:

- Khi lưu mật khẩu vào cơ sở dữ liệu, sử dụng thuật toán băm để mã hóa, có thể thông qua việc so sánh giá trị băm của mật khẩu người dùng nhập vào với giá trị băm đã lưu trong cơ sở dữ liệu có khớp hay không, để phán đoán mật khẩu có đúng không.
- Khi chúng ta tải xuống một tập tin, có thể thông qua việc so sánh giá trị băm của tập tin với giá trị băm do nhà phát hành chính thức cung cấp có khớp hay không, để phán đoán tập tin có bị sửa đổi hoặc hỏng hóc hay không;

Đặc điểm của loại thuật toán này là không thể đảo ngược:

- Không thể từ giá trị băm khôi phục lại dữ liệu gốc.
- Bất kỳ thay đổi nào của dữ liệu gốc đều dẫn đến sự thay đổi lớn của giá trị băm.

Thuật toán băm có thể chia đơn giản thành hai loại:

1. **Thuật toán băm mật mã (Cryptographic Hash Algorithm)**：Thuật toán băm có độ an toàn cao hơn, nó có thể cung cấp khả năng bảo vệ tính toàn vẹn dữ liệu và khả năng chống sửa đổi dữ liệu ở mức độ nhất định, có thể chống lại một số phương thức tấn công, độ an toàn tương đối cao, nhưng hiệu năng kém hơn, phù hợp với các tình huống yêu cầu an toàn cao. Ví dụ SHA2, SHA3, SM3, RIPEMD-160, BLAKE2 v.v.
2. **Thuật toán băm phi mật mã (Non-cryptographic Hash Algorithm)**：Thuật toán băm có độ an toàn tương đối thấp, dễ bị ảnh hưởng bởi các phương thức tấn công như brute force, tấn công xung đột (collision attack), nhưng hiệu năng cao, phù hợp với các tình huống nghiệp vụ không yêu cầu an toàn. Ví dụ CRC32, MurMurHash3 v.v.

Ngoài hai loại này, còn có một số thuật toán băm đặc biệt, ví dụ như **thuật toán băm chậm (Slow Hash Algorithm)** có độ an toàn cao hơn.

Các thuật toán băm phổ biến:

- MD（Message Digest, thuật toán tóm lược thông điệp）：MD2, MD4, MD5 v.v., đã không còn được khuyến nghị sử dụng.
- SHA（Secure Hash Algorithm, thuật toán băm an toàn）：Dòng SHA-1 có độ an toàn thấp, dòng SHA2, SHA3 có độ an toàn cao hơn.
- Thuật toán mật mã quốc gia Trung Quốc：ví dụ SM2, SM3, SM4, trong đó SM2 là thuật toán mã hóa bất đối xứng, SM4 là thuật toán mã hóa đối xứng, SM3 là thuật toán băm（độ an toàn và hiệu suất tương đương SHA-256, nhưng phù hợp hơn với môi trường ứng dụng trong nước Trung Quốc）.
- BCrypt（thuật toán băm mật khẩu）：Thuật toán băm mật khẩu dựa trên thuật toán mã hóa Blowfish, được thiết kế chuyên biệt cho mã hóa mật khẩu, độ an toàn cao, thuộc về thuật toán băm chậm.
- MAC（Message Authentication Code, thuật toán mã xác thực thông điệp）：HMAC là một loại MAC dựa trên băm, có thể kết hợp với bất kỳ thuật toán băm an toàn nào, ví dụ SHA-256.
- CRC：（Cyclic Redundancy Check, kiểm tra dư thừa vòng）：CRC32 là một thuật toán CRC, đặc điểm của nó là tạo ra giá trị kiểm tra 32 bit, thường dùng trong các tình huống như kiểm tra tính toàn vẹn dữ liệu, kiểm tra tập tin.
- SipHash：Nó không phải là hàm băm mật mã không khóa truyền thống（như SHA-256）, mà là PRF（Pseudo-Random Function, hàm giả ngẫu nhiên）có khóa. Phải kết hợp với một khóa ngẫu nhiên mới thực sự có khả năng chống tấn công xung đột. Mục đích thiết kế của nó là đạt được sự cân bằng giữa tốc độ và an toàn, dùng để phòng chống [tấn công DoS tràn băm (Hash Flooding DoS Attack)](https://aumasson.jp/siphash/siphashdos_29c3_slides.pdf). Rust mặc định sử dụng SipHash làm thuật toán băm（hiện tại là SipHash-1-3）, từ Redis 4.0 trở đi, thuật toán băm của dictionary（dict）đã chuyển từ MurmurHash2 ban đầu sang SipHash（hiện tại là SipHash-1-2）.
- MurMurHash：Thuật toán băm phi mật mã cổ điển nhanh, phiên bản mới nhất hiện tại là MurMurHash3, có thể tạo ra giá trị băm 32 bit hoặc 128 bit；
- ……

Thuật toán băm thông thường không cần khóa, nhưng cũng tồn tại một số thuật toán băm đặc biệt cần khóa. Ví dụ, MAC và SipHash chính là một loại thuật toán băm dựa trên khóa, nó thêm một khóa trên cơ sở thuật toán băm, khiến cho chỉ người biết khóa mới có thể xác minh tính toàn vẹn và nguồn gốc của dữ liệu.

### MD

Thuật toán MD có nhiều phiên bản, bao gồm MD2, MD4, MD5 v.v., trong đó MD5 là phiên bản được sử dụng nhiều nhất, nó có thể tạo ra một giá trị băm 128 bit（16 byte）. Xét về độ an toàn：MD5 > MD4 > MD2. Ngoài các phiên bản này, còn có một số thuật toán cải tiến dựa trên MD4 hoặc MD5, như RIPEMD, HAVAL v.v.

Ngay cả thuật toán MD an toàn nhất là MD5 cũng tồn tại rủi ro bị phá giải, kẻ tấn công có thể thông qua brute force hoặc tấn công bảng cầu vồng (rainbow table attack) v.v., tìm ra giá trị băm giống với dữ liệu gốc, từ đó phá giải dữ liệu.

Để tăng độ khó phá giải, thường có thể chọn thêm muối (salt). Muối (Salt) trong mật mã học, là chỉ việc chèn một chuỗi ký tự cụ thể vào vị trí cố định bất kỳ của mật khẩu, khiến cho kết quả sau khi băm không khớp với kết quả băm của mật khẩu gốc, quá trình này gọi là "thêm muối" (salting).

Sau khi thêm muối thì đã an toàn chưa? Không hẳn, điều này chỉ làm tăng độ khó phá giải, không có nghĩa là không thể phá giải. Hơn nữa, bản thân thuật toán MD5 đã tồn tại vấn đề xung đột yếu (Weak Collision), tức là nhiều đầu vào khác nhau tạo ra cùng một giá trị MD5.

Do đó, thuật toán MD đã không còn được khuyến nghị sử dụng, nên sử dụng các thuật toán băm an toàn hơn như SHA-2, BCrypt.

Java cung cấp hỗ trợ cho dòng thuật toán MD, bao gồm MD2, MD5.

Ví dụ code MD5（chưa thêm muối）：

```java
String originalString = "Java学习 + 面试指南：javaguide.cn";
// Tạo đối tượng tóm lược MD5
MessageDigest messageDigest = MessageDigest.getInstance("MD5");
messageDigest.update(originalString.getBytes(StandardCharsets.UTF_8));
// Tính giá trị băm
byte[] result = messageDigest.digest();
// Chuyển đổi giá trị băm thành chuỗi thập lục phân
String hexString = new HexBinaryAdapter().marshal(result);
System.out.println("Original String: " + originalString);
System.out.println("MD5 Hash: " + hexString.toLowerCase());
```

Kết quả：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
MD5 Hash: fb246796f5b1b60d4d0268c817c608fa
```

### SHA

Dòng thuật toán SHA（Secure Hash Algorithm）là một nhóm thuật toán băm mật mã, dùng để ánh xạ dữ liệu có độ dài bất kỳ thành giá trị băm có độ dài cố định. Dòng thuật toán SHA do Cơ quan An ninh Quốc gia Hoa Kỳ（NSA）thiết kế vào năm 1993, hiện có ba phiên bản SHA-1, SHA-2, SHA-3.

Thuật toán SHA-1 ánh xạ dữ liệu có độ dài bất kỳ thành giá trị băm 160 bit. Tuy nhiên, thuật toán SHA-1 tồn tại một số khiếm khuyết nghiêm trọng, như độ an toàn thấp, dễ bị tấn công xung đột (collision attack) và tấn công mở rộng độ dài (length extension attack). Do đó, thuật toán SHA-1 đã không còn được khuyến nghị sử dụng. Họ SHA-2（như SHA-256, SHA-384, SHA-512 v.v.）và dòng SHA-3 là các phương án thay thế cho thuật toán SHA-1, chúng đều cung cấp độ an toàn cao hơn và độ dài giá trị băm dài hơn.

Họ SHA-2 được cải tiến trên cơ sở thuật toán SHA-1, chúng áp dụng quá trình tính toán phức tạp hơn và nhiều vòng hơn, khiến cho kẻ tấn công khó tìm ra xung đột thông qua tính toán trước hoặc trùng hợp ngẫu nhiên hơn.

Để tìm kiếm một thuật toán băm mật mã an toàn hơn và tiên tiến hơn, Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ（National Institute of Standards and Technology, viết tắt NIST）đã công khai kêu gọi các thuật toán ứng viên cho SHA-3 vào năm 2007. NIST đã nhận được tổng cộng 64 phương án thuật toán, sau nhiều vòng đánh giá và sàng lọc, cuối cùng vào năm 2012 tuyên bố thuật toán Keccak chiến thắng, trở thành thuật toán tiêu chuẩn của SHA-3（SHA-3 không có quan hệ trực tiếp với thuật toán SHA-2）. Thuật toán Keccak có ý tưởng thiết kế hoàn toàn khác với MD và SHA-1/2, đó là cấu trúc bọt biển（Sponge Construction）, khiến cho các phương pháp tấn công truyền thống không thể áp dụng trực tiếp vào việc tấn công SHA-3（có thể chống lại tất cả các phương thức tấn công đã biết hiện nay bao gồm tấn công xung đột, tấn công mở rộng độ dài, tấn công vi sai v.v.）.

Do thuật toán SHA-2 vẫn chưa xuất hiện lỗ hổng an toàn nghiêm trọng, và hiệu suất trong phần mềm cao hơn, nên đa số mọi người vẫn có xu hướng sử dụng thuật toán SHA-2.

So với thuật toán MD5, thuật toán SHA-2 mạnh hơn, chủ yếu có hai lý do：

- Độ dài giá trị băm dài hơn：ví dụ giá trị băm của thuật toán SHA-256 có độ dài 256 bit, trong khi giá trị băm của thuật toán MD5 có độ dài 128 bit, điều này làm tăng độ khó cho kẻ tấn công brute force hoặc tấn công bảng cầu vồng.
- Khả năng chống xung đột mạnh hơn：Thuật toán SHA áp dụng quá trình tính toán phức tạp hơn và nhiều vòng hơn, khiến cho kẻ tấn công khó tìm ra xung đột thông qua tính toán trước hoặc trùng hợp ngẫu nhiên hơn. Hiện vẫn chưa tìm thấy bất kỳ hai dữ liệu khác nhau nào có giá trị băm SHA-256 giống nhau.

Tất nhiên, SHA-2 cũng không phải an toàn tuyệt đối, cũng có rủi ro bị brute force hoặc tấn công bảng cầu vồng, vì vậy, trong ứng dụng thực tế, thêm muối vẫn là không thể thiếu.

Java cung cấp hỗ trợ cho dòng thuật toán SHA, bao gồm SHA-1, SHA-256, SHA-384 và SHA-512.

Ví dụ code SHA-256（chưa thêm muối）：

```java
String originalString = "Java学习 + 面试指南：javaguide.cn";
// Tạo đối tượng tóm lược SHA-256
MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
messageDigest.update(originalString.getBytes());
// Tính giá trị băm
byte[] result = messageDigest.digest();
// Chuyển đổi giá trị băm thành chuỗi thập lục phân
String hexString = new HexBinaryAdapter().marshal(result);
System.out.println("Original String: " + originalString);
System.out.println("SHA-256 Hash: " + hexString.toLowerCase());
```

Kết quả：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
SHA-256 Hash: 184eb7e1d7fb002444098c9bde3403c6f6722c93ecfac242c0e35cd9ed3b41cd
```

### BCrypt

Thuật toán BCrypt là một thuật toán băm mật khẩu dựa trên thuật toán mã hóa Blowfish, được thiết kế chuyên biệt cho mã hóa mật khẩu, độ an toàn cao.

Do BCrypt áp dụng hai cơ chế salt（muối）và cost（chi phí）, nó có thể ngăn chặn hiệu quả tấn công bảng cầu vồng và tấn công brute force, từ đó đảm bảo an toàn cho mật khẩu. salt là một chuỗi ngẫu nhiên được sinh ra, dùng để trộn với mật khẩu, tăng độ phức tạp và tính duy nhất của mật khẩu. cost là một tham số số, dùng để kiểm soát số lần lặp của thuật toán BCrypt, tăng thời gian tính toán và tiêu thụ tài nguyên của việc băm mật khẩu.

Thuật toán BCrypt có thể điều chỉnh độ phức tạp mã hóa theo tình hình thực tế, có thể thiết lập giá trị cost và giá trị salt khác nhau, từ đó đáp ứng các nhu cầu an toàn khác nhau, tính linh hoạt rất cao.

Framework bảo mật Spring Security của ứng dụng Java hỗ trợ nhiều bộ mã hóa mật khẩu (password encoder), trong đó `BCryptPasswordEncoder` là loại được chính thức khuyến nghị, nó sử dụng thuật toán BCrypt để mã hóa và lưu trữ mật khẩu của người dùng.

```java
@Bean
public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
}
```

## Mã hóa đối xứng (Symmetric Encryption)

Thuật toán mã hóa đối xứng là thuật toán sử dụng cùng một khóa để mã hóa và giải mã, còn gọi là thuật toán mã hóa khóa chia sẻ (shared-key encryption).

![对称加密](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/symmetric-encryption.png)

Các thuật toán mã hóa đối xứng phổ biến có DES, 3DES, AES v.v.

### DES và 3DES

DES（Data Encryption Standard）sử dụng khóa 64 bit（độ dài khóa hiệu quả là 56 bit, 8 bit kiểm tra chẵn lẻ）và văn bản gốc 64 bit để mã hóa.

Mặc dù DES mỗi lần chỉ có thể mã hóa 64 bit, nhưng chúng ta chỉ cần chia văn bản gốc thành các khối 64 bit một nhóm, là có thể thực hiện mã hóa văn bản gốc có độ dài bất kỳ. Nếu độ dài văn bản gốc không phải là bội số của 64 bit, phải thực hiện đệm (padding), các chế độ thường dùng có PKCS5Padding, PKCS7Padding, NOPADDING.

Ý tưởng cơ bản của thuật toán mã hóa DES là chia văn bản gốc 64 bit thành hai nửa, sau đó thực hiện biến đổi nhiều vòng cho mỗi nửa, cuối cùng hợp nhất lại thành văn bản mã hóa 64 bit. Các biến đổi này bao gồm các thao tác hoán vị, XOR, chọn, dịch chuyển v.v., mỗi vòng đều sử dụng một khóa con, và các khóa con này đều được sinh ra từ cùng một khóa chính 56 bit. Thuật toán mã hóa DES tổng cộng thực hiện 16 vòng biến đổi, cuối cùng thực hiện một lần hoán vị ngược, nhận được văn bản mã hóa cuối cùng.

![DES（Data Encryption Standard）](https://oss.javaguide.cn/github/javaguide/system-design/security/des-steps.jpg)

Đây là một thuật toán mã hóa đối xứng cổ điển, nhưng cũng có khiếm khuyết rõ ràng, đó là khóa 56 bit có độ an toàn không đủ, đã được chứng minh có thể bị phá giải trong thời gian ngắn.

Để nâng cao độ an toàn của thuật toán DES, người ta đã đề xuất một số biến thể hoặc phương án thay thế, ví dụ 3DES（Triple DES）.

3DES（Triple DES）là thuật toán mã hóa chuyển tiếp từ DES sang AES, nó sử dụng 2 hoặc 3 khóa 56 bit để mã hóa dữ liệu ba lần. 3DES tương đương với việc áp dụng ba lần thuật toán mã hóa đối xứng DES cho mỗi khối dữ liệu.

Để tương thích với DES thông thường, 3DES không trực tiếp sử dụng cách mã hóa->mã hóa->mã hóa, mà áp dụng cách mã hóa->giải mã->mã hóa. Khi ba khóa giống nhau, hai bước đầu triệt tiêu lẫn nhau, tương đương với chỉ thực hiện một lần mã hóa, do đó có thể tương thích với thuật toán mã hóa DES thông thường. 3DES an toàn hơn DES, nhưng tốc độ xử lý không cao.

### AES

Thuật toán AES（Advanced Encryption Standard）là một thuật toán mã hóa khóa đối xứng tiên tiến hơn, nó sử dụng khóa 128 bit, 192 bit hoặc 256 bit để mã hóa hoặc giải mã dữ liệu, khóa càng dài, độ an toàn càng cao.

AES cũng là một loại mật mã khối (block cipher), độ dài khối chỉ có thể là 128 bit, tức là mỗi khối là 16 byte. Thuật toán mã hóa AES có nhiều chế độ hoạt động（mode of operation）, như：ECB, CBC, OFB, CFB, CTR, XTS, OCB, GCM（chế độ được sử dụng rộng rãi nhất hiện nay）. Các chế độ khác nhau có tham số và quy trình mã hóa khác nhau, nhưng cốt lõi vẫn là thuật toán AES.

Tương tự như DES, một số chế độ hoạt động AES cần đệm cho văn bản gốc không phải là bội số của 128 bit. Tuy nhiên, GCM là chế độ mã hóa có xác thực（AEAD）được xây dựng dựa trên mật mã khối, có thể xử lý văn bản gốc có độ dài bất kỳ, do đó trong Java thường sử dụng `AES/GCM/NoPadding`. GCM vừa cung cấp tính bảo mật vừa kiểm tra tính toàn vẹn của văn bản mã hóa, nhưng yêu cầu IV（Nonce）dưới cùng một khóa không được lặp lại.

Tốc độ của AES nhanh hơn 3DES, và an toàn hơn.

![AES（Advanced Encryption Standard）](https://oss.javaguide.cn/github/javaguide/system-design/security/aes-steps.jpg)

So sánh đơn giản giữa thuật toán DES và AES（hình ảnh từ：[RSA vs. AES Encryption: Key Differences Explained](https://cheapsslweb.com/blog/rsa-vs-aes-encryption)）：

![DES 和 AES 对比](https://oss.javaguide.cn/github/javaguide/system-design/security/des-vs-aes.png)

Ví dụ code triển khai AES-GCM dựa trên Java. Ví dụ này mã hóa IV được sinh ngẫu nhiên mỗi lần cùng với văn bản mã hóa; trong môi trường production, khóa AES nên được sinh và quản lý bởi KMS, HSM hoặc KeyStore, không được nhúng cứng (hardcode) trong mã nguồn：

```java
private static final String AES_TRANSFORMATION = "AES/GCM/NoPadding";
private static final int GCM_IV_LENGTH = 12;
private static final int GCM_TAG_LENGTH = 128;
private static final SecureRandom SECURE_RANDOM = new SecureRandom();

/**
 * Mã hóa
 */
public static String encrypt(String data, SecretKey secretKey) throws GeneralSecurityException {
    byte[] iv = new byte[GCM_IV_LENGTH];
    SECURE_RANDOM.nextBytes(iv);

    Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
    byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

    // IV không cần giữ bí mật, nhưng khi giải mã phải sử dụng cùng một IV, do đó lưu cùng với văn bản mã hóa.
    ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedBytes.length);
    byteBuffer.put(iv);
    byteBuffer.put(encryptedBytes);
    return Base64.getEncoder().encodeToString(byteBuffer.array());
}

/**
 * Giải mã
 */
public static String decrypt(String encryptedData, SecretKey secretKey) throws GeneralSecurityException {
    byte[] input = Base64.getDecoder().decode(encryptedData);
    int tagLengthInBytes = GCM_TAG_LENGTH / Byte.SIZE;
    if (input.length < GCM_IV_LENGTH + tagLengthInBytes) {
        throw new IllegalArgumentException("Invalid encrypted data");
    }

    ByteBuffer byteBuffer = ByteBuffer.wrap(input);
    byte[] iv = new byte[GCM_IV_LENGTH];
    byteBuffer.get(iv);
    byte[] encryptedBytes = new byte[byteBuffer.remaining()];
    byteBuffer.get(encryptedBytes);

    Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
    return new String(decryptedBytes, StandardCharsets.UTF_8);
}

public static void main(String[] args) throws Exception {
    // Chỉ dùng để minh họa. Môi trường production nên lấy khóa từ KMS, HSM hoặc KeyStore.
    KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
    keyGenerator.init(256);
    SecretKey secretKey = keyGenerator.generateKey();

    String originalString = "Java学习 + 面试指南：javaguide.cn";
    String encryptedData = encrypt(originalString, secretKey);
    String decryptedData = decrypt(encryptedData, secretKey);
    System.out.println("Original String: " + originalString);
    System.out.println("AES Encrypted Data : " + encryptedData);
    System.out.println("AES Decrypted Data : " + decryptedData);
}
```

Kết quả：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
AES Encrypted Data : <chuỗi Base64 khác nhau mỗi lần chạy>
AES Decrypted Data : Java学习 + 面试指南：javaguide.cn
```

## Mã hóa bất đối xứng (Asymmetric Encryption)

Thuật toán mã hóa bất đối xứng là thuật toán sử dụng các khóa khác nhau để mã hóa và giải mã, còn gọi là thuật toán mã hóa khóa công khai (public-key encryption). Hai khóa này khác nhau, một cái gọi là khóa công khai (public key), một cái gọi là khóa riêng tư (private key). Khóa công khai có thể công khai cho bất kỳ ai sử dụng, khóa riêng tư thì phải giữ bí mật.

Nếu dùng khóa công khai mã hóa dữ liệu, chỉ có thể dùng khóa riêng tư tương ứng để giải mã. Chữ ký số (digital signature) là một loại thao tác khác：bên gửi sử dụng khóa riêng tư để sinh chữ ký, bên nhận sử dụng khóa công khai để xác minh chữ ký. Đừng hiểu đơn giản chữ ký số là "dùng khóa riêng tư mã hóa, khóa công khai giải mã", dự án thực tế nên sử dụng riêng API mã hóa và API chữ ký.

![非对称加密](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/asymmetric-encryption.png)

Các thuật toán mật mã khóa công khai phổ biến bao gồm RSA và các thuật toán dựa trên đường cong elliptic. Năng lực cụ thể của chúng khác nhau：RSA có thể dùng để mã hóa và chữ ký；DSA chỉ có thể dùng để chữ ký；ECC là tên gọi chung cho một loại thuật toán, bao gồm các phương án khác nhau dùng cho chữ ký hoặc thỏa thuận khóa.

### RSA

Thuật toán RSA（Rivest–Shamir–Adleman algorithm）là một thuật toán mã hóa bất đối xứng dựa trên độ khó của việc phân tích thừa số số lớn, nó cần chọn hai số nguyên tố lớn làm một phần của khóa riêng tư, sau đó tính tích của chúng làm một phần của khóa công khai（tìm hai số nguyên tố lớn tương đối đơn giản, nhưng phân tích thừa số tích của chúng thì cực kỳ khó khăn）. Giới thiệu chi tiết về nguyên lý thuật toán RSA, có thể tham khảo bài viết này：[你真的了解 RSA 加密算法吗？ - 小傅哥](https://www.cnblogs.com/xiaofuge/p/16954187.html).

Độ an toàn của thuật toán RSA phụ thuộc vào độ khó của việc phân tích thừa số số lớn, hiện đã có khóa công khai RSA 512 bit và 768 bit bị phân tích thành công, do đó khuyến nghị sử dụng độ dài khóa 2048 bit trở lên.

Ưu điểm của thuật toán RSA là đơn giản dễ sử dụng, có thể dùng để mã hóa dữ liệu và chữ ký số；nhược điểm là tốc độ tính toán chậm, không phù hợp để mã hóa lượng lớn dữ liệu.

Thuật toán RSA là thuật toán mã hóa bất đối xứng được ứng dụng rộng rãi nhất hiện nay, các giao thức như SSL/TLS, SSH đều sử dụng thuật toán RSA.

![HTTPS 证书签名算法中带RSA 加密的SHA-256 ](https://oss.javaguide.cn/github/javaguide/system-design/security/encryption-algorithms/https-rsa-sha-256.png)

RSA có tốc độ tính toán chậm, độ dài dữ liệu có thể xử lý trực tiếp có hạn, dự án thực tế thường sử dụng mã hóa lai (hybrid encryption)：sinh ngẫu nhiên khóa đối xứng, mã hóa dữ liệu nghiệp vụ qua AES-GCM, rồi mã hóa khóa đối xứng qua RSA-OAEP. Ví dụ dưới đây chỉ minh họa cách dùng RSA-OAEP mã hóa dữ liệu ngắn：

```java
private static final String RSA_ALGORITHM = "RSA";
private static final String RSA_TRANSFORMATION = "RSA/ECB/OAEPPadding";
private static final OAEPParameterSpec OAEP_SHA_256 = new OAEPParameterSpec(
        "SHA-256",
        "MGF1",
        MGF1ParameterSpec.SHA256,
        PSource.PSpecified.DEFAULT
);

/**
 * Sinh cặp khóa RSA
 */
public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
    KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
    // Kích thước khóa 2048 bit
    keyPairGenerator.initialize(2048);
    return keyPairGenerator.generateKeyPair();
}

/**
 * Sử dụng khóa công khai mã hóa dữ liệu
 */
public static String encrypt(String data, PublicKey publicKey) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, publicKey, OAEP_SHA_256);
    byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encryptedData);
}

/**
 * Sử dụng khóa riêng tư giải mã dữ liệu
 */
public static String decrypt(String encryptedData, PrivateKey privateKey) throws Exception {
    byte[] decodedData = Base64.getDecoder().decode(encryptedData);
    Cipher cipher = Cipher.getInstance(RSA_TRANSFORMATION);
    cipher.init(Cipher.DECRYPT_MODE, privateKey, OAEP_SHA_256);
    byte[] decryptedData = cipher.doFinal(decodedData);
    return new String(decryptedData, StandardCharsets.UTF_8);
}

public static void main(String[] args) throws Exception {
    KeyPair keyPair = generateKeyPair();
    PublicKey publicKey = keyPair.getPublic();
    PrivateKey privateKey = keyPair.getPrivate();
    String originalString = "Java学习 + 面试指南：javaguide.cn";
    String encryptedData = encrypt(originalString, publicKey);
    String decryptedData = decrypt(encryptedData, privateKey);
    System.out.println("Original String: " + originalString);
    System.out.println("RSA Encrypted Data : " + encryptedData);
    System.out.println("RSA Decrypted Data : " + decryptedData);
}
```

Kết quả：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
RSA Encrypted Data : <chuỗi Base64 khác nhau mỗi lần chạy>
RSA Decrypted Data : Java学习 + 面试指南：javaguide.cn
```

### DSA

DSA（Digital Signature Algorithm）là một thuật toán chữ ký số, độ an toàn dựa trên bài toán logarit rời rạc. Nó chỉ có thể dùng để sinh và xác minh chữ ký số, không thể dùng để mã hóa dữ liệu. Chữ ký cũng không phải là "khóa riêng tư mã hóa tóm lược, khóa công khai giải mã tóm lược"：bên gửi sử dụng khóa riêng tư và thuật toán chữ ký để sinh chữ ký, bên nhận sử dụng khóa công khai và thuật toán xác minh để phán đoán chữ ký có hợp lệ hay không.

DSA chủ yếu dùng để tương thích với hệ thống cũ (legacy system). NIST FIPS 186-5 đã không còn phê duyệt sử dụng DSA để sinh chữ ký số mới, chỉ cho phép xác minh chữ ký cũ được sinh trước khi tiêu chuẩn này được triển khai. Hệ thống mới thường nên chọn RSA-PSS, ECDSA hoặc EdDSA tùy theo yêu cầu về giao thức và tương thích, và sử dụng API `Signature` do thư viện mật mã trưởng thành cung cấp.

## Tổng kết

Bài viết này đã giới thiệu ba loại thuật toán mã hóa：thuật toán băm, thuật toán mã hóa đối xứng và thuật toán mã hóa bất đối xứng.

- Thuật toán băm là một kỹ thuật sử dụng phương pháp toán học để tạo ra một định danh duy nhất có độ dài cố định cho dữ liệu, có thể dùng để xác minh tính toàn vẹn và nhất quán của dữ liệu, các thuật toán băm phổ biến có MD, SHA, MAC v.v.
- Thuật toán mã hóa đối xứng là thuật toán sử dụng cùng một khóa để mã hóa và giải mã, có thể dùng để bảo vệ tính an toàn và bảo mật của dữ liệu, các thuật toán mã hóa đối xứng phổ biến có DES, 3DES, AES v.v.
- Mật mã khóa công khai sử dụng cặp khóa công khai và khóa riêng tư, có thể hỗ trợ mã hóa, chữ ký số hoặc thỏa thuận khóa, nhưng năng lực cụ thể phụ thuộc vào thuật toán. Ví dụ RSA có thể dùng để mã hóa và chữ ký, DSA chỉ có thể dùng để chữ ký.

## Tham khảo

- NIST SP 800-38D - Recommendation for Block Cipher Modes of Operation: GCM and GMAC：<https://csrc.nist.gov/pubs/sp/800/38/d/final>
- NIST FIPS 186-5 - Digital Signature Standard：<https://csrc.nist.gov/pubs/fips/186-5/final>
- Java `Cipher` API：<https://docs.oracle.com/en/java/javase/11/docs/api/java.base/javax/crypto/Cipher.html>
- 深入理解完美哈希 - 腾讯技术工程：<https://mp.weixin.qq.com/s/M8Wcj8sZ7UF1CMr887Puog>
- 写给开发人员的实用密码学（二）—— 哈希函数：<https://thiscute.world/posts/practical-cryptography-basics-2-hash/>
- 奇妙的安全旅行之 DSA 算法：<https://zhuanlan.zhihu.com/p/347025157>
- AES-GCM 加密简介：<https://juejin.cn/post/6844904122676690951>
- Java AES 256 GCM Encryption and Decryption Example | JCE Unlimited Strength：<https://www.javainterviewpoint.com/java-aes-256-gcm-encryption-and-decryption/>

<!-- @include: @article-footer.snippet.md -->