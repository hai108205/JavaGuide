---
title: "Giải thích chi tiết về bộ nhớ ảo: chuyển đổi địa chỉ, TLB, lỗi trang và hoán đổi trang"
description: "Tổng hợp câu hỏi phỏng vấn tần suất cao về bộ nhớ ảo, bắt đầu từ việc cô lập tiến trình, trình bày rõ phân đoạn, phân trang, bảng trang đa cấp, TLB, lỗi trang, thuật toán hoán đổi trang, dị thường Belady cũng như các kịch bản kỹ thuật như mmap, COW, HugePage của JVM."
category: Kiến thức cơ bản máy tính
tag:
  - Hệ điều hành
  - Quản lý bộ nhớ
head:
  - - meta
    - name: keywords
      content: bộ nhớ ảo,địa chỉ ảo,địa chỉ vật lý,MMU,bảng trang,bảng trang đa cấp,TLB,lỗi trang,ngắt lỗi trang,thuật toán hoán đổi trang,thuật toán CLOCK,dị thường Belady,mmap,COW,câu hỏi phỏng vấn hệ điều hành
---

Khi mở Task Manager, bạn có thể thấy một hiện tượng khá phản trực giác: mỗi tiến trình đều như đang nắm một mảng "bộ nhớ riêng" rất lớn, một số địa chỉ trong các tiến trình trông có vẻ gần giống nhau, nhưng chúng không hề ảnh hưởng lẫn nhau. Trình duyệt, IDE, cơ sở dữ liệu chạy đồng thời, ai cũng nghĩ mình có một không gian riêng, liên tục, sạch sẽ, độc quyền.

Điều này không phải vì các chương trình tin tưởng lẫn nhau, mà vì hệ điều hành đã thêm một lớp "dịch" ở giữa.

Chương trình nhìn thấy là địa chỉ ảo, còn vị trí thực sự nằm trên thanh RAM được quyết định bởi nhân và phần cứng cùng nhau. Điều mà bộ nhớ ảo muốn trình bày, chính là lớp dịch này được thực hiện như thế nào, vì sao tiến trình có thể được cô lập, và khi bộ nhớ không đủ thì làm sao để chuyển một phần dữ liệu xuống đĩa trước.

## Nếu không có bộ nhớ ảo thì sao?

Hãy xem một phản ví dụ trước.

Nhiều người đã từng chơi vi điều khiển (microcontroller) ở trường đại học. Trên vi điều khiển không có hệ điều hành phức tạp, CPU trực tiếp thao tác trên địa chỉ vật lý. Trong môi trường này, nếu muốn chạy đồng thời hai chương trình, rắc rối ngay lập tức xuất hiện: chương trình thứ nhất ghi một giá trị vào địa chỉ 2000, chương trình thứ hai cũng vừa vặn đặt dữ liệu ở 2000, lần ghi đó đã ghi đè dữ liệu của đối phương, cả hai chương trình cùng gặp sự cố.

Nguyên nhân cũng không phức tạp: cả hai chương trình đều trực tiếp tham chiếu đến cùng một bộ địa chỉ vật lý, không ai tránh được ai.

Cách làm của hệ điều hành là thêm một lớp cô lập: phát cho mỗi tiến trình một bộ "địa chỉ ảo" độc lập. Tiến trình chỉ giao tiếp với địa chỉ ảo của chính mình, địa chỉ này cuối cùng rơi vào vùng bộ nhớ vật lý nào, tiến trình không cần biết, hệ điều hành sẽ sắp xếp thống nhất.

Từ đó xuất hiện hai khái niệm:

- Địa chỉ dùng trong chương trình, gọi là **Địa chỉ ảo (Virtual Address)**.
- Địa chỉ thực sự nằm trên RAM, gọi là **Địa chỉ vật lý (Physical Address)**.

Khi tiến trình truy cập địa chỉ ảo, bộ quản lý bộ nhớ (MMU) trong CPU sẽ dựa trên quan hệ ánh xạ để dịch nó thành địa chỉ vật lý rồi mới truy cập bộ nhớ. Dù các địa chỉ ảo mà các tiến trình khác nhau ghi ra có giá trị giống nhau, thì địa chỉ vật lý mà chúng ánh xạ tới cũng có thể hoàn toàn khác nhau, tự nhiên sẽ không xung đột.

![Quá trình ánh xạ từ địa chỉ ảo sang địa chỉ vật lý: địa chỉ ảo giống nhau của các tiến trình khác nhau được ánh xạ tới các trang vật lý khác nhau qua MMU và bảng trang](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-virtual-physical-mapping.png)

Chúng ta có thể quy lợi ích của bộ nhớ ảo thành ba điểm, toàn bộ bài viết phía sau thực chất đều xoay quanh chúng:

- **Cô lập tiến trình**: mỗi tiến trình có một bảng trang riêng, không nhìn thấy được bộ nhớ vật lý của nhau, tiến trình A không thể dựa vào một địa chỉ để trực tiếp chạm vào dữ liệu của tiến trình B.
- **Vượt qua giới hạn kích thước bộ nhớ vật lý**: chương trình có tính cục bộ (locality), những trang tạm thời không dùng đến có thể được đưa xuống đĩa trước, khi cần lại đưa về, nên bộ nhớ mà tiến trình "cảm nhận được" có thể lớn hơn bộ nhớ vật lý.
- **Không gian địa chỉ thống nhất và liên tục**: tiến trình nhìn thấy một vùng địa chỉ ảo liên tục trọn vẹn, nhưng về mặt vật lý lại có thể nằm rải rác đông một mảnh, tây một mảnh. Việc ghép nối này được giao cho bảng ánh xạ.

