import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Instância do Notyf para notificações
const notyf = new Notyf({
	duration: 4000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

// URL da API (Vite expõe variáveis via import.meta.env)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Constrói URL completa para imagens de veículos
 * @param {string|null} imagePath - Caminho da imagem (ex: "/uploads/veiculos/image.jpg")
 * @param {string} fallback - Imagem padrão a ser usada se não houver imagem
 * @returns {string} - URL completa da imagem
 */
const getImageUrl = (imagePath, fallback = '/images/i10.jpg') => {
	if (!imagePath) return fallback;
	if (imagePath.startsWith('http')) return imagePath;
	// Remove barra inicial para evitar barras duplas na URL final
	const cleanPath = imagePath.replace(/^\//, '');
	return `${API_URL}/${cleanPath}`;
};

/**
 * Faz logout do usuário limpando o localStorage e redirecionando para login
 */
const handleSessionExpired = () => {
	// Limpar dados do localStorage
	localStorage.removeItem('caxiauto_user');
	localStorage.removeItem('caxiauto_token');
	localStorage.removeItem('caxiauto_admin_token');

	// Mostrar notificação
	notyf.error('Sua sessão expirou. Por favor, faça login novamente.');

	// Redirecionar para página de login
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

/**
 * Função principal para fazer requisições HTTP
 * @param {string} endpoint - Endpoint da API (ex: '/users/profile')
 * @param {object} options - Opções do fetch (method, body, headers, etc.)
 * @param {boolean} isAdmin - Se true, usa token de admin
 * @returns {Promise<object>} - Resposta da API
 */
const apiRequest = async (endpoint, options = {}, isAdmin = false) => {
	try {
		// Configurar headers padrão
		const headers = {
			...options.headers,
		};

		// Adicionar Content-Type apenas se não for FormData
		if (!(options.body instanceof FormData) && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		// Adicionar token de autorização (admin ou usuário)
		const token = isAdmin 
			? localStorage.getItem('caxiauto_admin_token') 
			: localStorage.getItem('caxiauto_token');
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		// Fazer a requisição
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers,
		});

		// Verificar se há um token renovado no header
		const renewedToken = response.headers.get('x-renewed-token');
		if (renewedToken) {
			if (isAdmin) {
				localStorage.setItem('caxiauto_admin_token', renewedToken);
			} else {
				localStorage.setItem('caxiauto_token', renewedToken);
			}
		}

		// Tentar parsear a resposta como JSON
		let data;
		try {
			data = await response.json();
		} catch (error) {
			// Se não for JSON, retornar um objeto de erro
			throw new Error('Erro ao processar resposta do servidor');
		}

		// Verificar se é um erro de autenticação (sessão expirada)
		if (data.success === false && data.auth === true) {
			handleSessionExpired();
			// Retornar um erro para evitar processamento adicional
			throw new Error('Sessão expirada');
		}

		// Retornar os dados
		return data;
	} catch (error) {
		// Se for erro de sessão expirada, apenas propagar
		if (error.message === 'Sessão expirada') {
			throw error;
		}

		// Para outros erros, retornar objeto padronizado
		console.error('Erro na requisição:', error);
		return {
			success: false,
			msg: error.message || 'Erro ao comunicar com o servidor',
		};
	}
};

/**
 * Métodos HTTP convenientes
 */
const api = {
	// ==================== MÉTODOS HTTP BÁSICOS ====================
	get: (endpoint, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'GET', ...options }, isAdmin);
	},

	post: (endpoint, data = {}, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }, isAdmin);
	},

	put: (endpoint, data = {}, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }, isAdmin);
	},

	patch: (endpoint, data = {}, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(data), ...options }, isAdmin);
	},

	delete: (endpoint, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'DELETE', ...options }, isAdmin);
	},

	upload: (endpoint, formData, options = {}, isAdmin = false) => {
		return apiRequest(endpoint, { method: 'POST', body: formData, ...options }, isAdmin);
	},

	// ==================== AUTENTICAÇÃO DE USUÁRIO ====================
	checkEmail: (email) => {
		return api.post('/users/check-email', { email });
	},

	verifyOTP: (email, code) => {
		return api.post('/users/verify-otp', { email, code });
	},

	resendOTP: (email) => {
		return api.post('/users/resend-otp', { email });
	},

	completeRegistration: (userData) => {
		return api.post('/users/complete-registration', userData);
	},

	login: (email, password) => {
		return api.post('/users/login', { email, password });
	},

	adminLogin: (email, password) => {
		return apiRequest('/users/admin/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		}, true);
	},

	isLoggedIn: () => {
		return api.get('/users/is-logged-in');
	},

	getProfile: () => {
		return api.get('/users/profile');
	},

	updateProfile: (data) => {
		return api.put('/users/profile', data);
	},

	updateSellerDocs: (data) => {
		return api.put('/users/seller-docs', data);
	},

	requestPasswordReset: (email) => {
		return api.post('/users/request-password-reset', { email });
	},

	resetPassword: (email, token, newPassword) => {
		return api.post('/users/reset-password', { email, token, newPassword });
	},

	// ==================== USUÁRIOS (ADMIN) ====================
	listUsers: (params = {}) => {
		return api.post('/users/list', params, {}, true);
	},

	updateUserRole: (userId, role) => {
		return api.patch('/users/update-role', { userId, role }, {}, true);
	},

	toggleUserStatus: (userId, status) => {
		return api.patch('/users/toggle-status', { userId, status }, {}, true);
	},

	// ==================== VEÍCULOS ====================
	listVehicles: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/vehicles?${queryString}`, {}, true);
	},

	getVehicle: (id) => {
		return api.get(`/vehicles/${id}`, {}, true);
	},

	createVehicle: (data) => {
		return api.post('/vehicles', data);
	},

	updateVehicle: (id, data) => {
		return api.put(`/vehicles/${id}`, data);
	},

	deleteVehicle: (id) => {
		return api.delete(`/vehicles/${id}`, {}, true);
	},

	toggleVehicleStatus: (id, status) => {
		return api.put(`/vehicles/${id}/status`, { status }, {}, true);
	},

	toggleVehicleFeatured: (id, featuredUntil = null) => {
		return api.put(`/vehicles/${id}/featured`, { featuredUntil }, {}, true);
	},

	myVehicles: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/vehicles/my?${queryString}`);
	},

	listFeaturedVehicles: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/vehicles/featured?${queryString}`);
	},

	// ==================== FABRICANTES E CLASSES ====================
	getManufacturers: () => {
		return api.get('/vehicles/manufacturers');
	},

	getClasses: () => {
		return api.get('/vehicles/classes');
	},

	// ==================== PEÇAS ====================
	listPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/pecas?${queryString}`, {}, true);
	},

	getPeca: (id) => {
		return api.get(`/pecas/${id}`, {}, true);
	},

	createPeca: (data) => {
		return api.post('/pecas', data);
	},

	updatePeca: (id, data) => {
		return api.put(`/pecas/${id}`, data);
	},

	deletePeca: (id) => {
		return api.delete(`/pecas/${id}`, {}, true);
	},

	minhasPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/pecas/my?${queryString}`);
	},

	listFeaturedPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/pecas/featured?${queryString}`);
	},

	// ==================== CATEGORIAS DE PEÇAS ====================
	listCategorias: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/categorias?${queryString}`, {}, true);
	},

	getCategoria: (id) => {
		return api.get(`/categorias/${id}`, {}, true);
	},

	createCategoria: (name) => {
		return api.post('/categorias', { name }, {}, true);
	},

	updateCategoria: (id, name) => {
		return api.put(`/categorias/${id}`, { name }, {}, true);
	},

	deleteCategoria: (id) => {
		return api.delete(`/categorias/${id}`, {}, true);
	},

	// ==================== WISHLIST (SUBSTITUI FAVORITOS) ====================
	getWishlist: () => {
		return api.get('/wishlist');
	},

	addVehicleToWishlist: (vehicleId) => {
		return api.post(`/wishlist/vehicles/${vehicleId}`);
	},

	removeVehicleFromWishlist: (vehicleId) => {
		return api.delete(`/wishlist/vehicles/${vehicleId}`);
	},

	addPecaToWishlist: (pecaId) => {
		return api.post(`/wishlist/pecas/${pecaId}`);
	},

	removePecaFromWishlist: (pecaId) => {
		return api.delete(`/wishlist/pecas/${pecaId}`);
	},

	checkIfInWishlist: (type, id) => {
		return api.get(`/wishlist/check?type=${type}&id=${id}`);
	},

	// ==================== RESERVAS (BOOKINGS) ====================
	createBooking: (vehicleId, startDate, endDate) => {
		return api.post('/bookings', { vehicleId, startDate, endDate });
	},

	getMyBookings: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/bookings/my?${queryString}`);
	},

	getBookingsByVehicle: (vehicleId, params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/bookings/vehicle/${vehicleId}?${queryString}`);
	},

	getBooking: (id) => {
		return api.get(`/bookings/${id}`);
	},

	updateBookingStatus: (id, status) => {
		return api.put(`/bookings/${id}/status`, { status });
	},

	cancelBooking: (id) => {
		return api.delete(`/bookings/${id}`);
	},

	// ==================== AVALIAÇÕES (REVIEWS) ====================
	createReview: (sellerId, rating, comment = null) => {
		return api.post('/reviews', { sellerId, rating, comment });
	},

	getReviewsBySeller: (sellerId, params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/reviews/seller/${sellerId}?${queryString}`);
	},

	getMyReviews: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/reviews/my-reviews?${queryString}`);
	},

	getReviewSummary: (sellerId) => {
		return api.get(`/reviews/seller/${sellerId}/summary`);
	},

	deleteReview: (id) => {
		return api.delete(`/reviews/${id}`, {}, true);
	},

	// ==================== DENÚNCIAS (REPORTS) ====================
	createReport: (reason, description, { reportedUserId, vehicleId, pecaId } = {}) => {
		return api.post('/reports', { reason, description, reportedUserId, vehicleId, pecaId });
	},

	getMyReports: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/reports/my-reports?${queryString}`);
	},

	getAllReports: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/reports?${queryString}`, {}, true);
	},

	getReport: (id) => {
		return api.get(`/reports/${id}`, {}, true);
	},

	updateReportStatus: (id, status) => {
		return api.put(`/reports/${id}/status`, { status }, {}, true);
	},

	deleteReport: (id) => {
		return api.delete(`/reports/${id}`, {}, true);
	},

	// ==================== ASSINATURAS E PLANOS ====================
	listPlans: () => {
		return api.get('/subscriptions/plans');
	},

	listHighlightPackages: () => {
		return api.get('/subscriptions/highlight-packages');
	},

	subscribePlan: (planId) => {
		return api.post('/subscriptions', { planId });
	},

	getMySubscription: () => {
		return api.get('/subscriptions');
	},

	cancelSubscription: () => {
		return api.post('/subscriptions/cancel');
	},

	buyHighlightPackage: (packageId) => {
		return api.post('/subscriptions/highlights/purchase', { packageId });
	},

	applyVehicleHighlight: (vehicleId, daysDuration = 7) => {
		return api.post(`/subscriptions/highlights/apply/${vehicleId}`, { daysDuration });
	},

	// ==================== VISUALIZAÇÕES (VIEWS) ====================
	addView: (type, id) => {
		return api.post(`/views/${type}/${id}`);
	},

	getTotalViews: () => {
		return api.get('/views/user/total');
	},

	getTotalViewsToday: () => {
		return api.get('/views/user/today');
	},

	getMostViewed: () => {
		return api.get('/views/user/most-viewed');
	},

	// ==================== CLOUDINARY (UPLOAD) ====================
	getCloudinarySignature: (folder) => {
		return api.get(`/cloudinary/authorize-upload?folder=${folder}`);
	},

	deleteCloudinaryResource: (publicId) => {
		return api.post('/cloudinary/delete', { publicId });
	},

	// ==================== ADMIN - DASHBOARD ====================
	getDashboardStats: () => {
		return api.get('/admin/dashboard/stats', {}, true);
	},

	getRecentVehicles: (limit = 5) => {
		return api.get(`/admin/dashboard/recent-vehicles?limit=${limit}`, {}, true);
	},

	getRecentPecas: (limit = 5) => {
		return api.get(`/admin/dashboard/recent-pecas?limit=${limit}`, {}, true);
	},

	getRecentUsers: (limit = 5) => {
		return api.get(`/admin/dashboard/recent-users?limit=${limit}`, {}, true);
	},

	// ==================== ADMIN - VENDEDORES ====================
	getPendingSellers: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/admin/sellers/pending?${queryString}`, {}, true);
	},

	getSellerDocs: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/admin/sellers/docs?${queryString}`, {}, true);
	},

	verifySeller: (sellerId, isVerified = true) => {
		return api.put(`/admin/sellers/${sellerId}/verify`, { isVerified }, {}, true);
	},

	// ==================== ADMIN - FABRICANTES E CLASSES ====================
	listManufacturers: () => {
		return api.get('/admin/manufacturers', {}, true);
	},

	createManufacturer: (name) => {
		return api.post('/admin/manufacturers', { name }, {}, true);
	},

	listClasses: () => {
		return api.get('/admin/classes', {}, true);
	},

	createClass: (name) => {
		return api.post('/admin/classes', { name }, {}, true);
	},

	// ==================== ADMIN - PLANOS E PACOTES DE DESTAQUE ====================
	adminListPlans: () => {
		return api.get('/admin/plans', {}, true);
	},

	adminCreatePlan: (data) => {
		return api.post('/admin/plans', data, {}, true);
	},

	adminUpdatePlan: (id, data) => {
		return api.put(`/admin/plans/${id}`, data, {}, true);
	},

	adminDeletePlan: (id) => {
		return api.delete(`/admin/plans/${id}`, {}, true);
	},

	adminListHighlightPackages: () => {
		return api.get('/admin/highlight-packages', {}, true);
	},

	adminCreateHighlightPackage: (data) => {
		return api.post('/admin/highlight-packages', data, {}, true);
	},

	adminUpdateHighlightPackage: (id, data) => {
		return api.put(`/admin/highlight-packages/${id}`, data, {}, true);
	},

	adminDeleteHighlightPackage: (id) => {
		return api.delete(`/admin/highlight-packages/${id}`, {}, true);
	},

	// ==================== ADMIN - PARCEIROS ====================
	listPartners: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/partners?${queryString}`, {}, true);
	},

	getPartner: (id) => {
		return api.get(`/partners/${id}`, {}, true);
	},

	createPartner: (data) => {
		return api.post('/partners', data, {}, true);
	},

	updatePartner: (id, data) => {
		return api.put(`/partners/${id}`, data, {}, true);
	},

	deletePartner: (id) => {
		return api.delete(`/partners/${id}`, {}, true);
	},

	togglePartnerStatus: (id, status) => {
		return api.patch(`/partners/${id}/status`, { status }, {}, true);
	},

	// ==================== PARCEIROS (PÚBLICO) ====================
	listActivePartners: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/partners/active?${queryString}`);
	},

	// ==================== ALIASES DE FAVORITOS (DELEGAM PARA WISHLIST) ====================
	getFavorites: () => {
		return api.get('/wishlist');
	},

	addFavorite: (id, type) => {
		if (type === 'part') {
			return api.post(`/wishlist/pecas/${id}`);
		}
		return api.post(`/wishlist/vehicles/${id}`);
	},

	removeFavorite: (id, type) => {
		if (type === 'part') {
			return api.delete(`/wishlist/pecas/${id}`);
		}
		return api.delete(`/wishlist/vehicles/${id}`);
	},

	// Alias para categorias de peças
	listCategoriasPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		return api.get(`/categorias?${queryString}`, {}, false);
	},
};

export default api;
export { API_URL, getImageUrl, notyf };
