---
title: Bàn về cách chuẩn bị cho vòng kỹ thuật đầu tiên từ góc nhìn của người phỏng vấn và ứng viên
description: "Bàn về cách chuẩn bị cho vòng kỹ thuật đầu tiên từ góc nhìn của người phỏng vấn và ứng viên: hệ thống lại các khái niệm then chốt, câu hỏi thường gặp và điểm mấu chốt thực hành xoay quanh tri thức kỹ thuật và tổng kết phỏng vấn, giúp bạn học tập hiệu quả và sẵn sàng cho buổi phỏng vấn."
category: 技术文章精选集
author: 琴水玉
tag:
  - 面试
head:
  - - meta
    - name: keywords
      content: 技术面试准备,面试官视角,候选人视角,技术基础,业务考察,面试技巧,技术深度广度,面试方法论
---

> **Lời đề cử**: Bàn về kỹ thuật phỏng vấn từ cả góc nhìn của người phỏng vấn lẫn người được phỏng vấn! Rất đáng đọc!
>
> **Tổng quan nội dung:**
>
> - Chỉ thông qua đánh giá nền tảng kỹ thuật mới có thể kiểm tra được thực lực kỹ thuật thật sự của ứng viên: chiều sâu và chiều rộng kỹ thuật.
> - Kết hợp thực chiến và lý thuyết. Ví dụ, sau khi ứng viên trình bày về cấu trúc bố cục mô hình bộ nhớ JVM, có thể hỏi tiếp: những nguyên nhân nào có thể dẫn đến OOM, có những biện pháp phòng ngừa nào? Bạn đã từng gặp sự cố rò rỉ bộ nhớ (memory leak) chưa? Làm thế nào để truy tìm và giải quyết những vấn đề dạng này?
> - Số dự án được đánh giá trong phần kinh nghiệm dự án không nên quá hai. Bởi vì để đánh giá sâu chi tiết của một dự án, thời gian tiêu tốn là khá lớn. Thông thường, sẽ để ứng viên chọn ra một dự án mà anh ấy hoặc cô ấy cảm thấy thu hoạch được nhiều nhất / thách thức nhất / để lại ấn tượng sâu sắc nhất / tự thấy thú vị đặc biệt. Sau đó xoay quanh dự án này để đặt câu hỏi. Thường bắt đầu từ bối cảnh dự án, đánh giá tech stack của dự án, hiểu biết tổng thể về các module và tương tác (interaction) của dự án, những vấn đề kỹ thuật đầy thách thức và giải pháp gặp phải trong dự án, việc truy tìm và giải quyết vấn đề, vấn đề khả năng bảo trì code, đảm bảo chất lượng công trình, v.v.
> - Hỏi nhiều nói ít, để ứng viên thể hiện nhiều hơn. Dựa trên câu trả lời của ứng viên để dẫn dắt, đào sâu hoặc mở rộng ngang một cách thích hợp.
>
> **Địa chỉ bài viết gốc:** <https://www.cnblogs.com/lovesqcc/p/15169365.html>

## Mục tiêu và tư duy đánh giá

Trước tiên hãy làm rõ, mục tiêu đánh giá của vòng kỹ thuật đầu tiên:

- Nền tảng kỹ thuật của ứng viên;
- Tư duy và năng lực giải quyết vấn đề của ứng viên.

Nền tảng kỹ thuật là nền móng (phần nằm dưới mặt nước của tảng băng), chiếm bảy phần; tư duy và năng lực giải quyết vấn đề là phần hiện thực (phần nhô lên trên mặt nước của tảng băng), chiếm ba phần. Đánh giá nghiệp vụ và nền tảng kỹ thuật theo tỷ lệ bảy-ba.

## Đánh giá nền tảng kỹ thuật

### Vì sao phải đánh giá nền tảng kỹ thuật?

Hai loại tư duy kỹ thuật quan trọng nhất của lập trình viên là tư duy logic và tư duy thiết kế trừu tượng. Tư duy logic là nền tảng, tư duy thiết kế trừu tượng là cấp độ cao hơn. Đánh giá nền tảng kỹ thuật vừa vặn có thể đồng thời kiểm tra được hai loại tư duy này. Việc có hiểu được các khái niệm kỹ thuật cơ bản và mối liên hệ giữa chúng hay không là kiểm tra tư duy logic; việc có thể trừu tượng hóa bài toán nghiệp vụ thành bài toán kỹ thuật và tổ chức ánh xạ một cách hợp lý hay không là kiểm tra tư duy thiết kế trừu tượng.

