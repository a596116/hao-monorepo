<template>
  <v-container fluid class="h-full">
    <v-card border ripple class="flex flex-col h-full">
      <section class="p-2">
        <v-card-title class="!text-3xl text-hd-primary">
          {{ t("table.title") }}
        </v-card-title>
        <v-card-text class="flex justify-end">
          <v-btn variant="outlined" @click="toggleExpandAll">
            {{ isAllExpanded ? t("table.collapseAll") : t("table.expandAll") }}
          </v-btn>
        </v-card-text>
      </section>
      <!-- 第一層表格 -->
      <div class="overflow-hidden flex-1">
        <v-data-table
          v-model:expanded="expanded"
          class="h-full"
          :headers="headersWithExpand"
          item-value="id"
          :items="topLevelData"
          show-expand
          hide-default-footer
          expand-on-click
          fixed-header
          height="100%"
        >
          <template #item.data-table-expand="{ item, props }">
            <v-btn v-if="hasChildren(getRawItem(item))" v-bind="normalizeExpandButtonProps(props)" />
            <span v-else class="expand-placeholder" />
          </template>
          <template #expanded-row="{ columns, item }">
            <tr v-if="item.children && item.children.length > 0">
              <td class="pa-0" :colspan="columns.length">
                <v-data-table
                  v-model:expanded="expandedSecond"
                  class="level-2-table"
                  density="compact"
                  :headers="headersWithExpand"
                  hide-default-footer
                  hide-default-header
                  item-value="id"
                  :items="item.children"
                  show-expand
                  expand-on-click
                >
                  <template #item.data-table-expand="{ item: childItem, props }">
                    <v-btn v-if="hasChildren(getRawItem(childItem))" v-bind="normalizeExpandButtonProps(props)" />
                    <span v-else class="expand-placeholder" />
                  </template>
                  <template #expanded-row="{ columns: cols, item: child }">
                    <tr v-if="child.children && child.children.length > 0">
                      <td class="pa-0" :colspan="cols.length">
                        <v-data-table
                          class="level-3-table"
                          density="compact"
                          :headers="headersWithExpand"
                          hide-default-footer
                          hide-default-header
                          item-value="id"
                          :items="child.children"
                        >
                          <template #item.data-table-expand>
                            <span class="expand-placeholder" />
                          </template>
                        </v-data-table>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { type DataTableHeader } from "vuetify"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

// 表格標題 - 每層都使用相同的欄位
const baseHeaders = computed<DataTableHeader[]>(() => [
  { title: t("table.name"), key: "name", sortable: false, width: "40%" },
  {
    title: t("table.category"),
    key: "category",
    sortable: false,
    width: "20%"
    // cellProps: {
    //   style: { backgroundColor: 'red' }
    // },
    // headerProps: {
    //   style: { backgroundColor: 'red' }
    // }
  },
  {
    title: t("table.count"),
    key: "count",
    sortable: false,
    width: "20%",
    cellProps: (data: { value: number }) => ({
      style: { backgroundColor: data.value > 100 ? "green" : undefined }
    })
  },
  { title: t("table.status"), key: "status", sortable: false, width: "20%" }
])

const expandHeader: DataTableHeader = {
  title: "",
  key: "data-table-expand",
  sortable: false,
  width: "56px"
}

const headersWithExpand = computed(() => [expandHeader, ...baseHeaders.value])

const hasChildren = (item: any) => Array.isArray(item?.children) && item.children.length > 0

const getRawItem = (slotItem: any) => slotItem?.raw ?? slotItem

const normalizeExpandButtonProps = (slotProps: any) => {
  if (!slotProps) {
    return {}
  }
  return {
    ...slotProps,
    icon: slotProps.icon as string | undefined
  }
}

// 追蹤展開的行
const expanded = ref<string[]>([])
const expandedSecond = ref<string[]>([])

// 獲取所有第一層有子項目的ID
const getAllFirstLevelIds = () => {
  return topLevelData.value.filter(item => hasChildren(item)).map(item => item.id)
}

// 獲取所有第二層有子項目的ID
const getAllSecondLevelIds = () => {
  const ids: string[] = []
  topLevelData.value.forEach(item => {
    if (item.children) {
      item.children.forEach(child => {
        if (hasChildren(child)) {
          ids.push(child.id)
        }
      })
    }
  })
  return ids
}

// 判斷是否全部展開
const isAllExpanded = computed(() => {
  const firstLevelIds = getAllFirstLevelIds()
  const secondLevelIds = getAllSecondLevelIds()
  const allFirstExpanded = firstLevelIds.every(id => expanded.value.includes(id))
  const allSecondExpanded = secondLevelIds.every(id => expandedSecond.value.includes(id))
  return allFirstExpanded && allSecondExpanded && firstLevelIds.length > 0
})

// 切換展開/縮合全部
const toggleExpandAll = () => {
  const firstLevelIds = getAllFirstLevelIds()
  const secondLevelIds = getAllSecondLevelIds()

  if (isAllExpanded.value) {
    // 縮合全部
    expanded.value = []
    expandedSecond.value = []
  } else {
    // 展開全部
    expanded.value = [...firstLevelIds]
    expandedSecond.value = [...secondLevelIds]
  }
}

