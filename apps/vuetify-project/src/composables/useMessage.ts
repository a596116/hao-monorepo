import { createApp, h } from "vue"
import { createVuetify } from "vuetify"
import Message from "@/components/Message.vue"
import type { MessageProps } from "@/components/Message.vue"

// Message 實例管理
interface MessageInstance {
  app: any
  container: HTMLElement
  height: number
  close: () => void
}

const messageInstances: MessageInstance[] = []
const MESSAGE_HEIGHT = 50 // Message 的高度
const MESSAGE_GAP = 12 // Message 之間的間距

export interface MessageOptions {
  message: string
  type?: "success" | "warning" | "info" | "error"
  duration?: number
  showClose?: boolean
  onClose?: () => void
}

// 更新所有 Message 的偏移量
const updateMessagePositions = () => {
  messageInstances.forEach((inst, index) => {
    const offset = index * (MESSAGE_HEIGHT + MESSAGE_GAP)
    // 更新 DOM 中的位置
    const wrapper = inst.container.querySelector(".message-wrapper") as HTMLElement
    if (wrapper) {
      wrapper.style.top = `${offset + 20}px`
    }
  })
}

export const useMessage = () => {
  const show = (options: MessageOptions | string) => {
    const props: MessageProps = typeof options === "string" ? { message: options } : options

    // 創建容器
    const container = document.createElement("div")
    document.body.appendChild(container)

    // 創建 Vuetify 實例
    const vuetify = createVuetify()

    // 計算偏移量
    const offset = messageInstances.length * (MESSAGE_HEIGHT + MESSAGE_GAP)

    // 創建 Message 實例
    const app = createApp({
      render() {
        return h(Message, {
          ...props,
          offset,
          onClose: () => {
            if (props.onClose) {
              props.onClose()
            }
            // 從實例列表中移除
            const index = messageInstances.findIndex(inst => inst.app === app)
            if (index > -1) {
              messageInstances.splice(index, 1)
              // 更新其他 Message 的位置
              updateMessagePositions()
            }
            // 延遲清理 DOM
            setTimeout(() => {
              if (app && container.parentNode) {
                app.unmount()
                document.body.removeChild(container)
              }
            }, 300)
          }
        })
      }
    })

    app.use(vuetify)
    app.mount(container)

    // 記錄實例
    const instance: MessageInstance = {
      app,
      container,
      height: MESSAGE_HEIGHT,
      close: () => {
        const index = messageInstances.findIndex(inst => inst.app === app)
        if (index > -1) {
          messageInstances.splice(index, 1)
          updateMessagePositions()
        }
        if (app && container.parentNode) {
          app.unmount()
          document.body.removeChild(container)
        }
      }
    }
    messageInstances.push(instance)

    return {
      close: instance.close
    }
  }

  const success = (message: string, options?: Omit<MessageOptions, "message" | "type">) => {
    return show({ message, type: "success", ...options })
  }

  const warning = (message: string, options?: Omit<MessageOptions, "message" | "type">) => {
    return show({ message, type: "warning", ...options })
  }

  const info = (message: string, options?: Omit<MessageOptions, "message" | "type">) => {
    return show({ message, type: "info", ...options })
  }

  const error = (message: string, options?: Omit<MessageOptions, "message" | "type">) => {
    return show({ message, type: "error", ...options })
  }

  return {
    show,
    success,
    warning,
    info,
    error
  }
}

// 全局方法
export const $message = useMessage()
