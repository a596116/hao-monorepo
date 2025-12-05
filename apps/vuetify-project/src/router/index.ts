/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router"
import { routes } from "./routes"
import i18n from "@/plugins/i18n"
import getPageTitle from "@/utils/getPageTitle"
// import { setupLayouts } from 'virtual:generated-layouts'
// import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  // routes: setupLayouts(routes),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    return { top: 0 }
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err)
    } else {
      console.log("Reloading page to fix dynamic import error")
      localStorage.setItem("vuetify:dynamic-reload", "true")
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload")
})

router.beforeEach((to, from, next) => {
  document.title = getPageTitle(i18n.global.t(to.meta.i18nKey as string))
  next()
})

export default router
