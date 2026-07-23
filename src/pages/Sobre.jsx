import React, { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Shield, Users, Target, Car, Wrench, Clock, MapPin, ArrowRight, CheckCircle2, TrendingUp, Star } from 'lucide-react'

const features = [
	{
		name: 'Plataforma Completa',
		description: 'Centralizamos venda, compra, aluguer, reboque e peças num único local digital.',
		icon: Car,
	},
	{
		name: 'Segurança Garantida',
		description: 'Validamos parceiros e viaturas para garantir que faz negócios com tranquilidade.',
		icon: Shield,
	},
	{
		name: 'Suporte Especializado',
		description: 'Estamos consigo em cada etapa, com uma equipa pronta para esclarecer todas as dúvidas.',
		icon: Users,
	},
	{
		name: 'Serviços Técnicos',
		description: 'Acesso a manutenções e inspeções detalhadas através da nossa rede de parceiros.',
		icon: Wrench,
	},
	{
		name: 'Rapidez e Eficiência',
		description: 'Menos burocracia, mais resultados. Otimizamos processos para poupar o seu tempo.',
		icon: Clock,
	},
	{
		name: 'Cobertura Nacional',
		description: 'Chegamos onde estiver. Conectamos soluções automóveis em toda Angola.',
		icon: MapPin,
	},
]

const stats = [
	{ value: 100, suffix: '+', label: 'Viaturas disponíveis' },
	{ value: 50, suffix: '+', label: 'Parceiros verificados' },
	{ value: 200, suffix: '+', label: 'Clientes satisfeitos' },
	{ isText: true, text: '24/7', label: 'Suporte disponível' },
]

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