Phần lớn các bài toán nghiệp vụ đều có thể trừu tượng hóa thành bài toán kỹ thuật. Theo một nghĩa nào đó, bài toán nghiệp vụ chỉ là cách diễn đạt bài toán kỹ thuật theo lĩnh vực (domain) cụ thể.

Vì vậy, **chỉ thông qua đánh giá nền tảng kỹ thuật mới có thể kiểm tra được thực lực kỹ thuật thật sự của ứng viên: chiều sâu và chiều rộng kỹ thuật.**

### Nền tảng kỹ thuật được đánh giá như thế nào?

Nền tảng kỹ thuật được đánh giá như thế nào? Thông qua mô hình hỏi đáp hiệu quả từ nhiều góc độ.

#### Là gì - Tại sao

"Là gì" kiểm tra hiểu biết cơ bản về khái niệm, "tại sao" kiểm tra nguyên lý triển khai của khái niệm.

Ví dụ: Chỉ mục (index) là gì? Chỉ mục được triển khai như thế nào?

#### Dẫn dắt - Hỏi ngang - Hỏi sâu

Tính dẫn dắt, ví dụ thử dò với câu hỏi "Bạn có quen thuộc với các công cụ đồng bộ (synchronization) của Java không?", sau khi nhận được câu trả lời khẳng định, có thể hỏi tiếp: "Bạn quen thuộc những lớp công cụ đồng bộ nào?", để đánh giá chiều rộng của ứng viên;

Sau khi nhận được câu trả lời của ứng viên, có thể hỏi tiếp: "Hãy trình bày nguyên lý triển khai của `ConcurrentHashMap` hoặc `AQS`?"

Một người trình bày nguyên lý kỹ thuật rõ ràng đến mức nào, bao gồm cả tư duy và chi tiết, thể hiện khả năng nắm vững kỹ thuật của người đó mạnh đến đâu.

#### Hỏi nhảy cóc / Hỏi chéo

Ví dụ: khi nói đến tra cứu hiệu quả bằng băm (hash), có thể bàn về thuật toán băm nhất quán (consistent hashing). Hai thứ vừa có liên quan vừa có nhiều điểm khác biệt. Đây cũng là một cách đánh giá chiều rộng kỹ thuật.

#### Hỏi tổng kết

Ví dụ: Trong quá trình làm XXX, bạn rút ra được những kinh nghiệm nào có thể chia sẻ? Điều này kiểm tra khả năng khái quát, tổng kết của ứng viên.

#### Kết hợp thực chiến và lý thuyết

Ví dụ, sau khi ứng viên trình bày về cấu trúc bố cục mô hình bộ nhớ JVM, có thể hỏi tiếp: những nguyên nhân nào có thể dẫn đến OOM, có những biện pháp phòng ngừa nào? Bạn đã từng gặp sự cố rò rỉ bộ nhớ chưa? Làm thế nào để truy tìm và giải quyết những vấn đề dạng này?

Ví dụ, nếu ứng viên có nhắc đến tối ưu SQL và tối ưu chỉ mục, thì đó là dịp tốt để trao đổi về nguyên lý triển khai chỉ mục, làm thế nào để xây dựng chỉ mục tối ưu nhất?

Một ví dụ khác, nếu ứng viên có nhắc đến giao dịch (transaction), thì hãy nhân dịp đó trao đổi về nguyên lý triển khai giao dịch, mức cô lập (isolation level), cách triển khai snapshot, v.v.;

#### Kết hợp phần quen thuộc và chưa quen thuộc

Hỏi cả những phần ứng viên ghi là quen thuộc trên CV lẫn những phần không ghi. Ví dụ nếu CV của ứng viên ghi: quen thuộc mô hình bộ nhớ JVM, thì tôi sẽ kiểm tra phần quản lý bộ nhớ (phần quen thuộc), rồi kiểm tra thêm các lớp công cụ đồng bộ của Java (phần chưa chắc ứng viên có quen thuộc hay không).

#### Kết hợp kiến thức chết và kiến thức sống

Ví dụ, có những thuật toán tìm kiếm nào? Tìm kiếm tuần tự, tìm kiếm nhị phân, tìm kiếm băm. Những điều này người ta thường có thể nói ra, và đó cũng là "kiến thức chết".

