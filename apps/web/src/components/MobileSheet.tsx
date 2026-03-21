import type { FilterState } from '@expansio/shared'
import type { VisualizationMode } from '../hooks/useMapState'
import type { FilteredData } from '../hooks/useFilteredData'

interface MobileSheetProps {
	mobileOpen: boolean
	onToggleMobile: () => void
	visualization: VisualizationMode
	setVisualization: (v: VisualizationMode) => void
	markers: Set<'branches' | 'competition' | 'demand'>
	toggleMarker: (m: 'branches' | 'competition' | 'demand') => void
	filters: FilterState
	updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
	resetFilters: () => void
	data: FilteredData
}

export default function MobileSheet({
	mobileOpen,
	onToggleMobile,
	visualization,
	setVisualization,
	markers,
	toggleMarker,
	filters,
	updateFilter,
	resetFilters,
	data,
}: MobileSheetProps) {
	return (
		<div
			className={`fixed inset-x-0 bottom-0 z-[1100] flex flex-col rounded-t-2xl border-t border-surface-200 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
				mobileOpen ? 'max-h-[80vh]' : 'max-h-[140px]'
			}`}
		>
			{/* Drag handle + header */}
			<button
				type="button"
				onClick={onToggleMobile}
				className="flex flex-col items-center px-5 pt-2 pb-3"
				aria-label={mobileOpen ? 'Minimizar painel' : 'Expandir painel'}
			>
				<div className="mb-2 h-1 w-10 rounded-full bg-surface-300" />
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<img src="/logo.svg" alt="Expansio" className="h-6 w-6" />
						<span className="font-display text-sm font-bold text-primary">Expansio</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-primary/60">
						<span className="font-semibold text-primary">
							{data.loading ? '...' : data.filtered.toLocaleString('pt-BR')}
						</span>
						<span>empresas</span>
						<svg
							className={`h-4 w-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							role="img"
							aria-label="Expand"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
						</svg>
					</div>
				</div>
			</button>

			{/* Expandable content */}
			{mobileOpen && (
				<div className="flex-1 overflow-y-auto border-t border-surface-100 px-5 pb-6">
					{/* Viz control */}
					<div className="py-3">
						<div className="inline-flex w-full rounded-lg bg-surface-50 p-0.5">
							{[
								{ value: 'marketPotential' as const, label: 'Potencial' },
								{ value: 'expansion' as const, label: 'Expansão' },
								{ value: 'none' as const, label: 'Nenhum' },
							].map(({ value, label }) => (
								<button
									key={value}
									type="button"
									onClick={() => setVisualization(value)}
									className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
										visualization === value
											? 'bg-white text-primary shadow-sm'
											: 'text-primary/50'
									}`}
								>
									{label}
								</button>
							))}
						</div>
					</div>

					{/* Layers — horizontal on mobile */}
					<div className="flex gap-2 pb-3">
						{[
							{ value: 'branches' as const, label: 'Filiais', color: 'bg-accent' },
							{ value: 'competition' as const, label: 'Concorrentes', color: 'bg-danger' },
							{ value: 'demand' as const, label: 'Demanda', color: 'bg-purple' },
						].map(({ value, label, color }) => (
							<button
								key={value}
								type="button"
								onClick={() => toggleMarker(value)}
								className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
									markers.has(value)
										? `${color} text-white shadow-sm`
										: 'bg-surface-50 text-primary/60'
								}`}
							>
								{label}
							</button>
						))}
					</div>

					{/* Filters — 2 column grid on mobile */}
					<div className="grid grid-cols-2 gap-2">
						{(
							[
								{
									key: 'sectors',
									label: 'Setor',
									options: ['Varejo', 'Tecnologia', 'Saúde', 'Indústria', 'Serviços', 'Educação'],
								},
								{
									key: 'portes',
									label: 'Porte',
									options: ['1-10', '11-50', '51-200', '201-500', '500+'],
								},
								{
									key: 'revenueRanges',
									label: 'Faturamento',
									options: [
										'0-100k',
										'100k-1M',
										'1M-10M',
										'10M-50M',
										'50M+',
									],
								},
								{
									key: 'regions',
									label: 'Região',
									options: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
								},
							] as const
						).map(({ key, label, options }) => (
							<div key={key} className="relative">
								<select
									className="w-full appearance-none rounded-lg border border-surface-200 bg-white px-3 py-2 pr-8 text-xs text-primary"
									value=""
									onChange={(e) => {
										if (e.target.value) {
											const current = filters[key] as string[]
											if (current.includes(e.target.value)) {
												updateFilter(key, current.filter((v) => v !== e.target.value) as any)
											} else {
												updateFilter(key, [...current, e.target.value] as any)
											}
										}
									}}
								>
									<option value="">
										{label}{' '}
										{(filters[key] as string[]).length > 0
											? `(${(filters[key] as string[]).length})`
											: ''}
									</option>
									{options.map((opt) => (
										<option key={opt} value={opt}>
											{(filters[key] as string[]).includes(opt) ? '✓ ' : ''}
											{opt}
										</option>
									))}
								</select>
								<svg
									className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									role="img"
									aria-label="Select"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						))}
					</div>

					{/* Active filter chips */}
					{(filters.sectors.length > 0 ||
						filters.portes.length > 0 ||
						filters.revenueRanges.length > 0 ||
						filters.regions.length > 0) && (
						<div className="mt-2 flex flex-wrap gap-1">
							{Object.entries(filters).filter(([, v]) => Array.isArray(v)).flatMap(([key, values]) =>
								(values as string[]).map((v) => (
									<span
										key={`${key}-${v}`}
										className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
									>
										{v}
										<button
											type="button"
											onClick={() =>
												updateFilter(
													key as any,
													(values as string[]).filter((x) => x !== v) as any,
												)
											}
											className="text-accent/50 hover:text-accent"
											aria-label={`Remover ${v}`}
										>
											×
										</button>
									</span>
								)),
							)}
							<button
								type="button"
								onClick={resetFilters}
								className="rounded-md px-2 py-0.5 text-[10px] font-medium text-danger hover:bg-danger/5"
							>
								Limpar
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
