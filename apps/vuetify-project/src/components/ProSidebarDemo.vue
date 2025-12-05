<template>
  <aside
    id="sidebar"
    ref="sidebarEl"
    class="max-md:fixed w-[260px] top-0 left-0 h-screen z-[1000] transition-all duration-300 text-[#7d84ab] overflow-x-hidden bg-[#0f0f1e]"
    :class="{
      'w-[60px] max-md:w-[0px]': collapsed,
      'w-[0px]': isDrawer && collapsed,
      absolute: isDrawer
    }"
  >
    <div class="relative z-[2] bg-[#0f0f1e] min-h-full flex flex-col">
      <!-- Sidebar Header -->
      <div class="h-[60px] min-h-[60px] px-5 overflow-hidden flex items-center border-b border-[#1a1a2e]">
        <div class="flex items-center">
          <HomeIcon :size="20" :color="'#d1d5db'" />
          <h5
            class="overflow-hidden flex-grow m-0 ml-3 text-base font-semibold text-white whitespace-nowrap transition-opacity duration-300 text-ellipsis"
            :class="{ hidden: collapsed }"
          >
            {{ headerTitle }}
          </h5>
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="overflow-y-auto flex-grow py-2">
        <nav class="">
          <ul class="p-0 m-0 list-none">
            <template v-for="(section, index) in menus" :key="section.key || section.title">
              <ProSidebarMenuItem
                :item="section"
                :collapsed="collapsed"
                :active-key="activeKey"
                :is-first-section="index === 0"
                :has-previous-section="index > 0 && !menus[index - 1]?.children"
                @click="handleItemClick"
              />
            </template>
          </ul>
        </nav>
      </div>
    </div>

    <div
      v-if="!collapsed"
      class="max-md:fixed md:hidden top-0 left-0 w-full h-full z-[1] bg-black opacity-50"
      @click="handleMaskClick"
    ></div>
    <div
      v-if="isDrawer && !collapsed"
      class="fixed top-0 left-0 w-full h-full z-[1] bg-black opacity-50"
      @click="handleMaskClick"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import ProSidebarMenuItem, { type MenuItem } from "./ProSidebarMenuItem.vue"
import HomeIcon from "./icons/HomeIcon.vue"

export interface MenuSection {
  key: string
  title: string
  icon?: string
  badge?: {
    type?: "primary" | "secondary"
    text: string
  }
  path?: string
  children?: MenuSection[]
  showWhenCollapsed?: boolean // 收合時是否顯示
}

interface Props {
  menus: MenuSection[]
  headerTitle?: string
  isDrawer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerTitle: "Pro Sidebar"
})
const collapsed = defineModel<boolean>("collapsed", { required: true })

const emit = defineEmits<{
  "item-click": [item: MenuItem]
}>()

const sidebarEl = ref<HTMLElement | null>(null)
// 預設選中第一個聊天項目
const activeKey = ref("nodejs-vs-csharp")

const handleItemClick = (item: MenuItem) => {
  activeKey.value = item.key || item.title
  emit("item-click", item)
}

const handleMaskClick = () => {
  collapsed.value = true
}
</script>

<style scoped>
/* Custom scrollbar styles */
.sidebar::-webkit-scrollbar {
  display: none;
}

@media (max-width: 576px) {
  #btn-collapse {
    display: none;
  }
}
</style>
