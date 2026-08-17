---
title: "Chi tiết cơ chế khóa và đồng bộ hóa trong hệ điều hành: mutex、semaphore、condition variable、spinlock 与 futex"
description: "Tổng hợp câu hỏi phỏng vấn tần suất cao về cơ chế khóa và đồng bộ hóa của hệ điều hành，giải thích rõ critical section、mutex、spinlock、semaphore、condition variable、futex、lệnh nguyên tử、thứ tự bộ nhớ、priority inversion，cũng như sự khác biệt giữa khóa ở chế độ người dùng và khóa trong nhân Linux。"
category: Kiến thức nền tảng máy tính
tag:
  - Hệ điều hành
  - Linux
  - Lập trình đồng thời
head:
  - - meta
    - name: keywords
      content: khóa hệ điều hành,cơ chế đồng bộ hóa,critical section,khóa loại trừ lẫn nhau,mutex,spinlock,khóa tự xoay,spinlock,semaphore,tín hiệu,condition variable,biến điều kiện,futex,lệnh nguyên tử,memory barrier,priority inversion,đảo ngược ưu tiên,khóa nhân Linux,câu hỏi phỏng vấn hệ điều hành,lập trình đồng thời
---

Hai thread cùng lúc tăng cùng một bộ đếm lên 1, một việc tưởng chừng rất nhỏ, thế nhưng kết quả cuối cùng lại có thể bị tăng thiếu một lần.

Nguyên nhân thực ra rất đơn giản. `count++` trong mã nguồn chỉ là một dòng, nhưng khi máy thực thi thường phải trải qua các bước đọc, tính toán, ghi lại. Thread A vừa đọc được giá trị cũ, chưa kịp ghi lại; thread B cũng đọc được cùng một giá trị cũ đó. Hai phía mỗi bên tự tính ra giá trị mới, nhưng cuối cùng ghi lại lại là cùng một kết quả.

Để tránh loại vấn đề đồng thời này, hệ điều hành cung cấp khóa và một loạt cơ chế đồng bộ hóa. Vấn đề chúng giải quyết không chỉ là một đoạn mã có thể thực thi đồng thời hay không, mà còn bao gồm thread có nên bị block hay không, số lượng tài nguyên được kiểm soát như thế nào, khi điều kiện chưa thỏa mãn thì phải chờ như thế nào. Đến trong nhân, còn phải tiếp tục xem xét đến ngắt, preemption, đa CPU, tính thời gian thực và độ trễ lập lịch.

Bài viết này chỉ nói về cơ chế đồng bộ hóa từ góc nhìn của hệ điều hành. Các khái niệm `synchronized`, `ReentrantLock`, AQS, CAS và các tối ưu hóa khóa trong Java đã được trình bày chi tiết trong [chi tiết khóa Java](../../java/concurrent/java-lock.md), ở đây sẽ không lặp lại nội dung đó. Bài viết này tập trung xem mutex, semaphore, condition variable, spinlock, futex mỗi khái niệm lần lượt giải quyết vấn đề gì. Sau khi hiểu được các nguyên thủy đồng bộ hóa này, rồi xem tiếp [chi tiết deadlock](./dead-lock.md), sẽ dễ hiểu hơn vì sao "mối quan hệ chờ đợi lại vòng thành một vòng khép kín".

Trước hết hãy nhìn sơ bộ qua một bảng xem các cơ chế đồng bộ hóa này lần lượt giải quyết vấn đề gì:

| Cơ chế             | Giải quyết chính                                           | Cách chờ đợi                                          | Tình huống phổ biến                                                     |
| ------------------ | ---------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| mutex              | Loại trừ lẫn nhau vùng critical                            | Về mặt ngữ nghĩa chờ khóa khả dụng, có thể spin/block | Bảo vệ cấu trúc dùng chung                                              |
| spinlock           | Loại trừ lẫn nhau vùng critical cực ngắn                   | busy-wait                                             | Đường dẫn trong nhân không thể ngủ                                      |
| semaphore          | Đếm tài nguyên, kiểm soát số lượng đồng thời               | Chờ khi bộ đếm bằng 0                                 | Vị trí trong buffer, số lượng kết nối, số lượng tác vụ đồng thời        |
| condition variable | Chờ một trạng thái dùng chung nào đó trở thành true        | Giải phóng mutex một cách nguyên tử rồi chờ           | Hàng đợi không rỗng, tác vụ hoàn thành, buffer không đầy                |
| futex              | Nền tảng chặn/đánh thức cho khóa ở chế độ người dùng       | Fast path trong user space, slow path trong nhân      | pthread mutex, bộ đồng bộ hóa runtime                                   |
| memory barrier     | Ràng buộc thứ tự truy cập bộ nhớ và khả năng quan sát được | Thường không chịu trách nhiệm chặn                    | Cấu trúc lock-free, đồng bộ hóa trong nhân, truy cập thanh ghi thiết bị |

## Vùng critical rốt cuộc đang bảo vệ điều gì?

