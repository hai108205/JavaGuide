---
title: Tổng hợp câu hỏi phỏng vấn Redis thường gặp (Phần 2)
description: "Tổng hợp câu hỏi phỏng vấn Redis mới nhất (Phần 2): Phân tích chuyên sâu về nguyên lý Redis Transaction, tối ưu hiệu năng (pipeline/Lua/bigkey/hotkey), giải pháp cho Cache Penetration/Cache Breakdown/Cache Avalanche, Slow Query và Memory Fragmentation, giải thích chi tiết Redis Sentinel và Redis Cluster. Giúp bạn dễ dàng vượt qua phỏng vấn kỹ thuật Backend!"
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Câu hỏi phỏng vấn Redis,Redis Transaction,Redis tối ưu hiệu năng,Redis Cache Penetration,Redis Cache Breakdown,Redis Cache Avalanche,Redis bigkey,Redis hotkey,Redis Slow Query,Redis Memory Fragmentation,Redis Cluster,Redis Sentinel,Redis Cluster,Redis pipeline,Redis Lua script
---

<!-- @include: @article-header.snippet.md -->

## Redis Transaction (Giao dịch)

### Redis Transaction là gì?

Bạn có thể hiểu Redis Transaction trong Redis như sau: **Redis Transaction cung cấp một tính năng cho phép đóng gói nhiều yêu cầu lệnh lại với nhau. Sau đó, tất cả các lệnh đã đóng gói được thực thi theo thứ tự và không bị gián đoạn giữa chừng.**

Redis Transaction thực tế rất ít được sử dụng trong phát triển thực tế, tính năng khá hạn chế, đừng nhầm lẫn nó với Transaction của cơ sở dữ liệu quan hệ mà chúng ta thường hiểu.

Ngoài việc không đáp ứng được tính nguyên tử (Atomicity) và tính bền vững (Durability), mỗi lệnh trong Transaction đều tương tác mạng với máy chủ Redis, đây là hành vi khá lãng phí tài nguyên. Rõ ràng chỉ cần thực thi hàng loạt lệnh một lần là xong, cách làm này thật khó hiểu.

Vì vậy, không nên sử dụng Redis Transaction trong phát triển hằng ngày.

### Sử dụng Redis Transaction như thế nào?

Redis có thể triển khai tính năng Transaction (Giao dịch) thông qua các lệnh **`MULTI`, `EXEC`, `DISCARD` và `WATCH`**.

```bash
> MULTI
OK
> SET PROJECT "JavaGuide"
QUEUED
> GET PROJECT
QUEUED
> EXEC
1) OK
2) "JavaGuide"
```

