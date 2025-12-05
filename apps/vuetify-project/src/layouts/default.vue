<template>
  <div class="app-layout">
    <Sidebar v-model:collapsed="appStore.rail" />
    <div
      class="main-content"
      :style="{ marginLeft: appStore.rail ? '60px' : '260px', transition: 'margin-left 0.3s ease' }"
    >
      <AppBar />
      <v-main class="flex overflow-hidden relative w-full">
        <router-view v-slot="{ Component }" class="!overflow-auto !h-full w-full">
          <v-scroll-x-transition hide-on-leave>
            <component :is="Component" />
          </v-scroll-x-transition>
        </router-view>
      </v-main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from "@/components/Layout/Menu.vue"
import AppBar from "@/components/Layout/AppBar.vue"
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
}
</style>
