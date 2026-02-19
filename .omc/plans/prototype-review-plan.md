# AI Reader 原型审查计划

## 计划版本
- 版本：v1.2 (Critic 修订版)
- 创建时间：2026-02-19
- 模式：Consensus (Planner → Architect → Critic)
- 架构审查状态：✅ REVISE → 已整合反馈
- Critic 审查状态：✅ REJECT → 已修正路径和行号

---

## 需求概述

创建一个协调团队，从用户实际阅读体验角度（以《三体》小说为例），深入审查 AI Reader HTML 原型的核心模块设计，识别功能设计问题和底层架构差距，最终整理成问题文档。

### 审查范围

| 模块 | 原型文件路径 | 核心功能 |
|------|-------------|----------|
| 阅读器 | `.omc/prototypes/ai-reader-electron/pages/reader.html` | 三栏布局、实体标记、联动面板、AI问答 |
| 人物关系 | `.omc/prototypes/ai-reader-electron/pages/characters.html` | 关系图谱、别名合并、冲突提醒 |
| 事件分析 | `.omc/prototypes/ai-reader-electron/pages/events.html` | 事件矩阵、因果链、置信度 |
| 时间线 | `.omc/prototypes/ai-reader-electron/pages/timeline.html` | 时序校对、叙事视角、纠偏建议 |
| AI问答 | `.omc/prototypes/ai-reader-electron/pages/chat.html` | 证据面板、模板、引用追踪 |
| 书库 | `.omc/prototypes/ai-reader-electron/pages/library.html` | 导入流程、书籍管理 |
| JS逻辑 | `.omc/prototypes/ai-reader-electron/assets/prototype.js` | 状态管理、实体绑定、导航处理 |

---

## 团队组成与职责

### 1. ux-researcher (用户体验研究员)
**职责**：站在《三体》读者角度，分析实际阅读场景中的需求与痛点
- 模拟用户阅读《三体》时的信息需求
- 识别用户想追踪但原型未提供的功能
- 评估各模块的可用性和学习成本

### 2. information-architect (信息架构师)
**职责**：分析模块间的数据流转和底层架构设计
- 评估人物-事件-时间的数据关联完整性
- 识别跨模块跳转和信息同步的设计缺陷
- 分析数据模型是否支撑复杂的小说分析场景

### 3. product-manager (产品经理)
**职责**：从产品角度评估功能完整性和优先级
- 对比竞品/同类工具的功能差距
- 识别 P0 功能缺失点
- 提出功能增强建议

### 4. designer (设计师)
**职责**：评估交互设计和视觉呈现
- 分析信息密度和可读性
- 评估交互流程的流畅度
- 识别设计一致性问题

### 5. debugger (根因分析专家) ⭐ 新增
**职责**：分析技术实现中的数据绑定和状态管理问题
- 分析 `prototype.js` 中的状态管理模式
- 追踪实体标记 (`<mark data-link>`) 与数据源的绑定关系
- 识别跨模块数据契约缺失问题
- 输出技术债务清单（含代码行号引用）

**新增理由** (Architect 建议)：原型不仅是 UI 模型，还包含架构决策（实体链接、状态管理、导航模式）。需要技术视角分析数据绑定和运行时行为。

---

## 执行步骤

### 阶段 0：预审查上下文准备 ⭐ 新增
1. **确保输出目录存在**：`.omc/reports/` 目录，如不存在需创建
2. 创建"数据模型假设"文档，供所有 agent 阅读
3. 明确原型中的实体 ID 命名规范
4. 列出各模块间的数据依赖关系

### 阶段 1：团队组建 (TeamCreate)
1. 使用 `TeamCreate` 创建审查团队
2. 团队名称：`prototype-review-team`
3. 创建任务列表，分配各 agent 职责

### 阶段 2：并行审查 (Task 并发)
五个 agent 并行执行各自的专业审查：

**ux-researcher 任务**：
- 模拟《三体》阅读场景：追踪叶文洁动机变化
- 模拟场景：理解 ETO 组织结构演变
- 模拟场景：理清三体文明与地球的博弈时间线
- 输出：用户需求与原型能力差距清单

