---
title: Làm thế nào để chuẩn bị phỏng vấn Java hiệu quả?
description: Làm thế nào để chuẩn bị phỏng vấn Java hiệu quả: từ học tập theo định hướng tìm việc, xây dựng danh sách kỹ năng đến tối ưu CV và nước rút phỏng vấn, cung cấp phương pháp chuẩn bị có hệ thống, giúp bạn đi đường tắt ít hơn và nâng cao tỷ lệ vượt qua phỏng vấn.
category: 知识星球
icon: "mdi:map-marker-path"
head:
  - - meta
    - name: keywords
      content: Java面试准备,高效备战面试,求职导向学习,面试冲刺,简历优化,项目准备,校招,Java后端
---

::: tip Gợi ý thân thiện
Bài viết này được trích từ **[《Java Interview Guide》](../zhuanlan/java-mian-shi-zhi-bei.md)**. Đây là một chuyên mục hướng dẫn bạn cách chuẩn bị phỏng vấn hiệu quả hơn, nội dung bổ trợ cho JavaGuide, bao gồm các câu hỏi phỏng vấn phổ biến (system design, các framework thường dùng, hệ thống phân tán, high concurrency...), kinh nghiệm phỏng vấn chất lượng và nhiều nội dung khác.
:::

Xung quanh bạn có người bạn nào như thế này không: năng lực lập trình tốt hơn bạn, nhưng kết quả tìm việc lại không bằng bạn? Thực ra **giỏi kỹ thuật không đồng nghĩa với vượt qua phỏng vấn** — phỏng vấn ngày nay không còn là "biết viết code là được", không chuẩn bị mà đi phỏng vấn, khả năng cao là "đâm đầu vào họng súng".

Chúng ta phần lớn là những lập trình viên bình thường, không có bài báo hội nghị top hay giải thưởng cuộc thi lớn làm điểm cộng, đối mặt với thực tế "phỏng vấn thì chế tạo tên lửa, đi làm thì vặn ốc vít", chỉ có thể dựa vào sự chuẩn bị vững chắc để đột phá. Nhưng chuẩn bị phỏng vấn không có nghĩa là chơi khôn hay học thuộc lòng đáp án phỏng vấn. **Nhất định đừng có tâm lý may rủi với phỏng vấn. Rèn sắt phải khi còn nóng!** Tuyệt đối đừng nghĩ rằng xem vài bài kinh nghiệm phỏng vấn, vài bài phân tích câu hỏi phỏng vấn là có thể vượt qua phỏng vấn. Phải thực sự tĩnh tâm học sâu!

Bài viết này sẽ từ góc nhìn vĩ mô, giúp bạn hiểu rõ lập trình viên nên chuẩn bị phỏng vấn có hệ thống như thế nào: từ học tập theo định hướng tìm việc, đến tối ưu CV, nước rút phỏng vấn, giúp bạn đi đường tắt ít hơn, hiệu quả giành lấy offer mong muốn.

## Học tập theo định hướng tìm việc càng sớm càng tốt

Mình khá khuyên các bạn còn đang đi học nên bắt đầu học tập theo định hướng tìm việc càng sớm càng tốt.

**Làm như vậy sẽ có tính mục tiêu cao hơn, đồng thời có thể giảm đáng kể thời gian mơ hồ không biết làm gì, ở mức độ lớn còn giúp bạn tránh được nhiều đường vòng.**

Nhưng mà! Đừng hiểu "học tập theo định hướng tìm việc" thành "vậy thì mình không cần học mấy môn cơ bản máy tính trên lớp nữa"!

Trong rất nhiều lần chia sẻ trước đây mình đều nhấn mạnh: **Nhất định phải học thật chăm chỉ kiến thức cơ bản máy tính! Hệ điều hành, Nguyên lý tổ chức máy tính, Mạng máy tính thực sự không phải là những môn học vô ích!!!**

Bạn sẽ thấy phỏng vấn ở công ty lớn sẽ dùng đến, sau này đi làm cũng sẽ dùng đến. Mình liệt kê 2 ví dụ nhé!

