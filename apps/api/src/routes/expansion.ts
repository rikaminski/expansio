import { Hono } from 'hono'
import { branches } from '../data/branches'
import { companies } from '../data/companies'
import { applyFilters } from '../lib/filters'

const expansionRoute = new Hono()

// States that have branches
const BRANCH_STATES = new Set(branches.map((b) => b.uf))

expansionRoute.get('/', (c) => {
	const filtered = applyFilters(companies, new URL(c.req.url).searchParams)

	// Count filtered companies per state
	const companiesByState: Record<string, number> = {}
	for (const company of filtered) {
		companiesByState[company.uf] = (companiesByState[company.uf] || 0) + 1
	}

	// State data for similarity calculation
	const STATE_INFO: Record<string, { population: number; gdpPerCapita: number }> = {
		AC: { population: 906876, gdpPerCapita: 18500 },
		AL: { population: 3351543, gdpPerCapita: 16200 },
		AP: { population: 877613, gdpPerCapita: 20100 },
		AM: { population: 4207714, gdpPerCapita: 22800 },
		BA: { population: 14930634, gdpPerCapita: 20300 },
		CE: { population: 9187103, gdpPerCapita: 18900 },
		DF: { population: 3094325, gdpPerCapita: 90600 },
		ES: { population: 4108508, gdpPerCapita: 35200 },
		GO: { population: 7206589, gdpPerCapita: 36500 },
		MA: { population: 7153262, gdpPerCapita: 13500 },
		MT: { population: 3567234, gdpPerCapita: 52300 },
		MS: { population: 2839188, gdpPerCapita: 42100 },
		MG: { population: 21292666, gdpPerCapita: 32100 },
		PA: { population: 8777124, gdpPerCapita: 19800 },
		PB: { population: 4059905, gdpPerCapita: 17600 },
		PR: { population: 11597484, gdpPerCapita: 43800 },
		PE: { population: 9674793, gdpPerCapita: 20800 },
		PI: { population: 3289290, gdpPerCapita: 15400 },
		RJ: { population: 17463349, gdpPerCapita: 46200 },
		RN: { population: 3560903, gdpPerCapita: 19700 },
		RS: { population: 11466630, gdpPerCapita: 44500 },
		RO: { population: 1815278, gdpPerCapita: 30200 },
		RR: { population: 652713, gdpPerCapita: 24500 },
		SC: { population: 7338473, gdpPerCapita: 48700 },
		SP: { population: 46649132, gdpPerCapita: 54350 },
		SE: { population: 2338474, gdpPerCapita: 19100 },
		TO: { population: 1607363, gdpPerCapita: 24800 },
	}

	// Calculate average profile of states WITH branches
	const branchStateUfs = [...BRANCH_STATES]
	let avgDensity = 0
	let avgGdp = 0
	let avgPop = 0

	for (const uf of branchStateUfs) {
		const info = STATE_INFO[uf]
		const count = companiesByState[uf] || 0
		avgDensity += count / info.population
		avgGdp += info.gdpPerCapita
		avgPop += info.population
	}

	avgDensity /= branchStateUfs.length
	avgGdp /= branchStateUfs.length
	avgPop /= branchStateUfs.length

	// Calculate similarity for states WITHOUT branches
	const scores: { uf: string; similarity: number }[] = []

	for (const [uf, info] of Object.entries(STATE_INFO)) {
		if (BRANCH_STATES.has(uf)) continue

		const count = companiesByState[uf] || 0
		const density = count / info.population

		const densitySim = 1 - Math.min(Math.abs(density - avgDensity) / (avgDensity || 1), 1)
		const gdpSim = 1 - Math.min(Math.abs(info.gdpPerCapita - avgGdp) / (avgGdp || 1), 1)
		const popSim = 1 - Math.min(Math.abs(info.population - avgPop) / (avgPop || 1), 1)

		const similarity = Math.round((densitySim * 0.5 + gdpSim * 0.3 + popSim * 0.2) * 100)

		if (similarity > 30) {
			scores.push({ uf, similarity })
		}
	}

	scores.sort((a, b) => b.similarity - a.similarity)

	return c.json(scores)
})

export default expansionRoute
