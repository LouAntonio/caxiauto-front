import React from 'react';
import { Link } from 'react-router-dom';
import {
	Car,
	CarFront,
	Wrench,
	Handshake,
	ShieldCheck,
	ShieldAlert,
	ArrowRight,
	BadgeCheck,
	FileText
} from 'lucide-react';
import LojaPageHeader from './PageHeader';
import { useSellerHome } from '../../hooks/queries/useSubscription';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';

const SECTION_META = {
	ALUGUEL: {
		label: 'Aluguel',
		description: 'Anuncie veículos para aluguer.',
		icon: CarFront,
		color: 'bg-sky-600',
		light: 'bg-sky-50 text-sky-700 border-sky-200',
		managePath: '/minha-loja/veiculos-aluguel'
	},
	PECAS: {
		label: 'Peças e Acessórios',
		description: 'Venda peças e acessórios na sua loja.',
		icon: Wrench,
		color: 'bg-amber-600',
		light: 'bg-amber-50 text-amber-700 border-amber-200',
		managePath: '/minha-loja/pecas'
	},
	EMPRESAS: {
		label: 'Empresas',
		description: 'Divulgue a sua empresa como parceira.',
		icon: Handshake,
		color: 'bg-emerald-600',
		light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		managePath: '/minha-loja/empresas'
	}
};

const Home = () => {
	const { data: home, isLoading } = useSellerHome();

	if (isLoading || !home) return <DashboardSkeleton />;

	const kyc = home.kyc;

	return (
		<div>
			<LojaPageHeader
				eyebrow="Painel do Vendedor"
				title="Home"
				description="Visão geral da sua loja e das secções ativas."
			/>

			{/* KYC */}
			<div className={`mb-6 rounded-xl border p-5 flex flex-wrap items-center gap-4 ${kyc.isVerified
				? 'bg-emerald-50 border-emerald-200'
				: kyc.docsSubmitted ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
			}`}>
				{kyc.isVerified ? (
					<BadgeCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
				) : (
					<ShieldAlert className={`w-8 h-8 flex-shrink-0 ${kyc.docsSubmitted ? 'text-amber-600' : 'text-red-600'}`} />
				)}
				<div className="min-w-0 flex-1">
					<p className="font-semibold text-gray-900">
						{kyc.isVerified
							? 'Verificação concluída'
							: kyc.docsSubmitted
								? 'Verificação em análise'
								: 'Complete a verificação da sua loja'}
					</p>
					<p className="text-sm text-gray-600">
						{kyc.isVerified
							? 'A sua loja tem o selo de confiança ativo.'
							: kyc.docsSubmitted
								? 'Os seus documentos foram enviados e estão sob análise da equipa Caxiauto.'
								: 'Envie os seus documentos para obter o selo de vendedor verificado.'}
					</p>
				</div>
				{!kyc.isVerified && (
					<Link
						to="/minha-loja/documentos"
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#154c9a] text-white text-sm font-semibold rounded-lg hover:bg-[#123f80] transition-colors"
					>
						<FileText className="w-4 h-4" />
						Documentos
					</Link>
				)}
			</div>

			{/* Secção Stand (comissão) */}
			<div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-11 h-11 bg-[#154c9a] rounded-lg flex items-center justify-center flex-shrink-0">
							<Car className="w-6 h-6 text-white" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-bold text-gray-900">Stand</h3>
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
									<ShieldCheck className="w-3 h-3" />
									Sempre ativa
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-0.5">Venda de veículos com comissão por venda.</p>
						</div>
					</div>
					<Link to="/minha-loja/veiculos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#154c9a] hover:text-[#123f80]">
						Gerir <ArrowRight className="w-4 h-4" />
					</Link>
				</div>
				<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
					<div className="bg-gray-50 rounded-lg p-3">
						<p className="text-xs text-gray-500">Veículos totais</p>
						<p className="text-xl font-bold text-gray-900">{home.totals.vehicles}</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-3">
						<p className="text-xs text-gray-500">Vendidos</p>
						<p className="text-xl font-bold text-gray-900">{home.totals.vehiclesSold}</p>
					</div>
					<div className="hidden sm:block bg-gray-50 rounded-lg p-3">
						<p className="text-xs text-gray-500">Modelo</p>
						<p className="text-sm font-semibold text-gray-900 mt-1">Comissão por venda</p>
					</div>
				</div>
			</div>

			{/* Secções com plano */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Object.entries(SECTION_META).map(([key, meta]) => {
					const section = home.sections?.[key];
					const Icon = meta.icon;
					const active = section?.isActive;
					return (
						<div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
							<div className="flex items-center gap-3 mb-3">
								<div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
									<Icon className="w-5 h-5 text-white" />
								</div>
								<div className="min-w-0">
									<h3 className="font-bold text-gray-900 truncate">{meta.label}</h3>
									<span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${active
										? 'bg-emerald-50 text-emerald-700 border-emerald-200'
										: 'bg-gray-100 text-gray-500 border-gray-200'
									}`}>
										{active ? 'Plano ativo' : 'Sem plano'}
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-600 mb-3">{meta.description}</p>
							{active && (
								<div className={`${meta.light.split(' ')[0]} rounded-lg p-3 mb-3`}>
									<div className="flex items-center justify-between text-sm">
										<span>Anúncios usados</span>
										<span className="font-bold">{section.used}/{section.limit}</span>
									</div>
									{section.planName && (
										<p className="text-xs mt-1 opacity-80">Plano: {section.planName}</p>
									)}
								</div>
							)}
							<div className="mt-auto flex items-center gap-2 pt-2">
								<Link
									to={active ? meta.managePath : '/minha-loja/assinatura'}
									className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${active
										? 'bg-[#154c9a] text-white hover:bg-[#123f80]'
										: 'bg-amber-600 text-white hover:bg-amber-700'
									}`}
								>
									{active ? 'Gerir secção' : 'Escolher plano'}
									<ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
