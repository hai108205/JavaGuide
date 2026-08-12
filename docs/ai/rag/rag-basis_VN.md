---
title: Giải thích chi tiết các khái niệm cơ bản của RAG
description: Phân tích sâu các khái niệm cốt lõi của RAG (Retrieval-Augmented Generation), bao phủ nguyên lý hoạt động của RAG, Embedding, độ đo độ tương tự, RAG vs fine-tuning, RAG vs long context, ưu điểm cốt lõi và hạn chế cùng các điểm thi phỏng vấn tần suất cao.
category: Phát triển ứng dụng AI
head:
  - - meta
    - name: keywords
      content: RAG,Retrieval-Augmented Generation,LLM,Knowledge Base,Embedding,Semantic Search,Vector Search,Fine-tuning,Long Context,Enterprise Knowledge Base
---

Khi làm hỏi đáp trên knowledge base doanh nghiệp, phản ứng đầu tiên của nhiều team đều là: nhét hết tài liệu cho LLM, để nó tự đọc.

Khi tài liệu ít, cách này quả thực chạy được. Một khi knowledge base phình lên đến vài trăm nghìn chữ, vấn đề nhanh chóng xuất hiện: mỗi request đều có thể chạm giới hạn Token, nội dung vừa cập nhật model cũng chưa chắc biết. Thực tế hơn, tài liệu doanh nghiệp còn phải xét quyền, truy nguồn, chi phí và độ trễ, không thể dựa vào "nhét hết vào" để cố chịu.

Việc RAG phải làm thật ra rất trực tiếp: trước khi để LLM trả lời, trước tiên từ knowledge base tìm ra nội dung liên quan, rồi đưa nội dung này cho model, để nó dựa trên bằng chứng sinh câu trả lời.

Bài viết này gần 6200 chữ, chủ yếu làm rõ vài việc:

1. RAG là gì, vì sao cần nó;
2. Ba khâu truy vấn, tăng cường, sinh phối hợp với nhau thế nào;
3. Embedding và độ đo độ tương tự thực sự đang làm gì;
4. RAG và tìm kiếm truyền thống, fine-tuning, long context lần lượt phù hợp với kịch bản nào;
5. Ưu điểm và hố của RAG nằm ở đâu.

## RAG là gì?

**RAG (Retrieval-Augmented Generation, sinh tăng cường truy vấn)** chính là buộc truy vấn thông tin và LLM dùng chung với nhau. Hệ thống trước tiên truy vấn từ knowledge base các đoạn liên quan đến câu hỏi hiện tại, knowledge base có thể là cơ sở dữ liệu, tập tài liệu, cũng có thể là hệ thống nội bộ doanh nghiệp. Rồi đưa các đoạn này cùng câu hỏi gốc cho LLM, khiến model trả lời dựa trên nội dung truy vấn, thay vì chỉ dựa vào kiến thức ghi nhớ lúc huấn luyện.

![Sơ đồ RAG](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-simplified-architecture-diagram.jpeg)

## Vì sao cần RAG?

![RAG (Retrieval-Augmented Generation) giải quyết thách thức cốt lõi của LLM như thế nào](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-llm-challenges.png)

Dữ liệu huấn luyện của LLM có lớn đến đâu, cũng không né được vài vấn đề. RAG vừa vặn có thể bù đắp ở những chỗ này.

**Thứ nhất là tính kịp thời của tri thức.**

Kiến thức của model tiền huấn luyện sẽ dừng ở thời điểm cắt dữ liệu huấn luyện. Các sự kiện mới, chính sách mới, tài liệu sản phẩm mới sau khi huấn luyện, model theo mặc định là không biết, trừ khi bổ sung qua lưới, gọi tool hoặc tiêm tri thức bên ngoài. Cách làm của RAG là truy vấn động nguồn tri thức bên ngoài, đưa trực tiếp nội dung mới nhất liên quan cho LLM, khiến nó không cần chỉ dựa vào kiến thức cũ trong tham số.

**Thứ hai là truy cập dữ liệu riêng tư.**

Tài liệu sản phẩm, knowledge base, dữ liệu khách hàng nội bộ doanh nghiệp, không thể để LLM công khai truy cập tùy tiện. RAG khi người dùng hỏi chỉ trích xuất đoạn liên quan đến câu hỏi cho LLM, không cần phơi bày toàn bộ dữ liệu, model cũng có thể dựa trên kiến thức của chính doanh nghiệp để trả lời.

