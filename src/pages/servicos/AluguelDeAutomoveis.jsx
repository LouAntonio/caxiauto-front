import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Gauge,
	Calendar,
	MapPin,
	Droplet,
	AlertCircle,
	Heart,
	Car
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RentalVehicleFilter from '../../components/RentalVehicleFilter';
import Pagination from '../../components/Pagination';
import CarCardSkeleton from '../../components/CarCardSkeleton';
import MobileFilterBar from '../../components/MobileFilterBar';
import MobileFilterModal from '../../components/MobileFilterModal';
import api, { API_URL, getImageUrl, notyf } from '../../services/api';
import useAuthStore from '../../stores/authStore';
import { useWishlist, useAddVehicleToWishlist, useRemoveVehicleFromWishlist } from '../../hooks/queries/useWishlist';

export default function AluguelDeAutomoveis() {
	useDocumentTitle('Aluguel de Automóveis - Caxiauto');
	const navigate = useNavigate();
	const location = useLocation();
	const listingRef = useRef(null);

	const [filters, setFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [sortBy, setSortBy] = useState('createdAt');
	const vehiclesPerPage = 16;
	const [showMobileFilters, setShowMobileFilters] = useState(false);
	const [mobileSearch, setMobileSearch] = useState('');
	const { isAuthenticated } = useAuthStore();

	const queryParams = useMemo(() => {
		const params = { page: currentPage, limit: vehiclesPerPage, sort: sortBy, type: 'RENT' };
		if (filters.search) params.search = filters.search;
		if (filters.manufacturer) params.manufacturer = filters.manufacturer;
		if (filters.class) params.class = filters.class;
		if (filters.fuelType) params.fuelType = filters.fuelType;
		if (filters.transmission) params.transmission = filters.transmission;
		if (filters.minPrice) params.minPriceRent = filters.minPrice;
		if (filters.maxPrice) params.maxPriceRent = filters.maxPrice;
		if (filters.minYear) params.minYear = filters.minYear;
		if (filters.maxYear) params.maxYear = filters.maxYear;
		if (filters.featured) params.featured = 'true';
		return params;
	}, [filters, currentPage, sortBy]);

	const { data: response, isLoading, error: queryError } = useQuery({
		queryKey: ['vehicles', 'rent', currentPage, sortBy, filters],
		queryFn: () => api.listVehicles(queryParams),
	});

	const vehicles = response?.data || []
	const totalPages = response?.pagination?.totalPages || 1
	const totalVehicles = response?.pagination?.total || 0
	const error = queryError ? 'Erro ao conectar com o servidor' : (response && !response.success ? 'Erro ao carregar veículos' : null)

	const { data: wishlistData } = useWishlist()
	const addFavoriteMutation = useAddVehicleToWishlist()
	const removeFavoriteMutation = useRemoveVehicleFromWishlist()

	const favorites = new Set(
		(wishlistData?.vehicles || []).map(v => v.id)
	)

	useEffect(() => {
		const timer = setTimeout(() => {
			setMobileSearch(filters.search || '');
		}, 0);
		return () => clearTimeout(timer);
	}, [filters.search]);

	useEffect(() => {
		const routeFilters = location.state?.filters;
		if (routeFilters) {
			const mapped = {
				...(routeFilters.manufacturer && { manufacturer: routeFilters.manufacturer }),
				...(routeFilters.fuelType && { fuelType: routeFilters.fuelType }),
				...(routeFilters.transmission && { transmission: routeFilters.transmission }),
				...(routeFilters.featured !== undefined && { featured: routeFilters.featured }),
			};
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setFilters(mapped);
			setCurrentPage(1);
			window.history.replaceState({}, '');
			setTimeout(() => {
				listingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
		}
	}, [location.state]);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleSortChange = (e) => {
		const newSortBy = e.target.value;
		setSortBy(newSortBy);
		setCurrentPage(1);
	};

	const handleMobileSearchSubmit = () => {
		const nextFilters = {
			...filters,
			search: mobileSearch
		};
		setFilters(nextFilters);
		setCurrentPage(1);
	};

	const handleMobileAdvancedFilterChange = (newFilters) => {
		handleFilterChange(newFilters);
		setShowMobileFilters(false);
	};

	const getLowestPrice = (vehicle) => {
		if (!vehicle || !vehicle.priceRentDay) return null;
		return vehicle.priceRentDay;
	};

	const getPeriodLabel = () => {
		return '/dia';
	};

	const toggleFavorite = async (e, carId) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos');
			return;
		}

		try {
			const isFavorite = favorites.has(carId);

			if (isFavorite) {
				const response = await removeFavoriteMutation.mutateAsync(carId);
				if (response.success) {
					notyf.success('Removido dos favoritos');
				} else {
					notyf.error(response.message || 'Erro ao remover favorito');
				}
			} else {
				const response = await addFavoriteMutation.mutateAsync(carId);
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
			{/* Hero — imagem de fundo + overlay azul */}
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1650&q=80')"
					}}
					aria-hidden="true"
				/>
				<div className="absolute inset-0 bg-[#154c9a]/80" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white mb-10">
							<Car className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Aluguel de Automóveis</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.08] mb-8 [text-wrap:balance]">
							Alugue o carro{' '}
							<span className="text-[#d41120]">ideal</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div className="h-[3px] bg-white w-40" />
						</div>

						<p className="font-body text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
							Encontre o veículo ideal para sua viagem ou dia a dia. As melhores taxas e condições em Luanda.
						</p>
					</div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto">
				<section ref={listingRef} className="py-8 px-6">
					<div className="max-w-7xl mx-auto">
						<MobileFilterBar
							value={mobileSearch}
							onChange={setMobileSearch}
							onSubmit={handleMobileSearchSubmit}
							onOpenFilters={() => setShowMobileFilters(true)}
							placeholder="Pesquisar veículos para alugar..."
						/>

						<div className="flex flex-col lg:flex-row gap-8">
							<aside className="hidden lg:block w-full lg:w-80 flex-shrink-0">
								<div className="sticky top-6">
									<h2 className="font-display text-xl font-bold text-[#111827] mb-4">Filtrar Veículos</h2>
									<RentalVehicleFilter
										onFilterChange={handleFilterChange}
										initialFilters={filters}
									/>
								</div>
							</aside>

							<main className="flex-1">
								<div className="mb-6 flex items-center justify-between">
									<p className="font-body text-[#6b7280]">
										<span className="font-semibold text-[#111827]">{totalVehicles} veículos</span> disponíveis
									</p>
									<select
										value={sortBy}
										onChange={handleSortChange}
										className="border border-[#e5e7eb] rounded-xl px-4 py-2 bg-white outline-none cursor-pointer font-body text-sm text-[#6b7280] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
									>
										<option value="createdAt">Mais Recentes</option>
										<option value="price-asc">Preço: Menor para Maior</option>
										<option value="price-desc">Preço: Maior para Menor</option>
										<option value="year-desc">Ano: Mais Novo</option>
										<option value="year-asc">Ano: Mais Antigo</option>
									</select>
								</div>

								{isLoading && (
									<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
										<CarCardSkeleton count={8} className="w-full" />
									</div>
								)}

								{error && !isLoading && (
									<div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-3">
										<AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
										<div>
											<h3 className="font-semibold text-red-900 font-body mb-1">Erro ao carregar veículos</h3>
											<p className="text-red-700 font-body">{error}</p>
										</div>
									</div>
								)}

								{!isLoading && !error && vehicles.length === 0 && (
									<div className="text-center py-20">
										<Gauge className="w-16 h-16 text-[#e5e7eb] mx-auto mb-4" />
										<h3 className="font-display text-xl font-semibold text-[#111827] mb-2">Nenhum veículo encontrado</h3>
										<p className="font-body text-[#6b7280]">Tente ajustar os filtros para ver mais resultados</p>
									</div>
								)}

								{!isLoading && !error && vehicles.length > 0 && (
									<>
										<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
											{vehicles.map((car) => {
												const price = getLowestPrice(car);
												return (
													<article
														key={car.id}
														className="flex-shrink-0 w-full bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:border-[#154c9a]/20 transition-all duration-300 group"
													>
														<div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/servicos/aluguel-de-automoveis/${car.id}`)}>
															<img
																src={getImageUrl(car.image, '/images/i10.jpg')}
																alt={car.name}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
																onError={(e) => { e.target.src = '/images/i10.jpg'; }}
															/>

															<div className="absolute top-4 left-4">
																<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg font-body ${car.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
																}`}>
																	{car.status === 'ACTIVE' ? 'Disponível' : 'Indisponível'}
																</span>
															</div>

															{car.isVerified && (
																<div className="absolute top-4 right-4">
																	<span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg bg-[#154c9a] text-white font-body">
																		Verificado
																	</span>
																</div>
															)}

															{isAuthenticated && (
																<button
																	onClick={(e) => toggleFavorite(e, car.id)}
																	className={`absolute ${car.isVerified ? 'top-16' : 'top-4'} right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer`}
																	aria-label={favorites.has(car.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
																>
																	<Heart
																		className={`w-5 h-5 transition-all duration-200 ${favorites.has(car.id)
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
																{car.name}
															</h3>

															{price && (
																<div className="text-center mb-4">
																	<div className="font-body text-xs text-[#6b7280] mb-1">A partir de</div>
																	<div className="font-price text-2xl font-bold text-[#154c9a]">
																		{price.toLocaleString('pt-AO')},00 Kz{getPeriodLabel()}
																	</div>
																</div>
															)}

															<div className="grid grid-cols-2 gap-2 font-body text-sm text-[#6b7280]">
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

															<Link to={`/servicos/aluguel-de-automoveis/${car.id}`}>
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
				<RentalVehicleFilter
					onFilterChange={handleMobileAdvancedFilterChange}
					initialFilters={filters}
					showSearch={false}
				/>
			</MobileFilterModal>

		</main>
	);
}
