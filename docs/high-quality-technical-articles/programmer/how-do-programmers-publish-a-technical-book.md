---
title: Lập trình viên xuất bản một cuốn sách kỹ thuật như thế nào
description: "Lập trình viên xuất bản một cuốn sách kỹ thuật như thế nào: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, trình bày các khái niệm cốt lõi, vấn đề thường gặp và điểm thực hành, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
author: hsm_computer
tag:
  - 程序员
head:
  - - meta
    - name: keywords
      content: 程序员出书,技术书籍出版,出版社合作,图书公司,写书技巧,稿酬收益,技术写作,畅销书
---

> **Lời giới thiệu**：Hướng dẫn chi tiết cách lập trình viên bắt đầu từ con số 0 để xuất bản một cuốn sách của riêng mình.
>
> **Địa chỉ bài viết gốc**：<https://www.cnblogs.com/JavaArchitect/p/12195219.html>

Khi đi phỏng vấn hoặc liên hệ công việc phụ, nếu có thể chứng minh thực lực của mình một cách thuyết phục thì rất có khả năng đạt được hiệu quả gấp đôi với nửa công sức. Làm sao để chứng minh thực lực? Thứ có sức thuyết phục nhất chính là sự chứng nhận từ vị trí tại các công ty lớn, không có thứ nào sánh bằng, chẳng hạn như đảm nhiệm vị trí kiến trúc sư (architect) cao cấp tại BAT, thì những lời khác thậm chí không cần nói thêm.

Tuy nhiên, không phải ai sau khi nhập việc cũng ngay lập tức là kiến trúc sư ở công ty lớn. Trên con đường phấn đấu, bạn còn có thể chứng minh bản thân thông qua các kênh như tài khoản công khai (公众号), blog chuyên mục, số lượng code trên GitHub, cũng như xuất bản sách và quay video. So với các cách khác, cuốn sách kỹ thuật của riêng mình nhờ được sự bảo chứng của nhà xuất bản cấp quốc gia nên tương đối dễ khiến người khác công nhận thực lực của bạn hơn. Với một số công ty nhỏ, một cuốn sách của chính mình thậm chí có thể coi là tấm vé miễn phỏng vấn. Vì vậy, trong bài viết này, tôi sẽ cùng các bạn lập trình viên trò chuyện về những điều liên quan đến việc xuất bản sách kỹ thuật.

## 1. Không phải có năng lực rồi mới xuất bản sách, mà là nâng cao năng lực trong quá trình xuất bản sách

Tôi biết không ít bạn bè đã xuất bản cuốn sách đầu tiên trong vòng 3 năm làm việc, thậm chí có những người xuất sắc còn xuất bản sách ngay từ thời còn đi học.

So với điều đó, còn có một thái độ khác: nhiều bạn có thể nghĩ rằng phải đợi tích lũy kỹ thuật đến một mức độ nhất định rồi mới viết. Thực ra điều này có lẽ không mấy tích cực. Vừa viết sách vừa nâng cao kỹ thuật, và cuốn sách viết ra còn giúp ích cho người khác — điều này chắc chắn có thể làm được.

Ví dụ, có bạn muốn tìm hiểu sâu về phân tích dữ liệu Python và học máy (machine learning) vốn đang khá hot gần đây, thì sau khi học tập một cách có hệ thống, bạn có thể tổng hợp lại các case về crawler (trình thu thập dữ liệu), phân tích dữ liệu và học máy đã học trước đó, sắp xếp lại dựa trên hiểu biết của mình theo cách phù hợp với người mới bắt đầu, rồi sau đó có thể xuất bản sách. Loại sách này có thể không giúp ích nhiều cho người có kinh nghiệm, nhưng vì chứa đựng các case nên chắc chắn hữu ích với độc giả ở cấp độ mới bắt đầu, bởi đây là kiểu "dùng chính trải nghiệm của mình để nói chuyện". Và nói lại, nếu không có động lực xuất bản sách, thì quá trình học tập có thể chỉ dừng ở mức biết sơ qua, hoặc chưa chắc đã toàn tâm toàn ý đầu tư. Có mục tiêu xuất bản sách thì hiệu quả học tập càng được đảm bảo hơn.

## 2. Những cuốn sách phù hợp với developer mới vào nghề, developer cao cấp và kiến trúc sư

