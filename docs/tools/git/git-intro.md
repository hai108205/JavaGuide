---
title: Tổng hợp các khái niệm cốt lõi của Git
description: Tổng hợp các khái niệm và quy trình làm việc (workflow) cốt lõi của Git, bao gồm branch và merge, quản lý commit và giải quyết conflict, hỗ trợ làm việc nhóm và nâng cao chất lượng code.
category: 开发工具
tag:
  - Git
head:
  - - meta
    - name: keywords
      content: Git,version control,distributed,branch,commit,merge,conflict resolution,workflow
---

## Version control (kiểm soát phiên bản)

### Version control là gì

Version control là một hệ thống ghi lại sự thay đổi nội dung của một hoặc một số file, để sau này có thể tra cứu tình trạng sửa đổi của từng phiên bản cụ thể. Ngoài source code của dự án, bạn có thể thực hiện version control với bất kỳ loại file nào.

### Tại sao cần version control

Nhờ có nó, bạn có thể đưa một file nào đó quay về trạng thái trước đó, thậm chí đưa toàn bộ dự án trở lại trạng thái tại một thời điểm trong quá khứ. Bạn có thể so sánh chi tiết các thay đổi của file, tìm ra ai là người cuối cùng đã sửa ở đâu, từ đó xác định nguyên nhân gây ra các vấn đề kỳ lạ, hay ai đã báo cáo một lỗi chức năng nào đó vào lúc nào, v.v.

### Hệ thống version control cục bộ

Nhiều người có thói quen lưu các phiên bản khác nhau bằng cách copy toàn bộ thư mục dự án, có thể còn đổi tên kèm theo thời gian backup để phân biệt. Cách làm này chỉ có một ưu điểm duy nhất là đơn giản, nhưng lại rất dễ gây lỗi. Đôi khi bạn sẽ nhầm lẫn thư mục làm việc hiện tại, lỡ tay ghi nhầm file hoặc ghi đè lên file không mong muốn.

Để giải quyết vấn đề này, từ rất lâu trước đây người ta đã phát triển nhiều loại hệ thống version control cục bộ, phần lớn sử dụng một database đơn giản để ghi lại các khác biệt (diff) giữa những lần cập nhật của file.

