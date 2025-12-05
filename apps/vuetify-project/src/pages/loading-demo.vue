<template>
  <div class="w-full h-full">
    <v-container fluid class="w-full pa-6">
      <v-card flat class="rounded-lg">
        <v-card-title class="text-h5 pa-6"> Loading 載入 </v-card-title>

        <v-card-text class="pa-6">
          <div class="mb-4 text-body-2 text-grey-darken-1">
            Loading 組件支援兩種使用方式：直接使用 Loading 組件或使用 v-loading directive
          </div>

          <!-- 使用 Loading 組件 (全屏) -->
          <div class="mb-10">
            <div class="mb-4 section-title">使用 Loading 組件 (全屏)</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                全屏 Loading 會覆蓋整個頁面，不設置 inline 屬性即為全屏模式
              </div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="primary" @click="showFullscreenLoading">
                  <v-icon start>mdi-loading</v-icon>
                  顯示全屏 Loading (3秒)
                </v-btn>
                <v-btn color="secondary" @click="showFullscreenLoadingWithText">
                  <v-icon start>mdi-refresh</v-icon>
                  顯示帶文字的 Loading
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- 使用 Loading 組件 (區域載入) -->
          <div class="mb-10">
            <div class="mb-4 section-title">使用 Loading 組件 (區域載入)</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">設置 inline 屬性為 true，Loading 會相對於父元素定位</div>
              <v-btn color="success" class="mb-4" @click="showComponentInlineLoading">
                <v-icon start>mdi-loading</v-icon>
                {{ isComponentInlineLoading ? "隱藏" : "顯示" }} 區域 Loading
              </v-btn>
              <div class="loading-demo-box">
                <div class="pa-6">
                  <p class="mb-2">這是一個容器區域</p>
                  <p>Loading 會顯示在這個區域內</p>
                </div>
                <Loading :loading="isComponentInlineLoading" inline text="區域載入中..." color="info" />
              </div>
            </v-card>
          </div>

          <!-- v-loading directive 簡單 -->
          <div class="mb-10">
            <div class="mb-4 section-title">使用 v-loading Directive (簡單)</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                使用 <code>v-loading</code> directive 動態控制 Loading 狀態
              </div>
              <v-btn color="info" class="mb-4" @click="toggleDirectiveLoading">
                <v-icon start>{{ isDirectiveLoading ? "mdi-stop" : "mdi-play" }}</v-icon>
                {{ isDirectiveLoading ? "隱藏" : "顯示" }} Loading
              </v-btn>
              <div v-loading="isDirectiveLoading" class="loading-demo-box">
                <div class="pa-6">
                  <p class="mb-2">這是使用 v-loading directive 的區域</p>
                  <p>可以動態切換 loading 狀態</p>
                </div>
              </div>
            </v-card>
          </div>

          <!-- v-loading directive 自訂 -->
          <div class="mb-10">
            <div class="mb-4 section-title">使用 v-loading (自訂選項)</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">可以自訂顏色、大小、文字、背景等選項</div>
              <v-btn color="error" class="mb-4" @click="toggleCustomLoading">
                <v-icon start>{{ isCustomLoading ? "mdi-stop" : "mdi-play" }}</v-icon>
                {{ isCustomLoading ? "隱藏" : "顯示" }} 自訂 Loading
              </v-btn>
              <div v-loading="customLoadingOptions" class="loading-demo-box">
                <div class="pa-6">
                  <p class="mb-2">這是使用自訂選項的 v-loading</p>
                  <p>可以自訂顏色、大小、文字等</p>
                </div>
              </div>
            </v-card>
          </div>

          <!-- 實際應用場景 -->
          <div class="mb-10">
            <div class="mb-4 section-title">實際應用場景：資料載入</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">模擬實際的資料載入場景</div>
              <v-btn color="primary" :disabled="isLoadingData" class="mb-4" @click="loadData">
                <v-icon start>mdi-download</v-icon>
                載入資料
              </v-btn>
              <div
                v-loading="isLoadingData ? { text: '正在載入資料...', color: 'success' } : false"
                class="loading-demo-box"
                style="min-height: 300px"
              >
                <div class="pa-4">
                  <v-data-table
                    v-if="tableData.length > 0"
                    :headers="loadingTableHeaders"
                    :items="tableData"
                    :items-per-page="5"
                  ></v-data-table>
                  <div v-else class="py-8 text-center text-grey">點擊按鈕載入資料</div>
                </div>
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- 全屏 Loading -->
    <Loading
      :loading="isFullscreenLoading"
      :text="fullscreenLoadingText"
      :color="fullscreenLoadingText ? 'secondary' : 'primary'"
      :size="fullscreenLoadingText ? 60 : 50"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from "vue"
import Loading from "@/components/Loading.vue"

// Loading 相關邏輯
// 全屏 loading 示範
const isFullscreenLoading = ref(false)
const fullscreenLoadingText = ref("")
let fullscreenLoadingTimer: ReturnType<typeof setTimeout> | null = null

