import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const Auth = () => {
	useDocumentTitle('Entrar ou Cadastrar - CaxiAuto');

	// Inicializar Notyf
	const [notyf] = useState(() => new Notyf({
		duration: 4000,
		position: { x: 'right', y: 'top' },
		dismissible: true,
	}));

	const [isLogin, setIsLogin] = useState(true);
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	// Multi-step Registration State
	const [registrationStep, setRegistrationStep] = useState(1); // 1: Email, 2: OTP, 3: Details
	const [otp, setOtp] = useState(['', '', '', '', '', '']);

	// OTP Input Handlers
	const handleOtpChange = (index, value) => {
		if (!/^\d*$/.test(value)) return; // Only allow digits
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1); // Only keep last digit
		setOtp(newOtp);
		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	const handleOtpKeyDown = (index, e) => {
		// Handle backspace: move to previous input
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			if (prevInput) prevInput.focus();
		}
	};

	const handleOtpPaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
		if (pastedData) {
			const newOtp = [...otp];
			for (let i = 0; i < pastedData.length; i++) {
				newOtp[i] = pastedData[i];
			}
			setOtp(newOtp);
			// Focus last filled input or last input
			const focusIndex = Math.min(pastedData.length, 5);
			const targetInput = document.getElementById(`otp-${focusIndex}`);
			if (targetInput) targetInput.focus();
		}
	};

	// Password Security Functions
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
		return 4; // Forte (all 5 requirements)
	};

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
	});

	const { login, checkEmail, verifyOTP, resendOTP, completeRegistration } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/minha-conta';

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validateForm = () => {
		if (isForgotPassword) {
			if (!formData.email.includes('@')) {
				notyf.error('Digite um email válido');
				return false;
			}
			return true;
		}

		if (isLogin) {
			if (!formData.email.includes('@')) {
				notyf.error('Digite um email válido');
				return false;
			}
			if (!formData.password) {
				notyf.error('Digite sua senha');
				return false;
			}
			return true;
		}

		// Registration Steps Validation
		if (registrationStep === 1) {
			if (!formData.email.includes('@')) {
				notyf.error('Digite um email válido');
				return false;
			}
			return true;
		}

		if (registrationStep === 2) {
			const otpString = otp.join('');
			if (otpString.length !== 6) { // Assuming 6-digit OTP
				notyf.error('O código deve ter 6 dígitos');
				return false;
			}
			return true;
		}

		if (registrationStep === 3) {
			if (!formData.firstName.trim()) {
				notyf.error('Digite seu nome');
				return false;
			}
			if (!formData.lastName.trim()) {
				notyf.error('Digite seu sobrenome');
				return false;
			}
			if (formData.password !== formData.confirmPassword) {
				notyf.error('As senhas não coincidem');
				return false;
			}
			// Secure password policy
			const passwordChecks = getPasswordRequirements(formData.password);
			const allPassed = Object.values(passwordChecks).every(v => v);
			if (!allPassed) {
				notyf.error('A senha não atende aos requisitos de segurança');
				return false;
			}
			return true;
		}

		return true;
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);

		try {
			// Simula envio de email de recuperação (TODO: implementar no backend)
			await new Promise(resolve => setTimeout(resolve, 1500));
			notyf.success('Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada.');
			setFormData({ ...formData, email: '' });
		} catch (err) {
			notyf.error('Ocorreu um erro. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleSendOTP = async () => {
		setLoading(true);
		try {
			const result = await checkEmail(formData.email);
			if (result.success) {
				notyf.success(result.message);
				setRegistrationStep(2);
			} else {
				notyf.error(result.message);
			}
		} catch (err) {
			notyf.error('Erro ao enviar código. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		setLoading(true);
		try {
			const result = await resendOTP(formData.email);
			if (result.success) {
				notyf.success(result.message);
			} else {
				notyf.error(result.message);
			}
		} catch (err) {
			notyf.error('Erro ao reenviar código. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async () => {
		setLoading(true);
		try {
			const otpString = otp.join('');
			const result = await verifyOTP(formData.email, otpString);
			if (result.success) {
				notyf.success(result.message);
				setRegistrationStep(3);
			} else {
				notyf.error(result.message);
			}
		} catch (err) {
			notyf.error('Erro ao verificar código.');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isForgotPassword) {
			return handleForgotPassword(e);
		}

		if (!validateForm()) {
			return;
		}

		if (!isLogin) {
			// Registration Flow
			if (registrationStep === 1) {
				await handleSendOTP();
				return;
			}
			if (registrationStep === 2) {
				await handleVerifyOTP();
				return;
			}
			// Step 3 falls through to final registration
		}

		setLoading(true);

		try {
			if (isLogin) {
				const result = await login(formData.email, formData.password);
				if (result.success) {
					notyf.success(result.message);
					navigate(from, { replace: true });
				} else {
					notyf.error(result.message);
				}
			} else {
				// Complete registration (step 3)
				const result = await completeRegistration(formData);
				if (result.success) {
					notyf.success(result.message + ' Agora você pode fazer login!');
					// Limpar formulário e mostrar tela de login
					setFormData({
						firstName: '',
						lastName: '',
						email: '',
						password: '',
						confirmPassword: '',
						phone: '',
					});
					setOtp(['', '', '', '', '', '']);
					setRegistrationStep(1);
					setIsLogin(true);
				} else {
					notyf.error(result.message);
				}
			}
		} catch (err) {
			notyf.error('Ocorreu um erro. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setIsForgotPassword(false);
		setRegistrationStep(1); // Reset step
		setOtp(['', '', '', '', '', '']);
		setFormData({
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			phone: '',
		});
	};

	const toggleForgotPassword = () => {
		setIsForgotPassword(!isForgotPassword);
		setRegistrationStep(1);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				{/* Logo e Título */}
				<div className="text-center mb-8">
					<h2 className="mt-4 text-3xl font-bold text-gray-900">
						{isForgotPassword ? 'Recuperar senha' : (isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta')}
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						{isForgotPassword
							? 'Digite seu email para receber o link de recuperação'
							: (isLogin
								? 'Entre para acessar seu painel administrativo'
								: (registrationStep === 1 ? 'Passo 1 de 3: Informe seu email' :
									registrationStep === 2 ? 'Passo 2 de 3: Validação' :
										'Passo 3 de 3: Seus dados'))}
					</p>
				</div>

				{/* Formulário */}
				<div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
					{/* Step Indicator for Registration */}
					{!isLogin && !isForgotPassword && (
						<div className="mb-8">
							<div className="flex items-center justify-between relative">
								{/* Connecting Line Background */}
								<div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '16.67%', right: '16.67%' }} />
								{/* Connecting Line Progress */}
								<div
									className="absolute top-5 h-0.5 bg-blue-600 transition-all duration-500 ease-out"
									style={{
										left: '16.67%',
										width: registrationStep === 1 ? '0%' : registrationStep === 2 ? '33.33%' : '66.66%'
									}}
								/>

								{/* Step 1 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep > 1
											? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
											: registrationStep === 1
												? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
												: 'bg-gray-100 text-gray-400'
										}`}>
										{registrationStep > 1 ? <Check className="w-5 h-5" /> : '1'}
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors ${registrationStep >= 1 ? 'text-blue-600' : 'text-gray-400'
										}`}>Email</span>
								</div>

								{/* Step 2 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep > 2
											? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
											: registrationStep === 2
												? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
												: 'bg-gray-100 text-gray-400'
										}`}>
										{registrationStep > 2 ? <Check className="w-5 h-5" /> : '2'}
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors ${registrationStep >= 2 ? 'text-blue-600' : 'text-gray-400'
										}`}>Verificação</span>
								</div>

								{/* Step 3 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep === 3
											? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
											: 'bg-gray-100 text-gray-400'
										}`}>
										3
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors ${registrationStep >= 3 ? 'text-blue-600' : 'text-gray-400'
										}`}>Cadastro</span>
								</div>
							</div>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Login or Step 1: Email */}
						{(isLogin || isForgotPassword || registrationStep === 1) && (
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
										className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="seu@email.com"
									/>
								</div>
							</div>
						)}

						{/* Step 2: OTP */}
						{!isLogin && !isForgotPassword && registrationStep === 2 && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3 text-center">
									Código de Verificação
								</label>
								<p className="text-xs text-center text-gray-500 mb-4">Enviado para {formData.email}</p>
								<div className="flex justify-center gap-2">
									{otp.map((digit, index) => (
										<input
											key={index}
											id={`otp-${index}`}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={digit}
											onChange={(e) => handleOtpChange(index, e.target.value)}
											onKeyDown={(e) => handleOtpKeyDown(index, e)}
											onPaste={handleOtpPaste}
											className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											autoFocus={index === 0}
										/>
									))}
								</div>
								<p className="mt-4 text-xs text-center text-gray-500">
									Não recebeu? <button type="button" onClick={handleResendOTP} className="text-blue-600 hover:underline">Reenviar</button>
								</p>
							</div>
						)}

						{/* Step 3: Personal Details (Name, Surname, Phone, Password) */}
						{!isLogin && !isForgotPassword && registrationStep === 3 && (
							<>
								<div className="flex gap-4">
									<div className="flex-1">
										<label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
											Nome
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<User className="h-5 w-5 text-gray-400" />
											</div>
											<input
												id="firstName"
												name="firstName"
												type="text"
												required
												value={formData.firstName}
												onChange={handleChange}
												className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg transition-colors"
												placeholder="Nome"
											/>
										</div>
									</div>

									<div className="flex-1">
										<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
											Sobrenome
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<User className="h-5 w-5 text-gray-400" />
											</div>
											<input
												id="lastName"
												name="lastName"
												type="text"
												required
												value={formData.lastName}
												onChange={handleChange}
												className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg transition-colors"
												placeholder="Sobrenome"
											/>
										</div>
									</div>
								</div>

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
											className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg transition-colors"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>
								</div>
							</>
						)}

						{/* Login Password or Step 3 Password */}
						{!isForgotPassword && (isLogin || registrationStep === 3) && (
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
										className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg transition-colors"
										placeholder={isLogin ? "Sua senha" : "Crie uma senha segura"}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
										)}
									</button>
								</div>

								{/* Password Strength Indicator (Registration Only) */}
								{!isLogin && formData.password && (
									<div className="mt-3">
										{/* Strength Bar */}
										<div className="flex gap-1 mb-2">
											{[1, 2, 3, 4].map((level) => {
												const strength = getPasswordStrength(formData.password);
												const colors = {
													1: 'bg-red-500',
													2: 'bg-orange-500',
													3: 'bg-yellow-500',
													4: 'bg-green-500'
												};
												return (
													<div
														key={level}
														className={`h-1.5 flex-1 rounded-full transition-colors ${level <= strength ? colors[strength] : 'bg-gray-200'
															}`}
													/>
												);
											})}
										</div>
										<p className={`text-xs font-medium mb-2 ${{ 1: 'text-red-600', 2: 'text-orange-600', 3: 'text-yellow-600', 4: 'text-green-600' }[getPasswordStrength(formData.password)]
											}`}>
											{['', 'Fraca', 'Regular', 'Boa', 'Forte'][getPasswordStrength(formData.password)]}
										</p>

										{/* Requirements Checklist */}
										<div className="grid grid-cols-2 gap-1 text-xs">
											{Object.entries(getPasswordRequirements(formData.password)).map(([key, passed]) => (
												<div key={key} className={`flex items-center gap-1 ${passed ? 'text-green-600' : 'text-gray-400'}`}>
													{passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
													<span>{
														{
															minLength: '8+ caracteres',
															hasUppercase: 'Letra maiúscula',
															hasLowercase: 'Letra minúscula',
															hasNumber: 'Número',
															hasSpecial: 'Caractere especial'
														}[key]
													}</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Confirm Password (Step 3) */}
						{!isLogin && !isForgotPassword && registrationStep === 3 && (
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
										required
										value={formData.confirmPassword}
										onChange={handleChange}
										className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg transition-colors"
										placeholder="Digite a senha novamente"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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

						{/* Esqueceu a senha? */}
						{isLogin && !isForgotPassword && (
							<div className="text-right">
								<button
									type="button"
									onClick={toggleForgotPassword}
									className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
								>
									Esqueceu a senha?
								</button>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex gap-3">
							{!isLogin && !isForgotPassword && registrationStep > 1 && (
								<button
									type="button"
									onClick={() => {
										setRegistrationStep(prev => prev - 1);
										setError('');
									}}
									disabled={loading}
									className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
								>
									Voltar
								</button>
							)}

							<button
								type="submit"
								disabled={loading}
								className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer`}
							>
								{loading ? 'Processando...' :
									(isForgotPassword ? 'Enviar Link' :
										(isLogin ? 'Entrar' :
											(registrationStep === 1 ? 'Continuar' :
												registrationStep === 2 ? 'Validar Código' :
													'Criar Conta')))
								}
							</button>
						</div>
					</form>

					{/* Toggle entre Login e Cadastro */}
					<div className="mt-6 text-center space-y-2">
						{isForgotPassword ? (
							<button
								type="button"
								onClick={toggleForgotPassword}
								className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
							>
								← Voltar para o login
							</button>
						) : (
							<button
								type="button"
								onClick={toggleMode}
								className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
							>
								{isLogin
									? 'Não tem uma conta? Cadastre-se'
									: 'Já tem uma conta? Entre'}
							</button>
						)}
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
