<template>
  <div class="flex overflow-hidden flex-col w-screen text-white bg-black h-dvh">
    <!-- 頂部導航 -->
    <div class="flex justify-between items-center px-4 py-3 border-b border-gray-800">
      <div class="w-24"></div>
      <h1 class="text-lg font-medium">對話</h1>
      <div class="w-24"></div>
    </div>

    <!-- 對話區域 -->
    <div class="flex overflow-hidden flex-col flex-1">
      <ConversationArea
        v-model:left-input-language="leftInputLanguage"
        v-model:right-input-language="rightInputLanguage"
        v-model:left-input="leftInput"
        v-model:right-input="rightInput"
        :messages="messages"
        @mic-click="handleMicClick"
        @play-message="handlePlayMessage"
        @send-message="handleSendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationArea from "./ConversationArea.vue"
import type { LanguageCode, ConversationMessage } from "../types/conversation"

// 兩個輸入框的語言配置（可以動態改變）
const leftInputLanguage = ref<LanguageCode>("en")
const rightInputLanguage = ref<LanguageCode>("zh")
const leftInput = ref("")
const rightInput = ref("")

const messages = ref<ConversationMessage[]>([
  {
    id: "1",
    sourceLanguage: "zh",
    sourceText: "你好你好",
    targetLanguage: "en",
    targetText: "Hello, hello.",
    timestamp: Date.now(),
    position: "right"
  },
  {
    id: "2",
    sourceLanguage: "en",
    sourceText: "I'm fine",
    targetLanguage: "zh",
    targetText: "我很好",
    timestamp: Date.now() + 1000,
    position: "left"
  }
])

// 添加新消息
const addMessage = (message: Omit<ConversationMessage, "id" | "timestamp">) => {
  const newMessage: ConversationMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: Date.now()
  }
  messages.value.push(newMessage)
}

// 根據位置清空對應的輸入框
const clearInput = (position: "left" | "right") => {
  if (position === "left") {
    leftInput.value = ""
  } else {
    rightInput.value = ""
  }
}

const handleMicClick = (position: "left" | "right") => {
  console.log("麥克風點擊:", position)
  // TODO: 實現語音輸入邏輯
  // 語音輸入完成後，可以調用 addMessage 添加消息
}

const handlePlayMessage = (messageId: string) => {
  const message = messages.value.find(msg => msg.id === messageId)
  if (message) {
    console.log("播放消息:", messageId, message.sourceLanguage, message.sourceText)
    // TODO: 實現語音播放邏輯，使用 message.sourceLanguage 和 message.sourceText
  }
}

// 處理發送消息（當用戶按下 Enter 或點擊發送時）
const handleSendMessage = (position: "left" | "right") => {
  const inputText = position === "left" ? leftInput.value : rightInput.value
  const sourceLanguage = position === "left" ? leftInputLanguage.value : rightInputLanguage.value

  if (inputText.trim()) {
    // 確定目標語言（通常是另一個輸入框的語言，或可以自動檢測）
    const targetLanguage = position === "left" ? rightInputLanguage.value : leftInputLanguage.value

    addMessage({
      sourceLanguage,
      sourceText: inputText.trim(),
      targetLanguage: sourceLanguage !== targetLanguage ? targetLanguage : undefined,
      // TODO: 添加翻譯邏輯，自動翻譯到 targetLanguage
      targetText: undefined,
      position
    })

    clearInput(position)
  }
}
</script>

<style scoped>
/* 確保手機版視圖 */
@media (min-width: 640px) {
  .h-screen {
    max-width: 414px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }
}
</style>
