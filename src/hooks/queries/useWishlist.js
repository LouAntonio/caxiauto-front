import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useWishlist = () => {
	return useQuery({
		queryKey: ['wishlist'],
		queryFn: () => api.getWishlist(),
		select: (res) => {
			if (!res.success) return { vehicles: [], pecas: [] };
			return {
				vehicles: res.data?.vehicles || [],
				pecas: res.data?.pecas || [],
			};
		},
	});
};

export const useAddVehicleToWishlist = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (vehicleId) => api.addVehicleToWishlist(vehicleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
		},
	});
};

export const useRemoveVehicleFromWishlist = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (vehicleId) => api.removeVehicleFromWishlist(vehicleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
		},
	});
};

export const useAddPecaToWishlist = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (pecaId) => api.addPecaToWishlist(pecaId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
		},
	});
};

export const useRemovePecaFromWishlist = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (pecaId) => api.removePecaFromWishlist(pecaId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
		},
	});
};
