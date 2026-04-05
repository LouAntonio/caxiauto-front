import React, { useState, useEffect } from 'react';
import api, { getImageUrl, notyf } from '../../services/api';
import {
	Car,
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
import { AdminTableSkeleton, AdminFormSkeleton, AdminModalSkeleton } from '../../components/skeletons';
import useLoadingState from '../../hooks/useLoadingState';
import useDebounce from '../../hooks/useDebounce';

const AdminVehicles = () => {
	const [loading, setLoading] = useState(true);
	const [vehicles, setVehicles] = useState([]);
	const [pendingVehicles, setPendingVehicles] = useState([]);
	const [pendingCount, setPendingCount] = useState(0);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending'
	const [filters, setFilters] = useState({
		search: '',
		type: '',
		status: '',
		manufacturer: '',
	});
	const [searchInput, setSearchInput] = useState('');
	const debouncedSearch = useDebounce(searchInput, 300);

	// Loading state hook
	const { loading: actionLoading, withLoading, isActionLoading } = useLoadingState({ preventConcurrent: true });

	// Modals
	const [detailsModal, setDetailsModal] = useState({ open: false, vehicle: null });
	const [rejectModal, setRejectModal] = useState({ open: false, vehicleId: null, vehicleName: '', reason: '' });
	const [featuredModal, setFeaturedModal] = useState({ open: false, vehicleId: null, vehicleName: '', days: '7' });

	const loadVehicles = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			params.append('page', pagination.currentPage);
			params.append('limit', 10);
			if (filters.search) params.append('search', filters.search);
			if (filters.type) params.append('type', filters.type);
			if (filters.status) params.append('status', filters.status);
			if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);

			const response = await api.listVehicles(Object.fromEntries(params));
			if (response.success) {
				setVehicles(response.data);
				setPagination({
					currentPage: response.pagination.page,
					totalPages: response.pagination.totalPages,
					total: response.pagination.total,
				});
			} else if (response.auth) {
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
				window.location.href = '/caxiauto/login';
			} else {
				notyf.error(response.message || 'Erro ao carregar veículos');
			}
		} catch (error) {
			console.error('Erro ao carregar veículos:', error);
			notyf.error('Erro ao carregar veículos');
		} finally {
			setLoading(false);
		}
	};

	const loadPendingVehicles = async () => {
		try {
			const response = await api.adminListPendingVehicles({ page: 1, limit: 50 });
			if (response.success) {
				setPendingVehicles(response.data);
				setPendingCount(response.pagination.total);
			}
		} catch (error) {
			console.error('Erro ao carregar veículos pendentes:', error);
		}
	};

	// Carregar dados iniciais
	useEffect(() => {
		loadPendingVehicles();
	}, []);

	// Carregar dados quando tab, paginação ou filtros mudam
	useEffect(() => {
		if (activeTab === 'all') {
			loadVehicles();
		} else {
			loadPendingVehicles();
		}
	}, [pagination.currentPage, activeTab]);

	const handleFilterChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters({ ...filters, search: debouncedSearch });
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	// Auto-search quando o valor debounce muda
	useEffect(() => {
		setFilters(prev => ({ ...prev, search: debouncedSearch }));
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	}, [debouncedSearch]);

	const handleViewDetails = async (id) => {
		await withLoading(async () => {
			const response = await api.adminGetVehicleDetails(id);
			if (response.success) {
				setDetailsModal({ open: true, vehicle: response.data });
			} else {
				notyf.error('Erro ao carregar detalhes');
			}
		});
	};

	const handleApprove = async (id) => {
		await withLoading(async () => {
			const response = await api.adminApproveVehicle(id);
			if (response.success) {
				notyf.success('Veículo aprovado com sucesso!');
				setDetailsModal({ open: false, vehicle: null });
				loadVehicles();
				loadPendingVehicles();
			} else {
				notyf.error(response.message || 'Erro ao aprovar veículo');
			}
		});
	};

	const handleReject = (id, name) => {
		setRejectModal({ open: true, vehicleId: id, vehicleName: name, reason: '' });
	};

	const submitReject = async () => {
		if (!rejectModal.reason.trim()) {
			notyf.error('O motivo da negação é obrigatório');
			return;
		}
		await withLoading(async () => {
			const response = await api.adminRejectVehicle(rejectModal.vehicleId, rejectModal.reason);
			if (response.success) {
				notyf.success('Veículo negado. Email enviado ao proprietário.');
				setRejectModal({ open: false, vehicleId: null, vehicleName: '', reason: '' });
				setDetailsModal({ open: false, vehicle: null });
				loadVehicles();
				loadPendingVehicles();
			} else {
				notyf.error(response.message || 'Erro ao negar veículo');
			}
		});
	};

	const handleSetFeatured = (id, name) => {
		setFeaturedModal({ open: true, vehicleId: id, vehicleName: name, days: '7' });
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

		await withLoading(async () => {
			try {
				const response = await api.adminSetVehicleFeatured(featuredModal.vehicleId, featuredUntil.toISOString());
				if (response.success) {
					notyf.success(`Veículo destacado por ${days} dias!`);
					setFeaturedModal({ open: false, vehicleId: null, vehicleName: '', days: '7' });
					loadVehicles();
					loadPendingVehicles();
				} else {
					notyf.error(response.message || 'Erro ao definir destaque');
				}
			} catch (error) {
				console.error('Erro ao definir destaque:', error);
				notyf.error('Erro ao definir destaque');
			}
		});
	};

	const handleRemoveFeatured = async (id) => {
		await withLoading(async () => {
			const response = await api.adminRemoveVehicleFeatured(id);
			if (response.success) {
				notyf.success('Destaque removido com sucesso!');
				loadVehicles();
				loadPendingVehicles();
			} else {
				notyf.error(response.message || 'Erro ao remover destaque');
			}
		});
	};

	const handleToggleStatus = async (id, currentStatus) => {
		await withLoading(async () => {
			const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
			const response = await api.toggleVehicleStatus(id, newStatus);
			if (response.success) {
				notyf.success(`Status alterado para ${newStatus}`);
				loadVehicles();
			} else {
				notyf.error(response.message || 'Erro ao atualizar status');
			}
		});
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar este veículo?')) return;

		await withLoading(async () => {
			const response = await api.adminDeleteVehicle(id);
			if (response.success) {
				notyf.success('Veículo eliminado com sucesso');
				loadVehicles();
				loadPendingVehicles();
			} else {
				notyf.error(response.message || 'Erro ao eliminar veículo');
			}
		});
	};

	const formatCurrency = (value) => {
		if (!value) return '—';
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA',
		}).format(value);
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

	const getFuelTypeLabel = (fuel) => {
		const map = { GASOLINE: 'Gasolina', DIESEL: 'Diesel', ELECTRIC: 'Elétrico', HYBRID: 'Híbrido' };
		return map[fuel] || fuel;
	};

	const getTransmissionLabel = (trans) => {
		const map = { MANUAL: 'Manual', AUTOMATIC: 'Automática', SEMI_AUTOMATIC: 'Semiautomática' };
		return map[trans] || trans;
	};

	const getTypeLabel = (type) => {
		const map = { SALE: 'Venda', RENT: 'Aluguel', BOTH: 'Venda/Aluguel' };
		return map[type] || type;
	};

	const getStatusLabel = (status) => {
		const map = { ACTIVE: 'Ativo', PENDING: 'Pendente', SOLD: 'Vendido', RENTED: 'Alugado', HIDDEN: 'Oculto' };
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

	const data = activeTab === 'pending' ? pendingVehicles : vehicles;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
					<p className="text-gray-600 mt-1">Gerencie todos os veículos da plataforma</p>
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

			{/* Filtros (só na tab "Todos") */}
			{activeTab === 'all' && (
				<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Pesquisa</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									placeholder="Buscar veículos..."
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
							<select
								name="type"
								value={filters.type}
								onChange={handleFilterChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
							>
								<option value="">Todos</option>
								<option value="SALE">Venda</option>
								<option value="RENT">Aluguel</option>
								<option value="BOTH">Venda/Aluguel</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
							<select
								name="status"
								value={filters.status}
								onChange={handleFilterChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
							>
								<option value="">Todos</option>
								<option value="ACTIVE">Ativo</option>
								<option value="PENDING">Pendente</option>
								<option value="SOLD">Vendido</option>
								<option value="RENTED">Alugado</option>
								<option value="HIDDEN">Oculto</option>
							</select>
						</div>
						<div className="flex items-end">
							<button
								type="submit"
								disabled={actionLoading}
								className="w-full bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
								{actionLoading ? 'Filtrando...' : 'Filtrar'}
							</button>
						</div>
					</div>
				</form>
			)}

			{/* Tabela de Veículos */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<AdminTableSkeleton rows={6} columns={8} />
				) : data.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Car className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500 text-lg">
							{activeTab === 'pending' ? 'Nenhum veículo pendente' : 'Nenhum veículo encontrado'}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprovado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destaque</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.map((vehicle) => (
									<tr
										key={vehicle.id}
										className={`hover:bg-gray-50 ${
											(!vehicle.isVerified || !vehicle.isAproved) ? 'bg-yellow-50' : ''
										}`}
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<img
													src={getImageUrl(vehicle.image, '/images/i10.jpg')}
													alt={vehicle.name}
													className="w-16 h-12 rounded-lg object-cover"
												/>
												<div>
													<p className="font-medium text-gray-900">{vehicle.name}</p>
													<p className="text-sm text-gray-500">
														{vehicle.Manufacturer?.name} · {vehicle.Class?.name} · {vehicle.year}
													</p>
												</div>
											</div>
										</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												vehicle.type === 'SALE'
													? 'bg-green-100 text-green-800'
													: vehicle.type === 'RENT'
														? 'bg-blue-100 text-blue-800'
														: 'bg-purple-100 text-purple-800'
											}`}>
												{getTypeLabel(vehicle.type)}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-900">
											{vehicle.type === 'SALE'
												? formatCurrency(vehicle.priceSale)
												: vehicle.type === 'RENT'
													? formatCurrency(vehicle.priceRentDay) + '/dia'
													: `${formatCurrency(vehicle.priceSale)} / ${formatCurrency(vehicle.priceRentDay)}/dia`}
										</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												vehicle.status === 'ACTIVE'
													? 'bg-green-100 text-green-800'
													: vehicle.status === 'SOLD' || vehicle.status === 'RENTED'
														? 'bg-gray-100 text-gray-800'
														: vehicle.status === 'HIDDEN'
															? 'bg-red-100 text-red-800'
															: 'bg-yellow-100 text-yellow-800'
											}`}>
												{getStatusLabel(vehicle.status)}
											</span>
										</td>
										<td className="px-4 py-3">
											{vehicle.isVerified ? (
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
											{vehicle.isAproved ? (
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
											{vehicle.isFeatured ? (
												<div className="flex items-center gap-1">
													<StarFilled className="w-4 h-4 text-yellow-500 fill-yellow-500" />
													<span className="text-xs text-gray-600">
														{formatFeaturedExpiry(vehicle.featuredUntil)}
													</span>
												</div>
											) : (
												<span className="text-gray-400 text-sm">—</span>
											)}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<button
													onClick={() => handleViewDetails(vehicle.id)}
													className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													title="Ver detalhes"
													disabled={actionLoading}
												>
													{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
												</button>
												{(!vehicle.isVerified || !vehicle.isAproved) && (
													<>
														<button
															onClick={() => handleApprove(vehicle.id)}
															className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															title="Aprovar"
															disabled={actionLoading}
														>
															<Check className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleReject(vehicle.id, vehicle.name)}
															className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															title="Negar"
															disabled={actionLoading}
														>
															<X className="w-4 h-4" />
														</button>
													</>
												)}
												{vehicle.isFeatured ? (
													<button
														onClick={() => handleRemoveFeatured(vehicle.id)}
														className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
														title="Remover destaque"
														disabled={actionLoading}
													>
														<Star className="w-4 h-4" />
													</button>
												) : (
													<button
														onClick={() => handleSetFeatured(vehicle.id, vehicle.name)}
														className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
														title="Definir destaque"
														disabled={actionLoading}
													>
														<Star className="w-4 h-4" />
													</button>
												)}
												<button
													onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
													className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													title={vehicle.status === 'ACTIVE' ? 'Ocultar' : 'Ativar'}
													disabled={actionLoading}
												>
													{vehicle.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
												</button>
												<button
													onClick={() => handleDelete(vehicle.id)}
													className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													title="Eliminar"
													disabled={actionLoading}
												>
													{isActionLoading(`delete-${vehicle.id}`) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

			{/* Paginação (só na tab "Todos") */}
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
			{detailsModal.open && detailsModal.vehicle && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailsModal({ open: false, vehicle: null })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						{/* Header do Modal */}
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Detalhes do Veículo</h2>
							<button onClick={() => setDetailsModal({ open: false, vehicle: null })} className="text-gray-400 hover:text-gray-600">
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Coluna Esquerda: Dados do Veículo */}
							<div className="lg:col-span-2 space-y-6">
								{/* Imagem */}
								<div className="rounded-xl overflow-hidden">
									<img
										src={getImageUrl(detailsModal.vehicle.image, '/images/i10.jpg')}
										alt={detailsModal.vehicle.name}
										className="w-full h-64 object-cover"
									/>
								</div>

								{/* Info básica */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Veículo</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Nome</p>
											<p className="font-medium">{detailsModal.vehicle.name}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Fabricante</p>
											<p className="font-medium">{detailsModal.vehicle.Manufacturer?.name}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Classe</p>
											<p className="font-medium">{detailsModal.vehicle.Class?.name}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Ano</p>
											<p className="font-medium">{detailsModal.vehicle.year}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Quilometragem</p>
											<p className="font-medium">{detailsModal.vehicle.kilometers?.toLocaleString()} km</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Combustível</p>
											<p className="font-medium">{getFuelTypeLabel(detailsModal.vehicle.fuelType)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Transmissão</p>
											<p className="font-medium">{getTransmissionLabel(detailsModal.vehicle.transmission)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Portas</p>
											<p className="font-medium">{detailsModal.vehicle.doorCount}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Capacidade</p>
											<p className="font-medium">{detailsModal.vehicle.passengerCapacity} lugares</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Província</p>
											<p className="font-medium">{getProvinciaLabel(detailsModal.vehicle.provincia)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Tipo</p>
											<p className="font-medium">{getTypeLabel(detailsModal.vehicle.type)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Status</p>
											<p className="font-medium">{getStatusLabel(detailsModal.vehicle.status)}</p>
										</div>
									</div>
								</div>

								{/* Preços */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">Preços</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Preço de Venda</p>
											<p className="font-medium text-lg text-green-600">{formatCurrency(detailsModal.vehicle.priceSale)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Preço por Dia (Aluguel)</p>
											<p className="font-medium text-lg text-blue-600">{formatCurrency(detailsModal.vehicle.priceRentDay)}</p>
										</div>
									</div>
								</div>

								{/* Descrição */}
								{detailsModal.vehicle.description && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
										<p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{detailsModal.vehicle.description}</p>
									</div>
								)}

								{/* Características */}
								{detailsModal.vehicle.characteristics && detailsModal.vehicle.characteristics.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
										<div className="flex flex-wrap gap-2">
											{detailsModal.vehicle.characteristics.map((char, i) => (
												<span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
													{char}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Documentos */}
								{detailsModal.vehicle.documents && detailsModal.vehicle.documents.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Documentos</h3>
										<div className="space-y-2">
											{detailsModal.vehicle.documents.map((doc, i) => (
												<a key={i} href={getImageUrl(doc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-gray-50 p-3 rounded-lg">
													<FileText className="w-4 h-4" />
													<span>Documento {i + 1}</span>
												</a>
											))}
										</div>
									</div>
								)}

								{/* Galeria */}
								{detailsModal.vehicle.gallery && detailsModal.vehicle.gallery.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Galeria ({detailsModal.vehicle.gallery.length} fotos)</h3>
										<div className="grid grid-cols-3 gap-3">
											{detailsModal.vehicle.gallery.map((img, i) => (
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
											<p className="font-medium">{formatDate(detailsModal.vehicle.createdAt)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Atualizado em</p>
											<p className="font-medium">{formatDate(detailsModal.vehicle.updatedAt)}</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`font-medium ${detailsModal.vehicle.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.vehicle.isVerified ? 'Sim' : 'Não'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Aprovado</p>
											<p className={`font-medium ${detailsModal.vehicle.isAproved ? 'text-green-600' : 'text-red-600'}`}>
												{detailsModal.vehicle.isAproved ? 'Sim' : 'Não'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Destaque</p>
											<p className={`font-medium ${detailsModal.vehicle.isFeatured ? 'text-yellow-600' : 'text-gray-400'}`}>
												{detailsModal.vehicle.isFeatured ? 'Ativo' : 'Inativo'}
											</p>
										</div>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-xs text-gray-500">Expiração do Destaque</p>
											<p className="font-medium">{formatDate(detailsModal.vehicle.featuredUntil)}</p>
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
											<p className="font-medium">{detailsModal.vehicle.Seller?.name} {detailsModal.vehicle.Seller?.surname}</p>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4 text-gray-400" />
											<a href={`mailto:${detailsModal.vehicle.Seller?.email}`} className="text-blue-600 hover:underline text-sm">
												{detailsModal.vehicle.Seller?.email}
											</a>
										</div>
										{detailsModal.vehicle.Seller?.phone && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-gray-400" />
												<a href={`tel:${detailsModal.vehicle.Seller?.phone}`} className="text-blue-600 hover:underline text-sm">
													{detailsModal.vehicle.Seller?.phone}
												</a>
											</div>
										)}
										{detailsModal.vehicle.Seller?.provincia && (
											<div className="flex items-center gap-2">
												<MapPin className="w-4 h-4 text-gray-400" />
												<p className="text-sm">{getProvinciaLabel(detailsModal.vehicle.Seller.provincia)}</p>
											</div>
										)}
										{detailsModal.vehicle.Seller?.municipio && (
											<div>
												<p className="text-xs text-gray-500">Município</p>
												<p className="text-sm">{detailsModal.vehicle.Seller.municipio}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-500">Role</p>
											<p className="text-sm font-medium">{detailsModal.vehicle.Seller?.role}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">Status</p>
											<p className="text-sm font-medium">{detailsModal.vehicle.Seller?.status}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`text-sm font-medium ${detailsModal.vehicle.Seller?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.vehicle.Seller?.isVerified ? 'Sim ✓' : 'Não'}
											</p>
										</div>
										{detailsModal.vehicle.Seller?.verifiedAt && (
											<div>
												<p className="text-xs text-gray-500">Verificado em</p>
												<p className="text-sm">{formatDate(detailsModal.vehicle.Seller.verifiedAt)}</p>
											</div>
										)}
										<div>
											<p className="text-xs text-gray-500">Cadastrado em</p>
											<p className="text-sm">{formatDate(detailsModal.vehicle.Seller?.createdAt)}</p>
										</div>
									</div>
								</div>

								{/* Rating do Seller */}
								{detailsModal.vehicle.Seller?.averageRating !== undefined && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Avaliações do Proprietário</h3>
										<div className="flex items-center gap-2 mb-2">
											<StarFilled className="w-5 h-5 text-yellow-500 fill-yellow-500" />
											<span className="text-2xl font-bold">{detailsModal.vehicle.Seller.averageRating}</span>
											<span className="text-gray-500 text-sm">({detailsModal.vehicle.Seller.totalReviews} avaliações)</span>
										</div>
										{detailsModal.vehicle.Seller.reviewsReceived && detailsModal.vehicle.Seller.reviewsReceived.length > 0 && (
											<div className="space-y-2 mt-3">
												{detailsModal.vehicle.Seller.reviewsReceived.slice(0, 5).map((review, i) => (
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

								{/* Outros veículos do seller */}
								{detailsModal.vehicle.Seller?.vehicles && detailsModal.vehicle.Seller.vehicles.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Outros Veículos ({detailsModal.vehicle.Seller.vehicles.length})</h3>
										<div className="space-y-2">
											{detailsModal.vehicle.Seller.vehicles.map(v => (
												<div key={v.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
													<img src={getImageUrl(v.image)} alt={v.name} className="w-12 h-8 rounded object-cover" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{v.name}</p>
														<p className="text-xs text-gray-500">{getStatusLabel(v.status)}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Documentos do Seller */}
								{detailsModal.vehicle.Seller?.sellerDocs && (detailsModal.vehicle.Seller.sellerDocs.idCard?.length > 0 || detailsModal.vehicle.Seller.sellerDocs.selfies?.length > 0) && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<ShieldCheck className="w-5 h-5" /> Documentos do Vendedor
										</h3>
										{detailsModal.vehicle.Seller.sellerDocs.idCard?.length > 0 && (
											<div className="mb-3">
												<p className="text-xs text-gray-500 mb-2">Documento de Identidade</p>
												{detailsModal.vehicle.Seller.sellerDocs.idCard.map((doc, i) => (
													<a key={i} href={getImageUrl(doc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1">
														<FileText className="w-3 h-3" /> BI/Passaporte {i + 1}
													</a>
												))}
											</div>
										)}
										{detailsModal.vehicle.Seller.sellerDocs.selfies?.length > 0 && (
											<div>
												<p className="text-xs text-gray-500 mb-2">Selfies</p>
												<div className="grid grid-cols-2 gap-2">
													{detailsModal.vehicle.Seller.sellerDocs.selfies.map((selfie, i) => (
														<img key={i} src={getImageUrl(selfie)} alt={`Selfie ${i + 1}`} className="w-full h-20 object-cover rounded-lg" />
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Footer do Modal - Ações */}
						<div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4 rounded-b-2xl">
							<div className="flex gap-2">
								{(!detailsModal.vehicle.isVerified || !detailsModal.vehicle.isAproved) && (
									<>
										<button
											onClick={() => handleApprove(detailsModal.vehicle.id)}
											className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
										>
											<Check className="w-5 h-5" /> Aprovar
										</button>
										<button
											onClick={() => handleReject(detailsModal.vehicle.id, detailsModal.vehicle.name)}
											className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
										>
											<X className="w-5 h-5" /> Negar
										</button>
									</>
								)}
							</div>
							<div className="flex gap-2">
								{detailsModal.vehicle.isFeatured ? (
									<button
										onClick={() => handleRemoveFeatured(detailsModal.vehicle.id)}
										className="bg-yellow-500 text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 font-medium"
									>
										<Star className="w-5 h-5" /> Remover Destaque
									</button>
								) : (
									<button
										onClick={() => handleSetFeatured(detailsModal.vehicle.id, detailsModal.vehicle.name)}
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
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRejectModal({ open: false, vehicleId: null, vehicleName: '', reason: '' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-red-600" /> Negar Veículo
							</h2>
							<button onClick={() => setRejectModal({ open: false, vehicleId: null, vehicleName: '', reason: '' })} className="text-gray-400 hover:text-gray-600">
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">
								Está a negar o veículo <strong>{rejectModal.vehicleName}</strong>.
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
								onClick={() => setRejectModal({ open: false, vehicleId: null, vehicleName: '', reason: '' })}
								disabled={actionLoading}
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancelar
							</button>
							<button
								onClick={submitReject}
								disabled={actionLoading || !rejectModal.reason.trim()}
								className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
								{actionLoading ? 'A negar...' : 'Confirmar Negação'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE DESTAQUE ==================== */}
			{featuredModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFeaturedModal({ open: false, vehicleId: null, vehicleName: '', days: '7' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<Calendar className="w-5 h-5 text-[#154c9a]" /> Definir Destaque
							</h2>
							<button onClick={() => setFeaturedModal({ open: false, vehicleId: null, vehicleName: '', days: '7' })} className="text-gray-400 hover:text-gray-600">
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">
								Definir destaque para <strong>{featuredModal.vehicleName}</strong>.
							</p>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Duração do Destaque
							</label>
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
								onClick={() => setFeaturedModal({ open: false, vehicleId: null, vehicleName: '', days: '7' })}
								disabled={actionLoading}
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancelar
							</button>
							<button
								onClick={submitSetFeatured}
								disabled={actionLoading}
								className="bg-[#154c9a] text-white px-6 py-2 rounded-lg hover:bg-[#123f80] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <StarFilled className="w-4 h-4" />}
								{actionLoading ? 'A definir...' : 'Confirmar Destaque'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminVehicles;
