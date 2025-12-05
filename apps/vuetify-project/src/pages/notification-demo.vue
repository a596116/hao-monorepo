<template>
  <v-container fluid class="pa-6">
    <v-card flat class="rounded-lg">
      <v-card-title class="text-h5 pa-6">
        {{ t("notificationDemo.title") }}
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Message 示範 -->
        <div class="mb-10">
          <div class="mb-4 section-title">Message 消息提示</div>
          <v-card variant="outlined" class="rounded-lg pa-6">
            <div class="mb-4 text-body-2 text-grey-darken-1">
              輕量級的消息提示，顯示在頁面頂部，3秒後自動消失，支持多個消息堆疊
            </div>

            <div class="mb-6">
              <div class="mb-3 text-subtitle-2 font-weight-bold">基本類型</div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="success" @click="showMessageSuccess">
                  <v-icon start>mdi-check-circle</v-icon>
                  成功消息
                </v-btn>
                <v-btn color="warning" @click="showMessageWarning">
                  <v-icon start>mdi-alert</v-icon>
                  警告消息
                </v-btn>
                <v-btn color="info" @click="showMessageInfo">
                  <v-icon start>mdi-information</v-icon>
                  信息消息
                </v-btn>
                <v-btn color="error" @click="showMessageError">
                  <v-icon start>mdi-close-circle</v-icon>
                  錯誤消息
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div>
              <div class="mb-3 text-subtitle-2 font-weight-bold">堆疊效果測試</div>
              <v-btn color="primary" @click="showMultipleMessages">
                <v-icon start>mdi-layers-triple</v-icon>
                顯示多個消息
              </v-btn>
            </div>
          </v-card>
        </div>

        <!-- Notification 示範 -->
        <div class="mb-10">
          <div class="mb-4 section-title">Notification 通知</div>
          <v-card variant="outlined" class="rounded-lg pa-6">
            <div class="mb-4 text-body-2 text-grey-darken-1">更詳細的通知提示，可包含標題和內容，支持多種位置</div>

            <div class="mb-6">
              <div class="mb-3 text-subtitle-2 font-weight-bold">基本類型</div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="success" @click="showNotifySuccess">
                  <v-icon start>mdi-check-circle</v-icon>
                  成功通知
                </v-btn>
                <v-btn color="warning" @click="showNotifyWarning">
                  <v-icon start>mdi-alert</v-icon>
                  警告通知
                </v-btn>
                <v-btn color="info" @click="showNotifyInfo">
                  <v-icon start>mdi-information</v-icon>
                  信息通知
                </v-btn>
                <v-btn color="error" @click="showNotifyError">
                  <v-icon start>mdi-close-circle</v-icon>
                  錯誤通知
                </v-btn>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="mb-6">
              <div class="mb-3 text-subtitle-2 font-weight-bold">堆疊效果測試</div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="primary" @click="showMultipleNotifications">
                  <v-icon start>mdi-layers-triple</v-icon>
                  顯示多個通知
                </v-btn>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <div>
              <div class="mb-3 text-subtitle-2 font-weight-bold">不同位置</div>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="gap-3 d-flex flex-column">
                    <v-btn variant="outlined" @click="showNotifyTopRight">
                      <v-icon start>mdi-arrow-top-right</v-icon>
                      右上角
                    </v-btn>
                    <v-btn variant="outlined" @click="showNotifyTopLeft">
                      <v-icon start>mdi-arrow-top-left</v-icon>
                      左上角
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="gap-3 d-flex flex-column">
                    <v-btn variant="outlined" @click="showNotifyBottomRight">
                      <v-icon start>mdi-arrow-bottom-right</v-icon>
                      右下角
                    </v-btn>
                    <v-btn variant="outlined" @click="showNotifyBottomLeft">
                      <v-icon start>mdi-arrow-bottom-left</v-icon>
                      左下角
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </div>

        <!-- MessageBox 示範 -->
        <div class="mb-10">
          <div class="mb-4 section-title">MessageBox 消息框</div>
          <v-card variant="outlined" class="rounded-lg pa-6">
            <div class="mb-4 text-body-2 text-grey-darken-1">用於需要用戶確認的操作，顯示為模態對話框</div>

            <div class="mb-6">
              <div class="mb-3 text-subtitle-2 font-weight-bold">基本用法</div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="primary" @click="showMessageBoxAlert">
                  <v-icon start>mdi-information</v-icon>
                  Alert 提示
                </v-btn>
                <v-btn color="warning" @click="showMessageBoxConfirm">
                  <v-icon start>mdi-alert</v-icon>
                  Confirm 確認
                </v-btn>
                <v-btn color="warning" @click="showMessageBoxQuestion">
                  <v-icon start>mdi-help-circle</v-icon>
                  Question 詢問
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-6">
              <div class="mb-3 text-subtitle-2 font-weight-bold">不同類型</div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="success" @click="showMessageBoxSuccess">
                  <v-icon start>mdi-check-circle</v-icon>
                  Success
                </v-btn>
                <v-btn color="warning" @click="showMessageBoxWarning">
                  <v-icon start>mdi-alert</v-icon>
                  Warning
                </v-btn>
                <v-btn color="info" @click="showMessageBoxInfo">
                  <v-icon start>mdi-information</v-icon>
                  Info
                </v-btn>
                <v-btn color="error" @click="showMessageBoxError">
                  <v-icon start>mdi-close-circle</v-icon>
                  Error
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div>
              <div class="mb-3 text-subtitle-2 font-weight-bold">異步操作</div>
              <v-btn color="primary" @click="showMessageBoxAsync">
                <v-icon start>mdi-sync</v-icon>
                異步確認操作
              </v-btn>
            </div>
          </v-card>
        </div>

        <!-- 代碼示例 -->
        <div>
          <div class="mb-4 section-title">使用方式</div>
          <v-card variant="outlined" class="rounded-lg">
            <v-tabs v-model="codeTab" bg-color="grey-lighten-4">
              <v-tab value="message">Message</v-tab>
              <v-tab value="notification">Notification</v-tab>
              <v-tab value="messagebox">MessageBox</v-tab>
            </v-tabs>

            <v-window v-model="codeTab">
              <v-window-item value="message">
                <v-card-text>
                  <pre class="code-block"><code>import { useMessage } from '@/composables/useMessage'

