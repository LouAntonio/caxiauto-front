import React from 'react'

export default function PartnerCardSkeleton({ count = 4 }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden flex flex-col">
					<div className="aspect-video skeleton-shimmer bg-gray-100" />

					<div className="relative -mt-12 flex justify-center z-10 mb-4">
						<div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-900/5">
							<div className="skeleton-shimmer w-full h-full rounded-full bg-gray-100" />
						</div>
					</div>

					<div className="px-5 pb-5 flex-grow flex flex-col items-center">
						<div className="skeleton-shimmer h-6 w-3/4 bg-gray-100 rounded-md mb-4" />

						<div className="w-full space-y-2 mb-6">
							<div className="skeleton-shimmer h-3 w-5/6 bg-gray-100 rounded-sm mx-auto" />
							<div className="skeleton-shimmer h-3 w-4/6 bg-gray-100 rounded-sm mx-auto" />
							<div className="skeleton-shimmer h-3 w-3/4 bg-gray-100 rounded-sm mx-auto" />
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-auto">
							<div className="skeleton-shimmer h-11 bg-gray-100 rounded-2xl" />
							<div className="skeleton-shimmer h-11 bg-gray-100 rounded-2xl" />
						</div>
					</div>
				</div>
			))}
		</>
	)
}
