import React from 'react';

const LojaPageHeader = ({ eyebrow, title, description, children }) => {
	return (
		<div className="mb-6">
			{eyebrow && (
				<p className="font-data text-xs uppercase tracking-[0.25em] text-ambar mb-1">{eyebrow}</p>
			)}
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="min-w-0">
					<h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">{title}</h2>
					{description && <p className="mt-1 text-sm text-aco">{description}</p>}
				</div>
				{children && <div className="flex items-center gap-3 flex-wrap">{children}</div>}
			</div>
		</div>
	);
};

export default LojaPageHeader;
