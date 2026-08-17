---
title: "Giải thích chi tiết về file system của hệ điều hành: inode、VFS、Page Cache và cơ chế journal"
description: "Tổng hợp các câu hỏi phỏng vấn tần suất cao về file system, bắt đầu từ file và thư mục, giải thích rõ inode、dentry、file descriptor、VFS、phân bố disk block、quản lý không gian trống、hard link、soft link、Page Cache、fsync và journaling file system。"
category: Kiến thức cơ bản về máy tính
tag:
  - Hệ điều hành
  - Linux
head:
  - - meta
    - name: keywords
      content: file system,file system hệ điều hành,câu hỏi phỏng vấn file system,file system Linux,inode,dentry,VFS,file descriptor,hard link,soft link,Page Cache,fsync,ext4,journaling file system,câu hỏi phỏng vấn hệ điều hành
---

Viết một interface lưu file, cách viết trực quan nhất là: nhận đường dẫn, `open` một file, `write` dữ liệu vào, cuối cùng `close`. Khi file ít, concurrency thấp, máy không gặp sự cố, quy trình này trông có vẻ không có gì khó.

Nhưng khi bị hỏi vấn đáp, vấn đề lập tức xuất hiện. fd mà `open()` trả về rốt cuộc trỏ tới cái gì? Tên file có được lưu trong inode không? Vì sao hai hard link lại nhìn thấy cùng một nội dung? `write()` trả về thành công, liệu dữ liệu đã thực sự ghi xuống đĩa chưa? File log đã bị xóa, tại sao `df -h` vẫn hiển thị đĩa đầy?

Những câu hỏi này đều không thể tách rời file system. Nó phải phân giải đường dẫn thành đối tượng file, định vị byte thứ N của file tới block dữ liệu bên dưới, đồng thời xử lý quyền truy cập, cache, xóa, đổi tên và phục hồi sau crash.

Câu trả lời nằm trong inode、dentry、VFS、Page Cache và cơ chế journal.

Dưới đây hãy bắt đầu từ câu hỏi cơ bản nhất: file system rốt cuộc quản lý những gì?

## File system rốt cuộc quản lý những gì?

Khi viết code hàng ngày, ta thấy đường dẫn, tên file, thư mục, `read`, `write`. Với file system xây dựng trên thiết bị block cục bộ, tầng dưới cùng thường là logical block, sector và device I/O; file system tổ chức các tài nguyên cấp thấp này thành file, thư mục và metadata.

Tuy nhiên, không phải mọi file system đều tương ứng với đĩa cục bộ. `tmpfs` chủ yếu dùng memory làm backend, `procfs` phơi bày trạng thái chạy của kernel, còn NFS nối file system từ xa vào cây thư mục cục bộ. VFS cung cấp interface file thống nhất phía trên các cài đặt này.

Tiểu G khuyên nên nhìn file system theo cách này: nó không chỉ chịu trách nhiệm "lưu nội dung file", mà còn phải đồng thời giải quyết 4 việc.

![Tổng quan trách nhiệm file system](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-system-responsibilities.webp)

- **Đặt tên (naming)**: dùng đường dẫn và tên file tìm đối tượng file mục tiêu, ví dụ `/var/log/app.log`.
- **Tổ chức (organization)**: dùng cây thư mục quản lý file, để các file khác nhau có thể được phân vào các thư mục khác nhau.
- **Định vị (locating)**: ánh xạ byte thứ N của file tới một block dữ liệu nào đó trên đĩa hoặc SSD.
- **Bảo vệ (protection)**: ghi lại quyền truy cập, chủ sở hữu, timestamp, và kiểm tra khi truy cập.

Không có file system, ứng dụng phải tự ghi nhớ "khối thứ mấy đến khối thứ mấy thuộc file nào", còn phải tự xử lý xóa, mở rộng, quyền truy cập, phục hồi sau crash. File system gom những việc này vào một interface thống nhất, ứng dụng chỉ cần cầm file descriptor để đọc ghi.

