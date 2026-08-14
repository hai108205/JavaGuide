---
title: Cách khảo sát kỹ năng kỹ thuật của lập trình viên trong vòng sơ loại kỹ thuật
description: "Cách khảo sát kỹ năng kỹ thuật của lập trình viên trong vòng sơ loại kỹ thuật: xoay quanh kiến thức kỹ thuật và tổng kết phỏng vấn để hệ thống hóa các khái niệm then chốt, câu hỏi thường gặp và điểm thực hành trọng yếu, giúp bạn học tập hiệu quả và chuẩn bị phỏng vấn."
category: 技术文章精选集
author: 琴水玉
tag:
  - 面试
head:
  - - meta
    - name: keywords
      content: 技术面试,面试官技巧,技术考察,面试方法,技术基础,项目经历考察,面试题库,技术深度
---

> **Lời giới thiệu**: Bài viết bàn về phỏng vấn kỹ thuật từ góc nhìn của cả người phỏng vấn lẫn người được phỏng vấn! Rất hay!
>
> **Tổng quan nội dung:**
>
> - Kết hợp thực chiến với lý thuyết. Ví dụ, sau khi ứng viên trình bày về bố cục mô hình bộ nhớ JVM, có thể hỏi tiếp: có những nguyên nhân nào có thể dẫn đến OOM, có những biện pháp phòng tránh nào? Bạn đã từng gặp vấn đề rò rỉ bộ nhớ (memory leak) chưa? Làm thế nào để truy tìm và giải quyết loại vấn đề này?
> - Không nên khảo sát trên quá hai dự án. Bởi vì để đào sâu chi tiết một dự án, thời gian chiếm dụng khá lớn. Thông thường, sẽ để ứng viên chọn một dự án mà anh/cô ấy cảm thấy thu được nhiều nhất / mang tính thử thách nhất / ấn tượng sâu sắc nhất / tự thấy đặc biệt thú vị. Sau đó xoay quanh dự án đó để đặt câu hỏi. Thường bắt đầu từ bối cảnh của dự án, khảo sát về tech stack của dự án, sự hiểu biết tổng thể về các module và tương tác trong dự án, các vấn đề kỹ thuật đầy thử thách gặp phải trong dự án và giải pháp, truy tìm và giải quyết vấn đề, vấn đề khả năng bảo trì code, đảm bảo chất lượng công trình, v.v.
> - Hỏi nhiều nói ít, để ứng viên thể hiện nhiều hơn. Dựa theo câu trả lời của ứng viên để dẫn dắt hoặc đi sâu hoặc mở rộng ngang một cách phù hợp.
>
> **Địa chỉ bài gốc**: <https://www.cnblogs.com/lovesqcc/p/15169365.html>

## Ba câu hỏi cốt lõi về bản chất

1. Bạn thấy người này thế nào? 【Khả năng diễn đạt, khả năng giao tiếp, khả năng học tập, khả năng tổng kết, khả năng tự phản tỉnh và cải thiện, khả năng chịu áp lực, khả năng quản lý cảm xúc, sức ảnh hưởng, khả năng quản lý đội nhóm】
2. Nếu để anh/cô ấy độc lập hoàn thành thiết kế và triển khai của dự án, bạn thấy anh/cô ấy có đủ khả năng không? 【Khả năng thiết kế hệ thống, khả năng quản lý dự án】
3. Đánh giá của bạn về khả năng phân tích và giải quyết vấn đề của anh/cô ấy là gì? 【Khả năng hiểu nguyên lý, khả năng ứng dụng thực chiến】

## Mục tiêu và tư duy khảo sát

Trước tiên phải làm rõ, mục tiêu khảo sát của vòng sơ loại kỹ thuật:

- Nền tảng kỹ thuật của ứng viên;
- Tư duy và khả năng giải quyết vấn đề của ứng viên.

Nền tảng kỹ thuật là nền móng (thứ nằm dưới tảng băng), chiếm bảy phần, tư duy và khả năng giải quyết vấn đề là phần hiện thực hóa (phần nhô lên trên tảng băng), chiếm ba phần. Khảo sát nghiệp vụ và nền tảng kỹ thuật, tỷ lệ là 7-3.

Mục tiêu khảo sát cốt lõi: khả năng phân tích và giải quyết vấn đề.

Về mặt kỹ thuật: độ sâu + khả năng ứng dụng + độ rộng. Đối với tuyển sinh viên mới hoặc tuyển dụng xã hội dưới cấp P6, cần chú trọng hơn vào độ sâu + khả năng ứng dụng, độ rộng là điểm cộng; trên cấp P6, có thể tăng thêm độ rộng.

- Tuyển sinh viên mới (campus recruitment): nền tảng vững chắc, tư duy nhạy bén. Nội dung khảo sát chính: cấu trúc dữ liệu và thuật toán cơ bản, tiến trình và bất đồng bộ (process & concurrency), quản lý bộ nhớ, cơ chế system call và IO, giao thức mạng, chuẩn hóa và thiết kế cơ sở dữ liệu, design pattern, nguyên tắc thiết kế, thói quen lập trình;
- Tuyển dụng xã hội (social recruitment): giàu kinh nghiệm, toàn diện cả trong ngoài. Nội dung khảo sát chính: các cơ chế kỹ thuật nền tảng có độ sâu nhất định, như mô hình bộ nhớ Java và rò rỉ bộ nhớ, cơ chế JVM, cơ chế class loading, index cơ sở dữ liệu và tối ưu truy vấn, cache, message middleware, dự án, thiết kế kiến trúc, quy chuẩn kỹ thuật, v.v.

