## Summary
该审查计划（以仓库内实际版本 `v1.2` 为准）整体方向正确：已把“跨模块数据契约 + 运行时状态/绑定”纳入审查，并新增 `debugger` 角色来覆盖 `prototype.js` 的关键交互与硬编码数据问题（`.omc/plans/prototype-review-plan.md:4`, `.omc/plans/prototype-review-plan.md:56`）。但从架构可行性与覆盖面看，仍建议 **REVISE**：审查范围未显式覆盖“模型接入/密钥与供应商策略”这一高风险域，且计划内部分“验证点”引用的页面证据并不存在（例如事件页缺少事件 ID），会导致执行阶段误判或空转（`.omc/plans/prototype-review-plan.md:18`, `.omc/plans/prototype-review-plan.md:109`, `.omc/prototypes/ai-reader-electron/pages/events.html:29`）。

---

## Analysis (按提问逐项)

### 1) 团队组成是否合理？是否缺少关键角色？
**现有团队的合理性**
- 新增 `debugger` 是正确补强：原型的关键“架构决策”确实落在 `prototype.js` 的状态与实体绑定（如 `linkState`、`entityData`、点击 `<mark data-link>` 的处理），计划已明确要求输出“含代码行号引用”的技术债务清单（`.omc/plans/prototype-review-plan.md:56`, `.omc/plans/prototype-review-plan.md:58`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:738`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:777`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:948`）。
- `information-architect` 的职责描述与原型真实痛点匹配：跨模块跳转与信息同步的缺陷在当前原型里客观存在（例如事件/时间线/问答都只能跳回 `reader.html`，无法定位证据段落）（`.omc/plans/prototype-review-plan.md:38`, `.omc/prototypes/ai-reader-electron/pages/events.html:33`, `.omc/prototypes/ai-reader-electron/pages/timeline.html:33`, `.omc/prototypes/ai-reader-electron/pages/chat.html:81`）。

**缺少的关键角色（架构角度）**
- 缺少“LLM/平台与安全”角色：`settings.html` 明确涉及供应商配置、Base URL、API Key（含多 Key 轮询）与模型分组映射，这会直接引出 **密钥存储、配置隔离、供应商适配层、请求审计/限流/失败降级** 等架构问题，但计划的“审查范围”表未包含该页，团队角色也没有专门覆盖（`.omc/prototypes/ai-reader-electron/pages/settings.html:21`, `.omc/prototypes/ai-reader-electron/pages/settings.html:51`, `.omc/prototypes/ai-reader-electron/pages/settings.html:52`, `.omc/prototypes/ai-reader-electron/pages/settings.html:75`；对比计划范围 `.omc/plans/prototype-review-plan.md:18`）。
- 缺少“数据/索引与评测”角色：原型多处显式声称“RAG 引用已开启/引用命中率/置信度”，但目前引用体系在页面层面仍是文本占位，且无“可回跳的证据地址”契约（例如聊天引用是“第12章·第5段”而不是 `data-span-id`）（`.omc/prototypes/ai-reader-electron/pages/reader.html:100`, `.omc/prototypes/ai-reader-electron/pages/chat.html:39`, `.omc/prototypes/ai-reader-electron/pages/chat.html:90`）。这类问题通常需要能定义 **证据寻址（Evidence Addressing）** 与 **评测指标口径** 的角色（可由 information-architect + LLM 工程角色共同承担）。
- 建议补一个“QA/可用性验证（含可访问性）”角色：当前原型存在大量依赖运行时交互的控件（拖拽 splitter、localStorage 记忆、键盘快捷键），仅靠静态审查会漏掉行为级缺陷；同时 splitters 已带 ARIA 属性，值得专项验证一致性（`.omc/prototypes/ai-reader-electron/assets/prototype.js:181`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:1004`, `.omc/prototypes/ai-reader-electron/pages/reader.html:81`, `.omc/prototypes/ai-reader-electron/pages/characters.html:52`）。

---

### 2) 审查范围是否覆盖了核心问题域？
**已覆盖的部分**
- v1.2 的范围已扩展到 `chat.html`、`library.html`、`prototype.js`，比你在提问中描述的“4 模块”更接近真实系统（`.omc/plans/prototype-review-plan.md:18`, `.omc/plans/prototype-review-plan.md:24`, `.omc/plans/prototype-review-plan.md:25`, `.omc/plans/prototype-review-plan.md:26`）。
- `library.html` 中已经出现“导入策略/大章节存储策略（chunk 文件 vs 数据库）”这类纯架构议题，纳入审查是必要的（`.omc/prototypes/ai-reader-electron/pages/library.html:125`, `.omc/prototypes/ai-reader-electron/pages/library.html:129`）。

