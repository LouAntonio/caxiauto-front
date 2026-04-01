import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import api, { notyf } from '../../services/api';
import { AlertTriangle, Search, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminReports = () => {
	const { admin } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ status: '', reason: '' });
	const [selectedReport, setSelectedReport] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const loadReports = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.currentPage,
				limit: 10,
				...filters,
			});
			const response = await api.getAllReports(Object.fromEntries(params));
			if (response.success) {
				setReports(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.total,
				});
			} else if (response.auth) {
				// Sessão expirada
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
				window.location.href = '/caxiauto/login';
			} else {
				notyf.error(response.msg || 'Erro ao carregar denúncias');
			}
		} catch (error) {
			console.error('Erro ao carregar denúncias:', error);
			notyf.error('Erro ao carregar denúncias');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadReports();
	}, [pagination.currentPage]);

	const handleUpdateStatus = async (id, status) => {
		try {
			const response = await api.updateReportStatus(id, status);
			if (response.success) {
				notyf.success(`Status atualizado para ${status}`);
				loadReports();
				setShowModal(false);
			}
		} catch (error) {
			notyf.error('Erro ao atualizar status');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta denúncia?')) return;
		try {
			const response = await api.deleteReport(id);
			if (response.success) {
				notyf.success('Denúncia eliminada');
				loadReports();
			}
		} catch (error) {
			notyf.error('Erro ao eliminar denúncia');
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'PENDING': return 'bg-yellow-100 text-yellow-800';
			case 'INVESTIGATING': return 'bg-blue-100 text-blue-800';
			case 'RESOLVED': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getReasonLabel = (reason) => {
		const labels = {
			FRAUD: 'Fraude',
			SPAM: 'Spam',
			INAPPROPRIATE: 'Inapropriado',
			WRONG_CATEGORY: 'Categoria Errada',
			SOLD_ALREADY: 'Já Vendido',
			OTHER: 'Outro',
		};
		return labels[reason] || reason;
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Denúncias</h1>
				<p className="text-gray-600 mt-1">Gerencie as denúncias da plataforma</p>
			</div>

			<form onSubmit={(e) => { e.preventDefault(); setPagination({ ...pagination, currentPage: 1 }); loadReports(); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<select
						value={filters.status}
						onChange={(e) => setFilters({ ...filters, status: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					>
						<option value="">Todos status</option>
						<option value="PENDING">Pendentes</option>
						<option value="INVESTIGATING">Em Investigação</option>
						<option value="RESOLVED">Resolvidas</option>
					</select>
					<select
						value={filters.reason}
						onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					>
						<option value="">Todos motivos</option>
						<option value="FRAUD">Fraude</option>
						<option value="SPAM">Spam</option>
						<option value="INAPPROPRIATE">Inapropriado</option>
						<option value="WRONG_CATEGORY">Categoria Errada</option>
						<option value="SOLD_ALREADY">Já Vendido</option>
						<option value="OTHER">Outro</option>
					</select>
					<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2">
						<Search className="w-5 h-5" /> Filtrar
					</button>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : reports.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma denúncia encontrada</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denunciante</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{reports.map((report) => (
								<tr key={report.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<span className="font-medium text-gray-900">{getReasonLabel(report.reason)}</span>
									</td>
									<td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{report.description}</td>
									<td className="px-6 py-4 text-sm text-gray-900">{report.reporter?.name}</td>
									<td className="px-6 py-4">
										<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
											{report.status}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString('pt-BR')}</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() => { setSelectedReport(report); setShowModal(true); }}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
												title="Ver detalhes"
											>
												<Eye className="w-5 h-5" />
											</button>
											<button
												onClick={() => handleDelete(report.id)}
												className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
												title="Eliminar"
											>
												<XCircle className="w-5 h-5" />
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

			{/* Modal de Detalhes */}
			{showModal && selectedReport && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<h2 className="text-xl font-bold mb-4">Detalhes da Denúncia</h2>
						<div className="space-y-4">
							<div>
								<p className="text-sm text-gray-500">Motivo</p>
								<p className="font-medium">{getReasonLabel(selectedReport.reason)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Descrição</p>
								<p className="text-gray-900">{selectedReport.description}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Status</p>
								<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
									{selectedReport.status}
								</span>
							</div>
							<div>
								<p className="text-sm text-gray-500">Denunciante</p>
								<p className="font-medium">{selectedReport.reporter?.name} - {selectedReport.reporter?.email}</p>
							</div>
							{selectedReport.reportedUser && (
								<div>
									<p className="text-sm text-gray-500">Denunciado</p>
									<p className="font-medium">{selectedReport.reportedUser?.name} - {selectedReport.reportedUser?.email}</p>
								</div>
							)}
							{selectedReport.vehicle && (
								<div>
									<p className="text-sm text-gray-500">Veículo</p>
									<p className="font-medium">{selectedReport.vehicle.name}</p>
								</div>
							)}
						</div>
						<div className="flex gap-3 mt-6">
							<button onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
								Marcar como Resolvida
							</button>
							<button onClick={() => handleUpdateStatus(selectedReport.id, 'INVESTIGATING')} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
								Em Investigação
							</button>
							<button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
								Fechar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminReports;
