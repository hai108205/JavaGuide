---
title: 20 thói quen xấu của lập trình viên kém
description: "20 thói quen xấu của lập trình viên kém: tổng hợp các khái niệm then chốt, câu hỏi thường gặp và điểm thực hành liên quan đến kiến thức kỹ thuật và tổng kết phỏng vấn, giúp bạn học tập hiệu quả và chuẩn bị cho phỏng vấn."
category: 技术文章精选集
author: Kaito
tag:
  - 练级攻略
head:
  - - meta
    - name: keywords
      content: 程序员坏习惯,编程规范,代码注释,技术文档,团队协作,代码提交,职业素养,编程修养
---

> **Lời giới thiệu**: Một bài viết của đại ca Kaito, những lời khuyên rất hữu ích!
>
> **Địa chỉ bài gốc:** <https://mp.weixin.qq.com/s/6hUU6SZsxGPWAIIByq93Rw>

Chắc chắn bạn đã từng gặp một kiểu lập trình viên như thế này: **dù là viết code, viết tài liệu hay giao tiếp với người khác, họ đều trông cực kỳ chuyên nghiệp**. Mỗi lần gặp những người như vậy, tôi đều tự hỏi, rốt cuộc họ làm được điều đó bằng cách nào?

Càng đi làm lâu, dần dần tôi cũng rút ra được một số kinh nghiệm: trên người họ đều duy trì một số thói quen tốt tưởng chừng rất nhỏ nhặt, nhưng chính những thói quen này lại thể hiện tố chất cơ bản của một lập trình viên giỏi.

Nhưng hôm nay chúng ta hãy đổi góc nhìn, xem một lập trình viên kém có những thói quen xấu nào? Chỉ cần chúng ta đều tránh được những vấn đề này, là có thể dần tiến gần đến một lập trình viên giỏi.

## 1. Viết sai chính tả các thuật ngữ kỹ thuật

Dù là CV cá nhân hay tài liệu kỹ thuật, tôi thường bắt gặp các thuật ngữ kỹ thuật viết sai chính tả, ví dụ như JAVA、javascript、python、MySql、Hbase、restful.

Cách viết đúng phải là Java、JavaScript、Python、MySQL、HBase、RESTful, đừng xem nhẹ vấn đề này, rất nhiều nhà tuyển dụng có thể chỉ vì điểm này mà loại bỏ CV của bạn.

## 2. Viết tài liệu, trộn lẫn Trung-Anh không đúng quy chuẩn

Dùng dấu câu tiếng Anh trong câu tiếng Trung, dùng ký tự full-width cho chữ Anh và số, giữa chữ Trung với chữ Anh, số không có dấu cách, v.v.

Trong đó nhiều người thường bỏ qua việc thêm một dấu cách giữa chữ Trung với chữ Anh, số, cách sắp xếp như vậy sẽ khiến việc đọc thoải mái hơn. Trước đây bài viết của tôi khi sắp xếp, đều tuân thủ những chi tiết này.

## 3. Logic quan trọng không viết comment, hoặc viết rất lan man

Với những đoạn code logic phức tạp và quan trọng, nhiều lập trình viên không viết comment, ngoài bản thân họ ra không ai đọc hiểu được logic. Hoặc là comment có viết, nhưng viết rất lan man, chẳng có logic gì.

Logic quan trọng không chỉ cần viết comment, mà còn phải viết gọn gàng, rõ ràng. Nếu là code đơn giản đọc một cái là hiểu ngay, thì có thể không cần thêm comment.

## 4. Viết những hàm dài dòng phức tạp

Một hàm dài vài trăm dòng, một file dài hơn nghìn dòng code, hàm phức tạp không tách nhỏ, khiến code ngày càng khó bảo trì, cuối cùng chẳng ai dám động vào.

Các nguyên tắc thiết kế cơ bản vẫn nên tuân thủ, ví dụ như nguyên tắc đơn trách nhiệm (single responsibility), một hàm chỉ làm một việc, nguyên tắc mở-đóng (open-closed principle), mở rộng cho việc mở rộng, đóng cho việc sửa đổi.

