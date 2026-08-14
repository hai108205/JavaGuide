---
title: Kinh nghiệm cá nhân vào Feishu qua kỳ tuyển dụng sinh viên mới (校招)
description: "Kinh nghiệm cá nhân vào Feishu qua kỳ tuyển dụng sinh viên mới: sắp xếp các khái niệm then chốt, câu hỏi thường gặp và điểm mấu chốt thực hành xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, giúp bạn học tập hiệu quả và chuẩn bị cho phỏng vấn."
category: 技术文章精选集
author: 月色真美
tag:
  - 面试
head:
  - - meta
    - name: keywords
      content: 字节跳动面试,飞书校招,C++面试,春招实习,日常实习,暑期实习,面试技巧,算法刷题
---

> **Lời giới thiệu**: Tác giả của bài viết này cuối cùng đã vào Feishu làm phát triển qua kỳ tuyển dụng sinh viên mới. Trong bài viết này, anh ấy chia sẻ trải nghiệm tuyển dụng sinh viên mới cũng như kinh nghiệm cá nhân của mình.
>
> **Địa chỉ bài gốc**: <https://www.ihewro.com/archives/1217/>

## Tình hình cơ bản

Tôi chủ yếu theo hướng phát triển backend với C++.

Kỳ tuyển dụng sinh viên mới mùa xuân (春招) năm 2021, tôi vào làm client tại Feishu của ByteDance. Trước khi vào ByteDance, tôi đã nhận được offer của Baidu (mảng phát trực tiếp âm thanh - video) và đã vượt qua vòng phỏng vấn HR của Tencent PCG (Weishi, phát triển backend) (nhưng chưa nhận được thư dự định tuyển dụng).

## Quá trình 春招 không mấy suôn sẻ

### Kỳ thực tập 春招 với tôi không mấy suôn sẻ

Đúng ngày Tết Dương lịch tháng 1, phòng thí nghiệm chính thức cho phép nghỉ Tết về nhà, nhưng về nhà vẫn tiếp tục "làm việc từ xa", công việc không hề giảm bớt, ngày qua ngày vẫn test, debug "hệ thống hội nghị truyền phát media" (streaming media conference system) mà chúng tôi phát triển.

Vào ngày thứ 3 tính từ cuối tháng 1, chúng tôi tổ chức cuộc họp trực tuyến "tổng kết cuối năm". Từ đó, với tư cách là học viên cao học năm 2, về cơ bản tôi bắt đầu chia tay công việc ở phòng thí nghiệm và chính thức bước vào giai đoạn ôn luyện cho 春招.

Trước tháng 2 tôi đã bắt đầu chuẩn bị lúc có lúc không, chẳng qua là lên LeetCode làm vài bài, một ngày cũng chẳng làm được mấy bài, về sau thậm chí chỉ làm một cách tượng trưng bài "mỗi ngày một bài" (daily one question). Điều này chẳng giúp ích gì nhiều cho việc luyện giải thuật (algorithm) của tôi.

Bước sang tháng 2, đầu tháng 2 tôi mới chỉ làm được khoảng hơn 40 bài trên LeetCode. Tôi lại vắt ra vài tuần để cập nhật phiên bản 8.x cho theme handsome, thêm một khoảng mấy tuần bận rộn nữa. Mãi đến đúng ngày Tết Nguyên đán mới chính thức phát hành, sau Tết lại bắt đầu dành thời gian sửa bug lác đác và phát hành phiên bản sửa lỗi. Tháng 2 cứ thế trôi đi lặng lẽ.

### Quá trình tìm thực tập

**Đầu tháng 3 năm 2021**

Đầu tháng 3, tôi nộp hồ sơ đợt tuyển sớm (提前批) của Alibaba, không ngờ đợt tuyển sớm của Alibaba kết thúc vào ngày 4/3, và cuộc phỏng vấn vòng 1 qua điện thoại được hẹn hôm đó cũng bị hủy. Ngay sau đó khi khai giảng, họp lab để đồng bộ tiến độ, tôi phát hiện mọi người đều đã ở vòng 1/vòng 2/vòng 3, còn tôi thì vẫn chưa có tiến độ nộp hồ sơ gì.

