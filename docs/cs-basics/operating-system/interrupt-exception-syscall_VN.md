---
title: "Chi tiết về Ngắt, Ngoại lệ và System Call: Từ lối vào nhân đến Page Fault"
description: "Tổng hợp câu hỏi phỏng vấn tần suất cao về ngắt, ngoại lệ và system call, lấy read() làm mạch chính để làm rõ mối quan hệ giữa ngắt phần cứng, ngoại lệ đồng bộ, system call, tín hiệu, ngắt đồng hồ, page fault và context switch của thread."
category: Kiến thức cơ bản máy tính
tag:
  - Hệ điều hành
  - Linux
  - System call
head:
  - - meta
    - name: keywords
      content: 中断,异常,系统调用,trap,信号,用户态,内核态,上下文切换,时钟中断,缺页异常,Page Fault,SIGSEGV,read,操作系统面试题
---

System call đi từ user mode vào kernel mode chỉ là điểm khởi đầu để hiểu đường đi này. Đi sâu theo một lần gọi `read()`, còn gặp một số vấn đề có liên quan chặt chẽ:

- `read()` đi vào kernel như thế nào?
- Vì sao ngắt đồng hồ có thể khiến thread đang chạy phải dừng lại?
- Vì sao Page Fault đôi khi là hành vi bình thường, đôi khi lại trở thành `SIGSEGV`?
- System call đã vào kernel, liệu có nhất định xảy ra context switch của thread không?

Những vấn đề này có thể được nối lại với nhau qua một lần gọi `read(fd, buf, count)`. Chương trình người dùng thực thi `read()`, glibc đưa số hiệu system call và tham số vào các thanh ghi quy ước, CPU thực thi `syscall` để vào kernel. Kernel kiểm tra fd, địa chỉ vùng đệm, trạng thái file, rồi quyết định lấy dữ liệu từ Page Cache, file system, vùng đệm socket hay driver thiết bị.

Nếu dữ liệu đã sẵn sàng, kernel sẽ copy dữ liệu về vùng đệm người dùng và `read()` trả về rất nhanh. Khi dữ liệu chưa sẵn sàng, thread hiện tại có thể ngủ; sau khi disk I/O hoàn tất hoặc card mạng nhận được dữ liệu, ngắt phần cứng sẽ vào kernel, kernel lại đánh thức thread trong hàng đợi chờ. Chỉ khi thread được lên lịch lên CPU lần nữa, `read()` mới tiếp tục trả về.

Khi một lần I/O thông thường chạy lên, system call, ngắt, ngoại lệ và lập lịch thường đi liền với nhau.

## Một số loại sự kiện đi vào kernel

Khi CPU thực thi chương trình người dùng bình thường, lệnh tiếp theo được quyết định bởi program counter và logic nhảy. Sự kiện từ thiết bị ngoại vi, lỗi của lệnh hiện tại, hay chương trình người dùng chủ động yêu cầu dịch vụ kernel, đều khiến luồng điều khiển chuyển vào kernel. CSAPP gọi trường hợp thoát khỏi luồng lệnh bình thường này là Exceptional Control Flow (luồng điều khiển ngoại lệ), và phân loại thành interrupt, trap, fault, abort.

Các lối vào thường gặp có thể phân loại theo nguồn gốc:

- **Ngắt (Interrupt)**: đến từ phần cứng bên ngoài, không có quan hệ trực tiếp với lệnh hiện tại. Card mạng nhận gói, disk I/O hoàn tất, hết thời gian hẹn giờ, đều thuộc loại này.
- **Trap (bẫy)**: chương trình chủ động thực thi lệnh đặc biệt để vào kernel. System call chính là trap thường gặp nhất.
- **Fault (lỗi)**: lệnh hiện tại gặp vấn đề khi thực thi, nhưng kernel có thể tiến hành sửa chữa. Ví dụ điển hình là page fault, sau khi sửa xong sẽ thực thi lại lệnh đã kích hoạt fault.
- **Abort (hủy bỏ)**: bộ xử lý phát hiện lỗi nghiêm trọng khó hồi phục, thường không quay lại luồng lệnh ban đầu nữa.

![Sơ đồ quan hệ ngắt, ngoại lệ và system call](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/ecf-kernel-entry-map.webp)

