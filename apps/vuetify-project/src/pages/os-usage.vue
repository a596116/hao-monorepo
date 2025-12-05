<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        <div class="d-flex justify-space-between align-center w-100">
          <span>{{ t("osUsage.title") }}</span>
          <v-chip color="primary" variant="outlined">
            {{ meta.period }}
          </v-chip>
        </div>
      </v-card-title>

      <v-card-subtitle class="px-4 pb-2">
        {{ t("osUsage.subtitle") }} - {{ t("osUsage.unit") }}: {{ meta.unit }}
      </v-card-subtitle>

      <v-card-text>
        <!-- 資料表格 -->
        <v-data-table
          :headers="computedHeaders"
          :items="tableItems"
          hide-default-footer
          class="elevation-1"
          density="comfortable"
        >
          <!-- 自定義 OS 欄位 -->
          <template #item.label="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :icon="getOsIcon(item.key)"
                :color="item.key === 'total' ? 'primary' : ''"
                class="mr-2"
                size="small"
              ></v-icon>
              <span :class="{ 'font-weight-bold': item.key === 'total' }">
                {{ item.label }}
              </span>
            </div>
          </template>

          <!-- 自定義數據單元格 -->
          <template v-for="col in columns" :key="col.key" #[`item.${col.key}`]="{ item }">
            <v-chip
              :color="getCellColor(item.key, Number(item[col.key as keyof typeof item]))"
              variant="flat"
              size="small"
              class="font-weight-medium"
            >
              {{ formatNumber(Number(item[col.key as keyof typeof item])) }}
            </v-chip>
          </template>
        </v-data-table>

        <!-- 統計摘要 -->
        <v-row class="mt-6">
          <v-col v-for="stat in statistics" :key="stat.label" cols="12" md="3">
            <v-card variant="tonal" :color="stat.color">
              <v-card-text>
                <div class="mb-1 text-overline">{{ stat.label }}</div>
                <div class="text-h5 font-weight-bold">{{ formatNumber(stat.value) }}</div>
                <div class="mt-1 text-caption">{{ stat.description }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 圖表區域 -->
        <v-row class="mt-6">
          <!-- 月度趨勢折線圖 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-title>{{ t("osUsage.trendChart") }}</v-card-title>
              <v-card-text>
                <v-chart :option="lineChartOption" :style="{ height: '400px' }" autoresize />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 操作系統分布柱狀圖 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-title>{{ t("osUsage.distributionChart") }}</v-card-title>
              <v-card-text>
                <v-chart :option="barChartOption" :style="{ height: '400px' }" autoresize />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart, BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"
import { useI18n } from "vue-i18n"
import type { DataTableHeader } from "vuetify"
import type { ECBasicOption } from "echarts/types/dist/shared"

// 註冊 ECharts 組件
use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const { t } = useI18n()

// 資料定義
interface Row {
  key: string
  label: string
}

interface Column {
  key: string
  label: string
}

interface DataRow {
  rowKey: string
  [key: string]: string | number
}

interface Meta {
  unit: string
  period: string
  dataSource: string
}

// 原始數據
const rows: Row[] = [
  { key: "windows", label: "Windows" },
  { key: "linux", label: "Linux" },
  { key: "macos", label: "MacOS" },
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
  { key: "web", label: "Web" },
  { key: "other", label: "Other" },
  { key: "total", label: "Total" }
]

const columns: Column[] = [
  { key: "M1", label: "M1" },
  { key: "M2", label: "M2" },
  { key: "M3", label: "M3" }
]

const data: DataRow[] = [
  { rowKey: "windows", M1: 120, M2: 180, M3: 90 },
  { rowKey: "linux", M1: 60, M2: 70, M3: 50 },
  { rowKey: "macos", M1: 90, M2: 95, M3: 100 },
  { rowKey: "ios", M1: 200, M2: 210, M3: 190 },
  { rowKey: "android", M1: 310, M2: 330, M3: 320 },
  { rowKey: "web", M1: 150, M2: 140, M3: 160 },
  { rowKey: "other", M1: 20, M2: 10, M3: 15 },
  { rowKey: "total", M1: 950, M2: 1035, M3: 925 }
]

const meta: Meta = {
  unit: "使用次數",
  period: "2025 Q1",
  dataSource: "os_usage"
}

// 組合表格數據
const tableItems = computed(() => {
  return rows.map(row => {
    const dataRow = data.find(d => d.rowKey === row.key)
    return {
      key: row.key,
      label: row.label,
      ...dataRow
    }
  })
})

// 表格標題
const computedHeaders = computed<DataTableHeader[]>(() => [
  {
    title: t("osUsage.headers.os"),
    key: "label",
    sortable: false,
    width: "150px"
  },
  ...columns.map(col => ({
    title: col.label,
    key: col.key,
    sortable: true,
    align: "center" as const
  }))
])

// OS 圖示
const getOsIcon = (osKey: string) => {
  const icons: Record<string, string> = {
    windows: "mdi-microsoft-windows",
    linux: "mdi-linux",
    macos: "mdi-apple",
    ios: "mdi-apple-ios",
    android: "mdi-android",
    web: "mdi-web",
    other: "mdi-devices",
    total: "mdi-sigma"
  }
  return icons[osKey] || "mdi-help-circle"
}

// 單元格顏色
const getCellColor = (osKey: string, value: number) => {
  if (osKey === "total") return "primary"

  if (value >= 300) return "success"
  if (value >= 200) return "info"
  if (value >= 100) return "warning"
  return "default"
}

// 格式化數字
const formatNumber = (value: number | undefined) => {
  if (value === undefined) return "-"
  return value.toLocaleString()
}

// 統計摘要
const statistics = computed(() => {
  const totalUsers = (data.find(d => d.rowKey === "total")?.M3 as number) || 0
  const mobileUsers =
    ((data.find(d => d.rowKey === "ios")?.M3 as number) || 0) +
    ((data.find(d => d.rowKey === "android")?.M3 as number) || 0)
  const desktopUsers =
    ((data.find(d => d.rowKey === "windows")?.M3 as number) || 0) +
    ((data.find(d => d.rowKey === "linux")?.M3 as number) || 0) +
    ((data.find(d => d.rowKey === "macos")?.M3 as number) || 0)
  const webUsers = (data.find(d => d.rowKey === "web")?.M3 as number) || 0

  return [
    {
      label: t("osUsage.stats.total"),
      value: totalUsers,
      description: t("osUsage.stats.totalDesc"),
      color: "primary"
    },
    {
      label: t("osUsage.stats.mobile"),
      value: mobileUsers,
      description: `${((mobileUsers / totalUsers) * 100).toFixed(1)}% ${t("osUsage.stats.ofTotal")}`,
      color: "success"
    },
    {
      label: t("osUsage.stats.desktop"),
      value: desktopUsers,
      description: `${((desktopUsers / totalUsers) * 100).toFixed(1)}% ${t("osUsage.stats.ofTotal")}`,
      color: "info"
    },
    {
      label: t("osUsage.stats.web"),
      value: webUsers,
      description: `${((webUsers / totalUsers) * 100).toFixed(1)}% ${t("osUsage.stats.ofTotal")}`,
      color: "warning"
    }
  ]
})

// 折線圖配置
const lineChartOption = computed<ECBasicOption>(() => {
  // 排除 total 行
  const dataWithoutTotal = data.filter(d => d.rowKey !== "total")

  return {
    title: {
      text: t("osUsage.chartTitle"),
      left: "center",
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    legend: {
      data: rows.filter(r => r.key !== "total").map(r => r.label),
      bottom: 10,
      type: "scroll"
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: columns.map(col => col.label),
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      name: meta.unit
    },
    series: dataWithoutTotal.map(dataRow => {
      const row = rows.find(r => r.key === dataRow.rowKey)
      return {
        name: row?.label || "",
        type: "line",
        data: columns.map(col => dataRow[col.key]),
        smooth: true,
        emphasis: {
          focus: "series"
        }
      }
    })
  }
})

// 柱狀圖配置 - 顯示各操作系統在不同月份的分布
const barChartOption = computed<ECBasicOption>(() => {
  // 排除 total 行
  const dataWithoutTotal = data.filter(d => d.rowKey !== "total")

  return {
    title: {
      text: t("osUsage.barChartTitle"),
      left: "center",
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: columns.map(col => col.label),
      bottom: 10
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: rows.filter(r => r.key !== "total").map(r => r.label),
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    },
    yAxis: {
      type: "value",
      name: meta.unit
    },
    series: columns.map(col => {
      return {
        name: col.label,
        type: "bar",
        data: dataWithoutTotal.map(dataRow => dataRow[col.key]),
        emphasis: {
          focus: "series"
        }
        // stack: 'total'
      }
    })
  }
})
</script>

<style scoped>
:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-data-table th) {
  font-weight: 600;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.v-data-table tbody tr:last-child) {
  border-top: 2px solid rgba(var(--v-theme-primary), 0.3);
  background-color: rgba(var(--v-theme-primary), 0.03);
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
