import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
	currentPage = 1,
	totalPages = 1,
	onPageChange,
	maxVisiblePages = 5
}) {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageClick = (page) => {
		if (page !== currentPage) {
			onPageChange(page)
		}
	}

	// Gera array de páginas visíveis
	const getVisiblePages = () => {
		const pages = []
		const halfVisible = Math.floor(maxVisiblePages / 2)

		let startPage = Math.max(1, currentPage - halfVisible)
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

		// Ajusta startPage se estiver próximo do fim
		if (endPage - startPage < maxVisiblePages - 1) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1)
		}

		// Adiciona primeira página e reticências se necessário
		if (startPage > 1) {
			pages.push(1)
			if (startPage > 2) {
				pages.push('...')
			}
		}

		// Adiciona páginas do meio
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		// Adiciona reticências e última página se necessário
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...')
			}
			pages.push(totalPages)
		}

		return pages
	}

	const visiblePages = getVisiblePages()

	// Se só houver uma página, não mostra paginação
	if (totalPages <= 1) return null

	return (
		<div className="flex justify-center">
			<nav className="flex items-center gap-2" aria-label="Paginação">
				{/* Botão Anterior */}
				<button
					onClick={handlePrevious}
					disabled={currentPage === 1}
					className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-1 font-medium text-gray-700 cursor-pointer"
					aria-label="Página anterior"
				>
					<ChevronLeft className="w-4 h-4" />
					<span className="hidden sm:inline">Anterior</span>
				</button>

				{/* Números das Páginas */}
				<div className="flex items-center gap-2">
					{visiblePages.map((page, index) => {
						if (page === '...') {
							return (
								<span
									key={`ellipsis-${index}`}
									className="px-2 text-gray-500"
								>
									...
								</span>
							)
						}

						return (
							<button
								key={page}
								onClick={() => handlePageClick(page)}
								className={`
									min-w-[40px] px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer
									${currentPage === page
										? 'bg-indigo-600 text-white shadow-md'
										: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
									}
								`}
								aria-label={`Página ${page}`}
								aria-current={currentPage === page ? 'page' : undefined}
							>
								{page}
							</button>
						)
					})}
				</div>

				{/* Botão Próximo */}
				<button
					onClick={handleNext}
					disabled={currentPage === totalPages}
					className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-1 font-medium text-gray-700 cursor-pointer"
					aria-label="Próxima página"
				>
					<span className="hidden sm:inline">Próximo</span>
					<ChevronRight className="w-4 h-4" />
				</button>
			</nav>
		</div>
	)
}
