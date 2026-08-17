import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const ai = arraySidebar([
  {
    text: "Nhập môn tổng quan",
    icon: ICONS.BASIC,
    children: [
      { text: "⭐️Tổng quan khái niệm cốt lõi AI", link: "ai-core-concepts" },
    ],
  },
  {
    text: "Câu hỏi phỏng vấn",
    icon: ICONS.INTERVIEW,
    prefix: "interview-questions/",
    children: [
      {
        text: "⭐️Hướng dẫn phỏng vấn phát triển ứng dụng AI",
        link: "ai-interview-guide",
      },
      {
        text: "Tổng hợp câu hỏi phỏng vấn cơ bản về mô hình lớn",
        link: "llm-interview-questions",
      },
      {
        text: "Tổng hợp câu hỏi phỏng vấn AI Agent",
        link: "agent-interview-questions",
      },
      {
        text: "Tổng hợp câu hỏi phỏng vấn RAG",
        link: "rag-interview-questions",
      },
      {
        text: "Tổng hợp câu hỏi phỏng vấn thiết kế hệ thống AI",
        link: "ai-system-design-interview-questions",
      },
    ],
  },
  {
    text: "Mô hình lớn (LLM) cơ bản",
    icon: ICONS.MACHINE_LEARNING,
    prefix: "llm-basis/",
    children: [
      {
        text: "Giải mã vận hành của LLM (chi tiết)",
        link: "llm-operation-mechanism",
      },
      {
        text: "Thực tiễn kỹ thuật gọi API mô hình lớn",
        link: "llm-api-engineering",
      },
      {
        text: "Giải thích chi tiết đầu ra có cấu trúc của mô hình lớn",
        link: "structured-output-function-calling",
      },
      { text: "Hệ thống đánh giá ứng dụng AI", link: "llm-evaluation" },
    ],
  },
  {
    text: "AI Agent",
    icon: ICONS.CHAT,
    prefix: "agent/",
    children: [
      {
        text: "⭐️Giải thích chi tiết khái niệm cốt lõi AI Agent",
        link: "agent-basis",
      },
      {
        text: "⭐️Giải thích chi tiết hệ thống bộ nhớ AI Agent",
        link: "agent-memory",
      },
      {
        text: "Hướng dẫn thực chiến kỹ thuật prompt",
        link: "prompt-engineering",
      },
      {
        text: "Hướng dẫn thực chiến kỹ thuật ngữ cảnh (context)",
        link: "context-engineering",
      },
      { text: "Giải mã chi tiết Agent Skills", link: "skills" },
      { text: "Giải mã chi tiết giao thức MCP", link: "mcp" },
      {
        text: "Giải thích chi tiết Harness Engineering",
        link: "harness-engineering",
      },
      { text: "Giải thích chi tiết AI Workflow", link: "workflow-graph-loop" },
      {
        text: "Giải thích chi tiết Loop Engineering",
        link: "loop-engineering",
      },
    ],
  },
  {
    text: "RAG",
    icon: ICONS.SEARCH,
    prefix: "rag/",
    children: [
      {
        text: "⭐️Giải thích chi tiết khái niệm cơ bản RAG",
        link: "rag-basis",
      },
      {
        text: "Chiến lược xử lý và chia tách tài liệu RAG",
        link: "rag-document-processing",
      },
      {
        text: "⭐️Thuật toán chỉ mục vector và cơ sở dữ liệu vector trong RAG",
        link: "rag-vector-store",
      },
      {
        text: "Chiến lược cập nhật tài liệu kho tri thức RAG",
        link: "rag-knowledge-update",
      },
      { text: "Giải thích chi tiết GraphRAG", link: "graphrag" },
      { text: "Tối ưu tìm kiếm RAG", link: "rag-optimization" },
    ],
  },
  {
    text: "Thiết kế hệ thống AI",
    icon: ICONS.DESIGN,
    prefix: "system-design/",
    children: [
      {
        text: "Thiết kế hệ thống ứng dụng AI",
        link: "ai-application-architecture",
      },
      {
        text: "Giải thích chi tiết cổng mô hình lớn (LLM Gateway)",
        link: "llm-gateway",
      },
      { text: "Giải thích chi tiết công nghệ giọng nói AI", link: "ai-voice" },
    ],
  },
]);
