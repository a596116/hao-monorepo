/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins"

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"

// Styles
import "unfonts.css"
import "hao-chatbot/dist/style.css"
import { translateJsVueUseModel } from "@/utils/translate"

const app = createApp(App)

registerPlugins(app)

app.use(translateJsVueUseModel)

app.mount("#app")
