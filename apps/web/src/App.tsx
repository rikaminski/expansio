import { useCallback, useEffect, useRef, useState } from 'react'
import MapView from './components/MapView'
import MobileSheet from './components/MobileSheet'
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
	const [cardMinimized, setCardMinimized] = useState(false)
	const searchRef = useRef<HTMLInputElement>(null)

	// Global keyboard shortcuts
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
			switch (e.key) {
				case '1': setVisualization('marketPotential'); break
				case '2': setVisualization('expansion'); break
				case '3': setVisualization('none'); break
				case 'q': case 'Q': toggleMarker('branches'); break
				case 'w': case 'W': toggleMarker('competition'); break
				case 'e': case 'E': toggleMarker('demand'); break
				case '/': e.preventDefault(); searchRef.current?.focus(); break
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [setVisualization, toggleMarker])

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
					searchRef={searchRef}
					onSearchSelect={(uf) => {
						toggleSelectedUf(uf)
						setCardMinimized(false)
					}}
					data={data}
				/>
			</div>

			{/* Map */}
			<main className="relative flex-1">
				<MapView
					visualization={visualization}
					markers={markers}
					selectedUf={selectedUf}
					onSelectUf={(uf) => {
						toggleSelectedUf(uf)
						setCardMinimized(false)
					}}
					data={data}
				/>

				{/* Floating state detail — desktop: top-right, mobile: bottom-center */}
				{selectedUf && (
					<div className={`absolute z-[1000] animate-fade-in rounded-xl border border-surface-200 bg-white/95 shadow-lg backdrop-blur-sm ${
						cardMinimized
							? 'right-4 top-4 md:right-4 md:top-4'
							: 'inset-x-4 bottom-20 p-4 md:inset-x-auto md:right-4 md:bottom-auto md:top-4 md:w-[340px] md:p-5'
					}`}>
						{cardMinimized ? (
							<button
								type="button"
								onClick={() => setCardMinimized(false)}
								className="flex items-center gap-3 px-4 py-2.5"
							>
								<div>
									<span className="font-display text-sm font-bold text-primary">
										{selectedUf}
									</span>
									<span className="ml-2 text-xs text-primary/60">
										{(data.stateCompanyCounts[selectedUf] || 0).toLocaleString('pt-BR')} empresas
									</span>
								</div>
								<svg className="h-4 w-4 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} role="img" aria-label="Expandir">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						) : (
							<StateDetail uf={selectedUf} data={data} onClose={() => setSelectedUf(null)} onMinimize={() => setCardMinimized(true)} />
						)}
					</div>
				)}
			</main>

			<MobileSheet
				mobileOpen={mobileOpen}
				onToggleMobile={() => setMobileOpen(!mobileOpen)}
				visualization={visualization}
				setVisualization={setVisualization}
				markers={markers}
				toggleMarker={toggleMarker}
				filters={filters}
				updateFilter={updateFilter}
				resetFilters={resetFilters}
				data={data}
			/>
		</div>
	)
}
