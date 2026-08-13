---
title: Spring Transaction chi tiết
description: Hướng dẫn chi tiết về quản lý giao dịch (Transaction) trong Spring, bao gồm chú thích @Transactional, hành vi lan truyền giao dịch (Propagation), mức cô lập (Isolation), các tình huống transaction bị vô hiệu và quy tắc rollback.
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring事务,@Transactional,事务传播,隔离级别,事务失效,回滚规则,声明式事务,AOP事务
---

Bài phân tích tổng hợp về **Spring Transaction** mà tôi đã hứa với độc giả cuối cùng cũng hoàn thành. Phần nội dung này khá quan trọng, cả trong công việc lẫn phỏng vấn, nhưng tài liệu tham khảo chất lượng trên mạng lại khá ít.

## Transaction là gì?

**Transaction (giao dịch) là một nhóm các thao tác logic, hoặc tất cả đều được thực thi, hoặc không thực thi thao tác nào.**

Chắc hẳn mọi người đều thuộc lòng câu định nghĩa trên rồi, sau đây tôi sẽ kết hợp với thực tế phát triển hàng ngày của chúng ta để bàn luận thêm.

Mỗi phương thức nghiệp vụ trong hệ thống của chúng ta có thể bao gồm nhiều thao tác cơ sở dữ liệu (database) nguyên tử, ví dụ như phương thức `savePerson()` bên dưới có hai thao tác database nguyên tử. Các thao tác database nguyên tử này có sự phụ thuộc lẫn nhau, chúng hoặc phải cùng được thực thi, hoặc cùng không được thực thi.

```java
  public void savePerson() {
    personDao.save(person);
    personDetailDao.save(personDetail);
  }
```

Ngoài ra, cần đặc biệt lưu ý rằng: **Transaction có thể có hiệu lực hay không phụ thuộc vào việc database engine có hỗ trợ transaction hay không. Ví dụ, cơ sở dữ liệu MySQL thường dùng mặc định sử dụng engine `innodb` có hỗ trợ transaction. Tuy nhiên, nếu bạn chuyển database engine sang `myisam`, thì chương trình sẽ không còn hỗ trợ transaction nữa!**

Ví dụ kinh điển nhất và thường được lấy ra để minh họa cho transaction chính là chuyển tiền. Giả sử Tiểu Minh muốn chuyển cho Tiểu Hồng 1000 tệ, giao dịch chuyển tiền này sẽ liên quan đến hai thao tác then chốt:

> 1. Giảm số dư của Tiểu Minh đi 1000 tệ.
> 2. Tăng số dư của Tiểu Hồng thêm 1000 tệ.

Nhưng lỡ như giữa hai thao tác này đột nhiên xảy ra lỗi, ví dụ như hệ thống ngân hàng sập hoặc mạng bị lỗi, dẫn đến số dư của Tiểu Minh bị giảm nhưng số dư của Tiểu Hồng lại không tăng, thì điều này là không chính xác. Transaction chính là để đảm bảo rằng hai thao tác then chốt này hoặc đều thành công, hoặc đều thất bại.

