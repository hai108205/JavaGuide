import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const zhuanlan = arraySidebar([
  {
    text: "Dự án thực chiến",
    icon: ICONS.PROJECT,
    collapsible: false,
    children: [
      {
        text: "Nền tảng phỏng vấn thông minh Spring AI",
        link: "interview-guide",
      },
      { text: "Tự viết framework RPC", link: "handwritten-rpc-framework" },
    ],
  },
  {
    text: "Tài liệu phỏng vấn",
    icon: ICONS.INTERVIEW,
    collapsible: false,
    children: [
      {
        text: "Java 面试指北 (La bàn phỏng vấn Java)",
        link: "java-mian-shi-zhi-bei",
      },
      {
        text: "Bài tập tần suất cao về thiết kế hệ thống & tình huống cho backend",
        link: "back-end-interview-high-frequency-system-design-and-scenario-questions",
      },
      {
        text: "Loạt bài đọc mã nguồn bắt buộc cho Java",
        link: "source-code-reading",
      },
    ],
  },
]);
