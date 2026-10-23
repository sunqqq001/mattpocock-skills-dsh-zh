# 议题跟踪器：GitLab

本仓库的议题和规格以 GitLab Issues 的形式存在。所有操作使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。

## 约定

- **创建议题**：`glab issue create --title "..." --description "..."`。多行描述使用 heredoc。传入 `--description -` 可打开编辑器。
- **读取议题**：`glab issue view <number> --comments`。使用 `-F json` 获取机器可读输出。
- **列出议题**：`glab issue list -F json`，并配合适当的 `--label` 过滤条件。
- **评论议题**：`glab issue note <number> --message "..."`。GitLab 把评论称为 "notes"。
- **应用 / 移除标签**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个标签可以用逗号分隔，或重复该标志。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭评论，所以先用 `glab issue note <number> --message "..."` 发布说明，再关闭。
- **Merge requests（合并请求）**：GitLab 把 PR 称为 "merge requests"。使用 `glab mr create`、`glab mr view`、`glab mr note` 等，形状与 `gh pr ...` 相同，只是把 `pr` 换成 `mr`，把 `comment`/`--body` 换成 `note`/`--message`。

从 `git remote -v` 推断仓库；在 clone 出来的目录内运行时，`glab` 会自动完成这一点。

## 将合并请求作为 triage 入口

**MRs as a request surface: no.** _（如果本仓库将外部合并请求视为功能请求，则设为 `yes`；`triage` 会读取此标志。）_

设为 `yes` 时，MR 走与议题相同的标签和状态流程，使用对应的 `glab mr` 命令：

- **读取 MR**：`glab mr view <number> --comments`，以及用 `glab mr diff <number>` 查看 diff（差异）。
- **列出待 triage 的外部 MR**：`glab mr list -F json`，然后只保留作者不是项目成员/所有者的 MR（即贡献者的 MR，而不是维护者进行中的工作）。
- **评论 / 加标签 / 关闭**：`glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 对议题和 MR 分别编号，所以一旦你知道维护者指的是哪个入口，`#42` 就是无歧义的。

## 当技能说 "publish to the issue tracker" 时

创建一个 GitLab issue。

## 当技能说 "fetch the relevant ticket" 时

运行 `glab issue view <number> --comments`。

## Wayfinding（寻路）操作

由 `wayfinder` 使用。**map（地图）**是一个单一议题，其**child（子）**议题作为 tickets（票据）。

- **Map（地图）**：一个带 `wayfinder:map` 标签的单一议题，正文包含 Notes / Decisions-so-far / Fog 三个部分。创建命令：`glab issue create --label wayfinder:map`。（在带原生 epic 的 GitLab 层级上，也可以由 epic 承载 map；带标签的议题在所有地方都可行。）
- **Child ticket（子票据）**：描述顶部带 `Part of #<map>`、带 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）标签的一个议题。一旦被认领，票据就分配给负责推进的开发人员。
- **Blocking（阻塞）**：GitLab 的**原生 blocking link（阻塞链接）**，是规范且界面可见的表示。用 `/blocked_by #<n>` 快捷动作添加，以 note 形式发布（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 功能；在免费层级（或不可用之处）回退到在描述顶部写一行 `Blocked by: #<n>, #<n>`。当所有阻塞者都已关闭时，票据解除阻塞。
- **Frontier（前沿）查询**：`glab issue list -F json`，范围限定为 map 的 children，丢弃任何带有未关闭阻塞者的：指向未关闭议题的原生 `blocked_by` 链接（`glab api projects/:id/issues/:iid/links`）、`Blocked by` 行中的未关闭议题，或有指派人的；按 map 中的顺序排第一者胜出。
- **Claim（认领）**：`glab issue update <n> --assignee @me`，这是会话的第一次写入。
- **Resolve（解决）**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再向 map 的 Decisions-so-far 追加一个 context pointer（上下文指针）（gist + 链接）。
