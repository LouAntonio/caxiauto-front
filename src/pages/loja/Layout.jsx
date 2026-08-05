import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import {
	LayoutDashboard,
	Car,
	CarFront,
	Wrench,
	FileText,
	CreditCard,
	MessageSquare,
	Home,
	LogOut,
	Menu,
	X,
	Store,
	User
} from 'lucide-react';

const hashPlate = (id) => {
	if (!id) return 'LD·00·00·AA';
	let h = 0;
	for (let i = 0; i < id.length; i++) {
		h = (h * 31 + id.charCodeAt(i)) >>> 0;
	}
	const letters = 'ABCDEFGHJKLNPRSTUVXYZ';
	const n1 = ((h % 90) + 10).toString();
	const n2 = ((Math.floor(h / 7) % 90) + 10).toString();
	const l1 = letters[Math.floor(h / 13) % letters.length];
	const l2 = letters[Math.floor(h / 97) % letters.length];
	return `LD·${n1}·${n2}·${l1}${l2}`;
};

const SellerLayout = () => {
	const location = useLocation();
	const { user, logout } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const menuItems = [
		{ icon: LayoutDashboard, title: 'Dashboard', path: '/minha-loja' },
		{ icon: Car, title: 'Meus Veículos', path: '/minha-loja/veiculos' },
		{ icon: CarFront, title: 'Veículos Aluguel', path: '/minha-loja/veiculos-aluguel' },
		{ icon: Wrench, title: 'Minhas Peças', path: '/minha-loja/pecas' },
		{ icon: FileText, title: 'Documentos', path: '/minha-loja/documentos' },
		{ icon: CreditCard, title: 'Assinatura', path: '/minha-loja/assinatura' },
		{ icon: MessageSquare, title: 'Mensagens', path: '/minha-loja/mensagens' },
	];

	const isActive = (path) => location.pathname === path;

	const plate = hashPlate(user?.id);

	const getStamp = () => {
		if (user?.isVerified) {
			return { label: 'VERIFICADO', cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40' };
		}
		if (user?.role === 'SELLER') {
			return { label: 'EM ANÁLISE', cls: 'bg-ambar/20 text-ambar border-ambar/40' };
		}
		return { label: 'POR VERIFICAR', cls: 'bg-white/10 text-aco border-white/15' };
	};
	const stamp = getStamp();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="min-h-screen bg-asfalto text-papel">
			{/* ===== Header / Placa do vendedor ===== */}
			<header className="bg-verde-profundo border-b border-white/10 sticky top-0 z-30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between gap-4 py-4">
						<div className="flex items-center gap-3 min-w-0">
							<button
								onClick={() => setSidebarOpen(true)}
								className="lg:hidden p-2 -ml-2 text-papel hover:bg-white/10 rounded-lg"
								aria-label="Abrir menu"
							>
								<Menu className="w-6 h-6" />
							</button>
							<div className="w-10 h-10 bg-ambar rounded-lg flex items-center justify-center flex-shrink-0">
								<Store className="w-6 h-6 text-asfalto" />
							</div>
							<div className="min-w-0">
								<h1 className="font-display font-bold text-lg leading-tight truncate">Minha Loja</h1>
								<p className="text-xs text-aco font-data truncate">
									{user?.name} {user?.surname}
								</p>
							</div>
						</div>

						{/* Placa do vendedor */}
						<div className="animate-plate-stamp hidden min-[640px]:flex items-stretch overflow-hidden rounded-lg border border-white/15 bg-asfalto shadow-lg">
							<div className="flex flex-col items-center justify-center px-2 bg-[#003399] text-white">
								<span className="font-data font-bold text-sm leading-none">AO</span>
								<span className="font-data text-[8px] leading-none opacity-80">ANGOLA</span>
							</div>
							<div className="flex items-center px-3 gap-2">
								<span className="font-data font-bold text-base tracking-widest text-white">{plate}</span>
								<span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-data font-bold tracking-wider border ${stamp.cls}`}>
									{stamp.label}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-1 sm:gap-2">
							<Link
								to="/"
								className="flex items-center gap-2 px-3 py-2 text-sm text-aco hover:text-papel hover:bg-white/10 rounded-lg transition-colors"
								title="Ver site"
							>
								<Home className="w-4 h-4" />
								<span className="hidden md:inline">Ver Site</span>
							</Link>
							<Link
								to="/minha-conta"
								className="flex items-center gap-2 px-3 py-2 text-sm text-aco hover:text-papel hover:bg-white/10 rounded-lg transition-colors"
								title="Minha Conta"
							>
								<User className="w-4 h-4" />
								<span className="hidden md:inline">Minha Conta</span>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Overlay mobile */}
			{sidebarOpen && (
				<div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
			)}

			{/* Sidebar mobile (off-canvas) */}
			<aside
				className={`fixed top-0 left-0 z-50 h-full w-72 bg-verde-profundo border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:hidden ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-ambar rounded-lg flex items-center justify-center">
								<Store className="w-5 h-5 text-asfalto" />
							</div>
							<span className="font-display font-bold text-papel">Minha Loja</span>
						</div>
						<button onClick={() => setSidebarOpen(false)} className="p-2 text-aco hover:text-papel rounded-lg" aria-label="Fechar menu">
							<X className="w-5 h-5" />
						</button>
					</div>
					<nav className="flex-1 overflow-y-auto p-4 space-y-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.path);
							return (
								<Link
									key={item.path}
									to={item.path}
									onClick={() => setSidebarOpen(false)}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body ${
										active ? 'bg-ambar text-asfalto font-semibold' : 'text-papel/70 hover:bg-white/5 hover:text-papel'
									}`}
								>
									<Icon className={`w-5 h-5 ${active ? 'text-asfalto' : 'text-aco'}`} />
									<span>{item.title}</span>
								</Link>
							);
						})}
					</nav>
					<div className="p-4 border-t border-white/10">
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-all font-body"
						>
							<LogOut className="w-5 h-5" />
							<span className="font-medium">Sair</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Conteúdo */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="lg:flex lg:gap-10">
					{/* Rail desktop */}
					<aside className="hidden lg:block w-64 flex-shrink-0">
						<nav className="sticky top-24">
							<p className="px-3 pb-2 text-[10px] font-data uppercase tracking-[0.25em] text-aco">Gestão da loja</p>
							<div className="space-y-1">
								{menuItems.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.path);
									return (
										<Link
											key={item.path}
											to={item.path}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body ${
												active ? 'bg-ambar text-asfalto font-semibold shadow-lg' : 'text-papel/70 hover:bg-white/5 hover:text-papel'
											}`}
										>
											<Icon className={`w-5 h-5 ${active ? 'text-asfalto' : 'text-aco'}`} />
											<span>{item.title}</span>
										</Link>
									);
								})}
							</div>
							<div className="pt-4 mt-4 border-t border-white/10">
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-all font-body font-medium"
								>
									<LogOut className="w-5 h-5" />
									<span>Sair</span>
								</button>
							</div>
						</nav>
					</aside>

					{/* Main */}
					<main className="flex-1 min-w-0 mt-6 lg:mt-0">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
};

export default SellerLayout;
