import React from 'react';

const ListSkeleton = ({ count = 5, variant = 'default' }) => {
	const isCompact = variant === 'compact';

	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
				>
					{isCompact ? (
						<div className="flex items-start justify-between">
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gray-200 rounded-lg" />
									<div className="space-y-1">
										<div className="h-5 bg-gray-200 rounded w-48" />
										<div className="h-3 bg-gray-200 rounded w-32" />
									</div>
								</div>
								<div className="h-3 bg-gray-200 rounded w-full mt-3" />
							</div>
							<div className="w-24 h-6 bg-gray-200 rounded-full ml-4" />
						</div>
					) : (
						<div className="flex flex-col lg:flex-row gap-6">
							<div className="flex-1 space-y-3">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="h-5 bg-gray-200 rounded w-48" />
										<div className="flex gap-4">
											<div className="h-4 bg-gray-200 rounded w-24" />
											<div className="h-4 bg-gray-200 rounded w-6" />
											<div className="h-4 bg-gray-200 rounded w-24" />
											<div className="h-4 bg-gray-200 rounded w-16" />
										</div>
									</div>
									<div className="w-24 h-6 bg-gray-200 rounded-full" />
								</div>
								{/* Detalhes extras */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="space-y-1">
											<div className="h-3 bg-gray-200 rounded w-12" />
											<div className="h-4 bg-gray-200 rounded w-16" />
										</div>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-2 lg:pl-6 lg:border-l lg:border-gray-100">
								<div className="w-28 h-10 bg-gray-200 rounded-lg" />
								<div className="w-28 h-10 bg-gray-200 rounded-lg" />
							</div>
						</div>
					)}
				</div>
			))}

			{/* Paginação placeholder */}
			<div className="flex items-center justify-between pt-6 border-t border-gray-100">
				<div className="h-4 bg-gray-200 rounded w-64" />
				<div className="flex gap-2">
					<div className="w-20 h-10 bg-gray-200 rounded-lg" />
					<div className="w-20 h-10 bg-gray-200 rounded-lg" />
				</div>
			</div>
		</div>
	);
};

export default ListSkeleton;
