---
title: Phân tích mã nguồn CopyOnWriteArrayList
description: "Phân tích chuyên sâu mã nguồn CopyOnWriteArrayList: giải thích chi tiết cơ chế Copy-On-Write (COW), phù hợp với kịch bản đọc nhiều ghi ít, hiện thực List thread-safe, đảm bảo snapshot consistency và đánh đổi về bộ nhớ."
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: CopyOnWriteArrayList源码,写时复制COW,线程安全List,读多写少,并发容器,快照一致性
---

## Giới thiệu CopyOnWriteArrayList

Trước JDK 1.5, nếu muốn sử dụng `List` an toàn trong môi trường đa luồng (thread-safe), bạn có thể chọn `Vector` hoặc wrapper đồng bộ được trả về từ `Collections.synchronizedList()`. Trong đó, `Vector` là một tập hợp (collection) cũ kỹ và đã bị loại bỏ. `Vector` gần như thêm `synchronized` vào tất cả các phương thức như thêm, sửa, xóa, truy vấn. Cách làm này tuy đảm bảo đồng bộ, nhưng tương đương với việc khóa toàn bộ `Vector` bằng một khóa lớn, khiến mỗi khi thực thi phương thức đều phải giành khóa, dẫn đến hiệu năng rất thấp.

JDK 1.5 đã giới thiệu gói `java.util.concurrent` (JUC), cung cấp nhiều container thread-safe với hiệu năng đồng thời tốt, trong đó hiện thực `List` thread-safe duy nhất chính là `CopyOnWriteArrayList`. Để xem tổng quan về các container đồng thời phổ biến trong gói `java.util.concurrent`, bạn có thể đọc bài viết này: [Tổng quan các container đồng thời trong Java](https://javaguide.cn/java/concurrent/java-concurrent-collections.html).

### CopyOnWriteArrayList có gì đặc biệt?

Trong hầu hết các kịch bản nghiệp vụ, thao tác đọc thường nhiều hơn rất nhiều so với thao tác ghi. Vì thao tác đọc không sửa đổi dữ liệu gốc, nên việc khóa cho mỗi lần đọc thực chất là một sự lãng phí tài nguyên. Thay vào đó, chúng ta nên cho phép nhiều luồng đồng thời truy cập dữ liệu nội bộ của `List`, vì xét cho cùng thì thao tác đọc là an toàn.

Tư tưởng này rất giống với triết lý thiết kế của `ReentrantReadWriteLock` (khóa đọc-ghi), tức là: đọc-đọc không loại trừ lẫn nhau, đọc-ghi loại trừ lẫn nhau, ghi-ghi loại trừ lẫn nhau (chỉ có đọc-đọc là không loại trừ). `CopyOnWriteArrayList` đã tiến xa hơn trong việc hiện thực tư tưởng này. Để đưa hiệu năng thao tác đọc lên mức tối đa, thao tác đọc trong `CopyOnWriteArrayList` hoàn toàn không cần khóa. Hơn thế nữa, thao tác ghi cũng không chặn thao tác đọc, chỉ có ghi-ghi mới loại trừ lẫn nhau. Nhờ đó, hiệu năng thao tác đọc được cải thiện đáng kể.

Cốt lõi khiến `CopyOnWriteArrayList` thread-safe nằm ở việc nó áp dụng chiến lược **Copy-On-Write (COW - Ghi khi sao chép)**, như chính cái tên `CopyOnWriteArrayList` đã thể hiện.

### Tư tưởng Copy-On-Write là gì?

"Copy-On-Write" trong tên `CopyOnWriteArrayList` chính là ghi khi sao chép, viết tắt là COW.

Dưới đây là phần giới thiệu về Copy-On-Write từ Wikipedia, được diễn đạt khá tốt:

> Copy-on-write (viết tắt là COW) là một chiến lược tối ưu hóa trong lĩnh vực lập trình máy tính. Tư tưởng cốt lõi của nó là: nếu có nhiều caller đồng thời yêu cầu cùng một tài nguyên (chẳng hạn như dữ liệu lưu trữ trong bộ nhớ hoặc trên đĩa), chúng sẽ cùng nhận được một con trỏ trỏ đến cùng một tài nguyên, cho đến khi một caller nào đó cố gắng sửa đổi nội dung của tài nguyên, hệ thống mới thực sự sao chép một bản sao riêng (private copy) cho caller đó, trong khi tài nguyên ban đầu mà các caller khác nhìn thấy vẫn không thay đổi. Quá trình này hoàn toàn trong suốt (transparent) đối với các caller khác. Ưu điểm chính của cách làm này là nếu caller không sửa đổi tài nguyên, sẽ không có bản sao riêng nào được tạo ra, do đó nhiều caller có thể chia sẻ cùng một tài nguyên khi chỉ thực hiện thao tác đọc.

Dưới đây lấy `CopyOnWriteArrayList` làm ví dụ để giải thích: khi cần sửa đổi nội dung của `CopyOnWriteArrayList` (các thao tác như `add`, `set`, `remove`), nó không trực tiếp sửa đổi mảng gốc, mà trước tiên tạo một bản sao của mảng nền (underlying array), sửa đổi trên mảng sao chép, sau khi sửa xong mới gán mảng đã sửa đổi trở lại, nhờ đó đảm bảo thao tác ghi không ảnh hưởng đến thao tác đọc.

Có thể thấy, cơ chế Copy-On-Write rất phù hợp với các kịch bản đồng thời đọc nhiều ghi ít, có thể cải thiện đáng kể hiệu năng đồng thời của hệ thống.

Tuy nhiên, cơ chế Copy-On-Write không phải là viên đạn bạc (silver bullet), nó vẫn tồn tại một số nhược điểm, được liệt kê dưới đây:

1. Chiếm dụng bộ nhớ: Mỗi thao tác ghi đều cần sao chép một bản dữ liệu gốc, sẽ chiếm thêm không gian bộ nhớ, trong trường hợp lượng dữ liệu lớn có thể dẫn đến thiếu tài nguyên bộ nhớ.
2. Chi phí thao tác ghi: Mỗi thao tác ghi đều cần sao chép một bản dữ liệu gốc, sau đó mới sửa đổi và thay thế, vì vậy chi phí thao tác ghi tương đối lớn, trong kịch bản ghi thường xuyên, hiệu năng có thể bị ảnh hưởng.
3. Snapshot consistency (tính nhất quán ảnh chụp): Iterator sẽ giữ lại snapshot của mảng nền tại thời điểm tạo, các sửa đổi sau đó sẽ không được phản ánh trong iterator này.
4. ……

## Phân tích mã nguồn CopyOnWriteArrayList

Ở đây lấy JDK 1.8 làm ví dụ để phân tích mã nguồn lõi của `CopyOnWriteArrayList`.

Định nghĩa lớp của `CopyOnWriteArrayList` như sau:

```java
public class CopyOnWriteArrayList<E>
extends Object
implements List<E>, RandomAccess, Cloneable, Serializable
{
  //...
}
```

`CopyOnWriteArrayList` hiện thực các interface sau:

- `List` : Cho biết nó là một danh sách (list), hỗ trợ các thao tác thêm, xóa, tìm kiếm, v.v. và có thể truy cập thông qua chỉ số (index).
- `RandomAccess`：Đây là một interface đánh dấu (marker interface), cho biết tập hợp `List` hiện thực interface này hỗ trợ **truy cập ngẫu nhiên nhanh (fast random access)**.
- `Cloneable`：Cho biết nó hỗ trợ sao chép thông qua phương thức `clone()`, `CopyOnWriteArrayList#clone()` trả về shallow copy (bản sao nông).
- `Serializable` : Cho biết nó có thể thực hiện thao tác tuần tự hóa (serialization), tức là có thể chuyển đổi đối tượng thành dòng byte để lưu trữ bền vững (persistent storage) hoặc truyền qua mạng, rất tiện lợi.

![CopyOnWriteArrayList 类图](https://oss.javaguide.cn/github/javaguide/java/collection/copyonwritearraylist-class-diagram.png)

### Khởi tạo

`CopyOnWriteArrayList` có một hàm tạo không tham số và hai hàm tạo có tham số.

```java
// 创建一个空的 CopyOnWriteArrayList
public CopyOnWriteArrayList() {
    setArray(new Object[0]);
}

// 按照集合的迭代器返回的顺序创建一个包含指定集合元素的 CopyOnWriteArrayList
public CopyOnWriteArrayList(Collection<? extends E> c) {
    Object[] elements;
    if (c.getClass() == CopyOnWriteArrayList.class)
        elements = ((CopyOnWriteArrayList<?>)c).getArray();
    else {
        elements = c.toArray();
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elements.getClass() != Object[].class)
            elements = Arrays.copyOf(elements, elements.length, Object[].class);
    }
    setArray(elements);
}

// 创建一个包含指定数组的副本的列表
public CopyOnWriteArrayList(E[] toCopyIn) {
    setArray(Arrays.copyOf(toCopyIn, toCopyIn.length, Object[].class));
}
```

### Chèn phần tử

Phương thức `add()` của `CopyOnWriteArrayList` có ba phiên bản:

- `add(E e)`：Chèn phần tử vào cuối `CopyOnWriteArrayList`.
- `add(int index, E element)`：Chèn phần tử vào vị trí chỉ định trong `CopyOnWriteArrayList`.
- `addIfAbsent(E e)`：Nếu phần tử chỉ định chưa tồn tại, thì thêm phần tử đó. Trả về true nếu thêm thành công.

Ở đây lấy `add(E e)` làm ví dụ để giới thiệu:

```java
// 插入元素到 CopyOnWriteArrayList 的尾部
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    // 加锁
    lock.lock();
    try {
        // 获取原来的数组
        Object[] elements = getArray();
        // 原来数组的长度
        int len = elements.length;
        // 创建一个长度+1的新数组，并将原来数组的元素复制给新数组
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        // 元素放在新数组末尾
        newElements[len] = e;
        // array指向新数组
        setArray(newElements);
        return true;
    } finally {
        // 解锁
        lock.unlock();
    }
}
```

Từ mã nguồn trên có thể thấy:

- Phương thức `add` sử dụng `ReentrantLock` để khóa ở bên trong, đảm bảo đồng bộ, tránh việc nhiều luồng đồng thời thực hiện thao tác ghi. Trường khóa (lock field) được sửa bởi `final`, tham chiếu sau khi khởi tạo không thể trỏ đến đối tượng khác, đồng thời logic giải phóng khóa được đặt trong `finally`, đảm bảo khóa có thể được giải phóng.
- `CopyOnWriteArrayList` thực hiện thao tác ghi bằng cách sao chép mảng nền, tức là trước tiên tạo một mảng mới để chứa phần tử mới được thêm vào, sau đó thực hiện thao tác ghi trên mảng mới, cuối cùng gán mảng mới cho tham chiếu của mảng nền, thay thế mảng cũ. Điều này chứng minh điều chúng ta đã nói trước đó: cốt lõi khiến `CopyOnWriteArrayList` thread-safe nằm ở việc nó áp dụng chiến lược **Copy-On-Write (COW)**.
- Mỗi thao tác ghi đều cần sao chép mảng nền thông qua `Arrays.copyOf`, độ phức tạp thời gian là O(n) và sẽ chiếm thêm không gian bộ nhớ. Do đó, `CopyOnWriteArrayList` phù hợp với kịch bản đọc nhiều ghi ít, trong trường hợp thao tác ghi không thường xuyên và tài nguyên bộ nhớ đầy đủ, có thể cải thiện hiệu năng hệ thống.
- `CopyOnWriteArrayList` không có phương thức `grow()` để mở rộng dung lượng như `ArrayList`.

> Độ phức tạp thời gian của phương thức `Arrays.copyOf` là O(n), trong đó n là độ dài của mảng cần sao chép. Vì nguyên lý hiện thực của phương thức này là trước tiên tạo một mảng mới, sau đó sao chép dữ liệu từ mảng nguồn vào mảng mới, cuối cùng trả về mảng mới. Phương thức này sẽ sao chép toàn bộ mảng, do đó độ phức tạp thời gian tỉ lệ thuận với độ dài mảng, tức là O(n). Điều đáng chú ý là, do bên dưới gọi đến lệnh sao chép cấp hệ thống, nên trong thực tế hiệu năng của phương thức này khá tốt, tuy nhiên cũng cần chú ý kiểm soát lượng dữ liệu sao chép, tránh tình trạng chiếm dụng bộ nhớ quá cao.

### Đọc phần tử

Thao tác đọc của `CopyOnWriteArrayList` dựa trên mảng nội bộ `array` chưa bị sửa đổi thực tế, do đó khi đọc không cần thực hiện đồng bộ hóa và thao tác khóa, vẫn có thể đảm bảo tính an toàn của dữ liệu. Với cơ chế này, nhiều luồng có thể đồng thời đọc các phần tử trong danh sách.

```java
// 底层数组，只能通过getArray和setArray方法访问
private transient volatile Object[] array;

public E get(int index) {
    return get(getArray(), index);
}

final Object[] getArray() {
    return array;
}

private E get(Object[] a, int index) {
    return (E) a[index];
}
```

Tuy nhiên, phương thức `get` có tính weak consistency (nhất quán yếu), trong một số trường hợp có thể đọc được giá trị phần tử cũ.

Phương thức `get(int index)` được thực hiện theo hai bước:

1. Lấy tham chiếu của mảng hiện tại thông qua `getArray()`;
2. Trực tiếp lấy phần tử tại chỉ số index từ mảng.

Quá trình này không được khóa, vì vậy trong môi trường đồng thời có thể xảy ra các tình huống sau:

1. Luồng 1 gọi phương thức `get(int index)` để lấy giá trị, bên trong lấy được giá trị thuộc tính array thông qua phương thức `getArray()`;
2. Luồng 2 gọi các phương thức sửa đổi như `add`, `set`, `remove` của `CopyOnWriteArrayList`, bên trong sửa đổi giá trị của thuộc tính `array` thông qua phương thức `setArray`;
3. Luồng 1 vẫn lấy giá trị từ mảng `array` cũ.

### Lấy số lượng phần tử trong danh sách

```java
public int size() {
    return getArray().length;
}
```

Mảng `array` trong `CopyOnWriteArrayList` mỗi lần sao chép đều vừa đủ để chứa tất cả phần tử, không giống như `ArrayList` sẽ dành trước một khoảng không gian nhất định. Do đó, `CopyOnWriteArrayList` không có thuộc tính `size`, độ dài của mảng nền trong `CopyOnWriteArrayList` chính là số lượng phần tử, vì vậy phương thức `size()` chỉ cần trả về độ dài mảng là được.

### Xóa phần tử

Các phương thức liên quan đến xóa phần tử trong `CopyOnWriteArrayList` có tổng cộng 4 phương thức:

1. `remove(int index)`：Xóa phần tử tại vị trí chỉ định trong danh sách này. Dịch chuyển bất kỳ phần tử nào theo sau sang trái (trừ đi 1 từ chỉ số của chúng).
2. `boolean remove(Object o)`：Xóa lần xuất hiện đầu tiên của phần tử chỉ định trong danh sách này, nếu phần tử không tồn tại thì trả về false.
3. `boolean removeAll(Collection<?> c)`：Xóa khỏi danh sách này tất cả các phần tử có trong tập hợp chỉ định.
4. `void clear()`：Xóa tất cả phần tử trong danh sách này.

Ở đây lấy `remove(int index)` làm ví dụ để giới thiệu:

```java
public E remove(int index) {
    // 获取可重入锁
    final ReentrantLock lock = this.lock;
    // 加锁
    lock.lock();
    try {
         //获取当前array数组
        Object[] elements = getArray();
        // 获取当前array长度
        int len = elements.length;
        //获取指定索引的元素(旧值)
        E oldValue = get(elements, index);
        int numMoved = len - index - 1;
        // 判断删除的是否是最后一个元素
        if (numMoved == 0)
             // 如果删除的是最后一个元素，直接复制该元素前的所有元素到新的数组
            setArray(Arrays.copyOf(elements, len - 1));
        else {
            // 分段复制，将index前的元素和index+1后的元素复制到新数组
            // 新数组长度为旧数组长度-1
            Object[] newElements = new Object[len - 1];
            System.arraycopy(elements, 0, newElements, 0, index);
            System.arraycopy(elements, index + 1, newElements, index,
                             numMoved);
            //将新数组赋值给array引用
            setArray(newElements);
        }
        return oldValue;
    } finally {
         // 解锁
        lock.unlock();
    }
}
```

### Kiểm tra phần tử có tồn tại hay không

`CopyOnWriteArrayList` cung cấp hai phương thức để kiểm tra xem phần tử chỉ định có trong danh sách hay không:

- `contains(Object o)`：Kiểm tra xem có chứa phần tử chỉ định hay không.
- `containsAll(Collection<?> c)`：Kiểm tra xem có chứa tất cả phần tử của tập hợp chỉ định hay không.

```java
// 判断是否包含指定元素
public boolean contains(Object o) {
    //获取当前array数组
    Object[] elements = getArray();
    //调用index尝试查找指定元素，如果返回值大于等于0，则返回true，否则返回false
    return indexOf(o, elements, 0, elements.length) >= 0;
}

// 判断是否保证指定集合的全部元素
public boolean containsAll(Collection<?> c) {
    //获取当前array数组
    Object[] elements = getArray();
    //获取数组长度
    int len = elements.length;
    //遍历指定集合
    for (Object e : c) {
        //循环调用indexOf方法判断，只要有一个没有包含就直接返回false
        if (indexOf(e, elements, 0, len) < 0)
            return false;
    }
    //最后表示全部包含或者制定集合为空集合，那么返回true
    return true;
}
```

## Kiểm thử các phương thức thường dùng của CopyOnWriteArrayList

Code:

```java
// 创建一个 CopyOnWriteArrayList 对象
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

// 向列表中添加元素
list.add("Java");
list.add("Python");
list.add("C++");
System.out.println("初始列表：" + list);

// 使用 get 方法获取指定位置的元素
System.out.println("列表第二个元素为：" + list.get(1));

// 使用 remove 方法删除指定元素
boolean result = list.remove("C++");
System.out.println("删除结果：" + result);
System.out.println("列表删除元素后为：" + list);

// 使用 set 方法更新指定位置的元素
list.set(1, "Golang");
System.out.println("列表更新后为：" + list);

// 使用 add 方法在指定位置插入元素
list.add(0, "PHP");
System.out.println("列表插入元素后为：" + list);

// 使用 size 方法获取列表大小
System.out.println("列表大小为：" + list.size());

// 使用 removeAll 方法删除指定集合中所有出现的元素
result = list.removeAll(List.of("Java", "Golang"));
System.out.println("批量删除结果：" + result);
System.out.println("列表批量删除元素后为：" + list);

// 使用 clear 方法清空列表中所有元素
list.clear();
System.out.println("列表清空后为：" + list);
```

Kết quả:

```plain
列表更新后为：[Java, Golang]
列表插入元素后为：[PHP, Java, Golang]
列表大小为：3
批量删除结果：true
列表批量删除元素后为：[PHP]
列表清空后为：[]
```

<!-- @include: @article-footer.snippet.md -->
