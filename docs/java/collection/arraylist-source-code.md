---
title: Phân tích mã nguồn ArrayList
description: "Phân tích chuyên sâu mã nguồn ArrayList: giải thích chi tiết cấu trúc mảng nền (array), cơ chế mở rộng dung lượng 1.5 lần, truy cập ngẫu nhiên nhanh (RandomAccess), triển khai tuần tự hóa (serialization) và so sánh hiệu năng với Vector."
category: Java
tag:
  - Java集合
head:
  - - meta
    - name: keywords
      content: ArrayList源码,ArrayList扩容机制,动态数组,RandomAccess,ArrayList序列化,ArrayList与Vector区别
---

## Giới thiệu về ArrayList

Lớp nền của `ArrayList` là một **mảng (array)**, hoạt động như một mảng động (dynamic array). So với mảng thông thường trong Java, dung lượng của nó có thể tăng trưởng linh hoạt. Trước khi thêm một lượng lớn phần tử, ứng dụng có thể sử dụng thao tác `ensureCapacity` để tăng dung lượng của thể hiện `ArrayList`. Điều này giúp giảm số lần tái cấp phát tăng dần (incremental reallocation).

`ArrayList` kế thừa từ `AbstractList`, và triển khai các interface `List`, `RandomAccess`, `Cloneable`, `java.io.Serializable`.

```java

public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{

  }
```

- `List`: chỉ ra rằng đây là một danh sách (list), hỗ trợ các thao tác thêm, xóa, tìm kiếm và có thể truy cập thông qua chỉ số (index).
- `RandomAccess`: đây là một **marker interface**, chỉ ra rằng tập hợp `List` triển khai interface này hỗ trợ **truy cập ngẫu nhiên nhanh (fast random access)**. Trong `ArrayList`, chúng ta có thể nhanh chóng lấy đối tượng phần tử thông qua số thứ tự của phần tử, đây chính là truy cập ngẫu nhiên nhanh.
- `Cloneable`: chỉ ra rằng nó hỗ trợ sao chép thông qua phương thức `clone()`, `ArrayList#clone()` trả về bản sao nông (shallow copy).
- `Serializable`: chỉ ra rằng nó có thể thực hiện thao tác tuần tự hóa (serialization), tức là có thể chuyển đổi đối tượng thành luồng byte để lưu trữ bền vững (persistent storage) hoặc truyền qua mạng, rất thuận tiện.

