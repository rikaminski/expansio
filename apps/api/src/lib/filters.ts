import type { Company, Porte, Region, RevenueRange, Sector } from '@expansio/shared'
import { REGION_TO_STATES } from '@expansio/shared'

export function applyFilters(companies: Company[], params: URLSearchParams): Company[] {
	let result = companies

	const sectors = params.get('sector')?.split(',').filter(Boolean) as Sector[] | undefined
	if (sectors?.length) {
		result = result.filter((c) => sectors.includes(c.sector))
	}

	const portes = params.get('porte')?.split(',').filter(Boolean) as Porte[] | undefined
	if (portes?.length) {
		result = result.filter((c) => portes.includes(c.porte))
	}

	const revenues = params.get('revenue')?.split(',').filter(Boolean) as RevenueRange[] | undefined
	if (revenues?.length) {
		result = result.filter((c) => revenues.includes(c.revenue))
	}

	const regions = params.get('region')?.split(',').filter(Boolean) as Region[] | undefined
	if (regions?.length) {
		const ufs = regions.flatMap((r) => REGION_TO_STATES[r] ?? [])
		result = result.filter((c) => ufs.includes(c.uf))
	}

	const period = params.get('period')
	if (period === '12months') {
		// Reference date: 2024-06-01 (mock "today"), 12 months back = 2023-06-01
		const cutoff = '2023-06-01'
		result = result.filter((c) => c.foundedAt >= cutoff)
	}

	return result
}
