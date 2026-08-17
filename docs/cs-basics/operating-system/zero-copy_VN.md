---
title: "Giải thích chi tiết về Zero-copy: mmap, sendfile và splice"
description: "Tổng hợp câu hỏi phỏng vấn zero-copy tần suất cao, làm rõ đường đi của bản copy, chuyển ngữ cảnh, SG-DMA, Java NIO, và các tình huống ứng dụng của Kafka và RocketMQ cho read/write truyền thống, mmap, sendfile, splice."
category: Kiến thức nền tảng máy tính
tag:
  - Hệ điều hành
  - Linux
  - Hiệu năng cao
head:
  - - meta
    - name: keywords
      content: zero-copy,mmap,sendfile,splice,SG-DMA,Page Cache,Java NIO,FileChannel,transferTo,Kafka,RocketMQ,câu hỏi phỏng vấn hệ điều hành
---

Trong phỏng vấn có một kiểu dẫn dắt rất quen thuộc: đầu tiên hỏi bạn "Tại sao Kafka nhanh" "Tại sao RocketMQ chịu được tình trạng tích tụ hàng", khi bạn trả lời được ghi tuần tự (sequential write), Page Cache, zero-copy, người phỏng vấn thuận theo đó mà đào sâu: "Zero-copy tiết kiệm chính xác những lần copy nào?" "mmap và sendfile khác nhau thế nào?" "splice lại dùng để làm gì?"

Đến bước này, nhiều người bắt đầu né tránh (đánh thái cực quyền). Không ít người thuộc được câu "zero-copy là không đi qua user space", nhưng đếm cho rõ ràng được bốn lần copy, hai lần DMA, mấy lần chuyển ngữ cảnh thì không nhiều.

Bài viết này bắt đầu từ một lần gửi file: **I/O truyền thống copy bao nhiêu lần, chữ "không" (zero) trong zero-copy rốt cuộc tiết kiệm ở đâu, ba lộ trình mmap, sendfile, splice tương ứng tiết kiệm cái gì, và mỗi lộ trình phải trả cái giá gì.**

Trước khi bài viết chính thức bắt đầu, chúng ta cần chốt chuẩn tính toán (tính khẩu kính).

Khi phía sau nhắc đến "mấy lần copy, mấy lần chuyển đổi", mặc định tính theo mô hình đơn giản hóa dưới đây. Đổi tình huống, con số sẽ thay đổi:

- Tình huống là gửi một file thường qua TCP socket, và dữ liệu ban đầu không nằm trong Page Cache (cần thực sự đọc đĩa).
- Không liên quan đến các xử lý phải đụng vào dữ liệu trong user space như mã hóa TLS, nén, chuyển đổi định dạng.
- Thiết bị hỗ trợ DMA và scatter-gather phổ biến.
- "Số lần copy" được đếm chỉ tính riêng dữ liệu (payload), không bao gồm descriptor, metadata.
- "Chuyển ngữ cảnh" được nhắc đến ở dưới, nói chính xác là **chuyển đổi chế độ giữa user space và kernel space** (mỗi lần vào/ra hệ thống gọi tính là một lần), nó không giống với "chuyển ngữ cảnh thread" khi thread bị scheduler thay lên thay xuống; chỉ khi hệ thống gọi thực sự block, thread bị đẩy ra, mới có thêm chuyển ngữ cảnh thread xảy ra.

Nếu Page Cache trúng (hit), đi qua TLS, phần cứng không hỗ trợ SG-DMA, những con số này đều sẽ thay đổi. Giả định ở đây chỉ để làm rõ cơ chế, đừng coi con số là đáp án cố định trong mọi môi trường.

## read/write truyền thống rốt cuộc copy bao nhiêu lần

Trước tiên xem một tình huống phổ biến nhất: một giao diện tải file, phía server phải gửi file trên đĩa cho client qua socket đã được thiết lập sẵn. Cách viết trực tiếp nhất là một read cộng một write:

```c
while ((n = read(file_fd, buf, BUF_SIZE)) > 0)
    write(socket_fd, buf, n);
```

Nhìn thì chỉ có hai dòng, nhưng bên dưới lại làm việc không nhẹ nhàng gì. Với một lần hoàn chỉnh "đọc đĩa + gửi mạng", CPU và DMA phải vận chuyển tổng cộng bốn lượt dữ liệu, giữa user space và kernel space còn phải chuyển đổi qua lại bốn lần.

