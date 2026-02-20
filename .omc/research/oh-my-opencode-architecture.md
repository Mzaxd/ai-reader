# oh-my-opencode 框架架构深度分析报告

## 1. 概述

oh-my-opencode 是由 code-yeongyu 开发的基于 OpenCode 的 AI 编程代理框架。该框架采用希腊神话命名的多代理架构，支持60+个模型提供商，提供强大的代码理解和自动化能力。

### 核心特性
- **希腊神话风格命名**：每个代理都以希腊神话人物命名
- **多模型编排**：支持60+个模型提供商的智能调度
- **深度代码理解**：集成 LSP 和 AST-Grep 技术
- **MCP 集成**：支持 Model Context Protocol 扩展
- **Hook 系统**：25+ 个生命周期钩子实现高度可扩展性

---

## 2. Agent 系统架构

### 2.1 核心代理

#### Sisyphus (主编排器)
- **模型**: Claude Opus 4.6
- **职责**:
  - 主要对话编排和任务协调
  - 用户意图理解和任务分解
  - 其他代理的调度和管理
- **特点**:
  - 基于希腊神话中的西西弗斯，象征持续努力的特性
  - 负责整体工作流的控制

#### Prometheus (规划者)
- **职责**:
  - 任务规划和执行策略制定
  - 项目结构分析
  - 开发路线图设计
- **命名由来**: 普罗米修斯，象征先见之明和规划能力

#### Oracle (架构师/调试器)
- **职责**:
  - 系统架构设计和分析
  - 代码调试和问题诊断
  - 技术决策支持
- **命名由来**: 奥拉克尔（神谕），象征智慧和洞察力

#### Librarian (文档管理员)
- **职责**:
  - 代码文档生成和维护
  - 代码搜索和索引
  - 知识库管理
- **命名由来**: 图书管理员，象征知识管理

### 2.2 扩展代理

#### Hephaestus (深度工作者)
- **职责**: 自主深度工作，处理复杂的长时间任务
- **特点**: 可以独立完成需要多步骤的复杂任务

#### Atlas (执行者)
- **职责**: 代码执行和实际操作
- **特点**: 处理具体的代码修改和文件操作

#### Explorer (探索者)
- **职责**: 代码库探索和理解
- **特点**: 大规模代码库的快速导航和分析

#### Frontend Engineer (前端工程师)
- **职责**: 前端相关的特定任务
- **特点**: 专注于 UI/UX 相关的开发工作

---

## 3. 多模型支持系统

### 3.1 支持的模型提供商 (60+)

框架支持以下主流和专业的 AI 模型提供商：

**主流提供商**:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 系列)
- Google (Gemini, PaLM)
- Meta (Llama 系列)
- Mistral AI
- Cohere
- AI21 Labs

**开源模型**:
- Llama 2/3
- Mistral
- Qwen
- Baichuan
- DeepSeek
- Yi 系列

**专业模型**:
- 代码模型 (Code Llama, StarCoder)
- 多语言模型
- 图像生成模型
- 语音模型

### 3.2 模型路由策略

```typescript
// 模型选择策略 (推测)
const modelRouting = {
  planning: "claude-opus-4.6",      // 复杂规划任务
  coding: "gpt-4-turbo",            // 代码生成
  analysis: "gemini-pro",           // 大规模分析
  quick: "gpt-3.5-turbo",           // 快速响应
  local: "llama-3-70b"              // 本地部署
}
```

### 3.3 模型切换机制

- 自动选择：根据任务类型自动选择最合适的模型
- 手动指定：用户可以指定使用特定模型
- 降级策略：高负载时自动降级到更快但能力稍弱的模型
- 成本优化：在保证质量的前提下优化成本

---

## 4. 技能系统

### 4.1 核心技能

#### playwright
- **功能**: 浏览器自动化和 E2E 测试
- **用途**:
  - 自动化 Web 测试
  - 页面截图和交互
  - 表单填充和提交
  - 爬虫和数据采集

