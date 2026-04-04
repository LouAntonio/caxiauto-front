import React from 'react';

/**
 * Skeleton para tabelas admin
 * @param {Object} props
 * @param {number} props.rows - Número de linhas placeholder (default: 5)
 * @param {number} props.columns - Número de colunas (default: 6)
 * @param {string} props.className - Classes CSS adicionais
 */
const AdminTableSkeleton = ({ rows = 5, columns = 6, className = '' }) => {
	// Larguras variadas para colunas simulando conteúdo real
	const getColumnWidth = (index) => {
		const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-1/2', 'w-2/5', 'w-1/4', 'w-3/5'];
		return widths[index % widths.length];
	};

	return (
		<div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
			{/* Header da tabela skeleton */}
			<div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
				<div className="flex gap-4">
					{Array.from({ length: columns }).map((_, i) => (
						<div key={`header-${i}`} className={`h-3 bg-gray-300 rounded ${getColumnWidth(i)}`} />
					))}
				</div>
			</div>

			{/* Linhas da tabela skeleton */}
			<div className="divide-y divide-gray-100">
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div key={`row-${rowIndex}`} className="px-4 py-4">
						<div className="flex items-center gap-4">
							{Array.from({ length: columns }).map((_, colIndex) => (
								<div
									key={`row-${rowIndex}-col-${colIndex}`}
									className={`h-4 bg-gray-200 rounded ${getColumnWidth(colIndex)} animate-pulse`}
									style={{ animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s` }}
								/>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Footer/paginação skeleton */}
			<div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
				<div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
				<div className="flex gap-2">
					<div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
				</div>
			</div>
		</div>
	);
};

export default AdminTableSkeleton;
