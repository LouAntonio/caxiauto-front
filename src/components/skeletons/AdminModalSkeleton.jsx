import React from 'react';

/**
 * Skeleton para conteúdo de modais admin
 * @param {Object} props
 * @param {string} props.variant - Variante: 'details' | 'form' | 'simple'
 * @param {string} props.className - Classes CSS adicionais
 */
const AdminModalSkeleton = ({ variant = 'details', className = '' }) => {
	if (variant === 'form') {
		return (
			<div className={`space-y-4 ${className}`}>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="space-y-2">
						<div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
						<div className="h-10 bg-gray-200 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
					</div>
				))}
				<div className="flex gap-2 pt-4">
					<div className="h-10 bg-gray-300 rounded-lg w-24 animate-pulse" />
					<div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
				</div>
			</div>
		);
	}

	if (variant === 'simple') {
		return (
			<div className={`space-y-3 ${className}`}>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-center gap-3">
						<div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
					</div>
				))}
			</div>
		);
	}

	// Variant 'details' - modal de detalhes com imagem e grid
	return (
		<div className={`space-y-6 ${className}`}>
			{/* Imagem placeholder */}
			<div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse" />

			{/* Grid de informações */}
			<div className="grid grid-cols-2 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="bg-gray-50 p-3 rounded-lg space-y-2">
						<div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
						<div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
					</div>
				))}
			</div>

			{/* Seção extra */}
			<div className="space-y-3 pt-4 border-t border-gray-100">
				<div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
				))}
			</div>
		</div>
	);
};

export default AdminModalSkeleton;
