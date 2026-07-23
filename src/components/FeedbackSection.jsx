import React, { useState, useEffect, useCallback } from 'react'
import { MessageCircle, Star, X } from 'lucide-react'

const reviews = [
	{
		name: 'João M.',
		initials: 'JM',
		rating: 5,
		date: 'há 3 dias',
		text: 'Comprei o meu primeiro carro pela Caxiauto e foi uma experiência incrível. A equipa ajudou-me em todo o processo, desde a escolha até à documentação. Recomendo de olhos fechados!',
	},
	{
		name: 'Maria A.',
		initials: 'MA',
		rating: 4,
		date: 'há 1 semana',
		text: 'Aluguei uma viatura para uma viagem em família e correu tudo bem. O processo foi simples e o carro estava em óptimo estado. Só acho que podiam ter mais opções de SUV.',
	},
	{
		name: 'Pedro S.',
		initials: 'PS',
		rating: 5,
		date: 'há 2 semanas',
		text: 'Vendi o meu carro em menos de uma semana e por um preço justo. A Caxiauto cuidou de toda a papelada e ainda me ajudou a encontrar o próximo. Serviço completo e sem dores de cabeça.',
	},
	{
		name: 'Ana C.',
		initials: 'AC',
		rating: 4,
		date: 'há 3 semanas',
		text: 'Comprei peças para o meu carro e chegaram rápido. O site é fácil de usar e o suporte foi rápido a responder às minhas dúvidas. Vou repetir a experiência.',
	},
]

const SHOW_MS = 10000
const HIDE_MS = 20000
const R = 26
const CIRCUMFERENCE = 2 * Math.PI * R

export default function FeedbackSection() {
	const [index, setIndex] = useState(0)
	const [phase, setPhase] = useState('show')
	const [paused, setPaused] = useState(false)
	const [progress, setProgress] = useState(0)
	const [reducedMotion, setReducedMotion] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		const handler = (e) => setReducedMotion(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	useEffect(() => {
		if (reducedMotion || paused) return

		if (phase === 'show') {
			const start = Date.now()

			const progressTimer = setInterval(() => {
				setProgress(Math.min((Date.now() - start) / SHOW_MS, 1))
			}, 50)

			const timer = setTimeout(() => {
				clearInterval(progressTimer)
				setPhase('hide')
			}, SHOW_MS)

			return () => {
				clearTimeout(timer)
				clearInterval(progressTimer)
			}
		}

		if (phase === 'hide') {
			const timer = setTimeout(() => {
				setIndex((prev) => (prev + 1) % reviews.length)
				setPhase('show')
			}, HIDE_MS)

			return () => clearTimeout(timer)
		}
	}, [phase, paused, reducedMotion])

	const handleDismiss = useCallback(() => {
		setPhase('hide')
		setProgress(0)
	}, [])

	const handleTogglePause = useCallback(() => {
		if (reducedMotion) {
			setPhase((prev) => (prev === 'show' ? 'hide' : 'show'))
			setProgress(0)
		} else {
			setPaused((prev) => !prev)
		}
	}, [reducedMotion])

	const review = reviews[index]

	return (
		<div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
			<div
				className={`relative w-[90vw] sm:w-72 max-w-[320px] bg-white rounded-xl shadow-xl border border-[#e5e7eb] overflow-hidden transition-all duration-300 ease-out ${
					phase === 'show'
						? 'opacity-100 translate-x-0 scale-100'
						: 'opacity-0 translate-x-4 scale-95 pointer-events-none'
				}`}
			>
				<div className="feedback-sweep" />

				<button
					onClick={handleDismiss}
					className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors"
					aria-label="Fechar"
				>
					<X size={14} />
				</button>

				<div className="p-5 relative z-10">
					<div className="flex items-start gap-3 mb-3">
						<div className="w-9 h-9 rounded-full bg-[#154c9a] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
							{review.initials}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-display font-semibold text-[#111827] text-sm truncate pr-5">
								{review.name}
							</p>
							<div className="flex gap-0.5 mt-0.5">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										size={12}
										fill={star <= review.rating ? '#d41120' : 'none'}
										className={
											star <= review.rating
												? 'text-[#d41120]'
												: 'text-[#e5e7eb]'
										}
									/>
								))}
							</div>
						</div>
					</div>
					<p className="font-body text-sm text-[#6b7280] leading-relaxed">
						&ldquo;{review.text}&rdquo;
					</p>
					<p className="font-body text-xs text-[#9ca3af] mt-2">
						{review.date}
					</p>
				</div>
			</div>

			<button
				onClick={handleTogglePause}
				className="relative w-14 h-14 rounded-full bg-[#154c9a] shadow-lg flex items-center justify-center text-white hover:bg-[#123f80] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#154c9a] focus:ring-offset-2"
				aria-label={paused ? 'Retomar testemunhos' : 'Pausar testemunhos'}
			>
				<MessageCircle size={24} />

				{phase !== 'idle' && (
					<svg
						viewBox="0 0 56 56"
						className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
					>
						<circle
							cx="28"
							cy="28"
							r={R}
							fill="none"
							stroke="rgba(255,255,255,0.2)"
							strokeWidth="2"
						/>
						<circle
							cx="28"
							cy="28"
							r={R}
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeDasharray={CIRCUMFERENCE}
							strokeDashoffset={CIRCUMFERENCE * progress}
						/>
					</svg>
				)}
			</button>
		</div>
	)
}