![Sơ đồ minh họa Transaction](https://oss.javaguide.cn/github/javaguide/mysql/%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

```java
public class OrdersService {
  private AccountDao accountDao;

  public void setOrdersDao(AccountDao accountDao) {
    this.accountDao = accountDao;
  }

  @Transactional(propagation = Propagation.REQUIRED,
                isolation = Isolation.DEFAULT, readOnly = false, timeout = -1)
  public void accountMoney() {
    //Tài khoản Tiểu Hồng thêm 1000
    accountDao.addMoney(1000,xiaohong);
    //Mô phỏng lỗi bất ngờ, ví dụ ngân hàng có thể đột nhiên mất điện
    //Nếu không cấu hình quản lý transaction, tài khoản Tiểu Hồng sẽ thêm 1000 mà tài khoản Tiểu Minh không bị trừ tiền
    int i = 10 / 0;
    //Tài khoản Tiểu Minh trừ 1000
    accountDao.reduceMoney(1000,xiaoming);
  }
}
```

Ngoài ra, bốn đặc tính ACID của database transaction là nền tảng của transaction, hãy cùng tìm hiểu sơ qua bên dưới.

## Bạn có hiểu về các đặc tính của transaction (ACID) không?

1. **Tính nguyên tử** (`Atomicity`): Transaction là đơn vị thực thi nhỏ nhất, không được phép chia tách. Tính nguyên tử của transaction đảm bảo các thao tác hoặc được hoàn thành toàn bộ, hoặc hoàn toàn không có tác dụng;
2. **Tính nhất quán** (`Consistency`): Trước và sau khi thực thi transaction, dữ liệu luôn duy trì sự nhất quán. Ví dụ trong nghiệp vụ chuyển tiền, bất kể transaction có thành công hay không, tổng số tiền của người chuyển và người nhận là không đổi;
3. **Tính cô lập** (`Isolation`): Khi truy cập đồng thời vào cơ sở dữ liệu, transaction của một người dùng không bị transaction của người dùng khác can thiệp, giữa các transaction đồng thời thì cơ sở dữ liệu là độc lập;
4. **Tính bền vững** (`Durability`): Sau khi một transaction được commit, những thay đổi của nó đối với dữ liệu trong cơ sở dữ liệu là bền vững, ngay cả khi cơ sở dữ liệu gặp sự cố cũng không được ảnh hưởng gì.

🌈 Ở đây cần bổ sung thêm một điểm: **Chỉ khi đảm bảo được tính bền vững, tính nguyên tử và tính cô lập của transaction thì tính nhất quán mới được đảm bảo. Nói cách khác, A, I, D là phương tiện, còn C là mục đích!** Tôi đoán mọi người cũng giống tôi, đã bị khái niệm ACID này đánh lừa rất lâu rồi! Tôi cũng phải xem khóa học công khai của thầy Chu Chí Minh [《Chu Chí Minh Kiến Trúc Phần Mềm》](https://time.geekbang.org/opencourse/intro/100064201) mới hiểu rõ được (hãy đọc nhiều sách hay nhé!!!).

![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID->C.png)

Ngoài ra, tác giả của cuốn DDIA tức là [《Designing Data-Intensive Application（Thiết Kế Ứng Dụng Chuyên Sâu Về Dữ Liệu）》](https://book.douban.com/subject/30329536/) đã nói như sau trong cuốn sách này:

> Atomicity, isolation, and durability are properties of the database, whereas consis‐ tency (in the ACID sense) is a property of the application. The application may rely on the database's atomicity and isolation properties in order to achieve consistency, but it's not up to the database alone.
>
> Dịch nghĩa: Tính nguyên tử, tính cô lập và tính bền vững là các thuộc tính của cơ sở dữ liệu, trong khi tính nhất quán (theo nghĩa ACID) là thuộc tính của ứng dụng. Ứng dụng có thể dựa vào tính nguyên tử và tính cô lập của cơ sở dữ liệu để đạt được tính nhất quán, nhưng điều này không chỉ phụ thuộc vào cơ sở dữ liệu. Do đó, chữ C không thuộc về ACID.

Cuốn 《Designing Data-Intensive Application（Thiết Kế Ứng Dụng Chuyên Sâu Về Dữ Liệu）》 thực sự đáng để đọc, đáng đọc đi đọc lại nhiều lần! Trên Douban có gần 90% người đọc đã cho cuốn sách này đánh giá 5 sao. Ngoài ra, phiên bản dịch tiếng Trung đã được open source trên GitHub, địa chỉ: [https://github.com/Vonng/ddia](https://github.com/Vonng/ddia) .

## Phân tích chi tiết về hỗ trợ Transaction trong Spring

> ⚠️ Nhắc lại một lần nữa: Chương trình của bạn có hỗ trợ transaction hay không trước hết phụ thuộc vào cơ sở dữ liệu. Ví dụ như dùng MySQL, nếu bạn chọn engine innodb, thì xin chúc mừng, bạn có thể hỗ trợ transaction. Tuy nhiên, nếu cơ sở dữ liệu MySQL của bạn dùng engine myisam, thì rất tiếc, về cơ bản là không hỗ trợ transaction.

Ở đây nhấn mạnh thêm một kiến thức rất quan trọng: **MySQL làm thế nào để đảm bảo tính nguyên tử?**

Chúng ta biết rằng nếu muốn đảm bảo tính nguyên tử của transaction, thì cần phải **rollback** (quay lui) các thao tác đã thực thi khi có ngoại lệ xảy ra. Trong MySQL, cơ chế khôi phục được thực hiện thông qua **undo log (nhật ký quay lui)**. Tất cả các thay đổi mà transaction thực hiện trước tiên sẽ được ghi vào undo log, sau đó mới thực thi các thao tác liên quan. Nếu gặp ngoại lệ trong quá trình thực thi, chúng ta chỉ cần sử dụng thông tin trong **undo log** để khôi phục dữ liệu về trạng thái trước khi sửa đổi! Hơn nữa, undo log sẽ được ghi xuống đĩa (persist) trước cả dữ liệu. Điều này đảm bảo rằng ngay cả khi gặp tình huống cơ sở dữ liệu đột ngột bị sập, khi người dùng khởi động lại cơ sở dữ liệu, cơ sở dữ liệu vẫn có thể truy vấn undo log để rollback lại các transaction chưa hoàn thành trước đó.

### Spring hỗ trợ hai phương thức quản lý transaction

#### Quản lý transaction theo kiểu lập trình (Programmatic Transaction Management)

Quản lý transaction thủ công thông qua `TransactionTemplate` hoặc `TransactionManager`, trong thực tế ứng dụng rất ít khi sử dụng, nhưng sẽ hữu ích cho việc bạn hiểu nguyên lý quản lý transaction của Spring.

Mã nguồn ví dụ sử dụng `TransactionTemplate` để quản lý transaction theo kiểu lập trình như sau:

```java
@Autowired
private TransactionTemplate transactionTemplate;
public void testTransaction() {

        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus transactionStatus) {

                try {

                    // ....  business code
                } catch (Exception e){
                    //rollback
                    transactionStatus.setRollbackOnly();
                }

            }
        });
}
```

Mã nguồn ví dụ sử dụng `TransactionManager` để quản lý transaction theo kiểu lập trình như sau:

```java
@Autowired
private PlatformTransactionManager transactionManager;

public void testTransaction() {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
          try {
               // ....  business code
              transactionManager.commit(status);
          } catch (Exception e) {
              transactionManager.rollback(status);
          }
}
```

#### Quản lý transaction theo kiểu khai báo (Declarative Transaction Management)

Được khuyến nghị sử dụng (mức độ xâm lấn mã nguồn thấp nhất), thực tế được triển khai thông qua AOP (dựa trên chú thích `@Transactional` theo kiểu annotation đầy đủ là cách dùng phổ biến nhất).

Mã nguồn ví dụ sử dụng chú thích `@Transactional` để quản lý transaction như sau:

```java
@Transactional(propagation = Propagation.REQUIRED)
public void aMethod() {
  //do something
  B b = new B();
  C c = new C();
  b.bMethod();
  c.cMethod();
}
```

### Giới thiệu về các interface quản lý transaction trong Spring

Trong Spring Framework, có 3 interface quan trọng nhất liên quan đến quản lý transaction như sau:

- **`PlatformTransactionManager`**: Transaction manager (trình quản lý transaction), cốt lõi của chiến lược transaction trong Spring.
- **`TransactionDefinition`**: Thông tin định nghĩa transaction (mức cô lập, hành vi lan truyền, thời gian chờ, chỉ đọc, v.v.).
- **`TransactionStatus`**: Trạng thái đang chạy của transaction.

Chúng ta có thể xem interface **`PlatformTransactionManager`** như là người quản lý cấp trên của transaction, còn hai interface **`TransactionDefinition`** và **`TransactionStatus`** có thể xem như là phần mô tả của transaction.

**`PlatformTransactionManager`** sẽ căn cứ vào định nghĩa của **`TransactionDefinition`** như thời gian chờ (timeout), mức cô lập (isolation level), hành vi lan truyền (propagation behavior), v.v. để tiến hành quản lý transaction, còn interface **`TransactionStatus`** cung cấp một số phương thức để lấy các trạng thái tương ứng của transaction, ví dụ như có phải là transaction mới hay không, có thể rollback hay không, v.v.

#### PlatformTransactionManager: Interface quản lý transaction

**Spring không trực tiếp quản lý transaction, mà cung cấp nhiều loại transaction manager khác nhau**. Interface của transaction manager trong Spring là: **`PlatformTransactionManager`**.

Thông qua interface này, Spring cung cấp transaction manager tương ứng cho từng nền tảng như: JDBC (`DataSourceTransactionManager`), Hibernate (`HibernateTransactionManager`), JPA (`JpaTransactionManager`), v.v., nhưng việc triển khai cụ thể là trách nhiệm của từng nền tảng.

**Dưới đây là các lớp triển khai cụ thể của interface `PlatformTransactionManager`:**

![](./images/spring-transaction/PlatformTransactionManager.png)

Interface `PlatformTransactionManager` định nghĩa ba phương thức:

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface PlatformTransactionManager {
    //Lấy transaction
    TransactionStatus getTransaction(@Nullable TransactionDefinition var1) throws TransactionException;
    //Commit transaction
    void commit(TransactionStatus var1) throws TransactionException;
    //Rollback transaction
    void rollback(TransactionStatus var1) throws TransactionException;
}

```

**Nói thêm một chút ở đây. Tại sao lại phải định nghĩa hay trừu tượng hóa ra interface `PlatformTransactionManager` này?**

Chủ yếu là vì cần trừu tượng hóa hành vi quản lý transaction ra, sau đó các nền tảng khác nhau sẽ triển khai nó. Như vậy chúng ta có thể đảm bảo hành vi cung cấp ra bên ngoài là không thay đổi, thuận tiện cho việc mở rộng.

Cách đây không lâu tôi đã chia sẻ trên [Knowledge Planet](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) của tôi: **"Tại sao chúng ta nên sử dụng interface?"**.

> Cuốn 《Design Patterns》 (cuốn của GOF) từ nhiều năm trước đã đề cập rằng nên lập trình dựa trên interface thay vì dựa trên hiện thực (implementation), bạn có thực sự biết tại sao nên lập trình dựa trên interface không?
>
> Nhìn vào mã nguồn của các open source framework và dự án, interface là một thành phần không thể thiếu trong đó. Để hiểu tại sao nên dùng interface, trước hết phải hiểu interface cung cấp chức năng gì. Chúng ta có thể hiểu interface như là một thỏa thuận (contract) cung cấp một loạt danh sách chức năng, bản thân interface không cung cấp chức năng, nó chỉ định nghĩa hành vi. Nhưng ai muốn dùng nó, thì phải triển khai (implement) nó trước, tuân thủ thỏa thuận của nó, sau đó tự mình triển khai các chức năng mà nó định nghĩa.
>
> Lấy một ví dụ, trong dự án trước của tôi có yêu cầu gửi tin nhắn SMS, vì thế, chúng tôi đã định nghĩa một interface, interface chỉ có hai phương thức:
>
> 1. Gửi SMS. 2. Phương thức xử lý kết quả gửi.
>
> Ban đầu chúng tôi dùng dịch vụ SMS của Alibaba Cloud, sau đó chúng tôi triển khai interface này để hoàn thành một dịch vụ SMS Alibaba Cloud. Sau này, chúng tôi đột nhiên đổi sang một nền tảng dịch vụ SMS khác, lúc này chúng tôi chỉ cần triển khai lại interface này là được. Như vậy đảm bảo hành vi cung cấp ra bên ngoài của chúng tôi là không thay đổi. Hầu như không cần thay đổi mã nguồn gì, chúng tôi đã dễ dàng hoàn thành việc chuyển đổi yêu cầu, nâng cao tính linh hoạt và khả năng mở rộng của mã nguồn.
>
> Khi nào thì dùng interface? Khi module chức năng bạn muốn triển khai liên quan đến thiết kế hành vi trừu tượng, ví dụ như dịch vụ gửi SMS, dịch vụ lưu trữ ảnh (image hosting), v.v.

#### TransactionDefinition: Thuộc tính transaction

Interface transaction manager **`PlatformTransactionManager`** lấy một transaction thông qua phương thức **`getTransaction(TransactionDefinition definition)`**, tham số của phương thức này là lớp **`TransactionDefinition`**, lớp này định nghĩa một số thuộc tính transaction cơ bản.

**Vậy thuộc tính transaction là gì?** Thuộc tính transaction có thể hiểu là một số cấu hình cơ bản của transaction, mô tả cách chiến lược transaction được áp dụng lên phương thức.

`TransactionDefinition` chủ yếu bao gồm 4 khía cạnh cấu hình transaction sau:

- Mức cô lập (Isolation Level)
- Hành vi lan truyền (Propagation Behavior)
- Có phải là chỉ đọc hay không (Read-only)
- Thời gian chờ transaction (Timeout)

Ngoài ra, phương thức `getName()` có thể trả về tên transaction. Quy tắc rollback không thuộc về bản thân `TransactionDefinition`; `TransactionAttribute` được sử dụng trong Spring declarative transaction kế thừa từ `TransactionDefinition`, và bổ sung thêm khả năng quy tắc rollback, v.v.

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    int TIMEOUT_DEFAULT = -1;
    // Trả về hành vi lan truyền của transaction, giá trị mặc định là REQUIRED.
    int getPropagationBehavior();
    //Trả về mức cô lập của transaction, giá trị mặc định là DEFAULT
    int getIsolationLevel();
    // Trả về thời gian chờ của transaction, giá trị mặc định là -1. Nếu vượt quá giới hạn thời gian này mà transaction vẫn chưa hoàn thành, thì tự động rollback transaction.
    int getTimeout();
    // Trả về transaction có phải là chỉ đọc hay không, giá trị mặc định là false
    boolean isReadOnly();

    @Nullable
    String getName();
}
```

#### TransactionStatus: Trạng thái transaction

Interface `TransactionStatus` dùng để ghi lại trạng thái của transaction. Interface này định nghĩa một nhóm các phương thức, được dùng để lấy hoặc phán đoán thông tin trạng thái tương ứng của transaction.

Phương thức `PlatformTransactionManager.getTransaction(…)` trả về một đối tượng `TransactionStatus`.

**Nội dung interface TransactionStatus như sau:**

```java
public interface TransactionStatus{
    boolean isNewTransaction(); // Có phải là transaction mới hay không
    boolean hasSavepoint(); // Có savepoint hay không
    void setRollbackOnly();  // Đặt thành chỉ rollback
    boolean isRollbackOnly(); // Có phải là chỉ rollback hay không
    boolean isCompleted(); // Đã hoàn thành hay chưa
}
```

### Giải thích chi tiết các thuộc tính transaction

Trong thực tế phát triển nghiệp vụ, mọi người thường sử dụng chú thích `@Transactional` để kích hoạt transaction, nhưng nhiều người không rõ các tham số trong chú thích này có ý nghĩa gì, có tác dụng gì. Để sử dụng quản lý transaction tốt hơn trong dự án, tôi thực sự khuyến nghị bạn nên đọc kỹ nội dung bên dưới.

#### Hành vi lan truyền của transaction (Transaction Propagation Behavior)

**Hành vi lan truyền của transaction sinh ra để giải quyết vấn đề transaction khi các phương thức ở tầng nghiệp vụ gọi lẫn nhau**.

Khi một phương thức transaction được gọi bởi một phương thức transaction khác, phải chỉ định transaction nên được lan truyền như thế nào. Ví dụ: phương thức có thể tiếp tục chạy trong transaction hiện có, hoặc mở ra một transaction mới và chạy trong transaction của riêng nó.

Lấy một ví dụ: Chúng ta gọi phương thức `bMethod()` của lớp B trong phương thức `aMethod()` của lớp A. Lúc này sẽ liên quan đến vấn đề transaction khi các phương thức tầng nghiệp vụ gọi lẫn nhau. Nếu `bMethod()` của chúng ta xảy ra ngoại lệ cần rollback, thì làm thế nào để cấu hình hành vi lan truyền của transaction để `aMethod()` cũng rollback theo? Lúc này bạn cần đến kiến thức về hành vi lan truyền của transaction, nếu bạn chưa biết thì nhất định phải đọc kỹ.

Các đoạn mã hành vi lan truyền bên dưới đều là các đoạn minh họa đã lược bỏ import và một phần chi tiết triển khai, trong đó `Propagation.xxx` là placeholder cần thay thế, không phải là lớp hoàn chỉnh có thể biên dịch trực tiếp.

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.xxx)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.xxx)
    public void bMethod() {
       //do something
    }
}
```

Trong định nghĩa của `TransactionDefinition` bao gồm các hằng số biểu thị hành vi lan truyền như sau:

```java
public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    ......
}
```

Tuy nhiên, để thuận tiện cho việc sử dụng, Spring đã định nghĩa tương ứng một lớp enum: `Propagation`

```java
package org.springframework.transaction.annotation;