**Critical section (vùng critical)** chỉ đoạn mã truy cập trạng thái dùng chung có thể biến đổi, đồng thời không thể bị nhiều luồng thực thi xen kẽ tùy ý. Nó có thể là một đoạn cập nhật bộ đếm trong chương trình người dùng, cũng có thể là mã trong nhân sửa đổi hàng đợi lập lịch, bảng mô tả file, bảng trang, trạng thái thiết bị.

![Sơ đồ giao thức truy cập bảo vệ vùng critical: nhiều thread truy cập trạng thái dùng chung thông qua một điểm vào khóa thống nhất, vòng qua khóa hoặc đổi đối tượng khóa đều sẽ phá vỡ mối quan hệ loại trừ lẫn nhau](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-critical-section.png)

Khi đánh giá một loại khóa hoặc cơ chế đồng bộ hóa, có thể xem xét từ 4 khía cạnh: tính đúng đắn, tính tiến triển, tính công bằng và hiệu năng.

**Thứ nhất là tính đúng đắn.** Cùng một lúc không được để nhiều luồng thực thi xen kẽ tùy ý sửa đổi trạng thái dùng chung; trong tình huống đa CPU, còn cần có ngữ nghĩa đồng bộ hóa cần thiết, để trạng thái mà một thread ghi trước khi giải phóng khóa, được thread tiếp theo giữ cùng một khóa nhìn thấy đúng như dự kiến.

**Thứ hai là tính tiến triển.** Bản thân cơ chế đồng bộ hóa không được vây khốn tất cả các bên chờ đợi, khiến hệ thống không còn ai có thể tiến về phía trước.

**Thứ ba là tính công bằng.** Khi nhiều thread đều đang chờ cùng một khóa, cố gắng tránh việc một thread nào đó lâu dài không lấy được khóa. Hệ thống thực tế không nhất thiết FIFO nghiêm ngặt, nhưng vấn đề thiếu thốn (starvation) phải được xử lý nghiêm túc.

**Thứ tư là hiệu năng.** Khi không có tranh chấp, đường dẫn khóa và mở khóa phải đủ nhẹ; khi tranh chấp gay gắt, các thread chờ đợi không được lãng phí quá nhiều CPU vào các vòng lặp vô ích.

OSTEP khi nói về khóa cũng quan tâm đến những vấn đề này: liệu có thực sự làm được tính loại trừ hay không, thread chờ đợi có bị chết đói không, khi không có tranh chấp phải trả bao nhiêu chi phí, hiệu năng trên đơn CPU và đa CPU có gì khác biệt. Chỉ hỏi "loại khóa nào nhanh nhất" ý nghĩa không lớn, cùng một khóa đặt lên các máy khác nhau, các vùng critical có độ dài khác nhau, cường độ tranh chấp khác nhau, câu trả lời thường sẽ thay đổi.

## Mutex (khóa loại trừ lẫn nhau): đóng cửa trước, rồi mới sửa trạng thái dùng chung

Quay lại `count++` lúc trước. Nếu phép tự tăng này phải tính toán cho đúng, cách trực tiếp nhất là ở bên ngoài các thao tác đọc, cộng, ghi, thêm một cái **mutex (khóa loại trừ lẫn nhau)**. Ai lấy được khóa trước, người đó sửa trước; thread không lấy được khóa phải chờ ở ngoài cửa.

Viết bằng thread POSIX đại khái như sau:

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int count = 0;

