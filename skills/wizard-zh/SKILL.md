---
name: wizard-zh
description: 生成一个交互式 bash 向导（wizard），逐步引导人类完成只有他们自己才能执行的步骤。适用于配置基础设施、设置凭据或 CI secrets、操作陌生的第三方仪表盘（dashboard），或执行一次性迁移或切换（cutover）。不要为代理自己能完成的步骤调用本技能。
---

# 向导（Wizard）

**wizard（向导）** 是一个 bash 脚本，一步步引导人类完成一套手动流程——亲手执行它很繁琐，每次都要向 AI 重新解释一遍同样繁琐。它会打开每个 URL，明确说明要点击什么、复制什么，捕获这些值，把它们写到该去的地方（`.env`、GitHub secrets），在每个 stage（阶段）处确认，并显示还剩多少个 stage。它可能用于配置第三方服务、运行一次性迁移，或把项目从一种状态迁移到另一种状态。

令人愉悦的使用体验已经由 [template.sh](template.sh) 解决：逐 stage 的进度显示、确认关卡、跨平台打开 URL（包括 WSL）、隐藏的 secret 输入、幂等的 `.env` upsert（插入或更新）、`gh secret`/`gh variable` 写入，以及收尾总结。**你的工作只是界定流程范围并编写它的 stages。** `STAGES` 标记之上的库部分在每个 wizard 中都完全相同；这种一致性正是要点所在：绝不要手工编辑它。

wizard 默认是即用即弃的：为一次运行而构建，保存到 scratch 或 `scripts/` 路径，任务完成后删除。只有当用户想要一条应常驻仓库的可重复 setup 路径时，才提交它。

## 过程（Process）

### 1. 界定流程范围

梳理出人类必须执行的每一个手动步骤，以及沿途会被捕获的每一个值。先读仓库，不要上来就问：

- 对于 setup：`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置，以及 `.github/workflows/*`（每一个 `secrets.*` / `vars.*` 引用都是 wizard 必须产出的一个值）。
- 对于迁移或过渡：当前状态、目标状态，以及两者之间不可逆的动作。

然后把按顺序排列的 stages 列表以及每个 stage 产出的值展示给用户并确认：他们可以增删或重排。

**完成标准：** 每个 stage 都按顺序命名；对每个捕获的值，你要知道 (a) 人类从哪里得到它，(b) 它写到哪里（`.env`、某个 GitHub secret、两者，或哪里都不写；有些 stage 是纯动作），以及 (c) 它是否属于 secret（隐藏输入）还是公开值。

### 2. 绘制每个 stage 的旅程

对每个 stage，写下人类遵循的精确路径：打开哪个 URL、在那里做什么、值在哪里显示、它填充哪个变量——例如 "Dashboard → Developers → API keys → Reveal test key → copy"。在你并不真正知道当前界面或确切命令的地方，如实说明并询问用户或查阅文档：绝不要编造可能并不存在的步骤。

**完成标准：** 每个 stage 都能落实到陌生人也能照做的具体指令。

### 3. 编写向导

把 `template.sh` 复制到目标路径。用每个步骤一个 `stage` 的方式替换示例 stage，按依赖顺序排列。使用库中的辅助函数：`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`。把 `TOTAL_STAGES` 设为你编写的 stage 数量。

守住模板设定的标准：在索要某个值之前先打开它的 URL；任何 secret 都用 `ask_secret`；每个要持久化的值都 `write_env`；`set_secret` 只用于 CI 真正需要的值；任何不可逆动作之前都 `confirm`。每个 `stage` 都会清屏，只显示当前步骤：让一个 stage 只专注一项任务，这样人类需要的内容不会被滚出视野。不要动标记之上的库部分。

### 4. 验证并交接

- `bash -n <script>`；如果可用，运行 `shellcheck`。
- `chmod +x <script>`。
- 不要自己端到端地运行它：它会打开浏览器并阻塞在人类输入上。改为静态追踪：第 1 步中的每个值都被捕获并落到第 1 步所说的地方，且每个 `set_secret` 名称都精确匹配 CI 中的一个 `secrets.*` 引用。
- 告诉用户如何运行它。如果它是一条可重复的 setup 路径，就提交它并从 README 链接出去，这样下一个人会直接运行脚本，而不是去问 AI。
