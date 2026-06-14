import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import { notyf } from '../../services/api';
import {
	Star,
	MessageSquare,
	User,
	Calendar,
	Loader2,
	Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { ListSkeleton } from '../../components/skeletons';
import ButtonLoader from '../../components/ButtonLoader';
import { useMyReviews, useDeleteReview } from '../../hooks/queries/useReviews';
import { useQueryClient } from '@tanstack/react-query';

const Avaliacoes = () => {
	useDocumentTitle('Minhas Avaliações - CaxiAuto');

	useAuthStore();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [deletingId, setDeletingId] = useState(null);

	const params = { page, limit: 10 };
	const { data: reviews, isLoading } = useMyReviews(params);
	const deleteReview = useDeleteReview();

	useEffect(() => {
		const raw = queryClient.getQueryData(['reviews', 'my', params]);
		if (raw?.success) {
			setTotal(raw.pagination?.total || 0);
			setTotalPages(raw.pagination?.totalPages || 1);
		}
	}, [reviews, page]);

	const handleDeleteReview = async (reviewId) => {
		if (deletingId) return;
		if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
			return;
		}

		setDeletingId(reviewId);
		try {
			const response = await deleteReview.mutateAsync(reviewId);

			if (response.success) {
				notyf.success('Avaliação excluída com sucesso');
			} else {
				notyf.error(response.msg || 'Erro ao excluir avaliação');
			}
		} catch (error) {
			console.error('Erro ao excluir avaliação:', error);
			notyf.error('Erro ao excluir avaliação');
		} finally {
			setDeletingId(null);
		}
	};

	const renderStars = (rating) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`w-5 h-5 ${
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
						<Star className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Minhas Avaliações</h2>
						<p className="text-sm text-gray-500 mt-1">
							{total} {total === 1 ? 'avaliação feita' : 'avaliações feitas'}
						</p>
					</div>
				</div>

				{/* Lista de Avaliações */}
				{isLoading ? (
					<ListSkeleton count={5} variant="compact" />
				) : reviews.length === 0 ? (
					<div className="text-center py-16">
						<Star className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Nenhuma avaliação ainda
						</h3>
						<p className="text-gray-600 mb-6">
							Avalie vendedores com quem você teve experiências na plataforma
						</p>
						<Link
							to="/stand/compra"
							className="inline-block bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors"
						>
							Explorar Veículos
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{reviews.map((review) => (
							<div
								key={review.id}
								className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										{/* Informações do Vendedor */}
										<div className="flex items-center gap-3 mb-3">
											<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
												<User className="w-6 h-6 text-gray-600" />
											</div>
											<div>
												<h3 className="font-bold text-gray-900">
													{review.seller?.name} {review.seller?.surname}
												</h3>
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Calendar className="w-4 h-4" />
													<span>{formatDate(review.createdAt)}</span>
												</div>
											</div>
										</div>

										{/* Estrelas */}
										<div className="mb-3">
											{renderStars(review.rating)}
										</div>

										{/* Comentário */}
										{review.comment && (
											<div className="bg-gray-50 rounded-lg p-4 mt-3">
												<div className="flex items-start gap-2">
													<MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
													<p className="text-gray-700">{review.comment}</p>
												</div>
											</div>
										)}
									</div>

									{/* Botão de Excluir */}
									<ButtonLoader
										onClick={() => handleDeleteReview(review.id)}
										loading={deletingId === review.id}
										loadingText=""
										variant="gray"
										size="sm"
										className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
										title="Excluir avaliação"
									>
										<Trash2 className="w-5 h-5" />
									</ButtonLoader>
								</div>
							</div>
						))}

						{/* Paginação */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-6 border-t">
								<p className="text-sm text-gray-600">
									Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, total)} de {total} avaliações
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
									>
										Anterior
									</button>
									<button
										onClick={() => setPage(p => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
									>
										Próximo
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Avaliacoes;
