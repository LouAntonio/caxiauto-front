import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api, { notyf } from '../../services/api';
import {
	User,
	Mail,
	Phone,
	LogOut,
	Edit2,
	Save,
	X,
	Calendar,
	BarChart3,
	Lock,
	Eye,
	EyeOff,
	Link2,
	Unlink2,
	CheckCircle,
	AlertCircle,
	Store,
	ArrowRight
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ButtonLoader from '../../components/ButtonLoader';

const Dashboard = () => {
	useDocumentTitle('Dashboard - CaxiAuto');

	const { user, logout, updateUser, refreshUser } = useAuthStore();
	const [stats, setStats] = useState(null);
	const [loadingStats, setLoadingStats] = useState(true);

	useEffect(() => {
		api.getUserDashboardStats()
			.then((res) => {
				if (res.success) setStats(res.data);
			})
			.catch(() => {})
			.finally(() => setLoadingStats(false));
	}, []);
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
	const [googleLoading, setGoogleLoading] = useState(false);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);
	const [message, setMessage] = useState('');
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		surname: user?.surname || '',
		email: user?.email || '',
		phone: user?.phone || '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleGoogleLink = async (credentialResponse) => {
		setGoogleLoading(true);
		try {
			const result = await api.linkGoogle(credentialResponse.credential);
			if (result.success) {
				notyf.success('Conta Google vinculada com sucesso!');
				refreshUser();
			} else {
				notyf.error(result.message || 'Erro ao vincular Google.');
			}
		} catch {
			notyf.error('Erro ao vincular Google.');
		} finally {
			setGoogleLoading(false);
		}
	};

	const handleGoogleUnlink = async () => {
		setGoogleLoading(true);
		try {
			const result = await api.unlinkGoogle();
			if (result.success) {
				notyf.success('Conta Google desvinculada com sucesso!');
				refreshUser();
			} else {
				notyf.error(result.message || 'Erro ao desvincular Google.');
			}
		} catch {
			notyf.error('Erro ao desvincular Google.');
		} finally {
			setGoogleLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = async () => {
		if (saving) return;
		if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
			setMessage('As novas senhas não coincidem');
			setTimeout(() => setMessage(''), 3000);
			return;
		}
		setSaving(true);
		try {
			const payload = { ...formData };
			if (!payload.newPassword) {
				delete payload.currentPassword;
				delete payload.newPassword;
			}
			delete payload.confirmPassword;
			if (!user?.hasPassword) {
				delete payload.currentPassword;
			}
			const result = await updateUser(payload);
			if (result.success) {
				setMessage('Dados atualizados com sucesso!');
				setIsEditing(false);
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage(result.message || 'Erro ao atualizar dados');
				setTimeout(() => setMessage(''), 5000);
			}
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			name: user?.name || '',
			surname: user?.surname || '',
			email: user?.email || '',
			phone: user?.phone || '',
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
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
							{!user?.hasPassword && (
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
									Defina uma senha para também poder fazer login com email e senha.
								</div>
							)}

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

							<hr className="border-gray-200" />

							{user?.hasPassword && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Senha Atual
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-4 w-4 text-gray-400" />
										</div>
										<input
											type={showPwd.current ? "text" : "password"}
											name="currentPassword"
											value={formData.currentPassword}
											onChange={handleChange}
											placeholder="Sua senha atual"
											className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
										/>
										<button
											type="button"
											onClick={() => setShowPwd(s => ({ ...s, current: !s.current }))}
											className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
										>
											{showPwd.current ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
										</button>
									</div>
								</div>
							)}

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nova Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 text-gray-400" />
									</div>
									<input
										type={showPwd.new ? "text" : "password"}
										name="newPassword"
										value={formData.newPassword}
										onChange={handleChange}
										placeholder="Deixe em branco para manter"
										className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
									/>
									<button
										type="button"
										onClick={() => setShowPwd(s => ({ ...s, new: !s.new }))}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
									>
										{showPwd.new ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirmar Nova Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 text-gray-400" />
									</div>
									<input
										type={showPwd.confirm ? "text" : "password"}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Repita a nova senha"
										className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
									/>
									<button
										type="button"
										onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
									>
										{showPwd.confirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
									</button>
								</div>
							</div>

							<div className="flex gap-3 pt-4">
								<ButtonLoader
									loading={saving}
									loadingText="Salvando..."
									onClick={handleSave}
									variant="primary"
									className="flex-1"
								>
									<Save className="w-4 h-4" />
									Salvar
								</ButtonLoader>
								<ButtonLoader
									onClick={handleCancel}
									variant="gray"
									className="flex-1"
								>
									<X className="w-4 h-4" />
									Cancelar
								</ButtonLoader>
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
								<ButtonLoader
									onClick={() => setIsEditing(true)}
									variant="gray"
									className="flex-1"
								>
									<Edit2 className="w-4 h-4" />
									Editar Perfil
								</ButtonLoader>
								<ButtonLoader
									onClick={handleLogout}
									variant="red_outline"
									className="flex-1"
								>
									<LogOut className="w-4 h-4" />
									Sair
								</ButtonLoader>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Contas Vinculadas */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-100">
					<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Link2 className="w-5 h-5 text-[#154c9a]" />
						Contas Vinculadas
					</h3>
				</div>
				<div className="px-6 py-5">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
							</div>
							<div>
								<p className="font-medium text-gray-900">Google</p>
								{user?.googleId ? (
									<p className="text-sm text-green-600 flex items-center gap-1">
										<CheckCircle className="w-3.5 h-3.5" /> Vinculado
									</p>
								) : (
									<p className="text-sm text-gray-500">Não vinculado</p>
								)}
							</div>
						</div>
						<div>
							{user?.googleId ? (
								<ButtonLoader
									loading={googleLoading}
									onClick={handleGoogleUnlink}
									variant="red_outline"
									className="text-sm"
								>
									<Unlink2 className="w-4 h-4" />
									Desvincular
								</ButtonLoader>
							) : (
								<GoogleLogin
									onSuccess={handleGoogleLink}
									onError={() => notyf.error('Erro ao vincular Google.')}
									theme="outline"
									size="medium"
									text="signin_with"
									shape="pill"
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Minha Loja */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
					<div className="flex items-center gap-3">
						<div className="w-11 h-11 bg-[#154c9a] rounded-lg flex items-center justify-center flex-shrink-0">
							<Store className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="font-semibold text-lg text-gray-900">
								{user?.role === 'SELLER' || user?.sellerDocs ? 'Minha Loja' : 'Torne-se vendedor'}
							</h3>
							<p className="text-sm text-gray-500">
								{user?.role === 'SELLER' || user?.sellerDocs
									? 'Gerencia os teus veículos, peças, documentos e assinaturas.'
									: 'Vende veículos e peças com o selo de confiança Caxiauto.'}
							</p>
						</div>
					</div>
					<Link
						to="/minha-loja"
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#154c9a] text-white rounded-lg font-semibold text-sm hover:bg-[#123f80] transition-colors"
					>
						{user?.role === 'SELLER' || user?.sellerDocs ? 'Abrir Minha Loja' : 'Começar'}
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>

			{/* Estatísticas */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-[#154c9a]" />
					Estatísticas
				</h3>

				{loadingStats ? (
					<div className="text-center py-8 text-gray-500">A carregar...</div>
				) : stats ? (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div className="bg-purple-50 rounded-lg p-4 text-center">
							<p className="text-2xl font-bold text-purple-700">{stats.totalReservas}</p>
							<p className="text-sm text-gray-600">Minhas Reservas</p>
						</div>
						<div className="bg-red-50 rounded-lg p-4 text-center">
							<p className="text-2xl font-bold text-red-700">{stats.totalDenuncias}</p>
							<p className="text-sm text-gray-600">Denúncias</p>
						</div>
						<div className="bg-yellow-50 rounded-lg p-4 text-center">
							<p className="text-2xl font-bold text-yellow-700">{stats.totalFavoritos}</p>
							<p className="text-sm text-gray-600">Favoritos</p>
						</div>
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">Erro ao carregar estatísticas.</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
