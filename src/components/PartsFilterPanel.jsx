import React from 'react'
import { Search, Layers, MapPin, RotateCcw } from 'lucide-react'

const PROVINCIAS = [
	'LUANDA', 'BENGUELA', 'HUAMBO', 'HUILA', 'CABINDA', 'NAMIBE',
	'BENGO', 'CUANZA_NORTE', 'CUANZA_SUL', 'CUNENE', 'BIE', 'MOXICO',
	'LUNDA_NORTE', 'LUNDA_SUL', 'UIGE', 'ZAIRE', 'CUANDO_CUBANGO', 'MALANJE'
]

export default function PartsFilterPanel({
	showSearch = true,
	searchTerm = '',
	onSearchTermChange,
	categories = [],
	selectedCategory = '',
	onCategoryChange,
	selectedProvincia = '',
	onProvinciaChange,
	featuredOnly = false,
	onFeaturedOnlyChange,
	onApplyFilters,
	onClearFilters
}) {
	return (
		<div className="w-full bg-white text-[#6b7280] rounded-2xl border border-[#e5e7eb] p-6">
			<div className="space-y-4">
				{showSearch && (
					<div className="space-y-2">
						<label className="flex items-center gap-2 font-body text-sm font-semibold text-[#6b7280]">
							<Search className="w-4 h-4 text-[#154c9a]" />
							Pesquisar
						</label>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							placeholder="Ex: Filtro de óleo, pastilha..."
							className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] placeholder:text-gray-400"
						/>
					</div>
				)}

				<div className="space-y-2">
					<label className="flex items-center gap-2 font-body text-sm font-semibold text-[#6b7280]">
						<Layers className="w-4 h-4 text-[#154c9a]" />
						Categorias
					</label>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => onCategoryChange('')}
							className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
								selectedCategory === ''
									? 'bg-[#154c9a] text-white shadow-md'
									: 'bg-[#eef3fa] text-[#6b7280] hover:bg-[#dce5f5]'
							}`}
						>
							<Layers className="w-4 h-4" />
							<span>Todas</span>
						</button>

						{categories.map((category) => (
							<button
								type="button"
								key={category.id}
								onClick={() => onCategoryChange(category.id)}
								className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
									selectedCategory === category.id
										? 'bg-[#154c9a] text-white shadow-md'
										: 'bg-[#eef3fa] text-[#6b7280] hover:bg-[#dce5f5]'
								}`}
							>
								<Layers className="w-4 h-4" />
								<span className="capitalize">{category.name}</span>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-2 font-body text-sm font-semibold text-[#6b7280]">
						<MapPin className="w-4 h-4 text-[#154c9a]" />
						Província
					</label>
					<select
						value={selectedProvincia}
						onChange={(e) => onProvinciaChange(e.target.value)}
						className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] cursor-pointer"
					>
						<option value="">Todas</option>
						{PROVINCIAS.map((prov) => (
							<option key={prov} value={prov}>
								{prov.charAt(0) + prov.slice(1).toLowerCase().replace('_', ' ')}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<input
							id="featuredPart"
							type="checkbox"
							checked={featuredOnly}
							onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
							className="w-4 h-4 text-[#d41120] border-2 border-[#e5e7eb] rounded accent-[#d41120]"
						/>
						<label htmlFor="featuredPart" className="font-body text-sm text-[#6b7280] cursor-pointer">
							Apenas peças em destaque
						</label>
					</div>
				</div>

				<div className="border-t border-[#e5e7eb] pt-4 mt-6"></div>

				<div className="space-y-3">
					<button
						type="button"
						onClick={onApplyFilters}
						className="w-full bg-[#d41120] hover:bg-[#b80f1c] text-white font-semibold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-body flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer"
					>
						<Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
						Pesquisar
					</button>

					<button
						type="button"
						onClick={onClearFilters}
						className="w-full bg-[#eef3fa] hover:bg-[#dce5f5] text-[#154c9a] font-semibold py-3 rounded-2xl transition-all duration-300 font-body flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
					>
						<RotateCcw className="w-4 h-4" />
						Limpar Filtros
					</button>
				</div>
			</div>
		</div>
	)
}
