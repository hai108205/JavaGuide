---
title: Những thử thách và suy ngẫm trong hành trình phỏng vấn của một lập trình viên lớn tuổi
description: "Những thử thách và suy ngẫm trong hành trình phỏng vấn của một lập trình viên lớn tuổi: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, hệ thống hóa các khái niệm then chốt, câu hỏi thường gặp và điểm mấu chốt thực hành, giúp bạn học tập hiệu quả và chuẩn bị cho phỏng vấn."
category: 技术文章精选集
author: 琴水玉
tag:
  - 面试
head:
  - - meta
    - name: keywords
      content: 大龄程序员面试,面试准备,简历优化,技术面试,面试心态,职业规划,面试技巧,技术原理
---

> **Lời giới thiệu**: Tác giả bài viết này năm nay 36 tuổi, đã có 8 năm kinh nghiệm phát triển JAVA. Ba năm rưỡi ở Alibaba Cloud, bốn năm rưỡi tại Youzan, đã là lập trình viên lớn tuổi chính hiệu. Trong bài viết này, tác giả đưa ra một số lời khuyên về phỏng vấn và nâng cao năng lực cá nhân, rất thực tế!
>
> **Tổng quan nội dung**:
>
> 1. Giới thiệu bản thân là cơ hội để hiểu rõ, sâu sắc và toàn diện hơn về chính mình.
> 2. Hồ sơ (resume) là tinh túy cô đọng thể hiện đầy đủ bản thân, cũng là cơ hội để nhìn lại bản thân và những trải nghiệm trong quá khứ. Không chỉ giới thiệu ngắn gọn kỹ năng và kinh nghiệm, mà còn phải tối đa hóa việc làm nổi bật lĩnh vực ưu thế của mình (tính khác biệt hóa - differentiation).
> 3. Cá nhân tôi không tán thành việc gửi hồ sơ tràn lan (海投), mà nghiêng về việc gửi hồ sơ có định hướng rõ ràng. Gửi đúng hướng, tuy mục tiêu ít hơn, nhưng hiệu quả hơn.
> 4. Khám phá kỹ thuật, nhất định phải hiểu nguyên lý trước. Không hiểu nguyên lý thì sẽ chỉ nổi trên bề mặt, không thể thực sự nắm vững. Nghiên cứu nguyên lý kỹ thuật phải nắm đến mức nào? Cấu trúc dữ liệu và thiết kế thuật toán, các yếu tố cân nhắc, cơ chế kỹ thuật, tư duy tối ưu. Phải tua lại trong đầu cho đến khi mọi chi tiết hiện rõ ràng. Nếu có thể trình bày rõ ràng, có logic thì càng tốt. Nghiên cứu nguyên lý kỹ thuật, nhất định phải đọc mã nguồn. Đọc mã nguồn và không đọc mã nguồn là có khác biệt. Không đọc mã nguồn, tuy nói được, nhưng cuối cùng vẫn cách một lớp giấy; đọc mã nguồn rồi, mới chọc thủng lớp giấy đó, có sự hiểu biết của riêng mình, cũng sẽ nói có phần tự tin hơn. Tất nhiên, cũng có thể là do tôi thiếu khả năng diễn xuất.
> 5. Phải giỏi học hỏi từ thất bại. Chính nhờ quá trình học tập, suy nghĩ, tích lũy và chắt lọc liên tục trong bốn tháng trống việc ở Hàng Châu, cùng với việc suy ngẫm về những lần phỏng vấn thất bại, không ngừng điều chỉnh đối sách, hoàn thiện chuẩn bị, khắc phục những điểm yếu vốn có, áp dụng cách thức hợp lý hơn, mới có thể nhận được offer khá hài lòng chỉ trong vỏn vẹn hai tuần sau khi trở về Vũ Hán.
> 6. Phỏng vấn là quá trình hai bên hiểu nhau thông qua giao tiếp. Các câu hỏi trong phỏng vấn thay đổi muôn hình vạn trạng, nhưng có một số câu hỏi cần chuẩn bị trước.
>
> **Đường dẫn bài gốc**: <https://www.cnblogs.com/lovesqcc/p/14354921.html>

Học từ mỗi đoạn trải nghiệm, tu dưỡng trong từng việc. Giỏi học hỏi từ những khó khăn, thất bại.

## Mở đầu

Năm nay tôi 36 tuổi, đã có 8 năm kinh nghiệm phát triển JAVA. Ba năm rưỡi ở Alibaba Cloud, bốn năm rưỡi tại Youzan, đã là lập trình viên lớn tuổi chính hiệu.

Trong nhiều năm đọc sách, học tập và suy ngẫm, giá trị quan, nhân sinh quan và thế giới quan của tôi dần được định hình. Tôi nhận ra niềm đam mê của mình nằm ở mảng giáo dục - văn hóa, vì vậy trong một phút bốc đồng, cuối tháng 8, tôi đã nghỉ việc ngay (nghỉ việc không có kế hoạch) để đi tìm việc. Lý trí có hạn khó có thể ngăn cản tính cách bốc đồng. Không khuyến khích nghỉ việc không có kế hoạch, làm việc gì cũng nên có kế hoạch, khoa học và hợp lý.

Dù ban đầu tôi cho rằng mình "có lý tưởng, có mục tiêu, có ý chí, có năng lực", tìm một công việc phát triển giáo dục hẳn không khó, nhưng thực tế tôi đã quá lạc quan. Hiện thực nhanh chóng dội cho tôi từng gáo nước lạnh. Tôi thua liên tiếp, rồi lại đứng dậy chiến đấu tiếp. Và ngạc nhiên phát hiện mình còn có sự dẻo dai này. Phỏng vấn là một thử thách tôi luyện; nếu không bị thất bại đánh gục, thì từ đó sẽ trưởng thành một sự dẻo dai, và sự dẻo dai này có thể giúp người ta đi xa hơn. Ai mà chưa từng trải qua sự tôi luyện của thất bại? Thất bại là người thầy vĩ đại nhất, nếu bạn sẵn lòng học từ nó.

Trong quá trình phỏng vấn, tôi nhanh chóng nhận ra những điểm yếu của mình:

- Dồn nhiều tâm sức vào nghiệp vụ, độ sâu kỹ thuật chưa đủ, hiểu biết về nguyên lý bị giới hạn ở mức nông cạn;
- Tầm nhìn chưa đủ rộng, bị bó hẹp trong dòng nghiệp vụ đơn hàng mình đang làm, hiểu biết về các dòng nghiệp vụ liên quan khác (như sản phẩm, marketing, thanh toán, v.v.) chưa đủ;
- Tư duy chưa đủ rộng, phần lớn thời gian dồn vào phát triển và kiểm thử, suy nghĩ về vận hành (ops), sản phẩm, nghiệp vụ, tầng thương mại còn ít;
- Thiếu kinh nghiệm quản lý, tuổi tác đã lớn; hai điểm yếu này tôi từng đánh giá thấp, nhưng dần dần nổi lên rõ rệt, thậm chí từng khiến tôi thiếu tự tin, nhưng cuối cùng tôi vẫn bước ra được.

Nhưng tôi cũng có ưu thế của riêng mình. Quy luật cơ bản của cạnh tranh nghề nghiệp là tính khan hiếm (scarcity) và tính khác biệt (differentiation). Có khả năng giải quyết thiết kế kiến trúc của các dự án lớn và chinh phục các bài toán kỹ thuật khó, tinh thông một lĩnh vực kỹ thuật cao cấp nào đó là biểu hiện của tính khan hiếm; còn làm việc được tỉ mỉ, chu toàn, tinh tế, có kinh nghiệm phát triển hệ thống tải lớn, lưu lượng cao, là biểu hiện của tính khác biệt. Tính khan hiếm là thượng sách, tính khác biệt là trung sách, còn hạ mình cầu việc là hạ sách.

Tôi thiếu ưu thế về tính khan hiếm, nhưng vẫn còn chút ưu thế về tính khác biệt:

- Với mỗi công việc đều rất chăm chỉ, thời gian đều nằm trong khoảng 3 - 5 năm, có chút hào quang công ty lớn, có thể nhận được nhiều cơ hội phỏng vấn hơn (dù chưa chắc đã đậu);
- Kiên trì viết blog, miệt mài theo đuổi "Đạo" của phát triển phần mềm, thường xuyên suy nghĩ và ghi lại các vấn đề gặp phải cũng như giải pháp trong quá trình phát triển;
- Làm việc nghiêm túc, cẩn thận, có thể phân tích và suy nghĩ vấn đề từ tổng thể, cũng rất chú trọng củng cố nền tảng;
- Có kinh nghiệm thực tiễn về chất lượng công trình, tối ưu hiệu năng, xây dựng tính ổn định, thiết kế cấu hình hóa nghiệp vụ;
- Có kinh nghiệm phát triển và bảo trì lâu dài hệ thống vi dịch vụ (microservice) lưu lượng lớn.

Tôi gửi hồ sơ cho không nhiều công ty. Trong số ít các buổi phỏng vấn đó, tôi dần nhận ra quan niệm "giành được offer từ hàng chục công ty lớn" trên mạng là không đáng tin. Lý do như sau:

- Nếu thực sự giành được vô số offer từ các công ty lớn, thì trình độ của vòng phỏng vấn đó rất có thể chỉ là kỹ sư sơ cấp. Phải biết rằng phỏng vấn kỹ sư có hơn 4 năm kinh nghiệm, độ sâu và độ rộng của các câu hỏi đến mức kinh người, từ thuật toán cơ bản, đến nguyên lý cơ chế của đủ loại middleware, đến kiến trúc vận hành thực tế, không thiếu thứ gì, đúng là đắm chìm trong "biển cả kỹ thuật", trừ khi nền tảng và thực lực của một người cực kỳ mạnh, bình thường cũng đã có sự tích lũy rất sâu và rộng;
- Một người có nền tảng và thực lực cực mạnh, sẽ không có hứng thú dồn nhiều tâm sức như vậy để đi phỏng vấn đủ các công ty, chỉ để khoác lác mình tài giỏi đến đâu; người thực lực càng mạnh thì càng có logic lựa chọn của riêng mình, hồ sơ gửi đi sẽ càng định hướng chính xác. Vả lại, tại sao họ không dành nhiều tâm sức hơn cho những doanh nghiệp ưu tú có thể mang lại cho họ lợi ích tối đa?
- Quảng cáo của các tổ chức đào tạo. Vì họ hiểu rõ nhất rằng người mới cần là sự tự tin, dù chỉ là sự tự tin ngụy tạo.

Được rồi, không nói chuyện phiếm nữa. Tôi kể về những thử thách tôi luyện và suy ngẫm của mình trong các buổi phỏng vấn.

## Công tác chuẩn bị

Đời người có thể rất dài, nhưng thời gian phỏng vấn rất ngắn, dài nhất chỉ một tiếng hoặc một tiếng rưỡi. Người khác làm sao có thể trong vỏn vẹn một giờ hiểu rõ về con người hơn ba mươi năm của bạn? Điều này đòi hỏi bạn phải làm rất nhiều công tác chuẩn bị tỉ mỉ. Ở một mức độ nào đó, phỏng vấn có điểm tương đồng với khiêu vũ: trên sân khấu năm phút, dưới sân khấu mười năm công phu.

Công tác chuẩn bị chủ yếu bao gồm chuẩn bị hồ sơ, giới thiệu bản thân, tìm hiểu công ty, khám phá kỹ thuật, khả năng diễn đạt, các câu hỏi thường gặp, vị trí trung - cao cấp, tâm thế tốt. Chuẩn bị là một lần nhận thức lại toàn diện và sâu sắc về bản thân và thế giới bên ngoài.

Giai đoạn đầu, tôi tưởng mình chuẩn bị rất đầy đủ, sửa lại hồ sơ là xong. Qua từng lần vấp ngã, tôi mới nhận ra sự chuẩn bị của mình chưa thật sự đầy đủ. Theo quan điểm của tôi hiện tại, chuẩn bị bảy phần, ứng biến ba phần. Chuẩn bị, là phải biết người biết ta, biết đối phương sẽ hỏi những câu nào (thường là độ sâu và độ rộng về hệ thống/dự án/kỹ thuật), và mình nên trả lời như thế nào; ứng biến, là khi gặp câu mình không biết, không hiểu, không rõ, làm thế nào để trình bày hợp lý hướng giải quyết của mình, đồng thời căn cứ vào những câu trả lời không được trong buổi phỏng vấn để bù đắp thiếu sót, củng cố nền tảng.

Quá trình này, thực chất cũng là quá trình học tập. Liên tục phản tỉnh và chắt lọc, học nội dung mới, nhận thức lại bản thân và những trải nghiệm trong quá khứ, v.v.

### Chuẩn bị hồ sơ (resume)

Ban đầu, tôi làm khá đơn giản. Lấy hồ sơ cũ ra, thêm kinh nghiệm làm việc mới, sửa qua loa, nhưng tổng thể mẫu hồ sơ gần như không đổi.

Về mặt cơ bản, tôi làm khá cẩn thận, thành thật viết những kỹ năng và kinh nghiệm mình giỏi và quen thuộc, bố cục cũng cố gắng làm gọn gàng đẹp mắt (từng học qua một chút thiết kế UI). Không khoa trương cũng không giả vờ khiêm tốn.

Về mặt mở rộng, tôi làm vẫn chưa đủ. Một hôm, một headhunter gọi điện cho tôi, hỏi: "Ưu điểm lớn nhất của anh là gì?" Tôi nhất thời không nói nên lời. Lúc đó cũng không suy nghĩ thêm. Sau những lần phỏng vấn liên tiếp thất bại, từng có lúc thiếu tự tin, tôi bắt đầu nghiêm túc suy nghĩ về ưu thế của mình. Rồi viết "Có suy nghĩ sâu sắc và kinh nghiệm thực tiễn về chất lượng công trình, tối ưu hiệu năng, xây dựng tính ổn định, thiết kế cấu hình hóa nghiệp vụ" vào dòng đầu tiên của mục "Tố chất kỹ năng", bởi vì đây đúng là thứ tôi đã làm qua, thực tế nhất, vững chắc nhất và mang tính khái quát.

Đôi khi, thứ tự sắp xếp nội dung hồ sơ cũng rất quan trọng. Trước đây, tôi viết các ngôn ngữ và công nghệ nắm vững ở phía trước, còn "năng lực quản lý dự án và sức ảnh hưởng trong đội nhóm" để ở phía sau. Nhưng sau khi gửi cho Niên Niên Ma Ma (nian gaomama), không được phỏng vấn mà trực tiếp bị đưa vào danh sách không phù hợp, bị kích thích, tôi nhận ra có lẽ đối phương cho rằng kinh nghiệm quản lý của tôi không đủ. Vì vậy, tôi cố tình đưa "năng lực quản lý dự án và sức ảnh hưởng trong đội nhóm" lên phía trước, để thể hiện mình coi trọng mảng quản lý, tuy nhiên sau khi gửi hồ sơ mới đi, không có hồi âm. Tôi nhận ra, thứ tự sắp xếp như vậy có thể khiến người ta hiểu nhầm tôi nghiêng về năng lực quản lý (thực tế có một HR đã hỏi tôi có còn viết code không), nhưng thực ra tôi lại thiếu kinh nghiệm quản lý, cuối cùng, tôi vẫn điều chỉnh về thứ tự ban đầu, làm nổi bật "bản sắc kỹ sư" của mình. Sau đó, tôi lại thực hiện thêm vài chỉnh sửa về cách diễn đạt câu chữ.

Theo tiến trình phỏng vấn, đôi khi tôi cũng phát hiện những chỗ mình viết trên hồ sơ chưa đủ hoặc trước đây làm chưa đủ. Ví dụ, trong đoạn trải nghiệm xuất đơn hàng, tôi chỉ viết là đã nâng cao rất lớn hiệu năng và tính ổn định, mang tính mô tả định tính, vì vậy tôi bổ sung thêm một số con số định lượng (2w blocking => 300w+, 1w/1min) làm bằng chứng; ví dụ, tháng 8 nghỉ việc, đến tháng 12 phỏng vấn, có một khoảng trống việc, một số doanh nghiệp sẽ hỏi về việc này. Vì vậy, tôi tiện thể thêm một câu, nói rõ trong khoảng thời gian này tôi đang làm gì; ví dụ, các hệ thống và dự án tiêu biểu, giá trị và ý nghĩa của từng hệ thống và dự án (không nhất thiết phải viết lên hồ sơ, nhưng trong đầu phải nắm rõ). Công phu cần phải làm đủ.