### Nền tảng kỹ thuật là gì?

Là người phỏng vấn vòng sơ loại kỹ thuật, làm thế nào để khảo sát nền tảng kỹ thuật? Rốt cuộc nền tảng kỹ thuật là gì? Là biết được cái gì, hay là biết cách tư duy thế nào? Tri thức với vai trò là một hệ thống nguyên lý hoàn chỉnh hiện có, tạo thành phần quan trọng của nền tảng, còn việc biết cách tư duy lại càng quan trọng. Tục ngữ có câu: biết nó là gì còn phải biết tại sao lại như vậy (知其然而知其所以然). "知其然" là quen thuộc với hệ thống tri thức hiện có, "知其所以然" là suy luận từ dưới lên, thực sự hiểu được lai lịch đầu đuôi của tri thức, hiểu được vì sao là như thế này chứ không phải như thế kia. Dù sao, đối với thế giới chương trình vốn bản chất là logic, không có một cách làm cố định nào. Biết cách tư duy, và có thể thiết kế và phát triển một cách chặt chẽ, đi sâu vào chi tiết, đó chính là nền tảng kỹ thuật vậy.

### Vì sao phải khảo sát nền tảng kỹ thuật?

Hai loại tư duy kỹ thuật quan trọng nhất của lập trình viên là tư duy logic và tư duy thiết kế trừu tượng (abstract design). Tư duy logic là nền tảng, tư duy thiết kế trừu tượng là cấp độ cao cấp. Việc khảo sát nền tảng kỹ thuật vừa hay có thể đồng thời khảo sát hai loại tư duy này. Có thể hiểu được các khái niệm kỹ thuật nền tảng và mối liên hệ giữa chúng hay không, là khảo sát tư duy logic; có thể trừu tượng hóa vấn đề nghiệp vụ thành vấn đề kỹ thuật và tổ chức ánh xạ một cách hợp lý hay không, là khảo sát tư duy thiết kế trừu tượng.

Tuyệt đại đa số vấn đề nghiệp vụ đều có thể trừu tượng hóa thành vấn đề kỹ thuật. Ở một mức nghĩa nào đó, vấn đề nghiệp vụ chỉ là biểu đạt theo hướng lĩnh vực của vấn đề kỹ thuật.

Vì vậy, chỉ khi khảo sát ứng viên thông qua nền tảng kỹ thuật, mới có thể khảo sát được thực lực kỹ thuật thực sự của ứng viên: độ sâu và độ rộng kỹ thuật.

### Vì sao không thể chỉ khảo sát riêng chiều nghiệp vụ?

Bởi vì phần nghiệp vụ thường khá quen thuộc, ứng viên có thể trực tiếp nói theo giải pháp hiện có, rất khó khảo sát được khả năng hiểu biết sâu sắc, mở rộng ngang và tổng kết khái quát của ứng viên.

Về điểm này, khuyến nghị khảo sát có chủ đích khả năng tổng kết khái quát của ứng viên: ví dụ, trong quá trình xây dựng hoặc phát triển hoặc duy trì microservice / đảm bảo độ ổn định hoặc hiệu suất của hệ thống, bạn đã thu được những kinh nghiệm nào có thể chia sẻ?

### Vì sao phải khảo sát chiều nghiệp vụ?

Điểm dễ bị bỏ sót khi khảo sát nền tảng kỹ thuật là các đặc điểm năng lực phi kỹ thuật của ứng viên, như khả năng giao tiếp tổ chức, khả năng dẫn dắt dự án, khả năng chịu áp lực, khả năng giải quyết vấn đề thực tế, sức ảnh hưởng trong đội nhóm, các đặc điểm tính cách khác, v.v.

## Phương pháp khảo sát

### Khảo sát nền tảng kỹ thuật

Khảo sát nền tảng kỹ thuật như thế nào? Thông qua mô hình đặt câu hỏi đa góc độ hiệu quả để khảo sát.

**Là gì - Vì sao**

"Là gì" khảo sát sự hiểu biết cơ bản về khái niệm, "vì sao" khảo sát nguyên lý triển khai của khái niệm.

Ví dụ index là gì? Index được triển khai như thế nào?

**Dẫn dắt - hỏi ngang - hỏi sâu**

Mang tính dẫn dắt, ví dụ "Bạn quen thuộc với các công cụ đồng bộ (synchronization) của Java không?" để thăm dò, sau khi nhận được câu trả lời khẳng định, có thể hỏi tiếp: "Bạn quen thuộc với những công cụ đồng bộ nào?" để hiểu được độ rộng của ứng viên;

Sau khi có được câu trả lời của ứng viên, có thể hỏi tiếp: "Hãy nói về nguyên lý triển khai của ConcurrentHashMap hoặc AQS?"

