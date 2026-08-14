---
title: Giải thích chi tiết 3 chiến lược đọc/ghi Cache thường dùng
description: So sánh chuyên sâu ba chiến lược đọc/ghi Cache gồm Cache Aside, Read/Write Through và Write Behind, kèm sơ đồ trình tự chi tiết, phân tích vấn đề tính nhất quán và giải pháp cấp production. Bắt buộc phải có khi thực chiến Redis!
category: Cơ sở dữ liệu
tag:
  - Redis
head:
  - - meta
    - name: keywords
      content: Chiến lược đọc ghi Cache,Cache Aside,Read Through,Write Through,Write Behind,Write Back,Cache Consistency,Vô hiệu hóa Cache,Bypass Cache,Read/Write Through,Ghi Cache bất đồng bộ,Chiến lược Cache Redis,Chiến lược cập nhật Cache
---

Tôi thấy rất nhiều bạn ghi trong CV là "**sử dụng thành thạo Cache**", nhưng khi được hỏi về "**3 chiến lược đọc/ghi Cache thường dùng**" thì lại ngơ ngác không biết gì.

Theo tôi, nguyên nhân của vấn đề này là khi học Redis, chúng ta có thể chỉ viết đơn giản vài Demo chứ không hề quan tâm đến chiến lược đọc/ghi của Cache, hoặc căn bản là không biết đến chuyện này.

Tuy nhiên, việc nắm vững 3 chiến lược đọc/ghi Cache phổ biến sẽ rất có ích cho việc sử dụng Cache trong công việc thực tế cũng như khi bị hỏi về Cache trong phỏng vấn!

**Ba mô hình được giới thiệu dưới đây đều có ưu và nhược điểm riêng, không tồn tại mô hình tốt nhất, hãy dựa vào kịch bản nghiệp vụ cụ thể để chọn chế độ đọc/ghi Cache phù hợp.**

### Cache Aside Pattern (Mô hình Cache bên cạnh/Bypass Cache)

Đây là mô hình **thường dùng nhất, kinh điển nhất** trong phát triển hằng ngày, gần như là chuẩn mực thực tế (de facto standard) của các giải pháp Cache trong ứng dụng Internet, đặc biệt phù hợp với kịch bản nghiệp vụ **đọc nhiều ghi ít**.

Mô hình này được gọi là **"bên cạnh" (Aside)** là vì **thao tác ghi của ứng dụng hoàn toàn đi vòng qua Cache, thao tác trực tiếp với cơ sở dữ liệu**.

Ứng dụng đóng vai trò "người chỉ huy" của luồng dữ liệu, cần đồng thời duy trì hai nguồn dữ liệu là Cache và DB.

Dưới đây chúng ta cùng xem các bước đọc/ghi Cache trong mô hình chiến lược này.

**Thao tác ghi:**

1. Ứng dụng **cập nhật DB trước**.
2. Sau đó **xóa trực tiếp dữ liệu tương ứng trong Cache**.

Tôi vẽ đơn giản một hình để giúp mọi người hiểu các bước ghi.

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-write.png)

**Thao tác đọc:**

1. Ứng dụng đọc dữ liệu từ Cache trước.
2. Nếu trúng (Hit), trả về trực tiếp.
3. Nếu không trúng (Miss), đọc dữ liệu từ DB, sau khi đọc thành công, **ghi dữ liệu ngược lại vào Cache**, rồi trả về.

Tôi vẽ đơn giản một hình để giúp mọi người hiểu các bước đọc.

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-read.png)

Nếu bạn chỉ mới hiểu những nội dung trên thì vẫn còn xa mới đủ, chúng ta còn phải nắm rõ nguyên lý bên trong.

Ví dụ, người phỏng vấn rất có thể sẽ hỏi thêm:

1. Tại sao thao tác ghi là "cập nhật DB trước, xóa Cache sau"? Có thể đảo ngược thứ tự không?
2. Vậy "cập nhật DB trước, xóa Cache sau" có tuyệt đối an toàn không?
3. Tại sao là "xóa Cache" chứ không phải "cập nhật Cache"?

Tiếp theo tôi sẽ lần lượt phân tích và giải đáp những câu hỏi này.

**1. Tại sao thao tác ghi là "cập nhật DB trước, xóa Cache sau"? Có thể đảo ngược thứ tự không?**

**Đáp:** Tuyệt đối không thể. Nếu "xóa Cache trước, cập nhật DB sau", trong điều kiện concurrency cao sẽ phát sinh vấn đề bất nhất dữ liệu kinh điển.

- **Phân tích trình tự (Request A ghi, Request B đọc):**
  1. Request A: Xóa dữ liệu trong Cache trước.
  2. Request B: Lúc này phát hiện Cache trống, bèn đọc **giá trị cũ** từ DB và chuẩn bị ghi vào Cache.
  3. Request A: Ghi **giá trị mới** vào DB.
  4. Request B: Ghi **giá trị cũ** đã đọc trước đó vào Cache.
