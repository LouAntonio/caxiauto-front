import React from 'react';

export default function PecaCardSkeleton({ count = 4, className = '' }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<article
					key={i}
					className={`flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
				>
					{/* Imagem skeleton */}
					<div className="skeleton-shimmer relative h-36 bg-gray-200" />

					{/* Conteúdo skeleton */}
					<div className="flex flex-col flex-grow p-4">
						{/* Título - duas linhas simuladas */}
						<div className="space-y-2 mb-3">
							<div className="skeleton-shimmer h-4 w-full bg-gray-200 rounded-md" />
							<div className="skeleton-shimmer h-4 w-2/3 bg-gray-200 rounded-md" />
						</div>

						{/* Preço */}
						<div className="mb-4">
							<div className="skeleton-shimmer h-5 w-1/2 bg-gray-200 rounded-md" />
						</div>

						{/* Categoria */}
						<div className="flex items-center justify-between mb-4">
							<div className="skeleton-shimmer h-5 w-24 bg-gray-200 rounded-md" />
						</div>

						{/* Botão */}
						<div className="mt-auto">
							<div className="skeleton-shimmer h-8 w-full bg-gray-200 rounded-md" />
						</div>
					</div>
				</article>
			))}
		</>
	);
}
