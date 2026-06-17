import React from 'react';

export default function PecaCardSkeleton({ count = 4, className = '' }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<article
					key={i}
					className={`flex-shrink-0 w-full bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden ${className}`}
				>
					<div className="skeleton-shimmer relative h-40 bg-gray-200" />

					<div className="p-5">
						<div className="flex justify-center mb-3">
							<div className="skeleton-shimmer h-5 w-3/4 bg-gray-200 rounded-md" />
						</div>

						<div className="flex justify-center mb-4">
							<div className="skeleton-shimmer h-5 w-1/2 bg-gray-200 rounded-md" />
						</div>

						<div className="flex justify-center mb-4">
							<div className="skeleton-shimmer h-5 w-24 bg-gray-200 rounded-md" />
						</div>

						<div className="skeleton-shimmer h-9 w-full mt-4 bg-gray-200 rounded-lg" />
					</div>
				</article>
			))}
		</>
	);
}
