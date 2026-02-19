# AI Reader 设计系统

基于 MotherDuck 网站视觉风格设计

## 1. 概述

AI Reader 采用 MotherDuck 的设计语言：**浅色主题 + 温暖活力色调 + 可爱卡通风格**。

---

## 2. 配色方案

### 2.1 品牌主色

| 颜色名称 | 用途 | 十六进制值 |
|---------|------|-----------|
| **鸭黄色 (Duck Yellow)** | 品牌主色、Logo、强调元素 | `#FFD93D` |
| **鸭橙色 (Duck Orange)** | CTA 按钮、重要操作 | `#FF8C42` |
| **奶油白 (Cream White)** | 浅色背景、卡片 | `#FFF8F0` |
| **天空蓝 (Sky Blue)** | 链接、辅助强调 | `#4ECDC4` |

### 2.2 背景色系

| 模式 | 颜色名称 | 十六进制值 | 用途 |
|------|---------|-----------|------|
| 浅色（默认） | 纯白 | `#FFFFFF` | 主背景 |
| | 浅灰 | `#F5F5F5` | 次级背景 |
| | 中灰 | `#EAEAEA` | 卡片背景 |
| | 边框灰 | `#E5E5E5` | 边框、分隔线 |

### 2.3 文字色系

| 类型 | 主文字 | 次级文字 | 辅助文字 |
|------|-------|---------|---------|
| 浅色模式 | `#1A1A1A` | `#666666` | `#999999` |

### 2.4 语义色系

| 状态 | 颜色 | 十六进制值 |
|------|------|-----------|
| 成功 | 翠绿色 | `#10B981` |
| 警告 | 琥珀色 | `#F59E0B` |
| 错误 | 玫红色 | `#EF4444` |
| 信息 | 天蓝色 | `#0EA5E9` |

---

## 3. 字体系统

### 3.1 字体族

```css
/* 主字体 */
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* 代码字体 */
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

/* 中文字体 */
font-family: 'PingFang SC', 'Source Han Sans SC', 'Noto Sans SC', sans-serif;
```

### 3.2 字体大小层级

| 名称 | 大小 | 行高 | 字重 | 用途 |
|------|-----|------|------|------|
| Hero | 56-72px | 1.1 | 700 | 首屏大标题 |
| H1 | 40-48px | 1.2 | 700 | 页面主标题 |
| H2 | 32-36px | 1.25 | 600 | 区块标题 |
| H3 | 24-28px | 1.3 | 600 | 卡片标题 |
| Body Large | 18px | 1.7 | 400 | 重要正文 |
| Body | 16px | 1.75 | 400 | 默认正文 |
| Body Small | 14px | 1.6 | 400 | 辅助文字 |
| Caption | 12px | 1.5 | 500 | 说明文字、标签 |

---

## 4. 间距系统

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 紧凑间距 |
| `space-2` | 8px | 小间距 |
| `space-3` | 12px | 默认间距 |
| `space-4` | 16px | 组件内间距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 大区块间距 |
| `space-12` | 48px | 页面区域间距 |
| `space-16` | 64px | Hero 区域间距 |

---

## 5. 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| `radius-sm` | 6px | 小按钮、标签 |
| `radius-md` | 10px | 输入框、小卡片 |
| `radius-lg` | 14px | 卡片、按钮 |
| `radius-xl` | 20px | 大卡片、模态框 |
| `radius-2xl` | 28px | Hero 卡片 |
| `radius-full` | 9999px | 圆形元素 |

---

## 6. 组件风格（用于 Stitch 生成）

### 6.1 主要按钮 (Primary Button)

```css
.btn-primary {
  background: linear-gradient(135deg, #FFD93D, #FF8C42);
  color: #1C1917;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(255, 140, 66, 0.35);
  transition: all 0.3s ease;
  padding: 12px 24px;
  font-weight: 600;
}
.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(255, 140, 66, 0.5);
  transform: translateY(-2px);
}
```

### 6.2 次要按钮 (Secondary Button)

```css
.btn-secondary {
  background: transparent;
  color: #1A1A1A;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  padding: 12px 24px;
}
.btn-secondary:hover {
  background: rgba(255, 217, 61, 0.1);
  border-color: #FFD93D;
  color: #D97706;
}
```

### 6.3 卡片设计

```css
.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 229, 229, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.card:hover {
  border-color: rgba(255, 140, 0, 0.4);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
```

### 6.4 AI 对话气泡

```css
/* AI 消息 */
.chat-bubble-ai {
  background: #F5F5F5;
  border: 1px solid #E5E5E5;
  border-radius: 16px 16px 16px 4px;
}

/* 用户消息 - 黄橙渐变 */
.chat-bubble-user {
  background: linear-gradient(135deg, #FFD93D, #FF8C42);
  color: #1C1917;
  border-radius: 16px 16px 4px 16px;
}
```

---

## 7. 动画效果

### 7.1 渐入动画

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 7.2 悬浮动画

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### 7.3 脉冲发光

```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.25);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 140, 0, 0.4);
  }
}
```

### 7.4 滚动文字效果

```css
.scroll-text-container {
  overflow: hidden;
  white-space: nowrap;
}
.scroll-text-content {
  display: inline-flex;
  animation: scrollText 20s linear infinite;
}
@keyframes scrollText {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## 8. 特色视觉元素

### 8.1 光晕效果

```css
.glow-orb {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 140, 0, 0.1) 0%,
    transparent 70%
  );
  filter: blur(60px);
}
```

### 8.2 网格背景

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

---

## 9. 鸭子角色变体

AI Reader 可以设计以下角色变体：

| 角色 | 配件 | 用途 |
|------|------|------|
| **阅读鸭** | 戴眼镜，手持书本 | 阅读器界面、书籍推荐 |
| **分析鸭** | 拿放大镜，看数据图表 | AI 分析面板、统计页面 |
| **推荐鸭** | 拿推荐卡，微笑指引 | 推荐列表、引导提示 |

---

## 10. 页面布局模板

### 10.1 Hero 区域

- 大标题 + 副标题
- 鸭子插画/动画
- CTA 按钮（黄橙渐变）
- 滚动文字效果（可选）

### 10.2 内容区域

- 浅色背景（默认 #FFFFFF）
- 卡片网格布局
- 悬浮动画效果
- 清晰的视觉层次

---

## 11. 设计系统说明（用于 Stitch 生成）

**当使用 Stitch 生成页面时，请包含以下设计系统说明：**

> **Design System:**
> - **Theme**: Light mode with warm yellow-orange accents
> - **Primary Colors**: Duck Yellow #FFD93D, Duck Orange #FF8C42
> - **Background**: Pure white #FFFFFF with light gray #F5F5F5 sections
> - **Typography**: Inter font family, clean and modern
> - **Buttons**: Gradient buttons with rounded corners (12px radius)
> - **Cards**: White cards with subtle shadows, 16px border radius
> - **Animations**: Fade-in-up, float, and pulse-glow effects
> - **Style**: Flat cartoon illustration style, friendly and approachable
> - **Character**: Cute duck mascot with accessories (glasses, magnifying glass, etc.)

---

*文档更新: 2026-02-17*
*设计参考: MotherDuck 官网 (https://motherduck.com)*
