import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import PecaCardSkeleton from './PecaCardSkeleton'
import api, { getImageUrl, notyf } from '../services/api'
import { useFeaturedPecas } from '../hooks/queries/usePecas'
import useAuthStore from '../stores/authStore'

export default function FeaturedParts() {
	const railRef = useRef(null)
	const { data: pecas, isLoading } = useFeaturedPecas()
	const [favorites, setFavorites] = useState(new Set())
	const [loadingFavorites, setLoadingFavorites] = useState(new Set())
	const { isAuthenticated } = useAuthStore()

	// Buscar favoritos do usuário quando autenticado
	useEffect(() => {
		const fetchFavorites = async () => {
			if (!isAuthenticated) {
				setFavorites(new Set())
				return
			}

			try {
				const response = await api.getWishlist()
				if (response.success && response.data) {
					const favoriteIds = new Set(
						response.data.pecas?.map(p => p.id) || []
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
				const response = await api.removePecaFromWishlist(partId)
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
				const response = await api.addPecaToWishlist(partId)
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
	if (isLoading) {
		return (
			<section className="parts-section py-6 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-6">
						<div className="h-8 w-48 bg-gray-200 skeleton-shimmer rounded-md" />
						<div className="hidden md:flex gap-3">
							<div className="w-10 h-10 rounded-full bg-gray-200 skeleton-shimmer" />
							<div className="w-10 h-10 rounded-full bg-gray-200 skeleton-shimmer" />
						</div>
					</div>
					<div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
						<PecaCardSkeleton count={5} className="w-64 flex-shrink-0" />
					</div>
				</div>
			</section>
		)
	}

	if (pecas.length === 0) {
		return null
	}

	return (
		<section className="parts-section py-6 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex gap-3 items-baseline">
						<h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">Peças e Acessórios</h2>
						<span className="text-[#e5e7eb] text-2xl">|</span>
						<Link
							to="/stand/pecas-acessorios"
							className="group flex items-center gap-1 text-lg font-medium text-[#154c9a] font-body hover:underline"
						>
							Ver todas
							<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>

					<div className="hidden md:flex gap-3">
						<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] hover:bg-[#f8f6f2] hover:border-[#154c9a] transition-colors">
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] hover:bg-[#f8f6f2] hover:border-[#154c9a] transition-colors">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div ref={railRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
					{pecas.map((peca) => (
						<article key={peca.id} className="flex-shrink-0 w-64 bg-white rounded-2xl border border-[#e5e7eb] shadow-lg overflow-hidden group hover:border-[#154c9a]/20 transition-all duration-300">
							<div className="relative h-36 overflow-hidden">
								<img
									src={getImageUrl(peca.image, './images/parts.jpg')}
									alt={peca.name}
									onError={(e) => { e.target.src = './images/i10.png' }}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>

								{isAuthenticated && (
									<button
										onClick={(e) => toggleFavorite(e, peca.id)}
										className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
										aria-label={favorites.has(peca.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
										disabled={loadingFavorites.has(peca.id)}
									>
										<Heart
											className={`w-5 h-5 transition-all duration-200 ${favorites.has(peca.id)
												? 'fill-red-500 text-red-500'
												: 'text-gray-600 hover:text-red-500'
											} ${loadingFavorites.has(peca.id) ? 'opacity-50' : ''}`}
										/>
									</button>
								)}

								<div className="absolute top-3 left-3 flex gap-2">
									{peca.isFeatured && (
										<span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#d41120] text-white">
											Destaque
										</span>
									)}
								</div>
							</div>

							<div className="p-4">
								<h3 className="font-display text-sm font-bold text-[#111827] line-clamp-2 capitalize">{peca.name}</h3>
								<div className="font-['JetBrains_Mono',monospace] font-bold text-[#154c9a] mt-2 mb-3">
									{parseFloat(peca.price).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} akz
								</div>

								<div className="flex items-center justify-between text-sm text-[#6b7280]">
									<div className="flex items-center gap-2">
										<span className="text-xs bg-[#eef3fa] text-[#154c9a] px-2 py-0.5 rounded-full font-body capitalize">
											{peca.Categoria?.name || 'Sem categoria'}
										</span>
									</div>
								</div>
								<Link to={`/stand/pecas-acessorios/${peca.id}`}>
									<button
										className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-xl bg-[#154c9a] hover:bg-blue-800 transition-all font-body cursor-pointer"
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

