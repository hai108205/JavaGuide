---
title: Hướng dẫn xuất bản sách hiệu quả và thực hành tránh bẫy cho lập trình viên
description: "Hướng dẫn xuất bản sách hiệu quả và thực hành tránh bẫy cho lập trình viên: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, sắp xếp các khái niệm then chốt, vấn đề thường gặp và điểm mấu chốt thực hành, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
author: hsm_computer
tag:
  - 程序员
head:
  - - meta
    - name: keywords
      content: 程序员出书,出书避坑,稿酬收益,出版社编辑,图书公司,案例书写作,版权问题,技术写作
---

> **推荐语**：文章详细介绍了 lập trình viên xuất bản sách thường gặp một số vấn đề, rất khuyến khích những bạn có ý định xuất bản sách nên đọc bài viết này.
>
> **原文地址**：<https://www.cnblogs.com/JavaArchitect/p/14128202.html>

Người xưa có ba thứ bất hủ, đó là lập đức, lập công, lập ngôn. Nếu nói lập trình viên xuất bản một cuốn sách của riêng mình là "lập ngôn" thì có lẽ hơi quá cao cả, nhưng dù sao cũng là một việc tao nhã.

Thực ra xuất bản sách không kiếm được nhiều tiền, và chu kỳ từ lúc viết đến lúc cuối cùng nhận được tiền cũng không ngắn. Nhưng nếu lập trình viên có một cuốn sách kỹ thuật thuộc về mình, thì ít nhất trong phỏng vấn có thể chứng minh bản thân rất tốt, cũng có thể dần dần tích lũy được tiếng tăm trong ngành, khi phỏng vấn và làm những việc khác cũng có thêm nhiều tự tin. Trong bài viết này, tôi sẽ kết hợp kinh nghiệm của bản thân và những cái bẫy mình từng vấp phải, để cùng mọi người trò chuyện về những chuyện khi lập trình viên xuất bản sách.

## 1. Lợi nhuận nhuận bút và thời gian cần thiết khi xuất bản sách

Trước hết nói về lợi ích và cái giá phải trả khi xuất bản sách, ở đây tạm không bàn đến "tài sản vô hình mà xuất bản sách mang lại", mà trước hết nói về nhuận bút tiền thực.

Nếu liên hệ trực tiếp với nhà xuất bản, thông thường nhuận bút là bản quyền tác giả (royalty), bằng 8% giá sách nhân với số lượng in (hoặc số lượng bán thực tế), nếu bạn là cao thủ thì còn có thể tăng lên, nhưng nhìn chung bản quyền tác giả có lẽ cũng chỉ khoảng 10% đến 12%. Xin lưu ý ở đây giá là giá niêm yết (giá đầy đủ) của cuốn sách, không phải giá sau khi giảm giá.

Ví dụ một cuốn sách giá niêm yết là 70 tệ, trên JD.com và các nơi khác bán giảm giá 30%, thì bản quyền tác giả là 8% của 70 tệ, tức là bán được một cuốn tác giả có lợi nhuận 5,6 tệ, tất nhiên sau khi thực sự cầm được tiền còn phải trừ thuế.

Đồng thời cũng xin lưu ý hợp đồng quy định phương thức thanh toán nhuận bút là theo số lượng in hay số lượng bán thực tế. Tôi và nhà xuất bản thương lượng, thường là theo số lượng in, vậy khác nhau ở chỗ nào? Hiện nay sách ngành máy tính thường in lần đầu 2500 bản, thì số tiền thực nhận là 70*8%*2500, tất nhiên còn phải trừ thuế. Nhưng nếu tính theo số lượng bán thực tế, nếu in lần đầu mà chỉ bán được 1800 cuốn, thì phải tính tiền theo con số đó.

Hiện nay một cuốn sách 300 trang, giá niêm yết thường khoảng 70, tính theo bản quyền tác giả 8% và 2500 bản thì lợi nhuận trước thuế là 14000, sau thuế ước tính khoảng 12000. Với tác giả mới, một cuốn sách 300 trang ít nhất phải viết 8 tháng, từ đó mọi người có thể tính được lợi nhuận trung bình mỗi tháng, tính ra thực ra mỗi tháng chỉ khoảng 1500, thật sự không nhiều.

Tình hình của người khác tôi không dám khẳng định, nhưng sau khi tôi xuất bản sách, ngoài nhuận bút ra, còn có những lợi ích nào khác?

