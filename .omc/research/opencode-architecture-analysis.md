# Oh-My-OpenCode 框架架构深度分析报告

**报告日期**: 2026-02-20
**分析人**: analyst-2
**框架版本**: oh-my-opencode (最新版本)

---

## 目录

1. [概述](#1-概述)
2. [核心架构设计](#2-核心架构设计)
3. [多Agent系统详解](#3-多agent系统详解)
4. [技能系统架构](#4-技能系统架构)
5. [Hook系统与扩展机制](#5-hook系统与扩展机制)
6. [多模型支持](#6-多模型支持)
7. [MCP集成](#7-mcp集成)
8. [执行模式](#8-执行模式)
9. [配置系统](#9-配置系统)
10. [技术栈与实现细节](#10-技术栈与实现细节)
11. [与Claude Code的对比](#11-与claude-code的对比)
12. [优势与局限](#12-优势与局限)
13. [适用场景](#13-适用场景)

---

## 1. 概述

### 1.1 项目定位

**oh-my-opencode** 是一个开源的AI编程助手插件编排框架，基于 **OpenCode** 构建。它将单一的AI助手转变为强大的多代理协作系统。

### 1.2 核心数据

| 指标 | 数值 |
|------|------|
| GitHub Stars | ~9.2K+ |
| 月活跃用户 | 650K+ |
| 支持的模型提供商 | 60-75+ |
| 内置技能数量 | 60+ |
| Hook类型数量 | 40+ |
| 开发成本投入 | $24,000 tokens |

### 1.3 设计哲学

框架的核心设计理念是：**复杂问题应由专业化的模块化代理网络协作解决**，而非单一AI模型。这模仿了人类软件团队中架构师、研究人员和工程师的协作方式。

---

## 2. 核心架构设计

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                     用户交互层                                │
│  (CLI Commands, Skills invocation, Natural Language)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Sisyphus 编排层                            │
│  (任务分解、代理协调、状态管理、持续执行)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    专业代理层                                │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │ Oracle   │Librarian │Prometheus│Atlas     │Hephaestus│   │
│  │(架构)    │(文档)    │(规划)    │(执行)    │(工匠)    │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    工具与能力层                               │
│  (MCP Servers, Skills, Hooks, LSP, AST-Grep)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   模型抽象层                                  │
│  (60+ AI Providers: Claude, GPT, Gemini, GLM, etc.)          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心设计原则

1. **专业分工**: 每个代理专注于特定领域
2. **并行执行**: 多代理可同时工作，不阻塞主代理上下文
3. **持久化上下文**: 切换任务时保持上下文
4. **无情完成**: 遇到卡住自动恢复继续执行
5. **非侵入式扩展**: Hook系统无需修改核心代码

---

## 3. 多Agent系统详解

### 3.1 Sisyphus - 主编排代理

**命名来源**: 希腊神话中永恒推石上山的人物

**职责**:
- 任务接收与复杂度分析
- 任务分解为子任务
- 代理协调与调度
- TODO列表管理
- 确保100%任务完成

**推荐模型**: Claude 3.5 Sonnet / Claude Opus 4.5

**源码位置**: `src/agents/orchestrator-sisyphus.ts`, `src/agents/sisyphus.ts`

### 3.2 专业代理矩阵

#### 分析层代理

| 代理名称 | 希腊神话渊源 | 职责 | 推荐模型 |
|----------|--------------|------|----------|
| **Oracle** | 预言神 | 架构设计、深度调试 | GPT-4 / GPT-4 Turbo |
| **Librarian** | 图书守护者 | 文档检索、代码搜索 | Gemini 1.5 Flash/Pro |
| **Explorer** | 探索者 | 快速代码库分析 | Grok / Gemini Flash |

#### 规划层代理

| 代理名称 | 职责 |
|----------|------|
| **Prometheus** | 战略规划、API文档 |
| **Metis** | 规划顾问、预分析 |
| **Momus** | 规划审查、风险识别 |

#### 执行层代理

| 代理名称 | 职责 | 推荐模型 |
|----------|------|----------|
| **Atlas** | 主执行编排器 | Kimi K2.5 Free |
| **Hephaestus** | 深度自主工作者 | Kimi K2.5 Free |
| **Frontend Engineer** | UI/UX开发 | Claude 3 Sonnet / Gemini 3 Pro |
| **Git Master** | 原子化提交 | - |
| **Multimodal Looker** | 多模态观察 | - |

### 3.3 代理协作流程

```
用户任务
    ↓
[Sisyphus] 分析任务复杂度
    ↓
[Prometheus] 创建详细工作计划
    ↓
[Sisyphus] 任务分解为子任务
    ↓
根据任务类型分配给专业代理
    ↓
┌─────────────┬─────────────┬─────────────┐
│  代理A      │  代理B      │  代理C      │
│  (架构分析) │  (文档研究) │  (代码探索) │
└─────────────┴─────────────┴─────────────┘
    ↓ 并行执行
[Atlas/Hephaestus] 主执行阶段
    ↓
结果收集与整合
    ↓
质量保证与测试
    ↓
最终输出
```

---

## 4. 技能系统架构

### 4.1 技能定义

技能是AI代理按照固定工作流执行特定任务的能力单元，类似于可重用的指令手册或可调用函数。

### 4.2 渐进式加载架构

为优化token使用，技能采用三级加载系统：

#### Level 1: 元数据层 (始终加载)
```yaml
# SKILL.md 前言部分
---
name: my-skill
description: 技能描述
trigger_phrases:
  - "关键词1"
  - "关键词2"
---
```
- 包含技能名称、描述、触发短语
- 使用 kebab-case 命名
- 始终加载以确定何时触发技能

#### Level 2: 技能主体 (按需加载)
- 具体指令、步骤、示例、模板
- 仅在Claude确定技能相关时加载
- 包含实际工作流/过程指令

#### Level 3: 关联文件 (按需访问)
- `references/` - 参考文档、API规范
- `scripts/` - 可执行代码 (Python, Shell)
- `assets/` - 模板、图标
- 仅在特定需要时访问

### 4.3 技能目录结构

```
my-skill/
├── SKILL.md       # 必需：核心文件，含元数据和指令
├── scripts/       # 可选：自动化脚本
│   ├── setup.py
│   └── process.sh
├── references/    # 可选：参考文档、API规范
│   ├── api-spec.md
│   └── best-practices.md
└── assets/        # 可选：模板、图标
    ├── template.md
    └── icon.png
```

### 4.4 技能加载位置

OpenCode 从多个位置扫描技能（合并配置，项目本地覆盖全局）：

1. `~/.config/opencode/skills/` (XDG配置位置)
2. `~/.opencode/skills/` (全局技能，项目间共享)
3. `.opencode/skills/` (项目本地技能，覆盖全局)

### 4.5 内置技能示例

| 技能名称 | 功能描述 |
|----------|----------|
| **playwright** | 浏览器自动化 |
| **git-master** | Git操作管理 |
| **docx** | Word文档处理 |
| **pdf** | PDF操作 |
| **xlsx** | Excel处理 |
| **pptx** | PowerPoint创建 |
| **skill-creator** | 元技能，用于生成新技能 |

### 4.6 技能调用方式

1. **自动触发** (推荐): AI根据上下文判断何时使用
2. **手动强制**: 显式调用特定技能
3. **命令方式**: 新版本支持命令调用

---

## 5. Hook系统与扩展机制

### 5.1 Hook系统概述

Hook系统是在AI代理执行的关键节点注入自定义逻辑的机制，允许开发者在不修改核心代码的情况下添加新功能。

**核心设计哲学**: 非侵入式扩展

### 5.2 主要Hook类型

| Hook类型 | 描述 | 源码位置 |
|----------|------|----------|
| **Session Recovery Hook** | 会话中断后自动恢复工作状态 | `src/hooks/session-recovery/index.ts` |
| **Context Window Monitor** | 智能管理AI模型上下文限制 | `src/hooks/context-window-monitor.ts` |
| **Comment Checker Hook** | 自动分析代码注释质量 | `src/hooks/comment-checker/index.ts` |
| **Auto Update Checker** | 自动检查更新 | `src/hooks/auto-update-checker/checker.ts` |

### 5.3 Hook生命周期

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  任务开始     │ →  │  执行前Hook   │ →  │  任务执行     │
└──────────────┘    └──────────────┘    └──────────────┘
                                              ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  执行后Hook   │ ←  │  验证阶段     │ ←  │  结果输出     │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 5.4 配置系统

**多级配置合并** (优先级从高到低):

1. **项目级**: `project-root/.opencode/oh-my-opencode.json`
2. **用户级**: `~/.claude/opencode/oh-my-opencode.json`

核心源码: `src/plugin-config.ts` - `mergeConfigs` 函数实现智能配置合并

### 5.5 创建自定义Hook

#### 步骤1: 理解Hook接口
所有Hook遵循 `src/hooks/types.ts` 中定义的统一接口规范

#### 步骤2: 注册Hook到系统
通过配置管理系统集成Hook

#### 步骤3: 测试与调试
使用内置测试框架确保稳定运行

### 5.6 Hook性能优化最佳实践

**Hook执行效率**:
- 避免在Hook中执行耗时操作
- 适当使用异步处理
- 缓存频繁使用的数据

**内存管理**:
- 及时清理不必要的资源
- 监控Hook内存使用

### 5.7 Hook冲突解决

当多个Hook修改同一资源时，系统提供**优先级机制**来协调执行顺序。

---

## 6. 多模型支持

### 6.1 支持的模型提供商 (60-75+)

#### 主流商业模型
- **Claude**: 全系列版本 (Opus 4.5, Sonnet 4, Haiku 4)
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-4o
- **Gemini**: 1.5 Flash, Gemini Pro, Gemini 3 Pro
- **GitHub Copilot**: 各版本

#### 国产模型
- **OpenCode Zen**
- **Z.ai**
- **GLM**: GLM-4.7 (免费模型)
- **Kimi**: Kimi K2.5 Free
- **MiniMax**: M2.1
- **Grok**: Grok Code Fast-1

#### 其他
- 本地部署模型支持
- 自定义端点支持

### 6.2 模型配置示例

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "hephaestus": {
      "model": "opencode/kimi-k2.5-free"
    },
    "oracle": {
      "model": "opencode/gpt-4"
    },
    "librarian": {
      "model": "opencode/gemini-pro"
    },
    "prometheus": {
      "model": "opencode/claude-opus"
    },
    "atlas": {
      "model": "opencode/kimi-k2.5-free"
    }
  },
  "categories": {
    "visual-engineering": {
      "model": "opencode/glm-4.7-free"
    },
    "ultrabrain": {
      "model": "opencode/glm-4.7-free"
    }
  }
}
```

### 6.3 模型选择策略

**按任务类型选择模型**:
- **架构设计**: GPT-4 / Claude Opus
- **文档查询**: Gemini Flash (速度快)
- **代码执行**: 本地免费模型 (GLM-4.7)
- **UI/UX**: Claude Sonnet / Gemini Pro

**成本优化策略**:
- 用户报告通过混合提供商可将成本降低至Claude Code的1/3
- 免费模型处理简单任务
- 高级模型处理复杂任务

---

## 7. MCP集成

### 7.1 内置MCP服务器

#### 1. **websearch (Exa AI)**
- 实时网络搜索
- 高质量搜索结果与内容提取
- 返回结构化结果（标题、URL、摘要）
- 支持最近搜索结果缓存

#### 2. **Context7**
- 官方文档查询工具
- 支持查询任何库/框架的官方文档
- 需要Upstash API密钥
- 完美查找最新API参考

#### 3. **grep_app**
- 超快速公共GitHub代码仓库搜索
- 查找实现示例的理想选择
- 可配置为远程MCP服务器
- URL: `https://mcp.grep.app`

### 7.2 MCP配置示例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    // 网络搜索
    "fetch": {
      "type": "local",
      "command": ["bun", "x", "fetch-mcp@latest"],
      "enabled": true,
      "timeout": 60000
    },
    // 官方文档查询
    "context7": {
      "type": "local",
      "command": ["bun", "x", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"],
      "enabled": true
    },
    // GitHub代码搜索
    "grepapp": {
      "type": "remote",
      "url": "https://mcp.grep.app",
      "enabled": true
    }
  }
}
```

---

## 8. 执行模式

### 8.1 Autopilot - 全自主执行

**激活关键词**: `"autopilot"`

**特点**:
- 从规划到实现到测试的完全自主执行
- 集成ralph（持久化）、ultrawork（并行）、plan（战略思考）
- 最佳用途：构建完整功能模块或小型应用，最少人工干预

### 8.2 Ralph Loop - 自引用开发循环

**两种协作模式**:

#### 离线Ralph
- 睡前设置任务
- 让其整夜运行
- 早上查看完成的功能

#### 手动Ralph
- 每次运行一个循环
- 手动审查和指导
- 循环间进行迭代

**核心**: 持续迭代 "思考 → 执行 → 验证" 循环，直到任务完全完成

### 8.3 UltraWork (ulw) - 最大性能模式

**激活关键词**: `"ultrawork"` 或 `"ulw"`

**特点**:
- 通过并行实现3-5倍加速
- 自动启用所有高级功能
- 智能提示优化
- 自动模型选择
- 多代理协作模式
- 多个探索和文档代理并行执行
- 持久执行直到100%完成

### 8.4 Ultrapilot

- 并行加速模式
- 提供3-5倍速度提升

### 8.5 可用命令

| 命令 | 功能 |
|------|------|
| `/ralph-loop` | 启动自引用开发循环直到完成 |
| `/ulw-loop` | 启动ultrawork循环模式 |
| `/cancel-ralph` | 取消运行的Ralph循环 |

---

## 9. 配置系统

### 9.1 配置文件层次

#### 1. 用户级配置
**位置**: `~/.config/opencode/oh-my-opencode.json`

#### 2. 项目级配置
**位置**: `project-root/.omc/oh-my-opencode.json` (项目本地覆盖全局)

#### 3. AGENTS.md
项目特定配置文件，帮助OpenCode理解项目结构：
- 项目概述
- 技术栈
- 项目结构/目录布局
- 代码标准
- API规范
- 常用命令
- 重要说明

### 9.2 安装配置

**文件**: `~/.config/opencode/opencode.json`

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "oh-my-opencode@latest"
  ]
}
```

---

## 10. 技术栈与实现细节

### 10.1 核心技术

| 技术 | 用途 |
|------|------|
| **AST (抽象语法树)** | 智能代码重构，而非简单文本替换 |
| **LSP (语言服务器协议)** | 重命名、跳转到定义、查找引用等 |
| **AST-Grep** | 25种语言的AST代码模式搜索和替换 |
| **会话管理** | 跨会话搜索和对话历史能力 |

### 10.2 核心源码结构

```
src/
├── agents/
│   ├── orchestrator-sisyphus.ts    # Sisyphus主编排器
│   ├── sisyphus.ts                  # Sisyphus核心
│   ├── oracle.ts                    # Oracle代理
│   ├── librarian.ts                 # Librarian代理
│   └── ...
├── hooks/
│   ├── session-recovery/            # 会话恢复
│   ├── context-window-monitor.ts    # 上下文窗口监控
│   ├── comment-checker/             # 注释检查
│   └── auto-update-checker/         # 自动更新检查
├── skills/                          # 内置技能
├── plugin-config.ts                 # 配置合并
└── types.ts                         # 类型定义
```

### 10.3 Claude Code兼容性

oh-my-opencode高度兼容Claude Code，以下机制无缝工作：
- Command (命令)
- Agent (代理)
- Skill (技能)
- MCP (模型上下文协议)
- Hook (钩子)

---

## 11. 与Claude Code的对比

### 11.1 核心差异对比表

| 特性 | Claude Code | OpenCode + oh-my-opencode |
|------|-------------|---------------------------|
| **提供商灵活性** | 仅限Anthropic Claude | 75+提供商（Claude, GPT, Gemini, 本地模型等） |
| **成本结构** | 订阅制($17-200/月) | 完全免费开源，提供免费模型 |
| **架构** | 单模型架构 + 子代理 | 多代理编排 (Sisyphus架构) |
| **执行模式** | Ultrathink模式 | Ultrawork模式 + Ralph + Autopilot |
| **上下文窗口** | 200K tokens | 根据模型而定 |
| **代码操作** | 多文件一致编辑 | AST感知代码操作 |
| **特殊功能** | 原生终端与IDE集成 | 会话恢复、LSP开箱即用 |
| **网络访问** | 需要稳定连接到Anthropic | 支持国产模型，无连接问题 |
| **SWE-bench分数** | 72.5% | 数据待补充 |

### 11.2 选择建议

**选择 Claude Code 如果**:
- 想要无忧的开箱即用体验
- 预算不是问题
- 需要最好的代码生成质量
- 在简单的网络环境中工作

**选择 OpenCode + oh-my-opencode 如果**:
- 想要控制AI编程成本
- 需要特定地区的稳定访问
- 偏好开源解决方案
- 想要自定义和扩展功能
- 关注数据隐私和本地部署
- 想要最优地利用多个AI提供商

---

## 12. 优势与局限

### 12.1 优势

1. **成本效益**: 完全免费开源，混合使用可将成本降至Claude Code的1/3
2. **灵活性**: 75+模型提供商支持，可根据任务选择最优模型
3. **专业分工**: 多代理系统，每个代理专注特定领域
4. **并行执行**: 多代理可同时工作，提高效率
5. **网络稳定性**: 支持国产模型，无需担心连接问题
6. **社区活跃**: 快速社区更新和问题响应
7. **隐私保护**: 支持本地部署
8. **可扩展性**: Hook和技能系统高度可扩展
9. **Claude Code兼容**: 完全兼容Claude Code的命令、代理、技能、MCP和Hook

### 12.2 局限

1. **学习曲线**: 初期配置较复杂
2. **配置复杂**: 需要配置多个代理和模型
3. **文档**: 相比官方产品文档较少
4. **支持**: 无官方支持，依赖社区
5. **稳定性**: 作为开源项目，稳定性可能不如商业产品

---

## 13. 适用场景

### 13.1 最适合

- 需要处理复杂重构或功能开发的项目
- 预算有限的个人开发者或小团队
- 网络环境不稳定地区的开发者
- 需要高度定制化的工作流
- 关注数据隐私的企业
- 需要使用特定国产模型的场景

### 13.2 不太适合

- 追求即插即用的初学者
- 预算充足且追求最佳体验的用户
- 需要官方支持的企业环境

---

## 14. 安装与使用

### 14.1 快速安装

```bash
# 步骤1: 安装OpenCode
curl -sSL https://opencode.ai/install | bash

# 步骤2: 安装Oh-My-OpenCode插件
bunx oh-my-opencode install
# 或
npm install -g oh-my-opencode

# 步骤3: 启动
opencode --agent sisyphus
```

### 14.2 使用方式

#### 1. Lazy模式
在提示中添加 `ultrawork` 或 `ulw`
```
帮我 ulw 重构这个模块
```

#### 2. 指定模式
按Tab切换到特定代理 (如Prometheus)

#### 3. 自定义配置
编辑 `oh-my-opencode.json` 自定义：
- 每代理模型选择
- 启用/禁用特定技能
- 配置MCP服务器

---

## 15. 结论

oh-my-opencode是一个强大而灵活的AI编程助手框架，通过其多代理架构、技能系统、Hook系统和MCP集成，为开发者提供了高度可定制和可扩展的AI辅助编程体验。

其最大的优势在于：
1. **开源免费** - 无订阅费用
2. **模型灵活性** - 支持75+提供商
3. **成本优化** - 混合使用可大幅降低成本
4. **网络稳定性** - 支持国产模型
5. **社区驱动** - 快速迭代和响应

对于预算有限、需要定制化、或网络环境受限的开发者，oh-my-opencode是一个值得深入探索的优秀选择。

---

## 附录

### A. 参考资源

- [GitHub仓库](https://github.com/code-yeongyu/oh-my-opencode)
- [官方文档](https://opencode.ai/docs)
- [Schema定义](https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json)

### B. 相关技术

- OpenCode
- Claude Code
- Model Context Protocol (MCP)
- Language Server Protocol (LSP)
- Abstract Syntax Tree (AST)

---

**报告完成**
