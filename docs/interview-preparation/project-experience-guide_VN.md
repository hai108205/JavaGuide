---
title: Hướng dẫn Kinh nghiệm Dự án
description: Hướng dẫn kinh nghiệm dự án: Dành cho những người tìm việc chưa có dự án hoặc dự án còn đơn điệu, đưa ra phương pháp và gợi ý lựa chọn để có được kinh nghiệm dự án thực chiến, đồng thời giải thích rõ cách tạo điểm sáng cho dự án, cách phục hồi và trình bày, nhằm nâng cao sức cạnh tranh của CV và phỏng vấn.
category: 面试准备
icon: "mdi:projector-screen-outline"
head:
  - - meta
    - name: keywords
      content: 项目经验,校招项目,实战项目,项目亮点,简历项目描述,后端项目,面试项目准备,项目复盘
---

::: tip Gợi ý thân thiện
Bài viết này được trích từ **[《Java 面试指北》](../zhuanlan/java-mian-shi-zhi-bei.md)**. Đây là một chuyên mục hướng dẫn bạn cách chuẩn bị phỏng vấn hiệu quả hơn, nội dung bổ sung cho JavaGuide, bao gồm các câu hỏi "bát cổ văn" phổ biến (thiết kế hệ thống, các framework thông dụng, hệ thống phân tán, high concurrency...), các bài phỏng vấn chất lượng và nhiều nội dung khác.
:::

## Không có kinh nghiệm dự án thì phải làm sao?

Không có kinh nghiệm dự án là vấn đề mà phần lớn sinh viên mới tốt nghiệp sẽ gặp phải. Thậm chí có rất nhiều lập trình viên đã có kinh nghiệm làm việc, nhưng không hài lòng với dự án mình làm ở công ty, cũng muốn tìm một dự án có hàm lượng kỹ thuật cao hơn để thực hiện.

Tôi xin nêu một vài cách mà tôi cho là khá đáng tin cậy để có được kinh nghiệm dự án, hy vọng có thể truyền cảm hứng cho bạn.

### Video/Chuyên mục Dự án Thực chiến

Tìm kiếm một video hoặc chuyên mục dự án thực chiến trên mạng phù hợp với năng lực và nhu cầu tìm việc của bạn, làm theo cùng với giảng viên.

Bạn có thể tìm được video/chuyên mục dự án thực chiến phù hợp với mình thông qua các kênh như Muke, Bilibili, Lagou, GeekTime, các trung tâm đào tạo (như Heima, Shangguigu).