**2021-3-8**

Nộp hồ sơ vào Feishu của ByteDance

**Đầu tháng 4 năm 2021**

Vòng 1 lần thứ nhất của ByteDance, vòng 1 lần thứ nhất của Tencent

**Giữa tháng 4 năm 2021**

Vòng 1 và vòng 2 của Meituan, vòng 1 lần 2 và vòng 2 lần 2 của Tencent, ba vòng phỏng vấn của Baidu, và đã vượt qua.

**Cuối tháng 4 năm 2021**

Vòng 1 lần 3 của Tencent và vòng 1 lần 2 của ByteDance

**Đầu tháng 5 năm 2021**

Vòng 2 lần 3 của Tencent và vòng 2 lần 2 của ByteDance, sau đó cả hai đều vượt qua.

#### Alibaba

Lần đầu tôi nộp vào DingTalk (钉钉), không ngờ vì bài trắc nghiệm năng lực (行测) làm không tốt nên đã bị từ chối ngay ở khâu lọc hồ sơ.

Lần thứ hai là phỏng vấn backend của Alimama (阿里妈妈). Vòng 1 là phỏng vấn qua điện thoại, tôi cảm thấy phỏng vấn khá ổn, cuối cùng cũng làm được bài. Đến giai đoạn hỏi ngược lại (reverse question), tôi hỏi người phỏng vấn có lời khuyên gì cho buổi phỏng vấn của tôi, người phỏng vấn nói nộp Alibaba thì tốt nhất nên dùng Java... Sau đó vừa kết thúc cuộc gọi thì tôi bị từ chối...

Lúc đó tâm lý tôi thực sự hơi suy sụp. Cuộc phỏng vấn lúc 7 giờ rưỡi tối hôm đó, tôi cứ đọc sách mãi đến tối mà không ăn gì...

Vì vậy kỳ 春招 này tôi không có duyên với Alibaba.

#### Meituan

Người phỏng vấn vòng 1 của Meituan thực sự rất tốt bụng, không khí cũng rất thoải mái. Vì đây là vị trí Java nên họ cũng không hỏi kiến thức C++, chỉ trò chuyện một số kiến thức cơ bản, nửa tiếng cuối thì nói chuyện các vấn đề phi kỹ thuật, ví dụ như lập trình viên nào trên mạng bạn thích nhất, làm thế nào để viết code thanh lịch, giới thiệu sách kỹ thuật... Lúc đó tôi trả lời là thích lập trình viên Wang Yin (王垠), người phỏng vấn cười bảo anh ấy cũng rất thích. Không khí phỏng vấn cảm giác rất tốt.

Vòng 2 thì cả buổi chỉ hỏi về một dự án trên CV, hỏi khoảng 90 phút. Tôi cảm giác ngay từ đầu anh ấy đã có vẻ không mấy muốn tuyển tôi, nguyên nhân lớn nhất tôi nghĩ là vì tôi là C++, chuyển sang Java có thể tốn một chút chi phí. Cuối cùng hỏi HR thì được trả lời kết quả đang chờ xác định, vài ngày sau được thông báo bị từ chối.

#### Baidu

Baidu tổng cộng ba vòng phỏng vấn, tất cả diễn ra trong một buổi chiều, thực sự rất kịch tính. Vòng 1 chỉ là một số câu hỏi C++ cơ bản, có một bài phải viết ra và trình bày ý tưởng nhưng không cho chạy (nếu thực sự cho chạy thì chưa chắc đã chạy được :)).

Vòng 2 cũng là kiến thức cơ bản. Bài đầu tiên là trộn hai mảng đã sắp xếp (merge two sorted arrays), bài thứ hai là viết merge sort, kết quả viết ra không đúng nên lại đổi cho tôi một bài khác, là BFS trên cây. Cuối buổi người phỏng vấn vòng 2 hỏi tôi thấy buổi phỏng vấn hôm nay thế nào, tôi nói dù giữa chừng có một bài kết quả không đúng, nhưng ý tưởng thì đúng, có thể một chỗ nhỏ nào đó viết có vấn đề, nhưng nhìn chung thì chắc là ổn. Thế là vòng 2 cho tôi vượt qua.