Từng thuật toán tìm kiếm này phù hợp với những tình huống nào? Trong công việc của bạn, có những tình huống nào đã dùng thuật toán tìm kiếm nào? Vì sao? Những điều này mới là "kiến thức sống".

#### Vấn đề gặp phải khi học tập hoặc làm việc

Đôi khi, những vấn đề gặp phải trong học tập và công việc cũng có thể dùng làm câu hỏi phỏng vấn.

Ví dụ, gần đây tôi đang học phần đồng thời (concurrency) trong sách 《Nhập môn Hệ điều hành》 (Operating Systems: Three Easy Pieces), có một chương về cách làm cho cấu trúc dữ liệu trở nên an toàn cho luồng (thread-safe). Ở đây có một số điều có thể đặt câu hỏi: làm thế nào để triển khai một khóa (lock)? Làm thế nào để triển khai một bộ đếm an toàn cho luồng? Làm thế nào để triển khai một danh sách liên kết an toàn cho luồng? Làm thế nào để triển khai một `Map` an toàn cho luồng? Làm thế nào để nâng cao hiệu năng đồng thời?

Những vấn đề gặp phải trong công việc cũng có thể được trừu tượng hóa, chắt lọc thành câu hỏi phỏng vấn nền tảng kỹ thuật.

#### Hỏi về mức độ phù hợp với tech stack

Nếu một số công nghệ mà ứng viên sử dụng (như ghi trên CV) khá tương đồng với tech stack của công ty, thì có thể đặt câu hỏi chuyên sâu về những điểm kỹ thuật này, để kiểm tra mức độ nắm vững của ứng viên tại các điểm kỹ thuật đó. Nếu mức độ nắm vững tốt thì mức độ phù hợp kỹ thuật tương đối cao hơn.

Tất nhiên, điều này không thể được dùng làm căn cứ để loại những ứng viên không sử dụng tech stack đó. Ví dụ công ty chúng tôi dùng `MongoDB` và `MySQL`, còn một ứng viên chưa từng dùng `Mongodb，` nhưng đã sử dụng nhiều hệ thống lưu trữ như `MySQL`, `Redis`, `ES`, `HBase`, thì mức độ phù hợp không hề kém cạnh ứng viên chỉ mới dùng `MySQL` và `MongoDB`, bởi vì chiều rộng kỹ thuật mà anh ta tiếp xúc lớn hơn, có thể suy ra anh ta có đủ năng lực để nắm vững `Mongodb`.

#### Xây dựng bộ câu hỏi phỏng vấn mang đặc trưng riêng

Mỗi người phỏng vấn kỹ thuật đều có một bộ câu hỏi phỏng vấn. Hãy không ngừng tích lũy bộ câu hỏi, những câu hỏi chợt nghĩ ra trong cuộc sống hằng ngày thì tiện tay ghi lại.

## Đánh giá khía cạnh nghiệp vụ

### Vì sao phải đánh giá khía cạnh nghiệp vụ?

Điểm dễ bị bỏ sót khi đánh giá nền tảng kỹ thuật là những phẩm chất năng lực phi kỹ thuật của ứng viên, chẳng hạn như năng lực giao tiếp và tổ chức, năng lực dẫn dắt dự án, năng lực chịu áp lực, năng lực giải quyết vấn đề thực tế, mức độ ảnh hưởng trong đội nhóm, cùng các đặc điểm tính cách khác.

### Vì sao không thể chỉ đánh giá khía cạnh nghiệp vụ?

Bởi vì khía cạnh nghiệp vụ thường khá quen thuộc, ứng viên có thể trực tiếp trình bày theo giải pháp hiện có, nên rất khó kiểm tra được năng lực hiểu sâu, mở rộng ngang và khái quát tổng kết của ứng viên.

Về điểm này, nên có mục tiêu kiểm tra khả năng khái quát tổng kết của ứng viên: ví dụ, trong quá trình xây dựng, phát triển hay duy trì microservices / đảm bảo tính ổn định hoặc hiệu năng của hệ thống, bạn rút ra được những kinh nghiệm nào có thể chia sẻ?

## Đánh giá năng lực giải quyết vấn đề

Chỉ có nền tảng kỹ thuật thôi là chưa đủ, thông thường tốt nhất nên kết hợp với nghiệp vụ thực tế, dựa trên nghiệp vụ trong dự án của ứng viên để trừu tượng hóa thành bài toán kỹ thuật mà đánh giá.

