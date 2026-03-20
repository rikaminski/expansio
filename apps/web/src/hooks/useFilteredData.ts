import type { FilterState } from '@expansio/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCompaniesByState, fetchCompanyCount, fetchDemand, fetchExpansion } from '../lib/api'

function buildParams(filters: FilterState): string {
	const parts: string[] = []
	if (filters.sectors.length) parts.push(`sector=${filters.sectors.join(',')}`)
	if (filters.portes.length) parts.push(`porte=${filters.portes.join(',')}`)
	if (filters.revenueRanges.length) parts.push(`revenue=${filters.revenueRanges.join(',')}`)
	if (filters.regions.length) parts.push(`region=${filters.regions.join(',')}`)
	return parts.join('&')
}

export interface FilteredData {
	total: number
	filtered: number
	stateCompanyCounts: Record<string, number>
	expansionScores: Array<{ uf: string; similarity: number }>
	demandByState: Record<string, number>
	loading: boolean
}

export function useFilteredData(filters: FilterState): FilteredData {
	const [data, setData] = useState<FilteredData>({
		total: 0,
		filtered: 0,
		stateCompanyCounts: {},
		expansionScores: [],
		demandByState: {},
		loading: true,
	})

	const abortRef = useRef<AbortController | null>(null)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const fetchData = useCallback(async (f: FilterState) => {
		// Cancel previous request
		abortRef.current?.abort()
		const controller = new AbortController()
		abortRef.current = controller

		try {
			const params = buildParams(f)
			const [count, byState, expansion, demand] = await Promise.all([
				fetchCompanyCount(params, controller.signal),
				fetchCompaniesByState(params, controller.signal),
				fetchExpansion(params, controller.signal),
				fetchDemand(params, controller.signal),
			])

			if (!controller.signal.aborted) {
				setData({
					total: count.total,
					filtered: count.filtered,
					stateCompanyCounts: byState,
					expansionScores: expansion,
					demandByState: demand,
					loading: false,
				})
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return
			console.error('Failed to fetch filtered data:', err)
		}
	}, [])

	useEffect(() => {
		// Debounce 200ms
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchData(filters), 200)

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [filters, fetchData])

	return data
}
