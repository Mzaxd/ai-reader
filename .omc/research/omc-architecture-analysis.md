# oh-my-claudecode 框架深度架构分析报告

**分析日期**: 2026-02-20
**框架版本**: 4.2.12
**分析者**: analyst-1

---

## 执行摘要

oh-my-claudecode (OMC) 是一个专为 Claude Code 设计的智能多代理编排层，通过专业化代理、工具和技能的协调来提高代码任务的准确性和效率。本报告深入分析了框架的 8 大核心系统。

---

## 一、Agent 系统 - 28 个专业代理

### 1.1 代理分类架构

#### **构建/分析轨道 (Build/Analysis Lane)**
| 代理 | 模型 | 职责 | 使用场景 |
|------|------|------|----------|
| `explore` | haiku | 内部代码库发现、符号/文件映射 | 快速代码导航、结构理解 |
| `analyst` | opus | 需求清晰度、验收标准、隐藏约束 | 需求分析、可行性评估 |
| `planner` | opus | 任务排序、执行计划、风险标识 | 架构规划、技术选型 |
| `architect` | opus | 系统设计、边界定义、接口设计 | 长期权衡、架构决策 |
| `debugger` | sonnet | 根因分析、回归隔离、故障诊断 | Bug 调试、问题定位 |
| `executor` | sonnet | 代码实现、重构、功能开发 | 标准开发任务 |
| `deep-executor` | opus | 复杂自主目标导向任务 | 复杂系统级开发 |
| `verifier` | sonnet | 完成证据、声明验证、测试充分性 | 验证工作完成度 |

#### **审查轨道 (Review Lane)**
| 代理 | 模型 | 职责 |
|------|------|------|
| `style-reviewer` | haiku | 格式、命名、惯例、lint 规范 |
| `quality-reviewer` | sonnet | 逻辑缺陷、可维护性、反模式 |
| `api-reviewer` | sonnet | API 契约、版本控制、向后兼容性 |
| `security-reviewer` | sonnet | 漏洞、信任边界、认证/授权 |
| `performance-reviewer` | sonnet | 热点、复杂度、内存/延迟优化 |
| `code-reviewer` | opus | 跨关注点的综合审查 |

#### **领域专家 (Domain Specialists)**
| 代理 | 模型 | 职责 |
|------|------|------|
| `dependency-expert` | sonnet | 外部 SDK/API/包评估 |
| `test-engineer` | sonnet | 测试策略、覆盖率、flaky-test 硬化 |
| `quality-strategist` | sonnet | 质量策略、发布准备度、风险评估 |
| `build-fixer` | sonnet | 构建/工具链/类型失败修复 |
| `designer` | sonnet | UX/UI 架构、交互设计 |
| `writer` | haiku | 文档、迁移说明、用户指南 |
| `qa-tester` | sonnet | 交互式 CLI/服务运行时验证 |
| `scientist` | sonnet | 数据/统计分析 |
| `document-specialist` | sonnet | 外部文档和参考查找 |
| `git-master` | sonnet | 提交策略、历史卫生 |

#### **产品轨道 (Product Lane)**
| 代理 | 模型 | 职责 |
|------|------|------|
| `product-manager` | sonnet | 问题框架、人物画像/JTBD、PRD |
| `ux-researcher` | sonnet | 启发式审计、可用性、可访问性 |
| `information-architect` | sonnet | 分类法、导航、可查找性 |
| `product-analyst` | sonnet | 产品指标、漏斗分析、实验 |

#### **协调代理 (Coordination)**
| 代理 | 模型 | 职责 |
|------|------|------|
| `critic` | opus | 计划/设计的批判性质疑 |
| `vision` | sonnet | 图像/截图/图表分析 |

### 1.2 代理编排模式

**推荐工作流组合:**