Cách dùng từ `trap` trong các tài liệu khác nhau không hoàn toàn giống nhau. Trong ngữ cảnh CSAPP, nó thường chỉ ngoại lệ đồng bộ do chương trình chủ động kích hoạt, chẳng hạn như system call; RISC-V thì định nghĩa trap là sự chuyển giao điều khiển do ngoại lệ hoặc ngắt gây ra. Bài viết này khi nhắc tới "trap / system call" dùng nghĩa hẹp loại trước, khi liên quan đến RISC-V sẽ giải thích riêng.

## Mối quan hệ giữa ngắt, ngoại lệ, system call và tín hiệu

Những từ này dễ bị lẫn lộn vì chúng không nằm cùng một tầng.

Ngắt phần cứng, ngoại lệ đồng bộ và system call mô tả vì sao CPU vào kernel; tín hiệu (signal) là thông báo phần mềm mà kernel giao tới process hoặc thread. Tín hiệu có thể được chuyển đổi từ ngoại lệ phần cứng, cũng có thể được sinh ra bởi process khác, terminal hoặc bộ định thời.

Trước tiên hãy đặt mấy khái niệm này vào một bảng:

| Khái niệm        | Nguồn kích hoạt                                                                    | Đồng bộ/Bất đồng bộ                                | Ai xử lý                                                            | Kết quả thường gặp                                               |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Ngắt phần cứng   | Thiết bị ngoại vi hoặc bộ định thời                                                | Bất đồng bộ                                        | Trình xử lý ngắt của kernel                                         | Xử lý sự kiện thiết bị, đánh thức tác vụ chờ, kích hoạt lập lịch |
| Ngoại lệ đồng bộ | Quá trình thực thi lệnh hiện tại                                                   | Đồng bộ                                            | Trình xử lý ngoại lệ của kernel                                     | Sửa xong thì thử lại, chuyển thành tín hiệu, kết thúc process    |
| System call      | Trap do chương trình người dùng thực thi lệnh `syscall`/`ecall` chủ động kích hoạt | Đồng bộ                                            | Lối vào system call của kernel                                      | Trả về kết quả, trả về mã lỗi, chặn chờ tài nguyên               |
| Tín hiệu         | Thông báo do kernel hoặc process phát ra                                           | Thường bất đồng bộ, cũng có thể do ngoại lệ gây ra | Hành động mặc định của process đích hoặc signal handler ở user mode | Bỏ qua, kết thúc, tạm dừng, tiếp tục, thực thi handler           |

Đồng bộ/bất đồng bộ trong bảng này, xét xem sự kiện có phải do lệnh hiện tại gây ra hay không. Chia cho 0, lệnh bất hợp pháp, Page Fault, và system call đều liên quan tới lệnh đang thực thi, nên là sự kiện đồng bộ. Ngắt phần cứng đến từ thiết bị ngoại vi hoặc bộ định thời, khi CPU đang chạy thread Java, card mạng cũng có thể vừa đúng lúc nhận được gói, việc này không có quan hệ trực tiếp tới dòng mã người dùng hiện tại, nên là sự kiện bất đồng bộ.

Chặn và không chặn (blocking/non-blocking) là một chiều khác. Việc `read()` đi vào kernel là đồng bộ, nhưng sau khi vào kernel, nếu tài nguyên chưa sẵn sàng, fd ở chế độ chặn sẽ khiến thread ngủ; fd được cài `O_NONBLOCK` thì có thể trực tiếp trả về `EAGAIN`.

Ngắt phần cứng như thể thiết bị ngoại vi gõ cửa CPU một cái. Ví dụ CPU đang chạy thread Java của bạn, ngắt đồng hồ đến, CPU sau khi chạy xong lệnh hiện tại sẽ vào lối vào ngắt của kernel. Kernel cập nhật đồng hồ, thống kê thời gian chạy, khi cần thiết thì bảo scheduler giao CPU cho thread khác. Trong mã của bạn không viết lệnh nhường CPU, nhưng nó vẫn có thể bị đoạt quyền (preempt).

Ngoại lệ xuất phát từ chính lệnh hiện tại. Chia cho 0, thực thi lệnh bất hợp pháp, truy cập địa chỉ không có quyền, đều là vấn đề do lệnh này gây ra. Page fault cũng thuộc loại này: process truy cập một địa chỉ ảo nào đó, trong bảng trang tạm thời chưa có ánh xạ hợp lệ, CPU chỉ có thể giao hiện trường cho kernel. Ngoại lệ đồng bộ không có nghĩa là chắc chắn sửa được, khi kernel không sửa được, vẫn sẽ gửi tín hiệu hoặc kết thúc process.

