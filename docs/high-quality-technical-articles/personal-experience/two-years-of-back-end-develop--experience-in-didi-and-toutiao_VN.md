---
title: Chia sẻ kinh nghiệm backend hai năm tại DiDi và Toutiao
description: "Chia sẻ kinh nghiệm backend hai năm tại DiDi và Toutiao: tổng hợp và sắp xếp các khái niệm chính, câu hỏi thường gặp và điểm thực hành mấu chốt xoay quanh kiến thức kỹ thuật và phỏng vấn, giúp bạn học tập hiệu quả và chuẩn bị cho phỏng vấn."
category: 技术文章精选集
tag:
  - 个人经历
head:
  - - meta
    - name: keywords
      content: 滴滴工作经验,头条工作经验,后端开发,技术成长,职场经验,深入思考,总结沉淀,主动承担
---

> **Lời giới thiệu**: Một bài chia sẻ kinh nghiệm làm việc rất thực tế, đọc xong rất có ích!
>
> **Tổng quan nội dung**:
>
> - Phải học cách suy nghĩ sâu sắc, tổng kết và tích lũy, đây là điều tôi cho là quan trọng và cũng ý nghĩa nhất.
> - Tích cực học tập, giữ vững niềm đam mê kỹ thuật. Nếu chúng ta tích cực học tập, giữ cho năng lực kỹ thuật, vốn kiến thức tỷ lệ thuận với số năm kinh nghiệm, thì đến 35 tuổi còn lo lắng gì nữa? Những "đại cao thủ" như vậy tôi nghĩ chắc chắn các công ty lớn cũng tranh nhau mời về chứ?
> - Về việc làm nên chuyện, tạo ra giá trị cho công ty, tôi nghĩ hai chữ quan trọng nhất chính là chủ động: chủ động nhận nhiệm vụ, chủ động giao tiếp, chủ động thúc đẩy tiến độ dự án, chủ động điều phối tài nguyên, chủ động báo cáo lên cấp trên, chủ động tạo ảnh hưởng, v.v.
> - Mặt dày một chút, chủ động tìm người trò chuyện, hòa nhập nhanh, tối kỵ nhất là có vấn đề cũng không nói, tự cô lập chính mình.
> - Muốn nịnh thì cứ nịnh, không muốn nịnh thì cũng không cần ghen tị với người khác, Respect Greatness.
> - Luôn trong tư thế sẵn sàng, kỹ thuật trong tay thì chẳng có gì đáng sợ, ngày nào làm không vui thì nhảy việc.
> - Bình thường tích cực tổng kết tích lũy, giao lưu với nhiều người, hình thành phương pháp luận.
> - ……
>
> **Địa chỉ bài gốc**: <https://www.nowcoder.com/discuss/351805>

Trước tiên xin nói sơ qua về bối cảnh: tôi học thạc sĩ liên thông tại một trường 985 không mấy tên tuổi, tốt nghiệp năm 2017 và gia nhập DiDi. Thời điểm tìm việc hồi đó cũng chính là chiến đấu cùng mọi người trên Niuke (牛客). Nửa cuối năm nay tôi nhảy sang Toutiao, vẫn làm công việc liên quan đến phát triển backend. Trước đây không có kinh nghiệm thực tập, nên coi như có khoảng hai năm rưỡi kinh nghiệm làm việc. Trong hai năm rưỡi này, tôi đã thăng chức một lần, đổi một công ty, có những khoảng thời gian vui vẻ mãn nguyện, cũng có những ngày mơ hồ giằng xé, nhưng dù sao cũng khá suôn sẻ khi từ một "gà mới" nơi công sở trở thành một "lão làng lười biếng". Trong quá trình này, tôi rút ra được một số kinh nghiệm "lười biếng" khá thực dụng, có cái tự ngộ ra, có cái học được từ việc trao đổi với người khác, hôm nay xin chia sẻ với mọi người.

## Học cách suy nghĩ sâu sắc, tổng kết và tích lũy

**Điều đầu tiên tôi muốn nói chính là phải học cách suy nghĩ sâu sắc, tổng kết và tích lũy, đây là điều tôi cho là quan trọng nhất và cũng ý nghĩa nhất.**

**Trước tiên nói về suy nghĩ sâu sắc.** Trong giới lập trình viên, thường nghe thấy những câu như: _"Công việc của tôi chẳng có chút hàm lượng kỹ thuật nào, ngày nào cũng chỉ có CRUD, thêm chút if-else, thế này thì học được cái gì?"_

