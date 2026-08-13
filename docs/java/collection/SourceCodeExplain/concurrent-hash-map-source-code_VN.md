---
title: Phân tích mã nguồn ConcurrentHashMap
description: "Phân tích chuyên sâu mã nguồn ConcurrentHashMap: so sánh cách triển khai Segment lock phân đoạn trong JDK 1.7 với CAS + Synchronized trong JDK 1.8, hiểu cơ chế thread-safe và tối ưu hiệu năng của Map trong môi trường đa luồng."
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: ConcurrentHashMap源码,线程安全Map,分段锁Segment,CAS操作,并发容器,JDK7与JDK8区别
---

> Bài viết này đến từ đóng góp của 末读代码：<https://mp.weixin.qq.com/s/AHWzboztt53ZfFZmsSnMSw>，JavaGuide đã cải tiến và chỉnh sửa đáng kể cho bài gốc.

Bài viết trước đã giới thiệu về mã nguồn của HashMap, nhận được phản hồi tốt và cũng có nhiều bạn chia sẻ quan điểm của mình. Lần này chúng ta tiếp tục với `ConcurrentHashMap` — một HashMap thread-safe được sử dụng rất phổ biến. Vậy cấu trúc lưu trữ và nguyên lý triển khai của nó như thế nào?

## 1. ConcurrentHashMap 1.7

### 1. Cấu trúc lưu trữ

