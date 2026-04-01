import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { FolderTree, Search, Edit2, Trash2, Loader2, Plus } from 'lucide-react';

const AdminCategorias = () => {
	const [loading, setLoading] = useState(true);
	const [categorias, setCategorias] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [search, setSearch] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [formData, setFormData] = useState({ name: '' });

	const loadCategorias = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ page: pagination.currentPage, limit: 20 });
			if (search) params.append('search', search);
			const response = await api.listCategorias(Object.fromEntries(params));
			if (response.success) {
				setCategorias(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalItems,
				});
			} else if (handleAdminAuthError(response)) {
				return;
			}
		} catch (error) {
			console.error('Erro ao carregar categorias:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCategorias();
	}, [pagination.currentPage, search]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			if (editingCategory) {
				response = await api.updateCategoria(editingCategory.id, formData.name);
			} else {
				response = await api.createCategoria(formData.name);
			}
			if (response.success) {
				notyf.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!');
				setShowModal(false);
				setFormData({ name: '' });
				setEditingCategory(null);
				loadCategorias();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error('Erro ao salvar categoria');
			}
		} catch (error) {
			notyf.error('Erro ao salvar categoria');
		}
	};

	const handleEdit = (categoria) => {
		setEditingCategory(categoria);
		setFormData({ name: categoria.name });
		setShowModal(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta categoria?')) return;
		try {
			const response = await api.deleteCategoria(id);
			if (response.success) {
				notyf.success('Categoria eliminada!');
				loadCategorias();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao eliminar categoria');
			}
		} catch (error) {
			notyf.error('Erro ao eliminar categoria');
		}
	};

	const openNewCategoryModal = () => {
		setEditingCategory(null);
		setFormData({ name: '' });
		setShowModal(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Categorias de Peças</h1>
					<p className="text-gray-600 mt-1">Gerencie as categorias de peças</p>
				</div>
				<button onClick={openNewCategoryModal} className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2">
					<Plus className="w-5 h-5" /> Nova Categoria
				</button>
			</div>

			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar categorias..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						/>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : categorias.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<FolderTree className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma categoria encontrada</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peças</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{categorias.map((cat) => (
								<tr key={cat.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{cat._count?.pecas || 0} peças</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
												<Edit2 className="w-5 h-5" />
											</button>
											<button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
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

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">{editingCategory ? 'Editar' : 'Nova'} Categoria</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ name: e.target.value.toLowerCase().trim() })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
									required
								/>
							</div>
							<div className="flex gap-3">
								<button type="submit" className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80]">
									{editingCategory ? 'Atualizar' : 'Criar'}
								</button>
								<button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminCategorias;