```
功能开发: analyst → planner → executor → test-engineer → quality-reviewer → verifier

Bug 调查: explore + debugger + executor + test-engineer + verifier

代码审查: style-reviewer + quality-reviewer + api-reviewer + security-reviewer

产品发现: product-manager + ux-researcher + product-analyst + designer

功能规格: product-manager → analyst → information-architect → planner → executor

UX 审计: ux-researcher + information-architect + designer + product-analyst
```

---

## 二、Skills 系统 - 37 个技能

### 2.1 工作流技能 (Workflow Skills)

| 技能 | 触发关键词 | 功能描述 |
|------|-----------|----------|
| `autopilot` | "autopilot", "build me", "I want a" | 全自主执行从想法到工作代码 |
| `ralph` | "ralph", "don't stop", "must complete" | 自我引用循环，带验证器验证 |
| `ultrawork` | "ulw", "ultrawork" | 最大并行度并行代理编排 |
| `swarm` | "swarm" | Team 的兼容性门面 |
| `ultrapilot` | "ultrapilot", "parallel build" | 兼容性门面，映射到 Team |
| `team` | "team", "coordinated team", "team ralph" | N 个协调代理使用 Claude Code 原生团队 |
| `pipeline` | "pipeline", "chain agents" | 顺序代理链与数据传递 |
| `ultraqa` | (autopilot 激活) | QA 循环 - 测试、验证、修复、重复 |
| `plan` | "plan this", "plan the" | 战略规划，支持 --consensus 和 --review |
| `ralplan` | "ralplan", "consensus plan" | /plan --consensus 的别名 |
| `sciomc` | "sciomc" | 并行科学家代理的综合分析 |
| `external-context` | (自动检测) | 并行 document-specialist 代理的网络搜索 |
| `deepinit` | "deepinit" | 深度代码库初始化与层次化 AGENTS.md |

### 2.2 代理快捷方式 (Agent Shortcuts)

| 技能 | 映射代理 | 触发关键词 |
|------|---------|-----------|
| `analyze` | debugger | "analyze", "debug", "investigate" |
| `deepsearch` | explore | "search", "find in codebase" |
| `tdd` | test-engineer | "tdd", "test first", "red green" |
| `build-fix` | build-fixer | "fix build", "type errors" |
| `code-review` | code-reviewer | "review code" |
| `security-review` | security-reviewer | "security review" |
| `frontend-ui-ux` | designer | UI/组件/样式工作 (自动) |
| `git-master` | git-master | git/commit 工作 (自动) |
| `review` | plan --review | "review plan", "critique plan" |

### 2.3 MCP 委托 (MCP Delegation)

| 技能 | 触发短语 | 目标 |
|------|---------|------|
| `ask codex` | "ask codex", "use codex" | MCP ask_codex |
| `ask gpt` | "ask gpt", "use gpt" | MCP ask_codex |
| `ask gemini` | "ask gemini", "use gemini" | MCP ask_gemini |

### 2.4 实用工具 (Utilities)

`configure-discord`, `configure-telegram`, `cancel`, `note`, `learner`, `omc-setup`, `mcp-setup`, `hud`, `omc-doctor`, `omc-help`, `trace`, `release`, `project-session-manager`, `skill`, `writer-memory`, `ralph-init`, `learn-about-omc`

---

## 三、Hooks 系统 - 31 个钩子

### 3.1 钩子类型分类

**会话管理钩子:**
- `session-start`: 会话启动初始化
- `session-end`: 会话结束清理与持久化

**工具执行钩子:**
- `PreToolUse`: 工具调用前的上下文注入
- `PostToolUse`: 工具调用后的结果处理

**代理生命周期钩子:**
- `SubagentStart`: 代理启动时注入角色和协议
- `SubagentComplete`: 代理完成时的结果验证

**任务管理钩子:**
- `permission-request`: 权限请求处理
- `task-creation`: 任务创建时的元数据注入
- `task-completion`: 任务完成时的验证

**状态管理钩子:**
- `state-read`: 状态读取访问控制
- `state-write`: 状态写入验证与持久化

**特殊功能钩子:**
- `setup`: 框架初始化配置
- `cancel`: 执行模式取消
- `error-handler`: 错误捕获与恢复

