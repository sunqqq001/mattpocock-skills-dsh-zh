# Changelog

本文件记录 `mattpocock-skills-dsh-zh`（本地完整汉化版）的变更。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.1.8-local.1] - 2026-10-23

本地完整汉化版（未发布 npm）。

### Changed

- **汉化基线**：以英文 DSH 版 `mattpocock-skills-dsh` **v0.1.7** 为源，
  25 个 `SKILL.md` 正文全部译为自然中文；关键操作术语保留英文，首次
  出现处附中文注释。
- **辅助文档全译并随包分发**：22 个辅助 `.md` 文档（`PHASE-BOUNDARIES.md`、
  `DEEPENING.md`、`DESIGN-IT-TWICE.md`、`AGENT-BRIEF.md`、`OUT-OF-SCOPE.md`、
  `SKILL-MECHANICS.md`、`LOGIC.md`、`UI.md`、`HTML-REPORT.md`、各
  `*-FORMAT.md`、`issue-tracker-*.md`、`domain.md`、`triage-labels.md`、
  `mocking.md`、`tests.md`）与正文同等标准汉化；2 个 `.sh` 模板脚本
  （`template.sh`、`hitl-loop.template.sh`）保持英文原样。正文相对引用
  不再断链。
- **技能命名**：25 个技能名统一带 `-zh` 后缀，避免与英文版、用户级同名
  技能互相遮蔽。
- **校验增强**：`scripts/verify-provider.mjs` 新增两条断言——description
  必须为中文、正文引用的每个相对文件必须真实存在于技能目录
  （resourceBase 解析）。
- **修正英文原版笔误**：`setup-matt-pocock-skills` 正文中
  `docs/agentstriage-labels.md`（3 处，应为 `docs/agents/triage-labels.md`）
  与链接 `(.triage-labels.md)`（1 处，应为 `./triage-labels.md`）均为
  英文 v0.1.7 原文笔误，本版修正为正确路径（`triage` 分诊标签文档的真实
  位置）。
- **元数据**：`dsh.plugin.json` 的 id 为 `sunqqq001/mattpocock-skills-dsh-zh`；
  `cordis.patch.yml` 的行 id 与 `lib/index.js` 的提供者名为
  `mattpocock-skills-dsh-zh`；`lib/index.js` 注释汉化；版本号
  `0.1.8-local.1`（高于 npm 上已发布的 0.1.6 版，便于本地覆盖安装）。
- **README**：重写为本地完整汉化版说明（安装、技能列表、汉化与移植说明）；
  移除 `README.en.md`。

### Inherited（继承英文版 v0.1.7 的历史）

- `diagnosing-bugs/scripts/hitl-loop.template.sh` 为上游逐字节还原的
  完整模板（英文版 0.1.7 修复了自 0.1.5 起发布的 82 B 残渣文件）。
- 正文内容与英文版 v0.1.7 一致（含 2026-08-26 的上游全量同步
  mattpocock/skills 068b6e0 → 6654f6b：grilling 轮次 HR 分隔、
  wait-what `CONTEXT-MAP.md` 指引、to-tickets wide-refactor 段落等）。