Tư duy giải quyết vấn đề chú trọng ở việc tiến dần theo từng lớp. Điều này đặt ra yêu cầu khá cao cho người phỏng vấn, đòi hỏi đồng thời có khả năng lắng nghe tốt, chiều sâu kỹ thuật và kinh nghiệm nghiệp vụ. Trước tiên phải chăm chú lắng nghe phần trình bày của ứng viên, tìm ra điểm vào kỹ thuật thích hợp, rồi mới đặt câu hỏi. Nếu không vào được vấn đề thì việc đánh giá dễ thất bại.

### Bài toán thiết kế

- Ví dụ, nhiều máy cùng chia sẻ một lượng lớn đối tượng nghiệp vụ, giữa các đối tượng nghiệp vụ này có một số trường tổ hợp (combined field) bị trùng lặp, làm thế nào để loại bỏ trùng lặp?
- Nếu một lượng lớn yêu cầu ồ ạt đổ vào trong tức thời, làm thế nào để đảm bảo sự ổn định của máy chủ?

### Kinh nghiệm dự án

Số dự án được đánh giá không nên quá hai. Bởi vì để đánh giá sâu chi tiết của một dự án, thời gian tiêu tốn là khá lớn.

Thông thường, sẽ để ứng viên chọn ra một dự án mà anh ấy hoặc cô ấy cảm thấy thu hoạch được nhiều nhất / thách thức nhất / để lại ấn tượng sâu sắc nhất / tự thấy thú vị đặc biệt. Sau đó xoay quanh dự án này để đặt câu hỏi. Thường bắt đầu từ bối cảnh dự án, đánh giá tech stack của dự án, hiểu biết tổng thể về các module và tương tác (interaction) của dự án, những vấn đề kỹ thuật đầy thách thức và giải pháp gặp phải trong dự án, việc truy tìm và giải quyết vấn đề, vấn đề khả năng bảo trì code, đảm bảo chất lượng công trình, v.v.

## Người phỏng vấn làm thế nào để có một buổi phỏng vấn tốt?

### Chuẩn bị trước

Người phỏng vấn cũng cần chuẩn bị một số điều. Ví dụ nắm rõ thế mạnh kỹ năng, kinh nghiệm làm việc của ứng viên, v.v., rồi thiết kế kế hoạch phỏng vấn.

Trước khi buổi phỏng vấn bắt đầu, hãy chuẩn bị đầy đủ. Ngoài ra, người phỏng vấn cũng cần nắm được một số thông tin cơ bản về công ty, đặc biệt là tech stack công ty sử dụng, bức tranh toàn cảnh và định hướng nghiệp vụ, nội dung công việc, chế độ thăng tiến, v.v., bởi những ứng viên thiên về kỹ thuật thường hỏi khá nhiều về các điều này.

### Khởi động buổi phỏng vấn

Thông thường buổi phỏng vấn bắt đầu bằng phần tự giới thiệu của ứng viên, nhưng ứng viên thường trình bày khá lan man, vì vậy tôi sẽ hỏi thẳng: hãy chia sẻ về những thế mạnh của bạn cũng như những điểm bạn tự thấy có thể cải thiện?

Sau đó bắt đầu phần hỏi kỹ thuật bằng một câu hỏi nền tảng tương đối đơn giản: bạn quen thuộc những thuật toán tìm kiếm nào? Phần lớn mọi người có thể trả lời được tìm kiếm tuần tự, tìm kiếm nhị phân, tìm kiếm băm.

### Thiết kế câu hỏi

Đọc trước CV của ứng viên, lọc ra các từ khóa từ CV, và dựa trên những từ khóa đó để thiết kế câu hỏi có mục tiêu.

Ví dụ nếu CV của ứng viên có nhắc đến `MVVM`, có thể hỏi về sự khác biệt giữa `MVVM` và `MVC`; nếu nhắc đến mẫu thiết kế Observer, có thể trao đổi về mẫu Observer, và tiện thể hỏi xem anh ta còn quen thuộc những mẫu thiết kế nào khác.

### Không khí thoải mái

Dù câu hỏi có nhiều và khó đến đâu, cũng cần chú ý duy trì một bầu không khí thoải mái.

