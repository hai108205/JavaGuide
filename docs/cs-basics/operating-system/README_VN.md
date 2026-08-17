---
title: "Chuyên đề hệ điều hành: Process Thread, Quản lý bộ nhớ, Hệ thống tệp, I/O Multiplexing, Linux và Shell"
description: "Lộ trình học và phỏng vấn hệ điều hành, bao gồm process thread, IPC, cơ chế khóa và đồng bộ, deadlock, bộ nhớ ảo, zero-copy, I/O multiplexing, hệ thống tệp, nền tảng Linux, lập trình Shell và các câu hỏi phỏng vấn hệ điều hành thường gặp."
category: Kiến thức cơ sở máy tính
tag:
  - Hệ điều hành
  - Linux
  - Shell
sidebar: false
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: 操作系统,操作系统面试题,进程,线程,进程间通信,IPC,锁与同步,互斥锁,信号量,条件变量,futex,死锁,内存管理,虚拟内存,零拷贝,I/O多路复用,select,poll,epoll,文件系统,Linux,Shell,后端面试
---

Chuyên đề **Hệ điều hành** này hướng đến việc học tập và ôn luyện phỏng vấn cho lập trình viên backend, tổng hợp các nội dung liên quan đến kiến thức nền tảng hệ điều hành, process thread, IPC, khóa và đồng bộ, quản lý bộ nhớ, bộ nhớ ảo, zero-copy, I/O multiplexing, hệ thống tệp, Linux và Shell.

## Phù hợp với ai

- Những lập trình viên backend đang hệ thống hóa kiến thức nền tảng hệ điều hành.
- Các bạn đang chuẩn bị phỏng vấn hệ điều hành cho tuyển dụng mới ra trường, tuyển dụng xã hội, công ty vừa và lớn.
- Những độc giả chỉ học thuộc lòng rời rạc về process thread, deadlock, quản lý bộ nhớ, lệnh Linux.
- Các kỹ sư muốn đặt nền móng cho Java concurrency, JVM, database, lập trình mạng.

## Trọng tâm học tập

- Hệ điều hành chịu trách nhiệm quản lý CPU, bộ nhớ, tệp, I/O và process, là nền tảng để hiểu cơ chế hoạt động của phần mềm tầng trên.
- Process, thread và IPC là các khái niệm cơ bản của lập trình concurrency, hiệu năng server và xử lý sự cố.
- Khóa và đồng bộ, deadlock, context switch, lập lịch là các điểm tần suất cao trong phỏng vấn.
- Quản lý bộ nhớ, bộ nhớ ảo, phân trang, thay thế trang giúp hiểu JVM, database và cache.
- Zero-copy, I/O multiplexing giúp hiểu các component hiệu năng cao như Kafka, RocketMQ, Redis, Nginx, Netty.
- Linux và Shell là năng lực thường dùng trong phát triển backend, triển khai, xử lý sự cố, viết script tự động hóa.

## Thứ tự đọc đề xuất

