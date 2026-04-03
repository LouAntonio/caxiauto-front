import React, { useState } from 'react';
import api, { notyf } from '../services/api';
import {
	Star,
	MessageSquare,
	X,
	Loader2,
	CheckCircle
} from 'lucide-react';

const ReviewForm = ({ sellerId, sellerName, onReviewSubmitted }) => {
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [comment, setComment] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (rating === 0) {
			notyf.error('Selecione uma avaliação de 1 a 5 estrelas');
			return;
		}

		setLoading(true);
		try {
			const response = await api.createReview(sellerId, rating, comment || undefined);

			if (response.success) {
				notyf.success('Avaliação enviada com sucesso!');
				setSuccess(true);
				setRating(0);
				setComment('');
				
				setTimeout(() => {
					setShowForm(false);
					setSuccess(false);
				}, 2000);

				if (onReviewSubmitted) {
					onReviewSubmitted(response.data);
				}
			} else {
				notyf.error(response.msg || 'Erro ao enviar avaliação');
			}
		} catch (error) {
			console.error('Erro ao enviar avaliação:', error);
			notyf.error('Erro ao enviar avaliação. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const renderStars = () => {
		return (
			<div className="flex items-center gap-2">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => setRating(star)}
						onMouseEnter={() => setHoveredRating(star)}
						onMouseLeave={() => setHoveredRating(0)}
						className="transition-transform hover:scale-110 focus:outline-none"
					>
						<Star
							className={`w-10 h-10 ${
								star <= (hoveredRating || rating)
									? 'fill-yellow-400 text-yellow-400'
									: 'fill-gray-200 text-gray-200'
							}`}
						/>
					</button>
				))}
				<span className="ml-3 text-sm font-medium text-gray-700">
					{rating > 0 ? `${rating} estrela${rating > 1 ? 's' : ''}` : 'Selecione'}
				</span>
			</div>
		);
	};

	if (!showForm) {
		return (
			<button
				onClick={() => setShowForm(true)}
				className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-lg hover:bg-[#123f80] transition-colors font-semibold flex items-center justify-center gap-2"
			>
				<Star className="w-5 h-5" />
				Avaliar Vendedor
			</button>
		);
	}

	if (success) {
		return (
			<div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
				<CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
				<h3 className="text-lg font-bold text-green-900 mb-2">Avaliação Enviada!</h3>
				<p className="text-sm text-green-700">
					Obrigado por avaliar {sellerName}. Sua opinião é muito importante!
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white border-2 border-[#154c9a] rounded-xl p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Star className="w-6 h-6 text-[#154c9a]" />
					<h3 className="text-lg font-bold text-gray-900">Avaliar {sellerName}</h3>
				</div>
				<button
					onClick={() => setShowForm(false)}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<X className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Seleção de Estrelas */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">
						Sua Avaliação *
					</label>
					{renderStars()}
				</div>

				{/* Comentário */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<div className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4" />
							<span>Comentário (opcional)</span>
						</div>
					</label>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={4}
						placeholder="Conte sua experiência com este vendedor..."
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent resize-none"
						maxLength={500}
					/>
					<p className="text-xs text-gray-500 mt-1 text-right">
						{comment.length}/500 caracteres
					</p>
				</div>

				{/* Botão de Enviar */}
				<button
					type="submit"
					disabled={loading || rating === 0}
					className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-lg hover:bg-[#123f80] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Enviando...
						</>
					) : (
						<>
							<CheckCircle className="w-5 h-5" />
							Enviar Avaliação
						</>
					)}
				</button>
			</form>
		</div>
	);
};

export default ReviewForm;
