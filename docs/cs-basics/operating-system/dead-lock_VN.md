---
title: "Giải thích chi tiết về Deadlock: Bốn điều kiện cần thiết, cách kiểm tra Deadlock Java và xử lý Deadlock cơ sở dữ liệu"
description: "Tổng hợp các câu hỏi phỏng vấn về deadlock tần suất cao, bắt đầu từ định nghĩa deadlock và bốn điều kiện cần thiết, kết hợp thực hành kiểm tra deadlock với Java synchronized, ReentrantLock, ThreadMXBean, jstack, jcmd, JConsole cũng như PostgreSQL, MySQL và giao dịch retry."
category: Cơ bản về máy tính
tag:
  - Hệ điều hành
  - Java concurrency
  - Cơ sở dữ liệu
head:
  - - meta
    - name: keywords
      content: deadlock,Deadlock,bốn điều kiện cần thiết của deadlock,Java deadlock,deadlock thread,synchronized,ReentrantLock,ThreadMXBean,jstack,jcmd,JConsole,deadlock cơ sở dữ liệu,MySQL deadlock,PostgreSQL deadlock,câu hỏi phỏng vấn hệ điều hành,câu hỏi phỏng vấn Java concurrency
---

Thread A đã lấy được tài nguyên 1, thread B cũng đã lấy được tài nguyên 2. Tiếp theo, thread A muốn tiếp tục đi tiếp thì cần tài nguyên 2; thread B muốn tiếp tục đi tiếp thì lại cần tài nguyên 1.

Cả hai thread đều không ném exception, CPU cũng không bị đầy. Hiện tượng nhìn thấy trên môi trường production có thể chỉ là vài request không bao giờ trả về, các worker thread trong thread pool dần dần bị chiếm giữ.

Vấn đề của dạng lỗi này chính ở chỗ: chương trình không "tính toán sai", mà bị kẹt ở một chuỗi chờ đợi mà chính nó không thể tự gỡ.

Deadlock thread chính là tình huống này: một nhóm thread cùng chờ nhau giải phóng tài nguyên, quan hệ chờ đợi tạo thành vòng khép kín, các thread tham gia đều không thể tự mình tiếp tục thực thi.

Nếu các thread này đang gánh các tiến trình quan trọng như đơn hàng, thanh toán, tồn kho, thì bên ngoài không chỉ thấy một thread nào đó `BLOCKED`, mà là interface timeout, hàng đợi bị đọng, thậm chí tiến trình mãi không tắt hẳn.

![Sơ đồ minh họa kịch bản deadlock: thread A giữ resource1 và chờ resource2, thread B giữ resource2 và chờ resource1, chuỗi chờ tạo thành vòng khép kín](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-deadlock-scenario.png)

Mở rộng phạm vi ra, deadlock không chỉ thuộc về thread Java. Process, transaction cơ sở dữ liệu, task phân tán, chỉ cần giữ tài nguyên của nhau rồi tiếp tục chờ, đều có thể kẹt thành hình dạng tương tự. Tài nguyên ở đây không nhất thiết phải là máy in, máy băng từ như trong giáo trình hệ điều hành, nó có thể là monitor của Java object, `ReentrantLock`, row lock cơ sở dữ liệu, distributed lock, connection trong connection pool, worker thread trong thread pool, thậm chí là buffer của pipe.

Phần sau dùng code Java để minh họa là vì dạng ví dụ này dễ tái hiện nhất. Nhưng phải nhớ, deadlock không phải là vấn đề riêng của Java. Chỉ cần trong hệ thống xuất hiện đồng thời tài nguyên độc quyền, giữ rồi tiếp tục chờ, tài nguyên không thể bị cưỡng chế tước đoạt, quan hệ chờ đợi tạo thành vòng, thì thread, process và transaction đều có thể rơi vào.

Nếu bạn muốn làm rõ ranh giới trách nhiệm của các nguyên ngữ đồng bộ như mutex, semaphore, condition variable, futex, có thể xem trước: [Giải thích chi tiết về khóa cơ chế đồng bộ hệ điều hành: mutex, semaphore, condition variable, spinlock và futex](./os-lock-and-sync.md). Chuyên đề deadlock này sẽ tập trung vào cách quan hệ chờ đợi hình thành vòng khép kín, cũng như cách kiểm tra và khôi phục trên môi trường production.

Bài viết này trình bày theo thứ tự thường dùng hơn khi kiểm tra: xem wait ring hình thành thế nào trước, rồi đến bốn điều kiện cần thiết, code tái hiện Java, đồ thị phân bổ tài nguyên, chiến lược xử lý, cuối cùng là cách bắt thread stack trên production và xem khóa cơ sở dữ liệu.

## Deadlock bị kẹt như thế nào?

Trước tiên xem kịch bản phổ biến nhất trong lập trình đa luồng. Trong hệ thống có hai thread và hai phần tài nguyên:

- Thread A lấy tài nguyên 1 trước, rồi mới xin tài nguyên 2.
- Thread B lấy tài nguyên 2 trước, rồi mới xin tài nguyên 1.

Nếu hai thread vừa kịp đan xen thực thi, sẽ xuất hiện trạng thái sau:

- Thread A giữ tài nguyên 1, chờ tài nguyên 2.
- Thread B giữ tài nguyên 2, chờ tài nguyên 1.

Thread A muốn tiếp tục chạy thì phải chờ thread B giải phóng tài nguyên 2; thread B muốn tiếp tục chạy thì lại phải chờ thread A giải phóng tài nguyên 1. Cả hai bên đều chờ đối phương động trước, nhưng không bên nào có cơ hội thực thi tiếp để giải phóng tài nguyên.

Vì vậy, deadlock và "chờ lâu" không giống nhau. Block thông thường còn có cơ hội tự khôi phục: thread khác giải phóng khóa, transaction commit, network I/O trả về, thì thread phía sau có thể tiếp tục chạy. Còn trong deadlock có thêm một cái vòng, mọi người tham gia trong vòng đều chờ người khác giải phóng tài nguyên trước.

Còn có một điểm dễ đánh giá sai khi kiểm tra: **deadlock không nhất thiết đi kèm CPU cao**. Rất nhiều lúc thread chỉ im lặng dừng ở `BLOCKED` hoặc `WAITING`, CPU ngược lại rất thấp. Khi interface timeout, thread pool đầy, connection cơ sở dữ liệu cạn kiệt, CPU chỉ có thể là một trong các manh mối, không thể coi là tiêu chí duy nhất.

