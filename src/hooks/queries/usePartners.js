import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useActivePartners = (params = {}) => {
	return useQuery({
		queryKey: ['partners', 'active', params],
		queryFn: () => api.listActivePartners(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const usePartner = (id) => {
	return useQuery({
		queryKey: ['partners', id],
		queryFn: () => api.getPartner(id),
		enabled: !!id,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useMyPartners = (params = {}) => {
	return useQuery({
		queryKey: ['partners', 'my', params],
		queryFn: () => api.myPartners(params),
		select: (res) =>
			res.success
				? { partners: res.data, meta: res.meta, pagination: res.pagination }
				: { partners: [], meta: { maxPartners: 0, hasActivePlan: false } },
	});
};

export const useCreateMyPartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.createMyPartner(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['partners', 'my'] });
			queryClient.invalidateQueries({ queryKey: ['partners', 'active'] });
		},
	});
};

export const useUpdateMyPartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.updateMyPartner(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['partners', 'my'] });
			queryClient.invalidateQueries({ queryKey: ['partners', 'active'] });
		},
	});
};

export const useDeleteMyPartner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteMyPartner(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['partners', 'my'] });
			queryClient.invalidateQueries({ queryKey: ['partners', 'active'] });
		},
	});
};