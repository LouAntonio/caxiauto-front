import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function MobileFilterBar({
	value,
	onChange,
	onSubmit,
	onOpenFilters,
	placeholder = 'Pesquisar...'
}) {
	const handleSubmit = (e) => {
		e.preventDefault()
		if (onSubmit) {
			onSubmit()
		}
	}

	return (
		<form onSubmit={handleSubmit} className="lg:hidden mb-6">
			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<input
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="w-full border-2 border-gray-200 rounded-xl pl-4 pr-12 py-3 bg-white outline-none transition-all hover:border-indigo-300 text-gray-700 text-sm placeholder:text-gray-400"
					/>
					<button
						type="submit"
						className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
						aria-label="Pesquisar"
					>
						<Search className="w-4 h-4" />
					</button>
				</div>
				<button
					type="button"
					onClick={onOpenFilters}
					style={{ backgroundColor: 'var(--primary)' }}
					className="w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity cursor-pointer"
					aria-label="Abrir filtros"
				>
					<SlidersHorizontal className="w-5 h-5" />
				</button>
			</div>
		</form>
	)
}
