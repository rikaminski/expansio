import type { FilteredData } from '../hooks/useFilteredData'
import { formatCurrency, formatNumber, formatPercent } from '../lib/format'

interface StateDetailProps {
	uf: string
	data: FilteredData
	onClose: () => void
}

const STATE_NAMES: Record<string, string> = {
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

const STATE_DATA: Record<
	string,
	{ population: number; gdpPerCapita: number; potentialScore: number }
> = {
	AC: { population: 906876, gdpPerCapita: 18500, potentialScore: 25 },
	AL: { population: 3351543, gdpPerCapita: 16200, potentialScore: 35 },
	AP: { population: 877613, gdpPerCapita: 20100, potentialScore: 22 },
	AM: { population: 4207714, gdpPerCapita: 22800, potentialScore: 40 },
	BA: { population: 14930634, gdpPerCapita: 20300, potentialScore: 58 },
	CE: { population: 9187103, gdpPerCapita: 18900, potentialScore: 52 },
	DF: { population: 3094325, gdpPerCapita: 90600, potentialScore: 72 },
	ES: { population: 4108508, gdpPerCapita: 35200, potentialScore: 55 },
	GO: { population: 7206589, gdpPerCapita: 36500, potentialScore: 60 },
	MA: { population: 7153262, gdpPerCapita: 13500, potentialScore: 38 },
	MT: { population: 3567234, gdpPerCapita: 52300, potentialScore: 55 },
	MS: { population: 2839188, gdpPerCapita: 42100, potentialScore: 50 },
	MG: { population: 21292666, gdpPerCapita: 32100, potentialScore: 78 },
	PA: { population: 8777124, gdpPerCapita: 19800, potentialScore: 45 },
	PB: { population: 4059905, gdpPerCapita: 17600, potentialScore: 38 },
	PR: { population: 11597484, gdpPerCapita: 43800, potentialScore: 75 },
	PE: { population: 9674793, gdpPerCapita: 20800, potentialScore: 55 },
	PI: { population: 3289290, gdpPerCapita: 15400, potentialScore: 30 },
	RJ: { population: 17463349, gdpPerCapita: 46200, potentialScore: 82 },
	RN: { population: 3560903, gdpPerCapita: 19700, potentialScore: 40 },
	RS: { population: 11466630, gdpPerCapita: 44500, potentialScore: 74 },
	RO: { population: 1815278, gdpPerCapita: 30200, potentialScore: 32 },
	RR: { population: 652713, gdpPerCapita: 24500, potentialScore: 18 },
	SC: { population: 7338473, gdpPerCapita: 48700, potentialScore: 72 },
	SP: { population: 46649132, gdpPerCapita: 54350, potentialScore: 92 },
	SE: { population: 2338474, gdpPerCapita: 19100, potentialScore: 30 },
	TO: { population: 1607363, gdpPerCapita: 24800, potentialScore: 28 },
}

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
	const pct = Math.min(100, (value / max) * 100)
	return (
		<div className="h-2 w-full overflow-hidden rounded-full bg-surface-100">
			<div
				className="h-full rounded-full transition-all duration-700"
				style={{ width: `${pct}%`, backgroundColor: color }}
			/>
		</div>
	)
}

export default function StateDetail({ uf, data, onClose }: StateDetailProps) {
	const name = STATE_NAMES[uf] || uf
	const stateInfo = STATE_DATA[uf]
	const companyCount = data.stateCompanyCounts[uf] || 0
	const demandValue = data.demandByState[uf] || 0
	const expansionScore = data.expansionScores.find((e) => e.uf === uf)

	const totalFiltered = data.filtered || 1
	const sharePercent = Math.round((companyCount / totalFiltered) * 100)

	return (
		<div className="animate-slide-in flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-display text-lg font-bold text-primary">{name}</h3>
					<span className="text-xs text-surface-300">{uf}</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-300 transition-colors hover:bg-surface-50 hover:text-primary"
				>
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						role="img"
						aria-label="Fechar"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 gap-3">
				<div className="rounded-lg bg-surface-50 p-3">
					<p className="text-xs text-surface-300">Empresas</p>
					<p className="font-display text-xl font-bold text-primary">
						{formatNumber(companyCount)}
					</p>
					<p className="text-[10px] text-surface-300">{sharePercent}% do total</p>
				</div>
				<div className="rounded-lg bg-surface-50 p-3">
					<p className="text-xs text-surface-300">Demanda</p>
					<p className="font-display text-xl font-bold text-purple">
						{formatCurrency(demandValue)}
					</p>
				</div>
				{stateInfo && (
					<>
						<div className="rounded-lg bg-surface-50 p-3">
							<p className="text-xs text-surface-300">População</p>
							<p className="font-display text-xl font-bold text-primary">
								{formatNumber(stateInfo.population)}
							</p>
						</div>
						<div className="rounded-lg bg-surface-50 p-3">
							<p className="text-xs text-surface-300">PIB per capita</p>
							<p className="font-display text-xl font-bold text-primary">
								{formatCurrency(stateInfo.gdpPerCapita)}
							</p>
						</div>
					</>
				)}
			</div>

			{/* Scores */}
			{stateInfo && (
				<div className="flex flex-col gap-3">
					<div>
						<div className="mb-1 flex items-center justify-between">
							<span className="text-xs text-surface-300">Potencial de Mercado</span>
							<span className="text-xs font-semibold text-accent">
								{formatPercent(stateInfo.potentialScore)}
							</span>
						</div>
						<ScoreBar value={stateInfo.potentialScore} color="#2563eb" />
					</div>

					{expansionScore && (
						<div>
							<div className="mb-1 flex items-center justify-between">
								<span className="text-xs text-surface-300">Score de Expansão</span>
								<span className="text-xs font-semibold text-warning">
									{formatPercent(expansionScore.similarity)}
								</span>
							</div>
							<ScoreBar value={expansionScore.similarity} color="#d97706" />
						</div>
					)}
				</div>
			)}

			{/* Insights */}
			<div className="rounded-lg border border-surface-200 p-3">
				<h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-300">
					Insights
				</h4>
				<ul className="flex flex-col gap-1.5 text-xs text-primary/80">
					{companyCount > 50 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-accent">●</span>
							Alto volume de empresas — mercado maduro
						</li>
					)}
					{companyCount <= 50 && companyCount > 0 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-warning">●</span>
							Volume moderado — potencial de crescimento
						</li>
					)}
					{stateInfo && stateInfo.gdpPerCapita > 40000 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-accent">●</span>
							PIB per capita elevado — alto poder de compra
						</li>
					)}
					{stateInfo && stateInfo.gdpPerCapita <= 20000 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-danger">●</span>
							PIB per capita baixo — avaliar viabilidade
						</li>
					)}
					{expansionScore && expansionScore.similarity >= 60 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-warning">●</span>
							Alta similaridade com estados de filiais — bom candidato para expansão
						</li>
					)}
					{demandValue > 1_000_000_000 && (
						<li className="flex items-start gap-2">
							<span className="mt-0.5 text-purple">●</span>
							Demanda acima de R$ 1B — mercado expressivo
						</li>
					)}
				</ul>
			</div>
		</div>
	)
}
