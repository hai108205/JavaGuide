---
title: Tổng hợp các Annotation thường dùng trong Spring & SpringMVC & SpringBoot
description: Tổng hợp đầy đủ các Annotation thường dùng trong Spring và Spring Boot, bao gồm giải thích chi tiết cách sử dụng các annotation cốt lõi như @Autowired, @Component, @RequestMapping, v.v.
category: 框架
tag:
  - SpringBoot
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring注解,Spring Boot注解,@SpringBootApplication,@Autowired,@RequestMapping,@Configuration,@Component,常用注解
---

Có thể khẳng định không ngoa rằng, các annotation thường dùng trong Spring/SpringBoot được giới thiệu trong bài viết này về cơ bản đã bao quát hầu hết các tình huống phổ biến mà bạn gặp trong công việc. Đối với mỗi annotation, bài viết đều cung cấp cách sử dụng cụ thể. Sau khi nắm vững những nội dung này, việc sử dụng Spring Boot để phát triển dự án về cơ bản sẽ không còn vấn đề gì lớn!

**Tại sao lại viết bài này?**

Gần đây tôi thấy có một bài viết trên mạng về các annotation thường dùng trong Spring Boot được chia sẻ rộng rãi, nhưng nội dung bài viết có một số điểm gây hiểu lầm, có thể không thân thiện với những developer chưa có nhiều kinh nghiệm thực tế. Vì vậy tôi đã dành vài ngày để tổng hợp bài viết này, hy vọng có thể giúp mọi người hiểu và sử dụng Spring annotation tốt hơn.

**Do năng lực và thời gian có hạn, nếu có bất kỳ sai sót hoặc thiếu sót nào, rất mong được góp ý! Vô cùng cảm ơn!**

## Spring Boot Annotation Cơ Bản

`@SpringBootApplication` là annotation cốt lõi của ứng dụng Spring Boot, thường được dùng để đánh dấu lớp khởi chạy chính (main class).

Ví dụ:

```java
@SpringBootApplication
public class SpringSecurityJwtGuideApplication {
      public static void main(java.lang.String[] args) {
        SpringApplication.run(SpringSecurityJwtGuideApplication.class, args);
    }
}
```

Chúng ta có thể coi `@SpringBootApplication` là sự kết hợp của ba annotation sau:

- **`@EnableAutoConfiguration`**: Kích hoạt cơ chế tự động cấu hình (auto-configuration) của Spring Boot.
- **`@ComponentScan`**: Quét các class được đánh dấu bởi `@Component`, `@Service`, `@Repository`, `@Controller`, v.v.
- **`@Configuration`**: Cho phép đăng ký thêm các Spring Bean hoặc import các class cấu hình khác.

Mã nguồn như sau:

```java
package org.springframework.boot.autoconfigure;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
    @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
   ......
}

package org.springframework.boot;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

}
```

## Spring Bean

### Dependency Injection (DI)

`@Autowired` được dùng để tự động tiêm (inject) các dependency (tức là các Spring Bean khác). Nó có thể được đánh dấu trên constructor, field, setter method hoặc configuration method. Spring container sẽ tự động tìm Bean có kiểu phù hợp và tiêm vào.

```java
@Service
public class UserServiceImpl implements UserService {
    // ...
}

@RestController
public class UserController {
    // Field injection
    @Autowired
    private UserService userService;
    // ...
}
```

Khi tồn tại nhiều Bean cùng kiểu, `@Autowired` mặc định tiêm theo kiểu (by type) có thể gây ra sự không rõ ràng (ambiguity). Lúc này, có thể kết hợp với `@Qualifier` để chỉ định chính xác instance cần tiêm thông qua tên của Bean.

```java
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired
    @Qualifier("userRepositoryA") // Chỉ định tiêm Bean có tên "userRepositoryA"
    private UserRepository userRepository;
    // ...
}
```

`@Primary` cũng được dùng để giải quyết vấn đề tiêm khi có nhiều instance Bean cùng kiểu. Khi định nghĩa Bean (ví dụ sử dụng `@Bean` hoặc class annotation), thêm annotation `@Primary` để biểu thị rằng Bean đó là đối tượng tiêm **ưu tiên**. Khi thực hiện tiêm `@Autowired`, nếu không sử dụng `@Qualifier` để chỉ định tên, Spring sẽ ưu tiên chọn Bean có `@Primary`.

```java
@Primary // Đặt UserRepositoryA làm đối tượng tiêm ưu tiên
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired // Sẽ tự động tiêm UserRepositoryA, vì nó là @Primary
    private UserRepository userRepository;
    // ...
}
```

`@Resource(name="beanName")` là annotation được định nghĩa trong chuẩn JSR-250, cũng được dùng cho dependency injection. Nó mặc định tìm kiếm Bean theo **tên (by Name)** để tiêm, trong khi `@Autowired` mặc định tìm theo **kiểu (by Type)**. Nếu không chỉ định thuộc tính `name`, nó sẽ cố gắng tìm theo tên field hoặc tên method; nếu không tìm thấy, sẽ fallback sang tìm theo kiểu (tương tự `@Autowired`).

`@Resource` chỉ có thể đánh dấu trên field và setter method, không hỗ trợ constructor injection.

```java
@Service
public class UserService {
    @Resource(name = "userRepositoryA")
    private UserRepository userRepository;
    // ...
}
```

### Bean Scope

`@Scope("scopeName")` định nghĩa phạm vi (scope) của Spring Bean, tức là vòng đời và phạm vi khả kiến của instance Bean. Các scope thường dùng bao gồm:

- **singleton**: Chỉ có duy nhất một instance Bean trong IoC container. Bean trong Spring mặc định là singleton, áp dụng singleton design pattern.
- **prototype**: Mỗi lần lấy sẽ tạo ra một instance Bean mới. Nói cách khác, gọi `getBean()` hai lần liên tiếp sẽ nhận được hai instance Bean khác nhau.
- **request** (chỉ khả dụng trong Web app): Mỗi HTTP request sẽ tạo ra một bean mới (request bean), bean đó chỉ có hiệu lực trong phạm vi HTTP request hiện tại.
- **session** (chỉ khả dụng trong Web app): Mỗi HTTP request từ một session mới sẽ tạo ra một bean mới (session bean), bean đó chỉ có hiệu lực trong phạm vi HTTP session hiện tại.
- **application/global-session** (chỉ khả dụng trong Web app): Mỗi Web app khi khởi động sẽ tạo một Bean (application Bean), bean đó chỉ có hiệu lực trong thời gian ứng dụng hiện tại đang chạy.
- **websocket** (chỉ khả dụng trong Web app): Mỗi WebSocket session sẽ tạo ra một bean mới.

```java
@Component
// Mỗi lần lấy sẽ tạo instance PrototypeBean mới
@Scope("prototype")
public class PrototypeBean {
    // ...
}
```

### Đăng Ký Bean

Spring container cần biết những class nào cần được quản lý dưới dạng Bean. Ngoài việc sử dụng phương thức `@Bean` để khai báo tường minh (thường là trong class `@Configuration`), cách phổ biến hơn là sử dụng Stereotype annotation để đánh dấu class, kết hợp với cơ chế Component Scanning, cho phép Spring tự động phát hiện và đăng ký các class này thành Bean. Các Bean này sau đó có thể được tiêm (inject) vào các component khác thông qua `@Autowired` và các cách khác.

Dưới đây là một số annotation thường dùng để đăng ký Bean:

- `@Component`: Annotation chung, có thể đánh dấu bất kỳ class nào là Spring component. Nếu một Bean không biết thuộc tầng (layer) nào, có thể sử dụng annotation `@Component` để đánh dấu.
- `@Repository`: Tương ứng với tầng persistence (persistence layer) tức là tầng Dao, chủ yếu dùng cho các thao tác liên quan đến database.
- `@Service`: Tương ứng với tầng service (service layer), chủ yếu liên quan đến các logic phức tạp, cần sử dụng tầng Dao.
- `@Controller`: Tương ứng với tầng Spring MVC controller, chủ yếu dùng để nhận request từ người dùng và gọi Service layer để trả dữ liệu về cho frontend page.
- `@RestController`: Một annotation tổ hợp, tương đương với `@Controller` + `@ResponseBody`. Nó được thiết kế đặc biệt để xây dựng controller cho RESTful Web Service. Với class được đánh dấu `@RestController`, tất cả giá trị trả về của các handler method đều được tự động serialize (thường là JSON) và ghi vào HTTP response body, thay vì được phân giải thành tên view.

`@Controller` vs `@RestController`:

- `@Controller`: Chủ yếu dùng trong ứng dụng Spring MVC truyền thống, giá trị trả về của method thường là tên view logic (logical view name), cần View Resolver phối hợp để render trang. Nếu cần trả về dữ liệu (như JSON), cần thêm annotation `@ResponseBody` trên method.
- `@RestController`: Được thiết kế chuyên biệt để xây dựng RESTful API trả về dữ liệu. Khi sử dụng annotation này trên class, tất cả giá trị trả về của method mặc định đều được coi là nội dung response body (tương đương với việc mỗi method đều ngầm có `@ResponseBody`), thường dùng để trả về dữ liệu JSON hoặc XML. Trong các ứng dụng frontend-backend tách biệt hiện đại, `@RestController` là lựa chọn phổ biến hơn.

