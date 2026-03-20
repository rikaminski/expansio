import { formatNumber } from '../lib/format'

interface CounterBarProps {
	total: number
	filtered: number
	loading: boolean
}

export default function CounterBar({ total, filtered, loading }: CounterBarProps) {
	const percentage = total > 0 ? Math.round((filtered / total) * 100) : 100
	const isFiltered = filtered < total

	return (
		<div className="border-b border-surface-200 px-5 py-3">
			<div className="flex items-baseline justify-between">
				<div className="flex items-baseline gap-2">
					<span className="font-display text-2xl font-bold text-primary">
						{loading ? '—' : formatNumber(filtered)}
					</span>
					{isFiltered && <span className="text-sm text-surface-300">de {formatNumber(total)}</span>}
				</div>
				{isFiltered && (
					<span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
						{percentage}%
					</span>
				)}
			</div>
			<p className="mt-0.5 text-xs text-surface-300">
				{isFiltered ? 'empresas filtradas' : 'empresas no Brasil'}
			</p>
			{isFiltered && (
				<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-100">
					<div
						className="h-full rounded-full bg-accent transition-all duration-500"
						style={{ width: `${percentage}%` }}
					/>
				</div>
			)}
		</div>
	)
}
