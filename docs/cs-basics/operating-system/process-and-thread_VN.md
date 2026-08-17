---
title: "Chi tiết về Process và Thread: Khác biệt, Trạng thái, Giao tiếp, Chuyển ngữ cảnh và Virtual Thread"
description: "Tổng hợp các câu hỏi phỏng vấn tần suất cao về process và thread, nhìn từ góc độ hệ điều hành để làm rõ khái niệm, mô hình tài nguyên, chuyển trạng thái, PCB/TCB, fork/exec/wait, mô hình thread, chuyển ngữ cảnh cũng như mối quan hệ giữa Java thread và virtual thread."
category: Cơ sở máy tính (Computer Science)
tag:
  - Hệ điều hành
  - Process Thread
  - Java Concurrency
head:
  - - meta
    - name: keywords
      content: process,thread,khác biệt giữa process và thread,trạng thái process,trạng thái thread,PCB,TCB,fork,exec,wait,clone,pthread,chuyển ngữ cảnh,mô hình thread,Java virtual thread,câu hỏi phỏng vấn hệ điều hành
---

Process và thread là hai khái niệm cơ bản nhất trong hệ điều hành, đồng thời cũng là hai khái niệm dễ bị học nhầm lẫn nhất.

Khi được hỏi về sự khác biệt của chúng trong phỏng vấn, nhiều câu trả lời sẽ dừng lại ở "process là đơn vị cơ bản của việc phân bổ tài nguyên, thread là đơn vị cơ bản của việc lập lịch CPU". Câu này có thể dùng làm điểm khởi đầu, nhưng chưa đủ.

Tiếp tục đào sâu, bạn sẽ gặp một loạt câu hỏi cụ thể hơn: tại sao các process mặc định được cách ly với nhau? Thread thực sự chia sẻ những gì? Sau `fork()` thì process cha và con có những thứ gì giống nhau, những thứ gì đã tách riêng? Vì sao gọi `fork()` một cách tùy tiện trong chương trình đa luồng lại gây ra vấn đề? Java virtual thread có được tính là thread của hệ điều hành không?

Bài viết này được triển khai xoay quanh những câu hỏi này. Trước tiên hãy làm rõ ranh giới giữa chương trình, process và thread, sau đó xem xét `fork`, `exec`, `wait`, `clone` trong Linux, cuối cùng quay lại với chuyển ngữ cảnh, mô hình thread và Java virtual thread. Khi đọc, bạn có thể nắm một mạch chính: process nghiêng về ranh giới tài nguyên và cách ly, thread nghiêng về một đường thực thi có thể được lập lịch.

## Program, Process và Thread lần lượt là gì?

![Mối quan hệ giữa program, process và thread](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/relationship-between-program-process-and-thread.png)

Program là một tập hợp các lệnh và dữ liệu được lưu trữ trên đĩa, ví dụ như một file thực thi, một gói JAR. Nó chưa thực sự chạy, chỉ là một file tĩnh.

Khi hệ điều hành tải program vào bộ nhớ, thiết lập cho nó các tài nguyên cấp process như không gian địa chỉ ảo, bảng mô tả file (file descriptor), và thiết lập cho thread ban đầu các ngữ cảnh thực thi (execution context) như stack, thanh ghi (register), thì một lần chạy của program đã trở thành **process**. Cùng một program có thể được khởi động nhiều lần, tương ứng với nhiều process; ví dụ mở hai cửa sổ terminal cùng lúc, thường là hai instance (thể hiện) process khác nhau.

Thread là luồng thực thi bên trong process. Một process có ít nhất một thread, nhiều thread trong process chia sẻ tài nguyên của process này, nhưng mỗi thread cũng có ngữ cảnh thực thi riêng của mình. Điều mà hệ điều hành hiện đại thực sự đem đi lập lịch thường là thread: thread nào đang ở trạng thái có thể chạy (runnable), thì bộ lập lịch có thể chia thời gian (time slice) CPU cho nó.

