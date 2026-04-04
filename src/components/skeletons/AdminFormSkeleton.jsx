import React from 'react';

/**
 * Skeleton para formulários e filtros admin
 * @param {Object} props
 * @param {number} props.fields - Número de campos (default: 4)
 * @param {boolean} props.hasButton - Se mostra botão de submit skeleton
 * @param {string} props.className - Classes CSS adicionais
 */
const AdminFormSkeleton = ({ fields = 4, hasButton = true, className = '' }) => {
	return (
		<div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 ${className}`}>
			<div className={`grid grid-cols-1 md:grid-cols-4 gap-4`}>
				{Array.from({ length: fields }).map((_, index) => (
					<div key={index} className="space-y-2">
						{/* Label placeholder */}
						<div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
						{/* Input placeholder */}
						<div className="h-10 bg-gray-200 rounded-lg animate-pulse" style={{ animationDelay: `${index * 0.1}s` }} />
					</div>
				))}
				{hasButton && (
					<div className="flex items-end">
						<div className="w-full h-10 bg-gray-300 rounded-lg animate-pulse" />
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminFormSkeleton;