![Hệ thống version control cục bộ](https://oss.javaguide.cn/github/javaguide/tools/git/%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

### Hệ thống version control tập trung

Tiếp đó, người ta lại gặp phải một vấn đề: làm sao để các developer trên các hệ thống khác nhau có thể cộng tác với nhau? Vì vậy, hệ thống version control tập trung (Centralized Version Control Systems, viết tắt là CVCS) đã ra đời.

Các hệ thống version control tập trung đều có một server quản lý tập trung duy nhất, lưu trữ tất cả các phiên bản sửa đổi của file, còn những người cộng tác sẽ kết nối tới server này thông qua client để lấy file mới nhất hoặc gửi lên (commit) các bản cập nhật.

![Hệ thống version control tập trung](https://oss.javaguide.cn/github/javaguide/tools/git/%E9%9B%86%E4%B8%AD%E5%8C%96%E7%9A%84%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

Cách này tuy giải quyết được nhược điểm của hệ thống version control cục bộ là không thể cho các developer trên các hệ thống khác nhau cộng tác với nhau, nhưng vẫn tồn tại những vấn đề sau:

- **Lỗi điểm đơn (single point of failure):** Nếu server trung tâm bị down, những người khác sẽ không thể sử dụng; nếu đĩa của database trung tâm bị hỏng mà lại không được backup, bạn sẽ mất toàn bộ dữ liệu. Hệ thống version control cục bộ cũng có vấn đề tương tự: chỉ cần toàn bộ lịch sử của dự án được lưu ở một nơi duy nhất thì luôn có nguy cơ mất toàn bộ lịch sử cập nhật.
- **Bắt buộc phải có mạng mới làm việc được:** Chịu ảnh hưởng của tình trạng mạng và băng thông.

### Hệ thống version control phân tán

Vì vậy, hệ thống version control phân tán (Distributed Version Control System, viết tắt là DVCS) đã ra đời. Git chính là một hệ thống version control phân tán điển hình.

Ở loại hệ thống này, client không chỉ lấy file snapshot của phiên bản mới nhất, mà mirror (sao chép nguyên bản) toàn bộ repository. Nhờ vậy, khi bất kỳ server nào dùng để cộng tác gặp sự cố, sau đó đều có thể dùng bất kỳ bản mirror cục bộ nào để khôi phục. Bởi vì mỗi lần clone thực chất là một lần backup đầy đủ repository.

![Hệ thống version control phân tán](https://oss.javaguide.cn/github/javaguide/tools/git/%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

Hệ thống version control phân tán có thể hoạt động mà không cần kết nối mạng, vì trên máy tính của mỗi người đều là một repository đầy đủ. Khi bạn sửa một file nào đó, bạn chỉ cần push thay đổi của mình cho người khác là được. Tuy nhiên, trong thực tế khi sử dụng hệ thống version control phân tán, người ta hiếm khi push trực tiếp cho nhau, mà sử dụng một máy đóng vai trò "server trung tâm". Server này chỉ có tác dụng giúp mọi người "trao đổi" các thay đổi một cách thuận tiện; không có nó mọi người vẫn làm việc bình thường, chỉ là việc trao đổi thay đổi kém tiện lợi hơn mà thôi.

Ưu điểm của hệ thống version control phân tán không chỉ đơn giản là không cần kết nối mạng, phần sau chúng ta còn thấy những tính năng cực kỳ mạnh mẽ của Git như quản lý branch.

## Tìm hiểu về Git

### Lịch sử ngắn gọn của Git

Nhóm phát triển nhân Linux khi đó sử dụng hệ thống version control phân tán BitKeeper để quản lý và bảo trì code. Tuy nhiên, sau đó mối quan hệ hợp tác giữa công ty thương mại phát triển BitKeeper và cộng đồng mã nguồn mở nhân Linux kết thúc, họ thu hồi quyền sử dụng BitKeeper miễn phí của cộng đồng nhân Linux. Cộng đồng mã nguồn mở Linux (đặc biệt là Linus Torvalds, cha đẻ của Linux) dựa trên những kinh nghiệm và bài học rút ra khi sử dụng BitKeeper, đã phát triển hệ thống version control của riêng mình, đồng thời thực hiện rất nhiều cải tiến cho hệ thống version control mới.

### Điểm khác biệt chính giữa Git và các hệ thống quản lý phiên bản khác

Git có sự khác biệt rất lớn so với các hệ thống version control khác trong cách lưu trữ và xử lý các loại thông tin, mặc dù hình thức các câu lệnh khi thao tác lại rất giống nhau. Việc hiểu rõ những khác biệt này sẽ giúp bạn tránh được những bối rối trong quá trình sử dụng.

Dưới đây chúng ta chủ yếu nói về một điểm khác biệt chính giữa Git và các hệ thống quản lý phiên bản khác: **cách xử lý dữ liệu**.

**Git ghi lại snapshot trực tiếp, chứ không so sánh sự khác biệt (diff). Phần sau sẽ giới thiệu chi tiết sự khác nhau giữa hai cách này.**

Phần lớn các hệ thống version control (CVS, Subversion, Perforce, Bazaar, v.v.) đều lưu trữ thông tin dưới dạng danh sách các thay đổi của file. Những hệ thống loại này **coi thông tin mà chúng lưu trữ là một tập hợp các file cơ bản và phần khác biệt được tích lũy dần theo thời gian của mỗi file.**

Nguyên lý cụ thể như hình dưới đây, thực ra rất dễ hiểu: mỗi khi chúng ta commit cập nhật một file, hệ thống sẽ ghi lại file đó đã được cập nhật những gì, biểu thị bằng ký hiệu gia tăng Δ (Delta).

![](https://oss.javaguide.cn/github/javaguide/tools/git/2019-3deltas.png)

**Làm thế nào để có được phiên bản cuối cùng của một file?**

Rất đơn giản, chỉ cần kiến thức cơ bản của toán phổ thông: chúng ta chỉ cần cộng các file gốc với các phần gia tăng này là được.

**Cách này có vấn đề gì?**

Ví dụ, nếu số lượng phần gia tăng đặc biệt nhiều, thì để có được file cuối cùng chẳng phải sẽ tốn thời gian và hiệu năng hay sao.

Git không xử lý hay lưu trữ dữ liệu theo cách trên. Ngược lại, Git giống như coi dữ liệu là một tập hợp các snapshot của một hệ thống file nhỏ. Mỗi khi bạn commit cập nhật, hoặc lưu trạng thái dự án trong Git, nó chủ yếu tạo một snapshot của toàn bộ file tại thời điểm đó và lưu lại chỉ mục (index) của snapshot này. Để đạt hiệu quả cao, nếu file không bị sửa đổi, Git sẽ không lưu lại file đó nữa, mà chỉ giữ một liên kết trỏ đến file đã lưu trước đó. Git xử lý dữ liệu giống như một **dòng snapshot (snapshot stream)**.

![](https://oss.javaguide.cn/github/javaguide/tools/git/2019-3snapshots.png)

### Ba trạng thái của Git

Git có ba trạng thái, file của bạn có thể nằm ở một trong số đó:

1. **Đã commit (committed)**: Dữ liệu đã được lưu an toàn vào database cục bộ.
2. **Đã sửa đổi (modified)**: Đã sửa đổi nghĩa là file đã được thay đổi, nhưng chưa được lưu vào database.
3. **Đã stage (staged)**: Nghĩa là đã đánh dấu một phiên bản hiện tại của file đã sửa đổi, để đưa nó vào snapshot của lần commit tiếp theo.

Từ đó hình thành khái niệm về ba vùng làm việc của dự án Git: **Git repository (thư mục .git)**, **thư mục làm việc (Working Directory)** và **vùng staging (Staging Area)**.

![](https://oss.javaguide.cn/github/javaguide/tools/git/2019-3areas.png)

**Quy trình làm việc cơ bản của Git như sau:**

1. Sửa file trong thư mục làm việc.
2. Stage file, đưa snapshot của file vào vùng staging.
3. Commit cập nhật, tìm các file trong vùng staging và lưu trữ vĩnh viễn snapshot vào thư mục Git repository.

## Bắt đầu nhanh với Git

### Lấy Git repository

Có hai cách để lấy repository của dự án Git.

1. Khởi tạo repository trong một thư mục hiện có: vào thư mục dự án và chạy lệnh `git init`, lệnh này sẽ tạo một thư mục con tên là `.git`.
2. Clone một Git repository có sẵn từ một server: `git clone [url]`. Nếu muốn tùy chỉnh tên thư mục cục bộ, có thể dùng `git clone [url] directoryname`.

### Ghi lại mỗi lần cập nhật vào repository

1. **Kiểm tra trạng thái file hiện tại** : `git status`
2. **Đề xuất thay đổi (đưa chúng vào staging area)**: `git add filename` (với một file cụ thể), `git add .` (tất cả thay đổi trong thư mục hiện tại), `git add *.txt` (hỗ trợ wildcard, tất cả các file `.txt`).
3. **Bỏ qua file**: file `.gitignore`
4. **Commit cập nhật**: `git commit -m "Thông điệp commit code"`. Mỗi lần chuẩn bị commit, hãy dùng `git status` để kiểm tra xem mọi thứ đã được stage chưa.
5. **Bỏ qua bước sử dụng staging area khi cập nhật**: `git commit -a -m "Thông điệp commit code"`. `git commit` thêm tùy chọn `-a`, Git sẽ tự động stage tất cả các file đã được theo dõi (tracked) và commit cùng lúc, từ đó bỏ qua bước `git add`.
6. **Xóa file**: `git rm filename` (xóa khỏi staging area, sau đó commit.)
7. **Đổi tên file**: `git mv README.md README` (lệnh này tương đương với tập hợp của ba lệnh `mv README.md README`, `git rm README.md`, `git add README`)

### Một thông điệp commit Git tốt

Một thông điệp commit Git tốt như sau:

```plain
Dòng tiêu đề: dùng dòng này để mô tả và giải thích lần commit này của bạn

Phần thân có thể là một vài dòng ngắn, thêm các chi tiết để giải thích commit, tốt nhất là đưa ra một số bối cảnh liên quan hoặc giải thích commit này sửa chữa và giải quyết vấn đề gì.

Phần thân tất nhiên cũng có thể gồm vài đoạn, nhưng nhất định phải chú ý xuống dòng và câu không nên quá dài. Vì như vậy khi dùng "git log" sẽ có thụt lề trông đẹp mắt hơn.
```

Phần mô tả ở dòng tiêu đề của commit nên thật rõ ràng và cố gắng tóm gọn trong một câu. Như vậy sẽ tiện cho các công cụ xem Git log hiển thị và cho người khác đọc.

### Push thay đổi lên remote repository

- Nếu bạn chưa clone repository nào và muốn kết nối repository của mình với một server từ xa, có thể dùng lệnh sau để thêm: `git remote add origin <server>`. Ví dụ, để liên kết repository cục bộ với repository đã tạo trên GitHub, có thể viết như sau: `git remote add origin https://github.com/Snailclimb/test.git`.
- Commit các thay đổi này lên remote repository: `git push origin main`. Ở đây `main` có thể thay bằng bất kỳ branch nào bạn muốn push. Nhiều dự án cũ vẫn có branch mặc định tên là `master`, hãy lấy repository thực tế làm chuẩn.

  Như vậy là bạn đã có thể push các thay đổi của mình lên server đã thêm.

### Xóa và đổi tên remote repository

- Đổi tên test thành test1: `git remote rename test test1`
- Xóa remote repository test1: `git remote rm test1`

### Xem lịch sử commit

Sau khi đã commit một số bản cập nhật, hoặc sau khi clone một dự án nào đó, có thể bạn sẽ muốn xem lại lịch sử commit. Công cụ đơn giản mà hiệu quả nhất để làm việc này là lệnh `git log`. `git log` sẽ liệt kê tất cả các bản cập nhật theo thời gian commit, bản cập nhật gần nhất xếp trên cùng.

**Có thể thêm một số tham số để xem nội dung mình muốn:**

Chỉ xem lịch sử commit của một người nào đó:

```shell
git log --author=bob
```

### Thao tác hoàn tác

Đôi khi chúng ta commit xong mới phát hiện bỏ sót vài file chưa thêm vào, hoặc viết sai thông điệp commit. Lúc này, có thể chạy lệnh commit với tùy chọn `--amend` để thử commit lại:

```shell
git commit --amend
```

Hủy stage một file:

```shell
git restore --staged filename
```

Ở các phiên bản Git cũ cũng thường gặp cách viết sau:

```shell
git reset filename
```

Hủy bỏ các thay đổi của một file:

```shell
git restore filename
```

Ở các phiên bản Git cũ cũng thường gặp cách viết sau:

```shell
git checkout -- filename
```

Nếu bạn muốn hủy bỏ toàn bộ thay đổi và commit ở cục bộ, có thể lấy lịch sử phiên bản mới nhất từ server và trỏ branch chính cục bộ của bạn vào đó:

```shell
git fetch origin
git reset --hard origin/main
```

Lưu ý: `git reset --hard` sẽ hủy bỏ các thay đổi chưa commit ở cục bộ, trước khi thực hiện nhất định phải xác nhận không có nội dung nào cần giữ lại. Với các dự án cũ, nếu branch mặc định là `master` thì lệnh tương ứng đổi thành `git reset --hard origin/master`.

### Branch

Branch dùng để cô lập các nhiệm vụ phát triển khác nhau. Phát triển tính năng hoặc sửa lỗi trên các branch khác, sau khi hoàn thành thì merge lại vào branch chính. Hiện nay nhiều repository có branch mặc định tên là `main`, trong các dự án cũ cũng thường thấy `master`.

Chúng ta thường chọn tạo branch khi phát triển tính năng mới, sửa một bug khẩn cấp, v.v. Phát triển trên một branch hay nhiều branch tốt hơn thì còn tùy thuộc vào từng tình huống cụ thể.

Tạo một branch có tên là test

```shell
git branch test
```

Chuyển branch hiện tại sang `test` (khi bạn chuyển branch, Git sẽ đặt lại thư mục làm việc của bạn, khiến nó trông giống như lần commit cuối cùng trên branch đó. Git sẽ tự động thêm, xóa, sửa file để đảm bảo thư mục làm việc của bạn lúc này trùng khớp với trạng thái ở lần commit cuối cùng của branch đó).

```shell
git switch test
```

Ở các phiên bản Git cũ cũng thường gặp cách viết `git checkout test`.

![](https://oss.javaguide.cn/github/javaguide/tools/git/2019-3%E5%88%87%E6%8D%A2%E5%88%86%E6%94%AF.png)

Bạn cũng có thể tạo branch và chuyển sang ngay bằng cách sau:

```shell
git switch -c feature_x
```

Ở các phiên bản Git cũ cũng thường gặp cách viết `git checkout -b feature_x`.

Chuyển sang branch chính

```shell
git switch main
```

Merge branch (có thể xảy ra conflict)

```shell
git merge test
```

Xóa branch vừa tạo

```shell
git branch -d feature_x
```

Push branch lên remote repository (sau khi push thành công, người khác có thể nhìn thấy):

```shell
git push origin feature_x
```

## Tài liệu học tập gợi ý

**Công cụ học tập qua demo trực tuyến:**

「Bổ sung, từ [issue729](https://github.com/Snailclimb/JavaGuide/issues/729)」Learn Git Branching <https://oschina.gitee.io/learn-git-branching/>. Trang web này có thể demo thuận tiện các thao tác git cơ bản, giải thích cực kỳ rõ ràng. Tác dụng và kết quả của từng lệnh cơ bản.

**Gợi ý đọc thêm:**

- [Git 入门图文教程(1.5W 字 40 图)](https://www.cnblogs.com/anding/p/16987769.html): Một bài viết cực kỳ tâm huyết, nội dung đầy đủ kèm theo hình minh họa chi tiết, rất đáng đọc!
- [Git - 简明指南](https://rogerdudler.github.io/git-guide/index.zh.html): Bao quát các thao tác Git thường gặp, rất rõ ràng.
- [图解 Git](https://marklodato.github.io/visual-git-guide/index-zh-cn.html): Minh họa bằng hình các lệnh thường dùng nhất trong Git. Nếu bạn đã hiểu sơ về nguyên lý hoạt động của git, bài viết này sẽ giúp bạn hiểu sâu hơn.
- [猴子都能懂得 Git 入门](https://backlog.com/git-tutorial/cn/intro/intro1_1.html): Cách giải thích thú vị.
- [Pro Git book](https://git-scm.com/book/zh/v2): Một cuốn sách về Git của nước ngoài, đã được dịch ra nhiều ngôn ngữ, chất lượng rất cao.

<!-- @include: @article-footer.snippet.md -->
