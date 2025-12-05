<template>
  <div class="time-picker-wrapper">
    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
      <template #activator="{ props }">
        <v-text-field
          :model-value="displayValue"
          v-bind="props"
          :label="label"
          :placeholder="format"
          prepend-inner-icon="mdi-clock-time-four-outline"
          :style="{ width: width }"
          clearable
          @click:clear="handleClear"
          @update:model-value="handleInput"
        />
      </template>
      <v-time-picker v-model="internalValue" format="24hr" @update:model-value="handleTimeChange" />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

interface Props {
  modelValue?: string | null
  format?: string // 時間格式，預設 'HH:mm'
  label?: string // label
  width?: string // 輸入框寬度
}

const props = withDefaults(defineProps<Props>(), {
  format: "HH:mm",
  label: "選擇時間",
  width: "200px"
})

const emit = defineEmits<{
  "update:modelValue": [value: string | null]
}>()

const menu = ref(false)
const internalValue = ref<any>(null)

// 初始化
watch(
  () => props.modelValue,
  val => {
    internalValue.value = val || null
  },
  { immediate: true }
)

// 顯示值
const displayValue = computed(() => {
  if (!internalValue.value) return ""
  return toTimeString(internalValue.value)
})

// 處理時間變更
function handleTimeChange() {
  const formatted = toTimeString(internalValue.value)
  emit("update:modelValue", formatted)
  menu.value = false
}

function handleClear() {
  internalValue.value = null
  emit("update:modelValue", null)
}

function handleInput(val: string) {
  if (!val || val.trim() === "") {
    handleClear()
    return
  }
  if (isValidTime(val)) {
    internalValue.value = val
    emit("update:modelValue", val)
  }
}

// 工具函式
function toTimeString(val: any): string {
  if (!val) return ""
  // 已是 HH:mm 或 HH:mm:ss
  if (typeof val === "string") {
    // 移除秒數，只保留 HH:mm
    const match = val.match(/^(\d{2}):(\d{2})/)
    if (match) return `${match[1]}:${match[2]}`
    return val
  }
  return ""
}

function isValidTime(t: string): boolean {
  // 驗證 HH:mm (00-23):(00-59)
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(t)
}
</script>

<style scoped>
.time-picker-wrapper {
  display: inline-block;
}
</style>
