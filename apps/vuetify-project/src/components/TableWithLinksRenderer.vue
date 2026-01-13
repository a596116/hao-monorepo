<template>
  <table class="pvtTable">
    <!-- 表頭：參考 VPivottableHeader 結構 -->
    <thead>
      <!-- 列屬性行（每個 colAttr 一行） -->
      <tr v-for="(c, j) in colAttrs" :key="`colAttrs${j}`">
        <!-- 左上角空白單元格（僅第一行） -->
        <th v-if="j === 0 && rowAttrs.length !== 0" :colspan="rowAttrs.length" :rowspan="colAttrs.length" />

        <!-- 列屬性標籤 -->
        <th class="pvtAxisLabel">
          {{ c }}
        </th>

        <!-- 列標題：參考 VPivottableHeaderColumns 邏輯 -->
        <template v-for="(colKey, i) in colKeys" :key="`colKey${i}`">
          <th
            v-if="spanSize(colKeys, i, j) !== -1"
            class="pvtColLabel"
            :colspan="spanSize(colKeys, i, j)"
            :rowspan="j === colAttrs.length - 1 && rowAttrs.length !== 0 ? 2 : 1"
          >
            {{ colKey[j] }}
          </th>
        </template>

        <!-- 總計標題：參考 VPivottableHeaderRowsTotal -->
        <th
          v-if="j === 0 && showRowTotal"
          class="pvtTotalLabel"
          :rowspan="colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)"
        >
          {{ languagePack?.totals || "總計" }}
        </th>
      </tr>

      <!-- 行屬性標題行：參考 VPivottableHeaderRows -->
      <tr v-if="rowAttrs.length !== 0">
        <th v-for="(r, i) in rowAttrs" :key="`rowAttr${i}`" class="pvtAxisLabel">
          {{ r }}
        </th>
        <th v-if="showRowTotal || colAttrs.length !== 0" class="pvtTotalLabel">
          {{ colAttrs.length === 0 && showRowTotal ? languagePack?.totals || "總計" : null }}
        </th>
      </tr>
    </thead>

    <!-- 表體：參考 VPivottableBody 結構 -->
    <tbody>
      <!-- 數據行：參考 VPivottableBodyRows -->
      <tr v-for="(rowKey, i) in rowKeys" :key="`rowKeyRow${i}`">
        <!-- 行標籤：使用 spanSize 支持合併（完全參考 VPivottableBodyRows） -->
        <template v-for="(text, j) in rowKey" :key="`rowLabel${i}-${j}`">
          <th
            v-if="spanSize(rowKeys, i, j) !== -1"
            class="pvtRowLabel"
            :rowspan="spanSize(rowKeys, i, j)"
            :colspan="j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1"
          >
            {{ text }}
          </th>
        </template>

        <!-- 數據單元格（支持自定義 renderer 或帶連結） -->
        <td
          v-for="(colKey, j) in colKeys"
          :key="`pvtVal${i}-${j}`"
          class="pvtVal"
          :style="getCellStyleAndContent(rowKey, colKey).style"
        >
          <!-- 使用自定義 renderer -->
          <component :is="getCellStyleAndContent(rowKey, colKey).content" v-if="props.cellRenderer" />
          <!-- 預設渲染：純文字顯示 -->
          <span v-else>{{ getCellValue(rowKey, colKey) }}</span>
        </td>

        <!-- 行總計 -->
        <td v-if="showRowTotal" class="pvtTotal">
          {{ getRowTotal(rowKey) }}
        </td>
      </tr>

      <!-- 列總計行：參考 VPivottableBodyRowsTotalRow -->
      <tr v-if="showColTotal || (colKeys.length === 0 && rowKeys.length === 0)">
        <th class="pvtTotalLabel" :colspan="rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)">
          {{ languagePack?.totals || "總計" }}
        </th>
        <td v-for="(colKey, i) in colKeys" :key="`total${i}`" class="pvtTotal">
          {{ getColTotal(colKey) }}
        </td>
        <td v-if="showRowTotal || (colKeys.length === 0 && rowKeys.length === 0)" class="pvtGrandTotal">
          {{ grandTotal }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType, type CSSProperties } from "vue"
