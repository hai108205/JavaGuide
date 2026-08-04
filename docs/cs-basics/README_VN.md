---
title: Hệ thống kiến thức nền tảng Khoa học Máy tính - Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu và Thuật toán
description: Lộ trình học và ôn tập kiến thức nền tảng Khoa học Máy tính, bao gồm Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu, Thuật toán, Linux, TCP/IP, HTTP, DNS... Phù hợp cho sinh viên mới ra trường và lập trình viên chuẩn bị phỏng vấn.
icon: "mdi:desktop-classic"
sitemap:
  changefreq: weekly
  priority: 0.95
head:
  - - meta
    - name: keywords
      content: Kiến thức nền tảng máy tính,Tổng hợp kiến thức máy tính,Câu hỏi phỏng vấn Khoa học Máy tính,Mạng máy tính,Câu hỏi phỏng vấn mạng máy tính,Hệ điều hành,Câu hỏi phỏng vấn hệ điều hành,Cấu trúc dữ liệu,Câu hỏi phỏng vấn cấu trúc dữ liệu,Thuật toán,Câu hỏi phỏng vấn thuật toán,Linux,TCP/IP,HTTP,DNS,Phỏng vấn Backend,Phỏng vấn Java
  - - meta
    - property: og:title
      content: Hệ thống kiến thức nền tảng Khoa học Máy tính -  Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu và Thuật toán
  - - meta
    - property: og:description
      content: Tổng hợp kiến thức về Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu và Thuật toán, phù hợp cho lập trình viên Backend ôn tập trước các kỳ phỏng vấn.
---

<!-- @include: @small-advertisement.snippet.md -->

Tài liệu **Hệ thống kiến thức nền tảng Khoa học Máy tính** này được xây dựng dành cho việc học Backend và ôn tập phỏng vấn, sắp xếp theo lộ trình: **Mạng máy tính → Hệ điều hành → Cấu trúc dữ liệu → Thuật toán**, đồng thời tổng hợp các bài viết liên quan trên website.

Nếu bạn không có nhiều thời gian, hãy ưu tiên đọc **Tổng hợp câu hỏi phỏng vấn Mạng máy tính** và **Tổng hợp câu hỏi phỏng vấn Hệ điều hành** để nhanh chóng nắm được những chủ đề quan trọng nhất. Nếu muốn xây dựng nền tảng vững chắc, bạn nên học theo thứ tự các chuyên đề bên dưới.

Toàn bộ tài liệu có **hơn 300 hình minh họa kỹ thuật**, giúp giải thích các khái niệm trừu tượng một cách trực quan thay vì chỉ là những đoạn văn khô khan.