![ArrayList 类图](https://oss.javaguide.cn/github/javaguide/java/collection/arraylist-class-diagram.png)

### Sự khác biệt giữa ArrayList và Vector? (chỉ cần hiểu là được)

- `ArrayList` là lớp triển khai chính của `List`, lớp nền sử dụng `Object[]` để lưu trữ, phù hợp cho các công việc tìm kiếm thường xuyên, không an toàn luồng (thread-safe).
- `Vector` là lớp triển khai cũ của `List`, lớp nền sử dụng `Object[]` để lưu trữ, an toàn luồng.

### ArrayList có thể thêm giá trị null không?

`ArrayList` có thể lưu trữ bất kỳ loại đối tượng nào, bao gồm cả giá trị `null`. Tuy nhiên, không khuyến khích thêm giá trị `null` vào `ArrayList`, giá trị `null` không có ý nghĩa, khiến code khó bảo trì, ví dụ như quên kiểm tra null sẽ dẫn đến ngoại lệ con trỏ null (NullPointerException).

Code ví dụ:

```java
ArrayList<String> listOfStrings = new ArrayList<>();
listOfStrings.add(null);
listOfStrings.add("java");
System.out.println(listOfStrings);
```

Kết quả:

```plain
[null, java]
```

### Sự khác biệt giữa ArrayList và LinkedList?

- **Có đảm bảo an toàn luồng không:** `ArrayList` và `LinkedList` đều không đồng bộ (unsynchronized), tức là không đảm bảo an toàn luồng;
- **Cấu trúc dữ liệu nền:** `ArrayList` sử dụng **mảng `Object`** ở lớp nền; `LinkedList` sử dụng cấu trúc dữ liệu **danh sách liên kết đôi (doubly linked list)** ở lớp nền (trước JDK1.6 là danh sách liên kết vòng (circular linked list), JDK1.7 đã bỏ vòng. Lưu ý sự khác biệt giữa danh sách liên kết đôi và danh sách liên kết đôi vòng, sẽ được giới thiệu bên dưới!)
- **Việc chèn và xóa có bị ảnh hưởng bởi vị trí phần tử không:**
  - `ArrayList` sử dụng mảng để lưu trữ, nên độ phức tạp thời gian (time complexity) của việc chèn và xóa phần tử bị ảnh hưởng bởi vị trí phần tử. Ví dụ: khi thực thi phương thức `add(E e)`, `ArrayList` sẽ mặc định thêm phần tử được chỉ định vào cuối danh sách này, trong trường hợp này độ phức tạp thời gian là O(1). Nhưng nếu muốn chèn và xóa phần tử tại vị trí i được chỉ định (`add(int index, E element)`), độ phức tạp thời gian là O(n). Bởi vì khi thực hiện thao tác trên, phần tử thứ i và (n-i) phần tử sau phần tử thứ i trong tập hợp đều phải thực hiện thao tác dịch chuyển về phía sau / về phía trước một vị trí.
  - `LinkedList` sử dụng danh sách liên kết để lưu trữ, nên việc chèn hoặc xóa ở đầu hoặc cuối không bị ảnh hưởng bởi vị trí phần tử (`add(E e)`, `addFirst(E e)`, `addLast(E e)`, `removeFirst()`, `removeLast()`), độ phức tạp thời gian là O(1), nếu muốn chèn và xóa phần tử tại vị trí `i` được chỉ định (`add(int index, E element)`, `remove(Object o)`, `remove(int index)`), độ phức tạp thời gian là O(n), bởi vì cần phải di chuyển đến vị trí được chỉ định trước rồi mới chèn và xóa.
- **Có hỗ trợ truy cập ngẫu nhiên nhanh không:** `LinkedList` không hỗ trợ truy cập ngẫu nhiên phần tử hiệu quả, trong khi `ArrayList` (triển khai interface `RandomAccess`) thì có hỗ trợ. Truy cập ngẫu nhiên nhanh là việc nhanh chóng lấy đối tượng phần tử thông qua số thứ tự của phần tử (tương ứng với phương thức `get(int index)`).
- **Chiếm dụng không gian bộ nhớ:** Sự lãng phí không gian của `ArrayList` chủ yếu thể hiện ở việc sẽ dự trữ một lượng dung lượng nhất định ở cuối danh sách, trong khi chi phí không gian của `LinkedList` thể hiện ở việc mỗi phần tử của nó đều cần tiêu tốn nhiều không gian hơn `ArrayList` (vì phải lưu trữ con trỏ kế tiếp (next) và con trỏ trước đó (previous) cùng với dữ liệu).

## Phân tích mã nguồn lõi của ArrayList

Ở đây lấy JDK1.8 làm ví dụ, phân tích mã nguồn lớp nền của `ArrayList`.

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
    private static final long serialVersionUID = 8683452581122892189L;

    /**
     * 默认初始容量大小
     */
    private static final int DEFAULT_CAPACITY = 10;

    /**
     * 空数组（用于空实例）。
     */
    private static final Object[] EMPTY_ELEMENTDATA = {};

    //用于默认大小空实例的共享空数组实例。
    //我们把它从EMPTY_ELEMENTDATA数组中区分出来，以知道在添加第一个元素时容量需要增加多少。
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
     * 保存ArrayList数据的数组
     */
    transient Object[] elementData; // non-private to simplify nested class access

    /**
     * ArrayList 所包含的元素个数
     */
    private int size;

    /**
     * 带初始容量参数的构造函数（用户可以在创建ArrayList对象时自己指定集合的初始大小）
     */
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            //如果传入的参数大于0，创建initialCapacity大小的数组
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            //如果传入的参数等于0，创建空数组
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            //其他情况，抛出异常
            throw new IllegalArgumentException("Illegal Capacity: " +
                    initialCapacity);
        }
    }

    /**
     * 默认无参构造函数
     * DEFAULTCAPACITY_EMPTY_ELEMENTDATA 为0.初始化为10，也就是说初始其实是空数组 当添加第一个元素的时候数组容量才变成10
     */
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }

    /**
     * 构造一个包含指定集合的元素的列表，按照它们由集合的迭代器返回的顺序。
     */
    public ArrayList(Collection<? extends E> c) {
        //将指定集合转换为数组
        elementData = c.toArray();
        //如果elementData数组的长度不为0
        if ((size = elementData.length) != 0) {
            // 如果elementData不是Object类型数据（c.toArray可能返回的不是Object类型的数组所以加上下面的语句用于判断）
            if (elementData.getClass() != Object[].class)
                //将原来不是Object类型的elementData数组的内容，赋值给新的Object类型的elementData数组
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // 其他情况，用空数组代替
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }

    /**
     * 修改这个ArrayList实例的容量是列表的当前大小。 应用程序可以使用此操作来最小化ArrayList实例的存储。
     */
    public void trimToSize() {
        modCount++;
        if (size < elementData.length) {
            elementData = (size == 0)
                    ? EMPTY_ELEMENTDATA
                    : Arrays.copyOf(elementData, size);
        }
    }
//下面是ArrayList的扩容机制
//ArrayList的扩容机制提高了性能，如果每次只扩充一个，
//那么频繁的插入会导致频繁的拷贝，降低性能，而ArrayList的扩容机制避免了这种情况。

    /**
     * 如有必要，增加此ArrayList实例的容量，以确保它至少能容纳元素的数量
     *
     * @param minCapacity 所需的最小容量
     */
    public void ensureCapacity(int minCapacity) {
        // 如果不是默认空数组，则minExpand的值为0；
        // 如果是默认空数组，则minExpand的值为10
        int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
                // 如果不是默认元素表，则可以使用任意大小
                ? 0
                // 如果是默认空数组，它应该已经是默认大小
                : DEFAULT_CAPACITY;

        // 如果最小容量大于已有的最大容量
        if (minCapacity > minExpand) {
            // 根据需要的最小容量，确保容量足够
            ensureExplicitCapacity(minCapacity);
        }
    }


    // 根据给定的最小容量和当前数组元素来计算所需容量。
    private static int calculateCapacity(Object[] elementData, int minCapacity) {
        // 如果当前数组元素为空数组（初始情况），返回默认容量和最小容量中的较大值作为所需容量
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            return Math.max(DEFAULT_CAPACITY, minCapacity);
        }
        // 否则直接返回最小容量
        return minCapacity;
    }

    // 确保内部容量达到指定的最小容量。
    private void ensureCapacityInternal(int minCapacity) {
        ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
    }

    //判断是否需要扩容
    private void ensureExplicitCapacity(int minCapacity) {
        modCount++;
        // overflow-conscious code
        if (minCapacity - elementData.length > 0)
            //调用grow方法进行扩容，调用此方法代表已经开始扩容了
            grow(minCapacity);
    }

    /**
     * 要分配的最大数组大小
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * ArrayList扩容的核心方法。
     */
    private void grow(int minCapacity) {
        // oldCapacity为旧容量，newCapacity为新容量
        int oldCapacity = elementData.length;
        //将oldCapacity 右移一位，其效果相当于oldCapacity /2，
        //我们知道位运算的速度远远快于整除运算，整句运算式的结果就是将新容量更新为旧容量的1.5倍，
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        //然后检查新容量是否大于最小需要容量，若还是小于最小需要容量，那么就把最小需要容量当作数组的新容量，
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        //再检查新容量是否超出了ArrayList所定义的最大容量，
        //若超出了，则调用hugeCapacity()来比较minCapacity和 MAX_ARRAY_SIZE，
        //如果minCapacity大于MAX_ARRAY_SIZE，则新容量则为Integer.MAX_VALUE，否则，新容量大小则为 MAX_ARRAY_SIZE。
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    //比较minCapacity和 MAX_ARRAY_SIZE
    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }

    /**
     * 返回此列表中的元素数。
     */
    public int size() {
        return size;
    }

    /**
     * 如果此列表不包含元素，则返回 true 。
     */
    public boolean isEmpty() {
        //注意=和==的区别
        return size == 0;
    }

    /**
     * 如果此列表包含指定的元素，则返回true 。
     */
    public boolean contains(Object o) {
        //indexOf()方法：返回此列表中指定元素的首次出现的索引，如果此列表不包含此元素，则为-1
        return indexOf(o) >= 0;
    }

    /**
     * 返回此列表中指定元素的首次出现的索引，如果此列表不包含此元素，则为-1
     */
    public int indexOf(Object o) {
        if (o == null) {
            for (int i = 0; i < size; i++)
                if (elementData[i] == null)
                    return i;
        } else {
            for (int i = 0; i < size; i++)
                //equals()方法比较
                if (o.equals(elementData[i]))
                    return i;
        }
        return -1;
    }

    /**
     * 返回此列表中指定元素的最后一次出现的索引，如果此列表不包含元素，则返回-1。.
     */
    public int lastIndexOf(Object o) {
        if (o == null) {
            for (int i = size - 1; i >= 0; i--)
                if (elementData[i] == null)
                    return i;
        } else {
            for (int i = size - 1; i >= 0; i--)
                if (o.equals(elementData[i]))
                    return i;
        }
        return -1;
    }

    /**
     * 返回此ArrayList实例的浅拷贝。 （元素本身不被复制。）
     */
    public Object clone() {
        try {
            ArrayList<?> v = (ArrayList<?>) super.clone();
            //Arrays.copyOf功能是实现数组的复制，返回复制后的数组。参数是被复制的数组和复制的长度
            v.elementData = Arrays.copyOf(elementData, size);
            v.modCount = 0;
            return v;
        } catch (CloneNotSupportedException e) {
            // 这不应该发生，因为我们是可以克隆的
            throw new InternalError(e);
        }
    }

    /**
     * 以正确的顺序（从第一个到最后一个元素）返回一个包含此列表中所有元素的数组。
     * 返回的数组将是"安全的"，因为该列表不保留对它的引用。
     * （换句话说，这个方法必须分配一个新的数组）。
     * 因此，调用者可以自由地修改返回的数组结构。
     * 注意：如果元素是引用类型，修改元素的内容会影响到原列表中的对象。
     * 此方法充当基于数组和基于集合的API之间的桥梁。
     */
    public Object[] toArray() {
        return Arrays.copyOf(elementData, size);
    }

    /**
     * 以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素）;
     * 返回的数组的运行时类型是指定数组的运行时类型。 如果列表适合指定的数组，则返回其中。
     * 否则，将为指定数组的运行时类型和此列表的大小分配一个新数组。
     * 如果列表适用于指定的数组，其余空间（即数组的列表数量多于此元素），则紧跟在集合结束后的数组中的元素设置为null 。
     * （这仅在调用者知道列表不包含任何空元素的情况下才能确定列表的长度。）
     */
    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // 新建一个运行时类型的数组，但是ArrayList数组的内容
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
        //调用System提供的arraycopy()方法实现数组之间的复制
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

    // Positional Access Operations

    @SuppressWarnings("unchecked")
    E elementData(int index) {
        return (E) elementData[index];
    }

    /**
     * 返回此列表中指定位置的元素。
     */
    public E get(int index) {
        rangeCheck(index);

        return elementData(index);
    }

    /**
     * 用指定的元素替换此列表中指定位置的元素。
     */
    public E set(int index, E element) {
        //对index进行界限检查
        rangeCheck(index);

        E oldValue = elementData(index);
        elementData[index] = element;
        //返回原来在这个位置的元素
        return oldValue;
    }

    /**
     * 将指定的元素追加到此列表的末尾。
     */
    public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        //这里看到ArrayList添加元素的实质就相当于为数组赋值
        elementData[size++] = e;
        return true;
    }

    /**
     * 在此列表中的指定位置插入指定的元素。
     * 先调用 rangeCheckForAdd 对index进行界限检查；然后调用 ensureCapacityInternal 方法保证capacity足够大；
     * 再将从index开始之后的所有成员后移一个位置；将element插入index位置；最后size加1。
     */
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        //arraycopy()这个实现数组之间复制的方法一定要看一下，下面就用到了arraycopy()方法实现数组自己复制自己
        System.arraycopy(elementData, index, elementData, index + 1,
                size - index);
        elementData[index] = element;
        size++;
    }

    /**
     * 删除该列表中指定位置的元素。 将任何后续元素移动到左侧（从其索引中减去一个元素）。
     */
    public E remove(int index) {
        rangeCheck(index);

        modCount++;
        E oldValue = elementData(index);

        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index + 1, elementData, index,
                    numMoved);
        elementData[--size] = null; // clear to let GC do its work
        //从列表中删除的元素
        return oldValue;
    }

    /**
     * 从列表中删除指定元素的第一个出现（如果存在）。 如果列表不包含该元素，则它不会更改。
     * 返回true，如果此列表包含指定的元素
     */
    public boolean remove(Object o) {
        if (o == null) {
            for (int index = 0; index < size; index++)
                if (elementData[index] == null) {
                    fastRemove(index);
                    return true;
                }
        } else {
            for (int index = 0; index < size; index++)
                if (o.equals(elementData[index])) {
                    fastRemove(index);
                    return true;
                }
        }
        return false;
    }

    /*
     * 该方法为私有的移除方法，跳过了边界检查，并且不返回被移除的值。
     */
    private void fastRemove(int index) {
        modCount++;
        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index + 1, elementData, index,
                    numMoved);
        elementData[--size] = null; // 在移除元素后，将该位置的元素设为 null，以便垃圾回收器（GC）能够回收该元素。
    }

    /**
     * 从列表中删除所有元素。
     */
    public void clear() {
        modCount++;

        // 把数组中所有的元素的值设为null
        for (int i = 0; i < size; i++)
            elementData[i] = null;

        size = 0;
    }

    /**
     * 按指定集合的Iterator返回的顺序将指定集合中的所有元素追加到此列表的末尾。
     */
    public boolean addAll(Collection<? extends E> c) {
        Object[] a = c.toArray();
        int numNew = a.length;
        ensureCapacityInternal(size + numNew);  // Increments modCount
        System.arraycopy(a, 0, elementData, size, numNew);
        size += numNew;
        return numNew != 0;
    }

    /**
     * 将指定集合中的所有元素插入到此列表中，从指定的位置开始。
     */
    public boolean addAll(int index, Collection<? extends E> c) {
        rangeCheckForAdd(index);

        Object[] a = c.toArray();
        int numNew = a.length;
        ensureCapacityInternal(size + numNew);  // Increments modCount

        int numMoved = size - index;
        if (numMoved > 0)
            System.arraycopy(elementData, index, elementData, index + numNew,
                    numMoved);

        System.arraycopy(a, 0, elementData, index, numNew);
        size += numNew;
        return numNew != 0;
    }

    /**
     * 从此列表中删除所有索引为fromIndex （含）和toIndex之间的元素。
     * 将任何后续元素移动到左侧（减少其索引）。
     */
    protected void removeRange(int fromIndex, int toIndex) {
        modCount++;
        int numMoved = size - toIndex;
        System.arraycopy(elementData, toIndex, elementData, fromIndex,
                numMoved);

        // clear to let GC do its work
        int newSize = size - (toIndex - fromIndex);
        for (int i = newSize; i < size; i++) {
            elementData[i] = null;
        }
        size = newSize;
    }

    /**
     * 检查给定的索引是否在范围内。
     */
    private void rangeCheck(int index) {
        if (index >= size)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    /**
     * add和addAll使用的rangeCheck的一个版本
     */
    private void rangeCheckForAdd(int index) {
        if (index > size || index < 0)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    /**
     * 返回IndexOutOfBoundsException细节信息
     */
    private String outOfBoundsMsg(int index) {
        return "Index: " + index + ", Size: " + size;
    }

    /**
     * 从此列表中删除指定集合中包含的所有元素。
     */
    public boolean removeAll(Collection<?> c) {
        Objects.requireNonNull(c);
        //如果此列表被修改则返回true
        return batchRemove(c, false);
    }

    /**
     * 仅保留此列表中包含在指定集合中的元素。
     * 换句话说，从此列表中删除其中不包含在指定集合中的所有元素。
     */
    public boolean retainAll(Collection<?> c) {
        Objects.requireNonNull(c);
        return batchRemove(c, true);
    }


    /**
     * 从列表中的指定位置开始，返回列表中的元素（按正确顺序）的列表迭代器。
     * 指定的索引表示初始调用将返回的第一个元素为next 。 初始调用previous将返回指定索引减1的元素。
     * 返回的列表迭代器是fail-fast 。
     */
    public ListIterator<E> listIterator(int index) {
        if (index < 0 || index > size)
            throw new IndexOutOfBoundsException("Index: " + index);
        return new ListItr(index);
    }

    /**
     * 返回列表中的列表迭代器（按适当的顺序）。
     * 返回的列表迭代器是fail-fast 。
     */
    public ListIterator<E> listIterator() {
        return new ListItr(0);
    }

    /**
     * 以正确的顺序返回该列表中的元素的迭代器。
     * 返回的迭代器是fail-fast 。
     */
    public Iterator<E> iterator() {
        return new Itr();
    }
```

## Phân tích cơ chế mở rộng dung lượng (扩容机制) của ArrayList

### Bắt đầu từ hàm khởi tạo (constructor) của ArrayList

ArrayList có ba cách để khởi tạo, mã nguồn hàm khởi tạo như sau (JDK8):

```java
/**
 * 默认初始容量大小
 */
private static final int DEFAULT_CAPACITY = 10;

private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
 * 默认构造函数，使用初始容量10构造一个空列表(无参数构造)
 */
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
 * 带初始容量参数的构造函数。（用户自己指定容量）
 */
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {//初始容量大于0
        //创建initialCapacity大小的数组
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {//初始容量等于0
        //创建空数组
        this.elementData = EMPTY_ELEMENTDATA;
    } else {//初始容量小于0，抛出异常
        throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
    }
}


/**
 *构造包含指定collection元素的列表，这些元素利用该集合的迭代器按顺序返回
 *如果指定的集合为null，throws NullPointerException。
 */
public ArrayList(Collection<? extends E> c) {
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {
        // replace with empty array.
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```

Những bạn tinh ý chắc chắn sẽ phát hiện ra: **Khi tạo `ArrayList` bằng hàm khởi tạo không tham số, thực tế giá trị khởi tạo được gán là một mảng rỗng. Khi thực sự thực hiện thao tác thêm phần tử vào mảng, dung lượng mới thực sự được cấp phát. Tức là khi thêm phần tử đầu tiên vào mảng, dung lượng mảng được mở rộng thành 10.** Dưới đây khi chúng ta phân tích cơ chế mở rộng dung lượng của `ArrayList` sẽ đề cập đến điểm này!

> Bổ sung: JDK6 khi new `ArrayList` bằng hàm khởi tạo không tham số, trực tiếp tạo mảng `Object[]` `elementData` có độ dài là 10.

### Phân tích từng bước cơ chế mở rộng dung lượng của ArrayList

Ở đây lấy `ArrayList` được tạo bởi hàm khởi tạo không tham số làm ví dụ để phân tích.

#### Phương thức add

```java
/**
* 将指定的元素追加到此列表的末尾。
*/
public boolean add(E e) {
    // 加元素之前，先调用ensureCapacityInternal方法
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 这里看到ArrayList添加元素的实质就相当于为数组赋值
    elementData[size++] = e;
    return true;
}
```

**Lưu ý**: JDK11 đã loại bỏ các phương thức `ensureCapacityInternal()` và `ensureExplicitCapacity()`

Mã nguồn của phương thức `ensureCapacityInternal` như sau:

```java
// 根据给定的最小容量和当前数组元素来计算所需容量。
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    // 如果当前数组元素为空数组（初始情况），返回默认容量和最小容量中的较大值作为所需容量
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    // 否则直接返回最小容量
    return minCapacity;
}

// 确保内部容量达到指定的最小容量。
private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}
```

Phương thức `ensureCapacityInternal` rất đơn giản, bên trong trực tiếp gọi phương thức `ensureExplicitCapacity`:

```java
//判断是否需要扩容
private void ensureExplicitCapacity(int minCapacity) {
    modCount++;
    //判断当前数组容量是否足以存储minCapacity个元素
    if (minCapacity - elementData.length > 0)
        //调用grow方法进行扩容
        grow(minCapacity);
}
```

Chúng ta hãy cùng phân tích kỹ:

- Khi chúng ta muốn `add` phần tử thứ 1 vào `ArrayList`, `elementData.length` là 0 (vì vẫn là một list rỗng), bởi vì đã thực thi phương thức `ensureCapacityInternal()`, nên `minCapacity` lúc này là 10. Lúc này, `minCapacity - elementData.length > 0` thỏa mãn, nên sẽ đi vào phương thức `grow(minCapacity)`.
- Khi `add` phần tử thứ 2, `minCapacity` là 2, lúc này `elementData.length` (dung lượng) sau khi thêm phần tử đầu tiên đã mở rộng thành `10` rồi. Lúc này, `minCapacity - elementData.length > 0` không thỏa mãn, nên sẽ không đi vào (thực thi) phương thức `grow(minCapacity)`.
- Khi thêm phần tử thứ 3, 4... đến phần tử thứ 10, vẫn sẽ không thực thi phương thức grow, dung lượng mảng đều là 10.

Cho đến khi thêm phần tử thứ 11, `minCapacity` (là 11) lớn hơn `elementData.length` (là 10). Đi vào phương thức `grow` để mở rộng dung lượng.

#### Phương thức grow

```java
/**
 * 要分配的最大数组大小
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
 * ArrayList扩容的核心方法。
 */
private void grow(int minCapacity) {
    // oldCapacity为旧容量，newCapacity为新容量
    int oldCapacity = elementData.length;
    // 将oldCapacity 右移一位，其效果相当于oldCapacity /2，
    // 我们知道位运算的速度远远快于整除运算，整句运算式的结果就是将新容量更新为旧容量的1.5倍，
    int newCapacity = oldCapacity + (oldCapacity >> 1);

    // 然后检查新容量是否大于最小需要容量，若还是小于最小需要容量，那么就把最小需要容量当作数组的新容量，
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;

    // 如果新容量大于 MAX_ARRAY_SIZE,进入(执行) `hugeCapacity()` 方法来比较 minCapacity 和 MAX_ARRAY_SIZE，
    // 如果minCapacity大于最大容量，则新容量则为`Integer.MAX_VALUE`，否则，新容量大小则为 MAX_ARRAY_SIZE 即为 `Integer.MAX_VALUE - 8`。
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);

    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

**`int newCapacity = oldCapacity + (oldCapacity >> 1)`, vì vậy sau mỗi lần mở rộng dung lượng, dung lượng của ArrayList sẽ trở thành khoảng 1.5 lần so với ban đầu (oldCapacity là số chẵn thì là 1.5 lần chính xác, ngược lại là khoảng 1.5 lần)!** Khác nhau giữa chẵn lẻ, ví dụ: 10+10/2 = 15, 33+33/2=49. Nếu là số lẻ thì sẽ mất phần thập phân.

> ">>" (toán tử dịch bit): >>1 dịch phải một bit tương đương với chia 2, dịch phải n bit tương đương với chia cho 2 mũ n. Ở đây oldCapacity rõ ràng đã dịch phải 1 bit nên tương đương với oldCapacity /2. Đối với các phép tính nhị phân trên dữ liệu lớn, toán tử dịch bit nhanh hơn rất nhiều so với các toán tử thông thường, bởi vì chương trình chỉ đơn thuần dịch chuyển, không cần tính toán, điều này nâng cao hiệu quả và tiết kiệm tài nguyên.

**Chúng ta hãy cùng khám phá phương thức `grow()` thông qua ví dụ:**

- Khi `add` phần tử thứ 1, `oldCapacity` là 0, sau khi so sánh, điều kiện if đầu tiên thỏa mãn, `newCapacity = minCapacity` (là 10). Nhưng điều kiện if thứ hai không thỏa mãn, tức là `newCapacity` không lớn hơn `MAX_ARRAY_SIZE`, nên sẽ không đi vào phương thức `hugeCapacity`. Dung lượng mảng là 10, trong phương thức `add` return true, size tăng lên 1.
- Khi `add` phần tử thứ 11 đi vào phương thức `grow`, `newCapacity` là 15, lớn hơn `minCapacity` (là 11), điều kiện if đầu tiên không thỏa mãn. Dung lượng mới không lớn hơn kích thước mảng tối đa, sẽ không đi vào phương thức `hugeCapacity`. Dung lượng mảng mở rộng thành 15, trong phương thức add return true, size tăng lên 11.
- Và cứ tiếp tục như vậy······

**Ở đây bổ sung một điểm kiến thức khá quan trọng, nhưng dễ bị bỏ qua:**

- Thuộc tính `length` trong Java là dành cho mảng (array), ví dụ bạn khai báo một mảng, muốn biết độ dài của mảng này thì dùng thuộc tính length.
- Phương thức `length()` trong Java là dành cho chuỗi (String), nếu muốn xem độ dài của chuỗi này thì dùng phương thức `length()`.
- Phương thức `size()` trong Java là dành cho tập hợp generic (generic collection), nếu muốn xem tập hợp generic này có bao nhiêu phần tử, thì gọi phương thức này để kiểm tra!

#### Phương thức hugeCapacity()

Từ mã nguồn phương thức `grow()` ở trên chúng ta biết: nếu dung lượng mới lớn hơn `MAX_ARRAY_SIZE`, sẽ đi vào (thực thi) phương thức `hugeCapacity()` để so sánh `minCapacity` và `MAX_ARRAY_SIZE`, nếu `minCapacity` lớn hơn dung lượng tối đa, thì dung lượng mới sẽ là `Integer.MAX_VALUE`, ngược lại, dung lượng mới sẽ là `MAX_ARRAY_SIZE` tức là `Integer.MAX_VALUE - 8`.

```java
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    // 对minCapacity和MAX_ARRAY_SIZE进行比较
    // 若minCapacity大，将Integer.MAX_VALUE作为新数组的大小
    // 若MAX_ARRAY_SIZE大，将MAX_ARRAY_SIZE作为新数组的大小
    // MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

### Phương thức `System.arraycopy()` và `Arrays.copyOf()`

Khi đọc mã nguồn, chúng ta sẽ phát hiện `ArrayList` gọi rất nhiều hai phương thức này. Ví dụ: thao tác mở rộng dung lượng chúng ta đã nói ở trên cũng như các phương thức `add(int index, E element)`, `toArray()` đều sử dụng phương thức này!

#### Phương thức `System.arraycopy()`

Mã nguồn:

```java
    // 我们发现 arraycopy 是一个 native 方法,接下来我们解释一下各个参数的具体意义
    /**
    *   复制数组
    * @param src 源数组
    * @param srcPos 源数组中的起始位置
    * @param dest 目标数组
    * @param destPos 目标数组中的起始位置
    * @param length 要复制的数组元素的数量
    */
    public static native void arraycopy(Object src,  int  srcPos,
                                        Object dest, int destPos,
                                        int length);
```

Ngữ cảnh sử dụng:

```java
    /**
     * 在此列表中的指定位置插入指定的元素。
     *先调用 rangeCheckForAdd 对index进行界限检查；然后调用 ensureCapacityInternal 方法保证capacity足够大；
     *再将从index开始之后的所有成员后移一个位置；将element插入index位置；最后size加1。
     */
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        //arraycopy()方法实现数组自己复制自己
        //elementData:源数组;index:源数组中的起始位置;elementData：目标数组；index + 1：目标数组中的起始位置； size - index：要复制的数组元素的数量；
        System.arraycopy(elementData, index, elementData, index + 1, size - index);
        elementData[index] = element;
        size++;
    }
```

Chúng ta viết một phương thức đơn giản để kiểm thử:

```java
public class ArraycopyTest {

  public static void main(String[] args) {
    // TODO Auto-generated method stub
    int[] a = new int[10];
    a[0] = 0;
    a[1] = 1;
    a[2] = 2;
    a[3] = 3;
    System.arraycopy(a, 2, a, 3, 3);
    a[2]=99;
    for (int i = 0; i < a.length; i++) {
      System.out.print(a[i] + " ");
    }
  }

}
```

Kết quả:

```plain
0 1 99 2 3 0 0 0 0 0
```

#### Phương thức `Arrays.copyOf()`

Mã nguồn:

```java
    public static int[] copyOf(int[] original, int newLength) {
      // 申请一个新的数组
        int[] copy = new int[newLength];
  // 调用System.arraycopy,将源数组中的数据进行拷贝,并返回新的数组
        System.arraycopy(original, 0, copy, 0,
                         Math.min(original.length, newLength));
        return copy;
    }
```

Ngữ cảnh sử dụng:

```java
   /**
     以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素）; 返回的数组的运行时类型是指定数组的运行时类型。
     */
    public Object[] toArray() {
    //elementData：要复制的数组；size：要复制的长度
        return Arrays.copyOf(elementData, size);
    }
```

Cá nhân tôi cho rằng sử dụng phương thức `Arrays.copyOf()` chủ yếu là để mở rộng dung lượng cho mảng gốc, code kiểm thử như sau:

```java
public class ArrayscopyOfTest {

  public static void main(String[] args) {
    int[] a = new int[3];
    a[0] = 0;
    a[1] = 1;
    a[2] = 2;
    int[] b = Arrays.copyOf(a, 10);
    System.out.println("b.length"+b.length);
  }
}
```

Kết quả:

```plain
10
```

#### Mối liên hệ và sự khác biệt giữa hai phương thức

**Mối liên hệ:**

Nhìn vào mã nguồn của cả hai có thể phát hiện `copyOf()` thực tế bên trong gọi phương thức `System.arraycopy()`

**Sự khác biệt:**

`arraycopy()` cần mảng đích, sao chép mảng gốc vào mảng do bạn tự định nghĩa hoặc chính mảng gốc, và có thể chọn điểm bắt đầu, độ dài sao chép cũng như vị trí đặt vào mảng mới. `copyOf()` là hệ thống tự động tạo một mảng mới bên trong và trả về mảng đó.

### Phương thức `ensureCapacity`

Trong mã nguồn `ArrayList` có một phương thức `ensureCapacity` không biết mọi người có để ý không, phương thức này không được gọi bên trong `ArrayList`, vì vậy rõ ràng là được cung cấp cho người dùng gọi, vậy phương thức này có tác dụng gì?

```java
    /**
    如有必要，增加此 ArrayList 实例的容量，以确保它至少可以容纳由minimum capacity参数指定的元素数。
     *
     * @param   minCapacity   所需的最小容量
     */
    public void ensureCapacity(int minCapacity) {
        int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
            // any size if not default element table
            ? 0
            // larger than default for default empty table. It's already
            // supposed to be at default size.
            : DEFAULT_CAPACITY;

        if (minCapacity > minExpand) {
            ensureExplicitCapacity(minCapacity);
        }
    }

```

Về mặt lý thuyết, tốt nhất nên sử dụng phương thức `ensureCapacity` trước khi thêm một lượng lớn phần tử vào `ArrayList`, để giảm số lần tái cấp phát tăng dần (incremental reallocation).

Chúng ta kiểm thử thực tế hiệu quả của phương thức này thông qua đoạn code dưới đây:

```java
public class EnsureCapacityTest {
  public static void main(String[] args) {
    ArrayList<Object> list = new ArrayList<Object>();
    final int N = 10000000;
    long startTime = System.currentTimeMillis();
    for (int i = 0; i < N; i++) {
      list.add(i);
    }
    long endTime = System.currentTimeMillis();
    System.out.println("使用ensureCapacity方法前："+(endTime - startTime));

  }
}
```

Kết quả chạy:

```plain
使用ensureCapacity方法前：2158
```

```java
public class EnsureCapacityTest {
    public static void main(String[] args) {
        ArrayList<Object> list = new ArrayList<Object>();
        final int N = 10000000;
        long startTime1 = System.currentTimeMillis();
        list.ensureCapacity(N);
        for (int i = 0; i < N; i++) {
            list.add(i);
        }
        long endTime1 = System.currentTimeMillis();
        System.out.println("使用ensureCapacity方法后："+(endTime1 - startTime1));
    }
}
```

Kết quả chạy:

```plain
使用ensureCapacity方法后：1773
```

Thông qua kết quả chạy, chúng ta có thể thấy việc sử dụng phương thức `ensureCapacity` trước khi thêm một lượng lớn phần tử vào `ArrayList` có thể nâng cao hiệu năng. Tuy nhiên, khoảng cách hiệu năng này gần như có thể bỏ qua. Hơn nữa, trong dự án thực tế căn bản cũng không thể thêm nhiều phần tử như vậy vào `ArrayList`.

<!-- @include: @article-footer.snippet.md -->
