import { useFieldError } from 'vee-validate'
import { computed, inject } from 'vue'

import {
  FORM_FIELD_NAME_INJECTION_KEY,
  FORM_ITEM_ID_INJECTION_KEY
} from './injectionKeys'

/**
 * Exposes form field identifiers and validation state for a form field component.
 *
 * @returns An object with:
 * - `errorMessage`: a reactive validation message for the injected field name
 * - `formDescriptionId`: the element id for the field description (`<itemId>-form-item-description`)
 * - `formItemId`: the element id for the form item container (`<itemId>-form-item`)
 * - `formMessageId`: the element id for the field validation message (`<itemId>-form-item-message`)
 * - `describedBy`: a computed string listing ids to use for `aria-describedby` (includes the message id when an error exists)
 * - `name`: the injected field name
 *
 * @throws Error if the required injection keys (field name or item id) are not found
 */
export function useFormField() {
  const fieldName = inject(FORM_FIELD_NAME_INJECTION_KEY)
  const itemId = inject(FORM_ITEM_ID_INJECTION_KEY)

  if (!fieldName || !itemId) {
    throw new Error('useFormField must be used within FormField and FormItem')
  }

  const errorMessage = useFieldError(fieldName)
  const formItemId = `${itemId}-form-item`
  const formDescriptionId = `${itemId}-form-item-description`
  const formMessageId = `${itemId}-form-item-message`
  const describedBy = computed(() =>
    errorMessage.value
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId
  )

  return {
    errorMessage,
    formDescriptionId,
    formItemId,
    formMessageId,
    describedBy,
    name: fieldName
  }
}