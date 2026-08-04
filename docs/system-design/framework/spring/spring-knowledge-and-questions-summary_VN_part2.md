### ⭐️Spring AOP và AspectJ AOP khác nhau như thế nào?

| Đặc điểm           | Spring AOP                                               | AspectJ                                    |
| ------------------ | -------------------------------------------------------- | ------------------------------------------ |
| **Cách tăng cường**   | Tăng cường khi chạy (runtime) - dựa trên dynamic proxy                               | Tăng cường khi biên dịch (compile-time), khi tải lớp (load-time) - thao tác trực tiếp bytecode |
| **Hỗ trợ pointcut** | Cấp phương thức (trong phạm vi Spring Bean, không hỗ trợ phương thức final và static) | Cấp phương thức, field, constructor, static method, v.v.           |
| **Hiệu năng**       | Runtime phụ thuộc proxy, có overhead nhất định, hiệu năng thấp hơn khi có nhiều aspect             | Runtime không có overhead proxy, hiệu năng cao hơn                 |
| **Độ phức tạp**     | Đơn giản, dễ dùng, phù hợp hầu hết kịch bản                               | Mạnh mẽ, nhưng tương đối phức tạp                       |
| **Kịch bản sử dụng**   | Nhu cầu AOP đơn giản trong ứng dụng Spring                         | Nhu cầu AOP hiệu năng cao, độ phức tạp cao                |

**Lựa chọn như thế nào?**

- **Cân nhắc về tính năng**: AspectJ hỗ trợ các kịch bản AOP phức tạp hơn, Spring AOP đơn giản và dễ dùng hơn. Nếu bạn cần tăng cường phương thức `final`, static method, truy cập field, gọi constructor, v.v., hoặc cần áp dụng logic tăng cường trên các object không được Spring quản lý, AspectJ là lựa chọn duy nhất.
- **Cân nhắc về hiệu năng**: Khi số lượng aspect ít, chênh lệch hiệu năng giữa hai bên không lớn, nhưng khi có nhiều aspect, AspectJ có hiệu năng tốt hơn.

**Tóm gọn một câu**: Kịch bản đơn giản ưu tiên dùng Spring AOP; kịch bản phức tạp hoặc có yêu cầu hiệu năng cao, chọn AspectJ.

### ⭐️Các loại advice phổ biến trong AOP là gì?

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/aspectj-advice-types.jpg)

- **Before** (advice trước): Kích hoạt trước khi phương thức của target object được gọi
- **After** (advice sau): Kích hoạt sau khi phương thức của target object được gọi
- **AfterReturning** (advice trả về): Kích hoạt sau khi phương thức của target object hoàn thành, sau khi trả về kết quả
- **AfterThrowing** (advice ngoại lệ): Kích hoạt sau khi phương thức của target object ném ra ngoại lệ trong quá trình chạy. AfterReturning và AfterThrowing loại trừ lẫn nhau. Nếu phương thức gọi thành công không có ngoại lệ, sẽ có giá trị trả về; nếu phương thức ném ra ngoại lệ, sẽ không có giá trị trả về.
- **Around** (advice bao quanh): Điều khiển theo lập trình việc gọi phương thức của target object. Around advice là loại có phạm vi thao tác lớn nhất trong tất cả các loại advice, vì nó có thể trực tiếp lấy target object và phương thức cần thực thi, do đó around advice có thể tùy ý thao tác trước và sau khi gọi phương thức của target object, thậm chí không gọi phương thức của target object

### Làm thế nào để kiểm soát thứ tự thực thi của nhiều aspect?

1. Thường dùng annotation `@Order` để định nghĩa trực tiếp thứ tự aspect

```java
// Giá trị càng nhỏ thì độ ưu tiên càng cao
@Order(3)
@Component
@Aspect
public class LoggingAspect implements Ordered {
```

**2. Triển khai interface `Ordered`, ghi đè phương thức `getOrder`.**

```java
@Component
@Aspect
public class LoggingAspect implements Ordered {

    // ....

    @Override
    public int getOrder() {
        // Giá trị trả về càng nhỏ thì độ ưu tiên càng cao
        return 1;
    }
}
```

## Spring MVC

### Bạn hiểu gì về Spring MVC?

MVC là viết tắt của Model (Mô hình), View (Giao diện), Controller (Bộ điều khiển), tư tưởng cốt lõi là tổ chức code bằng cách tách biệt logic nghiệp vụ, dữ liệu và hiển thị.

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

