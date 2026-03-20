import type { Company, Porte, RevenueRange, Sector } from '@expansio/shared'

// Seeded PRNG (mulberry32) for reproducibility
function mulberry32(seed: number) {
	let s = seed | 0
	return () => {
		s = (s + 0x6d2b79f5) | 0
		let t = Math.imul(s ^ (s >>> 15), 1 | s)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

const rand = mulberry32(42)

function pick<T>(arr: T[]): T {
	return arr[Math.floor(rand() * arr.length)]
}

function weightedPick<T>(items: T[], weights: number[]): T {
	const total = weights.reduce((a, b) => a + b, 0)
	let r = rand() * total
	for (let i = 0; i < items.length; i++) {
		r -= weights[i]
		if (r <= 0) return items[i]
	}
	return items[items.length - 1]
}

// Distribution weighted by population (~850 total)
const STATE_DISTRIBUTION: Record<string, number> = {
	SP: 195,
	MG: 90,
	RJ: 80,
	BA: 58,
	PR: 48,
	RS: 46,
	PE: 40,
	CE: 35,
	PA: 30,
	SC: 30,
	MA: 24,
	GO: 24,
	AM: 18,
	PB: 18,
	ES: 18,
	RN: 16,
	MT: 14,
	AL: 14,
	PI: 12,
	DF: 12,
	MS: 12,
	SE: 10,
	RO: 9,
	TO: 7,
	AC: 5,
	AP: 5,
	RR: 3,
}

// State capitals with coordinates
const CAPITALS: Record<string, { city: string; lat: number; lng: number }> = {
	SP: { city: 'São Paulo', lat: -23.55, lng: -46.63 },
	MG: { city: 'Belo Horizonte', lat: -19.92, lng: -43.94 },
	RJ: { city: 'Rio de Janeiro', lat: -22.91, lng: -43.17 },
	BA: { city: 'Salvador', lat: -12.97, lng: -38.51 },
	PR: { city: 'Curitiba', lat: -25.43, lng: -49.27 },
	RS: { city: 'Porto Alegre', lat: -30.03, lng: -51.23 },
	PE: { city: 'Recife', lat: -8.05, lng: -34.87 },
	CE: { city: 'Fortaleza', lat: -3.72, lng: -38.53 },
	PA: { city: 'Belém', lat: -1.46, lng: -48.5 },
	SC: { city: 'Florianópolis', lat: -27.59, lng: -48.55 },
	MA: { city: 'São Luís', lat: -2.53, lng: -44.28 },
	GO: { city: 'Goiânia', lat: -16.68, lng: -49.25 },
	AM: { city: 'Manaus', lat: -3.12, lng: -60.02 },
	PB: { city: 'João Pessoa', lat: -7.12, lng: -34.86 },
	ES: { city: 'Vitória', lat: -20.32, lng: -40.34 },
	RN: { city: 'Natal', lat: -5.79, lng: -35.21 },
	MT: { city: 'Cuiabá', lat: -15.6, lng: -56.1 },
	AL: { city: 'Maceió', lat: -9.67, lng: -35.74 },
	PI: { city: 'Teresina', lat: -5.09, lng: -42.8 },
	DF: { city: 'Brasília', lat: -15.78, lng: -47.93 },
	MS: { city: 'Campo Grande', lat: -20.44, lng: -54.65 },
	SE: { city: 'Aracaju', lat: -10.91, lng: -37.07 },
	RO: { city: 'Porto Velho', lat: -8.76, lng: -63.9 },
	TO: { city: 'Palmas', lat: -10.18, lng: -48.33 },
	AC: { city: 'Rio Branco', lat: -9.97, lng: -67.81 },
	AP: { city: 'Macapá', lat: 0.03, lng: -51.07 },
	RR: { city: 'Boa Vista', lat: 2.82, lng: -60.67 },
}

// Company name prefixes by sector
const COMPANY_NAMES: Record<Sector, string[]> = {
	Varejo: [
		'Casa Nova',
		'Ponto Certo',
		'Rede Mais',
		'Super Bom',
		'Mega Store',
		'Compre Bem',
		'Loja Popular',
		'Moda Express',
		'Center Shop',
		'Bazar Total',
	],
	Tecnologia: [
		'TechBR',
		'DataSoft',
		'CloudNova',
		'InfoSys',
		'NetWave',
		'DigiTech',
		'CodeHub',
		'ByteForce',
		'DevPrime',
		'CyberCore',
	],
	Saúde: [
		'VidaSaúde',
		'MedCenter',
		'Clínica Bem',
		'FarmaVida',
		'SaúdePlus',
		'BioMed',
		'CarePlus',
		'MedLab',
		'HealthTech',
		'VitalCare',
	],
	Indústria: [
		'MetalBR',
		'FabriPro',
		'IndusTech',
		'ForteMaq',
		'AçoBR',
		'ProdMax',
		'MaquiNova',
		'TecFab',
		'IndConst',
		'ForjaBR',
	],
	Serviços: [
		'ServiPro',
		'ConectaRH',
		'GestãoMax',
		'ContaFácil',
		'CleanPro',
		'LogiExpress',
		'SegurPlan',
		'ConsultBR',
		'FacilServ',
		'ProAtiva',
	],
	Educação: [
		'EduTech',
		'SaberMais',
		'CursoBR',
		'AcademiaPro',
		'EnsinoBR',
		'LearnHub',
		'EduNova',
		'MasterClass',
		'FormaBR',
		'Capacita',
	],
}

const SECTORS: Sector[] = ['Varejo', 'Tecnologia', 'Saúde', 'Indústria', 'Serviços', 'Educação']
const SECTOR_WEIGHTS = [30, 20, 10, 15, 20, 5]

const PORTES: Porte[] = ['1-10', '11-50', '51-200', '201-500', '500+']
const PORTE_WEIGHTS = [25, 30, 25, 15, 5]

// Revenue correlated with porte
const PORTE_REVENUE: Record<Porte, { options: RevenueRange[]; weights: number[] }> = {
	'1-10': { options: ['0-100k', '100k-1M'], weights: [70, 30] },
	'11-50': { options: ['100k-1M', '1M-10M'], weights: [40, 60] },
	'51-200': { options: ['1M-10M', '10M-50M'], weights: [60, 40] },
	'201-500': { options: ['10M-50M', '50M+'], weights: [60, 40] },
	'500+': { options: ['10M-50M', '50M+'], weights: [30, 70] },
}

function generateCompanies(): Company[] {
	const companies: Company[] = []
	let id = 1

	for (const [uf, count] of Object.entries(STATE_DISTRIBUTION)) {
		const capital = CAPITALS[uf]
		for (let i = 0; i < count; i++) {
			const sector = weightedPick(SECTORS, SECTOR_WEIGHTS)
			const porte = weightedPick(PORTES, PORTE_WEIGHTS)
			const revenueConfig = PORTE_REVENUE[porte]
			const revenue = weightedPick(revenueConfig.options, revenueConfig.weights)
			const name = `${pick(COMPANY_NAMES[sector])} ${uf}-${id}`

			companies.push({
				id: `comp-${id}`,
				name,
				sector,
				porte,
				revenue,
				uf,
				city: capital.city,
				lat: capital.lat + (rand() - 0.5) * 2,
				lng: capital.lng + (rand() - 0.5) * 2,
			})
			id++
		}
	}

	return companies
}

export const companies = generateCompanies()