Có thể ghi nhớ hướng lớn bằng một câu: **process chú trọng ranh giới tài nguyên, thread chú trọng thực thi và lập lịch.**

Để phán đoán một khái niệm thiên về process hay thread hơn, cũng có thể đặt câu hỏi: nó mô tả ranh giới tài nguyên, hay là một đường thực thi? Không gian địa chỉ, bảng file đang mở, thông tin quyền hạn nghiêng về process; stack, thanh ghi, bộ đếm chương trình nghiêng về thread.

![Dùng phép loại suy nhà máy WeChat để phân biệt process và thread](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/wechat-factory-process-thread.png)

Tuy nhiên câu này chỉ là điểm tựa khi học, không thể coi là chi tiết triển khai của mọi hệ thống. Ví dụ nội bộ nhân Linux dùng `task_struct` để mô tả thực thể lập lịch, process và thread giống như các task có mức độ chia sẻ tài nguyên khác nhau; còn tài liệu Windows lại nói rõ thread là đơn vị cơ bản mà hệ điều hành phân phối thời gian xử lý (processor time). Các hệ thống khác nhau có cách đặt tên không hoàn toàn giống nhau, nhưng quan hệ ở tầng trừu tượng là tương đối thống nhất.

## Process sở hữu những tài nguyên nào?

Process không chỉ có phần mã đang thực thi. Một process thường bao gồm những nội dung sau:

- **Không gian địa chỉ ảo**: process nhìn thấy một vùng bộ nhớ ảo liên tục, bên trong có code segment, data segment, heap, stack, vùng ánh xạ bộ nhớ, v.v.
- **File và handle đang mở**: ví dụ file descriptor, Socket, pipe, device handle.
- **Thông tin bảo mật và định danh**: ví dụ user ID, quyền hạn, chứng thực (credential), ngữ cảnh bảo mật.
- **Thông tin liên quan đến lập lịch**: ưu tiên, thống kê thời gian CPU, affinity, trạng thái, v.v.
- **Ngữ cảnh chạy như tín hiệu, biến môi trường, thư mục làm việc, v.v.**

Giữa các process mặc định là cách ly. Một process không thể tùy tiện đọc/ghi không gian địa chỉ ảo của một process khác, đây cũng là nền tảng giúp hệ điều hành bảo vệ được các chương trình khác nhau. Hai process muốn trao đổi dữ liệu cần nhờ đến các cách IPC như pipe, message queue, shared memory, Socket, file, tín hiệu (signal), v.v.

Cách ly mang lại bảo mật, nhưng cũng mang lại chi phí. Hai process mỗi bên có không gian địa chỉ và bảng tài nguyên riêng, việc chuyển ngữ cảnh, giao tiếp, tạo mới và hủy bỏ đều nặng nề hơn so với thread.

## Process có những trạng thái phổ biến nào?

Mô hình năm trạng thái thường thấy trong sách giáo khoa đủ ứng phó với đa số câu hỏi phỏng vấn:

- **Trạng thái tạo mới (New)**: process đang được tạo, chưa vào hàng đợi sẵn sàng (ready queue).
- **Trạng thái sẵn sàng (Ready)**: các điều kiện chạy về cơ bản đã đủ, chỉ còn thiếu CPU.
- **Trạng thái đang chạy (Running)**: đang thực thi trên CPU.
- **Trạng thái bị chặn (Blocked/Waiting)**: đang chờ một sự kiện nào đó, ví dụ I/O hoàn tất, lock được giải phóng, bộ hẹn giờ hết hạn.
- **Trạng thái kết thúc (Terminated/Exit)**: process kết thúc, hệ điều hành thu hồi các tài nguyên liên quan.

![Sơ đồ chuyển trạng thái của process](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/state-transition-of-process.png)