System call chính là việc chương trình người dùng chủ động nhờ kernel giúp đỡ. Chương trình ở user mode không thể trực tiếp đọc disk, sửa bảng trang, thao tác card mạng, nên `read()`, `write()`, `fork()`, `mmap()` của glibc cuối cùng đều phải đi tới giao diện system call do kernel cung cấp.

Tín hiệu không thuộc cơ chế lối vào CPU. Nó là thông báo mà kernel gửi cho process hoặc thread. Truy cập bộ nhớ bất hợp pháp có thể trước tiên kích hoạt Page Fault, kernel phát hiện không thể sửa, lại gửi `SIGSEGV` cho process. Người dùng bấm `Ctrl+C`, trình điều khiển terminal sẽ khiến kernel gửi `SIGINT` cho nhóm process ở tiền cảnh. Một process khác cũng có thể gọi `kill()` để gửi tín hiệu.

Mấy chiều dễ bị lẫn lộn có thể tách ra để xem:

| Chiều                        | Vấn đề quan tâm                                           | Ví dụ                                                                     |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Sự kiện đồng bộ/bất đồng bộ  | Sự kiện có do lệnh hiện tại trực tiếp kích hoạt hay không | Page Fault là ngoại lệ đồng bộ; ngắt card mạng là ngắt bất đồng bộ        |
| I/O chặn/không chặn          | Khi tài nguyên chưa sẵn sàng thread có chờ hay không      | `read()` ở chế độ chặn sẽ ngủ; `read()` không chặn có thể trả về `EAGAIN` |
| Chuyển user mode/kernel mode | Có vào kernel thực thi mã đặc quyền hay không             | `syscall`, Page Fault, ngắt phần cứng đều vào kernel                      |
| Context switch của thread    | CPU có chuyển từ thread này sang thread khác hay không    | Chặn, đoạt quyền, lập lịch đều có thể xảy ra                              |

Signal handler cũng không phải hàm của kernel. Kernel thường kiểm tra tín hiệu đang chờ xử lý trước khi từ kernel mode trở về user mode; nếu cần thực thi handler, thì chuẩn bị user stack, thanh ghi và trampoline, rồi để thread trở về user mode thực thi handler. Vì vậy, signal handler thường không được chèn vào thực thi ngay giữa bất kỳ lệnh máy nào, mà chờ khi thread trở về user mode từ kernel mode, hoặc được đánh thức từ trạng thái chờ có thể bị ngắt, rồi theo sự sắp xếp của kernel đi vào handler. Chương trình đa luồng còn cần để ý thêm một bước: tín hiệu gửi cho process, không nhất thiết do thread mà ta tưởng tượng xử lý, kernel sẽ chọn một thread không chặn tín hiệu đó.

Sau khi xử lý xong sự kiện, quay về đâu cũng khác nhau:

| Loại               | Sau khi xử lý thường quay về đâu                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Ngắt               | Quay về vị trí bị ngắt để tiếp tục thực thi, hoặc lập lịch sang thread khác                                    |
| Trap / System call | Thường quay về sau lệnh trap để tiếp tục thực thi; ngoại trừ các trường hợp như system call được khởi động lại |
| Fault / Page fault | Sau khi sửa xong thực thi lại lệnh đã kích hoạt fault đó                                                       |
| Abort              | Thường không trả về chương trình ban đầu                                                                       |

Bảng này chỉ mô tả đường đi thường gặp nhất. Trong hệ thống thực, kernel còn có thể gửi tín hiệu, khởi động lại system call, chuyển sang thread khác, hoặc trực tiếp kết thúc process.

## Chuyển user mode/kernel mode và context switch

Khác biệt giữa user mode và kernel mode nằm ở mức đặc quyền của CPU. User mode không thể thực thi lệnh đặc quyền, không thể tùy tiện truy cập không gian địa chỉ kernel; kernel mode có thể quản lý bảng trang, thiết bị, bộ điều khiển ngắt và scheduler.

Từ user mode vào kernel mode không phải là lời gọi hàm thông thường. CPU và kernel phải lưu đủ thông tin hiện trường, nếu không sau này không biết quay về lệnh nào của chương trình người dùng.

