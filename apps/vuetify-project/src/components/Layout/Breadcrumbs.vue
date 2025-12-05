<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template #divider>
      <v-icon icon="mdi-chevron-right" size="small"></v-icon>
    </template>
    <template #title="{ item }: any">
      <!-- 如果有子項目,顯示下拉菜單 -->
      <div v-if="item.c && item.c.length > 0" class="">
        <v-menu open-on-hover>
          <template #activator="{ props }">
            <div v-bind="props" class="flex gap-1 items-center cursor-pointer">
              <v-icon v-if="item.icon" :icon="item.icon" size="small" class="text-primary"></v-icon>
              <span :class="!item.href ? 'text-black/50' : 'text-primary'">
                {{ item.title }}
              </span>
            </div>
          </template>
          <v-list density="compact" min-width="160" nav>
            <v-list-item
              v-for="child in item.c"
              :key="child.path"
              :to="child.path"
              :value="child.path"
              :active="route.path === child.path"
              color="primary"
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- 沒有子項目,正常顯示 -->
      <div v-else class="flex gap-1 items-center">
        <v-icon v-if="item.icon" :icon="item.icon" size="small" class="text-primary"></v-icon>
        <span :class="!item.href ? 'text-black/50' : 'text-primary'">
          {{ item.title }}
        </span>
      </div>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useAppStore, type MenuItem } from "@/stores/app"

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()

// 遞歸查找 menu 項目（包括子項目）
const findMenuItem = (path: string, items: MenuItem[]): MenuItem | null => {
  for (const item of items) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      const found = findMenuItem(path, item.children)
      if (found) return found
    }
  }
  return null
}

// 查找父路由
const findParentItem = (path: string, items: MenuItem[]): MenuItem | null => {
  for (const item of items) {
    if (item.children) {
      const child = item.children.find(c => c.path === path)
      if (child) return item
      const found = findParentItem(path, item.children)
      if (found) return found
    }
  }
  return null
}

// 面包屑导航
const breadcrumbs = computed(() => {
  const crumbs = [
    {
      title: t("common.appTitle"),
      disabled: false,
      href: "/",
      icon: "mdi-home"
    }
  ] as { title: string; disabled?: boolean; href?: string; icon?: string; c?: MenuItem[] }[]

  const currentPath = route.path as string
  const currentItem = findMenuItem(currentPath, appStore.menuItems)
  const parentItem = findParentItem(currentPath, appStore.menuItems)

  if (parentItem) {
    // 嵌套路由：添加父路由和子路由
    crumbs.push({
      title: parentItem.title,
      disabled: false,
      href: parentItem.path,
      icon: parentItem.icon,
      c: parentItem.children
    })
  }

  if (currentItem && currentItem.path !== "/") {
    crumbs.push({
      title: currentItem.title,
      disabled: false
    })
  }

  return crumbs
})
</script>

<style scoped lang="scss">
:deep(.v-breadcrumbs-item--link:hover) {
  text-decoration: none;
}
</style>
