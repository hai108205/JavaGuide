# Skill dịch thuật tài liệu công nghệ thông tin

## Mục tiêu

Dịch tài liệu thuộc lĩnh vực công nghệ thông tin sang ngôn ngữ đích một cách tự nhiên, chính xác và nhất quán, đồng thời giữ nguyên cấu trúc kỹ thuật quan trọng của tài liệu gốc.

## Nguyên tắc bắt buộc

1. **Giữ nguyên format của đoạn mã cũ**

   * Không được làm thay đổi cấu trúc, thụt lề, dấu câu, biến, hàm, class, tên file, tên API, câu lệnh, hoặc bất kỳ nội dung nào nằm trong khối code.
   * Code block, snippet, cấu hình, JSON, YAML, XML, SQL, lệnh terminal và mọi đoạn mã kỹ thuật phải được bảo toàn nguyên trạng.

2. **Không thay đổi nội dung kỹ thuật**

   * Không tự ý thêm, bớt, diễn giải sai, hoặc làm lệch nghĩa của thông tin chuyên môn.
   * Giữ nguyên ý nghĩa, phạm vi, điều kiện, cảnh báo, và các ràng buộc kỹ thuật của văn bản gốc.

3. **Được phép thay đổi cách hành văn**

   * Có thể diễn đạt lại câu chữ để tự nhiên, chuẩn ngữ pháp, mạch lạc, và phù hợp với ngôn ngữ đích.
   * Ưu tiên bản dịch rõ ràng, dễ đọc, đúng văn phong tài liệu kỹ thuật.

4. **Thuật ngữ CNTT dùng tiếng Anh làm chuẩn**

   * Với các thuật ngữ đặc trưng của ngành công nghệ thông tin, ưu tiên giữ nguyên tiếng Anh nếu đó là cách dùng phổ biến trong ngành.
   * Chỉ dịch thuật ngữ khi bản dịch tiếng Việt thật sự phổ biến và không gây hiểu nhầm.
   * Khi cần, có thể dùng dạng: **tiếng Việt (tiếng Anh)** ở lần xuất hiện đầu tiên.

## Cách xử lý nội dung

* **Tiêu đề, mô tả, hướng dẫn, ghi chú**: dịch theo nghĩa, giữ văn phong kỹ thuật chính xác.
* **Tên biến, hàm, class, package, module, endpoint, command, key, config**: giữ nguyên.
* **Chuỗi văn bản trong code**: chỉ thay đổi nếu đó là nội dung hiển thị cần dịch và không ảnh hưởng logic; nếu không chắc chắn, giữ nguyên.
* **Tài liệu có định dạng đặc biệt** như bảng, danh sách, bullet, checklist, markdown, HTML, XML, YAML, JSON: giữ nguyên cấu trúc trình bày.
* **Thuật ngữ đã chuẩn hóa trong ngành**: ưu tiên dùng thuật ngữ quen thuộc với kỹ sư phần mềm, hệ thống, dữ liệu, mạng, bảo mật, DevOps, AI/ML.

## Tiêu chuẩn chất lượng

* Chính xác về mặt kỹ thuật.
* Tự nhiên theo ngôn ngữ đích.
* Nhất quán thuật ngữ xuyên suốt tài liệu.
* Không làm hỏng format hoặc cấu trúc gốc.
* Không dịch quá sát đến mức khó hiểu, nhưng cũng không dịch quá thoáng làm mất nghĩa.

## Quy trình dịch

1. Xác định phần nào là văn bản cần dịch, phần nào là nội dung kỹ thuật phải giữ nguyên.
2. Bảo toàn nguyên dạng các khối code và cấu trúc kỹ thuật.
3. Dịch phần mô tả sang ngôn ngữ đích với văn phong tự nhiên.
4. Chuẩn hóa thuật ngữ CNTT theo tiếng Anh hoặc dạng Việt-Anh nhất quán.
5. Rà soát lại để  không làm đổi nghĩa, không sai format, không sai thuật ngữ.

## Ràng buộc cuối cùng

* Không phá vỡ cấu trúc tài liệu gốc.
* Không sửa logic trong code.
* Không tự ý chuẩn hóa khác đi nếu điều đó làm thay đổi nội dung.
* Luôn ưu tiên độ chính xác và tính nhất quán của tài liệu kỹ thuật.

* Được phép dịch các comment trong code (//, /* */, #, ''', """, XML comment, HTML comment...) sang tiếng Việt.
* Chỉ dịch phần nội dung comment, không thay đổi ký hiệu comment, vị trí, xuống dòng hoặc format.
* Không sửa code thực thi, tên biến, hàm, class, package, module, API, command, config hoặc logic chương trình.
* Nếu comment chứa tên kỹ thuật, API, class, protocol, thuật ngữ chuyên ngành hoặc identifier, giữ nguyên các thành phần đó và chỉ dịch phần mô tả.
* Nếu comment chứa ví dụ code hoặc lệnh, giữ nguyên ví dụ và chỉ dịch phần diễn giải.

## Kết quả mong đợi

Một bản dịch tài liệu CNTT: File mới bằng tên file cũ + "_VN"

* đúng nghĩa,
* giữ nguyên format kỹ thuật,
* dùng thuật ngữ chuẩn ngành,
* và phù hợp với ngôn ngữ đích.