import org.springframework.transaction.TransactionDefinition;

public enum Propagation {

    REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

    SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

    MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

    REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

    NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

    NEVER(TransactionDefinition.PROPAGATION_NEVER),

    NESTED(TransactionDefinition.PROPAGATION_NESTED);

    private final int value;

    Propagation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}

```

**Các giá trị có thể có của hành vi lan truyền transaction chính xác như sau**:

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

Đây là hành vi lan truyền transaction được sử dụng nhiều nhất, chú thích `@Transactional` mà chúng ta thường dùng hàng ngày có giá trị mặc định chính là hành vi lan truyền này. Nếu hiện tại đang tồn tại transaction, thì tham gia vào transaction đó; nếu hiện tại không có transaction, thì tạo ra một transaction mới. Nói cách khác:

- Nếu phương thức bên ngoài không mở transaction, thì phương thức bên trong được `Propagation.REQUIRED` đánh dấu sẽ tự mở transaction riêng của nó, và các transaction được mở ra là độc lập với nhau, không can thiệp lẫn nhau.
- Nếu phương thức bên ngoài mở transaction và được `Propagation.REQUIRED` đánh dấu, thì tất cả các phương thức bên trong được `Propagation.REQUIRED` đánh dấu và phương thức bên ngoài đều cùng thuộc về một transaction, chỉ cần một phương thức rollback, toàn bộ transaction đều rollback.

Lấy một ví dụ: Nếu `aMethod()` và `bMethod()` của chúng ta ở trên đều sử dụng hành vi lan truyền `PROPAGATION_REQUIRED`, thì cả hai sử dụng cùng một transaction, chỉ cần một trong hai phương thức rollback, toàn bộ transaction đều rollback.

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}
@Service
class B {
    @Transactional(propagation = Propagation.REQUIRED)
    public void bMethod() {
       //do something
    }
}
```

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

