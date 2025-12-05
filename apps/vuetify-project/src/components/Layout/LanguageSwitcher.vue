<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-translate" rounded="lg"> </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="lang in languages"
        :key="lang.value"
        :active="currentLocale === lang.value"
        @click="changeLanguage(lang.value)"
      >
        <v-list-item-title>{{ lang.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useLocale } from "vuetify"
import { setLocale, getVuetifyLocale, type LocaleType } from "@/plugins/i18n"
import getPageTitle from "@/utils/getPageTitle"

const { locale, t } = useI18n()
const route = useRoute()
const vuetifyLocale = useLocale()

const languages = [
  { label: "繁體中文", value: "zh-TW" as LocaleType },
  { label: "English", value: "en-US" as LocaleType }
]

const currentLocale = computed(() => locale.value as LocaleType)

const currentLanguageName = computed(() => {
  const lang = languages.find(l => l.value === currentLocale.value)
  return lang?.label || "繁體中文"
})

function changeLanguage(newLocale: LocaleType) {
  // 切換 vue-i18n 語言
  setLocale(newLocale)
  // 切換 Vuetify 語言
  vuetifyLocale.current.value = getVuetifyLocale(newLocale)

  document.title = getPageTitle(t(route.meta.i18nKey as string))
}
</script>
