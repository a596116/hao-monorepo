<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ t("chartTable.title") }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- 左邊：長條圖 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-title>{{ t("chartTable.chartTitle") }}</v-card-title>
              <v-card-text>
                <v-chart :option="barChartOption" :style="{ height: '500px' }" autoresize @click="onChartClick" />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 右邊：表格 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-title>{{ t("chartTable.tableTitle") }}</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="tableData"
                  :items-per-page="10"
                  hide-default-footer
                  class="elevation-1"
                  density="comfortable"
                >
                  <template #item="{ item }">
                    <tr :class="getRowClass(item)" style="cursor: pointer" @click="toggleSelection(item.id)">
                      <td>{{ item.name }}</td>
                      <td>{{ item.category }}</td>
                      <td>
                        <v-chip :color="getValueColor(item.value)" variant="flat" size="small">
                          {{ item.value }}
                        </v-chip>
                      </td>
                      <td>
                        <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                          {{ item.status }}
                        </v-chip>
                      </td>
                      <td>{{ item.description }}</td>
                    </tr>
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
import { computed, ref } from "vue"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"
import { useI18n } from "vue-i18n"
import type { DataTableHeader } from "vuetify"

// 註冊 ECharts 組件
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const { t } = useI18n()

// 表格資料
interface TableItem {
  id: number
  name: string
  category: string
  value: number
  status: string
  description: string
}

const tableData = ref<TableItem[]>([
  {
    id: 1,
    name: "智能手機",
    category: "電子產品",
    value: 245,
    status: "熱銷",
    description: "最新5G智能手機系列"
  },
  {
    id: 2,
    name: "筆記型電腦",
    category: "電子產品",
    value: 189,
    status: "正常",
    description: "商用與遊戲筆電"
  },
  {
    id: 3,
    name: "平板電腦",
    category: "電子產品",
    value: 156,
    status: "正常",
    description: "各尺寸平板電腦"
  },
  {
    id: 4,
    name: "智能手錶",
    category: "穿戴裝置",
    value: 198,
    status: "熱銷",
    description: "健康監測智能手錶"
  },
  {
    id: 5,
    name: "無線耳機",
    category: "音訊設備",
    value: 223,
    status: "熱銷",
    description: "降噪無線耳機"
  },
  {
    id: 6,
    name: "冰箱",
    category: "家電產品",
    value: 134,
    status: "正常",
    description: "節能智能冰箱"
  },
  {
    id: 7,
    name: "洗衣機",
    category: "家電產品",
    value: 112,
    status: "缺貨",
    description: "滾筒式洗衣機"
  },
  {
    id: 8,
    name: "空氣清淨機",
    category: "家電產品",
    value: 167,
    status: "正常",
    description: "HEPA過濾空氣清淨機"
  },
  {
    id: 9,
    name: "跑步機",
    category: "運動器材",
    value: 98,
    status: "缺貨",
    description: "家用電動跑步機"
  },
  {
    id: 10,
    name: "健身車",
    category: "運動器材",
    value: 145,
    status: "正常",
    description: "室內飛輪健身車"
  }
])

// 表格標題
const headers = computed<DataTableHeader[]>(() => [
  { title: t("chartTable.headers.name"), key: "name", sortable: true },
  { title: t("chartTable.headers.category"), key: "category", sortable: true },
  { title: t("chartTable.headers.value"), key: "value", sortable: true },
  { title: t("chartTable.headers.status"), key: "status", sortable: true },
  { title: t("chartTable.headers.description"), key: "description", sortable: false }
])

// 長條圖配置
const selectedItemId = ref<number | null>(null)

const getBaseBarColor = (value: number) => {
  if (value >= 200) return "#4caf50" // 綠色 - 高
  if (value >= 150) return "#2196f3" // 藍色 - 中高
  if (value >= 100) return "#ff9800" // 橙色 - 中
  return "#f44336" // 紅色 - 低
}

const barChartOption = computed(() => {
  const activeId = selectedItemId.value

  return {
    title: {
      text: t("chartTable.chartSubtitle"),
      left: "center",
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.seriesName}: ${data.value}`
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: tableData.value.map(item => item.name),
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 10
      }
    },
    yAxis: {
      type: "value",
      name: t("chartTable.yAxisLabel")
    },
    series: [
      {
        name: t("chartTable.seriesName"),
        type: "bar",
        data: tableData.value.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: activeId === null || item.id === activeId ? getBaseBarColor(item.value) : "#d6d6d6"
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
})

// 圖表點擊事件
const onChartClick = (params: any) => {
  if (params.componentType === "series") {
    const item = tableData.value[params.dataIndex]
    if (!item) return
    selectedItemId.value = item.id === selectedItemId.value ? null : item.id
  }
}

// 切換選取狀態
const toggleSelection = (id: number) => {
  selectedItemId.value = id === selectedItemId.value ? null : id
}

const getRowClass = (item: TableItem | undefined) => {
  if (!item) return ""
  if (selectedItemId.value === null) return ""
  return item.id === selectedItemId.value ? "selected-row" : "dimmed-row"
}

// 根據數值返回顏色
const getValueColor = (value: number) => {
  if (value >= 200) return "success"
  if (value >= 150) return "primary"
  if (value >= 100) return "warning"
  return "error"
}

// 根據狀態返回顏色
const getStatusColor = (status: string) => {
  switch (status) {
    case "熱銷":
      return "success"
    case "正常":
      return "primary"
    case "缺貨":
      return "error"
    default:
      return "default"
  }
}
</script>

<style scoped>
.v-card {
  height: 100%;
}

:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-data-table th) {
  font-weight: 600;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.v-data-table .selected-row) {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
  transition: background-color 0.2s ease;
}

:deep(.v-data-table .dimmed-row) {
  opacity: 0.4;
  transition: opacity 0.2s ease;
}
</style>