Nếu gạt bỏ một phần tông giọng đùa cợt và trêu chọc, đây có thể thực sự là suy nghĩ thật của một bộ phận các bạn, ít nhất thì bản thân tôi ngày xưa cũng từng nghĩ như vậy. Sau này cùng với việc tích lũy kinh nghiệm làm việc, cộng thêm trao đổi thảo luận với một số bạn có cấp độ (level) cao hơn, tôi phát hiện ra suy nghĩ này thực ra rất sai lầm. Sở dĩ xuất hiện quan điểm "chẳng có gì để học", về cơ bản là kết quả của sự lười biếng trong tư duy. **Bất kỳ một việc nhỏ nhặt nào trông có vẻ chẳng đáng để tâm, chỉ cần suy nghĩ sâu sắc, đào sâu theo chiều dọc hoặc mở rộng theo chiều ngang một chút, đều là đại dương kiến thức khiến người ta đắm chìm.**

Tôi lấy một ví dụ. Có lần một bạn học cùng nói với tôi, tuần này có một service bị OOM, tra cứu cả tuần mới phát hiện ra có chỗ defer viết có vấn đề, sửa vài dòng code lên production là xong, đến báo cáo tuần (weekly report) cũng chẳng biết viết gì. Có lẽ mọi người cũng từng gặp tình huống như vậy, cũng khá mang tính đại diện. Thực ra xét về chuyện sửa lỗi (debug), đó là một quá trình phát hiện vấn đề, điều tra vấn đề, giải quyết vấn đề, bao gồm rất nhiều bước như kích hoạt (trigger), định vị (locate), tái hiện (reproduce), nguyên nhân gốc (root cause), sửa chữa, rà soát tổng kết (retrospective), v.v. Dành cả một tuần làm việc này, nhất định có quá trình không ngừng thử nghiệm và sửa sai, trong đó thực ra có rất nhiều không gian để suy nghĩ. Ví dụ như định vị, làm thế nào để thu hẹp phạm vi? Đã đi những đường vòng nào? Đã dùng những công cụ phân tích nào? Ví dụ như nguyên nhân gốc, điểm có thể nghiên cứu ít nhất có OOM của linux, OOM của k8s, quản lý bộ nhớ của go, cơ chế defer, nguyên lý closure của hàm, v.v. Nếu thực sự không liên quan đến những thứ này, vẫn dành cả tuần làm việc đó, thì buổi rà soát tổng kết hẳn sẽ có nhiều suy ngẫm, đặt ra vài chục cái WHY cũng không vấn đề gì chứ...

**Nói tiếp về tổng kết và tích lũy.** Tôi nghĩ đây cũng là điểm mà hầu hết lập trình viên còn thiếu: chỉ biết cắm đầu làm việc, có thể làm tốt một việc. Nhưng gần như không bao giờ làm tổng kết trừu tượng hóa, đến mức làm việc mấy năm rồi, kiến thức nắm được vẫn chỉ là những mảnh rời rạc, không thành hệ thống, không chỉ dễ quên mà còn khiến tầm nhìn của mình bị hẹp, nhìn vấn đề bị giới hạn. Việc kịp thời tổng kết và tích lũy là rất quan trọng, đây là một quá trình đi từ "thuật" (术) đến "đạo" (道), sẽ giúp mình nhìn vấn đề ở góc độ rộng hơn, tầng thứ cao hơn. Gặp những vấn đề cùng loại, có thể căn cứ vào phương pháp luận đã tổng kết để đẩy tiến và giải quyết một cách hệ thống, phân tầng.

Vẫn lấy một ví dụ. Làm dịch vụ backend, hôm nay tối ưu được 1G bộ nhớ, ngày mai tối ưu được 50% thời gian đọc ghi, đâu phải là không thể làm một bản tổng kết về tối ưu hiệu năng? Ví dụ ở tầng ứng dụng, có thể quản lý các ứng dụng kết nối với service, rà soát tính hợp lý trong truy cập của họ; ở tầng kiến trúc, có thể làm cache, tiền xử lý (preprocessing), tách đọc ghi (read-write separation), bất đồng bộ (async), song song (parallel), v.v.; ở tầng code, có thể làm được nhiều hơn nữa: gom tài nguyên (resource pooling), tái sử dụng đối tượng (object reuse), thiết kế không khóa (lock-free), tách key lớn, xử lý trễ (delayed processing), nén mã hóa, tinh chỉnh gc và đủ loại thực hành hiệu năng cao liên quan đến ngôn ngữ... Lần sau gặp lại tình huống cần tối ưu hiệu năng, một bộ suy nghĩ hoàn chỉnh lập tức áp dụng được ngay, phần còn lại chỉ là chuyện công cụ và thực hành.

