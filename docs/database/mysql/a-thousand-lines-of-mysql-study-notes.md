---
title: Một nghìn dòng ghi chú học tập MySQL
description: Bản tóm tắt tinh gọn của một nghìn dòng ghi chú học tập MySQL, bao quát các kiến thức cốt lõi như thao tác cơ sở dữ liệu, quản lý bảng, cú pháp SQL, Index, View, Stored Procedure, Trigger, phù hợp để tra cứu và ôn tập nhanh.
category: Cơ sở dữ liệu
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: Ghi chú học tập MySQL,Tổng hợp lệnh MySQL,Cú pháp SQL,Thao tác cơ sở dữ liệu,Thao tác bảng,Index,View,Stored Procedure,Trigger
---

> Bài viết gốc: <https://shockerli.net/post/1000-line-mysql-note/> , JavaGuide đã trình bày lại bài viết này một cách ngắn gọn và bổ sung thêm mục lục.

Một bản tổng kết rất hay, rất nên lưu lại để xem khi cần.

### Các thao tác cơ bản

```sql
/* Dịch vụ Windows */
-- Khởi động MySQL
			net start mysql
-- Tạo dịch vụ Windows
				sc create mysql binPath= mysqld_bin_path(Chú ý: giữa dấu bằng và giá trị có khoảng trắng)
/* Kết nối và ngắt kết nối máy chủ */
-- Kết nối MySQL
				mysql -h địa_chỉ -P cổng -u tên_người_dùng -p mật_khẩu
-- Hiển thị các thread đang chạy
				SHOW PROCESSLIST
-- Hiển thị thông tin biến hệ thống
				SHOW VARIABLES
```

### Thao tác cơ sở dữ liệu

```sql
/* Thao tác cơ sở dữ liệu */
-- Xem cơ sở dữ liệu hiện tại
    SELECT DATABASE();
-- Hiển thị thời gian hiện tại, tên người dùng, phiên bản cơ sở dữ liệu
    SELECT now(), user(), version();
-- Tạo cơ sở dữ liệu
    CREATE DATABASE[ IF NOT EXISTS] tên_cơ_sở_dữ_liệu tùy_chọn_cơ_sở_dữ_liệu
    Tùy chọn cơ sở dữ liệu:
        CHARACTER SET charset_name
        COLLATE collation_name
-- Xem các cơ sở dữ liệu đã có
    SHOW DATABASES[ LIKE 'PATTERN']
-- Xem thông tin cơ sở dữ liệu hiện tại
    SHOW CREATE DATABASE tên_cơ_sở_dữ_liệu
-- Sửa thông tin tùy chọn của cơ sở dữ liệu
    ALTER DATABASE tên_cơ_sở_dữ_liệu thông_tin_tùy_chọn
-- Xóa cơ sở dữ liệu
    DROP DATABASE[ IF EXISTS] tên_cơ_sở_dữ_liệu
        Đồng thời xóa các thư mục liên quan đến cơ sở dữ liệu đó và nội dung bên trong thư mục
```

### Thao tác với bảng

```sql
/* Thao tác với bảng  */
-- Tạo bảng
    CREATE [TEMPORARY] TABLE[ IF NOT EXISTS] [tên_cơ_sở_dữ_liệu.]tên_bảng ( định nghĩa cấu trúc bảng )[ tùy_chọn_bảng]
        Mỗi trường phải có kiểu dữ liệu
        Sau trường cuối cùng không được có dấu phẩy
        TEMPORARY bảng tạm, bảng tự động biến mất khi phiên làm việc kết thúc
        Đối với định nghĩa trường:
            tên_trường kiểu_dữ_liệu [NOT NULL | NULL] [DEFAULT default_value] [AUTO_INCREMENT] [UNIQUE [KEY] | [PRIMARY] KEY] [COMMENT 'string']
-- Tùy chọn bảng
    -- Character set
        CHARSET = charset_name
        Nếu bảng không được thiết lập thì sử dụng character set của cơ sở dữ liệu
    -- Storage engine
        ENGINE = engine_name
        Các cấu trúc dữ liệu khác nhau được bảng sử dụng khi quản lý dữ liệu; cấu trúc khác nhau dẫn đến cách xử lý, các thao tác đặc trưng được cung cấp khác nhau
        Các engine phổ biến: InnoDB MyISAM Memory/Heap BDB Merge Example CSV MaxDB Archive
        Các engine khác nhau lưu trữ cấu trúc và dữ liệu của bảng theo những cách khác nhau
        Ý nghĩa các file của bảng MyISAM: .frm là định nghĩa bảng, .MYD là dữ liệu bảng, .MYI là Index của bảng
        Ý nghĩa các file của bảng InnoDB: .frm là định nghĩa bảng, dữ liệu tablespace và file log
        SHOW ENGINES -- Hiển thị thông tin trạng thái của các storage engine
        SHOW ENGINE tên_engine {LOGS|STATUS} -- Hiển thị thông tin log hoặc trạng thái của storage engine
    -- Giá trị bắt đầu của auto-increment
    	AUTO_INCREMENT = số_dòng
    -- Thư mục file dữ liệu
        DATA DIRECTORY = 'thư_mục'
    -- Thư mục file Index
        INDEX DIRECTORY = 'thư_mục'
    -- Chú thích bảng
        COMMENT = 'string'
    -- Tùy chọn phân vùng (partition)
        PARTITION BY ... (xem chi tiết trong manual)
-- Xem tất cả các bảng
    SHOW TABLES[ LIKE 'pattern']
    SHOW TABLES FROM  tên_cơ_sở_dữ_liệu
-- Xem cấu trúc bảng
    SHOW CREATE TABLE tên_bảng (thông tin chi tiết hơn)
    DESC tên_bảng / DESCRIBE tên_bảng / EXPLAIN tên_bảng / SHOW COLUMNS FROM tên_bảng [LIKE 'PATTERN']
    SHOW TABLE STATUS [FROM db_name] [LIKE 'pattern']
-- Sửa bảng
    -- Sửa tùy chọn của chính bảng
        ALTER TABLE tên_bảng tùy_chọn_bảng
        eg: ALTER TABLE tên_bảng ENGINE=MYISAM;
    -- Đổi tên bảng
        RENAME TABLE tên_bảng_gốc TO tên_bảng_mới
        RENAME TABLE tên_bảng_gốc TO tên_cơ_sở_dữ_liệu.tên_bảng (có thể chuyển bảng sang cơ sở dữ liệu khác)
        -- RENAME có thể hoán đổi tên của hai bảng
    -- Sửa cấu trúc trường của bảng (13.1.2. Cú pháp ALTER TABLE)
        ALTER TABLE tên_bảng tên_thao_tác
        -- Tên thao tác
            ADD[ COLUMN] định_nghĩa_trường       -- Thêm trường
                AFTER tên_trường          -- Biểu thị thêm vào sau trường có tên này
                FIRST               -- Biểu thị thêm vào vị trí đầu tiên
            ADD PRIMARY KEY(tên_trường)   -- Tạo Primary Key
            ADD UNIQUE [tên_index] (tên_trường)-- Tạo Unique Index
            ADD INDEX [tên_index] (tên_trường) -- Tạo Index thông thường
            DROP[ COLUMN] tên_trường      -- Xóa trường
            MODIFY[ COLUMN] tên_trường thuộc_tính_trường     -- Hỗ trợ sửa thuộc tính trường, không thể sửa tên trường (tất cả thuộc tính cũ cũng phải viết lại)
            CHANGE[ COLUMN] tên_trường_cũ tên_trường_mới thuộc_tính_trường      -- Hỗ trợ sửa tên trường
            DROP PRIMARY KEY    -- Xóa Primary Key (trước khi xóa Primary Key cần xóa thuộc tính AUTO_INCREMENT của nó)
            DROP INDEX tên_index -- Xóa Index
            DROP FOREIGN KEY foreign_key    -- Xóa Foreign Key
-- Xóa bảng
    DROP TABLE[ IF EXISTS] tên_bảng ...
-- Xóa sạch dữ liệu trong bảng
    TRUNCATE [TABLE] tên_bảng
-- Sao chép cấu trúc bảng
    CREATE TABLE tên_bảng LIKE tên_bảng_cần_sao_chép
-- Sao chép cả cấu trúc và dữ liệu bảng
    CREATE TABLE tên_bảng [AS] SELECT * FROM tên_bảng_cần_sao_chép
-- Kiểm tra bảng có lỗi hay không
    CHECK TABLE tbl_name [, tbl_name] ... [option] ...
-- Tối ưu bảng
    OPTIMIZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ...
-- Sửa chữa bảng
    REPAIR [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ... [QUICK] [EXTENDED] [USE_FRM]
-- Phân tích bảng
    ANALYZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ...
```

