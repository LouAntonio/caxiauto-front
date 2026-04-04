import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import api, { getImageUrl, notyf } from '../../services/api';
import {
	UserCheck,
	Search,
	CheckCircle,
	XCircle,
	FileText,
	Loader2,
	Eye,
	User,
	Mail,
	Phone,
	MapPin,
	ShieldCheck,
	Shield,
	Star as StarFilled,
	Star,
	Car,
	Wrench,
	AlertCircle,
	X
} from 'lucide-react';

const AdminSellers = () => {
	const { getPendingSellers, getSellerDocs, verifySeller, adminGetSellerDetails } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('pending');
	const [pendingSellers, setPendingSellers] = useState([]);
	const [allSellers, setAllSellers] = useState([]);
	const [sellerDocs, setSellerDocs] = useState([]);
	const [pendingCount, setPendingCount] = useState(0);
	const [searchInput, setSearchInput] = useState('');
	const [filters, setFilters] = useState({ search: '', isVerified: '' });
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

	// Modals
	const [detailsModal, setDetailsModal] = useState({ open: false, seller: null });
	const [docsModal, setDocsModal] = useState({ open: false, seller: null, docs: null });
	const [confirmModal, setConfirmModal] = useState({ open: false, sellerId: null, sellerName: '', action: 'verify' });

	const loadPendingSellers = async () => {
		setLoading(true);
		try {
			const response = await getPendingSellers({ page: pagination.currentPage, limit: 15 });
			if (response.success) {
				setPendingSellers(response.data);
				setPagination(response.pagination);
				setPendingCount(response.pagination.totalItems);
			} else {
				notyf.error(response.message || 'Erro ao carregar vendedores');
			}
		} catch (error) {
			console.error('Erro:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadAllSellers = async () => {
		setLoading(true);
		try {
			const response = await api.listUsers({ page: pagination.currentPage, limit: 15, status: filters.search ? undefined : undefined });
			if (response.success) {
				const sellers = response.data.filter(u => u.role === 'SELLER' || u.role === 'USER');
				const filtered = sellers.filter(s => {
					if (filters.isVerified && s.isVerified !== (filters.isVerified === 'true')) return false;
					if (filters.search) {
						const term = filters.search.toLowerCase();
						const fullName = `${s.name} ${s.surname}`.toLowerCase();
						if (!fullName.includes(term) && !s.email.toLowerCase().includes(term)) return false;
					}
					return true;
				});
				setAllSellers(filtered);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalUsers,
				});
			}
		} catch (error) {
			console.error('Erro:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadSellerDocs = async () => {
		setLoading(true);
		try {
			const response = await getSellerDocs({ page: pagination.currentPage, limit: 20 });
			if (response.success) {
				setSellerDocs(response.data);
				setPagination(response.pagination);
			}
		} catch (error) {
			console.error('Erro:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (activeTab === 'pending') loadPendingSellers();
		else if (activeTab === 'all') loadAllSellers();
		else loadSellerDocs();
	}, [activeTab, pagination.currentPage]);

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters({ ...filters, search: searchInput.trim() });
		setPagination({ ...pagination, currentPage: 1 });
		setTimeout(() => loadAllSellers(), 0);
	};

	const handleClearSearch = () => {
		setSearchInput('');
		setFilters({ search: '', isVerified: '' });
		setPagination({ ...pagination, currentPage: 1 });
		setTimeout(() => loadAllSellers(), 0);
	};

	const handleVerifySeller = (sellerId, sellerName, isVerified) => {
		setConfirmModal({ open: true, sellerId, sellerName, action: isVerified ? 'revoke' : 'verify' });
	};

	const submitVerify = async () => {
		const isVerified = confirmModal.action === 'verify';
		try {
			const response = await verifySeller(confirmModal.sellerId, isVerified);
			if (response.success) {
				notyf.success(isVerified ? 'Vendedor verificado! Email enviado.' : 'Verificação removida! Email enviado.');
				setConfirmModal({ open: false, sellerId: null, sellerName: '', action: 'verify' });
				if (activeTab === 'pending') loadPendingSellers();
				else if (activeTab === 'all') loadAllSellers();
			} else {
				notyf.error(response.message || 'Erro ao verificar');
			}
		} catch (error) {
			notyf.error('Erro ao verificar vendedor');
		}
	};

	const handleViewDocs = async (seller) => {
		try {
			const response = await adminGetSellerDetails(seller.id || seller.sellerId);
			if (response.success) {
				setDocsModal({ open: true, seller, docs: response.data.sellerDocs });
			}
		} catch (error) {
			console.error('Erro:', error);
			notyf.error('Erro ao carregar documentos');
		}
	};

	const handleViewDetails = async (sellerId) => {
		try {
			const response = await adminGetSellerDetails(sellerId);
			if (response.success) {
				setDetailsModal({ open: true, seller: response.data });
			} else {
				notyf.error('Erro ao carregar detalhes');
			}
		} catch (error) {
			notyf.error('Erro ao carregar detalhes');
		}
	};

	const formatDate = (date) => {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const getProvinciaLabel = (prov) => {
		const map = {
			LUANDA: 'Luanda', BENGUELA: 'Benguela', HUAMBO: 'Huambo', HUILA: 'Huíla',
			CABINDA: 'Cabinda', NAMIBE: 'Namibe', BENGO: 'Bengo', CUANZA_NORTE: 'Cuanza Norte',
			CUANZA_SUL: 'Cuanza Sul', CUNENE: 'Cunene', BIE: 'Bié', MOXICO: 'Moxico',
			LUNDA_NORTE: 'Lunda Norte', LUNDA_SUL: 'Lunda Sul', UIGE: 'Uíge', ZAIRE: 'Zaire',
			CUANDO_CUBANGO: 'Cuando Cubango', MALANJE: 'Malanje'
		};
		return map[prov] || prov;
	};

	const formatCurrency = (value) => {
		if (!value) return '—';
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Vendedores</h1>
				<p className="text-gray-600 mt-1">Gerencie verificação e documentos de vendedores</p>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 border-b border-gray-200">
				<button
					onClick={() => { setActiveTab('pending'); setPagination({ ...pagination, currentPage: 1 }); }}
					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center gap-2 ${
						activeTab === 'pending'
							? 'bg-white border border-gray-200 border-b-white text-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Pendentes
					{pendingCount > 0 && (
						<span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
					)}
				</button>
				<button
					onClick={() => { setActiveTab('all'); setPagination({ ...pagination, currentPage: 1 }); }}
					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
						activeTab === 'all'
							? 'bg-white border border-gray-200 border-b-white text-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Todos Vendedores
				</button>
				<button
					onClick={() => { setActiveTab('docs'); setPagination({ ...pagination, currentPage: 1 }); }}
					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
						activeTab === 'docs'
							? 'bg-white border border-gray-200 border-b-white text-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Documentos
				</button>
			</div>

			{/* Pesquisa (tab "Todos") */}
			{activeTab === 'all' && (
				<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="relative md:col-span-2">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar por nome ou email..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
							/>
							{searchInput && (
								<button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
						<select
							value={filters.isVerified}
							onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
							className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						>
							<option value="">Verificação</option>
							<option value="true">Verificados</option>
							<option value="false">Não verificados</option>
						</select>
						<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2">
							<Search className="w-5 h-5" /> Pesquisar
						</button>
					</div>
				</form>
			)}

			{/* Conteúdo */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : activeTab === 'pending' ? (
					pendingSellers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<UserCheck className="w-16 h-16 text-green-300 mb-4" />
							<p className="text-gray-500 text-lg">Nenhum vendedor pendente</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{pendingSellers.map((seller) => (
										<tr key={seller.id} className="hover:bg-gray-50 bg-yellow-50/50">
											<td className="px-6 py-4">
												<p className="font-medium text-gray-900">{seller.name} {seller.surname}</p>
												<p className="text-sm text-gray-500">{seller.email}</p>
											</td>
											<td className="px-6 py-4 text-sm text-gray-900">{seller.phone || 'N/A'}</td>
											<td className="px-6 py-4 text-sm text-gray-900">{seller.provincia ? getProvinciaLabel(seller.provincia) : 'N/A'}</td>
											<td className="px-6 py-4 text-sm text-gray-500">{formatDate(seller.createdAt)}</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleViewDocs(seller)}
														className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
														title="Ver documentos"
													>
														<Eye className="w-5 h-5" />
													</button>
													<button
														onClick={() => handleVerifySeller(seller.id, `${seller.name} ${seller.surname}`, false)}
														className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
														title="Verificar"
													>
														<CheckCircle className="w-5 h-5" />
													</button>
													<button
														onClick={() => setConfirmModal({ open: true, sellerId: seller.id, sellerName: `${seller.name} ${seller.surname}`, action: 'reject' })}
														className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
														title="Rejeitar"
													>
														<XCircle className="w-5 h-5" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)
				) : activeTab === 'all' ? (
					allSellers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<User className="w-16 h-16 text-gray-300 mb-4" />
							<p className="text-gray-500 text-lg">Nenhum vendedor encontrado</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificado</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Província</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{allSellers.map((seller) => (
										<tr key={seller.id} className="hover:bg-gray-50">
											<td className="px-4 py-3">
												<p className="font-medium text-gray-900">{seller.name} {seller.surname}</p>
												<p className="text-sm text-gray-500">{seller.email}</p>
											</td>
											<td className="px-4 py-3">
												<span className={`px-2 py-1 text-xs font-medium rounded-full ${
													seller.role === 'ADMIN' ? 'bg-purple-100 text-purple-800'
													: seller.role === 'SELLER' ? 'bg-blue-100 text-blue-800'
													: 'bg-gray-100 text-gray-800'
												}`}>
													{seller.role}
												</span>
											</td>
											<td className="px-4 py-3">
												{seller.isVerified ? (
													<span className="flex items-center gap-1 text-green-600 text-sm"><ShieldCheck className="w-4 h-4" /> Sim</span>
												) : (
													<span className="flex items-center gap-1 text-yellow-600 text-sm"><Shield className="w-4 h-4" /> Não</span>
												)}
											</td>
											<td className="px-4 py-3 text-sm text-gray-600">{seller.provincia ? getProvinciaLabel(seller.provincia) : '—'}</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-1">
													<button
														onClick={() => handleViewDetails(seller.id)}
														className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
														title="Ver detalhes"
													>
														<Eye className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleVerifySeller(seller.id, `${seller.name} ${seller.surname}`, seller.isVerified)}
														className={`p-1.5 rounded-lg ${
															seller.isVerified ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
														}`}
														title={seller.isVerified ? 'Remover verificação' : 'Verificar'}
													>
														{seller.isVerified ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)
				) : (
					sellerDocs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<FileText className="w-16 h-16 text-gray-300 mb-4" />
							<p className="text-gray-500 text-lg">Nenhum documento encontrado</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BI/Passaporte</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docs Empresa</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selfies</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{sellerDocs.map((doc) => (
										<tr key={doc.id} className="hover:bg-gray-50">
											<td className="px-6 py-4">
												<p className="font-medium text-gray-900">{doc.user?.name} {doc.user?.surname}</p>
												<p className="text-xs text-gray-500">{doc.user?.email}</p>
											</td>
											<td className="px-6 py-4 text-sm text-gray-900">{doc.idCard?.length || 0} docs</td>
											<td className="px-6 py-4 text-sm text-gray-900">{doc.organizationDocs?.length || 0} docs</td>
											<td className="px-6 py-4 text-sm text-gray-900">{doc.selfies?.length || 0} fotos</td>
											<td className="px-6 py-4">
												<button
													onClick={() => handleViewDocs(doc.user || doc)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Ver documentos"
												>
													<Eye className="w-5 h-5" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)
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

			{/* ==================== MODAL DE DOCUMENTOS ==================== */}
			{docsModal.open && docsModal.docs && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDocsModal({ open: false, seller: null, docs: null })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Documentos — {docsModal.seller?.name} {docsModal.seller?.surname}</h2>
							<button onClick={() => setDocsModal({ open: false, seller: null, docs: null })} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
						</div>

						<div className="p-6 space-y-6">
							{/* BI/Passaporte */}
							{docsModal.docs.idCard && docsModal.docs.idCard.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5" /> BI / Passaporte ({docsModal.docs.idCard.length})</h3>
									<div className="grid grid-cols-2 gap-3">
										{docsModal.docs.idCard.map((doc, i) => (
											<a key={i} href={getImageUrl(doc)} target="_blank" rel="noopener noreferrer" className="block">
												<img src={getImageUrl(doc)} alt={`BI ${i+1}`} className="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-80" />
											</a>
										))}
									</div>
								</div>
							)}

							{/* Docs Empresa */}
							{docsModal.docs.organizationDocs && docsModal.docs.organizationDocs.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Documentos da Empresa ({docsModal.docs.organizationDocs.length})</h3>
									<div className="grid grid-cols-2 gap-3">
										{docsModal.docs.organizationDocs.map((doc, i) => (
											<a key={i} href={getImageUrl(doc)} target="_blank" rel="noopener noreferrer" className="block">
												<img src={getImageUrl(doc)} alt={`Doc ${i+1}`} className="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-80" />
											</a>
										))}
									</div>
								</div>
							)}

							{/* Selfies */}
							{docsModal.docs.selfies && docsModal.docs.selfies.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><User className="w-5 h-5" /> Selfies ({docsModal.docs.selfies.length})</h3>
									<div className="grid grid-cols-3 gap-3">
										{docsModal.docs.selfies.map((selfie, i) => (
											<img key={i} src={getImageUrl(selfie)} alt={`Selfie ${i+1}`} className="w-full h-36 object-cover rounded-lg border border-gray-200" />
										))}
									</div>
								</div>
							)}

							{!docsModal.docs.idCard?.length && !docsModal.docs.organizationDocs?.length && !docsModal.docs.selfies?.length && (
								<p className="text-gray-500 text-center py-8">Nenhum documento encontrado</p>
							)}
						</div>

						{/* Footer */}
						{docsModal.seller?.id && (
							<div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
								<button
									onClick={() => { setDocsModal({ open: false, seller: null, docs: null }); handleVerifySeller(docsModal.seller.id, `${docsModal.seller.name} ${docsModal.seller.surname}`, false); }}
									className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
								>
									<CheckCircle className="w-5 h-5" /> Aprovar Vendedor
								</button>
								<button
									onClick={() => { setDocsModal({ open: false, seller: null, docs: null }); setConfirmModal({ open: true, sellerId: docsModal.seller.id, sellerName: `${docsModal.seller.name} ${docsModal.seller.surname}`, action: 'reject' }); }}
									className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
								>
									<XCircle className="w-5 h-5" /> Rejeitar
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* ==================== MODAL DE DETALHES DO VENDEDOR ==================== */}
			{detailsModal.open && detailsModal.seller && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailsModal({ open: false, seller: null })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Detalhes do Vendedor</h2>
							<button onClick={() => setDetailsModal({ open: false, seller: null })} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
						</div>

						<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Coluna Esquerda */}
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-gray-50 rounded-xl p-5">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Nome</p>
											<p className="font-medium">{detailsModal.seller.name} {detailsModal.seller.surname}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Email</p>
											<p className="font-medium text-sm">{detailsModal.seller.email}</p>
										</div>
										{detailsModal.seller.phone && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Telefone</p>
												<p className="font-medium">{detailsModal.seller.phone}</p>
											</div>
										)}
										{detailsModal.seller.provincia && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Província</p>
												<p className="font-medium">{getProvinciaLabel(detailsModal.seller.provincia)}</p>
											</div>
										)}
										{detailsModal.seller.municipio && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Município</p>
												<p className="font-medium">{detailsModal.seller.municipio}</p>
											</div>
										)}
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Role</p>
											<p className="font-medium">{detailsModal.seller.role}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`font-medium ${detailsModal.seller.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.seller.isVerified ? 'Sim ✓' : 'Não'}
											</p>
										</div>
										{detailsModal.seller.verifiedAt && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Verificado em</p>
												<p className="font-medium">{formatDate(detailsModal.seller.verifiedAt)}</p>
											</div>
										)}
									</div>
								</div>

								{/* Veículos */}
								{detailsModal.seller.vehicles && detailsModal.seller.vehicles.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Car className="w-5 h-5" /> Veículos ({detailsModal.seller.vehicles.length})</h3>
										<div className="grid grid-cols-2 gap-3">
											{detailsModal.seller.vehicles.map(v => (
												<div key={v.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
													<img src={getImageUrl(v.image)} alt={v.name} className="w-14 h-10 rounded object-cover" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{v.name}</p>
														<p className="text-xs text-gray-500">{v.type} · {formatDate(v.createdAt)}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Peças */}
								{detailsModal.seller.pecas && detailsModal.seller.pecas.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Wrench className="w-5 h-5" /> Peças ({detailsModal.seller.pecas.length})</h3>
										<div className="grid grid-cols-2 gap-3">
											{detailsModal.seller.pecas.map(p => (
												<div key={p.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
													<img src={getImageUrl(p.image)} alt={p.name} className="w-14 h-10 rounded object-cover" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{p.name}</p>
														<p className="text-xs text-gray-500">{formatCurrency(p.price)}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Coluna Direita */}
							<div className="space-y-6">
								{/* Reviews */}
								{detailsModal.seller.reviewsReceived && detailsModal.seller.reviewsReceived.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<StarFilled className="w-5 h-5 text-yellow-500" /> Avaliações ({detailsModal.seller.totalReviews})
										</h3>
										<div className="flex items-center gap-2 mb-3">
											<StarFilled className="w-6 h-6 text-yellow-500 fill-yellow-500" />
											<span className="text-2xl font-bold">{detailsModal.seller.averageRating}</span>
										</div>
										<div className="space-y-2">
											{detailsModal.seller.reviewsReceived.slice(0, 5).map((r, i) => (
												<div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
													<div className="flex items-center gap-2 mb-1">
														<div className="flex gap-0.5">
															{[1,2,3,4,5].map(s => <StarFilled key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
														</div>
														<span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
													</div>
													{r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
													<p className="text-xs text-gray-500 mt-1">Por: {r.reviewer?.name} {r.reviewer?.surname}</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Denúncias */}
								{detailsModal.seller.reportsReceived && detailsModal.seller.reportsReceived.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> Denúncias</h3>
										<div className="space-y-2">
											{detailsModal.seller.reportsReceived.slice(0, 5).map(r => (
												<div key={r.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
													<p><strong>{r.reason}</strong></p>
													<p className="text-gray-700">{r.description}</p>
													<p className="text-xs text-gray-500 mt-1">{r.status} · {formatDate(r.createdAt)}</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Docs preview */}
								{detailsModal.seller.sellerDocs && (detailsModal.seller.sellerDocs.idCard?.length > 0 || detailsModal.seller.sellerDocs.selfies?.length > 0) && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5" /> Documentos</h3>
										{detailsModal.seller.sellerDocs.idCard?.length > 0 && (
											<p className="text-sm text-gray-600 mb-1">BI/Passaporte: {detailsModal.seller.sellerDocs.idCard.length}</p>
										)}
										{detailsModal.seller.sellerDocs.organizationDocs?.length > 0 && (
											<p className="text-sm text-gray-600 mb-1">Empresa: {detailsModal.seller.sellerDocs.organizationDocs.length}</p>
										)}
										{detailsModal.seller.sellerDocs.selfies?.length > 0 && (
											<div className="grid grid-cols-2 gap-2 mt-2">
												{detailsModal.seller.sellerDocs.selfies.slice(0, 4).map((s, i) => (
													<img key={i} src={getImageUrl(s)} alt={`Selfie ${i+1}`} className="w-full h-20 object-cover rounded-lg" />
												))}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE CONFIRMAÇÃO ==================== */}
			{confirmModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setConfirmModal({ open: false, sellerId: null, sellerName: '', action: 'verify' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								{confirmModal.action === 'verify' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
								{confirmModal.action === 'verify' ? 'Verificar Vendedor' : confirmModal.action === 'reject' ? 'Rejeitar Vendedor' : 'Remover Verificação'}
							</h2>
							<button onClick={() => setConfirmModal({ open: false, sellerId: null, sellerName: '', action: 'verify' })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
						</div>
						<div className="p-6">
							<p className="text-gray-700">
								{confirmModal.action === 'verify'
									? `Tem certeza que deseja verificar e aprovar ${confirmModal.sellerName}?`
									: confirmModal.action === 'reject'
									? `Tem certeza que deseja rejeitar ${confirmModal.sellerName}?`
									: `Tem certeza que deseja remover a verificação de ${confirmModal.sellerName}?`}
							</p>
							<p className="text-sm text-gray-500 mt-2">Um email será enviado ao vendedor informando a alteração.</p>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button onClick={() => setConfirmModal({ open: false, sellerId: null, sellerName: '', action: 'verify' })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
							<button
								onClick={submitVerify}
								className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-white ${
									confirmModal.action === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
								}`}
							>
								{confirmModal.action === 'verify' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminSellers;
