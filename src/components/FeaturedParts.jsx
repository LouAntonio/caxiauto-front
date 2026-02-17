import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { getImageUrl, notyf } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function FeaturedParts() {
	const railRef = useRef(null)
	const [featuredParts, setFeaturedParts] = useState([])
	const [loading, setLoading] = useState(true)
	const [favorites, setFavorites] = useState(new Set())
	const [loadingFavorites, setLoadingFavorites] = useState(new Set())
	const { isAuthenticated } = useAuth()

	// Carregar peças em destaque
	useEffect(() => {
		const fetchFeaturedParts = async () => {
			try {
				const response = await api.listPecas({ 
					destaque: true, 
					limit: 10 
				})
				if (response.success) {
					setFeaturedParts(response.data || [])
				}
			} catch (error) {
				console.error('Erro ao carregar peças em destaque:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchFeaturedParts()
	}, [])

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

	function scroll(dir = 1) {
		const rail = railRef.current
		if (!rail) return
		const step = Math.round(rail.clientWidth * 0.8)
		rail.scrollBy({ left: dir * step, behavior: 'smooth' })
	}

	// Se estiver carregando ou não houver peças, não renderizar nada
	if (loading) {
		return (
			<section className="parts-section py-6">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-center py-20">
						<Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
					</div>
				</div>
			</section>
		)
	}

	if (featuredParts.length === 0) {
		return null
	}

	return (
		<section className="parts-section py-6">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center justify-between mb-6">
					<div className="flex gap-3 items-baseline">
						<h2 className="text-2xl font-semibold">Peças e Acessórios</h2>
						<span className="text-gray-400 text-2xl">|</span>
						<Link
							to="/stand/pecas-acessorios"
							style={{ color: 'var(--primary)' }}
							className="group flex items-center gap-1 text-lg font-medium hover:underline"
						>
							Ver todas
							<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>

					<div className="hidden md:flex gap-3">
						<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronLeft className="w-5 h-5 text-gray-700" />
						</button>
						<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronRight className="w-5 h-5 text-gray-700" />
						</button>
					</div>
				</div>

				<div ref={railRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
					{featuredParts.map((peca) => (
						<article key={peca._id} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg overflow-hidden group">
							<div className="relative h-36 overflow-hidden">
								<img 
									src={getImageUrl(peca.image, './images/parts.jpg')} 
									alt={peca.nome} 
									onError={(e) => { e.target.src = './images/i10.png' }} 
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
								/>
								
								{/* Botão de favorito */}
								{isAuthenticated && (
									<button
										onClick={(e) => toggleFavorite(e, peca._id)}
										className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
										aria-label={favorites.has(peca._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
										disabled={loadingFavorites.has(peca._id)}
									>
										<Heart
											className={`w-5 h-5 transition-all duration-200 ${favorites.has(peca._id)
													? 'fill-red-500 text-red-500'
													: 'text-gray-600 hover:text-red-500'
												} ${loadingFavorites.has(peca._id) ? 'opacity-50' : ''}`}
										/>
									</button>
								)}

								<div className="absolute top-3 left-3 flex gap-2">
									{peca.featured && (
										<span className="badge px-2 py-0.5 text-xs font-semibold rounded bg-yellow-500 text-white">
											Destaque
										</span>
									)}
									{peca.condition === 'new' && (
										<span className="badge px-2 py-0.5 text-xs font-semibold rounded bg-green-500 text-white">
											Novo
										</span>
									)}
									{peca.stock > 0 && (
										<span className="badge px-2 py-0.5 text-xs font-semibold rounded bg-blue-500 text-white">
											Em Estoque
										</span>
									)}
								</div>
							</div>

							<div className="p-4">
								<h3 className="text-sm font-semibold line-clamp-2 capitalize">{peca.nome}</h3>
								<div className="text-primary font-bold mt-2 mb-3">
									{parseFloat(peca.price).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} akz
								</div>

								<div className="flex items-center justify-between text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
											{peca.categoria?.nome || 'Sem categoria'}
										</span>
									</div>
								</div>
								<Link to={`/stand/pecas-acessorios/${peca._id}`}>
									<button
										style={{ backgroundColor: 'var(--secondary)' }}
										className="text-white px-3 py-2 rounded-md text-xs font-semibold hover:opacity-90 mt-4 w-full cursor-pointer"
									>
										Ver Detalhes
									</button>
								</Link>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