### 3.2 钩子运行时保证

1. **输入格式**: 钩子输入使用 snake_case 字段
2. **终止开关**:
   - `DISABLE_OMC`: 禁用所有钩子
   - `OMC_SKIP_HOOKS`: 跳过特定钩子
3. **敏感字段过滤**: permission-request、setup、session-end 通过严格允许列表过滤
4. **必需键验证**: 每种钩子事件类型有特定的必需键验证

---

## 四、LSP/AST 工具集成

### 4.1 LSP (Language Server Protocol) 工具

| 工具 | 功能 | 使用场景 |
|------|------|----------|
| `lsp_hover` | 悬停信息 | 快速查看符号定义 |
| `lsp_goto_definition` | 跳转到定义 | 导航到符号声明 |
| `lsp_find_references` | 查找引用 | 追踪符号使用 |
| `lsp_document_symbols` | 文档符号 | 分析文件结构 |
| `lsp_workspace_symbols` | 工作区符号 | 跨文件符号搜索 |
| `lsp_diagnostics` | 诊断信息 | 错误和警告检查 |
| `lsp_diagnostics_directory` | 目录诊断 | 批量代码质量检查 |
| `lsp_prepare_rename` | 准备重命名 | 安全重命名预检 |
| `lsp_rename` | 符号重命名 | 智能重构 |
| `lsp_code_actions` | 代码操作 | 可用的重构建议 |
| `lsp_code_action_resolve` | 解析代码操作 | 执行重构 |
| `lsp_servers` | LSP 服务器管理 | 管理语言服务器 |

### 4.2 AST (Abstract Syntax Tree) 工具

| 工具 | 功能 | 使用场景 |
|------|------|----------|
| `ast_grep_search` | 结构化代码模式搜索 | 精确匹配代码结构模式 |
| `ast_grep_replace` | 结构化转换 | 批量语法级重构 |

### 4.3 Python REPL

| 工具 | 功能 | 使用场景 |
|------|------|----------|
| `python_repl` | 持久 Python REPL | 数据分析、实验性代码 |

---

## 五、执行模式系统

### 5.1 核心执行模式

#### **Autopilot (自动驾驶)**
- **触发**: "autopilot", "build me", "I want a"
- **特点**: 全自主执行，从想法到工作代码
- **转换**: 可过渡到 ralph 或 ultraqa
- **互斥**: 与 ultrapilot 互斥

#### **Ralph (持久循环)**
- **触发**: "ralph", "don't stop", "must complete"
- **特点**: 自我引用循环，包含 ultrawork
- **持久化**: 包装器提供持久性
- **组合**: 支持 `team ralph` 组合执行

#### **Ultrawork (极致并行)**
- **触发**: "ulw", "ultrawork"
- **特点**: 最大并行度，并行代理编排
- **优先级**: 显式模式关键词覆盖默认配置

#### **Team (团队协作)**
- **触发**: "team", "coordinated team"
- **特点**: N 个协调代理，使用 Claude Code 原生团队
- **阶段感知**: 代理路由基于阶段感知

#### **Pipeline (流水线)**
- **触发**: "pipeline", "chain agents"
- **特点**: 顺序代理链与数据传递

#### **Ultrapilot (并行驾驶)**
- **触发**: "ultrapilot", "parallel build"
- **特点**: 兼容性门面，映射到 Team 的阶段运行时

#### **Plan (规划)**
- **触发**: "plan this", "plan the"
- **特点**: 战略规划
- **模式**: 支持 --consensus 和 --review 模式

#### **UltraQA (质量保证)**
- **激活**: 由 autopilot 激活
- **特点**: QA 循环 - 测试、验证、修复、重复

### 5.2 执行模式冲突解决

- **显式关键词** (`ulw`, `ultrawork`) 覆盖默认配置
- **通用关键词** ("fast", "parallel") 读取 `~/.claude/.omc-config.json` 中的 `defaultExecutionMode`
- **Ralph 包含** ultrawork（持久化包装器）
- **Autopilot 与 Ultrapilot 互斥**