### Thao tác dữ liệu

```sql
/* Thao tác dữ liệu */ ------------------
-- Thêm
    INSERT [INTO] tên_bảng [(danh_sách_trường)] VALUES (danh_sách_giá_trị)[, (danh_sách_giá_trị), ...]
        -- Nếu danh sách giá trị cần chèn bao gồm tất cả các trường và cùng thứ tự thì có thể bỏ qua danh sách trường.
        -- Có thể chèn nhiều bản ghi dữ liệu cùng lúc!
        REPLACE tương tự INSERT, điểm khác biệt duy nhất là đối với các dòng trùng khớp, dữ liệu của dòng hiện có (so sánh với Primary Key/Unique Key) sẽ bị thay thế; nếu không có dòng hiện có thì chèn dòng mới.
    INSERT [INTO] tên_bảng SET tên_trường=giá_trị[, tên_trường=giá_trị, ...]
-- Truy vấn
    SELECT danh_sách_trường FROM tên_bảng[ các_mệnh_đề_khác]
        -- Có thể lấy nhiều trường từ nhiều bảng
        -- Các mệnh đề khác có thể không sử dụng
        -- Danh sách trường có thể thay bằng *, biểu thị tất cả các trường
-- Xóa
    DELETE FROM tên_bảng[ mệnh_đề_điều_kiện_xóa]
        Không có mệnh đề điều kiện thì sẽ xóa toàn bộ
-- Sửa
    UPDATE tên_bảng SET tên_trường=giá_trị_mới[, tên_trường=giá_trị_mới] [điều_kiện_cập_nhật]
```

### Character set và Encoding

```sql
/* Character set và Encoding */ ------------------
-- MySQL, cơ sở dữ liệu, bảng, trường đều có thể thiết lập Encoding
-- Encoding của dữ liệu và Encoding của client không cần giống nhau
SHOW VARIABLES LIKE 'character_set_%'   -- Xem tất cả các mục Encoding của character set
    character_set_client        Encoding được sử dụng khi client gửi dữ liệu đến máy chủ
    character_set_results       Encoding máy chủ sử dụng khi trả kết quả về cho client
    character_set_connection    Encoding của tầng kết nối
SET tên_biến = giá_trị_biến
    SET character_set_client = gbk;
    SET character_set_results = gbk;
    SET character_set_connection = gbk;
SET NAMES GBK;  -- Tương đương với việc hoàn thành ba thiết lập trên
-- Collation
    Collation dùng để sắp xếp
    SHOW CHARACTER SET [LIKE 'pattern']/SHOW CHARSET [LIKE 'pattern']   Xem tất cả các character set
    SHOW COLLATION [LIKE 'pattern']     Xem tất cả các collation
    CHARSET mã_character_set     Thiết lập mã character set
    COLLATE mã_collation     Thiết lập mã collation
```

### Kiểu dữ liệu (kiểu cột)

```sql
/* Kiểu dữ liệu (kiểu cột) */ ------------------
1. Kiểu số
-- a. Kiểu số nguyên ----------
    Kiểu         Byte     Phạm vi (có dấu)
    tinyint     1 byte    -128 ~ 127      Không dấu: 0 ~ 255
    smallint    2 byte    -32768 ~ 32767
    mediumint   3 byte    -8388608 ~ 8388607
    int         4 byte
    bigint      8 byte
    int(M)  M biểu thị tổng số chữ số
    - Mặc định tồn tại bit dấu, sửa bằng thuộc tính unsigned
    - Độ rộng hiển thị, nếu một số không đủ số chữ số đã thiết lập khi định nghĩa trường thì được đệm thêm 0 ở phía trước, sửa bằng thuộc tính zerofill
        Ví dụ: int(5)   chèn một số '123', sau khi đệm sẽ là '00123'
    - Trong trường hợp đáp ứng yêu cầu, càng nhỏ càng tốt.
    - 1 biểu thị giá trị bool đúng, 0 biểu thị giá trị bool sai. MySQL không có kiểu boolean, biểu thị thông qua số nguyên 0 và 1. Thường dùng tinyint(1) để biểu thị kiểu boolean.
-- b. Kiểu số thực ----------
    Kiểu             Byte     Phạm vi
    float(số chính xác đơn)     4 byte
    double(số chính xác kép)    8 byte
    Kiểu số thực vừa hỗ trợ thuộc tính bit dấu unsigned, vừa hỗ trợ thuộc tính độ rộng hiển thị zerofill.
        Khác với kiểu số nguyên, cả trước và sau đều được đệm 0.
    Khi định nghĩa kiểu số thực, cần chỉ định tổng số chữ số và số chữ số thập phân.
        float(M, D)     double(M, D)
        M biểu thị tổng số chữ số, D biểu thị số chữ số thập phân.
        Độ lớn của M và D quyết định phạm vi của số thực. Khác với phạm vi cố định của kiểu số nguyên.
        M vừa biểu thị tổng số chữ số (không bao gồm dấu thập phân và dấu âm dương), vừa biểu thị độ rộng hiển thị (bao gồm tất cả các ký hiệu hiển thị).
        Hỗ trợ biểu diễn bằng ký pháp khoa học.
        Số thực biểu thị giá trị gần đúng.
-- c. Số thập phân chính xác ----------
    decimal -- độ dài thay đổi
    decimal(M, D)   M cũng biểu thị tổng số chữ số, D biểu thị số chữ số thập phân.
    Lưu một giá trị chính xác, không xảy ra thay đổi dữ liệu, khác với việc làm tròn của số thực.
    Chuyển số thực thành chuỗi để lưu trữ, cứ 9 chữ số được lưu thành 4 byte.
2. Kiểu chuỗi
-- a. char, varchar ----------
    char    chuỗi có độ dài cố định, tốc độ nhanh nhưng tốn không gian
    varchar chuỗi có độ dài thay đổi, tốc độ chậm hơn nhưng tiết kiệm không gian
    M biểu thị độ dài tối đa có thể lưu trữ, độ dài này là số ký tự, không phải số byte.
    Encoding khác nhau chiếm không gian khác nhau.
    char, tối đa 255 ký tự, không liên quan đến Encoding.
    varchar, tối đa 65535 ký tự, liên quan đến Encoding.
    Một bản ghi hợp lệ tối đa không được vượt quá 65535 byte.
        utf8 tối đa là 21844 ký tự, gbk tối đa là 32766 ký tự, latin1 tối đa là 65532 ký tự
    varchar có độ dài thay đổi, cần dùng không gian lưu trữ để lưu độ dài của varchar; nếu dữ liệu nhỏ hơn 255 byte thì dùng một byte để lưu độ dài, ngược lại cần hai byte để lưu.
    Độ dài hợp lệ tối đa của varchar được xác định bởi kích thước dòng tối đa và character set được sử dụng.
    Độ dài hợp lệ tối đa là 65532 byte, vì khi varchar lưu chuỗi, byte đầu tiên trống, không tồn tại dữ liệu nào, sau đó còn cần hai byte để lưu độ dài chuỗi, nên độ dài hợp lệ là 65535-1-2=65532 byte.
    Ví dụ: Nếu một bảng được định nghĩa là CREATE TABLE tb(c1 int, c2 char(30), c3 varchar(N)) charset=utf8; Hỏi giá trị tối đa của N là bao nhiêu? Đáp án: (65535-1-2-4-30*3)/3
-- b. blob, text ----------
    blob chuỗi nhị phân (chuỗi byte)
        tinyblob, blob, mediumblob, longblob
    text chuỗi phi nhị phân (chuỗi ký tự)
        tinytext, text, mediumtext, longtext
    text khi định nghĩa không cần định nghĩa độ dài, cũng không tính tổng độ dài.
    Kiểu text khi định nghĩa không được đặt giá trị default
-- c. binary, varbinary ----------
    Tương tự char và varchar, dùng để lưu chuỗi nhị phân, tức là lưu chuỗi byte chứ không phải chuỗi ký tự.
    char, varchar, text tương ứng với binary, varbinary, blob.
3. Kiểu ngày giờ
    Thông thường dùng kiểu số nguyên để lưu timestamp, vì PHP có thể định dạng timestamp rất dễ dàng.
    datetime    8 byte    Ngày và giờ     1000-01-01 00:00:00 đến 9999-12-31 23:59:59
    date        3 byte    Ngày         1000-01-01 đến 9999-12-31
    timestamp   4 byte    Timestamp        19700101000000 đến 2038-01-19 03:14:07
    time        3 byte    Giờ         -838:59:59 đến 838:59:59
    year        1 byte    Năm         1901 - 2155
datetime    YYYY-MM-DD hh:mm:ss
timestamp   YY-MM-DD hh:mm:ss
            YYYYMMDDhhmmss
            YYMMDDhhmmss
            YYYYMMDDhhmmss
            YYMMDDhhmmss
date        YYYY-MM-DD
            YY-MM-DD
            YYYYMMDD
            YYMMDD
            YYYYMMDD
            YYMMDD
time        hh:mm:ss
            hhmmss
            hhmmss
year        YYYY
            YY
            YYYY
            YY
4. Kiểu enum và set
-- enum ----------
enum(val1, val2, val3...)
    Chọn một giá trị duy nhất trong các giá trị đã biết. Số lượng tối đa là 65535.
    Giá trị enum khi lưu trữ được lưu dưới dạng số nguyên 2 byte (smallint). Mỗi giá trị enum, theo thứ tự vị trí lưu trữ, tăng dần từng giá trị bắt đầu từ 1.
    Biểu hiện là kiểu chuỗi nhưng lưu trữ lại là kiểu số nguyên.
    Index của giá trị NULL là NULL.
    Giá trị index của giá trị chuỗi rỗng lỗi là 0.
-- set ----------
set(val1, val2, val3...)
    create table tab ( gender set('男', '女', '无') );
    insert into tab values ('男, 女');
    Tối đa có thể có 64 thành viên khác nhau. Lưu trữ bằng bigint, tổng cộng 8 byte. Sử dụng dạng phép toán bit.
    Khi tạo bảng, khoảng trắng ở cuối giá trị thành viên SET sẽ tự động bị xóa.
```

