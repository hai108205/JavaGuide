---
title: Must-Read Classic Books for Computer Science Fundamentals
description: Recommendations for Computer Science fundamental books, featuring a curated list of classic textbooks and learning resources for core courses such as Operating Systems, Computer Networks, Algorithms and Data Structures, and Compiler Principles.
category: Computer Science Books
icon: "mdi:desktop-classic"
head:
  - - meta
    - name: keywords
      content: Selected Books on Computer Science Fundamentals
---

Considering that many students prefer watching videos, this section will not only recommend books but also some excellent video tutorials and projects from top universities that I find highly valuable.

## Operating Systems

**Why study Operating Systems?**

**In terms of personal skill enhancement**, many of the concepts and classic algorithms in operating systems can be found in the various tools or frameworks we use in everyday development. For instance, the caching mechanisms (like Redis) we use in system development are very similar to CPU cache in operating systems. There are multiple levels of CPU cache, but most are designed to resolve the mismatch between CPU processing speed and memory access speed. We can also view memory as a cache for external storage; when a program runs, we copy data from external storage to memory. Since memory processing speed is far higher, this improves overall performance. Similarly, the Redis cache we use solves the speed mismatch between program execution and conventional relational database access. Caches generally follow the principle of locality (the 80/20 rule) and use specific eviction algorithms to ensure that the data in the cache is frequently accessed. Redis often operates on this 80/20 rule as well, and many of its eviction algorithms are similar to those in operating systems. Speaking of the 80/20 rule, we must mention the "hit rate," a universal concept for all caches. Simply put, it's the percentage of requested data that can be found directly in the cache. A high hit rate generally indicates a well-designed cache and faster system processing.

**From an interview perspective**, especially in campus recruitment, knowledge about operating systems is heavily tested.

**In short, studying operating systems enhances the depth of your thinking and your technical comprehension. Plus, OS knowledge is a must-have for interviews.**

If you want to study operating systems systematically, the most hardcore and authoritative book is **[*Operating Systems: Three Easy Pieces (OSTEP)*](https://book.douban.com/subject/33463930/)**. You can pair it with **[*Computer Systems: A Programmer's Perspective (CSAPP)*](https://book.douban.com/subject/1230413/)** to deepen your understanding of the essence of computer systems. A perfect combo!

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201012191645919.png)