![Tổng quan nội dung kiến thức nền tảng Khoa học Máy tính](https://oss.javaguide.cn/github/javaguide/cs-basics/network/cs-basics-overview.png)

## Phù hợp với ai?

- Lập trình viên Backend muốn bổ sung kiến thức nền tảng Khoa học Máy tính một cách bài bản.
- Sinh viên chuẩn bị phỏng vấn tuyển dụng hoặc lập trình viên chuyển việc.
- Người muốn kết nối Mạng máy tính, Hệ điều hành, Cấu trúc dữ liệu và Thuật toán thành một hệ thống kiến thức hoàn chỉnh.
- Lập trình viên đã từng phát triển ứng dụng nhưng vẫn chưa thực sự vững về TCP/IP, HTTP, tiến trình, luồng, quản lý bộ nhớ, cây, đồ thị hay thuật toán sắp xếp.

## Nội dung trọng tâm

- Mạng máy tính: mô hình phân lớp, TCP/UDP, HTTP/HTTPS, DNS, ARP, NAT và các vấn đề bảo mật mạng thường gặp.
- Hệ điều hành: tiến trình, luồng, khóa và đồng bộ hóa, quản lý bộ nhớ, bộ nhớ ảo, Zero Copy, I/O Multiplexing, hệ thống tệp, Linux và Shell.
- Cấu trúc dữ liệu: mảng, danh sách liên kết, ngăn xếp, hàng đợi, bảng băm, cây, đồ thị, heap, Trie, Union-Find, Skip List, Red-Black Tree, Bloom Filter và LRU cùng đặc điểm và tình huống sử dụng.
- Thuật toán: phân tích độ phức tạp, Binary Search, Two Pointers, Sliding Window, DFS/BFS, Backtracking, Dynamic Programming, Greedy, Top K, sắp xếp, xử lý chuỗi, danh sách liên kết và các bài LeetCode phổ biến.
- Trong phỏng vấn, cần có khả năng trình bày đầy đủ theo mạch: **Khái niệm → Nguyên lý → So sánh → Ứng dụng → Câu hỏi thường gặp**.

## Thứ tự học được khuyến nghị

1. [Chuyên đề Mạng máy tính](./network/): Bắt đầu với mô hình phân lớp, HTTP, TCP, DNS và các câu hỏi phỏng vấn phổ biến để xây dựng cái nhìn tổng thể về truyền thông mạng.
2. [Chuyên đề Hệ điều hành](./operating-system/): Tìm hiểu tiến trình, luồng, bộ nhớ, hệ thống tệp, Linux và Shell để tạo nền tảng cho lập trình đồng thời, JVM và cơ sở dữ liệu.
3. [Chuyên đề Cấu trúc dữ liệu](./data-structure/): Nắm vững danh sách tuyến tính, bảng băm, cây, đồ thị, heap, Trie, Union-Find, Skip List, Red-Black Tree, Bloom Filter và LRU.
4. [Chuyên đề Thuật toán](./algorithms/): Luyện tập cùng phân tích độ phức tạp, các mẫu thuật toán và các bài LeetCode phổ biến.
5. Quay lại ôn tập các câu hỏi phỏng vấn: tập trung vào Mạng máy tính và Hệ điều hành trước, sau đó luyện lại các dạng bài Cấu trúc dữ liệu và Thuật toán theo từng nhóm.

Nếu công ty bạn hướng tới đánh giá thuật toán khá nặng, nên kết hợp bước 3 và bước 4. Sau khi học xong một cấu trúc dữ liệu, hãy luyện ngay các bài toán liên quan. Ví dụ: sau khi học **Hash Table** hãy giải Two Sum và Prefix Sum; sau **Heap** hãy luyện các bài **Top K**; sau **Tree** và **Graph** hãy tập trung vào **DFS**, **BFS**, **Backtracking** và **Dynamic Programming**.

## Các bài viết cốt lõi

### Mạng máy tính

- [Chuyên đề Mạng máy tính](./network/): Hệ thống kiến thức cốt lõi và các câu hỏi phỏng vấn theo từng tầng giao thức.
- [Tổng hợp câu hỏi phỏng vấn Mạng máy tính (Phần 1)](./network/other-network-questions.md): Bao gồm mô hình OSI/TCP-IP, HTTP, HTTPS, DNS và các kiến thức nền tảng.
- [Tổng hợp câu hỏi phỏng vấn Mạng máy tính (Phần 2)](./network/other-network-questions2.md): Tiếp tục với TCP, UDP, Socket và các vấn đề bảo mật mạng.
- [Mô hình OSI 7 tầng và TCP/IP 4 tầng](./network/osi-and-tcp-ip-model.md): Hiểu vai trò và trách nhiệm của từng tầng giao thức.
- [Điều gì xảy ra từ khi nhập URL đến khi trang web hiển thị?](./network/the-whole-process-of-accessing-web-pages.md): Kết nối DNS, TCP, HTTP và quá trình render của trình duyệt thành một chuỗi hoàn chỉnh.
- [HTTP và HTTPS](./network/http-vs-https.md), [HTTP 1.0 và HTTP 1.1](./network/http1.0-vs-http1.1.md), [Tổng hợp mã trạng thái HTTP](./network/http-status-codes.md): Các chủ đề thường gặp trong phỏng vấn.
- [Bắt tay ba bước và đóng kết nối bốn bước của TCP](./network/tcp-connection-and-disconnection.md), [Cơ chế đảm bảo truyền dữ liệu tin cậy của TCP](./network/tcp-reliability-guarantee.md): Hai chủ đề quan trọng nhất về TCP.

### Hệ điều hành

- [Chuyên đề Hệ điều hành](./operating-system/): Từ kiến thức cơ bản đến Linux.
- [Tổng hợp câu hỏi phỏng vấn Hệ điều hành (Phần 1)](./operating-system/operating-system-basic-questions-01.md): Bao gồm hệ điều hành, tiến trình, luồng, deadlock và quản lý bộ nhớ.
- [Tổng hợp câu hỏi phỏng vấn Hệ điều hành (Phần 2)](./operating-system/operating-system-basic-questions-02.md): Tiếp tục với hệ thống tệp, I/O và Linux.
- [Tiến trình và Luồng: khác biệt, trạng thái, giao tiếp, chuyển đổi ngữ cảnh và Virtual Thread](./operating-system/process-and-thread.md)
- [Giao tiếp giữa các tiến trình (IPC): Pipe, Message Queue, Shared Memory, Socket và Binder](./operating-system/ipc.md)
- [Khóa và cơ chế đồng bộ trong Hệ điều hành: Mutex, Semaphore, Condition Variable, Spinlock và Futex](./operating-system/os-lock-and-sync.md)
- [Quản lý bộ nhớ: Phân trang, Phân đoạn, Thay thế trang, Swap và OOM](./operating-system/memory-management.md)
- [Bộ nhớ ảo: Chuyển đổi địa chỉ, TLB, Page Fault và thay thế trang](./operating-system/virtual-memory.md)
- [Hệ thống tệp: inode, VFS, Page Cache và cơ chế Journal](./operating-system/file-system.md)
- [I/O Multiplexing: select, poll và epoll](./operating-system/io-multiplexing.md)
- [Zero Copy: mmap, sendfile và splice](./operating-system/zero-copy.md)
- [Kiến thức cơ bản về Linux](./operating-system/linux-intro.md)
- [Kiến thức cơ bản về Shell Script](./operating-system/shell-intro.md)

### Cấu trúc dữ liệu

- [Chuyên đề Cấu trúc dữ liệu](./data-structure/): Tổng hợp các cấu trúc dữ liệu phổ biến cùng hình minh họa.
- [Cấu trúc dữ liệu tuyến tính](./data-structure/linear-data-structure.md): Hiểu mảng, danh sách liên kết, ngăn xếp và hàng đợi.
- [Tổng hợp câu hỏi về Hash Table](./data-structure/hash-table.md): Hàm băm, xung đột băm, mở rộng dung lượng và liên hệ với `HashMap`.
- [Cấu trúc cây](./data-structure/tree.md): Cây nhị phân, BST, AVL, B-Tree và B+ Tree.
- [Đồ thị](./data-structure/graph.md): Biểu diễn đồ thị, DFS, BFS và đường đi ngắn nhất.
- [Heap](./data-structure/heap.md), [Red-Black Tree](./data-structure/red-black-tree.md), [Bloom Filter](./data-structure/bloom-filter.md)
- [Trie](./data-structure/trie.md), [Union-Find](./data-structure/union-find.md), [Skip List](./data-structure/skip-list.md), [LRU Cache](./data-structure/lru-cache.md)

Khi ôn tập Cấu trúc dữ liệu, bạn cũng nên kết hợp với các chuyên đề Java và Cơ sở dữ liệu: Mảng, Danh sách liên kết và Hash Table tương ứng với [Java Collection](../java/collection/); B+ Tree liên quan đến [MySQL Index](../database/mysql/mysql-index.md); Skip List liên quan đến [Redis Skip List](../database/redis/redis-skiplist.md); còn LRU và Bloom Filter thường được sử dụng trong các hệ thống cache.

### Thuật toán

- [Chuyên đề Thuật toán](./algorithms/): Tổng hợp các tư duy thuật toán, bài LeetCode phổ biến và các thuật toán sắp xếp kinh điển.
- [Hướng dẫn phân tích độ phức tạp thời gian và không gian](./algorithms/complexity-analysis.md)
- [Binary Search](./algorithms/binary-search.md), [Two Pointers và Sliding Window](./algorithms/two-pointers-and-sliding-window.md)
- [DFS và BFS](./algorithms/dfs-bfs.md), [Backtracking](./algorithms/backtracking.md)
- [Dynamic Programming](./algorithms/dynamic-programming.md), [Greedy](./algorithms/greedy.md), [Top K](./algorithms/top-k.md)
- [Các tư duy thuật toán kinh điển](./algorithms/classical-algorithm-problems-recommendations.md)
- [Danh sách bài LeetCode theo từng cấu trúc dữ liệu](./algorithms/common-data-structures-leetcode-recommendations.md)
- [Các bài toán xử lý chuỗi phổ biến](./algorithms/string-algorithm-problems.md), [Các bài toán danh sách liên kết phổ biến](./algorithms/linkedlist-algorithm-problems.md)
- [Một số bài lập trình trong Sword Offer](./algorithms/the-sword-refers-to-offer.md), [10 thuật toán sắp xếp kinh điển](./algorithms/10-classical-sorting-algorithms.md)

Khi luyện thuật toán, hãy ưu tiên nắm vững từng mẫu lời giải trước, sau đó mới luyện theo danh sách bài tập. **Các tư duy thuật toán kinh điển** phù hợp để học theo dạng bài, còn **Danh sách bài LeetCode theo từng cấu trúc dữ liệu** phù hợp để học theo từng cấu trúc.

## Những câu hỏi xuất hiện nhiều

- Mô hình OSI 7 tầng và TCP/IP 4 tầng là gì? Mỗi tầng giải quyết vấn đề nào?
- Điều gì xảy ra từ khi nhập URL đến khi trang web được hiển thị?
- HTTP và HTTPS khác nhau như thế nào? Vì sao HTTPS an toàn hơn?
- TCP bắt tay ba bước và đóng kết nối bốn bước giải quyết vấn đề gì? Vì sao tồn tại trạng thái `TIME_WAIT`?
- TCP đảm bảo truyền dữ liệu tin cậy bằng cách nào? Khi nào nên chọn TCP hoặc UDP?
- Tiến trình và Luồng khác nhau ở điểm nào? Deadlock là gì và làm sao để tránh?
- Quản lý bộ nhớ, bộ nhớ ảo, phân trang và phân đoạn trong hệ điều hành hoạt động như thế nào?
- Khi nào nên sử dụng Mảng, Danh sách liên kết, Ngăn xếp, Hàng đợi, Cây, Đồ thị hoặc Heap?
- Hash Table, Red-Black Tree, B+ Tree, Skip List, Bloom Filter và LRU được ứng dụng ở đâu trong thực tế?
- Làm thế nào để xây dựng bộ mẫu lời giải khi luyện các dạng bài thuật toán?

## Chuyên đề liên quan

- [Hệ thống kiến thức Java](../java/)
- [Hệ thống kiến thức Cơ sở dữ liệu](../database/)
- [Hệ thống kiến thức Hệ thống phân tán](../distributed-system/)
- [Hệ thống kiến thức Hệ thống hiệu năng cao](../high-performance/)
- [Thiết kế hệ thống](../system-design/)
- [Sách Khoa học Máy tính được đề xuất](../books/cs-basics.md)

<!-- @include: @article-footer.snippet.md -->