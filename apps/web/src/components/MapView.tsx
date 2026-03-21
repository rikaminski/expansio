import L from 'leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	CircleMarker,
	GeoJSON,
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	Tooltip,
	useMap,
	useMapEvents,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import type { FilteredData } from '../hooks/useFilteredData'
import type { VisualizationMode } from '../hooks/useMapState'
import { fetchBranches, fetchCompetitors, fetchStatesGeoJSON } from '../lib/api'
import { getExpansionColor, getHeatmapColor, getNeutralColor } from '../lib/colors'
import { formatCurrency, formatDate, formatNumber } from '../lib/format'
import MapControls from './MapControls'
import MapLegend from './MapLegend'

// Custom marker icons
const branchIcon = new L.DivIcon({
	className: 'cluster-icon cluster-icon-branches',
	iconSize: [12, 12],
	html: '',
})

const competitorIcon = new L.DivIcon({
	className: 'cluster-icon cluster-icon-competitors',
	iconSize: [10, 10],
	html: '',
})

// Cluster icon creator
function createClusterIcon(color: string) {
	// biome-ignore lint/suspicious/noExplicitAny: MarkerCluster type not exported from @types/leaflet
	return (cluster: any) => {
		const count = cluster.getChildCount()
		return new L.DivIcon({
			className: `cluster-icon ${color === 'branches' ? 'cluster-icon-branches' : 'cluster-icon-competitors'}`,
			iconSize: [36, 36],
			html: `<span>${count}</span>`,
		})
	}
}

interface MapViewProps {
	visualization: VisualizationMode
	markers: Set<'branches' | 'competition' | 'demand'>
	selectedUf: string | null
	onSelectUf: (uf: string) => void
	data: FilteredData
}

