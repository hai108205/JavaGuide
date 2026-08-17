import { sidebar } from "vuepress-theme-hope";

import { aboutTheAuthor } from "./about-the-author.js";
import { ai } from "./ai.js";
import { aiCoding } from "./ai-coding.js";
import { books } from "./books.js";
import { csBasics } from "./cs-basics.js";
import { highQualityTechnicalArticles } from "./high-quality-technical-articles.js";
import { openSourceProject } from "./open-source-project.js";
import { roadmap } from "./roadmap.js";
import { zhuanlan } from "./zhuanlan.js";
import {
  ICONS,
  createImportantSection,
  createSourceCodeSection,
} from "./constants.js";

export default sidebar({
  // 应该把更精确的路径放置在前边
  "/ai-coding/": aiCoding,
  "/ai/": ai,
  "/roadmap/": roadmap,
  "/cs-basics/": csBasics,
  "/open-source-project/": openSourceProject,
  "/books/": books,
  "/about-the-author/": aboutTheAuthor,
  "/high-quality-technical-articles/": highQualityTechnicalArticles,
  "/zhuanlan/": zhuanlan,
  // 必须放在最后面
  "/": [
    {
      text: "Giới thiệu dự án",
      icon: ICONS.STAR,
      collapsible: true,
      prefix: "javaguide/",
      children: ["intro", "use-suggestion", "contribution-guideline", "faq"],
    },
    {
      text: "Chuẩn bị phỏng vấn (bắt buộc xem)",
      icon: ICONS.INTERVIEW,
      collapsible: true,
      prefix: "interview-preparation/",
      children: [
        {
          text: "Hệ thống kiến thức chuẩn bị phỏng vấn",
          link: "/interview-preparation/",
        },
        {
          text: "Kế hoạch vượt qua phỏng vấn backend Java",
          link: "backend-interview-plan",
        },
        "teach-you-how-to-prepare-for-the-interview-hand-in-hand",
        "resume-guide",
        {
          text: "Tổng hợp trọng điểm phỏng vấn backend Java",
          link: "key-points-of-interview",
        },
        {
          text: "Tài liệu PDF phỏng vấn Java + phỏng vấn backend",
          link: "pdf-interview-javaguide",
        },
        { text: "Lộ trình học Java", link: "java-roadmap" },
        "project-experience-guide",
        "how-to-handle-interview-nerves",
        "internship-experience",
      ],
    },
    {
      text: "Java",
      icon: ICONS.JAVA,
      collapsible: true,
      prefix: "java/",
      children: [
        {
          text: "Hệ thống kiến thức Java",
          link: "/java/",
        },
        {
          text: "Cơ bản",
          prefix: "basis/",
          icon: ICONS.BASIC,
          children: [
            "java-basic-questions-01",
            "java-basic-questions-02",
            "java-basic-questions-03",
            createImportantSection([
              "why-there-only-value-passing-in-java",
              "serialization",
              "generics-and-wildcards",
              "reflection",
              "proxy",
              "bigdecimal",
              {
                text: "Lựa chọn kiểu tiền tệ trong Java",
                link: "money-long-vs-bigdecimal",
              },
              "unsafe",
              "spi",
              "syntactic-sugar",
            ]),
          ],
        },
        {
          text: "Collection",
          prefix: "collection/",
          icon: ICONS.CONTAINER,
          children: [
            "java-collection-questions-01",
            "java-collection-questions-02",
            "java-collection-precautions-for-use",
            createSourceCodeSection([
              "arraylist-source-code",
              "linkedlist-source-code",
              "hashmap-source-code",
              "concurrent-hash-map-source-code",
              "linkedhashmap-source-code",
              "copyonwritearraylist-source-code",
              "arrayblockingqueue-source-code",
              "priorityqueue-source-code",
              "delayqueue-source-code",
            ]),
          ],
        },
        {
          text: "Lập trình đa luồng (Concurrency)",
          prefix: "concurrent/",
          icon: ICONS.PERFORMANCE,
          children: [
            "java-concurrent-questions-01",
            "java-concurrent-questions-02",
            "java-concurrent-questions-03",
            createImportantSection([
              {
                text: "Giải thích chi tiết về Lock (khóa) trong Java",
                link: "java-lock",
              },
              "optimistic-lock-and-pessimistic-lock",
              "cas",
              "jmm",
              "java-thread-pool-summary",
              "java-thread-pool-best-practices",
              "java-concurrent-collections",
              "aqs",
              "atomic-classes",
              "threadlocal",
              "completablefuture-intro",
              "virtual-thread",
            ]),
          ],
        },
        {
          text: "IO",
          prefix: "io/",
          icon: ICONS.CODE,
          collapsible: true,
          children: ["io-basis", "io-design-patterns", "io-model", "nio-basis"],
        },
        {
          text: "JVM",
          prefix: "jvm/",
          icon: ICONS.VIRTUAL_MACHINE,
          collapsible: true,
          children: [
            {
              text: "Tổng hợp câu hỏi phỏng vấn JVM thường gặp",
              link: "https://interview.javaguide.cn/java/java-jvm.html",
            },
            "memory-area",
            "jvm-garbage-collection",
            "class-file-structure",
            "class-loading-process",
            "classloader",
            "jvm-parameters-intro",
            "jdk-monitoring-and-troubleshooting-tools",
            "jvm-in-action",
          ],
        },
        {
          text: "Tính năng mới",
          prefix: "new-features/",
          icon: ICONS.FEATURED,
          collapsible: true,
          children: [
            "java8-common-new-features",
            "java8-tutorial-translate",
            "java9",
            "java10",
            "java11",
            "java12-13",
            "java14-15",
            "java16",
            "java17",
            "java18",
            "java19",
            "java20",
            "java21",
            "java22-23",
            "java24",
            "java25",
          ],
        },
      ],
    },
    {
      text: "CSDL (Cơ sở dữ liệu)",
      icon: ICONS.DATABASE,
      prefix: "database/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức CSDL",
          link: "/database/",
        },
        {
          text: "Cơ bản",
          icon: ICONS.BASIC,
          children: [
            "basis",
            "nosql",
            {
              text: "Giải thích chi tiết về Charset",
              link: "character-set",
            },
            {
              text: "SQL",
              icon: ICONS.SQL,
              prefix: "sql/",
              collapsible: true,
              children: [
                "sql-syntax-summary",
                "sql-questions-01",
                "sql-questions-02",
                "sql-questions-03",
                "sql-questions-04",
                "sql-questions-05",
              ],
            },
          ],
        },
        {
          text: "MySQL",
          prefix: "mysql/",
          icon: ICONS.MYSQL,
          children: [
            "mysql-questions-01",
            "mysql-high-performance-optimization-specification-recommendations",
            createImportantSection([
              "mysql-index",
              "mysql-index-invalidation",
              {
                text: "Giải thích chi tiết ba nhật ký (log) lớn của MySQL",
                link: "mysql-logs",
              },
              {
                text: "Sao lưu và khôi phục dữ liệu MySQL",
                link: "mysql-backup-and-restore",
              },
              "transaction-isolation-level",
              "innodb-implementation-of-mvcc",
              "how-sql-executed-in-mysql",
              "mysql-query-cache",
              "mysql-query-execution-plan",
              "mysql-auto-increment-primary-key-continuous",
              "some-thoughts-on-database-storage-time",
              "index-invalidation-caused-by-implicit-conversion",
            ]),
          ],
        },
        {
          text: "Redis",
          prefix: "redis/",
          icon: ICONS.REDIS,
          children: [
            "cache-basics",
            "redis-questions-01",
            "redis-questions-02",
            createImportantSection([
              "redis-delayed-task",
              "redis-stream-mq",
              "3-commonly-used-cache-read-and-write-strategies",
              "redis-data-structures-01",
              "redis-data-structures-02",
              "redis-skiplist",
              "redis-persistence",
              "redis-memory-fragmentation",
              "redis-common-blocking-problems-summary",
              "redis-cluster",
            ]),
          ],
        },
        {
          text: "Elasticsearch",
          prefix: "elasticsearch/",
          icon: ICONS.ELASTICSEARCH,
          collapsible: true,
          children: ["elasticsearch-questions-01"],
        },
        {
          text: "MongoDB",
          prefix: "mongodb/",
          icon: ICONS.MONGODB,
          collapsible: true,
          children: ["mongodb-questions-01", "mongodb-questions-02"],
        },
      ],
    },
    {
      text: "Công cụ phát triển",
      icon: ICONS.TOOL,
      prefix: "tools/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức công cụ phát triển",
          link: "/tools/",
        },
        {
          text: "Maven",
          icon: ICONS.MAVEN,
          prefix: "maven/",
          children: [
            {
              text: "Tổng kết khái niệm cốt lõi Maven",
              link: "maven-core-concepts",
            },
            {
              text: "Thực hành tốt nhất với Maven",
              link: "maven-best-practices",
            },
          ],
        },
        {
          text: "Gradle",
          icon: ICONS.GRADLE,
          prefix: "gradle/",
          children: ["gradle-core-concepts"],
        },
        {
          text: "Git",
          icon: ICONS.GIT,
          prefix: "git/",
          children: ["git-intro", "github-tips"],
        },
        {
          text: "Docker",
          icon: ICONS.DOCKER,
          prefix: "docker/",
          children: ["docker-intro", "docker-in-action"],
        },
        {
          text: "IDEA",
          icon: ICONS.IDEA,
          link: "https://gitee.com/SnailClimb/awesome-idea-tutorial",
        },
      ],
    },
    {
      text: "Framework phổ biến",
      prefix: "system-design/framework/",
      icon: ICONS.COMPONENT,
      collapsible: true,
      children: [
        {
          text: "Spring & Spring Boot",
          icon: ICONS.SPRING_BOOT,
          prefix: "spring/",
          children: [
            "spring-knowledge-and-questions-summary",
            "springboot-knowledge-and-questions-summary",
            "spring-common-annotations",
            "springboot-source-code",
            createImportantSection([
              "ioc-and-aop",
              "spring-transaction",
              "spring-design-patterns-summary",
              "spring-boot-auto-assembly-principles",
              "async",
            ]),
          ],
        },
        "mybatis/mybatis-interview",
        "netty",
      ],
    },
    {
      text: "Thiết kế hệ thống",
      icon: ICONS.DESIGN,
      prefix: "system-design/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức thiết kế hệ thống",
          link: "/system-design/",
        },
        {
          text: "Kiến thức cơ bản",
          prefix: "basis/",
          icon: ICONS.BASIC,
          collapsible: true,
          children: [
            "RESTfulAPI",
            "software-engineering",
            "naming",
            "refactoring",
            {
              text: "Hướng dẫn kiểm thử đơn vị",
              link: "unit-test",
            },
          ],
        },
        {
          text: "Xác thực & ủy quyền",
          prefix: "security/",
          icon: ICONS.SECURITY,
          collapsible: true,
          children: [
            "basis-of-authority-certification",
            "jwt-intro",
            "advantages-and-disadvantages-of-jwt",
            "sso-intro",
            "design-of-authority-system",
          ],
        },
        {
          text: "Bảo mật dữ liệu",
          prefix: "security/",
          icon: ICONS.SECURITY,
          collapsible: true,
          children: [
            "encryption-algorithms",
            "sentive-words-filter",
            "data-desensitization",
            "data-validation",
            "why-password-reset-instead-of-retrieval",
          ],
        },
        "system-design-questions",
        {
          text: "⭐Tổng hợp câu hỏi phỏng vấn mẫu thiết kế thường gặp",
          link: "https://interview.javaguide.cn/system-design/design-pattern.html",
        },
        "schedule-task",
        "web-real-time-message-push",
      ],
    },
    {
      text: "Phân tán (Distributed)",
      icon: ICONS.DISTRIBUTED,
      prefix: "distributed-system/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức hệ phân tán",
          link: "/distributed-system/",
        },
        {
          text: "Nhập môn hệ phân tán",
          link: "distributed-system-intro",
        },
        {
          text: "⭐Câu hỏi phỏng vấn tần suất cao hệ phân tán",
          link: "distributed-system-interview-questions",
        },
        {
          text: "Lý thuyết & thuật toán & giao thức",
          icon: ICONS.ALGORITHM,
          prefix: "protocol/",
          collapsible: true,
          children: [
            {
              text: "Chuyên đề lý thuyết & thuật toán & giao thức",
              link: "/distributed-system/protocol/",
            },
            {
              text: "Giải thích chi tiết định lý CAP và lý thuyết BASE",
              link: "cap-and-base-theorem",
            },
            {
              text: "Giải thích chi tiết phối điều phối phân tán (Distributed Coordination)",
              link: "centralized-and-decentralized",
            },
            {
              text: "Bài toán tướng Byzantine",
              link: "byzantine-generals-problem",
            },
            {
              text: "Giải thích chi tiết thuật toán Paxos",
              link: "paxos-algorithm",
            },
            {
              text: "Giải thích chi tiết thuật toán Raft",
              link: "raft-algorithm",
            },
            { text: "Giải thích chi tiết giao thức ZAB", link: "zab" },
            {
              text: "Giải thích chi tiết giao thức Gossip",
              link: "gossip-protocol",
            },
            {
              text: "Giải thích chi tiết thuật toán băm nhất quán",
              link: "consistent-hashing",
            },
          ],
        },
        {
          text: "API Gateway",
          icon: ICONS.GATEWAY,
          children: [
            {
              text: "Tổng kết kiến thức cơ bản về API Gateway",
              link: "api-gateway",
            },
            {
              text: "Tổng hợp câu hỏi phỏng vấn Spring Cloud Gateway",
              link: "spring-cloud-gateway-questions",
            },
          ],
        },
        {
          text: "ID phân tán (Distributed ID)",
          icon: ICONS.ID,
          children: [
            {
              text: "Giải thích chi tiết phương án sinh ID phân tán",
              link: "distributed-id",
            },
            {
              text: "Hướng dẫn thực chiến thiết kế ID phân tán",
              link: "distributed-id-design",
            },
          ],
        },
        {
          text: "Khóa phân tán (Distributed Lock)",
          icon: ICONS.LOCK,
          children: [
            {
              text: "Giới thiệu nhập môn khóa phân tán",
              link: "distributed-lock",
            },
            {
              text: "Tổng kết phương án triển khai khóa phân tán phổ biến",
              link: "distributed-lock-implementations",
            },
          ],
        },
        {
          text: "Giao dịch phân tán (Distributed Transaction)",
          icon: ICONS.TRANSACTION,
          children: [
            {
              text: "Tổng kết giải pháp giao dịch phân tán",
              link: "distributed-transaction",
            },
          ],
        },
        {
          text: "Trung tâm cấu hình phân tán",
          icon: ICONS.MAVEN,
          children: [
            {
              text: "Tổng hợp câu hỏi phỏng vấn trung tâm cấu hình phân tán",
              link: "distributed-configuration-center",
            },
          ],
        },
        {
          text: "RPC",
          prefix: "rpc/",
          icon: ICONS.RPC,
          collapsible: true,
          children: [
            { text: "Chuyên đề RPC", link: "/distributed-system/rpc/" },
            { text: "Tổng kết kiến thức cơ bản về RPC", link: "rpc-intro" },
            { text: "Tổng hợp câu hỏi phỏng vấn Dubbo", link: "dubbo" },
          ],
        },
        {
          text: "ZooKeeper",
          prefix: "distributed-process-coordination/zookeeper/",
          icon: ICONS.FRAMEWORK,
          collapsible: true,
          children: [
            {
              text: "Chuyên đề ZooKeeper",
              link: "/distributed-system/distributed-process-coordination/zookeeper/",
            },
            { text: "Hướng dẫn nhập môn ZooKeeper", link: "zookeeper-intro" },
            {
              text: "Giải thích chi tiết nâng cao ZooKeeper",
              link: "zookeeper-plus",
            },
            {
              text: "Hướng dẫn thực chiến ZooKeeper",
              link: "zookeeper-in-action",
            },
          ],
        },
      ],
    },
    {
      text: "Hiệu năng cao (High Performance)",
      icon: ICONS.PERFORMANCE,
      prefix: "high-performance/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức hệ thống hiệu năng cao",
          link: "/high-performance/",
        },
        {
          text: "⭐Câu hỏi phỏng vấn tần suất cao thiết kế hệ thống hiệu năng cao",
          link: "high-performance-interview-questions",
        },
        {
          text: "CDN",
          icon: ICONS.CDN,
          children: ["cdn"],
        },
        {
          text: "Cân bằng tải (Load Balancing)",
          icon: ICONS.LOAD_BALANCING,
          children: [
            {
              text: "Giải thích chi tiết nguyên lý và thuật toán cân bằng tải",
              link: "load-balancing",
            },
          ],
        },
        {
          text: "Tối ưu cơ sở dữ liệu",
          icon: ICONS.MYSQL,
          children: [
            "read-and-write-separation-and-library-subtable",
            "data-cold-hot-separation",
            "sql-optimization",
            "deep-pagination-optimization",
          ],
        },
        {
          text: "Hàng đợi tin nhắn (Message Queue)",
          prefix: "message-queue/",
          icon: ICONS.MQ,
          collapsible: true,
          children: [
            "message-queue",
            "disruptor-questions",
            "kafka-questions-01",
            "rocketmq-questions",
            "rabbitmq-questions",
          ],
        },
      ],
    },
    {
      text: "Khả dụng cao (High Availability)",
      icon: ICONS.HIGH_AVAILABLE,
      prefix: "high-availability/",
      collapsible: true,
      children: [
        {
          text: "Hệ thống kiến thức hệ thống khả dụng cao",
          link: "/high-availability/",
        },
        {
          text: "⭐Tổng hợp câu hỏi phỏng vấn hệ thống khả dụng cao",
          link: "high-availability-interview-questions",
        },
        {
          text: "Hướng dẫn thiết kế hệ thống khả dụng cao",
          link: "high-availability-system-design",
        },
        {
          text: "⭐Tổng kết phương án tính chất lũy đẳng (Idempotency) cho giao diện",
          link: "idempotency",
        },
        {
          text: "⭐Giải thích chi tiết giới hạn lưu lượng dịch vụ (Rate Limiting)",
          link: "limit-request",
        },
        {
          text: "⭐Giải thích chi tiết cơ chế timeout và retry",
          link: "timeout-and-retry",
        },
        {
          text: "Giải thích chi tiết giáng cấp dịch vụ (Fallback) và ngắt mạch (Circuit Breaker)",
          link: "fallback-and-circuit-breaker",
        },
        {
          text: "Giải thích chi tiết thiết kế dự phòng (Redundancy)",
          link: "redundancy",
        },
        {
          text: "Nhập môn kiểm thử hiệu năng",
          link: "performance-test",
        },
      ],
    },
  ],
});
