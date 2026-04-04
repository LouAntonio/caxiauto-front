import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import api, { getImageUrl, notyf } from '../../services/api';
import { AlertTriangle, Search, Eye, CheckCircle, XCircle, Loader2, X } from 'lucide-react';

const AdminReports = () => {
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [activeTab, setActiveTab] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [filters, setFilters] = useState({ reason: '' });
	const [selectedReport, setSelectedReport] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const loadReports = async () => {
		setLoading(true);
		try {
			const params = { page: pagination.currentPage, limit: 10 };
			if (activeTab !== 'all') params.status = activeTab;
			if (filters.reason) params.reason = filters.reason;
			const response = await api.getAllReports(params);
			if (response.success) {
				setReports(response.data);
				setPagination({ currentPage: response.pagination.currentPage, totalPages: response.pagination.totalPages, total: response.pagination.total });
			} else notyf.error(response.msg || 'Erro ao carregar');
		} catch (error) { console.error(error); notyf.error('Erro ao carregar denúncias'); }
		finally { setLoading(false); }
	};

	useEffect(() => { loadReports(); }, [pagination.currentPage, activeTab]);

	const handleSearch = (e) => { e.preventDefault(); setPagination({ ...pagination, currentPage: 1 }); loadReports(); };
	const handleClearSearch = () => { setSearchInput(''); setFilters({ reason: '' }); setPagination({ ...pagination, currentPage: 1 }); setTimeout(loadReports, 0); };

	const handleUpdateStatus = async (id, status) => {
		try {
			const response = await api.updateReportStatus(id, status);
			if (response.success) { notyf.success(`Status: ${status}`); loadReports(); setShowModal(false); }
		} catch (error) { notyf.error('Erro ao atualizar'); }
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Eliminar esta denúncia?')) return;
		try { const r = await api.deleteReport(id); if (r.success) { notyf.success('Eliminada'); loadReports(); } }
		catch (error) { notyf.error('Erro ao eliminar'); }
	};

	const getStatusColor = (s) => ({ PENDING: 'bg-yellow-100 text-yellow-800', INVESTIGATING: 'bg-blue-100 text-blue-800', RESOLVED: 'bg-green-100 text-green-800' }[s] || 'bg-gray-100 text-gray-800');
	const getReasonColor = (r) => ({ FRAUD: 'bg-red-100 text-red-800', SPAM: 'bg-yellow-100 text-yellow-800', INAPPROPRIATE: 'bg-purple-100 text-purple-800', WRONG_CATEGORY: 'bg-orange-100 text-orange-800', SOLD_ALREADY: 'bg-blue-100 text-blue-800', OTHER: 'bg-gray-100 text-gray-800' }[r] || 'bg-gray-100 text-gray-800');
	const getReasonLabel = (r) => ({ FRAUD: 'Fraude', SPAM: 'Spam', INAPPROPRIATE: 'Inapropriado', WRONG_CATEGORY: 'Categoria Errada', SOLD_ALREADY: 'Já Vendido', OTHER: 'Outro' }[r] || r);
	const getTargetType = (rep) => { if (rep.vehicleId) return 'Veículo'; if (rep.pecaId) return 'Peça'; if (rep.reportedUserId) return 'Usuário'; return '—'; };

	const tabCounts = { all: pagination.total };

	return (
		<div className="space-y-6">
			<div><h1 className="text-2xl font-bold text-gray-900">Denúncias</h1><p className="text-gray-600 mt-1">Gerencie as denúncias da plataforma</p></div>

			{/* Tabs */}
			<div className="flex gap-2 border-b border-gray-200">
				{[
					{ key: 'all', label: 'Todas' },
					{ key: 'PENDING', label: 'Pendentes' },
					{ key: 'INVESTIGATING', label: 'Em Investigação' },
					{ key: 'RESOLVED', label: 'Resolvidas' }
				].map(tab => (
					<button key={tab.key} onClick={() => { setActiveTab(tab.key); setPagination({ ...pagination, currentPage: 1 }); }}
						className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === tab.key ? 'bg-white border border-gray-200 border-b-white text-[#154c9a]' : 'text-gray-500 hover:text-gray-700'}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Filters */}
			<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input type="text" placeholder="Buscar..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]" />
						{searchInput && <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
					</div>
					<select value={filters.reason} onChange={(e) => setFilters({ ...filters, reason: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]">
						<option value="">Todos motivos</option>
						<option value="FRAUD">Fraude</option><option value="SPAM">Spam</option><option value="INAPPROPRIATE">Inapropriado</option>
						<option value="WRONG_CATEGORY">Categoria Errada</option><option value="SOLD_ALREADY">Já Vendido</option><option value="OTHER">Outro</option>
					</select>
					<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2"><Search className="w-5 h-5" /> Pesquisar</button>
				</div>
			</form>

			{/* Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
					: reports.length === 0 ? <div className="flex flex-col items-center justify-center py-20"><AlertTriangle className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500">Nenhuma denúncia</p></div>
					: <div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denunciante</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denunciado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{reports.map((rep) => (
									<tr key={rep.id} className="hover:bg-gray-50">
										<td className="px-4 py-3"><span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">{getTargetType(rep)}</span></td>
										<td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getReasonColor(rep.reason)}`}>{getReasonLabel(rep.reason)}</span></td>
										<td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{rep.description}</td>
										<td className="px-4 py-3 text-sm text-gray-900">{rep.reporter?.name} {rep.reporter?.surname}</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{rep.reportedUser ? `${rep.reportedUser.name} ${rep.reportedUser.surname}` : rep.vehicle ? rep.vehicle.name : rep.peca ? rep.peca.name : '—'}
										</td>
										<td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rep.status)}`}>{rep.status}</span></td>
										<td className="px-4 py-3 text-sm text-gray-500">{new Date(rep.createdAt).toLocaleDateString('pt-BR')}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<button onClick={() => { setSelectedReport(rep); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Detalhes"><Eye className="w-4 h-4" /></button>
												<button onClick={() => handleDelete(rep.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><XCircle className="w-4 h-4" /></button>
											</div>
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

			{/* Modal */}
			{showModal && selectedReport && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Detalhes da Denúncia</h2>
							<button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
						</div>
						<div className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Motivo</p><span className={`px-2 py-1 text-xs font-medium rounded-full ${getReasonColor(selectedReport.reason)}`}>{getReasonLabel(selectedReport.reason)}</span></div>
								<div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Status</p><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>{selectedReport.status}</span></div>
							</div>
							<div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Descrição</p><p className="text-gray-900 mt-1">{selectedReport.description}</p></div>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Denunciante</p><p className="font-medium">{selectedReport.reporter?.name} {selectedReport.reporter?.surname}</p><p className="text-sm text-gray-500">{selectedReport.reporter?.email}</p></div>
								{selectedReport.reportedUser && <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Denunciado</p><p className="font-medium">{selectedReport.reportedUser?.name} {selectedReport.reportedUser?.surname}</p><p className="text-sm text-gray-500">{selectedReport.reportedUser?.email}</p></div>}
							</div>
							{selectedReport.vehicle && (
								<div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
									<img src={getImageUrl(selectedReport.vehicle.image)} alt="" className="w-14 h-10 rounded object-cover" />
									<div><p className="text-xs text-gray-500">Veículo</p><p className="font-medium">{selectedReport.vehicle.name}</p></div>
								</div>
							)}
							{selectedReport.peca && (
								<div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
									<img src={getImageUrl(selectedReport.peca.image)} alt="" className="w-14 h-10 rounded object-cover" />
									<div><p className="text-xs text-gray-500">Peça</p><p className="font-medium">{selectedReport.peca.name}</p></div>
								</div>
							)}
						</div>
						<div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
							<button onClick={() => handleUpdateStatus(selectedReport.id, 'INVESTIGATING')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Em Investigação</button>
							<button onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">Resolvida</button>
							<button onClick={() => handleUpdateStatus(selectedReport.id, 'PENDING')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-medium">Pendente</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminReports;
