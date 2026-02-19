# AI Reader 开发计划

## 项目概述

**项目名称**: AI Reader - AI辅助小说阅读器
**目标**: 开发一款桌面应用，通过AI技术辅助用户阅读小说，提供人物关系梳理、时间线分析、事件分析和AI问答功能，提升阅读体验。

---

## 需求总结

### 功能需求
| 功能模块 | 描述 | 优先级 |
|---------|------|--------|
| 文件导入 | 支持 EPUB, TXT, DOC/DOCX 格式 | P0 |
| MOBI导入 | MOBI/AZW 格式（实验性功能，可能不稳定） | P1 |
| 阅读器核心 | 章节导航、阅读进度、书签、阅读设置 | P0 |
| 人物关系图 | 自动/手动提取人物，可视化展示关系 | P0 |
| 时间线分析 | 梳理故事时间线，事件按时间排序 | P0 |
| 事件分析 | 识别关键事件，分析因果关系 | P0 |
| AI问答 | 针对小说内容的智能问答 | P0 |
| AI配置 | 支持配置不同AI API (OpenAI/Claude/Ollama) | P0 |
| 本地LLM | 支持 Ollama 本地模型，实现完全离线AI功能 | P1（V1.1） |
| RAG系统 | 向量检索增强生成，提升问答准确性 | P0 |
| 离线模式 | 网络不可用时基础阅读+本地AI功能可用 | P0 |

### 非功能需求
- **性能**: 大文件(10MB+)流畅加载，响应时间<500ms
- **可用性**: 界面简洁直观，学习成本低
- **兼容性**: 支持 Windows 10+, macOS 10.15+
- **隐私**: 本地存储用户数据，API密钥安全存储
- **中文支持**: 针对中文小说优化NLP处理

### 技术选型
| 层级 | 技术栈 | 说明 |
|-----|-------|------|
| 桌面框架 | Electron 28+ | 跨平台桌面应用 |
| 前端框架 | React 18 + TypeScript | 类型安全，生态丰富 |
| 状态管理 | Zustand | 轻量级，易用 |
| UI组件库 | shadcn/ui + Tailwind CSS | 现代化，可定制 |
| 图表可视化 | React Flow + D3.js | 人物关系图、时间线 |
| 文件解析 | epub.js, mammoth | EPUB/DOCX 格式支持 |
| MOBI解析 | mobi.js (实验性) | MOBI/AZW 格式（实验性功能，可能不稳定） |
| 数据存储 | SQLite (better-sqlite3) | 本地数据库 |
| 向量数据库 | sqlite-vec | 轻量级向量存储，与 SQLite 集成 |
| AI集成 | OpenAI SDK / Claude SDK / Ollama | 多AI提供商支持（含本地模型） |
| Embedding | all-MiniLM-L6-v2 (本地) / text-embedding-3-small (云端) | 文本向量化 |
| Token计算 | tiktoken | 精确计算Token数量 |

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ File Parser │  │   SQLite    │  │    AI Service       │  │
│  │  Service    │  │   Storage   │  │   (Multi-provider)  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         │   IPC Handler Layer             │                 │
│         │  - Typed IPC channels           │                 │
│         │  - Request validation           │                 │
│         │  - Error serialization          │                 │
│         └────────────────┬────────────────┘                 │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    Renderer Process (React)                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    UI Layer                              │ │
│  │  Components (Reader, Graph, Timeline, Chat)             │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    State Layer (Zustand)                 │ │
│  │  - UI State (view mode, sidebar collapsed)              │ │
│  │  - Cache State (loaded chapters, analysis results)      │ │
│  │  - IPC Bridge (invoke main process methods)             │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## IPC 通信协议设计

### IPC 通道定义

```typescript
// electron/ipc/channels.ts
export const IPC_CHANNELS = {
  // 文件操作
  'file:import': { request: ImportRequest, response: ImportResponse },
  'file:parse': { request: ParseRequest, response: ParseResponse },
  'file:getContent': { request: { bookId: string; chapterIndex: number }, response: string },
  'file:getMetadata': { request: { bookId: string }, response: BookMetadata },

  // 数据库操作
  'db:query': { request: QueryRequest, response: QueryResponse },
  'db:mutate': { request: MutateRequest, response: MutateResponse },

  // AI 操作
  'ai:analyze': { request: AnalyzeRequest, response: AnalyzeResponse },
  'ai:chat': { request: ChatRequest, response: ChatResponse },
  'ai:stream:start': { request: ChatRequest, response: { sessionId: string } },
  'ai:stream:cancel': { request: { sessionId: string }, response: void },
  'ai:estimateTokens': { request: { text: string }, response: number },

  // 配置操作
  'config:get': { request: { key: string }, response: unknown },
  'config:set': { request: { key: string; value: unknown }, response: void },
  'config:getAIConfig': { request: void, response: AIConfig },

  // 网络状态
  'network:status': { request: void, response: { online: boolean } },
} as const;

// 带类型的 IPC 响应
interface IPCResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: ErrorCode; message: string; details?: unknown };
}

// 错误码定义
export enum ErrorCode {
  // 文件错误
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_PARSE_FAILED = 'FILE_PARSE_FAILED',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',

  // AI 错误
  AI_API_KEY_INVALID = 'AI_API_KEY_INVALID',
  AI_RATE_LIMITED = 'AI_RATE_LIMITED',
  AI_CONTEXT_TOO_LONG = 'AI_CONTEXT_TOO_LONG',
  AI_RESPONSE_INVALID = 'AI_RESPONSE_INVALID',
  AI_BUDGET_EXCEEDED = 'AI_BUDGET_EXCEEDED',
  AI_OFFLINE = 'AI_OFFLINE',
  AI_TIMEOUT = 'AI_TIMEOUT',

  // 数据库错误
  DB_MIGRATION_FAILED = 'DB_MIGRATION_FAILED',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',

  // IPC 错误
  IPC_RATE_LIMITED = 'IPC_RATE_LIMITED',
  IPC_TIMEOUT = 'IPC_TIMEOUT',
}

// IPC 安全配置
export const IPC_SECURITY_CONFIG = {
  // 速率限制：每个通道每分钟最大请求数
  rateLimits: {
    'file:import': 10,
    'file:parse': 10,
    'ai:chat': 30,
    'ai:analyze': 20,
    'ai:stream:start': 15,
    'default': 60,
  },
  // 超时配置（毫秒）
  timeouts: {
    'file:import': 60000,      // 文件导入 60s
    'ai:chat': 120000,         // AI 对话 120s
    'ai:analyze': 180000,      // AI 分析 180s
    'ai:stream:start': 5000,   // 流式启动 5s
    'default': 30000,          // 默认 30s
  },
  // 消息大小限制
  maxMessageSize: 50 * 1024 * 1024, // 50MB
};

// IPC 限流器
export class IPCRateLimiter {
  private requests: Map<string, number[]> = new Map();

  checkLimit(channel: string, limit: number = IPC_SECURITY_CONFIG.rateLimits.default): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1分钟窗口

    const channelRequests = this.requests.get(channel) || [];
    const recentRequests = channelRequests.filter(t => t > windowStart);

    if (recentRequests.length >= limit) {
      return false; // 超出限制
    }

    recentRequests.push(now);
    this.requests.set(channel, recentRequests);
    return true;
  }
}
```