## Bốn điều kiện cần thiết của deadlock

Giáo trình hệ điều hành thường nói đến điều kiện Coffman. Muốn xảy ra deadlock, 4 điều kiện dưới đây phải đồng thời thỏa mãn:

| Điều kiện                | Ý nghĩa                                                                         | Áp dụng vào Java hoặc cơ sở dữ liệu                                          |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Loại trừ lẫn nhau        | Một tài nguyên cùng một lúc chỉ được một đơn vị thực thi chiếm giữ              | `synchronized` đối tượng khóa, row-level exclusive lock, exclusive file lock |
| Giữ và chờ (giữ rồi chờ) | Đã nắm một phần tài nguyên, đồng thời tiếp tục chờ tài nguyên khác              | Thread giữ `resource1` khi tiếp tục xin `resource2`                          |
| Không thể chiếm đoạt     | Tài nguyên không thể bị lấy cưỡng chế từ bên ngoài, chỉ do người giữ giải phóng | Built-in lock của Java không thể bị thread khác trực tiếp tước đoạt          |
| Chờ vòng tròn            | Quan hệ chờ đợi tạo thành vòng khép kín                                         | Thread 1 chờ thread 2, thread 2 lại chờ thread 1                             |

![Sơ đồ minh họa bốn điều kiện cần thiết của deadlock: loại trừ lẫn nhau, giữ và chờ, không chiếm đoạt, chờ vòng tròn cùng xuất hiện mới hình thành deadlock](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-four-conditions.png)

Bảng này đừng coi là checklist "thỏa mãn một trong các điều là deadlock". Điều nó thực sự muốn nói là: bốn mục xuất hiện đồng thời, deadlock mới có điều kiện xảy ra; thiếu bất kỳ một mục nào, wait ring rất khó khép kín.

Khi viết code nghiệp vụ, điều dễ thao tác nhất là mục 2 và mục 4.

Loại trừ lẫn nhau thường không tránh được. Cùng dòng tồn kho, cùng số dư tài khoản, cùng đoạn bộ nhớ dùng chung, bản thân không thể để nhiều thread cùng lúc ghi loạn. Không chiếm đoạt cũng khó cứng nhắc sửa, khóa thường bảo vệ một đoạn trạng thái chưa hoàn thành, cướp thô bạo có thể để lại nửa thành phẩm. Ngược lại, bắt thread lấy đủ tài nguyên một lần, hoặc quy định mọi lối vào đều lấy khóa theo cùng một thứ tự, thì dễ trở thành chuẩn code mà team có thể thực thi hơn.

## Dùng Java tái hiện một deadlock

Đoạn code dưới đây chính là viết Hình 1 thành Java. Hai `Object` lần lượt đóng vai tài nguyên 1 và tài nguyên 2, hai thread vào `synchronized` theo thứ tự ngược nhau.

`Thread.sleep(1000)` không phải là nguyên nhân gây deadlock, nó chỉ phóng to cửa sổ đan xen thực thi của hai thread, khiến vấn đề dễ tái hiện hơn.