Tạo ra một transaction mới, nếu hiện tại đang tồn tại transaction, thì tạm ngưng (suspend) transaction hiện tại. Nói cách khác, bất kể phương thức bên ngoài có mở transaction hay không, phương thức bên trong được `Propagation.REQUIRES_NEW` đánh dấu sẽ tự mở transaction riêng của nó, và các transaction được mở ra là độc lập với nhau, không can thiệp lẫn nhau.

Lấy một ví dụ: Nếu `bMethod()` của chúng ta ở trên sử dụng hành vi lan truyền `PROPAGATION_REQUIRES_NEW`, còn `aMethod` vẫn dùng `PROPAGATION_REQUIRED` để đánh dấu. Nếu `aMethod()` xảy ra ngoại lệ rollback, `bMethod()` sẽ không rollback theo, vì `bMethod()` đã mở một transaction độc lập. Tuy nhiên, nếu `bMethod()` ném ra một ngoại lệ không được bắt (uncaught exception) và ngoại lệ này thỏa mãn quy tắc rollback của transaction, thì `aMethod()` cũng sẽ rollback, vì ngoại lệ này bị cơ chế quản lý transaction của `aMethod()` phát hiện.

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void bMethod() {
       //do something
    }
}
```

**3.`TransactionDefinition.PROPAGATION_NESTED`**:

Nếu hiện tại đang tồn tại transaction, thì tạo ra một transaction để thực thi như là transaction lồng (nested transaction) của transaction hiện tại; nếu hiện tại không có transaction, thì thực thi tương tự như `TransactionDefinition.PROPAGATION_REQUIRED`. Nói cách khác:

- Trong trường hợp phương thức bên ngoài mở transaction, mở một transaction mới bên trong, tồn tại như là nested transaction.
- Nếu phương thức bên ngoài không có transaction, thì tự mở một transaction riêng, tương tự như `PROPAGATION_REQUIRED`.

Nested transaction được biểu thị bởi `TransactionDefinition.PROPAGATION_NESTED` tồn tại dưới dạng quan hệ cha-con (parent-child), ý tưởng cốt lõi của nó là transaction con không được commit một cách độc lập, mà phụ thuộc vào transaction cha, chạy trong phạm vi của transaction cha; khi transaction cha commit, transaction con cũng sẽ được commit theo, đương nhiên, khi transaction cha rollback, transaction con cũng sẽ rollback theo;

> Khác biệt với `TransactionDefinition.PROPAGATION_REQUIRES_NEW`: `PROPAGATION_REQUIRES_NEW` là transaction độc lập, không phụ thuộc vào transaction bên ngoài, tồn tại dưới dạng quan hệ ngang hàng (peer), sau khi thực thi xong sẽ commit ngay lập tức, không liên quan gì đến transaction bên ngoài;

Transaction con cũng có đặc tính riêng của nó, có thể rollback một cách độc lập, sẽ không gây ra rollback cho transaction cha, nhưng với điều kiện tiên quyết là cần phải xử lý ngoại lệ của transaction con, tránh để ngoại lệ bị transaction cha phát hiện dẫn đến transaction bên ngoài rollback;

Lấy một ví dụ:

- Nếu `aMethod()` rollback, thì `bMethod()` với tư cách là nested transaction cũng sẽ rollback.
- Nếu `bMethod()` rollback, thì `aMethod()` có rollback hay không, phụ thuộc vào việc ngoại lệ của `bMethod()` có được xử lý hay không:

  - Ngoại lệ của `bMethod()` không được xử lý, tức là bên trong `bMethod()` không xử lý ngoại lệ, và `aMethod()` cũng không xử lý ngoại lệ, thì `aMethod()` sẽ phát hiện ngoại lệ và khiến toàn bộ rollback.

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            b.bMethod();
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod (){
           //do something and throw an exception
        }
    }
    ```

  - `bMethod()` xử lý ngoại lệ hoặc `aMethod()` xử lý ngoại lệ, thì `aMethod()` sẽ không rollback.

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            try {
                b.bMethod();
            } catch (Exception e) {
                System.out.println("Phương thức rollback");
            }
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod() {
           //do something and throw an exception
        }
    }
    ```

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

Nếu hiện tại đang tồn tại transaction, thì tham gia vào transaction đó; nếu hiện tại không có transaction, thì ném ra ngoại lệ. (mandatory: bắt buộc)

Loại này rất ít khi được sử dụng, nên tôi sẽ không lấy ví dụ nữa.

**3 hành vi lan truyền sau đây có cách xử lý transaction hiện tại khác nhau, không thể hiểu theo cùng một quy tắc rollback.**

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**: Nếu hiện tại đang tồn tại transaction, thì tham gia vào transaction đó, các thao tác trong đó sẽ tham gia vào việc commit hoặc rollback của transaction đó; nếu hiện tại không có transaction, thì chạy theo cách không có transaction (non-transactional).
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**: Luôn chạy theo cách không có transaction; nếu hiện tại đang tồn tại transaction, thì tạm ngưng (suspend) nó lại trước. Do đó, các thao tác được thực thi trong phạm vi ranh giới lan truyền này không bị kiểm soát bởi rollback của transaction bên ngoài đã bị tạm ngưng.
- **`TransactionDefinition.PROPAGATION_NEVER`**: Chỉ cho phép chạy theo cách không có transaction; nếu phát hiện hiện tại đang tồn tại transaction, thì ném thẳng ra ngoại lệ.

Để biết thêm về hành vi lan truyền của transaction, hãy xem bài viết này: [《Khó quá~ Người phỏng vấn bảo tôi kết hợp case study để nói về hiểu biết của mình đối với Spring Transaction Propagation Behavior.》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486668&idx=2&sn=0381e8c836442f46bdc5367170234abb&chksm=cea24307f9d5ca11c96943b3ccfa1fc70dc97dd87d9c540388581f8fe6d805ff548dff5f6b5b&token=1776990505&lang=zh_CN#rd)

#### Mức cô lập của transaction (Transaction Isolation Level)

Interface `TransactionDefinition` định nghĩa năm hằng số biểu thị mức cô lập:

```java
public interface TransactionDefinition {
    ......
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    ......
}
```

Giống như phần hành vi lan truyền, để thuận tiện cho việc sử dụng, Spring cũng đã định nghĩa tương ứng một lớp enum: `Isolation`

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

Dưới đây tôi sẽ lần lượt giới thiệu từng mức cô lập của transaction:

- **`TransactionDefinition.ISOLATION_DEFAULT`** : Sử dụng mức cô lập mặc định của cơ sở dữ liệu backend, MySQL mặc định sử dụng mức cô lập `REPEATABLE_READ`, Oracle mặc định sử dụng mức cô lập `READ_COMMITTED`.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** : Mức cô lập thấp nhất, rất ít khi sử dụng mức cô lập này, vì nó cho phép đọc các thay đổi dữ liệu chưa được commit, **có thể dẫn đến dirty read (đọc bẩn), phantom read (đọc ảo) hoặc non-repeatable read (đọc không lặp lại)**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : Cho phép đọc dữ liệu đã được commit bởi các transaction đồng thời, **có thể ngăn chặn dirty read, nhưng phantom read hoặc non-repeatable read vẫn có thể xảy ra**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : Kết quả của nhiều lần đọc cùng một trường đều nhất quán, trừ khi dữ liệu bị chính transaction hiện tại sửa đổi, **có thể ngăn chặn dirty read và non-repeatable read, nhưng phantom read vẫn có thể xảy ra.**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : Mức cô lập cao nhất, hoàn toàn tuân thủ mức cô lập của ACID. Tất cả transaction được thực thi tuần tự từng cái một, như vậy giữa các transaction hoàn toàn không thể phát sinh can thiệp lẫn nhau, nói cách khác, **mức cô lập này có thể ngăn chặn dirty read, non-repeatable read và phantom read**. Nhưng điều này sẽ ảnh hưởng nghiêm trọng đến hiệu năng của chương trình. Thông thường cũng sẽ không sử dụng đến mức cô lập này.

Bài đọc liên quan: [Giải thích chi tiết về MySQL Transaction Isolation Level](https://javaguide.cn/database/mysql/transaction-isolation-level.html).

#### Thuộc tính thời gian chờ của transaction (Transaction Timeout)

Cái gọi là transaction timeout, là chỉ thời gian tối đa mà một transaction được phép thực thi, nếu vượt quá giới hạn thời gian này mà transaction vẫn chưa hoàn thành, thì tự động rollback transaction. Trong `TransactionDefinition` biểu thị thời gian chờ dưới dạng giá trị int, đơn vị là giây, giá trị mặc định là -1, điều này có nghĩa là thời gian chờ của transaction phụ thuộc vào hệ thống transaction bên dưới hoặc không có thời gian chờ.

#### Thuộc tính chỉ đọc của transaction (Transaction Read-only)

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    ......
    // Trả về transaction có phải là chỉ đọc hay không, giá trị mặc định là false
    boolean isReadOnly();

}
```