**Thứ ba là vấn đề hallucination.**

Việc LLM bịa đặt sự thật thì ai cũng từng gặp. RAG bằng cách cung cấp văn bản tham chiếu rõ ràng, khiến model cố gắng trả lời dựa trên bằng chứng, quả thực có thể giảm xác suất hallucination. Nhưng đừng trông chờ nó triệt tiêu hallucination hoàn toàn. Lỗi truy vấn, nhiễu context, trích dẫn gắn nhầm, model không tuân theo chỉ thị, đều có thể dẫn đến câu trả lời sai. RAG production-level thường còn phải kèm kiểm tra trích dẫn, đánh giá câu trả lời, cơ chế từ chối trả lời và vòng phản hồi thủ công.

## Các công dụng phổ biến của RAG là gì?

RAG phù hợp nhất với kịch bản "câu trả lời phụ thuộc tài liệu bên ngoài, và tài liệu có thể thay đổi hoặc rất dài". Nó trước tiên truy vấn nội dung liên quan từ knowledge base, rồi để LLM dựa trên kết quả truy vấn sinh câu trả lời, giảm bịa đặt, đồng thời tăng khả năng truy vết.

Kịch bản phổ biến gồm:

- Chatbot CSKH: dựa trên knowledge base sản phẩm làm hỏi đáp, xử lý sự cố, hướng dẫn quy trình, ví dụ "làm thế nào đổi trả hàng" "mã báo lỗi của một model thiết bị xử lý thế nào".
- Copilot phát triển / vận hành: truy vấn codebase, tài liệu interface, sổ tay cảnh báo, hỗ trợ định vị vấn đề và sinh gợi ý sửa chữa.
- Trợ lý y tế: truy vấn hướng dẫn, tờ dược phẩm, quy chuẩn nội viện rồi sinh gợi ý hỗ trợ, nhưng không chẩn đoán cuối cùng, ví dụ "chống chỉ định của thuốc X là gì" "theo hướng dẫn giải thích ý nghĩa chỉ số xét nghiệm".
- Tư vấn pháp lý: dựa trên điều luật, vụ án, mẫu hợp đồng truy vấn, sinh giải thích điều khoản và cảnh báo rủi ro.
- Kèm học giáo dục: từ giáo trình, bài giảng, kho đề truy vấn điểm kiến thức, sinh bài giảng và các bước ví dụ.
- Trợ lý nội bộ doanh nghiệp: kết nối quy chế, SOP, biên bản họp, tài liệu kỹ thuật, làm truy vấn, tóm tắt, so sánh.
- Hỗ trợ đầu tư nghiên cứu, tuân thủ, audit, đề xuất bán hàng: xử lý báo cáo, công bố thông tin, kiểm soát nội bộ, sổ tay sản phẩm, mẫu hồ sơ thầu...

## Vì sao một số doanh nghiệp vẫn thà dùng tìm kiếm truyền thống thay vì RAG?

Không phải vấn đề nào cũng đáng dùng RAG. Nhiều doanh nghiệp giữ tìm kiếm truyền thống, không phải vì không biết RAG hữu dụng, mà vì nhu cầu người dùng vốn chưa đến bước "sinh câu trả lời".

Nếu người dùng chỉ muốn tìm nguyên văn một quy chế, một tài liệu interface, một mẫu hợp đồng, ô tìm kiếm ngược lại trực tiếp hơn. Nhập từ khóa, trả về danh sách tài liệu, người dùng tự bấm xác nhận, chuỗi ngắn, chi phí thấp, kết quả cũng kiểm soát được hơn. RAG thì phải trước tiên truy vấn, rồi tổ chức context, cuối cùng giao LLM sinh câu trả lời. Chỉ cần qua sinh, sẽ phát sinh thêm độ trễ, chi phí Token và rủi ro lệch tóm tắt.

Vậy nên chọn tìm kiếm truyền thống hay RAG, trước tiên xem người dùng thật sự muốn gì: là "giúp tôi tìm tài liệu", hay "giúp tôi đọc xong tài liệu và đưa kết luận".

