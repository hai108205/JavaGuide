---
title: Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 1)
description: Tổng hợp câu hỏi phỏng vấn Java Collection Framework: phân tích chuyên sâu các interface Collection/List/Set/Queue, so sánh các lớp collection phổ biến như ArrayList/LinkedList/HashMap, nắm vững cấu trúc dữ liệu nền tảng và tình huống sử dụng.
category: Java
tag:
  - Java Collection
head:
  - - meta
    - name: keywords
      content: Java Collection,Collection,List,Set,Queue,ArrayList,LinkedList,HashMap,Collection Framework,câu hỏi phỏng vấn Java
---

<!-- markdownlint-disable MD024 -->

## Tổng quan về Collection

### Tổng quan Java Collection

Java Collection, còn được gọi là container (vùng chứa), chủ yếu được dẫn xuất từ hai interface chính: một là interface `Collection`, chủ yếu dùng để lưu trữ các phần tử đơn lẻ; hai là interface `Map`, chủ yếu dùng để lưu trữ các cặp key-value. Đối với interface `Collection`, bên dưới có ba interface con chính: `List`, `Set`, `Queue`.

Java Collection Framework được minh họa như hình dưới đây:

![Tổng quan Java Collection Framework](https://oss.javaguide.cn/github/javaguide/java/collection/java-collection-hierarchy.png)

Lưu ý: Hình chỉ liệt kê các mối quan hệ kế thừa và dẫn xuất chính, không liệt kê tất cả các mối quan hệ. Ví dụ đã bỏ qua các abstract class như `AbstractList`, `NavigableSet` và một số auxiliary class khác. Nếu muốn tìm hiểu sâu hơn, bạn có thể tự xem source code.

### ⭐️ Phân biệt List, Set, Queue, Map?

- `List` (trợ thủ xử lý thứ tự): Các phần tử được lưu trữ có thứ tự (ordered), có thể trùng lặp (duplicate).
- `Set` (chú trọng tính duy nhất): Các phần tử được lưu trữ không thể trùng lặp.
- `Queue` (máy gọi số xếp hàng): Xác định thứ tự trước sau theo quy tắc xếp hàng cụ thể, các phần tử được lưu trữ có thứ tự, có thể trùng lặp.
- `Map` (chuyên gia tìm kiếm bằng key): Sử dụng cặp key-value để lưu trữ, tương tự như hàm toán học y=f(x), "x" đại diện cho key, "y" đại diện cho value. Key không có thứ tự (unordered), không thể trùng lặp; value không có thứ tự (unordered), có thể trùng lặp. Mỗi key ánh xạ tối đa đến một value. Lưu ý: "không có thứ tự" ở đây đề cập đến các implementation như `HashMap` — không có thứ tự liên kết rõ ràng giữa các cặp key-value. Các implementation như `LinkedHashMap` và `TreeMap` thì có thứ tự, chúng duy trì thứ tự của các cặp key-value thông qua cấu trúc dữ liệu bổ sung (doubly linked list hoặc red-black tree).

### Tổng kết cấu trúc dữ liệu nền tảng của Collection Framework

Trước tiên hãy xem các collection bên dưới interface `Collection`.

#### List

- `ArrayList`: Mảng `Object[]`. Chi tiết có thể xem: [Phân tích source code ArrayList](./arraylist-source-code.md).
- `Vector`: Mảng `Object[]`.
- `LinkedList`: Doubly linked list (trước JDK 1.6 là circular linked list, JDK 1.7 đã bỏ circular). Chi tiết có thể xem: [Phân tích source code LinkedList](./linkedlist-source-code.md).

#### Set

- `HashSet` (không có thứ tự, duy nhất): Dựa trên `HashMap`, sử dụng `HashMap` ở tầng dưới để lưu trữ phần tử.
- `LinkedHashSet`: `LinkedHashSet` là lớp con của `HashSet`, và bên trong nó được triển khai thông qua `LinkedHashMap`.
- `TreeSet` (có thứ tự, duy nhất): Red-black tree (cây nhị phân tìm kiếm tự cân bằng).

#### Queue

- `PriorityQueue`: Mảng `Object[]` triển khai min-heap. Chi tiết có thể xem: [Phân tích source code PriorityQueue](./priorityqueue-source-code.md).
- `DelayQueue`: `PriorityQueue`. Chi tiết có thể xem: [Phân tích source code DelayQueue](./delayqueue-source-code.md).
- `ArrayDeque`: Mảng hai chiều động có thể mở rộng.

Tiếp theo hãy xem các collection bên dưới interface `Map`.

#### Map

- `HashMap`: Trước JDK 1.8, `HashMap` được tạo thành từ mảng + linked list, mảng là phần chính của `HashMap`, linked list chủ yếu tồn tại để giải quyết hash collision (phương pháp "separate chaining" để giải quyết collision). Từ JDK 1.8 trở đi, cách xử lý hash collision có thay đổi lớn: khi độ dài linked list vượt quá ngưỡng (mặc định là 8) (trước khi chuyển linked list thành red-black tree sẽ kiểm tra, nếu độ dài mảng hiện tại nhỏ hơn 64, thì sẽ chọn mở rộng mảng trước thay vì chuyển thành red-black tree), linked list sẽ được chuyển thành red-black tree để giảm thời gian tìm kiếm. Chi tiết có thể xem: [Phân tích source code HashMap](./hashmap-source-code.md), các khái niệm cơ bản có thể xem trước [Tổng hợp câu hỏi phỏng vấn Hash Table](../../cs-basics/data-structure/hash-table.md).
- `LinkedHashMap`: `LinkedHashMap` kế thừa từ `HashMap`, vì vậy tầng dưới của nó vẫn dựa trên cấu trúc separate chaining, tức là được tạo thành từ mảng và linked list hoặc red-black tree. Ngoài ra, `LinkedHashMap` bổ sung thêm một doubly linked list trên nền cấu trúc trên, cho phép duy trì thứ tự chèn (insertion order) của các cặp key-value. Đồng thời thông qua các thao tác tương ứng trên linked list, nó triển khai logic liên quan đến thứ tự truy cập (access order). Chi tiết có thể xem: [Phân tích source code LinkedHashMap](./linkedhashmap-source-code.md), bài tập viết tay LRU có thể xem [Tổng hợp câu hỏi phỏng vấn LRU Cache](../../cs-basics/data-structure/lru-cache.md).
- `Hashtable`: Được tạo thành từ mảng + linked list, mảng là phần chính của `Hashtable`, linked list chủ yếu tồn tại để giải quyết hash collision.
- `TreeMap`: Red-black tree (cây nhị phân tìm kiếm tự cân bằng).

### Làm thế nào để chọn Collection?

Chúng ta chủ yếu dựa vào đặc điểm của collection để chọn collection phù hợp. Ví dụ:

- Khi cần lấy giá trị phần tử dựa trên key, chọn collection thuộc interface `Map`. Khi cần sắp xếp thì chọn `TreeMap`, không cần sắp xếp thì chọn `HashMap`, cần đảm bảo thread-safe thì chọn `ConcurrentHashMap`.
- Khi chỉ cần lưu trữ giá trị phần tử, chọn collection triển khai interface `Collection`. Khi cần đảm bảo phần tử duy nhất thì chọn collection triển khai interface `Set` như `TreeSet` hoặc `HashSet`, không cần thì chọn collection triển khai `List` như `ArrayList` hoặc `LinkedList`, sau đó dựa vào đặc điểm của các collection triển khai các interface này để lựa chọn.

### Tại sao nên sử dụng Collection?

Khi cần lưu trữ một nhóm dữ liệu cùng kiểu, mảng (array) là một trong những container cơ bản và phổ biến nhất. Tuy nhiên, việc sử dụng mảng để lưu trữ đối tượng tồn tại một số hạn chế, vì trong thực tế phát triển, kiểu dữ liệu được lưu trữ rất đa dạng và số lượng không xác định. Lúc này, Java Collection phát huy tác dụng. So với mảng, Java Collection cung cấp phương pháp linh hoạt và hiệu quả hơn để lưu trữ nhiều đối tượng dữ liệu. Các lớp và interface collection khác nhau trong Java Collection Framework có thể lưu trữ các đối tượng với kiểu và số lượng khác nhau, đồng thời còn có các phương thức thao tác đa dạng. So với mảng, ưu điểm của Java Collection nằm ở chỗ kích thước có thể thay đổi, hỗ trợ generics, có sẵn các thuật toán tích hợp, v.v. Nhìn chung, Java Collection nâng cao tính linh hoạt trong lưu trữ và xử lý dữ liệu, có thể thích ứng tốt hơn với nhu cầu dữ liệu đa dạng trong phát triển phần mềm hiện đại, đồng thời hỗ trợ viết code chất lượng cao.

## List

### ⭐️ Sự khác biệt giữa ArrayList và Array (mảng)?

`ArrayList` được triển khai nội bộ dựa trên mảng động (dynamic array), linh hoạt hơn so với `Array` (mảng tĩnh):

- `ArrayList` sẽ tự động mở rộng dung lượng (dynamic expansion) theo các phần tử thực tế được lưu trữ, cũng có thể chủ động thu nhỏ mảng nền thông qua `trimToSize()`, trong khi `Array` sau khi được tạo thì không thể thay đổi độ dài.
- `ArrayList` cho phép bạn sử dụng generics để đảm bảo type safety, `Array` thì không.
- `ArrayList` chỉ có thể lưu trữ đối tượng. Đối với dữ liệu kiểu primitive, cần sử dụng wrapper class tương ứng (như Integer, Double, v.v.). `Array` có thể lưu trữ trực tiếp dữ liệu kiểu primitive, cũng có thể lưu trữ đối tượng.
- `ArrayList` hỗ trợ các thao tác phổ biến như chèn, xóa, duyệt, và cung cấp các phương thức API phong phú, ví dụ như `add()`, `remove()`, v.v. `Array` chỉ là một mảng có độ dài cố định, chỉ có thể truy cập phần tử theo chỉ mục (index), không có khả năng động thêm, xóa phần tử.
- `ArrayList` khi tạo không cần chỉ định kích thước, trong khi `Array` khi tạo phải chỉ định kích thước.

Dưới đây là so sánh đơn giản về cách sử dụng cả hai:

`Array`:

```java
 // Khởi tạo một mảng kiểu String
 String[] stringArr = new String[]{"hello", "world", "!"};
 // Sửa giá trị phần tử mảng
 stringArr[0] = "goodbye";
 System.out.println(Arrays.toString(stringArr));// [goodbye, world, !]
 // Xóa phần tử trong mảng, cần thủ công di chuyển các phần tử phía sau
 for (int i = 0; i < stringArr.length - 1; i++) {
     stringArr[i] = stringArr[i + 1];
 }
 stringArr[stringArr.length - 1] = null;
 System.out.println(Arrays.toString(stringArr));// [world, !, null]
```

`ArrayList`：

```java
// Khởi tạo một ArrayList kiểu String
 ArrayList<String> stringList = new ArrayList<>(Arrays.asList("hello", "world", "!"));
// Thêm phần tử vào ArrayList
 stringList.add("goodbye");
 System.out.println(stringList);// [hello, world, !, goodbye]
 // Sửa phần tử trong ArrayList
 stringList.set(0, "hi");
 System.out.println(stringList);// [hi, world, !, goodbye]
 // Xóa phần tử trong ArrayList
 stringList.remove(0);
 System.out.println(stringList); // [world, !, goodbye]
```

### Sự khác biệt giữa ArrayList và Vector? (chỉ cần biết)

- `ArrayList` là lớp triển khai chính của `List`, tầng dưới sử dụng `Object[]` để lưu trữ, phù hợp cho công việc tìm kiếm thường xuyên, không thread-safe.
- `Vector` là lớp triển khai cũ của `List`, tầng dưới sử dụng `Object[]` để lưu trữ, thread-safe.

### Sự khác biệt giữa Vector và Stack? (chỉ cần biết)

- `Vector` và `Stack` đều thread-safe, đều sử dụng từ khóa `synchronized` để đồng bộ hóa.
- `Stack` kế thừa từ `Vector`, là một stack (ngăn xếp) theo nguyên tắc LIFO (Last-In-First-Out), trong khi `Vector` là một list.

Cùng với sự phát triển của lập trình đa luồng trong Java, `Vector` và `Stack` đã bị loại bỏ, khuyến nghị sử dụng các concurrent collection class (ví dụ `ConcurrentHashMap`, `CopyOnWriteArrayList`, v.v.) hoặc thủ công triển khai các phương thức thread-safe để cung cấp hỗ trợ thao tác đa luồng an toàn.

### ArrayList có thể thêm giá trị null không?

`ArrayList` có thể lưu trữ bất kỳ kiểu đối tượng nào, bao gồm cả giá trị `null`. Tuy nhiên, không khuyến khích thêm giá trị `null` vào `ArrayList`, giá trị `null` không có ý nghĩa, sẽ khiến code khó bảo trì, ví dụ quên xử lý null check sẽ dẫn đến NullPointerException.

Code ví dụ:

```java
ArrayList<String> listOfStrings = new ArrayList<>();
listOfStrings.add(null);
listOfStrings.add("java");
System.out.println(listOfStrings);
```

Output:

```plain
[null, java]
```

### ⭐️ Độ phức tạp thời gian khi chèn và xóa phần tử của ArrayList?

Đối với chèn (insert):

- Chèn vào đầu (head): Do cần di chuyển tất cả các phần tử lùi về sau một vị trí, nên độ phức tạp thời gian là O(n).
- Chèn vào cuối (tail): Khi dung lượng của `ArrayList` chưa đạt đến giới hạn, chèn phần tử vào cuối list có độ phức tạp thời gian là O(1), vì chỉ cần thêm một phần tử vào cuối mảng; khi dung lượng đã đạt giới hạn và cần mở rộng, cần thực hiện một thao tác O(n) để sao chép mảng gốc sang mảng mới lớn hơn, sau đó thực hiện thao tác O(1) để thêm phần tử.
- Chèn vào vị trí chỉ định: Cần di chuyển tất cả các phần tử sau vị trí đích lùi về sau một vị trí, sau đó đặt phần tử mới vào vị trí chỉ định. Quá trình này cần di chuyển trung bình n/2 phần tử, do đó độ phức tạp thời gian là O(n).

Đối với xóa (delete):

- Xóa ở đầu (head): Do cần di chuyển tất cả các phần tử tiến lên trước một vị trí, nên độ phức tạp thời gian là O(n).
- Xóa ở cuối (tail): Khi phần tử bị xóa nằm ở cuối list, độ phức tạp thời gian là O(1).
- Xóa ở vị trí chỉ định: Cần di chuyển tất cả các phần tử sau phần tử đích tiến lên trước một vị trí để lấp đầy vị trí trống bị xóa, do đó cần di chuyển trung bình n/2 phần tử, độ phức tạp thời gian là O(n).

Dưới đây là một ví dụ minh họa đơn giản:

```java
// Mảng nền của ArrayList có kích thước 10, hiện đang lưu trữ 7 phần tử
+---+---+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |   |   |   |
+---+---+---+---+---+---+---+---+---+---+
  0   1   2   3   4   5   6   7   8   9
// Chèn một phần tử 8 vào vị trí index 1, tất cả các phần tử phía sau phần tử đó đều phải dịch sang phải một vị trí
+---+---+---+---+---+---+---+---+---+---+
| 1 | 8 | 2 | 3 | 4 | 5 | 6 | 7 |   |   |
+---+---+---+---+---+---+---+---+---+---+
  0   1   2   3   4   5   6   7   8   9
// Xóa phần tử tại vị trí index 1, tất cả các phần tử phía sau phần tử đó đều phải dịch sang trái một vị trí
+---+---+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |   |   |   |
+---+---+---+---+---+---+---+---+---+---+
  0   1   2   3   4   5   6   7   8   9
```

### ⭐️ Độ phức tạp thời gian khi chèn và xóa phần tử của LinkedList?

- Chèn/xóa ở đầu (head): Chỉ cần sửa con trỏ của nút đầu (head node) là có thể hoàn thành thao tác chèn/xóa, do đó độ phức tạp thời gian là O(1).
- Chèn/xóa ở cuối (tail): Chỉ cần sửa con trỏ của nút cuối (tail node) là có thể hoàn thành thao tác chèn/xóa, do đó độ phức tạp thời gian là O(1).
- Chèn/xóa ở vị trí chỉ định: Cần di chuyển đến vị trí chỉ định trước, sau đó sửa con trỏ của nút được chỉ định để hoàn thành chèn/xóa. Tuy nhiên, do có con trỏ đầu và cuối, có thể xuất phát từ con trỏ gần hơn, do đó cần duyệt trung bình n/4 phần tử, độ phức tạp thời gian là O(n).

Dưới đây là một ví dụ minh họa đơn giản: Giả sử chúng ta muốn xóa nút 9, cần duyệt linked list trước để tìm nút đó. Sau đó, thực hiện thay đổi con trỏ của nút tương ứng. Source code cụ thể có thể tham khảo: [Phân tích source code LinkedList](https://javaguide.cn/java/collection/linkedlist-source-code.html).

![Logic phương thức unlink](https://oss.javaguide.cn/github/javaguide/java/collection/linkedlist-unlink.jpg)

### Tại sao LinkedList không thể triển khai interface RandomAccess?

`RandomAccess` là một marker interface, dùng để biểu thị rằng lớp triển khai interface này hỗ trợ truy cập ngẫu nhiên (random access) (tức có thể truy cập nhanh phần tử thông qua index). Do cấu trúc dữ liệu nền tảng của `LinkedList` là linked list, địa chỉ bộ nhớ không liên tục, chỉ có thể định vị thông qua con trỏ, không hỗ trợ truy cập ngẫu nhiên nhanh, vì vậy không thể triển khai interface `RandomAccess`.

### ⭐️ Sự khác biệt giữa ArrayList và LinkedList?

- **Có đảm bảo thread-safe không:** `ArrayList` và `LinkedList` đều không được đồng bộ hóa, tức là không đảm bảo thread-safe;
- **Cấu trúc dữ liệu nền tảng:** `ArrayList` tầng dưới sử dụng **mảng `Object`**; `LinkedList` tầng dưới sử dụng cấu trúc dữ liệu **doubly linked list** (trước JDK 1.6 là circular linked list, JDK 1.7 đã bỏ circular. Lưu ý sự khác biệt giữa doubly linked list và doubly circular linked list, có giới thiệu bên dưới!)
- **Chèn và xóa có bị ảnh hưởng bởi vị trí phần tử không:**
  - `ArrayList` sử dụng mảng để lưu trữ, nên độ phức tạp thời gian của chèn và xóa phần tử bị ảnh hưởng bởi vị trí phần tử. Ví dụ: khi thực thi phương thức `add(E e)`, `ArrayList` sẽ mặc định thêm phần tử được chỉ định vào cuối list, trường hợp này độ phức tạp thời gian là O(1). Nhưng nếu muốn chèn và xóa phần tử tại vị trí i được chỉ định (`add(int index, E element)`), độ phức tạp thời gian là O(n). Vì khi thực hiện thao tác trên, phần tử thứ i và (n-i) phần tử sau phần tử thứ i trong collection đều phải thực hiện thao tác dịch lùi về sau / tiến lên trước một vị trí.
  - `LinkedList` sử dụng linked list để lưu trữ, nên chèn hoặc xóa ở đầu và cuối không bị ảnh hưởng bởi vị trí phần tử (`add(E e)`, `addFirst(E e)`, `addLast(E e)`, `removeFirst()`, `removeLast()`), độ phức tạp thời gian là O(1). Nếu muốn chèn và xóa phần tử tại vị trí `i` được chỉ định (`add(int index, E element)`, `remove(Object o)`, `remove(int index)`), độ phức tạp thời gian là O(n), vì cần di chuyển đến vị trí chỉ định trước rồi mới chèn và xóa.
- **Có hỗ trợ truy cập ngẫu nhiên nhanh không:** `LinkedList` không hỗ trợ truy cập phần tử ngẫu nhiên hiệu quả, trong khi `ArrayList` (triển khai interface `RandomAccess`) thì có hỗ trợ. Truy cập ngẫu nhiên nhanh là lấy nhanh đối tượng phần tử thông qua số thứ tự của phần tử (tương ứng với phương thức `get(int index)`).
- **Chiếm dụng không gian bộ nhớ:** Lãng phí không gian của `ArrayList` chủ yếu thể hiện ở chỗ cuối list sẽ dự trữ một lượng không gian dung lượng nhất định, trong khi chi phí không gian của `LinkedList` thể hiện ở chỗ mỗi phần tử của nó đều cần tiêu tốn nhiều không gian hơn `ArrayList` (vì phải lưu trữ con trỏ kế tiếp (successor) và con trỏ trước đó (predecessor) cùng với dữ liệu).

Trong thực tế dự án, chúng ta thường không sử dụng `LinkedList`, các tình huống cần dùng `LinkedList` hầu như đều có thể dùng `ArrayList` để thay thế, và hiệu năng thường sẽ tốt hơn! Ngay cả tác giả của `LinkedList` là Joshua Bloch cũng tự nói rằng ông chưa bao giờ sử dụng `LinkedList`.

![](https://oss.javaguide.cn/github/javaguide/redisimage-20220412110853807.png)

Ngoài ra, đừng mặc định cho rằng `LinkedList` với tư cách là linked list thì phù hợp nhất cho các tình huống thêm xóa phần tử. Tôi đã nói ở trên, `LinkedList` chỉ có độ phức tạp thời gian xấp xỉ O(1) khi chèn hoặc xóa phần tử ở đầu và cuối, các trường hợp thêm xóa phần tử khác đều có độ phức tạp thời gian trung bình là O(n).

#### Nội dung bổ sung: Doubly Linked List và Doubly Circular Linked List

**Doubly Linked List:** Chứa hai con trỏ, một prev trỏ đến nút trước đó, một next trỏ đến nút kế tiếp.

![Doubly Linked List](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/bidirectional-linkedlist.png)

**Doubly Circular Linked List:** next của nút cuối cùng trỏ đến head, và prev của head trỏ đến nút cuối cùng, tạo thành một vòng.

![Doubly Circular Linked List](https://oss.javaguide.cn/github/javaguide/cs-basics/data-structure/bidirectional-circular-linkedlist.png)

#### Nội dung bổ sung: Interface RandomAccess

```java
public interface RandomAccess {
}
```

Xem source code chúng ta phát hiện thực tế interface `RandomAccess` không định nghĩa gì cả. Vì vậy, theo tôi, interface `RandomAccess` chẳng qua chỉ là một marker (đánh dấu). Đánh dấu gì? Đánh dấu rằng lớp triển khai interface này có chức năng truy cập ngẫu nhiên (random access).

Trong phương thức `binarySearch()`, nó cần phán đoán list được truyền vào có phải là instance của `RandomAccess` hay không, nếu đúng thì gọi phương thức `indexedBinarySearch()`, nếu không thì gọi phương thức `iteratorBinarySearch()`.

```java
    public static <T>
    int binarySearch(List<? extends Comparable<? super T>> list, T key) {
        if (list instanceof RandomAccess || list.size()<BINARYSEARCH_THRESHOLD)
            return Collections.indexedBinarySearch(list, key);
        else
            return Collections.iteratorBinarySearch(list, key);
    }
```

`ArrayList` triển khai interface `RandomAccess`, còn `LinkedList` thì không. Tại sao vậy? Tôi nghĩ vẫn là liên quan đến cấu trúc dữ liệu nền tảng! `ArrayList` tầng dưới là mảng, còn `LinkedList` tầng dưới là linked list. Mảng tự nhiên hỗ trợ truy cập ngẫu nhiên, độ phức tạp thời gian là O(1), nên được gọi là truy cập ngẫu nhiên nhanh. Linked list cần duyệt đến vị trí cụ thể mới có thể truy cập phần tử tại vị trí đó, độ phức tạp thời gian là O(n), nên không hỗ trợ truy cập ngẫu nhiên nhanh. `ArrayList` triển khai interface `RandomAccess`, điều này biểu thị rằng nó có chức năng truy cập ngẫu nhiên nhanh. Interface `RandomAccess` chỉ là marker, không phải nói `ArrayList` triển khai interface `RandomAccess` thì mới có chức năng truy cập ngẫu nhiên nhanh!

### ⭐️ Trình bày cơ chế mở rộng dung lượng của ArrayList

Xem chi tiết bài viết của tác giả: [Phân tích cơ chế mở rộng dung lượng ArrayList](https://javaguide.cn/java/collection/arraylist-source-code.html#arraylist-扩容机制分析).

### ⭐️ Fail-fast và fail-safe trong Collection là gì?

`fail-fast` (thất bại nhanh) và `fail-safe` (thất bại an toàn) là hai triết lý thiết kế và chiến lược xử lý lỗi hoàn toàn khác nhau trong Java Collection Framework khi xử lý vấn đề concurrent modification (sửa đổi đồng thời).

Về `fail-fast`, trích dẫn một bài viết trên Medium về `fail-fast` và `fail-safe`:

> Fail-fast systems are designed to immediately stop functioning upon encountering an unexpected condition. This immediate failure helps to catch errors early, making debugging more straightforward.

Tư tưởng của fail-fast là chủ động biểu thị lỗi và dừng hoạt động đối với các exception có thể xảy ra, thông qua việc phát hiện và dừng lỗi sớm, giảm thiểu rủi ro lan truyền lỗi theo tầng trong hệ thống.

Hầu hết các collection trong package `java.util` (như `ArrayList`, `HashMap`) không hỗ trợ thread-safe. Để có thể phát hiện sớm rủi ro thread-safe do thao tác đồng thời gây ra, đề xuất duy trì một biến `modCount` để ghi lại số lần sửa đổi. Trong quá trình lặp (iteration), so sánh số lần sửa đổi dự kiến `expectedModCount` với `modCount` có nhất quán hay không để phán đoán có tồn tại thao tác đồng thời hay không, từ đó triển khai fail-fast, đảm bảo tránh thực thi code phức tạp không cần thiết khi xảy ra exception.

**Ví dụ ArrayList (fail-fast):**

```java
     // Sử dụng ArrayList không thread-safe, nó là một collection fail-fast
      List<Integer> list = new ArrayList<>();
      CountDownLatch latch = new CountDownLatch(2);

      for (int i = 0; i < 5; i++) {
          list.add(i);
      }
      System.out.println("Initial list: " + list);

      Thread t1 = new Thread(() -> {
          try {
              for (Integer i : list) {
                  System.out.println("Iterator Thread (t1) sees: " + i);
                  Thread.sleep(100);
              }
          } catch (ConcurrentModificationException e) {
              System.err.println("!!! Iterator Thread (t1) caught ConcurrentModificationException as expected.");
          } catch (InterruptedException e) {
              e.printStackTrace();
          } finally {
              latch.countDown();
          }
      });

      Thread t2 = new Thread(() -> {
          try {
              Thread.sleep(50);
              System.out.println("-> Modifier Thread (t2) is removing element 1...");
              list.remove(Integer.valueOf(1));
              System.out.println("-> Modifier Thread (t2) finished removal.");
          } catch (InterruptedException e) {
              e.printStackTrace();
          } finally {
              latch.countDown();
          }
      });

      t1.start();
      t2.start();
      latch.await();

      System.out.println("Final list state: " + list);
```

Output:

```
Initial list: [0, 1, 2, 3, 4]
Iterator Thread (t1) sees: 0
-> Modifier Thread (t2) is removing element 1...
-> Modifier Thread (t2) finished removal.
!!! Iterator Thread (t1) caught ConcurrentModificationException as expected.
Final list state: [0, 2, 3, 4]
```

Sau khi thread t2 sửa đổi list, thao tác lặp tiếp theo của thread t1 ngay lập tức ném ra `ConcurrentModificationException`. Điều này là do iterator của ArrayList trong mỗi lần gọi `next()` đều kiểm tra `modCount` có bị thay đổi hay không. Một khi phát hiện collection bị sửa đổi mà iterator không hề hay biết, nó sẽ ngay lập tức "fail-fast" để ngăn chặn việc tiếp tục thao tác trên dữ liệu không nhất quán dẫn đến hậu quả không mong muốn.

Về điều này, chúng tôi cũng đưa ra phương thức `next` khi iterator tầng dưới của vòng lặp `for` lấy phần tử tiếp theo, có thể thấy bên trong nó có logic `checkForComodification` để so sánh số lần sửa đổi:

```java
 public E next() {
 			//Kiểm tra có tồn tại concurrent modification không
            checkForComodification();
            //......
            //Trả về phần tử tiếp theo
            return (E) elementData[lastRet = i];
        }

final void checkForComodification() {
			//Khi số lần lặp hiện tại và số lần sửa đổi dự kiến không nhất quán, sẽ ném ra ConcurrentModificationException
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }

```

Còn `fail-safe` tức là ý nghĩa của thất bại an toàn, nó hướng đến việc ngay cả khi đối mặt với tình huống bất ngờ cũng có thể khôi phục và tiếp tục chạy, điều này khiến nó đặc biệt phù hợp với môi trường không chắc chắn hoặc không ổn định:

> Fail-safe systems take a different approach, aiming to recover and continue even in the face of unexpected conditions. This makes them particularly suited for uncertain or volatile environments.

Tư tưởng này thường được áp dụng trong concurrent container, implementation kinh điển nhất chính là `CopyOnWriteArrayList`. Thông qua tư tưởng Copy-On-Write (sao chép khi ghi), đảm bảo khi thực hiện thao tác sửa đổi sẽ sao chép ra một bản snapshot (ảnh chụp), dựa trên snapshot này để hoàn thành thao tác thêm hoặc xóa, sau đó trỏ tham chiếu mảng nền của `CopyOnWriteArrayList` đến không gian mảng mới này, từ đó tránh bị concurrent modification làm nhiễu loạn dẫn đến vấn đề an toàn thao tác đồng thời. Đương nhiên cách làm này cũng tồn tại nhược điểm, đó là khi thực hiện thao tác duyệt không thể nhận được kết quả thời gian thực:

![](https://oss.javaguide.cn/github/javaguide/java/collection/fail-fast-and-fail-safe-copyonwritearraylist.png)

Tương ứng, chúng tôi cũng đưa ra code lõi triển khai `fail-safe` của `CopyOnWriteArrayList`. Có thể thấy implementation của nó là thông qua `getArray` lấy tham chiếu mảng, sau đó thông qua `Arrays.copyOf` lấy một snapshot của mảng. Dựa trên snapshot này hoàn thành thao tác thêm, sau đó sửa địa chỉ tham chiếu mà biến `array` tầng dưới trỏ đến, từ đó hoàn thành Copy-On-Write:

```java
public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
        	//Lấy mảng gốc
            Object[] elements = getArray();
            int len = elements.length;
            //Dựa trên mảng gốc sao chép ra một bản snapshot bộ nhớ
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            //Thực hiện thao tác thêm
            newElements[len] = e;
            //array trỏ đến mảng mới
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
```

## Set

### Sự khác biệt giữa Comparable và Comparator

Interface `Comparable` và interface `Comparator` đều là các interface dùng để sắp xếp trong Java, chúng đóng vai trò quan trọng trong việc so sánh kích thước, sắp xếp giữa các đối tượng của lớp triển khai:

- Interface `Comparable` thực tế xuất phát từ package `java.lang`, nó có một phương thức `compareTo(Object obj)` dùng để sắp xếp.
- Interface `Comparator` thực tế xuất phát từ package `java.util`, nó có một phương thức `compare(Object obj1, Object obj2)` dùng để sắp xếp.

Thông thường khi cần sử dụng custom sorting cho một collection, chúng ta cần ghi đè phương thức `compareTo()` hoặc phương thức `compare()`. Khi cần triển khai hai cách sắp xếp cho một collection, ví dụ một đối tượng `song` có tên bài hát và tên ca sĩ, mỗi loại áp dụng một phương thức sắp xếp riêng, chúng ta có thể ghi đè phương thức `compareTo()` và sử dụng phương thức `Comparator` tự chế, hoặc dùng hai `Comparator` để triển khai sắp xếp theo tên bài hát và sắp xếp theo tên ca sĩ. Cách thứ hai nghĩa là chúng ta chỉ có thể sử dụng phiên bản hai tham số của `Collections.sort()`.

#### Comparator - Custom Sorting

```java
ArrayList<Integer> arrayList = new ArrayList<Integer>();
arrayList.add(-1);
arrayList.add(3);
arrayList.add(3);
arrayList.add(-5);
arrayList.add(7);
arrayList.add(4);
arrayList.add(-9);
arrayList.add(-7);
System.out.println("Mảng gốc:");
System.out.println(arrayList);
// void reverse(List list)：Đảo ngược
Collections.reverse(arrayList);
System.out.println("Collections.reverse(arrayList):");
System.out.println(arrayList);

// void sort(List list), sắp xếp tăng dần theo thứ tự tự nhiên
Collections.sort(arrayList);
System.out.println("Collections.sort(arrayList):");
System.out.println(arrayList);
// Cách sử dụng custom sorting
Collections.sort(arrayList, new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o2.compareTo(o1);
    }
});
System.out.println("Sau khi custom sorting：");
System.out.println(arrayList);
```

Output:

```plain
Mảng gốc:
[-1, 3, 3, -5, 7, 4, -9, -7]
Collections.reverse(arrayList):
[-7, -9, 4, 7, -5, 3, 3, -1]
Collections.sort(arrayList):
[-9, -7, -5, -1, 3, 3, 4, 7]
Sau khi custom sorting：
[7, 4, 3, 3, -1, -5, -7, -9]
```

#### Ghi đè phương thức compareTo để triển khai sắp xếp theo tuổi

```java
// Đối tượng person không triển khai interface Comparable, nên phải triển khai, như vậy mới không bị lỗi, mới có thể làm cho dữ liệu trong treemap sắp xếp theo thứ tự
// Ví dụ trước đó, lớp String đã mặc định triển khai interface Comparable, chi tiết có thể xem tài liệu API của lớp String, ngoài ra các
// lớp khác như Integer, v.v. đều đã triển khai interface Comparable, nên không cần triển khai thêm
public  class Person implements Comparable<Person> {
    private String name;
    private int age;

    public Person(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    /**
     * T ghi đè phương thức compareTo để triển khai sắp xếp theo tuổi
     */
    @Override
    public int compareTo(Person o) {
        if (this.age > o.getAge()) {
            return 1;
        }
        if (this.age < o.getAge()) {
            return -1;
        }
        return 0;
    }
}

```

```java
    public static void main(String[] args) {
        TreeMap<Person, String> pdata = new TreeMap<Person, String>();
        pdata.put(new Person("Trương Tam", 30), "zhangsan");
        pdata.put(new Person("Lý Tứ", 20), "lisi");
        pdata.put(new Person("Vương Ngũ", 10), "wangwu");
        pdata.put(new Person("Tiểu Hồng", 5), "xiaohong");
        // Lấy giá trị của key đồng thời lấy giá trị tương ứng với key
        Set<Person> keys = pdata.keySet();
        for (Person key : keys) {
            System.out.println(key.getAge() + "-" + key.getName());

        }
    }
```

Output：

```plain
5-Tiểu Hồng
10-Vương Ngũ
20-Lý Tứ
30-Trương Tam
```

### Ý nghĩa của tính không có thứ tự (unordered) và tính không thể trùng lặp (non-duplicate)

- Tính không có thứ tự (unordered) không đồng nghĩa với tính ngẫu nhiên (randomness). Tính không có thứ tự nghĩa là dữ liệu được lưu trữ trong mảng nền không được thêm theo thứ tự index của mảng, mà được quyết định dựa trên giá trị hash của dữ liệu.
- Tính không thể trùng lặp (non-duplicate) nghĩa là khi phần tử được thêm vào, nếu kiểm tra bằng `equals()` trả về false, cần đồng thời ghi đè cả phương thức `equals()` và phương thức `hashCode()`.

### So sánh điểm giống và khác nhau giữa HashSet, LinkedHashSet và TreeSet

- `HashSet`, `LinkedHashSet` và `TreeSet` đều là các lớp triển khai của interface `Set`, đều có thể đảm bảo phần tử duy nhất, và đều không thread-safe.
- Sự khác biệt chính giữa `HashSet`, `LinkedHashSet` và `TreeSet` nằm ở cấu trúc dữ liệu nền tảng khác nhau. Cấu trúc dữ liệu nền tảng của `HashSet` là hash table (dựa trên `HashMap`). Cấu trúc dữ liệu nền tảng của `LinkedHashSet` là linked list và hash table, thứ tự chèn và lấy ra của phần tử tuân thủ FIFO. Cấu trúc dữ liệu nền tảng của `TreeSet` là red-black tree, phần tử có thứ tự, phương thức sắp xếp bao gồm natural ordering và custom sorting.
- Cấu trúc dữ liệu nền tảng khác nhau dẫn đến tình huống ứng dụng của ba loại này cũng khác nhau. `HashSet` dùng cho tình huống không cần đảm bảo thứ tự chèn và lấy ra của phần tử, `LinkedHashSet` dùng cho tình huống cần đảm bảo thứ tự chèn và lấy ra của phần tử tuân thủ FIFO, `TreeSet` dùng cho tình huống cần hỗ trợ quy tắc custom sorting cho phần tử.

## Queue

### Sự khác biệt giữa Queue và Deque

`Queue` là hàng đợi một đầu (single-ended queue), chỉ có thể chèn phần tử từ một đầu, xóa phần tử từ đầu kia, implementation thường tuân theo quy tắc **First-In-First-Out (FIFO)**.

`Queue` mở rộng interface `Collection`, dựa trên **cách xử lý khác nhau sau khi thao tác thất bại do vấn đề dung lượng**, có thể chia thành hai loại phương thức: một loại sẽ ném exception sau khi thao tác thất bại, loại còn lại sẽ trả về giá trị đặc biệt.

| Interface `Queue` | Ném exception | Trả về giá trị đặc biệt |
| ----------------- | ------------- | ----------------------- |
| Chèn vào cuối hàng đợi | add(E e) | offer(E e) |
| Xóa ở đầu hàng đợi | remove() | poll() |
| Truy vấn phần tử đầu hàng đợi | element() | peek() |

`Deque` là hàng đợi hai đầu (double-ended queue), có thể chèn hoặc xóa phần tử ở cả hai đầu của hàng đợi.

`Deque` mở rộng interface `Queue`, bổ sung thêm các phương thức chèn và xóa ở đầu và cuối hàng đợi, tương tự cũng chia thành hai loại dựa trên cách xử lý sau khi thất bại:

| Interface `Deque` | Ném exception | Trả về giá trị đặc biệt |
| ----------------- | ------------- | ----------------------- |
| Chèn vào đầu hàng đợi | addFirst(E e) | offerFirst(E e) |
| Chèn vào cuối hàng đợi | addLast(E e) | offerLast(E e) |
| Xóa ở đầu hàng đợi | removeFirst() | pollFirst() |
| Xóa ở cuối hàng đợi | removeLast() | pollLast() |
| Truy vấn phần tử đầu hàng đợi | getFirst() | peekFirst() |
| Truy vấn phần tử cuối hàng đợi | getLast() | peekLast() |

Thực tế, `Deque` còn cung cấp các phương thức khác như `push()` và `pop()`, có thể dùng để mô phỏng stack (ngăn xếp).

### Sự khác biệt giữa ArrayDeque và LinkedList

`ArrayDeque` và `LinkedList` đều triển khai interface `Deque`, cả hai đều có chức năng của hàng đợi, nhưng giữa chúng có sự khác biệt gì?

- `ArrayDeque` được triển khai dựa trên mảng có độ dài thay đổi và con trỏ kép (double pointer), trong khi `LinkedList` được triển khai thông qua linked list.

- `ArrayDeque` không hỗ trợ lưu trữ dữ liệu `NULL`, nhưng `LinkedList` thì có hỗ trợ.

- `ArrayDeque` được giới thiệu từ JDK 1.6, trong khi `LinkedList` đã tồn tại từ JDK 1.2.

- `ArrayDeque` khi chèn có thể tồn tại quá trình mở rộng (expansion), tuy nhiên thao tác chèn sau khi được trải đều (amortized) vẫn là O(1). Mặc dù `LinkedList` không cần mở rộng, nhưng mỗi lần chèn dữ liệu đều cần yêu cầu không gian heap mới, hiệu năng trải đều (amortized performance) tương đối chậm hơn.

Từ góc độ hiệu năng, chọn `ArrayDeque` để triển khai hàng đợi sẽ tốt hơn `LinkedList`. Ngoài ra, `ArrayDeque` cũng có thể được dùng để triển khai stack.

### Trình bày về PriorityQueue

`PriorityQueue` được giới thiệu từ JDK 1.5, sự khác biệt của nó với `Queue` nằm ở chỗ thứ tự ra khỏi hàng đợi (dequeue) của phần tử liên quan đến độ ưu tiên (priority), tức là phần tử có độ ưu tiên cao nhất luôn ra khỏi hàng đợi trước.

Dưới đây liệt kê một số điểm liên quan:

- `PriorityQueue` sử dụng cấu trúc dữ liệu binary heap (đống nhị phân) để triển khai, tầng dưới sử dụng mảng có độ dài thay đổi để lưu trữ dữ liệu.
- `PriorityQueue` thông qua thao tác sift-up (nổi lên) và sift-down (chìm xuống) của phần tử heap, triển khai chèn phần tử và xóa phần tử đỉnh heap trong độ phức tạp thời gian O(log n).
- `PriorityQueue` không thread-safe, và không hỗ trợ lưu trữ `NULL`. Khi không cung cấp `Comparator`, phần tử cần triển khai `Comparable`; khi cung cấp `Comparator`, phần tử cần có thể được so sánh lẫn nhau bởi comparator đó.
- `PriorityQueue` mặc định là min-heap (đống nhỏ nhất), nhưng có thể nhận một `Comparator` làm tham số khởi tạo, từ đó tự định nghĩa thứ tự ưu tiên của phần tử.

`PriorityQueue` trong phỏng vấn có thể xuất hiện nhiều hơn trong các tình huống viết tay thuật toán, các bài tập điển hình bao gồm heap sort, tìm số lớn thứ K, duyệt đồ thị có trọng số, v.v., nên cần phải sử dụng thành thạo.

Nếu muốn ôn trước template thuật toán heap và Top K, có thể xem [Heap chi tiết](../../cs-basics/data-structure/heap.md) và [Tổng hợp câu hỏi phỏng vấn Top K](../../cs-basics/algorithms/top-k.md).

### BlockingQueue là gì?

`BlockingQueue` (hàng đợi chặn) là một interface, kế thừa từ `Queue`. Nó cung cấp bốn cách xử lý cho thao tác chèn và xóa: ném exception, trả về giá trị đặc biệt, chặn liên tục (blocking) và chờ có thời gian chờ (timeout). Trong đó, `take()` có thể chặn khi hàng đợi rỗng, `put()` có thể chặn khi hàng đợi bị giới hạn dung lượng đã đầy.

```java
public interface BlockingQueue<E> extends Queue<E> {
  // ...
}
```

`BlockingQueue` thường được dùng trong mô hình Producer-Consumer (Nhà sản xuất - Người tiêu dùng), luồng producer sẽ thêm dữ liệu vào hàng đợi, còn luồng consumer sẽ lấy dữ liệu từ hàng đợi để xử lý.

![BlockingQueue](https://oss.javaguide.cn/github/javaguide/java/collection/blocking-queue.png)

### Các lớp triển khai của BlockingQueue là gì?

![Các lớp triển khai của BlockingQueue](https://oss.javaguide.cn/github/javaguide/java/collection/blocking-queue-hierarchy.png)

Các lớp triển khai blocking queue phổ biến trong Java gồm có:

1. `ArrayBlockingQueue`: Hàng đợi chặn có giới hạn (bounded) được triển khai bằng mảng. Khi tạo cần chỉ định kích thước dung lượng, và hỗ trợ cơ chế truy cập khóa công bằng (fair) và không công bằng (non-fair).
2. `LinkedBlockingQueue`: Hàng đợi chặn có giới hạn tùy chọn (optionally-bounded) được triển khai bằng singly linked list. Khi tạo có thể chỉ định kích thước dung lượng, nếu không chỉ định thì mặc định là `Integer.MAX_VALUE`. Khác với `ArrayBlockingQueue`, nó chỉ hỗ trợ cơ chế truy cập khóa không công bằng.
3. `PriorityBlockingQueue`: Hàng đợi chặn không giới hạn (unbounded) hỗ trợ sắp xếp theo độ ưu tiên. Phần tử phải triển khai interface `Comparable` hoặc truyền vào đối tượng `Comparator` trong constructor, và không thể chèn phần tử null.
4. `SynchronousQueue`: Hàng đợi đồng bộ (synchronous queue), là một blocking queue không lưu trữ phần tử. Mỗi thao tác chèn đều phải chờ một thao tác xóa tương ứng, ngược lại thao tác xóa cũng phải chờ thao tác chèn. Do đó, `SynchronousQueue` thường được dùng để truyền dữ liệu trực tiếp giữa các luồng.
5. `DelayQueue`: Hàng đợi trễ (delay queue), trong đó phần tử chỉ có thể ra khỏi hàng đợi khi đến thời gian trễ được chỉ định.
6. ……

Trong phát triển hàng ngày, những hàng đợi này thực sự được sử dụng không nhiều, chỉ cần biết là được.

### ⭐️ ArrayBlockingQueue và LinkedBlockingQueue khác nhau như thế nào?

`ArrayBlockingQueue` và `LinkedBlockingQueue` là hai loại blocking queue thường dùng trong Java Concurrency Package, chúng đều thread-safe. Tuy nhiên, giữa chúng tồn tại những sự khác biệt sau:

- Triển khai nền tảng: `ArrayBlockingQueue` dựa trên mảng, còn `LinkedBlockingQueue` dựa trên linked list.
- Có giới hạn hay không: `ArrayBlockingQueue` là hàng đợi có giới hạn (bounded), phải chỉ định kích thước dung lượng khi tạo. `LinkedBlockingQueue` khi tạo có thể không chỉ định kích thước dung lượng, mặc định là `Integer.MAX_VALUE`, tức là không giới hạn (unbounded). Nhưng cũng có thể chỉ định kích thước hàng đợi, từ đó trở thành có giới hạn.
- Khóa có được tách biệt không: Khóa trong `ArrayBlockingQueue` không được tách biệt, tức là sản xuất (produce) và tiêu thụ (consume) dùng cùng một khóa; khóa trong `LinkedBlockingQueue` được tách biệt, tức là sản xuất dùng `putLock`, tiêu thụ dùng `takeLock`, điều này có thể ngăn chặn tranh chấp khóa giữa luồng producer và consumer.
- Chiếm dụng bộ nhớ: `ArrayBlockingQueue` cần phân bổ trước bộ nhớ mảng, còn `LinkedBlockingQueue` thì phân bổ động bộ nhớ nút linked list. Điều này có nghĩa là `ArrayBlockingQueue` khi tạo sẽ chiếm dụng một lượng không gian bộ nhớ nhất định, và thường thì bộ nhớ được yêu cầu lớn hơn bộ nhớ thực tế sử dụng, còn `LinkedBlockingQueue` thì theo sự tăng lên của phần tử mà dần dần chiếm dụng không gian bộ nhớ.

## Tài liệu mở rộng về cấu trúc dữ liệu

Phỏng vấn Java Collection thường xuyên truy vấn đến cấu trúc dữ liệu nền tảng. Khuyến nghị kết hợp ôn tập cùng các bài viết sau:

- [Cấu trúc dữ liệu tuyến tính chi tiết](../../cs-basics/data-structure/linear-data-structure.md): Hiểu mối quan hệ giữa mảng, linked list, stack, queue và `ArrayList`, `LinkedList`, `ArrayDeque`.
- [Tổng hợp câu hỏi phỏng vấn Hash Table](../../cs-basics/data-structure/hash-table.md): Hiểu hash collision, mở rộng dung lượng và tư tưởng nền tảng của `HashMap`.
- [Red-Black Tree chi tiết](../../cs-basics/data-structure/red-black-tree.md): Hiểu red-black tree liên quan đến `TreeMap`, `TreeSet` và `HashMap` khi chuyển linked list thành cây.
- [Heap chi tiết](../../cs-basics/data-structure/heap.md): Hiểu cấu trúc nền tảng của `PriorityQueue` và dạng bài Top K.

<!-- @include: @article-footer.snippet.md -->