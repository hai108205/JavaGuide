---
title: Hướng dẫn Viết CV cho Lập trình viên
description: "Hướng dẫn viết CV cho lập trình viên: Bắt đầu từ logic sàng lọc, giải thích rõ cấu trúc CV, cách viết kinh nghiệm dự án và mô tả kỹ năng, cung cấp mẫu CV và gợi ý tránh lỗi thường gặp, giúp bạn nâng cao tỷ lệ vượt qua vòng sàng lọc CV và để người phỏng vấn khai thác tốt hơn điểm mạnh của bạn."
category: 面试准备
icon: "mdi:account-tie-outline"
head:
  - - meta
    - name: keywords
      content: 程序员简历,Java简历,简历优化,项目经历写法,简历模板,校招简历,社招简历,面试准备
---

::: tip Gợi ý thân thiện
Bài viết này được trích từ **[《Java 面试指北》](../zhuanlan/java-mian-shi-zhi-bei.md)**. Đây là một cuốn sách nhỏ hướng dẫn bạn cách chuẩn bị phỏng vấn hiệu quả hơn, bao gồm các câu hỏi "bát cổ văn" phổ biến (thiết kế hệ thống, các framework thông dụng, hệ thống phân tán, high concurrency...), các bài phỏng vấn chất lượng và nhiều nội dung khác.
:::

## Lời mở đầu

Một bản CV tốt có thể đóng vai trò rất quan trọng trong toàn bộ quá trình ứng tuyển và phỏng vấn.

**Tại sao nói CV rất quan trọng?** Chúng ta có thể nói từ những điểm sau:

**1. CV giống như bộ mặt của chúng ta, nó quyết định ở mức độ rất lớn liệu bạn có nhận được cơ hội phỏng vấn hay không.**

- Nếu bạn ứng tuyển online, CV của bạn chắc chắn sẽ phải qua sàng lọc của HR, một bản CV HR có thể chỉ dành khoảng 10 giây để xem lướt, sau đó quyết định bạn có thể vào vòng phỏng vấn hay không.
- Nếu bạn được giới thiệu nội bộ (referral), nếu CV của bạn không có gì ưu thế, thì dù người giới thiệu nội bộ có tận tâm đến đâu cũng bất lực.

Ngoài ra, ngay cả khi bạn đã vượt qua vòng sàng lọc đầu tiên để có được cơ hội phỏng vấn, trong các buổi phỏng vấn sau đó, người phỏng vấn cũng sẽ dựa vào CV của bạn để phán đoán liệu bạn có xứng đáng để họ dành nhiều thời gian phỏng vấn hay không.

**2. Nội dung trên CV quyết định ở mức độ lớn trọng tâm đặt câu hỏi của người phỏng vấn.**

- Thông thường những gì bạn ghi trong CV là sẽ biết mới được hỏi đến (Java cơ bản, Collection, Concurrency, MySQL, Redis, Spring, Spring Boot thì coi như là mỗi người đều bị hỏi), ví dụ bạn ghi là thành thạo Redis, thì người phỏng vấn có khả năng rất cao sẽ hỏi bạn một số câu hỏi về Redis, lại ví dụ bạn ghi bạn đã sử dụng Message Queue trong dự án, thì người phỏng vấn có khả năng cao sẽ hỏi rất nhiều câu hỏi liên quan đến Message Queue.
- Mức độ thành thạo kỹ năng cũng quyết định ở mức độ lớn độ sâu câu hỏi của người phỏng vấn.

Trong điều kiện không phóng đại năng lực bản thân, việc viết ra một bản CV tốt cũng là một năng lực rất tuyệt vời. Thông thường, những người có năng lực kỹ thuật và năng lực học tập tốt, thì CV viết ra cũng khá tốt!

## Mẫu CV

Phong cách của CV thực sự rất rất rất quan trọng!!! Nếu phong cách CV của bạn xấu đến mức không có nổi bạn bè, thì người phỏng vấn thực sự không có hứng thú để xem tiếp. Nỗi đau khổ khi phải xử lý hàng trăm bản CV mỗi ngày, bạn không hiểu đâu!

Ở đây, tôi khuyên mọi người sử dụng cú pháp Markdown để viết CV, sau đó chuyển định dạng Markdown sang định dạng PDF rồi mới gửi đi ứng tuyển. Nếu bạn chưa quen với cú pháp Markdown, có thể dành nửa tiếng để xem qua hướng dẫn cú pháp Markdown: <http://www.markdown.cn/>.

