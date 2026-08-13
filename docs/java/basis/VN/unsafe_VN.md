---
title: Java Magic Class Unsafe Chi Tiết
description: "Phân tích chuyên sâu về Java Magic Class Unsafe: giải thích các khả năng cấp thấp như thao tác bộ nhớ trực tiếp, thao tác nguyên tử CAS, khởi tạo đối tượng, giúp hiểu nguyên lý triển khai của các lớp công cụ đồng thời JUC và rủi ro khi sử dụng."
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Unsafe类,内存操作,CAS原子操作,堆外内存,直接内存,sun.misc.Unsafe,JUC底层实现
---

> Bài viết này được tổng hợp và hoàn thiện từ hai bài viết xuất sắc dưới đây:
>
> - [Java Magic Class: Unsafe Application Analysis - Meituan Tech Team -2019](https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html)
> - [Java Double-Edged Sword: Unsafe Class Detailed - 码农参上 - 2021](https://xie.infoq.cn/article/8b6ed4195e475bfb32dacc5cb)

<!-- markdownlint-disable MD024 -->

Nếu bạn đã từng đọc mã nguồn của JUC, chắc chắn sẽ nhận thấy rất nhiều lớp công cụ đồng thời (concurrent utility classes) đều gọi đến một lớp có tên là `Unsafe`.

Vậy lớp này chủ yếu dùng để làm gì? Có những tình huống sử dụng nào? Bài viết này sẽ giúp bạn làm rõ!

## Unsafe Giới Thiệu

`Unsafe` là một lớp nằm trong package `sun.misc`, chủ yếu cung cấp một số phương thức để thực hiện các thao tác cấp thấp, không an toàn, chẳng hạn như truy cập trực tiếp tài nguyên bộ nhớ hệ thống, tự quản lý tài nguyên bộ nhớ, v.v. Những phương thức này đóng vai trò quan trọng trong việc nâng cao hiệu suất chạy của Java và tăng cường khả năng thao tác tài nguyên cấp thấp của ngôn ngữ Java. Tuy nhiên, do lớp `Unsafe` cho phép Java có khả năng thao tác không gian bộ nhớ giống như con trỏ trong ngôn ngữ C, điều này chắc chắn cũng làm tăng nguy cơ phát sinh các vấn đề liên quan đến con trỏ. Việc sử dụng quá mức hoặc không đúng cách lớp `Unsafe` trong chương trình sẽ làm tăng xác suất xảy ra lỗi, khiến cho Java - một ngôn ngữ vốn an toàn - trở nên không còn "an toàn" nữa, do đó việc sử dụng `Unsafe` cần phải hết sức thận trọng.

Ngoài ra, việc triển khai các chức năng mà `Unsafe` cung cấp cần phụ thuộc vào **Native Method**. Bạn có thể coi native method là các phương thức được viết bằng ngôn ngữ lập trình khác trong Java. Native method sử dụng từ khóa **`native`** để đánh dấu, trong mã Java chỉ khai báo phần đầu phương thức (method header), còn phần triển khai cụ thể được giao cho **native code**.

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717115231125.png)

**Tại sao cần sử dụng native method?**

1. Khi cần sử dụng các tính năng phụ thuộc vào hệ điều hành mà Java không có sẵn, Java trong khi triển khai khả năng đa nền tảng vẫn cần kiểm soát được tầng thấp, do đó cần nhờ đến các ngôn ngữ khác.
2. Đối với một số chức năng đã được hoàn thiện bằng ngôn ngữ khác, có thể gọi trực tiếp từ Java.
3. Khi chương trình nhạy cảm về thời gian hoặc yêu cầu hiệu suất rất cao, cần sử dụng các ngôn ngữ cấp thấp hơn như C/C++ hoặc thậm chí là assembly.

Trong JUC, rất nhiều lớp công cụ đồng thời khi triển khai cơ chế đồng thời đều gọi đến native method, thông qua đó phá vỡ ranh giới thời gian chạy của Java, có thể tiếp cận được một số chức năng cấp thấp của hệ điều hành. Đối với cùng một native method, các hệ điều hành khác nhau có thể triển khai theo những cách khác nhau, nhưng đối với người sử dụng thì điều này là trong suốt (transparent), và cuối cùng đều cho ra cùng một kết quả.

## Unsafe Tạo Đối Tượng

Một phần mã nguồn của `sun.misc.Unsafe` như sau:

```java
public final class Unsafe {
  // 单例对象
  private static final Unsafe theUnsafe;
  ......
  private Unsafe() {
  }
  @CallerSensitive
  public static Unsafe getUnsafe() {
    Class var0 = Reflection.getCallerClass();
    // 仅在引导类加载器`BootstrapClassLoader`加载时才合法
    if(!VM.isSystemDomainLoader(var0.getClassLoader())) {
      throw new SecurityException("Unsafe");
    } else {
      return theUnsafe;
    }
  }
}
```

`Unsafe` được triển khai theo mô hình singleton, cung cấp phương thức static `getUnsafe` để lấy đối tượng `Unsafe`. Thoạt nhìn có vẻ như phương thức này có thể dùng để lấy đối tượng `Unsafe`. Tuy nhiên, khi chúng ta gọi trực tiếp phương thức static này, sẽ nhận được ngoại lệ `SecurityException`:

```bash
Exception in thread "main" java.lang.SecurityException: Unsafe
 at sun.misc.Unsafe.getUnsafe(Unsafe.java:90)
 at com.cn.test.GetUnsafeTest.main(GetUnsafeTest.java:12)
```

**Tại sao phương thức `public static` lại không thể được gọi trực tiếp?**

Đó là vì trong phương thức `getUnsafe`, nó sẽ kiểm tra `classLoader` của đối tượng gọi, xác định xem lớp hiện tại có được tải bởi `Bootstrap classLoader` hay không, nếu không phải thì sẽ ném ra ngoại lệ `SecurityException`. Nói cách khác, chỉ có các lớp được tải bởi bootstrap class loader mới có thể gọi các phương thức trong lớp `Unsafe`, nhằm ngăn chặn các phương thức này bị gọi trong mã không đáng tin cậy.

**Tại sao phải hạn chế sử dụng lớp Unsafe một cách cẩn trọng như vậy?**

