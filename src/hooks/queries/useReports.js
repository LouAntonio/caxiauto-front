import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useMyReports = (params = {}) => {
	return useQuery({
		queryKey: ['reports', 'my', params],
		queryFn: () => api.getMyReports(params),
		select: (res) => {
			if (!res.success) return { data: [], pagination: { total: 0, totalPages: 1, page: params.page || 1 } };
			return {
				data: res.data || [],
				pagination: res.pagination || { total: 0, totalPages: 1, page: params.page || 1 }
			};
		},
	});
};

export const useAllReports = (params = {}) => {
	return useQuery({
		queryKey: ['reports', 'all', params],
		queryFn: () => api.getAllReports(params),
		select: (res) => {
			if (!res.success) return { data: [], pagination: { total: 0, totalPages: 1, page: params.page || 1 } };
			return {
				data: res.data || [],
				pagination: res.pagination || { total: 0, totalPages: 1, page: params.page || 1 }
			};
		},
	});
};

export const useReport = (id) => {
	return useQuery({
		queryKey: ['reports', id],
		queryFn: () => api.getReport(id),
		enabled: !!id,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useCreateReport = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ reason, description, target }) => api.createReport(reason, description, target),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reports'] });
		},
	});
};

export const useUpdateReportStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }) => api.updateReportStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reports'] });
		},
	});
};

export const useDeleteReport = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteReport(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reports'] });
		},
	});
};
