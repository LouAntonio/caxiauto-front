import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import {
	LayoutDashboard,
	Car,
	Wrench,
	FolderTree,
	Users,
	UserCheck,
	AlertTriangle,
	Star,
	Factory,
	Layers,
	Handshake,
	Settings,
	Shield,
	LogOut,
	Menu,
	X,
	CreditCard,
	Sparkles,
	Home
} from 'lucide-react';

const AdminLayout = () => {
	const location = useLocation();
	const { admin, logout } = useAdmin();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Se não houver admin, redirecionar para login
	if (!admin) {
		return <Navigate to="/caxiauto/login" replace />;
	}

	const menuItems = [
		{
			icon: LayoutDashboard,
			title: 'Dashboard',
			path: '/caxiauto/dashboard',
		},
		{
			icon: Car,
			title: 'Veículos',
			path: '/caxiauto/veiculos',
		},
		{
			icon: Wrench,
			title: 'Peças',
			path: '/caxiauto/pecas',
		},
		{
			icon: FolderTree,
			title: 'Categorias',
			path: '/caxiauto/categorias',
		},
		{
			icon: Users,
			title: 'Usuários',
			path: '/caxiauto/usuarios',
		},
		{
			icon: UserCheck,
			title: 'Vendedores',
			path: '/caxiauto/vendedores',
		},
		{
			icon: AlertTriangle,
			title: 'Denúncias',
			path: '/caxiauto/denuncias',
		},
		{
			icon: Star,
			title: 'Avaliações',
			path: '/caxiauto/avaliacoes',
		},
		{
			icon: Factory,
			title: 'Fabricantes',
			path: '/caxiauto/fabricantes',
		},
		{
			icon: Layers,
			title: 'Classes',
			path: '/caxiauto/classes',
		},
		{
			icon: Handshake,
			title: 'Parceiros',
			path: '/caxiauto/parceiros',
		},
		{
			icon: CreditCard,
			title: 'Planos',
			path: '/caxiauto/planos',
		},
		{
			icon: Sparkles,
			title: 'Pacotes Destaque',
			path: '/caxiauto/pacotes-destaque',
		},
	];

	const isActive = (path) => {
		return location.pathname === path;
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Mobile sidebar backdrop */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#154c9a] text-white transition-transform duration-300 ease-in-out ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} lg:translate-x-0`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center justify-between p-6 border-b border-blue-800">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
								<Shield className="w-6 h-6 text-[#154c9a]" />
							</div>
							<div>
								<h1 className="text-xl font-bold">Caxiauto</h1>
								<p className="text-xs text-blue-300">Admin Panel</p>
							</div>
						</div>
						<button
							onClick={() => setSidebarOpen(false)}
							className="lg:hidden text-white hover:text-blue-300"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 overflow-y-auto p-4">
						<ul className="space-y-2">
							{menuItems.map((item) => {
								const Icon = item.icon;
								const active = isActive(item.path);
								return (
									<li key={item.path}>
										<Link
											to={item.path}
											onClick={() => setSidebarOpen(false)}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
												active
													? 'bg-white text-[#154c9a] shadow-md'
													: 'text-blue-100 hover:bg-blue-800'
											}`}
										>
											<Icon className={`w-5 h-5 ${active ? 'text-[#154c9a]' : 'text-blue-300'}`} />
											<span className="font-medium">{item.title}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					{/* Logout */}
					<div className="p-4 border-t border-blue-800">
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 transition-all"
						>
							<LogOut className="w-5 h-5" />
							<span className="font-medium">Sair</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="lg:ml-64">
				{/* Top Header */}
				<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
					<div className="flex items-center justify-between px-6 py-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => setSidebarOpen(true)}
								className="lg:hidden text-gray-600 hover:text-gray-900"
							>
								<Menu className="w-6 h-6" />
							</button>
							<h2 className="text-xl font-semibold text-gray-800">
								{menuItems.find(item => isActive(item.path))?.title || 'Painel Administrativo'}
							</h2>
						</div>

						<div className="flex items-center gap-4">
							<Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#154c9a] hover:bg-gray-100 rounded-lg transition-colors" title="Voltar ao site">
								<Home className="w-4 h-4" />
								<span className="hidden sm:inline">Ver Site</span>
							</Link>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-[#154c9a] rounded-full flex items-center justify-center text-white font-semibold">
									{admin.name?.charAt(0)}{admin.surname?.charAt(0)}
								</div>
								<div className="hidden sm:block">
									<p className="text-sm font-medium text-gray-900">{admin.name} {admin.surname}</p>
									<p className="text-xs text-gray-500">{admin.email}</p>
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
