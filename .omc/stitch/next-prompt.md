---
page: library
---

# AI Reader 书库首页设计

设计一个现代化、温暖友好的书库首页，展示用户的书籍收藏、分类导航和个性化推荐。

## 设计系统（必须遵循）

**Design System:**
- **Theme**: Light mode with warm yellow-orange accents
- **Primary Colors**: Duck Yellow #FFD93D, Duck Orange #FF8C42
- **Background**: Pure white #FFFFFF with light gray #F5F5F5 sections
- **Typography**: Inter font family, clean and modern
- **Buttons**: Gradient buttons with rounded corners (12px radius)
- **Cards**: White cards with subtle shadows, 16px border radius
- **Animations**: Fade-in-up, float, and pulse-glow effects
- **Style**: Flat cartoon illustration style, friendly and approachable
- **Character**: Cute duck mascot with accessories (reading glasses, book in hand)

## 页面结构

### 1. 顶部导航栏
- Logo: "AI Reader" 品牌名 + 小鸭子图标
- 导航链接: 书库 | 阅读 | 分析 | 设置
- 用户头像按钮（圆形）
- 背景: 白色半透明 + 模糊效果

### 2. Hero 区域
- 大标题: "你的智能书库"
- 副标题: "AI 驱动的个性化阅读体验"
- 搜索框: 大尺寸输入框，带搜索图标
- 阅读鸭插画（戴眼镜，手持书本）
- 滚动文字效果显示热门书籍类型

### 3. 分类导航
- 横向滚动卡片
- 分类: 全部 | 小说 | 科技 | 历史 | 心理学 | 商业 | 艺术
- 当前选中项使用黄橙渐变高亮

### 4. 继续阅读
- 横向滚动书籍卡片
- 每张卡片显示: 封面图、书名、作者、阅读进度条
- 悬浮效果: 上移 + 阴影增强

### 5. 为你推荐
- 网格布局书籍卡片（2-3列）
- 每张卡片: 封面图、书名、作者、评分、AI 推荐理由标签
- "AI 推荐" 标签使用黄橙渐变背景

### 6. 新书上架
- 列表样式展示
- 封面图（小）、书名、作者、简介、添加按钮

### 7. 底部
- 简洁的页脚信息
- 品牌 Logo + 版权信息

## 视觉细节

- 书籍卡片使用白色背景 + 浅灰边框
- 进度条使用黄橙渐变
- AI 标签使用脉冲发光动画
- 页面加载使用渐入动画
- 背景添加微妙的网格纹理

## 交互效果

- 卡片悬浮: translateY(-4px) + 阴影增强
- 按钮悬浮: 微微上移 + 阴影扩散
- 分类切换: 平滑过渡动画
- 搜索框聚焦: 边框变为黄橙色
