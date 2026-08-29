export const formatKz = (value) =>
	new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(Number(value || 0));

export const formatNumber = (value, maxFractionDigits = 0) =>
	new Intl.NumberFormat('pt-AO', { maximumFractionDigits: maxFractionDigits }).format(Number(value || 0));

export const formatPercent = (value) =>
	`${(Number(value || 0) * 100).toLocaleString('pt-AO', { maximumFractionDigits: 2 })}%`;

export const formatDate = (value, options = {}) => {
	if (!value) return '—';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat('pt-AO', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		...options,
	}).format(date);
};

// Data local no formato yyyy-mm-dd (para <input type="date">)
export const toLocalDateString = (value) => {
	if (!value) return '';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return '';
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
};

// Converte yyyy-mm-dd num Date à meia-noite local (evita desvio de fuso)
export const fromLocalDate = (value) => {
	if (!value) return null;
	const [y, m, d] = value.split('-').map(Number);
	if (!y || !m || !d) return null;
	return new Date(y, m - 1, d);
};
