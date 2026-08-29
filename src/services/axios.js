import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
	duration: 4000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

const API_URL = import.meta.env.VITE_API_URL;

const USER_TOKEN_KEY = 'caxiauto_token';
const ADMIN_TOKEN_KEY = 'caxiauto_admin_token';

// Decodifica apenas o payload de um JWT (sem validação — apenas tipo/claims).
const decodeJwtPayload = (token) => {
	try {
		const payload = (token.split('.')[1] || '').replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(decodeURIComponent(escape(atob(payload))));
	} catch {
		return null;
	}
};

// Tokens de user têm claim `email`; tokens admin não. Distinção fiável no cliente.
const isUserToken = (token) => {
	const payload = decodeJwtPayload(token);
	return !!payload && typeof payload.email === 'string';
};

const typeMatches = (token, isAdmin) => isUserToken(token) === !isAdmin;

// Devolve o token do tipo certo para a chamada, auto-corrigindo chaves corrompidas
// por escrita cruzada legada (ex.: token admin guardado em caxiauto_token).
const getAuthToken = (isAdmin) => {
	const primaryKey = isAdmin ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY;
	const otherKey = isAdmin ? USER_TOKEN_KEY : ADMIN_TOKEN_KEY;

	let token = localStorage.getItem(primaryKey);
	if (token) {
		if (typeMatches(token, isAdmin)) return token;
		localStorage.removeItem(primaryKey);
		token = null;
	}

	const other = localStorage.getItem(otherKey);
	if (other && typeMatches(other, isAdmin)) {
		localStorage.setItem(primaryKey, other);
		localStorage.removeItem(otherKey);
		return other;
	}
	return null;
};

const getImageUrl = (imagePath, fallback = '/images/i10.jpg') => {
	if (!imagePath) return fallback;
	if (imagePath.startsWith('http')) return imagePath;
	const cleanPath = imagePath.replace(/^\//, '');
	return `${API_URL}/${cleanPath}`;
};

const handleSessionExpired = (isAdmin) => {
	// Só expira a sessão do tipo que falhou — não mata a sessão da outra aba.
	localStorage.removeItem(isAdmin ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY);
	notyf.error('Sua sessão expirou. Por favor, faça login novamente.');
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	const isAdmin = config._isAdmin === true;
	const token = getAuthToken(isAdmin);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (config.data instanceof FormData) {
		delete config.headers['Content-Type'];
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => {
		const renewedToken = response.headers['x-renewed-token'];
		if (renewedToken) {
			// Guarda na chave correta segundo o próprio tipo do token renovado,
			// não segundo o flag _isAdmin da chamada (evita escrita cruzada).
			localStorage.setItem(isUserToken(renewedToken) ? USER_TOKEN_KEY : ADMIN_TOKEN_KEY, renewedToken);
		}
		return response.data;
	},
	(error) => {
		if (error.response?.data?.success === false && error.response?.data?.auth === true) {
			const authHeader = error.config?.headers?.Authorization || '';
			if (authHeader.startsWith('Bearer ')) {
				handleSessionExpired(!isUserToken(authHeader.slice(7)));
				return Promise.reject(new Error('Sessão expirada'));
			}
		}

		// Falhas de rede e erros de servidor deixam de ser "engolidos" (C7):
		// propagam como exceção para os componentes poderem reagir de forma adequada.
		if (!error.response || error.response.status >= 500) {
			const message = !error.response
				? 'Falha de ligação com o servidor. Verifique a sua internet e tente novamente.'
				: error.response?.data?.message || 'Erro interno no servidor. Tente novamente mais tarde.';
			return Promise.reject(new Error(message));
		}

		// 4xx mantêm o contrato {success:false} usado pelas ~100 chamadas da app.
		console.error('Erro na requisição:', error);
		return {
			success: false,
			message: error.response?.data?.message || error.message || 'Erro ao comunicar com o servidor',
		};
	}
);

export default axiosInstance;
export { API_URL, getImageUrl, notyf };