Bài viết này chủ yếu trình bày theo phong cách Linux/Unix. Cài đặt của NTFS、APFS、Btrfs、XFS、ext4 có khác nhau, nhưng file、thư mục、metadata、cache、phân bố、phục hồi những vấn đề này không thể tránh khỏi.

## File và thư mục lần lượt là gì?

Trong bối cảnh Unix/Linux, một file thường có thể hiểu là một chuỗi byte có tên và metadata, thường được lưu bởi storage phiên dữ liệu (persistent storage). VFS còn dùng interface file tương tự để phơi bày các đối tượng thư mục, thiết bị, FIFO, Socket và các đối tượng pseudo-file system.

Vì vậy, cách hiểu chính xác hơn của "everything is file" (mọi thứ là file) là: Linux cố gắng để các tài nguyên khác nhau được truy cập qua file descriptor và interface I/O thống nhất, chứ không phải mọi đối tượng thực sự được ghi xuống đĩa. Dữ liệu của pipe nằm trong kernel buffer, còn nhiều nội dung dưới `/proc` là các pseudo file do kernel tạo ra theo thời gian thực.

Thư mục cũng là một loại file, chỉ là nội dung dữ liệu của nó đặc biệt hơn. Trong file system phong cách Unix như ext4, dữ liệu của thư mục chủ yếu lưu ánh xạ "tên file đến số inode". Khi người dùng tìm file qua đường dẫn, file system sẽ tra cứu thư mục từng cấp:

```text
/home/guide/a.txt
  -> tra thư mục gốc /
  -> tìm home
  -> vào home tìm guide
  -> vào guide tìm a.txt
```

Cây thư mục giúp file có cấp bậc phân cấp. Cơ chế mount lại nối nhiều file system vào cùng một cây thư mục, ví dụ sau khi mount `/dev/sda2` vào `/data`, khi truy cập `/data/app.log`, file thực tế được truy cập nằm trên file system của một phân vùng khác.

Thư mục tuy bên trong file system cũng sở hữu data block và inode, nhưng ở user space thường không thể `read()` trực tiếp nó như một file thường, mà phải qua các interface duyệt thư mục kiểu `readdir()`、`getdents()` để đọc các entry của thư mục.

## inode、dentry và tên file có quan hệ gì với nhau?

Trong file system Linux/Unix, hiểu inode là rất quan trọng.

**inode (index node) ghi lại metadata của file**, các nội dung thường gặp bao gồm kiểu file, quyền truy cập, chủ sở hữu, kích thước, timestamp, link count, cùng vị trí trỏ tới các block dữ liệu.

inode thường không lưu tên file. Tên file thuộc về directory entry, cùng một inode có thể có nhiều tên file. Dữ liệu của file thường được lưu trong các block dữ liệu hoặc extent riêng biệt, inode chỉ lưu thông tin ánh xạ dữ liệu. Tuy nhiên một số file system có tối ưu inline, ví dụ ext4 có thể đưa trực tiếp nội dung file rất nhỏ hoặc mục tiêu symlink ngắn vào trong inode.

Linux VFS còn duy trì dentry trong bộ nhớ. dentry đại diện cho một directory entry trong đường dẫn, dùng để cache kết quả tra cứu tên; nó thường trỏ tới inode, nhưng cũng có thể là negative dentry "không tồn tại mục tiêu". Có thể hiểu một cách đại khái như sau:

- **Tên file**: được lưu trong directory entry trên đĩa.
- **dentry**: path component và cache tra cứu mà VFS duy trì trong bộ nhớ.
- **inode**: đại diện cho đối tượng file system, lưu hoặc liên kết metadata và ánh xạ dữ liệu của nó.
- **Block dữ liệu hoặc extent**: lưu nội dung dữ liệu của một file thường.