void increase(void) {
    pthread_mutex_lock(&mutex);
    count++;
    pthread_mutex_unlock(&mutex);
}
```

Trong đoạn mã này, `pthread_mutex_lock()` không chỉ là làm một lần đánh dấu. Xét theo ngữ nghĩa POSIX, nếu khóa đã bị thread khác giữ, thread gọi sẽ chờ cho đến khi khóa trở nên khả dụng, sau khi trả về thành công mới sở hữu khóa này.

Việc triển khai cụ thể có thể linh hoạt hơn. Nhiều khóa trong pthread mutex hoặc ngôn ngữ runtime, có thể trước tiên spin một lúc ngắn ở chế độ người dùng; nếu tranh chấp vẫn chưa được giải quyết, sẽ chuyển sang đường dẫn chặn kiểu futex. Đối với người dùng, trọng điểm đặt vào ngữ nghĩa: trước khi lấy được khóa thì không được vào vùng critical, sau khi lấy được khóa mới có quyền truy cập trạng thái được bảo vệ.

mutex thích hợp để trấn giữ việc sửa đổi trạng thái dùng chung có ranh giới rõ ràng. Cập nhật reference count, sửa con trỏ trong linked list, duy trì bảng tiến trình, cập nhật một đoạn đệm bộ nhớ nhỏ, đều rất điển hình. Khi viết loại mã này, điều nên xác nhận trước tiên nhất là khóa này chịu trách nhiệm bảo vệ trạng thái nào, cũng như mọi điểm vào truy cập trạng thái đó có tuân thủ cùng một bộ quy tắc hay không.

Lấy một cái bẫy rất phổ biến: một đối tượng dùng chung có 5 đường truy cập, trong đó 4 đường đều giữ cùng một khóa, còn lại một đường vì "cho tiện" thì sửa trường trực tiếp. Như vậy, bốn đường trước viết kỹ càng đến mấy, mối quan hệ loại trừ cũng đã bị bỏ qua. Khóa bảo vệ giao thức truy cập, chỉ đặt biến bên cạnh khóa là vô dụng.

Còn một chi tiết nữa, mutex thường có ngữ nghĩa người sở hữu. Nói đơn giản, ai lấy khóa, người đó giải phóng. Tài liệu nhân Linux khi giới thiệu các loại khóa có đề cập riêng đến owner semantics, hầu hết các khóa yêu cầu context đã lấy khóa chịu trách nhiệm giải phóng. Semaphore không giống vậy, nó giống một bộ đếm hơn, khi nói đến nó ở phần sau thì sự khác biệt này sẽ rất rõ ràng.

## Spinlock (khóa tự xoay): đừng ngủ, chờ tại chỗ một lúc nhỏ

Khi mutex không lấy được, thread có thể ngủ, chờ nhân sau đó đánh thức nó lại. **Spinlock (khóa tự xoay)** ngược lại: đừng ngủ trước, tiếp tục lặp kiểm tra trên CPU xem khóa đã được giải phóng chưa.

Nghe có vẻ hơi ngốc, thực ra phải xem thời gian chờ đợi.

![So sánh cách chờ của mutex và spinlock: mutex ngủ chờ trong đường dẫn có thể block, spinlock busy-wait ngắn trong đường dẫn ngắn không thể ngủ](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-mutex-spinlock.png)

Nếu một khóa chỉ bảo vệ vài dòng mã, thread giữ khóa sẽ nhanh chóng rời khỏi vùng critical, thread chờ đợi ngủ xuống lại không đáng. Ngủ và đánh thức đều phải đi qua bộ lập lịch, trong lúc đó còn có thể xảy ra context switch; trên máy đa CPU, thread giữ khóa có thể đang thực thi trên một CPU khác, vài lệnh sau sẽ giải phóng khóa. Lúc này, thread chờ đợi xoay tại chỗ vài vòng, chi phí có thể thấp hơn.

Nhưng việc spin có hai giới hạn cứng.

**Thứ nhất, vùng critical phải ngắn.** Nếu thread giữ khóa phải truy cập đĩa, chờ mạng, cấp phát bộ nhớ có thể ngủ, bên chờ đợi sẽ thiêu đốt thời gian CPU vào việc quay máy không có kết quả.

**Thứ hai, phải cẩn thận với tình huống đơn CPU hoặc có thể preemption.** Nếu thread giữ khóa bị preemption, mà thread chờ đợi spin trên cùng một CPU, thì thread chờ đợi có spin cố gắng đến mấy cũng chờ không đến hành động giải phóng.

Trong nhân Linux không phải PREEMPT_RT, `spinlock_t` thông thường sau khi lấy sẽ ngầm vô hiệu hóa preemption; nếu còn muốn ngăn trình xử lý ngắt đánh vào vùng critical đang chạy trên chính CPU này, mới dùng các interface có hậu tố như `spin_lock_irq()`, `spin_lock_irqsave()`. Nói cách khác, `spin_lock()` thuần túy không đồng nghĩa với việc luôn luôn vô hiệu hóa hard interrupt.

Tài liệu nhân Linux chia các khóa thành sleeping locks, CPU local locks và spinning locks. `mutex`, `semaphore`, `rw_semaphore` thuộc loại khóa có thể ngủ; `raw_spinlock_t` trong cả nhân thường lẫn nhân PREEMPT_RT đều là spinlock nghiêm ngặt. Ngữ nghĩa của `spinlock_t` thay đổi theo PREEMPT_RT: dưới non-PREEMPT_RT, nó ánh xạ đến `raw_spinlock_t`; dưới PREEMPT_RT, nó được triển khai dựa trên `rt_mutex`, không còn ngầm vô hiệu hóa preemption, các hậu tố `_irq` / `_irqsave` cũng không còn trực tiếp thay đổi trạng thái vô hiệu hóa hard interrupt.

Mã nghiệp vụ ở chế độ người dùng thông thường không nên tự viết spinlock. Thư viện và runtime có thể thực hiện spin thích ứng trên các đường dẫn rất ngắn, nhưng trong mã ứng dụng tự viết vòng lặp `while` chờ khóa, phần lớn chỉ là làm cho CPU nóng lên.

## Semaphore (tín hiệu): không chỉ là khóa có 0 và 1

**Semaphore (tín hiệu)** có thể xem như một bộ đếm không bao giờ giảm xuống số âm. `sem_wait()` thử giảm bộ đếm đi 1; nếu giá trị hiện tại lớn hơn 0, giảm xong thì tiếp tục; nếu giá trị hiện tại là 0, thread gọi bị block. `sem_post()` tăng bộ đếm lên 1, và có thể đánh thức bên chờ đợi.

Khi giá trị ban đầu của bộ đếm đặt là 1, semaphore có thể dùng như mutex:

```c
sem_t sem;