```java
public class DeadLockDemo {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

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

Một đầu ra khá điển hình là:

```text
Thread[thread 1,5,main]get resource1
Thread[thread 2,5,main]get resource2
Thread[thread 1,5,main]waiting get resource2
Thread[thread 2,5,main]waiting get resource1
```

Chương trình dừng lại ở đây. `sleep()` sớm muộn cũng kết thúc, thứ thực sự kẹt là lớp `synchronized` thứ hai: thread 1 không vào được `resource2`, thread 2 không vào được `resource1`.

Đối chiếu hiện trường về bốn điều kiện phía trước:

- Loại trừ lẫn nhau: `resource1` và `resource2` cùng một lúc chỉ được một thread giữ.
- Giữ và chờ: thread 1 giữ `resource1` chờ `resource2`, thread 2 giữ `resource2` chờ `resource1`.
- Không chiếm đoạt: Java không bắt buộc lấy `resource1` từ tay thread 1.
- Chờ vòng tròn: thread 1 chờ thread 2, thread 2 lại chờ thread 1.

Bốn điều kiện đều đúng, phần còn lại là thứ tự lập lịch. Cũng vì việc kích hoạt phụ thuộc thứ tự, có một số deadlock trên production không phải lần nào cũng tái hiện được, chạy stress test mười lần có thể chỉ kẹt một hai lần.

**Sửa code này thế nào để không còn vấn đề deadlock?**

Cách sửa trực tiếp nhất là cố định thứ tự khóa. Mọi thread đều lấy `resource1` trước, rồi mới lấy `resource2`, thì chuỗi chờ không có cơ hội vòng về điểm xuất phát.

```java
public class OrderedLockDemo {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        Runnable task = () -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");

                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        };

        new Thread(task, "thread 1").start();
        new Thread(task, "thread 2").start();
    }
}
```

Cách sửa này phá vỡ "chờ vòng tròn". Chỉ cần mọi đường code đều tuân theo cùng một thứ tự, sẽ không xuất hiện vòng khép kín A chờ B, B lại chờ A.

Điểm khó nằm ở "mọi đường code". Trong ví dụ nhỏ chỉ có hai khóa, nhìn một phát là hết; còn hệ thống nghiệp vụ, khóa có thể nằm rải rác ở vài module như đơn hàng, tồn kho, thanh toán. Chuỗi A lấy khóa đơn hàng trước rồi khóa tồn kho, chuỗi B lấy khóa tồn kho trước rồi khóa đơn hàng, nhìn đơn lẻ từng method thì đều hợp lý, chỉ khi kết hợp lại mới phát sinh vấn đề.

Trong dự án thực tế, tôi khuyên nên đưa vài điều sau vào checklist kiểm tra code đa luồng:

- Tài nguyên phải có thứ tự ổn định. Có thể sắp xếp theo các giá trị không thay đổi như business ID, khóa chính cơ sở dữ liệu, số tài khoản, đừng dựa vào hash của đối tượng vốn không phù hợp để biểu diễn thứ tự nghiệp vụ.
- Trong khóa chỉ làm các thay đổi trạng thái cần thiết. Các thao tác như RPC, SQL chậm, file I/O nên đưa ra ngoài khóa, nếu không một lần gọi chậm sẽ kéo dài chuỗi chờ.
- Lấy không đủ tài nguyên thì rút lui. Khi đã lấy được A, lấy không được B, giải phóng A rồi thử lại sẽ an toàn hơn giữ A mà cứ chờ B.
- Khi nghiệp vụ cho phép thất bại, dùng `tryLock(timeout, unit)` để đặt giới hạn trên cho việc chờ, đừng để thread kẹt vô hạn.
- Nếu hai khóa luôn đi cùng nhau, cân nhắc gộp thành một khóa thô hơn. Độ đồng thời sẽ giảm, nhưng đổi lại là tính đúng đắn dễ chứng minh hơn.

Điều cuối cùng này nhìn có vẻ hơi "lùi bước", nhưng trong thực tiễn kỹ thuật thường rất hữu dụng. Tách khóa quá nhỏ không hẳn là cao cấp hơn; nếu vài trạng thái vốn có quan hệ tương quan mạnh, tách ra ngược lại sẽ tạo chỗ trống cho deadlock.

## Đồ thị phân bổ tài nguyên và wait graph

Giáo trình hệ điều hành thường dùng đồ thị phân bổ tài nguyên để vẽ deadlock. Trong đồ thị thực ra chỉ có hai loại thành phần:

- Node process hoặc thread.
- Node tài nguyên.

Mũi tên cũng chia hai loại:

- Từ thread chỉ đến tài nguyên, biểu thị thread đang chờ tài nguyên này.
- Từ tài nguyên chỉ đến thread, biểu thị tài nguyên đã được cấp cho thread này.

Xem một kết luận hữu ích nhất: trong đồ thị không có vòng, thì không có deadlock.

Khi đồ thị có vòng, không thể kết luận ngay một đường cắt, còn phải xem số lượng instance tài nguyên:

- Khi mỗi loại tài nguyên chỉ có 1 instance, có vòng tức là deadlock.
- Khi mỗi loại tài nguyên có nhiều instance, có vòng chỉ nói lên khả năng deadlock, còn phải tiếp tục xét có thread nào đó có thể hoàn thành trước và giải phóng tài nguyên hay không.

Lấy row lock cơ sở dữ liệu làm ví dụ. Transaction T1 đã khóa đơn hàng `id=1`, tiếp theo cần cập nhật `id=2`; transaction T2 khóa `id=2` trước, lại quay lại cập nhật `id=1`. Lúc này có thể bỏ node tài nguyên sang một bên, chỉ nhìn quan hệ chờ giữa các transaction:

```text
T1 -> T2
T2 -> T1
```

Đồ thị chỉ giữ "ai chờ ai" như thế này gọi là wait graph (Wait-for Graph), có thể xem là phiên bản giản lược của đồ thị phân bổ tài nguyên. Deadlock thread Java, phát hiện deadlock cơ sở dữ liệu, Linux lockdep đều dùng tư duy đồ thị tương tự, chỉ khác thời điểm dùng: cơ sở dữ liệu thường chờ transaction thực sự bị chặn rồi mới kiểm tra wait ring; lockdep thì giống như ghi lại thứ tự lấy khóa, phát hiện sớm một số tổ hợp thứ tự có thể vòng thành ring.

![Sơ đồ minh họa đồ thị phân bổ tài nguyên và wait graph: đồ thị phân bổ tài nguyên gồm thread và node tài nguyên, wait graph chỉ giữ quan hệ chờ giữa các thread](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-resource-allocation-graph.png)

## Phòng ngừa, tránh, phát hiện, khôi phục

Khi nói về xử lý deadlock, thường thấy 4 từ: phòng ngừa, tránh, phát hiện, khôi phục. Tên nghe giống nhau, nhưng thời điểm can thiệp của chúng khác nhau.

Trong code nghiệp vụ, phổ biến nhất là phòng ngừa, ví dụ thống nhất thứ tự khóa, rút ngắn thời gian giữ khóa; cơ sở dữ liệu quen dùng phát hiện và khôi phục hơn, vì transaction có thể rollback; thuật toán nhà băng thuộc loại "tránh", rất hợp để hiểu trạng thái an toàn, nhưng dịch vụ backend thông thường hiếm khi thực sự theo một bộ như vậy.

| Phương pháp | Cách làm                                                                                             | Cái giá                                                 | Mức độ phổ biến trong thực tiễn                          |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Phòng ngừa  | Phá vỡ một trong bốn điều kiện, để deadlock không tồn tại về mặt cấu trúc                            | Có thể giảm độ đồng thời hoặc tăng ràng buộc viết code  | Rất phổ biến                                             |
| Tránh       | Trước khi phân bổ tài nguyên, xét lần phân bổ này có đẩy hệ thống vào trạng thái nguy hiểm hay không | Cần biết trước nhu cầu tài nguyên, chi phí kiểm tra cao | Giáo trình hay nói, hệ thống thông dụng hiếm             |
| Phát hiện   | Cho phép deadlock xảy ra, định kỳ hoặc theo nhu cầu kiểm tra wait ring                               | Bản thân việc phát hiện có chi phí                      | Phổ biến trong cơ sở dữ liệu, công cụ JVM, gỡ lỗi kernel |
| Khôi phục   | Sau khi phát hiện deadlock thì kết thúc, rollback hoặc chiếm đoạt tài nguyên                         | Có thể vứt bỏ công việc đã hoàn thành                   | Tự nhiên hơn trong transaction cơ sở dữ liệu             |

![Đồ thị chiến lược xử lý deadlock: vị trí tác động và mức độ phổ biến trong thực tiễn của bốn phương pháp phòng ngừa, tránh, phát hiện, khôi phục](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-strategies.png)

### Phòng ngừa deadlock

Phòng ngừa làm điều rất trực tiếp: đừng để bốn điều kiện cần thiết cùng đủ.

**Phá vỡ loại trừ lẫn nhau**: biến tài nguyên thành có thể chia sẻ. Dữ liệu chỉ đọc, đối tượng bất biến, cấu trúc dữ liệu không khóa, ghi log dạng append, đều giảm được nhu cầu loại trừ lẫn nhau. Nhưng con đường này thường không đi được, ví dụ cùng dòng trừ tồn kho, cùng vị trí ghi file, cùng số dư người dùng, vốn không thể để nhiều đơn vị thực thi cùng lúc tùy ý sửa.

**Phá vỡ giữ và chờ**: hoặc một lần lấy đủ tài nguyên, hoặc không lấy cái nào. Như vậy sẽ không xuất hiện trạng thái "tay đang giữ A, lại cứ chờ B". Cái giá cũng rõ: tỷ lệ sử dụng tài nguyên có thể giảm, người gọi còn phải biết trước mình cần những tài nguyên nào.

**Phá vỡ không chiếm đoạt**: khi không lấy được tài nguyên mới, chủ động giải phóng tài nguyên đã lấy, chút nữa thử lại. Built-in lock của Java không hỗ trợ lấy có timeout, cũng không để thread khác cưỡng chế thu hồi; `Lock` interface cung cấp `tryLock()`, có thể đưa "chờ không được thì rút lui" vào code.

```java
boolean gotA = false;
boolean gotB = false;