Điều này cũng giải thích tại sao đổi tên file thường rất nhanh. Nếu `mv a.txt b.txt` xảy ra trong cùng một file system, phần lớn thời gian chỉ là sửa ánh xạ tên trong directory entry, bản thân nội dung file không cần di chuyển.

![Quan hệ giữa tên file, dentry và inode](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-inode-dentry-relation.webp)

Có thể dùng vài lệnh dưới đây để quan sát những thông tin này:

```bash
# Xem số inode
ls -li app.log

# Xem metadata của file
stat app.log

# Xem tình trạng sử dụng inode của file system
df -i
```

Với loại file system xây dựng bảng inode trước như ext4, số lượng inode cũng có thể cạn kiệt sớm hơn data block. Đĩa máy chủ trông vẫn còn dung lượng, nhưng sau khi quá nhiều file nhỏ chiếm hết inode, tạo file mới vẫn có thể báo `No space left on device`. Cách phân bố inode của các file system khác nhau không hoàn toàn giống nhau, vì vậy việc giải thích `df -i` cũng phải kết hợp với file system cụ thể.

## Điều gì xảy ra khi `open` một file?

Sau khi ứng dụng gọi `open()`, kernel sẽ không đọc toàn bộ file vào bộ nhớ. Nó chủ yếu làm vài việc:

1. Phân giải đường dẫn, tìm directory entry và inode tương ứng.
2. Kiểm tra quyền truy cập, cờ mở (open flag) và kiểu file có hợp lệ không.
3. Tạo một đối tượng file đang mở (open file object) trong kernel, ghi lại file offset, status flag và các thông tin khác.
4. Trong bảng file descriptor của process hiện tại, phân bổ một non-negative integer nhỏ nhất khả dụng, đó chính là fd.

Linux man-pages nói rất rõ về điều này: `open()` trả về chỉ mục trong bảng file descriptor của process; mỗi lần `open()` còn tạo một open file description trong phạm vi hệ thống (system-wide), dùng để ghi lại file offset và status flag.

Mấy cấu trúc này dễ bị nhầm lẫn:

![Từ đường dẫn đến file descriptor](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-path-to-fd.webp)

| Cấu trúc               | Thuộc về                      | Chủ yếu ghi lại những gì                    |
| ---------------------- | ----------------------------- | ------------------------------------------- |
| Bảng file descriptor   | Mỗi process một bảng          | Tham chiếu từ fd đến đối tượng file đang mở |
| Đối tượng file đang mở | Phạm vi hệ thống              | Offset hiện tại, trạng thái mở, cờ đọc ghi  |
| Bảng/cache inode       | File system và kernel duy trì | Metadata của file, vị trí block dữ liệu     |

Sau `dup()`、`fork()`, nhiều fd có thể tham chiếu cùng một đối tượng file đang mở, nên chúng chia sẻ file offset. Hai process riêng biệt mỗi bên gọi `open()` cùng một file, thì thường nhận hai đối tượng file đang mở khác nhau, mỗi cái tự duy trì offset.

Đây chính là nguồn gốc của hiện tượng sau: sau khi cùng một file bị xóa, process đang ghi nó có thể vẫn tiếp tục ghi. `unlink()` xóa tên trong thư mục, và giảm link count của inode. Chỉ khi link cứng cuối cùng đã bị xóa, và mọi tham chiếu kernel như open reference, memory map v.v. đều được giải phóng, không gian mà file chiếm giữ mới thực sự được thu hồi.

## File được sắp xếp thế nào trên đĩa?

Đĩa và SSD bên ngoài thường đọc ghi theo đơn vị block. File system sẽ chia một phân vùng hoặc volume thành nhiều block, rồi dùng một số cấu trúc metadata quản lý chúng. Lấy file system họ ext làm ví dụ, bố cục đĩa thường bao gồm các vùng sau:

- **Superblock**: ghi lại thông tin tổng thể của file system, ví dụ kích thước block, số inode, số lượng block trống, trạng thái mount.
- **Vùng inode**: lưu inode.
- **Vùng data block**: lưu nội dung file thường và nội dung thư mục.
- **Bitmap hoặc cấu trúc không gian trống khác**: ghi lại những inode nào, những block dữ liệu nào chưa được sử dụng.

Các cách phân bố file thường gặp trong giáo trình gồm có allocation liên tục (contiguous allocation), allocation theo chuỗi (linked allocation) và allocation theo chỉ mục (indexed allocation). Chúng thích hợp để hiểu sự đánh đổi trong thiết kế.

**Contiguous allocation** đặt một file vào một đoạn block liên tục. Ưu điểm là đọc ghi tuần tự và random access đều trực tiếp, chỉ cần biết block bắt đầu và độ dài là định vị được. Nhược điểm cũng trực tiếp: file mở rộng phiền phức, tạo xóa lặp đi lặp lại dễ để lại external fragment (phân mảnh ngoài).

**Linked allocation** khiến các block của file phân tán khắp nơi trên đĩa, mỗi block trỏ tới block tiếp theo. Nó không yêu cầu không gian liên tục, file mở rộng tiện lợi, nhưng random access kém. Muốn đọc block thứ 1000, có thể phải đi theo con trỏ từ block thứ 1. File system FAT gom các con trỏ này vào file allocation table, cải thiện một phần vấn đề tìm kiếm, nhưng bản thân bảng lại trở thành metadata cần duy trì.

**Indexed allocation** gom địa chỉ các block dữ liệu của file vào trong index block. Muốn đọc block thứ i, trước tiên tra mục thứ i của index block, rồi đi đọc block dữ liệu tương ứng. Nó hỗ trợ random access, cũng không có vấn đề external fragment của contiguous allocation, cái giá là phải lưu thêm index block.

ext2/ext3 kinh điển dùng direct block pointer, single indirect, double indirect và triple indirect block để định vị dữ liệu file. ext4 thường chuyển sang dùng extent tree: một extent ghi lại điểm bắt đầu logic, điểm bắt đầu vật lý và độ dài của một đoạn block vật lý liên tục; với file lớn liên tục, nó tiết kiệm rất nhiều metadata ánh xạ so với "mỗi block ghi một địa chỉ".

![Cách định vị block dữ liệu file](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-block-allocation.webp)

Các file system hiện đại khác cũng có thể dùng những tổ hợp khác nhau của B-tree, extent, delayed allocation (phân bố trễ), copy-on-write (sao chép khi ghi) v.v., không thể coi cấu trúc block trực tiếp/gián tiếp là cài đặt thống nhất của mọi file system hiện đại.

## Không gian trống được quản lý thế nào?

Sau khi file bị xóa, các block dữ liệu từng chiếm giữ phải được trả lại cho file system; khi file mới được ghi, lại phải nhanh chóng tìm được block khả dụng. Đó chính là quản lý không gian trống.

Có vài loại phương pháp phổ biến:

- **Free list (danh sách trống)**: ghi lại block bắt đầu và độ dài của mỗi đoạn không gian trống liên tục. Thích hợp với contiguous allocation, nhưng bảng sẽ trở nên phức tạp khi phân mảnh tăng lên.
- **Free linked list (danh sách liên kết trống)**: xâu các block trống thành danh sách liên kết, phân bổ và thu hồi từng block tương đối trực tiếp, nhưng tìm không gian liên tục không tiện.
- **Bitmap**: mỗi block tương ứng 1 bit, 0 nghĩa là trống, 1 nghĩa là đã dùng. Tìm block trống liên tục có thể quét bitmap, chi phí không gian cũng có thể kiểm soát được.
- **Group linking (liên kết nhóm)**: đặt địa chỉ của một loạt block trống vào trong một block, rồi liên kết tới đợt tiếp theo, phổ biến trong các hệ Unix thời kỳ đầu.

