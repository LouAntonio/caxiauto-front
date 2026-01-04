import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="px-4 py-6 bg-[url('/')]">
			<div className="max-w-7xl mx-auto">
				<div style={{backgroundColor: 'rgba(21,76,154,0.9)'}} className="backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center justify-between gap-6 shadow-lg" >
					{/* Left: Logo */}
					<div className="flex items-center gap-3">
						<Link to="/" className="inline-block" aria-label="Home">
							<img src="/LogoBrancoCrooped.png" alt="FinTech" className="h-10 rounded-lg object-cover" />
						</Link>
					</div>

					{/* Center: Navigation */}
					<nav className="hidden md:flex items-center gap-6" >
						<Link to="/" className="hover:text-[var(--bg-soft)] text-[var(--bg-soft)]">Home</Link>
						<Link to="/sobre" className="hover:text-[var(--bg-soft)] text-[var(--bg-soft)]">Sobre</Link>
						<Link to="/como-funciona" className="hover:text-[var(--bg-soft)] text-[var(--bg-soft)]">Como Funciona</Link>
						{/* Serviços com submenu */}
						<div className="relative group">
							<button className="flex items-center gap-1 hover:text-white">
								Serviços
								<svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"/></svg>
							</button>
								<div style={{backgroundColor: 'rgba(21,76,154,0.95)'}} className="absolute left-0 mt-2 w-64 rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform transition-all">
									<Link to="/servicos/venda-de-automoveis" className="block px-4 py-2 text-[var(--bg-soft)] hover:bg-[var(--primary-hover)]">Venda de Automóveis</Link>
									<Link to="/servicos/aluguel-de-automoveis" className="block px-4 py-2 text-[var(--bg-soft)] hover:bg-[var(--primary-hover)]">Aluguel de Automóveis</Link>
									<Link to="/servicos/venda-de-pecas" className="block px-4 py-2 text-[var(--bg-soft)] hover:bg-[var(--primary-hover)]">Venda de Peças e Acessórios</Link>
									<Link to="/servicos/venda-seu-automovel" className="block px-4 py-2 text-[var(--bg-soft)] hover:bg-[var(--primary-hover)]">Venda seu Automóvel</Link>
									<Link to="/servicos/reboque" className="block px-4 py-2 text-[var(--bg-soft)] hover:bg-[var(--primary-hover)]">Reboque</Link>
								</div>
						</div>
					</nav>

					{/* Right: actions */}
					<div className="flex items-center gap-4">
						<div className="hidden md:flex items-center gap-3">
							<Link to="/contato" className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md">Contato</Link>
						</div>

						<div className="md:hidden">
							<button className="p-2 rounded-md bg-slate-700/60 text-slate-200">
								<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
