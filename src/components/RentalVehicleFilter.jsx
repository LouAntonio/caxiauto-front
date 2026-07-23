import React, { useState, useEffect } from 'react'
import { Search, RotateCcw, Car, Fuel, Settings, Calendar, Wallet } from 'lucide-react'
import { useManufacturers, useClasses } from '../hooks/queries/useManufacturers'
import { FUEL_TYPES, TRANSMISSION_TYPES } from '../constants/filters'

export default function RentalVehicleFilter({ onFilterChange, initialFilters = {}, showSearch = true }) {
	const { data: manufacturers = [] } = useManufacturers()
	const { data: classes = [] } = useClasses()
	const [filters, setFilters] = useState({
		search: '',
		manufacturer: '',
		class: '',
		fuelType: '',
		transmission: '',
		minPrice: '',
		maxPrice: '',
		minYear: '',
		maxYear: '',
		featured: false,
		...initialFilters
	})

	useEffect(() => {
		if (Object.keys(initialFilters).length > 0) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setFilters(prev => ({
				...prev,
				...initialFilters
			}))
		}
	}, [initialFilters])

	const handleChange = (field, value) => {
		const newFilters = {
			...filters,
			[field]: value
		}
		setFilters(newFilters)
	}

	const handleSearch = (e) => {
		e.preventDefault()
		if (onFilterChange) {
			onFilterChange(filters)
		}
	}

	const handleReset = () => {
		const resetFilters = {
			search: '',
			manufacturer: '',
			class: '',
			fuelType: '',
			transmission: '',
			minPrice: '',
			maxPrice: '',
			minYear: '',
			maxYear: '',
			featured: false
		}
		setFilters(resetFilters)
		if (onFilterChange) {
			onFilterChange(resetFilters)
		}
	}

	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: 15 }, (_, i) => currentYear - i)

	return (
		<div className="w-full bg-white text-[#6b7280] rounded-2xl border border-[#e5e7eb] p-6">
			<form onSubmit={handleSearch} className="space-y-4">
				{showSearch && (
					<div className="space-y-2">
						<label className="flex items-center gap-2 font-body text-sm font-semibold text-[#6b7280]">
							<Search className="w-4 h-4 text-[#154c9a]" />
							Pesquisar
						</label>
						<input
							type="text"
							value={filters.search}
							onChange={(e) => handleChange('search', e.target.value)}
							placeholder="Ex: Toyota Corolla, Honda..."
							className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] placeholder:text-gray-400"
						/>
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Car className="w-3.5 h-3.5 text-[#154c9a]" />
							Marca
						</label>
						<select
							value={filters.manufacturer}
							onChange={(e) => handleChange('manufacturer', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todas</option>
							{manufacturers.map((mfr) => (
								<option key={mfr.id} value={mfr.id}>{mfr.name}</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Car className="w-3.5 h-3.5 text-[#154c9a]" />
							Classe
						</label>
						<select
							value={filters.class}
							onChange={(e) => handleChange('class', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todas</option>
							{classes.map((cls) => (
								<option key={cls.id} value={cls.id}>{cls.name}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Fuel className="w-3.5 h-3.5 text-[#154c9a]" />
							Combustível
						</label>
						<select
							value={filters.fuelType}
							onChange={(e) => handleChange('fuelType', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todos</option>
							{FUEL_TYPES.map((fuel) => (
								<option key={fuel.value} value={fuel.value}>{fuel.label}</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Settings className="w-3.5 h-3.5 text-[#154c9a]" />
							Transmissão
						</label>
						<select
							value={filters.transmission}
							onChange={(e) => handleChange('transmission', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todas</option>
							{TRANSMISSION_TYPES.map((trans) => (
								<option key={trans.value} value={trans.value}>{trans.label}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Calendar className="w-3.5 h-3.5 text-[#154c9a]" />
							Ano Mín.
						</label>
						<select
							value={filters.minYear}
							onChange={(e) => handleChange('minYear', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Qualquer</option>
							{years.map(year => (
								<option key={year} value={year}>{year}</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Calendar className="w-3.5 h-3.5 text-[#154c9a]" />
							Ano Máx.
						</label>
						<select
							value={filters.maxYear}
							onChange={(e) => handleChange('maxYear', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Qualquer</option>
							{years.map(year => (
								<option key={year} value={year}>{year}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Wallet className="w-3.5 h-3.5 text-[#154c9a]" />
							Preço Mín.
						</label>
						<input
							type="number"
							value={filters.minPrice}
							onChange={(e) => handleChange('minPrice', e.target.value)}
							placeholder="0 Kz"
							min="0"
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] placeholder:text-gray-400"
						/>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Wallet className="w-3.5 h-3.5 text-[#154c9a]" />
							Preço Máx.
						</label>
						<input
							type="number"
							value={filters.maxPrice}
							onChange={(e) => handleChange('maxPrice', e.target.value)}
							placeholder="Sem limite"
							min="0"
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] placeholder:text-gray-400"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<input
							id="featured"
							type="checkbox"
							checked={filters.featured}
							onChange={(e) => handleChange('featured', e.target.checked)}
							className="w-4 h-4 text-[#d41120] border-2 border-[#e5e7eb] rounded accent-[#d41120]"
						/>
						<label htmlFor="featured" className="font-body text-sm text-[#6b7280] cursor-pointer">
							Apenas veículos em destaque
						</label>
					</div>
				</div>

				<div className="border-t border-[#e5e7eb] pt-4 mt-6"></div>

				<div className="space-y-3">
					<button
						type="submit"
						className="w-full bg-[#d41120] hover:bg-[#b80f1c] text-white font-semibold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-body flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer"
					>
						<Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
						Buscar Veículos
					</button>

					<button
						type="button"
						onClick={handleReset}
						className="w-full bg-[#eef3fa] hover:bg-[#dce5f5] text-[#154c9a] font-semibold py-3 rounded-2xl transition-all duration-300 font-body flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
					>
						<RotateCcw className="w-4 h-4" />
						Limpar Filtros
					</button>
				</div>
			</form>
		</div>
	)
}