Bitmap rất phổ biến. Giả sử kích thước file system là 1 TiB, kích thước block là 4 KiB, thì tổng cộng có `2^28` block. Mỗi block dùng 1 bit để đánh dấu, kích thước bitmap khoảng 32 MiB. Chi phí này có thể chấp nhận, đổi lấy việc quản lý trạng thái block rõ ràng.

File system thực tế còn kết hợp chiến lược phân bố để giảm phân mảnh. Ví dụ ưu tiên đặt các file trong cùng một thư mục, các extent liên tục của cùng một file lớn gần nhau, để đọc tuần tự thân thiện hơn. SSD không có vấn đề tìm kiếm (seek) như đĩa cơ, nhưng ghi liên tục, write amplification (khuếch đại ghi), xóa block, TRIM và các yếu tố khác vẫn ảnh hưởng đến hiệu năng và tuổi thọ.

## VFS giải quyết vấn đề gì?

Linux hỗ trợ rất nhiều file system như ext4、XFS、Btrfs、tmpfs、procfs、NFS. Chương trình người dùng không thể viết một bộ `open_ext4()`、`open_xfs()` cho từng loại file system.

VFS (Virtual File System, file system ảo) chính là tầng trừu tượng trung gian. Ứng dụng vẫn gọi các `open`、`read`、`write`、`close` thống nhất, VFS dựa theo file system nơi chứa file mục tiêu, chuyển tiếp thao tác tới cài đặt cụ thể.

Tài liệu VFS chính thức của Linux diễn giải vài đối tượng rất trực tiếp:

- **superblock**: đại diện cho một file system đã mount.
- **inode**: đại diện cho một đối tượng trong file system, ví dụ file thường, thư mục, FIFO.
- **dentry**: đại diện cho một directory entry trong đường dẫn, thường trỏ tới inode.
- **file**: đại diện cho đối tượng file sau khi mở, chính là cấu trúc kernel đằng sau fd.

Có VFS, `cat /proc/cpuinfo`、`cat /var/log/app.log`、đọc file trên NFS, đều có thể dùng cùng một interface user space. Sự khác biệt bị nén xuống phần cài đặt file system cụ thể bên dưới VFS.

## Hard link và soft link khác nhau thế nào?

Hard link và soft link đều có thể khiến một đường dẫn liên kết tới một file khác, nhưng đối tượng mà chúng trỏ tới khác nhau.

| Hạng mục so sánh              | Hard link                                                                           | Soft link                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Đối tượng trỏ tới             | Cùng một inode                                                                      | Một đường dẫn khác                                     |
| Có tạo inode mới không        | Không tạo inode đối tượng file mới, chỉ thêm một directory entry và tăng link count | Bản thân soft link là một file độc lập, có inode riêng |
| Sau khi xóa file gốc          | Chỉ cần còn hard link, dữ liệu vẫn còn                                              | Soft link có thể trở thành dangling link               |
| Có thể vượt file system không | Không thể                                                                           | Có thể                                                 |
| Có thể link thư mục không     | Linux không cho phép link thư mục qua interface hard link thông thường              | Có thể                                                 |

![So sánh hard link và soft link](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-hardlink-symlink.webp)

Hard link không thể vượt file system, vì số inode chỉ có ý nghĩa trong phạm vi file system hiện tại. Một file system khác có bảng inode riêng, cùng một con số không đại diện cho cùng một file.

Có thể dùng lệnh dưới đây làm một thí nghiệm nhỏ:

```bash
echo hello > a.txt
ln a.txt hard.txt
ln -s a.txt soft.txt

ls -li a.txt hard.txt soft.txt
```

