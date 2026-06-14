import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import { Star, Trash2, Loader2, Search, X } from 'lucide-react';
import { AdminTableSkeleton } from '../../components/skeletons';
import useLoadingState from '../../hooks/useLoadingState';
import useDebounce from '../../hooks/useDebounce';
import { useAdminReviews } from '../../hooks/queries/useAdmin';

const AdminReviews = () => {
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ minRating: '', search: '' });
	const [searchInput, setSearchInput] = useState('');
	const debouncedSearch = useDebounce(searchInput, 300);
	const { loading: actionLoading, withLoading } = useLoadingState({ preventConcurrent: true });

	const params = { page: pagination.currentPage, limit: 20 };
	if (filters.minRating) params.minRating = filters.minRating;
	if (filters.search) params.search = filters.search;
	const { data: reviews, isLoading: loading } = useAdminReviews(params);

	// Auto-search quando o valor debounce muda
	useEffect(() => {
		const timer = setTimeout(() => {
			setFilters(prev => ({ ...prev, search: debouncedSearch }));
			setPagination(prev => ({ ...prev, currentPage: 1 }));
		}, 0);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);

	const handleSearch = (e) => { e.preventDefault(); setFilters({ ...filters, search: debouncedSearch.trim() }); setPagination(prev => ({ ...prev, currentPage: 1 })); };
	const handleClearSearch = () => { setSearchInput(''); setFilters({ minRating: '', search: '' }); setPagination(prev => ({ ...prev, currentPage: 1 })); };

	const handleDelete = async (id) => {
		if (!window.confirm('Eliminar esta avaliação?')) return;
		await withLoading(async () => {
			const r = await api.deleteReview(id);
			if (r.success) { notyf.success('Eliminada'); }
		});
	};

	const renderStars = (rating) => (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
		</div>
	);

	return (
		<div className="space-y-6">
			<div><h1 className="text-2xl font-bold text-gray-900">Avaliações</h1><p className="text-gray-600 mt-1">Gerencie as avaliações dos vendedores</p></div>



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
					<button type="submit" disabled={actionLoading} className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
						{actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
						{actionLoading ? 'Pesquisando...' : 'Pesquisar'}
					</button>
				</div>
			</form>

			{/* Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<AdminTableSkeleton rows={5} columns={6} />
				) : reviews.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Star className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma avaliação</p>
					</div>
				) : (
					<div className="overflow-x-auto">
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
										<td className="px-4 py-3">
											<p className="font-medium text-sm">{rev.reviewer?.name} {rev.reviewer?.surname}</p>
											<p className="text-xs text-gray-500">{rev.reviewer?.email}</p>
										</td>
										<td className="px-4 py-3">
											<p className="font-medium text-sm">{rev.seller?.name} {rev.seller?.surname}</p>
											<p className="text-xs text-gray-500">{rev.seller?.email}</p>
										</td>
										<td className="px-4 py-3">{renderStars(rev.rating)}</td>
										<td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{rev.comment || '—'}</td>
										<td className="px-4 py-3 text-sm text-gray-500">{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</td>
										<td className="px-4 py-3">
											<button
												onClick={() => handleDelete(rev.id)}
												disabled={actionLoading}
												className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
												title="Eliminar"
											>
												{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
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
