# ShortLink Platform 部署指南

## 概述

ShortLink Platform 是一个基于 Cloudflare Workers 构建的短链接平台，具有以下特点：

- **无请求量限制**：基于 Cloudflare 全球网络，可处理无限请求
- **完善的管理后台**：基于 React + TypeScript 的现代化管理界面
- **数据分析**：详细的点击统计、地理位置、设备分析
- **中间页面**：可选的带倒计时中间页面
- **自定义后缀**：支持自定义短链接后缀

## 系统架构

```txt
┌─────────────────────────────────────────────────────────────┐
│                        用户请求                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Workers                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ 短链接跳转   │  │  Admin API  │  │   中间页面渲染       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌─────────┐    ┌──────────┐    ┌──────────┐
        │LINKS_KV │    │ANALYTICS │    │ ADMIN_KV │
        │链接数据  │    │  KV      │    │ 管理员数据 │
        └─────────┘    │ 统计数据  │    └──────────┘
                       └──────────┘
```

## 前置要求

1. [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
2. [Node.js](https://nodejs.org/) 18+ 和 npm/yarn
3. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## 部署步骤

### 第一步：安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 第二步：登录 Cloudflare

```bash
wrangler login
```

### 第三步：创建 KV 命名空间

```bash
# 创建链接数据 KV
wrangler kv:namespace create "LINKS_KV"
wrangler kv:namespace create "LINKS_KV" --preview

# 创建分析数据 KV
wrangler kv:namespace create "ANALYTICS_KV"
wrangler kv:namespace create "ANALYTICS_KV" --preview

# 创建管理员数据 KV
wrangler kv:namespace create "ADMIN_KV"
wrangler kv:namespace create "ADMIN_KV" --preview
```

记录每个命令输出的 namespace ID，稍后需要更新到 `wrangler.toml`。

### 第四步：配置 Worker

1. 复制 `wrangler.toml.example` 为 `wrangler.toml`：

```bash
cd backend
cp wrangler.toml.example wrangler.toml
```

2. 编辑 `wrangler.toml`，更新以下内容：

```toml
name = "your-worker-name"  # 你的 Worker 名称

[vars]
BASE_URL = "https://your-worker.your-subdomain.workers.dev"
ADMIN_DASHBOARD_URL = "https://your-admin-dashboard-url.pages.dev"

[[kv_namespaces]]
binding = "LINKS_KV"
id = "your_links_kv_namespace_id"  # 替换为实际的 namespace ID
preview_id = "your_preview_id"

[[kv_namespaces]]
binding = "ANALYTICS_KV"
id = "your_analytics_kv_namespace_id"
preview_id = "your_preview_id"

[[kv_namespaces]]
binding = "ADMIN_KV"
id = "your_admin_kv_namespace_id"
preview_id = "your_preview_id"
```

### 第五步：设置密钥

```bash
# 设置 JWT 密钥（用于会话签名，建议使用随机字符串）
wrangler secret put JWT_SECRET
# 输入你的密钥，例如：your-super-secret-jwt-key-2024
```

### 第六步：部署 Worker

```bash
wrangler deploy
```

部署成功后，会显示你的 Worker URL，例如：
```
https://shortlink-platform.your-subdomain.workers.dev
```

## 部署管理后台

### 第一步：配置环境变量

```bash
cd ../admin-dashboard
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=https://your-worker.your-subdomain.workers.dev
```

### 第二步：安装依赖并构建

```bash
npm install
npm run build
```

### 第三步：部署到 Cloudflare Pages

#### 方式一：通过 Wrangler 部署

```bash
wrangler pages deploy dist --project-name=shortlink-admin
```

#### 方式二：通过 Git 集成自动部署

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建 Pages 项目
3. 连接 GitHub 仓库
4. 设置构建命令：`npm run build`
5. 设置输出目录：`dist`
6. 添加环境变量：`VITE_API_BASE_URL`

### 第四步：更新 Worker 配置

部署管理后台后，获取 Pages 的 URL（例如 `https://shortlink-admin.pages.dev`），更新 Worker 的 `wrangler.toml`：

```toml
[vars]
ADMIN_DASHBOARD_URL = "https://shortlink-admin.pages.dev"
```

然后重新部署 Worker：

```bash
wrangler deploy
```

## 初始登录

部署完成后，使用默认账号登录：

- **用户名**: `admin`
- **密码**: `admin123`

**重要**：登录后请立即修改默认密码！

## 配置自定义域名（可选）

### Worker 自定义域名

1. 在 Cloudflare Dashboard 中进入你的 Worker
2. 点击 "Triggers" 标签
3. 点击 "Add Custom Domain"
4. 输入你的域名（例如 `go.yourdomain.com`）

### Pages 自定义域名

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 "Custom Domains" 标签
3. 点击 "Set up a custom domain"
4. 按照指引完成配置

## 功能说明

### 短链接格式

- 默认格式：`https://your-domain.com/s/xxxxxx`
- 自定义后缀：`https://your-domain.com/s/my-custom-link`

### 中间页面

创建链接时可选择：
- **显示中间页面**：用户访问短链接时先显示带倒计时的中间页，倒计时结束后自动跳转
- **直接跳转**：用户访问短链接后直接跳转到目标页面

### 数据分析

每个短链接提供详细的数据分析：
- 总点击量和每日趋势
- 24小时分布
- 设备类型（桌面/移动/平板）
- 浏览器分布
- 地理位置（国家/地区）

## 安全建议

1. **修改默认密码**：首次登录后立即修改 admin 密码
2. **使用强密码**：密码应包含大小写字母、数字和特殊字符
3. **定期更换 JWT 密钥**：建议每 3-6 个月更换一次
4. **启用 HTTPS**：使用自定义域名时确保启用 HTTPS
5. **设置访问限制**：可通过 Cloudflare Access 限制管理后台访问

## 故障排除

### Worker 部署失败

检查 `wrangler.toml` 配置是否正确，特别是 KV namespace ID。

### API 返回 401 错误

检查 `VITE_API_BASE_URL` 是否配置正确，以及 JWT_SECRET 是否已设置。

### 数据分析不显示

确保 ANALYTICS_KV 命名空间已正确创建并配置在 `wrangler.toml` 中。

### 短链接无法访问

检查 LINKS_KV 命名空间配置，以及 Worker 的 BASE_URL 变量是否正确。

## 更新部署

### 更新 Worker

```bash
cd backend
wrangler deploy
```

### 更新管理后台

```bash
cd admin-dashboard
npm run build
wrangler pages deploy dist --project-name=shortlink-admin
```

## 备份数据

定期备份 KV 数据：

```bash
# 导出链接数据
wrangler kv:key list --binding=LINKS_KV --limit=10000 > links_backup.json

# 导出分析数据
wrangler kv:key list --binding=ANALYTICS_KV --limit=10000 > analytics_backup.json
```

## 技术支持

如有问题，请查看：
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare KV 文档](https://developers.cloudflare.com/kv/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
