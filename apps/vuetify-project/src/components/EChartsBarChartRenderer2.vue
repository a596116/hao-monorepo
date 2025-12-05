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
  console.log("Props changed:", {
    rows: props.rows,
    cols: props.cols,
    aggregatorName: props.aggregatorName,
    valueFilter: props.valueFilter
  })

  // 確保明確訪問 props 以觸發響應式更新
  const data = props.data
  const rows = props.rows
  const cols = props.cols
  const aggregatorName = props.aggregatorName || "Count"
  const vals = props.vals || []

  const categories: string[] = []
  const machineNumbers = new Set<string>()
  const seriesDataMap = new Map<string, Map<string, number>>()

  // 收集所有要統計的屬性（rows + cols，但排除 'number'）
  const allAttributes: string[] = []
  if (rows && rows.length > 0) {
    allAttributes.push(...rows.filter(r => r !== "number"))
  }
  if (cols && cols.length > 0) {
    allAttributes.push(...cols.filter(c => c !== "number"))
  }

  // 應用篩選條件 - 深度訪問 valueFilter 的屬性以確保響應式追蹤
  const valueFilter = props.valueFilter || {}
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

  // 根據所有屬性統計數據，按機號分組
  if (filteredData && filteredData.length > 0) {
    // 獲取聚合器函數
    const aggregators = props.aggregators || PivotUtilities.aggregators
    const aggregatorFunc = aggregators[aggregatorName]

    // 首先收集所有機號和類別
    const groupedByCategory = new Map<string, Map<string, any[]>>()

    filteredData.forEach((item: any) => {
      const machineNumber = item.number ? String(item.number) : "未知"
      machineNumbers.add(machineNumber)

      // 組合其他屬性作為類別
      const keyParts: string[] = []
      if (allAttributes.length > 0) {
        allAttributes.forEach((attr: string) => {
          const value = item[attr]
          if (value !== undefined && value !== null) {
            keyParts.push(String(value))
          }
        })
      }

      const category = keyParts.length > 0 ? keyParts.join(" - ") : "全部"

      if (!groupedByCategory.has(category)) {
        groupedByCategory.set(category, new Map())
      }
      const categoryGroup = groupedByCategory.get(category)!
      if (!categoryGroup.has(machineNumber)) {
        categoryGroup.set(machineNumber, [])
      }
      categoryGroup.get(machineNumber)?.push(item)
    })

    // 收集所有類別
    categories.push(...Array.from(groupedByCategory.keys()))

    // 為每個機號計算在每個類別下的值
    machineNumbers.forEach(machineNumber => {
      const machineData = new Map<string, number>()

      categories.forEach(category => {
        const categoryGroup = groupedByCategory.get(category)
        const items = categoryGroup?.get(machineNumber) || []

        let aggregatedValue = 0

        if (items.length > 0 && aggregatorFunc && typeof aggregatorFunc === "function") {
          try {
            const agg: any = aggregatorFunc(vals)()
            if (agg && typeof agg.push === "function") {
              items.forEach((item: any) => {
                agg.push(item)
              })
              if (typeof agg.value === "function") {
                aggregatedValue = agg.value() || 0
              } else {
                aggregatedValue = items.length
              }
            } else {
              aggregatedValue = items.length
            }
          } catch (e) {
            aggregatedValue = items.length
          }
        } else if (items.length > 0) {
          aggregatedValue = items.length
        }

        machineData.set(category, aggregatedValue)
      })

      seriesDataMap.set(machineNumber, machineData)
    })
  }

  // 動態標題
  const titleParts: string[] = []
  if (rows && rows.length > 0) titleParts.push(...rows)
  if (cols && cols.length > 0) titleParts.push(...cols)
  const chartTitle = titleParts.length > 0 ? `${titleParts.join(", ")}` : ""

  // 根據聚合器類型設置 Y 軸標籤
  const yAxisLabel = aggregatorName || "數量"

  // 準備系列數據
  const series = Array.from(machineNumbers).map(machineNumber => {
    const machineData = seriesDataMap.get(machineNumber) || new Map()
    const seriesValues = categories.map(category => machineData.get(category) || 0)

    return {
      name: machineNumber,
      type: "bar",
      data: seriesValues,
      label: {
        show: false
      }
    }
  })

  return {
    title: {
      text: chartTitle,
      left: "center",
      textStyle: {
        fontSize: 16
      }
    },
    legend: {
      data: Array.from(machineNumbers),
      top: chartTitle ? 30 : 10,
      left: "center",
      type: "scroll"
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
      top: chartTitle ? 60 : 40,
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
    series: series
  }
})
</script>

<style scoped>
.echarts-bar-chart-container {
  width: 100%;
  height: 500px;
}
</style>
