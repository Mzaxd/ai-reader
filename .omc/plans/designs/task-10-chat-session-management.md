# AI 会话管理功能设计

**任务编号**: P2-2
**设计师**: designer-10
**创建日期**: 2026-02-19
**状态**: 设计完成

---

## 1. 设计概述

### 1.1 问题陈述

当前 AI 问答模块原型 (`chat.html:25-72`) 缺少会话管理功能，用户无法：

- 查看和管理历史会话
- 在不同会话间切换
- 为会话设置有意义的标题
- 删除或归档不再需要的会话

当前原型仅显示静态的"会话 #12"标签 (`chat.html:28`)，无历史记录或会话列表。

### 1.2 设计目标

1. 提供侧边栏会话列表，支持历史会话浏览
2. 支持会话的创建、重命名、删除、归档操作
3. 每个会话独立管理对话历史和上下文
4. 支持会话标题自动生成和手动编辑
5. 本地存储方案确保会话持久化

---

## 2. UI 设计

### 2.1 布局结构

```
┌──────────────────────────────────────────────────────────────┐
│ AI Reader / AI问答                                    [设置]  │
├──────────┬───────────────────────────────────────────────────┤
│          │  对话主线程              Provider: Claude · 28k    │
│ 会话列表 │  ─────────────────────────────────────────────────│
│          │                                                   │
│ [+ 新建] │  [用户] 叶文洁在第17章为什么态度更激进？          │
│          │  [AI]   激进化不是突变，而是判断阈值跨过临界点...  │
│ 历史会话 │                                                   │
│          │  [用户] 给我三条证据，并按冲突类型分组。          │
│ ──────── │  [AI]   已分组完成...                             │
│          │                                                   │
│ ▶ 三体文明│                                                   │
│   分析   │  ┌─────────────────────────────────────────────┐  │
│          │  │                                             │  │
│ 叶文洁   │  │    消息输入区                                │  │
│ 动机分析 │  │                                             │  │
│          │  └─────────────────────────────────────────────┘  │
│ 人物关系 │                                                   │
│ 网络     │                                                   │
│          │                                                   │
│ ──────── │                                                   │
│ 已归档   │                                                   │
│ (2)      │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

### 2.2 会话列表面板

```html
<!-- 会话侧边栏 -->
<aside class="session-sidebar" data-session-sidebar>
  <!-- 新建会话按钮 -->
  <div class="session-header">
    <button class="btn btn-primary" data-new-session>
      <span class="icon">+</span>
      <span>新建会话</span>
    </button>
    <button class="btn btn-flat" data-session-settings aria-label="会话设置">
      <span class="icon">⚙</span>
    </button>
  </div>

  <!-- 搜索框 -->
  <div class="session-search">
    <input
      type="search"
      class="search-input"
      placeholder="搜索会话..."
      data-session-search
      aria-label="搜索会话"
    />
  </div>

  <!-- 会话分组 -->
  <div class="session-list">
    <!-- 当前会话组 -->
    <div class="session-group">
      <div class="session-group-header">
        <span class="session-group-title">当前会话</span>
      </div>
      <div class="session-group-body">
        <div class="session-item active" data-session-id="current" data-active-session>
          <span class="session-title">新对话</span>
          <span class="session-meta">刚刚</span>
        </div>
      </div>
    </div>

    <!-- 历史会话组 -->
    <div class="session-group">
      <div class="session-group-header">
        <span class="session-group-title">历史会话</span>
        <button class="btn-flat" data-collapse-group aria-label="折叠">
          <span class="icon">▼</span>
        </button>
      </div>
      <div class="session-group-body">
        <div class="session-item" data-session-id="s001">
          <span class="session-title">叶文洁动机分析</span>
          <span class="session-meta">2小时前</span>
          <button class="session-action" data-session-menu aria-label="会话选项">⋮</button>
        </div>
        <div class="session-item" data-session-id="s002">
          <span class="session-title">三体文明分析</span>
          <span class="session-meta">昨天</span>
          <button class="session-action" data-session-menu aria-label="会话选项">⋮</button>
        </div>
        <div class="session-item" data-session-id="s003">
          <span class="session-title">人物关系网络</span>
          <span class="session-meta">3天前</span>
          <button class="session-action" data-session-menu aria-label="会话选项">⋮</button>
        </div>
      </div>
    </div>

    <!-- 已归档组 -->
    <div class="session-group collapsed" data-archived-group>
      <div class="session-group-header">
        <span class="session-group-title">已归档</span>
        <span class="session-count">(2)</span>
        <button class="btn-flat" data-collapse-group aria-label="展开">
          <span class="icon">▶</span>
        </button>
      </div>
      <div class="session-group-body" hidden>
        <div class="session-item archived" data-session-id="a001">
          <span class="session-title">早期草稿讨论</span>
          <span class="session-meta">1周前</span>
          <button class="session-action" data-session-menu aria-label="会话选项">⋮</button>
        </div>
      </div>
    </div>
  </div>
