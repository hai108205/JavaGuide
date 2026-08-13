---
title: Giải thích chi tiết về Serialization trong Java
description: "Phân tích chuyên sâu về cơ chế serialization và deserialization trong Java: giải thích chi tiết về Serializable interface, transient keyword, vai trò của serialVersionUID, lựa chọn giao thức serialization và các tình huống ứng dụng như RPC, caching."
category: Java
tag:
  - Java基础
head:
  - - meta
    - name: keywords
      content: Java序列化,反序列化,Serializable接口,transient关键字,serialVersionUID,序列化协议,对象持久化
---

## Serialization và Deserialization là gì?

Nếu chúng ta cần lưu trữ lâu dài (persist) các đối tượng Java, chẳng hạn như lưu đối tượng Java vào file, hoặc truyền đối tượng Java qua mạng, thì những tình huống này đều cần sử dụng serialization.

Nói một cách đơn giản:

- **Serialization (Tuần tự hóa)**: Chuyển đổi cấu trúc dữ liệu hoặc đối tượng thành dạng có thể lưu trữ hoặc truyền tải, thường là luồng byte nhị phân, cũng có thể là các định dạng văn bản như JSON, XML.
- **Deserialization (Giải tuần tự hóa)**: Quá trình chuyển đổi dữ liệu được tạo ra trong quá trình serialization trở lại thành cấu trúc dữ liệu hoặc đối tượng ban đầu.

Đối với ngôn ngữ lập trình hướng đối tượng như Java, chúng ta serialize các đối tượng (Object), tức là các instance của class (lớp). Nhưng trong ngôn ngữ bán hướng đối tượng như C++, struct (cấu trúc) định nghĩa kiểu dữ liệu cấu trúc, còn class tương ứng với kiểu đối tượng.

Dưới đây là các tình huống ứng dụng phổ biến của serialization và deserialization:

- Đối tượng cần được serialize trước khi truyền qua mạng (ví dụ như gọi RPC - Remote Method Call), và sau khi nhận được đối tượng đã serialize thì cần deserialize trở lại;
- Cần serialize trước khi lưu đối tượng vào file, và deserialize khi đọc đối tượng từ file ra;
- Cần serialize trước khi lưu đối tượng vào cơ sở dữ liệu (như Redis), và deserialize khi đọc đối tượng từ cơ sở dữ liệu cache ra;
- Khi cần chuyển đổi đối tượng thành biểu diễn byte để lưu trữ lâu dài hoặc truyền qua các thành phần, thường cần serialization; các đối tượng Java thông thường khi sử dụng trong bộ nhớ JVM thì không cần serialization.

Wikipedia giới thiệu về serialization như sau:

> **Serialization** (tuần tự hóa) trong khoa học máy tính, về mặt xử lý dữ liệu, là quá trình chuyển đổi cấu trúc dữ liệu hoặc trạng thái đối tượng thành định dạng có thể sử dụng được (ví dụ như lưu vào file, lưu vào bộ đệm, hoặc gửi qua mạng), để sau này có thể khôi phục lại trạng thái ban đầu trong cùng hoặc một môi trường máy tính khác. Khi lấy lại kết quả byte theo định dạng serialization, có thể sử dụng nó để tạo ra bản sao có cùng ngữ nghĩa với đối tượng gốc. Đối với nhiều đối tượng, chẳng hạn như các đối tượng phức tạp sử dụng nhiều tham chiếu, quá trình tái tạo serialization này không hề dễ dàng. Serialization đối tượng trong lập trình hướng đối tượng không bao gồm các hàm mà đối tượng gốc liên quan. Quá trình này còn được gọi là object marshalling (biên dịch đối tượng). Thao tác ngược lại, trích xuất cấu trúc dữ liệu từ một chuỗi byte, là deserialization (còn gọi là unmarshalling, giải biên dịch).

Tóm lại: **Mục đích chính của serialization là chuyển đổi đối tượng thành biểu diễn phù hợp cho việc truyền qua mạng hoặc lưu trữ lâu dài vào file system, cơ sở dữ liệu, cache và các phương tiện khác.**