- **Trong phỏng vấn**: Những công ty lớn như ByteDance, Tencent trong phỏng vấn kỹ thuật và hầu như tất cả các bài kiểm tra viết của các công ty đều có câu hỏi liên quan đến hệ điều hành.
- **Trong công việc**: Khi thực tế sử dụng cache, tư tưởng cache ở cấp độ phần mềm thực chất bắt nguồn từ sự không khớp tốc độ giữa database, Redis (middleware in-memory) và bộ nhớ cục bộ; còn trong thiết kế phân cấp lưu trữ máy tính, chúng ta cũng có thể phát hiện cùng một vấn đề và tư tưởng cache: bộ nhớ được dùng để giải quyết vấn đề tốc độ truy cập đĩa quá chậm, CPU dùng ba cấp cache để giảm sự chênh lệch tốc độ giữa thanh ghi và bộ nhớ. Chúng đều đối mặt với cùng một vấn đề (không khớp tốc độ) và cùng một tư tưởng, vậy thì những biện pháp tối ưu hiệu năng cache mà các nhà tiên phong máy tính đã áp dụng trong thiết kế phân cấp lưu trữ, cũng có thể áp dụng cho tối ưu hiệu năng cache ở cấp độ phần mềm.

**Học tập theo định hướng tìm việc là như thế nào?** Nói ngắn gọn là: dựa trên yêu cầu tuyển dụng để tổng hợp một danh sách kỹ năng cho vị trí mục tiêu, sau đó học tập và nâng cao theo danh sách kỹ năng đó.

1. Trước tiên bạn phải làm rõ mình muốn tìm công việc gì
2. Sau đó dựa trên yêu cầu của vị trí tuyển dụng để tổng hợp một danh sách kỹ năng
3. Dựa trên danh sách kỹ năng để viết CV cuối cùng
4. Cuối cùng lại dựa theo yêu cầu của CV để học tập và nâng cao.

Đây thực chất cũng chính là ứng dụng của tư tưởng **bắt đầu từ kết quả cuối cùng (Begin with the End in Mind)**.

**Begin with the End in Mind là gì?** Nói đơn giản, Begin with the End in Mind nghĩa là chúng ta có thể đứng từ kết quả để suy nghĩ vấn đề, xuất phát từ kết quả, dựa trên kết quả để xác định những việc mình cần làm.

Bạn sẽ phát hiện ra, thực ra hầu như bất kỳ lĩnh vực nào cũng có thể áp dụng tư tưởng **Begin with the End in Mind**.

## Hiểu rõ thời điểm vàng để gửi CV

Trước khi phỏng vấn, bạn chắc chắn phải nắm rõ thời gian cụ thể của đợt tuyển dụng mùa xuân và mùa thu.

Người ta thường nói "tháng 3 tháng 4 vàng, tháng 9 tháng 10 bạc", bỏ lỡ khoảng thời gian này, nhiều công ty sẽ không còn headcount (HC) nữa.

**Đợt tuyển dụng mùa thu thường bắt đầu từ tháng 7, kéo dài đến khoảng cuối tháng 9.**

**Đợt tuyển dụng mùa xuân thường bắt đầu từ tháng 3, kéo dài đến khoảng cuối tháng 4.**

Rất nhiều công ty (đặc biệt là công ty lớn) đến giữa tháng 9 (tuyển dụng mùa thu) / giữa tháng 3 (tuyển dụng mùa xuân), rất có thể sẽ không còn HC nữa. Phỏng vấn thường ít nhất là 3 vòng trở lên, một số công ty lớn như Alibaba, ByteDance có thể có tới 5 vòng phỏng vấn. **Đừng lo nếu phỏng vấn trượt, cũng đừng lo nếu thể hiện không tốt ở một vòng nào đó, hãy điều chỉnh tâm lý cho tốt. Có phải chỉ có một lựa chọn duy nhất đâu đúng không? Bạn có thể ứng tuyển bao nhiêu công ty cơ mà! Điều chỉnh tâm lý đi.** Năm nay phỏng vấn, do ảnh hưởng của dịch bệnh, một số công ty vẫn có thể tập trung phỏng vấn trực tuyến. Và cũng do ảnh hưởng của dịch bệnh, có thể sẽ khó tìm việc hơn các năm trước (ảnh hưởng đến các công ty lớn ít hơn).

## Biết cách lấy thông tin tuyển dụng

Dưới đây là các kênh phổ biến để lấy thông tin tuyển dụng:

- **Website/Official Account chính thức của công ty mục tiêu**: Con đường lấy thông tin tuyển dụng kịp thời và uy tín nhất.
- **Website tuyển dụng**: [BOSS直聘](https://www.zhipin.com/), [智联招聘](https://www.zhaopin.com/), [拉勾招聘](https://www.lagou.com/)...
- **Nowcoder (牛客网)**: Mỗi đợt tuyển dụng mùa thu/mùa xuân, đều có rất nhiều công ty đăng thông tin tuyển dụng lên Nowcoder, và còn có rất nhiều nhân viên công ty lên đây đăng bài giới thiệu nội bộ (internal referral). Địa chỉ: <https://www.nowcoder.com/jobs/recommend/campus> .
- **WonderCV (超级简历)**: WonderCV hiện đã tổng hợp cổng tuyển dụng campus của các doanh nghiệp lớn, địa chỉ: <https://www.wondercv.com/jobs/>. Nếu bạn là tuyển dụng campus, nhấp vào "校招网申" (Ứng tuyển trực tuyến campus) là có thể chuyển trực tiếp đến trang tổng hợp cổng tuyển dụng campus của các doanh nghiệp lớn.
- **Bạn bè quen biết**: Nếu bạn có bạn bè quen biết đang làm việc tại công ty mục tiêu, bạn cũng có thể nhờ họ tìm hiểu thông tin tuyển dụng và nhờ họ giới thiệu nội bộ cho bạn.
- **Buổi giới thiệu tuyển dụng (宣讲会)**: Buổi giới thiệu tuyển dụng cũng là một kênh khá tốt, tuy nhiên, các công ty tốt thường chỉ đến các trường tốt, bạn có thể để ý lịch trình buổi giới thiệu của công ty mình quan tâm hoặc trực tiếp đến một trường tốt để tham dự. Như hồi đó mình đi tuyển dụng campus cũng đã tham gia mấy buổi giới thiệu. Có điều, lúc đó mình học ở Kinh Châu, ở đó không có trường nào tốt lắm, thường không có công ty đến mở buổi giới thiệu. Vì vậy, lúc đó mình đã trực tiếp chạy lên Vũ Hán, tham gia mấy buổi giới thiệu ở Đại học Công nghệ Vũ Hán và Đại học Khoa học Công nghệ Hoa Trung. Cảm giác tổng thể vẫn rất tốt!
- **Khác**: Website thông tin việc làm của trường, diễn đàn trường, nhóm QQ lớp hoặc khóa.

Tuyển dụng campus thì nên lấy website chính thức làm chuẩn, có buổi giới thiệu tuyển dụng thì càng tốt. Tuyển dụng social recruitment thì có thể để ý nhiều hơn đến các website tuyển dụng lớn như BOSS直聘, 拉勾.

Dù là tuyển dụng campus hay social recruitment, nếu tìm được cơ hội internal referral đáng tin cậy, xác suất có được cơ hội phỏng vấn là rất lớn. Hơn nữa, bạn có thể nhờ người giới thiệu đưa ra những lời khuyên định hướng cho bạn. Có nhiều cách tìm internal referral, ưu tiên hàng đầu là bạn bè, bạn học quen biết, ngoài ra còn có thể để ý thông tin internal referral trên các cộng đồng trao đổi kỹ thuật và official account.

Thông thường chỉ được ứng tuyển một vị trí, tuy nhiên, cũng có rất ít trường hợp ứng tuyển hai vị trí ở các bộ phận khác nhau, việc này có lẽ không ảnh hưởng gì, nhưng tình hình phỏng vấn lần trước của bạn có thể sẽ bị ghi lại, nghĩa là dù bạn ứng tuyển thành công hai vị trí, nếu vị trí đầu tiên phỏng vấn trượt, thì cũng sẽ ảnh hưởng đến vị trí thứ hai, rất có thể trực tiếp bị loại luôn.

## Dành nhiều thời gian hơn để hoàn thiện CV

Nhất định nhất định nhất định phải coi trọng CV đấy nhé các bạn! Ít nhất phải dành ra 2~3 ngày để chuyên tâm hoàn thiện CV của mình.

Gần đây mình đã xem rất nhiều CV, rất ít CV làm mình hài lòng, mình lấy một bản ra phân tích đơn giản nhé (hoan nghênh bổ sung trong phần bình luận).

**1. Phần giới thiệu cá nhân không có nhiều thông tin hữu ích.**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/format,png.png)