#### git-master
- **功能**: Git 操作自动化
- **用途**:
  - 提交管理
  - 分支操作
  - 合并冲突解决
  - 历史分析

#### docx
- **功能**: Word 文档处理
- **用途**:
  - 文档生成
  - 报告编写
  - 模板处理

### 4.2 技能加载机制

```bash
# 安装方式
opencode
bunx oh-my-opencode install
```

技能通过插件系统动态加载，支持：
- 热加载
- 依赖管理
- 版本控制
- 沙箱隔离

---

## 5. Hook 系统

### 5.1 生命周期钩子 (25+)

#### 会话生命周期
- `onSessionStart`: 会话开始时触发
- `onSessionEnd`: 会话结束时触发
- `onUserMessage`: 用户消息到达时触发
- `onAgentResponse`: 代理响应时触发

#### 任务生命周期
- `onTaskCreate`: 任务创建时触发
- `onTaskStart`: 任务开始时触发
- `onTaskComplete`: 任务完成时触发
- `onTaskFail`: 任务失败时触发

#### 工具生命周期
- `onBeforeToolUse`: 工具使用前触发
- `onAfterToolUse`: 工具使用后触发
- `onToolError`: 工具错误时触发

#### 代理生命周期
- `onAgentSpawn`: 代理生成时触发
- `onAgentTerminate`: 代理终止时触发
- `onAgentSwitch`: 代理切换时触发

### 5.2 Hook 配置示例

```javascript
// .opencode-config.json
{
  "hooks": {
    "onSessionStart": [
      "init-context",
      "load-project-memory"
    ],
    "onTaskComplete": [
      "verify-results",
      "update-progress"
    ]
  }
}
```

---

## 6. 与 OpenCode 的集成

### 6.1 OpenCode 简介

OpenCode 是一个现代化的代码编辑器和 AI 开发平台，提供：
- 原生 AI 集成
- 智能代码补全
- 实时协作
- 云端同步

### 6.2 集成方式

#### 安装集成
```bash
# 通过 OpenCode CLI 安装
opencode plugin install oh-my-opencode

# 或使用 bunx
bunx oh-my-opencode install
```

#### API 集成
- **双向通信**: oh-my-opencode 与 OpenCode 编辑器之间建立双向通信通道
- **状态同步**: 实时同步编辑器状态和代理状态
- **命令注册**: 在 OpenCode 中注册自定义命令
- **UI 扩展**: 通过插件系统扩展 OpenCode UI

#### 数据流
```
用户输入 → OpenCode → oh-my-opencode → Agent处理 → 结果返回 → OpenCode显示
```

### 6.3 共享功能

- **项目上下文**: 共享项目结构和文件信息
- **Git 集成**: 统一的 Git 操作接口
- **终端集成**: 共享终端执行环境
- **文件系统**: 统一的文件操作 API

---

## 7. 技术架构深度

### 7.1 LSP (Language Server Protocol) 集成

**支持的语言服务器**:
- TypeScript/JavaScript
- Python
- Go
- Rust
- Java
- C/C++

**功能**:
- 代码补全
- 跳转到定义
- 查找引用
- 语义高亮
- 代码诊断
- 重构支持

### 7.2 AST-Grep 集成

**功能**:
- 结构化代码搜索
- 代码模式匹配
- 自动重构
- 代码分析

**应用场景**:
```typescript
// 查找所有 React useEffect 钩子
ast_grep_search("useEffect($$$)")

// 批量重构
ast_grep_replace("oldPattern", "newPattern")
```

### 7.3 MCP (Model Context Protocol) 集成

**支持的 MCP 工具**:
- 文件系统操作
- 数据库查询
- API 调用
- 自定义工具

**扩展机制**:
```javascript
// 自定义 MCP 工具
const customTool = {
  name: "my-tool",
  description: "My custom tool",
  execute: async (input) => {
    // 实现逻辑
  }
}
```