Có bạn lại nói, tôi ngày nào cũng chỉ cãi nhau với PM, làm yêu cầu (requirement), chứ có làm tối ưu hiệu năng gì đâu. Tạm không bàn đến chuyện có thể tối ưu hiệu năng hay không, chỉ riêng việc làm yêu cầu nghiệp vụ thôi, cũng có chỗ để tổng kết. Ví dụ, làm thế nào để xây dựng hệ thống? Tính năng cốt lõi của hệ thống, ranh giới hệ thống, nút thắt cổ chai của hệ thống, phân tầng và tách rời service, quản trị service (service governance) — những vấn đề này đã suy nghĩ qua chưa? Mỗi ngày thảo luận yêu cầu với PM, vậy với tư cách là một người làm kỹ thuật, làm thế nào để bồi dưỡng tư duy sản phẩm, định hướng chiều hướng phát triển của sản phẩm, làm thế nào để kiến trúc đi trước nghiệp vụ, những vấn đề này cũng đáng để suy nghĩ và tổng kết chứ. Cứ nghĩ mà xem, ngay cả chuyện nhận về duy trì code rác của người khác — một việc vô cùng đau đầu — cũng có thể khiến Martin Fowler nghĩ ra cả một hệ lý thuyết refactoring, còn trông thật cao siêu, vậy thì chúng ta thực sự không cần thiết phải tự ti về công việc của mình...

Vì vậy: **Học tập và trưởng thành là một quá trình tự thúc đẩy (self-driven), nếu cảm thấy chẳng có gì để học, thì khả năng lớn là không phải thực sự không có gì để học, mà là vì bản thân quá lười, không chỉ lười trong hành động mà còn lười trong tư duy nữa. Có thể viết nhiều bài viết kỹ thuật, chia sẻ nhiều hơn, ép bản thân suy nghĩ và tổng kết, dù sao nếu bài viết thiếu chiều sâu, người ta cũng ngại công khai chia sẻ.**

## Tích cực học tập, giữ vững niềm đam mê kỹ thuật

Trong hai năm gần đây, cộng đồng internet lan truyền rộng rãi một thuyết lo lắng gọi là "hiện tượng lập trình viên 35 tuổi", đại ý nói rằng ngành lập trình viên làm đến 35 tuổi về cơ bản là chờ bị sa thải. Không thể phủ nhận, ngành internet ở điểm này quả thực không bằng những nghề trong hệ thống như công chức. Nhưng, trong vấn đề này, "lập trình viên 35 tuổi" không phải là 35 tuổi theo nghĩa sinh lý tuyệt đối, mà là ám chỉ những lập trình viên làm mười mấy năm chẳng khác gì mấy so với những người làm hai ba năm. Những năm sau đó về cơ bản là sống dựa vào vốn cũ, không chủ động học tập và nạp thêm năng lượng, 35 tuổi cũng na ná 25 tuổi, mà lại không còn khát khao học tập và trưởng thành như hồi 25 tuổi, ngược lại còn thêm bao nhiêu chuyện vụn vặt của cuộc sống gia đình, yêu cầu lương thường cũng cao hơn, trong mắt doanh nghiệp thì quả thực là không có mấy sức cạnh tranh.

**Nếu chúng ta tích cực học tập, giữ cho năng lực kỹ thuật và vốn kiến thức tỷ lệ thuận với số năm kinh nghiệm, thì đến 35 tuổi còn lo lắng gì nữa, những "đại cao thủ" như vậy tôi nghĩ chắc chắn các công ty lớn cũng tranh nhau mời về chứ?** Nhưng, **việc học tập thực ra là một quá trình phản lại bản năng con người, đòi hỏi chúng ta phải ép mình nhảy ra khỏi vùng an toàn, chủ động học tập, giữ vững niềm đam mê kỹ thuật.** Ở DiDi có một câu đại loại là: **chủ động nhảy ra khỏi vùng an toàn của bản thân, khi cảm thấy giằng xé và áp lực, thường đó chính là bóng tối trước bình minh, mới là lúc trưởng thành nhanh nhất. Ngược lại, nếu cảm thấy ngày nào cũng sống quá an nhàn, công việc chỉ là câu giờ thời gian, thì có lẽ thực sự đang bị "nấu ếch trong nước ấm" rồi.**

Khoảng thời gian mới tốt nghiệp, thường thì thời gian rảnh còn tương đối nhiều, đúng là thời điểm tốt để chăm chỉ học kỹ thuật. Nhờ khoảng thời gian này để củng cố nền tảng, bồi dưỡng thói quen học tập tốt, giữ thái độ học tập tích cực, hẳn sẽ có ích cho cả đời. Còn về việc học tập hiệu quả như thế nào, trên mạng có rất nhiều bài viết của các cao thủ, sau khi vào công ty thì trên mạng nội bộ cũng tìm thấy rất nhiều bài chia sẻ như vậy, tôi không bàn thêm nữa.

**_Có thể tham gia các nhóm học tập và cộng đồng kỹ thuật, trong công ty hay ngoài công ty đều được, theo dõi công nghệ tiên tiến._**