Trên mạng có nhiều người nói MVC không phải là design pattern, chỉ là quy phạm thiết kế phần mềm, cá nhân tôi nghiêng về quan điểm MVC cũng là một trong nhiều design pattern. Dự án **[java-design-patterns](https://github.com/iluwatar/java-design-patterns)** có giới thiệu liên quan về MVC.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/159b3d3e70dd45e6afa81bf06d09264e.png)

Để thực sự hiểu Spring MVC, trước tiên hãy cùng xem qua thời kỳ Model 1 và Model 2 - thời chưa có Spring MVC.

**Thời kỳ Model 1**

Nhiều bạn học Java backend muộn có thể chưa từng tiếp xúc với phát triển ứng dụng JavaWeb thời Model 1. Trong mô hình Model 1, toàn bộ ứng dụng Web gần như được tạo thành hoàn toàn từ các trang JSP, chỉ dùng một lượng nhỏ JavaBean để xử lý kết nối database, truy cập, v.v.

Trong mô hình này, JSP vừa là tầng điều khiển (Controller) vừa là tầng hiển thị (View). Rõ ràng, mô hình này tồn tại rất nhiều vấn đề. Ví dụ như logic điều khiển và logic hiển thị trộn lẫn vào nhau, dẫn đến tỷ lệ tái sử dụng code cực thấp; hay như frontend và backend phụ thuộc lẫn nhau, khó kiểm thử và bảo trì, hiệu suất phát triển cực thấp.

![mvc-mode1](https://oss.javaguide.cn/java-guide-blog/mvc-mode1.png)

**Thời kỳ Model 2**

Những bạn đã học Servlet và từng làm Demo liên quan chắc hẳn biết đến mô hình phát triển "Java Bean (Model) + JSP (View) + Servlet (Controller)", đây chính là mô hình phát triển JavaWeb MVC thời kỳ đầu.

- Model: Dữ liệu liên quan đến hệ thống, tức là dao và bean.
- View: Hiển thị dữ liệu trong model, chỉ dùng để hiển thị.
- Controller: Nhận yêu cầu của người dùng, gửi yêu cầu đến Model, cuối cùng trả dữ liệu về cho JSP và hiển thị cho người dùng

![](https://oss.javaguide.cn/java-guide-blog/mvc-model2.png)

Mô hình Model 2 vẫn còn tồn tại nhiều vấn đề, mức độ trừu tượng hóa và đóng gói của Model 2 còn chưa đủ, khi phát triển bằng Model 2 không tránh khỏi việc phát minh lại bánh xe, điều này làm giảm đáng kể khả năng bảo trì và tái sử dụng của chương trình.

Vì vậy, nhiều MVC framework liên quan đến phát triển JavaWeb đã ra đời như Struts2, nhưng Struts2 khá nặng nề.

**Thời kỳ Spring MVC**

Cùng với sự phổ biến của Spring framework nhẹ, hệ sinh thái Spring xuất hiện Spring MVC framework, Spring MVC là MVC framework xuất sắc nhất hiện nay. So với Struts2, Spring MVC sử dụng đơn giản và tiện lợi hơn, hiệu suất phát triển cao hơn, và Spring MVC chạy nhanh hơn.

MVC là một design pattern, Spring MVC là một MVC framework rất xuất sắc. Spring MVC có thể giúp chúng ta phát triển tầng Web gọn gàng hơn, và nó được tích hợp sẵn với Spring framework. Với Spring MVC, chúng ta thường chia dự án backend thành Service layer (xử lý nghiệp vụ), Dao layer (thao tác database), Entity layer (lớp thực thể), Controller layer (tầng điều khiển, trả dữ liệu về cho trang frontend).

### Các thành phần cốt lõi của Spring MVC là gì?

Ghi nhớ những thành phần dưới đây, bạn cũng sẽ ghi nhớ được nguyên lý hoạt động của Spring MVC.

- **`DispatcherServlet`**: **Bộ xử lý trung tâm cốt lõi**, chịu trách nhiệm nhận request, phân phối, và trả response cho client.
- **`HandlerMapping`**: **Bộ ánh xạ handler**, dựa vào URL để tìm và khớp `Handler` có thể xử lý, đồng thời đóng gói interceptor liên quan đến request cùng với `Handler`.
- **`HandlerAdapter`**: **Bộ chuyển đổi handler**, dựa vào `Handler` mà `HandlerMapping` tìm được, chuyển đổi và thực thi `Handler` tương ứng;
- **`Handler`**: **Bộ xử lý request**, handler xử lý request thực tế.
- **`ViewResolver`**: **Bộ phân giải view**, dựa vào logical view / view mà `Handler` trả về, phân giải và render view thực tế, rồi chuyển cho `DispatcherServlet` để response cho client

### ⭐️Bạn có hiểu nguyên lý hoạt động của Spring MVC không?

**Nguyên lý Spring MVC như hình dưới đây:**

> Tôi không tự vẽ sơ đồ nguyên lý hoạt động của Spring MVC, tôi trực tiếp tìm trên mạng một sơ đồ rất rõ ràng và trực quan, nguồn gốc không rõ.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/de6d2b213f112297298f3e223bf08f28.png)

**Mô tả luồng (quan trọng):**

1. Client (trình duyệt) gửi request, `DispatcherServlet` chặn request.
2. `DispatcherServlet` dựa vào thông tin request gọi `HandlerMapping`. `HandlerMapping` dựa vào URL để tìm và khớp `Handler` có thể xử lý (tức là `Controller` mà chúng ta thường nói), đồng thời đóng gói interceptor liên quan đến request cùng với `Handler`.
3. `DispatcherServlet` gọi `HandlerAdapter` để chuyển đổi và thực thi `Handler`.
4. `Handler` sau khi hoàn thành xử lý request của người dùng, sẽ trả về một object `ModelAndView` cho `DispatcherServlet`, `ModelAndView` đúng như tên gọi, chứa thông tin về data model và view tương ứng. `Model` là object dữ liệu trả về, `View` là một logical `View`.
5. `ViewResolver` sẽ dựa vào logical `View` để tìm `View` thực tế.
6. `DispatcherServlet` truyền `Model` trả về cho `View` (view rendering).
7. Trả `View` về cho bên yêu cầu (trình duyệt)

Luồng trên là nguyên lý hoạt động của mô hình phát triển truyền thống (JSP, Thymeleaf, v.v.). Tuy nhiên, phương thức phát triển chủ đạo hiện nay là tách biệt frontend và backend, trong trường hợp này, khái niệm `View` của Spring MVC có một số thay đổi. Vì `View` thường được xử lý bởi frontend framework (Vue, React, v.v.), backend không còn chịu trách nhiệm render trang nữa, mà chỉ chịu trách nhiệm cung cấp dữ liệu, do đó:

- Khi tách biệt frontend-backend, backend thường không trả về view cụ thể nữa, mà trả về **dữ liệu thuần** (thường là định dạng JSON), frontend chịu trách nhiệm render và hiển thị.
- Phần `View` trong kịch bản tách biệt frontend-backend thường không cần cài đặt, phương thức controller của Spring MVC chỉ cần trả về dữ liệu, không còn trả về `ModelAndView` nữa, mà trả về trực tiếp dữ liệu, Spring sẽ tự động chuyển đổi thành định dạng JSON. Tương ứng, `ViewResolver` cũng sẽ không còn được sử dụng.

Làm thế nào để thực hiện?

- Sử dụng annotation `@RestController` thay cho annotation `@Controller` truyền thống, như vậy tất cả phương thức mặc định sẽ trả về dữ liệu định dạng JSON, thay vì cố gắng phân giải view.
- Nếu bạn sử dụng `@Controller`, có thể kết hợp với annotation `@ResponseBody` để trả về JSON.

### Xử lý ngoại lệ thống nhất làm như thế nào?

Khuyến nghị sử dụng cách annotation để xử lý ngoại lệ thống nhất, cụ thể sẽ dùng hai annotation `@ControllerAdvice` + `@ExceptionHandler`.

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<?> handleAppException(BaseException ex, HttpServletRequest request) {
      //......
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<ErrorReponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
      //......
    }
}
```

Cách xử lý ngoại lệ này không phải là tạo AOP proxy cho `Controller`. Sau khi phương thức `Controller` ném ra ngoại lệ, Spring MVC sẽ thông qua chuỗi xử lý `HandlerExceptionResolver` để tìm phương thức `@ExceptionHandler` có thể xử lý ngoại lệ đó.

Phương thức `getMappedMethod` trong `ExceptionHandlerMethodResolver` quyết định ngoại lệ cụ thể được xử lý bởi phương thức nào được annotation `@ExceptionHandler`.

```java
@Nullable
  private Method getMappedMethod(Class<? extends Throwable> exceptionType) {
    List<Class<? extends Throwable>> matches = new ArrayList<>();
    //Tìm tất cả thông tin ngoại lệ có thể xử lý. mappedMethods lưu trữ mối quan hệ tương ứng giữa ngoại lệ và phương thức xử lý ngoại lệ
    for (Class<? extends Throwable> mappedException : this.mappedMethods.keySet()) {
      if (mappedException.isAssignableFrom(exceptionType)) {
        matches.add(mappedException);
      }
    }
    // Không rỗng nghĩa là có phương thức xử lý ngoại lệ
    if (!matches.isEmpty()) {
      // Sắp xếp theo mức độ khớp từ nhỏ đến lớn
      matches.sort(new ExceptionDepthComparator(exceptionType));
      // Trả về phương thức xử lý ngoại lệ
      return this.mappedMethods.get(matches.get(0));
    }
    else {
      return null;
    }
  }
```

Từ source code có thể thấy: **`getMappedMethod()` trước tiên sẽ tìm tất cả thông tin phương thức có thể khớp để xử lý ngoại lệ, sau đó sắp xếp chúng từ nhỏ đến lớn, cuối cùng lấy phương thức khớp nhỏ nhất (tức là phương thức có mức độ khớp cao nhất).**

## Những design pattern nào được sử dụng trong Spring framework?

> Về giới thiệu chi tiết các design pattern dưới đây, có thể xem bài viết [Spring Design Patterns](https://javaguide.cn/system-design/framework/spring/spring-design-patterns-summary.html) tôi đã viết.

- **Factory Design Pattern** : Spring sử dụng factory pattern thông qua `BeanFactory`, `ApplicationContext` để tạo bean object.
- **Proxy Design Pattern** : Triển khai chức năng Spring AOP.
- **Singleton Design Pattern** : Bean trong Spring mặc định đều là singleton.
- **Template Method Pattern** : Spring có các class thao tác database kết thúc bằng Template như `jdbcTemplate`, `hibernateTemplate`, chúng sử dụng template pattern.
- **Wrapper Design Pattern** : Dự án của chúng ta cần kết nối nhiều database, và các khách hàng khác nhau trong mỗi lần truy cập sẽ truy cập vào các database khác nhau tùy theo nhu cầu. Pattern này cho phép chúng ta linh hoạt chuyển đổi datasource khác nhau dựa trên nhu cầu của khách hàng.
- **Observer Pattern:** Spring event-driven model là một ứng dụng rất kinh điển của observer pattern.
- **Adapter Pattern** : Spring AOP enhancement/advice (Advice) sử dụng adapter pattern, trong Spring MVC cũng sử dụng adapter pattern để chuyển đổi `Controller`.
- ......

## ⭐️Spring Circular Dependency

### Bạn có hiểu về circular dependency trong Spring không, giải quyết như thế nào?

Circular dependency (phụ thuộc vòng) là việc Bean object tham chiếu vòng tròn, là hai hoặc nhiều Bean nắm giữ tham chiếu của nhau, ví dụ CircularDependencyA -> CircularDependencyB -> CircularDependencyA.

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyB circB;
}

@Component
public class CircularDependencyB {
    @Autowired
    private CircularDependencyA circA;
}
```

Tự phụ thuộc của một object đơn lẻ cũng sẽ xuất hiện circular dependency, nhưng xác suất này cực thấp, thuộc về lỗi viết code.

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyA circA;
}
```

Spring framework có thể giải quyết một phần circular dependency của Setter/field injection đối với singleton Bean thông qua cơ chế three-level cache. Constructor circular dependency, prototype Bean circular dependency và các kịch bản khác không thể dựa vào cơ chế này để giải quyết.

Three-level cache trong Spring thực chất là ba Map, như sau:

```java
// Level 1 cache
/** Cache of singleton objects: bean name to bean instance. */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