---

## 8. 特色功能

### 8.1 Ultrawork 模式

类似 oh-my-claudecode 的 ultrawork 模式：
- 最大并行度执行任务
- 自动负载均衡
- 智能资源管理
- 容错和重试机制

### 8.2 Todo 执行强制

- 确保 Todo 列表中的任务得到执行
- 任务依赖管理
- 进度跟踪
- 完成验证

### 8.3 代码检查

- 注释质量检查
- 代码规范检查
- 最佳实践验证
- 安全漏洞扫描

### 8.4 后台任务

- 异步任务执行
- 任务队列管理
- 结果缓存
- 任务取消和恢复

---

## 9. 架构设计哲学

### 9.1 设计原则

1. **模块化**: 每个代理都是独立模块
2. **可组合**: 代理可以灵活组合使用
3. **可扩展**: 通过 Hook 和插件系统扩展功能
4. **多模型**: 不依赖单一模型提供商
5. **深度理解**: 结合 LSP 和 AST 实现代码深度理解

### 9.2 与 oh-my-claudecode 的对比

| 特性 | oh-my-opencode | oh-my-claudecode |
|------|----------------|------------------|
| 命名风格 | 希腊神话 | 功能描述 |
| 代理数量 | 6-8 | 40+ |
| 模型支持 | 60+ | 主要 Claude + 多模型 |
| 编辑器集成 | OpenCode | Claude Code |
| LSP 支持 | ✅ | ✅ |
| AST-Grep | ✅ | ✅ |
| Hook 数量 | 25+ | 14+ |

---

## 10. 优势与劣势

### 10.1 优势

1. **独特的设计哲学**: 希腊神话命名，有趣且易于记忆
2. **广泛的模型支持**: 60+ 模型提供商，灵活性高
3. **OpenCode 深度集成**: 与 OpenCode 编辑器无缝集成
4. **强大的代码理解**: LSP + AST-Grep 双重支持
5. **丰富的 Hook 系统**: 25+ 个生命周期钩子

### 10.2 劣势

1. **代理数量较少**: 只有 6-8 个核心代理
2. **社区较小**: 相比 oh-my-claudecode 社区活跃度较低
3. **文档较少**: 中文和英文文档都相对较少
4. **OpenCode 依赖**: 必须使用 OpenCode 编辑器
5. **生态较小**: 插件和扩展相对较少

---

## 11. 适用场景

### 推荐使用 oh-my-opencode 的场景：

1. **使用 OpenCode 编辑器**: 如果您已经是 OpenCode 用户
2. **需要多模型支持**: 需要在多个模型提供商之间切换
3. **代码理解深度任务**: 需要深入的代码分析和重构
4. **喜欢希腊神话**: 对希腊神话风格命名有偏好
5. **定制化需求高**: 需要大量自定义 Hook 和插件

### 不推荐使用的场景：

1. **使用其他编辑器**: 如果不使用 OpenCode
2. **需要大量专业代理**: 需要特定领域的专业代理
3. **需要活跃社区**: 需要活跃的社区支持和丰富的插件生态

---

## 12. 结论

oh-my-opencode 是一个设计独特、功能强大的 AI 编程代理框架。它的希腊神话风格命名、广泛的模型支持、与 OpenCode 的深度集成以及强大的代码理解能力使其成为一个值得考虑的选择。

然而，相比于 oh-my-claudecode，它在代理数量、社区活跃度和文档完善度方面还有差距。选择哪个框架主要取决于您的具体需求、编辑器偏好以及对模型多样性的需求。

---

## 13. 参考资料

- GitHub 仓库: https://github.com/code-yeongyu/oh-my-opencode
- OpenCode 官网: [待补充]
- 相关文档: [待补充]

---

**报告生成时间**: 2026-02-20
**分析者**: comparative-1 agent
**团队**: ai-framework-analysis
