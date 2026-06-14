import { useQuery } from '@tanstack/react-query';
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
