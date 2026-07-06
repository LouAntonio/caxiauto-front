import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useVehicles = (filters = {}) => {
	return useQuery({
		queryKey: ['vehicles', filters],
		queryFn: () => api.listVehicles(filters),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useVehicle = (id) => {
	return useQuery({
		queryKey: ['vehicles', id],
		queryFn: () => api.getVehicle(id),
		enabled: !!id,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useFeaturedVehicles = (params = {}) => {
	return useQuery({
		queryKey: ['vehicles', 'featured', params],
		queryFn: () => api.listFeaturedVehicles(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useRecentVehicles = () =>
	useVehicles({ limit: 8, sort: 'createdAt', order: 'desc' });

export const useMyVehicles = (params = {}) => {
	return useQuery({
		queryKey: ['vehicles', 'my', params],
		queryFn: () => api.myVehicles(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useCreateVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.createVehicle(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

export const useUpdateVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.updateVehicle(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

export const useDeleteVehicle = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteVehicle(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

export const useToggleVehicleStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }) => api.toggleVehicleStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};

export const useToggleVehicleFeatured = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, featuredUntil }) => api.toggleVehicleFeatured(id, featuredUntil),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		},
	});
};
