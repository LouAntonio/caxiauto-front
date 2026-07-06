import React, { useState, useRef, useEffect } from 'react'
import { Car, Building2, Star, Headphones } from 'lucide-react'

function AnimatedCounter({ target, suffix = '' }) {
	const [count, setCount] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? target : 0
	)
	const ref = useRef(null)
	const hasAnimated = useRef(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (count === target || hasAnimated.current) return

		let destroyed = false

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					hasAnimated.current = true
					observer.disconnect()

					const duration = 1500
					const start = performance.now()

					function animate(time) {
						if (destroyed) return
						const elapsed = time - start
						const progress = Math.min(elapsed / duration, 1)
						const eased = 1 - Math.pow(1 - progress, 3)
						setCount(Math.floor(eased * target))

						if (progress < 1) {
							requestAnimationFrame(animate)
						}
					}

					requestAnimationFrame(animate)
				}
			},
			{ threshold: 0.3 }
		)

		observer.observe(el)
		return () => {
			destroyed = true
			observer.disconnect()
		}
	}, [target, count])

	return (
		<span ref={ref} className="tabular-nums">
			{count}{suffix}
		</span>
	)
}

const stats = [
	{ icon: Car, target: 150, suffix: '+', label: 'Viaturas disponíveis' },
	{ icon: Building2, target: 50, suffix: '+', label: 'Parceiros verificados' },
	{ icon: Star, target: 200, suffix: '+', label: 'Clientes satisfeitos' },
	{ icon: Headphones, target: 24, suffix: '/7', label: 'Suporte disponível', isText: true },
]

export default function StatsSection() {
	return (
		<section className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
			<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
				<div className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] bg-[#154c9a]/10 rounded-full blur-[120px]" />
				<div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-[#154c9a]/5 rounded-full blur-[100px]" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
				<div className="text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-gray-300 text-xs font-semibold font-body tracking-wide">
						Caxiauto
					</div>
					<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4">
						Números que falam por si
					</h2>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12">
					{stats.map((stat) => {
						const Icon = stat.icon
						return (
							<div
								key={stat.label}
								className="relative group"
							>
								<div className="relative h-full p-6 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur border border-white/[0.06] transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/[0.1] group-hover:-translate-y-1">
									<div className="absolute top-0 right-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
										<Icon size={120} />
									</div>

									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#154c9a]/20 to-[#154c9a]/5 flex items-center justify-center mb-4 ring-1 ring-white/[0.06]">
										<Icon className="text-[#154c9a]" size={24} />
									</div>

									<div className="font-['JetBrains_Mono',monospace] text-4xl sm:text-5xl font-bold text-[#154c9a] drop-shadow-[0_0_10px_rgba(21,76,154,0.4)]">
										{stat.isText ? (
											<span>{stat.target}{stat.suffix}</span>
										) : (
											<AnimatedCounter target={stat.target} suffix={stat.suffix} />
										)}
									</div>

									<div className="w-8 h-px bg-gradient-to-r from-[#154c9a]/40 to-transparent mt-3" />

									<div className="font-body text-sm text-gray-400 mt-2">
										{stat.label}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
