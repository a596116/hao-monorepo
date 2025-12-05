/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify"
import pinia from "../stores"
import router from "../router"
import i18n from "./i18n"
import "../styles/tailwind.css"

// Directives
import loadingDirective from "../directives/loading"

// Types
import type { App } from "vue"

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(i18n)

  // 註冊全局 directives
  app.directive("loading", loadingDirective)
}
