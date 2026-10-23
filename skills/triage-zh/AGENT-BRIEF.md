# 撰写 Agent Brief（代理简报）

Agent brief（代理简报）是当议题或 PR 移动到 `ready-for-agent` 时发布在 GitHub issue 或 PR 上的一条结构化评论。它是 AFK agent 将要依据的权威规格。原始正文和讨论只是上下文：agent brief 才是契约。

Brief 陈述**代理应该做什么**，这延伸到两种对象：对于议题，是从零开始构建该改动；对于 PR，是对*现有差异（diff）*还要做的事：完成它、填补缺口、处理评审意见。两种情况遵循同样的原则；下面的 PR 示例展示了差异。

## 原则

### 持久性优先于精确性

议题可能在 `ready-for-agent` 停留数天或数周。代码库在此期间会发生变化。撰写 brief 时要让它即使在文件被重命名、移动或重构之后仍然有用。

- **要**描述接口、类型和行为契约
- **要**点出代理应该查找或修改的具体类型、函数签名或配置结构
- **不要**引用文件路径：它们会失效
- **不要**引用行号
- **不要**假定当前的实现结构会保持不变

### 描述行为，而非过程

描述系统**应该做什么**，而不是**如何**实现它。代理会重新探索代码库，并做出自己的实现决策。

- **好：**「`SkillConfig` 类型应接受一个类型为 `CronExpression` 的可选 `schedule` 字段」
- **差：**「打开 src/types/skill.ts，在第 42 行添加一个 schedule 字段」
- **好：**「当用户不带参数运行 `triage` 时，他们应该看到一份需要关注的议题摘要」
- **差：**「在主处理函数中添加一个 switch 语句」

### 完整的验收标准

代理需要知道何时算完成。每份 agent brief 都必须有具体、可测试的验收标准。每条标准都应可独立验证。

- **好：**「运行 `gh issue list --label needs-triage` 会返回经过初步分类的议题」
- **差：**「Triage 应该能正常工作」

### 明确的范围边界

说明哪些不在范围内。这能防止代理过度加码（gold-plating）或对相邻功能做出臆断。

## 模板

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** one-line description of what needs to happen

**Current behavior:**
Describe what happens now. For bugs, this is the broken behavior.
For enhancements, this is the status quo the feature builds on.

**Desired behavior:**
Describe what should happen after the agent's work is complete.
Be specific about edge cases and error conditions.

**Key interfaces:**
- `TypeName`: what needs to change and why
- `functionName()` return type: what it currently returns vs what it should return
- Config shape: any new configuration options needed

**Acceptance criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3

**Out of scope:**
- Thing that should NOT be changed or addressed in this issue
- Adjacent feature that might seem related but is separate
```

## 示例

### 好的 agent brief（缺陷）

```markdown
## Agent Brief

**Category:** bug
**Summary:** Skill description truncation drops mid-word, producing broken output

**Current behavior:**
When a skill description exceeds 1024 characters, it is truncated at exactly
1024 characters regardless of word boundaries. This produces descriptions
that end mid-word (e.g. "Use when the user wants to confi").

**Desired behavior:**
Truncation should break at the last word boundary before 1024 characters
and append "..." to indicate truncation.

**Key interfaces:**
- The `SkillMetadata` type's `description` field: no type change needed,
  but the validation/processing logic that populates it needs to respect
  word boundaries
- Any function that reads SKILL.md frontmatter and extracts the description

**Acceptance criteria:**
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Descriptions over 1024 chars are truncated at the last word boundary
      before 1024 chars
- [ ] Truncated descriptions end with "..."
- [ ] The total length including "..." does not exceed 1024 chars

**Out of scope:**
- Changing the 1024 char limit itself
- Multi-line description support
```

### 好的 agent brief（功能增强）

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Add `.out-of-scope/` directory support for tracking rejected feature requests

**Current behavior:**
When a feature request is rejected, the issue is closed with a `wontfix` label
and a comment. There is no persistent record of the decision or reasoning.
Future similar requests require the maintainer to recall or search for the
prior discussion.

**Desired behavior:**
Rejected feature requests should be documented in `.out-of-scope/<concept>.md`
files that capture the decision, reasoning, and links to all issues that
requested the feature. When triaging new issues, these files should be
checked for matches.

**Key interfaces:**
- Markdown file format in `.out-of-scope/`: each file should have a
  `# Concept Name` heading, a `**Decision:**` line, a `**Reason:**` line,
  and a `**Prior requests:**` list with issue links
- The triage workflow should read all `.out-of-scope/*.md` files early
  and match incoming issues against them by concept similarity

**Acceptance criteria:**
- [ ] Closing a feature as wontfix creates/updates a file in `.out-of-scope/`
- [ ] The file includes the decision, reasoning, and link to the closed issue
- [ ] If a matching `.out-of-scope/` file already exists, the new issue is
      appended to its "Prior requests" list rather than creating a duplicate
- [ ] During triage, existing `.out-of-scope/` files are checked and surfaced
      when a new issue matches a prior rejection

**Out of scope:**
- Automated matching (human confirms the match)
- Reopening previously rejected features
- Bug reports (only enhancement rejections go to `.out-of-scope/`)
```

### 好的 agent brief（PR）

对于 PR，「Current behavior」描述的是差异（diff）的现状，brief 要求代理去完成或修复它，而不是从零开始构建。

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Finish the contributor's `--json` output flag for `triage list`

**Current behavior:**
The PR adds a `--json` flag that serializes the issue list to JSON. The happy
path works and the diff matches the project's command structure. Two gaps
remain: errors are still printed as human text (not JSON), and the new flag has
no test coverage.

**Desired behavior:**
With `--json`, all output (including errors) is well-formed JSON on stdout,
and the command's exit codes are unchanged. The existing human-readable output
is untouched when the flag is absent.

**Key interfaces:**
- The command's error path should emit `{ "error": string }` under `--json`
  instead of the plain-text error
- Reuse the existing serializer the PR already added; don't introduce a second

**Acceptance criteria:**
- [ ] `triage list --json` emits valid JSON for both success and error cases
- [ ] Exit codes match the non-JSON command
- [ ] A test covers the `--json` success output and one error case
- [ ] Default (non-JSON) output is byte-for-byte unchanged

**Out of scope:**
- Adding `--json` to any other command
- Changing the JSON shape of the success payload the PR already defined
```

### 差的 agent brief

```markdown
## Agent Brief

**Summary:** Fix the triage bug

**What to do:**
The triage thing is broken. Look at the main file and fix it.
The function around line 150 has the issue.

**Files to change:**
- srctriage/handler.ts (line 150)
- src/types.ts (line 42)
```

它之所以差是因为：
- 没有 category（分类）
- 描述含糊（「triage 那个东西坏了」）
- 引用了会失效的文件路径和行号
- 没有验收标准
- 没有范围边界
- 没有描述当前行为与期望行为的对比