Như đã đề cập trước đó, developer mới vào nghề thích hợp viết sách case. Lấy chủ đề crawler Python - phân tích dữ liệu - học máy làm ví dụ, bạn có thể tìm vài cuốn sách có sẵn về chủ đề này. Trong những cuốn sách đó, có thể nội dung các chương khác nhau, nhưng nếu gộp chung lại xem thì có thể bao trùm được nội dung của chủ đề này. Sau đó hãy tham khảo cách triển khai trong sách của người khác, ví dụ một chương viết về crawler, một chương viết về pandas, một chương viết về matplotlib, v.v., gộp tất cả lại, bạn có thể dùng nhiều chương để tạo thành một cuốn sách. Tóm lại, người khác viết những nội dung gì thì bạn đừng chép y nguyên, nhưng có thể tham khảo họ viết những điểm kỹ thuật nào.

Sau khi xác định các chương, hãy xác định các mục nhỏ trong từng chương. Ví dụ chương ba viết về case crawler, thì có thể đặt mục 3.1 viết về khái niệm crawler, 3.2 viết về cách cài đặt thư viện Scrapy, 3.3 viết về cách phát triển case crawler với Scrapy. Bằng trình tự từ chương đến mục như vậy, bạn có thể xác định được khung của cả cuốn sách. Vì là sách case, nên trước tiên đưa ra code đã chạy được, rồi dùng những case code này để dạy người mới bắt đầu nhập môn. Vì vậy case không nhất thiết phải quá sâu, nhưng cần để người mới học xem là hiểu, và sau khi lần lượt học theo hệ thống kiến thức bạn đưa ra, có thể hiểu được nội dung của chủ đề này. Đồng thời, sau khi đọc xong cuốn sách của bạn, bạn đọc có thể thông qua việc chạy thành công các case crawler, học máy... mà bạn đưa ra để nắm được kiến thức trong lĩnh vực này, và có thể đảm nhận việc phát triển cơ bản trong lĩnh vực này. Với developer mới vào nghề, chỉ cần chịu khó một chút, bỏ chút thời gian, mục tiêu này không khó để đạt được.

Còn với developer cao cấp và kiến trúc sư, ngoài việc viết sách case thuần túy, bạn còn có thể đưa vào sách những kinh nghiệm phát triển đúc kết được ở các công ty lớn, tức là những "cái hố" đã giẫm phải, chẳng hạn như khi dùng matplotlib của Python để vẽ chú giải (legend), có những mẹo nào khi thiết lập trục tọa độ, khi thiết lập sẽ gặp những vấn đề thường gặp nào. Nếu trong sách chứa đựng nhiều kinh nghiệm kiểu này, thì giá trị của cuốn sách của bạn sẽ cao hơn.

Ngoài ra, developer cao cấp và kiến trúc sư còn có thể viết những cuốn sách có hàm lượng kỹ thuật cao hơn, chẳng hạn chỉ nói về kinh nghiệm thực tiễn trong các kịch bản có độ đồng thời (concurrency) cao, hoặc kinh nghiệm dùng k8s + docker để đối phó với độ đồng thời cao. Trong loại sách này, có thể đưa ra code, quan trọng hơn là đưa ra phương án triển khai và kỹ thuật kiến trúc, chẳng hạn chỉ nói về trong các kịch bản có độ đồng thời cao, cache nên chọn loại như thế nào, làm sao tránh được các tình huống như cache bị xuyên thủng (breakdown), tuyết lở (avalanche), làm sao để điều tra sự cố redis online, làm sao thiết kế phương án dự phòng ứng phó sự cố. Ngoài hướng này ra, còn có thể đi sâu vào chi tiết, chẳng hạn thông qua việc giảng giải code nền tảng của dubbo, mách mọi người cách cấu hình dubbo hiệu quả, khi gặp sự cố thì làm sao để điều tra. Nếu kiến trúc sư hoặc developer cao cấp có loại sách này làm sự bảo chứng, kết hợp với kinh nghiệm làm việc tại công ty lớn, thì càng có thể đánh bóng danh tiếng của mình.

## 3. Có thể tìm trực tiếp nhà xuất bản, cũng có thể tìm công ty xuất bản sách

