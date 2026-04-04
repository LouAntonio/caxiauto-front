import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function Hero() {
	const navigate = useNavigate()
	const [manufacturers, setManufacturers] = useState([])
	const [filters, setFilters] = useState({
		pesquisa: '',
		marca: '',
		combustivel: '',
		transmissao: '',
		quilometros: '',
		ano: '',
		preco: ''
	})

	// Buscar fabricantes da API
	useEffect(() => {
		const fetchManufacturers = async () => {
			try {
				const response = await api.getManufacturers()
				if (response.success && response.data) {
					setManufacturers(response.data)
				}
			} catch (error) {
				console.error('Erro ao buscar fabricantes:', error)
			}
		}
		fetchManufacturers()
	}, [])

	const handleChange = (field, value) => {
		setFilters(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleSearch = (e) => {
		e.preventDefault()
		// Enviar filtros com valores corretos (marca = ID, combustivel/transmissao = enum UPPERCASE)
		navigate('/stand/compra', { state: { filters } })
	}

	return (
		<header className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-transparent text-white overflow-hidden h-[calc(100vh-80px)]">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60"
				style={{
					backgroundImage:
						"url('./images/caxiauto-hero.jpeg')",
				}}
				aria-hidden="true"
			/>

			<div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center gap-8">
				<div className="max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">
						Escolha o seu carro online
					</h1>
					<p className="text-indigo-100">Encontre o seu próximo carro sem sair de casa - inspecionado e entregue em Luanda e em todo o país.</p>
				</div>

				<div className="w-full max-w-xl bg-white/75 text-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
					<form onSubmit={handleSearch} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
						<div className="col-span-2 lg:col-span-3">
							<label className="sr-only">Pesquisar</label>
							<input
								type="text"
								value={filters.pesquisa}
								onChange={(e) => handleChange('pesquisa', e.target.value)}
								placeholder="Pesquisar veículo..."
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all hover:bg-white"
							/>
						</div>

						<div>
							<label className="sr-only">Marca</label>
							<select
								value={filters.marca}
								onChange={(e) => handleChange('marca', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Marca</option>
								{manufacturers.map((mfr) => (
									<option key={mfr.id} value={mfr.id}>{mfr.name}</option>
								))}
							</select>
						</div>

						<div>
							<label className="sr-only">Combustível</label>
							<select
								value={filters.combustivel}
								onChange={(e) => handleChange('combustivel', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Combustível</option>
								{FUEL_TYPES.map((fuel) => (
									<option key={fuel.value} value={fuel.value}>{fuel.label}</option>
								))}
							</select>
						</div>

						<div>
							<label className="sr-only">Transmissão</label>
							<select
								value={filters.transmissao}
								onChange={(e) => handleChange('transmissao', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Transmissão</option>
								{TRANSMISSION_TYPES.map((trans) => (
									<option key={trans.value} value={trans.value}>{trans.label}</option>
								))}
							</select>
						</div>

						<div>
							<label className="sr-only">Quilômetros até</label>
							<select
								value={filters.quilometros}
								onChange={(e) => handleChange('quilometros', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Quilômetros até</option>
								<option>Até 50k</option>
								<option>Até 100k</option>
								<option>Até 150k</option>
								<option>Até 200k</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Ano até</label>
							<select
								value={filters.ano}
								onChange={(e) => handleChange('ano', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Ano até</option>
								<option>2026</option>
								<option>2024</option>
								<option>2022</option>
								<option>2020</option>
								<option>2018</option>
								<option>2015</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Preço</label>
							<select
								value={filters.preco}
								onChange={(e) => handleChange('preco', e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none transition-all cursor-pointer hover:bg-white"
							>
								<option value="">Preço até (Kz)</option>
								<option>Até 5M Kz</option>
								<option>Até 10M Kz</option>
								<option>Até 15M Kz</option>
								<option>Até 20M Kz</option>
								<option>Até 30M Kz</option>
							</select>
						</div>

						<div className="lg:col-span-3">
							<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								Pesquisar
							</button>
						</div>

					</form>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 hidden md:grid">
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Garantia de devolução</h3>
						<p className="mt-2 text-sm text-gray-600">Se não ficar satisfeito com o veículo, devolva-o dentro do prazo e reembolsamos.</p>
					</div>
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Compra segura</h3>
						<p className="mt-2 text-sm text-gray-600">Garantimos a condição técnica de cada veículo vendido em Angola.</p>
					</div>
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Garantia de 1 mês</h3>
						<p className="mt-2 text-sm text-gray-600">Receba uma garantia estendida de 1 mês com cada carro.</p>
					</div>
				</div>
			</div>
		</header>
	)
}