- Khi phỏng vấn ở công ty hiện tại và các công ty trước đó, nói với người phỏng vấn rằng tôi từng xuất bản sách trong lĩnh vực liên quan, người phỏng vấn sẽ trực tiếp đánh giá tôi rất dày dạn kinh nghiệm, giúp tôi tiết kiệm được không ít việc.
- Tôi còn làm đào tạo offline (trực tiếp), tôi trực tiếp dùng cuốn sách Python tôi vừa xuất bản làm giáo trình, khỏi phải chuẩn bị bài giảng nữa.
- Khi trao đổi dự án với người khác, có thể dùng sách của mình để chứng minh thực lực kỹ thuật, nếu là lần đầu tiếp xúc với người khác, thì cách chứng minh này có hiệu quả tức thì.

Đặc biệt là điểm đầu tiên, thực ra đối với một số công ty nhỏ hoặc một số vị trí phát triển cử phái (outsource), nếu ứng viên từng xuất bản sách trong lĩnh vực này, thậm chí có thể miễn phỏng vấn mà tuyển thẳng, bản thân tôi trước đây từng phỏng vấn một vị trí cử phái ở công ty lớn, và đã nhận được sự đối đãi như thế.

## 2. Thời điểm thanh toán nhuận bút và lợi nhuận khi in thêm

Tôi liên hệ trực tiếp với nhà xuất bản để xuất bản sách, thời điểm thanh toán nhuận bút thường là trong vòng 3 tháng sau khi in lần đầu sẽ nhận được một phần nhuận bút của lần in đầu tiên (cụ thể là 50% đến 90%), sau đó một năm sau khi sách được xuất bản sẽ nhận được phần nhuận bút còn lại. Hiện nay có khá nhiều sách, bán hết được số lượng in lần đầu đã là tốt, nhưng cũng có không ít sách được in thêm, thậm chí ra bản thứ hai và bản thứ ba, thông thường bản quyền tác giả của số lượng in thêm sẽ được thanh toán xong trong vòng nửa năm đến một năm sau khi in thêm.

Xét về thời điểm thanh toán nhuận bút, với tác giả quả thực có sự trì hoãn, thêm vào đó nhuận bút cũng không cao, so với công sức vất vả của tác giả, nên xuất bản sách thực sự không phải là chuyện kiếm tiền, mà chu kỳ nhận tiền lại còn dài. Nếu một số nhân viên công ty sách một mặt không giúp được gì cho tác giả trong giai đoạn xuất bản, mặt khác lại còn kiếm chênh lệch giá ở giữa, thì quả thực có phần vùi dập công sức vất vả của tác giả.

## 3. Những điều mắt thấy tai nghe khi làm việc với công ty sách

Trước khi giao tiếp với biên tập viên nhà xuất bản, tôi cũng từng trao đổi với nhân viên các công ty sách, nhiều nhân viên cũng khá tôn trọng tôi, tuy trao đổi không quá sâu nhưng cũng khách sáo. Tuy nhiên cuối cùng so với các điều kiện như nhuận bút mà nhà xuất bản đưa ra, tôi vẫn không xuất bản sách thông qua công ty sách, đó cũng là điều đáng tiếc. Dưới đây tôi sẽ nêu ra một số trải nghiệm cụ thể.