- **Kết quả:** Trong DB là giá trị mới, còn trong Cache là giá trị cũ, dữ liệu bất nhất.

**2. Vậy "cập nhật DB trước, xóa Cache sau" có tuyệt đối an toàn không?**

**Đáp:** Cũng không tuyệt đối an toàn! Vì cách này cũng có thể gây ra vấn đề **dữ liệu giữa cơ sở dữ liệu và Cache bất nhất**.

- **Phân tích trình tự (Request A đọc, Request B ghi):**
  1. Request A: Cache không trúng, đọc được **giá trị cũ** từ DB.
  2. Request B: Nhanh chóng hoàn tất cập nhật DB và xóa Cache.
  3. Request A: Ghi **giá trị cũ** đã lấy trước đó vào Cache.
- **Kết quả:** Trong DB là giá trị mới, trong Cache lại là giá trị cũ.
- **Tại sao xác suất cực kỳ nhỏ?** Vấn đề này về bản chất là vấn đề trình tự concurrency: chỉ cần trong khoảng thời gian "đọc DB → ghi Cache" đúng lúc có một request ghi hoàn tất cập nhật DB thì mới có thể phát sinh bất nhất. Trong phần lớn nghiệp vụ, khoảng thời gian này tương đối ngắn, hơn nữa còn phải "đụng xe" concurrency với request ghi, nên xác suất xảy ra không cao, nhưng tuyệt đối không phải là không thể.

**3. Tại sao là "xóa Cache" chứ không phải "cập nhật Cache"?**

- **Chi phí hiệu năng:** Thao tác ghi thường chỉ cập nhật một phần trường của đối tượng, nếu vì "cập nhật Cache" mà phải truy vấn hoặc tính toán lại toàn bộ đối tượng Cache thì chi phí có thể rất lớn. Ngược lại, "xóa" là một thao tác nhẹ (lightweight).
- **Tư tưởng Lazy Loading:** Thao tác "xóa" tuân theo nguyên tắc lazy loading. Chỉ khi dữ liệu được cần đến thật sự (được đọc) vào lần tiếp theo, mới kích hoạt việc tải từ DB và ghi vào Cache, tránh được những lần cập nhật Cache vô ích.
- **An toàn concurrency:** "Cập nhật Cache" trong điều kiện concurrency cao có thể xảy ra vấn đề sai lệch thứ tự cập nhật, khiến xác suất phát sinh dữ liệu bẩn lớn hơn.

Tất nhiên, tất cả những điều trên đều dựa trên một tiền đề quan trọng: dữ liệu chúng ta Cache phải có thể được tái tạo một cách xác định từ cơ sở dữ liệu, và về mặt nghiệp vụ có thể chấp nhận được sự bất nhất dữ liệu trong khoảng thời gian cực ngắn từ lúc "xóa Cache" đến lần "đọc và nạp lại" tiếp theo.

Bây giờ chúng ta cùng phân tích **các khiếm khuyết của Cache Aside Pattern**.

**Khiếm khuyết 1: Dữ liệu của request đầu tiên chắc chắn không có trong Cache**

Cách giải quyết: Đối với dữ liệu nóng (hot data) có lượng truy cập khổng lồ, có thể thực hiện Cache Warm-up (làm nóng Cache) khi hệ thống khởi động hoặc vào giờ thấp điểm.

**Khiếm khuyết 2: Nếu thao tác ghi khá thường xuyên, dữ liệu trong Cache sẽ bị xóa liên tục, ảnh hưởng đến tỷ lệ trúng Cache.**

Cách giải quyết:

- Kịch bản yêu cầu dữ liệu cơ sở dữ liệu và Cache nhất quán mạnh: Khi cập nhật DB thì đồng thời cập nhật Cache, nhưng cần thêm một lock/distributed lock để đảm bảo không có vấn đề an toàn luồng khi cập nhật Cache.
- Kịch bản có thể chấp nhận dữ liệu cơ sở dữ liệu và Cache bất nhất trong thời gian ngắn: Khi cập nhật DB thì đồng thời cập nhật Cache, nhưng đặt cho Cache một thời gian hết hạn tương đối ngắn (ví dụ 1 phút), như vậy có thể đảm bảo rằng dù dữ liệu bất nhất thì ảnh hưởng cũng khá nhỏ.

### Read/Write Through Pattern (Đọc/ghi xuyên suốt)

Trong mô hình này, ứng dụng xem **Cache là nơi lưu trữ chính, duy nhất**. Tất cả yêu cầu đọc và ghi đều đánh trực tiếp vào Cache, còn bản thân dịch vụ Cache chịu trách nhiệm đồng bộ dữ liệu với DB.

**Trong suốt (transparent)** đối với ứng dụng, lập trình viên ứng dụng không cần quan tâm đến sự tồn tại của DB.

