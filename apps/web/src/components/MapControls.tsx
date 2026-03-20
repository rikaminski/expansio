import { useMap } from 'react-leaflet'

const BRAZIL_CENTER: [number, number] = [-15.78, -53.0]
const DEFAULT_ZOOM = 4

export default function MapControls() {
	const map = useMap()

	const zoomIn = () => map.zoomIn()
	const zoomOut = () => map.zoomOut()
	const resetView = () => map.setView(BRAZIL_CENTER, DEFAULT_ZOOM, { animate: true })

	return (
		<div className="absolute left-4 top-4 z-[1000] flex flex-col gap-1.5">
			<button
				type="button"
				onClick={zoomIn}
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white/95 text-primary/70 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-50 hover:text-primary"
				title="Zoom in"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					role="img"
					aria-label="Zoom in"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
				</svg>
			</button>
			<button
				type="button"
				onClick={zoomOut}
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white/95 text-primary/70 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-50 hover:text-primary"
				title="Zoom out"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					role="img"
					aria-label="Zoom out"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
				</svg>
			</button>
			<div className="h-px bg-surface-200" />
			<button
				type="button"
				onClick={resetView}
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white/95 text-primary/70 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-50 hover:text-primary"
				title="Resetar mapa"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					role="img"
					aria-label="Reset zoom"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
		</div>
	)
}
