import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const usePecas = (filters = {}) => {
	return useQuery({
		queryKey: ['pecas', filters],
		queryFn: () => api.listPecas(filters),
		select: (res) => (res.success ? res.data : []),
	});
};

export const usePeca = (id) => {
	return useQuery({
		queryKey: ['pecas', id],
		queryFn: () => api.getPeca(id),
		enabled: !!id,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useFeaturedPecas = (params = {}) => {
	return useQuery({
		queryKey: ['pecas', 'featured', params],
		queryFn: () => api.listFeaturedPecas(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useMyPecas = (params = {}) => {
	return useQuery({
		queryKey: ['pecas', 'my', params],
		queryFn: () => api.minhasPecas(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useCreatePeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.createPeca(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useUpdatePeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.updatePeca(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useDeletePeca = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deletePeca(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useTogglePecaStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }) => api.togglePecaStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};

export const useTogglePecaFeatured = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, featuredUntil }) => api.togglePecaFeatured(id, featuredUntil),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pecas'] });
		},
	});
};
