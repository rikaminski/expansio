import type { FilterState, Porte, Region, RevenueRange, Sector } from '@expansio/shared'
import { PORTES, REGIONS, REVENUE_RANGES, SECTORS } from '@expansio/shared'
import type { FilteredData } from '../hooks/useFilteredData'
import type { VisualizationMode } from '../hooks/useMapState'
import CounterBar from './CounterBar'
import FilterDropdown from './FilterDropdown'
import SearchBar from './SearchBar'

interface SidebarProps {
	visualization: VisualizationMode
	onVisualizationChange: (v: VisualizationMode) => void
	markers: Set<'branches' | 'competition' | 'demand'>
	onToggleMarker: (m: 'branches' | 'competition' | 'demand') => void
	filters: FilterState
	onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
	onResetFilters: () => void
	onSearchSelect: (uf: string) => void
	data: FilteredData
}

const VIZ_OPTIONS: { value: VisualizationMode; label: string }[] = [
	{ value: 'marketPotential', label: 'Potencial' },
	{ value: 'expansion', label: 'Expansão' },
	{ value: 'none', label: 'Nenhum' },
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
	onSearchSelect,
	data,
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
				<img src="/logo.svg" alt="Expansio" className="h-8 w-8" />
				<h1 className="font-display text-lg font-bold text-primary">Expansio</h1>
			</div>

			{/* Search */}
			<div className="border-b border-surface-200 px-4 py-3">
				<SearchBar onSelect={onSearchSelect} />
			</div>

			{/* Counter */}
			<CounterBar total={data.total} filtered={data.filtered} loading={data.loading} />

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto">
				<div className="border-b border-surface-200 px-5 py-3">
					<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
						Análise
					</h2>
					<div className="inline-flex w-full rounded-lg bg-surface-50 p-0.5">
						{VIZ_OPTIONS.map(({ value, label }) => (
							<button
								key={value}
								type="button"
								onClick={() => onVisualizationChange(value)}
								className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
									visualization === value
										? 'bg-white text-primary shadow-sm'
										: 'text-primary/50 hover:text-primary/70'
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>

			{/* Marker toggles — compact */}
				<div className="border-b border-surface-200 px-5 py-3">
					<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
						Marcadores
					</h2>
					<div className="flex gap-1.5">
						{MARKER_OPTIONS.map(({ value, label, color }) => (
							<label
								key={value}
								className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
									markers.has(value)
										? `${color} text-white shadow-sm`
										: 'bg-surface-50 text-primary/50 hover:text-primary/70'
								}`}
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={markers.has(value)}
									onChange={() => onToggleMarker(value)}
								/>
								{label}
							</label>
						))}
					</div>
				</div>

				{/* Period toggle */}
				<div className="border-b border-surface-200 px-5 py-3">
					<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
						Período
					</h2>
					<div className="inline-flex w-full rounded-lg bg-surface-50 p-0.5">
						{([['all', 'Histórico completo'], ['12months', 'Últimos 12 meses']] as const).map(([value, label]) => (
							<button
								key={value}
								type="button"
								onClick={() => onFilterChange('period', value)}
								className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
									filters.period === value
										? 'bg-white text-primary shadow-sm'
										: 'text-primary/50 hover:text-primary/70'
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Filters */}
				<div className="p-5">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-primary/50">
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
		</aside>
	)
}
