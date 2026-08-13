---
title: Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 2)
description: "Câu hỏi phỏng vấn Java Collection tần suất cao: phân tích chuyên sâu nguyên lý底层 của HashMap, chuyển đổi Red-Black Tree, giải quyết hash collision, cơ chế thread-safe của ConcurrentHashMap, sự khác biệt với Hashtable và các kiến thức cốt lõi khác."
category: Java
tag:
  - Java Collection
head:
  - - meta
    - name: keywords
      content: HashMap,ConcurrentHashMap,Hashtable,Red-Black Tree,Hash Collision,Thread Safe,Collection Interview Questions
---

<!-- @include: @article-header.snippet.md -->

## Map (Quan trọng)

### ⭐️ Sự khác biệt giữa HashMap và Hashtable

- **Thread-safe:** `HashMap` không thread-safe, `Hashtable` thì có, vì hầu hết các phương thức bên trong `Hashtable` đều được đánh dấu `synchronized`. (Nếu bạn cần đảm bảo thread-safe, hãy dùng `ConcurrentHashMap`!)
- **Hiệu suất:** Do vấn đề thread-safe, `HashMap` có hiệu suất cao hơn `Hashtable` một chút. Ngoài ra, `Hashtable` về cơ bản đã bị loại bỏ, không nên dùng trong code nữa.
- **Hỗ trợ Null key và Null value:** `HashMap` có thể lưu trữ null key và null value, nhưng null key chỉ được có một, null value có thể có nhiều; `Hashtable` không cho phép null key và null value, nếu không sẽ ném ra `NullPointerException`.
- **Sự khác biệt về dung lượng khởi tạo và mức mở rộng:** ① Khi tạo mà không chỉ định dung lượng khởi tạo, `Hashtable` mặc định có kích thước khởi tạo là 11, mỗi lần mở rộng sau đó, dung lượng sẽ thành 2n+1. `HashMap` mặc định có kích thước khởi tạo là 16, mỗi lần mở rộng sau đó, dung lượng sẽ tăng gấp đôi. ② Khi tạo có chỉ định dung lượng khởi tạo, `Hashtable` sẽ dùng trực tiếp kích thước bạn đưa, còn `HashMap` sẽ mở rộng nó lên lũy thừa của 2 gần nhất (được đảm bảo bởi phương thức `tableSizeFor()` trong `HashMap`, mã nguồn bên dưới). Nói cách khác, `HashMap` luôn dùng lũy thừa của 2 làm kích thước bảng băm, lý do sẽ được giải thích sau.
- **Cấu trúc dữ liệu底层:** Từ JDK 1.8 trở đi, `HashMap` có thay đổi lớn trong việc giải quyết hash collision: khi độ dài linked list vượt quá ngưỡng (mặc định là 8), linked list sẽ được chuyển thành Red-Black Tree (trước khi chuyển sẽ kiểm tra, nếu độ dài mảng hiện tại nhỏ hơn 64, sẽ ưu tiên mở rộng mảng thay vì chuyển thành Red-Black Tree), để giảm thời gian tìm kiếm (phần sau tôi sẽ phân tích quá trình này kết hợp với mã nguồn). `Hashtable` không có cơ chế này.
- **Cài đặt hàm băm:** `HashMap` thực hiện xáo trộn (perturbation) giữa bit cao và bit thấp của hash value để giảm collision, trong khi `Hashtable` dùng trực tiếp giá trị `hashCode()` của key.

**Constructor có tham số dung lượng khởi tạo trong `HashMap`:**

```java
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }
     public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }
```

Phương thức dưới đây đảm bảo `HashMap` luôn dùng lũy thừa của 2 làm kích thước bảng băm.

```java
/**
 * Returns a power of two size for the given target capacity.
 */
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

### Sự khác biệt giữa HashMap và HashSet

Nếu bạn đã xem mã nguồn của `HashSet` thì sẽ biết: `HashSet` được cài đặt dựa trên `HashMap`. (Mã nguồn của `HashSet` rất rất ít, vì ngoài `clone()`, `writeObject()`, `readObject()` là những phương thức `HashSet` buộc phải tự cài đặt, còn lại đều gọi trực tiếp phương thức trong `HashMap`.)

|               `HashMap`               |                                                                                   `HashSet`                                                                                   |
| :-----------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|        Cài đặt `Map` interface        |                                                                            Cài đặt `Set` interface                                                                            |
|        Lưu trữ key-value pairs        |                                                                              Chỉ lưu trữ object                                                                               |
|  Gọi `put()` để thêm phần tử vào map  |                                                                     Gọi `add()` để thêm phần tử vào `Set`                                                                     |
| `HashMap` dùng Key để tính `hashcode` | `HashSet` dùng member object để tính `hashcode`, đối với hai object, `hashcode` có thể giống nhau, nên phương thức `equals()` được dùng để kiểm tra tính bằng nhau của object |

### ⭐️ Sự khác biệt giữa HashMap và TreeMap

`TreeMap` và `HashMap` đều kế thừa từ `AbstractMap`, nhưng cần lưu ý `TreeMap` còn cài đặt `NavigableMap` interface và `SortedMap` interface.

![TreeMap inheritance diagram](https://oss.javaguide.cn/github/javaguide/java/collection/treemap_hierarchy.png)

Cài đặt `NavigableMap` interface cho phép `TreeMap` có khả năng tìm kiếm các phần tử trong collection.

`NavigableMap` interface cung cấp các phương thức phong phú để khám phá và thao tác với key-value pairs:

1. **Tìm kiếm định hướng**: `ceilingEntry()`, `floorEntry()`, `higherEntry()` và `lowerEntry()` có thể dùng để định vị key-value pair gần nhất lớn hơn hoặc bằng, nhỏ hơn hoặc bằng, lớn hơn nghiêm ngặt, nhỏ hơn nghiêm ngặt so với key đã cho.
2. **Thao tác tập con**: `subMap()`, `headMap()` và `tailMap()` có thể tạo hiệu quả các view của tập con từ collection gốc mà không cần sao chép toàn bộ collection.
3. **View thứ tự ngược**: `descendingMap()` trả về một view `NavigableMap` theo thứ tự ngược, cho phép duyệt ngược toàn bộ `TreeMap`.
4. **Thao tác biên**: `firstEntry()`, `lastEntry()`, `pollFirstEntry()` và `pollLastEntry()` có thể truy cập và xóa phần tử một cách thuận tiện.

Các phương thức này đều được cài đặt dựa trên thuộc tính của cấu trúc dữ liệu Red-Black Tree. Red-Black Tree duy trì trạng thái cân bằng, đảm bảo độ phức tạp thời gian của thao tác tìm kiếm là O(log n), khiến `TreeMap` trở thành công cụ mạnh mẽ để xử lý các bài toán tìm kiếm trên collection có thứ tự.

Cài đặt `SortedMap` interface cho phép `TreeMap` có khả năng sắp xếp các phần tử theo key. Mặc định sắp xếp theo thứ tự tăng dần của key, nhưng chúng ta cũng có thể chỉ định comparator tùy chỉnh. Ví dụ:

```java
/**
 * @author shuang.kou
 * @createTime 2020年06月15日 17:02:00
 */
