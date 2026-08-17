---
title: Phân tích mã nguồn DelayQueue
description: "Phân tích chuyên sâu mã nguồn DelayQueue: giải thích chi tiết nguyên lý triển khai hàng đợi trễ, cách sử dụng interface Delayed, lập lịch tác vụ trễ, các kịch bản ứng dụng như hủy đơn hàng khi quá hạn, thiết kế thread-safe dựa trên PriorityQueue."
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: DelayQueue源码,延迟队列,Delayed接口,延时任务,定时任务,订单超时,PriorityQueue实现
---

## Giới thiệu về DelayQueue

`DelayQueue` là hàng đợi trễ (delay queue) được cung cấp bởi gói JUC (`java.util.concurrent`), dùng để triển khai các tác vụ trễ (delayed task) — ví dụ như tự động hủy đơn hàng sau 15 phút không thanh toán. Nó là một dạng của `BlockingQueue`, tầng dưới (underlying) là một hàng đợi không giới hạn (unbounded queue) được triển khai dựa trên `PriorityQueue`, và là thread-safe. Về `PriorityQueue`, bạn đọc có thể tham khảo bài viết của tác giả: [Phân tích mã nguồn PriorityQueue](./priorityqueue-source-code.md).

![BlockingQueue 的实现类](https://oss.javaguide.cn/github/javaguide/java/collection/blocking-queue-hierarchy.png)

Các phần tử được lưu trong `DelayQueue` phải triển khai interface `Delayed`, và cần ghi đè phương thức `getDelay()` (để tính toán xem đã đến hạn hay chưa).

```java
public interface Delayed extends Comparable<Delayed> {
    long getDelay(TimeUnit unit);
}
```

Theo mặc định, `DelayQueue` sẽ sắp xếp các tác vụ theo thứ tự tăng dần của thời gian đến hạn. Chỉ khi phần tử đã hết hạn (giá trị trả về của phương thức `getDelay()` nhỏ hơn hoặc bằng 0), nó mới có thể được lấy ra khỏi hàng đợi.

`DelayQueue` được giới thiệu lần đầu trong Java 5, là một hàng đợi chặn không giới hạn (unbounded blocking queue) và thread-safe.

## Ví dụ về các kịch bản sử dụng DelayQueue phổ biến

Ở đây chúng ta mong muốn các tác vụ trở thành trạng thái có thể lấy được (available) theo đúng độ trễ dự kiến. Ví dụ: gửi (submit) 3 tác vụ với độ trễ lần lượt là 1s, 2s, 3s — ngay cả khi thêm vào không theo thứ tự, tác vụ có độ trễ đến hạn sớm nhất cũng sẽ trở thành có thể lấy được sớm nhất.

![延迟任务](https://oss.javaguide.cn/github/javaguide/java/collection/delayed-task.png)

Để làm được điều này, chúng ta có thể sử dụng `DelayQueue`. Vì vậy, trước tiên cần kế thừa `Delayed` để triển khai `DelayedTask`, cài đặt phương thức `getDelay` và so sánh mức độ ưu tiên `compareTo`.

```java
/**
 * 延迟任务
 */
public class DelayedTask implements Delayed {
    /**
     * 任务到期时间
     */
    private long executeTime;
    /**
     * 任务
     */
    private Runnable task;

    public DelayedTask(long delay, Runnable task) {
        this.executeTime = System.currentTimeMillis() + delay;
        this.task = task;
    }

    /**
     * 查看当前任务还有多久到期
     * @param unit
     * @return
     */
    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(executeTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    /**
     * 延迟队列需要到期时间升序入队，所以我们需要实现compareTo进行到期时间比较
     * @param o
     * @return
     */
    @Override
    public int compareTo(Delayed o) {
        return Long.compare(this.executeTime, ((DelayedTask) o).executeTime);
    }

    public void execute() {
        task.run();
    }
}
```

Sau khi hoàn tất việc đóng gói (encapsulate) tác vụ, việc sử dụng trở nên rất đơn giản: thiết lập thời gian đến hạn rồi gửi tác vụ vào hàng đợi trễ là được.

```java
// 创建延迟队列，并添加任务
DelayQueue < DelayedTask > delayQueue = new DelayQueue < > ();

//分别添加1s、2s、3s到期的任务
delayQueue.add(new DelayedTask(2000, () -> System.out.println("Task 2")));
delayQueue.add(new DelayedTask(1000, () -> System.out.println("Task 1")));
delayQueue.add(new DelayedTask(3000, () -> System.out.println("Task 3")));

// 取出任务并执行
while (!delayQueue.isEmpty()) {
  //阻塞获取最先到期的任务
  DelayedTask task = delayQueue.take();
  if (task != null) {
    task.execute();
  }
}
```

Từ kết quả đầu ra có thể thấy, ngay cả khi tác giả thêm tác vụ 2s vào trước, tác vụ 1s (Task 1) vẫn được thực thi ưu tiên.

```java
Task 1
Task 2
Task 3
```

## Phân tích mã nguồn DelayQueue

Ở đây lấy JDK 1.8 làm ví dụ để phân tích mã nguồn lõi (core source code) tầng dưới của `DelayQueue`.

Định nghĩa lớp của `DelayQueue` như sau:

```java
public class DelayQueue<E extends Delayed> extends AbstractQueue<E> implements BlockingQueue<E>
{
  //...
}
```

`DelayQueue` kế thừa lớp `AbstractQueue` và triển khai interface `BlockingQueue`.

![DelayQueue类图](https://oss.javaguide.cn/github/javaguide/java/collection/delayqueue-class-diagram.png)

### Các biến thành viên cốt lõi

4 biến thành viên cốt lõi của `DelayQueue` như sau:

```java
//可重入锁，实现线程安全的关键
private final transient ReentrantLock lock = new ReentrantLock();
//延迟队列底层存储数据的集合,确保元素按照到期时间升序排列
private final PriorityQueue<E> q = new PriorityQueue<E>();

//指向准备执行优先级最高的线程
private Thread leader = null;
//实现多线程之间等待唤醒的交互
private final Condition available = lock.newCondition();
```

- `lock` : Như chúng ta đã biết, `DelayQueue` là thread-safe khi truy cập (access) phần tử, vì vậy để đảm bảo an toàn luồng khi thêm và lấy phần tử, chúng ta cần khóa (lock) khi thực hiện các thao tác này. `DelayQueue` sử dụng khóa độc quyền (exclusive lock) `ReentrantLock` để đảm bảo tính thread-safe của các thao tác truy cập.
- `q` : Hàng đợi trễ yêu cầu các phần tử được sắp xếp tăng dần theo thời gian đến hạn, vì vậy khi thêm phần tử nhất thiết phải sắp xếp theo mức độ ưu tiên. Do đó, việc truy cập phần tử ở tầng dưới của `DelayQueue` đều được quản lý thông qua biến thành viên `q` — một hàng đợi ưu tiên `PriorityQueue`.
- `leader` : Các tác vụ trong hàng đợi trễ chỉ được thực thi sau khi đến hạn. Đối với các tác vụ chưa đến hạn, chỉ có thể chờ đợi. Để đảm bảo tác vụ có mức ưu tiên cao nhất có thể được thực thi ngay khi đến hạn, nhà thiết kế đã sử dụng `leader` để quản lý các tác vụ trễ. Chỉ có luồng (thread) được `leader` trỏ tới mới có quyền chờ có thời hạn (timed wait) để tác vụ đến hạn và thực thi, trong khi các luồng có mức ưu tiên thấp hơn chỉ có thể chờ vô thời hạn (indefinite wait) cho đến khi luồng `leader` thực thi xong tác vụ trễ hiện tại và đánh thức (wake up) chúng.
- `available` : Tương tác chờ-đánh thức (wait-notify) được đề cập ở trên khi nói về luồng `leader` được thực hiện thông qua `available`. Giả sử luồng 1 cố gắng lấy tác vụ từ một `DelayQueue` rỗng, `available` sẽ đưa nó vào hàng đợi chờ (wait queue). Cho đến khi có một luồng thêm tác vụ trễ vào và gọi phương thức `signal` của `available` để đánh thức nó.

### Phương thức khởi tạo (Constructor)

So với các concurrent container khác, phương thức khởi tạo của hàng đợi trễ tương đối đơn giản — nó chỉ có hai constructor, bởi vì tất cả các biến thành viên đều đã được khởi tạo khi class được load. Do đó, constructor mặc định không làm gì cả. Ngoài ra còn có một constructor nhận tham số là đối tượng `Collection`, nó sẽ gọi phương thức `addAll()` để lưu các phần tử của collection vào hàng đợi ưu tiên `q`.

```java
public DelayQueue() {}

public DelayQueue(Collection<? extends E> c) {
    this.addAll(c);
}
```

### Thêm phần tử

Các phương thức thêm phần tử của `DelayQueue` — dù là `add`, `put` hay `offer` — về bản chất đều gọi đến `offer`. Vì vậy, để hiểu logic thêm phần tử của hàng đợi trễ, chúng ta chỉ cần đọc phương thức `offer`.

Logic tổng thể của phương thức `offer`:

1. Cố gắng lấy (acquire) `lock`.
2. Nếu khóa thành công, gọi phương thức `offer` của `q` để lưu phần tử vào hàng đợi ưu tiên.
3. Gọi phương thức `peek` để xem phần tử đầu hàng đợi (head) hiện tại có phải chính là phần tử vừa được thêm vào hay không. Nếu đúng, điều đó có nghĩa phần tử này là tác vụ sắp đến hạn (tức là phần tử có mức ưu tiên cao nhất). Khi đó, đặt `leader` thành `null` và thông báo cho các luồng đang bị chặn (blocked) do gọi `take` khi hàng đợi rỗng đến tranh giành (contend for) phần tử.
4. Sau khi các bước trên hoàn tất, giải phóng (release) `lock`.
5. Trả về true.

Mã nguồn như sau, tác giả đã chú thích chi tiết, bạn đọc có thể tự tham khảo:

```java
public boolean offer(E e) {
    //尝试获取lock
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        //如果上锁成功,则调q的offer方法将元素存放到优先队列中
        q.offer(e);
        //调用peek方法看看当前队首元素是否就是本次入队的元素,如果是则说明当前这个元素是即将到期的任务(即优先级最高的元素)
        if (q.peek() == e) {
            //将leader设置为空,通知调用取元素方法而阻塞的线程来争抢这个任务
            leader = null;
            available.signal();
        }
        return true;
    } finally {
        //上述步骤执行完成，释放lock
        lock.unlock();
    }
}
```

### Lấy phần tử

Các phương thức lấy phần tử trong `DelayQueue` được chia thành hai loại: blocking (chặn) và non-blocking (không chặn). Trước tiên, hãy xem phương thức lấy phần tử kiểu blocking — `take`, vốn có logic phức tạp hơn. Để giúp bạn đọc hình dung trực quan hơn về toàn bộ quy trình lấy phần tử kiểu blocking, tác giả sẽ lấy ví dụ 3 luồng (thread) đồng thời (concurrent) lấy phần tử để mô tả luồng hoạt động của `take`.

> Để hiểu được nội dung bên dưới, cần có kiến thức liên quan đến AQS. Bạn đọc nên tham khảo hai bài viết sau:
>
> - [图文讲解 AQS ，一起看看 AQS 的源码……(图文较长)](https://xie.infoq.cn/article/5a3cc0b709012d40cb9f41986)
> - [AQS 都看完了，Condition 原理可不能少！](https://xie.infoq.cn/article/0223d5e5f19726b36b084b10d)

1. Đầu tiên, 3 luồng sẽ cố gắng lấy (acquire) khóa tái nhập (reentrant lock) `lock`. Giả sử chúng ta có 3 luồng là t1, t2, t3. Sau đó t1 giành được khóa, còn t2 và t3 không giành được khóa, vì vậy hai luồng này bị đưa vào hàng đợi chờ (wait queue).

![](https://oss.javaguide.cn/github/javaguide/java/collection/delayqueue-take-0.png)

2. Tiếp theo, t1 bắt đầu thực hiện logic lấy phần tử.

3. Luồng t1 trước tiên sẽ kiểm tra xem phần tử đầu hàng đợi (head) của `DelayQueue` có rỗng hay không.

4. Nếu phần tử rỗng, điều đó có nghĩa hàng đợi hiện tại không có bất kỳ phần tử nào, vì vậy t1 sẽ bị chặn và đưa vào hàng đợi `conditionWaiter`.

![](https://oss.javaguide.cn/github/javaguide/java/collection/delayqueue-take-1.png)

Lưu ý, sau khi gọi `await`, t1 sẽ giải phóng khóa `lock`. Giả sử `DelayQueue` tiếp tục rỗng, thì t2 và t3 cũng sẽ thực hiện logic tương tự như t1 và đi vào hàng đợi `conditionWaiter`.

![](https://oss.javaguide.cn/github/javaguide/java/collection/delayqueue-take-2.png)

Nếu phần tử không rỗng, thì kiểm tra xem tác vụ hiện tại đã đến hạn hay chưa. Nếu phần tử đã đến hạn, trả về trực tiếp. Nếu phần tử chưa đến hạn, thì kiểm tra xem luồng `leader` (tham chiếu đến luồng duy nhất trong `DelayQueue` có thể chờ và lấy phần tử) hiện tại có rỗng hay không. Nếu không rỗng, điều đó có nghĩa `leader` hiện tại đang chờ thực thi một phần tử có mức ưu tiên cao hơn phần tử hiện tại, vì vậy luồng hiện tại t1 chỉ có thể gọi `await` để vào trạng thái chờ vô thời hạn, cho đến khi `leader` lấy được phần tử và đánh thức nó. Ngược lại, nếu luồng `leader` rỗng, thì đặt luồng hiện tại làm `leader` và vào trạng thái chờ có thời hạn (timed wait). Khi đến hạn, lấy phần tử ra và trả về.

Sau khi toàn bộ logic lấy phần tử kiểu blocking đã được trình bày xong, mã nguồn như sau, bạn đọc có thể tự tham khảo:

```java
public E take() throws InterruptedException {
    // 尝试获取可重入锁,将底层AQS的state设置为1,并设置为独占锁
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        for (;;) {
            //查看队列第一个元素
            E first = q.peek();
            //若为空,则将当前线程放入ConditionObject的等待队列中，并将底层AQS的state设置为0，表示释放锁并进入无限期等待
            if (first == null)
                available.await();
            else {
                //若元素不为空，则查看当前元素多久到期
                long delay = first.getDelay(NANOSECONDS);
                //如果小于0则说明已到期直接返回出去
                if (delay <= 0)
                    return q.poll();
                //如果大于0则说明任务还没到期，首先需要释放对这个元素的引用
                first = null; // don't retain ref while waiting
                //判断leader是否为空，如果不为空，则说明正有线程作为leader并等待一个任务到期，则当前线程进入无限期等待
                if (leader != null)
                    available.await();
                else {
                    //反之将我们的线程成为leader
                    Thread thisThread = Thread.currentThread();
                    leader = thisThread;
                    try {
                        //并进入有限期等待
                        available.awaitNanos(delay);
                    } finally {
                        //等待任务到期时，释放leader引用，进入下一次循环将任务return出去
                        if (leader == thisThread)
                            leader = null;
                    }
                }
            }
        }
    } finally {
        // 收尾逻辑:当leader为null，并且队列中有任务时，唤醒等待的获取元素的线程。
        if (leader == null && q.peek() != null)
            available.signal();
        //释放锁
        lock.unlock();
    }
}
```

Tiếp theo, hãy xem phương thức lấy phần tử kiểu non-blocking `poll`. Logic tương đối đơn giản, các bước tổng thể như sau:

1. Cố gắng lấy khóa tái nhập (reentrant lock).
2. Xem phần tử đầu hàng đợi, kiểm tra xem phần tử có rỗng hay không.
3. Nếu phần tử rỗng, hoặc phần tử chưa đến hạn, thì trả về null ngay lập tức.
4. Nếu phần tử không rỗng và đã đến hạn, gọi trực tiếp `poll` để trả về.
5. Giải phóng khóa tái nhập `lock`.

Mã nguồn như sau, bạn đọc có thể tự tham khảo mã nguồn và chú thích:

```java
public E poll() {
    //尝试获取可重入锁
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        //查看队列第一个元素,判断元素是否为空
        E first = q.peek();

        //若元素为空，或者元素未到期，则直接返回空
        if (first == null || first.getDelay(NANOSECONDS) > 0)
            return null;
        else
            //若元素不为空且到期了，直接调用poll返回出去
            return q.poll();
    } finally {
        //释放可重入锁lock
        lock.unlock();
    }
}
```

### Xem phần tử

Trong phần lấy phần tử ở trên, phương thức `peek` luôn được gọi đến. `peek` — đúng như tên gọi — chỉ đơn thuần là "liếc nhìn" (peek) phần tử trong hàng đợi. Các bước của nó chỉ gồm 4 bước:

1. Khóa (lock).
2. Gọi phương thức `peek` của hàng đợi ưu tiên `q` để xem phần tử tại vị trí chỉ mục 0.
3. Giải phóng khóa.
4. Trả về phần tử.

```java
public E peek() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return q.peek();
    } finally {
        lock.unlock();
    }
}
```

## Các câu hỏi phỏng vấn thường gặp về DelayQueue

### Nguyên lý triển khai của DelayQueue là gì?

`DelayQueue` sử dụng hàng đợi ưu tiên `PriorityQueue` ở tầng dưới để lưu trữ phần tử. `PriorityQueue` áp dụng tư tưởng của min-heap nhị phân (binary min-heap) để đảm bảo các phần tử có giá trị nhỏ hơn được xếp ở phía trước, điều này khiến cho việc quản lý mức độ ưu tiên của các tác vụ trễ trong `DelayQueue` trở nên rất thuận tiện. Đồng thời, để đảm bảo thread-safe, `DelayQueue` còn sử dụng khóa tái nhập `ReentrantLock`, đảm bảo tại mỗi đơn vị thời gian chỉ có một luồng có thể thao tác trên hàng đợi trễ. Cuối cùng, để đạt được hiệu quả tương tác chờ-đánh thức (wait-notify) giữa nhiều luồng, `DelayQueue` còn sử dụng `Condition`, thông qua các phương thức `await` và `signal` của `Condition` để hoàn thành việc chờ và đánh thức giữa các luồng.

### DelayQueue triển khai có thread-safe không?

`DelayQueue` được triển khai thread-safe. Nó sử dụng `ReentrantLock` để đạt được truy cập loại trừ lẫn nhau (mutual exclusion) và `Condition` để thực hiện các thao tác chờ và đánh thức giữa các luồng, đảm bảo tính an toàn và độ tin cậy trong môi trường đa luồng.

### Các kịch bản sử dụng của DelayQueue là gì?

`DelayQueue` thường được sử dụng trong các kịch bản như lập lịch tác vụ định thời (timed task scheduling) và xóa cache khi hết hạn. Trong lập lịch tác vụ định thời, các tác vụ cần thực thi được đóng gói thành các đối tượng tác vụ trễ (delayed task object) và thêm vào `DelayQueue`, phần tử đầu hàng đợi đã đến hạn có thể được lấy ra; thời điểm thực sự thực thi tác vụ còn phụ thuộc vào việc lập lịch của luồng tiêu thụ (consumer thread). Đối với kịch bản cache hết hạn, sau khi dữ liệu được cache vào bộ nhớ, chúng ta có thể đóng gói key của cache thành một tác vụ xóa trễ (delayed deletion task) và thêm vào `DelayQueue`. Khi dữ liệu hết hạn, lấy key của tác vụ này và xóa key đó khỏi bộ nhớ.

### Vai trò của interface Delayed trong DelayQueue là gì?

Interface `Delayed` định nghĩa thời gian trễ còn lại (remaining delay time) của phần tử (`getDelay`) và quy tắc so sánh giữa các phần tử (interface này kế thừa interface `Comparable`). Nếu muốn phần tử có thể được lưu vào `DelayQueue`, thì bắt buộc phải triển khai phương thức `getDelay()` và `compareTo()` của interface `Delayed`, nếu không `DelayQueue` sẽ không thể biết được thời gian còn lại của tác vụ hiện tại cũng như cách so sánh mức độ ưu tiên của các tác vụ.

### Sự khác biệt giữa DelayQueue và Timer/TimerTask là gì?

Cả `DelayQueue` và `Timer/TimerTask` đều có thể được sử dụng để triển khai lập lịch tác vụ định thời, nhưng cách triển khai của chúng khác nhau. `DelayQueue` dựa trên hàng đợi ưu tiên, chỉ chịu trách nhiệm lưu giữ các phần tử trễ và cho phép lấy ra khi đến hạn; trong khi `Timer/TimerTask` sử dụng một luồng nền (background thread) duy nhất để thực thi các tác vụ theo thứ tự — nếu một tác vụ thực thi quá lâu, nó sẽ ảnh hưởng đến việc thực thi của các tác vụ khác. Cả hai đều hỗ trợ thêm tác vụ trong thời gian chạy (runtime), nhưng `DelayQueue` còn có thể trực tiếp xóa bỏ các phần tử trễ bên trong nó.

## 参考文献

- 《深入理解高并发编程：JDK 核心技术》:
- 一口气说出 Java 6 种延时队列的实现方法（面试官也得服）:<https://www.jb51.net/article/186192.htm>
- 图解 DelayQueue 源码（java 8）——延时队列的小九九: <https://blog.csdn.net/every__day/article/details/113810985>
<!-- @include: @article-footer.snippet.md -->
