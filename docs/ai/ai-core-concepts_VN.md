---
title: "Tổng quan các khái niệm cốt lõi của AI: LLM, Agent, RAG, MCP, Skills và ReAct"
description: Trích trực tiếp các khái niệm cốt lõi đã được tổng hợp trong chuyên đề AI của JavaGuide, nối liền LLM, Token, context window, Prompt, Function Calling, Agent Loop, ReAct, Plan-and-Execute, MCP, Skills, Embedding, vector retrieval, Rerank, GraphRAG... theo ba tuyến chính là nền tảng LLM, Agent và RAG.
category: AI
tag:
  - AI
  - LLM
  - AI Agent
  - RAG
  - MCP
head:
  - - meta
    - name: keywords
      content: Khái niệm cốt lõi AI,Khái niệm cốt lõi LLM,LLM,Token,Agent,Agent Loop,ReAct,Plan-and-Execute,RAG,Embedding,MCP,Skills,Prompt Engineering,Context Engineering,Function Calling,Tool Calling,GraphRAG
---

<!-- @include: @small-advertisement.snippet.md -->

Bài viết này chỉ trích nguyên văn và phân loại khái niệm, không viết lại các giải thích đã có. Dưới mỗi module cấp hai đều tổng hợp các liên kết bài gốc liên quan; muốn đọc sâu toàn bộ context có thể bấm vào bài gốc để tiếp tục đọc.

## Nền tảng LLM

Bài gốc liên quan:

- [Cơ chế vận hành LLM: Token, context window và tham số sampling ảnh hưởng đến output như thế nào](./llm-basis/llm-operation-mechanism.md)
- [Prompt Engineering của LLM là gì? Có những kỹ thuật prompt nào?](./agent/prompt-engineering.md)
- [Output có cấu trúc của LLM: từ JSON contract đến triển khai Function Calling](./llm-basis/structured-output-function-calling.md)

### LLM

Khi bạn gõ "hôm nay thời tiết thật" trong bộ gõ, nó sẽ tự động gợi ý "đẹp" — việc LLM làm về bản chất cũng tương tự. Chỉ khác là nó không nhìn vài chữ phía trước, mà nhìn vài nghìn thậm chí vài trăm nghìn chữ phía trước. Mỗi lần chỉ "bổ sung" một Token (mảnh văn bản), rồi thêm mảnh này vào context, rồi dự đoán mảnh tiếp theo, cứ lặp như vậy cho đến khi tạo ra câu trả lời hoàn chỉnh.

Quá trình này gọi là **Autoregressive Generation (sinh tự hồi quy)**.

Hiểu được việc sinh tự hồi quy, mọi khái niệm phía sau đều dễ xử lý:

- **Token**: mảnh văn bản mà model "bổ sung" ở mỗi bước.
- **Context window**: giới hạn tổng Token tối đa model có thể xử lý trong một lần gọi; system prompt, lịch sử tin nhắn, input hiện tại và ngân sách output đều chiếm dụng.
- **Temperature / Top-p**: chiến lược model chọn ứng viên mảnh nào.
- **Max Tokens**: cho phép model "bổ sung" tối đa bao nhiêu bước.

### Token

Bạn có thể hiểu Token là "đơn vị đọc" của model. Con người chúng ta đọc tiếng Trung thì xem từng chữ, đọc tiếng Anh thì xem từng từ. Nhưng model không cắt theo chữ, cũng không cắt theo từ — nó dùng một bộ "quy tắc tách chữ" riêng (gọi là Tokenizer) để cắt văn bản thành các mảnh có kích thước không đều nhau, mỗi mảnh là một Token.

Vì sao không cắt trực tiếp theo chữ hoặc theo từ? Vì model cần cân bằng giữa "kích thước từ vựng" và "độ dài chuỗi":

- Mỗi chữ Hán là một Token, từ vựng nhỏ, nhưng chuỗi dài (model phải "bổ sung" nhiều bước hơn).
- Mỗi từ là một Token, chuỗi ngắn, nhưng từ vựng sẽ nổ tung (tổ hợp từ tiếng Trung quá nhiều).

Vậy nên thực tế dùng giải pháp trung dung — **thuật toán tách từ con (subword)** (như BPE, Unigram), từ tần suất cao giữ nguyên làm một khối, từ tần suất thấp tách thành các mảnh nhỏ hơn.

Bạn có thể hình dung Token như khối Lego. Các "khối" thường dùng thì to hơn (ví dụ "你好" có thể là một Token), từ không thường dùng sẽ bị tách thành các khối cơ bản nhỏ hơn để ghép lại.

Token không tương đương nghiêm ngặt với "một chữ" hay "một từ":

- Tiếng Anh có thể một từ bị tách thành nhiều Token.
- Tiếng Trung có thể một từ bị tách thành nhiều Token, cũng có thể nhiều chữ gộp thành một Token (tùy thuộc tần suất từ và bảng từ vựng).

Về mặt kỹ thuật, người ta thường dùng **ước tính kinh nghiệm** để lập kế hoạch dung lượng, và dùng **usage do API thực tế trả về** để tính phí và giám sát chính xác.

**Ví dụ quá trình Token hóa**:

- Bản gốc: `你好，我是小 G。`
- Tách: `[你好]` `[，]` `[我是]` `[小 G]` `[。]`
- Thống kê: bản gốc 9 ký tự → số Token 5 → tỷ lệ nén khoảng 1.8 lần

![Ví dụ quá trình Token hóa](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-token-process.png)

Lưu ý: việc tách Token thực tế do Tokenizer của nhà cung cấp model triển khai, các nhà cung cấp khác nhau có thể tạo ra chuỗi Token khác nhau cho cùng một văn bản.

### Context window

**Context window** là "working memory (bộ nhớ làm việc)" của LLM. Nó quyết định lượng văn bản (tính bằng Token) mà model có thể xử lý hoặc "ghi nhớ" tại bất kỳ thời điểm nào.

- Tính liên tục của hội thoại: quyết định model có thể thực hiện hội thoại đa vòng dài bao nhiêu mà không quên các chi tiết ban đầu.
- Khả năng xử lý một lần: quyết định tài liệu, codebase hoặc mẫu dữ liệu tối đa model có thể xử lý trong một lần.

"Model hỗ trợ 128K/200K/1M" nghĩa là giới hạn tổng Token tối đa có thể đưa vào model trong một lần gọi. Context window của hầu hết model bao gồm tổng của input và output, nhưng một số nhà cung cấp (như Google Gemini) đặt giới hạn riêng cho input và output; trước khi dùng hãy tra cứu tài liệu API cụ thể.

Context window thường bị chiếm dụng bởi các chi phí ẩn:

![Context window = "Bộ nhớ làm việc" của LLM](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-context-window.png)

- System Prompt: chỉ thị hệ thống điều chỉnh hành vi của model (ẩn với người dùng, nhưng chiếm window).
- User Prompt: dữ liệu nghiệp vụ và chỉ thị.
- Lịch sử hội thoại đa vòng: các bản ghi tin nhắn trước đây.
- Đoạn truy vấn RAG: thông tin bổ sung được truy vấn từ knowledge base bên ngoài.
- Schema gọi tool: định nghĩa hàm và cấu trúc tham số.
- Chi phí format: ký tự đặc biệt, ký tự xuống dòng, đánh dấu Markdown...
- Token output do model sinh ra: **output cũng chiếm context window**.

Vì vậy, "nội dung nghiệp vụ hiệu dụng" bạn thực sự có thể nhét vào Prompt thường nhỏ hơn nhiều so với giới hạn ghi chú.

### Tham số sampling

Ở mỗi bước, model cho mỗi Token ứng viên trong bảng từ vựng một điểm số (bên trong gọi là **logits**), điểm càng cao nghĩa là model càng đánh giá từ này nên xuất hiện ở đây.

Ví dụ, giả sử model đang bổ sung "hôm nay thời tiết thật\_\_", nó có thể đưa ra điểm số như vậy:

| Token ứng viên | Điểm gốc (logit) |
| -------------- | ---------------- |
| đẹp            | 5.0              |
| ổn             | 3.2              |
| tốt            | 2.1              |
| tệ             | 0.5              |
| tím            | -8.0             |

Nhưng điểm gốc không phải là xác suất — cần qua một phép biến đổi toán học (**softmax**) để trở thành xác suất mỗi ứng viên được chọn. Sau biến đổi thì gần như:

| Token ứng viên | Xác suất |
| -------------- | -------- |
| đẹp            | 62%      |
| ổn             | 20%      |
| tốt            | 10%      |
| tệ             | 5%       |
| tím            | ≈ 0%     |

Cuối cùng, model theo phân bố xác suất này "bốc thăm" (sampling), quyết định xuất ra Token nào.

Các tham số giải mã (Temperature, Top-p, Top-k...) chính là áp đặt kiểm soát trong quá trình "chấm điểm → xác suất → bốc thăm" này:

- Temperature: điều chỉnh "hình dạng" phân bố xác suất, khiến phương án điểm cao nổi bật hơn, hoặc khiến các phương án đồng đều hơn.
- Top-p / Top-k: trực tiếp cắt bỏ các ứng viên không đáng tin, thu nhỏ "rổ bốc thăm".
- Nhóm Penalty: hạ điểm các từ đã xuất hiện, phòng "máy đọc lại".

![Tham số Temperature: kiểm soát tính ngẫu nhiên của output model](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-temperature-params.png)

### Prompt

Nói đơn giản, Prompt chính là chỉ thị chúng ta nhập vào cho LLM.

Từ cơ chế sinh, LLM sẽ sinh các Token tiếp theo dựa trên context; từ hiệu quả ứng dụng, nó có thể thể hiện khả năng hiểu nghĩa và tuân theo chỉ thị nhất định. Nhưng khả năng này phụ thuộc vào context đầu vào, ranh giới không rõ ràng thì dễ đi lệch hướng hoặc bịa đặt.

Việc Prompt cần làm, chính là thu nhỏ phạm vi tìm kiếm của model.

Chỉ thị càng mơ hồ, model càng dễ đoán bừa. Chỉ thị càng có cấu trúc, output càng dễ được kiểm soát.

Prompt viết tốt hay không, không nhìn độ dài, mà nhìn có nói rõ nhiệm vụ hay không.

Một Prompt đạt chuẩn, thường cần nêu bốn điều: Role, Task, Context, Format.

![Khung bốn yếu tố của Prompt](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/prompt-four-element-framework.svg)

| Yếu tố             | Vai trò                                             | Cách diễn đạt thường gặp                                  |
| ------------------ | --------------------------------------------------- | --------------------------------------------------------- |
| Role (vai trò)     | Bảo model dùng kiến thức và giọng điệu lĩnh vực nào | "Bạn là kiến trúc sư Java 10 năm kinh nghiệm"             |
| Task (nhiệm vụ)    | Nêu rõ phải hoàn thành hành động gì                 | "Hãy review vấn đề hiệu năng của đoạn code sau"           |
| Context (ngữ cảnh) | Bổ sung bối cảnh liên quan nhiệm vụ                 | "QPS online hiện tại 2000, thời gian phản hồi vượt 500ms" |
| Format (định dạng) | Quy định output trông như thế nào                   | "Xuất ra JSON, gồm hai trường bottleneck, solution"       |

### Output có cấu trúc

Trước tiên xem một Prompt rất phổ biến:

```text
Hãy xác định phản hồi của người dùng dưới đây thuộc loại ticket nào, trả về JSON.

Phản hồi người dùng: Tôi thanh toán thành công, nhưng đơn hàng vẫn hiển thị đang chờ thanh toán.
```

Model có thể trả về:

```json
{
  "category": "payment",
  "priority": "high",
  "reason": "用户付款成功但订单状态未更新"
}
```

Trông có vẻ không sao. Nhưng đó chỉ là "trông có vẻ".

Khi bạn kết nối nó vào hệ thống Backend, thứ bạn thực sự cần là một contract có thể được chương trình tiêu thụ ổn định. Ví dụ:

- `category` chỉ có thể là `PAYMENT`, `LOGISTICS`, `AFTER_SALE`, `ACCOUNT`.
- `priority` chỉ có thể là `LOW`, `MEDIUM`, `HIGH`.
- `confidence` phải là số thập phân từ `0` đến `1`.
- `reason` có thể rỗng không? Độ dài tối đa là bao nhiêu?
- Nếu input của người dùng thiếu thông tin, nên trả về `NEED_MORE_INFO`, hay tiếp tục đoán?

Prompt ngôn ngữ tự nhiên rất khó giữ vững các ranh giới này lâu dài. Có 5 loại điểm hay gặp sự cố.

Nhiều người gộp lẫn JSON Mode, JSON Schema, Structured Outputs với nhau, khi phỏng vấn cũng dễ trả lời lộn xộn. Nhưng chúng thực ra không nằm cùng một tầng:

- **JSON Mode** là một chế độ output, ràng buộc model trả về JSON hợp lệ.
- **JSON Schema** là một chuẩn mô tả cấu trúc, dùng để định nghĩa JSON nên chứa những trường nào, loại trường là gì, trường nào bắt buộc, giá trị enum nào, có cho phép trường bổ sung hay không.
- **Structured Outputs** là năng lực sinh có cấu trúc do nhà cung cấp model cung cấp, nó nhận JSON Schema hoặc Schema tương tự, khiến model ở giai đoạn sinh cố gắng hết hoặc bám sát nghiêm ngặt cấu trúc này.

Nói cách khác, JSON Schema không phải tự nó là cách output có cấu trúc, mà là "định dạng contract" thường dùng cho output có cấu trúc. Thứ thực sự khiến model sinh theo contract, là Structured Outputs, Function Calling / Tool Calling và các năng lực API model khác.