Blog kỹ thuật, GitHub và thành tích đạt giải ở trường, nếu có thì nên viết hết vào đây. Bạn có thể tham khảo mẫu dưới đây 👇 để chỉnh sửa:

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/format,png-20230309224235808.png)

**2. Kinh nghiệm dự án quá sơ sài, hoàn toàn không có chất lượng**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/format,png-20230309224240305.png)

Mỗi kinh nghiệm dự án thực sự chỉ có thể mô tả bằng một hai câu sao? Hay là bản thân không muốn viết? Hay là không phải do mình làm, không dám viết nhiều.

Nếu có dự án, bước đầu tiên trong phỏng vấn kỹ thuật, người phỏng vấn thường sẽ để bạn tự giới thiệu về dự án của mình. Bạn có thể suy nghĩ từ các hướng sau:

1. Cảm nhận của bạn về thiết kế tổng thể của dự án (người phỏng vấn có thể yêu cầu bạn vẽ sơ đồ kiến trúc hệ thống)
2. Trong dự án này bạn đã phụ trách những gì, đã làm những gì, đảm nhiệm vai trò gì.
3. Từ dự án này bạn đã học được những gì, đã sử dụng những công nghệ gì, đã học được cách sử dụng những công nghệ mới nào.
4. Trong dự án này bạn đã từng giải quyết vấn đề gì chưa? Giải quyết như thế nào? Thu hoạch được gì?
5. Dự án của bạn đã sử dụng những công nghệ gì? Bạn đã nắm vững những công nghệ này chưa? Ví dụ, dự án của bạn sử dụng Seata để làm distributed transaction, vậy thì bạn nên chuẩn bị trước các câu hỏi liên quan đến Seata, ví dụ như Seata hỗ trợ những configuration center nào, transaction grouping của Seata hoạt động như thế nào, Seata hỗ trợ những transaction mode nào, lựa chọn ra sao?
6. Những sai lầm bạn đã mắc phải trong dự án này, cuối cùng đã khắc phục như thế nào?

**3. Chứng chỉ Computer Level 2 (计算机二级) đối với ngành Khoa học Máy tính thì hoàn toàn không cần viết, không có giá trị gì hết.**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/format,png-20230309224247261.png)

**4. Vấn đề về phần giới thiệu kỹ năng khá lớn.**