### Event-based 流式通信设计

> **重要**: AsyncIterable 不支持 Electron IPC 序列化，必须使用 Event-based 模式实现流式响应。

```typescript
// electron/ipc/streaming.ts

// 流式会话管理
interface StreamSession {
  id: string;
  provider: AIProvider;
  abortController: AbortController;
  createdAt: Date;
}

// 主进程：流式处理管理器
export class StreamManager {
  private sessions: Map<string, StreamSession> = new Map();

  // 启动流式会话
  async startStream(
    request: ChatRequest,
    webContents: Electron.WebContents
  ): Promise<string> {
    const sessionId = uuid();
    const abortController = new AbortController();

    this.sessions.set(sessionId, {
      id: sessionId,
      provider: createAIProvider(request.provider),
      abortController,
      createdAt: new Date()
    });

    // 异步处理流式响应
    this.processStream(sessionId, request, webContents).catch(error => {
      webContents.send('ai:stream:error', { sessionId, error: error.message });
    });

    return sessionId;
  }

  // 处理流式响应
  private async processStream(
    sessionId: string,
    request: ChatRequest,
    webContents: Electron.WebContents
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      const stream = session.provider.chatStream(request);

      for await (const chunk of stream) {
        // 检查是否已取消
        if (session.abortController.signal.aborted) {
          webContents.send('ai:stream:cancelled', { sessionId });
          break;
        }

        // 通过事件发送数据块
        webContents.send('ai:stream:chunk', {
          sessionId,
          delta: chunk.delta,
          finishReason: chunk.finishReason
        });
      }

      webContents.send('ai:stream:complete', { sessionId });
    } finally {
      this.sessions.delete(sessionId);
    }
  }

  // 取消流式会话
  cancelStream(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.abortController.abort();
      return true;
    }
    return false;
  }
}

// 渲染进程：流式客户端封装
export class StreamClient {
  private ipcRenderer: Electron.IpcRenderer;
  private listeners: Map<string, Set<(chunk: StreamChunk) => void>> = new Map();

  // 发起流式请求
  async *stream(request: ChatRequest): AsyncGenerator<ChatChunk> {
    const { sessionId } = await ipcRenderer.invoke('ai:stream:start', request);

    const chunkQueue: ChatChunk[] = [];
    let resolve: ((value: IteratorResult<ChatChunk>) => void) | null = null;
    let done = false;

    // 监听流式事件
    const handleChunk = (_: unknown, data: { sessionId: string } & ChatChunk) => {
      if (data.sessionId !== sessionId) return;
      if (resolve) {
        resolve({ value: data, done: false });
        resolve = null;
      } else {
        chunkQueue.push(data);
      }
    };

    const handleComplete = (_: unknown, data: { sessionId: string }) => {
      if (data.sessionId !== sessionId) return;
      done = true;
      if (resolve) {
        resolve({ value: undefined as any, done: true });
      }
    };

    const handleError = (_: unknown, data: { sessionId: string; error: string }) => {
      if (data.sessionId !== sessionId) return;
      done = true;
      if (resolve) {
        resolve({ value: { delta: '', error: data.error }, done: false });
      }
    };

    ipcRenderer.on('ai:stream:chunk', handleChunk);
    ipcRenderer.on('ai:stream:complete', handleComplete);
    ipcRenderer.on('ai:stream:error', handleError);

    try {
      while (!done || chunkQueue.length > 0) {
        if (chunkQueue.length > 0) {
          yield chunkQueue.shift()!;
        } else if (!done) {
          yield new Promise<IteratorResult<ChatChunk>>(r => { resolve = r; });
        }
      }
    } finally {
      ipcRenderer.removeListener('ai:stream:chunk', handleChunk);
      ipcRenderer.removeListener('ai:stream:complete', handleComplete);
      ipcRenderer.removeListener('ai:stream:error', handleError);
    }
  }

  // 取消流式请求
  cancel(sessionId: string): void {
    ipcRenderer.invoke('ai:stream:cancel', { sessionId });
  }
}

// 使用示例（React 组件中）
function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const streamClient = useMemo(() => new StreamClient(), []);

  const sendMessage = async (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    for await (const chunk of streamClient.stream({ messages: [...messages, { role: 'user', content }] })) {
      if (chunk.error) {
        console.error('Stream error:', chunk.error);
        break;
      }
      assistantMessage.content += chunk.delta;
      setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }]);

      if (chunk.finishReason === 'stop') break;
    }
  };

  return <ChatUI messages={messages} onSend={sendMessage} />;
}
```

---

## 数据模型设计

### SQLite Schema