Bạn sẽ thấy số inode của `a.txt` và `hard.txt` giống nhau, số inode của `soft.txt` khác. Sau khi xóa `a.txt`, `hard.txt` vẫn đọc được nội dung, còn `soft.txt` sẽ trỏ tới một đường dẫn không tồn tại.

## Vì sao Page Cache ảnh hưởng đến hiệu năng đọc ghi file?

Trực tiếp đọc ghi đĩa quá chậm. Linux sẽ dùng **Page Cache** để cache dữ liệu file, lưu một phần các page của file đĩa trong bộ nhớ.

Khi đọc file, nếu page mục tiêu đã nằm trong Page Cache, kernel có thể trực tiếp copy về user space từ bộ nhớ, không cần thật sự đọc đĩa. Khi không trúng cache, mới đọc page từ đĩa vào Page Cache, rồi trả về cho ứng dụng.

Với buffered I/O của file thường, `write()` thành công thường không chỉ có nghĩa là dữ liệu đã được kernel tiếp nhận, trường hợp phổ biến là đi vào Page Cache và được đánh dấu là dirty page. Nó không đảm bảo viết đủ toàn bộ byte của yêu cầu ghi, cũng không đảm bảo dữ liệu đã được lưu bền vững lên thiết bị cấp dưới. Phía gọi phải xử lý partial write; nếu cần độ bền bỉ, còn phải kiểm tra lỗi của `fsync()`、`fdatasync()` và `close()`.

`fdatasync()` cũng đồng bộ dữ liệu file, nhưng chỉ đồng bộ metadata cần thiết để đọc dữ liệu sau này, ví dụ kích thước file; `fsync()` thì đồng bộ dữ liệu file và metadata liên quan đầy đủ hơn. Đây nói về buffered I/O thông thường, các đường dẫn như `O_DIRECT`、`O_SYNC`、DAX sẽ thay đổi hành vi cụ thể.

Cái giá là rủi ro crash. Sau khi process viết xong file, nếu máy đột ngột mất điện, những lần ghi đã trả về thành công chưa chắc đều đã được ghi xuống đĩa. Khi cần độ bền bỉ mạnh hơn, phải dùng `fsync()`、`fdatasync()` hoặc cờ mở mang ngữ nghĩa đồng bộ, nhưng các thao tác này khiến ứng dụng phải chờ flush đĩa, throughput sẽ giảm.

Còn một điểm rất dễ bỏ sót: `fsync(fileFd)` chỉ đồng bộ bản thân file, không nhất thiết đồng bộ sự thay đổi tên file trong thư mục cha. Sau khi tạo file mới, thực hiện `rename()` hoặc `unlink()`, nếu yêu cầu sau khi mất điện directory entry cũng được lưu bền vững đáng tin cậy, thì còn cần mở thư mục cha và gọi `fsync()` lên fd của thư mục.

Một quy trình thay thế an toàn (safe replace) điển hình là: tạo file tạm trong cùng thư mục, ghi đầy đủ nội dung, gọi `fsync()` lên file tạm, rồi dùng `rename()` thay thế atomically file mục tiêu, cuối cùng gọi `fsync()` lên thư mục cha. `rename()` trong cùng một file system có thể atomically thay thế tên mục tiêu, nhưng "namespace operation atomic" không có nghĩa là "mất điện sau đó nhất định bền vững".

Database, message queue, hệ thống log đều không thể tránh khỏi điểm này. Chúng thường tự quản lý chiến lược flush: có loại cố gắng mỗi lần commit transaction đều flush xuống đĩa hết mức có thể, có loại cho phép mất dữ liệu trong cửa sổ ngắn để đổi lấy throughput. Ở đây không có nghiệm tối ưu chung, chỉ có recovery point objective mà nghiệp vụ chấp nhận được.

![Đường dẫn từ ghi file đến lưu bền vững](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/file-write-persistence.webp)

## Journaling file system giảm hư hỏng do crash như thế nào?

