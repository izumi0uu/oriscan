# Hiro Ordinals Explorer

## 代码阅读推荐顺序

### 1. 项目配置与基础
- [next.config.js](./next.config.js)
- [utils/env.ts](./utils/env.ts)
- [utils/constants.ts](./utils/constants.ts) (*)
- [utils/types.ts](./utils/types.ts) (*)

### 2. 核心工具类
- [utils/http/http.ts](./utils/http/http.ts) (*)
- [utils/http/request.ts](./utils/http/request.ts) (*)
- [utils/http/service.ts](./utils/http/service.ts) (*)
- [utils/helpers.ts](./utils/helpers.ts) (*)
- [utils/index.ts](./utils/index.ts) (*)

### 3. 页面与路由
- [app/(explorer)/explore/page.tsx](./app/(explorer)/explore/page.tsx) (*)
- [app/(explorer)/inscription/[iid]/page.tsx](./app/(explorer)/inscription/[iid]/page.tsx) (*)
- [app/(explorer)/block/[bid]/page.tsx](./app/(explorer)/block/[bid]/page.tsx) (*)
- [app/(explorer)/address/[aid]/[type]/page.tsx](./app/(explorer)/address/[aid]/[type]/page.tsx) (*)

### 4. 核心组件
- [components/Header.tsx](./components/Header.tsx) (*)
- [components/Footer.tsx](./components/Footer.tsx) (*)
- [components/SearchBar.tsx](./components/SearchBar.tsx) (*)
- [components/InscriptionRender.tsx](./components/InscriptionRender.tsx) (*)
- [components/InscriptionDetails.tsx](./components/InscriptionDetails.tsx) (*)

### 5. BRC-20相关
- [app/(explorer)/coin/brc20/[id]/page.tsx](./app/(explorer)/coin/brc20/[id]/page.tsx) (*)
- [components/brc20-activity-list.tsx](./components/brc20-activity-list.tsx) (*)
- [app/(explorer)/ranking/brc20/page.tsx](./app/(explorer)/ranking/brc20/page.tsx) (*)

### 6. 集合与展示
- [components/GalleryFull.tsx](./components/GalleryFull.tsx) (*)
- [components/GalleryPreview.tsx](./components/GalleryPreview.tsx) (*)
- [components/InscriptionCard.tsx](./components/InscriptionCard.tsx) (*)

### 7. 数据处理与钩子
- [hooks/useWindowInfiniteScroll.ts](./hooks/useWindowInfiniteScroll.ts) (*)
- [hooks/useMobile.tsx](./hooks/useMobile.tsx) (*)
- [context/unisatWallectContext.tsx](./context/unisatWallectContext.tsx) (*)

### 8. API接口
- [pages/api/inscriptions.ts](./pages/api/inscriptions.ts) (*)
- [pages/api/homepage.ts](./pages/api/homepage.ts) (*)
- [pages/api/block/[bid].ts](./pages/api/block/[bid].ts) (*)

➡️ https://ordinals.hiro.so 🌐

![Ordinals Explorer](public/og-image.png)

## Overview

The Ordinals Explorer is a Next.js (app router) project that uses the [Hiro Ordinals API](https://docs.hiro.so/ordinals).

There are two main parts of this project:

- The explorer `app/(explorer)` — A frontend for exploring ordinal inscriptions
- The preview API `app/(preview)` — An endpoint to render a specific ordinal inscription

## Development

```bash
cp .env.sample .env.local
```

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
