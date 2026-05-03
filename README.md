# vue3电商平台 

一个基于 Vue 3 + Vite + Element Plus+pinia 的前端电商项目，实现了完整的商品浏览、购物车管理、订单结算、支付等电商核心功能。

## 📋 项目简介

一个现代化的电商平台，提供商品展示、购物车管理、订单结算、在线支付等功能。项目采用 Vue 3 组合式 API，配合 Pinia 进行状态管理，使用 Element Plus 组件库，实现了响应式用户界面和良好的用户体验。

## ✨ 功能特性

### 已实现功能

- **用户认证系统**
  - 账户登录/登出
  - Token 认证与持久化
  - 登录状态自动检查
- **商品浏览**
  - 首页商品分类展示
  - 商品详情页面
  - 商品规格选择 (SKU)
  - 热销商品推荐
  - 24小时热榜
- **购物车管理**
  - 添加/删除商品
  - 数量调整
  - 单选/全选功能
  - 已登录/未登录双模式支持
- **订单结算**
  - 收货地址管理
  - 订单信息确认
  - 配送时间与支付方式选择
  - 订单创建与支付
- **支付功能**
  - 支付倒计时
  - 支付结果回调
- **会员中心**
  - 个人信息展示
  - 订单列表查看
  - 订单状态筛选
  - 分页浏览
- **其他功能**
  - 商品分类导航
  - 面包屑导航
  - 图片懒加载
  - 路由守卫

## 🛠️ 技术栈

### 核心技术

| 技术           | 版本     | 说明       |
| ------------ | ------ | -------- |
| Vue          | 3.3.11 | 前端框架     |
| Vue Router   | 4.2.5  | 路由管理     |
| Pinia        | 2.1.7  | 状态管理     |
| Vite         | 5.0.10 | 构建工具     |
| Element Plus | 2.5.1  | UI 组件库   |
| Axios        | 1.6.5  | HTTP 客户端 |

### 其他依赖

| 技术                          | 说明          |
| --------------------------- | ----------- |
| @vueuse/core                | Vue 组合式工具集  |
| dayjs                       | 日期处理库       |
| pinia-plugin-persistedstate | Pinia 持久化插件 |
| sass                        | CSS 预处理器    |
| unplugin-auto-import        | 自动导入插件      |
| unplugin-vue-components     | 组件自动导入      |

## 📁 项目结构

```
vue-rabbit/
├── .vscode/                  # VS Code 配置
├── public/                   # 静态资源
│   └── favicon.ico
├── src/
│   ├── apis/                 # API 接口定义
│   │   ├── cart.js           # 购物车接口
│   │   ├── category.js       # 分类接口
│   │   ├── checkout.js       # 结算接口
│   │   ├── detail.js         # 详情接口
│   │   ├── home.js           # 首页接口
│   │   ├── layout.js         # 布局接口
│   │   ├── order.js          # 订单接口
│   │   ├── pay.js            # 支付接口
│   │   └── user.js           # 用户接口
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片资源
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/           # 公共组件
│   │   ├── XtxSku/           # SKU 规格选择组件
│   │   │   ├── index.vue
│   │   │   └── power-set.js  # 幂集算法实现
│   │   ├── imageView/        # 图片预览组件
│   │   │   └── index.vue
│   │   └── index.js          # 组件统一导出
│   ├── composables/          # 组合式函数
│   │   └── useCountDown.js   # 倒计时逻辑
│   ├── directives/           # 自定义指令
│   │   └── index.js          # 懒加载指令等
│   ├── router/               # 路由配置
│   │   └── index.js
│   ├── stores/               # Pinia 状态管理
│   │   ├── cartStore.js      # 购物车状态
│   │   ├── categoryStore.js  # 分类状态
│   │   └── userStore.js      # 用户状态
│   ├── styles/               # 样式文件
│   │   ├── element/          # Element Plus 样式覆盖
│   │   │   └── index.scss
│   │   ├── common.scss       # 公共样式
│   │   └── var.scss          # 样式变量
│   ├── utils/                # 工具函数
│   │   └── http.js           # Axios 实例配置
│   ├── views/                # 页面组件
│   │   ├── cartList/         # 购物车页面
│   │   ├── category/         # 分类页面
│   │   ├── checkout/         # 结算页面
│   │   ├── detail/           # 商品详情
│   │   ├── home/             # 首页
│   │   ├── layout/           # 布局组件
│   │   ├── login/            # 登录页面
│   │   ├── member/           # 会员中心
│   │   ├── pay/              # 支付页面
│   │   └── subCategory/      # 子分类页面
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── .eslintrc.cjs             # ESLint 配置
├── .gitignore                # Git 忽略配置
├── index.html                # HTML 模板
├── jsconfig.json             # JS 项目配置
├── package.json              # 项目依赖
└── vite.config.js            # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>


# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查与修复
npm run lint
```

### 访问项目

开发服务器启动后，访问以下地址：

- 本地地址: <http://localhost:5173/>


## 📦 项目配置

### 环境变量

创建 `.env.development` 和 `.env.production` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=http://pcapi-xiaotuxian-front-devtest.itheima.net

# 应用基础 URL
VITE_APP_URL=http://localhost:5173
```

### Vite 配置

主要配置项：

- 路径别名 `@` 指向 `src/`
- Element Plus 按需导入
- SCSS 全局变量自动注入
- 组件自动导入

### 路由配置

路由采用 history 模式，主要路由结构：

- `/` - 布局容器 (Layout)
  - 首页、分类、详情、购物车等
- `/login` - 登录页面

## 🔧 架构说明

### 状态管理

使用 Pinia 管理全局状态：

- **userStore**: 用户信息、登录状态
- **cartStore**: 购物车数据、选中状态
- **categoryStore**: 分类导航数据

### API 请求

- 使用 Axios 封装 HTTP 请求
- 请求拦截器：自动添加 Token
- 响应拦截器：统一错误处理、401 自动跳转登录

### 组件设计

- 公共组件放在 `src/components/`
- 页面组件放在 `src/views/`
- 使用 Vue 3 组合式 API (`<script setup>`)


**4.4 Git 规范**

```bash
# 安装 husky + commitlint
npm install -D husky @commitlint/cli @commitlint/config-conventional

# 提交规范
# feat: 新功能
# fix: 修复 bug
# docs: 文档更新
# style: 代码格式
# refactor: 重构
# test: 测试
# chore: 构建/工具
```
## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目仅供学习使用。

## 📞 联系方式

如有问题或建议，请提交 Issue。

***

**最后更新**: 2026-05-03
