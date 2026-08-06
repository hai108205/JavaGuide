---
title: Giải thích chi tiết thiết kế hệ thống phân quyền
description: Kiểm soát truy cập dựa trên vai trò (Role-Based Access Control, viết tắt là RBAC) là việc ủy quyền cho người dùng thông qua vai trò (Role) của họ, triển khai kiểm soát truy cập linh hoạt, so với việc cấp quyền trực tiếp cho người dùng thì đơn giản, hiệu quả và có khả năng mở rộng hơn.
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 权限系统设计,RBAC,ABAC,用户角色权限,资源权限,权限模型,权限校验,授权系统
---

<!-- @include: @article-header.snippet.md -->

> Tác giả: Đội ngũ kỹ thuật ZhuanZhuan
>
> Bài gốc: <https://mp.weixin.qq.com/s/ONMuELjdHYa0yQceTj01Iw>

## Vấn đề và hiện trạng của hệ thống phân quyền cũ

Công ty ZhuanZhuan trước đây không có một hệ thống quản lý phân quyền thống nhất, việc quản lý phân quyền do各业务 tự phát triển hoặc sử dụng hệ thống phân quyền của业务 khác, sự không thống nhất trong quản lý phân quyền đã mang lại không ít vấn đề:

1. Các业务重复造轮子, chi phí bảo trì cao
2. Mỗi hệ thống chỉ giải quyết một phần tình huống, giải pháp không đủ通用, khi chọn giải pháp cho dự án mới không có phương án quản lý phân quyền đáng tin cậy
3. Thiếu quản lý nhật ký và quy trình phê duyệt thống nhất, việc truy xuất thông tin ủy quyền rất khó khăn

Dựa trên các vấn đề trên, cuối năm ngoái công ty đã khởi động xây dựng hệ thống phân quyền thống nhất ZhuanZhuan, mục tiêu là phát triển một hệ thống quản lý phân quyền linh hoạt, dễ sử dụng, an toàn,供各业务 sử dụng.

## Các phương thức thiết kế hệ thống phân quyền trong ngành

Hiện nay có hai mô hình phân quyền chính trong ngành, dưới đây giới thiệu lần lượt:

- **Kiểm soát truy cập dựa trên vai trò (RBAC)**
- **Kiểm soát truy cập dựa trên thuộc tính (ABAC)**

### Mô hình RBAC

**Kiểm soát truy cập dựa trên vai trò (Role-Based Access Control, viết tắt là RBAC)** là việc ủy quyền cho người dùng thông qua vai trò (Role) của họ, triển khai kiểm soát truy cập linh hoạt, so với việc cấp quyền trực tiếp cho người dùng thì đơn giản, hiệu quả và có khả năng mở rộng hơn.

Một người dùng có thể có một số vai trò, mỗi vai trò lại có thể được gán một số quyền, như vậy tạo thành mô hình ủy quyền "Người dùng - Vai trò - Quyền". Trong mô hình này, giữa người dùng và vai trò, giữa vai trò và quyền tạo thành quan hệ nhiều-nhiều.

Mô tả bằng một sơ đồ như sau:

![RBAC 权限模型示意图](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/rbac.png)

Khi sử dụng `mô hình RBAC`, thông qua việc phân tích tình hình thực tế của người dùng, dựa trên trách nhiệm và nhu cầu chung, cấp cho họ các vai trò khác nhau. Mối quan hệ `Người dùng -> Vai trò -> Quyền` này, cho phép chúng ta không cần quản lý riêng lẻ quyền của từng người dùng, người dùng sẽ nhận được các quyền cần thiết từ vai trò được cấp.

Lấy một tình huống đơn giản (hệ thống phân quyền của Gitlab) làm ví dụ, trong hệ thống người dùng có ba vai trò `Admin`, `Maintainer`, `Operator`, ba vai trò này分 biệt có các quyền khác nhau, ví dụ chỉ có `Admin` mới có quyền tạo kho mã nguồn, xóa kho mã nguồn, các vai trò khác đều không có. Chúng ta cấp cho một người dùng vai trò `Admin`, anh ta sẽ có hai quyền **tạo kho mã nguồn** và **xóa kho mã nguồn**.

