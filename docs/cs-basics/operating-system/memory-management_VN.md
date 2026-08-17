---
title: "Giải thích chi tiết về quản lý bộ nhớ trong hệ điều hành: Phân trang, Phân đoạn, Thay thế trang, Swap và OOM"
description: "Tổng hợp các câu hỏi phỏng vấn tần suất cao về quản lý bộ nhớ hệ điều hành, bắt đầu từ VSZ/RSS/PSS, cấp phát liên tục và phân mảnh bộ nhớ, trình bày rõ về Hệ thống Buddy (Partner), phân trang/phân đoạn, bảng trang, TLB, lỗi trang, thay thế trang, Swap, Overcommit, OOM, mmap, COW và trang lớn."
category: Kiến thức cơ sở máy tính
tag:
  - Hệ điều hành
  - Quản lý bộ nhớ
head:
  - - meta
    - name: keywords
      content: quản lý bộ nhớ hệ điều hành,quản lý bộ nhớ,câu hỏi phỏng vấn quản lý bộ nhớ,quản lý bộ nhớ Linux,bộ nhớ ảo,phân trang,phân đoạn,bảng trang,TLB,lỗi trang,thay thế trang,Swap,Barđội hệ thống,Overcommit,OOM,mmap,COW,trang lớn,câu hỏi phỏng vấn hệ điều hành
---

Khi mở thông tin bộ nhớ của một tiến trình thông thường, bạn sẽ thấy rất nhiều con số trông có vẻ phản trực giác: tiến trình có không gian địa chỉ ảo riêng, dải địa chỉ có thể rất lớn; bộ nhớ vật lý thực sự chiếm dụng lại là chuyện khác; cùng một thư viện động còn có thể được chia sẻ bởi nhiều tiến trình.

Lập trình viên khi viết code chỉ là truy cập địa chỉ, nhưng hệ điều hành nhìn thấy một loạt vấn đề cụ thể hơn: khối bộ nhớ này cấp cho ai? Có thể để tiến trình khác chạm vào không? Khi bộ nhớ vật lý không đủ thì đẩy ai ra ngoài? Các lỗ hổng còn lại sau khi giải phóng có thể tiếp tục sử dụng được không?

Đây chính là những gì quản lý bộ nhớ cần xử lý. Gợi ý không nên bắt đầu bằng việc học thuộc các thuật ngữ như phân trang, phân đoạn, TLB, mà trước hết hãy nắm một mạch chính: **hệ điều hành tách biệt địa chỉ mà chương trình nhìn thấy với bộ nhớ vật lý thực, rồi dùng cấp phát, ánh xạ, bảo vệ và thu hồi để quản lý bộ nhớ.**

## VSZ, RSS và PSS đại diện cho điều gì?

Trong Linux, những gì dễ đọc sai nhất là các con số về bộ nhớ tiến trình. VSZ trong `ps`, `VmSize` trong `/proc/<pid>/status`, biểu thị kích thước không gian địa chỉ ảo mà tiến trình đã ánh xạ. Nó có thể bao gồm ánh xạ ẩn danh chưa thực sự cư trú, ánh xạ tệp, thư viện dùng chung và địa chỉ dự phòng, không thể trực tiếp xem như bộ nhớ vật lý đã chiếm dụng.

RSS biểu thị tổng số trang hiện đang cư trú trong RAM và được ánh xạ cho tiến trình đó. Các thư viện dùng chung, bộ nhớ dùng chung, trang dùng chung trong Page Cache cũng được tính vào RSS của mỗi tiến trình liên quan, nên cộng trực tiếp RSS của nhiều tiến trình dễ bị tính lặp.

PSS phù hợp hơn để ước tính phần chia sẻ thực tế chiếm dụng của tiến trình. Nếu một trang vật lý được chia sẻ bởi 4 tiến trình, PSS của mỗi tiến trình chỉ tính một phần tư. Khi cần xem số tổng hợp, có thể dùng:

```bash
grep -E 'VmSize|VmRSS|RssAnon|RssFile|RssShmem|VmSwap' /proc/<pid>/status
cat /proc/<pid>/smaps_rollup
```

`smaps_rollup` sẽ đưa ra tổng hợp ở cấp tiến trình; để phân tích từng phân đoạn ánh xạ, tiếp tục xem `/proc/<pid>/smaps`. Tuy nhiên, `smaps` đầy đủ sẽ duyệt qua VMA và bảng trang của tiến trình, khi thu thập tần suất cao trên môi trường production cần thận trọng.

## Quản lý bộ nhớ chủ yếu đảm nhận những gì?

Từ góc nhìn của hệ điều hành, quản lý bộ nhớ ít nhất phải làm 5 việc.

![Tổng quan về trách nhiệm của quản lý bộ nhớ](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-management-responsibilities.webp)

