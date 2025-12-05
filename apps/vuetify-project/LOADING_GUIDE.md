# Loading 組件使用指南

這個 Loading 組件提供了兩種使用方式，可以滿足不同場景的需求。

## 功能特性

- ✅ 支援全屏 Loading
- ✅ 支援區域 Loading (inline 模式)
- ✅ 支援組件方式使用
- ✅ 支援 Directive 方式使用
- ✅ 可自訂顏色、大小、文字等
- ✅ 基於 Vuetify 的 `v-progress-circular` 組件

## 安裝與配置

組件已自動配置，無需額外安裝。

### 文件結構

```
src/
├── components/
│   └── Loading.vue           # Loading 組件
├── directives/
│   └── loading.ts            # v-loading directive
└── plugins/
    └── index.ts              # 註冊 directive
```

## 使用方式

### 方式一：直接使用 `<Loading />` 組件

#### 1. 全屏 Loading

```vue
<template>
  <div>
    <!-- 全屏 Loading -->
    <Loading :loading="isLoading" text="載入中..." />

    <!-- 頁面內容 -->
    <div>...</div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Loading from "@/components/Loading.vue"

const isLoading = ref(true)

// 模擬載入
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>
```

#### 2. 區域 Loading (inline 模式)

```vue
<template>
  <div class="container">
    <div class="content-box">
      <p>內容區域</p>

      <!-- 區域 Loading -->
      <Loading :loading="isLoading" inline text="載入中..." color="primary" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Loading from "@/components/Loading.vue"

const isLoading = ref(true)
</script>

<style scoped>
.content-box {
  position: relative;
  min-height: 200px;
}
</style>
```

#### 3. 自訂選項

```vue
<template>
  <Loading
    :loading="isLoading"
    inline
    text="正在處理資料..."
    color="success"
    text-color="#4caf50"
    :size="70"
    :width="6"
    background="rgba(200, 230, 201, 0.95)"
  />
</template>

<script setup>
import { ref } from "vue"

const isLoading = ref(true)
</script>
```

### 方式二：使用 `v-loading` Directive

#### 1. 簡單使用

```vue
<template>
  <div v-loading="isLoading">
    <!-- 內容 -->
  </div>
</template>

<script setup>
import { ref } from "vue"

const isLoading = ref(true)

// 動態切換
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>
```

#### 2. 使用選項

```vue
<template>
  <div v-loading="loadingOptions">
    <!-- 內容 -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const isLoading = ref(true)

const loadingOptions = computed(() => {
  if (!isLoading.value) return false

  return {
    text: "載入中...",
    color: "primary",
    textColor: "#1976d2",
    size: 50,
    width: 4,
    background: "rgba(255, 255, 255, 0.9)"
  }
})
</script>
```

## API

### Loading 組件 Props

| 屬性         | 類型      | 默認值                       | 說明                           |
| ------------ | --------- | ---------------------------- | ------------------------------ |
| `loading`    | `boolean` | `false`                      | 是否顯示 Loading               |
| `inline`     | `boolean` | `false`                      | 是否為 inline 模式（區域載入） |
| `text`       | `string`  | `''`                         | 顯示的文字                     |
| `color`      | `string`  | `'primary'`                  | 進度環顏色                     |
| `textColor`  | `string`  | `'#606266'`                  | 文字顏色                       |
| `size`       | `number`  | `50`                         | 進度環大小                     |
| `width`      | `number`  | `4`                          | 進度環寬度                     |
| `background` | `string`  | `'rgba(255, 255, 255, 0.9)'` | 背景顏色                       |

### v-loading Directive 選項

| 屬性         | 類型     | 默認值                       | 說明       |
| ------------ | -------- | ---------------------------- | ---------- |
| `text`       | `string` | `''`                         | 顯示的文字 |
| `color`      | `string` | `'primary'`                  | 進度環顏色 |
| `textColor`  | `string` | `'#606266'`                  | 文字顏色   |
| `size`       | `number` | `50`                         | 進度環大小 |
| `width`      | `number` | `4`                          | 進度環寬度 |
| `background` | `string` | `'rgba(255, 255, 255, 0.9)'` | 背景顏色   |

## 實際應用場景

### 1. 全屏 Loading - 頁面載入

