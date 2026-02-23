import { isCloud } from '@/platform/distribution/types'

export const CORE_MENU_COMMANDS = [
  [[], ['Comfy.NewBlankWorkflow']],
  [[], []], // Separator after New
  [['File'], ['Comfy.OpenWorkflow']],
  [
    ['File'],
    [
      'Comfy.SaveWorkflow',
      'Comfy.SaveWorkflowAs',
      'Comfy.ExportWorkflow',
      'Comfy.ExportWorkflowAPI'
    ]
  ],
  [['Edit'], ['Comfy.Undo', 'Comfy.Redo']],
  [
    ['Edit'],
    [
      'Comfy.Canvas.CopySelected',
      'Comfy.Canvas.PasteFromClipboard',
      'Comfy.Canvas.SelectAll'
    ]
  ],
  [['Edit'], ['Comfy.ClearWorkflow']],
  [['Edit'], ['Comfy.OpenClipspace']],
  [
    ['Edit'],
    [
      'Comfy.RefreshNodeDefinitions',
      ...(isCloud
        ? []
        : [
            'Comfy.Memory.UnloadModels',
            'Comfy.Memory.UnloadModelsAndExecutionCache'
          ])
    ]
  ],
  [['View'], []],
  [
    ['Help'],
    [
      'Comfy.Help.OpenHanzo StudioIssues',
      'Comfy.Help.OpenHanzo StudioDocs',
      'Comfy.Help.OpenComfyOrgDiscord',
      'Comfy.Help.OpenHanzo StudioForum'
    ]
  ],
  [['Help'], ['Comfy.Help.AboutHanzo Studio', 'Comfy.ContactSupport']]
]
