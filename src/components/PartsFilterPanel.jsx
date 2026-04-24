import React from 'react'
import { Search, Layers, MapPin, X } from 'lucide-react'

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
		<div className="w-full bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100">
			<div className="space-y-4">
				{showSearch && (
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Search className="w-4 h-4" style={{ color: 'var(--primary)' }} />
							Pesquisar
						</label>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							placeholder="Ex: Filtro de óleo, pastilha..."
							className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition-all hover:border-indigo-300 text-gray-700 text-sm placeholder:text-gray-400"
						/>
					</div>
				)}

				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Layers className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Categorias
					</label>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => onCategoryChange('')}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === ''
								? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
								: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
							}`}
						>
							<Layers className="w-4 h-4" />
							<span>Todas</span>
							{selectedCategory === '' && (
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							)}
						</button>

						{categories.map((category) => (
							<button
								type="button"
								key={category.id}
								onClick={() => onCategoryChange(category.id)}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${selectedCategory === category.id
									? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
									: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
								}`}
							>
								<Layers className="w-4 h-4" />
								<span className="capitalize">{category.name}</span>
								{selectedCategory === category.id && (
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
								)}
							</button>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Província
					</label>
					<select
						value={selectedProvincia}
						onChange={(e) => onProvinciaChange(e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition-all hover:border-indigo-300 text-gray-700 text-sm cursor-pointer"
					>
						<option value="">Todas</option>
						{PROVINCIAS.map((prov) => (
							<option key={prov} value={prov}>{prov.charAt(0) + prov.slice(1).toLowerCase().replace('_', ' ')}</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={featuredOnly}
							onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
							className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded"
						/>
						<span className="text-sm text-gray-700">
							Mostrar apenas peças em destaque
						</span>
					</label>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						type="button"
						onClick={onApplyFilters}
						style={{ backgroundColor: 'var(--primary)' }}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
					>
						<Search className="w-4 h-4" />
						Pesquisar
					</button>
					<button
						type="button"
						onClick={onClearFilters}
						className="px-3 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
						title="Limpar filtros"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	)
}