![Java 7 ConcurrentHashMap 存储结构](https://oss.javaguide.cn/github/javaguide/java/collection/java7_concurrenthashmap.png)

Cấu trúc lưu trữ của `ConcurrentHashMap` trong Java 7 như hình trên. `ConcurrentHashMap` được tạo thành từ nhiều `Segment`, mỗi `Segment` là một cấu trúc tương tự như `HashMap`, do đó bên trong mỗi `HashMap` có thể tự mở rộng (resize). Tuy nhiên, số lượng `Segment` **không thể thay đổi sau khi khởi tạo**, mặc định là 16, do đó mặc định tối đa có 16 phân đoạn có thể đồng thời thực hiện thao tác cập nhật.

### 2. Khởi tạo

Thông qua constructor không tham số của `ConcurrentHashMap` để tìm hiểu quy trình khởi tạo.

```java
    /**
     * Creates a new, empty map with a default initial capacity (16),
     * load factor (0.75) and concurrencyLevel (16).
     */
    public ConcurrentHashMap() {
        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, DEFAULT_CONCURRENCY_LEVEL);
    }
```

Constructor không tham số gọi constructor có tham số, truyền vào ba giá trị mặc định.

```java
    /**
     * 默认初始化容量
     */
    static final int DEFAULT_INITIAL_CAPACITY = 16;

    /**
     * 默认负载因子
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /**
     * 默认并发级别
     */
    static final int DEFAULT_CONCURRENCY_LEVEL = 16;
```

Tiếp theo xem logic triển khai bên trong của constructor có tham số này.

```java
@SuppressWarnings("unchecked")
public ConcurrentHashMap(int initialCapacity,float loadFactor, int concurrencyLevel) {
    // 参数校验
    if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
        throw new IllegalArgumentException();
    // 校验并发级别大小，大于 1<<16，重置为 65536
    if (concurrencyLevel > MAX_SEGMENTS)
        concurrencyLevel = MAX_SEGMENTS;
    // Find power-of-two sizes best matching arguments
    // 2的多少次方
    int sshift = 0;
    int ssize = 1;
    // 这个循环可以找到 concurrencyLevel 之上最近的 2的次方值
    while (ssize < concurrencyLevel) {
        ++sshift;
        ssize <<= 1;
    }
    // 记录段偏移量
    this.segmentShift = 32 - sshift;
    // 记录段掩码
    this.segmentMask = ssize - 1;
    // 设置容量
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    // c = 容量 / ssize ，默认 16 / 16 = 1，这里是计算每个 Segment 中的类似于 HashMap 的容量
    int c = initialCapacity / ssize;
    if (c * ssize < initialCapacity)
        ++c;
    int cap = MIN_SEGMENT_TABLE_CAPACITY;
    //Segment 中的类似于 HashMap 的容量至少是2或者2的倍数
    while (cap < c)
        cap <<= 1;
    // create segments and segments[0]
    // 创建 Segment 数组，设置 segments[0]
    Segment<K,V> s0 = new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                         (HashEntry<K,V>[])new HashEntry[cap]);
    Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
    UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
    this.segments = ss;
}
```

Tóm tắt logic khởi tạo của ConcurrentHashMap trong Java 7.

1. Kiểm tra các tham số bắt buộc.
2. Kiểm tra kích thước `concurrencyLevel` (mức độ đồng thời), nếu lớn hơn giá trị tối đa thì đặt lại về giá trị tối đa. Constructor không tham số có **giá trị mặc định là 16.**
3. Tìm giá trị **lũy thừa của 2** gần nhất lớn hơn hoặc bằng `concurrencyLevel`, làm độ dài của mảng `segments`, **mặc định là 16**.
4. Ghi nhận giá trị offset `segmentShift`, giá trị này là **32 - sshift**, được dùng khi tính toán vị trí trong thao tác Put sau này, mặc định là 28.
5. Ghi nhận `segmentMask`, mặc định là ssize - 1 = 16 - 1 = 15.
6. **Khởi tạo `segments[0]`**, **kích thước mặc định là 2**, **load factor 0.75**, **ngưỡng mở rộng là 2\*0.75=1.5**, chỉ mở rộng khi chèn giá trị thứ hai.

### 3. put

Tiếp tục với các tham số khởi tạo ở trên, xem mã nguồn phương thức put.

```java
/**
 * Maps the specified key to the specified value in this table.
 * Neither the key nor the value can be null.
 *
 * <p> The value can be retrieved by calling the <tt>get</tt> method
 * with a key that is equal to the original key.
 *
 * @param key key with which the specified value is to be associated
 * @param value value to be associated with the specified key
 * @return the previous value associated with <tt>key</tt>, or
 *         <tt>null</tt> if there was no mapping for <tt>key</tt>
 * @throws NullPointerException if the specified key or value is null
 */
public V put(K key, V value) {
    Segment<K,V> s;
    if (value == null)
        throw new NullPointerException();
    int hash = hash(key);
    // hash 值无符号右移 28位（初始化时获得），然后与 segmentMask=15 做与运算
    // 其实也就是把高4位与segmentMask（1111）做与运算
    int j = (hash >>> segmentShift) & segmentMask;
    if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
         (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
        // 如果查找到的 Segment 为空，初始化
        s = ensureSegment(j);
    return s.put(key, hash, value, false);
}

/**
 * Returns the segment for the given index, creating it and
 * recording in segment table (via CAS) if not already present.
 *
 * @param k the index
 * @return the segment
 */
@SuppressWarnings("unchecked")
private Segment<K,V> ensureSegment(int k) {
    final Segment<K,V>[] ss = this.segments;
    long u = (k << SSHIFT) + SBASE; // raw offset
    Segment<K,V> seg;
    // 判断 u 位置的 Segment 是否为null
    if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {
        Segment<K,V> proto = ss[0]; // use segment 0 as prototype
        // 获取0号 segment 里的 HashEntry<K,V> 初始化长度
        int cap = proto.table.length;
        // 获取0号 segment 里的 hash 表里的扩容负载因子，所有的 segment 的 loadFactor 是相同的
        float lf = proto.loadFactor;
        // 计算扩容阀值
        int threshold = (int)(cap * lf);
        // 创建一个 cap 容量的 HashEntry 数组
        HashEntry<K,V>[] tab = (HashEntry<K,V>[])new HashEntry[cap];
        if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) { // recheck
            // 再次检查 u 位置的 Segment 是否为null，因为这时可能有其他线程进行了操作
            Segment<K,V> s = new Segment<K,V>(lf, threshold, tab);
            // 自旋检查 u 位置的 Segment 是否为null
            while ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))
                   == null) {
                // 使用CAS 赋值，只会成功一次
                if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))
                    break;
            }
        }
    }
    return seg;
}
```

Mã nguồn trên đã phân tích quy trình xử lý khi `ConcurrentHashMap` put một dữ liệu. Dưới đây là tóm tắt quy trình cụ thể.

1. Tính toán vị trí của key cần put, lấy `Segment` tại vị trí được chỉ định.

2. Nếu `Segment` tại vị trí đó là null, thì khởi tạo `Segment` này.

   **Quy trình khởi tạo Segment:**

   1. Kiểm tra `Segment` tại vị trí đã tính toán có null hay không.
   2. Nếu null thì tiếp tục khởi tạo, sử dụng capacity và load factor của `Segment[0]` để tạo một mảng `HashEntry`.
   3. Kiểm tra lại lần nữa `Segment` tại vị trí đã tính toán có null hay không.
   4. Sử dụng mảng `HashEntry` đã tạo để khởi tạo Segment này.
   5. Spin kiểm tra `Segment` tại vị trí đã tính toán có null hay không, sử dụng CAS để gán `Segment` tại vị trí này.

3. `Segment.put` chèn cặp key, value.

Ở trên đã tìm hiểu thao tác lấy `Segment` và khởi tạo `Segment`. Phương thức put của `Segment` ở dòng cuối cùng vẫn chưa được xem xét, tiếp tục phân tích.

```java
final V put(K key, int hash, V value, boolean onlyIfAbsent) {
    // 获取 ReentrantLock 独占锁，获取不到，scanAndLockForPut 获取。
    HashEntry<K,V> node = tryLock() ? null : scanAndLockForPut(key, hash, value);
    V oldValue;
    try {
        HashEntry<K,V>[] tab = table;
        // 计算要put的数据位置
        int index = (tab.length - 1) & hash;
        // CAS 获取 index 坐标的值
        HashEntry<K,V> first = entryAt(tab, index);
        for (HashEntry<K,V> e = first;;) {
            if (e != null) {
                // 检查是否 key 已经存在，如果存在，则遍历链表寻找位置，找到后替换 value
                K k;
                if ((k = e.key) == key ||
                    (e.hash == hash && key.equals(k))) {
                    oldValue = e.value;
                    if (!onlyIfAbsent) {
                        e.value = value;
                        ++modCount;
                    }
                    break;
                }
                e = e.next;
            }
            else {
                // first 有值没说明 index 位置已经有值了，有冲突，链表头插法。
                if (node != null)
                    node.setNext(first);
                else
                    node = new HashEntry<K,V>(hash, key, value, first);
                int c = count + 1;
                // 容量大于扩容阀值，小于最大容量，进行扩容
                if (c > threshold && tab.length < MAXIMUM_CAPACITY)
                    rehash(node);
                else
                    // index 位置赋值 node，node 可能是一个元素，也可能是一个链表的表头
                    setEntryAt(tab, index, node);
                ++modCount;
                count = c;
                oldValue = null;
                break;
            }
        }
    } finally {
        unlock();
    }
    return oldValue;
}
```

Do `Segment` kế thừa `ReentrantLock`, nên bên trong `Segment` có thể dễ dàng lấy lock, quy trình put đã sử dụng tính năng này.

1. `tryLock()` lấy lock, nếu không lấy được thì sử dụng phương thức **`scanAndLockForPut`** để tiếp tục lấy.

2. Tính toán vị trí index nơi dữ liệu put sẽ được đặt vào, sau đó lấy `HashEntry` tại vị trí này.

3. Duyệt để put phần tử mới. Tại sao cần duyệt? Vì `HashEntry` lấy được ở đây có thể là một phần tử rỗng, hoặc cũng có thể là một linked list đã tồn tại, do đó cần xử lý khác nhau.

   Nếu **`HashEntry`** tại vị trí này **không tồn tại**:

   1. Nếu capacity hiện tại lớn hơn ngưỡng mở rộng và nhỏ hơn capacity tối đa, **tiến hành mở rộng**.
   2. Chèn trực tiếp bằng phương pháp **head insertion (chèn vào đầu danh sách)**.

   Nếu **`HashEntry`** tại vị trí này **đã tồn tại**:

   1. Kiểm tra key và hash của phần tử hiện tại trong linked list có trùng với key và hash cần put hay không. Nếu trùng thì thay thế value.
   2. Nếu không trùng, lấy node tiếp theo trong linked list, cho đến khi tìm thấy key giống nhau để thay thế value, hoặc duyệt hết linked list mà không tìm thấy.
      1. Nếu capacity hiện tại lớn hơn ngưỡng mở rộng và nhỏ hơn capacity tối đa, **tiến hành mở rộng**.
      2. Chèn trực tiếp vào đầu linked list.

4. Nếu vị trí cần chèn trước đó đã tồn tại, sau khi thay thế trả về giá trị cũ, ngược lại trả về null.

Bước đầu tiên ở đây là thao tác `scanAndLockForPut` chưa được giới thiệu. Phương thức này thực hiện spin liên tục `tryLock()` để lấy lock. Khi số lần spin vượt quá số lần quy định, sử dụng `lock()` để block lấy lock. Trong khi spin, đồng thời lấy `HashEntry` tại vị trí hash.

```java
private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {
    HashEntry<K,V> first = entryForHash(this, hash);
    HashEntry<K,V> e = first;
    HashEntry<K,V> node = null;
    int retries = -1; // negative while locating node
    // 自旋获取锁
    while (!tryLock()) {
        HashEntry<K,V> f; // to recheck first below
        if (retries < 0) {
            if (e == null) {
                if (node == null) // speculatively create node
                    node = new HashEntry<K,V>(hash, key, value, null);
                retries = 0;
            }
            else if (key.equals(e.key))
                retries = 0;
            else
                e = e.next;
        }
        else if (++retries > MAX_SCAN_RETRIES) {
            // 自旋达到指定次数后，阻塞等到只到获取到锁
            lock();
            break;
        }
        else if ((retries & 1) == 0 &&
                 (f = entryForHash(this, hash)) != first) {
            e = first = f; // re-traverse if entry changed
            retries = -1;
        }
    }
    return node;
}

```

### 4. Mở rộng (rehash)

Việc mở rộng của `ConcurrentHashMap` chỉ mở rộng lên gấp đôi kích thước ban đầu. Khi dữ liệu trong mảng cũ được chuyển sang mảng mới, vị trí hoặc không thay đổi, hoặc trở thành `index + oldSize`. Tham số `node` sẽ được chèn vào vị trí chỉ định bằng phương pháp **head insertion** sau khi mở rộng.

```java
private void rehash(HashEntry<K,V> node) {
    HashEntry<K,V>[] oldTable = table;
    // 老容量
    int oldCapacity = oldTable.length;
    // 新容量，扩大两倍
    int newCapacity = oldCapacity << 1;
    // 新的扩容阀值
    threshold = (int)(newCapacity * loadFactor);
    // 创建新的数组
    HashEntry<K,V>[] newTable = (HashEntry<K,V>[]) new HashEntry[newCapacity];
    // 新的掩码，默认2扩容后是4，-1是3，二进制就是11。
    int sizeMask = newCapacity - 1;
    for (int i = 0; i < oldCapacity ; i++) {
        // 遍历老数组
        HashEntry<K,V> e = oldTable[i];
        if (e != null) {
            HashEntry<K,V> next = e.next;
            // 计算新的位置，新的位置只可能是不变或者是老的位置+老的容量。
            int idx = e.hash & sizeMask;
            if (next == null)   //  Single node on list
                // 如果当前位置还不是链表，只是一个元素，直接赋值
                newTable[idx] = e;
            else { // Reuse consecutive sequence at same slot
                // 如果是链表了
                HashEntry<K,V> lastRun = e;
                int lastIdx = idx;
                // 新的位置只可能是不变或者是老的位置+老的容量。
                // 遍历结束后，lastRun 后面的元素位置都是相同的
                for (HashEntry<K,V> last = next; last != null; last = last.next) {
                    int k = last.hash & sizeMask;
                    if (k != lastIdx) {
                        lastIdx = k;
                        lastRun = last;
                    }
                }
                // ，lastRun 后面的元素位置都是相同的，直接作为链表赋值到新位置。
                newTable[lastIdx] = lastRun;
                // Clone remaining nodes
                for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {
                    // 遍历剩余元素，头插法到指定 k 位置。
                    V v = p.value;
                    int h = p.hash;
                    int k = h & sizeMask;
                    HashEntry<K,V> n = newTable[k];
                    newTable[k] = new HashEntry<K,V>(h, p.key, v, n);
                }
            }
        }
    }
    // 头插法插入新的节点
    int nodeIndex = node.hash & sizeMask; // add the new node
    node.setNext(newTable[nodeIndex]);
    newTable[nodeIndex] = node;
    table = newTable;
}
```

Một số bạn có thể thắc mắc về hai vòng lặp for cuối cùng. Vòng for đầu tiên nhằm tìm một node mà tất cả các node `next` phía sau nó đều có vị trí mới giống hệt nhau. Sau đó gán toàn bộ chuỗi này như một linked list vào vị trí mới. Vòng for thứ hai nhằm chèn các phần tử còn lại vào vị trí chỉ định bằng phương pháp head insertion. ~~Lý do triển khai như vậy có thể dựa trên thống kê xác suất, các bạn nào nghiên cứu sâu có thể chia sẻ thêm ý kiến.~~

Vòng lặp `for` thứ hai bên trong sử dụng `new HashEntry<K,V>(h, p.key, v, n)` để tạo một `HashEntry` mới thay vì tái sử dụng node cũ, bởi vì nếu tái sử dụng node cũ, các thread đang duyệt (như đang thực thi phương thức `get`) sẽ không thể duyệt tiếp do con trỏ bị thay đổi. Đúng như comment đã nói:

> Khi chúng không còn được tham chiếu bởi bất kỳ thread đọc nào đang đồng thời duyệt bảng, các node bị thay thế sẽ được garbage collect.
>
> The nodes they replace will be garbage collectable as soon as they are no longer referenced by any reader thread that may be in the midst of concurrently traversing table

Lý do cần thêm một vòng lặp `for` để tìm `lastRun` thực chất là để giảm số lần tạo đối tượng, đúng như comment đã nói:

> Theo thống kê, ở ngưỡng mặc định, khi dung lượng bảng tăng gấp đôi, chỉ khoảng một phần sáu số node cần được clone.
>
> Statistically, at the default threshold, only about one-sixth of them need cloning when a table doubles.

### 5. get

Đến đây thì khá đơn giản, phương thức get chỉ cần hai bước.

1. Tính toán vị trí lưu trữ của key.
2. Duyệt vị trí đã chỉ định để tìm value có key tương ứng.

```java
public V get(Object key) {
    Segment<K,V> s; // manually integrate access methods to reduce overhead
    HashEntry<K,V>[] tab;
    int h = hash(key);
    long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;
    // 计算得到 key 的存放位置
    if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&
        (tab = s.table) != null) {
        for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile
                 (tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE);
             e != null; e = e.next) {
            // 如果是链表，遍历查找到相同 key 的 value。
            K k;
            if ((k = e.key) == key || (e.hash == h && key.equals(k)))
                return e.value;
        }
    }
    return null;
}
```

## 2. ConcurrentHashMap 1.8

Nhìn chung, `ConcurrentHashMap` trong Java 8 có sự thay đổi khá lớn so với Java 7.

### 1. Cấu trúc lưu trữ

![Java8 ConcurrentHashMap 存储结构（图片来自 javadoop）](https://oss.javaguide.cn/github/javaguide/java/collection/java8_concurrenthashmap.png)

Có thể thấy ConcurrentHashMap trong Java 8 có sự thay đổi lớn so với Java 7, không còn là **Mảng Segment + Mảng HashEntry + Linked List** như trước nữa, mà là **Mảng Node + Linked List / Red-Black Tree (cây đỏ-đen)**. Khi linked list xung đột đạt đến một độ dài nhất định, linked list sẽ được chuyển đổi thành red-black tree.

### 2. Khởi tạo initTable

```java
/**
 * Initializes table, using the size recorded in sizeCtl.
 */
private final Node<K,V>[] initTable() {
    Node<K,V>[] tab; int sc;
    while ((tab = table) == null || tab.length == 0) {
        //　如果 sizeCtl < 0 ,说明另外的线程执行CAS 成功，正在进行初始化。
        if ((sc = sizeCtl) < 0)
            // 让出 CPU 使用权
            Thread.yield(); // lost initialization race; just spin
        else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
            try {
                if ((tab = table) == null || tab.length == 0) {
                    int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                    @SuppressWarnings("unchecked")
                    Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                    table = tab = nt;
                    sc = n - (n >>> 2);
                }
            } finally {
                sizeCtl = sc;
            }
            break;
        }
    }
    return tab;
}
```

Từ mã nguồn có thể thấy việc khởi tạo `ConcurrentHashMap` được thực hiện thông qua **spin và CAS**. Cần chú ý đến biến `sizeCtl` (viết tắt của sizeControl), giá trị của nó quyết định trạng thái khởi tạo hiện tại.

1. -1 nghĩa là đang trong quá trình khởi tạo, các thread khác cần spin chờ
2. -N nghĩa là table đang được mở rộng, 16 bit cao biểu thị stamp nhận dạng việc mở rộng, 16 bit thấp trừ 1 là số thread đang thực hiện mở rộng
3. 0 nghĩa là table chưa được khởi tạo, khi khởi tạo sử dụng capacity mặc định
4. \>0 nghĩa là ngưỡng mở rộng của table, nếu table đã được khởi tạo.

### 3. put

Xem qua mã nguồn put.

```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

/** Implementation for put and putIfAbsent */
final V putVal(K key, V value, boolean onlyIfAbsent) {
    // key 和 value 不能为空
    if (key == null || value == null) throw new NullPointerException();
    int hash = spread(key.hashCode());
    int binCount = 0;
    for (Node<K,V>[] tab = table;;) {
        // f = 目标位置元素
        Node<K,V> f; int n, i, fh;// fh 后面存放目标位置的元素 hash 值
        if (tab == null || (n = tab.length) == 0)
            // 数组桶为空，初始化数组桶（自旋+CAS)
            tab = initTable();
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            // 桶内为空，CAS 放入，不加锁，成功了就直接 break 跳出
            if (casTabAt(tab, i, null,new Node<K,V>(hash, key, value, null)))
                break;  // no lock when adding to empty bin
        }
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        else {
            V oldVal = null;
            // 使用 synchronized 加锁加入节点
            synchronized (f) {
                if (tabAt(tab, i) == f) {
                    // 说明是链表
                    if (fh >= 0) {
                        binCount = 1;
                        // 循环加入新的或者覆盖节点
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);
                                break;
                            }
                        }
                    }
                    else if (f instanceof TreeBin) {
                        // 红黑树
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    addCount(1L, binCount);
    return null;
}
```

1. Tính hashcode dựa trên key.

2. Kiểm tra xem có cần khởi tạo hay không.

3. Nếu Node tại vị trí key định vị là null, nghĩa là vị trí hiện tại có thể ghi dữ liệu, sử dụng CAS để thử ghi; nếu thất bại thì vào lại vòng lặp và kiểm tra trạng thái mới nhất.

4. Nếu `hashcode == MOVED == -1` tại vị trí hiện tại, thì cần tiến hành mở rộng.

5. Nếu không thỏa mãn các điều kiện trên, sử dụng synchronized lock để ghi dữ liệu.

6. Nếu số lượng lớn hơn `TREEIFY_THRESHOLD` thì thực thi phương thức treeify (chuyển thành cây). Trong `treeifyBin`, trước tiên sẽ kiểm tra độ dài mảng hiện tại >= 64 thì mới chuyển linked list thành red-black tree.

### 4. get

Quy trình get tương đối đơn giản, xem qua mã nguồn.

```java
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    // key 所在的 hash 位置
    int h = spread(key.hashCode());
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {
        // 如果指定位置元素存在，头结点hash值相同
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                // key hash 值相等，key值相同，直接返回元素 value
                return e.val;
        }
        else if (eh < 0)
            // 头结点hash值小于0，说明正在扩容或者是红黑树，find查找
            return (p = e.find(h, key)) != null ? p.val : null;
        while ((e = e.next) != null) {
            // 是链表，遍历查找
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null;
}
```

Tóm tắt quy trình get:

1. Tính toán vị trí dựa trên giá trị hash.
2. Tìm đến vị trí đã chỉ định, nếu node đầu (head) chính là node cần tìm, trả về trực tiếp value của nó.
3. Nếu giá trị hash của node đầu nhỏ hơn 0, nghĩa là đang mở rộng hoặc là red-black tree, tìm kiếm trong đó.
4. Nếu là linked list, duyệt tìm kiếm.

### 5. Đếm size

Phương thức `size()` của `ConcurrentHashMap` được dùng để lấy tổng số phần tử trong Map hiện tại, nhưng trong kịch bản đa luồng cao, làm thế nào để thống kê số lượng phần tử một cách chính xác và hiệu quả là một thách thức kỹ thuật. Java 8 áp dụng một cơ chế đếm phân đoạn tinh tế để giải quyết vấn đề này.

#### 5.1 Tại sao cần đếm phân đoạn

Trong môi trường đa luồng, nếu nhiều thread đồng thời thực thi thao tác `put`, chúng đều cần cập nhật tổng số phần tử. Nếu sử dụng một biến đếm dùng chung duy nhất, sẽ dẫn đến cạnh tranh gay gắt — tất cả các thread đều tranh giành quyền sửa đổi cùng một biến, điều này ảnh hưởng nghiêm trọng đến hiệu năng.

Để giải quyết vấn đề này, `ConcurrentHashMap` áp dụng tư tưởng thiết kế **phân tán điểm nóng (hotspot dispersal)**: không sử dụng một bộ đếm duy nhất, mà phân tán việc đếm ra nhiều biến. Giống như ngân hàng không chỉ mở một quầy giao dịch mà mở nhiều quầy để phân luồng khách hàng, điều này có thể giảm đáng kể xung đột.

#### 5.2 Thiết kế của baseCount và counterCells

`ConcurrentHashMap` duy trì nội bộ hai trường (field) then chốt liên quan đến đếm:

- **baseCount**: Bộ đếm cơ sở, trong trường hợp không có cạnh tranh, cập nhật trực tiếp biến này thông qua CAS. Có thể hiểu nó như "bộ đếm chính".
- **counterCells**: Mảng bộ đếm. Khi nhiều thread cạnh tranh `baseCount` thất bại, sẽ thử phân tán phần tăng thêm của bộ đếm vào các vị trí khác nhau trong mảng `counterCells`.
  - Mỗi thread dựa trên giá trị **Probe** của mình (có thể hiểu như một loại hash code sinh ra từ thread ID) để ánh xạ đến một slot trong mảng, ưu tiên tích lũy trong "ô thiên vị" này.
  - **Lưu ý**: Ô này không thực sự là "riêng tư của thread" một cách nghiêm ngặt. Khi xảy ra hash collision, nhiều thread vẫn có thể ánh xạ đến cùng một slot và cập nhật đồng thời.

**Ví dụ**: Giả sử có 10 thread đồng thời thêm phần tử vào Map. Thread đầu tiên thành công cập nhật `baseCount` qua CAS, nhưng 9 thread phía sau khi cập nhật `baseCount` phát hiện có cạnh tranh, sẽ chuyển sang tìm một vị trí trong mảng `counterCells` để tích lũy. 9 thread này có thể phân tán vào các vị trí khác nhau trong mảng (ví dụ thread 2 ở `counterCells[1]`, thread 3 ở `counterCells[2]`), từ đó phân tán cạnh tranh từ một điểm ra nhiều điểm.

#### 5.3 Cách cập nhật bộ đếm khi put phần tử

Ở cuối phương thức `putVal`, chúng ta thấy lời gọi `addCount(1L, binCount)`, phương thức này dùng để cập nhật bộ đếm phần tử.

Logic thực thi của `addCount` có thể tóm tắt đại khái như sau:

1. **Ưu tiên thử cập nhật baseCount**

   - Nếu `counterCells` chưa được kích hoạt (`counterCells == null`), thread sẽ thử trước tiên cập nhật trực tiếp `baseCount` qua CAS.
   - Nếu CAS thành công, nghĩa là cạnh tranh không gay gắt, trả về trực tiếp.

2. **Khi xuất hiện cạnh tranh, chuyển sang counterCells**

   - Nếu CAS cập nhật `baseCount` thất bại (nghĩa là có thread khác đang cạnh tranh), hoặc `counterCells` đã tồn tại (nghĩa là hệ thống trước đó đã gặp cạnh tranh), thread sẽ thử cập nhật trong `counterCells`:
     - Dựa trên giá trị probe của mình ánh xạ đến một slot nào đó;
     - Thực hiện một lần CAS tích lũy trên `CounterCell` tương ứng với slot đó.
   - Nếu slot này trống hoặc CAS vẫn xung đột, sẽ đi vào một đường dẫn "nặng" hơn là `fullAddCount`, bên trong đó xử lý việc khởi tạo slot, chọn lại slot, v.v.

3. **Khởi tạo và mở rộng động counterCells**
   - Khi phát hiện cạnh tranh tương đối gay gắt (ví dụ: CAS của một cell nào đó cũng thường xuyên thất bại), `fullAddCount` sẽ dưới sự bảo vệ của một spinlock nhẹ `cellsBusy`:
     - Nếu `counterCells` chưa được khởi tạo, khởi tạo một mảng nhỏ (ví dụ độ dài 2);
     - Nếu đã tồn tại và độ dài chưa đạt giới hạn trên (thường không vượt quá số lõi CPU), mở rộng gấp 2 lần, tăng thêm slot đếm, phân tán thread hơn nữa.

Thiết kế này đảm bảo: khi đồng thời thấp chỉ sử dụng `baseCount` đơn giản, đường dẫn rất ngắn; khi đồng thời cao thì tự động chuyển sang đếm phân đoạn, thông qua `counterCells` và cơ chế mở rộng để giảm cạnh tranh, cân bằng giữa hiệu năng và độ chính xác.

#### 5.4 sumCount tính tổng số phần tử như thế nào

Khi chúng ta gọi phương thức `size()`, cuối cùng sẽ gọi phương thức `sumCount()` để tính tổng số phần tử. Logic của `sumCount()` rất đơn giản và trực tiếp:

1. Đọc giá trị của `baseCount` làm giá trị cơ sở.
2. Duyệt mảng `counterCells`, tích lũy tất cả giá trị đếm tại các vị trí không null vào giá trị cơ sở.
3. Trả về kết quả tích lũy.

**Lưu ý**:

- **Weak consistency (nhất quán yếu)**: `sumCount()` **không lock** trong toàn bộ quá trình. Trong thời gian tính toán nếu có thread khác chèn dữ liệu, kết quả trả về chỉ là một **giá trị gần đúng**. Nhưng trong kịch bản đa luồng cao, việc theo đuổi "tổng số chính xác trong khoảnh khắc" có chi phí quá lớn và không có ý nghĩa, giá trị gần đúng thường là đủ.
- **Tràn số nguyên**: Phương thức `size()` trả về kiểu `int`. Nếu số lượng phần tử vượt quá `Integer.MAX_VALUE`, nó chỉ trả về `Integer.MAX_VALUE`. Phương thức **`mappingCount()`** được thêm vào Java 8 trả về kiểu `long`, phù hợp để biểu thị số lượng lớn hơn, nhưng trong quá trình cập nhật đồng thời, giá trị trả về vẫn là ước lượng.

## 3. Tổng kết

Trong Java 7, `ConcurrentHashMap` sử dụng **segment lock (khóa phân đoạn)**, tức là trên mỗi `Segment` chỉ có một thread có thể thao tác tại cùng một thời điểm. Mỗi `Segment` là một cấu trúc tương tự mảng `HashMap`, nó có thể mở rộng, xung đột của nó sẽ chuyển thành linked list. Tuy nhiên, số lượng `Segment` một khi đã khởi tạo thì không thể thay đổi.

Trong Java 8, `ConcurrentHashMap` sử dụng cơ chế `Synchronized` lock kết hợp với CAS. Cấu trúc cũng tiến hóa từ **Mảng `Segment` + Mảng `HashEntry` + Linked List** trong Java 7 thành **Mảng Node + Linked List / Red-Black Tree**, Node là một cấu trúc tương tự như HashEntry. Xung đột của nó khi đạt đến một kích thước nhất định (`TREEIFY_THRESHOLD = 8`) sẽ chuyển đổi thành red-black tree, khi xung đột ít hơn một số lượng nhất định (`UNTREEIFY_THRESHOLD = 6`) lại quay về linked list.

Một số bạn có thể nghi ngờ về hiệu năng của `Synchronized`. Thực ra, kể từ khi `Synchronized` lock được giới thiệu chiến lược **lock upgrade (nâng cấp khóa)**, hiệu năng không còn là vấn đề nữa. Các bạn quan tâm có thể tự tìm hiểu thêm về **lock upgrade** của `Synchronized`.

<!-- @include: @article-footer.snippet.md -->
