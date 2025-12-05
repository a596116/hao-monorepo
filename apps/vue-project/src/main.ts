import { createApp } from "vue"
import { createPinia } from "pinia"
import "./tailwind.css"
import "primeicons/primeicons.css"
import App from "./App.vue"
import router from "./router"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"

// 設置動態視口高度，解決移動瀏覽器地址欄問題
// function setViewportHeight() {
//   const vh = window.innerHeight * 0.01
//   document.documentElement.style.setProperty("--vh", `${vh}px`)
// }

// 初始設置
// setViewportHeight()

// 監聽視窗大小變化（包括地址欄顯示/隱藏）
// window.addEventListener("resize", setViewportHeight)
// window.addEventListener("orientationchange", setViewportHeight)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount("#app")
