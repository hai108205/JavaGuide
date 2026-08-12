---
title: Phân tích mã nguồn ArrayBlockingQueue
description: Phân tích chuyên sâu mã nguồn ArrayBlockingQueue: giải thích chi tiết về triển khai hàng đợi chặn có giới hạn (bounded blocking queue), ứng dụng mô hình Producer-Consumer, kiểm soát đồng thời bằng ReentrantLock + Condition, cơ chế hàng đợi công việc của ThreadPool.
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: ArrayBlockingQueue源码,阻塞队列,有界队列,生产者消费者模式,ReentrantLock,Condition,线程池工作队列
---

## Giới thiệu về BlockingQueue

### Lịch sử của BlockingQueue

Lịch sử của BlockingQueue trong Java có thể bắt nguồn từ phiên bản JDK 1.5, khi nền tảng Java bổ sung gói `java.util.concurrent`, tức gói JUC mà chúng ta thường gọi, bao gồm nhiều công cụ kiểm soát luồng đồng thời, container đồng thời, lớp nguyên tử (atomic), v.v. Trong đó đương nhiên cũng bao gồm BlockingQueue mà chúng ta thảo luận trong bài viết này.

Để giải quyết vấn đề chia sẻ dữ liệu giữa các thread trong các tình huống đồng thời cao (high concurrency), JDK 1.5 đã giới thiệu `ArrayBlockingQueue` và `LinkedBlockingQueue`, đây là các container đồng thời được triển khai theo mô hình Producer-Consumer. Trong đó, `ArrayBlockingQueue` là hàng đợi có giới hạn (bounded queue), tức là khi số phần tử được thêm vào đạt đến giới hạn trên, việc thêm tiếp sẽ bị chặn (block) hoặc ném ra ngoại lệ. Còn `LinkedBlockingQueue` là hàng đợi được tạo thành từ danh sách liên kết (linked list), chính vì đặc tính của linked list mà `LinkedBlockingQueue` không có nhiều ràng buộc như `ArrayBlockingQueue` khi thêm phần tử, do đó việc thiết lập hàng đợi có giới hạn hay không là tùy chọn (lưu ý rằng "không giới hạn" ở đây không có nghĩa là có thể thêm số lượng phần tử tùy ý, mà là kích thước hàng đợi mặc định là `Integer.MAX_VALUE`, gần như vô hạn).

`SynchronousQueue` và `DelayQueue` cũng được giới thiệu trong JDK 1.5, JDK 1.7 bổ sung thêm interface `TransferQueue` hỗ trợ thao tác truyền dữ liệu.

### Tư tưởng của BlockingQueue

BlockingQueue chính là mô hình Producer-Consumer điển hình, nó có thể thực hiện những điều sau:

1. Khi dữ liệu trong BlockingQueue rỗng, tất cả các consumer thread sẽ bị chặn, chờ hàng đợi không rỗng (non-empty).
2. Khi producer đưa dữ liệu vào hàng đợi, hàng đợi sẽ thông báo cho consumer rằng hàng đợi không rỗng, lúc này consumer có thể vào tiêu thụ.
3. Khi BlockingQueue bị đầy do consumer tiêu thụ quá chậm hoặc producer thêm phần tử quá nhanh khiến không thể chứa thêm phần tử mới, producer sẽ bị chặn, chờ hàng đợi không đầy (non-full) để tiếp tục thêm phần tử.
4. Khi consumer tiêu thụ một phần tử từ hàng đợi, hàng đợi sẽ thông báo cho producer rằng hàng đợi không đầy, producer có thể tiếp tục đưa dữ liệu vào.

Tóm lại: BlockingQueue dựa trên hai điều kiện non-empty và non-full để thực hiện tương tác giữa producer và consumer. Mặc dù các luồng tương tác và cơ chế wait-notify này rất phức tạp, nhưng may mắn thay dưới bàn tay của Doug Lea, các chi tiết của BlockingQueue đã được che giấu, chúng ta chỉ cần gọi các API như `put`, `take`, `offer`, `poll` là có thể thực hiện sản xuất và tiêu thụ giữa các thread.

Điều này cũng khiến BlockingQueue được sử dụng rộng rãi trong phát triển đa luồng, ví dụ phổ biến nhất không gì khác ngoài ThreadPool của chúng ta. Từ mã nguồn, chúng ta có thể thấy khi core thread không thể xử lý kịp các task, những task này sẽ được ném vào `workQueue`.

```java
public ThreadPoolExecutor(int corePoolSize,
                            int maximumPoolSize,
                            long keepAliveTime,
                            TimeUnit unit,
                            BlockingQueue<Runnable> workQueue,
                            ThreadFactory threadFactory,
                            RejectedExecutionHandler handler) {// ...}
```

## Các phương thức phổ biến của ArrayBlockingQueue và kiểm thử

Sau khi đã hiểu sơ lược về lịch sử của BlockingQueue, chúng ta bắt đầu tập trung thảo luận về container đồng thời mà bài viết này muốn giới thiệu — `ArrayBlockingQueue`. Để hiểu sâu hơn về `ArrayBlockingQueue` sau này, chúng ta hãy dựa vào một vài ví dụ dưới đây để tìm hiểu cách sử dụng `ArrayBlockingQueue`.

