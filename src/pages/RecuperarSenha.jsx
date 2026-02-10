import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const RecuperarSenha = () => {
	useDocumentTitle('Recuperar Senha - CaxiAuto');

	const [notyf] = useState(() => new Notyf({
		duration: 4000,
		position: { x: 'right', y: 'top' },
		dismissible: true,
	}));

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { resetPassword } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tokenValid, setTokenValid] = useState(true);

	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});

	const email = searchParams.get('email');
	const token = searchParams.get('token');

	useEffect(() => {
		// Verificar se os parâmetros existem
		if (!email || !token) {
			notyf.error('Link de recuperação inválido');
			setTokenValid(false);
			setTimeout(() => navigate('/auth'), 3000);
		}
	}, [email, token, navigate, notyf]);

	// Funções de validação de senha
	const getPasswordRequirements = (password) => ({
		minLength: password.length >= 8,
		hasUppercase: /[A-Z]/.test(password),
		hasLowercase: /[a-z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)
	});

	const getPasswordStrength = (password) => {
		const requirements = getPasswordRequirements(password);
		const passedCount = Object.values(requirements).filter(Boolean).length;
		if (passedCount <= 1) return 1; // Fraca
		if (passedCount <= 2) return 2; // Regular
		if (passedCount <= 4) return 3; // Boa
		return 4; // Forte
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validateForm = () => {
		if (!formData.password) {
			notyf.error('Digite sua nova senha');
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			notyf.error('As senhas não coincidem');
			return false;
		}

		const passwordChecks = getPasswordRequirements(formData.password);
		const allPassed = Object.values(passwordChecks).every(v => v);
		if (!allPassed) {
			notyf.error('A senha não atende aos requisitos de segurança');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);

		try {
			const result = await resetPassword(email, token, formData.password);
			if (result.success) {
				notyf.success(result.message || 'Senha alterada com sucesso!');
				setFormData({ password: '', confirmPassword: '' });
				// Redirecionar para login após 2 segundos
				setTimeout(() => {
					navigate('/auth');
				}, 2000);
			} else {
				notyf.error(result.message || 'Erro ao alterar senha. Tente novamente.');
			}
		} catch (err) {
			notyf.error('Ocorreu um erro. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	if (!tokenValid) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<X className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h2>
					<p className="text-gray-600 mb-6">
						O link de recuperação de senha é inválido ou expirou.
					</p>
					<Link 
						to="/auth" 
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Voltar para Login
					</Link>
				</div>
			</div>
		);
	}

	const passwordRequirements = getPasswordRequirements(formData.password);
	const passwordStrength = getPasswordStrength(formData.password);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Lock className="w-8 h-8 text-blue-600" />
					</div>
					<h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Nova Senha</h2>
					<p className="text-gray-600">
						Digite sua nova senha abaixo
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Campo de Nova Senha */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nova Senha
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								placeholder="Digite sua nova senha"
								required
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

						{/* Indicador de Força da Senha */}
						{formData.password && (
							<div className="mt-2">
								<div className="flex gap-1 mb-2">
									{[1, 2, 3, 4].map((level) => (
										<div
											key={level}
											className={`h-1 flex-1 rounded-full transition-colors ${
												passwordStrength >= level
													? level === 1
														? 'bg-red-500'
														: level === 2
														? 'bg-orange-500'
														: level === 3
														? 'bg-yellow-500'
														: 'bg-green-500'
													: 'bg-gray-200'
											}`}
										/>
									))}
								</div>
								<p className="text-xs text-gray-600">
									Força da senha:{' '}
									<span
										className={`font-medium ${
											passwordStrength === 1
												? 'text-red-600'
												: passwordStrength === 2
												? 'text-orange-600'
												: passwordStrength === 3
												? 'text-yellow-600'
												: 'text-green-600'
										}`}
									>
										{passwordStrength === 1
											? 'Fraca'
											: passwordStrength === 2
											? 'Regular'
											: passwordStrength === 3
											? 'Boa'
											: 'Forte'}
									</span>
								</p>
							</div>
						)}

						{/* Requisitos da Senha */}
						{formData.password && (
							<div className="mt-3 space-y-1">
								<p className="text-xs font-medium text-gray-700 mb-1">A senha deve conter:</p>
								{Object.entries({
									minLength: 'Pelo menos 8 caracteres',
									hasUppercase: 'Uma letra maiúscula',
									hasLowercase: 'Uma letra minúscula',
									hasNumber: 'Um número',
									hasSpecial: 'Um caractere especial (!@#$%...)',
								}).map(([key, label]) => (
									<div key={key} className="flex items-center gap-2">
										{passwordRequirements[key] ? (
											<Check className="w-4 h-4 text-green-500 flex-shrink-0" />
										) : (
											<X className="w-4 h-4 text-red-500 flex-shrink-0" />
										)}
										<span
											className={`text-xs ${
												passwordRequirements[key] ? 'text-green-700' : 'text-gray-600'
											}`}
										>
											{label}
										</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Campo de Confirmar Senha */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Confirmar Nova Senha
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								placeholder="Confirme sua nova senha"
								required
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

						{/* Indicador de Senhas Correspondentes */}
						{formData.confirmPassword && (
							<div className="mt-2">
								{formData.password === formData.confirmPassword ? (
									<div className="flex items-center gap-2 text-green-600">
										<Check className="w-4 h-4" />
										<span className="text-xs">As senhas coincidem</span>
									</div>
								) : (
									<div className="flex items-center gap-2 text-red-600">
										<X className="w-4 h-4" />
										<span className="text-xs">As senhas não coincidem</span>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Botão de Submit */}
					<button
						type="submit"
						disabled={loading}
						className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all cursor-pointer ${
							loading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
						}`}
					>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Alterando senha...</span>
							</div>
						) : (
							'Alterar Senha'
						)}
					</button>

					{/* Link para voltar ao login */}
					<div className="text-center">
						<Link
							to="/auth"
							className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
						>
							Voltar para o Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RecuperarSenha;
