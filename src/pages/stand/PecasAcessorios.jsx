import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Star, Search, Layers, Filter, Loader, X, Heart } from 'lucide-react'
import Pagination from '../../components/Pagination'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { getImageUrl, notyf } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function PecasAcessorios() {
	useDocumentTitle('Peças e Acessórios - Caxiauto')

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [featuredOnly, setFeaturedOnly] = useState(false)

	// Estados para filtros aplicados (usados na API)
	const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
	const [appliedCategory, setAppliedCategory] = useState('')
	const [appliedFeaturedOnly, setAppliedFeaturedOnly] = useState(false)

	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])
	const [parts, setParts] = useState([])
	const [pagination, setPagination] = useState({})
	const [sortBy, setSortBy] = useState('')
	const itemsPerPage = 16
	const [favorites, setFavorites] = useState(new Set())
	const [loadingFavorites, setLoadingFavorites] = useState(new Set())
	const { isAuthenticated } = useAuth()

	const handlePageChange = (page) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Aplicar filtros
	const handleApplyFilters = () => {
		setAppliedSearchTerm(searchTerm)
		setAppliedCategory(selectedCategory)
		setAppliedFeaturedOnly(featuredOnly)
		setCurrentPage(1)
	}

	// Limpar filtros
	const handleClearFilters = () => {
		setSearchTerm('')
		setSelectedCategory('')
		setFeaturedOnly(false)
		setAppliedSearchTerm('')
		setAppliedCategory('')
		setAppliedFeaturedOnly(false)
		setCurrentPage(1)
	}

	// Carregar categorias
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.listCategoriasPecas({ limit: 50 })
				if (response.success) {
					setCategories(response.data || [])
				}
			} catch (error) {
				console.error('Erro ao carregar categorias:', error)
			}
		}
		fetchCategories()
	}, [])

	// Carregar peças inicialmente
	useEffect(() => {
		const fetchParts = async () => {
			setLoading(true)
			try {
				const params = {
					page: 1,
					limit: itemsPerPage
				}

				const response = await api.listPecas(params)
				if (response.success) {
					setParts(response.data || [])
					setPagination(response.pagination || {})
				}
			} catch (error) {
				console.error('Erro ao carregar peças:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchParts()
	}, [])

	// Carregar peças
	useEffect(() => {
		const fetchParts = async () => {
			setLoading(true)
			try {
				const params = {
					page: currentPage,
					limit: itemsPerPage
				}

				if (appliedSearchTerm) {
					params.search = appliedSearchTerm
				}

				if (appliedCategory) {
					params.categoria = appliedCategory
				}

				if (appliedFeaturedOnly) {
					params.destaque = true
				}

				const response = await api.listPecas(params)
				if (response.success) {
					setParts(response.data || [])
					setPagination(response.pagination || {})
				}
			} catch (error) {
				console.error('Erro ao carregar peças:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchParts()
	}, [currentPage, appliedSearchTerm, appliedCategory, appliedFeaturedOnly, sortBy])

	// Buscar favoritos do usuário quando autenticado
	useEffect(() => {
		const fetchFavorites = async () => {
			if (!isAuthenticated) {
				setFavorites(new Set())
				return
			}

			try {
				const response = await api.getFavorites()
				if (response.success && response.data) {
					const favoriteIds = new Set(
						response.data
							.filter(fav => fav.itemType === 'part')
							.map(fav => fav.itemId)
					)
					setFavorites(favoriteIds)
				}
			} catch (error) {
				console.error('Erro ao buscar favoritos:', error)
			}
		}

		fetchFavorites()
	}, [isAuthenticated])

	// Funções auxiliares
	const getRating = (spechs) => {
		// Se não tem avaliação no spechs, retorna uma padrão entre 4.0 e 4.9
		if (spechs && spechs.rating) {
			return parseFloat(spechs.rating)
		}
		return 4.0 + Math.random() * 0.9
	}

	// Função para adicionar/remover favorito
	const toggleFavorite = async (e, partId) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos')
			return
		}

		// Evitar múltiplos cliques
		if (loadingFavorites.has(partId)) return

		setLoadingFavorites(prev => new Set(prev).add(partId))

		try {
			const isFavorite = favorites.has(partId)

			if (isFavorite) {
				const response = await api.removeFavorite(partId)
				if (response.success) {
					setFavorites(prev => {
						const newSet = new Set(prev)
						newSet.delete(partId)
						return newSet
					})
					notyf.success('Removido dos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao remover favorito')
				}
			} else {
				const response = await api.addFavorite(partId, 'part')
				if (response.success) {
					setFavorites(prev => new Set(prev).add(partId))
					notyf.success('Adicionado aos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao adicionar favorito')
				}
			}
		} catch (error) {
			console.error('Erro ao alternar favorito:', error)
			notyf.error('Erro ao processar favorito')
		} finally {
			setLoadingFavorites(prev => {
				const newSet = new Set(prev)
				newSet.delete(partId)
				return newSet
			})
		}
	}

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
						<div className="sticky top-6">
							<div className="w-full bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100">
								<div className="space-y-4">
									{/* Pesquisa de Texto */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
											<Search className="w-4 h-4" style={{ color: 'var(--primary)' }} />
											Pesquisar
										</label>
										<input
											type="text"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											placeholder="Ex: Filtro de óleo, pastilha..."
											className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 bg-white outline-none transition-all hover:border-indigo-300 text-gray-700 text-sm placeholder:text-gray-400"
										/>
									</div>

									{/* Categorias */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
											<Layers className="w-4 h-4" style={{ color: 'var(--primary)' }} />
											Categorias
										</label>
										<div className="flex flex-wrap gap-2">
											<button
												onClick={() => setSelectedCategory('')}
												className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === ''
													? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
													: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
													}`}
											>
												<Layers className="w-4 h-4" />
												<span>Todas</span>
												{selectedCategory === '' && (
													<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												)}
											</button>

											{/* Categorias da API */}
											{categories.map((category) => (
												<button
													key={category._id}
													onClick={() => setSelectedCategory(category._id)}
													className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${selectedCategory === category._id
														? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
														: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
														}`}
												>

													<span className="capitalize">{category.nome}</span>
													{selectedCategory === category._id && (
														<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
															<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
														</svg>
													)}
												</button>
											))}
										</div>
									</div>

									{/* Filtro Em Destaque */}
									<div className="space-y-2">
										<label className="flex items-center gap-3 cursor-pointer">
											<input
												type="checkbox"
												checked={featuredOnly}
												onChange={(e) => setFeaturedOnly(e.target.checked)}
												className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded"
											/>
											<span className="text-sm text-gray-700">
												Mostrar apenas peças em destaque
											</span>
										</label>
									</div>

									{/* Bot\u00f5es de A\u00e7\u00e3o */}
									<div className="flex gap-2 pt-2">
										<button
											onClick={handleApplyFilters}
											style={{ backgroundColor: 'var(--primary)' }}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity  cursor-pointer"
										>
											<Search className="w-4 h-4" />
											Pesquisar
										</button>
										<button
											onClick={handleClearFilters}
											className="px-3 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
											title="Limpar filtros"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</aside>

					{/* Main Content - Grid de Peças */}
					<main className="flex-1">
						<div className="mb-6 flex items-center justify-between">
							<p className="text-gray-600">
								<span className="font-semibold text-gray-900">{pagination.totalItems || 0} produtos</span> encontrados
							</p>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer"
							>
								<option value="">Ordenar por: Relevância</option>
								<option value="price_asc">Preço: Menor para Maior</option>
								<option value="price_desc">Preço: Maior para Menor</option>
								<option value="newest">Mais Recentes</option>
								<option value="name_asc">Nome: A-Z</option>
							</select>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-12">
								<Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
								<span className="ml-2 text-gray-600">Carregando peças...</span>
							</div>
						) : parts.length === 0 ? (
							<div className="text-center py-12">
								<Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
								<p className="text-gray-500 text-lg">Nenhuma peça encontrada</p>
								<p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-6">
								{parts.map((part) => {
									const rating = getRating(part.spechs)
									return (
										<article
											key={part._id}
											className="flex flex-col w-full bg-white rounded-2xl shadow-lg overflow-hidden group h-full"
										>
											{/* Imagem */}
											<div className="relative h-36 overflow-hidden">
												<img
													src={getImageUrl(part.image, '/images/parts.jpg')}
													alt={part.nome}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
													onError={(e) => { e.target.src = '/images/parts.jpg'; }}
												/>
												{/* Badge de estoque */}
												<div className="absolute top-3 left-3">
													<span className={`badge px-2 py-0.5 text-xs font-semibold rounded ${part.stock > 20 ? 'bg-green-600 text-white' : part.stock > 10 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
														}`}>
														{part.stock || 0} em estoque
													</span>
												</div>
												{/* Badge de condição */}
												<div className="absolute top-3 right-3">
													<span className={`badge px-2 py-0.5 text-xs font-semibold rounded capitalize ${part.condition === 'new' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
														}`}>
														{part.condition === 'new' ? 'Novo' : 'Usado'}
													</span>
												</div>

												{/* Botão de favorito */}
												{isAuthenticated && (
													<button
														onClick={(e) => toggleFavorite(e, part._id)}
														className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
														aria-label={favorites.has(part._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
														disabled={loadingFavorites.has(part._id)}
													>
														<Heart
															className={`w-4 h-4 transition-all duration-200 ${favorites.has(part._id)
																? 'fill-red-500 text-red-500'
																: 'text-gray-600 hover:text-red-500'
																} ${loadingFavorites.has(part._id) ? 'opacity-50' : ''}`}
														/>
													</button>
												)}
											</div>

											{/* Conteúdo */}
											<div className="flex flex-col flex-grow p-4">
												<h3 className="text-sm font-semibold line-clamp-2 capitalize">
													{part.nome}
												</h3>

												{/* Preço */}
												<div className="text-primary font-bold mt-2 mb-3">
													{part.price?.toFixed(2)} akz
												</div>

												{/* Categoria e Rating */}
												<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
													<span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
														{part.categoria?.nome || 'Sem categoria'}
													</span>
												</div>

												{/* Botão - no fundo do card */}
												<div className="mt-auto">
													<Link to={`/stand/pecas-acessorios/${part._id}`}>
														<button
															style={{ backgroundColor: 'var(--secondary)' }}
															className="text-white px-3 py-2 rounded-md text-xs font-semibold hover:opacity-90 w-full cursor-pointer"
														>
															Ver Detalhes
														</button>
													</Link>
												</div>
											</div>
										</article>
									)
								})}
							</div>
						)}
						{/* Pagination */}
						{pagination.totalPages > 1 && (
							<div className="mt-12">
								<Pagination
									currentPage={currentPage}
									totalPages={pagination.totalPages}
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
