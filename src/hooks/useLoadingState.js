import { useState, useRef, useCallback } from 'react';

const useLoadingState = ({ preventConcurrent = true } = {}) => {
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const isMountedRef = useRef(true);

	const withLoading = useCallback(async (asyncFn, { key } = {}) => {
		if (preventConcurrent && loading) return null;
		setLoading(true);
		if (key) setActionLoading((prev) => ({ ...prev, [key]: true }));
		try {
			const result = await asyncFn();
			return result;
		} finally {
			if (isMountedRef.current) {
				setLoading(false);
				if (key) setActionLoading((prev) => ({ ...prev, [key]: false }));
			}
		}
	}, [preventConcurrent, loading]);

	const isActionLoading = (key) => {
		return actionLoading[key] === true;
	};

	const cleanup = () => {
		isMountedRef.current = false;
	};

	return { loading, setLoading, withLoading, actionLoading, setActionLoading, isActionLoading, cleanup };
};

export default useLoadingState;