Trong bài viết blog này của tôi, [Chuyện công việc phụ của lập trình viên: bàn về xuất bản sách và quay video](https://www.cnblogs.com/JavaArchitect/p/11616906.html), tôi đã trình bày sự khác biệt giữa việc xuất bản sách thông qua nhà xuất bản và xuất bản thông qua công ty xuất bản sách (图书公司), để các bạn tham khảo. Xem xong mọi người có thể tự quyết định cách thức xuất bản.

Tuy nhiên, dù chọn cách nào, trước khi xuất bản sách bạn cũng cần làm rõ một số điều. Có thể nhân viên của một số công ty xuất bản sách sẽ không chủ động nói ra, nên bạn cần tự hỏi cho rõ.

- Đối tác của bạn là ai? Công ty xuất bản sách hay nhà xuất bản?
- Cuốn sách của bạn sẽ được xuất bản tại nhà xuất bản nào? Trong nước có tiếng nhất là Thanh Hoa (清华), Nhân Dân Bưu Điện (人邮), Điện Tử (电子) và Cơ Giới (机械). Các nhà xuất bản khác không thể nói là không tốt, nhưng trong ngành người ta công nhận bốn nhà này nhất.
- Người giao tiếp với bạn là biên tập viên sách có quyền quyết định cuối cùng, hay là nhân viên của công ty xuất bản sách? Nói thêm một câu, người cuối cùng quyết định cuốn sách có được xuất bản hay không, cũng như xác định ý kiến sửa đổi, chính là biên tập viên của nhà xuất bản.

Thông qua việc so sánh nhà xuất bản và công ty xuất bản sách, sau khi làm rõ nhiều chi tiết, mọi người có thể tự cân nhắc cách thức hợp tác. Và thông tin liên hệ của nhà xuất bản và công ty xuất bản sách đều có trên trang web chính thức; mọi người có thể tự liên hệ qua email hoặc các cách khác.

## 4. Nếu người khác lấy bạn làm vật thử sai, hoặc có thái độ thiếu tôn trọng, hãy nhanh chóng cắt lỗ

Trước đây tôi từng thấy có công ty xuất bản sách tuyển tác giả cho cuốn sách dành cho người mới học Java, và tôi cũng chủ động liên hệ với những người có liên quan. Phản hồi nhận được hầu hết đều là: "phải viết lại".

Chẳng hạn tôi đưa ra dàn ý, thì nhận được phản hồi "phải viết lại", nguyên nhân là đối phương chưa học qua Java, nhưng với tư cách người không có nền tảng, họ xem dàn ý của tôi mà thấy không thể học được. Còn phải viết lại thành hình dạng như thế nào thì đối phương cũng không nói rõ được, tóm lại bảo tôi đưa thêm một bản dàn ý nữa. Sau khi đưa thêm một bản, cũng vẫn không qua, lần này khá hơn một chút, họ đưa cho tôi dàn ý của vài cuốn sách tương tự khác, bảo tôi tự xem người khác có những điểm hay nào. Tóm lại họ không nêu ra (hoặc không nêu được) những điểm cải thiện cụ thể, mà bảo tôi tự thử các cách cải thiện khác nhau, thử đến khi đối phương cảm thấy ổn thì thôi.

So với điều đó, khi tôi trao đổi với các biên tập viên nhà xuất bản chuyên nghiệp, dù dàn ý hay bản thảo có vấn đề, họ cũng sẽ chỉ ra đúng điểm cụ thể và đưa ra ý kiến sửa chữa cụ thể. Tôi không rõ cơ cấu tổ chức bên trong các công ty xuất bản sách, nhưng trong nhà xuất bản, sách máy tính có bộ phận chuyên trách riêng, biên tập viên chuyên trách riêng, và những ý kiến họ đưa ra đều khá chuyên nghiệp và rất có tính khả thi trong việc sửa chữa.

Ngoài ra, tôi thỉnh thoảng thấy trên các kênh khác nhau có nhân viên của công ty xuất bản sách phơi bày bản thảo người khác giao nộp, giữa chốn đông người chỉ ra bản thảo có những vấn đề gì, ý là để mọi người lấy đó làm bài học. Tạm không bàn đến động cơ của việc làm này, và nhân viên này cũng đã che đi những thông tin có thể nhận diện danh tính tác giả. Nhưng tác giả vì tin tưởng nên mới giao bản thảo vào tay bạn, vậy mà lại công khai bản thảo khi chưa được sự đồng ý của tác giả, nói là "không coi tác giả ra gì" cũng không phải là quá đáng. Nếu không, hoàn toàn có thể dùng tin nhắn riêng để trao đổi với tác giả, thay vì công khai lỗi sơ suất vô tình của tác giả trước mọi người.

Khi hợp tác với các nhà xuất bản, chuyện như vậy tuyệt đối chưa từng xảy ra với tôi, và các biên tập viên nhà xuất bản mà tôi quen đều giữ sự tôn trọng đầy đủ đối với các tác giả. Và khi tôi, bạn bè tôi cùng nhiều người bạn ở các công ty xuất bản sách trao đổi, cũng nhận được sự tôn trọng và lễ độ. Vì vậy, nếu mọi người khi viết sách, đặc biệt là khi viết cuốn sách đầu tiên, gặp phải tình huống bị coi là vật thử sai, hoặc cảm nhận từ lời ăn tiếng nói rằng đối phương không coi bạn ra gì, thì có thể lập tức cắt lỗ. Thực ra cũng không có gì là "mất mát" cả, khi bạn mang dàn ý và bản thảo hiện tại đi trao đổi với biên tập viên nhà xuất bản, có khi thu nhập của bạn còn có thể được nâng lên.

## 5. Làm sao viết tốt một chương dài khoảng 30 trang?

Sau khi ký hợp đồng viết sách với nhà xuất bản, bạn có thể bắt đầu sáng tác. Một cuốn sách được tạo nên từ các chương. Ở đây tôi sẽ nói về cách suy nghĩ và sáng tác một chương.

Ví dụ viết chương crawler, khoảng 30 trang, trước tiên xác định các mục (节) và đề mục (目). Chẳng hạn mục 3.1 "cài đặt môi trường crawler" là mục, còn 3.1.1 "tải gói Python Scrapy" là đề mục. Trước tiên xác định nội dung cần viết. Cụ thể với mục crawler, có thể viết: 3.1 cài đặt môi trường, 3.2 các module quan trọng của Scrapy, 3.3 cách phát triển crawler Scrapy, 3.4 sau khi phát triển xong thì chạy như thế nào, 3.5 làm sao đưa thông tin thu thập được vào cơ sở dữ liệu — tất cả những điều này đều là mục.

Cụ thể hơn nữa đến đề mục, ví dụ trong mục 3.5: 3.5.1 viết cách cài đặt môi trường cơ sở dữ liệu, 3.5.2 viết cách kết nối cơ sở dữ liệu trong Scrapy, 3.5.3 đưa ra case thực tế, 3.5.4 đưa ra các bước chạy và kết quả minh họa.

Như vậy là đã dựng được khung của một chương. Trong mỗi mục nhỏ, trước tiên đưa ra code chạy được và có thể minh họa vấn đề, rồi đưa ra phần giải thích code, tiếp đó viết cách cấu hình code, khi phát triển cần lưu ý những vấn đề gì. Khi cần thiết, dùng bảng và hình vẽ để minh họa. Với mạch trình bày như vậy, nhiều nhất 3 tuần có thể hoàn thành một chương, nhanh thì một tuần rưỡi xong một chương.

Cứ theo cách đó, một cuốn sách có khoảng 12 chương. Chương một có thể viết về cách cài đặt môi trường và cú pháp cơ bản, những chương sau đó có thể đi từ nông đến sâu, mỗi chương một chủ đề. Ví dụ với Python crawler: chương hai có thể viết cú pháp cơ bản, chương ba viết giao thức http cùng các điểm kiến thức về crawler, cứ thế đi sâu dần, trình bày trọn vẹn các kỹ năng như crawler, phân tích dữ liệu, hiển thị dữ liệu và học máy.

Tính theo cách này, nếu xuất bản cuốn sách đầu tiên, trung bình mỗi tháng hoàn thành 2 chương, khoảng nửa năm đến tám tháng là có thể hoàn thành một cuốn sách. Đường đi là: trước tiên dựng hệ thống kiến thức của cuốn sách, khi viết từng chương thì dựng khung của từng điểm kiến thức, trong các mục và đề mục, dùng cách kết hợp code với giải thích, đi từ đơn giản đến khó. Như vậy mọi người có thể hoàn thành cuốn sách đầu tiên của riêng mình.

## 6. Làm sao viết ra một cuốn sách có doanh số vượt 5.000 bản

Hiện nay sách giấy thường in một lần khoảng 2.500 bản, và hầu hết các cuốn sách chỉ in một lần, bán hết là hết. Nếu có thể tiêu thụ được 5.000 bản thì đã thuộc loại được ưa chuộng; nếu doanh số vượt 10.000 bản thì có thể nói là sách đẳng cấp thần thánh. Ở đây tạm không bàn đến sách đẳng cấp thần thánh, chỉ nói cách viết một cuốn sách bán chạy vượt 5.000 bản.

1 Tốt nhất là bám sát điểm nóng, chẳng hạn các điểm nóng hiện nay là full-stack development (phát triển full-stack) và machine learning (học máy), v.v. Làm sao tìm điểm nóng? Hãy đến các nơi như JD.com xem từ khóa của các cuốn sách bán chạy. Khi thực hiện cụ thể, hãy trao đổi nhiều với biên tập viên nhà xuất bản. Có thể tác giả thường phân tích từ góc độ kỹ thuật, nhưng biên tập viên nhà xuất bản lại cân nhắc vấn đề từ góc độ thị trường.

2 Nếu cuốn sách của bạn có thể được các tổ chức đào tạo dùng làm giáo trình, thì muốn không bán chạy cũng khó. Các tổ chức đào tạo thường dùng những giáo trình nào? Thứ nhất hướng đến người mới bắt đầu, thứ hai code đầy đủ toàn diện, thứ ba bao phủ đầy đủ các điểm kiến thức trong lĩnh vực này. Muốn đạt được điều này, mọi người có thể trao đổi trực tiếp với biên tập viên nhà xuất bản để hỏi các chi tiết liên quan.

3 Có thể viết văn sinh động, nhưng không được dùng lời văn quá hoa mỹ để che đậy sự thiếu sâu sắc của nội dung. Nói cách khác, sách bán chạy nhất định phải có "hàng thật", có thể giải quyết những vấn đề thực tế của người mới bắt đầu. Ví dụ với hướng Python machine learning, hãy viết một cuốn sách dùng các case bao trùm các thuật toán học máy thường dùng hiện nay, mỗi chương một thuật toán, và trong các case có các yếu tố như trực quan hóa (visualization), phân tích dữ liệu, crawler... Nếu hiệu quả trực quan hóa còn hấp dẫn được người xem, thì khả năng cuốn sách bán chạy cũng rất lớn.

4 Nhất định không được qua loa đại khái. Chạy thông code chưa đủ, còn phải cố gắng tối giản. Văn phần giải thích hướng vào người đọc nhiều hơn. Về nội dung, đảm bảo người đọc xem là hiểu ngay, và đọc xong có thu hoạch. Có thể điều này nghe có vẻ trừu tượng, nhưng tôi sau khi viết vài cuốn sách có cảm nhận sâu sắc rằng làm được điều này rất khó; đồng thời, nếu làm được, thì cuốn sách dù không bán chạy, ít nhất cũng không lừa dối người học trò.

## 7. Tổng kết: xuất bản sách chỉ là một cột mốc, lập trình viên trên con đường phấn đấu nên không ngừng nghỉ

Xuất bản sách không đơn giản, vì không phải ai cũng sẵn lòng bỏ thời gian và công sức viết sách mỗi tối, mỗi cuối tuần trong suốt nửa năm đến tám tháng. Nhưng xuất bản sách cũng không khó, dù sao thời gian đã đầu tư vào, xuất bản sách cũng chỉ là công việc debug code cộng với viết chữ, nhiều lắm thì thêm chút chi phí giao tiếp với người khác.

Thực ra thu nhập từ xuất bản sách không cao, tính ra trung bình mỗi tháng vào khoảng 3.000 tệ, nếu hợp tác với công ty xuất bản sách thì có khi còn ít hơn, nhưng dù sao điều này cũng có thể chứng minh thực lực của bạn. Tuy nhiên, sau khi xuất bản sách không được dừng lại ở đó, bởi trong các công ty lớn có quá nhiều người tài giỏi, thậm chí không cần dựa vào xuất bản sách để chứng minh thực lực.

Vậy làm sao để tối đa hóa lợi ích mà xuất bản sách mang lại? Thứ nhất, có thể dựa vào điều này để vào công ty lớn — khi phỏng vấn có cuốn sách của mình chắc chắn là điểm cộng. Thứ hai, có thể dùng nó để mở chuyên mục trên các trang web lớn, quay video, hoặc mở tài khoản công khai, dù sao có sự bảo chứng của nhà xuất bản thì càng khiến người khác tin tưởng năng lực của bạn. Thứ ba, càng phải dùng phương pháp học tập đã tích lũy được khi viết sách cùng tinh thần phấn đấu đi sâu nghiên cứu thêm những kỹ thuật cao cấp hơn. Có kỹ thuật rồi, không chỉ có thể vào công ty lớn kiếm nhiều tiền hơn, mà còn có thể kiếm tiền hiệu quả hơn thông qua các hình thức như đào tạo doanh nghiệp.

<!-- @include: @article-footer.snippet.md -->
