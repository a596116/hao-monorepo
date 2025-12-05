<template>
  <div class="w-full h-full">
    <v-container fluid class="w-full pa-6">
      <v-card flat class="rounded-lg">
        <v-card-title class="text-h5 pa-6"> 日期時間選擇組件 </v-card-title>

        <v-card-text class="pa-6">
          <div class="mb-4 text-body-2 text-grey-darken-1">
            獨立的 DatePicker 和 TimePicker 組件，DatePicker 支援單一與範圍選擇（範圍模式使用合併輸入框）。
          </div>

          <!-- DatePicker - 單一日期 -->
          <v-card variant="outlined" class="mb-6 rounded-lg pa-6">
            <div class="mb-4 section-title">DatePicker - 單一日期</div>
            <DatePicker v-model="singleDate" label="選擇日期" format="YYYY-MM-DD" />
            <div class="mt-4 text-caption text-grey">當前值：{{ singleDate || "—" }}</div>
          </v-card>

          <!-- DatePicker - 日期範圍 -->
          <v-card variant="outlined" class="mb-6 rounded-lg pa-6">
            <div class="mb-4 section-title">DatePicker - 日期範圍</div>
            <DatePicker v-model="dateRange" range start-label="開始日期" end-label="結束日期" format="YYYY-MM-DD" />
            <div class="mt-4 text-caption text-grey">
              當前值：{{ dateRange ? `${dateRange.start} ~ ${dateRange.end}` : "—" }}
            </div>
          </v-card>

          <!-- TimePicker - 單一時間 -->
          <v-card variant="outlined" class="mb-6 rounded-lg pa-6">
            <div class="mb-4 section-title">TimePicker - 單一時間</div>
            <TimePicker v-model="singleTime" label="選擇時間" format="HH:mm" />
            <div class="mt-4 text-caption text-grey">當前值：{{ singleTime || "—" }}</div>
          </v-card>

          <!-- 組合使用：日期 + 時間 -->
          <v-card variant="outlined" class="mb-6 rounded-lg pa-6">
            <div class="mb-4 section-title">組合使用：日期 + 時間</div>
            <div class="flex-wrap gap-4 d-flex align-start">
              <DatePicker v-model="combinedDate" label="選擇日期" width="240px" />
              <TimePicker v-model="combinedTime" label="選擇時間" width="200px" />
            </div>
            <div class="mt-4 text-caption text-grey">完整時間：{{ fullDateTime || "—" }}</div>
          </v-card>

          <!-- 日期範圍 + 時間 -->
          <v-card variant="outlined" class="rounded-lg pa-6">
            <div class="mb-4 section-title">組合使用：日期範圍 + 時間</div>
            <div class="flex-wrap gap-4 d-flex align-start">
              <DatePicker v-model="rangeDate" range start-label="開始日期" end-label="結束日期" width="240px" />
              <TimePicker v-model="rangeTime" label="時間" width="200px" />
            </div>
            <div class="mt-4 text-caption text-grey">
              <div v-if="rangeDate && rangeTime">開始時間：{{ rangeDate.start }} {{ rangeTime }}</div>
              <div v-if="rangeDate && rangeTime">結束時間：{{ rangeDate.end }} {{ rangeTime }}</div>
              <div v-if="!rangeDate || !rangeTime">請選擇日期範圍和時間</div>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import DatePicker from "@/components/DatePicker.vue"
import TimePicker from "@/components/TimePicker.vue"

// 單一日期
const singleDate = ref<string | null>(null)

// 日期範圍
const dateRange = ref<{ start: string; end: string } | null>(null)

// 單一時間
const singleTime = ref<string | null>(null)

// 組合：日期 + 時間
const combinedDate = ref<string | null>(null)
const combinedTime = ref<string | null>(null)

const fullDateTime = computed(() => {
  if (!combinedDate.value || !combinedTime.value) return ""
  return `${combinedDate.value} ${combinedTime.value}`
})

// 組合：日期範圍 + 時間
const rangeDate = ref<{ start: string; end: string } | null>(null)
const rangeTime = ref<string | null>(null)
</script>

<style scoped>
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #212121;
  letter-spacing: -0.01em;
}
.gap-4 {
  gap: 16px;
}
</style>
