import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getImageUrl, notyf } from '../services/api';
import {
	User,
	Star,
	MapPin,
	Calendar,
	CheckCircle,
	Car,
	Wrench,
	MessageSquare,
	Loader2,
	Shield,
	Phone,
	Mail
} from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import useDocumentTitle from '../hooks/useDocumentTitle';

const PerfilVendedor = () => {
	const { id } = useParams();
	useDocumentTitle('Perfil do Vendedor - CaxiAuto');

	const [loading, setLoading] = useState(true);
	const [seller, setSeller] = useState(null);
	const [vehicles, setVehicles] = useState([]);
	const [parts, setParts] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [reviewSummary, setReviewSummary] = useState(null);
	const [page, setPage] = useState(1);
	const [totalReviews, setTotalReviews] = useState(0);

	useEffect(() => {
		fetchSellerProfile();
	}, [id]);

	useEffect(() => {
		if (seller) {
			fetchReviews();
		}
	}, [seller, page]);

	const fetchSellerProfile = async () => {
		setLoading(true);
		try {
			const response = await api.get(`/users/sellers/${id}`);

			if (response.success && response.data) {
				setSeller(response.data);

				// Carregar veículos do vendedor
				if (response.data.vehicles) {
					setVehicles(response.data.vehicles.filter(v => v.status === 'ACTIVE').slice(0, 6));
				}

				// Carregar peças do vendedor
				if (response.data.pecas) {
					setParts(response.data.pecas.slice(0, 6));
				}
			} else {
				notyf.error('Vendedor não encontrado');
			}
		} catch (error) {
			console.error('Erro ao carregar perfil do vendedor:', error);
			notyf.error('Erro ao carregar perfil do vendedor');
		} finally {
			setLoading(false);
		}
	};

	const fetchReviews = async () => {
		try {
			const [reviewsRes, summaryRes] = await Promise.all([
				api.getReviewsBySeller(id, { page, limit: 5 }),
				api.getReviewSummary(id)
			]);

			if (reviewsRes.success) {
				setReviews(reviewsRes.data || []);
				setTotalReviews(reviewsRes.pagination?.total || 0);
			}

			if (summaryRes.success) {
				setReviewSummary(summaryRes.data);
			}
		} catch (error) {
			console.error('Erro ao carregar avaliações:', error);
		}
	};

	const handleReviewSubmitted = () => {
		fetchReviews();
	};

	const renderStars = (rating, size = 'w-5 h-5') => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`${size} ${
							star <= rating
								? 'fill-yellow-400 text-yellow-400'
								: 'fill-gray-200 text-gray-200'
						}`}
					/>
				))}
			</div>
		);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA'
		}).format(price);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-[#154c9a] mx-auto mb-4" />
					<p className="text-gray-600">Carregando perfil do vendedor...</p>
				</div>
			</div>
		);
	}

	if (!seller) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Vendedor não encontrado
					</h1>
					<p className="text-gray-600 mb-6">
						O vendedor que você está procurando não foi encontrado
					</p>
					<Link
						to="/stand/compra"
						className="inline-block bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors"
					>
						Ver Veículos
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header do Perfil */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="flex flex-col md:flex-row items-start gap-6">
						{/* Avatar */}
						<div className="w-32 h-32 bg-gradient-to-br from-[#154c9a] to-[#123f80] rounded-full flex items-center justify-center flex-shrink-0">
							<User className="w-16 h-16 text-white" />
						</div>

						{/* Informações */}
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-3xl font-bold text-gray-900">
									{seller.name} {seller.surname}
								</h1>
								{seller.isVerified && (
									<div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
										<CheckCircle className="w-4 h-4" />
										Verificado
									</div>
								)}
							</div>

							<div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
								{seller.provincia && (
									<div className="flex items-center gap-2">
										<MapPin className="w-5 h-5" />
										<span>{seller.provincia.replace('_', ' ')}</span>
									</div>
								)}
								{seller.createdAt && (
									<div className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										<span>Membro desde {formatDate(seller.createdAt)}</span>
									</div>
								)}
							</div>

							{/* Resumo de Avaliações */}
							{reviewSummary && (
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										{renderStars(Math.round(reviewSummary.averageRating), 'w-6 h-6')}
										<span className="text-2xl font-bold text-gray-900">
											{reviewSummary.averageRating.toFixed(1)}
										</span>
									</div>
									<div className="text-sm text-gray-600">
										{totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Coluna Principal */}
					<div className="lg:col-span-2 space-y-8">
						{/* Veículos do Vendedor */}
						{vehicles.length > 0 && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-3">
										<Car className="w-6 h-6 text-[#154c9a]" />
										<h2 className="text-xl font-bold text-gray-900">
											Veículos do Vendedor
										</h2>
									</div>
									<Link
										to="/stand/compra"
										className="text-sm text-[#154c9a] hover:underline font-medium"
									>
										Ver todos
									</Link>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{vehicles.map((vehicle) => (
										<Link
											key={vehicle.id}
											to={`/stand/compra/${vehicle.id}`}
											className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
										>
											<div className="h-40 bg-gray-100">
												<img
													src={getImageUrl(vehicle.image)}
													alt={vehicle.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="p-4">
												<h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
													{vehicle.name}
												</h3>
												<div className="flex items-center justify-between text-sm">
													<span className="text-gray-600">{vehicle.year}</span>
													<span className="font-bold text-[#154c9a]">
														{vehicle.priceSale ? formatPrice(vehicle.priceSale) : 'Sob consulta'}
													</span>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Peças do Vendedor */}
						{parts.length > 0 && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-3">
										<Wrench className="w-6 h-6 text-[#154c9a]" />
										<h2 className="text-xl font-bold text-gray-900">
											Peças do Vendedor
										</h2>
									</div>
									<Link
										to="/stand/pecas-acessorios"
										className="text-sm text-[#154c9a] hover:underline font-medium"
									>
										Ver todas
									</Link>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{parts.map((peca) => (
										<Link
											key={peca.id}
											to={`/stand/pecas-acessorios/${peca.id}`}
											className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
										>
											<div className="h-40 bg-gray-100">
												<img
													src={getImageUrl(peca.image)}
													alt={peca.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="p-4">
												<h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
													{peca.name}
												</h3>
												<div className="flex items-center justify-between text-sm">
													<span className="text-gray-600 line-clamp-1">{peca.compatibility?.join(', ')}</span>
													<span className="font-bold text-[#154c9a]">
														{formatPrice(peca.price)}
													</span>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Avaliações */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center gap-3 mb-6">
								<MessageSquare className="w-6 h-6 text-[#154c9a]" />
								<h2 className="text-xl font-bold text-gray-900">
									Avaliações
								</h2>
								<span className="text-sm text-gray-600">
									({totalReviews})
								</span>
							</div>

							{reviews.length === 0 ? (
								<div className="text-center py-8">
									<Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-600">
										Este vendedor ainda não recebeu avaliações
									</p>
								</div>
							) : (
								<div className="space-y-4 mb-6">
									{reviews.map((review) => (
										<div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
														<User className="w-5 h-5 text-gray-600" />
													</div>
													<div>
														<p className="font-semibold text-gray-900">
															{review.reviewer?.name} {review.reviewer?.surname}
														</p>
														<p className="text-xs text-gray-600">
															{formatDate(review.createdAt)}
														</p>
													</div>
												</div>
												{renderStars(review.rating, 'w-4 h-4')}
											</div>
											{review.comment && (
												<p className="text-gray-700 text-sm mt-2 ml-13">
													{review.comment}
												</p>
											)}
										</div>
									))}
								</div>
							)}

							{/* Paginação */}
							{totalReviews > 5 && (
								<div className="flex justify-center gap-2">
									<button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
									>
										Anterior
									</button>
									<button
										onClick={() => setPage(p => p + 1)}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
									>
										Próximo
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Card de Avaliação */}
						{reviewSummary && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-bold text-gray-900 mb-4">
									Resumo das Avaliações
								</h3>

								<div className="text-center mb-6">
									<div className="text-5xl font-bold text-gray-900 mb-2">
										{reviewSummary.averageRating.toFixed(1)}
									</div>
									{renderStars(Math.round(reviewSummary.averageRating), 'w-6 h-6')}
									<p className="text-sm text-gray-600 mt-2">
										{totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
									</p>
								</div>

								{/* Distribuição de Estrelas */}
								<div className="space-y-2">
									{[5, 4, 3, 2, 1].map((star) => {
										const count = reviewSummary.distribution?.[star] || 0;
										const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

										return (
											<div key={star} className="flex items-center gap-2">
												<span className="text-sm text-gray-600 w-6">{star}</span>
												<div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
													<div
														className="bg-yellow-400 h-full rounded-full transition-all"
														style={{ width: `${percentage}%` }}
													/>
												</div>
												<span className="text-sm text-gray-600 w-8 text-right">{count}</span>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Selo de Confiança */}
						{seller.isVerified && (
							<div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
								<div className="flex items-center gap-3 mb-3">
									<Shield className="w-8 h-8 text-green-600" />
									<h3 className="text-lg font-bold text-green-900">
										Vendedor Verificado
									</h3>
								</div>
								<p className="text-sm text-green-700">
									Este vendedor foi verificado pela equipe administrativa e possui o selo de confiança.
								</p>
							</div>
						)}

						{/* Avaliar Vendedor */}
						<ReviewForm
							sellerId={id}
							sellerName={`${seller.name} ${seller.surname}`}
							onReviewSubmitted={handleReviewSubmitted}
						/>

						{/* Contato */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								Entre em Contato
							</h3>
							<div className="space-y-3">
								{seller.phone && (
									<a
										href={`tel:${seller.phone}`}
										className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<Phone className="w-5 h-5 text-[#154c9a]" />
										<div>
											<p className="text-xs text-gray-600">Telefone</p>
											<p className="text-sm font-medium text-gray-900">{seller.phone}</p>
										</div>
									</a>
								)}
								{seller.email && (
									<a
										href={`mailto:${seller.email}`}
										className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<Mail className="w-5 h-5 text-[#154c9a]" />
										<div>
											<p className="text-xs text-gray-600">Email</p>
											<p className="text-sm font-medium text-gray-900">{seller.email}</p>
										</div>
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PerfilVendedor;
