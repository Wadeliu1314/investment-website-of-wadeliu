# 兔斯基的投资网站 - 快速启动指南

## 🚀 快速开始

### 第1步：安装依赖

```bash
cd investment-website
npm install
```

### 第2步：启动开发服务器

```bash
npm run dev
```

### 第3步：打开浏览器

访问 http://localhost:3000

---

## 📁 项目结构

```
investment-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页/仪表盘
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   └── projects/          # 项目页面
│   │       ├── page.tsx       # 项目列表
│   │       ├── new/           # 新建项目
│   │       │   └── page.tsx
│   │       └── [id]/         # 项目详情
│   │           ├── page.tsx
│   │           └── report/    # 报告生成
│   │               └── page.tsx
│   ├── components/            # React组件
│   │   └── ProjectProvider.tsx
│   └── lib/                  # 核心逻辑
│       ├── types.ts          # 类型定义
│       ├── calculator.ts      # 评分计算
│       ├── storage.ts         # 本地存储
│       └── store.ts          # Zustand状态管理
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 核心功能

### 1. 首页/仪表盘
- 统计数据概览（总项目、平均评分、推荐/不投资）
- 评分分布图表
- 行业分布饼图
- Pipeline状态
- 最近评估项目

### 2. 项目评估
- 项目基本信息（名称、公司、阶段、行业）
- 8维度评估（32个指标）
- 实时计分
- 投资决策建议（70分投资线）
- Pipeline状态管理

### 3. 项目库
- 项目列表展示
- 搜索和筛选
- 排序功能
- 导出JSON/CSV

### 4. 项目详情
- 完整项目信息
- 雷达图展示
- 维度柱状图
- 笔记管理

### 5. 报告生成
- 一键生成投资评估报告
- 支持导出MD/TXT
- 打印功能

---

## 🔄 与小程序数据同步

### 导出数据（小程序）
```javascript
// 小程序中导出
const exportToJSON = () => {
  const projects = getAllProjects();
  const json = JSON.stringify(projects, null, 2);
  // 保存或分享
};
```

### 导入数据（网站）
```javascript
// 网站中导入
const handleImport = (jsonString) => {
  importProjects(jsonString);
};
```

---

## 📊 投资决策规则

与小程序完全一致：

| 评分范围 | 百分制 | 决策 |
|---------|--------|------|
| 9-10分 | 90-100 | 强烈推荐投资 ✅ |
| 7-8.9分 | 70-89 | 推荐投资 ✅ |
| <7分 | <70 | 不投资 ❌ |

**核心原则：总分低于70分的项目，不予投资**

---

## 🛠️ 技术栈

- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **图表**: Recharts
- **存储**: LocalStorage

---

## 📱 功能清单

### MVP已完成
- ✅ 首页仪表盘
- ✅ 8维度项目评估
- ✅ 项目列表（搜索、筛选、排序）
- ✅ 项目详情（雷达图、柱状图）
- ✅ 投资分析报告生成
- ✅ 数据导出（JSON/CSV）
- ✅ Pipeline状态管理


- ✅ 数据导入
- ✅ 笔记管理
- ✅ 响应式设计

---

## 🚀 下一步开发

### 增强功能
- [ ] 数据导入（JSON/CSV）
- [ ] 行业研究模块
- [ ] 项目对比功能
- [ ] 估值工具(DCF)
- [ ] 团队协作

### 高级功能
- [ ] API集成（企查查/天眼查）
- [ ] 自动化报告
- [ ] 移动端优化

---

## 📝 注意事项

1. **数据存储**: 使用浏览器LocalStorage，数据保存在本地
2. **数据同步**: 小程序和网站数据可通过JSON导入导出同步
3. **隐私**: 所有数据存储在本地，不上传服务器

---

## 💡 常见问题

### Q: 如何导入小程序的数据？
A: 在项目列表页面点击"导入"按钮，选择小程序导出的JSON文件即可。

### Q: 数据会丢失吗？
A: 数据存储在浏览器LocalStorage中，清除浏览器数据会导致丢失，建议定期导出备份。

### Q: 可以在手机上使用吗？
A: 网站已支持响应式布局，可在手机浏览器中访问使用。

---

## 📞 支持

如有问题或建议，请联系开发者。
