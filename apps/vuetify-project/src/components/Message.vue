<template>
  <transition name="message-slide">
    <div v-if="visible" class="message-wrapper" :style="messageStyle">
      <div class="message-card" :class="`message-${type}`">
        <div class="message-content">
          <v-icon :icon="icon" :color="iconColor" size="20" class="message-icon"></v-icon>
          <span class="message-text">{{ message }}</span>
          <v-btn
            v-if="showClose"
            icon="mdi-close"
            size="x-small"
            variant="text"
            :color="iconColor"
            class="message-close"
            @click="close"
          ></v-btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"

export interface MessageProps {
  message: string
  type?: "success" | "warning" | "info" | "error"
  duration?: number
  showClose?: boolean
  onClose?: () => void
  offset?: number
}

const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  showClose: true,
  offset: 0
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const iconColor = computed(() => {
  const colorMap = {
    success: "#67c23a",
    warning: "#e6a23c",
    info: "#409eff",
    error: "#f56c6c"
  }
  return colorMap[props.type]
})

const icon = computed(() => {
  const iconMap = {
    success: "mdi-check-circle",
    warning: "mdi-alert",
    info: "mdi-information",
    error: "mdi-close-circle"
  }
  return iconMap[props.type]
})

const messageStyle = computed(() => {
  return {
    top: `${props.offset + 20}px`
  }
})

const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
  }
  if (props.onClose) {
    props.onClose()
  }
}

// 使用 onMounted 來觸發動畫（與 Notification 一致）
onMounted(() => {
  visible.value = true

  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
})

defineExpose({
  close
})
</script>

<style scoped>
.message-wrapper {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
  transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card {
  min-width: 320px;
  max-width: 480px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.message-content {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 10px;
}

.message-icon {
  flex-shrink: 0;
}

.message-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}

.message-close {
  flex-shrink: 0;
  margin-left: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.message-close:hover {
  opacity: 1;
}

/* 根據類型設置背景色和文字顏色 */
.message-success {
  background-color: #f0f9ff;
  border: 1px solid #e0f2fe;
}

.message-success .message-text {
  color: #67c23a;
}

.message-warning {
  background-color: #fefce8;
  border: 1px solid #fef9c3;
}

.message-warning .message-text {
  color: #e6a23c;
}

.message-info {
  background-color: #ecfeff;
  border: 1px solid #cffafe;
}

.message-info .message-text {
  color: #409eff;
}

.message-error {
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
}

.message-error .message-text {
  color: #f56c6c;
}

/* 從上往下滑入動畫（與 Notification 邏輯一致） */
.message-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.message-slide-enter-from {
  transform: translate(-50%, -100%);
  opacity: 0;
}

.message-slide-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}
</style>
