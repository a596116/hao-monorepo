<template>
  <v-dialog v-model="visible" max-width="420" :persistent="!closeOnClickModal" @click:outside="handleModalClick">
    <v-card :class="['messagebox-card', customClass]">
      <v-card-title v-if="title" class="pb-2 d-flex align-center justify-space-between pa-4">
        <div class="gap-3 d-flex align-center">
          <v-icon v-if="displayIcon" :icon="displayIcon" :color="iconColor" size="24"></v-icon>
          <span class="messagebox-title">{{ title }}</span>
        </div>
        <v-btn v-if="showClose" icon="mdi-close" size="small" variant="text" color="grey" @click="handleCancel"></v-btn>
      </v-card-title>

      <v-card-text class="pt-2 pa-4">
        <div v-if="subTitle" class="mb-2 messagebox-subtitle">
          <template v-if="Array.isArray(subTitle)">
            <div v-for="(item, index) in subTitle" :key="index">{{ item }}</div>
          </template>
          <template v-else>{{ subTitle }}</template>
        </div>
        <div class="messagebox-content">{{ message }}</div>
        <v-text-field
          v-if="showInput"
          v-model="inputValue"
          :placeholder="inputPlaceholder"
          variant="outlined"
          density="compact"
          class="mt-3"
          hide-details
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="pt-2 pa-4">
        <v-spacer></v-spacer>
        <v-btn
          v-if="showCancelButton"
          variant="text"
          :color="cancelButtonColor"
          :class="cancelButtonClass"
          class="text-none"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          v-if="showConfirmButton !== false"
          variant="flat"
          :color="confirmButtonColor"
          :loading="loading"
          class="text-none"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"

export interface MessageBoxProps {
  title?: string
  subTitle?: string | Array<any>
  message: string
  type?: "success" | "warning" | "info" | "error"
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  showCancelButton?: boolean
  showInput?: boolean
  inputPlaceholder?: string
  customClass?: string
  cancelButtonClass?: string
  showConfirmButton?: boolean
  showClose?: boolean
  iconName?: string
  closeOnClickModal?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

const props = withDefaults(defineProps<MessageBoxProps>(), {
  title: "提示",
  type: "info",
  confirmText: "確定",
  cancelText: "取消",
  confirmButtonColor: "primary",
  cancelButtonColor: "grey",
  showCancelButton: true,
  showInput: false,
  inputPlaceholder: "請輸入",
  showConfirmButton: true,
  showClose: true,
  closeOnClickModal: false
})

const visible = ref(false)
const loading = ref(false)
const inputValue = ref("")

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

const displayIcon = computed(() => {
  return props.iconName || icon.value
})

const handleConfirm = async () => {
  if (props.onConfirm) {
    loading.value = true
    try {
      await props.onConfirm()
      visible.value = false
    } catch (error) {
      console.error("MessageBox confirm error:", error)
    } finally {
      loading.value = false
    }
  } else {
    visible.value = false
  }
}

// 獲取輸入值
const getInputValue = () => {
  return inputValue.value
}

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  }
  visible.value = false
}

const handleModalClick = () => {
  if (props.closeOnClickModal) {
    handleCancel()
  }
}

// 組件掛載時顯示
onMounted(() => {
  visible.value = true
})

defineExpose({
  visible,
  inputValue,
  getInputValue,
  close: () => {
    visible.value = false
  }
})
</script>

<style scoped>
.messagebox-card {
  border-radius: 8px;
}

.messagebox-title {
  font-size: 1rem;
  font-weight: 600;
  color: #303133;
}

.messagebox-subtitle {
  font-size: 0.875rem;
  color: #909399;
  line-height: 1.5;
  font-weight: 500;
}

.messagebox-content {
  font-size: 0.9375rem;
  color: #606266;
  line-height: 1.6;
  word-break: break-word;
}

.gap-3 {
  gap: 12px;
}
</style>
