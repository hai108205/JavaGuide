import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const openSourceProject = arraySidebar([
  {
    text: "Hướng dẫn kỹ thuật",
    link: "tutorial",
    icon: ICONS.BOOK,
  },
  {
    text: "Dự án thực chiến",
    link: "practical-project",
    icon: ICONS.PROJECT,
  },
  {
    text: "AI",
    link: "machine-learning",
    icon: ICONS.MACHINE_LEARNING,
  },
  {
    text: "Thiết kế hệ thống",
    link: "system-design",
    icon: ICONS.DESIGN,
  },
  {
    text: "Thư viện công cụ",
    link: "tool-library",
    icon: ICONS.LIBRARY,
  },
  {
    text: "Công cụ phát triển",
    link: "tools",
    icon: ICONS.TOOL,
  },
  {
    text: "Dữ liệu lớn",
    link: "big-data",
    icon: ICONS.BIG_DATA,
  },
]);
