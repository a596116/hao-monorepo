<template>
  <v-container fluid class="pa-6">
    <v-card flat class="rounded-lg">
      <v-tabs v-model="activeTab" bg-color="transparent" color="grey-darken-4" class="border-b">
        <v-tab value="kpi" class="px-6 text-none font-weight-medium">
          {{ t("kpiOverview.tabs.kpi") }}
        </v-tab>
        <v-tab value="os-data" class="px-6 text-none font-weight-medium">
          {{ t("kpiOverview.tabs.osData") }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Tab 1: KPI 三層結構表 -->
        <v-window-item value="kpi">
          <v-card-text class="pa-8">
            <div class="mb-6 d-flex justify-space-between align-center">
              <div class="section-title">{{ t("kpiOverview.kpi.title") }}</div>
              <v-btn variant="outlined" size="small" color="grey-darken-2" class="text-none" @click="toggleAllExpand">
                <v-icon :icon="allExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="mr-1" size="small"></v-icon>
                {{ allExpanded ? t("kpiOverview.kpi.collapseAll") : t("kpiOverview.kpi.expandAll") }}
              </v-btn>
            </div>

            <v-card variant="outlined" class="overflow-hidden rounded-lg">
              <v-data-table
                :headers="kpiHeaders"
                :items="kpiData"
                item-value="id"
                class="elevation-0"
                density="comfortable"
                hide-default-footer
              >
                <template #item="{ item }">
                  <tr :class="getKpiRowClass(item.level)">
                    <td :style="getPaddingStyle(item.level)">
                      <div class="d-flex align-center">
                        <v-icon
                          v-if="item.level < 3"
                          :icon="item.expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                          size="small"
                          class="mr-2"
                          @click="toggleExpand(item.id)"
                        ></v-icon>
                        <span :class="{ 'font-weight-bold': item.level === 1 }">
                          {{ item.name }}
                        </span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span :class="getValueClass(item.level)">{{ formatNumber(item.target) }}</span>
                    </td>
                    <td class="text-center">
                      <span :class="getValueClass(item.level)">{{ formatNumber(item.actual) }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip
                        :color="getAchievementColor(item.achievement)"
                        variant="flat"
                        size="small"
                        class="font-weight-medium"
                      >
                        {{ item.achievement }}%
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-icon :icon="getTrendIcon(item.trend)" :color="getTrendColor(item.trend)" size="small"></v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-window-item>

        <!-- Tab 2: OS 數據與總覽 -->
        <v-window-item value="os-data">
          <v-card-text class="pa-8">
            <!-- 上方區域：OS 使用者數據表 + 圖表 -->
            <div class="mb-6 section-title">{{ t("kpiOverview.osData.title") }}</div>

            <v-row class="mb-8">
              <!-- 左側：數據表 -->
              <v-col cols="12" md="5">
                <v-card variant="outlined" class="rounded-lg h-100">
                  <v-card-text class="pa-6">
                    <div class="mb-4 subsection-title">{{ t("kpiOverview.osData.tableTitle") }}</div>
                    <v-table density="comfortable" class="minimal-table">
                      <thead>
                        <tr>
                          <th class="text-left font-weight-bold">{{ t("kpiOverview.osData.headers.platform") }}</th>
                          <th class="text-center font-weight-bold">M1</th>
                          <th class="text-center font-weight-bold">M2</th>
                          <th class="text-center font-weight-bold">M3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in osData" :key="row.key" :class="{ 'total-row': row.key === 'total' }">
                          <td>
                            <div class="d-flex align-center">
                              <v-icon
                                :icon="getOsIcon(row.key)"
                                size="small"
                                class="mr-2"
                                :color="row.key === 'total' ? 'grey-darken-2' : 'grey'"
                              ></v-icon>
                              <span :class="{ 'font-weight-bold': row.key === 'total' }">{{ row.label }}</span>
                            </div>
                          </td>
                          <td class="text-center">{{ formatNumber(row.M1) }}</td>
                          <td class="text-center">{{ formatNumber(row.M2) }}</td>
                          <td class="text-center">{{ formatNumber(row.M3) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 右側：圖表 -->
              <v-col cols="12" md="7">
                <v-card variant="outlined" class="rounded-lg h-100">
                  <v-card-text class="pa-6">
                    <div class="mb-4 subsection-title">{{ t("kpiOverview.osData.chartTitle") }}</div>
                    <v-chart :option="osChartOption" :style="{ height: '380px' }" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 下方區域：總覽表格 -->
            <div class="mb-6 section-title">{{ t("kpiOverview.osData.summaryTitle") }}</div>

            <v-card variant="outlined" class="rounded-lg">
              <v-card-text class="pa-6">
                <v-data-table
                  :headers="summaryHeaders"
                  :items="summaryData"
                  :items-per-page="10"
                  hide-default-footer
                  density="comfortable"
                  class="elevation-0"
                >
                  <template #item.status="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      variant="tonal"
                      size="small"
                      class="font-weight-medium"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>

                  <template #item.change="{ item }">
                    <div class="justify-center d-flex align-center">
                      <v-icon
                        :icon="item.change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                        :color="item.change >= 0 ? 'success' : 'error'"
                        size="small"
                        class="mr-1"
                      ></v-icon>
                      <span :class="item.change >= 0 ? 'text-success' : 'text-error'">
                        {{ Math.abs(item.change) }}%
                      </span>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"
import { useI18n } from "vue-i18n"
import type { DataTableHeader } from "vuetify"
import type { ECBasicOption } from "echarts/types/dist/shared"

// 註冊 ECharts 組件
use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const { t } = useI18n()

// Tab 狀態
const activeTab = ref("kpi")

// ========== KPI 三層結構數據 ==========
const allExpanded = ref(true)
interface KpiItem {
  id: number
  parentId: number | null
  level: number
  name: string
  target: number
  actual: number
  achievement: number
  trend: "up" | "down" | "stable"
  expanded?: boolean
}

const kpiRawData = ref<KpiItem[]>([
  // Level 1
  {
    id: 1,
    parentId: null,
    level: 1,
    name: "營收指標",
    target: 10000,
    actual: 10500,
    achievement: 105,
    trend: "up",
    expanded: true
  },
  {
    id: 2,
    parentId: null,
    level: 1,
    name: "用戶指標",
    target: 50000,
    actual: 48000,
    achievement: 96,
    trend: "down",
    expanded: true
  },
  {
    id: 3,
    parentId: null,
    level: 1,
    name: "運營效率",
    target: 1000,
    actual: 1050,
    achievement: 105,
    trend: "up",
    expanded: true
  },

  // Level 2 - 營收指標子項
  {
    id: 11,
    parentId: 1,
    level: 2,
    name: "產品銷售",
    target: 6000,
    actual: 6300,
    achievement: 105,
    trend: "up",
    expanded: true
  },
  {
    id: 12,
    parentId: 1,
    level: 2,
    name: "服務收入",
    target: 4000,
    actual: 4200,
    achievement: 105,
    trend: "up",
    expanded: false
  },

  // Level 2 - 用戶指標子項
  {
    id: 21,
    parentId: 2,
    level: 2,
    name: "新增用戶",
    target: 20000,
    actual: 18000,
    achievement: 90,
    trend: "down",
    expanded: true
  },
  {
    id: 22,
    parentId: 2,
    level: 2,
    name: "活躍用戶",
    target: 30000,
    actual: 30000,
    achievement: 100,
    trend: "stable",
    expanded: false
  },

  // Level 2 - 運營效率子項
  {
    id: 31,
    parentId: 3,
    level: 2,
    name: "訂單處理",
    target: 500,
    actual: 530,
    achievement: 106,
    trend: "up",
    expanded: true
  },
  {
    id: 32,
    parentId: 3,
    level: 2,
    name: "客戶服務",
    target: 500,
    actual: 520,
    achievement: 104,
    trend: "up",
    expanded: false
  },

  // Level 3 - 產品銷售子項
  { id: 111, parentId: 11, level: 3, name: "硬體產品", target: 3500, actual: 3600, achievement: 103, trend: "up" },
  { id: 112, parentId: 11, level: 3, name: "軟體授權", target: 2500, actual: 2700, achievement: 108, trend: "up" },

  // Level 3 - 新增用戶子項
  { id: 211, parentId: 21, level: 3, name: "行動端註冊", target: 12000, actual: 10800, achievement: 90, trend: "down" },
  { id: 212, parentId: 21, level: 3, name: "網頁端註冊", target: 8000, actual: 7200, achievement: 90, trend: "down" },

  // Level 3 - 訂單處理子項
  { id: 311, parentId: 31, level: 3, name: "自動化處理", target: 350, actual: 380, achievement: 109, trend: "up" },
  { id: 312, parentId: 31, level: 3, name: "人工處理", target: 150, actual: 150, achievement: 100, trend: "stable" }
])

const kpiHeaders = computed<DataTableHeader[]>(() => [
  { title: t("kpiOverview.kpi.headers.indicator"), key: "name", sortable: false, width: "40%" },
  { title: t("kpiOverview.kpi.headers.target"), key: "target", sortable: false, align: "center" },
  { title: t("kpiOverview.kpi.headers.actual"), key: "actual", sortable: false, align: "center" },
  { title: t("kpiOverview.kpi.headers.achievement"), key: "achievement", sortable: false, align: "center" },
  { title: t("kpiOverview.kpi.headers.trend"), key: "trend", sortable: false, align: "center" }
])

const kpiData = computed(() => {
  const result: KpiItem[] = []

  const addItems = (parentId: number | null, level: number) => {
    const items = kpiRawData.value.filter(item => item.parentId === parentId && item.level === level)
    items.forEach(item => {
      result.push(item)
      if (item.expanded && level < 3) {
        addItems(item.id, level + 1)
      }
    })
  }

  addItems(null, 1)
  return result
})

const toggleExpand = (id: number) => {
  const item = kpiRawData.value.find(i => i.id === id)
  if (item) {
    item.expanded = !item.expanded
  }
}

const toggleAllExpand = () => {
  const newExpandedState = !allExpanded.value
  allExpanded.value = newExpandedState

  // 更新所有可展開的項目（level 1 和 2）
  kpiRawData.value.forEach(item => {
    if (item.level < 3) {
      item.expanded = newExpandedState
    }
  })
}

const getKpiRowClass = (level: number) => {
  return `level-${level}-row`
}

const getPaddingStyle = (level: number) => {
  return { paddingLeft: `${level * 20}px` }
}

const getValueClass = (level: number) => {
  return level === 1 ? "font-weight-bold" : ""
}

const getAchievementColor = (achievement: number) => {
  if (achievement >= 100) return "grey-darken-2"
  if (achievement >= 90) return "grey"
  return "grey-lighten-1"
}

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  const icons = {
    up: "mdi-trending-up",
    down: "mdi-trending-down",
    stable: "mdi-minus"
  }
  return icons[trend]
}

const getTrendColor = (trend: "up" | "down" | "stable") => {
  const colors = {
    up: "grey-darken-2",
    down: "grey",
    stable: "grey"
  }
  return colors[trend]
}

// ========== OS 使用者數據 ==========
interface OsDataItem {
  key: string
  label: string
  M1: number
  M2: number
  M3: number
}

const osData = ref<OsDataItem[]>([
  { key: "windows", label: "Windows", M1: 1250, M2: 1380, M3: 1420 },
  { key: "macos", label: "macOS", M1: 890, M2: 920, M3: 980 },
  { key: "linux", label: "Linux", M1: 340, M2: 360, M3: 380 },
  { key: "ios", label: "iOS", M1: 2100, M2: 2280, M3: 2350 },
  { key: "android", label: "Android", M1: 3200, M2: 3450, M3: 3580 },
  { key: "total", label: "總計", M1: 7780, M2: 8390, M3: 8710 }
])

const getOsIcon = (osKey: string) => {
  const icons: Record<string, string> = {
    windows: "mdi-microsoft-windows",
    linux: "mdi-linux",
    macos: "mdi-apple",
    ios: "mdi-apple-ios",
    android: "mdi-android",
    total: "mdi-sigma"
  }
  return icons[osKey] || "mdi-help-circle"
}

// OS 圖表配置
const osChartOption = computed<ECBasicOption>(() => {
  const dataWithoutTotal = osData.value.filter(d => d.key !== "total")

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["M1", "M2", "M3"],
      bottom: 0
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: dataWithoutTotal.map(d => d.label),
      axisLabel: {
        color: "#616161"
      },
      axisLine: {
        lineStyle: {
          color: "#e0e0e0"
        }
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#616161"
      },
      splitLine: {
        lineStyle: {
          color: "#f5f5f5"
        }
      }
    },
    series: [
      {
        name: "M1",
        type: "line",
        smooth: true,
        data: dataWithoutTotal.map(d => d.M1),
        itemStyle: { color: "#424242" },
        lineStyle: { width: 2 }
      },
      {
        name: "M2",
        type: "line",
        smooth: true,
        data: dataWithoutTotal.map(d => d.M2),
        itemStyle: { color: "#757575" },
        lineStyle: { width: 2 }
      },
      {
        name: "M3",
        type: "line",
        smooth: true,
        data: dataWithoutTotal.map(d => d.M3),
        itemStyle: { color: "#9e9e9e" },
        lineStyle: { width: 2 }
      }
    ]
  }
})

// ========== 總覽表格數據 ==========
interface SummaryItem {
  platform: string
  category: string
  users: number
  sessions: number
  avgDuration: string
  status: string
  change: number
}

const summaryData = ref<SummaryItem[]>([
  {
    platform: "Windows 桌面版",
    category: "桌面平台",
    users: 1420,
    sessions: 4260,
    avgDuration: "28分鐘",
    status: "良好",
    change: 13.6
  },
  {
    platform: "macOS 桌面版",
    category: "桌面平台",
    users: 980,
    sessions: 3140,
    avgDuration: "32分鐘",
    status: "優秀",
    change: 10.1
  },
  {
    platform: "Linux 桌面版",
    category: "桌面平台",
    users: 380,
    sessions: 1140,
    avgDuration: "35分鐘",
    status: "良好",
    change: 11.8
  },
  {
    platform: "iOS 行動版",
    category: "行動平台",
    users: 2350,
    sessions: 7050,
    avgDuration: "18分鐘",
    status: "良好",
    change: 11.9
  },
  {
    platform: "Android 行動版",
    category: "行動平台",
    users: 3580,
    sessions: 10740,
    avgDuration: "16分鐘",
    status: "良好",
    change: 11.9
  },
  {
    platform: "Web 應用",
    category: "網頁平台",
    users: 1560,
    sessions: 4680,
    avgDuration: "22分鐘",
    status: "正常",
    change: -3.2
  },
  {
    platform: "Tablet",
    category: "平板平台",
    users: 680,
    sessions: 2040,
    avgDuration: "25分鐘",
    status: "正常",
    change: 5.4
  }
])

const summaryHeaders = computed<DataTableHeader[]>(() => [
  { title: t("kpiOverview.osData.summaryHeaders.platform"), key: "platform", sortable: true },
  { title: t("kpiOverview.osData.summaryHeaders.category"), key: "category", sortable: true },
  { title: t("kpiOverview.osData.summaryHeaders.users"), key: "users", sortable: true, align: "center" },
  { title: t("kpiOverview.osData.summaryHeaders.sessions"), key: "sessions", sortable: true, align: "center" },
  { title: t("kpiOverview.osData.summaryHeaders.avgDuration"), key: "avgDuration", sortable: true, align: "center" },
  { title: t("kpiOverview.osData.summaryHeaders.status"), key: "status", sortable: true, align: "center" },
  { title: t("kpiOverview.osData.summaryHeaders.change"), key: "change", sortable: true, align: "center" }
])

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    優秀: "grey-darken-3",
    良好: "grey-darken-1",
    正常: "grey"
  }
  return colorMap[status] || "grey"
}