- Tôi thường nhận được tin nhắn của nhân viên một số công ty sách trên blogyuan (博客园) và các nơi khác, hỏi có muốn xuất bản sách hay không, thông thường nếu tôi không hỏi thì họ sẽ không nói mình là biên tập viên nhà xuất bản hay nhân viên công ty sách. Có một số nhân viên công ty sách, sẽ nói với tác giả, đặc biệt là tác giả mới, những câu như "biên tập viên nhà xuất bản thường không trực tiếp liên hệ với tác giả", và "xuất bản sách thường là thông qua công ty sách". Thực ra những lời này không thể coi là sai, ví dụ nếu bạn không liên hệ với biên tập viên nhà xuất bản, thì đối phương tự nhiên sẽ không trực tiếp liên hệ với bạn, nhưng ngược lại nếu tác giả trực tiếp liên hệ với biên tập viên nhà xuất bản, thứ nhất không khó, thứ hai có thể trực tiếp hơn.
- Khi tôi trao đổi đề cương (dàn bài) với biên tập viên nhà xuất bản, dù đề cương có thiếu sót, họ vẫn có thể trực tiếp đưa ra ý kiến sửa đổi cụ thể, ví dụ chương nào nên viết gì, đề cương tiết nào nên viết như thế nào. Còn khi tôi trao đổi đề cương với một số nhân viên công ty sách, phản hồi nhận được hầu hết là "phải viết lại", viết lại như thế nào? Những nhân viên này có thể chỉ đưa ra ý kiến trừu tượng, mọi thứ đều để tôi tự nghiền ngẫm. Trong bài viết trước của tôi [Lập trình viên xuất bản một cuốn sách kỹ thuật như thế nào](./how-do-programmers-publish-a-technical-book), tôi đã nêu ra trải nghiệm cụ thể.
- Vì trao đổi không sâu, nên tôi chưa từng ký thỏa thuận xuất bản sách với công ty sách, nhưng tôi biết rằng chỉ có nhà xuất bản mới có thể xuất bản sách. Vì chưa từng trải qua, nên tôi cũng không biết trong hợp đồng công ty sách có các điều khoản né tránh rủi ro hay không, nhưng tôi từng thấy một số trường hợp bản thảo bị từ chối (退稿) mà một nhân viên công ty sách đưa ra, và ngầm lộ ra ý trách cứ tác giả. Nghĩ kỹ lại thấy không ổn, nhân viên phụ trách thứ nhất không thể phát hiện và phản hồi cho tác giả kịp thời ngay khi có vấn đề, thứ hai sau khi có vấn đề không thể phối hợp điều chỉnh dẫn đến cuối cùng bản thảo bị từ chối, thứ ba sau khi bản thảo bị từ chối, trong khi tác giả đã bỏ công sức lao động thì công ty sách không những không phải chịu bất kỳ rủi ro nào, mà còn có thể chỉ trích tác giả. Về điểm này, bản thảo bị từ chối tất nhiên có yếu tố từ phía tác giả, nhưng cùng là tác giả, tôi không khỏi có cảm giác "thỏ chết, cáo buồn" (đồng cảm với người cùng cảnh ngộ). Còn khi tôi xuất bản sách ở nhà xuất bản, biên tập viên đôi khi thậm chí chủ động quan tâm, chủ động cung cấp tư liệu, dù có vấn đề cũng sẽ sửa ngay lập tức, nên thậm chí tình huống phải sửa đổi bản thảo trên diện rộng hầu như không xảy ra.
- Nói thêm về nhuận bút mà công ty sách trả cho tác giả. Tôi từng thấy trả tiền theo trang, ví dụ một trang 30 đến 50 tệ, và bán đứt bản quyền, tức là sau khi sách tái bản tác giả cũng không thể nhận thêm nhuận bút nữa. Còn nếu trả theo bản quyền tác giả, tôi cũng từng thấy trả 6%, còn việc công ty sách có thể trả đến 8 điểm hay cao hơn hay không, tôi chưa từng thấy, nên không biết, cũng không dám bừa phán đoán.

Tôi trao đổi với không nhiều nhân viên công ty sách, trao đổi cũng không sâu, vì hiện nay tôi chủ yếu trao đổi với biên tập viên nhà xuất bản. Vì vậy những điều trên chỉ là cảm nhận của tôi về một số biên tập viên công ty sách, tôi không có ý khái quát hóa một cách phiến diện, mà một số nhân viên công ty sách tôi từng trao đổi ít nhất thái độ cũng rất tôn trọng tôi. Nên mọi người cũng có thể so sánh và thử các cách hợp tác khác nhau với công ty sách và nhà xuất bản. Dù sao đi nữa, trước khi bạn viết sách thậm chí trước khi ký thỏa thuận xuất bản sách, bạn cần hỏi rõ những điều sau, và đối phương có nghĩa vụ để bạn hiểu rõ những sự thật sau.

