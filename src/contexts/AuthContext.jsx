import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

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
		const data = await api.checkEmail(email);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao verificar email' };
		}
		return { success: true, message: data.msg };
	};

	// Função para verificar código OTP
	const verifyOTP = async (email, code) => {
		const data = await api.verifyOTP(email, code);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao verificar código' };
		}
		return { success: true, message: data.msg };
	};

	// Função para reenviar código OTP
	const resendOTP = async (email) => {
		const data = await api.resendOTP(email);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao reenviar código' };
		}
		return { success: true, message: data.msg };
	};

	// Função para completar o registro
	const completeRegistration = async (userData) => {
		const data = await api.completeRegistration({
			name: userData.firstName,
			surname: userData.lastName,
			email: userData.email,
			phone: userData.phone || '',
			password: userData.password,
		});

		if (!data.success) {
			console.log('Erro ao completar registro:', data);
			return { success: false, message: data.msg || 'Erro ao completar registro' };
		}
		return { success: true, message: data.msg };
	};

	// Função de login
	const login = async (email, password) => {
		const data = await api.login(email, password);

		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao fazer login' };
		}

		// Armazenar token e dados do usuário
		const userData = {
			id: data.data.id,
			name: data.data.name,
			surname: data.data.surname,
			email: data.data.email,
			phone: data.data.phone,
			role: data.data.role,
			status: data.data.status,
			isVerified: data.data.isVerified,
			createdAt: data.data.createdAt,
		};

		localStorage.setItem('caxiauto_token', data.data.token);
		localStorage.setItem('caxiauto_user', JSON.stringify(userData));
		setUser(userData);

		return { success: true, message: 'Login realizado com sucesso!' };
	};

	// Função de logout
	const logout = () => {
		setUser(null);
		localStorage.removeItem('caxiauto_user');
		localStorage.removeItem('caxiauto_token');
	};

	// Função para solicitar recuperação de senha
	const requestPasswordReset = async (email) => {
		const data = await api.requestPasswordReset(email);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao solicitar recuperação de senha' };
		}
		return { success: true, message: data.msg };
	};

	// Função para resetar a senha
	const resetPassword = async (email, token, newPassword) => {
		const data = await api.resetPassword(email, token, newPassword);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao resetar senha' };
		}
		return { success: true, message: data.msg };
	};

	// Função para atualizar dados do usuário
	const updateUser = async (updatedData) => {
		try {
			const token = localStorage.getItem('caxiauto_token');
			if (!token) {
				throw new Error('Usuário não autenticado');
			}

			const response = await api.updateProfile(updatedData);
			
			if (!response.success) {
				return { success: false, message: response.msg || 'Erro ao atualizar perfil' };
			}

			const updatedUser = { ...user, ...updatedData };
			localStorage.setItem('caxiauto_user', JSON.stringify(updatedUser));
			setUser(updatedUser);

			return { success: true, message: 'Perfil atualizado com sucesso!' };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	// Função para obter token de autorização
	const getAuthToken = () => {
		return localStorage.getItem('caxiauto_token');
	};

	// Função para verificar se o usuário está realmente logado no servidor
	const checkIsLoggedIn = async () => {
		try {
			const data = await api.isLoggedIn();
			return data.success === true;
		} catch (error) {
			console.error('Erro ao verificar login:', error);
			return false;
		}
	};

	// Função para recarregar dados do usuário
	const refreshUser = async () => {
		try {
			const data = await api.getProfile();
			if (data.success) {
				const userData = {
					id: data.data.id,
					name: data.data.name,
					surname: data.data.surname,
					email: data.data.email,
					phone: data.data.phone,
					role: data.data.role,
					status: data.data.status,
					isVerified: data.data.isVerified,
					provincia: data.data.provincia,
					municipio: data.data.municipio,
					createdAt: data.data.createdAt,
				};
				localStorage.setItem('caxiauto_user', JSON.stringify(userData));
				setUser(userData);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Erro ao recarregar usuário:', error);
			return false;
		}
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
		requestPasswordReset,
		resetPassword,
		updateUser,
		getAuthToken,
		checkIsLoggedIn,
		refreshUser,
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