**Thứ nhất, cấp phát và thu hồi bộ nhớ.** `malloc()`/`free()` ở phía user quản lý các khối bộ nhớ trong heap của tiến trình. Lấy glibc làm ví dụ, khi cần bộ cấp phát sẽ mở rộng vùng địa chỉ ảo khả dụng thông qua các giao diện như `brk()`, `mmap()`; sau khi vùng ảo được tạo, các trang vật lý thường vẫn phải chờ lần truy cập đầu tiên để được thiết lập thông qua đường lỗi trang. Trong nhân, trình quản lý trang (page allocator) và các bộ cấp phát đối tượng như SLAB/SLUB quản lý các trang vật lý và đối tượng của nhân.

**Thứ hai, hoàn tất chuyển đổi địa chỉ.** Chương trình truy cập là địa chỉ ảo, còn thứ thực sự rơi xuống thanh RAM là địa chỉ vật lý. MMU trong CPU phối hợp với bảng trang và TLB để dịch địa chỉ ảo thành địa chỉ vật lý.

**Thứ ba, thực hiện cô lập tiến trình và kiểm soát quyền.** Mỗi tiến trình có không gian địa chỉ riêng. `0x1000` trong tiến trình A và `0x1000` trong tiến trình B có thể ánh xạ đến các trang vật lý hoàn toàn khác nhau; mục bảng trang còn có thể đánh dấu quyền đọc, ghi, thực thi, truy cập vượt quyền sẽ kích hoạt ngoại lệ.

**Thứ tư, thu hồi các trang khi bộ nhớ vật lý căng thẳng.** Các trang tệp sạch có thể bỏ trực tiếp, khi cần lại đọc từ tệp; các trang tệp bẩn thường phải ghi ngược lại trước; trang ẩn danh nếu muốn thu hồi thường cần ghi vào Swap. Linux kết hợp các yếu tố như độ nóng/lạnh của trang, refault, mức nước bộ nhớ, cgroup và `swappiness` để chọn đối tượng thu hồi, không cố định thu hồi một loại trang nào trước.

**Thứ năm, hỗ trợ chia sẻ và ánh xạ.** Chia sẻ thư viện động, IPC bộ nhớ dùng chung, ánh xạ tệp `mmap()`, copy-on-write (COW), đều dựa vào khả năng "nhiều địa chỉ ảo ánh xạ đến cùng một batch trang vật lý".

## Nếu không có trừu tượng hóa bộ nhớ thì sao?

Trong các hệ thống sớm hoặc rất nhỏ, chương trình có thể truy cập trực tiếp địa chỉ vật lý. Khi chỉ một chương trình chạy, cách này vẫn tạm ổn; nhưng một khi nhiều chương trình chạy đồng thời, vấn đề lập tức xuất hiện.

Giả sử chương trình A ghi dữ liệu vào địa chỉ vật lý 1000, chương trình B cũng đặt biến của mình tại địa chỉ vật lý 1000. Hai chương trình không biết sự tồn tại của nhau, cuối cùng ai ghi sau thì người đó ghi đè lên người trước. Tệ hơn, chương trình người dùng thông thường cũng có thể ghi vào bộ nhớ của chính hệ điều hành, độ ổn định của hệ thống không thể đảm bảo.

Giải pháp là đưa vào **không gian địa chỉ (Address Space)**. Mỗi tiến trình thấy một bộ địa chỉ riêng của mình, bên trong thường có phân đoạn code, phân đoạn dữ liệu, heap, stack, vùng ánh xạ bộ nhớ, v.v. Tiến trình chỉ làm việc với địa chỉ ảo, các trang vật lý thực do hệ điều hành và phần cứng cùng quyết định.

Nhờ vậy, cô lập tiến trình, tải theo nhu cầu, bộ nhớ dùng chung, COW mới có chỗ đứng.

## Cấp phát bộ nhớ liên tục và vấn đề phân mảnh

Cách cấp phát bộ nhớ dễ hiểu nhất là cấp phát liên tục: tiến trình cần bao nhiêu bộ nhớ, hệ điều hành tìm một khối bộ nhớ vật lý liên tục cho nó. Các hệ thống sớm thường dùng phân vùng cố định hoặc phân vùng động để quản lý.

Vấn đề của cấp phát liên tục là phân mảnh.

![Cấp phát bộ nhớ liên tục và phân mảnh](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-fragmentation.webp)

**Phân mảnh nội bộ (internal fragmentation)** chỉ vùng đã cấp phát đi nhưng thực tế không dùng đến. Ví dụ hệ thống cấp phát theo đơn vị 128 byte, một đối tượng chỉ cần 65 byte, 63 byte còn lại bị lãng phí bên trong đơn vị cấp phát này.

