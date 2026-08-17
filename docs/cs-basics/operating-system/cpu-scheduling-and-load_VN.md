---
title: "Chi tiết về CPU Scheduling và tải hệ thống"
description: "Tổng hợp câu hỏi phỏng vấn tần suất cao về CPU scheduling và tải hệ thống, từ việc giải thích vì sao tiến trình/thread cần được lập lịch, đến preemption, time slice, độ ưu tiên, context switch, các thuật toán lập lịch kinh điển, Linux CFS/EEVDF, load average, CPU usage, I/O wait và các lệnh chẩn đoán thường dùng."
category: Kiến thức cơ bản máy tính
tag:
  - Hệ điều hành
  - Linux
  - CPU Scheduling
head:
  - - meta
    - name: keywords
      content: CPU scheduling, lập lịch tiến trình, lập lịch thread, tải hệ thống, load average, CPU usage, iowait, CFS, EEVDF, top, uptime, vmstat, pidstat, mpstat, perf top, câu hỏi phỏng vấn hệ điều hành
---

CPU scheduling không chỉ là các tên thuật toán như FCFS, RR, CFS. Khi xử lý sự cố trên hệ thống production, bạn còn phải làm rõ vì sao thread bị đưa ra khỏi CPU, chi phí context switch nằm ở đâu, cũng như load average rất cao nhưng CPU usage không cao nghĩa là gì.

Đằng sau những vấn đề này là cùng một tập ràng buộc: số nhân CPU có hạn, các tác vụ cần phải xếp hàng, và bộ lập lịch đảm nhiệm việc quyết định ai chạy trước; còn các chỉ số hệ thống giúp đánh giá liệu tác vụ đang tranh chấp CPU, chờ I/O, hay bị kẹt trong kernel, interrupt hay lớp ảo hóa.

Ví dụ một máy có 8 CPU logic, load average đã đến 40, nhưng CPU vẫn còn rảnh, `%Cpu(s)` có chỉ số `wa` cao kéo dài. Lúc này đi tìm hàm nóng CPU trực tiếp có thể chẳng ra kết quả, khả năng cao trên máy đang chất đống một loạt tác vụ chờ I/O. CPU usage và load average cần phải được đánh giá tách rời nhau.

## Vì sao cần CPU scheduling

Số nhân CPU có hạn, nhưng số tác vụ có thể chạy lại có thể rất nhiều.

Trong một dịch vụ Java, thread nghiệp vụ, thread GC, thread JIT, thread vòng lặp sự kiện Netty đều có thể cần chạy; trên cùng một máy còn có thể có thu thập log, monitoring agent, tác vụ định kỳ và client cơ sở dữ liệu. Nếu hệ thống có sẵn 8 CPU logic, tại cùng một thời điểm chỉ có thể tối đa cho khoảng 8 tác vụ có thể chạy chiếm CPU, các tác vụ còn lại chỉ có thể xếp hàng, ngủ hoặc chờ I/O. Với môi trường container còn phải xem CPU quota, không thể chỉ nhìn số nhân vật lý của máy chủ.

Các hệ thống khác nhau có cách gọi khác nhau cho đối tượng được lập lịch. Khi xử lý sự cố backend, có thể tạm hiểu Linux scheduling entity là một đơn vị thực thi mà kernel có thể sắp xếp riêng lên CPU để chạy.

Một tiến trình có thể chứa nhiều thread. Chúng chia sẻ không gian địa chỉ của tiến trình và file descriptor, nhưng mỗi cái có ngăn xếp, thanh ghi, program counter và bối cảnh thực thi riêng.

![Quan hệ giữa chương trình, tiến trình và thread](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/relationship-between-program-process-and-thread.png)

Trong kernel Linux, tiến trình và thread đều được biểu diễn bằng task, bộ lập lịch thực sự lập lịch cho task hoặc scheduling entity; một thread nhìn thấy ở user space, phần lớn tương ứng với một tác vụ có thể được kernel lập lịch.

