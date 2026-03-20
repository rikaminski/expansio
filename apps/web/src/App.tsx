import MapView from './components/MapView'
import { useFilteredData } from './hooks/useFilteredData'
import { useMapState } from './hooks/useMapState'
import { formatNumber } from './lib/format'

export default function App() {
	const { visualization, markers, selectedUf, toggleSelectedUf, filters } = useMapState()

	const data = useFilteredData(filters)

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-surface-50">
			{/* Sidebar */}
			<aside className="w-[350px] shrink-0 border-r border-surface-200 bg-white">
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

				{/* Counter bar */}
				<div className="border-b border-surface-200 px-5 py-3">
					<div className="flex items-baseline gap-2">
						<span className="font-display text-2xl font-bold text-primary">
							{data.loading ? '...' : formatNumber(data.filtered)}
						</span>
						<span className="text-sm text-surface-300">
							de {data.loading ? '...' : formatNumber(data.total)} empresas
						</span>
					</div>
				</div>

				{/* Placeholder for filters */}
				<div className="p-5">
					<p className="text-xs text-surface-300">Filtros — em breve</p>
				</div>
			</aside>

			{/* Map area */}
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
