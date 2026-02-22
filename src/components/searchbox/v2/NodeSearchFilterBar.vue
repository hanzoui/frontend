<template>
  <div class="flex items-center gap-2 px-2 py-1.5">
    <Button
      v-for="chip in chips"
      :key="chip.key"
      type="button"
      :variant="chipVariant(chip.key)"
      size="unset"
      :aria-pressed="activeChipKey === chip.key"
      :class="chipExtraClass(chip.key)"
      @click="emit('selectChip', chip)"
    >
      {{ chip.label }}
      <span
        v-if="appliedFilterCounts[chip.key]"
        class="ml-0.5 text-xs opacity-80"
      >
        ({{ appliedFilterCounts[chip.key] }})
      </span>
    </Button>
  </div>
</template>

<script lang="ts">
import type { FuseFilter, FuseFilterWithValue } from '@/utils/fuseUtil'
import type { ComfyNodeDefImpl } from '@/stores/nodeDefStore'

export interface FilterChip {
  key: string
  label: string
  filter: FuseFilter<ComfyNodeDefImpl, string>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Button from '@/components/ui/button/Button.vue'
import type { ButtonVariants } from '@/components/ui/button/button.variants'
import { useNodeDefStore } from '@/stores/nodeDefStore'
import { cn } from '@/utils/tailwindUtil'

const { activeChipKey = null, appliedFilters = [] } = defineProps<{
  activeChipKey?: string | null
  appliedFilters?: FuseFilterWithValue<ComfyNodeDefImpl, string>[]
}>()

const emit = defineEmits<{
  selectChip: [chip: FilterChip]
}>()

const { t } = useI18n()
const nodeDefStore = useNodeDefStore()

const chips = computed<FilterChip[]>(() => {
  const searchService = nodeDefStore.nodeSearchService
  return [
    {
      key: 'input',
      label: t('g.input'),
      filter: searchService.inputTypeFilter
    },
    {
      key: 'output',
      label: t('g.output'),
      filter: searchService.outputTypeFilter
    },
    {
      key: 'source',
      label: t('g.source'),
      filter: searchService.nodeSourceFilter
    }
  ]
})

const appliedFilterCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const filter of appliedFilters) {
    counts[filter.filterDef.id] = (counts[filter.filterDef.id] ?? 0) + 1
  }
  return counts
})

function chipVariant(chipKey: string): ButtonVariants['variant'] {
  return activeChipKey === chipKey ? 'inverted' : 'outline'
}

function chipExtraClass(chipKey: string) {
  const isActive = activeChipKey === chipKey
  const hasApplied = (appliedFilterCounts.value[chipKey] ?? 0) > 0

  return cn(
    'flex-auto px-3 py-1',
    isActive && 'border border-solid border-base-foreground',
    !isActive &&
      hasApplied &&
      'bg-base-foreground/10 border-base-foreground text-base-foreground'
  )
}
</script>