Nếu không có lập lịch, một vòng lặp vô hạn trên máy đơn nhân có thể chiếm CPU mãi, các chương trình khác không có cơ hội đáp ứng. Máy đa nhân chỉ biến số tác vụ có thể chạy cùng lúc từ 1 thành N; khi số tác vụ vượt quá số nhân, vẫn phải xếp hàng và chuyển đổi.

Bộ lập lịch phải cân bằng giữa khả năng đáp ứng tương tác, sự công bằng, throughput, độ ưu tiên, tác vụ realtime, mức tiêu thụ điện năng và cache locality. Các mục tiêu này thường đối nghịch nhau: time slice dài hơn giảm số lần chuyển đổi, nhưng tác vụ tương tác có thể phải chờ lâu hơn; time slice ngắn hơn cải thiện khả năng đáp ứng, nhưng chi phí chuyển đổi lại tăng.

![Sơ đồ đánh đổi CPU scheduling](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/scheduler-tradeoff-triangle.webp)

## Các trường hợp tác vụ rời khỏi CPU

Một tác vụ rời khỏi CPU, đại khái có vài loại nguyên nhân. Time slice dùng hết chỉ là một trong số đó.

Phổ biến nhất là tác vụ chủ động nhường CPU. Ví dụ thread gọi `read()` để đọc đĩa, dữ liệu chưa sẵn sàng thì nó sẽ chuyển sang trạng thái chờ; khi thread chờ lock, condition variable, timer cũng rời khỏi trạng thái đang chạy. CPU không nên đồng hành chờ đợi, bộ lập lịch sẽ chọn các tác vụ có thể chạy khác.

Một loại khác là bị preemption. Hệ điều hành đa dụng thường chọn lập lịch kiểu preemptive, sau khi tác vụ chạy một thời gian, clock interrupt sẽ cho kernel một cơ hội kiểm tra; nếu tác vụ hiện tại đã chạy đủ, hoặc có tác vụ thích hợp hơn chuyển sang trạng thái có thể chạy, kernel có thể đưa tác vụ hiện tại ra khỏi CPU.

Nhiều tài liệu giáo khoa để giải thích rõ preemption thường đơn giản hóa quá trình này thành: timer định kỳ sinh ra clock interrupt.

Mô hình này có thể minh họa quá trình chung của preemption. Tuy nhiên, Linux hiện đại hỗ trợ `NO_HZ` / tickless, sẽ giảm scheduling clock tick trên CPU rảnh hoặc theo cấu hình cụ thể. Timer và scheduling tick là cơ chế quan trọng để kernel có cơ hội kiểm tra preemption, máy production chưa chắc luôn đập tick theo tần suất cố định.

Độ ưu tiên cũng ảnh hưởng đến lập lịch. Tác vụ ưu tiên cao được xếp trước, tác vụ ưu tiên thấp dễ phải chờ lâu hơn. Nếu hệ thống hoàn toàn nghiêng về tác vụ ưu tiên cao, tác vụ ưu tiên thấp có thể lâu không giành được CPU, đó là starvation (đói CPU). Thuật toán trong giáo trình thường dùng dynamic priority, aging hoặc queue promotion để giảm starvation; hệ thống thực tế xử lý tùy thuộc vào scheduling class và cách triển khai cụ thể.

Context switch xảy ra vào thời điểm chuyển tác vụ. Kernel phải lưu bối cảnh như thanh ghi, program counter, con trỏ ngăn xếp của tác vụ hiện tại, rồi khôi phục cho tác vụ kế tiếp. Chuyển đổi giữa các tiến trình còn có thể mang thêm chi phí về page table, TLB, cache locality. Khi có quá nhiều thread, lock tranh chấp gay gắt, tác vụ ngủ và thức dậy liên tục, mã nghiệp vụ chạy không được bao nhiêu mà thời gian CPU đã phải dành trước hết cho lập lịch và đồng bộ.

