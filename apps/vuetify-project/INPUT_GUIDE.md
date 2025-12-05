# Input 組件使用指南

這是一個模仿 Element Plus 風格的 Input 組件，提供了豐富的功能和美觀的設計。

## 功能特性

- ✅ 基礎輸入框
- ✅ 禁用狀態
- ✅ 一鍵清空 (clearable)
- ✅ 密碼框 (show-password)
- ✅ 帶圖標的輸入框 (prefix-icon, suffix-icon)
- ✅ 文本域 (textarea)
- ✅ 複合型輸入框 (prepend, append slots)
- ✅ 多種尺寸 (large, default, small)
- ✅ 輸入長度限制
- ✅ 字數統計

## 安裝與配置

組件已創建在 `src/components/Input.vue`，可以直接導入使用。

## 使用方式

### 基礎用法

```vue
<template>
  <Input v-model="input" placeholder="請輸入內容" />
</template>

<script setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

const input = ref("")
</script>
```

### 禁用狀態

```vue
<template>
  <Input v-model="input" placeholder="禁用狀態" disabled />
</template>
```

### 一鍵清空

```vue
<template>
  <Input v-model="input" placeholder="請輸入內容" clearable />
</template>
```

### 密碼框

```vue
<template>
  <Input v-model="password" type="password" placeholder="請輸入密碼" show-password />
</template>

<script setup>
import { ref } from "vue"

const password = ref("")
</script>
```

### 帶圖標的輸入框

```vue
<template>
  <div>
    <!-- 前置圖標 -->
    <Input v-model="input1" placeholder="選擇日期" prefix-icon="mdi-calendar" />

    <!-- 後置圖標 -->
    <Input v-model="input2" placeholder="搜尋內容" suffix-icon="mdi-magnify" />
  </div>
</template>
```

### 文本域

```vue
<template>
  <Input v-model="textarea" type="textarea" :rows="3" placeholder="請輸入內容" />
</template>

<script setup>
import { ref } from "vue"

const textarea = ref("")
</script>
```

### 複合型輸入框

```vue
<template>
  <div>
    <!-- 前置內容 -->
    <Input v-model="input1" placeholder="請輸入內容">
      <template #prepend>Http://</template>
    </Input>

    <!-- 後置內容 -->
    <Input v-model="input2" placeholder="請輸入內容">
      <template #append>.com</template>
    </Input>

    <!-- 前後置內容 -->
    <Input v-model="input3" placeholder="請輸入內容">
      <template #prepend>Http://</template>
      <template #append>.com</template>
    </Input>
  </div>
</template>
```

### 不同尺寸

```vue
<template>
  <div>
    <Input v-model="input1" size="large" placeholder="大尺寸" />
    <Input v-model="input2" placeholder="默認尺寸" />
    <Input v-model="input3" size="small" placeholder="小尺寸" />
  </div>
</template>
```

### 輸入長度限制

```vue
<template>
  <div>
    <!-- 輸入框 -->
    <Input v-model="input" placeholder="請輸入內容" :maxlength="10" show-word-limit />

    <!-- 文本域 -->
    <Input v-model="textarea" type="textarea" :rows="3" placeholder="請輸入內容" :maxlength="50" show-word-limit />
  </div>
</template>
```

## API

### Props

| 屬性              | 類型                              | 默認值      | 說明                                     |
| ----------------- | --------------------------------- | ----------- | ---------------------------------------- |
| `modelValue`      | `string \| number`                | -           | 綁定值                                   |
| `type`            | `string`                          | `'text'`    | 輸入框類型 (text, textarea, password 等) |
| `size`            | `'large' \| 'default' \| 'small'` | `'default'` | 輸入框尺寸                               |
| `placeholder`     | `string`                          | -           | 輸入框占位文本                           |
| `clearable`       | `boolean`                         | `false`     | 是否顯示清空按鈕                         |
| `show-password`   | `boolean`                         | `false`     | 是否顯示密碼切換按鈕                     |
| `disabled`        | `boolean`                         | `false`     | 是否禁用                                 |
| `readonly`        | `boolean`                         | `false`     | 是否只讀                                 |
| `prefix-icon`     | `string`                          | -           | 前置圖標 (使用 Material Design Icons)    |
| `suffix-icon`     | `string`                          | -           | 後置圖標                                 |
| `rows`            | `number`                          | `2`         | 文本域行數 (僅 type="textarea" 時有效)   |
| `autocomplete`    | `string`                          | `'off'`     | 原生 autocomplete 屬性                   |
| `maxlength`       | `number`                          | -           | 最大輸入長度                             |
| `minlength`       | `number`                          | -           | 最小輸入長度                             |
| `show-word-limit` | `boolean`                         | `false`     | 是否顯示字數統計                         |
| `input-class`     | `string`                          | -           | 自定義 class                             |
| `input-style`     | `string \| object`                | -           | 自定義樣式                               |

### Events

