---
title: "Tổng hợp các câu hỏi phỏng vấn thường gặp về Hệ điều hành (Phần 1)"
description: "Tổng hợp các câu hỏi phỏng vấn hệ điều hành tần suất cao mới nhất (Phần 1): trạng thái user mode và kernel mode, ngắt, ngoại lệ, hệ thống gọi (system call), tiến trình và luồng, chuyển ngữ cảnh, thuật toán điều phối CPU, Linux CFS/EEVDF, tải hệ thống và deadlock cùng các trọng điểm cốt lõi."
category: Cơ sở khoa học máy tính
tag:
  - Hệ điều hành
head:
  - - meta
    - name: keywords
      content: câu hỏi phỏng vấn hệ điều hành,user mode vs kernel mode,ngắt,ngoại lệ,system call,tiến trình vs luồng,trạng thái tiến trình,PCB,TCB,fork,exec,wait,IPC giữa các tiến trình,thuật toán điều phối CPU,CFS,EEVDF,load average,chuyển ngữ cảnh,điều kiện cần của deadlock
---

<!-- markdownlint-disable MD033 -->

Nhiều bạn đọc phàn nàn rằng kiến thức về máy tính và hệ điều hành khá rối rắm, bản thân cũng không có nhiều kiên nhẫn để đọc, nhưng khi phỏng vấn lại rất hay gặp. Vì vậy, mình mang đến cho các bạn bộ câu hỏi thường gặp về hệ điều hành mà mình đã biên soạn đây!

Bài bài viết này, "Tổng hợp các câu hỏi phỏng vấn thường gặp về Hệ điều hành (Phần 1)", sẽ bắt đầu từ những kiến thức cơ bản về hệ điều hành, sau đó tập trung sắp xếp các trọng điểm tần suất cao như **user mode/kernel mode, system call, tiến trình và luồng, giao tiếp giữa các tiến trình, điều phối tiến trình, deadlock**. Nó phù hợp để nhanh chóng xây dựng danh sách câu hỏi phỏng vấn, cũng phù hợp làm điểm vào để rà soát bổ sung kiến thức còn thiếu khi ôn tập.

Học hệ điều hành không chỉ để học vẹt (thuộc lòng). Những tư tưởng như bộ nhớ cache, điều phối, đồng bộ, ánh xạ bộ nhớ, zero-copy, I/O đa kênh đều có thể thấy bóng dáng trong Redis, Kafka, Nginx, Netty, JVM, cơ sở dữ liệu. Nghĩ rõ cơ chế tầng dưới, rồi mới hiểu các framework tầng trên và các vấn đề hiệu năng khi vận hành sẽ dễ dàng hơn nhiều.

Bài viết này thiên về "tra cứu nhanh phỏng vấn + nối chuỗi các khái niệm cốt lõi", nếu muốn học sâu thì vẫn nên kết hợp với giáo trình và các bài viết chuyên đề. Một phần nội dung trong bài tham khảo từ cuốn "Hệ điều hành hiện đại (Modern Operating Systems)" ấn bản thứ ba, xin gửi lời cảm ơn.

## Cơ bản về hệ điều hành

