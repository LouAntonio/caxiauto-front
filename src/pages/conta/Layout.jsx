import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
	LayoutDashboard,
	Car,
	Heart,
	FileText,
	Settings,
	User,
	Calendar,
	CreditCard,
	Star,
	AlertTriangle,
	Wrench
} from 'lucide-react';

const ContaLayout = () => {
	const location = useLocation();
	const { user } = useAuth();

	const menuItems = [
		{
			icon: LayoutDashboard,
			title: 'Dashboard',
			path: '/minha-conta',
		},
		{
			icon: Car,
			title: 'Meus Veículos',
			path: '/minha-conta/veiculos',
		},
		{
			icon: Wrench,
			title: 'Minhas Peças',
			path: '/minha-conta/pecas',
		},
		{
			icon: Car,
			title: 'Veículos Aluguel',
			path: '/minha-conta/veiculos-aluguel',
		},
		{
			icon: Calendar,
			title: 'Minhas Reservas',
			path: '/minha-conta/reservas',
		},
		{
			icon: Heart,
			title: 'Favoritos',
			path: '/minha-conta/favoritos',
		},
		{
			icon: FileText,
			title: 'Documentos',
			path: '/minha-conta/documentos',
		},
		{
			icon: CreditCard,
			title: 'Assinatura',
			path: '/minha-conta/assinatura',
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
	];

	const isActive = (path) => {
		// Comparação exata do pathname
		return location.pathname === path;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="w-12 h-12 bg-[#154c9a] rounded-full flex items-center justify-center">
							<User className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
							<p className="text-sm text-gray-600">{user?.name}</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
							<nav className="space-y-2">
								{menuItems.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.path);
									return (
										<Link
											key={item.path}
											to={item.path}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
												active
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