Lại ví dụ, tôi viết rất chi tiết trải nghiệm làm việc tại Youzan, nhưng đoạn Alibaba Cloud thì gần như không đụng vào. Mà một số doanh nghiệp lại quan tâm hơn đến đoạn trải nghiệm này, tôi lại thấy không có nhiều thứ để nói, trong đầu chỉ còn lại chút ít những thứ đáng nhớ, cùng vài bài viết blog ghi lại, so với trải nghiệm công việc này thì quá đơn điệu. Thực chất đây không phải vấn đề của hồ sơ, mà là vấn đề nhìn lại trải nghiệm quá khứ. Khuyên bạn nên, sau khi mỗi dự án kết thúc, đều viết một bản tự nhìn lại (review). Tránh để thời gian làm phai nhạt những trải nghiệm quý giá này.

Thực ra ai cũng có rất nhiều điều để nói, nhưng có bao nhiêu được ghi lại? Có bao nhiêu đáng để bàn luận? Quá khứ không nỗ lực, phỏng vấn chỉ có thể đau thương.

**Bài học cập nhật hồ sơ**:

- Hồ sơ là tinh túy cô đọng thể hiện đầy đủ bản thân, cũng là cơ hội để nhìn lại bản thân và những trải nghiệm trong quá khứ;
- Không chỉ giới thiệu ngắn gọn kỹ năng và kinh nghiệm, mà còn phải tối đa hóa việc làm nổi bật lĩnh vực ưu thế của mình (tính khác biệt);
- Tăng cường cách diễn đạt kinh nghiệm làm việc, làm nổi bật sự đóng góp, giành được sự công nhận của người khác;
- Nhìn lại và ghi lại thu hoạch của từng dự án, tạo nền tảng tốt cho việc nhảy việc và phỏng vấn.

### Giới thiệu bản thân

Trước buổi phỏng vấn thường sẽ được yêu cầu giới thiệu ngắn gọn về bản thân. Giới thiệu bản thân thường đóng vai trò là khúc dạo đầu và giai đoạn đệm trước khi bước vào phỏng vấn, giúp xoa dịu không khí căng thẳng.

Giới thiệu bản thân ban đầu của tôi, tính cách, đời sống cá nhân, kinh nghiệm làm việc, sở thích, v.v., dường như không biết nên nói gì. Thực ra, giới thiệu bản thân là một trang chủ (homepage) thể hiện đầy đủ con người mình. Trang chủ nên làm cho những ưu thế cốt lõi nhất của mình hiện rõ ngay từ cái nhìn đầu tiên (cần đào sâu trải nghiệm của mình và chắt lọc kỹ càng). Giới thiệu bản thân hiện tại của tôi thường bao gồm: tính cách (ví dụ nghiêng về trầm lặng), phong cách làm việc (làm việc nghiêm túc cẩn thận, coi trọng chất lượng, giỏi tư duy tổng thể), ưu thế lớn nhất (ý thức owner, sức thực thi, năng lực kiểm soát công trình), tóm tắt kinh nghiệm làm việc (làm việc tại mỗi công ty phụ trách gì, đóng góp gì, thu hoạch gì). Giới thiệu bản thân phải ngắn gọn súc tích, không cần dài dòng.

Giới thiệu bản thân, là cơ hội để hiểu rõ, sâu sắc và toàn diện hơn về chính mình.

### Tìm hiểu công ty

Nhiều người có lẽ giống tôi, hiểu biết về nghiệp vụ của công ty rất ít, liền gửi hồ sơ đi ngay. Làm như vậy thực ra không hợp lý. Trước hết, cá nhân tôi không tán thành việc gửi hồ sơ tràn lan, mà nghiêng về việc gửi có định hướng. Gửi đúng hướng, tuy mục tiêu ít hơn, nhưng hiệu quả hơn. Điều này giống như thuê nhà, tôi thường thuê nhà trên Douban, tuy nguồn mục tiêu ít, nhưng hễ trúng một cái là may mắn.

Gửi hồ sơ vào một công ty, là vì công ty đó phù hợp với ý nguyện của mình, đáng để phấn đấu, chứ không phải vì nó là một công ty. Giống như tìm bạn đời, không phải là để tìm một người phụ nữ bất kỳ. Muốn xác định công ty đó có phù hợp với ý nguyện của mình hay không, thì nên tìm hiểu nhiều hơn về công ty đó: nghiệp vụ chính, định hướng và quy hoạch phát triển trong tương lai, ngành nghề và vị thế, tình hình tài chính, đánh giá của giới chuyên môn và mạng lưới, v.v.

Trong quá trình phỏng vấn, khéo léo nhắc đến nghiệp vụ và suy nghĩ của công ty là điểm cộng. Cũng có thể dùng cho câu hỏi "Anh/chị có muốn hỏi gì không?"

### Khám phá kỹ thuật

Năng lực kỹ thuật là tố chất cơ bản của một người làm kỹ thuật. Vì vậy, tôi cho rằng, dù sau này làm công việc gì, năng lực kỹ thuật vững vàng vẫn luôn là thứ không thể thiếu, không thể xem nhẹ.

Nguyên lý và tư tưởng thiết kế là những thứ tinh túy nhất trong công nghệ phần mềm. Nói chung công nghệ phần mềm có thể chia thành hai phương diện:

- Nguyên lý: quy luật và quy trình cơ bản để sự vật hoạt động;
- Kiến trúc: nghệ thuật tổ chức logic quy mô lớn.

**Khám phá kỹ thuật, nhất định phải hiểu nguyên lý trước. Không hiểu nguyên lý thì sẽ chỉ nổi trên bề mặt, không thể thực sự nắm vững. Nghiên cứu nguyên lý kỹ thuật phải nắm đến mức nào? Cấu trúc dữ liệu và thiết kế thuật toán, các yếu tố cân nhắc, cơ chế kỹ thuật, tư duy tối ưu. Phải tua lại trong đầu cho đến khi mọi chi tiết hiện rõ ràng. Nếu có thể trình bày rõ ràng, có logic thì càng tốt.**

**Nghiên cứu nguyên lý kỹ thuật, nhất định phải đọc mã nguồn. Đọc mã nguồn và không đọc mã nguồn là có khác biệt. Không đọc mã nguồn, tuy nói được, nhưng cuối cùng vẫn cách một lớp giấy; đọc mã nguồn rồi, mới chọc thủng lớp giấy đó, có sự hiểu biết của riêng mình, cũng sẽ nói có phần tự tin hơn. Tất nhiên, cũng có thể là do tôi thiếu khả năng diễn xuất.**

Cá nhân tôi không tán thành kiểu phỏng vấn luyện bài (刷题). Dù luyện bài đúng là con đường tắt để vào được nhà máy lớn, nhưng cũng có nhược điểm:

- Đó vẫn là hệ thống kiến thức của người khác, chứ không phải hệ thống kiến thức do chính mình tổng kết;
- Khám phá kỹ thuật là để chuẩn bị cho công việc tương lai, chứ không phải để đối phó nhu cầu nhất thời, nếu không thì dù vào được rồi vẫn sẽ rơi vào trạng thái tê liệt, chủ quan.

