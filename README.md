# 在线匿名投票系统

基于 React + TypeScript + Vite + Supabase 构建的在线匿名投票系统，支持任何人免登录创建和投票。

## 功能特性

- ✅ 任何人都可以创建投票，无需登录
- ✅ 任何人都可以匿名投票，无需登录
- ✅ 支持单选/多选模式
- ✅ 实时公开投票结果
- ✅ IP + localStorage 双重防刷票（24小时限制）
- ✅ 完全响应式，支持手机访问
- ✅ 纯前端，可静态部署

## 部署

### 1. Supabase 设置

1. 创建 Supabase 项目
2. 创建两张表：

**polls 表:**
```sql
create table polls (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  options jsonb not null,
  allow_multiple boolean not null default false,
  created_at timestamptz default now()
);
```

**votes 表:**
```sql
create table votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references polls(id) on delete cascade not null,
  selected_options text[] not null,
  voter_ip text,
  voter_fingerprint text not null,
  created_at timestamptz default now()
);
```

3. 开启 RLS (Row Level Security)，并添加策略：
```sql
-- 允许匿名读取和创建
create policy "Anonymous can read polls" on polls for select using (true);
create policy "Anonymous can create polls" on polls for insert with check (true);

create policy "Anonymous can read votes" on votes for select using (true);
create policy "Anonymous can create votes" on votes for insert with check (true);
```

### 2. 前端配置

复制 `.env.example` 为 `.env.local`，填入你的 Supabase 信息：

```
VITE_SUPABASE_URL=你的项目 URL
VITE_SUPABASE_ANON_KEY=你的 anon key
```

### 3. 安装和构建

```bash
npm install
npm run build
```

把 `dist/` 目录部署到任何静态网站托管服务即可。

## 开发

```bash
npm run dev
```

## 许可证

MIT
