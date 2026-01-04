import React from "react";

export default function Header() {
	return (
		<header className="px-4 py-6 bg-[url('/')]">
			<div className="max-w-7xl mx-auto">
				<div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center justify-between gap-6 shadow-lg border border-slate-700">
					{/* Left: Logo */}
					<div className="flex items-center gap-3">
						<img src="/LogoBrancoCrooped.png" alt="FinTech" className="h-10 rounded-lg object-cover" />
					</div>

					{/* Center: Navigation */}
					<nav className="hidden md:flex items-center gap-6 text-slate-200/90">
						<a href="#" className="hover:text-white">Home</a>
						<a href="#" className="hover:text-white">Sobre</a>
						<a href="#" className="hover:text-white">Como Funciona</a>
						{/* Serviços com submenu */}
						<div className="relative group">
							<button className="flex items-center gap-1 hover:text-white">
								Serviços
								<svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"/></svg>
							</button>
							<div className="absolute left-0 mt-2 w-64 bg-slate-800/90 rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform transition-all">
								<a href="#" className="block px-4 py-2 text-slate-200 hover:bg-slate-700">Venda de Automóveis</a>
								<a href="#" className="block px-4 py-2 text-slate-200 hover:bg-slate-700">Aluguel de Automóveis</a>
								<a href="#" className="block px-4 py-2 text-slate-200 hover:bg-slate-700">Venda de Peças e Acessórios</a>
								<a href="#" className="block px-4 py-2 text-slate-200 hover:bg-slate-700">Venda seu Automóvel</a>
								<a href="#" className="block px-4 py-2 text-slate-200 hover:bg-slate-700">Reboque</a>
							</div>
						</div>
					</nav>

					{/* Right: actions */}
					<div className="flex items-center gap-4">
						<div className="hidden md:flex items-center gap-3">
							<a href="#" className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md">Contato</a>
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
