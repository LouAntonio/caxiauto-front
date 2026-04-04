import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Botão com estado de loading integrado.
 * 
 * @param {boolean} loading - Se true, mostra spinner e desabilita o botão
 * @param {string} loadingText - Texto exibido durante o loading (opcional)
 * @param {string} variant - Cor do botão: 'primary' | 'danger' | 'success' | 'warning' | 'gray' | 'yellow'
 * @param {string} size - Tamanho: 'sm' | 'md' | 'lg'
 * @param {string} className - Classes adicionais
 * @param {React.ReactNode} children - Conteúdo normal do botão
 * @param {...rest} Restantes props passadas para <button>
 */
const ButtonLoader = ({
	loading = false,
	loadingText,
	variant = 'primary',
	size = 'md',
	className = '',
	children,
	...rest
}) => {
	const variantClasses = {
		primary: 'bg-[#154c9a] text-white hover:bg-[#123f80]',
		danger: 'bg-red-600 text-white hover:bg-red-700',
		success: 'bg-green-600 text-white hover:bg-green-700',
		warning: 'bg-orange-500 text-white hover:bg-orange-600',
		gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
		yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
		red_outline: 'bg-red-50 text-red-600 hover:bg-red-100',
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2',
		lg: 'px-6 py-3',
	};

	const baseClasses = `
		inline-flex items-center justify-center gap-2 font-medium rounded-lg
		transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
		${sizeClasses[size]}
		${variantClasses[variant] || variantClasses.primary}
		${className}
	`.trim();

	return (
		<button
			className={baseClasses}
			disabled={loading || rest.disabled}
			{...rest}
		>
			{loading && <Loader2 className="w-4 h-4 animate-spin" />}
			{loading && loadingText ? loadingText : children}
		</button>
	);
};

export default ButtonLoader;
