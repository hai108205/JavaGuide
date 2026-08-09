---
title: Tổng kết kỳ tuyển mùa xuân của người bình thường (offer Alibaba, Tencent)
description: "Tổng kết kỳ tuyển mùa xuân của người bình thường (offer Alibaba, Tencent): xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn, sắp xếp lại các khái niệm then chốt, câu hỏi thường gặp và điểm mấu chốt thực hành, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
author: 钟期既遇
tag:
  - 面试
head:
  - - meta
    - name: keywords
      content: 春招经验,阿里面试,腾讯面试,Java学习路线,面试准备,项目经验,算法刷题,双非本科
---

> **Lời giới thiệu**: Bài đăng hot trên Niuke (牛客网), viết rất đầy đủ! Kỳ thực tập hè, nộp đơn vào Alibaba, Tencent, ByteDance, nhận được offer của Alibaba và Tencent.
>
> **Địa chỉ bài gốc:** <https://www.nowcoder.com/discuss/640519>
>
> **Phần tiếp theo**: [Mười năm uống băng, khó nguôi máu nóng - Tổng kết kỳ tuyển mùa thu](https://www.nowcoder.com/discuss/804679)

## Bối cảnh

Khi viết bài này, offer của Tencent đã về, kỳ tuyển mùa xuân (春招) coi như kết thúc. Lần này tìm thực tập hè tôi không nộp đơn tràn lan (海投) như năm ngoái tìm thực tập thường, chỉ nộp vào 3 công ty BAT, Alibaba và Tencent nhận được offer, ByteDance không cho cơ hội phỏng vấn, có lẽ do bài kiểm tra viết (笔试) quá kém.

Tôi (楼主) năm nay học năm 3, trường đại học không thuộc 985/211 (双非本科). Thời gian bắt đầu kỳ tuyển mùa xuân của tôi là từ 20/2 đến khi nhận được thư ngỏ ý (意向书) của Alibaba vào 23/3, nhưng từ sau vòng phỏng vấn kỹ thuật cuối cùng (终面) của Ant vào 7/3 thì không còn phỏng vấn kỹ thuật nào nữa, chỉ trải qua hai vòng phỏng vấn HR, thời gian còn lại đều dành để chờ offer. Ban đầu tôi nhờ bạn bè giới thiệu nội bộ (内推) cho vị trí thực tập thường của bộ phận Finance ByteDance (字节财经), nhưng đến giờ vẫn còn kẹt ở bước đánh giá hồ sơ, sau đó lại nộp đơn thực tập hè cho Finance, sau bài kiểm tra viết thì bị kẹt trong quy trình mãi. Với Tencent thì ban đầu tôi được bộ phận TiMi (天美) vớt lên, sau khi trượt vòng 1 thì được PCG vớt, cuối cùng đi hết toàn bộ quy trình. Với đợt tuyển sớm (提前批) của Alibaba, tôi nộp vào rất nhiều bộ phận, Ant Group là bên sớm nhất hoàn thành vòng phỏng vấn cuối, được nhập vào hệ thống, và cuối cùng nhận được offer. Cả chặng đường này tôi thật sự đã trải qua đủ mọi cay đắng ngọt bùi, từng mặc cảm vì học vấn đến mức muốn thi lên cao học (考研). Nói tóm lại, nhất định phải tìm một người bạn đồng hành cùng ôn tập, ví dụ như @你怕是个憨批哦, đây là bạn cùng phòng thí nghiệm với tôi, cũng là đội trưởng phòng thí nghiệm của chúng tôi, người này thật sự rất mạnh, các bộ phận cốt lõi của Alibaba đều lấy hết, cậu ấy đã giúp tôi rất nhiều trong quá trình ôn tập.

## Mục đích viết bài này

1. Viết cho chính mình: tổng kết và suy ngẫm về ba năm đầu đại học cùng một số trải nghiệm và cảm nhận trong quá trình tìm việc.
2. Viết cho những người bạn vẫn đang tìm thực tập: hy vọng kinh nghiệm và chia sẻ phỏng vấn (面经) của mình có thể mang lại cho các bạn chút gợi mở và giúp ích.
3. Viết cho các đàn em cùng có ước mơ vào công ty lớn (大厂) như tôi: các em còn rất nhiều thời gian chuẩn bị, dù trước đây đang làm gì, chưa có mục tiêu, mơ hồ vô vị, hay chưa tìm đúng hướng đi, chỉ cần bắt đầu từ bây giờ, tìm đúng hướng học tập, và kiên trì học một hai năm, nhất định sẽ thực hiện được ước mơ của mình.

## Trải nghiệm đại học của tôi

Trước tiên hãy nói sơ qua một chút về trải nghiệm đại học của mình.

Tôi không có bài báo (论文), không có giải cuộc thi, không có ACM, muốn giải gì cũng không có, điểm GPA (绩点) cũng khá ổn, không quá kém nhưng cũng không xuất sắc. Xét tuyển thẳng lên cao học (保研) chắc chắn không được, thi lên cao học chắc cũng không đậu.

Năm nhất tôi tham gia một studio (làm việc nhóm), học kỳ đầu tự học C và cấu trúc dữ liệu, từ kỳ nghỉ đông bắt đầu học Java. Lúc đó tôi chưa biết Java cạnh tranh khốc liệt (卷) đến vậy, tin tôi nhận được là Java dễ xin việc. Ở đây không khỏi cảm thán về tầm quan trọng của chênh lệch thông tin (信息差). Lúc đó tôi chỉ biết đến frontend, backend và phát triển Android, và tôi thực sự quan tâm đến phát triển backend, nhưng vì chênh lệch thông tin, tôi chỉ biết Java có thể làm backend, không hề biết backend thực ra là một khái niệm khá hạn chế, sau này mới dần biết đến các thuật ngữ như phát triển hậu cần (后台开发), phát triển phía server (服务端开发), cũng không biết C++, Golang và các ngôn ngữ khác cũng có thể làm backend, vì vậy tôi đã học Java. Nhưng thực ra Java phù hợp hơn với mảng nghiệp vụ (business), C++ phù hợp hơn với phát triển tầng đáy (底层开发) và phát triển phía server. Tôi tuy không bài xích làm nghiệp vụ, nhưng quan tâm hơn đến OS, Network, tất nhiên những thứ này sẽ là sở thích của tôi, thời gian rảnh tôi sẽ tự tìm hiểu.

### Lộ trình học tập

Lộ trình học tập đại khái của tôi là: Java SE cơ bản -> MySQL -> Java Web (bao gồm chủ yếu JDBC, Servlet, JSP v.v.) -> SSM (thực ra lúc đó Spring Boot đã bắt đầu nổi lên, nhưng tôi nghĩ không có nền tảng SSM thì khó học được Spring Boot, nên tôi học SSM trước) -> Spring Boot -> Spring Cloud (lúc đó tuy đã học Spring Cloud, nhưng thiếu sự rèn luyện qua dự án, hoàn toàn không biết dùng, chỉ hiểu được một số khái niệm về phân tán) -> Redis -> Nginx -> Mạng máy tính (vốn là môn bắt buộc của ngành máy tính, nhưng ngành của tôi phải đến học kỳ cuối năm 3 mới học, nên tôi tự học trước) -> Dubbo -> Zookeeper -> JVM -> JUC -> Netty -> Rabbit MQ -> Hệ điều hành (giống mạng máy tính) -> Nguyên lý cấu tạo máy tính (trường trực tiếp không mở môn này).

Đây chính là một lộ trình học tập cụ thể của tôi, đại khái hoàn thành các kiến thức này vào học kỳ cuối năm 2, đều là học qua video, chỉ biết dùng, không hiểu nguyên lý tầng đáy, chưa đạt đến trình độ bát cổ văn (八股文) trong phỏng vấn. Sau khi học hết những thứ này, xây dựng được hệ thống kiến thức, tôi bắt đầu chuẩn bị phỏng vấn, thời điểm bắt đầu đại khái là tháng 6 năm ngoái, bắt đầu xem các bài chia sẻ phỏng vấn trên Niuke rồi tự tổng kết. Giai đoạn chuẩn bị phỏng vấn, tôi nghĩ quan trọng nhất là cày sách + luyện đề (刷题), bát cổ văn chỉ là phụ trợ, chúng tôi chỉ tự giễu rằng phỏng vấn thì học thuộc bát cổ văn là được, nhưng thực ra với những công ty như Alibaba, học thuộc bát cổ văn hoàn toàn không thể qua loa lấy lệ được, trừ khi bạn có dự án hoặc kinh nghiệm thực tập thật sự nổi bật.

### Sách gợi ý

- 《Thinking in Java》：Không cần nói nhiều, sách hay, nhưng quá dày, mua về chưa đọc.
- 《深入理解 Java 虚拟机》：Kinh thánh của JVM, tôi đã đọc hai lần, mỗi lần đều có những thu hoạch khác nhau.
- 《Java 并发编程的艺术》：Do người Alibaba viết, về cơ bản bao phủ các câu hỏi về lập trình đồng thời thường gặp trong phỏng vấn.
- 《MySQL 技术内幕》：Viết rất sâu, nhưng có thể không thân thiện với người mới bắt đầu, ấn tượng đầu tiên là viết khá sâu và rối, sau đó đọc từng chương riêng lẻ thì thấy thu hoạch rất lớn.
- 《Redis 设计与实现》：Đúng như tên sách, kết hợp với mã nguồn trình bày sâu về nguyên lý triển khai của Redis, nhất định phải đọc.
- 《深入理解计算机系统》：CSAPP nổi tiếng, có thể không giúp ích được nhiều cho việc phỏng vấn Java của bạn, nhưng phải nói đây là một cuốn kinh điển, bao phủ các kiến thức về hệ thống máy tính, kiến trúc (体系结构), nguyên lý cấu tạo, hệ điều hành v.v. Khi phỏng vấn vòng 2 tiếp, tôi được hỏi về khó khăn lớn nhất từng gặp phải, tôi đã trao đổi với interviewer về một số vấn đề khi đọc cuốn sách này, phỏng vấn vòng 2 bên Taobao (淘系) cũng trao đổi với interviewer về cuốn sách này, cả hai chúng tôi đều thấy cuốn sách này cần đọc lần thứ hai.
- 《TCP/IP 详解卷 1》：Tôi chỉ đọc các chương liên quan đến TCP, nhưng rất nên đọc hết một lượt, khi phỏng vấn TiMi tôi đã trao đổi cuốn sách này với interviewer.
- 《操作系统导论》：OSTEP khá nổi tiếng, là giáo trình hệ điều hành của Đại học Nam Kinh (南大), khi đọc có thể kết hợp với video của thầy Jiang Yanyan (蒋炎岩) trên Bilibili (B站), tôi sẽ để link bên dưới.

Nếu hiểu thấu đáo mấy cuốn sách này, tôi tin khi phỏng vấn bạn có thể trò chuyện rất sâu với interviewer, interviewer cũng sẽ có ấn tượng rất tốt về bạn. Nhưng với người bình thường, đọc một lần chắc chắn không nhớ được, quên là hiện tượng hoàn toàn bình thường, tôi cũng có nhiều cuốn chỉ đọc một lần, nhiều chi tiết cũng không nhớ rõ, gần đây đang chuẩn bị đọc lần hai.

Xem thêm các gợi ý sách trên website [JavaGuide](https://javaguide.cn/books/), khá là đầy đủ.

![](https://oss.javaguide.cn/p3-juejin/62099c9b2fd24d3cb6511e49756f486b~tplv-k3u1fbpfcp-zoom-1.png)

### Khóa học gợi ý

Với lộ trình học tập tôi nói ở trên, tôi khuyên nên học qua video, tutorial của Shang Silicon Valley (尚硅谷) và Heima (黑马) đều được, nhất định phải tự gõ tay một lần.

- [2021 南京大学 "操作系统：设计与实现" (蒋炎岩)](https://www.bilibili.com/video/BV1HN41197Ko)：Tôi không nói nhiều, xem phần bình luận là biết.
- [SpringSecurity-Social-OAuth2 社交登录接口授权鉴权系列课程](https://www.bilibili.com/video/BV16J41127jq)：Spring Security do anh 字母哥 (Zìmǔgē) giảng cũng rất tốt, Spring Security hoặc Shiro là thứ bắt buộc khi làm dự án, biết một cái là đủ, tùy theo kịch bản thực tế và sở thích cá nhân (cười) để chọn.
- [清华大学邓俊辉数据结构与算法](https://www.bilibili.com/video/BV1jt4y117KR)：Đại học Thanh Hoa thì khỏi cần giải thích.
- [MySQL 实战 45 讲](https://time.geekbang.org/column/intro/100020801)：Xem kỹ 27 bài đầu nhiều lần là về cơ bản có thể giải quyết gọn các câu hỏi MySQL gặp phải trong phỏng vấn.
- [Redis 核心技术与实战](https://time.geekbang.org/column/intro/100056701)：Trình bày rất nhiều tình huống sử dụng Redis trong production, kết hợp với 《Redis 设计与实现》 để đọc, cũng có thể giải quyết gọn các câu hỏi Redis trong phỏng vấn.
- [JavaGuide](https://javaguide.cn/books/)：「Java 学习+面试指南」một tài liệu bao phủ phần lớn kiến thức cốt lõi mà lập trình viên Java cần nắm vững.
- [《Java 面试指北》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247519384&idx=1&sn=bc7e71af75350b755f04ca4178395b1a&chksm=cea1c353f9d64a458f797696d4144b4d6e58639371a4612b8e4d106d83a66d2289e7b2cd7431&token=660789642&lang=zh_CN&scene=21#wechat_redirect)：Đây là một tập sách nhỏ hướng dẫn cách chuẩn bị phỏng vấn hiệu quả hơn, bao gồm các bát cổ văn thường gặp (thiết kế hệ thống, framework phổ biến, phân tán, high concurrency ...) và các bài chia sẻ phỏng vấn chất lượng.

## Tìm việc

Khoảng tháng 11 năm ngoái, trên Niuke bắt đầu xuất hiện nhiều bài chia sẻ phỏng vấn thực tập thường, tôi cũng có ý thức đi tìm thực tập, rồi bắt đầu vừa ôn tập vừa nộp đơn tràn lan, nộp rất nhiều công ty, nhưng chỉ vài công ty cho cơ hội phỏng vấn. Tencent trượt vòng 2 hai lần, lúc đó tinh thần tôi hoàn toàn sụp đổ, thậm chí có ý định từ bỏ kỳ tuyển mùa xuân. Rất may cuối cùng cũng có được một cơ hội thực tập, trong thời gian thực tập, ngoài công việc hàng ngày ra, thời gian còn lại tôi cũng không lơi lỏng, sau giờ tan làm, cuối tuần đều dành để ôn tập, trong lòng thầm quyết tâm, kỳ tuyển mùa xuân nhất định phải quật khởi lần nữa!

Từ cuối tháng 2 bắt đầu nộp tràn lan đợt tuyển sớm của Alibaba, về cơ bản đều có phỏng vấn, ngày mở hệ thống nhận được 16 email giới thiệu nội bộ, các bài chia sẻ phỏng vấn chi tiết có thể xem các bài viết tôi đăng trước đây.

Từ 1/3 đến 7/3, tuần đó trung bình mỗi ngày ba buổi phỏng vấn, thật sự rất suy sụp, có lúc muốn thi lên cao học, cũng từng lo lắng, khóc, cười, may mà kết quả tốt đẹp, cuối cùng cũng đến được Alipay mà mình hằng mong muốn.

Tôi chủ yếu muốn thông qua việc tổng kết quá trình phỏng vấn của bản thân để đưa ra một số lời khuyên cho mọi người, các cao nhân (大佬) không thích thì xin đừng ném đá.

### Chuẩn bị phỏng vấn

Muốn đi phỏng vấn trước tiên phải chuẩn bị một bộ hồ sơ (简历), cá nhân tôi cho rằng một bộ hồ sơ tốt nên có ba phần sau:

1. Thông tin cá nhân đầy đủ, cái này không cần nói nhiều, thông tin cá nhân không đầy đủ thì interviewer hoặc HR không thể liên hệ được với bạn, dù trường học không tốt cũng phải viết lên, vì nghe nói có một số công ty không có thông tin trường học thì không thể đánh giá hồ sơ, nếu không đúng chuyên ngành (非科班) hoặc trường không nổi tiếng thì có thể ghi thông tin giáo dục ở dưới cùng.
2. Kinh nghiệm dự án/thực tập, dự án thật sự rất quan trọng, phần lớn thời gian phỏng vấn sẽ xoay quanh dự án, bạn chuẩn bị tốt dự án thì có thể kiểm soát nhịp độ phỏng vấn, dẫn dắt interviewer hỏi về hướng bạn giỏi, tôi chính là đã thiệt thòi ở điểm này. Không có dự án thì làm sao? Có thể lên GitHub tìm các dự án mã nguồn mở, tự làm theo một lần, thêm vào một số suy nghĩ và hiểu biết của riêng mình. Với lại làm dự án không thể chỉ đơn giản hiện thực hóa chức năng, còn phải cân nhắc đến hiệu năng và tối ưu hóa, interviewer không quan tâm chức năng này bạn hiện thực hóa như thế nào, họ muốn biết là bạn đã suy nghĩ từng bước ra sao, phương án ban đầu là gì, sau đó chọn phương án nào, hiệu năng được cải thiện những gì, còn có thể cải tiến thêm được không?
3. Kỹ năng chuyên môn nắm vững, cái này có thể viết đơn giản các kiến thức chuyên môn bạn đã học, để interviewer có thể hỏi có trọng tâm một số kiến thức cơ bản, tuyệt đối tránh liệt kê dài dòng, thứ giỏi nhất nhất định phải viết ở trên, rồi giảm dần xuống.

Viết xong hồ sơ thì bước vào giai đoạn nộp đơn, tốt nhất nên tìm một người giới thiệu nội bộ đáng tin cậy, vì người giới thiệu nội bộ có thể giúp bạn theo dõi tiến độ phỏng vấn, khi cần thiết trao đổi với HR, dù có trượt cũng có thể nói cho bạn biết lý do, khía cạnh nào thể hiện không tốt. Hiện nay giới thiệu nội bộ không còn là ngưỡng cửa, mà là tấm vé vào sân ở mức tối thiểu, nếu không quen ai để giới thiệu nội bộ thì cũng có thể lên Niuke tìm các anh chị khóa trên (师兄) nhờ giới thiệu, họ thường cũng rất nhiệt tình.

Trong quá trình phỏng vấn nhất định đừng căng thẳng, vì interviewer vòng 1 có thể lớn hơn chúng ta không mấy tuổi, cũng mới đi làm vài năm, nên hoàn toàn không cần (duck 不必) căng thẳng đến mức không nói nên lời, không biết thì nói không biết, rồi cười một cái, biết thì diễn đạt trôi chảy. Phỏng vấn không phải là hỏi một đáp một, phỏng vấn là giao tiếp, là trao đổi, bạn có thể mạnh dạn nói ra suy nghĩ của mình, khả năng diễn đạt và giao tiếp cũng là một chỉ số đánh giá trong phỏng vấn.

Cá nhân tôi cho rằng phỏng vấn cũng giống như tán gái (追妹子), đều là làm cho đối phương hiểu mình càng nhanh càng tốt, phát hiện ra những điểm sáng của bạn, chỉ khác là phỏng vấn là để interviewer hiểu được trình độ kỹ thuật của bạn. Vì vậy phần giới thiệu bản thân trở nên rất quan trọng, bạn có thể giới thiệu ngắn gọn thông tin cá nhân xong rồi giới thiệu các dự án đã làm, phần giới thiệu bản thân tốt nhất nên dài một chút, vì trước khi phỏng vấn, interviewer có thể chưa xem hồ sơ của bạn (逃), bạn tốt nhất để cho interviewer đủ thời gian xem hồ sơ của bạn. Phần giới thiệu bản thân bao gồm cả giới thiệu dự án có thể viết thành một tài liệu, đọc nhiều lần, đến khi phỏng vấn đọc thuộc được, thực sự không được thì cũng có thể nhìn theo mà đọc.

### Dự án

Tôi vẫn muốn tập trung nói về dự án, trước đây tôi nghĩ dự án là một nơi có độ bất định rất lớn, sau này trải qua phỏng vấn mới biết dự án là nơi dễ dẫn dắt nhịp điệu interviewer nhất. Ý nghĩa của việc hỏi dự án là thông qua dự án để hỏi kiến thức cơ bản, vì vậy yêu cầu bạn phải rất quen thuộc với dự án của mình, cân nhắc các tình huống biên và phương án tối ưu, quen thuộc nguyên lý của các middleware đã dùng, và các middleware này xử lý những tình huống đó như thế nào, ví dụ như phục hồi sau sự cố (宕机) của MQ, Redis cluster, sentinel, cache avalanche (缓存雪崩), cache breakdown (缓存击穿), cache penetration (缓存穿透) v.v.

Tối ưu hóa chủ yếu có thể cân nhắc từ các khía cạnh như cache, MQ tách rời, thêm index, đa luồng, tác vụ bất đồng bộ, dùng ElasticSearch để tìm kiếm v.v. Tôi cho rằng điểm khởi đầu chính của tối ưu hóa dự án là giảm số lần truy cập database, giảm số lần gọi đồng bộ (synchronous call), ví dụ thêm cache, dùng ElasticSearch để tìm kiếm chính là các tối ưu hóa đạt được bằng cách giảm truy cập database, MQ tách rời, tác vụ bất đồng bộ v.v. là các tối ưu hóa đạt được bằng cách giảm số lần gọi đồng bộ.

Trong dự án còn có thể học được rất nhiều thứ, ví dụ những thứ sau đây là học qua dự án:

1. Kiểm soát quyền hạn (权限控制) (ABAC、RBAC)
2. JWT
3. Đăng nhập một lần (单点登录)
4. Chia tách database/bảng (分库分表)
5. Upload/export phân mảnh (分片上传/导出)
6. Khóa phân tán (分布式锁)
7. Cân bằng tải (负载均衡)

Tất nhiên còn rất nhiều thứ, mỗi người có dự án khác nhau, những gì học được cũng khác nhau một trời một vực, nhưng bạn phải tin rằng, những thứ bạn tiếp xúc, interviewer chắc hẳn đều biết, nên nhất định phải chuẩn bị tốt, không thì dễ bị bắt bẻ.

Về bản chất, dự án cũng có thể tách ra thành bát cổ văn, có thể dùng cách chuẩn bị kiến thức cơ bản để chuẩn bị dự án.

### Thuật toán

Việc biến dự án thành bát cổ văn sẽ càng khiến không thể tuyển chọn chính xác ứng viên, vì vậy mới đến tiêu chuẩn đánh giá thứ ba của phỏng vấn, đó là thuật toán. Tôi từng ở giai đoạn hỏi ngược (反问) hỏi interviewer việc luyện thuật toán giúp ích cho những khía cạnh nào, interviewer nói thẳng với tôi rằng, luyện đề có ích cho việc tìm việc sau này của bạn. Quan điểm của tôi là thuật toán thực ra cũng có thể nâng cao thông qua ghi nhớ, 200 câu đầu của LeetCode có thể luyện được 3 lần, tôi không tin đến khi phỏng vấn vẫn không viết ra được (手撕), nên trong quá trình ôn tập nhất định phải duy trì luyện tập thuật toán.

### Lời khuyên phỏng vấn

1. Phần giới thiệu bản thân cố gắng phong phú hơn, dự án chuẩn bị trước cách giới thiệu.
2. Khi phỏng vấn, gặp câu hỏi không biết thì tốt nhất đừng nói thẳng không biết rồi ngồi im, chờ interviewer hỏi câu tiếp theo, bạn có thể nói mình không hiểu rõ khía cạnh này lắm, nhưng có hiểu biết chút về XX, rồi trình bày, nếu interviewer hứng thú thì bạn có thể tiếp tục nói, không hứng thú thì họ sẽ hỏi câu tiếp theo, interviewer thường sẽ không ngắt lời, đây cũng là một mẹo nhỏ giúp interviewer nhanh chóng hiểu bạn.
3. Cố gắng thể hiện sự nhiệt huyết với công nghệ trước interviewer, ví dụ có thể trò chuyện với interviewer về tính năng mới của từng phiên bản Java, các tin tức gần đây của giới công nghệ v.v., vì theo tôi được biết, nhiệt huyết công nghệ cũng là một khía cạnh được Alibaba đánh giá trong phỏng vấn.
4. Phỏng vấn là một quá trình lựa chọn hai chiều, đừng tỏ ra quá nịnh bợ.
5. Nắm chắc giai đoạn hỏi ngược, hỏi những nội dung có giá trị, ví dụ như cơ chế đào tạo nhân viên mới, cơ chế chuyển chính thức (转正) v.v.

## Kinh nghiệm

1. Nếu bạn đang năm nhất, OK, tôi hy vọng bạn có thể tìm hiểu thêm về các hướng nghề nghiệp internet, xem sở thích của mình ở đâu, trước tiên hãy đánh chắc nền tảng, ví dụ như cấu trúc dữ liệu, hệ điều hành, mạng máy tính, nguyên lý cấu tạo máy tính, vì bốn môn này vừa là môn chuyên ngành trong kỳ thi lên cao học của hầu hết các trường, vừa là những câu hỏi thường được hỏi trong phỏng vấn.
2. Nếu đã năm hai, thì phải xác định rõ hướng đi của mình, phải có tinh thần tự lực (自驱力), biết hướng mình đang học cần học những kiến thức gì, học đến mức nào thì có thể đi làm, sắp xếp thời gian hợp lý, biết mình ở giai đoạn nào cần đạt trình độ gì.
3. Nếu bạn bị thiệt thòi về học vấn, hoặc không đúng chuyên ngành, thì tôi khuyên bạn nhất định phải nỗ lực vượt xa người thường, vì những năm lăn lộn trên Niuke, tôi thấy các bài chia sẻ phỏng vấn thường là trường tốt hơn thì hỏi dễ hơn, trường tương đối kém hơn thì hỏi khó hơn, thực ra cũng có thể hiểu được, dù sao nhìn chung sinh viên các trường danh tiếng thì thực lực tổng hợp mạnh hơn.
4. Cố gắng đi thực tập càng sớm càng tốt, nếu bạn đang năm hai và đã có trình độ đi thực tập, tôi khuyên bạn nộp hồ sơ sớm, cố gắng tìm thực tập hè, bạn tin tôi đi, nếu mùa hè này bạn đi thực tập, năm sau nhất định sẽ oanh tạc (乱杀) tất cả.
5. Nối tiếp ý trên, nếu không tìm được thực tập, cố gắng làm vài dự án có tính thử thách, và tìm ra điểm mấu chốt (抓手) của dự án.
6. Luyện nhiều trên Niuke, trên Niuke tôi quen được rất nhiều người cùng chí hướng, họ đã giúp tôi rất nhiều trong quá trình tìm việc.

## Lời khuyên

1. Nhất định phải "bó củi sưởi ấm" (抱团取暖), các bạn cùng đi tìm việc có thể lập một nhóm, dù là bạn cùng trường hay quen trên mạng, bình thường trao đổi nhiều kinh nghiệm ôn tập, n số 1 cộng lại chắc chắn lớn hơn n.
2. Độ sâu và độ rộng của kiến thức đều rất quan trọng, bình thường nhất định phải tìm hiểu nhiều công nghệ mới, và mỗi khi học một công nghệ phải cố gắng hiểu nguyên lý của nó, không thì bạn học không phải là khoa học máy tính, mà là khoa tiếng Anh, vị trí công việc cũng không phải kỹ sư nghiên cứu phát triển (研发工程师), mà là kỹ sư gọi API (API 调用工程师).
3. Vận hành tốt các nền tảng blog của mình như CSDN, Juejin (掘金) v.v., tôi có một đàn em năm hai đã là chuyên gia blog CSDN, đã có headhunter liên hệ với cậu ấy, code viết thường ngày cố gắng đều đẩy lên GitHub, dù là dự án hay thí nghiệm, nếu có khả năng thì tốt nhất có thể quay một số video đăng lên Bilibili (哔哩哔哩), vì đây là một con đường quan trọng để interviewer hiểu khả năng diễn đạt của bạn trước khi phỏng vấn.
4. Tâm lý nhất định phải tốt, phỏng vấn không thuận lợi không hẳn là vấn đề năng lực của bạn, cũng có thể vì họ tuyển người rất ít, hoặc một số điều kiện khách quan không khớp với họ, nhất định phải thử nhiều lựa chọn khác nhau.
5. Giao tiếp nhiều với mọi người, đừng cắm đầu làm việc một mình, vì sau này vào công ty bạn cũng cần hợp tác với người khác, nên khả năng diễn đạt và giao tiếp là một kỹ năng cơ bản, cần bồi dưỡng từ trước.

## Tán gẫu

### Về chênh lệch thông tin

Tôi cho rằng khoảng cách giữa các trường không chỉ thể hiện ở trình độ giảng dạy, đúng là trình độ giảng dạy, trình độ thí nghiệm của thầy cô trường danh tiếng đều cao hơn trường yếu, nhưng chênh lệch thông tin mới là khoảng cách chủ yếu. Học trong các trường 985, không chỉ tiếp xúc được với nhiều buổi tuyên truyền tuyển dụng (校招宣讲), diễn giảng của các doanh nghiệp chất lượng cao hơn, mà còn tiếp xúc được với bầu không khí việc làm tốt hơn, vì trong trường danh tiếng người vào công ty lớn, vào công ty nước ngoài, thậm chí đi nước ngoài nhiều hơn, sự giới thiệu nội bộ của anh chị khóa trên chỉ là một mặt, mặt khác là bạn có thể học được những thứ ngoài kỹ thuật từ họ, còn trường shuangfei (双非) người vào công ty lớn ít, họ chỉ có thể ảnh hưởng đến một bộ phận rất nhỏ người, đây chính là chênh lệch thông tin. Bất lợi của chênh lệch thông tin thể hiện chủ yếu ở những khía cạnh nào? Ví dụ người ta năm hai đã bắt đầu tìm thực tập thường, còn bạn cho rằng tìm việc là chuyện của năm 4, người ta năm ba đã tìm được thực tập hè, còn bạn mùa hè vẫn phải tham gia buổi đào tạo do trường tổ chức, từng bước từng bước như vậy mà bị bỏ lại phía sau.

May thay, sự xuất hiện của internet khiến thông tin minh bạch hơn, bạn có thể tìm kiếm đủ loại thông tin mình muốn trên mạng, ví dụ tôi đã quen một số người bạn cùng chí hướng trên Niuke, họ đã giúp tôi rất nhiều trong quá trình tìm việc. Bình thường có thể luyện nhiều trên Niuke, có thể giảm chênh lệch thông tin một cách hiệu quả.

### Về sự cạnh tranh khốc liệt của Java (内卷)

Java có cạnh tranh khốc liệt không? Không nghi ngờ gì, rất khốc liệt. Cá nhân tôi cho rằng phát triển (开发) thuộc dạng công việc không có ngưỡng cửa gì, sinh viên đại học làm là vừa, nhưng vì các vị trí thuật toán (算法岗) càng là "thần tiên đánh nhau" (神仙打架), khiến rất nhiều học viên cao học cũng chuyển sang làm phát triển, và cơ bản đều chuyển sang phát triển Java. Sự cạnh tranh khốc liệt của Java chỉ do nguyên nhân này tạo ra? Dĩ nhiên không phải, tôi cho rằng còn một nguyên nhân nữa là sự trỗi dậy của các trung tâm đào tạo (培训机构), khiến ngưỡng cửa của ngành này càng hạ thấp hơn, bạn muốn học gì, học thế nào, đều có người sắp xếp cho bạn, đây là nguyên nhân thứ hai gây ra nội cuốn. Nguyên nhân thứ ba là những người không đúng chuyên ngành chuyển sang code (非科班转码), sự suy tàn của các ngành khác tương phản rõ rệt với sự thịnh vượng của ngành internet, khiến nhiều người thuộc ngành khác cũng tự học máy tính, tìm công việc internet, làm cho người trong ngành này ngày càng nhiều, chiếc bánh thì chỉ lớn như vậy, mà người chia bánh lại ngày càng nhiều.

Thực ra nội cuốn chưa chắc đã là hiện tượng xấu, điều này cho thấy kênh thăng tiến giai tầng (阶级上升) vẫn chưa đóng hoàn toàn, vẫn có không ít người sẵn sàng nỗ lực để thay đổi hiện trạng, điều này cũng ở mức độ nhất định sẽ thúc đẩy sự phát triển của ngành, sự phát triển của xã hội. Quyền lựa chọn nằm trong tay bạn, bạn có thể chọn về quê "nằm thẳng" (躺平) hoặc vào công ty internet nội cuốn, nếu chọn vế sau, lời khuyên của tôi là nên sớm chiếm chỗ (占坑), vì điều duy nhất không đổi là sự thay đổi, bạn không bao giờ biết ba năm sau sẽ ra sao.

## Lời chúc

Chỉ mong các bạn, tiền đồ xán lạn!

<!-- @include: @article-footer.snippet.md -->
