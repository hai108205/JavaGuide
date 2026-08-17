import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const books = arraySidebar([
  {
    text: "Nền tảng máy tính",
    link: "cs-basics",
    icon: ICONS.COMPUTER,
  },
  {
    text: "Cơ sở dữ liệu",
    link: "database",
    icon: ICONS.DATABASE,
  },
  {
    text: "Máy tìm kiếm",
    link: "search-engine",
    icon: ICONS.SEARCH,
  },
  {
    text: "Java",
    link: "java",
    icon: ICONS.JAVA,
  },
  {
    text: "Chất lượng phần mềm",
    link: "software-quality",
    icon: ICONS.HIGH_AVAILABLE,
  },

  {
    text: "Hệ phân tán",
    link: "distributed-system",
    icon: ICONS.DISTRIBUTED,
  },
]);