Số lượng thread cần được đặt dựa trên loại hình tác vụ và số nhân CPU. Thread có thể che giấu thời gian chờ I/O, cũng có thể tận dụng đa nhân; nhưng khi số thread lớn hơn nhiều số nhân CPU, hàng đợi chạy, context switch, cache miss, tranh chấp lock đều sẽ tăng theo.

## Các thuật toán lập lịch kinh điển

Trong phỏng vấn thường hay hỏi FCFS, SJF, RR, priority, Multilevel Feedback Queue.

Đặt các thuật toán này vào bối cảnh tác vụ ngắn, tác vụ dài và tác vụ tương tác xếp hàng như thế nào, sẽ dễ thấy sự khác biệt hơn. Chúng chủ yếu là mô hình đơn giản hóa trong giáo trình; lập lịch tác vụ thông thường của Linux thực tế không áp dụng thẳng một thuật toán nào, mà còn liên quan đến CFS/EEVDF, scheduling class realtime, cgroup, CPU affinity, NUMA và các cơ chế khác.

| Thuật toán                 | Cách chọn                                                           | Vấn đề dễ bị đào sâu                                                        |
| -------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| FCFS                       | Đến trước phục vụ trước                                             | Tác vụ dài xếp trước, tác vụ ngắn cũng phải chờ                             |
| SJF                        | Tác vụ thời gian chạy dự kiến ngắn chạy trước                       | Rất khó biết trước tác vụ còn chạy bao lâu, tác vụ dài có thể bị starvation |
| RR                         | Mỗi tác vụ luân phiên chạy một time slice                           | Time slice quá ngắn khuếch đại context switch, quá dài lại gần giống FCFS   |
| Scheduling theo độ ưu tiên | Tác vụ ưu tiên cao chạy trước                                       | Tác vụ ưu tiên thấp có thể lâu không giành được CPU                         |
| Multilevel Feedback Queue  | Nhiều hàng đợi theo độ ưu tiên, điều chỉnh vị trí theo hành vi chạy | Quy tắc và tham số nhiều, triển khai phức tạp hơn                           |

Ví dụ, trước thread pool đang xếp vài tác vụ nén file lớn, phía sau rất nhiều request chỉ cache tra cứu cũng phải chờ theo, thời gian đáp ứng trung bình sẽ bị kéo tệ bởi tác vụ dài. SJF có thể cải thiện kịch bản này, nhưng tiền đề rất ngặt: hệ thống phải biết mỗi tác vụ còn chạy bao lâu. Hệ thống thực tế không có tầm nhìn toàn tri như vậy, chỉ có thể đoán theo hành vi lịch sử, chờ I/O, đặc tính tương tác.

RR gần giống mô hình nhập môn của hệ chia sẻ thời gian. Mỗi tác vụ chạy một time slice, chạy xong trả lại hàng đợi. Khi người dùng gõ lệnh, di chuột, gửi request, không cần chờ tác vụ dài kết thúc hoàn toàn mới có phản hồi. Context switch có chi phí cố định, nên time slice càng ngắn thì tỷ trọng chi phí chuyển đổi càng cao; time slice kéo dài thì chi phí chuyển đổi được pha loãng, nhưng độ trễ tương tác lại có thể tăng.

Multilevel Feedback Queue cân nhắc đồng thời thời gian đáp ứng của tác vụ ngắn và sự tiến triển của tác vụ dài. Tác vụ mới thường vào hàng đợi ưu tiên cao trước; nếu nó luôn dùng hết time slice, gần với tác vụ dài nhiều CPU-bound, có thể dần hạ cấp; nếu nó thường xuyên chủ động chờ I/O, gần với tác vụ tương tác hoặc I/O-bound, có thể giữ ưu tiên cao hơn. Số lượng hàng đợi, time slice và quy tắc thăng/giáng hạng đều ảnh hưởng hiệu quả lập lịch, hệ thống thực tế còn chồng thêm nhiều cơ chế khác.

## Từ CFS đến EEVDF

Lập lịch tác vụ thông thường của Linux từ lâu dùng CFS, tức Completely Fair Scheduler.

