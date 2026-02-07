import React from 'react'
import { Link } from 'react-router-dom'
import { Home, MessageCircle, ArrowLeft, Search } from 'lucide-react'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
	useDocumentTitle('404 - Página não encontrada')

	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 py-12">
			<div className="max-w-7xl w-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Illustration */}
					<div className="flex justify-center lg:justify-end">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
							<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
								<defs>
									<linearGradient id="carGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" stopColor="#6366f1" />
										<stop offset="100%" stopColor="#8b5cf6" />
									</linearGradient>
								</defs>

								{/* Road */}
								<path d="M 20 280 Q 160 260 300 280" stroke="#e5e7eb" strokeWidth="80" strokeLinecap="round" fill="none" />
								<path d="M 20 280 Q 160 260 300 280" stroke="#d1d5db" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="20 15" />

								{/* Car */}
								<g className="animate-bounce" style={{ animationDuration: '3s' }}>
									<rect x="100" y="180" width="120" height="50" rx="10" fill="url(#carGradient404)" />
									<rect x="115" y="190" width="35" height="25" rx="3" fill="#c7d2fe" opacity="0.6" />
									<rect x="170" y="190" width="35" height="25" rx="3" fill="#c7d2fe" opacity="0.6" />
									<path d="M 110 180 Q 140 150 180 150 Q 210 150 210 180" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" fill="none" />
									<circle cx="125" cy="235" r="12" fill="#1e293b" />
									<circle cx="125" cy="235" r="7" fill="#64748b" />
									<circle cx="195" cy="235" r="12" fill="#1e293b" />
									<circle cx="195" cy="235" r="7" fill="#64748b" />
								</g>

								{/* 404 Numbers floating */}
								<text x="40" y="100" fontSize="72" fontWeight="bold" fill="#6366f1" opacity="0.3" className="animate-pulse">4</text>
								<text x="240" y="80" fontSize="72" fontWeight="bold" fill="#8b5cf6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }}>4</text>
							</svg>
						</div>
					</div>

					{/* Right: Content */}
					<div className="text-center lg:text-left">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
							<Search className="w-4 h-4" />
							Erro 404
						</div>

						<h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
							Oops! Página não encontrada
						</h1>

						<p className="mt-4 text-lg text-gray-600">
							A página que procura pode ter sido removida, o nome pode ter mudado ou está temporariamente indisponível.
						</p>

						<div className="mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
							<Link
								to="/"
								style={{ backgroundColor: 'var(--primary)' }}
								className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
							>
								<Home className="w-5 h-5" />
								Voltar à página inicial
							</Link>

							<Link
								to="/contato"
								className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
							>
								<MessageCircle className="w-5 h-5" />
								Contacte-nos
							</Link>
						</div>

						<div className="mt-8 pt-8 border-t border-gray-200">
							<p className="text-sm text-gray-500 mb-3">Links úteis:</p>
							<div className="flex flex-wrap gap-3 lg:justify-start justify-center">
								<Link to="/sobre" className="text-sm text-indigo-600 hover:underline">Sobre nós</Link>
								<span className="text-gray-300">•</span>
								<Link to="/stand/compra" className="text-sm text-indigo-600 hover:underline">Comprar veículos</Link>
								<span className="text-gray-300">•</span>
								<Link to="/como-funciona" className="text-sm text-indigo-600 hover:underline">Como funciona</Link>
								<span className="text-gray-300">•</span>
								<Link to="/contato" className="text-sm text-indigo-600 hover:underline">Ajuda</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