Vấn đề quan trọng nhất tiếp theo chỉ có một: **địa chỉ ảo sang địa chỉ vật lý, rốt cuộc ánh xạ bằng cách nào?**

Có hai cách chủ yếu: **phân đoạn và phân trang**.

## Phân đoạn ánh xạ như thế nào?

Phân đoạn (Segmentation) xuất hiện khá sớm, cách tư duy cũng hợp trực giác của lập trình viên. Một chương trình vốn được tạo thành từ mã, dữ liệu, ngăn xếp, heap... những phần này có quyền truy cập và vòng đời khác nhau, vậy hãy cắt thành nhiều đoạn theo logic.

Dưới phân đoạn, địa chỉ ảo gồm hai phần: **bộ chọn đoạn (segment selector) và phần bù trong đoạn (offset)**.

Bộ chọn đoạn được đặt trong thanh ghi đoạn, phần quan trọng nhất bên trong là số hiệu đoạn, dùng làm chỉ số của bảng đoạn. Bảng đoạn ghi lại địa chỉ cơ sở của đoạn, giới hạn đoạn (đoạn dài bao nhiêu) và mức đặc quyền.

Quá trình dịch cũng không phức tạp: lấy số hiệu đoạn tra trong bảng đoạn để tìm địa chỉ cơ sở của đoạn, rồi kiểm tra xem phần bù trong đoạn có vượt quá giới hạn đoạn hay không. Trong mô hình chỉ dùng phân đoạn, không bật phân trang, thì địa chỉ cơ sở cộng với phần bù chính là địa chỉ vật lý. Ví dụ cần truy cập địa chỉ của đoạn 3, offset 500, địa chỉ cơ sở của đoạn 3 là 7000, thì địa chỉ vật lý là 7000 + 500 = 7500; nếu hệ thống còn bật phân trang, thì bước này thu được địa chỉ tuyến tính, còn phải trải qua chuyển đổi bảng trang nữa.

![Sơ đồ chuyển đổi địa chỉ phân đoạn: địa chỉ ảo gồm số hiệu đoạn và offset trong đoạn, tìm địa chỉ cơ sở qua bảng đoạn rồi tính địa chỉ vật lý](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-segmentation.png)

Phân đoạn giải quyết vấn đề "chương trình không cần quan tâm địa chỉ vật lý", nhưng nó cũng để lại hai cái hố.

**Đầu tiên là phân mảnh ngoài (external fragmentation)**. Chiều dài của mỗi đoạn không cố định, giữa các đoạn với nhau rất dễ chừa lại những khoảng trống lắt nhắt. Ví dụ, trong bộ nhớ vật lý lần lượt đặt bốn đoạn: A chiếm 256 MB, B chiếm 128 MB, C chiếm 256 MB, D chiếm 128 MB. Bây giờ giải phóng B và D, tổng dung lượng trống có 256 MB, nhưng nó bị C ngăn cách thành hai khối 128 MB. Lúc này muốn đặt thêm một đoạn liên tục 200 MB thì không đặt nổi. Tổng dung lượng đủ, nhưng không gian liên tục không đủ.

**Thứ hai là chi phí dọn dẹp phân mảnh cao**. Muốn gom những khoảng trống rời rạc này thành một khối duy nhất, phải nén bộ nhớ (memory compaction): di chuyển các đoạn đang dùng, sắp xếp lại thành không gian liên tục. Nếu quá trình di chuyển còn kèm theo việc hoán đổi đoạn ra Swap trên đĩa rồi hoán đổi lại, thì sẽ phát sinh thêm một đống I/O đĩa. Dù làm cách nào, việc di chuyển đoạn với độ hạt lớn như vậy đều rất nặng nề, gặp phải đoạn lớn thì hệ thống rất dễ bị nghẽn.

Vấn đề của đoạn kẹt ở chỗ đây: hạt lớn, chiều dài không cố định, phân mảnh và chi phí dọn dẹp đều khó kiểm soát.

## Còn phân trang ánh xạ như thế nào?

Phân trang (Paging) đổi cách: không cắt theo logic mã, dữ liệu, ngăn xếp, mà cắt cả không gian địa chỉ ảo lẫn không gian địa chỉ vật lý thành những khối nhỏ có kích thước cố định, mỗi khối gọi là một trang (Page). Trong Linux, một trang mặc định là 4 KB.

Địa chỉ ảo sang địa chỉ vật lý dựa vào bảng trang (Page Table) ánh xạ. Bảng trang nằm trong bộ nhớ, MMU chịu trách nhiệm tra bảng để dịch. Chuyển đổi địa chỉ thường gồm ba bước:

- Tách địa chỉ ảo thành số hiệu trang và phần bù trong trang;
- Dùng số hiệu trang tra trong bảng trang để tìm ra số hiệu trang vật lý tương ứng;
- Ghép số hiệu trang vật lý với phần bù trong trang, thu được địa chỉ vật lý cuối cùng.

![Sơ đồ chuyển đổi địa chỉ phân trang: địa chỉ ảo được tách thành số hiệu trang và phần bù trong trang, bảng trang ánh xạ trang ảo sang khung trang vật lý](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-paging.png)