Vòng 3 hỏi khá ít câu hỏi kỹ thuật, chỉ hơn 30 phút, cũng không phải viết bài, chỉ hỏi một số tình hình cơ bản và kiến thức nền tảng. Cuối cùng tôi hỏi bộ phận làm những nội dung gì. Người phỏng vấn nói sau này HR sẽ liên hệ báo cho tôi biết nội dung.

#### Feishu của ByteDance

Lần đầu vòng 1 đã trượt ngay, nguyên nhân chắc là kết quả bài thi viết không đúng...

Vòng 1 lần 2 là cuối tháng 4, khá suôn sẻ. Vòng 2 diễn ra sau ngày Quốc tế Lao động 1/5, người phỏng vấn còn nhờ chị khóa trên nhắn tôi nên xem kỹ hơn về smart pointer (智能指针), lúc phỏng vấn bảo tôi tự tay viết shared_ptr. Trước đó tôi có xem một số phần triển khai nhưng chưa từng tự viết, nên code suy xét không đầy đủ, leader cứ liên tục nhắc tôi nên sửa chỗ này chỗ kia.

Tôi vốn tưởng trượt rồi, đến giữa tháng 5 đã chuẩn bị vào Baidu làm việc, ai ngờ được thông báo là đã vượt qua, thế là quyết định vào ByteDance.

#### Cảm nhận

Trong rất nhiều buổi phỏng vấn này, điều khiến tôi ngộ ra sâu sắc nhất là các bài khảo sát trong phỏng vấn thực sự rất quan trọng. Vì kiến thức nền tảng của tôi cũng không nổi bật, cộng thêm nếu bài thuật toán (thường là 1-2 bài) không làm được thì về cơ bản là trượt. Còn bài thi viết trước phỏng vấn thì ngược lại không quan trọng bằng, cũng không khó lắm. Về cơ bản trong 4 bài viết được 1-2 bài là đã có cơ hội được phỏng vấn. Độ khó cũng chỉ tầm những thuật toán trong Top 100 của LeetCode.

Trong lúc làm bài khi phỏng vấn, tôi rất dễ căng thẳng, đầu óc dễ trở nên trống rỗng. Chỉ cần sơ sẩy một chút, viết sai một ký hiệu, hoặc gán nhầm giá trị trong linked list, thì rất khó nhận ra vấn đề, dẫn đến kết quả cuối cùng sai.

## Vào thực tập tại ByteDance

Trước khi vào ByteDance, tôi vốn nghĩ vị trí này có lẽ là vị trí phù hợp với tôi nhất trong các buổi phỏng vấn, vì tôi chuyên về C++, mà Feishu dùng C++ chắc cũng khá sâu. Nhưng sau khi đến thì tôi cảm thấy có lẽ mình không thích lắm việc làm liên quan đến client, cảm giác phức tạp quá... Có lẽ phía server sẽ tốt hơn, nhưng hiện tại tôi vẫn chưa thể xác định.

Phúc lợi thực tập của ByteDance có thể coi là khá tốt trong số các công ty này. Vấn đề nhỏ là chỗ làm hơi hẹp, và cường độ công việc thì lớn hơn các công ty internet khác một chút. Căn tin của ByteDance miễn phí và khá ngon. ByteDance có rất nhiều tòa nhà văn phòng, nơi tôi làm việc thì khá nhỏ.

Hiện tại tôi cần thả lỏng, code trong repo cứ từ từ xem thôi, mentor cũng bảo tôi không cần vội, có vấn đề thì cứ hỏi nhiều, đừng giữ trong lòng rồi lãng phí thời gian. Sau khi nhận được offer chuyển chính thức (转正), ở kỳ tuyển dụng mùa thu (秋招) tôi vẫn muốn thử thêm các công ty nước ngoài hoặc doanh nghiệp nhà nước. Công việc cường độ quá lớn hiện tại tôi khó mà thích nghi được.

Hy vọng sau một thời gian nữa có thể chia sẻ cảm nhận của mình, và có thể thích nghi hơn với nội dung công việc hiện tại.

## Chia sẻ kinh nghiệm tìm việc

### Một số khái niệm