**仍存在的范围缺口（架构影响大）**
- **缺少 `settings.html` 的显式审查**：该页是“模型接入”的系统边界面，属于高风险架构域（密钥、供应商适配、离线兜底、本地模型探测），但不在计划的范围表中（`.omc/prototypes/ai-reader-electron/pages/settings.html:6`, `.omc/prototypes/ai-reader-electron/pages/settings.html:51`, `.omc/prototypes/ai-reader-electron/pages/settings.html:83`；对比 `.omc/plans/prototype-review-plan.md:18`）。同时原型总览页把“模型接入设置”列为 P0 覆盖的一部分，进一步说明它不应被遗漏（`.omc/prototypes/ai-reader-electron/index.html:69`, `.omc/prototypes/ai-reader-electron/index.html:84`）。
- **跨模块“证据可回跳”属于核心问题域，但范围描述仍偏“页面/模块”，缺少“证据寻址契约”这一横切面**：事件/时间线/问答都提供“跳回原文/定位原文”，但链接目前不携带 span 定位信息（`.omc/prototypes/ai-reader-electron/pages/events.html:33`, `.omc/prototypes/ai-reader-electron/pages/timeline.html:33`, `.omc/prototypes/ai-reader-electron/pages/chat.html:81`）。相对地，阅读器内部已具备 `data-span-id` 与平滑滚动回跳能力（`.omc/prototypes/ai-reader-electron/pages/reader.html:72`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:964`），说明“缺的不是 UI，而是跨页寻址协议”。

---

### 3) 执行流程是否高效可行？
**高效之处**
- 增加“阶段 0：预审查上下文准备”（明确 ID 规范、数据依赖、模型假设）能显著减少并行审查的分歧与重复劳动（`.omc/plans/prototype-review-plan.md:69`, `.omc/plans/prototype-review-plan.md:71`, `.omc/plans/prototype-review-plan.md:72`, `.omc/plans/prototype-review-plan.md:73`）。
- 接受标准要求“必须引用具体 HTML 行号或 JS 函数”，对输出质量有正向约束（`.omc/plans/prototype-review-plan.md:156`）。

**可行性风险**
- 流程依赖 `TeamCreate / SendMessage / Write` 这类编排原语，但仓库里未看到与之对应的可执行脚本/接口定义（计划文本仅把它们当“阶段名/动作名”出现），因此在非特定编排环境下会变成“概念流程”，需要提供手工替代路径（`.omc/plans/prototype-review-plan.md:75`, `.omc/plans/prototype-review-plan.md:118`, `.omc/plans/prototype-review-plan.md:123`）。  
  （不确定性声明：我未在仓库内发现这些原语的实现代码；仅基于计划文本与现有原型文件做判断。）
- 计划中部分“验证点”目前在被验证页面里没有对应数据，执行时会卡住或只能得到“无法验证/需补字段”的结论：例如计划要求校验 `event_red_coast` 在 `events.html:29` 的一致性，但事件页该行只有标题文本，不存在 `data-id` 或 `event_red_coast` 字符串（`.omc/plans/prototype-review-plan.md:109`, `.omc/prototypes/ai-reader-electron/pages/events.html:29`）。

---

### 4) 是否有架构层面的风险或遗漏？
以下风险在现有原型中均有直接证据；计划虽已“预分析”部分点，但仍建议把它们升级为“必须产出明确结论/建议的审查项”。

- **硬编码数据层导致“模块演示像联动，实际无数据契约”**：阅读器联动面板的数据来自 `prototype.js` 的 `spanSummaries` 与 `entityData`（硬编码），而不是跨模块共享的结构化数据源（`.omc/prototypes/ai-reader-electron/assets/prototype.js:744`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:777`；计划也已点名 `.omc/plans/prototype-review-plan.md:178`）。  
  直接后果是：一旦切换书/章，现有交互模式缺少可扩展路径（原型里章节显示“17/40”，但数据结构只覆盖 `s17-*`）（`.omc/prototypes/ai-reader-electron/pages/reader.html:30`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:740`）。
- **实体 ID 跨模块不落地，导致“点击实体→查看全局”无法精确定位**：阅读器 `<mark>` 已有 `data-id="actor_ye"`（`.omc/prototypes/ai-reader-electron/pages/reader.html:72`），且联动面板能按该 ID 渲染详情并给出“查看全局”链接（`.omc/prototypes/ai-reader-electron/assets/prototype.js:779`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:892`）；但人物关系图节点只是纯文本 `<div class="graph-node">叶文洁</div>`，没有 ID/锚点承接（`.omc/prototypes/ai-reader-electron/pages/characters.html:37`）。  
  这不是“缺少 null check”，而是 **缺少“实体注册表/ID→页面定位”的契约**（计划已识别但需要更落地的输出物）（`.omc/plans/prototype-review-plan.md:188`）。
