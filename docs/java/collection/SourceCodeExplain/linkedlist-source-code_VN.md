---
title: Phân tích mã nguồn LinkedList
description: Phân tích chuyên sâu mã nguồn LinkedList: cấu trúc danh sách liên kết đôi (doubly linked list), triển khai giao diện Deque, độ phức tạp O(1) khi chèn/xóa ở đầu và cuối, so sánh hiệu năng với ArrayList và các tình huống áp dụng.
category: Java
tag:
  - Java Collection
head:
  - - meta
    - name: keywords
      content: LinkedList source code, doubly linked list, Deque interface, LinkedList vs ArrayList, insert/delete performance, linked list implementation
---

<!-- @include: @article-header.snippet.md -->

## Giới thiệu về LinkedList

`LinkedList` là một lớp collection được triển khai dựa trên danh sách liên kết đôi (doubly linked list), thường được đem ra so sánh với `ArrayList`. Về so sánh chi tiết giữa `LinkedList` và `ArrayList`, chúng tôi đã trình bày kỹ trong bài [Tổng hợp câu hỏi phỏng vấn thường gặp về Java Collection (Phần 1)](./java-collection-questions-01.md).

![Danh sách liên kết đôi](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/bidirectional-linkedlist.png)

Tuy nhiên, trong thực tế dự án chúng ta thường không sử dụng `LinkedList`, hầu hết các tình huống cần dùng `LinkedList` đều có thể thay thế bằng `ArrayList`, và hiệu năng thường sẽ tốt hơn! Ngay cả tác giả của `LinkedList` là Joshua Bloch cũng từng nói rằng bản thân ông chưa bao giờ sử dụng `LinkedList`.

