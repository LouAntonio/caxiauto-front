import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
	User,
	Mail,
	Phone,
	LogOut,
	Edit2,
	Save,
	X,
	Calendar,
	Eye,
	TrendingUp,
	BarChart3,
	Car
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Dashboard = () => {
	useDocumentTitle('Dashboard - CaxiAuto');

	const { user, logout, updateUser } = useAuth();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [message, setMessage] = useState('');
	const [formData, setFormData] = useState({
		name: user?.name || '',
		surname: user?.surname || '',
		email: user?.email || '',
		phone: user?.phone || '',
	});

	// Estados para estatísticas de visualização
	const [viewStats, setViewStats] = useState({
		totalViews: 0,
		totalViewsToday: 0,
		mostViewed: null,
		loading: true,
	});

	// Carregar estatísticas de visualização
	useEffect(() => {
		const fetchViewStats = async () => {
			try {
				const [totalResponse, todayResponse, mostViewedResponse] = await Promise.all([
					api.getTotalViews(),
					api.getTotalViewsToday(),
					api.getMostViewed(),
				]);

				setViewStats({
					totalViews: totalResponse?.totalViews || 0,
					totalViewsToday: todayResponse?.totalViewsToday || 0,
					mostViewed: mostViewedResponse?.mostViewed || null,
					loading: false,
				});
			} catch (error) {
				console.error('Erro ao carregar estatísticas de visualização:', error);
				setViewStats(prev => ({ ...prev, loading: false }));
			}
		};

		if (user) {
			fetchViewStats();
		}
	}, [user]);

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
			surname: user?.surname || '',
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

	// Função auxiliar para determinar o nome do item mais visto
	const getMostViewedName = () => {
		if (!viewStats.mostViewed) return 'N/A';
		
		const { marca, modelo, nome, title } = viewStats.mostViewed;
		
		// Para veículos (compra ou aluguel)
		if (marca && modelo) {
			return `${marca} ${modelo}`;
		}
		
		// Para peças
		if (nome || title) {
			return nome || title;
		}
		
		return 'N/A';
	};

	return (
		<div className="space-y-6">
			{/* Mensagem de feedback */}
			{message && (
				<div className={`p-4 rounded-lg ${message.includes('sucesso')
					? 'bg-green-50 border border-green-200 text-green-700'
					: 'bg-red-50 border border-red-200 text-red-700'
					}`}>
					{message}
				</div>
			)}

			{/* Informações do Perfil */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{/* Header do Card */}
				<div className="bg-gradient-to-r from-[#154c9a] to-[#123f80] p-6 text-white">
					<div className="flex items-center gap-4">
						<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
							<User className="w-10 h-10 text-[#154c9a]" />
						</div>
						<div>
							<h2 className="text-2xl font-bold">{user?.name} {user?.surname}</h2>
							<p className="text-blue-100">{user?.email}</p>
						</div>
					</div>
				</div>

				{/* Informações */}
				<div className="p-6">
					{isEditing ? (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nome
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Sobrenome
								</label>
								<input
									type="text"
									name="surname"
									value={formData.surname}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
									className="w-full px-4 py-2 border border-gray-300 rounded-lg"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									onClick={handleSave}
									className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] transition-colors flex items-center justify-center gap-2 cursor-pointer"
								>
									<Save className="w-4 h-4" />
									Salvar
								</button>
								<button
									onClick={handleCancel}
									className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
								>
									<X className="w-4 h-4" />
									Cancelar
								</button>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-xs text-gray-500">Nome Completo</p>
										<p className="text-sm font-medium text-gray-900">{user?.name} {user?.surname}</p>
									</div>
								</div>

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
							</div>

							<div className="flex gap-3 pt-4 border-t">
								<button
									onClick={() => setIsEditing(true)}
									className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
								>
									<Edit2 className="w-4 h-4" />
									Editar Perfil
								</button>
								<button
									onClick={handleLogout}
									className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
								>
									<LogOut className="w-4 h-4" />
									Sair
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Estatísticas de Visualizações */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-[#154c9a]" />
					Estatísticas de Visualizações
				</h3>

				{/* Cards de Estatísticas Gerais */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 cursor-pointer">
						<div className="flex items-center justify-between mb-2">
							<Eye className="w-5 h-5 text-blue-600" />
							<span className="text-xs font-medium text-blue-600">Total</span>
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{viewStats.loading ? '...' : viewStats.totalViews.toLocaleString('pt-BR')}
						</div>
						<p className="text-xs text-gray-600 mt-1">Visualizações totais</p>
					</div>

					<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 cursor-pointer">
						<div className="flex items-center justify-between mb-2">
							<BarChart3 className="w-5 h-5 text-purple-600" />
							<span className="text-xs font-medium text-green-600">Hoje</span>
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{viewStats.loading ? '...' : viewStats.totalViewsToday.toLocaleString('pt-BR')}
						</div>
						<p className="text-xs text-gray-600 mt-1">Visualizações hoje</p>
					</div>

					<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 cursor-pointer">
						<div className="flex items-center justify-between mb-2">
							<Car className="w-5 h-5 text-orange-600" />
							<span className="text-xs font-medium text-orange-600">Mais Visto</span>
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{viewStats.loading ? '...' : (viewStats.mostViewed?.viewCount || 0).toLocaleString('pt-BR')}
						</div>
						<p className="text-xs text-gray-600 mt-1 truncate" title={getMostViewedName()}>
							{viewStats.loading ? 'Carregando...' : getMostViewedName()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
