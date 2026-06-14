import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const usePlans = () => {
	return useQuery({
		queryKey: ['subscriptions', 'plans'],
		queryFn: () => api.listPlans(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useHighlightPackages = () => {
	return useQuery({
		queryKey: ['subscriptions', 'highlight-packages'],
		queryFn: () => api.listHighlightPackages(),
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

export const useSubscribePlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (planId) => api.subscribePlan(planId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
		},
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

export const useBuyHighlightPackage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (packageId) => api.buyHighlightPackage(packageId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
		},
	});
};

export const useApplyVehicleHighlight = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ vehicleId, daysDuration }) => api.applyVehicleHighlight(vehicleId, daysDuration),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};