// ========== 工具函數 ==========
const formatNumber = (value: number | undefined) => {
  if (value === undefined) return "-"
  return value.toLocaleString()
}
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212121;
  letter-spacing: -0.01em;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #424242;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

/* KPI 表格樣式 */
:deep(.level-1-row) {
  background-color: #e3f2fd;
  border-top: 2px solid #90caf9;
  border-bottom: 1px solid #90caf9;
  font-weight: 500;
}

:deep(.level-1-row:hover) {
  background-color: #bbdefb !important;
}

:deep(.level-2-row) {
  background-color: #fff3e0;
  border-bottom: 1px solid #ffcc80;
}

:deep(.level-2-row:hover) {
  background-color: #ffe0b2 !important;
}

:deep(.level-3-row) {
  background-color: #f1f8e9;
  color: #616161;
  font-size: 0.9rem;
  border-bottom: 1px solid #c5e1a5;
}

:deep(.level-3-row:hover) {
  background-color: #dcedc8 !important;
}

/* 最小化表格樣式 */
.minimal-table {
  border: none !important;
}

.minimal-table :deep(thead tr) {
  background-color: #fafafa;
}

.minimal-table :deep(th) {
  color: #424242 !important;
  font-size: 0.875rem;
  padding: 12px 16px !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

.minimal-table :deep(td) {
  padding: 12px 16px !important;
  border-bottom: 1px solid #f5f5f5 !important;
  color: #212121;
}

.minimal-table :deep(.total-row) {
  background-color: #fafafa;
  border-top: 2px solid #e0e0e0;
  font-weight: 600;
}

/* 數據表格通用樣式 */
:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-data-table th) {
  font-weight: 600;
  color: #424242 !important;
  background-color: #fafafa !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.v-data-table td) {
  color: #212121;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: #fafafa !important;
}

/* Card 樣式 */
:deep(.v-card) {
  box-shadow: none;
  border-color: #e0e0e0;
}

/* Tab 樣式 */
:deep(.v-tab) {
  text-transform: none;
  letter-spacing: 0;
}

:deep(.v-tab--selected) {
  color: #212121 !important;
}

/* Chip 樣式調整 */
:deep(.v-chip) {
  font-size: 0.8125rem;
}
</style>