try {
    gotA = lockA.tryLock(100, TimeUnit.MILLISECONDS);
    if (!gotA) {
        return;
    }

    gotB = lockB.tryLock(100, TimeUnit.MILLISECONDS);
    if (!gotB) {
        return;
    }

    // Đã đồng thời lấy được hai khóa rồi mới xử lý trạng thái dùng chung
    updateSharedState();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    // Đừng nuốt mất tín hiệu ngắt, cụ thể trả về hay ném exception do nghiệp vụ quyết định.
} finally {
    if (gotB) {
        lockB.unlock();
    }
    if (gotA) {
        lockA.unlock();
    }
}
```

Đoạn code này tốt ở chỗ sẽ không chờ vô hạn. Cái xấu cũng phải nhìn rõ: nó chỉ biến việc chờ thành trả về thất bại, sau đó làm sao thử lại, có cho phép thử lại hay không, có idempotency key hay không, đều do nghiệp vụ tự xử lý. Nếu không, deadlock hết rồi, nhưng tần suất thất bại cao hoặc livelock lại tới.

**Phá vỡ chờ vòng tròn**: xếp cho tài nguyên một thứ tự ổn định, mọi thread chỉ được xin theo thứ tự này. Ví dụ phổ biến nhất trong nghiệp vụ backend là khi batch cập nhật các dòng dữ liệu cơ sở dữ liệu thì trước tiên sắp xếp theo khóa chính, rồi cập nhật từng dòng.

### Tránh deadlock

Tránh deadlock không trực tiếp tháo bốn điều kiện, mà trước khi phân bổ tài nguyên hỏi một câu: sau lần phân bổ này, hệ thống còn tìm ra một thứ tự "mọi người đều lần lượt hoàn thành" hay không?

Điển hình nhất trong giáo trình là thuật toán nhà băng. Nó yêu cầu mỗi process khai báo sớm nhu cầu tài nguyên tối đa, mỗi lần hệ thống chuẩn bị phân bổ tài nguyên trước đều phải làm một lần kiểm tra an toàn:

- Nếu sau khi phân bổ vẫn tồn tại một chuỗi an toàn, thì cho phép phân bổ.
- Nếu sau khi phân bổ không tìm thấy chuỗi an toàn, thì để bên xin chờ.

Trạng thái an toàn sẽ không đi vào deadlock; trạng thái không an toàn cũng không phải đã deadlock, chỉ là sau này có thể đi vào deadlock.

Thuật toán nhà băng phù hợp để hiểu "trạng thái an toàn", nhưng dịch vụ nghiệp vụ thông thường hiếm khi trực tiếp dùng nó. Lý do không hề thần bí: đa số chương trình rất khó nói rõ trước nhu cầu tài nguyên tối đa, thứ tự yêu cầu cũng biến đổi theo nhánh nghiệp vụ; mỗi lần phân bổ trước đều làm kiểm tra toàn cục, chi phí còn không thấp.

### Phát hiện deadlock

Ý tưởng phát hiện đổi sang hướng khác: hệ thống chạy bình thường trước, chờ đến khi thread hoặc transaction thực sự chờ nhau, rồi mới đi tìm wait ring.

Cơ sở dữ liệu rất hợp làm việc này. Transaction vốn có ranh giới rollback, sau khi phát hiện deadlock chọn một transaction rollback, transaction kia có thể tiếp tục thực thi. Phía ứng dụng cần làm là nhận diện loại lỗi này, và quyết định có thử lại toàn bộ transaction hay không.

Trong process Java cũng có thể làm chẩn đoán. JDK cung cấp `ThreadMXBean`:

```java
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class DeadlockDetector {
    public static void printDeadlocks() {
        ThreadMXBean bean = ManagementFactory.getThreadMXBean();
        long[] threadIds = bean.findDeadlockedThreads();

        if (threadIds == null || threadIds.length == 0) {
            System.out.println("No deadlock found");
            return;
        }

        ThreadInfo[] threadInfos = bean.getThreadInfo(threadIds, true, true);
        for (ThreadInfo threadInfo : threadInfos) {
            System.out.println(threadInfo);
        }
    }
}
```

`findDeadlockedThreads()` có thể kiểm tra object monitor, cũng bao phủ được ownable synchronizer trong `java.util.concurrent`. Nó thích hợp đặt trong công cụ chẩn đoán hoặc script xử lý sự cố tạm thời, không thích hợp nhồi tần suất cao vào luồng chính nghiệp vụ; bản thân loại kiểm tra này cũng có chi phí.

Ranh giới của nó cũng phải nói rõ: nó chỉ thấy được monitor và ownable synchronizer hiển thị bên trong JVM. Thread A giữ khóa Java để chờ row lock cơ sở dữ liệu, thread B giữ row lock cơ sở dữ liệu lại kẹt ở một thao tác ứng dụng khác, chuỗi chờ xuyên hệ thống kiểu này chỉ dựa vào `ThreadMXBean` không thể nhìn trọn, còn phải gộp thread stack, view khóa cơ sở dữ liệu và log nghiệp vụ lại với nhau.

Trên production phổ biến hơn là trực tiếp lấy thread stack:

```bash
jcmd <pid> Thread.print -l
jstack -l <pid>
```

Nếu trong đầu ra xuất hiện `Found one Java-level deadlock`, `waiting to lock`, `which is held by`, thường là có thể ngược chuỗi chờ để truy về code nghiệp vụ. Ở đây khuyên nên kèm `-l`, vì nhiều project dùng các khóa JUC như `ReentrantLock`, `ReentrantReadWriteLock`; thiếu `-l`, thông tin ownable synchronizer có thể không đầy đủ.

Khi tái hiện cục bộ, các công cụ đồ họa như JConsole, VisualVM cũng rất dễ dùng. Lấy JConsole làm ví dụ, đầu tiên tìm thư mục `bin` của JDK và mở `jconsole`.

![jconsole](https://oss.javaguide.cn/github/javaguide/java/concurrent/jdk-home-bin-jconsole.png)

Kết nối process Java mục tiêu xong, vào trang "Thread", bấm "phát hiện deadlock".

![jconsole phát hiện deadlock](https://oss.javaguide.cn/github/javaguide/java/concurrent/jconsole-check-deadlock.png)

Nếu trong process mục tiêu tồn tại deadlock thread Java, JConsole sẽ liệt kê riêng các thread liên quan.

![jconsole đã phát hiện deadlock](https://oss.javaguide.cn/github/javaguide/java/concurrent/jconsole-check-deadlock-done.png)

Môi trường production nói chung vẫn ưu tiên dùng `jcmd`, `jstack`. Chúng có thể thực thi qua SSH, đầu ra cũng dễ lưu trữ. JConsole thích hợp tái hiện cục bộ, demo giảng dạy, hoặc trong môi trường test nhanh chóng xem trạng thái thread. Kết nối từ xa JConsole trong môi trường production cần cân nhắc thêm quyền hạn, lộ diện mạng và chi phí vận hành, nhiều team sẽ chọn xuất thread stack trước, rồi phân tích ngoại tuyến.

Nếu ứng dụng dùng nhiều virtual thread Java 21+, còn phải đề phòng thêm một điểm. Virtual thread không gắn lâu dài với một OS thread cụ thể, thông tin mà `jstack` hoặc `Thread.print` truyền thống thấy có thể không trực quan bằng platform thread. Có thể dùng các lệnh sau để xuất dump virtual thread:

```bash
jcmd <pid> Thread.dump_to_file -format=text thread-dump.txt
jcmd <pid> Thread.dump_to_file -format=json thread-dump.json
```

Các trường của dump virtual thread và dump thread truyền thống không hoàn toàn giống nhau; các thông tin thường thấy trong dump thread truyền thống như địa chỉ đối tượng, khóa, thống kê JNI, thống kê heap chưa chắc đều có. Khi kiểm tra đừng chỉ xem một bản dump, log nghiệp vụ, JFR, trạng thái cơ sở dữ liệu và phụ thuộc bên ngoài đều phải xem cùng.

### Khôi phục deadlock

Khôi phục rắc rối hơn phát hiện, vì hệ thống phải quyết định "hy sinh ai".

Các thủ đoạn phổ biến có 3 loại:

- Kết thúc tất cả đơn vị thực thi tham gia deadlock.
- Mỗi lần kết thúc một, kiểm tra xem deadlock đã được gỡ chưa.
- Chiếm đoạt một số tài nguyên, rollback về trạng thái có thể tiếp tục thực thi.

Transaction cơ sở dữ liệu thích hợp để khôi phục, vì ranh giới transaction rõ ràng, sau rollback có thể thực thi lại. Còn thread Java thông thường thì rắc rối hơn nhiều: một thread khi giữ khóa có thể đã sửa một nửa trạng thái bộ nhớ, ghi một nửa file, gửi một nửa request từ xa, trực tiếp giết thường không nên làm. Java đã sớm không khuyến khích dùng `Thread.stop()`, cũng vì lý do này.

Code ứng dụng nên làm nhiều hơn là tránh viết mình vào chỗ chết: một khi kẹt, chỉ còn cách giết process để khôi phục.

## Deadlock trong cơ sở dữ liệu

Deadlock trong cơ sở dữ liệu rất phổ biến, đặc biệt khi nhiều transaction cập nhật nhiều dòng dữ liệu.

Giả sử có bảng đơn hàng:

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  status VARCHAR(32) NOT NULL
);
```