![](https://oss.javaguide.cn/github/javaguide/redisimage-20220412110853807.png)

Ngoài ra, đừng mặc định cho rằng `LinkedList` với tư cách là danh sách liên kết thì phù hợp nhất cho các tình huống thêm/xóa phần tử. Tôi cũng đã đề cập ở trên, `LinkedList` chỉ có độ phức tạp thời gian xấp xỉ O(1) khi chèn hoặc xóa phần tử ở đầu hoặc cuối, còn các trường hợp thêm/xóa ở vị trí khác đều có độ phức tạp trung bình là O(n).

### Độ phức tạp thời gian khi chèn và xóa phần tử của LinkedList?

- Chèn/xóa ở đầu: chỉ cần sửa con trỏ của nút đầu (head) là có thể hoàn thành thao tác chèn/xóa, do đó độ phức tạp thời gian là O(1).
- Chèn/xóa ở cuối: chỉ cần sửa con trỏ của nút cuối (tail) là có thể hoàn thành thao tác chèn/xóa, do đó độ phức tạp thời gian là O(1).
- Chèn/xóa ở vị trí chỉ định: cần di chuyển đến vị trí chỉ định trước, sau đó sửa con trỏ của nút tại vị trí đó để hoàn thành chèn/xóa. Tuy nhiên, do có con trỏ đầu và cuối, có thể xuất phát từ con trỏ gần hơn, nên trung bình cần duyệt qua n/4 phần tử, độ phức tạp thời gian là O(n).

### Tại sao LinkedList không thể triển khai giao diện RandomAccess?

`RandomAccess` là một giao diện đánh dấu (marker interface), dùng để chỉ ra rằng lớp triển khai giao diện này hỗ trợ truy cập ngẫu nhiên (random access), tức có thể truy cập nhanh phần tử thông qua chỉ mục. Do cấu trúc dữ liệu nền tảng của `LinkedList` là danh sách liên kết, địa chỉ bộ nhớ không liên tục, chỉ có thể định vị thông qua con trỏ, không hỗ trợ truy cập ngẫu nhiên nhanh, vì vậy không thể triển khai giao diện `RandomAccess`.

## Phân tích mã nguồn LinkedList

Ở đây chúng tôi sử dụng JDK 1.8 làm ví dụ để phân tích mã nguồn lõi của `LinkedList`.

Định nghĩa lớp của `LinkedList` như sau:

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{
  //...
}
```

`LinkedList` kế thừa `AbstractSequentialList`, và `AbstractSequentialList` lại kế thừa từ `AbstractList`.

Nếu đã đọc qua mã nguồn của `ArrayList` chúng ta sẽ biết, `ArrayList` cũng kế thừa `AbstractList`, vì vậy `LinkedList` sẽ có phần lớn phương thức tương tự với `ArrayList`.

`LinkedList` triển khai các giao diện sau:

- `List`: chỉ ra rằng nó là một danh sách (list), hỗ trợ các thao tác thêm, xóa, tìm kiếm, và có thể truy cập thông qua chỉ mục.
- `Deque`: kế thừa từ giao diện `Queue`, có đặc tính của hàng đợi hai đầu (double-ended queue), hỗ trợ chèn và xóa phần tử từ cả hai đầu, thuận tiện cho việc triển khai các cấu trúc dữ liệu như stack và queue. Lưu ý, `Deque` được phát âm là "deck" [dɛk], phần lớn mọi người đều đọc sai từ này.
- `Cloneable`: chỉ ra rằng nó có khả năng sao chép, có thể thực hiện thao tác sao chép sâu (deep copy) hoặc sao chép nông (shallow copy).
- `Serializable`: chỉ ra rằng nó có thể thực hiện thao tác tuần tự hóa (serialization), tức là có thể chuyển đổi đối tượng thành luồng byte để lưu trữ bền vững hoặc truyền qua mạng, rất tiện lợi.

![Sơ đồ lớp LinkedList](https://oss.javaguide.cn/github/javaguide/java/collection/linkedlist--class-diagram.png)

Các phần tử trong `LinkedList` được định nghĩa thông qua `Node`:

```java
private static class Node<E> {
    E item;// giá trị nút
    Node<E> next; // trỏ đến nút tiếp theo (nút kế sau)
    Node<E> prev; // trỏ đến nút trước đó (nút kế trước)

    // Thứ tự tham số khởi tạo lần lượt là: nút kế trước, giá trị nút hiện tại, nút kế sau
    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

### Khởi tạo

`LinkedList` có một constructor không tham số và một constructor có tham số.

```java
// Tạo một đối tượng danh sách liên kết rỗng
public LinkedList() {
}

// Nhận một kiểu collection làm tham số, sẽ tạo một đối tượng danh sách liên kết có cùng phần tử với collection được truyền vào
public LinkedList(Collection<? extends E> c) {
    this();
    addAll(c);
}
```

### Chèn phần tử

`LinkedList` ngoài việc triển khai các phương thức liên quan của giao diện `List`, còn triển khai rất nhiều phương thức của giao diện `Deque`, vì vậy chúng ta có nhiều cách để chèn phần tử.

Ở đây chúng tôi lấy các phương thức chèn liên quan trong giao diện `List` làm ví dụ để giải thích mã nguồn, tương ứng là phương thức `add()`.

Phương thức `add()` có hai phiên bản:

- `add(E e)`: dùng để chèn phần tử vào cuối của `LinkedList`, tức là đặt phần tử mới làm phần tử cuối cùng của danh sách liên kết, độ phức tạp thời gian là O(1).
- `add(int index, E element)`: dùng để chèn phần tử vào vị trí chỉ định. Cách chèn này cần di chuyển đến vị trí chỉ định trước, sau đó sửa con trỏ của nút tại vị trí đó để hoàn thành chèn/xóa, do đó trung bình cần di chuyển n/4 phần tử, độ phức tạp thời gian là O(n).

```java
// Chèn phần tử vào cuối danh sách liên kết
public boolean add(E e) {
    linkLast(e);
    return true;
}

// Chèn phần tử vào vị trí chỉ định trong danh sách liên kết
public void add(int index, E element) {
    // Kiểm tra chỉ mục vượt quá giới hạn
    checkPositionIndex(index);

    // Kiểm tra xem index có phải là vị trí cuối của danh sách liên kết không
    if (index == size)
        // Nếu đúng thì gọi trực tiếp phương thức linkLast để chèn nút phần tử vào cuối danh sách liên kết
        linkLast(element);
    else
        // Nếu không thì gọi phương thức linkBefore để chèn vào trước phần tử được chỉ định
        linkBefore(element, node(index));
}

// Chèn nút phần tử vào cuối danh sách liên kết
void linkLast(E e) {
    // Gán phần tử cuối cùng (truyền tham chiếu) cho nút l
    final Node<E> l = last;
    // Tạo nút, và chỉ định nút kế trước của nút là nút cuối last, tham chiếu kế sau là null
    final Node<E> newNode = new Node<>(l, e, null);
    // Trỏ tham chiếu last đến nút mới
    last = newNode;
    // Kiểm tra xem nút cuối có rỗng không
    // Nếu l là null nghĩa là đây là lần đầu tiên thêm phần tử
    if (l == null)
        // Nếu là lần đầu tiên thêm, gán first cho nút mới, lúc này danh sách liên kết chỉ có một phần tử
        first = newNode;
    else
        // Nếu không phải lần đầu tiên thêm, gán nút mới cho next của l (phần tử cuối cùng trước khi thêm)
        l.next = newNode;
    size++;
    modCount++;
}

// Chèn phần tử vào trước phần tử được chỉ định
void linkBefore(E e, Node<E> succ) {
    // assert succ != null; khẳng định succ không null
    // Định nghĩa một biến nút phần tử để lưu tham chiếu prev của succ, tức là thông tin nút kế trước của nó
    final Node<E> pred = succ.prev;
    // Khởi tạo nút, và chỉ rõ nút kế trước và nút kế sau
    final Node<E> newNode = new Node<>(pred, e, succ);
    // Trỏ tham chiếu nút kế trước prev của succ đến nút mới
    succ.prev = newNode;
    // Kiểm tra xem nút kế trước có rỗng không, rỗng nghĩa là succ là nút đầu tiên
    if (pred == null)
        // Nút mới trở thành nút đầu tiên
        first = newNode;
    else
        // Tham chiếu kế sau của nút kế trước của succ trỏ đến nút mới
        pred.next = newNode;
    size++;
    modCount++;
}
```

### Lấy phần tử

`LinkedList` có tổng cộng 3 phương thức liên quan đến lấy phần tử:

1. `getFirst()`: lấy phần tử đầu tiên của danh sách liên kết.
2. `getLast()`: lấy phần tử cuối cùng của danh sách liên kết.
3. `get(int index)`: lấy phần tử tại vị trí chỉ định của danh sách liên kết.

```java
// Lấy phần tử đầu tiên của danh sách liên kết
public E getFirst() {
    final Node<E> f = first;
    if (f == null)
        throw new NoSuchElementException();
    return f.item;
}

// Lấy phần tử cuối cùng của danh sách liên kết
public E getLast() {
    final Node<E> l = last;
    if (l == null)
        throw new NoSuchElementException();
    return l.item;
}

// Lấy phần tử tại vị trí chỉ định của danh sách liên kết
public E get(int index) {
  // Kiểm tra chỉ mục vượt quá giới hạn, nếu vượt quá thì ném ngoại lệ
  checkElementIndex(index);
  // Trả về phần tử tương ứng với chỉ mục trong danh sách liên kết
  return node(index).item;
}
```

Điểm cốt lõi ở đây nằm ở phương thức `node(int index)`:

```java
// Trả về nút không rỗng tại chỉ mục được chỉ định
Node<E> node(int index) {
    // Khẳng định chỉ mục không vượt quá giới hạn
    // assert isElementIndex(index);
    // Nếu index nhỏ hơn một nửa của size thì tìm từ đầu (tìm về phía sau), ngược lại tìm về phía trước
    if (index < (size >> 1)) {
        Node<E> x = first;
        // Duyệt, lặp tìm về phía sau, cho đến khi i == index
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

Các phương thức như `get(int index)` hoặc `remove(int index)` bên trong đều gọi phương thức này để lấy nút tương ứng.

Từ mã nguồn của phương thức này có thể thấy, phương thức này xác định nên bắt đầu duyệt từ đầu hay cuối danh sách liên kết bằng cách so sánh giá trị chỉ mục với một nửa size của danh sách liên kết. Nếu giá trị chỉ mục nhỏ hơn một nửa size, sẽ bắt đầu duyệt từ đầu danh sách liên kết, ngược lại sẽ duyệt từ cuối danh sách liên kết. Điều này cho phép tìm thấy nút mục tiêu trong thời gian ngắn hơn, tận dụng tối đa đặc tính của danh sách liên kết đôi để nâng cao hiệu quả.

### Xóa phần tử

`LinkedList` có tổng cộng 5 phương thức liên quan đến xóa phần tử:

1. `removeFirst()`: xóa và trả về phần tử đầu tiên của danh sách liên kết.
2. `removeLast()`: xóa và trả về phần tử cuối cùng của danh sách liên kết.
3. `remove(E e)`: xóa phần tử được chỉ định xuất hiện lần đầu tiên trong danh sách liên kết, nếu không tồn tại phần tử đó thì trả về false.
4. `remove(int index)`: xóa phần tử tại chỉ mục được chỉ định, và trả về giá trị của phần tử đó.
5. `void clear()`: xóa tất cả các phần tử trong danh sách liên kết này.

```java
// Xóa và trả về phần tử đầu tiên của danh sách liên kết
public E removeFirst() {
    final Node<E> f = first;
    if (f == null)
        throw new NoSuchElementException();
    return unlinkFirst(f);
}

// Xóa và trả về phần tử cuối cùng của danh sách liên kết
public E removeLast() {
    final Node<E> l = last;
    if (l == null)
        throw new NoSuchElementException();
    return unlinkLast(l);
}

// Xóa phần tử được chỉ định xuất hiện lần đầu tiên trong danh sách liên kết, nếu không tồn tại phần tử đó thì trả về false
public boolean remove(Object o) {
    // Nếu phần tử được chỉ định là null, duyệt danh sách liên kết tìm phần tử null đầu tiên để xóa
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {
                unlink(x);
                return true;
            }
        }
    } else {
        // Nếu không phải null, duyệt danh sách liên kết tìm nút cần xóa
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}

// Xóa phần tử tại vị trí chỉ định trong danh sách liên kết
public E remove(int index) {
    // Kiểm tra chỉ mục vượt quá giới hạn, nếu vượt quá thì ném ngoại lệ
    checkElementIndex(index);
    return unlink(node(index));
}
```

Điểm cốt lõi ở đây nằm ở phương thức `unlink(Node<E> x)`:

```java
E unlink(Node<E> x) {
    // Khẳng định x không null
    // assert x != null;
    // Lấy phần tử của nút hiện tại (tức là nút cần xóa)
    final E element = x.item;
    // Lấy nút tiếp theo của nút hiện tại
    final Node<E> next = x.next;
    // Lấy nút trước đó của nút hiện tại
    final Node<E> prev = x.prev;

    // Nếu nút trước đó rỗng, thì nút hiện tại là nút đầu (head)
    if (prev == null) {
        // Trực tiếp trỏ đầu danh sách liên kết đến nút tiếp theo của nút hiện tại
        first = next;
    } else { // Nếu nút trước đó không rỗng
        // Trỏ con trỏ next của nút trước đó đến nút tiếp theo của nút hiện tại
        prev.next = next;
        // Đặt con trỏ prev của nút hiện tại thành null, để GC dễ thu hồi
        x.prev = null;
    }

    // Nếu nút tiếp theo rỗng, thì nút hiện tại là nút cuối (tail)
    if (next == null) {
        // Trực tiếp trỏ cuối danh sách liên kết đến nút trước đó của nút hiện tại
        last = prev;
    } else { // Nếu nút tiếp theo không rỗng
        // Trỏ con trỏ prev của nút tiếp theo đến nút trước đó của nút hiện tại
        next.prev = prev;
        // Đặt con trỏ next của nút hiện tại thành null, để GC dễ thu hồi
        x.next = null;
    }

    // Đặt phần tử của nút hiện tại thành null, để GC dễ thu hồi
    x.item = null;
    size--;
    modCount++;
    return element;
}
```

Logic của phương thức `unlink()` như sau:

1. Đầu tiên lấy nút kế trước và nút kế sau của nút cần xóa x;
2. Kiểm tra xem nút cần xóa có phải là nút đầu hoặc nút cuối không:
   - Nếu x là nút đầu, thì trỏ first đến nút kế sau next của x
   - Nếu x là nút cuối, thì trỏ last đến nút kế trước prev của x
   - Nếu x không phải nút đầu cũng không phải nút cuối, thực hiện bước tiếp theo
3. Trỏ kế sau của nút kế trước của nút cần xóa x đến nút kế sau next của nút cần xóa, ngắt liên kết giữa x và x.prev;
4. Trỏ kế trước của nút kế sau của nút cần xóa x đến nút kế trước prev của nút cần xóa, ngắt liên kết giữa x và x.next;
5. Đặt phần tử của nút cần xóa x thành null, cập nhật độ dài danh sách liên kết.

Có thể tham khảo hình dưới đây để hiểu rõ hơn (nguồn ảnh: [Phân tích mã nguồn LinkedList (JDK 1.8)](https://www.tianxiaobo.com/2018/01/31/LinkedList-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90-JDK-1-8/)):

![Logic phương thức unlink](https://oss.javaguide.cn/github/javaguide/java/collection/linkedlist-unlink.jpg)

### Duyệt danh sách liên kết

Khuyến nghị sử dụng vòng lặp `for-each` để duyệt các phần tử trong `LinkedList`, vòng lặp `for-each` cuối cùng sẽ được chuyển đổi thành dạng iterator.

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("pear");

for (String fruit : list) {
    System.out.println(fruit);
}
```

Cốt lõi của việc duyệt `LinkedList` nằm ở việc triển khai iterator của nó.

```java
// Iterator hai chiều
private class ListItr implements ListIterator<E> {
    // Biểu thị nút đã được duyệt qua trong lần gọi phương thức next() hoặc previous() trước đó;
    private Node<E> lastReturned;
    // Biểu thị nút tiếp theo sẽ được duyệt;
    private Node<E> next;
    // Biểu thị chỉ mục của nút tiếp theo sẽ được duyệt, tức là chỉ mục của nút kế sau của nút hiện tại;
    private int nextIndex;
    // Biểu thị giá trị modCount mong đợi trong lần duyệt hiện tại, dùng để so sánh với modCount của LinkedList, kiểm tra xem danh sách liên kết có bị luồng khác sửa đổi hay không.
    private int expectedModCount = modCount;
    …………
}
```

Dưới đây chúng tôi sẽ giới thiệu chi tiết các phương thức cốt lõi trong iterator `ListItr`.

Trước tiên hãy xem duyệt theo chiều từ đầu đến cuối:

```java
// Kiểm tra xem còn nút tiếp theo không
public boolean hasNext() {
    // Kiểm tra xem chỉ mục của nút tiếp theo có nhỏ hơn size của danh sách liên kết không, nếu có nghĩa là vẫn còn phần tử tiếp theo để duyệt
    return nextIndex < size;
}
// Lấy nút tiếp theo
public E next() {
    // Kiểm tra xem trong quá trình duyệt danh sách liên kết có bị sửa đổi không
    checkForComodification();
    // Kiểm tra xem còn nút tiếp theo để duyệt không, nếu không thì ném ngoại lệ NoSuchElementException
    if (!hasNext())
        throw new NoSuchElementException();
    // Trỏ lastReturned đến nút hiện tại
    lastReturned = next;
    // Trỏ next đến nút tiếp theo
    next = next.next;
    nextIndex++;
    return lastReturned.item;
}
```

Tiếp theo hãy xem duyệt theo chiều từ cuối đến đầu:

```java
// Kiểm tra xem còn nút trước đó không
public boolean hasPrevious() {
    return nextIndex > 0;
}

// Lấy nút trước đó
public E previous() {
    // Kiểm tra xem trong quá trình duyệt danh sách liên kết có bị sửa đổi không
    checkForComodification();
    // Nếu không có nút trước đó, thì ném ngoại lệ
    if (!hasPrevious())
        throw new NoSuchElementException();
    // Trỏ con trỏ lastReturned và next đến nút trước đó
    lastReturned = next = (next == null) ? last : next.prev;
    nextIndex--;
    return lastReturned.item;
}
```

Nếu cần xóa hoặc chèn phần tử, cũng có thể sử dụng iterator để thao tác.

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add(null);
list.add("banana");

// Phương thức removeIf của giao diện Collection bên dưới vẫn dựa trên iterator
list.removeIf(Objects::isNull);

for (String fruit : list) {
    System.out.println(fruit);
}
```

Phương thức xóa phần tử tương ứng của iterator như sau:

```java
// Xóa phần tử được trả về lần trước khỏi danh sách
public void remove() {
    // Kiểm tra xem trong quá trình duyệt danh sách liên kết có bị sửa đổi không
    checkForComodification();
    // Nếu nút được trả về lần trước là null, thì ném ngoại lệ
    if (lastReturned == null)
        throw new IllegalStateException();

    // Lấy nút tiếp theo của nút hiện tại
    Node<E> lastNext = lastReturned.next;
    // Xóa nút được trả về lần trước khỏi danh sách liên kết
    unlink(lastReturned);
    // Sửa con trỏ
    if (next == lastReturned)
        next = lastNext;
    else
        nextIndex--;
    // Đặt tham chiếu nút được trả về lần trước thành null, để GC dễ thu hồi
    lastReturned = null;
    expectedModCount++;
}
```

## Kiểm thử các phương thức thường dùng của LinkedList

Mã nguồn:

```java
// Tạo đối tượng LinkedList
LinkedList<String> list = new LinkedList<>();

// Thêm phần tử vào cuối danh sách liên kết
list.add("apple");
list.add("banana");
list.add("pear");
System.out.println("Nội dung danh sách liên kết: " + list);

// Chèn phần tử vào vị trí chỉ định
list.add(1, "orange");
System.out.println("Nội dung danh sách liên kết: " + list);

// Lấy phần tử tại vị trí chỉ định
String fruit = list.get(2);
System.out.println("Phần tử tại chỉ mục 2: " + fruit);

// Sửa phần tử tại vị trí chỉ định
list.set(3, "grape");
System.out.println("Nội dung danh sách liên kết: " + list);

// Xóa phần tử tại vị trí chỉ định
list.remove(0);
System.out.println("Nội dung danh sách liên kết: " + list);

// Xóa phần tử được chỉ định xuất hiện lần đầu tiên
list.remove("banana");
System.out.println("Nội dung danh sách liên kết: " + list);

// Lấy độ dài của danh sách liên kết
int size = list.size();
System.out.println("Độ dài danh sách liên kết: " + size);

// Xóa toàn bộ danh sách liên kết
list.clear();
System.out.println("Danh sách liên kết sau khi xóa toàn bộ: " + list);
```

Kết quả:

```plain
Phần tử tại chỉ mục 2: banana
Nội dung danh sách liên kết: [apple, orange, banana, grape]
Nội dung danh sách liên kết: [orange, banana, grape]
Nội dung danh sách liên kết: [orange, grape]
Độ dài danh sách liên kết: 2
Danh sách liên kết sau khi xóa toàn bộ: []
```

<!-- @include: @article-footer.snippet.md -->