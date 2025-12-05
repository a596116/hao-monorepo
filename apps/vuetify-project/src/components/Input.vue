<template>
  <div
    :class="[
      'el-input',
      {
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword,
        'el-input--large': size === 'large',
        'el-input--small': size === 'small',
        'is-disabled': disabled,
        'is-exceed': isExceed
      },
      inputClass
    ]"
    :style="inputStyle"
  >
    <!-- 文本域特殊處理 -->
    <template v-if="type === 'textarea'">
      <textarea
        ref="textareaRef"
        class="el-textarea__inner"
        v-bind="$attrs"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :style="textareaStyle"
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      ></textarea>
      <!-- 字數統計 -->
      <div v-if="showWordLimit && maxlength" class="el-textarea__count">{{ textLength }} / {{ maxlength }}</div>
    </template>

    <!-- 普通輸入框 -->
    <template v-else>
      <!-- 前置內容 -->
      <div v-if="$slots.prepend" class="el-input-group__prepend">
        <slot name="prepend"></slot>
      </div>

      <div class="el-input__wrapper">
        <!-- 前置圖標 -->
        <span v-if="$slots.prefix || prefixIcon" class="el-input__prefix">
          <slot name="prefix">
            <v-icon v-if="prefixIcon" :icon="prefixIcon" class="el-input__icon"></v-icon>
          </slot>
        </span>

        <!-- 輸入框 -->
        <input
          ref="inputRef"
          class="el-input__inner"
          v-bind="$attrs"
          :type="showPasswordVisible ? 'text' : type"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :maxlength="maxlength"
          :minlength="minlength"
          :value="displayValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        />

        <!-- 後置圖標 -->
        <span v-if="$slots.suffix || suffixIcon || clearable || showPassword || showWordLimit" class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <!-- 清空按鈕 -->
            <v-icon
              v-if="clearable && !disabled && !readonly"
              icon="mdi-close-circle"
              class="el-input__icon el-input__clear"
              :style="{ visibility: modelValue ? 'visible' : 'hidden' }"
              @click="handleClear"
            ></v-icon>

            <!-- 密碼顯示切換 -->
            <v-icon
              v-else-if="showPassword && !disabled && !readonly"
              :icon="showPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              class="el-input__icon el-input__password"
              @click="togglePasswordVisible"
            ></v-icon>

            <!-- 自定義後置內容 -->
            <slot name="suffix">
              <v-icon v-if="suffixIcon" :icon="suffixIcon" class="el-input__icon"></v-icon>
            </slot>
          </span>

          <!-- 字數統計 -->
          <span v-if="showWordLimit && maxlength" class="el-input__count">
            <span class="el-input__count-inner"> {{ textLength }} / {{ maxlength }} </span>
          </span>
        </span>
      </div>

      <!-- 後置內容 -->
      <div v-if="$slots.append" class="el-input-group__append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from "vue"
import type { CSSProperties } from "vue"

export interface AutosizeConfig {
  minRows?: number
  maxRows?: number
}

export interface InputProps {
  modelValue?: string | number
  type?: string
  size?: "large" | "default" | "small"
  placeholder?: string
  clearable?: boolean
  showPassword?: boolean
  disabled?: boolean
  readonly?: boolean | "true" | "false" | undefined
  prefixIcon?: string
  suffixIcon?: string
  autosize?: boolean | AutosizeConfig
  autocomplete?: string
  maxlength?: number
  minlength?: number
  showWordLimit?: boolean
  inputClass?: string
  inputStyle?: CSSProperties
  formatter?: (value: string | number) => string
  parser?: (value: string) => string
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  size: "default",
  autocomplete: "off",
  showWordLimit: false,
  readonly: false
})

const emit = defineEmits(["update:modelValue", "input", "change", "focus", "blur", "clear", "keydown"])

const inputRef = ref<HTMLInputElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const showPasswordVisible = ref(false)
const isFocused = ref(false)
const isComposing = ref(false)

const textLength = computed(() => {
  return String(props.modelValue || "").length
})

const isExceed = computed(() => {
  return props.maxlength && textLength.value > props.maxlength
})

// 格式化顯示的值
const displayValue = computed(() => {
  const value = props.modelValue
  if (value == null || value === "") return ""

  // 如果正在輸入或聚焦狀態，不格式化（顯示原始值）
  if (isFocused.value || isComposing.value) {
    return String(value)
  }

  // 如果有 formatter，使用它格式化
  if (props.formatter && props.type !== "textarea") {
    return props.formatter(value)
  }

  return String(value)
})

// Autosize 相關
const autosizeConfig = computed(() => {
  // 如果沒有設置 autosize，使用默認配置（2行，無最大限制）
  if (!props.autosize) {
    return { minRows: 2, maxRows: Infinity }
  }

  if (typeof props.autosize === "boolean") {
    return { minRows: 2, maxRows: Infinity }
  }

  return {
    minRows: props.autosize.minRows || 2,
    maxRows: props.autosize.maxRows || Infinity
  }
})