## Chủ động nhận việc, kịp thời trao đổi và phản hồi

Hai điều trước vẫn đứng từ góc độ cá nhân để nói, hy vọng mọi người có thể nâng cao năng lực cá nhân, giữ vững năng lực cạnh tranh cốt lõi, nhưng đứng từ góc độ công ty, công ty tuyển nhân viên vào làm, quan trọng nhất là để nhân viên tạo ra giá trị nghiệp vụ, phục vụ cho công ty. Mặc dù đối với sinh viên mới tốt nghiệp (校招生) thường có một hệ thống đào tạo nhất định, nhưng thực tế công ty không có nghĩa vụ giúp chúng ta trưởng thành.

**Về điểm làm nên chuyện, tạo ra giá trị cho công ty, tôi nghĩ hai chữ quan trọng nhất chính là chủ động: chủ động nhận nhiệm vụ, chủ động giao tiếp, chủ động thúc đẩy tiến độ dự án, chủ động điều phối tài nguyên, chủ động báo cáo lên cấp trên, chủ động tạo ảnh hưởng, v.v.**

Lúc tôi mới vào công ty, về cơ bản là leader giao nhiệm vụ gì thì làm tốt công việc bổn phận đó, rồi làm việc riêng của mình, gần như chưa bao giờ chủ động giao lưu với người khác hay chủ động suy nghĩ những ý tưởng có thể giúp dự án phát triển. Tự cho rằng hoàn thành tốt công việc bổn phận là đủ, sau này mới phát hiện làm như vậy thực ra là rất không đủ, đó chỉ là yêu cầu cơ bản nhất. Còn cách làm của một số bạn là leader chỉ cần đồng bộ (sync) định hướng sắp tới làm gì, còn một loạt việc phía sau về cơ bản không cần leader phải bận tâm. Nếu tôi là leader, tôi cũng thích những bạn như vậy. Sau khi vào công ty thường nghe thấy một từ gọi là tinh thần owner (owner 意识), đại khái chính là ý này.

Trong quá trình này, một điểm rất quan trọng nữa là kịp thời báo cáo và phản hồi lên cấp trên. Dự án tiến triển không suôn sẻ, gặp vấn đề gì thì kịp thời đồng bộ (sync) với leader, phương án kỹ thuật chưa chắc chắn thì có thể trao đổi với leader, một số tài nguyên không điều phối được thì có thể nhờ leader giúp đỡ, đừng quá kiêng dè, cho rằng như vậy sẽ làm phiền người ta, leader thực ra chính là làm việc này. Nếu dự án tiến triển khá suôn sẻ, thực sự không cần leader can thiệp, thì cũng cần kịp thời phản hồi tiến độ dự án và lợi ích đạt được, có ý tưởng gì cũng nêu ra để trao đổi, hỏi leader xem có góp ý gì về tiến độ hiện tại không, còn những chỗ nào cần cải thiện, loại bỏ sai lệch thông tin. Làm những việc này, một mặt là tận dụng hợp lý các nguồn tài nguyên của leader, mặt khác cũng giúp leader nắm được khối lượng công việc của mình, kiểm soát tổng thể dự án, dù sao leader cũng có leader của mình, cũng phải báo cáo. Có lẽ đây chính là thứ mà mọi người khá phản cảm gọi là "quản lý cấp trên" (upward management), đúng vị đó luôn, thực ra cái này tôi cũng làm không tốt. Nhưng điểm cơ bản nhất là, đừng nhận một nhiệm vụ rồi cắm đầu làm việc, thậm chí cách biệt với thế giới, cả tháng cũng không đồng bộ (sync) với leader lần nào, cứ nghĩ tới việc giấu một "chiêu lớn" gì đó, thì về cơ bản là toang.

**Nhất định phải chủ động, có thể bắt đầu từ việc ép mình phát biểu ở nhiều nơi công khai, có vấn đề hoặc ý tưởng thì kịp thời one-one.**

Ngoài những điểm trên, còn có một số điểm nhỏ mà tôi cảm thấy cũng khá quan trọng, liệt kê dưới đây:

## Việc đầu tiên: xây dựng lòng tin

Dù là tuyển dụng sinh viên mới (校招) hay tuyển dụng xã hội (社招), việc đầu tiên khi mới vào công ty là rất quan trọng, trực tiếp quyết định ấn tượng đầu tiên của leader và đồng nghiệp về mình. Việc đầu tiên cần làm sau khi vào công ty nhất định phải làm tốt, tối thiểu là hoàn thành thuận lợi và không được gây ra sự cố production (线上事故). Mục đích của việc này chính là xây dựng lòng tin, để đội nhóm cảm thấy mình ít nhất là đáng tin cậy. Nếu việc này làm tương đối tốt, sau này cả đoạn đường đều khá thuận lợi. Nếu việc này làm hỏng, có thể một số leader còn cho cơ hội thứ hai, làm hỏng thêm nữa thì sau này sẽ rất khó, điều này đối với tuyển dụng xã hội còn quan trọng hơn.

