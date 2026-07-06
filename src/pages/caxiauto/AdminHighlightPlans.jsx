import React, { useState } from 'react';
import { Sparkles, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { notyf } from '../../services/api';
import { AdminTableSkeleton } from '../../components/skeletons';
import {
	useAdminHighlightPlans,
	useAdminCreateHighlightPlan,
	useAdminUpdateHighlightPlan,
	useAdminDeleteHighlightPlan,
} from '../../hooks/queries/useAdmin';

const TARGET_LABELS = {
	SALE: 'Venda',
	RENT: 'Aluguer',
	PECA: 'Peças/Acessórios',
};

const TARGET_BADGE_COLORS = {
	SALE: 'bg-blue-100 text-blue-800',
	RENT: 'bg-purple-100 text-purple-800',
	PECA: 'bg-green-100 text-green-800',
};

const AdminHighlightPlans = () => {
	const [showModal, setShowModal] = useState(false);
	const [editingPlan, setEditingPlan] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		target: 'SALE',
		daysDuration: '',
	});

	const { data: plans, isLoading: loading } = useAdminHighlightPlans();
	const createPlanMutation = useAdminCreateHighlightPlan();
	const updatePlanMutation = useAdminUpdateHighlightPlan();
	const deletePlanMutation = useAdminDeleteHighlightPlan();
	const mutationPending = createPlanMutation.isPending || updatePlanMutation.isPending || deletePlanMutation.isPending;

	const handleOpenCreate = () => {
		setEditingPlan(null);
		setFormData({ name: '', price: '', target: 'SALE', daysDuration: '' });
		setShowModal(true);
	};

	const handleOpenEdit = (plan) => {
		setEditingPlan(plan);
		setFormData({
			name: plan.name,
			price: String(Number(plan.price)),
			target: plan.target,
			daysDuration: String(plan.daysDuration),
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			name: formData.name,
			price: Number(formData.price),
			target: formData.target,
			daysDuration: Number(formData.daysDuration),
		};

		try {
			let response;
			if (editingPlan) {
				response = await updatePlanMutation.mutateAsync({ id: editingPlan.id, data: payload });
			} else {
				response = await createPlanMutation.mutateAsync(payload);
			}

			if (response.success) {
				notyf.success(editingPlan ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
				setShowModal(false);
				setEditingPlan(null);
				setFormData({ name: '', price: '', target: 'SALE', daysDuration: '' });
			} else {
				notyf.error(response.message || 'Erro ao salvar plano');
			}
		} catch {
			notyf.error('Erro ao salvar plano');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja remover este plano de destaque?')) return;

		try {
			const response = await deletePlanMutation.mutateAsync(id);
			if (response.success) {
				notyf.success('Plano de destaque removido com sucesso!');
			} else {
				notyf.error(response.message || 'Erro ao remover plano');
			}
		} catch {
			notyf.error('Erro ao remover plano');
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Planos de Destaque</h1>
					<p className="text-gray-600 mt-1">Gerencie os planos de destaque para anúncios (Venda, Aluguer, Peças)</p>
				</div>
				<button
					onClick={handleOpenCreate}
					className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"
				>
					<Plus className="w-5 h-5" /> Novo Plano
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<AdminTableSkeleton rows={5} columns={5} />
				) : plans.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Sparkles className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum plano de destaque encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Público</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração (dias)</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{plans.map((plan) => (
									<tr key={plan.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(Number(plan.price))}</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TARGET_BADGE_COLORS[plan.target] || 'bg-gray-100 text-gray-800'}`}>
												{TARGET_LABELS[plan.target] || plan.target}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">{plan.daysDuration} dias</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleOpenEdit(plan)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
													title="Editar"
													disabled={mutationPending}
												>
													{mutationPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
												</button>
												<button
													onClick={() => handleDelete(plan.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
													title="Remover"
													disabled={mutationPending}
												>
													{mutationPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
							{editingPlan ? 'Editar Plano de Destaque' : 'Novo Plano de Destaque'}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: Destaque Venda 7 dias"
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
									<label className="block text-sm font-medium text-gray-700 mb-1">Público Alvo</label>
									<select
										value={formData.target}
										onChange={(e) => setFormData({ ...formData, target: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										required
									>
										<option value="SALE">Venda</option>
										<option value="RENT">Aluguer</option>
										<option value="PECA">Peças/Acessórios</option>
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
									disabled={mutationPending}
									className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{mutationPending ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											{editingPlan ? 'Salvando...' : 'Criando...'}
										</>
									) : (
										editingPlan ? 'Salvar' : 'Criar'
									)}
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

export default AdminHighlightPlans;