public class Person {
    private Integer age;

    public Person(Integer age) {
        this.age = age;
    }

    public Integer getAge() {
        return age;
    }


    public static void main(String[] args) {
        TreeMap<Person, String> treeMap = new TreeMap<>(new Comparator<Person>() {
            @Override
            public int compare(Person person1, Person person2) {
                int num = person1.getAge() - person2.getAge();
                return Integer.compare(num, 0);
            }
        });
        treeMap.put(new Person(3), "person1");
        treeMap.put(new Person(18), "person2");
        treeMap.put(new Person(35), "person3");
        treeMap.put(new Person(16), "person4");
        treeMap.entrySet().stream().forEach(personStringEntry -> {
            System.out.println(personStringEntry.getValue());
        });
    }
}
```

Output:

```plain
person1
person4
person2
person3
```

Có thể thấy, các phần tử trong `TreeMap` đã được sắp xếp theo thứ tự tăng dần của trường age trong `Person`.

Ở trên, chúng ta đã cài đặt bằng cách truyền anonymous inner class, bạn có thể thay bằng Lambda expression:

```java
TreeMap<Person, String> treeMap = new TreeMap<>((person1, person2) -> {
  int num = person1.getAge() - person2.getAge();
  return Integer.compare(num, 0);
});
```

**Tóm lại, so với `HashMap`, `TreeMap` có thêm khả năng sắp xếp các phần tử theo key và khả năng tìm kiếm các phần tử trong collection.**

### HashSet kiểm tra trùng lặp như thế nào?

Nội dung dưới đây được trích từ cuốn sách Java nhập môn của tôi "Head First Java" phiên bản thứ hai:

> Khi bạn thêm object vào `HashSet`, `HashSet` sẽ tính giá trị `hashcode` của object để xác định vị trí thêm vào, đồng thời so sánh với `hashcode` của các object đã được thêm vào. Nếu không có `hashcode` trùng khớp, `HashSet` sẽ giả định object không bị trùng lặp. Nhưng nếu phát hiện có object có cùng giá trị `hashcode`, lúc này nó sẽ gọi phương thức `equals()` để kiểm tra xem các object có `hashcode` bằng nhau có thực sự giống nhau hay không. Nếu giống nhau, `HashSet` sẽ không cho phép thao tác thêm vào thành công.

Trong JDK 1.8, phương thức `add()` của `HashSet` chỉ đơn giản gọi phương thức `put()` của `HashMap` và kiểm tra giá trị trả về để đảm bảo không có phần tử trùng lặp. Hãy xem mã nguồn của `HashSet`:

```java
// Returns: true if this set did not already contain the specified element
// Giá trị trả về: true nếu set chưa chứa phần tử được add
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
}
```

Và trong phương thức `putVal()` của `HashMap` cũng có thể thấy mô tả sau:

```java
// Returns : previous value, or null if none
// Giá trị trả về: nếu vị trí insert không có phần tử thì trả về null, ngược lại trả về phần tử trước đó
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
...
}
```

Nói cách khác, trong JDK 1.8, nếu `HashSet` đã tồn tại phần tử giống nhau, `HashMap`底层 sẽ giữ lại key ban đầu, `HashSet#add()` trả về `false`; chỉ khi không tồn tại mới thêm phần tử mới và trả về `true`.

### ⭐️ Cài đặt底层 của HashMap

#### Trước JDK 1.8

Trước JDK 1.8, `HashMap`底层 sử dụng kết hợp **mảng (array) và linked list**, tức là **linked list hashing**. HashMap lấy `hashcode` của key, xử lý qua hàm扰动 (perturbation function) để có được hash value, sau đó dùng `(n - 1) & hash` để xác định vị trí lưu trữ phần tử (n ở đây là độ dài của mảng). Nếu vị trí hiện tại đã có phần tử, sẽ kiểm tra hash value và key của phần tử đó với phần tử cần lưu có giống nhau không, nếu giống thì ghi đè trực tiếp, nếu không thì giải quyết collision bằng phương pháp dây chuyền (separate chaining).

Hàm扰动 (phương thức `hash`) trong `HashMap` được dùng để tối ưu hóa phân phối của hash value. Bằng cách xử lý thêm `hashCode()` gốc, hàm扰动 có thể giảm collision do cài đặt `hashCode()` kém, từ đó cải thiện tính đồng đều trong phân phối dữ liệu.

**Mã nguồn phương thức hash của JDK 1.8 HashMap:**

Phương thức hash của JDK 1.8 đơn giản hơn so với JDK 1.7, nhưng nguyên lý không thay đổi.

```java
    static final int hash(Object key) {
      int h;
      // key.hashCode()：trả về hash value, tức là hashcode
      // ^：bitwise XOR
      // >>>: unsigned right shift, bỏ qua bit dấu, các vị trí trống được điền bằng 0
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
  }
```

So sánh với mã nguồn phương thức hash của JDK 1.7 HashMap:

```java
static int hash(int h) {
    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).

    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

So với phương thức hash của JDK 1.8, phương thức hash của JDK 1.7 có hiệu suất kém hơn một chút, vì dù sao cũng đã xáo trộn 4 lần.

Cái gọi là **"phương pháp dây chuyền" (separate chaining)** là: kết hợp linked list và mảng. Nghĩa là tạo một mảng các linked list, mỗi ô trong mảng là một linked list. Nếu gặp hash collision, giá trị bị collision sẽ được thêm vào linked list.

![Cấu trúc nội bộ trước JDK 1.8 - HashMap](https://oss.javaguide.cn/github/javaguide/java/collection/jdk1.7_hashmap.png)

#### Từ JDK 1.8 trở đi

So với các phiên bản trước, từ JDK 1.8 trở đi có thay đổi lớn trong việc giải quyết hash collision: khi độ dài linked list vượt quá ngưỡng (mặc định là 8) (trước khi chuyển linked list thành Red-Black Tree sẽ kiểm tra, nếu độ dài mảng hiện tại nhỏ hơn 64, sẽ ưu tiên mở rộng mảng thay vì chuyển thành Red-Black Tree), linked list sẽ được chuyển thành Red-Black Tree.

Mục đích là để giảm thời gian tìm kiếm: hiệu suất truy vấn của linked list là O(n) (n là độ dài linked list), Red-Black Tree là một cây tìm kiếm nhị phân tự cân bằng, hiệu suất truy vấn là O(log n). Khi linked list ngắn, sự khác biệt hiệu suất giữa O(n) và O(log n) không rõ rệt. Nhưng khi linked list dài ra, hiệu suất truy vấn sẽ giảm đáng kể.

![Cấu trúc nội bộ sau JDK 1.8 - HashMap](https://oss.javaguide.cn/github/javaguide/java/collection/jdk1.8_hashmap.png)

**Tại sao ưu tiên mở rộng mảng thay vì chuyển trực tiếp thành Red-Black Tree?**

Mở rộng mảng có thể giảm xác suất xảy ra hash collision (tức là phân tán lại các phần tử vào mảng mới, lớn hơn), điều này trong đa số trường hợp hiệu quả hơn so với chuyển trực tiếp thành Red-Black Tree.

Red-Black Tree cần duy trì tự cân bằng, chi phí bảo trì cao. Hơn nữa, việc đưa Red-Black Tree vào quá sớm sẽ làm tăng độ phức tạp.

**Tại sao chọn ngưỡng 8 và 64?**

1. Phân phối Poisson cho thấy, xác suất linked list đạt độ dài 8 là cực kỳ thấp (dưới một phần mười triệu). Trong đại đa số trường hợp, độ dài linked list không vượt quá 8. Đặt ngưỡng là 8 có thể đảm bảo cân bằng giữa hiệu suất và hiệu quả không gian.
2. Ngưỡng độ dài mảng 64 cũng là giá trị kinh nghiệm được kiểm chứng qua thực tiễn. Trong mảng nhỏ, chi phí mở rộng thấp, ưu tiên mở rộng có thể tránh đưa Red-Black Tree vào quá sớm. Khi kích thước mảng đạt 64, xác suất collision cao hơn, lúc này ưu thế hiệu suất của Red-Black Tree bắt đầu thể hiện.

> TreeMap, TreeSet và HashMap từ JDK 1.8 trở đi đều sử dụng Red-Black Tree ở底层. Red-Black Tree được tạo ra để giải quyết nhược điểm của Binary Search Tree, vì Binary Search Tree trong một số trường hợp có thể suy biến thành cấu trúc tuyến tính.

Hãy cùng phân tích quá trình chuyển đổi từ linked list sang Red-Black Tree trong `HashMap` kết hợp với mã nguồn.

**1. Logic kiểm tra chuyển linked list thành Red-Black Tree trong phương thức `putVal`.**

Khi độ dài linked list lớn hơn 8, thực thi logic `treeifyBin` (chuyển thành Red-Black Tree).

```java
// Duyệt linked list
for (int binCount = 0; ; ++binCount) {
    // Duyệt đến node cuối cùng của linked list
    if ((e = p.next) == null) {
        p.next = newNode(hash, key, value, null);
        // Nếu số phần tử linked list lớn hơn TREEIFY_THRESHOLD（8）
        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
            // Chuyển đổi Red-Black Tree（không chuyển trực tiếp thành Red-Black Tree）
            treeifyBin(tab, hash);
        break;
    }
    if (e.hash == hash &&
        ((k = e.key) == key || (key != null && key.equals(k))))
        break;
    p = e;
}
```

**2. Phương thức `treeifyBin` kiểm tra xem có thực sự chuyển thành Red-Black Tree hay không.**

```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    // Kiểm tra độ dài mảng hiện tại có nhỏ hơn 64 không
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        // Nếu độ dài mảng hiện tại nhỏ hơn 64, sẽ ưu tiên mở rộng mảng
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        // Ngược lại mới chuyển linked list thành Red-Black Tree

        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

Trước khi chuyển linked list thành Red-Black Tree sẽ kiểm tra, nếu độ dài mảng hiện tại nhỏ hơn 64, sẽ ưu tiên mở rộng mảng thay vì chuyển thành Red-Black Tree.

### ⭐️ Tại sao độ dài của HashMap là lũy thừa của 2

Để `HashMap` truy cập hiệu quả và giảm collision, chúng ta cần đảm bảo dữ liệu được phân phối đồng đều nhất có thể. Hash value trong Java thường được biểu diễn bằng `int`, phạm vi từ `-2147483648 ~ 2147483647`, tổng cộng khoảng 4 tỷ không gian ánh xạ. Chỉ cần hàm băm ánh xạ đủ đồng đều và phân tán, thông thường rất khó xảy ra collision. Nhưng vấn đề là một mảng dài 4 tỷ phần tử thì bộ nhớ không thể chứa được. Vì vậy, hash value này không thể dùng trực tiếp. Trước khi dùng, cần thực hiện phép toán modulo với độ dài mảng, số dư thu được mới được dùng làm vị trí lưu trữ, tức là chỉ số mảng tương ứng.