**Phân mảnh ngoại vi (external fragmentation)** chỉ trường hợp tổng không gian trống đủ, nhưng không liên tục, không đáp ứng được cấp phát liên tục khối lớn mới. Ví dụ trong bộ nhớ có hai vùng trống, mỗi vùng 128 MB, tổng 256 MB; giờ cấp một vùng liên tục 200 MB, vẫn thất bại.

Các chiến lược cấp phát phổ biến của phân vùng động có first-fit, best-fit, worst-fit, v.v. Chúng có thể thay đổi vị trí và tốc độ xuất hiện của phân mảnh, nhưng không thể loại bỏ tận gốc phân mảnh ngoại vi. Nén bộ nhớ (memory compaction) sẽ di chuyển các trang có thể di dời, gom các trang trống phân tán thành vùng vật lý liên tục lớn hơn. Nó không tương đương với Swap I/O, nhưng nén đồng bộ có thể chiếm CPU, di chuyển lượng lớn trang và gây đột biến độ trễ.

## Hệ thống Buddy của Linux giải quyết được gì?

Linux quản lý các trang vật lý bằng **Hệ thống Buddy (Buddy System)**. Nó tổ chức bộ nhớ trống theo lũy thừa của 2, ví dụ 4 KB, 8 KB, 16 KB, 32 KB…… Khi xin bộ nhớ, trước tiên tìm khối nhỏ nhất đáp ứng yêu cầu; nếu khối tìm thấy quá lớn, liên tục chia đôi; khi giải phóng, nếu khối bạn (buddy) lân cận cũng trống, thì hợp nhất thành khối lớn hơn.

Lợi ích của thiết kế này là quy tắc chia và hợp rất đơn giản, có thể nhanh chóng tìm được các trang vật lý liên tục, đồng thời giảm phân mảnh ngoại vi.

Tuy nhiên nó cũng lãng phí một chút không gian: đơn vị cấp phát của hệ thống Buddy là `2^order` trang vật lý liên tục. Lấy trang cơ sở 4 KB làm ví dụ, nếu caller của nhân cần ít nhất 65 KB bộ nhớ vật lý liên tục, có thể phải xin 32 trang, tức khối order-5 128 KB, từ đó sinh ra lãng phí nội bộ. Ví dụ này mô tả việc xin trang vật lý liên tục của nhân, không đại diện cho việc user gọi `malloc(65KB)` thì chắc chắn chiếm trực tiếp một buddy block 128 KB.

Ngoài ra, hệ thống Buddy chủ yếu quản lý bộ nhớ vật lý theo trang. Trong nhân còn có rất nhiều đối tượng nhỏ hơn trang, ví dụ đối tượng tệp, inode, cấu trúc đệm mạng. Nếu mỗi lần đều xin theo trang sẽ lãng phí quá nhiều. Linux sẽ dùng các bộ cấp phát như SLAB/SLUB phía trên hệ thống Buddy, cache và tái sử dụng các khối bộ nhớ theo kích thước đối tượng, giảm chi phí cấp phát, khởi tạo và giải phóng thường xuyên.

## Phân đoạn, phân trang và phân đoạn-trang (segment-page) có gì khác nhau?

Không nhất thiết chỉ tách không gian địa chỉ theo một cách. Trong sách giáo khoa về hệ điều hành thường thấy ba cách: phân đoạn, phân trang, phân đoạn-trang.

| Cách            | Căn cứ phân chia                                                      | Cấu trúc địa chỉ                                    | Ưu điểm                                                                                            | Vấn đề chính                                                       |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Phân đoạn       | Chia theo logic chương trình, như đoạn code, đoạn dữ liệu, đoạn stack | Số đoạn + độ lệch trong đoạn                        | Gần với cấu trúc chương trình, thuận lợi chia sẻ và bảo vệ                                         | Độ dài đoạn không cố định, dễ sinh phân mảnh ngoại vi              |
| Phân trang      | Tách địa chỉ ảo và bộ nhớ vật lý theo kích thước cố định              | Số trang + độ lệch trong trang                      | Bộ nhớ vật lý có thể cấp phát rời rạc, giảm phân mảnh ngoại vi do cấp phát liên tục của tiến trình | Bảng trang chiếm không gian, trang cuối có thể có phân mảnh nội bộ |
| Phân đoạn-trang | Đầu tiên phân đoạn theo logic, rồi cắt đoạn thành trang               | Số đoạn + số trang trong đoạn + độ lệch trong trang | Vừa bảo toàn bảo vệ logic vừa cấp phát rời rạc                                                     | Chuyển đổi địa chỉ phức tạp hơn                                    |

