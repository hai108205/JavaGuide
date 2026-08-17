---
title: Giải thích chi tiết Memory Fragmentation của Redis
description: Phân tích chuyên sâu nguyên nhân phát sinh, cách nhận biết và phương án tối ưu Memory Fragmentation của Redis, bao gồm cách tính tỷ lệ phân mảnh bộ nhớ, nguyên lý bộ cấp phát jemalloc, cấu hình tự động dọn phân mảnh bộ nhớ...
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Redis Memory Fragmentation,Tỷ lệ phân mảnh bộ nhớ,jemalloc,Cấp phát bộ nhớ,activedefrag,Tối ưu bộ nhớ,Quản lý bộ nhớ Redis
---

## Memory Fragmentation là gì?

Bạn có thể hiểu đơn giản Memory Fragmentation (phân mảnh bộ nhớ) là những vùng bộ nhớ trống không thể sử dụng được.

Ví dụ: hệ điều hành cấp phát cho bạn 32 byte bộ nhớ liên tục, nhưng thực tế bạn chỉ cần dùng 24 byte để lưu dữ liệu, vậy 8 byte dư thừa nếu sau này không thể được cấp phát để lưu dữ liệu khác thì có thể gọi là Memory Fragmentation.

![Memory Fragmentation](https://oss.javaguide.cn/github/javaguide/memory-fragmentation.png)

Memory Fragmentation của Redis tuy không ảnh hưởng đến hiệu năng Redis, nhưng sẽ làm tăng mức tiêu thụ bộ nhớ.

## Vì sao có Memory Fragmentation trong Redis?

2 nguyên nhân thường gặp khiến phát sinh Memory Fragmentation trong Redis:

**1. Khi Redis lưu dữ liệu, vùng bộ nhớ xin cấp phát từ hệ điều hành có thể lớn hơn không gian lưu trữ thực tế mà dữ liệu cần.**

Dưới đây là nguyên văn của Redis chính thức về điều này:

> To store user keys, Redis allocates at most as much memory as the `maxmemory` setting enables (however there are small extra allocations possible).

Khi Redis dùng phương thức `zmalloc` (phương thức cấp phát bộ nhớ do chính Redis hiện thực) để cấp phát bộ nhớ, ngoài việc cấp phát bộ nhớ kích thước `size`, còn cấp phát thêm bộ nhớ kích thước `PREFIX_SIZE`.

Mã nguồn phương thức `zmalloc` như sau (địa chỉ mã nguồn: <https://github.com/antirez/redis-tools/blob/master/zmalloc.c):>

```java
void *zmalloc(size_t size) {
   // Cấp phát bộ nhớ với kích thước chỉ định
   void *ptr = malloc(size+PREFIX_SIZE);
   if (!ptr) zmalloc_oom_handler(size);
#ifdef HAVE_MALLOC_SIZE
   update_zmalloc_stat_alloc(zmalloc_size(ptr));
   return ptr;
#else
   *((size_t*)ptr) = size;
   update_zmalloc_stat_alloc(size+PREFIX_SIZE);
   return (char*)ptr+PREFIX_SIZE;
#endif
}
```

Ngoài ra, Redis có thể dùng nhiều bộ cấp phát bộ nhớ (libc, jemalloc, tcmalloc) để cấp phát bộ nhớ, mặc định dùng [jemalloc](https://github.com/jemalloc/jemalloc), và jemalloc cấp phát bộ nhớ theo một loạt kích thước cố định (8 byte, 16 byte, 32 byte...). Các đơn vị bộ nhớ mà jemalloc phân chia như hình dưới:

![Sơ đồ đơn vị bộ nhớ jemalloc](https://oss.javaguide.cn/github/javaguide/database/redis/6803d3929e3e46c1b1c9d0bb9ee8e717.png)

Khi chương trình xin cấp phát bộ nhớ gần với một giá trị cố định nào đó nhất, jemalloc sẽ cấp phát cho nó không gian có kích thước tương ứng, ví dụ chương trình cần xin 17 byte bộ nhớ, jemalloc sẽ cấp thẳng 32 byte bộ nhớ, như vậy sẽ lãng phí 15 byte bộ nhớ. Tuy nhiên, jemalloc đã tối ưu riêng cho vấn đề phân mảnh bộ nhớ, nên thường không tồn tại vấn đề phân mảnh quá mức.

**2. Thường xuyên sửa đổi dữ liệu trong Redis cũng sẽ phát sinh Memory Fragmentation.**

Khi một dữ liệu trong Redis bị xóa, Redis thường không dễ dàng trả lại bộ nhớ cho hệ điều hành.

Trong tài liệu chính thức của Redis cũng có nguyên văn tương ứng:

![](https://oss.javaguide.cn/github/javaguide/redis-docs-memory-optimization.png)

Địa chỉ tài liệu: <https://redis.io/topics/memory-optimization> .

## Xem thông tin Memory Fragmentation của Redis như thế nào?

Dùng lệnh `info memory` để xem thông tin liên quan đến bộ nhớ Redis. Ý nghĩa cụ thể của từng tham số trong hình dưới, tài liệu chính thức của Redis có giới thiệu chi tiết: <https://redis.io/commands/INFO> .

![](https://oss.javaguide.cn/github/javaguide/redis-info-memory.png)

Công thức tính tỷ lệ phân mảnh bộ nhớ của Redis: `mem_fragmentation_ratio` (tỷ lệ phân mảnh bộ nhớ) = `used_memory_rss` (kích thước bộ nhớ vật lý thực tế mà hệ điều hành cấp phát cho Redis) / `used_memory` (kích thước bộ nhớ thực tế mà bộ cấp phát bộ nhớ của Redis xin cấp phát để lưu dữ liệu)

Nghĩa là, giá trị `mem_fragmentation_ratio` (tỷ lệ phân mảnh bộ nhớ) càng lớn thì phân mảnh bộ nhớ càng nghiêm trọng.

Đừng nhầm tưởng rằng `used_memory_rss` trừ đi `used_memory` chính là kích thước của phân mảnh bộ nhớ!!! Con số này không chỉ bao gồm phân mảnh bộ nhớ, mà còn bao gồm chi phí của các tiến trình khác, cũng như chi phí của shared library, heap, stack...

Nhiều bạn có thể sẽ hỏi: "Tỷ lệ phân mảnh bộ nhớ bao nhiêu thì cần dọn?".

Thông thường, chúng ta cho rằng chỉ khi `mem_fragmentation_ratio > 1.5` thì mới cần dọn phân mảnh bộ nhớ. `mem_fragmentation_ratio > 1.5` nghĩa là bạn dùng Redis để lưu dữ liệu có kích thước thực tế 2G thì cần dùng hơn 3G bộ nhớ.

Nếu muốn xem nhanh tỷ lệ phân mảnh bộ nhớ, bạn còn có thể dùng lệnh sau:

```bash
> redis-cli -p 6379 info | grep mem_fragmentation_ratio
```

Ngoài ra, tỷ lệ phân mảnh bộ nhớ cũng có thể nhỏ hơn 1. Trường hợp này trong quá trình sử dụng hàng ngày tôi chưa từng gặp, bạn nào quan tâm có thể xem bài viết [Phân tích sự cố | Tỷ lệ phân mảnh bộ nhớ Redis quá thấp thì phải làm sao? - Cộng đồng mã nguồn mở Aikesheng](https://mp.weixin.qq.com/s/drlDvp7bfq5jt2M5pTqJCw) .

## Dọn Memory Fragmentation của Redis như thế nào?

Từ phiên bản Redis 4.0-RC3 trở đi đã tích hợp sẵn tính năng dọn dẹp bộ nhớ, có thể tránh vấn đề tỷ lệ phân mảnh bộ nhớ quá lớn.

Chỉ cần dùng lệnh `config set` để đặt cấu hình `activedefrag` thành `yes`.

```bash
config set activedefrag yes
```

Cụ thể khi nào dọn sẽ được điều khiển qua hai tham số sau:

```bash
# Bắt đầu dọn khi phân mảnh bộ nhớ chiếm không gian đạt 500mb
config set active-defrag-ignore-bytes 500mb
# Bắt đầu dọn khi tỷ lệ phân mảnh bộ nhớ lớn hơn 1.5
config set active-defrag-threshold-lower 50
```

Cơ chế tự động dọn phân mảnh bộ nhớ của Redis có thể ảnh hưởng đến hiệu năng Redis, chúng ta có thể dùng hai tham số sau để giảm ảnh hưởng đến hiệu năng Redis:

```bash
# Tỷ lệ thời gian CPU mà dọn phân mảnh bộ nhớ chiếm không thấp hơn 20%
config set active-defrag-cycle-min 20
# Tỷ lệ thời gian CPU mà dọn phân mảnh bộ nhớ chiếm không cao hơn 50%
config set active-defrag-cycle-max 50
```

Ngoài ra, khởi động lại node có thể thực hiện dọn lại phân mảnh bộ nhớ. Nếu bạn dùng Redis Cluster kiến trúc High Availability, bạn có thể chuyển node Master có tỷ lệ phân mảnh quá cao thành node Slave để khởi động lại an toàn.

## Tham khảo

- Tài liệu chính thức của Redis: <https://redis.io/topics/memory-optimization>
- Redis Core Technology and Practice - Geek Time - Sau khi xóa dữ liệu, vì sao tỷ lệ dùng bộ nhớ vẫn rất cao?: <https://time.geekbang.org/column/article/289140>
- Phân tích mã nguồn Redis — Cấp phát bộ nhớ: <<https://shinerio.cc/2020/05/17/redis/Redis> Phân tích mã nguồn — Quản lý bộ nhớ>

<!-- @include: @article-footer.snippet.md -->
