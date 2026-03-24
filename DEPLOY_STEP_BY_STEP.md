# 兔斯基的投资网站 - 一步步图解部署指南

## 🚀 5分钟完成部署

---

## 第一步：创建GitHub仓库

### 1. 打开GitHub
```
在浏览器中打开：https://github.com
```

### 2. 登录或注册
- 如果没有账号，点击 "Sign up" 注册
- 如果有账号，点击 "Sign in" 登录

### 3. 创建新仓库
```
1. 点击页面右上角的 "+" 按钮
2. 选择 "New repository"
```

### 4. 填写仓库信息
```
Repository name: investment-website
Description: 兔斯基的投资网站
Public: ☑️ 勾选（选择Public）
☑️ Add a README file: 不要勾选！
☑️ Add .gitignore: 选择 None
☑️ Choose a license: 选择 None
```

### 5. 点击创建
```
点击绿色按钮 "Create repository"
```

---

## 第二步：上传网站代码

### 方法A：网页上传（最简单）

#### 1. 进入仓库页面
你会看到类似这样的页面：
```
Quick setup — if you've done this kind of thing before
or
Choose a template
Get started by creating a new file, or by connecting an existing repository from your IDE.
```

#### 2. 点击上传文件
```
点击 "uploading an existing file"
```

#### 3. 选择要上传的文件

**需要上传的文件（按顺序）：**

1. 📁 **src文件夹** - 整个文件夹拖入
2. 📄 **package.json** - 文件
3. 📄 **tsconfig.json** - 文件
4. 📄 **tailwind.config.ts** - 文件

**拖入顺序：**
```
首先拖入 src 文件夹（整个文件夹）

然后逐个拖入：
- package.json
- tsconfig.json  
- tailwind.config.ts
```

#### 4. 提交上传
```
Commit message: Initial commit - 兔斯基的投资网站
点击绿色按钮 "Commit changes"
```

---

## 第三步：部署到Vercel

### 1. 打开Vercel
```
在浏览器中打开：https://vercel.com
```

### 2. 登录
```
点击 "Sign Up"
选择 "Continue with GitHub"
完成GitHub授权
```

### 3. 创建新项目
```
1. 点击 "New Project"
2. 在列表中找到 "investment-website"
3. 点击 "Import"
```

### 4. 配置并部署
```
Project Name: investment-website
Framework Preselect: Next.js (应该自动识别)

点击绿色按钮 "Deploy"
```

### 5. 等待部署
```
等待1-2分钟...
看到 "Congratulations!" 即成功！
```

### 6. 获取网站地址
```
复制显示的域名，例如：
https://investment-website.vercel.app
```

---

## 第四步：手机端访问

### iPhone (Safari)
```
1. 打开上面的链接
2. 点击底部分享按钮
3. 选择 "添加到主屏幕"
4. 返回主屏幕，点击图标
```

### Android (Chrome)
```
1. 打开上面的链接
2. 点击右上角三个点
3. 选择 "添加到主屏幕"
4. 返回主屏幕，点击图标
```

---

## 📁 需要上传的文件清单

### 文件结构
```
investment-website/
├── src/                           📁 整个文件夹拖入
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── projects/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── report/page.tsx
│   ├── components/
│   │   └── ProjectProvider.tsx
│   └── lib/
│       ├── types.ts
│       ├── calculator.ts
│       ├── storage.ts
│       └── store.ts
├── package.json                   📄 拖入
├── tsconfig.json                  📄 拖入
└── tailwind.config.ts            📄 拖入
```

---

## ❓ 常见问题

### Q: 找不到某些文件？
A: 确保你在正确的文件夹 `investment-website` 中

### Q: 部署失败怎么办？
A: 
1. 检查是否上传了所有必要文件
2. 查看Vercel的错误日志
3. 常见问题：package.json格式问题

### Q: 如何更新网站？
A: 
1. 修改本地代码
2. 重新上传覆盖
3. Vercel会自动重新部署

---

## ✅ 完成后

**访问地址：** `https://你的项目名.vercel.app`

**电脑端：** 直接浏览器打开
**手机端：** 打开链接 → 添加到主屏幕

---

## 🎉 恭喜！

你的网站已经可以访问了！

如果有任何问题，随时问我！