Một người có thể trình bày rõ ràng nguyên lý kỹ thuật ở mức độ nào, bao gồm cả ý tưởng và chi tiết, cho thấy khả năng nắm vững kỹ thuật của người đó mạnh đến đâu.

**Đặt câu hỏi có độ sâu phân tầng và cấp bậc**

Thiết lập ba tầng độ sâu đặt câu hỏi. Mỗi tầng độ sâu có thể tương ứng với một độ sâu kỹ thuật nào đó.

- Câu hỏi thứ nhất ở tầng khái niệm cơ bản, khảo sát khả năng hiểu và độ sâu hiểu biết về khái niệm của ứng viên;
- Câu hỏi thứ hai ở tầng nguyên lý cơ chế, khảo sát độ sâu hiểu biết về nội hàm và ngoại diên của khái niệm;
- Câu hỏi thứ ba ở tầng ứng dụng, khảo sát khả năng ứng dụng và mức độ nhạy bén tư duy của ứng viên.

**Đặt câu hỏi nhảy bậc / đan xen**

Ví dụ, nói đến tra cứu hiệu quả cao bằng hash, có thể nói về thuật toán hash nhất quán (consistent hashing). Hai thứ vừa có liên quan lại vừa có nhiều điểm khác biệt. Đây cũng là một phương pháp khảo sát độ rộng kỹ thuật.

**Đặt câu hỏi tổng kết**

Ví dụ, trong quá trình bạn làm XXX, bạn đã thu được những kinh nghiệm nào có thể chia sẻ? Khảo sát khả năng tổng kết khái quát của ứng viên.

**Kết hợp thực chiến với lý thuyết**

- Ví dụ, sau khi ứng viên trình bày về bố cục mô hình bộ nhớ JVM, có thể hỏi tiếp: có những nguyên nhân nào có thể dẫn đến OOM, có những biện pháp phòng tránh nào? Bạn đã từng gặp vấn đề rò rỉ bộ nhớ chưa? Làm thế nào để truy tìm và giải quyết loại vấn đề này?
- Ví dụ, ứng viên có nói đến tối ưu SQL và tối ưu index, vậy thì vừa hay nói về nguyên lý triển khai của index, làm thế nào để xây dựng index tối ưu nhất?
- Ví dụ, ứng viên có nói đến transaction, vậy thì vừa hay nói về nguyên lý triển khai của transaction, mức độ cô lập (isolation level), cách triển khai snapshot, v.v.;

**Kết hợp phần quen thuộc với phần không quen thuộc**

Hỏi cả phần quen thuộc được ghi trên CV của ứng viên lẫn phần không được ghi ra. Ví dụ CV của ứng viên ghi: quen thuộc mô hình bộ nhớ JVM, vậy tôi khảo sát phần liên quan đến quản lý bộ nhớ (phần quen thuộc), rồi khảo sát thêm các công cụ bất đồng bộ của Java (phần không chắc chắn quen thuộc hay không).

**Kết hợp kiến thức "chết" với kiến thức "sống"**

Ví dụ, các thuật toán tìm kiếm có những loại nào? Tìm kiếm tuần tự, tìm kiếm nhị phân, tìm kiếm hash. Những thứ này mọi người thường đều nói được, cũng là "kiến thức chết".

Mỗi thuật toán tìm kiếm này phù hợp với những tình huống nào? Trong công việc của bạn, có những tình huống nào đã dùng đến thuật toán tìm kiếm nào? Vì sao? Những thứ này mới là "kiến thức sống".

**Gặp phải trong học tập hoặc công việc**

Đôi khi, các vấn đề gặp phải trong học tập và công việc cũng có thể dùng làm câu hỏi phỏng vấn.

Ví dụ, gần đây tôi đang học phần bất đồng bộ của cuốn "Nhập môn hệ điều hành" (Operating Systems: Three Easy Pieces), có một chương nói về cách làm cho cấu trúc dữ liệu an toàn với luồng (thread-safe). Ở đây có vài chỗ có thể đặt câu hỏi: làm thế nào để triển khai một lock? Làm thế nào để triển khai một bộ đếm an toàn với luồng? Làm thế nào để triển khai một linked list an toàn với luồng? Làm thế nào để triển khai một Map an toàn với luồng? Làm thế nào để nâng cao hiệu suất bất đồng bộ?

Các vấn đề gặp phải trong công việc cũng có thể trừu tượng hóa và đúc rút ra, dùng làm câu hỏi phỏng vấn nền tảng kỹ thuật.

**Đặt câu hỏi về mức độ phù hợp tech stack**

Nếu một số công nghệ ứng viên sử dụng (ghi trên CV) khá phù hợp với tech stack của công ty, thì có thể đặt câu hỏi sâu vào các điểm công nghệ này, khảo sát mức độ nắm vững của ứng viên tại các điểm công nghệ này. Nếu mức độ nắm vững tốt, thì mức độ phù hợp kỹ thuật tương đối cao hơn.

