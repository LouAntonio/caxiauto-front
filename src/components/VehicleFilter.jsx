import React, { useState, useEffect } from 'react'
import { Search, RotateCcw, Car, Fuel, Settings, Gauge, Calendar, Wallet } from 'lucide-react'
import api from '../services/api'

// Enums alinhados com o schema (FuelType e TransmissionType)
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

export default function VehicleFilter({ onFilterChange, initialFilters = {}, showSearch = true }) {
	const [manufacturers, setManufacturers] = useState([])
	const [classes, setClasses] = useState([])
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

	// Buscar fabricantes e classes da API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [mfrRes, clsRes] = await Promise.all([
					api.getManufacturers(),
					api.getClasses()
				])
				if (mfrRes.success && mfrRes.data) {
					setManufacturers(mfrRes.data)
				}
				if (clsRes.success && clsRes.data) {
					setClasses(clsRes.data)
				}
			} catch (error) {
				console.error('Erro ao buscar fabricantes/classes:', error)
			}
		}
		fetchData()
	}, [])

	// Atualizar filtros quando initialFilters mudar
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
		// Não executa busca automática - aguarda clique nos botões
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

	return (
		<div className="w-full bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100">
			<form onSubmit={handleSearch} className="space-y-4">
				{/* Pesquisa de Texto */}
				{showSearch && (
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Search className="w-4 h-4" style={{ color: 'var(--primary)' }} />
							Pesquisar
						</label>
						<input
							type="text"
							value={filters.pesquisa}
							onChange={(e) => handleChange('pesquisa', e.target.value)}
							placeholder="Ex: Toyota Corolla, Honda..."
							className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition-all hover:border-indigo-300 text-gray-700 text-sm placeholder:text-gray-400"
						/>
					</div>
				)}

				{/* Marca e Classe (Grid 2 colunas) */}
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Car className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Marca
						</label>
						<select
							value={filters.marca}
							onChange={(e) => handleChange('marca', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Todas</option>
							{manufacturers.map((mfr) => (
								<option key={mfr.id} value={mfr.id}>{mfr.name}</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Car className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Classe
						</label>
						<select
							value={filters.classe}
							onChange={(e) => handleChange('classe', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Todas</option>
							{classes.map((cls) => (
								<option key={cls.id} value={cls.id}>{cls.name}</option>
							))}
						</select>
					</div>
				</div>

				{/* Combustível e Transmissão (Grid 2 colunas) */}
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Fuel className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Combustível
						</label>
						<select
							value={filters.combustivel}
							onChange={(e) => handleChange('combustivel', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Todos</option>
							{FUEL_TYPES.map((fuel) => (
								<option key={fuel.value} value={fuel.value}>{fuel.label}</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Settings className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Transmissão
						</label>
						<select
							value={filters.transmissao}
							onChange={(e) => handleChange('transmissao', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Todas</option>
							{TRANSMISSION_TYPES.map((trans) => (
								<option key={trans.value} value={trans.value}>{trans.label}</option>
							))}
						</select>
					</div>
				</div>

				{/* Ano e Quilometragem (Grid 2 colunas) */}
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Calendar className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Ano
						</label>
						<select
							value={filters.ano}
							onChange={(e) => handleChange('ano', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Qualquer</option>
							<option>2026</option>
							<option>2024</option>
							<option>2022</option>
							<option>2020</option>
							<option>2018</option>
							<option>2015</option>
							<option>2010</option>
						</select>
					</div>

					<div className="space-y-2">
						<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
							<Gauge className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
							Km
						</label>
						<select
							value={filters.quilometros}
							onChange={(e) => handleChange('quilometros', e.target.value)}
							className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
						>
							<option value="">Qualquer</option>
							<option>Até 50k</option>
							<option>Até 100k</option>
							<option>Até 150k</option>
							<option>Até 200k</option>
							<option>+200k</option>
						</select>
					</div>
				</div>

				{/* Preço (largura completa) */}
				<div className="space-y-2">
					<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
						<Wallet className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
						Preço Máximo
					</label>
					<select
						value={filters.preco}
						onChange={(e) => handleChange('preco', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-white outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 text-sm"
					>
						<option value="">Sem limite</option>
						<option>Até 5M Kz</option>
						<option>Até 10M Kz</option>
						<option>Até 15M Kz</option>
						<option>Até 20M Kz</option>
						<option>Até 30M Kz</option>
					</select>
				</div>

				{/* Filtro de Destaque */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<input
							id="destaque"
							type="checkbox"
							checked={filters.destaque}
							onChange={(e) => handleChange('destaque', e.target.checked)}
							className="w-4 h-4 text-yellow-500 border-2 border-gray-300 rounded"
						/>
						<label htmlFor="destaque" className="text-sm text-gray-700 cursor-pointer">
							Apenas veículos em destaque
						</label>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-200 pt-4 mt-6"></div>

				{/* Botões */}
				<div className="space-y-3">
					<button
						type="submit"
						style={{ backgroundColor: 'var(--secondary)' }}
						className="w-full hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer"
					>
						<Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
						Buscar Veículos
					</button>

					<button
						type="button"
						onClick={handleReset}
						className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
					>
						<RotateCcw className="w-4 h-4" />
						Limpar Filtros
					</button>
				</div>
			</form>
		</div>
	)
}