Thông qua `mô hình RBAC`, khi có nhiều người dùng có cùng quyền, chúng ta chỉ cần tạo vai trò có quyền đó, sau đó gán cho các người dùng khác nhau các vai trò khác nhau, sau này chỉ cần sửa đổi quyền của vai trò, là có thể tự động sửa đổi quyền của tất cả người dùng trong vai trò đó.

### Mô hình ABAC

**Kiểm soát truy cập dựa trên thuộc tính (Attribute-Based Access Control, viết tắt là ABAC)** là một mô hình ủy quyền linh hoạt hơn `mô hình RBAC`, nguyên lý của nó là thông qua các thuộc tính khác nhau để phán đoán động xem một thao tác có được phép hay không. Mô hình này được sử dụng nhiều trong các hệ thống đám mây, như AWS, Alibaba Cloud, v.v.

Xem xét việc kiểm soát phân quyền trong các tình huống sau:

1. Ủy quyền cho một người cụ thể quyền chỉnh sửa một cuốn sách cụ thể
2. Khi phòng ban sở hữu của một tài liệu giống với phòng ban của người dùng, người dùng có thể truy cập tài liệu này
3. Khi người dùng là chủ sở hữu của một tài liệu và trạng thái của tài liệu là bản nháp, người dùng có thể chỉnh sửa tài liệu này
4. Trước 9 giờ sáng cấm người phòng ban A truy cập hệ thống B
5. Ở những nơi ngoài Thượng Hải cấm truy cập hệ thống A với tư cách quản trị viên
6. Người dùng có quyền thao tác với các đơn hàng được tạo trước ngày 2022-06-07

Có thể thấy các tình huống trên rất khó triển khai bằng `mô hình RBAC`, vì `mô hình RBAC` chỉ mô tả người dùng có thể làm thao tác gì, nhưng điều kiện của thao tác, cũng như dữ liệu của thao tác, bản thân `mô hình RBAC` không có những giới hạn này. Nhưng đây chính là thế mạnh của `mô hình ABAC`, tư tưởng của `mô hình ABAC` là dựa trên người dùng, thuộc tính của dữ liệu được truy cập, và các yếu tố môi trường khác nhau để tính toán động xem người dùng có quyền thực hiện thao tác hay không.

#### Nguyên lý của mô hình ABAC

Trong `mô hình ABAC`, một thao tác có được phép hay không là dựa trên đối tượng, tài nguyên, thao tác và thông tin môi trường cùng tính toán động để quyết định.

- **Đối tượng**: Đối tượng là người dùng hiện tại yêu cầu truy cập tài nguyên. Thuộc tính của người dùng bao gồm ID, tài nguyên cá nhân, vai trò, phòng ban và thành viên tổ chức, v.v.
- **Tài nguyên**: Tài nguyên là tài sản hoặc đối tượng mà người dùng hiện tại muốn truy cập, ví dụ như tệp, dữ liệu, máy chủ, thậm chí là API
- **Thao tác**: Thao tác là hành động mà người dùng cố gắng thực hiện trên tài nguyên. Các thao tác phổ biến bao gồm "đọc", "ghi", "chỉnh sửa", "sao chép" và "xóa"
- **Môi trường**: Môi trường là ngữ cảnh của mỗi yêu cầu truy cập. Thuộc tính môi trường bao gồm thời gian và vị trí truy cập, thiết bị của đối tượng, giao thức truyền thông và cường độ mã hóa, v.v.

