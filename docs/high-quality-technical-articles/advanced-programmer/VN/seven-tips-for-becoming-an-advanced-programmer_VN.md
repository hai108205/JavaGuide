---
title: Bảy lời khuyên dành cho các bạn muốn trưởng thành lên cấp cao
description: "Bảy lời khuyên dành cho các bạn muốn trưởng thành lên cấp cao: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, sắp xếp các khái niệm then chốt, vấn đề thường gặp và điểm thực hành, giúp bạn học tập hiệu quả và sẵn sàng chinh chiến phỏng vấn."
category: 技术文章精选集
author: Kaito
tag:
  - 练级攻略
head:
  - - meta
    - name: keywords
      content: 程序员成长,高级开发,需求评审,技术内功,性能优化,线上问题排查,归纳总结,职业发展
---

> **Lời giới thiệu**: Một lập trình viên bình thường nếu muốn trưởng thành thành lập trình viên cấp cao (senior) hay thậm chí là chuyên gia (expert) ở cấp độ cao hơn, thì nên chú ý tăng cường ở những khía cạnh nào? Chủ bút 飞哥 của công chúng hào「开发内功修炼」đã đưa ra bảy lời khuyên rất thực tế trong bài viết này.
>
> **Tổng quan nội dung**:
>
> 1. Cố gắng tăng cường năng lực đánh giá yêu cầu (requirements review)
> 2. Chủ động suy nghĩ về hiệu quả
> 3. Tăng cường năng lực nội công
> 4. Suy nghĩ về hiệu năng
> 5. Coi trọng môi trường production
> 6. Quan tâm đến tổng thể
> 7. Năng lực tổng kết quy nạp
>
> **Địa chỉ bài gốc**: <https://mp.weixin.qq.com/s/8lMGzBzXine-NAsqEaIE4g>

### Lời khuyên 1: Cố gắng tăng cường năng lực đánh giá yêu cầu

Hãy bắt đầu từ việc đánh giá yêu cầu. Ở các công ty Internet, đánh giá yêu cầu chính là cửa ngõ chính của công việc phát triển.

Đối với lập trình viên bình thường, thường chỉ dựa theo chi tiết yêu cầu do product manager đưa ra, rồi bắt đầu hình dung tính năng này sẽ được triển khai như thế nào, chi phí phát triển mất khoảng bao lâu. Tự xem mình như một "người phiên dịch" giữa yêu cầu và code. Rất ít khi suy nghĩ về tính hợp lý của yêu cầu, về việc mình làm có giá trị bao nhiêu, cũng chẳng quan tâm và chẳng hỏi.

Còn đối với lập trình viên cấp cao, họ không vội lao vào chi tiết ngay từ đầu, mà thường xuất phát nhiều hơn từ chính sản phẩm, hỏi product manager vì sao phải làm chi tiết này, mục đích là gì. Nói cách khác, họ sẽ cân nhắc trước yêu cầu này có hợp lý hay không.

Nếu yêu cầu không hợp lý thì sẽ tiến hành PK, hoặc điều chỉnh yêu cầu, hoặc cắt bỏ đi. Tuy nhiên cần lưu ý, PK và điều chỉnh yêu cầu không chỉ là cắt yêu cầu, mà còn có một hướng khác, đó là tăng cường yêu cầu.

Đồng nghiệp bên product do thiếu nền tảng kỹ thuật nên rất có thể suy nghĩ chưa đầy đủ, lúc này nếu bạn có ý tưởng tốt hơn thì hoàn toàn có thể đề xuất, thêm vào yêu cầu, làm cho yêu cầu trở nên có giá trị hơn.

Tóm lại, lập trình viên cấp cao sẽ không làm theo từng ly từng tí tài liệu yêu cầu của product manager để triển khai phần phát triển phía sau, mà sẽ **xuất phát từ góc độ có lợi cho nghiệp vụ để suy nghĩ, tiến hành xóa, sửa, thêm đối với yêu cầu của product manager.**

Công việc như vậy bề ngoài có vẻ không liên quan đến phát triển, nhưng chỉ có như thế mới đảm bảo mọi đồng nghiệp phát triển phía sau đều làm việc có giá trị, chứ không phải làm một đống việc vô ích. Làm việc vô ích quá nhiều sẽ làm tổn hại nghiêm trọng đến cảm giác thành tựu của người phát triển.

Vì vậy, **lập trình viên bình thường nếu muốn trưởng thành thành developer ở cấp độ cao hơn, nhất định phải tăng cường rèn luyện năng lực đánh giá yêu cầu.**