### Thuộc tính cột (ràng buộc cột)

```sql
/* Thuộc tính cột (ràng buộc cột) */ ------------------
1. PRIMARY Primary Key
    - Trường có thể định danh duy nhất bản ghi có thể làm Primary Key.
    - Một bảng chỉ có thể có một Primary Key.
    - Primary Key có tính duy nhất.
    - Khi khai báo trường, dùng primary key để đánh dấu.
        Cũng có thể khai báo sau danh sách trường
            Ví dụ: create table tab ( id int, stu varchar(10), primary key (id));
    - Giá trị của trường Primary Key không thể là null.
    - Primary Key có thể được tạo thành từ nhiều trường. Khi đó cần khai báo theo cách đặt sau danh sách trường.
        Ví dụ: create table tab ( id int, stu varchar(10), age int, primary key (stu, age));
2. UNIQUE Unique Index (ràng buộc duy nhất)
    Làm cho giá trị của một trường nào đó cũng không được trùng lặp.
3. Ràng buộc NULL
    null không phải kiểu dữ liệu, mà là một thuộc tính của cột.
    Biểu thị cột hiện tại có thể là null hay không, biểu thị không có gì cả.
    null, cho phép để trống. Mặc định.
    not null, không cho phép để trống.
    insert into tab values (null, 'val');
        -- Lúc này biểu thị đặt giá trị của trường đầu tiên thành null, tùy thuộc vào việc trường đó có cho phép null hay không
4. Thuộc tính DEFAULT giá trị mặc định
    Giá trị mặc định của trường hiện tại.
    insert into tab values (default, 'val');    -- Lúc này biểu thị bắt buộc sử dụng giá trị mặc định.
    create table tab ( add_time timestamp default current_timestamp );
        -- Biểu thị đặt timestamp của thời gian hiện tại làm giá trị mặc định.
        current_date, current_time
5. Ràng buộc AUTO_INCREMENT tự động tăng
    Tự động tăng bắt buộc phải là Index (Primary Key hoặc unique)
    Chỉ có thể có một trường tự động tăng.
    Mặc định bắt đầu tự động tăng từ 1. Có thể thiết lập thông qua thuộc tính bảng auto_increment = x, hoặc alter table tbl auto_increment = x;
6. COMMENT chú thích
    Ví dụ: create table tab ( id int ) comment 'nội dung chú thích';
7. Ràng buộc FOREIGN KEY
    Dùng để đảm bảo tính toàn vẹn dữ liệu giữa bảng chính và bảng phụ.
    alter table t1 add constraint `t1_t2_fk` foreign key (t1_id) references t2(id);
        -- Liên kết Foreign Key t1_id của bảng t1 với trường id của bảng t2.
        -- Mỗi Foreign Key đều có một tên, có thể chỉ định thông qua constraint
    Bảng có chứa Foreign Key được gọi là bảng phụ (bảng con), bảng mà Foreign Key trỏ đến được gọi là bảng chính (bảng cha).
    Tác dụng: duy trì tính nhất quán, toàn vẹn của dữ liệu, mục đích chính là kiểm soát dữ liệu được lưu trong bảng Foreign Key (bảng phụ).
    Trong MySQL, có thể sử dụng ràng buộc Foreign Key với engine InnoDB:
    Cú pháp:
    foreign key (trường_foreign_key) references tên_bảng_chính (trường_liên_kết) [hành_động_khi_bản_ghi_bảng_chính_bị_xóa] [hành_động_khi_bản_ghi_bảng_chính_được_cập_nhật]
    Lúc này cần kiểm tra Foreign Key của bảng phụ cần ràng buộc thành giá trị đã tồn tại của bảng chính. Foreign Key trong trường hợp không có liên kết có thể được đặt thành null, với điều kiện cột Foreign Key đó không có not null.
    Có thể không chỉ định hành động khi bản ghi bảng chính bị thay đổi hoặc cập nhật, khi đó thao tác với bảng chính sẽ bị từ chối.
    Nếu chỉ định on update hoặc on delete: khi xóa hoặc cập nhật, có một số thao tác sau để lựa chọn:
    1. cascade, thao tác cascade. Dữ liệu bảng chính được cập nhật (giá trị Primary Key được cập nhật), bảng phụ cũng được cập nhật (giá trị Foreign Key được cập nhật). Bản ghi bảng chính bị xóa, bản ghi liên quan của bảng phụ cũng bị xóa.
    2. set null, đặt thành null. Dữ liệu bảng chính được cập nhật (giá trị Primary Key được cập nhật), Foreign Key của bảng phụ được đặt thành null. Bản ghi bảng chính bị xóa, Foreign Key của bản ghi liên quan trong bảng phụ được đặt thành null. Nhưng chú ý, yêu cầu cột Foreign Key đó không có ràng buộc thuộc tính not null.
    3. restrict, từ chối việc xóa và cập nhật bảng cha.
    Chú ý, Foreign Key chỉ được storage engine InnoDB hỗ trợ. Các engine khác không hỗ trợ.

```

### Quy chuẩn tạo bảng

```sql
/* Quy chuẩn tạo bảng */ ------------------
    -- Normal Format, NF
        - Mỗi bảng lưu thông tin của một thực thể
        - Mỗi bảng có một trường ID làm Primary Key
        - Primary Key ID + bảng nguyên tử
    -- 1NF, Dạng chuẩn 1 (First Normal Form)
        Trường không thể phân chia thêm thì thỏa mãn dạng chuẩn 1.
    -- 2NF, Dạng chuẩn 2 (Second Normal Form)
        Trên cơ sở thỏa mãn dạng chuẩn 1, không được xuất hiện phụ thuộc bộ phận.
        Loại bỏ Primary Key phức hợp là có thể tránh được phụ thuộc bộ phận. Tăng khóa đơn cột.
    -- 3NF, Dạng chuẩn 3 (Third Normal Form)
        Trên cơ sở thỏa mãn dạng chuẩn 2, không được xuất hiện phụ thuộc bắc cầu.
        Một trường nào đó phụ thuộc vào Primary Key, và có trường khác phụ thuộc vào trường đó. Đây chính là phụ thuộc bắc cầu.
        Đặt dữ liệu thông tin của một thực thể vào trong một bảng để thực hiện.
```