![Đường copy dữ liệu của read/write truyền thống: đĩa đến buffer nhân, kernel đến buffer user, user đến buffer Socket, Socket đến card mạng](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/zero-copy-traditional-read-write.png)

Tách hai dòng này ra xem, nửa read đã xảy ra những gì:

1. Tiến trình ứng dụng gọi read, phát ra hệ thống gọi, **ngữ cảnh chuyển từ user space sang kernel space** (lần chuyển thứ 1).
2. Bộ điều khiển DMA đọc dữ liệu từ đĩa vào buffer đọc của kernel (copy lần 1, DMA copy).
3. CPU copy dữ liệu trong buffer đọc của kernel vào buffer user (copy lần 2, CPU copy), **ngữ cảnh chuyển về user space** (lần chuyển thứ 2), read return.

Nửa write là đối xứng:

4. Tiến trình ứng dụng gọi write, phát ra hệ thống gọi, **ngữ cảnh chuyển sang kernel space** (lần chuyển thứ 3).
5. CPU copy dữ liệu trong buffer user vào buffer socket (copy lần 3, CPU copy).
6. DMA copy dữ liệu trong buffer socket vào card mạng (copy lần 4, DMA copy), **ngữ cảnh chuyển về user space** (lần chuyển thứ 4), write return.

Đếm lại: **4 lần chuyển chế độ, 4 lần copy dữ liệu**, trong đó 2 lần là DMA copy, 2 lần là CPU copy. (Nói nghiêm túc, sau khi `write` copy dữ liệu vào buffer gửi của socket thì thường đã return, việc xếp hàng, phân mảnh và gửi DMA của card mạng là do protocol stack thực hiện bất đồng bộ, không cần đợi DMA gửi xong thật sự mới chuyển về user space. Ở đây vẽ nó vào trong một lần gọi, chỉ để tính cho đủ số.)

Xen vào đây một chút về DMA (Direct Memory Access, truy cập bộ nhớ trực tiếp). Nó là khả năng do bộ điều khiển thiết bị hoặc DMA engine trong hệ thống cung cấp, có thể vận chuyển dữ liệu trực tiếp giữa thiết bị ngoại vi và bộ nhớ, gần như không cần CPU kè kè (trong phần cứng hiện đại nó thường được tích hợp trong bộ điều khiển thiết bị, SoC hoặc chipset, chưa chắc là một chip độc lập). Giao những việc "chân tay thuần túy" như đĩa đến buffer kernel, buffer socket đến card mạng cho nó, CPU có thể rảnh tay ra để tính việc khác, nên DMA copy không đốt CPU.

Thứ thực sự khó chịu là hai lần **CPU copy** kia. Dữ liệu từ buffer đọc của kernel copy sang buffer user, rồi từ buffer user copy nguyên xi trở lại buffer socket, vậy mà giao diện tải file của chúng ta hoàn toàn không hề đụng đến nội dung của nó, dữ liệu chỉ đi ngang qua user space để vòng một vòng. CPU suốt cả quá trình đang làm công việc vận chuyển vô nghĩa, cộng thêm chi phí lưu/khôi phục thanh ghi của bốn lần chuyển đổi. Trong tình huống đồng thời cao, file lớn, phần lãng phí này bị phóng đại lên rất rõ rệt.

Cái mà zero-copy muốn tiết kiệm, chính là phần này.

## Chữ "không" trong zero-copy, bỏ copy nào

Trước tiên sửa một hiểu lầm phổ biến: zero-copy không phải thật sự là không có một lần copy nào cả.

Trong mô hình "file không trúng Page Cache, rồi phát ra qua TCP" mà bài viết này thiết lập, dữ liệu vẫn phải trải qua hai đoạn vận chuyển DMA là đĩa đến bộ nhớ, bộ nhớ đến card mạng. **Zero-copy tiết kiệm được là việc CPU copy payload giữa các vùng nhớ trong bộ nhớ, đồng thời có thể giảm số lần chuyển đổi chế độ giữa user space và kernel space.** Đổi sang các tình huống như Page Cache đã trúng, thiết bị truy cập trực tiếp bộ nhớ bền vững, số lần vận chuyển cũng sẽ thay đổi.