const textareaStyle = computed<CSSProperties>(() => {
  if (props.type !== "textarea") return {}

  const config = autosizeConfig.value
  if (!config) return {}

  const lineHeight = 1.5 * 16 // 24px
  const padding = 10 // 5px top + 5px bottom
  const oneLineHeight = lineHeight + padding // 一行的高度 34px

  // 確保最小行數至少為 1
  const minRows = Math.max(1, config.minRows)
  const minHeight = Math.max(oneLineHeight, minRows * lineHeight + padding)
  const maxHeight = config.maxRows !== Infinity ? config.maxRows * lineHeight + padding : undefined

  return {
    minHeight: `${minHeight}px`,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    overflowY: maxHeight ? "auto" : undefined
  }
})

const adjustTextareaHeight = () => {
  if (!textareaRef.value || props.type !== "textarea") return

  const config = autosizeConfig.value
  if (!config) return

  const textarea = textareaRef.value
  const lineHeight = 1.5 * 16 // 24px
  const padding = 10 // 5px top + 5px bottom

  // 確保最小行數至少為 1
  const minRows = Math.max(1, config.minRows)
  const minHeight = Math.max(lineHeight + padding, minRows * lineHeight + padding)
  const maxHeight = config.maxRows !== Infinity ? config.maxRows * lineHeight + padding : undefined

  // 保存當前高度（可能是用戶手動 resize 的結果）
  const currentHeight = textarea.clientHeight

  // 暫時隱藏滾動條以獲取正確的 scrollHeight
  const originalOverflow = textarea.style.overflowY
  textarea.style.overflowY = "hidden"
  textarea.style.height = "auto"

  // 計算內容需要的高度
  const scrollHeight = textarea.scrollHeight
  const contentHeight = Math.max(minHeight, scrollHeight)

  // 決定最終高度
  let targetHeight: number

  if (maxHeight) {
    // 有設定 maxHeight，不超過它
    targetHeight = Math.min(contentHeight, maxHeight)
  } else {
    // 沒有設定 maxHeight
    // 如果用戶手動 resize 過且當前高度小於內容高度，保持當前高度並顯示滾動條
    if (currentHeight >= minHeight && currentHeight < contentHeight) {
      targetHeight = currentHeight
    } else {
      // 否則自動增長到內容高度
      targetHeight = contentHeight
    }
  }

  textarea.style.height = `${targetHeight}px`

  // 檢查是否需要滾動條
  nextTick(() => {
    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.style.overflowY = "auto"
    } else {
      textarea.style.overflowY = "hidden"
    }
  })
}

const handleInput = (event: Event) => {
  if (isComposing.value) return

  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value: string = target.value

  // 如果有 parser，使用它解析值
  if (props.parser && props.type !== "textarea") {
    value = props.parser(value)
  }

  emit("update:modelValue", value)
  emit("input", value)

  // 如果是 textarea，調整高度
  if (props.type === "textarea") {
    nextTick(() => {
      adjustTextareaHeight()
    })
  }
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value = target.value

  // 如果有 parser，使用它解析值
  if (props.parser && props.type !== "textarea") {
    value = props.parser(value)
  }

  emit("change", value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit("focus", event)

  // 聚焦時，如果有格式化，更新顯示為原始值
  if (props.formatter && inputRef.value) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.value = String(props.modelValue || "")
      }
    })
  }
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit("blur", event)

  // 失焦時，如果有格式化，更新顯示為格式化後的值
  if (props.formatter && inputRef.value) {
    nextTick(() => {
      if (inputRef.value && props.modelValue != null && props.modelValue !== "") {
        inputRef.value.value = props.formatter!(props.modelValue)
      }
    })
  }
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (event: Event) => {
  isComposing.value = false
  handleInput(event)
}

const handleClear = () => {
  emit("update:modelValue", "")
  emit("clear")
  emit("input", "")
  emit("change", "")
  focus()
}

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event)
}

const togglePasswordVisible = () => {
  showPasswordVisible.value = !showPasswordVisible.value
  focus()
}

