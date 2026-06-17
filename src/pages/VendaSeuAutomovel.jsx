import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
	FileText,
	CheckCircle2,
	TrendingUp,
	Users,
	Shield,
	Clock,
	Zap,
	Star,
	Car,
	ArrowRight,
	Sparkles
} from 'lucide-react'

const steps = [
	{
		number: '01',
		title: 'Registe a sua viatura online',
		description: 'Preencha o formulário com todas as informações da viatura e documentos necessários.',
		icon: FileText,
	},
	{
		number: '02',
		title: 'A Caxiauto valida os dados',
		description: 'Nossa equipa verifica todas as informações e aprova o anúncio rapidamente.',
		icon: CheckCircle2,
	},
	{
		number: '03',
		title: 'Divulgamos e gerimos interessados',
		description: 'Promovemos a sua viatura na plataforma, redes sociais e gerimos todos os contactos.',
		icon: TrendingUp,
	},
	{
		number: '04',
		title: 'Ajudamos na negociação',
		description: 'Acompanhamos todo o processo até ao fecho da venda com segurança.',
		icon: Users,
	}
]

const benefits = [
	{ icon: TrendingUp, title: 'Mais visibilidade', description: 'Sua viatura divulgada em múltiplos canais.' },
	{ icon: Users, title: 'Compradores qualificados', description: 'Atraímos compradores realmente interessados.' },
	{ icon: Shield, title: 'Apoio profissional', description: 'Equipa especializada em vendas.' },
	{ icon: CheckCircle2, title: 'Mais segurança', description: 'Processo transparente e seguro.' },
	{ icon: Zap, title: 'Venda mais rápida', description: 'Encontre compradores em menos tempo.' },
]

const planos = [
	{
		name: 'Mensal',
		features: [
			'Até 5 veículos anunciados',
			'Até 20 peças e acessórios',
			'Suporte padrão',
		],
		popular: false,
	},
	{
		name: 'Trimestral',
		features: [
			'Até 15 veículos anunciados',
			'Até 50 peças e acessórios',
			'Créditos de destaque mensais',
			'Suporte prioritário',
		],
		popular: true,
	},
	{
		name: 'Anual',
		features: [
			'Veículos ilimitados',
			'Peças e acessórios ilimitados',
			'Destaques premium',
			'Suporte VIP',
		],
		popular: false,
	},
]

function useScrollReveal(threshold = 0.15) {
	const ref = useRef(null)
	const [isVisible, setIsVisible] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (isVisible) return
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.unobserve(el)
				}
			},
			{ threshold }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [threshold, isVisible])

	return [ref, isVisible]
}

export default function VendaSeuAutomovel() {
	useDocumentTitle('Venda a Sua Viatura - Caxiauto')

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [stepsRef, stepsVisible] = useScrollReveal()
	const [benefitsRef, benefitsVisible] = useScrollReveal()

	return (
		<main>
			{/* Hero */}
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#d41120] opacity-[0.06]" />
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full border border-[#d41120] opacity-[0.04]" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-10">
							<Car className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Intermediação de Vendas</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-6 [text-wrap:balance]">
							Venda {' '} <span className="text-[#d41120]">connosco</span>
						</h1>

						<div className="flex justify-center mb-8">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-xl text-[#154c9a] font-semibold mb-6">
							Rápido <span className="text-[#d41120]">•</span> Seguro <span className="text-[#d41120]">•</span> Sem complicações
						</p>

						<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto mb-10 leading-relaxed">
							Tratamos de todo o processo por si — desde o marketing até à venda final. Oferecemos um serviço completo de intermediação onde encontramos o comprador ideal para a sua viatura.
						</p>

						<Link
							to="/auth"
							className="inline-flex items-center justify-center gap-2 bg-[#154c9a] hover:bg-[#0c2d5e] text-white px-10 py-5 rounded-2xl font-semibold font-body transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
						>
							Registar Agora
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>

			{/* Steps */}
			<section ref={stepsRef} className="bg-white border-t border-[#e5e7eb] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Processo Simples</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Como Funciona
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280] max-w-2xl mx-auto">
							Apenas 4 passos para vender a sua viatura com segurança
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4">
						{steps.map((step, index) => (
							<div
								key={step.number}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									stepsVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: stepsVisible ? `${index * 100}ms` : '0ms' }}
							>
								<div className="font-display text-sm font-bold text-[#d41120] mb-4 tracking-wider">{step.number}</div>
								<div className="w-12 h-12 bg-[#154c9a] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<step.icon className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{step.title}
								</h3>
								<p className="font-body text-[#6b7280] leading-relaxed">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Planos de Subscrição */}
			<section className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Planos</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Planos de Assinatura
						</h2>
						<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto">
							Escolha o plano ideal para o seu negócio e comece a vender hoje mesmo.
						</p>
					</div>

					<div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 mx-auto items-start">
						{planos.map((plano) => (
							<div
								key={plano.name}
								className={`relative bg-white p-8 rounded-2xl border transition-all duration-300 ${
									plano.popular
										? 'border-[#154c9a] ring-2 ring-[#154c9a]/20 scale-[1.02] lg:scale-105 z-10'
										: 'border-[#e5e7eb] hover:border-[#154c9a]/20'
								}`}
							>
								{plano.popular && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d41120] text-white text-xs font-semibold px-4 py-1 rounded-full font-body whitespace-nowrap">
										Mais Popular
									</div>
								)}
								<h3 className={`font-display text-xl font-bold text-[#111827] mb-6 ${plano.popular ? 'mt-2' : ''}`}>
									{plano.name}
								</h3>
								<ul className="space-y-3 mb-8">
									{plano.features.map((f) => (
										<li key={f} className="flex items-start gap-2 font-body text-sm text-[#6b7280]">
											<CheckCircle2 className="w-4 h-4 text-[#154c9a] mt-0.5 flex-shrink-0" />
											{f}
										</li>
									))}
								</ul>
								<Link
									to="/auth"
									className={`block text-center py-3 px-6 rounded-2xl font-semibold font-body transition-all duration-300 ${
										plano.popular
											? 'bg-[#154c9a] hover:bg-[#0c2d5e] text-white'
											: 'bg-[#eef3fa] text-[#154c9a] hover:bg-[#dce5f5]'
									}`}
								>
									Começar Agora
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section ref={benefitsRef} className="bg-white py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<Star className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Vantagens</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Porque Vender com a Caxiauto?
						</h2>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
						{benefits.map((benefit, index) => (
							<div
								key={benefit.title}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									benefitsVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: benefitsVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="w-12 h-12 bg-[#d41120] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<benefit.icon className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{benefit.title}
								</h3>
								<p className="font-body text-[#6b7280] leading-relaxed">{benefit.description}</p>
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
							Pronto para vender a sua viatura?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Registe-se agora e encontre o comprador ideal para a sua viatura com total segurança.
						</p>
						<Link
							to="/auth"
							className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-10 py-5 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group text-lg"
						>
							<Car className="w-5 h-5" />
							Registar Agora
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