Còn mới vào công ty, technical stack của công ty chưa thành thạo, nghiệp vụ phức tạp khó mà gỡ ra được đầu mối, áp lực quả thực khá lớn. Lúc này, một mặt cần đầu tư nhiều công sức hơn của bản thân, mặt khác phải giao lưu nhiều với các bạn trong nhóm, không hiểu thì hỏi. **Cách học hiệu quả nhất, tôi nghĩ không phải là đọc sách hay xem video học tập, mà là trực tiếp tìm người tương ứng để trò chuyện, để người ta giảng một lượt là mình cơ bản hiểu hết, hiệu quả này nhanh hơn hẳn so với xem tài liệu, xem code, không chỉ tiết kiệm quá trình lọc bỏ thông tin vô dụng, mà còn hiểu được lịch sử tiến hóa của nghiệp vụ. Tất nhiên, điều này cần một chút kỹ năng giao tiếp, dù sao các đồng nghiệp cũng đều rất bận.**

**Mặt dày một chút, chủ động tìm người trò chuyện, hòa nhập nhanh, tối kỵ nhất là có vấn đề cũng không nói, tự cô lập chính mình.**

## Vượt quá kỳ vọng

Ngoại diên của từ "vượt quá kỳ vọng" rất rộng, ví dụ leader giao cho làm tuần trực (值周), giải đáp thắc mắc của mọi người trong nhóm người dùng, kết quả không chỉ giải đáp được thắc mắc của mọi người, mà còn thu thập các câu hỏi này phân loại, rồi làm thêm một robot trả lời thông minh giải phóng nhân lực trực tuần, đó có thể tính là vượt quá kỳ vọng. Ví dụ leader giao cho làm một công cụ nhỏ cho vận hành (operation), kết quả xây dựng được cả một loạt công cụ thậm chí phát triển thành một nền tảng, trở thành một dự án hoàn chỉnh, đó cũng tính là vượt quá kỳ vọng. Vượt quá kỳ vọng đòi hỏi chúng ta có năng lực làm lớn việc, tức là nghĩ được những chỗ mà leader chưa nghĩ tới, đồng thời tạo ra giá trị thực tế, đạt được lợi ích nghiệp vụ. Năng lực này thực ra cũng khá quan trọng, trong công việc phát hiện ra rằng, có người có thể làm cho một "mâm nhỏ" ngày càng lớn, mà có người lại ngược lại, vậy thì những bạn có năng lực đổi mới, thường xuyên vượt quá kỳ vọng rõ ràng có không gian phát triển lớn hơn một chút.

**Phần này thực ra khá phụ thuộc vào năng lực cá nhân, tạm thời chưa nghĩ ra được con đường tắt nào tốt, cứ nghĩ trước một bước vậy.**

## Suy nghĩ hệ thống hóa, xây dựng có hệ thống

Câu này được tổng kết ra khi thăng chức, đại ý là làm xây dựng hệ thống phải có tầm nhìn toàn cục, đừng giới hạn ở một điểm nhỏ, nên có năng lực quy hoạch tốt và bản đồ phát triển (roadmap) rõ ràng. Ví dụ, hôm nay thêm một cái monitoring, ngày mai thêm một cái cảnh báo, những việc này không nên trở thành từng ốc đảo riêng lẻ, mà phải thuộc về một bước nhỏ trong giai đoạn một của việc xây dựng ổn định. Công việc của giai đoạn một xây dựng ổn định này là cấu hình cảnh báo và rà soát monitoring, bao gồm monitoring máy chủ, monitoring hệ thống, monitoring nghiệp vụ, monitoring dữ liệu, v.v., dự kiến đạt được lợi ích XXX. Công việc này còn có roadmap tiếp theo: giai đoạn hai xây dựng ổn định làm quy hoạch dung lượng (capacity planning), đưa vào kiểm thử áp lực (stress test); giai đoạn ba làm diễn tập hạ cấp (degradation drill), khôi phục thảm họa đa hoạt động (multi-active disaster recovery); giai đoạn bốn làm... Cảm giác mang lại chính là người này suy nghĩ rất toàn diện, làm việc có hệ thống và có quy hoạch.

**Bình thường tích cực tổng kết tích lũy, giao lưu với nhiều người, hình thành phương pháp luận.**

## Nâng cao năng lực kỹ năng mềm của bản thân

