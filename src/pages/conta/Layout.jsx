import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import {
	LayoutDashboard,
	Heart,
	Calendar,
	Star,
	AlertTriangle,
	MessageSquare,
	User,
	Menu,
	X,
	Store
} from 'lucide-react';

const ContaLayout = () => {
	const location = useLocation();
	const { user } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const menuItems = [
		{
			icon: LayoutDashboard,
			title: 'Dashboard',
			path: '/minha-conta',
		},
		{
			icon: Heart,
			title: 'Favoritos',
			path: '/minha-conta/favoritos',
		},
		{
			icon: Calendar,
			title: 'Minhas Reservas',
			path: '/minha-conta/reservas',
		},
		{
			icon: Star,
			title: 'Avaliações',
			path: '/minha-conta/avaliacoes',
		},
		{
			icon: AlertTriangle,
			title: 'Denúncias',
			path: '/minha-conta/denuncias',
		},
		{
			icon: MessageSquare,
			title: 'Mensagens',
			path: '/minha-conta/mensagens',
		},
	];

	const isActive = (path) => {
		return location.pathname === path;
	};

	const handleNavClick = () => {
		setSidebarOpen(false);
	};

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
							<User className="w-6 h-6 text-white" />
						</div>
						<div className="min-w-0">
							<h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
							<p className="text-sm text-gray-600">{user?.name}</p>
						</div>
						<div className="ml-auto flex-shrink-0">
							<Link
								to="/minha-loja"
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-asfalto text-papel rounded-lg font-semibold text-sm hover:bg-verde-profundo transition-colors"
								title={user?.role === 'SELLER' ? 'Abrir Minha Loja' : 'Tornar-se vendedor'}
							>
								<Store className="w-4 h-4 text-ambar" />
								<span className="hidden sm:inline">{user?.role === 'SELLER' ? 'Minha Loja' : 'Vender'}</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar desktop */}
					<div className="hidden lg:block lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
							<nav className="space-y-2">
								{menuItems.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.path);
									return (
										<Link
											key={item.path}
											to={item.path}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
												? 'bg-[#154c9a] text-white shadow-md'
												: 'text-gray-700 hover:bg-gray-100'
											}`}
										>
											<Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
											<span className="font-medium">{item.title}</span>
										</Link>
									);
								})}
							</nav>
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
							{menuItems.map((item) => {
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
									</Link>
								);
							})}
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

export default ContaLayout;