- Bạn phải hỏi rõ, thân phận của đối phương là biên tập viên nhà xuất bản hay nhân viên công ty sách, điều này thực ra nên do đối phương chủ động cho biết.
- Sách của bạn được xuất bản ở nhà xuất bản nào? Điểm này cần được nêu rõ trong thỏa thuận xuất bản sách, không thể hoàn thành bản thảo rồi mới định nhà xuất bản. Hơn nữa, người cuối cùng có thể xuất bản sách, nhất định là nhà xuất bản, chứ không phải công ty sách.
- Phương thức thanh toán nhuận bút, dù công ty sách có thể kiếm chênh lệch ở giữa, nhưng ít nhất bạn phải hiểu được mức nhuận bút nhà xuất bản có thể đưa ra. Nếu bạn xuất bản sách thông qua công ty sách, dù công ty sách thương lượng với bạn thế nào, thì tiền nhà xuất bản trả cho công ty sách không giảm một đồng nào, phần chênh lệch ở giữa chắc hẳn chính là lợi nhuận của công ty sách.
- Người cuối cùng ký hợp đồng xuất bản sách với bạn, là công ty sách hay nhà xuất bản, điều này nhất định phải làm rõ trước khi bạn ký tên, dù cuối cùng bạn ký thỏa thuận với công ty sách, nhưng ít nhất phải biết bạn còn có thể trực tiếp ký thỏa thuận với nhà xuất bản.
- Bạn không thể giữ suy nghĩ "xuất bản sách ở công ty sách thì yêu cầu thấp", càng không nên giữ suy nghĩ "năng lực của tôi bình thường, nên chỉ có thể xuất bản sách ở công ty sách". Công ty sách tự bản thân không có tư cách xuất bản sách, nên họ cũng sẽ giao bản thảo cho nhà xuất bản, vì vậy những yêu cầu đáng có cũng sẽ không thấp hơn chút nào. Đề cương của bạn không qua được ở chỗ biên tập viên nhà xuất bản, thì ở chỗ nhân viên công ty sách cũng không qua được, dù bạn đòi hỏi nhuận bút ít, thì yêu cầu tương ứng của phía công ty sách nhất định cũng sẽ không giảm.

Nếu bạn đã biết rõ "sự khác biệt giữa công ty sách và nhà xuất bản", mà vẫn hợp tác với công ty sách, thì đây là chuyện hai bên đều vui lòng. Nhưng nếu đối phương "không chủ động cho biết", mà bạn hợp tác với công ty sách trên cơ sở không hiểu rõ sự khác biệt giữa hai bên, thì đối phương cũng không có gì để bị chỉ trích. Tuy nhiên "nghe nhiều hiểu rõ" (兼听则明), nếu mọi người muốn xuất bản sách, chi bằng cả nhà xuất bản và công ty sách đều tiếp xúc thử rồi so sánh.

## 4. Làm thế nào để trực tiếp liên hệ với biên tập viên các nhà xuất bản sách máy tính nổi tiếng trong nước

Tôi từng xuất bản sách ở Nhà xuất bản Đại học Thanh Hoa (清华大学出版社), Nhà xuất bản Công nghiệp Cơ khí (机械工业出版社), Nhà xuất bản Đại học Bắc Kinh (北京大学出版社) và Nhà xuất bản Công nghiệp Điện tử (电子工业出版社), quy trình xuất bản cũng khá thuận lợi, làm việc với biên tập viên cũng khá vui vẻ. Cá nhân tôi không có ý phân chia các nhà xuất bản trong nước thành cao thấp, nhưng trong ngành máy tính, các nhà xuất bản khá nổi tiếng gồm bốn nhà là Thanh Hoa, Cơ khí (机工), Công nghiệp Điện tử và Bưu điện Nhân dân (人民邮电), tất nhiên các nhà xuất bản khác cũng từng xuất bản những cuốn sách chất lượng trong lĩnh vực máy tính.

Làm thế nào để trực tiếp làm việc với biên tập viên của các nhà xuất bản nổi tiếng này?

- Trực tiếp lên trang web chính thức, thông thường trên trang web chính thức đều có sẵn thông tin liên hệ.
- Bạn đăng bài trên blogyuan (博客园) và các nơi khác, sẽ có người tìm bạn để xuất bản sách, trong đó ngoài nhân viên công ty sách ra, cũng có biên tập viên nhà xuất bản, thông thường biên tập viên nhà xuất bản sẽ trực tiếp nói rõ thân phận, ví dụ tôi là biên tập viên xx của nhà xuất bản xx.
- Bản thân tôi cũng từng liên hệ với biên tập viên của một số nhà xuất bản, nếu mọi người cần, tôi có thể cung cấp.

Vậy làm thế nào để tìm nhân viên công ty sách? Thông thường không cần chủ động tìm, sau khi bạn đăng vài bài viết, họ sẽ chủ động tìm bạn. Nếu bạn hỏi kỹ, "ông/bà là biên tập viên nhà xuất bản hay biên tập viên công ty sách", họ sẽ nói rõ thân phận, nếu bạn hỏi kỹ thêm, thì họ có thể sẽ đứng trên lập trường của công ty sách để giải thích sự khác biệt giữa nhà xuất bản và công ty sách.

Từ đó mọi người có thể thấy, dù cuối cùng bạn có viết thành sách hay không, thì việc tìm biên tập viên của nhà xuất bản nổi tiếng không hề khó. Hơn nữa, sau khi bạn tìm được, họ còn sẽ tiếp tục trao đổi đề tài (chủ đề tuyển chọn) với bạn.

## 5. Xác định đề tài và quy trình xuất bản sách