Các hệ điều hành đa dụng hiện đại chủ yếu dựa vào phân trang để quản lý bộ nhớ. Lấy x86 làm ví dụ, phần cứng lịch sử từng hỗ trợ phân đoạn và phân trang; trong chế độ dài x86-64, không gian địa chỉ user thông thường của Linux chủ yếu dựa vào phân trang, phân đoạn code và phân đoạn dữ liệu truyền thống về cơ bản dùng mô hình phẳng (flat). Tuy nhiên FS/GS vẫn có mục đích thực tế, ví dụ FS thường được dùng cho lưu trữ cục bộ luồng phía user (TLS).

Còn cần bổ sung một điểm dễ bị sách giáo khoa đơn giản hóa: phân trang giảm phân mảnh ngoại vi do cấp phát liên tục của không gian địa chỉ tiến trình, nhưng không làm cho vấn đề phân mảnh của bản thân bộ nhớ vật lý biến mất. DMA, trang lớn và một phần yêu cầu của nhân vẫn có thể cần trang vật lý liên tục, nên tổng bộ nhớ trống đủ, việc xin trang liên tục bậc cao vẫn có thể thất bại, nhân còn cần hợp nhất buddy và nén bộ nhớ.

## Phân trang hoàn tất chuyển đổi địa chỉ như thế nào?

Phân trang cắt không gian địa chỉ ảo thành các trang ảo kích thước cố định, cắt bộ nhớ vật lý thành các page frame cùng kích thước. Trong hệ thống Linux x86-64 thông thường một trang thường là 4 KB, nhưng kích thước trang cụ thể liên quan đến kiến trúc.

Một địa chỉ ảo có thể tách thành hai phần:

- **Số trang ảo**: dùng để tra bảng trang, tìm ra page frame vật lý tương ứng.
- **Độ lệch trong trang**: vị trí cụ thể bên trong trang.

Chuyển đổi địa chỉ đại khái như sau: CPU phát địa chỉ ảo, MMU lấy số trang ảo tra bảng trang, được số page frame vật lý, rồi ghép với độ lệch trong trang, ra địa chỉ vật lý.

![Chuyển đổi địa chỉ ảo sang địa chỉ vật lý](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-address-translation.webp)

Mục bảng trang không chỉ lưu số page frame vật lý, còn lưu nhiều bit trạng thái, ví dụ bit present, quyền đọc/ghi, quyền user/kernel, bit bẩn, bit truy cập, v.v. Bit present biểu thị trang có đang ở trong bộ nhớ vật lý hay không; bit quyền dùng để bảo vệ; bit truy cập và bit bẩn tham gia vào phán đoán thu hồi trang.

## Vì sao cần bảng trang đa cấp?

Bảng trang một cấp rất dễ hiểu, nhưng chi phí không gian quá lớn.

Lấy không gian địa chỉ 32 bit, kích thước trang 4 KB làm ví dụ, một tiến trình có không gian địa chỉ ảo 4 GB, cần `4 GB / 4 KB = 2^20` mục bảng trang. Nếu mỗi mục bảng trang 4 byte, bảng trang của một tiến trình cần khoảng 4 MB. Khi số tiến trình nhiều lên, bộ nhớ này không thể bỏ qua.

Phiền phức hơn là hầu hết tiến trình không dùng hết toàn bộ không gian địa chỉ ảo. Bảng trang một cấp lại phải chuẩn bị mục cho cả vùng không gian, rất nhiều mục đều rỗng.

Cách làm của bảng trang đa cấp là phân tầng: bảng trang tầng trên cùng bao phủ toàn bộ không gian địa chỉ ảo, bảng cấp dưới tạo theo nhu cầu. Một vùng địa chỉ ảo nào đó không hề được dùng, thì không tạo bảng cấp dưới tương ứng. Mã bảng trang không phụ thuộc kiến trúc của Linux được viết theo phân tầng 5 cấp; nếu kiến trúc hoặc máy cụ thể không dùng hết các cấp, các cấp thừa sẽ bị gấp lại.

![Bảng trang đa cấp tạo theo nhu cầu](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-multilevel-page-table.webp)

Trên x86-64, cấu hình truyền thống thường dùng phân trang 4 cấp; chỉ khi CPU, nhân và cấu hình hỗ trợ LA57 mới dùng phân trang 5 cấp. Tài liệu Linux nêu rõ, phân trang 5 cấp có thể bật không gian địa chỉ ảo 56 bit phía user, nhưng để tương thích với một số chương trình dùng bit cao của con trỏ, mặc định nhân sẽ không chủ động cấp địa chỉ ảo trên 47 bit, trừ khi ứng dụng yêu cầu tường minh qua địa chỉ hint ở bit cao.

## Vì sao TLB quan trọng?

Bảng trang đa cấp tiết kiệm không gian, nhưng lại khiến việc chuyển đổi địa chỉ phải đi thêm vài lần truy cập bộ nhớ. Mỗi lần truy cập dữ liệu đều tra đầy đủ bảng trang đa cấp thì chi phí quá cao.

