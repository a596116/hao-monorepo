<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div v-if="visible" class="drawer-overlay" @click="handleOverlayClick">
        <div :class="['drawer-container', `drawer-${location}`, customClass]" :style="drawerStyle" @click.stop>
          <!-- 標題欄 -->
          <div v-if="title" class="drawer-header">
            <span class="drawer-title">{{ title }}</span>
            <v-btn icon="mdi-close" size="small" variant="text" @click="handleClose"></v-btn>
          </div>

          <!-- 內容區域 -->
          <div class="drawer-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"

export interface DrawerProps {
  modelValue: boolean
  location?: "left" | "right" | "top" | "bottom"
  title?: string
  width?: string | number
  height?: string | number
  customClass?: string
  persistent?: boolean
  closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<DrawerProps>(), {
  location: "left",
  width: 300,
  height: 400,
  persistent: false,
  closeOnClickOutside: true
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
})

const transitionName = computed(() => {
  return `drawer-slide-${props.location}`
})

const drawerStyle = computed(() => {
  const isHorizontal = props.location === "left" || props.location === "right"

  if (isHorizontal) {
    return {
      width: typeof props.width === "number" ? `${props.width}px` : props.width,
      maxWidth: "90vw"
    }
  } else {
    return {
      height: typeof props.height === "number" ? `${props.height}px` : props.height,
      maxHeight: "80vh"
    }
  }
})

const handleClose = () => {
  visible.value = false
}

const handleOverlayClick = () => {
  if (props.closeOnClickOutside && !props.persistent) {
    handleClose()
  }
}

// 防止背景滾動
watch(visible, newVal => {
  if (newVal) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
})

defineExpose({
  close: handleClose
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
}

.drawer-container {
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 左側抽屜 */
.drawer-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 0 16px 16px 0;
}

/* 右側抽屜 */
.drawer-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px 0 0 16px;
}

/* 頂部抽屜 */
.drawer-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 16px 16px;
  width: 100%;
}

/* 底部抽屜 */
.drawer-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 16px 16px 0 0;
  width: 100%;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 左側滑入動畫 */
.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-left-enter-active .drawer-container,
.drawer-slide-left-leave-active .drawer-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  opacity: 0;
}

.drawer-slide-left-enter-from .drawer-container,
.drawer-slide-left-leave-to .drawer-container {
  transform: translateX(-100%);
}

/* 右側滑入動畫 */
.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-right-enter-active .drawer-container,
.drawer-slide-right-leave-active .drawer-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  opacity: 0;
}

.drawer-slide-right-enter-from .drawer-container,
.drawer-slide-right-leave-to .drawer-container {
  transform: translateX(100%);
}

/* 頂部滑入動畫 */
.drawer-slide-top-enter-active,
.drawer-slide-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-top-enter-active .drawer-container,
.drawer-slide-top-leave-active .drawer-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-top-enter-from,
.drawer-slide-top-leave-to {
  opacity: 0;
}

.drawer-slide-top-enter-from .drawer-container,
.drawer-slide-top-leave-to .drawer-container {
  transform: translateY(-100%);
}

/* 底部滑入動畫 */
.drawer-slide-bottom-enter-active,
.drawer-slide-bottom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-bottom-enter-active .drawer-container,
.drawer-slide-bottom-leave-active .drawer-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-bottom-enter-from,
.drawer-slide-bottom-leave-to {
  opacity: 0;
}

.drawer-slide-bottom-enter-from .drawer-container,
.drawer-slide-bottom-leave-to .drawer-container {
  transform: translateY(100%);
}

/* 捲軸樣式 */
.drawer-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.drawer-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.drawer-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.drawer-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