const focus = async () => {
  await nextTick()
  if (inputRef.value) {
    inputRef.value.focus()
  } else if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const blur = () => {
  if (inputRef.value) {
    inputRef.value.blur()
  } else if (textareaRef.value) {
    textareaRef.value.blur()
  }
}

const select = () => {
  if (inputRef.value) {
    inputRef.value.select()
  } else if (textareaRef.value) {
    textareaRef.value.select()
  }
}

// 監聽 modelValue 變化來調整 textarea 高度
watch(
  () => props.modelValue,
  () => {
    if (props.type === "textarea") {
      nextTick(() => {
        adjustTextareaHeight()
      })
    }
  }
)

// 組件掛載後調整高度
onMounted(() => {
  if (props.type === "textarea" && textareaRef.value) {
    nextTick(() => {
      adjustTextareaHeight()
    })
  }
})

defineExpose({
  focus,
  blur,
  select,
  input: inputRef,
  textarea: textareaRef,
  resizeTextarea: adjustTextareaHeight
})
</script>

<style scoped>
.el-input {
  --el-input-text-color: #606266;
  --el-input-border: #dcdfe6;
  --el-input-hover-border: #c0c4cc;
  --el-input-focus-border: #409eff;
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: #dcdfe6;
  --el-input-border-radius: 4px;
  --el-input-bg-color: #ffffff;
  --el-input-icon-color: #a8abb2;
  --el-input-placeholder-color: #a8abb2;
  --el-input-hover-border-color: #c0c4cc;
  --el-input-clear-hover-color: #909399;
  --el-input-focus-border-color: #409eff;
  --el-disabled-bg-color: #f5f7fa;
  --el-disabled-text-color: #c0c4cc;
  --el-disabled-border-color: #e4e7ed;

  position: relative;
  font-size: 14px;
  display: inline-flex;
  width: 100%;
  line-height: 32px;
  box-sizing: border-box;
  vertical-align: middle;
}

.el-input__wrapper {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--el-input-bg-color);
  background-image: none;
  border-radius: var(--el-input-border-radius);
  cursor: text;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 0 0 1px var(--el-input-border-color) inset;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.el-input__wrapper:has(.el-input__inner:focus) {
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}

.el-input__inner {
  width: 100%;
  flex-grow: 1;
  appearance: none;
  color: var(--el-input-text-color);
  font-size: inherit;
  height: 30px;
  line-height: 30px;
  padding: 0;
  outline: none;
  border: none;
  background: none;
  box-sizing: border-box;
}

.el-input__inner::placeholder {
  color: var(--el-input-placeholder-color);
}

.el-input__inner:focus {
  outline: none;
}

.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 11px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  color: var(--el-input-text-color);
  background-color: var(--el-input-bg-color);
  background-image: none;
  appearance: none;
  box-shadow: 0 0 0 1px var(--el-input-border-color) inset;
  border-radius: var(--el-input-border-radius);
  transition: box-shadow 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  border: none;
  outline: none;
}

.el-textarea__inner::placeholder {
  color: var(--el-input-placeholder-color);
}

.el-textarea__inner:hover {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.el-textarea__inner:focus {
  outline: none;
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}

.el-textarea__count {
  color: var(--el-input-icon-color);
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  text-align: right;
}

.el-input__prefix,
.el-input__suffix {
  display: inline-flex;
  white-space: nowrap;
  flex-shrink: 0;
  flex-wrap: nowrap;
  height: 100%;
  text-align: center;
  color: var(--el-input-icon-color);
  transition: all 0.3s;
}

.el-input__prefix {
  padding-right: 8px;
}

.el-input__suffix {
  padding-left: 8px;
}

.el-input__suffix-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.el-input__icon {
  height: inherit;
  line-height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  font-size: 14px;
}

.el-input__clear,
.el-input__password {
  cursor: pointer;
}

.el-input__clear:hover,
.el-input__password:hover {
  color: var(--el-input-clear-hover-color);
}

.el-input__count {
  display: inline-flex;
  align-items: center;
  color: var(--el-input-icon-color);
  font-size: 12px;
  margin-left: 8px;
}

.el-input__count-inner {
  background: var(--el-input-bg-color);
  line-height: initial;
  display: inline-block;
  padding-left: 8px;
}

/* 前置/後置內容 */
.el-input-group__prepend,
.el-input-group__append {
  background-color: #f5f7fa;
  color: #909399;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  white-space: nowrap;
  border: 1px solid var(--el-input-border-color);
  border-radius: var(--el-input-border-radius);
  box-sizing: border-box;
}

.el-input-group__prepend {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.el-input-group__append {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.el-input-group__prepend + .el-input__wrapper {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.el-input__wrapper:has(+ .el-input-group__append) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* 禁用狀態 */
.el-input.is-disabled .el-input__wrapper {
  background-color: var(--el-disabled-bg-color);
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  cursor: not-allowed;
}

.el-input.is-disabled .el-input__inner {
  color: var(--el-disabled-text-color);
  cursor: not-allowed;
}

.el-input.is-disabled .el-textarea__inner {
  background-color: var(--el-disabled-bg-color);
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  color: var(--el-disabled-text-color);
  cursor: not-allowed;
}

/* 尺寸 */
.el-input--large .el-input__wrapper {
  padding: 1px 15px;
  font-size: 16px;
}

.el-input--large .el-input__inner {
  height: 38px;
  line-height: 38px;
}

.el-input--small .el-input__wrapper {
  padding: 1px 7px;
  font-size: 12px;
}

.el-input--small .el-input__inner {
  height: 24px;
  line-height: 24px;
}

/* 超出字數限制 */
.el-input.is-exceed .el-input__inner,
.el-input.is-exceed .el-textarea__inner {
  color: #f56c6c;
}

.el-input.is-exceed .el-input__count {
  color: #f56c6c;
}
</style>