// Level 2 cache
/** Cache of early singleton objects: bean name to bean instance. */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

// Level 3 cache
/** Cache of singleton factories: bean name to ObjectFactory. */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
```

Nói một cách đơn giản, Spring three-level cache bao gồm:

1. **Level 1 cache (singletonObjects)**: Lưu trữ Bean ở trạng thái cuối cùng (đã instantiate, populate thuộc tính, initialize), singleton pool, sinh ra vì "singleton property của Spring". Thông thường chúng ta lấy Bean đều từ đây, nhưng không phải tất cả Bean đều nằm trong singleton pool, ví dụ prototype Bean thì không nằm trong đó.
2. **Level 2 cache (earlySingletonObjects)**: Lưu trữ Bean chuyển tiếp (bán thành phẩm, chưa populate thuộc tính), tức là object được sinh ra từ `ObjectFactory` trong level 3 cache, được sử dụng kết hợp với level 3 cache, có thể ngăn chặn trong trường hợp AOP, mỗi lần gọi `ObjectFactory#getObject()` đều sinh ra một proxy object mới.
3. **Level 3 cache (singletonFactories)**: Lưu trữ `ObjectFactory`, phương thức `getObject()` của `ObjectFactory` (cuối cùng gọi là phương thức `getEarlyBeanReference()`) có thể sinh ra raw Bean object hoặc proxy object (nếu Bean bị AOP aspect proxy). Level 3 cache chỉ có hiệu lực đối với singleton Bean.

