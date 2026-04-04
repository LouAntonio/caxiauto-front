import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Factory, Plus, Pencil, Trash2, Loader2, Search, X } from 'lucide-react';
import { notyf } from '../../services/api';

const AdminManufacturers = () => {
	const { listManufacturers, createManufacturer, updateManufacturer, deleteManufacturer } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [manufacturers, setManufacturers] = useState([]);
	const [searchInput, setSearchInput] = useState('');
	const [filteredMfrs, setFilteredMfrs] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState(null);
	const [formData, setFormData] = useState({ name: '' });

	const load = async () => {
		setLoading(true);
		try {
			const r = await listManufacturers();
			if (r.success) { setManufacturers(r.data); setFilteredMfrs(r.data); }
		} catch (e) { console.error(e); }
		finally { setLoading(false); }
	};

	useEffect(() => { load(); }, []);

	const handleSearch = (e) => {
		e.preventDefault();
		const term = searchInput.toLowerCase();
		setFilteredMfrs(manufacturers.filter(m => m.name.toLowerCase().includes(term)));
	};
	const handleClearSearch = () => { setSearchInput(''); setFilteredMfrs(manufacturers); };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let r;
			if (editing) { r = await updateManufacturer(editing.id, formData.name); }
			else { r = await createManufacturer(formData.name); }
			if (r.success) { notyf.success(editing ? 'Atualizado!' : 'Criado!'); setShowModal(false); setEditing(null); setFormData({ name: '' }); load(); }
			else notyf.error(r.msg || 'Erro ao salvar');
		} catch (error) { notyf.error('Erro ao salvar'); }
	};

	const handleEdit = (m) => { setEditing(m); setFormData({ name: m.name }); setShowModal(true); };

	const handleDelete = async (id) => {
		if (!window.confirm('Eliminar este fabricante?')) return;
		try { const r = await deleteManufacturer(id); if (r.success) { notyf.success('Eliminado!'); load(); } else notyf.error(r.msg || 'Erro ao eliminar'); }
		catch (error) { notyf.error('Erro ao eliminar'); }
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div><h1 className="text-2xl font-bold text-gray-900">Fabricantes de Veículos</h1><p className="text-gray-600 mt-1">Gerencie os fabricantes</p></div>
				<button onClick={() => { setEditing(null); setFormData({ name: '' }); setShowModal(true); }} className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"><Plus className="w-5 h-5" /> Novo Fabricante</button>
			</div>

			<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="flex gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input type="text" placeholder="Buscar fabricantes..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]" />
						{searchInput && <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
					</div>
					<button type="submit" className="bg-[#154c9a] text-white px-6 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"><Search className="w-5 h-5" /> Pesquisar</button>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
					: filteredMfrs.length === 0 ? <div className="flex flex-col items-center justify-center py-20"><Factory className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500">Nenhum fabricante</p></div>
					: <table className="w-full">
						<thead className="bg-gray-50">
							<tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículos</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th></tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredMfrs.map((m) => (
								<tr key={m.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{m._count?.vehicles || 0} veículos</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button onClick={() => handleEdit(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar"><Pencil className="w-5 h-5" /></button>
											<button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
					<div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
						<h2 className="text-xl font-bold mb-4">{editing ? 'Editar' : 'Novo'} Fabricante</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
								<input type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]" required />
							</div>
							<div className="flex gap-3">
								<button type="submit" className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80]">{editing ? 'Atualizar' : 'Criar'}</button>
								<button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminManufacturers;
