import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import api, { getImageUrl, notyf } from '../../services/api';
import {
	Car,
	Search,
	Edit2,
	Trash2,
	Eye,
	EyeOff,
	Star,
	Loader2,
	AlertCircle,
	Plus
} from 'lucide-react';

const AdminVehicles = () => {
	const { getRecentVehicles } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [vehicles, setVehicles] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [filters, setFilters] = useState({
		search: '',
		type: '',
		status: '',
		manufacturer: '',
	});

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
				// Sessão expirada
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

	useEffect(() => {
		loadVehicles();
	}, [pagination.currentPage]);

	const handleFilterChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination({ ...pagination, currentPage: 1 });
		loadVehicles();
	};

	const handleToggleFeatured = async (id, isFeatured) => {
		try {
			const response = await api.toggleVehicleFeatured(id);
			if (response.success) {
				notyf.success(isFeatured ? 'Destaque removido!' : 'Veículo destacado!');
				loadVehicles();
			} else if (response.auth) {
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
				window.location.href = '/caxiauto/login';
			} else {
				notyf.error(response.message || 'Erro ao atualizar destaque');
			}
		} catch (error) {
			console.error('Erro ao atualizar destaque:', error);
			notyf.error('Erro ao atualizar destaque');
		}
	};

	const handleToggleStatus = async (id, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		try {
			const response = await api.toggleVehicleStatus(id, newStatus);
			if (response.success) {
				notyf.success(`Status alterado para ${newStatus}`);
				loadVehicles();
			} else if (response.auth) {
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
				window.location.href = '/caxiauto/login';
			} else {
				notyf.error(response.message || 'Erro ao atualizar status');
			}
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			notyf.error('Erro ao atualizar status');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar este veículo?')) return;

		try {
			const response = await api.deleteVehicle(id);
			if (response.success) {
				notyf.success('Veículo eliminado com sucesso');
				loadVehicles();
			} else if (response.auth) {
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
				window.location.href = '/caxiauto/login';
			} else {
				notyf.error(response.message || 'Erro ao eliminar veículo');
			}
		} catch (error) {
			console.error('Erro ao eliminar veículo:', error);
			notyf.error('Erro ao eliminar veículo');
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA',
		}).format(value);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
					<p className="text-gray-600 mt-1">Gerencie todos os veículos da plataforma</p>
				</div>
			</div>

			{/* Filtros */}
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
							<option value="INACTIVE">Inativo</option>
							<option value="SOLD">Vendido</option>
						</select>
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

			{/* Tabela de Veículos */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : vehicles.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Car className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destaque</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{vehicles.map((vehicle) => (
									<tr key={vehicle.id} className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<img
													src={getImageUrl(vehicle.image, '/images/i10.jpg')}
													alt={vehicle.name}
													className="w-16 h-12 rounded-lg object-cover"
												/>
												<div>
													<p className="font-medium text-gray-900">{vehicle.name}</p>
													<p className="text-sm text-gray-500">
														{vehicle.Manufacturer?.name} {vehicle.Class?.name}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												vehicle.type === 'SALE'
													? 'bg-green-100 text-green-800'
													: 'bg-blue-100 text-blue-800'
											}`}>
												{vehicle.type === 'SALE' ? 'Venda' : 'Aluguel'}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{vehicle.type === 'SALE'
												? formatCurrency(vehicle.priceSale)
												: formatCurrency(vehicle.priceRentDay) + '/dia'}
										</td>
										<td className="px-6 py-4">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												vehicle.status === 'ACTIVE'
													? 'bg-green-100 text-green-800'
													: vehicle.status === 'SOLD'
													? 'bg-gray-100 text-gray-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}>
												{vehicle.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => handleToggleFeatured(vehicle.id, vehicle.isFeatured)}
												className={`p-2 rounded-lg transition-colors ${
													vehicle.isFeatured
														? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
														: 'bg-gray-100 text-gray-400 hover:bg-gray-200'
												}`}
												title={vehicle.isFeatured ? 'Remover destaque' : 'Adicionar destaque'}
											>
												<Star className={`w-5 h-5 ${vehicle.isFeatured ? 'fill-yellow-500' : ''}`} />
											</button>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
													className="p-2 text-gray-600 hover:text-[#154c9a] hover:bg-blue-50 rounded-lg transition-colors"
													title={vehicle.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
												>
													{vehicle.status === 'ACTIVE' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
												</button>
												<button
													onClick={() => handleDelete(vehicle.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
													title="Eliminar"
												>
													<Trash2 className="w-5 h-5" />
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
		</div>
	);
};

export default AdminVehicles;