Khi hiểu CFS, trước tiên nhìn vào `vruntime`.

`vruntime` ghi nhận tác vụ đã chạy bao nhiêu trên trục thời gian công bằng. Sau khi tác vụ chạy thực tế một thời gian, kernel quy đổi khoảng thời gian đó vào virtual run time của nó; giá trị nice khác nhau thì trọng số khác nhau, tốc độ quy đổi cũng khác. Bộ lập lịch có xu hướng chọn tác vụ có `vruntime` nhỏ hơn, để các tác vụ dài hạn phân chia CPU theo trọng số.

CFS không có khái niệm timeslice cố định như bộ lập lịch cũ, nó gần giống việc phân bổ tỷ phần CPU theo trọng số trong một khoảng thời gian. Ít tác vụ có thể chạy, mỗi tác vụ có thể chạy thêm một chút; nhiều tác vụ có thể chạy, phần mỗi tác vụ được chia sẽ ngắn hơn. CFS dùng cây đỏ-đen duy trì các tác vụ có thể chạy được sắp xếp theo thời gian chạy ảo, thường chọn nút ngoài cùng bên trái, tức tác vụ trên trục thời gian công bằng đã được nhận tương đối ít CPU.

Linux 6.6 bắt đầu đưa EEVDF vào lập lịch tác vụ thông thường, tức Earliest Eligible Virtual Deadline First.

EEVDF vẫn xoay quanh việc phân bổ CPU công bằng, khi chọn tác vụ đưa vào khái niệm lag và thời điểm hạn ảo (virtual deadline). lag dương nghĩa là tác vụ vẫn còn nợ thời gian CPU; trong số các tác vụ đủ điều kiện, tác vụ nào có virtual deadline sớm hơn được chạy trước. Các tác vụ nhạy độ trễ, request time slice ngắn sẽ sớm có được cơ hội được lập lịch.

Trong mã và output công cụ của Linux, tác vụ thông thường vẫn thuộc về fair scheduling class. EEVDF thay đổi logic chọn tác vụ trong fair class, không có nghĩa là mọi khái niệm lập lịch đều đổi một tên mới.

Máy production đã dùng EEVDF hay chưa, phải xem phiên bản kernel thực tế, và việc bản phân phối có backport hoặc điều chỉnh các patch liên quan hay không. Khi xử lý sự cố production, không mặc định mọi máy đều dùng cùng một triển khai lập lịch.

Phỏng vấn backend thường cần trình bày về `vruntime`, trọng số và tỷ phần công bằng của CFS, cũng như lag, virtual deadline và tác vụ nhạy độ trễ của EEVDF. Nội dung chi tiết hơn sẽ liên quan đến triển khai kernel.

![Sơ đồ so sánh CFS và EEVDF](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/cfs-eevdf-comparison.webp)

## load average và CPU usage không phải một thứ

Ba số load average nhìn thấy trong `uptime` tương ứng với mức tải trung bình trên thang thời gian 1, 5, 15 phút. Chúng là giá trị trung bình suy giảm theo hàm mũ, chứ không phải trung bình cộng đơn giản của các giá trị lấy mẫu N phút gần nhất.

load average thống kê các tác vụ có thể chạy trạng thái R, và các tác vụ ngủ không thể ngắt trạng thái D. Trạng thái D thường liên quan đến I/O, nhưng khi xử lý sự cố không thể chỉ nhìn ổ đĩa cục bộ, các đường chờ không thể ngắt như block device, mạng lưu trữ, filesystem, Swap đều phải xét đến.

Vì vậy, load cao không đồng nghĩa CPU bị đánh bão hòa. Nó có thể đến từ các tác vụ có thể chạy tranh chấp CPU, cũng có thể là nhiều tác vụ kẹt trong trạng thái chờ không thể ngắt.

