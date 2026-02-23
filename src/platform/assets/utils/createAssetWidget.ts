import { fromZodError } from 'zod-validation-error'

import { t } from '@/i18n'
import type { LGraphNode } from '@/lib/litegraph/src/litegraph'
import type {
  IBaseWidget,
  IWidgetAssetOptions
} from '@/lib/litegraph/src/types/widgets'
import { useAssetBrowserDialog } from '@/platform/assets/composables/useAssetBrowserDialog'
import {
  assetFilenameSchema,
  assetItemSchema
} from '@/platform/assets/schemas/assetSchema'
import { useToastStore } from '@/platform/updates/common/toastStore'
import { getAssetFilename } from '@/platform/assets/utils/assetMetadataUtils'

interface CreateAssetWidgetParams {
  /** The node to add the widget to */
  node: LGraphNode
  /** The widget name */
  widgetName: string
  /** The node type to show in asset browser (may differ from node.comfyClass for PrimitiveNode) */
  nodeTypeForBrowser: string
  /** Input name for asset browser filtering (defaults to widgetName if not provided) */
  inputNameForBrowser?: string
  /** Default value for the widget */
  defaultValue?: string
  /** Callback when widget value changes */
  onValueChange?: (
    widget: IBaseWidget,
    newValue: string,
    oldValue: unknown
  ) => void
}

/**
 * Build and attach an asset-selection widget to a LiteGraph node that opens the Asset Browser for choosing an asset.
 *
 * The widget validates the selected asset and its filename, updates the widget value on success, and triggers the optional
 * onValueChange callback. Validation failures are surfaced via console errors and toast notifications.
 *
 * @param params - Configuration for the asset widget (see CreateAssetWidgetParams)
 * @returns The created asset widget attached to the provided node
 */
export function createAssetWidget(
  params: CreateAssetWidgetParams
): IBaseWidget {
  const {
    node,
    widgetName,
    nodeTypeForBrowser,
    inputNameForBrowser,
    defaultValue,
    onValueChange
  } = params

  const displayLabel = defaultValue ?? t('widgets.selectModel')
  const assetBrowserDialog = useAssetBrowserDialog()

  /**
   * Opens the Asset Browser, validates the selected asset and its filename, and updates the provided widget with the validated filename.
   *
   * If the selected asset or its filename fails validation, logs a descriptive error and displays an error toast; on success the widget's value is set to the validated filename and the optional `onValueChange` callback is invoked with the widget, new value, and old value.
   *
   * @param widget - The IBaseWidget instance whose value will be updated and which will be passed to the `onValueChange` callback
   */
  async function openModal(widget: IBaseWidget) {
    const toastStore = useToastStore()

    await assetBrowserDialog.show({
      nodeType: nodeTypeForBrowser,
      inputName: inputNameForBrowser ?? widgetName,
      currentValue: widget.value as string,
      onAssetSelected: (asset) => {
        const validatedAsset = assetItemSchema.safeParse(asset)

        if (!validatedAsset.success) {
          console.error(
            'Invalid asset item:',
            fromZodError(validatedAsset.error).message
          )
          toastStore.add({
            severity: 'error',
            summary: t('assetBrowser.invalidAsset'),
            detail: t('assetBrowser.invalidAssetDetail'),
            life: 5000
          })
          return
        }

        const filename = getAssetFilename(validatedAsset.data)
        const validatedFilename = assetFilenameSchema.safeParse(filename)

        if (!validatedFilename.success) {
          console.error(
            'Invalid asset filename:',
            validatedFilename.error.issues,
            'for asset:',
            validatedAsset.data.id
          )
          toastStore.add({
            severity: 'error',
            summary: t('assetBrowser.invalidFilename'),
            detail: t('assetBrowser.invalidFilenameDetail'),
            life: 5000
          })
          return
        }

        const oldValue = widget.value
        widget.value = validatedFilename.data
        onValueChange?.(widget, validatedFilename.data, oldValue)
      }
    })
  }

  const options: IWidgetAssetOptions = {
    openModal,
    nodeType: nodeTypeForBrowser
  }

  return node.addWidget('asset', widgetName, displayLabel, () => {}, options)
}