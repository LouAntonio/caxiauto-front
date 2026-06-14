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

const getImageUrl = (imagePath, fallback = '/images/i10.jpg') => {
	if (!imagePath) return fallback;
	if (imagePath.startsWith('http')) return imagePath;
	const cleanPath = imagePath.replace(/^\//, '');
	return `${API_URL}/${cleanPath}`;
};

const handleSessionExpired = () => {
	localStorage.removeItem('caxiauto_user');
	localStorage.removeItem('caxiauto_token');
	localStorage.removeItem('caxiauto_admin_token');
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
	const tokenKey = isAdmin ? 'caxiauto_admin_token' : 'caxiauto_token';
	const token = localStorage.getItem(tokenKey);
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
			const isAdmin = response.config._isAdmin === true;
			const tokenKey = isAdmin ? 'caxiauto_admin_token' : 'caxiauto_token';
			localStorage.setItem(tokenKey, renewedToken);
		}
		return response.data;
	},
	(error) => {
		if (error.response?.data?.success === false && error.response?.data?.auth === true) {
			const hadToken = error.config?.headers?.Authorization;
			if (hadToken) {
				handleSessionExpired();
				return Promise.reject(new Error('Sessão expirada'));
			}
		}
		console.error('Erro na requisição:', error);
		return {
			success: false,
			msg: error.response?.data?.msg || error.message || 'Erro ao comunicar com o servidor',
		};
	}
);

export default axiosInstance;
export { API_URL, getImageUrl, notyf };
