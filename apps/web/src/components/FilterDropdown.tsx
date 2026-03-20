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
				type="button"
				onClick={() => setOpen(!open)}
				className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all ${
					hasSelection
						? 'border-accent/30 bg-accent/5 text-primary'
						: 'border-surface-200 bg-white text-surface-300 hover:border-surface-300'
				}`}
			>
				<span className="truncate">{hasSelection ? `${label} (${selected.length})` : label}</span>
				<svg
					className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					role="img"
					aria-label="Expand"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{/* Dropdown panel */}
			{open && (
				<div className="absolute left-0 right-0 z-50 mt-1 animate-fade-in rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
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
