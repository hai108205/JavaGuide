---
title: Tổng hợp lưu ý khi sử dụng Java Collection
description: Tổng hợp lưu ý khi sử dụng Java Collection: dựa trên Alibaba Java Development Manual, tổng hợp các best practice như kiểm tra collection rỗng, bẫy Arrays.asList, vấn đề subList, lựa chọn concurrent collection, v.v. để tránh các lỗi phổ biến.
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: Java集合最佳实践,集合判空,Arrays.asList,subList,并发容器,集合使用注意事项,性能优化
---

Bài viết này tổng hợp các lưu ý phổ biến khi sử dụng collection cùng nguyên lý cụ thể, dựa trên tài liệu "Alibaba Java Development Manual".

Bạn nên đọc lại nhiều lần để tránh mắc phải những lỗi cơ bản này khi viết code.

## Kiểm tra collection rỗng

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Để kiểm tra tất cả phần tử bên trong collection có rỗng hay không, hãy sử dụng phương thức `isEmpty()` thay vì `size() == 0`.**

Lý do là phương thức `isEmpty()` có khả năng đọc hiểu tốt hơn và độ phức tạp thời gian là `O(1)`.

Phần lớn collection chúng ta sử dụng, phương thức `size()` cũng có độ phức tạp `O(1)`, tuy nhiên cũng có nhiều trường hợp không phải `O(1)`, ví dụ như `ConcurrentLinkedQueue` trong gói `java.util.concurrent`. Phương thức `isEmpty()` của `ConcurrentLinkedQueue` thực hiện kiểm tra thông qua phương thức `first()`, trong đó `first()` trả về node đầu tiên trong hàng đợi có giá trị khác `null` (giá trị node bằng `null` là do cơ chế xóa logic được sử dụng trong iterator).

```java
public boolean isEmpty() { return first() == null; }

Node<E> first() {
    restartFromHead:
    for (;;) {
        for (Node<E> h = head, p = h, q;;) {
            boolean hasItem = (p.item != null);
            if (hasItem || (q = p.next) == null) {  // 当前节点值不为空 或 到达队尾
                updateHead(h, p);  // 将head设置为p
                return hasItem ? p : null;
            }
            else if (p == q) continue restartFromHead;
            else p = q;  // p = p.next
        }
    }
}
```

Do khi thêm và xóa phần tử, phương thức `updateHead(h, p)` đều được thực thi, nên độ phức tạp thời gian của phương thức này có thể xấp xỉ `O(1)`. Trong khi đó, phương thức `size()` cần duyệt qua toàn bộ linked list, độ phức tạp thời gian là `O(n)`.

```java
public int size() {
    int count = 0;
    for (Node<E> p = first(); p != null; p = succ(p))
        if (p.item != null)
            if (++count == Integer.MAX_VALUE)
                break;
    return count;
}
```

Ngoài ra, trong `ConcurrentHashMap` 1.7, độ phức tạp thời gian của `size()` và `isEmpty()` cũng không giống nhau. `ConcurrentHashMap` 1.7 lưu trữ số lượng phần tử trong mỗi `Segment`, `size()` cần thống kê số lượng của từng `Segment`, trong khi `isEmpty()` chỉ cần tìm `Segment` đầu tiên không rỗng. Tuy nhiên trong `ConcurrentHashMap` 1.8, cả `size()` và `isEmpty()` đều cần gọi `sumCount()` để tổng hợp `baseCount` và số đếm trong `CounterCell[]`. Dưới đây là mã nguồn của `sumCount()`:

```java
final long sumCount() {
    CounterCell[] as = counterCells; CounterCell a;
    long sum = baseCount;
    if (as != null)
        for (int i = 0; i < as.length; ++i)
            if ((a = as[i]) != null)
                sum += a.value;
    return sum;
}
```

