---
title: "I/O Đa kênh chi tiết: Nguyên lý và sự khác biệt của select、poll、epoll"
description: "Tổng hợp câu hỏi phỏng vấn tần suất cao về I/O đa kênh (I/O multiplexing), bắt đầu từ hai giai đoạn của một lần đọc mạng, phân tích nguyên lý triển khai, cấu trúc dữ liệu, sự khác biệt về hiệu năng, chế độ kích hoạt LT/ET của select、poll、epoll, cùng ứng dụng trong Redis、Nginx、Java NIO và Netty."
category: Kiến thức nền tảng khoa học máy tính
tag:
  - Hệ điều hành
  - Lập trình mạng
  - Linux
head:
  - - meta
    - name: keywords
      content: I/O多路复用,IO多路复用,select,poll,epoll,Linux epoll,LT,ET,Java NIO,Netty,Redis,Nginx,操作系统面试题
---

Viết một TCP server, cách viết trực quan nhất là: thread chính `accept` một kết nối, rồi giao cho một thread mới để `read`、xử lý、`write`. Khi số kết nối ít, cách này chạy rất tốt.

Nhưng một khi số kết nối lên tới hàng vạn, vấn đề sẽ xuất hiện. Trong nhiều bản phân phối Linux, theo mặc định mỗi thread mới sẽ dự trữ vài MB không gian stack, cấu hình phổ biến là 8 MB (giá trị thực tế phụ thuộc vào `ulimit -s`、runtime và thuộc tính thread). Với một vạn kết nối, dù chỉ số trang stack được cấp phát theo nhu cầu, nhưng không gian địa chỉ dự trữ、các trang stack thực sự được dùng cộng thêm metadata của thread cũng rất đáng kể; tệ hơn nữa, mấy nghìn đến mấy vạn thread chen chúc trên vài lõi CPU, chỉ riêng việc chuyển ngữ cảnh (context switch) giữa các thread đã ăn mất hơn nửa CPU, thời gian thực sự làm việc chẳng còn bao nhiêu. Chưa kể phần lớn kết nối thực ra đang rảnh rỗi — mỗi kết nối chiếm một thread nhưng chỉ ngồi đó chờ dữ liệu.

Đây chính là vấn đề C10K kinh điển: **làm thế nào để một (hoặc một số ít) thread đồng thời trông chừng hàng vạn kết nối, ai có dữ liệu thì xử lý người đó.**

Câu trả lời chính là **I/O đa kênh (I/O multiplexing)**.

Dưới đây tôi sẽ trình bày lần lượt theo thứ tự select、poll、epoll, chúng giải quyết cùng một vấn đề, nhưng cái sau thông minh hơn cái trước.

## I/O đa kênh là gì?

Muốn nói rõ, trước tiên phải biết một lần đọc mạng ở trong nhân (kernel) thực ra chia thành hai giai đoạn:

1. **Chờ dữ liệu sẵn sàng**: Dữ liệu vẫn còn ở card mạng, vẫn đang trên đường, kernel phải chờ nó đến và sao chép vào bộ đệm kernel. Bước này thường rất chậm.
2. **Sao chép dữ liệu**: Dữ liệu đến bộ đệm kernel rồi, mới sao chép từ trạng thái kernel sang bộ đệm ứng dụng ở trạng thái người dùng. Bước này rất nhanh.

![Hai giai đoạn của quá trình đọc mạng: trước tiên chờ dữ liệu từ card mạng vào bộ đệm kernel, sau đó sao chép sang bộ đệm ứng dụng qua copy_to_user](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/io-multiplexing-io-two-phases.png)

Mô hình chặn cứ mỗi kết nối một thread, vấn đề nằm ở giai đoạn thứ nhất: thread sau khi gọi `recv` thì kẹt cứng tại đó, chuyên môn chờ dữ liệu cho riêng kết nối này, trong lúc chờ chẳng làm được gì.

I/O đa kênh đổi hướng tư duy: giao tất cả các file descriptor (fd) cần giám sát cho kernel, để thread chặn trên một lời gọi hệ thống giám sát chuyên dụng. Chỉ cần có bất kỳ fd nào trong số đó sẵn sàng, lời gọi này sẽ trả về, cho bạn biết cái nào đọc được, cái nào ghi được, rồi bạn mới đi xử lý những fd đã sẵn sàng đó.

Lấy ví dụ: một người phục vụ trông cùng lúc mười bàn, không phải đứng cạnh bàn thứ nhất chờ khách chọn xong món, mà là liếc qua lại một vòng, bàn nào giơ tay thì đến bàn đó.

**Đa kênh (multiplexing)** chỉ việc có nhiều kết nối, **dùng chung (reuse)** chỉ việc dùng chung cùng một thread để xử lý chúng.

