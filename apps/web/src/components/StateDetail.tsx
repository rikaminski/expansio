import { STATE_NAMES, STATE_TO_REGION } from '@expansio/shared'
import type { FilteredData } from '../hooks/useFilteredData'
import { formatCurrency, formatNumber, formatPercent } from '../lib/format'

interface StateDetailProps {
	uf: string
	data: FilteredData
	onClose: () => void
	onMinimize?: () => void
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

export default function StateDetail({ uf, data, onClose, onMinimize }: StateDetailProps) {
	const name = STATE_NAMES[uf] || uf
	const stateInfo = data.statesInfo[uf]
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
					<h3 className="font-display text-lg font-bold text-primary">
						{name} <span className="text-sm font-medium text-primary/40">{uf}</span>
					</h3>
				</div>
				<div className="flex items-center gap-1">
					{onMinimize && (
						<button
							type="button"
							onClick={onMinimize}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-300 transition-colors hover:bg-surface-50 hover:text-primary"
							title="Minimizar"
						>
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} role="img" aria-label="Minimizar">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
							</svg>
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-300 transition-colors hover:bg-surface-50 hover:text-primary"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} role="img" aria-label="Fechar">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 gap-3">
				<div className="rounded-lg bg-surface-50 p-3">
					<p className="text-xs text-primary/40">Empresas</p>
					<p className="font-display text-xl font-bold text-primary">
						{formatNumber(companyCount)}
					</p>
					<p className="text-[10px] font-medium text-primary/60">{sharePercent}% do total</p>
				</div>
				<div className="rounded-lg bg-surface-50 p-3">
					<p className="text-xs text-primary/40">Demanda</p>
					<p className="font-display text-xl font-bold text-purple">
						{formatCurrency(demandValue)}
					</p>
				</div>
				{stateInfo && (
					<>
						<div className="rounded-lg bg-surface-50 p-3">
							<p className="text-xs text-primary/40">População</p>
							<p className="font-display text-xl font-bold text-primary">
								{formatNumber(stateInfo.population)}
							</p>
						</div>
						<div className="rounded-lg bg-surface-50 p-3">
							<p className="text-xs text-primary/40">PIB per capita</p>
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
							<span className="text-xs text-primary/40">Potencial de Mercado</span>
							<span className="text-xs font-semibold text-accent">
								{formatPercent(stateInfo.potentialScore)}
							</span>
						</div>
						<ScoreBar value={stateInfo.potentialScore} color="#2563eb" />
					</div>

					{expansionScore && (
						<div>
							<div className="mb-1 flex items-center justify-between">
								<span className="text-xs text-primary/40">Score de Expansão</span>
								<span className="text-xs font-semibold text-warning">
									{formatPercent(expansionScore.similarity)}
								</span>
							</div>
							<ScoreBar value={expansionScore.similarity} color="#d97706" />
						</div>
					)}
				</div>
			)}

			{/* Region comparison mini chart */}
			<RegionChart stateCompanyCounts={data.stateCompanyCounts} currentUf={uf} />

			{/* Insights */}
			<div className="rounded-lg border border-surface-200 p-3">
				<h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
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

const REGION_ORDER = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte']
const REGION_ABBR: Record<string, string> = {
	'Sudeste': 'SE', 'Sul': 'S', 'Nordeste': 'NE', 'Centro-Oeste': 'CO', 'Norte': 'N',
}

function RegionChart({ stateCompanyCounts, currentUf }: { stateCompanyCounts: Record<string, number>; currentUf: string }) {
	const currentRegion = STATE_TO_REGION[currentUf]

	// Aggregate counts by region
	const regionCounts: Record<string, number> = {}
	for (const region of REGION_ORDER) regionCounts[region] = 0
	for (const [uf, count] of Object.entries(stateCompanyCounts)) {
		const region = STATE_TO_REGION[uf]
		if (region) regionCounts[region] = (regionCounts[region] || 0) + count
	}

	const maxCount = Math.max(...Object.values(regionCounts), 1)

	return (
		<div>
			<h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
				Empresas por Região
			</h4>
			<div className="flex flex-col gap-1.5">
				{REGION_ORDER.map((region) => {
					const count = regionCounts[region] || 0
					const pct = Math.round((count / maxCount) * 100)
					const isCurrent = region === currentRegion
					return (
						<div key={region} className="flex items-center gap-2">
							<span className={`w-6 text-[10px] font-semibold ${isCurrent ? 'text-accent' : 'text-primary/40'}`}>
								{REGION_ABBR[region]}
							</span>
							<div className="flex-1">
								<div className="h-3.5 w-full overflow-hidden rounded-sm bg-surface-100">
									<div
										className={`h-full rounded-sm transition-all duration-500 ${isCurrent ? 'bg-accent' : 'bg-surface-300'}`}
										style={{ width: `${pct}%` }}
									/>
								</div>
							</div>
							<span className={`w-8 text-right text-[10px] ${isCurrent ? 'font-semibold text-accent' : 'text-primary/40'}`}>
								{count}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
