---
title: Chuyên đề Java Collection: List, Map, Queue, Collection đồng bộ và phân tích mã nguồn
description: Lộ trình học tập Java Collection cho phỏng vấn và phân tích mã nguồn, bao gồm List, Set, Map, Queue, ArrayList, HashMap, ConcurrentHashMap, hàng đợi chặn (blocking queue) và các vấn đề thường gặp khi sử dụng collection.
category: Java
tag:
  - Java
  - Java集合
  - Java面试
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: Java集合,Java集合面试题,ArrayList,LinkedList,HashMap,ConcurrentHashMap,CopyOnWriteArrayList,ArrayBlockingQueue,PriorityQueue,DelayQueue,集合源码
---

Java Collection là một trong những thư viện nền tảng được sử dụng thường xuyên nhất trong phát triển nghiệp vụ, đồng thời cũng là module được hỏi nhiều nhất trong phỏng vấn Java. Khi học về collection, bạn cần biết mỗi container phù hợp với tình huống nào, đồng thời hiểu rõ các đánh đổi thiết kế đằng sau cơ chế mở rộng (expansion), xung đột băm (hash collision), iterator, thread-safe và container đồng bộ (concurrent container).

## Đối tượng phù hợp

- Backend developer muốn nắm vững một cách hệ thống về Java Collection Framework.
- Người đang chuẩn bị cho các câu hỏi phỏng vấn liên quan đến List, Map, Queue, collection đồng bộ và phân tích mã nguồn.
- Độc giả thường xuyên sử dụng collection nhưng chưa quen với các chi tiết như mở rộng (expansion), xung đột băm (hash collision), fail-fast, thread-safe.
- Kỹ sư muốn đọc mã nguồn JDK, bắt đầu từ các lớp collection phổ biến để xây dựng khả năng phân tích mã nguồn.

## Trọng tâm học tập

- Hệ thống interface của List, Set, Map, Queue và định vị các lớp triển khai phổ biến.
- Cấu trúc dữ liệu nền (underlying data structure) và cơ chế mở rộng của `ArrayList`, `LinkedList`, `HashMap`, `LinkedHashMap`.
- Tư duy thread-safe của các container đồng bộ như `ConcurrentHashMap`, `CopyOnWriteArrayList`, `ArrayBlockingQueue`.
- Các chi tiết thường gặp: xung đột băm (hash collision), cây hóa đỏ-đen (treeify), fail-fast, xóa phần tử khi duyệt bằng iterator, kiểm tra collection rỗng và ước lượng dung lượng (capacity estimation).
- Cách tiếp cận phân tích mã nguồn từ bốn góc độ: cấu trúc dữ liệu, trường khóa (key fields), phương thức lõi (core methods) và kiểm soát đồng thời (concurrency control).

## Thứ tự đọc đề xuất

1. [Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 1)](./java-collection-questions-01.md)：Xây dựng danh sách câu hỏi về collection framework và các container phổ biến.
2. [Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 2)](./java-collection-questions-02.md)：Tiếp tục bổ sung chi tiết về Map, Queue, collection đồng bộ và mã nguồn.
3. [Tổng hợp lưu ý khi sử dụng Java Collection](./java-collection-precautions-for-use.md)：Nắm vững các cách sử dụng thực tế dễ mắc lỗi trong dự án.
4. [Phân tích mã nguồn ArrayList](./arraylist-source-code.md)、[Phân tích mã nguồn LinkedList](./linkedlist-source-code.md)、[Phân tích mã nguồn HashMap](./hashmap-source-code.md)：Bắt đầu đọc mã nguồn từ các container phổ biến nhất.
5. [Phân tích mã nguồn ConcurrentHashMap](./concurrent-hash-map-source-code.md)、[Phân tích mã nguồn CopyOnWriteArrayList](./copyonwritearraylist-source-code.md)、[Phân tích mã nguồn ArrayBlockingQueue](./arrayblockingqueue-source-code.md)：Tiếp đến là collection đồng bộ và hàng đợi chặn (blocking queue).

## Bài viết cốt lõi

### Câu hỏi phỏng vấn và quy chuẩn sử dụng Collection

- [Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 1)](./java-collection-questions-01.md)：Bao gồm các câu hỏi cơ bản về collection framework, List, Set, Map, Queue.
- [Tổng hợp câu hỏi phỏng vấn Java Collection (Phần 2)](./java-collection-questions-02.md)：Tiếp tục phân tích bảng băm (hash table), collection đồng bộ, mã nguồn collection và các lỗi thường gặp.
- [Tổng hợp lưu ý khi sử dụng Java Collection](./java-collection-precautions-for-use.md)：Tổng kết các lưu ý về khởi tạo collection, kiểm tra rỗng, xóa khi duyệt, thread-safe và hiệu năng.

