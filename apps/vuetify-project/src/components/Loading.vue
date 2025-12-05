<template>
  <transition name="loading-fade">
    <div v-if="loading" :class="['loading-wrapper', inline ? 'loading-inline' : 'loading-fullscreen']">
      <div class="loading-spinner">
        <v-progress-circular :size="size" :width="width" :color="color" indeterminate></v-progress-circular>
        <div v-if="text" class="loading-text" :style="{ color: textColor }">
          {{ text }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
export interface LoadingProps {
  loading?: boolean
  inline?: boolean
  text?: string
  color?: string
  textColor?: string
  size?: number
  width?: number
  background?: string
}

const props = withDefaults(defineProps<LoadingProps>(), {
  loading: false,
  inline: false,
  text: "",
  color: "primary",
  textColor: "#606266",
  size: 40,
  width: 4,
  background: "rgba(255, 255, 255, 0.9)"
})
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind(background);
}

.loading-inline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind(background);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  font-size: 14px;
  margin-top: 8px;
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