Hãy xem ví dụ đầu tiên, ở đây chúng ta sẽ dùng hai thread để mô phỏng producer và consumer. Producer sau khi sản xuất sẽ dùng phương thức `put` để sản xuất 10 phần tử cho consumer tiêu thụ. Khi số phần tử trong hàng đợi đạt đến giới hạn trên là 5 mà chúng ta đã thiết lập, phương thức `put` sẽ bị chặn.
Tương tự, consumer cũng sẽ tiêu thụ phần tử thông qua phương thức `take`, khi hàng đợi rỗng, phương thức `take` sẽ chặn consumer thread. Ở đây để đảm bảo consumer có thể thoát kịp thời sau khi tiêu thụ hết 10 phần tử, tác giả sử dụng CountDownLatch để kiểm soát việc kết thúc của consumer. Producer ở đây chỉ sản xuất 10 phần tử. Khi consumer tiêu thụ xong 10 phần tử, CountDownLatch được kích hoạt, tất cả các thread sẽ dừng lại.

```java
public class ProducerConsumerExample {

    public static void main(String[] args) throws InterruptedException {

        // 创建一个大小为 5 的 ArrayBlockingQueue
        ArrayBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);

        // 创建生产者线程
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    // 向队列中添加元素，如果队列已满则阻塞等待
                    queue.put(i);
                    System.out.println("生产者添加元素：" + i);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        });

        CountDownLatch countDownLatch = new CountDownLatch(1);

        // 创建消费者线程
        Thread consumer = new Thread(() -> {
            try {
                int count = 0;
                while (true) {

                    // 从队列中取出元素，如果队列为空则阻塞等待
                    int element = queue.take();
                    System.out.println("消费者取出元素：" + element);
                    ++count;
                    if (count == 10) {
                        break;
                    }
                }

                countDownLatch.countDown();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        });

        // 启动线程
        producer.start();
        consumer.start();

        // 等待线程结束
        producer.join();
        consumer.join();

        countDownLatch.await();

        producer.interrupt();
        consumer.interrupt();
    }

}
```

Kết quả đầu ra của đoạn mã như sau, có thể thấy chỉ khi producer đưa phần tử vào hàng đợi thì consumer mới có thể tiêu thụ, điều này có nghĩa là khi hàng đợi không có dữ liệu, consumer sẽ bị chặn, chờ hàng đợi không rỗng rồi mới tiếp tục tiêu thụ.

```cpp
生产者添加元素：1
生产者添加元素：2
消费者取出元素：1
消费者取出元素：2
生产者添加元素：3
消费者取出元素：3
生产者添加元素：4
生产者添加元素：5
消费者取出元素：4
生产者添加元素：6
消费者取出元素：5
生产者添加元素：7
生产者添加元素：8
生产者添加元素：9
生产者添加元素：10
消费者取出元素：6
消费者取出元素：7
消费者取出元素：8
消费者取出元素：9
消费者取出元素：10
```

Sau khi đã hiểu hai phương thức `put` và `take` — các phương thức thêm và lấy có tính chặn, chúng ta hãy tiếp tục xem xét các phương thức thêm và lấy không chặn (non-blocking) trong BlockingQueue là `offer` và `poll`.

Như dưới đây, chúng ta thiết lập một BlockingQueue có kích thước là 3, chúng ta sẽ thử dùng phương thức `offer` để thêm 4 phần tử vào hàng đợi, sau đó dùng `poll` để thử lấy 4 lần từ hàng đợi.

```cpp
public class OfferPollExample {

    public static void main(String[] args) {
        // 创建一个大小为 3 的 ArrayBlockingQueue
        ArrayBlockingQueue<String> queue = new ArrayBlockingQueue<>(3);

        // 向队列中添加元素
        System.out.println(queue.offer("A"));
        System.out.println(queue.offer("B"));
        System.out.println(queue.offer("C"));

        // 尝试向队列中添加元素，但队列已满，返回 false
        System.out.println(queue.offer("D"));

        // 从队列中取出元素
        System.out.println(queue.poll());
        System.out.println(queue.poll());
        System.out.println(queue.poll());

        // 尝试从队列中取出元素，但队列已空，返回 null
        System.out.println(queue.poll());
    }

}
```

Kết quả đầu ra cuối cùng của đoạn mã như sau, có thể thấy vì kích thước hàng đợi là 3, nên 3 lần thêm đầu tiên vào hàng đợi có kết quả là `true`, lần thêm thứ 4, do hàng đợi đã đầy, nên kết quả thêm trả về `false`. Đây cũng là lý do tại sao phương thức `poll` sau đó chỉ lấy được giá trị của 3 phần tử.

```cpp
true
true
true
false
A
B
C
null
```

Sau khi đã hiểu về thêm/lấy có chặn và không chặn, chúng ta hãy xem xét một thao tác khá đặc biệt của BlockingQueue. Trong một số tình huống, chúng ta muốn có thể chuyển toàn bộ kết quả của BlockingQueue vào một list để thực hiện thao tác hàng loạt, chúng ta có thể sử dụng phương thức `drainTo` của BlockingQueue. Phương thức này sẽ chuyển toàn bộ phần tử trong hàng đợi vào list trong một lần. Nếu hàng đợi có phần tử và chuyển thành công vào list, `drainTo` sẽ trả về số lượng phần tử đã chuyển vào list trong lần này; ngược lại nếu hàng đợi rỗng, `drainTo` sẽ trả về trực tiếp 0.

```java
public class DrainToExample {

    public static void main(String[] args) {
        // 创建一个大小为 5 的 ArrayBlockingQueue
        ArrayBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);

        // 向队列中添加元素
        queue.add(1);
        queue.add(2);
        queue.add(3);
        queue.add(4);
        queue.add(5);

        // 创建一个 List，用于存储从队列中取出的元素
        List<Integer> list = new ArrayList<>();

        // 从队列中取出所有元素，并添加到 List 中
        queue.drainTo(list);

        // 输出 List 中的元素
        System.out.println(list);
    }

}
```

Kết quả đầu ra của đoạn mã như sau:

```cpp
[1, 2, 3, 4, 5]
```

## Phân tích mã nguồn ArrayBlockingQueue

