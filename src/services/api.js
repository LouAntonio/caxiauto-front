import axiosInstance, { API_URL, getImageUrl, notyf } from './axios';

const api = {
	get: (endpoint, options = {}, isAdmin = false) => {
		const config = { ...options, params: options.params };
		if (isAdmin) config._isAdmin = true;
		return axiosInstance.get(endpoint, config);
	},

	post: (endpoint, data = {}, options = {}, isAdmin = false) => {
		const config = { ...options };
		config._isAdmin = isAdmin;
		if (!(data instanceof FormData)) {
			config.headers = { ...config.headers, 'Content-Type': 'application/json' };
		}
		return axiosInstance.post(endpoint, data, config);
	},

	put: (endpoint, data = {}, options = {}, isAdmin = false) => {
		const config = { ...options, _isAdmin: isAdmin };
		return axiosInstance.put(endpoint, data, config);
	},

	patch: (endpoint, data = {}, options = {}, isAdmin = false) => {
		const config = { ...options, _isAdmin: isAdmin };
		return axiosInstance.patch(endpoint, data, config);
	},

	delete: (endpoint, options = {}, isAdmin = false) => {
		const config = { ...options, _isAdmin: isAdmin };
		return axiosInstance.delete(endpoint, config);
	},

	upload: (endpoint, formData, options = {}, isAdmin = false) => {
		const config = { ...options, _isAdmin: isAdmin };
		config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
		return axiosInstance.post(endpoint, formData, config);
	},

	// ==================== AUTENTICAÇÃO DE USUÁRIO ====================
	checkEmail: (email) => api.post('/users/check-email', { email }),

	verifyOTP: (email, code) => api.post('/users/verify-otp', { email, code }),

	resendOTP: (email) => api.post('/users/resend-otp', { email }),

	completeRegistration: (userData) => api.post('/users/complete-registration', userData),

	login: (email, password) => api.post('/users/login', { email, password }),

	adminLogin: (email, password) => api.post('/users/admin/login', { email, password }, {}, true),

	logout: () => api.post('/users/logout', {}),

	adminLogout: () => api.post('/users/admin/logout', {}, {}, true),

	isLoggedIn: () => api.get('/users/is-logged-in'),

	adminIsLoggedIn: () => api.get('/users/admin/is-logged-in', {}, true),

	getProfile: () => api.get('/users/profile'),

	updateProfile: (data) => api.put('/users/profile', data),

	updateSellerDocs: (data) => api.put('/users/seller-docs', data),

	getUserDashboardStats: () => api.get('/users/dashboard/stats'),

	requestPasswordReset: (email) => api.post('/users/request-password-reset', { email }),

	resetPassword: (email, token, newPassword) => api.post('/users/reset-password', { email, token, newPassword }),

	// ==================== GOOGLE OAUTH ====================
	googleLogin: (credential) => api.post('/users/google/login', { credential }),

	linkGoogle: (credential) => api.post('/users/link-google', { credential }),

	unlinkGoogle: () => api.delete('/users/unlink-google'),

	// ==================== USUÁRIOS (ADMIN) ====================
	listUsers: (params = {}) => api.get('/users/list', { params }, true),

	updateUserRole: (userId, role) => api.patch('/users/update-role', { userId, role }, {}, true),

	toggleUserStatus: (userId, status, reason) => api.patch('/users/toggle-status', { userId, status, reason }, {}, true),

	adminGetUserDetails: (id) => api.get(`/admin/users/${id}/details`, {}, true),

	adminVerifyUser: (userId, isVerified) => api.put(`/admin/users/${userId}/verify`, { isVerified }, {}, true),

	adminResetUserPassword: (userId) => api.post(`/admin/users/${userId}/reset-password`, {}, {}, true),

	// ==================== VEÍCULOS ====================
	listVehicles: (params = {}) => {
		return api.get('/vehicles', { params }, false);
	},

	getVehicle: (id) => api.get(`/vehicles/${id}`, {}, false),

	createVehicle: (data) => api.post('/vehicles', data),

	updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),

	deleteVehicle: (id) => api.delete(`/vehicles/${id}`),

	toggleVehicleStatus: (id, status) => api.put(`/vehicles/${id}/toggle-status`, { status }),

	swapActiveVehicle: (activateId, deactivateId) => api.post('/vehicles/swap-active', { activateId, deactivateId }),

	toggleVehicleFeatured: (id, featuredUntil = null) => api.put(`/vehicles/${id}/toggle-featured`, { featuredUntil }, {}, true),

	myVehicles: (params = {}) => api.get('/vehicles/my-vehicles', { params }),

	listFeaturedVehicles: (params = {}) => api.get('/vehicles/featured', { params }),

	// ==================== VEÍCULOS (ADMIN) ====================
	adminListPendingVehicles: (params = {}) => api.get('/vehicles/admin/pending', { params }, true),

	adminGetVehicleDetails: (id) => api.get(`/vehicles/admin/${id}/details`, {}, true),

	adminApproveVehicle: (id) => api.put(`/vehicles/admin/${id}/approve`, {}, {}, true),

	adminRejectVehicle: (id, reason) => api.put(`/vehicles/admin/${id}/reject`, { reason }, {}, true),

	adminSetVehicleFeatured: (id, featuredUntil) => api.put(`/vehicles/admin/${id}/featured`, { featuredUntil }, {}, true),

	adminRemoveVehicleFeatured: (id) => api.delete(`/vehicles/admin/${id}/featured`, {}, true),

	adminDeleteVehicle: (id) => api.delete(`/vehicles/admin/${id}`, {}, true),

	// ==================== FABRICANTES E CLASSES ====================
	getManufacturers: () => api.get('/vehicles/manufacturers'),

	getClasses: () => api.get('/vehicles/classes'),

	// ==================== PEÇAS ====================
	listPecas: (params = {}) => api.get('/pecas', { params }, false),

	getPeca: (id) => api.get(`/pecas/${id}`, {}, false),

	createPeca: (data) => api.post('/pecas', data),

	updatePeca: (id, data) => api.put(`/pecas/${id}`, data),

	deletePeca: (id) => api.delete(`/pecas/${id}`),

	togglePecaStatus: (id, status) => api.put(`/pecas/${id}/toggle-status`, status ? { status } : {}),

	swapActivePeca: (activateId, deactivateId) => api.post('/pecas/swap-active', { activateId, deactivateId }),

	togglePecaFeatured: (id, featuredUntil = null) => api.put(`/pecas/${id}/toggle-featured`, { featuredUntil }, {}, true),

	minhasPecas: (params = {}) => api.get('/pecas/my-parts', { params }),

	listFeaturedPecas: (params = {}) => api.get('/pecas/featured', { params }),

	// ==================== PEÇAS (ADMIN) ====================
	adminListPendingPecas: (params = {}) => api.get('/pecas/admin/pending', { params }, true),

	adminGetPecaDetails: (id) => api.get(`/pecas/admin/${id}/details`, {}, true),

	adminApprovePeca: (id) => api.put(`/pecas/admin/${id}/approve`, {}, {}, true),

	adminRejectPeca: (id, reason) => api.put(`/pecas/admin/${id}/reject`, { reason }, {}, true),

	adminSetPecaFeatured: (id, featuredUntil) => api.put(`/pecas/admin/${id}/featured`, { featuredUntil }, {}, true),

	adminRemovePecaFeatured: (id) => api.delete(`/pecas/admin/${id}/featured`, {}, true),

	adminDeletePeca: (id) => api.delete(`/pecas/admin/${id}`, {}, true),

	// ==================== CATEGORIAS DE PEÇAS ====================
	listCategorias: (params = {}) => api.get('/categorias', { params }),

	getCategoria: (id) => api.get(`/categorias/${id}`),

	createCategoria: (name) => api.post('/categorias', { name }, {}, true),

	updateCategoria: (id, name) => api.put(`/categorias/${id}`, { name }, {}, true),

	deleteCategoria: (id) => api.delete(`/categorias/${id}`, {}, true),

	// ==================== WISHLIST ====================
	getWishlist: () => api.get('/wishlist'),

	addVehicleToWishlist: (vehicleId) => api.post(`/wishlist/vehicles/${vehicleId}`),

	removeVehicleFromWishlist: (vehicleId) => api.delete(`/wishlist/vehicles/${vehicleId}`),

	addPecaToWishlist: (pecaId) => api.post(`/wishlist/pecas/${pecaId}`),

	removePecaFromWishlist: (pecaId) => api.delete(`/wishlist/pecas/${pecaId}`),

	checkIfInWishlist: (type, id) => api.get(`/wishlist/check?type=${type}&id=${id}`),

	// ==================== RESERVAS (BOOKINGS) ====================
	createBooking: (vehicleId, startDate, endDate) => api.post('/bookings', { vehicleId, startDate, endDate }),

	getMyBookings: (params = {}) => api.get('/bookings/my', { params }),

	getBookingsByVehicle: (vehicleId, params = {}) => api.get(`/bookings/vehicle/${vehicleId}`, { params }),

	getSellerBookings: (params = {}) => api.get('/bookings/seller', { params }),

	getBooking: (id) => api.get(`/bookings/${id}`),

	updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),

	cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),

	// ==================== AVALIAÇÕES (REVIEWS) ====================
	createReview: (sellerId, rating, comment = null) => api.post('/reviews', { sellerId, rating, comment }),

	getReviewsBySeller: (sellerId, params = {}) => api.get(`/reviews/seller/${sellerId}`, { params }),

	getMyReviews: (params = {}) => api.get('/reviews/my-reviews', { params }),

	getReviewSummary: (sellerId) => api.get(`/reviews/seller/${sellerId}/summary`),

	deleteReview: (id) => api.delete(`/reviews/${id}`, {}, true),

	// ==================== DENÚNCIAS (REPORTS) ====================
	createReport: (reason, description, { reportedUserId, vehicleId, pecaId } = {}) => {
		return api.post('/reports', { reason, description, reportedUserId, vehicleId, pecaId });
	},

	getMyReports: (params = {}) => api.get('/reports/my-reports', { params }),

	getAllReports: (params = {}) => api.get('/reports', { params }, true),

	getReport: (id) => api.get(`/reports/${id}`, {}, true),

	updateReportStatus: (id, status) => api.put(`/reports/${id}/status`, { status }, {}, true),

	deleteReport: (id) => api.delete(`/reports/${id}`, {}, true),

	// ==================== ASSINATURAS E PLANOS ====================
	listPlans: (section) => api.get(`/subscriptions/plans${section ? `?section=${section}` : ''}`),

	listHighlightPlans: () => api.get('/subscriptions/highlight-plans'),

	getMySubscriptions: () => api.get('/subscriptions'),

	cancelSubscription: (section) => api.post('/subscriptions/cancel', { section }),

	createSubscriptionPayment: (planId) => api.post('/subscriptions/payments/subscription', { planId }),

	createHighlightPayment: (planId, itemType, itemId) => api.post('/subscriptions/payments/highlight', { planId, itemType, itemId }),

	uploadPaymentProof: (paymentId, proofUrl) => api.put(`/subscriptions/payments/${paymentId}/proof`, { proofUrl }),

	getMyPayments: () => api.get('/subscriptions/payments/my'),

	getSellerHome: () => api.get('/users/seller/home'),

	// ==================== VISUALIZAÇÕES (VIEWS) ====================
	addView: (type, id) => api.post(`/views/${type}/${id}`),

	getTotalViews: () => api.get('/views/user/total'),

	getTotalViewsToday: () => api.get('/views/user/today'),

	getMostViewed: () => api.get('/views/user/most-viewed'),

	// ==================== CLOUDINARY ====================
	getCloudinarySignature: (folder) => api.get(`/cloudinary/authorize-upload?folder=${folder}`),

	deleteCloudinaryResource: (publicId) => api.delete(`/cloudinary/delete-resource?publicId=${publicId}`, {}, true),

	// ==================== ADMIN - DASHBOARD ====================
	getDashboardStats: () => api.get('/admin/dashboard/stats', {}, true),

	getRecentVehicles: (limit = 5) => api.get(`/admin/dashboard/recent-vehicles?limit=${limit}`, {}, true),

	getRecentPecas: (limit = 5) => api.get(`/admin/dashboard/recent-pecas?limit=${limit}`, {}, true),

	getRecentUsers: (limit = 5) => api.get(`/admin/dashboard/recent-users?limit=${limit}`, {}, true),

	// ==================== ADMIN - VENDEDORES ====================
	getAllSellers: (params = {}) => api.get('/admin/sellers', { params }, true),

	getPendingSellers: (params = {}) => api.get('/admin/sellers/pending', { params }, true),

	getSellerDocs: (params = {}) => api.get('/admin/sellers/docs', { params }, true),

	verifySeller: (sellerId, isVerified = true) => api.put(`/admin/sellers/${sellerId}/verify`, { isVerified }, {}, true),

	adminGetSellerDetails: (id) => api.get(`/admin/sellers/${id}/details`, {}, true),

	// ==================== ADMIN - FABRICANTES E CLASSES ====================
	listManufacturers: () => api.get('/admin/manufacturers', {}, true),

	createManufacturer: (name) => api.post('/admin/manufacturers', { name }, {}, true),

	updateManufacturer: (id, name) => api.put(`/admin/manufacturers/${id}`, { name }, {}, true),

	deleteManufacturer: (id) => api.delete(`/admin/manufacturers/${id}`, {}, true),

	listClasses: () => api.get('/admin/classes', {}, true),

	createClass: (name) => api.post('/admin/classes', { name }, {}, true),

	updateClass: (id, name) => api.put(`/admin/classes/${id}`, { name }, {}, true),

	deleteClass: (id) => api.delete(`/admin/classes/${id}`, {}, true),

	adminListAllReviews: (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		return api.get(`/admin/reviews?${qs}`, {}, true);
	},

	// ==================== ADMIN - PLANOS E PLANOS DE DESTAQUE ====================
	adminListPlans: () => api.get('/admin/plans', {}, true),

	adminCreatePlan: (data) => api.post('/admin/plans', data, {}, true),

	adminUpdatePlan: (id, data) => api.put(`/admin/plans/${id}`, data, {}, true),

	adminDeletePlan: (id) => api.delete(`/admin/plans/${id}`, {}, true),

	adminListHighlightPlans: () => api.get('/admin/highlight-plans', {}, true),

	adminCreateHighlightPlan: (data) => api.post('/admin/highlight-plans', data, {}, true),

	adminUpdateHighlightPlan: (id, data) => api.put(`/admin/highlight-plans/${id}`, data, {}, true),

	adminDeleteHighlightPlan: (id) => api.delete(`/admin/highlight-plans/${id}`, {}, true),

	// ==================== ADMIN - PAGAMENTOS ====================
	adminListPayments: (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		return api.get(`/admin/payments?${qs}`, {}, true);
	},

	adminApprovePayment: (id) => api.put(`/admin/payments/${id}/approve`, {}, {}, true),

	adminRejectPayment: (id, adminNotes) => api.put(`/admin/payments/${id}/reject`, { adminNotes }, {}, true),

	adminMarkVehicleAsSold: (id) => api.put(`/admin/vehicles/${id}/mark-sold`, {}, {}, true),

	// ==================== PARCEIROS (VENDEDOR / MINHA LOJA) ====================
	myPartners: (params = {}) => api.get('/partners/my', { params }),

	getPartner: (id) => api.get(`/partners/${id}`),

	createMyPartner: (data) => api.post('/partners/my', data),

	updateMyPartner: (id, data) => api.put(`/partners/my/${id}`, data),

	deleteMyPartner: (id) => api.delete(`/partners/my/${id}`),

	// ==================== PARCEIROS (PÚBLICO) ====================
	listActivePartners: (params = {}) => api.get('/partners/active', { params }),

	// ==================== ALIASES DE FAVORITOS ====================
	getFavorites: () => api.get('/wishlist'),

	addFavorite: (id, type) => {
		if (type === 'part') return api.post(`/wishlist/pecas/${id}`);
		return api.post(`/wishlist/vehicles/${id}`);
	},

	removeFavorite: (id, type) => {
		if (type === 'part') return api.delete(`/wishlist/pecas/${id}`);
		return api.delete(`/wishlist/vehicles/${id}`);
	},

	listCategoriasPecas: (params = {}) => api.get('/categorias', { params }),

	// ==================== CHAT (Admin) ====================
	adminListConversations: () => api.get('/admin/chat/conversations', {}, true),

	// ==================== CHAT ====================
	createConversation: (data) => api.post('/chat/conversations', data),

	listConversations: () => api.get('/chat/conversations'),

	getConversation: (id) => api.get(`/chat/conversations/${id}`),

	getMessages: (id, cursor) => api.get(`/chat/conversations/${id}/messages`, { params: { cursor, limit: 30 } }),

	markAsRead: (id) => api.patch(`/chat/conversations/${id}/read`),

	getUnreadCount: () => api.get('/chat/unread-count'),

	// ==================== CONTACTO ====================
	contact: (data) => api.post('/contact', data),

	contactInsurance: (data) => api.post('/contact/insurance', data),

	contactVehiclePurchase: (data) => api.post('/contact/vehicle-purchase', data),

	contactVehicleVisit: (data) => api.post('/contact/vehicle-visit', data),

	contactRentalRequest: (data) => api.post('/contact/rental-request', data),

	contactPartPurchase: (data) => api.post('/contact/part-purchase', data),

	// ==================== CONFIG ====================
	getPublicConfig: () => api.get('/config/public'),

	getAdminConfigs: () => api.get('/admin/config', {}, true),

	updateConfig: (key, value) => api.put(`/admin/config/${key}`, { value }, true),
};

export default api;
export { API_URL, getImageUrl, notyf };