Vậy nên định nghĩa chính xác hơn của zero-copy là: trong thao tác I/O khiến CPU không còn tham gia việc copy dữ liệu giữa các vùng nhớ, từ đó giảm số lần CPU copy và chuyển đổi user space/kernel space. Nó là tên gọi chung của một lớp kỹ thuật, ba lộ trình dưới đây đều đang xoay quanh việc "làm sao triệt tiêu CPU copy".

## Lộ trình một: mmap + write

Ý tưởng thứ nhất đến từ bộ nhớ ảo. Hệ điều hành hiện đại dùng địa chỉ ảo thay cho địa chỉ vật lý, ở đây có một đặc tính then chốt: **nhiều địa chỉ ảo có thể trỏ đến cùng một vùng bộ nhớ vật lý**.

mmap dùng chính điểm này. Chữ ký hàm của nó trông như thế này:

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

Trong đó fd là file descriptor cần map, length là độ dài map, offset là độ dịch chuyển của file. Sau khi gọi, buffer đọc của kernel và một đoạn địa chỉ ảo trong user space sẽ được map đến cùng một vùng bộ nhớ vật lý. Nói cách khác, buffer kernel và buffer user "chia sẻ" cùng một bản dữ liệu, không còn mỗi nơi giữ một bản nữa.

Thế là read + write ban đầu biến thành mmap + write. Ở đây trước tiên cần phá bỏ một hiểu lầm phổ biến: **bản thân lời gọi `mmap` chỉ thiết lập map từ file đến một đoạn địa chỉ ảo, không lập tức đọc file vào bộ nhớ**. Việc đọc đĩa thực sự xảy ra khi phía sau truy cập các trang map chưa được cư trú (resident), kích hoạt ngoại lệ thiếu trang (page fault), do kernel tải từng trang từ Page Cache (không có thì từ đĩa). Quy trình đại khái là:

1. Tiến trình ứng dụng gọi `mmap`, kernel thiết lập map từ file đến khoảng địa chỉ ảo, vào/ra kernel space mỗi lần một lượt, lời gọi return. Lúc này vẫn chưa có dữ liệu file nào được mang vào.
2. Phía sau truy cập đoạn map này (điển hình là coi nó làm nguồn dữ liệu của `write`), lần đầu gặp trang chưa cư trú thì kích hoạt ngoại lệ thiếu trang; nếu trong Page Cache không có trang đó, DMA đọc dữ liệu từ đĩa vào Page Cache (DMA copy).
3. Sau khi bảng trang (page table) thiết lập map xong, các trang Page Cache của kernel này đồng thời được map vào không gian địa chỉ user, hai bên chia sẻ cùng một bộ nhớ vật lý.
4. Ứng dụng gọi `write`, CPU copy phần dữ liệu này từ Page Cache của kernel vào buffer socket (CPU copy) — vì chia sẻ bộ nhớ vật lý nên tiết kiệm được lần CPU copy thừa "kernel đến user, rồi quay lại kernel" trong cách truyền thống.
5. DMA gửi dữ liệu trong buffer socket ra card mạng (DMA copy), `write` return.

![Đường copy dữ liệu của mmap + write: Page Cache và vùng map mmap chia sẻ bộ nhớ vật lý, rồi copy đến buffer Socket](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/zero-copy-mmap-write.png)

Tính sổ (cache miss, đi đường đầy đủ): đại khái **2 lần DMA + 1 lần CPU copy**; về chuyển đổi thì `mmap` một lần, `write` một lần, cộng thêm xử lý thiếu trang ở lần truy cập đầu tiên. So với cách truyền thống, mmap triệt tiêu được lần CPU copy "kernel đến user".

Cho nên "mmap + write thì cố định là 4 lần chuyển, 3 lần copy" chỉ có thể xem là mô hình đơn giản hóa để giảng dạy — Page Cache trúng hay không, thiếu trang xảy ra ở đâu, đều khiến con số thực tế dao động.

mmap còn có một lợi ích đi kèm: tiến trình user không cần phải duy trì thêm một buffer đọc user space trùng lặp với nội dung Page Cache, tiết kiệm được buffer phụ và bản copy này. Còn rốt cuộc tiết kiệm được bao nhiêu bộ nhớ vật lý, phụ thuộc vào cửa sổ xử lý, kích thước buffer và mô hình truy cập, không thể gộp chung mà nói "tiết kiệm phân nửa".