Phân trang giải quyết khuyết điểm của phân đoạn ra sao?

Kích thước trang cố định, trang vật lý cũng được quản lý theo hạt cố định, sẽ không như đoạn có độ dài thay đổi để lại những khoảng trống kỳ lạ giữa các đoạn, nên về cơ bản **loại bỏ được phân mảnh ngoài**. Cái giá phải trả là có thể lãng phí trong trang: một chương trình dù chỉ dùng vài byte cũng phải chiếm trọn một trang, phần này gọi là **phân mảnh trong (internal fragmentation)**. Tuy nhiên sự lãng phí này thường vẫn nằm trong tầm kiểm soát, dễ xử lý hơn phân mảnh ngoài.

Độ hạt quản lý cũng nhỏ lại. Khi bộ nhớ vật lý không đủ, hệ điều hành có thể chọn những trang "lâu rồi không dùng" để hoán đổi ra đĩa (Swap Out), khi cần thì hoán đổi vào (Swap In). Đơn vị điều phối vào/ra, từ một đoạn nguyên khối có độ dài thay đổi, thu nhỏ lại thành trang có kích thước cố định.

Đừng hiểu lầm, phân trang không có nghĩa áp lực lên đĩa nhất định sẽ nhỏ. Nếu thật sự gặp nhiều lỗi trang chính (major page fault) hoặc hiện tượng thrashing, thì I/O cấp trang diễn ra dày đặc vẫn có thể làm hệ thống suy sụp.

Phân trang còn có một điểm rất thực dụng: chương trình không cần phải nạp toàn bộ vào bộ nhớ một lần. Trước tiên chuẩn bị mối quan hệ ánh xạ giữa trang ảo và trang vật lý, nhưng không vội đem trang thật sự chuyển vào bộ nhớ vật lý. Đợi khi chương trình truy cập đến trang ảo nào đó, mới nạp nó vào. Đây chính là nền tảng của phân trang theo nhu cầu (Demand Paging).

## Phân đoạn kết hợp phân trang: cả hai thực sự có thể gộp lại

Phân đoạn và phân trang không nhất thiết chỉ chọn một, cũng có thể kết hợp dùng chung, đó là **quản lý bộ nhớ đoạn-trang (segment-paging)**.

Cách làm là phân đoạn trước rồi phân trang sau: trước tiên cắt chương trình thành các đoạn có ý nghĩa logic, rồi cắt mỗi đoạn thành các trang có kích thước cố định. Địa chỉ cũng biến thành ba phần: số hiệu đoạn, số hiệu trang trong đoạn, phần bù trong trang. Mỗi chương trình có một bảng đoạn, mỗi đoạn treo thêm một bảng trang, phần tử trong bảng đoạn lưu địa chỉ bắt đầu của bảng trang tương ứng với đoạn đó.

Khuyết điểm cũng rất dễ hiểu: số lần truy cập bộ nhớ tăng lên. Một lần chuyển đổi địa chỉ theo kiểu đoạn-trang phải đi qua bộ nhớ ba lượt:

1. Lượt thứ nhất tra bảng đoạn để lấy địa chỉ bắt đầu của bảng trang;
2. Lượt thứ hai tra bảng trang để lấy số hiệu trang vật lý;
3. Lượt thứ ba mới dùng số hiệu trang vật lý cộng với phần bù trong trang để truy cập dữ liệu thật sự.

Chèn thêm một đoạn lịch sử ở đây, có thể giải thích vì sao Linux trông như "vừa phân đoạn vừa phân trang". Intel bắt đầu dùng quản lý phân đoạn từ 80286, đến 80386 bổ sung thêm quản lý phân trang, nhưng phân trang được xây dựng trên nền phân đoạn: địa chỉ logic trước tiên qua phân đoạn biến thành địa chỉ tuyến tính, tức là địa chỉ ảo thường nói; địa chỉ tuyến tính rồi qua phân trang biến thành địa chỉ vật lý. Phần cứng CPU thiết kế như vậy, Linux chỉ có thể phối hợp.

32-bit x86 Linux thường dùng mô hình bộ nhớ phẳng (flat memory model), để địa chỉ cơ sở của phân đoạn mã và phân đoạn dữ liệu chính bằng 0, địa chỉ logic và địa chỉ tuyến tính có giá trị bằng nhau, việc quản lý bộ nhớ chủ yếu giao cho phân trang. Đến chế độ dài (long mode) x86-64, vai trò phân đoạn của CS、SS、DS、ES về cơ bản bị suy yếu, nhưng FS và GS vẫn có thể dùng địa chỉ cơ sở khác 0, thường được dùng cho bộ nhớ cục bộ thread (thread local storage) và dữ liệu per-CPU của nhân.

## Vì sao bảng trang một cấp không đủ dùng?

Khi phân trang rơi vào hệ thống thực, điều gặp phải đầu tiên không phải là vấn đề tư duy, mà là vấn đề không gian.

Tính một phép toán. Trong môi trường 32 bit, không gian địa chỉ ảo là 4 GB, kích thước trang 4 KB (2^12), thì một tiến trình có khoảng 1 triệu (2^20) trang. Mỗi phần tử bảng trang chiếm 4 byte, cả bảng trang là 4 × 2^20 = 4 MB.