![Ràng buộc ba tầng ở giai đoạn sinh: JSON Mode quản cú pháp, JSON Schema quản contract, Structured Outputs chuyển contract về trước giai đoạn sinh của model](https://oss.javaguide.cn/github/javaguide/ai/llm/structured-output-function-calling-three-layer-constraint.png)

### Function Calling / Tool Calling

Cái tên Function Calling rất dễ gây hiểu nhầm cho người mới. Nhiều người nghĩ "model gọi hàm", như thể model thực sự chạy method Java của bạn.

Không phải.

Model không trực tiếp chạy code Backend của bạn. Điều nó làm là: dựa trên câu hỏi của người dùng và mô tả tool, sinh ra một ý định gọi tool có cấu trúc. Thứ thực sự thực thi tool là dịch vụ nghiệp vụ của bạn, Agent Runtime, MCP Host hoặc môi trường do nhà cung cấp lưu trữ.

Một chuỗi gọi tool điển hình như sau:

![Chuỗi gọi hoàn chỉnh Function Calling: model chỉ sinh ý định gọi, thứ thực sự thực thi tool là phía nghiệp vụ](https://oss.javaguide.cn/github/javaguide/ai/llm/structured-output-function-calling-function-calling-pipeline.png)

Tách thành các bước kỹ thuật:

1. **Server đăng ký định nghĩa tool**: gồm tên tool, mô tả công dụng, Schema tham số.
2. **Người dùng phát khởi request**: ví dụ "giúp tôi tra xem đơn hàng 1029384756 đến đâu rồi".
3. **Model chọn tool**: model phán đoán cần gọi `query_order`, và sinh tham số `{"orderId": "1029384756"}`.
4. **Phía nghiệp vụ kiểm tra tham số**: kiểm tra loại, bắt buộc, quyền, quyền sở hữu đơn hàng, khóa idempotent...
5. **Phía nghiệp vụ thực thi tool**: gọi hệ thống đơn hàng, cơ sở dữ liệu hoặc HTTP API.
6. **Kết quả tool điền lại model**: gửi kết quả truy vấn kèm `tool_use_id` nguyên vẹn trở lại model. Anthropic yêu cầu `tool_use_id` khớp nghiêm ngặt, Gemini 3 cũng tạo `id` duy nhất cho mỗi `functionCall`, khi điền lại phải mang theo, nếu không trong kịch bản gọi song song kết quả sẽ bị đánh tráo.
7. **Model sinh câu trả lời cuối cùng**: model chuyển kết quả có cấu trúc thành phản hồi mà con người hiểu được.

## Agent

Bài gốc liên quan:

- [Khái niệm cốt lõi của AI Agent: Agent Loop, Plan-and-Execute, A2A, Agentic Workflows, đăng ký Tools](./agent/agent-basis.md)
- [Workflow, Graph và Loop trong AI Workflow: từ khái niệm đến triển khai](./agent/workflow-graph-loop.md)
- [Context Engineering là gì? Khác gì với Prompt Engineering?](./agent/context-engineering.md)
- [Hệ thống Memory của AI Agent: short-term memory, long-term memory và cơ chế tiến hóa memory](./agent/agent-memory.md)
- [Model Context Protocol (MCP) là gì? Có quan hệ gì với Function Calling, Agent?](./agent/mcp.md)
- [Agent Skills là gì? Khác biệt thực chất với Prompt, MCP ở đâu?](./agent/skills.md)
- [Hiểu hết Harness Engineering: kiến trúc sáu tầng, quản lý context và thực chiến của team hàng đầu](./agent/harness-engineering.md)
- [Loop Engineering là gì? Vì sao nói nó là "bia cũ rót chai mới"?](./agent/loop-engineering.md)

### Agent là gì?

Nếu bạn xem mã nguồn Agent của LangChain, sẽ phát hiện phần lõi của nó không hề thần bí, nhiều khi chỉ là một vòng while.

AI Agent có thể hiểu là một hệ thống phần mềm biết cảm nhận môi trường, ra quyết định, thực thi hành động. LLM chịu trách nhiệm hiểu và ra quyết định, tool chịu trách nhiệm thực thi, memory chịu trách nhiệm lưu giữ context và kinh nghiệm lịch sử.

Khác biệt của nó với chatbot thông thường nằm ở: Agent không chỉ phản hồi tin nhắn, mà sẽ trong môi trường động liên tục quan sát, phán đoán, thực thi, cho đến khi nhiệm vụ kết thúc.

Nói chung có thể tóm gọn bằng công thức: **Agent = LLM + Planning + Memory + Tools** .

![Kiến trúc cốt lõi của AI Agent](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-core-arch.png)

**Reasoning / Planning (suy luận và lập kế hoạch)**: dùng LLM phân tích trạng thái nhiệm vụ hiện tại, phân rã mục tiêu, quyết định bước tiếp theo làm gì. Kỹ thuật prompt Chain-of-Thought (CoT) có thể khiến model suy luận từng bước, giảm xác suất trả lời vội vàng theo cảm tính.

Memory chia hai tầng. Short-term memory thường là lịch sử context, dùng để duy trì tính liên tục của hội thoại; long-term memory thường là knowledge base bên ngoài, như cơ sở dữ liệu vector hoặc knowledge graph. Short-term memory giải quyết "vừa nói gì", long-term memory giải quyết "trước đây tích lũy được gì".

**Tools (công cụ)**: giúp LLM thực sự thao tác thế giới bên ngoài, như tra dữ liệu, gọi API, đọc file, chạy code. Không có tool, nhiều khi Agent chỉ dừng ở "gợi ý bạn nên làm thế nào".

Sau khi tool thực thi sẽ trả về kết quả, Agent đưa các kết quả này vào lại context, rồi bước vào vòng suy luận tiếp theo. Vòng phản hồi khép kín này chính là Observation (quan sát), cũng là chìa khóa để Agent Loop quay được.

### Agent Loop

Agent Loop là nơi Agent thực sự chạy.

Mỗi vòng nó làm khoảng ba việc: cho LLM suy luận, gọi tool, ghi kết quả tool về context. Cứ lặp lại cho đến khi nhiệm vụ hoàn thành hoặc chạm điều kiện dừng.

![Luồng hoạt động của Agent Loop](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-loop-flow.png)

Luồng đại khái như vậy:

1. Khi khởi tạo load System Prompt, danh sách tool khả dụng, request ban đầu của người dùng
2. Lặp vòng — đọc context, LLM suy luận quyết định bước tiếp theo (gọi tool hay phản hồi trực tiếp), kích hoạt và thực thi tool, chụp kết quả trả về nối thêm vào context
3. LLM phán đoán nhiệm vụ hoàn thành, không còn gọi tool thì thoát vòng lặp
4. Lưới an toàn phía dưới — phòng vòng lặp vô hạn, đặt giới hạn số vòng lặp tối đa (thường 10 đến 20 vòng) hoặc ngưỡng tiêu hao Token

Khó khăn kỹ thuật không nằm ở bản thân vòng while, mà nằm ở quản lý context.

Nhiệm vụ chạy càng lâu, context càng dài. Thông tin then chốt bị pha loãng, model dễ đi lệch hướng. Đây cũng là vấn đề mà Context Engineering cần giải quyết.

Các framework như LangChain, LlamaIndex, Spring AI đều đóng gói Agent Loop, nhưng tư duy tầng dưới gần như giống nhau.

### ReAct

ReAct là Reasoning + Acting, do Shunyu Yao và cộng sự đề xuất năm 2022, paper là [《ReAct: Synergizing Reasoning and Acting in Language Models》](https://react-lm.github.io/).

Module Agent trong các framework như LangChain, LlamaIndex, AgentScope, nhiều cái đều thấy bóng dáng của mô hình này.

Tư duy của nó rất trực quan: model trước tiên suy luận một bước, nhận phản hồi từ môi trường bên ngoài, rồi suy luận bước tiếp theo, luân phiên nhau.

LLM tự nó dễ thiếu thông tin thời gian thực, cũng dễ bịa. ReAct khiến nó "đi một bước nhìn một bước", mỗi bước đều tiếp tục phán đoán theo kết quả tool trả về.

![ReAct-LLM](https://oss.javaguide.cn/github/javaguide/ai/agent/ReAct-LLM.png)

Khi triển khai ReAct thường cần mấy thành phần phối hợp:

1. Lịch sử context, lưu các bước suy luận, hành động thực thi, quan sát phản hồi
2. Input môi trường thời gian thực, như cảnh báo hệ thống, phản hồi người dùng... các biến bên ngoài
3. Module suy luận LLM: chịu trách nhiệm phân tích logic và lập kế hoạch bước tiếp theo
4. Bộ công cụ và thư viện kỹ năng, gồm tool nguyên tử và Skills
5. Cơ chế quan sát phản hồi, thu thập phản hồi tool và nối thêm vào context

![Luồng mô hình ReAct](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-react-flow.png)

Ưu điểm của ReAct là giảm được hallucination, nhiệm vụ phức tạp tỷ lệ thành công cao hơn, cũng dễ giải thích vì sao mỗi bước lại làm vậy.

Cái giá cũng rõ ràng: nhiều vòng lặp làm tăng độ trễ phản hồi, hiệu quả còn phụ thuộc rất nhiều vào chất lượng tool và Skills.

### Plan-and-Execute

Plan-and-Execute là mô hình do team LangChain đề xuất năm 2023.

Cách làm của nó là trước tiên cho LLM đặt ra kế hoạch phân bước toàn cục, rồi executor hoàn thành theo từng bước.

Nó phù hợp với nhiệm vụ dài có nhiều bước, quan hệ phụ thuộc rõ ràng. So với ReAct vừa nghĩ vừa làm, nó ít bị lạc đường trong nhiệm vụ dài hơn.

Nhưng nó cũng có vấn đề. Kế hoạch một khi đã định, khả năng điều chỉnh động và dung sai trong quá trình thực thi sẽ yếu hơn, gần với workflow tĩnh hơn.

Trong dự án thực tế, hai mô hình có thể kết hợp.

Trước tiên dùng CoT tạo các bước toàn cục, rồi trong mỗi bước nhúng vòng con ReAct. Như vậy vừa có cấu trúc toàn cục, vừa giữ được tính linh hoạt cục bộ.

### Workflow, Graph và Loop

Trước đó cứ nói "workflow", nhưng nếu không làm rõ khác biệt của nó với Agent, sau này khi chọn lựa rất dễ loạn.

Nhiều người nghe đến Agent, liền mặc định nên để model tự lập kế hoạch, tự gọi tool, tự chạy hết toàn bộ quá trình. Nghe có vẻ thông minh, nhưng triển khai thực tế chưa chắc ổn định.

Trong Agent thuần, LLM là người ra quyết định. Mỗi bước có gọi tool không, gọi tool nào, bước tiếp theo đi thế nào, chủ yếu dựa vào suy luận của model. Bạn giao cho nó một nhiệm vụ, nó tự thử chạy hết nhiệm vụ đó.

Trong AI Workflow, LLM chỉ là một node trong luồng. Khung xương của toàn bộ luồng, như thứ tự các bước, rẽ nhánh theo điều kiện, retry khi thất bại, đều do bạn thiết kế trước. Quyền kiểm soát nằm trong cấu trúc Graph, không nằm trong tay model.

Agentic Workflows thì dùng xen kẽ cả hai: toàn cục dùng Workflow giữ chặt cấu trúc, trong một số node không xác định nhúng vòng con Agent, để model tự khám phá một đoạn ngắn.

Cấu trúc dữ liệu của AI Workflow là đồ thị có hướng (Graph), ba thành phần: Node (nút) chịu trách nhiệm thực thi, Edge (cạnh) chịu trách nhiệm luồng điều khiển, State (trạng thái) chia sẻ context giữa các node.

### Context Engineering

Nhiều khi Agent làm không tốt, không phải năng lực model kém, mà là context quá loạn.

Việc Context Engineering làm, là trong cửa sổ Token có hạn, đưa thông tin hữu ích nhất cho model, chặn nhiễu bên ngoài. Nó rất dễ bị gộp lẫn với Prompt Engineering.

Prompt Engineering thiên về prompt viết như thế nào, Context Engineering quản rộng hơn, gồm quy tắc, memory, mô tả tool, trạng thái phiên hội thoại, kết quả quan sát bên ngoài, ngân sách Token.

![Khác biệt Context Engineering và Prompt Engineering](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/context-engineering-vs-context-engineering-dimension-comparison.png)

Phần này khai triển ra nội dung rất nhiều, có thể xem riêng bài này: [《Prompt Engineering》](https://javaguide.cn/ai/agent/prompt-engineering.html) và [《Context Engineering》](https://javaguide.cn/ai/agent/context-engineering.html).

### Memory

![Sơ đồ toàn cảnh phân loại Memory của Agent](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-memory-taxonomy.svg)

Hệ thống memory thường chia hai tầng: short-term memory và long-term memory. Short-term memory mang tính Session, phục vụ nhiệm vụ hiện tại; long-term memory mang tính xuyên Session, chịu trách nhiệm lắng đọng sở thích người dùng, quyết định lịch sử, kinh nghiệm quá khứ. Hai cái về mặt vật lý lẫn logic đều nên tách riêng, đừng trộn thành một mớ.

![Kiến trúc hệ thống Memory của AI Agent](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-arch.png)

Theo mục đích chức năng, Memory của Agent có thể chia thành ba loại.

| Loại chức năng  | Vấn đề cốt lõi         | Nội dung lưu trữ                                               | Kịch bản điển hình                              |
| --------------- | ---------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Factual memory  | Agent biết gì          | Sở thích người dùng, trạng thái môi trường, sự kiện tường minh | Ghi nhớ sở thích tech stack của người dùng      |
| Episodic memory | Agent cải tiến thế nào | Quỹ đạo quá khứ, bài học thành bại, tri thức chiến lược        | Học từ code review thất bại                     |
| Working memory  | Agent đang nghĩ gì     | Context suy luận hiện tại, tiến độ nhiệm vụ                    | Trạng thái trung gian trong suy luận nhiều bước |

Long-term memory và RAG về mặt kỹ thuật rất giống nhau, đều dùng vector store và semantic retrieval. Nhưng đối tượng chúng phục vụ không giống nhau.

RAG gắn nguồn tri thức dùng chung, như quy chế công ty, tài liệu sản phẩm, kết quả truy vấn database thời gian thực. Những nội dung này không ràng buộc mạnh với "ai đang dùng", với các người dùng khác nhau thường trả về cùng một bộ nội dung knowledge base. Đặc trưng cốt lõi của RAG là phi cá nhân hóa, không nhất thiết là tĩnh; kết quả truy vấn database thời gian thực cũng có thể kết nối vào RAG.

Long-term memory quản lý kinh nghiệm cá nhân hóa được lắng đọng động trong quá trình Agent tương tác với người dùng cụ thể, như sở thích, thói quen, quyết định lịch sử, bối cảnh riêng của người dùng. Nó có tính cá nhân hóa cao, mỗi người mỗi khác.

![Khác biệt giữa long-term memory và RAG (Retrieval-Augmented Generation)](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-rag-vs-memory.svg)

### MCP

MCP là viết tắt của Model Context Protocol, tiếng Việt thường gọi là "giao thức ngữ cảnh mô hình".

Tách tên đầy đủ của MCP ra xem, thực ra đã rất rõ ràng:

- Model: hướng tới ứng dụng LLM;
- Context: đưa context bên ngoài, tool và nguồn dữ liệu đến cho model;
- Protocol: dùng một bộ giao thức chuẩn để định ra cách thức tương tác.

Tuy nhiên, cũng đừng hiểu MCP đơn giản là thêm plugin cho model. Trước đây khi thảo luận MCP trong nhóm knowledge planet, không ít bạn đều nghĩ như vậy.

Nói chính xác hơn một chút, MCP là **giao thức truyền thông giữa MCP Client và MCP Server**. Host chịu trách nhiệm gánh tương tác người dùng và gọi model, Client chịu trách nhiệm nói chuyện với Server, Server chịu trách nhiệm phơi bày năng lực cụ thể ra ngoài.

![Sơ đồ MCP](https://oss.javaguide.cn/github/javaguide/ai/skills/mcp-simple-diagram.png)

Không ít độc giả lần đầu tìm hiểu MCP, đều sẽ trộn nó với Function Calling, Agent, Skills.

Mấy cái này quả thực thường xuất hiện cùng nhau, nhưng không nằm cùng một tầng.

Function Calling giải quyết: **model diễn đạt việc mình muốn gọi tool như thế nào.**

MCP giải quyết: **tool này từ đâu đến, được host phát hiện như thế nào, thực sự kết nối vào dịch vụ Backend ra sao.**

Agent ở trên thêm một tầng, quan tâm: **nhiệm vụ được làm dần từng bước như thế nào.**

![Sơ đồ quan hệ ba tầng FC/MCP/Agent](https://oss.javaguide.cn/github/javaguide/ai/skills/mcp-fc-agent-layer.png)

### Skills

Nói đơn giản, Skill là một bản mô tả nhiệm vụ có thể được Agent phát hiện và tải theo nhu cầu.

Nó lắng đọng kinh nghiệm, ràng buộc và thứ tự thực thi của một loại nhiệm vụ, để Agent khi cần mới đọc. Định dạng trả về của interface thống nhất thế nào, trường log đánh thế nào, slow SQL truy vấn ra sao, Review thì xem kiến trúc trước hay xem xử lý ngoại lệ trước — trước đây những thứ này hoặc nằm rải rác trong tài liệu, hoặc phải dựa vào người nhắc đi nhắc lại, Skills cho chúng một chỗ đứng cố định.

Vậy nên, đừng nghĩ Skill là một năng lực mới thần bí. Nó giống như việc "viết quy tắc trong đầu của nhân viên lâu năm" vào `SKILL.md`, rồi giao cho Agent gọi trong nhiệm vụ phù hợp.

Nói kết luận trước: Skill không phải là thứ thay thế Prompt, MCP, Function Calling, chúng cũng không phải bốn sản phẩm cạnh tranh cùng một tầng. Đặt vào một chuỗi thực thi Agent để xem, quan hệ sẽ rõ ràng nhiều.

Người dùng nói một câu "giúp tôi phân tích báo cáo này", đây là **Prompt**. Model phán đoán cần gọi `read_file`, và sinh tham số có cấu trúc, đây là **Function Calling**. Nếu năng lực `read_file` này đến từ MCP Server, thì **MCP** chịu trách nhiệm kết nối và giao thức. Còn "khi phân tích báo cáo trước tiên xem ý nghĩa trường, rồi xem giá trị bất thường, cuối cùng đưa kết luận nghiệp vụ, đừng trực tiếp chất đống chỉ số thống kê", đây mới là thứ thích hợp để đặt vào **Skill**.

![So sánh Skill với Prompt, MCP, Function Calling](https://oss.javaguide.cn/github/javaguide/ai/skills/skill-prompt-function-calling-mcp-comparison.webp)

Đặt trong một chuỗi thực tế, đại khái như vậy:

![Chuỗi thực thi Agent](https://oss.javaguide.cn/github/javaguide/ai/skills/skill-agent-execution-link.webp)

1. Người dùng đề xuất nhiệm vụ (Prompt)
2. Host đưa mô tả ngắn của các Skills khả dụng vào context (metadata Skill)
3. Model phán đoán nhiệm vụ hiện tại trúng vào Skill nào (định tuyến Skill)
4. Host lại load toàn bộ `SKILL.md` vào (lazy loading)
5. Model theo quy trình trong Skill đi gọi tool, đọc tài liệu, viết kết quả (thực thi)

### Harness Engineering

Có thể dùng một cách nói thô nhưng dễ nhớ: Agent = Model + Harness. Bạn không phải là model, thì thứ bạn làm phần lớn có khả năng là Harness.

Cách nói này hơi tuyệt đối, nhưng nắm được trọng điểm. Harness chỉ toàn bộ hệ thống ngoài model: system prompt, gọi tool, hệ thống tệp, môi trường sandbox, logic dàn xếp, middleware hook, vòng phản hồi, cơ chế ràng buộc. Model chỉ cung cấp năng lực suy luận và sinh, Harness xâu chuỗi trạng thái, tool, phản hồi, môi trường thực thi và ranh giới bảo mật, Agent mới thực sự bắt đầu làm việc được.

Vivek Trivedi của LangChain từng viết bài 《The Anatomy of an Agent Harness》, trong đó có một tư duy đáng nhớ: trước tiên phân rõ model chịu trách nhiệm gì, rồi xem hệ thống còn lại cần bổ sung gì. Lấy đường này mà cắt, nhiều vấn đề Agent không còn là "model có được không", mà là "hệ thống đã chuẩn bị xong thứ model cần chưa".

Có thể hình dung model như CPU, Harness như hệ điều hành. CPU mạnh đến đâu, OS mà ngày nào cũng sập thì trải nghiệm cũng chẳng ra gì. Bạn mua chip M5 mới nhất, nhưng hệ thống treo, driver chạy lung tung, trải nghiệm thực tế có khi còn tệ hơn chip cũ đi kèm hệ thống ổn định.

![Agent = Model + Harness](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-agent-equals-model-harness-arch.png)

Prompt Engineering, Context Engineering, Harness Engineering không thích hợp để so sánh cùng một tầng. Chúng giống như lồng vào nhau từng lớp một, phạm vi vấn đề xử lý ngày càng lớn.

![Quan hệ giữa Harness với Prompt/Context Engineering](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-engineering-layers-arch.png)

| Tầng                | Vấn đề giải quyết                                                  | Điểm chú ý                                                              | Công việc điển hình                                                     |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Prompt Engineering  | Nói rõ chỉ thị như thế nào                                         | Khiến model hiểu ý định, giảm mơ hồ cục bộ                              | Thiết kế system prompt, ví dụ Few-shot, dẫn dắt chuỗi suy nghĩ          |
| Context Engineering | Nên cho Agent xem gì                                               | Cung cấp thông tin đúng và cần thiết cho model đúng thời điểm           | Quản lý context, RAG, tiêm memory, tối ưu Token                         |
| Harness Engineering | Hệ thống thực thi liên tục, sửa lệch, quan sát và phục hồi thế nào | Tính đúng liên tục trong nhiệm vụ chuỗi dài, sửa sai lệch, phục hồi lỗi | Hệ thống tệp, sandbox, thực thi ràng buộc, vòng phản hồi, observability |

### Loop Engineering

Nếu dùng một câu tóm tắt, có thể hiểu như vậy:

**Loop Engineering là thiết kế vòng phản hồi có thể vận hành bền vững quanh Agent, khiến nó hành động lặp đi lặp lại trong mục tiêu, tool, context, tín hiệu xác minh và điều kiện dừng rõ ràng, cho đến khi nhiệm vụ hoàn thành, thất bại hoặc cần người tham gia.**

Chuyển sang mặt kỹ thuật, chủ yếu xem các điểm này:

- Trigger: ai khởi động vòng nhiệm vụ này? lệnh thủ công, tác vụ định giờ, CI thất bại, tạo PR, cập nhật Issue, hay sự kiện tin nhắn nào đó.
- Mục tiêu: trạng thái nào coi là hoàn thành? toàn bộ test pass, CI green, coverage đạt con số nào đó, ảnh chụp trang khớp bản thiết kế, hay chỉ tạo bản thảo chờ người xác nhận.
- Context: mỗi vòng Agent cần xem những file, quy tắc, trạng thái lịch sử, kết quả tool và quy ước dự án nào.
- Hành động: Agent có thể sửa code, chạy test, tra GitHub, đọc log, gửi PR, hay chỉ có thể xuất ra gợi ý.
- Quan sát: nó biết bước vừa rồi làm đúng bằng cách nào? output test, lint, type check, ảnh chụp, nhận xét review, tóm tắt log đều có thể là kết quả quan sát.
- Trạng thái: vòng này đã thử gì, hỏng ở đâu, bước tiếp theo làm gì, phải ghi ra file ngoài, Issue, thẻ Linear hay cơ sở dữ liệu, không thể chỉ dựa vào hội thoại hiện tại để nhớ.
- Dừng: khi nào thoát, khi nào chuyển sang người, khi nào vì ngân sách hoặc hết số vòng mà dừng thẳng.

![Vòng lặp ngoài của Loop Engineering](https://oss.javaguide.cn/github/javaguide/ai/agent/loop-engineering-outer-loop.webp)

Agent Loop đã có từ rất lâu. Một Agent đơn giản nhất vốn dĩ là:

1. Đọc context hiện tại.
2. Cho LLM phán đoán bước tiếp theo.
3. Gọi tool hoặc xuất câu trả lời.
4. Ghi kết quả tool về context.
5. Tiếp tục vòng tiếp theo, cho đến khi chạm điều kiện dừng.

ReAct cũng cùng tư duy này: Reasoning và Acting luân phiên, model đi một bước nhìn một bước, nhận phản hồi bên ngoài rồi mới quyết định bước tiếp theo.

## RAG

Bài gốc liên quan:

- [Giải thích chi tiết các khái niệm cơ bản của RAG](./rag/rag-basis.md)
- [Giải thích chi tiết thuật toán chỉ mục vector và cơ sở dữ liệu vector trong RAG](./rag/rag-vector-store.md)
- [Chiến lược xử lý và phân đoạn tài liệu trong RAG: từ phân tích, làm sạch, Chunking đến xử lý nội dung đa phương thức](./rag/rag-document-processing.md)
- [Giải thích chi tiết tối ưu hóa RAG: từ recall, rerank đến tinh chỉnh hệ thống của context engineering](./rag/rag-optimization.md)
- [Giải thích chi tiết GraphRAG: vì sao chỉ dựa vào vector retrieval không đỡ nổi hỏi đáp tri thức phức tạp](./rag/graphrag.md)

### RAG là gì?

**RAG (Retrieval-Augmented Generation, sinh tăng cường truy vấn)** chính là buộc truy vấn thông tin và LLM dùng chung với nhau. Hệ thống trước tiên truy vấn từ knowledge base các đoạn liên quan đến câu hỏi hiện tại, knowledge base có thể là cơ sở dữ liệu, tập tài liệu, cũng có thể là hệ thống nội bộ doanh nghiệp. Rồi đưa các đoạn này cùng câu hỏi gốc cho LLM, khiến model trả lời dựa trên nội dung truy vấn, thay vì chỉ dựa vào kiến thức ghi nhớ lúc huấn luyện.

![Sơ đồ RAG](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-simplified-architecture-diagram.jpeg)

Dữ liệu huấn luyện của LLM có lớn đến đâu, cũng không né được vài vấn đề. RAG vừa vặn có thể bù đắp ở những chỗ này.

**Thứ nhất là tính kịp thời của tri thức.**

Kiến thức của model tiền huấn luyện sẽ dừng ở thời điểm cắt dữ liệu huấn luyện. Các sự kiện mới, chính sách mới, tài liệu sản phẩm mới sau khi huấn luyện, model theo mặc định là không biết, trừ khi bổ sung qua lưới, gọi tool hoặc tiêm tri thức bên ngoài. Cách làm của RAG là truy vấn động nguồn tri thức bên ngoài, đưa trực tiếp nội dung mới nhất liên quan cho LLM, khiến nó không cần chỉ dựa vào kiến thức cũ trong tham số.

**Thứ hai là truy cập dữ liệu riêng tư.**

Tài liệu sản phẩm, knowledge base, dữ liệu khách hàng nội bộ doanh nghiệp, không thể để LLM công khai truy cập tùy tiện. RAG khi người dùng hỏi chỉ trích xuất đoạn liên quan đến câu hỏi cho LLM, không cần phơi bày toàn bộ dữ liệu, model cũng có thể dựa trên kiến thức của chính doanh nghiệp để trả lời.

**Thứ ba là vấn đề hallucination.**

Việc LLM bịa đặt sự thật thì ai cũng từng gặp. RAG bằng cách cung cấp văn bản tham chiếu rõ ràng, khiến model cố gắng trả lời dựa trên bằng chứng, quả thực có thể giảm xác suất hallucination. Nhưng đừng trông chờ nó triệt tiêu hallucination hoàn toàn. Lỗi truy vấn, nhiễu context, trích dẫn gắn nhầm, model không tuân theo chỉ thị, đều có thể dẫn đến câu trả lời sai. RAG production-level thường còn phải kèm kiểm tra trích dẫn, đánh giá câu trả lời, cơ chế từ chối trả lời và vòng phản hồi thủ công.

### Nguyên lý hoạt động của RAG

Chuỗi kỹ thuật của RAG thường chia hai giai đoạn: chỉ mục ngoại tuyến và truy vấn-sinh trực tuyến. Giai đoạn chỉ mục xử lý tài liệu gốc thành cấu trúc dữ liệu có thể truy vấn; giai đoạn trực tuyến khi người dùng hỏi hoàn thành hiểu truy vấn, truy vấn recall, xây dựng context và sinh câu trả lời.

Sơ đồ luồng đơn giản hóa của giai đoạn chỉ mục và truy vấn như sau:

![Sơ đồ luồng đơn giản hóa của giai đoạn chỉ mục và truy vấn](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-rag-engineering-link.png)

Giai đoạn chỉ mục chủ yếu làm những việc này:

1. Input tài liệu: file văn bản, PDF, trang web, bản ghi database đều được, miễn là có nội dung.
2. Làm sạch tài liệu: loại bỏ thẻ HTML, ký tự đặc biệt và các nhiễu khác.
3. Tăng cường tài liệu: bổ sung metadata, như timestamp, thẻ phân loại, cung cấp chiều lọc cho truy vấn sau này.
4. Chia tách tài liệu (Chunking): dùng bộ tách văn bản cắt tài liệu thành các đoạn nhỏ hơn. Bước này phải cân bằng tính toàn vẹn ngữ nghĩa, độ dài input của model Embedding, context window của model sinh và độ hạt recall. Chunk quá to dễ đưa nhiễu vào, quá nhỏ lại có thể mất context. Chiến lược chia tách ảnh hưởng trực tiếp đến chất lượng recall, chi tiết có thể xem [Bài xử lý tài liệu RAG](./rag/rag-document-processing.md).
5. Biểu diễn vector (Embedding Generation): thông qua embedding model ánh xạ đoạn văn bản thành vector ngữ nghĩa, tức vector dày đặc chiều cao. Model embedding thường gặp gồm `text-embedding-3-small` / `text-embedding-3-large` của OpenAI, và các model mã nguồn mở trên Hugging Face.
6. Lưu vào vector store hoặc hệ thống chỉ mục: đưa embedding vector, nội dung gốc và metadata tương ứng vào vector store hoặc hệ thống chỉ mục vector, như Milvus, pgvector, truy vấn vector Elasticsearch / OpenSearch, hoặc xây dựng chỉ mục vector cục bộ dựa trên Faiss. Cách chọn cơ sở dữ liệu vector, thuật toán chỉ mục và thực hành pgvector có thể xem [Bài vector store RAG](./rag/rag-vector-store.md).

### Embedding

Embedding chính là biến văn bản thành một chuỗi số. Nói chính xác hơn, nó ánh xạ văn bản vào một không gian vector dày đặc chiều cao, khiến các văn bản có ngữ nghĩa gần nhau ở gần nhau hơn trong không gian vector.

Ví dụ ba câu này:

- "Làm thế nào yêu cầu hoàn tiền?"
- "Quy trình hoàn tiền là gì?"
- "Đơn hàng hủy và trả tiền thế nào?"

Chúng chữ viết khác nhau, nhưng ngữ nghĩa gần nhau. Một model Embedding tốt sẽ ánh xạ chúng đến vị trí gần nhau, vector retrieval mới có thể tìm ra Chunk liên quan.

![Embedding: ánh xạ văn bản vào không gian ngữ nghĩa](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-2-embedding-map-text-to-semantic-space.png)

Chiều Embedding thường là 768, 1024, 1536, 3072... Chiều càng cao, thông tin biểu đạt càng phong phú, nhưng chi phí lưu trữ, chỉ mục và tính độ tương tự cũng càng cao. Lấy Embedding của OpenAI làm ví dụ, `text-embedding-3-small` mặc định xuất ra 1536 chiều, `text-embedding-3-large` mặc định xuất ra 3072 chiều, và hỗ trợ giảm chiều output qua tham số `dimensions`.

### Truy vấn vector và cơ sở dữ liệu vector

Trong luồng truy vấn của RAG, bước nền tảng nhất là: biến cả câu hỏi người dùng lẫn tài liệu thành vector, rồi dùng tìm kiếm độ tương tự tìm đoạn tài liệu liên quan nhất.

Có thể hiểu nó như vậy:

1. Tài liệu vào knowledge base trước tiên được cắt thành Chunk.
2. Mỗi Chunk thông qua model Embedding chuyển thành một vector.
3. Vector cùng văn bản gốc, metadata viết vào cơ sở dữ liệu vector.
4. Khi người dùng hỏi, câu hỏi cũng được chuyển thành query vector.
5. Cơ sở dữ liệu vector truy vấn ra Top-K vector tài liệu giống nhất.
6. Hệ thống đưa các đoạn tài liệu này vào Prompt, giao LLM sinh câu trả lời.

![Embedding và vector retrieval có quan hệ gì?](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-embedding-vector-retrieval.png)

Nói đơn giản, Embedding chịu trách nhiệm biến văn bản thành vector có thể so sánh, vector retrieval chịu trách nhiệm tìm nội dung ngữ nghĩa gần nhất. Không có Embedding thì không có vector ngữ nghĩa; không có vector retrieval thì RAG chỉ có thể lùi về tìm kiếm từ khóa.

Trong Demo quy mô nhỏ, vài nghìn vector tài liệu có thể đặt thẳng trong bộ nhớ để tìm kiếm brute force. Nhưng trong hệ thống RAG thực, số lượng tài liệu rất nhanh lên đến triệu, chục triệu, thậm chí lớn hơn.

Cơ sở dữ liệu vector giải quyết không phải "lưu một mảng" đơn giản, mà là vài vấn đề kỹ thuật:

![Vì sao kịch bản RAG cần cơ sở dữ liệu vector?](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-why-need-vector-store.png)

### Xử lý tài liệu

Trước khi nói chiến lược cụ thể, trước tiên vẽ rõ chuỗi. Tài liệu từ lúc upload đến khi vào vector store, ở giữa phải qua ít nhất sáu khâu:

![Tổng chuỗi xử lý tài liệu RAG: nửa trước của upload quyết định trần hiệu quả của nửa sau](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-document-processing-overall-link.png)

Trong hình này có một điểm dễ bỏ lỡ: kiểm tra chất lượng không nên chỉ xảy ra sau khi vào kho. Làm kiểm tra lấy mẫu ở giai đoạn Chunking, có thể phát hiện vấn đề từ sớm, tránh ghi số lượng lớn dữ liệu chất lượng thấp vào vector store.

Rủi ro cốt lõi của mỗi khâu:

| Khâu               | Vấn đề điển hình                                            | Ảnh hưởng cuối cùng                           |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------- |
| Upload file        | Giả mạo format, vượt giới hạn kích thước, mã hóa loạn       | Parser sập hoặc thất bại thầm lặng            |
| Kiểm tra format    | Extension và loại MIME thực tế không khớp                   | Chọn sai parser                               |
| Phân tích Layout   | PDF nhiều cột, bảng gộp ô, đầu cuối trang                   | Mất cấu trúc, lệch context                    |
| Làm sạch khử nhiễu | Ký tự loạn, ký tự đặc biệt, dòng trống lặp, sót lại mục lục | Nhiễu vào chỉ mục, Embedding méo              |
| Chunking           | Cắt sai nghĩa, đứt context, khối quá to hoặc quá nhỏ        | Recall không chính xác, câu trả lời thiếu sót |
| Metadata           | Không lưu nguồn, số trang, phiên bản, quyền                 | Không lọc được, không trích dẫn được          |
| Vào kho            | Chiều vector không khớp, vượt giới hạn Token                | Truy vấn thất bại, chỉ mục hỏng               |

Nhiều team dồn sức vào đổi embedding model nào, nhưng thực ra nếu dữ liệu đã hỏng ở bước này, đổi model chỉ khiến phần hỏng càng ổn định hơn.

### Chunking

![Làm thế nào chọn chiến lược chia tách phù hợp?](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-document-processing-chunking-strategy.png)

Nếu chính tài liệu của bạn đã có cấu trúc rõ ràng, chia theo cấu trúc mới là đáng tin nhất. NVIDIA từng làm một bộ test, Page-Level Chunking (chia theo trang) thể hiện tốt nhất trên báo cáo tài chính và tài liệu pháp lý, độ chính xác trung bình đạt 0.648, phương sai cũng thấp nhất. Lý do rất đơn giản: khi bản thân ranh giới trang chính là ranh giới ngữ nghĩa mà tác giả tài liệu đặt ra, đừng cưỡng ép tách nó ra.

Nhưng đừng mê tín mù quáng việc chia theo trang. Ưu thế này so với chia theo Token thực ra chỉ cao hơn 0.3-4.5 điểm phần trăm, mà trên tập dữ liệu FinanceBench, chia 1024-token ngược lại còn tốt hơn chia theo trang (0.579 vs 0.566). Loại tài liệu NVIDIA test (báo cáo tài chính, tài liệu pháp lý) thuộc kịch bản bản thân việc phân trang đã mang ngữ nghĩa — nếu PDF của bạn là loại Word xuất hú họa, chia theo trang không mang lại lợi ích thêm. Ngoài ra, loại truy vấn cũng ảnh hưởng đến chiến lược tối ưu: truy vấn sự kiện thích hợp dùng khối nhỏ 256-512 Token, truy vấn phân tích thích hợp chia 1024+ Token hoặc theo trang.

Cách chia đề xuất tương ứng cho các loại tài liệu khác nhau, Tiểu G đã tổng hợp một bảng để tham khảo:

| Loại tài liệu | Cách chia đề xuất                 | Công cụ triển khai                |
| ------------- | --------------------------------- | --------------------------------- |
| Markdown      | Chia theo cấp tiêu đề (H1/H2/H3)  | `MarkdownHeaderTextSplitter`      |
| HTML          | Chia theo cấp thẻ (h1~h6, p, div) | `HTMLHeaderTextSplitter`          |
| PDF           | Chia theo trang hoặc chương       | `chunk_by_title`、`chunk_by_page` |
| Code          | Chia theo hàm, class, package     | `PythonCodeTextSplitter`          |
| Paper         | Chia theo chương, đoạn, bảng      | Layout-aware Parser               |

Người làm RAG sớm muộn sẽ gặp một mâu thuẫn: khối nhỏ recall chính xác nhưng context thiếu sót, khối lớn giữ trọn vẹn nhưng recall nhiều nhiễu. Bạn muốn recall chính xác thì phải chia khối nhỏ, nhưng chia nhỏ model chỉ thấy phần cục bộ, câu trả lời dễ đứt câu rời ý.

Parent-Child Chunk chính là giải quyết mâu thuẫn này. Cách làm cụ thể là trước tiên cắt tài liệu thành các khối nhỏ khoảng 300 Token để dùng cho vector retrieval, rồi mỗi khối nhỏ gắn vào một đoạn cha 1200 Token. Khi truy vấn trước tiên trúng khối nhỏ, rồi đưa đoạn cha tương ứng vào context. Như vậy vừa đảm bảo độ chính xác recall, vừa giữ lại context cần thiết.

### Hybrid Search

Vector retrieval giỏi tương đồng ngữ nghĩa, BM25 giỏi khớp từ chính xác. Hai cái là quan hệ bổ trợ, không phải thay thế.

| Loại truy vấn                                   | Thể hiện của vector retrieval        | Thể hiện của BM25      | Gợi ý                       |
| ----------------------------------------------- | ------------------------------------ | ---------------------- | --------------------------- |
| "Làm thế nào hủy đăng ký"                       | Khớp được "tắt tự động gia hạn"      | Có thể khớp không thấy | Giữ lại vector recall       |
| "Mã lỗi E1027"                                  | Có thể recall lỗi tổng quát          | Trúng chính xác mã lỗi | Phải giữ lại recall từ khóa |
| "Tham số model ABX-4421"                        | Dễ tìm thấy model tương tự           | Trúng chính xác SKU    | Phải giữ lại recall từ khóa |
| "Khác biệt chính sách từ chối Java thread pool" | Hiểu ngữ nghĩa tốt hơn               | Khớp được từ khóa      | Hybrid ổn định hơn          |
| "Chính sách giá mới nhất v3.2"                  | Cần ngữ nghĩa và điều kiện thời gian | Khớp được số phiên bản | Metadata + Hybrid           |

Cách làm phổ biến của Hybrid Search là truy vấn hai đường rồi hợp nhất:

- Vector retrieval trả về ứng viên tương đồng ngữ nghĩa.
- BM25 hoặc sparse vector trả về ứng viên từ khóa.
- Dùng RRF hoặc điểm số trọng số chuẩn hóa để gộp.
- Khử trùng lặp ứng viên đã gộp, rồi vào Rerank.

Tài liệu chính thức của Microsoft Azure AI Search, Google Vertex AI Vector Search, Weaviate... đều coi Hybrid Search và RRF là cách hợp nhất phổ biến. Ưu điểm của RRF là không cần cưỡng ép so sánh điểm BM25 với điểm cosine vector, hợp nhất theo vị trí xếp hạng, gánh nặng chỉnh tham số thấp hơn.

Nhưng đừng thần thánh hóa Hybrid Search.

Nếu tài liệu của bạn có cấu trúc cao, từ khóa ít, lợi ích Hybrid mang lại có thể có hạn; nếu truy vấn của bạn chứa nhiều mã lỗi, model sản phẩm, mục cấu hình, danh từ riêng, vector retrieval thuần rất dễ lật xe.

### Query Rewrite

Câu hỏi của người dùng thường không phải viết cho hệ thống truy vấn.

Họ sẽ nói:

- "Cái báo lỗi này làm sao đây?"
- "Có trả lại tiền không?"
- "Vấn đề rate-limit online hình như lại đến rồi?"

Những câu hỏi này với con người thì có context, với hệ thống truy vấn thì rất mơ hồ. Mục tiêu của Query Rewrite là: **không thay đổi ý định người dùng, đổi câu hỏi thành cách diễn đạt thích hợp để recall hơn.**

Các chiến lược phổ biến như sau:

| Chiến lược          | Kịch bản phù hợp                                        | Ví dụ                                                                                              |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Viết lại chuẩn hóa  | Khẩu ngữ, viết tắt, thiếu context                       | "Có trả lại tiền không" đổi thành "chính sách hoàn tiền, điều kiện hoàn tiền, quy trình hoàn tiền" |
| Multi-Query         | Diễn đạt có thể nhiều cách                              | Đồng thời truy vấn "hủy đăng ký" "tắt tự động gia hạn" "dừng gói thành viên"                       |
| Query Decomposition | Câu hỏi chứa nhiều câu hỏi con                          | Tách "so sánh phí và xử lý tranh chấp của Stripe và Square" thành 4 câu hỏi con                    |
| Step-back Query     | Câu hỏi quá nhỏ, thiếu bối cảnh                         | Trước tiên truy vấn "quy tắc tính phí đăng ký", rồi trả lời câu hỏi hủy cụ thể                     |
| HyDE                | Truy vấn quá ngắn, khác biệt lớn với hình thái tài liệu | Trước tiên sinh câu trả lời giả định, rồi dùng vector câu trả lời giả định recall tài liệu thật    |
| Self-Query          | Câu hỏi chứa điều kiện lọc                              | Từ "tra chính sách Java năm 2025" trích xuất lọc năm và loại                                       |

Các component như MultiQueryRetriever, SelfQueryRetriever của LangChain chính là triển khai engineering hóa của loại tư duy này.

Đây có một cái bẫy: **Query Rewrite phải giữ lại câu hỏi gốc.** Đừng chỉ dùng truy vấn đã viết lại. Về mặt kỹ thuật có thể để truy vấn gốc và truy vấn viết lại cùng recall, rồi hợp nhất kết quả. Nếu không, một khi model viết lại hiểu sai ý định, phía sau recall đều lệch hết.

### Rerank

Vector retrieval dùng tư duy model hai tháp: query và document lần lượt mã hóa, rồi tính khoảng cách vector. Nó nhanh, nhưng chưa đủ tinh.

Rerank thường dùng Cross-Encoder hoặc model xếp hạng lại chuyên dụng, đặt query và tài liệu ứng viên cùng nhau chấm điểm. Nó chậm hơn, nhưng phán đoán được chi tiết hơn "đoạn văn bản này có thực sự trả lời được câu hỏi này không".

Độ tương đồng vector giống như "hai đoạn này ngữ nghĩa có gần nhau không", Rerank giống như "đoạn này có thể trả lời câu hỏi này không".

Ví dụ:

Người dùng hỏi: "Vì sao thread pool sẽ kích hoạt chính sách từ chối?"

Vector recall có thể tìm ra các đoạn này:

1. Giải thích tham số cốt lõi thread pool.
2. Danh sách enum chính sách từ chối.
3. Điều kiện kích hoạt chính sách từ chối sau khi hàng đợi đầy, số thread đạt maximumPoolSize.
4. Ví dụ code sử dụng thread pool.

Điều 1, 2 ngữ nghĩa rất gần, nhưng điều 3 mới là cốt lõi câu trả lời. Giá trị của Rerank chính là đưa điều 3 lên đầu.

Chuỗi khuyến nghị là:

1. Lọc trước bằng Metadata.
2. Hybrid Search recall thô 30 đến 100 bản.
3. Khử trùng lặp và gộp đoạn liền kề.
4. Rerank chọn 5 đến 10 bản.
5. Nén context rồi đưa vào Prompt.

### GraphRAG

![GraphRAG là gì?](https://oss.javaguide.cn/github/javaguide/ai/rag/graphrag-simplified-architecture-diagram.png)

GraphRAG (Graph-based Retrieval-Augmented Generation) có thể hiểu là: **bên ngoài vector retrieval truyền thống, đưa vào knowledge graph, mô hình hóa tường minh entity, quan hệ và context có cấu trúc trong tài liệu. Khi truy vấn, ngoài việc recall đoạn tương tự, còn dọc theo quan hệ của graph thu thập bằng chứng, rồi giao LLM sinh câu trả lời.**

Lưu ý, trọng điểm của GraphRAG không phải "dùng graph database", mà là **đối tượng truy vấn đã thay đổi**.

Vector RAG truyền thống truy vấn Chunk, tức từng đoạn văn bản. GraphRAG truy vấn node, edge, path, tóm tắt cộng đồng trong một "mạng quan hệ tri thức", kết hợp bằng chứng văn bản gốc để trả lời câu hỏi.

Lấy ví dụ so sánh:

- **Vector RAG** giống như trong thư viện theo ngữ nghĩa tìm vài trang nội dung tương tự.
- **GraphRAG** giống như trước tiên sắp xếp bản đồ quan hệ nhân vật, dòng thời gian sự kiện và mục lục chủ đề, rồi dọc theo manh mối quan hệ tìm bằng chứng.

Vector RAG giỏi phán đoán "đoạn này có giống câu hỏi của tôi không", GraphRAG giỏi hiểu "các đối tượng này thực sự kết nối với nhau thế nào".

![Khác biệt bản chất giữa GraphRAG và vector RAG truyền thống](https://oss.javaguide.cn/github/javaguide/ai/rag/graphrag-vs-rag.png)

| Chiều              | Vector RAG truyền thống                          | GraphRAG                                                                           |
| ------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Đối tượng truy vấn | Chunk văn bản                                    | Entity, quan hệ, path, tóm tắt cộng đồng, đoạn văn gốc                             |
| Năng lực cốt lõi   | Recall tương đồng ngữ nghĩa                      | Suy luận quan hệ, duyệt graph, tổng hợp chủ đề toàn cục                            |
| Cấu trúc dữ liệu   | Chủ yếu chỉ mục vector                           | Knowledge graph + chỉ mục vector + chỉ mục toàn văn                                |
| Bài toán phù hợp   | Hỏi đáp sự kiện cục bộ, giải thích đoạn tài liệu | Hỏi đáp quan hệ nhiều chặng, tổng hợp xuyên tài liệu, phân tích nghiệp vụ phức tạp |

<!-- @include: @article-footer.snippet.md -->
