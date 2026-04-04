import { useState, useRef, useCallback } from 'react';

/**
 * Hook para gerenciar estados de loading com controle de requisições concorrentes
 * Previne requisições duplicadas e permite rastrear loading por ID
 * 
 * @param {Object} options
 * @param {boolean} options.preventConcurrent - Se deve prevenir requisições concorrentes (default: true)
 * @returns {Object} { loading, actionLoading, setLoading, withLoading, isActionLoading, setActionLoading }
 */
const useLoadingState = ({ preventConcurrent = true } = {}) => {
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoadingState] = useState(new Set());
	const abortRef = useRef(null);
	const isMountedRef = useRef(true);

	// Cleanup on unmount
	const cleanup = useCallback(() => {
		isMountedRef.current = false;
		if (abortRef.current) {
			abortRef.current.abort?.();
			abortRef.current = null;
		}
	}, []);

	// Wrap an async function with loading state
	const withLoading = useCallback(async (asyncFn, { key } = {}) => {
		// Se preventConcurrent e já está loading, ignora
		if (preventConcurrent && loading) {
			return null;
		}

		// Se tem key, verifica se aquela ação específica está em loading
		if (key && actionLoading.has(key)) {
			return null;
		}

		try {
			if (key) {
				setActionLoadingState((prev) => new Set(prev).add(key));
			} else {
				setLoading(true);
			}

			const result = await asyncFn();
			return result;
		} catch (error) {
			console.error('Error in withLoading:', error);
			throw error;
		} finally {
			if (key) {
				setActionLoadingState((prev) => {
					const next = new Set(prev);
					next.delete(key);
					return next;
				});
			} else {
				if (isMountedRef.current) {
					setLoading(false);
				}
			}
		}
	}, [loading, actionLoading, preventConcurrent]);

	const setActionLoading = useCallback((key, isLoading) => {
		setActionLoadingState((prev) => {
			const next = new Set(prev);
			if (isLoading) {
				next.add(key);
			} else {
				next.delete(key);
			}
			return next;
		});
	}, []);

	const isActionLoading = useCallback((key) => {
		return actionLoading.has(key);
	}, [actionLoading]);

	return {
		loading,
		setLoading,
		withLoading,
		actionLoading,
		setActionLoading,
		isActionLoading,
		cleanup,
	};
};

export default useLoadingState;
