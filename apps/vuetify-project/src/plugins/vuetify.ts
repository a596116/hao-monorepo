/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { createVuetify } from "vuetify"

// Vuetify 語言包
import { zhHant, en } from "vuetify/locale"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light"
  },
  locale: {
    locale: "zhHant",
    fallback: "zhHant",
    messages: { zhHant, en }
  }
})

export default vuetify
