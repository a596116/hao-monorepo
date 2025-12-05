# ECharts 使用說明

本專案已整合 ECharts 圖表庫，可用於製作各種資料視覺化圖表。

## 安裝

首先需要安裝必要的套件：

```bash
pnpm add echarts vue-echarts
```

## 使用方式

### 1. 查看示例頁面

我已經創建了一個完整的圖表示例頁面：`src/pages/charts.vue`

您可以透過訪問 `/charts` 路由來查看各種圖表範例，包括：

- **長條圖 (Bar Chart)** - 用於展示分類資料的比較
- **圓餅圖 (Pie Chart)** - 用於展示部分與整體的比例關係
- **折線圖 (Line Chart)** - 用於展示資料隨時間的變化趨勢
- **雷達圖 (Radar Chart)** - 用於多維度資料的比較分析

### 2. 在您的組件中使用 ECharts

#### 基本用法

```vue
<template>
  <v-chart :option="chartOption" :style="{ height: '400px' }" autoresize />
</template>

<script setup lang="ts">
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components"
import VChart from "vue-echarts"

// 註冊需要的 ECharts 組件
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent])

// 圖表配置
const chartOption = ref({
  title: {
    text: "我的圖表"
  },
  xAxis: {
    type: "category",
    data: ["週一", "週二", "週三", "週四", "週五"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [120, 200, 150, 80, 70],
      type: "bar"
    }
  ]
})
</script>
```

### 3. 按需引入

ECharts 支援按需引入，只引入需要的組件可以減少打包體積：

#### 可用的圖表類型

- `BarChart` - 長條圖
- `LineChart` - 折線圖
- `PieChart` - 圓餅圖
- `RadarChart` - 雷達圖
- `ScatterChart` - 散點圖
- `CandlestickChart` - K線圖
- `GaugeChart` - 儀表板圖
- 更多請參考 [ECharts 官方文檔](https://echarts.apache.org/)

#### 可用的組件

- `TitleComponent` - 標題
- `TooltipComponent` - 提示框
- `LegendComponent` - 圖例
- `GridComponent` - 直角坐標系網格
- `DataZoomComponent` - 資料區域縮放
- `ToolboxComponent` - 工具箱
- 等等...

### 4. 響應式圖表

圖表會自動響應容器大小變化，只需添加 `autoresize` 屬性：

```vue
<v-chart :option="chartOption" autoresize />
```

### 5. 動態更新資料

圖表資料可以通過 ref 動態更新：

```vue
<script setup lang="ts">
const chartOption = ref({
  // ... 初始配置
})

// 更新資料
function updateData() {
  chartOption.value = {
    ...chartOption.value,
    series: [
      {
        data: [
          /* 新資料 */
        ]
      }
    ]
  }
}
</script>
```

### 6. 主題和樣式

您可以自訂圖表的顏色和樣式：

```typescript
const chartOption = ref({
  color: ["#1976d2", "#4caf50", "#ff9800"],
  series: [
    {
      itemStyle: {
        color: "#1976d2"
      }
    }
  ]
})
```

## 範例資料結構

參考 `src/pages/charts.vue` 中的各種圖表配置範例。

## 更多資源

- [ECharts 官方網站](https://echarts.apache.org/)
- [ECharts 範例集](https://echarts.apache.org/examples/)
- [Vue-ECharts GitHub](https://github.com/ecomfe/vue-echarts)

## 注意事項

1. 記得在使用前先註冊需要的 ECharts 組件
2. 為圖表容器設置明確的高度
3. 使用 `autoresize` 屬性讓圖表自動適應容器大小
4. 大量資料時考慮使用資料抽樣或虛擬滾動功能