```vue
<template>
  <div>
    <Loading :loading="isPageLoading" text="頁面載入中..." />

    <div v-if="!isPageLoading">
      <!-- 頁面內容 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Loading from "@/components/Loading.vue"

const isPageLoading = ref(true)

onMounted(async () => {
  try {
    // 載入頁面資料
    await fetchPageData()
  } finally {
    isPageLoading.value = false
  }
})
</script>
```

### 2. 區域 Loading - 表格載入

```vue
<template>
  <div class="table-container">
    <v-btn @click="loadData">載入資料</v-btn>

    <div v-loading="isLoading ? { text: '載入資料中...' } : false" class="table-wrapper">
      <v-data-table :items="items" :headers="headers" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const isLoading = ref(false)
const items = ref([])

async function loadData() {
  isLoading.value = true
  try {
    const response = await fetch("/api/data")
    items.value = await response.json()
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.table-wrapper {
  position: relative;
  min-height: 300px;
}
</style>
```

### 3. 表單提交

```vue
<template>
  <v-form @submit.prevent="handleSubmit">
    <div class="form-container">
      <v-text-field v-model="form.name" label="名稱" />
      <v-text-field v-model="form.email" label="Email" />
      <v-btn type="submit" :disabled="isSubmitting">提交</v-btn>

      <Loading :loading="isSubmitting" inline text="提交中..." />
    </div>
  </v-form>
</template>

<script setup>
import { ref } from "vue"
import Loading from "@/components/Loading.vue"

const isSubmitting = ref(false)
const form = ref({ name: "", email: "" })

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify(form.value)
    })
    // 處理成功
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-container {
  position: relative;
  padding: 20px;
}
</style>
```

### 4. 區域內容載入

```vue
<template>
  <div class="page">
    <div class="sidebar">
      <!-- 側邊欄 -->
    </div>

    <div class="main-content">
      <v-btn @click="loadContent">載入內容</v-btn>

      <div v-loading="isLoading" class="content-area">
        <div v-if="!isLoading">
          {{ content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const isLoading = ref(false)
const content = ref("")

async function loadContent() {
  isLoading.value = true
  try {
    const response = await fetch("/api/content")
    content.value = await response.text()
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.content-area {
  position: relative;
  min-height: 400px;
  padding: 20px;
}
</style>
```

### 5. 卡片載入

```vue
<template>
  <v-card>
    <v-card-title>資料卡片</v-card-title>
    <v-card-text class="card-content">
      <div v-if="!isLoading">
        <!-- 卡片內容 -->
      </div>

      <Loading :loading="isLoading" inline text="載入資料..." color="info" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Loading from "@/components/Loading.vue"

const isLoading = ref(true)

onMounted(async () => {
  await loadCardData()
  isLoading.value = false
})
</script>

<style scoped>
.card-content {
  position: relative;
  min-height: 200px;
}
</style>
```

## 注意事項

1. **使用組件方式時**：
   - 全屏 Loading：設置 `inline` 為 `false` 或不設置（默認為全屏）
   - 區域 Loading：設置 `inline` 為 `true`，並確保父元素有設置相對定位

2. **使用 `v-loading` 時**：
   - 確保目標元素有設置 `position: relative` 或其他非 `static` 的定位方式
   - 組件會自動為 `position: static` 的元素設置 `position: relative`
   - 確保目標元素有足夠的高度

3. **全屏 Loading**：
   - 全屏 Loading 會覆蓋整個視口
   - 建議在頁面根元素使用

4. **顏色選項**：
   - `color` 屬性接受 Vuetify 的顏色名稱（如 `'primary'`, `'secondary'`, `'success'` 等）
   - `textColor` 接受任何有效的 CSS 顏色值

5. **效能考量**：
   - 避免在頁面中同時顯示過多的 Loading 組件
   - 使用 `v-if` 而不是 `v-show` 來控制 Loading 的顯示/隱藏

## 示範頁面

訪問 `/components-demo` 路由，切換到「Loading 載入」tab 查看完整的示範和更多使用案例。

## TypeScript 支持

組件完全支持 TypeScript，提供了完整的類型定義：

```typescript
// 組件 Props 類型
import type { LoadingProps } from "@/components/Loading.vue"

// Directive 選項類型
import type { LoadingDirectiveOptions } from "@/directives/loading"
```