Các chức năng mà `Unsafe` cung cấp quá mức cấp thấp (như truy cập trực tiếp tài nguyên bộ nhớ hệ thống, tự quản lý tài nguyên bộ nhớ, v.v.), tiềm ẩn rủi ro bảo mật lớn, nếu sử dụng không đúng cách rất dễ dẫn đến các vấn đề nghiêm trọng.

**Vậy nếu muốn sử dụng lớp `Unsafe`, làm thế nào để lấy được đối tượng của nó?**

Dưới đây là hai phương án khả thi.

1. Sử dụng reflection để lấy đối tượng singleton `theUnsafe` đã được khởi tạo sẵn trong lớp `Unsafe`.

```java
private static Unsafe reflectGetUnsafe() {
    try {
      Field field = Unsafe.class.getDeclaredField("theUnsafe");
      field.setAccessible(true);
      return (Unsafe) field.get(null);
    } catch (Exception e) {
      log.error(e.getMessage(), e);
      return null;
    }
}
```

2. Xuất phát từ điều kiện hạn chế của phương thức `getUnsafe`, thông qua tham số dòng lệnh Java `-Xbootclasspath/a` để thêm đường dẫn jar chứa lớp A (lớp gọi các phương thức liên quan đến Unsafe) vào bootstrap path mặc định, khiến cho lớp A được tải bởi bootstrap class loader, từ đó có thể an toàn lấy đối tượng `Unsafe` thông qua phương thức `Unsafe.getUnsafe`.

```bash
java -Xbootclasspath/a: ${path}   // 其中path为调用Unsafe相关方法的类所在jar包路径
```

## Unsafe Chức Năng

Tóm lại, các chức năng mà lớp `Unsafe` triển khai có thể được chia thành 8 loại sau:

1. Thao tác bộ nhớ (Memory Operations)
2. Memory Barrier (Rào cản bộ nhớ)
3. Thao tác đối tượng (Object Operations)
4. Thao tác dữ liệu (Data Operations)
5. Thao tác CAS
6. Điều phối luồng (Thread Scheduling)
7. Thao tác Class
8. Thông tin hệ thống (System Information)

### Thao Tác Bộ Nhớ

#### Giới Thiệu

Nếu bạn từng là lập trình viên C hoặc C++, chắc chắn không xa lạ gì với thao tác bộ nhớ, trong khi ở Java, không được phép thao tác trực tiếp với bộ nhớ, việc phân bổ và thu hồi bộ nhớ đối tượng đều do JVM tự thực hiện. Tuy nhiên trong `Unsafe`, các interface sau đây cho phép thao tác trực tiếp với bộ nhớ:

```java
//分配新的本地空间
public native long allocateMemory(long bytes);
//重新调整内存空间的大小
public native long reallocateMemory(long address, long bytes);
//将内存设置为指定值
public native void setMemory(Object o, long offset, long bytes, byte value);
//内存拷贝
public native void copyMemory(Object srcBase, long srcOffset,Object destBase, long destOffset,long bytes);
//清除内存
public native void freeMemory(long address);
```

Sử dụng đoạn mã sau để kiểm tra:

```java
private void memoryTest() {
    int size = 4;
    // 1. 分配初始内存
    long oldAddr = unsafe.allocateMemory(size);
    System.out.println("Initial address: " + oldAddr);

    // 2. 向初始内存写入数据
    unsafe.putInt(oldAddr, 16843009); // 写入 0x01010101
    System.out.println("Value at oldAddr: " + unsafe.getInt(oldAddr));

    // 3. 重新分配内存
    long newAddr = unsafe.reallocateMemory(oldAddr, size * 2);
    System.out.println("New address: " + newAddr);

    // 4. reallocateMemory 已经将数据从 oldAddr 拷贝到 newAddr
    // 所以 newAddr 的前4个字节应该和 oldAddr 的内容一样
    System.out.println("Value at newAddr (first 4 bytes): " + unsafe.getInt(newAddr));

    // 关键：之后所有操作都应该基于 newAddr，oldAddr 已失效！
    try {
        // 5. 在新内存块的后半部分写入新数据
        unsafe.putInt(newAddr + size, 33686018); // 写入 0x02020202

        // 6. 读取整个8字节的long值
        System.out.println("Value at newAddr (full 8 bytes): " + unsafe.getLong(newAddr));

    } finally {
        // 7. 只释放最后有效的内存地址
        unsafe.freeMemory(newAddr);
        // 如果尝试 freeMemory(oldAddr)，将会导致 double free 错误！
    }
}
```

Trước tiên xem kết quả đầu ra:

```plain
Initial address: 140467048086752
Value at oldAddr: 16843009
New address: 140467048086752
Value at newAddr (first 4 bytes): 16843009
Value at newAddr (full 8 bytes): 144680345659310337
```

Hành vi của `reallocateMemory` tương tự như hàm `realloc` trong ngôn ngữ C, nó cố gắng mở rộng hoặc thu hẹp khối bộ nhớ mà không di chuyển dữ liệu. Hành vi của nó chủ yếu có hai trường hợp:

1. **Mở rộng tại chỗ (In-place Expansion)**: Nếu phía sau khối bộ nhớ hiện tại có đủ không gian trống liên tục, `reallocateMemory` sẽ mở rộng bộ nhớ trực tiếp tại địa chỉ ban đầu và trả về địa chỉ ban đầu.
2. **Mở rộng sang vị trí khác (Relocation Expansion)**: Nếu không gian phía sau khối bộ nhớ hiện tại không đủ, nó sẽ tìm một vùng nhớ mới đủ lớn, sao chép dữ liệu cũ sang đó, sau đó giải phóng địa chỉ bộ nhớ cũ và trả về địa chỉ mới.

**Kết hợp với kết quả chạy lần này, chúng ta có thể phân tích như sau:**

**Bước 1: Phân bổ ban đầu và ghi dữ liệu**

- `unsafe.allocateMemory(size)` đã phân bổ 4 byte bộ nhớ ngoài heap (off-heap memory), địa chỉ là `140467048086752`.
- `unsafe.putInt(oldAddr, 16843009)` đã ghi giá trị int `16843009` vào địa chỉ đó, biểu diễn hex của nó là `0x01010101`. `getInt` đọc chính xác, chứng minh ghi thành công.

**Bước 2: Mở rộng bộ nhớ tại chỗ**

