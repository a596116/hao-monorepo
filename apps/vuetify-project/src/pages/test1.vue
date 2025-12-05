<template>
  <div class="flex relative h-screen">
    <ProSidebarDemo
      ref="sidebarRef"
      v-model:collapsed="isCollapsed"
      :menus="menus"
      :has-bg-image="false"
      :show-footer="true"
      header-title="Pro Sidebar"
      @item-click="handleItemClick"
    />
    <div class="overflow-auto flex-1 transition-all">
      123213
      <main class="flex justify-end p-3 md:p-12">
        <button
          id="btn-toggle"
          class="top-5 right-5 w-10 h-10 text-3xl rounded-full bg-slate-700"
          @click="toggleSidebar"
        >
          T
        </button>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProSidebarDemo, { type MenuSection } from "@/components/ProSidebarDemo.vue"

const isCollapsed = ref(false)
const sidebarRef = ref<InstanceType<typeof ProSidebarDemo> | null>(null)

const menus: MenuSection[] = [
  {
    key: "new-conversation",
    title: "新對話",
    icon: "ri-pencil-line",
    path: "/new",
    showWhenCollapsed: true
  },
  {
    key: "search-conversation",
    title: "搜尋對話",
    icon: "ri-search-line",
    path: "/search",
    showWhenCollapsed: true
  },
  {
    key: "gallery",
    title: "圖庫",
    icon: "ri-image-line",
    path: "/gallery"
  },
  {
    key: "atlas",
    title: "Atlas",
    icon: "ri-compass-line",
    path: "/atlas"
  },
  {
    key: "projects",
    title: "專案",
    icon: "ri-folder-add-line",
    path: "/projects"
  },
  {
    key: "gpt",
    title: "GPT",
    children: [
      {
        key: "explore",
        title: "探索",
        icon: "ri-grid-fill",
        path: "/gpt/explore"
      },
      {
        key: "dalle",
        title: "DALL·E",
        icon: "ri-image-2-line",
        path: "/gpt/dalle"
      }
    ]
  },
  {
    key: "your-chats",
    title: "你的聊天",
    children: [
      {
        key: "nodejs-vs-csharp",
        title: "Node.js vs C# 比較",
        path: "/chat/nodejs-vs-csharp"
      },
      {
        key: "api-json-format",
        title: "常見 API JSON 格式",
        path: "/chat/api-json-format"
      },
      {
        key: "qa-organization",
        title: "問題答案整理",
        path: "/chat/qa-organization"
      },
      {
        key: "pinia-comparison",
        title: "Pinia 使用方式比較",
        path: "/chat/pinia-comparison"
      },
      {
        key: "api-design",
        title: "API 設計建議",
        path: "/chat/api-design"
      },
      {
        key: "api-upload-design",
        title: "API upload設計建議",
        path: "/chat/api-upload-design"
      },
      {
        key: "vue3-composition",
        title: "Vue 3 Composition API 最佳實踐",
        path: "/chat/vue3-composition"
      },
      {
        key: "typescript-tips",
        title: "TypeScript 進階技巧",
        path: "/chat/typescript-tips"
      },
      {
        key: "tailwind-custom",
        title: "Tailwind CSS 自訂樣式",
        path: "/chat/tailwind-custom"
      },
      {
        key: "performance-optimization",
        title: "前端效能優化策略",
        path: "/chat/performance-optimization"
      }
    ]
  }
]

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleItemClick = (item: any) => {
  console.log("Item clicked:", item)
  if (item.path) {
    // Handle navigation
    console.log("Navigate to:", item.path)
  }
}
</script>
