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
		marca: '',
		combustivel: '',
		transmissao: ''
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

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

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
		<section id="hero-section" className="relative text-white overflow-hidden min-h-screen -mt-20 flex flex-col items-center justify-center">
			<video
				autoPlay loop muted playsInline
				className="absolute inset-0 w-full h-full object-cover"
			>
				<source src="https://assets.mixkit.co/videos/42364/42364-720.mp4" type="video/mp4" />
			</video>

			<div className="absolute inset-0 bg-black/60" aria-hidden="true" />

			<div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center gap-8">
				<div className="text-center max-w-xl flex flex-col items-center gap-6">
					<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md [text-wrap:balance]">
						Escolha o seu <span className="text-[#d41120]">carro</span> online
					</h1>

					<div className="flex justify-center">
						<div className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${heroLineDrawn ? 'w-40' : 'w-0'}`} />
					</div>

					<p className="font-body text-lg text-white/80 leading-relaxed">
						Encontre o seu próximo carro sem sair de casa — inspecionado e entregue em Luanda e em todo o país.
					</p>
				</div>

				<div className="w-full max-w-xl bg-white/90 text-[#6b7280] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e5e7eb]">
					<form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
						<div className="w-full sm:flex-1">
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

						<div className="w-full sm:flex-1">
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

						<div className="w-full sm:flex-1">
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

						<div className="w-full sm:w-auto">
							<button type="submit" className="w-full sm:w-auto bg-[#d41120] hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all font-body flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer whitespace-nowrap">
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
