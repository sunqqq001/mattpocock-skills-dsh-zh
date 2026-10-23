# MISSION.md 格式

`MISSION.md` 位于工作区根目录。它记录用户学习这个主题的_原因_。每一项教学决策（接下来教什么、呈现哪些资源、设计哪些练习）都应追溯到这份文档。

## 模板

```md
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. What changes in their life or work when they have this skill? Avoid abstract framings like "to understand X"; push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase right now, protecting the zone of proximal development}
```

## 规则

- **每个工作区一个 mission（使命）。** 如果用户想学两件互不相关的事，那就是两个工作区。
- **具体优于抽象。** “十月前跑完半程马拉松”胜过“身体更好”。“给我的团队交付一个 Rust CLI”胜过“学 Rust”。
- **对模糊要追问。** 如果用户说不清为什么，先访谈他们，再动笔写。一个糟糕的 mission 比没有 mission 更糟。
- **现实变化时修订。** mission 会变。当用户的目标移动了，就更新这份文件：不要让过时的 mission 继续主导未来的会话。
- **保持简短。** 如果 `MISSION.md` 超过一屏，它就不再是指南针，而开始变成一份计划了。