![](https://oss.javaguide.cn/github/javaguide/a478c74d-2c48-40ae-9374-87aacf05188c.png)

<p style="text-align:right;font-size:13px;color:gray">https://www.corejavaguru.com/java/serialization/interview-questions-1</p>

**Giao thức serialization tương ứng với tầng nào trong mô hình TCP/IP 4 tầng?**

Chúng ta biết rằng hai bên giao tiếp mạng phải áp dụng và tuân thủ cùng một giao thức. Mô hình TCP/IP 4 tầng như dưới đây, vậy giao thức serialization thuộc tầng nào?

1. Tầng ứng dụng (Application Layer)
2. Tầng vận chuyển (Transport Layer)
3. Tầng mạng (Network Layer)
4. Tầng giao diện mạng (Network Interface Layer)

![Mô hình TCP/IP 4 tầng](https://oss.javaguide.cn/github/javaguide/cs-basics/network/tcp-ip-4-model.png)

Như thể hiện trong hình trên, trong mô hình OSI 7 tầng, tầng trình bày (Presentation Layer) chủ yếu làm nhiệm vụ xử lý dữ liệu người dùng từ tầng ứng dụng và chuyển đổi thành luồng nhị phân. Ngược lại, nó chuyển đổi luồng nhị phân thành dữ liệu người dùng của tầng ứng dụng. Điều này chẳng phải tương ứng với serialization và deserialization sao?

Vì tầng ứng dụng, tầng trình bày và tầng phiên trong mô hình OSI 7 tầng đều tương ứng với tầng ứng dụng trong mô hình TCP/IP 4 tầng, nên giao thức serialization thuộc về một phần của tầng ứng dụng trong giao thức TCP/IP.

## Các giao thức serialization phổ biến

Cách serialization đi kèm với JDK thường không được sử dụng vì hiệu suất serialization thấp và tồn tại vấn đề bảo mật. Một số giao thức serialization thường dùng bao gồm Hessian, Kryo, Protobuf, ProtoStuff, đây đều là các giao thức serialization dựa trên nhị phân.

Các định dạng như JSON và XML thuộc về phương thức serialization dạng văn bản. Mặc dù khả năng đọc tốt hơn, nhưng hiệu suất kém, thường không được lựa chọn.

### Cách serialization đi kèm với JDK

Serialization đi kèm với JDK, chỉ cần implement interface `java.io.Serializable` là được.

```java
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class RpcRequest implements Serializable {
    private static final long serialVersionUID = 1905122041950251207L;
    private String requestId;
    private String interfaceName;
    private String methodName;
    private Object[] parameters;
    private Class<?>[] paramTypes;
    private RpcMessageTypeEnum rpcMessageTypeEnum;
}
```

**serialVersionUID có tác dụng gì?**

Số serialization `serialVersionUID` đóng vai trò kiểm soát phiên bản. Khi deserialize, JVM sẽ kiểm tra xem `serialVersionUID` trong luồng dữ liệu có khớp với `serialVersionUID` của class hiện tại hay không; nếu không khớp, nó sẽ ném ra `InvalidClassException`. Rất khuyến khích mỗi class serializable đều chỉ định thủ công `serialVersionUID` của nó. Nếu không khai báo rõ ràng, runtime serialization sẽ tính toán giá trị mặc định dựa trên cấu trúc của class, thay vì được compiler tạo ra trường này.

**serialVersionUID không phải được modifier bởi static sao? Tại sao nó vẫn được "serialize"?**

~~Biến được modifier bởi `static` là biến static, nằm trong method area, bản thân nó sẽ không bị serialize. Biến `static` thuộc về class chứ không phải đối tượng. Sau khi bạn deserialize, giá trị của biến `static` giống như được gán mặc định cho đối tượng, trông có vẻ như biến `static` bị serialize, nhưng thực ra chỉ là ảo giác mà thôi.~~

**🐛 Chỉnh sửa (xem thêm: [issue#2174](https://github.com/Snailclimb/JavaGuide/issues/2174))**:

Thông thường, biến `static` thuộc về class, không thuộc về bất kỳ instance đối tượng đơn lẻ nào, vì vậy bản thân chúng không được bao gồm trong luồng dữ liệu serialization của đối tượng. Serialization lưu trữ trạng thái của đối tượng (tức là giá trị của các biến instance). Tuy nhiên, `serialVersionUID` là một trường hợp đặc biệt, `serialVersionUID` được xử lý đặc biệt trong serialization. Điểm mấu chốt là, `serialVersionUID` không bị serialize như một phần trạng thái của đối tượng, mà được cơ chế serialization sử dụng như một "dấu vân tay" hoặc "số phiên bản" đặc biệt.

Khi một đối tượng được serialize, `serialVersionUID` sẽ được ghi vào luồng nhị phân serialization (giống như lưu một số phiên bản, chứ không phải lưu trạng thái của chính biến `static`); khi deserialize, nó cũng sẽ được phân tích và kiểm tra tính nhất quán, qua đó xác minh tính nhất quán phiên bản của đối tượng được serialize. Nếu cả hai không khớp, quá trình deserialize sẽ ném ra `InvalidClassException`, vì điều này thường có nghĩa là định nghĩa của class được serialize đã thay đổi và có thể không còn tương thích nữa.

Tài liệu chính thức giải thích như sau:

> A serializable class can declare its own serialVersionUID explicitly by declaring a field named `"serialVersionUID"` that must be `static`, `final`, and of type `long`;
>
> Nếu muốn chỉ định rõ ràng `serialVersionUID`, bạn cần sử dụng từ khóa `static` và `final` trong class để modifier một biến kiểu `long`, tên biến phải là `"serialVersionUID"`.

Nói cách khác, bản thân `serialVersionUID` (với tư cách là biến static) thực sự không bị serialize như trạng thái đối tượng. Tuy nhiên, giá trị của nó được cơ chế serialization của Java xử lý đặc biệt — được đọc và ghi vào luồng serialization như một định danh phiên bản, dùng để kiểm tra tính tương thích phiên bản khi deserialize.

**Nếu có một số trường (field) không muốn serialize thì phải làm sao?**

Đối với các biến không muốn serialize, bạn có thể sử dụng từ khóa `transient` để modifier.

Tác dụng của từ khóa `transient` là: ngăn chặn việc serialize các biến instance được modifier bởi từ khóa này; khi đối tượng được deserialize, giá trị của các biến được modifier bởi `transient` sẽ không được duy trì và khôi phục.

Về `transient` còn có một số lưu ý:

- `transient` chỉ có thể modifier biến, không thể modifier class và method.
- Biến được modifier bởi `transient`, sau khi deserialize, giá trị biến sẽ được đặt thành giá trị mặc định của kiểu dữ liệu. Ví dụ, nếu modifier kiểu `int`, thì sau khi deserialize kết quả sẽ là `0`.
- Biến `static` vì không thuộc về bất kỳ đối tượng (Object) nào, nên dù có modifier bởi từ khóa `transient` hay không, đều sẽ không bị serialize.

**Tại sao không khuyến khích sử dụng cách serialization đi kèm với JDK?**

Chúng ta hiếm khi, thậm chí gần như không bao giờ trực tiếp sử dụng cách serialization đi kèm với JDK, các lý do chính bao gồm:

- **Không hỗ trợ gọi cross-language**: Nếu gọi đến service được phát triển bằng ngôn ngữ khác thì sẽ không hỗ trợ.
- **Hiệu suất kém**: So với các framework serialization khác, hiệu suất thấp hơn, nguyên nhân chính là mảng byte sau khi serialize có kích thước lớn, dẫn đến chi phí truyền tải tăng cao.
- **Tồn tại vấn đề bảo mật**: Bản thân serialization và deserialization không có vấn đề gì. Nhưng khi dữ liệu đầu vào của deserialization có thể bị người dùng kiểm soát, thì attacker có thể tạo ra đầu vào độc hại, khiến deserialization tạo ra các đối tượng không mong muốn, trong quá trình đó thực thi mã tùy ý được tạo ra. Bài đọc liên quan: [应用安全:JAVA 反序列化漏洞之殇 - Cryin](https://cryin.github.io/blog/secure-development-java-deserialization-vulnerability/), [Java 反序列化安全漏洞怎么回事? - Monica](https://www.zhihu.com/question/37562657/answer/1916596031).

### Kryo

Kryo là một công cụ serialization/deserialization hiệu suất cao, nhờ vào đặc tính lưu trữ độ dài biến đổi (variable-length storage) và cơ chế sinh bytecode, nó có tốc độ chạy cao và kích thước bytecode nhỏ.

Ngoài ra, Kryo đã là một giải pháp serialization rất trưởng thành, được sử dụng rộng rãi tại Twitter, Groupon, Yahoo cũng như nhiều dự án open-source nổi tiếng (như Hive, Storm).

[guide-rpc-framework](https://github.com/Snailclimb/guide-rpc-framework) chính là sử dụng kryo để serialization, code liên quan đến serialization và deserialization như sau:

```java
/**
 * Kryo serialization class, Kryo serialization efficiency is very high, but only compatible with Java language
 *
 * @author shuang.kou
 * @createTime 2020年05月13日 19:29:00
 */
@Slf4j
public class KryoSerializer implements Serializer {

    /**
     * Because Kryo is not thread safe. So, use ThreadLocal to store Kryo objects
     */
    private final ThreadLocal<Kryo> kryoThreadLocal = ThreadLocal.withInitial(() -> {
        Kryo kryo = new Kryo();
        kryo.register(RpcResponse.class);
        kryo.register(RpcRequest.class);
        return kryo;
    });

    @Override
    public byte[] serialize(Object obj) {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             Output output = new Output(byteArrayOutputStream)) {
            Kryo kryo = kryoThreadLocal.get();
            // Object->byte:将对象序列化为byte数组
            kryo.writeObject(output, obj);
            kryoThreadLocal.remove();
            return output.toBytes();
        } catch (Exception e) {
            throw new SerializeException("Serialization failed");
        }
    }

    @Override
    public <T> T deserialize(byte[] bytes, Class<T> clazz) {
        try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
             Input input = new Input(byteArrayInputStream)) {
            Kryo kryo = kryoThreadLocal.get();
            // byte->Object:从byte数组中反序列化出对象
            Object o = kryo.readObject(input, clazz);
            kryoThreadLocal.remove();
            return clazz.cast(o);
        } catch (Exception e) {
            throw new SerializeException("Deserialization failed");
        }
    }

}
```

Địa chỉ GitHub: [https://github.com/EsotericSoftware/kryo](https://github.com/EsotericSoftware/kryo).

### Protobuf

Protobuf đến từ Google, hiệu suất khá tốt, cũng hỗ trợ nhiều ngôn ngữ, đồng thời còn cross-platform. Chỉ có điều khi sử dụng khá rườm rà, vì bạn cần tự định nghĩa file IDL và sinh code serialization tương ứng. Điều này tuy không linh hoạt, nhưng mặt khác, khiến protobuf không có rủi ro lỗ hổng serialization.

> Protobuf bao gồm định nghĩa định dạng serialization, thư viện cho nhiều ngôn ngữ khác nhau và một IDL compiler. Thông thường bạn cần định nghĩa file proto, sau đó dùng IDL compiler biên dịch thành ngôn ngữ bạn cần.

Một file proto đơn giản như sau:

```protobuf
// protobuf的版本
syntax = "proto3";
// SearchRequest会被编译成不同的编程语言的相应对象，比如Java中的class、Go中的struct
message Person {
  //string类型字段
  string name = 1;
  // int 类型字段
  int32 age = 2;
}
```

Địa chỉ GitHub: [https://github.com/protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf).

### ProtoStuff

Do Protobuf có tính dễ sử dụng kém, người anh em của nó là Protostuff đã ra đời.

Protostuff dựa trên Google protobuf, nhưng cung cấp nhiều chức năng hơn và cách sử dụng đơn giản hơn. Mặc dù dễ sử dụng hơn, nhưng không có nghĩa là ProtoStuff có hiệu suất kém hơn.

Địa chỉ GitHub: [https://github.com/protostuff/protostuff](https://github.com/protostuff/protostuff).

### Hessian

Hessian là một giao thức RPC nhị phân nhẹ, được mô tả tùy chỉnh. Hessian là một giải pháp serialization khá lâu đời và cũng cross-language.

![](https://oss.javaguide.cn/github/javaguide/8613ec4c-bde5-47bf-897e-99e0f90b9fa3.png)

Dubbo2.x mặc định sử dụng Hessian2 làm phương thức serialization, nhưng Dubbo đã có chỉnh sửa đối với Hessian2, tuy nhiên cấu trúc tổng thể vẫn tương tự.

### Tổng kết

Kryo là phương thức serialization chuyên dành cho ngôn ngữ Java và hiệu suất rất tốt, nếu ứng dụng của bạn chuyên dành cho ngôn ngữ Java thì có thể cân nhắc sử dụng. Hơn nữa, một bài viết trên trang web chính thức của Dubbo có đề cập rằng khuyến nghị sử dụng Kryo làm phương thức serialization cho môi trường production. (Địa chỉ bài viết: <https://cn.dubbo.apache.org/zh-cn/docsv2.7/user/serialization/>).

![](https://oss.javaguide.cn/github/javaguide/java/569e541a-22b2-4846-aa07-0ad479f07440-20230814090158124.png)

Các phương thức như Protobuf, ProtoStuff, Hessian đều là các phương thức serialization cross-language, nếu có nhu cầu cross-language thì có thể cân nhắc sử dụng.

Ngoài các phương thức serialization đã giới thiệu ở trên, còn có Thrift, Avro và các giải pháp khác.

<!-- @include: @article-footer.snippet.md -->
