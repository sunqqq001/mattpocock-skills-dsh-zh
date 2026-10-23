# 议题跟踪器：GitHub

本仓库的议题和规格以 GitHub Issues 的形式存在。所有操作使用 `gh` CLI。

## 约定

- **创建议题**：`gh issue create --title "..." --body "..."`。多行 body 使用 heredoc。
- **读取议题**：`gh issue view <number> --comments`，用 `jq` 过滤评论，同时获取标签。
- **列出议题**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，并配合适当的 `--label` 和 `--state` 过滤条件。
- **评论议题**：`gh issue comment <number> --body "..."`
- **应用 / 移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：`gh issue close <number> --comment "..."`

从 `git remote -v` 推断仓库；在 clone 出来的目录内运行时，`gh` 会自动完成这一点。

## 将拉取请求作为 triage 入口

**PRs as a request surface: no.** _（如果本仓库将外部 PR（拉取请求，pull request）视为功能请求，则设为 `yes`；`triage` 会读取此标志。）_

设为 `yes` 时，PR 走与议题相同的标签和状态流程，使用对应的 `gh pr` 命令：

- **读取 PR**：`gh pr view <number> --comments`，以及用 `gh pr diff <number>` 查看 diff（差异）。
- **列出待 triage 的外部 PR**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，然后只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的（丢弃 `OWNER`/`MEMBER`/`COLLABORATOR`）。
- **评论 / 加标签 / 关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的议题和 PR 共享同一个编号空间，所以一个孤立的 `#42` 可能是二者之一：先用 `gh pr view 42` 解析，再回退到 `gh issue view 42`。

## 当技能说 "publish to the issue tracker" 时

创建一个 GitHub issue。

## 当技能说 "fetch the relevant ticket" 时

运行 `gh issue view <number> --comments`。

## Wayfinding（寻路）操作

由 `wayfinder` 使用。**map（地图）**是一个单一议题，其**child（子）**议题作为 tickets（票据）。

- **Map（地图）**：一个带 `wayfinder:map` 标签的单一议题，正文包含 Notes / Decisions-so-far / Fog 三个部分。创建命令：`gh issue create --label wayfinder:map`。
- **Child ticket（子票据）**：作为 GitHub sub-issue（子议题）链接到 map 的一个议题（在 sub-issues 端点调用 `gh api`）。在未启用 sub-issues 的地方，把 child 加入 map 正文的任务列表，并在 child 正文顶部写上 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被认领，票据就分配给负责推进的开发人员。
- **Blocking（阻塞）**：GitHub 的**原生 issue dependencies（议题依赖）**，是规范且界面可见的表示。用 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加一条边，其中 `<blocker-db-id>` 是阻塞者的数字 **database id（数据库 id）**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，_不是_ `#number` 或 `node_id`）。GitHub 通过 `issue_dependencies_summary.blocked_by` 报告（只含未关闭的阻塞者，即实时闸门）。在依赖功能不可用的地方，回退到在 child 正文顶部写一行 `Blocked by: #<n>, #<n>`。当所有阻塞者都已关闭时，票据解除阻塞。
- **Frontier（前沿）查询**：列出 map 的未关闭 children（`gh issue list --state open`，范围限定为 map 的 sub-issues / 任务列表），丢弃任何有未关闭阻塞者（`issue_dependencies_summary.blocked_by > 0`，或 `Blocked by` 行中有未关闭的议题）或有指派人的；按 map 中的顺序排第一者胜出。
- **Claim（认领）**：`gh issue edit <n> --add-assignee @me`，这是会话的第一次写入。
- **Resolve（解决）**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再向 map 的 Decisions-so-far 追加一个 context pointer（上下文指针）（gist + 链接）。