Sau khi đã có ấn tượng cơ bản về cách sử dụng BlockingQueue, chúng ta có thể tiếp tục tìm hiểu sâu hơn về cơ chế hoạt động của `ArrayBlockingQueue`.

### Thiết kế tổng thể

Trước khi tìm hiểu chi tiết cụ thể của `ArrayBlockingQueue`, chúng ta hãy xem sơ đồ lớp (class diagram) của `ArrayBlockingQueue`.

![ArrayBlockingQueue 类图](https://oss.javaguide.cn/github/javaguide/java/collection/arrayblockingqueue-class-diagram.png)

Từ sơ đồ, chúng ta có thể thấy `ArrayBlockingQueue` triển khai interface `BlockingQueue`, không khó để đoán rằng thông qua việc triển khai interface `BlockingQueue`, `ArrayBlockingQueue` đã có được những hành vi thao tác phổ biến của BlockingQueue.

Đồng thời, `ArrayBlockingQueue` còn kế thừa abstract class `AbstractQueue`, abstract class này kế thừa `AbstractCollection` và `Queue`. Từ đặc tính và ngữ nghĩa của abstract class, chúng ta cũng có thể đoán rằng mối quan hệ kế thừa này khiến `ArrayBlockingQueue` có được các thao tác phổ biến của hàng đợi.

Vậy chúng ta có thể rút ra kết luận như sau: thông qua việc kế thừa `AbstractQueue` để có được tất cả các khuôn mẫu thao tác của hàng đợi, tức là khung tổng thể của các thao tác thêm vào (enqueue) và lấy ra (dequeue). Sau đó, `ArrayBlockingQueue` thông qua việc triển khai `BlockingQueue` để có được các thao tác phổ biến của BlockingQueue và triển khai các thao tác này, lấp đầy vào các chi tiết của phương thức khuôn mẫu trong `AbstractQueue`, từ đó `ArrayBlockingQueue` trở thành một BlockingQueue hoàn chỉnh.

Để xác minh điều này, chúng ta hãy đi sâu vào mã nguồn. Trước tiên, hãy xem `AbstractQueue`. Từ mối quan hệ kế thừa của lớp, chúng ta có thể đại khái suy ra rằng nó có được các phương thức thao tác tập hợp phổ biến thông qua `AbstractCollection`, sau đó có được đặc tính của hàng đợi thông qua interface `Queue`.

```java
public abstract class AbstractQueue<E>
    extends AbstractCollection<E>
    implements Queue<E> {
       //...
}
```

Đối với các thao tác trên tập hợp, không gì khác ngoài thêm, xóa, sửa, tra cứu, vì vậy chúng ta hãy bắt đầu từ phương thức thêm. Từ mã nguồn, chúng ta có thể thấy nó triển khai phương thức `add` của `AbstractCollection`, logic bên trong như sau:

1. Gọi phương thức `offer` có được từ việc kế thừa interface `Queue`, nếu `offer` thành công thì trả về `true`.
2. Nếu `offer` thất bại, tức là phần tử hiện tại không thể thêm vào hàng đợi, thì ném thẳng ngoại lệ.

```java
public boolean add(E e) {
  if (offer(e))
      return true;
  else
      throw new IllegalStateException("Queue full");
}
```

Và trong `AbstractQueue` không có phần triển khai của `offer` từ `Queue`, rõ ràng mục đích của việc này là định nghĩa logic cốt lõi của `add`, giao chi tiết của `offer` cho lớp con của nó, tức là `ArrayBlockingQueue` của chúng ta, triển khai.

Đến đây, phân tích của chúng ta về abstract class `AbstractQueue` kết thúc. Chúng ta tiếp tục xem xét một interface quan trọng khác mà `ArrayBlockingQueue` triển khai: `BlockingQueue`.

Khi mở `BlockingQueue`, chúng ta có thể thấy interface này cũng kế thừa interface `Queue`, điều này có nghĩa là nó cũng có tất cả các hành vi mà hàng đợi sở hữu. Đồng thời, nó còn định nghĩa các phương thức mà mình cần triển khai.

```java
public interface BlockingQueue<E> extends Queue<E> {

     //元素入队成功返回true，反之则会抛出异常IllegalStateException
    boolean add(E e);

     //元素入队成功返回true，反之返回false
    boolean offer(E e);

     //元素入队成功则直接返回，如果队列已满元素不可入队则将线程阻塞，因为阻塞期间可能会被打断，所以这里方法签名抛出了InterruptedException
    void put(E e) throws InterruptedException;

   //和上一个方法一样,只不过队列满时只会阻塞单位为unit，时间为timeout的时长，如果在等待时长内没有入队成功则直接返回false。
    boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException;

    //从队头取出一个元素，如果队列为空则阻塞等待，因为会阻塞线程的缘故，所以该方法可能会被打断，所以签名定义了InterruptedException
    E take() throws InterruptedException;

      //取出队头的元素并返回，如果当前队列为空则阻塞等待timeout且单位为unit的时长，如果这个时间段没有元素则直接返回null。
    E poll(long timeout, TimeUnit unit)
        throws InterruptedException;

      //获取队列剩余元素个数
    int remainingCapacity();

     //删除我们指定的对象，如果成功返回true，反之返回false。
    boolean remove(Object o);

    //判断队列中是否包含指定元素
    public boolean contains(Object o);

     //将队列中的元素全部存到指定的集合中
    int drainTo(Collection<? super E> c);

    //转移maxElements个元素到集合中
    int drainTo(Collection<? super E> c, int maxElements);
}
```

Sau khi hiểu các thao tác phổ biến của `BlockingQueue`, chúng ta biết rằng `ArrayBlockingQueue` triển khai và ghi đè các phương thức của `BlockingQueue`, lấp đầy vào các phương thức của `AbstractQueue`. Từ đó, chúng ta biết được phương thức `offer` trong phương thức `add` của `AbstractQueue` được triển khai ở đâu.

```java
public boolean add(E e) {
  //AbstractQueue的offer来自下层的ArrayBlockingQueue从BlockingQueue实现并重写的offer方法
  if (offer(e))
      return true;
  else
      throw new IllegalStateException("Queue full");
}
```

### Khởi tạo

Trước khi tìm hiểu chi tiết của `ArrayBlockingQueue`, chúng ta hãy xem qua constructor của nó để hiểu quá trình khởi tạo. Từ mã nguồn, chúng ta có thể thấy `ArrayBlockingQueue` có 3 constructor, và constructor cốt lõi nhất chính là constructor dưới đây.

```java
// capacity 表示队列初始容量，fair 表示 锁的公平性
public ArrayBlockingQueue(int capacity, boolean fair) {
  //如果设置的队列大小小于0，则直接抛出IllegalArgumentException
  if (capacity <= 0)
      throw new IllegalArgumentException();
  //初始化一个数组用于存放队列的元素
  this.items = new Object[capacity];
  //创建阻塞队列流程控制的锁
  lock = new ReentrantLock(fair);
  //用lock锁创建两个条件控制队列生产和消费
  notEmpty = lock.newCondition();
  notFull =  lock.newCondition();
}
```

Trong constructor này có hai biến thành viên khá cốt lõi là `notEmpty` (non-empty) và `notFull` (non-full), cần chúng ta đặc biệt lưu ý. Chúng là chìa khóa để thực hiện việc producer và consumer làm việc có trật tự. Điểm này tác giả sẽ giải thích chi tiết trong phần phân tích mã nguồn sau, ở đây chúng ta chỉ cần hiểu sơ bộ về cấu trúc của BlockingQueue là được.

Hai constructor còn lại đều dựa trên constructor ở trên. Theo mặc định, chúng ta sẽ sử dụng constructor dưới đây, constructor này có nghĩa là `ArrayBlockingQueue` sử dụng non-fair lock (khóa không công bằng), tức là sau khi các producer hoặc consumer thread nhận được thông báo, việc tranh giành khóa là ngẫu nhiên.

```java
 public ArrayBlockingQueue(int capacity) {
        this(capacity, false);
    }
```

Còn có một constructor không thường được sử dụng, sau khi khởi tạo capacity và tính không công bằng của khóa, nó còn cung cấp một tham số `Collection`. Từ mã nguồn, không khó để thấy constructor này là để thêm trực tiếp các phần tử của collection được truyền từ bên ngoài vào BlockingQueue ngay khi khởi tạo.

```java
public ArrayBlockingQueue(int capacity, boolean fair,
                              Collection<? extends E> c) {
  //初始化容量和锁的公平性
  this(capacity, fair);

  final ReentrantLock lock = this.lock;
  //上锁并将c中的元素存放到ArrayBlockingQueue底层的数组中
  lock.lock();
  try {
      int i = 0;
      try {
                //遍历并添加元素到数组中
          for (E e : c) {
              checkNotNull(e);
              items[i++] = e;
          }
      } catch (ArrayIndexOutOfBoundsException ex) {
          throw new IllegalArgumentException();
      }
      //记录当前队列容量
      count = i;
                      //更新下一次put或者offer或用add方法添加到队列底层数组的位置
      putIndex = (i == capacity) ? 0 : i;
  } finally {
      //完成遍历后释放锁
      lock.unlock();
  }
}
```

### Thêm và lấy phần tử theo kiểu chặn (blocking)

Các phương thức thêm và lấy phần tử kiểu chặn của `ArrayBlockingQueue` tương ứng với mô hình Producer-Consumer. Mặc dù nó cũng hỗ trợ thêm và lấy phần tử kiểu không chặn (ví dụ như phương thức `poll()` và `offer(E e)`, sẽ được giới thiệu sau), nhưng thường thì không được sử dụng.

Các phương thức thêm và lấy phần tử kiểu chặn của `ArrayBlockingQueue` là:

- `put(E e)`: Chèn phần tử vào hàng đợi. Nếu hàng đợi đã đầy, phương thức sẽ bị chặn cho đến khi hàng đợi có không gian trống hoặc thread bị ngắt (interrupted).
- `take()`: Lấy và xóa phần tử ở đầu hàng đợi. Nếu hàng đợi rỗng, phương thức sẽ bị chặn cho đến khi hàng đợi không rỗng hoặc thread bị ngắt.

Chìa khóa để triển khai hai phương thức này nằm ở hai đối tượng điều kiện `notEmpty` (non-empty) và `notFull` (non-full), điều này chúng ta đã đề cập trong phần constructor ở trên.

Tiếp theo, tác giả sẽ dùng hai hình ảnh để giúp mọi người hiểu cách hai điều kiện này được vận dụng trong BlockingQueue.

![ArrayBlockingQueue 非空条件](https://oss.javaguide.cn/github/javaguide/java/collection/ArrayBlockingQueue-notEmpty-take.png)

Giả sử trong mã của chúng ta, consumer khởi động trước. Khi nó phát hiện hàng đợi không có dữ liệu, điều kiện non-empty sẽ treo (suspend) thread này, tức là chờ cho đến khi điều kiện non-empty được thỏa mãn. Sau đó CPU chuyển quyền thực thi cho producer, producer phát hiện hàng đợi có thể chứa dữ liệu, bèn đưa dữ liệu vào, thông báo rằng lúc này điều kiện non-empty đã được thỏa mãn. Lúc này consumer sẽ được đánh thức và vào hàng đợi để sử dụng các phương thức như `take` để lấy giá trị.

![ArrayBlockingQueue 非满条件](https://oss.javaguide.cn/github/javaguide/java/collection/ArrayBlockingQueue-notFull-put.png)

Trong quá trình thực thi tiếp theo, tốc độ sản xuất của producer nhanh hơn rất nhiều so với tốc độ tiêu thụ của consumer. Thế là producer nhét đầy hàng đợi và sau đó lại cố gắng thêm dữ liệu vào hàng đợi, phát hiện hàng đợi đã đầy. Lúc này BlockingQueue sẽ treo thread hiện tại, chờ điều kiện non-full. Sau đó consumer nắm quyền thực thi CPU để tiêu thụ, hàng đợi có thể chứa dữ liệu mới, phát ra một thông báo non-full. Lúc này producer đang bị treo sẽ chờ khi có quyền thực thi CPU thì thử lại việc thêm dữ liệu vào hàng đợi.

Sau khi đã hiểu sơ lược về luồng tương tác dựa trên hai điều kiện của BlockingQueue, chúng ta hãy xem mã nguồn của phương thức `put` và `take`.

```java
public void put(E e) throws InterruptedException {
    //确保插入的元素不为null
    checkNotNull(e);
    //加锁
    final ReentrantLock lock = this.lock;
    //这里使用lockInterruptibly()方法而不是lock()方法是为了能够响应中断操作，如果在等待获取锁的过程中被打断则该方法会抛出InterruptedException异常。
    lock.lockInterruptibly();
    try {
            //如果count等数组长度则说明队列已满，当前线程将被挂起放到AQS队列中，等待队列非满时插入（非满条件）。
       //在等待期间，锁会被释放，其他线程可以继续对队列进行操作。
        while (count == items.length)
            notFull.await();
           //如果队列可以存放元素，则调用enqueue将元素入队
        enqueue(e);
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

Phương thức `put` gọi nội bộ phương thức `enqueue` để thực hiện việc thêm phần tử vào hàng đợi. Chúng ta hãy tiếp tục đi sâu vào chi tiết triển khai của phương thức `enqueue`:

```java
private void enqueue(E x) {
   //获取队列底层的数组
    final Object[] items = this.items;
    //将putindex位置的值设置为我们传入的x
    items[putIndex] = x;
    //更新putindex，如果putindex等于数组长度，则更新为0
    if (++putIndex == items.length)
        putIndex = 0;
    //队列长度+1
    count++;
    //通知队列非空，那些因为获取元素而阻塞的线程可以继续工作了
    notEmpty.signal();
}
```

Từ mã nguồn, có thể thấy logic của thao tác thêm vào hàng đợi là thêm một phần tử mới vào mảng. Các bước thực thi tổng thể là:

1. Lấy mảng `items` bên dưới của `ArrayBlockingQueue`.
2. Lưu phần tử vào vị trí `putIndex`.
3. Cập nhật `putIndex` đến vị trí tiếp theo. Nếu `putIndex` bằng với độ dài hàng đợi, điều đó có nghĩa là `putIndex` đã đến cuối mảng, lần chèn tiếp theo cần bắt đầu từ 0. (`ArrayBlockingQueue` sử dụng tư tưởng của hàng đợi vòng (circular queue), tức là tái sử dụng một mảng theo vòng tròn từ đầu đến cuối.)
4. Cập nhật giá trị `count`, thể hiện độ dài hàng đợi hiện tại +1.
5. Gọi `notEmpty.signal()` để thông báo hàng đợi không rỗng, consumer có thể lấy giá trị từ hàng đợi.

Đến đây, chúng ta đã hiểu luồng của phương thức `put`. Để hiểu đầy đủ hơn về thiết kế mô hình Producer-Consumer của `ArrayBlockingQueue`, chúng ta tiếp tục xem xét phương thức `take` — phương thức lấy phần tử khỏi hàng đợi kiểu chặn.

```java
public E take() throws InterruptedException {
       //获取锁
     final ReentrantLock lock = this.lock;
     lock.lockInterruptibly();
     try {
             //如果队列中元素个数为0，则将当前线程打断并存入AQS队列中，等待队列非空时获取并移除元素（非空条件）
         while (count == 0)
             notEmpty.await();
            //如果队列不为空则调用dequeue获取元素
         return dequeue();
     } finally {
          //释放锁
         lock.unlock();
     }
}
```

Sau khi đã hiểu phương thức `put`, nhìn vào phương thức `take` sẽ rất đơn giản. Logic cốt lõi của nó ngược lại với phương thức `put`. Ví dụ, phương thức `put` khi hàng đợi đầy sẽ chờ điều kiện non-full để chèn phần tử (điều kiện non-full), còn phương thức `take` chờ điều kiện non-empty để lấy và xóa phần tử (điều kiện non-empty).

Phương thức `take` gọi nội bộ phương thức `dequeue` để thực hiện việc lấy phần tử ra khỏi hàng đợi. Logic cốt lõi của nó cũng ngược lại với phương thức `enqueue`.

```java
private E dequeue() {
  //获取阻塞队列底层的数组
  final Object[] items = this.items;
  @SuppressWarnings("unchecked")
  //从队列中获取takeIndex位置的元素
  E x = (E) items[takeIndex];
  //将takeIndex置空
  items[takeIndex] = null;
  //takeIndex向后挪动，如果等于数组长度则更新为0
  if (++takeIndex == items.length)
      takeIndex = 0;
  //队列长度减1
  count--;
  if (itrs != null)
      itrs.elementDequeued();
  //通知那些被打断的线程当前队列状态非满，可以继续存放元素
  notFull.signal();
  return x;
}
```

Vì các bước của phương thức `dequeue` (lấy ra) và phương thức `enqueue` (thêm vào) được giới thiệu ở trên về cơ bản là tương tự nhau, nên ở đây không lặp lại mô tả.

Để giúp dễ hiểu hơn, tác giả đã vẽ riêng một hình để minh họa cách hai đối tượng điều kiện `notEmpty` (non-empty) và `notFull` (non-full) kiểm soát việc thêm và lấy của `ArrayBlockingQueue`.

![ArrayBlockingQueue 非空非满](https://oss.javaguide.cn/github/javaguide/java/collection/ArrayBlockingQueue-notEmpty-notFull.png)

- **Consumer**: Khi consumer thực hiện thao tác `take` hoặc `poll` để lấy ra một phần tử từ hàng đợi, nó sẽ thông báo hàng đợi non-full. Lúc này, những producer đang chờ điều kiện non-full sẽ được đánh thức và chờ lấy CPU time slice để thực hiện thao tác thêm vào.
- **Producer**: Khi producer thêm phần tử vào hàng đợi, nó sẽ kích hoạt thông báo hàng đợi non-empty. Lúc này, consumer sẽ được đánh thức và chờ CPU time slice để thử lấy phần tử. Cứ như vậy lặp đi lặp lại, hai đối tượng điều kiện tạo thành một vòng lặp, kiểm soát việc thêm và lấy giữa các thread.

### Thêm và lấy phần tử theo kiểu không chặn (non-blocking)

Các phương thức thêm và lấy phần tử kiểu không chặn của `ArrayBlockingQueue` là:

- `offer(E e)`: Chèn phần tử vào cuối hàng đợi. Nếu hàng đợi đã đầy, phương thức sẽ trả về trực tiếp `false`, không chờ và không chặn thread.
- `poll()`: Lấy và xóa phần tử ở đầu hàng đợi. Nếu hàng đợi rỗng, phương thức sẽ trả về trực tiếp `null`, không chờ và không chặn thread.
- `add(E e)`: Chèn phần tử vào cuối hàng đợi. Nếu hàng đợi đã đầy sẽ ném ra ngoại lệ `IllegalStateException`, bên dưới dựa trên phương thức `offer(E e)`.
- `remove()`: Xóa phần tử ở đầu hàng đợi. Nếu hàng đợi rỗng sẽ ném ra ngoại lệ `NoSuchElementException`, bên dưới dựa trên phương thức `poll()`.
- `peek()`: Lấy nhưng không xóa phần tử ở đầu hàng đợi. Nếu hàng đợi rỗng, phương thức sẽ trả về trực tiếp `null`, không chờ và không chặn thread.

Trước tiên hãy xem phương thức `offer`. Logic tương tự như `put`, điểm khác biệt duy nhất là khi thêm vào thất bại, nó sẽ không chặn thread hiện tại mà trả về trực tiếp `false`.

```java
public boolean offer(E e) {
        //确保插入的元素不为null
        checkNotNull(e);
        //获取锁
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
             //队列已满直接返回false
            if (count == items.length)
                return false;
            else {
                //反之将元素入队并直接返回true
                enqueue(e);
                return true;
            }
        } finally {
            //释放锁
            lock.unlock();
        }
    }
```

Phương thức `poll` cũng tương tự, khi lấy phần tử thất bại cũng trả về trực tiếp `null`, không chặn thread đang lấy phần tử.

```java
public E poll() {
        final ReentrantLock lock = this.lock;
        //上锁
        lock.lock();
        try {
            //如果队列为空直接返回null，反之出队返回元素值
            return (count == 0) ? null : dequeue();
        } finally {
            lock.unlock();
        }
    }
```

Phương thức `add` thực chất là một lớp bọc cho `offer`. Như đoạn mã dưới đây cho thấy, `add` sẽ gọi `offer` không có tham số thời gian, nếu thêm vào thất bại thì ném thẳng ngoại lệ.

```java
public boolean add(E e) {
        return super.add(e);
    }


public boolean add(E e) {
        //调用offer方法如果失败直接抛出异常
        if (offer(e))
            return true;
        else
            throw new IllegalStateException("Queue full");
    }
```

Phương thức `remove` cũng tương tự, gọi `poll`, nếu trả về `null` thì có nghĩa là hàng đợi không có phần tử, ném thẳng ngoại lệ.

```java
public E remove() {
        E x = poll();
        if (x != null)
            return x;
        else
            throw new NoSuchElementException();
    }
```

Logic của phương thức `peek()` cũng rất đơn giản, bên trong gọi phương thức `itemAt`.

```java
public E peek() {
        //加锁
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            //当队列为空时返回 null
            return itemAt(takeIndex);
        } finally {
            //释放锁
            lock.unlock();
        }
    }

//返回队列中指定位置的元素
@SuppressWarnings("unchecked")
final E itemAt(int i) {
    return (E) items[i];
}
```

### Thêm và lấy phần tử kiểu chặn với thời gian chờ (timeout) chỉ định

Trên cơ sở các phương thức thêm và lấy không chặn `offer(E e)` và `poll()`, nhà thiết kế đã cung cấp `offer(E e, long timeout, TimeUnit unit)` và `poll(long timeout, TimeUnit unit)` có tham số thời gian chờ, dùng để thêm và lấy phần tử kiểu chặn trong khoảng thời gian chờ được chỉ định.

```java
 public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {

        checkNotNull(e);
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
        //队列已满，进入循环
            while (count == items.length) {
            //时间到了队列还是满的，则直接返回false
                if (nanos <= 0)
                    return false;
                 //阻塞nanos时间，等待非满
                nanos = notFull.awaitNanos(nanos);
            }
            enqueue(e);
            return true;
        } finally {
            lock.unlock();
        }
    }
