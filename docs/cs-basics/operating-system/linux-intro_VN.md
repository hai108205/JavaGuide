---
title: "Tổng hợp kiến thức cơ bản về Linux"
description: "Giới thiệu ngắn gọn một số khái niệm và lệnh phổ biến về Linux mà lập trình viên Java cần biết."
category: Kiến thức cơ bản về máy tính
tag:
  - Hệ điều hành
  - Linux
head:
  - - meta
    - name: keywords
      content: Linux,基础命令,发行版,文件系统,权限,进程,网络
---

Giới thiệu ngắn gọn một số khái niệm và lệnh phổ biến về Linux mà lập trình viên Java cần biết.

## Bước đầu tìm hiểu Linux

### Giới thiệu về Linux

Có thể khái quát Linux thực chất là gì qua ba điểm sau:

- **Hệ thống giống Unix (类 Unix 系统)**: Linux là một hệ điều hành tương tự Unix, miễn phí và mã nguồn mở.
- **Bản chất của Linux là Linux kernel (nhân Linux)**: Theo nghĩa chặt chẽ, bản thân từ Linux chỉ biểu thị nhân Linux, bản thân nhân Linux đơn lẻ không thể trở thành một hệ điều hành chạy bình thường được. Chính vì vậy, đã có nhiều bản phân phối Linux (Linux distribution).
- **Cha đẻ của Linux (Linus Benedict Torvalds)**: Một nhân vật huyền thoại trong lĩnh vực lập trình, một đại cao thủ thực thụ! Là tấm gương mà thế hệ chúng ta ngưỡng mộ và kính trọng. Anh là tác giả đầu tiên của **nhân Linux**, sau đó đã khởi xướng dự án mã nguồn mở này, đảm nhận vai trò kiến trúc sư chính của nhân Linux. Anh cũng khởi xướng dự án mã nguồn mở Git và là nhà phát triển chính của nó.

![Người sáng lập Linux Linus Torvalds](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/linux-father.png)

### Sự ra đời của Linux

Năm 1989, Linus Torvalds vào Lữ đoàn Khu vực Mới của Quân đội Phần Lan, thực hiện nghĩa vụ quân sự quốc gia kéo dài 11 tháng, cấp bậc thiếu úy, chủ yếu phục vụ phòng máy tính, nhiệm vụ là tính toán đường đạn. Trong thời gian phục vụ, anh đã mua cuốn sách giáo khoa do Andrew Stuart Tanenbaum viết cùng mã nguồn minix, bắt đầu nghiên cứu hệ điều hành. Năm 1990, sau khi xuất ngũ trở lại đại học, anh bắt đầu tiếp xúc với Unix.

> **Minix** là một phiên bản thu nhỏ của hệ điều hành giống Unix, được giáo sư Tanenbaum sáng tác nhằm phục vụ giảng dạy, sử dụng thiết kế vi nhân (microkernel). Nó đã truyền cảm hứng cho việc sáng tạo nhân Linux.

Năm 1991, Linus Torvalds đã mã nguồn mở nhân Linux. Linux lấy một chú chim cánh cụt đáng yêu làm biểu tượng, tượng trưng cho sự dám nghĩ dám làm, yêu đời.

![Biểu trưng hệ điều hành Linux](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/Linux-Logo.png)

### Các bản phân phối Linux phổ biến

![Giao diện màn hình nền và dòng lệnh của hệ điều hành Linux](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/linux.png)

Linus Torvalds mã nguồn mở chỉ là nhân Linux, chúng ta cũng đã đề cập ở trên về vai trò của nhân hệ điều hành. Một số tổ chức hoặc nhà cung cấp đóng gói nhân Linux cùng với nhiều loại phần mềm và tài liệu, đồng thời cung cấp giao diện cài đặt hệ thống cùng các công cụ cấu hình, thiết lập và quản lý hệ thống, từ đó tạo nên các bản phân phối Linux.

> Nhân (kernel) chủ yếu chịu trách nhiệm quản lý bộ nhớ hệ thống, quản lý thiết bị phần cứng, quản lý hệ thống tệp và quản lý ứng dụng.

Các bản phân phối Linux có thể được chia đại khái thành hai loại:

- **Bản phân phối được duy trì bởi công ty thương mại**: ví dụ như Red Hat Enterprise Linux (RHEL) do công ty Red Hat duy trì và hỗ trợ.
- **Bản phân phối được duy trì bởi cộng đồng tổ chức**: ví dụ như CentOS dựa trên Red Hat Enterprise Linux (RHEL), Ubuntu dựa trên Debian.

Đối với người mới bắt đầu học Linux, không khuyến khích chọn CentOS vô điều kiện nữa. CentOS Linux 8 đã ngừng hỗ trợ vào cuối năm 2021, CentOS Linux 7 cũng đã kết thúc vòng đời vào tháng 6 năm 2024; CentOS Stream hiện tại là nhánh phân phối liên tục ngược dòng (upstream) của RHEL, với vai trò khác với "bản tái biên dịch tương thích RHEL ổn định" trước đây.

Lựa chọn an toàn hơn là:

- Muốn học môi trường máy chủ doanh nghiệp, hệ sinh thái RHEL: ưu tiên chọn Rocky Linux hoặc AlmaLinux.
- Muốn bắt đầu nhanh, nhiều tài liệu, phổ biến cả trên máy tính để bàn và máy chủ: chọn Ubuntu LTS.
- Muốn ổn định, nhẹ nhàng, gần gũi với bản phân phối cộng đồng: chọn Debian.

Nếu môi trường công ty của bạn vẫn đang dùng CentOS, có thể học phiên bản tương ứng theo môi trường thực tế; nhưng khi mới dựng môi trường học tập, nên chọn các bản phân phối vẫn đang được duy trì.

## Hệ thống tệp Linux

### Giới thiệu về hệ thống tệp Linux

Trong hệ điều hành Linux, mọi tài nguyên được hệ điều hành quản lý, như card giao diện mạng, ổ đĩa, máy in, thiết bị nhập xuất, tệp thông thường hoặc thư mục,... đều được xem là tệp. Đây là một khái niệm quan trọng trong hệ thống Linux, đó là "mọi thứ đều là tệp" (everything is a file).

