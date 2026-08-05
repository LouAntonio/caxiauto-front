import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Car,
	Wrench,
	CalendarClock,
	CalendarCheck,
	FileText,
	CreditCard,
	MessageSquare,
	ArrowRight,
	ShieldAlert,
	ShieldCheck,
	Upload,
	ClipboardCheck,
	Store,
	Loader2
} from 'lucide-react';
import LojaPageHeader from './PageHeader';

const Dashboard = () => {
	useDocumentTitle('Minha Loja - CaxiAuto');

	const { user, refreshUser } = useAuthStore();
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(true);

	useEffect(() => {
		refreshUser().finally(() => setSyncing(false));
	}, [refreshUser]);

	useEffect(() => {
		api.getUserDashboardStats()
			.then((res) => {
				if (res.success) setStats(res.data);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const isSeller = user?.role === 'SELLER' || !!user?.sellerDocs;

	const statCards = [
		{ icon: Car, label: 'Veículos', value: stats?.totalVeiculos },
		{ icon: Wrench, label: 'Peças', value: stats?.totalPecas },
		{ icon: CalendarClock, label: 'Reservas recebidas', value: stats?.reservasRecebidas },
		{ icon: CalendarCheck, label: 'Reservas feitas', value: stats?.totalReservas },
	];

	return (
		<div className="space-y-6">
			<LojaPageHeader
				eyebrow={isSeller ? 'Painel de instrumentos' : 'Bem-vindo à tua loja'}
				title={isSeller ? 'A tua loja num relance' : 'Abre a tua loja no Caxiauto'}
				description={
					isSeller
						? 'Acompanha os teus anúncios, reservas e o estado da verificação.'
						: 'Vende viaturas, peças e acessórios para milhares de pessoas em todo o país.'
				}
			>
				{isSeller && (
					<>
						<Link
							to="/minha-loja/veiculos"
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#154c9a] text-white font-semibold text-sm hover:bg-[#123f80] transition-colors"
						>
							<Car className="w-4 h-4" />
							Adicionar veículo
						</Link>
						<Link
							to="/minha-loja/pecas"
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
						>
							<Wrench className="w-4 h-4" />
							Adicionar peça
						</Link>
					</>
				)}
			</LojaPageHeader>

			{syncing ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500 flex items-center justify-center gap-2">
					<Loader2 className="w-5 h-5 animate-spin text-[#154c9a]" />
					A sincronizar os teus dados...
				</div>
			) : isSeller ? (
				<>
					{/* Banner de verificação */}
					{!user?.isVerified && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<ShieldAlert className="w-7 h-7 text-yellow-600 flex-shrink-0" />
								<div>
									<p className="font-semibold text-gray-900">Verificação em análise</p>
									<p className="text-sm text-gray-600">
										Os teus documentos foram submetidos e estão a ser revistos pela equipa Caxiauto.
									</p>
								</div>
							</div>
							<Link
								to="/minha-loja/documentos"
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#154c9a] text-white font-semibold text-sm hover:bg-[#123f80] transition-colors"
							>
								<ClipboardCheck className="w-4 h-4" />
								Ver estado
							</Link>
						</div>
					)}

					{/* Painel de instrumentos */}
					{loading ? (
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500 text-sm">A carregar estatísticas...</div>
					) : stats ? (
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							{statCards.map((s) => {
								const Icon = s.icon;
								return (
									<div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
										<div className="flex items-center justify-between">
											<p className="text-sm text-gray-600">{s.label}</p>
											<Icon className="w-5 h-5 text-[#154c9a]" />
										</div>
										<p className="mt-3 font-bold text-3xl text-gray-900">{s.value ?? '—'}</p>
									</div>
								);
							})}
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">Não foi possível carregar as estatísticas.</div>
					)}

					{/* Verificado */}
					{user?.isVerified && (
						<div className="bg-green-50 border border-green-200 rounded-lg p-5 flex items-center gap-3">
							<ShieldCheck className="w-7 h-7 text-green-600 flex-shrink-0" />
							<div>
								<p className="font-semibold text-gray-900">Loja verificada</p>
								<p className="text-sm text-gray-600">O teu selo de confiança está ativo. Boas vendas!</p>
							</div>
						</div>
					)}

					{/* Atalhos de gestão */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<Link
							to="/minha-loja/documentos"
							className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:border-[#154c9a] transition-colors"
						>
							<div className="flex items-center gap-3">
								<FileText className="w-6 h-6 text-[#154c9a]" />
								<div>
									<p className="font-semibold text-gray-900">Documentos</p>
									<p className="text-xs text-gray-500">Verificação e fotos</p>
								</div>
							</div>
							<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#154c9a] transition-colors" />
						</Link>
						<Link
							to="/minha-loja/assinatura"
							className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:border-[#154c9a] transition-colors"
						>
							<div className="flex items-center gap-3">
								<CreditCard className="w-6 h-6 text-[#154c9a]" />
								<div>
									<p className="font-semibold text-gray-900">Assinatura</p>
									<p className="text-xs text-gray-500">Planos e destaques</p>
								</div>
							</div>
							<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#154c9a] transition-colors" />
						</Link>
						<Link
							to="/minha-loja/mensagens"
							className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:border-[#154c9a] transition-colors"
						>
							<div className="flex items-center gap-3">
								<MessageSquare className="w-6 h-6 text-[#154c9a]" />
								<div>
									<p className="font-semibold text-gray-900">Mensagens</p>
									<p className="text-xs text-gray-500">Conversas com clientes</p>
								</div>
							</div>
							<ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#154c9a] transition-colors" />
						</Link>
					</div>
				</>
			) : (
				/* ===== Onboarding: tornar-se vendedor ===== */
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="p-8 sm:p-10">
						<div className="flex items-start gap-4">
							<div className="w-14 h-14 bg-[#154c9a] rounded-2xl flex items-center justify-center flex-shrink-0">
								<Store className="w-7 h-7 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-2xl text-gray-900">Torne-se vendedor verificado</h3>
								<p className="text-gray-600 mt-2">
									A verificação é um passo rápido que protege quem compra e valoriza quem vende.
									Precisas apenas de um documento de identificação e uma foto tua.
								</p>
							</div>
						</div>

						{/* Passos (sequência real do processo) */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
							<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
								<div className="flex items-center gap-2 mb-2">
									<span className="w-7 h-7 rounded-full bg-[#154c9a] text-white font-bold text-sm flex items-center justify-center">01</span>
									<Upload className="w-4 h-4 text-gray-400" />
								</div>
								<p className="font-semibold text-gray-900">Envia documentos e fotos</p>
								<p className="text-sm text-gray-600 mt-1">BI ou passaporte, documentos da empresa (opcional) e uma selfie.</p>
							</div>
							<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
								<div className="flex items-center gap-2 mb-2">
									<span className="w-7 h-7 rounded-full bg-[#154c9a] text-white font-bold text-sm flex items-center justify-center">02</span>
									<ClipboardCheck className="w-4 h-4 text-gray-400" />
								</div>
								<p className="font-semibold text-gray-900">A equipa Caxiauto analisa</p>
								<p className="text-sm text-gray-600 mt-1">Assim que submetes, a nossa equipa revê os documentos.</p>
							</div>
							<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
								<div className="flex items-center gap-2 mb-2">
									<span className="w-7 h-7 rounded-full bg-[#154c9a] text-white font-bold text-sm flex items-center justify-center">03</span>
									<ShieldCheck className="w-4 h-4 text-gray-400" />
								</div>
								<p className="font-semibold text-gray-900">Publica com o selo de confiança</p>
								<p className="text-sm text-gray-600 mt-1">Anuncia veículos, peças e alugueres com selo de verificado.</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3 mt-8">
							<Link
								to="/minha-loja/documentos"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#154c9a] text-white font-semibold text-sm hover:bg-[#123f80] transition-colors"
							>
								Começar verificação
								<ArrowRight className="w-4 h-4" />
							</Link>
							<Link
								to="/minha-conta"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
							>
								Voltar à Minha Conta
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