Đối với các transaction chỉ có thao tác đọc và truy vấn dữ liệu, có thể chỉ định kiểu transaction là readonly, tức là transaction chỉ đọc. Transaction chỉ đọc không liên quan đến việc sửa đổi dữ liệu, cơ sở dữ liệu sẽ cung cấp một số biện pháp tối ưu hóa, phù hợp để sử dụng trong các phương thức có nhiều thao tác truy vấn cơ sở dữ liệu.

Nhiều người sẽ thắc mắc, tại sao một thao tác truy vấn dữ liệu mà lại cần kích hoạt hỗ trợ transaction?

Lấy ví dụ về innodb của MySQL, theo mô tả của trang web chính thức [https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html](https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html) :

> MySQL mặc định kích hoạt chế độ `autocommit` cho mỗi kết nối mới được thiết lập. Trong chế độ này, mỗi câu lệnh `sql` gửi đến MySQL server đều sẽ được xử lý trong một transaction riêng biệt, sau khi thực thi xong sẽ tự động commit transaction, và mở ra một transaction mới.

Tuy nhiên, nếu bạn thêm chú thích `@Transactional` vào phương thức, tất cả các SQL được thực thi bởi phương thức này sẽ được đặt trong cùng một transaction. Sau khi khai báo là transaction chỉ đọc, Spring sẽ chuyển gợi ý chỉ đọc (read-only hint) đến hệ thống transaction bên dưới; việc có tối ưu hóa hay không và tối ưu hóa như thế nào phụ thuộc vào cơ sở dữ liệu, driver và transaction manager, nó cũng không đảm bảo rằng thao tác ghi chắc chắn sẽ thất bại.