sem_init(&sem, 0, 1);

sem_wait(&sem);
// critical section
sem_post(&sem);
```

Tuy nhiên, công dụng thật sự phổ biến của semaphore là "đếm tài nguyên". Ví dụ buffer có N vị trí trống, connection pool nhiều nhất cho phép N kết nối, một loại tác vụ nhiều nhất chạy đồng thời N tác vụ. Lúc này, giá trị ban đầu của semaphore chính là số lượng tài nguyên.

Binary semaphore có thể mô phỏng loại trừ lẫn nhau, nhưng nó không bằng mutex. mutex nhấn mạnh người sở hữu và quyền sở hữu vùng critical, semaphore nhấn mạnh bộ đếm và số lượng giấy phép. Một buffer có giới hạn thường sẽ tách hai loại vấn đề này ra: semaphore quản lý số lượng vị trí, mutex quản lý cấu trúc bên trong buffer.

![Sơ đồ semaphore quản lý số lượng tài nguyên của buffer có giới hạn: empty_slots ghi số vị trí trống, filled_slots ghi số lượng có thể tiêu thụ, buffer_mutex bảo vệ cấu trúc buffer](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-semaphore-buffer.png)

Mã dưới đây lược bỏ việc triển khai cụ thể của `item_t` và buffer, chỉ giữ lại khung đồng bộ hóa:

```c
#include <errno.h>
#include <pthread.h>
#include <semaphore.h>
#include <stdlib.h>

#define BUFFER_SIZE 1024

sem_t empty_slots;
sem_t filled_slots;
pthread_mutex_t buffer_mutex = PTHREAD_MUTEX_INITIALIZER;

void init_buffer(void) {
    if (sem_init(&empty_slots, 0, BUFFER_SIZE) == -1) {
        abort();
    }
    if (sem_init(&filled_slots, 0, 0) == -1) {
        abort();
    }
}

static void wait_sem(sem_t *sem) {
    while (sem_wait(sem) == -1) {
        if (errno == EINTR) {
            continue;
        }
        abort();
    }
}

void producer(void) {
    item_t item = produce_item();

    wait_sem(&empty_slots);
    pthread_mutex_lock(&buffer_mutex);
    put_item(item);
    pthread_mutex_unlock(&buffer_mutex);
    sem_post(&filled_slots);
}

void consumer(void) {
    wait_sem(&filled_slots);
    pthread_mutex_lock(&buffer_mutex);
    item_t item = take_item();
    pthread_mutex_unlock(&buffer_mutex);
    sem_post(&empty_slots);

    consume(item);
}
```

`empty_slots` ghi còn lại bao nhiêu vị trí trống, `filled_slots` ghi đã có bao nhiêu phần tử có thể tiêu thụ. Producer trước tiên tiêu tốn một vị trí trống, sau khi đưa dữ liệu vào thì tăng một phần tử có thể tiêu thụ; consumer thì ngược lại. `buffer_mutex` chỉ chịu trách nhiệm bảo vệ việc sửa đổi cấu trúc buffer của `put_item()` và `take_item()`.

Việc retry `EINTR` trong `wait_sem()` cũng không phải trang trí. Linux man-pages liệt kê rõ ràng `sem_wait()` có thể trả về `-1` do bị trình xử lý tín hiệu ngắt, đồng thời đặt `errno` thành `EINTR`. Nếu mã ví dụ hoàn toàn không xử lý nhánh này, người đọc copy về sau rất dễ để lại bug ngẫu nhiên.

Tài liệu locking của nhân Linux nêu rõ, semaphore có thể dùng để tuần tự hóa và chờ đợi; khi viết mã mới, nên tách các ngữ nghĩa như loại trừ lẫn nhau, hoàn thành sự kiện sang mutex, completion và các cơ chế khác. Một trong những lý do là semaphore không có owner rõ ràng, PREEMPT_RT không thể cung cấp cho nó tính kế thừa ưu tiên, block trên semaphore có thể xuất hiện priority inversion.

## Condition variable (biến điều kiện): chờ không phải khóa, mà là một điều kiện nào đó được thỏa mãn

mutex giải quyết "cùng một lúc ai được vào vùng critical". Nhưng trong nhiều trường hợp, thread vào vùng critical rồi mới phát hiện điều kiện vẫn chưa được thỏa mãn.

Ví dụ consumer sau khi lấy được khóa phát hiện hàng đợi rỗng. Nó không thể tiếp tục lấy dữ liệu, cũng không thể cứ cầm khóa mà ngủ. Nếu không, producer lấy không được khóa, không thể đưa dữ liệu vào hàng đợi, hệ thống sẽ bị đứng hình.

**Condition variable (biến điều kiện)** giải quyết chính loại vấn đề chờ điều kiện này. Nó thường được dùng kết hợp với mutex:

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;
queue_t queue;

void consumer(void) {
    pthread_mutex_lock(&mutex);

    while (queue_empty(&queue)) {
        pthread_cond_wait(&not_empty, &mutex);
    }

    item_t item = queue_pop(&queue);
    pthread_mutex_unlock(&mutex);

    consume(item);
}

void producer(item_t item) {
    pthread_mutex_lock(&mutex);
    queue_push(&queue, item);
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&mutex);
}
```

