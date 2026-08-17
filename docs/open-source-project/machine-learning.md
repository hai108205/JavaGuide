---
title: Dự án AI mã nguồn mở Java chất lượng
description: Tuyển chọn các dự án AI mã nguồn mở dành cho Java, bao gồm Spring AI, LangChain4j, Deeplearning4j cùng nhiều framework trí tuệ nhân tạo và học máy nổi bật trong hệ sinh thái Java.
category: Dự án mã nguồn mở
icon: "mdi:robot-outline"
---

Rất nhiều bạn đã hỏi mình rằng: **AI đang bùng nổ như hiện nay, liệu lập trình viên Java chỉ có thể đứng ngoài cuộc chơi?**

**Thành thật mà nói, trước đây đúng là có phần lép vế.** Phần lớn các framework AI đều xoay quanh hệ sinh thái Python. Nhưng giờ thì mọi chuyện đã khác! Với sự phát triển mạnh mẽ của **Spring AI** cùng hàng loạt framework AI dành cho Java, lập trình viên Java giờ đây hoàn toàn có thể tích hợp các mô hình ngôn ngữ lớn (LLM) vào ứng dụng một cách tự nhiên, gần giống như cách chúng ta viết CRUD hằng ngày.

Hôm nay, hãy cùng điểm qua những framework AI mạnh mẽ và đáng chú ý nhất trong hệ sinh thái Java hiện nay.

## Framework nền tảng

### Spring AI

