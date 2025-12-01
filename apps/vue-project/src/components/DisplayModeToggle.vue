<template>
  <Button
    :label="displayMode === 'chat' ? '顯示方式' : '顯示方式'"
    class="text-white bg-gray-800 border-gray-700 hover:bg-gray-700"
    @click="toggleMode"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button'

interface Props {
  displayMode: 'chat' | 'face-to-face'
}

interface Emits {
  (e: 'update:displayMode', value: 'chat' | 'face-to-face'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleMode = () => {
  const newMode = props.displayMode === 'chat' ? 'face-to-face' : 'chat'
  emit('update:displayMode', newMode)
}
</script>

<style scoped></style>
