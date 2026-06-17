import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function MobileFilterModal({
	isOpen,
	onClose,
	title = 'Filtros',
	children
}) {
	useEffect(() => {
		if (!isOpen) {
			return undefined
		}

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', handleEscape)

		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-2xl shadow-2xl animate-slideUp flex flex-col">
				<div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb] sticky top-0 bg-white rounded-t-2xl z-10">
					<h2 className="font-display text-lg font-bold text-[#111827]">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="w-9 h-9 rounded-full bg-[#eef3fa] text-[#6b7280] flex items-center justify-center transition-colors cursor-pointer hover:bg-[#dce5f5]"
						aria-label="Fechar filtros"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="overflow-y-auto p-4 pb-6">
					{children}
				</div>
			</div>
		</div>
	)
}
