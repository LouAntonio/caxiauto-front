import React from 'react';

export default function PecaDetailSkeleton() {
	return (
		<div className="min-h-screen bg-white">
			<div className="bg-white border-b border-[#e5e7eb] sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center gap-2">
						<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
							<div className="relative h-96 bg-gray-200 animate-pulse">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-20 h-20 bg-gray-300 rounded-full opacity-50" />
								</div>
								<div className="absolute top-4 left-4">
									<div className="w-20 h-8 bg-gray-300 rounded-full opacity-60" />
								</div>
								<div className="absolute top-4 right-4">
									<div className="w-9 h-9 bg-gray-300 rounded-full opacity-60" />
								</div>
							</div>
							<div className="p-4 flex gap-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
								))}
							</div>
						</div>

						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl animate-pulse">
										<div className="w-6 h-6 bg-gray-300 rounded mb-2" />
										<div className="w-16 h-3 bg-gray-200 rounded mb-1" />
										<div className="w-12 h-4 bg-gray-300 rounded" />
									</div>
								))}
							</div>
						</div>

						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<div className="flex items-center gap-2 mb-4">
								<div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex items-center gap-2 p-3 rounded-lg animate-pulse">
										<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0" />
										<div className="h-4 w-28 bg-gray-200 rounded" />
									</div>
								))}
							</div>
						</div>

						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<div className="flex items-center gap-2 mb-4">
								<div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="flex items-center gap-4 p-4 bg-[#f8f6f2] rounded-xl animate-pulse">
								<div className="w-14 h-14 bg-gray-300 rounded-full" />
								<div className="flex-1 space-y-2">
									<div className="h-5 w-32 bg-gray-300 rounded" />
									<div className="h-4 w-28 bg-gray-200 rounded" />
								</div>
								<div className="h-4 w-16 bg-gray-300 rounded" />
							</div>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="sticky top-16 space-y-4">
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<div className="h-6 w-14 bg-gray-200 rounded animate-pulse mb-4" />
								<div className="bg-[#f8f6f2] rounded-xl p-5 mb-6 animate-pulse">
									<div className="h-9 w-36 bg-gray-300 rounded mb-1" />
									<div className="h-4 w-8 bg-gray-200 rounded" />
								</div>

								<div className="mb-6">
									<div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
										<div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" />
										<div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
									</div>
								</div>

								<div className="bg-[#f8f6f2] rounded-xl p-4 mb-4 animate-pulse">
									<div className="flex justify-between items-center">
										<div className="h-5 w-28 bg-gray-300 rounded" />
										<div className="h-7 w-24 bg-gray-300 rounded" />
									</div>
								</div>

								<div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse mb-3" />
								<div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
							</div>

							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
								<div className="space-y-3">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="flex justify-between items-center py-2 border-b border-[#e5e7eb] animate-pulse">
											<div className="h-4 w-16 bg-gray-200 rounded" />
											<div className="h-4 w-20 bg-gray-300 rounded" />
										</div>
									))}
								</div>
							</div>

							<div className="bg-[#f8f6f2] border border-[#e5e7eb] rounded-2xl p-5 animate-pulse">
								<div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
								<div className="space-y-3">
									{[1, 2, 3].map((i) => (
										<div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl">
											<div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0 mt-0.5" />
											<div className="h-4 w-28 bg-gray-200 rounded" />
										</div>
									))}
								</div>
							</div>

							<div className="bg-[#154c9a] rounded-2xl p-6">
								<div className="h-6 w-36 bg-white/20 rounded animate-pulse mb-4" />
								<div className="h-4 w-full bg-white/20 rounded animate-pulse mb-4" />
								<div className="space-y-3">
									<div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl animate-pulse">
										<div className="w-5 h-5 bg-white/20 rounded" />
										<div className="flex-1 space-y-1">
											<div className="h-4 w-28 bg-white/20 rounded" />
											<div className="h-3 w-20 bg-white/10 rounded" />
										</div>
									</div>
									<div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl animate-pulse">
										<div className="w-5 h-5 bg-white/20 rounded" />
										<div className="flex-1 space-y-1">
											<div className="h-4 w-32 bg-white/20 rounded" />
											<div className="h-3 w-24 bg-white/10 rounded" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