Năng lực kỹ năng mềm ở đây thực ra muốn nói tới các năng lực về PPT, giao tiếp, diễn đạt, quản lý thời gian, thiết kế, tài liệu, v.v. Nói thật, tôi cảm thấy lúc đó tôi có thể thăng chức chính là nhờ PPT làm khá hơn một chút... Có lẽ mọi người bình thường không mấy quan tâm đến những năng lực này, trước đây tôi cũng không coi trọng, cảm thấy khá đơn giản, lúc cần thì dùng ngay là được, nhưng thực tế có lẽ không đơn giản như tưởng tượng. Ví dụ việc PPT + thuyết trình (presentation) + trả lời chất vấn (defense) khi thăng chức, thực ra có rất nhiều chi tiết cần suy nghĩ trong đó: nội dung chọn như thế nào, bố cục (layout) thiết kế ra sao, làm thế nào dẫn dắt cảm xúc của người nghe, trả lời câu hỏi của hội đồng thẩm định như thế nào, v.v. Khi thăng chức, tôi thấy rất nhiều bạn bố cục nội dung PPT lộn xộn, quá trình thuyết trình cũng không trôi chảy tự nhiên, mặc dù thực sự làm rất nhiều việc thực tế, nhưng lại thiếu nhiều trong diễn đạt, thuộc dạng "làm được mà không nói được", nếu gặp thêm hội đồng thẩm định đến từ bộ phận ngoài không hiểu tình hình thực tế, thì việc thiệt thòi là điều có thể thấy trước.

**_Mạng nội bộ của công ty thường có một số khóa đào tạo kỹ năng mềm, có thể tìm một số dịp để luyện tập có chủ đích._**

Những chia sẻ trên đều khá "cao cả chính trực", nhưng xã hội đâu phải lúc nào cũng tươi đẹp như vậy. Nội dung bên dưới có xu hướng năng lượng tiêu cực, các bạn có quan niệm sống (三观) đặc biệt chuẩn chỉnh và những ai cảm thấy không thoải mái thì nên bỏ qua.

## Nịnh bợ thật sự "thơm"

Cái trò nịnh bợ, trước khi vào làm tôi khá phản cảm, lý do ban đầu tôi muốn gia nhập công ty internet chính là cảm thấy công ty internet không nhiều "phép xã giao" người người nhà nhà như vậy, sự thực chứng minh, tôi đã sai... Mấy ngày đầu vào công ty, trong nhóm chat của bộ phận, leader lớn gửi một tin nhắn, ngay lập tức mấy chục tin nhắn kèm ngón tay cái đuổi theo: "học được", "thích", "đúng là hay", "xuất sắc". Cái cảnh tượng đó, nói là "cờ đỏ phấp phới, trống chiêng rền vang, pháo nổ tưng bừng" cũng chẳng hề quá lời. Ngoài việc kinh ngạc về khả năng tiếp nhận thông tin và tốc độ xử lý siêu phàm của mọi người, xa hơn nữa tôi còn phát hiện ra, nịnh bợ cũng có đội hình cả: leader bộ phận cấp một gửi tin nhắn, mấy leader bộ phận cấp hai nối theo, phía sau là các trưởng nhóm nối theo, cuối cùng là sự cuồng nhiệt của tất cả mọi người. Điều đó từng khiến tôi nghi ngờ rằng tốc độ nịnh bợ quyết định tiền đồ phát triển sự nghiệp (đúng vậy, giờ tôi đã không còn nghi ngờ gì nữa).

Thành thật mà nói, đến giờ tôi vẫn chưa quen nịnh bợ trong nhóm chat, nhưng cũng không còn phản cảm nữa, có thể coi việc này như một niềm vui. Không phải tôi không có tài hùng biện và năng lực (thực ra cũng chẳng cần gì tài hùng biện, mọi người đều đơn giản trực tiếp), trong một số dịp nhất định, vì nhu cầu làm sôi động bầu không khí, tôi cũng có thể "miệng lưỡi ngọt như mật", thậm chí có thể "thả cầu vồng" (nịnh) bằng cả thơ ca cổ điển cho leader. Mà tôi phát hiện ra leader trực tiếp của tôi cũng không mấy nịnh bợ trong nhóm chat, vì vậy việc tôi bề ngoài không công khai nịnh bợ thực chất lại là âm thầm chiều theo sở thích của leader...

Nhưng chuyện nịnh bợ này chỉ cần nắm được mức độ, nhìn chung vẫn là "thơm", tệ nhất là vô dụng, ít nhất cũng không có hại gì. Năng lực mọi người đều na ná nhau, mỗi lần cơ hội nịnh bợ trong nhóm chat chính là một lần cơ hội lộ diện, theo cách nói của một đồng nghiệp nào đó, đây gọi là xây dựng ảnh hưởng kỹ thuật cá nhân...

