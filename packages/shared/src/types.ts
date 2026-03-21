export type Region = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'
export type Sector = 'Varejo' | 'Tecnologia' | 'Saúde' | 'Indústria' | 'Serviços' | 'Educação'
export type Porte = '1-10' | '11-50' | '51-200' | '201-500' | '500+'
export type RevenueRange = '0-100k' | '100k-1M' | '1M-10M' | '10M-50M' | '50M+'
export type LayerType = 'branches' | 'marketPotential' | 'competition' | 'expansion' | 'demand'

export interface State {
	name: string
	uf: string
	region: Region
	population: number
	gdpPerCapita: number
	averageIncome: number
	potentialScore: number
}

export interface Company {
	id: string
	name: string
	sector: Sector
	porte: Porte
	revenue: RevenueRange
	uf: string
	city: string
	lat: number
	lng: number
	foundedAt: string
}

export interface Branch {
	id: string
	name: string
	city: string
	uf: string
	lat: number
	lng: number
	openedAt: string
}

export interface Competitor {
	id: string
	name: string
	city: string
	uf: string
	lat: number
	lng: number
}

export type Period = '12months' | 'all'

export interface FilterState {
	sectors: Sector[]
	portes: Porte[]
	revenueRanges: RevenueRange[]
	regions: Region[]
	period: Period
}

export interface CounterData {
	total: number
	filtered: number
}

export interface ExpansionScore {
	uf: string
	similarity: number
}

export const SECTORS: Sector[] = [
	'Varejo',
	'Tecnologia',
	'Saúde',
	'Indústria',
	'Serviços',
	'Educação',
]

export const PORTES: Porte[] = ['1-10', '11-50', '51-200', '201-500', '500+']

export const REVENUE_RANGES: RevenueRange[] = ['0-100k', '100k-1M', '1M-10M', '10M-50M', '50M+']

export const REGIONS: Region[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

export const STATE_TO_REGION: Record<string, Region> = {
	AC: 'Norte',
	AL: 'Nordeste',
	AP: 'Norte',
	AM: 'Norte',
	BA: 'Nordeste',
	CE: 'Nordeste',
	DF: 'Centro-Oeste',
	ES: 'Sudeste',
	GO: 'Centro-Oeste',
	MA: 'Nordeste',
	MT: 'Centro-Oeste',
	MS: 'Centro-Oeste',
	MG: 'Sudeste',
	PA: 'Norte',
	PB: 'Nordeste',
	PR: 'Sul',
	PE: 'Nordeste',
	PI: 'Nordeste',
	RJ: 'Sudeste',
	RN: 'Nordeste',
	RS: 'Sul',
	RO: 'Norte',
	RR: 'Norte',
	SC: 'Sul',
	SP: 'Sudeste',
	SE: 'Nordeste',
	TO: 'Norte',
}

export const REGION_TO_STATES: Record<Region, string[]> = {
	Norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
	Nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
	'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
	Sudeste: ['ES', 'MG', 'RJ', 'SP'],
	Sul: ['PR', 'RS', 'SC'],
}

export const REVENUE_MIDPOINTS: Record<RevenueRange, number> = {
	'0-100k': 50_000,
	'100k-1M': 550_000,
	'1M-10M': 5_500_000,
	'10M-50M': 30_000_000,
	'50M+': 75_000_000,
}

export const STATE_NAMES: Record<string, string> = {
	AC: 'Acre',
	AL: 'Alagoas',
	AP: 'Amapá',
	AM: 'Amazonas',
	BA: 'Bahia',
	CE: 'Ceará',
	DF: 'Distrito Federal',
	ES: 'Espírito Santo',
	GO: 'Goiás',
	MA: 'Maranhão',
	MT: 'Mato Grosso',
	MS: 'Mato Grosso do Sul',
	MG: 'Minas Gerais',
	PA: 'Pará',
	PB: 'Paraíba',
	PR: 'Paraná',
	PE: 'Pernambuco',
	PI: 'Piauí',
	RJ: 'Rio de Janeiro',
	RN: 'Rio Grande do Norte',
	RS: 'Rio Grande do Sul',
	RO: 'Rondônia',
	RR: 'Roraima',
	SC: 'Santa Catarina',
	SP: 'São Paulo',
	SE: 'Sergipe',
	TO: 'Tocantins',
}