Dưới đây là một số mẫu CV khá tốt mà tôi đã sưu tầm được:

- Bộ sưu tập mẫu CV phù hợp cho tiếng Trung (khuyên dùng, mã nguồn mở miễn phí): <https://github.com/dyweb/awesome-resume-for-chinese>
- Muji Resume (khuyên dùng, miễn phí một phần) : <https://www.mujicv.com/>
- EasyCV (khuyên dùng, miễn phí một phần): <https://easycv.cn/>
- Polebrief Resume (miễn phí): <https://www.polebrief.com/index>
- Công cụ Dàn trang CV Markdown (mã nguồn mở miễn phí): <https://resume.mdnice.com/>
- Zhanzhang Resume (trả phí, hỗ trợ AI tạo): <https://jianli.chinaz.com/>
- Mẫu CV tùy chỉnh typora+markdown+css : <https://github.com/Snailclimb/typora-markdown-resume>
- Wondercv (một phần trả phí) : <https://www.wondercv.com/>

Các mẫu CV trên đây phần lớn chỉ có 1 trang, rất khó để thể hiện đủ lượng thông tin. Nếu bạn không phải là cao thủ đỉnh cao (ví dụ như đạt giải ACM), tôi khuyên bạn vẫn nên cố gắng viết thêm một chút nội dung có thể làm nổi bật năng lực của bản thân (ứng viên tuyển trường trong vòng 2 trang, ứng viên tuyển xã hội trong vòng 3 trang, nhớ tinh gọn ngôn ngữ, đừng quá nhiều lời vô nghĩa).

Tổng kết thêm một vài **lưu ý về dàn trang CV**:

- Cố gắng đơn giản, đừng quá màu mè.
- Tên thuật ngữ kỹ thuật tốt nhất nên viết hoa đúng chuẩn, ví dụ như java->Java, spring boot -> Spring Boot. Chuyện này mặc dù có một số người phỏng vấn không để ý, nhưng rất nhiều người phỏng vấn sẽ để ý đến chi tiết này.
- Giữa tiếng Trung và số/tiếng Anh nên thêm dấu cách thì sẽ nhìn dễ chịu hơn một chút.

Ngoài ra, trong Cộng đồng Tri thức còn có mẫu CV thực tế để tham khảo, địa chỉ: <https://t.zsxq.com/12ypxGNzU> (Cần tham gia [Cộng đồng Tri thức](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) để nhận).