const message = useMessage()

// 基本用法
message.success('操作成功！')
message.warning('請注意！')
message.info('這是一條消息')
message.error('操作失敗！')

// 自定義選項
message.show({
  message: '這是一條消息',
  type: 'success',
  duration: 5000,
  showClose: true,
  onClose: () => {
    console.log('消息已關閉')
  }
})</code></pre>
                </v-card-text>
              </v-window-item>

              <v-window-item value="notification">
                <v-card-text>
                  <pre class="code-block"><code>import { useNotification } from '@/composables/useNotification'

const notify = useNotification()

// 基本用法
notify.success('操作成功！')
notify.warning('請注意！')

// 帶標題
notify.info({
  title: '提示',
  message: '這是通知內容'
})

// 完整選項
notify.show({
  title: '系統通知',
  message: '您有新的消息',
  type: 'info',
  duration: 4500,
  position: 'top-right',
  showClose: true,
  onClose: () => {
    console.log('通知已關閉')
  }
})

// 唯一通知（同一 uniqueId 只保留一個）
notify.info({
  title: '唯一通知',
  message: '重複點擊只會更新這一個通知',
  uniqueId: 'my-unique-notification'
})</code></pre>
                </v-card-text>
              </v-window-item>

              <v-window-item value="messagebox">
                <v-card-text>
                  <pre class="code-block"><code>import { useMessageBox } from '@/composables/useMessageBox'

const messageBox = useMessageBox()

// Alert 提示（只有確認按鈕）
messageBox.alert('這是一條提示消息')
  .then(() => {
    console.log('用戶點擊了確認')
  })

// Confirm 確認（使用 .then() 和 .catch()）
messageBox.confirm('確定要執行此操作嗎？')
  .then(() => {
    console.log('用戶點擊了確認')
  })
  .catch(() => {
    console.log('用戶點擊了取消')
  })

// Question 詢問（默認為 warning 類型）
messageBox.question({
  title: '確認取消綁定會員',
  message: '確定要取消綁定會員嗎？',
  subTitle: '將會清空購物車資料',
  showCancelButton: true,
  closeOnClickModal: true
})
  .then(() => {
    // 執行確認操作
    customerStore.handleClearCustomer()
    emit('on-refresh')
  })
  .catch(() => {
    // 取消操作
  })

// 不同類型
messageBox.success('操作成功！')
  .then(() => { /* 確認 */ })
  .catch(() => { /* 取消 */ })

messageBox.warning('警告：此操作不可逆')
  .then(() => { /* 確認 */ })
  .catch(() => { /* 取消 */ })

// 異步操作
messageBox.confirm({
  title: '確認',
  message: '確定要執行此操作嗎？',
  type: 'warning'
})
  .then(async () => {
    // 執行異步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('操作完成')
  })
  .catch(() => {
    console.log('已取消')
  })

// 全局使用
import { $messageBox } from '@/composables/useMessageBox'
$messageBox.confirm('確定要刪除嗎？')
  .then(() => { /* 確認 */ })
  .catch(() => { /* 取消 */ })</code></pre>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useMessage } from "@/composables/useMessage"
import { useNotification } from "@/composables/useNotification"
import { useMessageBox } from "@/composables/useMessageBox"

const { t } = useI18n()
const message = useMessage()
const notify = useNotification()
const messageBox = useMessageBox()

const codeTab = ref("message")

// Message 示範
const showMessageSuccess = () => {
  message.success("恭喜你，操作成功！")
}

