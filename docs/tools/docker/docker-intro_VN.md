---
title: Tổng hợp các khái niệm cốt lõi của Docker
description: Hệ thống hóa các khái niệm cốt lõi của Docker và sự khác biệt giữa container/máy ảo, nắm vững mối quan hệ giữa image, container và repository cùng giá trị thực tế trong việc triển khai và phân phối phần mềm.
category: 开发工具
tag:
  - Docker
head:
  - - meta
    - name: keywords
      content: Docker,容器,镜像,仓库,引擎,隔离,虚拟机对比,部署
---

Bài viết này chủ yếu trình bày các khái niệm cốt lõi, mô hình hoạt động và các trường hợp sử dụng phổ biến của Docker, không đi sâu vào quá trình cài đặt. Về cài đặt, luyện tập câu lệnh và khởi chạy dịch vụ cục bộ, bạn có thể xem bài [Docker thực chiến](./docker-in-action.md) ở phần sau.

## Giới thiệu về container

Docker là nền tảng container phần mềm phổ biến. Muốn hiểu Docker, trước tiên cần hiểu container rốt cuộc giải quyết vấn đề gì.

### Container là gì?

#### Trước hết, hãy xem định nghĩa mang tính chính thống của container

**Tóm tắt trong một câu: container là việc đóng gói phần mềm thành các đơn vị chuẩn hóa để phục vụ cho phát triển, phân phối và triển khai.**

- **Container image là gói phần mềm độc lập, nhẹ, có thể thực thi**, chứa mọi thứ cần thiết để phần mềm chạy: code, runtime environment, công cụ hệ thống, thư viện hệ thống và cấu hình.
- **Phần mềm được container hóa chạy được trên cả ứng dụng dựa trên Linux và Windows, và luôn chạy nhất quán trong mọi môi trường.**
- **Container mang lại sự độc lập cho phần mềm**, giúp phần mềm không bị ảnh hưởng bởi sự khác biệt của môi trường bên ngoài (ví dụ: sự khác biệt giữa môi trường development và staging), từ đó giúp giảm xung đột khi các nhóm khác nhau chạy các phần mềm khác nhau trên cùng một hạ tầng.

#### Tiếp theo, hãy xem cách giải thích dễ hiểu hơn về container

Nếu cần mô tả container một cách dễ hiểu, tôi nghĩ container giống như một nơi chứa đồ, giống như cặp sách có thể đựng đủ loại đồ dùng học tập, tủ quần áo có thể chứa đủ loại quần áo, kệ giày có thể để đủ loại giày vậy. Container mà chúng ta đang nói tới hiện nay chứa những thứ thiên về ứng dụng hơn, chẳng hạn như website, chương trình hay thậm chí là cả môi trường hệ thống.