Additionally, a domestic OS book published last year is also highly recommended: **[*Modern Operating Systems: Principles and Implementation*](https://book.douban.com/subject/35208251/)** (A masterpiece by Professor Xia and Professor Chen's team, highly recommended).

![](https://oss.javaguide.cn/github/javaguide/books/20210406132050845.png)

If you are a hands-on person and somewhat resistant to purely theoretical knowledge, I recommend **[*30 Days to Build Your Own Operating System*](https://book.douban.com/subject/11530329/)**, which will guide you step-by-step in writing an operating system from scratch.

"What you learn from books is superficial; true understanding comes from hands-on practice!" I highly recommend that CS majors do as much hands-on practice as possible!!!

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123802972.png)

Other recommended books:

- **[*Write Your Own Operating System*](https://book.douban.com/subject/1422377/)**: Not only will it guide you through a detailed analysis of OS principles, but it will also use rich code examples to teach you step-by-step how to write an OS framework with basic functions using C and Assembly languages.
- **[*Modern Operating Systems*](https://book.douban.com/subject/3852290/)** (by Andrew S. Tanenbaum): The content is excellent, though the Chinese translation is average. If you plan to read this closely, it is highly recommended to do the exercises at the end of the chapters.
- **[*Unveiling the Truth of Operating Systems*](https://book.douban.com/subject/26745156/)**: The author graduated from Peking University and is a former Senior Operations Engineer at Baidu. Because he had to retake the OS course in college, he later researched it deeply and wrote this book.
- **[*In-Depth Exploration of Linux Operating Systems*](https://book.douban.com/subject/25743846/)**: Following this book will give you a clear understanding of how to build a complete GNU/Linux system.
- **[*Operating Systems: Design and Implementation*](https://book.douban.com/subject/2044818/)**: An authoritative textbook for OS teaching.
- **[*Orange'S: Implementation of an Operating System*](https://book.douban.com/subject/3735649/)**: Starting from just twenty lines of boot sector code, this book presents the complete process of building an OS framework. It is best read alongside *Operating Systems: Design and Implementation*!

If you prefer watching videos, I recommend the MOOC [*Operating Systems*](https://www.icourse163.org/course/HIT-1002531008) taught by Professor Li Zhijun from the Harbin Institute of Technology (HIT). Its content quality far surpasses many other national top-tier courses.

The course syllabus is as follows:

![Course Syllabus](https://oss.javaguide.cn/github/javaguide/books/image-20220414144527747.png)

It mainly covers six basic modules of a fundamental operating system: CPU management, Memory management, Peripheral management, Disk management and File systems, User interfaces, and Boot modules.

The course difficulty is quite high, especially the after-class labs. If you truly want to master the underlying principles of operating systems, try to complete the corresponding labs. As Professor Li Zhijun says: "What you learn from books is superficial; true understanding comes from hands-on practice."

![](https://oss.javaguide.cn/github/javaguide/books/image-20220414145210679.png)

If you can independently complete a few labs, I believe your understanding of operating systems will elevate by several levels. Of course, if your goal is just to cram for an interview, you might skip the labs.

To be honest, I personally love Professor Li Zhijun's lectures. I think he is a rare and exceptional teacher in China. He knows the gap between domestic and foreign textbooks, and the gap between domestic and foreign students, and he is trying to bridge that gap in his own way. I am truly grateful and look forward to his next course.

![](https://oss.javaguide.cn/github/javaguide/books/image-20220414145249714.png)

Additionally, the foreign course [*Computer Systems: A Programmer's Perspective (CSAPP)*](https://www.bilibili.com/video/av31289365?from=search&seid=16298868573410423104) is also fantastic.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201204140653318.png)

## Computer Networks

Computer Networks is a highly systematic core course for CS majors, and the curriculum at top universities is usually very mature.

To learn Computer Networks well, you must first understand the OSI 7-layer model or the TCP/IP 5-layer model: Application layer (Application, Presentation, Session), Transport layer, Network layer, Data Link layer, and Physical layer.

![OSI 7-layer model](https://oss.javaguide.cn/github/javaguide/booksosi%E4%B8%83%E5%B1%82%E6%A8%A1%E5%9E%8B2.png)

For this course, the strongly recommended reference book is **[*Computer Networking: A Top-Down Approach*](https://book.douban.com/subject/26986910/) by Mechanical Industry Press**. The book has a clear structure, explaining everything layer by layer according to the TCP/IP 5-layer model, with detailed discussions on the technologies involved in each layer. Essentially, the syllabus of this course in most universities directly mirrors the table of contents of this book.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123250570.png)

If you find the above book a bit dry, I highly recommend checking out these two very interesting network-related books:

- [*Illustrated HTTP*](https://book.douban.com/subject/25863515/ "《图解 HTTP》"): Explains HTTP like a comic book. It's very engaging, not boring at all, and covers common HTTP concepts. Due to length constraints, it might not be exhaustively comprehensive. However, unless you are specifically doing network research, this book is more than enough for understanding HTTP.
- [*How Networks Work*](https://book.douban.com/subject/26941639/ "《网络是怎样连接的》"): From typing a URL in the browser to displaying the web page, it traces the entire process. With illustrations and text, it explains the full picture of the network, focusing on how actual network hardware and software operate.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201011215144139.png)

Besides theoretical knowledge, a crucial part of learning computer networks is **"hands-on practice"**. This is very similar to programming.

There are several Computer Network labs/projects from top universities available on GitHub:

- [HIT Computer Network Labs](https://github.com/rccoder/HIT-Computer-Network)
- [*Computer Networking: A Top-Down Approach (6th Edition)* Programming Assignments, Wireshark Lab Translation and Solutions.](https://github.com/moranzcw/Computer-Networking-A-Top-Down-Approach-NOTES)
- [A Computer Networks Final Project: A Chatroom Written in Python](https://github.com/KevinWang15/network-pj-chatroom)
- [CMU Computer Networks Course](https://computer-networks.github.io/sp19/lectures.html)

I know many of you might prefer to learn by watching videos. So, here are a few top-tier video tutorials for Computer Networks:

**1. [HIT Computer Networks Course](http://www.icourse163.org/course/HIT-154005)**: A national top-tier course, which has been taught for 10 sessions so far. The feedback is extremely positive! Highly recommended!

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201218141241911.png)

**2. [Wangdao CS Prep: Computer Networks](https://www.bilibili.com/video/BV19E411D78Q?from=search&seid=17198507506906312317)**: Perfect for CS students preparing for graduate entrance exams! This video currently has over 16k likes on Bilibili.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201218141652837.png)

## Algorithms

Let's look at three introductory books first. Any one of these three is an excellent starting point for learning algorithms.

1. [*My First Book of Algorithms*](https://book.douban.com/subject/30357170/)
2. [*Grokking Algorithms*](https://book.douban.com/subject/26979890/)
3. [*Aha! Algorithms*](https://book.douban.com/subject/25894685/)

![](https://oss.javaguide.cn/java-guide-blog/image-20210327104418851.png)

I personally lean towards **[*My First Book of Algorithms*](https://book.douban.com/subject/30357170/)**, even though its Douban rating is slightly lower than the other two. I think its illustrations and explanations are the best among the three. The only obvious downside is the lack of code examples. However, I don't think this stops it from being a great algorithm book. The primary goal of these three beginner books isn't to make you an algorithm master via code, but to serve as a great stepping stone into the world of algorithms.

Here are a few more classic algorithm books:

**[*Algorithms (4th Edition)*](https://book.douban.com/subject/19952400/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123422140.png)

This book is very clear and easy to understand, making it suitable for beginners in data structures and algorithms. It covers almost all commonly used data structures and algorithms!

In my sophomore year, a professor strongly recommended this to us! I bought a copy for my dorm and had read a little over half of it by the time I graduated—simply because there is so much content! Additionally, the book provides detailed Java code, making it incredibly suitable for Java learners. It can be considered a must-have for Java programmers.

> **The following books are the classics among classics, but they are also quite difficult to read. I won't elaborate too much—just know they are absolute masterpieces!**
>
> **If you are purely preparing for algorithm interviews, it's not recommended to read the following books.**

**[*Programming Pearls*](https://book.douban.com/subject/3227098/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145334093.png)

A famous classic highly recommended by top-tier competitive programmers like ACM champions and runner-ups. The author is incredibly impressive—James Gosling, the father of Java, was his student.

Many people say this book doesn't just teach you specific algorithms, but rather a way of computational thinking. This way of thinking is applicable not only in programming but in other fields as well.

**[*The Algorithm Design Manual*](https://book.douban.com/subject/4048566/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145411049.png)

This is an algorithm book highly recommended by the wildly popular GitHub self-study project [Teach Yourself Computer Science](https://link.zhihu.com/?target=https%3A//teachyourselfcs.com/).

Similar masterpieces include [*Introduction to Algorithms (CLRS)*](https://book.douban.com/subject/20432061/) and [*The Art of Computer Programming (Vol. 1)*](https://book.douban.com/subject/1130500/).

**If you are preparing for interviews, the following books might be helpful!**

**[*Coding Interviews (Jianzhi Offer)*](https://book.douban.com/subject/6966465/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145506482.png)

This interview bible covers many classic algorithm interview questions. If you are preparing for big tech interviews, you definitely shouldn't miss this book.

An open-source repository providing solutions for the programming questions in *Coding Interviews*: [CodingInterviews](https://link.zhihu.com/?target=https%3A//github.com/gatieme/CodingInterviews).

**[*Programmer's Code Interview Guide (2nd Edition)*](https://book.douban.com/subject/30422021/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145622758.png)

Most of the problems in *Programmer's Code Interview Guide (2nd Edition)* are much harder than those in *Coding Interviews*, and the scope of the questions is much broader. The book contains nearly 300 real, classic coding interview questions.

For videos, I recommend Peking University's National Top-tier Course — **[Programming and Algorithms (II): Algorithm Fundamentals](https://www.icourse163.org/course/PKU-1001894005)**. It's taught brilliantly!

![](https://oss.javaguide.cn/github/javaguide/books/22ce4a17dc0c40f6a3e0d58002261b7a.png)

This course introduces seven fundamental, general-purpose algorithms (Enumeration, Binary Search, Recursion, Divide and Conquer, Dynamic Programming, Search, and Greedy Algorithms). Resolving complex algorithm problems often relies on these basic concepts. Furthermore, some examples in this course are on par with medium-difficulty problems in the ACM ICPC. If you can solve these problems, your algorithmic skills will surpass those of most undergraduate CS majors.

## Data Structures

In fact, many of the algorithm books mentioned above (like ***Algorithms*** and ***Introduction to Algorithms***) detail common data structures extensively.

Here, I will supplement with a few more books specifically focused on data structures.

**[*Big Talk Data Structures*](https://book.douban.com/subject/6424904/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145803440.png)

An introductory book that is very easy to read and understand. It's perfectly suited for those with zero background in data structures or those who didn't learn it well the first time and want to start over.

**[*Data Structures and Algorithm Analysis in Java*](https://book.douban.com/subject/3351237/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145823973.png)

High quality; covers common data structures and algorithms.

Similar books include **[*Data Structures and Algorithm Analysis in C*](https://book.douban.com/subject/1139426/)** and **[*Data Structures and Algorithm Analysis in C++*](https://book.douban.com/subject/1971825/)**.

![](https://oss.javaguide.cn/github/javaguide/books/d9c450ccc5224a5fba77f4fa937f7b9c.png)

For videos, I recommend Zhejiang University's National Top-tier Course — **[*Data Structures*](https://www.icourse163.org/course/ZJU-93001#/info)**.

Professor Chen Yue (affectionately known as "Grandma" by students) teaches Data Structures exceptionally well! However, it does have a certain level of difficulty, especially the after-class exercises.

## Fundamental Computer Science Courses

Math and English are general courses, usually completed within the freshman and sophomore years, while professional courses are gradually introduced in the sophomore and junior years. As the first courses many high school graduates take upon entering college, general courses serve as a transition from high school to undergraduate studies. While they might seem less critical to your career than professional courses, they hold a very important place in your undergraduate academic planning. Because general courses are numerous and carry heavy credits, they make up a large portion of your GPA during your undergraduate years, affecting your major ranking in the first two years and your eligibility for graduate recommendation (waiving the entrance exam) at the end of your junior year. From an academic advancement perspective, for those pursuing a master's or Ph.D., Math and English are exceptionally useful.

### Math

#### Calculus (Advanced Mathematics)

Calculus, often referred to as Advanced Math, is the nightmare of countless freshmen. Fortunately, university exams aren't overly strict; to get a high score on the finals, you don't need to grind through practice problems as brutally as in high school. The importance of Calculus for CS students lies mainly in functional transformations in Computer Graphics, gradient algorithms in Machine Learning, and fields like Signal Processing.

The Calculus knowledge system includes differentiation and integration. Usually, differentiation is taught first, followed by integration. Some universities split Advanced Math into two semesters. Differentiation is an upgraded version of high school derivatives and is relatively friendly for freshmen. Integration is the exact inverse operation of differentiation; conceptually, it might be very new for freshmen and hard to grasp immediately. However, all universities offer this course, most top universities have corresponding online courses, and the textbooks are well-polished. By combining online courses with "hitting the books," you definitely won't fall behind.

As for books, I recommend *The Calculus Lifesaver* (Princeton Calculus Reader). It provides detailed explanations of calculus fundamentals, limits, continuity, differentiation, applications of derivatives, integration, infinite series, Taylor series, and power series.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155056751.png)

#### Linear Algebra (Advanced Algebra)

The thinking pattern in Linear Algebra is more complex. It defines an entirely new mathematical world where all symbols and theorems are brand new. The only way you can really try to understand it is probably by looking at it through the lens of geometry. Because Linear Algebra is deeply connected to geometry—for example, the theoretical foundation of spatial transformation is Linear Algebra—there are many "visualizing linear algebra" learning resources online to help you understand its significance and aid in memorizing formulas.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409153940473.png)

For books, I recommend **[*Linear Algebra Study Guide*](https://book.douban.com/subject/26390093/)** by Professor Li Shangzhi from the University of Science and Technology of China (USTC).

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155325251.png)

#### Probability Theory and Mathematical Statistics

For CS majors, the probability theory part of this course is likely more useful than mathematical statistics. Some universities might only offer Probability Theory, or they might teach Statistics but only scratch the surface. The learning curve for Probability Theory is similar to Calculus—it's essentially formulas paired with real-world examples, making it less abstract and closer to real life than Linear Algebra. In the current job market, students majoring in Probability and Statistics are probably the easiest to employ among math majors. They often do data analysis work. Therefore, **this course is indeed a vital prerequisite for data analysis, and its importance in Machine Learning goes without saying.**

For books, I recommend **[*A Course in Probability Theory and Mathematical Statistics*](https://book.douban.com/subject/34897672/)**. This book consists of eight chapters; the first four cover Probability Theory, mainly describing various probability distributions and their properties, while the last four cover Mathematical Statistics, focusing on parameter estimation and hypothesis testing.

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155738505.png)

#### Discrete Mathematics (Set Theory, Graph Theory, Modern Algebra, etc.)

Discrete Mathematics is the exclusive math of Computer Science. However, for those planning to find a job right after graduation, its massive potential might not be immediately apparent. Its primary application lies in fields like graph research and is highly theoretical. Students planning to pursue graduate studies should master it as solidly as possible.

### English

English is a relatively flexible skill in college. Some say, "The better your English, the better your personal development," which is true. But for some students with highly specific career goals, advanced English might not be on their mandatory skills list. The following advice is tailored specifically for CS majors.

English classes in college are typically only offered in the first two years. Keep in mind: **if you want to rely on college English classes to improve your English, you can drop that idea right now.** Improving your English relies entirely on your own daily accumulation, practice, and targeted exercises.

**You absolutely must pass the CET-4 and CET-6 (College English Test).** This is a mandatory skill; the vast majority of jobs look at your CET-4/6 levels, so at the very least, you need to pass. CET-4 is slightly harder than high school English, and average students might get stuck on CET-6. CET-6 requires targeted training because you simply don't get enough exposure to English in college—one English class a semester isn't enough to maintain your level. For students from remote areas with a weak foundation in high school English, passing CET-4/6 will be even harder. I suggest doing intensive training with past exam papers before the test and memorizing high-frequency vocabulary. You only need 425 points to pass, which is a fairly achievable goal. Better students should aim for 500+, and hitting 600+ is an excellent level that will be a highlight on your resume.

IELTS and TOEFL exams are mostly for those who want to study abroad or apply for jobs with specific English requirements. You can't easily pass IELTS/TOEFL without preparation; spending money on a reliable external prep course is usually a good choice.

For CS majors, English proficiency is quite important. Although you won't be rejected just because you don't have an IELTS/TOEFL score, you should at least be able to:

- **Proficiently use English UI software, systems, etc.**
- **Read technical blogs and bug solutions on foreign websites without difficulty.**
- **Read English academic literature proficiently.**
- **Possess basic English paper writing skills.**

After all, computer languages are based on English characters. Out of listening, speaking, reading, and writing, it's perfectly reasonable to expect you to master **reading and writing** at the very least.

### Compiler Principles

Compared to the professional courses introduced earlier, Compiler Principles might seem a bit less critical. The importance of Compiler Principles mainly lies in:

- The development of low-level languages, engines, or high-level languages (like MySQL, Java, etc.).
- Operating system or embedded system development.
- Concepts of lexical, syntax, and semantic analysis, as well as automata theory.

**An essential prerequisite for Compiler Principles is Formal Languages and Automata. The concept of automata is heavily applied in lexical analysis. After taking this course, you will likely discover the clever applications of automata algorithms in many scenarios.**

Overall, this course is relatively less critical for the career development of a typical programmer. But in terms of difficulty, learning this course effectively consolidates your programming mindset. For learning resources, besides class slides, you can use *Compiler Principles* as a reference book to help with parts you don't understand (often referred to as the "Dragon Book," which takes quite a bit of effort to digest).

![](https://oss.javaguide.cn/github/javaguide/books/20210406152148373.png)

Other recommended books:

- **[*Modern Compiler Implementation*](https://book.douban.com/subject/30191414/)**: An introductory book to compiler principles (the Tiger Book).
- **[*Engineering a Compiler*](https://book.douban.com/subject/20436488/)**: Covers all topics of compilers from the front-end to the back-end.

The books I recommended above are quite difficult, and it's genuinely hard to persist through reading them. Here, I strongly recommend the [HIT Compiler Principles Video Course](https://www.icourse163.org/course/HIT-1002123007). It is truly excellent, a national top-tier course, and most importantly, it is taught by a beautiful and gentle female professor!

![](https://oss.javaguide.cn/github/javaguide/books/20210406152847824.png)
---