**Thuật toán này nên được thiết kế như thế nào?**

Đầu tiên chúng ta có thể nghĩ đến việc dùng phép toán `%` (modulo). Đối với `hash` không âm, khi `length` là lũy thừa của 2, `hash % length` tương đương với `hash & (length - 1)`. `HashMap` sử dụng cách sau để tính chỉ số mảng.

Ngoài lý do phép toán bit hiệu quả hơn phép modulo, tôi nghĩ một lý do quan trọng hơn là: **độ dài là lũy thừa của 2, cho phép `HashMap` mở rộng đồng đều hơn**. Ví dụ:

- length = 8, length - 1 = 7, biểu diễn nhị phân `0111`
- length = 16, length - 1 = 15, biểu diễn nhị phân `1111`

Lúc này, khi tính vị trí mảng mới cho các phần tử hiện có trong `HashMap` bằng `hash&(length-1)`, phụ thuộc vào bit nhị phân thứ tư (tính từ phải sang) của hash, sẽ có hai trường hợp:

1. Bit nhị phân thứ tư là 0, vị trí mảng không đổi, nghĩa là phần tử hiện tại có cùng vị trí trong mảng cũ và mảng mới.
2. Bit nhị phân thứ tư là 1, vị trí mảng nằm ở phần được mở rộng thêm của mảng mới.

Dưới đây là một ví dụ:

```plain
Giả sử có một phần tử với hash value là 10101100

Tính vị trí trong mảng cũ:
hash        = 10101100
length - 1  = 00000111
& -----------------
index       = 00000100  (4)

Tính vị trí trong mảng mới:
hash        = 10101100
length - 1  = 00001111
& -----------------
index       = 00001100  (12)

Xét bit thứ tư (từ phải sang):
1. Bit cao là 0：vị trí không đổi.
2. Bit cao là 1：di chuyển đến vị trí mới（vị trí cũ + dung lượng cũ）.
```

⚠️Lưu ý: Ví dụ ở đây xét bit nhị phân thứ tư, chính xác hơn là xét bit cao (tính từ phải sang). Ví dụ khi `length = 32`, `length - 1 = 31`, nhị phân là `11111`, lúc này xét bit nhị phân thứ năm.

Nói cách khác, sau khi mở rộng, trong trường hợp hash value của các phần tử trong mảng cũ được phân phối tương đối đồng đều (còn việc hash value có đồng đều hay không phụ thuộc vào phương thức `hashcode()` của object và hàm扰动 đã đề cập ở trên), các phần tử trong mảng mới cũng sẽ được phân phối tương đối đồng đều, trường hợp tốt nhất là một nửa ở nửa trước của mảng mới, một nửa ở nửa sau của mảng mới.

Điều này cũng khiến cơ chế mở rộng trở nên đơn giản và hiệu quả, sau khi mở rộng chỉ cần kiểm tra sự thay đổi của bit cao trong hash value để quyết định vị trí mới của phần tử: hoặc vị trí không đổi (bit cao là 0), hoặc di chuyển đến vị trí mới (bit cao là 1, vị trí cũ + dung lượng cũ).

Cuối cùng, tóm tắt lý do độ dài của `HashMap` là lũy thừa của 2:

1. Phép toán bit hiệu quả hơn: Phép toán bit (&) hiệu quả hơn phép modulo (%). Đối với `hash` không âm, khi độ dài là lũy thừa của 2, `hash % length` tương đương với `hash & (length - 1)`.
2. Đảm bảo phân phối đồng đều hash value tốt hơn: Sau khi mở rộng, trong trường hợp hash value của các phần tử trong mảng cũ được phân phối tương đối đồng đều, các phần tử trong mảng mới cũng sẽ được phân phối tương đối đồng đều, trường hợp tốt nhất là một nửa ở nửa trước của mảng mới, một nửa ở nửa sau của mảng mới.
3. Cơ chế mở rộng trở nên đơn giản và hiệu quả: Sau khi mở rộng chỉ cần kiểm tra sự thay đổi của bit cao trong hash value để quyết định vị trí mới của phần tử: hoặc vị trí không đổi (bit cao là 0), hoặc di chuyển đến vị trí mới (bit cao là 1, vị trí cũ + dung lượng cũ).

### ⭐️ Vấn đề vòng lặp vô hạn trong HashMap khi thao tác đa luồng

`HashMap` phiên bản JDK 1.7 trở về trước trong môi trường đa luồng có thể gặp vấn đề vòng lặp vô hạn khi thực hiện thao tác mở rộng (resize). Điều này xảy ra do khi một bucket có nhiều phần tử cần mở rộng, nhiều thread cùng thao tác trên linked list, phương pháp chèn đầu (head insertion) có thể khiến node trong linked list trỏ đến vị trí sai, từ đó tạo thành một linked list vòng (circular linked list), khiến thao tác truy vấn phần tử rơi vào vòng lặp vô hạn không thể kết thúc.

Để giải quyết vấn đề này, HashMap phiên bản JDK 1.8 đã áp dụng phương pháp chèn đuôi (tail insertion) thay vì chèn đầu để tránh đảo ngược linked list, khiến node được chèn luôn được đặt ở cuối linked list, tránh cấu trúc vòng trong linked list. Nhưng vẫn không khuyến nghị sử dụng `HashMap` trong môi trường đa luồng, vì dùng `HashMap` trong đa luồng vẫn tồn tại vấn đề ghi đè dữ liệu. Trong môi trường concurrent, khuyến nghị sử dụng `ConcurrentHashMap`.