const showMessageWarning = () => {
  message.warning("警告：請注意檢查輸入內容")
}

const showMessageInfo = () => {
  message.info("這是一條普通的消息提示")
}

const showMessageError = () => {
  message.error("錯誤：操作失敗，請稍後重試")
}

const showMultipleMessages = () => {
  message.success("第一條消息：操作成功")

  setTimeout(() => {
    message.info("第二條消息：正在處理")
  }, 200)

  setTimeout(() => {
    message.warning("第三條消息：請注意")
  }, 400)
}

// Notification 示範
const showNotifySuccess = () => {
  notify.success({
    title: "成功",
    message: "恭喜你，數據保存成功！"
  })
}

const showNotifyWarning = () => {
  notify.warning({
    title: "警告",
    message: "您的操作可能會影響系統性能，請謹慎處理"
  })
}

const showNotifyInfo = () => {
  notify.info({
    title: "消息",
    message: "這是一條普通的通知消息，可以包含較長的內容描述"
  })
}

const showNotifyError = () => {
  notify.error({
    title: "錯誤",
    message: "網絡連接失敗，請檢查您的網絡設置後重試"
  })
}

// 堆疊效果測試
const showMultipleNotifications = () => {
  notify.success({
    title: "通知 1",
    message: "第一條通知"
  })

  setTimeout(() => {
    notify.info({
      title: "通知 2",
      message: "第二條通知"
    })
  }, 200)

  setTimeout(() => {
    notify.warning({
      title: "通知 3",
      message: "第三條通知"
    })
  }, 400)
}

// 不同位置的通知
const showNotifyTopRight = () => {
  notify.info({
    title: "右上角通知",
    message: "這是顯示在右上角的通知",
    position: "top-right"
  })
}

const showNotifyTopLeft = () => {
  notify.info({
    title: "左上角通知",
    message: "這是顯示在左上角的通知",
    position: "top-left"
  })
}

const showNotifyBottomRight = () => {
  notify.info({
    title: "右下角通知",
    message: "這是顯示在右下角的通知",
    position: "bottom-right"
  })
}

const showNotifyBottomLeft = () => {
  notify.info({
    title: "左下角通知",
    message: "這是顯示在左下角的通知",
    position: "bottom-left"
  })
}

// MessageBox 示範
const showMessageBoxAlert = () => {
  messageBox
    .alert("這是一條提示消息")
    .then(() => {
      message.info("Alert 已關閉")
    })
    .catch(() => {
      // 不會執行，因為 alert 沒有取消按鈕
    })
}

const showMessageBoxConfirm = () => {
  messageBox
    .confirm("確定要執行此操作嗎？")
    .then(() => {
      message.success("您點擊了確認")
    })
    .catch(() => {
      message.info("您點擊了取消")
    })
}

const showMessageBoxQuestion = () => {
  messageBox
    .question({
      title: "確認取消綁定會員",
      message: "確定要取消綁定會員嗎？",
      subTitle: "將會清空購物車資料",
      showCancelButton: true,
      closeOnClickModal: true
    })
    .then(() => {
      message.success("已確認操作")
      // 這裡可以執行實際的操作，例如：
      // customerStore.handleClearCustomer()
      // emit('on-refresh')
    })
    .catch(() => {
      message.info("已取消操作")
    })
}

const showMessageBoxSuccess = () => {
  messageBox
    .success({
      title: "成功",
      message: "操作已成功完成！"
    })
    .then(() => {
      message.success("確認成功操作")
    })
    .catch(() => {
      message.info("已取消")
    })
}

const showMessageBoxWarning = () => {
  messageBox
    .warning({
      title: "警告",
      message: "此操作不可逆，是否繼續？"
    })
    .then(() => {
      message.warning("已執行警告操作")
    })
    .catch(() => {
      message.info("已取消")
    })
}

const showMessageBoxInfo = () => {
  messageBox
    .info({
      title: "提示",
      message: "這是一條信息提示"
    })
    .then(() => {
      message.info("已確認")
    })
    .catch(() => {
      message.info("已取消")
    })
}

const showMessageBoxError = () => {
  messageBox
    .error({
      title: "錯誤",
      message: "操作失敗，請稍後重試"
    })
    .then(() => {
      message.info("已確認")
    })
    .catch(() => {
      message.info("已取消")
    })
}

const showMessageBoxAsync = () => {
  messageBox
    .confirm({
      title: "確認",
      message: "確定要執行此異步操作嗎？",
      type: "warning"
    })
    .then(async () => {
      // 模擬異步操作
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.success("異步操作完成！")
    })
    .catch(() => {
      message.info("已取消操作")
    })
}
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212121;
  letter-spacing: -0.01em;
}

.gap-3 {
  gap: 12px;
}

.code-block {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Monaco", "Menlo", "Consolas", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #303133;
}

.code-block code {
  background: none;
}
</style>
