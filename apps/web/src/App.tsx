import { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import StateDetail from './components/StateDetail'
import { useFilteredData } from './hooks/useFilteredData'
import { useMapState } from './hooks/useMapState'

export default function App() {
	const {
		visualization,
		setVisualization,
		markers,
		toggleMarker,
		selectedUf,
		setSelectedUf,
		toggleSelectedUf,
		filters,
		updateFilter,
		resetFilters,
	} = useMapState()

	const data = useFilteredData(filters)
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<div className="flex h-screen w-screen flex-col overflow-hidden bg-surface-50 md:flex-row">
			{/* Desktop sidebar */}
			<div className="hidden md:block">
				<Sidebar
					visualization={visualization}
					onVisualizationChange={setVisualization}
					markers={markers}
					onToggleMarker={toggleMarker}
					filters={filters}
					onFilterChange={updateFilter}
					onResetFilters={resetFilters}
					data={data}
				/>
			</div>

			{/* Map */}
			<main className="relative flex-1">
				<MapView
					visualization={visualization}
					markers={markers}
					selectedUf={selectedUf}
					onSelectUf={toggleSelectedUf}
					data={data}
				/>

				{/* Floating state detail — desktop: top-right, mobile: bottom-center */}
				{selectedUf && (
					<div className="absolute inset-x-4 bottom-20 z-[1000] animate-fade-in rounded-xl border border-surface-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:inset-x-auto md:right-4 md:bottom-auto md:top-16 md:w-[340px] md:p-5">
						<StateDetail uf={selectedUf} data={data} onClose={() => setSelectedUf(null)} />
					</div>
				)}
			</main>

			{/* Mobile bottom sheet */}
			<div
				className={`fixed inset-x-0 bottom-0 z-[1100] flex flex-col rounded-t-2xl border-t border-surface-200 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
					mobileOpen ? 'max-h-[80vh]' : 'max-h-[140px]'
				}`}
			>
				{/* Drag handle + header */}
				<button
					type="button"
					onClick={() => setMobileOpen(!mobileOpen)}
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
											'R$ 0-100k',
											'R$ 100k-500k',
											'R$ 500k-2M',
											'R$ 2M-10M',
											'R$ 10M-50M',
											'R$ 50M+',
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
								{Object.entries(filters).flatMap(([key, values]) =>
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
		</div>
	)
}
