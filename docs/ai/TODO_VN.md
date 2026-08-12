---
sitemap: false
head:
  - - meta
    - name: robots
      content: noindex, nofollow
---

# TODO kế hoạch nội dung AI

Cập nhật gần nhất: 2026-06-21

Chỉ mục tài liệu nguyên liệu đi kèm: [Chỉ mục tài liệu viết AI](./MATERIALS.md). Trước khi viết bài mới hãy tra cứu chỉ mục tài liệu và các bài hiện có, tránh tra cứu lặp lại và tạo khung khái niệm trùng lặp.

## Đã hoàn thành hoặc đã bổ sung

| Nội dung                                        | Trạng thái                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `llm-basis/llm-evaluation.md`                   | Đã hoàn thành, đã vào README nền tảng LLM và README cấp cao nhất    |
| `system-design/llm-gateway.md`                  | Đã hoàn thành, đã vào README System Design và README cấp cao nhất   |
| `agent/workflow-graph-loop.md`                  | Đã vào README Agent, README cấp cao nhất và câu hỏi phỏng vấn       |
| `system-design/ai-application-architecture.md`  | Đã vào README System Design, README cấp cao nhất và câu hỏi phỏng vấn |
| `system-design/ai-voice.md`                     | Đã vào README System Design, README cấp cao nhất và câu hỏi phỏng vấn |
| `MATERIALS.md`                                  | Đã bổ sung mới thành chỉ mục tài liệu viết nội bộ, không vào chỉ mục site |

## P0 · Bổ sung System Design và bảo mật

