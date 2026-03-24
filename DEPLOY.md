# 部署指南脚本

## 前提条件

1. **安装 Node.js**
   - 访问 https://nodejs.org
   - 下载 LTS 版本（18.x 或更高）
   - 安装时勾选"Add to PATH"

2. **安装 Git**
   - 访问 https://git-scm.com
   - 下载并安装

3. **GitHub 账号**
   - 访问 https://github.com 注册账号

---

## 步骤1：推送代码到GitHub

### 1.1 创建GitHub仓库

1. 登录 GitHub：https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写：
   - Repository name: `investment-website`
   - Description: 兔斯基的投资网站
   - 选择 Public
   - 不要勾选 "Add a README file"
4. 点击 "Create repository"

### 1.2 推送代码

打开命令行（PowerShell或CMD），执行：

```bash
# 1. 进入项目目录
cd C:\Users\User\.qclaw\workspace\investment-website

# 2. 初始化Git（如果还没有）
git init

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit - 兔斯基的投资网站"

# 5. 关联GitHub仓库（替换为你的仓库URL）
git remote add origin https://github.com/你的用户名/investment-website.git

# 6. 推送到GitHub
git push -u origin main
```

---

## 步骤2：部署到Vercel

### 2.1 注册/登录Vercel

1. 访问：https://vercel.com
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"
4. 授权 GitHub

### 2.2 部署项目

1. 登录后，点击 "New Project"
2. 在 "Import Git Repository" 中找到 `investment-website`
3. 点击 "Import"
4. 配置：
   - Project Name: `investment-website`（或你喜欢的名字）
   - Framework Preselect: `Next.js`（应该自动识别）
5. 点击 "Deploy"

### 2.3 等待部署

- 等待1-2分钟
- 看到 "Congratulations!" 就成功了
- 会获得一个域名，例如：`investment-website.vercel.app`

---

## 步骤3：访问网站

### 电脑端
直接在浏览器中访问获得的域名，例如：
```
https://investment-website.vercel.app
```

### 手机端
1. 用手机浏览器打开上面的链接
2. 收藏到书签，或添加到主屏幕

---

## 步骤4：配置PWA（可选，让手机像App一样）

### 4.1 创建PWA配置文件

在项目根目录创建 `public/manifest.json`：

```json
{
  "name": "兔斯基的投资网站",
  "short_name": "兔斯基投资",
  "description": "硬科技投资评估与管理平台",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4.2 更新next.config.js

在项目根目录创建或更新 `next.config.js`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig
```

### 4.3 安装PWA插件

```bash
npm install next-pwa
```

### 4.4 重新部署

代码修改后推送到GitHub，Vercel会自动重新部署。

---

## 步骤5：自定义域名（可选）

### 5.1 购买域名

在阿里云、腾讯云或Namecheap购买域名。

推荐：
- `tuzki.vc`（vc后缀适合投资）
- `tuzki.tech`（科技感）
- `invest.tuzki.com`（专业）

### 5.2 配置DNS

1. 登录域名服务商
2. 添加CNAME记录：
   - 主机记录：`www` 或 `@`
   - 记录值：`cname.vercel-dns.com`
3. 等待DNS生效（通常几分钟到几小时）

### 5.3 在Vercel中添加域名

1. 打开Vercel中的项目
2. 进入 "Settings" → "Domains"
3. 添加你的域名
4. 等待验证

---

## 常见问题

### Q: 部署失败怎么办？
A: 
1. 检查GitHub仓库是否有代码
2. 查看Vercel部署日志
3. 常见错误：依赖安装失败，检查package.json

### Q: 网站显示空白怎么办？
A: 
1. 清除浏览器缓存
2. 检查浏览器控制台错误
3. 重新部署

### Q: 如何更新网站？
A: 
1. 修改本地代码
2. `git add .`
3. `git commit -m "更新内容"`
4. `git push`
5. Vercel会自动重新部署

### Q: 数据会丢失吗？
A: 
- 数据存储在浏览器LocalStorage中
- 不同浏览器数据不共享
- 建议定期导出备份

---

## 完整命令汇总

```bash
# 安装依赖
npm install

# 开发模式（本地测试）
npm run dev

# 构建生产版本
npm run build

# 推送更新
git add .
git commit -m "更新说明"
git push
```

---

## 部署完成！

访问你的网站：
```
https://investment-website.vercel.app
```

---

## 技术支持

如果遇到问题：
1. 查看Vercel部署日志
2. 搜索错误信息
3. 联系技术支持
