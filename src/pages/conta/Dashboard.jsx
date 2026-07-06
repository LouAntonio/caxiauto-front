import React, { useState, useCallback, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
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
	BarChart3,
	Lock,
	Eye,
	EyeOff
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ButtonLoader from '../../components/ButtonLoader';

const Dashboard = () => {
	useDocumentTitle('Dashboard - CaxiAuto');

	const { user, logout, updateUser, refreshUser } = useAuthStore();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

	useEffect(() => {
		if (!user?.createdAt) {
			refreshUser();
		}
	}, []);
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

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = useCallback(async () => {
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
	}, [formData, saving, updateUser]);

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

			{/* Estatísticas */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-[#154c9a]" />
					Estatísticas
				</h3>

				<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200 text-center">
					<BarChart3 className="w-12 h-12 text-[#154c9a] mx-auto mb-4" />
					<h4 className="text-lg font-semibold text-[#154c9a] mb-2">Estatísticas em Breve</h4>
					<p className="text-gray-600">
						Esta funcionalidade estará disponível em breve.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