Trên x86-64, system call 64 bit thường đi qua lệnh `syscall`; ngoại lệ và ngắt ngoài thường đi qua lối vào được cấu hình trong IDT. Một số ngoại lệ sẽ đẩy mã lỗi vào stack, một số thì không; các lối vào đặc biệt như NMI, Double Fault còn có thể dùng stack IST.

Bài viết này lấy Linux x86-64 làm ví dụ, nên chủ yếu viết về `syscall`. Kiến trúc khác hoặc ABI cũ có thể dùng các lệnh lối vào như `int 0x80`, `sysenter`, `ecall`, `svc`, quy ước thanh ghi cũng khác nhau.

Bản thân lệnh `syscall` làm được việc có hạn. Nó sẽ đặt địa chỉ trả về và thanh ghi cờ vào `RCX`, `R11`, nhưng không lưu hiện trường thanh ghi đầy đủ như lời gọi hàm thông thường, cũng không tự động chuyển sang kernel stack. Assembly lối vào của Linux còn tiếp tục hoàn thành việc đổi stack, `swapgs`, lưu thanh ghi...

Cần phân biệt chuyển user mode/kernel mode và context switch của thread:

- Chuyển user mode/kernel mode: CPU từ mức đặc quyền thấp vào mức đặc quyền cao, thực thi mã kernel, rồi trở về user mode.
- Context switch: scheduler chuyển CPU từ thread hoặc process này sang thực thể thực thi khác.

System call nhất định sẽ vào kernel, nhưng không nhất định chuyển sang thread khác. Những lời gọi như `getpid()` thường trả về rất nhanh, vẫn là thread hiện tại tiếp tục chạy. `read()` nếu phải chờ dữ liệu, kernel có thể treo thread hiện tại, lập lịch thread khác trước. Ngoài ra, một số giao diện liên quan đến thời gian có thể hoàn thành ở user mode nhờ vDSO, ví dụ `clock_gettime()`, `gettimeofday()` trong vài kiến trúc và cấu hình nhất định có thể đọc trang dữ liệu mà kernel ánh xạ cho user mode, không nhất thiết lần nào cũng thực sự vào kernel.

![Sơ đồ so sánh chuyển user mode/kernel mode và context switch](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/kernel-mode-vs-context-switch.webp)

## Đường đi system call của `read()`

Lấy `read(fd, buf, count)` trên Linux x86-64 làm ví dụ, mã nghiệp vụ thường gọi hàm bọc (wrapper) của glibc, không tự viết assembly.

![Sơ đồ luồng hệ thống gọi read](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/read-syscall-path.webp)

glibc sẽ đặt số hiệu system call vào `rax`, đặt tham số vào các thanh ghi quy ước. Tham số system call x86-64 lần lượt đặt trong `rdi`, `rsi`, `rdx`, `r10`, `r8`, `r9`.

Sau khi CPU thực thi `syscall`, sẽ theo quy ước kiến trúc nhảy đến lối vào do kernel cấu hình. Mã lối vào của Linux lưu trạng thái thanh ghi cần dùng sau này, rồi theo số hiệu system call phân phát đến hàm xử lý tương ứng của `read`. Kernel sẽ kiểm tra fd, quyền truy cập và các tham số khác; khi thực sự copy dữ liệu về vùng đệm người dùng, vấn đề địa chỉ vẫn có thể dẫn đến `EFAULT`.

Khi mục tiêu là file thông thường, đường đi sẽ qua VFS và file system cụ thể, ưu tiên lấy dữ liệu từ Page Cache. Khi mục tiêu là socket, kernel sẽ kiểm tra vùng đệm nhận (receive buffer) có dữ liệu hay không. Sau khi dữ liệu sẵn sàng, kernel copy dữ liệu vào `buf` mà người dùng truyền vào.

Khi kernel truy cập vùng đệm người dùng, cũng có thể kích hoạt Page Fault. Linux ghi lại những điểm truy cập bộ nhớ người dùng có thể fault vào exception table; nếu fault xảy ra ở vị trí có thể sửa, kernel sẽ nhảy đến đoạn mã fixup tương ứng, chuyển kết quả thành lỗi như `-EFAULT` để trả về, thay vì để kernel sập trực tiếp.

Ví dụ, truyền `buf` của `read()` thành địa chỉ rõ ràng không thể ghi, system call thường không kéo kernel chết theo, mà trả về `-1` và đặt `errno` thành `EFAULT`.

```c
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
    int fd = open("/dev/zero", O_RDONLY);
    char *p = (char *)1;
    ssize_t n = read(fd, p, 1); // n == -1, errno == EFAULT
    printf("n=%zd errno=%d\n", n, errno);
}
```