### SELECT

```sql
/* SELECT */ ------------------
SELECT [ALL|DISTINCT] select_expr FROM -> WHERE -> GROUP BY [hàm tổng hợp] -> HAVING -> ORDER BY -> LIMIT
a. select_expr
    -- Có thể dùng * để biểu thị tất cả các trường.
        select * from tb;
    -- Có thể sử dụng biểu thức (công thức tính, gọi hàm, trường cũng là một biểu thức)
        select stu, 29+25, now() from tb;
    -- Có thể dùng bí danh cho mỗi cột. Phù hợp để đơn giản hóa định danh cột, tránh nhiều định danh cột trùng lặp.
        - Dùng từ khóa as, cũng có thể bỏ qua as.
        select stu+10 as add10 from tb;
b. Mệnh đề FROM
    Dùng để xác định nguồn truy vấn.
    -- Có thể đặt bí danh cho bảng. Sử dụng từ khóa as.
        SELECT * FROM tb1 AS tt, tb2 AS bb;
    -- Sau mệnh đề from, có thể xuất hiện đồng thời nhiều bảng.
        -- Nhiều bảng sẽ được ghép ngang với nhau, và dữ liệu sẽ tạo thành tích Descartes.
        SELECT * FROM tb1, tb2;
    -- Gợi ý cho optimizer cách chọn Index
        USE INDEX, IGNORE INDEX, FORCE INDEX
        SELECT * FROM table1 USE INDEX (key1,key2) WHERE key1=1 AND key2=2 AND key3=3;
        SELECT * FROM table1 IGNORE INDEX (key3) WHERE key1=1 AND key2=2 AND key3=3;
c. Mệnh đề WHERE
    -- Lọc từ nguồn dữ liệu nhận được từ from.
    -- Số nguyên 1 biểu thị đúng, 0 biểu thị sai.
    -- Biểu thức được tạo thành từ toán tử và toán hạng.
        -- Toán hạng: biến (trường), giá trị, giá trị trả về của hàm
        -- Toán tử:
            =, <=>, <>, !=, <=, <, >=, >, !, &&, ||,
            in (not) null, (not) like, (not) in, (not) between and, is (not), and, or, not, xor
            is/is not thêm true/false/unknown, kiểm tra giá trị đúng hay sai
            <=> có chức năng giống <>, <=> có thể dùng để so sánh với null
d. Mệnh đề GROUP BY, mệnh đề nhóm
    GROUP BY trường/bí_danh [cách_sắp_xếp]
    Sau khi nhóm sẽ tiến hành sắp xếp. Tăng dần: ASC, giảm dần: DESC
    Các [hàm tổng hợp] sau đây cần dùng kết hợp với GROUP BY:
    count trả về số lượng các giá trị không NULL khác nhau  count(*), count(trường)
    sum tính tổng
    max tìm giá trị lớn nhất
    min tìm giá trị nhỏ nhất
    avg tính giá trị trung bình
    group_concat trả về kết quả chuỗi gồm các giá trị không NULL được nối từ một nhóm. Nối chuỗi trong nhóm.
e. Mệnh đề HAVING, mệnh đề điều kiện
    Chức năng, cách dùng giống where, thời điểm thực thi khác nhau.
    where kiểm tra dữ liệu lúc bắt đầu, lọc trên dữ liệu gốc.
    having lọc một lần nữa trên kết quả đã được lọc.
    Trường của having phải là trường được truy vấn ra, trường của where phải tồn tại trong bảng dữ liệu.
    where không thể sử dụng bí danh của trường, having có thể. Vì khi thực thi mã WHERE, giá trị cột có thể chưa được xác định.
    where không thể sử dụng hàm tổng hợp. Thông thường cần dùng hàm tổng hợp thì mới dùng having
    Chuẩn SQL yêu cầu HAVING phải tham chiếu đến cột trong mệnh đề GROUP BY hoặc cột được dùng trong hàm tổng hợp.
f. Mệnh đề ORDER BY, mệnh đề sắp xếp
    order by trường_sắp_xếp/bí_danh cách_sắp_xếp [,trường_sắp_xếp/bí_danh cách_sắp_xếp]...
    Tăng dần: ASC, giảm dần: DESC
    Hỗ trợ sắp xếp theo nhiều trường.
g. Mệnh đề LIMIT, mệnh đề giới hạn số lượng kết quả
    Chỉ giới hạn số lượng trên kết quả đã xử lý. Coi kết quả đã xử lý là một tập hợp, index bắt đầu từ 0 theo thứ tự xuất hiện của bản ghi.
    limit vị_trí_bắt_đầu, số_dòng_lấy
    Bỏ qua tham số đầu tiên, biểu thị bắt đầu từ index 0. limit số_dòng_lấy
h. Tùy chọn DISTINCT, ALL
    distinct loại bỏ bản ghi trùng lặp
    Mặc định là all, tất cả bản ghi
```

### UNION

```sql
/* UNION */ ------------------
      Kết hợp kết quả của nhiều truy vấn select thành một tập kết quả.
      SELECT ... UNION [ALL|DISTINCT] SELECT ...
      Mặc định theo cách DISTINCT, tức là tất cả các dòng trả về đều là duy nhất
      Nên dùng dấu ngoặc đơn bao quanh mỗi truy vấn SELECT.
      Khi sắp xếp bằng ORDER BY, cần thêm LIMIT để kết hợp.
      Yêu cầu số lượng trường của các truy vấn select phải giống nhau.
      Danh sách trường (số lượng, kiểu) của mỗi truy vấn select nên giống nhau, vì tên trường trong kết quả lấy theo câu lệnh select đầu tiên.
```

### Truy vấn con (Subquery)

```sql
/* Truy vấn con (Subquery) */ ------------------
    - Truy vấn con cần được bao bọc bằng dấu ngoặc đơn.
-- Dạng from
    Sau from yêu cầu là một bảng, phải đặt bí danh cho kết quả truy vấn con.
    - Đơn giản hóa điều kiện trong mỗi truy vấn.
    - Dạng from cần tạo kết quả thành một bảng tạm, có thể dùng để giải phóng Lock của bảng gốc.
    - Truy vấn con trả về một bảng, truy vấn con dạng bảng.
    select * from (select * from tb where id>0) as subfrom where id>1;
-- Dạng where
    - Truy vấn con trả về một giá trị, truy vấn con vô hướng.
    - Không cần đặt bí danh cho truy vấn con.
    - Bảng trong truy vấn con của where không thể dùng trực tiếp để cập nhật.
    select * from tb where money = (select max(money) from tb);
    -- Truy vấn con cột
        Nếu kết quả truy vấn con trả về là một cột.
        Sử dụng in hoặc not in để hoàn thành truy vấn
        Điều kiện exists và not exists
            Nếu truy vấn con trả về dữ liệu thì trả về 1 hoặc 0. Thường dùng để phán đoán điều kiện.
            select column1 from t1 where exists (select * from t2);
    -- Truy vấn con hàng
        Điều kiện truy vấn là một hàng.
        select * from t1 where (id, gender) in (select id, gender from t2);
        Row constructor: (col1, col2, ...) hoặc ROW(col1, col2, ...)
        Row constructor thường dùng để so sánh với truy vấn con có thể trả về hai cột trở lên.
    -- Toán tử đặc biệt
    != all()    tương đương not in
    = some()    tương đương in. any là bí danh của some
    != some()   không tương đương not in, không bằng một giá trị nào đó trong số đó.
    all, some có thể dùng kết hợp với các toán tử khác.
```

### Truy vấn kết hợp (join)

