import React, { useState } from 'react'
import { Search, RotateCcw, Car, Fuel, Settings, Gauge, Calendar, Wallet } from 'lucide-react'

export default function VehicleFilter({ onFilterChange }) {
	const [filters, setFilters] = useState({
		marca: '',
		combustivel: '',
		transmissao: '',
		quilometros: '',
		ano: '',
		preco: ''
	})

	const handleChange = (field, value) => {
		const newFilters = {
			...filters,
			[field]: value
		}
		setFilters(newFilters)
		if (onFilterChange) {
			onFilterChange(newFilters)
		}
	}

	const handleSearch = (e) => {
		e.preventDefault()
		if (onFilterChange) {
			onFilterChange(filters)
		}
	}

	const handleReset = () => {
		const resetFilters = {
			marca: '',
			combustivel: '',
			transmissao: '',
			quilometros: '',
			ano: '',
			preco: ''
		}
		setFilters(resetFilters)
		if (onFilterChange) {
			onFilterChange(resetFilters)
		}
	}

	return (
		<div className="w-full bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100">
			<form onSubmit={handleSearch} className="space-y-4">
				{/* Marca */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Car className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Marca
					</label>
					<select
						value={filters.marca}
						onChange={(e) => handleChange('marca', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Todas as marcas</option>
						<option>Toyota</option>
						<option>Ford</option>
						<option>Chevrolet</option>
						<option>Honda</option>
						<option>Nissan</option>
						<option>Mercedes-Benz</option>
						<option>BMW</option>
						<option>Audi</option>
						<option>Volkswagen</option>
						<option>Hyundai</option>
						<option>Kia</option>
						<option>Mazda</option>
					</select>
				</div>

				{/* Combustível */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Fuel className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Combustível
					</label>
					<select
						value={filters.combustivel}
						onChange={(e) => handleChange('combustivel', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Todos os tipos</option>
						<option>Gasolina</option>
						<option>Diesel</option>
						<option>Elétrico</option>
						<option>Híbrido</option>
					</select>
				</div>

				{/* Transmissão */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Settings className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Transmissão
					</label>
					<select
						value={filters.transmissao}
						onChange={(e) => handleChange('transmissao', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Todas</option>
						<option>Manual</option>
						<option>Automática</option>
					</select>
				</div>

				{/* Quilômetros */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Gauge className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Quilometragem
					</label>
					<select
						value={filters.quilometros}
						onChange={(e) => handleChange('quilometros', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Qualquer</option>
						<option>Até 50.000 km</option>
						<option>Até 100.000 km</option>
						<option>Até 150.000 km</option>
						<option>Até 200.000 km</option>
						<option>Mais de 200.000 km</option>
					</select>
				</div>

				{/* Ano */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Calendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Ano
					</label>
					<select
						value={filters.ano}
						onChange={(e) => handleChange('ano', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Qualquer ano</option>
						<option>2026</option>
						<option>2024</option>
						<option>2022</option>
						<option>2020</option>
						<option>2018</option>
						<option>2015</option>
						<option>2010</option>
					</select>
				</div>

				{/* Preço */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Wallet className="w-4 h-4" style={{ color: 'var(--primary)' }} />
						Preço Máximo
					</label>
					<select
						value={filters.preco}
						onChange={(e) => handleChange('preco', e.target.value)}
						className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 text-gray-700 font-medium"
					>
						<option value="">Sem limite</option>
						<option>Até 5.000.000 Kz</option>
						<option>Até 10.000.000 Kz</option>
						<option>Até 15.000.000 Kz</option>
						<option>Até 20.000.000 Kz</option>
						<option>Até 30.000.000 Kz</option>
						<option>Mais de 30.000.000 Kz</option>
					</select>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-200 pt-4 mt-6"></div>

				{/* Botões */}
				<div className="space-y-3">
					<button
						type="submit"
						style={{ backgroundColor: 'var(--secondary)' }}
						className="w-full hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
					>
						<Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
						Buscar Veículos
					</button>

					<button
						type="button"
						onClick={handleReset}
						className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
					>
						<RotateCcw className="w-4 h-4" />
						Limpar Filtros
					</button>
				</div>
			</form>
		</div>
	)
}
