<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ t("pivotTable.title") }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title>{{ t("pivotTable.subtitle") }}</v-card-title>
              <v-card-text>
                <!-- Pivot Table -->
                <div class="pivot-container">
                  <PivotTable
                    :data="pivotData"
                    :rows="['number']"
                    :cols="['KEY_NO']"
                    :vals="['number']"
                    aggregator-name="Count"
                    :renderer-name="'Bar Chart'"
                    :renderers="renderers"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 原始數據表格 -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title>{{ t("pivotTable.rawDataTitle") }}</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="pivotData"
                  :items-per-page="10"
                  class="elevation-1"
                  density="comfortable"
                >
                  <template #item.datetime="{ item }">
                    {{ formatDateTime(item.datetime) }}
                  </template>
                  <template #item.number="{ item }">
                    <v-chip color="primary" variant="flat" size="small">
                      {{ item.number }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, markRaw } from "vue"
import { useI18n } from "vue-i18n"
import { VuePivottableUi, Renderer } from "vue-pivottable"
import "vue-pivottable/dist/vue-pivottable.css"
import type { DataTableHeader } from "vuetify"
import PlotlyRenderer from "@vue-pivottable/plotly-renderer"
import EChartsBarChartRenderer from "@/components/EChartsBarChartRenderer.vue"
import EChartsBarChartRenderer2 from "@/components/EChartsBarChartRenderer2.vue"

const { t } = useI18n()

// 類型轉換以解決 vue-pivottable 的類型定義問題
const PivotTable = markRaw(VuePivottableUi as any)

// 資料介面
interface PivotDataItem {
  KEY_NO: string
  number: string
  remark: string
  datetime: string
}

// 產生示例資料（確保有重複的機號和編號）
const generateSampleData = (): PivotDataItem[] => {
  const remarks = ["正常", "異常", "待處理", "已完成", "進行中"]
  const dates = ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"]

  // 定義一些編號，讓它們會重複出現
  const keyNumbers = [
    "KEY0001",
    "KEY0002",
    "KEY0003",
    "KEY0004",
    "KEY0005",
    "KEY0006",
    "KEY0007",
    "KEY0008",
    "KEY0009",
    "KEY0010",
    "KEY0011",
    "KEY0012"
  ]

  // 定義一些機號，讓它們會重複出現
  const machineNumbers = ["M001", "M002", "M003", "M004", "M005", "M006", "M007", "M008", "M009", "M010"]

  const data: PivotDataItem[] = []

  for (let i = 1; i <= 50; i++) {
    data.push({
      KEY_NO: `KEY1234`,
      // KEY_NO: keyNumbers[Math.floor(Math.random() * keyNumbers.length)] || 'KEY0001',
      number: machineNumbers[Math.floor(Math.random() * machineNumbers.length)] || "M001",
      remark: remarks[Math.floor(Math.random() * remarks.length)] || "正常",
      datetime: dates[Math.floor(Math.random() * dates.length)] || dates[0]!
    })
  }

  return data
}

// Pivot Table 資料
const pivotData = ref<PivotDataItem[]>(generateSampleData())

// 表格標題
const headers = computed<DataTableHeader[]>(() => [
  { title: t("pivotTable.headers.keyNo"), key: "KEY_NO", sortable: true },
  { title: t("pivotTable.headers.number"), key: "number", sortable: true },
  { title: t("pivotTable.headers.remark"), key: "remark", sortable: true },
  { title: t("pivotTable.headers.datetime"), key: "datetime", sortable: true }
])

// 格式化日期時間
const formatDateTime = (datetime: string) => {
  return datetime
}

// 使用 markRaw 標記 renderers，避免組件被響應式化
const renderers = markRaw({
  ...PlotlyRenderer,
  ...Renderer,
  "Bar Chart": markRaw(EChartsBarChartRenderer)
})
</script>

<style scoped>
.pivot-container {
  width: 100%;
  overflow-x: auto;
}

:deep(.pvtUi) {
  color: inherit;
}

:deep(.pvtTable) {
  font-family: inherit;
  font-size: 0.875rem;
}

:deep(.pvtTable thead tr th),
:deep(.pvtTable tbody tr th) {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
}

:deep(.pvtTable tbody tr td) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  text-align: right;
}

:deep(.v-data-table th) {
  font-weight: 600;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