Chú ý một điểm dễ gây nhầm lẫn: bản thân đa kênh vẫn là **I/O đồng bộ (synchronous I/O)**. Các lời gọi kiểu `select` chỉ báo cáo fd đã sẵn sàng, còn ứng dụng vẫn phải chủ động gọi `recv` để hoàn tất việc đọc. Đồng bộ không có nghĩa là chặn (blocking): lần `recv` này có phải chờ hay không còn phụ thuộc vào việc fd có được đặt làm non-blocking hay không, trạng thái sẵn sàng có thay đổi trước khi đọc hay không... Event loop thường kết hợp dùng với fd non-blocking.

## Vị trí của đa kênh trong 5 mô hình I/O

UNP quy các I/O của Unix về năm mô hình, nắm rõ đa kênh đứng ở ô nào còn rõ hơn là chỉ nhìn mỗi nó:

- **I/O Blocking (chặn)**: Sau khi gọi `recv`, thread ngủ suốt, chờ dữ liệu sẵn sàng rồi thêm cả bước sao chép, kẹt toàn bộ hai giai đoạn. Đơn giản nhất, cũng lãng phí thread nhất.
- **I/O Non-blocking (không chặn)**: `recv` không có dữ liệu thì lập tức trả `EWOULDBLOCK`, thread không ngủ, nhưng bạn phải liên tục hỏi thăm "xong chưa", quay vòng lãng phí CPU.
- **I/O Đa kênh (multiplexing)**: Chặn trên `select`/`poll`/`epoll`, một thread đồng thời chờ nhiều fd, ai sẵn sàng xử lý người đó. Đây là nhân vật chính của bài viết này.
- **I/O điều khiển bằng tín hiệu (signal-driven)**: Đăng ký `SIGIO`, khi dữ liệu sẵn sàng kernel phát tín hiệu thông báo cho bạn, còn lại thread cứ làm việc bình thường. Hiếm khi được dùng.
- **I/O bất đồng bộ (asynchronous)**: Sau khi gửi yêu cầu trả về ngay, khi I/O hoàn tất mới thông báo cho ứng dụng. Ở đây mô tả mô hình ngữ nghĩa, cách triển khai cụ thể tùy thuộc nền tảng và API; ví dụ `aio_read` POSIX trong glibc Linux chủ yếu được triển khai bởi thread công việc ở trạng thái người dùng, không thể đồng nhất trực tiếp với I/O bất đồng bộ gốc của kernel.

![So sánh năm mô hình I/O: I/O blocking, I/O non-blocking, I/O đa kênh, I/O điều khiển bằng tín hiệu và I/O bất đồng bộ](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/io-multiplexing-five-io-models.png)

Khác biệt then chốt nằm ở việc ai hoàn thành thao tác "chuyển dữ liệu từ bộ đệm kernel sang bộ đệm ứng dụng": trong bốn mô hình đầu, cuối cùng ứng dụng phải tự gọi `read`/`recv` để hoàn tất lần sao chép này, sau khi lời gọi trả về mới dùng được dữ liệu, nên đều tính là **đồng bộ** (còn lần gọi này có thực sự ngủ hay không phụ thuộc vào việc fd có non-blocking và lúc đó dữ liệu đã có chưa); chỉ có I/O bất đồng bộ là giao cả việc chờ đợi lẫn sao chép cho kernel, hoàn tất rồi mới thông báo bạn. Giá trị của đa kênh không nằm ở việc làm cho một lần đọc nhanh hơn, mà nằm ở việc để một thread san sẻ việc "chờ" lên nhiều kết nối cùng một lúc.

## select làm được gì?

`select` là triển khai sớm nhất, hầu như mọi nền tảng đều hỗ trợ. Chữ ký hàm của nó như thế này:

```c
#include <sys/select.h>

int select(int nfds, fd_set *readfds, fd_set *writefds,
           fd_set *exceptfds, struct timeval *timeout);
```

Cốt lõi là cấu trúc dữ liệu `fd_set`, thực chất là một **bitmap**: mỗi một bit tương ứng với một fd, bật 1 nghĩa là quan tâm đến nó. Kèm theo có bốn macro để thao tác:

```c
void FD_ZERO(fd_set *set);          // xóa hết mọi bit
void FD_SET(int fd, fd_set *set);   // bật bit tương ứng với fd lên 1
void FD_CLR(int fd, fd_set *set);   // xóa bit tương ứng với fd về 0
int  FD_ISSET(int fd, fd_set *set); // kiểm tra bit tương ứng với fd có phải là 1 không
```

Một echo server viết bằng `select`, vòng lặp chính đại khái như thế này:

```c
fd_set rset;
int maxfd = listenfd;

while (1) {
    FD_ZERO(&rset);                       // mỗi vòng đều phải xóa trắng lại
    FD_SET(listenfd, &rset);              // rồi lại nhét từng fd quan tâm vào
    for (int i = 0; i < n; i++)
        if (conns[i] >= 0) FD_SET(conns[i], &rset);

    // tập hợp ghi, tập hợp ngoại lệ không quan tâm, truyền NULL; NULL cuối cùng nghĩa là chặn vĩnh viễn
    int ready = select(maxfd + 1, &rset, NULL, NULL, NULL);

    if (FD_ISSET(listenfd, &rset)) {      // listen fd sẵn sàng, có kết nối mới
        int connfd = accept(listenfd, NULL, NULL);
        // lưu vào conns[], cập nhật maxfd
    }
    for (int i = 0; i < n; i++)           // O(N) hỏi lần lượt: bạn sẵn sàng chưa?
        if (conns[i] >= 0 && FD_ISSET(conns[i], &rset)) {
            // xử lý sự kiện đọc trên kết nối này
        }
}
```

