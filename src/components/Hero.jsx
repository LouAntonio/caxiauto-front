import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManufacturers } from '../hooks/queries/useManufacturers'
import { FUEL_TYPES, TRANSMISSION_TYPES } from '../constants/filters'
import { Car, CalendarClock } from 'lucide-react'

export default function Hero() {
	const navigate = useNavigate()
	const { data: manufacturers = [] } = useManufacturers()
	const [mode, setMode] = useState('COMPRA')
	const [filters, setFilters] = useState({
		marca: '',
		combustivel: '',
		transmissao: ''
	})

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

		if (mode === 'COMPRA') {
			navigate('/stand/compra', {
				state: {
					filters: {
						marca: filters.marca,
						combustivel: filters.combustivel,
						transmissao: filters.transmissao
					}
				}
			})
		} else {
			navigate('/servicos/aluguel-de-automoveis', {
				state: {
					filters: {
						manufacturer: filters.marca,
						fuelType: filters.combustivel,
						transmission: filters.transmissao
					}
				}
			})
		}
	}

	return (
		<section id="hero-section" className="relative text-white min-h-[100svh] flex flex-col items-center justify-center">
			<div className="absolute inset-x-0 -top-20 h-[calc(100%+5rem)] overflow-hidden" aria-hidden="true">
				<video
					autoPlay loop muted playsInline
					className="absolute inset-0 w-full h-full object-cover"
				>
					<source src="https://assets.mixkit.co/videos/42364/42364-720.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/60" />
			</div>

			<div className="relative z-10 w-full max-w-3xl px-6 pt-20 pb-16 flex flex-col items-center gap-8">
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

				<div className="w-full max-w-xl bg-white/90 text-[#6b7280] rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#e5e7eb]">
					{/* Switcher */}
					<div className="flex mb-4 bg-gray-100/80 rounded-xl p-1 gap-1" role="tablist" aria-label="Modo de pesquisa">
						<button
							type="button"
							role="tab"
							aria-selected={mode === 'COMPRA'}
							onClick={() => setMode('COMPRA')}
							className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 font-body cursor-pointer ${
								mode === 'COMPRA'
									? 'bg-[#d41120] text-white shadow-md'
									: 'bg-transparent text-[#6b7280] hover:text-[#111827] hover:bg-gray-200/50'
							}`}
						>
							<div className="flex flex-col items-center gap-0.5">
								<div className="flex items-center gap-2">
									<Car className={`w-4 h-4 ${mode === 'COMPRA' ? 'text-white' : 'text-[#6b7280]'}`} />
									<span className="text-sm font-semibold">Compra</span>
								</div>
								<span className={`text-[10px] leading-tight font-medium ${
									mode === 'COMPRA' ? 'text-white/70' : 'text-[#9ca3af]'
								}`}>
									Propriedade
								</span>
							</div>
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={mode === 'ALUGUER'}
							onClick={() => setMode('ALUGUER')}
							className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 font-body cursor-pointer ${
								mode === 'ALUGUER'
									? 'bg-[#d41120] text-white shadow-md'
									: 'bg-transparent text-[#6b7280] hover:text-[#111827] hover:bg-gray-200/50'
							}`}
						>
							<div className="flex flex-col items-center gap-0.5">
								<div className="flex items-center gap-2">
									<CalendarClock className={`w-4 h-4 ${mode === 'ALUGUER' ? 'text-white' : 'text-[#6b7280]'}`} />
									<span className="text-sm font-semibold">Aluguer</span>
								</div>
								<span className={`text-[10px] leading-tight font-medium ${
									mode === 'ALUGUER' ? 'text-white/70' : 'text-[#9ca3af]'
								}`}>
									Temporário
								</span>
							</div>
						</button>
					</div>

					<form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 items-end">
						<div className="w-full sm:flex-1">
							<label className="sr-only">Marca</label>
							<select
								value={filters.marca}
								onChange={(e) => handleChange('marca', e.target.value)}
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-2.5 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-2.5 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
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
								className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-2.5 bg-white outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] cursor-pointer"
							>
								<option value="">Transmissão</option>
								{TRANSMISSION_TYPES.map((trans) => (
									<option key={trans.value} value={trans.value}>{trans.label}</option>
								))}
							</select>
						</div>

						<div className="w-full sm:w-auto">
							<button type="submit" className="w-full sm:w-auto bg-[#d41120] hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all font-body flex items-center justify-center gap-2 group transform active:scale-[0.98] cursor-pointer whitespace-nowrap">
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