Ở đây tôi nêu ra quy trình tôi trao đổi hợp tác với biên tập viên nhà xuất bản và cuối cùng xuất bản sách.

Thứ nhất, sau khi liên hệ được với biên tập viên nhà xuất bản, trước tiên thảo luận về đề tài, bạn có thể chọn một hướng mà bạn khá quen thuộc, hoặc hướng bạn sẵn lòng chuyên sâu, hướng này có thể là java các thành phần phân tán, Spring cloud family bucket (bộ công cụ đầy đủ Spring Cloud), micro service (vi dịch vụ), hoặc Python phân tích dữ liệu, machine learning (học máy) hay deep learning (học sâu) v.v. Về mặt này nếu bạn có kinh nghiệm dự án vững chắc thì tốt nhất, nếu hiện tại bạn tuy chưa quen thuộc, nhưng bạn có nghị lực trải qua một thời gian ngắn học tập có hệ thống để đảm bảo nội dung bạn viết có thể thành hệ thống hoặc có thể giúp ích cho người khác, thì bạn cũng có thể xuất bản sách về hướng này.

Thứ hai, sau khi xác định hướng đề tài, bạn có thể trước tiên liệt kê đề cương, ví dụ lấy Python phân tích dữ liệu làm ví dụ, bạn có thể định 12 chương, chương một nói về cú pháp, chương hai nói về các lớp như numpy v.v., cứ thế suy ra, khi bạn định đề cương, có thể tham khảo mục lục sách của người khác, từ đó xây dựng nội dung viết của mình. Sau khi định xong đề cương, bạn có thể trao đổi với biên tập viên, khi biên tập viên cũng công nhận đề cương này, thì có thể xác định thỏa thuận xuất bản.

Đối với tác giả thông thường, thỏa thuận xuất bản thực ra khá giống nhau, nhuận bút thường là 8 điểm, chu kỳ viết là thương lượng với nhà xuất bản, chu kỳ thanh toán có lẽ cũng đại loại giống nhau, sau đó nhà xuất bản sẽ mua đứt bản quyền bản điện tử và các loại ngôn ngữ khác nhau của cuốn sách này. Nhưng nếu tác giả là cao thủ, thì những chi tiết này đều có thể thương lượng với nhà xuất bản.

Sau đó là viết sách, đây là việc rất khô khan, đặc biệt là khi viết vài chương cuối. Tôi thường dành nửa tiếng mỗi ngày trong ngày làm việc, cuối tuần hai ngày dùng 4,5 tiếng để viết, như vậy thường nửa năm có thể viết xong một cuốn sách 300 trang, về các kỹ năng viết sách hiệu quả, phần sau sẽ nêu chi tiết.

Khi viết sách, thông thường khuyến nghị viết xong mỗi chương thì giao cho biên tập viên duyệt, như vậy sẽ không dẫn đến sự xuất hiện của những vấn đề quá lớn, hơn nữa nếu là tác giả mới, cách diễn đạt và kỹ năng viết ban đầu đều cần tích lũy, trong giai đoạn đầu biên tập viên nhà xuất bản cũng có thể kịp thời giúp đỡ tác giả.

Sau khi bạn viết xong và giao bản thảo cho biên tập viên, có thể sẽ có việc "ba lần hiệu đính ba lần thẩm định" (三校三审), trong đó biên tập viên hợp tác cùng tôi sẽ giúp tôi sửa các vấn đề như ngữ pháp và lỗi chính tả v.v., sau đó sẽ hình thành một bản ý kiến sửa đổi để tôi xác nhận và sửa. Tôi tìm hiểu được rằng, nếu xuất bản sách ở công ty sách, rủi ro bị từ chối bản thảo thường xảy ra ở giai đoạn này, vì công ty sách có thể sẽ nộp bản thảo cho nhà xuất bản một lần duy nhất. Nhưng vì tôi sẽ nộp trực tiếp từng chương cho biên tập viên nhà xuất bản duyệt, nên dù có vấn đề lớn, thì khi viết vài chương đầu cũng đã bộc lộ và sửa xong, nên bản ý kiến sửa đổi cuối cùng thường không quá dài. Nói cách khác, nếu trực tiếp giao tiếp với nhà xuất bản, trong giai đoạn ba lần hiệu đính ba lần thẩm định, khối lượng công việc có thể không nhất thiết lớn, tôi thường sau khi nộp một cuốn sách, để biên tập viên làm việc này, rồi tôi tiếp tục lên kế hoạch và bắt đầu viết cuốn sách tiếp theo.

