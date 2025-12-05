<template>
  <div class="echarts-bar-chart-container">
    <v-chart :option="chartOption" autoresize />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import VChart from "vue-echarts"
import { PivotUtilities } from "vue-pivottable"

// 註冊 ECharts 組件
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps({ ...PivotUtilities.defaultProps })

const chartOption = computed(() => {
  // 確保明確訪問 props 以觸發響應式更新
  const data = props.data
  const rows = props.rows
  const cols = props.cols
  const aggregatorName = props.aggregatorName || "Count"
  const vals = props.vals || []
  const valueFilter = props.valueFilter || {}

  const categories: string[] = []
  const values: number[] = []
  const groupedData = new Map<string, any[]>()

  // 收集所有要統計的屬性（rows + cols）
  const allAttributes: string[] = []
  if (rows && rows.length > 0) {
    allAttributes.push(...rows)
  }
  if (cols && cols.length > 0) {
    allAttributes.push(...cols)
  }

  // 應用篩選條件 - 深度訪問 valueFilter 的屬性以確保響應式追蹤
  const filteredData =
    data && Array.isArray(data)
      ? data.filter((item: any) => {
          // 檢查每個篩選條件
          for (const key in valueFilter) {
            const filterValues = valueFilter[key]
            if (filterValues && typeof filterValues === "object") {
              // true 代表要過濾掉（取消勾選）
              const itemValue = String(item[key])
              if (filterValues[itemValue] === true) {
                return false
              }
            }
          }
          return true
        })
      : []

  // 根據所有屬性統計數據
  if (filteredData && filteredData.length > 0 && allAttributes.length > 0) {
    // 按組合鍵分組數據
    filteredData.forEach((item: any) => {
      // 組合所有屬性的值作為 key
      const keyParts: string[] = []
      allAttributes.forEach((attr: string) => {
        const value = item[attr]
        if (value !== undefined && value !== null) {
          keyParts.push(String(value))
        }
      })

      if (keyParts.length > 0) {
        const key = keyParts.join(" - ")
        if (!groupedData.has(key)) {
          groupedData.set(key, [])
        }
        groupedData.get(key)?.push(item)
      }
    })

    // 獲取聚合器函數
    const aggregators = props.aggregators || PivotUtilities.aggregators
    const aggregatorFunc = aggregators[aggregatorName]

    // 對每組計算聚合值
    groupedData.forEach((items, key) => {
      let aggregatedValue = 0

      if (aggregatorFunc && typeof aggregatorFunc === "function") {
        try {
          // 創建聚合器實例
          const agg: any = aggregatorFunc(vals)()
          // 將該組的所有數據推入聚合器
          if (agg && typeof agg.push === "function") {
            items.forEach((item: any) => {
              agg.push(item)
            })
            // 獲取聚合結果
            if (typeof agg.value === "function") {
              aggregatedValue = agg.value() || 0
            } else {
              aggregatedValue = items.length
            }
          } else {
            aggregatedValue = items.length
          }
        } catch (e) {
          // 如果聚合器失敗，使用計數
          aggregatedValue = items.length
        }
      } else {
        // 如果沒有聚合器，使用計數
        aggregatedValue = items.length
      }

      categories.push(key)
      values.push(aggregatedValue)
    })

    // 排序
    const sortedIndices = Array.from({ length: categories.length }, (_, i) => i).sort(
      (a, b) => (values[b] || 0) - (values[a] || 0)
    )

    const sortedCategories = sortedIndices.map(i => categories[i]).filter((c): c is string => c !== undefined)
    const sortedValues = sortedIndices.map(i => values[i]).filter((v): v is number => v !== undefined)

    categories.length = 0
    values.length = 0
    categories.push(...sortedCategories)
    values.push(...sortedValues)
  }

  // 動態標題
  const titleParts: string[] = []
  if (rows && rows.length > 0) titleParts.push(...rows)
  if (cols && cols.length > 0) titleParts.push(...cols)
  const chartTitle = titleParts.length > 0 ? `${titleParts.join(", ")}` : ""

  // 根據聚合器類型設置 Y 軸標籤
  const yAxisLabel = aggregatorName || "數量"

  return {
    title: {
      text: chartTitle,
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
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: "value",
      name: yAxisLabel
    },
    series: [
      {
        name: yAxisLabel,
        type: "bar",
        data: values,
        itemStyle: {
          color: (params: any) => {
            const colors = [
              "#5470c6",
              "#91cc75",
              "#fac858",
              "#ee6666",
              "#73c0de",
              "#3ba272",
              "#fc8452",
              "#9a60b4",
              "#ea7ccc",
              "#ff9f7f"
            ]
            return colors[params.dataIndex % colors.length]
          }
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}"
        }
      }
    ]
  }
})
</script>

<style scoped>
.echarts-bar-chart-container {
  width: 100%;
  height: 500px;
}
</style>