Tuy nhiên mmap không phải không có hố. Bản thân việc map có chi phí, thiết lập và gỡ bỏ bảng trang, xử lý ngoại lệ thiếu trang đều tốn thời gian, khi file rất nhỏ, số chi phí này chia nhau ra có thể còn chậm hơn read/write thẳng thừng, nên mmap phù hợp hơn với file lớn, đọc ghi lặp lại. Còn có một quả bom dễ nổ tinh vi hơn: nếu file bạn map bị một tiến trình khác cắt ngắn (truncate), rồi bạn đi truy cập đoạn map đã bị cắt đó, sẽ trực tiếp ăn một tín hiệu SIGBUS, chương trình sập ngay tại đó. Loại vấn đề này khi tra cứu trong môi trường sản xuất rất mệt, dùng mmap phải để tâm trong lòng.

## Lộ trình hai: sendfile

mmap tiết kiệm được một lần CPU copy, nhưng nó vẫn không chạy thoát khỏi hai loại hệ thống gọi `mmap` và `write`; nếu chỉ là gửi nguyên file đi, có thể dùng một hệ thống gọi để làm xong việc truyền dữ liệu trong kernel không?

sendfile do nhân Linux 2.1 giới thiệu chính là để làm việc này:

```c
ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
```

- in_fd: nguồn dữ liệu, phải là đối tượng hỗ trợ đọc kiểu mmap (thường là file thường), không thể là socket.
- out_fd: nơi dữ liệu đi, trước Linux 2.6.33 chỉ có thể là socket, sau đó có thể là file bất kỳ. Ràng buộc cụ thể phải gắn với phiên bản kernel để xem.
- offset: bắt đầu đọc từ vị trí nào của file, truyền NULL nghĩa là dùng offset hiện tại của file.
- count: truyền bao nhiêu byte.

Ngữ nghĩa của nó là: truyền dữ liệu trực tiếp giữa hai file descriptor, toàn bộ quá trình đều hoàn thành trong kernel, dữ liệu hoàn toàn không đi qua user space. Quy trình rút gọn thành:

1. Tiến trình ứng dụng gọi sendfile, **chuyển sang kernel space** (lần chuyển chế độ thứ 1).
2. DMA copy dữ liệu từ đĩa vào buffer đọc của kernel (DMA copy).
3. CPU copy dữ liệu trong buffer đọc của kernel vào buffer socket (CPU copy).
4. DMA copy dữ liệu trong buffer socket vào card mạng (DMA copy), **chuyển về user space** (lần chuyển chế độ thứ 2), sendfile return.

Tính sổ: **2 lần chuyển chế độ, 3 lần copy dữ liệu (2 lần DMA + 1 lần CPU)**.

So với mmap, ưu điểm cốt lõi của sendfile là thu việc chuyển tiếp file đến socket vào trong một hệ thống gọi, thường giảm được một vòng đi về user space/kernel space; cái giá là dữ liệu đi suốt trong kernel, user space không thể xử lý trực tiếp phần dữ liệu này. Nếu trước khi truyền cần sửa đổi nội dung, sendfile không phù hợp, nên đổi sang mmap, read/write thường hoặc các cách xử lý khiến dữ liệu vào user space.

Đến đây vẫn còn một lần CPU copy (buffer đọc kernel đến buffer socket). Có thể triệt tiêu luôn cả lần này không?

## Lộ trình ba: sendfile + SG-DMA (zero-copy thực sự)

Linux 2.4 nâng cấp sendfile, then chốt là giới thiệu SG-DMA (scatter/gather DMA, DMA phân tán/tập hợp). Khả năng phần cứng này khiến DMA có thể trực tiếp chuyển dữ liệu từ buffer đọc của kernel đến card mạng, không cần đi qua buffer socket trước.

Quy trình sau khi nâng cấp:

1. Tiến trình ứng dụng gọi sendfile, **chuyển sang kernel space** (lần chuyển chế độ thứ 1).
2. DMA copy dữ liệu từ đĩa vào buffer đọc của kernel (DMA copy).
3. CPU không còn copy bản thân dữ liệu, chỉ ghi **thông tin mô tả** (địa chỉ bộ nhớ + độ dài offset) của phần dữ liệu này trong buffer kernel vào buffer socket.
4. SG-DMA căn cứ theo các thông tin mô tả này, trực tiếp chuyển dữ liệu từ buffer đọc của kernel sang card mạng (DMA copy), **chuyển về user space** (lần chuyển chế độ thứ 2), sendfile return.

![Đường copy dữ liệu của sendfile + SG-DMA: buffer Socket chỉ lưu thông tin mô tả, card mạng đọc trực tiếp buffer kernel qua SG-DMA](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/zero-copy-sendfile-sg-dma.png)

Tính sổ: **2 lần chuyển chế độ, 2 lần copy dữ liệu, và cả hai lần đều là DMA copy, CPU copy cho payload là 0**.

Đây mới đích thực là zero-copy: trong toàn bộ quá trình không hề có bất kỳ lần nào dựa vào CPU để vận chuyển payload, đĩa đến card mạng hoàn toàn do DMA thực hiện. Chút thông tin mô tả CPU ghi ở bước 3 chỉ là vài byte metadata, không tính là copy dữ liệu. Chỉ là có thực sự đi được đúng lộ trình này có tiền đề: card mạng phải hỗ trợ scatter-gather, phiên bản kernel đủ, protocol stack giữa đường không cần đụng vào dữ liệu. Một khi bật mã hóa TLS ở user space, phải làm chuyển đổi định dạng, kernel buộc phải thực sự đọc payload, thì con đường có 0 lần CPU copy này sẽ không đi được nữa.

## Lộ trình bốn: splice

sendfile đã rất tốt, nhưng nó có một ràng buộc cứng: in_fd phải là đối tượng hỗ trợ đọc kiểu mmap (thường là file thường), không thể là socket, out_fd thời kỳ đầu cũng chỉ có thể là socket. Nếu muốn làm zero-copy chuyển tiếp giữa hai socket, hoặc tổng quát hơn giữa hai descriptor, sendfile không đủ dùng.

Nhân Linux 2.6.17 giới thiệu splice (do Jens Axboe đóng góp, cần glibc 2.5 hỗ trợ) bù vào khoảng trống này. Ý tưởng của nó là mượn đường **pipe (đường ống)**:

```c
ssize_t splice(int fd_in, loff_t *off_in, int fd_out, loff_t *off_out,
               size_t len, unsigned int flags);
```

splice yêu cầu fd_in và fd_out **ít nhất một trong số đó là pipe**. Tại sao nó lại phải gắn với pipe? Vì bên dưới pipe Linux là một nhóm **con trỏ trang có bộ đếm tham chiếu**: buffer pipe không lưu bản thân dữ liệu, mà lưu con trỏ trỏ đến trang bộ nhớ kernel, kèm theo bộ đếm tham chiếu của từng trang. Cái gọi là "chuyển dữ liệu từ pipe sang đầu kia", trong đa số trường hợp chỉ là copy con trỏ, cho bộ đếm tham chiếu của trang tương ứng tăng một, không thực sự khuân động payload. Cần lưu ý, `SPLICE_F_MOVE` chỉ là một gợi ý (hint) cho kernel, không phải sự bảo đảm cứng — khi gặp một số file system, thiết bị hoặc hình thái buffer không thể trực tiếp di chuyển trang, kernel vẫn có thể thoái hóa thành copy thật sự.

Dùng splice để thực hiện truyền file đến socket, phải **đi hai bước, hai lần hệ thống gọi**:

```c
splice(file_fd, NULL, pipe_w, NULL, len, SPLICE_F_MOVE);   // file → đầu ghi pipe
splice(pipe_r, NULL, socket_fd, NULL, len, SPLICE_F_MOVE); // đầu đọc pipe → socket
```

![Đường chuyển tiếp dữ liệu của splice: trang file trước tiên gắn vào buffer pipe, rồi từ pipe chuyển tiếp đến Socket](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/zero-copy-splice-flow.png)

