import { ICONS, createImportantSection } from "./constants.js";

export const csBasics = [
  {
    text: "Mạng máy tính",
    prefix: "network/",
    icon: ICONS.NETWORK,
    children: [
      {
        text: "Câu hỏi phỏng vấn",
        icon: ICONS.INTERVIEW,
        children: [
          {
            text: "⭐️Tổng hợp câu hỏi phỏng vấn mạng máy tính thường gặp (phần 1)",
            link: "other-network-questions",
          },
          {
            text: "⭐️Tổng hợp câu hỏi phỏng vấn mạng máy tính thường gặp (phần 2)",
            link: "other-network-questions2",
          },
          // { text: "计算机网络知识总结", link: "computer-network-xiexiren-summary" },
        ],
      },
      {
        text: "Cơ bản",
        icon: ICONS.STAR,
        collapsible: true,
        children: [
          {
            text: "Giải thích chi tiết mô hình OSI 7 tầng và TCP/IP 4 tầng",
            link: "osi-and-tcp-ip-model",
          },
          {
            text: "Từ nhập URL đến hiển thị trang web, chuyện gì thực sự xảy ra?",
            link: "the-whole-process-of-accessing-web-pages",
          },
        ],
      },
      {
        text: "Tầng ứng dụng",
        icon: ICONS.CODE,
        collapsible: true,
        children: [
          {
            text: "⭐️Tổng kết giao thức tầng ứng dụng phổ biến",
            link: "application-layer-protocol",
          },
          { text: "⭐️HTTP vs HTTPS", link: "http-vs-https" },
          { text: "⭐️Đã có HTTP, vì sao vẫn cần RPC?", link: "http-vs-rpc" },
          {
            text: "RSA và ECDHE trong quá trình bắt tay HTTPS",
            link: "https-rsa-vs-ecdhe",
          },
          { text: "HTTP 1.0 vs HTTP 1.1", link: "http1.0-vs-http1.1" },
          {
            text: "Tổng kết các mã trạng thái (status code) HTTP phổ biến",
            link: "http-status-codes",
          },
          { text: "Giải thích chi tiết hệ thống tên miền DNS", link: "dns" },
        ],
      },
      {
        text: "Tầng giao vận",
        icon: ICONS.NETWORK,
        collapsible: true,
        children: [
          {
            text: "⭐️Bắt tay ba lần và bắt tay bốn lần của TCP",
            link: "tcp-connection-and-disconnection",
          },
          { text: "Giải thích chi tiết TCP TIME_WAIT", link: "tcp-time-wait" },
          {
            text: "TCP Keepalive và HTTP Keep-Alive khác nhau thế nào?",
            link: "tcp-keepalive-vs-http-keepalive",
          },
          {
            text: "Dòng byte TCP vs bản tin UDP",
            link: "tcp-byte-stream-udp-datagram",
          },
          {
            text: "⭐️Làm thế nào TCP đảm bảo truyền tải tin cậy?",
            link: "tcp-reliability-guarantee",
          },
          {
            text: "Ping được thì TCP có chắc kết nối được không?",
            link: "can-ping-but-tcp-may-not-connect",
          },
          {
            text: "TCP và UDP có thể dùng chung một cổng (port) không?",
            link: "can-tcp-and-udp-use-the-same-port",
          },
          {
            text: "Một host có thể giữ tối đa bao nhiêu kết nối TCP?",
            link: "maximum-number-of-tcp-connections-per-host",
          },
        ],
      },
      {
        text: "Tầng mạng",
        icon: ICONS.NETWORK,
        collapsible: true,
        children: [
          { text: "Giải thích chi tiết giao thức ARP", link: "arp" },
          { text: "Giải thích chi tiết giao thức NAT", link: "nat" },
        ],
      },
      {
        text: "Bảo mật",
        icon: ICONS.SECURITY,
        collapsible: true,
        children: [
          {
            text: "Tổng kết các phương thức tấn công mạng phổ biến",
            link: "network-attack-means",
          },
        ],
      },
    ],
  },
  {
    text: "Hệ điều hành",
    prefix: "operating-system/",
    icon: ICONS.OS,
    children: [
      {
        text: "Câu hỏi phỏng vấn",
        icon: ICONS.INTERVIEW,
        children: [
          {
            text: "⭐️Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (phần 1)",
            link: "operating-system-basic-questions-01",
          },
          {
            text: "⭐️Tổng hợp câu hỏi phỏng vấn hệ điều hành thường gặp (phần 2)",
            link: "operating-system-basic-questions-02",
          },
        ],
      },
      {
        text: "Bắt buộc ôn trong phỏng vấn",
        icon: ICONS.STAR,
        children: [
          { text: "⭐️Giải thích chi tiết bộ nhớ ảo", link: "virtual-memory" },
          {
            text: "⭐️Giải thích chi tiết I/O đa kênh (Multiplexing)",
            link: "io-multiplexing",
          },
          { text: "⭐️Giải thích chi tiết Zero-Copy", link: "zero-copy" },
        ],
      },
      {
        text: "Bộ nhớ và hệ thống tệp",
        icon: ICONS.OS,
        collapsible: true,
        children: [
          {
            text: "Giải thích chi tiết quản lý bộ nhớ",
            link: "memory-management",
          },
          { text: "Giải thích chi tiết hệ thống tệp", link: "file-system" },
        ],
      },
      {
        text: "Tiến trình và luồng",
        icon: ICONS.STAR,
        collapsible: true,
        children: [
          {
            text: "⭐️Giải thích chi tiết tiến trình và luồng",
            link: "process-and-thread",
          },
          { text: "⭐️Cơ chế khóa và đồng bộ hóa", link: "os-lock-and-sync" },
          { text: "⭐️Giải thích chi tiết deadlock", link: "dead-lock" },
          {
            text: "Ngắt, ngoại lệ và lời gọi hệ thống (system call)",
            link: "interrupt-exception-syscall",
          },
          {
            text: "Lập lịch CPU và tải hệ thống",
            link: "cpu-scheduling-and-load",
          },
          {
            text: "Giải thích chi tiết IPC (truyền thông giữa tiến trình)",
            link: "ipc",
          },
        ],
      },
      {
        text: "Linux",
        icon: ICONS.LINUX,
        children: [
          { text: "Tổng kết kiến thức cơ bản Linux", link: "linux-intro" },
          {
            text: "Tổng kết kiến thức cơ bản lập trình Shell",
            link: "shell-intro",
          },
        ],
      },
    ],
  },
  {
    text: "Cấu trúc dữ liệu",
    prefix: "data-structure/",
    icon: ICONS.DATA_STRUCTURE,
    collapsible: true,
    children: [
      {
        text: "Hệ thống kiến thức",
        link: "/cs-basics/data-structure/",
      },
      {
        text: "Cấu trúc cơ bản",
        collapsible: true,
        children: [
          {
            text: "Cấu trúc dữ liệu tuyến tính",
            link: "linear-data-structure",
          },
          { text: "⭐️Bảng băm (Hash Table)", link: "hash-table" },
        ],
      },
      {
        text: "Cây và Heap",
        collapsible: true,
        children: [
          { text: "⭐️Cấu trúc cây", link: "tree" },
          { text: "⭐️Heap", link: "heap" },
          { text: "Cây đỏ-đen (Red Black Tree)", link: "red-black-tree" },
        ],
      },
      {
        text: "Đồ thị và tập hợp",
        collapsible: true,
        children: [
          { text: "Đồ thị (Graph)", link: "graph" },
          { text: "⭐️Union-Find (tập hợp liên kết)", link: "union-find" },
        ],
      },
      {
        text: "Chuỗi và chỉ mục có thứ tự",
        collapsible: true,
        children: [
          { text: "Cây tiền tố Trie", link: "trie" },
          { text: "Danh sách bước nhảy (Skip List)", link: "skip-list" },
        ],
      },
      {
        text: "Cấu trúc dạng kỹ thuật",
        collapsible: true,
        children: [
          { text: "⭐️Bộ lọc Bloom (Bloom Filter)", link: "bloom-filter" },
          { text: "⭐️Bộ nhớ đệm LRU", link: "lru-cache" },
        ],
      },
    ],
  },
  {
    text: "Thuật toán",
    prefix: "algorithms/",
    icon: ICONS.ALGORITHM,
    collapsible: true,
    children: [
      { text: "Phân tích độ phức tạp", link: "complexity-analysis" },
      { text: "Tìm kiếm nhị phân", link: "binary-search" },
      {
        text: "Hai con trỏ và cửa sổ trượt",
        link: "two-pointers-and-sliding-window",
      },
      { text: "DFS và BFS", link: "dfs-bfs" },
      { text: "Thuật toán quay lui (Backtracking)", link: "backtracking" },
      { text: "Quy hoạch động", link: "dynamic-programming" },
      { text: "Thuật toán tham lam", link: "greedy" },
      { text: "Bài toán Top K", link: "top-k" },
      {
        text: "Tư tưởng thuật toán kinh điển",
        link: "classical-algorithm-problems-recommendations",
      },
      {
        text: "Cấu trúc dữ liệu LeetCode",
        link: "common-data-structures-leetcode-recommendations",
      },
      { text: "Bài toán thuật toán chuỗi", link: "string-algorithm-problems" },
      {
        text: "Bài toán thuật toán danh sách liên kết",
        link: "linkedlist-algorithm-problems",
      },
      {
        text: "剑指 Offer (Kiếm Chỉ Offer)",
        link: "the-sword-refers-to-offer",
      },
      {
        text: "Thuật toán sắp xếp kinh điển",
        link: "10-classical-sorting-algorithms",
      },
    ],
  },
];