4 MB nhìn thì còn ổn, nhưng đừng quên, **mỗi tiến trình đều có bảng trang riêng**. 100 tiến trình tức là 400 MB bộ nhớ chỉ để lưu bảng trang. Đến môi trường 64 bit, sẽ còn quá đáng hơn.

Khó chịu hơn nữa là, bảng trang một cấp phải trải đầy toàn bộ không gian địa chỉ ảo một lần. Công việc của bảng trang là dịch địa chỉ, nếu một địa chỉ ảo nào đó không có vị trí để tra trong bảng trang thì đường dịch bị đứt. Nên dù tiến trình thực tế chỉ dùng một vùng địa chỉ nhỏ xíu, thì 1 triệu phần tử bảng trang kia cũng phải được tạo ra trước, đại đa số còn là trống rỗng.

Điều đó quá lãng phí.

## Bảng trang đa cấp tiết kiệm không gian thế nào?

Cách ra tay của bảng trang đa cấp (Multi-Level Page Table) rất thẳng thắn: **chỉ xây bảng trang cấp dưới cho những địa chỉ thật sự được dùng, không dùng thì không xây.**

Vẫn là bối cảnh 32 bit, trang 4 KB. Chia hơn 1 triệu phần tử bảng trang thêm một tầng nữa: bảng trang cấp một (page directory) có 1024 phần tử, mỗi phần tử trỏ tới một bảng trang cấp hai, mỗi bảng trang cấp hai cũng có 1024 phần tử. 1024 × 1024 vừa vặn bao phủ hơn 1 triệu phần tử bảng trang kia.

Bạn có thể sẽ phản bác ngay: chẳng phải là thêm một tầng sao? Bảng cấp một 4 KB, cộng thêm bảng cấp hai 4 MB, chẳng phải sẽ tốn hơn à?

Nếu thật sự ánh xạ đầy 4 GB địa chỉ ảo, quả nhiên tốn hơn. Nhưng trong thực tế, một tiến trình thường không dùng hết 4 GB. Điểm mấu chốt nằm ở đây: bảng trang cấp một phải thường trú, nó bao phủ toàn bộ không gian địa chỉ, nhưng chỉ chiếm 4 KB; bảng trang cấp hai được tạo theo nhu cầu, một phần tử cấp một không được dùng thì bảng cấp hai tương ứng không cần xây.

Tính một con số. Giả sử chỉ có 20% phần tử cấp một được dùng, thì tổng chi phí bảng trang là 4 KB (cấp một) + 20% × 4 MB (cấp hai) ≈ 0,804 MB. So với bảng trang một cấp 4 MB, tiết kiệm được rõ ràng. Bộ nhớ tiết kiệm được ở đây, dựa vào nguyên lý cục bộ: trong một khoảng thời gian, chương trình thường chỉ truy cập một vùng nhỏ trong không gian địa chỉ.

Sang 64 bit, hai cấp không đủ. Cấu trúc trừu tượng bảng trang thông dụng của Linux hiện tại là năm cấp, tính từ trên xuống:

- Thư mục trang toàn cục PGD (Page Global Directory)
- Thư mục cấp bốn P4D (Page 4th Directory)
- Thư mục trang trên PUD (Page Upper Directory)
- Thư mục trang giữa PMD (Page Middle Directory)
- Phần tử bảng trang PTE (Page Table Entry)

![Sơ đồ bảng trang đa cấp: PGD、PUD、PMD、PTE lập chỉ mục theo tầng, chỉ tạo bảng trang cấp dưới cho phạm vi địa chỉ thực sự được dùng](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-multi-level-page-table.png)

Trên x86-64 chỉ dùng phân trang phần cứng bốn cấp, tầng P4D sẽ bị "gấp" đi (folded), không thực sự tham gia chuyển đổi địa chỉ. Nên cái câu bạn hay nghe "bảng trang bốn cấp", nói về dạng sau khi gấp, không phải Linux chỉ định nghĩa có bốn cấp.

Cụ thể với x86-64, hiện tại chủ đạo là phân trang bốn cấp, dùng địa chỉ ảo 48 bit (định vị 256 TB). Một địa chỉ ảo 64 bit thường được tách như sau: 16 bit cao là bit mở rộng dấu, tiếp theo PGD、PUD、PMD、PTE mỗi tầng chiếm 9 bit (mỗi cấp 512 phần tử, 2^9), 12 bit thấp nhất là phần bù trong trang (tương ứng trang 4 KB). Mỗi phần tử bảng trang 8 byte, 512 phần tử × 8 byte = 4 KB, mỗi cấp bảng trang vừa vặn chiếm trọn một trang.

Khi cần không gian địa chỉ lớn hơn, x86-64 cung cấp phân trang năm cấp (LA57), mở rộng địa chỉ tuyến tính chuẩn từ 48 bit lên 57 bit, địa chỉ vật lý tối đa 52 bit. Ở đây đừng nhớ lệch mốc thời gian: Linux từ 4.14 (2017) bắt đầu hỗ trợ phân trang năm cấp, có bật hay không tùy thuộc vào CPU và cấu hình nhân; phía Intel, nền tảng hỗ trợ rõ ràng 57 bit ảo, 52 bit vật lý là Xeon Scalable thế hệ thứ ba (Ice Lake, nền tảng server phát hành năm 2021). Tài liệu Linux còn nhắc, phân trang năm cấp tối đa cho user space 56 bit địa chỉ ảo; để tương thích với những chương trình dùng các bit cao của con trỏ đi làm tagging, nhân theo mặc định sẽ không chủ động cấp địa chỉ ở trên 47 bit, trừ khi ứng dụng yêu cầu tường minh. Trên máy thông thường, mặc định vẫn là bốn cấp phổ biến hơn.