Trước buổi phỏng vấn, có thể đùa giỡn một cách thích hợp dựa trên thông tin cơ bản của ứng viên, ví dụ một ứng viên tên là 汪奎, thì tôi sẽ nói: trước đây đội chúng tôi có một người tên 袁奎, chúng tôi đều gọi anh ấy là 奎爷.

Trong quá trình phỏng vấn, gợi ý một cách thích hợp, hoặc đưa ra một chút quan điểm của bản thân, cũng có thể làm giảm bớt sự căng thẳng của ứng viên.

### Học cách lắng nghe

Hỏi nhiều nói ít, để ứng viên thể hiện nhiều hơn. Dựa trên câu trả lời của ứng viên để dẫn dắt, đào sâu hoặc mở rộng ngang một cách thích hợp.

Dẫn dắt ứng viên thể hiện mặt mạnh nhất của mình, để anh ấy hoặc cô ấy cảm thấy dễ chịu hơn: dù sao một buổi phỏng vấn cả hai bên đều bỏ ra thời gian và công sức, không nên là nơi để người phỏng vấn chê bai (Diss) ứng viên, mà nên để hai bên có sự trao đổi tốt hơn. Rất có thể bạn cũng sẽ học được không ít điều từ ứng viên.

Việc phỏng vấn, chỉ là vai trò và lập trường của hai bên khác nhau, chứ không có nghĩa là trình độ của người phỏng vấn nhất định cao hơn ứng viên.

### Ghi chép trọng điểm

Ghi chép câu trả lời của ứng viên một cách nghiêm túc và khách quan, tránh tối đa mọi đánh giá chủ quan, cũng không thêm thắt bất kỳ điều gì (ví dụ tự mình tổng kết giúp — bởi khả năng tổng kết cũng là một đặc điểm của ứng viên).

## Đưa ra phán đoán

Quá trình phỏng vấn là phần đệm để chuẩn bị, điều quan trọng là đưa ra phán đoán.

Điều dễ rơi vào ngộ nhận nhất khi đưa ra phán đoán chính là: tham lam chiều sâu lại muốn sự toàn diện. Luôn hy vọng ứng viên có kỹ thuật vừa sâu vừa toàn diện. Thực ra, đây là một điều xa xỉ. Nếu năng lực kỹ thuật của ứng viên vừa sâu vừa toàn diện, rất có thể cũng sẽ phải đối mặt với hai tình huống:

1. Ứng viên có lựa chọn tốt hơn;
2. Ứng viên có thể tồn tại những điểm hạn chế ở các khía cạnh khác, chẳng hạn như hợp tác đội nhóm.

Một thước đo tương đối hợp lý là:

1. Trình độ kỹ thuật của anh ấy hoặc cô ấy có đủ đảm nhiệm công việc hiện tại hay không;
2. Trình độ kỹ thuật của anh ấy hoặc cô ấy so với các thành viên trong cùng đội như thế nào;
3. Trình độ kỹ thuật của anh ấy hoặc cô ấy có tương đối phù hợp với số năm kinh nghiệm hay không, và có tiềm năng đảm nhiệm những nhiệm vụ phức tạp hơn hay không.

**Đối với ứng viên có số năm kinh nghiệm khác nhau, điều được coi trọng là khác nhau.**

Đối với kỹ sư dưới ba năm kinh nghiệm, nên coi trọng hơn nền tảng kỹ thuật của họ, bởi vì điều đó thể hiện tiềm năng tương lai của họ; đồng thời cũng kiểm tra sự thể hiện của họ trong phát triển thực tế, chẳng hạn như hợp tác đội nhóm, kinh nghiệm nghiệp vụ, năng lực chịu áp lực, nhiệt huyết và năng lực chủ động học hỏi, v.v.

Đối với kỹ sư trên ba năm kinh nghiệm, nên coi trọng hơn kinh nghiệm nghiệp vụ và năng lực giải quyết vấn đề của họ, xem anh ấy hoặc cô ấy phân tích vấn đề cụ thể như thế nào, và đánh giá chiều sâu lẫn chiều rộng nền tảng kỹ thuật của họ trong phạm vi nghiệp vụ.

Làm thế nào để phán đoán trình độ kỹ thuật thật sự của một ứng viên và liệu họ có phù hợp với những gì cần tuyển không — về khía cạnh này, tôi cũng đang trên con đường học hỏi.

## Lời nhắn dành cho ứng viên

### Chú trọng nền tảng kỹ thuật