[Spring AI](https://github.com/spring-projects/spring-ai) là framework phát triển ứng dụng AI được **chính đội ngũ Spring phát triển**. Triết lý cốt lõi của dự án rất rõ ràng:

**Tích hợp khả năng AI một cách liền mạch vào hệ sinh thái Spring.**

Đối với những ai đã quen với Spring Boot, việc làm quen với Spring AI gần như không có rào cản. Framework này cung cấp một tập hợp các **khối xây dựng (building blocks)** cần thiết để phát triển ứng dụng AI:

- **Giao tiếp với mô hình (ChatClient):** Cung cấp API thống nhất để làm việc với nhiều mô hình ngôn ngữ lớn như OpenAI GPT, Ollama, Google Gemini...
- **Prompt:** Quản lý và xây dựng Prompt theo cấu trúc rõ ràng.
- **RAG (Retrieval-Augmented Generation):** Thông qua các abstraction như `VectorStore`, giúp dễ dàng triển khai RAG để kết hợp tri thức từ cơ sở dữ liệu bên ngoài với mô hình AI, nâng cao độ chính xác và tính cập nhật của câu trả lời.
- **Function Calling:** Cho phép mô hình AI gọi trực tiếp các phương thức được định nghĩa trong ứng dụng Java để tương tác với hệ thống bên ngoài.
- **ChatMemory:** Quản lý lịch sử hội thoại và ngữ cảnh của các cuộc trò chuyện nhiều lượt.

Tài liệu chính thức: <https://spring.io/projects/spring-ai#learn>.

### Spring AI Alibaba

[Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba) mở rộng hệ sinh thái Spring AI và được thiết kế dành riêng cho các **hệ thống đa tác tử (Multi-Agent)** cùng **Workflow Orchestration**.

Kiến trúc của dự án gồm ba tầng chính:

![Kiến trúc Spring AI Alibaba](https://oss.javaguide.cn/github/javaguide/open-source-project/ai/springai-alibaba-architecture-new.png)

- **Agent Framework:** Framework phát triển Agent lấy triết lý ReactAgent làm trung tâm, hỗ trợ tự động quản lý ngữ cảnh và tương tác giữa người dùng với AI.
- **Graph:** Framework cấp thấp dùng để điều phối Workflow và Multi-Agent, đóng vai trò runtime cho Agent Framework, giúp xây dựng các luồng nghiệp vụ phức tạp.
- **Augmented LLM:** Dựa trên abstraction của Spring AI, cung cấp các thành phần nền tảng như Model, Tool, MCP (Multimodal Components) và Vector Store.

Ngoài ra còn có nhiều thành phần phục vụ phát triển ở quy mô doanh nghiệp:

- **Admin:** Nền tảng Agent tất cả trong một, hỗ trợ phát triển trực quan, giám sát, đánh giá, quản lý MCP, tích hợp với các nền tảng low-code như Dify và hỗ trợ chuyển đổi DSL.
- **A2A (Agent-to-Agent):** Cho phép các Agent giao tiếp với nhau và tích hợp với Nacos để điều phối trong môi trường phân tán.

Tài liệu chính thức: <https://java2ai.com/>.

### LangChain4j

Nếu **Spring AI** là "đội quân chính quy" của hệ sinh thái Spring thì [LangChain4j](https://github.com/langchain4j/langchain4j) chính là framework LLM mạnh mẽ nhất trong cộng đồng Java hiện nay. Đây là phiên bản Java của LangChain.

Ưu điểm nổi bật của LangChain4j là:

- Hỗ trợ rất nhiều mô hình AI và Vector Database.
- Tốc độ cập nhật các mô hình mới cực nhanh.
- Hệ sinh thái tính năng rất đầy đủ.

Tuy nhiên, khi sử dụng trong các dự án Spring, đôi khi vẫn mang cảm giác như một framework "ngoại lai".

Nếu mục tiêu của bạn là:

- Chuyển đổi nhanh giữa nhiều mô hình AI.
- Hỗ trợ nhiều tính năng nhất.
- Xây dựng prototype trong thời gian ngắn.

thì LangChain4j thường là lựa chọn hàng đầu. Đổi lại, bạn sẽ phải tự đầu tư nhiều hơn vào kiến trúc, khả năng quản trị, quan sát hệ thống và xây dựng nền tảng.

Tài liệu chính thức: <https://docs.langchain4j.dev/>.

### AgentScope

[AgentScope](https://github.com/agentscope-ai/agentscope-java) là framework phát triển **Multi-Agent**, giúp xây dựng các ứng dụng AI dựa trên mô hình ngôn ngữ lớn một cách đơn giản và hiệu quả.

Nếu LLM là "bộ não" của một ứng dụng AI thì AgentScope chính là **hệ thần kinh trung ương và tay chân** của nó. Framework không chỉ cung cấp kiến trúc Multi-Agent mà còn tích hợp sẵn:

- Cơ chế suy luận ReAct.
- Function Calling.
- Quản lý bộ nhớ hội thoại.
- Khả năng phối hợp giữa nhiều Agent.

AgentScope cung cấp cả phiên bản **Python** và **Java**, với năng lực cốt lõi hoàn toàn tương đương.

**AgentScope cũng là dự án mã nguồn mở của Alibaba. Vậy nó khác gì với Spring AI Alibaba?**

- **AgentScope Java:** Được thiết kế theo triết lý **Agentic AI** ngay từ đầu. Trọng tâm là Agent, nhấn mạnh khả năng tự chủ, vòng lặp suy luận ReAct và sự hợp tác giữa nhiều Agent.
- **Spring AI Alibaba:** Tập trung nhiều hơn vào **Workflow Orchestration**, tận dụng hệ sinh thái Spring AI để tích hợp AI vào các quy trình nghiệp vụ đã được định nghĩa trước.

Tài liệu chính thức: <https://java.agentscope.io/zh/intro.html>.

### Các framework khác

- [Solon-AI](https://github.com/opensolon/solon-ai)：Framework phát triển ứng dụng AI cho Java, hỗ trợ LLM, RAG, MCP và Agent; tương thích từ Java 8 đến Java 25; tích hợp với Spring Boot, jFinal, Vert.x, Quarkus và nhiều framework khác.
- [Agent-Flex](https://github.com/agents-flex/agents-flex)：Framework phát triển ứng dụng LLM thanh lịch, nhẹ và đơn giản, được xây dựng bằng Java, định vị tương tự LangChain.
- [Deeplearning4j](https://github.com/eclipse/deeplearning4j)：Thư viện Deep Learning mã nguồn mở, phân tán và cấp doanh nghiệp đầu tiên dành cho Java và Scala.
- [Smile](https://github.com/haifengl/smile)：Thư viện Machine Learning dành cho Java và Scala.
- [GdxAI](https://github.com/libgdx/gdx-ai)：Framework AI viết hoàn toàn bằng Java dành cho phát triển game với libGDX.

### So sánh

| **Framework**         | **Đặc điểm nổi bật**                                                                                                                                                             | **Phù hợp với**                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Spring AI**         | Framework chính thức của Spring: hỗ trợ Model, Vector Store, Function Calling, Memory, RAG, Structured Output và khả năng quan sát; chú trọng tính mô-đun và khả năng di chuyển. | AI hóa các ứng dụng doanh nghiệp sử dụng Spring Boot.                                           |
| **Spring AI Alibaba** | Nền tảng sản xuất cho Agentic AI, Workflow và Multi-Agent: Agent Framework + Graph Runtime + Admin/Studio; hỗ trợ MCP, A2A và Nacos.                                             | Điều phối Multi-Agent, Workflow phức tạp, quản trị nền tảng và phát triển trực quan.            |
| **LangChain4j**       | Framework cộng đồng mạnh mẽ: API thống nhất cho nhiều LLM và Vector Store; hỗ trợ Agent, Tool, RAG, MCP; tích hợp Spring, Quarkus và Helidon.                                    | Prototype nhanh, hỗ trợ nhiều mô hình và yêu cầu tính linh hoạt cao.                            |
| **Solon-AI**          | Tương thích Java 8–25; hỗ trợ toàn bộ chuỗi LLM, RAG, MCP, Agent và AI Flow; dễ tích hợp với nhiều framework.                                                                    | Hệ thống cũ, môi trường đa framework và yêu cầu khả năng tương thích cao.                       |
| **Agent-Flex**        | Framework nhẹ, hỗ trợ LLM, Prompt, Tool, MCP, Memory, Embedding, Vector Store và xử lý tài liệu; tích hợp OpenTelemetry.                                                         | Phát triển ứng dụng LLM đơn giản nhưng vẫn có khả năng quan sát hệ thống.                       |
| **AgentScope Java**   | Thiết kế theo triết lý Agentic: ReAct, Tool, Memory, Multi-Agent; hỗ trợ MCP, A2A (Nacos), Reactor và GraalVM Serverless.                                                        | Hệ thống Agent tự chủ, Multi-Agent phân tán và các môi trường production yêu cầu hiệu năng cao. |

## Dự án thực chiến

### Nền tảng phỏng vấn thông minh

[interview-guide](https://github.com/Snailclimb/interview-guide) được xây dựng trên **Spring Boot 4.0 + Java 21 + Spring AI + PostgreSQL + pgvector + RustFS + Redis**, cung cấp các chức năng như:

- Phân tích CV bằng AI.
- Phỏng vấn mô phỏng với AI.
- Tra cứu tri thức bằng RAG.

Đây là một dự án rất phù hợp để học tập và đưa vào CV cá nhân vì dễ tiếp cận nhưng vẫn mang tính thực tế cao.

**Kiến trúc hệ thống như sau:**

> **Lưu ý:** Sơ đồ được vẽ bằng draw.io và xuất sang định dạng SVG. Khi xem trên GitHub ở chế độ Dark Mode có thể hiển thị chưa chính xác.

![Sơ đồ kiến trúc hệ thống](https://oss.javaguide.cn/xingqiu/pratical-project/interview-guide/interview-guide-architecture-diagram.png)

### Hệ thống điều phối Workflow AI

[PaiAgent](https://github.com/itwanger/PaiAgent) là **nền tảng điều phối Workflow AI trực quan cấp doanh nghiệp**, giúp việc kết hợp và điều phối các khả năng AI trở nên đơn giản và hiệu quả.

Thông qua giao diện kéo thả trực quan, cả lập trình viên lẫn người dùng nghiệp vụ đều có thể nhanh chóng xây dựng các quy trình AI phức tạp mà gần như không cần viết mã, đồng thời hỗ trợ phối hợp nhiều mô hình ngôn ngữ lớn khác nhau.

**Kiến trúc hệ thống như sau:**

![](https://oss.javaguide.cn/github/javaguide/open-source-project/ai/paiagent-architecture-diagram.jpg)
