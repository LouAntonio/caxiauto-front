import React, { useState, useEffect } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Navigation,
	Shield,
	Headphones,
	Map,
	Bell,
	Lock,
	Clock,
	Users,
	ShieldCheck,
	MapPin,
	Smartphone,
	Radio,
	CheckCircle2,
	ArrowRight,
	Sparkles,
	Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
	{
		number: '01',
		title: 'Escolha a Solução',
		description: 'Selecione o sistema GPS ideal para o seu veículo com base nas suas necessidades de rastreamento e segurança.',
		icon: Navigation,
	},
	{
		number: '02',
		title: 'Instalação Profissional',
		description: 'Nossa equipa técnica realiza a instalação do equipamento de forma rápida, segura e com garantia de qualidade.',
		icon: Users,
	},
	{
		number: '03',
		title: 'Ativação e Configuração',
		description: 'Ativamos o sistema e configuramos alertas personalizados para manter você sempre informado sobre o seu veículo.',
		icon: Smartphone,
	},
	{
		number: '04',
		title: 'Monitoramento Contínuo',
		description: 'Acompanhe em tempo real através da aplicação móvel e conte com suporte técnico sempre que precisar.',
		icon: Radio,
	}
];

const services = [
	{
		icon: Shield,
		title: 'Proteção & Controlo Inteligente',
		description: 'Receba alertas em tempo real, acompanhe os seus veículos e bloqueie-os imediatamente sempre que notar qualquer irregularidade. Mais segurança, mais controlo, mais tranquilidade.'
	},
	{
		icon: Headphones,
		title: 'Suporte Técnico Especializado',
		description: 'Conte com uma equipa qualificada e preparada para te apoiar sempre que precisares. Oferecemos o melhor serviço de suporte pós-venda, com atendimento rápido, eficiente e profissional.'
	},
	{
		icon: MapPin,
		title: 'Localização em Tempo Real',
		description: 'Acompanhe o seu veículo no mapa, em tempo real, onde quer que esteja. Na Caxiauto, o seu veículo está sempre protegido e sob controlo.'
	}
];

const benefits = [
	{ icon: Bell, title: 'Alertas Instantâneos', description: 'Notificações em tempo real sobre o seu veículo.' },
	{ icon: Lock, title: 'Bloqueio Remoto', description: 'Bloqueie o veículo à distância em caso de emergência.' },
	{ icon: Clock, title: 'Histórico Completo', description: 'Acesso ao histórico de rotas e localizações.' },
	{ icon: Map, title: 'Cobertura Nacional', description: 'Rastreamento eficaz em todo o território.' },
	{ icon: ShieldCheck, title: 'Tecnologia Avançada', description: 'Sistemas modernos e confiáveis.' },
];

export default function GPS() {
	useDocumentTitle('Serviços GPS - Caxiauto')

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
							<Navigation className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Rastreamento Veicular</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Serviços{' '}
							<span className="text-[#d41120]">GPS</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							Proteção e controlo inteligente para o seu veículo. Receba alertas em tempo real e tenha total segurança e tranquilidade.
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
							<span className="text-sm font-semibold font-body">Como Funciona</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Proteja o seu veículo em 4 passos
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

			{/* Services */}
			<section ref={servicesRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Nossos Serviços</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Soluções Completas de Rastreamento
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Tecnologia avançada para manter o seu veículo sempre protegido e monitorizado.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
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
								<div className="w-12 h-12 bg-[#154c9a] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<service.icon className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{service.title}
								</h3>
								<p className="font-body text-[#6b7280] leading-relaxed">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* About */}
			<section className="bg-white py-20 sm:py-28">
				<div className="mx-auto max-w-5xl px-6 lg:px-8">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Star className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Sobre a Caxiauto</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Transformando a forma como você controla e protege os seus veículos
						</h2>
					</div>

					<div className="bg-white rounded-2xl border border-[#e5e7eb] p-8 md:p-12">
						<p className="font-body text-lg text-[#6b7280] leading-relaxed mb-6">
							Na Caxiauto, reunimos as melhores empresas e soluções avançadas de rastreamento veicular, garantindo segurança, controlo e monitoramento em tempo real.
						</p>
						<p className="font-body text-lg text-[#6b7280] leading-relaxed mb-6">
							A nossa missão é proporcionar tranquilidade a quem compra o seu carro connosco e a todos que se preocupam com a proteção do seu veículo, sabendo exatamente onde ele está a qualquer momento.
						</p>
						<p className="font-body text-lg text-[#6b7280] leading-relaxed">
							Com tecnologia moderna e atendimento de qualidade, a Caxiauto é o seu parceiro ideal em mobilidade e segurança automóvel.
						</p>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section ref={benefitsRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<Star className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Vantagens</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Por que escolher os Serviços GPS da Caxiauto?
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Oferecemos tecnologia de ponta aliada a um suporte técnico excepcional.
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
							Solicite o seu Orçamento
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
							Pronto para proteger o seu veículo?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Solicite um orçamento personalizado e descubra a solução GPS ideal para si.
						</p>
						<Link
							to="/contato"
							className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-10 py-5 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group text-lg"
						>
							<Navigation className="w-5 h-5" />
							Solicitar Orçamento
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