Trong quá trình thực thi câu lệnh quyết định của `mô hình ABAC`, công cụ quyết định sẽ dựa trên câu lệnh quyết định đã định nghĩa, kết hợp với các yếu tố như đối tượng, tài nguyên, thao tác, môi trường để tính toán động ra kết quả quyết định. Mỗi khi có yêu cầu truy cập xảy ra, hệ thống quyết định `mô hình ABAC` sẽ phân tích xem giá trị thuộc tính có khớp với chính sách đã thiết lập hay không. Nếu có chính sách khớp, yêu cầu truy cập sẽ được thông qua.

## Tư tưởng thiết kế của hệ thống phân quyền mới

Kết hợp với hiện trạng nghiệp vụ của ZhuanZhuan, `mô hình RBAC` đáp ứng được phần lớn các tình huống nghiệp vụ của ZhuanZhuan, và chi phí phát triển thấp hơn nhiều so với hệ thống phân quyền `mô hình ABAC`, nên hệ thống phân quyền mới đã chọn triển khai dựa trên `mô hình RBAC`. Đối với các hệ thống nghiệp vụ thực sự không thể đáp ứng, chúng tôi đã chọn tạm thời không hỗ trợ, như vậy có thể đảm bảo hệ thống phân quyền mới được triển khai nhanh chóng, nhanh chóng được业务 sử dụng.

`Mô hình RBAC` chuẩn là hoàn toàn tuân theo chuỗi `Người dùng -> Vai trò -> Quyền` này, tức là quyền của người dùng hoàn toàn do vai trò mà anh ta sở hữu kiểm soát, nhưng như vậy sẽ có một nhược điểm, là muốn thêm quyền cho người dùng thì phải tạo thêm một vai trò mới, dẫn đến hiệu suất thao tác thực tế thấp. Vì vậy, chúng tôi đã trên cơ sở `mô hình RBAC`, thêm khả năng cấp quyền trực tiếp cho người dùng, tức là vừa có thể thêm vai trò cho người dùng, vừa có thể thêm quyền trực tiếp cho người dùng. Quyền cuối cùng của người dùng là sự kết hợp giữa vai trò sở hữu và các điểm quyền.

**Mô hình phân quyền của hệ thống phân quyền mới**: Quyền cuối cùng của người dùng = Quyền do vai trò người dùng sở hữu mang lại + Quyền do người dùng cấu hình độc lập, lấy hợp của hai tập hợp.

Sơ đồ giải pháp hệ thống phân quyền mới như sau:

![新权限系统方案](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/new-authority-system-design.png)

- Trước tiên, đưa tất cả người dùng trong tập đoàn (bao gồm người dùng bên ngoài), thông qua chức năng **đăng nhập và đăng ký thống nhất** triển khai quản lý thống nhất, đồng thời kết nối với mô-đun thông tin cơ cấu tổ chức của công ty, triển khai同一 thông tin của cùng một người trong tất cả các hệ thống là nhất quán, điều này cũng tạo khả thi cho việc quản lý phân quyền dựa trên cơ cấu tổ chức sau này.
- Thứ hai, vì hệ thống phân quyền mới cần phục vụ tất cả các业务 của tập đoàn, nên cần hỗ trợ quản lý phân quyền đa hệ thống. Trước khi người dùng tiến hành quản lý phân quyền, cần chọn hệ thống tương ứng trước, sau đó cấu hình thông tin **quyền menu** và **quyền dữ liệu** của hệ thống đó, thiết lập各权限点 của hệ thống. _PS: Giải thích cụ thể về quyền menu và quyền dữ liệu, phần sau sẽ giới thiệu chi tiết._
- Cuối cùng, tạo các vai trò khác nhau trong hệ thống đó, cấu hình各权限点 cho các vai trò khác nhau. Ví dụ vai trò店长, có quyền thao tác店员, quyền xem dữ liệu本店, v.v., sau khi cấu hình vai trò này, sau này chỉ cần thêm vai trò này cho店长, là có thể để anh ta có các quyền tương ứng.

Sau khi hoàn thành các cấu hình trên, có thể tiến hành quản lý phân quyền cho người dùng. Có hai cách để thêm quyền cho người dùng:

1. Chọn người dùng trước, sau đó thêm quyền. Cách này có thể thêm cho người dùng vai trò bất kỳ hoặc điểm quyền menu/dữ liệu.
2. Chọn vai trò trước, sau đó liên kết người dùng. Cách này chỉ có thể thêm vai trò cho người dùng, không thể thêm riêng điểm quyền menu/dữ liệu.

Hai phương thức này có giải pháp thiết kế cụ thể, phần sau sẽ giải thích chi tiết.

### Quản lý phân quyền của chính hệ thống phân quyền

Đối với hệ thống phân quyền, trước tiên cần thiết kế tốt quản lý phân quyền của chính hệ thống, tức là cần quản lý tốt "ai có thể vào hệ thống phân quyền, ai có thể quản lý phân quyền của các hệ thống khác", đối với người dùng của chính hệ thống phân quyền, sẽ được chia thành ba loại:

1. **Siêu quản trị viên (Super Admin)**: Có toàn bộ quyền thao tác của hệ thống phân quyền, có thể thực hiện bất kỳ thao tác nào của chính hệ thống, cũng có thể quản lý thao tác quản lý của các hệ thống ứng dụng đã tích hợp phân quyền.
2. **Người dùng thao tác phân quyền**: Người dùng có ít nhất một vai trò siêu quản trị viên của hệ thống ứng dụng đã tích hợp. Các thao tác mà người dùng này có thể thực hiện được giới hạn trong phạm vi quyền của hệ thống ứng dụng sở hữu. Người dùng thao tác phân quyền là một loại身份, không cần phân phối, mà được tự động có được theo quy tắc.
3. **Người dùng thông thường**: Người dùng thông thường cũng可以认为 là một loại身份, ngoại trừ 2 loại người trên, còn lại đều là người dùng thông thường. Họ chỉ có thể申请接入系统 và truy cập trang申请权限.

### Định nghĩa các loại quyền

Trong hệ thống phân quyền mới, chúng tôi chia quyền thành hai loại lớn, lần lượt là:

- **Quyền chức năng menu**: Bao gồm quyền truy cập目录导航, menu của hệ thống, cũng như quyền thao tác nút và API
- **Quyền dữ liệu**: Bao gồm quyền định nghĩa phạm vi truy vấn dữ liệu, trong các hệ thống khác nhau, thường gọi là "tổ chức", "站点", v.v., trong hệ thống phân quyền mới, thống nhất gọi là "tổ chức" để quản lý quyền dữ liệu

### Phân loại vai trò mặc định

Trong mỗi hệ thống thiết kế ba vai trò mặc định, để đáp ứng nhu cầu quản lý phân quyền cơ bản, lần lượt như sau:

- **Siêu quản trị viên (Super Admin)**: Vai trò này có toàn bộ quyền của hệ thống đó, có thể sửa đổi cấu hình như quyền vai trò của hệ thống, có thể ủy quyền cho người dùng khác.
- **Quản trị viên hệ thống (System Admin)**: Vai trò này có khả năng ủy quyền cho người dùng khác và sửa đổi cấu hình như quyền vai trò của hệ thống, nhưng bản thân vai trò không có bất kỳ quyền nào.
- **Quản trị viên ủy quyền (Authorization Admin)**: Vai trò này có khả năng ủy quyền cho người dùng khác. Nhưng phạm vi ủy quyền không vượt quá quyền mà mình sở hữu.

> Ví dụ: Quản trị viên ủy quyền A có thể thêm quyền cho người dùng B, nhưng phạm vi thêm vào nhỏ hơn hoặc bằng quyền mà người dùng A đã sở hữu.

Sau khi phân biệt như vậy, tách biệt **có quyền** và **có khả năng ủy quyền**, có thể đáp ứng tất cả các tình huống kiểm soát phân quyền.

## Thiết kế các mô-đun cốt lõi của hệ thống phân quyền mới

