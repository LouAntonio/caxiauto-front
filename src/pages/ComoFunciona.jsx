import React, { useState, useEffect, useRef } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Search, Scale, MessageCircle, ShieldCheck, ShoppingCart, Store, Wrench, Truck, Car, Users, ArrowRight, Key, GitCompare, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
	{
		number: '01',
		title: 'Pesquise o que precisa',
		description: 'Utilize nossa plataforma para encontrar viaturas, peças, serviços de reboque ou opções de aluguer de viaturas.',
		icon: Search,
	},
	{
		number: '02',
		title: 'Compare opções e fornecedores',
		description: 'Veja diferentes alternativas, compare preços, características e escolha a melhor opção para suas necessidades.',
		icon: Scale,
	},
	{
		number: '03',
		title: 'Entre em contacto',
		description: 'Contacte direto com o anunciante ou prestador de serviço para tirar dúvidas e negociar os detalhes.',
		icon: MessageCircle,
	},
	{
		number: '04',
		title: 'Feche negócio com segurança',
		description: 'Conclua a transação com mais segurança e praticidade através da nossa plataforma que verifica parceiros e anunciantes.',
		icon: ShieldCheck,
	}
]

const audience = [
	{ icon: ShoppingCart, title: 'Compradores de carros novos e usados' },
	{ icon: Store, title: 'Vendedores particulares e stands automóveis' },
	{ icon: Wrench, title: 'Oficinas e lojas de peças' },
	{ icon: Truck, title: 'Empresas de reboque' },
	{ icon: Car, title: 'Empresas que precisam de aluguer de viaturas' },
	{ icon: Users, title: 'Particulares que precisam de aluguer de viaturas' }
]

const aluguelSteps = [
	{
		number: '01',
		title: 'Pesquise pela Viatura',
		description: 'Escolha a viatura ou pesquise por um modelo à sua escolha.',
		icon: Search,
	},
	{
		number: '02',
		title: 'Compare Ofertas',
		description: 'Analise preços, características e condições de diferentes veículos para encontrar a melhor opção.',
		icon: GitCompare,
	},
	{
		number: '03',
		title: 'Reserve com Segurança',
		description: 'Entre em contacto direto e finalize a sua reserva de forma rápida e segura.',
		icon: Key,
	},
	{
		number: '04',
		title: 'Levante e Conduza',
		description: 'Receba a viatura no local combinado e desfrute da sua viagem com total tranquilidade.',
		icon: CheckCircle2,
	}
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

export default function ComoFunciona() {
	useDocumentTitle('Como Funciona - Caxiauto')

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [stepsRef, stepsVisible] = useScrollReveal()
	const [audienceRef, audienceVisible] = useScrollReveal()
	const [aluguelRef, aluguelVisible] = useScrollReveal()

	return (
		<main>
			{/* Hero */}
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#d41120] opacity-[0.06]" />
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full border border-[#d41120] opacity-[0.04]" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-10">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">4 Passos Simples</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Como Funciona a{' '}
							<span className="text-[#d41120]">Caxiauto</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							A sua jornada para soluções de mobilidade simplificada em apenas 4 passos claros e eficientes.
						</p>
					</div>
				</div>
			</section>

			{/* Steps */}
			<section ref={stepsRef} className="bg-white border-t border-[#e5e7eb] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Passo a Passo</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							É simples e rápido
						</h2>
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

			{/* Audience */}
			<section ref={audienceRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<Users className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Público Alvo</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Para quem é a Caxiauto?
						</h2>
						<p className="font-body text-lg text-[#6b7280]">
							Conectamos todos os pontos do sector automóvel numa única plataforma integrada.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
						{audience.map((item, index) => (
							<div
								key={item.title}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									audienceVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: audienceVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="w-12 h-12 bg-[#d41120] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<item.icon className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{item.title}
								</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Aluguel Steps */}
			<section ref={aluguelRef} className="bg-white border-t border-[#e5e7eb] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Car className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Aluguel de Automóveis</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Alugar nunca foi tão fácil
						</h2>
						<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto">
							Encontre o carro perfeito para a sua viagem, negócios ou eventos em apenas 4 passos.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4">
						{aluguelSteps.map((step, index) => (
							<div
								key={step.number}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									aluguelVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: aluguelVisible ? `${index * 100}ms` : '0ms' }}
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

					<div className="text-center mt-16">
						<Link
							to="/servicos/aluguel-de-automoveis"
							className="inline-flex items-center justify-center gap-2 bg-[#154c9a] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#0c2d5e] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
						>
							Ver Veículos Disponíveis
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>

			{/* CTA Final */}
			<section className="bg-[#154c9a] py-20 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
							Pronto para explorar a Caxiauto?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Descubra todos os serviços que temos para si e encontre a solução ideal.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/servicos/compra-de-viaturas"
								className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
							>
								<Car className="w-5 h-5" />
								Explorar Veículos
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								to="/servicos/pecas-e-acessorios"
								className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 font-body group"
							>
								<Wrench className="w-5 h-5" />
								Ver Peças e Acessórios
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
