import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const useManufacturers = () => {
	return useQuery({
		queryKey: ['manufacturers'],
		queryFn: () => api.getManufacturers(),
		select: (res) => (res.success ? res.data : []),
	});
};

export const useClasses = () => {
	return useQuery({
		queryKey: ['classes'],
		queryFn: () => api.getClasses(),
		select: (res) => (res.success ? res.data : []),
	});
};