| Chiều            | Tìm kiếm truyền thống (ô tìm kiếm)         | RAG (truy vấn + sinh)                          |
| ---------------- | ------------------------------------------- | ---------------------------------------------- |
| Mục tiêu người dùng | Tìm tài liệu, trang, tệp đính kèm          | Trực tiếp có được câu trả lời đọc được, tóm tắt hoặc kết luận so sánh |
| Độ trễ và chi phí | Cực thấp, dễ mở rộng                        | Cao hơn, cần truy vấn và suy luận LLM          |
| Khả năng kiểm soát / audit | Mạnh, đưa trực tiếp link văn bản gốc       | Yếu hơn, có thể hiểu nhầm hoặc lệch tóm tắt, cần trích dẫn và đánh giá |
| Rủi ro           | Thấp, chủ yếu là vấn đề recall sắp xếp      | Cao hơn, gồm hallucination, lỗi trích dẫn, rò rỉ vượt quyền |
| Quản trị dữ liệu | Tương đối trưởng thành, ACL, lọc trường đều dễ làm | Phức tạp hơn, cần lọc truy vấn, làm sạch nhạy cảm context, quản trị log |
| Kịch bản phù hợp | Tra số hiệu, tiêu đề, từ khóa, tìm mẫu, tìm nguyên văn quy chế | Giải đáp CSKH, xử lý sự cố kỹ thuật, giải đọc quy chế, tóm tắt so sánh xuyên tài liệu |
| Best practice    | ES / BM25 + lọc quyền                      | Hybrid retrieval + rerank + truy nguồn trích dẫn + lọc quyền + vòng đánh giá |

Khi triển khai thực tế, nhiều doanh nghiệp sẽ đồng thời giữ hai cổng vào: **tìm kiếm đơn giản đi qua tìm kiếm, hỏi đáp phức tạp đi qua RAG**. Tổ hợp này thường ổn định hơn và tiết kiệm hơn so với "mọi câu hỏi đều giao cho RAG".

## Bạn có hiểu nguyên lý hoạt động của RAG không?

Chuỗi kỹ thuật của RAG thường chia hai giai đoạn: chỉ mục ngoại tuyến và truy vấn-sinh trực tuyến. Giai đoạn chỉ mục xử lý tài liệu gốc thành cấu trúc dữ liệu có thể truy vấn; giai đoạn trực tuyến khi người dùng hỏi hoàn thành hiểu truy vấn, truy vấn recall, xây dựng context và sinh câu trả lời.

Sơ đồ luồng đơn giản hóa của giai đoạn chỉ mục và truy vấn như sau:

![Sơ đồ luồng đơn giản hóa của giai đoạn chỉ mục và truy vấn](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-rag-engineering-link.png)

Giai đoạn chỉ mục chủ yếu làm những việc này:

1. Input tài liệu: file văn bản, PDF, trang web, bản ghi database đều được, miễn là có nội dung.
2. Làm sạch tài liệu: loại bỏ thẻ HTML, ký tự đặc biệt và các nhiễu khác.
3. Tăng cường tài liệu: bổ sung metadata, như timestamp, thẻ phân loại, cung cấp chiều lọc cho truy vấn sau này.
4. Chia tách tài liệu (Chunking): dùng bộ tách văn bản cắt tài liệu thành các đoạn nhỏ hơn. Bước này phải cân bằng tính toàn vẹn ngữ nghĩa, độ dài input của model Embedding, context window của model sinh và độ hạt recall. Chunk quá to dễ đưa nhiễu vào, quá nhỏ lại có thể mất context. Chiến lược chia tách ảnh hưởng trực tiếp đến chất lượng recall, chi tiết có thể xem [Bài xử lý tài liệu RAG](./rag-document-processing.md).
5. Biểu diễn vector (Embedding Generation): thông qua embedding model ánh xạ đoạn văn bản thành vector ngữ nghĩa, tức vector dày đặc chiều cao. Model embedding thường gặp gồm `text-embedding-3-small` / `text-embedding-3-large` của OpenAI, và các model mã nguồn mở trên Hugging Face.
6. Lưu vào vector store hoặc hệ thống chỉ mục: đưa embedding vector, nội dung gốc và metadata tương ứng vào vector store hoặc hệ thống chỉ mục vector, như Milvus, pgvector, truy vấn vector Elasticsearch / OpenSearch, hoặc xây dựng chỉ mục vector cục bộ dựa trên Faiss. Cách chọn cơ sở dữ liệu vector, thuật toán chỉ mục và thực hành pgvector có thể xem [Bài vector store RAG](./rag-vector-store.md).