Cuối cùng là nhận nhuận bút, trước đó đã nói, thực ra tác giả không nên có quá nhiều kỳ vọng về nhuận bút, chỉ là có còn hơn không. Nhưng nếu bất ngờ viết được một cuốn sách bán chạy với doanh số khoảng 5000 thậm chí 10000 bản, thì có thể trong vòng một năm cũng có thêm khoảng 5 vạn thu nhập, và có thể tích lũy được chút tiếng tăm trong ngành.

## 6. Viết sách tình huống (case study) nhanh hơn viết sách kinh nghiệm

Với một số tác giả, đặc biệt là tác giả mới, xuất bản sách không dễ, thường là vài chương đầu hăng hái tràn đầy năng lượng, sau đó phát hiện vấn đề tích tụ càng nhiều, thêm vào công việc bận rộn, là bỏ ngang, hoặc phải dùng thời gian hơn 1 năm mới hoàn thành được một cuốn sách. Về điều này, cảm nhận của tôi là, chu kỳ viết một cuốn sách 300 đến 400 trang dài nhất là 8 tháng. Để có thể hoàn thành một cuốn sách trong khoảng thời gian này, lời khuyên tôi đưa ra tương ứng là, tác giả mới có thể viết sách tình huống, đừng viết trước loại sách giới thiệu kinh nghiệm.

Sách tình huống là gì? Ví dụ trong một cuốn sách dùng một tình huống lớn xuyên suốt, giới thiệu có hệ thống một điểm kiến thức, ví dụ phát triển tiểu trình (mini program), hoặc phát triển full-stack (toàn ngăn xếp) v.v. Hoặc một cuốn sách mỗi chương đặt một tình huống, trong một cuốn sách đưa ra khoảng 10 tình huống về Python deep learning. Sách kinh nghiệm là gì? Ví dụ sách giới thiệu kinh nghiệm phỏng vấn thuộc loại này, hoặc một số cao thủ kỹ thuật viết sách giới thiệu kinh nghiệm phát triển distributed high concurrency (phân tán, độ đồng thời cao) cũng được coi là sách kinh nghiệm.

Xin lưu ý ở đây không phân biệt sự khác nhau giữa hai loại sách, chỉ là đối với tác giả mới, sách tình huống dễ viết hơn. Vì trong đó, nhiều hơn là "xem hình nói chuyện", trước tiên đưa ra tình huống (ví dụ tình huống nhận dạng hình ảnh trong Python deep learning), sau đó thông qua tình huống giới thiệu cách dùng API (ví dụ cách dùng thư viện tương ứng của Python), cùng các điểm mấu chốt tổng hợp của kỹ thuật (ví dụ làm thế nào dùng thư viện Python tổng hợp để thực hiện chức năng nhận dạng hình ảnh). Hơn nữa trong sách tình huống, những điểm cần tác giả phát huy chủ quan tương đối ít, tác giả không cần dùng lời của mình để sắp xếp kinh nghiệm liên quan. Đối với tác giả mới, khi tổ chức văn bản giới thiệu kinh nghiệm, có thể có cảm giác mình hiểu nhưng nói không ra, như vậy một mặt không thể đạt được hiệu quả như mong đợi, mặt khác còn có thể vì không thể trình bày hiệu quả dẫn đến tiến độ bị chậm trễ.

Nhưng ngược lại với sách tình huống, thứ nhất tình huống thường có thể tham khảo của người khác, thứ hai giới thiệu công nghệ hiện có luôn dễ hơn giới thiệu kinh nghiệm của bản thân, thứ ba thường còn có những cuốn sách cùng loại để tác giả tham khảo, nên tác giả không cần cân nhắc nhiều về cách diễn đạt, tác giả mới dùng nửa năm đến tám tháng cũng có khả năng viết xong một cuốn. Khi tác giả tích lũy được kinh nghiệm nhất định thông qua viết vài cuốn sách, rồi mới đi thử thách sách kinh nghiệm, trong trường hợp này, sách kinh nghiệm viết ra có khả năng sẽ bán chạy.

Vậy cụ thể, làm thế nào để xuất bản hiệu quả một cuốn sách tình huống?