### Lời khuyên 2: Chủ động suy nghĩ về hiệu quả

Lập trình viên bình thường cứ theo đúng trình tự mà viết code, có việc thì làm, không có việc thì ngồi không. Hiếm khi suy nghĩ sâu vì sao những đoạn code hiện tại lại được viết như vậy, viết như vậy có lợi ích gì, có những chỗ nào đang là điểm nghẽn (bottleneck), liệu mình có thể tối ưu hóa được chút nào không.

Còn lập trình viên cao cấp hơn một chút sẽ không giới hạn ở việc phát triển xong việc đang làm là đủ. Họ sẽ chủ động nghiền ngẫm, liệu mô hình phát triển hiện tại có chưa đủ tốt không. Vậy mình có thể làm ra thứ gì đó để nâng cao hiệu quả này lên không.

Ví dụ nhỏ, 6 năm trước khi tôi tiếp nhận một dự án, tôi phát hiện bộ phận vận hành (operations) một tháng tìm tôi bốn lần, chỉ để nhờ tôi gửi một thông báo đẩy (push notification). Cô ấy bảo các developer trước kia đều làm giúp cô như vậy. Mặc dù yêu cầu này xử lý rất đơn giản, sửa hai dòng rồi phát hành (release) là xong. Nhưng phiền lắm, bạn thử tưởng tượng lúc đang tập trung viết code thì cô ấy lại tìm đến bạn, mạch suy nghĩ bị ngắt quãng hoàn toàn. Hơn nữa thao tác thường xuyên trên môi trường production vốn dĩ sẽ đưa đến những rủi ro bất định, lỡ hôm nào lỡ tay làm sai thì production coi như xong đời.

Cách của tôi là dành hẳn một tuần để làm cho cô ấy một bộ trang quản trị vận hành (operations backend). Từ đó về sau mọi thông báo đẩy của bộ phận vận hành cô ấy chỉ cần thao tác trực tiếp trên trang quản trị là xong. Tôi giải phóng sức lực để làm những việc có giá trị hơn khác.

Vì vậy, **lời khuyên thứ hai là hãy chủ động suy nghĩ xem trong công việc hiện tại có những chỗ nào còn không gian để cải thiện hiệu quả, nghĩ ra được thì chủ động cải tiến nó!**

### Lời khuyên 3: Tăng cường năng lực nội công

Thế nào được coi là nội công? Tôi nghĩ những độc giả của「开发内功修炼」chắc chắn đều rất quen thuộc, đó chính là những kiến thức nền tảng như hệ điều hành, mạng mà mọi người đều đã học ở trường.

Lập trình viên bình thường sẽ nghĩ, mấy kiến thức nền tảng này tôi đều biết cả, hồi đại học tôi đã học đủ bốn năm rồi. Sau khi đi làm cũng không cố ý quay lại tăng cường nâng cao sâu hơn trên nền tảng kiến thức này.

Lập trình viên cấp cao rất rõ rằng kiến thức mình học năm đó chỉ là bề mặt. Ngoài giờ làm việc họ vẫn tìm hiểu sâu về cách triển khai tầng dưới của Linux, của mạng và các hướng khác.

Thực tế, những cao thủ công nghệ trong giới Internet phần lớn là nhờ hiểu biết rất sâu sắc về những kiến thức nền tảng này, sau khi có được nội công thâm hậu mới thúc đẩy họ trưởng thành thành cao thủ công nghệ.

Tôi rất khó tin một developer không hiểu tầng dưới, chỉ biết CURD, chỉ biết dùng framework của người khác lại có thể trưởng thành thành cao thủ theo hướng kỹ thuật trong tương lai.

Vì vậy, **còn khuyên bạn nên rèn luyện nhiều năng lực nội công kỹ thuật tầng dưới**. Nếu bạn không biết luyện thế nào, thì hãy kiên trì theo dõi công chúng hào「开发内功修炼」.

### Lời khuyên 4: Suy nghĩ về hiệu năng

Lập trình viên bình thường thường phát triển xong yêu cầu là không quan tâm nữa, chỉ cần yêu cầu được triển khai, test vượt qua là có thể bàn giao. Lưu lượng (traffic) tương lai sẽ lớn bao nhiêu, không nghĩ tới. Dịch vụ của mình có thể chịu được bao nhiêu QPS, cũng không rõ.

Còn lập trình viên cấp cao thường quan tâm đến hiệu năng của code mình viết ra.

