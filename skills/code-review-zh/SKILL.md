---
name: code-review-zh
description: "沿两个轴审查自某个 fixed point（固定点：commit、分支、tag 或 merge-base）以来的变更：Standards（标准）——代码是否遵循本仓库文档化的 coding standards（编码规范）？Spec（规格）——代码是否符合原始 issue/spec 所要求的内容？两个审查在并行 sub-agents（子代理）中运行，并排报告结果。当用户想审查一个分支、一个 PR（pull request，拉取请求）、进行中的变更，或说 \"review since X\" 时使用。"
---

对 `HEAD` 与用户提供的 fixed point 之间的 diff（差异）进行双轴审查：

- **Standards（标准）**：代码是否符合本仓库文档化的 coding standards（编码规范）？
- **Spec（规格）**：代码是否忠实实现了原始 issue/spec 所要求的内容？

两个轴都以**并行的 sub-agents（子代理）**运行，以免互相污染上下文，然后本技能汇总它们的发现。

issue tracker（议题追踪器）应该已经提供给你。如果缺少 `docs/agents/issue-tracker.md`，告诉用户运行 `setup-matt-pocock-skills`。

## 流程

### 1. 钉住 fixed point

用户所说的就是 fixed point（commit SHA、分支名、tag、`main`、`HEAD~5` 等）。如果没有指定，就问他们要。

一次性记下 diff 命令：`git diff <fixed-point>...HEAD`（三个点，因此比较是针对 merge-base 进行的）。另外通过 `git log <fixed-point>..HEAD --oneline` 记下提交列表。

继续之前，确认 fixed point 可以解析（`git rev-parse <fixed-point>`）且 diff 非空。错误的 ref 或空的 diff 应在这里就失败，而不是在两个并行的 sub-agents 内部。

### 2. 确定 spec 来源

按以下顺序寻找原始 spec：

1. 提交信息中的 issue 引用（`#123`、`Closes #45`、GitLab `!67` 等），通过 `docs/agents/issue-tracker.md` 中的工作流获取。
2. 用户作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支名或功能匹配的 spec 文件。
4. 如果什么都没找到，问用户 spec 在哪里。如果他们说没有，**Spec** sub-agent 将跳过并报告 "no spec available"。

### 3. 确定 standards 来源

仓库中任何记录代码编写方式的文件，例如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

在仓库自身文档之上，Standards 轴始终携带下面的 **smell baseline（坏味道基线）**：一组固定的 Fowler 坏味道（_Refactoring_ 第 3 章），即使仓库没有任何文档也适用。有两条规则约束它：

- **仓库优先（The repo overrides）。** 文档化的仓库标准永远胜出；当它认可基线会标记的东西时，抑制该 smell。
- **始终是判断问题。** 每个 smell 都是一个带标签的启发式（如 "possible Feature Envy"），绝不是硬性违规。和这里的任何标准一样，跳过工具已经强制检查的内容。

每个 smell 都按 *它是什么* → *如何修复* 来读；将其与 diff 匹配：

- **Mysterious Name（神秘命名）**：一个函数、变量或类型的名字无法揭示它的作用或内容。→ 重命名它；如果想不出诚实的名字，说明设计本身是模糊的。
- **Duplicated Code（重复代码）**：相同的逻辑形态出现在变更中的多个 hunk（补丁块）或文件中。→ 提取共享形态，从两处调用它。
- **Feature Envy（依恋情结）**：一个方法访问另一个对象的数据多于访问自己的数据。→ 把方法移到它所羡慕的数据上。
- **Data Clumps（数据泥团）**：同样的几个字段或参数总是结伴而行（一个等待诞生的类型）。→ 把它们打包成一个类型，传递那个类型。
- **Primitive Obsession（基本类型偏执）**：一个基本类型或字符串顶替了本应拥有自己类型的领域概念。→ 给这个概念一个自己的小类型。
- **Repeated Switches（重复的 switch）**：对同一类型的相同 `switch`/`if` 级联在整个变更中反复出现。→ 用多态替换，或用一张两处共享的映射表。
- **Shotgun Surgery（霰弹式修改）**：一个逻辑变更迫使 diff 中的许多文件发生零散的修改。→ 把一起变化的东西集中到一个模块。
- **Divergent Change（发散式变化）**：一个文件或模块因多个不相关的原因被修改。→ 拆分，使每个模块只为一个原因而变化。
- **Speculative Generality（臆测式泛化）**：为 spec 并不存在的需求添加的抽象、参数或钩子。→ 删除它；内联回去，直到出现真正的需求。
- **Message Chains（消息链）**：调用者本不应依赖的长 `a.b().c().d()` 导航。→ 把这段遍历隐藏在第一个对象的一个方法后面。
- **Middle Man（中间人）**：一个大部分工作只是向下转发的类或函数。→ 砍掉它，直接调用真正的目标。
- **Refused Bequest（被拒绝的遗赠）**：一个忽略或重写了大部分继承内容的子类或实现者。→ 放弃继承，改用组合。

### 4. 并行启动两个 sub-agents

**Standards sub-agent 提示词**应包含：

- 完整的 diff 命令和提交列表。
- 第 3 步找到的 standards-source 文件列表，**加上第 3 步的 smell baseline** 完整粘贴（sub-agent 没有其他途径获取它）。
- 任务简报："报告，在相关处按文件/hunk：(a) diff 违反文档化标准的每一处：引用该标准（文件 + 规则）；(b) 你发现的任何基线 smell：说出名称并引用该 hunk。区分硬性违规与判断问题：违反文档化标准可能是硬性的，但基线 smells 始终是判断问题，且文档化的仓库标准优先于基线。跳过工具已强制检查的内容。400 词以内。"

**Spec sub-agent 提示词**应包含：

- diff 命令和提交列表。
- spec 的路径或获取到的内容。
- 任务简报："报告：(a) spec 要求但缺失或不完整的需求；(b) diff 中未被要求的行为（scope creep，范围蔓延）；(c) 看起来已实现但实现方式有误的需求。每个发现都引用 spec 原文行。400 词以内。"

如果 spec 缺失，跳过 Spec sub-agent，并在最终报告中注明。

### 5. 汇总

在 `## Standards` 和 `## Spec` 两个标题下呈现这两份报告，逐字或轻度整理。**不要**合并或重新排序发现，因为两个轴是刻意分开的（见 _为什么是两个轴_）。

最后用一行总结：每个轴的发现总数，以及_每个轴内部_最严重的问题（如有）。不要在轴之间挑出一个赢家：那正是分离两个轴所要防止的重新排序。

## 为什么是两个轴

一个变更可能通过一个轴而败在另一个轴上：

- 遵循所有标准却实现了错误内容的代码 → **Standards 通过，Spec 失败。**
- 完全按 issue 要求实现却破坏了项目约定的代码 → **Spec 通过，Standards 失败。**

分开报告可以防止一个轴掩盖另一个轴。
