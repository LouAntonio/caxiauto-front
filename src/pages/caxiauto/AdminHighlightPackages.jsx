import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Sparkles, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { notyf } from '../../services/api';

const AdminHighlightPackages = () => {
	const {
		adminListHighlightPackages,
		adminCreateHighlightPackage,
		adminUpdateHighlightPackage,
		adminDeleteHighlightPackage,
	} = useAdmin();

	const [loading, setLoading] = useState(true);
	const [packages, setPackages] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingPackage, setEditingPackage] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		itemType: 'VEHICLE',
		daysDuration: '',
	});

	const loadPackages = async () => {
		setLoading(true);
		try {
			const response = await adminListHighlightPackages();
			if (response.success) setPackages(response.data);
		} catch (error) {
			console.error('Erro ao carregar pacotes de destaque:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPackages();
	}, []);

	const handleOpenCreate = () => {
		setEditingPackage(null);
		setFormData({ name: '', price: '', itemType: 'VEHICLE', daysDuration: '' });
		setShowModal(true);
	};

	const handleOpenEdit = (pkg) => {
		setEditingPackage(pkg);
		setFormData({
			name: pkg.name,
			price: String(Number(pkg.price)),
			itemType: pkg.itemType,
			daysDuration: String(pkg.daysDuration),
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			name: formData.name,
			price: Number(formData.price),
			itemType: formData.itemType,
			daysDuration: Number(formData.daysDuration),
		};

		try {
			let response;
			if (editingPackage) {
				response = await adminUpdateHighlightPackage(editingPackage.id, payload);
			} else {
				response = await adminCreateHighlightPackage(payload);
			}

			if (response.success) {
				notyf.success(editingPackage ? 'Pacote atualizado com sucesso!' : 'Pacote criado com sucesso!');
				setShowModal(false);
				setEditingPackage(null);
				setFormData({ name: '', price: '', itemType: 'VEHICLE', daysDuration: '' });
				loadPackages();
			} else {
				notyf.error(response.message || 'Erro ao salvar pacote');
			}
		} catch (error) {
			notyf.error('Erro ao salvar pacote');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja remover este pacote de destaque?')) return;

		try {
			const response = await adminDeleteHighlightPackage(id);
			if (response.success) {
				notyf.success('Pacote de destaque removido com sucesso!');
				loadPackages();
			} else {
				notyf.error(response.message || 'Erro ao remover pacote');
			}
		} catch (error) {
			notyf.error('Erro ao remover pacote');
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	const itemTypeLabel = (type) => {
		return type === 'VEHICLE' ? 'Veículo' : 'Peça';
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pacotes de Destaque</h1>
					<p className="text-gray-600 mt-1">Gerencie os pacotes avulsos de destaque para anúncios</p>
				</div>
				<button
					onClick={handleOpenCreate}
					className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"
				>
					<Plus className="w-5 h-5" /> Novo Pacote
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : packages.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Sparkles className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum pacote de destaque encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração (dias)</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{packages.map((pkg) => (
									<tr key={pkg.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(Number(pkg.price))}</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												pkg.itemType === 'VEHICLE'
													? 'bg-blue-100 text-blue-800'
													: 'bg-green-100 text-green-800'
											}`}>
												{itemTypeLabel(pkg.itemType)}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">{pkg.daysDuration} dias</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleOpenEdit(pkg)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Editar"
												>
													<Pencil className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(pkg.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
													title="Remover"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">
							{editingPackage ? 'Editar Pacote' : 'Novo Pacote de Destaque'}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pacote</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: Super Destaque 7 dias"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Preço (Kwanza)</label>
									<input
										type="number"
										step="0.01"
										min={0}
										value={formData.price}
										onChange={(e) => setFormData({ ...formData, price: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: 10000"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Anúncio</label>
									<select
										value={formData.itemType}
										onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										required
									>
										<option value="VEHICLE">Veículo</option>
										<option value="PECA">Peça</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Duração (dias)</label>
									<input
										type="number"
										min={0}
										value={formData.daysDuration}
										onChange={(e) => setFormData({ ...formData, daysDuration: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: 7"
										required
									/>
									<p className="text-xs text-gray-500 mt-1">Quantos dias o anúncio ficará em destaque</p>
								</div>
							</div>
							<div className="flex gap-3 mt-6">
								<button
									type="submit"
									className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80]"
								>
									{editingPackage ? 'Salvar' : 'Criar'}
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
								>
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

export default AdminHighlightPackages;