- `long newAddr = unsafe.reallocateMemory(oldAddr, size * 2)` cố gắng mở rộng khối bộ nhớ lên 8 byte.
- Quan sát đầu ra New address: `140467048086752`, chúng ta thấy `newAddr` và `oldAddr` có giá trị **hoàn toàn giống nhau**.
- Điều này cho thấy thao tác lần này đã kích hoạt "mở rộng tại chỗ". Hệ thống đã tìm thấy đủ không gian phía sau địa chỉ ban đầu `140467048086752` và trực tiếp mở rộng khối bộ nhớ lên 8 byte. Trong quá trình này, địa chỉ cũ `oldAddr` vẫn hợp lệ và chính là `newAddr`, dữ liệu cũng không hề bị di chuyển.

**Bước 3: Xác minh dữ liệu và ghi dữ liệu mới**

- `unsafe.getInt(newAddr)` đọc lại 4 byte đầu tiên, kết quả vẫn là `16843009`, xác minh dữ liệu gốc vẫn nguyên vẹn.
- `unsafe.putInt(newAddr + size, 33686018)` ghi giá trị int mới `33686018` (hex là `0x02020202`) vào 4 byte được mở rộng thêm (offset là 4).

**Bước 4: Đọc dữ liệu hoàn chỉnh**

- `unsafe.getLong(newAddr)` đọc một giá trị long (8 byte) từ địa chỉ bắt đầu. Lúc này nội dung 8 byte trong bộ nhớ là sự ghép nối của `0x01010101` (địa chỉ thấp) và `0x02020202` (địa chỉ cao).
- Trên máy sử dụng little-endian, 8 byte này trong bộ nhớ sẽ được diễn giải thành số hex `0x0202020201010101`.
- Số hex này chuyển đổi sang thập phân, kết quả chính là `144680345659310337`. Điều này giải thích hoàn hảo cho kết quả đầu ra cuối cùng.

**Bước 5: Giải phóng bộ nhớ an toàn**

- Trong khối `finally`, `unsafe.freeMemory(newAddr)` giải phóng an toàn toàn bộ khối bộ nhớ 8 byte.
- Do lần này là mở rộng tại chỗ (`oldAddr == newAddr`), nên ngay cả khi ghi nhầm thêm một câu `freeMemory(oldAddr)` cũng sẽ dẫn đến lỗi nghiêm trọng double free.

#### Ứng Dụng Điển Hình

`DirectByteBuffer` là một lớp quan trọng trong Java dùng để triển khai bộ nhớ ngoài heap (off-heap memory), thường được sử dụng làm bộ đệm (buffer pool) trong quá trình giao tiếp, được ứng dụng rộng rãi trong các framework NIO như Netty, MINA. Các logic tạo, sử dụng, hủy bộ nhớ ngoài heap của `DirectByteBuffer` đều được triển khai thông qua API bộ nhớ ngoài heap do `Unsafe` cung cấp.

**Tại sao cần sử dụng bộ nhớ ngoài heap?**

- Cải thiện thời gian tạm dừng garbage collection. Do bộ nhớ ngoài heap được quản lý trực tiếp bởi hệ điều hành chứ không phải JVM, nên khi chúng ta sử dụng bộ nhớ ngoài heap, có thể giữ kích thước bộ nhớ trong heap (heap memory) ở mức nhỏ. Từ đó giảm ảnh hưởng của thời gian tạm dừng GC đối với ứng dụng.
- Nâng cao hiệu suất thao tác I/O của chương trình. Thông thường trong quá trình giao tiếp I/O, sẽ tồn tại thao tác sao chép dữ liệu từ bộ nhớ trong heap sang bộ nhớ ngoài heap, đối với dữ liệu tạm thời cần sao chép thường xuyên giữa các vùng nhớ và có vòng đời ngắn, nên lưu trữ vào bộ nhớ ngoài heap.

Hình dưới đây là constructor của `DirectByteBuffer`, khi tạo `DirectByteBuffer`, nó sử dụng `Unsafe.allocateMemory` để phân bổ bộ nhớ, `Unsafe.setMemory` để khởi tạo bộ nhớ, sau đó xây dựng đối tượng `Cleaner` để theo dõi garbage collection của đối tượng `DirectByteBuffer`, nhằm đảm bảo rằng khi `DirectByteBuffer` bị GC thu hồi, bộ nhớ ngoài heap đã phân bổ cũng được giải phóng cùng lúc.

```java
DirectByteBuffer(int cap) {                   // package-private

    super(-1, 0, cap, cap);
    boolean pa = VM.isDirectMemoryPageAligned();
    int ps = Bits.pageSize();
    long size = Math.max(1L, (long)cap + (pa ? ps : 0));
    Bits.reserveMemory(size, cap);

    long base = 0;
    try {
        // 分配内存并返回基地址
        base = unsafe.allocateMemory(size);
    } catch (OutOfMemoryError x) {
        Bits.unreserveMemory(size, cap);
        throw x;
    }
    // 内存初始化
    unsafe.setMemory(base, size, (byte) 0);
    if (pa && (base % ps != 0)) {
        // Round up to page boundary
        address = base + ps - (base & (ps - 1));
    } else {
        address = base;
    }
    // 跟踪 DirectByteBuffer 对象的垃圾回收，以实现堆外内存释放
    cleaner = Cleaner.create(this, new Deallocator(base, size, cap));
    att = null;
}
```

### Memory Barrier

#### Giới Thiệu

Trước khi giới thiệu về memory barrier, cần biết rằng compiler và CPU sẽ tiến hành sắp xếp lại mã (instruction reordering) với điều kiện đảm bảo kết quả đầu ra của chương trình không đổi, nhằm nâng cao hiệu suất từ góc độ tối ưu hóa lệnh. Tuy nhiên, việc sắp xếp lại lệnh có thể dẫn đến một hậu quả không mong muốn, đó là gây ra sự không nhất quán giữa dữ liệu trong CPU cache và bộ nhớ chính (main memory). Memory Barrier (`Memory Barrier`) chính là cơ chế ngăn chặn việc sắp xếp lại lệnh ở hai bên của barrier, từ đó tránh được các tình huống tối ưu hóa không chính xác từ compiler và phần cứng.

Ở cấp độ phần cứng, memory barrier là các lệnh mà CPU cung cấp để ngăn chặn việc sắp xếp lại mã, các nền tảng phần cứng khác nhau có thể triển khai memory barrier theo những cách khác nhau. Trong Java 8, 3 hàm memory barrier đã được giới thiệu, chúng che giấu sự khác biệt ở tầng hệ điều hành, cho phép định nghĩa trong mã và thống nhất để JVM sinh ra các lệnh memory barrier nhằm triển khai chức năng memory barrier.