![Khóa học Thực chiến Muke](https://oss.javaguide.cn/javamianshizhibei/mukewangzhiazhanke.png)

Hãy cố gắng chọn một dự án phù hợp với bản thân, không nhất thiết phải làm dự án phân tán/microservice. Đối với đại đa số các bạn, có thể làm tốt một dự án đơn khối (monolithic) đã là rất tốt rồi.

Tôi đã phỏng vấn rất nhiều ứng viên, CV ghi là có kinh nghiệm dự án microservice, kết quả hỏi bừa hai câu là biết ngay không phải tự mình làm hoặc khi làm không hề suy nghĩ nghiêm túc. Tình huống này sẽ để lại cho tôi ấn tượng rất không tốt.

Trong phần "Chuẩn bị Phỏng vấn" của **[《Java 面试指北》](../zhuanlan/java-mian-shi-zhi-bei.md)**, tôi cũng đã nói:

> Cá nhân tôi cho rằng cũng không nhất thiết phải làm dự án microservice hay phân tán, chưa chắc đã có lợi cho phỏng vấn của bạn. Dự án microservice hay phân tán liên quan đến quá nhiều kiến thức, người bình thường rất khó nắm vững hết. Hơn nữa, loại dự án này thực ra hơi quá sức đối với sinh viên mới ra trường. Ngay cả khi bạn làm ra được, nhiều người phỏng vấn cũng sẽ cho rằng không phải do bạn độc lập hoàn thành.
>
> Thực ra, bạn có thể làm một dự án đơn khối đến mức cực hạn cũng rất tốt, đối với việc nâng cao năng lực cá nhân không hề thua kém gì làm dự án microservice hay phân tán. Làm thế nào để đạt đến cực hạn? Chất lượng code thì không cần nhắc ở đây nữa, quan trọng hơn là bạn phải cố gắng làm cho dự án của mình có một số điểm sáng (ví dụ như bạn đã cải thiện hiệu năng dự án như thế nào, giải quyết một điểm đau trong dự án ra sao), kết quả đạt được từ kinh nghiệm dự án hãy cố gắng định lượng hóa, ví dụ tôi đã sử dụng công nghệ xxx giải quyết vấn đề xxx, QPS hệ thống tăng từ xxx lên xxx.

Trong quá trình làm theo giảng viên, bạn nhất định phải có suy nghĩ của riêng mình, đừng chỉ hời hợt qua loa. Đối với nhiều điểm kiến thức, phần giải thích của người khác có thể chỉ đủ để đáp ứng dự án, nếu bạn muốn biết nhiều hơn, thì đối với những điểm kiến thức quan trọng, bạn phải tự mình học cách đào sâu.

### Dự án Mã nguồn Mở Thực chiến

Trên GitHub hoặc Gitee có rất nhiều dự án thực chiến, bạn có thể chọn một dự án để nghiên cứu. Để hiểu sâu hơn về dự án đó, trên cơ sở hiểu code gốc, bạn có thể cải tiến hoặc thêm chức năng cho dự án gốc.

Bạn có thể tham khảo các dự án mã nguồn mở thực chiến được giới thiệu trên [Dự án Thực chiến Mã nguồn Mở Chất lượng Cao Java](https://javaguide.cn/open-source-project/practical-project.html "Java 优质开源实战项目"), chất lượng đều rất cao, loại hình dự án cũng khá toàn diện, bao gồm hệ thống blog/diễn đàn, hệ thống thi/luyện tập, hệ thống thương mại điện tử, hệ thống quản lý phân quyền, scaffold phát triển nhanh và các loại bánh xe (wheels).

![Dự án Thực chiến Mã nguồn Mở Chất lượng Cao Java](https://oss.javaguide.cn/javamianshizhibei/javaguide-practical-project.png)

Nhất định phải nhớ: **Không chỉ làm, mà còn phải cải tiến, cải thiện. Bất kể là video/chuyên mục dự án thực chiến hay dự án mã nguồn mở thực chiến, chắc chắn sẽ có rất nhiều chỗ có thể hoàn thiện và cải tiến.**

### Bắt đầu từ con số 0

Tự tay làm một thứ mà bạn muốn hoàn thành, gặp chỗ nào không biết thì học tạm thời, học đến đâu làm đến đó.

Cách này yêu cầu khá cao, tôi khuyên bạn nên có sẵn một kinh nghiệm dự án rồi mới áp dụng phương pháp này. Nếu bạn chưa từng làm dự án, thì hãy thành thật áp dụng hai phương pháp trên đã.

### Tham gia các cuộc thi do các công ty lớn tổ chức

Nếu tham gia các cuộc thi này mà đạt giải, thì hàm lượng vàng của dự án là rất cao. Ngay cả khi không đạt giải cũng không sao, vẫn có thể ghi vào CV.

![Cuộc thi Alibaba Tianchi](https://oss.javaguide.cn/xingqiu/up-673f598477242691900a1e72c5d8b26df2c.png)

### Tham gia dự án thực tế

Thông thường, bạn có những con đường sau để tiếp xúc với việc phát triển dự án thực tế của doanh nghiệp:

1. Dự án do giảng viên nhận;
2. Công việc freelance tự nhận;
3. Dự án tiếp xúc trong quá trình thực tập/làm việc;

Dự án do giảng viên nhận và công việc freelance tự nhận thường là những dự án thiên về nghiệp vụ, rất ít khi liên quan đến tối ưu hiệu năng. Trong trường hợp này, bạn có thể cân nhắc cải tiến dự án, đừng sợ mất thời gian, hãy dành thời gian làm tốt một việc nào đó, ví dụ như bạn cải tiến mô hình dữ liệu của dự án,引入缓存提高访问速度, v.v.

Dự án tiếp xúc trong quá trình thực tập/làm việc cũng tương tự, nếu gặp một số dự án thiên về nghiệp vụ, cũng phải tự mình cải tiến và tối ưu dự án sau giờ làm.

Tốt nhất là thực sự đã tiến hành tối ưu dự án, bản thân việc này cũng là sự nâng cao năng lực cá nhân. Nếu bạn thực sự không có thời gian để thực hành, cũng không sao, chỉ cần nắm vững các phương pháp tối ưu dự án này là được, chuẩn bị trước một số câu hỏi có thể gặp trong phỏng vấn.

## Có dự án nào tương đối ổn để giới thiệu không?

Trong phần "Chuẩn bị Phỏng vấn" của **[《Java 面试指北》](../zhuanlan/java-mian-shi-zhi-bei.md)** có một bài viết chuyên tổng hợp một số dự án thực chiến chất lượng khá cao, bao gồm dự án nghiệp vụ, dự án bánh xe (wheels), bài Lab khóa học công khai nước ngoài và đề xuất hướng dẫn dự án thực chiến dạng video, rất phù hợp để học tập hoặc dùng làm kinh nghiệm dự án.

![Đề xuất Dự án Thực chiến Java Chất lượng](https://oss.javaguide.cn/javamianshizhibei/project-experience-guide.png)

Bài viết này tổng cộng giới thiệu hơn 15 dự án thực chiến, có cả dự án nghiệp vụ lẫn dự án bánh xe, có dự án mã nguồn mở, cũng có hướng dẫn video. Đối với các bạn tham gia tuyển dụng trường, tôi khuyên nên làm một dự án nghiệp vụ cộng với một dự án bánh xe.

## Dự án tôi làm theo video có bị người phỏng vấn chê không?

Rất nhiều sinh viên mới ra trường đều làm dự án theo video, điều này phần lớn người phỏng vấn đều biết rõ.

Không loại trừ khả năng có một số người phỏng vấn không thích kiểu này, cũng tùy người. Tuy nhiên tôi tin rằng đa số người phỏng vấn đều có thể thông cảm, dù sao khi bạn còn đi học thực tế không có con đường nào để có được kinh nghiệm dự án thực tế.

Phần lớn kinh nghiệm dự án của sinh viên mới ra trường đều là tự tìm trên mạng hoặc giống như bạn mua khóa học trả phí rồi làm theo, cực kỳ ít là dự án thực tế. Từ việc bạn có ý định làm một dự án thực chiến, tôi cho rằng ý định ban đầu là tốt, thực sự cũng có thể học được kiến thức. Nhưng, quan trọng là bạn tự mình nắm được bao nhiêu. Điều tối kỵ khi xem video là tiếp nhận thụ động, hãy tự mình cải tiến nhiều hơn, suy nghĩ nhiều hơn! Ngay cả khi bạn làm dự án theo video, cũng có thể tối ưu được!

**Nếu bạn thực sự muốn học được kiến thức, tôi khuyên không chỉ đơn thuần hoàn thành dự án và chạy được, mà còn phải tự mình thử tối ưu!**

Nêu vài điểm tối ưu tương đối dễ:

1. **Xử lý Ngoại lệ Toàn cục**: Nhiều dự án làm chưa tốt về mặt này, có thể tham khảo bài viết này của tôi: [《Sử dụng Enum Đóng gói Một cách Thanh lịch Xử lý Ngoại lệ Toàn cục Spring Boot!》](https://mp.weixin.qq.com/s/Y4Q4yWRqKG_lw0GLUsY2qw) để tối ưu.
2. **Tối ưu Lựa chọn Công nghệ cho Dự án**: Ví dụ như những chỗ sử dụng Guava làm Local Cache có thể đổi thành **Caffeine**. Caffeine có hiệu năng tốt hơn về mọi mặt! Lại ví dụ như tầng Controller có chứa quá nhiều logic nghiệp vụ hay không.
3. **Về Cơ sở dữ liệu**: Thiết kế cơ sở dữ liệu có thể tối ưu được không? Index đã được sử dụng đúng chưa? Câu lệnh SQL có thể tối ưu được không? Có cần thực hiện phân tách đọc-ghi không?
4. **Cache**: Dự án có những dữ liệu nào thường xuyên được truy cập? Có nên引入缓存 để tăng tốc độ phản hồi không?
5. **Bảo mật**: Dự án có tồn tại vấn đề bảo mật không?
6. ……

Ngoài ra, tôi đã chia sẻ các case study thực tế về các hướng tối ưu hiệu năng phổ biến trên Cộng đồng, liên quan đến các hướng như đa luồng, bất đồng bộ, index, cache, rất khuyên bạn nên xem: <https://t.zsxq.com/06EqfeMZZ> .

Cuối cùng, **xin giới thiệu thêm với các bạn một mẹo nhỏ tối ưu code trong IDEA, cực kỳ hữu ích!**

Phân tích code của bạn: Chuột phải vào dự án -> Analyze -> Inspect Code

![](https://oss.javaguide.cn/xingqiu/up-651672bce128025a135c1536cd5dc00532e.png)

Sau khi quét xong, IDEA sẽ đưa ra một số "code smell" có thể tồn tại như vấn đề về đặt tên.

![](https://oss.javaguide.cn/xingqiu/up-05c83b319941995b07c8020fddc57f26037.png)

Hơn nữa, bạn còn có thể tùy chỉnh quy tắc kiểm tra.

![](https://oss.javaguide.cn/xingqiu/up-6b618ad3bad0bc3f76e6066d90c8cd2f255.png)