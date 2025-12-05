import { createApp, h } from "vue"
import { createVuetify } from "vuetify"
import Notification from "@/components/Notification.vue"
import type { NotificationProps } from "@/components/Notification.vue"

// Notification 實例管理
interface NotificationInstance {
  app: any
  container: HTMLElement
  position: string
  height: number
  uniqueId?: string
  close: () => void
}

const notificationInstances: NotificationInstance[] = []
const NOTIFICATION_HEIGHT = 90 // 通知的高度
const NOTIFICATION_GAP = 16 // 通知之間的間距

export interface NotificationOptions {
  title?: string
  message: string
  type?: "success" | "warning" | "info" | "error"
  duration?: number
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  showClose?: boolean
  onClose?: () => void
  uniqueId?: string // 唯一標識符，如果設置了，同一 uniqueId 只會保留一個實例
}

// 更新指定位置所有通知的偏移量
const updateNotificationPositions = (position: string) => {
  const samePositionInstances = notificationInstances.filter(inst => inst.position === position)

  samePositionInstances.forEach((inst, index) => {
    const offset = 20 + index * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP)
    // 更新 DOM 中的位置
    const card = inst.container.querySelector(".notification-card") as HTMLElement
    if (card) {
      if (position.startsWith("top")) {
        card.style.top = `${offset}px`
      } else {
        card.style.bottom = `${offset}px`
      }
    }
  })
}

export const useNotification = () => {
  const show = (options: NotificationOptions | string) => {
    const props: NotificationProps = typeof options === "string" ? { message: options } : options

    const position = props.position || "top-right"
    const uniqueId = props.uniqueId

    // 如果設置了 uniqueId，先關閉同一 uniqueId 的通知
    if (uniqueId) {
      const existingInstance = notificationInstances.find(
        inst => inst.uniqueId === uniqueId && inst.position === position
      )
      if (existingInstance) {
        existingInstance.close()
      }
    }

    // 創建容器
    const container = document.createElement("div")
    document.body.appendChild(container)

    // 創建 Vuetify 實例
    const vuetify = createVuetify()

    // 計算偏移量
    const samePositionInstances = notificationInstances.filter(inst => inst.position === position)
    const offset = 20 + samePositionInstances.length * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP)

    // 創建 Notification 實例
    const app = createApp({
      render() {
        return h(Notification, {
          ...props,
          offset,
          onClose: () => {
            if (props.onClose) {
              props.onClose()
            }
            // 從實例列表中移除
            const index = notificationInstances.findIndex(inst => inst.app === app)
            if (index > -1) {
              notificationInstances.splice(index, 1)
              // 更新同位置其他通知的位置
              updateNotificationPositions(position)
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
    const instance: NotificationInstance = {
      app,
      container,
      position,
      height: NOTIFICATION_HEIGHT,
      uniqueId,
      close: () => {
        const index = notificationInstances.findIndex(inst => inst.app === app)
        if (index > -1) {
          notificationInstances.splice(index, 1)
          updateNotificationPositions(position)
        }
        if (app && container.parentNode) {
          app.unmount()
          document.body.removeChild(container)
        }
      }
    }
    notificationInstances.push(instance)

    return {
      close: instance.close
    }
  }

  const success = (options: string | Omit<NotificationOptions, "type">) => {
    const props =
      typeof options === "string"
        ? { message: options, type: "success" as const }
        : { ...options, type: "success" as const }
    return show(props)
  }

  const warning = (options: string | Omit<NotificationOptions, "type">) => {
    const props =
      typeof options === "string"
        ? { message: options, type: "warning" as const }
        : { ...options, type: "warning" as const }
    return show(props)
  }

  const info = (options: string | Omit<NotificationOptions, "type">) => {
    const props =
      typeof options === "string" ? { message: options, type: "info" as const } : { ...options, type: "info" as const }
    return show(props)
  }

  const error = (options: string | Omit<NotificationOptions, "type">) => {
    const props =
      typeof options === "string"
        ? { message: options, type: "error" as const }
        : { ...options, type: "error" as const }
    return show(props)
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
export const $notify = useNotification()
