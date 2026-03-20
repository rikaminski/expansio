import { Hono } from 'hono'
import { branches } from '../data/branches'

const branchesRoute = new Hono()

branchesRoute.get('/', (c) => {
	const features = branches.map((b) => ({
		type: 'Feature' as const,
		properties: {
			id: b.id,
			name: b.name,
			city: b.city,
			uf: b.uf,
			openedAt: b.openedAt,
		},
		geometry: {
			type: 'Point' as const,
			coordinates: [b.lng, b.lat],
		},
	}))

	return c.json({
		type: 'FeatureCollection',
		features,
	})
})

export default branchesRoute
