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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:20262';

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
};

export default api;
export { API_URL, notyf };
