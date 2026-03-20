import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
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
				selectedUf={selectedUf}
				onDeselectUf={() => setSelectedUf(null)}
			/>

			<main className="relative flex-1">
				<MapView
					visualization={visualization}
					markers={markers}
					selectedUf={selectedUf}
					onSelectUf={toggleSelectedUf}
					data={data}
				/>
			</main>
		</div>
	)
}