Điểm mấu chốt của chuyển trạng thái không nằm ở tên gọi, mà nằm ở nguyên nhân kích hoạt. Trạng thái sẵn sàng nhận được CPU sẽ trở thành trạng thái đang chạy; time slice trong lúc chạy dùng hết, có thể quay lại trạng thái sẵn sàng; đang chạy mà thực hiện thao tác I/O chặn, sẽ rơi vào trạng thái bị chặn; sau khi sự kiện đang chờ bị chặn hoàn tất, trước tiên phải quay về trạng thái sẵn sàng, chờ lần lập lịch tiếp theo.

Một số sách giáo khoa còn thêm **trạng thái treo (suspended)**. Trạng thái treo nhấn mạnh process tạm thời không nằm trong bộ nhớ, hoặc bị người dùng/hệ thống tạm dừng; trạng thái bị chặn nhấn mạnh nó đang chờ sự kiện. Hai cái này không phải là một: một process có thể bị chặn nhưng vẫn nằm trong bộ nhớ, cũng có thể bị hoán đổi ra bộ nhớ ngoài rồi rơi vào trạng thái bị chặn-treo.

## PCB là gì?

PCB (Process Control Block, khối điều khiển process) là cấu trúc dữ liệu mà hệ điều hành dùng để quản lý process. Rất nhiều thông tin trong lúc process chạy không tự nhiên rải rác ngoài không khí, mà do nhân (kernel) duy trì trong cấu trúc tương tự như PCB.

PCB thường ghi lại:

- Thông tin định danh process: PID, ID của process cha, user ID, v.v.
- Trạng thái và thông tin lập lịch: sẵn sàng, đang chạy, bị chặn, ưu tiên, thống kê thời gian.
- Ngữ cảnh CPU: bộ đếm chương trình, con trỏ stack, các thanh ghi thông dụng, v.v., thuận tiện cho việc chuyển đổi quay lại tiếp tục thực thi.
- Thông tin quản lý bộ nhớ: page table, không gian địa chỉ ảo, ánh xạ bộ nhớ.
- Thông tin tài nguyên: file đang mở, xử lý tín hiệu, thư mục làm việc, trạng thái I/O, v.v.

Khi xảy ra chuyển ngữ cảnh, hệ điều hành sẽ lưu lại ngữ cảnh như các thanh ghi của thực thể đang thực thi, rồi khôi phục ngữ cảnh của thực thể tiếp theo. Các cấu trúc như PCB/TCB chính là căn cứ để xác định "lần sau tiếp tục chạy từ chỗ nào".

Triển khai của Linux có một điểm đặc biệt: nó coi cả process và thread đều là task, bên trong `task_struct` không trực tiếp nhồi tất cả tài nguyên, mà thông qua con trỏ trỏ tới các cấu trúc tài nguyên như memory descriptor, file table, xử lý tín hiệu. Khi nhiều thread thuộc cùng một process, chúng sẽ trỏ tới cùng một tập cấu trúc tài nguyên; còn các process khác nhau thì trỏ tới tài nguyên khác nhau. Đây cũng là lý do khiến việc hiểu `clone()` trên Linux rất hữu ích.

## Trong Linux, fork, exec, wait lần lượt làm gì?

![Chuỗi gọi fork, exec, wait](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/fork-exec-wait-call-chain.png)

Trong lập trình Unix/Linux, việc tạo process gần như không thể tránh khỏi ba thao tác `fork()`, `exec()`, `wait()`.

`fork()` dùng để tạo process con. Sau khi gọi thành công, process cha và con tiếp tục thực thi từ cùng một vị trí, chỉ khác nhau ở giá trị trả về: process cha nhận được PID của process con, process con nhận được 0. Process cha và con sở hữu không gian địa chỉ ảo độc lập, lúc mới tạo nội dung nhìn giống nhau; hệ thống hiện đại thường kết hợp copy-on-write, chỉ khi một bên ghi vào bộ nhớ thì kernel mới sao chép trang (page) tương ứng.

Cũng cần chú ý tới file descriptor. Sau `fork()`, bảng file descriptor của process cha và con là bản sao riêng của mỗi bên, nhưng fd tương ứng sẽ trỏ tới cùng một open file description, nên offset file, cờ trạng thái mở v.v. sẽ được chia sẻ. Trong thực tế thường kết hợp `FD_CLOEXEC` hoặc `O_CLOEXEC`, để tránh việc sau `exec()` làm rò rỉ những fd không nên kế thừa cho chương trình mới.

