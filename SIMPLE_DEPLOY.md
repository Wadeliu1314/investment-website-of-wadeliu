# 🚀 兔斯基的投资网站 - 一键部署指南

## 部署方式：无需本地安装Node.js，全部在浏览器完成！

---

## 📋 第一步：创建GitHub仓库

### 1. 打开GitHub
访问：https://github.com

### 2. 登录/注册账号

### 3. 创建新仓库
- 点击右上角 **"+"** → **"New repository"**
- 填写：
  - **Repository name**: `investment-website`
  - **Description**: 兔斯基的投资网站
  - **Public**: ✅ 选中
  - **不要勾选** "Add a README file"
- 点击 **"Create repository"**

### 4. 记录仓库URL
创建成功后，页面会显示仓库地址，例如：
```
https://github.com/你的用户名/investment-website.git
```

---

## 📋 第二步：上传网站代码

### 方法A：通过网页上传（最简单）

1. 在GitHub仓库页面，点击 **"uploading an existing file"**
2. 拖入以下文件/文件夹：
   - 整个 `src` 文件夹
   - `package.json`
   - `tsconfig.json`
   - `tailwind.config.ts`
   - `next.config.js`
   - `DEPLOY.md`
3. 填写提交信息：**"Initial commit"**
4. 点击 **"Commit changes"**

### 方法B：通过GitHub Desktop（推荐）

1. 下载GitHub Desktop：https://desktop.github.com
2. 安装并登录
3. **File** → **Add Local Repository**
4. 选择 `investment-website` 文件夹
5. 填写提交信息
6. 点击 **"Publish repository"**

---

## 📋 第三步：部署到Vercel

### 1. 打开Vercel
访问：https://vercel.com

### 2. 登录
- 点击 **"Sign Up"**
- 选择 **"Continue with GitHub"**
- 授权GitHub

### 3. 创建项目
- 点击 **"New Project"**
- 找到 `investment-website` 仓库
- 点击 **"Import"**

### 4. 配置项目
- **Project Name**: `investment-website`
- **Framework Preselect**: Next.js（应该自动识别）
- 其他保持默认
- 点击 **"Deploy"**

### 5. 等待部署
- 等待约1-2分钟
- 看到 🎉 **"Congratulations!"** 就成功了！

---

## 📋 第四步：获取访问地址

### 部署成功后：
1. Vercel会显示你的网站地址
2. 类似：`https://investment-website.vercel.app`
3. **复制这个地址保存好！**

---

## 📱 第五步：手机端访问

### 方式1：浏览器访问
- 用手机浏览器打开上面获得的地址
- 可以收藏到书签

### 方式2：添加到主屏幕（推荐）
- 用Safari（iPhone）或Chrome（Android）打开网站
- 点击浏览器菜单
- 选择 **"添加到主屏幕"**
- 返回主屏幕，点击图标即可访问
- 效果和App一样！📱

---

## 🔄 如何更新网站

### 1. 修改代码
在本地修改 `investment-website` 文件夹中的内容

### 2. 推送到GitHub
- 打开GitHub Desktop
- 填写提交信息（如："更新内容"）
- 点击 **"Push origin"**

### 3. 自动部署
Vercel会自动检测到更新，重新部署！

---

## 📞 获得帮助

### 常见问题

**Q: 部署失败怎么办？**
A: 
1. 检查GitHub仓库是否有代码
2. 查看Vercel部署日志
3. 常见错误：package.json格式问题

**Q: 网站显示空白怎么办？**
A: 
1. 清除浏览器缓存
2. 强制刷新页面

**Q: 如何更新网站？**
A: 
修改代码 → 推送到GitHub → Vercel自动重新部署

---

## ✅ 部署完成！

现在你可以通过以下方式访问网站：

- **电脑端**：直接浏览器打开 `https://你的项目名.vercel.app`
- **手机端**：浏览器打开 → 添加到主屏幕

---

## 📝 需要上传的文件清单

请确保上传以下文件到GitHub：

```
investment-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              ✅ 首页
│   │   ├── layout.tsx            ✅ 布局
│   │   ├── globals.css           ✅ 样式
│   │   └── projects/
│   │       ├── page.tsx         ✅ 项目列表
│   │       ├── new/page.tsx     ✅ 新建项目
│   │       └── [id]/
│   │           ├── page.tsx     ✅ 项目详情
│   │           └── report/page.tsx ✅ 报告
│   ├── components/
│   │   └── ProjectProvider.tsx
│   └── lib/
│       ├── types.ts
│       ├── calculator.ts
│       ├── storage.ts
│       └── store.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🎉 准备好了吗？

**现在开始：**

1. ⏰ 5分钟：创建GitHub仓库
2. ⏰ 5分钟：上传代码
3. ⏰ 2分钟：Vercel部署
4. ⏰ 1分钟：手机端测试

**总共约15分钟，你的网站就能上线！**

---

## 💡 小提示

- Vercel免费版：每月100G流量，完全够用！
- 代码更新：推送到GitHub后自动部署
- 数据存储：浏览器LocalStorage，定期导出备份

---

**有问题随时问我！** 🚀