- Đối với toàn bộ cuốn sách, trước tiên dùng một số ít chương giới thiệu nội dung về việc thiết lập môi trường và cú pháp cơ bản thông dụng.
- Khi viết tình huống của mỗi chương, dùng cấu trúc "tổng - phân - tổng", trước tiên giới thiệu tổng thể chức năng yêu cầu của tình huống này, cũng như các điểm kỹ thuật sẽ dùng, sau đó trình bày riêng cách triển khai code của từng điểm chức năng, cuối cùng tổng kết lại các điểm mấu chốt khi sử dụng các điểm chức năng này.
- Khi giới thiệu code cụ thể trong tình huống, cũng có thể dùng cấu trúc "tổng - phân - tổng", tức trước tiên giới thiệu tổng thể cấu trúc của đoạn code này, sau đó lần lượt đưa ra giải thích cho các phần code quan trọng, cuối cùng đưa ra kết quả chạy và tổng hợp các điểm mấu chốt triển khai kỹ thuật trong đó.

Như vậy, lúc mới bắt đầu có thể là 1 tháng một chương, viết đến lúc sau khi quen tay ước tính một tháng có thể viết được hai chương, như vậy 8 tháng hoàn thành một cuốn sách, cũng không phải là điều không thể.

## 7. Làm thế nào tránh được vấn đề bản quyền trên cơ sở tham khảo nội dung hiện có

Khi viết sách, thông thường ở mức độ nào đó đều cần tham khảo code hiện có và sách hiện có, nhưng điều này tuyệt đối không phải là công việc lặp lại. Ví dụ một tác giả tổng hợp nhiều tình huống trên các trang web khác nhau, rồi kể có hệ thống về Python phân tích dữ liệu, như vậy tuy tài liệu có sẵn đều có, nhưng đối với độc giả, có thể học tập một cách trọn gói (one-stop). Tương tự, ví dụ trong lĩnh vực mạng nơ-ron Python, 2,3 cuốn sách hiện có lần lượt đưa ra một số tình huống như nhận dạng khuôn mặt v.v., nhưng nếu bạn tổng hợp hiệu quả lại với nhau, và trên cơ sở của người khác thêm vào chức năng của bạn, thì đối với độc giả cũng có giá trị.

Ở đây liên quan đến vấn đề bản quyền, trước tiên phải nói rõ, tác giả không thể ôm bất kỳ ảo tưởng nào, nếu xảy ra vấn đề bản quyền, sách chưa xuất bản thì còn đỡ, nếu đã xuất bản rồi, tác giả không những phải đền tiền, mà trong ngành còn mang tiếng xấu, có thể nói là "thân bại danh liệt". Nhưng thực ra để tránh vấn đề bản quyền hoàn toàn không khó chút nào.

- Không được đạo văn nội dung hiện có trên mạng, dù chỉ một câu cũng không được. Về điểm này, tác giả có thể viết lại trên cơ sở hiểu được ý nghĩa câu văn của người khác. Không được đạo văn mục lục hiện có trong sách của người khác, càng không thể đạo văn câu chữ trong sách của người khác, một câu cũng vậy, giải pháp tương ứng cũng là viết lại trên cơ sở hiểu.
- Không được đạo văn code của người khác trên GitHub hoặc bất kỳ đâu, dù code đó là mã nguồn mở. Về điểm này, bạn có thể trên cơ sở hiểu code của đối phương, trước hết chạy thông, sau đó nhất định phải tự tạo mới một project, trong project của bạn tham khảo code của người khác để triển khai chức năng của bạn, trong quá trình này không được có thao tác copy-paste từng đoạn lớn. Nghĩa là, code của bạn và code của người khác, ở phần comment, đặt tên biến, tên class và tên phương thức không được có chỗ nào trùng lặp, tất nhiên bạn còn có thể thêm vào chức năng của riêng bạn.
- Còn khi viết phần giới thiệu kỹ thuật và tình huống, bạn có thể dùng lời của chính mình để diễn đạt, như vậy cũng sẽ không xuất hiện vấn đề bản quyền.

Sau khi dùng các cách trên, tác giả có thể trên cơ sở tham khảo tài liệu hiện có, thêm đầy đủ chức năng thuộc về bạn, viết lên sự hiểu biết độc đáo của bạn, từ đó xuất bản hiệu quả cuốn sách thuộc về chính bạn.

## 8. Những vấn đề tác giả mới cần đặc biệt tránh

Ở phần trên đã trình bày chi tiết quy trình xuất bản sách, và thông qua sách tình huống, đưa ra phương pháp thực hành viết cụ thể, ở đây đặc biệt hướng đến tác giả mới, đưa ra một số điểm mấu chốt thực hành cần lưu ý.

