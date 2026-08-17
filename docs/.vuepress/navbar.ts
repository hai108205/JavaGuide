import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "Phát triển backend", icon: "mdi:language-java", link: "/home.md" },
  {
    text: "Nền tảng máy tính",
    icon: "mdi:desktop-classic",
    link: "/cs-basics/",
  },
  { text: "Phát triển ứng dụng AI", icon: "mdi:robot-outline", link: "/ai/" },
  { text: "Lập trình AI", icon: "mdi:code-tags", link: "/ai-coding/" },
  {
    text: "Đề xuất đọc",
    icon: "mdi:book-open-page-variant-outline",
    children: [
      { text: "Lộ trình học", icon: "mdi:map-outline", link: "/roadmap/" },
      {
        text: "Dự án mã nguồn mở",
        icon: "mdi:github",
        link: "/open-source-project/",
      },
      {
        text: "Sách kỹ thuật",
        icon: "mdi:book-open-page-variant-outline",
        link: "/books/",
      },
      {
        text: "Hành trình lập trình viên",
        icon: "mdi:code-tags",
        link: "/high-quality-technical-articles/",
      },
    ],
  },
  {
    text: "Thông tin website",
    icon: "mdi:information-outline",
    children: [
      {
        text: "Về tác giả",
        icon: "mdi:account-edit-outline",
        link: "/about-the-author/",
      },
      {
        text: "Tải PDF",
        icon: "mdi:file-pdf-box",
        link: "/interview-preparation/pdf-interview-javaguide.md",
      },
      {
        text: "Phỏng vấn tập trung (tiếng Trung)",
        icon: "mdi:file-pdf-box",
        link: "https://interview.javaguide.cn/home.html",
      },
      {
        text: "Lịch sử cập nhật",
        icon: "mdi:history",
        link: "/timeline/",
      },
    ],
  },
]);
