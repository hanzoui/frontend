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
        <TinyChevronIcon rotate-up />
      </template>
      <template #decrementicon>
        <TinyChevronIcon />
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
import TinyChevronIcon from './TinyChevronIcon.vue'

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
