import type { FilterState } from '@expansio/shared'
import { useCallback, useState } from 'react'

export type VisualizationMode = 'marketPotential' | 'expansion' | 'none'

export interface MapState {
	visualization: VisualizationMode
	markers: Set<'branches' | 'competition' | 'demand'>
	selectedUf: string | null
	filters: FilterState
}

const DEFAULT_FILTERS: FilterState = {
	sectors: [],
	portes: [],
	revenueRanges: [],
	regions: [],
}

export function useMapState() {
	const [visualization, setVisualization] = useState<VisualizationMode>('marketPotential')
	const [markers, setMarkers] = useState<Set<'branches' | 'competition' | 'demand'>>(
		() => new Set(['branches']),
	)
	const [selectedUf, setSelectedUf] = useState<string | null>(null)
	const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

	const toggleMarker = useCallback((marker: 'branches' | 'competition' | 'demand') => {
		setMarkers((prev) => {
			const next = new Set(prev)
			if (next.has(marker)) next.delete(marker)
			else next.add(marker)
			return next
		})
	}, [])

	const toggleSelectedUf = useCallback((uf: string) => {
		setSelectedUf((prev) => (prev === uf ? null : uf))
	}, [])

	const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}, [])

	const resetFilters = useCallback(() => {
		setFilters(DEFAULT_FILTERS)
	}, [])

	return {
		visualization,
		setVisualization,
		markers,
		toggleMarker,
		selectedUf,
		setSelectedUf,
		toggleSelectedUf,
		filters,
		updateFilter,
		resetFilters,
	}
}
