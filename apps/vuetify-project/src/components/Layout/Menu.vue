<template>
  <v-navigation-drawer :rail="appStore.rail" permanent>
    <template #prepend>
      <Anchor to="/" class="h-[64px] flex items-center justify-center">
        <v-list-item :title="appStore.rail ? '' : t('common.appTitle')" class="px-3">
          <template #prepend>
            <v-img src="/favicon.ico" width="32" height="32" class="mr-2"></v-img>
          </template>
        </v-list-item>
      </Anchor>
    </template>

    <v-list density="compact" nav>
      <template v-for="item in appStore.menuItems" :key="item.path">
        <!-- 有子選單的項目 -->
        <template v-if="item.children && item.children.length > 0">
          <!-- 縮合模式：使用 hover 彈出選單 -->
          <v-menu v-if="appStore.rail" open-on-hover :open-delay="100" location="end" :offset="10">
            <template #activator="{ props: menuProps }">
              <v-list-item
                v-bind="menuProps"
                :prepend-icon="item.icon"
                :title="item.title"
                :active="isParentActive(item.path)"
                color="primary"
              />
            </template>
            <v-list density="compact" nav>
              <v-list-item
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                :title="child.title"
                :active="activated === child.path"
                color="primary"
              />
            </v-list>
          </v-menu>

          <!-- 展開模式：使用 v-list-group -->
          <v-list-group v-else :value="isGroupOpen(item.path)">
            <template #activator="{ props: groupProps }">
              <v-list-item
                v-bind="groupProps"
                :prepend-icon="item.icon"
                :title="item.title"
                :active="isParentActive(item.path)"
                color="primary"
              />
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              :title="child.title"
              :active="activated === child.path"
              color="primary"
              class="pl-0"
            />
          </v-list-group>
        </template>

        <!-- 沒有子選單的項目 -->
        <v-tooltip v-else :disabled="!appStore.rail" :text="item.title" location="right">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :to="item.path"
              :prepend-icon="item.icon"
              :title="item.title"
              :active="activated === item.path"
              color="primary"
            />
          </template>
        </v-tooltip>
      </template>
    </v-list>

    <template #append>
      <v-divider></v-divider>
      <v-tooltip
        :disabled="!appStore.rail"
        :text="`${t('common.visitCount')}: ${appStore.visitCount.toLocaleString()}`"
        location="right"
      >
        <template #activator="{ props }">
          <div
            v-bind="props"
            class="justify-center d-flex align-center pa-4"
            :class="appStore.rail ? 'flex-column gap-1' : 'gap-2'"
          >
            <v-icon size="small">mdi-eye</v-icon>
            <template v-if="!appStore.rail">
              <span class="text-caption">{{ t("common.visitCount") }}</span>
              <span class="text-subtitle-1 font-weight-bold">
                {{ appStore.visitCount.toLocaleString() }}
              </span>
            </template>
            <template v-else>
              <span class="text-caption font-weight-bold">
                {{ appStore.visitCount.toLocaleString() }}
              </span>
            </template>
          </div>
        </template>
      </v-tooltip>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useAppStore } from "@/stores/app"

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const activated = ref("")

// 檢查父路由是否應該展開（如果當前路由是它的子路由）
const isGroupOpen = (parentPath: string) => {
  return route.path.startsWith(parentPath + "/")
}

// 檢查父路由是否應該高亮（如果當前路由是它的子路由）
const isParentActive = (parentPath: string) => {
  return route.path.startsWith(parentPath + "/")
}

watch(
  route,
  () => {
    activated.value = route.path as string
  },
  { immediate: true }
)
</script>
