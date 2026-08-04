---
title: Essential Books on Distributed Systems
description: Recommended books on distributed systems, including DDIA, distributed transactions, consensus algorithms, and microservices architecture. Master the core concepts of distributed system design.
category: Computer Science Books
icon: "mdi:transit-connection-variant"
---

## *Understanding Distributed Systems*

![](https://oss.javaguide.cn/github/javaguide/books/deep-understanding-of-distributed-system.png)

**[*Understanding Distributed Systems*](https://book.douban.com/subject/35794814/)** is an original Chinese book on distributed systems published in 2022. It introduces the fundamental concepts of distributed computing, common challenges, and consensus algorithms.

A significant portion of the book is dedicated to consensus algorithms—one of the most important topics in distributed systems. The author also walks readers through implementing the classic Paxos algorithm from scratch using Go.

To be honest, I haven't finished reading this book yet. However, I've read nearly every distributed systems article on the author's blog, and they're consistently excellent. The author started planning *Understanding Distributed Systems* in 2019, began writing in 2020, and spent nearly two years completing the manuscript.

![](https://oss.javaguide.cn/github/javaguide/books/image-20220706121952258.png)

The author also published an article explaining the story behind the book. If you're interested, you can read it here:

<https://zhuanlan.zhihu.com/p/487534882>

You can also find the book's source code and errata here:

<https://github.com/tangwz/DistSysDeepDive>

## *Designing Data-Intensive Applications*

![](https://oss.javaguide.cn/github/javaguide/books/ddia.png)

I highly recommend **[*Designing Data-Intensive Applications*](https://book.douban.com/subject/30329536/)** (DDIA). It's one of those books worth reading multiple times. On Douban, nearly 90% of readers gave it a five-star rating.

The book covers topics such as distributed databases, data partitioning, transactions, and distributed systems.

Many of the concepts discussed may already sound familiar, but the explanations often lead to those satisfying "Aha!" moments where everything finally clicks.

I've previously written a Zhihu post recommending this book:

[Which programming books impressed you the most?](https://www.zhihu.com/question/50408698/answer/2278198495)

If you find DDIA challenging, I also recommend reading the **DDIA Chapter-by-Chapter Guide** written by the author of *Understanding Distributed Systems*:

<https://ddia.qtmuniao.com>

## *Understanding Distributed Transactions*

![](https://oss.javaguide.cn/github/javaguide/books/In-depth-understanding-of-distributed-transactions-xiaoyu.png)

One of the authors of **[*Understanding Distributed Transactions*](https://book.douban.com/subject/35626925/)** is the creator of the Apache ShenYu (incubating) gateway as well as the distributed transaction frameworks Hmily, RainCat, and Myth.

If you're learning distributed transactions, this book is a worthwhile reference. Although it contains a few minor errors and some awkward explanations, it provides a solid overview of the major distributed transaction solutions.

## *From Paxos to ZooKeeper*

![](https://oss.javaguide.cn/github/javaguide/books/image-20211216161350118.png)

**[*From Paxos to ZooKeeper*](https://book.douban.com/subject/26292004/)** is an excellent introductory book on distributed systems theory. It explains several well-known distributed consistency protocols and approaches to solving consistency problems, with a strong focus on Paxos and the ZAB protocol.

> **Note:** ZooKeeper itself is no longer as widely used as it once was, so there's no need to spend too much time on it. However, both Paxos and ZAB remain highly valuable topics to study.

## *Understanding Distributed Consensus Algorithms*

![](https://oss.javaguide.cn/github/javaguide/books/deep-dive-into-distributed-consensus-algorithms.png)

**[*Understanding Distributed Consensus Algorithms*](https://book.douban.com/subject/36335459/)** provides an in-depth analysis of the core principles and implementation details of major consensus algorithms such as Paxos, Raft, and ZAB.

If you'd like to gain a deeper understanding of distributed consensus algorithms, this book is an excellent resource.

## *Microservices Patterns*

![](https://oss.javaguide.cn/github/javaguide/books/microservices-patterns.png)

**[*Microservices Patterns*](https://book.douban.com/subject/33425123/)** is written by Chris Richardson, one of the pioneers of microservices architecture and widely recognized as a leading software architect.

The book presents **44 battle-tested architectural patterns** for solving common microservices challenges, including service decomposition, transaction management, querying, and inter-service communication. Alongside solid theoretical explanations, it includes numerous Java examples that guide readers through building and deploying production-ready microservices.

## *Phoenix Architecture*

![](https://oss.javaguide.cn/github/javaguide/books/f5bec14d3b404ac4b041d723153658b5.png)

**[*Phoenix Architecture*](https://book.douban.com/subject/35492898/)** summarizes years of architecture and software engineering experience from Zhou Zhiming. It's packed with practical insights while maintaining both depth and breadth.

As the subtitle **"Building Reliable Large-Scale Distributed Systems"** suggests, the book focuses on one central question:

> **How do you build a reliable large-scale distributed software system?**

It covers topics such as:

- The evolution of software architecture from monoliths to microservices and serverless computing.
- Best practices and key considerations for software architects.
- Core distributed system technologies, including consensus algorithms such as Paxos and Multi-Paxos.
- Immutable infrastructure technologies such as containers and service meshes.
- Practical guidance for adopting microservices while avoiding common pitfalls.

I've recommended this book many times over the years. For more details, see these articles:

- [Another masterpiece from Zhou Zhiming! A hidden gem!](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247505254&idx=1&sn=04faf3093d6002354f06fffbfc2954e0&chksm=cea19aadf9d613bbba7ed0e02ccc4a9ef3a30f4d83530e7ad319c2cc69cd1770e43d1d470046&scene=178&cur_album_id=1646812382221926401#rd)

- [Another must-read book for Java developers!](https://mp.weixin.qq.com/s/9nbzfZGAWM9_qIMp1r6uUQ)

## Other Recommendations

- [*Distributed Systems: Concepts and Design*](https://book.douban.com/subject/21624776/): A textbook-style reference that is comprehensive but somewhat dry. Best used as a reference book.
- [*Principles and Practice of Distributed Architecture*](https://book.douban.com/subject/35689350/): Published in 2021. It hasn't gained much attention, and I haven't had a chance to read it yet.