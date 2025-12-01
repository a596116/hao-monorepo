// 語言代碼類型（可擴展支持更多語言）
export type LanguageCode = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru'

// 語言配置
export interface LanguageConfig {
  code: LanguageCode
  label: string
  nativeLabel: string
}

// 語言配置映射
export const LANGUAGE_CONFIGS: Record<LanguageCode, LanguageConfig> = {
  en: { code: 'en', label: '英文(美國)', nativeLabel: 'English (US)' },
  zh: { code: 'zh', label: '中文(國語,繁體)', nativeLabel: '中文(繁體)' },
  ja: { code: 'ja', label: '日文', nativeLabel: '日本語' },
  ko: { code: 'ko', label: '韓文', nativeLabel: '한국어' },
  es: { code: 'es', label: '西班牙文', nativeLabel: 'Español' },
  fr: { code: 'fr', label: '法文', nativeLabel: 'Français' },
  de: { code: 'de', label: '德文', nativeLabel: 'Deutsch' },
  it: { code: 'it', label: '義大利文', nativeLabel: 'Italiano' },
  pt: { code: 'pt', label: '葡萄牙文', nativeLabel: 'Português' },
  ru: { code: 'ru', label: '俄文', nativeLabel: 'Русский' },
}

// 對話消息類型定義
export interface ConversationMessage {
  id: string
  sourceLanguage: LanguageCode // 原始語言
  sourceText: string // 原始文本
  targetLanguage?: LanguageCode // 目標語言（翻譯目標，可選）
  targetText?: string // 翻譯文本（可選）
  timestamp: number
  position: 'left' | 'right' | 'top' | 'bottom' // 在對話中的位置
}

