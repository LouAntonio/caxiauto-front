const STORAGE_KEY = 'caxiauto_viewed';

// Regista visualização uma única vez por sessão (evita duplicação em
// StrictMode/remounts). Retorna true se deve efetivamente contar a view.
export const recordViewOnce = (type, id) => {
	if (!id) return false;
	let viewed = {};
	try {
		viewed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
	} catch {
		viewed = {};
	}
	if (viewed[type]?.[id]) return false;
	viewed[type] = viewed[type] || {};
	viewed[type][id] = Date.now();
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
	} catch {
		// sessão indisponível — não bloqueia o registo
	}
	return true;
};