Về so sánh giữa `@RestController` và `@Controller`, vui lòng xem bài viết này: [@RestController vs @Controller](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485544&idx=1&sn=3cc95b88979e28fe3bfe539eb421c6d8&chksm=cea247a3f9d5ceb5e324ff4b8697adc3e828ecf71a3468445e70221cce768d1e722085359907&token=1725092312&lang=zh_CN#rd)。

## Cấu Hình

### Khai Báo Class Cấu Hình

`@Configuration` chủ yếu được dùng để khai báo một class là class cấu hình (configuration class) của Spring. Mặc dù cũng có thể dùng annotation `@Component` để thay thế, nhưng `@Configuration` thể hiện rõ ràng hơn mục đích của class đó (định nghĩa Bean), ngữ nghĩa rõ ràng hơn, đồng thời cũng thuận tiện cho Spring thực hiện các xử lý đặc thù (ví dụ: thông qua CGLIB proxy để đảm bảo hành vi singleton của phương thức `@Bean`).

```java
@Configuration
public class AppConfig {

    // @Bean annotation dùng để khai báo một Bean trong class cấu hình
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

    // Class cấu hình có thể chứa một hoặc nhiều phương thức @Bean.
}
```

### Đọc Thông Tin Cấu Hình

Trong quá trình phát triển ứng dụng, chúng ta thường cần quản lý một số thông tin cấu hình, ví dụ như chi tiết kết nối database, khóa hoặc địa chỉ của dịch vụ bên thứ ba (như Alibaba Cloud OSS, dịch vụ SMS, xác thực WeChat). Thông thường, những thông tin này sẽ được **lưu trữ tập trung trong file cấu hình** (như `application.yml` hoặc `application.properties`), để thuận tiện cho việc quản lý và chỉnh sửa.

Spring cung cấp nhiều cách thuận tiện để đọc các thông tin cấu hình này. Giả sử chúng ta có file `application.yml` như sau:

```yaml
wuhan2020: 2020年初武汉爆发了新型冠状病毒，疫情严重，但是，我相信一切都会过去！武汉加油！中国加油！

my-profile:
  name: Guide哥
  email: koushuangbwcx@163.com

library:
  location: 湖北武汉加油中国加油
  books:
    - name: 天才基本法
      description: 二十二岁的林朝夕在父亲确诊阿尔茨海默病这天，得知自己暗恋多年的校园男神裴之即将出国深造的消息——对方考取的学校，恰是父亲当年为她放弃的那所。
    - name: 时间的秩序
      description: 为什么我们记得过去，而非未来？时间"流逝"意味着什么？是我们存在于时间之内，还是时间存在于我们之中？卡洛·罗韦利用诗意的文字，邀请我们思考这一亘古难题——时间的本质。
    - name: 了不起的我
      description: 如何养成一个新习惯？如何让心智变得更成熟？如何拥有高质量的关系？ 如何走出人生的艰难时刻？
```

Dưới đây là một số cách thường dùng để đọc cấu hình:

1. `@Value("${property.key}")` tiêm (inject) giá trị thuộc tính đơn lẻ từ file cấu hình (như `application.properties` hoặc `application.yml`). Nó cũng hỗ trợ Spring Expression Language (SpEL), có thể thực hiện logic tiêm phức tạp hơn.

```java
@Value("${wuhan2020}")
String wuhan2020;
```

2. `@ConfigurationProperties` có thể đọc thông tin cấu hình và liên kết (bind) với Bean, được sử dụng nhiều hơn.

```java
@Component
@ConfigurationProperties(prefix = "library")
class LibraryProperties {
    @NotEmpty
    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
  省略getter/setter
  ......
}
```

Bạn có thể sử dụng nó như một Spring Bean thông thường, tiêm vào class để sử dụng.

```java
@Service
public class LibraryService {

    private final LibraryProperties libraryProperties;

    @Autowired
    public LibraryService(LibraryProperties libraryProperties) {
        this.libraryProperties = libraryProperties;
    }

    public void printLibraryInfo() {
        System.out.println(libraryProperties);
    }
}
```

### Tải File Cấu Hình Chỉ Định

Annotation `@PropertySource` cho phép tải file cấu hình tùy chỉnh. Phù hợp với các tình huống cần lưu trữ một phần thông tin cấu hình riêng biệt.

```java
@Component
@PropertySource("classpath:website.properties")

class WebSite {
    @Value("${url}")
    private String url;

  省略getter/setter
  ......
}
```

**Lưu ý**: Khi sử dụng `@PropertySource`, hãy đảm bảo đường dẫn file bên ngoài chính xác và file đó nằm trong classpath.

Để biết thêm chi tiết, vui lòng xem bài viết này của tôi: [10 phút làm chủ cách Spring Boot đọc file cấu hình một cách thanh lịch](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486181&idx=2&sn=10db0ae64ef501f96a5b0dbc4bd78786&chksm=cea2452ef9d5cc384678e456427328600971180a77e40c13936b19369672ca3e342c26e92b50&token=816772476&lang=zh_CN#rd) 。

## MVC

### HTTP Request

**5 loại request phổ biến:**

- **GET**: Yêu cầu lấy tài nguyên cụ thể từ server. Ví dụ: `GET /users` (lấy tất cả sinh viên)
- **POST**: Tạo một tài nguyên mới trên server. Ví dụ: `POST /users` (tạo sinh viên)
- **PUT**: Cập nhật tài nguyên trên server (client cung cấp toàn bộ tài nguyên sau khi cập nhật). Ví dụ: `PUT /users/12` (cập nhật sinh viên có id 12)
- **DELETE**: Xóa tài nguyên cụ thể khỏi server. Ví dụ: `DELETE /users/12` (xóa sinh viên có id 12)
- **PATCH**: Cập nhật tài nguyên trên server (client cung cấp các thuộc tính đã thay đổi, có thể coi là cập nhật một phần), ít được sử dụng hơn, ở đây không nêu ví dụ.

#### GET Request

`@GetMapping("users")` tương đương với `@RequestMapping(value="/users",method=RequestMethod.GET)`.

```java
@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
  return ResponseEntity.ok(userRepository.findAll());
}
```

#### POST Request

`@PostMapping("users")` tương đương với `@RequestMapping(value="/users",method=RequestMethod.POST)`.

`@PostMapping` thường kết hợp với `@RequestBody` để nhận dữ liệu JSON và ánh xạ (map) thành Java object.

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
  User user = userService.create(userCreateRequest);
  return ResponseEntity.status(HttpStatus.CREATED).body(user);
}
```

#### PUT Request

`@PutMapping("/users/{userId}")` tương đương với `@RequestMapping(value="/users/{userId}",method=RequestMethod.PUT)`.

```java
@PutMapping("/users/{userId}")
public ResponseEntity<User> updateUser(@PathVariable(value = "userId") Long userId,
  @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
  ......
}
```

#### DELETE Request

`@DeleteMapping("/users/{userId}")` tương đương với `@RequestMapping(value="/users/{userId}",method=RequestMethod.DELETE)`.

```java
@DeleteMapping("/users/{userId}")
public ResponseEntity deleteUser(@PathVariable(value = "userId") Long userId){
  ......
}
```

#### PATCH Request

Thông thường trong các dự án thực tế, chúng ta chỉ sử dụng PATCH request để cập nhật dữ liệu khi PUT không đủ đáp ứng.

```java
  @PatchMapping("/profile")
  public ResponseEntity updateStudent(@RequestBody StudentUpdateRequest studentUpdateRequest) {
        studentRepository.updateDetail(studentUpdateRequest);
        return ResponseEntity.ok().build();
    }
```

### Parameter Binding

Khi xử lý HTTP request, Spring MVC cung cấp nhiều annotation để liên kết (bind) tham số request vào tham số method. Dưới đây là các cách bind tham số phổ biến:

#### Trích Xuất Tham Số Từ URL Path

`@PathVariable` được dùng để trích xuất tham số từ URL path. Ví dụ:

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable("klassId") Long klassId) {
    return teacherService.findTeachersByClass(klassId);
}
```

Nếu URL request là `/klasses/123/teachers`, thì `klassId = 123`.

#### Bind Query Parameter

`@RequestParam` được dùng để bind query parameter. Ví dụ:

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable Long klassId,
                                        @RequestParam(value = "type", required = false) String type) {
    return teacherService.findTeachersByClassAndType(klassId, type);
}
```

Nếu URL request là `/klasses/123/teachers?type=web`, thì `klassId = 123`, `type = web`.

#### Bind Dữ Liệu JSON Trong Request Body

`@RequestBody` được dùng để đọc phần body của request (có thể là POST, PUT, DELETE, GET request) với **Content-Type là application/json**. Sau khi nhận dữ liệu, hệ thống sẽ tự động bind dữ liệu vào Java object. Hệ thống sẽ sử dụng `HttpMessageConverter` hoặc `HttpMessageConverter` tùy chỉnh để chuyển đổi chuỗi JSON trong request body thành Java object.

Tôi sẽ dùng một ví dụ đơn giản để minh họa cách sử dụng cơ bản!

Chúng ta có một interface đăng ký:

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
  userService.save(userRegisterRequest);
  return ResponseEntity.ok().build();
}
```