1. [Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (Phần 1)](./operating-system-basic-questions-01.md)：Trước tiên xây dựng danh sách câu hỏi tần suất cao về kiến thức nền tảng hệ điều hành, process thread, deadlock, quản lý bộ nhớ.
2. [Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (Phần 2)](./operating-system-basic-questions-02.md)：Tiếp tục bổ sung các vấn đề về hệ thống tệp, I/O, Linux...
3. [Giải thích chi tiết Process và Thread：sự khác biệt, trạng thái, giao tiếp, context switch và virtual thread](./process-and-thread.md)：Hiểu hệ thống về process, thread, PCB/TCB, fork/exec/wait, mô hình thread và context switch.
4. [Giải thích chi tiết Interrupt, Exception và System Call：từ cổng vào kernel đến page fault](./interrupt-exception-syscall.md)：Lấy `read()` làm sợi dây liên kết phần cứng interrupt, synchronous exception, system call, signal, page fault và thread switch.
5. [Giải thích chi tiết CPU Scheduling và System Load](./cpu-scheduling-and-load.md)：Hiểu thuật toán lập lịch, CFS/EEVDF, load average, mức sử dụng CPU và tư duy xử lý sự cố trực tuyến.
6. [Giải thích chi tiết Inter-Process Communication (IPC)：pipe, message queue, shared memory, Socket và Binder](./ipc.md)：So sánh các phương án IPC như pipe, message queue, shared memory, semaphore, Socket, Binder...
7. [Giải thích chi tiết cơ chế khóa và đồng bộ hệ điều hành：mutex、semaphore、condition variable、spinlock 与 futex](./os-lock-and-sync.md)：Hiểu ranh giới trách nhiệm của critical section, mutex, semaphore, condition variable, spinlock và futex.
8. [Giải thích chi tiết Deadlock：bốn điều kiện cần thiết, xử lý sự cố deadlock Java và xử lý deadlock database](./dead-lock.md)：Làm rõ vòng chờ deadlock, bốn điều kiện cần thiết, xử lý sự cố deadlock thread Java và retry giao dịch database.
9. [Giải thích chi tiết Quản lý bộ nhớ hệ điều hành：phân trang, phân đoạn, thay thế trang, Swap và OOM](./memory-management.md)：Hiểu phân bổ bộ nhớ, phân mảnh, page table, thu hồi trang và OOM.
10. [Giải thích chi tiết Bộ nhớ ảo：chuyển đổi địa chỉ, TLB, page fault và thay thế trang](./virtual-memory.md)：Liên kết phân trang, page table, TLB, page fault và thay thế trang với nhau.
11. [Giải thích chi tiết Hệ thống tệp hệ điều hành：inode、VFS、Page Cache 与日志机制](./file-system.md)：Hiểu tệp, thư mục, inode, VFS, Page Cache và khôi phục log.
12. [Giải thích chi tiết I/O Multiplexing：nguyên lý và sự khác biệt của select、poll、epoll](./io-multiplexing.md)：Hiểu cơ chế kernel đằng sau việc một thread xử lý khối lượng kết nối khổng lồ.
13. [Giải thích chi tiết Zero-Copy：mmap、sendfile 与 splice](./zero-copy.md)：Làm rõ đường sao chép và kịch bản áp dụng của I/O truyền thống, mmap, sendfile, splice.
14. [Tổng hợp kiến thức cơ bản Linux](./linux-intro.md)：Nắm cấu trúc thư mục, quyền tệp, lệnh thường dùng và năng lực xử lý sự cố cơ bản.
15. [Tổng hợp kiến thức cơ bản lập trình Shell](./shell-intro.md)：Học biến, điều kiện, vòng lặp, hàm và cách viết script thường dùng.

## Bài viết cốt lõi

