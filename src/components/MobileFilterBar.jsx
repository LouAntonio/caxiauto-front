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
						className="w-full border border-[#e5e7eb] rounded-xl pl-4 pr-12 py-3 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 text-[#6b7280] text-sm font-body placeholder:text-gray-400"
					/>
					<button
						type="submit"
						className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#eef3fa] text-[#6b7280] flex items-center justify-center transition-colors cursor-pointer"
						aria-label="Pesquisar"
					>
						<Search className="w-4 h-4" />
					</button>
				</div>
				<button
					type="button"
					onClick={onOpenFilters}
					className="w-11 h-11 rounded-xl bg-[#154c9a] text-white flex items-center justify-center shadow-md hover:bg-[#0c2d5e] transition-colors cursor-pointer"
					aria-label="Abrir filtros"
				>
					<SlidersHorizontal className="w-5 h-5" />
				</button>
			</div>
		</form>
	)
}
