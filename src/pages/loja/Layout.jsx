import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useSyncUser from '../../hooks/useSyncUser';
import { useSellerHome } from '../../hooks/queries/useSubscription';
import {
	LayoutDashboard,
	Car,
	CarFront,
	Wrench,
	FileText,
	CreditCard,
	Handshake,
	MessageSquare,
	CalendarClock,
	Store,
	User,
	Menu,
	X,
	LogOut
} from 'lucide-react';

const SellerLayout = () => {
	const location = useLocation();
	const { user, logout } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { data: home } = useSellerHome();

	useSyncUser();

	const pendingReservas = home?.reservas?.pending || 0;

	const menuGroups = [
		{
			label: null,
			items: [{ icon: LayoutDashboard, title: 'Home', path: '/minha-loja' }]
		},
		{
			label: 'Secções da Loja',
			items: [
				{ icon: Car, title: 'Stand', path: '/minha-loja/veiculos' },
				{ icon: CarFront, title: 'Aluguel', path: '/minha-loja/veiculos-aluguel' },
				{ icon: Wrench, title: 'Peças e Acessórios', path: '/minha-loja/pecas' },
				{ icon: Handshake, title: 'Empresas', path: '/minha-loja/empresas' }
			]
		},
		{
			label: 'Gestão',
			items: [
				{ icon: FileText, title: 'Documentos', path: '/minha-loja/documentos' },
				{ icon: CalendarClock, title: 'Reservas', path: '/minha-loja/reservas', badge: pendingReservas },
				{ icon: CreditCard, title: 'Assinatura', path: '/minha-loja/assinatura' },
				{ icon: MessageSquare, title: 'Mensagens', path: '/minha-loja/mensagens' }
			]
		}
	];

	const isActive = (path) => location.pathname === path;

	const handleNavClick = () => {
		setSidebarOpen(false);
	};

	const renderMenuItem = (item) => {
		const Icon = item.icon;
		const active = isActive(item.path);
		return (
			<Link
				key={item.path}
				to={item.path}
				onClick={handleNavClick}
				className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
					? 'bg-[#154c9a] text-white shadow-md'
					: 'text-gray-700 hover:bg-gray-100'
				}`}
			>
				<Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
				<span className="font-medium">{item.title}</span>
				{!!item.badge && item.badge > 0 && (
					<span className={`ml-auto min-w-5 h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${active ? 'bg-white text-[#154c9a]' : 'bg-[#d41120] text-white'}`}>
						{item.badge}
					</span>
				)}
			</Link>
		);
	};

	const renderMenu = () => (
		<div className="space-y-4">
			{menuGroups.map((group, gi) => (
				<div key={gi} className="space-y-2">
					{group.label && (
						<p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{group.label}</p>
					)}
					{group.items.map(renderMenuItem)}
				</div>
			))}
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden p-2.5 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
							aria-label="Abrir menu de navegação"
						>
							<Menu className="w-6 h-6" />
						</button>
						<div className="w-12 h-12 bg-[#154c9a] rounded-full flex items-center justify-center flex-shrink-0">
							<Store className="w-6 h-6 text-white" />
						</div>
						<div className="min-w-0">
							<h1 className="text-3xl font-bold text-gray-900">Minha Loja</h1>
							<p className="text-sm text-gray-600">{user?.name} {user?.surname}</p>
						</div>
						<div className="ml-auto flex-shrink-0">
							<Link
								to="/minha-conta"
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#154c9a] text-white rounded-lg font-semibold text-sm hover:bg-[#123f80] transition-colors"
								title="Minha Conta"
							>
								<User className="w-4 h-4" />
								<span className="hidden sm:inline">Minha Conta</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar desktop */}
					<div className="hidden lg:block lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
							<nav className="space-y-2">
								{renderMenu()}
							</nav>
							<div className="pt-4 mt-4 border-t border-gray-200">
								<button
									onClick={logout}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
								>
									<LogOut className="w-5 h-5" />
									<span>Sair</span>
								</button>
							</div>
						</div>
					</div>

					{/* Overlay mobile */}
					{sidebarOpen && (
						<div
							className="fixed inset-0 bg-black/50 z-40 lg:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
					)}

					{/* Sidebar mobile (off-canvas) */}
					<div
						className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
							sidebarOpen ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
							<span className="font-bold text-gray-900">Menu</span>
							<button
								onClick={() => setSidebarOpen(false)}
								className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
								aria-label="Fechar menu"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-60px)]">
							{renderMenu()}
							<button
								onClick={logout}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
							>
								<LogOut className="w-5 h-5" />
								<span>Sair</span>
							</button>
						</nav>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerLayout;
