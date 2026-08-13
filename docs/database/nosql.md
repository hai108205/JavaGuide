---
title: Tổng hợp câu hỏi phỏng vấn về NoSQL
description: Tổng hợp kiến thức và câu hỏi phỏng vấn cơ bản về NoSQL, bao gồm sự khác biệt giữa NoSQL và SQL, ưu điểm của NoSQL, bốn loại cơ sở dữ liệu NoSQL (Key-Value, Document, Graph, Wide Column) cùng các hệ quản trị tiêu biểu như Redis, MongoDB, Neo4j...
category: Cơ sở dữ liệu
tag:
  - NoSQL
  - MongoDB
  - Redis
head:
  - - meta
    - name: keywords
      content: NoSQL,Redis,MongoDB,HBase,Cassandra,Cơ sở dữ liệu Key-Value,Cơ sở dữ liệu Document,Cơ sở dữ liệu Graph,Wide Column Store,So sánh SQL và NoSQL
---

## NoSQL là gì?

NoSQL (viết tắt của **Not Only SQL**) là tên gọi chung của các **cơ sở dữ liệu phi quan hệ (Non-Relational Database)**, chủ yếu được sử dụng để lưu trữ dữ liệu dạng **Key-Value**, **Document**, **Graph** và các mô hình dữ liệu khác ngoài bảng quan hệ truyền thống.

Đa số các hệ quản trị NoSQL được thiết kế ngay từ đầu để hỗ trợ **kiến trúc phân tán**, **sao lưu dữ liệu (Replication)** và **phân mảnh dữ liệu (Sharding)**, nhằm cung cấp giải pháp lưu trữ có **khả năng mở rộng cao (Scalability)**, **tính sẵn sàng cao (High Availability)** và **hiệu năng cao**.

Một quan niệm sai lầm khá phổ biến là NoSQL không thể lưu trữ dữ liệu có quan hệ. Thực tế, **NoSQL hoàn toàn có thể lưu trữ dữ liệu có quan hệ**, chỉ khác ở cách tổ chức và biểu diễn dữ liệu so với cơ sở dữ liệu quan hệ.

Một số hệ quản trị NoSQL tiêu biểu gồm:

- HBase
- Cassandra
- MongoDB
- Redis