// 假數據 - 三層結構，每層結構相同
const topLevelData = ref([
  {
    id: "1",
    name: "電子產品部門",
    category: "部門A",
    count: 150,
    status: "營運中",
    children: [
      {
        id: "1-1",
        name: "智能手機系列",
        category: "手機類",
        count: 50,
        status: "熱銷",
        children: [
          {
            id: "1-1-1",
            name: "旗艦機型 X1",
            category: "高階",
            count: 20,
            status: "完成"
          },
          {
            id: "1-1-2",
            name: "中階機型 M2",
            category: "中階",
            count: 18,
            status: "進行中"
          },
          {
            id: "1-1-3",
            name: "入門機型 S3",
            category: "入門",
            count: 12,
            status: "完成"
          }
        ]
      },
      {
        id: "1-2",
        name: "平板電腦系列",
        category: "平板類",
        count: 45,
        status: "熱銷"
        // children: [
        //   {
        //     id: '1-2-1',
        //     name: 'Pro 平板',
        //     category: '專業',
        //     count: 15,
        //     status: '完成'
        //   },
        //   {
        //     id: '1-2-2',
        //     name: '標準平板',
        //     category: '標準',
        //     count: 20,
        //     status: '完成'
        //   },
        //   {
        //     id: '1-2-3',
        //     name: '輕量平板',
        //     category: '輕量',
        //     count: 10,
        //     status: '進行中'
        //   }
        // ]
      },
      {
        id: "1-3",
        name: "筆記型電腦系列",
        category: "電腦類",
        count: 55,
        status: "正常",
        children: [
          {
            id: "1-3-1",
            name: "遊戲筆電 G1",
            category: "遊戲",
            count: 25,
            status: "完成"
          },
          {
            id: "1-3-2",
            name: "商務筆電 B2",
            category: "商務",
            count: 20,
            status: "完成"
          },
          {
            id: "1-3-3",
            name: "文書筆電 O3",
            category: "文書",
            count: 10,
            status: "進行中"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "家電產品部門",
    category: "部門B",
    count: 85,
    status: "營運中",
    children: [
      {
        id: "2-1",
        name: "冰箱系列",
        category: "冰箱類",
        count: 45,
        status: "正常",
        children: [
          {
            id: "2-1-1",
            name: "四門冰箱 R1",
            category: "大型",
            count: 15,
            status: "完成"
          },
          {
            id: "2-1-2",
            name: "雙門冰箱 R2",
            category: "中型",
            count: 20,
            status: "完成"
          },
          {
            id: "2-1-3",
            name: "單門冰箱 R3",
            category: "小型",
            count: 10,
            status: "進行中"
          }
        ]
      },
      {
        id: "2-2",
        name: "洗衣機系列",
        category: "洗衣機類",
        count: 40,
        status: "正常",
        children: [
          {
            id: "2-2-1",
            name: "滾筒洗衣機 W1",
            category: "滾筒",
            count: 15,
            status: "完成"
          },
          {
            id: "2-2-2",
            name: "直立洗衣機 W2",
            category: "直立",
            count: 18,
            status: "完成"
          },
          {
            id: "2-2-3",
            name: "小型洗衣機 W3",
            category: "迷你",
            count: 7,
            status: "完成"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "運動休閒部門",
    category: "部門C",
    count: 120,
    status: "營運中",
    children: [
      {
        id: "3-1",
        name: "健身器材",
        category: "健身類",
        count: 70,
        status: "熱銷",
        children: [
          {
            id: "3-1-1",
            name: "跑步機 T1",
            category: "有氧",
            count: 30,
            status: "完成"
          },
          {
            id: "3-1-2",
            name: "健身車 B1",
            category: "有氧",
            count: 25,
            status: "進行中"
          },
          {
            id: "3-1-3",
            name: "啞鈴組 D1",
            category: "重訓",
            count: 15,
            status: "完成"
          }
        ]
      },
      {
        id: "3-2",
        name: "戶外用品",
        category: "戶外類",
        count: 50,
        status: "正常",
        children: [
          {
            id: "3-2-1",
            name: "登山帳篷 C1",
            category: "露營",
            count: 20,
            status: "完成"
          },
          {
            id: "3-2-2",
            name: "睡袋 S1",
            category: "露營",
            count: 15,
            status: "完成"
          },
          {
            id: "3-2-3",
            name: "登山背包 P1",
            category: "登山",
            count: 15,
            status: "進行中"
          }
        ]
      }
    ]
  }
])
</script>

<style scoped>
.expand-placeholder {
  display: inline-block;
  width: 40px;
  height: 24px;
}

.v-data-table :deep(tbody tr) {
  background-color: #e3f2fd80 !important;
}

.level-2-table :deep(tbody tr) {
  background-color: #e8f5e980 !important;
}

.level-3-table :deep(tbody tr) {
  background-color: #fce4ec80 !important;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: #bbdefb80 !important;
}

.level-2-table :deep(tbody tr:hover) {
  background-color: #c8e6c980 !important;
}

.level-3-table :deep(tbody tr:hover) {
  background-color: #f8bbd080 !important;
}
</style>