- **证据回跳链路断裂（跨页）**：事件/时间线/问答都提供“定位/跳转/回跳原文”，但统一指向 `reader.html`，不携带 `data-span-id`（`.omc/prototypes/ai-reader-electron/pages/events.html:33`, `.omc/prototypes/ai-reader-electron/pages/timeline.html:33`, `.omc/prototypes/ai-reader-electron/pages/chat.html:81`）。同时阅读器内部实际上已经实现了“根据 spanId 滚动并高亮”的能力（`.omc/prototypes/ai-reader-electron/assets/prototype.js:969`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:971`）。  
  架构遗漏点在于：**缺少跨页 deep link 规范**（例如 `reader.html?span=s17-01`）以及从 URL 恢复上下文的入口逻辑（当前 `URLSearchParams` 仅用于书库导入弹窗）（`.omc/prototypes/ai-reader-electron/assets/prototype.js:309`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:311`）。
- **模型接入的安全与配置边界未纳入审查范围**：`settings.html` 明确展示可填写 `API Base URL` 与 `API Key`（并支持多 Key 轮询），这会在真实实现中触发“密钥安全存储/权限/日志脱敏/密钥轮换/供应商适配层”等系统级问题（`.omc/prototypes/ai-reader-electron/pages/settings.html:51`, `.omc/prototypes/ai-reader-electron/pages/settings.html:52`）。计划当前未把该页列入审查范围（`.omc/plans/prototype-review-plan.md:18`）。
- **导入与存储策略需要明确的“数据生命周期”审查**：书库导入策略涉及编码检测、章节识别、以及“大章节存储策略”（chunk 文件 vs DB），这对应到后续检索与引用追踪的稳定性（`.omc/prototypes/ai-reader-electron/pages/library.html:125`, `.omc/prototypes/ai-reader-electron/pages/library.html:128`, `.omc/prototypes/ai-reader-electron/pages/library.html:129`）。计划虽包含书库页，但未要求产出“数据生命周期/索引刷新/失败恢复”的结论性产物（`.omc/plans/prototype-review-plan.md:25`）。

---

## Root Cause
计划当前的主要“结构性缺口”不是缺少页面，而是缺少把 **跨模块联动**（人物/事件/时间/引用）抽象成 **统一数据契约与证据寻址协议** 的审查产出物与责任人；这在现有原型中表现为：阅读器侧已有 `data-id`/`data-span-id` 与面板渲染逻辑，但其他模块多停留在“文本/按钮跳页”，未承接 ID 与证据定位（`.omc/plans/prototype-review-plan.md:38`, `.omc/plans/prototype-review-plan.md:72`, `.omc/prototypes/ai-reader-electron/pages/reader.html:72`, `.omc/prototypes/ai-reader-electron/pages/events.html:33`）。

---

## Recommendations（按优先级：影响/成本）
1) **把 `settings.html` 纳入审查范围，并补齐“LLM/安全”角色或明确由谁负责该域结论**  
- 依据：`settings.html` 涉及 API Key、供应商与模型分组映射（`.omc/prototypes/ai-reader-electron/pages/settings.html:51`, `.omc/prototypes/ai-reader-electron/pages/settings.html:82`），但范围表未列出（`.omc/plans/prototype-review-plan.md:18`）。  
- 可落地交付物：最小化输出“密钥存储方案假设 + 供应商适配层边界 + 离线兜底策略（Ollama）”（`.omc/prototypes/ai-reader-electron/pages/settings.html:33`, `.omc/prototypes/ai-reader-electron/pages/settings.html:83`）。

2) **新增一份横切面审查产物：`Evidence Addressing & Deep Link Spec`（证据寻址/深链规范）**  
- 依据：跨页“回跳原文”缺少定位信息（`.omc/prototypes/ai-reader-electron/pages/chat.html:81`, `.omc/prototypes/ai-reader-electron/pages/timeline.html:33`），但阅读器已有 `data-span-id` 与滚动定位能力（`.omc/prototypes/ai-reader-electron/pages/reader.html:72`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:969`）。  
- 规范至少定义：`reader` 的可寻址单位（spanId）、其他模块如何携带 spanId、URL 恢复上下文规则（参考书库页 `?import=1` 的处理模式）（`.omc/prototypes/ai-reader-electron/assets/prototype.js:311`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:318`）。

