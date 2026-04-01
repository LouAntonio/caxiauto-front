import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { Users, Search, Edit2, Shield, UserX, CheckCircle, Loader2 } from 'lucide-react';

const AdminUsers = () => {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({ search: '', status: '' });

	const loadUsers = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.currentPage,
				limit: 10,
				...filters,
			});
			const response = await api.listUsers(Object.fromEntries(params));
			if (response.success) {
				setUsers(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalUsers,
				});
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.message || 'Erro ao carregar usuários');
			}
		} catch (error) {
			console.error('Erro ao carregar usuários:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, [pagination.currentPage]);

	const handleToggleStatus = async (userId, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		try {
			const response = await api.toggleUserStatus(userId, newStatus);
			if (response.success) {
				notyf.success(`Usuário ${newStatus === 'ACTIVE' ? 'ativado' : 'inativado'}`);
				loadUsers();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error('Erro ao atualizar status');
			}
		} catch (error) {
			notyf.error('Erro ao atualizar status');
		}
	};

	const handleBanUser = async (userId) => {
		if (!window.confirm('Tem certeza que deseja banir este usuário?')) return;
		try {
			const response = await api.toggleUserStatus(userId, 'BANNED');
			if (response.success) {
				notyf.success('Usuário banido');
				loadUsers();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error('Erro ao banir usuário');
			}
		} catch (error) {
			notyf.error('Erro ao banir usuário');
		}
	};

	const handleUpdateRole = async (userId, currentRole) => {
		const newRole = currentRole === 'USER' ? 'SELLER' : 'USER';
		try {
			const response = await api.updateUserRole(userId, newRole);
			if (response.success) {
				notyf.success(`Role atualizado para ${newRole}`);
				loadUsers();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error('Erro ao atualizar role');
			}
		} catch (error) {
			notyf.error('Erro ao atualizar role');
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
				<p className="text-gray-600 mt-1">Gerencie todos os usuários da plataforma</p>
			</div>

			<form onSubmit={(e) => { e.preventDefault(); setPagination({ ...pagination, currentPage: 1 }); loadUsers(); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar por nome, email..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						/>
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
					<button type="submit" className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center justify-center gap-2">
						<Search className="w-5 h-5" /> Filtrar
					</button>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : users.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Users className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum usuário encontrado</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verificado</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<p className="font-medium text-gray-900">{user.name} {user.surname}</p>
											<p className="text-sm text-gray-500">{user.email}</p>
											<p className="text-xs text-gray-400">{user.phone || 'Sem telefone'}</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className={`px-2 py-1 text-xs font-medium rounded-full ${
											user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800'
											: user.role === 'SELLER' ? 'bg-blue-100 text-blue-800'
											: 'bg-gray-100 text-gray-800'
										}`}>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className={`px-2 py-1 text-xs font-medium rounded-full ${
											user.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
											: user.status === 'BANNED' ? 'bg-red-100 text-red-800'
											: 'bg-yellow-100 text-yellow-800'
										}`}>
											{user.status}
										</span>
									</td>
									<td className="px-6 py-4">
										{user.isVerified ? (
											<span className="flex items-center gap-1 text-green-600 text-sm">
												<CheckCircle className="w-4 h-4" /> Verificado
											</span>
										) : (
											<span className="text-gray-400 text-sm">Não verificado</span>
										)}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleUpdateRole(user.id, user.role)}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
												title="Alterar Role"
											>
												<Edit2 className="w-5 h-5" />
											</button>
											<button
												onClick={() => handleToggleStatus(user.id, user.status)}
												className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
												title={user.status === 'ACTIVE' ? 'Inativar' : 'Ativar'}
											>
												{user.status === 'ACTIVE' ? <UserX className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
											</button>
											{user.status !== 'BANNED' && (
												<button
													onClick={() => handleBanUser(user.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
													title="Banir"
												>
													<Shield className="w-5 h-5" />
												</button>
											)}
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
		</div>
	);
};

export default AdminUsers;
