import React, { useState } from 'react';
import { notyf } from '../../services/api';
import { FolderTree, Search, Edit2, Trash2, Loader2, Plus, X } from 'lucide-react';
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../../hooks/queries/useAdmin';

const AdminCategorias = () => {
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [search, setSearch] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [formData, setFormData] = useState({ name: '' });

	const createCategoriaMutation = useCreateCategoria();
	const updateCategoriaMutation = useUpdateCategoria();
	const deleteCategoriaMutation = useDeleteCategoria();

	const params = { page: pagination.currentPage, limit: 20 };
	if (search.trim()) params.search = search.trim();
	const { data: categorias, isLoading: loading } = useCategorias(params);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			notyf.error('O nome da categoria é obrigatório');
			return;
		}
		try {
			let response;
			if (editingCategory) {
				response = await updateCategoriaMutation.mutateAsync({ id: editingCategory.id, name: formData.name });
			} else {
				response = await createCategoriaMutation.mutateAsync(formData.name);
			}
			if (response.success) {
				notyf.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!');
				setShowModal(false);
				setFormData({ name: '' });
				setEditingCategory(null);
			} else {
				notyf.error(response.message || 'Erro ao salvar categoria');
			}
		} catch {
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
			const response = await deleteCategoriaMutation.mutateAsync(id);
			if (response.success) {
				notyf.success('Categoria eliminada!');
			} else {
				notyf.error(response.message || 'Erro ao eliminar categoria');
			}
		} catch {
			notyf.error('Erro ao eliminar categoria');
		}
	};

	const openNewCategoryModal = () => {
		setEditingCategory(null);
		setFormData({ name: '' });
		setShowModal(true);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination({ ...pagination, currentPage: 1 });
	};

	const handleClearSearch = () => {
		setSearch('');
		setPagination({ ...pagination, currentPage: 1 });
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

			{/* Pesquisa */}
			<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="flex gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar categorias..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						/>
						{search && (
							<button
								type="button"
								onClick={handleClearSearch}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
					<button
						type="submit"
						className="bg-[#154c9a] text-white px-6 py-2 rounded-lg hover:bg-[#123f80] transition-colors flex items-center gap-2"
					>
						<Search className="w-5 h-5" /> Pesquisar
					</button>
				</div>
			</form>

			{/* Tabela */}
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

			{/* Paginação */}
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
									onChange={(e) => setFormData({ name: e.target.value })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
									placeholder="Ex: Motor, Suspensão, Travões..."
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