Tiếp theo nói về quy trình tạo Bean của Spring:

1. Đầu tiên vào **level 1 cache `singletonObjects`** để lấy, nếu tồn tại thì trả về;
2. Nếu không tồn tại hoặc object đang trong quá trình tạo, thì vào **level 2 cache `earlySingletonObjects`** để lấy;
3. Nếu vẫn chưa lấy được, thì vào **level 3 cache `singletonFactories`** để lấy, thông qua việc thực thi `getObject()` của `ObjectFactory` là có thể lấy được object đó, sau khi lấy thành công, xóa khỏi level 3 cache, và thêm object đó vào level 2 cache.

Trong level 3 cache lưu trữ `ObjectFactory`:

```java
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}
```

Khi Spring tạo Bean, nếu cho phép circular dependency, Spring sẽ expose sớm Bean object vừa instantiate xong nhưng thuộc tính còn chưa khởi tạo xong, ở đây thông qua phương thức `addSingletonFactory`, thêm một `ObjectFactory` object vào level 3 cache:

```java
// AbstractAutowireCapableBeanFactory # doCreateBean #
public abstract class AbstractAutowireCapableBeanFactory ... {
    protected Object doCreateBean(...) {
        //...

        // Hỗ trợ circular dependency: thêm ()->getEarlyBeanReference như một ObjectFactory object vào level 3 cache
        addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }
}
```

Vậy thì ở trên khi nói về quy trình tạo Bean của Spring đã nói, nếu level 1 cache, level 2 cache đều không lấy được object, sẽ vào level 3 cache thông qua phương thức `getObject` của `ObjectFactory` để lấy object.

```java
class A {
    // Sử dụng B
    private B b;
}
class B {
    // Sử dụng A
    private A a;
}
```

Lấy code circular dependency ở trên làm ví dụ, toàn bộ quy trình giải quyết circular dependency như sau:

- Khi Spring tạo A xong, phát hiện A phụ thuộc vào B, lại đi tạo B, B phụ thuộc vào A, lại đi tạo A;
- Khi B tạo A, thì lúc này A đã xảy ra circular dependency, vì A lúc này vẫn chưa khởi tạo hoàn thành, do đó trong **level 1 và level 2 cache** chắc chắn không có A;
- Vậy thì lúc này vào level 3 cache gọi phương thức `getObject()` để lấy **early exposed object** của A, tức là gọi phương thức `getEarlyBeanReference()` đã thêm vào ở trên, sinh ra một **early exposed object** của A;
- Sau đó xóa `ObjectFactory` này khỏi level 3 cache, và đưa early exposed object vào level 2 cache, vậy thì B sẽ inject early exposed object này vào dependency, để hỗ trợ circular dependency.

