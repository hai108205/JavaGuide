---
title: Phân tích mã nguồn LinkedHashMap
description: "Phân tích chuyên sâu mã nguồn LinkedHashMap: giải thích chi tiết cơ chế duy trì danh sách liên kết đôi (doubly linked list) để đạt được thứ tự chèn/truy cập, triển khai LRU cache, sự khác biệt với HashMap và tối ưu hiệu suất duyệt."
category: Java
tag:
  - Java Collections
head:
  - - meta
    - name: keywords
      content: LinkedHashMap source code, insertion order, access order, LRU cache, doubly linked list, ordered Map, LinkedHashMap implementation principle
---

## Giới thiệu LinkedHashMap

`LinkedHashMap` là một lớp collection được Java cung cấp, kế thừa từ `HashMap` và duy trì một danh sách liên kết đôi (doubly linked list) trên nền `HashMap`, mang lại các đặc điểm sau:

1. Hỗ trợ duyệt theo thứ tự chèn (insertion order) khi lặp.
2. Hỗ trợ sắp xếp theo thứ tự truy cập (access order) của phần tử, phù hợp để đóng gói công cụ LRU cache.
3. Vì nội bộ sử dụng danh sách liên kết đôi để duy trì các nút, nên hiệu suất duyệt tỉ lệ thuận với số lượng phần tử, so với `HashMap` có hiệu suất duyệt tỉ lệ thuận với dung lượng (capacity) thì hiệu suất lặp của `LinkedHashMap` cao hơn nhiều.

Cấu trúc logic của `LinkedHashMap` được minh họa như hình dưới đây, nó duy trì một danh sách liên kết đôi giữa các nút trên nền `HashMap`, giúp các nút, danh sách liên kết, cây đỏ-đen (red-black tree) vốn phân tán trên các bucket khác nhau được liên kết có thứ tự với nhau.

![Cấu trúc logic LinkedHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/linkhashmap-structure-overview.png)

## Ví dụ sử dụng LinkedHashMap

### Duyệt theo thứ tự chèn

Như ví dụ dưới đây, chúng ta thêm các phần tử vào `LinkedHashMap` theo thứ tự rồi tiến hành duyệt.

```java
HashMap < String, String > map = new LinkedHashMap < > ();
map.put("a", "2");
map.put("g", "3");
map.put("r", "1");
map.put("e", "23");

for (Map.Entry < String, String > entry: map.entrySet()) {
    System.out.println(entry.getKey() + ":" + entry.getValue());
}
```

Kết quả:

```java
a:2
g:3
r:1
e:23
```

Có thể thấy, thứ tự lặp của `LinkedHashMap` nhất quán với thứ tự chèn, đây là đặc điểm mà `HashMap` không có.

### Duyệt theo thứ tự truy cập

`LinkedHashMap` định nghĩa chế độ sắp xếp `accessOrder` (kiểu boolean, mặc định là false), true là thứ tự truy cập, false là thứ tự chèn.

Để thực hiện duyệt theo thứ tự truy cập, chúng ta có thể sử dụng constructor của `LinkedHashMap` có tham số `accessOrder`, và đặt `accessOrder` thành true, biểu thị rằng nó có tính năng sắp xếp theo thứ tự truy cập.

```java
LinkedHashMap<Integer, String> map = new LinkedHashMap<>(16, 0.75f, true);
map.put(1, "one");
map.put(2, "two");
map.put(3, "three");
map.put(4, "four");
map.put(5, "five");
// Truy cập phần tử 2, phần tử này sẽ được di chuyển đến cuối danh sách liên kết
map.get(2);
// Truy cập phần tử 3, phần tử này sẽ được di chuyển đến cuối danh sách liên kết
map.get(3);
for (Map.Entry<Integer, String> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " : " + entry.getValue());
}
```

Kết quả:

```java
1 : one
4 : four
5 : five
2 : two
3 : three
```

Có thể thấy, thứ tự lặp của `LinkedHashMap` nhất quán với thứ tự truy cập.

### LRU Cache

Từ phần trên, chúng ta có thể thấy rằng thông qua `LinkedHashMap`, chúng ta có thể đóng gói một LRU (**L**east **R**ecently **U**sed - Ít được sử dụng gần đây nhất) cache đơn giản, đảm bảo rằng khi số phần tử được lưu trữ vượt quá dung lượng container, phần tử ít được truy cập gần đây nhất sẽ bị xóa.