TLB (Translation Lookaside Buffer, bảng tra nhanh) chính là cache của các mục bảng trang, thường nằm trong MMU. Khi CPU truy cập bộ nhớ, trước tiên tra TLB:

- Trúng: có ngay số page frame vật lý.
- Trượt: đi tra bảng trang đa cấp, sau khi tra được đưa kết quả trở về TLB.

Chương trình truy cập bộ nhớ có tính cục bộ (locality): trang vừa truy cập, lần sau khả năng cao vẫn truy cập; khi truy cập một địa chỉ, địa chỉ lân cận cũng có thể nhanh chóng được truy cập. TLB chính là hưởng lợi từ tính cục bộ này.

Đây cũng là một trong những lý do trang lớn có giá trị. Với trang thường 4 KB, một mục TLB chỉ bao phủ 4 KB; nếu dùng trang lớn 2 MB, một mục TLB bao phủ dải địa chỉ lớn hơn, TLB miss có thể giảm. Tuy nhiên trang lớn cũng mang chi phí cấp phát và thu hồi lớn hơn, các chương trình như DB, JVM có nên bật THP hay HugeTLB hay không phải xác minh theo mục tiêu độ trễ và thông lượng.

## Lỗi trang (Page Fault) là chuyện gì?

Bộ nhớ ảo không phải khi tiến trình khởi động là nạp toàn bộ các trang vào bộ nhớ vật lý. Nhiều trang chỉ khi lần đầu được truy cập mới thực sự được nạp, đây gọi là tải theo nhu cầu (demand paging).

Page Fault là ngoại lệ bộ xử lý được kích hoạt đồng bộ bởi lệnh hiện tại, không phải ngắt phần cứng không đồng bộ do thiết bị ngoài sinh ra.

Khi tiến trình truy cập một trang ảo, MMU không tìm thấy bản dịch hợp lệ, sẽ kích hoạt lỗi trang và đi vào xử lý của nhân. Nhân trước tiên phán đoán truy cập có nằm trong VMA hợp lệ hay không, cũng như quyền truy cập có được phép hay không. Địa chỉ bất hợp lệ hoặc vi phạm quyền thường biến thành `SIGSEGV`; lỗi trang hợp lệ thì xử lý theo loại ánh xạ: có thể ánh xạ trang Page Cache đã có, thiết lập trang ẩn danh không, thực hiện COW, cấp phát trang mới, hoặc đọc dữ liệu từ tệp và Swap. Sau khi xử lý xong cập nhật bảng trang, rồi thực thi lại chính lệnh vừa rồi.

`getrusage(2)` của Linux chia thống kê lỗi trang thành hai loại:

- **Lỗi phụ (minor fault)**: khi xử lý không cần I/O thực tế. Ví dụ trang đã ở trong bộ nhớ, chỉ là tiến trình hiện tại chưa thiết lập ánh xạ; COW kích hoạt sao chép cũng phổ biến trong đường này.
- **Lỗi chính (major fault)**: khi xử lý cần I/O, ví dụ phải đọc trang từ tệp đĩa hoặc Swap.

Lỗi chính chậm hơn nhiều so với lỗi phụ. Khi xử lý sự cố bộ nhớ trên production, `majflt` tăng nhanh thường đáng chú ý hơn `minflt`.

## Thay thế trang: khi bộ nhớ không đủ thì đẩy ai ra ngoài?

Bộ nhớ vật lý đã đầy, còn phải nạp trang mới, thì phải thu hồi một mớ trang trước. Bài toán thay thế trang cần giải quyết rất trực tiếp: khi bộ nhớ không đủ, đầu tiên đẩy trang nào ra, mới có thể ít ảnh hưởng đến các truy cập sau đó nhất.

![So sánh các thuật toán thay thế trang](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-page-replacement.webp)

Lý tưởng nhất là OPT: trực tiếp đẩy ra trang mà trong thời gian dài nhất tương lai sẽ không được truy cập. Nó chỉ có thể là giới hạn lý thuyết, vì hệ điều hành không thể dự đoán tương lai. FIFO dễ thực hiện hơn, ai vào bộ nhớ trước thì ra trước, nhưng nó không quan tâm trang có còn nóng hay không, thậm chí còn xuất hiện nghịch lý Belady: cấp nhiều page frame hơn, số lần lỗi trang ngược lại có thể tăng.

Trực giác của LRU gần với chương trình thực hơn: trang lâu nay không truy cập, về sau khả năng cao cũng không dùng sớm. Vấn đề nằm ở chi phí triển khai, duy trì chính xác thứ tự truy cập của mỗi trang quá đắt. CLOCK ra đời trong bối cảnh đó như một giải pháp thỏa hiệp, nó dùng bit truy cập và hàng đợi vòng để cho trang một "cơ hội thứ hai", xấp xỉ LRU với chi phí thấp. LFU đi theo hướng khác, loại bỏ theo tần suất truy cập, nhưng nếu không có cơ chế suy giảm, các trang nóng ở giai đoạn đầu có thể chiếm vị trí lâu dài, sau này không dùng nữa cũng khó bị loại ra.