#### Sự khác biệt giữa thực tập thường ngày và thực tập chính thức (mùa hè) là gì?

- **Nếu một team thực tập thường ngày (日常实习) đang thiếu người, thì rất có thể cả năm đều tuyển intern, và sẽ có cơ hội thực tập thường ngày**, chỉ cần là sinh viên đang đi học đều có thể đi phỏng vấn. Còn thời gian bắt đầu của thực tập chính thức có một khoảng khá cố định, ví dụ từ tháng 3-6 hằng năm, tức là thực tập mùa hè (暑期实习).
- Thực tập thường ngày tương đối dễ vào hơn, nhưng có một số suất thực tập thường ngày không có chỉ tiêu chuyển chính thức, điều này cần xác nhận trước.
- **Thực tập thường ngày và thực tập chính thức của ByteDance không có gì khác nhau về chuyển chính thức, đều cùng nhau xin chuyển chính thức.**

#### Khi nào có thể đi thực tập sau khi nhận được offer thực tập chính thức?

Sau khi nhận được offer thực tập mùa hè thì**có thể thực tập ngay lập tức** (thông thường cần làm thủ tục khoảng 1 tuần), **cũng có thể chọn đi thực tập muộn hơn một chút**, thời gian có thể tự mình nắm bắt. Có công ty cho phép chọn thời gian thực tập trên hệ thống, có công ty thì chỉ cần trao đổi trực tiếp với HR là được.

#### Sự khác biệt giữa đợt tuyển sớm (提前批) và đợt tuyển chính thức

Lấy việc tìm thực tập làm ví dụ:

- Trước tiên là đợt tuyển sớm, sau đó là đợt chính thức. Đợt tuyển sớm thường là team trực tiếp tuyển người, **không vào hệ thống**, **không có bài thi viết**, **quy trình tương đối nhanh**, thông thường qua vòng 1 thì rất nhanh sẽ đến vòng 2.
- Phỏng vấn đợt chính thức đều có đánh giá buổi phỏng vấn (面评), nếu đánh giá của lần phỏng vấn thất bại trước đó sẽ ảnh hưởng đến lần phỏng vấn sau, nên tốt nhất vẫn nên cẩn thận một chút.

#### Sự khác biệt giữa offer thực tập và offer chính thức

Nói một cách đơn giản, offer thực tập chỉ trao cho bạn một cơ hội thực tập, nếu trong thời gian thực tập làm tốt thì có thể chuyển chính thức và nhận được offer chính thức.

Ký offer chính thức không có nghĩa là phải lập tức đi làm, vì chúng ta là ứng viên tuyển dụng sinh viên mới (校招). Sau khi nhận offer chính thức, có thể tiếp tục thực tập (lương sẽ là một phần trăm so với lương chính thức), cũng có thể xin nghỉ một thời gian, chờ đến khi thực sự tốt nghiệp rồi mới đi làm chính thức.

### Mốc thời gian

> Hãy làm CV càng sớm càng tốt, tốt nhất là trong khoảng thời gian gần đây, vì mọi người hiện vẫn còn khá quen thuộc với dự án ở phòng thí nghiệm, bây giờ viết cũng không khó lắm, còn vài tháng nữa mới viết CV thì sẽ khá đau khổ.

Lấy năm ngoái làm ví dụ:

- Giữa tháng 2, đợt tuyển sớm của Alibaba bắt đầu (về cơ bản chỉ có Alibaba mở đợt tuyển sớm vào thời điểm này), ngày 8/3 đợt tuyển sớm của Alibaba kết thúc. Đợt tuyển sớm của Tencent bắt đầu từ tháng 3, kết thúc ngày 15/4.
- Từ tháng 3-5 nhận offer thực tập, tốt nhất là có thể nhận được offer thực tập của công ty muốn đến nhất trong tháng 4.
- Thực tập từ tháng 4-8, đầu tháng 7 là đợt tuyển sớm của 秋招, cuối tháng 7 hoặc đầu tháng 8 là đợt chính thức của 秋招, cuối tháng 9 秋招 giảm khá nhiều, nhưng đó chỉ là tương đối, vẫn còn cơ hội.
- Cuối tháng 10 秋招 về cơ bản kết thúc, sau đó vẫn còn đợt tuyển bổ sung 秋招.