File system sợ nhất là ghi được một nửa thì crash. Ví dụ khi tạo file, vừa phải phân bổ inode, vừa phải phân bổ data block, còn phải cập nhật directory entry và bitmap. Chỉ viết xong một phần rồi mất điện, file system có thể nằm ở trạng thái không nhất quán.

Journaling file system sẽ trước tiên ghi thay đổi metadata sắp sửa thực hiện vào vùng journal, sau đó mới cập nhật vị trí chính thức. Khi hệ thống phục hồi sẽ quét journal: những transaction đã commit hoàn chỉnh nhưng chưa được ghi hết về vị trí chính thức có thể được replay (phát lại); những transaction không có commit record hoặc kiểm tra checksum thất bại sẽ bị loại bỏ. Mục tiêu của journal là tránh cấu trúc file system dừng ở trạng thái "chỉ mới cập nhật một nửa".

Lấy ext4 làm ví dụ, tài liệu chính thức liệt kê 3 chế độ data:

- **`data=writeback`**: chỉ đảm bảo journal cho metadata, không đảm bảo các block dữ liệu liên quan được ghi trước metadata. Hiệu năng thường tốt hơn, nhưng sau crash trong file mới ghi có thể xuất hiện dữ liệu cũ.
- **`data=ordered`**: chế độ mặc định. Trước khi metadata vào journal, các block dữ liệu liên quan sẽ được ghi trước vào file system chính. Nó không ghi bản thân dữ liệu file vào journal, nhưng giảm rủi ro metadata trỏ tới dữ liệu chưa ghi.
- **`data=journal`**: cả data và metadata đều ghi journal trước, rồi mới ghi vị trí cuối. Với dữ liệu đi qua journal cung cấp đảm bảo nhất quán sau crash mạnh hơn, nhưng chi phí write amplification và hiệu năng cũng cao hơn.

Journaling file system giải quyết là "nhất quán cấu trúc file system", chứ không phải thay ứng dụng đảm bảo mọi dữ liệu nghiệp vụ không mất. Muốn đảm bảo độ bền bỉ cấp transaction, ứng dụng vẫn phải dùng `fsync()` đúng cách, và xử lý các chi tiết như rename, file tạm, flush thư mục.

## Vấn đề hiệu năng file system thường xem ở đâu?

Gỡ rối vấn đề file system, đừng chỉ nhìn chằm chằm dung lượng đĩa. Dưới đây là những chỉ số phổ biến hơn.

**inode có dùng hết không**:

```bash
df -i
```

Khi quá nhiều file nhỏ, inode có thể cạn kiệt sớm hơn dung lượng.

**File descriptor có bị leak không**:

```bash
ulimit -n
cat /proc/<pid>/limits
lsof -p <pid>
ls /proc/<pid>/fd | wc -l
```

Khi service báo `Too many open files`, trước tiên xem giới hạn trên fd của process và số fd hiện tại, rồi kiểm tra xem có connection, file log, file tạm nào chưa đóng không. Ở đây cũng cần phân biệt hai loại lỗi: `EMFILE` nghĩa là file descriptor của process hiện tại đạt giới hạn trên, `ENFILE` nghĩa là số file đang mở trong phạm vi hệ thống đạt giới hạn.

Trong chương trình đa luồng khi tạo fd, cố gắng ưu tiên dùng các option atomic close-on-exec như `O_CLOEXEC`, để tránh fd vô tình bị leak vào chương trình mới sau `exec()`.

**Kích thước Page Cache và áp lực bộ nhớ**:

```bash
free -h
vmstat 1
```

`free -h` và `vmstat 1` có thể hỗ trợ phán đoán quy mô cache, áp lực bộ nhớ, swapping và hoạt động I/O, nhưng không trực tiếp ra được tỉ lệ hit của Page Cache. Linux cố gắng dùng bộ nhớ trống làm cache, nên buff/cache lớn trong `free` chưa hẳn là chuyện xấu. Điều thực sự cần xem là ứng dụng có thường xuyên chờ đợi I/O không, có nhiều write-back không, có bị áp lực bộ nhớ khiến cache bị thu hồi lặp đi lặp lại không.