`pthread_cond_wait()` làm một việc rất quan trọng: nó giải phóng mutex một cách nguyên tử, và khiến thread hiện tại chờ trên condition variable; trước khi được đánh thức về, lại giành lại mutex. Hành động "giải phóng khóa và ngủ" này phải gắn liền với nhau, nếu không thì có thể xuất hiện hiện tượng mất tín hiệu: thread vừa chuẩn bị ngủ, producer đã gửi thông báo xong, consumer sau đó ngủ xuống, không còn ai đánh thức nó.

![Sơ đồ condition variable chờ điều kiện được thỏa mãn: thread kiểm tra trạng thái dùng chung trong vòng while, khi điều kiện chưa thỏa mãn thì giải phóng mutex và ngủ, sau khi được signal đánh thức sẽ kiểm tra lại điều kiện](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-condition-variable.png)

Condition variable có ba quy tắc sử dụng rất quan trọng.

**Thứ nhất, việc chờ điều kiện phải viết trong `while`, đừng viết thành `if`.** POSIX nêu rõ condition wait được phép xuất hiện spurious wakeup, tức là khi thread thức dậy điều kiện chưa chắc đã thỏa mãn. Ngay cả khi không có kiểu đánh thức này, nhiều consumer bị đánh thức đồng thời, khả năng cao chỉ có một thread giành được dữ liệu, các thread khác sẽ lại phát hiện hàng đợi rỗng.

**Thứ hai, bản thân condition variable không lưu trữ trạng thái, trạng thái thật sự phải đặt trong biến dùng chung được mutex bảo vệ.** `pthread_cond_signal()` không phải nhét vào hàng đợi một chiếc vé hiệu lực vĩnh viễn. Nếu khi signal xảy ra không có ai chờ, thông báo này có thể đã trôi qua. Điều thật sự quyết định consumer có thể tiếp tục thực thi hay không, chính là độ dài hàng đợi phía sau `queue_empty()`.

**Thứ ba, trong thời gian một condition variable có bên chờ, nó nên được dùng kết hợp với cùng một mutex.** POSIX gọi đây là dynamic binding: chỉ cần vẫn còn thread block trên một condition variable nào đó, nếu thread khác cầm một mutex khác để chờ cùng một condition variable, thì hành vi là không xác định. Quy tắc này thường không được nhắc đến trong thực tế, nhưng nó có thể giải thích vì sao mã condition variable thường đặt "biến trạng thái, mutex, condvar" trong cùng một cấu trúc dữ liệu để quản lý.

Nhiều bug condition variable đều nằm ở chỗ này: coi signal như trạng thái, hoặc thức dậy rồi không kiểm tra lại điều kiện.

## futex: thử trong user space trước, thất bại rồi mới tìm nhân

Trong Linux thường nghe nhắc đến futex (fast userspace mutex). Tên có chữ mutex, nhưng futex giống một nền móng để dựng khóa hơn.

Ý tưởng thiết kế của futex là: khi không có tranh chấp, hoàn toàn ở chế độ người dùng dùng lệnh nguyên tử sửa đổi một số nguyên 32-bit; chỉ khi cần ngủ hoặc đánh thức bên chờ, mới vào nhân gọi `futex()`. Như vậy có thể tránh được chi phí system call mỗi lần khóa.

Một quy trình tinh giản là:

1. Thread trước tiên ở chế độ người dùng dùng thao tác nguyên tử thử đổi khóa từ 0 thành 1.
2. Nếu thành công, nghĩa là không có ai tranh chấp, trực tiếp vào vùng critical.
3. Nếu thất bại, nghĩa là khóa đã bị chiếm, gọi `FUTEX_WAIT` để nhân treo thread.
4. Thread giữ khóa sau khi giải phóng khóa, nếu phát hiện có người chờ, gọi `FUTEX_WAKE` đánh thức một hoặc nhiều bên chờ.

![Sơ đồ futex fast path trong user space và slow path trong nhân: khi không có tranh chấp lấy khóa bằng thao tác nguyên tử trong user space, tranh chấp thất bại thì vào FUTEX_WAIT, khi giải phóng thì dùng FUTEX_WAKE đánh thức thread chờ](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-futex.png)

`FUTEX_WAIT` đi theo lối compare-and-block: nhân sẽ xác nhận trước futex word vẫn bằng giá trị kỳ vọng do nơi gọi truyền vào, chỉ khi khớp mới treo thread. Thao tác so sánh và block này là nguyên tử, vì vậy nó có thể nối thao tác nguyên tử trong user space với hàng đợi ngủ trong nhân.

Mô tả về futex trong man-pages cũng nhấn mạnh điểm này: thao tác futex xoay quanh một giá trị 32-bit trên địa chỉ vùng user space, các thao tác phổ biến bao gồm chờ và đánh thức. Ứng dụng thường không trực tiếp dùng futex làm khóa nghiệp vụ; các thư viện như pthread mutex, condition variable, bộ đồng bộ hóa runtime, sẽ dùng nó trong các nguyên thủy đồng bộ hóa cấp cao hơn.