`Unsafe` cung cấp ba phương thức liên quan đến memory barrier sau đây:

```java
//内存屏障，禁止load操作重排序。屏障前的load操作不能被重排序到屏障后，屏障后的load操作不能被重排序到屏障前
public native void loadFence();
//内存屏障，禁止store操作重排序。屏障前的store操作不能被重排序到屏障后，屏障后的store操作不能被重排序到屏障前
public native void storeFence();
//内存屏障，禁止load、store操作重排序
public native void fullFence();
```

Memory barrier ràng buộc ngữ nghĩa về thứ tự (ordering) và visibility giữa các thao tác truy cập bộ nhớ được chỉ định, chứ không đồng nghĩa với việc "xóa CPU cache" hoặc ép buộc đọc lại tất cả dữ liệu từ bộ nhớ chính. `loadFence()` chỉ cung cấp ràng buộc thứ tự ở phía đọc, không thể một mình thiết lập quan hệ `happens-before` trong Java Memory Model cho hai lần truy cập trường thông thường.

Do đó, không thể dùng "trường `boolean` thông thường + `loadFence()`" để thay thế `volatile` nhằm đảm bảo visibility xuyên suốt giữa các luồng (cross-thread visibility). Các cờ (flag) chia sẻ nên sử dụng `volatile`, lock, hoặc các cơ chế đồng bộ như `VarHandle` với mẫu truy cập đọc-ghi khớp nhau; nếu không, mã vẫn tồn tại data race và luồng đọc không đảm bảo quan sát được giá trị đã ghi.

#### Ứng Dụng Điển Hình

Trong Java 8, một cơ chế lock mới đã được giới thiệu — `StampedLock`, có thể xem là một phiên bản cải tiến của read-write lock. `StampedLock` cung cấp một cách triển khai optimistic read lock, loại optimistic read lock này tương tự như thao tác không khóa (lock-free), hoàn toàn không chặn luồng ghi lấy write lock, từ đó giảm thiểu hiện tượng "đói" (starvation) của luồng ghi trong tình huống đọc nhiều ghi ít. Do optimistic read lock của `StampedLock` không chặn luồng ghi lấy read lock, nên khi biến chia sẻ được load từ bộ nhớ chính vào bộ nhớ làm việc của luồng, có thể tồn tại vấn đề không nhất quán dữ liệu.

Để giải quyết vấn đề này, phương thức `validate` của `StampedLock` sẽ thêm một `load` memory barrier thông qua phương thức `loadFence` của `Unsafe`.

```java
public boolean validate(long stamp) {
   U.loadFence();
   return (stamp & SBITS) == (state & SBITS);
}
```

### Thao Tác Đối Tượng

#### Giới Thiệu

**Ví dụ**