Hai transaction thực thi như sau:

```sql
-- Transaction T1
BEGIN;
UPDATE orders SET status = 'PAID' WHERE id = 1;
UPDATE orders SET status = 'PAID' WHERE id = 2;
COMMIT;
```

```sql
-- Transaction T2
BEGIN;
UPDATE orders SET status = 'CANCELLED' WHERE id = 2;
UPDATE orders SET status = 'CANCELLED' WHERE id = 1;
COMMIT;
```

Nếu T1 khóa `id=1` trước, T2 khóa `id=2` trước, phía sau sẽ chờ nhau.

Cơ sở dữ liệu thường không để hai transaction này treo mãi. PostgreSQL có tham số `deadlock_timeout`, mặc định là `1s`; sau khi transaction chờ khóa vượt quá thời gian này, cơ sở dữ liệu mới bắt đầu kiểm tra deadlock, vì việc xây dựng và quét wait graph cũng có chi phí. MySQL InnoDB mặc định bật phát hiện deadlock, sau khi phát hiện wait ring sẽ rollback một transaction để gỡ cục diện, thường thiên về chọn transaction sửa ít dòng hơn.

Tầng ứng dụng phải phối hợp hai việc.

Thứ nhất, sau khi transaction thất bại phải chạy lại được. Mã lỗi deadlock của PostgreSQL là SQLSTATE `40P01`; MySQL InnoDB khi gặp deadlock sẽ rollback toàn bộ transaction. Khi ứng dụng nhận được loại lỗi này, nên thực thi lại toàn bộ transaction, chứ không phải chỉ bổ sung câu SQL cuối.

Thứ hai, thứ tự khóa phải ổn định. Khi batch cập nhật nhiều dòng, trước tiên sắp xếp theo khóa chính hoặc khóa nghiệp vụ duy nhất, mọi lối vào đều cập nhật theo cùng một thứ tự. Thói quen này rất bình thường, nhưng giảm được rất nhiều việc chờ chéo.

