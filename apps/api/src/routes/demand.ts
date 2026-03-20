import { REVENUE_MIDPOINTS } from '@expansio/shared'
import { Hono } from 'hono'
import { companies } from '../data/companies'
import { applyFilters } from '../lib/filters'

const demandRoute = new Hono()

demandRoute.get('/', (c) => {
	const filtered = applyFilters(companies, new URL(c.req.url).searchParams)

	const demandByState: Record<string, number> = {}
	for (const company of filtered) {
		const midpoint = REVENUE_MIDPOINTS[company.revenue]
		demandByState[company.uf] = (demandByState[company.uf] || 0) + midpoint
	}

	return c.json(demandByState)
})

export default demandRoute