---

## 六、状态管理机制

### 6.1 状态存储路径

```
{worktree}/.omc/state/
├── {mode}-state.json              # 模式状态文件
└── sessions/
    └── {sessionId}/
        ├── {mode}-state.json      # 会话作用域状态
        └── ...
```

**关键路径:**
- 工作树根目录: `{worktree}` (非 `~/.claude/`)
- 模式状态: `.omc/state/{mode}-state.json`
- 会话状态: `.omc/state/sessions/{sessionId}/`
- 后备: `.omc/state/{mode}-state.json` (当会话 ID 不可用时)

### 6.2 支持的模式

`autopilot`, `ultrapilot`, `team`, `pipeline`, `ralph`, `ultrawork`, `ultraqa`

### 6.3 状态持久化工具

| 工具 | 功能 |
|------|------|
| `state_read` | 读取状态 |
| `state_write` | 写入状态 |
| `state_clear` | 清除状态 |
| `state_list_active` | 列出活动状态 |
| `state_get_status` | 获取状态状态 |

### 6.4 Team 状态管理

Team 通过 `state_write(mode="team")` 写入状态，跟踪:

- `current_phase`: 当前阶段
- `team_name`: 团队名称
- `fix_loop_count`: 修复循环计数
- `linked_ralph`: 链接的 ralph 状态
- `stage_history`: 阶段历史

### 6.5 Ralph 与 Team 组合

当检测到 `team` 和 `ralph` 关键词时:
- Team 提供多代理编排
- Ralph 提供持久循环
- 两者写入链接的状态文件 (`linked_team`/`linked_ralph`)
- 取消任一模式会同时取消两者

---

## 七、MCP 集成系统

### 7.1 MCP 提供商

#### **Codex (OpenAI GPT-5.3-Codex)**
- **工具**: `mcp__x__ask_codex`
- **优势**: 架构审查、规划验证、批判性分析、代码审查、安全审查、测试策略
- **推荐角色**: architect, planner, critic, analyst, code-reviewer, security-reviewer, tdd-guide

#### **Gemini (Google Gemini-3-Pro-Preview)**
- **工具**: `mcp__g__ask_gemini`
- **优势**: UI/UX 设计审查、文档、视觉分析、大上下文任务 (1M tokens)
- **推荐角色**: designer, writer, vision

### 7.2 MCP 作业管理

**每个提供商的作业管理工具:**
- `check_job_status`: 检查作业状态
- `wait_for_job`: 等待作业完成 (最长 1 小时)
- `kill_job`: 终止作业
- `list_jobs`: 列出所有作业

### 7.3 MCP 路由策略

**优先级规则:**
1. 对于只读分析任务，优先使用 MCP 工具而非启动 Claude 代理
2. **延迟工具发现**: MCP 工具在会话开始时不在工具列表中
   - 首次使用前必须调用 `ToolSearch` 发现工具
   - `ToolSearch("mcp")` 发现所有 MCP 工具 (推荐，早期执行一次)
   - `ToolSearch("ask_codex")` 发现特定 Codex 工具
   - `ToolSearch("ask_gemini")` 发现特定 Gemini 工具
3. 如果 ToolSearch 无结果，MCP 服务器未配置 - 回退到等效的 Claude 代理
4. **绝不阻塞**: 在不可用的 MCP 工具上永不阻塞

### 7.4 MCP 后台模式

**模式**: `spawn with background: true`
**工作流**:
1. 使用 `background: true` 生成
2. 使用 `check_job_status` 检查
3. 使用 `wait_for_job` 等待 (最长 1 小时)

### 7.5 MCP 输出处理

- MCP 输出包装为非信任内容
- 响应文件应用输出安全约束
- 验证 (测试、类型检查) 应来自使用工具的代理

### 7.6 无 MCP 替换的代理