Object `UserRegisterRequest`:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank
    private String userName;
    @NotBlank
    private String password;
    @NotBlank
    private String fullName;
}
```

Chúng ta gửi POST request đến interface này, và body mang dữ liệu JSON:

```json
{ "userName": "coder", "fullName": "shuangkou", "password": "123456" }
```

Như vậy backend của chúng ta có thể trực tiếp ánh xạ dữ liệu định dạng JSON sang class `UserRegisterRequest`.

![](./images/spring-annotations/@RequestBody.png)

**Lưu ý**:

- Một method chỉ có thể có một tham số `@RequestBody`, nhưng có thể có nhiều `@PathVariable` và `@RequestParam`.
- Nếu cần nhận nhiều object phức tạp, nên gộp chúng thành một object duy nhất.

## Data Validation

Data validation là khâu then chốt để đảm bảo tính ổn định và bảo mật của hệ thống. Ngay cả khi phía giao diện người dùng (frontend) đã thực hiện data validation, **dịch vụ backend vẫn phải thực hiện validation lại đối với dữ liệu nhận được**. Điều này là do validation phía frontend có thể dễ dàng bị vượt qua (ví dụ: thông qua developer tools để sửa request hoặc sử dụng các công cụ HTTP như Postman, curl để gọi trực tiếp API), dữ liệu độc hại hoặc sai lệch có thể được gửi trực tiếp đến backend. Do đó, validation phía backend là tuyến phòng thủ cuối cùng, cũng là quan trọng nhất, để ngăn chặn dữ liệu bất hợp lệ, duy trì tính nhất quán của dữ liệu và đảm bảo logic nghiệp vụ thực thi chính xác.

Bean Validation là một bộ đặc tả (specification) định nghĩa tiêu chuẩn validation tham số JavaBean (JSR 303, 349, 380). Nó cung cấp một loạt annotation có thể được sử dụng trực tiếp trên các thuộc tính của JavaBean, từ đó thực hiện validation tham số một cách thuận tiện.

- **JSR 303 (Bean Validation 1.0):** Đặt nền móng, giới thiệu các annotation validation cốt lõi (như `@NotNull`, `@Size`, `@Min`, `@Max`, v.v.), định nghĩa cách validation các thuộc tính của JavaBean thông qua annotation, đồng thời hỗ trợ validation object lồng nhau (nested) và custom validator.
- **JSR 349 (Bean Validation 1.1):** Mở rộng trên nền tảng 1.0, ví dụ như giới thiệu hỗ trợ validation tham số method và giá trị trả về, tăng cường xử lý Group Validation.
- **JSR 380 (Bean Validation 2.0):** Tận dụng các tính năng mới của Java 8 và thực hiện một số cải tiến, ví dụ như hỗ trợ các kiểu ngày và thời gian trong package `java.time`, giới thiệu một số annotation validation mới (như `@NotEmpty`, `@NotBlank`, v.v.).

Bản thân Bean Validation chỉ là một bộ **đặc tả (interface và annotation)**, chúng ta cần một **framework cụ thể** triển khai đặc tả này để thực thi logic validation. Hiện tại, **Hibernate Validator** là implementation tham chiếu có thẩm quyền nhất và được sử dụng rộng rãi nhất của đặc tả Bean Validation.

- Hibernate Validator 4.x triển khai Bean Validation 1.0 (JSR 303).
- Hibernate Validator 5.x triển khai Bean Validation 1.1 (JSR 349).
- Hibernate Validator 6.x triển khai Bean Validation 2.0 (JSR 380), sử dụng package `javax.validation`.
- Hibernate Validator 7.x và 8.x triển khai Jakarta Bean Validation 3.0, sử dụng package `jakarta.validation`; Hibernate Validator 9.x triển khai Jakarta Validation 3.1.

Sử dụng Bean Validation trong dự án Spring Boot rất thuận tiện, nhờ vào khả năng auto-configuration của Spring Boot. Về việc thêm dependency, cần lưu ý:

- Trong các phiên bản Spring Boot cũ hơn (thường là trước 2.3.x), dependency `spring-boot-starter-web` đã mặc định bao gồm hibernate-validator. Do đó, chỉ cần thêm Web Starter là không cần thêm dependency validation riêng.
- Bắt đầu từ phiên bản Spring Boot 2.3.x, để quản lý dependency chi tiết hơn, các dependency liên quan đến validation đã bị loại bỏ khỏi spring-boot-starter-web. Nếu dự án của bạn sử dụng các phiên bản này hoặc mới hơn và cần chức năng Bean Validation, bạn cần thêm tường minh dependency `spring-boot-starter-validation`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

![](https://oss.javaguide.cn/2021/03/c7bacd12-1c1a-4e41-aaaf-4cad840fc073.png)

Các dự án không phải Spring Boot cần tự thêm các dependency liên quan, ở đây không đi sâu vào chi tiết. Cụ thể có thể xem bài viết này của tôi: [Làm thế nào để thực hiện validation tham số trong Spring/Spring Boot? Mọi thứ bạn cần biết đều ở đây!](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485783&idx=1&sn=a407f3b75efa17c643407daa7fb2acd6&chksm=cea2469cf9d5cf8afbcd0a8a1c9cc4294d6805b8e01bee6f76bb2884c5bc15478e91459def49&token=292197051&lang=zh_CN#rd)。

👉 Cần lưu ý: Ưu tiên sử dụng các constraint annotation do đặc tả Bean Validation/Jakarta Validation cung cấp, thay vì các constraint riêng của Hibernate Validator. Spring Boot 2.x thường sử dụng `javax.validation.constraints`, Spring Boot 3.x trở lên sử dụng `jakarta.validation.constraints`.

### Một Số Annotation Validation Field Thường Dùng

Đặc tả Bean Validation và các implementation của nó (như Hibernate Validator) cung cấp annotation phong phú để định nghĩa quy tắc validation theo kiểu khai báo (declarative). Dưới đây là một số annotation thường dùng và mô tả của chúng:

- `@NotNull`: Kiểm tra phần tử được đánh dấu (bất kỳ kiểu nào) không được là `null`.
- `@NotEmpty`: Kiểm tra phần tử được đánh dấu (như `CharSequence`, `Collection`, `Map`, `Array`) không được là `null` và kích thước/độ dài của nó không được là 0. Lưu ý: Đối với chuỗi, `@NotEmpty` cho phép chuỗi chứa ký tự khoảng trắng, như `" "`.
- `@NotBlank`: Kiểm tra `CharSequence` được đánh dấu (như `String`) không được là `null`, và sau khi loại bỏ khoảng trắng đầu và cuối, độ dài phải lớn hơn 0 (tức là không được là chuỗi trắng).
- `@Null`: Kiểm tra phần tử được đánh dấu phải là `null`.
- `@AssertTrue` / `@AssertFalse`: Kiểm tra phần tử kiểu `boolean` hoặc `Boolean` được đánh dấu phải là `true` / `false`.
- `@Min(value)` / `@Max(value)`: Kiểm tra giá trị của kiểu số được đánh dấu (hoặc biểu diễn chuỗi của nó) phải lớn hơn hoặc bằng / nhỏ hơn hoặc bằng `value` được chỉ định. Áp dụng cho kiểu số nguyên (`byte`, `short`, `int`, `long`, `BigInteger`, v.v.).
- `@DecimalMin(value)` / `@DecimalMax(value)`: Chức năng tương tự `@Min` / `@Max`, nhưng áp dụng cho kiểu số chứa phần thập phân (`BigDecimal`, `BigInteger`, `CharSequence`, `byte`, `short`, `int`, `long` và các wrapper class của chúng). `value` phải là biểu diễn chuỗi của số.
- `@Size(min=, max=)`: Kiểm tra kích thước/độ dài của phần tử được đánh dấu (như `CharSequence`, `Collection`, `Map`, `Array`) phải nằm trong phạm vi `min` và `max` được chỉ định (bao gồm biên).
- `@Digits(integer=, fraction=)`: Kiểm tra giá trị của kiểu số được đánh dấu (hoặc biểu diễn chuỗi của nó), số chữ số phần nguyên phải ≤ `integer`, số chữ số phần thập phân phải ≤ `fraction`.
- `@Pattern(regexp=, flags=)`: Kiểm tra `CharSequence` được đánh dấu (như `String`) có khớp với biểu thức chính quy (`regexp`) được chỉ định hay không. `flags` có thể chỉ định chế độ khớp (như không phân biệt chữ hoa chữ thường).
- `@Email`: Kiểm tra `CharSequence` được đánh dấu (như `String`) có đúng định dạng Email hay không (tích hợp sẵn một regex tương đối lỏng).
- `@Past` / `@Future`: Kiểm tra kiểu ngày hoặc thời gian được đánh dấu (`java.util.Date`, `java.util.Calendar`, các kiểu trong package `java.time` của JSR 310) có trước / sau thời điểm hiện tại hay không.
- `@PastOrPresent` / `@FutureOrPresent`: Tương tự `@Past` / `@Future`, nhưng cho phép bằng với thời điểm hiện tại.
- ……

### Validate Request Body

Khi Controller method sử dụng annotation `@RequestBody` để nhận request body và bind vào một object, có thể thêm annotation `@Valid` trước tham số đó để kích hoạt validation đối với object. Nếu validation thất bại, nó sẽ ném ra `MethodArgumentNotValidException`.

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @NotNull(message = "classId 不能为空")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name 不能为空")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "sex 值不在可选范围")
    @NotNull(message = "sex 不能为空")
    private String sex;

    @Email(message = "email 格式不正确")
    @NotNull(message = "email 不能为空")
    private String email;
}


@RestController
@RequestMapping("/api")
public class PersonController {
    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

### Validate Request Parameters (Path Variables và Request Parameters)

Đối với dữ liệu kiểu đơn giản được ánh xạ trực tiếp vào tham số method (như path variable `@PathVariable` hoặc request parameter `@RequestParam`), cách validation sẽ khác nhau tùy theo phiên bản Spring Framework:

1. **Spring Framework 6.1 trở lên**: Spring MVC tích hợp sẵn Handler Method Validation. Đặt trực tiếp các constraint annotation như `@Min`, `@Max`, `@Size`, `@Pattern` lên tham số method, không thêm `@Validated` trên Controller class, nếu không sẽ chuyển sang sử dụng method validation dựa trên AOP.
2. **Spring Framework 6.0 trở về trước**: Thường cần thêm `@Validated` (do Spring cung cấp) trên Controller class, xử lý constraint của tham số thông qua hạ tầng method validation.

Dưới đây là ví dụ sử dụng cách validation tích hợp sẵn của Spring Framework 6.1 trở lên:

```java
@RestController
@RequestMapping("/api")
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(
            @PathVariable("id")
            @Max(value = 5, message = "ID 不能超过 5")
            Integer id
    ) {
        // Spring MVC 6.1+ sẽ ném ra HandlerMethodValidationException trước khi vào method body.
        return ResponseEntity.ok().body(id);
    }

    @GetMapping("/person")
    public ResponseEntity<String> findPersonByName(
            @RequestParam("name")
            @NotBlank(message = "姓名不能为空") // Tương tự áp dụng cho @RequestParam
            @Size(max = 10, message = "姓名长度不能超过 10")
            String name
    ) {
        return ResponseEntity.ok().body("Found person: " + name);
    }
}
```

## Global Exception Handling

Giới thiệu về global exception handling cho Controller layer - thứ không thể thiếu trong dự án Spring.

**Các annotation liên quan:**

1. `@ControllerAdvice` : Annotation định nghĩa class xử lý ngoại lệ toàn cục (global exception handler)
2. `@ExceptionHandler` : Annotation khai báo phương thức xử lý ngoại lệ

Sử dụng như thế nào? Hãy lấy ví dụ từ phần data validation ở mục 5. Nếu tham số method không hợp lệ sẽ ném ra `MethodArgumentNotValidException`, chúng ta sẽ xử lý ngoại lệ này.

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    /**
     * Xử lý ngoại lệ tham số request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
       ......
    }
}
```