```

Có thể thấy, phương thức `offer` có tham số thời gian chờ trong trường hợp hàng đợi đã đầy sẽ chờ trong khoảng thời gian mà người dùng truyền vào. Nếu trong thời gian quy định vẫn không thể thêm phần tử, nó sẽ trả về trực tiếp `false`.

```java
public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
          //队列为空，循环等待，若时间到还是空的，则直接返回null
            while (count == 0) {
                if (nanos <= 0)
                    return null;
                nanos = notEmpty.awaitNanos(nanos);
            }
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
```

Tương tự, phương thức `poll` có tham số thời gian chờ cũng vậy. Nếu hàng đợi rỗng, nó sẽ chờ trong thời gian quy định. Nếu hết thời gian mà vẫn rỗng, nó sẽ trả về trực tiếp `null`.

### Kiểm tra phần tử có tồn tại hay không

`ArrayBlockingQueue` cung cấp `contains(Object o)` để kiểm tra xem phần tử chỉ định có tồn tại trong hàng đợi hay không.

```java
public boolean contains(Object o) {
    //若目标元素为空，则直接返回 false
    if (o == null) return false;
    //获取当前队列的元素数组
    final Object[] items = this.items;
    //加锁
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        // 如果队列非空
        if (count > 0) {
            final int putIndex = this.putIndex;
            //从队列头部开始遍历
            int i = takeIndex;
            do {
                if (o.equals(items[i]))
                    return true;
                if (++i == items.length)
                    i = 0;
            } while (i != putIndex);
        }
        return false;
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

## So sánh các phương thức thêm và lấy phần tử của ArrayBlockingQueue

Để giúp hiểu rõ hơn về `ArrayBlockingQueue`, chúng ta hãy so sánh lại các phương thức thêm và lấy phần tử đã đề cập ở trên.

Thêm phần tử:

| Phương thức                              | Cách xử lý khi hàng đợi đầy                                           | Giá trị trả về |
| ----------------------------------------- | -------------------------------------------------------------------- | ---------- |
| `put(E e)`                                | Thread bị chặn, cho đến khi bị ngắt hoặc được đánh thức               | void       |
| `offer(E e)`                              | Trả về trực tiếp `false`                                             | boolean    |
| `offer(E e, long timeout, TimeUnit unit)` | Chặn trong thời gian chờ chỉ định, vượt quá thời gian quy định mà vẫn chưa thêm thành công thì trả về `false` | boolean    |
| `add(E e)`                                | Ném trực tiếp ngoại lệ `IllegalStateException`                      | boolean    |

Lấy/Xóa phần tử:

| Phương thức                        | Cách xử lý khi hàng đợi rỗng                                       | Giá trị trả về |
| ----------------------------------- | ------------------------------------------------------------------- | ---------- |
| `take()`                            | Thread bị chặn, cho đến khi bị ngắt hoặc được đánh thức             | E          |
| `poll()`                            | Trả về `null`                                                       | E          |
| `poll(long timeout, TimeUnit unit)` | Chặn trong thời gian chờ chỉ định, vượt quá thời gian quy định mà vẫn rỗng thì trả về `null` | E          |
| `peek()`                            | Trả về `null`                                                       | E          |
| `remove()`                          | Ném trực tiếp ngoại lệ `NoSuchElementException`                    | boolean    |

![](https://oss.javaguide.cn/github/javaguide/java/collection/ArrayBlockingQueue-get-add-element-methods.png)

## Câu hỏi phỏng vấn liên quan đến ArrayBlockingQueue

### ArrayBlockingQueue là gì? Đặc điểm của nó là gì?

`ArrayBlockingQueue` là lớp triển khai hàng đợi có giới hạn (bounded queue) của interface `BlockingQueue`, thường được dùng để chia sẻ dữ liệu giữa các thread. Bên dưới sử dụng mảng (array) để triển khai, điều này có thể thấy ngay từ tên của nó.

Dung lượng của `ArrayBlockingQueue` là có giới hạn, một khi đã tạo ra thì dung lượng không thể thay đổi.

Để đảm bảo an toàn luồng (thread safety), cơ chế kiểm soát đồng thời của `ArrayBlockingQueue` sử dụng khóa tái nhập (ReentrantLock) `ReentrantLock`. Bất kể là thao tác chèn hay thao tác đọc, đều cần phải lấy được khóa mới có thể thực hiện. Hơn nữa, nó còn hỗ trợ hai cơ chế truy cập khóa là fair và non-fair, mặc định là non-fair lock.

`ArrayBlockingQueue` tuy có tên là BlockingQueue, nhưng cũng hỗ trợ thêm và lấy phần tử kiểu không chặn (ví dụ như phương thức `poll()` và `offer(E e)`). Khi hàng đợi đầy, `offer(E e)` sẽ trả về `false`; khi hàng đợi rỗng, `poll()` sẽ trả về `null`.

### ArrayBlockingQueue và LinkedBlockingQueue khác nhau như thế nào?

`ArrayBlockingQueue` và `LinkedBlockingQueue` là hai loại BlockingQueue thường dùng trong gói Java Concurrency, cả hai đều thread-safe. Tuy nhiên, giữa chúng cũng tồn tại những điểm khác biệt sau:

- Triển khai bên dưới: `ArrayBlockingQueue` dựa trên mảng (array), còn `LinkedBlockingQueue` dựa trên danh sách liên kết (linked list).
- Có giới hạn hay không: `ArrayBlockingQueue` là hàng đợi có giới hạn, phải chỉ định kích thước dung lượng khi tạo. `LinkedBlockingQueue` khi tạo có thể không chỉ định kích thước dung lượng, mặc định là `Integer.MAX_VALUE`, tức là không giới hạn (unbounded). Nhưng cũng có thể chỉ định kích thước hàng đợi, từ đó trở thành có giới hạn (bounded).
- Khóa có tách biệt hay không: Khóa trong `ArrayBlockingQueue` không được tách biệt, tức là sản xuất và tiêu thụ dùng chung một khóa; khóa trong `LinkedBlockingQueue` được tách biệt, tức là sản xuất dùng `putLock`, tiêu thụ dùng `takeLock`, điều này có thể ngăn chặn sự tranh giành khóa giữa producer thread và consumer thread.
- Chiếm dụng bộ nhớ: `ArrayBlockingQueue` cần phân bổ trước bộ nhớ mảng, còn `LinkedBlockingQueue` thì phân bổ động bộ nhớ cho các nút (node) của linked list. Điều này có nghĩa là, `ArrayBlockingQueue` khi tạo ra sẽ chiếm một lượng bộ nhớ nhất định, và thường thì bộ nhớ được cấp phát sẽ lớn hơn bộ nhớ thực tế sử dụng, còn `LinkedBlockingQueue` thì chiếm dụng bộ nhớ tăng dần theo sự gia tăng của phần tử.

### ArrayBlockingQueue và ConcurrentLinkedQueue khác nhau như thế nào?

`ArrayBlockingQueue` và `ConcurrentLinkedQueue` là hai loại queue thường dùng trong gói Java Concurrency, cả hai đều thread-safe. Tuy nhiên, giữa chúng cũng tồn tại những điểm khác biệt sau:

- Triển khai bên dưới: `ArrayBlockingQueue` dựa trên mảng (array), còn `ConcurrentLinkedQueue` dựa trên danh sách liên kết (linked list).
- Có giới hạn hay không: `ArrayBlockingQueue` là hàng đợi có giới hạn, phải chỉ định kích thước dung lượng khi tạo, còn `ConcurrentLinkedQueue` là hàng đợi không giới hạn (unbounded queue), có thể tăng dung lượng một cách động.
- Có chặn hay không: `ArrayBlockingQueue` hỗ trợ cả hai cách thêm và lấy phần tử kiểu chặn và không chặn (thường thì chỉ sử dụng cách thứ nhất), `ConcurrentLinkedQueue` là không giới hạn, chỉ hỗ trợ thêm và lấy phần tử kiểu không chặn.

### Nguyên lý triển khai của ArrayBlockingQueue là gì?

Nguyên lý triển khai của `ArrayBlockingQueue` chủ yếu được chia thành các điểm sau (ở đây lấy ví dụ thêm và lấy phần tử kiểu chặn):

- `ArrayBlockingQueue` duy trì bên trong một mảng có độ dài cố định để lưu trữ phần tử.
- Thông qua việc sử dụng đối tượng khóa `ReentrantLock` để đồng bộ hóa các thao tác đọc và ghi, tức là thông qua cơ chế khóa để đảm bảo thread safety.
- Thông qua `Condition` để thực hiện các thao tác chờ và đánh thức giữa các thread.

Ở đây xin giới thiệu chi tiết hơn về cách triển khai cụ thể của việc chờ và đánh thức giữa các thread (không cần nhớ phương thức cụ thể, trong phỏng vấn chỉ cần trả lời các điểm chính):

- Khi hàng đợi đã đầy, producer thread sẽ gọi phương thức `notFull.await()` để khiến producer chờ, chờ đến khi hàng đợi non-full thì chèn vào (điều kiện non-full).
- Khi hàng đợi rỗng, consumer thread sẽ gọi phương thức `notEmpty.await()` để khiến consumer chờ, chờ đến khi hàng đợi non-empty thì tiêu thụ (điều kiện non-empty).
- Khi có phần tử mới được thêm vào, producer thread sẽ gọi phương thức `notEmpty.signal()` để đánh thức consumer thread đang chờ tiêu thụ.
- Khi có phần tử bị lấy ra khỏi hàng đợi, consumer thread sẽ gọi phương thức `notFull.signal()` để đánh thức producer thread đang chờ chèn phần tử.

Bổ sung về interface `Condition`:

> `Condition` chỉ xuất hiện từ JDK 1.5 trở đi, nó có tính linh hoạt rất tốt, ví dụ như có thể thực hiện chức năng thông báo đa kênh (multi-way notification), tức là trong một đối tượng `Lock` có thể tạo nhiều instance `Condition` (tức là object monitor), **đối tượng thread có thể được đăng ký trong `Condition` được chỉ định, từ đó có thể thông báo thread một cách có chọn lọc, linh hoạt hơn trong việc lập lịch thread. Khi sử dụng phương thức `notify()/notifyAll()` để thông báo, thread được thông báo là do JVM chọn. Sử dụng lớp `ReentrantLock` kết hợp với instance `Condition` có thể thực hiện "thông báo có chọn lọc"** , chức năng này rất quan trọng và được interface `Condition` cung cấp mặc định. Còn từ khóa `synchronized` thì tương đương với việc trong toàn bộ đối tượng `Lock` chỉ có một instance `Condition`, tất cả các thread đều được đăng ký trên một instance đó. Nếu thực thi phương thức `notifyAll()` thì sẽ thông báo cho tất cả các thread đang ở trạng thái chờ, điều này sẽ gây ra vấn đề hiệu suất rất lớn. Còn phương thức `signalAll()` của instance `Condition` sẽ chỉ đánh thức tất cả các thread đang chờ đã được đăng ký trong instance `Condition` đó.

## Tài liệu tham khảo

- 深入理解 Java 系列 | BlockingQueue 用法详解：<https://juejin.cn/post/6999798721269465102>
- 深入浅出阻塞队列 BlockingQueue 及其典型实现 ArrayBlockingQueue：<https://zhuanlan.zhihu.com/p/539619957>
- 并发编程大扫盲：ArrayBlockingQueue 底层原理和实战：<https://zhuanlan.zhihu.com/p/339662987>
<!-- @include: @article-footer.snippet.md -->