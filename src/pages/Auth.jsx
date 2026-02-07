import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Auth = () => {
	useDocumentTitle('Entrar ou Cadastrar - CaxiAuto');

	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
	});

	const { login, register } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/minha-conta';

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError('');
	};

	const validateForm = () => {
		if (!isLogin) {
			if (!formData.name.trim()) {
				setError('Digite seu nome completo');
				return false;
			}
			if (formData.password !== formData.confirmPassword) {
				setError('As senhas não coincidem');
				return false;
			}
			if (formData.password.length < 6) {
				setError('A senha deve ter pelo menos 6 caracteres');
				return false;
			}
		}

		if (!formData.email.includes('@')) {
			setError('Digite um email válido');
			return false;
		}

		if (!formData.password) {
			setError('Digite sua senha');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			if (isLogin) {
				const result = await login(formData.email, formData.password);
				if (result.success) {
					navigate(from, { replace: true });
				} else {
					setError(result.error);
				}
			} else {
				const result = await register(formData);
				if (result.success) {
					navigate(from, { replace: true });
				} else {
					setError(result.error);
				}
			}
		} catch (err) {
			setError('Ocorreu um erro. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setError('');
		setFormData({
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			phone: '',
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				{/* Logo e Título */}
				<div className="text-center mb-8">
					<Link to="/" className="inline-block">
						<h1 className="text-4xl font-bold text-blue-600">CaxiAuto</h1>
					</Link>
					<h2 className="mt-4 text-3xl font-bold text-gray-900">
						{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						{isLogin
							? 'Entre para acessar seu painel administrativo'
							: 'Cadastre-se para gerenciar seus anúncios e serviços'}
					</p>
				</div>

				{/* Formulário */}
				<div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Mensagem de erro */}
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 animate-shake">
								<AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						{/* Nome (apenas no cadastro) */}
						{!isLogin && (
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
									Nome Completo
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="name"
										name="name"
										type="text"
										required={!isLogin}
										value={formData.name}
										onChange={handleChange}
										className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										placeholder="Seu nome completo"
									/>
								</div>
							</div>
						)}

						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="seu@email.com"
								/>
							</div>
						</div>

						{/* Telefone (apenas no cadastro) */}
						{!isLogin && (
							<div>
								<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
									Telefone (Opcional)
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Phone className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="phone"
										name="phone"
										type="tel"
										value={formData.phone}
										onChange={handleChange}
										className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										placeholder="(00) 00000-0000"
									/>
								</div>
							</div>
						)}

						{/* Senha */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
								Senha
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
									className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
						</div>

						{/* Confirmar Senha (apenas no cadastro) */}
						{!isLogin && (
							<div>
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
									Confirmar Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										required={!isLogin}
										value={formData.confirmPassword}
										onChange={handleChange}
										className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										placeholder="Digite a senha novamente"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
										)}
									</button>
								</div>
							</div>
						)}

						{/* Botão de Submit */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
						</button>
					</form>

					{/* Toggle entre Login e Cadastro */}
					<div className="mt-6 text-center">
						<button
							type="button"
							onClick={toggleMode}
							className="text-sm text-blue-600 hover:text-blue-700 font-medium"
						>
							{isLogin
								? 'Não tem uma conta? Cadastre-se'
								: 'Já tem uma conta? Entre'}
						</button>
					</div>
				</div>

				{/* Link para voltar */}
				<div className="mt-6 text-center">
					<Link
						to="/"
						className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
					>
						← Voltar para o site
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Auth;