**Muốn nịnh thì cứ nịnh, không muốn nịnh thì cũng không cần ghen ghét người khác, Respect Greatness.**

## Trận chiến cãi vã đổ lỗi không bao giờ vắng mặt

Nơi nào có người, nơi đó có giang hồ. Mặc dù người làm kỹ thuật đa phần không có nhiều toan tính sâu xa, nhưng những chuyện phiền lòng như cãi vã (撕逼), đổ lỗi (甩锅), nhận công (邀功), tranh việc (抢活) về cơ bản cũng không bao giờ vắng mặt, thậm chí tôi còn từng thấy người ta cãi vã công khai qua email gửi hàng loạt nữa... Chủ đề này liên quan đến một số thông tin nhạy cảm nên không nói nhiều, mà những người cấp bậc thấp như chúng tôi cũng không có nhiều cơ hội gặp những chuyện này. Chỉ là nhắc nhở mọi người một câu, trong lúc làm việc sớm muộn gì cũng sẽ "ăn dưa" (chứng kiến drama) liên quan đến mấy chuyện này, đến lúc đó hãy để ý một chút.

**Hơi để ý một chút, chúng ta không đi bắt nạt người khác, nhưng cũng không thể để người khác bắt nạt mình một cách dễ dàng.**

## Đừng để bị "vẽ bánh" che mắt

Nói thật, cá nhân tôi khá phản cảm với những hành vi kiểu "đổ canh gà" (động viên suông), "tiêm máu gà" (tiếp lửa), nói về giấc mơ, nói về phấn đấu, năm 9102 sắp qua hết rồi, mà bộ "*** trị" này vẫn còn đang thịnh hành, thật không biết nên buồn cười hay đáng thương. Tất nhiên, bản thân những từ này không có vấn đề gì, nhưng những thứ này nên là tự thúc đẩy, chứ không nên trở thành một thứ bị ép từ bên ngoài (push). Câu "Tôi nhất định phải phấn đấu nỗ lực" tôi nghĩ là bình thường, nhưng câu "Anh nhất định phải phấn đấu nỗ lực" kiểu này nghe có chút kỳ quặc, phấn đấu nỗ lực để cho cổ đông công ty phát tài phát lộc? Đặc biệt trong trường hợp tiền không được trả đủ, những hành vi này chẳng khác gì chơi xấu. Chúng ta cần giữ nhận thức tỉnh táo với những chiêu "vẽ bánh" (画饼) của leader, phân tích lý trí, đưa ra quyết định. Ví dụ khi cảm thấy tiền không được trả đủ (hoặc cấp bậc quá thấp, suy luận tương tự), có thể có mấy trường hợp sau:

1. leader không hề chú ý đến sự thật là lương của bạn đang ở mức thấp
2. leader biết sự thật này, nhưng không biết nhu cầu tăng lương của bạn mạnh mẽ đến mức nào
3. leader biết bạn có nhu cầu tăng lương, nhưng anh ấy cảm thấy năng lực của bạn chưa đủ
4. leader biết bạn có nhu cầu tăng lương, năng lực cũng đủ, nhưng anh ấy không muốn tăng cho bạn
5. leader muốn tăng cho bạn, cũng đã báo cáo lên và tranh thủ rồi, nhưng không có tài nguyên (ngân sách)

Lúc này việc chúng ta cần làm là báo cáo lên cấp trên, trao đổi xác nhận với leader. Nếu là trường hợp 1 và 2, thì thông qua giao tiếp có thể loại bỏ sai lệch thông tin. Nếu là trường hợp 3, cần thảo luận theo từng tình huống. Nếu là trường hợp 4 và 5, thì đã có thể cân nhắc rút lui rồi. Đối với những chuyện này, cũng không cần thiết phàn nàn, phàn nàn không giải quyết được vấn đề gì. Việc chúng ta cần làm chính là nỗ lực nâng cao năng lực cá nhân, giữ vững sức cạnh tranh cá nhân, chờ một thời điểm thích hợp, nhảy việc là xong.

**Luôn trong tư thế sẵn sàng, kỹ thuật nắm trong tay thì chẳng có gì đáng sợ, ngày nào làm không vui thì nhảy việc luôn.**

## Học cách "đóng gói" (packaging)

