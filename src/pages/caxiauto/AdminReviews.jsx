import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import api, { notyf } from '../../services/api';
import { Star, Trash2, Loader2, Search, X } from 'lucide-react';

const AdminReviews = () => {
	const { adminListAllReviews } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [reviews, setReviews] = useState([]);
	const [stats, setStats] = useState(null);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ minRating: '', search: '' });
	const [searchInput, setSearchInput] = useState('');

	const loadReviews = async () => {
		setLoading(true);
		try {
			const params = { page: pagination.currentPage, limit: 20 };
			if (filters.minRating) params.minRating = filters.minRating;
			if (filters.search) params.search = filters.search;
			const response = await adminListAllReviews(params);
			if (response.success) {
				setReviews(response.data);
				setStats(response.stats);
				setPagination({ currentPage: response.pagination.currentPage, totalPages: response.pagination.totalPages, total: response.pagination.totalItems });
			} else notyf.error(response.message || 'Erro ao carregar');
		} catch (error) { console.error(error); notyf.error('Erro ao carregar avaliações'); }
		finally { setLoading(false); }
	};

	useEffect(() => { loadReviews(); }, [pagination.currentPage]);

	const handleSearch = (e) => { e.preventDefault(); setFilters({ ...filters, search: searchInput.trim() }); setPagination({ ...pagination, currentPage: 1 }); setTimeout(loadReviews, 0); };
	const handleClearSearch = () => { setSearchInput(''); setFilters({ minRating: '', search: '' }); setPagination({ ...pagination, currentPage: 1 }); setTimeout(loadReviews, 0); };

	const handleDelete = async (id) => {
		if (!window.confirm('Eliminar esta avaliação?')) return;
		try { const r = await api.deleteReview(id); if (r.success) { notyf.success('Eliminada'); loadReviews(); } }
		catch (error) { notyf.error('Erro ao eliminar'); }
	};

	const renderStars = (rating) => (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
		</div>
	);

	return (
		<div className="space-y-6">
			<div><h1 className="text-2xl font-bold text-gray-900">Avaliações</h1><p className="text-gray-600 mt-1">Gerencie as avaliações dos vendedores</p></div>

			{/* Stats */}
			{stats && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
						<p className="text-sm text-gray-500">Rating Médio</p>
						<div className="flex items-center justify-center gap-2 mt-2">
							<Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
							<span className="text-3xl font-bold">{stats.averageRating}</span>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
						<p className="text-sm text-gray-500">Total Reviews</p>
						<p className="text-3xl font-bold mt-2">{stats.totalReviews}</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:col-span-2">
						<p className="text-sm text-gray-500 mb-3">Distribuição</p>
						<div className="space-y-2">
							{[5, 4, 3, 2, 1].map(r => (
								<div key={r} className="flex items-center gap-3">
									<div className="flex gap-0.5 w-16">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}</div>
									<div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
										<div className="bg-yellow-500 h-full rounded-full transition-all" style={{ width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[r] / stats.totalReviews * 100) : 0}%` }}></div>
									</div>
									<span className="text-sm font-medium w-8 text-right">{stats.ratingDistribution[r] || 0}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Filters */}
			<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input type="text" placeholder="Buscar por nome..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]" />
						{searchInput && <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
					</div>
					<select value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]">
						<option value="">Todas ratings</option>
						<option value="5">★★★★★ (5)</option><option value="4">★★★★ (4+)</option><option value="3">★★★ (3+)</option><option value="2">★★ (2+)</option><option value="1">★ (1+)</option>
					</select>
					<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2"><Search className="w-5 h-5" /> Pesquisar</button>
				</div>
			</form>

			{/* Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
					: reviews.length === 0 ? <div className="flex flex-col items-center justify-center py-20"><Star className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500">Nenhuma avaliação</p></div>
					: <div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comentário</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{reviews.map((rev) => (
									<tr key={rev.id} className="hover:bg-gray-50">
										<td className="px-4 py-3"><p className="font-medium text-sm">{rev.reviewer?.name} {rev.reviewer?.surname}</p><p className="text-xs text-gray-500">{rev.reviewer?.email}</p></td>
										<td className="px-4 py-3"><p className="font-medium text-sm">{rev.seller?.name} {rev.seller?.surname}</p><p className="text-xs text-gray-500">{rev.seller?.email}</p></td>
										<td className="px-4 py-3">{renderStars(rev.rating)}</td>
										<td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{rev.comment || '—'}</td>
										<td className="px-4 py-3 text-sm text-gray-500">{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</td>
										<td className="px-4 py-3">
											<button onClick={() => handleDelete(rev.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				}
			</div>

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Anterior</button>
					<span className="text-sm text-gray-600">Página {pagination.currentPage} de {pagination.totalPages}</span>
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Próxima</button>
				</div>
			)}
		</div>
	);
};

export default AdminReviews;
