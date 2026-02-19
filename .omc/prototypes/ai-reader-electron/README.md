# AI Reader Electron Prototype

此目录提供一套基于计划文件生成的完整 Electron 应用原型。

## 文件结构

- `index.html`: 页面总览与功能映射
- `assets/styles.css`: 全局视觉系统
- `assets/prototype.js`: 当前页高亮、主题切换、工作台折叠交互
- `pages/library.html`: 书库首页
- `pages/import.html`: 文件导入向导
- `pages/reader.html`: 阅读器核心页
- `pages/characters.html`: 人物关系图谱页
- `pages/timeline.html`: 时间线分析页
- `pages/events.html`: 事件分析页
- `pages/chat.html`: AI问答页
- `pages/settings.html`: 模型接入设置页

## 使用方式

1. 直接在浏览器中打开 `index.html`。
2. 通过左侧导航浏览所有页面。
3. 导入功能已并入书库，可在书库页直接打开导入弹窗，或访问 `pages/import.html` 自动跳转到 `library.html?import=1`。
4. 页面已经按计划中的 P0 模块做了功能映射，便于后续迁移到 React + Electron。
5. 顶部支持主题切换，并会自动记忆：
   - `暖纸主题`（默认）
   - `冷墨主题`
   - `夜读高对比`

## 第二轮统一改造（MotherDuck 风格）

- 全部页面统一接入 `md-hero` 品牌头图模块（文案 + 指标 + 卡通占位）。
- 全部页面统一接入 `cta-panel` 收口模块，强化跨页面工作流跳转。
- 视觉语言统一为“卡通直角”：厚边框、小圆角、平面投影、标签化信息块。

## 额外适配技能（find-skills 检索结果）

- `teachingai/full-stack-skills@electron`
- `tomlord1122/tomtom-skill@electron-architect`
- `samhvw8/dot-claude@ui-design-system`
- `nilecui/skillsbase@using-shadcn-ui`
- `jezweb/claude-skills@color-palette`
- `sanky369/vibe-building-skills@color-system`