Vì vậy, khi xem khóa chế độ người dùng Linux có thể ghi nhớ câu này: fast path cố gắng giữ trong user space, slow path mới vào nhân xếp hàng chờ ngủ.

## Lệnh nguyên tử: khóa bao giờ cũng cần một điểm khởi đầu không thể tách rời

Cho dù mutex, spinlock hay futex, cuối cùng đều phải rơi vào một loại thao tác nguyên tử nào đó do phần cứng hỗ trợ. Nếu không, giữa "kiểm tra khóa có rảnh không" và "đánh dấu khóa đã bị chiếm" vẫn có thể bị thread khác chen vào.

Các lệnh nguyên tử phổ biến bao gồm test-and-set, compare-and-swap, fetch-and-add. Chúng đảm bảo thao tác đọc-sửa-ghi đối với một vị trí bộ nhớ sẽ không bị CPU khác quan sát thành trạng thái nửa chừng.

Các giáo trình thời kỳ đầu còn nói về "tắt ngắt để triển khai khóa". Trong nhân đơn CPU, tắt ngắt có thể ngăn luồng thực thi hiện tại bị trình xử lý ngắt đánh vào, từ đó bảo vệ một số vùng critical trong nhân. Nhưng cách này có ranh giới rất mạnh: nó chỉ ảnh hưởng đến CPU hiện tại, không thể ngăn một CPU khác đồng thời truy cập cùng một bộ nhớ. Trong hệ đa bộ xử lý, tính loại trừ lẫn nhau xuyên CPU vẫn phải dựa vào lệnh nguyên tử, giao thức nhất quán bộ nhớ cache và quy tắc khóa trong nhân.

Đây cũng là vì sao khóa trình hệ điều hành sẽ dạy lệnh nguyên tử trước, rồi mới nói việc triển khai khóa. Khóa phơi bày cho lập trình viên là `lock()` / `unlock()`, bên dưới dựa vào bản cập nhật không thể tách rời do CPU và nhân cùng duy trì.

## Khóa còn chịu trách nhiệm về thứ tự bộ nhớ

Khóa không chỉ xếp hàng ở cửa vùng critical. Trong hệ đa CPU, CPU và trình biên dịch đều có thể điều chỉnh thứ tự truy cập bộ nhớ; nếu ngữ nghĩa đồng bộ hóa không đủ, trạng thái mà một CPU ghi, CPU khác chưa chắc đã nhìn thấy theo đúng thứ tự mã nguồn.

Vì vậy, việc giành khóa và giải phóng khóa thường còn mang ngữ nghĩa thứ tự bộ nhớ. Có thể hiểu ban đầu qua hai từ này:

- acquire: các truy cập bộ nhớ sau khi lấy khóa, không được phép được sắp xếp lại trước thời điểm lấy khóa.
- release: các truy cập bộ nhớ trước khi giải phóng khóa, không được phép được sắp xếp lại sau thời điểm giải phóng khóa.

Tài liệu memory barrier của nhân Linux cũng quy thao tác LOCK vào acquire, thao tác UNLOCK vào release. Khi sử dụng đúng mutex, spinlock loại nguyên thủy đồng bộ hóa, developer thường không cần tự viết memory barrier; chỉ khi viết cấu trúc lock-free, driver, đồng bộ hóa tầng đáy trong nhân hoặc tương tác thiết bị, mới cần trực diện đối mặt với memory barrier.

Ở đây còn có một ranh giới: acquire và release là sự đảm bảo tối thiểu, hai bên phối hợp không bằng full memory barrier trong mọi tình huống. Mã nghiệp vụ thông thường thường không cần thuộc lòng những chi tiết này, nhưng nếu đã đang viết hàng đợi lock-free, RCU, driver hoặc truy cập MMIO, thì sự khác biệt này không thể bỏ qua.

## Priority inversion (đảo ngược ưu tiên): khóa cũng ảnh hưởng đến lập lịch

Khóa còn mang theo cả vấn đề lập lịch vào nữa.

Vấn đề kinh điển là priority inversion (đảo ngược ưu tiên). Thread ưu tiên thấp L giữ một khóa, thread ưu tiên cao H chờ khóa này; lúc này thread ưu tiên trung bình M chạy liên tục, chiếm quyền preemption của L. Kết quả là H rõ ràng có ưu tiên cao nhất, nhưng lại chờ mãi không được L giải phóng khóa.

Một trong những hướng giải quyết là kế thừa ưu tiên. Thread ưu tiên thấp giữ khóa tạm thời kế thừa ưu tiên cao nhất trong số các bên chờ, nhanh chóng chạy xong vùng critical và giải phóng khóa.

Trong thuộc tính protocol của POSIX mutex có `PTHREAD_PRIO_INHERIT` và `PTHREAD_PRIO_PROTECT`. `rt_mutex` của Linux cũng được thiết kế xoay quanh priority inheritance, dùng để hỗ trợ PI-futex và pthread mutex có thuộc tính kế thừa ưu tiên.