**Chỉ dùng hai level cache có đủ không?** Trong trường hợp không có AOP, quả thực có thể chỉ dùng level 1 và level 2 cache để giải quyết vấn đề circular dependency. Tuy nhiên, khi liên quan đến AOP, level 3 cache trở nên rất quan trọng, vì nó đảm bảo ngay cả khi trong quá trình tạo Bean có nhiều lần yêu cầu early reference, cũng luôn chỉ trả về cùng một proxy object, từ đó tránh được vấn đề cùng một Bean có nhiều proxy object.

**Tóm tắt cuối cùng về cách Spring giải quyết bằng three-level cache**:

Về phần three-level cache, chủ yếu ghi nhớ cách Spring hỗ trợ circular dependency là được, tức là nếu xảy ra circular dependency, thì vào **level 3 cache `singletonFactories`** lấy `ObjectFactory` được lưu trữ trong level 3 cache và gọi phương thức `getObject()` của nó để lấy early exposed object của object phụ thuộc vòng này (tuy chưa khởi tạo hoàn thành, nhưng có thể lấy được địa chỉ lưu trữ của object đó trong heap), và đưa early exposed object này vào level 2 cache, như vậy khi circular dependency, sẽ không bị khởi tạo lặp lại!

Tuy nhiên, cơ chế này cũng có một số nhược điểm, ví dụ như tăng memory overhead (cần duy trì three-level cache, tức là ba Map), giảm hiệu năng (cần thực hiện nhiều lần kiểm tra và chuyển đổi). Nó chỉ áp dụng cho một phần circular dependency của Setter/field injection đối với singleton Bean, các kịch bản như non-singleton Bean, constructor circular dependency vẫn không thể giải quyết thông qua three-level cache.

### @Lazy có thể giải quyết circular dependency không?

`@Lazy` dùng để đánh dấu class có cần lazy loading hay không, có thể áp dụng trên class, phương thức, constructor, tham số phương thức, biến thành viên.

Spring Boot 2.2 đã thêm **global lazy loading property**, sau khi bật, toàn bộ bean được đặt thành lazy loading, chỉ tạo khi cần.

Cấu hình global lazy loading trong file cấu hình:

```properties
#Mặc định false
spring.main.lazy-initialization=true
```

Cách code để cài đặt global lazy loading:

```java
SpringApplication springApplication=new SpringApplication(Start.class);
springApplication.setLazyInitialization(true);
springApplication.run(args);
```

Nếu không cần thiết, hạn chế dùng global lazy loading. Global lazy loading sẽ khiến Bean tải chậm hơn khi sử dụng lần đầu, và nó sẽ trì hoãn việc phát hiện vấn đề của ứng dụng (khi Bean được khởi tạo, vấn đề mới xuất hiện).

Nếu một Bean không được đánh dấu là lazy loading, thì nó sẽ được tạo và khởi tạo trong quá trình Spring IoC container khởi động. Nếu một Bean được đánh dấu là lazy loading, thì nó sẽ không được instantiate ngay khi Spring IoC container khởi động, mà chỉ được tạo khi lần đầu tiên được request. Điều này có thể giúp giảm thời gian khởi tạo khi ứng dụng khởi động, cũng có thể dùng để giải quyết vấn đề circular dependency.

Vấn đề circular dependency được giải quyết như thế nào thông qua `@Lazy`? Lấy một ví dụ ở đây, giả sử có hai Bean, A và B, giữa chúng xảy ra circular dependency, có thể thêm `@Lazy` vào injection point của A đối với B, ví dụ như tham số constructor `A(@Lazy B b)`. Lúc này, cái được trì hoãn phân giải là dependency B, chứ không phải đơn giản là đánh dấu `@Lazy` trên constructor hoặc kiểu của A.

- Đầu tiên Spring sẽ đi tạo Bean của A, khi tạo cần inject thuộc tính B;
- Vì trên injection point của A đối với B được đánh dấu `@Lazy`, do đó Spring sẽ tạo một lazy resolution proxy object của B, và inject proxy object vào A;
- Sau đó bắt đầu thực hiện instantiate, initialize B, khi inject thuộc tính A trong B, lúc này A đã được tạo xong, có thể inject A vào.

Từ quy trình loading ở trên có thể thấy: điểm mấu chốt để `@Lazy` giải quyết circular dependency nằm ở việc sử dụng proxy object.

- **Trường hợp không có `@Lazy`**: Khi Spring container khởi tạo `A`, sẽ ngay lập tức cố gắng tạo `B`, và trong quá trình tạo `B` lại cố gắng tạo `A`, cuối cùng dẫn đến circular dependency (tức là đệ quy vô hạn, cuối cùng ném ra ngoại lệ).
- **Trường hợp sử dụng `@Lazy`**: Spring sẽ không tạo `B` ngay lập tức, mà sẽ inject một proxy object của `B`. Vì lúc này `B` vẫn chưa được thực sự khởi tạo, việc khởi tạo `A` có thể hoàn thành thuận lợi. Đến khi instance `A` thực sự gọi phương thức của `B`, proxy object mới kích hoạt việc khởi tạo thực sự của `B`.

