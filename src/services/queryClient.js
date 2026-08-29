import { QueryClient } from '@tanstack/react-query';
import { notyf } from './axios';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
			onError: (error, query) => {
				// Com o C7, falhas de rede/5xx chegam como rejeição. Avisa apenas
				// quando ainda não há dados no ecrã (evita ruído em refetches de fundo).
				if (query.state.data === undefined) {
					notyf.error(error?.message || 'Erro ao comunicar com o servidor');
					console.error('Query error:', error);
				}
			},
		},
	},
});