```sql
-- =====================
-- 核心实体表
-- =====================

-- 书籍表
CREATE TABLE books (
  id TEXT PRIMARY KEY,           -- UUID
  title TEXT NOT NULL,
  author TEXT,
  file_path TEXT NOT NULL,
  file_format TEXT NOT NULL,     -- EPUB/MOBI/TXT/DOCX
  file_size INTEGER,
  cover_image BLOB,
  language TEXT DEFAULT 'zh-CN',
  metadata JSON,                 -- 灵活存储其他元数据
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 章节表
CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_index INTEGER NOT NULL,
  title TEXT,
  content TEXT,                  -- 大章节可存为 NULL，使用外部文件
  content_path TEXT,             -- 外部文件路径（大章节）
  start_position INTEGER,
  end_position INTEGER,
  word_count INTEGER,
  is_loaded BOOLEAN DEFAULT 0,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- =====================
-- 人物关系相关表
-- =====================

-- 人物表
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  aliases JSON,                  -- ["别名1", "别名2", "绰号"]
  description TEXT,
  attributes JSON,               -- { "身份": "主角", "特征": "勇敢" }
  first_appearance_chapter TEXT REFERENCES chapters(id),
  last_appearance_chapter TEXT REFERENCES chapters(id),
  mention_count INTEGER DEFAULT 0,
  confidence REAL,               -- AI 提取置信度 0-1
  is_manual BOOLEAN DEFAULT 0,   -- 是否手动添加
  is_main_character BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 人物关系表
CREATE TABLE relationships (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  character_a TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_b TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- FAMILY/FRIEND/ENEMY/LOVER/NEUTRAL/UNKNOWN
  description TEXT,
  strength REAL,                   -- 关系强度 0-1
  source_chapter TEXT REFERENCES chapters(id),
  evidence_text TEXT,              -- 原文证据
  confidence REAL,
  is_manual BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE(character_a, character_b, book_id)
);

-- =====================
-- 时间线事件相关表
-- =====================

-- 时间线事件表
CREATE TABLE timeline_events (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  event_type TEXT,                 -- TURNING_POINT/CONFLICT/CLIMAX/DIALOGUE/DEATH/BIRTH/OTHER
  title TEXT NOT NULL,
  description TEXT,
  story_time TEXT,                 -- 故事内时间（可能模糊，如"三年后"）
  story_time_normalized TEXT,      -- 标准化时间（如可推断）
  story_order INTEGER,             -- 故事顺序序号
  chapter_id TEXT REFERENCES chapters(id),
  location TEXT,
  importance REAL,                 -- 重要性 0-1
  confidence REAL,
  is_manual BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 事件因果关系表
CREATE TABLE event_causality (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  cause_event TEXT NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
  effect_event TEXT NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
  relationship TEXT,               -- DIRECT/INDIRECT/CONDITIONAL
  description TEXT,
  confidence REAL,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE(cause_event, effect_event)
);

-- 事件-人物关联表
CREATE TABLE event_characters (
  event_id TEXT NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role TEXT,                       -- PROTAGONIST/ANTAGONIST/WITNESS/VICTIM/OTHER
  PRIMARY KEY (event_id, character_id)
);

-- =====================
-- AI 对话相关表
-- =====================

-- AI 对话会话表
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT,
  context_chapters JSON,           -- 包含的章节ID列表
  total_tokens INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- AI 对话消息表
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,              -- USER/ASSISTANT/SYSTEM
  content TEXT NOT NULL,
  citations JSON,                  -- [{ chapterId, start, end, text }]
  token_count INTEGER,
  model_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- =====================
-- 阅读相关表
-- =====================

-- 阅读进度表
CREATE TABLE reading_progress (
  book_id TEXT PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
  current_chapter TEXT REFERENCES chapters(id),
  current_position INTEGER,
  percentage REAL,
  total_reading_time INTEGER DEFAULT 0,  -- 秒
  last_read_at DATETIME,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 书签表
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  position INTEGER,
  title TEXT,
  note TEXT,
  color TEXT DEFAULT 'yellow',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 笔记表
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES chapters(id),
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general', -- general/character/event/theme
  related_character TEXT REFERENCES characters(id),
  related_event TEXT REFERENCES timeline_events(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- =====================
-- AI 分析缓存表
-- =====================

-- 分析结果缓存表
CREATE TABLE analysis_cache (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,     -- CHARACTER/TIMELINE/EVENT/SUMMARY
  chapter_range JSON,              -- { start: number, end: number }
  result JSON NOT NULL,
  model_used TEXT,
  tokens_used INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE(book_id, analysis_type, chapter_range)
);

-- =====================
-- 用户配置表
-- =====================

-- 用户设置表
CREATE TABLE user_settings (
  key TEXT PRIMARY KEY,
  value JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI 使用统计表
CREATE TABLE ai_usage_stats (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,              -- YYYY-MM-DD
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  request_count INTEGER DEFAULT 0,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  estimated_cost REAL DEFAULT 0,
  UNIQUE(date, provider, model)
);

-- =====================
-- 索引
-- =====================

CREATE INDEX idx_chapters_book ON chapters(book_id);
CREATE INDEX idx_characters_book ON characters(book_id);
CREATE INDEX idx_characters_main ON characters(book_id, is_main_character);
CREATE INDEX idx_relationships_book ON relationships(book_id);
CREATE INDEX idx_events_book ON timeline_events(book_id);
CREATE INDEX idx_events_chapter ON timeline_events(chapter_id);
CREATE INDEX idx_events_order ON timeline_events(book_id, story_order);
CREATE INDEX idx_chat_sessions_book ON chat_sessions(book_id);
CREATE INDEX idx_bookmarks_book ON bookmarks(book_id);

-- FTS5 全文搜索（支持中文）
CREATE VIRTUAL TABLE chapters_fts USING fts5(
  content,
  content='chapters',
  content_rowid='rowid',
  tokenize='unicode61'  -- 支持中文分词
);
```

### 数据库迁移策略

```typescript
// electron/services/migrations.ts
interface Migration {
  version: number;
  name: string;
  up: (db: Database) => void;
  down: (db: Database) => void;
}

const migrations: Migration[] = [
  { version: 1, name: 'initial_schema', up: createInitialSchema, down: dropAllTables },
  { version: 2, name: 'add_character_aliases', up: addCharacterAliases, down: removeCharacterAliases },
  // 后续迁移...
];

export function runMigrations(db: Database) {
  // 获取当前版本
  const currentVersion = db.prepare('PRAGMA user_version').pluck().get() as number;

  // 按顺序执行未应用的迁移
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration: ${migration.name}`);
      migration.up(db);
      db.prepare(`PRAGMA user_version = ${migration.version}`).run();
    }
  }
}
```

---

## AI Provider 抽象层设计

### Provider 接口定义

```typescript
// electron/services/ai/types.ts
export interface AIProvider {
  readonly name: string;
  readonly displayName: string;
  readonly models: AIModel[];

  // 核心方法
  chat(request: ChatRequest): Promise<ChatResponse>;
  chatStream(request: ChatRequest): AsyncGenerator<ChatChunk>;
  countTokens(text: string): number;

  // 状态检查
  isConfigured(): boolean;
  isAvailable(): Promise<boolean>;
  getMaxContextLength(model: string): number;
}

export interface AIModel {
  id: string;
  displayName: string;
  contextLength: number;
  supportsStreaming: boolean;
  inputPricePer1k: number;  // USD
  outputPricePer1k: number; // USD
}

export interface ChatRequest {
  messages: Message[];
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'error' | 'content_filter';
  model: string;
}

export interface ChatChunk {
  delta: string;
  finishReason?: 'stop' | 'length' | 'error';
}

// AI 配置
export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
}
```

### Provider 实现

```typescript
// electron/services/ai/providers/openai.ts
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  readonly displayName = 'OpenAI';
  readonly models: AIModel[] = [
    { id: 'gpt-4o', displayName: 'GPT-4o', contextLength: 128000, supportsStreaming: true, inputPricePer1k: 0.005, outputPricePer1k: 0.015 },
    { id: 'gpt-4o-mini', displayName: 'GPT-4o Mini', contextLength: 128000, supportsStreaming: true, inputPricePer1k: 0.00015, outputPricePer1k: 0.0006 },
    { id: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', contextLength: 128000, supportsStreaming: true, inputPricePer1k: 0.01, outputPricePer1k: 0.03 },
  ];

  // ... 实现方法
}

