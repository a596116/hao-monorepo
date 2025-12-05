<template>
  <li
    v-if="item.children && item.children.length > 0 && (!collapsed || item.showWhenCollapsed)"
    class="relative menu-item sub-menu"
    :class="{
      open: isOpen,
      'mt-6': !isFirstSection && level === 0
    }"
  >
    <a
      href="#"
      class="flex items-center h-[34px] px-3 mx-2 text-white no-underline cursor-pointer hover:bg-[#1a1a2e] rounded-md transition-colors duration-200"
      @click.prevent="handleToggle"
    >
      <span
        v-if="item.icon"
        class="inline-block mr-3 w-5 h-5 text-lg leading-5 text-center transition-colors duration-300 menu-icon min-w-5"
      >
        <HomeIcon :size="20" :color="'#d1d5db'" />
      </span>
      <span
        class="overflow-hidden flex-grow text-sm font-medium whitespace-nowrap transition-colors duration-300 text-ellipsis"
        :class="{ hidden: collapsed }"
      >
        {{ item.title }}
      </span>
      <span
        v-if="!collapsed"
        class="ml-2 w-2 h-2 border-r-2 border-b-2 border-white transition-transform duration-300"
        :class="{ 'rotate-45': isOpen, '-rotate-45': !isOpen }"
      ></span>
    </a>
    <div ref="subMenuEl" class="overflow-hidden sub-menu-list" :class="{ hidden: !isOpen && !isAnimating }">
      <ul class="p-0 m-0 list-none">
        <ProSidebarMenuItem
          v-for="child in item.children"
          :key="child.key || child.title"
          :item="child"
          :collapsed="collapsed"
          :level="level + 1"
          :active-key="activeKey"
          @click="$emit('click', $event)"
        />
      </ul>
    </div>
  </li>
  <li v-else-if="!collapsed || item.showWhenCollapsed" :class="{ active: activeKey === (item.key || item.title) }">
    <a
      :href="item.path || '#'"
      class="flex items-center h-[34px] px-3 mx-2 text-[#d1d5db] no-underline hover:bg-[#1a1a2e] hover:text-white transition-colors duration-200 rounded-md"
      :class="{ 'bg-[#2a2a3e] text-white': activeKey === (item.key || item.title) }"
      @click.prevent="handleClick"
    >
      <span
        v-if="item.icon"
        class="inline-block mr-3 w-5 h-5 text-lg leading-5 text-center transition-colors duration-300 menu-icon min-w-5"
      >
        <HomeIcon :size="20" :color="'#d1d5db'" />
      </span>
      <span
        class="overflow-hidden flex-grow text-sm whitespace-nowrap transition-colors duration-300 text-ellipsis"
        :class="{ hidden: collapsed }"
      >
        {{ item.title }}
      </span>
    </a>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import HomeIcon from "./icons/HomeIcon.vue"

const ANIMATION_DURATION = 300

export interface MenuItem {
  key?: string
  title: string
  path?: string
  icon?: string | object
  badge?: {
    type?: "primary" | "secondary"
    text: string
  }
  prefix?: string
  children?: MenuItem[]
  showWhenCollapsed?: boolean // 收合時是否顯示
}

interface Props {
  item: MenuItem
  collapsed: boolean
  level?: number
  activeKey?: string
  isFirstSection?: boolean
  hasPreviousSection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
  activeKey: "",
  isFirstSection: false,
  hasPreviousSection: false
})

const emit = defineEmits<{
  click: [item: MenuItem]
}>()

const subMenuEl = ref<HTMLElement | null>(null)
// 每個項目獨立管理自己的展開狀態，預設展開
const isOpen = ref(true)
const isAnimating = ref(false)
const menuKey = computed(() => props.item.key || props.item.title)

const badgeClass = computed(() => {
  if (!props.item.badge) return ""
  return props.item.badge.type === "primary"
    ? "bg-[#ab2dff]"
    : props.item.badge.type === "secondary"
      ? "bg-[#079b0b]"
      : "bg-[#6c757d]"
})

const subMenuBgClass = computed(() => {
  return props.level === 0 ? "bg-[#0b1a2c]" : ""
})

