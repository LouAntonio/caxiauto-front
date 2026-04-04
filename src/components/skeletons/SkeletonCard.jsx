import React from 'react';

const SkeletonCard = ({ variant = 'card', className = '' }) => {
	const baseClasses = 'animate-pulse rounded-lg bg-gray-200';

	if (variant === 'stat') {
		return (
			<div className={`animate-pulse rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-4 border border-gray-200 ${className}`}>
				<div className="flex items-center justify-between mb-2">
					<div className="w-5 h-5 bg-gray-300 rounded" />
					<div className="w-12 h-3 bg-gray-300 rounded" />
				</div>
				<div className="w-20 h-8 bg-gray-300 rounded mb-2" />
				<div className="w-28 h-3 bg-gray-300 rounded" />
			</div>
		);
	}

	if (variant === 'text') {
		return <div className={`${baseClasses} ${className}`} />;
	}

	if (variant === 'avatar') {
		return <div className={`${baseClasses} rounded-full ${className}`} />;
	}

	if (variant === 'button') {
		return <div className={`${baseClasses} h-10 rounded-lg ${className}`} />;
	}

	// card default
	return (
		<div className={`animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
			<div className="h-48 bg-gray-200" />
			<div className="p-5 space-y-3">
				<div className="h-5 bg-gray-200 rounded w-3/4" />
				<div className="h-3 bg-gray-200 rounded w-1/2" />
				<div className="space-y-2">
					<div className="h-3 bg-gray-200 rounded w-full" />
					<div className="h-3 bg-gray-200 rounded w-2/3" />
				</div>
				<div className="h-10 bg-gray-200 rounded-lg mt-4" />
			</div>
		</div>
	);
};

export default SkeletonCard;