Sau khi hệ thống hóa, tôi dần hình thành cấu trúc hệ thống kỹ thuật phù hợp với bản thân: ["Đề cương về tư tưởng và cơ chế kỹ thuật thường dùng cho phía máy chủ ứng dụng Internet"](https://www.cnblogs.com/lovesqcc/p/13633409.html). Trên nền tảng này, lại học hỏi điểm mạnh của nhiều nơi, xem các câu hỏi phỏng vấn để tự kiểm tra và bù đắp thiếu sót, là cách thức phù hợp hơn. Tôi sẽ cày sâu trên hệ thống này.

### Khả năng diễn đạt

Hiện nay, hình thức phỏng vấn chủ yếu của đại đa số doanh nghiệp là giao tiếp bằng lời nói, một số ít doanh nghiệp có thể có bài thi viết hoặc thi trên máy tính. Hình thức giao tiếp bằng lời nói có những hạn chế nhất định. Yêu cầu về khả năng diễn đạt khá cao, mà việc làm nổi bật năng lực chuyên môn lại không rõ ràng. Độ sâu và độ rộng của chuyên môn và kinh nghiệm mà một người nắm giữ, rất khó thể hiện qua vài phút trình bày. Thường độ sâu và độ rộng càng lớn thì càng khó diễn đạt. Mà người làm kỹ thuật lại thường xem nhẹ việc diễn đạt.

Bình thường tôi viết nhiều nói ít, nói năng không được lưu loát. Đôi khi chưa nói rõ bối cảnh đã triển khai ngay, kèm theo sự lan man, nhảy cóc và vòng đi vòng lại (kiểu này có lẽ phù hợp hơn để viết tiểu thuyết), khiến người phỏng vấn nhiều lúc không hiểu đầu cua tai nheo. Tính mạch lạc và rõ ràng của diễn đạt cũng rất quan trọng. Chi bằng tự kiểm tra một chút: Kiến trúc thiết kế của Dubbo như thế nào? Cơ chế bền vững hóa (persistence) của Redis như thế nào? Rồi tự trả lời thử xem.

Quy luật cơ bản của khả năng diễn đạt:

- Tổng trước, chi tiết sau; toàn bộ trước, bộ phận sau;
- Nói tư tưởng cơ bản trước, rồi nói tối ưu;
- Thể hiện tính tương tác. Trước tiên tổng hợp trình bày, rồi hỏi người phỏng vấn muốn nghe về phương diện nào, sau đó mới trình bày chi tiết. Tránh việc dốc hết mọi thứ ra một lúc, khiến người phỏng vấn trở tay không kịp; với các câu hỏi tình huống về thiết kế hệ thống, hãy hỏi thêm nhiều yêu cầu, chẳng hạn yêu cầu về thời gian, yêu cầu về không gian, cần hỗ trợ lượng dữ liệu hay mức độ đồng thời bao nhiêu, có cần cân nhắc một số tình huống nào không, v.v.

### Các câu hỏi thường gặp

Phỏng vấn là quá trình hai bên hiểu nhau thông qua giao tiếp. Các câu hỏi trong phỏng vấn thay đổi muôn hình vạn trạng, nhưng có một số câu hỏi cần chuẩn bị trước.

Chẳng hạn "chuỗi N câu hỏi gặm nhấm tâm can" (灵魂N问):

- Vì sao anh/chị nghỉ việc ở XXX?
- Mức lương mong muốn của anh/chị là bao nhiêu?
- Anh/chị có một khoảng trống việc, có thể giải thích chuyện đó không?
- Kế hoạch nghề nghiệp của anh/chị như thế nào?

Các câu hỏi kỹ thuật tần suất cao:

- Kiến thức nền tảng: cấu trúc dữ liệu và thuật toán, mạng;
- Vi dịch vụ (microservice): hệ thống công nghệ, thành phần, hạ tầng, v.v.;
- Dubbo: kiến trúc tổng thể của Dubbo, cơ chế mở rộng, service export, reference, invoke, graceful shutdown, v.v.;
- MySQL: nguyên lý triển khai của index và transaction, tối ưu SQL, sharding database và sharding table;
- Redis: cấu trúc dữ liệu, cache, khóa phân tán (distributed lock), cơ chế bền vững hóa, cơ chế nhân bản;
- Phân tán (distributed): giao dịch phân tán, vấn đề nhất quán;
- Message middleware: nguyên lý, so sánh;
- Kiến trúc: phương pháp thiết kế kiến trúc, kinh nghiệm kiến trúc, design pattern;
- Tối ưu hiệu năng: JVM, GC, tối ưu hiệu năng ở tầng ứng dụng;
- Kiến thức nền tảng về đồng thời: ConcurrentHashMap, AQS, CAS, thread pool, v.v.;
- Đồng thời cao: IO đa kênh (IO multiplexing); các vấn đề và giải pháp về cache;
- Tính ổn định: tư tưởng và kinh nghiệm về tính ổn định;
- Vấn đề sản xuất: công cụ và phương pháp điều tra, xử lý sự cố.

### Vị trí trung - cao cấp

Nói thật, tôi có lẽ hơi thiếu tự tin. Tôi gửi hồ sơ với tâm thế "chăm chỉ làm một kỹ sư".

Với lập trình viên lớn tuổi, kỳ vọng của doanh nghiệp cao hơn. Mỗi lần tôi gửi vị trí "kỹ sư cao cấp" (senior engineer), tự động bị chuyển thành "chuyên gia kỹ thuật" hoặc "kiến trúc sư". Không có sức để phản bác, lại càng thấy áp lực. Phỏng vấn vị trí trung - cao cấp, cần chuẩn bị nhiều hơn:

- Anh từng có trải nghiệm dẫn dắt đội nhóm chưa?
- Trong X năm kinh nghiệm làm việc của anh, có bao nhiêu thời gian dành cho thiết kế kiến trúc?
- Quá trình kiến trúc diễn ra như thế nào? Anh có những tư tưởng thiết kế kiến trúc hay phương pháp luận nào?

Nếu không chuẩn bị, sẽ bị hỏi choáng váng, luống cuống mất bình tĩnh. Thực ra, có lẽ tôi vẫn còn tâm lý may mắn, đem vị trí "chuyên gia kỹ thuật" và "kiến trúc sư" phỏng vấn theo kiểu "kỹ sư cao cấp", nên đều thất bại cả. Rõ ràng, tôi đã đảo ngược thứ tự: lẽ ra nên phỏng vấn vị trí kỹ sư cao cấp theo tiêu chuẩn của "chuyên gia kỹ thuật" và "kiến trúc sư".

Thôi được, vậy thì dũng cảm đối mặt với khó khăn vậy! Tôi không phải là người sợ thử thách.

Ngoài ra, vị trí "chuyên gia kỹ thuật" và "kiến trúc sư" nên dành ít nhất một ngày để chuẩn bị. Những chuyên gia kỹ thuật và kiến trúc sư đã có kinh nghiệm phong phú có thể bỏ qua.

### Tâm thế tốt

Giữ được tâm thế tốt cũng vô cùng quan trọng. Tôi đã trải qua quá trình thay đổi tâm thế "lạc quan - mất tự tin - lấy lại tự tin".

Trong một thời gian rất dài, vì "mong cầu thành công gấp gáp", sợ hỏng chuyện khi trả lời không được một câu hỏi kỹ thuật nào đó, nên tôi cẩn thận, hơi căng thẳng, kết quả là những thứ đã hệ thống hóa thường nói không rõ ràng hoặc nói thiếu mạch lạc. Mang tâm thế "giành lấy offer" đi phỏng vấn thực sự rất khó chịu, cảm thấy mỗi buổi phỏng vấn đều bị động đến khổ sở, thậm chí có chút muốn "hạ mình cầu việc".

Đôi khi, tôi tự hỏi: sao lại lâm vào cảnh ngộ này nhỉ? Đáng lý ra lúc này mình phải có năng lực theo đuổi sự nghiệp mình yêu thích rồi chứ! Vẫn là bình thường hơi lơi lỏng, tầm nhìn hẹp hòi, tích lũy chưa đủ, dẫn đến tình cảnh bất lợi như hôm nay.

Tôi là người đúng giờ, cũng mong đối phương đúng giờ hết mức có thể. Các nhà phỏng vấn ở Hàng Châu cơ bản đều đúng giờ, dù có đến trễ cũng nằm trong phạm vi tâm lý có thể chấp nhận được. Sau khi trở về Vũ Hán phỏng vấn, nhịp độ có chút bị một số ít doanh nghiệp làm lệch đi. Có một hai lần, tôi thậm chí không xác định được khi nào người phỏng vấn mới vào buổi gọi. Tôi nghĩ, chẳng lẽ đây là "đãi ngộ" mà nhân tài nên nhận được sao? Tôi có cảm giác hơi bị xúc phạm. Nhưng tôi vẫn "rất hàm dưỡng" nói không sao. Nhưng tôi luôn cảm thấy: người phỏng vấn đến trễ, là bất kính với nhân tài. Bước vào một công ty không tôn trọng nhân tài, tôi có sự nghi ngờ. Chim đẹp chọn cây mà đậu, bề tôi giỏi chọn chủ mà thờ. Chẳng lẽ tôi có thể vì tình cảnh bất lợi hiện tại, mà buông bỏ một số nguyên tắc ranh giới cơ bản, khuất phục trước một offer không tôn trọng nhân tài sao?

Tôi nhận ra rằng: một người nên dùng thực lực của mình để giành lấy sự tôn trọng và quý trọng của đối phương, thì sự hợp tác về sau mới thuận lợi hơn. Nếu không, dù tiếc là không có duyên, cũng không thể miễn cưỡng giữ lại. Dù người khác có hoài nghi thế nào, cứ chuyên tâm rèn giũa thực lực, khai thác tài năng và ưu thế của mình, cuối cùng sẽ tỏa ra ánh sáng của riêng mình. Vì vậy, tâm thế của tôi lập tức chuyển biến: nên tập trung giao tiếp, hiểu biết đầy đủ với đối phương, giành lấy sự công nhận từ đáy lòng của họ, chứ không phải lấy một tấm vé vào cửa, trở thành công cụ làm việc.

Có một câu chuyện nhỏ "đá và ngọc": xem mình là nhân tài, và nỗ lực nâng cao bản thân, mới có thể nhận được "đãi ngộ của nhân tài"; xem mình là hòn đá bị bán rẻ, lơi lỏng nỗ lực, thì chỉ có thể nhận được "đãi ngộ của đá". Dù một người chưa chắc ngay lập tức có đủ năng lực của nhân tài, nhưng trong lòng mình, nên đứng từ góc nhìn của nhân tài để quan sát doanh nghiệp mình sắp vào, chứ không chỉ đơn thuần tìm một công việc "kiếm được nhiều tiền hơn".

Ngoài ra, lo lắng cũng là không cần thiết. Thực chất của lo lắng là khoảng cách giữa hiện thực và mục tiêu. Một người luôn có thể đánh giá mức độ hợp lý của mục tiêu và cách thức đạt được mục tiêu. Nếu mục tiêu quá cao, thì điều chỉnh cấp độ mục tiêu cho phù hợp; mục tiêu khả thi, thì đưa ra quyết định hợp lý, và thông qua nỗ lực bền bỉ cùng những bước tiến thích hợp để đạt được mục tiêu. Khả năng ra quyết định, nỗ lực và ra tay hành động đều có thể rèn luyện bền bỉ.

## Thử thách của phỏng vấn

Phỏng vấn người làm kỹ thuật vẫn nghiêng về kỹ thuật nhiều hơn, vì vậy độ sâu và độ rộng kỹ thuật vẫn cần chuẩn bị kỹ lưỡng. Hoàn cảnh của người phỏng vấn và ứng viên là khác nhau, một người phỏng vấn chỉ hỏi một số ít điểm, nhưng nhiều người phỏng vấn gộp lại chính là cả một mặt phẳng. Hiểu được điểm này, khi là người phỏng vấn, bạn đừng quên mình là ai, cho rằng mình giỏi hơn ứng viên.

Tôi phỏng vấn không nhiều doanh nghiệp, vì tôi đã có kế hoạch làm sự nghiệp giáo dục, dùng tiêu chí "đam mê và động lực" để trực tiếp lọc bỏ lời mời phỏng vấn của rất nhiều công ty. Ở Hàng Châu tôi cơ bản phỏng vấn các doanh nghiệp giáo dục, thậm chí cả cành ô liu mà Alibaba, Huawei, v.v. ném tới cũng từ chối khéo (dù chưa chắc tôi đã đậu). Dù cách làm hơi "ngang ngạnh, cứng nhắc", nhưng dồn nhiều tâm sức nhất vào ngành nghề và sự nghiệp mình mong đợi, mới là điều đáng giá.

Sự nghiệp giáo dục mà tôi quan niệm, không chỉ giới hạn ở giáo dục trực tuyến hay giáo dục K12 thường được nhắc đến hiện nay, mà là một hệ thống giáo dục, bất kỳ sự nghiệp nào có thể phát huy hiệu quả giáo dục tốt hơn, bao gồm nhưng không giới hạn ở giảng dạy, đọc sách, âm nhạc, thiết kế, v.v.

### Jie Li Bang Technology - Kỹ sư cao cấp

Công ty đầu tiên tôi phỏng vấn. Trò chuyện một hồi, không thấy hồi âm. Nhưng tôi cũng không để tâm lắm. Người phỏng vấn hỏi chủ yếu về những thứ thiên về nghiệp vụ giao dịch, sâu nhất là làm thế nào để đảm bảo tính nhất quán dữ liệu của ứng dụng.

Lúc bấy giờ, tôi giống như ném một viên sỏi nhỏ thăm dò trên đường, còn chưa ý thức được hoàn cảnh của mình.

### NetEase Cloud Music - Kỹ sư cao cấp

Tiếp theo là NetEase Cloud Music. Nhà máy lớn đúng là nhà máy lớn. Vòng một hỏi toàn về cơ chế liên quan đến cache, khóa phân tán, Dubbo, ZK, middleware MQ. Rất tiếc, do tích lũy về nguyên lý kỹ thuật của tôi bình thường còn quá ít, cơ bản là "hỏi một câu không biết hai câu", trượt một cách xuất sắc.

Lúc này, tôi bắt đầu ý thức được nền tảng kỹ thuật của mình còn rất mỏng, cũng bắt đầu quá trình học tập kỹ thuật rộng lớn và củng cố nền tảng, mổ xẻ nguyên lý và logic từ dưới lên, tiến hành hệ thống hóa tổng kết, cuối cùng bước đầu hình thành cấu trúc hệ thống kiến thức kỹ thuật phía máy chủ Internet của riêng mình.

### Ming Shi Tang - Chuyên gia kỹ thuật

Phỏng vấn vị trí kiến trúc sư. Hỏi tương đối nhiều hơn một chút, DB, Redis, v.v. Phản hồi là kỹ thuật cũng được, nhưng thiếu kinh nghiệm quản lý. Đây là lần đầu tiên tôi nhận ra bất lợi của việc lập trình viên lớn tuổi thiếu kinh nghiệm quản lý. Trong tuyển dụng tuyến chuyên gia kỹ thuật của các doanh nghiệp vừa và nhỏ, thường đi kèm yêu cầu về kinh nghiệm quản lý. Khi ứng tuyển cần chú ý.

Thiếu kinh nghiệm quản lý, phải làm sao? Suy nghĩ một thời gian, ý tưởng của tôi là:

- Thay đổi những gì có thể thay đổi; với những gì không thể thay đổi, hãy học nó. Ví dụ việc học nguyên lý kỹ thuật là thứ tôi có thể thay đổi, nhưng kinh nghiệm quản lý thuộc loại khó thay đổi trong một sớm một chiều, vậy thì tìm hiểu thêm chút lý luận cơ bản về quản lý.
- Khai thác kinh nghiệm liên quan từ trải nghiệm. Dù tôi không có kinh nghiệm thực tế chính thức dẫn dắt đội nhóm, nhưng có kinh nghiệm quản lý cơ bản mang dự án, dẫn dắt kỹ sư, kiểm soát một dòng nghiệp vụ nào đó. Hãy đào sâu trải nghiệm của mình nhiều hơn.

### ByteDance Education - Kỹ sư cao cấp

Phỏng vấn ByteDance Education, tôi tự đào cho mình không ít hố để nhảy vào.

Ví dụ người phỏng vấn hỏi, hãy kể một trải nghiệm dự án khiến anh có cảm giác thành tựu tương đối lớn. Tôi chọn dự án chu kỳ mua (subscription/cycle purchase) gần 4 năm trước. Dù đây là dự án tiêu biểu đầu tiên kể từ khi tôi vào Youzan, nhưng thời gian quá lâu, lại không có ghi chép chi tiết, nhiều chi tiết kỹ thuật đã quên, không còn rõ ràng. Tôi kể đến tư tưởng thiết kế "tích hợp hóa" khiến tôi ấn tượng sâu lúc đó, nhưng lại quên mất vì sao lúc đó lại có tư tưởng này (không ghi chép cẩn thận).

Lại ví dụ, một câu hỏi tình huống về lớp học, tôi hỏi dùng kiến trúc CS hay kiến trúc BS? Người phỏng vấn nói dùng kiến trúc CS vậy. Chẳng phải đây là tự đào hố cho mình sao? Rõ ràng mình không quen thuộc kiến trúc CS, hà cớ gì phải hỏi lựa chọn này, chi bằng trực tiếp trình bày theo kiến trúc BS. Ôi!

Phản hồi của ByteDance Education dành cho tôi là: business Sense khá tốt, năng lực thiết kế hệ thống cần nâng cao. Tôi thấy khá trung thực, khách quan. Vì vậy, cũng bắt đầu chú trọng việc đọc các bài viết về thực chiến thiết kế hệ thống và rèn luyện tư duy.

Kinh nghiệm rút ra:

- Khi làm dự án, phải ghi chép chi tiết tech stack, các quyết định kỹ thuật và lý do, chi tiết kỹ thuật của từng dự án, để chuẩn bị tốt cho phỏng vấn;
- Chuẩn bị trước hệ thống và dự án ấn tượng nhất, tiêu biểu nhất, tránh chọn những dự án cách thời điểm hiện tại quá lâu, thiếu ghi chép chi tiết;
- Chọn dự án và kiến trúc mình quen thuộc, ít nhất cũng tạo được ấn tượng đầu tiên tốt, nếu không ấn tượng trong mắt người phỏng vấn chính là anh chẳng biết gì cả.

### Migu Shumei - Kiến trúc sư

Trời ơi, một lúc ba vị người phỏng vấn kiểu phỏng vấn nhóm. Có lẽ là do trước đây tôi trải nghiệm quá ít. Có vẻ như doanh nghiệp nhà nước phỏng vấn vị trí cao cấp khá thích áp dụng hình thức này. Nghe nhiều điều sáng tỏ, nghe một chiều thì tối tăm mà. Các câu hỏi cũng rất rộng, từ nguyên lý cơ bản của ES, đến việc di chuyển dữ liệu giữa các phòng máy (data center). Có một số cơ chế kỹ thuật tuy đã học qua, nhưng không chắc chắn, không rõ ràng, trả lời cũng không tốt. Ví dụ tối ưu nguyên lý tìm kiếm của ES, sau khi kể xong inverted index, tôi không giải thích rõ được Term Index và Trie tree. Điều này cho thấy, biết không có nghĩa là thực sự hiểu. Chỉ khi trình bày rõ ràng, mạch lạc được tư duy và chi tiết, mới coi là thực sự hiểu.

Đáng nhớ nhất là, có một câu hỏi: anh có những tư tưởng kiến trúc nào? Đây là lần đầu tiên được hỏi về mảng thiết kế kiến trúc, tôi nhất thời có chút luống cuống. Dù bình thường có nhiều suy nghĩ, cũng có viết bài, nhưng chưa hình thành nên phương pháp luận tinh gọn có hệ thống, kết quả là trả lời khá lộn xộn.

### Tuya Smart - Kỹ sư cao cấp

Ứng tuyển Tuya Smart, vì tôi thấy doanh nghiệp này không tồi. Doanh nghiệp ưu tú ít nhất cũng nên giao tiếp thêm một chút, biết đâu sau này có cơ hội hợp tác! Cách nhìn nhận vấn đề nên rộng mở hơn, không được bó chặt trong một việc duy nhất mình nghĩ đến.

Ấn tượng tổng thể của Tuya Smart đối với tôi khá tốt. Người phỏng vấn cũng rất lịch sự, kiên nhẫn, hỏi rất nhiều về kiến trúc tổng thể, kỹ thuật và dự án, hỏi đến những chỗ tôi quen thuộc, trả lời cũng tạm được. Có lẽ kinh nghiệm của tôi vừa khớp với nhu cầu của họ chăng.

Nếu không phải vì thời điểm đó ý định làm giáo dục quá mãnh liệt, khả năng rất lớn là tôi sẽ vào làm tại Tuya Smart. Internet vạn vật (IoT) theo tôi nghĩ nên là một lĩnh vực rất thú vị.

### GenShiXue (跟谁学) - Chuyên gia kỹ thuật

"GenShiXue" cơ bản tôi đều trả lời được. Nhưng phản hồi là: khả năng nắm bắt trọng điểm khi đối mặt câu hỏi còn thiếu, khả năng tổng hợp sắp xếp kiến thức kỹ thuật cũng chưa đủ. Lúc đó tôi còn hơi bất phục, cho rằng mình viết nhiều bài viết như vậy, cũng coi là có không ít suy nghĩ, sao lại có thể nói là tổng kết chưa đủ? Chí ít cũng chỉ là có điểm mù kỹ thuật. Kỹ thuật như biển cả mênh mông, ai mà không có điểm mù?

Nhưng bây giờ nhìn lại, đúng là còn cách mức độ đáng lẽ mình phải đạt một khoảng. Tổng kết về nguyên lý cơ chế kỹ thuật và điều tra xử lý sự cố sản xuất chưa đủ, chưa đủ rõ ràng tỉ mỉ; tổng kết kinh nghiệm thực hành thiết kế cũng chưa đủ, chưa đủ hệ thống và vững chắc. Việc này vẫn cần phải làm sâu sắc, bền bỉ.

Ngoài ra, càng phỏng vấn nhiều, càng phát hiện khả năng diễn đạt của mình thực sự còn thiếu sót. Lan man, dễ bị kẹt vào một điểm rồi nói không ngừng, tách rời bối cảnh nói thẳng giải pháp, nhảy cóc, vòng đi vòng lại, rồi người phỏng vấn rất có thể mất kiên nhẫn. Nên tuân theo những logic cơ bản như "tổng trước, chi tiết sau", "tư tưởng cơ bản - triển khai - tối ưu" để trả lời sẽ tốt hơn. Khả năng diễn đạt thực sự rất quan trọng, không thể chỉ chăm chăm gõ code. Ngoài ra mỗi lần phỏng vấn doanh nghiệp giáo dục tôi đều không tránh khỏi căng thẳng, sợ lỡ mất cơ hội này.

Đây là doanh nghiệp thứ hai trực tiếp nói với tôi rằng tuổi tác và kinh nghiệm không tương xứng, làm sâu thêm nỗi lo về tuổi tác đã lớn của tôi, đến mức bắt đầu có chút không tự tin.

Vậy tôi đã lấy lại tự tin bằng cách nào? Có câu ngạn ngữ: "Giữ được rừng xanh, không lo không có củi đun". Kể cả tuổi tôi có lớn, nếu năng lực kỹ thuật của tôi được rèn giũa đủ vững vàng, không tin không tìm được một doanh nghiệp có thể công nhận tôi. Tệ lắm thì tôi đi làm dự án mã nguồn mở. Có năng lực kỹ thuật tốt, thì không nhất thiết phải giới hạn trong phạm vi doanh nghiệp để phát huy tác dụng, cũng không cần thiết bó hẹp trong nhận thức của những kẻ bị định kiến tuổi tác che mắt. Sự công nhận từ bên ngoài dĩ nhiên quan trọng, nhưng giá trị nội tại còn quý giá hơn rất nhiều so với bên ngoài.

### Yi Tong Wen Jiao - Kiến trúc sư

Cũng áp dụng hình thức 3 người phỏng vấn cùng lúc. Chủ yếu hỏi về trải nghiệm dự án, phương diện kỹ thuật hỏi không sâu lắm. Cá nhân tôi thấy trả lời cũng tạm được. Người phỏng vấn cũng hỏi các vấn đề liên quan đến thiết kế kiến trúc, tôi trả lời ở mức bình thường. Lúc này, tôi vẫn chưa ý thức được rằng mình đang phỏng vấn vị trí "kiến trúc sư" theo tiêu chuẩn của "kỹ sư cao cấp".

Người phỏng vấn khá ôn hòa, HR cũng tích cực liên lạc và trao đổi, cảm giác khá ổn. Chỉ là, tôi không chủ động hỏi ý kiến phản hồi, nên cũng không có tin tức gì sau đó.

### New Oriental - Kỹ sư cao cấp

Phỏng vấn New Oriental, chủ yếu vì khớp với kỳ vọng làm giáo dục của tôi, dù yêu cầu vị trí là làm hệ thống quản lý thông tin, cách nghiệp vụ trong mơ của tôi còn một khoảng cách nhất định. Qua trao đổi tìm hiểu, họ cần hơn là kỹ sư am hiểu mảng vận hành (ops), mà tôi lại vừa đúng không mấy quen thuộc với mảng vận hành, bình thường quan tâm cũng ít, vì vậy không phù hợp lắm với yêu cầu tuyển dụng thực sự của họ. Người phỏng vấn cũng rất ôn hòa, quê ở Nghi Xương, là nơi tôi học đại học, trải nghiệm phỏng vấn khá tốt.

Sau này phải dành chút thời gian học hỏi những thứ liên quan đến vận hành. Là một kỹ sư ưu tú và kiến trúc sư đủ chuẩn, cần học rộng và làm quen với các thành phần, middleware, triển khai vận hành, v.v. mà hệ thống sử dụng. Phải có tầm nhìn tổng quan, chỉ là tôi tỉnh ngộ có hơi muộn. Better later than never.

### ZOOM - Kỹ sư cao cấp

Một vị người phỏng vấn của ZOOM có lẽ là tệ nhất trong tất cả những người phỏng vấn tôi từng gặp. Tổng cộng có hai vị người phỏng vấn, một vị tỏ ra rất kiên nhẫn, vị còn lại bụng bự phệ, còn ngáp dài, vẻ mặt không mấy quan tâm đến buổi phỏng vấn và ứng viên. Tôi thầm nghĩ, anh không muốn phỏng vấn, thì sao còn đến làm gì? Anh tưởng ứng viên thấp kém hơn anh một bậc chắc? Đổi vị trí cho nhau, tôi có thể đánh bại anh. Nhưng tôi vẫn rất lịch sự, coi như không có chuyện gì xảy ra. Công ty đang chọn người, ứng viên cũng đang chọn công ty.

Nghĩ lại, ZOOM còn là phần mềm họp từ xa mà công ty chúng tôi dùng trong thời gian dịch bệnh. Ấn tượng cũng khá tốt, có những kỹ sư và người phỏng vấn như vậy nằm trong đó, tôi cũng bái phục. Chẳng lẽ ông ta là đại thần trong truyền thuyết? Theo tôi biết, nước ngoài về cơ bản áp đảo hạ tầng kỹ thuật phần mềm Internet của Trung Quốc, các framework, middleware, hạ tầng, v.v. mà đa số doanh nghiệp Trung Quốc dùng cơ bản là lấy của nước ngoài hoặc làm tùy biến, thực sự tự nghiên cứu thì rất ít, có gì mà tự mãn chứ?

### A You Culture - Kỹ sư cao cấp

A You Culture có bốn vòng phỏng vấn kỹ thuật. Trong đó vòng kỹ thuật đầu tiên khiến tôi ấn tượng khá sâu. Trông có vẻ, người phỏng vấn đặc biệt giỏi và quen thuộc với nguyên lý cơ chế của hệ điều hành. Rất nhiều câu hỏi tôi không trả lời được. Tưởng là trượt rồi, nhưng lại cho cơ hội lật lại hiệp đấu. Vòng phỏng vấn thứ hai hỏi về trải nghiệm dự án và vấn đề kỹ thuật là những thứ tôi rất quen thuộc. Người phỏng vấn thứ ba hỏi khá rộng, có câu trả lời được, có câu không trả lời được. Nhưng người phỏng vấn rất kiên nhẫn. Vị thứ tư là giám đốc kỹ thuật, cũng hỏi rất rộng và tỉ mỉ.

Tổng thể, không khí buổi phỏng vấn vẫn khá thoải mái. Tuy nhiên, nhu cầu tuyển dụng của A You lúc đó không mạnh, có lẽ hy vọng khi nào có cơ hội sau này thì liên lạc lại với tôi. Tiếc là lúc đó tôi đang chuẩn bị về Vũ Hán. Chủ yếu vì cân nhắc cha mẹ đã già, mong có thể bên cạnh cha mẹ nhiều hơn.

Nghĩ lại, tôi suy nghĩ vấn đề và đưa ra quyết định vẫn quá đơn giản, không giỏi tính toán và cân nhắc những bài toán phức tạp.

### Xiaomi - Chuyên gia/Kiến trúc

Ứng tuyển Xiaomi, chủ yếu vì vị trí rất giống với những gì làm tại Youzan trước đây, đều làm về trung tâm giao dịch. Lướt qua trang chủ Xiaomi, thấy những việc họ làm rất tuyệt, nhưng lại không mấy khớp với ý định ban đầu làm sự nghiệp giáo dục - văn hóa của tôi.

Ý định gia nhập Xiaomi không mạnh, buổi phỏng vấn cũng mất đi hơn nửa động lực. Tính cách này của tôi vẫn nên sửa một chút.

### Visual China Group - Kỹ sư cao cấp

Hỏi xoay quanh kỹ thuật, dự án và trải nghiệm. Nhìn tổng thể, độ sâu kỹ thuật không quá khó, mảng dự án cũng có đề cập. Người anh/chị tiền bối nhân sự (HR) rất ôn hòa, tôi tưởng sẽ bị "bắn phá" một trận về trải nghiệm của mình, kết quả là kể cho tiền bối nghe về dịch vụ sản phẩm và mô hình kinh doanh của Youzan, rồi lướt nhẹ qua một chút trải nghiệm của mình.

### iFLYTEK - Kiến trúc sư

Vòng một vòng hai, cảm giác người phỏng vấn không mấy hứng thú với buổi phỏng vấn được xếp lịch. Kiến trúc sư, ít nhất là một vị trí đòi hỏi rất cao về năng lực kỹ thuật và thiết kế. Vòng một có hỏi chút về kỹ thuật và kiến trúc, vòng hai xoay quanh nền tảng và những thứ không liên quan đến kỹ thuật của tôi, có vẻ quan tâm đến vẻ ngoài của tôi hơn, mà không mấy hứng thú với năng lực kỹ thuật và thiết kế của tôi. Trao đổi khá nông.

Năng lực dĩ nhiên có cao thấp, nhưng phép lịch sự cơ bản tôn trọng nhân tài thì không đổi. Tôn trọng nhân tài, là tập trung vào năng lực và học vấn của người tài, chứ không phải những thứ không mấy liên quan đến học vấn.

### QingTeng Cloud - Kỹ sư cao cấp

Phong cách phỏng vấn kỹ thuật của QingTeng Cloud rất ôn hòa. Cảm nhận được hương vị trao đổi thẳng thắn, cảm giác được công nhận. Cảm nhận được tâm trạng cầu hiền như khát của HR. Và điều này trùng khớp với quan điểm "nên dùng thực lực của mình để giành lấy sự tôn trọng và quý trọng của đối phương" mà trước đó tôi cho là đúng.

### Tencent Meeting - Kỹ sư cao cấp

Phỏng vấn với người phỏng vấn của Tencent bằng phần mềm Tencent Meeting cho chính vị trí Tencent Meeting. Haha. Do mạng không mấy ổn định, buổi phỏng vấn đầy sự trắc trở, một câu chưa nói trọn vẹn đã không nghe rõ nữa. Có thể tưởng tượng tình huống ra sao. Nhưng cả hai chúng tôi đều rất rất rất kiên nhẫn, cuối cùng cùng nhau hoàn thành vòng một. Phỏng vấn là cuộc so tài trí tuệ và sức mạnh của hai bên, càng là việc hai bên cùng nhau hoàn thành một việc, phát hiện ra sự hợp tác của nhau. Nghĩ vậy, quan niệm "sàng lọc một chiều" truyền thống về phỏng vấn cần phải đổi mới.

Vì tôi đã nhận được offer, và công việc Tencent Meeting cũng không mấy khớp với ý định ban đầu của mình, nên tôi đã trao đổi với phía Tencent, dừng vòng hai.

### Lựa chọn cuối cùng

Khi cầm trên tay nhiều offer, chọn thế nào? Cá nhân tôi chủ yếu xem trọng:

1. Đam mê và động lực;
2. Mức lương, đãi ngộ;
3. Triển vọng phát triển của công ty và không gian phát triển cá nhân;
4. Không khí làm việc;
5. Doanh nghiệp nhỏ nhưng có sức chiến đấu.

Giữa Visual China Group và QingTeng Cloud thì chọn thế nào? So sánh một chút:

- Mức lương, đãi ngộ: mức đãi ngộ của cả hai là tương đương nhau, đều là công nhận tôi; Visual China Group đưa ra vị trí Leader, còn QingTeng Cloud đưa ra lời cam kết về nghiệp vụ cốt lõi;
- Không khí làm việc: QingTeng Cloud có lẽ thiên về văn hóa kỹ sư hơn, còn Visual China Group thiên về nghiệp vụ hơn;
- Tính thử thách: thử thách kỹ thuật của QingTeng Cloud mạnh hơn, còn thử thách nghiệp vụ của Visual China Group mạnh hơn;
- Đam mê và động lực: Visual China Group phù hợp hơn với việc tôi muốn làm những việc về văn hóa, còn QingTeng Cloud về bảo mật không khớp với ý định ban đầu làm sự nghiệp giáo dục - văn hóa của tôi, mà thiên về kỹ thuật và tầng nền tảng (tôi càng mong muốn làm những điều mang tính nhân văn hơn). Nhưng QingTeng Cloud làm những việc về bảo mật, mà bảo mật là một việc rất có giá trị, rất có ý nghĩa. Hơn nữa, sau này bảo mật cũng có thể phục vụ cho ngành giáo dục. Có chút hương vị "cứu nước bằng đường vòng". Đặc biệt là niềm tin duy tâm, lý tưởng hóa của nhà sáng lập Trương Phúc "để ánh sáng bảo mật chiếu rọi đến từng góc của Internet" cùng việc bản thân ông tự mình thực hành, khiến người ta càng thêm xúc động. Cuối cùng, tôi thấy làm bảo mật còn hơn hẳn làm bảo hộ bản quyền hình ảnh một chút.

Ngoài ra, tôi thấy làm giáo dục, thì phù hợp với tôi hơn cả là giáo dục lập trình, hoặc giáo dục cho kỹ sư. Tôi còn muốn trở thành một nhà thiết kế hệ thống. Còn cần tích lũy thêm nhiều kinh nghiệm thực chiến sản xuất. Có thể giao lưu nhiều hơn với các kỹ sư cấp trung, cấp thấp, làm công tác đào tạo, chỉ dẫn nội bộ trong doanh nghiệp. Hoặc ngoài giờ làm ghi hình video, tải lên Bilibili, phục vụ đông đảo khán giả. Tương lai, có lẽ tôi sẽ viết một cuốn sách về thiết kế lập trình, hội tụ những gì học được cả đời.

Vì vậy, sau một ngày cân nhắc thận trọng, tôi quyết định gia nhập QingTeng Cloud Security. Tất nhiên, khi đưa ra lựa chọn này, đồng nghĩa với việc tôi chọn một thử thách lớn hơn: ở mảng bảo mật tôi gần như tay trắng, cần học rất rất nhiều kiến thức và kinh nghiệm, với một lập trình viên lớn tuổi như tôi, đây là một thử thách không nhỏ.

## Tổng kết

Rất nhiều việc đều có cách giải quyết, kể cả chuyện lập trình viên lớn tuổi "đau đầu" đi tìm việc cũng không ngoại lệ. Xác lập mục tiêu rõ ràng, đưa ra quyết định khoa học hợp lý, nỗ lực bền bỉ, nắm vững các mặt cơ bản, ra tay thích hợp, cuối cùng sẽ hái được quả thắng lợi. Nhưng phải nhấn mạnh một điều: công phu ở sự thường ngày. Bình thường không tích lũy tốt, thì khi phỏng vấn sẽ phải tốn nhiều thời gian hơn để học, sẽ vấp ngã, trắc trở, và sống cũng không mấy thoải mái. Vẫn nên dàn trải vào ngày thường thì tốt hơn. Ngoài ra, bình thường tầm nhìn cũng phải giữ cho rộng mở, tuyệt đối đừng đến lúc phỏng vấn mới "chợt tỉnh ngộ".

Một kinh nghiệm quan trọng là, phải giỏi học hỏi từ thất bại. Chính nhờ quá trình học tập, suy nghĩ, tích lũy và chắt lọc liên tục trong bốn tháng trống việc ở Hàng Châu, cùng với việc suy ngẫm về những lần phỏng vấn thất bại, không ngừng điều chỉnh đối sách, hoàn thiện chuẩn bị, khắc phục những điểm yếu vốn có, áp dụng cách thức hợp lý hơn, mới có thể nhận được offer khá hài lòng chỉ trong vỏn vẹn hai tuần sau khi trở về Vũ Hán.

Ngoài ra, đáng nhắc đến là, với người làm kỹ thuật, viết blog là một việc rất có giá trị. Phỏng vấn thông qua giao tiếp để hiểu về đối phương, có giới hạn của nó. Việc phỏng vấn không sàng lọc được nhân tài phù hợp thực ra có xác suất khá lớn:

1. Thời gian phỏng vấn rất ngắn, dù là người phỏng vấn rất có kinh nghiệm, cũng có thể nhìn lầm người (giới hạn căn bản);
2. Người phỏng vấn hỏi đúng vào chỗ mình không biết (vấn đề may rủi);
3. Người phỏng vấn tâm trạng không tốt, không có hứng thú (vấn đề may rủi);
4. Trình độ của chính người phỏng vấn.

Vì vậy, có thực tài thực học mà vẫn bị loại (PASS), không đáng phải buồn. Ý nghĩa của việc viết blog nằm ở chỗ, có thêm nhiều chiều kích để thể hiện suy nghĩ và công việc thường ngày của mình.

Doanh nghiệp tôn trọng nhân tài, nhất định hy vọng nhận biết ứng viên từ nhiều phương diện (giữa ưu điểm và nhược điểm chọn lựa xác nhận có phù hợp với kỳ vọng hay không), bao gồm cả blog; doanh nghiệp không tôn trọng nhân tài, thì có khuynh hướng dùng cách lười biếng, không quan tâm đến tài năng thực sự của ứng viên, dùng một số tiêu chuẩn bên ngoài để lọc nhanh, tuy có hiệu quả, nhưng cuối cùng năng lực nhận diện nhân tài cũng chẳng tiến bộ được bao nhiêu.

Trải qua đoạn thử thách phỏng vấn này, tôi cảm thấy so với bản thân lúc mới nghỉ việc, mình đã lại có không ít tiến bộ. Không nói đến lột xác hoàn toàn, thì ít nhất cũng tróc được một lớp da. Khoảng cách, khoảng cách vẫn còn đó. Chí ít là còn cách các chuyên gia kỹ thuật và kiến trúc sư của những doanh nghiệp nhà máy lớn nổi tiếng kia một khoảng. Điều này liên quan đến mức độ thử thách trong công việc thường ngày của tôi, giới hạn của tầm nhìn nhận thức và việc tổng kết chưa đủ. Lần sau, tôi hy vọng tích lũy đủ thực lực để làm tốt hơn, và tiến gần hơn một chút nữa đến những điều có giá trị, có ý nghĩa mà trái tim mình yêu thích.

Phỏng vấn, thực ra cũng là một đoạn trải nghiệm làm việc.

<!-- @include: @article-footer.snippet.md -->