Khái niệm này bắt nguồn từ triết lý UNIX, tức là trừu tượng hóa mọi tài nguyên thành tệp để quản lý và truy cập. Hệ thống tệp của Linux cũng học hỏi triết lý thiết kế hệ thống tệp của UNIX. Thiết kế này giúp hệ thống Linux có thể thông qua giao diện tệp thống nhất để quản lý và thao tác các loại tài nguyên khác nhau, từ đó đạt được một cách thức thao tác tệp thống nhất. Ví dụ, có thể dùng cách thức đọc/ghi tệp để xử lý card giao diện mạng, ổ đĩa, tệp thiết bị,... giúp thao tác và quản lý các tài nguyên này trở nên thống nhất và đơn giản hơn.

Triết lý thiết kế lấy tệp làm trung tâm này mang lại tính linh hoạt và khả năng mở rộng cho hệ thống Linux, khiến Linux trở thành một hệ điều hành mạnh mẽ. Đồng thời, đây cũng là một đặc điểm lớn của hệ thống Linux, được đông đảo người dùng và nhà phát triển yêu thích và tôn vinh.

### Giới thiệu về inode

inode là nền tảng của hệ thống tệp Linux/Unix. Vậy rốt cuộc inode là gì? Và có tác dụng gì?

Có thể khái quát inode rốt cuộc là gì qua năm điểm sau:

1. Ổ cứng lấy sector (Sector) làm đơn vị lưu trữ vật lý nhỏ nhất, còn hệ điều hành và hệ thống tệp thường đọc/ghi theo đơn vị block (Block), khối được tạo thành từ nhiều sector. Kích thước sector truyền thống của đĩa thường là 512 byte, đĩa hiện đại cũng thường có sector vật lý 4 KB (ví dụ thiết bị 512e/4Kn); kích thước block của hệ thống tệp cũng thường là 4 KB, nhưng hai khái niệm này không giống nhau. Thông tin siêu dữ liệu của tệp (ví dụ quyền, kích thước, thời gian sửa đổi cũng như ánh xạ data block hoặc extent) thường được ghi trong inode (index node, nút chỉ mục). Số inode chỉ đảm bảo duy nhất trong cùng một hệ thống tệp, nhiều mục thư mục hard link (liên kết cứng) có thể trỏ đến cùng một inode. Ổ cứng thể rắn (SSD) tuy không có sector vật lý theo nghĩa đĩa từ truyền thống, nhưng vẫn hiển thị giao diện block logic ra ngoài.
2. Trong các hệ thống tệp như ext2/ext3/ext4, kích thước inode được ghi trên đĩa sẽ được xác định khi tạo hệ thống tệp; cách bố trí siêu dữ liệu của các hệ thống tệp Linux khác có thể khác nhau.
3. Tốc độ truy cập inode rất nhanh, vì hệ thống có thể trực tiếp xác định thông tin siêu dữ liệu của tệp qua số inode, không cần duyệt toàn bộ hệ thống tệp.
4. Các hệ thống tệp như ext2/ext3/ext4 sẽ xác định số lượng inode khả dụng khi tạo hệ thống tệp, sau khi dùng hết inode, dù vẫn còn không gian data block cũng không thể tạo tệp mới. Không phải mọi hệ thống tệp Linux đều dùng bảng inode cố định, khi kiểm tra cần kết hợp với cách triển khai cụ thể của hệ thống tệp.
5. Có thể dùng lệnh `stat` để xem thông tin inode của tệp, bao gồm số inode, loại tệp, quyền, chủ sở hữu, kích thước tệp, thời gian sửa đổi.

Nói đơn giản: inode dùng để duy trì các thông tin như tệp được chia thành mấy phần, địa chỉ của từng phần, chủ sở hữu tệp, thời gian tạo, quyền, kích thước,...

Tổng kết lại inode và block:

- **inode**: ghi thông tin thuộc tính của tệp, có thể dùng lệnh `stat` để xem thông tin inode.
- **block/extent**: dùng để lưu nội dung tệp hoặc mô tả phạm vi các data block liên tục. Cách phân bổ và chia sẻ cụ thể phụ thuộc vào hệ thống tệp, không thể khái quát thành "một block luôn chỉ thuộc về một tệp".

![Xem thông tin inode của tệp bằng lệnh stat](./images/文件inode信息.png)

Hệ thống tệp Linux/Unix dùng inode để định danh các đối tượng trong hệ thống tệp (filesystem object). Khi đổi tên tệp trong cùng một hệ thống tệp, thông thường chỉ sửa đổi mục thư mục (directory entry), số inode không thay đổi; sau khi xóa hard link cuối cùng, nếu cũng không có tiến trình nào tiếp tục mở tệp đó, inode sẽ được giải phóng, số của nó sau này có thể được tái sử dụng. Khi truy cập tệp qua đường dẫn vẫn phải phân giải directory entry trước, không thể bỏ qua bước tìm kiếm đường dẫn rồi trực tiếp coi số inode như một định danh tệp toàn cục ổn định.

Tuy nhiên, việc dùng số inode cũng khiến hệ thống tệp trở nên trừu tượng và phức tạp hơn ở tầng người dùng và ứng dụng, cần thông qua lệnh hệ thống hoặc giao diện hệ thống tệp để truy cập và quản lý thông tin inode của tệp.

### Hard link và soft link

Trên hệ thống Linux/giống Unix, cách triển khai hard link và symbol link khác nhau: hard link là một directory entry khác trỏ đến cùng một inode, còn symbol link là tệp đặc biệt có inode độc lập.

**1、Hard Link**

- Trong hệ thống tệp Linux/giống Unix, mỗi tệp và thư mục đều có một số inode duy nhất, dùng để định danh tệp hoặc thư mục đó. Hard link tạo kết nối qua số inode, hard link và tệp nguồn có cùng số inode, cả hai hoàn toàn bình đẳng đối với hệ thống tệp (có thể xem chúng là hard link lẫn nhau, bản chất là cùng một tệp), xóa bất kỳ cái nào trong đó đều không ảnh hưởng đến cái còn lại, có thể đặt hard link cho tệp để phòng tránh xóa nhầm tệp quan trọng.
- Chỉ khi xóa cả tệp nguồn và tất cả các tệp hard link tương ứng, tệp đó mới thực sự bị xóa.
- Hard link có một số hạn chế, không thể tạo hard link cho thư mục và tệp không tồn tại, đồng thời hard link cũng không thể vượt qua ranh giới hệ thống tệp.
- Lệnh `ln` dùng để tạo hard link.

