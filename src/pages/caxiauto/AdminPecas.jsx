import React, { useState, useEffect } from 'react';
import api, { getImageUrl, notyf } from '../../services/api';
import {
	Wrench,
	Search,
	Trash2,
	Eye,
	EyeOff,
	Star,
	Loader2,
	AlertCircle,
	Check,
	X,
	Calendar,
	Clock,
	User,
	MapPin,
	Mail,
	Phone,
	FileText,
	Shield,
	ShieldCheck,
	Star as StarFilled
} from 'lucide-react';

const AdminPecas = () => {
	const [loading, setLoading] = useState(true);
	const [pecas, setPecas] = useState([]);
	const [pendingPecas, setPendingPecas] = useState([]);
	const [pendingCount, setPendingCount] = useState(0);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [activeTab, setActiveTab] = useState('all');
	const [filters, setFilters] = useState({ search: '', categoria: '', provincia: '' });
	const [categorias, setCategorias] = useState([]);

	// Modals
	const [detailsModal, setDetailsModal] = useState({ open: false, peca: null });
	const [rejectModal, setRejectModal] = useState({ open: false, pecaId: null, pecaName: '', reason: '' });
	const [featuredModal, setFeaturedModal] = useState({ open: false, pecaId: null, pecaName: '', days: '7' });

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
			} else {
				notyf.error(response.msg || 'Erro ao carregar peças');
			}
		} catch (error) {
			console.error('Erro ao carregar peças:', error);
			notyf.error('Erro ao carregar peças');
		} finally {
			setLoading(false);
		}
	};

	const loadPendingPecas = async () => {
		try {
			const response = await api.adminListPendingPecas({ page: 1, limit: 50 });
			if (response.success) {
				setPendingPecas(response.data);
				setPendingCount(response.pagination.total);
			}
		} catch (error) {
			console.error('Erro ao carregar peças pendentes:', error);
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
		if (activeTab === 'all') {
			loadPecas();
		} else {
			loadPendingPecas();
		}
	}, [pagination.currentPage, activeTab]);

	useEffect(() => {
		loadPendingPecas();
		loadCategorias();
	}, []);

	const handleFilterChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination({ ...pagination, currentPage: 1 });
		loadPecas();
	};

	const handleViewDetails = async (id) => {
		try {
			const response = await api.adminGetPecaDetails(id);
			if (response.success) {
				setDetailsModal({ open: true, peca: response.data });
			} else {
				notyf.error('Erro ao carregar detalhes');
			}
		} catch (error) {
			console.error('Erro ao carregar detalhes:', error);
			notyf.error('Erro ao carregar detalhes');
		}
	};

	const handleApprove = async (id) => {
		try {
			const response = await api.adminApprovePeca(id);
			if (response.success) {
				notyf.success('Peça aprovada com sucesso!');
				setDetailsModal({ open: false, peca: null });
				loadPecas();
				loadPendingPecas();
			} else {
				notyf.error(response.message || 'Erro ao aprovar peça');
			}
		} catch (error) {
			console.error('Erro ao aprovar:', error);
			notyf.error('Erro ao aprovar peça');
		}
	};

	const handleReject = (id, name) => {
		setRejectModal({ open: true, pecaId: id, pecaName: name, reason: '' });
	};

	const submitReject = async () => {
		if (!rejectModal.reason.trim()) {
			notyf.error('O motivo da negação é obrigatório');
			return;
		}
		try {
			const response = await api.adminRejectPeca(rejectModal.pecaId, rejectModal.reason);
			if (response.success) {
				notyf.success('Peça negada. Email enviado ao proprietário.');
				setRejectModal({ open: false, pecaId: null, pecaName: '', reason: '' });
				setDetailsModal({ open: false, peca: null });
				loadPecas();
				loadPendingPecas();
			} else {
				notyf.error(response.message || 'Erro ao negar peça');
			}
		} catch (error) {
			console.error('Erro ao negar:', error);
			notyf.error('Erro ao negar peça');
		}
	};

	const handleSetFeatured = (id, name) => {
		setFeaturedModal({ open: true, pecaId: id, pecaName: name, days: '7' });
	};

	const submitSetFeatured = async () => {
		const days = parseInt(featuredModal.days);
		if (!days || days < 1) {
			notyf.error('Número de dias inválido');
			return;
		}

		const featuredUntil = new Date();
		featuredUntil.setDate(featuredUntil.getDate() + days);
		featuredUntil.setHours(23, 59, 59, 999); // Final do dia

		// Validar data antes de enviar
		if (isNaN(featuredUntil.getTime())) {
			notyf.error('Data de expiração inválida');
			return;
		}

		try {
			const response = await api.adminSetPecaFeatured(featuredModal.pecaId, featuredUntil.toISOString());
			if (response.success) {
				notyf.success(`Peça destacada por ${days} dias!`);
				setFeaturedModal({ open: false, pecaId: null, pecaName: '', days: '7' });
				loadPecas();
				loadPendingPecas();
			} else {
				notyf.error(response.message || 'Erro ao definir destaque');
			}
		} catch (error) {
			console.error('Erro ao definir destaque:', error);
			notyf.error('Erro ao definir destaque');
		}
	};

	const handleRemoveFeatured = async (id) => {
		try {
			const response = await api.adminRemovePecaFeatured(id);
			if (response.success) {
				notyf.success('Destaque removido com sucesso!');
				loadPecas();
				loadPendingPecas();
			} else {
				notyf.error(response.message || 'Erro ao remover destaque');
			}
		} catch (error) {
			console.error('Erro ao remover destaque:', error);
			notyf.error('Erro ao remover destaque');
		}
	};

	const handleToggleStatus = async (id, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
		try {
			const response = await api.togglePecaStatus(id, newStatus);
			if (response.success) {
				notyf.success(`Status alterado para ${newStatus}`);
				loadPecas();
			} else {
				notyf.error(response.msg || 'Erro ao atualizar status');
			}
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			notyf.error('Erro ao atualizar status');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta peça?')) return;
		try {
			const response = await api.adminDeletePeca(id);
			if (response.success) {
				notyf.success('Peça eliminada com sucesso');
				loadPecas();
				loadPendingPecas();
			} else {
				notyf.error(response.msg || 'Erro ao eliminar peça');
			}
		} catch (error) {
			notyf.error('Erro ao eliminar peça');
		}
	};

	const formatCurrency = (value) => {
		if (!value) return '—';
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	const formatDate = (date) => {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const formatFeaturedExpiry = (featuredUntil) => {
		if (!featuredUntil) return 'Sem expiração';
		const date = new Date(featuredUntil);
		const now = new Date();
		const isExpired = date < now;
		const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
		return (
			<span className={isExpired ? 'text-red-600' : 'text-green-600'}>
				{isExpired ? `Expirado (${formatDate(featuredUntil)})` : `${daysLeft} dias restantes`}
			</span>
		);
	};

	const getConditionLabel = (cond) => {
		const map = { NEW: 'Novo', USED: 'Usado', REFURBISHED: 'Recondicionado' };
		return map[cond] || cond;
	};

	const getStatusLabel = (status) => {
		const map = { ACTIVE: 'Ativo', PENDING: 'Pendente', SOLD: 'Vendido', HIDDEN: 'Oculto' };
		return map[status] || status;
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

	const data = activeTab === 'pending' ? pendingPecas : pecas;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Peças</h1>
					<p className="text-gray-600 mt-1">Gerencie todas as peças da plataforma</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 border-b border-gray-200">
				<button
					onClick={() => setActiveTab('all')}
					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
						activeTab === 'all'
							? 'bg-white border border-gray-200 border-b-white text-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Todos
				</button>
				<button
					onClick={() => setActiveTab('pending')}
					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center gap-2 ${
						activeTab === 'pending'
							? 'bg-white border border-gray-200 border-b-white text-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Pendentes de Aprovação
					{pendingCount > 0 && (
						<span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
							{pendingCount}
						</span>
					)}
				</button>
			</div>

			{/* Filtros */}
			{activeTab === 'all' && (
				<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Pesquisa</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									name="search"
									value={filters.search}
									onChange={handleFilterChange}
									placeholder="Buscar peças..."
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
							<select
								name="categoria"
								value={filters.categoria}
								onChange={handleFilterChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
							>
								<option value="">Todas</option>
								{categorias.map((cat) => (
									<option key={cat.id} value={cat.id}>{cat.name}</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
							<input
								type="text"
								name="provincia"
								value={filters.provincia}
								onChange={handleFilterChange}
								placeholder="Província"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
							/>
						</div>
						<div className="flex items-end">
							<button
								type="submit"
								className="w-full bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] transition-colors flex items-center justify-center gap-2"
							>
								<Search className="w-5 h-5" />
								Filtrar
							</button>
						</div>
					</div>
				</form>
			)}

			{/* Tabela */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : data.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Wrench className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500 text-lg">
							{activeTab === 'pending' ? 'Nenhuma peça pendente' : 'Nenhuma peça encontrada'}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peça</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condição</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprovado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destaque</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.map((peca) => (
									<tr
										key={peca.id}
										className={`hover:bg-gray-50 ${
											(!peca.isVerified || !peca.isAproved) ? 'bg-yellow-50' : ''
										}`}
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<img
													src={getImageUrl(peca.image, '/images/i10.jpg')}
													alt={peca.name}
													className="w-16 h-12 rounded-lg object-cover"
												/>
												<div>
													<p className="font-medium text-gray-900">{peca.name}</p>
													<p className="text-sm text-gray-500">
														{peca.Seller?.name} {peca.Seller?.surname} · {getProvinciaLabel(peca.provincia)}
													</p>
												</div>
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-gray-900">{peca.Categoria?.name}</td>
										<td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(peca.price)}</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												peca.condition === 'NEW'
													? 'bg-green-100 text-green-800'
													: peca.condition === 'USED'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-blue-100 text-blue-800'
											}`}>
												{getConditionLabel(peca.condition)}
											</span>
										</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												peca.status === 'ACTIVE'
													? 'bg-green-100 text-green-800'
													: peca.status === 'SOLD'
													? 'bg-gray-100 text-gray-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}>
												{getStatusLabel(peca.status)}
											</span>
										</td>
										<td className="px-4 py-3">
											{peca.isVerified ? (
												<span className="flex items-center gap-1 text-green-600 text-sm">
													<ShieldCheck className="w-4 h-4" /> Sim
												</span>
											) : (
												<span className="flex items-center gap-1 text-yellow-600 text-sm">
													<Shield className="w-4 h-4" /> Não
												</span>
											)}
										</td>
										<td className="px-4 py-3">
											{peca.isAproved ? (
												<span className="flex items-center gap-1 text-green-600 text-sm">
													<Check className="w-4 h-4" /> Sim
												</span>
											) : (
												<span className="flex items-center gap-1 text-red-600 text-sm">
													<X className="w-4 h-4" /> Não
												</span>
											)}
										</td>
										<td className="px-4 py-3">
											{peca.isFeatured ? (
												<div className="flex items-center gap-1">
													<StarFilled className="w-4 h-4 text-yellow-500 fill-yellow-500" />
													<span className="text-xs text-gray-600">
														{formatFeaturedExpiry(peca.featuredUntil)}
													</span>
												</div>
											) : (
												<span className="text-gray-400 text-sm">—</span>
											)}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<button
													onClick={() => handleViewDetails(peca.id)}
													className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
													title="Ver detalhes"
												>
													<Eye className="w-4 h-4" />
												</button>
												{(!peca.isVerified || !peca.isAproved) && (
													<>
														<button
															onClick={() => handleApprove(peca.id)}
															className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
															title="Aprovar"
														>
															<Check className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleReject(peca.id, peca.name)}
															className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
															title="Negar"
														>
															<X className="w-4 h-4" />
														</button>
													</>
												)}
												{peca.isFeatured ? (
													<button
														onClick={() => handleRemoveFeatured(peca.id)}
														className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
														title="Remover destaque"
													>
														<Star className="w-4 h-4" />
													</button>
												) : (
													<button
														onClick={() => handleSetFeatured(peca.id, peca.name)}
														className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
														title="Definir destaque"
													>
														<Star className="w-4 h-4" />
													</button>
												)}
												<button
													onClick={() => handleToggleStatus(peca.id, peca.status)}
													className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
													title={peca.status === 'ACTIVE' ? 'Ocultar' : 'Ativar'}
												>
													{peca.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
												</button>
												<button
													onClick={() => handleDelete(peca.id)}
													className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
													title="Eliminar"
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

			{/* Paginação */}
			{activeTab === 'all' && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
						disabled={pagination.currentPage === 1}
						className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
					>
						Anterior
					</button>
					<span className="text-sm text-gray-600">
						Página {pagination.currentPage} de {pagination.totalPages}
					</span>
					<button
						onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
						disabled={pagination.currentPage === pagination.totalPages}
						className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
					>
						Próxima
					</button>
				</div>
			)}

			{/* ==================== MODAL DE DETALHES ==================== */}
			{detailsModal.open && detailsModal.peca && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailsModal({ open: false, peca: null })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Detalhes da Peça</h2>
							<button onClick={() => setDetailsModal({ open: false, peca: null })} className="text-gray-400 hover:text-gray-600">
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Coluna Esquerda: Dados da Peça */}
							<div className="lg:col-span-2 space-y-6">
								<div className="rounded-xl overflow-hidden">
									<img
										src={getImageUrl(detailsModal.peca.image, '/images/i10.jpg')}
										alt={detailsModal.peca.name}
										className="w-full h-64 object-cover"
									/>
								</div>

								{/* Info básica */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">Informações da Peça</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Nome</p>
											<p className="font-medium">{detailsModal.peca.name}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Categoria</p>
											<p className="font-medium">{detailsModal.peca.Categoria?.name}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Preço</p>
											<p className="font-medium text-lg text-green-600">{formatCurrency(detailsModal.peca.price)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Condição</p>
											<p className="font-medium">{getConditionLabel(detailsModal.peca.condition)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Província</p>
											<p className="font-medium">{getProvinciaLabel(detailsModal.peca.provincia)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Status</p>
											<p className="font-medium">{getStatusLabel(detailsModal.peca.status)}</p>
										</div>
									</div>
								</div>

								{/* Compatibilidade */}
								{detailsModal.peca.compatibility && detailsModal.peca.compatibility.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Compatibilidade</h3>
										<div className="flex flex-wrap gap-2">
											{detailsModal.peca.compatibility.map((item, i) => (
												<span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
													{item}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Galeria */}
								{detailsModal.peca.gallery && detailsModal.peca.gallery.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Galeria ({detailsModal.peca.gallery.length} fotos)</h3>
										<div className="grid grid-cols-3 gap-3">
											{detailsModal.peca.gallery.map((img, i) => (
												<img key={i} src={getImageUrl(img)} alt={`Foto ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
											))}
										</div>
									</div>
								)}

								{/* Metadata */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Criado em</p>
											<p className="font-medium">{formatDate(detailsModal.peca.createdAt)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Atualizado em</p>
											<p className="font-medium">{formatDate(detailsModal.peca.updatedAt)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`font-medium ${detailsModal.peca.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.peca.isVerified ? 'Sim' : 'Não'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Aprovado</p>
											<p className={`font-medium ${detailsModal.peca.isAproved ? 'text-green-600' : 'text-red-600'}`}>
												{detailsModal.peca.isAproved ? 'Sim' : 'Não'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Destaque</p>
											<p className={`font-medium ${detailsModal.peca.isFeatured ? 'text-yellow-600' : 'text-gray-400'}`}>
												{detailsModal.peca.isFeatured ? 'Ativo' : 'Inativo'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Expiração do Destaque</p>
											<p className="font-medium">{formatDate(detailsModal.peca.featuredUntil)}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Coluna Direita: Dados do Proprietário */}
							<div className="space-y-6">
								<div className="bg-gray-50 rounded-xl p-5">
									<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
										<User className="w-5 h-5" /> Proprietário
									</h3>
									<div className="space-y-3">
										<div>
											<p className="text-xs text-gray-500">Nome</p>
											<p className="font-medium">{detailsModal.peca.Seller?.name} {detailsModal.peca.Seller?.surname}</p>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4 text-gray-400" />
											<a href={`mailto:${detailsModal.peca.Seller?.email}`} className="text-blue-600 hover:underline text-sm">
												{detailsModal.peca.Seller?.email}
											</a>
										</div>
										{detailsModal.peca.Seller?.phone && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-gray-400" />
												<a href={`tel:${detailsModal.peca.Seller?.phone}`} className="text-blue-600 hover:underline text-sm">
													{detailsModal.peca.Seller?.phone}
												</a>
											</div>
										)}
										{detailsModal.peca.Seller?.provincia && (
											<div className="flex items-center gap-2">
												<MapPin className="w-4 h-4 text-gray-400" />
												<p className="text-sm">{getProvinciaLabel(detailsModal.peca.Seller.provincia)}</p>
											</div>
										)}
										{detailsModal.peca.Seller?.municipio && (
											<div>
												<p className="text-xs text-gray-500">Município</p>
												<p className="text-sm">{detailsModal.peca.Seller.municipio}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-500">Role</p>
											<p className="text-sm font-medium">{detailsModal.peca.Seller?.role}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">Status</p>
											<p className="text-sm font-medium">{detailsModal.peca.Seller?.status}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`text-sm font-medium ${detailsModal.peca.Seller?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.peca.Seller?.isVerified ? 'Sim ✓' : 'Não'}
											</p>
										</div>
										{detailsModal.peca.Seller?.verifiedAt && (
											<div>
												<p className="text-xs text-gray-500">Verificado em</p>
												<p className="text-sm">{formatDate(detailsModal.peca.Seller.verifiedAt)}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-500">Cadastrado em</p>
											<p className="text-sm">{formatDate(detailsModal.peca.Seller?.createdAt)}</p>
										</div>
									</div>
								</div>

								{/* Rating */}
								{detailsModal.peca.Seller?.averageRating !== undefined && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Avaliações do Proprietário</h3>
										<div className="flex items-center gap-2 mb-2">
											<StarFilled className="w-5 h-5 text-yellow-500 fill-yellow-500" />
											<span className="text-2xl font-bold">{detailsModal.peca.Seller.averageRating}</span>
											<span className="text-gray-500 text-sm">({detailsModal.peca.Seller.totalReviews} avaliações)</span>
										</div>
										{detailsModal.peca.Seller.reviewsReceived && detailsModal.peca.Seller.reviewsReceived.length > 0 && (
											<div className="space-y-2 mt-3">
												{detailsModal.peca.Seller.reviewsReceived.slice(0, 5).map((review, i) => (
													<div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
														<div className="flex items-center gap-2 mb-1">
															<div className="flex gap-0.5">
																{[1, 2, 3, 4, 5].map(star => (
																	<StarFilled key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
																))}
															</div>
															<span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
														</div>
														{review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
														<p className="text-xs text-gray-500 mt-1">Por: {review.reviewer?.name} {review.reviewer?.surname}</p>
													</div>
												))}
											</div>
										)}
									</div>
								)}

								{/* Outras peças do seller */}
								{detailsModal.peca.Seller?.pecas && detailsModal.peca.Seller.pecas.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Outras Peças ({detailsModal.peca.Seller.pecas.length})</h3>
										<div className="space-y-2">
											{detailsModal.peca.Seller.pecas.map(p => (
												<div key={p.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
													<img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-8 rounded object-cover" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{p.name}</p>
														<p className="text-xs text-gray-500">{formatCurrency(p.price)}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Documentos do Seller */}
								{detailsModal.peca.Seller?.sellerDocs && (detailsModal.peca.Seller.sellerDocs.idCard?.length > 0 || detailsModal.peca.Seller.sellerDocs.selfies?.length > 0) && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<ShieldCheck className="w-5 h-5" /> Documentos do Vendedor
										</h3>
										{detailsModal.peca.Seller.sellerDocs.idCard?.length > 0 && (
											<div className="mb-3">
												<p className="text-xs text-gray-500 mb-2">Documento de Identidade</p>
												{detailsModal.peca.Seller.sellerDocs.idCard.map((doc, i) => (
													<a key={i} href={getImageUrl(doc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1">
														<FileText className="w-3 h-3" /> BI/Passaporte {i + 1}
													</a>
												))}
											</div>
										)}
										{detailsModal.peca.Seller.sellerDocs.selfies?.length > 0 && (
											<div>
												<p className="text-xs text-gray-500 mb-2">Selfies</p>
												<div className="grid grid-cols-2 gap-2">
													{detailsModal.peca.Seller.sellerDocs.selfies.map((selfie, i) => (
														<img key={i} src={getImageUrl(selfie)} alt={`Selfie ${i + 1}`} className="w-full h-20 object-cover rounded-lg" />
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Footer - Ações */}
						<div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4 rounded-b-2xl">
							<div className="flex gap-2">
								{(!detailsModal.peca.isVerified || !detailsModal.peca.isAproved) && (
									<>
										<button
											onClick={() => handleApprove(detailsModal.peca.id)}
											className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
										>
											<Check className="w-5 h-5" /> Aprovar
										</button>
										<button
											onClick={() => handleReject(detailsModal.peca.id, detailsModal.peca.name)}
											className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
										>
											<X className="w-5 h-5" /> Negar
										</button>
									</>
								)}
							</div>
							<div className="flex gap-2">
								{detailsModal.peca.isFeatured ? (
									<button
										onClick={() => handleRemoveFeatured(detailsModal.peca.id)}
										className="bg-yellow-500 text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 font-medium"
									>
										<Star className="w-5 h-5" /> Remover Destaque
									</button>
								) : (
									<button
										onClick={() => handleSetFeatured(detailsModal.peca.id, detailsModal.peca.name)}
										className="bg-[#154c9a] text-white px-4 py-2.5 rounded-lg hover:bg-[#123f80] transition-colors flex items-center gap-2 font-medium"
									>
										<StarFilled className="w-5 h-5" /> Definir Destaque
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE NEGAÇÃO ==================== */}
			{rejectModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRejectModal({ open: false, pecaId: null, pecaName: '', reason: '' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-red-600" /> Negar Peça
							</h2>
							<button onClick={() => setRejectModal({ open: false, pecaId: null, pecaName: '', reason: '' })} className="text-gray-400 hover:text-gray-600">
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">
								Está a negar a peça <strong>{rejectModal.pecaName}</strong>.
							</p>
							<p className="text-sm text-gray-500 mb-2">
								Um email será enviado ao proprietário com o motivo da negação.
							</p>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Motivo da Negação *
							</label>
							<textarea
								value={rejectModal.reason}
								onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
								placeholder="Descreva o motivo da negação..."
								rows={5}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
							/>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button
								onClick={() => setRejectModal({ open: false, pecaId: null, pecaName: '', reason: '' })}
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={submitReject}
								className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
							>
								<X className="w-4 h-4" /> Confirmar Negação
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE DESTAQUE ==================== */}
			{featuredModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFeaturedModal({ open: false, pecaId: null, pecaName: '', days: '7' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<Calendar className="w-5 h-5 text-[#154c9a]" /> Definir Destaque
							</h2>
							<button onClick={() => setFeaturedModal({ open: false, pecaId: null, pecaName: '', days: '7' })} className="text-gray-400 hover:text-gray-600">
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">
								Definir destaque para <strong>{featuredModal.pecaName}</strong>.
							</p>
							<label className="block text-sm font-medium text-gray-700 mb-2">Duração do Destaque</label>
							<div className="grid grid-cols-3 gap-3 mb-4">
								{[
									{ days: '7', label: '7 dias', desc: '1 semana' },
									{ days: '14', label: '14 dias', desc: '2 semanas' },
									{ days: '30', label: '30 dias', desc: '1 mês' },
								].map(option => (
									<button
										key={option.days}
										onClick={() => setFeaturedModal({ ...featuredModal, days: option.days })}
										className={`p-3 rounded-lg border-2 transition-colors text-center ${
											featuredModal.days === option.days
												? 'border-[#154c9a] bg-blue-50'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<p className="font-medium text-sm">{option.label}</p>
										<p className="text-xs text-gray-500">{option.desc}</p>
									</button>
								))}
							</div>
							<div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
								<Clock className="w-4 h-4 text-gray-400" />
								<p className="text-sm text-gray-600">
									Expira em: <strong>{(() => {
										const d = new Date();
										d.setDate(d.getDate() + parseInt(featuredModal.days));
										return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
									})()}</strong>
								</p>
							</div>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button
								onClick={() => setFeaturedModal({ open: false, pecaId: null, pecaName: '', days: '7' })}
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={submitSetFeatured}
								className="bg-[#154c9a] text-white px-6 py-2 rounded-lg hover:bg-[#123f80] transition-colors font-medium flex items-center gap-2"
							>
								<StarFilled className="w-4 h-4" /> Confirmar Destaque
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPecas;