import { PivotUtilities } from "vue-pivottable"

// 定義類型
interface CellParams {
  value: number
  rowKey: string[]
  colKey: string[]
  rowAttrs: string[]
  colAttrs: string[]
}

interface CellRendererResult {
  content?: any
  style?: CSSProperties
}

type CellRenderer = (params: CellParams) => any | CellRendererResult
type CellStyleGetter = (params: CellParams) => CSSProperties

// 接收 PivotTable 的所有 props，並添加自定義 renderer
const props = defineProps({
  ...PivotUtilities.defaultProps,
  // 自定義 cell renderer 函數（返回內容或 { content, style }）
  cellRenderer: {
    type: Function as PropType<CellRenderer>,
    default: undefined
  },
  // 自定義 cell 樣式函數（返回樣式物件，應用到 td 元素）
  cellStyleGetter: {
    type: Function as PropType<CellStyleGetter>,
    default: undefined
  }
})

// === 基礎配置 ===
const colAttrs = computed(() => props.cols || [])
const rowAttrs = computed(() => props.rows || [])
const showRowTotal = computed(() => props.showRowTotal ?? true)
const showColTotal = computed(() => props.showColTotal ?? true)
const languagePack = computed(() => props.languagePack)

// === 數據處理：將 keys 改為二維數組結構（參考原始 vue3-pivottable） ===

/**
 * 通用函數：從數據中提取唯一的鍵組合
 * @param attrs 屬性列表
 * @returns 排序後的唯一鍵組合數組
 */
const getUniqueKeys = (attrs: string[]) => {
  const keysMap = new Map<string, string[]>()
  const data = props.data || []

  data.forEach((record: any) => {
    const keyArray = attrs.map((attr: string) => record[attr] ?? "")
    const keyString = keyArray.join("\x00")
    if (!keysMap.has(keyString)) {
      keysMap.set(keyString, keyArray)
    }
  })

  return Array.from(keysMap.values()).sort((a, b) => a.join("\x00").localeCompare(b.join("\x00")))
}

// 獲取所有唯一的行組合（二維數組結構）
const rowKeys = computed(() => getUniqueKeys(rowAttrs.value))

// 獲取所有唯一的列組合（二維數組結構）
const colKeys = computed(() => getUniqueKeys(colAttrs.value))

// === spanSize 函數：參考 VPivottableHeaderColumns 的邏輯 ===

/**
 * 計算列標題的 colspan
 * @param colKeys 所有列鍵（二維數組）
 * @param i 當前列索引
 * @param colIndex 當前層級索引
 * @returns colspan 值，-1 表示不顯示（被前面的合併單元格覆蓋）
 */
const spanSize = (keys: string[][], i: number, level: number) => {
  const currKey = keys[i]
  if (!currKey) return 1

  // 如果不是第一個，檢查是否應該被前面的單元格覆蓋
  if (i > 0) {
    const prevKey = keys[i - 1]
    if (!prevKey) return 1

    // 檢查前面所有層級是否都相同
    let allPrevLevelsMatch = true
    for (let offset = 0; offset < level; offset++) {
      if (prevKey[offset] !== currKey[offset]) {
        allPrevLevelsMatch = false
        break
      }
    }

    // 如果前面所有層級都相同，且當前層級也相同，則被前面的單元格覆蓋
    if (allPrevLevelsMatch && prevKey[level] === currKey[level]) {
      return -1
    }
  }

  // 計算應該合併多少行/列
  let span = 1
  while (i + span < keys.length) {
    const nextKey = keys[i + span]
    if (!nextKey) break

    // 檢查前面所有層級是否都相同
    let allPrevLevelsMatch = true
    for (let offset = 0; offset < level; offset++) {
      if (currKey[offset] !== nextKey[offset]) {
        allPrevLevelsMatch = false
        break
      }
    }

    // 如果前面所有層級都相同，且當前層級也相同，則可以合併
    if (allPrevLevelsMatch && currKey[level] === nextKey[level]) {
      span++
    } else {
      break
    }
  }

  return span
}

// === 聚合器邏輯 ===

// 緩存聚合結果以提高性能
const aggregationCache = ref(new Map<string, number>())