## TLB (bảng nhanh) giải quyết vấn đề gì?

Bảng trang đa cấp tiết kiệm không gian, nhưng tốn thêm thời gian: trước đây tra bảng một lần, giờ ở 64 bit có thể phải tra bốn cấp. Đằng sau một lần truy cập bộ nhớ, nếu còn giấu bốn năm lần tra bảng truy cập bộ nhớ, thì cái giá quá cao.

Vẫn dựa vào nguyên lý cục bộ để cứu vãn. Trong một khoảng thời gian, các trang mà chương trình truy cập lặp đi lặp lại, thường chỉ là vài lô đó. Vậy hãy bộ nhớ đệm các phần tử bảng trang thường dùng nhất, vào phần cứng nhanh hơn bộ nhớ nhiều. Bộ nhớ đệm này chính là TLB (Translation Lookaside Buffer), tiếng Việt hay gọi là bảng nhanh, bộ nhớ đệm chuyển đổi địa chỉ, được đóng gói bên trong MMU của CPU.

Có TLB, CPU định vị địa chỉ thì tra TLB trước:

- Trúng (TLB Hit), lấy trực tiếp số hiệu trang vật lý, bỏ qua tìm kiếm bảng trang đa cấp.
- Không trúng (TLB Miss), mới tra bảng trang đa cấp trong bộ nhớ, sau khi tìm thấy thì nhét phần tử này vào TLB, tiện cho lần truy cập sau.

![Quy trình TLB bộ nhớ đệm kết quả chuyển đổi địa chỉ: CPU tra TLB trước, trúng thì truy cập bộ nhớ trực tiếp, không trúng thì tra bảng trang đa cấp và cập nhật TLB](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-tlb-cache.png)

Vì trang nóng chỉ có bấy nhiêu, tỉ lệ trúng TLB thường không thấp. Chi phí tra bảng do bảng trang đa cấp gây ra, phần lớn thời gian đều được TLB gánh đỡ.

## Lỗi trang (Page Fault) được hoàn tất như thế nào?

Phân trang theo nhu cầu có một tiền đề: khi tiến trình truy cập một trang ảo nào đó, trang này chưa chắc đã ở trong bộ nhớ vật lý. Khi MMU tra bảng trang, nếu phát hiện việc dịch địa chỉ hoặc kiểm tra quyền cấp trang không thể hoàn tất, CPU sẽ kích hoạt lỗi trang, trao quyền điều khiển cho trình xử lý lỗi trang của nhân. Tài liệu tiếng Việt cũng thường gọi nó là "ngắt lỗi trang" (page fault interrupt), nhưng xét theo phân loại kiến trúc hệ thống, nó là một exception được kích hoạt đồng bộ bởi lệnh truy cập bộ nhớ hiện tại, chứ không phải ngắt phần cứng do thiết bị ngoại vi phát ra.

Quy trình có thể ghi nhớ theo mấy bước:

1. CPU cầm địa chỉ ảo tra bảng trang, phát hiện việc dịch địa chỉ hoặc kiểm tra quyền không thể hoàn tất, kích hoạt lỗi trang.
2. Vào nhân mode, trình xử lý lỗi trang trước tiên xét lần truy cập này có hợp lệ không. Nếu truy cập địa chỉ bất hợp lệ, ví dụ con trỏ hoang dã (wild pointer), thì báo lỗi phân đoạn (Segmentation Fault), tiến trình thường sẽ bị giết.
3. Nếu hợp lệ, tìm một khung trang vật lý trống. Nếu không có khung trống, hãy thu hồi hoặc hoán đổi một trang "nạn nhân": trang file sạch có thể ném bỏ trực tiếp, khi dùng lại đọc về từ file gốc; trang file dơ bẩn phải ghi ngược về file gốc; còn trang vô danh (anonymous page) thì ghi vào vùng trao đổi khi đã bật Swap. Việc cuối cùng có phát sinh ghi đĩa hay không, tùy thuộc vào loại trang và mức độ dơ bẩn.
4. Đọc trang cần dùng từ đĩa (vùng Swap hoặc file) vào bộ nhớ vật lý, cập nhật phần tử bảng trang để nó trỏ tới khung trang vật lý mới.
5. Trở về user mode, thực thi lại đúng lệnh vừa rồi đã kích hoạt lỗi trang, lần này sẽ truy cập bình thường.

![Quy trình xử lý lỗi trang: MMU phát hiện việc dịch địa chỉ hoặc kiểm tra quyền không thể hoàn tất thì vào nhân, kiểm tra tính hợp lệ của lần truy cập, cấp phát hoặc hoán đổi khung trang, cập nhật bảng trang và thực thi lại lệnh](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-page-fault.png)

Xét từ góc độ thống kê hiệu năng của Linux, lỗi trang chủ yếu chia làm hai loại, trong `getrusage` cũng chỉ có `ru_minflt` và `ru_majflt`:

- **Lỗi trang phụ (Minor Page Fault)** : trang thực chất đã ở trong bộ nhớ vật lý rồi, chỉ là bảng trang của tiến trình hiện tại chưa thiết lập ánh xạ, ví dụ các thư viện được nhiều tiến trình chia sẻ; việc sao chép trang do copy-on-write (COW) kích hoạt thường cũng được tính là lỗi trang phụ, vì nó cần tạo hoặc sao chép trang, nhưng không cần đọc đĩa. Chi phí nhỏ.
- **Lỗi trang chính (Major Page Fault)** : trang quả thật không nằm trong bộ nhớ, bắt buộc phải đọc từ đĩa (file hoặc Swap) vào, chi phí lớn.

Truy cập địa chỉ bất hợp lệ, ví dụ con trỏ hoang dã, cũng do phần cứng kích hoạt exception page-fault để vào nhân. Nhưng sau khi nhân xét là bất hợp lệ, thường là gửi `SIGSEGV` cho tiến trình. Đây thuộc về xử lý lỗi, thường không được xếp ngang hàng với minor/major như một loại thống kê hiệu năng thứ ba.

Nếu bộ nhớ vật lý quá chặt, hệ thống phần lớn thời gian đều đang hoán đổi trang vào/ra, CPU không làm việc gì ra hồn, toàn bộ dành để khiêng dữ liệu, trạng thái này gọi là **thrashing (thrashing)**.

## Thuật toán hoán đổi trang: đổi ai ra?

Bộ nhớ vật lý đầy, lại phải nạp trang mới, thì phải chọn một trang để đổi ra. Chọn trúng thì sau này ít lỗi trang; chọn trượt thì trang vừa đổi ra quay đầu lại cần dùng, tốn công vô ích.

Các thuật toán phổ biến có mấy cái sau.

**OPT (Optimal, hoán đổi tối ưu)** : đổi ra trang "trong thời gian dài nhất trong tương lai sẽ không bị truy cập". Số lần lỗi trang của nó theo lý thuyết là ít nhất, nhưng cần biết trước tương lai, trong thực tế không thể thực hiện được, chủ yếu dùng làm chuẩn đo để đo các thuật toán khác.

**FIFO (First In First Out, vào trước ra trước)** : duy trì một hàng đợi, ai vào sớm nhất thì đổi ai ra trước. Triển khai đơn giản, nhưng rất dễ làm hại các trang nóng, vì một trang ở lâu, không có nghĩa sau này không dùng đến.

**LRU (Least Recently Used, ít được dùng nhất gần đây)** : đổi ra trang "lâu nhất không bị truy cập". Nó đánh cược vào tính cục bộ: những trang gần đây đã dùng, kế tiếp rất có khả năng còn dùng. LRU hiệu quả gần bằng OPT, nhưng chi phí cao, hoặc duy trì dấu thời gian cho mỗi trang, hoặc dùng danh sách liên kết để mỗi lần truy cập di chuyển trang lên đầu danh sách. Triển khai bằng phần mềm thuần túy rất khó chịu nổi tần suất cao.

**CLOCK (đồng hồ / cơ hội thứ hai)** : phiên bản xấp xỉ của LRU, dùng để né chi phí cao của LRU. Thêm cho mỗi trang một bit truy cập (reference bit), xếp tất cả các trang thành một vòng tròn, một con trỏ xoay vòng như đồng hồ. Khi cần hoán đổi trang, con trỏ chỉ tới ai thì xem bit truy cập của nó: nếu là 1, nghĩa là gần đây có dùng, cho nó "cơ hội thứ hai", xóa bit truy cập về 0, con trỏ tiếp tục đi xuống; nếu là 0, thì đổi trang đó ra. Một bit truy cập cộng một vòng quét vòng tròn, là có thể mô phỏng rẻ tiền được "gần đây có bị dùng hay không".

![Sơ đồ thuật toán hoán đổi trang CLOCK: các trang được xếp theo hàng đợi vòng, con trỏ dựa vào bit truy cập R để quyết định cho cơ hội thứ hai hay loại bỏ trang](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/virtual-memory-clock-algorithm.png)

**LFU (Least Frequently Used, ít được dùng nhất)** : ghi số lần truy cập của mỗi trang, đổi ra trang có số lần truy cập ít nhất. Nó nhìn vào tần suất truy cập, chứ không phải thời điểm truy cập. Vấn đề là những trang từng được truy cập dày đặc giai đoạn đầu, rồi sau này không dùng nữa, số đếm rất cao lại cứ bám trụ không đi, nên trong thực tế thường kết hợp suy giảm số đếm (decay) để dùng.

So sánh ngang hàng một chút:

| Thuật toán | Căn cứ đổi ra                 | Chi phí triển khai                     | Hiệu quả                          | Khả thi hay không            |
| ---------- | ----------------------------- | -------------------------------------- | --------------------------------- | ---------------------------- |
| OPT        | Tương lai lâu nhất không dùng | Không thể triển khai                   | Tối ưu về lý thuyết               | Chỉ làm chuẩn đo             |
| FIFO       | Thời điểm vào sớm nhất        | Rất thấp                               | Trung bình, có thể hại trang nóng | Có                           |
| LRU        | Lâu nhất chưa truy cập        | Cao (dấu thời gian/danh sách liên kết) | Gần OPT                           | Phần mềm thuần khá chật vật  |
| CLOCK      | Bit truy cập + quét vòng tròn | Thấp                                   | Gần LRU                           | Có, giải pháp xấp xỉ chủ đạo |
| LFU        | Số lần truy cập ít nhất       | Trung bình (cần đếm)                   | Tùy tình huống                    | Có, thường kèm suy giảm      |