Lần thứ nhất gắn trang trong Page Cache lên buffer pipe, lần thứ hai đem các con trỏ trang này coi như phân mảnh của gói tin mạng gửi đến socket. Dữ liệu suốt quá trình không vào không gian user, CPU không vận chuyển payload. Nhưng phải nhìn cho rõ: đây là **hai lần gọi `splice`**, vào/ra kernel space mỗi lần tính một lần, tổng cộng khoảng 4 lần chuyển chế độ, không phải như một số bài viết nói "giống sendfile chỉ có một lần hệ thống gọi, hai lần chuyển". Trong kỹ thuật thực tế, hai fd còn phải đặt non-blocking, phối hợp với epoll, và xử lý truyền ngắn (short transfer) cùng `EAGAIN`.

Có thể hiểu sự khác biệt giữa splice và những cái trước như thế này:

- **Tổng quát hơn sendfile**: sendfile chuyên tâm vào việc truyền fd đến fd trong kernel (điển hình là file đến socket); splice mượn pipe, có thể chuyển tiếp dữ liệu giữa các descriptor rộng hơn, bao gồm socket đến socket. Một số phiên bản kernel bên trong sẽ tái sử dụng các implementation liên quan, nhưng hai thứ là các hệ thống gọi độc lập, ràng buộc tham số và tiến hóa đều khác nhau, đừng đơn giản hiểu thành quan hệ kế thừa cha-con.

## Đối chiếu ngang bốn cách

Đặt bốn lộ trình trên ngang hàng nhìn, sổ sách rõ một cái là thấy:

| Cách thức                 | CPU payload copy         | DMA copy | Chuyển chế độ                                                            | Hệ thống gọi điển hình         |
| ------------------------- | ------------------------ | -------- | ------------------------------------------------------------------------ | ------------------------------ |
| read + write truyền thống | 2                        | 2        | 4                                                                        | read + write                   |
| mmap + write              | 1                        | 2        | Sau khi map gửi thường tối thiểu 2, lần truy cập đầu có thêm thiếu trang | mmap một lần + write nhiều lần |
| sendfile                  | 0 hoặc 1 (tùy đường gửi) | thường 2 | 2                                                                        | sendfile                       |
| splice (file→pipe→socket) | thường có thể tránh được | thường 2 | 4                                                                        | splice hai lần                 |

![So sánh số lần copy và chuyển chế độ của read/write truyền thống, mmap + write, sendfile + SG-DMA và splice](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/zero-copy-four-ways-comparison.png)

(Ở hàng mmap, số copy/chuyển dao động theo mức trúng Page Cache và thời điểm thiếu trang, không nên đóng cứng thành giá trị cố định; sendfile khi card mạng hỗ trợ SG-DMA, CPU payload copy giảm về 0.)

Hai kết luận:

**Thứ nhất, trong mô hình file đến TCP với cache miss của bài viết này, 2 lần vận chuyển DMA vẫn tồn tại.** Chúng tương ứng với "đĩa đến bộ nhớ" và "bộ nhớ đến card mạng". Cái zero-copy chủ yếu giảm bớt là CPU payload copy và chuyển chế độ; đổi một tình huống I/O khác, không thể tiếp tục mặc định y con số này.

**Thứ hai, chọn đường nào, trước tiên xem dữ liệu có cần ứng dụng đụng đến một chút hay không.** Trước khi truyền phải sửa nội dung, dùng mmap thuận tay hơn; chỉ là gửi nguyên file đi, sendfile phù hợp hơn, khi card mạng hỗ trợ SG-DMA còn có thể nén CPU payload copy về 0. Vị trí của splice càng đứng sau hơn: chỉ khi có nhu cầu chuyển tiếp fd ngoài file đến socket, ví dụ socket đến socket, thì mới đáng để lôi lớp pipe ra, đồng thời cũng phải chấp nhận chi phí hai lần hệ thống gọi.

Zero-copy cũng không phải vặn công tắc một cái là lời mãi. Bật TLS, cần nén, phải làm chuyển đổi định dạng, payload sớm muộn phải vào user space để xử lý; lọc nội dung, thêm watermark, giới hạn tốc độ cũng là cùng một loại vấn đề. Khi file rất nhỏ hoặc truy cập rất ngẫu nhiên, các chi phí cố định như map, thiếu trang, pipe có thể càng nổi rõ.

mmap còn phải cẩn thận việc sau khi file bị truncate mà truy cập map cũ kích hoạt SIGBUS; khi lượng gửi zero-copy rất lớn, Page Cache bị chèn ép, thu hồi bộ nhớ trở nên nặng nề, cũng sẽ nuốt mất một phần lợi ích.

