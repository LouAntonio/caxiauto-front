import React, { useState } from 'react'
import { Package, Star, ShoppingCart, Search, Wrench, Zap, Lightbulb, Users, Box, Layers, Settings, Filter } from 'lucide-react'
import Pagination from '../../components/Pagination'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function PecasAcessorios() {
	useDocumentTitle('Peças e Acessórios - Caxiauto')

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('Todas')
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 16

	const handlePageChange = (page) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Categorias
	const categories = [
		'Todas',
		'Motor',
		'Transmissão',
		'Suspensão',
		'Freios',
		'Elétrica',
		'Iluminação',
		'Interior',
		'Exterior',
		'Acessórios'
	]

	// Dados de exemplo das peças
	const parts = [
		{ id: 1, name: 'Filtro de Óleo', category: 'Motor', price: '3.500', image: './images/i10.jpg', rating: 4.5, stock: 25 },
		{ id: 2, name: 'Pastilha de Freio', category: 'Freios', price: '8.500', image: './images/i10.jpg', rating: 4.8, stock: 15 },
		{ id: 3, name: 'Bateria 60Ah', category: 'Elétrica', price: '45.000', image: './images/i10.jpg', rating: 4.7, stock: 8 },
		{ id: 4, name: 'Amortecedor Dianteiro', category: 'Suspensão', price: '35.000', image: './images/i10.jpg', rating: 4.6, stock: 12 },

		{ id: 5, name: 'Disco de Freio', category: 'Freios', price: '15.000', image: './images/i10.jpg', rating: 4.5, stock: 20 },
		{ id: 6, name: 'Farol LED', category: 'Iluminação', price: '28.000', image: './images/i10.jpg', rating: 4.9, stock: 10 },
		{ id: 7, name: 'Correia Dentada', category: 'Motor', price: '12.500', image: './images/i10.jpg', rating: 4.4, stock: 18 },
		{ id: 8, name: 'Tapete Automotivo', category: 'Interior', price: '6.500', image: './images/i10.jpg', rating: 4.3, stock: 30 },

		{ id: 9, name: 'Velas de Ignição', category: 'Motor', price: '4.200', image: './images/i10.jpg', rating: 4.6, stock: 40 },
		{ id: 10, name: 'Embreagem Kit', category: 'Transmissão', price: '65.000', image: './images/i10.jpg', rating: 4.7, stock: 6 },
		{ id: 11, name: 'Retrovisor Elétrico', category: 'Exterior', price: '18.500', image: './images/i10.jpg', rating: 4.5, stock: 14 },
		{ id: 12, name: 'Central Multimídia', category: 'Acessórios', price: '85.000', image: './images/i10.jpg', rating: 4.8, stock: 5 },

		{ id: 13, name: 'Filtro de Ar', category: 'Motor', price: '5.500', image: './images/i10.jpg', rating: 4.4, stock: 35 },
		{ id: 14, name: 'Sensor de Estacionamento', category: 'Acessórios', price: '32.000', image: './images/i10.jpg', rating: 4.6, stock: 11 },
		{ id: 15, name: 'Lâmpada LED H7', category: 'Iluminação', price: '7.800', image: './images/i10.jpg', rating: 4.5, stock: 22 },
		{ id: 16, name: 'Capa de Volante', category: 'Interior', price: '2.500', image: './images/i10.jpg', rating: 4.2, stock: 50 }
	]

	// Filtrar peças
	const filteredParts = parts.filter(part => {
		const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory = selectedCategory === 'Todas' || part.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	// Cálculos de paginação
	const totalPages = Math.ceil(filteredParts.length / itemsPerPage)
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = filteredParts.slice(indexOfFirstItem, indexOfLastItem)

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-30"
					style={{
						backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1650&q=80')"
					}}
					aria-hidden="true"
				/>
				<div className="relative max-w-7xl mx-auto px-6 py-16">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">
						Peças e Acessórios
					</h1>
					<p className="mt-4 text-lg text-indigo-100 max-w-2xl">
						Encontre peças originais e acessórios de qualidade para seu veículo. Estoque completo e pronta entrega.
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar - Filtros */}
					<aside className="w-full lg:w-80 flex-shrink-0">
						<div className="sticky top-6 space-y-6">
							{/* Header de Filtros */}
							<div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-5 shadow-lg">
								<div className="flex items-center gap-3 text-white">
									<Filter className="w-6 h-6" />
									<h2 className="text-xl font-bold">Filtrar Produtos</h2>
								</div>
							</div>

							{/* Busca */}
							<div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
								<label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
									<Search className="w-4 h-4 text-indigo-600" />
									Buscar Peça
								</label>
								<div className="relative">
									<input
										type="text"
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value)
											setCurrentPage(1)
										}}
										placeholder="Ex: Filtro de óleo..."
										className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 hover:bg-white"
									/>
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								</div>
							</div>

							{/* Categorias */}
							<div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
								<label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
									<Layers className="w-4 h-4 text-indigo-600" />
									Categorias
								</label>
								<div className="flex flex-wrap gap-2">
									{categories.map((category) => {
										const getCategoryIcon = () => {
											switch(category) {
												case 'Motor': return <Settings className="w-4 h-4" />
												case 'Transmissão': return <Box className="w-4 h-4" />
												case 'Suspensão': return <Wrench className="w-4 h-4" />
												case 'Freios': return <Package className="w-4 h-4" />
												case 'Elétrica': return <Zap className="w-4 h-4" />
												case 'Iluminação': return <Lightbulb className="w-4 h-4" />
												case 'Interior': return <Users className="w-4 h-4" />
												case 'Exterior': return <Box className="w-4 h-4" />
												case 'Acessórios': return <Star className="w-4 h-4" />
												default: return <Layers className="w-4 h-4" />
											}
										}
										return (
											<button
												key={category}
												onClick={() => {
													setSelectedCategory(category)
													setCurrentPage(1)
												}}
												className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category
														? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
														: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
													}`}
											>
												{getCategoryIcon()}
												<span>{category}</span>
												{selectedCategory === category && (
													<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												)}
											</button>
										)
									})}
								</div>
							</div>

							{/* Informações Adicionais */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
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
										<span className="font-medium">Peças originais certificadas</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Garantia de fábrica</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Entrega expressa</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Suporte especializado</span>
									</li>
								</ul>
							</div>
						</div>
					</aside>

					{/* Main Content - Grid de Peças */}
					<main className="flex-1">
						<div className="mb-6 flex items-center justify-between">
							<p className="text-gray-600">
								<span className="font-semibold text-gray-900">{filteredParts.length} produtos</span> encontrados
							</p>
							<select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
								<option>Ordenar por: Relevância</option>
								<option>Preço: Menor para Maior</option>
								<option>Preço: Maior para Menor</option>
								<option>Mais Vendidos</option>
								<option>Melhor Avaliados</option>
							</select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
							{currentItems.map((part) => (
								<article
									key={part.id}
									className="flex-shrink-0 w-full bg-white rounded-2xl shadow-lg overflow-hidden group"
								>
									{/* Imagem */}
									<div className="relative h-36 overflow-hidden">
										<img
											src={part.image}
											alt={part.name}
											// onError={(e) => { e.target.src = './images/i10.png' }}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										{/* Badge de estoque */}
										<div className="absolute top-3 left-3">
											<span className={`badge px-2 py-0.5 text-xs font-semibold rounded ${part.stock > 20 ? 'bg-green-600 text-white' : part.stock > 10 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
												}`}>
												{part.stock} em estoque
											</span>
										</div>
									</div>

									{/* Conteúdo */}
									<div className="p-4">
										<h3 className="text-sm font-semibold line-clamp-2">
											{part.name}
										</h3>

										{/* Preço */}
										<div className="text-primary font-bold mt-2 mb-3">
											{parseInt(part.price).toFixed(2)} akz
										</div>

										{/* Categoria e Rating */}
										<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
											<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{part.category}</span>
											<div className="flex items-center gap-1">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-3 h-3 ${i < Math.floor(part.rating)
																? 'fill-yellow-400 text-yellow-400'
																: 'fill-gray-200 text-gray-200'
															}`}
													/>
												))}
											</div>
										</div>

										{/* Botão */}
										<button
											style={{ backgroundColor: 'var(--secondary)' }}
											className="text-white px-3 py-2 rounded-md text-xs font-semibold hover:opacity-90 w-full"
										>
											Ver Detalhes
										</button>
									</div>
								</article>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-12">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	)
}
