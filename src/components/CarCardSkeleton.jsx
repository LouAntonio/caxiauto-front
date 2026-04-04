import React from 'react';

export default function CarCardSkeleton({ count = 4, className = '' }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<article
					key={i}
					className={`flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
				>
					{/* Imagem skeleton */}
					<div className="skeleton-shimmer relative h-40 bg-gray-200" />

					{/* Conteúdo skeleton */}
					<div className="p-5">
						{/* Título */}
						<div className="flex justify-center mb-3">
							<div className="skeleton-shimmer h-5 w-3/4 bg-gray-200 rounded-md" />
						</div>

						{/* Preço */}
						<div className="flex justify-center mb-4">
							<div className="skeleton-shimmer h-5 w-1/2 bg-gray-200 rounded-md" />
						</div>

						{/* Especificações grid 2x2 */}
						<div className="grid grid-cols-2 gap-2">
							<div className="flex items-center justify-end gap-2">
								<div className="skeleton-shimmer h-4 w-16 bg-gray-200 rounded-md" />
								<div className="skeleton-shimmer h-4 w-4 bg-gray-200 rounded-full" />
							</div>
							<div className="flex items-center gap-2">
								<div className="skeleton-shimmer h-4 w-4 bg-gray-200 rounded-full" />
								<div className="skeleton-shimmer h-4 w-12 bg-gray-200 rounded-md" />
							</div>
							<div className="flex items-center justify-end gap-2">
								<div className="skeleton-shimmer h-4 w-14 bg-gray-200 rounded-md" />
								<div className="skeleton-shimmer h-4 w-4 bg-gray-200 rounded-full" />
							</div>
							<div className="flex items-center gap-2">
								<div className="skeleton-shimmer h-4 w-4 bg-gray-200 rounded-full" />
								<div className="skeleton-shimmer h-4 w-16 bg-gray-200 rounded-md" />
							</div>
						</div>

						{/* Botão */}
						<div className="skeleton-shimmer h-9 w-full mt-4 bg-gray-200 rounded-lg" />
					</div>
				</article>
			))}
		</>
	);
}