这些代理需要 Claude 的工具访问，无 MCP 替换:
- `executor`, `deep-executor`, `explore`, `debugger`, `verifier`
- `dependency-expert`, `scientist`, `build-fixer`, `qa-tester`, `git-master`
- 所有审查轨道代理
- 所有产品轨道代理

### 7.7 文档查找优先级

对于文档查找:
1. 首先尝试 MCP 工具 (更快/更便宜)
2. 对于合成、评估或外部包的实现指南，使用 `dependency-expert`

---

## 八、会话内存与记忆系统

### 8.1 Notepad (会话记忆)

**路径**: `{worktree}/.omc/notepad.md`

| 工具 | 功能 | 说明 |
|------|------|------|
| `notepad_read` | 读取记事本 | 节: all/priority/working/manual |
| `notepad_write_priority` | 写入优先级 | 最大 500 字符，会话开始时加载 |
| `notepad_write_working` | 写入工作 | 时间戳，7 天后自动修剪 |
| `notepad_write_manual` | 手动写入 | 永久，永不自动修剪 |
| `notepad_prune` | 修剪 | 清理旧条目 |
| `notepad_stats` | 统计 | 获取记事本统计信息 |

### 8.2 Project Memory (项目记忆)

**路径**: `{worktree}/.omc/project-memory.json` (持久化)

| 工具 | 功能 | 说明 |
|------|------|------|
| `project_memory_read` | 读取项目记忆 | 节: techStack/build/conventions/structure/notes/directives |
| `project_memory_write` | 写入项目记忆 | 支持合并 |
| `project_memory_add_note` | 添加笔记 | 添加项目笔记 |
| `project_memory_add_directive` | 添加指令 | 添加项目指令 |

### 8.3 上下文持久化

**`<remember>` 标签:**
- `<remember>info</remember>`: 持久 7 天
- `<remember priority>info</remember>`: 永久持久化

---

## 九、Team Pipeline (团队流水线)

### 9.1 标准阶段

```
team-plan → team-prd → team-exec → team-verify → team-fix (循环)
```

### 9.2 阶段代理路由

**每个阶段使用专业化代理 (不仅仅是 executor):**

| 阶段 | 代理 | 职责 |
|------|------|------|
| `team-plan` | explore (haiku) + planner (opus) | 代码库发现 + 规划 |
| `team-prd` | analyst (opus) | 需求分析，可选 product-manager/critic |
| `team-exec` | executor (sonnet) + 专家 | 实现，可选 designer/build-fixer/writer/test-engineer |
| `team-verify` | verifier (sonnet) + 专家 | 验证，可选 security-reviewer/code-reviewer |
| `team-fix` | 根据缺陷类型 | executor/build-fixer/debugger |

### 9.3 阶段转换

- `team-plan` → `team-prd`: 规划/分解完成
- `team-prd` → `team-exec`: 验收标准和范围明确
- `team-exec` → `team-verify`: 所有执行任务达到终止状态
- `team-verify` → `team-fix` | `complete` | `failed`: 验证决定下一步
- `team-fix` → `team-exec` | `team-verify` | `complete` | `failed`: 修复反馈到执行、重新验证或终止

**终止状态**: `complete`, `failed`, `cancelled`

### 9.4 Fix 循环边界

`team-fix` 循环由最大尝试次数限制; 超过边界转换到 `failed`

---

## 十、优势分析

### 10.1 架构设计优势

1. **高度模块化**: 28 个专业代理各司其职，职责清晰
2. **灵活编排**: 支持多种执行模式，从简单到复杂场景全覆盖
3. **智能路由**: 基于任务复杂度自动选择合适的模型 (haiku/sonnet/opus)
4. **阶段感知**: Team pipeline 的阶段感知代理路由确保每个阶段使用最合适的专家

### 10.2 工程实践优势

1. **验证驱动**: 强调验证后再声明完成，避免假阳性
2. **并行优先**: 独立任务并行执行，提高效率
3. **状态持久化**: 完善的状态管理机制，支持会话恢复
4. **错误恢复**: 钩子系统和错误处理确保健壮性

