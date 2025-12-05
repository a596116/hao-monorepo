import { createApp, h } from "vue"
import { createVuetify } from "vuetify"
import MessageBox from "@/components/MessageBox.vue"
import type { MessageBoxProps } from "@/components/MessageBox.vue"

// MessageBox 實例管理
interface MessageBoxInstance {
  app: any
  container: HTMLElement
  resolve: (value: "confirm" | "cancel") => void
  close: () => void
}

let currentMessageBoxInstance: MessageBoxInstance | null = null

export interface MessageBoxOptions {
  title?: string
  subTitle?: string | Array<any>
  message: string
  type?: "success" | "warning" | "info" | "error"
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  showCancelButton?: boolean
  showInput?: boolean
  inputPlaceholder?: string
  customClass?: string
  cancelButtonClass?: string
  showConfirmButton?: boolean
  showClose?: boolean
  iconName?: string
  closeOnClickModal?: boolean
}

export const useMessageBox = () => {
  const alert = (options: MessageBoxOptions | string): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      const props: MessageBoxProps =
        typeof options === "string"
          ? { message: options, showCancelButton: false }
          : { ...options, showCancelButton: false }

      // 如果已經有 MessageBox 打開，先關閉
      if (currentMessageBoxInstance) {
        currentMessageBoxInstance.close()
      }

      // 創建容器
      const container = document.createElement("div")
      document.body.appendChild(container)

      // 創建 Vuetify 實例
      const vuetify = createVuetify()

      let messageBoxRef: any = null

      // 創建 MessageBox 實例
      const app = createApp({
        render() {
          return h(MessageBox, {
            ...props,
            ref: (el: any) => {
              messageBoxRef = el
            },
            onConfirm: () => {
              const inputValue = messageBoxRef?.getInputValue?.() || ""
              resolve(props.showInput ? inputValue : undefined)
              closeMessageBox()
            },
            onCancel: () => {
              reject(new Error("cancel"))
              closeMessageBox()
            }
          })
        }
      })

      app.use(vuetify)
      app.mount(container)

      const closeMessageBox = () => {
        if (app && container.parentNode) {
          app.unmount()
          document.body.removeChild(container)
        }
        if (currentMessageBoxInstance?.app === app) {
          currentMessageBoxInstance = null
        }
      }

      // 記錄實例
      currentMessageBoxInstance = {
        app,
        container,
        resolve: () => {},
        close: closeMessageBox
      }
    })
  }

  const confirm = (options: MessageBoxOptions | string): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      const props: MessageBoxProps =
        typeof options === "string" ? { message: options } : { ...options, showCancelButton: true }

      // 如果已經有 MessageBox 打開，先關閉
      if (currentMessageBoxInstance) {
        currentMessageBoxInstance.close()
      }

      // 創建容器
      const container = document.createElement("div")
      document.body.appendChild(container)

      // 創建 Vuetify 實例
      const vuetify = createVuetify()

      let messageBoxRef: any = null

      // 創建 MessageBox 實例
      const app = createApp({
        render() {
          return h(MessageBox, {
            ...props,
            ref: (el: any) => {
              messageBoxRef = el
            },
            onConfirm: () => {
              const inputValue = messageBoxRef?.getInputValue?.() || ""
              resolve(props.showInput ? inputValue : undefined)
              closeMessageBox()
            },
            onCancel: () => {
              reject(new Error("cancel"))
              closeMessageBox()
            }
          })
        }
      })

      app.use(vuetify)
      app.mount(container)

      const closeMessageBox = () => {
        if (app && container.parentNode) {
          app.unmount()
          document.body.removeChild(container)
        }
        if (currentMessageBoxInstance?.app === app) {
          currentMessageBoxInstance = null
        }
      }

      // 記錄實例
      currentMessageBoxInstance = {
        app,
        container,
        resolve: () => {},
        close: closeMessageBox
      }
    })
  }

  const question = (options: MessageBoxOptions | string): Promise<string | void> => {
    const props =
      typeof options === "string"
        ? { message: options, type: "warning" as const }
        : { ...options, type: "warning" as const }
    return confirm(props)
  }

  const success = (options: MessageBoxOptions | string): Promise<string | void> => {
    const props =
      typeof options === "string"
        ? { message: options, type: "success" as const }
        : { ...options, type: "success" as const }
    return confirm(props)
  }

  const warning = (options: MessageBoxOptions | string): Promise<string | void> => {
    const props =
      typeof options === "string"
        ? { message: options, type: "warning" as const }
        : { ...options, type: "warning" as const }
    return confirm(props)
  }

  const info = (options: MessageBoxOptions | string): Promise<string | void> => {
    const props =
      typeof options === "string" ? { message: options, type: "info" as const } : { ...options, type: "info" as const }
    return confirm(props)
  }

  const error = (options: MessageBoxOptions | string): Promise<string | void> => {
    const props =
      typeof options === "string"
        ? { message: options, type: "error" as const }
        : { ...options, type: "error" as const }
    return confirm(props)
  }

  return {
    alert,
    confirm,
    question,
    success,
    warning,
    info,
    error
  }
}

// 全局方法
export const $messageBox = useMessageBox()
