import type { FilterState, Porte, Region, RevenueRange, Sector } from '@expansio/shared'
import { PORTES, REGIONS, REVENUE_RANGES, SECTORS } from '@expansio/shared'
import type { FilteredData } from '../hooks/useFilteredData'
import type { VisualizationMode } from '../hooks/useMapState'
import CounterBar from './CounterBar'
import FilterDropdown from './FilterDropdown'
import StateDetail from './StateDetail'

interface SidebarProps {
	visualization: VisualizationMode
	onVisualizationChange: (v: VisualizationMode) => void
	markers: Set<'branches' | 'competition' | 'demand'>
	onToggleMarker: (m: 'branches' | 'competition' | 'demand') => void
	filters: FilterState
	onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
	onResetFilters: () => void
	data: FilteredData
	selectedUf: string | null
	onDeselectUf: () => void
}

const VISUALIZATION_OPTIONS: { value: VisualizationMode; label: string; icon: string }[] = [
	{ value: 'marketPotential', label: 'Potencial', icon: '📊' },
	{ value: 'expansion', label: 'Expansão', icon: '🚀' },
	{ value: 'none', label: 'Nenhum', icon: '⬜' },
]

const MARKER_OPTIONS: {
	value: 'branches' | 'competition' | 'demand'
	label: string
	color: string
}[] = [
	{ value: 'branches', label: 'Filiais', color: 'bg-accent' },
	{ value: 'competition', label: 'Concorrentes', color: 'bg-danger' },
	{ value: 'demand', label: 'Demanda', color: 'bg-purple' },
]

export default function Sidebar({
	visualization,
	onVisualizationChange,
	markers,
	onToggleMarker,
	filters,
	onFilterChange,
	onResetFilters,
	data,
	selectedUf,
	onDeselectUf,
}: SidebarProps) {
	const hasActiveFilters =
		filters.sectors.length > 0 ||
		filters.portes.length > 0 ||
		filters.revenueRanges.length > 0 ||
		filters.regions.length > 0

	return (
		<aside className="flex w-[350px] shrink-0 flex-col border-r border-surface-200 bg-white">
			{/* Header */}
			<div className="flex h-14 items-center gap-3 border-b border-surface-200 px-5">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
					<svg
						className="h-4 w-4 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						role="img"
						aria-label="Expansio logo"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h1 className="font-display text-lg font-bold text-primary">Expansio</h1>
			</div>

			{/* Counter */}
			<CounterBar total={data.total} filtered={data.filtered} loading={data.loading} />

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto">
				{/* Visualization mode */}
				<div className="border-b border-surface-200 p-5">
					<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-300">
						Visualização
					</h2>
					<div className="flex gap-1.5">
						{VISUALIZATION_OPTIONS.map(({ value, label, icon }) => (
							<button
								key={value}
								type="button"
								onClick={() => onVisualizationChange(value)}
								className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-medium transition-all ${
									visualization === value
										? 'bg-primary text-white shadow-sm'
										: 'bg-surface-50 text-primary/60 hover:bg-surface-100'
								}`}
							>
								<span className="mr-1">{icon}</span>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Marker toggles */}
				<div className="border-b border-surface-200 p-5">
					<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-300">
						Camadas
					</h2>
					<div className="flex flex-col gap-2">
						{MARKER_OPTIONS.map(({ value, label, color }) => (
							<label
								key={value}
								className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-50"
							>
								<div
									className={`flex h-5 w-5 items-center justify-center rounded transition-all ${
										markers.has(value) ? `${color} shadow-sm` : 'border border-surface-300 bg-white'
									}`}
								>
									{markers.has(value) && (
										<svg
											className="h-3.5 w-3.5 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={3}
											role="img"
											aria-label="Active"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									)}
								</div>
								<span className="text-sm text-primary/80">{label}</span>
								<input
									type="checkbox"
									className="sr-only"
									checked={markers.has(value)}
									onChange={() => onToggleMarker(value)}
								/>
							</label>
						))}
					</div>
				</div>

				{/* Filters */}
				<div className="p-5">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-surface-300">
							Filtros
						</h2>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={onResetFilters}
								className="text-xs text-danger hover:text-danger/80"
							>
								Limpar tudo
							</button>
						)}
					</div>
					<div className="flex flex-col gap-2.5">
						<FilterDropdown<Sector>
							label="Setor"
							options={[...SECTORS]}
							selected={filters.sectors}
							onChange={(v) => onFilterChange('sectors', v)}
						/>
						<FilterDropdown<Porte>
							label="Porte"
							options={[...PORTES]}
							selected={filters.portes}
							onChange={(v) => onFilterChange('portes', v)}
						/>
						<FilterDropdown<RevenueRange>
							label="Faturamento"
							options={[...REVENUE_RANGES]}
							selected={filters.revenueRanges}
							onChange={(v) => onFilterChange('revenueRanges', v)}
						/>
						<FilterDropdown<Region>
							label="Região"
							options={[...REGIONS]}
							selected={filters.regions}
							onChange={(v) => onFilterChange('regions', v)}
						/>
					</div>
				</div>
			</div>

			{/* State detail panel */}
			{selectedUf && (
				<div className="border-t border-surface-200 px-5 py-4">
					<StateDetail uf={selectedUf} data={data} onClose={onDeselectUf} />
				</div>
			)}
		</aside>
	)
}
