import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Shield, Users, Target, Car, Wrench, Clock, MapPin } from 'lucide-react'

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

export default function Sobre() {
	useDocumentTitle('Sobre - Caxiauto')

	return (
		<main className="bg-white">
			{/* Hero Section */}
			<div className="relative bg-[#154c9a] py-24 sm:py-32 isolate overflow-hidden">
				<img
					src="/images/parts.jpg"
					alt="Background"
					className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20 mix-blend-overlay"
				/>
				<div
					className="absolute inset-0 -z-10 bg-gradient-to-t from-[#154c9a] via-transparent to-transparent opacity-80"
				></div>

				<div className="mx-auto max-w-7xl px-6 text-center lg:px-8 relative z-10">
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
						Somos uma Plataforma online angolana para venda e serviços automóveis, num só lugar.
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-100 max-w-3xl mx-auto opacity-90">
						Com a Caxiauto, comprar, vender ou alugar é seguro e rápido.
						Reunimos inspeção, administração, transporte e peças numa única plataforma.
					</p>
				</div>
			</div>

			{/* Stats Section - Floating card */}
			<div className="relative -mt-16 z-20 mx-auto max-w-7xl px-6 lg:px-8 mb-20">
				<div className="mx-auto grid max-w-lg grid-cols-2 gap-y-8 gap-x-4 bg-white rounded-2xl p-8 shadow-xl sm:max-w-none sm:grid-cols-4 ring-1 ring-gray-900/5">
					<div className="text-center sm:border-r border-gray-100 last:border-0 border-b sm:border-b-0 pb-4 sm:pb-0">
						<div className="text-4xl font-bold text-[#d41120]">100+</div>
						<div className="mt-1 text-sm text-gray-500 font-medium">Viaturas disponíveis</div>
					</div>
					<div className="text-center sm:border-r border-gray-100 last:border-0 border-b sm:border-b-0 pb-4 sm:pb-0">
						<div className="text-4xl font-bold text-[#d41120]">50+</div>
						<div className="mt-1 text-sm text-gray-500 font-medium">Parceiros verificados</div>
					</div>
					<div className="text-center sm:border-r border-gray-100 last:border-0 pt-4 sm:pt-0">
						<div className="text-4xl font-bold text-[#d41120]">200+</div>
						<div className="mt-1 text-sm text-gray-500 font-medium">Clientes satisfeitos</div>
					</div>
					<div className="text-center pt-4 sm:pt-0">
						<div className="text-4xl font-bold text-[#d41120]">24/7</div>
						<div className="mt-1 text-sm text-gray-500 font-medium">Suporte disponível</div>
					</div>
				</div>
			</div>

			{/* About Content */}
			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-2">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
							Somos uma Plataforma online angolana para venda e serviços automóveis, num só lugar.
						</h2>
						<div className="space-y-6 text-lg text-gray-600 leading-relaxed">
							<p>
								A Caxiauto é uma plataforma digital centralizada no mundo automobilístico. Criada para facilitar o acesso
								a soluções de mobilidade, reunimos num só lugar a venda de viaturas novas e usadas, peças e acessórios,
								serviços de reboque e aluguer de viaturas, soluções mecânicas, estética automóvel e muito mais.
							</p>
							<p>
								Tudo o que fazemos é pautado pela segurança, transparência e rapidez. Queremos que sinta confiança em cada clique e em cada negócio fechado.
							</p>
							<div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#d41120]">
								<p className="font-medium text-gray-900 italic">
									"Somos o ponto de encontro de confiança para quem procura soluções automóveis em Angola."
								</p>
							</div>
						</div>
					</div>
					<div className="relative group">
						<div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-red-50 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
						<div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
							<img src="/images/i10.jpg" alt="Quem somos" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"/>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="bg-gray-50 py-6 sm:py-12 my-6">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid md:grid-cols-2 gap-8 lg:gap-12">
						<div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-[#154c9a]">
								<Target size={32} strokeWidth={1.5} />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">A Nossa Visão</h3>
							<p className="text-gray-600 leading-relaxed text-lg">
								Ser a principal plataforma automóvel de Angola, impulsionando o mercado com inovação,
								confiança e soluções digitais que aproximam pessoas e negócios, definindo o futuro da mobilidade no país.
							</p>
						</div>
						<div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 text-[#d41120]">
								<Shield size={32} strokeWidth={1.5} />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">A Nossa Missão</h3>
							<p className="text-gray-600 leading-relaxed text-lg">
								Simplificar o acesso a produtos e serviços automóveis, promovendo mobilidade,
								oportunidades e crescimento económico através de uma plataforma acessível, segura e transparente.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Por que escolher a Caxiauto?</h2>
					<p className="mt-4 text-lg text-gray-600">Oferecemos um ecossistema completo pensado para facilitar a sua vida automobilística.</p>
				</div>

				<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
					{features.map((feature) => (
						<div key={feature.name} className="relative pl-16 group">
							<dt className="text-lg font-semibold leading-7 text-gray-900">
								<div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d41120] group-hover:bg-[#154c9a] transition-colors duration-300">
									<feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
								</div>
								{feature.name}
							</dt>
							<dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
						</div>
					))}
				</dl>
			</section>
		</main>
	)
}
