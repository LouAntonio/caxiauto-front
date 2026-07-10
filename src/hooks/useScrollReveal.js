import { useRef, useState, useEffect } from 'react';

export default function useScrollReveal(threshold = 0.15) {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);

	useEffect(() => {
		if (isVisible) return;
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(el);
				}
			},
			{ threshold }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [isVisible, threshold]);

	return [ref, isVisible];
}
