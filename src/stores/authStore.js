import { create } from 'zustand';
import api from '../services/api';

const getStoredUser = () => {
	try {
		const stored = localStorage.getItem('caxiauto_user');
		const token = localStorage.getItem('caxiauto_token');
		if (stored && token) return JSON.parse(stored);
	} catch {
		localStorage.removeItem('caxiauto_user');
		localStorage.removeItem('caxiauto_token');
	}
	return null;
};

const useAuthStore = create((set, get) => ({
	user: getStoredUser(),
	loading: false,

	isAuthenticated: () => !!get().user,

	login: async (email, password) => {
		const data = await api.login(email, password);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao fazer login' };
		}
		const userData = {
			id: data.data.id,
			name: data.data.name,
			surname: data.data.surname,
			email: data.data.email,
			phone: data.data.phone,
			role: data.data.role,
			status: data.data.status,
			isVerified: data.data.isVerified,
			googleId: data.data.googleId,
			createdAt: data.data.createdAt,
		};
		localStorage.setItem('caxiauto_token', data.data.token);
		localStorage.setItem('caxiauto_user', JSON.stringify(userData));
		set({ user: userData });
		return { success: true, message: 'Login realizado com sucesso!' };
	},

	logout: () => {
		set({ user: null });
		localStorage.removeItem('caxiauto_user');
		localStorage.removeItem('caxiauto_token');
	},

	checkEmail: async (email) => {
		const data = await api.checkEmail(email);
		if (!data.success) return { success: false, message: data.msg || 'Erro ao verificar email' };
		return { success: true, message: data.msg };
	},

	verifyOTP: async (email, code) => {
		const data = await api.verifyOTP(email, code);
		if (!data.success) return { success: false, message: data.msg || 'Erro ao verificar código' };
		return { success: true, message: data.msg };
	},

	resendOTP: async (email) => {
		const data = await api.resendOTP(email);
		if (!data.success) return { success: false, message: data.msg || 'Erro ao reenviar código' };
		return { success: true, message: data.msg };
	},

	completeRegistration: async (userData) => {
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
	},

	requestPasswordReset: async (email) => {
		const data = await api.requestPasswordReset(email);
		if (!data.success) return { success: false, message: data.msg || 'Erro ao solicitar recuperação de senha' };
		return { success: true, message: data.msg };
	},

	resetPassword: async (email, token, newPassword) => {
		const data = await api.resetPassword(email, token, newPassword);
		if (!data.success) return { success: false, message: data.msg || 'Erro ao resetar senha' };
		return { success: true, message: data.msg };
	},

	updateUser: async (updatedData) => {
		try {
			const token = localStorage.getItem('caxiauto_token');
			if (!token) throw new Error('Usuário não autenticado');
			const payload = { ...updatedData };
			delete payload.confirmPassword;
			const response = await api.updateProfile(payload);
			if (!response.success) return { success: false, message: response.msg || 'Erro ao atualizar perfil' };
			const { user: currentUser } = get();
			const serverData = response.data || {};
			const updatedUser = { ...currentUser, ...serverData };
			['currentPassword', 'newPassword', 'confirmPassword'].forEach(k => delete updatedUser[k]);
			localStorage.setItem('caxiauto_user', JSON.stringify(updatedUser));
			set({ user: updatedUser });
			return { success: true, message: 'Perfil atualizado com sucesso!' };
		} catch (error) {
			return { success: false, message: error.message || 'Erro ao atualizar perfil' };
		}
	},

	getAuthToken: () => localStorage.getItem('caxiauto_token'),

	googleLogin: async (credential) => {
		const data = await api.googleLogin(credential);
		if (!data.success) {
			return { success: false, message: data.msg || 'Erro ao fazer login com Google' };
		}
		const userData = {
			id: data.data.id,
			name: data.data.name,
			surname: data.data.surname,
			email: data.data.email,
			phone: data.data.phone,
			role: data.data.role,
			status: data.data.status,
			isVerified: data.data.isVerified,
			googleId: data.data.googleId,
			createdAt: data.data.createdAt,
		};
		localStorage.setItem('caxiauto_token', data.data.token);
		localStorage.setItem('caxiauto_user', JSON.stringify(userData));
		set({ user: userData });
		return { success: true, message: 'Login realizado com sucesso!' };
	},

	checkIsLoggedIn: async () => {
		try {
			const data = await api.isLoggedIn();
			return data.success === true;
		} catch (error) {
			console.error('Erro ao verificar login:', error);
			return false;
		}
	},

	refreshUser: async () => {
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
				googleId: data.data.googleId,
				provincia: data.data.provincia,
				municipio: data.data.municipio,
				createdAt: data.data.createdAt,
			};
				localStorage.setItem('caxiauto_user', JSON.stringify(userData));
				set({ user: userData });
				return true;
			}
			return false;
		} catch (error) {
			console.error('Erro ao recarregar usuário:', error);
			return false;
		}
	},
}));

export default useAuthStore;
