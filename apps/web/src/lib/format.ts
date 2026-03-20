/**
 * Format number with Brazilian locale.
 */
export function formatNumber(n: number): string {
	return n.toLocaleString('pt-BR')
}

/**
 * Format currency in BRL.
 */
export function formatCurrency(n: number): string {
	if (n >= 1_000_000_000) return `R$ ${(n / 1_000_000_000).toFixed(1)}B`
	if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`
	if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(0)}k`
	return `R$ ${n}`
}

/**
 * Format date string to Brazilian locale.
 */
export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

/**
 * Format percentage.
 */
export function formatPercent(n: number): string {
	return `${n}%`
}
