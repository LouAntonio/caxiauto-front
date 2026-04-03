import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api, { notyf } from '../../services/api';
import {
	CreditCard,
	Check,
	X,
	Star,
	Crown,
	Zap,
	Loader2,
	AlertCircle,
	Car
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Assinatura = () => {
	useDocumentTitle('Minha Assinatura - CaxiAuto');

	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [plans, setPlans] = useState([]);
	const [highlightPackages, setHighlightPackages] = useState([]);
	const [mySubscription, setMySubscription] = useState(null);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [plansRes, packagesRes, subscriptionRes] = await Promise.all([
				api.listPlans(),
				api.listHighlightPackages(),
				api.getMySubscription()
			]);

			if (plansRes.success) {
				setPlans(plansRes.data || []);
			}

			if (packagesRes.success) {
				setHighlightPackages(packagesRes.data || []);
			}

			if (subscriptionRes.success) {
				setMySubscription(subscriptionRes.data);
			}
		} catch (error) {
			console.error('Erro ao carregar dados:', error);
			notyf.error('Erro ao carregar dados de assinaturas');
		} finally {
			setLoading(false);
		}
	};

	const handleSubscribe = async (planId) => {
		setProcessing(true);
		try {
			const response = await api.subscribePlan(planId);

			if (response.success) {
				notyf.success('Assinatura ativada com sucesso!');
				fetchData();
			} else {
				notyf.error(response.msg || 'Erro ao assinar plano');
			}
		} catch (error) {
			console.error('Erro ao assinar plano:', error);
			notyf.error('Erro ao assinar plano');
		} finally {
			setProcessing(false);
			setSelectedPlan(null);
		}
	};

	const handleCancelSubscription = async () => {
		if (!window.confirm('Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.')) {
			return;
		}

		setProcessing(true);
		try {
			const response = await api.cancelSubscription();

			if (response.success) {
				notyf.success('Assinatura cancelada com sucesso');
				fetchData();
			} else {
				notyf.error(response.msg || 'Erro ao cancelar assinatura');
			}
		} catch (error) {
			console.error('Erro ao cancelar assinatura:', error);
			notyf.error('Erro ao cancelar assinatura');
		} finally {
			setProcessing(false);
		}
	};

	const handleBuyHighlightPackage = async (packageId) => {
		setProcessing(true);
		try {
			const response = await api.buyHighlightPackage(packageId);

			if (response.success) {
				notyf.success('Pacote de destaque comprado com sucesso!');
				fetchData();
			} else {
				notyf.error(response.msg || 'Erro ao comprar pacote');
			}
		} catch (error) {
			console.error('Erro ao comprar pacote:', error);
			notyf.error('Erro ao comprar pacote de destaque');
		} finally {
			setProcessing(false);
			setSelectedPackage(null);
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA'
		}).format(price);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	const getPlanIcon = (planName) => {
		if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('stand')) {
			return Crown;
		}
		if (planName.toLowerCase().includes('profissional')) {
			return Star;
		}
		return Zap;
	};

	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-center py-16">
					<div className="text-center">
						<Loader2 className="w-12 h-12 animate-spin text-[#154c9a] mx-auto mb-4" />
						<p className="text-gray-600">Carregando planos e assinaturas...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Minha Assinatura Atual */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
						<CreditCard className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Minha Assinatura</h2>
						<p className="text-sm text-gray-500 mt-1">Gerencie sua assinatura e benefícios</p>
					</div>
				</div>

				{mySubscription && mySubscription.isActive ? (
					<div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
						<div className="flex items-start justify-between mb-4">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Check className="w-5 h-5 text-green-600" />
									<h3 className="text-xl font-bold text-green-900">Assinatura Ativa</h3>
								</div>
								<p className="text-2xl font-bold text-green-700">{mySubscription.plan?.name}</p>
							</div>
							<span className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold">
								Ativa
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
							<div className="bg-white rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">Início</p>
								<p className="font-semibold text-gray-900">{formatDate(mySubscription.startDate)}</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">Validade</p>
								<p className="font-semibold text-gray-900">{formatDate(mySubscription.endDate)}</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">Créditos de Destaque</p>
								<p className="font-semibold text-[#154c9a]">{mySubscription.remainingHighlightCredits || 0}</p>
							</div>
						</div>

						<button
							onClick={handleCancelSubscription}
							disabled={processing}
							className="mt-6 w-full bg-red-50 text-red-600 py-3 px-6 rounded-lg hover:bg-red-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{processing ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Processando...
								</>
							) : (
								<>
									<X className="w-5 h-5" />
									Cancelar Assinatura
								</>
							)}
						</button>
					</div>
				) : (
					<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
						<CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma assinatura ativa</h3>
						<p className="text-gray-600 mb-6">
							Assine um plano para ter acesso a mais veículos, peças e destaques
						</p>
					</div>
				)}
			</div>

			{/* Planos Disponíveis */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<Star className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Planos Disponíveis</h2>
						<p className="text-sm text-gray-500 mt-1">Escolha o plano ideal para o seu negócio</p>
					</div>
				</div>

				{plans.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600">Nenhum plano disponível no momento</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{plans.map((plan) => {
							const Icon = getPlanIcon(plan.name);
							return (
								<div
									key={plan.id}
									className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
										mySubscription?.planId === plan.id
											? 'border-green-500 bg-green-50'
											: 'border-gray-200 hover:border-blue-300'
									}`}
								>
									{mySubscription?.planId === plan.id && (
										<div className="mb-4">
											<span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
												Seu Plano Atual
											</span>
										</div>
									)}

									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
											<Icon className="w-6 h-6 text-[#154c9a]" />
										</div>
										<h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
									</div>

									<div className="mb-6">
										<span className="text-3xl font-bold text-[#154c9a]">{formatPrice(plan.price)}</span>
										<span className="text-gray-600 text-sm">/mês</span>
									</div>

									<div className="space-y-3 mb-6">
										<div className="flex items-center gap-2 text-sm">
											<Check className="w-4 h-4 text-green-600" />
											<span>Até {plan.maxVehicles} veículos</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Check className="w-4 h-4 text-green-600" />
											<span>Até {plan.maxPecas} peças</span>
										</div>
										{plan.highlightCredits > 0 && (
											<div className="flex items-center gap-2 text-sm">
												<Star className="w-4 h-4 text-yellow-600" />
												<span>{plan.highlightCredits} destaques/mês</span>
											</div>
										)}
									</div>

									<button
										onClick={() => handleSubscribe(plan.id)}
										disabled={processing || mySubscription?.planId === plan.id}
										className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
											mySubscription?.planId === plan.id
												? 'bg-green-600 text-white cursor-not-allowed'
												: 'bg-[#154c9a] text-white hover:bg-[#123f80]'
										} disabled:opacity-50 disabled:cursor-not-allowed`}
									>
										{processing && selectedPlan === plan.id ? (
											<div className="flex items-center justify-center gap-2">
												<Loader2 className="w-5 h-5 animate-spin" />
												Processando...
											</div>
										) : mySubscription?.planId === plan.id ? (
											'Plano Atual'
										) : (
											'Assinar Agora'
										)}
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Pacotes de Destaque */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
						<Star className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Pacotes de Destaque</h2>
						<p className="text-sm text-gray-500 mt-1">Destaque seus veículos e peças para mais visibilidade</p>
					</div>
				</div>

				{highlightPackages.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600">Nenhum pacote de destaque disponível</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{highlightPackages.map((pkg) => (
							<div
								key={pkg.id}
								className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-yellow-300 transition-all"
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
										<Star className="w-6 h-6 text-yellow-600" />
									</div>
									<h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
								</div>

								<div className="mb-4">
									<span className="text-3xl font-bold text-[#154c9a]">{formatPrice(pkg.price)}</span>
								</div>

								<div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
									<Car className="w-4 h-4" />
									<span>{pkg.daysDuration} dias de destaque</span>
								</div>

								<button
									onClick={() => handleBuyHighlightPackage(pkg.id)}
									disabled={processing}
									className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{processing && selectedPackage === pkg.id ? (
										<div className="flex items-center justify-center gap-2">
											<Loader2 className="w-5 h-5 animate-spin" />
											Processando...
										</div>
									) : (
										'Comprar Pacote'
									)}
								</button>
							</div>
						))}
					</div>
				)}

				{/* Aviso */}
				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-2">
						<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="text-sm text-blue-700">
							<p className="font-semibold mb-1">Como funcionam os destaques?</p>
							<p>Após comprar um pacote, você pode aplicar o destaque em seus veículos e peças. Itens destacados aparecem no topo das buscas e têm mais visibilidade.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Assinatura;