Đánh giá load phải kết hợp số CPU logic. Máy 8 CPU logic với load khoảng 8 có thể chỉ là CPU bị sắp kín; load 40 thường cho thấy nhiều tác vụ đang xếp hàng hoặc ngủ không thể ngắt. Máy 1 CPU logic load 8 đã rất căng, máy 64 CPU logic load 8 vẫn có thể còn nhẹ.

Trường thứ 4 của `/proc/loadavg` có dạng `3/1024`. Trước dấu gạch chéo là số lượng kernel scheduling entity đang có thể chạy hiện tại, sau đó là tổng số scheduling entity đang tồn tại trong hệ thống. Trường này bổ sung số lượng tác vụ tại thời điểm lấy mẫu, có thể dùng chung với ba giá trị load trung bình trước đó để đánh giá.

CPU usage nhìn vào thời gian CPU được dành cho đâu. Các trường thường gặp trong `%Cpu(s)` của `top` có thể đọc như sau:

- `us`: thời gian user space chưa điều chỉnh nice. Tính toán nghiệp vụ, JSON serialization, biểu thức chính quy, nén, mã hóa/giải mã thường nằm ở đây.
- `ni`: thời gian user space đã điều chỉnh nice. Thường gặp ở các tiến trình người dùng bị hạ độ ưu tiên.
- `sy`: thời gian kernel space. System call, ngăn xếp giao thức mạng, filesystem, tranh chấp lock trong kernel sẽ đẩy chỉ số này lên.
- `wa`: I/O wait. Nó biểu thị thời gian CPU rảnh và hệ thống có yêu cầu I/O chưa hoàn thành, thích hợp làm gợi ý xử lý sự cố, không thể dùng riêng để quy trách nhiệm chính xác.
- `id`: thời gian rảnh. CPU không có việc làm, hoặc tác vụ tắc nghẽn ở tài nguyên khác.
- `hi` / `si`: thời gian hard interrupt / softirq. Lưu lượng gói mạng lớn, interrupt card mạng tập trung, áp lực xử lý ngăn xếp giao thức cao cần chú ý.
- `st`: trong môi trường ảo hóa, thời gian CPU bị máy chủ lấy đi. Khi chỉ số này cao trên cloud host, đừng vội sửa mã nghiệp vụ.

![Sơ đồ so sánh load average và CPU usage](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/load-average-vs-cpu-usage.webp)

`wa` đặc biệt dễ bị đọc sai. iowait không phải là cơ sở quy trách nhiệm đáng tin: CPU không thực sự chờ I/O hoàn thành; trong hệ đa nhân, các tác vụ chờ I/O cũng không chạy trên một CPU nào đó. Vì vậy `wa` cao chỉ cho thấy hệ thống có gợi ý chờ I/O, không thể trực tiếp nói rằng CPU đang bận rộn với I/O.

Bước tiếp theo, nên xem `b`, `bi/bo`, `si/so` của `vmstat`, rồi dùng `pidstat -d` và `iostat -x` tìm tiến trình và block device cụ thể.

## Bắt đầu xử lý sự cố từ cảnh báo CPU

Khi xử lý sự cố không nên lao thẳng vào stack Java. Trước tiên phân loại loại áp lực, rồi mới đi sâu xuống tiến trình, thread, nhân CPU và hàm nóng.

