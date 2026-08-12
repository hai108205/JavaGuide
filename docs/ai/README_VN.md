---
title: Hệ thống kiến thức phát triển ứng dụng AI: LLM, Agent, RAG, MCP, Prompt Engineering và System Design
description: Lộ trình phỏng vấn và học tập phát triển ứng dụng AI, dành cho Backend Developer tổng hợp về gọi LLM, Agent, RAG, Skills, MCP, Prompt Engineering, cơ sở dữ liệu vector, đánh giá và thiết kế hệ thống.
category: AI
tag:
  - AI
  - LLM
  - Phát triển ứng dụng AI
  - Phỏng vấn Backend
icon: mdi:robot-outline
sitemap:
  changefreq: weekly
  priority: 1
head:
  - - meta
    - name: keywords
      content: Phát triển ứng dụng AI,Phỏng vấn phát triển ứng dụng AI,Phỏng vấn AI Engineer,LLM,Phỏng vấn LLM,LLM Interview,Agent,Phỏng vấn Agent,RAG,Phỏng vấn RAG,MCP,Prompt Engineering,Cơ sở dữ liệu vector,System Design AI,Phỏng vấn lập trình AI
  - - meta
    - property: og:title
      content: Hệ thống kiến thức phát triển ứng dụng AI: LLM, Agent, RAG, MCP, Prompt Engineering và System Design
  - - meta
    - property: og:description
      content: Từ gọi LLM, Agent, RAG, MCP, Prompt Engineering đến đánh giá và thiết kế hệ thống, tổng hợp các kiến thức quan trọng mà Backend Developer cần bổ sung khi bước vào phát triển ứng dụng AI.
---

<!-- @include: @small-advertisement.snippet.md -->

Làm ứng dụng AI không phải chỉ là nhét Prompt vào interface là xong. Vào đến project thực tế, bạn sẽ ngay lập tức gặp phải các vấn đề như độ dài context, output có cấu trúc, RAG recall, quyền hạn của tool, đánh giá hồi quy (regression), chi phí và tính ổn định.

Những vấn đề này không thể giải quyết từng cái một cách riêng lẻ. Nền tảng LLM, Agent, RAG, gọi công cụ và thiết kế hệ thống phải được hiểu một cách liên kết — chỉ biết gọi API sẽ bị kẹt ở buổi review kiến trúc; chỉ quen thuộc với các paper về RAG thì khi bảo trì knowledge base vẫn không biết cách xử lý cập nhật gia tăng và khử trùng lặp theo phiên bản.

Nếu thời gian có hạn, trước tiên hãy xem [Hướng dẫn phỏng vấn phát triển ứng dụng AI](./interview-questions/ai-interview-guide.md), điểm qua những câu hỏi dễ bị hỏi nhất trong LLM, Agent, RAG, Skills, MCP và AI System Design; nếu bạn chưa xác định được thứ tự học, hoặc đang chuyển từ Backend sang phát triển ứng dụng AI, có thể xem trước [Lộ trình phát triển ứng dụng AI & Agent cho Java/Go Developer (Bản mới nhất 2026)](../roadmap/java-to-ai-roadmap.md) và [Gợi ý học tập chuyển đổi Backend sang AI Agent (Bản mới nhất 2026)](../roadmap/backend-to-ai-agent-roadmap.md); nếu muốn học chắc chắn hơn, thì hãy tiến theo thứ tự đọc dưới đây.

Đây có thể là tài liệu hệ thống và đầy đủ nhất hiện tại, mỗi bài đều được dành nhiều thời gian để hoàn thiện và tối ưu, đồng thời có nhiều hình minh họa hỗ trợ hiểu bài:

![Tổng quan nội dung AIGuide, nhiều hình minh họa](https://oss.javaguide.cn/github/aiguide/aiguide-overview.png)

Chuyên mục này thuộc dự án AIGuide, hướng chuẩn chất lượng JavaGuide (miễn phí, mã nguồn mở, hoan nghênh Star ủng hộ):

- **Địa chỉ dự án**: [https://github.com/Snailclimb/AIGuide](https://github.com/Snailclimb/AIGuide)
- **Đọc trực tuyến**: [https://javaguide.cn/ai-coding/](https://javaguide.cn/ai-coding/)

Sau khi phát hành, chúng tôi cũng nhận được rất nhiều đánh giá và sự giới thiệu tốt từ độc giả. Cảm ơn rất nhiều, chắc chắn sẽ tiếp tục duy trì và chăm chút lâu dài!

![AIGuide nhận được nhiều đánh giá và giới thiệu tốt từ độc giả](https://oss.javaguide.cn/github/aiguide/ai-guide-received-many-positive-reviews-and-recommendations-from-readers.png)

## Phù hợp với ai

- Kỹ sư đang chuyển từ Backend sang phát triển ứng dụng AI, muốn bổ sung tuyến chính về LLM, Agent, RAG và thiết kế hệ thống.
- Các bạn chuẩn bị phỏng vấn cho các vị trí như AI Engineer, phát triển ứng dụng AI, Backend chuyển sang AI.
- Nhà phát triển đã làm Prompt Demo, nhưng chưa đủ am hiểu về chuỗi gọi model, output có cấu trúc, tối ưu hóa RAG retrieval và vòng đánh giá khép kín.
- Độc giả muốn đưa các khái niệm như MCP, Function Calling, Tool Calling, cơ sở dữ liệu vector, model gateway vào project thực tế để hiểu.
- Thành viên team đã tích hợp LLM vào project, nhưng bắt đầu gặp các vấn đề về tính ổn định, chi phí, quản trị bảo mật và hồi quy chất lượng.

## Một vài chỗ dễ mắc lỗi

LLM thực sự không thể chỉ coi như một API black-box để gọi. Token bị cắt, tham số sampling thay đổi một chút là output "bay" ngay, đã bảo trả về JSON mà kết quả vẫn lộn xộn — những vấn đề này rất khó khó khống chế hoàn toàn bằng Prompt. Bạn thêm một câu "hãy xuất ra JSON nghiêm ngặt" vào prompt chỉ là lớp ràng buộc đầu tiên, khi thực sự lên production vẫn phải làm format validation, retry, fallback và xử lý ngoại lệ trong chuỗi gọi.

Agent cũng không phải cứ tự động gọi được tool là xong. Thứ khó thực sự là Memory và Context Engineering. Context không quản lý tốt, Agent chạy vài vòng là dễ đi lệch hướng, những gì đã nói trước đó, nhiệm vụ hiện tại đang làm đến bước nào, kết quả nào của tool còn dùng được, tất cả đều có thể bị rối. Trong task dài càng rõ hơn, có khi không phải nó không biết làm, mà là sau vài vòng lặp nó tự cuốn vào chính mình, chạy mãi đến khi Token sắp cạn mới dừng.

RAG trả lời sai câu hỏi, nhiều khi cũng đừng vội đổ lỗi cho model. Phần lớn vấn đề thực ra nằm ở giai đoạn recall: Chunk cắt quá thô, Query không được rewrite, keyword retrieval và vector retrieval không kết hợp, Rerank không làm tốt. Lúc này kiểm tra từng khâu trong chuỗi recall, thường hữu ích hơn là trực tiếp đổi sang một model đắt tiền hơn.

MCP, Function Calling, Tool Calling những thứ này, giải quyết vấn đề tool được kết nối vào như thế nào. Sau khi thống nhất protocol, kết nối tool quả là tiện hơn, nhưng vào môi trường production thật sự, chỗ phiền phức lại nằm ở phía sau: ai có thể gọi tool này, có thể thao tác trên những dữ liệu nào, log call như thế nào, thất bại thì rollback ra sao. Những thứ này nếu không thiết kế kỹ, protocol có chuẩn đến đâu cũng không đủ.

Một khi ứng dụng AI được đưa lên production, các vấn đề tính ổn định, khả năng quan sát (observability), kiểm soát chi phí, hồi quy chất lượng đều sẽ nảy sinh. Giai đoạn Demo thường không cảm nhận được, vì lượng call nhỏ, kịch bản cũng sạch. Khi thực sự đưa vào traffic nghiệp vụ, team làm ứng dụng AI production-level lần đầu hầu như đều bị những vấn đề này "dạy cho một bài học".

## Thứ tự đọc đề xuất

1. [Tổng quan các khái niệm cốt lõi của AI](./ai-core-concepts.md): trước tiên đặt các khái niệm LLM, Token, Agent, RAG, MCP, Skills, ReAct vào cùng một chuỗi.
2. [Hướng dẫn phỏng vấn phát triển ứng dụng AI](./interview-questions/ai-interview-guide.md): xây dựng danh sách các câu hỏi tần suất cao, biết được những điểm nào hay bị truy hỏi nhất trong phỏng vấn và review project.
3. [Giải thích cơ chế vận hành LLM](./llm-basis/llm-operation-mechanism.md), [Thực hành kỹ thuật gọi LLM API](./llm-basis/llm-api-engineering.md): hiểu chuỗi gọi model, context và output có cấu trúc.
4. [Hiểu hết các khái niệm cốt lõi của AI Agent](./agent/agent-basis.md), [Hướng dẫn thực hành LLM Prompt Engineering](./agent/prompt-engineering.md), [Hướng dẫn thực chiến Context Engineering](./agent/context-engineering.md): xây dựng nhận thức nền tảng về Agent và Prompt/Context.
5. [Giải thích chi tiết các khái niệm cơ bản của RAG](./rag/rag-basis.md), [Chiến lược xử lý và phân đoạn tài liệu trong RAG](./rag/rag-document-processing.md), [Giải thích chi tiết tối ưu hóa retrieval trong RAG](./rag/rag-optimization.md): bổ sung tuyến chính hỏi đáp trên knowledge base doanh nghiệp.
6. [System Design cho ứng dụng AI](./system-design/ai-application-architecture.md), [Giải thích chi tiết LLM Gateway](./system-design/llm-gateway.md), [Hệ thống đánh giá ứng dụng AI](./llm-basis/llm-evaluation.md): đưa Demo vào hệ thống Backend thực tế, bổ sung gateway, đánh giá và governance.

## Các bài viết cốt lõi

### Phỏng vấn và lộ trình ôn tập

- [Lộ trình phát triển ứng dụng AI & Agent cho Java/Go Developer (Bản mới nhất 2026)](../roadmap/java-to-ai-roadmap.md): phân rã lộ trình học theo nền tảng LLM, LLM API, Prompt, RAG, Agent, engineering hóa và làm project thực chiến.
- [Gợi ý học tập chuyển đổi Backend sang AI Agent (Bản mới nhất 2026)](../roadmap/backend-to-ai-agent-roadmap.md): trước tiên đánh giá xem có phù hợp để chuyển đổi không, rồi xem Java AI và Python AI nên chọn gì, có thể ứng tuyển vị trí nào, và nên học như thế nào.
- [Tổng quan các khái niệm cốt lõi của AI](./ai-core-concepts.md): nối liền LLM, Token, MCP, Skills, ReAct, Embedding, GraphRAG và các khái niệm cốt lõi khác theo ba tuyến chính là nền tảng LLM, Agent và RAG.
- [Chuyên đề câu hỏi phỏng vấn phát triển ứng dụng AI](./interview-questions/): tổ chức lộ trình ôn tập theo nền tảng LLM, AI Agent, RAG và AI System Design.
- [Hướng dẫn phỏng vấn phát triển ứng dụng AI](./interview-questions/ai-interview-guide.md): đưa các câu hỏi truy vấn phổ biến trong phát triển ứng dụng AI vào một lộ trình ôn tập, phù hợp để xem trước.
- [Tổng hợp câu hỏi phỏng vấn nền tảng LLM](./interview-questions/llm-interview-questions.md): bao phủ Token, context window, tham số sampling, gọi API, output có cấu trúc và hệ thống đánh giá.
- [Tổng hợp câu hỏi phỏng vấn AI Agent](./interview-questions/agent-interview-questions.md): bao phủ Agent Loop, Memory, Prompt, Context, MCP, Skills, Harness Engineering và Workflow.
- [Tổng hợp câu hỏi phỏng vấn RAG](./interview-questions/rag-interview-questions.md): bao phủ nền tảng RAG, cơ sở dữ liệu vector, xử lý tài liệu, tối ưu hóa retrieval, GraphRAG, cập nhật knowledge base và đánh giá.
- [Tổng hợp câu hỏi phỏng vấn AI System Design](./interview-questions/ai-system-design-interview-questions.md): bao phủ kiến trúc ứng dụng AI production-level, model gateway, observability, đánh giá, quản trị bảo mật và voice Agent thời gian thực.

### Nền tảng LLM

- [Chuyên đề nền tảng LLM](./llm-basis/): từ cơ chế vận hành model, gọi API, output có cấu trúc đến đánh giá ứng dụng AI, trước tiên hiểu rõ chuỗi gọi.
- [Giải thích cơ chế vận hành LLM](./llm-basis/llm-operation-mechanism.md): quy các khái niệm Token, context window, Temperature... thành các tham số kỹ thuật rõ ràng, kiểm soát được.
- [Thực hành kỹ thuật gọi LLM API](./llm-basis/llm-api-engineering.md): phân rã prompt assembly, model gateway, streaming response, retry rate-limit và output có cấu trúc.
- [Giải thích chi tiết output có cấu trúc của LLM](./llm-basis/structured-output-function-calling.md): trình bày rõ chuỗi nền tảng của JSON Schema, Function Calling, Tool Calling và MCP.
- [Hệ thống đánh giá ứng dụng AI](./llm-basis/llm-evaluation.md): bao phủ Golden Set, LLM-as-Judge, các chỉ số RAG/Agent, Trace replay và vòng khép kín gray release online.

### AI Agent

- [Chuyên đề AI Agent](./agent/): từ các khái niệm nền tảng Agent, Memory, Prompt, Context đến MCP, Skills và Harness Engineering.
- [Hiểu hết các khái niệm cốt lõi của AI Agent](./agent/agent-basis.md): hiểu sự khác biệt giữa Agent với lập trình truyền thống, Workflow, cùng các khái niệm cốt lõi như Agent Loop, đăng ký Tools.
- [Hệ thống Memory của AI Agent](./agent/agent-memory.md): hiểu sâu về short-term memory, long-term memory, vòng đời của memory và các chiến lược tối ưu cấp sản xuất.
- [Hướng dẫn thực hành LLM Prompt Engineering](./agent/prompt-engineering.md): nắm vững bốn yếu tố của Prompt, các kỹ thuật phổ biến và phòng chống Prompt Injection.
- [Hướng dẫn thực chiến Context Engineering](./agent/context-engineering.md): hiểu về sắp xếp quy tắc tĩnh, gắn thông tin động, giảm cấp Token budget và context persistence.
- [Giải thích chi tiết giao thức MCP](./agent/mcp.md): hiểu kiến trúc phân lớp của MCP, năng lực cốt lõi và thực hành production cho MCP Server.
- [Giải thích chi tiết Agent Skills](./agent/skills.md): hiểu sự khác biệt bản chất giữa Skills với Prompt, MCP, Function Calling.
- [Hiểu hết Harness Engineering](./agent/harness-engineering.md): phân rã kiến trúc engineering hóa của Model + Harness và thực hành của các team hàng đầu.
- [Workflow, Graph và Loop trong AI Workflow](./agent/workflow-graph-loop.md): hiểu node, edge, state, ranh giới bảo mật và cách triển khai của AI Workflow.
- [Loop Engineering là gì? Vì sao nói nó là "bia cũ rót chai mới"?](./agent/loop-engineering.md): giải thích trigger, context, validation, state và điều kiện dừng của vòng lặp ngoài cho code Agent.

### RAG (Retrieval-Augmented Generation)

- [Chuyên đề RAG](./rag/): xoay quanh hỏi đáp trên knowledge base doanh nghiệp, tổng hợp xử lý tài liệu, cơ sở dữ liệu vector, GraphRAG, tối ưu hóa retrieval và cập nhật knowledge base.
- [Giải thích chi tiết các khái niệm cơ bản của RAG](./rag/rag-basis.md): hiểu RAG là gì, vì sao cần nó, ưu điểm cốt lõi và hạn chế.
- [Chiến lược xử lý và phân đoạn tài liệu trong RAG](./rag/rag-document-processing.md): bao phủ phân giải tài liệu, làm sạch, cấu trúc hóa, Chunking và xử lý nội dung đa phương thức.
- [Giải thích chi tiết thuật toán chỉ mục vector và cơ sở dữ liệu vector trong RAG](./rag/rag-vector-store.md): nắm vững các thuật toán chỉ mục như HNSW, IVFFLAT và cách chọn cơ sở dữ liệu vector.
- [Giải thích chi tiết tối ưu hóa retrieval trong RAG](./rag/rag-optimization.md): bao phủ chiến lược Chunk, Hybrid Search, Query Rewrite, Rerank và nén context.
- [Giải thích chi tiết GraphRAG](./rag/graphrag.md): hiểu về entity, relation, phát hiện cộng đồng, retrieval toàn cục và retrieval cục bộ.
- [Chiến lược cập nhật tài liệu knowledge base RAG](./rag/rag-knowledge-update.md): nắm vững cập nhật gia tăng, kiểm soát phiên bản, khử trùng lặp và xây dựng lại toàn bộ.

### AI System Design

- [Chuyên đề AI System Design](./system-design/): đưa Prompt Demo vào hệ thống Backend thực tế để xem, tập trung vào kiến trúc, model gateway, chuỗi voice, observability, đánh giá và quản trị bảo mật.
- [System Design cho ứng dụng AI](./system-design/ai-application-architecture.md): đưa Prompt Demo vào chuỗi production, bao phủ quản lý Prompt, model gateway, RAG, Memory, gọi Tool, observability, đánh giá và tuân thủ bảo mật.
- [Giải thích chi tiết LLM Gateway](./system-design/llm-gateway.md): hiểu định tuyến đa model, fallback, rate-limit quota, phân bổ chi phí, giám sát audit và chiến lược cache của LLM Gateway.
- [Giải thích chi tiết công nghệ AI Voice](./system-design/ai-voice.md): phân rã VAD, ASR, LLM, TTS, phát streaming, xử lý ngắt lời và lựa chọn kết hợp edge-cloud.

## Các câu hỏi tần suất cao

- Token, context window, Temperature, Top P của LLM lần lượt ảnh hưởng đến gì?
- Vì sao output có cấu trúc không thể chỉ dựa vào Prompt? JSON Schema, Function Calling và server-side validation lần lượt giải quyết vấn đề gì?
- Agent và Workflow khác gì nhau? Trong Agent Loop, observe, plan, act, reflect phối hợp với nhau như thế nào?
- Prompt Engineering và Context Engineering khác gì nhau?
- MCP giải quyết vấn đề gì? Nó có quan hệ gì với Function Calling, Tool Calling?
- Vì sao RAG trả lời sai câu hỏi? Nên kiểm tra từ giai đoạn recall, ranking, nén context hay generation?
- Nên chọn cơ sở dữ liệu vector như thế nào? Các chỉ mục HNSW, IVFFLAT phù hợp với kịch bản nào?
- Ứng dụng AI được đánh giá như thế nào? Golden Set, LLM-as-Judge, gray release online và Trace replay kết nối với nhau ra sao?
- Vì sao ứng dụng AI production-level cần model gateway? Làm thế nào để thực hiện rate-limit, fallback, kiểm soát chi phí và audit?

## Các chuyên đề liên quan

- [Hướng dẫn thực chiến AI Coding](../ai-coding/)
- [System Design](../system-design/)
- [Hệ thống kiến thức High Availability](../high-availability/)
- [Hệ thống kiến thức High Performance](../high-performance/)
- [Hệ thống kiến thức Distributed System](../distributed-system/)

<!-- @include: @article-footer.snippet.md -->