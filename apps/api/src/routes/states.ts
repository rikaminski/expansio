import { Hono } from 'hono'

const states = new Hono()

// Inline enriched GeoJSON state data
const STATE_DATA = [
	{
		uf: 'AC',
		name: 'Acre',
		region: 'Norte',
		population: 906876,
		gdpPerCapita: 18500,
		averageIncome: 1850,
		potentialScore: 25,
	},
	{
		uf: 'AL',
		name: 'Alagoas',
		region: 'Nordeste',
		population: 3351543,
		gdpPerCapita: 16200,
		averageIncome: 1620,
		potentialScore: 35,
	},
	{
		uf: 'AP',
		name: 'Amapá',
		region: 'Norte',
		population: 877613,
		gdpPerCapita: 20100,
		averageIncome: 2010,
		potentialScore: 22,
	},
	{
		uf: 'AM',
		name: 'Amazonas',
		region: 'Norte',
		population: 4207714,
		gdpPerCapita: 22800,
		averageIncome: 2280,
		potentialScore: 40,
	},
	{
		uf: 'BA',
		name: 'Bahia',
		region: 'Nordeste',
		population: 14930634,
		gdpPerCapita: 20300,
		averageIncome: 2030,
		potentialScore: 58,
	},
	{
		uf: 'CE',
		name: 'Ceará',
		region: 'Nordeste',
		population: 9187103,
		gdpPerCapita: 18900,
		averageIncome: 1890,
		potentialScore: 52,
	},
	{
		uf: 'DF',
		name: 'Distrito Federal',
		region: 'Centro-Oeste',
		population: 3094325,
		gdpPerCapita: 90600,
		averageIncome: 6500,
		potentialScore: 72,
	},
	{
		uf: 'ES',
		name: 'Espírito Santo',
		region: 'Sudeste',
		population: 4108508,
		gdpPerCapita: 35200,
		averageIncome: 3000,
		potentialScore: 55,
	},
	{
		uf: 'GO',
		name: 'Goiás',
		region: 'Centro-Oeste',
		population: 7206589,
		gdpPerCapita: 36500,
		averageIncome: 2800,
		potentialScore: 60,
	},
	{
		uf: 'MA',
		name: 'Maranhão',
		region: 'Nordeste',
		population: 7153262,
		gdpPerCapita: 13500,
		averageIncome: 1350,
		potentialScore: 38,
	},
	{
		uf: 'MT',
		name: 'Mato Grosso',
		region: 'Centro-Oeste',
		population: 3567234,
		gdpPerCapita: 52300,
		averageIncome: 3200,
		potentialScore: 55,
	},
	{
		uf: 'MS',
		name: 'Mato Grosso do Sul',
		region: 'Centro-Oeste',
		population: 2839188,
		gdpPerCapita: 42100,
		averageIncome: 3000,
		potentialScore: 50,
	},
	{
		uf: 'MG',
		name: 'Minas Gerais',
		region: 'Sudeste',
		population: 21292666,
		gdpPerCapita: 32100,
		averageIncome: 2800,
		potentialScore: 78,
	},
	{
		uf: 'PA',
		name: 'Pará',
		region: 'Norte',
		population: 8777124,
		gdpPerCapita: 19800,
		averageIncome: 1800,
		potentialScore: 45,
	},
	{
		uf: 'PB',
		name: 'Paraíba',
		region: 'Nordeste',
		population: 4059905,
		gdpPerCapita: 17600,
		averageIncome: 1760,
		potentialScore: 38,
	},
	{
		uf: 'PR',
		name: 'Paraná',
		region: 'Sul',
		population: 11597484,
		gdpPerCapita: 43800,
		averageIncome: 3200,
		potentialScore: 75,
	},
	{
		uf: 'PE',
		name: 'Pernambuco',
		region: 'Nordeste',
		population: 9674793,
		gdpPerCapita: 20800,
		averageIncome: 2080,
		potentialScore: 55,
	},
	{
		uf: 'PI',
		name: 'Piauí',
		region: 'Nordeste',
		population: 3289290,
		gdpPerCapita: 15400,
		averageIncome: 1540,
		potentialScore: 30,
	},
	{
		uf: 'RJ',
		name: 'Rio de Janeiro',
		region: 'Sudeste',
		population: 17463349,
		gdpPerCapita: 46200,
		averageIncome: 3500,
		potentialScore: 82,
	},
	{
		uf: 'RN',
		name: 'Rio Grande do Norte',
		region: 'Nordeste',
		population: 3560903,
		gdpPerCapita: 19700,
		averageIncome: 1970,
		potentialScore: 40,
	},
	{
		uf: 'RS',
		name: 'Rio Grande do Sul',
		region: 'Sul',
		population: 11466630,
		gdpPerCapita: 44500,
		averageIncome: 3300,
		potentialScore: 74,
	},
	{
		uf: 'RO',
		name: 'Rondônia',
		region: 'Norte',
		population: 1815278,
		gdpPerCapita: 30200,
		averageIncome: 2200,
		potentialScore: 32,
	},
	{
		uf: 'RR',
		name: 'Roraima',
		region: 'Norte',
		population: 652713,
		gdpPerCapita: 24500,
		averageIncome: 2100,
		potentialScore: 18,
	},
	{
		uf: 'SC',
		name: 'Santa Catarina',
		region: 'Sul',
		population: 7338473,
		gdpPerCapita: 48700,
		averageIncome: 3500,
		potentialScore: 72,
	},
	{
		uf: 'SP',
		name: 'São Paulo',
		region: 'Sudeste',
		population: 46649132,
		gdpPerCapita: 54350,
		averageIncome: 4250,
		potentialScore: 92,
	},
	{
		uf: 'SE',
		name: 'Sergipe',
		region: 'Nordeste',
		population: 2338474,
		gdpPerCapita: 19100,
		averageIncome: 1910,
		potentialScore: 30,
	},
	{
		uf: 'TO',
		name: 'Tocantins',
		region: 'Norte',
		population: 1607363,
		gdpPerCapita: 24800,
		averageIncome: 2100,
		potentialScore: 28,
	},
]