Quá trình chỉ mục thường hoàn thành ngoại tuyến. Ví dụ team mỗi tuần chạy một tác vụ định giờ, re-index lại các tài liệu mới và thay đổi. Nếu là kịch bản động như người dùng upload tài liệu, chỉ mục cũng có thể hoàn thành trực tuyến, tích hợp thẳng vào ứng dụng chính.

Truy vấn là trực tuyến. Sau khi người dùng hỏi, hệ thống thường đi theo các bước:

1. Nhận request: lấy truy vấn ngôn ngữ tự nhiên của người dùng. Một số hệ thống sẽ trước tiên làm query rewrite hoặc mở rộng, để truy vấn tiếp theo dễ trúng hơn.
2. Vector hóa truy vấn: dùng embedding model chuyển truy vấn thành vector, như vậy mới so sánh được với vector tài liệu trong cùng một không gian.
3. Truy vấn thông tin (R): trong vector store làm tìm kiếm độ tương tự, vớt ra đoạn tài liệu liên quan nhất với query vector.
4. Tăng cường context (A): tổ chức đoạn truy vấn, câu hỏi gốc, system instruction và yêu cầu trích dẫn thành Prompt, giao LLM.
5. Sinh output (G): LLM xuất ra phản hồi ngôn ngữ tự nhiên, đồng thời đính kèm link tài liệu tham khảo.
6. Phản hồi kết quả (tùy chọn): người dùng không hài lòng có thể phản hồi, hệ thống điều chỉnh Prompt hoặc chiến lược truy vấn. Một số triển khai cũng hỗ trợ hội thoại đa vòng để dần hoàn thiện câu trả lời.

Khi hiệu quả truy vấn không ổn định, vấn đề thường nằm ở query rewrite, chiến lược recall, sắp xếp hoặc chất lượng context. Hướng tối ưu có thể xem [Bài tối ưu hóa RAG](./rag-optimization.md).

## Embedding là gì?

Embedding chính là biến văn bản thành một chuỗi số. Nói chính xác hơn, nó ánh xạ văn bản vào một không gian vector dày đặc chiều cao, khiến các văn bản có ngữ nghĩa gần nhau ở gần nhau hơn trong không gian vector.

Ví dụ ba câu này:

- "Làm thế nào yêu cầu hoàn tiền?"
- "Quy trình hoàn tiền là gì?"
- "Đơn hàng hủy và trả tiền thế nào?"

Chúng chữ viết khác nhau, nhưng ngữ nghĩa gần nhau. Một model Embedding tốt sẽ ánh xạ chúng đến vị trí gần nhau, vector retrieval mới có thể tìm ra Chunk liên quan.

![Embedding: ánh xạ văn bản vào không gian ngữ nghĩa](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-2-embedding-map-text-to-semantic-space.png)

Chiều Embedding thường là 768, 1024, 1536, 3072... Chiều càng cao, thông tin biểu đạt càng phong phú, nhưng chi phí lưu trữ, chỉ mục và tính độ tương tự cũng càng cao. Lấy Embedding của OpenAI làm ví dụ, `text-embedding-3-small` mặc định xuất ra 1536 chiều, `text-embedding-3-large` mặc định xuất ra 3072 chiều, và hỗ trợ giảm chiều output qua tham số `dimensions`.

Model Embedding phổ biến có thể chia thành hai loại:

| Loại   | Model đại diện                                                                                          | Kịch bản phù hợp                                  |
| ------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| API đóng | OpenAI `text-embedding-3-small` / `text-embedding-3-large`, Cohere Embed, Jina Embeddings API          | Theo đuổi dùng ngay, hiệu quả đa ngôn ngữ, ít vận hành |
| Model mở | Series BGE, series GTE, series E5, model mở Jina Embeddings                                            | Dữ liệu không được ra ngoài mạng nội bộ, cần triển khai riêng tư, muốn kiểm soát chi phí |

Khi chọn Embedding model, đừng chỉ nhìn thứ hạng bảng xếp hạng. MTEB (Massive Text Embedding Benchmark) có thể làm tham khảo, nhưng cuối cùng vẫn dùng bài toán nghiệp vụ của mình đánh giá recall rate, mức độ liên quan và độ trễ.

Embedding model cũng không phải thứ "hiểu thế giới theo thời gian thực". Nó chủ yếu chịu trách nhiệm ánh xạ văn bản vào không gian vector, trọng tâm năng lực là khớp ngữ nghĩa. Nếu gặp thuật ngữ quá mới, meme, tên sản phẩm hoặc viết tắt lĩnh vực, vẫn phải qua đánh giá trên corpus nghiệp vụ để xác nhận hiệu quả recall.

