---
title: Docker thực chiến
description: Thông qua thực hành để hiểu về quản lý image và container trong Docker, giải quyết vấn đề nhất quán môi trường và hiệu quả bàn giao, nâng cao hiệu quả phối hợp giữa phát triển, kiểm thử và triển khai.
category: Công cụ phát triển
tag:
  - Docker
head:
  - - meta
    - name: keywords
      content: Docker thực chiến,xây dựng image,quản lý container,nhất quán môi trường,triển khai,hiệu năng
---

## Giới thiệu Docker

Trước khi bắt đầu, hãy ôn lại một chút về Docker. Phần giới thiệu khái niệm đầy đủ hơn có thể xem ở bài viết trước: [Tổng hợp các khái niệm cốt lõi của Docker](./docker-intro.md).

### Docker là gì?

Có thể hiểu Docker từ một vài góc độ sau:

- Docker là nền tảng container phần mềm phổ biến, được phát triển dựa trên ngôn ngữ Go.
- Docker có thể đóng gói ứng dụng cùng các phụ thuộc runtime vào một image, giảm thiểu các vấn đề do môi trường phát triển, kiểm thử và triển khai không nhất quán gây ra.
- Người dùng có thể dễ dàng tạo và sử dụng container, đưa ứng dụng của mình vào container. Container còn có thể được quản lý phiên bản, sao chép, chia sẻ, chỉnh sửa giống như quản lý code thông thường.
- Docker có thể **đóng gói và cô lập các tiến trình, thuộc nhóm công nghệ ảo hóa ở tầng hệ điều hành.** Do các tiến trình được cô lập hoạt động độc lập với máy chủ và các tiến trình được cô lập khác, nên chúng còn được gọi là container.

Trang chủ: <https://www.docker.com/> .