// electron/services/ai/providers/anthropic.ts
export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  readonly displayName = 'Anthropic Claude';
  readonly models: AIModel[] = [
    { id: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', contextLength: 200000, supportsStreaming: true, inputPricePer1k: 0.003, outputPricePer1k: 0.015 },
    { id: 'claude-3-5-haiku-20241022', displayName: 'Claude 3.5 Haiku', contextLength: 200000, supportsStreaming: true, inputPricePer1k: 0.001, outputPricePer1k: 0.005 },
  ];

  // ... 实现方法
}

// electron/services/ai/factory.ts
export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider) {
    case 'openai': return new OpenAIProvider(config);
    case 'anthropic': return new AnthropicProvider(config);
    default: throw new Error(`Unknown provider: ${config.provider}`);
  }
}
```

---

## API 密钥安全存储方案

### 使用 Electron safeStorage

```typescript
// electron/services/secureStorage.ts
import { safeStorage } from 'electron';
import Store from 'electron-store';

export class SecureConfigStore {
  // 注意：不使用 encryptionKey 参数，完全依赖 safeStorage 的平台加密能力
  // safeStorage 在 Windows 使用 DPAPI，macOS 使用 Keychain，Linux 使用 Secret Service
  private store = new Store({ name: 'secure-config' });

  // 检查加密是否可用
  isEncryptionAvailable(): boolean {
    return safeStorage.isEncryptionAvailable();
  }

  // 存储API密钥
  setApiKey(provider: string, key: string): boolean {
    if (!key || key.trim() === '') {
      this.store.delete(`apiKeys.${provider}`);
      return true;
    }

    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(key);
      this.store.set(`apiKeys.${provider}`, encrypted.toString('base64'));
      return true;
    } else {
      // 回退方案：警告用户
      console.warn('Encryption not available, API key will be stored in plain text');
      this.store.set(`apiKeys.${provider}`, key);
      return false;
    }
  }

  // 获取API密钥
  getApiKey(provider: string): string | null {
    const stored = this.store.get(`apiKeys.${provider}`) as string;
    if (!stored) return null;

    if (safeStorage.isEncryptionAvailable()) {
      try {
        return safeStorage.decryptString(Buffer.from(stored, 'base64'));
      } catch {
        // 可能是旧的明文存储
        return stored;
      }
    }

    return stored;
  }

  // 删除API密钥
  deleteApiKey(provider: string): void {
    this.store.delete(`apiKeys.${provider}`);
  }

  // 验证密钥是否有效
  async validateApiKey(provider: string, key: string): Promise<boolean> {
    // 实现各provider的密钥验证逻辑
    // ...
  }
}
```

### 平台特定加密
- **Windows**: 使用 DPAPI (Data Protection API)
- **macOS**: 使用 Keychain Access
- **Linux**: 使用 Secret Service API (如 GNOME Keyring)

---

## AI 成本控制机制

### 预算管理

```typescript
// electron/services/costControl.ts
export interface BudgetConfig {
  enabled: boolean;
  dailyLimit: number;      // USD
  monthlyLimit: number;    // USD
  perRequestLimit: number; // USD
  warnThreshold: number;   // 警告阈值百分比
}

export interface CostEstimate {
  promptTokens: number;
  estimatedCompletionTokens: number;
  estimatedCost: number;
  withinBudget: boolean;
}

export class CostController {
  private config: BudgetConfig;
  private usage: Map<string, UsageRecord>; // date -> usage

  // 估算请求成本
  estimateCost(request: ChatRequest, model: AIModel): CostEstimate {
    const promptTokens = this.provider.countTokens(
      request.messages.map(m => m.content).join('\n')
    );
    const estimatedCompletionTokens = request.maxTokens || model.contextLength / 4;
    const estimatedCost =
      (promptTokens / 1000) * model.inputPricePer1k +
      (estimatedCompletionTokens / 1000) * model.outputPricePer1k;

    const todayUsage = this.getTodayUsage();
    const withinBudget = this.config.enabled
      ? todayUsage + estimatedCost <= this.config.dailyLimit
      : true;

    return { promptTokens, estimatedCompletionTokens, estimatedCost, withinBudget };
  }

  // 检查是否需要用户确认
  needsConfirmation(estimate: CostEstimate): boolean {
    return this.config.enabled && (
      estimate.estimatedCost >= this.config.perRequestLimit ||
      !estimate.withinBudget
    );
  }

  // 记录实际使用
  recordUsage(usage: { promptTokens: number; completionTokens: number; cost: number }): void {
    const today = new Date().toISOString().split('T')[0];
    // 记录到数据库...
  }

  // 获取今日使用量
  getTodayUsage(): number {
    const today = new Date().toISOString().split('T')[0];
    // 从数据库查询...
    return 0;
  }
}
```

### 用户提示

在执行高成本操作前显示确认对话框：
- 显示预估 Token 数量和费用
- 显示今日/本月已用额度
- 提供"继续"和"取消"选项
- 可设置"不再提示"

---

## 离线模式设计

### 离线状态检测

```typescript
// electron/services/networkService.ts
import { BrowserWindow, ipcMain } from 'electron';
import dns from 'dns';

export class NetworkService {
  private online = true;
  private windows: BrowserWindow[] = [];

  constructor() {
    // 主进程使用 Node.js DNS 模块检测网络
    // 注意：navigator.onLine 和 window 在主进程中不可用
    this.checkConnectivity();
    // 定期检测（每30秒）
    setInterval(() => this.checkConnectivity(), 30000);

    // 监听渲染进程的网络状态报告（作为辅助）
    ipcMain.on('network:status-report', (_event, status: { online: boolean }) => {
      if (status.online !== this.online) {
        this.online = status.online;
        this.broadcastStatus();
      }
    });
  }

  // 使用 DNS 查询检测网络连通性
  private async checkConnectivity(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        dns.lookup('dns.google', (err) => {
          err ? reject(err) : resolve();
        });
      });
      if (!this.online) {
        this.online = true;
        this.broadcastStatus();
        this.processOfflineQueue();
      }
    } catch {
      if (this.online) {
        this.online = false;
        this.broadcastStatus();
      }
    }
  }

  isOnline(): boolean {
    return this.online;
  }

  registerWindow(window: BrowserWindow): void {
    this.windows.push(window);
  }

  private broadcastStatus(): void {
    const status = { online: this.online };
    this.windows.forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('network:status-changed', status);
      }
    });
  }

  private async processOfflineQueue(): Promise<void> {
    // 从数据库获取排队的请求并重试
  }
}
```

### 离线功能降级策略

| 功能 | 在线模式 | 离线模式 |
|-----|---------|---------|
| 文件导入 | 完全支持 | 完全支持 |
| 阅读器 | 完全支持 | 完全支持 |
| 书签/笔记 | 完全支持 | 完全支持 |
| 人物提取 | AI自动+手动 | 仅手动添加 |
| 关系分析 | AI自动+手动 | 仅手动编辑已有数据 |
| 时间线 | AI自动+手动 | 仅手动编辑已有数据 |
| AI问答 | 完全支持 | 不可用，显示提示 |
| 分析结果缓存 | 可用 | 可用（显示已缓存结果） |

### 离线任务队列

```typescript
// electron/services/offlineQueue.ts
interface QueuedTask {
  id: string;
  type: 'analysis' | 'chat';
  payload: unknown;
  createdAt: Date;
  retryCount: number;
  maxRetries: number;
}

