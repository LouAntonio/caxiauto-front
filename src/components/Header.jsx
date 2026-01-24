import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
	const [mobileStandOpen, setMobileStandOpen] = useState(false);

	return (
		<header
			style={{
				backgroundColor: 'rgba(255, 255, 255, 0.95)',
			}}
			className="relative z-50 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 min-h-[80px]"
		>
			<div className="mx-auto h-full">
				<div className="h-20 flex max-w-7xl mx-auto items-center justify-between gap-8 px-4 md:px-0">
					{/* Left: Logo */}
					<div className="flex items-center">
						<Link to="/" className="inline-block transition-transform hover:scale-105" aria-label="Home">
							<img src="./images/logos/LogoOficialCrooped.png" alt="FinTech" className="h-12 rounded-lg object-cover" />
						</Link>
					</div>

					{/* Center: Navigation - Desktop */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							to="/"
							className="text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] hover:after:w-full after:transition-all"
						>
							Home
						</Link>
						<Link
							to="/sobre"
							className="text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] hover:after:w-full after:transition-all"
						>
							Sobre
						</Link>
						<Link
							to="/como-funciona"
							className="text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] hover:after:w-full after:transition-all"
						>
							Como Funciona
						</Link>
						<Link
							to="/parceiros"
							className="text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] hover:after:w-full after:transition-all"
						>
							Parceiros
						</Link>

						{/* Serviços com submenu - Desktop */}
						<div className="relative group">
							<button className="flex items-center gap-2 text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200">
								Serviços
								<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
									<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
								</svg>
							</button>
							<div
								style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
								className="absolute left-0 mt-3 w-72 rounded-lg shadow-2xl py-3 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
							>
								<Link to="/servicos/venda-de-automoveis" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Venda de Automóveis
								</Link>
								<Link to="/servicos/aluguel-de-automoveis" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Aluguel de Automóveis
								</Link>
								<Link to="/servicos/venda-de-pecas" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Venda de Peças e Acessórios
								</Link>
								<Link to="/servicos/venda-seu-automovel" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Venda seu Automóvel
								</Link>
								<Link to="/servicos/reboque" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Reboque
								</Link>
							</div>
						</div>

						{/* Stand com submenu - Desktop */}
						<div className="relative group">
							<button className="flex items-center gap-2 text-gray-700 font-medium hover:text-[var(--primary)] transition-colors duration-200">
								Stand
								<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
									<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
								</svg>
							</button>
							<div
								style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
								className="absolute left-0 mt-3 w-72 rounded-lg shadow-2xl py-3 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
							>
								<Link to="/stand/aluguel" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Aluguel
								</Link>
								<Link to="/stand/compra" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Compra
								</Link>
								<Link to="/stand/pecas-acessorios" className="block px-5 py-3 text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150 font-medium">
									Peças e Acessórios
								</Link>
							</div>
						</div>
					</nav>

					{/* Right: actions */}
					<div className="flex items-center gap-4">
						<div className="hidden md:flex items-center gap-3">
							<Link
								to="/contato"
								style={{ backgroundColor: 'var(--secondary)' }}
								className="px-6 py-2.5 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
							>
								Contato
							</Link>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								style={{ backgroundColor: 'var(--primary)' }}
								className="p-2.5 rounded-lg text-white hover:opacity-90 transition-opacity"
								aria-label="Toggle menu"
							>
								{mobileMenuOpen ? (
									<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								) : (
									<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-gray-200">
						<nav className="px-4 py-4 space-y-2">
							<Link
								to="/"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
							>
								Home
							</Link>
							<Link
								to="/sobre"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
							>
								Sobre
							</Link>
							<Link
								to="/como-funciona"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
							>
								Como Funciona
							</Link>
							<Link
								to="/parceiros"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
							>
								Parceiros
							</Link>

							{/* Serviços - Mobile */}
							<div>
								<button
									onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
									className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
								>
									Serviços
									<svg
										className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
									</svg>
								</button>

								{mobileServicesOpen && (
									<div className="ml-4 mt-2 space-y-1">
										<Link
											to="/servicos/venda-de-automoveis"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Venda de Automóveis
										</Link>
										<Link
											to="/servicos/aluguel-de-automoveis"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Aluguel de Automóveis
										</Link>
										<Link
											to="/servicos/venda-de-pecas"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Venda de Peças e Acessórios
										</Link>
										<Link
											to="/servicos/venda-seu-automovel"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Venda seu Automóvel
										</Link>
										<Link
											to="/servicos/reboque"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Reboque
										</Link>
									</div>
								)}
							</div>

							{/* Stand - Mobile */}
							<div>
								<button
									onClick={() => setMobileStandOpen(!mobileStandOpen)}
									className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
								>
									Stand
									<svg
										className={`w-4 h-4 transition-transform ${mobileStandOpen ? 'rotate-180' : ''}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
									</svg>
								</button>

								{mobileStandOpen && (
									<div className="ml-4 mt-2 space-y-1">
										<Link
											to="/stand/aluguel"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Aluguel
										</Link>
										<Link
											to="/stand/compra"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Compra
										</Link>
										<Link
											to="/stand/pecas-acessorios"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										>
											Peças e Acessórios
										</Link>
									</div>
								)}
							</div>

							{/* Botão Contato - Mobile */}
							<Link
								to="/contato"
								onClick={() => setMobileMenuOpen(false)}
								style={{ backgroundColor: 'var(--secondary)' }}
								className="block text-center px-4 py-3 rounded-lg text-white font-semibold shadow-lg mt-4"
							>
								Contato
							</Link>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
