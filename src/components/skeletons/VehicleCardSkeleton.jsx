import React from 'react';

const VehicleCardSkeleton = ({ count = 4 }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
				>
					{/* Imagem placeholder */}
					<div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-16 h-16 bg-gray-400 rounded-full opacity-50" />
						</div>
						{/* Badges placeholder */}
						<div className="absolute top-3 right-3 flex gap-2">
							<div className="w-16 h-5 bg-gray-400 rounded-full opacity-60" />
							<div className="w-14 h-5 bg-gray-400 rounded-full opacity-60" />
						</div>
					</div>

					{/* Informações */}
					<div className="p-5 space-y-3">
						<div className="h-5 bg-gray-200 rounded w-3/4" />
						<div className="h-3 bg-gray-200 rounded w-1/2" />

						<div className="space-y-2">
							<div className="h-3 bg-gray-200 rounded w-1/3" />
							<div className="h-3 bg-gray-200 rounded w-2/5" />
							<div className="h-3 bg-gray-200 rounded w-1/4" />
							<div className="h-3 bg-gray-200 rounded w-1/3" />
							<div className="h-4 bg-gray-200 rounded w-2/5" />
						</div>

						{/* Stats de visualizações */}
						<div className="flex items-center justify-between pt-3 border-t border-gray-100">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-200 rounded" />
								<div className="h-3 bg-gray-200 rounded w-8" />
								<div className="h-3 bg-gray-200 rounded w-8" />
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-gray-200 rounded" />
								<div className="h-3 bg-gray-200 rounded w-8" />
								<div className="h-3 bg-gray-200 rounded w-8" />
							</div>
						</div>

						{/* Botões de ação */}
						<div className="flex gap-2 pt-4 border-t border-gray-100">
							<div className="flex-1 h-10 bg-gray-200 rounded-lg" />
							<div className="w-10 h-10 bg-gray-200 rounded-lg" />
							<div className="w-10 h-10 bg-gray-200 rounded-lg" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default VehicleCardSkeleton;