Trên đây đã giới thiệu tư tưởng thiết kế tổng thể của hệ thống phân quyền mới, tiếp theo lần lượt giới thiệu thiết kế của các mô-đun cốt lõi.

### Quản lý hệ thống/menu/quyền dữ liệu

Các bước để tích hợp một hệ thống mới vào hệ thống phân quyền:

1. Tạo hệ thống
2. Cấu hình quyền chức năng menu
3. Cấu hình quyền dữ liệu (tùy chọn)
4. Tạo vai trò của hệ thống

Trong đó, các bước 1, 2, 3 đều được hoàn thành trong mô-đun quản lý hệ thống, quy trình cụ thể như hình dưới:

![系统接入流程图](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/new-authority-system-design-access-flow-chart.png)

Người dùng có thể thực hiện thao tác tăng, sửa, xóa, tra cứu thông tin cơ bản của hệ thống, các hệ thống khác nhau được phân biệt duy nhất thông qua `mã hệ thống`. Đồng thời `mã hệ thống` cũng sẽ được dùng làm tiền tố cho mã hóa quyền menu và dữ liệu, thông qua thiết kế này đảm bảo tính duy nhất toàn cục của mã quyền.

Ví dụ mã hệ thống là `test_online`, thì định dạng mã menu của hệ thống đó sẽ là `test_online:m_xxx`.

Thiết kế giao diện quản lý hệ thống như sau:

![系统管理界面设计](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/new-authority-system-management-interface.png)

#### Quản lý menu

Hệ thống phân quyền mới trước tiên đã phân loại menu, lần lượt là `目录`, `menu` và `操作`, minh họa như hình dưới

![菜单管理界面](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/new-authority-system-menu.png)

Ý nghĩa của chúng lần lượt là:

- **目录**: Chỉ thư mục cấp một trên cùng trong hệ thống ứng dụng, thường ở bên phải Logo hệ thống
- **Menu**: Chỉ menu đa cấp bên trái của hệ thống ứng dụng, thường ở dưới Logo hệ thống, cũng là cấu trúc menu thường dùng nhất
- **操作**: Chỉ các phần có thể định nghĩa là thao tác hoặc phần tử trang như nút,接口 trong trang.

Thiết kế giao diện quản lý menu như sau:

![菜单管理界面设计](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/new-authority-system-menu-management-interface.png)

Việc sử dụng dữ liệu quyền menu, cũng cung cấp hai cách:

- **Chế độ menu động**: Trong chế độ này, việc thêm xóa menu hoàn toàn do hệ thống phân quyền接管. Tức là trong hệ thống phân quyền thêm menu, hệ thống ứng dụng sẽ đồng bộ thêm theo. Ưu điểm của chế độ này là sửa đổi menu không cần dự án lên线上.
- **Chế độ menu tĩnh**: Việc thêm xóa menu do frontend của hệ thống ứng dụng kiểm soát, hệ thống phân quyền chỉ kiểm soát quyền truy cập. Trong chế độ này, hệ thống phân quyền chỉ có thể đánh dấu người dùng có quyền menu hiện tại hay không, còn việc kiểm soát hiển thị cụ thể là do frontend quyết định dựa trên dữ liệu quyền.

Cần đặc biệt lưu ý: Frontend ẩn目录, menu hoặc nút chỉ là cải thiện trải nghiệm người dùng, không thể coi là ranh giới bảo mật thực sự. Bất kể áp dụng chế độ menu động hay tĩnh, backend đều phải mặc định từ chối các truy cập không được ủy quyền rõ ràng, và trong mỗi yêu cầu kiểm tra người dùng hiện tại có quyền thực hiện thao tác tương ứng hay không. Khi liên quan đến dữ liệu cụ thể, còn phải tiếp tục kiểm tra归属 tài nguyên, tenant, tổ chức và phạm vi dữ liệu, không thể chỉ phán đoán người dùng có menu nào đó, cũng không thể tin tưởng User ID, tổ chức ID hoặc tài nguyên ID do client truyền lên.