## Độ tương tự vector tính như thế nào?

Sau khi văn bản thành vector, hệ thống truy vấn còn phải phán đoán vector nào gần query nhất. Có ba độ đo tương tự hoặc khoảng cách phổ biến.

| Cách đo                                 | Ý nghĩa                     | Đặc điểm                                                        |
| --------------------------------------- | --------------------------- | --------------------------------------------------------------- |
| Cosine Similarity (tương tự cosine)     | Xem hai vector có cùng hướng không | Không nhạy với độ dài vector, dùng nhiều nhất trong kịch bản RAG |
| Inner Product / Dot Product (tích vô hướng) | Xem tổng tích các chiều tương ứng hai vector | Nếu vector đã L2 normalized, tích vô hướng và cosine similarity thường tương đương về kết quả sắp xếp |
| L2 Distance (khoảng cách Euclid)        | Xem khoảng cách tuyệt đối hai điểm trong không gian | Nhạy với độ lớn vector hơn, phù hợp kịch bản model hoặc chỉ mục tối ưu theo L2 |

Nếu trong phỏng vấn bị hỏi "vì sao dùng cosine similarity", có thể trả lời như vậy: RAG quan tâm hướng ngữ nghĩa có gần không, thay vì bản thân độ dài vector; cosine similarity không nhạy với độ dài, phù hợp tìm kiếm ngữ nghĩa văn bản hơn. Trong dự án thực tế còn phải nhất quán với độ đo khoảng cách model Embedding khuyến nghị, loại chỉ mục vector store, nếu không có thể khiến chỉ mục không trúng hoặc hiệu quả recall giảm.

## Khác biệt giữa RAG và công cụ tìm kiếm truyền thống là gì?

![Khác biệt giữa RAG và công cụ tìm kiếm truyền thống](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-rag-vs-search-engine.png)

RAG và tìm kiếm truyền thống đều "tìm thông tin", nhưng sau khi lấy được thông tin thì làm việc khác nhau.

Tìm kiếm truyền thống lấy được tài liệu ứng viên rồi, theo độ liên quan sắp xếp, đưa trực tiếp danh sách kết quả cho người dùng. Mỗi kết quả độc lập với nhau, người dùng tự bấm mở, tự phán đoán. Nó giống một bộ sắp xếp hơn.

RAG sẽ đưa nhiều đoạn tri thức truy vấn được cùng vào context của LLM, để model làm quy nạp xuyên tài liệu và tích hợp thông tin, cuối cùng sinh một câu trả lời đọc trực tiếp được. Nó giống một bộ tổng hợp thông tin hơn.

Vài khác biệt then chốt:

1. Cơ chế truy vấn: tìm kiếm truyền thống chủ yếu dựa vào inverted index và khớp từ khóa, BM25 là thuật toán kinh điển; hệ thống tìm kiếm hiện đại cũng thêm semantic recall và rerank. Cách truy vấn của RAG linh hoạt hơn, vector retrieval, BM25, hybrid retrieval, graph retrieval, truy vấn database đều có thể dùng, mấu chốt là kết quả truy vấn phải vào context của LLM tham gia sinh câu trả lời.
2. Hình thái kết quả: tìm kiếm đưa danh sách tài liệu, người dùng còn phải đọc lần hai; RAG đưa câu trả lời, và cố gắng đánh dấu nguồn trích dẫn.
3. Phạm vi dữ liệu: tìm kiếm truyền thống giỏi crawler toàn mạng và chỉ mục quy mô lớn; RAG thường dùng cho knowledge base nội bộ doanh nghiệp và lĩnh vực dọc, để LLM chi phí thấp bổ sung tri thức lĩnh vực cụ thể.
4. Chi phí và độ trễ: tìm kiếm phản hồi nhanh, chi phí kiểm soát được; RAG thêm suy luận LLM, độ trễ và chi phí đều tăng.

## RAG và fine-tuning chọn thế nào?

"Vì sao không trực tiếp fine-tune?" là câu hỏi tần suất rất cao trong phỏng vấn RAG.

Có thể phân biệt như vậy: RAG giải quyết vấn đề model không biết tri thức mới hoặc tri thức riêng tư, fine-tuning phù hợp giải quyết vấn đề model không biết cách nói chuyện hoặc làm việc theo cách của bạn.