Thông thường trong phỏng vấn, giới thiệu như vậy là đủ, không cần nhớ các chi tiết, cá nhân tôi nghĩ cũng không cần thiết. Nếu muốn tìm hiểu chi tiết về vấn đề vòng lặp vô hạn khi mở rộng `HashMap`, có thể xem bài viết này của anh Haozishu: [Java HashMap infinite loop](https://coolshell.cn/articles/9606.html).

### ⭐️ Tại sao HashMap không thread-safe?

`HashMap` không thread-safe. Trong môi trường đa luồng, thực hiện thao tác ghi đồng thời trên `HashMap` có thể dẫn đến hai vấn đề chính:

1. **Mất dữ liệu**: Thao tác `put` đồng thời có thể khiến ghi của một thread bị thread khác ghi đè.
2. **Vòng lặp vô hạn**: Trong JDK 7 trở về trước, khi mở rộng đồng thời, do phương pháp chèn đầu có thể khiến linked list tạo thành vòng, từ đó gây ra vòng lặp vô hạn khi thực hiện `get`, CPU tăng vọt lên 100%.

Vấn đề mất dữ liệu tồn tại cả trong JDK 1.7 và JDK 1.8, ở đây lấy JDK 1.8 làm ví dụ.

Từ JDK 1.8 trở đi, trong `HashMap`, nhiều key-value pair có thể được phân vào cùng một bucket và được lưu trữ dưới dạng linked list hoặc Red-Black Tree. Nhiều thread thực hiện thao tác `put` trên `HashMap` sẽ dẫn đến không thread-safe, cụ thể là có rủi ro ghi đè dữ liệu.

Ví dụ:

- Hai thread 1, 2 đồng thời thực hiện thao tác put và xảy ra hash collision (chỉ số insert được tính bởi hàm hash là giống nhau).
- Các thread khác nhau có thể nhận được cơ hội thực thi CPU trong các time slice khác nhau. Thread 1 hiện tại sau khi thực hiện xong kiểm tra hash collision, do hết time slice nên bị tạm dừng. Thread 2 hoàn thành thao tác insert trước.
- Sau đó, thread 1 nhận được time slice, do trước đó đã thực hiện kiểm tra hash collision, nên lúc này sẽ thực hiện insert trực tiếp, dẫn đến dữ liệu được thread 2 insert bị thread 1 ghi đè.

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    // ...
    // Kiểm tra có xảy ra hash collision không
    // (n - 1) & hash xác định phần tử được lưu trong bucket nào, bucket trống, tạo node mới đưa vào bucket (lúc này, node này được đặt trong mảng)
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    // Trong bucket đã có phần tử（xử lý hash collision）
    else {
    // ...
}
```

Còn một trường hợp nữa là hai thread đồng thời thực hiện `put` dẫn đến giá trị `size` không chính xác:

1. Thread 1 thực hiện kiểm tra `if(++size > threshold)`, giả sử nhận được giá trị `size` là 10, do hết time slice nên bị tạm dừng.
2. Thread 2 cũng thực hiện kiểm tra `if(++size > threshold)`, nhận được giá trị `size` cũng là 10, và chèn phần tử vào bucket đó, đồng thời cập nhật giá trị `size` thành 11.
3. Sau đó, thread 1 nhận được time slice, nó cũng đưa phần tử vào bucket và cập nhật giá trị `size` thành 11.
4. Thread 1, 2 đều đã thực hiện một lần `put`, nhưng giá trị `size` chỉ tăng 1. Lúc này bộ đếm đã bị mất cập nhật (lost update), nhưng không thể chỉ dựa vào kết quả `size` để phán đoán thực tế đã insert bao nhiêu phần tử.

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    // ...
    // Kích thước thực tế lớn hơn ngưỡng thì mở rộng
    if (++size > threshold)
        resize();
    // Callback sau khi insert
    afterNodeInsertion(evict);
    return null;
}
```

### Các cách duyệt HashMap phổ biến?

[7 cách duyệt HashMap và phân tích hiệu suất!](https://mp.weixin.qq.com/s/zQBN3UvJDhRTKP6SzcZFKw)

**🐛 Đính chính (xem: [issue#1411](https://github.com/Snailclimb/JavaGuide/issues/1411))**:

Bài viết này có sai sót trong phân tích hiệu suất của cách duyệt parallelStream, kết luận trước: **khi có blocking, parallelStream có hiệu suất cao nhất, khi không có blocking, parallelStream có hiệu suất thấp nhất**.

Khi duyệt không có blocking, hiệu suất của parallelStream là thấp nhất:

```plain
Benchmark               Mode  Cnt     Score      Error  Units
Test.entrySet           avgt    5   288.651 ±   10.536  ns/op
Test.keySet             avgt    5   584.594 ±   21.431  ns/op
Test.lambda             avgt    5   221.791 ±   10.198  ns/op
Test.parallelStream     avgt    5  6919.163 ± 1116.139  ns/op
```

Sau khi thêm code blocking `Thread.sleep(10)`, hiệu suất của parallelStream mới là cao nhất:

```plain
Benchmark               Mode  Cnt           Score          Error  Units
Test.entrySet           avgt    5  1554828440.000 ± 23657748.653  ns/op
Test.keySet             avgt    5  1550612500.000 ±  6474562.858  ns/op
Test.lambda             avgt    5  1551065180.000 ± 19164407.426  ns/op
Test.parallelStream     avgt    5   186345456.667 ±  3210435.590  ns/op
```

### ⭐️ Sự khác biệt giữa ConcurrentHashMap và Hashtable

Sự khác biệt giữa `ConcurrentHashMap` và `Hashtable` chủ yếu thể hiện ở cách thức cài đặt thread-safe.

- **Cấu trúc dữ liệu底层:** JDK 1.7 `ConcurrentHashMap`底层 sử dụng **mảng phân đoạn (Segment) + linked list**, trong JDK 1.8 sử dụng cấu trúc dữ liệu giống với `HashMap`, mảng + linked list / Red-Black Tree. `Hashtable` và `HashMap` trước JDK 1.8 có cấu trúc dữ liệu底层 tương tự, đều sử dụng dạng **mảng + linked list**, mảng là phần chính của HashMap, linked list chủ yếu dùng để giải quyết hash collision.
- **Cách thức cài đặt thread-safe (quan trọng):**
  - Trong JDK 1.7, `ConcurrentHashMap` phân đoạn toàn bộ mảng bucket (`Segment`, segment lock), mỗi lock chỉ khóa một phần dữ liệu trong container (có hình minh họa bên dưới), nhiều thread truy cập dữ liệu ở các phân đoạn khác nhau sẽ không có lock contention, tăng tỷ lệ truy cập đồng thời.
  - Đến JDK 1.8, `ConcurrentHashMap` đã loại bỏ khái niệm `Segment`, thay vào đó trực tiếp dùng cấu trúc dữ liệu `Node` array + linked list + Red-Black Tree, điều khiển đồng thời sử dụng `synchronized` và CAS. (Từ JDK 1.6 trở đi, `synchronized` lock đã được tối ưu hóa rất nhiều) Nhìn tổng thể giống như một `HashMap` đã được tối ưu và thread-safe. Mặc dù trong JDK 1.8 vẫn có thể thấy cấu trúc dữ liệu `Segment`, nhưng thuộc tính đã được đơn giản hóa, chỉ để tương thích với phiên bản cũ.
  - **`Hashtable` (cùng một lock):** Sử dụng `synchronized` để đảm bảo thread-safe, hiệu suất rất thấp. Khi một thread truy cập phương thức synchronized, các thread khác cũng truy cập phương thức synchronized có thể rơi vào trạng thái blocking hoặc polling, ví dụ dùng put để thêm phần tử, thread khác không thể dùng put để thêm phần tử, cũng không thể dùng get, contention ngày càng gay gắt, hiệu suất ngày càng thấp.

Dưới đây, chúng ta cùng xem hình so sánh cấu trúc dữ liệu底层 của cả hai.

**Hashtable** :

![Cấu trúc nội bộ của Hashtable](https://oss.javaguide.cn/github/javaguide/java/collection/jdk1.7_hashmap.png)

<p style="text-align:right;font-size:13px;color:gray">https://www.cnblogs.com/chengxiao/p/6842045.html></p>

**ConcurrentHashMap JDK 1.7**：

![Cấu trúc lưu trữ Java7 ConcurrentHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/java7_concurrenthashmap.png)

`ConcurrentHashMap` được cấu thành từ cấu trúc mảng `Segment` và cấu trúc mảng `HashEntry`.

Mỗi phần tử trong mảng `Segment` chứa một mảng `HashEntry`, mỗi mảng `HashEntry` thuộc cấu trúc linked list.

**ConcurrentHashMap JDK 1.8**：

![Cấu trúc lưu trữ Java8 ConcurrentHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/java8_concurrenthashmap.png)

`ConcurrentHashMap` JDK 1.8 không còn là **Segment array + HashEntry array + linked list**, mà là **Node array + linked list / Red-Black Tree**. Tuy nhiên, Node chỉ dùng được cho trường hợp linked list, trường hợp Red-Black Tree cần dùng **`TreeNode`**. Khi linked list collision đạt đến độ dài nhất định, linked list sẽ chuyển thành Red-Black Tree.

`TreeNode` lưu trữ node của Red-Black Tree, được bọc bởi `TreeBin`. `TreeBin` duy trì node gốc của Red-Black Tree thông qua thuộc tính `root`, vì khi Red-Black Tree xoay, node gốc có thể bị thay thế bởi node con ban đầu của nó. Tại thời điểm này, nếu có thread khác muốn ghi vào Red-Black Tree này sẽ xảy ra vấn đề không thread-safe, vì vậy trong `ConcurrentHashMap`, `TreeBin` sử dụng thuộc tính `waiter` để duy trì thread hiện đang sử dụng Red-Black Tree này, nhằm ngăn các thread khác truy cập vào.

```java
static final class TreeBin<K,V> extends Node<K,V> {
        TreeNode<K,V> root;
        volatile TreeNode<K,V> first;
        volatile Thread waiter;
        volatile int lockState;
        // values for lockState
        static final int WRITER = 1; // set while holding write lock
        static final int WAITER = 2; // set when waiting for write lock
        static final int READER = 4; // increment value for setting read lock
...
}
```

### ⭐️ Cách thức cài đặt thread-safe cụ thể / cài đặt底层 của ConcurrentHashMap

#### Trước JDK 1.8

![Cấu trúc lưu trữ Java7 ConcurrentHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/java7_concurrenthashmap.png)

Đầu tiên, dữ liệu được chia thành từng đoạn ("đoạn" này chính là `Segment`) để lưu trữ, sau đó cấp cho mỗi đoạn dữ liệu một lock. Khi một thread chiếm lock để truy cập dữ liệu của một đoạn, dữ liệu của các đoạn khác vẫn có thể được các thread khác truy cập.

**`ConcurrentHashMap` được cấu thành từ cấu trúc mảng `Segment` và cấu trúc mảng `HashEntry`**.

`Segment` kế thừa `ReentrantLock`, vì vậy `Segment` là một loại reentrant lock, đóng vai trò là lock. `HashEntry` dùng để lưu trữ dữ liệu key-value pair.

```java
static class Segment<K,V> extends ReentrantLock implements Serializable {
}
```

Một `ConcurrentHashMap` chứa một mảng `Segment`, số lượng `Segment` một khi đã **khởi tạo thì không thể thay đổi**. Kích thước mảng `Segment` mặc định là 16, nghĩa là mặc định có thể đồng thời hỗ trợ 16 thread ghi đồng thời.

Cấu trúc của `Segment` tương tự `HashMap`, là cấu trúc mảng và linked list. Một `Segment` chứa một mảng `HashEntry`, mỗi `HashEntry` là một phần tử cấu trúc linked list. Mỗi `Segment` bảo vệ các phần tử trong một mảng `HashEntry`. Khi cần sửa đổi dữ liệu trong mảng `HashEntry`, trước tiên phải lấy được lock của `Segment` tương ứng. Nghĩa là, ghi đồng thời trên cùng một `Segment` sẽ bị chặn, ghi trên các `Segment` khác nhau có thể thực thi đồng thời.

#### Từ JDK 1.8 trở đi

![Cấu trúc lưu trữ Java8 ConcurrentHashMap](https://oss.javaguide.cn/github/javaguide/java/collection/java8_concurrenthashmap.png)

Java 8 gần như đã viết lại hoàn toàn `ConcurrentHashMap`, lượng code từ hơn 1000 dòng trong Java 7 đã trở thành hơn 6000 dòng hiện tại.

`ConcurrentHashMap` đã bỏ `Segment` segment lock, sử dụng `Node + CAS + synchronized` để đảm bảo an toàn đồng thời. Cấu trúc dữ liệu tương tự cấu trúc của `HashMap` 1.8, mảng + linked list / Red-Black Tree. Java 8 khi độ dài linked list vượt quá ngưỡng nhất định (8) sẽ chuyển linked list (độ phức tạp tìm kiếm O(N)) thành Red-Black Tree (độ phức tạp tìm kiếm O(log(N))).

Trong Java 8, granularity của lock mịn hơn, khi cập nhật bucket không trống thường sử dụng `synchronized` để khóa node đầu tiên của bucket. Cập nhật trên các bucket khác nhau thường có thể thực thi song song, thao tác đọc cũng không sử dụng các bucket lock này.

### ⭐️ Sự khác biệt trong cài đặt ConcurrentHashMap giữa JDK 1.7 và JDK 1.8?

- **Cách thức cài đặt thread-safe**: JDK 1.7 sử dụng `Segment` segment lock để đảm bảo an toàn, `Segment` kế thừa từ `ReentrantLock`. JDK 1.8 từ bỏ thiết kế `Segment` segment lock, sử dụng `Node + CAS + synchronized` để đảm bảo thread-safe, granularity của lock mịn hơn, `synchronized` chỉ khóa node đầu tiên của linked list hoặc Red-Black Tree hiện tại.
- **Phương pháp giải quyết Hash collision**: JDK 1.7 sử dụng separate chaining, JDK 1.8 sử dụng separate chaining kết hợp Red-Black Tree (khi độ dài linked list vượt quá ngưỡng nhất định, chuyển linked list thành Red-Black Tree).
- **Mức độ đồng thời (Concurrency level)**: JDK 1.7 cập nhật đồng thời chủ yếu bị giới hạn bởi số lượng `Segment`, mặc định là 16. JDK 1.8 không còn sử dụng số lượng `Segment` cố định, cập nhật trên các bucket khác nhau thường có thể thực thi song song.

### Tại sao key và value của ConcurrentHashMap không thể là null?

`ConcurrentHashMap` không cho phép key và value là null chủ yếu là để tránh tính nhập nhằng (ambiguity). null là một giá trị đặc biệt, biểu thị không có object hoặc không có tham chiếu. Nếu bạn dùng null làm key, thì bạn không thể phân biệt được key này có tồn tại trong `ConcurrentHashMap` hay không, hay là hoàn toàn không có key này. Tương tự, nếu bạn dùng null làm value, thì bạn không thể phân biệt được value này có thực sự được lưu trong `ConcurrentHashMap` hay không, hay là do không tìm thấy key tương ứng mà trả về.

Lấy phương thức get làm ví dụ, kết quả trả về là null tồn tại hai trường hợp:

- Value không có trong collection;
- Bản thân value chính là null.

Đây chính là nguồn gốc của tính nhập nhằng.

Tham khảo cụ thể [ConcurrentHashMap source code analysis](https://javaguide.cn/java/collection/concurrent-hash-map-source-code.html).

Trong môi trường đa luồng, tồn tại tình huống một thread đang thao tác `ConcurrentHashMap` này, thread khác sửa đổi `ConcurrentHashMap` đó, vì vậy không thể dùng `containsKey(key)` để phán đoán liệu key-value pair này có tồn tại hay không, cũng không có cách nào giải quyết vấn đề nhập nhằng.

Ngược lại, `HashMap` có thể lưu trữ null key và null value, nhưng null key chỉ được có một, null value có thể có nhiều. Nếu truyền null làm tham số, nó sẽ trả về giá trị tại vị trí có hash value là 0. Trong môi trường đơn luồng, không tồn tại tình huống một thread đang thao tác HashMap này, thread khác sửa đổi `HashMap` đó, vì vậy có thể dùng `containsKey(key)` để phán đoán liệu key-value pair này có tồn tại hay không, từ đó xử lý tương ứng, cũng không tồn tại vấn đề nhập nhằng.

Nói cách khác, trong đa luồng không thể xác định chính xác key-value pair có tồn tại hay không (tồn tại tình huống bị thread khác sửa đổi), còn trong đơn luồng thì có thể (không tồn tại tình huống bị thread khác sửa đổi).

Nếu bạn thực sự cần dùng null trong ConcurrentHashMap, có thể dùng một static empty object đặc biệt để thay thế cho null.

```java
public static final Object NULL = new Object();
```

Cuối cùng, chia sẻ thêm câu trả lời của chính tác giả `ConcurrentHashMap` (Doug Lea) về vấn đề này:

> The main reason that nulls aren't allowed in ConcurrentMaps (ConcurrentHashMaps, ConcurrentSkipListMaps) is that ambiguities that may be just barely tolerable in non-concurrent maps can't be accommodated. The main one is that if `map.get(key)` returns `null`, you can't detect whether the key explicitly maps to `null` vs the key isn't mapped. In a non-concurrent map, you can check this via `map.contains(key)`, but in a concurrent one, the map might have changed between calls.

Tạm dịch, đại ý là trong đơn luồng có thể chấp nhận sự nhập nhằng, còn trong đa luồng thì không thể chấp nhận.

### ⭐️ ConcurrentHashMap có đảm bảo tính nguyên tử (atomicity) của composite operation không?

`ConcurrentHashMap` là thread-safe, nghĩa là nó có thể đảm bảo khi nhiều thread đồng thời thực hiện thao tác đọc ghi trên nó, sẽ không xảy ra tình trạng dữ liệu không nhất quán, cũng không dẫn đến vấn đề vòng lặp vô hạn như `HashMap` phiên bản JDK 1.7 trở về trước. Tuy nhiên, điều này không có nghĩa là nó có thể đảm bảo tất cả composite operation đều là atomic, nhất định đừng nhầm lẫn!

Composite operation là thao tác được tạo thành từ nhiều basic operation (như `put`, `get`, `remove`, `containsKey`, v.v.), ví dụ: trước tiên kiểm tra một key nào đó có tồn tại không `containsKey(key)`, sau đó dựa vào kết quả để thực hiện insert hoặc update `put(key, value)`. Thao tác này trong quá trình thực thi có thể bị thread khác chen ngang, dẫn đến kết quả không như mong đợi.

Ví dụ, có hai thread A và B đồng thời thực hiện composite operation trên `ConcurrentHashMap`:

```java
// Thread A
if (!map.containsKey(key)) {
map.put(key, value);
}
// Thread B
if (!map.containsKey(key)) {
map.put(key, anotherValue);
}
```

Nếu thứ tự thực thi của thread A và B như sau:

1. Thread A kiểm tra map không tồn tại key
2. Thread B kiểm tra map không tồn tại key
3. Thread B chèn (key, anotherValue) vào map
4. Thread A chèn (key, value) vào map

Thì kết quả cuối cùng là (key, value), không phải (key, anotherValue) như mong đợi. Đây chính là vấn đề do tính không nguyên tử của composite operation gây ra.

**Vậy làm thế nào để đảm bảo tính nguyên tử của composite operation trên `ConcurrentHashMap`?**

`ConcurrentHashMap` cung cấp một số composite operation mang tính nguyên tử, như `putIfAbsent`, `compute`, `computeIfAbsent`, `computeIfPresent`, `merge`, v.v. Các phương thức này đều có thể nhận một hàm làm tham số, tính toán một value mới dựa trên key và value đã cho, và cập nhật nó vào map.

Code trên có thể được viết lại thành:

```java
// Thread A
map.putIfAbsent(key, value);
// Thread B
map.putIfAbsent(key, anotherValue);
```

Hoặc:

```java
// Thread A
map.computeIfAbsent(key, k -> value);
// Thread B
map.computeIfAbsent(key, k -> anotherValue);
```

Nhiều bạn có thể sẽ nói, trường hợp này cũng có thể dùng lock để đồng bộ mà! Quả thực có thể, nhưng không khuyến nghị sử dụng cơ chế đồng bộ bằng lock, vì đi ngược lại mục đích ban đầu khi sử dụng `ConcurrentHashMap`. Khi sử dụng `ConcurrentHashMap`, hãy cố gắng dùng các phương thức composite operation nguyên tử này để đảm bảo tính nguyên tử.

## Collections Utility Class (Không quan trọng)

**Các phương thức thường dùng của `Collections` utility class**:

- Sắp xếp (Sorting)
- Tìm kiếm, thay thế (Search, Replace)
- Điều khiển đồng bộ (Synchronization) (không khuyến nghị, khi cần collection type thread-safe, hãy cân nhắc sử dụng concurrent collection trong gói JUC)

### Thao tác sắp xếp

```java
void reverse(List list)//Đảo ngược
void shuffle(List list)//Sắp xếp ngẫu nhiên
void sort(List list)//Sắp xếp theo thứ tự tự nhiên tăng dần
void sort(List list, Comparator c)//Sắp xếp tùy chỉnh, logic sắp xếp do Comparator điều khiển
void swap(List list, int i , int j)//Hoán đổi phần tử ở hai vị trí chỉ số
void rotate(List list, int distance)//Xoay. Khi distance là số dương, di chuyển distance phần tử cuối của list lên đầu. Khi distance là số âm, di chuyển distance phần tử đầu của list xuống cuối
```

### Thao tác tìm kiếm, thay thế

```java
int binarySearch(List list, Object key)//Tìm kiếm nhị phân trên List, trả về chỉ số, lưu ý List phải được sắp xếp
int max(Collection coll)//Trả về phần tử lớn nhất theo thứ tự tự nhiên. Tương tự int min(Collection coll)
int max(Collection coll, Comparator c)//Trả về phần tử lớn nhất theo sắp xếp tùy chỉnh, quy tắc sắp xếp do Comparatator điều khiển. Tương tự int min(Collection coll, Comparator c)
void fill(List list, Object obj)//Thay thế tất cả phần tử trong list bằng phần tử được chỉ định
int frequency(Collection c, Object o)//Thống kê số lần xuất hiện của phần tử
int indexOfSubList(List list, List target)//Thống kê chỉ số xuất hiện đầu tiên của target trong list, không tìm thấy trả về -1, tương tự int lastIndexOfSubList(List source, list target)
boolean replaceAll(List list, Object oldVal, Object newVal)//Thay thế phần tử cũ bằng phần tử mới
```

### Điều khiển đồng bộ

`Collections` cung cấp nhiều phương thức `synchronizedXxx()`, các phương thức này có thể bọc (wrap) collection được chỉ định thành collection đồng bộ thread-safe, từ đó giải quyết vấn đề thread-safe khi truy cập collection đồng thời bởi nhiều thread.

Tất cả việc truy cập đều phải thông qua wrapper được trả về; khi duyệt bằng `Iterator`, `Spliterator` hoặc `Stream`, cần đồng bộ thủ công wrapper đó.

Chúng ta biết rằng `HashSet`, `TreeSet`, `ArrayList`, `LinkedList`, `HashMap`, `TreeMap` đều không thread-safe. `Collections` cung cấp nhiều phương thức static có thể bọc chúng thành collection đồng bộ thread-safe.

**Tốt nhất không nên dùng các phương thức dưới đây, hiệu suất rất thấp. Khi cần collection type thread-safe, hãy cân nhắc sử dụng concurrent collection trong gói JUC.**

Các phương thức như sau:

```java
synchronizedCollection(Collection<T>  c) //Trả về collection đồng bộ (thread-safe) được hỗ trợ bởi collection được chỉ định.
synchronizedList(List<T> list)//Trả về List đồng bộ (thread-safe) được hỗ trợ bởi list được chỉ định.
synchronizedMap(Map<K,V> m) //Trả về Map đồng bộ (thread-safe) được hỗ trợ bởi map được chỉ định.
synchronizedSet(Set<T> s) //Trả về set đồng bộ (thread-safe) được hỗ trợ bởi set được chỉ định.
```

<!-- @include: @article-footer.snippet.md -->
