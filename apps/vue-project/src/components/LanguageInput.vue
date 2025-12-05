<template>
  <div :class="['rounded-2xl p-4 bg-gray-700', isFlipped ? 'transform rotate-180' : '']">
    <div :class="isFlipped ? 'transform rotate-180' : ''">
      <!-- 語言選擇器 -->
      <div class="mb-2">
        <Select
          v-model="selectedLanguage"
          :options="languageOptions"
          option-label="label"
          option-value="code"
          placeholder="選擇語言"
          class="w-full language-select"
          @change="handleLanguageChange"
        >
          <template #value="slotProps">
            <span v-if="slotProps.value" class="text-gray-400 text-sm">
              {{ getLanguageLabel(slotProps.value) }}
            </span>
            <span v-else class="text-gray-500 text-sm">選擇語言</span>
          </template>
        </Select>
      </div>
      <InputText
        v-model="inputValue"
        :placeholder="placeholder"
        class="w-full bg-transparent border-none text-white placeholder-gray-500"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import InputText from "primevue/inputtext"
import Select from "primevue/select"
import type { LanguageCode } from "../types/conversation"
import { LANGUAGE_CONFIGS } from "../types/conversation"

interface Props {
  languageCode: LanguageCode
  placeholder: string
  isFlipped?: boolean
  modelValue?: string
}

interface Emits {
  (e: "update:modelValue", value: string): void
  (e: "update:languageCode", value: LanguageCode): void
  (e: "keydown", event: KeyboardEvent): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref(props.modelValue || "")
const selectedLanguage = ref<LanguageCode>(props.languageCode)

// 語言選項
const languageOptions = computed(() => {
  return Object.values(LANGUAGE_CONFIGS).map(config => ({
    code: config.code,
    label: config.label
  }))
})

// 獲取語言標籤
const getLanguageLabel = (code: LanguageCode): string => {
  return LANGUAGE_CONFIGS[code]?.label || code
}

watch(
  () => props.modelValue,
  newVal => {
    inputValue.value = newVal || ""
  }
)

watch(
  () => props.languageCode,
  newVal => {
    selectedLanguage.value = newVal
  }
)

const handleInput = () => {
  emit("update:modelValue", inputValue.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event)
}

const handleLanguageChange = () => {
  emit("update:languageCode", selectedLanguage.value)
}
</script>

<style scoped>
:deep(.p-inputtext) {
  background: transparent;
  border: none;
  box-shadow: none;
}

:deep(.p-inputtext:focus) {
  box-shadow: none;
}

:deep(.p-select) {
  width: 100%;
  background: transparent;
  border: none;
  box-shadow: none;
}
</style>
