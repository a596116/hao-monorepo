# i18n 國際化配置說明

## 安裝依賴

請執行以下命令安裝 vue-i18n：

```bash
# 如果使用 pnpm
pnpm add vue-i18n@9

# 如果使用 npm
npm install vue-i18n@9

# 如果使用 yarn
yarn add vue-i18n@9
```

## Vuetify i18n 整合

本配置已經整合了 [Vuetify 的國際化功能](https://vuetifyjs.com/zh-Hans/features/internationalization/)，Vuetify 的內部組件（如按鈕、日期選擇器、對話框等）會自動跟隨語言切換。

## 配置說明

### 已創建的文件

1. **語言文件**
   - `src/locales/zh-TW.ts` - 繁體中文翻譯
   - `src/locales/en-US.ts` - 英文翻譯

2. **i18n 插件**
   - `src/plugins/i18n.ts` - i18n 配置文件（含 Vuetify 語言同步）

3. **語言切換器組件**
   - `src/components/LanguageSwitcher.vue` - 語言切換按鈕組件（同步切換 vue-i18n 和 Vuetify）

4. **已更新的文件**
   - `src/plugins/index.ts` - 已註冊 i18n 插件
   - `src/plugins/vuetify.ts` - 已配置 Vuetify 語言包（繁體中文和英文）
   - `src/pages/index.vue` - 已整合 i18n 翻譯

## 使用方式

### 在組件中使用翻譯

#### Composition API（推薦）

```vue
<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
  <div>
    {{ t("common.welcome") }}
  </div>
</template>
```

#### Template 中直接使用（全局注入）

```vue
<template>
  <div>
    {{ $t("common.welcome") }}
  </div>
</template>
```

### 切換語言

```typescript
import { setLocale } from "@/plugins/i18n"

// 切換到英文
setLocale("en-US")

// 切換到繁體中文
setLocale("zh-TW")
```

### 獲取當前語言

```typescript
import { getLocale } from "@/plugins/i18n"

const currentLocale = getLocale()
```

## 添加新的翻譯

### 1. 在語言文件中添加

編輯 `src/locales/zh-TW.ts`:

```typescript
export default {
  common: {
    welcome: "歡迎",
    // 添加新的翻譯
    newKey: "新的翻譯"
  }
}
```

編輯 `src/locales/en-US.ts`:

```typescript
export default {
  common: {
    welcome: "Welcome",
    // 添加對應的英文翻譯
    newKey: "New Translation"
  }
}
```

### 2. 在組件中使用

```vue
<template>
  <div>{{ t("common.newKey") }}</div>
</template>
```

## 語言持久化

語言設定會自動保存在 `localStorage` 中，下次打開應用時會自動載入之前選擇的語言。

## 支援的語言

- 繁體中文 (zh-TW) - 預設語言
- 英文 (en-US)

如需添加更多語言，請：

1. 在 `src/locales/` 目錄下創建新的語言文件
2. 在 `src/plugins/i18n.ts` 中導入並添加到 messages 中
3. 更新 `LanguageSwitcher.vue` 組件添加新語言選項

## 已整合的功能

在 `index.vue` 頁面中，以下文字已整合 i18n：

- 表格標題（名稱、類別、數量、狀態）
- 展開/縮合按鈕
- 頁面標題

## Vuetify 語言映射

vue-i18n 語言代碼與 Vuetify 語言代碼的映射關係：

- `zh-TW` (vue-i18n) → `zhHant` (Vuetify 繁體中文)
- `en-US` (vue-i18n) → `en` (Vuetify 英文)

當你切換語言時，兩個系統會自動同步。

## Vuetify 組件 i18n 效果

Vuetify 的以下組件會自動使用正確的語言：

- **v-data-table**: 分頁文字、每頁筆數等
- **v-date-picker**: 月份、星期名稱等
- **v-pagination**: 分頁按鈕文字
- **v-file-input**: 文件選擇按鈕文字
- **v-dialog**: 確認/取消按鈕
- **v-alert**: 關閉按鈕
- 其他所有 Vuetify 內建組件

## 測試

安裝完依賴後，啟動開發服務器：

```bash
npm run dev
# 或
pnpm dev
```

然後在頁面右上角使用語言切換器測試中英文切換功能。你會看到：

1. 自定義的文字（如表格標題）會切換
2. Vuetify 組件的內建文字也會跟著切換

## 示例頁面：測試 Vuetify i18n

已創建一個完整的示例頁面 `src/pages/i18n-demo.vue`，展示了各種 Vuetify 組件的 i18n 效果：

- ✅ 日期選擇器 (v-date-picker)
- ✅ 文件輸入 (v-file-input)
- ✅ 數據表格 (v-data-table) 含分頁
- ✅ 對話框 (v-dialog)
- ✅ 分頁組件 (v-pagination)

訪問 `http://localhost:3000/i18n-demo` 查看示例頁面，切換語言即可看到所有組件的文字自動本地化。