export class OfflineQueue {
  private queue: QueuedTask[] = [];

  addTask(task: Omit<QueuedTask, 'id' | 'createdAt' | 'retryCount'>): string {
    const queuedTask: QueuedTask = {
      ...task,
      id: uuid(),
      createdAt: new Date(),
      retryCount: 0,
    };
    this.queue.push(queuedTask);
    this.saveQueue();
    return queuedTask.id;
  }

  async processQueue(): Promise<void> {
    if (!networkService.isOnline()) return;

    for (const task of this.queue) {
      try {
        await this.executeTask(task);
        this.removeTask(task.id);
      } catch (error) {
        task.retryCount++;
        if (task.retryCount >= task.maxRetries) {
          this.notifyFailure(task, error);
          this.removeTask(task.id);
        }
      }
    }
  }
}
```

---

## 大文件处理策略

### 文件大小限制与警告

| 文件大小 | 处理策略 |
|---------|---------|
| < 5MB | 正常导入 |
| 5MB - 20MB | 显示进度条，正常导入 |
| 20MB - 50MB | 显示警告，建议分卷阅读 |
| > 50MB | 显示警告，要求用户确认后导入 |

### 章节分块加载

```typescript
// electron/services/chunkLoader.ts
export interface ChunkConfig {
  maxTokensPerChunk: number;      // 默认 4000
  overlapTokens: number;          // 默认 200
  maxCachedChapters: number;      // 默认 3
}

export class ChunkLoader {
  private config: ChunkConfig;
  private cache: LRUCache<string, ChapterContent>;

  // 流式解析大文件
  async *parseStream(filePath: string): AsyncGenerator<ChapterChunk> {
    // 使用流式读取，避免一次性加载到内存
  }

