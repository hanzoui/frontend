<template>
  <div
    v-tooltip.bottom="{
      value: $t('menu.batchCount'),
      showDelay: 600
    }"
    class="batch-count"
    :aria-label="$t('menu.batchCount')"
  >
    <InputNumber
      v-model="batchCount"
      class="h-full w-14"
      :min="minQueueCount"
      :max="maxQueueCount"
      fluid
      show-buttons
      :pt="{
        root: {
          class: 'h-full rounded-l-lg bg-secondary-background'
        },
        pcInputText: {
          root: {
            class:
              'h-full border-secondary-background bg-secondary-background text-sm font-normal tabular-nums text-base-foreground'
          }
        },
        buttonGroup: {
          class: 'h-full bg-secondary-background'
        },
        incrementButton: {
          class:
            'h-full w-6 rounded-tr-none bg-secondary-background border-secondary-background text-base-foreground hover:bg-secondary-background hover:border-secondary-background',
          onmousedown: () => {
            handleClick(true)
          }
        },
        decrementButton: {
          class:
            'h-full w-6 rounded-br-none bg-secondary-background border-secondary-background text-base-foreground hover:bg-secondary-background hover:border-secondary-background',
          onmousedown: () => {
            handleClick(false)
          }
        }
      }"
    >
      <template #incrementicon>
        <svg
          class="rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0.650391 0.649902L3.65039 3.6499L6.65039 0.649902"
            stroke="#8A8A8A"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
      <template #decrementicon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0.650391 0.649902L3.65039 3.6499L6.65039 0.649902"
            stroke="#8A8A8A"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
    </InputNumber>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'

import { useSettingStore } from '@/platform/settings/settingStore'
import { useQueueSettingsStore } from '@/stores/queueStore'

const queueSettingsStore = useQueueSettingsStore()
const { batchCount } = storeToRefs(queueSettingsStore)
const minQueueCount = 1

const settingStore = useSettingStore()
const maxQueueCount = computed(() =>
  settingStore.get('Comfy.QueueButton.BatchCountLimit')
)

const handleClick = (increment: boolean) => {
  let newCount: number
  if (increment) {
    const originalCount = batchCount.value - 1
    newCount = Math.min(originalCount * 2, maxQueueCount.value)
  } else {
    const originalCount = batchCount.value + 1
    newCount = Math.floor(originalCount / 2)
  }

  batchCount.value = newCount
}
</script>
