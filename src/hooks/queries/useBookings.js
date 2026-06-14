import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useMyBookings = (params = {}) => {
	return useQuery({
		queryKey: ['bookings', 'my', params],
		queryFn: () => api.getMyBookings(params),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useBookingsByVehicle = (vehicleId, params = {}) => {
	return useQuery({
		queryKey: ['bookings', 'vehicle', vehicleId, params],
		queryFn: () => api.getBookingsByVehicle(vehicleId, params),
		enabled: !!vehicleId,
		select: (res) => (res.success ? res.data : []),
	});
};

export const useBooking = (id) => {
	return useQuery({
		queryKey: ['bookings', id],
		queryFn: () => api.getBooking(id),
		enabled: !!id,
		select: (res) => (res.success ? res.data : null),
	});
};

export const useCreateBooking = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ vehicleId, startDate, endDate }) => api.createBooking(vehicleId, startDate, endDate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bookings'] });
		},
	});
};

export const useUpdateBookingStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }) => api.updateBookingStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bookings'] });
		},
	});
};

export const useCancelBooking = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.cancelBooking(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['bookings'] });
		},
	});
};
