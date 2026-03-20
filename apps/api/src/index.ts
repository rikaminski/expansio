import { Hono } from 'hono'
import { cors } from 'hono/cors'
import branchesRoute from './routes/branches'
import companies from './routes/companies'
import competitorsRoute from './routes/competitors'
import demand from './routes/demand'
import expansion from './routes/expansion'
import states from './routes/states'

const app = new Hono()

const corsOrigins = (Bun.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
	.split(',')
	.map((s: string) => s.trim())

// CORS for frontend
app.use(
	'/*',
	cors({
		origin: corsOrigins,
		allowMethods: ['GET'],
	}),
)

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Routes
app.route('/states', states)
app.route('/companies', companies)
app.route('/branches', branchesRoute)
app.route('/competitors', competitorsRoute)
app.route('/expansion', expansion)
app.route('/demand', demand)

export default {
	port: Number(Bun.env.API_PORT) || 4000,
	fetch: app.fetch,
}
