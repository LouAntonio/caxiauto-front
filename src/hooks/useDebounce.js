import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {*} value - Valor a ser debounceado
 * @param {number} delay - Delay em ms (default: 300)
 * @returns {*} Valor debounceado
 */
const useDebounce = (value, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
