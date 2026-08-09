---
title: Nhập việc công ty mới làm thế nào để nhanh chóng vào trạng thái làm việc
description: "Nhập việc công ty mới làm thế nào để nhanh chóng vào trạng thái làm việc: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, hệ thống hóa các khái niệm then chốt, vấn đề thường gặp và điểm mấu chốt thực hành, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
tag:
  - 工作
head:
  - - meta
    - name: keywords
      content: 新入职,快速融入,工作状态,业务了解,技术熟悉,团队协作,跳槽适应,程序员入职
---

> **Lời giới thiệu**: Rất khuyến khích mỗi bạn sắp nhập việc/đang đi làm đọc bài viết này, đọc xong sẽ giúp bạn tránh được rất nhiều "hố" (sai lầm). Toàn bài logic rõ ràng, nội dung đầy đủ!
>
> **Địa chỉ bài gốc**: <https://www.cnblogs.com/hunternet/p/14675348.html>

![Nhập việc công ty mới làm thế nào để nhanh chóng vào trạng thái làm việc](https://oss.javaguide.cn/github/javaguide/high-quality-technical-articles/work/%E6%96%B0%E5%85%A5%E8%81%8C%E4%B8%80%E5%AE%B6%E5%85%AC%E5%8F%B8%E5%A6%82%E4%BD%95%E5%BF%AB%E9%80%9F%E8%BF%9B%E5%85%A5%E7%8A%B6%E6%80%81.png)

Kỳ nhảy việc "tháng 3 vàng, tháng 4 bạc" (金三银四) hằng năm sắp khép lại, tin rằng nhiều bạn nhảy việc đã tìm được công việc ưng ý, sắp hoặc đã có một khởi đầu mới.

Tin rằng các bạn từng có kinh nghiệm nhảy việc đều biết, mỗi khi đến một công ty mới, thứ bạn phải đối mặt có thể là nghiệp vụ mới, công nghệ mới, đội nhóm mới... Những điều này có thể phá vỡ tư duy làm việc, thói quen code, cách hợp tác vốn có của bạn...

Còn đối với công ty, họ không thể cho bạn vài tháng để từ từ làm quen. Lúc này, làm thế nào để nhanh chóng vào trạng thái làm việc, sớm phát huy giá trị của bản thân là điều vô cùng quan trọng.

Một số người có thể khá may mắn, công ty khi nhập việc có quy trình và cơ chế hoàn chỉnh, thông qua hình thức kèm cặp 1-1, các khóa đào tạo... có thể giúp người mới nhanh chóng vào trạng thái làm việc trong thời gian ngắn. Một số người có thể không may mắn như vậy, chẳng hạn như vài năm trước khi tôi nhảy việc vào một công ty nọ, lúc đó chưa có cơ chế kèm người mới hòa nhập hoàn chỉnh như bây giờ, lại đúng vào thời điểm đội nhóm bận nhất, ngay chiều đầu tiên nhập việc đã giao cho tôi vài vấn đề online để điều tra xử lý, mà không có bất kỳ tài liệu hay đào tạo nào. Gặp phải tình huống như vậy, nhiều người có thể vì khó thích nghi nhanh, cuối cùng chịu không nổi áp lực mà nảy sinh ý định rời đi.

![bad175e3a380bea.](https://hunter-picgos.oss-cn-shanghai.aliyuncs.com/picgo/bad175e3a380bea..jpg)

Vậy thì, **chúng ta nên làm thế nào để nhanh chóng đưa bản thân vào trạng thái làm việc, thích nghi với nhịp độ làm việc mới?**

Ở công việc mới, đối mặt với một đống codebase (kho mã nguồn), nhiều người thường cảm thấy không biết bắt đầu từ đâu. Nhưng nhìn lại kinh nghiệm làm việc và dự án trong quá khứ, chúng ta có thể nhận ra chúng có những điểm tương đồng. Khi bắt đầu một dự án mới, thường trải qua vài bước: Yêu cầu (requirement) -> Thiết kế (design) -> Phát triển (development) -> Kiểm thử (test) -> Phát hành (release), cứ lặp đi lặp lại như vậy, chúng ta hoàn thành hết dự án này đến dự án khác.

![Quy trình dự án](https://oss.javaguide.cn/github/javaguide/high-quality-technical-articles/work/image-20220704191430466.png)

Trong quá trình này, kiến thức chủ yếu xoay quanh bốn phương diện, đó là nghiệp vụ (business), kỹ thuật (technology), dự án (project) và đội nhóm (team), xuyên suốt toàn bộ. Khi mới nhập việc một công ty, mục tiêu giai đoạn đầu của chúng ta là có được năng lực làm dự án cùng đội nhóm, vì vậy các kiến thức cần nhanh chóng nắm bắt cũng nên bắt đầu từ bốn phương diện này.

## Nghiệp vụ (Business)

Nhiều người có thể nghĩ rằng, là một người làm kỹ thuật, thứ cần hiểu nhất chẳng phải là kỹ thuật sao? Vì vậy sau khi vào một công ty, họ vội vàng nghiên cứu các tài liệu kỹ thuật, kiến trúc hệ thống, thậm chí ôm lấy source code để "gặm nhấm". Nếu bạn cũng làm như vậy thì nhầm to rồi! Trong hầu hết các công ty, kỹ thuật chỉ tồn tại như một công cụ, dù nó rất quan trọng, nhưng nó cũng tồn tại để phục vụ nghiệp vụ. Kỹ thuật giải quyết vấn đề làm như thế nào, còn nghiệp vụ cho chúng ta biết làm gì và tại sao lại làm. Một khi tách rời khỏi nghiệp vụ, sự tồn tại của kỹ thuật sẽ trở nên vô nghĩa.

Muốn hiểu nghiệp vụ, có hai cách rất quan trọng

**Thứ nhất là dựa vào hỏi han**

Nếu đội nhóm bạn gia nhập có cơ chế đào tạo nghiệp vụ hoàn chỉnh, tài liệu yêu cầu chi tiết, có lẽ bạn không cần hỏi quá nhiều cũng có thể hiểu được nghiệp vụ, nhưng đó chỉ là tình huống lý tưởng, đa số công ty không có điều kiện này. Vì vậy chúng ta chỉ có thể dựa vào hỏi han.

Ở đây phải nói thêm rằng, là một người mới nhất định phải có chút "dày mặt", không hiểu thì phải hỏi. Tôi từng thấy nhiều người mới vì hướng nội, ngại ngùng, gặp thắc mắc lại ngại không dám hỏi, điều này khiến họ rất lâu mới hòa nhập được vào đội nhóm, gánh vác trách nhiệm quan trọng hơn. Đừng sợ bị mắng, bị phản bác, và tôi tin đại đa số lập trình viên đều rất dễ giao tiếp!

**Thứ hai là dựa vào kiểm thử (test)**

Tôi cho rằng test tuyệt đối là một cách để một người nhanh chóng hiểu nghiệp vụ của đội nhóm. Thông qua test, chúng ta có thể đi qua toàn bộ quy trình của dự án mà đội nhóm mình phụ trách, nếu gặp chỗ không đi tiếp được hoặc không nghĩ thông thì hãy kịp thời hỏi, trong quá trình này chúng ta tự nhiên có thể nhanh chóng hiểu được quy trình nghiệp vụ cốt lõi.

Trong quá trình tìm hiểu nghiệp vụ, chúng ta nên lưu ý đừng quá theo đuổi chi tiết, mục đích của chúng ta là trước tiên hiểu tổng thể quy trình nghiệp vụ, chúng ta phục vụ những người dùng nào, cung cấp những dịch vụ gì...

## Kỹ thuật (Technology)

Sau khi bước đầu hiểu xong nghiệp vụ, đã đến lúc dành cho kỹ thuật, có lẽ bạn đã không kìm được ý định mở source code ra xem, nhưng vẫn phải nhắc bạn trước một câu là đừng vội.

Lúc này chúng ta nên dựa theo nghiệp vụ đã tìm hiểu, kết hợp với kinh nghiệm làm việc trong quá khứ để suy nghĩ xem nếu là mình thì mình sẽ thực hiện hệ thống này như thế nào? Bước này rất quan trọng, về sau khi chúng ta tìm hiểu cụ thể cách triển khai kỹ thuật của hệ thống, có thể so sánh xem có những khác biệt gì so với hướng triển khai của mình, vì sao lại có những khác biệt đó, chỗ nào tốt hơn, chỗ nào chưa tốt. Với chỗ chưa tốt chúng ta có thể đưa ra ý kiến của mình, còn với chỗ tốt hơn chúng ta có thể hấp thụ học hỏi thành của mình!

Tiếp theo, chúng ta cần tìm hiểu kỹ thuật, nhưng cũng không phải cứ thế lao vào đọc source code. **Nên phân tích hệ thống dần dần theo hướng từ tổng quan (macro) đến chi tiết, từ ngoài vào trong.**

Đầu tiên, chúng ta nên đơn giản tìm hiểu **tech stack (bộ công nghệ) mà đội nhóm/dự án của mình sử dụng**, là Java hay .NET, hay nhiều ngôn ngữ cùng tồn tại, dự án tách riêng frontend/backend hay backend ôm trọn, cơ sở dữ liệu dùng MySQL hay PostgreSQL..., như vậy chúng ta có thể có một số dự đoán về công nghệ, framework được dùng cũng như nội dung mình phụ trách, điểm này có người có thể đã tìm hiểu sơ qua trong lúc phỏng vấn.

Bước tiếp theo, chúng ta nên tìm hiểu **kiến trúc nghiệp vụ tổng thể (macro) của hệ thống**. Đội nhóm của mình phụ trách chính những hệ thống nào, mỗi hệ thống gồm những module nào, lại tương tác với những hệ thống bên ngoài nào... Với những điều này, tốt nhất nên hệ thống lại bằng flowchart (sơ đồ luồng) hoặc mindmap (sơ đồ tư duy)...

Sau đó, việc chúng ta cần làm là xem **đội nhóm của mình cung cấp những interface (API) hoặc service nào ra bên ngoài**. Mỗi interface và service cung cấp chức năng gì. Điểm này chúng ta có thể tiếp tục test hệ thống của mình, lúc này cần xem trong luồng chính gồm những trang (page) nào, mỗi trang gọi những interface backend nào, mỗi interface backend tương ứng với codebase nào. (Nếu chỉ làm riêng dịch vụ backend, có thể xem chúng ta cung cấp những service nào, có những upstream service nào, mỗi upstream service gọi những service nào của đội nhóm mình...), tương tự chúng ta nên hệ thống lại bằng hình vẽ.

Tiếp nữa, chúng ta cần tìm hiểu **hệ thống hoặc service của mình phụ thuộc vào những external service nào**, nghĩa là cần sự hỗ trợ của những hệ thống bên ngoài nào, những service này có thể nằm ngoài đội nhóm, ngoài công ty, cũng có thể do công ty khác cung cấp. Lúc này chúng ta có thể đơn giản vào code xem việc tương tác với các hệ thống bên ngoài được thực hiện như thế nào, bao gồm framework giao tiếp (REST, RPC), giao thức truyền thông...

Đến tầng code, trước tiên chúng ta nên hiểu cấu trúc phân tầng code của mỗi module, một module chia làm mấy tầng, trách nhiệm mỗi tầng là gì, hiểu được điều này thì đã có khái niệm sơ bộ về toàn bộ thiết kế của hệ thống, tiếp đến là cấu trúc thư mục code, vị trí của các file cấu hình.

Cuối cùng, chúng ta có thể tìm một ví dụ, có thể là một interface, một trang, để tư duy của chúng ta đi theo luồng chạy của code, từ tham số đầu vào đến tham số đầu ra, đi trọn một vòng để kiểm chứng những hiểu biết trước đó của mình.

Đến đây, việc tìm hiểu ở tầng kỹ thuật của chúng ta có thể tạm kết thúc, mục đích của chúng ta chỉ là có một nhận thức sơ bộ về hệ thống, còn những chi tiết hơn, sau này chúng ta sẽ có nhiều thời gian để tìm hiểu.

## Dự án và đội nhóm

Như đã đề cập ở trên, khi mới nhập việc một công ty, mục tiêu giai đoạn đầu là có năng lực làm dự án cùng đội nhóm, tiếp theo chúng ta cần tìm hiểu chính là dự án được vận hành như thế nào.

Chúng ta nên nắm bắt một số điểm mấu chốt trong toàn bộ quá trình từ thiết kế yêu cầu, viết code, commit lên repository cho đến cuối cùng là phát hành lên production (go-live). Ví dụ dự án áp dụng mô hình agile hay waterfall, một chu kỳ iteration (vòng lặp) dài bao lâu, nguồn gốc và hình thức thể hiện của yêu cầu, có buổi review yêu cầu (requirement review) không, quy chuẩn viết code là gì, sau khi viết xong build như thế nào, commit như thế nào, có quy chuẩn commit không, bàn giao test ra sao, chuẩn bị trước khi phát hành là gì, công cụ phát hành được sử dụng như thế nào...

Về dự án, chúng ta chỉ cần quan sát đồng nghiệp, hoặc tự mình trải nghiệm một iteration phát triển, là có thể hiểu rõ đại khái.

Trong khi tìm hiểu cách vận hành của dự án, chúng ta cũng nên tìm hiểu đội nhóm, tương tự chúng ta nên bắt đầu từ bên ngoài trước, chúng ta kết nối với những đội nhóm bên ngoài nào, ví dụ yêu cầu đến từ đâu, có kết nối với đội nhóm bên ngoài công ty không, những đội nhóm upstream cung cấp service cho mình là ai, những đội nhóm downstream mà mình phụ thuộc là ai, giữa các đội nhóm giao tiếp với nhau như thế nào, cách giao tiếp thường dùng là gì...

Tiếp theo là nội bộ đội nhóm, trong đội nhóm có những vai trò nào, trách nhiệm của mỗi người là gì, như vậy khi gặp vấn đề chúng ta cũng có thể tìm đúng đồng nghiệp để nhờ giúp đỡ. Có những hoạt động và cuộc họp định kỳ nào không, ví dụ daily standup (đứng họp hằng ngày), họp tuần, có những quy tắc ngầm nào không, có các buổi review nội bộ, cơ chế chia sẻ nào không...

## Tổng kết

Mới nhập việc một công ty, đối mặt với những thử thách công việc mới, có thể nhanh chóng vào trạng thái làm việc, phát huy giá trị của mình, sẽ mang lại cho bạn một khởi đầu tốt đẹp.

Là một lập trình viên, có thể nhanh chóng vào trạng thái làm việc, nghĩa là trước tiên chúng ta nên có năng lực làm dự án cùng đội nhóm, ở đây tôi đứng trên góc nhìn của một backend developer để tổng kết một số phương pháp và kinh nghiệm từ bốn phương diện: nghiệp vụ, kỹ thuật, dự án và đội nhóm.

Về cách nhanh chóng vào trạng thái làm việc, nếu bạn có phương pháp và gợi ý hay, hoan nghênh để lại bình luận ở khu vực comment.

Cuối cùng chúng ta dùng một mindmap để nhìn lại nội dung của bài viết này. Nếu bạn cảm thấy bài viết này hữu ích với mình, có thể theo dõi WeChat official account (公众号) ở cuối bài, tôi sẽ thường xuyên chia sẻ một số kinh nghiệm và tâm đắc trong quá trình trưởng thành của bản thân, cùng mọi người học tập và tiến bộ.

<!-- @include: @article-footer.snippet.md -->