Khi cần quan sát các page cache của một file cụ thể, Linux bản mới cung cấp `cachestat()`; cũng có thể dùng công cụ kiểu `cachestat` dựa trên eBPF, nhưng trước khi dùng trong production phải đánh giá chi phí thu thập (overhead).

**Đĩa có bận không**:

```bash
iostat -x 1
```

Với thiết bị nối tiếp truyền thống, `%util` duy trì gần 100% trong thời gian dài có thể nghĩa là thiết bị bận. Nhưng với NVMe SSD, RAID và các thiết bị khác có thể xử lý song song nhiều request, `%util` không thể trực tiếp quy ra độ bão hòa. Còn phải kết hợp `await`、`r_await`、`w_await`、`aqu-sz`、throughput、IOPS và độ trễ phía ứng dụng để cùng phán đoán.

**`df` rất đầy, mà `du` lại không tìm thấy file lớn**:

```bash
lsof +L1
ls -l /proc/<pid>/fd
```

`du` thống kê các file vẫn còn tên trong cây thư mục; `df` thống kê các block đã được file system phân bổ. Nếu một log lớn đã bị `unlink()`, nhưng process vẫn giữ fd mở, nó sẽ không còn xuất hiện trong kết quả duyệt thư mục, `du` không thấy được nó; nhưng không gian cấp dưới vẫn chưa được giải phóng, nên `df` vẫn cao. Khi xử lý, thông thường nên để process mở lại file log, hoặc restart service bình thường, đừng trực tiếp làm thao tác hủy diệt chưa được xác nhận với `/proc/<pid>/fd/*`.

Tiểu G cũng để lại một giới hạn ở đây: các file system khác nhau, phiên bản kernel, tham số mount, chiến lược cache phần cứng đều sẽ thay đổi tình hình biểu hiện. Ví dụ `O_DIRECT` ở Linux còn có giới hạn alignment, và giới hạn sẽ thay đổi theo phiên bản file system và kernel. Khi phán đoán hiệu năng, tốt nhất kết hợp `mount`、`uname -a`、`fio` của hệ thống hiện tại hoặc kết quả test áp lực nghiệp vụ thực, đừng chỉ dựa theo kết luận trong sách giáo khoa.

## Trong phỏng vấn trả lời file system như thế nào?

Nếu phỏng vấn hỏi "file system là gì", có thể trả lời theo mạch này:

File system chịu trách nhiệm tổ chức các block trên thiết bị lưu trữ thành file và thư mục mà người dùng hiểu được. Nó phải quản lý đặt tên, thư mục, metadata, phân bổ data block, không gian trống, quyền truy cập, cache và phục hồi sau crash.

Khi nói về Linux, có thể tiếp tục bổ sung inode、dentry、file và superblock. Tên file được lưu trong directory entry, inode lưu metadata của file và vị trí data block; `open()` phân giải đường dẫn, kiểm tra quyền truy cập rồi trả về fd, fd trỏ tới đối tượng file sau khi mở, khi đọc ghi lại thông qua VFS điều phối tới file system cụ thể.

Nếu hỏi sâu "hard link và soft link", nắm một câu: hard link là nhiều directory entry trỏ tới cùng một inode, soft link là một file độc lập, nội dung là đường dẫn mục tiêu.

Nếu hỏi sâu "vì sao sau khi viết xong file vẫn có thể mất", trả lời Page Cache và chiến lược write-back: `write()` thành công thường chỉ mang nghĩa dữ liệu đi vào kernel cache, chưa hẳn đã được lưu bền vững; khi cần đảm bảo mạnh hơn phải kết hợp `fsync()`、cơ chế journal và thứ tự ghi đúng.