Khi đánh giá yêu cầu, họ thường ước tính lưu lượng yêu cầu (request) khoảng bao nhiêu. Sau đó ở giai đoạn thiết kế sẽ dựa vào con số này để thiết kế phương án đáp ứng yêu cầu về hiệu năng.

Trước khi lên production cũng sẽ tiến hành kiểm thử áp lực hiệu năng (stress test), kiểm tra xem hiệu năng có đạt kỳ vọng không. Nếu hiệu năng có vấn đề, thì điểm nghẽn nằm ở đâu, làm thế nào để tối ưu được.

Vì vậy, **lời khuyên thứ tư là nhất định phải chủ động quan tâm thật nhiều đến hiệu năng của nghiệp vụ mình phụ trách, và thường xuyên tiến hành tối ưu và cải tiến**. Tôi nghĩ mức độ quan trọng của lời khuyên này là rất cao. Nhưng điều này cần bạn có nội công thâm hậu mới làm được, nếu không, ngay cả cách mạng hoạt động ra sao bạn cũng không rõ thì nói gì đến tối ưu!

### Lời khuyên 5: Coi trọng môi trường production

Lập trình viên bình thường thường rất ít quan tâm đến những chuyện trên môi trường production, các máy chủ ghi trong tay chỉ là máy phát triển (dev) và máy phát hành (release) của mình, production có mấy máy, lưu lượng bao nhiêu, gần đây có biến động hay không, những điều này có thể đều không rõ.

Còn lập trình viên cấp cao hiểu rất rõ rằng, nếu có điều kiện, họ sẽ cố gắng quan sát thật nhiều dịch vụ production của mình, xem code chạy thế nào, có error log gì không. Khi yêu cầu đạt đỉnh, mức tiêu thụ CPU, bộ nhớ ra sao. Tình trạng tiêu thụ cổng mạng thế nào, có cần điều chỉnh một số cấu hình tham số hay không.

Khi hiệu năng chưa được như ý, có thể sẽ quay lại suy nghĩ ra phương án cải thiện hiệu năng, phát triển lại và lên production.

Bạn sẽ phát hiện, khi production xảy ra sự cố, những người xông lên tuyến đầu dập lửa khẩn cấp đều là những lập trình viên cao cấp hơn một chút.

Vì vậy, **lời khuyên thứ năm mà 飞哥 đưa ra là hãy quan sát thật nhiều tình trạng vận hành của môi trường production**. Chỉ có quan tâm nhiều đến production, khi production gặp sự cố, bạn mới có thể gánh vác trọng trách nhanh chóng xử lý sự cố production.

### Lời khuyên 6: Quan tâm đến tổng thể

Lập trình viên bình thường là bạn giao cho tôi module nào thì tôi làm module đó, tự đặt ra một ranh giới rất nhỏ cho công việc của mình, toàn bộ tầm nhìn đều tập trung trong cái khung nhỏ đó.

Lập trình viên cấp cao thì toàn bộ module của dự án trong đội ngũ, dù không phải phần mình phụ trách, họ cũng sẽ tìm hiểu cho quen. Những đồng nghiệp có tư duy này dù về kỹ thuật hay về nghiệp vụ đều trưởng thành nhanh nhất. Những người được thăng cấp (level) hay được đề bạt chức vụ thường đều là những đồng nghiệp như vậy.

Thậm chí có những đồng nghiệp cấp cao hơn, tầm mắt còn không chỉ dừng trong đội ngũ, thậm chí còn quan tâm đến các đội ngũ khác trong công ty, thậm chí là nghiệp vụ và tech stack của cả ngành. Viết đến đây tôi nhớ đến câu 张一鸣 từng nói, đừng đặt ranh giới cho công việc của mình.

Vì vậy, **khuyên bạn nên có tầm nhìn tổng thể, không chỉ module mình phụ trách, mà toàn bộ dự án thực ra bạn đều nên quan tâm**. Chứ không phải đến cả việc đồng nghiệp trong nhóm mình đang làm gì cũng không biết.

### Lời khuyên 7: Năng lực tổng kết quy nạp

Lập trình viên bình thường thường làm xong việc là thôi, rất ít khi quay lại quy nạp và tổng kết về kỹ thuật và nghiệp vụ của mình.

Còn lập trình viên cấp cao thường sau khi hoàn thành một việc tương đối lớn sẽ tổng kết một chút, làm một bản PPT, viết blog gì đó để ghi lại. Như vậy vừa là quy nạp cho công việc của mình, vừa có thể chia sẻ cho các đồng nghiệp khác, thúc đẩy sự trưởng thành chung của đội ngũ.

<!-- @include: @article-footer.snippet.md -->