export default function Sobre() {
	useDocumentTitle('Sobre - Caxiauto')

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [aboutRef, aboutVisible] = useScrollReveal()
	const [visionRef, visionVisible] = useScrollReveal()
	const [missionRef, missionVisible] = useScrollReveal()
	const [featuresRef, featuresVisible] = useScrollReveal()

	return (
		<main>
			{/* Hero — tipografia como âncora visual */}
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#d41120] opacity-[0.06]" />
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full border border-[#d41120] opacity-[0.04]" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Venda e serviços{' '}
							<span className="text-[#d41120]">num só lugar.</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							Com a Caxiauto, comprar, vender ou alugar é seguro e rápido.
							Reunimos inspeção, administração, transporte e peças numa única plataforma.
						</p>
					</div>
				</div>
			</section>

			{/* Stats — contadores com animação no scroll */}
			<section className="bg-white border-t border-[#e5e7eb]">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="font-['JetBrains_Mono',monospace] text-4xl sm:text-5xl font-bold text-[#154c9a] mb-2 tracking-tight">
									{stat.isText ? (
										<span>{stat.text}</span>
									) : (
										<AnimatedCounter target={stat.value} suffix={stat.suffix} />
									)}
								</div>
								<div className="font-body text-sm text-[#6b7280] font-medium">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Quem Somos — conteúdo com imagem */}
			<section ref={aboutRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div
							className={`order-2 lg:order-1 transition-all duration-700 ease-out ${
								aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
						>
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-6">
								<Star className="w-4 h-4" />
								<span className="text-sm font-semibold font-body">Quem Somos</span>
							</div>

							<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-8 leading-tight">
								Somos uma Plataforma online angolana para venda e serviços automóveis,{' '}
								<span className="text-[#154c9a]">num só lugar.</span>
							</h2>

							<div className="font-body space-y-6 text-[#6b7280] text-lg leading-relaxed">
								<p>
									A Caxiauto é uma plataforma digital centralizada no mundo automobilístico. Criada para facilitar o acesso
									a soluções de mobilidade, reunimos num só lugar a venda de viaturas novas e usadas, peças e acessórios,
									serviços de reboque e aluguer de viaturas, soluções mecânicas, estética automóvel e muito mais.
								</p>
								<p>
									Tudo o que fazemos é pautado pela segurança, transparência e rapidez. Queremos que sinta confiança em cada clique e em cada negócio fechado.
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
									{['Segurança e Transparência', 'Plataforma Centralizada', 'Suporte Dedicado', 'Cobertura Nacional'].map((item) => (
										<div key={item} className="flex items-center gap-3 text-[#111827]">
											<CheckCircle2 className="w-5 h-5 text-[#154c9a] flex-shrink-0" />
											<span className="font-body text-sm font-medium">{item}</span>
										</div>
									))}
								</div>

								<div className="border-l-4 border-[#d41120] pl-6 py-4 mt-8 bg-white/60 rounded-r-2xl">
									<p className="font-body font-medium text-[#111827] italic text-lg">
										&quot;Somos o ponto de encontro de confiança para quem procura soluções automóveis em Angola.&quot;
									</p>
								</div>
							</div>
						</div>

						<div
							className={`order-1 lg:order-2 relative transition-all duration-700 ease-out ${
								aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
							}`}
							style={{ transitionDelay: aboutVisible ? '200ms' : '0ms' }}
						>
							<div
								className={`aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5 ${
									aboutVisible ? 'clip-reveal' : ''
								}`}
							>
								<img
									src="/images/i10.jpg"
									alt="Equipa Caxiauto — plataforma automóvel angolana"
									className="w-full h-full object-cover"
								/>
							</div>

							<div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 ring-1 ring-gray-900/5">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-[#154c9a] rounded-xl flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-white" />
									</div>
									<div>
										<div className="font-['JetBrains_Mono',monospace] text-sm font-bold text-[#111827]">+200</div>
										<div className="font-body text-xs text-[#6b7280]">Clientes este mês</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Missão e Visão — divididas por uma linha central */}
			<section className="bg-white py-20 sm:py-28 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Target className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">O Nosso Propósito</span>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-0 relative">
						<div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#e5e7eb] -translate-x-1/2" />

						<div
							ref={visionRef}
							className={`relative px-8 sm:px-12 py-12 transition-all duration-700 ease-out ${
								visionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
							}`}
						>
							<div className="w-14 h-14 bg-[#154c9a] rounded-2xl flex items-center justify-center mb-6 text-white">
								<Target size={24} strokeWidth={1.5} />
							</div>
							<h3 className="font-display text-2xl sm:text-3xl font-bold text-[#111827] mb-4">A Nossa Visão</h3>
							<p className="font-body text-[#6b7280] leading-relaxed text-lg">
								Ser a principal plataforma automóvel de Angola, impulsionando o mercado com inovação,
								confiança e soluções digitais que aproximam pessoas e negócios, definindo o futuro da mobilidade no país.
							</p>
						</div>

						<div
							ref={missionRef}
							className={`relative px-8 sm:px-12 py-12 transition-all duration-700 ease-out ${
								missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
							}`}
						>
							<div className="w-14 h-14 bg-[#d41120] rounded-2xl flex items-center justify-center mb-6 text-white">
								<Shield size={24} strokeWidth={1.5} />
							</div>
							<h3 className="font-display text-2xl sm:text-3xl font-bold text-[#111827] mb-4">A Nossa Missão</h3>
							<p className="font-body text-[#6b7280] leading-relaxed text-lg">
								Simplificar o acesso a produtos e serviços automóveis, promovendo mobilidade,
								oportunidades e crescimento económico através de uma plataforma acessível, segura e transparente.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Vantagens — grelha de features */}
			<section ref={featuresRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<Star className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Vantagens Exclusivas</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Por que escolher a Caxiauto?
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Oferecemos um ecossistema completo pensado para facilitar a sua vida automobilística.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
						{features.map((feature, index) => (
							<div
								key={feature.name}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									featuresVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: featuresVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="w-12 h-12 bg-[#d41120] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<feature.icon className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{feature.name}
								</h3>
								<p className="font-body text-[#6b7280] leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="bg-[#154c9a] py-20 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
							Pronto para encontrar o veículo ideal?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Explore a nossa plataforma e descubra tudo o que a Caxiauto tem para si.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/servicos/compra-de-viaturas"
								className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
							>
								<Car className="w-5 h-5" />
								Explorar Veículos
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
							<a
								href="/servicos/pecas-e-acessorios"
								className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 font-body group"
							>
								<Wrench className="w-5 h-5" />
								Ver Peças e Acessórios
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