![](https://oss.javaguide.cn/github/javaguide/java/collection/lru-cache.png)

Ý tưởng triển khai cụ thể như sau:

- Kế thừa `LinkedHashMap`;
- Trong constructor chỉ định `accessOrder` là true, như vậy khi truy cập một phần tử, phần tử đó sẽ được di chuyển đến cuối danh sách liên kết, phần tử đầu danh sách chính là phần tử ít được truy cập gần đây nhất;
- Ghi đè phương thức `removeEldestEntry`, phương thức này trả về một giá trị boolean, thông báo cho `LinkedHashMap` biết có cần xóa phần tử đầu danh sách liên kết hay không (dung lượng cache có hạn).

```java
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    /**
     * Trả về true khi size vượt quá capacity, thông báo cho LinkedHashMap xóa mục cache cũ nhất (tức phần tử đầu tiên của danh sách liên kết)
     */
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

Mã kiểm thử như sau, tác giả khởi tạo dung lượng cache là 3, sau đó thêm 4 phần tử theo thứ tự.

```java
LRUCache<Integer, String> cache = new LRUCache<>(3);
cache.put(1, "one");
cache.put(2, "two");
cache.put(3, "three");
cache.put(4, "four");
cache.put(5, "five");
for (int i = 1; i <= 5; i++) {
    System.out.println(cache.get(i));
}
```

Kết quả:

```java
null
null
three
four
five
```

Từ kết quả đầu ra, do dung lượng cache là 3, nên khi thêm phần tử thứ 4, phần tử thứ 1 sẽ bị xóa. Khi thêm phần tử thứ 5, phần tử thứ 2 sẽ bị xóa.

## Phân tích mã nguồn LinkedHashMap

### Thiết kế Node

Trước khi thảo luận chính thức về `LinkedHashMap`, chúng ta hãy nói về thiết kế của nút `Entry` trong `LinkedHashMap`. Chúng ta đều biết rằng các nút trên bucket của `HashMap` chuyển thành danh sách liên kết do xung đột (collision) sẽ được chuyển thành cây đỏ-đen khi thỏa mãn hai điều kiện sau:

1. ~~Số lượng nút trên danh sách liên kết đạt đến ngưỡng treeify là 7, tức `TREEIFY_THRESHOLD - 1`.~~
2. Dung lượng của bucket đạt đến dung lượng treeify tối thiểu, tức `MIN_TREEIFY_CAPACITY`.

> **🐛 Đính chính (xem: [issue#2147](https://github.com/Snailclimb/JavaGuide/issues/2147))**:
>
> Số lượng nút trên danh sách liên kết đạt đến ngưỡng treeify là 8 chứ không phải 7. Vì mã nguồn duyệt từ phần tử đầu tiên của danh sách liên kết, chỉ số bắt đầu từ 0, nên điều kiện phán đoán được đặt là 8-1=7, thực chất là khi duyệt đến phần tử cuối mới phán đoán toàn bộ độ dài danh sách liên kết lớn hơn hoặc bằng 8 thì mới tiến hành thao tác treeify.
>
> ![](https://oss.javaguide.cn/github/javaguide/java/jvm/LinkedHashMap-putval-TREEIFY.png)

`LinkedHashMap` xây dựng một danh sách liên kết đôi cho mỗi nút trên bucket trên nền `HashMap`, điều này khiến cho các nút cây được chuyển thành cây đỏ-đen cũng cần có đặc điểm của nút danh sách liên kết đôi, tức là mỗi nút cây đều cần có hai tham chiếu lưu trữ địa chỉ của nút tiền nhiệm (predecessor) và nút kế nhiệm (successor). Vì vậy, thiết kế của lớp nút cây `TreeNode` là một vấn đề khá hóc búa.

Về điều này, chúng ta hãy xem sơ đồ lớp (class diagram) của các lớp nút giữa hai bên, có thể thấy:

1. Lớp nội bộ `Entry` của `LinkedHashMap` dựa trên `HashMap`, tăng thêm con trỏ `before` và `after` để nút có đặc điểm của danh sách liên kết đôi.
2. `TreeNode` của `HashMap` kế thừa `Entry` của `LinkedHashMap` vốn có đặc điểm của danh sách liên kết đôi.

![Mối quan hệ giữa LinkedHashMap và HashMap](https://oss.javaguide.cn/github/javaguide/java/collection/map-hashmap-linkedhashmap.png)

Nhiều độc giả lúc này sẽ có một câu hỏi, tại sao `TreeNode` của `HashMap` lại cần thông qua `LinkedHashMap` để có được đặc điểm của danh sách liên kết đôi? Tại sao không trực tiếp triển khai con trỏ tiền nhiệm và kế nhiệm trên `Node`?

Trước tiên trả lời câu hỏi thứ nhất, chúng ta đều biết `LinkedHashMap` là trên nền `HashMap` tăng thêm con trỏ hai chiều cho nút để thực hiện đặc điểm của danh sách liên kết đôi, vì vậy khi danh sách liên kết nội bộ của `LinkedHashMap` chuyển thành cây đỏ-đen, nút tương ứng sẽ được chuyển thành nút cây `TreeNode`. Để đảm bảo khi sử dụng `LinkedHashMap` nút cây có đặc điểm của danh sách liên kết đôi, nên nút cây `TreeNode` cần kế thừa `Entry` của `LinkedHashMap`.

Tiếp theo nói về câu hỏi thứ hai, tại sao chúng ta không trực tiếp triển khai con trỏ tiền nhiệm và kế nhiệm trên `Node` của `HashMap`, sau đó `TreeNode` trực tiếp kế thừa `Node` để có được đặc điểm của danh sách liên kết đôi? Thực ra làm như vậy cũng được. Chỉ có điều cách làm này sẽ khiến cho lớp nút `Node` lưu trữ cặp khóa-giá trị khi sử dụng `HashMap` có thêm hai tham chiếu không cần thiết, chiếm dụng không gian bộ nhớ không cần thiết.

Vì vậy, để đảm bảo lớp nút `Node`底层 của `HashMap` không có tham chiếu dư thừa, lại phải đảm bảo lớp nút `Entry` của `LinkedHashMap` có tham chiếu lưu trữ danh sách liên kết, người thiết kế đã để `Entry` của `LinkedHashMap` kế thừa Node và tăng thêm tham chiếu `before`, `after` lưu trữ nút tiền nhiệm và kế nhiệm, để những nút cần dùng đến đặc điểm danh sách liên kết đi thực hiện logic cần thiết. Sau đó nút cây `TreeNode` lại thông qua kế thừa `Entry` để có được hai con trỏ `before`, `after`.

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
        Entry<K,V> before, after;
        Entry(int hash, K key, V value, Node<K,V> next) {
            super(hash, key, value, next);
        }
    }
```

Nhưng làm như vậy, chẳng phải cũng khiến cho `TreeNode` khi sử dụng `HashMap` có thêm hai tham chiếu không cần thiết sao? Đây chẳng phải cũng là một sự lãng phí không gian sao?

```java
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
  // Lược bỏ

}
```

Đối với vấn đề này, trích dẫn một đoạn chú thích của tác giả, các tác giả cho rằng với thuật toán `hashCode` tốt, xác suất `HashMap` chuyển thành cây đỏ-đen là không lớn. Ngay cả khi chuyển thành cây đỏ-đen trở thành nút cây, cũng có thể vì xóa hoặc mở rộng (resize) mà `TreeNode` bị chuyển thành `Node`, vì vậy xác suất sử dụng `TreeNode` không lớn lắm, đối với sự lãng phí không gian tài nguyên này là có thể chấp nhận được.

```bash
Because TreeNodes are about twice the size of regular nodes, we
use them only when bins contain enough nodes to warrant use
(see TREEIFY_THRESHOLD). And when they become too small (due to
removal or resizing) they are converted back to plain bins.  In
usages with well-distributed user hashCodes, tree bins are
rarely used.  Ideally, under random hashCodes, the frequency of
nodes in bins follows a Poisson distribution
```

### Constructor

`LinkedHashMap` có 4 constructor, cách triển khai cũng tương đối đơn giản, trực tiếp gọi constructor của lớp cha là `HashMap` để hoàn thành khởi tạo.

```java
public LinkedHashMap() {
    super();
    accessOrder = false;
}

public LinkedHashMap(int initialCapacity) {
    super(initialCapacity);
    accessOrder = false;
}

public LinkedHashMap(int initialCapacity, float loadFactor) {
    super(initialCapacity, loadFactor);
    accessOrder = false;
}

public LinkedHashMap(int initialCapacity,
    float loadFactor,
    boolean accessOrder) {
    super(initialCapacity, loadFactor);
    this.accessOrder = accessOrder;
}
```

Chúng tôi cũng đã đề cập ở trên, mặc định `accessOrder` là false, nếu chúng ta muốn `LinkedHashMap` thực hiện sắp xếp cặp khóa-giá trị theo thứ tự truy cập (tức đặt phần tử ít được truy cập gần đây nhất ở đầu danh sách liên kết, phần tử được truy cập gần đây nhất di chuyển đến cuối danh sách liên kết), cần gọi constructor thứ 4 và đặt `accessOrder` thành true.

### Phương thức get

`get` là phương thức duy nhất được ghi đè trong các thao tác CRUD của `LinkedHashMap`. Trong trường hợp `accessOrder` là true, nó sẽ di chuyển phần tử hiện được truy cập đến cuối danh sách liên kết sau khi truy vấn phần tử hoàn tất.

```java
public V get(Object key) {
     Node < K, V > e;
     // Lấy cặp khóa-giá trị của key, nếu rỗng thì trả về trực tiếp
     if ((e = getNode(hash(key), key)) == null)
         return null;
     // Nếu accessOrder là true, thì gọi afterNodeAccess để di chuyển phần tử hiện tại đến cuối danh sách liên kết
     if (accessOrder)
         afterNodeAccess(e);
     // Trả về giá trị của cặp khóa-giá trị
     return e.value;
 }
```

Từ mã nguồn có thể thấy, các bước thực thi của `get` rất đơn giản:

1. Gọi `getNode` của lớp cha `HashMap` để lấy cặp khóa-giá trị, nếu rỗng thì trả về trực tiếp.
2. Phán đoán `accessOrder` có phải là true hay không, nếu là true thì cần đảm bảo tính có thứ tự truy cập của danh sách liên kết `LinkedHashMap`, thực hiện bước 3.
3. Gọi `afterNodeAccess` được `LinkedHashMap` ghi đè để thêm phần tử hiện tại vào cuối danh sách liên kết.

Điểm mấu chốt nằm ở cách triển khai phương thức `afterNodeAccess`, phương thức này chịu trách nhiệm di chuyển phần tử đến cuối danh sách liên kết.

```java
void afterNodeAccess(Node < K, V > e) { // move node to last
    LinkedHashMap.Entry < K, V > last;
    // Nếu accessOrder là true và nút hiện tại không phải là nút cuối danh sách liên kết
    if (accessOrder && (last = tail) != e) {

        // Lấy nút hiện tại, cũng như nút tiền nhiệm và nút kế nhiệm
        LinkedHashMap.Entry < K, V > p =
            (LinkedHashMap.Entry < K, V > ) e, b = p.before, a = p.after;

        // Đặt con trỏ kế nhiệm của nút hiện tại thành null, khiến nó ngắt kết nối với nút kế nhiệm
        p.after = null;

        // Nếu nút tiền nhiệm rỗng, thì nút hiện tại là nút đầu danh sách liên kết, nên đặt nút kế nhiệm làm nút đầu
        if (b == null)
            head = a;
        else
            // Nếu nút tiền nhiệm không rỗng, thì để nút tiền nhiệm trỏ đến nút kế nhiệm
            b.after = a;

        // Nếu nút kế nhiệm không rỗng, thì để nút kế nhiệm trỏ đến nút tiền nhiệm
        if (a != null)
            a.before = b;
        else
            // Nếu nút kế nhiệm rỗng, thì nút hiện tại ở cuối danh sách liên kết, trực tiếp để last trỏ đến nút tiền nhiệm. Thực ra else này không có ý nghĩa, vì if đầu tiên đã đảm bảo p không phải là nút cuối, nên after tự nhiên sẽ không phải là null
            last = b;

        // Nếu last rỗng, thì danh sách liên kết hiện tại chỉ có một nút p, thì trỏ head đến p
        if (last == null)
            head = p;
        else {
            // Ngược lại để con trỏ tiền nhiệm của p trỏ đến nút cuối, rồi để con trỏ tiền nhiệm của nút cuối trỏ đến p
            p.before = last;
            last.after = p;
        }
        // tail trỏ đến p, từ đó di chuyển nút p đến cuối danh sách liên kết
        tail = p;

        ++modCount;
    }
}
```

Từ mã nguồn có thể thấy, phương thức `afterNodeAccess` đã hoàn thành các thao tác sau:

1. Nếu `accessOrder` là true và phần cuối danh sách liên kết không phải là nút hiện tại p, chúng ta cần di chuyển nút hiện tại đến cuối danh sách liên kết.
2. Lấy nút hiện tại p, cũng như nút tiền nhiệm b và nút kế nhiệm a của nó.
3. Đặt con trỏ kế nhiệm của nút hiện tại p thành null, khiến nó ngắt kết nối với nút kế nhiệm p.
4. Thử để nút tiền nhiệm trỏ đến nút kế nhiệm, nếu nút tiền nhiệm rỗng, thì nút hiện tại p chính là nút đầu danh sách liên kết, nên trực tiếp đặt nút kế nhiệm a làm nút đầu, sau đó chúng ta lại nối p vào cuối a.
5. Lại thử để nút kế nhiệm a trỏ đến nút tiền nhiệm b.
6. Thao tác trên khiến nút tiền nhiệm và nút kế nhiệm hoàn thành liên kết, và tách nút hiện tại p ra độc lập. Bước này là nối nút hiện tại p vào cuối danh sách liên kết. Nếu cuối danh sách liên kết rỗng, thì danh sách liên kết hiện tại chỉ có một nút p, nên trực tiếp để head trỏ đến p là được.
7. Thao tác trên đã đưa p thành công đến cuối danh sách liên kết, cuối cùng chúng ta để con trỏ tail tức con trỏ trỏ đến cuối danh sách liên kết trỏ đến p là được.

Có thể kết hợp với hình này để hiểu, minh họa phần tử có key là 13 được di chuyển đến cuối danh sách liên kết.

![LinkedHashMap di chuyển phần tử 13 đến cuối danh sách liên kết](https://oss.javaguide.cn/github/javaguide/java/collection/linkedhashmap-get.png)

Không hiểu rõ lắm cũng không sao, biết tác dụng của phương thức này là đủ rồi, sau này có thời gian hãy từ từ tiêu hóa.

### newNode — Nút mới được nối vào cuối danh sách liên kết

Phần trên đã giới thiệu cách `afterNodeAccess` di chuyển **nút đã tồn tại** đến cuối danh sách liên kết, vậy **nút mới được chèn** được thêm vào danh sách liên kết như thế nào?

Câu trả lời nằm ở chỗ `LinkedHashMap` ghi đè phương thức `newNode` của `HashMap`. Khi `HashMap` chèn cặp khóa-giá trị mới, nó sẽ gọi `newNode` để tạo đối tượng nút. `LinkedHashMap` trong phương thức ghi đè không chỉ tạo nút `Entry`, mà còn gọi thêm `linkNodeLast` để liên kết nó vào cuối danh sách liên kết đôi:

```java
// HashMap's newNode is the standard implementation
Node<K,V> newNode(int hash, K key, V value, Node<K,V> next) {
    return new Node<>(hash, key, value, next);
}

// LinkedHashMap overrides newNode, additionally calling linkNodeLast
Node<K,V> newNode(int hash, K key, V value, Node<K,V> e) {
    LinkedHashMap.Entry<K,V> p =
        new LinkedHashMap.Entry<>(hash, key, value, e);
    linkNodeLast(p);  // Key: link the new node to the end of the list
    return p;
}
```

Cách triển khai của phương thức `linkNodeLast` như sau:

```java
// Link the node to the tail of the doubly linked list
private void linkNodeLast(LinkedHashMap.Entry<K,V> p) {
    LinkedHashMap.Entry<K,V> last = tail;
    tail = p;  // tail points to the new node
    if (last == null)
        head = p;  // List is empty, head also points to the new node
    else {
        p.before = last;  // The new node's predecessor points to the original tail node
        last.after = p;   // The original tail node's successor points to the new node
    }
}
```

**Đây chính là cơ chế cốt lõi để LinkedHashMap thực hiện thứ tự chèn**: mỗi lần chèn nút mới, thông qua việc ghi đè `newNode` và gọi `linkNodeLast`, nút mới được nối vào cuối danh sách liên kết đôi. Như vậy khi duyệt, bắt đầu từ nút đầu `head` đi theo con trỏ `after`, có thể lấy tất cả phần tử theo thứ tự chèn.

Tương tự, `LinkedHashMap` cũng ghi đè phương thức `newTreeNode`, đảm bảo nút cây khi được chèn cũng sẽ được liên kết vào cuối danh sách liên kết:

```java
TreeNode<K,V> newTreeNode(int hash, K key, V value, Node<K,V> next) {
    TreeNode<K,V> p = new TreeNode<K,V>(hash, key, value, next);
    linkNodeLast(p);
    return p;
}
```

### Thao tác hậu xóa — afterNodeRemoval

`LinkedHashMap` không ghi đè phương thức `remove`, mà trực tiếp kế thừa phương thức `remove` của `HashMap`. Để đảm bảo sau khi cặp khóa-giá trị bị xóa, nút trong danh sách liên kết đôi cũng sẽ được đồng bộ xóa, `LinkedHashMap` ghi đè phương thức triển khai rỗng `afterNodeRemoval` của `HashMap`.

```java
final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
        // Lược bỏ
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    tab[index] = node.next;
                else
                    p.next = node.next;
                ++modCount;
                --size;
                // removeNode của HashMap sau khi hoàn thành xóa phần tử sẽ gọi afterNodeRemoval để thực hiện thao tác hậu xóa
                afterNodeRemoval(node);
                return node;
            }
        }
        return null;
    }
// Triển khai rỗng
void afterNodeRemoval(Node<K,V> p) { }
```

Chúng ta có thể thấy phương thức `removeNode` được gọi nội bộ bởi phương thức `remove` kế thừa từ `HashMap`, sau khi xóa nút khỏi bucket, đã gọi `afterNodeRemoval`.

```java
void afterNodeRemoval(Node<K,V> e) { // unlink

    // Lấy nút hiện tại p, cũng như nút tiền nhiệm b và nút kế nhiệm a của e
        LinkedHashMap.Entry<K,V> p =
            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
    // Đặt cả con trỏ tiền nhiệm và kế nhiệm của p thành null, khiến nó ngắt kết nối với nút tiền nhiệm và kế nhiệm
        p.before = p.after = null;

    // Nếu nút tiền nhiệm rỗng, thì nút hiện tại p là nút đầu danh sách liên kết, để con trỏ head trỏ đến nút kế nhiệm a là được
        if (b == null)
            head = a;
        else
        // Nếu nút tiền nhiệm b không rỗng, thì để b trực tiếp trỏ đến nút kế nhiệm a
            b.after = a;

    // Nếu nút kế nhiệm rỗng, thì nút hiện tại p ở cuối danh sách liên kết, nên trực tiếp để con trỏ tail trỏ đến nút tiền nhiệm a là được
        if (a == null)
            tail = b;
        else
        // Ngược lại con trỏ tiền nhiệm của nút kế nhiệm trực tiếp trỏ đến nút tiền nhiệm
            a.before = b;
    }
```

Từ mã nguồn có thể thấy, thao tác tổng thể của phương thức `afterNodeRemoval` là khiến nút hiện tại p ngắt kết nối với nút tiền nhiệm và nút kế nhiệm, chờ gc thu hồi. Các bước tổng thể là:

1. Lấy nút hiện tại p, cũng như nút tiền nhiệm b và nút kế nhiệm a của p.
2. Khiến nút hiện tại p ngắt kết nối với nút tiền nhiệm và kế nhiệm của nó.
3. Thử để nút tiền nhiệm b trỏ đến nút kế nhiệm a, nếu b rỗng thì nút hiện tại p ở đầu danh sách liên kết, chúng ta trực tiếp trỏ head đến nút kế nhiệm a là được.
4. Thử để nút kế nhiệm a trỏ đến nút tiền nhiệm b, nếu a rỗng thì nút hiện tại p ở cuối danh sách liên kết, nên trực tiếp để con trỏ tail trỏ đến nút tiền nhiệm b là được.

Có thể kết hợp với hình này để hiểu, minh họa phần tử có key là 13 bị xóa, tức là bị loại bỏ khỏi danh sách liên kết.

![LinkedHashMap xóa phần tử 13](https://oss.javaguide.cn/github/javaguide/java/collection/linkedhashmap-remove.png)

Không hiểu rõ lắm cũng không sao, biết tác dụng của phương thức này là đủ rồi, sau này có thời gian hãy từ từ tiêu hóa.

### Thao tác hậu chèn — afterNodeInsertion

Tương tự, `LinkedHashMap` không triển khai phương thức chèn, mà trực tiếp kế thừa tất cả phương thức chèn của `HashMap` cho người dùng sử dụng. Nhưng để duy trì tính có thứ tự truy cập của danh sách liên kết đôi, nó đã làm hai việc sau:

1. Ghi đè `afterNodeAccess` (đã đề cập ở trên), nếu key hiện được chèn đã tồn tại trong `map`, vì thao tác chèn của `LinkedHashMap` sẽ nối nút mới vào cuối danh sách liên kết, nên đối với key đã tồn tại thì gọi `afterNodeAccess` để đặt nó vào cuối danh sách liên kết.
2. Ghi đè phương thức `afterNodeInsertion` của `HashMap`, khi `removeEldestEntry` trả về true, sẽ xóa nút đầu danh sách liên kết.

Điểm này chúng ta có thể thấy trong phương thức cốt lõi `putVal` của thao tác chèn `HashMap`.

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
          // Lược bỏ
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                 // Nếu key hiện tại tồn tại trong map, thì gọi afterNodeAccess
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
         // Gọi phương thức hậu chèn, phương thức này được LinkedHashMap ghi đè
        afterNodeInsertion(evict);
        return null;
    }
```

Mã nguồn của các bước trên đã được giải thích ở trên, vì vậy ở đây chúng ta tập trung tìm hiểu quy trình làm việc của `afterNodeInsertion`. Giả sử chúng ta đã ghi đè `removeEldestEntry`, khi `size` của danh sách liên kết vượt quá `capacity`, thì trả về true.

```java
/**
 * Trả về true khi size vượt quá capacity, thông báo cho LinkedHashMap xóa mục cache cũ nhất (tức phần tử đầu tiên của danh sách liên kết)
 */
protected boolean removeEldestEntry(Map.Entry < K, V > eldest) {
    return size() > capacity;
}
```

Lấy hình dưới đây làm ví dụ, giả sử tác giả cuối cùng chèn mới một nút 19 không tồn tại, giả sử `capacity` là 4, nên `removeEldestEntry` trả về true, chúng ta cần xóa nút đầu danh sách liên kết.

![Chèn phần tử mới 19 vào LinkedHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/linkedhashmap-after-insert-1.png)

Các bước xóa rất đơn giản, kiểm tra xem nút đầu danh sách liên kết có tồn tại hay không, nếu tồn tại thì ngắt kết nối giữa nút đầu và nút kế nhiệm, và để con trỏ nút đầu trỏ đến nút tiếp theo, nên con trỏ head trỏ đến 12, nút 10 trở thành đối tượng không có bất kỳ tham chiếu nào trỏ đến, chờ GC.

![Chèn phần tử mới 19 vào LinkedHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/linkedhashmap-after-insert-2.png)

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
        LinkedHashMap.Entry<K,V> first;
        // Nếu evict là true và phần tử đầu hàng không rỗng cũng như removeEldestEntry trả về true, thì chúng ta cần xóa phần tử cũ nhất (tức phần tử ở đầu danh sách liên kết)
        if (evict && (first = head) != null && removeEldestEntry(first)) {
          // Lấy key của cặp khóa-giá trị ở đầu danh sách liên kết
            K key = first.key;
            // Gọi removeNode để xóa phần tử khỏi bucket của HashMap, và ngắt kết nối với danh sách liên kết đôi của LinkedHashMap, chờ gc thu hồi
            removeNode(hash(key), key, null, false, true);
        }
    }
```

Từ mã nguồn có thể thấy, phương thức `afterNodeInsertion` đã hoàn thành các thao tác sau:

1. Phán đoán `eldest` có phải là true hay không, chỉ khi là true mới có thể nói rằng có thể cần xóa cặp khóa-giá trị cũ nhất (tức phần tử ở đầu danh sách liên kết). Cụ thể có tiến hành xóa hay không, còn phải xác định danh sách liên kết có rỗng hay không `((first = head) != null)`, và phương thức `removeEldestEntry` có trả về true hay không. Chỉ khi hai phương thức này trả về true mới có thể xác định danh sách liên kết hiện tại không rỗng, và danh sách liên kết cần tiến hành thao tác xóa.
2. Lấy key của phần tử đầu tiên trong danh sách liên kết.
3. Gọi phương thức `removeNode` của `HashMap`, phương thức này chúng tôi đã đề cập ở trên, nó sẽ xóa nút khỏi bucket của `HashMap`, và `LinkedHashMap` còn ghi đè phương thức `afterNodeRemoval` trong `removeNode`, vì vậy bước này sẽ thông qua việc gọi `removeNode` để xóa phần tử khỏi bucket của `HashMap`, và ngắt kết nối với danh sách liên kết đôi của `LinkedHashMap`, chờ gc thu hồi.

## So sánh hiệu suất duyệt giữa LinkedHashMap và HashMap

`LinkedHashMap` duy trì một danh sách liên kết đôi để ghi lại thứ tự chèn dữ liệu, do đó khi lặp duyệt thông qua iterator được tạo ra, việc duyệt được thực hiện theo đường dẫn của danh sách liên kết đôi. Điểm này so với cách duyệt toàn bộ bucket của `HashMap` thì hiệu quả hơn nhiều.

Điểm này chúng ta có thể xác nhận từ iterator của cả hai. Trước tiên hãy xem iterator của `HashMap`, có thể thấy `HashMap` khi lặp cặp khóa-giá trị sẽ dùng một phương thức `nextNode`, phương thức này sẽ trả về phần tử tiếp theo mà next trỏ đến, và sẽ bắt đầu từ next duyệt bucket để tìm phần tử Node không rỗng tiếp theo trong bucket.

```java
 final class EntryIterator extends HashIterator
 implements Iterator < Map.Entry < K, V >> {
     public final Map.Entry < K,
     V > next() {
         return nextNode();
     }
 }

 // Lấy Node tiếp theo
 final Node < K, V > nextNode() {
     Node < K, V > [] t;
     // Lấy phần tử tiếp theo next
     Node < K, V > e = next;
     if (modCount != expectedModCount)
         throw new ConcurrentModificationException();
     if (e == null)
         throw new NoSuchElementException();
     // Trỏ next đến Node không rỗng tiếp theo trong bucket
     if ((next = (current = e).next) == null && (t = table) != null) {
         do {} while (index < t.length && (next = t[index++]) == null);
     }
     return e;
 }
```

Ngược lại, iterator của `LinkedHashMap` thì trực tiếp sử dụng con trỏ `after` để nhanh chóng định vị nút kế nhiệm của nút hiện tại, ngắn gọn và hiệu quả hơn nhiều.

```java
 final class LinkedEntryIterator extends LinkedHashIterator
 implements Iterator < Map.Entry < K, V >> {
     public final Map.Entry < K,
     V > next() {
         return nextNode();
     }
 }
 // Lấy Node tiếp theo
 final LinkedHashMap.Entry < K, V > nextNode() {
     // Lấy nút tiếp theo next
     LinkedHashMap.Entry < K, V > e = next;
     if (modCount != expectedModCount)
         throw new ConcurrentModificationException();
     if (e == null)
         throw new NoSuchElementException();
     // Con trỏ current trỏ đến nút hiện tại
     current = e;
     // next trực tiếp dùng con trỏ after của nút hiện tại để nhanh chóng định vị nút tiếp theo
     next = e.after;
     return e;
 }
```

Để kiểm chứng quan điểm mà tác giả đã nói, tác giả đã tiến hành stress test trên hai container này, kiểm tra thời gian tiêu tốn khi chèn 10 triệu và lặp 10 triệu bản ghi, mã như sau:

```java
int count = 1000_0000;
Map<Integer, Integer> hashMap = new HashMap<>();
Map<Integer, Integer> linkedHashMap = new LinkedHashMap<>();

long start, end;

start = System.currentTimeMillis();
for (int i = 0; i < count; i++) {
    hashMap.put(ThreadLocalRandom.current().nextInt(1, count), ThreadLocalRandom.current().nextInt(0, count));
}
end = System.currentTimeMillis();
System.out.println("map time putVal: " + (end - start));

start = System.currentTimeMillis();
for (int i = 0; i < count; i++) {
    linkedHashMap.put(ThreadLocalRandom.current().nextInt(1, count), ThreadLocalRandom.current().nextInt(0, count));
}
end = System.currentTimeMillis();
System.out.println("linkedHashMap putVal time: " + (end - start));

start = System.currentTimeMillis();
long num = 0;
for (Integer v : hashMap.values()) {
    num = num + v;
}
end = System.currentTimeMillis();
System.out.println("map get time: " + (end - start));

start = System.currentTimeMillis();
for (Integer v : linkedHashMap.values()) {
    num = num + v;
}
end = System.currentTimeMillis();
System.out.println("linkedHashMap get time: " + (end - start));
System.out.println(num);
```

Từ kết quả đầu ra, vì `LinkedHashMap` cần duy trì danh sách liên kết đôi, việc chèn phần tử sẽ tốn thời gian hơn so với `HashMap`, nhưng nhờ có quan hệ nút trước sau rõ ràng của danh sách liên kết đôi, hiệu suất lặp cao hơn nhiều so với `HashMap`. Tuy nhiên, nhìn chung thì khác biệt không lớn, dù sao lượng dữ liệu cũng lớn như vậy.

```bash
map time putVal: 5880
linkedHashMap putVal time: 7567
map get time: 143
linkedHashMap get time: 67
63208969074998
```

## Các câu hỏi phỏng vấn thường gặp về LinkedHashMap

### LinkedHashMap là gì?

`LinkedHashMap` là một lớp con của `HashMap` trong Java Collections Framework, nó kế thừa tất cả thuộc tính và phương thức của `HashMap`, và trên nền `HashMap` ghi đè các phương thức `afterNodeRemoval`, `afterNodeInsertion`, `afterNodeAccess`, giúp nó có đặc điểm chèn có thứ tự và truy cập có thứ tự.

### LinkedHashMap làm thế nào để lặp phần tử theo thứ tự chèn?

`LinkedHashMap` lặp phần tử theo thứ tự chèn là hành vi mặc định của nó. `LinkedHashMap` nội bộ duy trì một danh sách liên kết đôi, dùng để ghi lại thứ tự chèn của phần tử. Do đó, khi sử dụng iterator để lặp phần tử, thứ tự của phần tử giống với thứ tự chúng được chèn vào ban đầu.

### LinkedHashMap làm thế nào để lặp phần tử theo thứ tự truy cập?

`LinkedHashMap` có thể thông qua tham số `accessOrder` trong constructor để chỉ định lặp phần tử theo thứ tự truy cập. Khi `accessOrder` là true, mỗi lần truy cập một phần tử, phần tử đó sẽ được di chuyển đến cuối danh sách liên kết, do đó lần truy cập tiếp theo phần tử đó, nó sẽ trở thành phần tử cuối cùng trong danh sách liên kết, từ đó thực hiện lặp phần tử theo thứ tự truy cập.

### LinkedHashMap làm thế nào để triển khai LRU cache?

Đặt `accessOrder` thành true và ghi đè phương thức `removeEldestEntry` trả về true khi kích thước danh sách liên kết vượt quá dung lượng, khiến mỗi lần truy cập một phần tử, phần tử đó sẽ được di chuyển đến cuối danh sách liên kết. Một khi thao tác chèn khiến `removeEldestEntry` trả về true, được coi là cache đã đầy, `LinkedHashMap` sẽ xóa phần tử đầu danh sách liên kết, từ đó chúng ta có thể triển khai một LRU cache.

### LinkedHashMap và HashMap có gì khác nhau?

`LinkedHashMap` và `HashMap` đều là các lớp triển khai của interface Map trong Java Collections Framework. Sự khác biệt lớn nhất của chúng nằm ở thứ tự lặp phần tử. Thứ tự lặp phần tử của `HashMap` là không xác định, trong khi `LinkedHashMap` cung cấp chức năng lặp phần tử theo thứ tự chèn hoặc thứ tự truy cập. Ngoài ra, `LinkedHashMap` nội bộ duy trì một danh sách liên kết đôi, dùng để ghi lại thứ tự chèn hoặc thứ tự truy cập của phần tử, còn `HashMap` thì không có danh sách liên kết này. Do đó, hiệu suất chèn của `LinkedHashMap` có thể thấp hơn một chút so với `HashMap`, nhưng nó cung cấp nhiều chức năng hơn và hiệu suất lặp cao hơn so với `HashMap`.

## Tài liệu tham khảo

- LinkedHashMap Source Code Detailed Analysis (JDK1.8): <https://www.imooc.com/article/22931>
- HashMap and LinkedHashMap: <https://www.cnblogs.com/Spground/p/8536148.html>
- Derived from LinkedHashMap Source Code: <https://leetcode.cn/problems/lru-cache/solution/yuan-yu-linkedhashmapyuan-ma-by-jeromememory/>
<!-- @include: @article-footer.snippet.md -->