Trong đoạn code này ẩn chứa vài nhược điểm cứng của `select`, nhìn rõ chúng, mới hiểu sau này poll và epoll đang sửa cái gì.

**Thứ nhất, số lượng fd có giới hạn trên**. Trong môi trường Linux/glibc, kích thước bitmap của `fd_set` do hằng số `FD_SETSIZE` của glibc quyết định, mặc định là 1024, chỉ an toàn biểu diễn các fd từ 0~1023 — giới hạn này đến từ cấu trúc dữ liệu có kích thước cố định ở trạng thái người dùng của glibc và các macro `FD_*`, chứ không phải từ chính Linux kernel. Dùng những macro này với fd ngoài phạm vi là hành vi chưa xác định (undefined behavior), cũng đừng mong đợi dựa vào việc định nghĩa lại `FD_SETSIZE` hoặc biên dịch lại kernel để né. Thật muốn giám sát nhiều kết nối hơn, cách đúng đắn là đổi sang poll、epoll.

**Thứ hai, mỗi lần gọi đều phải sao chép bitmap qua lại giữa trạng thái người dùng và trạng thái kernel**. Trước khi gọi, bạn điền bitmap ở trạng thái người dùng, `select` sao chép nó vào kernel; khi trả về kernel ghi đè bitmap (xóa sạch các bit chưa sẵn sàng), rồi sao chép ngược về trạng thái người dùng. Phạm vi kernel thực sự kiểm tra và ghi lại do `nfds` quyết định, nên số hiệu fd càng lớn, giám sát càng nhiều, thì lần đi lần về này càng tốn.

**Thứ ba, bitmap là tham số "truyền vào đồng thời truyền ra" (value-result)**. Khi kernel trả về nó đã xóa về 0 các bit chưa sẵn sàng, nên vòng sau bạn phải `FD_ZERO` + điền lại `FD_SET` một lượt, danh sách quan tâm cũ không dùng lại được. Câu "mỗi vòng đều phải xóa trắng lại" trong code chính là bị điều này ép ra.

**Thứ tư, sau khi trả về vẫn phải tự O(N) duyệt**. Giá trị trả về của `select` chỉ đưa ra số lượng fd sẵn sàng, cụ thể những fd nào sẵn sàng thể hiện ở `fd_set` đã bị ghi đè ngay tại chỗ. Ứng dụng vẫn phải duyệt qua phạm vi ứng viên và gọi `FD_ISSET`; một vạn kết nối dù chỉ có một cái có dữ liệu, cũng có thể phải kiểm tra một vạn lần.

Tham số `timeout` này ngược lại có chút ích lợi: truyền NULL thì chặn vĩnh viễn, truyền một `timeval` giá trị 0 nghĩa là không chờ trả về ngay (polling), truyền một giá trị cụ thể nghĩa là tối đa chờ bao lâu.

## poll cải thiện điều gì?

`poll` và `select` là sản phẩm cùng thời đại, tư tưởng giống nhau, nhưng đổi cấu trúc dữ liệu. Nó không dùng bitmap, mà đổi sang dùng một mảng struct `pollfd`:

```c
#include <poll.h>

struct pollfd {
    int   fd;       // file descriptor cần giám sát
    short events;   // sự kiện bạn quan tâm, điền trước khi gọi, ví dụ POLLIN (có thể đọc)
    short revents;  // sự kiện thực sự xảy ra, do kernel điền trả về
};

int poll(struct pollfd *fds, nfds_t nfds, int timeout);
```

Vòng lặp chính như thế này:

```c
struct pollfd fds[MAX];
fds[0].fd = listenfd;
fds[0].events = POLLIN;
// các fds[i].fd = connfd còn lại; fds[i].events = POLLIN;

while (1) {
    int ready = poll(fds, nfds, -1);      // timeout truyền -1 nghĩa là chặn vĩnh viễn
    for (int i = 0; i < nfds; i++) {
        if (fds[i].revents & POLLIN) {    // kernel ghi kết quả trong revents
            // xử lý sự kiện đọc
        }
    }
}
```

So với `select`, `poll` đã sửa đúng hai việc:

**Không còn giới hạn cứng 1024**. Giám sát bao nhiêu fd tùy thuộc vào mảng bạn truyền vào lớn cỡ nào, không còn bị `FD_SETSIZE` kẹt chết, giới hạn trên chủ yếu xem số fd mà tiến trình có thể mở là bao nhiêu.

**Sự kiện quan tâm và sự kiện xảy ra được tách riêng**. `events` là do bạn điền (đầu vào), `revents` do kernel điền trả (đầu ra), hai trường mỗi cái lo việc của mình. Như vậy vòng sau không cần như `select` phải reset toàn bộ danh sách quan tâm, cứ giữ nguyên `events` là được.