Nếu không thêm `@Transactional`, mỗi câu `sql` sẽ mở ra một transaction riêng biệt, trong khoảng thời gian đó dữ liệu bị transaction khác thay đổi, thì đều sẽ đọc được giá trị mới nhất theo thời gian thực.

Chia sẻ về thuộc tính chỉ đọc của transaction, câu trả lời từ những người khác:

- Nếu bạn thực thi một câu truy vấn đơn lẻ mỗi lần, thì không cần thiết phải kích hoạt hỗ trợ transaction, cơ sở dữ liệu mặc định hỗ trợ tính nhất quán đọc (read consistency) trong thời gian thực thi SQL;
- Nếu bạn thực thi nhiều câu truy vấn mỗi lần, ví dụ như truy vấn thống kê, truy vấn báo cáo, trong tình huống này, nhiều câu SQL truy vấn phải đảm bảo tính nhất quán đọc tổng thể, nếu không, sau khi câu SQL trước truy vấn xong, trước khi câu SQL sau truy vấn, dữ liệu bị người dùng khác thay đổi, thì lần truy vấn thống kê tổng thể này sẽ xuất hiện trạng thái dữ liệu đọc không nhất quán, lúc này, nên kích hoạt hỗ trợ transaction.

#### Quy tắc rollback của transaction

