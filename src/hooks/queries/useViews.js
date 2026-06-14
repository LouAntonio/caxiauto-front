import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useTotalViews = () => {
	return useQuery({
		queryKey: ['views', 'total'],
		queryFn: () => api.getTotalViews(),
		select: (res) => (res.success ? res.data : 0),
	});
};

export const useTotalViewsToday = () => {
	return useQuery({
		queryKey: ['views', 'today'],
		queryFn: () => api.getTotalViewsToday(),
		select: (res) => (res.success ? res.data : 0),
	});
};

export const useMostViewed = () => {
	return useQuery({
		queryKey: ['views', 'most-viewed'],
		queryFn: () => api.getMostViewed(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useAddView = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ type, id }) => api.addView(type, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['views'] });
		},
	});
};