Tất nhiên, điểm này không thể dùng làm căn cứ để loại bỏ những ứng viên không dùng tech stack đó. Ví dụ công ty này dùng MongoDB và MySQL, còn một ứng viên chưa từng dùng MongoDB nhưng đã dùng qua nhiều loại hệ thống lưu trữ như MySQL, Redis, ES, HBase, vậy thì mức độ phù hợp không hề thua kém ứng viên chỉ dùng qua MySQL và MongoDB, bởi vì độ rộng công nghệ anh ấy liên quan đến lớn hơn, có thể suy đoán anh ấy có đủ năng lực nắm vững MongoDB.

**Đối phó với phỏng vấn "học vẹt" (backed questions)**

Đầu tiên, phỏng vấn học vẹt cho thấy ứng viên ít nhất cũng có sự chuẩn bị. Tất nhiên, đối với bên tuyển dụng, càng muốn tìm được ứng viên có năng lực chứ không phải chỉ ghi nhớ kiến thức.

Đối phó với phỏng vẹt, có thể thông qua cách "dẫn dắt - hỏi ngang - hỏi sâu", trước tiên hiểu sơ bộ về độ sâu và độ rộng của ứng viên đối với một điểm kiến thức nào đó, sau đó ra một bài tập ứng dụng thực tế để khảo sát xem anh ấy có thể linh hoạt vận dụng kiến thức hay không.

Ví dụ về cơ chế đồng bộ luồng trong Java, có thể ra một bài tập: luồng A thực thi một đoạn code, sau đó tạo một tác vụ bất đồng bộ chạy trong luồng B, luồng A cần chờ luồng B thực thi xong mới có thể tiếp tục, xin hỏi triển khai như thế nào?

Mô hình "lý thuyết + bài tập ứng dụng". Địch biết sự biến đổi của ta, nhưng không biết hình dạng biến đổi của ta. Hình dạng biến đổi, đếm không xuể.

**Thực dụng không hiếm lạ**

Khảo sát kiến thức, kỹ năng và năng lực được sử dụng thường xuyên trong công việc, không khảo sát kiến thức hẻo lánh.

Ví dụ tôi có xu hướng khảo sát ba loại: cấu trúc dữ liệu và thuật toán, bất đồng bộ, thiết kế. Bởi vì ba loại này rất cơ bản và rất cốt lõi.

**Đặt câu hỏi tổng hợp - liên chuỗi**

Các kiến thức luôn liên hệ với nhau, đừng khảo sát một điểm kiến thức một cách riêng lẻ.

Thiết kế một câu hỏi khởi đầu, ví dụ về thuật toán tìm kiếm, sau đó xuất phát từ câu hỏi khởi đầu này, liên chuỗi các điểm kiến thức. Ví dụ:

![](https://oss.javaguide.cn/github/javaguide/open-source-project/502996-20220211115505399-72788909.png)

Tại mỗi điểm kỹ thuật, đều có thể áp dụng các kỹ thuật đặt câu hỏi ở trên để dẫn dắt sang các nhánh câu hỏi khác nhau. Đồng thời khảo sát độ sâu, độ rộng và khả năng ứng dụng của người được phỏng vấn.

**Tạo bộ câu hỏi phỏng vấn mang dấu ấn cá nhân**

Mỗi người phỏng vấn kỹ thuật đều sẽ có một bộ câu hỏi phỏng vấn. Hãy liên tục tích lũy bộ câu hỏi phỏng vấn, những câu hỏi bất chợt nghĩ ra trong cuộc sống hằng ngày, cứ tiện tay ghi lại.

### Khảo sát khả năng giải quyết vấn đề

Chỉ có nền tảng kỹ thuật thôi thì thường vẫn chưa đủ, tốt nhất là kết hợp với nghiệp vụ thực tế, dựa trên nghiệp vụ trong dự án của ứng viên, trừu tượng hóa thành vấn đề kỹ thuật để khảo sát.

Tư duy giải quyết vấn đề trọng ở việc đi từng lớp tiến dần. Điều này cũng đòi hỏi khá cao đối với người phỏng vấn, cần có khả năng lắng nghe tốt, chiều sâu kỹ thuật và kinh nghiệm nghiệp vụ. Trước hết phải lắng nghe kỹ sự trình bày của ứng viên, tìm ra điểm cắt kỹ thuật thích hợp, sau đó mới đặt câu hỏi. Nếu không đi vào được, thì dễ khiến buổi khảo sát thất bại.
Các câu hỏi thường gặp:

- Về hiệu suất, qps, tps bao nhiêu? Đã áp dụng những biện pháp tối ưu nào, đạt được hiệu quả gì?
- Nếu có lượng dữ liệu lớn, xử lý như thế nào? Làm thế nào để đảm bảo độ ổn định?
- Bạn thấy điểm mấu chốt của chức năng/module/hệ thống này nằm ở đâu? Có giải pháp gì?
- Vì sao dùng XXX mà không dùng YYY?
- Trường dài (long field) làm index như thế nào?
- Còn có những giải pháp hoặc ý tưởng nào khác không? Ưu nhược điểm của từng loại?
- Kết nối bên thứ ba, làm thế nào để đối phó với sự không ổn định của interface bên ngoài?
- Kết nối bên thứ ba, kết nối với lượng lớn hệ thống bên ngoài, khả năng bảo trì code như thế nào?
- Tình huống tổn thất tài sản? Tình huống sự cố nghiêm trọng?
- Trên môi trường production xuất hiện CPU tăng vọt, xử lý như thế nào? OOM xử lý như thế nào? IO đọc ghi có gai tăng đột biến, truy tìm như thế nào?
- Trong quá trình vận hành trên production, từng xuất hiện những vấn đề gì? Đã giải quyết như thế nào?
- Vấn đề nhất quán dữ liệu giữa nhiều hệ thống con?
- Nếu cần thêm một yêu cầu XXX, mở rộng như thế nào?
- Làm lại từ đầu, bạn thấy có thể cải tiến ở những khía cạnh nào?

Các câu hỏi liên quan có thể hỏi cho hệ thống:

- Tuyệt đại đa số hệ thống đều có vấn đề liên quan đến hiệu suất. Nếu không có vấn đề hiệu suất, thì chứng tỏ là hệ thống nhỏ, hệ thống nhỏ thì không đáng để khảo sát;
- Hệ thống trung - lớn thường có vấn đề lựa chọn công nghệ (tech selection);
- Tuyệt đại đa số hệ thống đều có không gian cải tiến;
- Hầu hết hệ thống nghiệp vụ đều liên quan đến vấn đề khả năng mở rộng và khả năng bảo trì;
- Hầu hết hệ thống nghiệp vụ quan trọng đều từng trải qua những bài học thảm khốc trên production;
- Hệ thống lượng dữ liệu lớn chắc chắn có vấn đề độ ổn định;
- Hệ thống tiêu thụ (message consumer system) chắc chắn có vấn đề độ trễ và tích đọng (lag & backlog);
- Kết nối hệ thống bên thứ ba chắc chắn liên quan đến vấn đề độ tin cậy;
- Hệ thống phân tán chắc chắn liên quan đến vấn đề tính khả dụng;
- Sự hợp tác của nhiều hệ thống con chắc chắn liên quan đến vấn đề nhất quán dữ liệu;
- Hệ thống giao dịch có tình huống tổn thất tài sản và sự cố;

**Câu hỏi thiết kế**

- Ví dụ nhiều máy chia sẻ một lượng lớn đối tượng nghiệp vụ, giữa các đối tượng nghiệp vụ này có một số trường liên hợp bị trùng lặp, làm thế nào để loại bỏ trùng lặp? Nếu trường tương đối dài, xử lý như thế nào?
- Nếu trong nháy mắt có lượng lớn yêu cầu tràn vào, làm thế nào để đảm bảo độ ổn định của máy chủ?
- Cấp component: thiết kế một local cache? Thiết kế một distributed cache?
- Cấp module: thiết kế một module lập lịch tác vụ (task scheduling)? Cần cân nhắc những yếu tố gì?
- Cấp hệ thống: thiết kế một hệ thống nội bộ, thu thập dữ liệu bán hàng từ các phòng ban khác nhau rồi thống kê thành báo cáo. Tính phức tạp thể hiện ở đâu? Các thuộc tính chất lượng then chốt là gì? Phân chia module, mối quan hệ liên kết giữa các module? Lựa chọn công nghệ?

**Kinh nghiệm dự án**

Không nên khảo sát trên quá hai dự án. Bởi vì để đào sâu chi tiết một dự án, thời gian chiếm dụng khá lớn.

Thông thường, sẽ để ứng viên chọn một dự án mà anh/cô ấy cảm thấy thu được nhiều nhất / mang tính thử thách nhất / ấn tượng sâu sắc nhất / tự thấy đặc biệt thú vị / cảm nhận được sự thất bại. Sau đó xoay quanh dự án đó để đặt câu hỏi. Thường bắt đầu từ bối cảnh của dự án, khảo sát tech stack của dự án, sự hiểu biết tổng thể về các module và tương tác trong dự án, các vấn đề kỹ thuật đầy thử thách gặp phải trong dự án và giải pháp, truy tìm và giải quyết vấn đề, vấn đề khả năng bảo trì code, đảm bảo chất lượng công trình, làm lại từ đầu có thể cải tiến những gì, v.v.

## Quy trình phỏng vấn

### Chuẩn bị trước

Người phỏng vấn cũng cần làm một số chuẩn bị. Ví dụ nắm rõ thế mạnh kỹ năng, kinh nghiệm công việc của ứng viên, thiết kế một kịch bản phỏng vấn.

Khi sắp bắt đầu phỏng vấn, hãy chuẩn bị tốt. Ngoài ra, người phỏng vấn cũng cần hiểu biết về một số tình hình cơ bản của công ty, đặc biệt là tech stack công ty đang dùng, bức tranh toàn cảnh và định hướng nghiệp vụ, nội dung công việc, chế độ thăng tiến, v.v., điểm này ứng viên theo hướng kỹ thuật hỏi khá nhiều.

### Khởi động phỏng vấn

Thông thường bắt đầu bằng phần tự giới thiệu của ứng viên, tuy nhiên ứng viên thường hay nói khá lan man, vì vậy, tôi sẽ hỏi thẳng: Hãy nói về những thế mạnh của bạn cũng như những điểm bạn tự thấy có thể cải thiện?

Sau đó dùng một câu hỏi nền tảng tương đối đơn giản làm khởi đầu cho phần hỏi kỹ thuật: Bạn quen thuộc với những thuật toán tìm kiếm nào? Đa số mọi người đều trả lời được tìm kiếm tuần tự, tìm kiếm nhị phân, tìm kiếm hash.

### Thiết kế câu hỏi

Đọc trước CV của ứng viên, lọc ra các từ khóa từ CV, dựa trên các từ khóa này để thiết kế câu hỏi có chủ đích.

Ví dụ CV của ứng viên nhắc đến MVVM, có thể hỏi sự khác biệt giữa MVVM và MVC; nhắc đến observer pattern, có thể nói về observer pattern, rồi tiện thể hỏi anh ấy còn quen thuộc những design pattern nào khác.

Có thể tuân theo nguyên tắc "thế mạnh - chuẩn hóa - ngẫu nhiên":

- Trước tiên, hỏi anh ấy quan tâm đến công nghệ nào, đầu tư nhiều vào lĩnh vực nào (phần thế mạnh), dựa trên phần thế mạnh đó, trình bày nguyên lý và ứng dụng thực chiến;
- Thứ hai, hỏi một số câu hỏi chuẩn hóa, xem khả năng hiểu nguyên lý, ứng dụng thực chiến của anh ấy ra sao;
- Cuối cùng, ngẫu nhiên chọn một câu hỏi, xem khả năng hiểu nguyên lý, ứng dụng thực chiến của anh ấy ra sao;

Đối với dự án cũng có thể làm tương tự:

- Trước tiên, hỏi về dự án có cảm giác thành tựu lớn nhất của anh ấy, tech stack, module và mối liên quan, lựa chọn công nghệ, các vấn đề thiết kế mấu chốt, giải pháp, chi tiết triển khai, không gian cải tiến;
- Thứ hai, hỏi về dự án có cảm giác thất bại của anh ấy, vấn đề nằm ở đâu, đã nỗ lực gì, cải tiến như thế nào;

### Bầu không khí thoải mái

Dù có hỏi nhiều câu và câu hỏi khó, cũng phải chú ý giữ bầu không khí thoải mái.

Trước buổi phỏng vấn, có thể đùa vui một chút dựa trên thông tin cơ bản của ứng viên, ví dụ một ứng viên tên là Uông Khuê, tôi sẽ nói: trước đây đội chúng tôi có một anh tên là Viên Khuê, cả đội đều gọi anh ấy là Khuê gia.

Trong quá trình phỏng vấn, nhắc nhở một cách phù hợp, hoặc đưa ra một chút quan điểm của riêng mình, cũng có thể làm dịu bớt sự căng thẳng của ứng viên.

### Biết lắng nghe

Hỏi nhiều nói ít, để ứng viên thể hiện nhiều hơn. Dựa theo câu trả lời của ứng viên để dẫn dắt hoặc đi sâu hoặc mở rộng ngang một cách phù hợp.

Dẫn dắt ứng viên thể hiện khía cạnh mạnh nhất của họ, để anh/cô ấy cảm thấy tốt hơn: dù sao một buổi phỏng vấn cả hai bên đều bỏ ra thời gian và công sức, không nên là nơi để người phỏng vấn "diss" ứng viên, mà nên để hai bên có sự giao lưu tốt hơn. Rất có thể, bạn cũng sẽ học được không ít thứ từ ứng viên.

Phỏng vấn chẳng qua chỉ là hai bên có vai trò và lập trường khác nhau, nhưng không có nghĩa là trình độ của người phỏng vấn nhất định cao hơn ứng viên.

### Ghi lại trọng điểm

Ghi chép lại câu trả lời của ứng viên một cách nghiêm túc và khách quan, hết sức tránh bất kỳ đánh giá chủ quan nào, cũng không làm bất kỳ sự gia công nào (ví dụ tự mình tổng kết lại giúp ứng viên, bởi vì khả năng tổng kết cũng là một đặc điểm của ứng viên).

### Luyện tập nhiều

Mô phỏng phỏng vấn.

### Đưa ra phán đoán

Quá trình phỏng vấn là một sự đệm cho, điều then chốt là đưa ra phán đoán.

Cạm bẫy dễ vướng nhất khi đưa ra phán đoán là: tham lam yêu cầu sâu mà toàn diện. Luôn hy vọng kỹ thuật của ứng viên vừa sâu vừa toàn diện. Trên thực tế, đây là một sự xa xỉ. Nếu kỹ năng kỹ thuật của ứng viên vừa sâu vừa toàn diện, rất có thể cũng sẽ đối mặt với hai tình huống: 1. ứng viên có lựa chọn tốt hơn; 2. ứng viên có thể có khiếm khuyết ở các khía cạnh khác, ví dụ hợp tác đội nhóm.

Một thước đo tương đối phù hợp là: 1. Trình độ kỹ thuật của anh/cô ấy có đủ sức đảm đương công việc hiện tại không; 2. Trình độ kỹ thuật của anh/cô ấy so với trình độ của các thành viên trong cùng đội như thế nào; 3. Trình độ kỹ thuật của anh/cô ấy có tương đối khớp với số năm kinh nghiệm không, có tiềm năng đảm đương những nhiệm vụ phức tạp hơn không.

### Ở các độ tuổi khác nhau, điều coi trọng là khác nhau

Đối với kỹ sư dưới ba năm, nên coi trọng hơn nền tảng kỹ thuật của họ, bởi vì điều đó thể hiện tiềm năng tương lai của họ; đồng thời cũng khảo sát sự thể hiện của họ trong phát triển thực tế, như hợp tác đội nhóm, kinh nghiệm nghiệp vụ, khả năng chịu áp lực, nhiệt huyết và năng lực chủ động học tập, v.v.

Đối với kỹ sư trên ba năm, nên coi trọng hơn kinh nghiệm nghiệp vụ và khả năng giải quyết vấn đề của họ, xem anh/cô ấy phân tích vấn đề cụ thể như thế nào, khảo sát độ sâu và độ rộng của nền tảng kỹ thuật trong phạm vi nghiệp vụ.

Làm thế nào để phán đoán trình độ kỹ thuật thực sự của một ứng viên và liệu có phù hợp với nhu cầu hay không, về phương diện này, tôi cũng đang trong quá trình học hỏi.

## Mới bắt đầu làm người phỏng vấn

- Chuẩn bị sẵn camera và audio từ trước, có thể dùng tai nghe để kiểm tra thử.
- Đọc trước CV của ứng viên, lọc ra từ khóa mấu chốt, chuẩn bị sẵn vài câu hỏi cơ bản.
- Hỏi nhiều câu hỏi nền tảng kỹ thuật, rèn luyện cảm giác phỏng vấn.
- Hỏi sâu một cách phù hợp về nguyên lý và cách triển khai.
- Nếu CV của ứng viên có điểm nổi bật, hãy hỏi phần đó trước; nếu không, để ứng viên giới thiệu bối cảnh dự án, dựa theo bối cảnh và kinh nghiệm dự án để đặt câu hỏi.
- Luyện tập ít một kỹ thuật "hỏi liên tiếp", cho đến khi sử dụng thành thạo.
- Tập trung khảo sát khả năng phân tích và giải quyết vấn đề, nếu cần thiết, có thể ra một bài tập lập trình.
- Dành thời gian cho đối phương hỏi: Bạn có điều gì muốn hỏi không? Và thông báo cho họ biết kết quả phỏng vấn trong vòng ba ngày làm việc.

## Khảo sát hiệu quả

Khi đã có mức độ quen thuộc nhất định với vai trò người phỏng vấn kỹ thuật, thì cần nâng cao hiệu quả phỏng vấn. Tức là: trong thời gian ít hơn vẫn khảo sát hiệu quả được độ sâu và độ rộng kỹ thuật của ứng viên. Có thể chuẩn bị sẵn một số câu hỏi thường gặp, dùng làm bài kiểm tra chuẩn hóa.

Ví dụ tôi thích khảo sát các chủ đề con như quản lý bộ nhớ và thuật toán, index cơ sở dữ liệu, cache, bất đồng bộ, thiết kế hệ thống, phân tích vấn đề và tư duy phản biện, v.v.

- Bạn quen thuộc với những cấu trúc dữ liệu và thuật toán nào dùng để tìm kiếm? Hãy chọn một cái và trình bày ý tưởng cùng những điểm bạn thấy thú vị.
- Nếu chạy đến một phương thức Java, bên trong tạo một danh sách đối tượng, bộ nhớ được phân bổ như thế nào? Khi nào có thể dẫn đến tràn stack (stack overflow)? Khi nào có thể dẫn đến OOM? Có những nguyên nhân nào dẫn đến OOM? Làm thế nào để tránh? Trên production từng gặp OOM chưa, đã giải quyết như thế nào?
- Thuật toán thu gom rác phân thế (generational garbage collection) của Java như thế nào? Trong dự án chọn loại garbage collector nào? Vì sao chọn cái này mà không phải cái kia?
- Các công cụ bất đồng bộ của Java có những loại nào? Các công cụ khác nhau phù hợp với những tình huống nào?
- Nguyên lý triển khai của lớp nguyên tử `Atomic`? Nguyên lý triển khai của `ConcurrentHashMap`?
- Làm thế nào để triển khai một lock tái nhập (reentrant lock)?
- Lấy một ví dụ trong dự án, những trường nào đã dùng index? Vì sao lại là những trường này? Bạn thấy còn không gian tối ưu nào nữa không? Làm thế nào để xây dựng một index tốt?
- Các tham số có thể cấu hình của cache là những gì? Ảnh hưởng tương ứng của từng tham số là gì?
- Các chiến lược hết hạn (expiration) của Redis có những loại nào? Làm thế nào để chọn chiến lược hết hạn của redis?
- Làm thế nào để triển khai loại trừ trùng lặp (dedupe) cho tác vụ phát hiện file virus?
- Bạn quen thuộc với những design pattern và nguyên tắc thiết kế nào?
- Xây dựng một module/hệ thống hoàn chỉnh từ 0 đến 1? Bạn bắt đầu như thế nào?

Nếu ứng viên không trả lời được, có thể hỏi: Nếu để bạn thiết kế một XXX như thế này, bạn sẽ làm thế nào?

Phân bổ thời gian khoảng: nền tảng kỹ thuật (25-30 phút) + dự án (20-25 phút) + ứng viên đặt câu hỏi (5-10 phút)

## Lời nhắn gửi đến ứng viên

**Vì sao ứng viên cần quan tâm đến nền tảng kỹ thuật**

Một thắc mắc phổ biến là: khi phát triển hệ thống nghiệp vụ, phần lớn thời gian về cơ bản không liên quan đến việc thiết kế và triển khai cấu trúc dữ liệu và thuật toán, vậy vì sao phải khảo sát nguyên lý triển khai của `HashMap`? Vì sao phải học tốt những môn nền tảng như cấu trúc dữ liệu và thuật toán, hệ điều hành, truyền thông mạng?

Giờ tôi có thể đưa ra một câu trả lời rồi:

- Như đã nói ở trên, tuyệt đại đa số vấn đề nghiệp vụ, trên thực tế cuối cùng đều sẽ ánh xạ về các vấn đề kỹ thuật nền tảng: triển khai cấu trúc dữ liệu và thuật toán, quản lý bộ nhớ, kiểm soát bất đồng bộ, truyền thông mạng, v.v.; đây là nền móng để hiểu các chương trình quy mô lớn của Internet hiện đại cũng như giải quyết các vấn đề nan giải của chương trình, — trừ khi bạn có thể cầu chúc cho bản thân mình sẽ không bao giờ gặp phải vấn đề nan giải, mãi mãi chỉ thỏa mãn với việc viết CRUD;
- Những nền tảng kỹ thuật này chính là nơi thú vị và hấp dẫn nhất trong thế giới chương trình. Nếu không hứng thú với những thứ này, rất khó để đi sâu vào lĩnh vực này, không bằng sớm chuyển ngành làm nghề khác, thế giới phi kỹ thuật luôn rực rỡ và rộng lớn (đôi khi tôi cũng muốn ra ngoài đi nhiều hơn, không muốn giới hạn mình trong thế giới kỹ thuật);
- Nền tảng kỹ thuật là nội công của lập trình viên, còn kỹ thuật cụ thể là chiêu thức. Chỉ có chiêu thức mà nội công không sâu, khi gặp cao thủ (sự cạnh tranh của những người làm cùng ngành xuất sắc và những ca nan giải) dễ tan tác ngay;
- Có nền tảng kỹ thuật vững chắc, trần nhà (upper bound) đạt được càng cao, tương lai càng có khả năng đảm đương việc giải quyết các vấn đề kỹ thuật phức tạp, hoặc trên cùng một vấn đề có thể đưa ra giải pháp tốt hơn;
- Con người thích hợp tác với những người giống mình, người giỏi có xu hướng hợp tác với người giỏi để đạt hiệu quả tốt hơn; nếu đa số thành viên trong một đội có nền tảng kỹ thuật tốt, thì một người bước vào có nền tảng kỹ thuật yếu hơn, chi phí phối hợp sẽ tăng lên; nếu bạn muốn cùng hợp tác với người giỏi để đạt kết quả tốt hơn, thì phải làm sao cho bản thân ít nhất về mặt nền tảng kỹ thuật có thể bắt nhịp được với người giỏi;
- Mở rộng các tài năng khác trên nền tảng CRUD cũng không hẳn là một lựa chọn tồi, nhưng đó sẽ không phải là tư thái của một lập trình viên thực thụ, chí ít cũng chỉ là nhân tài của các vị trí khác như product manager, project manager, HR, vận hành, CSKH có nền tảng kỹ thuật. Đây là vấn đề lựa chọn nghề nghiệp, đã vượt ra ngoài phạm vi khảo sát lập trình viên.

**Đừng để bụng nếu có câu hỏi nào đó không trả lời được**

Nếu người phỏng vấn hỏi bạn nhiều câu, mà có vài câu không trả lời được, đừng để bụng. Người phỏng vấn rất có thể chỉ đang kiểm tra độ sâu và độ rộng kỹ thuật của bạn, rồi phán đoán xem bạn có đạt đến một mức "mực nước" nào đó hay không.

Trọng điểm là: những câu hỏi bạn trả lời có chiều sâu, cũng thể hiện khả năng tư duy sâu sắc của bạn.

Điểm này tôi phải đến khi làm người phỏng vấn kỹ thuật mới lĩnh hội được. Tất nhiên, không phải mọi người phỏng vấn kỹ thuật đều nghĩ như vậy, nhưng tôi thấy đây nên là một cách phù hợp hơn.

## Tài liệu tham khảo

- [9 sai lầm lớn của người phỏng vấn kỹ thuật](https://zhuanlan.zhihu.com/p/51404304)
- [Làm thế nào để trở thành một người phỏng vấn tốt?](https://www.zhihu.com/question/26240321)

<!-- @include: @article-footer.snippet.md -->
