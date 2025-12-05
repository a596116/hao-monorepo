<template>
  <transition name="notification-fade">
    <v-card
      v-if="visible"
      :color="backgroundColor"
      class="notification-card"
      :class="[positionClass, `notification-${type}`]"
      :style="positionStyle"
      elevation="8"
    >
      <v-card-text class="pa-4">
        <div class="d-flex">
          <v-icon :icon="icon" :color="iconColor" size="24" class="mt-1 mr-3"></v-icon>
          <div class="flex-grow-1">
            <div v-if="title" class="mb-1 notification-title">{{ title }}</div>
            <div class="notification-message">{{ message }}</div>
          </div>
          <v-btn
            v-if="showClose"
            icon="mdi-close"
            size="x-small"
            variant="text"
            :color="iconColor"
            class="ml-2"
            @click="close"
          ></v-btn>
        </div>
      </v-card-text>
    </v-card>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"

export interface NotificationProps {
  title?: string
  message: string
  type?: "success" | "warning" | "info" | "error"
  duration?: number
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  showClose?: boolean
  onClose?: () => void
  offset?: number
  uniqueId?: string
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: "info",
  duration: 4500,
  position: "top-right",
  showClose: true,
  offset: 0
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const backgroundColor = computed(() => {
  return "white"
})

const iconColor = computed(() => {
  const colorMap = {
    success: "#4caf50",
    warning: "#ff9800",
    info: "#2196f3",
    error: "#f44336"
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

const positionClass = computed(() => {
  return `notification-${props.position}`
})

const positionStyle = computed(() => {
  const position = props.position || "top-right"
  const offset = props.offset || 20

  if (position.startsWith("top")) {
    return { top: `${offset}px` }
  } else {
    return { bottom: `${offset}px` }
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
.notification-card {
  position: fixed;
  min-width: 330px;
  max-width: 450px;
  z-index: 9999;
  transition: all 0.3s ease;
}

/* 根據狀態設置左邊框顏色 */
.notification-success {
  border-left: 4px solid #4caf50;
}

.notification-warning {
  border-left: 4px solid #ff9800;
}

.notification-info {
  border-left: 4px solid #2196f3;
}

.notification-error {
  border-left: 4px solid #f44336;
}

.notification-top-right {
  right: 20px;
}

.notification-top-left {
  left: 20px;
}

.notification-bottom-right {
  right: 20px;
}

.notification-bottom-left {
  left: 20px;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #303133;
}

.notification-message {
  font-size: 0.875rem;
  color: #606266;
  line-height: 1.5;
}

.notification-fade-enter-active {
  transition: all 0.3s ease-out;
}

.notification-fade-leave-active {
  transition: all 0.2s ease-in;
}

.notification-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-fade-leave-to {
  opacity: 0;
}
</style>
