<template>
  <div class="w-full h-full">
    <v-container fluid class="w-full pa-6">
      <v-card flat class="rounded-lg">
        <v-card-title class="text-h5 pa-6"> Drawer 抽屜 </v-card-title>

        <v-card-text class="pa-6">
          <div class="mb-4 text-body-2 text-grey-darken-1">
            Drawer 組件支持從四個方向（上、下、左、右）打開抽屜，可以自定義寬度、高度和樣式
          </div>

          <!-- 基本用法 -->
          <div class="mb-10">
            <div class="mb-4 section-title">基本用法</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-6">
                <div class="mb-3 text-subtitle-2 font-weight-bold">四個方向</div>
                <div class="flex-wrap gap-3 d-flex">
                  <v-btn color="primary" @click="showLeft = true">
                    <v-icon start>mdi-menu-open</v-icon>
                    左側抽屜
                  </v-btn>
                  <v-btn color="primary" @click="showRight = true">
                    <v-icon start>mdi-menu</v-icon>
                    右側抽屜
                  </v-btn>
                  <v-btn color="primary" @click="showTop = true">
                    <v-icon start>mdi-chevron-up</v-icon>
                    頂部抽屜
                  </v-btn>
                  <v-btn color="primary" @click="showBottom = true">
                    <v-icon start>mdi-chevron-down</v-icon>
                    底部抽屜
                  </v-btn>
                </div>
              </div>
            </v-card>
          </div>

          <!-- 自定義尺寸 -->
          <div class="mb-10">
            <div class="mb-4 section-title">自定義尺寸</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-6">
                <div class="mb-3 text-subtitle-2 font-weight-bold">不同寬度和高度</div>
                <div class="flex-wrap gap-3 d-flex">
                  <v-btn color="success" @click="showCustomLeft = true"> 寬 500px 左側抽屜 </v-btn>
                  <v-btn color="success" @click="showCustomRight = true"> 寬 400px 右側抽屜 </v-btn>
                  <v-btn color="success" @click="showCustomTop = true"> 高 300px 頂部抽屜 </v-btn>
                  <v-btn color="success" @click="showCustomBottom = true"> 高 500px 底部抽屜 </v-btn>
                </div>
              </div>
            </v-card>
          </div>

          <!-- 持久模式 -->
          <div class="mb-10">
            <div class="mb-4 section-title">持久模式</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                設置 <code>persistent</code> 為 <code>true</code> 時，點擊遮罩層不會關閉抽屜
              </div>
              <div class="flex-wrap gap-3 d-flex">
                <v-btn color="warning" @click="showPersistent = true"> 持久模式抽屜 </v-btn>
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Drawer 組件 -->
    <!-- 基本用法 -->
    <Drawer v-model="showLeft" location="left" title="左側抽屜" :width="300">
      <div class="drawer-content-demo">
        <p class="mb-4">這是從左側打開的抽屜</p>
        <v-list>
          <v-list-item prepend-icon="mdi-home" title="首頁"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="個人資料"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="設置"></v-list-item>
        </v-list>
      </div>
    </Drawer>

    <Drawer v-model="showRight" location="right" title="右側抽屜" :width="350">
      <div class="drawer-content-demo">
        <p class="mb-4">這是從右側打開的抽屜</p>
        <v-card variant="outlined" class="mb-4 pa-4">
          <div class="mb-2 text-subtitle-2">通知</div>
          <div class="text-body-2">您有 3 條新消息</div>
        </v-card>
        <v-card variant="outlined" class="pa-4">
          <div class="mb-2 text-subtitle-2">提醒</div>
          <div class="text-body-2">請完成您的個人資料設置</div>
        </v-card>
      </div>
    </Drawer>

    <Drawer v-model="showTop" location="top" title="頂部抽屜" :height="300">
      <div class="drawer-content-demo">
        <p class="mb-4">這是從頂部打開的抽屜</p>
        <v-alert type="info" variant="tonal" class="mb-4"> 這是一個信息提示 </v-alert>
        <v-alert type="success" variant="tonal"> 操作成功完成 </v-alert>
      </div>
    </Drawer>

    <Drawer v-model="showBottom" location="bottom" title="底部抽屜" :height="400">
      <div class="drawer-content-demo">
        <p class="mb-4">這是從底部打開的抽屜</p>
        <v-form>
          <v-text-field label="名稱" variant="outlined" class="mb-3"></v-text-field>
          <v-text-field label="電子郵件" variant="outlined" class="mb-3"></v-text-field>
          <v-textarea label="備註" variant="outlined" rows="3"></v-textarea>
        </v-form>
      </div>
    </Drawer>

    <!-- 自定義尺寸 -->
    <Drawer v-model="showCustomLeft" location="left" title="寬 500px 左側抽屜" :width="500">
      <div class="drawer-content-demo">
        <p>這個抽屜的寬度是 500px</p>
        <v-data-table :headers="tableHeaders" :items="tableItems" item-value="name"></v-data-table>
      </div>
    </Drawer>

    <Drawer v-model="showCustomRight" location="right" title="寬 400px 右側抽屜" :width="400">
      <div class="drawer-content-demo">
        <p>這個抽屜的寬度是 400px</p>
        <v-timeline>
          <v-timeline-item title="步驟 1" subtitle="開始"></v-timeline-item>
          <v-timeline-item title="步驟 2" subtitle="進行中"></v-timeline-item>
          <v-timeline-item title="步驟 3" subtitle="完成"></v-timeline-item>
        </v-timeline>
      </div>
    </Drawer>

    <Drawer v-model="showCustomTop" location="top" title="高 300px 頂部抽屜" :height="300">
      <div class="drawer-content-demo">
        <p>這個抽屜的高度是 300px</p>
        <v-chip-group>
          <v-chip>標籤 1</v-chip>
          <v-chip>標籤 2</v-chip>
          <v-chip>標籤 3</v-chip>
        </v-chip-group>
      </div>
    </Drawer>

    <Drawer v-model="showCustomBottom" location="bottom" title="高 500px 底部抽屜" :height="500">
      <div class="drawer-content-demo">
        <p>這個抽屜的高度是 500px</p>
        <v-card variant="outlined" class="mb-4 pa-4">
          <v-card-title class="mb-2 text-h6">卡片標題</v-card-title>
          <v-card-text>這是卡片內容區域</v-card-text>
        </v-card>
        <v-card variant="outlined" class="pa-4">
          <v-card-title class="mb-2 text-h6">另一個卡片</v-card-title>
          <v-card-text>更多內容可以放在這裡</v-card-text>
        </v-card>
      </div>
    </Drawer>

    <!-- 持久模式 -->
    <Drawer v-model="showPersistent" location="right" title="持久模式抽屜" :width="350" :persistent="true">
      <div class="drawer-content-demo">
        <p class="mb-4">這個抽屜設置了 <code>persistent="true"</code></p>
        <v-alert type="warning" variant="tonal" class="mb-4"> 點擊遮罩層不會關閉此抽屜，只能通過關閉按鈕關閉 </v-alert>
        <v-btn color="primary" block @click="showPersistent = false"> 點擊關閉 </v-btn>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Drawer from "@/components/Drawer.vue"

// 基本用法
const showLeft = ref(false)
const showRight = ref(false)
const showTop = ref(false)
const showBottom = ref(false)

// 自定義尺寸
const showCustomLeft = ref(false)
const showCustomRight = ref(false)
const showCustomTop = ref(false)
const showCustomBottom = ref(false)

// 持久模式
const showPersistent = ref(false)

// 表格數據
const tableHeaders = [
  { title: "名稱", key: "name" },
  { title: "狀態", key: "status" },
  { title: "日期", key: "date" }
]

const tableItems = [
  { name: "項目 1", status: "進行中", date: "2024-01-01" },
  { name: "項目 2", status: "已完成", date: "2024-01-02" },
  { name: "項目 3", status: "待開始", date: "2024-01-03" }
]
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

.drawer-content-demo {
  min-height: 200px;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Consolas", monospace;
  font-size: 0.875rem;
}
</style>