## Dùng zero-copy trong Java thế nào

Trong Java NIO, thứ đụng được trực tiếp, chủ yếu là hai đường mmap và sendfile.

**MappedByteBuffer tương ứng với mmap.** Sau khi dùng `FileChannel.map` lấy được `MappedByteBuffer`, file (hoặc một phần của file) sẽ được map vào bộ nhớ. Sau đó đọc ghi buffer này, thao tác chính là vùng map, không còn giống `read/write` thường là trước tiên copy dữ liệu vào buffer do JVM tự duy trì:

```java
FileChannel channel = FileChannel.open(
        Paths.get("./data.bin"),
        StandardOpenOption.READ, StandardOpenOption.WRITE);
// map file vào bộ nhớ, bên dưới là mmap
MappedByteBuffer buffer = channel.map(
        FileChannel.MapMode.READ_WRITE, 0, channel.size());
```

**FileChannel.transferTo / transferFrom gần với đường sendfile hơn.** Nhưng ở đây đừng đánh dấu bằng trực tiếp giữa Java API và `sendfile`: `transferTo` chỉ cam kết ghi byte đến Channel mục tiêu, bên dưới truyền kiểu nào, phải xem JDK, hệ điều hành và loại Channel mục tiêu. Khi mục tiêu là `SocketChannel` đã kết nối, và platform hỗ trợ, JDK mới có thể đi vào truyền zero-copy trong kernel; đổi thành file thường hoặc Channel khác, có thể đi implementation khác, thậm chí lùi về copy ở user space. Cho nên ví dụ dưới đây viết mục tiêu thành `SocketChannel`:

```java
FileChannel source = FileChannel.open(
        Paths.get("./in.dat"), StandardOpenOption.READ);
// socketChannel là một SocketChannel đã kết nối
// file → socket, JDK trên platform hỗ trợ có thể dùng tối ưu zero-copy (như sendfile)
source.transferTo(0, source.size(), socketChannel);
```

Ở đây có một cái bẫy dễ trúng: `transferTo` không đảm bảo truyền hết một lần, phía gọi phải căn cứ theo giá trị trả về để vòng lặp xử lý phần dữ liệu còn lại. Bên dưới nếu đi Linux `sendfile`, giới hạn đơn lần là `0x7ffff000` (khoảng 2 GB) byte; nhưng giới hạn cụ thể mà tầng Java phơi ra, và rốt cuộc có đi lộ trình zero-copy hay không, đều cần kết hợp phiên bản JDK và platform mục tiêu để xác minh — ví dụ hành vi trên Windows và trên Linux không hoàn toàn giống nhau.

## Kafka và RocketMQ mỗi bên dùng loại nào

Zero-copy hay được lấy ra để giải thích vì sao Kafka, RocketMQ nhanh, nhưng lộ trình hai nhà chọn ra thực tế không giống nhau, phía sau là sự khác biệt trong mô hình đọc ghi của từng bên.

**Phía tiêu thụ Kafka dùng zero-copy để gửi.** Khi consumer đến kéo message, Kafka phải gửi file phân đoạn log (log segment) từ đĩa ra mạng, đây là điển hình của "chỉ chuyển tiếp, không sửa đổi nội dung", thế nên nó dùng `FileChannel.transferTo` đưa log trực tiếp từ Page Cache vào socket, dữ liệu không vào JVM heap. Cộng thêm ghi tuần tự và Page Cache ở phía production, high throughput cứ vậy mà gom lại được. (Thuận tiện nói thêm, file index của Kafka dùng mmap.) Nhưng zero-copy không phải có điều kiện thì phát huy bừa: một khi cần làm chuyển đổi định dạng message, giải nén nén lại, hoặc bật TLS phải mã hóa ở user space, payload buộc phải được đọc ra để xử lý, lộ trình này sẽ thoái hóa — có dùng được zero-copy hay không, phải kết hợp phiên bản Kafka, JDK và hệ điều hành để phán đoán.

