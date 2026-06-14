import { create } from 'zustand';
import api from '../services/api';

const getStoredAdmin = () => {
	try {
		const stored = localStorage.getItem('caxiauto_admin');
		const token = localStorage.getItem('caxiauto_admin_token');
		if (stored && token) return JSON.parse(stored);
	} catch (e) {
		localStorage.removeItem('caxiauto_admin');
		localStorage.removeItem('caxiauto_admin_token');
	}
	return null;
};

const useAdminStore = create((set, get) => ({
	admin: getStoredAdmin(),
	loading: false,

	get isAuthenticated() {
		return !!get().admin;
	},

	login: async (email, password) => {
		try {
			const data = await api.adminLogin(email, password);
			if (!data.success) return { success: false, message: data.msg || 'Erro ao fazer login' };
			const adminData = {
				id: data.data.id,
				name: data.data.name,
				surname: data.data.surname,
				email: data.data.email,
				role: data.data.role,
			};
			localStorage.setItem('caxiauto_admin_token', data.data.token);
			localStorage.setItem('caxiauto_admin', JSON.stringify(adminData));
			set({ admin: adminData });
			return { success: true, message: 'Login realizado com sucesso!' };
		} catch (error) {
			console.error('Erro no login admin:', error);
			return { success: false, message: error.message };
		}
	},

	logout: () => {
		set({ admin: null });
		localStorage.removeItem('caxiauto_admin');
		localStorage.removeItem('caxiauto_admin_token');
	},

	checkIsLoggedIn: async () => {
		try {
			return !!localStorage.getItem('caxiauto_admin_token');
		} catch {
			return false;
		}
	},

	// ==================== DASHBOARD ====================
	getDashboardStats: async () => {
		try { return await api.getDashboardStats(); }
		catch (error) { console.error('Erro ao obter estatísticas:', error); return { success: false, message: error.message }; }
	},

	getRecentVehicles: async (limit = 5) => {
		try { return await api.getRecentVehicles(limit); }
		catch (error) { console.error('Erro ao obter veículos recentes:', error); return { success: false, message: error.message }; }
	},

	getRecentPecas: async (limit = 5) => {
		try { return await api.getRecentPecas(limit); }
		catch (error) { console.error('Erro ao obter peças recentes:', error); return { success: false, message: error.message }; }
	},

	getRecentUsers: async (limit = 5) => {
		try { return await api.getRecentUsers(limit); }
		catch (error) { console.error('Erro ao obter usuários recentes:', error); return { success: false, message: error.message }; }
	},

	// ==================== VENDEDORES ====================
	getPendingSellers: async (params = {}) => {
		try { return await api.getPendingSellers(params); }
		catch (error) { console.error('Erro ao obter vendedores pendentes:', error); return { success: false, message: error.message }; }
	},

	getSellerDocs: async (params = {}) => {
		try { return await api.getSellerDocs(params); }
		catch (error) { console.error('Erro ao obter documentos:', error); return { success: false, message: error.message }; }
	},

	verifySeller: async (sellerId, isVerified = true) => {
		try { return await api.verifySeller(sellerId, isVerified); }
		catch (error) { console.error('Erro ao verificar vendedor:', error); return { success: false, message: error.message }; }
	},

	adminGetSellerDetails: async (id) => {
		try { return await api.adminGetSellerDetails(id); }
		catch (error) { console.error('Erro ao obter detalhes do vendedor:', error); return { success: false, message: error.message }; }
	},

	// ==================== FABRICANTES E CLASSES ====================
	listManufacturers: async () => {
		try { return await api.listManufacturers(); }
		catch (error) { console.error('Erro ao listar fabricantes:', error); return { success: false, message: error.message }; }
	},

	createManufacturer: async (name) => {
		try { return await api.createManufacturer(name); }
		catch (error) { console.error('Erro ao criar fabricante:', error); return { success: false, message: error.message }; }
	},

	updateManufacturer: async (id, name) => {
		try { return await api.updateManufacturer(id, name); }
		catch (e) { return { success: false, message: e.message }; }
	},

	deleteManufacturer: async (id) => {
		try { return await api.deleteManufacturer(id); }
		catch (e) { return { success: false, message: e.message }; }
	},

	listClasses: async () => {
		try { return await api.listClasses(); }
		catch (error) { console.error('Erro ao listar classes:', error); return { success: false, message: error.message }; }
	},

	createClass: async (name) => {
		try { return await api.createClass(name); }
		catch (error) { return { success: false, message: error.message }; }
	},

	updateClass: async (id, name) => {
		try { return await api.updateClass(id, name); }
		catch (e) { return { success: false, message: e.message }; }
	},

	deleteClass: async (id) => {
		try { return await api.deleteClass(id); }
		catch (e) { return { success: false, message: e.message }; }
	},

	adminListAllReviews: async (params = {}) => {
		try { return await api.adminListAllReviews(params); }
		catch (e) { return { success: false, message: e.message }; }
	},

	// ==================== PLANOS ====================
	adminListPlans: async () => {
		try { return await api.adminListPlans(); }
		catch (error) { console.error('Erro ao listar planos:', error); return { success: false, message: error.message }; }
	},

	adminCreatePlan: async (data) => {
		try { return await api.adminCreatePlan(data); }
		catch (error) { console.error('Erro ao criar plano:', error); return { success: false, message: error.message }; }
	},

	adminUpdatePlan: async (id, data) => {
		try { return await api.adminUpdatePlan(id, data); }
		catch (error) { console.error('Erro ao atualizar plano:', error); return { success: false, message: error.message }; }
	},

	adminDeletePlan: async (id) => {
		try { return await api.adminDeletePlan(id); }
		catch (error) { console.error('Erro ao remover plano:', error); return { success: false, message: error.message }; }
	},

	// ==================== PACOTES DE DESTAQUE ====================
	adminListHighlightPackages: async () => {
		try { return await api.adminListHighlightPackages(); }
		catch (error) { console.error('Erro ao listar pacotes de destaque:', error); return { success: false, message: error.message }; }
	},

	adminCreateHighlightPackage: async (data) => {
		try { return await api.adminCreateHighlightPackage(data); }
		catch (error) { console.error('Erro ao criar pacote:', error); return { success: false, message: error.message }; }
	},

	adminUpdateHighlightPackage: async (id, data) => {
		try { return await api.adminUpdateHighlightPackage(id, data); }
		catch (error) { console.error('Erro ao atualizar pacote:', error); return { success: false, message: error.message }; }
	},

	adminDeleteHighlightPackage: async (id) => {
		try { return await api.adminDeleteHighlightPackage(id); }
		catch (error) { console.error('Erro ao remover pacote:', error); return { success: false, message: error.message }; }
	},
}));

export default useAdminStore;