```java
import sun.misc.Unsafe;
import java.lang.reflect.Field;

public class Main {

    private int value;

    public static void main(String[] args) throws Exception{
        Unsafe unsafe = reflectGetUnsafe();
        assert unsafe != null;
        long offset = unsafe.objectFieldOffset(Main.class.getDeclaredField("value"));
        Main main = new Main();
        System.out.println("value before putInt: " + main.value);
        unsafe.putInt(main, offset, 42);
        System.out.println("value after putInt: " + main.value);
  System.out.println("value after putInt: " + unsafe.getInt(main, offset));
    }

    private static Unsafe reflectGetUnsafe() {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            return (Unsafe) field.get(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

Kết quả đầu ra:

```plain
value before putInt: 0
value after putInt: 42
value after putInt: 42
```

**Thuộc Tính Đối Tượng**

Việc lấy offset bộ nhớ của thuộc tính thành viên đối tượng và sửa đổi giá trị thuộc tính đã được chúng ta kiểm tra trong ví dụ trên. Ngoài các phương thức `putInt`, `getInt` ở trên, Unsafe còn cung cấp đầy đủ các phương thức `put` và `get` cho cả 8 kiểu dữ liệu nguyên thủy (primitive types) và kiểu `Object`, và tất cả các phương thức `put` đều có thể vượt qua giới hạn truy cập (access modifier) để sửa đổi trực tiếp dữ liệu trong bộ nhớ. Đọc chú thích trong mã nguồn openJDK phát hiện ra rằng, việc đọc ghi kiểu dữ liệu nguyên thủy và `Object` có đôi chút khác biệt, kiểu dữ liệu nguyên thủy thao tác trực tiếp trên giá trị thuộc tính (`value`), còn thao tác với `Object` thì dựa trên giá trị tham chiếu (`reference value`). Dưới đây là các phương thức đọc ghi của `Object`:

```java
//在对象的指定偏移地址获取一个对象引用
public native Object getObject(Object o, long offset);
//在对象指定偏移地址写入一个对象引用
public native void putObject(Object o, long offset, Object x);
```

Ngoài việc đọc ghi thông thường các thuộc tính đối tượng, `Unsafe` còn cung cấp các phương thức **volatile read/write** và **ordered write** (ghi có thứ tự). Phạm vi bao phủ của các phương thức `volatile` read/write giống với đọc ghi thông thường, bao gồm tất cả các kiểu dữ liệu nguyên thủy và kiểu `Object`, lấy kiểu `int` làm ví dụ:

```java
//在对象的指定偏移地址处读取一个int值，支持volatile load语义
public native int getIntVolatile(Object o, long offset);
//在对象指定偏移地址处写入一个int，支持volatile store语义
public native void putIntVolatile(Object o, long offset, int x);
```

So với đọc ghi thông thường, `volatile` read/write có chi phí cao hơn, vì nó cần đảm bảo visibility và ordering. Khi thực hiện thao tác `get`, nó sẽ ép buộc lấy giá trị thuộc tính từ bộ nhớ chính, khi sử dụng phương thức `put` để thiết lập giá trị thuộc tính, nó sẽ ép buộc cập nhật giá trị vào bộ nhớ chính, từ đó đảm bảo những thay đổi này là visible đối với các luồng khác.

Các phương thức ordered write có ba loại sau:

```java
public native void putOrderedObject(Object o, long offset, Object x);
public native void putOrderedInt(Object o, long offset, int x);
public native void putOrderedLong(Object o, long offset, long x);
```

Chi phí của ordered write tương đối thấp hơn so với `volatile` write, vì nó chỉ đảm bảo ordering khi ghi, mà không đảm bảo visibility, tức là giá trị mà một luồng ghi không đảm bảo được các luồng khác có thể thấy ngay lập tức. Để giải quyết sự khác biệt ở đây, cần bổ sung thêm kiến thức về memory barrier, trước hết cần hiểu hai khái niệm lệnh:

- `Load`: Sao chép dữ liệu từ bộ nhớ chính vào bộ đệm (cache) của bộ xử lý
- `Store`: Đẩy dữ liệu từ bộ đệm của bộ xử lý vào bộ nhớ chính

Sự khác biệt giữa ordered write và `volatile` write nằm ở chỗ, loại memory barrier được thêm vào khi ordered write là `StoreStore`, còn khi `volatile` write, loại memory barrier được thêm vào là `StoreLoad`, như hình dưới đây:

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717144834132.png)

Trong phương thức ordered write, sử dụng barrier `StoreStore`, barrier này đảm bảo `Store1` ngay lập tức đẩy dữ liệu vào bộ nhớ, thao tác này diễn ra trước `Store2` và các lệnh store tiếp theo. Còn trong `volatile` write, sử dụng barrier `StoreLoad`, barrier này đảm bảo `Store1` ngay lập tức đẩy dữ liệu vào bộ nhớ, thao tác này diễn ra trước `Load2` và các lệnh load tiếp theo, đồng thời, barrier `StoreLoad` sẽ khiến cho tất cả các lệnh truy cập bộ nhớ trước barrier đó, bao gồm cả lệnh store và lệnh truy cập, đều phải hoàn thành trước khi thực thi các lệnh truy cập bộ nhớ sau barrier.

Tóm lại, trong ba loại phương thức ghi nêu trên, xét về hiệu suất ghi, theo thứ tự `put`, `putOrder`, `putVolatile` thì hiệu suất giảm dần.

**Khởi Tạo Đối Tượng (Object Instantiation)**

Sử dụng phương thức `allocateInstance` của `Unsafe` cho phép chúng ta khởi tạo đối tượng theo cách phi truyền thống. Trước tiên định nghĩa một lớp entity và gán giá trị cho biến thành viên trong constructor:

```java
@Data
public class A {
    private int b;
    public A(){
        this.b =1;
    }
}
```

So sánh các cách tạo đối tượng khác nhau dựa trên constructor, reflection và phương thức `Unsafe`:

```java
public void objTest() throws Exception{
    A a1=new A();
    System.out.println(a1.getB());
    A a2 = A.class.newInstance();
    System.out.println(a2.getB());
    A a3= (A) unsafe.allocateInstance(A.class);
    System.out.println(a3.getB());
}
```

Kết quả in ra lần lượt là 1, 1, 0, cho thấy trong quá trình tạo đối tượng thông qua phương thức `allocateInstance`, constructor của lớp sẽ không được gọi. Khi tạo đối tượng theo cách này, chỉ cần dùng đến đối tượng `Class`, vì vậy nếu muốn bỏ qua giai đoạn khởi tạo đối tượng hoặc bỏ qua kiểm tra bảo mật của constructor, có thể sử dụng phương thức này. Trong ví dụ trên, nếu đổi constructor của lớp A thành `private`, sẽ không thể tạo đối tượng thông qua constructor và reflection (có thể tạo đối tượng sau khi setAccessible trên đối tượng constructor), nhưng phương thức `allocateInstance` vẫn có hiệu lực.

#### Ứng Dụng Điển Hình

- **Cách khởi tạo đối tượng thông thường**: Các cách tạo đối tượng mà chúng ta thường dùng, về bản chất, đều thông qua cơ chế `new` để tạo đối tượng. Tuy nhiên, cơ chế `new` có một đặc điểm là khi lớp chỉ cung cấp constructor có tham số và không khai báo tường minh constructor không tham số, thì bắt buộc phải sử dụng constructor có tham số để tạo đối tượng, và khi sử dụng constructor có tham số, phải truyền đủ số lượng tham số tương ứng mới có thể hoàn thành khởi tạo đối tượng.
- **Cách khởi tạo phi truyền thống**: Unsafe cung cấp phương thức `allocateInstance`, chỉ cần thông qua đối tượng `Class` là có thể tạo đối tượng của lớp đó, mà không cần gọi constructor, mã khởi tạo, kiểm tra bảo mật JVM, v.v. Nó vô hiệu hóa việc phát hiện modifier, tức là ngay cả khi constructor được đánh dấu `private` cũng có thể khởi tạo thông qua phương thức này, chỉ cần cung cấp đối tượng Class là có thể tạo đối tượng tương ứng. Nhờ đặc tính này, `allocateInstance` được ứng dụng trong `java.lang.invoke`, Objenesis (cung cấp cách tạo đối tượng vượt qua constructor của lớp), Gson (sử dụng khi deserialize).

### Thao Tác Mảng

#### Giới Thiệu

Hai phương thức `arrayBaseOffset` và `arrayIndexScale` khi kết hợp với nhau, có thể định vị vị trí của từng phần tử trong mảng trong bộ nhớ.

```java
//返回数组中第一个元素的偏移地址
public native int arrayBaseOffset(Class<?> arrayClass);
//返回数组中一个元素占用的大小
public native int arrayIndexScale(Class<?> arrayClass);
```

#### Ứng Dụng Điển Hình

Hai phương thức liên quan đến thao tác dữ liệu này có ứng dụng điển hình trong `AtomicIntegerArray` (có thể triển khai thao tác nguyên tử cho từng phần tử trong mảng `Integer`) thuộc package `java.util.concurrent.atomic`, như mã nguồn `AtomicIntegerArray` dưới đây, thông qua `arrayBaseOffset` và `arrayIndexScale` của `Unsafe` để lần lượt lấy địa chỉ offset của phần tử đầu tiên trong mảng `base` và hệ số kích thước của một phần tử `scale`. Các thao tác nguyên tử liên quan sau đó đều dựa vào hai giá trị này để định vị phần tử trong mảng, như phương thức `getAndAdd` trong hình thứ hai, thông qua phương thức `checkedByteOffset` để lấy địa chỉ offset của một phần tử trong mảng, sau đó triển khai thao tác nguyên tử thông qua CAS.

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717144927257.png)

### Thao Tác CAS

#### Giới Thiệu

Phần này chủ yếu là các phương thức liên quan đến thao tác CAS.

```java
/**
  *  CAS
  * @param o         包含要修改field的对象
  * @param offset    对象中某field的偏移量
  * @param expected  期望值
  * @param update    更新值
  * @return          true | false
  */
