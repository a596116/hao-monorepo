<template>
  <v-menu>
    <template #activator="{ props }">
      <div v-bind="props" class="gap-2 px-2 py-1 rounded-lg cursor-pointer d-flex align-center hover-bg">
        <v-avatar size="32" color="primary">
          <v-icon icon="mdi-account" size="20"></v-icon>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-body-2 font-weight-medium ignore">{{ userName }}</span>
        </div>
        <v-icon icon="mdi-chevron-down" size="16" class="text-medium-emphasis"></v-icon>
      </div>
    </template>
    <v-list density="compact" min-width="200" nav>
      <v-list-item prepend-icon="mdi-account-circle" :title="t('user.profile')" @click="handleProfile"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" :title="t('user.settings')" @click="handleSettings"></v-list-item>
      <v-divider class="my-1"></v-divider>
      <v-list-item prepend-icon="mdi-logout" :title="t('common.logout')" @click="handleLogout"></v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

// 用戶資訊（可以從 store 或 API 獲取）
const userName = computed(() => "John Doe") // 示例用戶名

function handleProfile() {
  // 處理個人資料點擊
  console.log("Profile clicked")
}

function handleSettings() {
  // 處理設置點擊
  console.log("Settings clicked")
}

function handleLogout() {
  // 處理登出
  console.log("Logout clicked")
}
</script>

<style scoped lang="scss">
.hover-bg {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.08);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
