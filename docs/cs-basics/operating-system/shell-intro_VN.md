---
title: "Tổng kết kiến thức cơ bản về lập trình Shell"
description: "Lập trình Shell rất hữu ích trong công việc phát triển hằng ngày. Hiện tại, ngôn ngữ tự động hóa vận hành phổ biến nhất trên hệ thống Linux là Shell và Python. Bài viết này mình sẽ tổng kết ngắn gọn kiến thức nền tảng về lập trình Shell, giúp bạn làm quen với Shell!"
category: Kiến thức máy tính cơ bản
tag:
  - Hệ điều hành
  - Linux
head:
  - - meta
    - name: keywords
      content: Shell,剧本,命令,自动化,运维,Linux,基础语法
---

Lập trình Shell rất hữu ích trong công việc phát triển hằng ngày. Hiện tại, ngôn ngữ tự động hóa vận hành phổ biến nhất trên hệ thống Linux là Shell và Python.

Bài viết này mình sẽ tổng kết ngắn gọn kiến thức nền tảng về lập trình Shell, giúp bạn làm quen với Shell!

## Ghi chú về phiên bản

**Các ví dụ trong bài áp dụng cho bash 4.0+**. Các phiên bản bash khác nhau có thể có sự khác biệt ở một số tính năng, đặc biệt là:

- **Mảng**: bash 2.0+ hỗ trợ, POSIX sh thuần (như dash) không hỗ trợ.
- **Một số thao tác chuỗi**: như `${var:offset:length}` có thể không được hỗ trợ ở các phiên bản cũ.
- **Mở rộng số học `$((...))`**: bash 2.0+ hỗ trợ.

Kiểm tra phiên bản bash của bạn:

```shell
bash --version
# hoặc
echo $BASH_VERSION
```

## Bước vào cánh cửa lập trình Shell

### Tại sao nên học Shell?

Khi học một thứ gì đó, phần lớn chúng ta đều hướng đến tính thực dụng. Về góc độ công việc, học Shell là để nâng cao hiệu quả làm việc của bản thân, tăng năng suất, giúp chúng ta hoàn thành nhiều việc hơn trong khoảng thời gian ngắn hơn.

Nhiều người cho rằng lập trình Shell thuộc về kiến thức vận hành (Operational/DevOps), nên việc đó nên để cho nhân viên vận hành làm, còn chúng ta làm backend không cần thiết phải học. Mình thấy quan điểm này hoàn toàn sai lầm. So với những người chuyên làm vận hành Linux, yêu cầu về mức độ nắm vững lập trình Shell của chúng ta thấp hơn, nhưng Shell vẫn là thứ nhất định phải nắm!

Hiện tại, ngôn ngữ tự động hóa vận hành phổ biến nhất trên hệ thống Linux là Shell và Python.

Giữa hai cái, Shell gần như là ngôn ngữ lập trình tự động hóa vận hành bắt buộc phải dùng trong các doanh nghiệp CNTT, đặc biệt trong các khâu như giám sát dịch vụ, triển khai nghiệp vụ nhanh, khởi động/dừng dịch vụ, sao lưu và xử lý dữ liệu, phân tích nhật ký trong công việc vận hành, Shell là thứ không thể thiếu. Python phù hợp hơn để xử lý logic nghiệp vụ phức tạp, phát triển các công cụ phần mềm vận hành phức tạp, triển khai truy cập qua web... Shell là một trình thông dịch lệnh, giải thích và thực thi các lệnh, chương trình mà người dùng nhập vào. Cứ nhập lệnh là sẽ được phản hồi ngay theo kiểu đối thoại tương tác.

Ngoài ra, hiểu biết về lập trình Shell cũng là yêu cầu của hầu hết các công ty internet khi tuyển dụng nhân sự phát triển backend. Dưới đây là hình minh họa mình trích từ một số công ty internet nổi tiếng về yêu cầu lập trình Shell.

