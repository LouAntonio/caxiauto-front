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

			<div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-3xl shadow-2xl animate-slideUp flex flex-col">
				<div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl z-10">
					<h2 className="text-lg font-bold text-gray-900">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
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