Bộ hàm `exec()` dùng để nạp một chương trình khác vào trong process hiện tại. Nó không tạo process mới, mà thay thế các nội dung phía người dùng như code, data, heap, stack của process hiện tại bằng chương trình mới. Mô hình thường thấy trong dòng lệnh là: Shell trước tiên `fork()` ra một process con, process con rồi dùng `exec()` để biến thành chương trình đích.

`wait()`/`waitpid()` dùng để chờ sự thay đổi trạng thái của process con, đồng thời thu hồi thông tin trạng thái mà process con để lại trong kernel sau khi thoát. Process con đã thoát nhưng process cha chưa `wait`, sẽ để lại process zombie (zombie process). Process zombie không còn thực thi code, nhưng vẫn chiếm PID và bản ghi trạng thái thoát.

Khi Shell khởi động lệnh bên ngoài, chuỗi gọi phổ biến là: Shell gọi `fork()` để tạo process con, process con gọi `exec()` để trở thành chương trình đích, process cha dùng `wait()` hoặc `waitpid()` để chờ và thu hồi trạng thái thoát.

Ở đây có một chi tiết dễ bị bỏ qua: sau khi process đa luồng gọi `fork()`, trong process con chỉ giữ lại thread đã gọi `fork()`. Trạng thái lock, trạng thái biến điều kiện, trạng thái malloc, trạng thái stdio của các thread khác trong process cha có thể được sao chép sang, nhưng các thread tương ứng đã không còn tồn tại. Nói một cách chặt chẽ hơn, trong khoảng sau khi chương trình đa luồng `fork()` và trước `exec()`, process con chỉ nên gọi các hàm async-signal-safe; làm logic phức tạp trong cửa sổ này rất dễ vấp phải cạm bẫy.

## Thread chia sẻ gì, và có gì là riêng tư?

![Tài nguyên chia sẻ và ngữ cảnh thực thi riêng của thread](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/thread-shared-and-private-content.png)

Nhìn từ góc độ hệ điều hành, các thread trong cùng một process chia sẻ phần lớn tài nguyên của process, ví dụ:

- Các vùng bộ nhớ trong không gian địa chỉ của process như code segment, data segment, heap;
- File descriptor đang mở, Socket, thư mục làm việc;
- Process ID, không gian địa chỉ, một phần trong cấu hình xử lý tín hiệu;
- Biến toàn cục và đối tượng trên heap.

Nếu chuyển sang ngữ cảnh Java/JVM, các Java thread còn chia sẻ trong cùng một tiến trình JVM các vùng dữ liệu thời gian chạy như heap, method area/metaspace. Method area/metaspace không phải là khái niệm của hệ điều hành phổ quát, đặt ở tầng JVM để hiểu sẽ phù hợp hơn.

Ở userspace (phía người dùng) của Linux, nhiều thread trong cùng một process gọi `getpid()` thường nhìn thấy cùng một thread group ID, tức là process ID thường hay gọi hàng ngày; nhưng mỗi thread trong kernel vẫn có task/TID riêng của mình, có thể dùng `gettid()` để phân biệt.

Mỗi thread cũng có nội dung riêng tư của mình:

- Stack: lưu lời gọi hàm, biến cục bộ, địa chỉ trả về, v.v.
- Thanh ghi và bộ đếm chương trình: ghi lại thread đang thực thi đến đâu.
- Thread ID, ưu tiên lập lịch, bộ lưu trữ cục bộ của thread (Thread Local Storage, TLS).
- Trạng thái thread và một lượng nhỏ thông tin ngữ cảnh mà kernel dùng để khôi phục việc thực thi.

