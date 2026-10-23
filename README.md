# mattpocock-skills-dsh-zh

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.1.0--rc.8%2B-4d6bfe)]()
[![-中文技能](https://img.shields.io/badge/-中文技能-4d6bfe)]() [![-七课工作流](https://img.shields.io/badge/-七课工作流-4d6bfe)]() [![-grilling](https://img.shields.io/badge/-grilling-4d6bfe)]() [![-to-spec](https://img.shields.io/badge/-to--spec-4d6bfe)]() [![-to-tickets](https://img.shields.io/badge/-to--tickets-4d6bfe)]()

为 **DeepSeek Harness (DSH)** 打造的 **Matt Pocock 技能中文版**：把
[mattpocock/skills](https://github.com/mattpocock/skills)（来自
[aihero.dev/skills](https://www.aihero.dev/skills) 的"真实工程师"技能集）
经英文 DSH 移植版（`mattpocock-skills-dsh` v0.1.7）完整汉化后，适配到 DSH
的 Cordis 插件架构上。

> **非官方移植**：技能内容改编自 [mattpocock/skills](https://github.com/mattpocock/skills)（MIT,
> © Matt Pocock）。上游以 Claude Code 插件格式发布；本包做的是 DSH 适配与中文翻译，
> 由社区独立维护，与 Matt Pocock 及上游仓库无隶属关系。

## 完整汉化说明

- **正文全译**：25 个 `SKILL.md` 正文全部译为中文，关键术语保留英文并在首次
  出现处附中文注释。
- **辅助文档齐全**：技能引用的辅助文档（`DEEPENING.md`、`AGENT-BRIEF.md`、
  `template.sh` 等 24 个文件）随包分发，正文里的每一个相对引用都能在技能
  目录里找到对应文件（`.sh` 模板脚本保持英文原样）。
- **同步基线**：正文对照英文 DSH 版 v0.1.7（含 2026-08-26 的上游全量同步）
  逐段翻译。
- **校验更严**：`npm run verify` 除发现/解析/调用映射检查外，还断言
  **正文引用的每个相对文件真实存在**。

## 快速上手：七课工作流

> 出自 Matt Pocock 的 skills 邮件——整包技能的正确打开方式，就是按下面
> 这条工作流从头跑到尾。`Sandcastle` 为外部工具，不在本包内。

| Step | 原文 | 对照中文 |
| --- | --- | --- |
| 0 | This email. Pick your path. | 这封邮件就是起点：选一条路。 |
| 1 | `/grill-with-docs`，so the agent is not building from fog | 先把想法拷问清楚，agent 才不会在迷雾中开工 |
| 2 | `/prototype` and `/handoff`，to test the uncertain part in a toy version | 用玩具原型验证不确定的部分，并留好交接 |
| 3 | `/to-spec` and `/to-tickets`，to break big work into reviewable slices | 把大工作拆成可评审的切片 |
| 4 | `Sandcastle`，to run AFK agents somewhere safe | 在安全的地方跑挂机（AFK）agent（外部工具，不在本包） |
| 5 | `/code-review`，so each run teaches the next one | 每一次评审，都让下一次运行变得更好 |
| 6 | The full loop, start to finish | 从起点到终点，跑完整条循环 |

## 安装

插件会向 `ctx.skills` 注册表的 **host 层** 注册一个技能提供者，因此每个
agent preset 的作用域链都会合并这些技能。技能正文随包分发
（`skills/<name>/SKILL.md`），通过 `import.meta.url` 定位——这是包的
组装事实，不需要任何用户配置。

### 前置条件

- 已安装 DeepSeek Harness，并且有 **pnpm**——`dsh plugin` 命令内部调用
  pnpm（用 `pnpm --version` 检查；没有的话到 https://pnpm.io 安装）
- `dsh` 命令行。它随 Harness 一起提供，通常以 `npx @deepseek-ai/dsh web`
  方式启动。要么把它装成全局命令，要么在所有命令前加 `npx`：

  ```sh
  npm install -g @deepseek-ai/dsh
  dsh --version
  ```

  下文所有 `dsh ...` 示例都可以等价写成 `npx @deepseek-ai/dsh ...`。

### 从本地文件夹安装（推荐）

```sh
dsh plugin --profile web add D:\Workspace_Harness\test\mattpocock-skills-dsh-zh
```

文件夹安装是链接方式，改完重启 profile 即生效。

### 重启并验证

bundle 层在 profile 启动时挂载，所以需要**重启 profile**（停掉后重新运行
`dsh web` / `npx @deepseek-ai/dsh web`，再刷新浏览器）。确认层已组合：

```sh
dsh --profile web --dump-config     # 必须出现 `mattpocock-skills-dsh-zh` 行
```

之后 25 个技能会出现在 agent 技能目录中，可以用 `skill` 工具加载
（`ask-matt-zh` 是路由器入口）。**所有技能名统一带 `-zh` 后缀**。

### 卸载

```sh
dsh plugin --profile web remove mattpocock-skills-dsh-zh
# 卸载后同样需要重启 profile
```

## 技能列表（全量 25 个 = 上游 promoted 集，本包技能名带 `-zh` 后缀）

### productivity（7）

| 技能 | 用途 | 调用方式 |
| --- | --- | --- |
| grill-me | 把一个**模糊的想法**拷问成你能承诺的东西——以"轮"提问，每轮只问前置条件已定的完整**前沿**（frontier） | 用户调用（指向 grilling） |
| grilling | 在任何人行动之前压力测试计划/决策/想法的面试循环：把主题映射成**设计树**（design tree），逐支问到底，直到没有默认假设残留 | 模型/用户调用 |
| handoff | 把当前对话压缩成**交接文档**——写到系统临时目录（而非工作区）的单个 Markdown 文件，新 agent 读它即可接手 | 用户调用 |
| teach | 把所在目录变成常驻教学空间，跨多个会话用短小的自包含 HTML 课程教一个主题 | 用户调用 |
| to-questionnaire | 把一个人定不了的决策变成**问卷**——交给掌握缺失信息的人异步填，或开会一起过 | 用户调用 |
| wait-what | 消息没接住时输入它：agent 重讲一遍刚才的话，补上缺失的上下文、用平实的语言、采用项目 `CONTEXT.md` 的词汇 | 用户调用 |
| writing-for-agents | 写 agent 消费文档的参考（skill、`AGENTS.md`/`CLAUDE.md`、spec、运行时提示词、README）：包装不同，写法相同 | 模型/用户调用 |

### engineering（18）

| 技能 | 用途 | 调用方式 |
| --- | --- | --- |
| ask-matt | 全仓库技能的路由器：描述你的处境，它给出匹配的技能或技能序列，以及其中人类决策的位置 | 用户调用 |
| code-review | 按两个轴评审 `HEAD` 与指定基点的 diff：**Standards**（是否符合本仓库写法）+ **Spec**（是否实现了源头 issue/spec），两轴各由独立子代理运行 | 模型/用户调用 |
| codebase-design | 固定模块设计词汇：**module、interface、depth、seam、adapter、leverage、locality**，逐一精确定义并禁用松散替身词 | 模型/用户调用 |
| diagnosing-bugs | 对硬 bug 或性能回归跑多阶段诊断：复现→最小化→假设排序→插桩→带回归测试修复→清理 | 模型/用户调用 |
| domain-modeling | 设计过程中构建并打磨项目的**通用语言**（ubiquitous language）：挑战与词汇表冲突的术语、逼出精确词、用具体场景压力测试关系 | 模型/用户调用 |
| grill-with-docs | 拷问计划/设计直到共享理解，同时把词汇与硬决策写进仓库（ADR + 词汇表）；与 grill-me 同款面试，面向代码库 | 用户调用 |
| implement | 构建已决策的工作：指向 ticket/spec/刚谈定的计划，写代码、在接缝处驱动 tdd、边写边类型检查、末尾跑 code-review 并提交 | 用户调用 |
| improve-codebase-architecture | 扫描代码库找**加深机会**（deepening opportunities，浅模块→深模块），写成自包含 HTML 报告，然后拷问你选中的那个 | 用户调用 |
| prototype | 写**一次性代码回答问题**——状态模型对不对、界面该长什么样；问题先行，答错问题就是纯浪费 | 模型/用户调用 |
| research | 只从**一手资料**（官方文档/源码/spec/官方 API）读答案，在仓库留下带引用的 Markdown；每条结论追到拥有它的源头 | 模型/用户调用 |
| resolving-merge-conflicts | 逐块解决进行中的 git merge/rebase 冲突，依据**意图**追溯到每一侧的源头，跑项目自己的检查，提交收尾 | 模型/用户调用 |
| setup-matt-pocock-skills | 回答一个仓库的三个问题（issue 放哪、triage 标签叫什么、领域文档在哪），以 `docs/agents/` 下的 markdown 记录 | 用户调用 |
| tdd | 测试先行构建功能/修 bug：一个失败测试→刚好能过的代码→下一个行为；并携带让测试套件值得保留的标准 | 模型/用户调用 |
| to-spec | 把刚谈完的对话变成 **spec**，作为单个 issue 发布到 issue tracker | 用户调用 |
| to-tickets | 把计划/spec/对话拆成一组 **ticket**，每个声明**阻塞边**（blocking edges，必须先行完成的其它 ticket） | 用户调用 |
| triage | 把 tracker 上的 issue 逐个走完 triage 角色状态机，留下 agent-ready 简报、给报告人的具体问题、或带原因关闭的 issue | 用户调用 |
| wayfinder | 把超过一个 agent 会话的大工程画成 issue tracker 上的**决策票据地图**，逐条解决直到路清晰 | 用户调用 |
| wizard | 生成交互式 bash 脚本，一步步带人走手动流程（接三方服务/一次性迁移）：打开 URL、说清点哪复制什么、捕获结果写入 `.env` 与 GitHub secrets | 模型/用户调用 |

> 说明：`/clear`、`/compact` 是上游引用的 Claude Code 原生命令，非本包技能；
> DSH 中对应"开新会话"与"手动摘要续接"，详见
> `skills/ask-matt-zh/PHASE-BOUNDARIES.md` 的移植注记。

## 汉化与移植说明

- **同步基线**：正文对照英文 DSH 版 `mattpocock-skills-dsh` **v0.1.7**
  逐段汉化；英文版最近一次 **2026-08-26** 全量同步至上游
  [mattpocock/skills](https://github.com/mattpocock/skills) `6654f6b`（含
  grilling 轮次 HR 分隔、wait-what `CONTEXT-MAP.md` 指引、to-tickets
  wide-refactor 段落）。更新历史见 [CHANGELOG.md](CHANGELOG.md)。
- **正文全译**：25 个 `SKILL.md` 正文译为自然中文；frontmatter 的 `name`
  统一为 `<基础名>-zh`（与目录名一致），`description` 译为中文（便于中文触发）。
- **辅助文档全译**：技能引用的辅助 `.md` 文档全部汉化（格式模板、规程、
  指南），与正文同等标准；`.sh` 模板脚本保持英文原样（代码惯例，文件名
  不变，由 `resourceBase` 解析）。
- **术语策略**：关键操作术语保留英文，首次出现处附中文注释，避免翻译
  损伤模型对概念的调用。
- **格式**：上游即标准 `SKILL.md`（YAML frontmatter：`name` +
  `description`，可选 `whenToUse`），DSH 可直接消费，正文结构零改动。
- **调用语义**：上游 `disable-model-invocation: true`（仅用户可调，如
  `grill-me`、`wait-what`）映射为 DSH 的 `invocation.modelInvocable: false`，
  保留原意图；其余技能模型/用户均可调用。
- **工具名适配**：Claude Code 的 `Skill tool` 改为 DSH 的 `skill` 工具；
  `grilling` 中的"dispatch a sub-agent"对应 DSH 的 `subagent` 工具。
- **未移植的辅助文件**：各技能目录下的 `agents/openai.yaml` 是 Codex 的
  调用策略，DSH 不需要，已剔除。

## 工作原理

- **Bundle 层**——`cordis.patch.yml` 在 dsh-base 层之上插入一行
  （`- id: mattpocock-skills-dsh-zh, name: mattpocock-skills-dsh-zh`）。
  后面的层（profile 的 `cordis.patch.yml`、`--patch` 叠加）仍可按 id
  定位这一行。
- **提供者**——`lib/index.js` 调用 `ctx.skills.registerProvider(...)`：
  - `list()` 扫描包内 `skills/` 目录，把每个 `<name>/SKILL.md` 作为候选，
    从 YAML frontmatter 解析出 `name`、`description`、`whenToUse` 与
    `disable-model-invocation`。
  - `get()` 按需读取候选技能正文，返回完整技能定义，`resourceBase` 指向
    技能所在目录，使相对引用可以正确解析。
- **零运行时依赖**——插件只使用 Node 内置模块，消费注入的 `ctx.skills`
  服务接口。

## 添加自己的技能

往包里放一个新的 `skills/<kebab-name>/SKILL.md` 即可——它必须以 YAML
frontmatter 开头（`name` + `description`，可选 `whenToUse` 与
`disable-model-invocation`）。无需改任何代码：`list()` 会自动发现它。

## 验证

```sh
npm run verify     # 发现/解析/调用映射/中文描述/相对引用完整性
```

## 许可证

MIT。技能内容改编自
[mattpocock/skills](https://github.com/mattpocock/skills)（MIT），© Matt
Pocock；英文 DSH 移植部分 © mattpocock-skills-dsh contributors；中文翻译
与 DSH 适配 © mattpocock-skills-dsh-zh contributors。见 [LICENSE](LICENSE)。