Chiến lược đọc/ghi Cache này chắc hẳn các bạn cũng nhận thấy rất hiếm gặp trong quá trình phát triển hằng ngày. Gác lại vấn đề hiệu năng, nguyên nhân phần lớn là vì Redis — Cache phân tán mà chúng ta thường dùng — bản thân nó không cung cấp chức năng để Cache ghi dữ liệu vào DB, mà cần chúng ta tự triển khai ở phía nghiệp vụ hoặc trong middleware.

**Ghi (Write Through):**

- Kiểm tra Cache trước, nếu không tồn tại trong Cache thì cập nhật DB trực tiếp.
- Nếu tồn tại trong Cache thì cập nhật Cache trước, sau đó dịch vụ Cache tự cập nhật DB. Chỉ khi cả Cache và DB đều ghi thành công mới trả về thành công cho tầng trên.

Tôi vẽ đơn giản một hình để giúp mọi người hiểu các bước ghi.

![](https://oss.javaguide.cn/github/javaguide/database/redis/write-through.png)

**Đọc (Read Through):**

- Ứng dụng đọc dữ liệu từ Cache.
- Nếu trúng, trả về trực tiếp.
- Nếu không trúng, **bản thân dịch vụ Cache** chịu trách nhiệm tải dữ liệu từ DB, sau khi tải thành công thì ghi vào chính nó trước, rồi trả về cho ứng dụng.

Tôi vẽ đơn giản một hình để giúp mọi người hiểu các bước đọc.

![](https://oss.javaguide.cn/github/javaguide/database/redis/read-through.png)

Read-Through thực chất chỉ là sự đóng gói trên nền Cache-Aside. Trong Cache-Aside, khi xảy ra yêu cầu đọc, nếu dữ liệu tương ứng không tồn tại trong Cache thì client tự chịu trách nhiệm ghi dữ liệu vào Cache, còn Read Through thì do chính dịch vụ Cache ghi vào Cache, điều này trong suốt đối với client.

Từ góc độ triển khai, Read-Through về bản chất là đẩy logic "đọc Miss → đọc DB → nạp lại vào Cache" trong Cache-Aside xuống bên trong dịch vụ Cache, trong suốt đối với client.

Giống như Cache Aside, Read-Through cũng có vấn đề dữ liệu của request đầu tiên chắc chắn không có trong Cache, đối với hot data có thể nạp sẵn vào Cache trước.

### Write Behind Pattern (Ghi Cache bất đồng bộ)

Write Behind Pattern (cũng thường được gọi là Write-Back) rất giống với Read/Write Through Pattern, cả hai đều do dịch vụ Cache chịu trách nhiệm đọc/ghi Cache và DB.

Tuy nhiên, hai mô hình lại có điểm khác biệt rất lớn: **Read/Write Through cập nhật Cache và DB đồng bộ, còn Write Behind thì chỉ cập nhật Cache, không trực tiếp cập nhật DB, mà chuyển sang cập nhật DB theo cách bất đồng bộ, theo lô (batch).**

**Thao tác ghi (Write Behind):**

1. Ứng dụng ghi dữ liệu vào Cache, sau đó **trả về ngay lập tức**.
2. Dịch vụ Cache đưa thao tác ghi này vào một hàng đợi (queue).
3. Thông qua một luồng/tác vụ bất đồng bộ độc lập, các thao tác ghi trong hàng đợi được ghi vào DB **theo lô, có gộp lại (merge)**.

Mô hình này mang đến thách thức cho tính nhất quán dữ liệu (ví dụ: dữ liệu trong Cache chưa kịp ghi lại vào DB thì hệ thống đã gặp sự cố), vì vậy không phù hợp với các kịch bản cần tính nhất quán mạnh (như giao dịch, tồn kho).

Tuy nhiên, đặc tính bất đồng bộ và theo lô của nó mang lại **hiệu năng ghi không gì sánh bằng**. Nó được ứng dụng rộng rãi trong nhiều hệ thống hiệu năng cao:

- **Cơ chế InnoDB Buffer Pool của MySQL:** Việc sửa đổi dữ liệu được hoàn tất trong Buffer Pool trên bộ nhớ trước, sau đó được luồng nền (background thread) ghi ra đĩa một cách bất đồng bộ.
- **Page Cache của hệ điều hành:** Việc ghi tệp cũng được ghi vào bộ nhớ trước, sau đó hệ điều hành mới ghi ra đĩa bất đồng bộ.
- **Kịch bản đếm tần suất cao:** Đối với các dữ liệu như lượt xem bài viết, lượt thích bài đăng — cho phép bất nhất dữ liệu trong thời gian ngắn nhưng thao tác ghi cực kỳ thường xuyên — có thể cộng dồn nhanh trong Redis trước, sau đó thông qua tác vụ định kỳ (scheduled task) để đồng bộ ngược về cơ sở dữ liệu một cách bất đồng bộ.

<!-- @include: @article-footer.snippet.md -->