![Sơ đồ tri thức cơ bản về hệ điều hành](https://oss.javaguide.cn/2020-8/image-20200807161118901.png)

### Hệ điều hành là gì?

Có thể khái quát hệ điều hành thực chất là gì qua bốn điểm sau:

1. Hệ điều hành (Operating System, viết tắt OS) là chương trình quản lý tài nguyên phần cứng và phần mềm của máy tính, là nền tảng (viên gạch nền móng) của máy tính.
2. Về bản chất, hệ điều hành là một chương trình phần mềm chạy trên máy tính, chủ yếu dùng để quản lý tài nguyên phần cứng và phần mềm của máy tính. Ví dụ: tất cả ứng dụng chạy trên máy tính của bạn đều thông qua hệ điều hành để gọi bộ nhớ hệ thống, ổ đĩa và các phần cứng khác.
3. Hệ điều hành che giấu đi sự phức tạp của tầng phần cứng. Hệ điều hành giống như người chịu trách nhiệm sử dụng phần cứng, điều phối và xử lý các vấn đề liên quan.
4. Nhân (Kernel) của hệ điều hành là phần cốt lõi của hệ điều hành, nó chịu trách nhiệm quản lý bộ nhớ hệ thống, quản lý thiết bị phần cứng, quản lý hệ thống tệp và quản lý ứng dụng. Nhân là cầu nối giữa ứng dụng và phần cứng, quyết định tính năng và độ ổn định của hệ thống.

Nhiều người hay nhầm lẫn nhân (Kernel) của hệ điều hành với bộ xử lý trung tâm (CPU, Central Processing Unit). Bạn có thể phân biệt đơn giản qua hai điểm sau:

1. Nhân (Kernel) của hệ điều hành thuộc tầng hệ điều hành, còn CPU thuộc về phần cứng.
2. CPU chủ yếu cung cấp khả năng tính toán và xử lý các loại lệnh. Nhân (Kernel) chủ yếu chịu trách nhiệm quản lý hệ thống như quản lý bộ nhớ, nó che giấu việc thao tác với phần cứng.

Hình dưới minh họa rõ mối quan hệ giữa ứng dụng, nhân và CPU.

![Mối quan hệ giữa ứng dụng, nhân và CPU](https://oss.javaguide.cn/2020-8/Kernel_Layout.png)

### Hệ điều hành có những chức năng chính nào?

Từ góc độ quản lý tài nguyên, hệ điều hành có 6 chức năng chính:

1. **Quản lý tiến trình và luồng**: tạo, hủy, chặn, đánh thức tiến trình, giao tiếp giữa các tiến trình, v.v.
2. **Quản lý lưu trữ**: cấp phát và thu hồi bộ nhớ, chuyển đổi địa chỉ, cách ly tiến trình, thu hồi trang, và quản lý không gian lưu trữ ngoài, v.v.
3. **Quản lý tệp**: tổ chức các khối lưu trữ tầng dưới thành tệp và thư mục, chịu trách nhiệm đọc ghi, tạo, xóa, kiểm soát quyền hạn và khôi phục sau sự cố của tệp, v.v.
4. **Quản lý thiết bị**: hoàn thành việc yêu cầu hoặc giải phóng thiết bị (thiết bị nhập xuất và thiết bị lưu trữ ngoài, v.v.), cùng các chức năng như khởi động thiết bị.
5. **Quản lý mạng**: hệ điều hành chịu trách nhiệm quản lý việc sử dụng mạng máy tính. Mạng là cách kết nối các máy tính khác nhau trong hệ thống máy tính, hệ điều hành cần quản lý cấu hình, kết nối, giao tiếp và bảo mật của mạng máy tính, v.v., để cung cấp dịch vụ mạng hiệu quả và đáng tin cậy.
6. **Quản lý an toàn**: xác thực danh tính người dùng, kiểm soát truy cập, mã hóa tệp, v.v., để ngăn chặn người dùng trái phép truy cập và thao tác tài nguyên hệ thống.

Quản lý bộ nhớ và hệ thống tệp là hai mảng dễ bị hỏi tiếp nhất trong phỏng vấn hệ điều hành, sẽ được triển khai riêng trong bài: [Tổng hợp các câu hỏi phỏng vấn hệ điều hành (Phần 2)](./operating-system-basic-questions-02.md).

### Các hệ điều hành phổ biến là gì?

#### Windows

Hệ điều hành máy tính cá nhân phổ biến nhất hiện nay, không cần giới thiệu nhiều, ai cũng biết. Giao diện đơn giản dễ dùng, hệ sinh thái phần mềm rất tốt.

_Chơi game trên PC vẫn phải có Windows, nên hiện tại mình dùng một máy Windows để chơi game, một máy Mac cho công việc phát triển và học tập hàng ngày._

![Giao diện hệ điều hành máy tính để bàn Windows](./images/windows.png)

#### Unix

Unix là một trong những hệ điều hành đa người dùng, đa nhiệm có ảnh hưởng nhất thời kỳ đầu, các hệ thống giống Unix như Linux, BSD sau này đều chịu ảnh hưởng của nó. Thị phần của Unix thương mại truyền thống đã giảm rõ rệt, nhưng tiêu chuẩn Unix, hệ thống chứng nhận và tư tưởng thiết kế của nó vẫn còn được sử dụng.

![Logo hệ điều hành Unix](./images/unix.png)

#### Linux

**Linux là một hệ điều hành giống Unix miễn phí sử dụng, mã nguồn mở.** Linux có nhiều bản phân phối khác nhau, nhưng tất cả đều sử dụng **nhân Linux**.

> Nói một cách nghiêm ngặt, từ "Linux" tự thân nó chỉ đại diện cho nhân Linux, trong hệ thống GNU/Linux, Linux về thực tế chính là nhân Linux, còn phần còn lại của hệ thống chủ yếu do các chương trình do dự án GNU biên soạn và cung cấp. Riêng bản thân nhân Linux không thể trở thành một hệ điều hành hoạt động bình thường được.
>
> **Nhiều người có xu hướng dùng từ "GNU/Linux" để diễn đạt cái mà người ta thường gọi là "Linux".**

![Giao diện dòng lệnh và màn hình nền hệ điều hành Linux](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/linux.png)

#### Mac OS

Hệ điều hành của riêng Apple, trải nghiệm lập trình tương đương với Linux, nhưng giao diện, hệ sinh thái phần mềm cùng trải nghiệm người dùng các mặt đều tốt hơn hệ điều hành Linux.

![Giao diện hệ điều hành màn hình nền macOS](./images/macos.png)

### User mode và kernel mode

#### User mode và kernel mode là gì?

User mode và kernel mode mô tả mức đặc quyền khi CPU thực thi mã. Mã ứng dụng thường chạy ở user mode; khi cần truy cập tài nguyên được bảo vệ, CPU sẽ đi vào kernel mode theo cổng vào quy định, do nhân đại diện cho luồng hiện tại hoàn thành thao tác.

![User mode và kernel mode](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/usermode-and-kernelmode.png)

- **User mode (User Mode)**: quyền hạn thấp, không thể trực tiếp thực thi lệnh đặc quyền, cũng không thể tùy tiện truy cập không gian địa chỉ nhân hoặc thao tác phần cứng. Khi ứng dụng đọc tệp, gửi nhận dữ liệu mạng, cần thông qua system call để yêu cầu dịch vụ nhân.
- **Kernel mode (Kernel Mode)**: quyền hạn cao, có thể thực thi các thao tác đặc quyền như quản lý bảng trang, ngắt, thiết bị. Sau khi system call, ngắt hoặc ngoại lệ đồng bộ đi vào nhân, chạy là mã của nhân, không phải biến toàn bộ tiến trình người dùng thành "tiến trình nhân".

Việc chuyển đổi user mode/kernel mode cần đi qua cổng vào do kiến trúc quy định, lưu trạng thái cần thiết và thực hiện kiểm tra quyền hạn và tham số, vì vậy nặng nề hơn so với lời gọi hàm thông thường. Nhưng nó không đồng nghĩa với chuyển ngữ cảnh luồng: chỉ khi bộ điều phối thay bằng một thực thể thực thi khác, mới xảy ra chuyển ngữ cảnh luồng.

#### Tại sao cần có user mode và kernel mode? Một mình kernel mode không được sao?

Thiết kế như vậy chủ yếu vì sự **an toàn** và **ổn định**.

- **Hạn chế thao tác đặc quyền**: các thao tác như sửa bảng trang, điều khiển ngắt, truy cập thanh ghi thiết bị cụ thể sẽ ảnh hưởng đến toàn hệ thống, chỉ có nhân mới được thực hiện.
- **Cách ly sự cố và quyền hạn**: nếu ứng dụng đều có thể chạy với quyền nhân, một lần ghi vượt giới hạn hay chương trình độc hại có thể phá hủy dữ liệu của tiến trình khác và nhân, sự cách ly tiến trình cũng mất đi nền tảng cơ sở.

Cơ chế mức đặc quyền này giới hạn các ứng dụng thông thường trong môi trường được kiểm soát, còn phần cứng và tài nguyên hệ thống được giao thống nhất cho nhân quản lý.

#### User mode và kernel mode chuyển đổi bằng cách nào?

![3 cách chuyển từ user mode sang kernel mode](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/the-way-switch-between-user-mode-and-kernel-mode.drawio.png)

Các sự kiện khiến CPU đi từ user mode vào kernel mode có ba loại chính:

1. **System call (Trap)**: ứng dụng chủ động thực thi các lệnh như `syscall`, `ecall`, yêu cầu nhân hoàn thành các thao tác như `read()`, `send()`. Nó được kích hoạt bởi lệnh hiện tại, thuộc sự kiện đồng bộ.
2. **Ngắt phần cứng (Interrupt)**: được kích hoạt bởi phần cứng ngoài như bộ định thời (timer), card mạng, ổ đĩa, không có quan hệ trực tiếp với lệnh đang thực thi, vì vậy thuộc sự kiện bất đồng bộ.
3. **Ngoại lệ đồng bộ (Exception)**: do lệnh hiện tại kích hoạt, ví dụ chia cho 0, lệnh bất hợp pháp hoặc Page Fault. Ngoại lệ không nhất thiết có nghĩa chương trình có lỗi; lười phân bổ (lazy allocation), COW và nạp trang từ tệp cũng có thể kích hoạt Page Fault có thể khôi phục.

Ngắt, ngoại lệ và system call mô tả vì sao CPU đi vào nhân; tín hiệu (signal) là cơ chế phần mềm mà nhân thông báo cho tiến trình hoặc luồng. Truy cập bộ nhớ bất hợp pháp có thể trước tiên kích hoạt Page Fault, sau khi nhân xác định không thể sửa chữa, lại gửi `SIGSEGV` cho luồng hiện tại.

Chi tiết điểm vào của các kiến trúc khác nhau không hoàn toàn giống nhau, nhưng đều chuyển đến điểm xử lý nhân tương ứng theo loại sự kiện. So sánh khái niệm hoàn chỉnh và đường xử lý có thể xem: [Giải thích chi tiết ngắt, ngoại lệ và system call: từ điểm vào nhân đến ngoại lệ hỏng trang](./interrupt-exception-syscall.md).

### System call

#### System call là gì?

System call là giao diện dịch vụ được kiểm soát mà nhân cung cấp cho chương trình người dùng. Ứng dụng không thể trực tiếp thao tác các tài nguyên được bảo vệ như ổ đĩa, bảng trang và card mạng, cần thông qua system call để nhân thực hiện thay.

![Chương trình người dùng yêu cầu dịch vụ nhân thông qua system call](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/system-call.png)

Các system call này theo chức năng có thể được chia thành vài loại như sau:

- Quản lý thiết bị: hoàn thành việc yêu cầu hoặc giải phóng thiết bị (thiết bị nhập xuất và thiết bị lưu trữ ngoài, v.v.), cùng các chức năng như khởi động thiết bị.
- Quản lý tệp: hoàn thành các chức năng như đọc, ghi, tạo và xóa tệp.
- Quản lý tiến trình: các chức năng như tạo, hủy, chặn, đánh thức tiến trình, giao tiếp giữa các tiến trình.
- Quản lý bộ nhớ: hoàn thành các chức năng như cấp phát, thu hồi bộ nhớ, lấy kích thước và địa chỉ của vùng bộ nhớ mà công việc (job) chiếm giữ.
- Giao tiếp mạng: tạo Socket, thiết lập kết nối, gửi nhận dữ liệu, v.v.

System call và hàm thư viện không phải là khái niệm cùng một tầng. Lời gọi hàm thông thường luôn thực thi ở user mode; hàm bọc `read()` do thư viện chạy như glibc cung cấp sẽ chuẩn bị số hiệu system call và tham số theo ABI, rồi thực thi lệnh đặc biệt để vào nhân. Cũng có rất nhiều hàm thư viện hoàn toàn không cần đến system call.

#### Quá trình của system call có hiểu không?

Lấy ví dụ `read(fd, buf, count)` dưới Linux x86-64, quá trình system call có thể khái quát là:

1. Hàm bọc glibc theo quy ước gọi, đặt số hiệu system call và tham số vào thanh ghi đã chỉ định, thực thi `syscall`.
2. CPU chuyển sang mức đặc quyền nhân và điểm vào tương ứng. Mã điểm vào của nhân lưu trạng thái thanh ghi cần thiết sau này, rồi theo số hiệu system call phân phối đến logic xử lý tương ứng với `read`.
3. Nhân kiểm tra file descriptor, vùng đệm người dùng, quyền truy cập và trạng thái tệp, rồi đi vào các đường như VFS, hệ thống tệp, ngăn xếp giao thức mạng hoặc trình điều khiển thiết bị.
4. Khi dữ liệu đã sẵn sàng, nhân hoàn thành việc đọc và trả về kết quả; khi dữ liệu chưa sẵn sàng, luồng hiện tại có thể vào trạng thái chờ, bộ điều phối chuyển sang chạy các tác vụ chạy được khác.
5. Sau khi lời gọi hoàn tất, giá trị trả về thông qua thanh ghi được trao cho user mode. Khi xảy ra lỗi, glibc thường chuyển mã lỗi của nhân thành `-1` và `errno`.

![Quá trình của system call](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/system-call-procedure.png)

#### System call có nhất định xảy ra chuyển ngữ cảnh không?

System call khiến CPU đi vào kernel mode. Nếu nhân xử lý nhanh chóng rồi trả về luồng ban đầu, toàn bộ quá trình chỉ có chuyển đổi user mode/kernel mode, không chuyển luồng.

Khi system call cần chờ I/O, khóa hoặc tài nguyên khác, luồng hiện tại có thể bị chặn, lúc đó bộ điều phối mới chọn một tác vụ chạy được khác, và lúc này mới xảy ra chuyển ngữ cảnh luồng. Ngược lại, khi ngắt đồng hồ đi vào nhân, nếu bộ điều phối vẫn để luồng ban đầu tiếp tục chạy, thì cũng không xảy ra chuyển luồng.

Chuỗi gọi `read()` đầy đủ hơn, ngắt tín hiệu và khởi động lại system call có thể xem: [Giải thích chi tiết ngắt, ngoại lệ và system call: từ điểm vào nhân đến ngoại lệ hỏng trang](./interrupt-exception-syscall.md).

## Tiến trình và luồng

Tiến trình và luồng là một nhóm khái niệm khó tránh trong phỏng vấn hệ điều hành. Dưới đây trước tiên đưa ra đáp án ngắn gọn cho các cách hỏi tần suất cao, muốn học bài bản thì có thể tiếp tục đọc các bài viết chi tiết này:

- [Giải thích chi tiết tiến trình và luồng: khác biệt, trạng thái, giao tiếp, chuyển ngữ cảnh và luồng ảo](./process-and-thread.md), đường dẫn: `./process-and-thread.md`
- [Giải thích chi tiết giao tiếp giữa các tiến trình (IPC): pipe, hàng đợi tin nhắn, bộ nhớ dùng chung, Socket và Binder](./ipc.md), đường dẫn: `./ipc.md`
- [Giải thích chi tiết điều phối CPU và tải hệ thống](./cpu-scheduling-and-load.md), đường dẫn: `./cpu-scheduling-and-load.md`

### Sự khác biệt giữa tiến trình và luồng là gì?

Tiến trình và luồng là hai khái niệm cốt lõi của việc thực thi đồng thời trong hệ điều hành, mối quan hệ của chúng có thể hiểu là mối quan hệ **giữa nhà máy và công nhân**.

![Mối quan hệ giữa chương trình, tiến trình và luồng](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/relationship-between-program-process-and-thread.png)

**Tiến trình (Process) giống như một nhà máy**. Khi hệ điều hành cấp phát tài nguyên, lấy tiến trình làm đơn vị cơ bản. Ví dụ, khi mình khởi động WeChat, hệ điều hành đã thiết lập cho nó một nhà máy độc lập, cấp cho nó không gian bộ nhớ riêng, file handle và các tài nguyên khác. Nhà máy này được cách ly nghiêm ngặt với các nhà máy khác (ví dụ tiến trình trình duyệt mình đang mở).

**Luồng (Thread) lại giống như công nhân trong nhà máy**. Một nhà máy có thể có nhiều công nhân, họ dùng chung tài nguyên của nhà máy, nhưng mỗi công nhân có bộ công cụ và danh sách công việc của riêng mình, để họ có thể độc lập thực thi các nhiệm vụ khác nhau. Ví dụ trong nhà máy WeChat, có thể có một công nhân (luồng) chuyên nhận tin nhắn, một công nhân chuyên vẽ giao diện.

Đây là bức ảnh mình vẽ bằng AI, có thể nói là rất sinh động:

![Dùng phép so sánh nhà máy WeChat để phân biệt tiến trình và luồng](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/wechat-factory-process-thread.png)

Hình dưới là vùng bộ nhớ Java, chúng ta nói về mối quan hệ giữa luồng và tiến trình từ góc độ JVM nhé!

![Vùng dữ liệu thời gian chạy Java (sau JDK1.8)](https://oss.javaguide.cn/github/javaguide/java/jvm/java-runtime-data-areas-jdk1.8.png)

Có thể thấy từ hình trên: một tiến trình có thể có nhiều luồng, nhiều luồng dùng chung tài nguyên **heap** và **method area (metaspace sau JDK1.8)** của tiến trình, nhưng mỗi luồng có **program counter**, **virtual machine stack** và **native method stack** của riêng mình.

![Nội dung luồng chia sẻ và riêng tư](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/thread-shared-and-private-content.png)

Có thể tổng kết từ 5 góc độ: tài nguyên, điều phối, giao tiếp, chi phí và độ tin cậy:

| Chiều              | Tiến trình                                                                                     | Luồng                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Định vị cơ bản     | Đơn vị cơ bản của cấp phát và cách ly tài nguyên                                               | Đơn vị cơ bản của điều phối và thực thi CPU                                                  |
| Không gian địa chỉ | Mặc định có không gian địa chỉ ảo độc lập                                                      | Các luồng trong cùng tiến trình chia sẻ không gian địa chỉ của tiến trình                    |
| Nội dung riêng tư  | Tài nguyên cấp tiến trình như PID, không gian địa chỉ, bảng tệp mở, thông tin quyền hạn        | Trạng thái thực thi như ID luồng, ngăn xếp, thanh ghi, program counter, lưu trữ cục bộ luồng |
| Cách giao tiếp     | Cần IPC, ví dụ pipe, hàng đợi tin nhắn, bộ nhớ dùng chung, Socket                              | Có thể trực tiếp đọc ghi bộ nhớ dùng chung, nhưng phải xử lý đồng bộ và an toàn luồng        |
| Chi phí tạo/chuyển | Thường cao hơn, chuyển tiến trình có thể liên quan chuyển không gian địa chỉ, TLB invalid v.v. | Thường thấp hơn, chuyển luồng cùng tiến trình thường không cần đổi toàn bộ ánh xạ địa chỉ    |
| Ảnh hưởng sự cố    | Khả năng cách ly tốt hơn, một tiến trình sụp đổ thường không ảnh hưởng tiến trình khác         | Một luồng lỗi có thể khiến toàn bộ tiến trình thoát                                          |

Câu trả lời phỏng vấn tương đối hoàn chỉnh có thể tổ chức như sau:

> Tiến trình là bộ chứa tài nguyên khi chương trình chạy, sở hữu không gian địa chỉ ảo độc lập cùng các tài nguyên như tệp, quyền hạn; luồng là luồng thực thi bên trong tiến trình, nhiều luồng chia sẻ tài nguyên tiến trình, nhưng mỗi luồng tự lưu ngăn xếp, thanh ghi, program counter và các trạng thái thực thi khác. Cách ly giữa các tiến trình mạnh hơn, chi phí giao tiếp và chuyển ngữ cảnh cao hơn; hợp tác giữa các luồng tiện hơn, tạo và chuyển thường nhẹ hơn, nhưng bộ nhớ dùng chung mang đến vấn đề an toàn luồng.

### Đã có tiến trình vì sao vẫn cần đến luồng?

Lý do cốt lõi chính là **để trong một ứng dụng duy nhất đạt được tính đồng thời chi phí thấp, hiệu quả cao**.

Nếu một máy chủ phải đồng thời xử lý đọc ghi mạng, tính toán nghiệp vụ, ghi log xuống đĩa, dùng nhiều tiến trình tất nhiên cũng làm được, nhưng trạng thái chia sẻ giữa các tiến trình rắc rối, giao tiếp phải đi qua IPC, chiếm tài nguyên cũng cao hơn. Đổi sang nhiều luồng, chúng có thể trực tiếp chia sẻ heap và các kết nối đã mở, chỉ cần đồng bộ đúng, chi phí hợp tác thấp hơn nhiều.

Luồng cũng có thể nâng cao tỷ lệ sử dụng tài nguyên. Trên CPU đơn nhân, khi một luồng bị chặn ở I/O đĩa hoặc mạng, các luồng khác vẫn có thể tiếp tục chạy; trên CPU đa nhân, nhiều luồng có cơ hội thực thi song song trên các nhân khác nhau. Tuy nhiên, luồng không phải càng nhiều càng tốt. Quá nhiều luồng sẽ mang đến các vấn đề như chiếm bộ nhớ ngăn xếp, chi phí điều phối, cạnh tranh khóa và mất hiệu lực cache, cấu hình số luồng của tác vụ CPU-bound và tác vụ I/O-bound cũng không giống nhau.

### Đa luồng nhất định có thể nâng cao hiệu suất không?

Việc đa luồng có tăng tốc hay không phụ thuộc vào loại tác vụ, số nhân CPU và cạnh tranh tài nguyên dùng chung:

- **Tác vụ I/O-bound (nhiều I/O)**: khi một luồng chờ đĩa, mạng hoặc khóa, các luồng chạy được khác có thể tiếp tục sử dụng CPU, đa luồng có thể che giấu một phần thời gian chờ.
- **Tác vụ CPU-bound (nặng tính toán)**: các phép tính có thể tách rời và độc lập có thể phân phối đến nhiều nhân CPU thực thi song song, nhưng hiệu quả tăng tốc vẫn chịu ảnh hưởng của phần tuần tự, phụ thuộc dữ liệu, cache và chi phí điều phối.
- **Quá nhiều luồng**: khi số luồng chạy được nhiều hơn hẳn số nhân CPU, hàng đợi chạy sẽ dài ra, chuyển ngữ cảnh, mất hiệu lực cache và cạnh tranh khóa tăng theo, thông lượng và độ trễ đều có thể trở nên kém hơn.

Số lượng luồng cần kết hợp đặc điểm tác vụ, quota CPU, tỷ lệ bị chặn và kết quả ép tải (stress test) để cài đặt, không thể chỉ tính suy ra từ số nhân vật lý của máy chủ hoặc số yêu cầu đồng thời.

### Các cách đồng bộ giữa các luồng là gì?

Đồng bộ luồng là thực thi đồng thời của hai hoặc nhiều luồng dùng chung tài nguyên then chốt. Nên đồng bộ các luồng để tránh xung đột khi dùng tài nguyên then chốt.

Dưới đây là vài cách đồng bộ luồng phổ biến:

1. **Khóa loại trừ lẫn nhau (Mutex)**: dùng cơ chế đối tượng loại trừ, chỉ luồng sở hữu đối tượng loại trừ mới có quyền truy cập tài nguyên công cộng. Vì đối tượng loại trừ chỉ có một, nên có thể đảm bảo tài nguyên công cộng không bị nhiều luồng cùng lúc truy cập. Ví dụ từ khóa `synchronized` và các `Lock` trong Java đều là cơ chế này.
2. **Khóa đọc ghi (Read-Write Lock)**: cho phép nhiều luồng đồng thời đọc tài nguyên dùng chung, nhưng chỉ một luồng có thể thực hiện thao tác ghi lên tài nguyên dùng chung.
3. **Signal lượng (Semaphore)**: nó cho phép nhiều luồng truy cập cùng một tài nguyên tại cùng một thời điểm, nhưng cần kiểm soát số luồng tối đa được truy cập tài nguyên này tại cùng thời điểm.
4. **Rào chắn (Barrier)**: barrier là một nguyên thủy đồng bộ, dùng để chờ nhiều luồng đến một điểm nào đó rồi cùng tiếp tục thực thi. Khi một luồng đến barrier, nó sẽ dừng thực thi và chờ các luồng khác đến barrier, cho đến khi tất cả luồng đều đến barrier rồi chúng mới cùng nhau tiếp tục thực thi. Ví dụ `CyclicBarrier` trong Java là cơ chế này.
5. **Biến điều kiện (Condition Variable)/thông báo sự kiện**: luồng chờ khi điều kiện không được thỏa mãn, các luồng khác thông báo luồng chờ tiếp tục thực thi sau khi điều kiện thay đổi. Nó thường cần kết hợp với khóa loại trừ lẫn nhau để tránh vấn đề mất thông báo do "thông báo xảy ra trước, chờ xảy ra sau". `Object.wait()/notify()`, `Condition.await()/signal()` trong Java đều thuộc loại ý tưởng này; đối tượng Event trong Windows cũng có thể xem như một triển khai của nguyên thủy đồng bộ loại thông báo sự kiện.

### PCB là gì? Chứa những thông tin nào?

**PCB (Process Control Block)** tức khối điều khiển tiến trình, là cấu trúc dữ liệu mà hệ điều hành dùng để quản lý và theo dõi tiến trình, mỗi tiến trình tương ứng với một PCB độc lập. Bạn có thể xem PCB như bộ não của tiến trình.

Khi hệ điều hành tạo một tiến trình mới, nó sẽ cấp cho tiến trình đó một ID tiến trình duy nhất, và tạo cho tiến trình đó một khối điều khiển tiến trình tương ứng. Khi tiến trình thực thi, thông tin trong PCB liên tục thay đổi, hệ điều hành sẽ dựa vào những thông tin này để quản lý và điều phối tiến trình.

- **Thông tin nhận dạng**: PID, ID tiến trình cha, ID người dùng, v.v.
- **Trạng thái tiến trình và thông tin điều phối**: sẵn sàng, đang chạy, bị chặn, mức độ ưu tiên, time slice, thống kê thời gian CPU, v.v.
- **Ngữ cảnh CPU**: program counter, con trỏ ngăn xếp, thanh ghi tổng dụng, từ trạng thái chương trình PSW, v.v., dùng để khôi phục thực thi sau khi chuyển ngữ cảnh.
- **Thông tin quản lý bộ nhớ**: không gian địa chỉ ảo, bảng trang, ánh xạ bộ nhớ, v.v.
- **Thông tin tài nguyên**: tệp mở, file descriptor, trạng thái I/O, thư mục làm việc, thông tin xử lý tín hiệu, v.v.
- ……

Khi xảy ra chuyển ngữ cảnh, hệ điều hành sẽ lưu thanh ghi và các trạng thái hiện trường của tiến trình hiện tại vào PCB, rồi từ PCB của tiến trình tiếp theo khôi phục hiện trường, để nó có thể tiếp tục thực thi từ vị trí đã tạm dừng lần trước.

### TCB là gì? Quan hệ với PCB thế nào?

**TCB (Thread Control Block)** tức khối điều khiển luồng, dùng để lưu thông tin điều khiển ở mức luồng, ví dụ ID luồng, trạng thái luồng, hiện trường thanh ghi, thông tin ngăn xếp, mức độ ưu tiên điều phối, lưu trữ cục bộ luồng, v.v.

Trong một số giáo trình hoặc triển khai hệ thống, PCB và TCB là tách rời: PCB thiên về tài nguyên mức tiến trình, TCB thiên về hiện trường thực thi mức luồng. Triển khai của Linux khá đặc biệt, nó xem cả tiến trình và luồng đều là task, dùng `task_struct` mô tả thực thể điều phối, rồi thông qua việc cấu trúc tài nguyên có được chia sẻ hay không để phân biệt tiến trình và luồng. Khi hiểu không cần quá câu nệ tên gọi, then chốt là phân rõ: **không gian địa chỉ, bảng tệp... thuộc ranh giới tài nguyên; ngăn xếp, thanh ghi, program counter... thuộc hiện trường thực thi**.

### Tiến trình có mấy loại trạng thái?

Chúng ta thường phân tiến trình thành 5 loại trạng thái, điểm này rất giống với luồng:

- **Trạng thái tạo (new)**: tiến trình đang được tạo, chưa đến trạng thái sẵn sàng.
- **Trạng thái sẵn sàng (ready)**: tiến trình đã ở trạng thái sẵn sàng chạy, tức tiến trình đã có mọi tài nguyên cần thiết ngoại trừ bộ xử lý, một khi có được tài nguyên bộ xử lý (time slice được bộ xử lý cấp phát) thì có thể chạy.
- **Trạng thái chạy (running)**: tiến trình đang chạy trên bộ xử lý (trên CPU đơn nhân, tại bất kỳ thời điểm nào chỉ có một tiến trình ở trạng thái đang chạy).
- **Trạng thái chặn (waiting)**: còn gọi là trạng thái chờ, tiến trình đang tạm dừng chạy vì chờ một sự kiện nào đó, ví dụ chờ một tài nguyên trở nên khả dụng hoặc chờ thao tác IO hoàn thành. Dù bộ xử lý rảnh, tiến trình này cũng không thể chạy.
- **Trạng thái kết thúc (terminated)**: tiến trình đang biến mất khỏi hệ thống. Có thể là tiến trình kết thúc bình thường hoặc bị ngắt giữa chừng thoát khỏi trạng thái chạy vì lý do khác.

![Sơ đồ chuyển trạng thái của tiến trình](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/state-transition-of-process.png)

Khi chuyển trạng thái cần nhấn mạnh lý do kích hoạt: trạng thái sẵn sàng lấy được CPU sẽ vào trạng thái đang chạy; trạng thái đang chạy dùng hết time slice, có thể quay về trạng thái sẵn sàng; đang chạy phát sinh I/O chặn, chờ khóa hoặc chờ sự kiện, sẽ vào trạng thái chặn; sau khi sự kiện chờ của trạng thái chặn hoàn thành, thường trước tiên quay về trạng thái sẵn sàng, chờ lần tiếp theo được điều phối.

Một số giáo trình còn thêm vào **trạng thái treo (suspended)**. Treo nhấn mạnh tiến trình tạm thời không nằm trong bộ nhớ, hoặc bị người dùng/hệ thống tạm dừng; chặn nhấn mạnh tiến trình đang chờ một sự kiện nào đó. Hai cái không phải một chuyện: tiến trình có thể bị chặn nhưng vẫn nằm trong bộ nhớ, cũng có thể bị hoán đổi ra bộ lưu trữ ngoài rồi ở trạng thái chặn-treo.

### Các cách giao tiếp giữa các tiến trình là gì?

Tiến trình mặc định sở hữu không gian địa chỉ ảo độc lập, không thể trực tiếp truy cập bộ nhớ user mode của nhau, vì vậy cần đến **IPC (Inter-Process Communication, giao tiếp giữa các tiến trình)**.

Trong phỏng vấn, trước tiên cứ theo kịch bản sử dụng mà trả lời:

- Tiến trình cha con truyền lượng nhỏ luồng byte: anonymous pipe (pipe vô danh).
- Tiến trình không có quan hệ họ hàng giao tiếp nội bộ máy: named pipe (pipe có tên), Unix Domain Socket.
- Thông điệp có cấu trúc nhỏ: hàng đợi tin nhắn.
- Trao đổi khối dữ liệu lớn nội bộ máy: bộ nhớ dùng chung, nhưng phải kết hợp các cơ chế đồng bộ như signal lượng, khóa loại trừ lẫn nhau, `futex`, `eventfd`.
- Thông báo sự kiện bất đồng bộ: tín hiệu.
- Giao tiếp vượt máy: TCP/UDP Socket hoặc framework RPC tầng trên.

Cách phân loại, ranh giới và chọn lựa có hệ thống hơn có thể xem: [Giải thích chi tiết giao tiếp giữa các tiến trình (IPC): pipe, hàng đợi tin nhắn, bộ nhớ dùng chung, Socket và Binder](./ipc.md), đường dẫn: `./ipc.md`.

### fork, exec, wait lần lượt làm gì?

Trong lập trình Unix/Linux, việc tạo tiến trình và thay thế chương trình thường không thể thiếu ba thao tác `fork()`, `exec()`, `wait()`. Ở đây trước tiên ghi nhớ câu trả lời ngắn cho phỏng vấn, chi tiết hơn về kế thừa file descriptor, copy-on-write và `fork` đa luồng có thể xem: [Giải thích chi tiết tiến trình và luồng](./process-and-thread.md), đường dẫn: `./process-and-thread.md`.

![Chuỗi gọi của fork, exec, wait](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/fork-exec-wait-call-chain.png)

- **`fork()`**: tạo tiến trình con. Tiến trình cha con tiếp tục thực thi từ cùng một vị trí, nhưng giá trị trả về khác nhau.
- **`exec()`**: nạp một chương trình khác vào tiến trình hiện tại. Nó không tạo tiến trình mới, mà thay thế mã và dữ liệu user mode của tiến trình hiện tại.
- **`wait()`/`waitpid()`**: chờ thay đổi trạng thái của tiến trình con, và thu hồi thông tin trạng thái mà tiến trình con để lại trong nhân sau khi thoát.

Khi Shell khởi động lệnh ngoài, chuỗi thường gặp là: Shell trước tiên `fork()` ra tiến trình con, tiến trình con lại `exec()` thành chương trình đích, tiến trình cha dùng `wait()` hoặc `waitpid()` chờ và thu hồi trạng thái thoát. Nếu tiến trình cha mãi không thu hồi tiến trình con đã thoát, có thể để lại zombie process.

### Chuyển ngữ cảnh là gì?

Chuyển ngữ cảnh chỉ việc CPU chuyển từ một thực thể thực thi sang một thực thể thực thi khác. Hệ điều hành cần lưu thanh ghi, program counter, con trỏ ngăn xếp và các hiện trường khác của thực thể thực thi hiện tại, rồi khôi phục hiện trường của thực thể thực thi tiếp theo.

![So sánh chi phí của chuyển ngữ cảnh luồng và chuyển ngữ cảnh tiến trình](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/context-switch-cost-comparison.png)

Chuyển luồng và chuyển tiến trình đều có chi phí, nhưng chuyển tiến trình thường nặng hơn. Lý do là tiến trình có không gian địa chỉ độc lập, khi chuyển có thể liên quan đến việc chuyển bảng trang, TLB invalid, giảm tính cục bộ cache và các chi phí khác; các luồng trong cùng tiến trình chia sẻ không gian địa chỉ, khi chuyển thường không cần đổi toàn bộ ánh xạ bộ nhớ.

Có thể hiểu đơn giản hóa như sau: chuyển luồng trong cùng tiến trình, chủ yếu đổi ngăn xếp, thanh ghi, program counter và các hiện trường thực thi riêng của luồng; chuyển chéo tiến trình ngoài việc đổi hiện trường thực thi, còn có thể đổi không gian địa chỉ, và mang đến ảnh hưởng đến TLB và tính cục bộ cache. Trong phân tích hiệu năng trực tuyến, nếu phát hiện một lượng lớn thời gian dành vào điều phối, chờ khóa, system call và chuyển ngữ cảnh, thì tiếp tục thêm luồng một cách mù quáng thường chỉ làm tình hình tệ hơn.

Còn cần phân biệt giữa **chuyển ngữ cảnh** và **chuyển đổi user mode/kernel mode**. System call, Page Fault, ngắt phần cứng đều đi vào nhân, nhưng chỉ cần sau khi nhân xử lý vẫn trả về luồng ban đầu, thì không xảy ra chuyển ngữ cảnh luồng.

### Các thuật toán điều phối tiến trình là gì?

![Các thuật toán điều phối tiến trình phổ biến](https://oss.javaguide.cn/github/javaguide/cs-basics/network/scheduling-algorithms-of-process.png)

Các thuật toán điều phối tiến trình trong giáo trình dùng để minh họa: khi số tác vụ chạy được nhiều hơn số nhân CPU, nên để ai chạy trước. Bộ điều phối thường cần cân nhắc giữa **thông lượng, thời gian quay vòng, thời gian phản hồi, tính công bằng** và chi phí chuyển ngữ cảnh.

Các thuật toán này có thể chia thành hai loại: **không chiếm quyền (non-preemptive)** và **chiếm quyền (preemptive)**.

**Loại một: điều phối không chiếm quyền (Non-Preemptive)**

Với cách này, một khi CPU được cấp cho một tiến trình, nó sẽ cứ chạy mãi, cho đến khi hoàn thành nhiệm vụ hoặc chủ động từ bỏ (ví dụ chờ I/O).

1. **Đến trước phục vụ trước (FCFS, First Come, First Served)**: chạy theo thứ tự đến, triển khai đơn giản; khi tác vụ dài xếp trước, các tác vụ ngắn phía sau cũng phải chờ, sẽ xuất hiện hiệu ứng hộ tống (convoy effect).
2. **Tác vụ ngắn ưu tiên (SJF, Shortest Job First)**: ưu tiên chạy các tác vụ có thời gian thực thi dự kiến ngắn, có thể giảm thời gian chờ trung bình; trong thực tế rất khó dự đoán chính xác độ dài tác vụ, và có thể khiến tác vụ dài mãi không được chạy.

**Loại hai: điều phối chiếm quyền (Preemptive)**

Hệ điều hành có thể tạm dừng tác vụ hiện tại, giao CPU cho một tác vụ chạy được phù hợp hơn khác. Các hệ điều hành đa dụng hiện đại thường hỗ trợ chiếm quyền.

- **Luân phiên time slice (RR, Round-Robin)**: mỗi tác vụ luân phiên chạy một time slice. Time slice quá ngắn sẽ phóng đại chi phí chuyển ngữ cảnh, quá dài lại dần tiếp cận với FCFS.
- **Điều phối ưu tiên (Priority)**: ưu tiên chạy tác vụ có mức độ ưu tiên cao, có thể biểu đạt mức độ khẩn cấp của tác vụ, nhưng cần xử lý vấn đề đói tài nguyên (starvation) của tác vụ mức độ ưu tiên thấp.

**Hàng đợi phản hồi đa mức (MLFQ, Multi-Level Feedback Queue)** thiết lập nhiều hàng đợi ưu tiên, và điều chỉnh vị trí theo hành vi chạy của tác vụ. Tác vụ mới thường vào hàng đợi mức độ ưu tiên cao trước; tác vụ CPU-bound hay dùng hết toàn bộ time slice sẽ dần bị hạ cấp, tác vụ tương tác hay chủ động chờ I/O có thể giữ mức độ ưu tiên cao hơn. Các quy tắc lên/xuống cấp và chống đói cụ thể phụ thuộc vào triển khai.

FCFS, SJF, RR, Priority và MLFQ chủ yếu là mô hình đơn giản hóa trong giáo trình. Linux thực tế điều phối là task hoặc thực thể điều phối, tác vụ thông thường lâu dài do CFS theo trọng số và `vruntime` cấp phát CPU; từ Linux 6.6, trong lớp điều phối fair đã đưa vào EEVDF, dùng lag và thời hạn ảo để cải thiện việc chọn tác vụ. Trên máy trực tuyến cụ thể dùng bộ triển khai nào, còn phải xem phiên bản nhân và bản vá của bản phân phối.

Giới thiệu chi tiết: [Giải thích chi tiết điều phối CPU và tải hệ thống](./cpu-scheduling-and-load.md).

### Vậy rốt cuộc ai đến điều phối tiến trình này?

Chịu trách nhiệm điều phối là **bộ điều phối (Scheduler)** trong nhân hệ điều hành. Khi tác vụ hiện tại bị chặn, chủ động nhường CPU, dùng hết time slice hoặc hạn mức chạy, mức độ ưu tiên thay đổi, hoặc có tác vụ phù hợp hơn được đánh thức, nhân đều có thể kích hoạt việc điều phối.

Giáo trình còn dùng **bộ phân phối (Dispatcher)** mô tả quá trình đưa quyết định điều phối xuống CPU:

- Bộ điều phối chọn tác vụ tiếp theo từ hàng đợi chạy được.
- Quá trình phân phối hoàn thành việc chuyển ngữ cảnh cụ thể:
  - Lưu ngữ cảnh (trạng thái thanh ghi CPU, program counter, v.v.) của tiến trình hiện tại vào khối điều khiển tiến trình (PCB) của nó.
  - Tải ngữ cảnh của tiến trình được chọn tiếp theo, đọc trạng thái từ PCB của nó, khôi phục vào thanh ghi CPU.
  - Chính thức chuyển giao quyền điều khiển CPU cho tiến trình mới, để nó bắt đầu chạy.

Triển khai nhân Linux hiện đại không tách nghiêm ngặt thành hai thành phần độc lập, khi phỏng vấn chỉ cần hiểu hai trách nhiệm "chọn tác vụ tiếp theo" và "hoàn thành chuyển ngữ cảnh" là được.

### Sự khác biệt giữa load average và tỷ lệ sử dụng CPU là gì?

load average phản ánh số lượng tác vụ chạy được và tác vụ ngủ không thể gián đoạn trong hệ thống tại một khoảng thời gian, trên Linux chủ yếu tương ứng với trạng thái R và trạng thái D; tỷ lệ sử dụng CPU mô tả thời gian CPU cụ thể được dùng vào user mode, kernel mode, I/O wait, ngắt, rảnh hoặc steal ảo hóa ở các vị trí nào.

load cao có thể là do các tác vụ chạy được đang tranh giành CPU, cũng có thể là một lượng lớn tác vụ đang chờ thiết bị khối, lưu trữ mạng, hệ thống tệp hoặc Swap, trong trường hợp sau CPU vẫn có thể có rảnh. Phán đoán load còn phải kết hợp số CPU logic: cùng là load 8, áp lực đối với 1 CPU logic và 64 CPU logic là hoàn toàn khác nhau.

Khi điều tra có thể trước tiên dùng `uptime` xem xu hướng tải 1, 5, 15 phút, rồi kết hợp `top`, `vmstat 1`, `pidstat` và `mpstat` phán đoán tác vụ đang tranh giành CPU, chờ I/O, hay xảy ra chuyển ngữ cảnh thường xuyên. Giải thích chỉ báo và đường điều tra đầy đủ hơn có thể xem: [Giải thích chi tiết điều phối CPU và tải hệ thống](./cpu-scheduling-and-load.md).

## Deadlock

### Deadlock là gì?

Deadlock (bế tắc, khóa chết) mô tả một tình huống như sau: một nhóm tiến trình/luồng chờ lẫn nhau giải phóng tài nguyên hoặc hoàn thành hành động, mối quan hệ chờ tạo thành vòng khép kín, khiến tất cả các bên tham gia đều không thể tự tiếp tục thực thi.

Nói cụ thể hơn, deadlock không đơn giản là "chờ lâu". Chặn thông thường có thể chờ khóa được giải phóng, I/O trả về hoặc giao dịch (transaction) cam kết rồi tiếp tục thực thi; còn chuỗi chờ trong deadlock vòng quanh thành vòng, nếu không có ngoại lực can thiệp, vòng này sẽ không tự nhiên được gỡ ra.

Về quá trình hình thành deadlock, điều tra deadlock luồng Java và xử lý deadlock cơ sở dữ liệu, có thể xem bài chuyên đề đầy đủ hơn này: [Giải thích chi tiết deadlock: bốn điều kiện cần, điều tra deadlock Java và xử lý deadlock cơ sở dữ liệu](./dead-lock.md).

Một ví dụ kinh điển nhất chính là **"khóa chéo giữ khóa"**. Hãy tưởng tượng có hai luồng và hai khóa:

- Luồng 1 trước tiên lấy được khóa A, rồi thử đi lấy khóa B.
- Gần như cùng lúc, luồng 2 lấy được khóa B, rồi thử đi lấy khóa A.

Lúc này, luồng 1 chờ luồng 2 giải phóng khóa B, luồng 2 chờ luồng 1 giải phóng khóa A, cả hai bên đều giữ tài nguyên bên kia cần, và chờ bên kia giải phóng, liền hình thành một vòng chờ.

![Sơ đồ tình huống deadlock: luồng A giữ resource1 và chờ resource2, luồng B giữ resource2 và chờ resource1, chuỗi chờ tạo thành vòng khép kín](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-deadlock-scenario.png)

### Bốn điều kiện cần của việc phát sinh deadlock là gì?

Việc deadlock xảy ra không phải ngẫu nhiên, nó cần đồng thời thỏa mãn **bốn điều kiện cần**:

1. **Loại trừ lẫn nhau**: tài nguyên phải ở chế độ không chia sẻ, tức chỉ có một tiến trình được sử dụng tại một thời điểm. Nếu tiến trình khác yêu cầu tài nguyên này, thì phải chờ cho đến khi tài nguyên này được giải phóng.
2. **Giữ và chờ**: một tiến trình ít nhất nên giữ một tài nguyên, và chờ một tài nguyên khác, mà tài nguyên đó đang bị tiến trình khác giữ.
3. **Không chiếm đoạt**: tài nguyên không thể bị chiếm đoạt. Chỉ khi tiến trình giữ tài nguyên hoàn thành nhiệm vụ, tài nguyên này mới được giải phóng.
4. **Chờ vòng quanh**: có một nhóm tiến trình chờ `{P0, P1, ..., Pn}`, tài nguyên `P0` chờ bị `P1` giữ, tài nguyên `P1` chờ bị `P2` giữ, ..., tài nguyên `Pn-1` chờ bị `Pn` giữ, tài nguyên `Pn` chờ lại bị `P0` giữ.

![Sơ đồ bốn điều kiện cần của deadlock: loại trừ lẫn nhau, yêu cầu và giữ, không chiếm đoạt, chờ vòng quanh cùng tồn tại mới hình thành deadlock](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-four-conditions.png)

**Chú ý**: bốn điều kiện này là điều kiện cần để phát sinh deadlock, phải cùng thỏa mãn đồng thời. Chỉ thỏa mãn một hai điều kiện thì chưa chắc deadlock; ngược lại, chỉ cần có thể ổn định phá vỡ bất kỳ một điều kiện nào trong đó, là có thể phòng ngừa deadlock về mặt cấu trúc.

### Có thể viết một đoạn mã mô phỏng sinh ra deadlock không?

Dưới đây thông qua một ví dụ thực tế để tái hiện tình huống khóa chéo giữ khóa ở trên:

```java
public class DeadLockDemo {
    private static final Object resource1 = new Object(); // resource 1
    private static final Object resource2 = new Object(); // resource 2

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "thread 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "thread 2").start();
    }
}
```

Output

```text
Thread[thread 1,5,main]get resource1
Thread[thread 2,5,main]get resource2
Thread[thread 1,5,main]waiting get resource2
Thread[thread 2,5,main]waiting get resource1
```

Luồng 1 thông qua `synchronized (resource1)` giành được khóa giám sát (monitor lock) của `resource1`, luồng 2 thông qua `synchronized (resource2)` giành được khóa giám sát của `resource2`. `Thread.sleep(1000)` không phải nguyên nhân của deadlock, nó chỉ mở rộng cửa sổ thực thi đan xen của hai luồng, giúp việc tái hiện deadlock dễ hơn. Sau khi ngủ kết thúc, cả hai luồng đều bắt đầu yêu cầu tài nguyên bên kia đang giữ, thế là rơi vào chờ nhau.

### Các phương pháp giải quyết deadlock

Trong phỏng vấn trả lời đến mức này là được: việc giải quyết deadlock thường có bốn hướng ý tưởng là **phòng ngừa, tránh né, phát hiện và gỡ/phục hồi**.

- **Phòng ngừa**: chủ động phá vỡ một trong bốn điều kiện cần của deadlock. Trong kỹ thuật thường gặp nhất là cố định thứ tự khóa, thu hẹp phạm vi khóa, tránh giữ khóa mà thực hiện thao tác chậm.
- **Tránh né**: trước khi cấp phát tài nguyên phán đoán hệ thống có còn ở trạng thái an toàn hay không, đại diện tiêu biểu là thuật toán banker. Phương pháp này thiên về hiểu giáo trình, các hệ thống nghiệp vụ thông thường rất ít khi trực tiếp triển khai.
- **Phát hiện**: cho phép chờ xảy ra, rồi kiểm tra trong đồ thị chờ hoặc đồ thị cấp phát tài nguyên có xuất hiện vòng hay không. Trong Java có thể dùng `jcmd <pid> Thread.print -l`, `jstack -l <pid>` hoặc `ThreadMXBean.findDeadlockedThreads()` hỗ trợ điều tra; cơ sở dữ liệu cũng sẽ phát hiện vòng chờ giao dịch.
- **Gỡ/phục hồi**: sau khi phát hiện deadlock phá vỡ vòng chờ, ví dụ kết thúc tiến trình, cuộn lại giao dịch, chiếm đoạt tài nguyên hoặc để tầng ứng dụng thử lại. Giao dịch cơ sở dữ liệu tự nhiên hỗ trợ cuộn lại, vì vậy phù hợp hơn để áp dụng phát hiện và phục hồi.

![Sơ đồ chiến lược xử lý deadlock: bốn phương pháp phòng ngừa, tránh né, phát hiện, phục hồi tác động ở vị trí nào và mức độ phổ biến trong kỹ thuật](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-strategies.png)

Phần này phỏng vấn không cần triển khai quá chi tiết, nắm các tầng ý tưởng là được. Muốn xem tiếp đồ thị cấp phát tài nguyên, đồ thị chờ, điều tra ngăn xếp luồng Java và thử lại deadlock cơ sở dữ liệu, có thể xem: [Giải thích chi tiết deadlock: bốn điều kiện cần, điều tra deadlock Java và xử lý deadlock cơ sở dữ liệu](./dead-lock.md).

## Tham khảo

- 《Hệ điều hành máy tính—Tang Tiểu Đan》 ấn bản thứ tư
- 《Tìm hiểu sâu hệ thống máy tính (Computer Systems: A Programmer's Perspective)》
- 《Học lại hệ điều hành》
- Vì sao hệ điều hành cần chia user mode và kernel mode: <https://blog.csdn.net/chen134225/article/details/81783980>
- Hiểu từ gốc user mode và kernel mode: <https://juejin.cn/post/6923863670132850701>
- Zombie process và orphan process là gì: <https://blog.csdn.net/a745233700/article/details/120715371>

<!-- @include: @article-footer.snippet.md -->