---

- **Làm thế nào để tìm cơ hội thực tập** - cá nhân tôi thấy nhờ người quen giới thiệu nội bộ (内推) thì tốt hơn. Lợi ích của giới thiệu nội bộ ngoài việc có thể giúp theo dõi tiến độ, thông thường còn có thể được giới thiệu thẳng vào team, nhờ đó loại trừ được một số team không tốt (坑). Biết trước team đó làm gì.
- **Thực tập khá quan trọng, tốt nhất là ngay trong lúc thực tập hãy tìm được một công ty muốn đến, 秋招 sẽ nhẹ nhàng hơn nhiều**, vì chuyển chính thức từ thực tập về cơ bản không có vấn đề gì, thứ nữa offer từ chuyển chính thức sau thực tập thường tốt hơn offer 秋招 (tất nhiên nếu 秋招 thể hiện tốt cũng có thể nhận được offer rất tốt). Rất nhiều người xung quanh tôi có offer chính thức đều đến từ việc chuyển chính thức sau thực tập.
- **Kiểm soát tốt thời gian thực tập**, vì vừa thực tập vừa chuẩn bị 秋招 khá mệt, thông thường lúc thực tập áp lực công việc cũng khá lớn, không có nhiều thời gian luyện bài.

### Chuẩn bị phỏng vấn

#### Kinh nghiệm dự án

Tôi nghĩ dự án ở phòng thí nghiệm của chúng tôi không có vấn đề gì, quan trọng là phải kể cho tốt.

- **Giới thiệu dự án**

Đầu tiên có thể sẽ yêu cầu bạn giới thiệu dự án này là gì, cũng như **vì sao phải làm dự án này**.

- **Kết quả của dự án**

Sau đó có thể sẽ hỏi kết quả cuối cùng về mặt dữ liệu của dự án, ví dụ như hệ thống hội nghị có thể bao nhiêu người sử dụng cùng lúc, hoặc trải nghiệm định lượng, ví dụ như độ mượt, hoặc một số lợi thế khác.

- **Khó khăn trong dự án**

Cuối cùng đều sẽ hỏi trong quá trình thực hiện có gặp khó khăn, thử thách gì không, và đã giải quyết như thế nào. Trong quá trình này chủ yếu khảo sát xem điểm kỹ thuật của dự án là gì.

> Khó khăn là gì, cá nhân tôi cho rằng vấn đề phải mất vài ngày mới giải quyết được thì mới coi là khó khăn.

Lấy hai ví dụ:

**Ví dụ đầu tiên là về việc truy tìm bug**. Ví dụ có một vấn đề rò rỉ bộ nhớ (memory leak) phải mất một tuần mới truy ra được, thì đó coi là một khó khăn. Quá trình giải quyết khó khăn này chính là **quá trình làm thế nào để xác định vấn đề**, ví dụ trước tiên chúng ta tìm kiếm tài liệu liên quan dựa theo lỗi, chắc chắn không dễ dàng tìm ra nguyên nhân ngay lập tức, mà chúng ta sẽ tìm được trong các tài liệu đó một số **từ khóa**, ví dụ một số công cụ, thì việc chúng ta sử dụng công cụ đó chính là một quá trình giải quyết vấn đề.

**Ví dụ thứ hai là về thiết kế phương án cho yêu cầu (requirement)**. Ví dụ với một yêu cầu nào đó, chúng ta có thể có nhiều phương án thiết kế khả thi để triển khai yêu cầu đó. Quá trình giải quyết khó khăn này chính là **suy nghĩ của chúng ta về lý do cuối cùng chọn phương án này, cũng như ưu nhược điểm của các phương án thiết kế khác**.

