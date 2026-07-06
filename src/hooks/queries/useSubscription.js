import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const usePlans = () => {
	return useQuery({
		queryKey: ['subscriptions', 'plans'],
		queryFn: () => api.listPlans(),
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

export const useMySubscription = () => {
	return useQuery({
		queryKey: ['subscriptions', 'my'],
		queryFn: () => api.getMySubscription(),
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
		mutationFn: () => api.cancelSubscription(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
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
