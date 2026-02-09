import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// URL da API - ajuste conforme necessário
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:20262';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Carregar usuário do localStorage ao iniciar
	useEffect(() => {
		const storedUser = localStorage.getItem('caxiauto_user');
		const token = localStorage.getItem('caxiauto_token');
		if (storedUser && token) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error('Erro ao carregar usuário:', error);
				localStorage.removeItem('caxiauto_user');
				localStorage.removeItem('caxiauto_token');
			}
		}
		setLoading(false);
	}, []);

	// Função para verificar email e enviar OTP
	const checkEmail = async (email) => {
		try {
			const response = await fetch(`${API_URL}/users/check-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			
			if (!response.success) {
				throw new Error(data.msg || 'Erro ao verificar email');
			}

			return { success: data.success, message: data.msg };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função para verificar código OTP
	const verifyOTP = async (email, code) => {
		try {
			const response = await fetch(`${API_URL}/users/verify-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, code }),
			});

			const data = await response.json();
			
			if (!response.success) {
				throw new Error(data.msg || 'Erro ao verificar código');
			}

			return { success: data.success, message: data.msg };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função para reenviar código OTP
	const resendOTP = async (email) => {
		try {
			const response = await fetch(`${API_URL}/users/resend-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			
			if (!response.success) {
				throw new Error(data.msg || 'Erro ao reenviar código');
			}

			return { success: data.success, message: data.msg };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função para completar o registro
	const completeRegistration = async (userData) => {
		try {
			const response = await fetch(`${API_URL}/users/complete-registration`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: userData.firstName,
					surname: userData.lastName,
					email: userData.email,
					phone: userData.phone || '',
					password: userData.password,
				}),
			});

			const data = await response.json();
			
			if (!response.success) {
				throw new Error(data.msg || 'Erro ao completar registro');
			}

			return { success: data.success, message: data.msg };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função de login
	const login = async (email, password) => {
		try {
			const response = await fetch(`${API_URL}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			
			if (!response.success) {
				throw new Error(data.msg || 'Erro ao fazer login');
			}

			// Armazenar token e dados do usuário
			const userData = {
				name: data.data.name,
				surname: data.data.surname,
				email: data.data.email,
				phone: data.data.phone,
			};

			localStorage.setItem('caxiauto_token', data.data.token);
			localStorage.setItem('caxiauto_user', JSON.stringify(userData));
			setUser(userData);

			return { success: true, message: 'Login realizado com sucesso!' };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função de logout
	const logout = () => {
		setUser(null);
		localStorage.removeItem('caxiauto_user');
		localStorage.removeItem('caxiauto_token');
	};

	// Função para atualizar dados do usuário
	const updateUser = async (updatedData) => {
		try {
			// Esta função precisará ser implementada no backend
			const token = localStorage.getItem('caxiauto_token');
			
			if (!token) {
				throw new Error('Usuário não autenticado');
			}

			// Por enquanto, atualiza apenas localmente
			// TODO: Implementar endpoint no backend para atualização de perfil
			const updatedUser = { ...user, ...updatedData };
			localStorage.setItem('caxiauto_user', JSON.stringify(updatedUser));
			setUser(updatedUser);

			return { success: true, message: 'Dados atualizados com sucesso!' };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função para obter token de autorização
	const getAuthToken = () => {
		return localStorage.getItem('caxiauto_token');
	};

	const value = {
		user,
		loading,
		login,
		checkEmail,
		verifyOTP,
		resendOTP,
		completeRegistration,
		logout,
		updateUser,
		getAuthToken,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de AuthProvider');
	}
	return context;
};