![Sơ đồ phân nhánh xử lý sự cố cảnh báo CPU](https://oss.javaguide.cn/github/javaguide/cs-basics/operating-system/load-cpu-alert-triage.webp)

`uptime` trước tiên xem xu hướng tải. 1 phút cao, 5 phút và 15 phút không cao, có thể là đỉnh ngắn hạn; cả ba giá trị đều cao nghĩa là áp lực đã duy trì một thời gian. Rồi mở `top`, xem trong `%Cpu(s)` là `us`, `ni`, `sy`, `wa`, `si` hay `st` nhô lên, đồng thời xem thứ tự sắp xếp tiến trình và trạng thái tác vụ.

Nếu `us` rất cao, trước tiên tìm hotpot nghiệp vụ. Tiến trình Java trong `top` có thể bấm `H` chuyển sang khung nhìn thread, tìm thread CPU cao, chuyển thread ID sang dạng thập lục phân, rồi tìm stack tương ứng trong `jstack` hoặc `jcmd Thread.print`. Một lần `jstack` chỉ là một khoảnh khắc, tốt nhất liên tục chụp 2~3 lần; nếu cùng một thread nhiều lần dừng ở cùng một đoạn stack nghiệp vụ, độ tin cậy sẽ cao hơn. Cũng có thể dùng:

```bash
pidstat -u -t -p <pid> 1
```

Lệnh này có thể xem CPU usage theo thread. Định vị được thread rồi, tiếp tục xem nó đang ở vòng lặp nghiệp vụ, serialization, biểu thức chính quy, mã hóa/giải mã, hay đang ở GC/JIT. `jstack` thích hợp xem khung stack hiện tại của thread; muốn tìm CPU hotpot, các công cụ lấy mẫu như `perf top`, async-profiler đáng tin cậy hơn.

Nếu `sy` hoặc `si` rất cao, trước tiên đừng chỉ chăm chăm vào stack Java. Rất nhiều kết nối ngắn, thu gói mạng, file I/O, system call, softirq đều có thể đẩy thời gian CPU lên kernel space. Có thể dùng:

```bash
mpstat -P ALL 1
sudo perf top
```

`mpstat` xem có phải một vài nhân CPU nào đó đặc biệt bận, `perf top` xem symbol nóng rơi vào hàm user space, stack mạng kernel, softirq, hay đường liên quan lock. Một nhân 100%, các nhân khác rất trống, cần lưu ý bottleneck đơn thread, softirq tập trung trên một nhân, cấu hình bind hạt nhân hay nghiêng hàng đợi.

Nếu load cao, `wa` cũng cao, trước tiên chạy:

```bash
vmstat 1
```

Tập trung xem `r`, `b`, `wa`, `bi`, `bo`, `si`, `so`. `r` là số lượng tác vụ có thể chạy, `b` không phải số lượng toàn bộ thread ngủ, mà là số lượng tác vụ tắc nghẽn chờ I/O; `bi/bo` là throughput đọc ghi block device, đơn vị thường là KiB/s, không phải số lần yêu cầu I/O; `si/so` là Swap swap in/swap out. `wa` cao đồng thời `b`, `bi/bo` cao, tiếp tục tra đĩa; `wa` cao đồng thời `si/so` cao, áp lực bộ nhớ và Swap có thể đã làm chậm dịch vụ.

Rồi dùng:

```bash
pidstat -d -p ALL 1
iostat -x 1
```

Xem tiến trình nào đang đọc ghi, block device nào độ trễ cao. `iostat -x` tập trung xem `await`, `aqu-sz`, throughput đọc ghi và số request, `%util` có giá trị tham khảo với đĩa cơ; RAID, SSD, NVMe có thể xử lý request song song, không thể chỉ dựa vào nó để đánh giá bão hòa. Hàng đầu của `iostat` thường là giá trị trung bình từ lúc khởi động, khi xử lý sự cố hiện tại nên xem các lần lấy mẫu sau; nếu cần có thể dùng `iostat -x -y 1` bỏ qua hàng đầu.

I/O tiến trình nghiệp vụ không cao nhưng hệ thống `wa` cao, cũng phải xem nén log, backup, cơ sở dữ liệu, kéo image, các container khác trên cùng node.

Nếu hệ thống hỗ trợ PSI, cũng có thể xem:

```bash
cat /proc/pressure/cpu
cat /proc/pressure/io
cat /proc/pressure/memory
```

PSI xem tác vụ đã dừng bao lâu vì áp lực CPU, bộ nhớ, I/O. `some` nghĩa là có ít nhất một tác vụ dừng vì tài nguyên tương ứng thiếu hụt; với bộ nhớ và I/O, `full` nghĩa là mọi tác vụ không idle đồng thời dừng. `full` của hệ thống `/proc/pressure/cpu` không có ý nghĩa chẩn đoán, khi xử lý sự cố áp lực CPU chủ yếu xem `some`. PSI phản ánh trực tiếp việc nghiệp vụ có dừng vì áp lực tài nguyên hay không, chỉ nhìn CPU usage không thể có được thông tin này.

Trong môi trường container còn phải xem giới hạn cgroup. Một container chỉ được chia 2 nhân quota, dù máy chủ có 64 nhân, các tác vụ trong container vẫn có thể đã xếp hàng. Khi xử lý sự cố phải kết hợp các chỉ số cgroup như `cpu.max`, `cpu.stat`, `cpu.pressure`, `memory.current`, `memory.events`, `memory.pressure`, `io.stat`, `io.pressure`, chứ không chỉ nhìn tổng thể CPU của máy chủ. Đây là các tên file thường gặp của cgroup v2; nếu hệ thống vẫn dùng cgroup v1, đường dẫn và tên file sẽ nằm rải rác trong các thư mục controller khác nhau.

Nếu load cao, `wa` không cao, `r` trong `vmstat 1` lâu dài rõ ràng lớn hơn số nhân CPU, nghĩa là các tác vụ có thể chạy đang xếp hàng. Tiếp theo xem số lượng thread, thread pool, tranh chấp lock và context switch:

```bash
vmstat 1
pidstat -w -p ALL 1
ps -eo pid,ppid,stat,ni,pri,psr,pcpu,comm --sort=-pcpu | head
```

`cs` của `vmstat` có thể thấy tần suất context switch hệ thống, trong `pidstat -w` tập trung xem `cswch/s` và `nvcswch/s`. Trước là voluntary context switch (chủ động), thường gặp khi chờ I/O, lock, condition variable; sau là non-voluntary context switch (không chủ động), thường gặp khi bị preemption vì dùng hết time slice. Khi thread pool quá lớn, `r`, `cs`, CPU usage cùng tăng, độ trễ request lại tệ đi, tiếp tục thêm thread chỉ càng tắc nghẽn hơn.

Lệnh `time` thích hợp xem một lệnh một lần dành thời gian ở đâu:

```bash
/usr/bin/time -p <command>
```

`real` là thời gian wall clock, `user` là thời gian CPU user space, `sys` là thời gian CPU kernel space. `real` rất dài nhưng `user + sys` không cao, thường gặp khi chờ I/O, mạng hoặc lock; `user` rất cao, nghĩa là bản thân tính toán tiêu tốn CPU; `sys` cao, thì phải xem system call và đường kernel.

## Các lệnh xử lý sự cố thường dùng

Những lệnh dưới đây có thể trước tiên phân hướng được phần lớn vấn đề CPU/load:

| Lệnh       | Cách viết thường dùng                               | Xem chủ yếu cái gì                                                                       |
| ---------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `uptime`   | `uptime`                                            | load average 1, 5, 15 phút                                                               |
| `top`      | `top`, vào sau bấm `H`                              | Tổng CPU, CPU tiến trình/thread, trạng thái tác vụ, load                                 |
| `vmstat`   | `vmstat 1`                                          | `r`, `b`, `us/sy/wa/id/st`, `cs`, `bi/bo`, `si/so`                                       |
| `pidstat`  | `pidstat -u -d -w -t -p <pid> 1`                    | CPU, I/O, context switch từng tiến trình/thread                                          |
| `iostat`   | `iostat -x 1`                                       | Throughput block device, độ dài hàng đợi, thời gian chờ trung bình, mức sử dụng thiết bị |
| `mpstat`   | `mpstat -P ALL 1`                                   | Mức sử dụng từng nhân CPU, iowait, softirq, steal                                        |
| `ps`       | `ps -eo pid,stat,ni,pri,psr,pcpu,comm --sort=-pcpu` | Trạng thái tiến trình, mức ưu tiên, nhân CPU, chiếm CPU                                  |
| `perf top` | `sudo perf top`                                     | Hàm nóng CPU thời gian thực, phân biệt hotpot user space và kernel                       |
| `PSI`      | `cat /proc/pressure/{cpu,io,memory}`                | Tỷ lệ tác vụ dừng do áp lực CPU, I/O, bộ nhớ                                             |

Kết quả của `perf top` phụ thuộc vào quyền hạn perf cũng như khả năng phân giải symbol kernel, symbol user space và symbol JIT; trong kịch bản Java khi cần còn phải kết hợp async-profiler.

## Điểm chính khi trả lời phỏng vấn

Khi trả lời về CPU scheduling, cần nêu rõ vì sao tác vụ xếp hàng, kernel khi nào chuyển tác vụ và việc chuyển tạo ra những chi phí gì. Như vậy đầy đủ hơn so với chỉ học thuộc tên thuật toán.

### CPU scheduling

> Số nhân CPU có hạn, số tiến trình và thread có thể chạy có thể rất nhiều. Bộ lập lịch từ hàng đợi có thể chạy chọn tác vụ lên CPU; khi tác vụ bị block, dùng hết time slice, độ ưu tiên thay đổi, hoặc có tác vụ thích hợp hơn xuất hiện, kernel sẽ lập lịch và context switch. Lập lịch phải đánh đổi giữa thời gian đáp ứng, throughput, sự công bằng và chi phí chuyển đổi, mở quá nhiều thread ngược lại có thể dành thời gian cho việc xếp hàng và chuyển đổi.

### Các thuật toán lập lịch kinh điển trả lời thế nào

> FCFS đơn giản, nhưng tác vụ dài sẽ kìm hãm tác vụ ngắn; SJF thời gian luân chuyển trung bình tốt, nhưng khó biết độ dài tác vụ, cũng có thể khiến tác vụ dài bị starvation; RR nhờ time slice cải thiện thời gian đáp ứng, time slice quá ngắn khuếch đại chi phí chuyển đổi; scheduling theo độ ưu tiên biểu đạt được mức độ khẩn cấp của tác vụ, nhưng phải xử lý starvation ưu tiên thấp; Multilevel Feedback Queue sẽ điều chỉnh vị trí hàng đợi theo hành vi chạy của tác vụ, cố gắng chiếu cố tác vụ tương tác, đồng thời để tác vụ dài tiếp tục tiến triển.

### Lập lịch Linux

> Lập lịch tác vụ thông thường của Linux không thể áp thẳng một thuật toán giáo trình nào. CFS dùng thời gian chạy ảo và trọng số phân bổ CPU, có xu hướng chọn tác vụ đã nhận CPU tương đối ít; EEVDF tiếp tục lựa chọn xoay quanh tỷ phần công bằng, dùng lag đánh giá tác vụ có nợ CPU hay không, rồi chọn tác vụ theo virtual deadline. Với vị trí backend thông thường trình bày đến tầng này là đủ.

### load average và CPU usage

> load average thống kê các tác vụ có thể chạy trạng thái R và các tác vụ ngủ không thể ngắt trạng thái D, phải kết hợp số nhân CPU để xem. CPU usage mô tả hướng đi của thời gian CPU, `us/ni/sy/wa/id/hi/si/st` lần lượt tương ứng với user space thường, user space nice, kernel space, I/O wait, rảnh, interrupt, softirq và steal ảo hóa. load cao nhưng CPU không cao, nguyên nhân thường gặp là nhiều tác vụ ở trạng thái ngủ không thể ngắt; CPU cao nhưng load không phóng đại, có thể là vài thread đánh bão hòa CPU.

Nếu tiếp tục được hỏi thêm về phương pháp xử lý sự cố, có thể trả lời: dùng `uptime` và `top` định vị hiện tượng, dùng `vmstat` đánh giá là vấn đề run queue, I/O hay context switch, rồi dùng `pidstat`, `mpstat` định vị đến tiến trình và nhân CPU, khi cần thiết qua `perf top` tìm hàm nóng.