**information-architect 任务**：
- 分析人物 → 事件 → 时间的数据关联链
- 评估阅读器联动面板与独立模块的数据同步
- 识别数据模型设计缺陷
- 输出：架构问题清单

**product-manager 任务**：
- 评估核心功能覆盖度
- 识别高价值缺失功能
- 输出：功能差距优先级清单

**designer 任务**：
- 评估交互流程
- 识别设计一致性问题
- 输出：设计问题清单

**debugger 任务** ⭐ 新增：
- 分析 prototype.js 状态管理 (`linkState`: 738-742, `entityData`: 777-820)
- 追踪实体标记点击处理 (行 948-962)
- 验证 `reader.html:72` `<mark data-link="actor" data-id="actor_ye">` 与 `characters.html:37` 图谱节点 "叶文洁" 无数据绑定
- 验证事件 ID `event_red_coast` 在 `reader.html:72,76` 与 `events.html:29` 的引用一致性
- 识别硬编码数据与 UI 绑定问题
- 输出：技术债务清单（含行号引用）

### 阶段 3：整合分析 ⭐ 新增
1. 由 architect 合成各 agent 发现的跨模块问题
2. 识别跨越多个模块的系统性问题
3. 关联技术问题与用户体验影响

### 阶段 4：问题汇总 (SendMessage 协调)
1. 收集各 agent 的审查结果
2. 去重和优先级排序
3. 识别跨模块的系统性问题

### 阶段 5：文档输出 (Write)
1. 整合所有发现到统一文档
2. 按模块分类问题
3. 标注问题严重程度（P0/P1/P2）
4. 提供改进方向建议

---

## 预期交付物

**问题文档**：`.omc/reports/prototype-review-report.md`

文档结构：
```
1. 执行摘要
2. 阅读器模块问题
3. 人物关系模块问题
4. 事件分析模块问题
5. 时间线模块问题
6. 跨模块架构问题
7. 《三体》场景化需求差距
8. 技术债务清单
9. 改进建议优先级
```

---

## 接受标准 (修订版)

- [ ] 识别至少 **3 个阻塞级问题** (Blocking)
- [ ] 识别至少 **5 个严重问题** (Major)
- [ ] 识别至少 **10 个一般问题** (Minor)
- [ ] 包含 **3 个以上《三体》具体场景**的需求差距分析
- [ ] 所有问题必须**引用具体的 HTML 行号或 JS 函数**
- [ ] 技术债务清单包含**代码行号引用**
- [ ] 跨模块问题有**明确的模块间依赖关系图**

---

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| Agent 审查视角重叠 | 明确各 agent 职责边界，使用 task 隔离 |
| 问题过于泛泛 | **要求引用原型具体设计元素（HTML行号/功能点）** |
| 遗漏关键问题 | ux-researcher 专注《三体》场景，确保覆盖典型阅读需求 |
| 原型-实现差距 | debugger agent 追踪"生产环境数据如何驱动此 UI" |
| 模块耦合隐藏 | 整合阶段由 architect 合成跨模块问题 |

---

## 已识别的架构问题 (Architect 预分析)

以下问题已在 Architect 审查中识别，审查团队应重点关注：

1. **数据层硬编码** (`prototype.js:777-820`)
   - `entityData` 对象为硬编码，无外部数据契约
   - 阅读器实体标记与人物图谱无数据绑定

2. **跨模块导航断裂** (`prototype.js:1-93`)
   - 页面间导航为纯 URL 跳转 (`navTarget`: 1-6)
   - 导航图标路径定义 (`navIconPaths`: 17-26)
   - 无共享状态管理
   - 无深度链接支持（如 `characters.html#actor_ye`）

3. **实体 ID 不一致**
   - `reader.html:72` 中的 `actor_ye` 与 `characters.html:37` 图谱节点无对应关系
   - 事件 ID (`event_red_coast`) 在 `reader.html:72,76` 与 `events.html:29` 引用为字符串而非结构化引用

---

## 下一步

等待 Critic 审查通过后：
1. 调用 `TeamCreate` 组建团队
2. 创建任务列表
3. 启动并行审查
4. 汇总并输出问题文档
