# Router 配置說明

本專案使用 `unplugin-vue-router` 進行自動路由生成。

## 自動路由

路由會根據 `src/pages/` 目錄下的文件自動生成：

| 文件路徑                  | 路由路徑     | 說明                        |
| ------------------------- | ------------ | --------------------------- |
| `src/pages/index.vue`     | `/`          | 首頁 - 多層級表格展示       |
| `src/pages/charts.vue`    | `/charts`    | 圖表展示頁面 - ECharts 示例 |
| `src/pages/i18n-demo.vue` | `/i18n-demo` | 多語系示範頁面              |

## 導航系統

### 統一的 Layout

所有頁面都使用 `src/layouts/default.vue` 作為布局，包含：

- **頂部 App Bar** - 顯示應用程式標題和語言切換器
- **側邊導航抽屜** - 點擊左上角的選單圖標展開
- **主要內容區域** - 顯示當前路由的頁面內容

### 導航選單項目

導航選單包含以下項目：

1. **首頁** (`/`) - 表格展示
2. **圖表展示** (`/charts`) - ECharts 圖表範例
3. **多語系示範** (`/i18n-demo`) - i18n 功能展示

### 選單配置

選單項目定義在 `src/layouts/default.vue` 中：

```typescript
const menuItems = computed(() => [
  {
    title: t("menu.home"),
    path: "/",
    icon: "mdi-home"
  },
  {
    title: t("menu.charts"),
    path: "/charts",
    icon: "mdi-chart-bar"
  },
  {
    title: t("menu.i18nDemo"),
    path: "/i18n-demo",
    icon: "mdi-translate"
  }
])
```

## 多語系支援

所有選單項目和頁面標題都支援多語系：

### 中文（zh-TW）

- 應用程式標題：Vuetify 專案
- 首頁：首頁
- 圖表展示：圖表展示
- 多語系示範：多語系示範

### 英文（en-US）

- 應用程式標題：Vuetify Project
- 首頁：Home
- 圖表展示：Charts
- 多語系示範：i18n Demo

## 添加新頁面

要添加新頁面，只需：

1. 在 `src/pages/` 目錄下創建新的 `.vue` 文件
2. 路由會自動生成（檔名即為路由路徑）
3. 在 `src/layouts/default.vue` 中添加新的選單項目
4. 在 `src/locales/` 中添加相應的翻譯文字

### 範例

創建 `src/pages/about.vue`：

```vue
<template>
  <v-container>
    <v-card>
      <v-card-title>{{ t("menu.about") }}</v-card-title>
      <v-card-text> 關於我們的內容... </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>
```

然後在 layout 中添加選單項：

```typescript
{
  title: t('menu.about'),
  path: '/about',
  icon: 'mdi-information'
}
```

並在翻譯文件中添加：

```typescript
// zh-TW.ts
menu: {
  about: "關於我們"
}

// en-US.ts
menu: {
  about: "About"
}
```

## 路由特性

### 錯誤處理

Router 包含自動錯誤處理，會自動處理動態導入失敗的情況：

- 當動態導入模組失敗時，會自動重新載入頁面
- 使用 localStorage 防止無限重載循環

### Layout 系統

使用 `vite-plugin-vue-layouts-next` 提供彈性的布局系統：

- 所有頁面預設使用 `default.vue` layout
- 可以在頁面中自訂 layout（如果需要）

## 相關文件

- [ECharts 使用說明](./ECHARTS_SETUP.md)
- [i18n 設定說明](./I18N_SETUP.md)