Nếu logic của hàm thực sự phức tạp, thì ít nhất cũng phải đảm bảo logic nhánh chính đủ rõ ràng.

## 5. Không xem tài liệu chính thức, chỉ thích đọc blog rác

Nhiều người gặp vấn đề không chịu xem tài liệu chính thức trước, mà lại thích đọc các blog rác, nội dung của những blog này đều là sao chép lẫn nhau, sai sót chồng chất.

Thực ra tài liệu chính thức của rất nhiều phần mềm đã được viết rất tốt, câu hỏi thường gặp đều có thể tìm thấy câu trả lời, chịu khó đọc kỹ tài liệu chính thức một chút, hay hơn xem blog rác gấp trăm lần, phải hình thành thói quen tốt là đọc tài liệu chính thức.

## 6. Tuyên truyền luận điệu "nội công vô dụng"

Có những người ngày ngày theo đuổi các dự án mã nguồn mở và framework mới mẻ không ngừng, nhưng lại không chịu bỏ thời gian đi nghiền ngẫm nguyên lý nền tảng, vấn đề thường gặp thì có thể giải quyết được, nhưng gặp vấn đề hơi sâu một chút là bó tay.

Rất nhiều thiết kế kiến trúc "cao cấp xa vời", ý tưởng thực ra đều bắt nguồn từ tầng dưới. Cứ thử nghĩ xem, những thứ như kiến trúc hệ thống máy tính, hệ điều hành, giao thức mạng, đã trải qua bao nhiêu năm tiến hóa mới thành dạng như ngày nay, những vấn đề phức tạp gặp phải trong quá trình tiến hóa là vô số, hiểu được tư duy giải quyết những vấn đề này, rồi nhìn các công nghệ tầng trên sẽ thấy rất đơn giản.

## 7. Thích khoe mẽ

Có những người ngày ngày đem các thuật ngữ kỹ thuật "cao cấp xa vời" treo bên miệng, sợ người khác không biết mình đã học được công nghệ cao siêu gì, miệng thì thích khoe mẽ, nhưng người khác vừa hỏi tới chi tiết là á khẩu không nói được gì.

## 8. Không chấp nhận bị hoài nghi

Phương án do mình thiết kế, khi người khác đặt câu hỏi thì chỉ biết đáp trả, thay vì phân tích lợi hại một cách lý trí, giao tiếp với tâm thế học hỏi.

Những người này học được chút kiến thức là tưởng mình giỏi lắm, không ngờ rằng chỉ là do mình thấy biết quá ít.

## 9. Quy ước API không đúng chuẩn

Thỏa thuận API với người khác hoàn toàn dựa vào giao tiếp miệng, không đưa ra tài liệu mô tả đúng chuẩn, thậm chí đến lúc test liên kết (联调) mới phát hiện ra, hóa ra lại không giống với những gì đã thống nhất, hoặc đổi giao thức rồi mà không thông báo cho bên đối tác, trải nghiệm hợp tác cực kỳ tệ.

## 10. Gặp vấn đề cứ tự mình đâm đầu

Vấn đề mà lập trình viên mới rất dễ mắc phải, gặp vấn đề chỉ biết tự mình đâm đầu, kéo dài đến deadline mà vẫn không có kết quả, đến khi lãnh đạo hỏi mới biết là có vấn đề không giải quyết được.

Có vấn đề thì phản hồi kịp thời mới là có trách nhiệm với bản thân, có trách nhiệm với đội nhóm.

## 11. Hỏi thì biết, viết thì gãy

Bình thường kể về phương án kỹ thuật thì thổi phồng lên tận trời, mà bảo viết code thì hỏng bét, đúng kiểu người "mắt cao tay thấp".

## 12. Diễn đạt không logic, không đứng ở góc nhìn của người khác

Khi thảo luận vấn đề không trình bày bối cảnh, vừa lên là nói phương án của mình, người khác nghe thì mù mờ không hiểu gì, bảo bạn mô tả lại từ đầu thì bạn lại chẳng nói rõ được.

Học cách giao tiếp và diễn đạt, là nền tảng của sự hợp tác.