Chia sẻ làm cho việc giao tiếp giữa các thread rất tiện, một thread ghi dữ liệu vào đối tượng trên heap, thread khác ngay lập tức có thể nhìn thấy. Nhưng chia sẻ cũng mang lại race condition trên dữ liệu (data race): nhiều thread đồng thời đọc/ghi cùng một dữ liệu có thể thay đổi, nếu không có lock, biến nguyên tử, biến điều kiện... thì kết quả có thể không đúng như mong đợi.

Đây cũng là khác biệt quan trọng trong thực tế giữa thread và process: một process sụp đổ thường không trực tiếp phá hủy process khác; còn một thread nào đó trong cùng process ghi quá giới hạn vào bộ nhớ, gây truy cập bất hợp pháp, thường sẽ kéo cả process đi theo.

## TCB là gì?

TCB (Thread Control Block, khối điều khiển thread) có thể hiểu là thông tin điều khiển ở cấp thread. Nó thường ghi lại thread ID, trạng thái thread, ngữ cảnh thanh ghi, thông tin stack, ưu tiên, bộ lưu trữ cục bộ của thread, v.v.

Trong một số sách giáo khoa hoặc triển khai hệ thống, PCB và TCB được tách riêng: PCB phụ trách tài nguyên cấp process, TCB phụ trách ngữ cảnh thực thi cấp thread. Còn `task_struct` của Linux thống nhất thực thể lập lịch thành task, rồi dựa trên việc cấu trúc tài nguyên có được chia sẻ hay không để phân biệt process và thread. Khi học khái niệm không cần băn khoăn quá về tên gọi, điều quan trọng là nhìn rõ thông tin nào thuộc về ranh giới tài nguyên, thông tin nào thuộc về ngữ cảnh thực thi.

## Đã có process tại sao vẫn cần thread?

Chủ yếu là để thực hiện đồng thời (concurrency) trong cùng một ứng dụng với chi phí thấp hơn.

Nếu một server (máy chủ) đồng thời phải xử lý đọc/ghi mạng, tính toán nghiệp vụ, ghi nhật ký xuống đĩa, dùng nhiều process tất nhiên cũng làm được, nhưng trạng thái chia sẻ giữa các process rất phiền phức, giao tiếp phải đi qua IPC, tài nguyên chiếm dụng cũng cao hơn. Đổi sang nhiều thread, chúng có thể trực tiếp chia sẻ bộ nhớ heap và các kết nối đang mở, chỉ cần viết đúng đồng bộ hóa thì chi phí hợp tác thấp hơn nhiều.

Thread cũng có thể nâng cao mức sử dụng tài nguyên. Trên CPU lõi đơn, khi một thread bị chặn ở I/O đĩa hoặc mạng, các thread khác có thể tiếp tục chạy; trên CPU đa lõi, nhiều thread có cơ hội thực thi đồng thời trên các lõi khác nhau. Nhu cầu về số lượng thread của tác vụ thiên về CPU và tác vụ thiên về I/O là khác nhau, không thể hiểu đơn giản là càng nhiều thread càng nhanh.

Thread không phải là tài nguyên miễn phí. Với NPTL của Linux, nếu giới hạn mềm `RLIMIT_STACK` lúc process khởi động không phải là `unlimited`, nó sẽ quyết định kích thước stack mặc định của thread mới; `ulimit -s` phổ biến là 8192 KB, do đó kích thước stack thread mặc định thường gặp là 8 MB. Nếu `RLIMIT_STACK` là `unlimited`, thì dùng giá trị mặc định phụ thuộc kiến trúc, ví dụ hầu hết kiến trúc là 2 MB. Cũng có thể dùng `pthread_attr_setstacksize()` để chỉ định kích thước stack thread, nhưng không được thấp hơn `PTHREAD_STACK_MIN`, giá trị trong Linux man-pages là 16384 byte. Ngoài ra, thread còn bị giới hạn bởi số lượng PID, `threads-max`, bộ nhớ, v.v. Trong hệ thống online, việc tạo mù quáng số lượng lớn platform thread, hậu quả thường thấy là áp lực bộ nhớ, chi phí lập lịch và chuyển ngữ cảnh gia tăng.

