# Out-of-Scope（范围之外）知识库

仓库中的 `.out-of-scope/` 目录存储被拒绝的功能请求的持久记录。它有两个用途：

1. **组织记忆**：功能为什么被拒绝，这样在议题关闭后推理依据不会丢失
2. **去重**：当新议题进来且与先前的拒绝相匹配时，技能可以呈现先前的决策，而不是重新争辩一遍

## 目录结构

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

每个**概念**一个文件，而不是每个议题一个文件。请求同一内容的多个议题归入同一个文件。

## 文件格式

文件应当以轻松、可读的风格撰写，更像一份简短的设计文档，而不是一条数据库记录。使用段落、代码示例和例子，让推理过程对第一次看到它的人来说清晰有用。

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42: "Add dark mode support"
- #87: "Night theme for accessibility"
- #134: "Dark theme option"
```

### 文件命名

为概念使用简短、描述性的 kebab-case 名称：`dark-mode.md`、`plugin-system.md`、`graphql-api.md`。名称应当足够可辨识，让浏览目录的人不用打开文件就能理解什么被拒绝了。

### 撰写理由

理由应当充实：不是「我们不想要这个」，而是为什么。好的理由会引用：

- 项目范围或理念（「本项目专注于 X；主题化是下游关注的问题」）
- 技术约束（「支持这个需要 Y，这与我们的 Z 架构冲突」）
- 战略决策（「我们选择用 A 而不是 B，因为……」）

理由应当持久。避免引用临时情况（「我们现在太忙了」）；那些不是真正的拒绝，而是推迟。

## 何时检查 `.out-of-scope/`

在 triage 期间（第 1 步：收集上下文），阅读 `.out-of-scope/` 中的所有文件。在评估新议题时：

- 检查请求是否匹配现有的范围之外概念
- 匹配按概念相似度进行，而不是关键词：「night theme」匹配 `dark-mode.md`
- 如果有匹配，把它呈现给维护者：「这与 `.out-of-scope/dark-mode.md` 相似。我们之前因为 [原因] 拒绝过它。你还持同样的看法吗？」

维护者可能：

- **确认**：新议题被添加到现有文件的「Prior requests」列表，然后关闭
- **重新考虑**：该范围之外文件被删除或更新，议题继续走正常的 triage 流程
- **不同意**：这些议题相关但不同，继续正常的 triage 流程

## 何时写入 `.out-of-scope/`

仅当一个**功能增强**（而非缺陷）被*拒绝*为 `wontfix` 时。这同样适用于功能增强类 PR：被拒绝的 PR 也记录在这里，这样同样的请求就不会以新代码的形式再次出现。

当某样东西因为**已实现**而以 `wontfix` 关闭时，**不要**写到这里。那是已构建的功能，不是被拒绝的功能；记录它会给去重检查带来错误的拒绝。相反，关闭评论应指向该功能已存在的位置。

流程：

1. 维护者认定某个功能请求超出范围
2. 检查是否已有匹配的 `.out-of-scope/` 文件
3. 如果有：把新议题追加到「Prior requests」列表
4. 如果没有：创建一个新文件，包含概念名、决策、理由和第一个先前请求
5. 在议题上发布一条评论，解释决策并提及 `.out-of-scope/` 文件
6. 用 `wontfix` 标签关闭该议题

## 更新或删除范围之外的文件

如果维护者对之前被拒绝的概念改变了主意：

- 删除该 `.out-of-scope/` 文件
- 技能不需要重新打开旧议题；它们是历史记录
- 触发重新考虑的那个新议题继续走正常的 triage 流程
