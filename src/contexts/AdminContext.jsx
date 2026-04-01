import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
	const [admin, setAdmin] = useState(null);
	const [loading, setLoading] = useState(true);

	// Carregar admin do localStorage ao iniciar
	useEffect(() => {
		const loadAdminFromStorage = () => {
			const storedAdmin = localStorage.getItem('caxiauto_admin');
			const token = localStorage.getItem('caxiauto_admin_token');
			if (storedAdmin && token) {
				try {
					const adminData = JSON.parse(storedAdmin);
					setAdmin(adminData);
				} catch (error) {
					console.error('Erro ao carregar admin:', error);
					localStorage.removeItem('caxiauto_admin');
					localStorage.removeItem('caxiauto_admin_token');
				}
			}
		};

		loadAdminFromStorage();
		setLoading(false);

		// Listener para atualizar quando o localStorage mudar
		const handleStorageChange = (e) => {
			if (e.key === 'caxiauto_admin_token' || e.key === 'caxiauto_admin') {
				loadAdminFromStorage();
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	// Função de login admin
	const login = async (email, password) => {
		try {
			const data = await api.adminLogin(email, password);

			if (!data.success) {
				return { success: false, message: data.msg || 'Erro ao fazer login' };
			}

			// Armazenar token e dados do admin
			const adminData = {
				id: data.data.id,
				name: data.data.name,
				surname: data.data.surname,
				email: data.data.email,
				role: data.data.role,
			};

			localStorage.setItem('caxiauto_admin_token', data.data.token);
			localStorage.setItem('caxiauto_admin', JSON.stringify(adminData));
			setAdmin(adminData);

			return { success: true, message: 'Login realizado com sucesso!' };
		} catch (error) {
			console.error('Erro no login admin:', error);
			return { success: false, message: error.message };
		}
	};

	// Função de logout
	const logout = () => {
		setAdmin(null);
		localStorage.removeItem('caxiauto_admin');
		localStorage.removeItem('caxiauto_admin_token');
	};

	// Verificar se admin está logado
	const checkIsLoggedIn = async () => {
		try {
			const token = localStorage.getItem('caxiauto_admin_token');
			if (!token) return false;
			return true;
		} catch (error) {
			console.error('Erro ao verificar login admin:', error);
			return false;
		}
	};

	// ==================== DASHBOARD ====================
	const getDashboardStats = async () => {
		try {
			const data = await api.getDashboardStats();
			return data;
		} catch (error) {
			console.error('Erro ao obter estatísticas:', error);
			return { success: false, message: error.message };
		}
	};

	const getRecentVehicles = async (limit = 5) => {
		try {
			const data = await api.getRecentVehicles(limit);
			return data;
		} catch (error) {
			console.error('Erro ao obter veículos recentes:', error);
			return { success: false, message: error.message };
		}
	};

	const getRecentPecas = async (limit = 5) => {
		try {
			const data = await api.getRecentPecas(limit);
			return data;
		} catch (error) {
			console.error('Erro ao obter peças recentes:', error);
			return { success: false, message: error.message };
		}
	};

	const getRecentUsers = async (limit = 5) => {
		try {
			const data = await api.getRecentUsers(limit);
			return data;
		} catch (error) {
			console.error('Erro ao obter usuários recentes:', error);
			return { success: false, message: error.message };
		}
	};

	// ==================== VENDEDORES ====================
	const getPendingSellers = async (params = {}) => {
		try {
			const data = await api.getPendingSellers(params);
			return data;
		} catch (error) {
			console.error('Erro ao obter vendedores pendentes:', error);
			return { success: false, message: error.message };
		}
	};

	const getSellerDocs = async (params = {}) => {
		try {
			const data = await api.getSellerDocs(params);
			return data;
		} catch (error) {
			console.error('Erro ao obter documentos de vendedores:', error);
			return { success: false, message: error.message };
		}
	};

	const verifySeller = async (sellerId, isVerified = true) => {
		try {
			const data = await api.verifySeller(sellerId, isVerified);
			return data;
		} catch (error) {
			console.error('Erro ao verificar vendedor:', error);
			return { success: false, message: error.message };
		}
	};

	// ==================== FABRICANTES ====================
	const listManufacturers = async () => {
		try {
			const data = await api.listManufacturers();
			return data;
		} catch (error) {
			console.error('Erro ao listar fabricantes:', error);
			return { success: false, message: error.message };
		}
	};

	const createManufacturer = async (name) => {
		try {
			const data = await api.createManufacturer(name);
			return data;
		} catch (error) {
			console.error('Erro ao criar fabricante:', error);
			return { success: false, message: error.message };
		}
	};

	// ==================== CLASSES ====================
	const listClasses = async () => {
		try {
			const data = await api.listClasses();
			return data;
		} catch (error) {
			console.error('Erro ao listar classes:', error);
			return { success: false, message: error.message };
		}
	};

	const createClass = async (name) => {
		try {
			const data = await api.createClass(name);
			return data;
		} catch (error) {
			console.error('Erro ao criar classe:', error);
			return { success: false, message: error.message };
		}
	};

	const value = {
		admin,
		loading,
		login,
		logout,
		checkIsLoggedIn,
		getDashboardStats,
		getRecentVehicles,
		getRecentPecas,
		getRecentUsers,
		getPendingSellers,
		getSellerDocs,
		verifySeller,
		listManufacturers,
		createManufacturer,
		listClasses,
		createClass,
		isAuthenticated: !!admin,
	};

	return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (!context) {
		throw new Error('useAdmin deve ser usado dentro de AdminProvider');
	}
	return context;
};