public final native boolean compareAndSwapObject(Object o, long offset,  Object expected, Object update);

public final native boolean compareAndSwapInt(Object o, long offset, int expected,int update);

public final native boolean compareAndSwapLong(Object o, long offset, long expected, long update);
```

**CAS là gì?** CAS là viết tắt của Compare And Swap (So sánh và Hoán đổi), là một kỹ thuật thường dùng khi triển khai thuật toán đồng thời. Thao tác CAS bao gồm ba toán hạng — vị trí bộ nhớ, giá trị gốc mong đợi, và giá trị mới. Khi thực hiện thao tác CAS, nếu giá trị tại vị trí bộ nhớ khớp với giá trị mong đợi, nó sẽ cập nhật nguyên tử (atomically) thành giá trị mới, nếu không thì không cập nhật. HotSpot sẽ ánh xạ thao tác liên quan thành nguyên tử nguyên thủy (atomic primitive) mà nền tảng đích cung cấp; trên x86 thường sử dụng `cmpxchg`, các kiến trúc bộ xử lý khác có thể sử dụng lệnh hoặc chuỗi lệnh khác.

#### Ứng Dụng Điển Hình

Trong các lớp công cụ đồng thời của package JUC, thao tác CAS được sử dụng rộng rãi, giống như trong các bài viết trước giới thiệu về `synchronized` và `AQS` cũng đã nhiều lần nhắc đến CAS, nó đóng vai trò như optimistic lock và phát huy tác dụng rộng rãi trong các lớp công cụ đồng thời. Trong lớp `Unsafe`, các phương thức `compareAndSwapObject`, `compareAndSwapInt`, `compareAndSwapLong` được cung cấp để triển khai thao tác CAS cho các kiểu `Object`, `int`, `long`. Lấy phương thức `compareAndSwapInt` làm ví dụ:

```java
public final native boolean compareAndSwapInt(Object o, long offset,int expected,int x);
```

Trong các tham số, `o` là đối tượng cần cập nhật, `offset` là độ lệch (offset) của trường kiểu int trong đối tượng `o`, nếu giá trị của trường này khớp với `expected`, thì thiết lập giá trị của trường thành giá trị mới `x`, và việc cập nhật này là không thể bị ngắt quãng, tức là một thao tác nguyên tử. Dưới đây là một ví dụ sử dụng `compareAndSwapInt`:

```java
private volatile int a;
public static void main(String[] args){
    CasTest casTest=new CasTest();
    new Thread(()->{
        for (int i = 1; i < 5; i++) {
            casTest.increment(i);
            System.out.print(casTest.a+" ");
        }
    }).start();
    new Thread(()->{
        for (int i = 5 ; i <10 ; i++) {
            casTest.increment(i);
            System.out.print(casTest.a+" ");
        }
    }).start();
}

