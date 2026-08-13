---
title: Phân tích mã nguồn HashMap
description: "Phân tích chuyên sâu mã nguồn HashMap: giải thích chi tiết sự khác biệt về cấu trúc giữa JDK1.7/1.8, hàm băm nhiễu (hash perturbation), hệ số tải 0.75, cơ chế rehash khi mở rộng, ngưỡng chuyển đổi linked list sang red-black tree và các nguyên lý cốt lõi khác của HashMap."
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: HashMap源码,哈希表,红黑树,链表,扰动函数,负载因子,HashMap扩容,哈希冲突,JDK1.8优化
---

<!-- @include: @article-header.snippet.md -->

> Cảm ơn [changfubai](https://github.com/changfubai) đã đóng góp cải thiện cho bài viết này!

## Giới thiệu HashMap

HashMap chủ yếu được sử dụng để lưu trữ các cặp key-value, nó là một implementation của Map interface dựa trên hash table, là một trong những Java collection thường dùng và không thread-safe.

`HashMap` có thể lưu trữ key và value là null, nhưng null làm key chỉ có thể có một, null làm value có thể có nhiều.

Trước JDK1.8, HashMap được tạo thành từ **mảng + linked list**, mảng là phần chính của HashMap, linked list chủ yếu tồn tại để giải quyết hash collision (phương pháp "separate chaining" để giải quyết xung đột). Từ JDK1.8 trở đi, `HashMap` có sự thay đổi lớn trong việc giải quyết hash collision: khi độ dài linked list lớn hơn hoặc bằng ngưỡng (mặc định là 8) (trước khi chuyển linked list thành red-black tree, nếu độ dài mảng hiện tại nhỏ hơn 64, thì sẽ chọn mở rộng mảng trước thay vì chuyển thành red-black tree), linked list sẽ được chuyển thành red-black tree để giảm thời gian tìm kiếm.

Kích thước khởi tạo mặc định của `HashMap` là 16. Sau đó mỗi lần mở rộng, dung lượng trở thành gấp 2 lần ban đầu. Đồng thời, `HashMap` luôn sử dụng lũy thừa của 2 làm kích thước hash table.

## Phân tích cấu trúc dữ liệu底层

### Trước JDK1.8

Trước JDK1.8,底层 của HashMap là **mảng và linked list** kết hợp với nhau, tức là **linked list hashing**.

HashMap lấy hashCode của key, xử lý qua hàm nhiễu (perturbation function) để có được hash value, sau đó thông qua `(n - 1) & hash` để xác định vị trí lưu trữ của phần tử hiện tại (n ở đây là độ dài của mảng). Nếu vị trí hiện tại đã có phần tử, thì so sánh hash value và key của phần tử đó với phần tử sắp được thêm vào. Nếu giống nhau thì ghi đè trực tiếp, nếu khác thì giải quyết xung đột bằng phương pháp separate chaining.

Hàm nhiễu (perturbation function) chính là phương thức hash của HashMap. Sử dụng phương thức hash (hàm nhiễu) là để ngăn chặn một số implementation của phương thức hashCode() kém chất lượng. Nói cách khác, sử dụng hàm nhiễu có thể giảm collision.

**Mã nguồn phương thức hash của JDK 1.8 HashMap:**

Phương thức hash của JDK 1.8 so với JDK 1.7 được đơn giản hóa hơn, nhưng nguyên lý không thay đổi.

```java
    static final int hash(Object key) {
      int h;
      // key.hashCode()：trả về hash value, tức là hashcode
      // ^：bitwise XOR
      // >>>: unsigned right shift, bỏ qua bit dấu, các vị trí trống được điền bằng 0
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
  }
```

So sánh với mã nguồn phương thức hash của JDK1.7 HashMap.

```java
static int hash(int h) {
    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).

    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

So với phương thức hash của JDK1.8, phương thức hash của JDK 1.7 có hiệu năng kém hơn một chút, vì dù sao cũng đã nhiễu tới 4 lần.

Cái gọi là **"separate chaining"** chính là: kết hợp linked list và mảng. Tức là tạo ra một mảng linked list, mỗi ô trong mảng là một linked list. Nếu gặp hash collision, thì thêm giá trị xung đột vào linked list là được.

![Cấu trúc nội bộ trước jdk1.8-HashMap](https://oss.javaguide.cn/github/javaguide/java/collection/jdk1.7_hashmap.png)

### Sau JDK1.8

So với phiên bản trước, từ JDK1.8 trở đi có sự thay đổi lớn trong việc giải quyết hash collision.

Khi độ dài linked list lớn hơn ngưỡng (mặc định là 8), phương thức `treeifyBin()` sẽ được gọi đầu tiên. Phương thức này sẽ dựa vào mảng HashMap để quyết định có chuyển đổi thành red-black tree hay không. Chỉ khi độ dài mảng lớn hơn hoặc bằng 64, thao tác chuyển đổi thành red-black tree mới được thực thi, để giảm thời gian tìm kiếm. Nếu không, chỉ thực thi phương thức `resize()` để mở rộng mảng. Mã nguồn liên quan sẽ không được dán ở đây, tập trung vào phương thức `treeifyBin()` là được!

![Cấu trúc nội bộ sau jdk1.8-HashMap](https://oss.javaguide.cn/github/javaguide/java/collection/jdk1.8_hashmap.png)

**Các thuộc tính của class:**

```java
public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V>, Cloneable, Serializable {
    // serial number
    private static final long serialVersionUID = 362498820763181265L;
    // dung lượng khởi tạo mặc định là 16
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
    // dung lượng tối đa
    static final int MAXIMUM_CAPACITY = 1 << 30;
    // hệ số tải mặc định
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    // khi số lượng node trên bucket lớn hơn hoặc bằng giá trị này sẽ chuyển thành red-black tree
    static final int TREEIFY_THRESHOLD = 8;
    // khi số lượng node trên bucket nhỏ hơn hoặc bằng giá trị này thì tree chuyển thành linked list
    static final int UNTREEIFY_THRESHOLD = 6;
    // dung lượng tối thiểu của table để cấu trúc trong bucket chuyển đổi thành red-black tree
    static final int MIN_TREEIFY_CAPACITY = 64;
    // mảng lưu trữ phần tử, luôn là lũy thừa của 2
    transient Node<k,v>[] table;
    // một collection view chứa tất cả các cặp key-value trong mapping
    transient Set<map.entry<k,v>> entrySet;
    // số lượng phần tử đã lưu trữ, lưu ý không bằng độ dài của mảng.
    transient int size;
    // bộ đếm cho mỗi lần mở rộng và thay đổi cấu trúc map
    transient int modCount;
    // ngưỡng (threshold) (dung lượng * hệ số tải) khi kích thước thực tế vượt quá ngưỡng, sẽ tiến hành mở rộng
    int threshold;
    // hệ số tải
    final float loadFactor;
}
```

- **Hệ số tải loadFactor**

  Hệ số tải loadFactor kiểm soát mức độ thưa dày của dữ liệu được lưu trong mảng. loadFactor càng gần 1, thì dữ liệu (entry) được lưu trong mảng càng nhiều, càng dày đặc, tức là sẽ làm tăng độ dài của linked list. loadFactor càng nhỏ, tức là càng gần 0, dữ liệu (entry) được lưu trong mảng càng ít, càng thưa thớt.

  **loadFactor quá lớn dẫn đến hiệu suất tìm kiếm phần tử thấp, quá nhỏ dẫn đến tỷ lệ sử dụng mảng thấp, dữ liệu lưu trữ sẽ rất phân tán. Giá trị mặc định của loadFactor là 0.75f là một giá trị临界 tốt được đưa ra chính thức**.

  Dung lượng mặc định được cho là 16, hệ số tải là 0.75. Trong quá trình sử dụng, Map liên tục thêm dữ liệu vào. Khi số lượng vượt quá 16 \* 0.75 = 12, cần phải mở rộng dung lượng 16 hiện tại. Quá trình mở rộng cần tạo mảng mới và di chuyển node, v.v., nên rất tiêu tốn hiệu năng.

- **threshold**

  **threshold = capacity \* loadFactor**, **khi Size > threshold**, thì cần xem xét mở rộng mảng. Nói cách khác, đây chính là **một tiêu chuẩn để đánh giá xem mảng có cần mở rộng hay không**.

**Mã nguồn class Node:**

```java
// kế thừa từ Map.Entry<K,V>
static class Node<K,V> implements Map.Entry<K,V> {
       final int hash;// hash value, dùng để so sánh với hash value của các phần tử khác khi lưu vào hashmap
       final K key;// key
       V value;// value
       // trỏ đến node tiếp theo
       Node<K,V> next;
       Node(int hash, K key, V value, Node<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
        public final K getKey()        { return key; }
        public final V getValue()      { return value; }
        public final String toString() { return key + "=" + value; }
        // ghi đè phương thức hashCode()
        public final int hashCode() {
            return Objects.hashCode(key) ^ Objects.hashCode(value);
        }

        public final V setValue(V newValue) {
            V oldValue = value;
            value = newValue;
            return oldValue;
        }
        // ghi đè phương thức equals()
        public final boolean equals(Object o) {
            if (o == this)
                return true;
            if (o instanceof Map.Entry) {
                Map.Entry<?,?> e = (Map.Entry<?,?>)o;
                if (Objects.equals(key, e.getKey()) &&
                    Objects.equals(value, e.getValue()))
                    return true;
            }
            return false;
        }
}
```

**Mã nguồn class TreeNode:**

```java
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
        TreeNode<K,V> parent;  // cha
        TreeNode<K,V> left;    // trái
        TreeNode<K,V> right;   // phải
        TreeNode<K,V> prev;    // needed to unlink next upon deletion
        boolean red;           // xác định màu
        TreeNode(int hash, K key, V val, Node<K,V> next) {
            super(hash, key, val, next);
        }
        // trả về node gốc
        final TreeNode<K,V> root() {
            for (TreeNode<K,V> r = this, p;;) {
                if ((p = r.parent) == null)
                    return r;
                r = p;
       }
```

## Phân tích mã nguồn HashMap

### Phương thức khởi tạo

HashMap có bốn phương thức khởi tạo, chúng lần lượt như sau:

```java
    // constructor mặc định.
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // all   other fields defaulted
     }

     // constructor chứa một "Map" khác
     public HashMap(Map<? extends K, ? extends V> m) {
         this.loadFactor = DEFAULT_LOAD_FACTOR;
         putMapEntries(m, false);// phương thức này sẽ được phân tích bên dưới
     }

     // constructor chỉ định "dung lượng"
     public HashMap(int initialCapacity) {
         this(initialCapacity, DEFAULT_LOAD_FACTOR);
     }

     // constructor chỉ định "dung lượng" và "hệ số tải"
     public HashMap(int initialCapacity, float loadFactor) {
         if (initialCapacity < 0)
             throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
         if (initialCapacity > MAXIMUM_CAPACITY)
             initialCapacity = MAXIMUM_CAPACITY;
         if (loadFactor <= 0 || Float.isNaN(loadFactor))
             throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
         this.loadFactor = loadFactor;
         // dung lượng khởi tạo tạm thời được lưu vào threshold, trong resize sẽ gán lại cho newCap để khởi tạo table
         this.threshold = tableSizeFor(initialCapacity);
     }
```

> Cần đặc biệt lưu ý: `initialCapacity` được truyền vào không phải là dung lượng mảng cuối cùng. `HashMap` sẽ gọi `tableSizeFor()` để **làm tròn lên thành lũy thừa của 2 nhỏ nhất lớn hơn hoặc bằng giá trị đó**, và tạm thời lưu vào trường `threshold`. Mảng `table` thực sự sẽ chỉ được khởi tạo với kích thước này trong lần mở rộng đầu tiên (`resize()`).
>
> Ví dụ: `initialCapacity = 9` → `threshold = 16` → độ dài `table` cuối cùng là 16.

**Phương thức putMapEntries:**

```java
final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
    int s = m.size();
    if (s > 0) {
        // kiểm tra table đã được khởi tạo chưa
        if (table == null) { // pre-size
            /*
             * chưa khởi tạo, s là số phần tử thực tế của m, ft=s/loadFactor => s=ft*loadFactor, giống với
             * ngưỡng = dung lượng * hệ số tải mà chúng ta đã đề cập trước đó phải không, đúng vậy, ft là dung lượng tối thiểu cần để thêm s phần tử
             */
            float ft = ((float)s / loadFactor) + 1.0F;
            int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                    (int)ft : MAXIMUM_CAPACITY);
            /*
             * theo constructor, table chưa được khởi tạo, threshold thực tế đang lưu dung lượng khởi tạo, nếu dung lượng tối thiểu
             * cần để thêm s phần tử lớn hơn dung lượng khởi tạo, thì mở rộng dung lượng tối thiểu thành lũy thừa của 2 gần nhất làm dung lượng khởi tạo.
             * lưu ý đây không phải là khởi tạo ngưỡng
             */
            if (t > threshold)
                threshold = tableSizeFor(t);
        }
        // đã khởi tạo, và số phần tử m lớn hơn ngưỡng, tiến hành mở rộng
        else if (s > threshold)
            resize();
        // thêm tất cả phần tử trong m vào HashMap, nếu table chưa khởi tạo, putVal sẽ gọi resize để khởi tạo hoặc mở rộng
        for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
            K key = e.getKey();
            V value = e.getValue();
            putVal(hash(key), key, value, false, evict);
        }
    }
}
```

### Phương thức put

HashMap chỉ cung cấp put để thêm phần tử, phương thức putVal chỉ là một phương thức được put gọi, không được cung cấp cho người dùng sử dụng.

**Phân tích việc thêm phần tử của phương thức putVal như sau:**

1. Nếu vị trí mảng được định vị không có phần tử thì chèn trực tiếp.
2. Nếu vị trí mảng được định vị có phần tử thì so sánh với key cần chèn. Nếu key giống nhau thì ghi đè trực tiếp. Nếu key khác nhau, thì kiểm tra p có phải là tree node hay không. Nếu phải thì gọi `e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value)` để thêm phần tử vào. Nếu không phải thì duyệt linked list để chèn (chèn vào cuối linked list).

![ ](https://oss.javaguide.cn/github/javaguide/database/sql/put.png)

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // table chưa được khởi tạo hoặc độ dài bằng 0, tiến hành mở rộng
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // (n - 1) & hash xác định phần tử được lưu trong bucket nào, bucket trống, tạo node mới đưa vào bucket (lúc này, node này được đặt trong mảng)
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    // trong bucket đã tồn tại phần tử (xử lý hash collision)
    else {
        Node<K,V> e; K k;
        // nhanh chóng kiểm tra key của node đầu tiên table[i] có giống với key được chèn không, nếu giống thì dùng value được chèn p thay thế value cũ e.
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
        // kiểm tra có phải là red-black tree node không
        else if (p instanceof TreeNode)
            // đưa vào tree
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        // không phải red-black tree node thì là linked list node
        else {
            // chèn node vào cuối linked list
            for (int binCount = 0; ; ++binCount) {
                // đến cuối linked list
                if ((e = p.next) == null) {
                    // chèn node mới vào cuối
                    p.next = newNode(hash, key, value, null);
                    // số lượng node đạt ngưỡng (mặc định là 8), thực thi phương thức treeifyBin
                    // phương thức này sẽ dựa vào mảng HashMap để quyết định có chuyển thành red-black tree hay không.
                    // chỉ khi độ dài mảng lớn hơn hoặc bằng 64, thao tác chuyển đổi thành red-black tree mới được thực thi, để giảm thời gian tìm kiếm. nếu không, chỉ mở rộng mảng.
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    // thoát vòng lặp
                    break;
                }
                // kiểm tra key của node trong linked list có bằng với key của phần tử được chèn không
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    // bằng nhau, thoát vòng lặp
                    break;
                // dùng để duyệt linked list trong bucket, kết hợp với e = p.next ở trên, có thể duyệt linked list
                p = e;
            }
        }
        // cho biết đã tìm thấy node trong bucket có key và hash value bằng với phần tử được chèn
        if (e != null) {
            // ghi lại value của e
            V oldValue = e.value;
            // onlyIfAbsent là false hoặc giá trị cũ là null
            if (!onlyIfAbsent || oldValue == null)
                // thay thế giá trị cũ bằng giá trị mới
                e.value = value;
            // callback sau khi truy cập
            afterNodeAccess(e);
            // trả về giá trị cũ
            return oldValue;
        }
    }
    // thay đổi cấu trúc
    ++modCount;
    // kích thước thực tế lớn hơn ngưỡng thì mở rộng
    if (++size > threshold)
        resize();
    // callback sau khi chèn
    afterNodeInsertion(evict);
    return null;
}
```

