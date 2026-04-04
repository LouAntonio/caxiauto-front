import React from 'react';
import SkeletonCard from './SkeletonCard';

const DashboardSkeleton = () => {
	return (
		<div className="space-y-6">
			{/* Card de Perfil */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{/* Header do Card */}
				<div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
					<div className="flex items-center gap-4">
						<div className="w-20 h-20 bg-gray-400 rounded-full animate-pulse" />
						<div className="space-y-2">
							<div className="h-6 bg-gray-400 rounded w-48 animate-pulse" />
							<div className="h-4 bg-gray-400 rounded w-64 animate-pulse" />
						</div>
					</div>
				</div>

				{/* Informações */}
				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="flex items-start gap-3">
								<div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5" />
								<div className="space-y-1 flex-1">
									<div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
									<div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
								</div>
							</div>
						))}
					</div>
					<div className="flex gap-3 pt-4 border-t">
						<div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
						<div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
					</div>
				</div>
			</div>

			{/* Estatísticas de Visualizações */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
					<div className="h-6 bg-gray-200 rounded w-56 animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<SkeletonCard variant="stat" />
					<SkeletonCard variant="stat" />
					<SkeletonCard variant="stat" />
				</div>
			</div>
		</div>
	);
};

export default DashboardSkeleton;
