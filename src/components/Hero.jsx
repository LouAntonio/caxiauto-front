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
		<section id="hero-section" className="relative bg-gradient-to-r from-[#154c9a] via-[#0c2d5e] to-transparent text-white overflow-hidden min-h-screen -mt-20 flex flex-col justify-center">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-30"
				style={{
					backgroundImage:
						"url('./images/caxiauto-hero.jpeg')",
				}}
				aria-hidden="true"
			/>

			<div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col gap-8 pb-24 pt-20">
				<div className="max-w-3xl">
					<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md [text-wrap:balance]">
						Escolha o seu carro online
					</h1>
					<p className="font-body text-lg text-blue-100/80 mt-4 max-w-xl">
						Encontre o seu próximo carro sem sair de casa — inspecionado e entregue em Luanda e em todo o país.
					</p>
				</div>

				<div className="w-full max-w-xl bg-white/90 text-[#6b7280] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e5e7eb]">
					<form onSubmit={handleSearch} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
						<div className="col-span-2 lg:col-span-3">
							<label className="sr-only">Pesquisar</label>
							<input
								type="text"
								value={filters.pesquisa}
								onChange={(e) => handleChange('pesquisa', e.target.value)}
								placeholder="Pesquisar veículo..."
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
							/>
						</div>

						<div>
							<label className="sr-only">Marca</label>
							<select
								value={filters.marca}
								onChange={(e) => handleChange('marca', e.target.value)}
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
							<button type="submit" className="w-full bg-[#d41120] hover:bg-red-700 text-white font-semibold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all font-body flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								Pesquisar
							</button>
						</div>

					</form>
				</div>
			</div>
		</section>
	)
}