**RocketMQ chủ yếu đi mmap.** CommitLog của RocketMQ dùng MappedByteBuffer để map bộ nhớ đọc ghi file, đây cũng là một trong các lý do nó thiết kế CommitLog thành file kích thước cố định, kích thước cố định tiện cho việc quản lý map. Chọn mmap thay vì sendfile, vì mô hình đọc ghi của nó cần thao tác linh hoạt hơn trên phần bộ nhớ đã map, chứ không chỉ là chuyển tiếp nguyên file đi.

Phân biệt bằng một câu: **thuần chuyển tiếp chọn sendfile, cần thao tác bộ nhớ map chọn mmap**, đây vừa khớp với tiêu chí "có đổi dữ liệu hay không" đã đề cập ở phía trước.

## Mở rộng: crate zerocopy của Rust là chuyện khác

Tìm kiếm "zerocopy" rất dễ tìm ra một thư viện Rust do Google duy trì là [google/zerocopy](https://github.com/google/zerocopy), do kỹ sư Google duy trì liên tục, lượng tải lớn, độ sôi động không vấn đề. Phiên bản của nó cập nhật rất nhanh (thời điểm viết đã đến dòng 0.8.x), ở đây không đóng cứng con số cụ thể nào, lấy crates.io và GitHub Release làm chuẩn.

Nhưng cần nhắc một câu: **crate này và zero-copy hệ điều hành mà bài viết này nói không phải một khái niệm, đừng nhầm lẫn.** Zero-copy ở tầng OS nói về việc trong quá trình I/O giảm bớt việc CPU vận chuyển dữ liệu giữa buffer kernel/user; còn crate zerocopy của Rust giải quyết là **chuyển đổi bộ nhớ an toàn về mặt kiểu** (type-safe memory conversion), làm chuyển đổi an toàn (safe transmutation) giữa chuỗi byte và struct, không cần copy, cũng không viết unsafe. Cả hai đều gọi là "zero copy", một bên nói về system call và DMA, một bên nói về bố cục bộ nhớ và an toàn kiểu ở tầng ngôn ngữ, đừng lẫn lộn chúng trong phỏng vấn.

## Trong phỏng vấn nên trả lời thế nào?

Khi phỏng vấn hỏi "zero-copy là gì", trước tiên nói cho đúng chữ "không": nó không phải là không có lần copy nào, hai đoạn vận chuyển DMA là đĩa đến bộ nhớ, bộ nhớ đến card mạng thường vẫn còn; cái zero-copy chủ yếu tiết kiệm là vài lần CPU vận chuyển payload giữa buffer kernel và buffer user, cùng với số lần chuyển chế độ giảm đi theo.

`read + write` truyền thống có thể nói theo 4 lần copy: đĩa đến buffer kernel là DMA, kernel đến buffer user là CPU, buffer user đến buffer Socket vẫn là CPU, buffer Socket đến card mạng là DMA. Phần lãng phí nhất ở đây là hai lần CPU copy, vì ứng dụng không hề sửa dữ liệu, chỉ khiến dữ liệu đi một vòng qua user space.

Thứ tự trả lời của vài phương án có thể sắp như thế này: `mmap + write` khiến user space và Page Cache map chung một nhóm trang vật lý, tiết kiệm được lần CPU copy "kernel đến user", nhưng vẫn còn phải `write` đến buffer Socket; `sendfile` thu việc chuyển tiếp file đến socket vào trong một hệ thống gọi, dữ liệu không vào user space; kết hợp SG-DMA thì buffer Socket chỉ đặt thông tin mô tả, payload có thể do DMA trực tiếp từ buffer kernel gửi lên card mạng; còn `splice` mượn pipe để truyền tham chiếu trang, phù hợp hơn cho việc chuyển tiếp giữa các fd tổng quát, nhưng thường cần hai lần hệ thống gọi.

Nếu người phỏng vấn kéo chủ đề sang Kafka, RocketMQ, đáp án cũng đừng lẫn. Phía tiêu thụ Kafka gửi nguyên file phân đoạn log cho consumer, phù hợp đi lộ trình sendfile như `FileChannel.transferTo`; CommitLog của RocketMQ cần đọc ghi bộ nhớ map linh hoạt hơn, nên hay gắn với mmap hơn. Bổ sung thêm một câu về ranh giới: các tình huống TLS, nén, chuyển đổi định dạng, lọc nội dung cần ứng dụng thực sự xử lý payload, thì lộ trình zero-copy sẽ thoái hóa.