- Sách kỹ thuật khác với sách văn nghệ, trong đó trước tiên phải đảm bảo giảng rõ các điểm kiến thức kỹ năng, sau đó trên cơ sở này có thể thêm chút cách diễn đạt sinh động hài hước. Nên đối với tác giả mới, thậm chí có thể trực tiếp dùng văn bản giản dị để giới thiệu kỹ thuật tình huống, không cần suy nghĩ quá nhiều về tính sinh động của văn chương.
- Nội dung cần hướng đến người mới bắt đầu, khi giới thiệu kỹ thuật, bắt đầu từ nền tảng cơ bản nhất cho người chưa biết gì, đừng nói quá sâu. Ở đây lấy Python machine learning làm ví dụ, có thể bắt đầu từ machine learning là gì và Python triển khai machine learning như thế nào, nhưng nếu trước tiên nói về kinh nghiệm thực hành trong machine learning, thì chưa chắc đã đảm bảo người mới bắt đầu có thể học được.
- Tác giả mới hận không thể viết hết những gì mình biết. Thái độ này rất tốt, nhưng cần xem xét mức tiếp thu khách quan của độc giả, nên cần đặt ra một hiệu quả kỳ vọng trước khi viết sách, ví dụ lập trình viên Python không nền tảng đọc sách của tôi xong ít nhất có thể làm việc được. Hiệu quả kỳ vọng này đừng bất khả thi, ví dụ không thể là "lập trình viên Python không nền tảng đọc sách của tôi xong có thể đạt trình độ 3 năm phát triển". Như vậy có thể căn cứ theo hiệu quả đặt ra trước, xây dựng nội dung viết, để trong sách của bạn có thể tập trung hơn vào kiến thức cơ bản, như vậy độc giả mới có thể thực sự có thu hoạch.

Tuy nhiên nói lại, nếu tác giả mới trực tiếp liên hệ với biên tập viên nhà xuất bản, tìm một hướng hot chút, và căn cứ vào tình huống giảng giải kỹ thuật cẩn thận, thậm chí có thể viết ra cuốn sách bán chạy với doanh số vượt vạn bản.

## 9. Tổng kết: xuất bản sách ở nhà xuất bản nổi tiếng trong nước, thực ra là một việc tiêu tốn sức lực

Có thể hiện nay, các cách như viết tài khoản công chúng WeChat (公众号) và quay video v.v., thu nhập kiếm tiền có thể cao hơn xuất bản sách, nhưng có thể nói như vậy, vận hành tài khoản công chúng và quay video cũng là chuyện lâu dài, trong thời gian ngắn có thể chưa chắc có thu nhập, nếu không đăng tải nội dung một cách có hệ thống, có thể thậm chí sẽ không có thu nhập. Nên xuất bản sách có thể là một công việc chuẩn bị giai đoạn đầu rất tốt, bạn dựa vào xuất bản sách để tích lũy tư liệu một cách có hệ thống, dựa vào xuất bản sách để tổng hợp hệ thống kiến thức của bạn, thì trên cơ sở đó, dựa vào tài khoản công chúng hoặc quay video để kiếm tiền có thể sẽ đạt hiệu quả gấp đôi công sức.

Từ phần trên mọi người có thể thấy, trong giai đoạn đầu xuất bản sách, liên hệ biên tập viên nhà xuất bản và xác định đề tài không hề khó, nếu muốn viết sách tình huống, thì trên cơ sở tham khảo nội dung của người khác, viết xong một cuốn sách thông thường có lẽ cũng không phải là chuyện quá cao xa. Thậm chí có thể nói như vậy, xuất bản sách là một việc tiêu tốn sức lực, chỉ cần kiên trì, xuất bản một cuốn sách không hề khó, chỉ là vấn đề bạn có muốn kiên trì đến cùng hay không. Nhưng một khi bạn có được cuốn sách kỹ thuật thuộc về mình, thì khi tìm việc, bạn có thể tự tin nói với người phỏng vấn rằng bạn là chuyên gia trong lĩnh vực này, trong video, tài khoản công chúng và văn bản của bạn, bạn cũng có thể chính đáng nói rằng, bạn là tác giả của sách máy tính. Điều quan trọng hơn, giống như trải nghiệm trường danh giá và công ty lớn, cuốn sách kỹ thuật thuộc về bạn cũng là bằng chứng quan trọng chứng minh năng lực lập trình viên, khi bạn thông qua xuất bản sách tổng hợp hiệu quả hệ thống kiến thức của lĩnh vực liên quan, thì trong lĩnh vực này, dù là tìm việc, hay làm việc ngoài giờ, hay nhận dự án để làm, bạn đều có thể nói thẳng thắn với người khác rằng: Tôi có thể làm được!

<!-- @include: @article-footer.snippet.md -->