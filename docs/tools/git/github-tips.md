---
title: Tổng hợp các mẹo sử dụng GitHub hữu ích
description: Tổng hợp các mẹo sử dụng GitHub hiệu quả, bao gồm trang cá nhân, badge dự án, đọc code, GitHub Actions, Explore/Trending và các cách tăng hiệu quả khi cộng tác mã nguồn mở.
category: Công cụ phát triển
tag:
  - Git
head:
  - - meta
    - name: keywords
      content: Mẹo GitHub, trang cá nhân, README, thống kê, đóng góp mã nguồn mở, GitHub Actions, đọc code
---

GitHub không chỉ là nền tảng lưu trữ code. Đối với developer, nó đồng thời đóng vai trò trưng bày dự án, đọc code, cộng tác mã nguồn mở, tự động hóa build và trang cá nhân. Bài viết này tổng hợp một số mẹo sử dụng GitHub khá hữu ích.

## Tạo GitHub resume và GitHub báo cáo năm chỉ với một cú click

Thông qua trang web [https://resume.github.io/](https://resume.github.io/), bạn có thể tạo một bản GitHub resume trực tuyến chỉ với một cú click.

Tuy nhiên, việc có nên đưa link GitHub vào resume hay không còn tùy thuộc vào chất lượng nội dung của tài khoản. Nếu tài khoản có dự án hoàn chỉnh, lịch sử bảo trì liên tục, README rõ ràng và lịch sử commit tương đối chuẩn mực thì link GitHub sẽ là điểm cộng; còn nếu chỉ có repository rỗng hoặc code luyện tập tạm thời thì không cần cố đưa vào. Kết quả sau khi tạo được thể hiện như hình dưới đây.

![GitHub resume](https://oss.javaguide.cn/2020-11/image-20201108192205620.png)

Thông qua trang web <https://www.githubtrends.io/wrapped>, bạn có thể tạo một bản báo cáo năm (wrapped) cá nhân trên GitHub. Báo cáo này sẽ liệt kê tình hình đóng góp dự án của bạn trong năm, ngôn ngữ lập trình được sử dụng nhiều nhất và thông tin đóng góp chi tiết.

![](https://oss.javaguide.cn/github/dootask/image-20211226144607457.png)

## Cá nhân hóa trang chủ GitHub

Hiện tại GitHub hỗ trợ tùy chỉnh hiển thị một số nội dung trên trang cá nhân. Hiệu ứng hiển thị được thể hiện như hình dưới đây.

![Hiệu ứng hiển thị trang chủ cá nhân hóa](https://oss.javaguide.cn/java-guide-blog/image-20210616221212259.png)

Để làm được điều này rất đơn giản, bạn chỉ cần tạo một repository trùng tên với tài khoản GitHub của mình, sau đó tùy chỉnh nội dung của `README.md` là được.

Nội dung tùy chỉnh hiển thị trên trang chủ của bạn chính là nội dung của `README.md` (_bạn nào chưa biết cú pháp Markdown thì tự úp mặt vào tường 5 phút nhé_).

![Tạo một repository trùng tên với tài khoản GitHub của bạn](https://oss.javaguide.cn/java-guide-blog/image-20201107110309341.png)

Phần này còn có thể biến tấu ra rất nhiều kiểu! Ví dụ: thông qua dự án mã nguồn mở [github-readme-stats](https://hellogithub.com/periodical/statistics/click/?target=https://github.com/anuraghazra/github-readme-stats), bạn có thể hiển thị thông tin thống kê GitHub được tạo động ngay trong README. Hiệu ứng hiển thị được thể hiện như hình dưới đây.

![Tạo động thông tin thống kê GitHub bằng github-readme-stats](https://oss.javaguide.cn/java-guide-blog/image-20210616221312426.png)

Về phần cá nhân hóa trang chủ thì không đề cập thêm nhiều, bạn nào hứng thú hãy tự tìm hiểu thêm.

## Tùy chỉnh badge dự án

Các badge dự án mà bạn nhìn thấy trên GitHub đều được tạo thông qua trang web [https://shields.io/](https://shields.io/). Badge của dự án JavaGuide của mình được thể hiện như hình dưới đây.

![Badge dự án](https://oss.javaguide.cn/2020-11/image-20201107143136559.png)

Hơn nữa, bạn không chỉ tạo được badge tĩnh, shields.io còn có thể đọc động trạng thái dự án của bạn và tạo ra badge tương ứng.

![Tùy chỉnh badge dự án](https://oss.javaguide.cn/2020-11/image-20201107143502356.png)

Hiệu ứng của badge mô tả trạng thái dự án được tạo ra được thể hiện như hình dưới đây.

![Badge mô tả trạng thái dự án](https://oss.javaguide.cn/2020-11/image-20201107143752642.png)

## Tự động thêm biểu đồ tình hình đóng góp cho dự án

Thông qua công cụ repobeats, bạn có thể thêm vào dự án GitHub biểu đồ thể hiện tình hình đóng góp cơ bản của dự án như hình dưới đây.

![](https://oss.javaguide.cn/github/dootask/repobeats.png)

Địa chỉ: <https://repobeats.axiom.co/> .

## Emoji trên GitHub

![Emoji GitHub](https://oss.javaguide.cn/2020-11/image-20201107162254582.png)

Nếu bạn muốn sử dụng emoji trên GitHub thì có thể tìm ở đây: [www.webfx.com/tools/emoji-cheat-sheet/](https://www.webfx.com/tools/emoji-cheat-sheet/).

![Emoji GitHub trực tuyến](https://oss.javaguide.cn/2020-11/image-20201107162432941.png)

## Đọc source code của dự án GitHub hiệu quả

GitHub Codespaces có thể cung cấp môi trường phát triển trực tuyến tương tự VS Code, phù hợp để đọc, debug hoặc nhanh chóng tham gia dự án mã nguồn mở trong thời gian ngắn. Đối với dự án lớn hoặc dự án cần phụ thuộc vào dịch vụ cục bộ, vẫn nên clone về local và dùng IDE quen thuộc của mình để đọc và debug.

Dưới đây giới thiệu ngắn gọn một vài cách đọc source code dự án GitHub thường dùng.

### Extension Chrome Octotree

Đây là cách đã được nhắc đến rất nhiều và cũng là cách mình thích nhất. Sau khi sử dụng Octotree, sidebar của trang web sẽ hiển thị dự án theo cấu trúc cây, mang lại cảm giác đọc source code như trong IDE.

![Extension Chrome Octotree](https://oss.javaguide.cn/2020-11/image-20201107144944798.png)

### Sourcegraph

Khi không muốn clone dự án về local, bạn cũng có thể dùng các công cụ tìm kiếm và đọc code như Sourcegraph. Sourcegraph hỗ trợ tìm kiếm code liên repository, nhảy đến tham chiếu (reference) và nhiều tính năng khác, khá hữu ích khi đọc các dự án lớn.

Sau khi cài đặt extension này, trang chủ dự án của bạn sẽ xuất hiện thêm một biểu tượng nhỏ như hình dưới đây. Click vào biểu tượng đó là có thể đọc source code dự án trực tuyến.

![](https://oss.javaguide.cn/2020-11/image-20201107145749659.png)

Hiệu ứng đọc code bằng Sourcegraph tương tự như bên dưới, cũng hiển thị code theo cấu trúc cây và còn hỗ trợ nhảy giữa các class.

![](https://oss.javaguide.cn/2020-11/image-20201107150307314.png)

### Clone dự án về local

Trước tiên clone dự án về local, sau đó dùng IDE mà bạn thích để đọc. Muốn hiểu sâu một dự án thì đây là cách được ưu tiên hàng đầu.

```bash
git clone https://github.com/Snailclimb/JavaGuide.git
```

## Mở rộng tính năng cho GitHub

**Enhanced GitHub** có thể giúp GitHub của bạn trở nên hữu dụng hơn. Extension trình duyệt này có thể hiển thị kích thước repository, kích thước file và hỗ trợ tải nhanh từng file riêng lẻ.

![](https://oss.javaguide.cn/2020-11/image-20201107160817672.png)

## Tự động tạo mục lục cho file Markdown

Nếu bạn muốn tạo mục lục cho file Markdown thì chỉ cần dùng các extension như **Markdown Preview Enhanced** của VS Code là được.

Hiệu ứng mục lục được tạo ra được thể hiện như hình dưới đây. Bạn chỉ cần click vào link trong mục lục là có thể nhảy đến vị trí tương ứng trong bài viết, giúp cải thiện trải nghiệm đọc.

![](<https://oss.javaguide.cn/2020-11/iShot2020-11-07%2016.14.14%20(1).png>)

Tuy nhiên, hiện tại GitHub đã tự động tạo mục lục cho file Markdown, chỉ cần mở rộng thông qua nút mục lục trên trang là được.

![](https://oss.javaguide.cn/github/cosy/image-20211227093215005.png)

## Tận dụng GitHub Explore

Explore có sẵn của GitHub là một tính năng rất mạnh mẽ và hữu ích, phù hợp để khám phá dự án, chủ đề và xu hướng công nghệ.

Nói đơn giản, GitHub Explore có thể cung cấp những dịch vụ sau:

1. Có thể gợi ý dự án dựa trên sở thích cá nhân của bạn;
2. GitHub Topics phân loại và tổng hợp các dự án theo danh mục/chủ đề. Ví dụ [Data visualization](https://github.com/topics/data-visualization) tổng hợp một số dự án mã nguồn mở liên quan đến trực quan hóa dữ liệu, [Awesome Lists](https://github.com/topics/awesome) tổng hợp các repository thuộc series Awesome;
3. Thông qua GitHub Trending, chúng ta có thể thấy các dự án mã nguồn mở đang hot gần đây, và có thể lọc dự án theo loại ngôn ngữ cũng như theo khoảng thời gian;
4. GitHub Collections giống như một bộ sưu tập yêu thích. Ví dụ collection [Teaching materials for computational social science](https://github.com/collections/teaching-computational-social-science) tổng hợp các tài nguyên mã nguồn mở liên quan đến khóa học khoa học máy tính, còn collection [Learn to Code](https://github.com/collections/learn-to-code) tổng hợp một số repository hữu ích cho việc học lập trình của bạn;
5. ……

![](https://oss.javaguide.cn/github/javaguide/github-explore.png)

## GitHub Actions rất mạnh mẽ

Bạn có thể hiểu đơn giản GitHub Actions là nền tảng tự động hóa tích hợp sẵn của GitHub. Với GitHub Actions, bạn có thể hoàn thành các công việc như build, test, deploy, quét dependency, tác vụ định kỳ ngay trực tiếp trên GitHub.

Về phần giới thiệu chi tiết GitHub Actions, khuyến nghị các bạn đọc bài [GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html) do thầy Nguyễn Nhất Phong (Ruan Yifeng) viết.

GitHub Actions có một marketplace chính thức, trên đó có rất nhiều Actions do người khác đóng góp và có thể tái sử dụng trực tiếp.

![](https://oss.javaguide.cn/github/javaguide/image-20211227100147433.png)

## Lời kết

Không cần phải nhớ hết các mẹo GitHub trong một lần. Trang cá nhân, badge dự án, đọc code, Explore/Trending, GitHub Actions — chỉ cần dùng trước vài phần này là đã đủ đáp ứng phần lớn tình huống hằng ngày.

Ngoài ra, bài viết này không đi sâu vào cú pháp tìm kiếm trên GitHub. Trong thực tế sử dụng, tìm kiếm theo từ khóa, lọc theo ngôn ngữ, sắp xếp theo số Star, lọc theo thời gian cập nhật thường được dùng nhiều hơn so với việc học thuộc lòng các cú pháp phức tạp.

<!-- @include: @article-footer.snippet.md -->