Nhưng `poll` không giải quyết hai vấn đề hiệu năng đáng sợ nhất của `select`: mỗi lần gọi vẫn phải sao chép cả mảng từ trạng thái người dùng vào kernel, và sau khi trả về vẫn phải O(N) duyệt cả mảng mới tìm ra những fd nào sẵn sàng. Khi quy mô kết nối tăng lên, chi phí vẫn tăng tuyến tính y như cũ.

Nói thẳng ra, `poll` chỉ là lau sạch phần giao diện của `select`, mô hình hiệu năng không đổi. Sự thay đổi chất thực sự nằm ở epoll.

## Vì sao epoll là thay đổi chất?

`epoll` là độc quyền của Linux, do Davide Libenzi triển khai, được giới thiệu vào kernel **2.5.44**, glibc 2.3.2 bắt đầu cung cấp wrapper. Nó tách việc "một lời gọi hệ thống làm tất cả" thành ba lời gọi, mỗi cái lo việc riêng:

```c
#include <sys/epoll.h>

int epoll_create1(int flags);  // tạo một instance epoll, trả về một fd (giao diện cũ là epoll_create(int size))
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);  // thêm bớt sửa fd cần giám sát
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);  // chờ sự kiện sẵn sàng
```

Trong đó `op` của `epoll_ctl` có ba loại: `EPOLL_CTL_ADD` (đăng ký), `EPOLL_CTL_MOD` (sửa đổi), `EPOLL_CTL_DEL` (xóa). Sự kiện được mô tả bằng `epoll_event`:

```c
typedef union epoll_data {
    void     *ptr;
    int       fd;
    uint32_t  u32;
    uint64_t  u64;
} epoll_data_t;

struct epoll_event {
    uint32_t     events;   // loại sự kiện, ví dụ EPOLLIN、EPOLLOUT、EPOLLET
    epoll_data_t data;     // dữ liệu người dùng, khi epoll_wait trả về mang theo nguyên xi, thường lưu fd
};
```

Dùng đầy đủ thì như thế này:

```c
int epfd = epoll_create1(0);              // bước 1: tạo instance

struct epoll_event ev;
ev.events = EPOLLIN;                       // quan tâm khả năng đọc, mặc định kích hoạt mức (level-triggered)
ev.data.fd = listenfd;
epoll_ctl(epfd, EPOLL_CTL_ADD, listenfd, &ev);  // bước 2: đăng ký một lần là đủ

struct epoll_event events[MAX_EVENTS];
while (1) {
    // bước 3: chỉ trả về các fd thực sự sẵn sàng, n chính là số lượng sẵn sàng
    int n = epoll_wait(epfd, events, MAX_EVENTS, -1);
    for (int i = 0; i < n; i++) {          // chỉ duyệt các fd sẵn sàng, không quét toàn bộ tập hợp
        int fd = events[i].data.fd;
        if (fd == listenfd) {
            int connfd = accept(listenfd, NULL, NULL);
            ev.events = EPOLLIN;
            ev.data.fd = connfd;
            epoll_ctl(epfd, EPOLL_CTL_ADD, connfd, &ev);  // đăng ký kết nối mới vào
        } else {
            // xử lý sự kiện đọc trên fd
        }
    }
}
```

So với đoạn code của `select`, sự khác biệt nhìn ra ngay: việc đăng ký fd và chờ sự kiện bị tách ra, mảng `events` mà `epoll_wait` trả về **toàn là các fd sẵn sàng**, duyệt nó là xong, không cần cầm tất cả fd để hỏi lần lượt nữa.

Khác biệt này không phải là thủ thuật nhỏ trong thiết kế giao diện, mà là đã đổi cấu trúc dữ liệu nền tảng. Một instance epoll ở trong kernel tương ứng với một struct `eventpoll`, bên trong có hai thứ quan trọng:

- **Một cây đỏ-đen (rbr)**: lưu toàn bộ các fd được đăng ký qua `epoll_ctl` (mỗi fd tương ứng một nút `epitem`). Thêm bớt sửa là thao tác cây O(log N). fd chỉ được ghi danh một lần ở đây, sau đó cứ ở đó, khác hẳn select/poll mỗi lần gọi phải khiêng toàn bộ danh sách vào kernel.
- **Một danh sách liên kết các fd sẵn sàng (rdllist)**: một danh sách liên kết đôi, chuyên lưu các fd "đã sẵn sàng".

![Kiến trúc nội bộ epoll: epoll_ctl duy trì interest list, khi fd sẵn sàng vào ready list qua callback, epoll_wait trả về các sự kiện sẵn sàng](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/io-multiplexing-epoll-architecture.png)

