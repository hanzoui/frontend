import { isPromotedWidgetView } from '@/core/graph/subgraph/promotedWidgetTypes'
import type { LGraphNode } from '@/lib/litegraph/src/litegraph'
import type { SubgraphNode } from '@/lib/litegraph/src/subgraph/SubgraphNode'
import type { IBaseWidget } from '@/lib/litegraph/src/types/widgets'

export interface ResolvedPromotedWidgetSource {
  node: LGraphNode
  widget: IBaseWidget
}

export function resolvePromotedWidgetSource(
  hostNode: LGraphNode,
  widget: IBaseWidget
): ResolvedPromotedWidgetSource | undefined {
  if (!isPromotedWidgetView(widget)) return undefined
  if (!hostNode.isSubgraphNode()) return undefined

  const sourceNode = (hostNode as SubgraphNode).subgraph.getNodeById(
    widget.sourceNodeId
  )
  if (!sourceNode) return undefined

  const sourceWidget = sourceNode.widgets?.find(
    (entry) => entry.name === widget.sourceWidgetName
  )
  if (!sourceWidget) return undefined

  return {
    node: sourceNode,
    widget: sourceWidget
  }
}