### Quản lý vai trò và người dùng

Quản lý vai trò và người dùng đều là các mô-đun cốt lõi có thể trực tiếp thay đổi quyền của người dùng, toàn bộ ý tưởng thiết kế như hình dưới:

![角色与用户管理模块设计](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/role-and-user-management.png)

Điểm quan trọng trong thiết kế mô-đun này là cần xem xét đến thao tác hàng loạt. Bất kể là liên kết người dùng thông qua vai trò, hay thêm/xóa/đặt lại quyền hàng loạt cho người dùng, các tình huống thao tác hàng loạt đều là những thứ hệ thống cần thiết kế tốt.

### 申请权限 (Yêu cầu quyền)

Ngoài việc thêm quyền cho người dùng khác, hệ thống phân quyền mới đồng thời hỗ trợ người dùng tự chủ申请权限. Mô-đun này ngoài quy trình phê duyệt thông thường (申请, phê duyệt, xem), v.v., có một chức năng khá đặc biệt, đó là làm sao để người dùng có thể chọn đúng quyền mình cần. Vì vậy trong thiết kế của mô-đun này, ngoài việc chọn vai trò trực tiếp, còn hỗ trợ thông qua điểm quyền menu/dữ liệu, chọn ngược lại vai trò, như hình dưới:

![权限申请界面](https://oss.javaguide.cn/github/javaguide/system-design/security/design-of-authority-system/permission-application.png)

### Nhật ký thao tác

Nhật ký thao tác hệ thống sẽ được chia thành hai loại lớn:

1. **Nhật ký流水 thao tác**: Nhật ký thao tác关键 mà người dùng có thể xem, có thể tra cứu
2. **Nhật ký Log dịch vụ**: Nhật ký Log phát sinh trong quá trình vận hành dịch vụ hệ thống, trong đó, lượng thông tin nhật ký Log dịch vụ lớn hơn nhật ký流水 thao tác, nhưng không tiện tìm kiếm xem. Vì vậy hệ thống phân quyền cần cung cấp chức năng nhật ký流水 thao tác.

Trong hệ thống phân quyền mới, tất cả các thao tác của người dùng có thể chia thành ba loại, lần lượt là thêm mới, cập nhật, xóa. Tất cả các mô-đun cũng có thể liệt kê, ví dụ quản lý người dùng, quản lý vai trò, quản lý menu, v.v. Sau khi xác định rõ những thông tin này, một dòng nhật ký có thể được trừu tượng hóa thành: Ai (Who) vào thời gian nào (When) đối với những ai (Target) đã thực hiện thao tác gì trên mô-đun nào.
Như vậy lưu tất cả các bản ghi vào cơ sở dữ liệu, là có thể thuận tiện tiến hành xem và lọc nhật ký.

## Tổng kết và triển vọng

Đến đây, ý tưởng thiết kế cốt lõi và các mô-đun của hệ thống phân quyền mới đã được giới thiệu xong, hệ thống mới được sử dụng rộng rãi trong nội bộ ZhuanZhuan với lượng lớn业务接入, việc quản lý phân quyền đã thuận tiện hơn trước rất nhiều. Hệ thống phân quyền là một hệ thống cơ bản của mỗi công ty, thiết kế linh hoạt và完备 có thể giúp sự phát triển nghiệp vụ sau này hiệu quả hơn.

Hai bài tiếp theo:

- [转转统一权限系统的设计与实现（后端实现篇）](https://mp.weixin.qq.com/s/hFTDckfxhSnoM_McP18Vkg)
- [转转统一权限系统的设计与实现（前端实现篇）](https://mp.weixin.qq.com/s/a_P4JAwxgunhfmJvpBnWYA)

## Tham khảo

- OWASP Authorization Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- 选择合适的权限模型：<https://docs.authing.cn/v2/guides/access-control/choose-the-right-access-control-model.html>

<!-- @include: @article-footer.snippet.md -->