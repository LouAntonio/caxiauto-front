// =============================================================
// Facebook Pixel — módulo central
// =============================================================
// Espelha a estrutura de `analytics.js` (GA4), mas com as regras do
// Pixel numa SPA (BrowserRouter): `autoPageView: false` e PageView
// manual a cada navegação.
//
// Se VITE_FACEBOOK_PIXEL_ID estiver vazio/ausente, `initPixel()` não faz
// nada e todos os helpers abaixo são no-op — zero impacto em produção.
//
// Sem PII: sem Conversions API não há benefit em enviar email/telefone
// do utilizador, e evitamos problemas de privacidade. Para remarketing
// por estado do site, os helpers de login/registo enviam content_category.
// =============================================================

export const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || '';

// Kwanza. Sobrescreve com VITE_FACEBOOK_PIXEL_CURRENCY se a conta de
// publicidade estiver a agregar noutra moeda.
export const PIXEL_CURRENCY = import.meta.env.VITE_FACEBOOK_PIXEL_CURRENCY || 'AOA';

const READY_FLAG = '__caxiautoPixelReady';
const LAST_PAGEVIEW = '__caxiautoPixelLastPageView';

// Categorias de negócio usadas em `content_category`, para separar os
// sistemas dentro do mesmo Pixel (stand / stand-aluguer / peças).
export const CATEGORY = {
	VEHICLE: 'vehicle',
	VEHICLE_RENTAL: 'vehicle_rental',
	PART: 'part',
	PARTNER: 'partner',
	BOOKING: 'booking',
	SUBSCRIPTION: 'subscription',
	HIGHLIGHT: 'highlight',
	CONTACT: 'contact',
	CHAT: 'chat',
	REGISTRATION: 'registration',
};

const isReady = () =>
	typeof window !== 'undefined' && READY_FLAG in window && typeof window.fbq === 'function';

/**
 * Carrega o snippet base do Facebook e faz `init` com autoPageView
 * desligado (numa SPA quem dispara o PageView é o router).
 * Idempotente — pode ser chamado várias vezes (StrictMode) sem
 * duplicar o script nem os listeners.
 */
export const initPixel = () => {
	if (typeof window === 'undefined' || !PIXEL_ID) return;

	if (READY_FLAG in window) {
		if (isReady()) window.fbq('init', PIXEL_ID, { autoPageView: false });
		return;
	}

	window[READY_FLAG] = true;

	// Snippet base do Facebook: cria a fila antes de o script carregar,
	// para que nenhum evento inicial se perca.
	const fbq = (window.fbq = function () {
		if (fbq.callMethod) return fbq.callMethod(...arguments);
		(fbq.queue = fbq.queue || []).push(arguments);
	});
	fbq.version = '2.0';
	fbq.callMethod = window.fbq.callMethod || function () {
		return fbq.callMethod(...arguments);
	};
	window.fbq.queue = [];

	// A SPA não recarrega a página, por isso apenas o <noscript> garante
	// a cobertura para crawlers/bots que não executam JS.
	const noscript = document.createElement('noscript');
	noscript.innerHTML = `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" />`;
	document.body.appendChild(noscript);

	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://connect.facebook.net/en_US/fbevents.js';
	document.body.appendChild(script);

	fbq('init', PIXEL_ID, { autoPageView: false });
};

/**
 * Dispara um PageView para a rota actual. O mesmo path não é enviado
 * duas vezes seguidas (StrictMode executa efeitos duas vezes em dev).
 */
export const pixelPageView = (url) => {
	if (!isReady() || !url) return;
	if (window[LAST_PAGEVIEW] === url) return;
	window[LAST_PAGEVIEW] = url;
	window.fbq('track', 'PageView', {});
};

// -----------------------------------------------------------------
// Helpers de eventos
// -----------------------------------------------------------------

const toNumber = (value) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : undefined;
};

const compact = (params) =>
	Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));

/** Evento genérico. Não faz nada se o snippet não carregou. */
export const pixelEvent = (name, params = {}) => {
	if (!isReady()) return;
	window.fbq('track', name, compact(params));
};

/**
 * Dados de catálogo de um item (veículo, peça, plano).
 * `type`: 'vehicle' | 'rental' | 'part' | 'plan'
 */
export const pixelContent = ({ type = 'vehicle', id, name, price, category } = {}) => {
	if (!id) return {};
	return compact({
		content_type: type === 'vehicle' || type === 'rental' ? 'product' : 'product_group',
		content_ids: [String(id)],
		content_name: name,
		content_category: category,
		value: toNumber(price),
		currency: PIXEL_CURRENCY,
	});
};

/** Vista a um anúncio (página de detalhe). `value` = preço do anúncio. */
export const pixelViewContent = (content) => {
	if (!content || !content.content_ids) return;
	pixelEvent('ViewContent', content);
};

/** Pesquisa nas listagens públicas. */
export const pixelSearch = (searchString, category) => {
	const term = (searchString || '').trim();
	if (!term) return;
	pixelEvent('Search', compact({ search_string: term, content_category: category }));
};

/** Lead: qualquer formulário de contacto que chegue ao backend com sucesso. */
export const pixelLead = (category, content = {}) => {
	pixelEvent('Lead', compact({ ...content, content_category: category }));
};

/** Item colocado na lista de favoritos. */
export const pixelAddToCart = (content) => pixelEvent('AddToCart', content);

/** Início do processo de reserva/compra de um plano. */
export const pixelInitiateCheckout = (content) => pixelEvent('InitiateCheckout', content);

/** Conversão concluída (reserva criada, pagamento gerado). */
export const pixelPurchase = (content) => pixelEvent('Purchase', content);

/** Clique num plano de assinatura (topo do funil do vendedor). */
export const pixelStartTrial = (content) => pixelEvent('StartTrial', content);

/** Assinatura criada. */
export const pixelSubscribe = (content) => pixelEvent('Subscribe', content);

/** Interacção directa: abrir o chat, enviar mensagem, contacto social. */
export const pixelContact = (category) => pixelEvent('Contact', { content_category: category });

/** Registo de conta concluído. */
export const pixelCompleteRegistration = (category = CATEGORY.REGISTRATION) =>
	pixelEvent('CompleteRegistration', { content_category: category });

/** Login com sucesso (por método). */
export const pixelLogin = (method) => pixelEvent('Login', { content_category: method });

/**
 * Limpa o estado do pixel no logout. Sem Conversions API não enviamos
 * PII, mas mesmo assim evita que os eventos do próximo utilizador neste
 * browser herdem o contexto do anterior.
 */
export const pixelReset = () => {
	if (!isReady()) return;
	window.fbq('fbDeauthenticate');
	window[LAST_PAGEVIEW] = undefined;
};
