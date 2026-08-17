---
title: "Tổng hợp câu hỏi phỏng vấn MyBatis thường gặp"
description: "Giải thích chi tiết các câu hỏi phỏng vấn MyBatis thường gặp, bao gồm sự khác biệt giữa #{} và ${}, SQL động, bộ nhớ đệm cấp 1 và cấp 2, plugin phân trang và nguyên lý ánh xạ Mapper."
category: Framework
icon: "mdi:database-outline"
tag:
  - MyBatis
head:
  - - meta
    - name: keywords
      content: MyBatis,MyBatis面试题,#{}与${},动态SQL,一级缓存,二级缓存,分页插件,Mapper映射
---

> Bài viết này do JavaGuide sưu tầm từ trên mạng, nguồn gốc ban đầu không rõ.
>
> Thay vì những câu hỏi phỏng vấn khô khan này, tôi khuyên bạn nên xem những bài viết chất lượng về MyBatis được giới thiệu ở cuối bài.

### Sự khác biệt giữa #{} và \${} là gì?

Ghi chú: Câu hỏi này là nhà tuyển dụng hỏi đồng nghiệp của tôi.

Trả lời:

- `${}` là ký hiệu chỗ trống (placeholder) cho biến trong file Properties, nó có thể dùng cho thuộc tính thẻ (tag) và bên trong sql, thuộc loại thay thế text nguyên văn (text-based substitution), có thể thay thế bất kỳ nội dung nào, ví dụ `\${driver}` sẽ được thay thế nguyên văn thành `com.mysql.jdbc. Driver`.

Một ví dụ: sắp xếp theo một trường bất kỳ dựa trên tham số:

```sql
select * from users order by ${orderCols}
```

`orderCols` có thể là `name`、`name desc`、`name,sex asc` và các đoạn cố định khác, giúp thực hiện sắp xếp linh hoạt. Nhưng `${}` không sử dụng tham số được biên dịch trước (precompiled parameter) và cũng không tự động thoát (escape) nội dung, do đó `orderCols` không được phép đến trực tiếp từ dữ liệu nhập của người dùng. Trong dự án thực tế nên ánh xạ trường sắp xếp và hướng sắp xếp được truyền từ phía frontend thành các enum hoặc đoạn SQL trong danh sách trắng (whitelist) do phía server định nghĩa trước, đồng thời từ chối các giá trị nằm ngoài danh sách trắng, nếu không sẽ có rủi ro SQL injection.

- `#{}` là ký hiệu chỗ trống tham số của sql, MyBatis sẽ thay thế `#{}` trong sql bằng dấu `?`, trước khi thực thi sql sẽ sử dụng phương thức cài đặt tham số của PreparedStatement, lần lượt gán giá trị cho các ký hiệu chỗ trống `?` của sql, ví dụ `ps.setInt(1, parameterValue)` (chỉ số tham số của JDBC bắt đầu từ 1), cách lấy giá trị của `#{item.name}` là dùng reflection để lấy giá trị thuộc tính name của đối tượng item từ đối tượng tham số, tương đương với `param.getItem().getName()`.

### Trong file ánh xạ xml, ngoài các thẻ select, insert, update, delete thông dụng, còn có những thẻ nào khác?

Ghi chú: Câu hỏi này là nhà tuyển dụng của JD hỏi tôi khi phỏng vấn.

Trả lời: Còn rất nhiều thẻ khác, như `<resultMap>`, `<parameterMap>`, `<sql>`, `<include>`, `<selectKey>`, cộng với 9 thẻ của sql động, `trim|where|set|foreach|if|choose|when|otherwise|bind`, trong đó `<sql>` là thẻ đoạn sql (sql fragment), dùng thẻ `<include>` để đưa đoạn sql vào, `<selectKey>` là thẻ chiến lược sinh khóa chính cho các trường hợp không hỗ trợ tự tăng (auto-increment).

### Nguyên lý hoạt động của interface Dao là gì? Khi tham số của các phương thức trong interface Dao khác nhau, phương thức có thể nạp chồng (overload) không?

Ghi chú: Câu hỏi này cũng là nhà tuyển dụng của JD hỏi tôi khi phỏng vấn.

