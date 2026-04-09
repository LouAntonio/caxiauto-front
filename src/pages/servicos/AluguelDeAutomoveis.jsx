import React, { useState, useEffect } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Gauge,
	Calendar,
	MapPin,
	Droplet,
	AlertCircle,
	Loader2,
	Heart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RentalVehicleFilter from '../../components/RentalVehicleFilter';
import Pagination from '../../components/Pagination';
import CarCardSkeleton from '../../components/CarCardSkeleton';
import api, { API_URL, getImageUrl, notyf } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AluguelDeAutomoveis() {
	useDocumentTitle('Aluguel de Automóveis - Caxiauto');
	const navigate = useNavigate();

	const [vehicles, setVehicles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalVehicles, setTotalVehicles] = useState(0);
	const [sortBy, setSortBy] = useState('createdAt');
	const vehiclesPerPage = 16;
	const [favorites, setFavorites] = useState(new Set());
	const [loadingFavorites, setLoadingFavorites] = useState(new Set());
	const { isAuthenticated } = useAuth();

	// Carrega veículos apenas na primeira renderização
	useEffect(() => {
		loadVehicles();
	}, []);

	// Recarrega apenas quando a página muda
	useEffect(() => {
		if (currentPage !== 1) {
			loadVehicles();
		}
	}, [currentPage]);

	// Buscar favoritos do usuário quando autenticado
	useEffect(() => {
		const fetchFavorites = async () => {
			if (!isAuthenticated) {
				setFavorites(new Set());
				return;
			}

			try {
				const response = await api.getWishlist();
				if (response.success && response.data) {
					const favoriteIds = new Set(
						response.data.vehicles?.map(v => v.id) || []
					);
					setFavorites(favoriteIds);
				}
			} catch (error) {
				console.error('Erro ao buscar favoritos:', error);
			}
		};

		fetchFavorites();
	}, [isAuthenticated]);

	const loadVehicles = async () => {
		await loadVehiclesWithFilters(filters, currentPage, sortBy);
	};

	const loadVehiclesWithFilters = async (appliedFilters, page, sort) => {
		try {
			setLoading(true);
			setError(null);

			// Construir query params
			const params = new URLSearchParams({
				page: page,
				limit: vehiclesPerPage,
				sort: sort,
				type: 'RENT'
			});

			// Adicionar filtros
			if (appliedFilters.search) params.append('search', appliedFilters.search);
			if (appliedFilters.manufacturer) params.append('manufacturer', appliedFilters.manufacturer);
			if (appliedFilters.class) params.append('class', appliedFilters.class);
			if (appliedFilters.fuelType) params.append('fuelType', appliedFilters.fuelType);
			if (appliedFilters.transmission) params.append('transmission', appliedFilters.transmission);
			if (appliedFilters.minPrice) params.append('minPriceRent', appliedFilters.minPrice);
			if (appliedFilters.maxPrice) params.append('maxPriceRent', appliedFilters.maxPrice);
			if (appliedFilters.minYear) params.append('minYear', appliedFilters.minYear);
			if (appliedFilters.maxYear) params.append('maxYear', appliedFilters.maxYear);

			// Filtro de destaque
			if (appliedFilters.featured) {
				params.append('featured', 'true');
			}

			// Fazer a requisição para a API
			const response = await api.get(`/vehicles?${params.toString()}`);

			if (response.success) {
				setVehicles(response.data || []);
				setTotalPages(response.pagination?.totalPages || 1);
				setTotalVehicles(response.pagination?.total || 0);
			} else {
				setError('Erro ao carregar veículos');
			}

		} catch (err) {
			console.error('Erro ao buscar veículos:', err);
			setError('Erro ao conectar com o servidor');
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
		// Realiza a busca imediatamente após aplicar os filtros
		setLoading(true);
		loadVehiclesWithFilters(newFilters, 1, sortBy);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleSortChange = (e) => {
		const newSortBy = e.target.value;
		setSortBy(newSortBy);
		setCurrentPage(1);
		// Realiza nova busca com a ordenação alterada
		setLoading(true);
		loadVehiclesWithFilters(filters, 1, newSortBy);
	};

	const getLowestPrice = (vehicle) => {
		if (!vehicle || !vehicle.priceRentDay) return null;
		return vehicle.priceRentDay;
	};

	const getPeriodLabel = () => {
		return '/dia';
	};

	// Função para adicionar/remover favorito
	const toggleFavorite = async (e, carId) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos');
			return;
		}

		// Evitar múltiplos cliques
		if (loadingFavorites.has(carId)) return;

		setLoadingFavorites(prev => new Set(prev).add(carId));

		try {
			const isFavorite = favorites.has(carId);

			if (isFavorite) {
				const response = await api.removeVehicleFromWishlist(carId);
				if (response.success) {
					setFavorites(prev => {
						const newSet = new Set(prev);
						newSet.delete(carId);
						return newSet;
					});
					notyf.success('Removido dos favoritos');
				} else {
					notyf.error(response.message || 'Erro ao remover favorito');
				}
			} else {
				const response = await api.addVehicleToWishlist(carId);
				if (response.success) {
					setFavorites(prev => new Set(prev).add(carId));
					notyf.success('Adicionado aos favoritos');
				} else {
					notyf.error(response.message || 'Erro ao adicionar favorito');
				}
			}
		} catch (error) {
			console.error('Erro ao alternar favorito:', error);
			notyf.error('Erro ao processar favorito');
		} finally {
			setLoadingFavorites(prev => {
				const newSet = new Set(prev);
				newSet.delete(carId);
				return newSet;
			});
		}
	};

	return (
		<main className="bg-gray-50 min-h-screen">
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
						Aluguel de Automóveis
					</h1>
					<p className="mt-4 text-lg text-indigo-100 max-w-2xl">
						Encontre o veículo ideal para sua viagem ou dia a dia. As melhores taxas e condições em Luanda.
					</p>
				</div>
			</div>

			<div className='max-w-7xl mx-auto'>
				{/* Seção de Veículos com Sidebar Filter */}
				<section className="py-8 px-6">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col lg:flex-row gap-8">
							{/* Sidebar - Filtros */}
							<aside className="w-full lg:w-80 flex-shrink-0">
								<div className="sticky top-6">
									<h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar Veículos</h2>
									<RentalVehicleFilter onFilterChange={handleFilterChange} />
								</div>
							</aside>

							{/* Main Content - Grid de Veículos */}
							<main className="flex-1">
								<div className="mb-6 flex items-center justify-between">
									<p className="text-gray-600">
										<span className="font-semibold text-gray-900">{totalVehicles} veículos</span> disponíveis
									</p>
									<select
										value={sortBy}
										onChange={handleSortChange}
										className="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer"
									>
										<option value="createdAt">Mais Recentes</option>
										<option value="price-asc">Preço: Menor para Maior</option>
										<option value="price-desc">Preço: Maior para Menor</option>
										<option value="year-desc">Ano: Mais Novo</option>
										<option value="year-asc">Ano: Mais Antigo</option>
									</select>
								</div>

								{/* Loading State */}
								{loading && (
									<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
										<CarCardSkeleton count={8} className="w-full" />
									</div>
								)}

								{/* Error State */}
								{error && !loading && (
									<div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-center gap-3">
										<AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
										<div>
											<h3 className="font-semibold text-red-900 mb-1">Erro ao carregar veículos</h3>
											<p className="text-red-700">{error}</p>
										</div>
									</div>
								)}

								{/* Empty State */}
								{!loading && !error && vehicles.length === 0 && (
									<div className="text-center py-20">
										<Gauge className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum veículo encontrado</h3>
										<p className="text-gray-600">Tente ajustar os filtros para ver mais resultados</p>
									</div>
								)}

								{/* Grid de Veículos */}
								{!loading && !error && vehicles.length > 0 && (
									<>
										<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
											{vehicles.map((car) => {
												const price = getLowestPrice(car);
												return (
													<article
														key={car.id}
														className="flex-shrink-0 w-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
													>
														{/* Imagem */}
														<div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/servicos/aluguel-de-automoveis/${car.id}`)}>
															<img
																src={getImageUrl(car.image, '/images/i10.jpg')}
																alt={car.name}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
																onError={(e) => { e.target.src = '/images/i10.jpg'; }}
															/>

															{/* Badge de disponibilidade */}
															<div className="absolute top-4 left-4">
																<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${car.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
																}`}>
																	{car.status === 'ACTIVE' ? 'Disponível' : 'Indisponível'}
																</span>
															</div>

															{/* Badge de seguro */}
															{car.isVerified && (
																<div className="absolute top-4 right-4">
																	<span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg bg-blue-600 text-white">
																		Verificado
																	</span>
																</div>
															)}

															{/* Botão de favorito */}
															{isAuthenticated && (
																<button
																	onClick={(e) => toggleFavorite(e, car.id)}
																	className={`absolute ${car.isVerified ? 'top-16' : 'top-4'} right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer`}
																	aria-label={favorites.has(car.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
																	disabled={loadingFavorites.has(car.id)}
																>
																	<Heart
																		className={`w-5 h-5 transition-all duration-200 ${favorites.has(car.id)
																			? 'fill-red-500 text-red-500'
																			: 'text-gray-600 hover:text-red-500'
																		} ${loadingFavorites.has(car.id) ? 'opacity-50' : ''}`}
																	/>
																</button>
															)}

															{/* Gradiente inferior */}
															<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
														</div>

														{/* Conteúdo */}
														<div className="p-5">
															<h3 className="text-1xl font-bold text-gray-900 mb-3 line-clamp-1 text-center">
																{car.name}
															</h3>

															{/* Preço */}
															{price && (
																<div className="text-center mb-4">
																	<div className="text-xs text-gray-500 mb-1">A partir de</div>
																	<div
																		style={{ color: 'var(--primary)' }}
																		className="text-xl font-bold"
																	>
																		{price.toLocaleString('pt-AO')},00 Kz{getPeriodLabel()}
																	</div>
																</div>
															)}

															{/* Especificações (duas colunas) */}
															<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
																<div className="flex items-center justify-end gap-2">
																	<span className="text-right">{car.kilometers?.toLocaleString('pt-AO')}</span>
																	<Gauge className="w-4 h-4 text-gray-400" />
																</div>
																<div className="flex items-center gap-2">
																	<Calendar className="w-4 h-4 text-gray-400" />
																	<span>{car.year}</span>
																</div>
																<div className="flex items-center justify-end gap-2">
																	<span className="text-right">{car.provincia}</span>
																	<MapPin className="w-4 h-4 text-gray-400" />
																</div>
																<div className="flex items-center gap-2">
																	<Droplet className="w-4 h-4 text-gray-400" />
																	<span className="capitalize">{car.fuelType}</span>
																</div>
															</div>

															{/* Botão */}
															<Link to={`/servicos/aluguel-de-automoveis/${car.id}`}>
																<button
																	style={{ backgroundColor: 'var(--secondary)' }}
																	className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer"
																>
																	Ver Detalhes
																</button>
															</Link>
														</div>
													</article>
												);
											})}
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
									</>
								)}
							</main>
						</div>
					</div>
				</section>
			</div>

		</main>
	);
}
