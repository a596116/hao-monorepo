// Utilities
import { defineStore } from "pinia"
import { routes } from "@/router/routes"
import { useI18n } from "vue-i18n"

// Menu 項目類型定義
export type MenuItem = {
  title: string
  path: string
  icon: string
  children?: MenuItem[]
}

export const useAppStore = defineStore("app", {
  state: () => ({
    rail: true,
    visitCount: 0
  }),
  getters: {
    // 從 routes 動態生成 menuItems
    menuItems(): MenuItem[] {
      const { t } = useI18n()

      // 找到 index 路由的 children
      const indexRoute = routes.find(r => r.name === "index")
      if (!indexRoute || !indexRoute.children) {
        return []
      }

      const items: MenuItem[] = []

      indexRoute.children.forEach(route => {
        const i18nKey = (route.meta?.i18nKey as string) || ""
        const parentPath = route.path as string

        const menuItem: MenuItem = {
          title: i18nKey ? t(i18nKey) : (route.meta?.title as string) || (route.name as string),
          path: parentPath,
          icon: (route.meta?.icon as string) || "mdi-circle-outline"
        }

        // 如果有 children，添加到父路由的 children 屬性中
        if (route.children && route.children.length > 0) {
          const children: MenuItem[] = []
          route.children.forEach(childRoute => {
            if (childRoute.meta?.title) {
              const childI18nKey = (childRoute.meta?.i18nKey as string) || ""
              // 構建完整的子路由路徑
              const childPath = childRoute.path.startsWith("/") ? childRoute.path : `${parentPath}/${childRoute.path}`

              children.push({
                title: childI18nKey
                  ? t(childI18nKey)
                  : (childRoute.meta?.title as string) || (childRoute.name as string),
                path: childPath,
                icon: (childRoute.meta?.icon as string) || "mdi-circle-outline"
              })
            }
          })
          if (children.length > 0) {
            menuItem.children = children
          }
        }

        items.push(menuItem)
      })

      return items
    }
  },
  actions: {
    toggleRail() {
      this.rail = !this.rail
    },
    // 初始化訪問計數
    initVisitCount() {
      const storedCount = localStorage.getItem("visitCount")
      if (storedCount) {
        this.visitCount = parseInt(storedCount, 10)
      } else {
        this.visitCount = 0
      }
      this.incrementVisitCount()
    },
    // 增加訪問計數
    incrementVisitCount() {
      this.visitCount++
      localStorage.setItem("visitCount", this.visitCount.toString())
    },
    // 重置訪問計數（可選功能）
    resetVisitCount() {
      this.visitCount = 0
      localStorage.setItem("visitCount", "0")
    }
  }
})