const slideUp = (target: HTMLElement, duration = ANIMATION_DURATION) => {
  const parentElement = target.parentElement
  if (parentElement) {
    parentElement.classList.remove("open")
  }
  // 確保元素可見以便計算高度
  target.classList.remove("hidden")
  target.style.display = "block"
  target.style.height = "auto"
  void target.offsetHeight // Trigger reflow
  const startHeight = target.offsetHeight
  target.style.transitionProperty = "height, margin, padding"
  target.style.transitionDuration = `${duration}ms`
  target.style.boxSizing = "border-box"
  target.style.height = `${startHeight}px`
  void target.offsetHeight // Trigger reflow
  target.style.overflow = "hidden"
  target.style.height = "0"
  target.style.paddingTop = "0"
  target.style.paddingBottom = "0"
  target.style.marginTop = "0"
  target.style.marginBottom = "0"
  setTimeout(() => {
    target.style.display = "none"
    target.classList.add("hidden")
    target.style.removeProperty("height")
    target.style.removeProperty("padding-top")
    target.style.removeProperty("padding-bottom")
    target.style.removeProperty("margin-top")
    target.style.removeProperty("margin-bottom")
    target.style.removeProperty("overflow")
    target.style.removeProperty("transition-duration")
    target.style.removeProperty("transition-property")
  }, duration)
}

const slideDown = (target: HTMLElement, duration = ANIMATION_DURATION) => {
  const parentElement = target.parentElement
  if (parentElement) {
    parentElement.classList.add("open")
  }
  target.classList.remove("hidden")
  target.style.setProperty("display", "block", "important")
  void target.offsetHeight // Trigger reflow
  const height = target.offsetHeight
  target.style.overflow = "hidden"
  target.style.height = "0"
  target.style.paddingTop = "0"
  target.style.paddingBottom = "0"
  target.style.marginTop = "0"
  target.style.marginBottom = "0"
  void target.offsetHeight // Trigger reflow
  target.style.boxSizing = "border-box"
  target.style.transitionProperty = "height, margin, padding"
  target.style.transitionDuration = `${duration}ms`
  target.style.height = `${height}px`
  target.style.removeProperty("padding-top")
  target.style.removeProperty("padding-bottom")
  target.style.removeProperty("margin-top")
  target.style.removeProperty("margin-bottom")
  setTimeout(() => {
    target.style.removeProperty("height")
    target.style.removeProperty("overflow")
    target.style.removeProperty("transition-duration")
    target.style.removeProperty("transition-property")
    target.style.removeProperty("display")
  }, duration)
}

const handleToggle = (event: Event) => {
  event.preventDefault()
  if (isAnimating.value || !subMenuEl.value) return

  isAnimating.value = true
  if (isOpen.value) {
    // 收合
    slideUp(subMenuEl.value)
    isOpen.value = false
  } else {
    // 展開
    slideDown(subMenuEl.value)
    isOpen.value = true
  }
  setTimeout(() => {
    isAnimating.value = false
  }, ANIMATION_DURATION)
}

const handleClick = () => {
  emit("click", props.item)
}

// 監聽 isOpen 狀態，確保子選單顯示狀態同步
watch(
  () => isOpen.value,
  newVal => {
    if (!subMenuEl.value) return

    if (newVal) {
      // 如果應該展開，確保子選單可見
      nextTick(() => {
        if (subMenuEl.value && !isAnimating.value) {
          // 只有在非動畫狀態下才直接設置
          if (subMenuEl.value.classList.contains("hidden")) {
            subMenuEl.value.classList.remove("hidden")
            subMenuEl.value.style.display = "block"
            subMenuEl.value.style.height = "auto"
          }
          const parentElement = subMenuEl.value.parentElement
          if (parentElement) {
            parentElement.classList.add("open")
          }
        }
      })
    }
  },
  { immediate: true }
)

// 監聽 collapsed 變化，當側邊欄展開時恢復子選單顯示
watch(
  () => props.collapsed,
  (newVal, oldVal) => {
    // 當從收合狀態展開時，如果 isOpen 是 true，需要重新顯示子選單
    if (oldVal === true && newVal === false && isOpen.value && subMenuEl.value) {
      nextTick(() => {
        if (subMenuEl.value) {
          subMenuEl.value.classList.remove("hidden")
          subMenuEl.value.style.display = "block"
          subMenuEl.value.style.height = "auto"
          const parentElement = subMenuEl.value.parentElement
          if (parentElement) {
            parentElement.classList.add("open")
          }
        }
      })
    }
  }
)

// Export component name for recursive usage
defineOptions({
  name: "ProSidebarMenuItem"
})
</script>
