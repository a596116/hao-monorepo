<template>
  <div class="date-picker-wrapper">
    <!-- 單一日期選擇 -->
    <template v-if="!range">
      <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
        <template #activator="{ props }">
          <v-text-field
            :model-value="displayValue"
            v-bind="props"
            :label="label"
            :placeholder="format"
            prepend-inner-icon="mdi-calendar"
            :style="{ width: width }"
            clearable
            @click:clear="handleClear"
            @update:model-value="handleInput"
          />
        </template>
        <v-date-picker v-model="internalValue" @update:model-value="handleDateChange" />
      </v-menu>
    </template>

    <!-- 範圍日期選擇 -->
    <template v-else>
      <div class="flex-wrap gap-3 d-flex align-start">
        <!-- 開始日期 -->
        <v-menu v-model="menuStart" :close-on-content-click="false" transition="scale-transition" offset-y>
          <template #activator="{ props }">
            <v-text-field
              :model-value="displayStart"
              v-bind="props"
              :label="startLabel"
              :placeholder="format"
              prepend-inner-icon="mdi-calendar"
              :style="{ width: width }"
              clearable
              @click:clear="handleClearStart"
              @update:model-value="handleInputStart"
            />
          </template>
          <v-date-picker v-model="internalStart" @update:model-value="handleStartChange" />
        </v-menu>

        <!-- 結束日期 -->
        <v-menu v-model="menuEnd" :close-on-content-click="false" transition="scale-transition" offset-y>
          <template #activator="{ props }">
            <v-text-field
              :model-value="displayEnd"
              v-bind="props"
              :label="endLabel"
              :placeholder="format"
              prepend-inner-icon="mdi-calendar"
              :style="{ width: width }"
              clearable
              @click:clear="handleClearEnd"
              @update:model-value="handleInputEnd"
            />
          </template>
          <v-date-picker v-model="internalEnd" :min="minEndDate" @update:model-value="handleEndChange" />
        </v-menu>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"

interface Props {
  modelValue?: string | { start: string; end: string } | null
  format?: string // 日期格式，預設 'YYYY-MM-DD'
  range?: boolean // 是否為範圍選擇
  label?: string // 單一模式的 label
  startLabel?: string // 範圍模式的開始 label
  endLabel?: string // 範圍模式的結束 label
  width?: string // 輸入框寬度
}

const props = withDefaults(defineProps<Props>(), {
  format: "YYYY-MM-DD",
  range: false,
  label: "選擇日期",
  startLabel: "開始日期",
  endLabel: "結束日期",
  width: "240px"
})

const emit = defineEmits<{
  "update:modelValue": [value: string | { start: string; end: string } | null]
}>()

// 單一模式狀態
const menu = ref(false)
const internalValue = ref<any>(null)

// 範圍模式狀態
const menuStart = ref(false)
const menuEnd = ref(false)
const internalStart = ref<any>(null)
const internalEnd = ref<any>(null)

// 初始化
watch(
  () => props.modelValue,
  val => {
    if (!props.range) {
      internalValue.value = val || null
    } else {
      const rangeVal = val as { start: string; end: string } | null
      internalStart.value = rangeVal?.start || null
      internalEnd.value = rangeVal?.end || null
    }
  },
  { immediate: true }
)

// 顯示值（單一模式）
const displayValue = computed(() => {
  if (!internalValue.value) return ""
  return toDateString(internalValue.value)
})

// 顯示值（範圍模式）
const displayStart = computed(() => {
  if (!internalStart.value) return ""
  return toDateString(internalStart.value)
})

const displayEnd = computed(() => {
  if (!internalEnd.value) return ""
  return toDateString(internalEnd.value)
})

// 結束日期的最小日期（不能早於開始日期）
const minEndDate = computed(() => {
  if (!internalStart.value) return undefined
  return toDateString(internalStart.value)
})

// 單一模式處理
function handleDateChange() {
  const formatted = toDateString(internalValue.value)
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
  if (isValidDate(val)) {
    internalValue.value = val
    emit("update:modelValue", val)
  }
}

// 範圍模式處理
function handleStartChange() {
  const formatted = toDateString(internalStart.value)
  emitRange(formatted, toDateString(internalEnd.value))
  menuStart.value = false
  // 選擇完開始日期後，自動打開結束日期選擇器
  nextTick(() => {
    menuEnd.value = true
  })
}

function handleEndChange() {
  const formatted = toDateString(internalEnd.value)
  emitRange(toDateString(internalStart.value), formatted)
  menuEnd.value = false
}

function handleClearStart() {
  internalStart.value = null
  emitRange("", toDateString(internalEnd.value))
}

function handleClearEnd() {
  internalEnd.value = null
  emitRange(toDateString(internalStart.value), "")
}

function handleInputStart(val: string) {
  if (!val || val.trim() === "") {
    handleClearStart()
    return
  }
  if (isValidDate(val)) {
    internalStart.value = val
    emitRange(val, toDateString(internalEnd.value))
  }
}

function handleInputEnd(val: string) {
  if (!val || val.trim() === "") {
    handleClearEnd()
    return
  }
  if (isValidDate(val)) {
    // 檢查結束日期不能早於開始日期
    const startStr = toDateString(internalStart.value)
    if (startStr && val < startStr) {
      return // 不接受早於開始日期的結束日期
    }
    internalEnd.value = val
    emitRange(startStr, val)
  }
}

function emitRange(start: string, end: string) {
  if (!start && !end) {
    emit("update:modelValue", null)
  } else {
    emit("update:modelValue", { start, end })
  }
}

// 工具函式
function toDateString(val: any): string {
  if (!val) return ""
  // 已是 YYYY-MM-DD
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
    const asDate = new Date(val)
    if (!Number.isNaN(asDate.getTime())) return formatDate(asDate)
    return val
  }
  // Date 物件
  if (val instanceof Date) return formatDate(val)
  // 範圍或陣列（取 start 或第一個）
  if (val && typeof val === "object") {
    if (val.start instanceof Date) return formatDate(val.start)
    if (Array.isArray(val) && val[0] instanceof Date) return formatDate(val[0])
  }
  return ""
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function isValidDate(d: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false
  const dt = new Date(d + "T00:00:00")
  return !Number.isNaN(dt.getTime())
}
</script>

<style scoped>
.date-picker-wrapper {
  display: inline-block;
}
.gap-3 {
  gap: 12px;
}
</style>