Điều này nói thẳng ra là, phải biết "thổi". Không nhớ xem từ đâu đọc được, "biết nói, biết viết, giỏi làm" là ba yêu cầu lớn đối với người đi làm. Biết nói rất quan trọng, biết nói mới xin được dự án, kéo được tài nguyên, chiêu mộ được người. Cùng một việc, người khác nhau nói ra hiệu quả hoàn toàn khác nhau. Ví dụ tôi làm một công cụ nhỏ lên production, tôi chỉ nói ra được những sự thật cơ bản, mà để leader mô tả một chút, thì thành ra: "tạo ra điểm bám tay (抓手) công cụ XXX, cải thiện hệ sinh thái hoàn chỉnh của XXX, hình thành vòng khép kín (闭环) nghiệp vụ XXX". Anh bạn à, tôi phục rồi, xu tất cả đưa anh cũng được mà. Theo quan sát của tôi, công ty internet nào cũng có mấy từ này: điểm bám tay (抓手), hệ sinh thái (生态), vòng khép kín (闭环), kéo ngang bằng (拉齐), rà soát (梳理), lặp (迭代), tinh thần owner, v.v. v.v. Việc chúng ta cần làm chính là đọc thuộc và học thuộc lòng toàn văn, à không, là ghi nhớ sâu và sử dụng thành thạo.

Đây là "đóng gói" sự việc, "đóng gói" con người cũng như vậy, đặc biệt trong những dịp kiểu "thi cử" như thăng chức và phỏng vấn, đặc điểm là quy trình ngắn, một phát ăn ngay, thì "đóng gói" càng trở nên quan trọng. Thăng chức và phỏng vấn ở đây không bàn rộng ra, trong đó "đạo" và "thuật" quá nhiều. Tình huống bên dưới được chắt lọc từ cuộc trò chuyện trong quá trình phỏng vấn với người phỏng vấn của một công ty nào đó, mọi người có thể cảm nhận một chút:

1. Phía sau chúng tôi là một thị trường trị giá bốn năm chục tỷ USD...
2. Tôi từng phụ trách hệ thống có lượng truy cập cấp trăm tỷ mỗi ngày...
3. Làm việc hai năm mà đạt được mức này cũng khá tốt đấy...
4. Bầu không khí kỹ thuật của quý công ty khá tốt, triển vọng phát triển nghiệp vụ cũng rất rộng mở...
5. À, anh nào cũng vậy cả...
6. Ừm, ngưỡng mộ lâu rồi, ngưỡng mộ lâu rồi...

Cuộc đời như tuồng, tất cả nhờ diễn xuất

**Có thể xem nhiều PPT của leader, nghe nhiều bài báo cáo lên cấp trên và buổi thuyết trình của sếp.**

## Lựa chọn và nỗ lực, cái nào quan trọng hơn?

Câu này cần gì phải hỏi, tất nhiên là lựa chọn. Trước sự lựa chọn hoàn hảo, nỗ lực trở nên chẳng đáng một xu, tôi có một người bạn học cùng cấp 3 đã mấy năm không liên lạc, năm nay đã đi đánh chuông ở Quảng trường Thời Đại (Times Square) rồi... Nhưng những trường hợp như vậy quá hiếm, cái giá ngẫu nhiên để đưa ra lựa chọn hoàn hảo quá cao, độ bất định quá lớn. Đối với đa số các bạn mới tốt nghiệp, khả năng phán đoán ngành nghề chưa đủ chín chắn, nắm bắt năng lực bản thân và độ khó của việc khởi nghiệp cũng chưa đủ chuẩn xác, lúc này kéo vài người đi khởi nghiệp thì rủi ro quá cao. Tôi nghĩ một con đường vững chắc hơn là trước tiên gia nhập một công ty quy mô hơi lớn hơn một chút, tìm một leader tốt, ôm chặt "đùi" (chỗ dựa), nâng cao năng lực cá nhân của mình. Nền tảng tốt cộng thêm chỗ dựa tốt, cộng thêm nỗ lực cá nhân, tốc độ cất cánh này đã là đủ. Chờ sau này tích lũy được một lượng quan hệ và vốn nhất định, hiểu sâu về thị trường và nhu cầu, tự tin vào bản thân rồi, thì mới có thể cân nhắc đến chuyện khởi nghiệp.

## Lời kết

Vốn định còn chia sẻ thêm một số câu chuyện về cuộc sống, phát hiện ra đã dài như vậy rồi, thì cứ dừng ở đây vậy. Một số tổng kết và góp ý viết ở trên bản thân tôi làm cũng không tốt lắm, vẫn cần tiếp tục cố gắng, cùng nhau đồng hành với mọi người. Ngoài ra, một số quan điểm trong đó, do hạn chế về góc nhìn cá nhân, cũng không đảm bảo là phổ quát và chính xác, có thể làm thêm vài năm nữa những quan điểm này cũng sẽ thay đổi, hoan nghênh mọi người trao đổi với tôi~ (đổ lỗi thành công)

Cuối cùng chúc mọi người đều tìm được công việc ưng ý, làm việc vui vẻ, sống hạnh phúc, đất trời rộng mở, có nhiều thành tựu.

<!-- @include: @article-footer.snippet.md -->