Lấy ví dụ. Bạn có một cuốn sổ tay nhân viên rất dày, thường xuyên phải tra quy định trong đó. Tư duy của RAG là tra lúc nào dùng lúc đó, để sổ tay bên ngoài, mỗi lần trả lời trước tiên lật xem. Tư duy của fine-tuning là học thuộc sổ tay, để model nội hóa tri thức đó. Khi sổ tay hay đổi bản, RAG đổi chỉ mục là xong; fine-tuning phải chuẩn bị lại dữ liệu, huấn luyện và đánh giá, chi phí hoàn toàn khác.

| Chiều   | RAG                                                 | Fine-tuning                                                                                |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Cập nhật tri thức | Chỉ cần cập nhật knowledge base hoặc vector index   | Thường cần chuẩn bị lại dữ liệu và huấn luyện                                              |
| Bảo mật dữ liệu | Tri thức giữ trong thư viện ngoài, truy vấn theo nhu cầu | Mô hình và một phần tri thức trong mẫu huấn luyện sẽ cố định vào tham số model fine-tune; dữ liệu nhạy cảm trước khi vào quy trình huấn luyện cần đánh giá thêm tuân thủ và yêu cầu quản trị dữ liệu |
| Kiểm soát hallucination | Có thể trích dẫn nguyên văn, dễ truy nguồn và kiểm tra | Model vẫn có thể bịa, và nguồn trích dẫn không tự nhiên hiển thị                          |
| Cấu trúc chi phí | Chi phí truy vấn + chi phí input Token + chi phí vector store | Chi phí gán nhãn dữ liệu, GPU huấn luyện, đánh giá và quản lý phiên bản                    |
| Kịch bản phù hợp | Hỏi đáp tri thức dày đặc, knowledge base doanh nghiệp, quy chế pháp luật, tài liệu sản phẩm, thông tin thời gian thực | Thích ứng phong cách, kiểm soát format, căn chỉnh thuật ngữ lĩnh vực, tối ưu hành vi nhiệm vụ cố định |
| Rủi ro chính | Truy vấn không thấy, recall nhiễu, lọc quyền phức tạp | Overfit dữ liệu, tri thức quá hạn, chi phí huấn luyện và rollback cao |

Hai cái cũng có thể kết hợp. Trước tiên dùng fine-tuning để model hiểu hơn thuật ngữ lĩnh vực, format output và ranh giới nhiệm vụ, rồi dùng RAG cung cấp tri thức thời gian thực và bằng chứng truy nguồn. Loại tổ hợp này rất phổ biến trong kịch bản CSKH, pháp lý, y tế, đầu tư nghiên cứu tài chính.

Khi phỏng vấn có thể kết thúc như vậy: tri thức thay đổi thường xuyên, cần nguồn trích dẫn, ưu tiên RAG; output style và hành vi nhiệm vụ không ổn định, cân nhắc fine-tuning; vừa cần hiểu diễn đạt lĩnh vực vừa cần tra tri thức thời gian thực, có thể kết hợp cả hai.

Nhưng có một giới hạn thực tế: kết hợp hai cái nghĩa là phải bảo trì hai hệ thống, chi phí không rẻ. Khi tài nguyên team có hạn, trước tiên làm ổn RAG, rồi cân nhắc có đưa fine-tuning không, thường thực dụng hơn.

## Long context window có thay thế RAG không?

Không.

Long context window quả thực khiến nhiều nhiệm vụ đơn giản hơn. Ví dụ ném cả một báo cáo vào, để model đọc từ đầu đến cuối, loại phân tích sâu tài liệu đơn lẻ này rất hợp dùng long context. Nhưng nó không bằng nghĩa có thể nhét toàn bộ knowledge base cho model. Context càng dài, chi phí input Token, độ trễ chữ đầu và nhiễu suy luận đều tăng, hiệu quả chưa chắc tốt hơn.

Kịch bản long context phù hợp rất rõ: phân tích sâu tài liệu dài đơn lẻ, hiểu tập trung một codebase hoặc một thư mục dự án, tóm tắt lịch sử hội thoại dài, hoặc nhiệm vụ tài liệu ít nhưng cần đọc đầy đủ.

