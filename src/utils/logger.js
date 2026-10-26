// Logger Utility - Substitui console.error/log com níveis e sanitização
// Em produção, pode integrar com Sentry, LogRocket, etc.

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Sanitiza objetos para remover dados sensíveis
function sanitize(obj) {
	if (!obj || typeof obj !== 'object') return obj;
	
	const sensitiveKeys = [
		'password', 'confirmPassword', 'newPassword', 'currentPassword',
		'token', 'accessToken', 'refreshToken', 'authorization',
		'email', 'phone', 'cpf', 'cnpj', 'nif',
		'creditCard', 'cardNumber', 'cvv'
	];
	
	const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
	
	for (const key of Object.keys(sanitized)) {
		const value = sanitized[key];
		if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
			sanitized[key] = '[REDACTED]';
		} else if (value && typeof value === 'object') {
			sanitized[key] = sanitize(value);
		}
	}
	
	return sanitized;
}

function formatMessage(level, message, meta = {}) {
	const timestamp = new Date().toISOString();
	const sanitizedMeta = sanitize(meta);
	return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(sanitizedMeta) : ''}`;
}

export const logger = {
	debug: (message, meta = {}) => {
		if (isDevelopment) {
			console.debug(formatMessage('debug', message, meta));
		}
	},
	
	info: (message, meta = {}) => {
		if (isDevelopment || import.meta.env.VITE_LOG_LEVEL === 'info') {
			console.info(formatMessage('info', message, meta));
		}
	},
	
	warn: (message, meta = {}) => {
		console.warn(formatMessage('warn', message, meta));
	},
	
	error: (message, meta = {}) => {
		// Em produção, enviar para serviço de monitoramento (Sentry, etc.)
		const errorData = formatMessage('error', message, meta);
		console.error(errorData);
		
		// TODO: Integrar com Sentry/LogRocket em produção
		// if (isProduction && window.Sentry) {
		// 	window.Sentry.captureException(new Error(message), { extra: sanitize(meta) });
		// }
	},
	
	// Para erros de API com response
	apiError: (error, context = {}) => {
		const meta = {
			url: error.config?.url,
			method: error.config?.method,
			status: error.response?.status,
			data: error.response?.data,
			...context
		};
		logger.error(error.message || 'API Error', meta);
	}
};

export default logger;