Đây cũng là vì sao phần trước nói semaphore không có owner sẽ mang đến hạn chế. Không có người sở hữu rõ ràng, hệ thống sẽ không biết phải nâng ưu tiên của ai; tài liệu locking của nhân Linux cũng chỉ ra, semaphore dưới PREEMPT_RT không thể cung cấp tính kế thừa ưu tiên, block trên semaphore có thể dẫn đến priority inversion.

## Khóa user space và khóa nhân khác nhau ở đâu?

Chương trình user space quan tâm đến việc các thread phối hợp với nhau như thế nào. Pthreads cung cấp cho bạn mutex, condition variable, semaphore; C++, Java, Go, Rust lại trong runtime và thư viện chuẩn của riêng mình đóng gói ra các công cụ đồng bộ hóa gắn với ngôn ngữ hơn.

Khóa trong nhân có thêm một lớp ràng buộc ngữ cảnh. Mã trong nhân có thể chạy trong ngữ cảnh tiến trình thông thường, cũng có thể chạy trong vùng ngắt, softirq hoặc vùng không thể preemption; một số đường dẫn có thể ngủ, một số đường dẫn tuyệt đối không được ngủ; một số khóa khi giữ sẽ vô hiệu hóa preemption hoặc ngắt; nhân thời gian thực còn phải xử lý priority inversion và độ trễ lập lịch.

Vì vậy, khi xem khóa trong nhân phải hỏi thêm vài câu:

- Ngữ cảnh hiện tại có thể ngủ không?
- Trong lúc giữ khóa có thể bị preemption không?
- Có khả năng bị trình xử lý ngắt re-enter không?
- Nó bảo vệ dữ liệu per-CPU, hay dữ liệu dùng chung xuyên CPU?
- Đang chạy nhân thường, hay nhân PREEMPT_RT?
- Có cần kế thừa ưu tiên để kiểm soát độ trễ thời gian thực không?

![Sơ đồ khác biệt ngữ cảnh giữa khóa user space và khóa nhân: user space chủ yếu chú trọng phối hợp thread, kernel space còn phải xét xem có thể ngủ không, có thể preemption không, có nằm trong đường dẫn ngắt hay không cũng như có chia sẻ xuyên CPU không](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/os-lock-kernel-context.png)

Có thể nắm vài điểm khác biệt phổ biến trước:

- sleeping lock loại mutex cho phép tác vụ ngủ, thích hợp cho vùng critical dài hơn, nhưng không thể dùng tùy tiện trong ngữ cảnh ngắt.
- spinlock thích hợp cho các đường dẫn trong nhân rất ngắn, không thể ngủ, lúc giữ khóa phải tránh gọi các hàm có thể block.
- rw_semaphore, rwlock hướng đến nhiều đọc một ghi, nhưng tính công bằng và ngữ nghĩa thời gian thực sẽ thay đổi theo cấu hình nhân.
- local lock, tắt preemption, tắt ngắt thiên về bảo vệ dữ liệu trên CPU hiện tại, không thể tự nhiên thay thế khóa xuyên CPU.

Tài liệu locking của nhân Linux viết những quy tắc này rất chi tiết, đặc biệt là sự thay đổi ngữ nghĩa khóa dưới PREEMPT_RT. Phát triển ứng dụng thông thường không cần thuộc lòng toàn bộ chi tiết, nhưng phải biết một điều: khóa trong nhân không thể chỉ hiểu theo vài cái tên "loại trừ/đọc ghi/spin", nó còn bị ràng buộc chặt chẽ với việc ngữ cảnh hiện tại có thể ngủ không, có thể bị preemption không, có xử lý ngắt được không.

## Chọn nguyên thủy đồng bộ hóa thế nào?

Nếu chỉ bảo vệ một đoạn sửa đổi trạng thái dùng chung, trước tiên xét mutex. Nó diễn đạt rõ ràng, khi chờ đợi có thể ngủ, thích hợp với hầu hết vùng critical trong user space.

Nếu muốn giới hạn một loại tài nguyên cùng lúc được bao nhiêu thread sử dụng, semaphore tự nhiên hơn. Ví dụ tối đa 10 tác vụ tải xuống đồng thời, connection pool tối đa 50 kết nối. Điều mấu chốt của tình huống này là "số lượng", không phải ai vào vùng critical.

Nếu thread phải chờ một thay đổi trạng thái nào đó, dùng condition variable. Hàng đợi từ rỗng sang không rỗng, tác vụ từ chưa hoàn thành sang hoàn thành, buffer từ đầy sang chưa đầy, đều thuộc loại điều kiện chờ này. Hãy nhớ đặt trạng thái trong biến dùng chung, dùng mutex bảo vệ, và chờ trong `while`.

Nếu trong nhân bảo vệ một đường dẫn rất ngắn, và ngữ cảnh hiện tại không thể ngủ, mới xét đến spinlock. Mã nghiệp vụ user space spin lâu dài thường là mùi hôi.

