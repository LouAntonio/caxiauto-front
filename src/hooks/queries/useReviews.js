import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useMyReviews = (params = {}) => {
	return useQuery({
		queryKey: ['reviews', 'my', params],
		queryFn: () => api.getMyReviews(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useReviewsBySeller = (sellerId, params = {}) => {
	return useQuery({
		queryKey: ['reviews', 'seller', sellerId, params],
		queryFn: () => api.getReviewsBySeller(sellerId, params),
		enabled: !!sellerId,
		select: (res) => (res.success ? res.data : []),
	});
};

export const useReviewSummary = (sellerId) => {
	return useQuery({
		queryKey: ['reviews', 'summary', sellerId],
		queryFn: () => api.getReviewSummary(sellerId),
		enabled: !!sellerId,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useCreateReview = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ sellerId, rating, comment }) => api.createReview(sellerId, rating, comment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
	});
};

export const useDeleteReview = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.deleteReview(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
	});
};