**Chúng ta hãy so sánh với mã nguồn phương thức put của JDK1.7**

**Phân tích phương thức put như sau:**

- ① Nếu vị trí mảng được định vị không có phần tử thì chèn trực tiếp.
- ② Nếu vị trí mảng được định vị có phần tử, duyệt linked list với phần tử này là node đầu, lần lượt so sánh với key được chèn. Nếu key giống nhau thì ghi đè trực tiếp, nếu khác thì sử dụng phương pháp chèn đầu (head insertion) để chèn phần tử.

```java
public V put(K key, V value)
    if (table == EMPTY_TABLE) {
    inflateTable(threshold);
}
    if (key == null)
        return putForNullKey(value);
    int hash = hash(key);
    int i = indexFor(hash, table.length);
    for (Entry<K,V> e = table[i]; e != null; e = e.next) { // duyệt trước
        Object k;
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }

    modCount++;
    addEntry(hash, key, value, i);  // chèn sau
    return null;
}
```

### Phương thức get

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        // phần tử mảng khớp
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        // trong bucket có nhiều hơn một node
        if ((e = first.next) != null) {
            // get trong tree
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            // get trong linked list
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

### Phương thức resize

Khi tiến hành mở rộng, sẽ duyệt các phần tử trong hash table, và sử dụng hash value hiện có của node cùng dung lượng cũ để xác định vị trí của node trong mảng mới, việc này rất tốn thời gian. Khi viết chương trình, cần cố gắng tránh resize. Phương thức resize thực tế đã tích hợp việc khởi tạo table và mở rộng table, hành vi底层 đều là gán cho table một mảng mới.

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        // vượt quá giá trị tối đa thì không mở rộng nữa, đành để mặc cho collision
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // chưa vượt quá giá trị tối đa, thì mở rộng thành gấp 2 lần ban đầu
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        // khi tạo object, dung lượng khởi tạo được đặt trong threshold, lúc này chỉ cần dùng nó làm dung lượng mảng mới
        newCap = oldThr;
    else {
        // signifies using defaults object được tạo bằng constructor không tham số sẽ tính toán dung lượng và ngưỡng ở đây
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        // khi tạo đã chỉ định dung lượng khởi tạo hoặc hệ số tải, ở đây tiến hành khởi tạo ngưỡng,
    	// hoặc dung lượng cũ trước khi mở rộng nhỏ hơn 16, ở đây tính toán giới hạn trên resize mới
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ? (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        // di chuyển mỗi bucket sang bucket mới
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    // chỉ có một node, tính toán trực tiếp vị trí mới của phần tử là được
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    // tách red-black tree thành 2 cây con, nếu số node của cây con nhỏ hơn hoặc bằng UNTREEIFY_THRESHOLD (mặc định là 6), thì chuyển cây con thành linked list.
                    // nếu số node của cây con lớn hơn UNTREEIFY_THRESHOLD, thì giữ nguyên cấu trúc tree của cây con.
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else {
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // chỉ mục gốc
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // chỉ mục gốc + oldCap
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // đặt chỉ mục gốc vào bucket
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    // đặt chỉ mục gốc + oldCap vào bucket
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

## Kiểm thử các phương thức thường dùng của HashMap

```java
package map;

import java.util.Collection;
import java.util.HashMap;
import java.util.Set;

public class HashMapDemo {

    public static void main(String[] args) {
        HashMap<String, String> map = new HashMap<String, String>();
        // key không được trùng lặp, value có thể trùng lặp
        map.put("san", "Trương Tam");
        map.put("si", "Lý Tứ");
        map.put("wu", "Vương Ngũ");
        map.put("wang", "Lão Vương");
        map.put("wang", "Lão Vương 2");// Lão Vương bị ghi đè
        map.put("lao", "Lão Vương");
        System.out.println("-------in trực tiếp hashmap:-------");
        System.out.println(map);
        /**
         * Duyệt HashMap
         */
        // 1. Lấy tất cả key trong Map
        System.out.println("-------foreach lấy tất cả key trong Map:------");
        Set<String> keys = map.keySet();
        for (String key : keys) {
            System.out.print(key+"  ");
        }
        System.out.println();// xuống dòng
        // 2. Lấy tất cả value trong Map
        System.out.println("-------foreach lấy tất cả value trong Map:------");
        Collection<String> values = map.values();
        for (String value : values) {
            System.out.print(value+"  ");
        }
        System.out.println();// xuống dòng
        // 3. Lấy value của key đồng thời lấy key tương ứng
        System.out.println("-------lấy value của key đồng thời lấy key tương ứng:-------");
        Set<String> keys2 = map.keySet();
        for (String key : keys2) {
            System.out.print(key + "：" + map.get(key)+"   ");

        }
        /**
         * Nếu vừa muốn duyệt key vừa muốn duyệt value, thì nên dùng cách này, vì nếu lấy keySet trước rồi mới thực thi map.get(key), map sẽ thực hiện duyệt hai lần.
         * Một lần khi lấy keySet, một lần khi duyệt tất cả key.
         */
        // Khi tôi gọi phương thức put(key,value), đầu tiên key và value được đóng gói vào
        // object của static inner class Entry, rồi thêm object Entry vào mảng, vì vậy chúng ta muốn lấy
        // tất cả cặp key-value trong map, chúng ta chỉ cần lấy tất cả object Entry trong mảng, tiếp theo
        // gọi phương thức getKey() và getValue() của object Entry là có thể lấy được cặp key-value
        Set<java.util.Map.Entry<String, String>> entrys = map.entrySet();
        for (java.util.Map.Entry<String, String> entry : entrys) {
            System.out.println(entry.getKey() + "--" + entry.getValue());
        }

        /**
         * Các phương thức thường dùng khác của HashMap
         */
        System.out.println("after map.size()："+map.size());
        System.out.println("after map.isEmpty()："+map.isEmpty());
        System.out.println(map.remove("san"));
        System.out.println("after map.remove()："+map);
        System.out.println("after map.get(si)："+map.get("si"));
        System.out.println("after map.containsKey(si)："+map.containsKey("si"));
        System.out.println("after containsValue(Lý Tứ)："+map.containsValue("Lý Tứ"));
        System.out.println(map.replace("si", "Lý Tứ 2"));
        System.out.println("after map.replace(si, Lý Tứ 2):"+map);
    }

}
```

<!-- @include: @article-footer.snippet.md -->