export default function MapView({
	visualization,
	markers,
	selectedUf,
	onSelectUf,
	data,
}: MapViewProps) {
	const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null)
	const [branchesData, setBranchesData] = useState<GeoJSON.FeatureCollection | null>(null)
	const [competitorsData, setCompetitorsData] = useState<GeoJSON.FeatureCollection | null>(null)

	// Load static data once
	useEffect(() => {
		fetchStatesGeoJSON().then(setGeojson)
		fetchBranches().then(setBranchesData)
		fetchCompetitors().then(setCompetitorsData)
	}, [])

	// Max company count for normalization
	const maxCount = useMemo(() => {
		const counts = Object.values(data.stateCompanyCounts)
		return Math.max(...counts, 1)
	}, [data.stateCompanyCounts])

	// Expansion lookup
	const expansionMap = useMemo(() => {
		const map = new Map<string, number>()
		for (const { uf, similarity } of data.expansionScores) {
			map.set(uf, similarity)
		}
		return map
	}, [data.expansionScores])

	// Style function for GeoJSON
	const styleFeature = useCallback(
		(feature?: GeoJSON.Feature) => {
			if (!feature?.properties) return {}
			const uf = feature.properties.uf as string
			const isSelected = selectedUf === uf

			let fillColor: string
			let fillOpacity: number

			if (visualization === 'marketPotential') {
				const count = data.stateCompanyCounts[uf] || 0
				const normalized = count / maxCount
				fillColor = getHeatmapColor(normalized)
				fillOpacity = Math.max(0.15, normalized * 0.75)
			} else if (visualization === 'expansion') {
				const similarity = expansionMap.get(uf)
				if (similarity !== undefined) {
					fillColor = getExpansionColor(similarity)
					fillOpacity = 0.7
				} else {
					// State has branches — show neutral
					fillColor = '#93c5fd'
					fillOpacity = 0.3
				}
			} else {
				fillColor = getNeutralColor()
				fillOpacity = 0.3
			}

			return {
				fillColor,
				fillOpacity,
				weight: isSelected ? 2.5 : 1,
				opacity: 1,
				color: isSelected ? '#111827' : '#94a3b8',
				dashArray: visualization === 'expansion' && expansionMap.has(uf) ? '' : undefined,
			}
		},
		[visualization, data.stateCompanyCounts, maxCount, expansionMap, selectedUf],
	)

	// Event handlers for each feature
	// Ref to store map instance for zoom operations
	const mapRef = useRef<L.Map | null>(null)

	const onEachFeature = useCallback(
		(feature: GeoJSON.Feature, layer: L.Layer) => {
			const uf = feature.properties?.uf as string
			const name = feature.properties?.name as string
			const count = data.stateCompanyCounts[uf] || 0

			layer.bindTooltip(`<strong>${name}</strong><br/>${formatNumber(count)} empresas`, {
				sticky: true,
				className: 'leaflet-tooltip',
			})

			layer.on({
				click: () => {
					onSelectUf(uf)
					// Smart zoom: fit to state bounds
					if (mapRef.current && 'getBounds' in layer) {
						const bounds = (layer as L.Polygon).getBounds()
						mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true })
					}
				},
				mouseover: (e: L.LeafletMouseEvent) => {
					const target = e.target as L.Path
					target.setStyle({ weight: 2, color: '#475569' })
					target.bringToFront()
				},
				mouseout: (e: L.LeafletMouseEvent) => {
					const target = e.target as L.Path
					target.setStyle({
						weight: selectedUf === uf ? 2.5 : 1,
						color: selectedUf === uf ? '#111827' : '#94a3b8',
					})
				},
			})
		},
		[data.stateCompanyCounts, onSelectUf, selectedUf],
	)

	// Key to force re-render of GeoJSON when data changes
	const geojsonKey = useMemo(
		() =>
			`${visualization}-${JSON.stringify(data.stateCompanyCounts)}-${selectedUf}-${data.expansionScores.length}`,
		[visualization, data.stateCompanyCounts, selectedUf, data.expansionScores],
	)

	// Max demand for circle radius normalization
	const maxDemand = useMemo(() => {
		const vals = Object.values(data.demandByState)
		return Math.max(...vals, 1)
	}, [data.demandByState])

	if (!geojson) {
		return (
			<div className="flex h-full items-center justify-center text-surface-300">
				Carregando mapa...
			</div>
		)
	}

	return (
		<>
			<MapContainer
				center={[-15.78, -53.0]}
				zoom={4}
				className="leaflet-container"
				zoomControl={false}
				scrollWheelZoom={true}
				minZoom={3}
				maxZoom={18}
				attributionControl={false}
				maxBounds={[
					[8, -80],
					[-38, -28],
				]}
				maxBoundsViscosity={0.8}
			>
				{/* Custom zoom controls + map ref capture */}
				<MapControls />
				<MapRefCapture mapRef={mapRef} />
				<MapZoomToState selectedUf={selectedUf} geojson={geojson} />

				{/* Zoom-aware base tiles */}
				<DynamicTiles />

				{/* State boundaries choropleth */}
				<GeoJSON
					key={geojsonKey}
					data={geojson}
					style={styleFeature}
					onEachFeature={onEachFeature}
				/>

				{/* Demand bubbles */}
				{markers.has('demand') &&
					Object.entries(data.demandByState).map(([uf, value]) => {
						const feature = geojson.features.find((f) => f.properties?.uf === uf)
						if (!feature) return null

						// Get centroid from feature properties or simple bbox center
						let lat: number
						let lng: number
						if (feature.geometry.type === 'Point') {
							;[lng, lat] = feature.geometry.coordinates as [number, number]
						} else {
							// Rough centroid from bbox
							const bounds = L.geoJSON(feature).getBounds()
							const center = bounds.getCenter()
							lat = center.lat
							lng = center.lng
						}

						const radius = Math.max(5, Math.sqrt(value / maxDemand) * 35)

						return (
							<CircleMarker
								key={`demand-${uf}`}
								center={[lat, lng]}
								radius={radius}
								pathOptions={{
									fillColor: '#7c3aed',
									fillOpacity: 0.18,
									color: 'transparent',
									weight: 0,
								}}
							>
								<Tooltip>
									<strong>{uf}</strong>
									<br />
									Demanda: {formatCurrency(value)}
								</Tooltip>
							</CircleMarker>
						)
					})}

				{/* Branch markers */}
				{markers.has('branches') && branchesData && (
					<MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon('branches')}>
						{branchesData.features.map((f) => {
							const coords =
								f.geometry.type === 'Point'
									? (f.geometry.coordinates as [number, number])
									: ([0, 0] as [number, number])
							return (
								<Marker
									key={f.properties?.id}
									position={[coords[1], coords[0]]}
									icon={branchIcon}
									eventHandlers={{ click: () => mapRef.current?.flyTo([coords[1], coords[0]], 17, { animate: true, duration: 0.8 }) }}
								>
									<Popup>
										<strong>{f.properties?.name}</strong>
										<br />
										{f.properties?.city} — {f.properties?.uf}
										<br />
										<span className="text-xs text-gray-500">
											Desde {formatDate(f.properties?.openedAt)}
										</span>
									</Popup>
								</Marker>
							)
						})}
					</MarkerClusterGroup>
				)}

				{/* Competitor markers */}
				{markers.has('competition') && competitorsData && (
					<MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon('competitors')}>
						{competitorsData.features.map((f) => {
							const coords =
								f.geometry.type === 'Point'
									? (f.geometry.coordinates as [number, number])
									: ([0, 0] as [number, number])
							return (
								<Marker
									key={f.properties?.id}
									position={[coords[1], coords[0]]}
									icon={competitorIcon}
									eventHandlers={{ click: () => mapRef.current?.flyTo([coords[1], coords[0]], 17, { animate: true, duration: 0.8 }) }}
								>
									<Popup>
										<strong>{f.properties?.name}</strong>
										<br />
										{f.properties?.city} — {f.properties?.uf}
									</Popup>
								</Marker>
							)
						})}
					</MarkerClusterGroup>
				)}
			</MapContainer>

			{/* Legend overlay */}
			<MapLegend visualization={visualization} />
		</>
	)
}

// Helper component to capture map ref
function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
	const map = useMap()
	useEffect(() => {
		mapRef.current = map
	}, [map, mapRef])
	return null
}

// Zoom to selected state from any source (search, map click)
function MapZoomToState({ selectedUf, geojson }: { selectedUf: string | null; geojson: GeoJSON.FeatureCollection | null }) {
	const map = useMap()
	useEffect(() => {
		if (!selectedUf || !geojson) return
		const feature = geojson.features.find((f) => f.properties?.uf === selectedUf)
		if (!feature) return
		const bounds = L.geoJSON(feature).getBounds()
		map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true })
	}, [selectedUf, geojson, map])
	return null
}

// Zoom-aware tile switching: clean tiles for choropleth, detailed tiles for street view
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
const TILE_DETAIL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ZOOM_THRESHOLD = 10

function DynamicTiles() {
	const [zoom, setZoom] = useState(4)
	useMapEvents({
		zoomend: (e) => setZoom(e.target.getZoom()),
	})

	const isDetailZoom = zoom > ZOOM_THRESHOLD

	return (
		<TileLayer
			key={isDetailZoom ? 'detail' : 'light'}
			url={isDetailZoom ? TILE_DETAIL : TILE_LIGHT}
			opacity={isDetailZoom ? 0.9 : 0.4}
		/>
	)
}