**2、Symbolic Link (Symbolic Link hoặc Symlink)**

- Symbolic link và tệp nguồn có số inode khác nhau, mà trỏ đến một đường dẫn tệp.
- Sau khi xóa tệp nguồn, symlink vẫn tồn tại, nhưng trỏ đến một đường dẫn tệp không hợp lệ.
- Symlink tương tự như shortcut (lối tắt) trong hệ thống Windows.
- Khác với hard link, có thể tạo symlink cho thư mục hoặc tệp không tồn tại, và symlink có thể vượt qua ranh giới hệ thống tệp.
- Lệnh `ln -s` dùng để tạo symlink.

**Tại sao hard link không thể vượt qua ranh giới hệ thống tệp?**

Chúng ta đã đề cập ở trên, hard link tạo kết nối qua số inode, và hard link chia sẻ cùng số inode với tệp nguồn.

Mỗi hệ thống tệp đều có không gian tên inode độc lập, directory entry chỉ có thể tham chiếu inode trong cùng hệ thống tệp, không thể trực tiếp trỏ đến inode trong hệ thống tệp khác. Do đó, hard link không thể vượt qua ranh giới hệ thống tệp, đây không phải là vấn đề đơn giản về xung đột số inode.

### Các loại tệp trong Linux

Linux hỗ trợ rất nhiều loại tệp, trong đó các loại tệp rất quan trọng gồm: **tệp thông thường**, **tệp thư mục**, **tệp liên kết**, **tệp thiết bị**, **tệp ống dẫn (pipe)**, **tệp Socket** v.v.

- **Tệp thông thường (-)**: dùng để lưu trữ thông tin và dữ liệu, người dùng Linux có thể xem, sửa đổi và xóa tệp thông thường tùy theo quyền truy cập. Ví dụ: hình ảnh, âm thanh, PDF, text, video, mã nguồn, v.v.
- **Tệp thư mục (d, directory file)**: thư mục cũng là một loại tệp, dùng để biểu thị và quản lý các tệp trong hệ thống, tệp thư mục chứa một số tên tệp và tên thư mục con. Thực chất mở thư mục chính là mở tệp thư mục.
- **Tệp symbolic link (l, symbolic link)**: lưu chuỗi đường dẫn đích. Khi truy cập symbolic link, kernel sẽ phân giải lại đích theo đường dẫn này.
- **Thiết bị ký tự (c, char)**: dùng để truy cập thiết bị ký tự như bàn phím.
- **Tệp thiết bị (b, block)**: dùng để truy cập thiết bị khối như ổ cứng, ổ mềm.
- **Tệp ống dẫn (p, pipe)**: một loại tệp đặc biệt, dùng để giao tiếp giữa các tiến trình.
- **Tệp socket (s, socket)**: dùng cho giao tiếp mạng giữa các tiến trình, cũng có thể dùng cho giao tiếp phi mạng giữa các máy cùng một máy.

Mỗi loại tệp đều có mục đích và thuộc tính khác nhau, có thể dùng các lệnh như `ls`, `file` v.v. để xem thông tin loại tệp.

```bash
# 普通文件（-）
-rw-r--r--  1 user  group  1024 Apr 14 10:00 file.txt

# 目录文件（d，directory file）
drwxr-xr-x  2 user  group  4096 Apr 14 10:00 directory/

# 套接字文件(s，socket)
srwxrwxrwx  1 user  group    0 Apr 14 10:00 socket
```

### Cây thư mục Linux

Linux sử dụng một cấu trúc phân cấp gọi là cây thư mục để tổ chức các tệp và thư mục. Cây thư mục lấy thư mục gốc (/) làm điểm bắt đầu, kéo dài xuống dưới, tạo thành một loạt các thư mục và thư mục con. Mỗi thư mục có thể chứa tệp và các thư mục con khác. Cấu trúc phân cấp rõ ràng, giống như một cái cây bị lật ngược.

![Cấu trúc thư mục của Linux](./images/Linux目录树.png)

**Giải thích các thư mục phổ biến:**

- **/bin：** chứa các tệp thực thi nhị phân (ls、cat、mkdir v.v.), các lệnh thường dùng thường nằm ở đây.
- **/etc：** chứa các tệp quản lý và cấu hình hệ thống.
- **/home：** thư mục gốc chứa tất cả tệp của người dùng, là điểm gốc của thư mục chính người dùng, ví dụ thư mục chính của người dùng user là /home/user, có thể biểu thị bằng ~user.
- **/usr：** dùng để chứa các ứng dụng hệ thống.
- **/opt：** vị trí đặt các gói ứng dụng tùy chọn cài đặt thêm. Thông thường, chúng ta có thể cài tomcat v.v. vào đây.
- **/proc：** thư mục hệ thống tệp ảo, là ánh xạ của bộ nhớ hệ thống. Có thể truy cập trực tiếp vào thư mục này để lấy thông tin hệ thống.
- **/root：** thư mục chính của siêu người dùng (quản trị viên hệ thống) (tầng đặc quyền ^o^).
- **/sbin：** chứa các tệp thực thi nhị phân, chỉ có root mới truy cập được. Ở đây chứa các lệnh và chương trình quản lý cấp hệ thống dùng cho quản trị viên hệ thống. Ví dụ như ifconfig v.v.
- **/dev：** dùng để chứa tệp thiết bị.
- **/mnt：** điểm gắn kết (mount point) để quản trị viên hệ thống gắn hệ thống tệp tạm thời, hệ thống cung cấp thư mục này để người dùng tạm thời gắn kết các hệ thống tệp khác.
- **/boot：** chứa các tệp dùng khi khởi động hệ thống.
- **/lib 和 /lib64：** chứa các tệp thư viện liên quan đến hoạt động của hệ thống.
- **/tmp：** dùng để chứa các tệp tạm thời khác nhau, là điểm lưu trữ tệp tạm dùng chung.
- **/var：** dùng để chứa các tệp cần thay đổi dữ liệu trong lúc chạy, cũng là vùng tràn cho một số tệp lớn, ví dụ như tệp nhật ký của các dịch vụ khác nhau (nhật ký khởi động hệ thống v.v.).
- **/lost+found：** thư mục này bình thường trống, các tệp "không nơi nương tựa" còn sót lại do hệ thống tắt máy bất thường (tên gọi trong Windows là .chk) nằm ở đây.

