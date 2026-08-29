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
	FileText,
	CalendarClock,
	Clock
} from 'lucide-react';
import LojaPageHeader from './PageHeader';
import { useSellerHome } from '../../hooks/queries/useSubscription';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';

const SECTION_META = {
	ALUGUEL: {
		label: 'Aluguel',
		description: 'Anuncie veículos para aluguer.',
		icon: CarFront,
		color: 'bg-[#154c9a]',
		light: 'bg-[#eef3fa] text-[#154c9a] border-[#c9d9ef]',
		hover: 'hover:bg-[#123f80]',
		managePath: '/minha-loja/veiculos-aluguel'
	},
	PECAS: {
		label: 'Peças e Acessórios',
		description: 'Venda peças e acessórios na sua loja.',
		icon: Wrench,
		color: 'bg-[#d41120]',
		light: 'bg-[#fdecec] text-[#d41120] border-[#f5c4c8]',
		hover: 'hover:bg-[#b80f1c]',
		managePath: '/minha-loja/pecas'
	},
	EMPRESAS: {
		label: 'Empresas',
		description: 'Divulgue a sua empresa como parceira.',
		icon: Handshake,
		color: 'bg-[#154c9a]',
		light: 'bg-[#eef3fa] text-[#154c9a] border-[#c9d9ef]',
		hover: 'hover:bg-[#123f80]',
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

			{/* Reservas recebidas */}
			<div className={`mb-6 bg-white rounded-xl border shadow-sm p-6 ${home.reservas?.pending ? 'border-amber-200' : 'border-gray-200'}`}>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${home.reservas?.pending ? 'bg-amber-500' : 'bg-gray-200'}`}>
							<CalendarClock className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900">Reservas recebidas</h3>
							<p className="text-sm text-gray-600 mt-0.5">
								{home.reservas?.pending
									? `Tem ${home.reservas.pending} ${home.reservas.pending === 1 ? 'pedido pendente' : 'pedidos pendentes'} de confirmação.`
									: home.reservas?.total
										? 'Sem pedidos pendentes.'
										: 'Quando um cliente reservar um dos seus veículos, o pedido aparece aqui.'}
							</p>
						</div>
					</div>
					<Link to="/minha-loja/reservas" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#154c9a] hover:text-[#123f80]">
						Gerir <ArrowRight className="w-4 h-4" />
					</Link>
				</div>
				{home.reservas?.pending > 0 && (
					<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
						<div className="bg-amber-50 rounded-lg p-3">
							<p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Pendentes</p>
							<p className="text-xl font-bold text-amber-600">{home.reservas.pending}</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-3">
							<p className="text-xs text-gray-500">Total recebidas</p>
							<p className="text-xl font-bold text-gray-900">{home.reservas.total}</p>
						</div>
					</div>
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
										? 'bg-[#eef3fa] text-[#154c9a] border-[#c9d9ef]'
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
										? `bg-[#154c9a] text-white hover:bg-[#123f80]`
										: `${meta.color} text-white ${meta.hover}`
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
