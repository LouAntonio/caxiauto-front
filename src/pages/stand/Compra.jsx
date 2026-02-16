import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Gauge, Calendar, MapPin, Droplet, Loader2 } from 'lucide-react'
import VehicleFilter from '../../components/VehicleFilter'
import Pagination from '../../components/Pagination'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { API_URL, getImageUrl, notyf } from '../../services/api'

export default function Compra() {
	useDocumentTitle('Compra de Veículos - Caxiauto')
	const navigate = useNavigate()
	const location = useLocation()

	// Verificar se há filtros vindos da navegação (ex: da página inicial)
	const initialFilters = location.state?.filters || {}

	const [filters, setFilters] = useState(initialFilters)
	const [currentPage, setCurrentPage] = useState(1)
	const [vehicles, setVehicles] = useState([])
	const [loading, setLoading] = useState(true)
	const [totalPages, setTotalPages] = useState(1)
	const [totalVehicles, setTotalVehicles] = useState(0)
	const [sortBy, setSortBy] = useState('recent')
	const vehiclesPerPage = 16

	// Função para buscar veículos do backend
	const fetchVehicles = async (customFilters = null) => {
		try {
			setLoading(true)

			// Usar filtros customizados se fornecidos, caso contrário usar os filtros do estado
			const activeFilters = customFilters || filters

			// Construir query params
			const params = new URLSearchParams({
				page: currentPage,
				limit: vehiclesPerPage,
			})

			// Mapear filtros do português para inglês e adicionar à query
			if (activeFilters.marca) params.append('manufacturer', activeFilters.marca)
			if (activeFilters.classe) params.append('class', activeFilters.classe)
			if (activeFilters.combustivel) {
				// Normalizar o combustível para lowercase
				params.append('fuelType', activeFilters.combustivel.toLowerCase())
			}
			if (activeFilters.transmissao) {
				// Normalizar a transmissão para lowercase
				params.append('transmission', activeFilters.transmissao.toLowerCase())
			}

			// Processar faixa de preço
			if (activeFilters.preco) {
				const priceRanges = {
					'Até 5M Kz': { max: 5000000 },
					'Até 10M Kz': { max: 10000000 },
					'Até 15M Kz': { max: 15000000 },
					'Até 20M Kz': { max: 20000000 },
					'Até 30M Kz': { max: 30000000 }
				}
				const range = priceRanges[activeFilters.preco]
				if (range) {
					if (range.min) params.append('minPrice', range.min)
					if (range.max) params.append('maxPrice', range.max)
				}
			}

			// Processar ano
			if (activeFilters.ano && activeFilters.ano !== '') {
				const year = parseInt(activeFilters.ano)
				if (!isNaN(year)) {
					params.append('minYear', year)
				}
			}

			// Processar quilometragem
			if (activeFilters.quilometros) {
				const kmRanges = {
					'Até 50k': 50000,
					'Até 100k': 100000,
					'Até 150k': 150000,
					'Até 200k': 200000,
					'+200k': null
				}
				const maxKm = kmRanges[activeFilters.quilometros]
				if (maxKm) {
					// Note: o backend não tem filtro de km, mas você pode adicionar se necessário
					// params.append('maxKilometers', maxKm)
				}
			}

			// Processar pesquisa de texto (busca no nome e descrição)
			if (activeFilters.pesquisa) {
				params.append('search', activeFilters.pesquisa)
			}

			// Filtro de destaque
			if (activeFilters.destaque) {
				params.append('featured', 'true')
			}

			const response = await api.get(`/compraveiculos?${params.toString()}`)

			if (response.success) {
				setVehicles(response.data)
				setTotalPages(response.pagination.totalPages)
				setTotalVehicles(response.pagination.total)
			} else {
				notyf.error(response.message || 'Erro ao carregar veículos')
			}
		} catch (error) {
			console.error('Erro ao buscar veículos:', error)
			notyf.error('Erro ao carregar veículos')
		} finally {
			setLoading(false)
		}
	}

	// Carregar veículos inicialmente e quando a página mudar
	useEffect(() => {
		fetchVehicles()
	}, [currentPage])

	// Carregar veículos quando há filtros vindos da navegação
	useEffect(() => {
		if (Object.keys(initialFilters).length > 0) {
			fetchVehicles(initialFilters)
		}
	}, [])

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters)
		setCurrentPage(1) // Reset para primeira página ao filtrar
		// Executa a busca imediatamente com os novos filtros
		fetchVehicles(newFilters)
	}

	const handlePageChange = (page) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleSortChange = (e) => {
		setSortBy(e.target.value)
		// TODO: Implementar ordenação no backend se necessário
	}

	// Formatar preço
	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO').format(price)
	}

	// Formatar quilometragem
	const formatKm = (km) => {
		return new Intl.NumberFormat('pt-AO').format(km)
	}

	// Capitalizar primeira letra
	const capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-30"
					style={{
						backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1650&q=80')"
					}}
					aria-hidden="true"
				/>
				<div className="relative max-w-7xl mx-auto px-6 py-16">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">
						Compra de Veículos
					</h1>
					<p className="mt-4 text-lg text-indigo-100 max-w-2xl">
						Encontre o veículo dos seus sonhos. Ofertas exclusivas e as melhores condições de pagamento em Luanda.
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar - Filtros */}
					<aside className="w-full lg:w-80 flex-shrink-0">
						<div className="sticky top-6">
							<h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar Veículos</h2>
							<VehicleFilter 
								onFilterChange={handleFilterChange} 
								initialFilters={initialFilters}
							/>
						</div>
					</aside>

					{/* Main Content - Grid de Veículos */}
					<main className="flex-1">
						<div className="mb-6 flex items-center justify-between">
							<p className="text-gray-600">
								<span className="font-semibold text-gray-900">{totalVehicles} veículos</span> disponíveis
							</p>
							<select
								className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer"
								value={sortBy}
								onChange={handleSortChange}
							>
								<option value="recent">Mais Recentes</option>
								<option value="price-asc">Preço: Menor para Maior</option>
								<option value="price-desc">Preço: Maior para Menor</option>
								<option value="relevance">Ordenar por: Relevância</option>
							</select>
						</div>

						{/* Loading State */}
						{loading ? (
							<div className="flex justify-center items-center py-20">
								<Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
							</div>
						) : vehicles.length === 0 ? (
							<div className="text-center py-20">
								<p className="text-xl text-gray-600">Nenhum veículo encontrado</p>
								<p className="text-gray-500 mt-2">Tente ajustar os filtros de busca</p>
							</div>
						) : (
							<>
								<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-6">
									{vehicles.map((car) => (
										<article
											key={car._id}
											className="flex-shrink-0 w-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
										>
											{/* Imagem */}
											<div className="relative h-40 overflow-hidden">
												<img
													src={getImageUrl(car.mainImage, '/images/i10.jpg')}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													onError={(e) => { e.target.src = '/images/i10.jpg'; }}
												/>

												{/* Badge de condição (Novo / Usado) */}
												<div className="absolute top-4 left-4">
													<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${car.kilometers > 0 ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
														{car.kilometers > 0 ? 'Usado' : 'Novo'}
													</span>
												</div>

												{/* Gradiente inferior */}
												<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
											</div>

											{/* Conteúdo */}
											<div className="p-5">
												<h3 className="text-1xl font-bold text-gray-900 mb-3 line-clamp-1 text-center">
													{car.name}
												</h3>

												{/* Preço */}
												<div
													style={{ color: 'var(--primary)' }}
													className="text-1xl font-bold mb-4 text-center"
												>
													{formatPrice(car.price)},00 akz
												</div>

												{/* Especificações (duas colunas) */}
												<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
													<div className="flex items-center justify-end gap-2">
														<span className="text-right">{formatKm(car.kilometers)}</span>
														<Gauge className="w-4 h-4 text-gray-400" />
													</div>
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-gray-400" />
														<span>{car.year}</span>
													</div>
													<div className="flex items-center justify-end gap-2">
														<span className="text-right">{car.location}</span>
														<MapPin className="w-4 h-4 text-gray-400" />
													</div>
													<div className="flex items-center gap-2">
														<Droplet className="w-4 h-4 text-gray-400" />
														<span>{capitalize(car.fuelType)}</span>
													</div>
												</div>

												{/* Botão */}
												<Link to={`/stand/compra/${car._id}`}>
													<button
														style={{ backgroundColor: 'var(--secondary)' }}
														className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer"
													>
														Ver Detalhes
													</button>
												</Link>
											</div>
										</article>
									))}
								</div>

								{/* Pagination */}
								<div className="mt-12">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							</>
						)}
					</main>
				</div>
			</div>
		</div>
	)
}