Linux thực tế không chép nguyên xi một thuật toán sách giáo khoa nào. Đường thu hồi kinh điển dùng các cơ chế như trang tệp/trang ẩn danh, LRU hoạt động/không hoạt động, workingset và refault để xấp xỉ nhận diện trang nóng/lạnh; các nhân mới hơn còn có thể bật Multi-Gen LRU, dùng nhiều thế hệ truy cập để biểu thị độ mới/cũ của trang. Trang tệp, trang ẩn danh, cgroup, NUMA, mức nước bộ nhớ đều ảnh hưởng đến đường thu hồi, thuật toán cụ thể còn phụ thuộc vào phiên bản nhân và cấu hình.

![Ý tưởng thu hồi trang của Linux](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/memory-page-reclaim.webp)

Vì vậy, nói gọn việc thu hồi trang Linux là một thuật toán nào đó là không chính xác. Nó giống một tập hợp chiến lược quanh bảo vệ working set, nhận diện nóng/lạnh và kiểm soát mức nước bộ nhớ.

## Swap, working set và hiện tượng trì trệ (thrashing)

Swap không phải là "bộ nhớ thêm ra", giống một vùng dự phòng tốc độ thấp hơn. Trang ẩn danh không có nguồn tệp, khi bộ nhớ căng thẳng muốn thu hồi nó, có thể phải ghi vào Swap; sau này truy cập lại, lại đọc ngược từ Swap về.

Tập hợp các trang mà một tiến trình thực sự đang tích cực sử dụng gọi là working set. Chỉ cần bộ nhớ vật lý có thể chứa working set của các tiến trình chính trong hệ thống, lỗi trang khá kiểm soát được; nếu không chứa nổi, các trang sẽ bị đẩy ra rồi lại nạp vào liên tục, hệ thống rơi vào trạng thái trì trệ.

Khi trì trệ, CPU trông có vẻ không hẳn bận tính toán nghiệp vụ, I/O đĩa, lỗi chính, thu hồi bộ nhớ trở nên rất rõ rệt. Khi xử lý sự cố có thể xem các chỉ số này:

```bash
# Toàn hệ thống
free -h
vmstat 1
cat /proc/meminfo
cat /proc/pressure/memory
grep -E 'pgfault|pgmajfault|pswpin|pswpout|pgscan|pgsteal' /proc/vmstat

# Từng tiến trình
grep -E 'VmSize|VmRSS|RssAnon|RssFile|RssShmem|VmSwap' /proc/<pid>/status
cat /proc/<pid>/smaps_rollup
pmap -x <pid>
perf stat -e page-faults,major-faults <command>

# Container / cgroup v2
cat /sys/fs/cgroup/memory.current
cat /sys/fs/cgroup/memory.max
cat /sys/fs/cgroup/memory.events
cat /sys/fs/cgroup/memory.pressure
```

Khi đọc các chỉ số này, có thể tách theo nguồn: phía tiến trình xem RSS/PSS và `smaps_rollup`, xác nhận bộ nhớ cư trú rơi vào trang ẩn danh, trang tệp hay bộ nhớ dùng chung; phía lỗi trang xem `pgmajfault` và `major-faults`, xác nhận chậm do I/O hay chỉ đang dựng ánh xạ; phía hệ thống xem Swap, quét thu hồi và PSI, xác nhận áp lực bộ nhớ có truyền sang độ trễ nghiệp vụ hay không.

Khi xử lý sự cố đừng chỉ nhìn `free`. Linux cố gắng dùng bộ nhớ trống cho Page Cache hết mức có thể, `MemFree` thấp không nhất thiết biểu thị áp lực lớn; nên kết hợp `MemAvailable`, mức hoạt động Swap, lỗi chính, quét thu hồi và PSI để phán đoán. `some` trong PSI biểu thị ít nhất có task phải dừng vì áp lực bộ nhớ, `full` biểu thị tất cả các task không idle đều đồng thời dừng vì tài nguyên đó, thường phản ánh ảnh hưởng của áp lực bộ nhớ đến độ trễ nghiệp vụ rõ hơn.

## Overcommit và OOM: cấp phát thành công không có nghĩa bộ nhớ vật lý đã sẵn sàng

Linux có thể cho phép bộ nhớ ảo mà tiến trình cam kết vượt quá RAM và Swap hiện tại, đây gọi là overcommit bộ nhớ. Nó phù hợp với những chương trình sẽ xin không gian địa chỉ rất lớn nhưng chỉ thực sự dùng một phần trong đó.