private void increment(int x){
    while (true){
        try {
            long fieldOffset = unsafe.objectFieldOffset(CasTest.class.getDeclaredField("a"));
            if (unsafe.compareAndSwapInt(this,fieldOffset,x-1,x))
                break;
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
    }
}
```

Chạy mã sẽ lần lượt xuất ra:

```plain
1 2 3 4 5 6 7 8 9
```

Nếu bạn dán đoạn mã trên vào IDE để chạy, sẽ phát hiện không thể nhận được kết quả đầu ra như mong đợi. Đã có bạn bè trên Github chỉ ra vấn đề này: [issue#2650](https://github.com/Snailclimb/JavaGuide/issues/2650). Dưới đây là đoạn mã đã sửa:

```java
// 将递增和打印操作封装在一个原子性更强的方法内
private void incrementAndPrint(int targetValue) {
    while (true) {
        int currentValue = a; // 读取当前 a 的值
        // 如果当前值已经达到或超过目标值，说明已被其他线程处理，跳过
        if (currentValue >= targetValue) {
            return;
        }
        // 尝试 CAS 操作：如果当前值等于 targetValue - 1，则原子地设置为 targetValue
        if (currentValue == targetValue - 1) {
          if (unsafe.compareAndSwapInt(this, fieldOffset, currentValue, targetValue)) {
              // CAS 成功后立即打印，确保打印的就是本次设置的值
              System.out.print(targetValue + " ");
              return;
          }
        }
        // CAS 失败，重新读取并重试
    }
}
```

Trong ví dụ trên, chúng ta đã tạo hai luồng (thread), cả hai đều cố gắng sửa đổi biến chia sẻ `a`. Mỗi luồng khi gọi phương thức `incrementAndPrint(targetValue)` sẽ:

1. Đầu tiên đọc giá trị hiện tại `currentValue` của `a`.
2. Kiểm tra xem `currentValue` có bằng `targetValue - 1` hay không (tức là giá trị trước đó mong đợi).
3. Nếu điều kiện thỏa mãn, gọi `unsafe.compareAndSwapInt()` để thử cập nhật `a` từ `currentValue` thành `targetValue`.
4. Nếu thao tác CAS thành công (trả về true), thì in `targetValue` và thoát khỏi vòng lặp.
5. Nếu thao tác CAS thất bại, chứng tỏ có luồng khác đang cạnh tranh đồng thời, lúc này sẽ đọc lại `currentValue` và thử lại cho đến khi thành công.

Cơ chế này đảm bảo mỗi số (từ 1 đến 9) chỉ được thiết lập thành công và in ra một lần, và được thực hiện theo đúng thứ tự.

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717144939826.png)

Cần lưu ý:

1. **Logic spin (tự quay):** Bản thân phương thức `compareAndSwapInt` chỉ thực hiện một lần thao tác so sánh và hoán đổi, và trả về kết quả ngay lập tức. Do đó, để đảm bảo thao tác cuối cùng thành công (trong điều kiện giá trị phù hợp với mong đợi), chúng ta cần triển khai tường minh logic spin trong mã (như vòng lặp `while(true)`), liên tục thử cho đến khi thao tác CAS thành công.
2. **Triển khai của `AtomicInteger`:** Lớp `java.util.concurrent.atomic.AtomicInteger` trong JDK chính là sử dụng thao tác CAS và logic spin tương tự để triển khai các phương thức nguyên tử như `getAndIncrement()`, `compareAndSet()`. Sử dụng trực tiếp `AtomicInteger` thường là cách làm an toàn hơn và được khuyến nghị hơn, vì nó đóng gói sự phức tạp ở tầng thấp.
3. **Vấn đề ABA:** Bản thân thao tác CAS tồn tại vấn đề ABA (một giá trị thay đổi từ A thành B, rồi lại quay về A, khi CAS kiểm tra sẽ cho rằng giá trị chưa hề thay đổi). Trong một số tình huống, nếu lịch sử thay đổi của giá trị là quan trọng, có thể cần sử dụng `AtomicStampedReference` để giải quyết. Nhưng trong tình huống tăng dần đơn giản của ví dụ này, vấn đề ABA thường không gây ảnh hưởng.
4. **Tiêu thụ CPU:** Spin trong thời gian dài sẽ tiêu thụ tài nguyên CPU. Trong tình huống cạnh tranh gay gắt hoặc điều kiện không được thỏa mãn trong thời gian dài, có thể xem xét thêm chiến lược back-off phức tạp hơn (như `Thread.sleep()` hoặc `LockSupport.parkNanos()`) để tối ưu.

### Điều Phối Luồng

#### Giới Thiệu

Hiện tại, các phương thức chính liên quan trực tiếp đến điều phối luồng trong `Unsafe` là `park` và `unpark`. Các phương thức `monitorEnter`, `monitorExit`, `tryMonitorEnter` trong lịch sử đã bị loại bỏ từ JDK 9.

```java
//取消阻塞线程
public native void unpark(Object thread);
//阻塞线程
public native void park(boolean isAbsolute, long time);
```

Hai phương thức `park`, `unpark` có thể triển khai việc tạm dừng (suspend) và khôi phục (resume) luồng. Việc tạm dừng một luồng được thực hiện thông qua phương thức `park`, sau khi gọi phương thức `park`, luồng sẽ bị block cho đến khi xuất hiện các điều kiện như timeout hoặc interrupt; `unpark` có thể chấm dứt một luồng đang bị tạm dừng, khiến nó trở lại trạng thái bình thường.

Ba phương thức liên quan đến `monitor` chỉ phù hợp để giới thiệu về cách triển khai ở phiên bản cũ, mã JDK hiện tại không thể gọi chúng nữa. Khi cần object monitor, nên sử dụng câu lệnh `synchronized` của ngôn ngữ Java hoặc các lock và synchronizer trong `java.util.concurrent`.

#### Ứng Dụng Điển Hình

Lớp lõi của framework lock và synchronizer trong Java, `AbstractQueuedSynchronizer` (AQS), chính là thông qua việc gọi `LockSupport.park()` và `LockSupport.unpark()` để triển khai việc block và đánh thức luồng, còn các phương thức `park`, `unpark` của `LockSupport` thực chất là gọi đến các phương thức `park`, `unpark` của `Unsafe`.

```java
public static void park(Object blocker) {
    Thread t = Thread.currentThread();
    setBlocker(t, blocker);
    UNSAFE.park(false, 0L);
    setBlocker(t, null);
}
public static void unpark(Thread thread) {
    if (thread != null)
        UNSAFE.unpark(thread);
}
```

Phương thức `park` của `LockSupport` ở tầng thấp sẽ gọi phương thức `park` của `Unsafe`. `park` có thể trả về do có permit khả dụng, do luồng khác gọi `unpark`, do luồng bị interrupt, hoặc không có lý do; biến thể có timeout cũng sẽ trả về sau khi timeout. Do đó, logic block phụ thuộc vào điều kiện nên kiểm tra lại điều kiện trong vòng lặp. Ví dụ dưới đây minh họa trường hợp được luồng khác gọi `unpark`:

```java
public static void main(String[] args) {
    Thread mainThread = Thread.currentThread();
    new Thread(()->{
        try {
            TimeUnit.SECONDS.sleep(5);
            System.out.println("subThread try to unpark mainThread");
            unsafe.unpark(mainThread);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();

    System.out.println("park main mainThread");
    unsafe.park(false,0L);
    System.out.println("unpark mainThread success");
}
```

Đầu ra của chương trình:

```plain
park main mainThread
subThread try to unpark mainThread
unpark mainThread success
```

Luồng chạy của chương trình cũng khá dễ hiểu, luồng con (sub-thread) sau khi bắt đầu chạy sẽ sleep trước, đảm bảo luồng chính (main thread) có thể gọi phương thức `park` để block chính nó, luồng con sau khi sleep 5 giây sẽ gọi phương thức `unpark` để đánh thức luồng chính, khiến luồng chính có thể tiếp tục thực thi. Toàn bộ luồng chạy như hình dưới đây:

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717144950116.png)

### Thao Tác Class

#### Giới Thiệu

Các thao tác liên quan đến `Class` của `Unsafe` chủ yếu bao gồm các phương thức liên quan đến class loading và static variable.

**Các phương thức liên quan đến đọc thuộc tính static**

> Ghi chú phiên bản: `shouldBeInitialized` và `ensureClassInitialized` đã bị loại bỏ khỏi `sun.misc.Unsafe` trong JDK 22, giải pháp thay thế tiêu chuẩn là `MethodHandles.Lookup.ensureInitialized` được giới thiệu trong JDK 15. Các đoạn mã dưới đây chỉ áp dụng cho các phiên bản JDK cũ hơn.

```java
//获取静态属性的偏移量
public native long staticFieldOffset(Field f);
//获取静态属性的对象指针
public native Object staticFieldBase(Field f);
//判断类是否需要初始化（用于获取类的静态属性前进行检测）
public native boolean shouldBeInitialized(Class<?> c);
```

Tạo một lớp chứa thuộc tính static để kiểm tra:

```java
@Data
public class User {
    public static String name="Hydra";
    int age;
}
private void staticTest() throws Exception {
    User user=new User();
    // 也可以用下面的语句触发类初始化
    // 1.
    // unsafe.ensureClassInitialized(User.class);
    // 2.
    // System.out.println(User.name);
    System.out.println(unsafe.shouldBeInitialized(User.class));
    Field sexField = User.class.getDeclaredField("name");
    long fieldOffset = unsafe.staticFieldOffset(sexField);
    Object fieldBase = unsafe.staticFieldBase(sexField);
    Object object = unsafe.getObject(fieldBase, fieldOffset);
    System.out.println(object);
}
```

Kết quả chạy:

```plain
false
Hydra
```

Trong phần thao tác đối tượng của `Unsafe`, chúng ta đã học cách lấy offset thuộc tính đối tượng thông qua phương thức `objectFieldOffset` và dựa vào đó để truy cập giá trị của biến, nhưng nó không áp dụng cho thuộc tính static trong lớp, lúc này cần sử dụng phương thức `staticFieldOffset`. Trong đoạn mã trên, chỉ có quá trình lấy đối tượng `Field` là phụ thuộc vào `Class`, còn khi lấy thuộc tính của biến static thì không còn phụ thuộc vào `Class` nữa.

Trong đoạn mã trên, trước tiên tạo một đối tượng `User`, điều này là vì nếu một lớp chưa được khởi tạo (initialized), thì thuộc tính static của nó cũng sẽ không được khởi tạo, và giá trị thuộc tính cuối cùng lấy được sẽ là `null`. Vì vậy trước khi lấy thuộc tính static, cần gọi phương thức `shouldBeInitialized` để phán đoán xem có cần khởi tạo lớp này trước khi lấy hay không. Nếu xóa câu lệnh tạo đối tượng User, kết quả chạy sẽ trở thành:

```plain
true
null
```

**Sử dụng phương thức `defineClass` cho phép chương trình động tạo một lớp trong thời gian chạy**

> Ghi chú phiên bản: `sun.misc.Unsafe.defineClass` đã bị loại bỏ trong JDK 11. Từ JDK 9 trở đi, có thể sử dụng `MethodHandles.Lookup.defineClass` tùy theo nhu cầu kiểm soát truy cập.

```java
public native Class<?> defineClass(String name, byte[] b, int off, int len, ClassLoader loader,ProtectionDomain protectionDomain);
```

Trong quá trình sử dụng thực tế, có thể chỉ truyền vào mảng byte, chỉ số byte bắt đầu và độ dài byte cần đọc, theo mặc định, class loader (`ClassLoader`) và protection domain (`ProtectionDomain`) đến từ đối tượng gọi phương thức này. Ví dụ dưới đây triển khai chức năng đọc file class đã được biên dịch:

```java
private static void defineTest() {
    String fileName="F:\\workspace\\unsafe-test\\target\\classes\\com\\cn\\model\\User.class";
    File file = new File(fileName);
    try(FileInputStream fis = new FileInputStream(file)) {
        byte[] content=new byte[(int)file.length()];
        fis.read(content);
        Class clazz = unsafe.defineClass(null, content, 0, content.length, null, null);
        Object o = clazz.getDeclaredConstructor().newInstance();
        Object age = clazz.getMethod("getAge").invoke(o, null);
        System.out.println(age);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

Trong đoạn mã lịch sử trên, trước tiên đọc một file `class` và chuyển đổi nó thành mảng byte thông qua file stream, sau đó sử dụng `defineClass` để động tạo lớp và khởi tạo đối tượng. Lớp được định nghĩa theo cách này vẫn phải trải qua kiểm tra định dạng file class của JVM, xác minh bytecode và các ràng buộc tải tương ứng, chứ không bỏ qua tất cả các kiểm tra bảo mật.

![](https://oss.javaguide.cn/github/javaguide/java/basis/unsafe/image-20220717145000710.png)

Phiên bản Unsafe cũ từng cung cấp phương thức `defineAnonymousClass`:

```java
public native Class<?> defineAnonymousClass(Class<?> hostClass, byte[] data, Object[] cpPatches);
```

Phương thức này có thể dùng để động tạo lớp ẩn danh (anonymous class), nhưng đã bị loại bỏ trong JDK 17. `MethodHandles.Lookup.defineHiddenClass` được giới thiệu trong JDK 15 là giải pháp thay thế được hỗ trợ. Việc triển khai cụ thể của Lambda thuộc về chi tiết triển khai của JDK, phiên bản hiện tại không thể mô tả là phụ thuộc vào `Unsafe.defineAnonymousClass` đã bị loại bỏ.

#### Ứng Dụng Điển Hình

Các phiên bản JDK lịch sử từng sử dụng `Unsafe.defineAnonymousClass` để hỗ trợ một phần triển khai ngôn ngữ động; JDK hiện tại sử dụng các cơ chế như hidden class, không còn cung cấp phương thức Unsafe đó nữa.

### Thông Tin Hệ Thống

#### Giới Thiệu

Phần này bao gồm hai phương thức lấy thông tin liên quan đến hệ thống.

```java
//返回系统指针的大小。返回值为4（32位系统）或 8（64位系统）。
public native int addressSize();
//内存页的大小，此值为2的幂次方。
public native int pageSize();
```

#### Ứng Dụng Điển Hình

Tình huống ứng dụng của hai phương thức này tương đối ít, trong lớp `java.nio.Bits`, khi sử dụng `pageCount` để tính số lượng trang bộ nhớ cần thiết, đã gọi phương thức `pageSize` để lấy kích thước trang bộ nhớ. Ngoài ra, khi sử dụng phương thức `copySwapMemory` để sao chép bộ nhớ, đã gọi phương thức `addressSize` để phát hiện tình huống hệ thống 32 bit.

## Tổng Kết

Trong bài viết này, chúng tôi đã giới thiệu khái niệm cơ bản, nguyên lý hoạt động và một phần API lịch sử của `Unsafe`. Cần lưu ý rằng, `sun.misc.Unsafe` thuộc về internal API không được hỗ trợ, nhiều phương thức đã bị loại bỏ trong các phiên bản JDK khác nhau. JDK 23 đã đánh dấu các phương thức truy cập bộ nhớ của nó là pending removal, từ JDK 24 trở đi, mặc định sẽ đưa ra cảnh báo runtime khi gọi lần đầu. Mã mới nên ưu tiên sử dụng API tiêu chuẩn: truy cập trường và mảng trong heap sử dụng `VarHandle`, truy cập bộ nhớ ngoài heap sử dụng Foreign Function and Memory API (`MemorySegment`, v.v.), đồng bộ luồng sử dụng `java.util.concurrent`.

<!-- @include: @article-footer.snippet.md -->
