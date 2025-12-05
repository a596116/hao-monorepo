# Loading 組件更新說明

## 更新日期

2025-11-14

## 新增內容

### 1. Loading 組件 (`src/components/Loading.vue`)

- 支援全屏和 inline 兩種模式
- 基於 Vuetify 的 `v-progress-circular` 組件
- 可自訂顏色、大小、文字、背景等
- 具有淡入淡出動畫效果

### 2. v-loading Directive (`src/directives/loading.ts`)

- 支援布林值綁定：`v-loading="true"`
- 支援選項對象綁定：`v-loading="{ text: '載入中...', color: 'primary' }"`
- 自動在目標元素內顯示 loading

### 3. 示範內容 (整合到 `src/pages/components-demo.vue`)

- 完整的使用示例
- 多種場景演示
- 在「組件展示」頁面的「Loading 載入」tab 中

### 4. 使用指南 (`LOADING_GUIDE.md`)

- 詳細的 API 文檔
- 實際應用場景示例
- TypeScript 類型支持說明

## 文件修改

### 修改的文件

1. `src/plugins/index.ts` - 註冊 v-loading directive
2. `src/pages/components-demo.vue` - 添加 Loading 組件展示 tab
3. `README.md` - 添加自訂組件章節

### 新增的文件

1. `src/components/Loading.vue`
2. `src/directives/loading.ts`
3. `LOADING_GUIDE.md`
4. `LOADING_UPDATE.md`

## 使用方式

### 方式一：使用 Loading 組件

```vue
<template>
  <!-- 全屏 Loading -->
  <Loading :loading="isLoading" text="載入中..." />

  <!-- 區域 Loading -->
  <div class="container">
    <Loading :loading="isLoading" inline text="載入中..." />
  </div>
</template>

<script setup>
import { ref } from "vue"
import Loading from "@/components/Loading.vue"

const isLoading = ref(true)
</script>
```

### 方式二：使用 Directive

```vue
<template>
  <!-- 簡單使用 -->
  <div v-loading="isLoading">內容</div>

  <!-- 帶選項 -->
  <div v-loading="loadingOptions">內容</div>
</template>

<script setup>
import { ref, computed } from "vue"

const isLoading = ref(true)

const loadingOptions = computed(() => {
  if (!isLoading.value) return false
  return {
    text: "載入中...",
    color: "primary"
  }
})
</script>
```

## 特性

- ✅ 全屏 Loading
- ✅ 區域 Loading (inline)
- ✅ 組件方式使用
- ✅ Directive 使用
- ✅ TypeScript 支持
- ✅ 完整的類型定義
- ✅ 可自訂樣式
- ✅ 動畫效果

## 測試建議

1. 訪問 `/components-demo` 頁面
2. 切換到「Loading 載入」tab
3. 測試全屏 loading（組件方式）
4. 測試區域 loading（組件方式）
5. 測試 directive 簡單用法
6. 測試 directive 自訂選項
7. 測試實際 API 請求場景

## 相容性

- Vue 3.x
- Vuetify 3.x
- TypeScript 4.x+

## 注意事項

1. 使用組件的 inline 模式時，確保父元素有足夠的高度和相對定位
2. 使用 `v-loading` 時，確保目標元素的定位不是 `static`
3. 全屏 Loading 建議在頁面根元素使用
4. Directive 需要在 `registerPlugins` 中註冊