![Nhận biết container](https://oss.javaguide.cn/github/javaguide/tools/docker/container.png)

### Minh họa bằng hình ảnh: máy vật lý, máy ảo và container

Phần so sánh giữa máy ảo và container sẽ được giới thiệu chi tiết ở phía sau, ở đây chỉ dùng hình ảnh trên mạng để giúp mọi người hiểu rõ hơn về ba khái niệm máy vật lý, máy ảo và container (hình ảnh dưới đây lấy từ mạng).

**Máy vật lý (physical machine):**

![Máy vật lý](https://oss.javaguide.cn/github/javaguide/tools/docker/%E7%89%A9%E7%90%86%E6%9C%BA%E5%9B%BE%E8%A7%A3.jpeg)

**Máy ảo (virtual machine):**

![Máy ảo](https://oss.javaguide.cn/github/javaguide/tools/docker/%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%9B%BE%E8%A7%A3.jpeg)

**Container:**

![](https://oss.javaguide.cn/javaguide/image-20211110104003678.png)

Thông qua ba hình ảnh trừu tượng trên, chúng ta có thể khái quát bằng phép so sánh: **Container ảo hóa hệ điều hành chứ không phải phần cứng, các container chia sẻ cùng một bộ tài nguyên hệ điều hành. Công nghệ máy ảo thì ảo hóa ra một bộ phần cứng, sau đó chạy một hệ điều hành hoàn chỉnh trên đó. Vì vậy mức độ cách ly của container thấp hơn một chút.**

### Container so với máy ảo

Mỗi khi nhắc đến container, chúng ta không thể không so sánh nó với máy ảo. Theo quan điểm cá nhân, không quan trọng cái nào sẽ thay thế cái nào, mà cả hai có thể cùng tồn tại hài hòa.

Nói đơn giản: **Container và máy ảo có những lợi thế tương tự về phân bổ và cách ly tài nguyên, nhưng chức năng khác nhau, vì container ảo hóa hệ điều hành chứ không phải phần cứng, nên container dễ di chuyển hơn và hiệu quả cũng cao hơn.**

Công nghệ máy ảo truyền thống ảo hóa ra một bộ phần cứng, sau đó chạy một hệ điều hành hoàn chỉnh trên đó, rồi mới chạy các tiến trình ứng dụng cần thiết trên hệ thống này; còn tiến trình ứng dụng trong container chạy trực tiếp trên kernel của máy chủ (host), container không có kernel riêng, và cũng không thực hiện ảo hóa phần cứng. Vì vậy container nhẹ hơn nhiều so với máy ảo truyền thống.

![](https://oss.javaguide.cn/javaguide/2e2b95eebf60b6d03f6c1476f4d7c697.png)

**So sánh giữa container và máy ảo**:

![](https://oss.javaguide.cn/javaguide/4ef8691d67eb1eb53217099d0a691eb5.png)

- Container là một lớp trừu tượng ở tầng ứng dụng, dùng để đóng gói code và các tài nguyên phụ thuộc lại với nhau. Nhiều container có thể chạy trên cùng một máy, chia sẻ kernel của hệ điều hành, nhưng mỗi container chạy như một tiến trình độc lập trong user space. So với máy ảo, **container chiếm ít dung lượng hơn** (kích thước container image thường chỉ vài chục MB), **khởi động gần như tức thì**.

- Máy ảo (VM) là một lớp trừu tượng ở tầng phần cứng vật lý, dùng để biến một máy chủ thành nhiều máy chủ. Hypervisor cho phép nhiều VM chạy trên cùng một máy. Mỗi VM bao gồm một hệ điều hành hoàn chỉnh, một hoặc nhiều ứng dụng, các file binary và thư viện cần thiết, nên **chiếm rất nhiều dung lượng**. Hơn nữa VM **khởi động cũng rất chậm**.

Thông qua trang chủ Docker, chúng ta đã biết được nhiều ưu điểm của Docker, nhưng cũng không cần phủ nhận hoàn toàn công nghệ máy ảo, vì hai bên có những trường hợp sử dụng khác nhau. **Máy ảo giỏi hơn trong việc cách ly triệt để toàn bộ môi trường chạy**. Ví dụ, các nhà cung cấp dịch vụ cloud thường dùng công nghệ máy ảo để cách ly các người dùng khác nhau. Còn **Docker thường dùng để cách ly các ứng dụng khác nhau**, chẳng hạn như frontend, backend và database.

Theo quan điểm cá nhân, không quan trọng cái nào sẽ thay thế cái nào, mà cả hai có thể cùng tồn tại hài hòa.

![](https://oss.javaguide.cn/javaguide/056c87751b9dd7b56f4264240fe96d00.png)

## Giới thiệu về Docker

### Docker là gì?

Có thể hiểu Docker từ các góc độ sau:

- **Docker là một nền tảng container phần mềm.**
- **Docker** được phát triển bằng ngôn ngữ Go, dựa trên các khả năng do Linux kernel cung cấp như cgroups, namespaces và UnionFS để đóng gói và cách ly tiến trình, thuộc về công nghệ ảo hóa ở tầng hệ điều hành.
- Docker có thể đóng gói ứng dụng cùng các phụ thuộc runtime vào image, giảm thiểu các vấn đề do môi trường development, testing, deployment không nhất quán gây ra.
- Người dùng có thể tạo và sử dụng container một cách dễ dàng, đưa ứng dụng của mình vào container. Container còn có thể được quản lý phiên bản, sao chép, chia sẻ, sửa đổi, giống như quản lý code thông thường.

**Tư tưởng của Docker**:

- **Container vận chuyển (shipping container)**: Giống như container trong vận tải đường biển, Docker container chứa ứng dụng cùng toàn bộ dependencies, đảm bảo ứng dụng luôn chạy theo cùng một cách trong mọi môi trường.
- **Chuẩn hóa**: phương thức vận chuyển, phương thức lưu trữ, API interface.
- **Cách ly**: Mỗi Docker container đều chạy trong môi trường cách ly riêng, tách biệt với máy chủ và các container khác.

### Đặc điểm của Docker container

- **Nhẹ**: Nhiều Docker container chạy trên cùng một máy có thể chia sẻ kernel của hệ điều hành máy đó; chúng khởi động rất nhanh, chỉ cần rất ít tài nguyên tính toán và bộ nhớ. Image được xây dựng theo các lớp filesystem và chia sẻ một số file chung. Nhờ vậy giảm được dung lượng đĩa và tải image về nhanh hơn.
- **Chuẩn**: Docker container dựa trên các tiêu chuẩn mở, có thể chạy trên mọi bản phân phối Linux chính, Microsoft Windows cũng như bất kỳ hạ tầng nào bao gồm VM, bare-metal server và cloud.
- **An toàn**: Sự cách ly mà Docker mang lại cho ứng dụng không chỉ là cách ly giữa các ứng dụng với nhau, mà còn độc lập với hạ tầng bên dưới. Docker mặc định cung cấp mức cách ly mạnh nhất, nên khi ứng dụng gặp sự cố, vấn đề chỉ nằm trong một container mà không lan ra cả máy.

### Tại sao nên dùng Docker?

- Image của Docker cung cấp môi trường runtime hoàn chỉnh ngoại trừ kernel, đảm bảo tính nhất quán của môi trường chạy ứng dụng, từ đó không còn xuất hiện kiểu vấn đề "đoạn code này chạy trên máy tôi có sao đâu"; —— môi trường chạy nhất quán
- Có thể đạt thời gian khởi động tính bằng giây, thậm chí mili giây. Tiết kiệm đáng kể thời gian phát triển, kiểm thử, triển khai. —— thời gian khởi động nhanh hơn
- Tránh việc dùng chung server khiến tài nguyên dễ bị ảnh hưởng bởi người dùng khác. —— cách ly
- Giỏi xử lý áp lực sử dụng server tăng đột biến; —— co giãn đàn hồi, mở rộng nhanh
- Có thể dễ dàng di chuyển ứng dụng đang chạy trên nền tảng này sang nền tảng khác mà không lo thay đổi môi trường chạy khiến ứng dụng không hoạt động được. —— dễ dàng di chuyển
- Sử dụng Docker có thể thực hiện continuous integration, continuous delivery và deployment thông qua việc tùy chỉnh image ứng dụng. —— continuous delivery và deployment

---

## Các khái niệm cơ bản của Docker

Trong Docker có ba khái niệm cơ bản rất quan trọng: image (Image), container (Container) và repository (Repository).

Hiểu được ba khái niệm này là hiểu được toàn bộ vòng đời của Docker.

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-build-run.jpeg)

### Image: một filesystem đặc biệt

**Hệ điều hành được chia thành kernel và user space**. Đối với Linux, sau khi kernel khởi động, nó sẽ mount root filesystem để cung cấp hỗ trợ cho user space. Còn Docker image tương đương với một root filesystem.

**Docker image là một filesystem đặc biệt, ngoài việc cung cấp các file cần thiết khi container chạy như chương trình, thư viện, tài nguyên, cấu hình, còn chứa một số tham số cấu hình được chuẩn bị sẵn cho runtime (như anonymous volume, biến môi trường, người dùng, v.v.).** Image không chứa bất kỳ dữ liệu động nào, nội dung của nó cũng không bị thay đổi sau khi build.

Khi thiết kế, Docker đã tận dụng triệt để công nghệ **Union FS**, thiết kế thành **kiến trúc lưu trữ phân lớp**. Image thực chất được tạo thành từ nhiều lớp filesystem ghép lại.

**Khi build image, từng lớp sẽ được build lần lượt, lớp trước là nền tảng của lớp sau. Mỗi lớp sau khi build xong sẽ không thay đổi nữa, mọi thay đổi ở lớp sau chỉ xảy ra trong chính lớp đó.** Ví dụ, thao tác xóa file ở lớp trước thực chất không thật sự xóa file của lớp trước, mà chỉ đánh dấu file đó là đã xóa ở lớp hiện tại. Khi container chạy cuối cùng, tuy không nhìn thấy file này, nhưng thực tế file đó vẫn luôn đi theo image. Vì vậy, khi build image cần đặc biệt cẩn thận, mỗi lớp chỉ nên chứa những thứ cần thêm ở lớp đó, mọi thứ thừa nên được dọn sạch trước khi lớp đó build xong.

Đặc trưng lưu trữ phân lớp còn giúp việc tái sử dụng và tùy chỉnh image trở nên dễ dàng hơn. Thậm chí có thể dùng image đã build trước đó làm lớp nền, rồi tiếp tục thêm các lớp mới để tùy chỉnh nội dung mình cần, build ra image mới.

### Container: thực thể khi image chạy

Mối quan hệ giữa image và container giống như class và instance trong lập trình hướng đối tượng, image là định nghĩa tĩnh, **container là thực thể khi image chạy. Container có thể được tạo, khởi động, dừng, xóa, tạm dừng, v.v.**

**Bản chất của container là tiến trình, nhưng khác với tiến trình chạy trực tiếp trên host, tiến trình container chạy trong namespace (không gian tên) độc lập của riêng nó. Phần trước đã nói image sử dụng lưu trữ phân lớp, container cũng vậy.**

**Vòng đời của lớp lưu trữ container giống với container, khi container mất đi, lớp lưu trữ container cũng mất theo. Vì vậy, mọi thông tin lưu trong lớp lưu trữ container đều sẽ mất khi container bị xóa.**

Theo yêu cầu thực hành tốt nhất (best practice) của Docker, **container không nên ghi dữ liệu nghiệp vụ vào lớp lưu trữ của nó**, lớp lưu trữ container cần giữ trạng thái stateless nhiều nhất có thể. **Các file cần ghi lâu dài (persist) nên sử dụng data volume hoặc bind thư mục của host**, các thao tác đọc ghi này sẽ bỏ qua lớp lưu trữ container, ghi trực tiếp lên máy chủ hoặc bộ nhớ mạng, hiệu năng và độ ổn định tốt hơn. Vòng đời của data volume độc lập với container, sau khi xóa container, data volume không bị tự động xóa.

### Repository: nơi lưu trữ tập trung các file image

Sau khi build image xong, có thể dễ dàng chạy nó trên host hiện tại, nhưng, **nếu cần dùng image này trên server khác, chúng ta cần một dịch vụ lưu trữ và phân phối image tập trung, Docker Registry chính là dịch vụ như vậy.**

Một Docker Registry có thể chứa nhiều repository (Repository); mỗi repository có thể chứa nhiều tag (Tag); mỗi tag tương ứng với một image. Vì vậy có thể nói: **Image repository là nơi Docker dùng để lưu trữ tập trung các file image, tương tự như code repository mà chúng ta thường dùng trước đây.**

Thông thường, **một repository sẽ chứa các image của các phiên bản khác nhau của cùng một phần mềm**, còn **tag thường dùng để tương ứng với từng phiên bản của phần mềm đó**. Chúng ta có thể chỉ định image cụ thể bằng định dạng `<tên repository>:<tag>`. Nếu không đưa ra tag, `latest` sẽ được dùng làm tag mặc định. Tuy nhiên trong môi trường production, không nên phụ thuộc vào `latest`, tốt nhất là chỉ định rõ tag phiên bản để dễ rollback và xử lý sự cố.

**Bổ sung thêm về khái niệm dịch vụ công khai Docker Registry và Docker Registry riêng tư:**

**Dịch vụ công khai Docker Registry** là dịch vụ Registry mở cho người dùng sử dụng, cho phép người dùng quản lý image. Thông thường các dịch vụ công khai này cho phép người dùng upload, download miễn phí các image công khai, và có thể cung cấp dịch vụ trả phí để người dùng quản lý image riêng tư.

Dịch vụ công khai Registry được dùng nhiều nhất là **Docker Hub** chính thức, đây cũng là Registry mặc định, sở hữu số lượng lớn image chính thức chất lượng cao, địa chỉ: [https://hub.docker.com/](https://hub.docker.com/ "https://hub.docker.com/"). Docker Hub được giới thiệu chính thức như sau:

> Docker Hub là dịch vụ do Docker chính thức cung cấp, dùng để tìm kiếm và chia sẻ container image cùng với nhóm của bạn.

Ví dụ chúng ta muốn tìm kiếm image mình cần:

![Dùng Docker Hub để tìm kiếm image](https://oss.javaguide.cn/github/javaguide/tools/docker/Screen%20Shot%202019-11-04%20at%208.21.39%20PM.png)

Trong kết quả tìm kiếm của Docker Hub, có một số thông tin quan trọng giúp chúng ta chọn image phù hợp:

- **OFFICIAL Image**: cho biết image do Docker chính thức cung cấp và bảo trì, độ ổn định và bảo mật tương đối cao.
- **Stars**: gần giống với lượt thích, tương tự Star trên GitHub.
- **Downloads**: cho biết số lần image được pull về, về cơ bản thể hiện tần suất image được sử dụng.

Tất nhiên, ngoài cách tìm kiếm image trực tiếp qua website Docker Hub, chúng ta còn có thể dùng lệnh `docker search` để tìm image trong Docker Hub, kết quả tìm kiếm là như nhau.

```bash
➜  ~ docker search mysql
NAME                              DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
mysql                             MySQL is a widely used, open-source relation…   8763                [OK]
mariadb                           MariaDB is a community-developed fork of MyS…   3073                [OK]
mysql/mysql-server                Optimized MySQL Server Docker images. Create…   650                                     [OK]
```

Tại Việt Nam hoặc Trung Quốc, truy cập **Docker Hub** có thể khá chậm, các dự án doanh nghiệp thường kết hợp image repository nội bộ của công ty hoặc image repository của nhà cung cấp cloud để cache và phân phối image.

Ngoài việc sử dụng dịch vụ công khai, người dùng còn có thể **tự dựng Docker Registry riêng tư tại chỗ**. Docker chính thức cung cấp Docker Registry image, có thể dùng trực tiếp làm dịch vụ Registry riêng tư. Image Docker Registry mã nguồn mở chỉ cung cấp phần server implementation của Docker Registry API, đủ để hỗ trợ các lệnh Docker, không ảnh hưởng đến việc sử dụng. Nhưng không bao gồm giao diện đồ họa, cùng các tính năng nâng cao như bảo trì image, quản lý người dùng, kiểm soát truy cập.

### Mối quan hệ giữa Image, Container và Repository

Hình dưới đây minh họa rất rõ mối quan hệ giữa bốn thành phần Image, Container, Repository và Registry/Hub:

![Kiến trúc Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-regitstry.png)

- Dockerfile là một file văn bản, chứa một loạt các chỉ thị và tham số, dùng để định nghĩa cách build một Docker image. Khi chạy lệnh `docker build` và chỉ định một Dockerfile, Docker sẽ đọc các chỉ thị trong Dockerfile, từng bước build ra image mới và lưu nó ở local.
- Lệnh `docker pull` có thể tải một image từ Registry/Hub chỉ định về local, mặc định sử dụng Docker Hub.
- Lệnh `docker run` có thể tạo một container mới từ image local và khởi động nó. Nếu local chưa có image, Docker sẽ thử pull image từ Registry/Hub trước.
- Lệnh `docker push` có thể upload Docker image ở local lên Registry/Hub chỉ định.

Phần trên đã đề cập đến một số lệnh cơ bản của Docker, bài thực chiến phía sau sẽ giới thiệu chi tiết.

### Build Ship and Run

Các khái niệm của Docker về cơ bản đã trình bày xong, chúng ta hãy cùng nói về: Build, Ship, and Run.

Nếu bạn tìm kiếm trên trang chủ Docker, sẽ thấy dòng chữ: **"Docker - Build, Ship, and Run Any App, Anywhere"**. Vậy Build, Ship, and Run rốt cuộc là làm gì?

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-build-ship-run.jpg)

- **Build (build image)**: Image giống như container vận chuyển, chứa file cùng môi trường chạy và các tài nguyên khác.
- **Ship (vận chuyển image)**: Vận chuyển giữa host và repository, repository ở đây giống như một siêu cảng.
- **Run (chạy image)**: Image khi chạy chính là một container, container chính là nơi chạy chương trình.

Quá trình chạy của Docker chính là pull image từ repository về local, rồi dùng một câu lệnh để chạy image đó thành container. Vì vậy, chúng ta cũng thường gọi Docker là công nhân cảng hoặc công nhân bốc xếp, điều này giống hệt cách dịch Docker sang tiếng Trung là "công nhân bốc vác".

## Các lệnh Docker thường dùng

### Lệnh cơ bản

```bash
docker version # Xem phiên bản Docker
docker images # Xem tất cả image đã tải về, tương đương lệnh: docker image ls
docker container ls # Xem tất cả container
docker ps # Xem các container đang chạy
docker image prune # Dọn dẹp các file image không được sử dụng. -a/--all sẽ xóa tất cả image không được container nào sử dụng
```

### Pull image

Lệnh `docker pull` mặc định sử dụng Registry là Docker Hub. Khi bạn chạy lệnh `docker pull` mà không chỉ định địa chỉ Registry nào, Docker sẽ pull image từ Docker Hub.

```bash
docker search mysql # Xem các image liên quan đến MySQL
docker pull mysql:8.4 # Pull image MySQL
docker image ls # Xem tất cả image đã tải về
```

### Build image

Khi chạy lệnh `docker build` và chỉ định một Dockerfile, Docker sẽ đọc các chỉ thị trong Dockerfile, từng bước build ra image mới và lưu nó ở local.

```bash
# image-name là tên image, 1.0.0 là số phiên bản hoặc tag của image
docker build -t image-name:1.0.0 .
```

Cần lưu ý: tên file của Dockerfile không nhất thiết phải là Dockerfile, cũng không nhất thiết phải đặt ở thư mục gốc của build context. Sử dụng tùy chọn `-f` hoặc `--file`, có thể chỉ định bất kỳ file nào ở bất kỳ vị trí nào làm Dockerfile. Tất nhiên, mọi người thường có thói quen dùng tên file mặc định `Dockerfile` và đặt nó trong thư mục build context của image.

### Xóa image

Ví dụ chúng ta muốn xóa image MySQL đã tải về.

Trước khi xóa image bằng `docker rmi [image]` (tương đương `docker image rm [image]`), trước hết phải đảm bảo image này không được container nào tham chiếu. Có thể xóa bằng tên tag hoặc ID của image, cũng có thể dùng lệnh `docker ps` đã nói ở trên để xem có container nào đang sử dụng nó hay không.

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
c4cd691d9f80        mysql:5.7           "docker-entrypoint.s…"   7 weeks ago         Up 12 days          0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
```

Có thể thấy `mysql:5.7` đang được container có ID `c4cd691d9f80` tham chiếu, cần dừng container này trước bằng `docker stop c4cd691d9f80` hoặc `docker stop mysql`.

Sau đó xem ID của image MySQL:

```shell
➜  ~ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
mysql                   5.7                 f6509bac4980        3 months ago        373MB
```

Có thể xóa bằng `IMAGE ID` hoặc `REPOSITORY:TAG`:

```shell
docker rmi f6509bac4980 # hoặc docker rmi mysql:5.7
```

### Push image

Lệnh `docker push` dùng để upload Docker image ở local lên Registry/Hub chỉ định.

```bash
# Push image lên image repository riêng tư Harbor
# harbor.example.com là địa chỉ của image repository riêng tư, ubuntu là tên image, 18.04 là tag phiên bản image
docker push harbor.example.com/ubuntu:18.04
```

Trước khi push image, phải đảm bảo Docker image cần push đã được build xong ở local. Ngoài ra, nhất định phải đăng nhập vào image repository tương ứng trước.

## Quản lý dữ liệu trong Docker

Có hai cách chính để quản lý dữ liệu trong container:

1. Data volume (Volumes)
2. Mount thư mục máy chủ (Bind mounts)

![Quản lý dữ liệu Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-data-management.png)

Data volume là vùng lưu trữ dữ liệu do Docker quản lý, có các đặc điểm sau:

- Có thể chia sẻ và tái sử dụng giữa các container.
- Ngay cả khi container bị xóa, dữ liệu trong volume cũng không bị tự động xóa, từ đó đảm bảo tính bền vững của dữ liệu.
- Các thay đổi đối với data volume có hiệu lực ngay lập tức.
- Việc cập nhật data volume không ảnh hưởng đến image.

```bash
# Tạo một data volume
docker volume create my-vol
# Xem tất cả data volume
docker volume ls
# Xem thông tin chi tiết của data volume
docker volume inspect my-vol
# Xóa data volume chỉ định
docker volume rm my-vol
```

Khi dùng lệnh `docker run`, sử dụng cờ `--mount` để mount một hoặc nhiều data volume vào container.

Cũng có thể dùng cờ `--mount` để mount file hoặc thư mục trên host vào container, giúp container có thể truy cập trực tiếp filesystem của host. Quyền mặc định khi Docker mount thư mục host là đọc-ghi, người dùng cũng có thể thêm `readonly` để chỉ định là chỉ đọc.

## Docker Compose

### Docker Compose là gì? Dùng để làm gì?

Docker Compose là công cụ do Docker chính thức cung cấp để định nghĩa và chạy ứng dụng đa container. Thông qua Compose, nhà phát triển có thể dùng một file YAML để mô tả nhiều service, network, port và data volume mà ứng dụng phụ thuộc, sau đó dùng một câu lệnh để khởi động hoặc dừng toàn bộ nhóm service.

Docker Compose là dự án mã nguồn mở, địa chỉ: <https://github.com/docker/compose>.

Các chức năng cốt lõi của Docker Compose:

- **Quản lý đa container**: Cho phép người dùng định nghĩa và quản lý nhiều container trong một file YAML.
- **Điều phối service (orchestration)**: Cấu hình network và mối quan hệ phụ thuộc giữa các container.
- **Khởi động và dừng bằng một lệnh**: Thông qua các lệnh như `docker compose up` và `docker compose down`, có thể dễ dàng khởi động và dừng toàn bộ ứng dụng.

Docker Compose đơn giản hóa quá trình phát triển, kiểm thử và triển khai ứng dụng đa container, nâng cao năng suất của nhóm phát triển, đồng thời giảm độ phức tạp triển khai và chi phí quản lý ứng dụng.

### Cấu trúc cơ bản của file Docker Compose

File Docker Compose là phần cốt lõi của công cụ Docker Compose, dùng để định nghĩa và cấu hình ứng dụng Docker đa container. File này thường được đặt tên là `compose.yaml` hoặc `docker-compose.yml`, viết theo định dạng YAML (YAML Ain't Markup Language).

Cấu trúc cơ bản của file Docker Compose như sau:

- **Service (services):** Định nghĩa mỗi container (service) trong ứng dụng. Mỗi service có thể sử dụng image, cấu hình môi trường và mối quan hệ phụ thuộc khác nhau.
  - **Image (image):** Khởi động container từ image chỉ định, có thể là repository lưu trữ, tag và ID của image.
  - **Command (command):** Tùy chọn, ghi đè lệnh mặc định được thực thi sau khi container khởi động. Chạy lệnh hoặc script cụ thể khi khởi động service, thường dùng để khởi chạy ứng dụng, thực thi script khởi tạo, v.v.
  - **Ports (ports):** Tùy chọn, ánh xạ port giữa container và host.
  - **Depends on (depends_on):** Cấu hình mối quan hệ phụ thuộc khởi động giữa các service. Ví dụ khi backend service phụ thuộc vào database service, có thể khởi động database trước, rồi mới khởi động backend service.
  - **Environment variables (environment):** Tùy chọn, thiết lập các biến môi trường cần thiết để service chạy.
  - **Restart (restart):** Tùy chọn, kiểm soát chiến lược restart của container. Khi container thoát, tự động khởi động lại container theo chiến lược đã chỉ định.
  - **Service volumes (volumes):** Tùy chọn, định nghĩa volume mà service sử dụng, dùng để persist dữ liệu hoặc chia sẻ dữ liệu giữa các container.
  - **Build (build):** Chỉ định đường dẫn context của Dockerfile để build image, hoặc sử dụng object cấu hình chi tiết.
- **Networks:** Định nghĩa kết nối mạng giữa các container.
- **Volumes:** Định nghĩa data volume dùng để persist và chia sẻ dữ liệu. Thường dùng để persist dữ liệu database, file cấu hình, log, v.v.

```yaml
services:
  service-name-1:
    image: nginx:stable
    command: ["nginx", "-g", "daemon off;"]
    environment:
      TZ: Asia/Shanghai
    volumes:
      - web_data:/usr/share/nginx/html
    networks:
      - app_net
    ports:
      - "8080:80"
    restart: unless-stopped
    depends_on:
      - service-name-2
  service-name-2:
    image: redis:7
    networks:
      - app_net

volumes:
  web_data:

networks:
  app_net:
```

### Các lệnh Docker Compose thường dùng

#### Khởi động

`docker compose up` sẽ tạo và khởi động container dựa trên các service được định nghĩa trong file Compose, và kết nối chúng vào network do Compose tạo. Nếu file không khai báo network tùy chỉnh, Compose sẽ tự động tạo network mặc định.

```bash
# Tìm file compose.yaml hoặc docker-compose.yml trong thư mục hiện tại, và khởi động ứng dụng theo các service được định nghĩa trong đó
docker compose up
# Khởi động ở chế độ nền
docker compose up -d
# Buộc tạo lại tất cả container, kể cả khi chúng đã tồn tại
docker compose up --force-recreate
# Build lại image
docker compose up --build
# Chỉ định tên service cần khởi động, thay vì khởi động tất cả service
# Có thể chỉ định nhiều service cùng lúc, phân tách bằng dấu cách.
docker compose up service-name
```

Ngoài ra, nếu tên file Compose không phải là `compose.yaml` hoặc `docker-compose.yml`, có thể chỉ định bằng tham số `-f`.

```bash
docker compose -f compose.prod.yaml up
```

#### Dừng

`docker compose down` dùng để dừng và xóa các container và network được khởi động bởi `docker compose up`.

```bash
# Tìm file Compose trong thư mục hiện tại
# Xóa các container và network đã khởi động theo định nghĩa trong đó
docker compose down
# Dừng container nhưng không xóa
docker compose stop
# Dừng service chỉ định
docker compose stop service-name
```

Tương tự, nếu tên file Compose không phải là `compose.yaml` hoặc `docker-compose.yml`, có thể chỉ định bằng tham số `-f`.

```bash
docker compose -f compose.prod.yaml down
```

#### Xem

`docker compose ps` dùng để xem thông tin trạng thái của tất cả container được khởi động bởi `docker compose up`.

```bash
# Xem thông tin trạng thái của tất cả container
docker compose ps
# Chỉ hiển thị tên service
docker compose ps --services
# Xem container của service chỉ định
docker compose ps service-name
```

#### Khác

| Lệnh                     | Mô tả                                        |
| ------------------------ | -------------------------------------------- |
| `docker compose version` | Xem phiên bản                                |
| `docker compose images`  | Liệt kê image mà tất cả container đang dùng  |
| `docker compose kill`    | Buộc dừng container của service              |
| `docker compose exec`    | Thực thi lệnh trong container                |
| `docker compose logs`    | Xem log                                      |
| `docker compose pause`   | Tạm dừng service                             |
| `docker compose unpause` | Khôi phục service                            |
| `docker compose push`    | Push image của service                       |
| `docker compose start`   | Khởi động service đang bị dừng               |
| `docker compose stop`    | Dừng service đang chạy                       |
| `docker compose rm`      | Xóa container của service đã dừng            |
| `docker compose top`     | Xem tiến trình                               |

## Nguyên lý hoạt động của Docker

Trước hết, Docker là phần mềm dựa trên công nghệ ảo hóa nhẹ, vậy công nghệ ảo hóa là gì?

Nói đơn giản, công nghệ ảo hóa có thể được định nghĩa như sau:

> Công nghệ ảo hóa là một công nghệ quản lý tài nguyên, trong đó các [tài nguyên vật lý](https://zh.wikipedia.org/wiki/計算機科學) của máy tính ([CPU](https://zh.wikipedia.org/wiki/CPU), [bộ nhớ](https://zh.wikipedia.org/wiki/内存), [dung lượng đĩa](https://zh.wikipedia.org/wiki/磁盘空间), [network adapter](https://zh.wikipedia.org/wiki/網路適配器), v.v.) được trừu tượng hóa, chuyển đổi rồi trình bày ra, có thể được phân chia, kết hợp thành một hoặc nhiều môi trường cấu hình máy tính. Nhờ đó, phá vỡ rào cản không thể chia cắt giữa các cấu trúc vật lý, cho phép người dùng ứng dụng các tài nguyên phần cứng máy tính này theo cách tốt hơn cấu hình ban đầu. Các phần tài nguyên ảo mới này không bị giới hạn bởi cách triển khai tài nguyên hiện có, khu vực địa lý hay cấu hình vật lý. Tài nguyên ảo hóa thường được nhắc đến bao gồm năng lực tính toán và lưu trữ dữ liệu.

Công nghệ Docker dựa trên công nghệ container ảo LXC (Linux container - container Linux).

> LXC, tên gọi là viết tắt của Linux software container (Linux Containers), một công nghệ ảo hóa ở tầng hệ điều hành (Operating system–level virtualization), là một user space interface cho tính năng container của Linux kernel. Nó đóng gói hệ thống phần mềm ứng dụng thành một container phần mềm (Container), bên trong chứa chính code của phần mềm ứng dụng, cùng với kernel hệ điều hành và thư viện cần thiết. Thông qua namespace thống nhất và API dùng chung để phân bổ tài nguyên phần cứng khả dụng cho các container phần mềm khác nhau, tạo ra môi trường chạy sandbox độc lập cho ứng dụng, giúp người dùng Linux dễ dàng tạo và quản lý container hệ thống hoặc ứng dụng.

Công nghệ LXC chủ yếu dựa vào tính năng CGroup và namespace được cung cấp trong Linux kernel để thực hiện, thông qua LXC có thể cung cấp cho phần mềm một môi trường chạy hệ điều hành độc lập.

**Giới thiệu về cgroup và namespace:**

- **Namespace là cách Linux kernel dùng để cách ly các tài nguyên kernel.** Thông qua namespace, một số tiến trình chỉ có thể nhìn thấy phần tài nguyên liên quan đến mình, và một số tiến trình khác cũng chỉ nhìn thấy phần tài nguyên liên quan đến chúng, hai nhóm tiến trình này hoàn toàn không cảm nhận được sự tồn tại của nhau. Cách thực hiện cụ thể là đặt tài nguyên liên quan của một hoặc nhiều tiến trình vào cùng một namespace. Linux namespaces là một dạng đóng gói và cách ly đối với tài nguyên hệ thống toàn cục, giúp các tiến trình nằm trong các namespace khác nhau sở hữu tài nguyên hệ thống toàn cục độc lập, thay đổi tài nguyên hệ thống trong một namespace chỉ ảnh hưởng đến tiến trình trong namespace hiện tại, không ảnh hưởng đến tiến trình trong namespace khác.

  (Nội dung giới thiệu về namespace ở trên lấy từ <https://www.cnblogs.com/sparkdev/p/9365405.html>, có thể xem bài viết này để biết thêm nội dung về namespace).

- **CGroup là viết tắt của Control Groups, là một cơ chế do Linux kernel cung cấp để giới hạn, ghi nhận và cách ly tài nguyên vật lý (như cpu, memory, i/o, v.v.) mà các nhóm tiến trình (process groups) sử dụng.**

  (Nội dung giới thiệu về CGroup ở trên lấy từ <https://www.ibm.com/developerworks/cn/linux/1506_cgroup/index.html>, có thể xem bài viết này để biết thêm nội dung về CGroup).

**So sánh giữa cgroup và namespace:**

Cả hai đều dùng để phân nhóm tiến trình, nhưng tác dụng của hai bên vẫn có sự khác biệt về bản chất. Namespace dùng để cách ly tài nguyên giữa các nhóm tiến trình, còn cgroup dùng để giám sát và giới hạn tài nguyên thống nhất cho một nhóm tiến trình.

## Tổng kết

Bài viết này chủ yếu trình bày chi tiết một số khái niệm và lệnh thường dùng trong Docker. Để đi từ con số không đến thực chiến, bạn có thể xem bài viết [Docker từ nhập môn đến bắt tay vào việc](https://javaguide.cn/tools/docker/docker-in-action.html), nội dung rất chi tiết!

Ngoài ra, xin giới thiệu thêm một cuốn sách mã nguồn mở chất lượng rất cao [《Docker từ nhập môn đến thực hành》](https://yeasy.gitbook.io/docker_practice/introduction/why), nội dung cuốn sách này rất mới, vì nội dung sách là mã nguồn mở nên có thể được cải tiến bất cứ lúc nào.

![Trang chủ website 《Docker từ nhập môn đến thực hành》](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-getting-started-practice-website-homepage.png)

## Tham khảo

- [Docker Compose: Hướng dẫn toàn diện từ cơ bản đến ứng dụng thực chiến](https://juejin.cn/post/7306756690727747610)
- [Linux Namespace và Cgroup](https://segmentfault.com/a/1190000009732550)
- [LXC vs Docker: Why Docker is Better](https://www.upguard.com/articles/docker-vs-lxc "LXC vs Docker: Why Docker is Better")
- [Giới thiệu CGroup, ví dụ ứng dụng và mô tả nguyên lý](https://www.ibm.com/developerworks/cn/linux/1506_cgroup/index.html)

<!-- @include: @article-footer.snippet.md -->