Knowledge base quy mô lớn lên, long context không đủ dùng. Knowledge base doanh nghiệp, ticket CSKH, log, kho hợp đồng thường từ triệu đến trăm triệu đoạn tài liệu, không thể mỗi lần nhét hết vào. Cho dù nhét được, chi phí và độ trễ cũng chịu không nổi. Phiền to hơn, context nhét quá nhiều đoạn không liên quan, model ngược lại dễ bị nhiễu ảnh hưởng, sinh ra câu trả lời trông đầy đủ nhưng sự thật không vững. Vấn đề "Lost in the Middle" nói về điều này, thông tin then chốt đặt ở vị trí giữa context dài dễ bị bỏ qua hơn.

Knowledge base doanh nghiệp còn không tránh được cô lập quyền. Nội dung nào người dùng thấy được, nội dung nào không, không thể dựa vào "nhét hết vào" để giải quyết. RAG có thể trong giai đoạn truy vấn làm lọc quyền, chỉ đưa nội dung người dùng có quyền truy cập vào context. Long context làm không được việc này.

Còn một điểm hay bị bỏ qua: khả năng truy vết. RAG có thể trả về rõ đoạn trích dẫn, khi audit có thể truy nguồn. Long context trộn nhiều nội dung lại giao model, người dùng rất khó phán đoán câu trả lời dựa trên đoạn tài liệu nào.

## RAG có những giai đoạn tiến hóa nào?

RAG hai năm nay liên tục lặp lại, đại khái có thể chia thành ba giai đoạn.