</aside>

<!-- 会话上下文菜单（隐藏） -->
<div class="session-menu" data-session-menu hidden>
  <button class="menu-item" data-action="rename">
    <span class="menu-icon">✏</span>
    <span>重命名</span>
  </button>
  <button class="menu-item" data-action="duplicate">
    <span class="menu-icon">⊕</span>
    <span>复制会话</span>
  </button>
  <button class="menu-item" data-action="archive">
    <span class="menu-icon">📦</span>
    <span>归档</span>
  </button>
  <div class="menu-divider"></div>
  <button class="menu-item danger" data-action="delete">
    <span class="menu-icon">🗑</span>
    <span>删除</span>
  </button>
</div>

<!-- 重命名对话框 -->
<div class="modal" data-rename-modal hidden role="dialog" aria-labelledby="rename-title">
  <div class="modal-content">
    <h3 id="rename-title">重命名会话</h3>
    <div class="form-grid">
      <div class="field">
        <label for="session-title-input">会话标题</label>
        <input
          id="session-title-input"
          type="text"
          class="input"
          placeholder="输入会话标题..."
          maxlength="50"
        />
        <small class="hint">最多 50 个字符</small>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" data-confirm-rename>保存</button>
      <button class="btn btn-ghost" data-cancel-rename>取消</button>
    </div>
  </div>
</div>
```

### 2.3 样式定义

```css
/* 会话侧边栏 */
.session-sidebar {
  width: 260px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.session-header {
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-2);
}

.session-header .btn {
  flex: 1;
}

.session-search {
  padding: var(--space-2) var(--space-3);
}

.search-input {
  width: 100%;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
}

/* 会话列表 */
.session-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.session-group {
  margin-bottom: var(--space-4);
}

.session-group-header {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.session-group-body {
  margin-top: var(--space-1);
}

.session-group.collapsed .session-group-body {
  display: none;
}

/* 会话项 */
.session-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.session-item:hover {
  background: var(--color-subtle);
}

.session-item.active {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
}

.session-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: var(--color-primary);
  border-radius: 0 2px 2px 0;
}

.session-item.archived {
  opacity: 0.7;
}

.session-title {
  flex: 1;
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.session-action {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-1);
  opacity: 0;
  transition: opacity 0.2s;
}

.session-item:hover .session-action {
  opacity: 1;
}

/* 会话菜单 */
.session-menu {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  min-width: 160px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.menu-item:hover {
  background: var(--color-subtle);
}

.menu-item.danger {
  color: var(--color-danger);
}

.menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-1) 0;
}

/* 删除确认对话框 */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal[hidden] {
  display: none;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  min-width: 320px;
  max-width: 90vw;
}
```

---

## 3. 数据结构

### 3.1 会话数据接口

```typescript
/**
 * 会话消息类型
 */
enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

/**
 * 单条消息
 */
interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  citations?: Citation[];
  metadata?: Record<string, unknown>;
}

/**
 * 引用来源
 */
interface Citation {
  chapter: string;
  paragraph: number;
  text: string;
  href?: string;
}

/**
 * 会话状态
 */
enum SessionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

/**
 * 会话上下文配置
 */
interface SessionContext {
  bookId?: string;
  chapterRange?: [number, number];
  characterFilter?: string[];
  eventFilter?: string[];
}

/**
 * 会话数据结构
 */
interface ChatSession {
  // 基本信息
  id: string;
  title: string;
  status: SessionStatus;

  // 消息历史
  messages: ChatMessage[];

  // 时间信息
  createdAt: number;
  updatedAt: number;
  lastActiveAt: number;

  // 上下文配置
  context: SessionContext;

  // 统计信息
  messageCount: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };

  // 元数据
  metadata?: {
    provider?: string;
    model?: string;
    pinned?: boolean;
  };
}

/**
 * 会话列表数据
 */
interface SessionListData {
  currentSessionId: string | null;
  sessions: ChatSession[];
  groups: {
    active: string[];
    archived: string[];
  };
}
```

### 3.2 存储键定义

```typescript
/**
 * 本地存储键
 */
const StorageKeys = {
  SESSION_LIST: 'ai_reader_chat_sessions',
  CURRENT_SESSION: 'ai_reader_chat_current_session',
  SESSION_PREFIX: 'ai_reader_session_',
  ARCHIVED_SESSIONS: 'ai_reader_chat_archived',
} as const;