`vm.overcommit_memory` thường có 3 chế độ:

- `0`: phán đoán heuristic, từ chối các yêu cầu rõ ràng bất hợp lý.
- `1`: cho phép xin hết mức có thể, cho đến khi thực sự cạn kiệt tài nguyên.
- `2`: dùng giới hạn commit nghiêm ngặt hơn.

Vì vậy, `malloc()` hoặc `mmap()` thành công, thường chỉ biểu thị không gian địa chỉ và kiểm tra commit đã qua, không đại diện các trang vật lý tương ứng đã toàn bộ cư trú. Khi trang thực sự được truy cập, mà nhân lại không thể qua thu hồi, ghi ngược hoặc Swap lấy đủ bộ nhớ, có thể kích hoạt OOM Killer, chọn tiến trình để chấm dứt nhằm giải phóng tài nguyên.

Trong container, còn có thể trước hết kích hoạt OOM trong phạm vi cgroup. Máy chủ tổng thể vẫn có bộ nhớ khả dụng, một container nào đó cũng có thể vì chạm trần `memory.max` mà bị giới hạn; `memory.events` của cgroup v2 sẽ ghi lại các sự kiện như `high`, `max`, `oom`, `oom_kill`.

## mmap, COW và bộ nhớ dùng chung

`mmap()` tạo một đoạn ánh xạ trong không gian địa chỉ ảo của tiến trình. Nó có thể ánh xạ tệp, cũng có thể tạo ánh xạ ẩn danh. Khi ánh xạ được thiết lập không nhất thiết đọc dữ liệu ngay, chỉ khi thực sự truy cập đến trang chưa cư trú, mới có thể kích hoạt lỗi trang.

Ánh xạ tệp phù hợp với truy cập ngẫu nhiên, chia sẻ trang tệp, cũng như các tình huống muốn truy cập trực tiếp nội dung tệp theo địa chỉ bộ nhớ. Nó có thể giảm các thao tác sao chép buffer user tường minh và system call, nhưng không đảm bảo nhanh hơn `read()`/`write()`; hiệu quả thực tế còn phụ thuộc vào kiểu truy cập, chi phí lỗi trang, pread, ghi ngược, xử lý ngoại lệ và kích thước tệp.

Khi nhiều tiến trình ánh xạ cùng một tệp, nhân có thể cho chúng chia sẻ các trang vật lý trong Page Cache. Sửa đổi của `MAP_SHARED` có thể nhìn thấy được với các ánh xạ khác, đồng thời có thể ghi ngược về tệp nền; `MAP_PRIVATE` tạo ánh xạ COW riêng tư, ghi không lan truyền sang tiến trình khác, cũng không ghi ngược về tệp gốc. IPC bộ nhớ dùng chung cũng là ý tưởng tương tự: địa chỉ ảo của các tiến trình khác nhau ánh xạ đến cùng một batch trang vật lý, đọc ghi dữ liệu không cần qua sao chép của nhân mỗi lần.

COW (Copy-On-Write, ghi khi sao chép) cũng rất phổ biến. Sau `fork()`, tiến trình cha và con ban đầu có thể chia sẻ cùng một batch trang vật lý, bảng trang đánh dấu chỉ đọc; ai ghi trước thì người đó kích hoạt lỗi trang, nhân sao chép một bản trang cho bên ghi. Như vậy tránh việc `fork()` phải sao chép ngay toàn bộ không gian địa chỉ.

Tuy nhiên, COW không phải bữa ăn miễn phí. Khi Redis làm snapshot RDB sẽ `fork()` tiến trình con, tiến trình cha tiếp tục xử lý các yêu cầu ghi; yêu cầu ghi càng nhiều, trang bị sao chép càng nhiều, áp lực bộ nhớ cũng càng lớn. Hiểu điểm này mới nhìn ra được các vấn đề về fork, mmap, Page Cache và đỉnh bộ nhớ trong nhiều hệ thống DB, cache.

## Quản lý bộ nhớ có quan hệ gì với backend Java?

Quản lý bộ nhớ của hệ điều hành không chỉ dừng ở sách giáo khoa. Backend Java thường gặp nhiều hiện tượng liên quan trong ngày thường.

**Heap JVM là một phần của không gian địa chỉ ảo.** `-Xmx` giới hạn giá trị tối đa heap Java, nhưng RSS của tiến trình còn bao gồm metaspace, thread stack, code cache JIT, DirectBuffer, thư viện native, ánh xạ tệp mmap, v.v. Thấy RSS lớn hơn `-Xmx`, không thể trực tiếp phán đoán là rò rỉ heap.

