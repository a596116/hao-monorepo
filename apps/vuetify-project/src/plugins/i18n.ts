/**
 * plugins/i18n.ts
 *
 * Vue I18n configuration
 */

import { createI18n } from "vue-i18n"
import { useLocale } from "vuetify"
import zhTW from "@/locales/zh.json"
import enUS from "@/locales/en.json"

// 語言類型定義
export type LocaleType = "zh-TW" | "en-US"

// Vuetify 語言映射
const vuetifyLocaleMap: Record<LocaleType, string> = {
  "zh-TW": "zhHant",
  "en-US": "en"
}

// 從 localStorage 獲取語言設定，如果沒有則使用預設語言（繁體中文）
const getStoredLocale = (): LocaleType => {
  const stored = localStorage.getItem("locale")
  if (stored === "zh-TW" || stored === "en-US") {
    return stored
  }
  return "zh-TW"
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getStoredLocale(), // 預設語言
  fallbackLocale: "zh-TW", // 後備語言
  messages: {
    "zh-TW": zhTW,
    "en-US": enUS
  },
  globalInjection: true // 全局注入 $t 函數,
})

// 導出切換語言的工具函數
export function setLocale(locale: LocaleType) {
  // 切換 vue-i18n 語言
  i18n.global.locale.value = locale
  localStorage.setItem("locale", locale)
  // document.title = getPageTitle(i18n.global.t(useRoute().meta.i18nKey as string))

  // 嘗試切換 Vuetify 語言（如果在 Vue 組件上下文中）
  try {
    const vuetifyLocale = useLocale()
    vuetifyLocale.current.value = vuetifyLocaleMap[locale]
  } catch (e) {
    // 如果不在組件上下文中，忽略錯誤
    console.debug("Vuetify locale will be updated when component mounts", e)
  }
}

export function getLocale(): LocaleType {
  return i18n.global.locale.value as LocaleType
}

// 導出 Vuetify 語言映射，供組件使用
export function getVuetifyLocale(locale: LocaleType): string {
  return vuetifyLocaleMap[locale]
}

export default i18n
