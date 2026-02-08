# ShortLink Platform

一个基于 Cloudflare Workers 构建的现代化短链接平台，具有完善的管理后台和数据分析功能。

## ✨ 特性

- **🚀 无请求量限制**：基于 Cloudflare 全球边缘网络，可处理无限请求
- **🎨 现代化管理后台**：React + TypeScript + Tailwind CSS 构建
- **📊 详细数据分析**：点击统计、地理位置、设备分析、浏览器分布
- **⏱️ 中间页面**：可选的带倒计时中间页面，支持自定义等待时间
- **🔗 自定义后缀**：支持自定义短链接后缀（如 `/s/my-link`）
- **🔒 安全认证**：JWT  Token 认证，支持密码修改
- **⚡ 极速响应**：全球 CDN 加速，毫秒级响应
- **💰 零成本部署**：使用 Cloudflare 免费套餐即可部署

## 🏗️ 项目结构

```
shortlink-platform/
├── backend/              # Cloudflare Worker 后端
│   ├── worker.js         # 主 Worker 代码
│   ├── wrangler.toml     # Wrangler 配置
│   └── package.json
├── admin-dashboard/      # React 管理后台
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── lib/          # API 客户端
│   │   └── types/        # TypeScript 类型
│   ├── package.json
│   └── ...
└── docs/                 # 文档
    └── DEPLOYMENT.md     # 部署指南
```

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare 账号

### 部署步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/shortlink-platform.git
cd shortlink-platform
```

2. **部署后端**

```bash
cd backend
npm install -g wrangler
wrangler login

# 创建 KV 命名空间
wrangler kv:namespace create "LINKS_KV"
wrangler kv:namespace create "ANALYTICS_KV"
wrangler kv:namespace create "ADMIN_KV"

# 更新 wrangler.toml 中的 namespace ID
# 设置 JWT 密钥
wrangler secret put JWT_SECRET

# 部署
wrangler deploy
```

3. **部署管理后台**

```bash
cd ../admin-dashboard
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 VITE_API_BASE_URL

npm run build
wrangler pages deploy dist --project-name=shortlink-admin
```

详细部署指南请查看 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 📖 使用说明

### 管理后台

1. 访问管理后台 URL（如 `https://shortlink-admin.pages.dev`）
2. 使用默认账号登录：
   - 用户名：`admin`
   - 密码：`admin123`
3. **立即修改默认密码**

### 创建短链接

1. 登录管理后台
2. 点击 "创建短链接"
3. 输入目标 URL
4. 可选：设置自定义后缀、标题、描述
5. 选择是否显示中间页面及倒计时时间
6. 点击创建

### 短链接格式

- 默认格式：`https://your-domain.com/s/xxxxxx`
- 自定义后缀：`https://your-domain.com/s/my-custom-link`

## 📊 数据分析

每个短链接提供详细的数据分析：

- **总点击量和每日趋势**：了解链接的整体表现
- **24小时分布**：找出访问高峰期
- **设备类型**：桌面、移动、平板分布
- **浏览器分布**：Chrome、Firefox、Safari 等
- **地理位置**：访问者的国家/地区分布

## 🔧 配置选项

### Worker 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `BASE_URL` | Worker 基础 URL | `https://go.example.com` |
| `ADMIN_DASHBOARD_URL` | 管理后台 URL | `https://admin.example.com` |
| `JWT_SECRET` | JWT 签名密钥 | 随机字符串 |

### 创建链接选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `url` | 目标 URL（必填） | - |
| `customSuffix` | 自定义后缀 | 随机生成 |
| `title` | 链接标题 | - |
| `description` | 链接描述 | - |
| `showInterstitial` | 显示中间页面 | `true` |
| `delay` | 倒计时时间（秒） | `5` |
| `expiresAt` | 过期时间戳 | - |

## 🛡️ 安全

- JWT Token 认证
- 密码 SHA-256 加密存储
- IP 地址哈希化处理（保护用户隐私）
- 支持 HTTPS

## 📝 API 文档

### 认证

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

### 创建短链接

```http
POST /api/links
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "customSuffix": "my-link",
  "showInterstitial": true,
  "delay": 5
}
```

### 获取链接列表

```http
GET /api/links?page=1&limit=50
Authorization: Bearer <token>
```

### 获取数据分析

```http
GET /api/analytics/:shortCode?days=30
Authorization: Bearer <token>
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
