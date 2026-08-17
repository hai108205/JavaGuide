---
title: "Chi tiết về Giao tiếp giữa các tiến trình (IPC): Pipe, Message Queue, Shared Memory, Socket và Binder"
description: "Tổng hợp các kiến thức trọng điểm thường gặp về giao tiếp giữa các tiến trình, bắt đầu từ việc cô lập không gian địa chỉ của tiến trình, làm rõ thiết kế và sự đánh đổi của Pipe, Message Queue, Shared Memory, Semaphore, Signal, Socket, Android Binder và IPC của microkernel."
category: Nền tảng máy tính
tag:
  - Hệ điều hành
  - Linux
  - IPC
head:
  - - meta
    - name: keywords
      content: Giao tiếp giữa các tiến trình,IPC,Linux IPC,Pipe,FIFO,Message Queue,Shared Memory,Semaphore,Signal,Socket,Unix Domain Socket,Android Binder,IPC microkernel,câu hỏi phỏng vấn hệ điều hành
---

Hai tiến trình muốn trao đổi một đoạn dữ liệu, ý nghĩ trực quan nhất là: tiến trình A ghi dữ liệu vào bộ nhớ của chính nó, sau đó tiến trình B trực tiếp đọc là được.

Tuy nhiên, điều này không khả thi trong hệ điều hành. Mỗi tiến trình đều có không gian địa chỉ ảo độc lập, địa chỉ `0x7f...` trong tiến trình A và địa chỉ `0x7f...` trong tiến trình B không phải là cùng một vùng bộ nhớ. Các tiến trình ở chế độ người dùng không thể tùy tiện chạm vào bộ nhớ của nhau, nếu không thì việc phân chia quyền hạn (permission isolation) cũng chẳng thể nói tới.

Vì vậy, **IPC (Inter-Process Communication, Giao tiếp giữa các tiến trình)** không thể không cần đến hệ điều hành.

Đừng nghĩ quá phức tạp, tôi quen coi IPC như ba việc: **làm sao truyền dữ liệu, làm sao đồng bộ luồng điều khiển, làm sao thực hiện đặt tên và kiểm tra quyền hạn**. Chỉ nhớ mấy cái tên như "Pipe, Message Queue, Shared Memory" thì rất dễ học xong là quên.