Trong môi trường đa luồng, `ConcurrentHashMap` 1.8 sử dụng `baseCount` và `CounterCell[]` để phân tán cạnh tranh khi cập nhật số đếm, thay vì lưu số lượng node trong mỗi `Node`. Trong `ConcurrentHashMap` 1.7, số lượng phần tử được lưu trong mỗi `Segment`, `size()` cần thống kê số lượng của từng `Segment`, còn `isEmpty()` chỉ cần tìm `Segment` đầu tiên không rỗng.

## Chuyển collection sang Map

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Khi sử dụng phương thức `toMap()` của lớp `java.util.stream.Collectors` để chuyển sang `Map`, cần đặc biệt lưu ý rằng khi value là null sẽ ném ra ngoại lệ NPE (NullPointerException).**

```java
class Person {
    private String name;
    private String phoneNumber;
     // getters and setters
}

List<Person> bookList = new ArrayList<>();
bookList.add(new Person("jack","18163138123"));
bookList.add(new Person("martin",null));
// 空指针异常
bookList.stream().collect(Collectors.toMap(Person::getName, Person::getPhoneNumber));
```

Dưới đây chúng ta sẽ giải thích nguyên nhân.

Trước tiên, hãy xem phương thức `toMap()` của lớp `java.util.stream.Collectors`, có thể thấy bên trong nó gọi phương thức `merge()` của interface `Map`.

```java
public static <T, K, U, M extends Map<K, U>>
Collector<T, ?, M> toMap(Function<? super T, ? extends K> keyMapper,
                            Function<? super T, ? extends U> valueMapper,
                            BinaryOperator<U> mergeFunction,
                            Supplier<M> mapSupplier) {
    BiConsumer<M, T> accumulator
            = (map, element) -> map.merge(keyMapper.apply(element),
                                          valueMapper.apply(element), mergeFunction);
    return new CollectorImpl<>(mapSupplier, accumulator, mapMerger(mergeFunction), CH_ID);
}
```

Phương thức `merge()` của interface `Map` như sau, đây là default implementation trong interface.