[Khi được hỏi trong phỏng vấn: Vấn đề khó khăn nhất bạn từng gặp trong công việc là gì? _Phát hiện vấn đề, giải quyết vấn đề - Blog CSDN_ Cách giải quyết khi gặp khó khăn trong công việc được hỏi trong phỏng vấn](https://blog.csdn.net/u012423865/article/details/79452713)

Có người nói cách giải quyết của tôi là dùng Baidu để tìm kiếm, nhưng thực ra chi tiết cũng là trước tiên tìm kiếm một lỗi hoặc vấn đề nào đó, nhưng chắc chắn không thể một lúc là tìm ra được câu trả lời code ngay, mà là tìm thấy trong một câu trả lời có một từ khóa nào đó, sau đó chúng ta tiếp tục dùng từ khóa đó để tìm kiếm các thông tin khác.

#### Bài thi viết

Tôi nghĩ bài thi viết khi tìm thực tập sẽ không quá khó, thông thường nếu là 4 bài, làm được 1-2 bài thì gần như đã có cơ hội được phỏng vấn.

Luyện bài là vấn đề đã quá quen thuộc, đó là LeetCode Top100. Lúc đầu luyện bài rất đau khổ, đợi đến khi luyện được 40 bài thì bắt đầu có cảm giác. Khuyên nên bắt đầu luyện từ linked list, cây nhị phân (binary tree), các bài kiểu mảng (array) có nhiều mẹo không dùng chung được.

- ::Nhất định phải luyện tập với bảng trắng (whiteboard)::, nhất định phải dùng bảng trắng. Không chỉ để ghi nhớ API cho buổi phỏng vấn, quan trọng hơn là khi đã quen với bảng trắng, viết code sẽ thành thạo hơn và tư duy độc lập hơn, không còn bị phụ thuộc.
- Bài thuật toán là trọng tâm quan trọng nhất. Điểm đích không phải là các bài khó, mà là các bài dễ, trung bình, thường gặp, tần suất cao phải luyện đến mức thành thục, thuộc lòng như lòng bàn tay.
- Trong quá trình làm bài thi viết lúc phỏng vấn, nếu gặp vấn đề, **nhất định phải xin sử dụng IDE cục bộ để debug ngay lập tức**, nếu không có thể tìm mãi không ra vấn đề, lãng phí cơ hội.

#### Phỏng vấn

Phỏng vấn thông thường mỗi buổi khoảng 1 giờ, chia làm hai phần, nửa đầu sẽ hỏi một số kiến thức cơ bản hoặc kinh nghiệm dự án, nửa sau làm bài.

**Ôn kiến thức cơ bản lúc đầu không cần thiết phải ôn có hệ thống, trước tiên đảm bảo các câu hỏi tần suất cao phải nắm chắc**, ví dụ như mạng máy tính (computer network), hệ điều hành (operating system) những câu hỏi kiểu gì cũng hỏi, có thể xem nhiều kinh nghiệm phỏng vấn (面经) để tìm ra các câu hay được hỏi. Với những câu hỏi khá hóc búa thì dù không trả lời được cũng không ảnh hưởng mang tính quyết định.

- **Xem thật nhiều kinh nghiệm phỏng vấn (面经)!!!!!!** Đừng cứ cắm đầu tự học, hãy xem người khác đã được hỏi những câu thường gặp nào.
- Với công việc thực tập, **các câu hỏi thường gặp của điểm kiến thức phải xem cho đầy đủ!!!!!**, không cần quá chuyên sâu cũng không sao, nhưng nhất định phải đầy đủ, nhất định phải đầy đủ!!!!
- **Với những gì mình không biết, hãy nói nhiều nhất có thể！！！！** Nếu thực sự không được thì chuyển sang nói chuyện khác！！！ Tóm lại là hướng người phỏng vấn sang những phần mình biết.
- Bài thi viết trong phỏng vấn có phong cách khác với bài thi viết trước đó. Bài trong phỏng vấn không quá khó, nhưng khảo sát là bình tĩnh suy nghĩ, code thanh lịch, không có bug. Hãy suy nghĩ cho rõ ràng trước đã!!! rồi mới viết!!!
- Khi mô tả điểm khó của dự án, đừng nói việc khảo sát tài liệu là khó khăn. Trả lời phần này nên là điểm khó về mặt kỹ thuật, cuối cùng đã giải quyết vấn đề này bằng công nghệ gì. Để phần công nghệ này cho người phỏng vấn hỏi thêm nhằm bộc lộ được năng lực kỹ thuật của mình.

<!-- @include: @article-footer.snippet.md -->
