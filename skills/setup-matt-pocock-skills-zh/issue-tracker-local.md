# 议题跟踪器：本地 Markdown

本仓库的议题和规格以 `.scratch/` 中的 markdown 文件形式存在。

## 约定

- 每个功能一个目录：`.scratch/<feature-slug>/`
- 规格文件是 `.scratch/<feature-slug>/spec.md`
- 实现类议题在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 中每个 ticket（票据）一个文件，从 `01` 开始编号，绝不用单个合并的 tickets 文件
- Triage 状态记录在每个议题文件顶部附近的 `Status:` 行中（角色字符串见 `triage-labels.md`）
- 评论和对话历史追加到文件底部 `## Comments` 标题之下

## 当技能说 "publish to the issue tracker" 时

在 `.scratch/<feature-slug>/` 下创建新文件（必要时先创建目录）。

## 当技能说 "fetch the relevant ticket" 时

读取所引用路径处的文件。用户通常会直接给出路径或议题编号。

## Wayfinding（寻路）操作

由 `wayfinder` 使用。**map（地图）**是一个文件，每个 ticket 对应一个 **child（子）**文件。

- **Map（地图）**：`.scratch/<effort>/map.md`（正文包含 Notes / Decisions-so-far / Fog 三个部分）。
- **Child ticket（子票据）**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，问题写在正文中。`Type:` 行记录票据类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed`/`resolved`。
- **Blocking（阻塞）**：顶部附近的一行 `Blocked by: NN, NN`。当它列出的每个文件都是 `resolved` 时，票据解除阻塞。
- **Frontier（前沿）**：扫描 `.scratch/<effort>/issues/` 中未关闭、未阻塞且未认领的文件；编号排第一者胜出。
- **Claim（认领）**：在任何工作之前，设置 `Status: claimed` 并保存。
- **Resolve（解决）**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，然后向 `map.md` 中 map 的 Decisions-so-far 追加一个 context pointer（上下文指针）（gist + 链接）。
