import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Calendar, MapPin, Droplet, Heart } from 'lucide-react';
import { Link } from 'react-router-dom'
import api, { getImageUrl, notyf } from '../services/api';
import { useFeaturedVehicles } from '../hooks/queries/useVehicles';
import useAuthStore from '../stores/authStore';
import CarCardSkeleton from './CarCardSkeleton';

export default function FeaturedCars({ title = 'Carros em Destaque', useVehicleQuery = useFeaturedVehicles, linkTo, linkState }) {
	const railRef = useRef(null);
	const { data: vehicles, isLoading } = useVehicleQuery();
	const [wishlist, setWishlist] = useState(new Set());
	const [loadingWishlist, setLoadingWishlist] = useState(new Set());
	const { isAuthenticated } = useAuthStore();

	const isFeatured = title.toLowerCase().includes('destaque');

	// Buscar wishlist do usuário quando autenticado
	useEffect(() => {
		const fetchWishlist = async () => {
			if (!isAuthenticated) {
				setWishlist(new Set());
				return;
			}

			try {
				const response = await api.getWishlist();
				if (response.success && response.data) {
					const wishlistIds = new Set(
						response.data.vehicles?.map(v => v.id) || []
					);
					setWishlist(wishlistIds);
				}
			} catch (error) {
				console.error('Erro ao buscar wishlist:', error);
			}
		};

		fetchWishlist();
	}, [isAuthenticated]);

	// Função para adicionar/remover da wishlist
	const toggleWishlist = async (e, carId) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar à wishlist');
			return;
		}

		// Evitar múltiplos cliques
		if (loadingWishlist.has(carId)) return;

		setLoadingWishlist(prev => new Set(prev).add(carId));

		try {
			const isInWishlist = wishlist.has(carId);

			if (isInWishlist) {
				const response = await api.removeVehicleFromWishlist(carId);
				if (response.success) {
					setWishlist(prev => {
						const newSet = new Set(prev);
						newSet.delete(carId);
						return newSet;
					});
					notyf.success('Removido da wishlist');
				} else {
					notyf.error(response.message || 'Erro ao remover da wishlist');
				}
			} else {
				const response = await api.addVehicleToWishlist(carId);
				if (response.success) {
					setWishlist(prev => new Set(prev).add(carId));
					notyf.success('Adicionado à wishlist');
				} else {
					notyf.error(response.message || 'Erro ao adicionar à wishlist');
				}
			}
		} catch (error) {
			console.error('Erro ao alternar wishlist:', error);
			notyf.error('Erro ao processar wishlist');
		} finally {
			setLoadingWishlist(prev => {
				const newSet = new Set(prev);
				newSet.delete(carId);
				return newSet;
			});
		}
	};

	function scroll(dir = 1) {
		const rail = railRef.current;
		if (!rail) return;
		const cardWidth = 260;
		rail.scrollBy({ left: dir * (cardWidth * 2), behavior: 'smooth' });
	}

	return (
		<section className="pt-6 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-8">
					<div>
						<h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">{title}</h2>
						<div className="w-12 h-[3px] bg-[#d41120] rounded-full mt-2" />
					</div>
					<div className="flex items-center gap-4">
						<Link
							to={linkTo || (isFeatured ? "/stand/compra?featured=true" : "/stand/compra")}
							state={linkState}
							className="group flex items-center gap-1 text-lg font-medium text-[#154c9a] font-body hover:underline"
						>
							Ver todos
							<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Link>
						{!isLoading && vehicles.length > 0 && (
							<div className="hidden md:flex gap-2">
								<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-[#f8f6f2] flex items-center justify-center text-[#6b7280] hover:bg-[#154c9a] hover:text-white transition-all duration-300">
									<ChevronLeft className="w-5 h-5" />
								</button>
								<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-[#f8f6f2] flex items-center justify-center text-[#6b7280] hover:bg-[#154c9a] hover:text-white transition-all duration-300">
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="relative">
					{isLoading ? (
						<div className="flex gap-6 overflow-x-hidden pb-4">
							<CarCardSkeleton count={5} className="w-64" />
						</div>
					) : vehicles.length === 0 ? (
						<div className="flex justify-center items-center py-20 text-[#6b7280] font-body">
							<p>Nenhum veículo encontrado</p>
						</div>
					) : (
						<div
							ref={railRef}
							className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{vehicles.map((car) => {
								const isNew = car.kilometers === 0 || car.kilometers < 100;
								const condition = isNew ? 'Novo' : 'Usado';

								const formattedPrice = new Intl.NumberFormat('pt-AO').format(car.priceSale || 0);
								const formattedKm = new Intl.NumberFormat('pt-AO').format(car.kilometers || 0);
								const fuelType = car.fuelType ? car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1) : 'N/A';

								return (
									<article
										key={car.id}
										className="flex-shrink-0 w-[80vw] sm:w-64 snap-start bg-white rounded-2xl border border-[#e5e7eb] shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
									>
										<div className="relative h-40 overflow-hidden">
											<img
												src={getImageUrl(car.image)}
												alt={car.name}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
											/>

											<div className="absolute top-4 left-4">
												<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${condition === 'Novo' ? 'bg-[#154c9a] text-white' : 'bg-[#d41120] text-white'}`}>
													{condition}
												</span>
											</div>

											{isAuthenticated && (
												<button
													onClick={(e) => toggleWishlist(e, car.id)}
													className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
													aria-label={wishlist.has(car.id) ? 'Remover da wishlist' : 'Adicionar à wishlist'}
													disabled={loadingWishlist.has(car.id)}
												>
													<Heart
														className={`w-5 h-5 transition-all duration-200 ${wishlist.has(car.id)
															? 'fill-red-500 text-red-500'
															: 'text-gray-600 hover:text-red-500'
														} ${loadingWishlist.has(car.id) ? 'opacity-50' : ''}`}
													/>
												</button>
											)}

										</div>

										<div className="p-5">
											<h3 className="font-display text-base font-bold text-[#111827] mb-3 line-clamp-1 text-center">
												{car.name}
											</h3>

											<div className="font-body font-bold text-[#154c9a] text-base mb-4 text-center">
												{formattedPrice},00 Kz
											</div>

											<div className="grid grid-cols-2 gap-2 text-sm text-[#6b7280]">
												<div className="flex items-center justify-end gap-2">
													<span className="text-right">{formattedKm} km</span>
													<Gauge className="w-4 h-4 text-[#9ca3af]" />
												</div>
												<div className="flex items-center gap-2">
													<Calendar className="w-4 h-4 text-[#9ca3af]" />
													<span>{car.year}</span>
												</div>
												<div className="flex items-center justify-end gap-2">
													<span className="text-right">{car.provincia}</span>
													<MapPin className="w-4 h-4 text-[#9ca3af]" />
												</div>
												<div className="flex items-center gap-2">
													<Droplet className="w-4 h-4 text-[#9ca3af]" />
													<span>{fuelType}</span>
												</div>
											</div>

											<Link to={`/stand/compra/${car.id}`}>
												<button className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-xl bg-[#154c9a] hover:bg-blue-800 transition-all font-body cursor-pointer">
													Ver Detalhes
												</button>
											</Link>
										</div>
									</article>
								);
							})}
						</div>
					)}

					{!isLoading && vehicles.length > 0 && (
						<div className="flex md:hidden gap-3 justify-center mt-6">
							<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-[#f8f6f2] flex items-center justify-center text-[#6b7280] hover:bg-[#154c9a] hover:text-white transition-all duration-300">
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-[#f8f6f2] flex items-center justify-center text-[#6b7280] hover:bg-[#154c9a] hover:text-white transition-all duration-300">
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					)}
				</div>

			</div>

		</section>
	);
}