![](https://oss.javaguide.cn/github/javaguide/interview-preparation/93da1096fb02e19071ba13b4f6a7471c.png)

- Tên công nghệ tốt nhất nên viết đúng quy tắc chữ hoa chữ thường, ví dụ java->Java, spring boot -> Spring Boot. Điều này tuy một số người phỏng vấn không để ý, nhưng rất nhiều người phỏng vấn sẽ để ý đến chi tiết này.
- Phần giới thiệu kỹ năng quá tạp nham, không có điểm nổi bật. Không cần phải là người toàn tài, chỉ cần làm tốt một lĩnh vực nào đó là được!
- Mức độ thành thạo đối với một số kỹ năng phát triển Java Backend như Spring Boot chỉ ở mức "biết sơ", không đáp ứng được yêu cầu của doanh nghiệp.

Hướng dẫn chi tiết về cách viết CV cho lập trình viên vui lòng tham khảo: [Rốt cuộc CV lập trình viên nên viết như thế nào?](https://javaguide.cn/interview-preparation/resume-guide.html).

## Mức độ phù hợp với vị trí rất quan trọng

Tuyển dụng campus thường khá khoan dung với hướng nghiên cứu trong kinh nghiệm dự án của bạn, ngay cả khi kinh nghiệm dự án của bạn không liên quan đến nghiệp vụ cụ thể của công ty, ảnh hưởng thực ra cũng không lớn.

Tuyển dụng social recruitment thì khác, dù sao công ty cũng muốn tuyển người có thể vào làm việc ngay, bạn có kinh nghiệm liên quan thì công ty sẽ đỡ vất vả hơn. Social recruitment thường coi trọng hơn kinh nghiệm làm việc trước đây và kinh nghiệm dự án của bạn, HR khi sàng lọc CV sẽ dựa trên hai mặt thông tin này để phán đoán bạn có đáp ứng yêu cầu tuyển dụng của họ hay không. Ví dụ bạn ứng tuyển vào công ty thương mại điện tử, mà trước đây bạn không có kinh nghiệm làm việc và kinh nghiệm dự án liên quan đến thương mại điện tử, vậy thì HR khi sàng lọc CV rất có thể sẽ trực tiếp loại bạn.

Tuy nhiên, điều này cũng không tuyệt đối, cũng có một số công ty khi tuyển dụng coi trọng hơn kinh nghiệm trong quá khứ của bạn, ít quan tâm đến mức độ phù hợp vị trí, kinh nghiệm làm việc ở công ty xuất sắc và kinh nghiệm dự án có điểm nổi bật đều là điểm cộng. Những công ty kiểu này tin rằng bạn đã làm tốt ở một lĩnh vực nào đó (ví dụ thương mại điện tử, thanh toán), vậy thì cũng có thể nhanh chóng trở thành chuyên gia ở một lĩnh vực khác (ví dụ nền tảng streaming, mạng xã hội). Lĩnh vực ở đây không phải là lĩnh vực kỹ thuật, mà là hướng nghiệp vụ. Nhảy ngang lĩnh vực kỹ thuật (ví dụ Backend chuyển sang Algorithm, Backend chuyển sang Big Data) mà tìm việc, bạn lại không có kinh nghiệm liên quan, thì gần như không thể tìm được. Ngay cả khi tìm được, cũng rất có thể sẽ đối mặt với vấn đề HR ép lương.

## Chuẩn bị trước cho phỏng vấn kỹ thuật

Trước khi phỏng vấn nhất định phải chuẩn bị trước các câu hỏi phỏng vấn thường gặp, tức là "bát cổ văn" (八股文 - câu hỏi lý thuyết):

- Trong phỏng vấn của mình có thể liên quan đến những điểm kiến thức nào, những điểm kiến thức nào là trọng tâm.
- Trong phỏng vấn những câu hỏi nào thường xuyên được hỏi, trong phỏng vấn mình nên trả lời như thế nào. (Cực kỳ không khuyến khích học thuộc lòng, thứ nhất: bằng cách học thuộc bạn có thể nhớ được bao nhiêu? Nhớ được bao lâu? Thứ hai: cách học thuộc đáp án rất khó kiên trì!)

Trọng tâm ôn tập phỏng vấn Java Backend mời xem bài viết này: [Tổng kết trọng tâm phỏng vấn Java (Quan trọng)](https://javaguide.cn/interview-preparation/key-points-of-interview.html).

Các loại công ty khác nhau có trọng tâm yêu cầu kỹ năng khác nhau, ví dụ Tencent, ByteDance có thể coi trọng hơn kiến thức cơ bản máy tính như mạng máy tính, hệ điều hành. Alibaba, Meituan thì có thể coi trọng hơn kinh nghiệm dự án và năng lực thực chiến của bạn.

Nhất định đừng ôm tư tưởng cho rằng việc kiểm tra bát cổ văn hay câu hỏi kiến thức cơ bản là không có nhiều ý nghĩa. Nếu bạn ôm tư tưởng này mà ôn tập, thì hiệu quả có lẽ sẽ không tốt lắm. Thực tế, cá nhân mình cho rằng vẫn rất có ý nghĩa, bát cổ văn hay kiến thức cơ bản trong phát triển hàng ngày cũng thường xuyên cần dùng đến. Ví dụ, các rejection policy, cấu hình core parameter của thread pool, nếu bạn không hiểu, thì trong dự án thực tế sử dụng thread pool có thể sẽ không dùng đúng cách, dễ phát sinh vấn đề. Hơn nữa, thực ra những câu hỏi kiến thức cơ bản loại này là dễ chuẩn bị nhất, còn các loại câu hỏi như nguyên lý tầng dưới, system design, câu hỏi tình huống (scenario-based) và đào sâu dự án của bạn mới là khó nhất!

Tài liệu bát cổ văn mình khuyên dùng hàng đầu là [《Java Interview Guide》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) (sử dụng kết hợp với JavaGuide, sẽ cập nhật hoàn thiện nội dung dựa trên tình hình phỏng vấn mỗi năm) và [JavaGuide](https://javaguide.cn/). Bên trong không chỉ có bát cổ văn gốc, mà còn có rất nhiều kiến thức thực tế hữu ích cho phát triển thực chiến. Ngoài tài liệu của mình ra, bạn còn có thể lên mạng tìm một số bài viết, video chất lượng khác để xem.

![《Java Interview Guide》Tổng quan nội dung](https://oss.javaguide.cn/javamianshizhibei/javamianshizhibei-content-overview.png)

## Chuẩn bị trước cho phần thuật toán (Viết code tay)

Rõ ràng, phỏng vấn tuyển dụng campus ở trong nước hiện nay ngày càng coi trọng thuật toán, đặc biệt là những công ty lớn như ByteDance, Tencent. Phần lớn bài kiểm tra viết tuyển dụng campus của các công ty đều có câu hỏi thuật toán, nếu tỷ lệ AC (Accepted) thấp, thì cơ bản là trượt rồi.

Social recruitment thì phỏng vấn thuật toán cũng sẽ có. Tuy nhiên, người phỏng vấn có thể sẽ coi trọng hơn năng lực engineering (kỹ thuật xây dựng hệ thống) và kinh nghiệm dự án của bạn. Nếu các mặt khác của bạn đều rất xuất sắc, nhưng thuật toán lại kém, thì chưa chắc đã trượt. Dù sao thì cũng vẫn nên luyện bài tập thuật toán, tránh để nó trở thành điểm yếu của mình trong phỏng vấn.

Social recruitment thường là ở cuối buổi phỏng vấn kỹ thuật, người phỏng vấn sẽ đưa cho bạn một bài toán thuật toán để làm.

Về cách chuẩn bị phỏng vấn thuật toán, phần Chuẩn bị phỏng vấn trong [《Java Interview Guide》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html) có giới thiệu chi tiết.

![《Java Interview Guide》Phần Chuẩn bị phỏng vấn](https://oss.javaguide.cn/javamianshizhibei/preparation-for-interview.png)

## Chuẩn bị trước phần tự giới thiệu

Tự giới thiệu thường là lần giao tiếp chính thức mặt đối mặt đầu tiên giữa bạn và người phỏng vấn, thử đặt mình vào vị trí người phỏng vấn mà xem, giả sử bạn là người phỏng vấn, bạn muốn nghe người mà bạn đang phỏng vấn tự giới thiệu bản thân như thế nào? Chắc chắn không phải là khách sáo nói rằng mình thích lập trình, bình thường dành nhiều thời gian để học, sở thích cá nhân là chơi bóng chứ?

Mình nghĩ một phần tự giới thiệu tốt ít nhất nên bao gồm những yếu tố sau:

- Dùng lời ngắn gọn nói rõ technology stack chính và lĩnh vực sở trường của mình;
- Đặt trọng tâm vào những thứ mình giỏi và những điểm mạnh của mình;
- Làm nổi bật năng lực của mình, ví dụ như năng lực phát hiện bug của mình đặc biệt xuất sắc;

Nói đơn giản là dùng ngôn ngữ súc tích để làm nổi bật điểm sáng của mình, chính là tiếp thị bản thân thôi mà!

- Nếu bạn từng thực tập ở công ty lớn, thì kinh nghiệm thực tập tương ứng chính là điểm sáng của bạn.
- Nếu bạn từng tham gia cuộc thi kỹ thuật, thì kinh nghiệm thi đấu chính là điểm sáng của bạn.
- Nếu bạn từ đại học đã tiếp xúc với phát triển dự án cấp doanh nghiệp, kinh nghiệm thực chiến nhiều, thì những kinh nghiệm dự án đó chính là điểm sáng của bạn.
- ...

Lấy ví dụ từ hai góc độ social recruitment và tuyển dụng campus nhé! Hai ví dụ dưới đây của mình chỉ mang tính tham khảo, tự giới thiệu không cần phải học thuộc lòng, nhớ những điểm chính cần nói, khi phỏng vấn tùy theo tình hình công ty mà ứng biến cũng không vấn đề gì. Ngoài ra, trên mạng thường khuyên nên chuẩn bị sẵn hai bản tự giới thiệu: một bản cho HR, chủ yếu nói về những trải nghiệm nổi bật của mình, công nghệ lập trình thì nói lướt qua; một bản khác cho người phỏng vấn kỹ thuật, chủ yếu nói về chi tiết kỹ thuật và kinh nghiệm dự án của mình.

**Social Recruitment:**

> Chào anh/chị phỏng vấn! Em tên là Độc Tú Nhi. Em hiện có 1 năm rưỡi kinh nghiệm làm việc, thành thạo sử dụng các framework như Spring, MyBatis, hiểu biết về nguyên lý tầng dưới của Java như JVM tuning và có kinh nghiệm phong phú về phát triển hệ thống phân tán. Em rời công ty cũ là vì muốn được rèn luyện thêm về mặt kỹ thuật. Ở công ty cũ em đã tham gia phát triển một hệ thống giao dịch điện tử phân tán, phụ trách xây dựng kiến trúc nền tảng cho toàn bộ dự án và thông qua sharding database và table đã giải quyết được vấn đề database gốc và một số bảng liên quan quá lớn, hiện tại website này hỗ trợ tối đa 10 vạn người truy cập đồng thời. Ngoài giờ làm việc, em đã tận dụng thời gian rảnh để viết một RPC framework đơn giản, framework này sử dụng Netty để giao tiếp mạng, hiện tại em đã open source dự án này, trên GitHub đã nhận được 2k Star! Về sở thích cá nhân, em thích chia sẻ kiến thức mình học được thông qua blog, hiện đã là tác giả được chứng nhận trên nhiều nền tảng blog. Trong cuộc sống em là người khá tích cực lạc quan, thường thư giãn bằng cách chơi thể thao. Em đã luôn rất mong muốn được gia nhập công ty mình, em cảm thấy văn hóa và bầu không khí kỹ thuật của công ty mình đều rất phù hợp với em, mong được làm việc cùng anh/chị!

**Tuyển dụng Campus:**

> Chào anh/chị phỏng vấn! Em tên là Tú Nhi. Thời gian đại học em chủ yếu tận dụng thời gian ngoại khóa để học Java và các framework như Spring, MyBatis. Trong thời gian học em đã tham gia phát triển một hệ thống thi trực tuyến, hệ thống này chủ yếu sử dụng ba framework là Spring, MyBatis và Shiro. Trong đó em chủ yếu đảm nhiệm Backend Developer, phụ trách chính việc xây dựng module quản lý phân quyền. Ngoài ra, hồi đại học em đã từng tham gia một cuộc thi lập trình phần mềm, hệ thống đặt đồ ăn trực tuyến của em và nhóm đã giành được giải Nhì. Em còn tận dụng thời gian rảnh để viết một RPC framework đơn giản, framework này sử dụng Netty để giao tiếp mạng, hiện tại em đã open source dự án này, trên GitHub đã nhận được 2k Star! Về sở thích cá nhân, em thích chia sẻ kiến thức mình học được thông qua blog, hiện đã là tác giả được chứng nhận trên nhiều nền tảng blog. Trong cuộc sống em là người khá tích cực lạc quan, thường thư giãn bằng cách chơi thể thao. Em đã luôn rất mong muốn được gia nhập công ty mình, em cảm thấy văn hóa và bầu không khí kỹ thuật của công ty mình đều rất phù hợp với em, mong được làm việc cùng anh/chị!

## Giảm bớt than phiền

Cũng giống như phỏng vấn kỹ thuật hiện nay, ai cũng nói là nội quyển (内卷 - involution) rồi, than phiền rằng phỏng vấn bây giờ khó kinh khủng. Nhưng mà, than phiền suông thì có ích gì? Bạn nói với những người tìm việc khác rằng: "Mọi người đừng có luyện Leetcode nữa nhé! Đừng có chuẩn bị mấy câu hỏi phỏng vấn high concurrency, high availability nữa nhé! Bây giờ nội quyển lắm rồi!"

Có ai nghe bạn không? **Bạn không chuẩn bị phỏng vấn, nhưng người khác sẽ chuẩn bị phỏng vấn đấy! Vậy bạn có ngốc không? Hay là bạn thực sự giỏi đến mức không cần chuẩn bị phỏng vấn?**

Vì vậy, bước đầu tiên để chuẩn bị phỏng vấn Java, chúng ta nhất định phải giảm thiểu than phiền. Khi tiếng than phiền nhiều lên, sẽ ảnh hưởng rất lớn đến bản thân, khiến mình trở nên vô cùng lo lắng.

## Kịp thời复盘 (phản tỉnh) sau phỏng vấn

Nếu thất bại, đừng nản lòng; nếu vượt qua, đừng vội mừng quá. Phỏng vấn và công việc thực tế là hai chuyện khác nhau, có thể rất nhiều người không vượt qua phỏng vấn, nhưng năng lực làm việc lại mạnh hơn bạn rất nhiều, và ngược lại.

Phỏng vấn giống như một hành trình hoàn toàn mới, thất bại và thành công đều là chuyện bình thường. Vì vậy, khuyên các bạn đừng vì trượt phỏng vấn mà nản lòng, mất đi ý chí chiến đấu. Cũng đừng vì vượt qua phỏng vấn mà đắc chí, điều đang chờ đón bạn sẽ là một tương lai tươi đẹp hơn, tiếp tục cố gắng nhé!

## Tổng kết

Bài viết này nội dung hơi nhiều, nếu bài viết này chỉ có thể giúp bạn nhớ được 7 câu, thì hãy nhớ 7 câu dưới đây:

1. Nhất định phải chuẩn bị trước cho phỏng vấn! Phỏng vấn kỹ thuật khác với lập trình, lập trình giỏi không có nghĩa là phỏng vấn kỹ thuật nhất định sẽ qua.
2. Nhất định đừng ôm tâm lý may rủi với phỏng vấn. Rèn sắt phải khi còn nóng! Tuyệt đối đừng nghĩ rằng xem vài bài kinh nghiệm phỏng vấn, vài bài phân tích câu hỏi phỏng vấn là có thể vượt qua phỏng vấn. Phải thực sự tĩnh tâm học sâu! Đặc biệt là các bạn có mục tiêu vào công ty lớn, càng phải đào sâu nguyên lý!
3. Khuyên các bạn sinh viên nên bắt đầu học tập theo định hướng tìm việc càng sớm càng tốt. Như vậy sẽ có tính mục tiêu cao hơn, đồng thời có thể giảm đáng kể thời gian mơ hồ không biết làm gì, ở mức độ lớn còn giúp bạn tránh được nhiều đường vòng. Nhưng mà, đừng hiểu "học tập theo định hướng tìm việc" thành "vậy thì mình không cần học mấy môn cơ bản máy tính trên lớp nữa"!
4. Nhất định đừng ôm tư tưởng cho rằng việc kiểm tra bát cổ văn hay câu hỏi kiến thức cơ bản là không có nhiều ý nghĩa. Nếu bạn ôm tư tưởng này mà ôn tập, thì hiệu quả có lẽ sẽ không tốt lắm. Thực tế, cá nhân mình cho rằng vẫn rất có ý nghĩa, bát cổ văn hay kiến thức cơ bản trong phát triển hàng ngày cũng thường xuyên cần dùng đến. Ví dụ, các rejection policy, cấu hình core parameter của thread pool, nếu bạn không hiểu, thì trong dự án thực tế sử dụng thread pool có thể sẽ không dùng đúng cách, dễ phát sinh vấn đề.
5. Viết code tay thuật toán là tiêu chuẩn của phỏng vấn kỹ thuật hiện nay, hãy chuẩn bị sớm!
6. Mức độ phù hợp với vị trí rất quan trọng. Tuyển dụng campus thường khá khoan dung với hướng nghiên cứu trong kinh nghiệm dự án của bạn, ngay cả khi kinh nghiệm dự án của bạn không liên quan đến nghiệp vụ cụ thể của công ty, ảnh hưởng thực ra cũng không lớn. Tuyển dụng social recruitment thì khác, dù sao công ty cũng muốn tuyển người có thể vào làm việc ngay, bạn có kinh nghiệm liên quan thì công ty sẽ đỡ vất vả hơn.

7. Kịp thời phản tỉnh sau phỏng vấn. Phỏng vấn giống như một hành trình hoàn toàn mới, thất bại và thành công đều là chuyện bình thường. Vì vậy, khuyên các bạn đừng vì trượt phỏng vấn mà nản lòng, mất đi ý chí chiến đấu. Cũng đừng vì vượt qua phỏng vấn mà đắc chí, điều đang chờ đón bạn sẽ là một tương lai tươi đẹp hơn, tiếp tục cố gắng nhé!