// Simplified GeoJSON boundaries (centroids only — real boundaries loaded separately)
const STATE_COORDS: Record<string, [number, number]> = {
	AC: [-9.02, -70.81],
	AL: [-9.57, -36.78],
	AP: [1.41, -51.77],
	AM: [-3.47, -65.1],
	BA: [-12.97, -41.68],
	CE: [-5.2, -39.53],
	DF: [-15.78, -47.93],
	ES: [-19.19, -40.34],
	GO: [-15.98, -49.86],
	MA: [-5.42, -45.44],
	MT: [-12.64, -55.42],
	MS: [-20.51, -54.54],
	MG: [-18.51, -44.55],
	PA: [-3.79, -52.48],
	PB: [-7.28, -36.72],
	PR: [-24.89, -51.55],
	PE: [-8.38, -37.86],
	PI: [-7.72, -42.73],
	RJ: [-22.25, -42.66],
	RN: [-5.81, -36.59],
	RS: [-29.75, -53.68],
	RO: [-10.83, -63.34],
	RR: [1.99, -61.33],
	SC: [-27.45, -50.95],
	SP: [-22.19, -48.79],
	SE: [-10.57, -37.45],
	TO: [-10.18, -48.33],
}

states.get('/', (c) => {
	return c.json(STATE_DATA)
})

states.get('/geojson', async (c) => {
	// Load the full GeoJSON from file
	const file = Bun.file(new URL('../data/brazil-states.geojson', import.meta.url).pathname)
	const exists = await file.exists()

	if (exists) {
		const geojson = await file.json()
		return c.json(geojson)
	}

	// Fallback: generate simple point-based GeoJSON
	const features = STATE_DATA.map((s) => ({
		type: 'Feature' as const,
		properties: s,
		geometry: {
			type: 'Point' as const,
			coordinates: STATE_COORDS[s.uf] ? [STATE_COORDS[s.uf][1], STATE_COORDS[s.uf][0]] : [0, 0],
		},
	}))

	return c.json({
		type: 'FeatureCollection',
		features,
	})
})

export default states