Trả lời: Trong thực tiễn tốt nhất, thông thường mỗi file ánh xạ xml đều đi kèm một interface Dao tương ứng. Interface Dao chính là interface `Mapper` mà mọi người thường nhắc đến, tên đầy đủ (fully-qualified name) của interface chính là giá trị namespace trong file ánh xạ, tên phương thức của interface chính là giá trị id của `MappedStatement` trong file ánh xạ, tham số bên trong phương thức interface chính là tham số truyền cho sql. Interface `Mapper` không có class triển khai (implementation class), khi gọi phương thức interface, chuỗi ghép "tên đầy đủ của interface + tên phương thức" được dùng làm giá trị key, có thể định vị duy nhất một `MappedStatement`, ví dụ: `com.mybatis3.mappers. StudentDao.findStudentById` , có thể xác định duy nhất `MappedStatement` có `id = findStudentById` trong namespace `com.mybatis3.mappers. StudentDao`. Trong MyBatis, mỗi thẻ `<select>`、 `<insert>`、 `<update>`、 `<delete>` đều được phân tích thành một đối tượng `MappedStatement`.

~~Phương thức bên trong interface Dao không thể nạp chồng, vì chiến lược lưu trữ và tìm kiếm là tên đầy đủ + tên phương thức.~~

Java interface cho phép khai báo phương thức nạp chồng, nhưng MyBatis tìm `MappedStatement` dựa theo "tên đầy đủ của interface + tên phương thức", không dùng chữ ký tham số (parameter signature) để phân biệt phương thức nạp chồng. Do đó, nhiều phương thức nạp chồng chỉ có thể dùng chung một mapping, ID trong XML cũng không được phép trùng lặp. Chỉ khi mapping này có khả năng tương thích với tham số và kiểu trả về của tất cả các phương thức nạp chồng thì việc gọi mới có thể hoạt động bình thường, trong phát triển thực tế không khuyến khích dùng nạp chồng trong interface Mapper.

Phiên bản Mybatis 3.3.0, đã tự kiểm chứng như sau:

```java
/**
 * Nạp chồng phương thức bên trong interface Mapper
 */
public interface StuMapper {

 List<Student> getAllStu();

 List<Student> getAllStu(@Param("id") Integer id);
}
```

Sau đó dùng sql động của Mybatis trong `StuMapper.xml` là có thể triển khai.

```xml
<select id="getAllStu" resultType="com.pojo.Student">
  select * from student
  <where>
    <if test="id != null">
      id = #{id}
    </if>
  </where>
</select>
```

Ví dụ cụ thể này chạy được bình thường là vì hai phương thức nạp chồng cuối cùng đều gọi đến cùng một SQL động mapping, chứ không phải MyBatis có khả năng chọn SQL khác nhau theo chữ ký phương thức.

**Mapper XML của MyBatis không thể điều phối (dispatch) SQL theo chữ ký nạp chồng. Dù một số ví dụ nạp chồng có mapping dùng chung có thể chạy được, vẫn nên ưu tiên dùng tên phương thức khác nhau để thể hiện các truy vấn khác nhau.**