**Thread stack cũng chiếm địa chỉ ảo và trang vật lý.** Khi platform thread nhiều, chi phí thread stack, lập lịch, TLB và hiệu ứng miss cache đều nặng hơn. Virtual thread giảm được sự phụ thuộc vào platform thread của nhiều tác vụ bị chặn, nhưng các tác vụ CPU-bound vẫn bị giới hạn bởi số core.

**DirectBuffer và mmap không nằm trong heap Java.** Chúng do JVM hoặc code native quản lý, cuối cùng vẫn rơi vào không gian địa chỉ và trang vật lý của tiến trình. Khi xử lý sự cố không thể chỉ nhìn log GC, cũng phải kết hợp NMT, `pmap`, `smaps_rollup`, chỉ số cgroup cùng xem.

NMT của HotSpot mặc định tắt, cần thêm tham số khi JVM khởi động:

```bash
-XX:NativeMemoryTracking=summary
# hoặc
-XX:NativeMemoryTracking=detail

jcmd <pid> VM.native_memory summary
```

NMT thống kê bộ nhớ native theo subsystem của JVM, ví dụ Java Heap, Class, Code, Thread, v.v.; nhưng nó không phải sổ cái bộ nhớ tiến trình đầy đủ ở cấp hệ điều hành, cũng không thể bao phủ mọi cấp phát native library bên thứ ba. RSS/PSS, `smaps_rollup` và giới hạn bộ nhớ container vẫn phải xem cùng nhau.

**Trang lớn không phải lúc nào cũng có lợi.** Trang lớn giảm áp lực TLB, nhưng thu hồi trực tiếp của THP, nén bộ nhớ, xóa trang lớn và COW đều có thể gây dao động độ trễ. Redis chính thức đã nhắc rõ: tác vụ nền RDB/AOF phụ thuộc `fork()` và COW, khi ghi nhiều bộ nhớ phụ thêm có thể tiệm cận gấp đôi mức dùng bình thường; THP còn có thể phóng đại chi phí COW sau `fork()`. JVM, DB và hệ cache không thể dùng chung một kết luận cố định, nên theo tài liệu sản phẩm và stress test với tải thực tế.

## Trả lời trong phỏng vấn như thế nào?

Nếu bị hỏi "quản lý bộ nhớ của hệ điều hành làm gì", đừng bắt đầu học thuộc từ các thuật ngữ như phân trang, phân đoạn. Trước tiên kể mạch chính:

Hệ điều hành trước tiên cấp cho mỗi tiến trình một không gian địa chỉ ảo độc lập, rồi qua bảng trang, TLB và MMU dịch địa chỉ ảo thành địa chỉ vật lý. Bảng trang không chỉ làm dịch địa chỉ, còn ghi lại quyền, có trong bộ nhớ hay không, có bị sửa không, có được truy cập không. Khi bộ nhớ vật lý căng thẳng, nhân lại theo độ nóng/lạnh của trang, loại trang và mức nước hệ thống để thu hồi trang tệp hoặc trang ẩn danh, khi cần thiết mới động đến Swap.

Truy vấn sâu về phân trang và phân đoạn, hãy rút khác biệt về chỗ "cắt không gian địa chỉ như thế nào". Phân trang cắt theo kích thước cố định, bộ nhớ vật lý có thể cấp phát rời rạc, về cơ bản loại bỏ phân mảnh ngoại vi; phân đoạn cắt theo các vùng logic như code, dữ liệu, stack, biểu đạt cấu trúc chương trình trực quan hơn, nhưng độ dài đoạn không cố định, dễ để lại phân mảnh ngoại vi. Hệ thống đa dụng hiện đại chủ yếu dựa vào phân trang, phân đoạn dùng nhiều hơn để hiểu các thiết kế lịch sử và bảo vệ logic.

Lỗi trang có thể kể theo quá trình xử lý: CPU truy cập một địa chỉ ảo, mục bảng trang không tồn tại, trang không ở trong bộ nhớ, hoặc quyền không khớp, sẽ kích hoạt page fault. Nhân trước tiên phán đoán truy cập này có hợp pháp hay không; truy cập bất hợp pháp thường biến thành `SIGSEGV`, chỉ truy cập hợp pháp mới dựng trang theo loại ánh xạ, ví dụ ánh xạ trang Page Cache đã có, cấp phát trang ẩn danh, xử lý COW, hoặc nạp trang từ tệp và Swap. `minor fault` thường không cần I/O, `major fault` cần I/O.

Nếu thực sự nói đến xử lý sự cố trong production, bổ sung giới hạn này: thuật toán sách giáo khoa phù hợp để hiểu ý tưởng, nhưng thu hồi bộ nhớ Linux, THP, NUMA, giới hạn bộ nhớ cgroup, nén bộ nhớ và cache quản lý của riêng DB đều chồng lên nhau. Khi định vị vấn đề, dùng một "LRU" để giải thích mọi hiện tượng, thường là không đủ.
