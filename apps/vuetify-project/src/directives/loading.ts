import { type Directive } from "vue"
import { createApp, h } from "vue"
import Loading from "@/components/Loading.vue"
import { registerPlugins } from "@/plugins"

interface LoadingElement extends HTMLElement {
  _loadingInstance?: {
    app: any
    container: HTMLElement
  }
}

export interface LoadingDirectiveOptions {
  text?: string
  color?: string
  textColor?: string
  size?: number
  width?: number
  background?: string
}

const loadingDirective: Directive<LoadingElement, boolean | LoadingDirectiveOptions> = {
  mounted(el, binding) {
    if (binding.value === false) return

    // 設置父元素為相對定位
    const position = window.getComputedStyle(el).position
    if (position === "static") {
      el.style.position = "relative"
    }

    // 解析選項
    let options: LoadingDirectiveOptions = {}
    if (typeof binding.value === "object") {
      options = binding.value
    }

    // 創建容器
    const container = document.createElement("div")
    el.appendChild(container)

    // 創建 Loading 組件
    const loadingVNode = h(Loading, {
      loading: true,
      inline: true,
      ...options
    })

    const app = createApp({
      render() {
        return loadingVNode
      }
    })

    // 註冊插件
    registerPlugins(app)

    app.mount(container)

    // 保存實例引用
    el._loadingInstance = {
      app,
      container
    }
  },

  updated(el, binding) {
    const hasInstance = !!el._loadingInstance

    // 如果 binding.value 為 true 或對象，顯示 loading
    const shouldShow = binding.value !== false && binding.value !== undefined

    if (shouldShow && !hasInstance) {
      // 需要顯示但沒有實例，創建新實例
      // 設置父元素為相對定位
      const position = window.getComputedStyle(el).position
      if (position === "static") {
        el.style.position = "relative"
      }

      // 解析選項
      let options: LoadingDirectiveOptions = {}
      if (typeof binding.value === "object") {
        options = binding.value
      }

      // 創建容器
      const container = document.createElement("div")
      el.appendChild(container)

      // 創建 Loading 組件
      const loadingVNode = h(Loading, {
        loading: true,
        inline: true,
        ...options
      })

      const app = createApp({
        render() {
          return loadingVNode
        }
      })

      // 註冊插件
      registerPlugins(app)

      app.mount(container)

      // 保存實例引用
      el._loadingInstance = {
        app,
        container
      }
    } else if (!shouldShow && hasInstance) {
      // 不需要顯示但有實例，移除實例
      const { app, container } = el._loadingInstance!

      if (app) {
        app.unmount()
      }

      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }

      delete el._loadingInstance
    }
  },

  unmounted(el) {
    if (el._loadingInstance) {
      const { app, container } = el._loadingInstance

      if (app) {
        app.unmount()
      }

      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }

      delete el._loadingInstance
    }
  }
}

export default loadingDirective