```sql
/* Truy vấn kết hợp (join) */ ------------------
    Kết hợp các trường của nhiều bảng, có thể chỉ định điều kiện kết hợp.
-- Inner join
    - Mặc định chính là inner join, có thể bỏ qua inner.
    - Chỉ khi dữ liệu tồn tại mới có thể thực hiện kết hợp. Tức là kết quả kết hợp không thể xuất hiện dòng trống.
    on biểu thị điều kiện kết hợp. Biểu thức điều kiện của nó tương tự where. Cũng có thể bỏ qua điều kiện (biểu thị điều kiện luôn luôn đúng)
    Cũng có thể dùng where để biểu thị điều kiện kết hợp.
    Còn có using, nhưng cần tên trường giống nhau. using(tên_trường)
    -- Cross join
        Tức là inner join không có điều kiện.
        select * from tb1 cross join tb2;
-- Outer join
    - Nếu dữ liệu không tồn tại, cũng sẽ xuất hiện trong kết quả kết hợp.
    -- Left join
        Nếu dữ liệu không tồn tại, bản ghi của bảng bên trái sẽ xuất hiện, còn bảng bên phải được điền bằng null
    -- Right join
        Nếu dữ liệu không tồn tại, bản ghi của bảng bên phải sẽ xuất hiện, còn bảng bên trái được điền bằng null
-- Natural join
    Tự động phán đoán điều kiện kết hợp để hoàn thành kết hợp.
    Tương đương với việc bỏ qua using, sẽ tự động tìm các tên trường giống nhau.
    natural join
    natural left join
    natural right join
select info.id, info.name, info.stu_num, extra_info.hobby, extra_info.sex from info, extra_info where info.stu_num = extra_info.stu_id;
```

### TRUNCATE

```sql
/* TRUNCATE */ ------------------
TRUNCATE [TABLE] tbl_name
Xóa sạch dữ liệu
Xóa và tạo lại bảng
Khác biệt:
1, truncate là xóa bảng rồi tạo lại, delete là xóa từng dòng
2, truncate đặt lại giá trị auto_increment. Còn delete thì không
3, truncate không biết đã xóa bao nhiêu dòng, còn delete thì biết.
4, Khi được dùng với bảng có phân vùng, truncate sẽ giữ lại các phân vùng
```

### Sao lưu và khôi phục

```sql
/* Sao lưu và khôi phục */ ------------------
Sao lưu là lưu lại cấu trúc của dữ liệu và dữ liệu trong bảng.
Sử dụng lệnh mysqldump để hoàn thành.
-- Xuất ra
mysqldump [options] db_name [tables]
mysqldump [options] ---database DB1 [DB2 DB3...]
mysqldump [options] --all--database
1. Xuất một bảng
　　mysqldump -utên_người_dùng -pmật_khẩu tên_cơ_sở_dữ_liệu tên_bảng > tên_file(D:/a.sql)
2. Xuất nhiều bảng
　　mysqldump -utên_người_dùng -pmật_khẩu tên_cơ_sở_dữ_liệu bảng1 bảng2 bảng3 > tên_file(D:/a.sql)
3. Xuất tất cả các bảng
　　mysqldump -utên_người_dùng -pmật_khẩu tên_cơ_sở_dữ_liệu > tên_file(D:/a.sql)
4. Xuất một cơ sở dữ liệu
　　mysqldump -utên_người_dùng -pmật_khẩu --lock-all-tables --database tên_cơ_sở_dữ_liệu > tên_file(D:/a.sql)
Có thể mang theo điều kiện WHERE với -w
-- Nhập vào
1. Trong trường hợp đã đăng nhập mysql:
　　source  file_sao_lưu
2. Trong trường hợp không đăng nhập
　　mysql -utên_người_dùng -pmật_khẩu tên_cơ_sở_dữ_liệu < file_sao_lưu
```

### View

```sql
View là gì:
    View là một bảng ảo, nội dung của nó được định nghĩa bởi một truy vấn. Giống như bảng thật, View bao gồm một loạt các cột và dữ liệu dòng có tên. Tuy nhiên, View không tồn tại trong cơ sở dữ liệu dưới dạng tập hợp giá trị dữ liệu được lưu trữ. Dữ liệu dòng và cột đến từ các bảng được tham chiếu bởi truy vấn định nghĩa View, và được tạo ra động khi tham chiếu View.
    View có file cấu trúc bảng, nhưng không tồn tại file dữ liệu.
    Đối với các bảng cơ sở được tham chiếu trong đó, tác dụng của View tương tự như một bộ lọc. Bộ lọc định nghĩa View có thể đến từ một hoặc nhiều bảng trong cơ sở dữ liệu hiện tại hoặc cơ sở dữ liệu khác, hoặc từ các View khác. Truy vấn thông qua View không có bất kỳ hạn chế nào, việc sửa đổi dữ liệu thông qua chúng cũng rất ít hạn chế.
    View là câu lệnh sql của truy vấn được lưu trong cơ sở dữ liệu, nó chủ yếu vì hai lý do: lý do an toàn, View có thể ẩn một số dữ liệu, ví dụ: bảng quỹ bảo hiểm xã hội, có thể dùng View chỉ hiển thị họ tên, địa chỉ, mà không hiển thị số bảo hiểm xã hội và mức lương..., lý do khác là làm cho các truy vấn phức tạp dễ hiểu và dễ sử dụng hơn.
-- Tạo View
CREATE [OR REPLACE] [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}] VIEW view_name [(column_list)] AS select_statement
    - Tên View phải là duy nhất, đồng thời không được trùng tên với bảng.
    - View có thể sử dụng tên cột mà câu lệnh select truy vấn được, cũng có thể tự chỉ định tên cột tương ứng.
    - Có thể chỉ định thuật toán thực thi của View, thông qua ALGORITHM.
    - column_list nếu tồn tại thì số lượng phải bằng số cột mà câu lệnh SELECT truy vấn
-- Xem cấu trúc
    SHOW CREATE VIEW view_name
-- Xóa View
    - Sau khi xóa View, dữ liệu vẫn tồn tại.
    - Có thể xóa đồng thời nhiều View.
    DROP VIEW [IF EXISTS] view_name ...
-- Sửa cấu trúc View
    - Thông thường không sửa View, vì không phải mọi cập nhật View đều được ánh xạ lên bảng.
    ALTER VIEW view_name [(column_list)] AS select_statement
-- Tác dụng của View
    1. Đơn giản hóa logic nghiệp vụ
    2. Ẩn cấu trúc bảng thật đối với client
-- Thuật toán của View (ALGORITHM)
    MERGE       Hợp nhất
        Hợp nhất câu lệnh truy vấn của View với truy vấn bên ngoài trước rồi mới thực thi!
    TEMPTABLE   Bảng tạm
        Sau khi thực thi View xong, tạo thành bảng tạm, rồi mới thực hiện truy vấn lớp ngoài!
    UNDEFINED   Chưa định nghĩa (mặc định), nghĩa là MySQL tự chủ lựa chọn thuật toán tương ứng.
```

### Transaction

