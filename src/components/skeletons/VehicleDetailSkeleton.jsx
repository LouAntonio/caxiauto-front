import React from 'react';

/**
 * Skeleton for vehicle detail pages (Compra & Aluguel).
 * Mirrors the 2-column layout: main content + sticky sidebar.
 */
export default function VehicleDetailSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
			{/* Breadcrumb skeleton */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center gap-2">
						<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Column */}
					<div className="lg:col-span-2 space-y-6">
						{/* Gallery skeleton */}
						<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
							<div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-20 h-20 bg-gray-400 rounded-full opacity-50" />
								</div>
								{/* Badge placeholder */}
								<div className="absolute top-4 left-4">
									<div className="w-20 h-8 bg-gray-400 rounded-full opacity-60" />
								</div>
								{/* Favorite button placeholder */}
								<div className="absolute top-4 right-4">
									<div className="w-12 h-12 bg-gray-400 rounded-full opacity-60" />
								</div>
							</div>
							{/* Thumbnails skeleton */}
							<div className="p-4 flex gap-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
								))}
							</div>
						</div>

						{/* Title & Specs skeleton */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
									<div key={i} className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl animate-pulse">
										<div className="w-6 h-6 bg-gray-300 rounded mb-2" />
										<div className="w-16 h-3 bg-gray-200 rounded mb-1" />
										<div className="w-12 h-4 bg-gray-300 rounded" />
									</div>
								))}
							</div>
						</div>

						{/* Description skeleton */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1 h-6 bg-gray-300 rounded-full animate-pulse" />
								<div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="space-y-2">
								<div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
								<div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
								<div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
							</div>
						</div>

						{/* Features skeleton */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1 h-6 bg-gray-300 rounded-full animate-pulse" />
								<div className="h-7 w-56 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<div key={i} className="flex items-center gap-2 p-2 rounded-lg animate-pulse">
										<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0" />
										<div className="h-4 w-24 bg-gray-200 rounded" />
									</div>
								))}
							</div>
						</div>

						{/* Included skeleton */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1 h-6 bg-gray-300 rounded-full animate-pulse" />
								<div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="space-y-3">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
										<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0 mt-0.5" />
										<div className="h-4 w-40 bg-gray-200 rounded" />
									</div>
								))}
							</div>
						</div>

						{/* Requirements skeleton */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1 h-6 bg-gray-300 rounded-full animate-pulse" />
								<div className="h-7 w-44 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
										<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0 mt-0.5" />
										<div className="h-4 w-32 bg-gray-200 rounded" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar Column */}
					<div className="lg:col-span-1">
						<div className="sticky top-16 space-y-4">
							{/* Price card skeleton */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-4" />
								<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 animate-pulse">
									<div className="h-9 w-36 bg-gray-300 rounded mb-1" />
									<div className="h-4 w-10 bg-gray-200 rounded" />
								</div>
								<div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse mb-3" />
								<div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse" />
							</div>

							{/* Contact card skeleton */}
							<div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl shadow-xl p-6 border border-indigo-400/20">
								<div className="h-6 w-36 bg-indigo-400/40 rounded animate-pulse mb-4" />
								<div className="h-4 w-full bg-indigo-400/30 rounded animate-pulse mb-4" />
								<div className="space-y-3">
									<div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl animate-pulse">
										<div className="w-5 h-5 bg-indigo-400/40 rounded" />
										<div className="flex-1 space-y-1">
											<div className="h-4 w-28 bg-indigo-400/40 rounded" />
											<div className="h-3 w-20 bg-indigo-400/30 rounded" />
										</div>
									</div>
									<div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl animate-pulse">
										<div className="w-5 h-5 bg-indigo-400/40 rounded" />
										<div className="flex-1 space-y-1">
											<div className="h-4 w-32 bg-indigo-400/40 rounded" />
											<div className="h-3 w-24 bg-indigo-400/30 rounded" />
										</div>
									</div>
								</div>
							</div>

							{/* Why us card skeleton */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg animate-pulse">
								<div className="h-6 w-44 bg-indigo-200 rounded animate-pulse mb-4" />
								<div className="space-y-3">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
											<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0 mt-0.5" />
											<div className="h-4 w-32 bg-gray-200 rounded" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
