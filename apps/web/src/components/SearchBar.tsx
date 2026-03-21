import { useCallback, useEffect, useRef, useState } from 'react'

const STATES: { uf: string; name: string }[] = [
	{ uf: 'AC', name: 'Acre' },
	{ uf: 'AL', name: 'Alagoas' },
	{ uf: 'AP', name: 'Amapá' },
	{ uf: 'AM', name: 'Amazonas' },
	{ uf: 'BA', name: 'Bahia' },
	{ uf: 'CE', name: 'Ceará' },
	{ uf: 'DF', name: 'Distrito Federal' },
	{ uf: 'ES', name: 'Espírito Santo' },
	{ uf: 'GO', name: 'Goiás' },
	{ uf: 'MA', name: 'Maranhão' },
	{ uf: 'MT', name: 'Mato Grosso' },
	{ uf: 'MS', name: 'Mato Grosso do Sul' },
	{ uf: 'MG', name: 'Minas Gerais' },
	{ uf: 'PA', name: 'Pará' },
	{ uf: 'PB', name: 'Paraíba' },
	{ uf: 'PR', name: 'Paraná' },
	{ uf: 'PE', name: 'Pernambuco' },
	{ uf: 'PI', name: 'Piauí' },
	{ uf: 'RJ', name: 'Rio de Janeiro' },
	{ uf: 'RN', name: 'Rio Grande do Norte' },
	{ uf: 'RS', name: 'Rio Grande do Sul' },
	{ uf: 'RO', name: 'Rondônia' },
	{ uf: 'RR', name: 'Roraima' },
	{ uf: 'SC', name: 'Santa Catarina' },
	{ uf: 'SP', name: 'São Paulo' },
	{ uf: 'SE', name: 'Sergipe' },
	{ uf: 'TO', name: 'Tocantins' },
]

interface SearchBarProps {
	onSelect: (uf: string) => void
}

export default function SearchBar({ onSelect }: SearchBarProps) {
	const [query, setQuery] = useState('')
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const filtered = query.length > 0
		? STATES.filter(
				(s) =>
					s.name.toLowerCase().includes(query.toLowerCase()) ||
					s.uf.toLowerCase().includes(query.toLowerCase()),
			)
		: []

	const handleSelect = useCallback(
		(uf: string) => {
			onSelect(uf)
			setQuery('')
			setOpen(false)
		},
		[onSelect],
	)

	// Close on outside click
	useEffect(() => {
		if (!open) return
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [open])

	return (
		<div ref={ref} className="relative">
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/30"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					role="img"
					aria-label="Buscar"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value)
						setOpen(e.target.value.length > 0)
					}}
					onFocus={() => query.length > 0 && setOpen(true)}
					placeholder="Buscar estado..."
					className="w-full rounded-lg border border-surface-200 bg-white py-2 pl-9 pr-3 text-sm text-primary placeholder:text-primary/30 focus:border-accent/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
				/>
				{query && (
					<button
						type="button"
						onClick={() => {
							setQuery('')
							setOpen(false)
						}}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary/60"
						aria-label="Limpar busca"
					>
						<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} role="img" aria-label="Limpar">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>

			{/* Results dropdown */}
			{open && filtered.length > 0 && (
				<div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
					{filtered.map((state) => (
						<button
							key={state.uf}
							type="button"
							onClick={() => handleSelect(state.uf)}
							className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary hover:bg-surface-50"
						>
							<span className="w-7 shrink-0 text-xs font-semibold text-primary/40">{state.uf}</span>
							<span>{state.name}</span>
						</button>
					))}
				</div>
			)}

			{open && query.length > 0 && filtered.length === 0 && (
				<div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-surface-200 bg-white px-3 py-3 text-center text-xs text-primary/40 shadow-lg">
					Nenhum estado encontrado
				</div>
			)}
		</div>
	)
}