Mô tả `EFAULT` của `read(2)` chính là vùng đệm người dùng không nằm trong không gian địa chỉ có thể truy cập. Tương ứng với đường đi trong kernel, vấn đề nằm ở bước kernel copy dữ liệu trở về vùng đệm người dùng. Tài liệu exception table của x86 cũng dùng `get_user()` làm ví dụ: lệnh truy cập bộ nhớ người dùng có thể fault sẽ đi đôi với một đoạn mã fixup; khi Page Fault xảy ra, kernel tra được cặp địa chỉ này, thì đổi giá trị trả về thành `-EFAULT`, rồi nhảy đến đường path fixup tiếp tục hoàn tất.

Khi system call trả về, `read()` thành công trả về số byte thực sự đọc được, giá trị này có thể nhỏ hơn `count`, không coi là lỗi. Khi thất bại, kernel trả về mã lỗi âm, hàm bọc glibc thường chuyển nó thành `-1` và đặt `errno`. Khi vùng đệm người dùng không thể truy cập có thể nhận `EFAULT`; trong lúc chặn chờ bị tín hiệu cắt ngang, có thể nhận `EINTR`.

Khi viết code production, đừng mặc định một lần `read()` hoặc là đọc đầy, hoặc là thất bại. Trong lúc system call chặn đang chờ, nếu thread nhận được tín hiệu và thực thi handler, system call có thể trả về `EINTR`; nếu trước khi tín hiệu đến đã đọc được một phần dữ liệu, `read()` cũng có thể trực tiếp trả về số byte đã đọc được, chứ không phải thất bại. Nếu khi cài handler dùng `SA_RESTART`, một phần system call chặn sẽ tự động khởi động lại sau khi handler trả về. Có khởi động lại hay không, phụ thuộc vào loại giao diện và cài đặt xử lý tín hiệu.

## Ngắt đồng hồ và đoạt quyền (preemption)

Hệ điều hành có đoạt quyền không thể trông chờ mọi chương trình chủ động nhường CPU. Giáo trình thường đơn giản hóa đường đi này thành việc kernel cấu hình bộ định thời, phần cứng sinh ra ngắt theo chu kỳ. Linux hiện đại hỗ trợ tickless, máy thực tế không nhất thiết lúc nào cũng sinh ra scheduling tick theo tần suất cố định, nhưng ngắt của bộ định thời vẫn là mô hình cơ sở để hiểu sự đoạt quyền.

Giả sử thread A đang chạy ở user mode. Sau khi bộ định thời đến điểm, CPU đi vào trình xử lý ngắt đồng hồ của kernel. Kernel cập nhật thời gian chạy của thread hiện tại, kiểm tra có cần lập lịch hay không. Nếu không cần lập lịch, sau khi xử lý xong trả về A, A tiếp tục chạy; nếu cần lập lịch, kernel lưu hiện trường thực thi của A, chọn thread B, chuyển sang kernel stack và ngữ cảnh thanh ghi của B, cuối cùng từ kernel trở về vị trí user mode của B.

OSTEP khi giảng về Limited Direct Execution cũng khai triển theo mạch này: ngắt trước tiên khiến phần cứng và kernel lưu các thanh ghi người dùng của process hiện tại, kernel lại gọi routine chuyển ngữ cảnh lưu ngữ cảnh process cũ, khôi phục ngữ cảnh process mới, cuối cùng thông qua return-from-trap trở về process mới.

Đường đi này nhất định đã xảy ra ngắt, còn có xảy ra context switch hay không tùy thuộc scheduler có chọn được thread khác hay không.

Trình xử lý ngắt phần cứng nói chung phải nhanh vào nhanh ra, không thể tùy tiện chặn chờ như ngữ cảnh process thông thường. Công việc nặng hơn sẽ được hoãn sang softirq, work queue hoặc kernel thread để xử lý.

