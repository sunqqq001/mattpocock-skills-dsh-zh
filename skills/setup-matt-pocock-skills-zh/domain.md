# 领域文档

工程类技能在探索代码库时，应如何消费本仓库的领域文档。

## 探索前，先读这些

- 仓库根目录下的 **`CONTEXT.md`**，或
- 仓库根目录下的 **`CONTEXT-MAP.md`**（若存在）：它指向每个上下文一个 `CONTEXT.md`。阅读与主题相关的每一个。
- **`docs/adr/`**：阅读涉及你即将工作区域的 ADR（架构决策记录，Architecture Decision Record）。在多上下文仓库中，还要检查 `src/<context>/docs/adr/` 中限定上下文范围的决策。

如果这些文件都不存在，**静默继续**。不要标记它们的缺失；不要建议提前创建它们。`domain-modeling` 技能（经由 `grill-with-docs` 和 `improve-codebase-architecture` 触达）会在术语或决策真正被确定时按需创建它们。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 使用词汇表中的词汇

当你的输出命名一个领域概念时（在议题标题、重构提案、假设、测试名称中），使用 `CONTEXT.md` 中定义的术语。不要漂移到词汇表明确避免的同义词。

如果你需要的概念还不在词汇表中，这是一个信号：要么你在发明项目不使用的语言（重新考虑），要么确实存在缺口（为 `domain-modeling` 记下它）。

## 标记 ADR 冲突

如果你的输出与现有 ADR 相矛盾，明确地提出来，而不是静默覆盖：

> _与 ADR-0007（event-sourced orders）矛盾，但值得重新讨论，因为……_
