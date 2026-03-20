export default function App() {
	return (
		<div className="flex h-screen w-screen overflow-hidden bg-surface-50">
			{/* Sidebar placeholder */}
			<aside className="w-[350px] shrink-0 border-r border-surface-200 bg-white">
				<div className="flex h-14 items-center gap-3 border-b border-surface-200 px-5">
					<div className="h-8 w-8 rounded-lg bg-accent" />
					<h1 className="font-display text-lg font-bold text-primary">Expansio</h1>
				</div>
				<div className="p-5 text-sm text-surface-300">Sidebar — em breve</div>
			</aside>

			{/* Map area placeholder */}
			<main className="relative flex-1">
				<div className="flex h-full items-center justify-center text-surface-300">
					Mapa — em breve
				</div>
			</main>
		</div>
	)
}