Đừng hiểu lầm ở đây: mấy cái trên là thuật toán trong sách giáo khoa, dùng để hiểu chiến lược hoán đổi. Nhân Linux thực tế không phải chọn trực tiếp một trong OPT/FIFO/LRU/CLOCK, mà dùng cơ chế xấp xỉ gồm hai danh sách liên kết LRU active/inactive, workingset, phát hiện refault; chiến lược thu hồi của trang file và trang vô danh cũng khác nhau, còn chịu ảnh hưởng của NUMA, cgroup, mức nước bộ nhớ. Nên câu nói "Linux dùng chính là CLOCK" là không chuẩn xác.

## Dị thường Belady: thêm bộ nhớ lại càng chậm?

Theo trực giác, khung trang vật lý càng nhiều thì lỗi trang nên càng ít. Nhưng FIFO sẽ vả mặt: **có khi tăng số khung trang, số lần lỗi trang ngược lại tăng nhiều hơn**. Đây chính là dị thường Belady (Belady's Anomaly), do László Bélády phát hiện vào thập niên 1960.

Dùng chuỗi truy cập kinh điển là tái hiện được. Chuỗi truy cập 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, chạy FIFO:

- Với 3 khung trang, lỗi trang 9 lần.
- Với 4 khung trang, lỗi trang 10 lần.

Cho thêm một khung trang, lỗi trang ngược lại nhiều thêm một lần.

Nguyên nhân nằm ở chỗ FIFO không thỏa **tính chất ngăn xếp (stack property)**: tập hợp các trang trú ngụ với n khung trang, không nhất thiết là tập con của tập hợp các trang trú ngụ với n+1 khung trang. Quan hệ bao hàm này vừa đứt, thì thêm khung trang có thể đá nhầm trang.

Những thuật toán thỏa tính chất ngăn xếp gọi là thuật toán ngăn xếp. Chúng có mức ưu tiên hoán đổi cho mỗi trang không phụ thuộc vào số khung trang, nên về mặt toán học có thể tránh được dị thường Belady. OPT và LRU đều là thuật toán ngăn xếp, có thể chứng minh rằng khi số khung trang tăng, lỗi trang chỉ giảm hoặc không đổi, chứ không tăng ngược. FIFO không thỏa tính chất này nên sẽ có vấn đề. Còn LFU có xuất hiện dị thường Belady hay không, phụ thuộc vào cách thống kê tần suất của nó cũng như cách phá hòa khi tần suất bằng nhau, không thể nói thẳng nó chắc chắn miễn nhiễm.

CLOCK cũng đừng nghĩ theo lẽ hiển nhiên. Kinh điển second-chance/CLOCK là bản xấp xỉ của LRU, nhưng không có tính chất ngăn xếp nghiêm ngặt như LRU; trong trường hợp cực đoan, mọi bit truy cập đều là 1, nó còn thoái hóa thành FIFO. Nên không thể vì nó "xấp xỉ LRU" mà suy ra nó nhất định miễn nhiễm dị thường Belady. Kết luận vững chắc là: FIFO tồn tại chuỗi truy cập có thể kích hoạt dị thường Belady, OPT và LRU chắc chắn sẽ không, còn CLOCK、LFU loại này phải xem định nghĩa cụ thể.

Nhớ một kết luận là đủ dùng: dị thường Belady là căn bệnh của những thuật toán không phải ngăn xếp như FIFO, gặp hiện tượng kỳ lạ "thêm bộ nhớ hiệu năng ngược lại giảm", trước tiên hãy nghi ngờ chiến lược hoán đổi, chứ đừng nghi ngờ thanh RAM bị hỏng.

## Những khái niệm này được dùng thế nào trong kỹ thuật?

Bộ nhớ ảo không chỉ sống trong sách giáo khoa hệ điều hành, đi lên trên vài tầng là chạm trán nó.

**mmap và sao chép không (zero-copy)** : `mmap()` ánh xạ trực tiếp file vào không gian địa chỉ ảo của tiến trình, đọc file biến thành truy cập bộ nhớ. Khi thiết lập ánh xạ không phải ngay lập tức đọc file vào, đợi bạn truy cập đến trang nào đó mới kích hoạt lỗi trang, nạp theo trang, đây chính là phân trang theo nhu cầu. Nó tiết kiệm được một lần sao chép từ bộ đệm nhân sang bộ đệm người dùng, nên thường xuất hiện trong các giải pháp zero-copy.

**Bộ nhớ và phân mảnh của Redis** : Redis là cơ sở dữ liệu thuần bộ nhớ, nhưng bộ nhớ nó xin cấp cuối cùng cũng phải rơi lên trang vật lý. Trình cấp phát bộ nhớ (mặc định jemalloc) cấp phát theo các hạng kích thước cố định (size class), sẽ có lãng phí không gian. Nó và phân trang trong "thiếu một trang cũng chiếm một trang" có điểm rất tương đồng ở chỗ "hạt cấp phát lớn hơn lượng dùng thực tế", nhưng một cái xảy ra ở trình cấp phát phía user mode, một cái xảy ra ở tầng phân trang của hệ điều hành, vị trí và cách quản trị đều khác nhau, không thể đánh đồng thành cùng một loại phân mảnh. Khi Redis persistent hóa fork ra tiến trình con để chụp snapshot, cũng dựa vào sao chép khi ghi (Copy-On-Write): tiến trình cha con trước tiên chia sẻ cùng một đợt trang vật lý, ai ghi thì mới kích hoạt sao chép trang, đằng sau vẫn là cơ chế của bảng trang.

**Heap của JVM** : heap mà JVM xin cấp từ hệ điều hành, cũng là một vùng địa chỉ ảo. Heap lớn sẽ khiến phạm vi bảng trang bao phủ tăng lên, phối hợp trang lớn (HugePage / trang lớn 2 MB) có thể giảm số lượng phần tử bảng trang, giảm nhẹ áp lực TLB, có ích cho việc giảm chi phí truy cập bộ nhớ trong lúc GC. Khi GC quét đối tượng chạy nhảy lung tung, tính cục bộ truy cập kém, cái giá trực tiếp hơn là cache miss và TLB miss tăng lên; chỉ khi những trang liên quan chưa trú ngụ, đã bị thu hồi, hoặc bản thân hệ thống đang thiếu bộ nhớ, mới biểu hiện thêm thành lỗi trang. Đây cũng chính là lý do tinh chỉnh heap lớn phải để ý đến TLB.

Phía dưới là bảng trang và TLB của phần cứng, phía trên là cơ sở dữ liệu, JVM, zero-copy. Tầng bộ nhớ ảo này nhìn thì có vẻ thuộc tầng thấp, nhưng thực tế thường xuyên nổi lên từ đủ thứ vấn đề hiệu năng.

## Trong phỏng vấn trả lời thế nào?

Nếu người phỏng vấn hỏi "vì sao cần bộ nhớ ảo", đừng vừa mở miệng chỉ nói "để cô lập". Có thể trả lời như thế này trước: trong chương trình dùng là địa chỉ ảo, không phải địa chỉ thật nằm trên RAM. Khi CPU truy cập bộ nhớ, MMU sẽ dựa theo bảng trang dịch địa chỉ ảo thành địa chỉ vật lý. Như vậy mỗi tiến trình đều như đang dùng một vùng bộ nhớ độc lập liên tục, dù địa chỉ trong hai tiến trình có giá trị giống nhau, cuối cùng cũng có thể rơi lên những vùng bộ nhớ vật lý khác nhau.

Rồi bổ sung thêm một điểm lợi: giữa các tiến trình không sửa được dữ liệu của nhau, chương trình không cần quan tâm bộ nhớ vật lý cụ thể nằm ở đâu, hệ điều hành còn có thể cấp phát bộ nhớ theo nhu cầu, hoán đổi trang, và dùng cơ chế như COW để giảm việc sao chép.

Nếu tiếp tục hỏi "phân trang giải quyết được gì", thì đem nó so sánh với phân đoạn. Phân đoạn là cắt theo các module logic như code segment, data segment, stack, chiều dài không cố định, nên rất dễ chừa lại phân mảnh ngoài, về sau dọn dẹp cũng rắc rối. Phân trang đơn giản nhiều: không gian địa chỉ ảo và bộ nhớ vật lý đều cắt thành các trang có kích thước cố định, bảng trang chỉ chịu trách nhiệm ghi lại quan hệ "số hiệu trang ảo → khung trang vật lý". Như vậy về cơ bản loại bỏ được phân mảnh ngoài, tuy nhiên trong trang có thể lãng phí một chút không gian, tức là phân mảnh trong.

Bảng trang đa cấp cũng có thể thuận tay nhắc tới: nó không phải để tra bảng nhanh hơn, mà là để tiết kiệm bộ nhớ. Với những không gian địa chỉ không được dùng, không cần thật sự xây bảng trang cấp dưới ra.

Khi hỏi đến TLB và lỗi trang, có thể theo lối "trước đi đường nhanh, sau xử lý ngoại lệ" để nói. CPU tra TLB trước, trúng thì trực tiếp lấy được số hiệu trang vật lý; không trúng mới tra bảng trang đa cấp. Nếu phần tử bảng trang cho thấy trang này còn chưa nằm trong bộ nhớ, thì kích hoạt lỗi trang. Nhân trước tiên xét lần truy cập này có hợp lệ không, hợp lệ mới cấp phát khung trang, khi cần thì thu hồi trang cũ, rồi từ file hoặc Swap điều trang vào, cuối cùng cập nhật bảng trang, thực thi lại đúng lệnh vừa rồi.

minor fault thường không cần đọc đĩa, major fault thì phải đọc đĩa; nếu là truy cập địa chỉ bất hợp lệ, cuối cùng thường sẽ đi đến `SIGSEGV`.

Thuật toán hoán đổi trang không cần đọc thuộc tên từng cái một, nắm một câu là đủ: trang đổi ra, tốt nhất là trang sau này lâu lắm không dùng đến. OPT tối ưu nhưng trong thực tế không làm được; LRU hiệu quả gần OPT nhưng chi phí triển khai cao; CLOCK dùng bit truy cập để xấp xỉ LRU; FIFO đơn giản nhất, nhưng có thể xuất hiện dị thường Belady. Linux thực tế cũng không sao chép một thuật toán nào trong sách giáo khoa, mà dùng các cơ chế như LRU active/inactive, workingset, refault để thu hồi xấp xỉ.
