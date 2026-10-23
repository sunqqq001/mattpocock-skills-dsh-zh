---
name: domain-modeling-zh
description: 构建并打磨项目的 domain model（领域模型）。当讨论 codebase（代码库）术语、编写或编辑 CONTEXT.md，或记录、编辑 ADR（架构决策记录，Architecture Decision Record）时使用。
---

# 领域建模（Domain Modeling）

在设计过程中主动构建并打磨项目的 domain model。这是一种*主动*的纪律：质疑术语、虚构 edge case（边界情况）场景，并在词汇表和决策成形的瞬间就把它们写下来。（仅仅*阅读* `CONTEXT.md` 获取词汇不属于本技能——那是任何技能都能做到的一行习惯。本技能适用于你在*改变*模型，而不只是消费它的时候。）

## 文件结构

大多数仓库只有一个 context（上下文）：

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

如果根目录存在 `CONTEXT-MAP.md`，说明仓库有多个上下文。这张映射表指向每个上下文所在的位置：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

按需惰性创建文件：只有确实有东西要写时才创建。如果不存在 `CONTEXT.md`，在第一个术语被确定时创建它。如果不存在 `docs/adr/`，在需要第一份 ADR 时创建它。

## 会话期间

### 对照 glossary（词汇表）提出质疑

当用户使用的术语与 `CONTEXT.md` 中已有的语言相冲突时，立即指出来。"你的词汇表把 'cancellation' 定义为 X，但你似乎指的是 Y。到底是哪个？"

### 打磨模糊的语言

当用户使用含糊或一词多义的术语时，提出一个精确的规范术语。"你说 'account'：是指 Customer 还是 User？那是两个不同的东西。"

### 讨论具体的场景

当讨论领域关系时，用具体的场景对它们做压力测试。虚构能探查边界情况的场景，迫使用户对概念之间的边界保持精确。

### 与代码交叉对照

当用户陈述某样东西如何运作时，检查代码是否一致。如果发现矛盾，把它摆出来："你的代码取消整个 Orders，但你刚才说部分取消是可能的。哪个是对的？"

### 就地更新 CONTEXT.md

当一个术语被确定时，就地更新 `CONTEXT.md`。不要攒成批量：随时成形随时记录。使用 [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) 中的格式。

`CONTEXT.md` 应该完全不含实现细节。不要把 `CONTEXT.md` 当作规格、草稿本或实现决策的仓库。它是词汇表，仅此而已。

### 审慎提议 ADR

只有当以下三项全部成立时，才提议创建 ADR：

1. **难以逆转**：日后改变主意的成本是实质性的
2. **脱离上下文令人费解**：未来的读者会疑惑"他们为什么这样做？"
3. **真实权衡的结果**：确实存在备选方案，而你出于具体原因选择了其中一个

如果三项缺一，跳过 ADR。使用 [ADR-FORMAT.md](./ADR-FORMAT.md) 中的格式。
