const API_BASE = '/api'

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, { signal })
	if (!res.ok) throw new Error(`API error: ${res.status}`)
	return res.json()
}

export function fetchHealth() {
	return fetchJson<{ status: string }>('/health')
}

export function fetchStates() {
	return fetchJson<
		Array<{
			uf: string
			name: string
			region: string
			population: number
			gdpPerCapita: number
			averageIncome: number
			potentialScore: number
		}>
	>('/states')
}

export function fetchStatesGeoJSON(signal?: AbortSignal) {
	return fetchJson<GeoJSON.FeatureCollection>('/states/geojson', signal)
}

export function fetchCompanyCount(params: string, signal?: AbortSignal) {
	return fetchJson<{ total: number; filtered: number }>(`/companies/count?${params}`, signal)
}

export function fetchCompaniesByState(params: string, signal?: AbortSignal) {
	return fetchJson<Record<string, number>>(`/companies/by-state?${params}`, signal)
}

export function fetchBranches(signal?: AbortSignal) {
	return fetchJson<GeoJSON.FeatureCollection>('/branches', signal)
}

export function fetchCompetitors(signal?: AbortSignal) {
	return fetchJson<GeoJSON.FeatureCollection>('/competitors', signal)
}

export function fetchExpansion(params: string, signal?: AbortSignal) {
	return fetchJson<Array<{ uf: string; similarity: number }>>(`/expansion?${params}`, signal)
}

export function fetchDemand(params: string, signal?: AbortSignal) {
	return fetchJson<Record<string, number>>(`/demand?${params}`, signal)
}
