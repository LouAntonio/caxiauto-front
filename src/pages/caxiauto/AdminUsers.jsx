import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import {
	Users,
	Search,
	Edit2,
	Shield,
	ShieldCheck,
	UserX,
	CheckCircle,
	Loader2,
	Eye,
	Mail,
	Phone,
	MapPin,
	Calendar as CalendarIcon,
	FileText,
	Star as StarFilled,
	Star,
	AlertCircle,
	Key,
	X
} from 'lucide-react';

const AdminUsers = () => {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ search: '', status: '' });
	const [searchInput, setSearchInput] = useState('');

	// Modals
	const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
	const [banModal, setBanModal] = useState({ open: false, userId: null, userName: '', reason: '' });
	const [roleModal, setRoleModal] = useState({ open: false, userId: null, userName: '', currentRole: '', newRole: '' });
	const [verifyModal, setVerifyModal] = useState({ open: false, userId: null, userName: '', isVerified: false });

	const loadUsers = async () => {
		setLoading(true);
		try {
			const params = { page: pagination.currentPage, limit: 10 };
			if (filters.search) params.search = filters.search;
			if (filters.status) params.status = filters.status;
			const response = await api.listUsers(params);
			if (response.success) {
				setUsers(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalUsers,
				});
			} else {
				notyf.error(response.message || 'Erro ao carregar usuários');
			}
		} catch (error) {
			console.error('Erro ao carregar usuários:', error);
			notyf.error('Erro ao carregar usuários');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, [pagination.currentPage]);

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters({ ...filters, search: searchInput.trim() });
		setPagination({ ...pagination, currentPage: 1 });
		setTimeout(() => loadUsers(), 0);
	};

	const handleClearSearch = () => {
		setSearchInput('');
		setFilters({ search: '', status: '' });
		setPagination({ ...pagination, currentPage: 1 });
		setTimeout(() => {
			api.listUsers({ page: 1, limit: 10 }).then(res => {
				if (res.success) {
					setUsers(res.data);
					setPagination({
						currentPage: res.pagination.currentPage,
						totalPages: res.pagination.totalPages,
						total: res.pagination.totalUsers,
					});
				}
			}).finally(() => setLoading(false));
		}, 0);
	};

	const handleViewDetails = async (userId) => {
		try {
			const response = await api.adminGetUserDetails(userId);
			if (response.success) {
				setDetailsModal({ open: true, user: response.data });
			} else {
				notyf.error('Erro ao carregar detalhes');
			}
		} catch (error) {
			notyf.error('Erro ao carregar detalhes');
		}
	};

	const handleBanUser = (userId, name) => {
		setBanModal({ open: true, userId, userName: name, reason: '' });
	};

	const submitBan = async () => {
		try {
			const response = await api.toggleUserStatus(banModal.userId, 'BANNED', banModal.reason);
			if (response.success) {
				notyf.success('Usuário banido. Email enviado.');
				setBanModal({ open: false, userId: null, userName: '', reason: '' });
				loadUsers();
			} else {
				notyf.error(response.message || 'Erro ao banir');
			}
		} catch (error) {
			notyf.error('Erro ao banir usuário');
		}
	};

	const handleToggleStatus = async (userId, currentStatus, name) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		try {
			const response = await api.toggleUserStatus(userId, newStatus);
			if (response.success) {
				notyf.success(`Usuário ${newStatus === 'ACTIVE' ? 'ativado' : 'inativado'}. Email enviado.`);
				loadUsers();
			} else {
				notyf.error(response.message || 'Erro ao atualizar status');
			}
		} catch (error) {
			notyf.error('Erro ao atualizar status');
		}
	};

	const handleUpdateRole = (userId, name, currentRole) => {
		setRoleModal({ open: true, userId, userName: name, currentRole, newRole: currentRole });
	};

	const submitRole = async () => {
		if (!roleModal.newRole) {
			notyf.error('Selecione um role');
			return;
		}
		try {
			const response = await api.updateUserRole(roleModal.userId, roleModal.newRole);
			if (response.success) {
				notyf.success(`Role atualizado para ${roleModal.newRole}. Email enviado.`);
				setRoleModal({ open: false, userId: null, userName: '', currentRole: '', newRole: '' });
				loadUsers();
			} else {
				notyf.error(response.message || 'Erro ao atualizar role');
			}
		} catch (error) {
			notyf.error('Erro ao atualizar role');
		}
	};

	const handleVerifyUser = (userId, name, isVerified) => {
		setVerifyModal({ open: true, userId, userName: name, isVerified });
	};

	const submitVerify = async () => {
		try {
			const response = await api.adminVerifyUser(verifyModal.userId, !verifyModal.isVerified);
			if (response.success) {
				notyf.success(verifyModal.isVerified ? 'Verificação removida. Email enviado.' : 'Usuário verificado. Email enviado.');
				setVerifyModal({ open: false, userId: null, userName: '', isVerified: false });
				loadUsers();
			} else {
				notyf.error(response.message || 'Erro ao atualizar verificação');
			}
		} catch (error) {
			notyf.error('Erro ao atualizar verificação');
		}
	};

	const handleResetPassword = async (userId, name) => {
		if (!window.confirm(`Enviar link de redefinição de senha para ${name}?`)) return;
		try {
			const response = await api.adminResetUserPassword(userId);
			if (response.success) {
				notyf.success('Link de redefinição enviado por email!');
			} else {
				notyf.error(response.message || 'Erro ao enviar link');
			}
		} catch (error) {
			notyf.error('Erro ao enviar link de redefinição');
		}
	};

	const formatDate = (date) => {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const getRoleLabel = (role) => {
		const map = { USER: 'Utilizador', SELLER: 'Vendedor', ADMIN: 'Administrador' };
		return map[role] || role;
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
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
					<p className="text-gray-600 mt-1">Gerencie todos os usuários da plataforma</p>
				</div>
			</div>

			{/* Filtros */}
			<form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="relative md:col-span-2">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar por nome, email..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						/>
						{searchInput && (
							<button
								type="button"
								onClick={handleClearSearch}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
					<select
						value={filters.status}
						onChange={(e) => setFilters({ ...filters, status: e.target.value })}
						className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
					>
						<option value="">Todos status</option>
						<option value="ACTIVE">Ativo</option>
						<option value="INACTIVE">Inativo</option>
						<option value="BANNED">Banido</option>
					</select>
					<button
						type="submit"
						className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2"
					>
						<Search className="w-5 h-5" /> Pesquisar
					</button>
				</div>
			</form>

			{/* Tabela */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : users.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Users className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum usuário encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificado</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Província</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{users.map((user) => (
									<tr key={user.id} className="hover:bg-gray-50">
										<td className="px-4 py-3">
											<div>
												<p className="font-medium text-gray-900">{user.name} {user.surname}</p>
												<p className="text-sm text-gray-500">{user.email}</p>
												{user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
											</div>
										</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800'
												: user.role === 'SELLER' ? 'bg-blue-100 text-blue-800'
												: 'bg-gray-100 text-gray-800'
											}`}>
												{getRoleLabel(user.role)}
											</span>
										</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												user.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
												: user.status === 'BANNED' ? 'bg-red-100 text-red-800'
												: 'bg-yellow-100 text-yellow-800'
											}`}>
												{user.status}
											</span>
										</td>
										<td className="px-4 py-3">
											{user.isVerified ? (
												<span className="flex items-center gap-1 text-green-600 text-sm">
													<ShieldCheck className="w-4 h-4" /> Sim
												</span>
											) : (
												<span className="text-gray-400 text-sm">Não</span>
											)}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{user.provincia ? getProvinciaLabel(user.provincia) : '—'}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<button
													onClick={() => handleViewDetails(user.id)}
													className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Ver detalhes"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleVerifyUser(user.id, `${user.name} ${user.surname}`, user.isVerified)}
													className={`p-1.5 rounded-lg ${
														user.isVerified
															? 'text-yellow-600 hover:bg-yellow-50'
															: 'text-green-600 hover:bg-green-50'
													}`}
													title={user.isVerified ? 'Remover verificação' : 'Verificar'}
												>
													{user.isVerified ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
												</button>
												<button
													onClick={() => handleUpdateRole(user.id, `${user.name} ${user.surname}`, user.role)}
													className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Alterar Role"
												>
													<Edit2 className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleToggleStatus(user.id, user.status)}
													className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"
													title={user.status === 'ACTIVE' ? 'Inativar' : 'Ativar'}
												>
													{user.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
												</button>
												{user.status !== 'BANNED' && (
													<button
														onClick={() => handleBanUser(user.id, `${user.name} ${user.surname}`)}
														className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
														title="Banir"
													>
														<AlertCircle className="w-4 h-4" />
													</button>
												)}
												<button
													onClick={() => handleResetPassword(user.id, `${user.name} ${user.surname}`)}
													className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg"
													title="Reset Senha"
												>
													<Key className="w-4 h-4" />
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
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Anterior</button>
					<span className="text-sm text-gray-600">Página {pagination.currentPage} de {pagination.totalPages}</span>
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Próxima</button>
				</div>
			)}

			{/* ==================== MODAL DE DETALHES ==================== */}
			{detailsModal.open && detailsModal.user && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailsModal({ open: false, user: null })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
							<h2 className="text-xl font-bold text-gray-900">Detalhes do Usuário</h2>
							<button onClick={() => setDetailsModal({ open: false, user: null })} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
						</div>

						<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Coluna Esquerda: Dados Pessoais */}
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-gray-50 rounded-xl p-5">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Nome</p>
											<p className="font-medium">{detailsModal.user.name} {detailsModal.user.surname}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Email</p>
											<p className="font-medium text-sm">{detailsModal.user.email}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Telefone</p>
											<p className="font-medium">{detailsModal.user.phone || '—'}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Província</p>
											<p className="font-medium">{detailsModal.user.provincia ? getProvinciaLabel(detailsModal.user.provincia) : '—'}</p>
										</div>
										{detailsModal.user.municipio && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Município</p>
												<p className="font-medium">{detailsModal.user.municipio}</p>
											</div>
										)}
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Role</p>
											<p className="font-medium">{getRoleLabel(detailsModal.user.role)}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Status</p>
											<p className="font-medium">{detailsModal.user.status}</p>
										</div>
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Verificado</p>
											<p className={`font-medium ${detailsModal.user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
												{detailsModal.user.isVerified ? 'Sim ✓' : 'Não'}
											</p>
										</div>
										{detailsModal.user.verifiedAt && (
											<div className="bg-white p-3 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-500">Verificado em</p>
												<p className="font-medium">{formatDate(detailsModal.user.verifiedAt)}</p>
											</div>
										)}
										<div className="bg-white p-3 rounded-lg border border-gray-200">
											<p className="text-xs text-gray-500">Criado em</p>
											<p className="font-medium">{formatDate(detailsModal.user.createdAt)}</p>
										</div>
									</div>
								</div>

								{/* Veículos */}
								{detailsModal.user.vehicles && detailsModal.user.vehicles.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Veículos ({detailsModal.user.vehicles.length})</h3>
										<div className="grid grid-cols-2 gap-3">
											{detailsModal.user.vehicles.map(v => (
												<div key={v.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
													<img src={v.image || '/images/i10.jpg'} alt={v.name} className="w-14 h-10 rounded object-cover" />
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
								{detailsModal.user.pecas && detailsModal.user.pecas.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Peças ({detailsModal.user.pecas.length})</h3>
										<div className="grid grid-cols-2 gap-3">
											{detailsModal.user.pecas.map(p => (
												<div key={p.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
													<img src={p.image || '/images/i10.jpg'} alt={p.name} className="w-14 h-10 rounded object-cover" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{p.name}</p>
														<p className="text-xs text-gray-500">{formatCurrency(p.price)}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Reservas */}
								{detailsModal.user.bookings && detailsModal.user.bookings.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">Reservas ({detailsModal.user.bookings.length})</h3>
										<div className="space-y-2">
											{detailsModal.user.bookings.map(b => (
												<div key={b.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
													<div className="flex-1">
														<p className="text-sm font-medium">{b.Vehicle?.name}</p>
														<p className="text-xs text-gray-500">{formatDate(b.startDate)} → {formatDate(b.endDate)}</p>
													</div>
													<span className={`px-2 py-1 text-xs rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
														{b.status}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Coluna Direita */}
							<div className="space-y-6">
								{/* Subscrição */}
								{detailsModal.user.subscription && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<CalendarIcon className="w-5 h-5" /> Subscrição
										</h3>
										<div className="space-y-2 text-sm">
											<p><span className="text-gray-500">Plano:</span> <strong>{detailsModal.user.subscription.plan?.name}</strong></p>
											<p><span className="text-gray-500">Preço:</span> {formatCurrency(detailsModal.user.subscription.plan?.price)}</p>
											<p><span className="text-gray-500">Início:</span> {formatDate(detailsModal.user.subscription.startDate)}</p>
											<p><span className="text-gray-500">Fim:</span> {formatDate(detailsModal.user.subscription.endDate)}</p>
											<p><span className="text-gray-500">Ativa:</span> {detailsModal.user.subscription.isActive ? 'Sim ✓' : 'Não'}</p>
											<p><span className="text-gray-500">Créditos destaque:</span> {detailsModal.user.subscription.remainingHighlightCredits}</p>
										</div>
									</div>
								)}

								{/* Reviews Recebidas */}
								{detailsModal.user.reviewsReceived && detailsModal.user.reviewsReceived.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<StarFilled className="w-5 h-5 text-yellow-500" /> Avaliações Recebidas
											<span className="text-sm font-normal text-gray-500">({detailsModal.user.totalReviews})</span>
										</h3>
										<div className="flex items-center gap-2 mb-3">
											<StarFilled className="w-6 h-6 text-yellow-500 fill-yellow-500" />
											<span className="text-2xl font-bold">{detailsModal.user.averageRating}</span>
										</div>
										<div className="space-y-2">
											{detailsModal.user.reviewsReceived.slice(0, 5).map((r, i) => (
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

								{/* Denúncias Recebidas */}
								{detailsModal.user.reportsReceived && detailsModal.user.reportsReceived.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<AlertCircle className="w-5 h-5 text-red-500" /> Denúncias Recebidas
										</h3>
										<div className="space-y-2">
											{detailsModal.user.reportsReceived.slice(0, 5).map(r => (
												<div key={r.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
													<p><span className="text-gray-500">Motivo:</span> <strong>{r.reason}</strong></p>
													<p className="text-gray-700 mt-1">{r.description}</p>
													<p className="text-xs text-gray-500 mt-1">Status: {r.status} · {formatDate(r.createdAt)}</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Documentos do Vendedor */}
								{detailsModal.user.sellerDocs && (detailsModal.user.sellerDocs.idCard?.length > 0 || detailsModal.user.sellerDocs.selfies?.length > 0) && (
									<div className="bg-gray-50 rounded-xl p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<FileText className="w-5 h-5" /> Documentos do Vendedor
										</h3>
										{detailsModal.user.sellerDocs.idCard?.length > 0 && (
											<div className="mb-3">
												<p className="text-xs text-gray-500 mb-2">BI / Passaporte</p>
												{detailsModal.user.sellerDocs.idCard.map((doc, i) => (
													<a key={i} href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-1">
														<FileText className="w-3 h-3" /> Doc {i + 1}
													</a>
												))}
											</div>
										)}
										{detailsModal.user.sellerDocs.selfies?.length > 0 && (
											<div>
												<p className="text-xs text-gray-500 mb-2">Selfies</p>
												<div className="grid grid-cols-2 gap-2">
													{detailsModal.user.sellerDocs.selfies.map((s, i) => (
														<img key={i} src={s} alt={`Selfie ${i+1}`} className="w-full h-20 object-cover rounded-lg" />
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE BANIMENTO ==================== */}
			{banModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setBanModal({ open: false, userId: null, userName: '', reason: '' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" /> Banir Usuário</h2>
							<button onClick={() => setBanModal({ open: false, userId: null, userName: '', reason: '' })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">Está a banir <strong>{banModal.userName}</strong>.</p>
							<label className="block text-sm font-medium text-gray-700 mb-2">Motivo (opcional)</label>
							<textarea
								value={banModal.reason}
								onChange={(e) => setBanModal({ ...banModal, reason: e.target.value })}
								placeholder="Descreva o motivo do banimento..."
								rows={4}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
							/>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button onClick={() => setBanModal({ open: false, userId: null, userName: '', reason: '' })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
							<button onClick={submitBan} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Confirmar Banimento</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE ALTERAÇÃO DE ROLE ==================== */}
			{roleModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRoleModal({ open: false, userId: null, userName: '', currentRole: '', newRole: '' })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Edit2 className="w-5 h-5 text-blue-600" /> Alterar Role</h2>
							<button onClick={() => setRoleModal({ open: false, userId: null, userName: '', currentRole: '', newRole: '' })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">Alterar role de <strong>{roleModal.userName}</strong></p>
							<label className="block text-sm font-medium text-gray-700 mb-2">Novo Role</label>
							<select
								value={roleModal.newRole}
								onChange={(e) => setRoleModal({ ...roleModal, newRole: e.target.value })}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] outline-none"
							>
								<option value="USER">Utilizador</option>
								<option value="SELLER">Vendedor</option>
								<option value="ADMIN">Administrador</option>
							</select>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button onClick={() => setRoleModal({ open: false, userId: null, userName: '', currentRole: '', newRole: '' })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
							<button onClick={submitRole} className="bg-[#154c9a] text-white px-6 py-2 rounded-lg hover:bg-[#123f80] font-medium flex items-center gap-2"><Edit2 className="w-4 h-4" /> Confirmar</button>
						</div>
					</div>
				</div>
			)}

			{/* ==================== MODAL DE VERIFICAÇÃO ==================== */}
			{verifyModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setVerifyModal({ open: false, userId: null, userName: '', isVerified: false })}>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								{verifyModal.isVerified ? <Shield className="w-5 h-5 text-yellow-600" /> : <ShieldCheck className="w-5 h-5 text-green-600" />}
								{verifyModal.isVerified ? 'Remover Verificação' : 'Verificar Usuário'}
							</h2>
							<button onClick={() => setVerifyModal({ open: false, userId: null, userName: '', isVerified: false })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
						</div>
						<div className="p-6">
							<p className="text-gray-700">
								{verifyModal.isVerified
									? `Tem certeza que deseja remover a verificação de ${verifyModal.userName}?`
									: `Tem certeza que deseja verificar ${verifyModal.userName}?`}
							</p>
							<p className="text-sm text-gray-500 mt-2">Um email será enviado ao usuário informando a alteração.</p>
						</div>
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
							<button onClick={() => setVerifyModal({ open: false, userId: null, userName: '', isVerified: false })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
							<button onClick={submitVerify} className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-white ${verifyModal.isVerified ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>
								<ShieldCheck className="w-4 h-4" /> Confirmar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminUsers;