| Tên file                             | Tiêu đề                                                                    | Góc khai thác cốt lõi                                                                                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system-design/llm-security.md`      | Thực chiến bảo mật ứng dụng LLM: Prompt Injection, vượt quyền tool và phòng chống rò rỉ dữ liệu | Từ góc nhìn truyền thống "input không đáng tin" bước vào bề mặt tấn công mới của AI, bao phủ Prompt Injection, Indirect Injection, ranh giới quyền tool, rủi ro MCP Server, nguyên tắc tối thiểu quyền, audit và OWASP LLM Top 10 |
| `system-design/ai-observability.md`  | AI Observability và Trace: vì sao Agent thất bại không thể chỉ nhìn kết quả cuối | Trong một request: gọi model, retrieval, gọi tool, lắp ráp context, retry, fallback của toàn bộ chuỗi span, bao phủ Langfuse, OpenTelemetry, bảng audit tự xây dựng và kết cấu triển khai Backend Java |
| `agent/tool-calling.md`              | Giải thích chi tiết gọi tool của Agent: Function Calling, MCP Tool và kiểm soát quyền | Nối liền `structured-output-function-calling.md`, `mcp.md` và `ai-application-architecture.md`, tập trung vào tool Schema, kiểm tra tham số, phê duyệt quyền, truyền lại kết quả thực thi và phục hồi khi thất bại |

## P1 · Bổ sung điểm yếu kỹ thuật Agent

| Tên file                             | Tiêu đề                                                       | Góc khai thác cốt lõi                                                                                   |
| ------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `agent/agent-evaluation.md`          | Đánh giá và gỡ lỗi Agent: làm thế nào để xác định Agent thực sự hoàn thành nhiệm vụ | Tỷ lệ hoàn thành nhiệm vụ, tỷ lệ gọi tool thành công, tỷ lệ hallucination, tỷ lệ tuân thủ format, độ trễ chi phí, Trace replay và tập hồi quy |
| `agent/multi-agent.md`               | Cộng tác đa Agent: Sub-Agent, phân rã nhiệm vụ và cô lập context     | Tần suất phỏng vấn cao: vì sao Agent không ổn định, khi nào tách Sub-Agent, context cô lập thế nào, các vai trò review/execute/validate phân công ra sao |
| `llm-basis/llm-model-selection.md`   | Hướng dẫn chọn LLM: chọn model tổng hợp, suy luận, code, đa phương thức như thế nào | So sánh các chiều năng lực khác nhau, Router/fallback/sắp xếp đa model, bảng chọn nguồn cho Agent CSKH/RAG/code/voice |

## P1 · Mở rộng vùng sâu RAG

| Tên file                  | Tiêu đề                                                         | Góc khai thác cốt lõi                                                         |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `embedding-reranker.md`         | Chọn Embedding và Reranker model: RAG kém không hẳn là do vector store | So sánh năng lực các model Embedding khác nhau, nguyên lý Reranker, kịch bản chọn lựa |
| `rag-multimodal.md`             | RAG đa phương thức: xử lý knowledge base cho bảng PDF, ảnh, ảnh chụp màn hình và video | Cái khó nhất của knowledge base doanh nghiệp là bảng PDF và ảnh chụp, OCR, hiểu biểu đồ, retrieval đa phương thức |
| `finetune-vs-rag.md`            | Chọn giữa fine-tune, distillation và RAG: khi nào nên làm data training? | So sánh nguyên lý SFT / LoRA / DPO / RFT, khi nào thì điều chỉnh Prompt đã không còn đủ |

## P2 · Chuyên đề framework AI Java

| Tên file                     | Tiêu đề                                                                        | Thứ tự viết                                    |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------- |
| `framework/README.md`        | Chuyên đề framework AI: triển khai kỹ thuật Spring AI, LangChain4j và AI Workflow | Bổ sung entry mục lục trước, tránh `framework/` để trống lâu |
| `spring-ai.md`               | Spring AI nhập môn và thực chiến: Backend Java kết nối LLM như thế nào          | Viết trước, phù hợp nhóm độc giả JavaGuide     |
| `langchain4j.md`             | Thực chiến LangChain4j: Java app xây dựng RAG và Agent như thế nào               | Bài thứ hai                                     |
| `ai-workflow-framework.md`   | LangGraph / Spring AI Alibaba Graph: triển khai AI Workflow, Graph, Loop như thế nào | Bài thứ ba, tham chiếu lẫn nhau với workflow-graph-loop.md |

## P2 · MCP nâng cao và tuân thủ

| Tên file             | Tiêu đề                                                                  | Góc khai thác cốt lõi                            |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `mcp-advanced.md`    | Bảo mật production và năng lực nâng cao của MCP: Roots, Sampling, Elicitation và ranh giới quyền | MCP Server không phải là tập hợp tool mà là bề mặt tấn công mới |
| `ai-compliance.md`   | Tuân thủ và quản trị quyền riêng tư AI: trước khi ứng dụng AI lên production nên kiểm tra bảo mật, audit, quyền riêng tư gì | Việc triển khai tại doanh nghiệp ngày càng phổ biến, tần suất phỏng vấn sẽ tăng |

## Thứ tự triển khai thực tế đề xuất tiếp theo

1. `system-design/llm-security.md`: độc giả JavaGuide đón nhận tốt với chủ đề bảo mật, có thể chuyển tự nhiên từ Web Security truyền thống sang bề mặt tấn công mới của AI.
2. `system-design/ai-observability.md`: có thể kết nối với `harness-engineering.md`, `rag-optimization.md`, `llm-evaluation.md`, tạo thành vòng khép kín "debug -> đánh giá -> quan sát".
3. `agent/tool-calling.md`: trình bày riêng thấu đáo Function Calling, MCP Tool, phê duyệt quyền và chuỗi thực thi tool, sau này bảo mật và System Design đều có thể tái sử dụng.
4. `framework/README.md` + `framework/spring-ai.md`: `framework/` hiện đang trống, trước tiên bổ sung Spring AI mà độc giả Java dễ dùng nhất.

## Quy tắc bảo trì

1. Sau khi thêm bài mới, kiểm tra đồng bộ README cấp cao nhất, README chuyên đề con, cổng vào câu hỏi phỏng vấn, `MATERIALS.md` và bài viết này.
2. Khi viết bài hướng tới độc giả không được liên kết đến tài liệu bảo trì nội bộ; tài liệu bảo trì nội bộ giữ nguyên `sitemap: false` và `noindex, nofollow`.
3. Các thông tin dễ thay đổi như model cụ thể, năng lực nền tảng, giá cả, context window, tham số API, trước khi viết vào chính văn cần đối chiếu lại tài liệu chính thức.
4. Sau khi hoàn thành một mục cần sớm chuyển từ TODO sang "Đã hoàn thành hoặc đã bổ sung", tránh lần bảo trì sau phải xét lại lặp.