<template>
  <div class="flex relative flex-col h-full">
    <!-- 對話模式：可滾動區域（包含消息和輸入框） -->
    <div ref="scrollContainer" class="overflow-y-auto flex-1 px-4 py-4 scroll-container">
      <!-- 按時間排序的混合消息列表（新消息在底部） -->
      <div
        v-for="msg in sortedMessages"
        :key="msg.id"
        class="mt-auto mb-3 w-full"
        :class="msg.position === 'left' ? 'flex justify-start' : 'flex justify-end'"
      >
        <MessageBubble
          :message="msg.sourceText"
          :translation="msg.targetText"
          :is-own="msg.position === 'right'"
          :show-play-button="true"
          @play="$emit('play-message', msg.id)"
        />
      </div>

      <!-- 對話模式：輸入區域（在可滾動區域內） -->
      <div class="px-0 pt-4 pb-4">
        <div class="flex flex-col gap-3 mb-3">
          <!-- 右側輸入框 -->
          <div class="ml-auto w-fit">
            <LanguageInput
              :language-code="rightInputLanguage"
              placeholder="輸入文字"
              :model-value="rightInput"
              @update:model-value="$emit('update:rightInput', $event)"
              @update:language-code="$emit('update:rightInputLanguage', $event)"
              @keydown="handleRightKeydown"
            />
          </div>
          <!-- 左側輸入框 -->
          <div class="w-fit">
            <LanguageInput
              :language-code="leftInputLanguage"
              placeholder="Enter text"
              :model-value="leftInput"
              @update:model-value="$emit('update:leftInput', $event)"
              @update:language-code="$emit('update:leftInputLanguage', $event)"
              @keydown="handleLeftKeydown"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 固定在底部的麥克風按鈕（帶半透明漸層模糊背景） -->
    <div
      class="flex absolute right-0 bottom-0 left-0 justify-center items-center px-4 h-[200px] pointer-events-none bottom-container"
    >
      <div class="pointer-events-auto">
        <MicrophoneButton @click="handleBothMicClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageBubble from "./MessageBubble.vue"
import LanguageInput from "./LanguageInput.vue"
import MicrophoneButton from "./MicrophoneButton.vue"
import type { ConversationMessage, LanguageCode } from "../types/conversation"

interface Props {
  messages: ConversationMessage[]
}

interface Emits {
  (e: "mic-click", position: "left" | "right"): void
  (e: "play-message", messageId: string): void
  (e: "send-message", position: "left" | "right"): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const leftInputLanguage = defineModel<LanguageCode>("leftInputLanguage", { required: true })
const rightInputLanguage = defineModel<LanguageCode>("rightInputLanguage", { required: true })
const leftInput = defineModel<string>("leftInput", { required: true })
const rightInput = defineModel<string>("rightInput", { required: true })

// 滾動容器引用
const scrollContainer = ref<HTMLElement | null>(null)

// 對話模式：按時間排序的混合消息列表
const sortedMessages = computed(() => {
  const chatMessages = props.messages.filter(msg => msg.position === "left" || msg.position === "right")
  return [...chatMessages].sort((a, b) => a.timestamp - b.timestamp)
})

// 滾動到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

// 監聽消息變化，自動滾動到底部
watch(
  sortedMessages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

// 組件掛載時滾動到底部
onMounted(() => {
  scrollToBottom()
})

// 處理輸入框 Enter 鍵
const handleLeftKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    emit("send-message", "left")
  }
}

const handleRightKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    emit("send-message", "right")
  }
}

// 處理中央麥克風按鈕（同時觸發左右兩個輸入框）
const handleBothMicClick = () => {
  // 可以選擇觸發左側或右側，這裡選擇左側
  // 或者可以發送一個特殊事件，讓父組件決定
  emit("mic-click", "left")
}
</script>

<style scoped>
.scroll-container {
  /* 減少底部空間，讓輸入框可以超出滾動容器底部 */
  padding-bottom: 180px;
  /* 允許內容可以稍微超出底部顯示 */
  overflow-y: auto;
  overflow-x: hidden;
}

/* 確保滾動時內容不會被完全裁剪 */
.scroll-container::-webkit-scrollbar {
  /* width: 4px; */
}

.bottom-container {
  /* 從下往上漸變為全透明，底部完全不透明 */
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 0.95) 25%,
    rgba(0, 0, 0, 0.87) 30%,
    rgba(0, 0, 0, 0.8) 35%,
    rgba(0, 0, 0, 0.75) 40%,
    rgba(0, 0, 0, 0.65) 50%,
    rgba(0, 0, 0, 0.55) 60%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  /* backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px); */
  z-index: 10;
}
</style>
