import React, { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import { notyf, API_URL } from '../../services/api';
import api from '../../services/api';
import axios from 'axios';
import {
	CreditCard,
	Check,
	X,
	Star,
	Loader2,
	AlertCircle,
	Car,
	Wrench,
	Upload
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { SkeletonCard } from '../../components/skeletons';
import ButtonLoader from '../../components/ButtonLoader';
import { usePlans, useHighlightPlans, useMySubscription, useMyPayments, useCancelSubscription, useCreateSubscriptionPayment, useCreateHighlightPayment, useUploadPaymentProof } from '../../hooks/queries/useSubscription';
import { useMyVehicles } from '../../hooks/queries/useVehicles';
import { useMyPecas } from '../../hooks/queries/usePecas';

const Assinatura = () => {
	useDocumentTitle('Minha Assinatura - CaxiAuto');

	useAuthStore();
	const { data: plans, isLoading: plansLoading } = usePlans();
	const { data: highlightPlans, isLoading: highlightLoading } = useHighlightPlans();
	const { data: mySubscription, isLoading: subscriptionLoading } = useMySubscription();
	const { data: myPayments, isLoading: paymentsLoading } = useMyPayments();
	const cancelSubscription = useCancelSubscription();
	const createSubscriptionPayment = useCreateSubscriptionPayment();
	const createHighlightPayment = useCreateHighlightPayment();
	const uploadProof = useUploadPaymentProof();

	const [selectedPlan, setSelectedPlan] = useState(null);
	const [selectedHlPlan, setSelectedHlPlan] = useState(null);
	const [selectedItemType, setSelectedItemType] = useState('VEHICLE');
	const [selectedItemId, setSelectedItemId] = useState('');
	const [processing, setProcessing] = useState(false);
	const [proofUploads, setProofUploads] = useState({});

	const { data: myVehicles } = useMyVehicles();
	const { data: myPecas } = useMyPecas();

	const hiddenVehicles = (myVehicles || []).filter(v => v.status === 'HIDDEN' && (v.type === 'RENT' || v.type === 'BOTH'));
	const hiddenPecas = (myPecas || []).filter(p => p.status === 'HIDDEN');
	const totalHidden = hiddenVehicles.length + hiddenPecas.length;

	const loading = plansLoading || highlightLoading || subscriptionLoading || paymentsLoading;

	const TARGET_LABELS = { SALE: 'Venda', RENT: 'Aluguer', PECA: 'Peças/Acessórios' };
	const ITEM_TYPE_LABELS = { VEHICLE: 'Veículo', PECA: 'Peça' };

	const getPlanIcon = (planName) => {
		if (planName?.toLowerCase().includes('premium') || planName?.toLowerCase().includes('stand')) return Star;
		return CreditCard;
	};

	const uploadToCloudinary = async (file, folder) => {
		const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`, {}, true);
		if (!authResponse.success) throw new Error('Falha ao autorizar upload');

		const { cloudname, timestamp, signature, apikey } = authResponse;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', apikey);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);
		formData.append('folder', folder);

		const { data: uploadData } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, formData);
		return uploadData.secure_url;
	};

	const handleSubscribe = async (planId) => {
		setProcessing(true);
		setSelectedPlan(planId);
		try {
			const response = await createSubscriptionPayment.mutateAsync(planId);
			if (response.success) {
				notyf.success('Pagamento criado! Faça upload do comprovativo.');
			} else {
				notyf.error(response.msg || 'Erro ao criar pagamento');
			}
		} catch {
			notyf.error('Erro ao criar pagamento');
		} finally {
			setProcessing(false);
			setSelectedPlan(null);
		}
	};

	const handleBuyHighlight = async (planId) => {
		if (!selectedItemId.trim()) {
			notyf.error('Informe o ID do ' + ITEM_TYPE_LABELS[selectedItemType].toLowerCase());
			return;
		}
		setProcessing(true);
		setSelectedHlPlan(planId);
		try {
			const response = await createHighlightPayment.mutateAsync({
				planId,
				itemType: selectedItemType,
				itemId: selectedItemId.trim()
			});
			if (response.success) {
				notyf.success('Pagamento criado! Faça upload do comprovativo.');
				setSelectedItemId('');
			} else {
				notyf.error(response.msg || 'Erro ao criar pagamento');
			}
		} catch {
			notyf.error('Erro ao criar pagamento');
		} finally {
			setProcessing(false);
			setSelectedHlPlan(null);
		}
	};

	const handleUploadProof = async (paymentId, file) => {
		try {
			const proofUrl = await uploadToCloudinary(file, 'payments');
			const response = await uploadProof.mutateAsync({ paymentId, proofUrl });
			if (response.success) {
				notyf.success('Comprovativo enviado com sucesso!');
				setProofUploads((prev) => ({ ...prev, [paymentId]: null }));
			} else {
				notyf.error(response.msg || 'Erro ao enviar comprovativo');
			}
		} catch {
			notyf.error('Erro ao fazer upload do comprovativo');
		}
	};

	const handleProofFileChange = (paymentId, e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			notyf.error('Selecione um ficheiro de imagem válido');
			return;
		}
		setProofUploads((prev) => ({ ...prev, [paymentId]: file }));
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

	const STATUS_LABEL = { PENDING: 'Pendente', APPROVED: 'Aprovado', REJECTED: 'Rejeitado' };
	const STATUS_BADGE = {
		PENDING: 'bg-yellow-100 text-yellow-800',
		APPROVED: 'bg-green-100 text-green-800',
		REJECTED: 'bg-red-100 text-red-800',
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
						<div className="space-y-2">
							<div className="h-7 bg-gray-200 rounded w-48 animate-pulse" />
							<div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
						</div>
					</div>
					<div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
						<div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
						<div className="h-5 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse" />
						<div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
						<div className="space-y-2">
							<div className="h-7 bg-gray-200 rounded w-48 animate-pulse" />
							<div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<SkeletonCard /><SkeletonCard /><SkeletonCard />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{totalHidden > 0 && (
				<div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5">
					<div className="flex items-start gap-3">
						<AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
						<div>
							<h3 className="font-bold text-amber-900 text-lg mb-1">Itens ocultos pelo plano</h3>
							<p className="text-amber-800 text-sm mb-3">
								{hiddenVehicles.length > 0 && `${hiddenVehicles.length} veículo${hiddenVehicles.length > 1 ? 's' : ''} de aluguer oculto${hiddenVehicles.length > 1 ? 's' : ''}`}
								{hiddenVehicles.length > 0 && hiddenPecas.length > 0 && ' e '}
								{hiddenPecas.length > 0 && `${hiddenPecas.length} peça${hiddenPecas.length > 1 ? 's' : ''} oculta${hiddenPecas.length > 1 ? 's' : ''}`}
								{'. Faça upgrade do seu plano ou ative manualmente trocando com um item ativo.'}
							</p>
							<div className="flex gap-3">
								{hiddenVehicles.length > 0 && (
									<a href="/minha-conta/veiculos" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-all">
										<Car className="w-4 h-4" />
										Gerir Veículos
									</a>
								)}
								{hiddenPecas.length > 0 && (
									<a href="/minha-conta/pecas" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-all">
										<Wrench className="w-4 h-4" />
										Gerir Peças
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Minha Assinatura Atual */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
						<CreditCard className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Minha Assinatura</h2>
						<p className="text-sm text-gray-500 mt-1">Gerencie sua assinatura para aluguer e peças</p>
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
							<span className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold">Ativa</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
							<div className="bg-white rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">Início</p>
								<p className="font-semibold text-gray-900">{formatDate(mySubscription.startDate)}</p>
							</div>
							<div className="bg-white rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">Validade</p>
								<p className="font-semibold text-gray-900">{formatDate(mySubscription.endDate)}</p>
							</div>
						</div>
						<ButtonLoader
							onClick={() => {
								if (!window.confirm('Tem certeza que deseja cancelar sua assinatura?')) return;
								cancelSubscription.mutateAsync().then((res) => {
									if (res.success) notyf.success('Assinatura cancelada');
									else notyf.error(res.msg || 'Erro ao cancelar');
								}).catch(() => notyf.error('Erro ao cancelar'));
							}}
							loading={cancelSubscription.isPending}
							loadingText="Cancelando..."
							variant="red_outline"
							className="mt-6 w-full"
						>
							<X className="w-5 h-5" />
							Cancelar Assinatura
						</ButtonLoader>
					</div>
				) : (
					<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
						<CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma assinatura ativa</h3>
						<p className="text-gray-600 mb-6">
							Assine um plano para anunciar aluguer de veículos e peças/acessórios
						</p>
					</div>
				)}
			</div>

			{/* Planos de Assinatura Disponíveis */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<CreditCard className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Planos de Subscrição</h2>
						<p className="text-sm text-gray-500 mt-1">Para aluguer de veículos e anúncio de peças/acessórios</p>
					</div>
				</div>

				{plans.length === 0 ? (
					<div className="text-center py-8"><p className="text-gray-600">Nenhum plano disponível no momento</p></div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{plans.map((plan) => {
							const Icon = getPlanIcon(plan.name);
							return (
								<div key={plan.id} className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${mySubscription?.planId === plan.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}>
									{mySubscription?.planId === plan.id && (
										<div className="mb-4">
											<span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">Seu Plano Atual</span>
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
									</div>
									<ButtonLoader
										onClick={() => handleSubscribe(plan.id)}
										loading={processing && selectedPlan === plan.id}
										loadingText="Processando..."
										variant={mySubscription?.planId === plan.id ? 'success' : 'primary'}
										className={`w-full ${mySubscription?.planId === plan.id ? 'cursor-not-allowed' : ''}`}
										disabled={mySubscription?.planId === plan.id}
									>
										{mySubscription?.planId === plan.id ? 'Plano Atual' : 'Assinar Agora'}
									</ButtonLoader>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Planos de Destaque */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
						<Star className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Planos de Destaque</h2>
						<p className="text-sm text-gray-500 mt-1">Destaque seus anúncios para mais visibilidade</p>
					</div>
				</div>

				{/* Item type + ID selector */}
				<div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Anúncio</label>
							<select
								value={selectedItemType}
								onChange={(e) => setSelectedItemType(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
							>
								<option value="VEHICLE">Veículo</option>
								<option value="PECA">Peça</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">ID do Anúncio</label>
							<input
								type="text"
								value={selectedItemId}
								onChange={(e) => setSelectedItemId(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
								placeholder="Cole o ID do veículo ou peça..."
							/>
						</div>
					</div>
				</div>

				{highlightPlans.length === 0 ? (
					<div className="text-center py-8"><p className="text-gray-600">Nenhum plano de destaque disponível</p></div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{highlightPlans.map((plan) => (
							<div key={plan.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-yellow-300 transition-all">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
										<Star className="w-6 h-6 text-yellow-600" />
									</div>
									<h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
								</div>
								<div className="mb-2">
									<span className="text-3xl font-bold text-[#154c9a]">{formatPrice(plan.price)}</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
									<Car className="w-4 h-4" />
									<span>{plan.daysDuration} dias de destaque</span>
								</div>
								<div className="mb-6">
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{TARGET_LABELS[plan.target] || plan.target}
									</span>
								</div>
								<ButtonLoader
									onClick={() => handleBuyHighlight(plan.id)}
									loading={processing && selectedHlPlan === plan.id}
									loadingText="Processando..."
									variant="yellow"
									className="w-full"
								>
									Comprar e Aplicar
								</ButtonLoader>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Meus Pagamentos */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
						<Upload className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h2>
						<p className="text-sm text-gray-500 mt-1">Acompanhe e envie comprovativos</p>
					</div>
				</div>

				{myPayments.length === 0 ? (
					<div className="text-center py-8"><p className="text-gray-600">Nenhum pagamento encontrado</p></div>
				) : (
					<div className="space-y-4">
						{myPayments.map((payment) => (
							<div key={payment.id} className="border border-gray-200 rounded-xl p-4">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm font-semibold text-gray-900">
												{payment.for === 'SUBSCRIPTION' ? 'Subscrição' : 'Destaque'}
											</span>
											<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[payment.status]}`}>
												{STATUS_LABEL[payment.status]}
											</span>
										</div>
										<p className="text-lg font-bold text-[#154c9a]">{formatPrice(Number(payment.amount))}</p>
										<p className="text-xs text-gray-500 mt-1">{formatDate(payment.createdAt)}</p>
										{payment.adminNotes && (
											<p className="text-sm text-red-600 mt-2">Motivo: {payment.adminNotes}</p>
										)}
									</div>
									<div className="flex-shrink-0">
										{payment.status === 'PENDING' && !payment.proofUrl && (
											<div className="flex flex-col items-center gap-2">
												<input
													type="file"
													accept="image/*"
													id={`proof-${payment.id}`}
													className="hidden"
													onChange={(e) => handleProofFileChange(payment.id, e)}
												/>
												{proofUploads[payment.id] ? (
													<ButtonLoader
														onClick={() => handleUploadProof(payment.id, proofUploads[payment.id])}
														loading={uploadProof.isPending}
														loadingText="Enviando..."
														variant="primary"
														className="text-sm px-4 py-2"
													>
														Enviar Comprovativo
													</ButtonLoader>
												) : (
													<label
														htmlFor={`proof-${payment.id}`}
														className="flex items-center gap-2 px-4 py-2 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] cursor-pointer text-sm"
													>
														<Upload className="w-4 h-4" />
														Upload Comprovativo
													</label>
												)}
											</div>
										)}
										{payment.status === 'PENDING' && payment.proofUrl && (
											<span className="text-sm text-yellow-600 font-medium">Comprovativo enviado — aguarde aprovação</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Aviso */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-start gap-2">
					<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
					<div className="text-sm text-blue-700">
						<p className="font-semibold mb-1">Como funcionam os pagamentos?</p>
						<p>Após criar um pagamento, faça upload do comprovativo de transferência. A equipa Caxiauto irá aprovar o pagamento e ativar o serviço.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Assinatura;
