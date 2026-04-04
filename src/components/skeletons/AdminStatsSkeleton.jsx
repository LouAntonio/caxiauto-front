import React from 'react';

/**
 * Skeleton para cards de estatísticas do dashboard
 * @param {Object} props
 * @param {number} props.count - Número de stat cards (default: 8)
 * @param {string} props.className - Classes CSS adicionais
 */
const AdminStatsSkeleton = ({ count = 8, className = '' }) => {
	return (
		<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
					style={{ animationDelay: `${index * 0.1}s` }}
				>
					{/* Ícone placeholder */}
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-gray-200 rounded-lg" />
					</div>
					{/* Título placeholder */}
					<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
					{/* Valor placeholder */}
					<div className="h-8 bg-gray-300 rounded w-1/2" />
				</div>
			))}
		</div>
	);
};

export default AdminStatsSkeleton;
