<template>
  <div class="w-full h-full">
    <v-container fluid class="w-full pa-6">
      <v-card flat class="rounded-lg">
        <v-card-title class="text-h5 pa-6"> Input 輸入框 </v-card-title>

        <v-card-text class="pa-6">
          <div class="mb-4 text-body-2 text-grey-darken-1">
            Element Plus 風格的 Input 組件，支援多種輸入類型和豐富的功能
          </div>

          <!-- 基礎用法 -->
          <div class="mb-10">
            <div class="mb-4 section-title">基礎用法</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">基本的輸入框使用</div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input v-model="inputBasic" placeholder="請輸入內容" style="width: 300px" />
                <div class="text-caption text-grey">輸入值: {{ inputBasic }}</div>
              </div>
            </v-card>
          </div>

          <!-- 禁用狀態 -->
          <div class="mb-10">
            <div class="mb-4 section-title">禁用狀態</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">通過 disabled 屬性指定是否禁用</div>
              <Input v-model="inputDisabled" placeholder="禁用狀態" disabled style="width: 300px" />
            </v-card>
          </div>

          <!-- 一鍵清空 -->
          <div class="mb-10">
            <div class="mb-4 section-title">一鍵清空</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">使用 clearable 屬性即可得到一個可清空的輸入框</div>
              <Input v-model="inputClearable" placeholder="請輸入內容" clearable style="width: 300px" />
            </v-card>
          </div>

          <!-- 密碼框 -->
          <div class="mb-10">
            <div class="mb-4 section-title">密碼框</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                使用 show-password 屬性即可得到一個可切換顯示隱藏的密碼框
              </div>
              <Input
                v-model="inputPassword"
                type="password"
                placeholder="請輸入密碼"
                show-password
                style="width: 300px"
              />
            </v-card>
          </div>

          <!-- 帶圖標的輸入框 -->
          <div class="mb-10">
            <div class="mb-4 section-title">帶圖標的輸入框</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">帶有圖標標記輸入類型</div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input v-model="inputIcon1" placeholder="選擇日期" prefix-icon="mdi-calendar" style="width: 300px" />
                <Input v-model="inputIcon2" placeholder="搜尋內容" suffix-icon="mdi-magnify" style="width: 300px" />
              </div>
            </v-card>
          </div>

          <!-- 格式化 -->
          <div class="mb-10">
            <div class="mb-4 section-title">格式化</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                在 formatter 的情況下顯示值，我們通常同時使用 parser
              </div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input
                  v-model="inputFormatter"
                  placeholder="請輸入內容"
                  :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  style="width: 240px"
                />
                <div class="text-caption text-grey">原始值: {{ inputFormatter }}</div>
              </div>
            </v-card>
          </div>

          <!-- 文本域 -->
          <div class="mb-10">
            <div class="mb-4 section-title">文本域</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">用於輸入多行文本信息</div>
              <Input
                v-model="inputTextarea"
                type="textarea"
                :autosize="{ minRows: 2 }"
                placeholder="請輸入內容"
                style="width: 100%; max-width: 600px"
              />
            </v-card>
          </div>

          <!-- 自適應文本域 -->
          <div class="mb-10">
            <div class="mb-4 section-title">自適應文本域</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">
                設置 autosize 屬性使得根據內容自動調整的高度。你可以給 autosize 提供一個包含有最大和最小高度的對象
              </div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input
                  v-model="inputAutosize1"
                  type="textarea"
                  autosize
                  placeholder="請輸入內容"
                  style="width: 100%; max-width: 600px"
                />
                <Input
                  v-model="inputAutosize2"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="請輸入內容"
                  style="width: 100%; max-width: 600px"
                />
              </div>
            </v-card>
          </div>

          <!-- 複合型輸入框 -->
          <div class="mb-10">
            <div class="mb-4 section-title">複合型輸入框</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">可以在輸入框前置或後置元素</div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input v-model="inputPrepend" placeholder="請輸入內容" style="width: 100%; max-width: 600px">
                  <template #prepend>Http://</template>
                </Input>
                <Input v-model="inputAppend" placeholder="請輸入內容" style="width: 100%; max-width: 600px">
                  <template #append>.com</template>
                </Input>
                <Input v-model="inputBoth" placeholder="請輸入內容" style="width: 100%; max-width: 600px">
                  <template #prepend>Http://</template>
                  <template #append>.com</template>
                </Input>
              </div>
            </v-card>
          </div>

          <!-- 尺寸 -->
          <div class="mb-10">
            <div class="mb-4 section-title">尺寸</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">提供三種不同尺寸的輸入框</div>
              <div class="flex-wrap gap-3 d-flex flex-column align-start">
                <Input v-model="inputSize1" size="large" placeholder="大尺寸" style="width: 300px" />
                <Input v-model="inputSize2" placeholder="默認尺寸" style="width: 300px" />
                <Input v-model="inputSize3" size="small" placeholder="小尺寸" style="width: 300px" />
              </div>
            </v-card>
          </div>

          <!-- 輸入長度限制 -->
          <div class="mb-10">
            <div class="mb-4 section-title">輸入長度限制</div>
            <v-card variant="outlined" class="rounded-lg pa-6">
              <div class="mb-4 text-body-2 text-grey-darken-1">使用 maxlength 和 show-word-limit 屬性</div>
              <div class="flex-wrap gap-3 d-flex flex-column">
                <Input
                  v-model="inputLimit1"
                  placeholder="請輸入內容"
                  :maxlength="10"
                  show-word-limit
                  style="width: 300px"
                />
                <Input
                  v-model="inputLimit2"
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  placeholder="請輸入內容"
                  :maxlength="50"
                  show-word-limit
                  style="width: 100%; max-width: 600px"
                />
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Input from "@/components/Input.vue"

// Input 相關邏輯
const inputBasic = ref("")
const inputDisabled = ref("禁用狀態的內容")
const inputClearable = ref("")
const inputPassword = ref("")
const inputIcon1 = ref("")
const inputIcon2 = ref("")
const inputFormatter = ref("")
const inputTextarea = ref("")
const inputAutosize1 = ref("")
const inputAutosize2 = ref("")
const inputPrepend = ref("")
const inputAppend = ref("")
const inputBoth = ref("")
const inputSize1 = ref("")
const inputSize2 = ref("")
const inputSize3 = ref("")
const inputLimit1 = ref("")
const inputLimit2 = ref("")
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
</style>