Một thắc mắc thường gặp là: hầu hết thời gian phát triển hệ thống nghiệp vụ thường không liên quan đến việc thiết kế và triển khai cấu trúc dữ liệu và thuật toán, vậy tại sao phải đánh giá nguyên lý triển khai của `HashMap`? Vì sao phải học tốt các môn nền tảng như cấu trúc dữ liệu và thuật toán, hệ điều hành, giao tiếp mạng?

Giờ tôi có thể đưa ra một câu trả lời:

- Như đã trình bày ở trên, phần lớn các bài toán nghiệp vụ thực chất cuối cùng đều sẽ được ánh xạ về các vấn đề kỹ thuật nền tảng: triển khai cấu trúc dữ liệu và thuật toán, quản lý bộ nhớ, kiểm soát đồng thời, giao tiếp mạng, v.v.; những điều này chính là nền móng để hiểu các chương trình quy mô lớn của internet hiện đại cũng như giải quyết các vấn đề phức tạp khó chữa của chương trình — trừ khi bạn tự chúc phúc cho mình rằng sẽ mãi mãi không bao giờ gặp vấn đề khó, mãi mãi chỉ thỏa mãn với việc viết CRUD;
- Chính những nền tảng kỹ thuật này là nơi thú vị và gay cấn nhất trong thế giới lập trình. Nếu không hứng thú với những điều này, sẽ rất khó để đi sâu vào lĩnh vực này, chi bằng sớm chuyển ngành làm nghề khác — thế giới phi kỹ thuật luôn rực rỡ và rộng lớn (đôi khi tôi cũng muốn ra ngoài đi nhiều chút, không muốn chỉ bó hẹp trong thế giới kỹ thuật);
- Nền tảng kỹ thuật là nội công của lập trình viên, còn những công nghệ cụ thể là chiêu thức. Chỉ có chiêu thức mà nội công không sâu, khi gặp cao thủ (sự cạnh tranh của những người cùng ngành giỏi và những vấn đề phức tạp khó chữa) thì dễ bị đánh bại chỉ trong một đòn;
- Có nền tảng kỹ thuật chuyên môn vững chắc, giới hạn trên đạt được sẽ cao hơn, tương lai càng có khả năng đảm nhiệm việc giải quyết các bài toán kỹ thuật phức tạp, hoặc trên cùng một vấn đề có thể đưa ra giải pháp tốt hơn;
- Con người thích hợp tác với những người giống mình, người giỏi (牛人) có xu hướng hợp tác với người giỏi để đạt được hiệu quả tốt hơn; nếu phần lớn người trong một đội có nền tảng kỹ thuật tốt, thì khi có một người nền tảng kỹ thuật khá yếu bước vào, chi phí hợp tác sẽ tăng lên; nếu bạn muốn hợp tác với người giỏi để đạt được kết quả tốt hơn, thì ít nhất bản thân cũng phải đủ sức sánh ngang với người giỏi về nền tảng kỹ thuật;
- Phát triển thêm những tài năng khác trên nền tảng CRUD cũng không phải là một lựa chọn tồi, nhưng đó không phải là tư thế của một lập trình viên thực thụ, nhiều nhất cũng chỉ là nhân tài của các vị trí khác như product manager, project manager, HR, vận hành, chăm sóc khách hàng (客满)... có nền tảng kỹ thuật. Đây là vấn đề lựa chọn nghề nghiệp, đã vượt ra ngoài phạm vi đánh giá một lập trình viên.

### Đừng bận tâm nếu có câu trả lời không được

Nếu người phỏng vấn hỏi bạn rất nhiều câu, mà có vài câu bạn không trả lời được, đừng bận tâm. Người phỏng vấn rất có thể chỉ đang kiểm tra chiều sâu và chiều rộng kỹ thuật của bạn, rồi phán đoán xem bạn đã đạt đến mức nước (waterline) nào.

Điểm mấu chốt là: một số câu hỏi bạn trả lời rất sâu sắc, đã thể hiện được năng lực tư duy sâu của bạn.

Đây là điều tôi chỉ lĩnh hội được sau khi trở thành người phỏng vấn kỹ thuật. Tất nhiên, không phải người phỏng vấn kỹ thuật nào cũng nghĩ như vậy, nhưng tôi cho rằng đây nên là một cách phù hợp hơn.

<!-- @include: @article-footer.snippet.md -->