## Các lệnh Linux thường dùng

Dưới đây chỉ đưa ra một số lệnh tương đối phổ biến.

Giới thiệu một trang web tra nhanh lệnh Linux, rất hay, nếu mọi người quên lệnh nào hoặc không hiểu lệnh nào đều có thể tìm được giải đáp ở đây. Sổ tay tra nhanh trực tuyến lệnh Linux: <https://wangchujiang.com/linux-command/>.

![Tra nhanh lệnh Linux](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/linux-command-search.png)

Ngoài ra, trang web [shell.how](https://www.shell.how/) có thể dùng để giải thích ý nghĩa của các lệnh phổ biến, giúp bạn học các lệnh cơ bản của Linux và các lệnh thường dùng khác (như Git, NPM).

![Ví dụ sử dụng shell.how](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/linux/shell-now.png)

### Chuyển đổi thư mục

- `cd usr`：chuyển đến thư mục usr trong thư mục hiện tại.
- `cd ..（或 cd../）`：chuyển lên thư mục cấp trên.
- `cd /`：chuyển đến thư mục gốc hệ thống.
- `cd ~`：chuyển đến thư mục chính của người dùng.
- **`cd -`：** chuyển đến thư mục của thao tác trước đó.

### Thao tác thư mục

- `ls`：hiển thị danh sách các tệp và thư mục con trong thư mục. Ví dụ: `ls /home`, hiển thị danh sách tệp và thư mục con trong thư mục `/home`.
- `ll`：`ll` là bí danh (alias) của `ls -l`, lệnh ll có thể xem thông tin chi tiết của tất cả các thư mục và tệp trong thư mục đó.
- `mkdir [tùy chọn] tên thư mục`：tạo thư mục mới (thêm). Ví dụ: `mkdir -m 755 my_directory`, tạo một thư mục mới tên là `my_directory` và đặt quyền là 755, trong đó chủ sở hữu có quyền đọc, ghi, thực thi, nhóm sở hữu và người dùng khác chỉ có quyền đọc, thực thi, không thể sửa đổi nội dung thư mục (như tạo hoặc xóa tệp). Nếu muốn tất cả người dùng (gồm cả nhóm sở hữu và người dùng khác) đều có quyền đọc, ghi, thực thi đối với thư mục, thì nên đặt quyền là `777`, tức: `mkdir -m 777 my_directory`.
- `find [đường dẫn] [biểu thức]`：tìm kiếm tệp hoặc thư mục trong thư mục chỉ định và các thư mục con của nó (tra), rất mạnh mẽ và linh hoạt. Ví dụ: ① liệt kê tất cả tệp và thư mục trong thư mục hiện tại và các thư mục con: `find .`; ② tìm trong thư mục `/home` các tên tệp kết thúc bằng `.txt`: `find /home -name "*.txt"`, bỏ qua phân biệt hoa thường: `find /home -iname "*.txt"`; ③ tìm trong thư mục hiện tại và thư mục con tất cả tệp kết thúc bằng `.txt` và `.pdf`: `find . \( -name "*.txt" -o -name "*.pdf" \)` hoặc `find . -name "*.txt" -o -name "*.pdf"`.
- `pwd`：hiển thị đường dẫn của thư mục làm việc hiện tại.
- `rmdir [tùy chọn] tên thư mục`：xóa thư mục rỗng (xóa). Ví dụ: `rmdir -p my_directory`, xóa thư mục rỗng tên là `my_directory`, và sẽ đệ quy xóa các thư mục cha rỗng của `my_directory`, cho đến khi gặp thư mục không rỗng hoặc thư mục gốc.
- `rm [tùy chọn] tên tệp hoặc thư mục`：xóa tệp/thư mục (xóa). Ví dụ: `rm -r my_directory`, xóa thư mục tên là `my_directory`, `-r` (recursive, đệ quy) biểu thị sẽ đệ quy xóa thư mục được chỉ định cùng tất cả các thư mục con và tệp trong đó.
- `cp [tùy chọn] tệp/thư mục nguồn tệp/thư mục đích`：sao chép tệp hoặc thư mục (di chuyển). Ví dụ: `cp file.txt /home/file.txt`, sao chép tệp `file.txt` vào thư mục `/home` và đổi tên thành `file.txt`. `cp -r source destination`, sao chép thư mục `source` cùng tất cả các thư mục con và tệp trong đó vào thư mục `destination`, và giữ nguyên thuộc tính tệp nguồn và cấu trúc thư mục.
- `mv [tùy chọn] tệp/thư mục nguồn tệp/thư mục đích`：di chuyển tệp hoặc thư mục (di chuyển), cũng có thể dùng để đổi tên tệp hoặc thư mục. Ví dụ: `mv file.txt /home/file.txt`, di chuyển tệp `file.txt` vào thư mục `/home` và đổi tên thành `file.txt`. Kết quả của `mv` và `cp` khác nhau, `mv` giống như "chuyển nhà" của tệp, số lượng tệp không tăng lên. Còn `cp` thực hiện sao chép tệp, số lượng tệp tăng lên.

### Thao tác tệp

Những lệnh áp dụng cho cả tệp và thư mục như `mv`, `cp`, `rm` v.v. thì không liệt kê lại ở đây.

- `touch [tùy chọn] tên tệp..`：tạo tệp mới hoặc cập nhật tệp đã tồn tại (thêm). Ví dụ: `touch file1.txt file2.txt file3.txt`, tạo 3 tệp.
- `ln [tùy chọn] <tệp nguồn> <tệp hard link/symlink>`：tạo hard link/symlink. Ví dụ: `ln -s file.txt file_link`, tạo symlink tên là `file_link`, trỏ đến tệp `file.txt`. Tùy chọn `-s` biểu thị tạo symlink, s là symbolic (symlink hay còn gọi là symbolic link).
- `cat/more/less/tail tên tệp`：xem tệp (tra). Lệnh `tail -f tệp` có thể giám sát động một tệp nào đó, ví dụ như tệp nhật ký của Tomcat, sẽ thay đổi theo chương trình chạy, có thể dùng `tail -f catalina-2016-11-11.log` để giám sát sự thay đổi của tệp.
- `vim tên tệp`：sửa đổi nội dung tệp (sửa). Trình soạn thảo vim là một thành phần mạnh mẽ trong Linux, là bản nâng cấp của trình soạn thảo vi, các lệnh và phím tắt của vim rất nhiều, nhưng không trình bày từng cái ở đây, mọi người cũng không cần nghiên cứu quá sâu, chỉ cần biết cách dùng vim để sửa đổi tệp là được. Trong lập trình thực tế, tác dụng chính của trình soạn thảo vim là sửa đổi tệp cấu hình, dưới đây là các bước chung: `vim tệp ------> vào tệp -----> chế độ lệnh ------> nhấn i vào chế độ soạn thảo -----> soạn thảo tệp -------> nhấn Esc vào chế độ dòng đáy -----> nhập：wq/q!` (nhập wq biểu thị ghi nội dung và thoát, tức là lưu; nhập q! biểu thị thoát cưỡng bức không lưu).

### Nén tệp

**1）Đóng gói và nén tệp:**

Các tệp đóng gói trong Linux thường kết thúc bằng `.tar`, các lệnh nén thường kết thúc bằng `.gz`. Còn thông thường đóng gói và nén thực hiện cùng lúc, hậu tố của tệp sau khi đóng gói và nén thường là `.tar.gz`.

Lệnh: `tar -zcvf tên tệp sau khi đóng gói nén các tệp cần đóng gói nén`, trong đó:

- z：gọi lệnh nén gzip để nén.
- c：đóng gói tệp.
- v：hiển thị quá trình chạy.
- f：chỉ định tên tệp.

Ví dụ: giả sử trong thư mục test có ba tệp lần lượt là: `aaa.txt`, `bbb.txt`, `ccc.txt`, nếu muốn đóng gói thư mục `test` và chỉ định tên gói nén sau khi nén là `test.tar.gz` có thể dùng lệnh: `tar -zcvf test.tar.gz aaa.txt bbb.txt ccc.txt` hoặc `tar -zcvf test.tar.gz /test/`.

**2）Giải nén gói nén:**

Lệnh: `tar [-xvf] tệp nén`

Trong đó x biểu thị giải nén.

Ví dụ:

- Giải nén `test.tar.gz` trong `/test` vào thư mục hiện tại có thể dùng lệnh: `tar -xvf test.tar.gz`.
- Giải nén test.tar.gz trong /test vào thư mục gốc /usr: `tar -xvf test.tar.gz -C /usr` (`-C` biểu thị chỉ định vị trí giải nén).

### Truyền tệp

- `scp [tùy chọn] tệp nguồn tệp từ xa` (scp tức là secure copy, sao chép an toàn)：dùng để truyền tệp an toàn qua giao thức SSH, có thể thực hiện tải lên từ máy cục bộ đến máy chủ từ xa và tải xuống từ máy chủ từ xa về máy cục bộ. Ví dụ: `scp -r my_directory user@remote:/home/user`, tải thư mục cục bộ `my_directory` lên thư mục `/home/user` của máy chủ từ xa. `scp -r user@remote:/home/user/my_directory`, tải thư mục `my_directory` trong thư mục `/home/user` của máy chủ từ xa về máy cục bộ. Cần lưu ý, lệnh `scp` cần thiết lập kết nối SSH giữa hệ thống cục bộ và hệ thống từ xa để truyền tệp, do đó cần đảm bảo máy chủ từ xa đã cấu hình dịch vụ SSH, và có quyền hạn cùng phương thức xác thực chính xác.
- `rsync [tùy chọn] tệp nguồn tệp từ xa`：có thể sao chép tệp một cách hiệu quả giữa hệ thống cục bộ và hệ thống từ xa, đồng thời thông minh xử lý sao chép gia tăng (incremental), tiết kiệm băng thông và thời gian. Ví dụ: `rsync -r my_directory user@remote:/home/user`, tải thư mục cục bộ `my_directory` lên thư mục `/home/user` của máy chủ từ xa.
- `ftp`（File Transfer Protocol）：cung cấp một cách đơn giản để kết nối máy chủ FTP từ xa và thực hiện các thao tác tải lên, tải xuống, xóa tệp v.v. Trước khi dùng cần kết nối đăng nhập máy chủ FTP từ xa, sau khi vào giao diện dòng lệnh FTP, có thể dùng lệnh `put` để tải tệp cục bộ lên máy chủ từ xa, dùng lệnh `get` để tải tệp của máy chủ từ xa về máy cục bộ, dùng lệnh `delete` để xóa tệp trên máy chủ từ xa. Ở đây không trình diễn nữa.

### Quyền tệp

Trong hệ điều hành, mỗi tệp đều có quyền hạn, người dùng sở hữu và nhóm sở hữu cụ thể. Quyền hạn là cơ chế hệ điều hành dùng để giới hạn việc truy cập tài nguyên, trong Linux quyền hạn thường được chia thành đọc (readable), ghi (writable) và thực thi (executable), chia thành ba nhóm. Lần lượt tương ứng với chủ sở hữu (owner) của tệp, nhóm sở hữu (group) và người dùng khác (other), thông qua cơ chế này để giới hạn người dùng nào, nhóm nào có thể thực hiện thao tác gì đối với tệp cụ thể.

Thông qua lệnh **`ls -l`** chúng ta có thể xem quyền của tệp hoặc thư mục trong một thư mục nào đó.

Ví dụ: chạy `ls -l` trong một thư mục bất kỳ

![Ví dụ lệnh quyền tệp Linux](./images/Linux权限命令.png)

Thông tin trong cột đầu tiên được giải thích như sau:

![Giải thích trường quyền tệp Linux](./images/Linux权限解读.png)

> Dưới đây sẽ giải thích chi tiết về loại tệp, quyền hạn trong Linux cũng như tệp có chủ sở hữu, nhóm sở hữu, các nhóm khác cụ thể là gì?

**Loại tệp:**

- d：biểu thị thư mục.
- -：biểu thị tệp.
- l：biểu thị symlink (có thể coi là lối tắt trong window).

**Quyền hạn trong Linux được chia thành các loại sau:**

- r：biểu thị quyền có thể đọc, r cũng có thể dùng số 4 biểu thị.
- w：biểu thị quyền có thể ghi, w cũng có thể dùng số 2 biểu thị.
- x：biểu thị quyền có thể thực thi, x cũng có thể dùng số 1 biểu thị.

**Sự khác biệt giữa quyền của tệp và thư mục:**

Đối với tệp và thư mục, đọc ghi thực thi biểu thị những ý nghĩa khác nhau.

Đối với tệp:

| Tên quyền |               Thao tác có thể thực hiện |
| :-------- | --------------------------------------: |
| r         | có thể dùng cat để xem nội dung của tệp |
| w         |             có thể sửa đổi nội dung tệp |
| x         |     có thể chạy nó như một tệp nhị phân |

Đối với thư mục:

| Tên quyền |           Thao tác có thể thực hiện |
| :-------- | ----------------------------------: |
| r         |  có thể xem danh sách trong thư mục |
| w         | có thể tạo và xóa tệp trong thư mục |
| x         |       có thể dùng cd để vào thư mục |

Theo truyền thống, root thường có capability cần thiết để bỏ qua kiểm tra điều khiển truy cập tự chủ (DAC) của tệp thông thường, nhưng điều này không có nghĩa nó có thể bỏ qua mọi giới hạn như capabilities, LSM, tùy chọn gắn kết, cờ immutable v.v. Đối tượng có quyền `000` cũng không thể đơn giản khái quát thành root nhất định có thể thực thi hoặc truy cập.

**Trong Linux, mỗi người dùng phải thuộc về một nhóm, không thể đứng ngoài nhóm. Trong Linux, mỗi tệp có khái niệm chủ sở hữu, nhóm sở hữu, các nhóm khác.**

- **Chủ sở hữu (u)**：thường là người tạo ra tệp, ai tạo tệp đó thì tự nhiên trở thành chủ sở hữu của tệp, có thể dùng lệnh `ls ‐ahl` để xem chủ sở hữu của tệp, cũng có thể dùng chown tên người dùng tên tệp để sửa đổi chủ sở hữu của tệp.
- **Nhóm sở hữu của tệp (g)**：khi một người dùng nào đó tạo ra một tệp, nhóm sở hữu của tệp đó chính là nhóm mà người dùng đó thuộc về, có thể dùng lệnh `ls ‐ahl` để xem tất cả các nhóm của tệp, cũng có thể dùng chgrp tên nhóm tên tệp để sửa đổi nhóm sở hữu của tệp.
- **Các nhóm khác (o)**：ngoài chủ sở hữu và người dùng nhóm sở hữu của tệp ra, các người dùng khác của hệ thống đều là nhóm khác của tệp.

> Chúng ta xem tiếp cách sửa đổi quyền của tệp/thư mục.

**Lệnh sửa đổi quyền của tệp/thư mục: `chmod`**

Ví dụ: sửa đổi quyền của aaa.txt trong /test thành chủ sở hữu tệp có toàn quyền, nhóm sở hữu tệp có quyền đọc ghi, người dùng khác chỉ có quyền đọc.

**`chmod u=rwx,g=rw,o=r aaa.txt`** hoặc **`chmod 764 aaa.txt`**

![Ví dụ sửa đổi quyền tệp Linux bằng chmod](./images/修改文件权限.png)

**Bổ sung một thứ tương đối hay dùng:**

Giả sử chúng ta cài một zookeeper, mỗi lần khởi động máy đều cần nó tự động chạy thì phải làm sao?

Các bản phân phối Linux chủ đạo hiện nay về cơ bản dùng systemd để quản lý dịch vụ, cách làm được khuyến nghị là viết một tệp đơn vị `zookeeper.service`, sau đó dùng các lệnh sau để thiết lập tự khởi động khi bật máy:

```bash
sudo systemctl enable zookeeper
sudo systemctl start zookeeper
sudo systemctl status zookeeper
```

Nếu đã sửa đổi tệp service, cần thực hiện trước `sudo systemctl daemon-reload` để systemd tải lại cấu hình. `chkconfig --add zookeeper`, `chkconfig --list` thuộc về cách làm của thời đại SysV init, chỉ khi dùng các bản phân phối cũ hơn hoặc môi trường tương thích mới cần dùng đến.

### Quản lý người dùng

Hệ thống Linux là một hệ điều hành phân chia thời gian (time-sharing) đa người dùng đa tác vụ, bất kỳ người dùng nào muốn dùng tài nguyên hệ thống thì trước tiên phải xin quản trị viên hệ thống một tài khoản, sau đó đăng nhập hệ thống với thân phận của tài khoản đó.

Tài khoản người dùng một mặt giúp quản trị viên hệ thống theo dõi các người dùng đang dùng hệ thống, và kiểm soát quyền truy cập tài nguyên hệ thống của họ; mặt khác cũng giúp người dùng tổ chức tệp, và cung cấp bảo vệ an toàn cho người dùng.

**Các lệnh liên quan đến quản lý người dùng Linux:**

- `useradd [tùy chọn] tên người dùng`：tạo tài khoản người dùng. Tài khoản tạo bằng lệnh `useradd` thực chất được lưu trong tệp văn bản `/etc/passwd`.
- `userdel [tùy chọn] tên người dùng`：xóa tài khoản người dùng.
- `usermod [tùy chọn] tên người dùng`：sửa đổi thuộc tính và cấu hình của tài khoản người dùng như tên người dùng, ID người dùng, thư mục chính.
- `passwd [tùy chọn] tên người dùng`：thiết lập thông tin xác thực của người dùng, bao gồm mật khẩu người dùng, thời gian hết hạn mật khẩu v.v. Ví dụ: `passwd -S tên người dùng` hiển thị trạng thái mật khẩu tài khoản; `passwd -d tên người dùng` sẽ xóa mật khẩu, khiến trường mật khẩu trống, có cho phép đăng nhập bằng mật khẩu trống hay không phụ thuộc vào cấu hình PAM và dịch vụ đăng nhập; `passwd -l tên người dùng` chỉ khóa xác thực bằng mật khẩu, các phương thức xác thực khác như SSH key vẫn có thể dùng được; `passwd tên người dùng` dùng để sửa đổi mật khẩu.
- `su [tùy chọn] tên người dùng`（su tức là Switch User, chuyển người dùng）：chuyển thân phận giữa người dùng đang đăng nhập hiện tại và người dùng khác.

### Quản lý nhóm người dùng

Mỗi người dùng đều có một nhóm người dùng, hệ thống có thể quản lý tập trung tất cả người dùng trong một nhóm người dùng. Các hệ thống Linux khác nhau có quy định khác nhau về nhóm người dùng, như người dùng dưới Linux thuộc về nhóm người dùng trùng tên với nó, nhóm người dùng này được tạo đồng thời khi tạo người dùng.

Việc quản lý nhóm người dùng liên quan đến thêm, xóa và sửa đổi nhóm người dùng. Việc thêm, xóa và sửa đổi nhóm thực chất là cập nhật tệp `/etc/group`.

**Các lệnh liên quan đến quản lý nhóm người dùng trong hệ thống Linux:**

- `groupadd [tùy chọn] nhóm người dùng`：thêm một nhóm người dùng mới.
- `groupdel nhóm người dùng`：xóa một nhóm người dùng đã tồn tại.
- `groupmod [tùy chọn] nhóm người dùng`：sửa đổi thuộc tính của nhóm người dùng.

### Trạng thái hệ thống

- `top [tùy chọn]`：dùng để xem theo thời gian thực mức sử dụng CPU, mức sử dụng bộ nhớ, thông tin tiến trình của hệ thống v.v.
- `htop [tùy chọn]`：tương tự `top`, nhưng cung cấp giao diện tương tác và thân thiện hơn, cho phép người dùng thao tác tương tác, hỗ trợ chủ đề màu sắc, có thể cuộn ngang hoặc dọc để duyệt danh sách tiến trình, và hỗ trợ thao tác chuột.
- `uptime [tùy chọn]`：dùng để xem hệ thống đã chạy tổng cộng bao lâu, tải trung bình của hệ thống v.v.
- `vmstat [khoảng thời gian] [số lần lặp]`：vmstat（Virtual Memory Statistics）có nghĩa là hiển thị trạng thái bộ nhớ ảo, nhưng nó có thể báo cáo trạng thái chạy tổng thể của hệ thống về tiến trình, bộ nhớ, I/O v.v.
- `free [tùy chọn]`：dùng để xem tình trạng sử dụng bộ nhớ của hệ thống, bao gồm bộ nhớ đã dùng, bộ nhớ khả dụng, bộ đệm (buffer) và cache v.v.
- `df [tùy chọn] [hệ thống tệp]`：dùng để xem tình trạng sử dụng dung lượng đĩa của hệ thống, bao gồm tổng dung lượng đĩa, dung lượng đã dùng và dung lượng khả dụng v.v., có thể chỉ định trên hệ thống tệp. Ví dụ: `df -a`, xem tất cả hệ thống tệp.
- `du [tùy chọn] [tệp]`：dùng để xem tình trạng sử dụng dung lượng đĩa của thư mục hoặc tệp được chỉ định, có thể chỉ định các tùy chọn khác nhau để kiểm soát định dạng và đơn vị đầu ra.
- `sar [tùy chọn] [khoảng thời gian] [số lần lặp]`：dùng để thu thập, báo cáo và phân tích thông tin thống kê hiệu suất của hệ thống, bao gồm chi tiết về mức dùng CPU, bộ nhớ, I/O đĩa, hoạt động mạng v.v. Đặc điểm của nó là có thể liên tục lấy mẫu hệ thống, thu được lượng lớn dữ liệu lấy mẫu. Cả dữ liệu lấy mẫu và kết quả phân tích đều có thể lưu vào tệp, khi dùng nó tiêu thụ tài nguyên hệ thống rất ít.
- `ps [tùy chọn]`：dùng để xem thông tin tiến trình trong hệ thống, bao gồm ID tiến trình, trạng thái, tình trạng sử dụng tài nguyên v.v. `ps -ef`/`ps -aux`：hai lệnh này đều dùng để xem các tiến trình đang chạy của hệ thống hiện tại, điểm khác biệt giữa hai lệnh là định dạng hiển thị khác nhau. Nếu muốn xem một tiến trình cụ thể có thể dùng định dạng như thế này: `ps aux|grep redis`（xem các tiến trình chứa chuỗi redis），cũng có thể dùng `pgrep redis -a`.
- `systemctl [lệnh] [tên dịch vụ]`：dùng để quản lý các dịch vụ và đơn vị (unit) của hệ thống, có thể xem trạng thái dịch vụ hệ thống, khởi động, dừng, khởi động lại v.v.
- `journalctl [tùy chọn]`：dùng để xem nhật ký systemd, rất thường dùng khi kiểm tra lỗi khởi động dịch vụ, lỗi hệ thống. Ví dụ: `journalctl -u nginx -f` xem thời gian thực nhật ký dịch vụ nginx, `journalctl -xe` xem ngữ cảnh các lỗi hệ thống gần đây.

### Giao tiếp mạng

- `ping [tùy chọn] máy chủ đích`：kiểm tra kết nối mạng với máy chủ đích.
- `ifconfig` hoặc `ip`：dùng để xem thông tin giao diện mạng của hệ thống, bao gồm địa chỉ IP, địa chỉ MAC, trạng thái của giao diện mạng v.v.
- `netstat [tùy chọn]`：dùng để xem trạng thái kết nối mạng và thông tin thống kê mạng của hệ thống, có thể xem tình trạng kết nối mạng hiện tại, cổng lắng nghe, giao thức mạng v.v.
- `ss [tùy chọn]`：tốt hơn `netstat`, cung cấp thông tin kết nối mạng nhanh hơn, chi tiết hơn.
- `nload`：`sar` và `nload` đều có thể giám sát lưu lượng mạng, nhưng đầu ra của `sar` là dữ liệu dạng văn bản, không trực quan lắm. Còn `nload` là một công cụ chuyên giám sát thời gian thực lưu lượng mạng, cung cấp giao diện terminal đồ họa, trực quan hơn. Tuy nhiên, `nload` không lưu dữ liệu lịch sử, nên không thích hợp để phân tích xu hướng dài hạn. Và hệ thống không cài sẵn nó, cần cài đặt thủ công.
- `sudo hostnamectl set-hostname tên máy chủ mới`：thay đổi tên máy chủ, và vẫn có hiệu lực sau khi khởi động lại. `sudo hostname tên máy chủ mới` cũng có thể thay đổi tên máy chủ. Tuy nhiên cần lưu ý, dùng lệnh `hostname` để thay đổi trực tiếp tên máy chủ chỉ có hiệu lực tạm thời, sau khi hệ thống khởi động lại sẽ trở về tên máy chủ ban đầu.

### Khác

- `sudo + lệnh khác`：thực thi lệnh với thân phận quản trị viên hệ thống, tức là các lệnh thực thi qua sudo giống như do root tự tay thực hiện.
- `grep [tùy chọn] "nội dung tìm kiếm" đường dẫn tệp`：lệnh tìm kiếm văn bản rất mạnh mẽ và thường dùng, nó có thể dựa trên chuỗi hoặc biểu thức chính quy được chỉ định để khớp tìm kiếm trong tệp hoặc đầu ra lệnh, phù hợp với nhiều tình huống như phân tích nhật ký, lọc văn bản, định vị nhanh v.v. Ví dụ: bỏ qua phân biệt hoa thường tìm tất cả các dòng chứa error trong syslog: `grep -i "error" /var/log/syslog`, tìm tất cả các tiến trình liên quan đến java: `ps -ef | grep "java"`.
- `kill -9 pid của tiến trình`：giết tiến trình (-9 biểu thị kết thúc cưỡng bức), trước tiên dùng ps để tìm tiến trình, sau đó dùng kill để giết.
- `shutdown`：`shutdown -h now`：chỉ định tắt máy ngay lập tức; `shutdown +5 "System will shutdown after 5 minutes"`：chỉ định tắt máy sau 5 phút, đồng thời gửi thông báo cảnh báo cho người dùng đã đăng nhập.
- `reboot`：`reboot`：khởi động lại. `reboot -w`：mô phỏng khởi động lại (chỉ ghi lại chứ không thực sự khởi động lại).

## Biến môi trường trong Linux

Trong hệ thống Linux, biến môi trường được dùng để định nghĩa một số tham số của môi trường chạy hệ thống, ví dụ như thư mục chính (HOME) khác nhau của mỗi người dùng.

### Phân loại biến môi trường

Theo phạm vi tác dụng, biến môi trường có thể đơn giản chia thành:

- Biến môi trường cấp người dùng: `~/.bashrc`, `~/.bash_profile`.
- Biến môi trường cấp hệ thống: `/etc/bashrc`, `/etc/environment`, `/etc/profile`, `/etc/profile.d`.

Thứ tự nạp của các tệp cấu hình biến môi trường không cố định một đường thẳng, mà phụ thuộc vào shell hiện tại là login shell, non-login interactive shell hay non-interactive shell. Lấy Bash làm ví dụ, login shell thường đọc `/etc/profile`, sau đó đọc tệp tồn tại và có thể đọc được đầu tiên trong `~/.bash_profile`, `~/.bash_login` hoặc `~/.profile` ở thư mục người dùng; interactive không phải login shell thường đọc `~/.bashrc`. Nhiều bản phân phối nạp thủ công `~/.bashrc` trong `~/.bash_profile`, nên chuỗi nạp mà bạn thực sự thấy còn chịu ảnh hưởng của cấu hình mặc định của bản phân phối.

Nếu muốn sửa đổi tệp biến môi trường cấp hệ thống, cần quản trị viên có quyền ghi vào tệp đó.

Khuyến nghị cấu hình biến môi trường cấp người dùng trong `~/.bash_profile`, biến môi trường cấp hệ thống trong `/etc/profile.d`.

Theo vòng đời, biến môi trường có thể đơn giản chia thành:

- Vĩnh viễn: cần người dùng sửa đổi tệp cấu hình liên quan, biến có hiệu lực vĩnh viễn.
- Tạm thời: người dùng dùng lệnh `export` để khai báo biến môi trường trong terminal hiện tại, đóng shell terminal thì hết hiệu lực.

### Đọc biến môi trường

Thông qua lệnh `export` có thể xuất ra tất cả các biến môi trường mà hệ thống hiện tại định nghĩa.

```bash
# 列出当前的环境变量值
export -p
```

Ngoài lệnh `export` ra, lệnh `env` cũng có thể liệt kê tất cả biến môi trường.

Lệnh `echo` có thể xuất ra giá trị của biến môi trường được chỉ định.

```bash
# 输出当前的PATH环境变量的值
echo $PATH
# 输出当前的HOME环境变量的值
echo $HOME
```

### Sửa đổi biến môi trường

Thông qua lệnh `export` có thể sửa đổi biến môi trường được chỉ định. Tuy nhiên, cách sửa đổi biến môi trường này chỉ có hiệu lực đối với shell terminal hiện tại, đóng shell terminal sẽ hết hiệu lực. Sau khi sửa đổi xong, hiệu lực ngay lập tức.

```bash
export JAVA_HOME="/path/to/jdk"
export PATH="$JAVA_HOME/bin:$PATH"
```

Thông qua lệnh `vim` sửa đổi tệp cấu hình biến môi trường. Cách sửa đổi biến môi trường này có hiệu lực vĩnh viễn.

```bash
vim ~/.bash_profile
```

Nếu sửa đổi biến môi trường cấp hệ thống thì có hiệu lực với tất cả người dùng, nếu sửa đổi biến môi trường cấp người dùng thì chỉ có hiệu lực với người dùng hiện tại.

Sau khi sửa đổi xong, cần dùng lệnh `source` để nó có hiệu lực hoặc đóng shell terminal rồi đăng nhập lại.

```bash
source ~/.bash_profile
```

<!-- @include: @article-footer.snippet.md -->