Card mạng nhận gói là một ví dụ thường gặp. Đường đi cơ bản của NAPI trên Linux là: thiết bị trước tiên dùng ngắt phần cứng thông báo cho host, driver lập lịch NAPI trong trình xử lý ngắt, việc xử lý packet phía sau thường chạy trong ngữ cảnh softirq. Sau khi driver lập lịch NAPI thường giữ cho IRQ được masked đến khi NAPI polling kết thúc, vì trong khoảng thời gian này tiếp tục nhận ngắt phần cứng là không cần thiết. Khi khối lượng xử lý quá lớn hoặc softirq bị hoãn, cũng có thể do kernel thread như `ksoftirqd` tiếp tục xử lý. Trên môi trường online thấy `ksoftirqd` hoặc `%si` cao kéo dài, cần liên tưởng đến việc xử lý packet mạng, áp lực softirq và tính affinity của ngắt. Ngắt phần cứng chỉ chịu trách nhiệm treo công việc phía sau, khi xử lý packet hàng loạt đã chuyển sang ngữ cảnh softirq hoặc kernel thread.

## Đường đi bình thường và đường đi lỗi của page fault

Cái tên Page Fault dễ khiến người ta nghĩ chương trình đã gặp lỗi. Thực ra, nó chỉ biểu thị rằng khi CPU làm ánh xạ địa chỉ hoặc kiểm tra quyền, mục bảng trang hiện tại không thể hoàn tất đủ cho lần truy cập này.

Một số trường hợp thường gặp:

1. Trang chưa được cấp phát bộ nhớ vật lý, ví dụ trang heap được cấp phát lười (lazy) lần đầu được truy cập;
2. Trang nằm trong file hoặc Swap, hiện chưa được nạp vào bộ nhớ;
3. Trang COW bị ghi, bảng trang tạm thời đánh dấu là chỉ đọc, cần kernel copy ra một bản;
4. Quyền truy cập không đúng, ví dụ user mode truy cập trang kernel, ghi trang chỉ đọc, thực thi trang không thể thực thi;
5. Địa chỉ vốn không thuộc vùng địa chỉ ảo hợp pháp của process.

![Sơ đồ nhánh xử lý Page Fault](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/page-fault-branching.webp)

Khi kernel xử lý Page Fault, trước tiên xem địa chỉ có nằm trong VMA hợp pháp của process hay không, rồi xem loại truy cập và quyền có khớp hay không.

Page fault hợp pháp có thể sửa. Kernel cấp phát trang vật lý, đọc trang từ file, đổi vào từ Swap, hoặc xử lý COW, cập nhật bảng trang rồi trả về. CPU sẽ thực thi lại lệnh đã kích hoạt ngoại lệ. Loại page fault này có thể là minor fault, cũng có thể là major fault, khác biệt ở chỗ có thực sự cần I/O hay không.

Khi địa chỉ không thuộc bất kỳ VMA hợp pháp nào, hoặc cách truy cập vi phạm quyền cấp trang, kernel thường gửi `SIGSEGV` đến thread hiện tại. Truy cập vùng quanh `NULL`, ghi ánh xạ chỉ đọc đều thuộc loại này. Truy cập ngoài phạm vi (out-of-bounds) trong C/C++ thì không đảm bảo kích hoạt Page Fault: nếu địa chỉ đích vẫn nằm trong trang đã ánh xạ và quyền cho phép, chương trình có thể chỉ phá hỏng dữ liệu lân cận. Chỉ khi địa chỉ ngoài phạm vi rơi vào vùng chưa ánh xạ hoặc vi phạm quyền cấp trang, phần cứng mới thông qua Page Fault giao vấn đề cho kernel.

COW fork và lazy allocation của xv6 rất thích hợp để hiểu điều này. Process cha con trước tiên chia sẻ trang chỉ đọc, ai ghi người đó kích hoạt page fault, kernel copy trang rồi cho phép việc ghi tiếp tục; khi process mở rộng không gian địa chỉ, kernel có thể trước chỉ ghi nhận khoảng, chờ đến lần truy cập đầu tiên mới cấp phát trang vật lý. Cả hai tình huống đều nhờ Page Fault để hoãn công việc lại.

`userfaultfd(2)` có thể làm một ví dụ nâng cao: sau khi user mode đăng ký một vùng bộ nhớ nào đó, các page fault như missing, minor hoặc write-protect có thể trở thành sự kiện trên fd; thread kích hoạt fault bị chặn trước, một thread user mode khác bổ trang, tiếp tục hoặc gỡ bỏ chặn ghi rồi để nó tiếp tục. Cơ chế kiểu này thường dùng cho di trú máy ảo, lazy loading và theo dõi dirty page, nhưng nghiệp vụ backend thông thường hiếm khi dùng trực tiếp.

## Chi phí của system call