![Sự cô lập không gian địa chỉ của tiến trình khiến giao tiếp giữa các tiến trình cần đến cơ chế IPC do kernel cung cấp](https://oss.javaguide.cn/github/javaguide/java/new-features/ipc-why-ipc.png)

## IPC rốt cuộc đang giải quyết điều gì?

![IPC cần đồng thời giải quyết các vấn đề truyền dữ liệu, đồng bộ điều khiển, định vị theo tên và kiểm tra quyền hạn](https://oss.javaguide.cn/github/javaguide/java/new-features/what-problem-does-ipc-solve.png)

**IPC trước hết giải quyết chuyện dữ liệu qua lại thế nào.** Pipe và byte stream Socket truyền các byte liên tiếp, ranh giới thông điệp do ứng dụng tự quy ước; Message Queue, datagram Socket, giao dịch Binder truyền từng thông điệp một, vốn có ranh giới tự nhiên; Shared Memory cho nhiều tiến trình ánh xạ cùng một vùng bộ nhớ vật lý, sau khi hoàn tất ánh xạ thì việc đọc ghi vùng dùng chung không cần phải chui vào kernel mỗi lần.

**Nó còn phải giải quyết vấn đề đồng bộ.** Shared Memory chỉ giải quyết "nhìn thấy cùng một dữ liệu", nhưng không giải quyết "ai ghi trước, ai đọc sau". Nhiều tiến trình cùng sửa một hàng đợi vòng (ring queue), nếu không có mutex lock, semaphore, futex hoặc condition variable thì dữ liệu rất nhanh chóng sẽ rối loạn.

**Đặt tên và quyền hạn cũng không thể thiếu.** Anonymous pipe dựa vào việc nhận kế thừa file descriptor sau `fork` để thiết lập mối quan hệ; FIFO dựa vào đường dẫn trong hệ thống tệp; System V IPC dựa vào key và ID đối tượng trong kernel; Unix Domain Socket có thể bind theo đường dẫn, cũng có thể dùng abstract namespace của Linux; Android Binder mượn Service Manager để ánh xạ tên dịch vụ thành tham chiếu Binder.

## Pipe: byte stream, đơn giản, nhưng ít ranh giới

Pipe là IPC dễ gặp nhất. Trong Shell `ps aux | grep java`, dấu `|` ở giữa chính là nối standard output của tiến trình trước sang standard input của tiến trình sau.

Trong Linux, gọi `pipe()` sẽ nhận được hai file descriptor: một đầu đọc, một đầu ghi. Tiến trình cha tạo pipe rồi `fork()`, tiến trình con sẽ kế thừa các file descriptor này, nhờ vậy cha con có thể trao đổi dữ liệu qua cùng một pipe. Anonymous pipe không có tên, thường dùng giữa các tiến trình có quan hệ họ hàng (không tiết quan hệ cha-con, nhưng vẫn là có mối liên hệ nhất định).

![Pipe truyền byte stream một chiều giữa tiến trình cha và tiến trình con thông qua buffer của kernel](https://oss.javaguide.cn/github/javaguide/java/new-features/ipc-pipe-flow.png)

Pipe là byte stream một chiều. POSIX chỉ yêu cầu nó một chiều, giao tiếp hai chiều thường phải dựng hai pipe; nó không hiểu ranh giới thông điệp, đầu ghi ghi 3 lần không hẳn đầu đọc sẽ đọc 3 lần; buffer nằm trong kernel, khi ghi đầy thì ghi theo kiểu chặn (blocking) sẽ ngủ, ghi không chặn (non-blocking) có thể trả về `EAGAIN`; nó cũng không phải tệp thông thường, không dùng `lseek()` để định vị ngẫu nhiên được.

Trên Linux còn có một con số dễ bị hỏi trong phỏng vấn: `PIPE_BUF` là 4096 byte. Với pipe hoặc FIFO, khi một lần `write()` không vượt quá `PIPE_BUF`, kernel đảm bảo lần ghi này sẽ không bị xen lẫn dữ liệu với các tác nhân ghi khác; ở chế độ chặn có thể phải chờ không gian buffer, ở chế độ không chặn nếu không đủ không gian sẽ trả về `EAGAIN`. Việc ghi vượt quá `PIPE_BUF` có thể bị tách nhỏ, cũng có thể bị xen lẫn dữ liệu với các tác nhân ghi khác. Sự đảm bảo này không đồng nghĩa với việc pipe có ranh giới thông điệp.

Named pipe (FIFO) dùng `mkfifo` để tạo một tệp đặc biệt trong hệ thống tệp, hai tiến trình không có quan hệ họ hàng mở nó theo đường dẫn là có thể giao tiếp. FIFO có tên đường dẫn, nhưng dữ liệu không được ghi vào đĩa; đường dẫn chỉ là lối vào đặt tên, dữ liệu thật vẫn nằm trong buffer của kernel.

Pipe phù hợp để nối các công cụ dòng lệnh (command-line tool), truyền một lượng nhỏ dữ liệu giữa cha con. Nó không phù hợp với các giao thức phức tạp và truyền đối tượng lớn. Muốn thực sự thêm tiền tố độ dài (length prefix), checksum, số thứ tự (sequence number) trên byte stream, nhiều trường hợp thà đổi sang Socket hoặc Message Queue còn hơn.

## Message Queue: kernel lưu trữ thông điệp, ứng dụng ít phải xử lý tách gói

Message Queue cắt dữ liệu thành từng thông điệp rồi lưu vào đối tượng trong kernel. Bên gửi gọi `msgsnd()` hoặc `mq_send()` để đưa thông điệp vào hàng đợi, bên nhận gọi `msgrcv()` hoặc `mq_receive()` để lấy ra. System V Message Queue và POSIX Message Queue có giao diện khác nhau, nhưng đều thuộc phương án "kernel giữ hàng đợi, tiến trình đọc ghi theo thông điệp".

So với pipe, lợi ích trực tiếp nhất của Message Queue là **thông điệp có ranh giới**. System V Message Queue hỗ trợ nhận theo loại thông điệp; POSIX Message Queue hỗ trợ độ ưu tiên, trên Linux giá trị trả về phổ biến của `sysconf(_SC_MQ_PRIO_MAX)` là 32768, trong khi chuẩn POSIX chỉ yêu cầu tối thiểu hỗ trợ khoảng 0 đến 31.

Cái giá cũng rất trực tiếp: khi gửi, dữ liệu trong buffer của ứng dụng được copy vào hàng đợi trong kernel; khi nhận, lại copy về user buffer của tiến trình nhận từ hàng đợi trong kernel. Bản thân hàng đợi cũng bị giới hạn bởi các tham số kernel, chẳng hạn POSIX Message Queue có các mục giới hạn như `/proc/sys/fs/mqueue/msg_max`, `msgsize_max`.

Vì vậy Message Queue phù hợp để truyền thông điệp nhỏ có cấu trúc, như thông báo nhiệm vụ, sự kiện trạng thái, lệnh điều khiển. Nó không phù hợp để truyền các khối ảnh lớn, khung âm thanh/video hoặc đối tượng tuần tự hóa cực lớn. Message Queue trong IPC của Linux cũng không phải là message middleware kiểu Kafka, RocketMQ, không có log lưu trữ lâu dài (persistent log), consumer group và sao chép giữa các máy (cross-machine replication).

## Shared Memory: ít bản sao, nhưng tự lo đồng bộ

Ý tưởng của Shared Memory rất trực tiếp: cho nhiều tiến trình ánh xạ cùng một vùng bộ nhớ vật lý vào không gian địa chỉ ảo của riêng mình. Sau khi thiết lập ánh xạ, tiến trình A ghi vùng bộ nhớ này, tiến trình B đọc được bản cập nhật.

Trên Linux có hai loại giao diện phổ biến: System V Shared Memory dùng `shmget()`, `shmat()`, `shmdt()`, `shmctl()`; POSIX Shared Memory dùng `shm_open()` tạo đối tượng, `ftruncate()` đặt kích thước, rồi dùng `mmap()` ánh xạ vào không gian địa chỉ của tiến trình.

![Shared Memory cho nhiều tiến trình ánh xạ cùng một vùng bộ nhớ vật lý, nhưng vẫn cần các cơ chế đồng bộ như semaphore, futex phối hợp](https://oss.javaguide.cn/github/javaguide/java/new-features/ipc-shared-memory.png)

Shared Memory nhanh vì đường dẫn dữ liệu ngắn. Các phương thức như pipe, message queue, socket thường phải giao dữ liệu cho kernel trước, rồi kernel giao cho tiến trình khác; Shared Memory sau khi hoàn tất ánh xạ, việc đọc ghi của tiến trình là trên cùng một trang vật lý, bản thân dữ liệu không phải mang qua mang lại giữa user mode và kernel mode mỗi lần. Thu thập log, xử lý âm thanh/video, bộ nhớ cache của database... những kịch bản trao đổi dữ liệu khối lớn trên cùng máy mới thích hợp để đưa nó ra dùng.

Tuy nhiên, ánh xạ cùng một vùng bộ nhớ chỉ giải quyết chuyện "nhìn thấy được hay không", không giải quyết chuyện "khi nào thì đọc được" và "ai được viết".

Lấy hàng đợi vòng dùng chung làm ví dụ, producer thường sẽ ghi dữ liệu, cập nhật `tail`, consumer dựa vào `head` và `tail` để phán đoán có dữ liệu mới hay không. Nếu producer còn chưa ghi xong một bản ghi hoàn chỉnh mà đã cập nhật `tail` trước, consumer có thể lập tức đọc được một bản ghi còn dang dở. Vấn đề này không thể dựa vào bản thân Shared Memory để giải quyết, cần phải cùng thiết kế thứ tự ghi, tính khả kiến (visibility) và cơ chế đánh thức: đơn giản có thể dùng mutex lock giữa các tiến trình, POSIX semaphore; khi theo đuổi hiệu năng có thể dùng `eventfd`, `futex`, biến nguyên tử và memory barrier.

Còn một chi tiết rất dễ dẫm vào bẫy: đừng trực tiếp đặt con trỏ trong tiến trình vào Shared Memory. Cùng một vùng Shared Memory trong tiến trình A có thể được ánh xạ tới `0x7000...`, trong tiến trình B có thể ánh xạ tới `0x5000...`, địa chỉ A ghi vào, B nhận được thì gần như chắc chắn vô nghĩa. Cách viết phổ biến hơn trong kỹ thuật là lưu độ lệch (offset), chỉ số mảng (array index), hoặc thống nhất trước một cấu trúc bố cục cố định.

Vì vậy Shared Memory không thể chỉ nhìn vào số lần copy. Hiệu năng tổng thể còn bị ảnh hưởng bởi tính nhất quán cache (cache coherence), cạnh tranh lock, memory barrier, cơ chế đánh thức và bố cục dữ liệu. Nó phù hợp với những kịch bản dữ liệu lớn, hai bên đều ở trên cùng máy, và sẵn sàng xử lý nghiêm túc đồng bộ và bố cục bộ nhớ; nếu chỉ truyền vài trường trạng thái hoặc một lệnh điều khiển thì Message Queue, Pipe, Unix Domain Socket lại đỡ phiền hơn.

## Semaphore và Signal khác nhau thế nào?

Semaphore thường xuất hiện cùng Shared Memory, nhưng nó không chịu trách nhiệm truyền dữ liệu nghiệp vụ. Nó giống một bộ đếm hơn, dùng để kiểm soát bao nhiêu tiến trình được phép vào một đoạn critical section nào đó, hoặc thông báo cho đối phương "giờ có dữ liệu để đọc". POSIX semaphore có thể là dạng có tên (named), cũng có thể là dạng không tên (unnamed); `sem_post()` tăng bộ đếm lên một, `sem_wait()` cố gắng giảm bộ đếm đi một, khi bộ đếm bằng 0 thì bên gọi sẽ chặn chờ.

Signal giống thông báo sự kiện bất đồng bộ hơn: `SIGINT` biểu thị ngắt từ terminal, `SIGTERM` biểu thị yêu cầu tiến trình thoát, `SIGCHLD` biểu thị trạng thái tiến trình con thay đổi. Linux hỗ trợ signal chuẩn (standard signal) và signal thời gian thực (real-time signal). Signal mang được ít thông tin, hàm xử lý cũng bị giới hạn bởi async-signal-safe, trong code production thường để signal handler chỉ sửa cờ `volatile sig_atomic_t`, hoặc thông qua `write(2)` an toàn async-signal ghi một byte vào self-pipe, ghi một giá trị đếm `uint64_t` vào eventfd, rồi để vòng lặp chính (main loop) xử lý tập trung.

## Socket: dùng được trên cùng máy lẫn giữa các máy

Socket không chỉ dùng cho giao tiếp mạng, cũng có thể làm IPC trên cùng máy.

Nếu hai tiến trình ở trên các máy khác nhau, về cơ bản phải đi qua network socket kiểu TCP/UDP. Nếu hai tiến trình ở trên cùng một máy, có thể dùng Unix Domain Socket. Họ địa chỉ (address family) của nó là `AF_UNIX` hoặc `AF_LOCAL`, hỗ trợ các kiểu `SOCK_STREAM`, `SOCK_DGRAM`, `SOCK_SEQPACKET`.

Giao diện của Unix Domain Socket gần giống network socket, hỗ trợ giao tiếp giữa các tiến trình không có quan hệ họ hàng; trên Linux vừa có thể bind theo đường dẫn hệ thống tệp, vừa có thể dùng abstract namespace. Nó còn có thể nhờ dữ liệu phụ trợ (ancillary data) của `sendmsg()` và `SCM_RIGHTS` để truyền file descriptor. Về danh tính đối phương, socket kiểu kết nối của Unix thường dùng `SO_PEERCRED` để lấy pid, uid, gid; kịch bản datagram cũng có thể kết hợp `SO_PASSCRED` và `SCM_CREDENTIALS` để credentials truyền theo cùng thông điệp.

Nếu được hỏi "chọn Pipe hay Unix Domain Socket", có thể trả lời như thế này: byte stream đơn giản giữa cha con, dùng pipe là đủ; cần giao tiếp hai chiều, request-response, truyền fd, server lắng nghe thì Unix Domain Socket phù hợp hơn; cần vượt máy thì đổi sang TCP/UDP hoặc framework RPC tầng trên.

## Android Binder: biến IPC thành lệnh gọi dịch vụ hệ thống

![Android Binder thông qua AIDL, Parcel, Binder driver và Service Manager đóng gói IPC thành lệnh gọi dịch vụ hệ thống](https://oss.javaguide.cn/github/javaguide/java/new-features/android-binder-turning-ipc-into-system-service-calls.png)

IPC điển hình nhất trong Android là Binder. Việc ứng dụng gọi dịch vụ hệ thống, tương tác giữa các Service ở các tiến trình khác nhau, remote interface do AIDL sinh ra — đều không thể thiếu nó ở tầng dưới.

Binder có vài điểm thiết kế đáng để xem riêng. AIDL để client và server quy ước interface, bộ công cụ Android sinh code giải mã/đóng gói tham số và code proxy; client giống như đang gọi phương thức cục bộ, thực chất sẽ đóng gói các tham số thành Parcel, giao cho Binder driver hoàn tất giao dịch vượt tiến trình. Service Manager trong hệ thống sẽ đăng ký với Binder driver thành context manager, chịu trách nhiệm duy trì ánh xạ từ tên dịch vụ đến tham chiếu Binder.

Bên trong giao dịch Binder có thể mang theo các đối tượng đặc biệt như đối tượng Binder, handle, fd. Việc truyền fd cho phép Binder phối hợp với Shared Memory: Binder truyền thông điệp điều khiển và handle, dữ liệu khối lớn đặt vào Shared Memory. Tài liệu AIDL chính thức của Android cũng từng nhắc: cuộc gọi từ xa sẽ được phân phối từ Binder thread pool do platform duy trì vào tiến trình dịch vụ, triển khai dịch vụ phải cân nhắc tính an toàn luồng (thread safety).

Binder cũng không phải là kênh để nhét đối tượng lớn. Tài liệu `TransactionTooLargeException` của Android viết rất rõ ràng: Binder transaction buffer hiện tại là 1 MB, và được chia sẻ bởi các giao dịch đang diễn ra trong tiến trình. Bản thân exception này cũng là phán đoán heuristic (mang tính kinh nghiệm): client không thể biết chính xác sự thất bại xảy ra ở giai đoạn gửi yêu cầu hay giai đoạn trả về phản hồi. Cách ổn định hơn là để Binder truyền yêu cầu nhỏ, kết quả phân trang, fd hoặc nhận dạng tài nguyên (resource identifier).

## Tại sao microkernel đặc biệt quan tâm tới IPC?

Kernel kiểu macro (thái hạt nhân) như Linux đặt rất nhiều khả năng vào trong kernel, như hệ thống tệp, protocol stack mạng, driver... Microkernel sẽ chuyển càng nhiều dịch vụ nhất có thể sang tiến trình chế độ người dùng, ví dụ dịch vụ hệ thống tệp, dịch vụ driver, dịch vụ mạng. Khả năng cô lập tốt hơn, nhưng IPC sẽ trở nên cực kỳ thường xuyên.

Ứng dụng đọc một tệp, trong macro kernel có thể chủ yếu chỉ là một lần syscall vào kernel; trong microkernel, có thể phải giao tiếp nhiều lần với dịch vụ hệ thống tệp, dịch vụ thiết bị khối. IPC chậm một chút, toàn bộ hệ thống đều chậm theo.

Vì vậy trong các bài báo và triển khai hệ thống microkernel, tối ưu hóa IPC luôn là trọng điểm.

Thiết kế tiêu biểu của Mach là port. Port có thể hiểu là message queue và capability handle được kernel bảo vệ: task nắm giữ port right nào đó, mới có thể gửi hoặc nhận message tương ứng với đối tượng đó. Họ L4 thì cố lên tối đa làm cho các IPC phổ biến ngắn gọn: message ngắn thì dùng thanh ghi (register) để truyền tham số, synchronous IPC theo phong cách rendezvous, áp dụng direct process switch để tránh một số đường đi phải vòng qua scheduler. LRPC (Lightweight Remote Procedure Call) cũng đang làm cùng một việc: giảm chi phí thread, buffer và scheduling trong các lần gọi vượt miền bảo vệ trên cùng máy.

## Các IPC phổ biến nên chọn thế nào?

Khi chọn, đừng chỉ hỏi "cái nào nhanh nhất". Câu hỏi tốt hơn là: dữ liệu lớn bao nhiêu? Có cần ranh giới thông điệp không? Hai bên giao tiếp có quan hệ họ hàng không? Có cần request-response hai chiều không? Có cần vượt máy không? Có cần kiểm tra quyền hạn và nhận dạng danh tính không?

| Cách IPC           | Hình thái dữ liệu                     | Có giữ ranh giới thông điệp | Có phù hợp dữ liệu lớn                       | Có vượt máy             | Kịch bản điển hình                          |
| ------------------ | ------------------------------------- | --------------------------- | -------------------------------------------- | ----------------------- | ------------------------------------------- |
| Anonymous Pipe     | Byte stream                           | Không                       | Không phù hợp                                | Không                   | Tiến trình cha con, Shell pipe              |
| FIFO               | Byte stream                           | Không                       | Không phù hợp                                | Không                   | Giao tiếp đơn giản tiến trình không họ hàng |
| Message Queue      | Message                               | Có                          | Không phù hợp                                | Không                   | Lệnh điều khiển, sự kiện trạng thái         |
| Shared Memory      | Vùng dùng chung                       | Do ứng dụng định nghĩa      | Phù hợp                                      | Không                   | Trao đổi dữ liệu khối lớn trên cùng máy     |
| Unix Domain Socket | Byte stream, datagram, gói có thứ tự  | Tùy thuộc kiểu              | Trung bình                                   | Không                   | Server lắng nghe trên máy, truyền fd        |
| TCP/UDP Socket     | Byte stream hoặc datagram             | Tùy thuộc giao thức         | Tùy thuộc giao thức và triển khai            | Có                      | Giao tiếp vượt máy                          |
| Binder             | Transaction, tham chiếu đối tượng, fd | Có                          | Không phù hợp truyền trực tiếp đối tượng lớn | Không, trên máy Android | Gọi dịch vụ hệ thống Android                |

![So sánh ngang các cách IPC phổ biến về hình thái dữ liệu, ranh giới thông điệp, truyền dữ liệu lớn và khả năng vượt máy](https://oss.javaguide.cn/github/javaguide/java/new-features/ipc-ipc-comparison.png)

Giữa cha con truyền một lượng nhỏ byte stream, pipe là đủ; tiến trình không họ hàng cần request-response hai chiều, Unix Domain Socket thuận tiện hơn; sự kiện có cấu trúc nhỏ có thể dùng Message Queue; dữ liệu khối lớn ưu tiên Shared Memory kèm thông báo đồng bộ; giao tiếp vượt máy giao cho TCP/UDP hoặc RPC tầng trên; gọi vượt tiến trình trong ứng dụng Android thường đi theo Binder.

![Chọn cách IPC phù hợp dựa trên lượng dữ liệu, ranh giới thông điệp, vượt máy và quan hệ họ hàng của tiến trình](https://oss.javaguide.cn/github/javaguide/java/new-features/ipc-ipc-selection.png)

## Trả lời IPC thế nào trong phỏng vấn?

Có thể trả lời như thế này: mặc định tiến trình không thể trực tiếp truy cập không gian địa chỉ user mode của nhau, vì vậy IPC hoặc là để kernel nhận hộ rồi gửi lại dữ liệu, hoặc là để kernel tạo một đối tượng hay ánh xạ bộ nhớ có thể dùng chung.

Nhìn theo đường này, Pipe, FIFO, Socket chủ yếu truyền byte stream, ranh giới thông điệp thường phải do giao thức ứng dụng xử lý; Message Queue giữ lại ranh giới thông điệp, phù hợp với các message nhiệm vụ nhỏ, thay đổi trạng thái và lệnh điều khiển; Shared Memory ánh xạ cùng một nhóm trang vật lý cho nhiều tiến trình, phù hợp trao đổi dữ liệu khối lớn trên cùng máy, nhưng đồng bộ và bố cục bộ nhớ phải tự xử lý; Signal thiên về thông báo sự kiện, các cơ chế như Semaphore, mutex lock, `futex` chủ yếu phối hợp với dữ liệu dùng chung để làm đồng bộ. Android Binder có thể xem như kênh RPC/giao dịch cục bộ hướng tới dịch vụ hệ thống, thường dùng cho gọi dịch vụ vượt tiến trình.

Khi thực sự lựa chọn, không phải nhìn xem tên có quen không, mà là nhìn vào lượng dữ liệu, ranh giới thông điệp, phạm vi giao tiếp, mối quan hệ hai bên và kiểm tra quyền hạn. Ví dụ cha con nối lệnh, pipe là đủ; dịch vụ trên máy cần request-response hai chiều, còn muốn truyền fd, Unix Domain Socket phù hợp hơn; giao tiếp vượt máy thì mới cân nhắc TCP/UDP hoặc RPC tầng trên.

Nếu hỏi tiếp "tại sao Shared Memory vẫn cần semaphore", có thể trả lời như thế này: Shared Memory chỉ đơn thuần khiến hai tiến trình nhìn thấy cùng một dữ liệu, không đảm bảo thứ tự truy cập. Ai ghi trước, ai đọc sau, đọc khi đang ghi dở được hay không, đều phải dựa vào Semaphore, mutex lock giữa các tiến trình, `futex`, `eventfd` và các cơ chế tương tự để ràng buộc.

Nếu hỏi tiếp "tại sao Binder không phù hợp truyền đối tượng lớn", có thể bổ sung giới hạn buffer giao dịch 1 MB trong tài liệu chính thức của Android, và giải thích buffer này được chia sẻ bởi các giao dịch đang diễn ra trong tiến trình. Binder phù hợp truyền tham số phương thức, giá trị trả về, tham chiếu đối tượng và fd; dữ liệu khối lớn nên tách nhỏ, phân trang, hoặc dùng Shared Memory để truyền.

Ghi nhớ IPC đừng ghi thành một chuỗi danh từ, có thể tự hỏi vài câu này trước: dữ liệu có lớn không? Có cần giữ ranh giới thông điệp không? Hai bên giao tiếp có phải đều trên cùng máy không? Có cần request-response hai chiều không? Đồng bộ và quyền hạn do ai quản? Trả lời xong mấy câu này, phương án về cơ bản cũng ra.
