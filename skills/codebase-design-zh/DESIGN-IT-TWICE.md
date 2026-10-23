# 设计两次（Design It Twice）

当用户想为选定的加深候选探索备选 interface（接口）时，使用这个并行 sub-agent（子代理）模式。源于 "Design It Twice"（Ousterhout）：你的第一个想法不太可能是最好的。

使用 [SKILL.md](SKILL.md) 中的词汇：**module（模块）**、**interface（接口）**、**seam（接缝）**、**adapter（适配器）**、**leverage（杠杆）**。

## 流程（Process）

### 1. 框定问题空间（Frame the problem space）

在启动 sub-agents（子代理）之前，为选定的候选写一份面向用户的问题空间说明：

- 任何新 interface（接口）都需要满足的约束
- 它将依赖的依赖项，以及它们属于哪个类别（见 [DEEPENING.md](DEEPENING.md)）
- 一个粗略的示例代码草图，用来落实这些约束——不是提案，只是让约束变得具体的一种方式

把它展示给用户，然后立即进入第 2 步。在 sub-agents 并行工作期间，用户阅读并思考。

### 2. 启动 sub-agents（Spawn sub-agents）

并行启动 3 个以上 sub-agents（子代理）。每个都必须为加深后的模块产出一个**截然不同**的 interface（接口）。

给每个 sub-agent 一份单独的技术简报（文件路径、耦合细节、来自 [DEEPENING.md](DEEPENING.md) 的依赖类别、seam（接缝）背后是什么）作为提示词。该简报独立于第 1 步中面向用户的问题空间说明。给每个 agent 一个不同的设计约束：

- Agent 1："最小化 interface：最多 1–3 个入口点。最大化每个入口点的 leverage。"
- Agent 2："最大化灵活性：支持多种用例和扩展。"
- Agent 3："为最常见的调用者优化：让默认情形变得轻而易举。"
- Agent 4（如适用）："围绕 ports & adapters（端口与适配器）设计跨 seam 的依赖。"

在简报中同时包含 [SKILL.md](SKILL.md) 的词汇和 CONTEXT.md 的词汇，这样每个 sub-agent 的命名就能与架构语言和项目的领域语言保持一致。

每个 sub-agent 输出：

1. Interface（类型、方法、参数，以及不变量（invariants）、顺序、错误模式）
2. 展示调用者如何使用的用法示例
3. implementation（实现）在 seam（接缝）背后隐藏了什么
4. 依赖策略与 adapters（见 [DEEPENING.md](DEEPENING.md)）
5. 权衡：leverage 哪里高、哪里稀薄

### 3. 展示与对比（Present and compare）

按顺序展示各设计，让用户逐一消化，然后用文字进行对比。按 **depth（深度）**（interface 处的 leverage）、**locality（局部性）**（变更集中在哪里）和 **seam placement（接缝位置）** 进行对照。

对比之后，给出你自己的推荐：你认为哪个设计最强、为什么。如果不同设计的元素能很好地结合，就提出一个混合方案。要有明确立场：用户想要一个明确的判断，而不是一份菜单。