![](https://oss.javaguide.cn/github/javaguide/database/mongodb/sql-nosql-tushi.png)

## SQL và NoSQL khác nhau như thế nào?

|                        | Cơ sở dữ liệu SQL                                                                                      | Cơ sở dữ liệu NoSQL                                                                                                                                         |
| :--------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mô hình lưu trữ**    | Dữ liệu có cấu trúc, lưu trong bảng gồm các hàng và cột cố định                                        | Dữ liệu phi cấu trúc hoặc bán cấu trúc. Document: JSON, Key-Value: cặp khóa–giá trị, Wide Column: bảng với cột động, Graph: nút và cạnh                     |
| **Lịch sử phát triển** | Xuất hiện từ những năm 1970, tập trung giảm dư thừa dữ liệu                                            | Phát triển mạnh từ cuối những năm 2000, tập trung vào khả năng mở rộng và giảm chi phí lưu trữ dữ liệu quy mô lớn                                           |
| **Ví dụ**              | Oracle, MySQL, Microsoft SQL Server, PostgreSQL                                                        | Document: MongoDB, CouchDB; Key-Value: Redis, DynamoDB; Wide Column: Cassandra, HBase; Graph: Neo4j, Amazon Neptune, Giraph                                 |
| **ACID**               | Hỗ trợ đầy đủ các thuộc tính ACID (Atomicity, Consistency, Isolation, Durability)                      | Thường không hỗ trợ ACID đầy đủ nhằm đánh đổi lấy hiệu năng và khả năng mở rộng. Một số hệ quản trị như MongoDB có hỗ trợ Transaction nhưng khác với MySQL. |
| **Hiệu năng**          | Phụ thuộc nhiều vào hệ thống lưu trữ. Muốn đạt hiệu năng cao cần tối ưu Index, Query và cấu trúc bảng. | Hiệu năng thường phụ thuộc vào quy mô cụm máy chủ, độ trễ mạng và cách ứng dụng truy cập dữ liệu.                                                           |
| **Khả năng mở rộng**   | Chủ yếu mở rộng theo chiều dọc (Vertical Scaling), kết hợp Read/Write Splitting và Sharding khi cần    | Chủ yếu mở rộng theo chiều ngang (Horizontal Scaling) bằng cách bổ sung thêm máy chủ và phân mảnh dữ liệu                                                   |
| **Mục đích sử dụng**   | Lưu trữ dữ liệu cho các hệ thống nghiệp vụ truyền thống                                                | Phù hợp với nhiều bài toán như lưu trữ dữ liệu khối lượng lớn, mạng xã hội, phân tích quan hệ, Cache, dữ liệu thay đổi liên tục...                          |
| **Ngôn ngữ truy vấn**  | SQL (Structured Query Language)                                                                        | Mỗi hệ quản trị có API hoặc cú pháp truy vấn riêng                                                                                                          |

## NoSQL có những ưu điểm gì?

NoSQL đặc biệt phù hợp với các ứng dụng hiện đại như **Mobile App**, **Web Application**, **Game**... vốn yêu cầu cơ sở dữ liệu có khả năng mở rộng linh hoạt, hiệu năng cao và đáp ứng lượng truy cập lớn.

- **Linh hoạt (Flexibility):** NoSQL thường sử dụng mô hình dữ liệu linh hoạt, cho phép phát triển và thay đổi cấu trúc dữ liệu nhanh hơn. Đây là lựa chọn lý tưởng cho dữ liệu bán cấu trúc hoặc phi cấu trúc.
- **Khả năng mở rộng (Scalability):** Phần lớn hệ quản trị NoSQL được thiết kế để mở rộng theo chiều ngang thông qua cụm máy chủ phân tán, thay vì nâng cấp phần cứng của một máy chủ duy nhất.
- **Hiệu năng cao (High Performance):** Mỗi loại NoSQL được tối ưu cho một mô hình dữ liệu và kiểu truy cập cụ thể, vì vậy thường đạt hiệu năng cao hơn so với việc cố gắng sử dụng cơ sở dữ liệu quan hệ cho cùng bài toán.
- **Nhiều tính năng chuyên biệt:** NoSQL thường cung cấp API mạnh mẽ cùng các kiểu dữ liệu được thiết kế riêng cho từng mô hình dữ liệu, giúp giải quyết các bài toán đặc thù hiệu quả hơn.

## NoSQL có những loại nào?

NoSQL thường được chia thành **bốn nhóm chính**:

- **Key-Value (Khóa – Giá trị):** Đây là loại NoSQL đơn giản nhất, trong đó mỗi bản ghi bao gồm một khóa (Key) và một giá trị (Value). Ứng dụng hoàn toàn quyết định nội dung được lưu trong Value mà không bị ràng buộc bởi lược đồ dữ liệu. **Redis** và **DynamoDB** là hai hệ quản trị Key-Value phổ biến.
- **Document (Tài liệu):** Dữ liệu được lưu dưới dạng tài liệu (Document), thường có cấu trúc tương tự JSON. Mỗi Document bao gồm các cặp Field–Value, trong đó Value có thể là chuỗi, số, Boolean, mảng hoặc đối tượng lồng nhau. Cấu trúc này rất gần với mô hình đối tượng trong các ngôn ngữ lập trình. **MongoDB** là hệ quản trị Document Database phổ biến nhất.
- **Graph (Đồ thị):** Được thiết kế để lưu trữ và xử lý dữ liệu có mức độ liên kết cao. Những ứng dụng điển hình gồm mạng xã hội, hệ thống gợi ý (Recommendation System), phát hiện gian lận và Knowledge Graph. **Neo4j** và **Giraph** là hai Graph Database nổi bật.
- **Wide Column (Cột rộng):** Phù hợp để lưu trữ khối lượng dữ liệu rất lớn với khả năng mở rộng mạnh. **Cassandra** và **HBase** là hai đại diện tiêu biểu của nhóm này.

Hình minh họa dưới đây được trích từ tài liệu chính thức của Microsoft: **Relational vs. NoSQL Data**.

![Mô hình dữ liệu NoSQL](https://oss.javaguide.cn/github/javaguide/database/mongodb/types-of-nosql-datastores.png)

## Tài liệu tham khảo

- NoSQL là gì? — Tài liệu chính thức của MongoDB: <https://www.mongodb.com/zh-cn/nosql-explained>
- NoSQL là gì? — AWS: <https://aws.amazon.com/cn/nosql/>
- So sánh NoSQL và SQL — Tài liệu chính thức của MongoDB: <https://www.mongodb.com/zh-cn/nosql-explained/nosql-vs-sql>

<!-- @include: @article-footer.snippet.md -->