- [Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (Phần 1)](./operating-system-basic-questions-01.md)：Bao phủ các vấn đề tần suất cao như kiến thức nền tảng hệ điều hành, process thread, deadlock, quản lý bộ nhớ...
- [Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (Phần 2)](./operating-system-basic-questions-02.md)：Tiếp tục tổng hợp các điểm kiến thức như hệ thống tệp, I/O, multiplexing, Linux...
- [Giải thích chi tiết Process và Thread：sự khác biệt, trạng thái, giao tiếp, context switch và virtual thread](./process-and-thread.md)：Làm rõ ranh giới tài nguyên, chuyển đổi trạng thái của process và thread, cơ chế tạo của Linux và Java virtual thread.
- [Giải thích chi tiết Interrupt, Exception và System Call：từ cổng vào kernel đến page fault](./interrupt-exception-syscall.md)：Làm rõ mối quan hệ giữa hardware interrupt, synchronous exception, system call, signal và page fault.
- [Giải thích chi tiết CPU Scheduling và System Load](./cpu-scheduling-and-load.md)：Làm rõ lập lịch tác vụ, CFS/EEVDF, load average, mức sử dụng CPU và lệnh xử lý sự cố thường dùng.
- [Giải thích chi tiết Inter-Process Communication (IPC)：pipe, message queue, shared memory, Socket và Binder](./ipc.md)：Làm rõ nguyên lý, ưu nhược điểm và tư duy chọn lựa của các cách IPC thông dụng.
- [Giải thích chi tiết cơ chế khóa và đồng bộ hệ điều hành：mutex、semaphore、condition variable、spinlock 与 futex](./os-lock-and-sync.md)：Làm rõ critical section, mutex, semaphore, condition variable, spinlock, futex, memory order và ngữ cảnh khóa trong kernel.
- [Giải thích chi tiết Deadlock：bốn điều kiện cần thiết, xử lý sự cố deadlock Java và xử lý deadlock database](./dead-lock.md)：Làm rõ điều kiện hình thành deadlock, đồ thị cấp phát tài nguyên, công cụ xử lý sự cố Java, phát hiện deadlock database và chiến lược retry tầng ứng dụng.
- [Giải thích chi tiết Quản lý bộ nhớ hệ điều hành：phân trang, phân đoạn, thay thế trang, Swap và OOM](./memory-management.md)：Làm rõ VSZ/RSS/PSS, phân bổ liên tục, phân mảnh bộ nhớ, buddy system, page table, TLB, page fault, thu hồi trang và OOM.
- [Giải thích chi tiết Bộ nhớ ảo：chuyển đổi địa chỉ, TLB, page fault và thay thế trang](./virtual-memory.md)：Làm rõ địa chỉ ảo, địa chỉ vật lý, phân trang, multi-level page table, TLB, page fault và thuật toán thay thế trang.
- [Giải thích chi tiết Hệ thống tệp hệ điều hành：inode、VFS、Page Cache 与日志机制](./file-system.md)：Làm rõ tệp, thư mục, inode, dentry, file descriptor, VFS, Page Cache, fsync và cơ chế log.
- [Giải thích chi tiết I/O Multiplexing：nguyên lý và sự khác biệt của select、poll、epoll](./io-multiplexing.md)：Làm rõ hai giai đoạn của network I/O, năm mô hình I/O, và sự khác biệt của select, poll, epoll.
- [Giải thích chi tiết Zero-Copy：mmap、sendfile 与 splice](./zero-copy.md)：Làm rõ zero-copy thực sự tiết kiệm điều gì, và ứng dụng điển hình trong Java NIO, Kafka, RocketMQ.
- [Tổng hợp kiến thức cơ bản Linux](./linux-intro.md)：Giải thích cây thư mục Linux, quyền tệp, lệnh thường dùng, quản lý người dùng và process.
- [Tổng hợp kiến thức cơ bản lập trình Shell](./shell-intro.md)：Giải thích biến Shell, phán đoán điều kiện, vòng lặp, hàm, xử lý text và thực hành viết script.

## Câu hỏi tần suất cao

- Process và thread khác nhau ở điểm nào? Thread chia sẻ những tài nguyên nào với nhau?
- Có những cách IPC nào? Mỗi cách phù hợp với kịch bản nào?
- Context switch là gì? Context switch thường xuyên có ảnh hưởng gì?
- mutex、semaphore、condition variable、spinlock và futex lần lượt giải quyết vấn đề gì?
- Điều kiện cần thiết để deadlock sinh ra là gì? Trong Java và database làm sao xử lý sự cố deadlock?
- Bộ nhớ ảo là gì? Phân trang và phân đoạn khác nhau ở điểm nào?
- TLB、page fault và thay thế trang lần lượt giải quyết vấn đề gì?
- Có những thuật toán thay thế trang nào? Page fault là chuyện gì xảy ra?
- Tại sao zero-copy nhanh? mmap、sendfile、splice khác nhau ở điểm nào?
- inode、hard link、soft link của hệ thống tệp lần lượt là gì?
- select、poll、epoll khác nhau ở điểm nào?
- Hiểu quyền tệp Linux như thế nào? Có những lệnh xử lý sự cố thường dùng nào?
- Script Shell phù hợp giải quyết những vấn đề tự động hóa nào?

## Chuyên đề liên quan

- [Hệ thống kiến thức cơ sở máy tính](../)
- [Chuyên đề mạng máy tính](../network/)
- [Chuyên đề cấu trúc dữ liệu](../data-structure/)
- [Lập trình concurrency Java](../../java/concurrent/java-concurrent-questions-01.md)
- [Giải thích chi tiết vùng bộ nhớ JVM](../../java/jvm/memory-area.md)

<!-- @include: @article-footer.snippet.md -->