Điểm mấu chốt nằm ở cơ chế callback. Khi `epoll_ctl` đăng ký fd, kernel gắn cho fd này một hàm callback. Khi có dữ liệu từ card mạng đến, một fd nào đó có khả năng đọc, callback này bị kích hoạt, nhét đối tượng sẵn sàng tương ứng vào danh sách sẵn sàng, đồng thời đánh thức thread đang chặn trên `epoll_wait`. Vậy nên `epoll_wait` chỉ cần nhìn xem danh sách sẵn sàng có rỗng không — có thì sao chép các sự kiện trong đó cho trạng thái người dùng, không thì đi ngủ chờ callback đánh thức. (Bổ sung một câu: cây đỏ-đen, danh sách sẵn sàng đều là cách triển khai hiện tại của kernel, `epoll` cam kết với trạng thái người dùng chỉ là tầng ngữ nghĩa trừu tượng "tập hợp đăng ký + danh sách sẵn sàng", đừng coi cấu trúc cây là ABI ổn định.)

Đây chính là gốc rễ giúp epoll hiệu quả: trong hoàn cảnh hàng vạn kết nối, chỉ một số ít hoạt động, sau khi `epoll_wait` trả về thì những gì phải duyệt chỉ là các sự kiện sẵn sàng trong đợt này, không liên quan gì đến "tổng lượng fd đã đăng ký". Đăng ký mười vạn fd, nhưng chỉ có ba cái có dữ liệu, thì `epoll_wait` chỉ xử lý ba cái đó, không phải như select/poll mỗi lần quét toàn bộ tập hợp. Nhưng phải nhấn mạnh: chi phí tổng thể của epoll không chỉ là phút giây `epoll_wait` trả về — thay đổi đăng ký (`epoll_ctl`)、callback sự kiện、cạnh tranh khóa (lock contention) trong song song、sao chép sự kiện sẵn sàng về trạng thái người dùng đều tốn chi phí; khi tỉ lệ kết nối hoạt động xấp xỉ 100%, lợi thế của nó so với select/poll cũng sẽ bị thu hẹp. Tóm gọn một câu: select và poll mỗi lần chờ đều phải giao toàn bộ tập hợp giám sát cho kernel và quét tuyến tính; epoll lưu giữ tập hợp giám sát trong kernel trong thời gian dài, khi chờ chỉ lấy những sự kiện đã sẵn sàng, nên phù hợp hơn với hoàn cảnh nhiều fd、ít kết nối hoạt động.

Việc sao chép dữ liệu cũng tiết kiệm được. fd được ghi danh một lần trên cây đỏ-đen qua `epoll_ctl`, sau đó `epoll_wait` gọi lặp đi lặp lại cũng không cần truyền lại toàn bộ danh sách fd nữa.

Ở đây phải đính chính một lời đồn thổi lan truyền rộng rãi: "Sở dĩ epoll nhanh, là vì nó dùng mmap chia sẻ bộ nhớ giữa kernel và trạng thái người dùng, tiết kiệm việc sao chép." Lời nói này là sai. Lật xem triển khai kernel của epoll sẽ thấy, khi `epoll_wait` trả về là thật sự dùng `__put_user` để sao chép các sự kiện sẵn sàng vào mảng `events` ở trạng thái người dùng, chẳng có vùng chia sẻ mmap nào. Cái epoll tiết kiệm là một chuyện khác: đó là tiết kiệm kiểu "cứ mỗi lần gọi đều khiêng toàn bộ danh sách fd vào kernel" như select/poll, chứ không phải tiết kiệm lần sao chép các sự kiện sẵn sàng khi trả về. Hai chuyện này đừng lẫn lộn với nhau.

## Level-triggered và edge-triggered, khác nhau ở đâu?

epoll hỗ trợ hai chế độ kích hoạt, đây là khả năng mà nó trội hơn select/poll một bộ, cũng là chỗ dễ dính bẫy nhất trong phỏng vấn và thực chiến.

**Kích hoạt mức (LT, Level Triggered)** là chế độ mặc định. Chỉ cần trên fd còn dữ liệu chưa đọc xong (hoặc còn chỗ để ghi), thì mỗi lần `epoll_wait` đều thông báo bạn. select và poll chỉ có mỗi chế độ này.

**Kích hoạt cạnh (ET, Edge Triggered)** phải thêm tường minh cờ `EPOLLET`. Nó chỉ thông báo một lần đúng thời điểm trạng thái **thay đổi**.

Dùng một hoàn cảnh cụ thể để nói rõ sự khác biệt (đây cũng là ví dụ kinh điển trong man page của Linux): giả sử đầu bên kia (peer) ghi 2 KB dữ liệu vào một socket.

- Chế độ LT: `epoll_wait` thông báo bạn có thể đọc. Bạn mới đọc 1 KB, trong bộ đệm vẫn còn 1 KB. Lần `epoll_wait` sau sẽ tiếp tục thông báo bạn "chỗ này còn dữ liệu chưa đọc xong", cho đến khi bạn đọc sạch 2 KB.
- Chế độ ET: `epoll_wait` thông báo bạn một lần. Bạn mới đọc 1 KB rồi đi, vậy 1 KB còn lại — trừ khi đầu bên kia ghi thêm dữ liệu mới, trạng thái lại thay đổi, còn không `epoll_wait` sẽ không chủ động thông báo bạn vì nó nữa. 1 KB này có thể nằm lâu dài trong bộ đệm, kết nối bị trì hoãn mãi không được xử lý.

