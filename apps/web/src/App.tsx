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

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-surface-50">
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

			<main className="relative flex-1">
				<MapView
					visualization={visualization}
					markers={markers}
					selectedUf={selectedUf}
					onSelectUf={toggleSelectedUf}
					data={data}
				/>

				{/* Floating state detail card */}
				{selectedUf && (
					<div className="absolute right-4 top-16 z-[1000] w-[340px] animate-fade-in rounded-xl border border-surface-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm">
						<StateDetail uf={selectedUf} data={data} onClose={() => setSelectedUf(null)} />
					</div>
				)}
			</main>
		</div>
	)
}