Nếu bạn đang triển khai ngôn ngữ runtime, thread library hoặc bộ đồng bộ hóa hiệu năng cao, cơ chế loại futex mới lọt vào tầm nhìn. Mã nghiệp vụ thông thường nên dùng thư viện chuẩn hoặc thư viện đồng thời trưởng thành hơn, thay vì trực tiếp lập trình trên system call futex.

Mấy nhận định này cũng giải thích vì sao bài viết Java lại đặt `synchronized`, `ReentrantLock`, AQS, CAS nói chung với nhau. Developer Java đối mặt với sự trừu tượng cấp ngôn ngữ; hệ điều hành đối mặt với lập lịch thread, chặn-đánh thức, lệnh nguyên tử CPU và ngữ cảnh nhân.

## Các lỗi sai phổ biến

**Coi khóa như công tắc hiệu năng.**

Khóa bảo đảm tính đúng đắn trước, rồi mới nói hiệu năng. Nếu trạng thái dùng chung có thể bị ghi hỏng, bớt đi một khóa chỉ đem bug giao cho thời điểm lập lịch quyết định.

**Dùng `if` để chờ condition variable.**

Condition variable thức dậy không có nghĩa điều kiện đã thỏa mãn. Sau khi thức dậy phải kiểm tra lại điều kiện. Ở đây dùng `while` mới phù hợp với ngữ nghĩa sử dụng condition variable.

**Coi semaphore là khóa vạn năng.**

Semaphore làm được rất nhiều việc, cũng chính vì thế, mã đọc lên dễ mất đi ngữ nghĩa. Chỉ cần loại trừ lẫn nhau thì dùng mutex; chỉ chờ một sự kiện một lần, trong nhân thường có những công cụ trực tiếp hơn như completion; khi cần đếm tài nguyên thì mới dùng semaphore.

**Làm thao tác chậm trong lúc giữ khóa.**

Khi giữ khóa mà truy cập đĩa, gửi yêu cầu mạng, chờ hệ thống bên ngoài, đều sẽ làm kéo dài vùng critical. Thread càng nhiều, cạnh tranh khóa càng dễ phóng đại thành giảm thông lượng, tích tụ hàng đợi thậm chí deadlock.

**Bỏ qua thứ tự khóa.**

Hai thread lần lượt theo `A -> B` và `B -> A` lấy khóa, vòng chờ đợi rất dễ hình thành. Hệ điều hành, database, thread Java đều gặp vấn đề tương tự. Giới thiệu đầy đủ về deadlock có thể xem [chi tiết deadlock](./dead-lock.md).

## Tổng kết

Khóa trong hệ điều hành không thể chỉ hiểu theo một API nào đó. Nó là một tập hợp các cơ chế đồng bộ hóa được thiết kế quanh trạng thái dùng chung, điều kiện chờ đợi, số lượng tài nguyên và ngữ cảnh lập lịch.

mutex chịu trách nhiệm loại trừ lẫn nhau, spinlock dùng busy-wait để đổi lấy việc bỏ qua ngủ-switch, semaphore chịu trách nhiệm đếm và giới hạn lưu lượng, condition variable khiến thread ngủ xuống khi điều kiện chưa thỏa mãn, futex nối thao tác nguyên tử user space với việc chặn-đánh thức trong nhân. Chúng nhìn đều có vẻ liên quan đến "chờ", nhưng đối tượng chờ thực tế không giống nhau: có cái chờ vào vùng critical, có cái chờ số lượng tài nguyên, có cái chờ thay đổi trạng thái, có cái chờ nhân đặt lại mình vào hàng đợi chạy được.

Khi học khóa Java, nhiều chi tiết sẽ được JVM và thư viện bọc lại; quay lại tầng hệ điều hành, trọng điểm trở thành: thread khi nào nên ngủ, khi nào có thể spin, ai chịu trách nhiệm đánh thức, đoạn mã nào không được preemption, ngữ cảnh nào không thể block.

## Tài liệu tham khảo

- [OSTEP: Locks](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf)
- [OSTEP: Condition Variables](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf)
- [OSTEP: Semaphores](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf)
- [POSIX Programmer's Manual: pthread_mutex_lock](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html)
- [POSIX Programmer's Manual: pthread_cond_wait](https://man7.org/linux/man-pages/man3/pthread_cond_wait.3p.html)
- [POSIX Programmer's Manual: pthread_mutexattr_getprotocol](https://man7.org/linux/man-pages/man3/pthread_mutexattr_getprotocol.3p.html)
- [Linux man-pages: sem_wait](https://man7.org/linux/man-pages/man3/sem_wait.3.html)
- [Linux man-pages: futex](https://man7.org/linux/man-pages/man2/futex.2.html)
- [Linux Kernel Documentation: Lock types and their rules](https://docs.kernel.org/locking/locktypes.html)
- [Linux Kernel Documentation: Memory Barriers](https://www.kernel.org/doc/Documentation/memory-barriers.txt)
- [Linux Kernel Documentation: RT-mutex subsystem with PI support](https://docs.kernel.org/locking/rt-mutex.html)