Trước khi thử lại còn phải xác nhận nghiệp vụ có khả năng idempotent. Cách làm khá phổ biến là dùng số request duy nhất, số serial nghiệp vụ hoặc kiểm tra state machine. Nếu không, cơ sở dữ liệu đã xử lý xong deadlock, nhưng tầng ứng dụng có thể vì thử lại mà gây trừ tiền trùng, gửi hàng trùng.

Khi giảm và kiểm tra deadlock cơ sở dữ liệu, có thể xem các loại thông tin sau:

- Transaction càng ngắn càng tốt, đừng trong transaction chờ nhập liệu của người dùng, gọi interface chậm, xử lý file lớn.
- Index phải đúng, nếu không việc cập nhật một dòng có thể quét và khóa thêm nhiều record hơn.
- Hạn chế dùng `SELECT ... FOR UPDATE` không cần thiết.
- MySQL có thể dùng `SHOW ENGINE INNODB STATUS` để xem thông tin deadlock InnoDB gần nhất; nếu deadlock rất thường xuyên, có thể cân nhắc bật `innodb_print_all_deadlocks` để ghi mọi thông tin deadlock vào error log.
- PostgreSQL có thể kết hợp error log, `pg_locks`, `pg_stat_activity` để tra quan hệ chặn.

Trong PostgreSQL có thể dùng trước truy vấn dưới đây để xem các session nào đang chờ khóa, và chúng bị pid nào chặn:

```sql
SELECT
    a.pid,
    a.usename,
    a.state,
    a.wait_event_type,
    a.wait_event,
    pg_blocking_pids(a.pid) AS blocking_pids,
    a.query
FROM pg_stat_activity a
WHERE a.wait_event_type = 'Lock';
```

Câu SQL này chỉ xem được quan hệ chờ hiện tại. Muốn phân tích một deadlock đã xảy ra, còn phải quay lại chi tiết deadlock trong error log cơ sở dữ liệu, tìm traceId/requestId trong log ứng dụng, rồi khôi phục thứ tự thực thi SQL của từng transaction.

Deadlock cơ sở dữ liệu không phải là "cơ sở dữ liệu hỏng". Đa số thời gian, nó đang nhắc bạn: thứ tự truy cập cùng một nhóm tài nguyên ở tầng ứng dụng chưa đủ ổn định.

## Deadlock, starvation và livelock khác nhau thế nào?

Mấy khái niệm này đều thể hiện thành "chương trình không đi tiếp theo dự kiến", nhưng hiện trường khác nhau rất nhiều.

| Vấn đề     | Biểu hiện                                                                           | Nguyên nhân điển hình                                         |
| ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Deadlock   | Nhiều đơn vị thực thi chờ nhau, tạo thành vòng khép kín                             | Khóa ngược chiều, transaction cập nhật chéo                   |
| Starvation | Một đơn vị thực thi lâu không lấy được tài nguyên, nhưng hệ thống tổng thể vẫn tiến | Ưu tiên quá thấp, cạnh tranh nonfair lock                     |
| Livelock   | Đơn vị thực thi luôn hoạt động, nhưng luôn nhường nhau, không ai hoàn thành         | Sau thất bại cùng lúc thử lại, chiến lược backoff quá đồng bộ |

![Đồ thị so sánh deadlock, starvation và livelock: deadlock biểu hiện là wait ring, starvation là lâu không lấy được tài nguyên, livelock là liên tục hành động nhưng không có tiến triển](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/dead-lock-deadlock-vs-starvation-livelock.png)

Có thể dùng ba hình ảnh để nhớ: deadlock như hai chiếc xe kẹt giữa cây cầu hẹp, ai cũng không lùi; starvation như trong hàng luôn có người chen ngang, người tận cuối hàng mãi không đến lượt; livelock như hai người đi ngược chiều nhau, mỗi lần đều đồng thời nhường sang cùng một bên, kết quả mãi không tránh được nhau.

Khi kiểm tra đừng chỉ nhìn mỗi hiện tượng "kẹt". Deadlock phải tìm wait ring, starvation phải xem lập lịch hay cạnh tranh khóa có thiên lệch lâu dài hay không, livelock phải xem logic thử lại có kẹp mọi người tham gia vào cùng một nhịp hay không.

## Những trường hợp kẹt nào không nhất thiết là deadlock?

Trên production có nhiều trường hợp "kẹt" nhìn như deadlock, cuối cùng tra ra không có wait ring. Phổ biến có các loại sau:

- **Cạn kiệt thread pool**: mọi worker thread đều đang chạy task chậm, request mới chỉ biết xếp hàng.
- **Cạn kiệt connection pool**: thread đều chờ connection cơ sở dữ liệu, nhưng không tạo thành vòng khép kín chờ nhau.
- **SQL chậm**: thread dừng trong lời gọi JDBC, cơ sở dữ liệu vẫn đang thực thi.
- **External service timeout**: thread kẹt ở lời gọi HTTP/RPC, chờ đối phương phản hồi.
- **GC hoặc safepoint dừng lại**: mọi thread Java tạm thời dừng trong thời gian ngắn.
- **Starvation**: một số thread lâu không giành được tài nguyên, nhưng hệ thống tổng thể vẫn tiến.

Để xác định deadlock, bằng chứng then chốt không phải "chậm" hay "kẹt", mà là có tìm được wait ring ổn định hay không.

## Kiểm tra deadlock Java trên production thế nào?

Nếu interface trên production bị kẹt, đừng vội restart. Chỉ cần process còn sống, hãy cố gắng lưu lại thread stack và số liệu hiện trường trước.

### 1. Xác nhận trước xem có phải "kẹt toàn bộ" không

Trước tiên xem hiện tượng có tập trung vào "thread không giải phóng tài nguyên" hay không:

- Một số interface liên tục timeout, nhưng process vẫn sống.
- CPU không cao, số thread, số connection, hàng đợi request liên tục tích tụ.
- Thread active trong thread pool chiếm đầy lâu dài, hàng đợi không giảm.
- Connection trong connection pool cơ sở dữ liệu bị chiếm không giải phóng.

Những hiện tượng này chỉ nói lên dịch vụ đang chờ, chưa đủ để chứng minh deadlock. SQL chậm, phụ thuộc bên ngoài kẹt, cấu hình thread pool bất hợp lý, cũng tạo ra hiện trường tương tự.

### 2. Liên tục lấy 2 đến 3 lần thread stack