![Nhận biết container](https://oss.javaguide.cn/github/javaguide/tools/docker/container.png)

### Tại sao nên dùng Docker?

Docker cho phép nhà phát triển đóng gói ứng dụng cùng các gói phụ thuộc vào một container nhẹ, dễ di chuyển, sau đó phát hành lên bất kỳ máy Linux phổ biến nào, đồng thời cũng có thể thực hiện ảo hóa.

Container hoàn toàn sử dụng cơ chế sandbox, giữa các container không có bất kỳ giao diện nào với nhau (tương tự như các app trên iPhone), và quan trọng hơn là chi phí hiệu năng của container cực kỳ thấp.

Trong quy trình phát triển truyền thống, dự án của chúng ta thường cần sử dụng các dịch vụ phụ thuộc như MySQL, Redis, Kafka... Nếu tất cả những môi trường này đều cài đặt và cấu hình thủ công, thao tác trên các hệ điều hành khác nhau sẽ rất khác biệt, và cũng dễ xảy ra vấn đề "trên máy tôi chạy được, trên máy bạn thì không".

Sự ra đời của Docker đã giải quyết triệt để vấn đề này. Chúng ta có thể cài đặt các môi trường phần mềm như MySQL, Redis trong container, tách biệt ứng dụng và kiến trúc môi trường. Ưu điểm của nó là:

1. Môi trường chạy nhất quán, dễ dàng di chuyển (migrate) hơn
2. Đóng gói và cô lập tiến trình, các container không ảnh hưởng lẫn nhau, sử dụng tài nguyên hệ thống hiệu quả hơn
3. Có thể nhân bản nhiều container giống hệt nhau từ một image

Ngoài ra, cuốn sách mã nguồn mở [《Docker — Từ nhập môn đến thực hành》](https://yeasy.gitbook.io/docker_practice/introduction/why) cũng đã đưa ra những lý do nên sử dụng Docker.

![](https://oss.javaguide.cn/github/javaguide/tools/docker/20210412220015698.png)

## Cài đặt Docker

### Windows

Trên Windows, nên cài đặt Docker Desktop. Truy cập trang chủ Docker để tải gói cài đặt:

![Cài đặt Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-install-windows.png)

Sau đó nhấn `Get Started`:

![Cài đặt Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-install-windows-download.png)

Tại đây nhấn `Download for Windows` để tải về.

Hiện tại Docker Desktop for Windows khuyến nghị sử dụng backend WSL 2. Trước khi cài đặt, nên kiểm tra hệ thống có đáp ứng yêu cầu phiên bản của Docker Desktop hay không và đã bật WSL 2 chưa. Trong một số trường hợp cũng có thể dùng backend Hyper-V, cách bật như sau. Mở Control Panel, chọn Programs:

![Bật Hyper-V](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-windows-hyperv.png)

Nhấn `Turn Windows features on or off` (启用或关闭 Windows 功能):

![Bật Hyper-V](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-windows-hyperv-enable.png)

Tích chọn `Hyper-V`, sau đó nhấn OK:

![Bật Hyper-V](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-windows-hyperv-check.png)

Sau khi hoàn tất thay đổi, cần khởi động lại máy tính.

Sau khi bật `Hyper-V`, bạn có thể cài đặt Docker Desktop. Mở trình cài đặt, đợi một lát rồi nhấn `Ok`:

![Cài đặt Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-windows-hyperv-install.png)

Sau khi cài đặt xong, chúng ta vẫn cần khởi động lại máy tính. Sau khi khởi động lại, nếu xuất hiện thông báo như sau:

![Cài đặt Docker](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-windows-hyperv-wsl2.png)

Nếu trong quá trình cài đặt có gợi ý sử dụng WSL 2, thông thường nên ưu tiên chọn backend WSL 2. Đây là cách phổ biến hơn để chạy container Linux trên Windows; chỉ khi môi trường của bạn bắt buộc phải dùng Hyper-V thì mới chuyển sang backend Hyper-V.

Vì đây là thao tác trên giao diện đồ họa nên bài viết sẽ không giới thiệu chi tiết cách sử dụng Docker Desktop.

### macOS

Chỉ cần cài đặt trực tiếp bằng Homebrew:

```shell
brew install --cask docker
```

### Linux

Dưới đây là cách cài đặt Docker trên Linux. Lệnh cài đặt giữa các bản phân phối (distribution) hơi khác nhau, với môi trường production nên ưu tiên tham khảo tài liệu chính thức của Docker. Ở đây dùng script cài đặt chính thức để minh họa cách cài nhanh cho môi trường kiểm thử hoặc phát triển.

Trong môi trường kiểm thử hoặc phát triển, để đơn giản hóa quy trình cài đặt, Docker chính thức cung cấp một script cài đặt tiện lợi. Sau khi chạy script này, mọi công tác chuẩn bị sẽ được tự động hoàn tất và phiên bản ổn định (stable) của Docker sẽ được cài vào hệ thống.

```shell
curl -fsSL get.docker.com -o get-docker.sh
```

```shell
sh get-docker.sh --mirror Aliyun
```

Sau khi cài đặt xong, khởi động dịch vụ trực tiếp:

```shell
systemctl start docker
```

Khuyến nghị thiết lập tự khởi động cùng hệ thống, chạy lệnh:

```shell
systemctl enable docker
```

## Một số khái niệm trong Docker

Trước khi chính thức học Docker, chúng ta cần nắm được một vài khái niệm cốt lõi trong Docker:

### Image (镜像)

Image là một template chỉ đọc, image có thể dùng để tạo container Docker, một image có thể tạo ra nhiều container.

### Container (容器)

Container là một thể hiện đang chạy (running instance) được tạo từ image. Docker sử dụng container để chạy độc lập một hoặc một nhóm ứng dụng. Container có thể được khởi động, bắt đầu, dừng, xóa; mỗi container đều được cô lập với nhau và là một nền tảng an toàn. Có thể xem container như một môi trường Linux đơn giản cùng các ứng dụng chạy bên trong nó. Định nghĩa của container và image gần như giống hệt nhau, đều là góc nhìn thống nhất của nhiều tầng (layer), điểm khác biệt duy nhất là tầng trên cùng của container có thể đọc và ghi.

### Repository (仓库)

Repository là nơi lưu trữ tập trung các file image. Repository và registry server (máy chủ đăng ký repository) là khác nhau: trên registry server thường chứa nhiều repository, mỗi repository lại chứa nhiều image, mỗi image có các tag khác nhau. Repository chia thành hai dạng là repository công khai và repository riêng tư; repository công khai phổ biến nhất là Docker Hub, nơi lưu trữ rất nhiều image có thể tải về trực tiếp.

### Tổng kết

Nói một cách dễ hiểu, một image đại diện cho một phần mềm; còn chạy dựa trên một image nào đó chính là tạo ra một thể hiện chương trình, thể hiện chương trình đó chính là container; còn repository dùng để lưu trữ tất cả image trong Docker.

Trong đó, repository lại chia thành repository từ xa (remote) và repository cục bộ (local). Tương tự Maven, nếu lần nào cũng tải phụ thuộc từ remote thì hiệu quả sẽ giảm đáng kể. Vì vậy, chiến lược của Maven là: lần đầu truy cập phụ thuộc thì tải về repository cục bộ, lần thứ hai, thứ ba sử dụng thì dùng trực tiếp phụ thuộc trong repository cục bộ. Vai trò của repository từ xa và repository cục bộ trong Docker cũng tương tự như vậy.

## Trải nghiệm Docker lần đầu

Dưới đây chúng ta sẽ bắt đầu sử dụng Docker một cách sơ bộ, ví dụ ở đây là tải về một image MySQL.

Giống như GitHub, Docker cũng cung cấp Docker Hub để tra cứu địa chỉ và hướng dẫn sử dụng của các image. Trước tiên truy cập Docker Hub: [https://hub.docker.com/](https://hub.docker.com/)

![Docker Hub](https://oss.javaguide.cn/github/javaguide/tools/docker/dockerhub-com.png)

Nhập `mysql` vào ô tìm kiếm ở góc trên bên trái rồi nhấn Enter:

![Tìm kiếm MySQL trên Docker Hub](https://oss.javaguide.cn/github/javaguide/tools/docker/dockerhub-mysql.png)

Có thể thấy các image liên quan đến MySQL rất nhiều. Nếu góc trên bên phải có nhãn `OFFICIAL IMAGE` thì đó là image chính thức, vì vậy chúng ta nhấn vào image MySQL đầu tiên:

![Image MySQL chính thức](https://oss.javaguide.cn/github/javaguide/tools/docker/dockerhub-mysql-official-image.png)

Bên phải cung cấp lệnh tải image MySQL là `docker pull mysql`, nhưng lệnh này sẽ kéo phiên bản tương ứng với tag mặc định. Trong dự án thực tế, nên chỉ định rõ tag phiên bản để tránh môi trường không kiểm soát được.

Nếu muốn tải phiên bản image cụ thể, hãy nhấn vào `View Available Tags` bên dưới:

![Xem các phiên bản MySQL khác](https://oss.javaguide.cn/github/javaguide/tools/docker/dockerhub-mysql-view-available-tags.png)

Tại đây có thể thấy image của nhiều phiên bản khác nhau, bên phải có lệnh tải về. Ví dụ muốn tải image MySQL phiên bản 8.4, có thể chạy:

```shell
docker pull mysql:8.4
```

Tuy nhiên, quá trình tải image thường rất chậm, nên chúng ta cần cấu hình mirror để tăng tốc tải. Truy cập trang chủ `Aliyun` (阿里云), nhấn Console (控制台):

![Tăng tốc mirror Aliyun](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-aliyun-mirror-admin.png)

Sau đó nhấn vào menu ở góc trên bên trái; trong cửa sổ bật lên, di chuột vào Products & Services (产品与服务), rồi tìm kiếm Container Registry (容器镜像服务) ở bên phải, cuối cùng nhấn vào Container Registry:

![Tăng tốc mirror Aliyun](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-aliyun-mirror-admin-accelerator.png)

Nhấn vào Mirror Accelerator (镜像加速器) ở bên trái, rồi lần lượt chạy các lệnh cấu hình ở bên phải.

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://679xpnpz.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Các lệnh về image trong Docker

Docker cần thao tác thường xuyên với các image liên quan, nên trước tiên chúng ta hãy tìm hiểu các lệnh về image trong Docker.

Nếu muốn xem Docker hiện có những image nào, có thể dùng lệnh `docker images`.

```shell
[root@izrcf5u3j3q8xaz ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
mysql         8.4       f07dfa83b528   11 days ago     448MB
tomcat        latest    feba8d001e3f   2 weeks ago     649MB
nginx         latest    ae2feff98a0c   2 weeks ago     133MB
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB
```

Trong đó `REPOSITORY` là tên image, `TAG` là dấu hiệu phiên bản, `IMAGE ID` là id của image (duy nhất), `CREATED` là thời gian tạo. Lưu ý thời gian này không phải là lúc chúng ta tải image về Docker, mà là thời gian do người tạo image tạo ra; `SIZE` là kích thước image.

Lệnh này có thể tra cứu theo tên image chỉ định:

```shell
docker images mysql
```

Làm như vậy sẽ tra cứu ra tất cả image MySQL trong Docker:

```shell
[root@izrcf5u3j3q8xaz ~]# docker images mysql
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
mysql        8.4       0ebb5600241d   11 days ago     589MB
mysql        8.0       f07dfa83b528   11 days ago     596MB
```

Lệnh này còn có thể kèm tham số `-q`: `docker images -q`, trong đó `-q` nghĩa là chỉ hiển thị id của image:

```shell
[root@izrcf5u3j3q8xaz ~]# docker images -q
0ebb5600241d
f07dfa83b528
feba8d001e3f
d404d78aa797
```

Nếu muốn tải image thì dùng:

```shell
docker pull mysql:8.4
```

`docker pull` là lệnh cố định, phía sau ghi tên image và tag phiên bản cần tải; nếu không ghi tag phiên bản mà chỉ chạy `docker pull mysql`, Docker sẽ kéo phiên bản tương ứng với tag mặc định.

Thông thường, trước khi tải image, chúng ta cần tìm xem image có những phiên bản nào để chỉ định tải phiên bản cụ thể, dùng lệnh:

```shell
docker search mysql
```

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-search-mysql-terminal.png)

Tuy nhiên, `docker search` chỉ có thể tìm kiếm trong image repository chứ không liệt kê được toàn bộ tag của một image. Muốn xem MySQL hỗ trợ những phiên bản nào, nên truy cập trực tiếp trang Tags trên Docker Hub.

```shell
docker pull mysql:8.4
```

Nếu tag không tồn tại, khi chạy `docker pull` sẽ trả về lỗi dạng `manifest unknown`:

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-search-mysql-404-terminal.png)

Xóa image dùng lệnh:

```shell
docker image rm mysql:8.4
```

Nếu không chỉ định phiên bản thì mặc định sẽ xóa phiên bản mới nhất.

Cũng có thể xóa bằng cách chỉ định id của image:

```shell
docker image rm bf756fb1ae65
```

Tuy nhiên lúc này lại báo lỗi:

```shell
[root@izrcf5u3j3q8xaz ~]# docker image rm bf756fb1ae65
Error response from daemon: conflict: unable to delete bf756fb1ae65 (must be forced) - image is being used by stopped container d5b6c177c151
```

Nguyên nhân là image `hello-world` cần xóa đang được sử dụng, nên không thể xóa được. Lúc này cần buộc (force) thực hiện xóa:

```shell
docker image rm -f bf756fb1ae65
```

Lệnh này sẽ xóa image cùng tất cả container được tạo từ image đó, hãy thận trọng khi sử dụng.

Docker còn cung cấp phiên bản rút gọn của lệnh xóa image: `docker rmi tên-image:tag-phiên-bản`.

Lúc này chúng ta có thể kết hợp `rmi` và `-q` để thực hiện một số thao tác liên hoàn. Ví dụ, muốn xóa tất cả image MySQL, cần tra cứu ID của các image MySQL rồi lần lượt chạy `docker rmi` để xóa từng cái. Cũng có thể làm như sau:

```shell
docker rmi -f $(docker images mysql -q)
```

Trước tiên dùng `docker images mysql -q` để tra cứu tất cả ID image của MySQL, `-q` nghĩa là chỉ tra cứu ID, rồi truyền các ID này làm tham số cho lệnh `docker rmi -f`. Như vậy tất cả image MySQL sẽ bị xóa.

## Các lệnh về container trong Docker

Sau khi nắm được các lệnh liên quan đến image, chúng ta cần tìm hiểu các lệnh về container. Container được xây dựng dựa trên image.

Nếu muốn chạy một container từ image thì dùng:

```shell
docker run tomcat:8.0-jre8
```

Tất nhiên, điều kiện tiên quyết để chạy là bạn phải có image này, nên hãy tải image trước:

```shell
docker pull tomcat:8.0-jre8
```

Sau khi tải xong là có thể chạy được. Chạy xong, hãy kiểm tra các container đang chạy hiện tại: `docker ps`.

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-ps-terminal.png)

Trong đó `CONTAINER ID` là id của container, `IMAGE` là tên image, `COMMAND` là lệnh được thực thi bên trong container, `CREATED` là thời gian tạo container, `STATUS` là trạng thái của container, `PORTS` là cổng mà dịch vụ trong container đang lắng nghe, `NAMES` là tên của container.

Tomcat chạy theo cách này không thể được truy cập trực tiếp từ bên ngoài, vì container có tính cô lập. Nếu muốn truy cập tomcat bên trong container trực tiếp qua cổng 8080, cần ánh xạ (map) cổng của máy chủ (host) với cổng bên trong container:

```shell
docker run -p 8080:8080 tomcat:8.0-jre8
```

Giải thích ý nghĩa của hai cổng này (`8080:8080`): cổng 8080 thứ nhất là cổng của máy chủ, cổng 8080 thứ hai là cổng bên trong container. Khi truy cập cổng 8080 từ bên ngoài, thông qua ánh xạ sẽ truy cập cổng 8080 bên trong container.

Lúc này bên ngoài đã có thể truy cập Tomcat:

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-run-tomact-8080.png)

Nếu ánh xạ như sau:

```shell
docker run -p 8088:8080 tomcat:8.0-jre8
```

Thì bên ngoài phải truy cập cổng 8088 mới vào được tomcat. Cần lưu ý là mỗi container chạy lên đều độc lập với nhau, nên chạy đồng thời nhiều container tomcat cũng không gây xung đột cổng.

Container còn có thể chạy ở chế độ nền (background), như vậy sẽ không chiếm terminal:

```shell
docker run -d -p 8080:8080 tomcat:8.0-jre8
```

Khi khởi động container, mặc định container sẽ được gán một tên, nhưng tên này thực ra có thể tự đặt, dùng lệnh:

```shell
docker run -d -p 8080:8080 --name tomcat01 tomcat:8.0-jre8
```

Lúc này tên container là tomcat01. Tên container phải là duy nhất.

Mở rộng thêm một chút về các tham số của `docker ps`, ví dụ `-a`:

```shell
docker ps -a
```

Tham số này sẽ liệt kê tất cả container, cả đang chạy lẫn không chạy.

Tham số `-q` sẽ chỉ tra cứu id của các container đang chạy: `docker ps -q`.

```shell
[root@izrcf5u3j3q8xaz ~]# docker ps -q
f3aac8ee94a3
074bf575249b
1d557472a708
4421848ba294
```

Nếu kết hợp cả hai thì sẽ tra cứu id của tất cả container, cả đang chạy lẫn không chạy: `docker ps -qa`.

```shell
[root@izrcf5u3j3q8xaz ~]# docker ps -aq
f3aac8ee94a3
7f7b0e80c841
074bf575249b
a1e830bddc4c
1d557472a708
4421848ba294
b0440c0a219a
c2f5d78c5d1a
5831d1bab2a6
d5b6c177c151
```

Tiếp theo là các lệnh dừng và khởi động lại container. Vì rất đơn giản nên không giới thiệu nhiều.

```shell
docker start c2f5d78c5d1a
```

Lệnh này sẽ chạy lại một container đã dừng. Có thể khởi động bằng id của container hoặc bằng tên của container.

```shell
docker restart c2f5d78c5d1a
```

Lệnh này sẽ khởi động lại container chỉ định.

```shell
docker stop c2f5d78c5d1a
```

Lệnh này sẽ dừng container chỉ định.

```shell
docker kill c2f5d78c5d1a
```

Lệnh này sẽ "giết" (kill) ngay container chỉ định.

Các lệnh trên đều có thể dùng kết hợp với id container hoặc tên container.

---

Khi container đã dừng, tuy không còn chạy nữa nhưng nó vẫn tồn tại. Nếu muốn xóa nó thì dùng lệnh:

```shell
docker rm d5b6c177c151
```

Cần lưu ý là id của container không cần ghi đầy đủ, chỉ cần đủ để nhận diện duy nhất là được.

Nếu muốn xóa container đang chạy, cần thêm tham số `-f` để buộc xóa:

```shell
docker rm -f d5b6c177c151
```

Nếu muốn xóa tất cả container, có thể dùng lệnh kết hợp:

```shell
docker rm -f $(docker ps -qa)
```

Trước tiên dùng `docker ps -qa` để tra cứu id của tất cả container, sau đó dùng `docker rm -f` để xóa.

---

Khi container chạy ở chế độ nền, chúng ta không thể biết được trạng thái chạy của nó. Nếu cần xem log của container thì dùng lệnh:

```shell
docker logs 289cc00dc5ed
```

Cách hiển thị log như vậy không phải thời gian thực (real-time). Nếu muốn hiển thị real-time, cần dùng tham số `-f`:

```shell
docker logs -f 289cc00dc5ed
```

Tham số `-t` còn có thể hiển thị timestamp của log, thường dùng kết hợp với tham số `-f`:

```shell
docker logs -ft 289cc00dc5ed
```

---

Xem những tiến trình nào đang chạy bên trong container, dùng lệnh:

```shell
docker top 289cc00dc5ed
```

Nếu muốn tương tác với container thì dùng lệnh:

```shell
docker exec -it 289cc00dc5ed bash
```

Lúc này terminal sẽ đi vào bên trong container, các lệnh thực thi đều có hiệu lực trong container. Bên trong container chỉ chạy được một số lệnh đơn giản như ls, cd... Nếu muốn thoát khỏi terminal của container và quay lại CentOS, chỉ cần chạy `exit`.

Bây giờ chúng ta đã có thể vào terminal của container để thực hiện các thao tác liên quan. Vậy làm thế nào để triển khai (deploy) một dự án vào container tomcat?

```shell
docker cp ./test.html 289cc00dc5ed:/usr/local/tomcat/webapps
```

Lệnh `docker cp` có thể sao chép file từ CentOS vào container. `./test.html` là đường dẫn tài nguyên trên CentOS, `289cc00dc5ed` là id của container, `/usr/local/tomcat/webapps` là đường dẫn tài nguyên trong container. Lúc này file `test.html` sẽ được sao chép vào đường dẫn đó.

```shell
[root@izrcf5u3j3q8xaz ~]# docker exec -it 289cc00dc5ed bash
root@289cc00dc5ed:/usr/local/tomcat# cd webapps
root@289cc00dc5ed:/usr/local/tomcat/webapps# ls
test.html
root@289cc00dc5ed:/usr/local/tomcat/webapps#
```

Nếu muốn sao chép file từ container ra CentOS thì chỉ cần viết ngược lại:

```shell
docker cp 289cc00dc5ed:/usr/local/tomcat/webapps/test.html ./
```

Vì vậy, nếu muốn triển khai dự án thì trước tiên tải dự án lên CentOS, sau đó sao chép dự án từ CentOS vào container, rồi khởi động container là xong.

---

Mặc dù khởi động môi trường phần mềm bằng Docker rất đơn giản, nhưng cũng có một vấn đề: chúng ta không thể biết được chi tiết cụ thể bên trong container, chẳng hạn cổng đang lắng nghe, địa chỉ ip được gắn... May mắn là Docker đã tính đến điều này, chỉ cần dùng lệnh:

```shell
docker inspect 923c969b0d91
```

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-inspect-terminal.png)

## Volume dữ liệu trong Docker

Sau khi học các lệnh liên quan đến container, chúng ta hãy tìm hiểu về volume dữ liệu (data volume) trong Docker. Nó cho phép chia sẻ file giữa máy chủ và container. Ưu điểm là khi sửa đổi file trên máy chủ sẽ ảnh hưởng trực tiếp đến container, không cần sao chép file từ máy chủ vào container nữa.

Nếu muốn tạo một data volume giữa thư mục `/opt/apps` trên máy chủ và thư mục `webapps` trong container thì viết lệnh như sau:

```shell
docker run -d -p 8080:8080 --name tomcat01 -v /opt/apps:/usr/local/tomcat/webapps tomcat:8.0-jre8
```

Tuy nhiên lúc này truy cập tomcat sẽ thấy không truy cập được:

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-data-volume-webapp-8080.png)

Điều này cho thấy data volume đã được thiết lập thành công. Docker sẽ đồng bộ thư mục `webapps` trong container với thư mục `/opt/apps`. Lúc này thư mục `/opt/apps` đang trống, khiến thư mục `webapps` cũng trở thành thư mục trống, nên không truy cập được.

Lúc này chỉ cần thêm file vào thư mục `/opt/apps` thì thư mục `webapps` cũng sẽ có các file tương ứng, đạt được chia sẻ file. Kiểm thử một chút:

```shell
[root@centos-7 opt]# cd apps/
[root@centos-7 apps]# vim test.html
[root@centos-7 apps]# ls
test.html
[root@centos-7 apps]# cat test.html
<h1>This is a test html!</h1>
```

Đã tạo một file `test.html` trong thư mục `/opt/apps`. Vậy thư mục `webapps` trong container có file này không? Vào terminal của container:

```shell
[root@centos-7 apps]# docker exec -it tomcat01 bash
root@115155c08687:/usr/local/tomcat# cd webapps/
root@115155c08687:/usr/local/tomcat/webapps# ls
test.html
```

Trong container quả thực đã có file đó. Tiếp theo chúng ta viết một ứng dụng Web đơn giản:

```java
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("Hello World!");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
```

Đây là một Servlet rất đơn giản. Đóng gói và tải nó lên `/opt/apps`, container chắc chắn sẽ đồng bộ được file này. Lúc này truy cập:

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-data-volume-webapp-8080-hello-world.png)

Cách này thường được gọi là bind mount (gắn kết thư mục), vì thư mục trên máy chủ do chính chúng ta chỉ định. Docker còn cung cấp một cách data volume khác phổ biến hơn: named volume (volume đặt tên).

```shell
docker run -d -p 8080:8080 --name tomcat01 -v aa:/usr/local/tomcat/webapps tomcat:8.0-jre8
```

Lúc này `aa` không phải là thư mục trên máy chủ mà là tên của data volume. Docker sẽ tự động tạo một data volume tên là `aa` và sao chép nội dung hiện có trong thư mục `webapps` của container vào volume đó. Mặc định, data volume do Docker quản lý nằm trong thư mục `/var/lib/docker/volumes`:

```shell
[root@centos-7 volumes]# pwd
/var/lib/docker/volumes
[root@centos-7 volumes]# cd aa/
[root@centos-7 aa]# ls
_data
[root@centos-7 aa]# cd _data/
[root@centos-7 _data]# ls
docs  examples  host-manager  manager  ROOT
```

Lúc này chỉ cần sửa nội dung của thư mục đó là sẽ ảnh hưởng đến container. Tuy nhiên, trong dự án thực tế không nên sửa trực tiếp các file trong `/var/lib/docker/volumes`; hãy ưu tiên quản lý dữ liệu thông qua container, ứng dụng hoặc thư mục bind mount được chỉ định rõ ràng.

---

Cuối cùng giới thiệu thêm một vài lệnh liên quan đến container và image:

```shell
docker commit -m "描述信息" -a "镜像作者" tomcat01 my_tomcat:1.0
```

Lệnh này có thể đóng gói một container thành một image. Sau đó tra cứu image:

```shell
[root@centos-7 _data]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my_tomcat           1.0                 79ab047fade5        2 seconds ago       463MB
tomcat              8                   a041be4a5ba5        2 weeks ago         533MB
mysql               8.4                 db2b37ec6181        2 months ago        589MB
```

Nếu muốn sao lưu (backup) image thì dùng lệnh:

```shell
docker save my_tomcat:1.0 -o my-tomcat-1.0.tar
```

```shell
[root@centos-7 ~]# docker save my_tomcat:1.0 -o my-tomcat-1.0.tar
[root@centos-7 ~]# ls
anaconda-ks.cfg  initial-setup-ks.cfg  公共  视频  文档  音乐
get-docker.sh    my-tomcat-1.0.tar     模板  图片  下载  桌面
```

Nếu có một image định dạng `.tar` thì làm thế nào để nạp vào Docker? Chạy lệnh:

```shell
docker load -i my-tomcat-1.0.tar
```

```shell
root@centos-7 ~]# docker load -i my-tomcat-1.0.tar
b28ef0b6fef8: Loading layer [==================================================>]  105.5MB/105.5MB
0b703c74a09c: Loading layer [==================================================>]  23.99MB/23.99MB
......
Loaded image: my_tomcat:1.0
[root@centos-7 ~]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my_tomcat           1.0                 79ab047fade5        7 minutes ago       463MB
```

## Các lệnh kiểm tra, xử lý sự cố thường dùng

Sau khi bắt tay vào dùng Docker, thứ thực sự hay dùng là các lệnh kiểm tra, xử lý sự cố (troubleshooting). Nên làm quen với các lệnh sau:

```shell
# Xem tham số khởi động, mạng, thư mục mount và biến môi trường của container
docker inspect tomcat01

# Xem log gần nhất của container
docker logs --tail=100 tomcat01

# Xem log của container liên tục
docker logs -f tomcat01

# Xem mức sử dụng tài nguyên của container
docker stats

# Xem dung lượng đĩa mà Docker đang chiếm
docker system df
```

Khi dọn dẹp tài nguyên cần cẩn thận, đặc biệt với các lệnh có `-f`. `docker system prune` sẽ xóa các container, mạng, image và build cache không sử dụng; nếu thêm `--volumes`, nó còn dọn cả các data volume không sử dụng — dữ liệu database, dữ liệu kiểm thử cục bộ đều có thể bị xóa mất.

<!-- @include: @article-footer.snippet.md -->
