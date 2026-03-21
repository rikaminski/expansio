import { useCallback, useEffect, useRef, useState } from 'react'

interface FilterDropdownProps<T extends string> {
	label: string
	options: T[]
	selected: T[]
	onChange: (value: T[]) => void
}

export default function FilterDropdown<T extends string>({
	label,
	options,
	selected,
	onChange,
}: FilterDropdownProps<T>) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

	// Calculate fixed position when opening — flip up if no space below
	useEffect(() => {
		if (open && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect()
			const panelHeight = 250 // estimated max height
			const spaceBelow = window.innerHeight - rect.bottom
			const flipUp = spaceBelow < panelHeight && rect.top > panelHeight

			setPanelStyle({
				position: 'fixed',
				...(flipUp
					? { bottom: window.innerHeight - rect.top + 4 }
					: { top: rect.bottom + 4 }),
				left: rect.left,
				width: rect.width,
				zIndex: 9999,
			})
		}
	}, [open])

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

	const toggle = useCallback(
		(option: T) => {
			if (selected.includes(option)) {
				onChange(selected.filter((s) => s !== option))
			} else {
				onChange([...selected, option])
			}
		},
		[selected, onChange],
	)

	const clear = useCallback(() => onChange([]), [onChange])

	const hasSelection = selected.length > 0

	return (
		<div ref={ref} className="relative">
			{/* Trigger button */}
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(!open)}
				className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all ${
					hasSelection
						? 'border-accent/30 bg-accent/5 text-primary'
						: 'border-surface-200 bg-white text-surface-300 hover:border-surface-300'
				}`}
			>
				<span className="truncate">{label}</span>
				<div className="flex shrink-0 items-center gap-1">
					{hasSelection && (
						<button
							type="button"
							className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-[10px] font-semibold text-accent"
							onClick={(e) => {
								e.stopPropagation()
								clear()
							}}
							aria-label="Limpar"
						>
							×
						</button>
					)}
					<svg
						className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						role="img"
						aria-label="Expand"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</button>

			{/* Selection chips */}
			{hasSelection && !open && (
				<div className="mt-1.5 flex flex-wrap gap-1">
					{selected.map((item) => (
						<span
							key={item}
							className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
						>
							{item}
							<button
								type="button"
								onClick={() => toggle(item)}
								className="ml-0.5 text-accent/50 transition-colors hover:text-accent"
								aria-label={`Remover ${item}`}
							>
								×
							</button>
						</span>
					))}
				</div>
			)}

			{/* Dropdown panel — fixed position to avoid scroll issues */}
			{open && (
				<div
					style={panelStyle}
					className="animate-fade-in rounded-lg border border-surface-200 bg-white py-1 shadow-lg"
				>
					{hasSelection && (
						<button
							type="button"
							onClick={clear}
							className="mb-1 w-full border-b border-surface-100 px-3 py-1.5 text-left text-xs text-danger hover:bg-danger/5"
						>
							Limpar seleção
						</button>
					)}
					<div className="max-h-48 overflow-y-auto">
						{options.map((option) => {
							const isChecked = selected.includes(option)
							return (
								<label
									key={option}
									className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-surface-50"
								>
									<input
										type="checkbox"
										className="sr-only"
										checked={isChecked}
										onChange={() => toggle(option)}
									/>
									<div
										className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
											isChecked ? 'border-accent bg-accent text-white' : 'border-surface-300'
										}`}
									>
										{isChecked && (
											<svg
												className="h-3 w-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={3}
												role="img"
												aria-label="Checked"
											>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										)}
									</div>
									<span className={isChecked ? 'font-medium text-primary' : 'text-primary/70'}>
										{option}
									</span>
								</label>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