![Yêu cầu về kỹ năng lập trình shell của các công ty internet lớn](https://oss.javaguide.cn/github/javaguide/cs-basics/shell/60190220.jpg)

### What is Shell?

**Shell là trình thông dịch lệnh của hệ thống Linux/Unix**, nó đóng vai trò cầu nối giữa người dùng và nhân hệ điều hành (kernel), chịu trách nhiệm nhận lệnh người dùng nhập vào và gọi chương trình tương ứng.

**Lập trình Shell** là quá trình kết hợp các lệnh, cấu trúc điều khiển (if/for/while), biến và hàm thành tập lệnh tự động hóa thông qua trình thông dịch Shell (như bash). Shell vừa là trình thông dịch lệnh, vừa là một ngôn ngữ lập trình hoàn chỉnh (hỗ trợ biến, mảng, hàm, điều khiển luồng, pipe, chuyển hướng...).

**Các loại Shell phổ biến**:

- **bash** (Bourne Again Shell): Shell mặc định của hệ thống Linux, được dùng nhiều nhất.
- **sh** (Bourne Shell): Shell truyền thống của Unix, chuẩn POSIX.
- **zsh**: Shell tương tác mạnh mẽ.
- **dash**: Shell nhẹ, /bin/sh của Ubuntu mặc định trỏ tới nó.
- **csh/tcsh**: Shell theo phong cách C.

### Hello World trong lập trình Shell

Việc đầu tiên khi học bất kỳ ngôn ngữ lập trình nào chính là xuất ra Hello World! Dưới đây mình sẽ hướng dẫn từ bước tạo file đến viết mã Shell để biết cách xuất Hello World trong lập trình Shell.

(1) Tạo một file mới helloworld.sh: `touch helloworld.sh`, phần mở rộng là sh (sh đại diện cho Shell) (phần mở rộng không ảnh hưởng đến việc thực thi script, chỉ cần thấy tên là hiểu ý nghĩa là được; nếu bạn dùng php để viết script Shell thì phần mở rộng cứ dùng php).

(2) Cấp quyền thực thi cho script: `chmod +x helloworld.sh`

(3) Dùng lệnh vim để sửa file helloworld.sh: `vim helloworld.sh` (vim file------>vào file----->chế độ lệnh------>bấm i vào chế độ chỉnh sửa----->chỉnh sửa file------->bấm Esc vào chế độ dòng dưới----->nhập :wq/q! (nhập wq nghĩa là ghi nội dung và thoát, tức lưu lại; nhập q! nghĩa là buộc thoát không lưu.))

Nội dung helloworld.sh như sau:

```shell
#!/bin/bash
set -euo pipefail  # Chế độ nghiêm ngặt: lỗi thì thoát, biến chưa định nghĩa thì báo lỗi, lỗi pipeline thì báo lỗi
# Script shell nhỏ đầu tiên, echo là lệnh xuất dữ liệu trong Linux
echo "helloworld!"
```

Trong Shell, ký tự `#` tượng trưng cho chú thích. **Dòng đầu tiên của Shell khá đặc biệt, thường bắt đầu bằng `#!` để chỉ định loại Shell được sử dụng. Trong Linux, ngoài bash Shell còn có nhiều phiên bản Shell khác, ví dụ zsh, dash... vậy nhưng bash Shell vẫn là loại chúng ta sử dụng nhiều nhất.**

(4) Chạy script: `./helloworld.sh`。(Lưu ý, nhất định phải viết `./helloworld.sh`, không phải `helloworld.sh`. Chạy những chương trình nhị phân khác cũng vậy, nếu viết trực tiếp `helloworld.sh`, hệ thống Linux sẽ tìm trong PATH xem có tên helloworld.sh hay không, mà chỉ có /bin、/sbin、/usr/bin、/usr/sbin... nằm trong PATH, thư mục hiện tại của bạn thường không nằm trong PATH, nên nếu viết `helloworld.sh` sẽ báo không tìm thấy lệnh; phải dùng `./helloworld.sh` để bảo hệ thống rằng, cứ tìm trong thư mục hiện tại.)

![shell 编程Hello World](https://oss.javaguide.cn/github/javaguide/cs-basics/shell/55296212.jpg)

## Biến trong Shell

### Giới thiệu về biến trong lập trình Shell

**Trong lập trình Shell thường chia ra ba loại biến:**

1. **Biến tự định nghĩa (biến cục bộ)**: Mặc định chỉ có hiệu lực trong tiến trình Shell hiện tại, **tiến trình con không thể truy cập**. Nếu cần truyền cho tiến trình con, phải dùng `export` khai báo là biến môi trường.
2. **Biến môi trường**: ví dụ `PATH`, `HOME`..., có thể được tiến trình con kế thừa. Dùng lệnh `env` để xem tất cả biến môi trường, lệnh `set` để xem tất cả biến (bao gồm biến môi trường và biến cục bộ).
3. **Biến đặc biệt của Shell**: các biến đặc biệt do Shell thiết lập (như `$?`, `$$`, `$!`...), dùng để lưu trạng thái tiến trình, tham số v.v.

**Các biến môi trường thường dùng:**

> PATH quyết định Shell sẽ tìm lệnh hoặc chương trình ở những thư mục nào.
> HOME thư mục chính của người dùng hiện tại.
> HISTSIZE số lượng lịch sử lệnh.
> LOGNAME tên đăng nhập của người dùng hiện tại.
> HOSTNAME tên gọi của máy chủ.
> SHELL loại Shell của người dùng hiện tại.
> LANGUAGE biến môi trường liên quan ngôn ngữ, khi đa ngôn ngữ có thể sửa biến môi trường này.
> MAIL thư mục lưu thư của người dùng hiện tại.
> PS1 dấu nhắc cơ bản, với root là #, với người dùng thường là \$.

**Sử dụng biến môi trường đã được định nghĩa trong Linux:**

Ví dụ muốn xem thư mục người dùng hiện tại có thể dùng lệnh: `echo $HOME`; nếu muốn xem loại Shell của người dùng hiện tại có thể dùng lệnh `echo $SHELL`. Có thể thấy, cách sử dụng rất đơn giản.

**Sử dụng biến tự định nghĩa:**

```shell
#!/bin/bash
#biến tự định nghĩa hello
hello="hello world"
echo $hello
echo  "helloworld!"
```

![Sử dụng biến tự định nghĩa](https://oss.javaguide.cn/github/javaguide/cs-basics/shell/19835037.jpg)

**Lưu ý khi đặt tên biến trong lập trình Shell:**

- Tên chỉ được dùng chữ cái tiếng Anh, số và gạch dưới, ký tự đầu tiên không được là số, nhưng có thể dùng gạch dưới (\_) ở đầu.
- Ở giữa không được có khoảng trắng, có thể dùng gạch dưới (\_).
- Không được dùng dấu câu.
- Không được dùng từ khóa của bash (dùng lệnh help để xem các từ khóa dành riêng).

### Làm quen với chuỗi trong Shell

Chuỗi là kiểu dữ liệu được dùng nhiều và hữu ích nhất trong lập trình Shell (ngoài số và chuỗi, cũng chẳng có kiểu dữ liệu nào khác dùng được), chuỗi có thể dùng dấu nháy đơn, cũng có thể dùng dấu nháy kép. Điều này khác biệt với Java.

Trong dấu nháy đơn, mọi ký tự đặc biệt (như `$`, backtick (dấu huyền), `\`...) đều mất đi ý nghĩa đặc biệt và được xem là ký tự thường (literal).

Trong dấu nháy kép, các ký tự sau giữ nguyên ý nghĩa đặc biệt:

- `$`: mở rộng biến (như `$var`) và thay thế lệnh (như `$(cmd)` hoặc `` `cmd` ``)
- `\`: ký tự thoát (escape)
- `` ` `` hoặc `$()`: thay thế lệnh (khuyên dùng cú pháp `$()`)
- `!`: mở rộng lịch sử (mặc định chỉ bật trong Shell tương tác)
- `${}`: mở rộng tham số

**Lưu ý**: chuỗi trong dấu nháy đơn là **hoàn toàn khai báo trực tiếp (literal)**, chuỗi trong dấu nháy kép sẽ thực hiện thay thế biến và lệnh.

**Chuỗi dấu nháy đơn:**

```shell
#!/bin/bash
name='SnailClimb'
hello='Hello, I am $name!'
echo $hello
```

Nội dung xuất ra:

```plain
Hello, I am $name!
```

**Chuỗi dấu nháy kép:**

```shell
#!/bin/bash
name='SnailClimb'
hello="Hello, I am $name!"
echo $hello
```

Nội dung xuất ra:

```plain
Hello, I am SnailClimb!
```

### Các thao tác chuỗi phổ biến trong Shell

**Nối chuỗi:**

```shell
#!/bin/bash
name="SnailClimb"
# Nối chuỗi bằng dấu nháy kép
greeting="hello, "$name" !"
greeting_1="hello, ${name} !"
echo $greeting  $greeting_1
# Nối chuỗi bằng dấu nháy đơn
greeting_2='hello, '$name' !'
greeting_3='hello, ${name} !'
echo $greeting_2  $greeting_3
```

Kết quả xuất ra:

![Kết quả xuất ra của lệnh nối chuỗi Shell](https://oss.javaguide.cn/github/javaguide/cs-basics/shell/51148933.jpg)

**Lấy độ dài chuỗi:**

```shell
#!/bin/bash
# Lấy độ dài chuỗi
name="SnailClimb"
# Cách thứ nhất (khuyến nghị): được bash dựng sẵn
echo ${#name}  # Xuất ra 10
# Cách thứ hai: lệnh bên ngoài (hiệu năng kém hơn)
expr length "$name"
```

Kết quả xuất ra:

```plain
10
10
```

**Ghi chú**:

- Khuyến nghị dùng cú pháp `${#var}`, đây là tính năng dựng sẵn của bash, hiệu năng tốt hơn.
- `expr` là lệnh bên ngoài, cần fork tiến trình, hiệu năng kém hơn.
- **`expr length` là phần mở rộng GNU**, không thuộc chuẩn POSIX. Có thể không được hỗ trợ trên BSD expr của macOS hoặc các hệ thống khác.
- Nếu cần tính khả chuyển (portable), khuyến nghị dùng `${#var}` hoặc `expr "$var" : '.*'` (tương thích POSIX).

Khi dùng lệnh expr, hai bên toán tử trong biểu thức phải có khoảng trắng:

```shell
expr 5+6       # Xuất trực tiếp 5+6 (không có khoảng trắng)
expr 5 + 6     # Xuất 11 (có khoảng trắng)
# Khuyến nghị hơn là dùng mở rộng số học của bash:
echo $((5 + 6))  # Xuất 11
```

Với một số toán tử, chúng ta còn cần dùng ký hiệu `\` để thoát:

```shell
expr 5 * 6       # Xuất lỗi (chưa thoát)
expr 5 \* 6      # Xuất 30 (thoát đúng)
```

**Trích xuất chuỗi con:**

Trích xuất chuỗi con đơn giản:

```shell
#Bắt đầu từ ký tự thứ 0 của chuỗi, trích xuất 10 ký tự về sau (chỉ mục bắt đầu từ 0)
str="SnailClimb is a great man"
echo ${str:0:10} #chạy ra:SnailClimb
```

Trích xuất theo biểu thức:

```shell
#!/bin/bash
# author: amau

var="https://www.runoob.com/linux/linux-shell-variable.html"
# % biểu thị xóa khớp từ phía sau, kết quả ngắn nhất
# %% biểu thị xóa khớp từ phía sau, kết quả khớp dài nhất
# # biểu thị xóa khớp từ đầu, kết quả ngắn nhất
# ## biểu thị xóa khớp từ đầu, kết quả khớp dài nhất
# Lưu ý: * là ký tự đại diện, nghĩa là khớp với số lượng bất kỳ, ký tự bất kỳ
s1=${var%%t*} #h
s2=${var%t*}  #https://www.runoob.com/linux/linux-shell-variable.h
s3=${var%%.*} #https://www
s4=${var#*/}  #/www.runoob.com/linux/linux-shell-variable.html
s5=${var##*/} #linux-shell-variable.html
```

### Mảng trong Shell

**bash 2.0+** hỗ trợ mảng một chiều (không hỗ trợ mảng đa chiều), và không giới hạn kích thước mảng.

**Lưu ý quan trọng**: mảng là **tính năng mở rộng không thuộc POSIX của bash**, POSIX sh thuần (như dash) không hỗ trợ mảng. Nếu cần viết script khả chuyển, nên tránh dùng mảng.

Dưới đây là một ví dụ mã Shell về thao tác mảng, qua ví dụ này mọi người có thể biết cách tạo mảng, lấy độ dài mảng, lấy/xóa phần tử mảng tại vị trí cụ thể, xóa toàn bộ mảng và duyệt mảng.

```shell
#!/bin/bash
array=(1 2 3 4 5);
# Lấy độ dài mảng
length=${#array[@]}
# Hoặc
length2=${#array[*]}
#Xuất độ dài mảng
echo $length #chạy ra：5
echo $length2 #chạy ra：5
# Xuất phần tử thứ ba của mảng
echo ${array[2]} #chạy ra：3
unset 'array[1]' # Xóa phần tử ở chỉ mục 1, tức phần tử thứ hai
for i in "${array[@]}"; do echo "$i"; done # Duyệt mảng, chạy ra：1 3 4 5
unset array; # Xóa tất cả phần tử trong mảng
for i in "${array[@]}"; do echo "$i"; done # Duyệt mảng, phần tử mảng rỗng, không có nội dung nào được xuất
```

**Lưu ý quan trọng: lỗ hổng chỉ mục của mảng**:

Sau khi dùng `unset array[1]` xóa phần tử, mảng sẽ xuất hiện **lỗ hổng chỉ mục**:

```shell
#!/bin/bash
array=(1 2 3 4 5)
echo "Trước khi xóa: ${array[@]}"  # Xuất: 1 2 3 4 5
echo "Giá trị tại chỉ mục 1: ${array[1]}"  # Xuất: 2

unset array[1]  # Xóa phần tử ở chỉ mục 1
echo "Sau khi xóa: ${array[@]}"  # Xuất: 1 3 4 5
echo "Giá trị tại chỉ mục 1: ${array[1]}"  # Xuất: (giá trị rỗng)
echo "Giá trị tại chỉ mục 2: ${array[2]}"  # Xuất: 3 (chỉ mục 2 vẫn còn)

# Khi duyệt, các chỉ mục không liên tục
for index in "${!array[@]}"; do
    echo "Chỉ mục[$index] = ${array[$index]}"
done
# Xuất:
# Chỉ mục[0] = 1
# Chỉ mục[2] = 3
# Chỉ mục[3] = 4
# Chỉ mục[4] = 5
```

**Lưu ý**: sau khi xóa phần tử, nếu dùng `${array[1]}` để truy cập sẽ nhận được giá trị rỗng. Khi duyệt mảng nên dùng `"${!array[@]}"` để lấy các chỉ mục hợp lệ, hoặc dùng `"${array[@]}"` duyệt trực tiếp các giá trị.

## Toán tử cơ bản trong Shell

Lập trình Shell hỗ trợ các loại toán tử sau:

- Toán tử số học
- Toán tử quan hệ
- Toán tử boolean
- Toán tử chuỗi
- Toán tử kiểm tra file

### Toán tử số học

| **Toán tử** | **Mô tả**   | **Ví dụ**                                                        |
| ----------- | ----------- | ---------------------------------------------------------------- |
| **+**       | Cộng        | `expr $a + $b`                                                   |
| **-**       | Trừ         | `expr $a - $b`                                                   |
| **\***      | Nhân        | `expr $a \* $b`(lưu ý dấu sao cần thoát)                         |
| **/**       | Chia        | `expr $b / $a`                                                   |
| **%**       | Chia lấy dư | `expr $b % $a`                                                   |
| **=**       | Gán         | `a=$b` gán giá trị của biến b cho a                              |
| **==**      | Bằng nhau   | `[ "$a" == "$b" ]` dùng để so sánh chuỗi, giống nhau trả về true |
| **!=**      | Khác nhau   | `[ "$a" != "$b" ]` dùng để so sánh chuỗi, khác nhau trả về true  |

**Khuyến nghị dùng mở rộng số học dựng sẵn của bash**:

```shell
#!/bin/bash
a=3; b=3
val=$((a + b))  # Mở rộng số học bash (khuyến nghị)
# Xuất: Total value: 6
echo "Total value: $val"
```

**Ghi chú**:

- `$((...))` là tính năng dựng sẵn của bash, không cần fork tiến trình ngoài, hiệu năng tốt hơn.
- **Không khuyến nghị** dùng lệnh `expr` (cần fork tiến trình, và hai bên toán tử phải có khoảng trắng).
- **Không khuyến nghị** dùng backtick (dấu huyền) `` `...` `` (đã lỗi thời), nên dùng cú pháp `$(...)`.

**Nếu cần tương thích POSIX sh**, có thể dùng:

```shell
val=$(expr "$a" + "$b")  # Tương thích POSIX, nhưng hiệu năng kém
```

### Toán tử quan hệ

Toán tử quan hệ chỉ hỗ trợ số, không hỗ trợ chuỗi, trừ khi giá trị của chuỗi là số.

| **Toán tử** | **Mô tả**                                                 | **Tiếng Anh tương ứng** |
| ----------- | --------------------------------------------------------- | ----------------------- |
| **-eq**     | Kiểm tra hai số có **bằng nhau**                          | equal                   |
| **-ne**     | Kiểm tra hai số có **khác nhau**                          | not equal               |
| **-gt**     | Kiểm tra số bên trái có **lớn hơn** số bên phải           | greater than            |
| **-lt**     | Kiểm tra số bên trái có **nhỏ hơn** số bên phải           | less than               |
| **-ge**     | Kiểm tra số bên trái có **lớn hơn hoặc bằng** số bên phải | greater equal           |
| **-le**     | Kiểm tra số bên trái có **nhỏ hơn hoặc bằng** số bên phải | less equal              |

Qua một ví dụ đơn giản để minh họa cách dùng toán tử quan hệ, chương trình Shell dưới đây có chức năng: khi score=100 thì xuất ra A, ngược lại xuất ra B.

```shell
#!/bin/bash
score=90;
maxscore=100;
if [[ $score -eq $maxscore ]]
then
   echo "A"
else
   echo "B"
fi
```

Kết quả xuất ra:

```plain
B
```

### Toán tử logic

| **Toán tử** | **Mô tả**          | **Ví dụ**                                                      |
| ----------- | ------------------ | -------------------------------------------------------------- |
| **&&**      | Phép **AND** logic | `[[ $a -lt 100 && $b -gt 100 ]]`(cả hai đều đúng mới là đúng)  |
| **\|\|**    | Phép **OR** logic  | `[[ $a -lt 100 \|\| $b -gt 100 ]]`(một trong hai đúng là đúng) |

**Phép toán logic trong mở rộng số học**:

```shell
#!/bin/bash
a=$(( 1 && 0))
# Xuất: 0; phép logic AND chỉ khi cả hai vế tham gia AND đều là 1, kết quả mới là 1; ngược lại kết quả là 0
echo $a;
```

**Thực thi rút gọn (short-circuit) của lệnh (thường dùng trong môi trường sản xuất)**:

Trong tự động hóa vận hành và pipeline CI/CD, thường dùng `&&` và `||` để điều khiển luồng thực thi của chuỗi lệnh, đây được gọi là **thực thi rút gọn (short-circuit)**:

```shell
#!/bin/bash
set -euo pipefail

# &&: chỉ khi lệnh trước thành công (trả về 0) mới thực thi lệnh sau
mkdir -p "/tmp/app_data" && echo "Thư mục đã sẵn sàng"

# ||: chỉ khi lệnh trước thất bại (trả về khác 0) mới thực thi lệnh sau
mkdir -p "/tmp/app_data" || echo "Tạo thư mục thất bại"

# Kết hợp: hình thức phòng vệ điển hình trong môi trường sản xuất
mkdir -p "/tmp/app_data" && echo "Thư mục đã sẵn sàng" || exit 1

# Ví dụ tình huống thực tế
# 1. Kiểm tra file tồn tại rồi mới xóa
[ -f "/tmp/old_file.log" ] && rm "/tmp/old_file.log"

# 2. Khi lệnh thất bại, xuất thông báo lỗi và thoát
cd /app/config || { echo "Không thể vào thư mục cấu hình"; exit 1; }

# 3. Thực thi lệnh có điều kiện
command1 && command2 || command3
# ⚠️ Lưu ý: cách viết này có cạm bẫy!
# - Khi command1 thành công, thực thi command2
# - Khi command1 thất bại, thực thi command3
# - Nhưng nếu command1 thành công mà command2 thất bại, command3 vẫn sẽ thực thi!
#
# ✅ Cách viết an toàn hơn (khuyến nghị):
if command1; then
    command2
else
    command3
fi
#
# Hoặc chỉ dùng tổ hợp && || khi bạn biết chắc command2 sẽ không thất bại
```

**Lưu ý quan trọng**:

- Thực thi rút gọn phụ thuộc vào **mã thoát (Exit Code)** của lệnh: thành công trả về 0, thất bại trả về khác 0.
- Điều này khác với `&&` và `||` bên trong `[[ ]]`, phần sau dùng để kiểm tra điều kiện.
- `command1 && command2 || command3` có cạm bẫy: nếu command1 thành công nhưng command2 thất bại, command3 vẫn sẽ thực thi.
- Trong môi trường sản xuất, mạnh mẽ khuyến nghị dùng cấu trúc if-then-else để đảm bảo logic rõ ràng.

### Toán tử boolean

| **Toán tử** | **Mô tả**                                                                                   | **Ví dụ**                                                   |
| ----------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **!**       | Lấy ngược kết quả biểu thức. Nếu biểu thức là true thì trả về false; ngược lại trả về true. | `[ ! false ]` trả về false, vì `false` là chuỗi không rỗng. |
| **-o**      | Có một biểu thức là true thì trả về true.                                                   | `[ "$a" -lt 20 -o "$b" -gt 100 ]` trả về true.              |
| **-a**      | Cả hai biểu thức đều là true mới trả về true.                                               | `[ "$a" -lt 20 -a "$b" -gt 100 ]` trả về false.             |

### Toán tử chuỗi

| **Toán tử** | **Mô tả**                                  | **Ví dụ**                                |
| ----------- | ------------------------------------------ | ---------------------------------------- |
| **=**       | Kiểm tra hai chuỗi có **bằng nhau**        | `[ "$a" = "$b" ]`                        |
| **!=**      | Kiểm tra hai chuỗi có **khác nhau**        | `[ "$a" != "$b" ]`                       |
| **-z**      | Kiểm tra độ dài chuỗi có phải **0** (zero) | `[ -z "$a" ]` rỗng thì trả về true       |
| **-n**      | Kiểm tra độ dài chuỗi có **khác 0**        | `[ -n "$a" ]` không rỗng thì trả về true |
| **str**     | Trực tiếp kiểm tra chuỗi có rỗng hay không | `[ "$a" ]` không rỗng thì trả về true    |

Ví dụ đơn giản:

```shell
#!/bin/bash
a="abc";
b="efg";
if [[ "$a" = "$b" ]]
then
   echo "a bằng b"
else
   echo "a không bằng b"
fi
```

Chạy ra:

```plain
a không bằng b
```

### Toán tử liên quan đến file

Dùng để kiểm tra các thuộc tính khác nhau của file Unix/Linux (như quyền, loại v.v.).

- **Kiểm tra tồn tại và loại:**
  - **-e file**: kiểm tra file (bao gồm thư mục) có tồn tại hay không.
  - **-f file**: kiểm tra có phải file thường hay không (vừa không phải thư mục vừa không phải file thiết bị).
  - **-d file**: kiểm tra có phải thư mục hay không.
  - **-s file**: kiểm tra file có không rỗng hay không (kích thước file lớn hơn 0 trả về true).
  - **-b/-c/-p**: lần lượt kiểm tra có phải thiết bị block, thiết bị ký tự, pipe có tên (named pipe).
- **Kiểm tra quyền:**
  - **-r file**: kiểm tra file có thể đọc hay không.
  - **-w file**: kiểm tra file có thể ghi hay không.
  - **-x file**: kiểm tra file có thể thực thi hay không.
- **Kiểm tra cờ đặc biệt:**
  - **-u / -g / -k**: lần lượt kiểm tra file có được đặt cờ SUID, SGID hay sticky bit (Sticky Bit) hay không.

Cách sử dụng rất đơn giản, ví dụ chúng ta đã định nghĩa một đường dẫn file `file="/usr/learnshell/test.sh"`, nếu muốn kiểm tra file này có thể đọc hay không, có thể viết `if [ -r $file ]`; nếu muốn kiểm tra file này có thể ghi hay không, có thể viết `-w $file`, rất đơn giản phải không.

## Điều khiển luồng trong Shell

### Câu lệnh điều kiện if

Ví dụ câu lệnh điều kiện if else-if else đơn giản:

```shell
#!/bin/bash
a=3;
b=9;
if [[ $a -eq $b ]]
then
   echo "a bằng b"
elif [[ $a -gt $b ]]
then
   echo "a lớn hơn b"
else
   echo "a nhỏ hơn b"
fi
```

Kết quả xuất ra:

```plain
a nhỏ hơn b
```

Tin chắc qua ví dụ trên mọi người đã nắm được câu lệnh điều kiện if trong lập trình Shell.

**Xử lý câu lệnh rỗng**: trong Shell, câu lệnh rỗng có thể dùng `:` (lệnh dấu hai chấm) hoặc lệnh `true` để thực hiện:

```shell
if [[ condition ]]; then
    :  # Câu lệnh rỗng (không làm gì cả)
fi

# Hoặc
if [[ condition ]]; then
    true  # Câu lệnh rỗng
fi
```

Điều này trong một số tình huống rất hữu ích, ví dụ dùng làm chỗ trống trong vòng lặp while.

### Câu lệnh vòng lặp for

Qua ba ví dụ đơn giản dưới đây để nhận biết cách dùng cơ bản nhất của vòng lặp for, thực tế chức năng của vòng lặp for lớn hơn nhiều so với những gì các ví dụ bạn thấy dưới đây thể hiện.

**Xuất dữ liệu trong danh sách hiện tại:**

```shell
for loop in 1 2 3 4 5
do
    echo "The value is: $loop"
done
```

**Tạo ra 10 số ngẫu nhiên:**

```shell
#!/bin/bash
for i in {0..9};
do
   echo $RANDOM;
done
```

**Xuất 1 đến 5:**

Thông thường khi gọi biến trong Shell cần thêm $, nhưng trong (()) của for thì không cần, dưới đây xem một ví dụ:

```shell
#!/bin/bash
length=5
for((i=1;i<=length;i++));do
    echo $i;
done;
```

### Câu lệnh while

**Vòng lặp while cơ bản:**

```shell
#!/bin/bash
int=1
while (( int <= 5 ))  # Trong ngữ cảnh số học biến không cần $
do
    echo $int
    (( int++ ))  # Khuyến nghị dùng (( )) thay cho let
done
```

**Vòng lặp while có thể dùng để đọc thông tin bàn phím:**

```shell
echo 'Nhấn <CTRL-D> để thoát'
echo -n 'Nhập bộ phim bạn yêu thích nhất: '
while read -r FILM  # Tùy chọn -r cấm thoát bằng backslash, nâng cao độ an toàn
do
    echo "Đúng vậy! $FILM là một bộ phim hay"
done
```

Nội dung xuất ra:

```plain
Nhấn <CTRL-D> để thoát
Nhập bộ phim bạn yêu thích nhất: Transformers
Đúng vậy! Transformers là một bộ phim hay
```

**Vòng lặp vô hạn:**

```shell
while true
do
    command
done
```

## Hàm trong Shell

### Hàm không có tham số, không có giá trị trả về

```shell
#!/bin/bash
hello(){
    echo "Đây là hàm shell đầu tiên của tôi!"
}
echo "-----Bắt đầu thực thi hàm-----"
hello
echo "-----Đã thực thi xong hàm-----"
```

Kết quả xuất ra:

```plain
-----Bắt đầu thực thi hàm-----
Đây là hàm shell đầu tiên của tôi!
-----Đã thực thi xong hàm-----
```

### Hàm có giá trị trả về

**Nhập hai số rồi cộng lại và xuất kết quả:**

```shell
#!/bin/bash
set -euo pipefail

funWithReturn(){
    local aNum
    local anotherNum
    echo "Nhập số thứ nhất: "
    read -r aNum
    echo "Nhập số thứ hai: "
    read -r anotherNum
    echo "Hai số lần lượt là $aNum và $anotherNum !"
    result=$((aNum + anotherNum))
}
result=0
funWithReturn
echo "Tổng của hai số đã nhập là $result"
```

**Lưu ý quan trọng**:

- **Từ khóa `local`**: giới hạn biến trong phạm vi hàm, tránh làm ô nhiễm không gian tên toàn cục.
- **`read -r`**: tùy chọn `-r` cấm thoát bằng backslash, nâng cao độ an toàn.
- **Giá trị trả về của hàm**: `return` thiết lập trạng thái thoát nằm trong khoảng 0-255, không phù hợp để truyền kết quả tính toán. Khi cần truyền dữ liệu, có thể dùng standard output hoặc biến.

**Tại sao nên dùng local?**

- Trong script phức tạp hoặc khi import nhiều script bên ngoài, biến không phải local có thể bị ghi đè bất ngờ.
- Ô nhiễm biến toàn cục dẫn đến hiện tượng trôi cấu hình (configuration drift) hoặc vượt quyền logic khó truy ra nguyên nhân.
- Dùng `local` là best practice của lập trình hàm, tương tự khái niệm biến cục bộ trong các ngôn ngữ lập trình khác.

Kết quả xuất ra:

```plain
Nhập số thứ nhất:
1
Nhập số thứ hai:
2
Hai số lần lượt là 1 và 2 !
Tổng của hai số đã nhập là 3
```

### Hàm có tham số

```shell
#!/bin/bash
funWithParam(){
    echo "Tham số thứ nhất là $1"
    echo "Tham số thứ hai là $2"
    echo "Tên script là $0"
    echo "Tham số thứ mười là ${10}"   # Lưu ý: tham số ≥ 10 phải dùng ${n}
    echo "Tham số thứ mười một là ${11}"
    echo "Tổng số tham số có $# tham số"
    echo "Tất cả tham số là $*"         # Xuất dưới dạng một chuỗi duy nhất
    echo "Tất cả tham số là $@"         # Xuất dưới dạng các tham số độc lập (khuyến nghị)
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

Kết quả xuất ra:

```plain
Tham số thứ nhất là 1
Tham số thứ hai là 2
Tên script là ./script.sh
Tham số thứ mười là 34
Tham số thứ mười một là 73
Tổng số tham số có 11 tham số
Tất cả tham số là 1 2 3 4 5 6 7 8 9 34 73
Tất cả tham số là 1 2 3 4 5 6 7 8 9 34 73
```

**Lưu ý quan trọng**:

- **Tham số vị trí `$n` khi `n >= 10` bắt buộc phải dùng cú pháp `${n}`**.
- Ví dụ: `$10` sẽ được phân tích thành `$1` nối với ký tự chữ `0`, chứ không phải tham số thứ mười.
- `$0` biểu thị chính tên của script.
- `$#` biểu thị tổng số tham số.

**Sự khác biệt cốt lõi giữa `$*` và `$@`**:

| Biểu thức | Không có dấu nháy            | Bọc bằng dấu nháy kép                                                  |
| --------- | ---------------------------- | ---------------------------------------------------------------------- |
| `$*`      | Mở rộng thành tất cả tham số | Mở rộng thành **một chuỗi duy nhất** (tất cả tham số gộp lại)          |
| `$@`      | Mở rộng thành tất cả tham số | Mở rộng thành **các tham số độc lập** (mỗi tham số giữ nguyên độc lập) |

**Ví dụ so sánh**:

```shell
#!/bin/bash
test_args() {
    echo "--- Dùng \$* (không có dấu nháy) ---"
    for arg in $*; do
        echo "Tham số: [$arg]"
    done

    echo -e "\n--- Dùng \$@ (không có dấu nháy) ---"
    for arg in $@; do
        echo "Tham số: [$arg]"
    done

    echo -e "\n--- Dùng \"\$*\" (dấu nháy kép) ---"
    for arg in "$*"; do
        echo "Tham số: [$arg]"
    done

    echo -e "\n--- Dùng \"\$@\" (dấu nháy kép, khuyến nghị) ---"
    for arg in "$@"; do
        echo "Tham số: [$arg]"
    done
}

# Gọi hàm, truyền các tham số chứa khoảng trắng
test_args "hello world" "foo bar"
```

**Kết quả xuất ra**:

```plain
--- Dùng $* （không có dấu nháy）---
Tham số: [hello]
Tham số: [world]
Tham số: [foo]
Tham số: [bar]

--- Dùng $@ （không có dấu nháy）---
Tham số: [hello]
Tham số: [world]
Tham số: [foo]
Tham số: [bar]

--- Dùng "$*" （dấu nháy kép）---
Tham số: [hello world foo bar]  # Tất cả tham số gộp thành một chuỗi

--- Dùng "$@" （dấu nháy kép, khuyến nghị）---
Tham số: [hello world]  # Mỗi tham số giữ nguyên độc lập
Tham số: [foo bar]
```

**Kết luận**: khi truyền tham số, **luôn dùng `"$@"`** để đảm bảo tính độc lập của từng tham số (đặc biệt khi tham số chứa khoảng trắng).

## Best practice trong lập trình Shell

Sau khi nắm được kiến thức nền tảng của lập trình Shell, hiểu thêm một số best practice có thể giúp bạn viết script an toàn và hiệu quả hơn.

### Quy chuẩn cơ bản của script

**1. Quy chuẩn Shebang**:

```shell
#!/usr/bin/env bash
# Tìm bash thông qua PATH
set -euo pipefail
```

**Hai cách viết Shebang**:

- `#!/bin/bash`: chỉ định trực tiếp đường dẫn bash, phù hợp với môi trường cố định mà bạn biết vị trí bash.
- `#!/usr/bin/env bash`: tìm bash thông qua env, tính khả chuyển cao hơn, phù hợp với các hệ thống khác nhau (như macOS / Linux).

**Lựa chọn trong các ví dụ của bài viết**:

- Các ví dụ hướng dẫn dùng `#!/bin/bash`: ngắn gọn rõ ràng, phù hợp để người mới hiểu.
- Các ví dụ cấp độ sản xuất dùng `#!/usr/bin/env bash`: nhấn mạnh tính khả chuyển.

**2. Tham chiếu biến**:

```shell
# Luôn bọc biến bằng dấu nháy kép
echo "$var"     # Khuyến nghị
echo $var       # Có thể gây ra vấn đề word splitting và globbing
```

**3. Dùng shellcheck**:

```bash
shellcheck your_script.sh  # Phân tích tĩnh, phát hiện các vấn đề thường gặp
```

**4. Cú pháp được khuyến nghị**:

- Dùng `[[ ]]` thay vì `[ ]`(an toàn hơn, hỗ trợ khớp mẫu).
- Dùng `$((...))` thay vì `expr`(hiệu năng tốt hơn).
- Dùng `$(...)` thay vì backtick (có thể lồng nhau, rõ ràng hơn).
- Dùng `${n}` để truy cập tham số vị trí khi n >= 10.

### Nguyên lý hoạt động của pipefail

Mặc định, giá trị trả về của lệnh pipeline chỉ phụ thuộc vào lệnh cuối cùng. Khi bật `pipefail`, giá trị trả về của pipeline sẽ là giá trị trả về của lệnh thất bại gần nhất, điều này giúp tránh ẩn đi lỗi của các bước trung gian.

**So sánh ví dụ**:

```shell
# Chế độ mặc định (nguy hiểm)
cat huge_file.txt | grep "pattern" | head -n 10
# Dù cat thất bại (file không tồn tại), chỉ cần head thành công, mã trả về là 0

# Chế độ pipefail (an toàn)
set -o pipefail
cat huge_file.txt | grep "pattern" | head -n 10
# cat thất bại sẽ lập tức trả mã lỗi, không bị bỏ qua
```

## Trước khi đưa script Shell vào môi trường sản xuất

Viết đúng cú pháp cơ bản mới chỉ là bước đầu. Khi script được đưa vào cron job, quy trình triển khai hoặc máy chủ online, còn phải xử lý việc thoát khi lỗi, file tạm, quá thời gian của mạng và mã thoát của tác vụ nền. Dưới đây minh họa bằng một vài ví dụ nhỏ hoàn chỉnh.

Hành vi của `set -u` và `set -o pipefail` tương đối rõ ràng; `set -e` có nhiều trường hợp ngoại lệ, hành vi trong kiểm tra điều kiện, hàm, sub Shell và thay thế lệnh đều có thể gây bất ngờ. Có thể coi `set -euo pipefail` là điểm khởi đầu cho script mới, nhưng không thể dùng nó thay cho việc xử lý lỗi tường minh kiểu `if ! command; then ... fi`. Mở rộng biến vẫn nên thêm dấu nháy kép tùy theo ngữ cảnh, biến bên trong hàm dùng `local` để giới hạn phạm vi.

### Đặt tổng hạn mức thời gian cho yêu cầu mạng

Một yêu cầu cần đồng thời giới hạn pha kết nối và toàn bộ thời gian truyền. Việc retry chỉ nên đặt ở một lớp: nếu vòng lặp bên ngoài và `curl --retry` cùng bật, số lần yêu cầu thực tế sẽ nhân lên, tổng thời gian cũng khó ước lượng. Hàm dưới đây do lớp bên ngoài thống nhất điều khiển số lần thử, và sau mỗi lần thất bại thêm vào độ trễ ngẫu nhiên nguyên trong khoảng 0 đến 2 giây:

```shell
#!/usr/bin/env bash

retry_request() {
    local url="$1"
    local max_attempts=5
    local attempt=1
    local delay
    local jitter

    while (( attempt <= max_attempts )); do
        if curl --fail --silent --show-error \
                --connect-timeout 3 \
                --max-time 10 \
                "$url"; then
            return 0
        fi

        if (( attempt == max_attempts )); then
            break
        fi

        delay=$((1 << (attempt - 1)))
        (( delay > 16 )) && delay=16
        jitter=$((RANDOM % 3))
        delay=$((delay + jitter))
        printf 'Lần yêu cầu thứ %d thất bại，thử lại sau %d giây\n' "$attempt" "$delay" >&2
        sleep "$delay"
        ((attempt += 1))
    done

    return 1
}

command -v curl >/dev/null 2>&1 || {
    echo "curl chưa được cài đặt" >&2
    exit 1
}

[[ $# -eq 1 ]] || {
    echo "Cách dùng: $0 <url>" >&2
    exit 1
}

retry_request "$1" || {
    echo "Yêu cầu thất bại" >&2
    exit 1
}
```

Script thực tế còn phải căn cứ theo ngữ nghĩa API để quyết định những lỗi nào có thể retry. Các yêu cầu ghi không có tính idempotent, lỗi xác thực và lỗi tham số thường không nên phát lại trực tiếp.

### File tạm và khóa loại trừ lẫn nhau (mutex)

Đừng dùng các đường dẫn có thể đoán trước như `/tmp/data_$$`. `mktemp` tạo file hoặc thư mục một cách nguyên tử (atomic), kết hợp với `trap` có thể dọn dẹp khi thoát bình thường và khi nhận được các tín hiệu phổ biến:

```shell
#!/usr/bin/env bash

temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/myapp.XXXXXXXX") || {
    echo "Không thể tạo thư mục tạm" >&2
    exit 1
}
cleanup() {
    rm -rf -- "$temp_dir"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

temp_file="$temp_dir/result.txt"
printf 'temporary data\n' > "$temp_file"
cat "$temp_file"
```

Khi trên cùng một máy cần ngăn script chạy lặp lại, có thể dùng `flock` với file khóa mà ứng dụng tự quản lý:

```shell
exec 9>/var/lock/myapp.lock || exit 1
flock -n 9 || {
    echo "Script đang chạy rồi" >&2
    exit 1
}
```

`flock` là khóa theo kiểu hợp tác (cooperative), các tiến trình khác có thể chọn không tuân thủ. Client NFS của Linux có thể mô phỏng nó thành khóa `fcntl` trên toàn file, nhưng hành vi thực tế còn chịu ảnh hưởng của nhân client, server và các tùy chọn mount như `local_lock`. Khi file khóa nằm trên hệ thống file mạng, nên xác minh trong môi trường triển khai đích bằng hai client độc lập, không được mặc định là chắc chắn hiệu lực hay chắc chắn vô hiệu. Loại trừ lẫn nhau giữa nhiều máy cũng không được chỉ viết một câu Redis `SET NX PX`: việc triển khai còn phải xử lý token duy nhất, xóa có điều kiện, gia hạn lease và mô hình lỗi.

### Thu thập mã thoát của tác vụ nền

`wait` không có tham số sẽ chờ tất cả tác vụ nền, nhưng Bash trả về 0, không cho bạn biết tác vụ nào trong số đó bị lỗi. Script dưới đây đếm số byte của nhiều file theo cách song song, và lần lượt thu thập trạng thái của từng tiến trình con:

```shell
#!/usr/bin/env bash
set -u

pids=()
for file in "$@"; do
    wc -c -- "$file" &
    pids+=("$!")
done

exit_code=0
for pid in "${pids[@]}"; do
    if ! wait "$pid"; then
        echo "Tác vụ nền $pid thực thi thất bại" >&2
        exit_code=1
    fi
done

exit "$exit_code"
```

Viết trực tiếp `while wait -n; do ...; done` cũng không đầy đủ: khi một tác vụ thất bại, `wait -n` trả về khác 0, vòng lặp sẽ kết thúc ngay lập tức, các tác vụ còn lại có thể không được thu thập.

### Những hiểu lầm thường gặp

Đừng chuyển hướng cả standard output và standard error của toàn bộ lệnh sang `/dev/null` trong thời gian dài, nếu không khi thất bại chỉ còn lại mã thoát mà không có thông tin chẩn đoán. Chỉ nên tắt bớt những output bạn xác nhận không cần, còn thông báo lỗi nên ghi vào nhật ký hoặc giữ trong standard error. Khi script phụ thuộc các lệnh bên ngoài như `curl`, `jq`, ở giai đoạn khởi động hãy kiểm tra bằng `command -v`; khi pipeline cần phát hiện lệnh trung gian thất bại, mới bật `set -o pipefail`.

### Cách xác minh trước khi đưa lên sản xuất

Nội dung xác minh nên dựa sát vào những phụ thuộc thực tế của script. Script mạng ít nhất phải phủ lỗi kết nối, quá thời gian và trạng thái HTTP không thể retry; script song song kiểm tra mã thoát của từng tiến trình con; script tạo tài nguyên tạm còn phải xác minh rằng sau khi thoát bình thường và khi bị ngắt tín hiệu, việc dọn dẹp có hoàn tất hay không. Các lệnh chèn lỗi (fault injection) sẽ sửa firewall, thời gian hệ thống hoặc trạng thái mount, không phù hợp để coi là ví dụ phổ quát có thể sao chép trực tiếp; nên thiết kế riêng theo hạ tầng thực tế trong môi trường test cô lập.

## Tổng kết

Shell phù hợp để nối các lệnh sẵn có thành những quy trình tự động hóa nhỏ. Trước tiên nắm vững tham chiếu biến, điều kiện, vòng lặp, hàm và trạng thái thoát, sau đó dựa vào các tài nguyên mạng, file và độ phức tạp (concurrency) thực tế mà script sử dụng để bổ sung giới hạn thời gian, dọn dẹp và xử lý lỗi.

### Ôn lại các điểm kiến thức cốt lõi

| Khối kiến thức       | Điểm mấu chốt                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Biến**             | Phân biệt biến cục bộ, biến môi trường và biến đặc biệt; dùng `local` tránh ô nhiễm toàn cục; luôn bọc biến bằng dấu nháy kép |
| **Chuỗi**            | Khuyến nghị dùng dấu nháy kép; hiểu sự khác biệt giữa dấu nháy đơn và dấu nháy kép; nắm `${#var}` lấy độ dài                  |
| **Mảng**             | bash 2.0+ hỗ trợ mảng (không thuộc POSIX); lưu ý lỗ hổng chỉ mục sau khi xóa phần tử                                          |
| **Toán tử**          | Ưu tiên dùng `$((...))` cho phép tính số học; `[[ ]]` an toàn hơn `[ ]`                                                       |
| **Điều khiển luồng** | Dùng `[[ ]]` để kiểm tra điều kiện; tránh cạm bẫy của `command1 && command2 \|\| command3`                                    |
| **Hàm**              | Dùng `local` giới hạn phạm vi biến; hàm chỉ có thể trả về mã thoát trong khoảng 0-255                                         |
| **Thay thế lệnh**    | Dùng `$(...)` thay cho backtick; dùng `read -r` để nâng cao độ an toàn                                                        |

### Lời khuyên học tập

Bắt đầu từ những tác vụ ngắn như lọc nhật ký, đổi tên hàng loạt, thống kê file. Viết xong trước tiên dùng `bash -n` để kiểm tra cú pháp, rồi dùng ShellCheck để tìm các vấn đề thường gặp như biến không được tham chiếu, chuyển hướng sai. Sau khi script bắt đầu quản lý tiến trình nền hoặc dịch vụ hệ thống, tiếp tục học tín hiệu (signals), điều khiển công việc, `sed`, `awk` và `grep`. Khi vượt quá vài trăm dòng, cần cấu trúc dữ liệu phức tạp hoặc khôi phục sau ngoại lệ, thì các ngôn ngữ phổ dụng như Python thường dễ duy trì hơn.

### Tài nguyên tham khảo

- **Tài liệu chính thức**：Bash Reference Manual（GNU）
- **Kiểm tra mã**：ShellCheck - Shell Script Analysis Tool
- **Quy chuẩn mã**：Google Shell Style Guide
- **Cạm bẫy thường gặp**：Bash Pitfalls (http://mywiki.wooledge.org/BashPitfalls)