| 事件名              | 說明               | 回調參數                    |
| ------------------- | ------------------ | --------------------------- |
| `update:modelValue` | 綁定值更新時觸發   | `(value: string \| number)` |
| `input`             | 輸入時觸發         | `(value: string \| number)` |
| `change`            | 值改變時觸發       | `(value: string)`           |
| `focus`             | 獲得焦點時觸發     | `(event: FocusEvent)`       |
| `blur`              | 失去焦點時觸發     | `(event: FocusEvent)`       |
| `clear`             | 點擊清空按鈕時觸發 | -                           |
| `keydown`           | 按鍵按下時觸發     | `(event: KeyboardEvent)`    |

### Slots

| 插槽名    | 說明           |
| --------- | -------------- |
| `prefix`  | 輸入框頭部內容 |
| `suffix`  | 輸入框尾部內容 |
| `prepend` | 輸入框前置內容 |
| `append`  | 輸入框後置內容 |

### Exposes

| 名稱       | 說明                | 類型                       |
| ---------- | ------------------- | -------------------------- |
| `focus`    | 使 input 獲取焦點   | `() => void`               |
| `blur`     | 使 input 失去焦點   | `() => void`               |
| `select`   | 選中 input 中的文字 | `() => void`               |
| `input`    | HTML input 元素     | `Ref<HTMLInputElement>`    |
| `textarea` | HTML textarea 元素  | `Ref<HTMLTextAreaElement>` |

## 實際應用場景

### 1. 登入表單

```vue
<template>
  <v-form @submit.prevent="handleLogin">
    <Input
      v-model="form.username"
      placeholder="請輸入用戶名"
      prefix-icon="mdi-account"
      clearable
      style="margin-bottom: 16px"
    />

    <Input
      v-model="form.password"
      type="password"
      placeholder="請輸入密碼"
      prefix-icon="mdi-lock"
      show-password
      style="margin-bottom: 16px"
    />

    <v-btn type="submit" color="primary" block>登入</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

const form = ref({
  username: "",
  password: ""
})

const handleLogin = () => {
  console.log("登入", form.value)
}
</script>
```

### 2. 搜尋框

```vue
<template>
  <Input v-model="searchText" placeholder="搜尋..." prefix-icon="mdi-magnify" clearable @keydown.enter="handleSearch" />
</template>

<script setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

const searchText = ref("")

const handleSearch = () => {
  console.log("搜尋:", searchText.value)
}
</script>
```

### 3. 網址輸入

```vue
<template>
  <Input v-model="url" placeholder="輸入網址">
    <template #prepend>Https://</template>
    <template #append>
      <v-btn size="small" color="primary" @click="handleGo">前往</v-btn>
    </template>
  </Input>
</template>

<script setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

const url = ref("")

const handleGo = () => {
  window.open("https://" + url.value)
}
</script>
```

### 4. 評論框

```vue
<template>
  <div>
    <Input v-model="comment" type="textarea" :rows="4" placeholder="寫下你的評論..." :maxlength="200" show-word-limit />
    <v-btn color="primary" :disabled="!comment" @click="handleSubmit"> 提交評論 </v-btn>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

const comment = ref("")

const handleSubmit = () => {
  console.log("評論:", comment.value)
  comment.value = ""
}
</script>
```

## 樣式自定義

組件使用 CSS 變量，可以輕鬆自定義樣式：

```vue
<template>
  <Input
    v-model="input"
    placeholder="自定義樣式"
    style="
      --el-input-focus-border-color: #f56c6c;
      --el-input-hover-border-color: #f78989;
    "
  />
</template>
```

### 可用的 CSS 變量

- `--el-input-text-color`: 文字顏色
- `--el-input-border-color`: 邊框顏色
- `--el-input-hover-border-color`: 懸停邊框顏色
- `--el-input-focus-border-color`: 焦點邊框顏色
- `--el-input-bg-color`: 背景顏色
- `--el-input-icon-color`: 圖標顏色
- `--el-input-placeholder-color`: 占位符顏色
- `--el-input-border-radius`: 圓角大小

## 注意事項

1. **圖標使用**：組件使用 Material Design Icons (mdi)，確保項目中已安裝
2. **v-model**：支援雙向綁定，使用 `v-model` 或 `:modelValue` + `@update:modelValue`
3. **類型**：`type` 屬性支援所有原生 input 類型
4. **文本域**：設置 `type="textarea"` 時，使用 `rows` 屬性控制高度
5. **字數統計**：需要同時設置 `maxlength` 和 `show-word-limit` 才會顯示

## 示範頁面

訪問 `/components-demo` 路由，切換到「Input 輸入框」tab 查看完整的示範和更多使用案例。

## 與 Element Plus 的差異

本組件模仿了 Element Plus 的樣式和功能，但有以下差異：

1. 使用 Vuetify 的 `v-icon` 組件顯示圖標
2. 圖標使用 Material Design Icons 而不是 Element Plus Icons
3. 部分高級功能（如 formatter/parser）未實現
4. 自適應文本域功能未實現

## TypeScript 支持

組件完全支持 TypeScript，提供了完整的類型定義：

```typescript
import type { InputProps } from "@/components/Input.vue"
```