```sql
Transaction là một nhóm các thao tác về mặt logic, các đơn vị cấu thành nhóm thao tác này hoặc là tất cả thành công hoặc là tất cả thất bại.
    - Hỗ trợ thành công tập thể hoặc hủy bỏ tập thể của các SQL liên tiếp.
    - Transaction là một chức năng của cơ sở dữ liệu về mặt toàn vẹn dữ liệu.
    - Cần tận dụng storage engine InnoDB hoặc BDB, hoàn thành việc hỗ trợ đặc tính tự động commit.
    - InnoDB được gọi là engine an toàn cho Transaction.
-- Mở Transaction
    START TRANSACTION; hoặc BEGIN;
    Sau khi mở Transaction, tất cả các câu lệnh SQL được thực thi đều được coi là câu lệnh SQL trong Transaction hiện tại.
-- Commit Transaction
    COMMIT;
-- Rollback Transaction
    ROLLBACK;
    Nếu một phần thao tác xảy ra vấn đề, quay về trạng thái trước khi mở Transaction.
-- Đặc tính của Transaction
    1. Tính nguyên tử (Atomicity)
        Transaction là một đơn vị công việc không thể phân chia, các thao tác trong Transaction hoặc là đều xảy ra, hoặc là đều không xảy ra.
    2. Tính nhất quán (Consistency)
        Tính toàn vẹn của dữ liệu trước và sau Transaction phải được giữ nhất quán.
        - Khi Transaction bắt đầu và kết thúc, dữ liệu bên ngoài phải nhất quán
        - Trong suốt quá trình Transaction, các thao tác là liên tục
    3. Tính cô lập (Isolation)
        Khi nhiều người dùng truy cập cơ sở dữ liệu đồng thời, Transaction của một người dùng không được bị Transaction của người dùng khác can thiệp, dữ liệu giữa nhiều Transaction đồng thời phải được cô lập với nhau.
    4. Tính bền vững (Durability)
        Một Transaction một khi đã được commit thì thay đổi của nó đối với dữ liệu trong cơ sở dữ liệu là vĩnh viễn.
-- Triển khai Transaction
    1. Yêu cầu là kiểu bảng có hỗ trợ Transaction
    2. Mở Transaction trước khi thực thi một nhóm các thao tác liên quan
    3. Sau khi hoàn thành cả nhóm thao tác, nếu đều thành công thì commit; nếu tồn tại thất bại thì chọn rollback, sẽ quay về điểm sao lưu lúc bắt đầu Transaction.
-- Nguyên lý của Transaction
    Tận dụng đặc tính tự động commit (autocommit) của InnoDB để hoàn thành.
    Sau khi thực thi câu lệnh MySQL thông thường, thao tác commit dữ liệu hiện tại đều có thể được nhìn thấy bởi các client khác.
    Còn Transaction là tạm thời tắt cơ chế "tự động commit", cần commit để thao tác dữ liệu được bền vững hóa.
-- Chú ý
    1. Câu lệnh ngôn ngữ định nghĩa dữ liệu (DDL) không thể được rollback, ví dụ như câu lệnh tạo hoặc hủy cơ sở dữ liệu, và câu lệnh tạo, hủy hoặc thay đổi bảng hoặc stored procedure.
    2. Transaction không thể lồng nhau
-- Savepoint
    SAVEPOINT tên_savepoint -- Đặt một savepoint của Transaction
    ROLLBACK TO SAVEPOINT tên_savepoint -- Rollback đến savepoint
    RELEASE SAVEPOINT tên_savepoint -- Xóa savepoint
-- Thiết lập đặc tính tự động commit của InnoDB
    SET autocommit = 0|1;   0 biểu thị tắt tự động commit, 1 biểu thị bật tự động commit.
    - Nếu tắt, thì kết quả của thao tác thông thường cũng không hiển thị với các client khác, cần commit thì thao tác dữ liệu mới được bền vững hóa.
    - Cũng có thể tắt tự động commit để mở Transaction. Nhưng khác với START TRANSACTION,
        SET autocommit thay đổi vĩnh viễn thiết lập của server, cho đến khi thiết lập đó được sửa lại lần nữa. (Áp dụng cho kết nối hiện tại)
        Còn START TRANSACTION ghi lại trạng thái trước khi mở, và một khi Transaction đã commit hoặc rollback thì cần mở lại Transaction. (Áp dụng cho Transaction hiện tại)

```

### Lock bảng

```sql
/* Lock bảng */
Lock bảng chỉ dùng để ngăn các client khác đọc và ghi không đúng cách
MyISAM hỗ trợ table lock, InnoDB hỗ trợ row lock
-- Lock
    LOCK TABLES tbl_name [AS alias]
-- Unlock
    UNLOCK TABLES
```

### Trigger

```sql
/* Trigger */ ------------------
    Trigger là đối tượng cơ sở dữ liệu có tên liên kết với một bảng, khi bảng đó xuất hiện sự kiện cụ thể, đối tượng này sẽ được kích hoạt
    Lắng nghe: việc thêm, sửa, xóa bản ghi.
-- Tạo Trigger
CREATE TRIGGER trigger_name trigger_time trigger_event ON tbl_name FOR EACH ROW trigger_stmt
    Tham số:
    trigger_time là thời điểm hành động của Trigger. Nó có thể là before hoặc after, để chỉ ra Trigger được kích hoạt trước hoặc sau câu lệnh kích hoạt nó.
    trigger_event chỉ ra kiểu câu lệnh kích hoạt Trigger
        INSERT: kích hoạt Trigger khi chèn dòng mới vào bảng
        UPDATE: kích hoạt Trigger khi thay đổi một dòng nào đó
        DELETE: kích hoạt Trigger khi xóa một dòng nào đó khỏi bảng
    tbl_name: bảng được lắng nghe, phải là bảng vĩnh viễn, không thể liên kết Trigger với bảng TEMPORARY hoặc View.
    trigger_stmt: câu lệnh được thực thi khi Trigger được kích hoạt. Để thực thi nhiều câu lệnh, có thể sử dụng cấu trúc câu lệnh phức hợp BEGIN...END
-- Xóa
DROP TRIGGER [schema_name.]trigger_name
Có thể sử dụng old và new thay cho dữ liệu cũ và mới
    Thao tác cập nhật, trước khi cập nhật là old, sau khi cập nhật là new.
    Thao tác xóa, chỉ có old.
    Thao tác thêm, chỉ có new.
-- Chú ý
    1. Đối với một bảng nhất định có cùng thời điểm hành động và sự kiện của Trigger, không thể có hai Trigger.
-- Hàm nối chuỗi
concat(str1,str2,...])
concat_ws(separator,str1,str2,...)
-- Câu lệnh rẽ nhánh
if điều_kiện then
    câu_lệnh_thực_thi
elseif điều_kiện then
    câu_lệnh_thực_thi
else
    câu_lệnh_thực_thi
end if;
-- Sửa ký tự kết thúc của câu lệnh lớp ngoài cùng
delimiter ký_tự_kết_thúc_tùy_chỉnh
    câu_lệnh_SQL
ký_tự_kết_thúc_tùy_chỉnh
delimiter ;     -- Sửa lại thành dấu chấm phẩy ban đầu
-- Bao bọc khối câu lệnh
begin
    khối_câu_lệnh
end
-- Thực thi đặc biệt
1. Chỉ cần thêm bản ghi, Trigger sẽ được kích hoạt.
2. Cú pháp Insert into on duplicate key update sẽ kích hoạt:
    Nếu không có bản ghi trùng lặp, sẽ kích hoạt before insert, after insert;
    Nếu có bản ghi trùng lặp và được cập nhật, sẽ kích hoạt before insert, before update, after update;
    Nếu có bản ghi trùng lặp nhưng không xảy ra cập nhật, thì kích hoạt before insert, before update
3. Cú pháp Replace nếu có bản ghi, thì thực thi before insert, before delete, after delete, after insert
```

### Lập trình SQL