## 13. Không chủ động suy nghĩ, mở tay xin

Gặp vấn đề không chịu google, không suy nghĩ đã đi hỏi người khác, thích làm "người mở tay xin".

Thời gian của mỗi người đều rất quý giá, mọi người đều thích bạn mang theo suy nghĩ của bản thân đến đặt câu hỏi, một mặt có thể tránh được nhiều câu hỏi cấp thấp, mặt khác có thể nâng cao chất lượng trao đổi.

## 14. Thường xuyên phạm những lỗi lặp lại

Sau khi gặp vấn đề thì nói lần sau sẽ chú ý, nhưng lần sau vấn đề vẫn y như cũ, thiếu trách nhiệm với bản thân, nói cho cùng thì đây là vấn đề thái độ.

## 15. Thêm tính năng không xét đến khả năng mở rộng

Thêm tính năng mới chỉ quan tâm đến một mảnh nghiệp vụ nhỏ, không xét đến khả năng mở rộng tổng thể của hệ thống, hành vi nhồi code nghiêm trọng.

Cần học cách phân tích yêu cầu và những thay đổi có thể xảy ra trong tương lai, thiết kế giải pháp tổng quát hơn, giảm chi phí phát triển ở giai đoạn sau.

## 16. API không tự test, gặp vấn đề không in log

API do mình phát triển mà không tự test đã đem đi liên kết với người khác, gặp vấn đề lại nói là không in log, hiệu quả hợp tác cực kỳ thấp.

## 17. Commit code không đúng quy chuẩn

Nhiều người commit code không viết mô tả, hoặc viết mô tả vô nghĩa, đặc biệt là khi sửa đổi rất ít code, tình huống này sẽ khiến chi phí truy vết vấn đề trở nên cao hơn.

Xây dựng quy chuẩn commit code, có thể giúp bạn mỗi lần commit code đều không sửa đổi code một cách quá tùy tiện.

## 18. Tự ý sửa đổi database môi trường production

Kết nối trực tiếp vào database môi trường production để sửa đổi dữ liệu, thậm chí có trường hợp SQL UPDATE / DELETE quên viết điều kiện WHERE, gây ra sự cố dữ liệu.

Sửa đổi database môi trường production nhất định phải thận trọng rồi lại thận trọng, khuyến nghị trước khi thao tác nên nhờ đồng nghiệp review code rồi mới thao tác.

## 19. Chưa nắm rõ yêu cầu đã viết code

Nhiều lập trình viên nhận được yêu cầu, không suy nghĩ gì nhiều đã bắt đầu viết code, yêu cầu lệch với hiểu biết của mình, gây ra việc làm lại vô nghĩa.

Dành thêm chút thời gian để làm rõ yêu cầu, có thể tránh được rất nhiều vấn đề bất hợp lý.

## 20. Thiết kế quan trọng không viết tài liệu

Thiết kế quan trọng không có tài liệu được xuất bản, khi bàn giao hệ thống cho người khác chỉ mô tả bằng lời nói, làm mất đi những thông tin then chốt.

Có khi để hiểu một phương án thiết kế, một tài liệu tốt còn hiệu quả hơn xem mấy trăm dòng code.

## Tổng kết

Những thói quen xấu kể trên, bạn trúng phải mấy cái? Hoặc xung quanh bạn có gặp những người như vậy không?

Tôi cho rằng việc tránh sớm những vấn đề này, là điều bắt buộc phải làm để trở thành một lập trình viên giỏi. Tổng hợp lại những thói quen này đại khái thuộc 4 phương diện sau:

- Tố chất lập trình tốt
- Tâm thế học hỏi khiêm tốn
- Giao tiếp và diễn đạt tốt
- Chú trọng hợp tác đội nhóm

Kỹ năng chuyên môn của lập trình viên giỏi, chúng ta có thể khó lòng học được trong thời gian ngắn, nhưng những tố chất nghề nghiệp cơ bản này, thì hoàn toàn có thể làm được trong thời gian ngắn.

Chúc bạn và tôi đều "có thì sửa, không có thì tự răn mình".

<!-- @include: @article-footer.snippet.md -->