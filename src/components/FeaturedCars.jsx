import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Calendar, MapPin, Droplet, Heart } from 'lucide-react';
import { Link } from 'react-router-dom'
import api, { getImageUrl, notyf } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function FeaturedCars({ title = 'Carros em Destaque' }) {
	const railRef = useRef(null);
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState(new Set());
	const [loadingFavorites, setLoadingFavorites] = useState(new Set());
	const { isAuthenticated } = useAuth();

	// Determinar se deve buscar destacados ou recentes baseado no título
	const isFeatured = title.toLowerCase().includes('destaque');

	useEffect(() => {
		const fetchCars = async () => {
			try {
				setLoading(true);
				const params = {
					limit: 10,
					page: 1,
				};

				// Adicionar filtro de featured se for carros em destaque
				if (isFeatured) {
					params.featured = 'true';
				}

				const response = await api.listVeiculosCompra(params);

				if (response.success && response.data) {
					setCars(response.data);
				}
			} catch (error) {
				console.error('Erro ao buscar carros:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCars();
	}, [isFeatured]);

	// Buscar favoritos do usuário quando autenticado
	useEffect(() => {
		const fetchFavorites = async () => {
			if (!isAuthenticated) {
				setFavorites(new Set());
				return;
			}

			try {
				const response = await api.getFavorites();
				if (response.success && response.data) {
					const favoriteIds = new Set(
						response.data
							.filter(fav => fav.itemType === 'sell')
							.map(fav => fav.itemId)
					);
					setFavorites(favoriteIds);
				}
			} catch (error) {
				console.error('Erro ao buscar favoritos:', error);
			}
		};

		fetchFavorites();
	}, [isAuthenticated]);

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
				const response = await api.removeFavorite(carId);
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
				const response = await api.addFavorite(carId, 'sell');
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

	function scroll(dir = 1) {
		const rail = railRef.current;
		if (!rail) return;
		const cardWidth = 260;
		rail.scrollBy({ left: dir * (cardWidth * 2), behavior: 'smooth' });
	}

	return (
		<section className="pt-6 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex justify-between mb-8 ">
					<div className="flex gap-3 items-baseline">
						<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
						<span className="text-gray-400 text-2xl">|</span>
						<Link
							to={isFeatured ? "/stand/compra?featured=true" : "/stand/compra"}
							style={{ color: 'var(--primary)' }}
							className="group flex items-center gap-1 text-lg font-medium hover:underline"
						>
							Ver todos
							<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>

					{!loading && cars.length > 0 && (
						<div className="hidden md:flex gap-3">
							<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
								<ChevronLeft className="w-5 h-5 text-gray-700" />
							</button>
							<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
								<ChevronRight className="w-5 h-5 text-gray-700" />
							</button>
						</div>
					)}
				</div>

				{/* Carousel */}
				<div className="relative">
					{loading ? (
						<div className="flex justify-center items-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
						</div>
					) : cars.length === 0 ? (
						<div className="flex justify-center items-center py-20 text-gray-500">
							<p>Nenhum veículo encontrado</p>
						</div>
					) : (
						<div
							ref={railRef}
							className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{cars.map((car) => {
								// Determinar condição baseado no ano (novo se >= ano atual - 1)
								const currentYear = new Date().getFullYear();
								const isNew = car.year >= currentYear - 1;
								const condition = isNew ? 'Novo' : 'Usado';

								// Formatar preço
								const formattedPrice = new Intl.NumberFormat('pt-AO').format(car.price);

								// Formatar quilometragem
								const formattedKm = new Intl.NumberFormat('pt-AO').format(car.kilometers);

								// Capitalizar tipo de combustível
								const fuelType = car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1);

								return (
									<article
										key={car._id}
										className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
									>
										{/* Imagem */}
										<div className="relative h-40 overflow-hidden">
											<img
												src={getImageUrl(car.mainImage)}
												alt={car.name}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
											/>

											{/* Badge de condição (Novo / Usado) */}
											<div className="absolute top-4 left-4">
												<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${condition === 'Novo' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
													{condition}
												</span>
											</div>

											{/* Botão de favorito */}
											{isAuthenticated && (
												<button
													onClick={(e) => toggleFavorite(e, car._id)}
													className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
													aria-label={favorites.has(car._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
													disabled={loadingFavorites.has(car._id)}
												>
													<Heart
														className={`w-5 h-5 transition-all duration-200 ${favorites.has(car._id)
																? 'fill-red-500 text-red-500'
																: 'text-gray-600 hover:text-red-500'
															} ${loadingFavorites.has(car._id) ? 'opacity-50' : ''}`}
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
											<div
												style={{ color: 'var(--primary)' }}
												className="text-1xl font-bold mb-4 text-center"
											>
												{formattedPrice},00 Kz
											</div>

											{/* Especificações (duas colunas) */}
											<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
												<div className="flex items-center justify-end gap-2">
													<span className="text-right">{formattedKm} km</span>
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
													<span>{fuelType}</span>
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
								);
							})}
						</div>
					)}

					{/* Botões mobile */}
					{!loading && cars.length > 0 && (
						<div className="flex md:hidden gap-3 justify-center mt-6">
							<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
								<ChevronLeft className="w-5 h-5 text-gray-700" />
							</button>
							<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
								<ChevronRight className="w-5 h-5 text-gray-700" />
							</button>
						</div>
					)}
				</div>

				{/* Link para ver todos */}

			</div>

			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.line-clamp-1 {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</section>
	);
}
