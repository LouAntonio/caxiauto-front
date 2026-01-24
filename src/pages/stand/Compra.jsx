import React, { useState } from 'react'
import { Gauge, Calendar, MapPin, Droplet } from 'lucide-react'
import VehicleFilter from '../../components/VehicleFilter'
import Pagination from '../../components/Pagination'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function Compra() {
	useDocumentTitle('Compra de Veículos - Caxiauto')

	const [filters, setFilters] = useState({})
	const [currentPage, setCurrentPage] = useState(1)
	const vehiclesPerPage = 16

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters)
		setCurrentPage(1) // Reset para primeira página ao filtrar
		console.log('Filtros aplicados:', newFilters)
		// Aqui você pode aplicar a lógica de filtragem dos veículos
	}

	const handlePageChange = (page) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Dados de exemplo dos veículos
	const vehicles = [
		{ id: 1, title: 'Toyota Corolla 2024', price: '18.500.000', image: './images/i10.jpg', km: '15.000 km', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 2, title: 'Honda CR-V 2023', price: '22.000.000', image: './images/i10.jpg', km: '28.500 km', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 3, title: 'Ford Ranger 2024', price: '28.500.000', image: './images/i10.jpg', km: '10.200 km', year: 2024, location: 'Luanda', fuel: 'Diesel', condition: 'Novo' },
		{ id: 4, title: 'Chevrolet Onix 2023', price: '12.800.000', image: './images/i10.jpg', km: '32.400 km', year: 2023, location: 'Benguela', fuel: 'Gasolina', condition: 'Usado' },

		{ id: 5, title: 'Toyota RAV4 2024', price: '25.000.000', image: './images/i10.jpg', km: '8.900 km', year: 2024, location: 'Luanda', fuel: 'Híbrido', condition: 'Novo' },
		{ id: 6, title: 'Nissan Kicks 2023', price: '15.500.000', image: './images/i10.jpg', km: '25.600 km', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 7, title: 'Hyundai Tucson 2024', price: '21.000.000', image: './images/i10.jpg', km: '12.300 km', year: 2024, location: 'Huambo', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 8, title: 'Ford EcoSport 2023', price: '17.500.000', image: './images/i10.jpg', km: '38.700 km', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },

		{ id: 9, title: 'Mercedes-Benz Classe A', price: '32.000.000', image: './images/i10.jpg', km: '18.200 km', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 10, title: 'BMW X1 2024', price: '38.000.000', image: './images/i10.jpg', km: '5.400 km', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 11, title: 'Volkswagen T-Cross 2023', price: '19.000.000', image: './images/i10.jpg', km: '29.800 km', year: 2023, location: 'Benguela', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 12, title: 'Kia Sportage 2024', price: '23.500.000', image: './images/i10.jpg', km: '11.500 km', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },

		{ id: 13, title: 'Toyota Hilux 2024', price: '35.000.000', image: './images/i10.jpg', km: '7.800 km', year: 2024, location: 'Luanda', fuel: 'Diesel', condition: 'Novo' },
		{ id: 14, title: 'Honda Civic 2023', price: '20.000.000', image: './images/i10.jpg', km: '35.200 km', year: 2023, location: 'Huambo', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 15, title: 'Mazda CX-5 2024', price: '26.500.000', image: './images/i10.jpg', km: '14.600 km', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 16, title: 'Audi A3 2023', price: '33.000.000', image: './images/i10.jpg', km: '22.100 km', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' }
	]

	// Cálculos de paginação
	const totalPages = Math.ceil(vehicles.length / vehiclesPerPage)
	const indexOfLastVehicle = currentPage * vehiclesPerPage
	const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage
	const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle)

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
							<VehicleFilter onFilterChange={handleFilterChange} />

							{/* Informações Adicionais */}
							<div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
								<h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
									<svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									Por que comprar conosco?
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Veículos inspecionados</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Garantia de qualidade</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Documentação completa</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Financiamento facilitado</span>
									</li>
								</ul>
							</div>
						</div>
					</aside>

					{/* Main Content - Grid de Veículos */}
					<main className="flex-1">
						<div className="mb-6 flex items-center justify-between">
							<p className="text-gray-600">
								<span className="font-semibold text-gray-900">{vehicles.length} veículos</span> disponíveis
							</p>
							<select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
								<option>Ordenar por: Relevância</option>
								<option>Preço: Menor para Maior</option>
								<option>Preço: Maior para Menor</option>
								<option>Mais Recentes</option>
							</select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
							{currentVehicles.map((car) => (
								<article
									key={car.id}
									className="flex-shrink-0 w-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
								>
									{/* Imagem */}
									<div className="relative h-40 overflow-hidden">
										<img
											src={car.image}
											alt={car.title}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>

										{/* Badge de condição (Novo / Usado) */}
										<div className="absolute top-4 left-4">
											<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${car.condition === 'Novo' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
												{car.condition}
											</span>
										</div>

										{/* Gradiente inferior */}
										<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
									</div>

									{/* Conteúdo */}
									<div className="p-5">
										<h3 className="text-1xl font-bold text-gray-900 mb-3 line-clamp-1 text-center">
											{car.title}
										</h3>

										{/* Preço */}
										<div
											style={{ color: 'var(--primary)' }}
											className="text-1xl font-bold mb-4 text-center"
										>
											{car.price},00 akz
										</div>

										{/* Especificações (duas colunas) */}
										<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
											<div className="flex items-center justify-end gap-2">
												<span className="text-right">{car.km}</span>
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
												<span>{car.fuel}</span>
											</div>
										</div>

										{/* Botão */}
										<button
											style={{ backgroundColor: 'var(--secondary)' }}
											className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
										>
											Ver Detalhes
										</button>
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
					</main>
				</div>
			</div>
		</div>
	)
}