> Nếu bạn chưa quen với các tính năng mới của Java 8, hãy xem bài viết: [《Java8 新特性总结》](https://mp.weixin.qq.com/s/ojyl7B6PiHaTWADqmUq2rw).

```java
default V merge(K key, V value,
        BiFunction<? super V, ? super V, ? extends V> remappingFunction) {
    Objects.requireNonNull(remappingFunction);
    Objects.requireNonNull(value);
    V oldValue = get(key);
    V newValue = (oldValue == null) ? value :
               remappingFunction.apply(oldValue, value);
    if(newValue == null) {
        remove(key);
    } else {
        put(key, newValue);
    }
    return newValue;
}
```

Phương thức `merge()` sẽ gọi `Objects.requireNonNull()` trước để kiểm tra value có null hay không.

```java
public static <T> T requireNonNull(T obj) {
    if (obj == null)
        throw new NullPointerException();
    return obj;
}
```

> `Collectors` cũng cung cấp phương thức `toMap()` không yêu cầu mergeFunction, nhưng lúc này nếu xảy ra xung đột key, nó sẽ ném ra ngoại lệ `duplicateKeyException`, do đó rất khuyến khích luôn truyền mergeFunction khi sử dụng `toMap()`.

## Duyệt collection

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Không thực hiện thao tác `remove/add` phần tử bên trong vòng lặp foreach. Để remove phần tử, hãy sử dụng `Iterator`; nếu thao tác trong môi trường đa luồng, cần khóa (lock) đối tượng `Iterator`.**

Cần lưu ý rằng chỉ khóa đối tượng `Iterator` không thể ngăn các luồng khác sửa đổi collection. Lấy ví dụ với synchronized wrapper trả về từ `Collections.synchronizedXxx()`, khi duyệt cần đồng bộ trên chính đối tượng collection đã được wrap, và đảm bảo mọi truy cập đều thông qua wrapper đó.

Thông qua decompile, bạn sẽ thấy cú pháp foreach thực chất vẫn dựa trên `Iterator`. Tuy nhiên, thao tác `remove/add` gọi trực tiếp phương thức của chính collection, chứ không phải phương thức `remove/add` của `Iterator`.

Điều này khiến `Iterator` đột nhiên phát hiện có phần tử bị `remove/add`, và sau đó nó sẽ ném ra `ConcurrentModificationException` để cảnh báo người dùng đã xảy ra concurrent modification. Đây chính là **cơ chế fail-fast** xảy ra ngay cả trong môi trường đơn luồng.

> **Cơ chế fail-fast**: Khi nhiều luồng cùng sửa đổi một fail-fast collection, có thể ném ra `ConcurrentModificationException`. Ngay cả trong môi trường đơn luồng, tình huống này cũng có thể xảy ra như đã đề cập ở trên.
>
> Bài viết liên quan: [什么是 fail-fast](https://www.cnblogs.com/54chensongxia/p/12470446.html).

Từ Java 8 trở đi, bạn có thể sử dụng `Collection#removeIf()` để xóa các phần tử thỏa mãn điều kiện cụ thể, ví dụ:

```java
List<Integer> list = new ArrayList<>();
for (int i = 1; i <= 10; ++i) {
    list.add(i);
}
list.removeIf(filter -> filter % 2 == 0); /* 删除list中的所有偶数 */
System.out.println(list); /* [1, 3, 5, 7, 9] */
```

Ngoài cách sử dụng `Iterator` để duyệt như đã giới thiệu ở trên, bạn còn có thể:

- Sử dụng vòng lặp for thông thường
- Sử dụng lớp collection hỗ trợ snapshot iterator hoặc weakly consistent iterator tùy theo ngữ cảnh. Ví dụ, iterator của `CopyOnWriteArrayList` dựa trên snapshot, iterator của `ConcurrentHashMap` là weakly consistent.
- ……

## Loại bỏ phần tử trùng lặp trong collection

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Có thể tận dụng đặc tính phần tử duy nhất của `Set` để nhanh chóng loại bỏ trùng lặp cho một collection, tránh sử dụng `contains()` của `List` để duyệt và loại bỏ trùng lặp hoặc kiểm tra contains.**

Ở đây chúng ta lấy `HashSet` và `ArrayList` làm ví dụ.

```java
// Set 去重代码示例
public static <T> Set<T> removeDuplicateBySet(List<T> data) {

    if (CollectionUtils.isEmpty(data)) {
        return new HashSet<>();
    }
    return new HashSet<>(data);
}

// List 去重代码示例
public static <T> List<T> removeDuplicateByList(List<T> data) {

    if (CollectionUtils.isEmpty(data)) {
        return new ArrayList<>();

    }
    List<T> result = new ArrayList<>(data.size());
    for (T current : data) {
        if (!result.contains(current)) {
            result.add(current);
        }
    }
    return result;
}

```

Sự khác biệt cốt lõi giữa hai cách nằm ở cách triển khai phương thức `contains()`.

Phương thức `contains()` của `HashSet` phụ thuộc vào `containsKey()` của `HashMap` bên dưới, độ phức tạp thời gian gần bằng O(1) (khi không xảy ra hash collision thì là O(1)).

```java
private transient HashMap<E,Object> map;
public boolean contains(Object o) {
    return map.containsKey(o);
}
```

Khi chúng ta chèn N phần tử vào Set, độ phức tạp thời gian sẽ xấp xỉ O(n).

Phương thức `contains()` của `ArrayList` được thực hiện bằng cách duyệt qua tất cả phần tử, độ phức tạp thời gian xấp xỉ O(n).

```java
public boolean contains(Object o) {
    return indexOf(o) >= 0;
}
public int indexOf(Object o) {
    if (o == null) {
        for (int i = 0; i < size; i++)
            if (elementData[i]==null)
                return i;
    } else {
        for (int i = 0; i < size; i++)
            if (o.equals(elementData[i]))
                return i;
    }
    return -1;
}

```

## Chuyển collection sang array

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Khi chuyển collection sang array, phải sử dụng `toArray(T[] array)` của collection, truyền vào một mảng rỗng có độ dài 0 và kiểu hoàn toàn khớp.**

Tham số của `toArray(T[] array)` là một generic array. Nếu `toArray` không truyền bất kỳ tham số nào, nó sẽ trả về mảng kiểu `Object`.

```java
String [] s= new String[]{
    "dog", "lazy", "a", "over", "jumps", "fox", "brown", "quick", "A"
};
List<String> list = Arrays.asList(s);
Collections.reverse(list);
//没有指定类型的话会报错
s=list.toArray(new String[0]);
```

Do tối ưu hóa của JVM, `new String[0]` hiện là cách tốt hơn khi dùng làm tham số cho `Collection.toArray()`. `new String[0]` đóng vai trò như một template, chỉ định kiểu của mảng trả về, 0 là để tiết kiệm không gian, vì nó chỉ nhằm mục đích khai báo kiểu trả về. Xem thêm: <https://shipilev.net/blog/2016/arrays-wisdom-ancients/>

## Chuyển array sang collection

Mô tả trong "Alibaba Java Development Manual" như sau:

> **Khi sử dụng `Arrays.asList()` để chuyển array thành collection, không được sử dụng các phương thức sửa đổi collection, vì `add/remove/clear` của nó sẽ ném ra ngoại lệ `UnsupportedOperationException`.**

Tôi đã từng gặp phải một cái bẫy tương tự trong dự án trước đây.

`Arrays.asList()` khá phổ biến trong quá trình phát triển hàng ngày, chúng ta có thể dùng nó để chuyển một array thành `List`.

```java
String[] myArray = {"Apple", "Banana", "Orange"};
List<String> myList = Arrays.asList(myArray);
//上面两个语句等价于下面一条语句
List<String> myList = Arrays.asList("Apple","Banana", "Orange");
```

Mô tả trong mã nguồn JDK về phương thức này:

```java
/**
  *返回由指定数组支持的固定大小的列表。此方法作为基于数组和基于集合的API之间的桥梁，
  * 与 Collection.toArray()结合使用。返回的List是可序列化并实现RandomAccess接口。
  */
public static <T> List<T> asList(T... a) {
    return new ArrayList<>(a);
}
```

Dưới đây là tổng hợp các lưu ý khi sử dụng.

**1. `Arrays.asList()` sẽ không tự động boxing (autobox) kiểu nguyên thủy và mở rộng thành các phần tử của list.**

```java
int[] myArray = {1, 2, 3};
List myList = Arrays.asList(myArray);
System.out.println(myList.size());//1
System.out.println(myList.get(0));//数组地址值
System.out.println(myList.get(1));//报错：ArrayIndexOutOfBoundsException
int[] array = (int[]) myList.get(0);
System.out.println(array[0]);//1
```

Khi truyền vào một mảng kiểu dữ liệu nguyên thủy, tham số thực sự mà `Arrays.asList()` nhận được không phải là các phần tử trong mảng, mà là chính đối tượng mảng đó! Lúc này phần tử duy nhất của `List` chính là mảng này, điều này giải thích cho đoạn code ở trên.

Chúng ta có thể giải quyết vấn đề này bằng cách sử dụng mảng kiểu wrapper (wrapper type).

```java
Integer[] myArray = {1, 2, 3};
```

**2. Sử dụng các phương thức sửa đổi collection: `add()`, `remove()`, `clear()` sẽ ném ra ngoại lệ.**

```java
List myList = Arrays.asList(1, 2, 3);
myList.add(4);//运行时报错：UnsupportedOperationException
myList.remove(1);//运行时报错：UnsupportedOperationException
myList.clear();//运行时报错：UnsupportedOperationException
```

Phương thức `Arrays.asList()` trả về không phải là `java.util.ArrayList`, mà là một inner class của `java.util.Arrays`. Inner class này không triển khai các phương thức sửa đổi collection, hay nói cách khác là không override các phương thức đó.

```java
List myList = Arrays.asList(1, 2, 3);
System.out.println(myList.getClass());//class java.util.Arrays$ArrayList
```

Hình dưới đây là mã nguồn đơn giản của `java.util.Arrays$ArrayList`, chúng ta có thể thấy lớp này đã override những phương thức nào.

```java
  private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable
    {
        ...

        @Override
        public E get(int index) {
          ...
        }

        @Override
        public E set(int index, E element) {
          ...
        }

        @Override
        public int indexOf(Object o) {
          ...
        }

        @Override
        public boolean contains(Object o) {
           ...
        }

        @Override
        public void forEach(Consumer<? super E> action) {
          ...
        }

        @Override
        public void replaceAll(UnaryOperator<E> operator) {
          ...
        }

        @Override
        public void sort(Comparator<? super E> c) {
          ...
        }
    }
```

Hãy xem phương thức `add/remove/clear` của `java.util.AbstractList` để hiểu tại sao lại ném ra `UnsupportedOperationException`.

```java
public E remove(int index) {
    throw new UnsupportedOperationException();
}
public boolean add(E e) {
    add(size(), e);
    return true;
}
public void add(int index, E element) {
    throw new UnsupportedOperationException();
}

public void clear() {
    removeRange(0, size());
}
protected void removeRange(int fromIndex, int toIndex) {
    ListIterator<E> it = listIterator(fromIndex);
    for (int i=0, n=toIndex-fromIndex; i<n; i++) {
        it.next();
        it.remove();
    }
}
```

**Vậy làm thế nào để chuyển đổi array thành `ArrayList` một cách chính xác?**

1. Tự triển khai utility class

```java
//JDK1.5+
static <T> List<T> arrayToList(final T[] array) {
  final List<T> l = new ArrayList<T>(array.length);

  for (final T s : array) {
    l.add(s);
  }
  return l;
}


Integer [] myArray = { 1, 2, 3 };
System.out.println(arrayToList(myArray).getClass());//class java.util.ArrayList
```

2. Cách đơn giản nhất

```java
List list = new ArrayList<>(Arrays.asList("a", "b", "c"))
```

3. Sử dụng `Stream` của Java 8 (khuyến khích)

```java
Integer [] myArray = { 1, 2, 3 };
List myList = Arrays.stream(myArray).collect(Collectors.toList());
//基本类型也可以实现转换（依赖boxed的装箱操作）
int [] myArray2 = { 1, 2, 3 };
List myList = Arrays.stream(myArray2).boxed().collect(Collectors.toList());
```

4. Sử dụng Guava

Đối với immutable collection, bạn có thể sử dụng lớp [`ImmutableList`](https://github.com/google/guava/blob/master/guava/src/com/google/common/collect/ImmutableList.java) cùng các factory method [`of()`](https://github.com/google/guava/blob/master/guava/src/com/google/common/collect/ImmutableList.java#L101) và [`copyOf()`](https://github.com/google/guava/blob/master/guava/src/com/google/common/collect/ImmutableList.java#L225): (tham số không được null)

```java
List<String> il = ImmutableList.of("string", "elements");  // from varargs
List<String> il = ImmutableList.copyOf(aStringArray);      // from array
```

Đối với mutable collection, bạn có thể sử dụng lớp [`Lists`](https://github.com/google/guava/blob/master/guava/src/com/google/common/collect/Lists.java) cùng factory method [`newArrayList()`](https://github.com/google/guava/blob/master/guava/src/com/google/common/collect/Lists.java#L87):

```java
List<String> l1 = Lists.newArrayList(anotherListOrCollection);    // from collection
List<String> l2 = Lists.newArrayList(aStringArray);               // from array
List<String> l3 = Lists.newArrayList("or", "string", "elements"); // from varargs
```

5. Sử dụng Apache Commons Collections

```java
List<String> list = new ArrayList<String>();
CollectionUtils.addAll(list, str);
```

6. Sử dụng `List.of()` của Java 9

```java
Integer[] array = {1, 2, 3};
List<Integer> list = List.of(array);
```

<!-- @include: @article-footer.snippet.md -->