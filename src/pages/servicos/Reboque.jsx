import React, { useState, useEffect } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Phone,
	MapPin,
	Clock,
	AlertTriangle,
	Wrench,
	Truck,
	Shield,
	Zap,
	ShieldCheck,
	Map,
	BadgeDollarSign,
	Headphones,
	CheckCircle2,
	ArrowRight,
	Sparkles,
	Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
	{
		number: '01',
		title: 'Faça o Pedido',
		description: 'Contacte a Caxiauto através da plataforma informando sua localização e tipo de problema.',
		icon: Phone,
	},
	{
		number: '02',
		title: 'Localização e Conexão',
		description: 'O nosso sistema localiza a empresa de reboque mais próxima de si para garantir uma resposta imediata.',
		icon: MapPin,
	},
	{
		number: '03',
		title: 'Assistência a Caminho',
		description: 'O parceiro de reboque desloca-se rapidamente até ao seu local para resolver a situação com profissionalismo.',
		icon: Truck,
	}
];

const services = [
	{
		icon: AlertTriangle,
		title: 'Reboque de Emergência',
		description: 'Serviço 24 horas para situações de avaria ou acidente na estrada.'
	},
	{
		icon: Wrench,
		title: 'Assistência Roadside',
		description: 'Pequenos reparos e assistência na estrada para problemas menores como pneus ou bateria.'
	},
	{
		icon: Truck,
		title: 'Transporte de Viaturas',
		description: 'Transporte seguro de veículos para oficinas, residências ou locais de destino.'
	},
	{
		icon: Shield,
		title: 'Cobertura Completa',
		description: 'Serviços adaptados para todos os tipos de viaturas (ligeiros, pesados, motos) com equipamento adequado.'
	}
];

const benefits = [
	{ icon: Zap, title: 'Resposta Rápida', description: 'Chegamos até si no menor tempo possível.' },
	{ icon: ShieldCheck, title: 'Parceiros Verificados', description: 'Trabalhamos apenas com empresas certificadas.' },
	{ icon: Map, title: 'Ampla Cobertura', description: 'Serviço disponível em diversas zonas.' },
	{ icon: BadgeDollarSign, title: 'Preço Justo', description: 'Valores transparentes sem surpresas.' },
	{ icon: Headphones, title: 'Suporte Dedicado', description: 'Acompanhamento do início ao fim.' },
];

export default function Reboque() {
	useDocumentTitle('Reboque - Caxiauto')

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [stepsRef, stepsVisible] = useScrollReveal()
	const [servicesRef, servicesVisible] = useScrollReveal()
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
							<Truck className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Assistência 24/7</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Serviço de{' '}
							<span className="text-[#d41120]">Reboque</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							Conectamos você rapidamente aos melhores serviços de reboque da sua zona. Eficiência e segurança quando mais precisa.
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
							<span className="text-sm font-semibold font-body">Processo Simples</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Como Solicitar Ajuda
						</h2>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
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

			{/* Services */}
			<section ref={servicesRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Nossos Serviços</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Assistência Completa
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Soluções versáteis para qualquer imprevisto na estrada.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-2">
						{services.map((service, index) => (
							<div
								key={index}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									servicesVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: servicesVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="flex items-start gap-6">
									<div className="w-12 h-12 bg-[#154c9a] rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
										<service.icon className="h-6 w-6" aria-hidden="true" />
									</div>
									<div className="flex-1">
										<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
											{service.title}
										</h3>
										<p className="font-body text-[#6b7280] leading-relaxed">{service.description}</p>
									</div>
								</div>
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
							Por que escolher o Reboque Caxiauto?
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Não somos apenas mais um serviço de reboque. Somos a sua garantia de tranquilidade quando algo inesperado acontece na estrada.
						</p>
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

					<div className="text-center mt-12">
						<Link
							to="/contato"
							className="inline-flex items-center justify-center gap-2 bg-[#154c9a] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#0c2d5e] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
						>
							Pedir Assistência Agora
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="bg-[#154c9a] py-20 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
							Precisa de ajuda na estrada?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Estamos prontos para ajudar. Solicite assistência agora e resolva o seu imprevisto com rapidez.
						</p>
						<Link
							to="/contato"
							className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-10 py-5 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group text-lg"
						>
							<Truck className="w-5 h-5" />
							Pedir Assistência
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
