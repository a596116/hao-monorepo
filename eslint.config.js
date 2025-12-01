import { defineConfig } from "eslint/config"
// import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginPrettier from "eslint-plugin-prettier"
import eslintPluginVue from "eslint-plugin-vue"
import globals from "globals"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript"

const ignores = ["**/dist/**", "**/node_modules/**", "/.*", "scripts/**", "**/*.d.ts"]

export default defineConfig(
  // 通用配置
  {
    ignores, // 忽略項
    extends: [
      // eslint.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier
    ], // 继承规则
    plugins: {
      prettier: eslintPluginPrettier
    },
    languageOptions: {
      ecmaVersion: "latest", // ecma語法支持版本
      sourceType: "module", // 模塊化類型
      parser: tseslint.parser // 解析器
    },
    rules: {
      // 自定義
      "no-var": "error" // 禁止使用var
    }
  },
  // 前端配置
  {
    ignores,
    files: [
      "apps/**/*.{ts,js,tsx,jsx,vue}",
      "apps/customer-portal/**/*.{ts,js,tsx,jsx,vue}",
      "packages/components/**/*.{ts,js,tsx,jsx,vue}"
    ],
    extends: [
      ...eslintPluginVue.configs["flat/recommended"],
      eslintConfigPrettier,
      defineConfigWithVueTs(vueTsConfigs.recommended)
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "vue/require-default-prop": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "vue/multi-word-component-names": "off",
      "vue/valid-v-slot": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "vue/require-prop-types": "off",
      "vue/no-required-prop-with-default": "off",
      "vue/no-v-html": "off"
    }
  }
)
