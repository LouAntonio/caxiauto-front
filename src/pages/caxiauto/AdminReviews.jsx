import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { Star, Trash2, Loader2 } from 'lucide-react';

const AdminReviews = () => {
	const [loading, setLoading] = useState(true);
	const [reviews, setReviews] = useState([]);

	const loadReviews = async () => {
		setLoading(true);
		try {
			// Carregar todas as reviews (o backend não tem endpoint específico para listar todas)
			// Vamos usar um approach diferente - o admin pode ver reviews de vendedores específicos
			// Por enquanto, mostramos uma mensagem informativa
		} catch (error) {
			console.error('Erro ao carregar avaliações:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadReviews();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta avaliação?')) return;
		try {
			const response = await api.deleteReview(id);
			if (response.success) {
				notyf.success('Avaliação eliminada');
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error('Erro ao eliminar avaliação');
			}
		} catch (error) {
			notyf.error('Erro ao eliminar avaliação');
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
				<p className="text-gray-600 mt-1">Gerencie as avaliações dos vendedores</p>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
				<Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciamento de Avaliações</h3>
				<p className="text-gray-600 mb-4">
					As avaliações são gerenciadas individualmente por vendedor. Para ver avaliações específicas,
					acesse o perfil do vendedor na seção de Usuários.
				</p>
				<p className="text-sm text-gray-500">
					Apenas administradores podem eliminar avaliações inadequadas.
				</p>
			</div>
		</div>
	);
};

export default AdminReviews;
