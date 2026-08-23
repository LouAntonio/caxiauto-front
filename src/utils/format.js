export const formatKz = (value) =>
	new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(Number(value || 0));

export const formatPercent = (value) =>
	`${(Number(value || 0) * 100).toLocaleString('pt-AO', { maximumFractionDigits: 2 })}%`;