Thread stack khuyên nên lấy liên tục vài lần, cách nhau 10 đến 30 giây. Chỉ lấy một lần, rất dễ đánh giá nhầm chặn tức thời thành deadlock:

```bash
jcmd <pid> Thread.print -l > thread-1.log
sleep 10
jcmd <pid> Thread.print -l > thread-2.log
sleep 10
jcmd <pid> Thread.print -l > thread-3.log
```

Giá trị của nhiều lần lấy stack nằm ở chỗ so sánh. Nếu ba lần đều dừng ở cùng một khóa, cùng một connection pool, cùng một đoạn code nghiệp vụ, thì phán đoán sẽ đáng tin hơn nhiều so với một lần stack.

Deadlock thread mà Java nhận diện được, thread stack thường sẽ trực tiếp in ra thông tin deadlock. Khi không in trực tiếp, cũng có thể quan sát xem số lượng lớn thread có đang lâu dài dừng ở cùng một nhóm khóa, cùng một logic lấy connection pool hoặc cùng một method nghiệp vụ hay không.

### 3. Theo `waiting to lock` tìm người giữ

Khi đọc thread stack, trước tiên chú ý các loại thông tin sau:

- Tên thread và trạng thái thread, ví dụ `BLOCKED`, `WAITING`.
- Đối tượng khóa đang chờ.
- Khóa hiện đang giữ.
- Method nghiệp vụ ở đỉnh stack.
- `Lock` hoặc hàng đợi điều kiện tương ứng với `parking to wait for`.

Nếu thấy được A chờ khóa B giữ, B lại chờ khóa A giữ, wait ring cơ bản đã hiện ra.

Deadlock liên quan `synchronized` thường thấy `waiting to lock <...>` và `locked <...>`; khóa JUC như `ReentrantLock` thường thấy `parking to wait for <...>`, và cần để ý `Locked ownable synchronizers`. Do đó khi lấy stack khuyên nên kèm `-l`.

### 4. Quay lại code xem thứ tự khóa

Sau khi định vị method nghiệp vụ trong stack, quay lại code tra các điểm này:

- Có tồn tại nhiều lối vào lấy cùng một nhóm khóa theo chiều ngược nhau hay không.
- Có gọi dịch vụ bên ngoài hoặc cơ sở dữ liệu trong lúc giữ khóa hay không.
- Có khóa đối tượng phạm vi quá lớn hay không, ví dụ `Map` toàn cục, object singleton, `Class` object.
- Có dùng lẫn lộn khóa Java và khóa transaction cơ sở dữ liệu, khiến chuỗi càng dài hay không.
- Có dùng nonfair lock, chờ vô hạn, lấy không có timeout hay không.

Nhiều deadlock không phải do một dòng code đơn lẻ gây ra, mà sau khi hai chuỗi gọi kết hợp mới xuất hiện. Nhìn riêng chuỗi A, chuỗi B đều ổn, đặt chung vào nhau mới vòng thành ring.

## Viết code thế nào để giảm deadlock?

Dưới đây vài điều giống như mục kiểm tra khi review code, đặc biệt thích hợp cho kịch bản nhiều khóa, nhiều transaction, cập nhật nhiều tài nguyên.

### Cố định thứ tự khóa

Khi cùng lúc thao tác nhiều người dùng, đơn hàng hoặc tài khoản, trước tiên sắp xếp rồi mới khóa. Ví dụ chuyển tiền dưới đây giả định ID tài khoản duy nhất toàn cục, và sau khi tạo không thay đổi.

```java
public void transfer(Account from, Account to, long amount) {
    if (from == to) {
        return;
    }

    Account first;
    Account second;
    int compare = Long.compare(from.id(), to.id());
    if (compare < 0) {
        first = from;
        second = to;
    } else if (compare > 0) {
        first = to;
        second = from;
    } else {
        throw new IllegalStateException("Account id must be unique");
    }

    synchronized (first) {
        synchronized (second) {
            from.withdraw(amount);
            to.deposit(amount);
        }
    }
}
```

Trong ví dụ này, dù là A chuyển cho B, hay B chuyển cho A, đều khóa tài khoản ID nhỏ trước, rồi khóa tài khoản ID lớn. Sau khi thứ tự cố định, chờ vòng tròn bớt đi một cạnh.

### Tránh giữ khóa làm thao tác chậm

Trong lúc giữ khóa cố gắng đừng làm các việc sau:

- Request RPC hoặc HTTP.
- SQL chậm hoặc transaction lớn.
- Upload download file.
- Chờ message queue trả về.
- Gọi code bên thứ ba không rõ bên trong có khóa hay không.

Khóa nên bảo vệ trạng thái dùng chung, chứ không phải bọc trọn cả luồng nghiệp vụ vào trong. Dữ liệu tính sẵn được thì đưa ra ngoài khóa mà tính, trong khóa chỉ để lại phần chuyển trạng thái ngắn nhất.

### Dùng timeout và chiến lược thất bại

Built-in lock `synchronized` không có khả năng lấy có timeout. Khi nghiệp vụ cho phép thất bại hoặc thử lại, có thể cân nhắc `ReentrantLock.tryLock()`:

```java
try {
    if (!lock.tryLock(200, TimeUnit.MILLISECONDS)) {
        throw new IllegalStateException("Hệ thống đang bận, xin thử lại sau");
    }

    try {
        updateSharedState();
    } finally {
        lock.unlock();
    }
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new IllegalStateException("Bị ngắt khi lấy khóa", e);
}
```

Timeout chỉ giới hạn thời gian chờ, không thể tự động đảm bảo nghiệp vụ đúng. Sau khi lấy không được khóa thì có thử lại hay không, tối đa thử mấy lần, có submit trùng hay không, có cần idempotency key hay không, mấy vấn đề này đều phải thiết kế trước. Nếu không, timeout chỉ khiến lỗi lộ ra nhanh hơn.

### Hạn chế dùng nhiều hệ khóa lẫn lộn

Khó sửa nhất là deadlock xuyên tầng, ví dụ:

- Thread Java giữ khóa JVM, đồng thời chờ row lock cơ sở dữ liệu.
- Request khác giữ row lock cơ sở dữ liệu, callback vào logic ứng dụng chờ khóa JVM.

