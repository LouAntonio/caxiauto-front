import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { User, LogOut, Store } from "lucide-react";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
	const [mobileStandOpen, setMobileStandOpen] = useState(false);
	const [mobileInstitucionalOpen, setMobileInstitucionalOpen] = useState(false);
	const { user, logout } = useAuthStore();
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	const [scrolledPastHero, setScrolledPastHero] = useState(!isHomePage);

	useEffect(() => {
		if (!isHomePage) return;

		const handleScroll = () => {
			const hero = document.getElementById("hero-section");
			if (hero) {
				setScrolledPastHero(hero.getBoundingClientRect().bottom <= 0);
			}
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHomePage]);

	const isSolid = !isHomePage || scrolledPastHero;

	const handleLogout = () => {
		logout();
		setMobileMenuOpen(false);
		setMobileServicesOpen(false);
		setMobileStandOpen(false);
		setMobileInstitucionalOpen(false);
	};

	return (
		<header className={`sticky top-0 z-50 min-h-[80px] transition-all duration-300 ${isSolid ? "bg-white border-b border-[#e5e7eb] shadow-sm" : "bg-transparent border-b border-white/20 shadow-none"}`}>
			<div className="mx-auto h-full">
				<div className="h-20 flex max-w-7xl mx-auto items-center justify-between gap-8 px-6 lg:px-8">
					{/* Left: Logo */}
					<div className="flex items-center">
						<Link to="/" className="inline-block transition-transform hover:scale-105" aria-label="Home">
							<img src="/images/logos/LogoOficialCrooped.png" alt="FinTech" className="h-12 rounded-lg object-cover" />
						</Link>
					</div>

					{/* Center: Navigation - Desktop */}
					<nav className="hidden min-[971px]:flex items-center gap-8">
						<Link
							to="/"
							className={`font-medium font-body transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 hover:after:w-full after:transition-all ${isSolid ? "text-[#6b7280] hover:text-[#154c9a] after:bg-[#154c9a]" : "text-white/90 hover:text-white after:bg-white"}`}
						>
							Home
						</Link>

						<div className="relative group">
							<button className={`flex items-center gap-2 font-medium font-body transition-colors duration-200 ${isSolid ? "text-[#6b7280] hover:text-[#154c9a]" : "text-white/90 hover:text-white"}`}>
								Institucional
								<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
									<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
								</svg>
							</button>
							<div className="absolute left-0 mt-3 w-72 rounded-2xl shadow-xl py-3 border border-[#e5e7eb] bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
								<Link to="/sobre" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Sobre
								</Link>
								<Link to="/como-funciona" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Como Funciona
								</Link>
								<Link to="/parceiros" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Parceiros
								</Link>
							</div>
						</div>

						<Link
							to="/venda-seu-automovel"
							onClick={() => setMobileMenuOpen(false)}
							className={`font-medium font-body transition-colors duration-200 ${isSolid ? "text-[#6b7280] hover:text-[#154c9a]" : "text-white/90 hover:text-white"}`}
						>
							Venda Sua Viatura
						</Link>

						<div className="relative group">
							<button className={`flex items-center gap-2 font-medium font-body transition-colors duration-200 ${isSolid ? "text-[#6b7280] hover:text-[#154c9a]" : "text-white/90 hover:text-white"}`}>
								Serviços
								<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
									<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
								</svg>
							</button>
							<div className="absolute left-0 mt-3 w-72 rounded-2xl shadow-xl py-3 border border-[#e5e7eb] bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
								<Link to="/servicos/gps" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									GPS
								</Link>
								<Link to="/servicos/reboque" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Reboque
								</Link>
								<Link to="/servicos/seguro-automovel" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Seguro Automóvel
								</Link>
								<Link to="/servicos/aluguel-de-automoveis" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Aluguel de Automóveis
								</Link>
							</div>
						</div>

						<div className="relative group">
							<button className={`flex items-center gap-2 font-medium font-body transition-colors duration-200 ${isSolid ? "text-[#6b7280] hover:text-[#154c9a]" : "text-white/90 hover:text-white"}`}>
								Stand
								<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
									<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
								</svg>
							</button>
							<div className="absolute left-0 mt-3 w-72 rounded-2xl shadow-xl py-3 border border-[#e5e7eb] bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
								<Link to="/stand/compra" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Compra
								</Link>
								<Link to="/stand/pecas-acessorios" className="block px-5 py-3 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors duration-150 font-body font-medium">
									Peças e Acessórios
								</Link>
							</div>
						</div>
						<Link
							to="/contato"
							className={`font-medium font-body transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 hover:after:w-full after:transition-all ${isSolid ? "text-[#6b7280] hover:text-[#154c9a] after:bg-[#154c9a]" : "text-white/90 hover:text-white after:bg-white"}`}
						>
							Contato
						</Link>
					</nav>

					{/* Right: actions */}
					<div className="flex items-center gap-4">
						<div className="hidden min-[971px]:flex items-center gap-3">
							{user ? (
								<div className="relative group">
									<button className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium font-body transition-colors cursor-pointer ${isSolid ? "text-[#6b7280] hover:bg-[#f8f6f2]" : "text-white/90 hover:bg-white/10"}`}>
										<User className="w-5 h-5" />
										<span>Olá, {user.name.split(' ')[0]}</span>
										<svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
											<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
										</svg>
									</button>
									<div className="absolute right-0 mt-3 w-48 rounded-2xl shadow-xl py-2 border border-[#e5e7eb] bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
										<Link
											to="/minha-conta"
											className="block px-4 py-2.5 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors font-body font-medium flex items-center gap-2"
										>
											<User className="w-4 h-4" />
											Minha Conta
										</Link>
										<Link
											to="/minha-loja"
											className="block px-4 py-2.5 text-[#6b7280] hover:bg-[#f8f6f2] hover:text-[#154c9a] transition-colors font-body font-medium flex items-center gap-2"
										>
											<Store className="w-4 h-4" />
											{user.role === 'SELLER' ? 'Minha Loja' : 'Vender'}
										</Link>
										<button
											onClick={handleLogout}
											className="w-full text-left px-4 py-2.5 text-[#d41120] hover:bg-[#fde8ea] transition-colors font-body font-medium flex items-center gap-2 cursor-pointer"
										>
											<LogOut className="w-4 h-4" />
											Sair
										</button>
									</div>
								</div>
							) : (
								<Link
									to="/auth"
									className={`px-6 py-2.5 rounded-2xl font-semibold font-body transition-all duration-200 hover:-translate-y-0.5 ${isSolid ? "text-white shadow-lg hover:shadow-xl bg-[#154c9a] hover:bg-blue-800" : "text-white border border-white/30 bg-white/10 hover:bg-white/20"}`}
								>
									Entrar
								</Link>
							)}
						</div>

						<div className="min-[971px]:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className={`p-2.5 rounded-2xl text-white transition-colors ${isSolid ? "bg-[#154c9a] hover:bg-blue-800" : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"}`}
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
					<div className={`min-[971px]:hidden border-t bg-white ${isSolid ? "border-[#e5e7eb]" : "border-white/20"}`}>
						<nav className="px-4 py-4 space-y-2">
							<Link
								to="/"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
							>
								Home
							</Link>

							<div>
								<button
									onClick={() => setMobileInstitucionalOpen(!mobileInstitucionalOpen)}
									className="w-full flex items-center justify-between px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
								>
									Institucional
									<svg
										className={`w-4 h-4 transition-transform ${mobileInstitucionalOpen ? 'rotate-180' : ''}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
									</svg>
								</button>

								{mobileInstitucionalOpen && (
									<div className="ml-4 mt-2 space-y-1">
										<Link
											to="/sobre"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Sobre
										</Link>
										<Link
											to="/como-funciona"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Como Funciona
										</Link>
										<Link
											to="/parceiros"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Parceiros
										</Link>
									</div>
								)}
							</div>

							<Link
								to="/venda-seu-automovel"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
							>
								Venda Sua Viatura
							</Link>
							<div>
								<button
									onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
									className="w-full flex items-center justify-between px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
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
											to="/servicos/gps"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											GPS
										</Link>
										<Link
											to="/servicos/reboque"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Reboque
										</Link>
										<Link
											to="/servicos/seguro-automovel"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Seguro Automóvel
										</Link>
										<Link
											to="/servicos/aluguel-de-automoveis"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Aluguel de Automóveis
										</Link>
									</div>
								)}
							</div>

							<div>
								<button
									onClick={() => setMobileStandOpen(!mobileStandOpen)}
									className="w-full flex items-center justify-between px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
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
											to="/stand/compra"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Compra
										</Link>
										<Link
											to="/stand/pecas-acessorios"
											onClick={() => setMobileMenuOpen(false)}
											className="block px-4 py-2.5 text-[#6b7280] font-body hover:bg-[#f8f6f2] hover:text-[#154c9a] rounded-2xl transition-colors"
										>
											Peças e Acessórios
										</Link>
									</div>
								)}
							</div>
							<Link
								to="/contato"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-[#6b7280] font-medium font-body hover:bg-[#f8f6f2] rounded-2xl transition-colors"
							>
								Contato
							</Link>
							{user ? (
								<>
									<Link
										to="/minha-conta"
										onClick={() => setMobileMenuOpen(false)}
										className="block text-center px-4 py-3 rounded-2xl text-white font-semibold font-body shadow-lg mt-4 flex items-center justify-center gap-2 bg-[#154c9a] hover:bg-blue-800 transition-colors"
									>
										<User className="w-5 h-5" />
										Minha Conta
									</Link>
									<Link
										to="/minha-loja"
										onClick={() => setMobileMenuOpen(false)}
										className="block text-center px-4 py-3 rounded-2xl text-[#0e1712] font-semibold font-body shadow-lg mt-2 flex items-center justify-center gap-2 bg-ambar hover:bg-amber-400 transition-colors"
									>
										<Store className="w-5 h-5" />
										{user.role === 'SELLER' ? 'Minha Loja' : 'Vender no Caxiauto'}
									</Link>
									<button
										onClick={handleLogout}
										className="w-full text-center px-4 py-3 rounded-2xl bg-[#fde8ea] text-[#d41120] font-semibold font-body mt-2 flex items-center justify-center gap-2 hover:bg-[#f8d5d9] transition-colors cursor-pointer"
									>
										<LogOut className="w-5 h-5" />
										Sair
									</button>
								</>
							) : (
								<Link
									to="/auth"
									onClick={() => setMobileMenuOpen(false)}
									className="block text-center px-4 py-3 rounded-2xl text-white font-semibold font-body shadow-lg mt-4 bg-[#154c9a] hover:bg-blue-800 transition-colors"
								>
									Entrar
								</Link>
							)}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
