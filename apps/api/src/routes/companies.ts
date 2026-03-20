import { Hono } from 'hono'
import { companies } from '../data/companies'
import { applyFilters } from '../lib/filters'

const companiesRoute = new Hono()

companiesRoute.get('/count', (c) => {
	const filtered = applyFilters(companies, new URL(c.req.url).searchParams)
	return c.json({
		total: companies.length,
		filtered: filtered.length,
	})
})

companiesRoute.get('/by-state', (c) => {
	const filtered = applyFilters(companies, new URL(c.req.url).searchParams)
	const counts: Record<string, number> = {}
	for (const company of filtered) {
		counts[company.uf] = (counts[company.uf] || 0) + 1
	}
	return c.json(counts)
})

export default companiesRoute