`@Lazy` injection point proxy có thể phá vỡ chuỗi circular dependency ở một mức độ nhất định, bao gồm một số kịch bản constructor injection. Nhưng điều này không phải là loại bỏ circular dependency từ thiết kế, trong các mối quan hệ phụ thuộc phức tạp cũng có thể phát sinh các vấn đề khởi tạo khó phát hiện hơn, do đó best practice vẫn là cố gắng tránh circular dependency trong thiết kế.

### Spring Boot có cho phép circular dependency xảy ra không?

Spring Boot trước phiên bản 2.6.x mặc định cho phép circular dependency, tức là code của bạn xuất hiện vấn đề circular dependency, thông thường cũng sẽ không báo lỗi. Spring Boot từ 2.6.x trở đi, chính thức không còn khuyến nghị viết code tồn tại circular dependency, khuyến nghị developer tự giảm bớt sự phụ thuộc lẫn nhau không cần thiết khi viết code. Đây thực sự cũng là điều chúng ta nên làm nhất, circular dependency bản thân đã là một khiếm khuyết thiết kế, chúng ta không nên quá phụ thuộc vào Spring mà bỏ qua quy phạm và chất lượng code, biết đâu một phiên bản Spring Boot nào đó trong tương lai sẽ cấm hoàn toàn code circular dependency.

Spring Boot từ 2.6.x trở đi, nếu bạn không muốn refactor code circular dependency, cũng có thể áp dụng những cách sau:

- Thiết lập cho phép circular dependency trong file cấu hình toàn cục: `spring.main.allow-circular-references=true`. Cách đơn giản thô bạo nhất, không quá khuyến khích.
- Thêm annotation `@Lazy` trên Bean gây ra circular dependency, đây là một cách tương đối được khuyến khích. `@Lazy` dùng để đánh dấu class có cần lazy loading hay không, có thể áp dụng trên class, phương thức, constructor, tham số phương thức, biến thành viên.
- ......

## ⭐️Spring Transaction

Về giới thiệu chi tiết Spring Transaction, có thể xem bài viết [Spring Transaction](https://javaguide.cn/system-design/framework/spring/spring-transaction.html) tôi đã viết.

### Spring quản lý transaction có mấy cách?

- **Programmatic Transaction** (Giao dịch lập trình): Hardcode trong code (khuyến nghị sử dụng trong distributed system): Quản lý transaction thủ công thông qua `TransactionTemplate` hoặc `TransactionManager`, phạm vi transaction quá lớn sẽ xuất hiện tình trạng transaction chưa commit dẫn đến timeout, do đó transaction nên có granularity nhỏ hơn lock.
- **Declarative Transaction** (Giao dịch khai báo): Cấu hình trong file XML hoặc trực tiếp dựa trên annotation (khuyến nghị sử dụng trong monolithic application hoặc hệ thống nghiệp vụ đơn giản): Thực chất thông qua AOP để triển khai (dựa trên `@Transactional` full annotation được sử dụng nhiều nhất)

### Trong Spring Transaction có những loại transaction propagation behavior nào?

**Transaction propagation behavior là để giải quyết vấn đề transaction khi các phương thức trong business layer gọi lẫn nhau**.

Khi transaction method bị một transaction method khác gọi, phải chỉ định transaction nên được propagate như thế nào. Ví dụ: phương thức có thể tiếp tục chạy trong transaction hiện tại, hoặc có thể mở một transaction mới, và chạy trong transaction của chính nó.

Các giá trị có thể có của transaction propagation behavior đúng như sau:

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

Transaction propagation behavior được sử dụng nhiều nhất, annotation `@Transactional` chúng ta thường sử dụng mặc định dùng transaction propagation behavior này. Nếu hiện tại tồn tại transaction, thì tham gia transaction đó; nếu hiện tại không có transaction, thì tạo một transaction mới.

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

Tạo một transaction mới, nếu hiện tại tồn tại transaction, thì tạm ngưng transaction hiện tại. Tức là bất kể phương thức bên ngoài có mở transaction hay không, phương thức bên trong được `Propagation.REQUIRES_NEW` chỉ định sẽ mở transaction của riêng nó, và các transaction mở ra độc lập với nhau, không ảnh hưởng lẫn nhau.

**3.`TransactionDefinition.PROPAGATION_NESTED`**

Nếu hiện tại tồn tại transaction, thì tạo một transaction làm nested transaction của transaction hiện tại để chạy; nếu hiện tại không có transaction, thì giá trị này tương đương với `TransactionDefinition.PROPAGATION_REQUIRED`.

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

Nếu hiện tại tồn tại transaction, thì tham gia transaction đó; nếu hiện tại không có transaction, thì ném ra ngoại lệ. (mandatory: bắt buộc)

Loại này rất ít được sử dụng.

Ngoài ra 3 loại transaction propagation behavior cũng là cấu hình hợp lệ, cần hiểu dựa trên việc có tồn tại transaction bên ngoài hay không:

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**: Nếu hiện tại tồn tại transaction, thì tham gia transaction đó; nếu hiện tại không có transaction, thì tiếp tục chạy theo cách không có transaction.
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**: Chạy theo cách không có transaction, nếu hiện tại tồn tại transaction, thì tạm ngưng transaction hiện tại.
- **`TransactionDefinition.PROPAGATION_NEVER`**: Chạy theo cách không có transaction, nếu hiện tại tồn tại transaction, thì ném ra ngoại lệ.

### Trong Spring Transaction có những loại isolation level nào?

Giống như phần transaction propagation behavior, để thuận tiện sử dụng, Spring cũng định nghĩa một enum class tương ứng: `Isolation`

```java
public enum Isolation {

    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

    private final int value;

    Isolation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}
```

Dưới đây tôi lần lượt giới thiệu từng loại transaction isolation level:

- **`TransactionDefinition.ISOLATION_DEFAULT`** : Sử dụng isolation level mặc định của backend database, MySQL mặc định sử dụng isolation level `REPEATABLE_READ`, Oracle mặc định sử dụng isolation level `READ_COMMITTED`.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** : Isolation level thấp nhất, rất ít sử dụng isolation level này, vì nó cho phép đọc dữ liệu thay đổi chưa được commit, **có thể dẫn đến dirty read, phantom read hoặc non-repeatable read**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : Cho phép đọc dữ liệu đã được commit của transaction đồng thời, **có thể ngăn chặn dirty read, nhưng phantom read hoặc non-repeatable read vẫn có thể xảy ra**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : Kết quả đọc nhiều lần của cùng một field đều nhất quán, trừ khi dữ liệu bị chính transaction đó sửa đổi, **có thể ngăn chặn dirty read và non-repeatable read, nhưng phantom read vẫn có thể xảy ra.**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : Isolation level cao nhất, hoàn toàn tuân thủ isolation level ACID. Tất cả transaction được thực thi lần lượt từng cái một, như vậy giữa các transaction hoàn toàn không thể gây nhiễu lẫn nhau, tức là, **level này có thể ngăn chặn dirty read, non-repeatable read cũng như phantom read**. Nhưng điều này sẽ ảnh hưởng nghiêm trọng đến hiệu năng của chương trình. Thông thường cũng không sử dụng đến level này.

### Bạn có hiểu về annotation @Transactional(rollbackFor = Exception.class) không?

`Exception` được chia thành runtime exception `RuntimeException` và non-runtime exception. Transaction management đối với enterprise application là cực kỳ quan trọng, ngay cả khi xuất hiện tình huống ngoại lệ, nó cũng có thể đảm bảo tính nhất quán của dữ liệu.

Khi annotation `@Transactional` áp dụng trên class, tất cả public method của class đó sẽ có transaction attribute của loại đó, đồng thời, chúng ta cũng có thể sử dụng annotation này ở method level để ghi đè định nghĩa ở class level.

Annotation `@Transactional` mặc định rollback strategy là chỉ rollback transaction khi gặp `RuntimeException` (runtime exception) hoặc `Error`, mà không rollback `Checked Exception` (checked exception). Điều này là vì Spring cho rằng `RuntimeException` và Error là lỗi không lường trước được, còn checked exception là lỗi có thể lường trước, có thể xử lý thông qua business logic.

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/spring-transactional-rollbackfor.png)

