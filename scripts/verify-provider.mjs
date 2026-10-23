// verify-provider.mjs — mattpocock-skills-dsh-zh 技能提供者的功能性冒烟
// 测试，无需启动 DSH profile。
//
// 用法：node scripts/verify-provider.mjs
//
// 它伪造 `ctx.skills.registerProvider` 接口，捕获注册的提供者，然后像
// host 注册表一样调用 list() 与 get()。
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { apply } from '../lib/index.js'

let captured
const ctx = {
  skills: {
    registerProvider(providerFactory) {
      captured = providerFactory({})
    }
  }
}

apply(ctx)
if (!captured) {
  console.error('FAIL: provider was not registered')
  process.exit(1)
}

const candidates = await captured.list({ signal: undefined })
console.log(`discovered ${candidates.length} candidate(s):`)
const expected = new Set([
  'ask-matt-zh', 'code-review-zh', 'codebase-design-zh', 'diagnosing-bugs-zh', 'domain-modeling-zh',
  'grill-me-zh', 'grill-with-docs-zh', 'grilling-zh', 'handoff-zh', 'implement-zh',
  'improve-codebase-architecture-zh', 'prototype-zh', 'research-zh', 'resolving-merge-conflicts-zh',
  'setup-matt-pocock-skills-zh', 'tdd-zh', 'teach-zh', 'to-questionnaire-zh', 'to-spec-zh', 'to-tickets-zh',
  'triage-zh', 'wait-what-zh', 'wayfinder-zh', 'wizard-zh', 'writing-for-agents-zh'
])
const found = new Set()
let failures = 0

const linkRe = /\]\(([^)]+?\.(?:md|sh|mjs|js|json|ya?ml))\)/g

for (const c of candidates) {
  found.add(c.name)
  const detail = await captured.get(c, { signal: undefined })
  const flag = detail?.invocation?.modelInvocable === false ? 'user-only' : 'model+user'
  console.log(
    `  - ${c.name}: "${detail?.description?.slice(0, 48)}" [${flag}] content=${detail?.content?.length ?? 0} chars`
  )
  if (!detail?.content || !detail?.resourceBase) {
    console.error(`FAIL: ${c.name} missing content or resourceBase`)
    failures++
    continue
  }
  const d = detail.description ?? ''
  if (!/[一-鿿]/.test(d)) {
    console.error(`FAIL: ${c.name} description does not look Chinese: "${d}"`)
    failures++
  }
  // 正文引用的相对文件必须真实存在于技能目录（resourceBase）。
  const base = detail.resourceBase.path
  linkRe.lastIndex = 0
  for (const m of detail.content.matchAll(linkRe)) {
    const ref = m[1].replace(/^\.\//, '')
    if (!existsSync(join(base, ref))) {
      console.error(`FAIL: ${c.name} references missing file "${ref}" (resourceBase=${base})`)
      failures++
    }
  }
}

for (const want of expected) {
  if (!found.has(want)) {
    console.error(`FAIL: expected skill "${want}" was not discovered`)
    failures++
  }
}
for (const name of found) {
  if (!expected.has(name)) {
    console.error(`FAIL: unexpected skill "${name}" discovered`)
    failures++
  }
}

if (failures) {
  console.error(`FAIL: ${failures} problem(s)`)
  process.exit(1)
}
console.log('OK: 25 个中文技能发现、中文 description、frontmatter 解析、调用映射、正文相对引用完整性全部通过')
