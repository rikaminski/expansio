import { Hono } from 'hono'
import { competitors } from '../data/competitors'

const competitorsRoute = new Hono()

competitorsRoute.get('/', (c) => {
	const features = competitors.map((cc) => ({
		type: 'Feature' as const,
		properties: {
			id: cc.id,
			name: cc.name,
			city: cc.city,
			uf: cc.uf,
		},
		geometry: {
			type: 'Point' as const,
			coordinates: [cc.lng, cc.lat],
		},
	}))

	return c.json({
		type: 'FeatureCollection',
		features,
	})
})

export default competitorsRoute