Issue liên quan：[Đính chính: Phương thức trong interface Dao có thể nạp chồng, nhưng ID trong xml của Mybatis không được phép trùng lặp!](https://github.com/Snailclimb/JavaGuide/issues/1122)。

Nguyên lý hoạt động của interface Dao là JDK dynamic proxy, lúc runtime MyBatis dùng JDK dynamic proxy để sinh ra object proxy cho interface Dao, object proxy sẽ chặn các phương thức của interface, chuyển sang thực thi sql mà `MappedStatement` đại diện, sau đó trả về kết quả thực thi sql.

**Bổ sung**：

Kiểm tra bên dưới dùng để minh họa hành vi của các tổ hợp tham số khác nhau khi dùng chung mapping, không phải là quy tắc chung MyBatis định nghĩa về nạp chồng phương thức.

**Kiểm tra như sau**：

`PersonDao.java`

```java
Person queryById();

Person queryById(@Param("id") Long id);

Person queryById(@Param("id") Long id, @Param("name") String name);
```

`PersonMapper.xml`

```xml
<select id="queryById" resultMap="PersonMap">
    select
      id, name, age, address
    from person
    <where>
        <if test="id != null">
            id = #{id}
        </if>
        <if test="name != null and name != ''">
            name = #{name}
        </if>
    </where>
    limit 1
</select>
```

Phương thức `org.apache.ibatis.scripting.xmltags. DynamicContext. ContextAccessor#getProperty` dùng để lấy giá trị điều kiện trong thẻ `<if>`

```java
public Object getProperty(Map context, Object target, Object name) {
  Map map = (Map) target;

  Object result = map.get(name);
  if (map.containsKey(name) || result != null) {
    return result;
  }

  Object parameterObject = map.get(PARAMETER_OBJECT_KEY);
  if (parameterObject instanceof Map) {
    return ((Map)parameterObject).get(name);
  }

  return null;
}
```

`parameterObject` là map, lưu trữ thông tin liên quan đến tham số trong interface Dao.

Phương thức `((Map)parameterObject).get(name)` như sau

```java
public V get(Object key) {
  if (!super.containsKey(key)) {
    throw new BindingException("Parameter '" + key + "' not found. Available parameters are " + keySet());
  }
  return super.get(key);
}
```

1. Khi phương thức `queryById()` thực thi, `parameterObject` là null, phương thức `getProperty` trả về giá trị null, tất cả giá trị điều kiện mà thẻ `<if>` lấy được đều là null, mọi điều kiện đều không thỏa mãn, sql động vẫn thực thi bình thường.
2. Khi phương thức `queryById(1L)` thực thi, `parameterObject` là map, chứa hai key là `id` và `param1`. Khi lấy giá trị thuộc tính `name` trong thẻ `<if>`, đi vào phương thức `((Map)parameterObject).get(name)`, key trong map không chứa `name`, nên ném ra ngoại lệ.
3. Khi phương thức `queryById(1L,"1")` thực thi, `parameterObject` chứa bốn key `id`,`param1`,`name`,`param2`, cả tham số `id` và `name` đều lấy được, sql động thực thi bình thường.

### MyBatis phân trang như thế nào? Nguyên lý của plugin phân trang là gì?

Ghi chú: Tôi đưa ra.

Trả lời: **(1)** MyBatis dùng đối tượng RowBounds để phân trang, nó không viết lại SQL, mà bỏ qua (skip) offset dòng và giới hạn số lượng trả về ngay trên JDBC ResultSet, thuộc loại phân trang ở phía client trên tập kết quả chứ không phải phân trang vật lý (physical pagination), hiệu suất phụ thuộc vào driver JDBC và loại ResultSet; **(2)** có thể viết trực tiếp tham số phân trang vật lý trong sql để hoàn thành phân trang vật lý, **(3)** hoặc dùng plugin phân trang để hoàn thành phân trang vật lý. Đối với khối lượng dữ liệu lớn và offset lớn, thông thường nên ưu tiên dùng phân trang vật lý.

Nguyên lý cơ bản của plugin phân trang là dùng interface plugin mà MyBatis cung cấp, triển khai plugin tùy chỉnh, trong phương thức chặn của plugin chặn sql sắp thực thi, sau đó viết lại sql, dựa theo dialect, thêm câu lệnh phân trang vật lý và tham số phân trang vật lý tương ứng.

Ví dụ: `select _ from student` , sau khi chặn sql được viết lại thành: `select t._ from （select \* from student）t limit 0，10`

### Trình bày ngắn gọn nguyên lý chạy của plugin MyBatis, và cách viết một plugin

Ghi chú: Tôi đưa ra.

Trả lời: MyBatis chỉ có thể viết plugin cho 4 loại interface là `ParameterHandler`、 `ResultSetHandler`、 `StatementHandler`、 `Executor`, MyBatis dùng JDK dynamic proxy để sinh ra object proxy cho interface cần chặn nhằm triển khai chức năng chặn phương thức interface, mỗi khi chạy phương thức của 4 loại object interface này, sẽ đi vào phương thức chặn, cụ thể là phương thức `invoke()` của `InvocationHandler`, tất nhiên, chỉ chặn những phương thức mà bạn chỉ định cần chặn.

Triển khai interface `Interceptor` của MyBatis và viết đè (override) phương thức `intercept()`, sau đó viết annotation cho plugin, chỉ định cần chặn những phương thức nào của interface nào là xong, nhớ đừng quên cấu hình plugin bạn viết trong file cấu hình.

### MyBatis thực hiện batch insert, có thể trả về danh sách khóa chính của database không?

Ghi chú: Tôi đưa ra.

Trả lời: Được, JDBC còn làm được thì tất nhiên MyBatis cũng làm được.

### MyBatis sql động dùng để làm gì? Có những loại sql động nào? Có thể trình bày ngắn gọn nguyên lý thực thi của sql động không?

Ghi chú: Tôi đưa ra.

Trả lời: MyBatis sql động cho phép chúng ta viết sql động dưới dạng thẻ bên trong file ánh xạ xml, hoàn thành chức năng xử lý logic (logic) và ghép nối sql động. Nguyên lý thực thi của nó là dùng OGNL tính giá trị biểu thức từ đối tượng tham số sql, dựa theo giá trị biểu thức ghép nối sql động, từ đó hoàn thành chức năng sql động.

MyBatis cung cấp 9 loại thẻ sql động:

- `<if></if>`
- `<where></where>(trim,set)`
- `<choose></choose>（when, otherwise）`
- `<foreach></foreach>`
- `<bind/>`

Để biết giới thiệu chi tiết về SQL động của MyBatis, xin xem bài viết này：[Mybatis 系列全解（八）：Mybatis 的 9 大动态 SQL 标签你知道几个？](https://segmentfault.com/a/1190000039335704) 。

Về cách sử dụng cụ thể của các SQL động này, xin xem bài viết này：[Mybatis【13】-- Mybatis 动态 sql 标签怎么使用？](https://cloud.tencent.com/developer/article/1943349)

### MyBatis đóng gói kết quả thực thi sql thành đối tượng đích và trả về như thế nào? Có những dạng ánh xạ nào?

Ghi chú: Tôi đưa ra.

Trả lời: Cách thứ nhất là dùng thẻ `<resultMap>`, lần lượt định nghĩa quan hệ ánh xạ giữa tên cột và tên thuộc tính object. Cách thứ hai là dùng chức năng alias (bí danh) của cột sql, viết alias của cột thành tên thuộc tính object, ví dụ T_NAME AS NAME, tên thuộc tính object thường là name, viết thường, nhưng tên cột không phân biệt hoa thường, MyBatis sẽ bỏ qua việc phân biệt hoa thường của tên cột, thông minh tìm ra tên thuộc tính object tương ứng, bạn thậm chí có thể viết thành T_NAME AS NaMe, MyBatis vẫn hoạt động bình thường.

Sau khi có quan hệ ánh xạ giữa tên cột và tên thuộc tính, MyBatis tạo object thông qua reflection, đồng thời dùng reflection gán giá trị lần lượt cho các thuộc tính của object và trả về, những thuộc tính không tìm thấy quan hệ ánh xạ thì không thể hoàn thành gán giá trị.

### MyBatis có thể thực hiện truy vấn quan hệ một-một, một-nhiều không? Có những cách triển khai nào, và sự khác biệt giữa chúng là gì

Ghi chú: Tôi đưa ra.

Trả lời: Được. MyBatis thường dùng `<association>` để ánh xạ quan hệ "có một" (như một-một, nhiều-một), dùng `<collection>` để ánh xạ quan hệ "có nhiều" (như một-nhiều, nhiều-nhiều). Số lượng (cardinality) của quan hệ do thuộc tính object và cấu trúc ánh xạ quyết định, chứ không phải đơn giản là đổi `selectOne()` thành `selectList()`.

Truy vấn object liên kết (association) chủ yếu có hai cách triển khai: một là Nested Select, tức thực thi một mapped statement khác để truy vấn object liên kết, dùng không đúng có thể sinh ra truy vấn N+1; cách khác là Nested Results, tức thông qua join thu được tập kết quả chứa dữ liệu trùng lặp, rồi dùng ánh xạ kết quả lồng nhau (nested result mapping) để lắp ráp object graph. Cách sau chỉ cần thực thi một lần SQL, nhưng cần cấu hình chính xác ánh xạ `<id>` của object chính và object liên kết.

Vậy câu hỏi đặt ra là, join query ra 100 bản ghi, làm sao xác định object chính là 5 chứ không phải 100? Nguyên lý khử trùng (deduplication) của nó là thẻ con `<id>` trong thẻ `<resultMap>`, chỉ định cột id dùng để xác định duy nhất một bản ghi, MyBatis dựa theo giá trị cột `<id>` để hoàn thành chức năng khử trùng 100 bản ghi, `<id>` có thể có nhiều cái, đại diện cho ngữ nghĩa khóa chính kết hợp (composite primary key).

Tương tự, object liên kết của object chính cũng khử trùng theo nguyên lý này, dù rằng trong trường hợp thông thường, chỉ object chính mới có bản ghi trùng lặp, object liên kết thường không bị trùng lặp.

Ví dụ: join query bên dưới trả ra 6 bản ghi, cột một và cột hai là cột của object Teacher, cột ba là cột của object Student, sau khi MyBatis khử trùng, kết quả là 1 giáo viên và 6 học sinh, thay vì 6 giáo viên và 6 học sinh.

| t_id | t_name  | s_id |
| ---- | ------- | ---- |
| 1    | teacher | 38   |
| 1    | teacher | 39   |
| 1    | teacher | 40   |
| 1    | teacher | 41   |
| 1    | teacher | 42   |
| 1    | teacher | 43   |

### MyBatis có hỗ trợ lazy loading (tải trễ) không? Nếu có, nguyên lý triển khai của nó là gì?

Ghi chú: Tôi đưa ra.

Trả lời: MyBatis chỉ hỗ trợ lazy loading cho object liên kết association và collection liên kết tập hợp, association chỉ quan hệ một-một, collection chỉ quan hệ một-nhiều. Trong file cấu hình MyBatis, có thể cấu hình có bật lazy loading hay không `lazyLoadingEnabled=true|false.`

Nguyên lý của nó là tạo proxy cho object kết quả, khi truy cập thuộc tính chưa được tải, proxy sẽ kích hoạt truy vấn liên kết đã được đăng ký trước, rồi ghi kết quả truy vấn vào thuộc tính đích. Từ phiên bản MyBatis 3.3 trở lên mặc định dùng Javassist để tạo proxy lazy loading; CGLIB là phương án tùy chọn của các phiên bản cũ, và đã bị loại bỏ (deprecated) kể từ MyBatis 3.5.10. Đối với liên kết cụ thể còn có thể dùng `fetchType` để ghi đè cấu hình toàn cục `lazyLoadingEnabled`.

Tất nhiên, không chỉ MyBatis, mà hầu như tất cả các framework gồm cả Hibernate, nguyên lý hỗ trợ lazy loading đều giống nhau.

### Trong các file ánh xạ xml của MyBatis, ở các file ánh xạ xml khác nhau, id có thể trùng lặp không?

Ghi chú: Tôi đưa ra.

Trả lời: Ở các file ánh xạ xml khác nhau, id có thể trùng lặp.

Lý do là namespace+id được dùng làm key của `Map<String, MappedStatement>`, nếu namespace khác nhau, dù id trùng lặp thì key (namespace+id) cũng khác nhau.

### Trong MyBatis thực hiện batch processing như thế nào?

Ghi chú: Tôi đưa ra.

Trả lời: Dùng `BatchExecutor` để hoàn thành batch processing.

### MyBatis có những Executor executor nào? Sự khác biệt giữa chúng là gì?

Ghi chú: Tôi đưa ra

Trả lời: MyBatis có ba loại `Executor` executor cơ bản:

- **`SimpleExecutor`：** Mỗi lần thực thi một update hoặc select, đều mở một đối tượng Statement, dùng xong đóng đối tượng Statement ngay lập tức.
- **`ReuseExecutor`：** Khi thực thi update hoặc select, dùng sql làm key để tìm đối tượng Statement, có thì dùng, không có thì tạo mới, dùng xong, không đóng đối tượng Statement, mà đặt vào `Map<String, Statement>` để lần sau dùng tiếp. Nói ngắn gọn, là tái sử dụng đối tượng Statement.
- **`BatchExecutor`**：Khi thực thi update (không có select, JDBC batch processing không hỗ trợ select), thêm tất cả sql vào batch (addBatch()), chờ thực thi thống nhất (executeBatch()), nó cache nhiều đối tượng Statement, mỗi đối tượng Statement sau khi addBatch() xong, đều chờ lần lượt thực thi executeBatch() xử lý batch. Giống với JDBC batch processing.

Phạm vi tác dụng:`Executor` các đặc điểm này đều bị giới hạn nghiêm ngặt trong vòng đời (lifecycle) của SqlSession.

### Trong MyBatis làm sao chỉ định dùng loại Executor executor nào?

Ghi chú: Tôi đưa ra

Trả lời: Trong file cấu hình MyBatis, có thể chỉ định loại `ExecutorType` executor mặc định, cũng có thể thủ công truyền tham số loại `ExecutorType` cho phương thức tạo SqlSession của `DefaultSqlSessionFactory`.

### MyBatis có thể ánh xạ enum Enum không?

Ghi chú: Tôi đưa ra

Trả lời: MyBatis có thể ánh xạ enum, không chỉ enum, MyBatis còn có thể ánh xạ bất kỳ object nào vào một cột của bảng. Cách ánh xạ là tự định nghĩa một `TypeHandler`, triển khai phương thức interface `setParameter()` và `getResult()` của `TypeHandler`. `TypeHandler` có hai tác dụng:

- Một là hoàn thành chuyển đổi từ javaType sang jdbcType;
- Hai là hoàn thành chuyển đổi từ jdbcType sang javaType, thể hiện qua hai phương thức `setParameter()` và `getResult()`, lần lượt đại diện cho việc gán tham số cho ký hiệu chỗ trống (dấu `?`) của sql và lấy kết quả truy vấn cột.

### Trong file ánh xạ MyBatis, nếu thẻ A dùng include để tham chiếu nội dung của thẻ B, vậy thẻ B có thể định nghĩa sau thẻ A hay không, hay bắt buộc phải định nghĩa trước thẻ A?

Ghi chú: Tôi đưa ra

Trả lời: Dù MyBatis phân tích file ánh xạ xml theo thứ tự, thẻ B được tham chiếu vẫn có thể định nghĩa ở bất kỳ vị trí nào, MyBatis đều nhận diện chính xác.

Nguyên lý là, MyBatis phân tích thẻ A, phát hiện thẻ A tham chiếu thẻ B, nhưng thẻ B chưa được phân tích đến, chưa tồn tại, lúc này MyBatis sẽ đánh dấu thẻ A là trạng thái chưa được phân tích, rồi tiếp tục phân tích các thẻ còn lại, bao gồm thẻ B, chờ tất cả các thẻ phân tích xong, MyBatis sẽ phân tích lại những thẻ bị đánh dấu là chưa được phân tích, lúc này khi phân tích lại thẻ A, thẻ B đã tồn tại, thẻ A cũng đã có thể phân tích hoàn chỉnh.

### Trình bày ngắn gọn quan hệ ánh xạ giữa file ánh xạ xml và cấu trúc dữ liệu nội bộ của MyBatis?

Ghi chú: Tôi đưa ra

Trả lời: MyBatis phân tích thông tin cấu hình xml và lưu trữ vào `Configuration`. Trong file ánh xạ xml, thẻ `<parameterMap>` sẽ được phân tích thành đối tượng `ParameterMap`, mỗi phần tử con của nó sẽ được phân tích thành đối tượng `ParameterMapping`. Thẻ `<resultMap>` sẽ được phân tích thành đối tượng `ResultMap`, mỗi phần tử con của nó sẽ được phân tích thành đối tượng `ResultMapping`. Mỗi thẻ `<select>、<insert>、<update>、<delete>` đều sẽ được phân tích thành đối tượng `MappedStatement`, SQL bên trong thẻ sẽ được phân tích thành `SqlSource`; khi thực thi, `SqlSource` lại sinh ra `BoundSql` dựa theo tham số thực tế.

### Tại sao nói MyBatis là công cụ ánh xạ ORM bán tự động? Nó khác với loại hoàn toàn tự động ở chỗ nào?

Ghi chú: Tôi đưa ra

Trả lời: Hibernate thuộc loại công cụ ánh xạ ORM hoàn toàn tự động, khi dùng Hibernate truy vấn object liên kết hoặc collection liên kết, có thể lấy trực tiếp dựa theo mô hình quan hệ object, nên nó là hoàn toàn tự động. Còn MyBatis khi truy vấn object liên kết hoặc collection liên kết, cần tự viết sql để hoàn thành, nên được gọi là công cụ ánh xạ ORM bán tự động.

Các câu hỏi phỏng vấn trông có vẻ đều rất đơn giản, nhưng muốn trả lời chính xác được thì chắc chắn là người đã nghiên cứu sâu vào source code, chứ không phải người chỉ biết sử dụng hoặc dùng thuần thục, nội dung mà tất cả các câu hỏi phỏng vấn và câu trả lời kể trên liên quan đến, đều được tôi trình bày chi tiết và phân tích nguyên lý trong loạt blog về MyBatis.

<!-- @include: @article-footer.snippet.md -->

### Bài viết được giới thiệu

- [2W 字全面剖析 Mybatis 中的 9 种设计模式](https://juejin.cn/post/7273516671574687759)
- [从零开始实现一个 MyBatis 加解密插件](https://mp.weixin.qq.com/s/WUEAdFDwZsZ4EKO8ix0ijg)
- [MyBatis 最全使用指南](https://juejin.cn/post/7051910683264286750)
- [脑洞打开！第一次看到这样使用 MyBatis 的，看得我一愣一愣的。](https://juejin.cn/post/7269390456530190376)
- [MyBatis 居然也有并发问题](https://juejin.cn/post/7264921613551730722)