### Mã nguồn List và Map

- [Phân tích mã nguồn ArrayList](./arraylist-source-code.md)：Hiểu về mảng động (dynamic array), mở rộng (expansion), truy cập ngẫu nhiên và iterator.
- [Phân tích mã nguồn LinkedList](./linkedlist-source-code.md)：Hiểu về danh sách liên kết đôi (doubly linked list), thao tác đầu cuối và tình huống áp dụng.
- [Phân tích mã nguồn HashMap](./hashmap-source-code.md)：Hiểu về mảng, danh sách liên kết, cây đỏ-đen (red-black tree), hàm nhiễu (perturbation function), mở rộng và cây hóa (treeify).
- [Phân tích mã nguồn LinkedHashMap](./linkedhashmap-source-code.md)：Hiểu về thứ tự truy cập (access order), thứ tự chèn (insertion order) và tình huống LRU.

Nếu bạn chưa quen với cấu trúc dữ liệu nền tảng, có thể xem trước [Giải thích chi tiết cấu trúc dữ liệu tuyến tính](../../cs-basics/data-structure/linear-data-structure.md)、[Tổng hợp câu hỏi phỏng vấn bảng băm](../../cs-basics/data-structure/hash-table.md)、[Giải thích chi tiết cây đỏ-đen](../../cs-basics/data-structure/red-black-tree.md) và [Tổng hợp câu hỏi phỏng vấn LRU Cache](../../cs-basics/data-structure/lru-cache.md), sau đó quay lại đọc mã nguồn collection sẽ trôi chảy hơn nhiều.

### Collection đồng bộ và hàng đợi

- [Phân tích mã nguồn ConcurrentHashMap](./concurrent-hash-map-source-code.md)：Hiểu về sự tiến hóa từ khóa phân đoạn (segmented lock) đến CAS + synchronized.
- [Phân tích mã nguồn CopyOnWriteArrayList](./copyonwritearraylist-source-code.md)：Hiểu về copy-on-write và tình huống đọc nhiều ghi ít.
- [Phân tích mã nguồn ArrayBlockingQueue](./arrayblockingqueue-source-code.md)：Hiểu về hàng đợi chặn có giới hạn (bounded blocking queue), khóa (lock) và hàng đợi điều kiện (condition queue).
- [Phân tích mã nguồn PriorityQueue (trả phí)](./priorityqueue-source-code.md)：Hiểu về cấu trúc heap và hàng đợi ưu tiên (priority queue).
- [Phân tích mã nguồn DelayQueue](./delayqueue-source-code.md)：Hiểu về hàng đợi trễ (delay queue), hàng đợi ưu tiên và tình huống tác vụ định thời (scheduled task).

## Câu hỏi thường gặp

- `ArrayList` và `LinkedList` khác nhau như thế nào? Tại sao nhiều tình huống khuyến nghị dùng `ArrayList` hơn?
- Cấu trúc dữ liệu nền của `HashMap` là gì? Khi nào sẽ cây hóa (treeify)?
- Tại sao `HashMap` không thread-safe? Khi mở rộng (expansion) có thể xảy ra vấn đề gì?
- `HashMap` và `ConcurrentHashMap` khác nhau như thế nào?
- Cài đặt của `ConcurrentHashMap` trong JDK 7 và JDK 8 có gì thay đổi?
- Tại sao `CopyOnWriteArrayList` phù hợp với tình huống đọc nhiều ghi ít?
- fail-fast và fail-safe khác nhau như thế nào?
- Khi duyệt collection, làm thế nào để xóa phần tử an toàn?
- `ArrayBlockingQueue`, `PriorityQueue`, `DelayQueue` lần lượt phù hợp với tình huống nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức Java](../)
- [Chuyên đề Java Cơ bản](../basis/)
- [Chuyên đề Lập trình đồng thời Java](../concurrent/)
- [Chuyên đề JVM](../jvm/)
- [Cấu trúc dữ liệu](../../cs-basics/data-structure/)
- [Tổng hợp câu hỏi phỏng vấn bảng băm](../../cs-basics/data-structure/hash-table.md)
- [Tổng hợp câu hỏi phỏng vấn LRU Cache](../../cs-basics/data-structure/lru-cache.md)

<!-- @include: @article-footer.snippet.md -->