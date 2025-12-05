<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5 pa-4">
            {{ t("charts.title") }}
          </v-card-title>
          <v-card-text>
            <!-- 長條圖 -->
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="mb-4" variant="outlined">
                  <v-card-title>{{ t("charts.barChart") }}</v-card-title>
                  <v-card-text>
                    <v-chart :option="barChartOption" :style="{ height: '400px' }" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 圓餅圖 -->
              <v-col cols="12" md="6">
                <v-card class="mb-4" variant="outlined">
                  <v-card-title>{{ t("charts.pieChart") }}</v-card-title>
                  <v-card-text>
                    <v-chart :option="pieChartOption" :style="{ height: '400px' }" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <!-- 折線圖 -->
              <v-col cols="12" md="6">
                <v-card class="mb-4" variant="outlined">
                  <v-card-title>{{ t("charts.lineChart") }}</v-card-title>
                  <v-card-text>
                    <v-chart :option="lineChartOption" :style="{ height: '400px' }" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 雷達圖 -->
              <v-col cols="12" md="6">
                <v-card class="mb-4" variant="outlined">
                  <v-card-title>{{ t("charts.radarChart") }}</v-card-title>
                  <v-card-text>
                    <v-chart :option="radarChartOption" :style="{ height: '400px' }" autoresize />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart, PieChart, LineChart, RadarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarComponent } from "echarts/components"
import VChart from "vue-echarts"
import { useI18n } from "vue-i18n"

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent
])

const { t } = useI18n()

// 長條圖配置
const barChartOption = ref({
  title: {
    text: "月度銷售數據",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "銷售額",
      data: [120, 200, 150, 80, 70, 110],
      type: "bar",
      itemStyle: {
        color: "#1976d2"
      }
    }
  ]
})

// 圓餅圖配置
const pieChartOption = ref({
  title: {
    text: "產品類別佔比",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  series: [
    {
      name: "銷售量",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "電子產品" },
        { value: 735, name: "家電產品" },
        { value: 580, name: "運動休閒" },
        { value: 484, name: "服飾配件" },
        { value: 300, name: "食品飲料" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
})

// 折線圖配置
const lineChartOption = ref({
  title: {
    text: "用戶增長趨勢",
    left: "center"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["新用戶", "活躍用戶"],
    bottom: 10
  },
  xAxis: {
    type: "category",
    data: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "新用戶",
      type: "line",
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      itemStyle: {
        color: "#1976d2"
      }
    },
    {
      name: "活躍用戶",
      type: "line",
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true,
      itemStyle: {
        color: "#4caf50"
      }
    }
  ]
})

// 雷達圖配置
const radarChartOption = ref({
  title: {
    text: "產品性能分析",
    left: "center"
  },
  tooltip: {},
  legend: {
    data: ["產品 A", "產品 B"],
    bottom: 10
  },
  radar: {
    indicator: [
      { name: "效能", max: 100 },
      { name: "續航力", max: 100 },
      { name: "外觀設計", max: 100 },
      { name: "價格", max: 100 },
      { name: "用戶體驗", max: 100 },
      { name: "售後服務", max: 100 }
    ]
  },
  series: [
    {
      name: "產品比較",
      type: "radar",
      data: [
        {
          value: [90, 70, 85, 60, 80, 75],
          name: "產品 A",
          itemStyle: {
            color: "#1976d2"
          }
        },
        {
          value: [70, 85, 75, 80, 70, 85],
          name: "產品 B",
          itemStyle: {
            color: "#4caf50"
          }
        }
      ]
    }
  ]
})
</script>

<style scoped>
.v-card {
  height: 100%;
}
</style>
