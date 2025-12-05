<template>
  <div class="flex items-start gap-2" :class="{ 'flex-row-reverse': isOwn }">
    <div
      :class="[
        'rounded-2xl p-4 mb-3 max-w-[80%]',
        isOwn ? 'ml-auto bg-teal-500' : 'mr-auto bg-gray-700',
        isFlipped ? 'transform rotate-180' : ''
      ]"
    >
      <div :class="isFlipped ? 'transform rotate-180' : ''">
        <div class="text-white text-lg mb-1">{{ message }}</div>
        <div v-if="translation" class="text-gray-200 text-sm">{{ translation }}</div>
      </div>
    </div>
    <div v-if="showPlayButton" class="mt-2 flex items-center">
      <button
        class="w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center hover:bg-teal-300 transition-colors"
        @click="$emit('play')"
      >
        <i class="pi pi-play text-white text-xs ml-0.5"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  translation?: string
  isOwn?: boolean
  isFlipped?: boolean
  showPlayButton?: boolean
}

defineProps<Props>()
defineEmits<{
  play: []
}>()
</script>

<style scoped></style>
