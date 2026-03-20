import type { VisualizationMode } from '../hooks/useMapState'

interface MapLegendProps {
	visualization: VisualizationMode
}

export default function MapLegend({ visualization }: MapLegendProps) {
	if (visualization === 'none') return null

	const config =
		visualization === 'marketPotential'
			? {
					label: 'Potencial de Mercado',
					from: '#ef4444',
					to: '#22c55e',
					fromLabel: 'Baixo',
					toLabel: 'Alto',
				}
			: {
					label: 'Oportunidades de Expansão',
					from: 'rgba(217,119,6,0.15)',
					to: 'rgba(217,119,6,0.85)',
					fromLabel: 'Baixa similaridade',
					toLabel: 'Alta similaridade',
				}

	return (
		<div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2 animate-fade-in rounded-xl border border-surface-200 bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-sm">
			<div className="mb-1 text-center text-xs font-medium text-primary/70">{config.label}</div>
			<div className="flex items-center gap-2">
				<span className="text-[10px] text-surface-300">{config.fromLabel}</span>
				<div
					className="h-2.5 w-32 rounded-full"
					style={{
						background: `linear-gradient(to right, ${config.from}, ${config.to})`,
					}}
				/>
				<span className="text-[10px] text-surface-300">{config.toLabel}</span>
			</div>
		</div>
	)
}
