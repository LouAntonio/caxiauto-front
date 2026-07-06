import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Package,
	AlertCircle,
	Heart
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PartsFilterPanel from '../../components/PartsFilterPanel';
import Pagination from '../../components/Pagination';
import PecaCardSkeleton from '../../components/PecaCardSkeleton';
import MobileFilterBar from '../../components/MobileFilterBar';
import MobileFilterModal from '../../components/MobileFilterModal';
import api, { API_URL, getImageUrl, notyf } from '../../services/api';
import useAuthStore from '../../stores/authStore';
import { useWishlist, useAddPecaToWishlist, useRemovePecaFromWishlist } from '../../hooks/queries/useWishlist';

export default function PecasAcessorios() {
	useDocumentTitle('Peças e Acessórios - Caxiauto');
	const navigate = useNavigate();
	const location = useLocation();
	const listingRef = useRef(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedProvincia, setSelectedProvincia] = useState('');
	const [featuredOnly, setFeaturedOnly] = useState(false);

	const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
	const [appliedCategory, setAppliedCategory] = useState('');
	const [appliedProvincia, setAppliedProvincia] = useState('');
	const [appliedFeaturedOnly, setAppliedFeaturedOnly] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [sortBy, setSortBy] = useState('createdAt');
	const itemsPerPage = 16;
	const [showMobileFilters, setShowMobileFilters] = useState(false);
	const { isAuthenticated } = useAuthStore();

	const queryParams = useMemo(() => {
		const params = { page: currentPage, limit: itemsPerPage };
		if (appliedSearchTerm) params.search = appliedSearchTerm;
		if (appliedCategory) params.categoria = appliedCategory;
		if (appliedProvincia) params.provincia = appliedProvincia;
		if (appliedFeaturedOnly) params.featured = 'true';
		if (sortBy) params.sort = sortBy;
		return params;
	}, [currentPage, appliedSearchTerm, appliedCategory, appliedProvincia, appliedFeaturedOnly, sortBy]);

	const { data: partsResponse, isLoading, error: queryError } = useQuery({
		queryKey: ['pecas', 'list', currentPage, appliedSearchTerm, appliedCategory, appliedProvincia, appliedFeaturedOnly, sortBy],
		queryFn: () => api.listPecas(queryParams),
	});

	const { data: categoriesResponse } = useQuery({
		queryKey: ['categorias', 'list'],
		queryFn: () => api.listCategoriasPecas({ limit: 50 }),
		select: (res) => (res.success ? res.data : []),
	});

	const parts = partsResponse?.data || []
	const pagination = partsResponse?.pagination || {}
	const totalItems = pagination?.total || pagination?.totalItems || 0
	const totalPages = pagination?.totalPages || 1
	const categories = categoriesResponse || []
	const error = queryError ? 'Erro ao conectar com o servidor' : (partsResponse && !partsResponse.success ? 'Erro ao carregar peças' : null)

	const { data: wishlistData } = useWishlist()
	const addFavoriteMutation = useAddPecaToWishlist()
	const removeFavoriteMutation = useRemovePecaFromWishlist()

	const favorites = new Set(
		(wishlistData?.pecas || []).map(p => p.id)
	)

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchTerm(appliedSearchTerm || '');
		}, 0);
		return () => clearTimeout(timer);
	}, [appliedSearchTerm]);

	useEffect(() => {
		const routeFilters = location.state?.filters;
		if (routeFilters) {
			if (routeFilters.featuredOnly) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setFeaturedOnly(true);
				setAppliedFeaturedOnly(true);
			}
			setCurrentPage(1);
			window.history.replaceState({}, '');
			setTimeout(() => {
				listingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
		}
	}, [location.state]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
		setCurrentPage(1);
	};

	const handleApplyFilters = () => {
		setAppliedSearchTerm(searchTerm);
		setAppliedCategory(selectedCategory);
		setAppliedProvincia(selectedProvincia);
		setAppliedFeaturedOnly(featuredOnly);
		setCurrentPage(1);
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedCategory('');
		setSelectedProvincia('');
		setFeaturedOnly(false);
		setAppliedSearchTerm('');
		setAppliedCategory('');
		setAppliedProvincia('');
		setAppliedFeaturedOnly(false);
		setCurrentPage(1);
	};

	const handleMobileSearchSubmit = () => {
		setAppliedSearchTerm(searchTerm);
		setCurrentPage(1);
	};

	const handleMobileApplyFilters = () => {
		handleApplyFilters();
		setShowMobileFilters(false);
	};

	const handleMobileClearFilters = () => {
		handleClearFilters();
		setShowMobileFilters(false);
	};

	const formatPrice = (price) => {
		if (price === null || price === undefined || isNaN(price) || price === 0) {
			return 'Preço sob consulta'
		}
		return new Intl.NumberFormat('pt-AO').format(price)
	};

	const toggleFavorite = async (e, partId) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos');
			return;
		}

		try {
			const isFavorite = favorites.has(partId);

			if (isFavorite) {
				const response = await removeFavoriteMutation.mutateAsync(partId);
				if (response.success) {
					notyf.success('Removido dos favoritos');
				} else {
					notyf.error(response.message || 'Erro ao remover favorito');
				}
			} else {
				const response = await addFavoriteMutation.mutateAsync(partId);
				if (response.success) {
					notyf.success('Adicionado aos favoritos');
				} else {
					notyf.error(response.message || 'Erro ao adicionar favorito');
				}
			}
		} catch (error) {
			console.error('Erro ao alternar favorito:', error);
			notyf.error('Erro ao processar favorito');
		}
	};

	return (
		<main>
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1650&q=80')"
					}}
					aria-hidden="true"
				/>
				<div className="absolute inset-0 bg-[#154c9a]/80" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white mb-10">
							<Package className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Peças e Acessórios</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.08] mb-8 [text-wrap:balance]">
							A peça{' '}
							<span className="text-[#d41120]">original</span>{' '}
							que você precisa
						</h1>

						<div className="flex justify-center mb-10">
							<div className="h-[3px] bg-white w-40" />
						</div>

						<p className="font-body text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
							Encontre peças originais e acessórios de qualidade para seu veículo. Estoque completo e pronta entrega.
						</p>
					</div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto">
				<section ref={listingRef} className="py-8 px-6">
					<div className="max-w-7xl mx-auto">
						<MobileFilterBar
							value={searchTerm}
							onChange={setSearchTerm}
							onSubmit={handleMobileSearchSubmit}
							onOpenFilters={() => setShowMobileFilters(true)}
							placeholder="Pesquisar peças e acessórios..."
						/>

						<div className="flex flex-col lg:flex-row gap-8">
							<aside className="hidden lg:block w-full lg:w-80 flex-shrink-0">
								<div className="sticky top-6">
									<h2 className="font-display text-xl font-bold text-[#111827] mb-4">Filtrar Peças</h2>
									<PartsFilterPanel
										showSearch={true}
										searchTerm={searchTerm}
										onSearchTermChange={setSearchTerm}
										categories={categories}
										selectedCategory={selectedCategory}
										onCategoryChange={setSelectedCategory}
										selectedProvincia={selectedProvincia}
										onProvinciaChange={setSelectedProvincia}
										featuredOnly={featuredOnly}
										onFeaturedOnlyChange={setFeaturedOnly}
										onApplyFilters={handleApplyFilters}
										onClearFilters={handleClearFilters}
									/>
								</div>
							</aside>

							<main className="flex-1">
								<div className="mb-6 flex items-center justify-between">
									<p className="font-body text-[#6b7280]">
										<span className="font-semibold text-[#111827]">{totalItems} peças</span> disponíveis
									</p>
									<select
										value={sortBy}
										onChange={handleSortChange}
										className="border border-[#e5e7eb] rounded-xl px-4 py-2 bg-white outline-none cursor-pointer font-body text-sm text-[#6b7280] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
									>
										<option value="createdAt">Mais Recentes</option>
										<option value="price-asc">Preço: Menor para Maior</option>
										<option value="price-desc">Preço: Maior para Menor</option>
										<option value="name-asc">Nome: A-Z</option>
									</select>
								</div>

								{isLoading && (
									<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
										<PecaCardSkeleton count={8} className="w-full" />
									</div>
								)}

								{error && !isLoading && (
									<div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-3">
										<AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
										<div>
											<h3 className="font-semibold text-red-900 font-body mb-1">Erro ao carregar peças</h3>
											<p className="text-red-700 font-body">{error}</p>
										</div>
									</div>
								)}

								{!isLoading && !error && parts.length === 0 && (
									<div className="text-center py-20">
										<Package className="w-16 h-16 text-[#e5e7eb] mx-auto mb-4" />
										<h3 className="font-display text-xl font-semibold text-[#111827] mb-2">Nenhuma peça encontrada</h3>
										<p className="font-body text-[#6b7280]">Tente ajustar os filtros para ver mais resultados</p>
									</div>
								)}

								{!isLoading && !error && parts.length > 0 && (
									<>
										<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
											{parts.map((part) => {
												const price = part.price ? parseFloat(part.price) : null;
												return (
													<article
														key={part.id}
														className="flex-shrink-0 w-full bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:border-[#154c9a]/20 transition-all duration-300 group"
													>
														<div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/stand/pecas-acessorios/${part.id}`)}>
															<img
																src={getImageUrl(part.image, '/images/parts.jpg')}
																alt={part.name}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
																onError={(e) => { e.target.src = '/images/parts.jpg'; }}
															/>

															<div className="absolute top-4 left-4">
																<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg font-body ${part.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
																}`}>
																	{part.status === 'ACTIVE' ? 'Disponível' : 'Indisponível'}
																</span>
															</div>

															{part.isFeatured && (
																<div className="absolute top-4 right-4">
																	<span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg bg-[#154c9a] text-white font-body">
																		Destaque
																	</span>
																</div>
															)}

															{isAuthenticated && (
																<button
																	onClick={(e) => toggleFavorite(e, part.id)}
																	className={`absolute ${part.isFeatured ? 'top-16' : 'top-4'} right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer`}
																	aria-label={favorites.has(part.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
																>
																	<Heart
																		className={`w-5 h-5 transition-all duration-200 ${favorites.has(part.id)
																			? 'fill-red-500 text-red-500'
																			: 'text-gray-600 hover:text-red-500'
																		}`}
																	/>
																</button>
															)}

															<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
														</div>

														<div className="p-5">
															<h3 className="font-display text-lg font-bold text-[#111827] mb-3 line-clamp-1 text-center">
																{part.name}
															</h3>

															{price != null && (
																<div className="text-center mb-4">
																	<div className="font-['JetBrains_Mono',monospace] text-xl font-bold text-[#154c9a]">
																		{formatPrice(price)} Kz
																	</div>
																</div>
															)}

															<div className="flex items-center justify-center mb-4">
																<span className="font-body text-xs bg-[#f8f6f2] text-[#6b7280] px-3 py-1.5 rounded-full capitalize">
																	{part.Categoria?.name || 'Sem categoria'}
																</span>
															</div>

															<Link to={`/stand/pecas-acessorios/${part.id}`}>
																<button className="w-full mt-4 py-2 text-sm bg-[#d41120] text-white font-semibold rounded-xl hover:bg-[#b80f1c] transition-all duration-300 shadow-sm cursor-pointer font-body">
																	Ver Detalhes
																</button>
															</Link>
														</div>
													</article>
												);
											})}
										</div>

										{totalPages > 1 && (
											<div className="mt-12">
												<Pagination
													currentPage={currentPage}
													totalPages={totalPages}
													onPageChange={handlePageChange}
												/>
											</div>
										)}
									</>
								)}
							</main>
						</div>
					</div>
				</section>
			</div>

			<MobileFilterModal
				isOpen={showMobileFilters}
				onClose={() => setShowMobileFilters(false)}
				title="Filtros avançados"
			>
				<PartsFilterPanel
					showSearch={false}
					searchTerm={searchTerm}
					onSearchTermChange={setSearchTerm}
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					selectedProvincia={selectedProvincia}
					onProvinciaChange={setSelectedProvincia}
					featuredOnly={featuredOnly}
					onFeaturedOnlyChange={setFeaturedOnly}
					onApplyFilters={handleMobileApplyFilters}
					onClearFilters={handleMobileClearFilters}
				/>
			</MobileFilterModal>

		</main>
	);
}
