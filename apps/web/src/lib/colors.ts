/**
 * Color utilities for choropleth maps.
 * Heatmap: red → orange → yellow → lime → green
 */

const HEATMAP_STOPS = [
	[0, '#f87171'], // red-400 (softer coral)
	[0.25, '#f97316'], // orange-500
	[0.5, '#eab308'], // yellow-500
	[0.75, '#84cc16'], // lime-500
	[1, '#22c55e'], // green-500
] as const

/**
 * Get color from heatmap gradient based on normalized value (0-1).
 */
export function getHeatmapColor(value: number): string {
	const v = Math.max(0, Math.min(1, value))

	for (let i = 1; i < HEATMAP_STOPS.length; i++) {
		const [prevStop, prevColor] = HEATMAP_STOPS[i - 1]
		const [currStop, currColor] = HEATMAP_STOPS[i]

		if (v <= currStop) {
			const t = (v - prevStop) / (currStop - prevStop)
			return interpolateColor(prevColor, currColor, t)
		}
	}

	return HEATMAP_STOPS[HEATMAP_STOPS.length - 1][1]
}

/**
 * Amber color with variable opacity for expansion scores.
 */
export function getExpansionColor(similarity: number): string {
	const opacity = Math.max(0.15, Math.min(0.85, similarity / 100))
	return `rgba(217, 119, 6, ${opacity})`
}

/**
 * Neutral fill for "no visualization" mode.
 */
export function getNeutralColor(): string {
	return '#e2e8f0'
}

// Simple hex color interpolation
function interpolateColor(a: string, b: string, t: number): string {
	const ar = Number.parseInt(a.slice(1, 3), 16)
	const ag = Number.parseInt(a.slice(3, 5), 16)
	const ab = Number.parseInt(a.slice(5, 7), 16)
	const br = Number.parseInt(b.slice(1, 3), 16)
	const bg = Number.parseInt(b.slice(3, 5), 16)
	const bb = Number.parseInt(b.slice(5, 7), 16)

	const r = Math.round(ar + (br - ar) * t)
	const g = Math.round(ag + (bg - ag) * t)
	const bl = Math.round(ab + (bb - ab) * t)

	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}
