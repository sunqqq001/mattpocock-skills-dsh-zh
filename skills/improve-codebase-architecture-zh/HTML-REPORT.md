# HTML 报告格式

架构审查渲染为操作系统临时目录中的一个自包含 HTML 文件。Tailwind 和 Mermaid 都来自 CDN。Mermaid 可靠地处理图状结构图表；手工构建的 div 和内联 SVG 处理更具编辑感的视觉元素（体量图、剖面图）。两者混用：不要所有图都依赖 Mermaid，否则会开始显得千篇一律。

## 脚手架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页头

仓库名、日期，以及一个紧凑的图例：实线框 = module（模块），虚线 = seam（接缝），红色箭头 = 泄漏，深色粗框 = deep module（深模块）。不要写引言段落。直奔候选。

## 候选卡片

图表承担主要分量。文字稀疏、平实，并使用（来自 `codebase-design` 技能的）词汇表术语，不做铺垫。

每个候选是一个 `<article>`：

- **Title（标题）**：简短，点明 deepening（加深）之处（例如 "Collapse the Order intake pipeline"）。
- **Badge row（徽章行）**：推荐强度（`Strong` = 祖母绿、`Worth exploring` = 琥珀色、`Speculative` = 石板灰），外加依赖类别的标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **Files（涉及文件）**：等宽字体列表，`font-mono text-sm`。
- **Before / After 示意图**：核心部分。两列并排。见下方模式。
- **Problem（问题）**：一句话。哪里让人难受。
- **Solution（方案）**：一句话。改变了什么。
- **Wins（收益）**：要点列表，每条不超过 6 个词。例如 "Tests hit one interface"、"Pricing logic stops leaking"、"Delete 4 shallow wrappers"。
- **ADR 提示框**（如适用）：琥珀色背景框里的一行字。

不要用整段文字解释。如果一张图需要一段文字才能看懂，就重画这张图。

## 图表模式

选择适合该候选的模式。混合使用。不要让每张图看起来都一样。多样化本身就是目的之一。

### Mermaid 图（依赖/调用流程的主力）

当要点是 "X 调用 Y 调用 Z，看看这一团乱" 时，用 Mermaid 的 `flowchart` 或 `graph`。把它包进一张 Tailwind 风格的卡片里，避免显得像硬塞进来的。用 classDef 上色：泄漏边涂红，deep module 涂深色。时序图适合 "before：6 个往返；after：1 个" 的场景。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手工构建的方框与箭头（当 Mermaid 的布局跟你较劲时）

模块用带边框和标签的 `<div>` 表示。箭头用内联 SVG 的 `<line>` 或 `<path>` 元素，绝对定位在相对定位的容器之上。当你希望 "after" 图呈现为一个粗边框、内部灰显的 deep module 时就用这种方式，因为 Mermaid 渲染不出那种分量感。

### 剖面图（适合分层浅层问题）

堆叠水平条带（`h-12 border-l-4`）来展示一次调用穿过的各层。Before：6 个薄层，各自什么都不做。After：1 个厚条带，标注整合后的职责。

### 体量图（适合 "interface 与实现一样宽" 的场景）

每个模块两个矩形：一个表示 interface（接口）表面积，一个表示实现。Before：interface 矩形几乎与实现矩形一样高（shallow，浅层）。After：interface 矩形矮，实现矩形高（deep，深）。

### 调用图折叠

Before：嵌套方框渲染的函数调用树。After：同一棵树折叠进一个方框，现在变成内部的调用在其中淡显。

## 样式指南

- 偏编辑感，不要企业仪表盘风。留白要充足。标题可用衬线体（`font-serif` 与 stone/slate 色系很搭）。
- 用色克制：一个强调色（祖母绿或靛蓝），红色表示泄漏，琥珀色表示警告。
- 图表高度保持在约 320px，这样 before/after 能舒适地并排，无需滚动。
- 图表内的模块标签用 `text-xs uppercase tracking-wider`，让它们读起来像示意图，而不是界面。
- 脚本只允许 Tailwind CDN 和 Mermaid ESM 导入。除此之外报告是静态的：没有应用代码，除 Mermaid 自身的渲染外没有任何交互。

## Top recommendation（首要推荐）部分

一张更大的卡片。候选名称、一句说明理由的话、指向其卡片的锚点链接。就这些。

## 语气

平实英语、简洁，但架构名词和动词直接来自 `codebase-design` 技能。简洁不是跑偏的借口。

**精确使用：** module（模块）、interface（接口）、implementation（实现）、depth（深度）、deep（深）、shallow（浅）、seam（接缝）、adapter（适配器）、leverage（杠杆）、locality（局部性）。

**绝不替换：** component、service、unit（代替 module）· API、signature（代替 interface）· boundary（代替 seam）· layer、wrapper（当你指的是 module 时）。

**符合该风格的表述：**

- "Order intake module is shallow: interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins 要点**用词汇表术语说出收益：*"locality: bugs concentrate in one module"*、*"leverage: one interface, N call sites"*、*"interface shrinks; implementation absorbs the wrappers"*。不要写 *"easier to maintain"* 或 *"cleaner code"*，因为这些说法不在词汇表里，也不配占位置。

不兜圈子，不清嗓子，不写 "it's worth noting that…"。如果一句话可以变成要点，就写成要点。如果一个要点可以删掉，就删掉。如果一个术语不在 `codebase-design` 词汇表里，先找词汇表里已有的，再考虑发明新词。
