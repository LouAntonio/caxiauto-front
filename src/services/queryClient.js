import { QueryClient, QueryCache } from '@tanstack/react-query';
import { notyf } from './axios';

export const queryClient = new QueryClient({
	// No TanStack Query v5, `onError` dentro de `defaultOptions.queries` é
	// ignorado — tem de viver na QueryCache. Sem isto, falhas de query eram
	// 100% silenciosas (sem toast, sem log).
	queryCache: new QueryCache({
		onError: (error, query) => {
			// Com o C7, falhas de rede/5xx chegam como rejeição. Avisa apenas
			// quando ainda não há dados no ecrã (evita ruído em refetches de fundo).
			if (query.state.data === undefined) {
				notyf.error(error?.message || 'Erro ao comunicar com o servidor');
				console.error('Query error:', error);
			}
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
		// Nota: `mutations.onError` continua a ser tratado em cada chamada
		// (try/catch + notyf), para não duplicar os toasts.
		mutations: {
			retry: 1,
		},
	},
});