```sql
/* Lập trình SQL */ ------------------
--// Biến cục bộ ----------
-- Khai báo biến
    declare var_name[,...] type [default value]
    Câu lệnh này được dùng để khai báo biến cục bộ. Để cung cấp giá trị mặc định cho biến, hãy bao gồm một mệnh đề default. Giá trị có thể được chỉ định là một biểu thức, không cần phải là một hằng số. Nếu không có mệnh đề default, giá trị ban đầu là null.
-- Gán giá trị
    Sử dụng câu lệnh set và select into để gán giá trị cho biến.
    - Chú ý: bên trong hàm có thể sử dụng biến toàn cục (biến do người dùng tự định nghĩa)
--// Biến toàn cục ----------
-- Định nghĩa, gán giá trị
Câu lệnh set có thể định nghĩa và gán giá trị cho biến.
set @var = value;
Cũng có thể sử dụng câu lệnh select into để khởi tạo và gán giá trị cho biến. Cách này yêu cầu câu lệnh select chỉ có thể trả về một dòng, nhưng có thể là nhiều trường, điều đó có nghĩa là đồng thời gán giá trị cho nhiều biến, số lượng biến cần khớp với số cột của truy vấn.
Cũng có thể coi câu lệnh gán giá trị như một biểu thức, hoàn thành thông qua thực thi select. Lúc này để tránh việc = bị coi là toán tử quan hệ, sử dụng := thay thế. (Câu lệnh set có thể sử dụng = và :=).
select @var:=20;
select @v1:=id, @v2=name from t1 limit 1;
select * from tbl_name where @var:=30;
select into có thể gán dữ liệu truy vấn được từ bảng cho biến.
    -| select max(height) into @max_height from tb;
-- Tên biến tự định nghĩa
Để tránh xung đột giữa biến do người dùng tự định nghĩa với định danh hệ thống (thường là tên trường) trong câu lệnh select, biến do người dùng tự định nghĩa sử dụng @ làm ký hiệu bắt đầu trước tên biến.
@var=10;
    - Sau khi biến được định nghĩa, nó có hiệu lực trong toàn bộ chu kỳ phiên làm việc (từ lúc đăng nhập đến khi thoát)
--// Cấu trúc điều khiển ----------
-- Câu lệnh if
if search_condition then
    statement_list
[elseif search_condition then
    statement_list]
...
[else
    statement_list]
end if;
-- Câu lệnh case
CASE value WHEN [compare-value] THEN result
[WHEN [compare-value] THEN result ...]
[ELSE result]
END
-- Vòng lặp while
[begin_label:] while search_condition do
    statement_list
end while [end_label];
- Nếu cần thoát khỏi vòng lặp while sớm bên trong vòng lặp, thì cần sử dụng nhãn; nhãn cần xuất hiện theo cặp.
    -- Thoát vòng lặp
        Thoát toàn bộ vòng lặp leave
        Thoát vòng lặp hiện tại iterate
        Thông qua nhãn thoát để quyết định thoát vòng lặp nào
--// Hàm dựng sẵn ----------
-- Hàm số học
abs(x)          -- Giá trị tuyệt đối abs(-10.9) = 10
format(x, d)    -- Định dạng số theo hàng nghìn format(1234567.456, 2) = 1,234,567.46
ceil(x)         -- Làm tròn lên ceil(10.1) = 11
floor(x)        -- Làm tròn xuống floor (10.1) = 10
round(x)        -- Làm tròn lấy số nguyên
mod(m, n)       -- m%n m mod n lấy phần dư 10%3=1
pi()            -- Lấy số pi
pow(m, n)       -- m^n
sqrt(x)         -- Căn bậc hai số học
rand()          -- Số ngẫu nhiên
truncate(x, d)  -- Cắt lấy d chữ số thập phân
-- Hàm thời gian ngày tháng
now(), current_timestamp();     -- Ngày giờ hiện tại
current_date();                 -- Ngày hiện tại
current_time();                 -- Giờ hiện tại
date('yyyy-mm-dd hh:ii:ss');    -- Lấy phần ngày
time('yyyy-mm-dd hh:ii:ss');    -- Lấy phần giờ
date_format('yyyy-mm-dd hh:ii:ss', '%d %y %a %d %m %b %j'); -- Định dạng thời gian
unix_timestamp();               -- Lấy unix timestamp
from_unixtime();                -- Lấy thời gian từ timestamp
-- Hàm chuỗi
length(string)          -- Độ dài của string, byte
char_length(string)     -- Số ký tự của string
substring(str, position [,length])      -- Bắt đầu từ position của str, lấy length ký tự
replace(str ,search_str ,replace_str)   -- Trong str thay thế search_str bằng replace_str
instr(string ,substring)    -- Trả về vị trí xuất hiện đầu tiên của substring trong string
concat(string [,...])   -- Nối chuỗi
charset(str)            -- Trả về character set của chuỗi
lcase(string)           -- Chuyển thành chữ thường
left(string, length)    -- Lấy length ký tự từ bên trái của string
load_file(file_name)    -- Đọc nội dung từ file
locate(substring, string [,start_position]) -- Giống instr, nhưng có thể chỉ định vị trí bắt đầu
lpad(string, length, pad)   -- Lặp lại việc thêm pad vào đầu string, cho đến khi độ dài chuỗi là length
ltrim(string)           -- Xóa khoảng trắng phía trước
repeat(string, count)   -- Lặp lại count lần
rpad(string, length, pad)   -- Thêm pad vào sau str để bổ sung, cho đến khi độ dài là length
rtrim(string)           -- Xóa khoảng trắng phía sau
strcmp(string1 ,string2)    -- So sánh độ lớn của hai chuỗi theo từng ký tự
-- Hàm luồng điều khiển
case when [condition] then result [when [condition] then result ...] [else result] end   nhiều nhánh
if(expr1,expr2,expr3)  hai nhánh.
-- Hàm tổng hợp
count()
sum();
max();
min();
avg();
group_concat()
-- Các hàm thông dụng khác
md5();
default();
--// Stored function, hàm tự định nghĩa ----------
-- Tạo mới
    CREATE FUNCTION function_name (danh_sách_tham_số) RETURNS kiểu_giá_trị_trả_về
        thân_hàm
    - Tên hàm phải là định danh hợp lệ, và không được xung đột với các từ khóa đã có.
    - Một hàm phải thuộc về một cơ sở dữ liệu nào đó, có thể sử dụng dạng db_name.function_name để thực thi hàm thuộc cơ sở dữ liệu được chỉ định, nếu không thì là cơ sở dữ liệu hiện tại.
    - Phần tham số được tạo thành từ "tên tham số" và "kiểu tham số". Nhiều tham số phân tách bằng dấu phẩy.
    - Thân hàm được tạo thành từ nhiều câu lệnh mysql hợp lệ, điều khiển luồng, khai báo biến, v.v.
    - Nhiều câu lệnh nên được bao bọc bằng khối câu lệnh begin...end.
    - Bắt buộc phải có câu lệnh return trả về giá trị.
-- Xóa
    DROP FUNCTION [IF EXISTS] function_name;
-- Xem
    SHOW FUNCTION STATUS LIKE 'partten'
    SHOW CREATE FUNCTION function_name;
-- Sửa
    ALTER FUNCTION function_name tùy_chọn_hàm
--// Stored procedure, chức năng tự định nghĩa ----------
-- Định nghĩa
Stored procedure là một đoạn mã (procedure), được tạo thành từ các sql lưu trong cơ sở dữ liệu.
Một stored procedure thường dùng để hoàn thành một đoạn logic nghiệp vụ, ví dụ như đăng ký, nộp học phí, nhập kho đơn hàng, v.v.
Còn một hàm thường tập trung vào một chức năng nào đó, được xem là phục vụ cho các chương trình khác, cần gọi hàm trong các câu lệnh khác mới được, còn stored procedure không thể được gọi bởi chương trình khác, nó tự thực thi, thực thi thông qua call.
-- Tạo
CREATE PROCEDURE sp_name (danh_sách_tham_số)
    thân_procedure
Danh sách tham số: khác với danh sách tham số của hàm, cần chỉ định kiểu tham số
IN, biểu thị kiểu nhập vào
OUT, biểu thị kiểu xuất ra
INOUT, biểu thị kiểu hỗn hợp
Chú ý, không có giá trị trả về.
```

### Stored Procedure

```sql
/* Stored Procedure */ ------------------
Stored procedure là một tập hợp mã thực thi. So với hàm, nó thiên về logic nghiệp vụ hơn.
Gọi: CALL tên_procedure
-- Chú ý
- Không có giá trị trả về.
- Chỉ có thể gọi riêng lẻ, không thể lồng trong các câu lệnh khác
-- Tham số
IN|OUT|INOUT tên_tham_số kiểu_dữ_liệu
IN      Nhập vào: tham số đưa dữ liệu vào bên trong thân procedure trong quá trình gọi
OUT     Xuất ra: trả kết quả đã xử lý xong của thân procedure về client trong quá trình gọi
INOUT   Nhập xuất: vừa có thể nhập vào, vừa có thể xuất ra
-- Cú pháp
CREATE PROCEDURE tên_procedure (danh_sách_tham_số)
BEGIN
    thân_procedure
END
```

### Quản lý người dùng và quyền hạn

