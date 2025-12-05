<template>
  <Button :class="['p-button-circle microphone-button', isFlipped ? 'transform rotate-180' : '']" @click="handleClick">
    <div :class="isFlipped ? 'transform rotate-180' : ''">
      <i class="pi pi-microphone text-2xl"></i>
    </div>
  </Button>
</template>

<script setup lang="ts">
import Button from "primevue/button"

interface Props {
  isFlipped?: boolean
}

interface Emits {
  (e: "click"): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit("click")
}
</script>

<style scoped>
.microphone-button {
  width: 64px;
  height: 64px;
  background: #14b8a6 !important;
  border: none !important;
  border-radius: 50%;
}

.microphone-button:hover {
  background: #0d9488 !important;
}

:deep(.p-button-label) {
  display: none;
}
</style>
