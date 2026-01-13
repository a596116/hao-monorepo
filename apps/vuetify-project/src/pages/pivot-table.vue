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
                  <VuePivottableUi
                    :data="pivotData"
                    :rows="['PartNum', 'rev', 'Layer']"
                    :cols="['ProcName', 'MachineNo']"
                    :vals="['Done']"
                    :aggregators="customAggregators"
                    aggregator-name="Count Done=否"
                    renderer-name="Table with Links"
                    :renderers="renderers"
                    :show-col-total="true"
                    :show-row-total="true"
                  >
                  </VuePivottableUi>

                  <TableWithLinksRenderer
                    :data="pivotData"
                    :rows="['PartNum', 'rev', 'Layer']"
                    :cols="['ProcName', 'MachineNo']"
                    :vals="['Done']"
                    :aggregators="customAggregators"
                    :cell-renderer="customCellRenderer"
                    :show-col-total="false"
                    :show-row-total="false"
                    aggregator-name="Count Done=否"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 原始數據表格 -->
        <!-- <v-row class="mt-4">
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
        </v-row> -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, markRaw, h } from "vue"
import { useI18n } from "vue-i18n"
import { VuePivottableUi, Renderer, PivotUtilities } from "vue-pivottable"
import "vue-pivottable/dist/vue-pivottable.css"
import type { DataTableHeader } from "vuetify"
import PlotlyRenderer from "@vue-pivottable/plotly-renderer"
import EChartsBarChartRenderer from "@/components/EChartsBarChartRenderer.vue"
import EChartsBarChartRenderer2 from "@/components/EChartsBarChartRenderer2.vue"
import TableWithLinksRenderer from "@/components/TableWithLinksRenderer.vue"
import { pivotTableData, type PivotDataItem } from "@/data/pivot-table-data"

const { t } = useI18n()

// Pivot Table 資料
const pivotData = ref<PivotDataItem[]>(pivotTableData)

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

// 自定義 cell renderer 函數（返回內容和樣式）
const customCellRenderer = ({ value, rowKey, colKey, rowAttrs, colAttrs }: any) => {
  // 構建 URL 參數
  const params = new URLSearchParams()
  rowAttrs.forEach((attr: string, idx: number) => {
    if (rowKey[idx]) params.set(attr.toLowerCase(), rowKey[idx])
  })
  colAttrs.forEach((attr: string, idx: number) => {
    if (colKey[idx]) params.set(attr.toLowerCase(), colKey[idx])
  })

  // 根據數值決定樣式
  const isZero = value === 0
  const backgroundColor = isZero ? "#4caf5050" : "#ffebee"

  return {
    content: h(
      "a",
      {
        href: `/detail?${params.toString()}`,
        style: {
          fontSize: "14px",
          textDecoration: "none",
          transition: "opacity 0.2s"
        }
      },
      value.toString()
    ),
    style: { backgroundColor }
  }
}

// 合併預設聚合器和自定義聚合器
const customAggregators: any = {
  // 展開所有預設的聚合器（Count, Sum, Average, Min, Max 等）
  ...PivotUtilities.aggregators,

  // 自定義聚合器：只統計 Done = "否" 的數量
  "Count Done=否": () => () => {
    return {
      count: 0,
      push(record: PivotDataItem) {
        if (record.Done === "否") {
          this.count++
        }
      },
      value() {
        return this.count
      },
      format(x: number) {
        return x.toString()
      }
    }
  }
}

// 使用 markRaw 標記 renderers，避免組件被響應式化
// 創建一個包裝 renderer，將 cellRenderer 傳遞給 TableWithLinksRenderer
const TableWithLinksRendererWrapper = {
  name: "TableWithLinksRendererWrapper",
  props: { ...PivotUtilities.defaultProps },
  setup(props: any) {
    return () =>
      h(TableWithLinksRenderer, {
        ...props,
        cellRenderer: customCellRenderer
      })
  }
}

const renderers: any = markRaw({
  ...Renderer,
  "Table with Links": markRaw(TableWithLinksRendererWrapper)
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