![So sánh level-triggered và edge-triggered: LT thông báo liên tục khi dữ liệu chưa đọc xong, ET chỉ thông báo một lần khi trạng thái thay đổi](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/io-multiplexing-lt-vs-et.png)

Vậy nên dùng ET phải tuân thủ hai luật sắt: **đặt fd thành non-blocking**, và **lặp `read` cho đến khi trả về `EAGAIN` (hoặc `EWOULDBLOCK`)**, đảm bảo một lần đọc sạch dữ liệu. Cách đọc ET điển hình như thế này:

```c
// Tiền đề: connfd đã được đặt thành non-blocking, và khi đăng ký đã mang theo EPOLLET
while (1) {
    ssize_t n = read(connfd, buf, sizeof(buf));
    if (n > 0) {
        // xử lý lượt dữ liệu này, rồi tiếp tục vòng lặp hút cạn bộ đệm
    } else if (n == 0) {
        close(connfd);                 // đầu bên kia đóng kết nối
        break;
    } else {  // n < 0
        if (errno == EAGAIN || errno == EWOULDBLOCK)
            break;                      // đã đọc xong dữ liệu, đây mới là điểm thoát bình thường
        if (errno == EINTR)
            continue;                   // bị tín hiệu ngắt, thử lại
        close(connfd);                  // thực sự có lỗi
        break;
    }
}
```

Nếu fd là blocking, lần `read` cuối cùng không có dữ liệu sẽ kẹt chết cả thread ở đây — đây cũng là lý do vì sao ET và fd non-blocking bắt buộc phải đi thành cặp.

Lợi ích của ET là giảm số lần đánh thức `epoll_wait`, phù hợp với những hoàn cảnh theo đuổi throughput tối đa, lại có thể viết logic đọc ghi chặt chẽ; cái giá là ngưỡng lập trình cao hơn hẳn, bỏ lọt `EAGAIN` dẫn đến kết nối trì trệ kéo dài là bug phổ biến nhất của loại code này. Ngược lại, nếu vì "đọc cho sạch" mà cứ đọc mãi trên một fd hoạt động, lại có thể bỏ đói các kết nối khác, nên trong kỹ thuật người ta thường đặt hạn mức xử lý mỗi vòng cho từng fd, phối hợp với hàng đợi sẵn sàng ở tầng ứng dụng luân phiên. LT lập trình đơn giản, khó sai, phần lớn nghiệp vụ dùng LT là đủ. Những dịch vụ nhạy cảm hiệu năng như Nginx mới dùng ET.

Khi viết event loop tầm production, chỉ biết đọc thôi là chưa đủ, còn một vòng các góc khuất phải xử lý: `epoll_wait` bị tín hiệu ngắt trả về `EINTR` phải thử lại; trong ET `accept` cũng phải lặp đến `EAGAIN`; `EPOLLERR`/`EPOLLHUP`/`EPOLLRDHUP` phải kiểm tra cùng với các sự kiện đọc ghi; `read` trả về 0 nghĩa là đầu bên kia đã đóng hướng ghi; `write` có thể ghi thiếu (short write), phải tự cache phần dữ liệu chưa gửi hết và đăng ký `EPOLLOUT` khi cần; khi nhiều thread xử lý cùng một fd, cân nhắc dùng `EPOLLONESHOT` kết hợp rearm.

## So sánh ngang ba loại

Tổng hợp những thứ đã tách ra trình bày phía trên thành một bảng, tiện so sánh ngang:

| Khía cạnh                  | select                                                                                             | poll                                                                                      | epoll                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Nền tảng                   | Tương thích chéo tốt; có ở cả Unix、Windows (Windows chủ yếu dùng cho socket)                      | Chủ yếu dùng cho hệ thống Unix-like                                                       | Độc quyền Linux (Linux 2.6+)                                                                                            |
| Quản lý phía kernel        | Mỗi lần gọi tạm thời kiểm tra tập hợp fd                                                           | Mỗi lần gọi tạm thời kiểm tra mảng fd                                                     | Duy trì lâu dài interest list và ready list; triển khai hiện tại của Linux thường dùng cây đỏ-đen và danh sách sẵn sàng |
| Giới hạn số lượng fd       | Bị giới hạn bởi `FD_SETSIZE`; trong Linux glibc thường là 1024, chỉ an toàn xử lý các fd số 0~1023 | Không bị giới hạn bởi `FD_SETSIZE`, nhưng vẫn bị giới hạn bởi `RLIMIT_NOFILE` và bộ nhớ   | Không bị giới hạn bởi `FD_SETSIZE`, nhưng bị giới hạn bởi số lượng file descriptor, bộ nhớ và `max_user_watches`        |
| Tham số truyền mỗi lần chờ | Mỗi vòng truyền nguyên bitmap, sau khi trả về tập hợp bị sửa đổi, vòng sau phải dựng lại           | Mỗi vòng truyền nguyên mảng `pollfd`, kernel điền `revents` (không cần dựng lại `events`) | Tập hợp giám sát được duy trì qua `epoll_ctl`, `epoll_wait` chỉ nhận các sự kiện sẵn sàng                               |
| Chi phí tìm fd sẵn sàng    | Quét đến `nfds - 1`, thường ghi là O(N)                                                            | Duyệt toàn mảng, O(N)                                                                     | Giai đoạn chờ không quét toàn bộ tập hợp giám sát, chi phí trả về chủ yếu liên quan đến số lượng sự kiện sẵn sàng       |
| Chế độ kích hoạt           | Chỉ LT                                                                                             | Chỉ LT                                                                                    | Mặc định LT, cũng hỗ trợ ET (`EPOLLET`)                                                                                 |