```sql
/* Quản lý người dùng và quyền hạn */ ------------------
-- Đặt lại mật khẩu root
1. Dừng dịch vụ MySQL
2.  [Linux] /usr/local/mysql/bin/safe_mysqld --skip-grant-tables &
    [Windows] mysqld --skip-grant-tables
3. use mysql;
4. UPDATE `user` SET PASSWORD=PASSWORD("mật_khẩu") WHERE `user` = "root";
5. FLUSH PRIVILEGES;
Bảng thông tin người dùng: mysql.user
-- Làm mới quyền hạn
FLUSH PRIVILEGES;
-- Thêm người dùng
CREATE USER tên_người_dùng IDENTIFIED BY [PASSWORD] mật_khẩu(chuỗi)
    - Phải có quyền CREATE USER toàn cục của cơ sở dữ liệu mysql, hoặc có quyền INSERT.
    - Chỉ có thể tạo người dùng, không thể cấp quyền hạn.
    - Tên người dùng, chú ý dấu nháy: ví dụ 'user_name'@'192.168.1.1'
    - Mật khẩu cũng cần dấu nháy, mật khẩu thuần số cũng phải thêm dấu nháy
    - Để chỉ định mật khẩu ở dạng văn bản thuần, cần bỏ qua từ khóa PASSWORD. Để chỉ định mật khẩu là giá trị băm được trả về bởi hàm PASSWORD(), cần bao gồm từ khóa PASSWORD
-- Đổi tên người dùng
RENAME USER old_user TO new_user
-- Đặt mật khẩu
SET PASSWORD = PASSWORD('mật_khẩu')  -- Đặt mật khẩu cho người dùng hiện tại
SET PASSWORD FOR tên_người_dùng = PASSWORD('mật_khẩu') -- Đặt mật khẩu cho người dùng chỉ định
-- Xóa người dùng
DROP USER tên_người_dùng
-- Phân quyền/thêm người dùng
GRANT danh_sách_quyền ON tên_bảng TO tên_người_dùng [IDENTIFIED BY [PASSWORD] 'password']
    - all privileges biểu thị tất cả quyền hạn
    - *.* biểu thị tất cả bảng của tất cả cơ sở dữ liệu
    - tên_cơ_sở_dữ_liệu.tên_bảng biểu thị một bảng nào đó trong một cơ sở dữ liệu nào đó
    GRANT ALL PRIVILEGES ON `pms`.* TO 'pms'@'%' IDENTIFIED BY 'pms0817';
-- Xem quyền hạn
SHOW GRANTS FOR tên_người_dùng
    -- Xem quyền hạn của người dùng hiện tại
    SHOW GRANTS; hoặc SHOW GRANTS FOR CURRENT_USER; hoặc SHOW GRANTS FOR CURRENT_USER();
-- Thu hồi quyền hạn
REVOKE danh_sách_quyền ON tên_bảng FROM tên_người_dùng
REVOKE ALL PRIVILEGES, GRANT OPTION FROM tên_người_dùng   -- Thu hồi tất cả quyền hạn
-- Cấp độ quyền hạn
-- Để sử dụng GRANT hoặc REVOKE, bạn phải có quyền GRANT OPTION, và bạn phải có quyền hạn mà bạn đang cấp hoặc thu hồi.
Cấp độ toàn cục: quyền hạn toàn cục áp dụng cho tất cả cơ sở dữ liệu trong một server nhất định, mysql.user
    GRANT ALL ON *.* và REVOKE ALL ON *.* chỉ cấp và thu hồi quyền hạn toàn cục.
Cấp độ cơ sở dữ liệu: quyền hạn cơ sở dữ liệu áp dụng cho tất cả các đối tượng trong một cơ sở dữ liệu nhất định, mysql.db, mysql.host
    GRANT ALL ON db_name.* và REVOKE ALL ON db_name.* chỉ cấp và thu hồi quyền hạn cơ sở dữ liệu.
Cấp độ bảng: quyền hạn bảng áp dụng cho tất cả các cột trong một bảng nhất định, mysql.talbes_priv
    GRANT ALL ON db_name.tbl_name và REVOKE ALL ON db_name.tbl_name chỉ cấp và thu hồi quyền hạn bảng.
Cấp độ cột: quyền hạn cột áp dụng cho một cột duy nhất trong một bảng nhất định, mysql.columns_priv
    Khi sử dụng REVOKE, bạn phải chỉ định các cột giống với các cột được cấp quyền.
-- Danh sách quyền hạn
ALL [PRIVILEGES]    -- Đặt tất cả quyền hạn đơn giản ngoại trừ GRANT OPTION
ALTER   -- Cho phép sử dụng ALTER TABLE
ALTER ROUTINE   -- Thay đổi hoặc hủy stored procedure đã lưu
CREATE  -- Cho phép sử dụng CREATE TABLE
CREATE ROUTINE  -- Tạo stored procedure đã lưu
CREATE TEMPORARY TABLES     -- Cho phép sử dụng CREATE TEMPORARY TABLE
CREATE USER     -- Cho phép sử dụng CREATE USER, DROP USER, RENAME USER và REVOKE ALL PRIVILEGES.
CREATE VIEW     -- Cho phép sử dụng CREATE VIEW
DELETE  -- Cho phép sử dụng DELETE
DROP    -- Cho phép sử dụng DROP TABLE
EXECUTE     -- Cho phép người dùng chạy stored procedure đã lưu
FILE    -- Cho phép sử dụng SELECT...INTO OUTFILE và LOAD DATA INFILE
INDEX   -- Cho phép sử dụng CREATE INDEX và DROP INDEX
INSERT  -- Cho phép sử dụng INSERT
LOCK TABLES     -- Cho phép sử dụng LOCK TABLES trên các bảng mà bạn có quyền SELECT
PROCESS     -- Cho phép sử dụng SHOW FULL PROCESSLIST
REFERENCES  -- Chưa được triển khai
RELOAD  -- Cho phép sử dụng FLUSH
REPLICATION CLIENT  -- Cho phép người dùng hỏi địa chỉ của server slave hoặc server master
REPLICATION SLAVE   -- Dùng cho server slave trong replication (đọc binary log event từ server master)
SELECT  -- Cho phép sử dụng SELECT
SHOW DATABASES  -- Hiển thị tất cả cơ sở dữ liệu
SHOW VIEW   -- Cho phép sử dụng SHOW CREATE VIEW
SHUTDOWN    -- Cho phép sử dụng mysqladmin shutdown
SUPER   -- Cho phép sử dụng câu lệnh CHANGE MASTER, KILL, PURGE MASTER LOGS và SET GLOBAL, lệnh mysqladmin debug; cho phép bạn kết nối (một lần), ngay cả khi đã đạt đến max_connections.
UPDATE  -- Cho phép sử dụng UPDATE
USAGE   -- Từ đồng nghĩa của "không có quyền hạn"
GRANT OPTION    -- Cho phép cấp quyền hạn
```

### Bảo trì bảng

```sql
/* Bảo trì bảng */
-- Phân tích và lưu trữ phân bố từ khóa của bảng
ANALYZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tên_bảng ...
-- Kiểm tra một hoặc nhiều bảng có lỗi hay không
CHECK TABLE tbl_name [, tbl_name] ... [option] ...
option = {QUICK | FAST | MEDIUM | EXTENDED | CHANGED}
-- Chống phân mảnh file dữ liệu
OPTIMIZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ...
```

### Linh tinh

```sql
/* Linh tinh */ ------------------
1. Có thể dùng dấu nháy ngược (`) bao quanh định danh (tên cơ sở dữ liệu, tên bảng, tên trường, Index, bí danh), để tránh trùng tên với từ khóa! Tiếng Trung cũng có thể làm định danh!
2. Mỗi thư mục cơ sở dữ liệu tồn tại một file tùy chọn db.opt lưu các tùy chọn của cơ sở dữ liệu hiện tại.
3. Chú thích:
    Chú thích một dòng # nội_dung_chú_thích
    Chú thích nhiều dòng /* nội_dung_chú_thích */
    Chú thích một dòng -- nội_dung_chú_thích     (phong cách chú thích SQL chuẩn, yêu cầu sau hai dấu gạch ngang thêm một ký tự khoảng trắng (khoảng trắng, TAB, xuống dòng, v.v.))
4. Ký tự đại diện của pattern:
    _   một ký tự bất kỳ
    %   nhiều ký tự bất kỳ, thậm chí bao gồm cả không ký tự nào
    Dấu nháy đơn cần được escape \'
5. Ký tự kết thúc câu lệnh trong dòng lệnh CMD có thể là ";", "\G", "\g", chỉ ảnh hưởng đến kết quả hiển thị. Các nơi khác vẫn dùng dấu chấm phẩy để kết thúc. delimiter có thể sửa ký tự kết thúc câu lệnh của hội thoại hiện tại.
6. SQL không phân biệt hoa thường
7. Xóa câu lệnh đã có: \c
```

<!-- @include: @article-footer.snippet.md -->