const showFullscreenLoading = () => {
  // 清除之前的計時器
  if (fullscreenLoadingTimer) {
    clearTimeout(fullscreenLoadingTimer)
  }

  isFullscreenLoading.value = true
  fullscreenLoadingText.value = ""
  fullscreenLoadingTimer = setTimeout(() => {
    isFullscreenLoading.value = false
    fullscreenLoadingTimer = null
  }, 3000)
}

const showFullscreenLoadingWithText = () => {
  // 清除之前的計時器
  if (fullscreenLoadingTimer) {
    clearTimeout(fullscreenLoadingTimer)
  }

  isFullscreenLoading.value = true
  fullscreenLoadingText.value = "載入中，請稍候..."
  fullscreenLoadingTimer = setTimeout(() => {
    isFullscreenLoading.value = false
    fullscreenLoadingTimer = null
  }, 3000)
}

// 使用組件的 inline loading 示範
const isComponentInlineLoading = ref(false)
let componentInlineLoadingTimer: ReturnType<typeof setTimeout> | null = null

const showComponentInlineLoading = () => {
  isComponentInlineLoading.value = !isComponentInlineLoading.value

  if (isComponentInlineLoading.value) {
    // 清除之前的計時器
    if (componentInlineLoadingTimer) {
      clearTimeout(componentInlineLoadingTimer)
    }

    componentInlineLoadingTimer = setTimeout(() => {
      isComponentInlineLoading.value = false
      componentInlineLoadingTimer = null
    }, 3000)
  } else {
    // 如果手動關閉，也要清除計時器
    if (componentInlineLoadingTimer) {
      clearTimeout(componentInlineLoadingTimer)
      componentInlineLoadingTimer = null
    }
  }
}

// Directive loading 示範
const isDirectiveLoading = ref(false)
let directiveLoadingTimer: ReturnType<typeof setTimeout> | null = null

const toggleDirectiveLoading = () => {
  isDirectiveLoading.value = !isDirectiveLoading.value

  if (isDirectiveLoading.value) {
    // 清除之前的計時器
    if (directiveLoadingTimer) {
      clearTimeout(directiveLoadingTimer)
    }

    directiveLoadingTimer = setTimeout(() => {
      isDirectiveLoading.value = false
      directiveLoadingTimer = null
    }, 3000)
  } else {
    // 如果手動關閉，也要清除計時器
    if (directiveLoadingTimer) {
      clearTimeout(directiveLoadingTimer)
      directiveLoadingTimer = null
    }
  }
}

// 自訂 loading 選項
const isCustomLoading = ref(false)
let customLoadingTimer: ReturnType<typeof setTimeout> | null = null

const customLoadingOptions = computed(() => {
  if (!isCustomLoading.value) return false
  return {
    text: "自訂載入效果...",
    color: "error",
    textColor: "#f44336",
    size: 70,
    width: 6,
    background: "rgba(255, 235, 238, 0.95)"
  }
})

const toggleCustomLoading = () => {
  isCustomLoading.value = !isCustomLoading.value

  if (isCustomLoading.value) {
    // 清除之前的計時器
    if (customLoadingTimer) {
      clearTimeout(customLoadingTimer)
    }

    customLoadingTimer = setTimeout(() => {
      isCustomLoading.value = false
      customLoadingTimer = null
    }, 3000)
  } else {
    // 如果手動關閉，也要清除計時器
    if (customLoadingTimer) {
      clearTimeout(customLoadingTimer)
      customLoadingTimer = null
    }
  }
}

// 實際應用場景：資料載入
const isLoadingData = ref(false)
const tableData = ref<Array<{ id: number; name: string; status: string }>>([])

const loadingTableHeaders = [
  { title: "ID", key: "id" },
  { title: "名稱", key: "name" },
  { title: "狀態", key: "status" }
]

const loadData = async () => {
  // 如果正在載入中，不重複執行
  if (isLoadingData.value) {
    return
  }

  isLoadingData.value = true
  tableData.value = []

  try {
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 2000))

    tableData.value = [
      { id: 1, name: "項目 1", status: "已完成" },
      { id: 2, name: "項目 2", status: "進行中" },
      { id: 3, name: "項目 3", status: "待處理" },
      { id: 4, name: "項目 4", status: "已完成" },
      { id: 5, name: "項目 5", status: "已完成" }
    ]
  } finally {
    isLoadingData.value = false
  }
}

// 組件卸載時清理所有計時器
onUnmounted(() => {
  if (fullscreenLoadingTimer) {
    clearTimeout(fullscreenLoadingTimer)
  }
  if (componentInlineLoadingTimer) {
    clearTimeout(componentInlineLoadingTimer)
  }
  if (directiveLoadingTimer) {
    clearTimeout(directiveLoadingTimer)
  }
  if (customLoadingTimer) {
    clearTimeout(customLoadingTimer)
  }
})
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212121;
  letter-spacing: -0.01em;
}

.gap-3 {
  gap: 12px;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Consolas", monospace;
  font-size: 0.875rem;
}

.loading-demo-box {
  position: relative;
  min-height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
