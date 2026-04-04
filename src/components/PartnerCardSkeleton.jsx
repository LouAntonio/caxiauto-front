import React from 'react';

export default function PartnerCardSkeleton({ count = 4, className = '' }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<div 
					key={i} 
					className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${className}`}
				>
					{/* Banner Skeleton */}
					<div className="skeleton-shimmer h-36 bg-gray-200" />

					{/* Logo Circular Skeleton */}
					<div className="relative -mt-16 flex justify-center z-10">
						<div className="w-28 h-28 rounded-full bg-white p-2 shadow-lg">
							<div className="skeleton-shimmer w-full h-full rounded-full bg-gray-200" />
						</div>
					</div>

					{/* Body Skeleton */}
					<div className="p-5 pt-3 flex-grow flex flex-col items-center">
						{/* Name */}
						<div className="skeleton-shimmer h-6 w-3/4 bg-gray-200 rounded-md mb-4" />

						{/* Characteristics */}
						<div className="w-full space-y-2 mb-6">
							<div className="skeleton-shimmer h-3 w-5/6 bg-gray-100 rounded-sm mx-auto" />
							<div className="skeleton-shimmer h-3 w-4/6 bg-gray-100 rounded-sm mx-auto" />
							<div className="skeleton-shimmer h-3 w-3/4 bg-gray-100 rounded-sm mx-auto" />
						</div>

						{/* CaxiAuto Logo placeholder */}
						<div className="skeleton-shimmer h-10 w-24 bg-gray-50 rounded-md mb-6" />

						{/* Action Buttons */}
						<div className="grid grid-cols-2 gap-3 w-full mt-auto">
							<div className="skeleton-shimmer h-10 bg-gray-200 rounded-lg" />
							<div className="skeleton-shimmer h-10 bg-gray-200 rounded-lg" />
						</div>
					</div>
				</div>
			))}
		</>
	);
}