Để biết thêm về xử lý ngoại lệ trong Spring Boot, vui lòng xem hai bài viết này của tôi:

1. [Một số cách phổ biến để xử lý ngoại lệ trong Spring Boot](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=2133161636&lang=zh_CN#rd)
2. [Sử dụng enum để đóng gói một cách đơn giản một Global Exception Handler thanh lịch cho Spring Boot!](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486379&idx=2&sn=48c29ae65b3ed874749f0803f0e4d90e&chksm=cea24460f9d5cd769ed53ad7e17c97a7963a89f5350e370be633db0ae8d783c3a3dbd58c70f8&token=1054498516&lang=zh_CN#rd)

## Transaction

Chỉ cần thêm annotation `@Transactional` trên method muốn bật transaction!

```java
@Transactional(rollbackFor = Exception.class)
public void save() {
  ......
}

```

Chúng ta biết rằng Exception được chia thành runtime exception RuntimeException và non-runtime exception. Trong annotation `@Transactional`, nếu không cấu hình thuộc tính `rollbackFor`, thì transaction sẽ chỉ rollback khi gặp `RuntimeException`. Thêm `rollbackFor=Exception.class` có thể khiến transaction rollback ngay cả khi gặp non-runtime exception.

Annotation `@Transactional` thường có thể được áp dụng trên `class` hoặc `method`.

- **Áp dụng trên class**: Khi đặt `@Transactional` trên class, điều đó có nghĩa là tất cả các public method của class đó đều được cấu hình với cùng thông tin thuộc tính transaction.
- **Áp dụng trên method**: Khi class đã được cấu hình `@Transactional` và method cũng được cấu hình `@Transactional`, transaction của method sẽ ghi đè (override) thông tin cấu hình transaction của class.

Để biết thêm về Spring transaction, vui lòng xem bài viết này của tôi: [Có lẽ là bài giải thích chi tiết nhất về Spring Transaction Management](./spring-transaction.md) 。

## JPA

Spring Data JPA cung cấp một loạt annotation và chức năng, giúp developer dễ dàng triển khai ORM (Object-Relational Mapping).

### Tạo Bảng

`@Entity` được dùng để khai báo một class là JPA entity class, ánh xạ với bảng trong database. `@Table` chỉ định tên bảng tương ứng với entity.

```java
@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // 省略 getter/setter
}
```

### Chiến Lược Sinh Khóa Chính (Primary Key Generation Strategy)

`@Id` khai báo field là khóa chính. `@GeneratedValue` chỉ định chiến lược sinh khóa chính.

Jakarta Persistence 3.1 cung cấp 5 chiến lược sinh khóa chính:

- **`GenerationType.TABLE`**: Sinh khóa chính thông qua bảng database.
- **`GenerationType.SEQUENCE`**: Sinh khóa chính thông qua database sequence (phù hợp với Oracle và các database khác).
- **`GenerationType.IDENTITY`**: Khóa chính tự tăng (auto-increment) (phù hợp với MySQL và các database khác).
- **`GenerationType.UUID`**: Sinh RFC 4122 UUID, phù hợp với khóa chính kiểu `UUID` hoặc `String`.
- **`GenerationType.AUTO`**: JPA tự động chọn chiến lược sinh phù hợp (chiến lược mặc định).

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

Khai báo chiến lược sinh khóa chính tùy chỉnh thông qua `@GenericGenerator`:

```java
@Id
@GeneratedValue(generator = "IdentityIdGenerator")
@GenericGenerator(name = "IdentityIdGenerator", strategy = "identity")
private Long id;
```

Tương đương với:

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

Dưới đây là đoạn trích mã nguồn nội bộ của Hibernate phiên bản cũ, hiển thị các chiến lược generator dạng chuỗi được Hibernate hỗ trợ vào thời điểm đó. Nó không thuộc về API chuẩn JPA/Jakarta Persistence, cũng không thể thay thế enum `GenerationType` chuẩn ở trên; dự án mới nên tham khảo tài liệu chính thức của phiên bản Hibernate đang sử dụng.

```java
public class DefaultIdentifierGeneratorFactory
    implements MutableIdentifierGeneratorFactory, Serializable, ServiceRegistryAwareService {

  @SuppressWarnings("deprecation")
  public DefaultIdentifierGeneratorFactory() {
    register( "uuid2", UUIDGenerator.class );
    register( "guid", GUIDGenerator.class );      // can be done with UUIDGenerator + strategy
    register( "uuid", UUIDHexGenerator.class );      // "deprecated" for new use
    register( "uuid.hex", UUIDHexGenerator.class );   // uuid.hex is deprecated
    register( "assigned", Assigned.class );
    register( "identity", IdentityGenerator.class );
    register( "select", SelectGenerator.class );
    register( "sequence", SequenceStyleGenerator.class );
    register( "seqhilo", SequenceHiLoGenerator.class );
    register( "increment", IncrementGenerator.class );
    register( "foreign", ForeignGenerator.class );
    register( "sequence-identity", SequenceIdentityGenerator.class );
    register( "enhanced-sequence", SequenceStyleGenerator.class );
    register( "enhanced-table", TableGenerator.class );
  }

  public void register(String strategy, Class generatorClass) {
    LOG.debugf( "Registering IdentifierGenerator strategy [%s] -> [%s]", strategy, generatorClass.getName() );
    final Class previous = generatorStrategyToClassNameMap.put( strategy, generatorClass );
    if ( previous != null ) {
      LOG.debugf( "    - overriding [%s]", previous.getName() );
    }
  }

}
```

### Field Mapping

`@Column` được dùng để chỉ định mối quan hệ ánh xạ giữa entity field và cột database.

- **`name`**: Chỉ định tên cột database.
- **`nullable`**: Chỉ định có cho phép `null` hay không.
- **`length`**: Đặt độ dài của field (chỉ áp dụng cho kiểu `String`).
- **`columnDefinition`**: Chỉ định kiểu database và giá trị mặc định của field.

```java
@Column(name = "user_name", nullable = false, length = 32)
private String userName;

@Column(columnDefinition = "tinyint(1) default 1")
private Boolean enabled;
```

### Bỏ Qua Field

`@Transient` được dùng để khai báo field không cần persistence.

```java
@Entity
public class User {

    @Transient
    private String temporaryField; // Sẽ không được ánh xạ vào bảng database
}
```

Các cách khác để field không bị persistence:

- **`static`**: Static field sẽ không bị persistence.
- **`final`**: Final field sẽ không bị persistence.
- **`transient`**: Field được khai báo bằng từ khóa `transient` của Java sẽ không bị serialization hoặc persistence.

### Lưu Trữ Field Lớn

`@Lob` được dùng để khai báo field lớn (như `CLOB` hoặc `BLOB`).

```java
@Lob
@Column(name = "content", columnDefinition = "LONGTEXT NOT NULL")
private String content;
```

### Ánh Xạ Kiểu Enum

`@Enumerated` được dùng để ánh xạ kiểu enum thành field database.

- **`EnumType.ORDINAL`**: Lưu trữ số thứ tự (ordinal) của enum (mặc định).
- **`EnumType.STRING`**: Lưu trữ tên của enum (khuyến nghị).

```java
public enum Gender {
    MALE,
    FEMALE
}

@Entity
public class User {

    @Enumerated(EnumType.STRING)
    private Gender gender;
}
```

Giá trị được lưu trữ trong database là `MALE` hoặc `FEMALE`.

### Chức Năng Audit

Thông qua chức năng audit của JPA, có thể tự động ghi lại thông tin như thời gian tạo, thời gian cập nhật, người tạo và người cập nhật trong entity.

Base class cho audit:

```java
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}
```

Cấu hình chức năng audit:

```java
@Configuration
@EnableJpaAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }
}
```

Giới thiệu đơn giản về một số annotation liên quan ở trên:

1. `@CreatedDate`: Biểu thị field này là field thời gian tạo, khi entity này được insert, sẽ được đặt giá trị.
2. `@CreatedBy`: Biểu thị field này là người tạo, khi entity này được insert, sẽ được đặt giá trị. `@LastModifiedDate`, `@LastModifiedBy` tương tự.
3. `@EnableJpaAuditing`: Kích hoạt chức năng audit của JPA.

### Thao Tác Sửa và Xóa

`@Modifying` được dùng để đánh dấu câu lệnh được khai báo bởi `@Query` là thao tác sửa đổi như INSERT, UPDATE, DELETE hoặc DDL. Các phương thức xóa dẫn xuất (derived delete method, ví dụ `deleteByUserName`) không cần `@Modifying`. Ranh giới transaction có thể được khai báo trên Repository method, hoặc được quản lý thống nhất bởi unit of work của Service tầng trên.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Modifying
    @Transactional
    @Query("delete from User user where user.userName = :userName")
    int deleteByUserName(@Param("userName") String userName);
}
```

### Quan Hệ Liên Kết (Association)

JPA cung cấp 4 loại annotation quan hệ liên kết:

- **`@OneToOne`**: Quan hệ một-một.
- **`@OneToMany`**: Quan hệ một-nhiều.
- **`@ManyToOne`**: Quan hệ nhiều-một.
- **`@ManyToMany`**: Quan hệ nhiều-nhiều.

```java
@Entity
public class User {

    @OneToOne
    private Profile profile;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

## Xử Lý Dữ Liệu JSON

Trong phát triển Web, thường xuyên cần xử lý chuyển đổi giữa Java object và định dạng JSON. Spring thường tích hợp thư viện Jackson để hoàn thành nhiệm vụ này. Dưới đây là một số Jackson annotation thường dùng, có thể giúp chúng ta tùy chỉnh quá trình serialize (Java object sang JSON) và deserialize (JSON sang Java object).

### Lọc Field JSON

Đôi khi chúng ta không muốn một số field của Java object được bao gồm trong JSON được tạo ra cuối cùng, hoặc không xử lý một số thuộc tính JSON khi chuyển đổi JSON thành Java object.

`@JsonIgnoreProperties` áp dụng trên class để lọc bỏ các field cụ thể, không trả về hoặc không parse.

```java
// Khi tạo JSON, bỏ qua thuộc tính userRoles
// Nếu cho phép thuộc tính không xác định (tức là thuộc tính có trong JSON nhưng không có trong class), có thể thêm ignoreUnknown = true
@JsonIgnoreProperties({"userRoles"})
public class User {
    private String userName;
    private String fullName;
    private String password;
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnore` áp dụng ở cấp độ field hoặc `getter/setter`, dùng để chỉ định bỏ qua thuộc tính cụ thể đó khi serialize hoặc deserialize.

```java
public class User {
    private String userName;
    private String fullName;
    private String password;

    // Khi tạo JSON, bỏ qua thuộc tính userRoles
    @JsonIgnore
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnoreProperties` phù hợp hơn khi loại trừ nhiều field một cách rõ ràng khi định nghĩa class, hoặc loại trừ field trong tình huống kế thừa; `@JsonIgnore` thì trực tiếp hơn để đánh dấu một field cụ thể đơn lẻ.

### Định Dạng Dữ Liệu JSON

`@JsonFormat` được dùng để chỉ định định dạng của thuộc tính khi serialize và deserialize. Thường được dùng để định dạng kiểu ngày giờ.

Ví dụ:

```java
// Chỉ định kiểu Date được serialize thành chuỗi định dạng ISO 8601, và đặt timezone là GMT
@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "GMT")
private Date date;
```

### Làm Phẳng (Flatten) JSON Object

Annotation `@JsonUnwrapped` áp dụng trên field, được dùng để "nâng" (promote) các thuộc tính của object lồng nhau lên cấp độ của object hiện tại khi serialize, và thực hiện thao tác ngược lại khi deserialize. Điều này có thể làm cho cấu trúc JSON phẳng hơn.

Giả sử có class `Account`, chứa hai object lồng nhau là `Location` và `PersonInfo`.

```java
@Getter
@Setter
@ToString
public class Account {
    private Location location;
    private PersonInfo personInfo;

  @Getter
  @Setter
  @ToString
  public static class Location {
     private String provinceName;
     private String countyName;
  }
  @Getter
  @Setter
  @ToString
  public static class PersonInfo {
    private String userName;
    private String fullName;
  }
}

```

Cấu trúc JSON trước khi làm phẳng:

```json
{
  "location": {
    "provinceName": "湖北",
    "countyName": "武汉"
  },
  "personInfo": {
    "userName": "coder1234",
    "fullName": "shaungkou"
  }
}
```

Sử dụng `@JsonUnwrapped` để làm phẳng object:

```java
@Getter
@Setter
@ToString
public class Account {
    @JsonUnwrapped
    private Location location;
    @JsonUnwrapped
    private PersonInfo personInfo;
    ......
}
```

Cấu trúc JSON sau khi làm phẳng:

```json
{
  "provinceName": "湖北",
  "countyName": "武汉",
  "userName": "coder1234",
  "fullName": "shaungkou"
}
```

## Testing

`@ActiveProfiles` thường được áp dụng trên test class, dùng để khai báo Spring profile đang có hiệu lực.

```java
// Chỉ định khởi động application context trên RANDOM_PORT, và kích hoạt "test" profile
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
public abstract class TestBase {
    // Common test setup or abstract methods...
}
```

`@Test` là annotation do JUnit framework cung cấp (thường là JUnit 5 Jupiter), dùng để đánh dấu một method là test method. Mặc dù không phải là annotation của chính Spring, nhưng nó là nền tảng để thực thi unit test và integration test.

Phương thức test có `@Transactional` được quản lý bởi Spring TestContext trong test thread sẽ mặc định rollback sau khi test kết thúc, tránh làm ô nhiễm dữ liệu test. Cần lưu ý, nếu sử dụng `RANDOM_PORT` để gửi HTTP request thực sự, quá trình xử lý ở phía server chạy trong một thread và transaction khác, sẽ không tự động rollback theo transaction của test thread, lúc này cần sử dụng database cô lập hoặc dọn dẹp dữ liệu tường minh.

`@WithMockUser` là annotation do Spring Security Test module cung cấp, dùng để mô phỏng (mock) một người dùng đã được xác thực trong quá trình test. Có thể thuận tiện chỉ định username, password, role (authorities) và các thông tin khác, từ đó test các endpoint hoặc method được bảo vệ bởi security.

```java
public class MyServiceTest extends TestBase { // Assuming TestBase provides Spring context

    @Test
    @Transactional // Dữ liệu test sẽ được rollback
    @WithMockUser(username = "test-user", authorities = { "ROLE_TEACHER", "read" }) // Mô phỏng người dùng tên "test-user", có role TEACHER và quyền read
    void should_perform_action_requiring_teacher_role() throws Exception {
        // ... Test logic ...
        // Ở đây có thể gọi service method yêu cầu quyền "ROLE_TEACHER"
    }
}
```

<!-- @include: @article-footer.snippet.md -->
