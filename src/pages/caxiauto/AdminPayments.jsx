import React, { useState } from 'react';
import { Banknote, Check, X, Eye, Loader2, Search } from 'lucide-react';
import { notyf } from '../../services/api';
import {
	useAdminPayments,
	useAdminApprovePayment,
	useAdminRejectPayment,
} from '../../hooks/queries/useAdmin';
import { AdminTableSkeleton } from '../../components/skeletons';

const FOR_LABELS = {
	SUBSCRIPTION: 'Subscrição',
	HIGHLIGHT: 'Destaque',
};

const SECTION_LABELS = {
	ALUGUEL: 'Aluguel',
	PECAS: 'Peças e Acessórios',
	EMPRESAS: 'Empresas',
};

const SECTION_BADGES = {
	ALUGUEL: 'bg-sky-100 text-sky-800',
	PECAS: 'bg-amber-100 text-amber-800',
	EMPRESAS: 'bg-emerald-100 text-emerald-800',
};

const STATUS_BADGE = {
	PENDING: 'bg-yellow-100 text-yellow-800',
	APPROVED: 'bg-green-100 text-green-800',
	REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABEL = {
	PENDING: 'Pendente',
	APPROVED: 'Aprovado',
	REJECTED: 'Rejeitado',
};

const AdminPayments = () => {
	const [filterStatus, setFilterStatus] = useState('');
	const [filterFor, setFilterFor] = useState('');
	const [page, setPage] = useState(1);
	const [rejectModal, setRejectModal] = useState(null);
	const [rejectNotes, setRejectNotes] = useState('');
	const [viewProof, setViewProof] = useState(null);

	const params = {};
	if (filterStatus) params.status = filterStatus;
	if (filterFor) params.for = filterFor;
	params.page = page;

	const { data, isLoading } = useAdminPayments(params);
	const approvePayment = useAdminApprovePayment();
	const rejectPaymentMutation = useAdminRejectPayment();

	const payments = data?.data || [];
	const pagination = data?.pagination || null;

	const handleApprove = async (id) => {
		try {
			const response = await approvePayment.mutateAsync(id);
			if (response.success) {
				notyf.success('Pagamento aprovado com sucesso!');
			} else {
				notyf.error(response.message || 'Erro ao aprovar pagamento');
			}
		} catch {
			notyf.error('Erro ao aprovar pagamento');
		}
	};

	const handleReject = async () => {
		if (!rejectModal) return;
		try {
			const response = await rejectPaymentMutation.mutateAsync({ id: rejectModal, adminNotes: rejectNotes });
			if (response.success) {
				notyf.success('Pagamento rejeitado');
				setRejectModal(null);
				setRejectNotes('');
			} else {
				notyf.error(response.message || 'Erro ao rejeitar pagamento');
			}
		} catch {
			notyf.error('Erro ao rejeitar pagamento');
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
					<p className="text-gray-600 mt-1">Gerencie os pagamentos e comprovativos dos utilizadores</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-wrap gap-4 items-center">
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">Status:</label>
						<select
							value={filterStatus}
							onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
							className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a] text-sm"
						>
							<option value="">Todos</option>
							<option value="PENDING">Pendentes</option>
							<option value="APPROVED">Aprovados</option>
							<option value="REJECTED">Rejeitados</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">Tipo:</label>
						<select
							value={filterFor}
							onChange={(e) => { setFilterFor(e.target.value); setPage(1); }}
							className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a] text-sm"
						>
							<option value="">Todos</option>
							<option value="SUBSCRIPTION">Subscrição</option>
							<option value="HIGHLIGHT">Destaque</option>
						</select>
					</div>
					{filterStatus || filterFor ? (
						<button
							onClick={() => { setFilterStatus(''); setFilterFor(''); setPage(1); }}
							className="text-sm text-red-600 hover:text-red-800"
						>
							Limpar filtros
						</button>
					) : null}
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{isLoading ? (
					<AdminTableSkeleton rows={8} columns={7} />
				) : payments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Banknote className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum pagamento encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilizador</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comprovativo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{payments.map((payment) => (
									<tr key={payment.id} className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900">
												{payment.user?.name} {payment.user?.surname}
											</div>
											<div className="text-xs text-gray-500">{payment.user?.email}</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											<div className="flex items-center gap-1.5 flex-wrap">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{FOR_LABELS[payment.for] || payment.for}
												</span>
												{payment.for === 'SUBSCRIPTION' && payment.section && (
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SECTION_BADGES[payment.section] || 'bg-gray-100 text-gray-800'}`}>
														{SECTION_LABELS[payment.section] || payment.section}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											{formatCurrency(Number(payment.amount))}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{payment.proofUrl ? (
												<button
													onClick={() => setViewProof(payment.proofUrl)}
													className="flex items-center gap-1 text-[#154c9a] hover:text-blue-700"
												>
													<Eye className="w-4 h-4" />
													<span>Ver</span>
												</button>
											) : (
												<span className="text-gray-400">—</span>
											)}
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[payment.status] || 'bg-gray-100 text-gray-800'}`}>
												{STATUS_LABEL[payment.status] || payment.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
											{formatDate(payment.createdAt)}
										</td>
										<td className="px-6 py-4 text-right">
											{payment.status === 'PENDING' ? (
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => handleApprove(payment.id)}
														disabled={approvePayment.isPending}
														className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
														title="Aprovar"
													>
														{approvePayment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
													</button>
													<button
														onClick={() => setRejectModal(payment.id)}
														className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
														title="Rejeitar"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											) : (
												<span className="text-xs text-gray-400">—</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
						<button
							onClick={() => setPage(Math.max(1, page - 1))}
							disabled={page === 1}
							className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
						>
							Anterior
						</button>
						<span className="text-sm text-gray-600">
							Página {pagination.currentPage} de {pagination.totalPages}
						</span>
						<button
							onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
							disabled={page === pagination.totalPages}
							className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
						>
							Seguinte
						</button>
					</div>
				)}
			</div>

			{/* Reject Modal */}
			{rejectModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">Rejeitar Pagamento</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Motivo da rejeição</label>
								<textarea
									value={rejectNotes}
									onChange={(e) => setRejectNotes(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a] resize-none"
									rows={3}
									placeholder="Explique o motivo..."
								/>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleReject}
									disabled={rejectPaymentMutation.isPending}
									className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{rejectPaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
									Rejeitar
								</button>
								<button
									onClick={() => { setRejectModal(null); setRejectNotes(''); }}
									className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Proof Image Modal */}
			{viewProof && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl p-4 max-w-2xl w-full max-h-[90vh] overflow-auto">
						<div className="flex justify-end mb-2">
							<button
								onClick={() => setViewProof(null)}
								className="p-2 text-gray-600 hover:text-gray-900"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<img src={viewProof} alt="Comprovativo" className="w-full h-auto rounded-lg" />
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPayments;
