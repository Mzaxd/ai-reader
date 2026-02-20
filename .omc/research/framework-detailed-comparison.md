# 框架核心功能深度对比分析

**报告日期**: 2026-02-20
**分析人**: analyst-2
**对比版本**: oh-my-claudecode v4.2.12 vs oh-my-opencode (最新)

---

## 目录

1. [概览对比](#1-概览对比)
2. [Agent系统对比](#2-agent系统对比)
3. [技能系统对比](#3-技能系统对比)
4. [Hook系统对比](#4-hook系统对比)
5. [执行模式对比](#5-执行模式对比)
6. [多模型支持对比](#6-多模型支持对比)
7. [工具集成对比](#7-工具集成对比)
8. [状态管理对比](#8-状态管理对比)
9. [扩展性对比](#9-扩展性对比)
10. [社区与生态对比](#10-社区与生态对比)
11. [文档完善度对比](#11-文档完善度对比)
12. [总结对比表](#12-总结对比表)

---

## 1. 概览对比

### 1.1 基本信息对比

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **基于平台** | Claude Code (Anthropic官方) | OpenCode (开源) |
| **开源状态** | 开源 (MIT许可证) | 开源 (MIT许可证) |
| **GitHub Stars** | 未公开具体数据 | ~9.2K+ |
| **月活跃用户** | 未公开 | 650K+ |
| **核心定位** | Claude Code 专用编排层 | 多提供商通用编排层 |
| **设计哲学** | 专业分工 + 验证驱动 | 专业分工 + 无情完成 |

### 1.2 核心差异概览

| 维度 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **模型支持** | 仅限 Claude | 75+ 提供商 |
| **成本结构** | 依赖 Claude 订阅 | 完全免费 + 免费模型 |
| **Agent数量** | 28个专业代理 | 10+个专业代理 |
| **技能数量** | 37个 | 60+个 |
| **Hook类型** | 31个 | 40+个 |
| **命名主题** | 职能描述 (executor, planner) | 希腊神话 (Sisyphus, Oracle) |

---

## 2. Agent系统对比

### 2.1 Agent数量与分类

#### oh-my-claudecode - 28个专业代理

**分类架构**:
```
构建/分析轨道 (8个)
├── explore (haiku)
├── analyst (opus)
├── planner (opus)
├── architect (opus)
├── debugger (sonnet)
├── executor (sonnet)
├── deep-executor (opus)
└── verifier (sonnet)

审查轨道 (6个)
├── style-reviewer (haiku)
├── quality-reviewer (sonnet)
├── api-reviewer (sonnet)
├── security-reviewer (sonnet)
├── performance-reviewer (sonnet)
└── code-reviewer (opus)

领域专家 (11个)
├── dependency-expert
├── test-engineer
├── quality-strategist
├── build-fixer
├── designer
├── writer
├── qa-tester
├── scientist
├── document-specialist
├── git-master
└── frontend-engineer (隐含)

产品轨道 (4个)
├── product-manager
├── ux-researcher
├── information-architect
└── product-analyst

协调代理 (2个)
├── critic
└── vision
```

#### oh-my-opencode - 10+个专业代理

**分类架构**:
```
主编排层
└── Sisyphus (主编排器)

分析层
├── Oracle (架构/深度调试)
├── Librarian (文档检索)
└── Explorer (代码库分析)

规划层
├── Prometheus (战略规划)
├── Metis (规划顾问)
└── Momus (规划审查)

执行层
├── Atlas (主执行编排器)
├── Hephaestus (深度自主工作者)
├── Frontend Engineer (UI/UX)
├── Git Master (原子化提交)
└── Multimodal Looker (多模态观察)
```

### 2.2 Agent模型路由策略对比

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **路由策略** | 基于任务复杂度自动选择 (haiku/sonnet/opus) | 每代理配置指定模型 |
| **灵活性** | 高 (自动优化成本/质量) | 中 (手动配置) |
| **透明度** | 中 (内部路由逻辑) | 高 (配置文件可见) |
| **成本优化** | 是 (小任务用haiku) | 是 (免费模型选项) |

### 2.3 Agent编排模式对比

#### oh-my-claudecode编排模式

| 模式 | 描述 |
|------|------|
| **推荐工作流** | 预定义的代理序列组合 |
| **Team Pipeline** | 阶段感知代理路由 (5阶段) |
| **Pipeline** | 顺序代理链与数据传递 |
| **并行执行** | 支持独立任务并行 |

#### oh-my-opencode编排模式

| 模式 | 描述 |
|------|------|
| **Sisyphus编排** | 主协调器任务分解与分配 |
| **并行协作** | 多代理同时工作，不阻塞主代理 |
| **后台任务** | 后台代理可并行执行 |

### 2.4 Agent系统对比总结

| 方面 | oh-my-claudecode 优势 | oh-my-opencode 优势 |
|------|---------------------|---------------------|
| **数量** | 28个，覆盖更全面 | 聚焦核心代理 |
| **专业化** | 更细粒度（有专门的审查轨道） | 希腊神话命名，职责清晰 |
| **模型路由** | 自动智能路由 | 手动配置，更可控 |
| **编排** | Team Pipeline阶段感知 | Sisyphus中心化编排 |

---

## 3. 技能系统对比

### 3.1 技能数量统计

| 框架 | 技能总数 | 工作流技能 | 代理快捷方式 | 实用工具 | MCP委托 |
|------|----------|-----------|-------------|---------|---------|
| **oh-my-claudecode** | 37 | 13 | 9 | 15 | 3 |
| **oh-my-opencode** | 60+ | 未细分 | 未细分 | 未细分 | 未细分 |

### 3.2 技能架构对比

#### oh-my-claudecode - 命令式技能

**触发机制**: 关键词检测

```bash
# 工作流技能示例
/autopilot "build me a todo app"
/ralph "don't stop until complete"
/ulw "ultrawork refactor this"
/team "coordinated team effort"
/pipeline "chain agents for analysis"
```

**特点**:
- 命令式调用
- 关键词触发
- 集成到执行模式
- 与代理快捷方式联动

#### oh-my-opencode - 文件系统技能

**目录结构**:
```
skill-name/
├── SKILL.md       # 元数据 + 指令
├── scripts/       # 可执行脚本
├── references/    # 参考文档
└── assets/        # 模板/图标
```

**渐进式加载**:
1. **Level 1**: YAML元数据 (始终加载)
2. **Level 2**: SKILL.md主体 (按需加载)
3. **Level 3**: 关联文件 (按需访问)

**特点**:
- 文件系统组织
- 渐进式加载优化token
- 可打包共享
- 支持版本控制

### 3.3 技能加载位置对比

| 框架 | 加载位置 | 合并策略 |
|------|----------|----------|
| **oh-my-claudecode** | `~/.claude/.omc/skills/` | 未公开 |
| **oh-my-opencode** | 1. `~/.config/opencode/skills/`<br>2. `~/.opencode/skills/`<br>3. `.opencode/skills/` | 项目本地覆盖全局 |

### 3.4 技能调用方式对比

| 方式 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **自动触发** | 是 (关键词检测) | 是 (AI判断) |
| **手动强制** | 是 (命令) | 是 |
| **命令调用** | 是 (如 `/autopilot`) | 新版本支持 |
| **技能打包** | 未提及 | 支持GitHub打包共享 |

### 3.5 内置技能对比

#### oh-my-claudecode 核心技能

| 类别 | 技能 |
|------|------|
| **工作流** | autopilot, ralph, ultrawork, swarm, ultrapilot, team, pipeline, ultraqa, plan, ralplan, sciomc, external-context, deepinit |
| **代理快捷方式** | analyze, deepsearch, tdd, build-fix, code-review, security-review, frontend-ui-ux, git-master, review |
| **MCP委托** | ask codex, ask gpt, ask gemini |
| **实用工具** | configure-discord, configure-telegram, cancel, note, learner, omc-setup, mcp-setup, hud, omc-doctor, omc-help, trace, release, project-session-manager, skill, writer-memory, ralph-init, learn-about-omc |

#### oh-my-opencode 核心技能

| 类别 | 技能 |
|------|------|
| **文档处理** | docx, pdf, xlsx, pptx |
| **开发工具** | playwright, git-master |
| **元技能** | skill-creator (生成新技能) |
| **其他** | 60+ 内置技能 (完整列表未公开) |

### 3.6 技能系统对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **技能组织** | 命令式，关键词触发 | 文件系统，渐进式加载 |
| **Token优化** | 未明确提及 | 三级加载，优化明显 |
| **可扩展性** | 高 (命令+关键词) | 高 (文件系统+打包) |
| **技能共享** | 未提及 | 支持GitHub打包 |
| **元技能** | learn-about-omc | skill-creator |

---

## 4. Hook系统对比

### 4.1 Hook数量与类型

| 框架 | Hook类型数量 | 分类方式 |
|------|-------------|----------|
| **oh-my-claudecode** | 31 | 按生命周期事件分类 |
| **oh-my-opencode** | 40+ | 按功能分类 |

### 4.2 Hook分类对比

#### oh-my-claudecode Hook分类

```
会话管理钩子
├── session-start
└── session-end

工具执行钩子
├── PreToolUse
└── PostToolUse

代理生命周期钩子
├── SubagentStart
└── SubagentComplete

任务管理钩子
├── permission-request
├── task-creation
└── task-completion

状态管理钩子
├── state-read
└── state-write

特殊功能钩子
├── setup
├── cancel
└── error-handler
```

#### oh-my-opencode Hook分类

```
会话与恢复
├── Session Recovery Hook
└── 会话中断后自动恢复工作状态

上下文管理
└── Context Window Monitor
    └── 智能管理AI模型上下文限制

代码质量
└── Comment Checker Hook
    └── 自动分析代码注释质量

系统维护
└── Auto Update Checker
    └── 自动检查更新

+ 36+ 其他Hook类型
```

### 4.3 Hook运行时保证对比

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **输入格式** | snake_case 字段 | 未明确 |
| **终止开关** | `DISABLE_OMC`, `OMC_SKIP_HOOKS` | 未明确 |
| **敏感字段过滤** | 严格允许列表 | 未明确 |
| **必需键验证** | 每种钩子类型特定验证 | 未明确 |
| **优先级机制** | 未明确 | 有 (解决冲突) |

### 4.4 Hook配置对比

#### oh-my-claudecode

- 配置通过环境变量和内部机制
- `DISABLE_OMC`: 禁用所有钩子
- `OMC_SKIP_HOOKS`: 跳过特定钩子 (逗号分隔)

#### oh-my-opencode

- 多级配置合并
- 项目级配置覆盖用户级
- `src/plugin-config.ts` 中的 `mergeConfigs` 函数

### 4.5 Hook开发对比

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **接口定义** | 系统提醒中描述 | `src/hooks/types.ts` |
| **注册方式** | 未明确 | 配置管理系统 |
| **测试支持** | 未明确 | 内置测试框架 |
| **性能优化建议** | 未明确 | 有 (避免耗时操作、异步处理、缓存) |

### 4.6 Hook系统对比总结

| 方面 | oh-my-claudecode 优势 | oh-my-opencode 优势 |
|------|---------------------|---------------------|
| **数量** | 31个，分类清晰 | 40+个，功能丰富 |
| **运行时保证** | 严格的安全机制 | 优先级解决冲突 |
| **开发体验** | 系统集成 | 有测试框架和性能指南 |
| **文档** | 系统提醒中描述 | 源码类型定义 |

---

## 5. 执行模式对比

### 5.1 执行模式数量与命名

| 框架 | 执行模式数量 | 核心模式 |
|------|-------------|----------|
| **oh-my-claudecode** | 8个主要模式 | autopilot, ralph, ultrawork, team, pipeline, ultrapilot, plan, ultraqa |
| **oh-my-opencode** | 4个主要模式 | autopilot, ralph, ultrawork, ultrapilot |

### 5.2 执行模式详细对比

#### Autopilot (自动驾驶)

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **触发关键词** | "autopilot", "build me", "I want a" | "autopilot" |
| **功能** | 全自主执行，从想法到工作代码 | 从规划到实现到测试的完全自主执行 |
| **转换** | 可过渡到 ralph 或 ultraqa | 集成 ralph、ultrawork、plan |
| **互斥** | 与 ultrapilot 互斥 | 未明确 |

#### Ralph (持久循环)

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **触发关键词** | "ralph", "don't stop", "must complete" | "ralph", "don't stop", "must complete" |
| **核心** | 自我引用循环，包含 ultrawork | 持续迭代 "思考 → 执行 → 验证" |
| **协作模式** | 支持 `team ralph` 组合 | 离线Ralph / 手动Ralph |
| **持久化** | 包装器提供持久性 | 整夜运行 / 手动迭代 |

#### Ultrawork (极致并行)

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **触发关键词** | "ulw", "ultrawork" | "ulw", "ultrawork" |
| **加速比** | 未明确 | 3-5倍 |
| **特点** | 最大并行度，并行代理编排 | 并行代理协作，智能提示优化 |
| **优先级** | 显式关键词覆盖默认配置 | 未明确 |

#### Team (团队协作)

| 特性 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **触发关键词** | "team", "coordinated team", "team ralph" | 未明确 (有代理协作) |
| **阶段** | 5阶段 pipeline | 未明确 |
| **代理路由** | 阶段感知代理路由 | Sisyphus 中心化编排 |

### 5.3 执行模式冲突解决对比

| 框架 | 冲突解决机制 |
|------|-------------|
| **oh-my-claudecode** | - 显式关键词覆盖默认配置<br>- 通用关键词读取配置文件<br>- Ralph 包含 ultrawork<br>- Autopilot 与 Ultrapilot 互斥 |
| **oh-my-opencode** | - 显式模式关键词覆盖默认配置<br>- 未明确其他冲突解决机制 |

### 5.4 执行模式对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **模式数量** | 8个，覆盖更多场景 | 4个，聚焦核心 |
| **Team模式** | 有，阶段感知代理路由 | 无独立Team模式 (代理协作) |
| **Pipeline模式** | 有，顺序代理链 | 无 (集成在协作中) |
| **Plan模式** | 有，支持 --consensus 和 --review | 集成在 autopilot 中 |
| **UltraQA** | 有 (autopilot激活) | 未明确 |

---

## 6. 多模型支持对比

### 6.1 支持的模型提供商

| 框架 | 支持提供商数量 | 主要提供商 |
|------|-------------|-----------|
| **oh-my-claudecode** | 1 (Claude) | Claude (全系列) |
| **oh-my-opencode** | 60-75+ | Claude, GPT, Gemini, 国产模型, 本地模型 |

### 6.2 模型路由策略对比

#### oh-my-claudecode

**策略**: 基于任务复杂度自动选择

| 复杂度 | 模型 | 用途 |
|--------|------|------|
| 低 | haiku | 快速查找、轻量扫描 |
| 中 | sonnet | 标准实现、调试、审查 |
| 高 | opus | 架构、深度分析、复杂重构 |

**特点**:
- 自动优化成本/质量平衡
- 透明度中等 (内部路由逻辑)
- 灵活性高

#### oh-my-opencode

**策略**: 每代理配置指定模型

```json
{
  "agents": {
    "oracle": { "model": "opencode/gpt-4" },
    "librarian": { "model": "opencode/gemini-pro" },
    "atlas": { "model": "opencode/kimi-k2.5-free" }
  }
}
```

**特点**:
- 手动配置，更可控
- 透明度高 (配置文件可见)
- 支持免费模型
- 成本优化更直接

### 6.3 成本对比

| 框架 | 成本结构 | 成本优化 |
|------|----------|----------|
| **oh-my-claudecode** | 依赖 Claude 订阅 ($17-200/月) | 自动使用 haiku 降低成本 |
| **oh-my-opencode** | 完全免费 + 免费模型选项 | 混合提供商，可降至 Claude Code 的 1/3 |

### 6.4 多模型支持对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **提供商数量** | 1 | 60-75+ |
| **模型路由** | 自动智能 | 手动配置 |
| **成本控制** | 自动优化 | 手动优化 + 免费模型 |
| **灵活性** | 低 (仅Claude) | 高 (多提供商) |
| **网络依赖** | 需要 Anthropic 连接 | 支持国产模型，无连接问题 |

---

## 7. 工具集成对比

### 7.1 LSP (Language Server Protocol) 支持

| 框架 | LSP工具数量 | 主要功能 |
|------|------------|----------|
| **oh-my-claudecode** | 12个 | hover, goto_definition, find_references, document_symbols, workspace_symbols, diagnostics, rename, code_actions 等 |
| **oh-my-opencode** | 支持 | 重命名、跳转到定义、查找引用等 |

**对比**: oh-my-claudecode 的 LSP 工具列表更详细和完整。

### 7.2 AST (Abstract Syntax Tree) 支持

| 框架 | AST工具 | 支持语言 |
|------|---------|----------|
| **oh-my-claudecode** | ast_grep_search, ast_grep_replace | 未明确 |
| **oh-my-opencode** | AST-Grep | 25种语言 |

**对比**: oh-my-opencode 明确支持25种语言的AST操作。

### 7.3 Python REPL

| 框架 | 支持 |
|------|------|
| **oh-my-claudecode** | 是 (python_repl 持久 REPL) |
| **oh-my-opencode** | 未明确 |

### 7.4 其他工具集成

#### oh-my-claudecode

- **Notepad**: 会话记忆管理
- **Project Memory**: 项目持久化记忆
- **Trace**: 时间线/摘要功能
- **State Management**: 完整的状态读写工具集

#### oh-my-opencode

- **会话管理**: 跨会话搜索和对话历史
- **会话恢复**: Session Recovery Hook

### 7.5 工具集成对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **LSP支持** | 12个工具，详细列表 | 支持，列表未详细 |
| **AST支持** | 2个工具 | AST-Grep, 25种语言 |
| **Python REPL** | 有 | 未明确 |
| **会话管理** | Notepad + Project Memory | 会话恢复 + 搜索 |
| **状态管理** | 完整工具集 (read/write/clear/list/get_status) | 未明确 |

---

## 8. 状态管理对比

### 8.1 状态存储路径

#### oh-my-claudecode

```
{worktree}/.omc/state/
├── {mode}-state.json              # 模式状态文件
└── sessions/
    └── {sessionId}/
        ├── {mode}-state.json      # 会话作用域状态
        └── ...
```

**关键路径**:
- 工作树根目录: `{worktree}` (非 `~/.claude/`)
- 模式状态: `.omc/state/{mode}-state.json`
- 会话状态: `.omc/state/sessions/{sessionId}/`

#### oh-my-opencode

- 项目级: `project-root/.omc/oh-my-opencode.json`
- 用户级: `~/.claude/opencode/oh-my-opencode.json`
- 具体状态路径未详细公开

### 8.2 支持的模式

| 框架 | 支持的模式 |
|------|-----------|
| **oh-my-claudecode** | autopilot, ultrapilot, team, pipeline, ralph, ultrawork, ultraqa |
| **oh-my-opencode** | autopilot, ralph, ultrawork, ultrapilot (主要模式) |

### 8.3 状态管理工具

#### oh-my-claudecode 状态工具

| 工具 | 功能 |
|------|------|
| `state_read` | 读取状态 |
| `state_write` | 写入状态 |
| `state_clear` | 清除状态 |
| `state_list_active` | 列出活动状态 |
| `state_get_status` | 获取状态状态 |

#### oh-my-opencode 状态工具

- 未明确列出具体工具
- 通过配置系统管理状态

### 8.4 特殊状态管理机制

#### oh-my-claudecode - Team + Ralph 组合

```
当检测到 team + ralph 关键词时:
- Team 提供多代理编排
- Ralph 提供持久循环
- 两者写入链接的状态文件 (linked_team/linked_ralph)
- 取消任一模式会同时取消两者
```

#### oh-my-opencode

- Session Recovery Hook: 会话中断后自动恢复
- Context Window Monitor: 智能管理上下文限制

### 8.5 状态管理对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **存储路径** | 详细定义 (工作树根目录) | 多级配置，路径未详细 |
| **状态工具** | 5个完整工具 | 未明确 |
| **会话恢复** | 通过状态管理 | Session Recovery Hook |
| **模式链接** | Team + Ralph 链接状态 | 未明确 |
| **上下文管理** | 未明确 | Context Window Monitor |

---

## 9. 扩展性对比

### 9.1 扩展机制

#### oh-my-claudecode

| 机制 | 描述 |
|------|------|
| **Skills** | 37个技能，命令式调用 |
| **Hooks** | 31个钩子，生命周期事件 |
| **MCP Integration** | Codex, Gemini 双提供商 |
| **Custom Agents** | 通过代理目录定义 |
| **Team Mode** | 阶段感知代理路由 |

#### oh-my-opencode

| 机制 | 描述 |
|------|------|
| **Skills** | 60+技能，文件系统组织，支持打包 |
| **Hooks** | 40+钩子，功能分类 |
| **MCP Integration** | Exa AI, Context7, grep.app |
| **Custom Agents** | 希腊神话命名代理 |
| **Plugin System** | 可打包自定义功能模块 |

### 9.2 技能扩展性

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **技能组织** | 命令式，关键词触发 | 文件系统，渐进式加载 |
| **技能打包** | 未提及 | 支持GitHub打包共享 |
| **元技能** | learn-about-omc | skill-creator |
| **Token优化** | 未明确 | 三级加载优化明显 |

### 9.3 Hook扩展性

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **Hook数量** | 31个 | 40+个 |
| **开发支持** | 系统提醒描述 | 类型定义 + 测试框架 |
| **冲突解决** | 未明确 | 优先级机制 |
| **性能指南** | 未明确 | 有 (避免耗时操作、异步、缓存) |

### 9.4 MCP扩展性

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **提供商** | Codex (GPT-5.3), Gemini (3-Pro) | Exa AI, Context7, grep.app |
| **作业管理** | 完整工具集 (check/wait/kill/list) | 未明确 |
| **后台模式** | 支持 (最长1小时) | 未明确 |
| **延迟发现** | 需要 ToolSearch | 未明确 |

### 9.5 扩展性对比总结

| 方面 | oh-my-claudecode 优势 | oh-my-opencode 优势 |
|------|---------------------|---------------------|
| **技能扩展** | 命令式调用简单 | 文件系统组织，支持打包 |
| **Hook扩展** | 生命周期分类清晰 | 功能分类，数量更多 |
| **MCP扩展** | 双提供商，完整作业管理 | 多样化MCP服务器 |
| **自定义** | Custom Agents + Team | Plugin System + 技能打包 |

---

## 10. 社区与生态对比

### 10.1 社区规模

| 指标 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **GitHub Stars** | 未公开 | ~9.2K+ |
| **月活跃用户** | 未公开 | 650K+ |
| **开源状态** | MIT许可证 | MIT许可证 |

### 10.2 社区活跃度

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **更新频率** | 未公开 | 快速社区更新 |
| **问题响应** | 未公开 | 快速问题响应 |
| **贡献者** | 未公开 | 活跃社区 |

### 10.3 生态系统

#### oh-my-claudecode

- 基于 Claude Code (Anthropic官方)
- 官方支持和文档
- 企业级支持可用

#### oh-my-opencode

- 基于 OpenCode (开源)
- 社区驱动
- 技能打包和分享生态
- 支持GitHub技能仓库

### 10.4 社区与生态对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **规模** | 未公开数据 | 9.2K+ Stars, 650K+ MAU |
| **支持** | 官方支持 | 社区驱动 |
| **更新** | 未公开 | 快速更新 |
| **生态** | 企业级 | 技能分享生态 |

---

## 11. 文档完善度对比

### 11.1 文档类型

| 文档类型 | oh-my-claudecode | oh-my-opencode |
|----------|------------------|----------------|
| **官方文档** | 有 (Claude Code官方) | 有 (OpenCode文档) |
| **架构文档** | 本报告中有详细分析 | 本报告中有详细分析 |
| **API文档** | 系统提醒中描述 | 源码类型定义 |
| **示例文档** | 未公开 | 未公开 |
| **视频教程** | 未公开 | 未公开 |

### 11.2 文档质量

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **系统性** | 高 (官方维护) | 中 (社区维护) |
| **更新频率** | 高 (官方) | 高 (社区) |
| **详细程度** | 高 | 中 |
| **易读性** | 高 | 中 |

### 11.3 文档完善度对比总结

| 方面 | oh-my-claudecode | oh-my-opencode |
|------|------------------|----------------|
| **官方支持** | 有 | 有 (OpenCode) |
| **系统性** | 高 | 中 |
| **维护** | 官方 | 社区 |
| **质量** | 高 | 中高 |

---

## 12. 总结对比表

### 12.1 完整功能对比矩阵

| 功能维度 | oh-my-claudecode | oh-my-opencode | 优势方 |
|----------|------------------|----------------|--------|
| **Agent系统** |
| - Agent数量 | 28个 | 10+个 | OMC |
| - 分类方式 | 4轨道 (构建/审查/专家/产品) | 3层 (分析/规划/执行) | OMC |
| - 模型路由 | 自动智能 (haiku/sonnet/opus) | 手动配置 | OMC (自动) / OMO (可控) |
| - 编排模式 | Team Pipeline (阶段感知) | Sisyphus (中心化) | 各有优势 |
| **技能系统** |
| - 技能数量 | 37个 | 60+个 | OMO |
| - 技能组织 | 命令式 | 文件系统 | OMO (更灵活) |
| - Token优化 | 未明确 | 三级加载 | OMO |
| - 技能打包 | 未提及 | 支持GitHub | OMO |
| **Hook系统** |
| - Hook数量 | 31个 | 40+个 | OMO |
| - 分类方式 | 生命周期事件 | 功能分类 | 各有优势 |
| - 安全机制 | 严格 (终止开关、过滤) | 未明确 | OMC |
| - 冲突解决 | 未明确 | 优先级机制 | OMO |
| - 开发支持 | 系统提醒 | 类型定义+测试框架 | OMO |
| **执行模式** |
| - 模式数量 | 8个 | 4个 | OMC |
| - 核心模式 | autopilot, ralph, ultrawork, team, pipeline, ultrapilot, plan, ultraqa | autopilot, ralph, ultrawork, ultrapilot | OMC |
| - Team模式 | 有 (阶段感知) | 无 (代理协作) | OMC |
| - Pipeline模式 | 有 | 无 | OMC |
| - Plan模式 | 有 (支持consensus/review) | 集成 | OMC |
| **多模型支持** |
| - 提供商数量 | 1 (Claude) | 60-75+ | OMO |
| - 模型路由 | 自动智能 | 手动配置 | 各有优势 |
| - 成本优化 | 自动 (使用haiku) | 手动 + 免费模型 | OMO |
| - 网络依赖 | 需要 Anthropic | 支持国产模型 | OMO |
| **工具集成** |
| - LSP工具 | 12个详细工具 | 支持 (列表未详细) | OMC |
| - AST工具 | 2个工具, 25种语言 | AST-Grep, 25种语言 | 平手 |
| - Python REPL | 有 | 未明确 | OMC |
| - 会话管理 | Notepad + Project Memory | 会话恢复 + 搜索 | 各有优势 |
| **状态管理** |
| - 存储路径 | 详细定义 | 多级配置 | OMC |
| - 状态工具 | 5个完整工具 | 未明确 | OMC |
| - 会话恢复 | 通过状态管理 | Session Recovery Hook | 各有优势 |
| - 模式链接 | Team + Ralph 链接 | 未明确 | OMC |
| **扩展性** |
| - 技能扩展 | 命令式 | 文件系统+打包 | OMO |
| - Hook扩展 | 生命周期分类 | 功能分类+数量 | OMO |
| - MCP扩展 | 双提供商+作业管理 | 多样化服务器 | 各有优势 |
| - 自定义 | Agents + Team | Plugin System | 各有优势 |
| **社区生态** |
| - GitHub Stars | 未公开 | 9.2K+ | OMO |
| - 月活用户 | 未公开 | 650K+ | OMO |
| - 支持类型 | 官方 | 社区 | OMC |
| - 更新频率 | 未公开 | 快速 | OMO |
| **文档完善度** |
| - 官方文档 | 有 | 有 | 平手 |
| - 系统性 | 高 | 中 | OMC |
| - 维护方式 | 官方 | 社区 | OMC |
| **其他** |
| - 命名主题 | 职能描述 | 希腊神话 | 各有优势 |
| - 开源协议 | MIT | MIT | 平手 |
| - 成本结构 | 订阅依赖 | 完全免费+免费模型 | OMO |

### 12.2 优势总结

#### oh-my-claudecode 核心优势

1. **更完整的Agent系统** - 28个专业代理，4轨道分类
2. **更丰富的执行模式** - 8个模式，包括Team、Pipeline、Plan
3. **Team Pipeline** - 阶段感知代理路由
4. **自动模型路由** - 基于任务复杂度自动选择
5. **完善的工具集成** - 12个LSP工具，完整状态管理
6. **官方支持** - Anthropic官方维护
7. **严格的安全机制** - 终止开关、敏感字段过滤

#### oh-my-opencode 核心优势

1. **多提供商支持** - 60-75+ AI模型
2. **成本优势** - 完全免费 + 免费模型，成本降至1/3
3. **更多技能** - 60+个技能
4. **技能打包共享** - 支持GitHub打包和版本控制
5. **Token优化** - 三级渐进式加载
6. **更多Hook** - 40+个Hook类型
7. **网络灵活性** - 支持国产模型，无连接问题
8. **社区规模** - 9.2K+ Stars, 650K+ MAU

### 12.3 选择建议

#### 选择 oh-my-claudecode 如果

- 需要最完整的Agent生态系统
- 依赖官方支持和维护
- 需要Team模式的阶段感知路由
- 预算充足，订阅不是问题
- 需要严格的安全机制
- 在稳定的网络环境中工作

#### 选择 oh-my-opencode 如果

- 需要支持多个AI提供商
- 关注成本控制
- 网络环境不稳定或需要国产模型
- 需要技能打包和分享
- 偏好社区驱动的快速迭代
- 需要高度可定制的工作流
- 关注数据隐私和本地部署

---

**报告完成**

*注: OMC = oh-my-claudecode, OMO = oh-my-opencode*
