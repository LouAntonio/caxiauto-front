import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook para gerenciar AbortController em requisições fetch.
 * Cancela automaticamente requisições pendentes quando:
 * - Os deps mudam (nova chamada trigger)
 * - O componente desmonta
 *
 * @returns {{ signal: AbortSignal | null, abort: Function }} - signal para passar ao fetch, abort para cancelar manualmente
 */
const useAbortableFetch = () => {
	const controllerRef = useRef(null);

	const abort = useCallback(() => {
		if (controllerRef.current) {
			controllerRef.current.abort();
			controllerRef.current = null;
		}
	}, []);

	const getSignal = useCallback(() => {
		abort();
		controllerRef.current = new AbortController();
		return controllerRef.current.signal;
	}, [abort]);

	useEffect(() => {
		return abort;
	}, [abort]);

	return { getSignal, abort };
};

export default useAbortableFetch;