/**
 * 会话存储管理器
 */
class SessionStorageManager {
  /**
   * 保存会话
   */
  saveSession(session: ChatSession): void {
    try {
      const key = StorageKeys.SESSION_PREFIX + session.id;
      localStorage.setItem(key, JSON.stringify(session));
      this.updateSessionIndex(session);
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  /**
   * 加载会话
   */
  loadSession(sessionId: string): ChatSession | null {
    try {
      const key = StorageKeys.SESSION_PREFIX + sessionId;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to load session:', e);
      return null;
    }
  }

  /**
   * 删除会话
   */
  deleteSession(sessionId: string): void {
    try {
      const key = StorageKeys.SESSION_PREFIX + sessionId;
      localStorage.removeItem(key);
      this.removeFromIndex(sessionId);
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  }

  /**
   * 更新会话索引
   */
  private updateSessionIndex(session: ChatSession): void {
    const index = this.loadSessionIndex();
    index.set(session.id, {
      id: session.id,
      title: session.title,
      status: session.status,
      updatedAt: session.updatedAt,
      lastActiveAt: session.lastActiveAt
    });
    this.saveSessionIndex(index);
  }

  /**
   * 加载会话索引
   */
  private loadSessionIndex(): Map<string, SessionIndexItem> {
    try {
      const raw = localStorage.getItem(StorageKeys.SESSION_LIST);
      if (!raw) return new Map();
      const data = JSON.parse(raw);
      return new Map(Object.entries(data));
    } catch (e) {
      return new Map();
    }
  }

  /**
   * 保存会话索引
   */
  private saveSessionIndex(index: Map<string, SessionIndexItem>): void {
    const data = Object.fromEntries(index);
    localStorage.setItem(StorageKeys.SESSION_LIST, JSON.stringify(data));
  }
}

/**
 * 会话索引项
 */
interface SessionIndexItem {
  id: string;
  title: string;
  status: SessionStatus;
  updatedAt: number;
  lastActiveAt: number;
}
```

---

## 4. 会话管理器

### 4.1 核心管理类

```typescript
/**
 * 会话管理器
 */
class ChatSessionManager {
  private storage: SessionStorageManager;
  private currentSession: ChatSession | null = null;
  private listeners: Set<(event: SessionEvent) => void> = new Set();

  constructor() {
    this.storage = new SessionStorageManager();
    this.loadCurrentSession();
  }

  /**
   * 创建新会话
   */
  createSession(context?: SessionContext): ChatSession {
    const session: ChatSession = {
      id: this.generateId(),
      title: '新对话',
      status: SessionStatus.ACTIVE,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastActiveAt: Date.now(),
      context: context || {},
      messageCount: 0
    };

    this.storage.saveSession(session);
    this.setCurrentSession(session);
    this.emit({ type: 'created', session });

    return session;
  }

  /**
   * 切换会话
   */
  switchSession(sessionId: string): ChatSession | null {
    const session = this.storage.loadSession(sessionId);
    if (!session || session.status === SessionStatus.DELETED) {
      return null;
    }

    this.currentSession = session;
    this.storage.saveCurrentSessionId(sessionId);
    this.emit({ type: 'switched', session });

    return session;
  }

  /**
   * 重命名会话
   */
  renameSession(sessionId: string, newTitle: string): boolean {
    const session = this.storage.loadSession(sessionId);
    if (!session) return false;

    session.title = newTitle;
    session.updatedAt = Date.now();

    this.storage.saveSession(session);
    this.emit({ type: 'updated', session });

    return true;
  }

  /**
   * 归档会话
   */
  archiveSession(sessionId: string): boolean {
    const session = this.storage.loadSession(sessionId);
    if (!session) return false;

    session.status = SessionStatus.ARCHIVED;
    session.updatedAt = Date.now();

    this.storage.saveSession(session);

    if (this.currentSession?.id === sessionId) {
      this.currentSession = null;
    }

    this.emit({ type: 'archived', session });
    return true;
  }

  /**
   * 删除会话
   */
  deleteSession(sessionId: string): boolean {
    const session = this.storage.loadSession(sessionId);
    if (!session) return false;

    // 软删除：标记为已删除
    session.status = SessionStatus.DELETED;
    session.updatedAt = Date.now();

    this.storage.saveSession(session);

    if (this.currentSession?.id === sessionId) {
      this.currentSession = null;
    }

    this.emit({ type: 'deleted', session });
    return true;
  }

  /**
   * 添加消息
   */
  addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void {
    if (!this.currentSession) return;

    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.currentSession.messages.push(fullMessage);
    this.currentSession.messageCount = this.currentSession.messages.length;
    this.currentSession.lastActiveAt = Date.now();
    this.currentSession.updatedAt = Date.now();

    // 自动生成标题（基于第一条用户消息）
    if (this.currentSession.title === '新对话' && message.role === MessageRole.USER) {
      this.currentSession.title = this.generateTitle(message.content);
    }

    this.storage.saveSession(this.currentSession);
    this.emit({ type: 'message-added', session: this.currentSession, message: fullMessage });
  }

  /**
   * 获取会话列表
   */
  getSessionList(): ChatSession[] {
    const index = this.storage.loadSessionIndex();
    return Array.from(index.values())
      .filter(item => item.status !== SessionStatus.DELETED)
      .map(item => this.storage.loadSession(item.id))
      .filter((session): session is ChatSession => session !== null)
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  }

  /**
   * 获取归档会话
   */
  getArchivedSessions(): ChatSession[] {
    return this.getSessionList()
      .filter(session => session.status === SessionStatus.ARCHIVED);
  }

  /**
   * 复制订阅
   */
  subscribe(listener: (event: SessionEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 触发事件
   */
  private emit(event: SessionEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 自动生成标题
   */
  private generateTitle(content: string): string {
    const maxLength = 30;
    let title = content.trim();
    if (title.length > maxLength) {
      title = title.substring(0, maxLength) + '...';
    }
    return title;
  }

  /**
   * 加载当前会话
   */
  private loadCurrentSession(): void {
    const savedId = this.storage.loadCurrentSessionId();
    if (savedId) {
      this.currentSession = this.storage.loadSession(savedId);
    }
  }
}

/**
 * 会话事件类型
 */
type SessionEvent =
  | { type: 'created'; session: ChatSession }
  | { type: 'switched'; session: ChatSession }
  | { type: 'updated'; session: ChatSession }
  | { type: 'archived'; session: ChatSession }
  | { type: 'deleted'; session: ChatSession }
  | { type: 'message-added'; session: ChatSession; message: ChatMessage };
```

---

## 5. 交互流程

### 5.1 新建会话流程

```
用户点击"新建会话"按钮
    ↓
创建新的空会话
    ↓
切换到新会话视图
    ↓
清空对话历史显示
    ↓
会话列表中显示"新对话"项（激活状态）
```

### 5.2 切换会话流程

```
用户点击会话列表中的某个会话
    ↓
加载该会话的消息历史
    ↓
更新对话主线程显示
    ↓
更新会话列表选中状态
    ↓
更新会话元数据（标题、时间等）
```

### 5.3 重命名会话流程

```
用户右键点击会话项，选择"重命名"
    ↓
显示重命名对话框
    ↓
用户输入新标题，点击"保存"
    ↓
更新会话标题
    ↓
刷新会话列表显示
```

### 5.4 删除会话流程

```
用户右键点击会话项，选择"删除"
    ↓
显示确认对话框
    ↓
用户确认删除
    ↓
标记会话为已删除（软删除）
    ↓
从列表中移除该项
    ↓
如果删除的是当前会话，显示新建会话提示
```

---

## 6. 与现有设计的整合

### 6.1 与 chat.html 的整合

在现有 `.chat-pro` 布局中添加会话侧边栏：

```html
<section class="chat-pro">
  <!-- 新增：会话侧边栏 -->
  <aside class="session-sidebar" data-session-sidebar>
    <!-- 会话列表内容 -->
  </aside>

  <!-- 新增：分隔符 -->
  <div class="session-splitter" data-session-splitter role="separator"></div>

  <!-- 现有：对话主线程 -->
  <section class="chat-thread">
    <!-- 现有内容 -->
  </section>

  <!-- 现有：证据面板 -->
  <aside class="evidence-panel">
    <!-- 现有内容 -->
  </aside>
</section>
```

### 6.2 状态同步

会话状态需要与以下组件同步：
- `.chat-thread-meta` 中的会话信息显示
- `.chat-history` 中的消息列表
- 证据面板中的引用来源

### 6.3 JavaScript 整合

在 `prototype.js` 中添加会话管理逻辑：

```javascript
// 在 prototype.js 中添加
(function() {
  // ... 现有代码 ...

  if (document.body.classList.contains('page-chat')) {
    const sessionManager = new ChatSessionManager();

    // 初始化会话侧边栏
    const sessionSidebar = document.querySelector('[data-session-sidebar]');
    if (sessionSidebar) {
      initSessionSidebar(sessionSidebar, sessionManager);
    }

    // 初始化会话列表
    renderSessionList(sessionManager);

    // 订阅会话事件
    sessionManager.subscribe((event) => {
      handleSessionEvent(event, sessionManager);
    });

    // 新建会话按钮
    document.querySelector('[data-new-session]')?.addEventListener('click', () => {
      sessionManager.createSession();
      renderSessionList(sessionManager);
      clearChatHistory();
    });

    // 消息发送
    const sendButton = document.querySelector('.composer-send');
    if (sendButton) {
      sendButton.addEventListener('click', () => {
        const input = document.querySelector('.composer-input');
        const content = input?.value.trim();
        if (content) {
          sessionManager.addMessage({
            role: 'user',
            content: content
          });
          input.value = '';
        }
      });
    }
  }

  function initSessionSidebar(sidebar, manager) {
    // 会话搜索
    const searchInput = sidebar.querySelector('[data-session-search]');
    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterSessionList(query);
    });

    // 分组折叠
    sidebar.querySelectorAll('[data-collapse-group]').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.session-group');
        group?.classList.toggle('collapsed');
      });
    });

    // 会话上下文菜单
    sidebar.querySelectorAll('[data-session-menu]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sessionId = btn.closest('[data-session-id]')?.dataset.sessionId;
        showSessionMenu(btn, sessionId);
      });
    });
  }

  function renderSessionList(manager) {
    const sessions = manager.getSessionList();
    const archived = manager.getArchivedSessions();
    // 渲染会话列表...
  }

  function handleSessionEvent(event, manager) {
    switch (event.type) {
      case 'created':
        // 处理会话创建
        break;
      case 'switched':
        // 处理会话切换，加载消息历史
        loadSessionMessages(event.session);
        break;
      case 'updated':
        // 处理会话更新（如重命名）
        updateSessionListItem(event.session);
        break;
      case 'archived':
        // 处理会话归档
        moveSessionToArchived(event.session);
        break;
      case 'deleted':
        // 处理会话删除
        removeSessionFromList(event.session.id);
        break;
    }
  }
})();
```

---

## 7. 实现优先级

### P0 - 核心功能
1. 会话列表展示（当前会话、历史会话）
2. 新建会话
3. 会话切换
4. 消息保存到会话

### P1 - 基础管理
1. 会话重命名
2. 删除会话（带确认）
3. 自动标题生成（基于首条消息）
4. 会话搜索

### P2 - 高级功能
1. 会话归档
2. 会话导出（JSON/Markdown）
3. 会话复制
4. 会话置顶
5. 会话统计（消息数、Token使用）

---

## 8. 可访问性考虑

1. **键盘导航**
   - Tab 键在会话项间导航
   - Enter/Space 键选择会话
   - Escape 键关闭菜单

2. **屏幕阅读器**
   - 会话列表使用语义化列表结构
   - 当前会话使用 `aria-current="page"`
   - 菜单使用 `role="menu"`

3. **焦点管理**
   - 切换会话后焦点保持
   - 模态对话框焦点陷阱

---

## 9. 数据导出格式

### 9.1 JSON 导出

```json
{
  "sessionId": "session_123",
  "title": "叶文洁动机分析",
  "createdAt": "2026-02-19T10:30:00Z",
  "messages": [
    {
      "role": "user",
      "content": "叶文洁在第17章为什么态度更激进？",
      "timestamp": "2026-02-19T10:30:15Z"
    },
    {
      "role": "assistant",
      "content": "激进化不是突变...",
      "timestamp": "2026-02-19T10:30:18Z",
      "citations": [
        {"chapter": "第12章", "paragraph": 5},
        {"chapter": "第17章", "paragraph": 3}
      ]
    }
  ]
}
```

### 9.2 Markdown 导出

```markdown
# 叶文洁动机分析

**导出时间**: 2026-02-19 10:30

---

## 用户
叶文洁在第17章为什么态度更激进？请和第12章对照说明。

## AI
激进化不是突变，而是判断阈值跨过临界点。第12章她仍在"人类是否可修复"区间，第17章已转向"文明必须外力重置"。

**引用**:
- 第12章·第5段
- 第17章·第3段
- 第17章·第6段

---
```

---

## 10. 未来扩展

1. **云端同步**
   - 跨设备会话同步
   - 会话备份与恢复

2. **智能分组**
   - 按主题自动分组
   - 按书籍/章节分组

3. **会话模板**
   - 预设分析模板
   - 快捷提问模板

4. **协作功能**
   - 会话分享
   - 会话评论

---

*设计文档版本: 1.0*
*最后更新: 2026-02-19*