Loại chuỗi chờ này sẽ đồng thời xuất hiện trong thread stack JVM và log cơ sở dữ liệu, chỉ nhìn một bên đều không đầy đủ. Có thể giữ khóa trong cùng một tầng thì đừng để quan hệ chờ xuyên quá nhiều thành phần; bắt buộc phải xuyên tầng thì tối thiểu phải có timeout, log và thứ tự thống nhất.

### Đặt tên cho khóa, đặt tên cho thread

Khi kiểm tra trên production, thứ sợ nhất là thấy được thông tin kiểu "Thread-17 chờ Object@4afcd809". Thread pool tùy chỉnh tên thread, đối tượng khóa gắn business ID, log in ra thứ tự tài nguyên then chốt, bình thường viết thêm vài dòng, lúc gặp sự cố sẽ tiết kiệm được rất nhiều thời gian.

Ví dụ đưa tên pool nghiệp vụ vào tên thread:

```java
private static final AtomicInteger THREAD_INDEX = new AtomicInteger();

ThreadFactory factory = runnable -> {
    Thread thread = new Thread(runnable);
    thread.setName("order-worker-" + THREAD_INDEX.incrementAndGet());
    return thread;
};
```

`AtomicInteger` đến từ `java.util.concurrent.atomic`. Tự đánh số so với việc trực tiếp dựa vào thread ID ổn định hơn, cũng tương thích với các môi trường vẫn rất phổ biến như Java 8/11.

Bản thân việc đặt tên không chống được deadlock, nhưng giúp bạn biết nhanh hơn là loại thread nghiệp vụ nào đang bị kẹt.

## Trả lời deadlock trong phỏng vấn thế nào?

Trong phỏng vấn hỏi về deadlock, không cần vừa lên đã đọc thuộc định nghĩa dài. Có thể dùng trước một ví dụ hai khóa chờ nhau để nói rõ kịch bản:

> Deadlock là trạng thái nhiều thread hoặc process chờ nhau giải phóng tài nguyên, khiến mọi người tham gia không thể tiếp tục thực thi. Ví dụ điển hình là thread A giữ khóa 1 chờ khóa 2, thread B giữ khóa 2 chờ khóa 1.

Rồi bổ sung bốn điều kiện cần thiết:

> Deadlock phải đồng thời thỏa mãn 4 điều kiện loại trừ lẫn nhau, giữ và chờ, không chiếm đoạt, chờ vòng tròn. Chỉ cần phá được một trong các điều kiện, là có thể tránh deadlock về mặt cấu trúc.

Rồi nói phương pháp xử lý:

> Trong thực tiễn kỹ thuật, phổ biến nhất là phòng ngừa, ví dụ thống nhất thứ tự khóa, thu nhỏ phạm vi khóa, một lần xin đủ tài nguyên, dùng khóa có timeout. Giáo trình hệ điều hành còn nói thuật toán nhà băng, nó thuộc loại tránh deadlock, cần biết trước nhu cầu tài nguyên tối đa. Cơ sở dữ liệu thường áp dụng phát hiện và khôi phục, sau khi phát hiện wait ring thì rollback một transaction, tầng ứng dụng thử lại.

Nếu được hỏi tiếp về kiểm tra Java:

> Java có thể dùng `jcmd <pid> Thread.print -l` hoặc `jstack -l <pid>` để lấy thread stack, cũng có thể dùng `ThreadMXBean.findDeadlockedThreads()` để làm chẩn đoán trong chương trình. Khi kiểm tra nhìn trạng thái thread, khóa đang chờ, khóa đã giữ, rồi quay lại code xác nhận có lock ngược chiều hoặc thao tác chậm khi giữ khóa hay không.

Trả lời như vậy bao phủ được khái niệm, điều kiện, giải pháp và kiểm tra, đầy đủ hơn việc chỉ thuộc lòng bốn điều kiện.

## Tổng kết

Điều đáng nhớ nhất về deadlock không phải thuật ngữ, mà là quan hệ chờ đợi.

Chỉ cần trong code tồn tại đường "đã giữ một phần tài nguyên, lại tiếp tục chờ phần tài nguyên khác", thì phải tự hỏi thêm một câu: những quan hệ chờ này có khả năng vòng thành ring không? Nếu có, thì hoặc cố định thứ tự, hoặc rút ngắn thời gian giữ, hoặc cho phép timeout rút lui, hoặc giao cho hệ thống có thể phát hiện và rollback như transaction cơ sở dữ liệu xử lý.

Có những chỗ không thể đảm bảo mãi không deadlock, ví dụ transaction cơ sở dữ liệu phức tạp, batch cập nhật độ đồng thời cao, dàn xếp tài nguyên xuyên dịch vụ. Mục tiêu thực tế hơn là giảm xác suất xuống, giữ lại hiện trường, biến thất bại thành có thể thử lại an toàn, chứ không phải kéo dài tới mức chỉ còn cách restart process.

## Tài liệu tham khảo

- [JavaGuide：操作系统常见面试题总结（上）](https://github.com/Snailclimb/JavaGuide)
- [用个通俗的例子讲一讲死锁 - 知乎专栏](https://zhuanlan.zhihu.com/p/26945588)
- [Yale CS：Deadlock](https://www.cs.yale.edu/homes/aspnes/pinewiki/Deadlock.html)
- [University of Wisconsin CS 537 Notes：Deadlock](https://pages.cs.wisc.edu/~bart/537/lecturenotes/s12.html)
- [Oracle Java Tutorials：Deadlock](https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html)
- [Oracle JDK API：ReentrantLock](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle JDK API：ThreadMXBean](https://docs.oracle.com/javase/8/docs/api/java/lang/management/ThreadMXBean.html)
- [Oracle Troubleshooting Guide：The jstack Utility](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr016.html)
- [Oracle Java Documentation：Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Linux Kernel Documentation：Runtime locking correctness validator](https://docs.kernel.org/locking/lockdep-design.html)
- [PostgreSQL Documentation：Lock Management](https://www.postgresql.org/docs/current/runtime-config-locks.html)
- [PostgreSQL Documentation：Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- [PostgreSQL Documentation：pg_locks](https://www.postgresql.org/docs/current/view-pg-locks.html)
- [MySQL 8.4 Reference Manual：Deadlock Detection](https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlock-detection.html)
- [MySQL 8.4 Reference Manual：InnoDB Error Handling](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html)
