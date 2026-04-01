import React, { useState, useEffect } from 'react';
import api, { getImageUrl, notyf } from '../../services/api';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { Wrench, Search, Edit2, Trash2, Loader2, Plus } from 'lucide-react';

const AdminPecas = () => {
	const [loading, setLoading] = useState(true);
	const [pecas, setPecas] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ search: '', categoria: '', provincia: '' });
	const [categorias, setCategorias] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const loadPecas = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.currentPage,
				limit: 10,
				...filters,
			});
			const response = await api.listPecas(Object.fromEntries(params));
			if (response.success) {
				setPecas(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalItems,
				});
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao carregar peças');
			}
		} catch (error) {
			console.error('Erro ao carregar peças:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadCategorias = async () => {
		try {
			const response = await api.listCategorias();
			if (response.success) setCategorias(response.data);
		} catch (error) {
			console.error('Erro ao carregar categorias:', error);
		}
	};

	useEffect(() => {
		loadPecas();
		loadCategorias();
	}, [pagination.currentPage]);

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta peça?')) return;
		try {
			const response = await api.deletePeca(id);
			if (response.success) {
				notyf.success('Peça eliminada com sucesso');
				loadPecas();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao eliminar peça');
			}
		} catch (error) {
			notyf.error('Erro ao eliminar peça');
		}
	};

	const formatCurrency = (value) =>
		new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Peças</h1>
				<p className="text-gray-600 mt-1">Gerencie todas as peças da plataforma</p>
			</div>

			<form onSubmit={(e) => { e.preventDefault(); setPagination({ ...pagination, currentPage: 1 }); loadPecas(); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<input
						type="text"
						placeholder="Buscar peças..."
						value={filters.search}
						onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					/>
					<select
						value={filters.categoria}
						onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					>
						<option value="">Todas categorias</option>
						{categorias.map((cat) => (
							<option key={cat.id} value={cat.id}>{cat.name}</option>
						))}
					</select>
					<input
						type="text"
						placeholder="Província"
						value={filters.provincia}
						onChange={(e) => setFilters({ ...filters, provincia: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					/>
					<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2">
						<Search className="w-5 h-5" /> Filtrar
					</button>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : pecas.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Wrench className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma peça encontrada</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peça</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Província</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{pecas.map((peca) => (
								<tr key={peca.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<img src={getImageUrl(peca.image, '/images/i10.jpg')} alt={peca.name} className="w-16 h-12 rounded-lg object-cover" />
											<div>
												<p className="font-medium text-gray-900">{peca.name}</p>
												<p className="text-sm text-gray-500">{peca.Seller?.name} {peca.Seller?.surname}</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">{peca.Categoria?.name}</td>
									<td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(peca.price)}</td>
									<td className="px-6 py-4 text-sm text-gray-900">{peca.provincia}</td>
									<td className="px-6 py-4">
										<button onClick={() => handleDelete(peca.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
											<Trash2 className="w-5 h-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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

export default AdminPecas;
