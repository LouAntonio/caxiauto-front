import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

// ==================== DASHBOARD ====================
export const useDashboardStats = () => {
	return useQuery({
		queryKey: ['admin', 'dashboard', 'stats'],
		queryFn: () => api.getDashboardStats(),
		select: (res) => (res.success ? res.data : null),
	});
};

export const useRecentVehicles = (limit = 5) => {
	return useQuery({
		queryKey: ['admin', 'dashboard', 'recent-vehicles', limit],
		queryFn: () => api.getRecentVehicles(limit),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useRecentPecas = (limit = 5) => {
	return useQuery({
		queryKey: ['admin', 'dashboard', 'recent-pecas', limit],
		queryFn: () => api.getRecentPecas(limit),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useRecentUsers = (limit = 5) => {
	return useQuery({
		queryKey: ['admin', 'dashboard', 'recent-users', limit],
		queryFn: () => api.getRecentUsers(limit),
		select: (res) => (res.success ? res.data : []),
	});
};

// ==================== VEÍCULOS (ADMIN) ====================
export const useAdminPendingVehicles = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'vehicles', 'pending', params],
		queryFn: () => api.adminListPendingVehicles(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminApproveVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminApproveVehicle(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

export const useAdminRejectVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }) => api.adminRejectVehicle(id, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] });
		},
	});
};

export const useAdminDeleteVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminDeleteVehicle(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

// ==================== PEÇAS (ADMIN) ====================
export const useAdminPendingPecas = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'pecas', 'pending', params],
		queryFn: () => api.adminListPendingPecas(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminApprovePeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminApprovePeca(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'pecas'] });
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useAdminRejectPeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }) => api.adminRejectPeca(id, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'pecas'] });
		},
	});
};

export const useAdminDeletePeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminDeletePeca(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'pecas'] });
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

// ==================== CATEGORIAS (ADMIN) ====================
export const useCategorias = (params = {}) => {
	return useQuery({
		queryKey: ['categorias', params],
		queryFn: () => api.listCategorias(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useCreateCategoria = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (name) => api.createCategoria(name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
	});
};

export const useUpdateCategoria = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, name }) => api.updateCategoria(id, name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
	});
};

export const useDeleteCategoria = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteCategoria(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
	});
};

// ==================== USUÁRIOS (ADMIN) ====================
export const useAdminUsers = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'users', params],
		queryFn: () => api.listUsers(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminUpdateUserRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, role }) => api.updateUserRole(userId, role),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
	});
};

export const useAdminToggleUserStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, status, reason }) => api.toggleUserStatus(userId, status, reason),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
	});
};

// ==================== VENDEDORES (ADMIN) ====================
export const useAdminSellers = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'sellers', 'list', params],
		queryFn: () => api.getAllSellers(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminPendingSellers = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'sellers', 'pending', params],
		queryFn: () => api.getPendingSellers(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminSellerDocs = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'sellers', 'docs', params],
		queryFn: () => api.getSellerDocs(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminVerifySeller = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ sellerId, isVerified }) => api.verifySeller(sellerId, isVerified),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
		},
	});
};

// ==================== FABRICANTES (ADMIN) ====================
export const useAdminManufacturers = () => {
	return useQuery({
		queryKey: ['admin', 'manufacturers'],
		queryFn: () => api.listManufacturers(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminCreateManufacturer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (name) => api.createManufacturer(name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manufacturers'] }),
	});
};

export const useAdminUpdateManufacturer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, name }) => api.updateManufacturer(id, name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manufacturers'] }),
	});
};

export const useAdminDeleteManufacturer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteManufacturer(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'manufacturers'] }),
	});
};

// ==================== CLASSES (ADMIN) ====================
export const useAdminClasses = () => {
	return useQuery({
		queryKey: ['admin', 'classes'],
		queryFn: () => api.listClasses(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminCreateClass = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (name) => api.createClass(name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] }),
	});
};

export const useAdminUpdateClass = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, name }) => api.updateClass(id, name),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] }),
	});
};

export const useAdminDeleteClass = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteClass(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] }),
	});
};

// ==================== REVIEWS (ADMIN) ====================
export const useAdminReviews = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'reviews', params],
		queryFn: () => api.adminListAllReviews(params),
		select: (res) => (res.success ? res.data : []),
	});
};

// ==================== PLANOS (ADMIN) ====================
export const useAdminPlans = () => {
	return useQuery({
		queryKey: ['admin', 'plans'],
		queryFn: () => api.adminListPlans(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminCreatePlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.adminCreatePlan(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
	});
};

export const useAdminUpdatePlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.adminUpdatePlan(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
	});
};

export const useAdminDeletePlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminDeletePlan(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
	});
};

// ==================== PLANOS DE DESTAQUE (ADMIN) ====================
export const useAdminHighlightPlans = () => {
	return useQuery({
		queryKey: ['admin', 'highlight-plans'],
		queryFn: () => api.adminListHighlightPlans(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminCreateHighlightPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.adminCreateHighlightPlan(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'highlight-plans'] }),
	});
};

export const useAdminUpdateHighlightPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.adminUpdateHighlightPlan(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'highlight-plans'] }),
	});
};

export const useAdminDeleteHighlightPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminDeleteHighlightPlan(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'highlight-plans'] }),
	});
};

// ==================== PAGAMENTOS (ADMIN) ====================
export const useAdminPayments = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'payments', params],
		queryFn: () => api.adminListPayments(params),
		select: (res) => (res.success ? { data: res.data, pagination: res.pagination } : { data: [], pagination: null }),
	});
};

export const useAdminApprovePayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminApprovePayment(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useAdminRejectPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, adminNotes }) => api.adminRejectPayment(id, adminNotes),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
		},
	});
};

export const useAdminMarkVehicleAsSold = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.adminMarkVehicleAsSold(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

// ==================== PARCEIROS (ADMIN) ====================
export const useAdminPartners = (params = {}) => {
	return useQuery({
		queryKey: ['admin', 'partners', params],
		queryFn: () => api.listPartners(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminCreatePartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.createPartner(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] }),
	});
};

export const useAdminUpdatePartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.updatePartner(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] }),
	});
};

export const useAdminDeletePartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deletePartner(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] }),
	});
};

// ==================== CHAT (ADMIN) ====================
export const useAdminConversations = () => {
	return useQuery({
		queryKey: ['admin', 'chat', 'conversations'],
		queryFn: () => api.adminListConversations(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAdminTogglePartnerStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }) => api.togglePartnerStatus(id, status),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] }),
	});
};
