import { Hono } from 'hono'
import { cors } from 'hono/cors'
import branchesRoute from './routes/branches'
import companies from './routes/companies'
import competitorsRoute from './routes/competitors'
import demand from './routes/demand'
import expansion from './routes/expansion'
import states from './routes/states'

const app = new Hono()

app.use('*', cors())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Routes
app.route('/states', states)
app.route('/companies', companies)
app.route('/branches', branchesRoute)
app.route('/competitors', competitorsRoute)
app.route('/expansion', expansion)
app.route('/demand', demand)

// Local dev (Bun)
if (typeof Bun !== 'undefined') {
	Bun.serve({
		port: Number(Bun.env.API_PORT) || 4000,
		fetch: app.fetch,
	})
}

// Cloudflare Workers
export default app