![So sánh select、poll và epoll: cấu trúc dữ liệu, giới hạn fd, tham số truyền mỗi lần chờ, chi phí tìm fd sẵn sàng và chế độ kích hoạt](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/io-multiplexing-select-poll-epoll.png)

## epoll không phải viên đạn bạc

Nói đến đây dễ rút ra kết luận "epoll đè bẹp toàn diện", nhưng thực chiến không tuyệt đối vậy, có vài ranh giới đáng nhớ.

**Khi kết nối ít mà đều hoạt động, epoll chưa chắc nhanh hơn**. Thân cơ chế duy trì cây đỏ-đen、gắn callback、đi vòng danh sách sẵn sàng của epoll vốn có chi phí cố định. Nếu bạn chỉ trông vài chục fd, và chúng gần như lần nào cũng có dữ liệu, thì kiểu "cầm cả tập hợp duyệt một phát" của select/poll ngược lại trực tiếp hơn, tiết kiệm hơn. Sân chơi chính của epoll là **hàng vạn kết nối + phần lớn rảnh rỗi**: mấy vạn kết nối dài nằm đó, cùng một thời điểm chỉ có số ít hoạt động, lúc này chỉ trông mấy cái sẵn sàng mới thật sự đáng đồng tiền bát gạo.

**Nó là độc quyền của Linux**. Trên macOS và BSD tương ứng là `kqueue`, trên Windows là IOCP. Muốn viết chương trình mạng đa nền tảng, thường không gọi thẳng epoll, mà dùng các thư viện bọc như libevent、libuv, để chúng trên Linux chạy epoll, trên hệ khác chạy theo triển khai tương ứng.

**Vấn đề thất tỉnh - đám đông (thundering herd)**. Khi nhiều tiến trình/thread cùng chờ sự kiện trên cùng một listen fd, một kết nối đến có thể đánh thức tất cả chúng, nhưng chỉ một cái `accept` thành công, số còn lại phí công một phen. Từ Linux 4.5 có thể dùng cờ `EPOLLEXCLUSIVE` để giảm thiểu, để kernel chỉ đánh thức một, hoặc một số ít trong nhiều exclusive waiter; nó không phải là bảo đảm "nghiêm ngặt chỉ đánh thức một" trong mọi hình thái triển khai (ví dụ nhiều instance epoll, trộn lẫn đăng ký non-exclusive).

**Cái bẫy của chế độ ET đã nói phía trước**: hễ bỏ lọt chưa đến `EAGAIN`, số dữ liệu còn lại có thể sẽ lâu dài không còn kích hoạt thông báo, kết nối bị trì hoãn mãi không được xử lý. Đây không phải vấn đề hiệu năng, mà là vấn đề đúng sai, debug lại rất khó phát hiện. Không chắc chắn thì ngoan ngoãn dùng LT.

## Chúng được dùng ở đâu

Cơ chế này không phải khái niệm dừng trên sách vở, các thành phần hiệu năng cao phổ biến đều dựa vào nó ở tầng đáy.

**Redis** là hình mẫu điển hình của event loop đơn thread + I/O đa kênh. Nó không mở thread cho từng client, mà dùng một thread qua đa kênh đồng thời giám sát hàng loạt socket, ai sẵn sàng thì gọi event handler tương ứng. Redis tự đóng một tầng (file `ae.c`), trên các nền tảng khác nhau lần lượt chọn epoll、kqueue hoặc select. Đây cũng là một trong những mấu chốt giúp nó chỉ đơn thread mà vẫn chịu được concurrency cao, bỏ được việc chuyển ngữ cảnh và cạnh tranh khóa giữa các thread.

