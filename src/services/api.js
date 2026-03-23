import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Instância do Notyf para notificações
const notyf = new Notyf({
	duration: 4000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

// URL da API
let API_URL = 'http://localhost:20262';
// const API_URL = 'https://caxiauto.ecopacks-ao.com';

if (1) {
	API_URL = 'https://caxiauto-back.onrender.com';
}

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

	// Mostrar notificação
	notyf.error('Sua sessão expirou. Por favor, faça login novamente.');

	// Redirecionar para página de login
	// Pequeno delay para garantir que a notificação seja exibida
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

/**
 * Função principal para fazer requisições HTTP
 * @param {string} endpoint - Endpoint da API (ex: '/users/profile')
 * @param {object} options - Opções do fetch (method, body, headers, etc.)
 * @returns {Promise<object>} - Resposta da API
 */
const apiRequest = async (endpoint, options = {}) => {
	try {
		// Configurar headers padrão
		const headers = {
			...options.headers,
		};

		// Adicionar Content-Type apenas se não for FormData
		if (!(options.body instanceof FormData) && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		// Adicionar token de autorização se existir
		const token = localStorage.getItem('caxiauto_token');
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
			localStorage.setItem('caxiauto_token', renewedToken);
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
	/**
	 * Requisição GET
	 * @param {string} endpoint - Endpoint da API
	 * @param {object} options - Opções adicionais
	 */
	get: (endpoint, options = {}) => {
		return apiRequest(endpoint, {
			method: 'GET',
			...options,
		});
	},

	/**
	 * Requisição POST
	 * @param {string} endpoint - Endpoint da API
	 * @param {object} data - Dados a serem enviados
	 * @param {object} options - Opções adicionais
	 */
	post: (endpoint, data = {}, options = {}) => {
		return apiRequest(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
			...options,
		});
	},

	/**
	 * Requisição PUT
	 * @param {string} endpoint - Endpoint da API
	 * @param {object} data - Dados a serem enviados
	 * @param {object} options - Opções adicionais
	 */
	put: (endpoint, data = {}, options = {}) => {
		return apiRequest(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
			...options,
		});
	},

	/**
	 * Requisição PATCH
	 * @param {string} endpoint - Endpoint da API
	 * @param {object} data - Dados a serem enviados
	 * @param {object} options - Opções adicionais
	 */
	patch: (endpoint, data = {}, options = {}) => {
		return apiRequest(endpoint, {
			method: 'PATCH',
			body: JSON.stringify(data),
			...options,
		});
	},

	/**
	 * Requisição DELETE
	 * @param {string} endpoint - Endpoint da API
	 * @param {object} options - Opções adicionais
	 */
	delete: (endpoint, options = {}) => {
		return apiRequest(endpoint, {
			method: 'DELETE',
			...options,
		});
	},

	/**
	 * Upload de arquivo (multipart/form-data)
	 * @param {string} endpoint - Endpoint da API
	 * @param {FormData} formData - FormData com os arquivos
	 * @param {object} options - Opções adicionais
	 */
	upload: (endpoint, formData, options = {}) => {
		return apiRequest(endpoint, {
			method: 'POST',
			body: formData,
			...options,
		});
	},

	/**
	 * Upload de arquivo com método PUT (multipart/form-data)
	 * @param {string} endpoint - Endpoint da API
	 * @param {FormData} formData - FormData com os arquivos
	 * @param {object} options - Opções adicionais
	 */
	uploadPut: (endpoint, formData, options = {}) => {
		return apiRequest(endpoint, {
			method: 'PUT',
			body: formData,
			...options,
		});
	},

	/**
	 * Buscar veículo de aluguel por ID
	 * @param {string} id - ID do veículo
	 */
	getVeiculoAluguel: (id) => {
		return apiRequest(`/aluguelveiculos/${id}`, {
			method: 'GET',
		});
	},

	/**
	 * Listar veículos de aluguel
	 * @param {object} params - Parâmetros de busca (page, limit, search, etc.)
	 */
	listVeiculosAluguel: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = queryString ? `/aluguelveiculos?${queryString}` : '/aluguelveiculos';
		return apiRequest(endpoint, {
			method: 'GET',
		});
	},
	/**
	 * Listar categorias de peças
	 * @param {object} params - Parâmetros de busca (page, limit, search)
	 */
	listCategoriasPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = queryString ? `/categoriaspecas?${queryString}` : '/categoriaspecas';
		return apiRequest(endpoint, {
			method: 'GET',
		});
	},

	/**
	 * Listar peças
	 * @param {object} params - Parâmetros de busca (page, limit, search, categoria, condition, minPrice, maxPrice)
	 */
	listPecas: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = queryString ? `/pecas?${queryString}` : '/pecas';
		return apiRequest(endpoint, {
			method: 'GET',
		});
	},

	/**
	 * Buscar peça por ID
	 * @param {string} id - ID da peça
	 */
	getPeca: (id) => {
		return apiRequest(`/pecas/${id}`, {
			method: 'GET',
		});
	},

	/**
	 * Listar veículos de compra
	 * @param {object} params - Parâmetros de busca (page, limit, search, featured, manufacturer, etc.)
	 */
	listVeiculosCompra: (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = queryString ? `/compraveiculos?${queryString}` : '/compraveiculos';
		return apiRequest(endpoint, {
			method: 'GET',
		});
	},

	/**
	 * Buscar veículo de compra por ID
	 * @param {string} id - ID do veículo
	 */
	getVeiculoCompra: (id) => {
		return apiRequest(`/compraveiculos/${id}`, {
			method: 'GET',
		});
	},

	/**
	 * Adicionar item aos favoritos
	 * @param {string} itemId - ID do item
	 * @param {string} itemType - Tipo do item ('sell', 'rent', 'part')
	 */
	addFavorite: (itemId, itemType) => {
		return apiRequest('/favorites/add', {
			method: 'POST',
			body: JSON.stringify({ itemId, itemType }),
		});
	},

	/**
	 * Remover item dos favoritos
	 * @param {string} itemId - ID do item
	 */
	removeFavorite: (itemId) => {
		return apiRequest('/favorites/remove', {
			method: 'POST',
			body: JSON.stringify({ itemId }),
		});
	},

	/**
	 * Buscar todos os favoritos do usuário
	 */
	getFavorites: () => {
		return apiRequest('/favorites', {
			method: 'GET',
		});
	},

	/**
	 * Verificar se um item é favorito
	 * @param {string} itemId - ID do item
	 */
	isFavorite: (itemId) => {
		return apiRequest(`/favorites/is-favorite?itemId=${itemId}`, {
			method: 'GET',
		});
	},

	/**
	 * Adicionar visualização a um item
	 * @param {string} type - Tipo do item ('sell', 'rent', 'part')
	 * @param {string} id - ID do item
	 */
	addView: (type, id) => {
		return apiRequest(`/views/${type}/${id}`, {
			method: 'POST',
		});
	},

	/**
	 * Obter total de visualizações do usuário autenticado
	 */
	getTotalViews: () => {
		return apiRequest('/views/user/total', {
			method: 'GET',
		});
	},

	/**
	 * Obter total de visualizações de hoje do usuário autenticado
	 */
	getTotalViewsToday: () => {
		return apiRequest('/views/user/today', {
			method: 'GET',
		});
	},

	/**
	 * Obter item mais visualizado do usuário autenticado
	 */
	getMostViewed: () => {
		return apiRequest('/views/user/most-viewed', {
			method: 'GET',
		});
	},
};

export default api;
export { API_URL, getImageUrl, notyf };
