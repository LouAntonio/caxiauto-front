import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
	User,
	Mail,
	Phone,
	LogOut,
	Edit2,
	Save,
	X,
	Calendar,
	Shield,
	Settings,
	Bell,
	ChevronRight,
	Car,
	ShoppingBag,
	FileText,
	Heart,
	Eye,
	TrendingUp,
	TrendingDown,
	BarChart3
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MinhaConta = () => {
	useDocumentTitle('Minha Conta - CaxiAuto');

	const { user, logout, updateUser } = useAuth();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [message, setMessage] = useState('');
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: user?.phone || '',
	});

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = async () => {
		const result = await updateUser(formData);
		if (result.success) {
			setMessage('Dados atualizados com sucesso!');
			setIsEditing(false);
			setTimeout(() => setMessage(''), 3000);
		} else {
			setMessage('Erro ao atualizar dados: ' + result.error);
			setTimeout(() => setMessage(''), 3000);
		}
	};

	const handleCancel = () => {
		setFormData({
			name: user?.name || '',
			email: user?.email || '',
			phone: user?.phone || '',
		});
		setIsEditing(false);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Dados mockados de veículos com estatísticas de visualizações
	const userVehicles = [
		{
			id: 1,
			name: 'Toyota Corolla 2020',
			image: '/images/rent/08.jpg',
			price: '15.500.000',
			views: 1247,
			viewsToday: 34,
			viewsWeek: 189,
			trend: 'up',
			trendPercentage: 12,
			status: 'active',
			publishedDate: '2026-01-15'
		},
		{
			id: 2,
			name: 'Honda Civic 2019',
			image: '/images/rent/09.jpg',
			price: '12.800.000',
			views: 856,
			viewsToday: 18,
			viewsWeek: 124,
			trend: 'down',
			trendPercentage: 5,
			status: 'active',
			publishedDate: '2026-01-20'
		},
		{
			id: 3,
			name: 'Nissan Sentra 2021',
			image: '/images/rent/10.jpg',
			price: '14.200.000',
			views: 2103,
			viewsToday: 56,
			viewsWeek: 312,
			trend: 'up',
			trendPercentage: 18,
			status: 'active',
			publishedDate: '2026-01-10'
		}
	];

	// Calcular estatísticas totais
	const totalViews = userVehicles.reduce((sum, v) => sum + v.views, 0);
	const totalViewsToday = userVehicles.reduce((sum, v) => sum + v.viewsToday, 0);
	const totalViewsWeek = userVehicles.reduce((sum, v) => sum + v.viewsWeek, 0);
	const averageViews = userVehicles.length > 0 ? Math.round(totalViews / userVehicles.length) : 0;

	const menuItems = [
		{
			icon: Car,
			title: 'Meus Veículos',
			description: 'Gerenciar anúncios de veículos',
			path: '/meus-veiculos',
			badge: userVehicles.length.toString()
		},
		{
			icon: FileText,
			title: 'Documentos',
			description: 'Contratos e documentação',
			path: '/minha-conta/documentos',
			badge: null
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 py-8 max-w-7xl mx-auto">
			<div className="">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
					<p className="mt-1 text-sm text-gray-600">
						Gerencie suas informações e atividades
					</p>
				</div>

				{/* Mensagem de feedback */}
				{message && (
					<div className={`mb-6 p-4 rounded-lg ${message.includes('sucesso')
							? 'bg-green-50 border border-green-200 text-green-700'
							: 'bg-red-50 border border-red-200 text-red-700'
						}`}>
						{message}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Coluna da Esquerda - Informações do Perfil */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							{/* Avatar e Nome */}
							<div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
								<div className="flex items-center justify-center mb-4">
									<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
										<User className="w-12 h-12 text-blue-600" />
									</div>
								</div>
								<div className="text-center">
									<h2 className="text-xl font-semibold">{user?.name}</h2>
									<p className="text-blue-100 text-sm mt-1">{user?.email}</p>
								</div>
							</div>

							{/* Informações */}
							<div className="p-6 space-y-4">
								{isEditing ? (
									<>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Nome Completo
											</label>
											<input
												type="text"
												name="name"
												value={formData.name}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Email
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Telefone
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg"
											/>
										</div>

										<div className="flex gap-2 pt-2">
											<button
												onClick={handleSave}
												className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
											>
												<Save className="w-4 h-4" />
												Salvar
											</button>
											<button
												onClick={handleCancel}
												className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
											>
												<X className="w-4 h-4" />
												Cancelar
											</button>
										</div>
									</>
								) : (
									<>
										<div className="flex items-start gap-3">
											<Mail className="w-5 h-5 text-gray-400 mt-0.5" />
											<div>
												<p className="text-xs text-gray-500">Email</p>
												<p className="text-sm font-medium text-gray-900">{user?.email}</p>
											</div>
										</div>

										{user?.phone && (
											<div className="flex items-start gap-3">
												<Phone className="w-5 h-5 text-gray-400 mt-0.5" />
												<div>
													<p className="text-xs text-gray-500">Telefone</p>
													<p className="text-sm font-medium text-gray-900">{user.phone}</p>
												</div>
											</div>
										)}

										<div className="flex items-start gap-3">
											<Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
											<div>
												<p className="text-xs text-gray-500">Membro desde</p>
												<p className="text-sm font-medium text-gray-900">
													{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
												</p>
											</div>
										</div>

										<div className="pt-2">
											<button
												onClick={() => setIsEditing(true)}
												className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
											>
												<Edit2 className="w-4 h-4" />
												Editar Perfil
											</button>
										</div>
									</>
								)}

								<div className="pt-4 border-t border-gray-200">
									<button
										onClick={handleLogout}
										className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
									>
										<LogOut className="w-4 h-4" />
										Sair da Conta
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Coluna da Direita - Menu de Opções */}
					<div className="lg:col-span-2 space-y-6">
						{/* Ações Rápidas */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<Settings className="w-5 h-5 text-blue-600" />
								Ações Rápidas
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
								{menuItems.map((item, index) => {
									const Icon = item.icon;
									return (
										<button
											key={index}
											onClick={() => navigate(item.path)}
											className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
										>
											<div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
												<Icon className="w-6 h-6 text-blue-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<h4 className="font-semibold text-gray-900">{item.title}</h4>
													{item.badge && (
														<span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
															{item.badge}
														</span>
													)}
												</div>
												<p className="text-sm text-gray-600 mt-1">{item.description}</p>
											</div>
											<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
										</button>
									);
								})}
							</div>
						</div>

						{/* Estatísticas de Visualizações */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<BarChart3 className="w-5 h-5 text-blue-600" />
								Estatísticas de Visualizações
							</h3>

							{/* Cards de Estatísticas Gerais */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
									<div className="flex items-center justify-between mb-2">
										<Eye className="w-5 h-5 text-blue-600" />
										<span className="text-xs font-medium text-blue-600">Total</span>
									</div>
									<div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
									<p className="text-xs text-gray-600 mt-1">Visualizações totais</p>
								</div>

								<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
									<div className="flex items-center justify-between mb-2">
										<TrendingUp className="w-5 h-5 text-green-600" />
										<span className="text-xs font-medium text-green-600">Hoje</span>
									</div>
									<div className="text-2xl font-bold text-gray-900">{totalViewsToday}</div>
									<p className="text-xs text-gray-600 mt-1">Visualizações hoje</p>
								</div>

								<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
									<div className="flex items-center justify-between mb-2">
										<BarChart3 className="w-5 h-5 text-purple-600" />
										<span className="text-xs font-medium text-purple-600">Semana</span>
									</div>
									<div className="text-2xl font-bold text-gray-900">{totalViewsWeek}</div>
									<p className="text-xs text-gray-600 mt-1">Últimos 7 dias</p>
								</div>

								<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
									<div className="flex items-center justify-between mb-2">
										<Car className="w-5 h-5 text-orange-600" />
										<span className="text-xs font-medium text-orange-600">Mais Visto</span>
									</div>
									<div className="text-2xl font-bold text-gray-900">{averageViews}</div>
									<p className="text-xs text-gray-600 mt-1">Suzuki  Jimni</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MinhaConta;
