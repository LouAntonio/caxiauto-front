import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const STORE_SECTIONS = ['ALUGUEL', 'PECAS', 'EMPRESAS'];

export const SECTION_LABELS = {
	ALUGUEL: 'Aluguel',
	PECAS: 'Peças e Acessórios',
	EMPRESAS: 'Empresas'
};

export const usePlans = (section) => {
	return useQuery({
		queryKey: ['subscriptions', 'plans', section || 'all'],
		queryFn: () => api.listPlans(section),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useHighlightPlans = () => {
	return useQuery({
		queryKey: ['subscriptions', 'highlight-plans'],
		queryFn: () => api.listHighlightPlans(),
		select: (res) => (res.success ? res.data : []),
	});
};

/**
 * Assinaturas do vendedor — uma por secção. Devolve { data, bySection, isActive(section) }.
 */
export const useMySubscriptions = () => {
	const query = useQuery({
		queryKey: ['subscriptions', 'my'],
		queryFn: () => api.getMySubscriptions(),
		select: (res) => (res.success ? res.data : []),
	});

	const bySection = {};
	for (const section of STORE_SECTIONS) bySection[section] = null;
	if (query.data) {
		for (const sub of query.data) {
			const current = bySection[sub.section];
			if (!current || new Date(sub.endDate) > new Date(current.endDate)) {
				bySection[sub.section] = sub;
			}
		}
	}

	const isActive = (section) => {
		const sub = bySection[section];
		return !!(sub && sub.isActive && new Date(sub.endDate) > new Date());
	};

	return { ...query, bySection, isActive };
};

export const useSellerHome = () => {
	return useQuery({
		queryKey: ['seller', 'home'],
		queryFn: () => api.getSellerHome(),
		select: (res) => (res.success ? res.data : null),
	});
};

export const useMyPayments = () => {
	return useQuery({
		queryKey: ['subscriptions', 'payments', 'my'],
		queryFn: () => api.getMyPayments(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useCancelSubscription = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (section) => api.cancelSubscription(section),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
			queryClient.invalidateQueries({ queryKey: ['seller'] });
		},
	});
};

export const useCreateSubscriptionPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (planId) => api.createSubscriptionPayment(planId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions', 'payments'] });
		},
	});
};

export const useCreateHighlightPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ planId, itemType, itemId }) => api.createHighlightPayment(planId, itemType, itemId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions', 'payments'] });
		},
	});
};

export const useUploadPaymentProof = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ paymentId, proofUrl }) => api.uploadPaymentProof(paymentId, proofUrl),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions', 'payments'] });
		},
	});
};