Nếu muốn sửa đổi rollback strategy mặc định, có thể sử dụng thuộc tính `rollbackFor` và `noRollbackFor` của annotation `@Transactional` để chỉ định những exception nào cần rollback, những exception nào không cần rollback. Ví dụ, nếu muốn tất cả exception đều rollback transaction, có thể sử dụng annotation như sau:

```java
@Transactional(rollbackFor = Exception.class)
public void someMethod() {
// some business logic
}
```

Nếu muốn một số exception cụ thể không rollback transaction, có thể sử dụng annotation như sau:

```java
@Transactional(noRollbackFor = CustomException.class)
public void someMethod() {
// some business logic
}
```

## Spring Data JPA

JPA điều quan trọng là thực chiến, ở đây chỉ tổng kết một phần nhỏ kiến thức.

### Làm thế nào để dùng JPA không persist một field trong database?

Giả sử chúng ta có class dưới đây:

```java
@Entity(name="USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Column(name="USER_NAME")
    private String userName;

    @Column(name="PASSWORD")
    private String password;

    private String secrect;

}
```

Nếu chúng ta muốn field `secrect` này không bị persist, tức là không được lưu trong database thì làm thế nào? Chúng ta có thể áp dụng các cách sau:

```java
static String transient1; // không persist vì là static
final String transient2 = "Satish"; // không persist vì là final
transient String transient3; // không persist vì là transient
@Transient
String transient4; // không persist vì @Transient
```

Thường sử dụng hai cách sau nhiều hơn, cá nhân tôi sử dụng cách annotation nhiều hơn.

### Chức năng audit của JPA dùng để làm gì? Có tác dụng gì?