3) **把“实体注册表/ID 对齐”作为必审项，并修正计划中无法验证的引用点**  
- 依据：人物页节点无 ID 承接（`.omc/prototypes/ai-reader-electron/pages/characters.html:37`），事件页同样无事件 ID（`.omc/prototypes/ai-reader-electron/pages/events.html:29`），因此计划里“校验 events.html:29 的 event_red_coast”当前不可执行（`.omc/plans/prototype-review-plan.md:109`）。  
- 建议计划输出物包含：实体命名规范（已在阶段 0 提到）+ “哪些页面缺字段导致契约断裂”的明确清单（`.omc/plans/prototype-review-plan.md:72`, `.omc/plans/prototype-review-plan.md:180`）。

4) **补一个 QA/可访问性（行为验证）环节与负责人（可作为新增 agent 或在阶段 3 显式加入）**  
- 依据：原型存在大量行为逻辑（splitter 拖拽、localStorage 记忆、键盘快捷键），静态审查不足以覆盖（`.omc/prototypes/ai-reader-electron/assets/prototype.js:143`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:522`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:1016`）。  
- 交付物：以“书库导入弹窗（含 `?import=1`）→阅读器联动面板→问答证据面板拖拽”为最小回归路径，记录行为缺陷与复现步骤（`.omc/prototypes/ai-reader-electron/pages/library.html:27`, `.omc/prototypes/ai-reader-electron/assets/prototype.js:315`, `.omc/prototypes/ai-reader-electron/pages/chat.html:74`）。  
- 按你的工作流要求：该环节适合交给 `qa-tester` 做运行时验证（而不是让架构审查代替跑 UI）。

---

## Trade-offs（建议→代价）
| 建议 | 收益 | 代价/取舍 |
|---|---|---|
| 纳入 `settings.html` + LLM/安全角色 | 把最高风险系统边界纳入，避免“原型可用但实现不可落地” | 需要额外专业视角与更严格的安全假设，会增加审查时间（`.omc/prototypes/ai-reader-electron/pages/settings.html:51`） |
| 证据寻址/深链规范 | 打通“引用可校验”，是 RAG 体验的地基 | 需要跨模块统一约束，短期会限制页面自由发挥（`.omc/prototypes/ai-reader-electron/pages/events.html:33`） |
| 实体注册表/ID 对齐 | 让“人物/事件/时间”真正成为可联动的数据结构 | 需要补字段/补锚点，短期工作量上升；但不做会长期返工（`.omc/prototypes/ai-reader-electron/pages/characters.html:37`） |
| QA/可访问性行为验证 | 捕获交互级缺陷，提升计划可执行性与复现质量 | 需要实际跑原型与记录步骤，降低纯文档推进速度（`.omc/prototypes/ai-reader-electron/assets/prototype.js:704`） |

---

## Conclusion
REVISE

---

## References（关键证据点）
- `.omc/plans/prototype-review-plan.md:18`：当前审查范围表（未包含 `settings.html`）。  
- `.omc/plans/prototype-review-plan.md:56`：新增 `debugger` 角色与职责。  
- `.omc/plans/prototype-review-plan.md:69`：阶段 0（数据模型假设、ID 规范、依赖关系）。  
- `.omc/plans/prototype-review-plan.md:109`：计划内“events.html:29 校验 event_red_coast”验证点。  
- `.omc/prototypes/ai-reader-electron/pages/reader.html:72`：`data-span-id` + `<mark data-link ... data-id=...>` 的实体/证据粒度。  
- `.omc/prototypes/ai-reader-electron/assets/prototype.js:777`：`entityData` 硬编码数据层。  
- `.omc/prototypes/ai-reader-electron/assets/prototype.js:964`：阅读器内部“回跳证据”滚动定位实现。  
- `.omc/prototypes/ai-reader-electron/pages/characters.html:37`：人物图谱节点无 ID 承接（纯文本节点）。  
- `.omc/prototypes/ai-reader-electron/pages/events.html:29`：事件条目标题无事件 ID。  
- `.omc/prototypes/ai-reader-electron/pages/chat.html:39`：引用以文本标签表达（非 spanId）。  
- `.omc/prototypes/ai-reader-electron/pages/settings.html:51`：API Base URL 配置入口。  
- `.omc/prototypes/ai-reader-electron/pages/settings.html:52`：API Key（多 Key 轮询）输入形态。  
- `.omc/prototypes/ai-reader-electron/pages/library.html:129`：大章节存储策略（chunk 文件 vs 数据库）。