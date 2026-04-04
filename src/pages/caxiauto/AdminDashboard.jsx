import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
	Car,
	Wrench,
	Users,
	ShoppingCart,
	Key,
	FolderTree,
	UserX,
	Star,
	AlertTriangle,
	TrendingUp,
	Eye,
	Loader2,
	ArrowUpRight,
	ArrowDownRight
} from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { AdminStatsSkeleton, AdminTableSkeleton } from '../../components/skeletons';

const AdminDashboard = () => {
	const {
		getDashboardStats,
		getRecentVehicles,
		getRecentPecas,
		getRecentUsers,
	} = useAdmin();

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [recentVehicles, setRecentVehicles] = useState([]);
	const [recentPecas, setRecentPecas] = useState([]);
	const [recentUsers, setRecentUsers] = useState([]);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setLoading(true);
		try {
			const [statsData, vehiclesData, pecasData, usersData] = await Promise.all([
				getDashboardStats(),
				getRecentVehicles(5),
				getRecentPecas(5),
				getRecentUsers(5),
			]);

			if (statsData.success) setStats(statsData.data);
			if (vehiclesData.success) setRecentVehicles(vehiclesData.data);
			if (pecasData.success) setRecentPecas(pecasData.data);
			if (usersData.success) setRecentUsers(usersData.data);
		} catch (error) {
			console.error('Erro ao carregar dashboard:', error);
		} finally {
			setLoading(false);
		}
	};

	const statCards = [
		{
			title: 'Total de Veículos',
			value: stats?.totalVeiculos || 0,
			icon: Car,
			color: 'bg-blue-500',
			lightColor: 'bg-blue-50',
		},
		{
			title: 'Veículos à Venda',
			value: stats?.totalVeiculosVenda || 0,
			icon: ShoppingCart,
			color: 'bg-green-500',
			lightColor: 'bg-green-50',
		},
		{
			title: 'Veículos para Aluguel',
			value: stats?.totalVeiculosAluguel || 0,
			icon: Key,
			color: 'bg-purple-500',
			lightColor: 'bg-purple-50',
		},
		{
			title: 'Total de Peças',
			value: stats?.totalPecas || 0,
			icon: Wrench,
			color: 'bg-orange-500',
			lightColor: 'bg-orange-50',
		},
		{
			title: 'Usuários',
			value: stats?.totalUsuarios || 0,
			icon: Users,
			color: 'bg-indigo-500',
			lightColor: 'bg-indigo-50',
		},
		{
			title: 'Categorias',
			value: stats?.totalCategorias || 0,
			icon: FolderTree,
			color: 'bg-teal-500',
			lightColor: 'bg-teal-50',
		},
		{
			title: 'Usuários Banidos',
			value: stats?.usuariosBanned || 0,
			icon: UserX,
			color: 'bg-red-500',
			lightColor: 'bg-red-50',
		},
		{
			title: 'Denúncias Pendentes',
			value: stats?.denunciasPendentes || 0,
			icon: AlertTriangle,
			color: 'bg-yellow-500',
			lightColor: 'bg-yellow-50',
		},
	];

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA',
		}).format(value);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className="space-y-8">
				{/* Header skeleton */}
				<div className="mb-8">
					<div className="h-9 bg-gray-200 rounded w-48 animate-pulse mb-2" />
					<div className="h-5 bg-gray-200 rounded w-72 animate-pulse" />
				</div>

				{/* Stats cards skeleton */}
				<AdminStatsSkeleton count={8} />

				{/* Seção de Estatísticas Adicionais skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
						<div className="flex items-center justify-between mb-4">
							<div className="h-6 bg-gray-200 rounded w-40" />
							<div className="h-6 bg-gray-200 rounded w-16" />
						</div>
						<div className="h-4 bg-gray-200 rounded w-full" />
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
						<div className="flex items-center justify-between mb-4">
							<div className="h-6 bg-gray-200 rounded w-32" />
							<div className="h-6 bg-gray-200 rounded w-16" />
						</div>
						<div className="h-4 bg-gray-200 rounded w-full" />
					</div>
				</div>

				{/* Tabelas de recentes skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<AdminTableSkeleton rows={5} columns={5} />
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
						<div className="p-6 border-b border-gray-200">
							<div className="h-6 bg-gray-200 rounded w-40" />
						</div>
						<div className="divide-y divide-gray-100">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-4 space-y-3">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gray-300 rounded-full" />
										<div className="space-y-2 flex-1">
											<div className="h-4 bg-gray-200 rounded w-3/4" />
											<div className="h-3 bg-gray-200 rounded w-1/2" />
										</div>
									</div>
									<div className="flex gap-2">
										<div className="h-5 bg-gray-200 rounded-full w-20" />
										<div className="h-5 bg-gray-200 rounded-full w-16" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Peças Recentes skeleton */}
				<AdminTableSkeleton rows={5} columns={5} />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
				<p className="text-gray-600">Visão geral da plataforma Caxiauto</p>
			</div>

			{/* Cards de Estatísticas */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div
							key={index}
							className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
						>
							<div className="flex items-center justify-between mb-4">
								<div className={`${stat.lightColor} p-3 rounded-lg`}>
									<Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
								</div>
							</div>
							<h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
							<p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString('pt-BR')}</p>
						</div>
					);
				})}
			</div>

			{/* Seção de Estatísticas Adicionais */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Veículos em Destaque */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Veículos em Destaque</h3>
						<div className="flex items-center gap-2 text-green-600">
							<Star className="w-5 h-5" />
							<span className="font-semibold">{stats?.veiculosFeatured || 0}</span>
						</div>
					</div>
					<p className="text-sm text-gray-600">
						Veículos destacados atualmente na plataforma
					</p>
				</div>

				{/* Total de Avaliações */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
						<div className="flex items-center gap-2 text-yellow-600">
							<Star className="w-5 h-5 fill-yellow-500" />
							<span className="font-semibold">{stats?.totalReviews || 0}</span>
						</div>
					</div>
					<p className="text-sm text-gray-600">
						Total de avaliações recebidas pelos vendedores
					</p>
				</div>
			</div>

			{/* Seções de Recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Veículos Recentes */}
				<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<Car className="w-5 h-5 text-[#154c9a]" />
								Veículos Recentes
							</h3>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Veículo
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tipo
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Preço
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Vendedor
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Data
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{recentVehicles.map((vehicle) => (
									<tr key={vehicle.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<img
													src={getImageUrl(vehicle.image, '/images/i10.jpg')}
													alt={vehicle.name}
													className="w-12 h-12 rounded-lg object-cover"
												/>
												<div>
													<p className="font-medium text-gray-900">{vehicle.name}</p>
													<p className="text-sm text-gray-500">
														{vehicle.Manufacturer?.name} {vehicle.Class?.name}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												vehicle.type === 'SALE'
													? 'bg-green-100 text-green-800'
													: 'bg-blue-100 text-blue-800'
											}`}>
												{vehicle.type === 'SALE' ? 'Venda' : 'Aluguel'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{vehicle.type === 'SALE'
												? formatCurrency(vehicle.priceSale)
												: formatCurrency(vehicle.priceRentDay) + '/dia'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{vehicle.Seller?.name} {vehicle.Seller?.surname}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(vehicle.createdAt)}
										</td>
									</tr>
								))}
								{recentVehicles.length === 0 && (
									<tr>
										<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
											Nenhum veículo recente
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Usuários Recentes */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<Users className="w-5 h-5 text-[#154c9a]" />
								Usuários Recentes
							</h3>
						</div>
					</div>
					<div className="divide-y divide-gray-200">
						{recentUsers.map((user) => (
							<div key={user.id} className="p-4 hover:bg-gray-50">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-[#154c9a] rounded-full flex items-center justify-center text-white font-semibold">
											{user.name?.charAt(0)}{user.surname?.charAt(0)}
										</div>
										<div>
											<p className="font-medium text-gray-900">{user.name} {user.surname}</p>
											<p className="text-sm text-gray-500">{user.email}</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2 mt-2">
									<span className={`px-2 py-1 text-xs font-medium rounded-full ${
										user.role === 'ADMIN'
											? 'bg-purple-100 text-purple-800'
											: user.role === 'SELLER'
												? 'bg-blue-100 text-blue-800'
												: 'bg-gray-100 text-gray-800'
									}`}>
										{user.role}
									</span>
									<span className={`px-2 py-1 text-xs font-medium rounded-full ${
										user.status === 'ACTIVE'
											? 'bg-green-100 text-green-800'
											: user.status === 'BANNED'
												? 'bg-red-100 text-red-800'
												: 'bg-yellow-100 text-yellow-800'
									}`}>
										{user.status}
									</span>
									{user.isVerified && (
										<span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
											Verificado
										</span>
									)}
								</div>
								<p className="text-xs text-gray-400 mt-2">{formatDate(user.createdAt)}</p>
							</div>
						))}
						{recentUsers.length === 0 && (
							<div className="p-8 text-center text-gray-500">
								Nenhum usuário recente
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Peças Recentes */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Wrench className="w-5 h-5 text-[#154c9a]" />
							Peças Recentes
						</h3>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Peça
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Categoria
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Preço
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Província
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Vendedor
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{recentPecas.map((peca) => (
								<tr key={peca.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-3">
											<img
												src={getImageUrl(peca.image, '/images/i10.jpg')}
												alt={peca.name}
												className="w-12 h-12 rounded-lg object-cover"
											/>
											<div>
												<p className="font-medium text-gray-900">{peca.name}</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="text-sm text-gray-900">{peca.Categoria?.name}</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatCurrency(peca.price)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{peca.provincia}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{peca.Seller?.name} {peca.Seller?.surname}
										</div>
									</td>
								</tr>
							))}
							{recentPecas.length === 0 && (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
										Nenhuma peça recente
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