System call nặng hơn lời gọi hàm thông thường. Lời gọi hàm thông thường vẫn nằm ở user mode, theo ABI truyền tham số, lưu hiện trường cần thiết và hoàn thành nhảy và trả về; system call còn phải chuyển sang kernel mode, qua mã lối vào lưu hiện trường, thực hiện kiểm tra quyền, và có thể truy cập bảng trang, đối tượng file, driver thiết bị hoặc hàng đợi chờ. Trước khi từ kernel trở về user mode, kernel còn có thể kiểm tra các trạng thái như tín hiệu chờ xử lý, đoạt quyền và cờ lập lịch.

Nhưng chi phí của system call không thể quy chung một cách chung chung. Loại lời gọi như `getpid()` chủ yếu tốn cho việc vào và ra khỏi kernel; `read()` khi gặp disk I/O, chi phí chủ yếu nằm ở chờ thiết bị và copy dữ liệu. Khóa triển khai dựa trên futex khi không có cạnh tranh thường chỉ thực thi thao tác nguyên tử ở user mode, không gọi `futex(2)`; chỉ khi phát sinh cạnh tranh, cần thread ngủ hoặc đánh thức, mới thông qua `futex(2)` vào kernel.

Trong công việc, đừng vì tiết kiệm ít system call mà hy sinh tính đúng đắn. Tối ưu phổ biến hơn là batching và giảm chờ đợi vô nghĩa: buffered I/O, đọc ghi nhiều dữ liệu hơn trong một lần, I/O multiplexing, `sendfile()`, `mmap()`, `io_uring`, mỗi cái trong từng tình huống khác nhau giảm bớt chi phí chuyển chế độ, copy hoặc chờ đợi.

## Trọng điểm trả lời phỏng vấn

Trả lời câu hỏi "ngắt, ngoại lệ, system call có quan hệ gì", có thể theo nguồn gốc lối vào để nói:

> CPU bình thường chạy theo luồng lệnh. Sự kiện thiết bị ngoại vi, lỗi lệnh hiện tại, chương trình người dùng chủ động yêu cầu dịch vụ kernel, đều khiến luồng điều khiển vào kernel. Ngắt phần cứng đến từ thiết bị bên ngoài, là bất đồng bộ; ngoại lệ đồng bộ do lệnh hiện tại kích hoạt; system call là trap do chương trình thông qua lệnh `syscall`, `ecall` chủ động kích hoạt, cũng thuộc sự kiện đồng bộ. Sau khi kernel xử lý xong, có thể quay về chương trình ban đầu tiếp tục thực thi, cũng có thể lập lịch thread khác, hoặc gửi tín hiệu cho process.

Trả lời câu hỏi "luồng system call", có thể nắm vào `read()`:

> Hàm bọc glibc đặt số hiệu system call và tham số vào các thanh ghi quy ước, thực thi `syscall`. CPU trước tiên theo quy ước kiến trúc vào lối vào kernel, mã lối vào của Linux lại lưu trạng thái thanh ghi cần dùng sau này, và theo số hiệu system call phân phát đến hàm xử lý tương ứng, kiểm tra tham số và quyền, thực thi logic VFS, mạng, quản lý bộ nhớ... Khi trả về đặt kết quả lại vào thanh ghi; khi gặp lỗi thường do glibc chuyển thành `-1` và `errno`. Nếu lời gọi phải chờ I/O, thread sẽ chặn, sau đó ngắt thiết bị sẽ đánh thức nó.

Trả lời câu hỏi "khác biệt giữa page fault và truy cập bất hợp pháp", nắm vào sự phân luồng của kernel:

> Page Fault chỉ là việc CPU phát hiện lần ánh xạ địa chỉ hoặc kiểm tra quyền này không qua được. Kernel sẽ phán đoán địa chỉ và quyền có hợp pháp không. Page fault hợp pháp có thể sửa, ví dụ cấp phát trang ẩn danh, điều trang từ file hoặc Swap, xử lý COW, rồi thực thi lại lệnh kích hoạt ngoại lệ; truy cập bất hợp pháp không thể sửa được, thường gửi `SIGSEGV`, process mặc định bị kết thúc.

Chuyển user mode/kernel mode và context switch của thread không phải là một việc. Một system call thực sự nhất định vào kernel, nhưng chỉ khi scheduler chọn được thực thể thực thi khác, CPU mới chuyển thread, ví dụ thread hiện tại bị chặn, chủ động nhường CPU hoặc bị đoạt quyền.
