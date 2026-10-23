// mattpocock-skills-dsh-zh：Matt Pocock 技能集的中文版，面向 DeepSeek Harness。
//
// 一个 Cordis 插件：向 `ctx.skills` 注册表的 HOST 层注册一个技能提供者，
// 因此每个 agent preset 的作用域链都会合并这些技能。技能正文存放于本包
// `../skills/<name>/SKILL.md`；提供者通过 `import.meta.url` 定位它们
// （这是包的组装事实，与用户配置无关），并按需加载正文。
//
// 提供者协议与 @deepseek-ai/dsh-skill-filesystem 对齐：
//   - list()  发现目录型技能候选（name/description 来自 YAML frontmatter，
//     正文在被请求之前不读取）
//   - get()   解析获胜候选的 SKILL.md，返回完整定义，并附带目录型
//     resource base 供相对引用解析
//
// 相对上游的适配注记（对照 https://github.com/mattpocock/skills）：
//   - `disable-model-invocation: true`（仅用户可调用的技能，如
//     grill-me / wait-what）映射为 invocation.modelInvocable: false，
//     让 DSH 保留上游的调用语义。
//   - 不随包分发 harness 专用辅助文件（如 Codex 的 agents/openai.yaml）；
//     只有 SKILL.md 及其相对引用的文件随包走。
//
// @module mattpocock-skills-dsh-zh
import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const name = 'mattpocock-skills-dsh-zh'
const inject = ['skills']

/** 打包技能提供者的注册优先级：低于本地 bundled 根。 */
const PACKAGED_SKILL_RANK = 550

/** 这些技能对外宣告的来源桶（提示词可见的元数据）。 */
const SOURCE = 'custom'

/**
 * 把 SKILL.md 的 YAML frontmatter 块解析为元数据加正文。
 * 处理 DSH 技能发现所消费的标量字段（name、description、whenToUse）
 * 以及上游的调用标志；支持折叠标量块（`description: >` 加缩进行）——
 * 折叠行以单个空格连接，符合 YAML 语义。更丰富的元数据原样透传。
 * @param text - 原始技能文件内容。
 * @returns 解析后的元数据对象与块之后的 markdown 正文；文件完全没有
 *   frontmatter 块时返回 null。
 */
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const block = text.slice(3, end)
  const body = text.slice(end + 4).replace(/^\n+/, '')
  const metadata = {}
  let currentKey = null
  let folded = false
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd()
    if (/^[ \t]/.test(line) && currentKey !== null) {
      // 折叠标量的缩进续行。
      const value = line.trim()
      if (value) {
        metadata[currentKey] = folded
          ? `${metadata[currentKey]} ${value}`
          : `${metadata[currentKey]}\n${value}`
      }
      continue
    }
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (!match) {
      currentKey = null
      folded = false
      continue
    }
    let value = match[2].trim()
    folded = value === '>' || value === '>-' || value === '>+'
    if (folded) {
      value = ''
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    metadata[match[1]] = value
    currentKey = folded ? match[1] : null
  }
  return { metadata, body }
}

/**
 * 读取并解析一个技能目录的 SKILL.md。
 * @param skillFile - SKILL.md 文件的绝对路径。
 * @param signal - 可选取消信号；中止读取。
 * @returns 解析后的技能记录；文件消失时返回 undefined。
 */
async function parseSkillFile(skillFile, signal) {
  let text
  try {
    text = await readFile(skillFile, 'utf8')
  } catch {
    return undefined
  }
  if (signal?.aborted) return undefined
  const parsed = parseFrontmatter(text)
  if (parsed === null) return undefined
  return {
    name: parsed.metadata.name ?? '',
    description: parsed.metadata.description ?? '',
    whenToUse: parsed.metadata.whenToUse,
    metadata: parsed.metadata,
    content: parsed.body
  }
}

/**
 * 上游 `disable-model-invocation: true` 标记仅用户可调用的技能（只有人
 * 能触达）。把它映射到 DSH 的调用标志；其余技能保持模型与用户均可调用。
 * @param metadata - 解析后的 frontmatter 元数据。
 * @returns DSH 调用记录。
 */
function invocationFrom(metadata) {
  if (metadata['disable-model-invocation'] === 'true') {
    return { modelInvocable: false, userInvocable: true }
  }
  return { modelInvocable: true, userInvocable: true }
}

/**
 * 通过扫描包内 `skills/` 目录发现打包技能候选：每个技能一个子目录，
 * 目录内带一份 SKILL.md。
 * @param skillsRoot - 本包 skills 目录的绝对路径。
 * @param signal - 可选取消信号。
 * @returns 候选列表。
 */
async function discoverCandidates(skillsRoot, signal) {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const candidates = []
  for (const entry of entries) {
    if (signal?.aborted) break
    if (!entry.isDirectory()) continue
    const skillDir = join(skillsRoot, entry.name)
    const skillFile = join(skillDir, 'SKILL.md')
    const parsed = await parseSkillFile(skillFile, signal)
    if (parsed === undefined) continue
    candidates.push({
      name: parsed.name,
      description: parsed.description,
      ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
      invocation: invocationFrom(parsed.metadata),
      source: SOURCE,
      provider: name,
      rank: PACKAGED_SKILL_RANK,
      locator: skillDir,
      path: skillFile,
      ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {})
    })
  }
  return candidates
}

/** 把打包的 matt-pocock 提供者注册到 `ctx.skills`。 */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: invocationFrom(parsed.metadata),
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