![File event handler](https://oss.javaguide.cn/github/javaguide/database/redis/redis-event-handler.png)

Bổ sung một điểm thường bị hiểu nhầm: Redis 6.0 giới thiệu đa thread, nhưng phần thêm vào chỉ là việc đọc ghi network I/O và phân tích giao thức, còn việc thực thi lệnh thực sự vẫn đơn thread. Cái lõi event loop của đa kênh không đổi, đa thread chỉ là san các công việc tốn thời gian như "đọc socket、phân tích yêu cầu" lên vài thread, tránh để nó thành điểm nghẽn của đơn thread.

Giới thiệu chi tiết bạn có thể xem bài này: [Redis常见面试题总结(上)](https://javaguide.cn/database/redis/redis-questions-01.html).

**Nginx** là đa tiến trình + epoll, lại dùng chế độ ET, phối với socket non-blocking nén việc xử lý mỗi lần bị đánh thức xuống mức tối thiểu, đây là nền tảng giúp nó dùng rất ít tiến trình mà vẫn chịu được hàng vạn kết nối.

**Java NIO** có `Selector` chính là bọc Java của đa kênh. Trên Linux, `Selector` tầng đáy chạy chính là epoll (tương ứng `EPollSelectorImpl`); đổi sang hệ khác sẽ đổi sang triển khai tương ứng, tầng chuyển đổi này trong suốt với code phía trên.

![Sơ đồ hoạt động của Selector](https://oss.javaguide.cn/github/javaguide/java/nio/selector-channel-selectionkey.png)

Ngoài NIO chuẩn, Netty còn cung cấp thêm một bộ transport epoll gốc (`EpollEventLoop`), nối thẳng epoll、né tầng bọc của JDK, trên Linux có thể ép ra hiệu năng cao hơn. Ở đây cần để ý khác biệt phiên bản: transport epoll gốc của Netty 4.0 từng chủ đánh mạnh edge-triggered; đến Netty 4.2, `EpollMode` đã bị đánh dấu deprecated, và ghi chú rõ transport luôn dùng level-triggered. Hành vi của các bản nhỏ trong khoảng 4.1 cứ lấy source và API của phiên bản đang dùng làm chuẩn.

Ngoài ra, về phần giới thiệu chi tiết có mục tiêu cho mô hình I/O của Java, bạn có thể đọc bài này: [Java I/O 模型详解](https://javaguide.cn/java/io/io-model.html).

## Trả lời thế nào trong phỏng vấn?

Hỏi "I/O đa kênh giải quyết vấn đề gì", đừng trả lời thành "làm cho một lần read nhanh hơn". Nó giải quyết vấn đề "chờ": một thread không cần chặn trên một kết nối đơn lẻ, mà giao một lô fd cho `select`、`poll` hoặc `epoll`, fd nào sẵn sàng thì xử lý fd đó. Câu `read/recv` thực sự sao chép dữ liệu từ bộ đệm kernel sang bộ đệm ứng dụng vẫn do ứng dụng tự gọi, nên nó thuộc mô hình I/O đồng bộ.

Khác biệt giữa `select`、`poll`、`epoll` có thể khai triển từ ba điểm. Thứ nhất, cấu trúc dữ liệu khác nhau: `select` dùng bitmap `fd_set` kích thước cố định, trong Linux glibc thường bị giới hạn 1024; `poll` đổi thành mảng `pollfd`, né được `FD_SETSIZE`, nhưng mảng vẫn truyền vào kernel mỗi lần; `epoll` đặt tập hợp giám sát lâu dài trong kernel, thêm bớt sửa qua `epoll_ctl`, `epoll_wait` chỉ lấy các sự kiện sẵn sàng.

Thứ hai, mô hình hiệu năng khác nhau. `select` và `poll` mỗi lần chờ đều phải truyền nguyên tập hợp, sau khi trả về còn phải quét tuyến tính, kết nối nhiều mà hoạt động ít thì rất thiệt; `epoll` phù hợp nhiều fd、ít kết nối hoạt động, vì giai đoạn chờ không cần quét toàn bộ tập hợp giám sát, chi phí trả về chủ yếu liên quan đến số lượng sự kiện sẵn sàng trong vòng này. Tuy nhiên không phải hoàn cảnh nào nó cũng nhanh hơn, khi rất ít kết nối mà đều hoạt động, chi phí cố định duy trì callback、cây đỏ-đen và danh sách sẵn sàng cũng phải tính vào.

Thứ ba, LT/ET của `epoll` thường hay bị truy hỏi. LT là chế độ mặc định, chỉ cần trong bộ đệm còn dữ liệu chưa đọc xong, lần sau vẫn thông báo; ET chỉ thông báo một lần khi trạng thái thay đổi, nên bắt buộc phải đi kèm fd non-blocking, và lặp đọc đến `EAGAIN`. Trong phỏng vấn nói rõ được câu này, rồi bổ sung `EINTR`, ghi thiếu (short write), `EPOLLHUP/EPOLLERR` những góc khuất mà code production phải xử lý, thì về cơ bản đã không còn là chỉ học vẹt khái niệm.

## Tham khảo

- [W. Richard Stevens《UNIX Network Programming》Chương 6 (select/poll và năm mô hình I/O)](https://notes.shichao.io/unp/ch6/)
- [epoll(7) - Linux manual page](https://man7.org/linux/man-pages/man7/epoll.7.html)
- [epoll_create(2) / epoll_ctl(2) / epoll_wait(2) - Linux manual pages](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)
- [epoll final interface（LWN, ghi nhận epoll được giới thiệu ở 2.5.44）](https://lwn.net/Articles/16026/)
