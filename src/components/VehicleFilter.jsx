import React, { useState, useEffect } from 'react'
import { Search, RotateCcw, Car, Fuel, Settings, Gauge, Calendar, Wallet } from 'lucide-react'
import { useManufacturers, useClasses } from '../hooks/queries/useManufacturers'

const FUEL_TYPES = [
	{ value: 'GASOLINE', label: 'Gasolina' },
	{ value: 'DIESEL', label: 'Diesel' },
	{ value: 'ELECTRIC', label: 'Elétrico' },
	{ value: 'HYBRID', label: 'Híbrido' },
]

const TRANSMISSION_TYPES = [
	{ value: 'MANUAL', label: 'Manual' },
	{ value: 'AUTOMATIC', label: 'Automática' },
	{ value: 'SEMI_AUTOMATIC', label: 'Semi-Automática' },
]

const KM_RANGES = [
	{ value: '', label: 'Qualquer' },
	{ value: '0-50000', label: 'Até 50k' },
	{ value: '0-100000', label: 'Até 100k' },
	{ value: '0-150000', label: 'Até 150k' },
	{ value: '0-200000', label: 'Até 200k' },
	{ value: '200001-9999999', label: '+200k' },
]

const PRICE_RANGES = [
	{ value: '', label: 'Sem limite' },
	{ value: '0-5000000', label: 'Até 5M Kz' },
	{ value: '0-10000000', label: 'Até 10M Kz' },
	{ value: '0-15000000', label: 'Até 15M Kz' },
	{ value: '0-20000000', label: 'Até 20M Kz' },
	{ value: '0-30000000', label: 'Até 30M Kz' },
]

export default function VehicleFilter({ onFilterChange, initialFilters = {}, showSearch = true }) {
	const { data: manufacturers = [] } = useManufacturers()
	const { data: classes = [] } = useClasses()
	const [filters, setFilters] = useState({
		pesquisa: '',
		marca: '',
		classe: '',
		combustivel: '',
		transmissao: '',
		quilometros: '',
		ano: '',
		preco: '',
		destaque: false,
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
			pesquisa: '',
			marca: '',
			classe: '',
			combustivel: '',
			transmissao: '',
			quilometros: '',
			ano: '',
			preco: '',
			destaque: false
		}
		setFilters(resetFilters)
		if (onFilterChange) {
			onFilterChange(resetFilters)
		}
	}

	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

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
							value={filters.pesquisa}
							onChange={(e) => handleChange('pesquisa', e.target.value)}
							placeholder="Ex: Toyota Corolla, Honda..."
							className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 bg-white outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280] placeholder:text-gray-400"
						/>
					</div>
				)}

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Car className="w-3.5 h-3.5 text-[#154c9a]" />
							Marca
						</label>
						<select
							value={filters.marca}
							onChange={(e) => handleChange('marca', e.target.value)}
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
							value={filters.classe}
							onChange={(e) => handleChange('classe', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todas</option>
							{classes.map((cls) => (
								<option key={cls.id} value={cls.id}>{cls.name}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Fuel className="w-3.5 h-3.5 text-[#154c9a]" />
							Combustível
						</label>
						<select
							value={filters.combustivel}
							onChange={(e) => handleChange('combustivel', e.target.value)}
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
							value={filters.transmissao}
							onChange={(e) => handleChange('transmissao', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							<option value="">Todas</option>
							{TRANSMISSION_TYPES.map((trans) => (
								<option key={trans.value} value={trans.value}>{trans.label}</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
							<Calendar className="w-3.5 h-3.5 text-[#154c9a]" />
							Ano
						</label>
						<select
							value={filters.ano}
							onChange={(e) => handleChange('ano', e.target.value)}
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
							<Gauge className="w-3.5 h-3.5 text-[#154c9a]" />
							Quilometragem
						</label>
						<select
							value={filters.quilometros}
							onChange={(e) => handleChange('quilometros', e.target.value)}
							className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
						>
							{KM_RANGES.map((km) => (
								<option key={km.value} value={km.value}>{km.label}</option>
							))}
						</select>
					</div>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#6b7280]">
						<Wallet className="w-3.5 h-3.5 text-[#154c9a]" />
						Preço
					</label>
					<select
						value={filters.preco}
						onChange={(e) => handleChange('preco', e.target.value)}
						className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white outline-none transition-all cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm text-[#6b7280]"
					>
						{PRICE_RANGES.map((range) => (
							<option key={range.value} value={range.value}>{range.label}</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<input
							id="destaque"
							type="checkbox"
							checked={filters.destaque}
							onChange={(e) => handleChange('destaque', e.target.checked)}
							className="w-4 h-4 text-[#d41120] border-2 border-[#e5e7eb] rounded accent-[#d41120]"
						/>
						<label htmlFor="destaque" className="font-body text-sm text-[#6b7280] cursor-pointer">
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