Những quy tắc này định nghĩa những ngoại lệ nào sẽ dẫn đến transaction rollback và những ngoại lệ nào thì không. Theo mặc định, transaction chỉ rollback khi gặp phải runtime exception (lớp con của `RuntimeException`), `Error` cũng sẽ dẫn đến transaction rollback, nhưng sẽ không rollback khi gặp checked exception.

![](./images/spring-transaction/roollbackFor.png)

Nếu bạn muốn rollback đối với kiểu ngoại lệ cụ thể mà bạn định nghĩa, có thể làm như sau:

```java
@Transactional(rollbackFor= MyException.class)
```

### Hướng dẫn sử dụng chi tiết chú thích @Transactional

#### Phạm vi tác dụng của `@Transactional`

1. **Phương thức (Method)**: Khuyến nghị sử dụng chú thích trên phương thức. Class proxy của Spring 6 mặc định còn hỗ trợ các phương thức `protected` và package-private; interface proxy yêu cầu phương thức là phương thức `public` được định nghĩa trong interface. Các chế độ proxy của phiên bản cũ hơn thường chỉ hỗ trợ phương thức `public`.
2. **Lớp (Class)**: Nếu chú thích này được sử dụng trên lớp, thì tất cả các phương thức trong lớp đó thỏa mãn quy tắc khả kiến của proxy nêu trên đều sẽ áp dụng cùng một ngữ nghĩa transaction.
3. **Interface**: Không khuyến nghị sử dụng trên interface.

#### Các tham số cấu hình thường dùng của `@Transactional`

