# 通知組件使用指南

本項目實現了類似 Element Plus 的 Message 和 Notification 組件系統。

## 📦 組件介紹

### Message 消息提示

輕量級的消息提示，顯示在頁面頂部，適合簡短的操作反饋。

### Notification 通知

更詳細的通知提示，支持標題和內容，可以顯示在頁面的四個角落。

## 🚀 快速開始

### 1. 導入 Composable

```typescript
import { useMessage } from "@/composables/useMessage"
import { useNotification } from "@/composables/useNotification"

const message = useMessage()
const notify = useNotification()
```

## 📝 Message 使用方法

### 基本用法

```typescript
// 成功消息
message.success("操作成功！")

// 警告消息
message.warning("請注意！")

// 信息消息
message.info("這是一條消息")

// 錯誤消息
message.error("操作失敗！")
```

### 自定義選項

```typescript
message.show({
  message: "這是一條消息",
  type: "success", // 'success' | 'warning' | 'info' | 'error'
  duration: 5000, // 顯示時長（毫秒），0 為不自動關閉
  showClose: true, // 是否顯示關閉按鈕
  onClose: () => {
    // 關閉時的回調
    console.log("消息已關閉")
  }
})
```

### 手動關閉

```typescript
const instance = message.success("操作成功！")
// 手動關閉
instance.close()
```

## 🔔 Notification 使用方法

### 基本用法

```typescript
// 成功通知
notify.success("操作成功！")

// 警告通知
notify.warning("請注意！")

// 信息通知
notify.info("這是一條消息")

// 錯誤通知
notify.error("操作失敗！")
```

### 帶標題的通知

```typescript
notify.success({
  title: "成功",
  message: "數據已成功保存！"
})

notify.error({
  title: "錯誤",
  message: "網絡連接失敗，請重試"
})
```

### 自定義選項

```typescript
notify.show({
  title: "系統通知",
  message: "您有新的消息",
  type: "info", // 'success' | 'warning' | 'info' | 'error'
  duration: 4500, // 顯示時長（毫秒），0 為不自動關閉
  position: "top-right", // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose: true, // 是否顯示關閉按鈕
  onClose: () => {
    // 關閉時的回調
    console.log("通知已關閉")
  }
})
```

### 不同位置

```typescript
// 右上角（默認）
notify.info({
  title: "提示",
  message: "顯示在右上角",
  position: "top-right"
})

// 左上角
notify.info({
  title: "提示",
  message: "顯示在左上角",
  position: "top-left"
})

// 右下角
notify.info({
  title: "提示",
  message: "顯示在右下角",
  position: "bottom-right"
})

// 左下角
notify.info({
  title: "提示",
  message: "顯示在左下角",
  position: "bottom-left"
})
```

### 唯一實體通知（重要功能）⭐

使用 `uniqueId` 參數可以確保同一類型的通知只顯示一個實例。當有新的相同 `uniqueId` 的通知時，會自動關閉舊的通知。

```typescript
// 多次點擊只會顯示一個通知，不會堆疊
notify.info({
  title: "數據加載中",
  message: "正在處理您的請求...",
  uniqueId: "loading-notification",
  duration: 0 // 不自動關閉
})

// 適用場景：
// 1. 加載狀態提示（避免多次點擊產生多個加載提示）
notify.info({
  title: "加載中",
  message: "正在獲取數據...",
  uniqueId: "data-loading"
})

// 2. 表單驗證錯誤（只顯示最新的錯誤）
notify.error({
  title: "驗證失敗",
  message: "請檢查必填項",
  uniqueId: "form-validation"
})

// 3. 系統狀態通知（保持唯一性）
notify.warning({
  title: "網絡不穩定",
  message: "請檢查您的網絡連接",
  uniqueId: "network-status"
})
```

### 自動堆疊效果

通知會自動向下堆疊排列，同一位置的通知不會重疊：

```typescript
// 連續顯示多個通知，會自動排列
notify.success({ title: "通知 1", message: "第一條" })
notify.info({ title: "通知 2", message: "第二條" })
notify.warning({ title: "通知 3", message: "第三條" })

// 當某個通知關閉時，其他通知會自動上移補位
```

### 手動關閉

```typescript
const instance = notify.success({
  title: "成功",
  message: "操作成功！"
})

// 手動關閉
instance.close()
```

## 🎨 樣式定制

組件使用 Vuetify 的顏色系統，支持以下類型：

- `success` - 綠色
- `warning` - 橙色
- `info` - 藍色
- `error` - 紅色

## 📋 API 參考

### Message Options

| 參數      | 說明             | 類型     | 可選值                     | 默認值 |
| --------- | ---------------- | -------- | -------------------------- | ------ |
| message   | 消息文字         | string   | —                          | —      |
| type      | 類型             | string   | success/warning/info/error | info   |
| duration  | 顯示時長（毫秒） | number   | —                          | 3000   |
| showClose | 是否顯示關閉按鈕 | boolean  | —                          | true   |
| onClose   | 關閉時的回調     | function | —                          | —      |

### Notification Options

| 參數      | 說明             | 類型     | 可選值                                      | 默認值    |
| --------- | ---------------- | -------- | ------------------------------------------- | --------- |
| title     | 標題             | string   | —                                           | —         |
| message   | 消息內容         | string   | —                                           | —         |
| type      | 類型             | string   | success/warning/info/error                  | info      |
| duration  | 顯示時長（毫秒） | number   | —                                           | 4500      |
| position  | 位置             | string   | top-right/top-left/bottom-right/bottom-left | top-right |
| showClose | 是否顯示關閉按鈕 | boolean  | —                                           | true      |
| uniqueId  | 唯一標識符       | string   | —                                           | —         |
| onClose   | 關閉時的回調     | function | —                                           | —         |

## 💡 使用建議

1. **Message** 適合用於：
   - 簡單的操作反饋
   - 表單提交結果
   - 快速提示信息

2. **Notification** 適合用於：
   - 需要標題的重要通知
   - 系統級別的提醒
   - 需要較長時間顯示的消息
   - 需要指定位置顯示的通知

3. **使用 uniqueId 的場景**：
   - 加載狀態提示（避免重複）
   - 表單驗證錯誤（只顯示最新）
   - 系統狀態通知（保持唯一）
   - 任何需要「只顯示一個」的通知

## 🎯 示範頁面

訪問 `/notification-demo` 頁面查看完整的使用示範和效果展示。

## 📦 文件結構

```
src/
├── components/
│   ├── Message.vue           # Message 組件
│   └── Notification.vue      # Notification 組件
├── composables/
│   └── useMessage.ts         # 通知系統 Composable
└── pages/
    └── notification-demo.vue # 示範頁面
```

## 🔧 技術實現

- 基於 Vuetify 3 的 v-snackbar 和 v-card 組件
- 使用 Vue 3 Composition API
- TypeScript 類型支持
- 動態創建和銷毀組件實例
- 支持多個通知同時顯示
- 自動堆疊排列，不會重疊
- 智能位置更新，關閉時自動補位
- 唯一 ID 機制，避免重複通知