![Giai đoạn tiến hóa RAG](https://oss.javaguide.cn/github/javaguide/ai/rag/rag-2-evolution-stages.png)

| Giai đoạn     | Chuỗi điển hình                                                       | Đặc điểm                                        |
| ------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| Naive RAG     | Chia khối tài liệu → Embedding → truy vấn Top-K → LLM sinh            | Cơ bản nhất, dễ triển khai nhất, phù hợp Demo và knowledge base đơn giản |
| Advanced RAG  | Query Rewrite / HyDE → hybrid retrieval → Rerank → nén context → LLM sinh | Trọng điểm giải quyết recall không chính xác, nhiễu context và sắp xếp không ổn định |
| Modular RAG   | Retriever, reranker, compressor, router, generator... các module cắm thay tổ hợp | Định tuyến động theo kịch bản nghiệp vụ, phù hợp hệ thống production và Agent phức tạp |

Naive RAG là điểm khởi đầu, chạy được Demo, nhưng cách production còn khoảng cách. Advanced RAG bắt đầu xử lý vấn đề chất lượng recall, lọc nhiễu và sắp xếp. Modular RAG tách các khâu thành module thay thế được, phù hợp kịch bản phức tạp hơn. Chiến lược tối ưu cụ thể có thể xem tiếp [Bài tối ưu hóa RAG](./rag-optimization.md).

## Ưu điểm cốt lõi và hạn chế của RAG là gì?

Nói ưu điểm trước.

**Lợi ích lớn nhất của RAG là chi phí cập nhật tri thức thấp.** Fine-tuning phải chuẩn bị lại dữ liệu, huấn luyện model, đánh giá hiệu quả, RAG thường chỉ cần cập nhật knowledge base và chỉ mục. Dữ liệu hay thay đổi như tin tức, quy chế, tài liệu sản phẩm, dùng RAG bảo trì sẽ nhẹ nhàng nhiều.

**Nó cũng giảm được hallucination, và tiện truy nguồn.** RAG khiến model từ "trả lời theo trí nhớ" thành "trả lời dựa trên bằng chứng truy vấn". Mỗi câu trả lời đều có thể gắn vào đoạn tài liệu cụ thể, điều này quan trọng trong những kịch bản yêu cầu độ chính xác cao như tuân thủ tài chính, hỗ trợ y tế, truy vấn pháp lý. Tất nhiên, điều này không nghĩa là RAG không sai; truy vấn sai, trích dẫn sai, câu trả lời vẫn lật xe như thường.

**Cô lập dữ liệu cũng dễ làm hơn.** Bạn có thể trong tầng truy vấn triển khai cô lập multi-tenant và kiểm soát truy cập (ACL), đảm bảo người dùng chỉ thấy dữ liệu trong phạm vi quyền của mình. So với việc đưa dữ liệu nhạy cảm vào tập fine-tuning, kiến trúc RAG này phù hợp làm quản trị quyền và tuân thủ hơn.

**Chi phí đổi lĩnh vực cũng thấp.** Không cần vì mỗi lĩnh vực mà huấn luyện lại model, xây xong knowledge base lĩnh vực, chạy thông chỉ mục, là dùng được trước.

Rồi xem hạn chế. RAG không phải viên đạn bạc, hố cũng không ít.

**Chất lượng truy vấn quyết định trần.** Nguyên tắc GIGO ở đây đặc biệt rõ: nếu Embedding biểu đạt không chính xác, hoặc chiến lược chia khối cắt mất thông tin then chốt, nội dung recall và câu hỏi vốn không liên quan, LLM hạ nguồn có mạnh đến đâu cũng cứu không về.

**Context cũng không phải càng dài càng tốt.** Dù một số model Context Window đã mở rộng đến triệu cấp, nhưng nhét quá nhiều đoạn không liên quan vào, sự chú ý của model bị pha loãng, suy luận logic bị nhiễu, chi phí Token cũng tăng theo.

**Độ trễ là một vấn đề cứng khác.** Chuỗi đầy đủ phải qua query rewrite, vector hóa, truy vấn độ tương tự, rerank, xây dựng context, LLM sinh, mỗi bước đều tăng thời gian. Với kịch bản nhạy cảm thời gian phản hồi, không thể chỉ nhìn chất lượng câu trả lời, cũng phải tính kỹ sổ độ trễ.

**Độ phức tạp công trình cũng không thấp.** Bạn phải bảo trì vector database, xử lý chỉ mục gia tăng tài liệu, liên tục tối ưu chiến lược truy vấn, còn phải làm lọc quyền, truy nguồn trích dẫn và vòng đánh giá. So với gọi trực tiếp LLM API, gánh nặng vận hành của RAG nặng hơn rõ rệt.

**Chi phí Token cũng phải tính rõ.** RAG tiết kiệm chi phí huấn luyện, nhưng mỗi request đều phải mang context, input Token thường cao hơn hội thoại thông thường khá nhiều. Đoạn tài liệu nhét càng nhiều, bill và độ trễ cùng tăng.

<!-- @include: @rag-project.snippet.md -->

## Tổng kết

RAG nói cho cùng, là trước tiên từ knowledge base tìm nội dung liên quan, rồi để LLM dựa trên nội dung tìm được mà trả lời. Giá trị của nó không phải khiến model "thần thánh hơn", mà là kéo câu trả lời về trên bằng chứng có thể truy vấn, trích dẫn, audit.

Vài điểm then chốt đáng chú ý:

1. RAG chủ yếu giải quyết mấy vấn đề tri thức LLM quá hạn, không đụng được dữ liệu riêng tư, dễ hallucination. Tìm kiếm truyền thống đưa danh sách tài liệu, RAG đưa câu trả lời đọc trực tiếp được; một cái giống bộ sắp xếp hơn, một cái giống bộ tổng hợp thông tin hơn.
2. Tri thức thay đổi thường xuyên, cần nguồn trích dẫn, ưu tiên RAG; nếu muốn model xuất theo style và format cố định, mới cân nhắc fine-tuning.
3. Long context phù hợp phân tích sâu lượng tài liệu ít, nhưng knowledge base khổng lồ cấp doanh nghiệp, cô lập quyền và kiểm soát chi phí, vẫn phải dựa vào chuỗi truy vấn như RAG để chịu đáy.

Hạn chế của nó cũng phải nhận thức được. Chất lượng truy vấn quyết định trần, nhiễu context sẽ nhiễu generation, độ trễ, độ phức tạp công trình, chi phí Token đều có thật.

Demo chạy thông không nghĩa là production dùng được, phần khó nhất của RAG thường không phải "kết nối một vector store", mà là liên tục đánh giá và tối ưu chất lượng recall.

Trong phỏng vấn thường hỏi:

- RAG là gì? Vì sao cần RAG?
- RAG và công cụ tìm kiếm truyền thống khác gì?
- RAG và fine-tuning chọn thế nào? Khi nào dùng RAG, khi nào fine-tuning, khi nào kết hợp cả hai?
- Trong hệ thống RAG model Embedding chọn thế nào? Vì sao?
- Cosine similarity, tích vô hướng và khoảng cách Euclid khác gì?
- Vấn đề hallucination của RAG giải quyết thế nào? RAG chắc chắn không sinh hallucination sao?
- Vấn đề Lost in the Middle là gì? Ứng phó thế nào?
- Long context window có thay thế RAG không?
- Các chỉ số đánh giá của hệ thống RAG là gì?
- Ưu điểm và hạn chế của RAG là gì?
- Kịch bản nào phù hợp dùng RAG? Kịch bản nào không phù hợp?