Mã nguồn của chú thích `@Transactional` như sau, bên trong bao gồm cấu hình của các thuộc tính transaction cơ bản:

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {

  @AliasFor("transactionManager")
  String value() default "";

  @AliasFor("value")
  String transactionManager() default "";

  Propagation propagation() default Propagation.REQUIRED;

  Isolation isolation() default Isolation.DEFAULT;

  int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;

  boolean readOnly() default false;

  Class<? extends Throwable>[] rollbackFor() default {};

  String[] rollbackForClassName() default {};

  Class<? extends Throwable>[] noRollbackFor() default {};

  String[] noRollbackForClassName() default {};

}
```

**Tổng hợp các tham số cấu hình thường dùng của `@Transactional` (chỉ liệt kê 5 cái tôi thường dùng):**

| Tên thuộc tính | Mô tả                                                                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| propagation    | Hành vi lan truyền của transaction, giá trị mặc định là REQUIRED, các giá trị có thể chọn đã được giới thiệu ở trên                                                                 |
| isolation      | Mức cô lập của transaction, giá trị mặc định là DEFAULT, các giá trị có thể chọn đã được giới thiệu ở trên                                                                          |
| timeout        | Thời gian chờ của transaction, giá trị mặc định là -1 (sẽ không timeout). Nếu vượt quá giới hạn thời gian này mà transaction vẫn chưa hoàn thành, thì tự động rollback transaction. |
| readOnly       | Chỉ định transaction có phải là transaction chỉ đọc hay không, giá trị mặc định là false.                                                                                           |
| rollbackFor    | Dùng để chỉ định kiểu ngoại lệ có thể kích hoạt transaction rollback, và có thể chỉ định nhiều kiểu ngoại lệ.                                                                       |

#### Nguyên lý của chú thích transaction `@Transactional`

Đây là một câu hỏi có thể được hỏi khi phỏng vấn về AOP. Hãy nói đơn giản thôi!

Chúng ta biết rằng, **cơ chế hoạt động của `@Transactional` dựa trên AOP (Aspect-Oriented Programming), và AOP lại sử dụng dynamic proxy để triển khai. Nếu đối tượng mục tiêu (target object) triển khai interface, theo mặc định sẽ sử dụng JDK dynamic proxy, nếu đối tượng mục tiêu không triển khai interface, sẽ sử dụng CGLIB dynamic proxy.**

🤐 Nói thêm một chút: Phương thức `createAopProxy()` quyết định việc sử dụng JDK hay Cglib để làm dynamic proxy, mã nguồn như sau:

```java
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

  @Override
  public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
      Class<?> targetClass = config.getTargetClass();
      if (targetClass == null) {
        throw new AopConfigException("TargetSource cannot determine target class: " +
            "Either an interface or a target is required for proxy creation.");
      }
      if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
        return new JdkDynamicAopProxy(config);
      }
      return new ObjenesisCglibAopProxy(config);
    }
    else {
      return new JdkDynamicAopProxy(config);
    }
  }
  .......
}
```

Nếu một lớp hoặc một phương thức public trong một lớp được đánh dấu bằng chú thích `@Transactional`, thì Spring container sẽ tạo ra một proxy class (lớp đại diện) cho nó khi khởi động. Khi gọi phương thức public được đánh dấu `@Transactional`, thực tế sẽ gọi đến phương thức `invoke()` trong lớp `TransactionInterceptor`. Vai trò của phương thức này là mở transaction trước phương thức mục tiêu, rollback transaction nếu gặp ngoại lệ trong quá trình thực thi phương thức, và commit transaction sau khi phương thức được gọi hoàn thành.

> Phương thức `invoke()` trong lớp `TransactionInterceptor` thực tế bên trong gọi đến phương thức `invokeWithinTransaction()` của lớp `TransactionAspectSupport`. Do phiên bản Spring mới đã viết lại phần này rất nhiều, và sử dụng nhiều kiến thức về reactive programming, nên tôi sẽ không liệt kê mã nguồn ở đây.

#### Vấn đề tự gọi trong Spring AOP (Self-invocation)

Khi một phương thức được đánh dấu bằng chú thích `@Transactional`, Spring transaction manager chỉ có hiệu lực khi phương thức đó được gọi từ phương thức của lớp khác, chứ không có hiệu lực khi được gọi từ phương thức trong cùng một lớp.

Điều này là do nguyên lý hoạt động của Spring AOP quyết định. Bởi vì Spring AOP sử dụng dynamic proxy để triển khai quản lý transaction, nó sẽ tạo ra đối tượng proxy cho phương thức có chú thích `@Transactional` khi chạy, và áp dụng logic transaction trước và sau khi phương thức được gọi. Nếu phương thức này được lớp khác gọi, đối tượng proxy của chúng ta sẽ chặn (intercept) lời gọi phương thức và xử lý transaction. Nhưng khi được gọi từ bên trong một phương thức khác trong cùng một lớp, đối tượng proxy của chúng ta không thể chặn được lời gọi nội bộ này, do đó transaction cũng bị vô hiệu.

`method1()` trong lớp `MyService` gọi `method2()` sẽ khiến transaction của `method2()` bị vô hiệu.

```java
@Service
public class MyService {

private void method1() {
     method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

Cách giải quyết là tránh tự gọi trong cùng một lớp hoặc sử dụng AspectJ thay thế cho Spring AOP proxy.

[issue #2091](https://github.com/Snailclimb/JavaGuide/issues/2091) đã bổ sung một ví dụ:

```java
@Service
public class MyService {

private void method1() {
     // Cần phải cấu hình @EnableAspectJAutoProxy(exposeProxy = true) trước
     ((MyService) AopContext.currentProxy()).method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

Đoạn mã trên chỉ có thể lấy được đối tượng proxy hiện tại thông qua `AopContext.currentProxy()` sau khi kích hoạt `exposeProxy` (ví dụ như cấu hình `@EnableAspectJAutoProxy(exposeProxy = true)`). Như vậy khi gọi `method2()` sẽ đi qua proxy, chú thích transaction mới có hiệu lực. Do cách viết này sẽ khiến mã nghiệp vụ phụ thuộc vào ngữ cảnh AOP, nên thông thường khuyến nghị tách trách nhiệm của lớp để tránh tự gọi.

#### Tổng hợp các lưu ý khi sử dụng `@Transactional`

- Giới hạn về khả năng hiển thị (visibility) của phương thức `@Transactional` phụ thuộc vào kiểu proxy và phiên bản Spring: class proxy của Spring 6 mặc định hỗ trợ các phương thức `public`, `protected` và package-private, interface proxy yêu cầu phương thức là phương thức `public` được định nghĩa trong interface; các chế độ proxy của phiên bản cũ hơn thường chỉ hỗ trợ phương thức `public`;
- Tránh gọi phương thức có chú thích `@Transactional` trong cùng một lớp, điều này sẽ khiến transaction bị vô hiệu;
- Thiết lập chính xác thuộc tính `rollbackFor` và `propagation` của `@Transactional`, nếu không transaction có thể rollback thất bại;
- Lớp chứa phương thức được chú thích `@Transactional` phải được Spring quản lý, nếu không sẽ không có hiệu lực;
- Cơ sở dữ liệu bên dưới phải hỗ trợ cơ chế transaction, nếu không sẽ không có hiệu lực;
- ……

## Tham khảo

- [Tổng hợp] Các tham số của @Transactional trong quản lý transaction của Spring:[http://www.mobabel.net/spring 事务管理中 transactional 的参数/](http://www.mobabel.net/spring事务管理中transactional的参数/)
- Tài liệu chính thức của Spring：[https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html](https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html)
- 《Spring5 Lập Trình Nâng Cao》
- Nắm vững triệt để cách sử dụng @Transactional trong Spring: [https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html](https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html)
- Đặc tính lan truyền của Spring Transaction：[https://github.com/love-somnus/Spring/wiki/Spring 事务的传播特性](https://github.com/love-somnus/Spring/wiki/Spring事务的传播特性)
- [Giải thích chi tiết về Spring Transaction Propagation Behavior](https://segmentfault.com/a/1190000013341344)：[https://segmentfault.com/a/1190000013341344](https://segmentfault.com/a/1190000013341344)
- Phân tích toàn diện về quản lý transaction theo kiểu lập trình và quản lý transaction theo kiểu khai báo trong Spring：[https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html](https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html)

<!-- @include: @article-footer.snippet.md -->
