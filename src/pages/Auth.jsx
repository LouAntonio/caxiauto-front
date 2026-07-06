import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X, Rocket, Clock, Sparkles, ArrowRight } from 'lucide-react';

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
	const [registrationStep, setRegistrationStep] = useState(0); // 0: Offer, 1: Email, 2: OTP, 3: Details

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
		hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`]/.test(password)
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
		acceptedTerms: false,
	});

	const { user, login, checkEmail, verifyOTP, resendOTP, completeRegistration, requestPasswordReset } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/minha-conta';

	useEffect(() => {
		if (user) {
			navigate(from, { replace: true });
		}
	}, [user, navigate, from]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
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
			if (!formData.acceptedTerms) {
				notyf.error('Você deve aceitar os termos de uso e política de privacidade');
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
			const result = await requestPasswordReset(formData.email);
			if (result.success) {
				notyf.success(result.message || 'Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada.');
				setFormData({ ...formData, email: '' });
				// Voltar para o login após 3 segundos
				setTimeout(() => {
					setIsForgotPassword(false);
				}, 3000);
			} else {
				notyf.error(result.message || 'Erro ao enviar link de recuperação. Tente novamente.');
			}
		} catch {
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
		} catch {
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
		} catch {
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
		} catch {
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
		} catch {
			notyf.error('Ocorreu um erro. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setIsForgotPassword(false);
		setRegistrationStep(0); // Reset step to Offer

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
		<div className="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				{/* Logo e Título */}
				<div className="text-center mb-8">
					<h2 className="mt-4 text-3xl font-bold text-[#111827] font-display">
						{isForgotPassword ? 'Recuperar senha' : (isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta')}
					</h2>
					<p className="mt-2 text-sm text-[#6b7280] font-body">
						{isForgotPassword
							? 'Digite seu email para receber o link de recuperação'
							: (isLogin
								? 'Entre para acessar seu painel administrativo'
								: (registrationStep === 0 ? 'Oferta de Lançamento Caxiauto' :
									registrationStep === 1 ? 'Passo 1 de 4: Informe seu email' :
										registrationStep === 2 ? 'Passo 2 de 4: Validação' :
											'Passo 3 de 4: Seus dados'))}
					</p>

				</div>

				{/* Formulário */}
				<div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#e5e7eb]">
					{/* Step Indicator for Registration */}
					{!isLogin && !isForgotPassword && (
						<div className="mb-8">
							<div className="flex items-center justify-between relative">
								{/* Connecting Line Background */}
								<div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '16.67%', right: '16.67%' }} />
								{/* Connecting Line Progress */}
								<div
									className="absolute top-5 h-0.5 bg-[#154c9a] transition-all duration-500 ease-out"
									style={{
										left: '12.5%',
										width: registrationStep === 0 ? '0%' : registrationStep === 1 ? '25%' : registrationStep === 2 ? '50%' : '75%'
									}}
								/>

								{/* Step 0: Offer */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep > 0
										? 'bg-[#154c9a] text-white shadow-lg shadow-[#154c9a]/20'
										: registrationStep === 0
											? 'bg-[#154c9a] text-white ring-4 ring-[#154c9a]/20 shadow-lg shadow-[#154c9a]/20'
											: 'bg-gray-100 text-gray-400'
									}`}>
										{registrationStep > 0 ? <Check className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors font-body ${registrationStep >= 0 ? 'text-[#154c9a]' : 'text-gray-400'
									}`}>Oferta</span>
								</div>

								{/* Step 1 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep > 1
										? 'bg-[#154c9a] text-white shadow-lg shadow-[#154c9a]/20'
										: registrationStep === 1
											? 'bg-[#154c9a] text-white ring-4 ring-[#154c9a]/20 shadow-lg shadow-[#154c9a]/20'
											: 'bg-gray-100 text-gray-400'
									}`}>
										{registrationStep > 1 ? <Check className="w-5 h-5" /> : '1'}
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors font-body ${registrationStep >= 1 ? 'text-[#154c9a]' : 'text-gray-400'
									}`}>Email</span>
								</div>

								{/* Step 2 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep > 2
										? 'bg-[#154c9a] text-white shadow-lg shadow-[#154c9a]/20'
										: registrationStep === 2
											? 'bg-[#154c9a] text-white ring-4 ring-[#154c9a]/20 shadow-lg shadow-[#154c9a]/20'
											: 'bg-gray-100 text-gray-400'
									}`}>
										{registrationStep > 2 ? <Check className="w-5 h-5" /> : '2'}
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors font-body ${registrationStep >= 2 ? 'text-[#154c9a]' : 'text-gray-400'
									}`}>Verificação</span>
								</div>

								{/* Step 3 */}
								<div className="flex flex-col items-center relative z-10">
									<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${registrationStep === 3
										? 'bg-[#154c9a] text-white ring-4 ring-[#154c9a]/20 shadow-lg shadow-[#154c9a]/20'
										: 'bg-gray-100 text-gray-400'
									}`}>
										3
									</div>
									<span className={`mt-2 text-xs font-medium transition-colors font-body ${registrationStep >= 3 ? 'text-[#154c9a]' : 'text-gray-400'
									}`}>Cadastro</span>
								</div>

							</div>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Step 0: Offer */}
						{!isLogin && !isForgotPassword && registrationStep === 0 && (
							<div className="space-y-6">
								<div className="bg-[#f8f6f2] p-6 rounded-2xl border border-[#e5e7eb]">
									<div className="flex items-center gap-3 mb-4">
										<Rocket className="w-8 h-8 text-[#154c9a]" />
										<h3 className="text-xl font-bold text-[#111827] font-display">Oferta de Lançamento!</h3>
									</div>
									<p className="text-[#6b7280] leading-relaxed mb-4 font-body">
										Durante os primeiros <span className="font-bold text-[#154c9a]">4 meses</span>, o registro na plataforma será <span className="font-bold text-green-600">totalmente gratuito</span>.
									</p>
									<ul className="space-y-2 mb-6">
										<li className="flex items-start gap-2 text-sm text-[#6b7280] font-body">
											<Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
											<span>Divulgue seus serviços para milhares de clientes.</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-[#6b7280] font-body">
											<Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
											<span>Ecossistema completo: Vendas, Aluguel, Peças e mais.</span>
										</li>
										<li className="flex items-start gap-2 text-sm text-[#6b7280] font-body">
											<Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
											<span>Conexão direta com clientes específicos.</span>
										</li>
									</ul>
									<Link to="/comercial" className="text-sm text-[#154c9a] font-semibold hover:underline flex items-center gap-1 font-body">
										Ver todos os benefícios e planos <ArrowRight className="w-4 h-4" />
									</Link>
								</div>
								
								<button
									type="button"
									onClick={() => setRegistrationStep(1)}
									className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-[#154c9a] hover:bg-blue-800 transition-all hover:scale-[1.02] active:scale-[0.98] font-body"
								>
									Aproveitar 4 Meses Grátis
									<ArrowRight className="w-5 h-5" />
								</button>
							</div>
						)}

						{/* Login or Step 1: Email */}
						{(isLogin || isForgotPassword || registrationStep === 1) && (

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
									Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="email"
										name="email"
										type="email"
										required
										value={formData.email}
										onChange={handleChange}
										className="block w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
										placeholder="seu@email.com"
									/>
								</div>
							</div>
						)}

						{/* Step 2: OTP */}
						{!isLogin && !isForgotPassword && registrationStep === 2 && (
							<div>
								<label className="block text-sm font-medium text-[#6b7280] mb-3 text-center font-body">
									Código de Verificação
								</label>
								<p className="text-xs text-center text-[#6b7280] mb-4 font-body">Enviado para {formData.email}</p>
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
											className="w-12 h-14 text-center text-xl font-semibold border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
											autoFocus={index === 0}
										/>
									))}
								</div>
								<p className="mt-4 text-xs text-center text-[#6b7280] font-body">
									Não recebeu? <button type="button" onClick={handleResendOTP} className="text-[#154c9a] hover:underline font-semibold">Reenviar</button>
								</p>
							</div>
						)}

						{/* Step 3: Personal Details (Name, Surname, Phone, Password) */}
						{!isLogin && !isForgotPassword && registrationStep === 3 && (
							<>
								<div className="flex gap-4">
									<div className="flex-1">
										<label htmlFor="firstName" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
											Nome
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<User className="h-5 w-5 text-gray-400" />
											</div>
											<input
												id="firstName"
												name="firstName"
												type="text"
												required
												value={formData.firstName}
												onChange={handleChange}
												className="block w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
												placeholder="Nome"
											/>
										</div>
									</div>

									<div className="flex-1">
										<label htmlFor="lastName" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
											Sobrenome
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<User className="h-5 w-5 text-gray-400" />
											</div>
											<input
												id="lastName"
												name="lastName"
												type="text"
												required
												value={formData.lastName}
												onChange={handleChange}
												className="block w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
												placeholder="Sobrenome"
											/>
										</div>
									</div>
								</div>

								<div>
									<label htmlFor="phone" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
										Telefone (Opcional)
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
											<Phone className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="phone"
											name="phone"
											type="tel"
											value={formData.phone}
											onChange={handleChange}
											className="block w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>
								</div>
							</>
						)}

						{/* Login Password or Step 3 Password */}
						{!isForgotPassword && (isLogin || registrationStep === 3) && (
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
									Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										required
										value={formData.password}
										onChange={handleChange}
										className="block w-full pl-10 pr-10 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
										placeholder={isLogin ? "Sua senha" : "Crie uma senha segura"}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-[#154c9a]" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-[#154c9a]" />
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
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-[#6b7280] mb-1 font-body">
									Confirmar Senha
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										required
										value={formData.confirmPassword}
										onChange={handleChange}
										className="block w-full pl-10 pr-10 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
										placeholder="Digite a senha novamente"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-[#154c9a]" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-[#154c9a]" />
										)}
									</button>
								</div>

								<div className="flex items-start gap-3 pt-2">
									<div className="flex items-center h-5">
										<input
											id="acceptedTerms"
											name="acceptedTerms"
											type="checkbox"
											checked={formData.acceptedTerms}
											onChange={handleChange}
											required
											className="h-4 w-4 text-[#154c9a] border-[#e5e7eb] rounded cursor-pointer"
										/>
									</div>
									<div className="text-sm">
										<label htmlFor="acceptedTerms" className="text-[#6b7280] cursor-pointer font-body">
											Li e aceito as <Link to="/politica-de-privacidade" target="_blank" className="text-[#154c9a] font-semibold hover:underline">Políticas de Privacidade</Link> e os <Link to="/termos-de-uso" target="_blank" className="text-[#154c9a] font-semibold hover:underline">Termos de Uso</Link>.
										</label>
									</div>
								</div>
							</div>
						)}

						{/* Esqueceu a senha? */}
						{isLogin && !isForgotPassword && (
							<div className="text-right">
								<button
									type="button"
									onClick={toggleForgotPassword}
									className="text-sm text-[#154c9a] hover:text-blue-800 font-medium cursor-pointer font-body"
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
									}}

									disabled={loading}
									className="flex-1 py-3 px-4 border border-[#e5e7eb] rounded-2xl shadow-sm text-sm font-semibold text-[#6b7280] bg-white hover:bg-[#f8f6f2] transition-colors cursor-pointer font-body"
								>
									Voltar
								</button>
							)}

							{(isLogin || isForgotPassword || registrationStep > 0) && (
								<button
									type="submit"
									disabled={loading}
									className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-[#154c9a] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-body`}
								>
									{loading ? 'Processando...' :
										(isForgotPassword ? 'Enviar Link' :
											(isLogin ? 'Entrar' :
												(registrationStep === 1 ? 'Continuar' :
													registrationStep === 2 ? 'Validar Código' :
														'Criar Conta')))
									}
								</button>
							)}

						</div>
					</form>

					{/* Toggle entre Login e Cadastro */}
					<div className="mt-6 text-center space-y-2">
						{isForgotPassword ? (
							<button
								type="button"
								onClick={toggleForgotPassword}
								className="text-sm text-[#154c9a] hover:text-blue-800 font-medium cursor-pointer font-body"
							>
								← Voltar para o login
							</button>
						) : (
							<button
								type="button"
								onClick={toggleMode}
								className="text-sm text-[#154c9a] hover:text-blue-800 font-medium cursor-pointer font-body"
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
						className="text-sm text-[#6b7280] hover:text-[#154c9a] flex items-center justify-center gap-1 font-body"
					>
						← Voltar para o site
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Auth;
