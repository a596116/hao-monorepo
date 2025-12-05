<template>
  <suspense>
    <v-app class="overflow-hidden h-screen">
      <router-view />

      <HaoChatbot ref="chatbotRef" />
    </v-app>
  </suspense>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useAppStore } from "@/stores/app"
import { HaoChatbot } from "hao-chatbot"

const appStore = useAppStore()

// 在應用載入時初始化訪問計數
onMounted(() => {
  appStore.initVisitCount()
})
</script>
