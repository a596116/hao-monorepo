<template>
  <v-app-bar border flat>
    <div class="flex gap-1 items-center px-2 w-full">
      <v-btn
        :icon="appStore.rail ? 'mdi-menu-close' : 'mdi-menu-open'"
        rounded="lg"
        size="44"
        @click="appStore.toggleRail()"
      />

      <!-- 面包屑导航 -->
      <Breadcrumbs />

      <v-spacer />
      <LanguageSwitcher />

      <LanguageSelect />
      <UserInfo />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app"
import LanguageSelect from "i18n-jsautotranslate/vue/vue3/LanguageSelect.vue"

const appStore = useAppStore()
</script>