Sau lệnh [`MULTI`](https://redis.io/commands/multi) có thể nhập nhiều lệnh, Redis sẽ không thực thi các lệnh này ngay lập tức mà đưa chúng vào hàng đợi, khi gọi lệnh [`EXEC`](https://redis.io/commands/exec) thì tất cả các lệnh mới được thực thi.

Quá trình này diễn ra như sau:

1. Bắt đầu Transaction (`MULTI`);
2. Đưa lệnh vào hàng đợi (các lệnh thao tác hàng loạt với Redis được thực thi theo thứ tự vào trước ra trước (FIFO));
3. Thực thi Transaction (`EXEC`).

Bạn cũng có thể hủy một Transaction bằng lệnh [`DISCARD`](https://redis.io/commands/discard), lệnh này sẽ xóa tất cả các lệnh được lưu trong hàng đợi của Transaction.

```bash
> MULTI
OK
> SET PROJECT "JavaGuide"
QUEUED
> GET PROJECT
QUEUED
> DISCARD
OK
```

Bạn có thể dùng lệnh [`WATCH`](https://redis.io/commands/watch) để theo dõi một Key chỉ định, khi gọi lệnh `EXEC` để thực thi Transaction, nếu một Key đang được lệnh `WATCH` theo dõi bị **client/Session khác** sửa đổi thì toàn bộ Transaction sẽ không được thực thi.

```bash
# Client 1
> SET PROJECT "RustGuide"
OK
> WATCH PROJECT
OK
> MULTI
OK
> SET PROJECT "JavaGuide"
QUEUED

# Client 2
# Sửa giá trị của PROJECT trước khi Client 1 thực thi lệnh EXEC để commit Transaction
> SET PROJECT "GoGuide"

# Client 1
# Sửa thất bại, vì giá trị của PROJECT đã bị Client 2 sửa đổi
> EXEC
(nil)
> GET PROJECT
"GoGuide"
```

Tuy nhiên, nếu **WATCH** và **Transaction** nằm trong cùng một Session, và thao tác sửa đổi Key được **WATCH** theo dõi xảy ra bên trong Transaction, thì Transaction này vẫn có thể được thực thi thành công (issue liên quan: [Hiệu ứng khác nhau khi lệnh WATCH gặp lệnh MULTI](https://github.com/Snailclimb/JavaGuide/issues/1714)).

Sửa Key được WATCH theo dõi bên trong Transaction:

```bash
> SET PROJECT "JavaGuide"
OK
> WATCH PROJECT
OK
> MULTI
OK
> SET PROJECT "JavaGuide1"
QUEUED
> SET PROJECT "JavaGuide2"
QUEUED
> SET PROJECT "JavaGuide3"
QUEUED
> EXEC
1) OK
2) OK
3) OK
127.0.0.1:6379> GET PROJECT
"JavaGuide3"
```

Sửa Key được WATCH theo dõi bên ngoài Transaction:

```bash
> SET PROJECT "JavaGuide"
OK
> WATCH PROJECT
OK
> SET PROJECT "JavaGuide2"
OK
> MULTI
OK
> GET USER
QUEUED
> EXEC
(nil)
```

Giới thiệu liên quan trên trang chủ Redis tại [https://redis.io/topics/transactions](https://redis.io/topics/transactions) như sau:

![Redis Transaction](https://oss.javaguide.cn/github/javaguide/database/redis/redis-transactions.png)

### Redis Transaction có hỗ trợ tính nguyên tử không?

Transaction của Redis khác với Transaction của cơ sở dữ liệu quan hệ mà chúng ta thường hiểu. Chúng ta biết rằng Transaction có bốn đặc tính lớn: **1. Tính nguyên tử (Atomicity)**, **2. Tính cô lập (Isolation)**, **3. Tính bền vững (Durability)**, **4. Tính nhất quán (Consistency)**.

1. **Tính nguyên tử (Atomicity)**: Transaction là đơn vị thực thi nhỏ nhất, không được phép phân tách. Tính nguyên tử của Transaction đảm bảo các thao tác hoặc hoàn thành tất cả, hoặc hoàn toàn không có tác dụng;
2. **Tính cô lập (Isolation)**: Khi truy cập cơ sở dữ liệu đồng thời, Transaction của một người dùng không bị các Transaction khác can thiệp, giữa các Transaction đồng thời thì cơ sở dữ liệu là độc lập;
3. **Tính bền vững (Durability)**: Sau khi một Transaction được commit, những thay đổi của nó đối với dữ liệu trong cơ sở dữ liệu là bền vững, ngay cả khi cơ sở dữ liệu gặp sự cố thì cũng không bị ảnh hưởng;
4. **Tính nhất quán (Consistency)**: Trước và sau khi thực thi Transaction, dữ liệu giữ nguyên trạng thái nhất quán, nhiều Transaction đọc cùng một dữ liệu sẽ cho kết quả giống nhau.

Redis Transaction trong trường hợp gặp lỗi khi chạy, ngoài các lệnh bị lỗi trong quá trình thực thi, các lệnh khác vẫn thực thi bình thường. Hơn nữa, Redis Transaction không hỗ trợ thao tác rollback (hoàn tác). Vì vậy, Redis Transaction thực chất không đáp ứng tính nguyên tử.

Trang chủ Redis cũng giải thích lý do không hỗ trợ rollback. Nói đơn giản là các nhà phát triển Redis cho rằng không cần thiết hỗ trợ rollback, như vậy đơn giản, tiện lợi hơn và hiệu năng tốt hơn. Nhà phát triển Redis cho rằng ngay cả khi lệnh thực thi bị lỗi thì cũng nên được phát hiện trong quá trình phát triển chứ không phải trong môi trường production.

![Tại sao Redis không hỗ trợ rollback](https://oss.javaguide.cn/github/javaguide/database/redis/redis-rollback.png)

**Issue liên quan**:

- [issue#452: Về vấn đề Redis Transaction không đáp ứng tính nguyên tử](https://github.com/Snailclimb/JavaGuide/issues/452).
- [Issue#491: Về việc Redis không có Transaction rollback?](https://github.com/Snailclimb/JavaGuide/issues/491).

### Redis Transaction có hỗ trợ tính bền vững không?

Một điểm khác biệt quan trọng giữa Redis và Memcached là Redis hỗ trợ Persistence (Lưu trữ bền vững), hơn nữa hỗ trợ 3 phương thức Persistence:

- Snapshot (RDB);
- Append-only file (AOF);
- Persistence hỗn hợp RDB và AOF (mới có từ Redis 4.0).

So với RDB Persistence, AOF Persistence có tính thời gian thực tốt hơn. Trong file cấu hình của Redis có ba phương thức AOF Persistence khác nhau (chiến lược `fsync`), lần lượt là:

```bash
appendfsync always    #Mỗi khi có dữ liệu bị sửa đổi, main thread trực tiếp gọi fsync để đồng bộ file AOF (flush xuống đĩa), sau khi fsync hoàn thành mới trả về. always do main thread thực thi chứ không phải background thread, làm giảm nghiêm trọng hiệu năng của Redis
appendfsync everysec  #Mỗi giây gọi hàm fsync một lần để đồng bộ file AOF
appendfsync no        #Để hệ điều hành quyết định khi nào đồng bộ, thường là 30 giây một lần
```

Khi chiến lược `fsync` của AOF Persistence là no hoặc everysec đều có thể xảy ra mất dữ liệu. Với always thì về cơ bản có thể đáp ứng yêu cầu về tính bền vững, nhưng hiệu năng quá kém, trong phát triển thực tế sẽ không sử dụng.

Vì vậy, tính bền vững của Redis Transaction cũng không thể đảm bảo được.

### Giải quyết các khiếm khuyết của Redis Transaction như thế nào?

Redis bắt đầu hỗ trợ thực thi Lua script từ phiên bản 2.6, tính năng của nó rất giống với Transaction. Chúng ta có thể dùng Lua script để thực thi hàng loạt nhiều lệnh Redis, các lệnh Redis này sẽ được gửi đến máy chủ Redis và thực thi hoàn tất trong một lần, giảm đáng kể chi phí mạng.

Một đoạn Lua script có thể được xem như một lệnh để thực thi, trong quá trình thực thi một đoạn Lua script sẽ không có script hay lệnh Redis nào khác được thực thi đồng thời, đảm bảo thao tác không bị lệnh khác xen vào hoặc làm phiền.

Tuy nhiên, nếu Lua script gặp lỗi khi chạy và kết thúc giữa chừng, các lệnh sau đó sẽ không được thực thi. Hơn nữa, các lệnh đã thực thi trước khi lỗi xảy ra không thể bị hủy bỏ, không thể đạt được hiệu ứng nguyên tử giống như việc thực thi thất bại trong cơ sở dữ liệu quan hệ có thể rollback. Vì vậy, **nói một cách nghiêm ngặt, việc dùng Lua script để thực thi hàng loạt lệnh Redis thực tế cũng không hoàn toàn đáp ứng tính nguyên tử.**

Nếu muốn tất cả các lệnh trong Lua script đều được thực thi, phải đảm bảo cú pháp câu lệnh và các lệnh đều đúng.

Ngoài ra, Redis 7.0 đã bổ sung tính năng [Redis functions](https://redis.io/docs/latest/develop/programmability/functions-intro/), bạn có thể xem Redis functions như một loại script mạnh hơn Lua.

## ⭐️Tối ưu hiệu năng Redis (Quan trọng)

Ngoài nội dung giới thiệu dưới đây, xin giới thiệu thêm hai bài viết hay:

- [Redis của bạn thực sự chậm đi rồi sao? Tối ưu hiệu năng như thế nào - Alibaba Developer](https://mp.weixin.qq.com/s/nNEuYw0NlYGhuKKKKoWfcQ).
- [Tổng hợp các nguyên nhân thường gặp khiến Redis bị block - JavaGuide](https://javaguide.cn/database/redis/redis-common-blocking-problems-summary.html).

### Sử dụng thao tác hàng loạt để giảm truyền tải mạng

Việc thực thi một lệnh Redis có thể được đơn giản hóa thành 4 bước sau:

1. Gửi lệnh;
2. Lệnh vào hàng đợi;
3. Thực thi lệnh;
4. Trả về kết quả.

Trong đó, tổng thời gian tiêu tốn của bước 1 và bước 4 được gọi là **Round Trip Time (RTT, thời gian khứ hồi)**, tức là thời gian dữ liệu truyền tải trên mạng.

Sử dụng thao tác hàng loạt có thể giảm số lần truyền tải mạng, từ đó giảm hiệu quả chi phí mạng, giảm đáng kể RTT.

Ngoài ra, ngoài việc giảm RTT, chi phí socket I/O của một lần gửi lệnh cũng khá cao (liên quan đến chuyển đổi ngữ cảnh, có các system call `read()` và `write()`), thao tác hàng loạt còn có thể giảm chi phí socket I/O. Điều này được đề cập trong phần giới thiệu về pipeline của trang chủ: <https://redis.io/docs/manual/pipelining/>.

#### Lệnh thao tác hàng loạt nguyên bản

Trong Redis có một số lệnh nguyên bản hỗ trợ thao tác hàng loạt, ví dụ:

- `MGET` (lấy giá trị của một hoặc nhiều key chỉ định), `MSET` (đặt giá trị cho một hoặc nhiều key chỉ định),
- `HMGET` (lấy giá trị của một hoặc nhiều field chỉ định trong Hash chỉ định), `HMSET` (đặt đồng thời một hoặc nhiều cặp field-value vào Hash chỉ định),
- `SADD` (thêm một hoặc nhiều phần tử vào Set chỉ định)
- ……

Tuy nhiên, trong giải pháp Redis Cluster phân mảnh do Redis cung cấp, việc sử dụng các lệnh thao tác hàng loạt nguyên bản này có thể tồn tại một số vấn đề nhỏ cần giải quyết. Ví dụ như `MGET` không thể đảm bảo tất cả các key đều nằm trên cùng một **hash slot**, `MGET` có thể vẫn cần nhiều lần truyền tải mạng, thao tác nguyên tử cũng không thể đảm bảo được. Tuy nhiên, so với thao tác không hàng loạt, vẫn có thể tiết kiệm khá nhiều số lần truyền tải mạng.

Các bước đơn giản hóa của toàn bộ quá trình như sau (thường do Redis client triển khai, không cần chúng ta tự triển khai thủ công):

1. Tìm tất cả các hash slot tương ứng với key;
2. Lần lượt gửi yêu cầu `MGET` đến các Redis node tương ứng để lấy dữ liệu;
3. Chờ tất cả các yêu cầu thực thi xong, tổ hợp lại dữ liệu kết quả, giữ thứ tự nhất quán với thứ tự key của tham số đầu vào, sau đó trả về kết quả.

Nếu muốn giải quyết vấn đề truyền tải mạng nhiều lần này, cách thường dùng là tự duy trì mối quan hệ giữa key và slot. Tuy nhiên cách này không linh hoạt lắm, tuy mang lại cải thiện hiệu năng nhưng cũng làm tăng tính phức tạp của hệ thống.

> Redis Cluster không sử dụng Consistent Hashing mà áp dụng **phân vùng theo hash slot**, mỗi cặp key-value đều thuộc về một **hash slot**. Khi client gửi yêu cầu lệnh, trước tiên cần dựa vào key để tìm hash slot tương ứng theo công thức tính toán ở trên, sau đó tra cứu mối quan hệ ánh xạ giữa hash slot và node, là có thể tìm được Redis node mục tiêu.
>
> Tôi đã giới thiệu chi tiết nội dung phần này về Redis Cluster trong bài viết [Giải thích chi tiết Redis Cluster (trả phí)](https://javaguide.cn/database/redis/redis-cluster.html), ai quan tâm có thể xem qua.

#### pipeline

Đối với các lệnh không hỗ trợ thao tác hàng loạt, chúng ta có thể dùng **pipeline** để đóng gói một loạt lệnh Redis thành một nhóm, các lệnh Redis này sẽ được gửi đến máy chủ Redis trong một lần, chỉ cần một lần truyền tải mạng. Tuy nhiên, cần chú ý kiểm soát **số lượng phần tử** của một lần thao tác hàng loạt (ví dụ dưới 500, thực tế còn liên quan đến số byte của phần tử), tránh lượng dữ liệu truyền tải trên mạng quá lớn.

Giống như các lệnh thao tác hàng loạt nguyên bản `MGET`, `MSET` và các lệnh khác, pipeline khi sử dụng trên Redis Cluster cũng tồn tại một số vấn đề nhỏ. Nguyên nhân tương tự, không thể đảm bảo tất cả các key đều nằm trên cùng một **hash slot**. Nếu muốn sử dụng, client cần tự duy trì mối quan hệ giữa key và slot.

Lệnh thao tác hàng loạt nguyên bản và pipeline có sự khác biệt, khi sử dụng cần chú ý:

- Lệnh thao tác hàng loạt nguyên bản là thao tác nguyên tử, pipeline là thao tác không nguyên tử.
- pipeline có thể đóng gói các lệnh khác nhau, lệnh thao tác hàng loạt nguyên bản thì không.
- Lệnh thao tác hàng loạt nguyên bản được hỗ trợ triển khai ở phía server của Redis, còn pipeline cần sự triển khai chung của cả server và client.

Nhân tiện bổ sung thêm so sánh giữa pipeline và Redis Transaction:

- Transaction là thao tác nguyên tử, pipeline là thao tác không nguyên tử. Hai Transaction khác nhau sẽ không chạy đồng thời, còn pipeline có thể được thực thi đồng thời theo cách xen kẽ.
- Mỗi lệnh trong Redis Transaction đều cần gửi đến server, còn Pipeline chỉ cần gửi một lần, số lần yêu cầu ít hơn.

> Transaction có thể được xem như một thao tác nguyên tử, nhưng thực chất không đáp ứng tính nguyên tử. Khi chúng ta nói đến thao tác nguyên tử trong Redis, chủ yếu là chỉ thao tác này (ví dụ Transaction, Lua script) sẽ không bị các thao tác khác (ví dụ Transaction khác, Lua script) làm phiền, chứ không thể đảm bảo hoàn toàn rằng tất cả các lệnh ghi trong thao tác này hoặc đều được thực thi hoặc đều không được thực thi. Nguyên nhân chủ yếu cũng là vì Redis không hỗ trợ thao tác rollback.

![](https://oss.javaguide.cn/github/javaguide/database/redis/redis-pipeline-vs-transaction.png)

Ngoài ra, pipeline không phù hợp để thực thi một loạt lệnh có quan hệ phụ thuộc về thứ tự. Ví dụ, bạn cần dùng kết quả của lệnh trước đó cho các lệnh tiếp theo, pipeline không thể đáp ứng nhu cầu này. Đối với loại nhu cầu này, chúng ta có thể sử dụng **Lua script**.

#### Lua script

Lua script cũng hỗ trợ thao tác hàng loạt nhiều lệnh. Một đoạn Lua script có thể được xem như một lệnh để thực thi, có thể được coi là **thao tác nguyên tử**. Nghĩa là, trong quá trình thực thi một đoạn Lua script sẽ không có script hay lệnh Redis nào khác được thực thi đồng thời, đảm bảo thao tác không bị lệnh khác xen vào hoặc làm phiền, đây là điều mà pipeline không có được.

Hơn nữa, trong Lua script hỗ trợ một số xử lý logic đơn giản, ví dụ như dùng lệnh để đọc giá trị và xử lý trong Lua script, đây cũng là điều mà pipeline không có được.

Tuy nhiên, Lua script vẫn tồn tại những khiếm khuyết sau:

- Nếu Lua script gặp lỗi khi chạy và kết thúc giữa chừng, các thao tác sau đó sẽ không được tiến hành, nhưng các thao tác ghi đã xảy ra trước đó sẽ không bị hủy bỏ, vì vậy ngay cả khi sử dụng Lua script cũng không thể đạt được tính nguyên tử giống như rollback của cơ sở dữ liệu.
- Trong Redis Cluster, thao tác nguyên tử của Lua script cũng không thể đảm bảo được, nguyên nhân tương tự là không thể đảm bảo tất cả các key đều nằm trên cùng một **hash slot**.

### Vấn đề nhiều key hết hạn cùng lúc

Tôi đã đề cập ở phần trước: đối với key hết hạn, Redis áp dụng chiến lược **xóa định kỳ + xóa trì hoãn/lazy deletion**.

Trong quá trình thực thi xóa định kỳ, nếu đột nhiên gặp một lượng lớn key hết hạn, yêu cầu của client phải chờ thread của tác vụ dọn dẹp key hết hạn định kỳ thực thi xong, vì thread tác vụ định kỳ này được thực thi trong main thread của Redis. Điều này dẫn đến yêu cầu của client không được xử lý kịp thời, tốc độ phản hồi sẽ khá chậm.

**Giải quyết như thế nào?** Dưới đây là hai phương pháp thường gặp:

1. Đặt thời gian hết hạn ngẫu nhiên cho key.
2. Bật lazy-free (xóa trì hoãn/giải phóng trễ). Tính năng lazy-free được Redis đưa vào từ phiên bản 4.0, nghĩa là để Redis áp dụng cách bất đồng bộ để giải phóng trễ bộ nhớ mà key sử dụng, giao thao tác này cho một sub-thread riêng xử lý, tránh block main thread.

Theo cá nhân tôi, bất kể có bật lazy-free hay không, chúng ta đều nên đặt thời gian hết hạn ngẫu nhiên cho key.

### Redis bigkey (Key lớn)

#### bigkey là gì?

Nói đơn giản, nếu value tương ứng với một key chiếm dụng bộ nhớ khá lớn, thì key đó có thể được xem là bigkey. Cụ thể bao nhiêu mới được coi là lớn? Có một tiêu chuẩn tham khảo không hoàn toàn chính xác:

- Value kiểu String vượt quá 1MB
- Value kiểu phức hợp (List, Hash, Set, Sorted Set, v.v.) chứa số phần tử vượt quá 5000 (tuy nhiên, đối với value kiểu phức hợp, không nhất thiết chứa càng nhiều phần tử thì chiếm dụng càng nhiều bộ nhớ).

![Tiêu chuẩn xác định bigkey](https://oss.javaguide.cn/github/javaguide/database/redis/bigkey-criterion.png)

#### bigkey được tạo ra như thế nào? Có tác hại gì?

bigkey thường được tạo ra do những nguyên nhân sau:

- Thiết kế chương trình không hợp lý, ví dụ trực tiếp dùng kiểu String để lưu dữ liệu nhị phân của file lớn.
- Không cân nhắc kỹ quy mô dữ liệu của nghiệp vụ, ví dụ khi sử dụng kiểu tập hợp không tính đến việc dữ liệu tăng nhanh.
- Không kịp thời dọn dẹp dữ liệu rác, ví dụ trong Hash tồn đọng nhiều cặp key-value vô dụng.

bigkey ngoài việc tiêu tốn nhiều bộ nhớ và băng thông hơn, còn gây ảnh hưởng khá lớn đến hiệu năng.

Trong bài viết [Tổng hợp các nguyên nhân thường gặp khiến Redis bị block](./redis-common-blocking-problems-summary.md) chúng tôi đã đề cập: key lớn còn gây ra vấn đề block. Cụ thể, chủ yếu thể hiện ở ba khía cạnh sau:

1. Client bị block do timeout: Do Redis thực thi lệnh bằng single thread, khi thao tác với key lớn sẽ khá tốn thời gian, sẽ block Redis, từ góc nhìn của client thì rất lâu không có phản hồi.
2. Block mạng: Mỗi lần lấy key lớn tạo ra lưu lượng mạng khá lớn, nếu một key có kích thước 1 MB, mỗi giây truy cập 1000 lần, thì mỗi giây sẽ tạo ra lưu lượng 1000MB, điều này là thảm họa đối với máy chủ có card mạng gigabit thông thường.
3. Block worker thread: Nếu dùng del để xóa key lớn, sẽ block worker thread, như vậy không thể xử lý các lệnh tiếp theo.

Vấn đề block do key lớn gây ra còn ảnh hưởng tiếp đến đồng bộ master-slave và mở rộng Cluster.

Tổng kết lại, các vấn đề tiềm ẩn do key lớn gây ra là rất nhiều, chúng ta nên cố gắng tránh để tồn tại bigkey trong Redis.

#### Phát hiện bigkey như thế nào?

**1. Sử dụng tham số `--bigkeys` có sẵn của Redis để tìm kiếm.**

```bash
# redis-cli -p 6379 --bigkeys

# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

[00.00%] Biggest string found so far '"ballcat:oauth:refresh_auth:f6cdb384-9a9d-4f2f-af01-dc3f28057c20"' with 4437 bytes
[00.00%] Biggest list   found so far '"my-list"' with 17 items

-------- summary -------

Sampled 5 keys in the keyspace!
Total key length in bytes is 264 (avg len 52.80)

Biggest   list found '"my-list"' has 17 items
Biggest string found '"ballcat:oauth:refresh_auth:f6cdb384-9a9d-4f2f-af01-dc3f28057c20"' has 4437 bytes

1 lists with 17 items (20.00% of keys, avg size 17.00)
0 hashs with 0 fields (00.00% of keys, avg size 0.00)
4 strings with 4831 bytes (80.00% of keys, avg size 1207.75)
0 streams with 0 entries (00.00% of keys, avg size 0.00)
0 sets with 0 members (00.00% of keys, avg size 0.00)
0 zsets with 0 members (00.00% of keys, avg size 0.00
```

Từ kết quả chạy của lệnh này, chúng ta có thể thấy: lệnh này sẽ quét (Scan) tất cả các key trong Redis, sẽ có một chút ảnh hưởng đến hiệu năng của Redis. Hơn nữa, cách này chỉ có thể tìm ra top 1 bigkey của mỗi kiểu cấu trúc dữ liệu (kiểu dữ liệu String chiếm bộ nhớ lớn nhất, kiểu dữ liệu phức hợp chứa nhiều phần tử nhất). Tuy nhiên, một key có nhiều phần tử không có nghĩa là chiếm dụng nhiều bộ nhớ, cần dựa vào tình huống nghiệp vụ cụ thể để phán đoán thêm.

Khi thực thi lệnh này trên môi trường production, để giảm ảnh hưởng đến Redis, cần chỉ định tham số `-i` để kiểm soát tần suất quét. `redis-cli -p 6379 --bigkeys -i 3` nghĩa là trong quá trình quét, thời gian nghỉ sau mỗi lần quét là 3 giây.

**2. Sử dụng lệnh SCAN có sẵn của Redis**

Lệnh `SCAN` có thể trả về các key khớp theo một pattern và số lượng nhất định. Sau khi lấy được key, có thể dùng các lệnh như `STRLEN`, `HLEN`, `LLEN` để trả về độ dài hoặc số lượng phần tử của nó.

| Cấu trúc dữ liệu | Lệnh   | Độ phức tạp | Kết quả (tương ứng với key)     |
| ---------------- | ------ | ----------- | ------------------------------- |
| String           | STRLEN | O(1)        | Độ dài của giá trị chuỗi        |
| Hash             | HLEN   | O(1)        | Số lượng field trong Hash       |
| List             | LLEN   | O(1)        | Số lượng phần tử của List       |
| Set              | SCARD  | O(1)        | Số lượng phần tử của Set        |
| Sorted Set       | ZCARD  | O(1)        | Số lượng phần tử của Sorted Set |

Đối với kiểu tập hợp còn có thể dùng lệnh `MEMORY USAGE` (Redis 4.0+), lệnh này trả về không gian bộ nhớ mà cặp key-value chiếm dụng.

**3. Dùng công cụ mã nguồn mở để phân tích file RDB.**

Thông qua phân tích file RDB để tìm ra big key. Tiền đề của phương án này là Redis của bạn áp dụng RDB Persistence.

Trên mạng có sẵn code/công cụ có thể dùng trực tiếp:

- [redis-rdb-tools](https://github.com/sripathikrishnan/redis-rdb-tools): Công cụ viết bằng Python dùng để phân tích file snapshot RDB của Redis.
- [rdb_bigkeys](https://github.com/weiyanwei412/rdb_bigkeys): Công cụ viết bằng Go dùng để phân tích file snapshot RDB của Redis, hiệu năng tốt hơn.

**4. Dùng dịch vụ phân tích Redis của cloud công cộng.**

Nếu bạn dùng dịch vụ Redis của cloud công cộng, có thể xem liệu nó có cung cấp tính năng phân tích key hay không (thường đều có).

Ở đây lấy Redis của Alibaba Cloud làm ví dụ, nó hỗ trợ phân tích, phát hiện bigkey theo thời gian thực, địa chỉ tài liệu: <https://www.alibabacloud.com/help/zh/apsaradb-for-redis/latest/use-the-real-time-key-statistics-feature>.

![Phân tích Key của Alibaba Cloud](https://oss.javaguide.cn/github/javaguide/database/redis/aliyun-key-analysis.png)

#### Xử lý bigkey như thế nào?

Các phương pháp xử lý và tối ưu bigkey thường gặp như sau (các phương pháp này có thể kết hợp sử dụng):

- **Chia nhỏ bigkey**: Chia một bigkey thành nhiều key nhỏ. Ví dụ, chia một Hash có số lượng field lên đến hàng vạn thành nhiều Hash theo một chiến lược nhất định (ví dụ hash lần hai).
- **Dọn dẹp thủ công**: Redis 4.0+ có thể dùng lệnh `UNLINK` để xóa bất đồng bộ một hoặc nhiều key chỉ định. Dưới Redis 4.0 có thể cân nhắc dùng lệnh `SCAN` kết hợp lệnh `DEL` để xóa theo từng đợt.
- **Áp dụng cấu trúc dữ liệu phù hợp**: Ví dụ, dữ liệu nhị phân của file không dùng String để lưu, dùng HyperLogLog để thống kê UV của trang, dùng Bitmap để lưu thông tin trạng thái (0/1).
- **Bật lazy-free (xóa trì hoãn/giải phóng trễ)**: Tính năng lazy-free được Redis đưa vào từ phiên bản 4.0, nghĩa là để Redis áp dụng cách bất đồng bộ để giải phóng trễ bộ nhớ mà key sử dụng, giao thao tác này cho một sub-thread riêng xử lý, tránh block main thread.

### Redis hotkey (Key nóng)

#### hotkey là gì?

Nếu một key có số lần truy cập khá nhiều và rõ ràng nhiều hơn các key khác, thì key đó có thể được xem là **hotkey (Key nóng)**. Ví dụ, khi số yêu cầu xử lý mỗi giây của một Redis instance đạt 5000 lần, mà trong đó một key nào đó có số lần truy cập mỗi giây lên đến 2000 lần, thì key đó có thể được xem là hotkey.

Nguyên nhân xuất hiện hotkey chủ yếu là do dữ liệu hot nào đó có số truy cập tăng đột biến, như sự kiện hot search lớn, sản phẩm tham gia flash sale.

#### hotkey có tác hại gì?

Xử lý hotkey sẽ chiếm dụng nhiều CPU và băng thông, có thể ảnh hưởng đến việc xử lý bình thường các yêu cầu khác của Redis instance. Ngoài ra, nếu số yêu cầu truy cập hotkey đột ngột vượt quá khả năng xử lý của Redis, Redis sẽ bị sập trực tiếp. Trong tình huống này, lượng lớn yêu cầu sẽ đổ dồn xuống database phía sau, có thể khiến database bị crash.

Vì vậy, hotkey rất có thể trở thành điểm nghẽn hiệu năng của hệ thống, cần tối ưu riêng cho nó để đảm bảo tính sẵn sàng cao và tính ổn định của hệ thống.

#### Phát hiện hotkey như thế nào?

**1. Sử dụng tham số `--hotkeys` có sẵn của Redis để tìm kiếm.**

Phiên bản Redis 4.0.3 đã bổ sung tham số `hotkeys`, tham số này có thể trả về số lần được truy cập của tất cả các key.

Tiền đề để sử dụng phương án này là tham số `maxmemory-policy` của Redis Server được đặt thành thuật toán LFU, nếu không sẽ xuất hiện lỗi như dưới đây.

```bash
# redis-cli -p 6379 --hotkeys

# Scanning the entire keyspace to find hot keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

Error: ERR An LFU maxmemory policy is not selected, access frequency not tracked. Please note that when switching between policies at runtime LRU and LFU data will take some time to adjust.
```

Trong Redis có hai loại thuật toán LFU:

1. **volatile-lfu (least frequently used)**: Chọn dữ liệu ít được sử dụng nhất từ tập dữ liệu đã đặt thời gian hết hạn (`server.db[i].expires`) để loại bỏ.
2. **allkeys-lfu (least frequently used)**: Khi bộ nhớ không đủ để chứa dữ liệu ghi mới, trong không gian key, loại bỏ key ít được sử dụng nhất.

Dưới đây là ví dụ trong file cấu hình `redis.conf`:

```properties
# Sử dụng chiến lược volatile-lfu
maxmemory-policy volatile-lfu

# Hoặc sử dụng chiến lược allkeys-lfu
maxmemory-policy allkeys-lfu
```

Cần chú ý là, lệnh tham số `hotkeys` cũng sẽ làm tăng mức tiêu thụ CPU và bộ nhớ của Redis instance (quét toàn cục), vì vậy cần thận trọng khi sử dụng.

**2. Sử dụng lệnh `MONITOR`.**

Lệnh `MONITOR` là một cách do Redis cung cấp để xem tất cả các thao tác của Redis theo thời gian thực, có thể dùng để giám sát tạm thời tình hình thao tác của Redis instance, bao gồm đọc, ghi, xóa và các thao tác khác.

Do lệnh này có ảnh hưởng khá lớn đến hiệu năng của Redis, nên cấm bật `MONITOR` trong thời gian dài (trong môi trường production nên thận trọng khi sử dụng lệnh này).

```bash
# redis-cli
127.0.0.1:6379> MONITOR
OK
1683638260.637378 [0 172.17.0.1:61516] "ping"
1683638267.144236 [0 172.17.0.1:61518] "smembers" "mySet"
1683638268.941863 [0 172.17.0.1:61518] "smembers" "mySet"
1683638269.551671 [0 172.17.0.1:61518] "smembers" "mySet"
1683638270.646256 [0 172.17.0.1:61516] "ping"
1683638270.849551 [0 172.17.0.1:61518] "smembers" "mySet"
1683638271.926945 [0 172.17.0.1:61518] "smembers" "mySet"
1683638274.276599 [0 172.17.0.1:61518] "smembers" "mySet2"
1683638276.327234 [0 172.17.0.1:61518] "smembers" "mySet"
```

Khi xảy ra tình huống khẩn cấp, chúng ta có thể chọn thời điểm thích hợp để thực thi ngắn gọn lệnh `MONITOR` và chuyển hướng output vào file, sau khi tắt lệnh `MONITOR`, thông qua việc phân loại phân tích các yêu cầu trong file là có thể tìm ra hotkey trong khoảng thời gian đó.

**3. Dùng dự án mã nguồn mở.**

Dự án [hotkey](https://gitee.com/jd-platform-opensource/hotkey) của JD Retail không chỉ hỗ trợ phát hiện hotkey mà còn hỗ trợ xử lý hotkey.

![hotkey do JD Retail open source](https://oss.javaguide.cn/github/javaguide/database/redis/jd-hotkey.png)

**4. Dựa vào tình hình nghiệp vụ để ước tính trước.**

Có thể dựa vào tình hình nghiệp vụ để ước tính trước một số hotkey, ví dụ dữ liệu sản phẩm tham gia hoạt động flash sale, v.v. Tuy nhiên, chúng ta không thể ước tính trước sự xuất hiện của tất cả hotkey, ví dụ sự kiện tin tức nóng đột ngột, v.v.

**5. Ghi chép và phân tích trong code nghiệp vụ.**

Thêm logic tương ứng trong code nghiệp vụ để ghi chép và phân tích tình hình truy cập key. Tuy nhiên, cách này sẽ làm tăng độ phức tạp của code nghiệp vụ, thường cũng không được áp dụng.

**6. Dùng dịch vụ phân tích Redis của cloud công cộng.**

Nếu bạn dùng dịch vụ Redis của cloud công cộng, có thể xem liệu nó có cung cấp tính năng phân tích key hay không (thường đều có).

Ở đây lấy Redis của Alibaba Cloud làm ví dụ, nó hỗ trợ phân tích, phát hiện hotkey theo thời gian thực, địa chỉ tài liệu: <https://www.alibabacloud.com/help/zh/apsaradb-for-redis/latest/use-the-real-time-key-statistics-feature>.

![Phân tích Key của Alibaba Cloud](https://oss.javaguide.cn/github/javaguide/database/redis/aliyun-key-analysis.png)

#### Giải quyết hotkey như thế nào?

Các phương pháp xử lý và tối ưu hotkey thường gặp như sau (các phương pháp này có thể kết hợp sử dụng):

- **Read-write separation (đọc ghi tách biệt)**: Master node xử lý yêu cầu ghi, slave node xử lý yêu cầu đọc.
- **Sử dụng Redis Cluster**: Lưu trữ phân tán dữ liệu hot trên nhiều Redis node.
- **Cache hai cấp**: hotkey được xử lý theo cách cache hai cấp, lưu một bản hotkey vào bộ nhớ cục bộ của JVM (có thể dùng Caffeine).

Ngoài các phương pháp này, nếu bạn dùng dịch vụ Redis của cloud công cộng, còn có thể chú ý đến các giải pháp có sẵn mà nó cung cấp.

Ở đây lấy Redis của Alibaba Cloud làm ví dụ, nó hỗ trợ tối ưu vấn đề Key nóng thông qua tính năng cache truy vấn qua proxy (Proxy Query Cache).

![Tối ưu vấn đề Key nóng bằng Proxy Query Cache của Alibaba Cloud](https://oss.javaguide.cn/github/javaguide/database/redis/aliyun-hotkey-proxy-query-cache.png)

### Lệnh truy vấn chậm (Slow Query)

#### Tại sao có lệnh truy vấn chậm?

Chúng ta biết rằng việc thực thi một lệnh Redis có thể được đơn giản hóa thành 4 bước sau:

1. Gửi lệnh;
2. Lệnh vào hàng đợi;
3. Thực thi lệnh;
4. Trả về kết quả.

Thống kê truy vấn chậm của Redis là thời gian tiêu tốn của bước thực thi lệnh, lệnh truy vấn chậm chính là những lệnh có thời gian thực thi lâu.

Tại sao Redis lại có lệnh truy vấn chậm?

Phần lớn các lệnh trong Redis đều có độ phức tạp thời gian O(1), nhưng cũng có một số ít lệnh có độ phức tạp thời gian O(n), ví dụ:

- `KEYS *`: Trả về tất cả các key khớp với quy tắc.
- `HGETALL`: Trả về tất cả các cặp key-value trong một Hash.
- `LRANGE`: Trả về các phần tử trong phạm vi chỉ định của List.
- `SMEMBERS`: Trả về tất cả các phần tử trong Set.
- `SINTER`/`SUNION`/`SDIFF`: Tính giao/hợp/hiệu của nhiều Set.
- ……

Do độ phức tạp thời gian của các lệnh này là O(n), đôi khi còn quét toàn bộ bảng, khi n tăng lên thì thời gian thực thi cũng càng dài. Tuy nhiên, các lệnh này không phải nhất định không được sử dụng, nhưng cần xác định rõ giá trị N. Ngoài ra, nếu có nhu cầu duyệt thì có thể dùng `HSCAN`, `SSCAN`, `ZSCAN` để thay thế.

Ngoài các lệnh có độ phức tạp thời gian O(n) này có thể dẫn đến truy vấn chậm, còn có một số lệnh có độ phức tạp thời gian có thể trên O(N), ví dụ:

- `ZRANGE`/`ZREVRANGE`: Trả về tất cả các phần tử trong phạm vi ranking chỉ định của Sorted Set chỉ định. Độ phức tạp thời gian là O(log(n)+m), n là số lượng tất cả phần tử, m là số lượng phần tử trả về, khi m và n khá lớn thì độ phức tạp thời gian O(n) nhỏ hơn.
- `ZREMRANGEBYRANK`/`ZREMRANGEBYSCORE`: Loại bỏ tất cả các phần tử trong phạm vi ranking chỉ định/phạm vi score chỉ định của Sorted Set. Độ phức tạp thời gian là O(log(n)+m), n là số lượng tất cả phần tử, m là số lượng phần tử bị xóa, khi m và n khá lớn thì độ phức tạp thời gian O(n) nhỏ hơn.
- ……

#### Tìm lệnh truy vấn chậm như thế nào?

Redis cung cấp một tính năng **Slow Log (nhật ký truy vấn chậm)** tích hợp sẵn, chuyên dùng để ghi lại các lệnh có thời gian thực thi vượt quá ngưỡng chỉ định. Điều này rất hữu ích cho việc tìm kiếm nút thắt hiệu năng, tìm ra thao tác "chậm" khiến Redis bị block, nguyên lý tương tự như nhật ký truy vấn chậm của MySQL.

Trong file `redis.conf`, chúng ta có thể dùng tham số `slowlog-log-slower-than` để đặt ngưỡng cho lệnh tốn thời gian, và dùng tham số `slowlog-max-len` để đặt số bản ghi tối đa của lệnh tốn thời gian.

Khi máy chủ Redis phát hiện lệnh có thời gian thực thi vượt quá ngưỡng `slowlog-log-slower-than`, sẽ ghi lệnh đó vào slow log, điểm này tương tự như việc MySQL ghi lại câu lệnh truy vấn chậm. Khi slow log vượt quá số bản ghi tối đa đã đặt, Redis sẽ lần lượt loại bỏ các lệnh thực thi sớm nhất.

⚠️ Chú ý: Do slow log chiếm dụng một không gian bộ nhớ nhất định, nếu đặt số bản ghi tối đa quá lớn, có thể dẫn đến vấn đề chiếm dụng bộ nhớ quá cao.

Cấu hình mặc định của `slowlog-log-slower-than` và `slowlog-max-len` như sau (có thể tự sửa đổi):

```properties
# The following time is expressed in microseconds, so 1000000 is equivalent
# to one second. Note that a negative number disables the slow log, while
# a value of zero forces the logging of every command.
slowlog-log-slower-than 10000

# There is no limit to this length. Just be aware that it will consume memory.
# You can reclaim memory used by the slow log with SLOWLOG RESET.
slowlog-max-len 128
```

Ngoài việc sửa file cấu hình, bạn cũng có thể trực tiếp đặt thông qua lệnh `CONFIG`:

```bash
# Lệnh thực thi tốn hơn 10000 micro giây (tức 10 mili giây) sẽ được ghi lại
CONFIG SET slowlog-log-slower-than 10000
# Chỉ giữ lại 128 lệnh tốn thời gian gần nhất
CONFIG SET slowlog-max-len 128
```

Lấy nội dung của slow log rất đơn giản, trực tiếp dùng lệnh `SLOWLOG GET` là được.

```bash
127.0.0.1:6379> SLOWLOG GET #Truy vấn slow log
 1) 1) (integer) 5
   2) (integer) 1684326682
   3) (integer) 12000
   4) 1) "KEYS"
      2) "*"
   5) "172.17.0.1:61152"
   6) ""
  // ...
```

Mỗi entry trong slow log được cấu thành từ sáu giá trị sau:

1. **ID duy nhất**: Định danh duy nhất của entry nhật ký.
2. **Timestamp**: Unix timestamp tại thời điểm lệnh thực thi xong.
3. **Thời gian tiêu tốn (Duration)**: Thời gian tiêu tốn để thực thi lệnh, đơn vị là **micro giây**.
4. **Lệnh và tham số (Command)**: Lệnh cụ thể đã thực thi và mảng tham số của nó.
5. **Thông tin client (Client IP:Port)**: Địa chỉ và port của client thực thi lệnh.
6. **Tên client (Client Name)**: Nếu client đã đặt tên (CLIENT SETNAME).

Lệnh `SLOWLOG GET` mặc định trả về 10 lệnh truy vấn chậm gần nhất, bạn cũng có thể tự chỉ định số lượng lệnh truy vấn chậm trả về bằng `SLOWLOG GET N`.

Dưới đây là các lệnh khác khá thường dùng liên quan đến truy vấn chậm:

```bash
# Trả về số lượng lệnh truy vấn chậm
127.0.0.1:6379> SLOWLOG LEN
(integer) 128
# Xóa sạch lệnh truy vấn chậm
127.0.0.1:6379> SLOWLOG RESET
OK
```

### Redis Memory Fragmentation (Phân mảnh bộ nhớ)

**Câu hỏi liên quan**:

1. Memory Fragmentation là gì? Tại sao lại có Redis Memory Fragmentation?
2. Làm thế nào để dọn dẹp Redis Memory Fragmentation?

**Đáp án tham khảo**: [Giải thích chi tiết Redis Memory Fragmentation](https://javaguide.cn/database/redis/redis-memory-fragmentation.html).

## ⭐️Vấn đề Redis trong production (Quan trọng)

### Cache Penetration (Xuyên thủng Cache)

#### Cache Penetration là gì?

Nói đơn giản, Cache Penetration là khi key của lượng lớn yêu cầu không hợp lý, **hoàn toàn không tồn tại trong Cache, cũng không tồn tại trong database**. Điều này dẫn đến các yêu cầu này đi thẳng xuống database, hoàn toàn không qua tầng Cache, gây áp lực khổng lồ cho database, có thể trực tiếp khiến database bị sập bởi nhiều yêu cầu như vậy.

![Cache Penetration](https://oss.javaguide.cn/github/javaguide/database/redis/redis-cache-penetration.png)

Ví dụ: Một hacker nào đó cố tình tạo ra một số key bất hợp pháp để phát động lượng lớn yêu cầu, dẫn đến lượng lớn yêu cầu đổ xuống database, kết quả là trong database cũng không tra được dữ liệu tương ứng. Nghĩa là các yêu cầu này cuối cùng đều đổ xuống database, gây áp lực khổng lồ cho database.

#### Có những cách giải quyết nào?

Cơ bản nhất là trước tiên phải kiểm tra tham số thật tốt, một số yêu cầu tham số không hợp lệ thì trực tiếp ném ra thông tin lỗi trả về cho client. Ví dụ id database truy vấn không được nhỏ hơn 0, khi định dạng email truyền vào không đúng thì trực tiếp trả về thông báo lỗi cho client, v.v.

**1) Cache key không hợp lệ**

Nếu cả Cache và database đều không tra được dữ liệu của một key nào đó, thì ghi một bản vào Redis và đặt thời gian hết hạn, lệnh cụ thể như sau: `SET key value EX 10086`. Cách này có thể giải quyết tình huống key yêu cầu không thay đổi thường xuyên, nếu hacker tấn công ác ý, mỗi lần tạo key yêu cầu khác nhau, sẽ khiến Redis cache lượng lớn key không hợp lệ. Rõ ràng, phương án này không thể giải quyết triệt để vấn đề. Nếu nhất định phải dùng cách này để giải quyết vấn đề xuyên thủng, hãy cố gắng đặt thời gian hết hạn của key không hợp lệ ngắn một chút, ví dụ 1 phút.

Ngoài ra, nói thêm một chút, thông thường chúng ta thiết kế key như sau: `tên_bảng:tên_cột:tên_khóa_chính:giá_trị_khóa_chính`.

Nếu thể hiện bằng code Java thì đại khái như sau:

```java
public Object getObjectInclNullById(Integer id) {
    // Lấy dữ liệu từ Cache
    Object cacheValue = cache.get(id);
    // Cache trống
    if (cacheValue == null) {
        // Lấy từ database
        Object storageValue = storage.get(key);
        // Cache đối tượng null
        cache.set(key, storageValue);
        // Nếu dữ liệu lưu trữ là null, cần đặt thời gian hết hạn (300 giây)
        if (storageValue == null) {
            // Bắt buộc phải đặt thời gian hết hạn, nếu không có nguy cơ bị tấn công
            cache.expire(key, 60 * 5);
        }
        return storageValue;
    }
    return cacheValue;
}
```

**2) Bloom Filter (Bộ lọc Bloom)**

Bloom Filter là một cấu trúc dữ liệu rất kỳ diệu, thông qua nó chúng ta có thể phán đoán rất tiện lợi xem một dữ liệu cho trước có tồn tại trong khối dữ liệu khổng lồ hay không. Chúng ta có thể xem nó như một cấu trúc dữ liệu gồm hai phần: vector nhị phân (hay nói cách khác là mảng bit) và một loạt hàm ánh xạ ngẫu nhiên (hàm hash). So với các cấu trúc dữ liệu thường dùng như List, Map, Set, nó chiếm ít không gian hơn và hiệu quả cao hơn, nhưng nhược điểm là kết quả nó trả về mang tính xác suất, chứ không phải hoàn toàn chính xác. Về mặt lý thuyết, số phần tử thêm vào tập hợp càng nhiều thì khả năng dương tính giả càng lớn. Hơn nữa, dữ liệu lưu trong Bloom Filter không dễ xóa.

![Sơ đồ nguyên lý đơn giản của Bloom Filter](https://oss.javaguide.cn/github/javaguide/cs-basics/algorithms/bloom-filter-simple-schematic-diagram.png)

Bloom Filter sử dụng một mảng bit khá lớn để lưu tất cả dữ liệu, mỗi phần tử trong mảng chỉ chiếm 1 bit, và mỗi phần tử chỉ có thể là 0 hoặc 1 (đại diện cho false hoặc true), đây cũng là cốt lõi giúp Bloom Filter tiết kiệm bộ nhớ. Tính như vậy thì việc xin cấp phát một mảng bit 100 vạn phần tử chỉ chiếm 1000000Bit / 8 = 125000 Byte = 125000/1024 KB ≈ 122KB không gian.

![Mảng bit](https://oss.javaguide.cn/github/javaguide/cs-basics/algorithms/bloom-filter-bit-table.png)

Cụ thể làm như sau: lưu tất cả các giá trị yêu cầu có thể tồn tại vào Bloom Filter, khi yêu cầu của người dùng gửi đến, trước tiên phán đoán xem giá trị yêu cầu người dùng gửi có tồn tại trong Bloom Filter hay không. Nếu không tồn tại, trực tiếp trả về thông tin lỗi tham số yêu cầu cho client, nếu tồn tại thì mới đi vào quy trình bên dưới.

Sơ đồ quy trình xử lý Cache sau khi thêm Bloom Filter như sau:

![Sơ đồ quy trình xử lý Cache sau khi thêm Bloom Filter](https://oss.javaguide.cn/github/javaguide/database/redis/redis-cache-penetration-bloom-filter.png)

Giới thiệu chi tiết hơn về Bloom Filter có thể xem bài viết gốc này của tôi: [Không hiểu Bloom Filter? Một bài viết giúp bạn hiểu rõ ràng!](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html), cực kỳ khuyến nghị.

**3) Rate limiting (giới hạn tần suất) interface**

Dựa vào người dùng hoặc IP để rate limit interface, đối với hành vi truy cập bất thường quá thường xuyên, còn có thể áp dụng cơ chế blacklist, ví dụ đưa IP bất thường vào blacklist.

Cache Breakdown và Cache Avalanche được đề cập phía sau đều có thể kết hợp với rate limiting interface để giải quyết, vì mấu chốt của các vấn đề này đều là có nhiều yêu cầu đổ xuống database khiến database chịu áp lực quá lớn.

Phương án cụ thể của rate limiting có thể tham khảo bài viết này: [Giải thích chi tiết rate limiting dịch vụ](https://javaguide.cn/high-availability/limit-request.html).

### Cache Breakdown (Thủng Cache)

#### Cache Breakdown là gì?

Trong Cache Breakdown, key của yêu cầu tương ứng với **dữ liệu hot**, dữ liệu này **tồn tại trong database, nhưng không tồn tại trong Cache (thường là do dữ liệu đó trong Cache đã hết hạn)**. Điều này có thể dẫn đến lượng lớn yêu cầu tức thời đánh thẳng vào database, gây áp lực khổng lồ cho database, có thể trực tiếp khiến database bị sập bởi nhiều yêu cầu như vậy.

![Cache Breakdown](https://oss.javaguide.cn/github/javaguide/database/redis/redis-cache-breakdown.png)

Ví dụ: Trong quá trình diễn ra flash sale, dữ liệu của một sản phẩm flash sale nào đó trong Cache đột nhiên hết hạn, điều này dẫn đến lượng lớn yêu cầu tức thời đối với sản phẩm đó đổ thẳng xuống database, gây áp lực khổng lồ cho database.

#### Có những cách giải quyết nào?

1. **Không bao giờ hết hạn** (không khuyến nghị): Đặt dữ liệu hot không bao giờ hết hạn hoặc thời gian hết hạn tương đối dài.
2. **Warm-up (làm nóng) trước** (khuyến nghị): Làm nóng trước dữ liệu hot, lưu vào Cache và đặt thời gian hết hạn hợp lý, ví dụ dữ liệu trong kịch bản flash sale không hết hạn trước khi flash sale kết thúc.
3. **Thêm khóa** (tùy tình huống): Sau khi Cache mất hiệu lực, thông qua việc đặt mutex lock để đảm bảo chỉ có một yêu cầu truy vấn database và cập nhật Cache.

#### Cache Penetration và Cache Breakdown khác nhau như thế nào?

Trong Cache Penetration, key của yêu cầu không tồn tại trong Cache, cũng không tồn tại trong database.

Trong Cache Breakdown, key của yêu cầu tương ứng với **dữ liệu hot**, dữ liệu này **tồn tại trong database, nhưng không tồn tại trong Cache (thường là do dữ liệu đó trong Cache đã hết hạn)**.

### Cache Avalanche (Sụp đổ Cache)

#### Cache Avalanche là gì?

Tôi thấy cái tên Cache Avalanche đặt khá thú vị, haha.

Thực tế, Cache Avalanche mô tả chính là một kịch bản đơn giản như vậy: **Cache mất hiệu lực trên diện rộng trong cùng một thời điểm, dẫn đến lượng lớn yêu cầu đều đổ thẳng xuống database, gây áp lực khổng lồ cho database.** Giống như tuyết lở, với thế cuốn phăng tất cả, áp lực của database có thể tưởng tượng được, có thể trực tiếp bị sập bởi nhiều yêu cầu như vậy.

Ngoài ra, dịch vụ Cache bị sập cũng dẫn đến hiện tượng Cache Avalanche, khiến tất cả yêu cầu đều đổ xuống database.

![Cache Avalanche](https://oss.javaguide.cn/github/javaguide/database/redis/redis-cache-avalanche.png)

Ví dụ: Lượng lớn dữ liệu trong Cache hết hạn trong cùng một thời điểm, lúc này đột nhiên có lượng lớn yêu cầu cần truy cập các dữ liệu đã hết hạn này. Điều này dẫn đến lượng lớn yêu cầu đổ thẳng xuống database, gây áp lực khổng lồ cho database.

#### Có những cách giải quyết nào?

**Đối với tình huống dịch vụ Redis không khả dụng**:

1. **Redis Cluster**: Áp dụng Redis Cluster, tránh trường hợp một máy gặp sự cố khiến toàn bộ dịch vụ Cache không thể sử dụng. Redis Cluster và Redis Sentinel là hai phương án triển khai Redis Cluster thường dùng nhất, giới thiệu chi tiết có thể tham khảo: [Giải thích chi tiết Redis Cluster (trả phí)](https://javaguide.cn/database/redis/redis-cluster.html).
2. **Cache đa cấp**: Đặt Cache đa cấp, ví dụ tổ hợp Cache hai cấp gồm Cache cục bộ + Redis Cache, khi Redis Cache gặp vấn đề, vẫn có thể lấy được một phần dữ liệu từ Cache cục bộ.

**Đối với tình huống lượng lớn Cache đồng thời mất hiệu lực**:

1. **Đặt thời gian hết hạn ngẫu nhiên** (tùy chọn): Đặt thời gian hết hạn ngẫu nhiên cho Cache, ví dụ thêm một giá trị ngẫu nhiên trên cơ sở thời gian hết hạn cố định, như vậy có thể tránh lượng lớn Cache đồng thời đến hạn, từ đó giảm rủi ro Cache Avalanche.
2. **Warm-up trước** (khuyến nghị): Làm nóng trước dữ liệu hot, lưu vào Cache và đặt thời gian hết hạn hợp lý, ví dụ dữ liệu trong kịch bản flash sale không hết hạn trước khi flash sale kết thúc.
3. **Chiến lược Cache vĩnh viễn** (tùy tình huống): Tuy thường không khuyến nghị đặt Cache không bao giờ hết hạn, nhưng đối với một số dữ liệu quan trọng và ít thay đổi, có thể cân nhắc chiến lược này.

#### Thực hiện warm-up Cache như thế nào?

Có hai cách warm-up Cache thường gặp:

1. Sử dụng scheduled task, ví dụ xxl-job, để kích hoạt định kỳ logic warm-up Cache, truy vấn dữ liệu hot trong database ra và lưu vào Cache.
2. Sử dụng message queue, ví dụ Kafka, để warm-up Cache một cách bất đồng bộ, gửi khóa chính hoặc ID của dữ liệu hot trong database vào message queue, sau đó dịch vụ Cache tiêu thụ dữ liệu trong message queue, dựa vào khóa chính hoặc ID để truy vấn database và cập nhật Cache.

#### Cache Avalanche và Cache Breakdown khác nhau như thế nào?

Cache Avalanche và Cache Breakdown khá giống nhau, nhưng nguyên nhân do Cache Avalanche gây ra là lượng lớn hoặc tất cả dữ liệu trong Cache mất hiệu lực, nguyên nhân do Cache Breakdown gây ra chủ yếu là một dữ liệu hot nào đó không tồn tại trong Cache (thường là do dữ liệu đó trong Cache đã hết hạn).

### Làm thế nào để đảm bảo tính nhất quán giữa Cache và database?

Tính nhất quán giữa Cache và database là một thách thức kỹ thuật khá phổ biến. Đưa Cache vào chủ yếu để nâng cao hiệu năng, giảm áp lực cho database, nhưng quả thực sẽ mang lại rủi ro dữ liệu không nhất quán. Tính nhất quán tuyệt đối thường đồng nghĩa với độ phức tạp hệ thống và chi phí hiệu năng cao hơn, vì vậy trong thực tế chúng ta thường dựa vào kịch bản nghiệp vụ để chọn chiến lược phù hợp, tìm điểm cân bằng giữa hiệu năng và tính nhất quán.

Dưới đây nói riêng về **Cache Aside Pattern (chế độ Cache bên cạnh)**. Đây là chiến lược đọc ghi Cache rất thường dùng, logic đọc ghi của nó như sau:

- **Thao tác đọc**:
  1. Trước tiên thử đọc dữ liệu từ Cache.
  2. Nếu Cache hit, trực tiếp trả về dữ liệu.
  3. Nếu Cache miss, truy vấn dữ liệu từ database, đặt dữ liệu tra được vào Cache và trả về dữ liệu.
- **Thao tác ghi**:
  1. Trước tiên cập nhật database.
  2. Sau đó trực tiếp xóa dữ liệu tương ứng trong Cache.

Minh họa như sau:

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-write.png)

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-read.png)

Nếu cập nhật database thành công, mà bước xóa Cache lại thất bại, nói đơn giản có hai phương án giải quyết:

1. **Rút ngắn thời gian hết hạn của Cache (TTL - Time To Live)** (không khuyến nghị, trị triệu chứng không trị tận gốc): Chúng ta rút ngắn thời gian hết hạn của dữ liệu Cache, như vậy Cache sẽ tải lại dữ liệu từ database. Ngoài ra, cách giải quyết này không áp dụng được cho kịch bản thao tác Cache trước rồi thao tác database sau.
2. **Thêm cơ chế retry cập nhật Cache** (thường dùng): Nếu dịch vụ Cache hiện không khả dụng dẫn đến xóa Cache thất bại, chúng ta cách một khoảng thời gian sẽ retry, số lần retry có thể tự định. Tuy nhiên, ở đây phù hợp hơn là đưa message queue vào để thực hiện retry bất đồng bộ, gửi message retry xóa Cache vào message queue, sau đó một consumer chuyên dụng sẽ retry cho đến khi thành công. Tuy có đưa thêm một message queue, nhưng lợi ích tổng thể mà nó mang lại vẫn cao hơn.

Bài viết liên quan khuyến nghị: [Vấn đề nhất quán giữa Cache và database, xem bài này là đủ - Water Drop and Silver Bullet](https://mp.weixin.qq.com/s?__biz=MzIyOTYxNDI5OA==&mid=2247487312&idx=1&sn=fa19566f5729d6598155b5c676eee62d&chksm=e8beb8e5dfc931f3e35655da9da0b61c79f2843101c130cf38996446975014f958a6481aacf1&scene=178&cur_album_id=1699766580538032128#rd).

### Những tình huống nào có thể khiến Redis bị block?

Các nguyên nhân thường gặp khiến Redis bị block gồm:

- Thực thi lệnh có độ phức tạp `O(n)` (như `KEYS *`, `HGETALL`, `LRANGE`, `SMEMBERS`, v.v.), khi lượng dữ liệu tăng lên dẫn đến thời gian thực thi quá dài.
- Khi thực thi lệnh `SAVE` để tạo RDB snapshot thì block đồng bộ main thread, còn `BGSAVE` thông qua `fork` tiến trình con để tránh block.
- Việc ghi log AOF được thực hiện trong main thread, có thể block các lệnh tiếp theo do ghi log sau khi thực thi lệnh.
- Khi AOF flush xuống đĩa (fsync), background thread đồng bộ xuống đĩa, áp lực đĩa lớn dẫn đến `fsync` bị block, từ đó block thao tác `write` của main thread, đặc biệt rõ ràng với cấu hình `appendfsync always` hoặc `everysec`.
- Trong quá trình rewrite AOF, khi thêm nội dung của rewrite buffer vào file AOF mới sẽ phát sinh block.
- Thao tác key lớn (string > 1MB hoặc phần tử kiểu phức hợp > 5000) dẫn đến client timeout, block mạng và block worker thread.
- Khi dùng `flushdb` hoặc `flushall` để xóa sạch database, liên quan đến việc xóa lượng lớn cặp key-value và giải phóng bộ nhớ, gây block main thread.
- Khi mở rộng/thu hẹp Cluster, việc di chuyển dữ liệu là thao tác đồng bộ, di chuyển key lớn dẫn đến cả hai đầu node bị block trong thời gian dài, có thể kích hoạt failover.
- Thiếu bộ nhớ kích hoạt Swap, hệ điều hành đổi bộ nhớ của Redis ra đĩa, hiệu năng đọc ghi giảm mạnh.
- Tiến trình khác chiếm dụng CPU quá mức dẫn đến throughput của Redis giảm.
- Vấn đề mạng như từ chối kết nối, độ trễ cao, soft interrupt của card mạng, v.v. dẫn đến Redis bị block.

Giới thiệu chi tiết có thể đọc bài viết này: [Tổng hợp các nguyên nhân thường gặp khiến Redis bị block](https://javaguide.cn/database/redis/redis-common-blocking-problems-summary.html).

## Redis Cluster (Cụm Redis)

**Redis Sentinel**:

1. Sentinel là gì? Có tác dụng gì?
2. Sentinel phát hiện node có offline hay không như thế nào? Sự khác nhau giữa subjective downtime (chủ quan) và objective downtime (khách quan)?
3. Sentinel thực hiện failover như thế nào?
4. Tại sao nên triển khai nhiều node sentinel (Sentinel Cluster)?
5. Sentinel chọn master mới như thế nào (cơ chế bầu chọn)?
6. Chọn Leader từ Sentinel Cluster như thế nào?
7. Sentinel có thể ngăn chặn split-brain không?

**Redis Cluster**:

1. Tại sao cần Redis Cluster? Giải quyết vấn đề gì? Có ưu thế gì?
2. Redis Cluster phân mảnh như thế nào?
3. Tại sao hash slot của Redis Cluster là 16384?
4. Làm thế nào để xác định key cho trước nên được phân vào hash slot nào?
5. Redis Cluster có hỗ trợ phân bổ lại hash slot không?
6. Trong thời gian mở rộng/thu hẹp Redis Cluster có thể cung cấp dịch vụ không?
7. Các node trong Redis Cluster giao tiếp với nhau như thế nào?

**Đáp án tham khảo**: [Giải thích chi tiết Redis Cluster (trả phí)](https://javaguide.cn/database/redis/redis-cluster.html).

## Quy phạm sử dụng Redis

Trong quá trình sử dụng Redis thực tế, chúng ta nên tuân thủ một số quy phạm thường gặp, ví dụ:

1. Sử dụng connection pool: Tránh tạo và đóng kết nối client thường xuyên.
2. Cố gắng không sử dụng lệnh O(n), khi dùng lệnh O(n) phải chú ý số lượng n: Các lệnh O(n) như `KEYS *`, `HGETALL`, `LRANGE`, `SMEMBERS`, `SINTER`/`SUNION`/`SDIFF` không phải không được sử dụng, nhưng cần xác định rõ giá trị n. Ngoài ra, nếu có nhu cầu duyệt thì có thể dùng `HSCAN`, `SSCAN`, `ZSCAN` để thay thế.
3. Sử dụng thao tác hàng loạt để giảm truyền tải mạng: Lệnh thao tác hàng loạt nguyên bản (ví dụ `MGET`, `MSET`, v.v.), pipeline, Lua script.
4. Cố gắng không sử dụng Redis Transaction: Tính năng mà Redis Transaction triển khai khá hạn chế, có thể dùng Lua script để thay thế.
5. Cấm bật monitor trong thời gian dài: Ảnh hưởng khá lớn đến hiệu năng.
6. Kiểm soát vòng đời của key: Tránh lưu quá nhiều dữ liệu ít được truy cập trong Redis.
7. ……

## Tham khảo

- 《Redis 开发与运维》(Phát triển và vận hành Redis)
- 《Redis 设计与实现》(Thiết kế và triển khai Redis)
- Redis Transactions: <https://redis.io/docs/manual/transactions/>
- What is Redis Pipeline: <https://buildatscale.tech/what-is-redis-pipeline/>
- Một bài viết giải thích chi tiết việc phát hiện và xử lý BigKey, HotKey trong Redis: <https://mp.weixin.qq.com/s/FPYE1B839_8Yk1-YSiW-1Q>
- Khám phá hướng giải quyết và phương pháp cho vấn đề Bigkey: <https://mp.weixin.qq.com/s/Sej7D9TpdAobcCmdYdMIyA>
- Hướng dẫn xử lý toàn diện vấn đề độ trễ của Redis: <https://mp.weixin.qq.com/s/mIc6a9mfEGdaNDD3MmfFsg>

<!-- @include: @article-footer.snippet.md -->