  // 按需加载章节
  async loadChapter(bookId: string, chapterIndex: number): Promise<ChapterContent> {
    const cacheKey = `${bookId}:${chapterIndex}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const content = await this.loadFromStorage(bookId, chapterIndex);
    this.cache.set(cacheKey, content);
    return content;
  }

  // 智能预加载
  async prefetch(bookId: string, currentIndex: number): Promise<void> {
    // 预加载前后章节
    const toPrefetch = [currentIndex - 1, currentIndex + 1, currentIndex + 2];
    for (const index of toPrefetch) {
      if (index >= 0 && !this.cache.has(`${bookId}:${index}`)) {
        this.loadChapter(bookId, index).catch(() => {});
      }
    }
  }
}
```

### 内容分块算法

```typescript
// electron/services/contentChunker.ts
export class ContentChunker {
  private encoder: Tiktoken; // 使用 tiktoken

  // 按章节分块（优先）
  chunkByChapter(chapter: Chapter, maxTokens: number = 4000): ContentChunk[] {
    const totalTokens = this.encoder.encode(chapter.content).length;

    if (totalTokens <= maxTokens) {
      return [{ content: chapter.content, tokenCount: totalTokens }];
    }

    // 需要进一步分割
    return this.chunkByParagraph(chapter.content, maxTokens);
  }

  // 按段落分块
  private chunkByParagraph(content: string, maxTokens: number): ContentChunk[] {
    const paragraphs = content.split(/\n\n+/);
    const chunks: ContentChunk[] = [];

    let currentChunk: string[] = [];
    let currentTokens = 0;

    for (const para of paragraphs) {
      const paraTokens = this.encoder.encode(para).length;

      if (currentTokens + paraTokens > maxTokens && currentChunk.length > 0) {
        // 保存当前块
        chunks.push({
          content: currentChunk.join('\n\n'),
          tokenCount: currentTokens,
        });
        // 开始新块（可选保留重叠）
        currentChunk = [para];
        currentTokens = paraTokens;
      } else {
        currentChunk.push(para);
        currentTokens += paraTokens;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        tokenCount: currentTokens,
      });
    }

    return chunks;
  }
}
```

### 内存管理

```typescript
// electron/services/memoryMonitor.ts
export class MemoryMonitor {
  private warningThreshold = 400 * 1024 * 1024;  // 400MB
  private criticalThreshold = 450 * 1024 * 1024; // 450MB

  checkInterval: NodeJS.Timeout;

  start(): void {
    this.checkInterval = setInterval(() => this.check(), 10000);
  }

  stop(): void {
    clearInterval(this.checkInterval);
  }

  private check(): MemoryStatus {
    const usage = process.memoryUsage();
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);

    if (usage.heapUsed > this.criticalThreshold) {
      this.forceCleanup();
      return { status: 'critical', usedMB: heapUsedMB };
    }

    if (usage.heapUsed > this.warningThreshold) {
      this.trimCaches();
      return { status: 'warning', usedMB: heapUsedMB };
    }

    return { status: 'ok', usedMB: heapUsedMB };
  }

  private forceCleanup(): void {
    // 清理所有缓存
    this.trimCaches();
    // 触发 GC（需要 --expose-gc 标志）
    if (global.gc) global.gc();
  }

  private trimCaches(): void {
    // 通知各服务清理缓存
    this.emit('memory:trim');
  }
}
```

---

## 中文内容处理策略

### 中文文本预处理

```typescript
// electron/services/chineseProcessor.ts
export class ChineseTextProcessor {
  // 中文标点规范化
  normalizePunctuation(text: string): string {
    return text
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/。/g, '.')
      .replace(/，/g, ',')
      .replace(/！/g, '!')
      .replace(/？/g, '?')
      .replace(/：/g, ':')
      .replace(/；/g, ';');
  }

  // 检测文本语言
  detectLanguage(text: string): 'zh' | 'en' | 'mixed' {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    const ratio = chineseChars / totalChars;

    if (ratio > 0.7) return 'zh';
    if (ratio < 0.1) return 'en';
    return 'mixed';
  }

  // 智能分句（用于Token计算优化）
  splitSentences(text: string): string[] {
    // 中英文混合分句
    return text.split(/(?<=[。！？.!?])\s*/);
  }
}
```

### AI Prompt 中文优化

```typescript
// electron/services/ai/prompts/chinese.ts
export const CHINESE_PROMPTS = {
  extractCharacters: `你是一位专业的小说分析专家。请从以下中文小说内容中提取人物信息。

**输出格式（JSON）：**
{
  "characters": [
    {
      "name": "人物姓名",
      "aliases": ["别名", "绰号"],
      "description": "人物描述",
      "attributes": { "身份": "...", "特征": "..." },
      "isMainCharacter": true/false,
      "confidence": 0.0-1.0
    }
  ]
}

**注意事项：**
1. 识别中文人名的各种变体（如"小明"、"明哥"可能是同一人）
2. 注意古风/文言文中的人称代词（吾、汝、尔等）
3. 区分同姓不同人（如父亲和儿子同名的情况）
4. 标注置信度：明确提到姓名的为高置信度，仅通过称谓推断的为低置信度

**内容：**
{content}`,

  analyzeRelationships: `分析以下小说内容中人物之间的关系。

**输出格式（JSON）：**
{
  "relationships": [
    {
      "characterA": "人物A姓名",
      "characterB": "人物B姓名",
      "type": "FAMILY|FRIEND|ENEMY|LOVER|NEUTRAL|UNKNOWN",
      "description": "关系描述",
      "strength": 0.0-1.0,
      "evidence": "原文证据",
      "confidence": 0.0-1.0
    }
  ]
}

**关系类型说明：**
- FAMILY: 家庭关系（父母、兄弟、姐妹等）
- FRIEND: 友好关系
- ENEMY: 敌对关系
- LOVER: 恋爱关系
- NEUTRAL: 中立关系
- UNKNOWN: 关系不明

**内容：**
{content}`,

  extractTimeline: `从以下小说内容中提取时间线和事件。

**输出格式（JSON）：**
{
  "events": [
    {
      "title": "事件标题",
      "description": "事件描述",
      "storyTime": "故事内时间（如'三年后'、'春天'）",
      "eventType": "TURNING_POINT|CONFLICT|CLIMAX|DIALOGUE|OTHER",
      "characters": ["涉及人物"],
      "location": "地点",
      "importance": 0.0-1.0
    }
  ],
  "causality": [
    {
      "cause": "原因事件标题",
      "effect": "结果事件标题",
      "relationship": "DIRECT|INDIRECT"
    }
  ]
}

**注意事项：**
1. 识别中文时间表达（如"翌日"、"三天后"、"来年春天"）
2. 处理倒叙、插叙等非线性叙事
3. 标注事件的相对时间顺序

**内容：**
{content}`,
};
```

---

## UI设计规范 (参考 MotherDuck 风格)

### 配色方案
```css
/* 主色调 - 温暖明亮的配色 */
--primary: #6366F1;        /* 主色 - 柔和紫色 */
--primary-light: #818CF8;
--primary-dark: #4F46E5;
--secondary: #F59E0B;      /* 辅助色 - 温暖橙色 */
--accent: #10B981;         /* 强调色 - 清新绿色 */
--background: #FAFAFA;     /* 背景色 */
--surface: #FFFFFF;        /* 卡片背景 */
--text-primary: #1F2937;
--text-secondary: #6B7280;
--border: #E5E7EB;

/* 暗黑模式 */
--dark-background: #111827;
--dark-surface: #1F2937;
--dark-text-primary: #F9FAFB;
--dark-text-secondary: #9CA3AF;

/* 状态色 */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* 离线状态 */
--offline-bg: #FEF3C7;
--offline-text: #92400E;
--offline-border: #F59E0B;
```

### 设计原则
1. **简洁现代**: 扁平化设计，减少视觉噪音
2. **插画点缀**: 在空状态、引导页使用可爱的书本/阅读相关插画
3. **卡片布局**: 圆角卡片(12px radius)，柔和阴影
4. **流畅动画**: 页面切换、展开收起使用平滑过渡
5. **清晰层次**: 通过颜色深浅和间距建立视觉层次
6. **状态反馈**: 离线状态、加载状态、错误状态有明确视觉提示

### 核心页面布局
```
┌─────────────────────────────────────────────────────────────┐
│  Logo    书库  │ 当前书籍  │    人物  时间线  事件  │  设置  │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│   侧边栏       │              主内容区域                      │
│   - 章节列表   │                                             │
│   - 书签       │     (阅读视图 / 人物关系图 / 时间线等)        │
│   - 笔记       │                                             │
│               │                                             │
│               │  ┌──────────────────────────────────────┐   │
│               │  │ 离线提示条（网络不可用时显示）          │   │
│               │  └──────────────────────────────────────┘   │
├───────────────┴─────────────────────────────────────────────┤
│                    AI问答面板 (可收起)                        │
│  [离线时显示: AI功能暂不可用，请检查网络连接]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 实施步骤

### 第一阶段-A: 项目初始化与 IPC 框架 (Step 1a)

**目标**: 搭建项目骨架，实现 IPC 通信基础

**任务清单**:
1. 初始化 Electron + React + TypeScript 项目
   - 使用 Vite 作为构建工具
   - 配置 Electron 主进程和渲染进程
   - 配置 ESLint, Prettier

2. 配置 UI 框架
   - 安装 Tailwind CSS
   - 集成 shadcn/ui 组件库
   - 创建主题配置文件

3. 搭建项目目录结构
```
ai-reader/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 主进程入口
│   ├── preload.ts           # 预加载脚本
│   ├── services/            # 后端服务
│   │   ├── fileParser.ts    # 文件解析
│   │   ├── database.ts      # 数据库操作
│   │   ├── migrations.ts    # 数据库迁移
│   │   ├── aiService.ts     # AI服务
│   │   ├── secureStorage.ts # 安全存储
│   │   ├── costControl.ts   # 成本控制
│   │   ├── networkService.ts# 网络状态
│   │   ├── memoryMonitor.ts # 内存监控
│   │   └── chineseProcessor.ts # 中文处理
│   └── ipc/                 # IPC 通信
│       ├── channels.ts      # 通道定义
│       ├── handlers.ts      # 处理器
│       └── types.ts         # 类型定义
├── src/                      # 渲染进程 (React)
│   ├── components/          # UI组件
│   │   ├── ui/              # 基础UI组件
│   │   ├── reader/          # 阅读器组件
│   │   ├── analysis/        # 分析组件
│   │   ├── chat/            # AI对话组件
│   │   └── common/          # 通用组件（离线提示等）
│   ├── pages/               # 页面
│   ├── stores/              # 状态管理
│   ├── hooks/               # 自定义Hooks
│   ├── services/            # 前端服务
│   ├── types/               # TypeScript类型
│   └── utils/               # 工具函数
├── resources/               # 静态资源
│   └── illustrations/       # 插画素材
└── package.json
```

4. 实现带类型的 IPC 通信框架
   - 定义 IPC 通道和类型
   - 实现请求验证
   - 实现错误序列化
   - 实现速率限制和超时机制

**验收标准**:
- [ ] 项目可正常启动和打包
- [ ] IPC 通信类型安全，通道定义完整
- [ ] IPC 速率限制和超时机制测试通过

---

### 第一阶段-B: 数据库与安全存储 (Step 1b)

**目标**: 实现数据库基础和安全存储

**任务清单**:
1. 配置 SQLite 数据库
   - 创建初始 Schema（含章节存储阈值定义：< 500KB 存数据库，>= 500KB 存外部文件）
   - 实现迁移机制
   - 测试数据库读写

2. 实现安全存储
   - 配置 safeStorage（不使用硬编码密钥）
   - 测试 API 密钥加密存储

3. 创建基础布局组件

**验收标准**:
- [ ] 数据库 Schema 创建成功，迁移机制可用
- [ ] API 密钥加密存储验证通过（无硬编码密钥）
- [ ] 基础UI框架搭建完成

---

### 第二阶段: 文件解析与阅读器核心 (Step 2)

**目标**: 实现多格式文件导入和基础阅读功能

**任务清单**:
1. 实现文件解析器
   - EPUB 解析 (使用 epub.js)
   - MOBI/AZW 解析 (使用 moby，准备 mobi.js 替代方案)
   - TXT 解析 (章节智能分割，支持多种分隔格式)
   - DOCX 解析 (使用 mammoth)
   - 中文编码检测 (GB2312, GBK, UTF-8)

2. 实现文件导入流程
   - 文件选择对话框
   - 文件大小检查和警告
   - 文件验证和错误处理
   - 导入进度显示
   - 书籍元数据提取 (标题、作者、封面)

3. 开发阅读器核心组件
   - 章节内容渲染（虚拟滚动）
   - 目录导航
   - 阅读进度追踪
   - 书签功能
   - 阅读设置 (字体、字号、行距、主题)

4. 实现书库管理
   - 书籍列表展示
   - 书籍搜索
   - 书籍删除
   - 阅读历史记录

5. 实现大文件处理
   - 流式解析
   - 分块加载
   - 内存监控

**验收标准**:
- [ ] 支持 EPUB, MOBI, TXT, DOCX 四种格式导入
- [ ] 格式解析准确率 > 95%，乱码率 < 1%
- [ ] 元数据提取成功率 > 90%
- [ ] 10MB 文件导入时间 < 5秒
- [ ] 50MB 文件导入前显示警告
- [ ] 阅读器核心功能完整可用
- [ ] 书库管理功能正常

---

### 第三阶段: AI服务集成与 RAG 基础 (Step 3)

**目标**: 集成AI服务，实现 RAG 向量检索基础能力

**任务清单**:
1. 实现 AI Provider 抽象层
   - 定义 Provider 接口
   - 实现 OpenAI Provider
   - 实现 Anthropic Provider
   - Provider 工厂模式

2. 实现 AI 配置管理
   - API 提供商选择
   - 密钥配置（加密存储）
   - 模型选择
   - 参数调整 (temperature, max_tokens 等)

3. 实现 RAG 基础设施（**从 Step 7 提前**）
   - 集成 sqlite-vec 向量数据库
   - 实现章节内容的 Embedding 生成
   - 实现向量存储和相似度检索
   - 中文分词优化（jieba 预处理 + FTS5）

4. 实现成本控制
   - 预算配置（日限额、月限额、单次限额）
   - 请求成本估算
   - 使用量统计
   - 高成本操作确认

5. 实现网络状态管理（使用正确的 Node.js API）
   - 在线/离线检测（DNS 查询方式）
   - 离线提示 UI
   - 离线任务队列

6. 实现内容分块策略
   - 章节级分块
   - Token 计数（使用 tiktoken）
   - 上下文窗口管理
   - 中文文本预处理

7. 开发 AI 对话基础组件
   - 对话 UI 组件
   - 消息列表
   - 输入框和发送
   - 流式响应显示
   - 对话历史管理

**验收标准**:
- [ ] AI Provider 接口完整，支持 OpenAI 和 Claude
- [ ] API 密钥使用 safeStorage 加密存储（无硬编码密钥）
- [ ] RAG 向量检索基础功能可用
- [ ] 成本估算准确，预算控制生效
- [ ] 离线检测正常（使用 Node.js DNS 方式），提示清晰
- [ ] AI 对话基础功能可用
- [ ] Token 消耗可视化显示

---

### 第四阶段: 人物关系分析 (Step 4)

**目标**: 实现人物提取和关系图谱可视化

**任务清单**:
1. 实现人物提取
   - AI 提取主要人物（使用中文优化 Prompt）
   - 人物属性识别 (姓名、别名、身份、特征)
   - 人物出现频率统计
   - 同名人物区分处理
   - 手动添加/编辑人物

2. 实现关系分析
   - AI 分析人物关系
   - 关系类型分类 (家庭、朋友、敌对、恋爱等)
   - 关系强度评估
   - 关系时间节点

3. 开发人物关系图组件
   - 使用 React Flow 实现交互式图谱
   - 节点拖拽和布局
   - 关系线样式区分
   - 缩放和平移
   - 节点详情面板

4. 实现人物面板
   - 人物列表
   - 人物搜索
   - 人物详情卡片
   - 人物筛选

5. 实现离线降级
   - 离线时仅支持手动操作
   - 显示已缓存的分析结果

**验收标准**:
- [ ] 在测试集（5部不同类型中文小说）上，主要人物（出场 > 10 次）提取召回率 > 80%
- [ ] 人物别名合并准确率 > 85%
- [ ] 关系图谱可视化清晰
- [ ] 支持手动修正 AI 分析结果
- [ ] 人物关系可导出为 JSON
- [ ] 离线模式降级正常

---

### 第五阶段: 时间线分析 (Step 5)

**目标**: 实现故事时间线梳理和可视化

**任务清单**:
1. 实现时间线提取
   - AI 识别时间节点
   - 中文时间表达解析（"翌日"、"三年后"等）
   - 事件关联人物
   - 事件地点提取
   - 时间顺序推理（处理倒叙、插叙）

2. 开发时间线可视化组件
   - 水平/垂直时间线切换
   - 事件节点展示
   - 时间缩放
   - 事件详情展开

3. 实现事件关联
   - 事件因果关系
   - 事件涉及人物高亮
   - 跳转到原文位置

4. 时间线交互功能
   - 时间范围筛选
   - 人物事件筛选
   - 事件搜索
   - 手动添加/编辑事件

5. 实现离线降级

**验收标准**:
- [ ] 时间线按故事时间顺序排列，顺序准确率 > 85%
- [ ] 中文时间表达解析正常
- [ ] 事件与人物、章节关联正确
- [ ] 可视化清晰易读
- [ ] 支持用户手动调整
- [ ] 离线模式降级正常

---

### 第六阶段: 事件分析 (Step 6)

**目标**: 实现关键事件识别和深度分析

**任务清单**:
1. 实现事件识别
   - AI 识别关键转折点
   - 冲突事件提取
   - 情感高潮识别
   - 重要对话提取

2. 开发事件分析面板
   - 事件列表视图
   - 事件分类标签
   - 事件重要性排序
   - 事件摘要

3. 实现因果关系分析
   - 事件因果链可视化
   - 前置事件追踪
   - 后续影响分析

4. 事件与阅读联动
   - 事件定位到原文
   - 阅读时事件提示
   - 章节事件概览

5. 实现离线降级

**验收标准**:
- [ ] 在预设测试集（50个已知关键事件）中识别出 > 75%（38个以上）
- [ ] 因果关系展示清晰
- [ ] 事件与原文位置正确关联
- [ ] 分析结果可导出
- [ ] 离线模式降级正常

---

### 第七阶段: AI问答优化 (Step 7)

**目标**: 增强 AI 问答能力，支持深度小说讨论

**任务清单**:
1. 增强 RAG 检索能力（基础 RAG 已在 Step 3 实现）
   - 对话上下文维护
   - 上下文压缩策略
   - 多轮对话相关内容检索
   - 混合检索（向量 + 全文）

2. 开发预设问答模板
   - 人物相关问题
   - 剧情相关问题
   - 主题相关问题
   - 写作技巧问题

3. 实现引用定位
   - 回答引用原文
   - 点击跳转原文位置
   - 引用高亮显示
   - 引用准确性验证

4. 对话管理功能
   - 对话历史保存
   - 对话搜索
   - 对话导出

5. 实现离线提示
   - 离线时显示友好提示
   - 指导用户恢复网络

**验收标准**:
- [ ] 预设 10 个标准问题测试，回答相关性人工评分平均 > 4 分（5 分制）
- [ ] 回答引用准确性 > 90%（引用确实存在于原文）
- [ ] 预设模板使用便捷
- [ ] 对话历史完整保存
- [ ] 离线提示清晰友好

---

### 第八阶段: 优化与发布 (Step 8)

**目标**: 性能优化、测试和发布准备

**任务清单**:
1. 性能优化
   - 大文件加载优化
   - 内存管理（< 500MB 目标）
   - 渲染性能优化
   - 启动速度优化

2. 用户体验优化
   - 快捷键支持
   - 拖拽导入文件
   - 自动保存
   - 错误提示优化
   - 离线状态提示优化

3. 测试
   - 单元测试（关键模块覆盖率 > 80%）
   - 集成测试
   - 端到端测试
   - 性能测试
   - 中文小说测试集验证

4. 打包与发布
   - Windows 安装包
   - macOS DMG
   - 自动更新机制
   - 用户文档

**验收标准**:
- [ ] 应用启动时间 < 3秒
- [ ] 10MB 文件打开时间 < 3秒
- [ ] 章节切换 < 200ms
- [ ] AI 响应首字时间 < 2秒
- [ ] 内存占用 < 500MB（单书）
- [ ] 关键功能测试覆盖率 > 80%
- [ ] 安装包正常生成

---

## 风险与缓解措施

| 风险 | 可能性 | 影响 | 缓解措施 |
|-----|-------|------|---------|
| AI分析准确率不足 | 中 | 高 | 支持手动修正，迭代优化中文 Prompt，建立测试集验证 |
| 大文件内存溢出 | 中 | 高 | 流式解析，分块加载，虚拟滚动，内存监控 |
| 文件解析兼容性问题 | 高 | 中 | 充分测试各种格式变体，错误提示友好，准备替代方案 |
| API调用成本过高 | 中 | 中 | 预算控制，成本估算，本地缓存，用户提醒 |
| Electron打包体积过大 | 低 | 低 | 代码分割，按需加载 |
| MOBI格式解析失败 | 中 | 中 | 验证 moby 库可用性，准备 mobi.js 替代，作为实验性功能 |
| 中文编码问题 | 中 | 中 | 自动检测编码（GB2312, GBK, UTF-8），提供手动选择 |
| 离线体验差 | 低 | 中 | 缓存策略，降级方案，清晰的状态提示 |

---

## 技术债务管理

1. **代码规范**: 使用 ESLint + Prettier 强制统一
2. **类型安全**: 严格 TypeScript 配置
3. **文档**: 关键模块编写 JSDoc 注释
4. **测试**: 核心业务逻辑必须有单元测试
5. **IPC 类型**: 所有 IPC 通道必须有类型定义
6. **错误处理**: 统一使用 ErrorCode 枚举

---

## 验收标准总结

### 功能验收
- [ ] 支持导入 EPUB, MOBI/AZW, TXT, DOC/DOCX 格式
- [ ] 阅读器基础功能完整 (导航、进度、书签、设置)
- [ ] 人物关系图谱可视化，支持手动编辑
- [ ] 时间线按故事顺序排列，事件关联正确
- [ ] 关键事件识别准确，因果关系清晰
- [ ] AI问答响应准确，支持引用定位
- [ ] AI API配置灵活，支持多提供商
- [ ] 离线模式降级正常，基础功能可用
- [ ] API密钥加密存储

### 性能验收
- [ ] 应用启动时间 < 3秒
- [ ] 10MB文件导入 < 5秒
- [ ] 章节切换 < 200ms
- [ ] AI响应首字时间 < 2秒
- [ ] 内存占用 < 500MB (单书)

### 体验验收
- [ ] UI 简洁美观，符合 MotherDuck 设计风格
- [ ] 操作直观，无需查看文档即可使用
- [ ] 错误提示清晰友好
- [ ] 支持暗黑模式
- [ ] 离线状态提示清晰
- [ ] 成本控制提示到位

### 中文内容验收
- [ ] 中文编码自动检测正确
- [ ] 中文小说人物提取准确
- [ ] 中文时间表达解析正常

---

## 后续迭代方向

1. **V1.1**: 本地AI模型支持 (Ollama集成)，支持更多格式 (PDF, FB2)
2. **V1.2**: 云同步功能
3. **V1.3**: 社区功能 (笔记分享、讨论)
4. **V2.0**: AI生成续写、角色扮演

---

## 修订记录

| 版本 | 日期 | 修订内容 |
|-----|------|---------|
| v1.0 | 2026-02-17 | 初始计划 |
| v1.1 | 2026-02-17 | 根据专家评审修订：补充数据模型、IPC协议、安全存储、离线模式、AI Provider抽象、成本控制、中文处理、大文件策略 |
| v1.2 | 2026-02-17 | **共识审查修订**：<br>• C1: 修复 NetworkService 使用正确的 Node.js DNS API<br>• C2: 移除硬编码加密密钥，完全依赖 safeStorage<br>• C3: 添加 IPC 速率限制和超时机制<br>• M1: 本地LLM（Ollama）调整为 P1（V1.1）<br>• M2: RAG 系统从 Step 7 提前到 Step 3<br>• M3: Step 1 拆分为 Step 1a/1b<br>• M4: 定义章节存储阈值（500KB）<br>• 更新后续迭代方向顺序 |

---

*计划创建时间: 2026-02-17*
*最后修订时间: 2026-02-17*
*预计开发周期: 8个阶段，建议采用迭代开发*
