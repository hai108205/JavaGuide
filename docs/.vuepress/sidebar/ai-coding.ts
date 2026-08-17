import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const aiCoding = arraySidebar([
  {
    text: "Nhập môn",
    icon: ICONS.BASIC,
    children: [
      {
        text: "Câu hỏi phỏng vấn mở về lập trình AI",
        link: "practices/ai-ide",
      },
      {
        text: "Lập trình AI nên chọn CLI hay IDE?",
        link: "practices/cli-vs-ide",
      },
    ],
  },
  {
    text: "Claude Code và Codex",
    icon: ICONS.CODE,
    children: [
      {
        text: "⭐️Hướng dẫn sử dụng Claude Code",
        link: "practices/claudecode-tips",
      },
      {
        text: "Giải thích chi tiết lệnh cốt lõi Claude Code",
        link: "practices/claudecode-commands",
      },
      {
        text: "⭐️Hướng dẫn thực hành tốt nhất OpenAI Codex",
        link: "practices/codex-best-practices",
      },
      {
        text: "Thay thế OMP bằng Claude Code đẹp mắt",
        link: "practices/oh-my-pi",
      },
      {
        text: "Ghostty: cài đặt, cấu hình và mẹo phổ biến",
        link: "practices/ghostty",
      },
      {
        text: "Claude Code Agent View: quản lý đa phiên",
        link: "practices/claudecode-agentview",
      },
    ],
  },
  {
    text: "Nguyên lý Claude Code",
    icon: ICONS.CODE,
    prefix: "principles/",
    children: [
      {
        text: "Quản lý ngữ cảnh (context) Claude Code",
        link: "claude-code-context-management",
      },
      {
        text: "Hệ thống bộ nhớ Claude Code",
        link: "claude-code-memory",
      },
      {
        text: "Nguyên lý Claude Code Skills",
        link: "claude-code-skills",
      },
      {
        text: "Nguyên lý Claude Code Hooks",
        link: "claude-code-hooks",
      },
      {
        text: "Cơ chế đa Agent của Claude Code",
        link: "claude-code-multi-agent",
      },
    ],
  },
  {
    text: "Quy chuẩn và nâng cao hiệu suất",
    icon: ICONS.PERFORMANCE,
    children: [
      {
        text: "⭐️Tổng kết mẹo thực dụng Vibe Coding",
        link: "practices/the-cool-tricks-for-vibe-coding",
      },
      {
        text: "Spec Coding: lập trình theo quy cách",
        link: "practices/spec-coding",
      },
      {
        text: "⭐️Thực hành tốt nhất với CLAUDE.md",
        link: "practices/claude-md-best-practices",
      },
      {
        text: "⭐️Gợi ý Skills cần thiết khi lập trình AI",
        link: "practices/programmer-essential-skills",
      },
      {
        text: "Chọn lọc và tinh gọn Skills lập trình AI",
        link: "practices/skill-selection-and-pruning",
      },
      {
        text: "Một Skill vẽ biểu đồ AI hữu ích",
        link: "practices/drawio-chart-skill",
      },
    ],
  },
  {
    text: "Thực chiến lập trình AI",
    icon: ICONS.PROJECT,
    children: [
      {
        text: "Thực chiến đa tình huống với plugin IDEA + Qoder",
        link: "cases/idea-qoder-plugin",
      },
      {
        text: "Thực chiến đa tình huống với Trae + MiniMax",
        link: "cases/trae-m2.7",
      },
      {
        text: "Thực chiến kết nối mô hình bên thứ ba vào Claude Code",
        link: "cases/cc-glm5.1",
      },
      {
        text: "Thực chiến DeepSeek V4 + Claude Code",
        link: "cases/deepseek-v4-claude-code",
      },
      {
        text: "Thực chiến MiniMax M3 + Claude Code",
        link: "cases/cc-m3",
      },
      {
        text: "Thực chiến đa tình huống Kimi K3",
        link: "cases/kimi-k3",
      },
      {
        text: "Thực chiến plugin IDEA + CC GUI",
        link: "project/cc-guide",
      },
    ],
  },
]);