![](https://oss.javaguide.cn/javamianshizhibei/image-20230918073550606.png)

## Nội dung CV

### Thông tin Cá nhân

- Cơ bản nhất: Tên (tên trên chứng minh thư), tuổi, số điện thoại, quê quán, thông tin liên lạc, địa chỉ email
- Điểm cộng tiềm năng: Địa chỉ Github, địa chỉ blog (nếu blog kỹ thuật và Github không có nội dung gì, thì đừng ghi)

Ví dụ:

![](https://oss.javaguide.cn/zhishixingqiu/20210428212337599.png)

**CV có nên để ảnh không?** Rất nhiều người khi viết CV đều có câu hỏi này.

Thực ra để hay không đều được, ảnh hưởng không lớn, hoàn toàn không cần để ý đến vấn đề này. Trừ khi, vị trí bạn ứng tuyển yêu cầu rõ ràng phải để ảnh. Tuy nhiên, nếu muốn để ảnh, đừng để ảnh đời thường, mà nên để ảnh chính quy hơn như ảnh thẻ.

### Mục tiêu Công việc

Bạn muốn ứng tuyển vị trí gì, mong muốn làm ở thành phố nào. Ngoài ra, bạn cũng có thể đưa mục tiêu công việc vào phần thông tin cá nhân để viết.

Ví dụ:

![](https://oss.javaguide.cn/zhishixingqiu/20210428212410288.png)

### Học vấn

Học vấn cũng không thể thiếu. Thông qua phần giới thiệu học vấn, bạn phải đảm bảo người phỏng vấn có thể biết được bằng cấp, chuyên ngành, trường tốt nghiệp và ngày tốt nghiệp của bạn.

Ví dụ:

> Đại học Bắc Kinh Thạc sĩ, Kỹ thuật Phần mềm 2019.09 - 2022.01
> Đại học Hồ Nam Cử nhân, Hóa học Ứng dụng 2015.09 ~ 2019.06

### Kỹ năng Chuyên môn

Trước tiên hãy tự hỏi bản thân bạn biết gì, sau đó xem công ty bạn mong muốn cần gì. Thông thường HR có thể không hiểu lắm về kỹ thuật, nên khi sàng lọc CV họ có thể chỉ nhìn vào các từ khóa trong phần kỹ năng chuyên môn của bạn. Đối với những kỹ năng công ty yêu cầu mà bạn chưa biết, bạn có thể dành vài ngày học tập, sau đó có thể ghi trong CV là bạn có hiểu biết (了解) về kỹ năng đó.

Dưới đây là một bản danh sách kỹ năng phát triển Java Backend mới nhất, bạn có thể điều chỉnh linh động dựa trên tình hình bản thân và yêu cầu tuyển dụng của vị trí, tư tưởng cốt lõi là cố gắng đáp ứng tất cả các yêu cầu kỹ năng của vị trí tuyển dụng.

![Mẫu Kỹ năng Java Backend](https://oss.javaguide.cn/zhishixingqiu/jinengmuban.png)

Ở đây tôi xin để riêng một phần giới thiệu kỹ năng của một bạn mà tôi đã từng xem, chúng ta cùng tìm vấn đề.

![](https://oss.javaguide.cn/zhishixingqiu/up-a58d644340f8ce5cd32f9963f003abe4233.png)

Các vấn đề tồn tại trong phần giới thiệu kỹ năng ở hình trên:

- Tên thuật ngữ kỹ thuật tốt nhất nên viết hoa đúng chuẩn, ví dụ như java->Java, spring boot -> Spring Boot. Chuyện này mặc dù có một số người phỏng vấn không để ý, nhưng rất nhiều người phỏng vấn sẽ để ý đến chi tiết này.
- Giới thiệu kỹ năng quá tạp nham, không có điểm sáng. Không cần phải là người toàn năng, chỉ cần làm tốt một lĩnh vực nào đó là được!
- Mức độ thành thạo đối với một số kỹ năng phát triển Java Backend như Spring Boot chỉ ở mức "hiểu biết" (了解), không thể đáp ứng yêu cầu của doanh nghiệp.

### Kinh nghiệm Thực tập / Kinh nghiệm Làm việc (Quan trọng)

Kinh nghiệm làm việc dành cho ứng viên tuyển xã hội, kinh nghiệm thực tập dành cho ứng viên tuyển trường.

Kinh nghiệm làm việc nên được giới thiệu theo thứ tự thời gian đảo ngược. Cả kinh nghiệm thực tập và kinh nghiệm làm việc đều cần nêu bật một cách đơn giản những gì bạn đã làm chính trong thời gian làm việc.

Ví dụ:

> **Công ty XXX (Tháng X năm 201X ~ Tháng X năm 201X)**
>
> - **Vị trí**: Kỹ sư Phát triển Java Backend
> - **Nội dung Công việc**: Chủ yếu phụ trách XXX

### Kinh nghiệm Dự án (Quan trọng)

Có một hai kinh nghiệm dự án trên CV là chuyện bình thường, nhưng thực sự có thể thể hiện kinh nghiệm dự án một cách tốt cho người phỏng vấn thì rất ít.

Phần giới thiệu kinh nghiệm dự án của rất nhiều người tìm việc đều gặp các vấn đề như quá dài dòng, quá đơn giản, không làm nổi bật điểm sáng.

Mẫu giới thiệu kinh nghiệm dự án như sau:

> Tên dự án (cỡ chữ lớn hơn một chút)
>
> 2017-05~2018-06 Kỹ sư Phát triển Java Backend Taobao
>
> - **Mô tả Dự án**: Mô tả đơn giản dự án làm gì.
> - **Công nghệ Sử dụng (Tech Stack)**: Sử dụng công nghệ gì (ví dụ Spring Boot + MySQL + Redis + Mybatis-plus + Spring Security + Oauth2)
> - **Nội dung Công việc / Trách nhiệm Cá nhân**: Mô tả đơn giản bạn đã làm gì, giải quyết vấn đề gì, mang lại cải thiện thực chất gì. Làm nổi bật năng lực của bạn, đừng kể lể quá nhạt nhẽo.
> - **Thu hoạch Cá nhân (Tùy chọn)**: Từ dự án này bạn đã học được những gì, sử dụng những công nghệ gì, học được cách sử dụng những công nghệ mới nào. Thông thường có thể không cần viết phần thu hoạch cá nhân, vì những gì bạn đã viết trong phần giới thiệu trách nhiệm cá nhân đã thể hiện được thu hoạch chính của bạn rồi.
> - **Kết quả Dự án (Tùy chọn)**: Mô tả đơn giản dự án này đã đạt được thành tích gì.

**1. Kinh nghiệm dự án nên làm nổi bật bạn đã làm gì, tóm tắt đơn giản tình hình cơ bản của dự án.**

Phần giới thiệu dự án cố gắng nén gọn trong hai dòng, không cần giới thiệu quá nhiều, nhưng cũng đừng chỉ vài chữ là xong phần giới thiệu.

Ngoài ra, phần thu hoạch cá nhân và kết quả dự án đều là tùy chọn, nếu chọn viết, cũng đừng dành quá nhiều dung lượng, hãy nhớ trọng tâm của bạn là giới thiệu nội dung công việc / trách nhiệm cá nhân.

**2. Kiến trúc kỹ thuật chỉ cần viết tên công nghệ là được, đừng giới thiệu công nghệ đó làm gì nữa, vô nghĩa, thuộc dạng giới thiệu không hiệu quả.**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/46c92fbc5160e65dd85c451143177144.png)

**3. Cố gắng giảm giới thiệu trách nhiệm cá nhân thuần túy về nghiệp vụ, không thân thiện cho phỏng vấn. Hãy cố gắng khai thác thêm điểm sáng (6~8 mục giới thiệu trách nhiệm cá nhân là đủ, làm tốt việc sàng lọc), tốt nhất có thể thể hiện năng lực tổng hợp của bạn, ví dụ bạn đã điều phối các thành viên trong nhóm dự án hợp tác phát triển như thế nào hoặc khi gặp một vấn đề nan giải bạn đã giải quyết ra sao, hoặc bạn đã tối ưu hiệu năng của một mô-đun nào đó trong dự án này.**

Ngay cả khi không phải mô-đun chức năng do bạn làm hay vấn đề do bạn giải quyết, chỉ cần bạn hiểu rõ và nắm vững là có thể mang ra dùng cho bản thân, tô vẽ thêm một chút là được!

Ví dụ như điểm sáng về hướng tối ưu hiệu năng, trước khi phỏng vấn cũng tương đối dễ chuẩn bị, nhưng cũng đừng để toàn bộ đều liên quan đến tối ưu hiệu năng, như vậy cũng coi là một thái cực.

Ngoài ra, kết quả đạt được từ tối ưu kỹ thuật hãy cố gắng định lượng hóa:

- Sử dụng công nghệ xxx giải quyết vấn đề xxx, QPS hệ thống tăng từ xxx lên xxx.
- Sử dụng công nghệ xxx tối ưu API xxx, QPS hệ thống tăng từ xxx lên xxx.
- Sử dụng công nghệ xxx giải quyết vấn đề xxx, tốc độ truy vấn được tối ưu xxx, QPS hệ thống đạt 10w+.
- Sử dụng công nghệ xxx tối ưu mô-đun xxx, thời gian phản hồi giảm từ 2s xuống 0.2s.
- ……

Ví dụ giới thiệu trách nhiệm cá nhân (ở đây chỉ là ví dụ, đừng sao chép nguyên xi, hãy kết hợp với kinh nghiệm dự án của bản thân để tự viết, nếu không khi phỏng vấn dễ bị hỏi ngã ngựa):

- Dựa trên Spring Cloud Gateway + Spring Security OAuth2 + JWT thực hiện xác thực và ủy quyền thống nhất cho microservice, sử dụng mô hình phân quyền RBAC thực hiện kiểm soát quyền động.
- Tham gia phát triển mô-đun đơn hàng của dự án, phụ trách các chức năng tạo, xóa, truy vấn đơn hàng, dựa trên Spring State Machine thực hiện luân chuyển trạng thái đơn hàng.
- Đưa Elasticsearch vào các kịch bản tìm kiếm hàng hóa và đơn hàng, đồng thời thực hiện chức năng gợi ý sản phẩm liên quan và gợi ý tìm kiếm.
- Tích hợp Canal + RabbitMQ để đồng bộ dữ liệu gia tăng MySQL (như dữ liệu hàng hóa, đơn hàng) vào Elasticsearch.
- Sử dụng plugin Delay Queue chính thức của RabbitMQ để thực hiện các kịch bản tác vụ trì hoãn như tự động hủy đơn hàng quá hạn, nhắc nhở hết hạn coupon, xử lý hoàn tiền.
- Đưa RabbitMQ vào hệ thống push thông báo để thực hiện xử lý bất đồng bộ, cắt đỉnh lấp đáy (peak shaving & valley filling) và giải ghép dịch vụ (service decoupling), tốc độ push tối đa 10w/s, lượng thông báo tối đa một ngày 20 triệu.
- Sử dụng công cụ MAT phân tích file dump để giải quyết vấn đề số lượng lớn cảnh báo timeout dịch vụ sau khi phiên bản mới của dịch vụ quảng cáo được triển khai.
- Điều tra và giải quyết vấn đề deadlock trong mô-đun trừ phí do tác vụ cha trừ phí và tác vụ con chống gian lận sử dụng chung một Thread Pool.
- Dựa trên EasyExcel thực hiện xuất nhập dữ liệu quảng cáo, thông qua MyBatis batch insert dữ liệu, dựa trên bảng tác vụ thực hiện bất đồng bộ.
- Phụ trách phát triển mô-đun thống kê người dùng, sử dụng CompletableFuture để tải song song dữ liệu của mô-đun thống kê người dùng backend, thời gian phản hồi trung bình giảm từ 3.5s xuống 1s.
- Dựa trên Sentinel thực hiện giới hạn tần suất (rate limiting), giáng cấp (degradation) cho các kịch bản cốt lõi (như đăng nhập đăng ký, truy vấn địa chỉ giao hàng), bảo vệ hệ thống, nâng cao trải nghiệm người dùng.
- Dữ liệu nóng (như trang chủ, blog nổi bật) sử dụng cache hai tầng Redis+Caffeine, giải quyết vấn đề cache breakdown và cache penetration, tốc độ truy vấn ở mức mili giây, QPS 30w+.
- Sử dụng CompletableFuture tối ưu mô-đun truy vấn giỏ hàng, tiến hành điều phối (orchestration) các lời gọi RPC bất đồng bộ như lấy thông tin người dùng, chi tiết hàng hóa, thông tin coupon, thời gian phản hồi giảm từ 2s xuống 0.2s.
- Dựng dịch vụ EasyMock để mô phỏng API của nền tảng bên thứ ba, thuận tiện cho việc kết nối API trong tình huống cách ly mạng.
- Dựa trên SkyWalking + Elasticsearch dựng hệ thống theo dõi liên kết phân tán (distributed tracing) thực hiện giám sát toàn bộ liên kết.

**4. Nếu bạn cảm thấy công nghệ của dự án mình tương đối lạc hậu, có thể tự mình cải tiến sau giờ làm. Quan trọng là làm cho dự án có điểm sáng, bằng cách nào thì không quan trọng.**

Phần kinh nghiệm dự án này rất quan trọng đối với CV, [《Java 面试指北》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) trong phần chuẩn bị phỏng vấn có mấy bài viết về tối ưu kinh nghiệm dự án, khuyên bạn nên đọc kỹ, chắc chắn sẽ có ích cho bạn.

![](https://oss.javaguide.cn/zhishixingqiu/4e11dbc842054e53ad6c5f0445023eb5~tplv-k3u1fbpfcp-zoom-1.png)

**5. Tránh việc giới thiệu trách nhiệm cá nhân đều xoay quanh một điểm kỹ thuật duy nhất, rất không nên.**

![](https://oss.javaguide.cn/zhishixingqiu/image-20230424222513028.png)

**6. Tránh mô tả mơ hồ, giới thiệu phải cụ thể (kỹ thuật + kịch bản + hiệu quả), cũng phải chú ý tinh gọn ngôn ngữ (tránh nhồi nhét từ ngữ kỹ thuật, lược bỏ những mô tả không cần thiết).**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/project-experience-avoiding-ambiguity-descriptio.png)

### Giải thưởng (Tùy chọn)

Nếu bạn có kinh nghiệm đạt giải trong các cuộc thi có uy tín cao (ví dụ ACM, cuộc thi Alibaba Tianchi), phần giải thưởng này nhất định phải viết vào! Hơn nữa, bạn còn có thể đưa phần giải thưởng này lên vị trí nổi bật hơn ở phía trước.

### Hoạt động Ngoại khóa (Tùy chọn)

Nếu có hoạt động ngoại khóa nổi bật thì viết đơn giản, không có thì không viết!

### Tự Đánh giá

**Tự đánh giá chính là sự lý giải về bản thân, nhất định phải dùng ngôn ngữ ngắn gọn để làm nổi bật đặc điểm và ưu thế của bạn, tránh nói lời vô nghĩa!** Những thứ hư ảo như cần cù, chịu khổ thì đừng có nói nữa, người phỏng vấn nhìn thấy kiểu tự đánh giá này là phát ngán.

Chúng ta có thể viết tự đánh giá từ những góc độ sau:

- Năng lực viết tài liệu, năng lực học tập, năng lực giao tiếp, năng lực hợp tác nhóm
- Thái độ đối với công việc và tinh thần trách nhiệm cá nhân
- Áp lực công việc có thể chịu đựng và thái độ đối với khó khăn
- Sự theo đuổi công nghệ, theo đuổi chất lượng code
- Kinh nghiệm phát triển hoặc bảo trì hệ thống phân tán, high concurrency

Liệt kê 3 ví dụ thực tế:

- Năng lực học tập khá tốt, năm 3 đại học khi tham gia Cuộc thi Thiết kế Phần mềm Quốc gia đã nhanh chóng làm quen Python và viết một hệ thống crawler có thể cấu hình hóa.
- Có tinh thần hợp tác nhóm, năm 3 đại học khi tham gia Cuộc thi Thiết kế Phần mềm Quốc gia đã điều phối 5 bạn phát triển trong nhóm dự án, và hỗ trợ các bạn gặp khó khăn về coding, cuối cùng thuận lợi hoàn thành chức năng cốt lõi của dự án trong vòng 1 tháng.
- Kinh nghiệm dự án phong phú, trong thời gian học đại học đã chủ trì phát triển nhiều dự án cấp doanh nghiệp.

## Phương pháp STAR và Phương pháp FAB

### Phương pháp STAR (Situation Task Action Result)

Tôi tin rằng mọi người chắc chắn đã từng nghe nói đến phương pháp STAR. Đối với phỏng vấn, bạn có thể áp dụng phương pháp này vào CV của mình và trong quá trình giao tiếp với người phỏng vấn.

Phương pháp STAR được tạo thành từ 4 từ sau (tên của phương pháp STAR được lấy từ chữ cái đầu của chúng):

- **Situation:** Tình huống. Sự việc xảy ra trong hoàn cảnh nào?
- **Task:** Nhiệm vụ. Nhiệm vụ của bạn là gì?
- **Action:** Hành động. Bạn đã làm gì?
- **Result:** Kết quả. Kết quả cuối cùng ra sao?

### Phương pháp FAB (Feature Advantage Benefit)

Ngoài phương pháp STAR, bạn còn cần hiểu một phương pháp thường được sử dụng trong ngành bán hàng gọi là phương pháp FAB.

Phương pháp FAB được tạo thành từ 3 từ sau (tên của phương pháp FAB được lấy từ chữ cái đầu của chúng):

- **Feature:** Đặc điểm / ưu thế của bạn là gì?
- **Advantage:** Tốt hơn người khác ở những điểm nào;
- **Benefit:** Nếu tuyển dụng bạn, nhà tuyển dụng sẽ nhận được lợi ích gì.

Nói một cách đơn giản, **phương pháp FAB chủ yếu là để người phỏng vấn biết được ưu thế của bạn và giá trị bạn có thể mang lại cho công ty.**

## Gợi ý

### Tránh số trang quá nhiều

Tinh gọn cách trình bày, làm nổi bật điểm sáng. CV tuyển trường khuyên không nên vượt quá 2 trang, CV tuyển xã hội khuyên không nên vượt quá 3 trang. Nếu nội dung quá nhiều, không cần nhất thiết phải nén vào một trang, giữ cho dàn trang sạch sẽ gọn gàng là được.

Tôi đã xem hàng nghìn bản CV, có một số ít bạn có CV dài gần 10 trang, khiến tôi phát hoảng.

![CV quá nhiều trang](https://oss.javaguide.cn/zhishixingqiu/image-20230508223646164.png)

### Tránh ngữ nghĩa mơ hồ

Cố gắng tránh cách diễn đạt chủ quan, bớt sử dụng những tính từ mơ hồ về ngữ nghĩa. Cách diễn đạt phải ngắn gọn rõ ràng, cấu trúc CV phải rõ ràng.

Ví dụ:

- Cách diễn đạt không tốt: Tôi đã đóng một vai trò rất quan trọng trong nhóm.
- Cách diễn đạt tốt: Tôi với tư cách là trưởng nhóm kỹ thuật backend, đã lãnh đạo nhóm hoàn thành thiết kế và phát triển dự án backend.

### Chú ý phong cách CV

Phong cách CV cũng quan trọng không kém, nhất định phải chú ý! Không cần theo đuổi sự màu mè, nhưng phải cố gắng đảm bảo cấu trúc rõ ràng và dễ đọc.

### Khác

- Nhất định phải sử dụng định dạng PDF để gửi, đừng dùng Word hay các định dạng khác để gửi. Đây là điều cơ bản nhất!
- Những thứ không biết thì đừng viết vào CV. Chú ý tính xác thực của CV, tô vẽ thêm một chút cho phù hợp thì không có vấn đề gì.
- Kinh nghiệm làm việc nên sử dụng thứ tự thời gian đảo ngược để giới thiệu, kinh nghiệm thực tập nên để cái có giá trị nhất lên đầu.
- Thể hiện kinh nghiệm dự án của bạn một cách hoàn hảo là rất quan trọng, trọng tâm là làm nổi bật bạn đã làm gì (khai thác điểm sáng), chứ không phải giới thiệu dự án làm gì.
- Kinh nghiệm dự án nên sắp xếp theo thứ tự thời gian đảo ngược, ngoài ra kinh nghiệm dự án không cốt ở số lượng (chọn lọc 2~3 cái là đủ), mà cốt ở có điểm sáng.
- Trong quá trình chuẩn bị phỏng vấn nên lấy những thứ bạn viết trên CV làm trọng tâm, đặc biệt là phần kinh nghiệm dự án và giới thiệu kỹ năng.
- Phỏng vấn và công việc là hai chuyện khác nhau, người thông minh sẽ dẫn dắt người phỏng vấn vào lĩnh vực mình sở trường, những người khác thì bị người phỏng vấn dắt mũi. Tuy nói phỏng vấn và công việc là hai chuyện khác nhau, nhưng bạn muốn có được offer ưng ý, thì thực lực bản thân bạn phải mạnh.

## Chỉnh sửa CV

Đến nay, tôi đã giúp ít nhất **6000+** thành viên cộng đồng cung cấp dịch vụ chỉnh sửa CV miễn phí. Do năng lực cá nhân có hạn, việc chỉnh sửa CV chỉ giới hạn cho độc giả đã tham gia Cộng đồng Tri thức, nếu cần giúp xem CV, có thể tham gia [**Cộng đồng Tri thức Chính thức JavaGuide**](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html#%E7%AE%80%E5%8E%86%E4%BF%AE%E6%94%B9) (nhấn vào liên kết để xem giới thiệu chi tiết).

![img](https://oss.javaguide.cn/xingqiu/%E7%AE%80%E5%8E%86%E4%BF%AE%E6%94%B92.jpg)

Mặc dù chi phí chỉ bằng một phần trăm các lớp đào tạo / trại huấn luyện, nhưng chất lượng nội dung trong Cộng đồng Tri thức cao hơn, dịch vụ cung cấp cũng toàn diện hơn, rất phù hợp cho các bạn đang chuẩn bị phỏng vấn Java và học Java.

Dưới đây là một phần dịch vụ mà Cộng đồng cung cấp (nhấn vào hình ảnh bên dưới để xem giới thiệu chi tiết về Cộng đồng Tri thức):

[![Dịch vụ Cộng đồng](https://oss.javaguide.cn/xingqiu/xingqiufuwu.png)](../about-the-author/zhishixingqiu-two-years.md)

Đây là một mã giảm giá độc quyền có thời hạn:

![Mã giảm giá 30 tệ Cộng đồng Tri thức](https://oss.javaguide.cn/xingqiu/xingqiuyouhuijuan-30.jpg)
