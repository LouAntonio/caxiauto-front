import { notyf } from '../services/api';

/**
 * Verifica se a resposta indica sessão expirada e redireciona para o login
 * @param {object} response - Resposta da API
 * @returns {boolean} - true se sessão expirada, false caso contrário
 */
export const handleAdminAuthError = (response) => {
	if (response?.auth) {
		// Sessão expirada
		localStorage.removeItem('caxiauto_admin');
		localStorage.removeItem('caxiauto_admin_token');
		window.location.href = '/caxiauto/login';
		return true;
	}
	return false;
};

/**
 * Função genérica para lidar com erros de operações admin
 * @param {object} response - Resposta da API
 * @param {string} successMessage - Mensagem de sucesso (opcional)
 * @param {Function} onSuccess - Callback de sucesso (opcional)
 */
export const handleAdminResponse = (response, successMessage, onSuccess) => {
	if (response.success) {
		if (successMessage) notyf.success(successMessage);
		if (onSuccess) onSuccess();
		return true;
	}
	
	if (handleAdminAuthError(response)) {
		return false;
	}
	
	notyf.error(response.message || 'Erro na operação');
	return false;
};