Chức năng audit chủ yếu giúp chúng ta ghi lại hành vi thao tác database cụ thể, ví dụ như một record được tạo bởi ai, thời gian tạo, người sửa đổi cuối cùng là ai, thời gian sửa đổi cuối cùng là khi nào.

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
@EntityListeners(value = AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    @JsonIgnore
    private Instant createdAt;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    @JsonIgnore
    private String createdBy;

    @LastModifiedBy
    @JsonIgnore
    private String updatedBy;
}
```

- `@CreatedDate`: Chỉ định field này là field thời gian tạo, khi entity này được insert, sẽ được set giá trị

- `@CreatedBy`: Chỉ định field này là người tạo, khi entity này được insert, sẽ được set giá trị

  `@LastModifiedDate`, `@LastModifiedBy` tương tự.

### Các annotation quan hệ liên kết giữa các entity là gì?

- `@OneToOne` : Một-một.
- `@ManyToMany`：Nhiều-nhiều.
- `@OneToMany` : Một-nhiều.
- `@ManyToOne`：Nhiều-một.

Sử dụng `@ManyToOne` và `@OneToMany` cũng có thể biểu đạt quan hệ liên kết nhiều-nhiều.

## Spring Security

Spring Security điều quan trọng là thực chiến, ở đây chỉ tổng kết một phần nhỏ kiến thức.

### Có những phương thức nào để kiểm soát quyền truy cập request?

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/image-20220728201854641.png)

- `permitAll()`：Cho phép vô điều kiện bất kỳ hình thức truy cập nào, bất kể bạn đã đăng nhập hay chưa.
- `anonymous()`：Cho phép truy cập ẩn danh, tức là chỉ khi chưa đăng nhập mới có thể truy cập.
- `denyAll()`：Từ chối vô điều kiện bất kỳ hình thức truy cập nào.
- `authenticated()`：Chỉ cho phép người dùng đã xác thực truy cập.
- `fullyAuthenticated()`：Chỉ cho phép người dùng đã xác thực đầy đủ truy cập, không chấp nhận anonymous authentication hoặc remember-me authentication.
- `hasRole(String)` : Chỉ cho phép role được chỉ định truy cập.
- `hasAnyRole(String)` : Chỉ định một hoặc nhiều role, người dùng thỏa mãn một trong số đó là có thể truy cập.
- `hasAuthority(String)`：Chỉ cho phép người dùng có quyền hạn được chỉ định truy cập
- `hasAnyAuthority(String)`：Chỉ định một hoặc nhiều quyền hạn, người dùng thỏa mãn một trong số đó là có thể truy cập.
- `hasIpAddress(String)` : Chỉ cho phép người dùng có ip được chỉ định truy cập.

### hasRole và hasAuthority có khác nhau không?

Có thể xem bài viết này của anh Song: [Spring Security hasRole và hasAuthority có khác nhau không?](https://mp.weixin.qq.com/s/GTNOa2k9_n_H0w24upClRw), giới thiệu khá chi tiết.

### ⭐️Làm thế nào để mã hóa mật khẩu?

Nếu chúng ta cần lưu dữ liệu nhạy cảm như mật khẩu vào database, cần mã hóa trước bằng adaptive one-way hash function rồi mới lưu, thay vì sử dụng reversible encryption.

Spring Security cung cấp nhiều implementation của password encoding algorithm, dùng được ngay. Interface của các implementation class này là `PasswordEncoder`; nếu cần custom password encoding scheme, cũng cần implement interface `PasswordEncoder`.

Interface `PasswordEncoder` có hai abstract method bắt buộc phải implement là `encode()` và `matches()`, và một default method có thể ghi đè khi cần là `upgradeEncoding()`.

```java
public interface PasswordEncoder {
    // Mã hóa một chiều raw password
    String encode(CharSequence var1);
    // So sánh raw password và password được lưu trong database
    boolean matches(CharSequence var1, String var2);
    // Phán đoán encoded password có cần nâng cấp mã hóa không, mặc định trả về false
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

![](https://oss.javaguide.cn/github/javaguide/system-design/framework/spring/image-20220728183540954.png)

Chính thức khuyến nghị sử dụng adaptive one-way function có thể điều chỉnh work factor, và tinh chỉnh thời gian xác thực dựa trên hiệu năng hệ thống, ví dụ như bcrypt, PBKDF2, scrypt hoặc Argon2.

### Làm thế nào để thay đổi encryption algorithm hệ thống đang sử dụng một cách tinh tế?

Nếu trong quá trình phát triển, chúng ta đột nhiên phát hiện encryption algorithm hiện tại không đáp ứng được nhu cầu, cần thay đổi sang một encryption algorithm khác, lúc này nên làm thế nào?

Cách được khuyến nghị là thông qua `DelegatingPasswordEncoder` để tương thích nhiều password encryption scheme khác nhau, nhằm thích ứng với các nhu cầu nghiệp vụ khác nhau.

Từ cái tên cũng có thể thấy, `DelegatingPasswordEncoder` thực chất là một proxy class, không phải là một encryption algorithm hoàn toàn mới, việc nó làm là proxy các implementation class của encryption algorithm nói trên. Sau Spring Security 5.0, mặc định dựa trên `DelegatingPasswordEncoder` để thực hiện password encryption.

## Tham khảo

- 《Spring技术内幕》
- 《从零开始深入学习Spring》：<https://juejin.cn/book/6857911863016390663>
- <http://www.cnblogs.com/wmyskxz/p/8820371.html>
- <https://www.journaldev.com/2696/spring-interview-questions-and-answers>
- <https://www.edureka.co/blog/interview-questions/spring-interview-questions/>
- <https://www.cnblogs.com/clwydjgs/p/9317849.html>
- <https://howtodoinjava.com/interview-questions/top-spring-interview-questions-with-answers/>
- <http://www.tomaszezula.com/2014/02/09/spring-series-part-5-component-vs-bean/>
- <https://stackoverflow.com/questions/34172888/difference-between-bean-and-autowired>

<!-- @include: @article-footer.snippet.md -->