// 監聽數據變化，清空緩存
watch(
  () => [props.data, props.aggregatorName, props.vals, rowAttrs.value, colAttrs.value],
  () => {
    aggregationCache.value.clear()
  },
  { deep: true }
)

/**
 * 獲取單元格的聚合值
 * @param rowKey 行鍵
 * @param colKey 列鍵
 * @returns 聚合後的數值
 */
const getCellValue = (rowKey: string[], colKey: string[]): number => {
  const cacheKey = `${rowKey.join("\x00")}|${colKey.join("\x00")}`

  // 檢查緩存
  const cachedValue = aggregationCache.value.get(cacheKey)
  if (cachedValue !== undefined) {
    return cachedValue
  }

  const data = props.data || []

  // 篩選符合行和列條件的數據
  const filtered = data.filter((record: any) => {
    const rowMatch = rowAttrs.value.every((attr, idx) => record[attr] === rowKey[idx])
    const colMatch = colAttrs.value.every((attr, idx) => record[attr] === colKey[idx])
    return rowMatch && colMatch
  })

  // 計算聚合值
  let result = 0

  if (filtered.length > 0) {
    const aggregators = props.aggregators || PivotUtilities.aggregators
    const aggregatorName = props.aggregatorName || "Count"
    const aggregatorFunc = aggregators[aggregatorName]
    const vals = props.vals || []

    try {
      if (typeof aggregatorFunc === "function") {
        const agg: any = aggregatorFunc(vals)()

        if (agg && typeof agg.push === "function") {
          filtered.forEach((record: any) => agg.push(record))
          result = typeof agg.value === "function" ? (agg.value() ?? 0) : filtered.length
        } else {
          result = filtered.length
        }
      } else {
        result = filtered.length
      }
    } catch {
      // 發生錯誤時，退回到計數模式
      result = filtered.length
    }
  }

  aggregationCache.value.set(cacheKey, result)
  return result
}

// === 樣式和內容：由外部控制 ===

/**
 * 獲取 cell 的內容和樣式
 * cellRenderer 可以返回：
 * 1. VNode - 只有內容
 * 2. { content: VNode, style: object } - 內容和樣式
 */
const getCellStyleAndContent = (rowKey: string[], colKey: string[]) => {
  if (props.cellRenderer) {
    const result = props.cellRenderer({
      value: getCellValue(rowKey, colKey),
      rowKey,
      colKey,
      rowAttrs: rowAttrs.value,
      colAttrs: colAttrs.value
    })

    // 檢查是否為 { content, style } 格式
    if (result && typeof result === "object" && "content" in result) {
      return {
        content: result.content,
        style: result.style || {}
      }
    }

    // 否則視為 VNode，只有內容
    return {
      content: result,
      style: {}
    }
  }

  // 使用 cellStyleGetter（向後兼容）
  if (props.cellStyleGetter) {
    return {
      content: null,
      style: props.cellStyleGetter({
        value: getCellValue(rowKey, colKey),
        rowKey,
        colKey,
        rowAttrs: rowAttrs.value,
        colAttrs: colAttrs.value
      })
    }
  }

  return {
    content: null,
    style: {}
  }
}

// === 總計計算 ===

/**
 * 計算行總計
 */
const getRowTotal = (rowKey: string[]): number => {
  return colKeys.value.reduce((sum, colKey) => sum + getCellValue(rowKey, colKey), 0)
}

/**
 * 計算列總計
 */
const getColTotal = (colKey: string[]): number => {
  return rowKeys.value.reduce((sum, rowKey) => sum + getCellValue(rowKey, colKey), 0)
}

/**
 * 計算總計
 */
const grandTotal = computed(() => {
  return rowKeys.value.reduce((sum, rowKey) => sum + getRowTotal(rowKey), 0)
})
</script>

<style scoped>
.pvtTable {
  border-collapse: collapse;
  font-family: inherit;
  font-size: 0.875rem;
  width: 100%;
}

.pvtTable thead tr th,
.pvtTable tbody tr th {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  text-align: center;
  font-weight: 600;
}

.pvtTable tbody tr td {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  text-align: right;
}
</style>