## User thread, kernel thread và mô hình thread phân biệt thế nào?

Theo "ai phụ trách lập lịch" mà xét, thread có thể chia thành user-level thread và kernel-level thread.

**User-level thread** do runtime hoặc thư viện thread ở user mode quản lý, kernel thường không nhìn thấy các thread này. Lợi ích của nó: việc tạo, chuyển đổi không nhất thiết cần phải gọi system call; vấn đề là nếu tất cả user thread chỉ tương ứng với một thực thể lập lịch của kernel, thì khi một trong số chúng thực hiện system call bị chặn, có thể kéo chậm cả process, đồng thời cũng khó tận dụng đa lõi.

**Kernel-level thread** do kernel hệ điều hành tạo và lập lịch. Một thread bị chặn, kernel vẫn có thể lập lịch các thread khác cùng process; nhiều thread cũng có thể thực thi song song trên đa lõi. Cái giá là tạo, hủy, chặn, đánh thức, chuyển ngữ cảnh đều cần kernel tham gia.

Các mô hình thread phổ biến có ba loại:

![Ba mô hình thread thường gặp](https://oss.javaguide.cn/github/javaguide/java/new-features/process-and-thread-three-thread-models.png)

| Mô hình                    | Ý nghĩa                                          | Ưu điểm                                                    | Vấn đề chính                                                                                |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Many-to-one (nhiều-một)    | Nhiều user thread ánh xạ tới một kernel thread   | Chuyển ngữ cảnh nhanh ở user mode, chi phí triển khai thấp | Một lần bị chặn có thể ảnh hưởng tới toàn bộ, không tận dụng tốt đa lõi                     |
| One-to-one (một-một)       | Một user thread ánh xạ tới một kernel thread     | Có thể tận dụng đa lõi, mức ảnh hưởng khi bị chặn nhỏ      | Số lượng thread bị giới hạn bởi tài nguyên hệ thống, chi phí tạo và chuyển ngữ cảnh cao hơn |
| Many-to-many (nhiều-nhiều) | Nhiều user thread ánh xạ tới nhiều kernel thread | Thỏa hiệp giữa tính linh hoạt và khả năng song song        | Runtime và việc triển khai lập lịch phức tạp hơn                                            |

POSIX thread của Linux và thread hệ thống Windows về cơ bản thuộc mô hình one-to-one. `pthread_create()` của Linux ở tầng đáy sẽ dùng `clone()`, và do các cờ `CLONE_VM`, `CLONE_FILES`, `CLONE_FS`, `CLONE_THREAD` quyết định chia sẻ các tài nguyên nào. Trên Linux, process và thread không phải là hai cơ chế tạo hoàn toàn tách rời, mà là sự khác biệt về chia sẻ tài nguyên do tham số của `clone()` khác nhau mang lại.

## Chuyển ngữ cảnh của thread và chuyển ngữ cảnh của process khác nhau thế nào?

![So sánh chi phí chuyển ngữ cảnh của thread và process](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/context-switch-cost-comparison.png)

Chuyển ngữ cảnh (context switch) chỉ việc CPU chuyển từ một thực thể thực thi này sang thực thể thực thi khác. Hệ điều hành cần lưu lại ngữ cảnh như thanh ghi, bộ đếm chương trình, con trỏ stack của thực thể hiện tại, rồi khôi phục ngữ cảnh của thực thể tiếp theo.

Việc chuyển đổi thread và chuyển đổi process đều có chi phí, nhưng chuyển đổi process thường nặng hơn. Nguyên nhân là process có không gian địa chỉ độc lập, khi chuyển có thể liên quan tới chi phí như đổi page table, TLB invalidation, giảm locality (tính cục bộ) của cache; còn các thread trong cùng process chia sẻ không gian địa chỉ, khi chuyển thường không cần đổi toàn bộ ánh xạ bộ nhớ.

Có thể rút gọn thành hai câu: chuyển đổi thread trong cùng process, chủ yếu là đổi ngữ cảnh thực thi như stack, thanh ghi, bộ đếm chương trình của thread đó; chuyển đổi khác process ngoài đổi ngữ cảnh thực thi còn có thể phải đổi không gian địa chỉ, và mang theo ảnh hưởng đến TLB và locality của cache.

Tuy nhiên, chuyển đổi thread cũng không thể chỉ xem là "lưu vài thanh ghi". Khi di chuyển giữa lõi (cross-core migration), cạnh tranh lock, cache line liên tục bị xóa, số thread nhiều vượt xa số lõi CPU, thì việc lập lịch thread vẫn tiêu tốn rất nhiều CPU. Trong phân tích hiệu năng, nếu thấy phần lớn thời gian dành cho lập lịch, chờ lock, system call và chuyển ngữ cảnh, thì việc tiếp tục thêm thread thường chỉ làm tình hình tệ hơn.

## Fiber, coroutine và virtual thread có được tính là thread không?

Fiber (sợi) và coroutine thường chạy ở user mode, được runtime hoặc ứng dụng lập lịch. Hệ điều hành thực sự lập lịch là các kernel thread chứa đựng chúng, chứ không phải từng fiber hay coroutine. Do đó, khi các đơn vị thực thi nhẹ này chuyển đổi thường không cần rơi vào kernel, chi phí có thể thấp hơn.

Nhưng chúng không phải là "thread miễn phí". Nếu runtime chưa biến đổi I/O bị chặn thành dạng có thể treo (suspend) và khôi phục (resume), thì một task ở user mode bị chặn sẽ chặn cả thread đang chứa nó, các task khác trên cùng thread đó cũng bị ảnh hưởng. Ngoài ra, các ngôn ngữ, runtime, kiến trúc CPU và độ sâu gọi stack khác nhau đều ảnh hưởng tới chi phí chuyển đổi, không thể lấy con số nanosecond trong một benchmark nào đó làm kết luận chung.

Virtual thread (thread ảo) do Java 21 giới thiệu là một ví dụ tiêu biểu. Nó vẫn là `java.lang.Thread`, nhưng không chiếm độc quyền một OS thread trong thời gian dài. Khi chạy, virtual thread sẽ gắn lên platform thread, platform thread lại tương ứng với kernel thread ở tầng hệ thống bên dưới; khi virtual thread thực thi I/O bị chặn có thể treo mà JDK hỗ trợ, JDK có thể trước tiên gỡ nó xuống, để platform thread đó chạy các virtual thread khác.

Vì vậy, virtual thread phù hợp cho những tác vụ "chờ I/O" số lượng lớn, ví dụ xử lý request đồng thời cao, truy cập database, gọi từ xa, v.v. Điều nó nâng cao là khả năng chứa đồng thời (concurrency) và khả năng mở rộng thông lượng (throughput), chứ không phải làm cho một đoạn code tính toán thuần CPU chạy nhanh hơn. Những tác vụ dài thiên về CPU vẫn phải xem xét số lõi CPU, khối lượng tính toán và chi phí lập lịch, không thể vứt vào virtual thread với số lượng vô hạn.

Mối quan hệ giữa virtual thread, platform thread và kernel thread của hệ thống:

![Mối quan hệ giữa virtual thread, platform thread và system kernel thread](https://oss.javaguide.cn/github/javaguide/java/new-features/virtual-threads-platform-threads-kernel-threads-relationship.png)

Cũng cần chú ý tới pinning. Lấy Java 21 làm ví dụ, khi virtual thread thực thi thao tác bị chặn trong khối/phương thức `synchronized`, phương thức native hoặc foreign function, nó có thể không gỡ xuống được khỏi platform thread đang chứa, kết quả là platform thread cũng bị chiếm giữ, không thể chạy các virtual thread khác. Pinning với số lượng ít, thời gian ngắn sẽ không làm chương trình sai, nhưng pinning thường xuyên và kéo dài sẽ ảnh hưởng tới khả năng mở rộng. Những JDK sau này đã có cải tiến đối với pinning liên quan tới `synchronized`, khi phán đoán thực tế phải căn cứ vào phiên bản JDK đang dùng; các biên như gọi native/foreign vẫn cần chú ý thêm.

## Sự khác biệt giữa process và thread tóm tắt thế nào?

Trong phỏng vấn có thể trả lời từ 5 góc độ: tài nguyên, lập lịch, giao tiếp, chi phí, độ tin cậy.

| Chiều                  | Process                                                                     | Thread                                                     |
| ---------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Vị trí cơ bản          | Đơn vị cơ bản của phân bổ và cách ly tài nguyên                             | Đơn vị cơ bản của lập lịch và thực thi CPU                 |
| Không gian địa chỉ     | Mặc định độc lập                                                            | Trong cùng process thì chia sẻ                             |
| Nội dung riêng tư      | PID, không gian địa chỉ, bảng tài nguyên, v.v.                              | Stack, thanh ghi, bộ đếm chương trình, TLS, v.v.           |
| Phương thức giao tiếp  | Cần IPC, như pipe, Socket, shared memory                                    | Có thể trực tiếp đọc/ghi shared memory, nhưng phải đồng bộ |
| Chi phí tạo/chuyển đổi | Thường cao hơn                                                              | Thường thấp hơn                                            |
| Tác động khi lỗi       | Cách ly tốt hơn, một process sụp đổ thường không ảnh hưởng tới process khác | Một thread sụp đổ có thể khiến cả process thoát            |

Câu trả lời tương đối đầy đủ có thể tổ chức như sau:

Process là vùng chứa tài nguyên khi chương trình chạy, sở hữu không gian địa chỉ ảo độc lập cùng các tài nguyên như file, quyền hạn; thread là luồng thực thi bên trong process, nhiều thread chia sẻ tài nguyên của process, nhưng mỗi cái tự lưu giữ ngữ cảnh thực thi như stack, thanh ghi, bộ đếm chương trình. Cách ly giữa các process mạnh hơn, chi phí giao tiếp và chuyển đổi cao hơn; việc hợp tác giữa các thread tiện hơn, tạo và chuyển đổi thường nhẹ hơn, nhưng chia sẻ bộ nhớ mang lại vấn đề an toàn thread, một thread lỗi cũng có thể ảnh hưởng tới cả process.

## Các hiểu lầm thường gặp

**Hiểu lầm một: process song song, thread đồng thời.**

Đồng thời (concurrency) và song song (parallelism) mô tả mối quan hệ thực thi, không phải thuộc tính cố định của process/thread. Trên lõi đơn, nhiều process hay thread đều chỉ có thể đồng thời; trên đa lõi, nhiều process hay thread đều có thể song song.

**Hiểu lầm hai: càng nhiều thread, hiệu năng càng tốt.**

Thread phù hợp để che giấu thời gian chờ I/O, cũng có thể tận dụng đa lõi; nhưng thread quá nhiều sẽ mang lại bộ nhớ stack, lập lịch, cạnh tranh lock và cache invalidation. Tác vụ thiên về CPU thường gần với cấu hình thread "quanh mức số lõi", tác vụ thiên về I/O mới có thể cần nhiều đơn vị thực thi đồng thời hơn.

**Hiểu lầm ba: giữa các process hoàn toàn không thể chia sẻ bộ nhớ.**

Mặc định cách ly không bằng không thể chia sẻ. Shared memory chính là cách IPC chuyên để cho phép nhiều process ánh xạ cùng một vùng bộ nhớ vật lý, chỉ là lập trình viên cần tự xử lý đồng bộ hóa và vòng đời.

**Hiểu lầm bốn: Java virtual thread chính là thread của hệ điều hành.**

Platform thread thường là lớp bọc mỏng của OS thread; virtual thread do Java runtime lập lịch, sẽ được gắn lên platform thread để thực thi. Chúng đều hiện ra như `Thread`, nhưng mô hình tài nguyên và cách thức lập lịch khác nhau.
