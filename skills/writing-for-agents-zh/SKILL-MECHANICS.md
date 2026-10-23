# 技能机制（Skill mechanics）

[`writing-for-agents`](SKILL.md) 的技能专属分支：当文档是一项技能时，有什么不同（frontmatter、invocation（调用方式）选择，以及 router skills（路由技能））。关于撰写它的其他一切，都是 `SKILL.md` 中的通用参考。

## 调用方式（Invocation）

两种选择，在两种负载之间权衡：

- **model-invoked（模型可调用）** 技能保留 `description`，因此 agent（代理）可以自主触发它，其他技能也能触达它。你仍然可以手动输入它的名字：模型调用总是_包含_用户触达；description 只会增加代理的可发现性，从不剥夺人的触达。description 是该技能顶层的 context pointer（上下文指针），被强制在所有时刻保持加载：用永久的 context load（上下文负载）换取可发现性。内容全是 reference 的 model-invoked 技能还是共享 reference 的一个归宿：另一项技能可以调用它，因此多项技能都需要的 reference 只存在于一处。机制：省略 `disable-model-invocation`，并写一条面向模型的 description，携带触发 branches（分支）（`SKILL.md` 中的指针撰写规则完全适用）。
- **user-invoked（用户可调用）** 技能把 description 从代理的可触达范围中剥离：只有手动输入它名字的人才能调用它，其他技能都不能。context load 为零，但它消耗 cognitive load（认知负载）：你就是那个必须记得它存在的索引。机制：设置 `disable-model-invocation: true`；`description` 变成面向人的：一行摘要，去掉触发列表。

只有当代理必须自主触达该技能，或另一项技能必须触达它时，才选择 model-invocation。如果它只会手动触发，就把它设为 user-invoked，不付出任何 context load。

两项 user-invoked 技能都需要的共享 reference 不能放在任何一方：没有 description，哪一方都无法触发另一方。把它推到一个技能系统之外的普通文件里：任何技能都可以指向的外部 reference。

## 按调用方式拆分（Splitting by invocation）

拆分的调用方式切口（sequence 切口在 `SKILL.md` 中）：当你有一个独特的 leading word（领航词）应当自行触发它（一个你在 prompts 中实际使用的触发词），或另一项技能必须触达它时，就拆分出一个 model-invoked 技能。你要为新的常驻 description 付出 context load，因此这种独立触达必须物有所值。

## 路由技能（Router skills）

当 user-invoked 技能多到超出你的记忆范围时，堆积起来的 cognitive load 可以由一项 **router skill（路由技能）** 治愈：一项 user-invoked 技能，点名其余技能以及何时触达每一项，这样人只需要记住一项技能，而不是许多项。它只能提示，永远不能触发它们：user-invoked 技能没有 description，所以除了人之外没有任何东西能触达它们。