### 10.3 扩展性优势

1. **MCP 集成**: 外部 AI 服务扩展能力
2. **LSP/AST 集成**: 深度代码理解和结构化操作
3. **技能系统**: 37 个技能覆盖常见工作流
4. **代理目录**: 清晰的代理分类和工作流组合

---

## 十一、劣势与改进建议

### 11.1 复杂性

**问题**:
- 28 个代理、37 个技能、31 个钩子形成高学习曲线
- 新用户可能难以理解何时使用哪个代理

**建议**:
- 增强智能推荐系统，自动选择最合适的代理
- 提供交互式帮助和示例库
- 简化常用工作流的入口点

### 11.2 状态管理复杂度

**问题**:
- 多个状态文件 (模式状态、会话状态、链接状态)
- 状态同步和一致性挑战

**建议**:
- 统一状态管理接口
- 增加状态可视化工具
- 实现状态冲突检测和解决机制

### 11.3 MCP 依赖性

**问题**:
- MCP 服务器未配置时需要回退
- 延迟工具发现增加使用复杂度

**建议**:
- 提供 MCP 配置向导
- 实现自动发现和缓存
- 优化回退机制

### 11.4 调试难度

**问题**:
- 多代理并行执行难以追踪问题
- 钩子系统的副作用可能难以定位

**建议**:
- 增强调试日志和追踪
- 提供执行可视化工具
- 实现钩子影响分析

---

## 十二、设计亮点

### 12.1 阶段感知代理路由

Team pipeline 不仅串行化代理执行，还根据阶段特性动态选择最合适的代理组合。这种设计确保了每个阶段都有领域专家参与，而非通用的 executor。

### 12.2 模型路由策略

基于任务复杂度自动选择模型 (haiku/sonnet/opus) 的策略优化了成本与质量的平衡:
- **haiku**: 快速查找、轻量扫描
- **sonnet**: 标准实现、调试、审查
- **opus**: 架构、深度分析、复杂重构

### 12.3 验证循环

Ralph 模式的自我引用循环带验证器验证的设计确保了工作不会在未验证的情况下声明完成，这是质量保证的关键机制。

### 12.4 MCP 双提供商策略

Codex 和 Gemini 的互补优势 (架构审查 vs UI/UX 设计) 提供了全面的外部 AI 能力，同时后台模式和长时间等待 (最长 1 小时) 支持复杂任务。

### 12.5 工作树持久化

所有状态存储在工作树根目录 (`.omc/`) 而非 `~/.claude/`，确保了项目级别的状态隔离和可移植性。

### 12.6 钩子运行时保证

严格的字段验证、敏感字段过滤和终止开关机制确保了钩子系统的安全性和可控性。

---

## 十三、适用场景建议

### 13.1 最佳场景

- **大型重构**: 跨多文件的复杂变更
- **架构设计**: 需要多专家参与的系统设计
- **代码审查**: 全面的多维度代码质量评估
- **产品开发**: 从需求到实现的完整流程
- **Bug 调查**: 复杂问题的根因分析

### 13.2 谨慎使用场景

- **简单修改**: 单文件小改动 (直接编辑更高效)
- **快速原型**: 需要快速迭代的场景
- **学习阶段**: 新用户熟悉框架时

---

## 十四、总结

oh-my-claudecode 是一个设计精良的多代理编排框架，通过专业化代理、智能路由和验证驱动的执行模式，显著提升了 Claude Code 的代码任务处理能力。框架的高度模块化和扩展性使其能够适应从简单到复杂的各种场景。

**核心优势**: 智能代理编排、验证驱动质量保证、灵活的执行模式

**主要挑战**: 学习曲线、状态管理复杂度、调试难度

**推荐策略**: 对于新项目或复杂任务，充分利用 Team 模式的阶段感知代理路由; 对于快速迭代，使用 Autopilot 或简单代理直接执行。

---

**报告生成时间**: 2026-02-20
**分析框架版本**: oh-my-claudecode v4.2.12
