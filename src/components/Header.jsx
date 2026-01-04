import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header
					style={{
						backgroundColor: 'rgba(255, 255, 255, 0.95)',
				}}
				className="relative z-50 backdrop-blur-md rounded-xl shadow-xl border border-gray-100"
				>
			<div className="mx-auto ">
				<div
					className="py-4 flex max-w-7xl mx-auto items-center justify-between gap-8"
				>
					{/* Left: Logo */}
					<div className="flex items-center">
						<Link to="/" className="inline-block transition-transform hover:scale-105" aria-label="Home">
							<img src="/LogoOficialCrooped.png" alt="FinTech" className="h-12 rounded-lg object-cover" />
						</Link>
					</div>

					{/* Center: Navigation */}
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

						{/* Serviços com submenu */}
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

						<div className="md:hidden">
							<button
								style={{ backgroundColor: 'var(--primary)' }}
								className="p-2.5 rounded-lg text-white hover:opacity-90 transition-opacity"
							>
								<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
