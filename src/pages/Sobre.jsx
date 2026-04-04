import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Shield, Users, Target, Car, Wrench, Clock, MapPin, ChevronRight, ArrowRight, CheckCircle2, TrendingUp, Star } from 'lucide-react'

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
	{ value: '100+', label: 'Viaturas disponíveis', icon: Car },
	{ value: '50+', label: 'Parceiros verificados', icon: Shield },
	{ value: '200+', label: 'Clientes satisfeitos', icon: Star },
	{ value: '24/7', label: 'Suporte disponível', icon: Clock },
]

export default function Sobre() {
	useDocumentTitle('Sobre - Caxiauto')

	return (
		<main className="bg-white">
			{/* Hero Section */}
			<div className="relative bg-[#154c9a] py-28 sm:py-40 isolate overflow-hidden">
				<img
					src="/images/parts.jpg"
					alt="Background"
					className="absolute inset-0 -z-10 h-full w-full object-cover opacity-15 mix-blend-overlay"
				/>
				<div
					className="absolute inset-0 -z-10 bg-gradient-to-br from-[#154c9a] via-[#0f3d7a] to-[#154c9a] opacity-90"
				></div>

				{/* Elementos decorativos */}
				<div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
				<div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
				<div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>

				<div className="mx-auto max-w-7xl px-6 text-center lg:px-8 relative z-10">
					{/* Badge decorativo */}
					<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 mb-8 backdrop-blur-sm shadow-lg">
						<Car className="w-5 h-5" />
						<span className="font-semibold text-sm tracking-wide uppercase">Desde Angola para o mundo</span>
					</div>

					<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8 leading-tight">
						Somos uma Plataforma online angolana para venda e serviços automóveis, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">num só lugar.</span>
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-100 max-w-3xl mx-auto opacity-90">
						Com a Caxiauto, comprar, vender ou alugar é seguro e rápido.
						Reunimos inspeção, administração, transporte e peças numa única plataforma.
					</p>

					{/* Scroll indicator */}
					<div className="mt-12 animate-bounce">
						<div className="w-6 h-10 mx-auto border-2 border-white/30 rounded-full flex items-start justify-center p-1">
							<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section - Floating card */}
			<div className="relative -mt-20 z-20 mx-auto max-w-7xl px-6 lg:px-8 mb-24">
				<div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5">
					{stats.map((stat, index) => (
						<div key={index} className="group text-center relative">
							<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative">
								<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl mb-3 text-[#d41120] group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
									<stat.icon className="w-6 h-6" />
								</div>
								<div className="text-3xl sm:text-4xl font-extrabold text-[#d41120] group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
								<div className="mt-2 text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* About Content */}
			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<div className="order-2 lg:order-1">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-[#d41120] mb-6">
							<Star className="w-4 h-4" />
							<span className="text-sm font-semibold">Quem Somos</span>
						</div>

						<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8 leading-tight">
							Somos uma Plataforma online angolana para venda e serviços automóveis, <span className="text-[#154c9a]">num só lugar.</span>
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

							{/* Checkmarks visuais */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
								{['Segurança e Transparência', 'Plataforma Centralizada', 'Suporte Dedicado', 'Cobertura Nacional'].map((item) => (
									<div key={item} className="flex items-center gap-3 text-gray-700">
										<CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
										<span className="text-sm font-medium">{item}</span>
									</div>
								))}
							</div>

							<div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-2xl border-l-4 border-[#d41120] shadow-sm mt-8">
								<p className="font-medium text-gray-900 italic text-base">
									"Somos o ponto de encontro de confiança para quem procura soluções automóveis em Angola."
								</p>
							</div>
						</div>
					</div>
					<div className="order-1 lg:order-2 relative group">
						{/* Background decorativo */}
						<div className="absolute -inset-6 bg-gradient-to-br from-blue-100/50 via-red-50/30 to-transparent rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-700"></div>

						{/* Imagem principal */}
						<div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] ring-1 ring-gray-900/5">
							<img src="/images/i10.jpg" alt="Quem somos" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"/>
							{/* Overlay gradiente */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
						</div>

						{/* Badge flutuante */}
						<div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 ring-1 ring-gray-900/5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-[#154c9a] to-blue-700 rounded-xl flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-white" />
								</div>
								<div>
									<div className="text-sm font-bold text-gray-900">+200</div>
									<div className="text-xs text-gray-500">Clientes este mês</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28 relative overflow-hidden">
				{/* Pattern decorativo */}
				<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23154c9a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#154c9a] mb-4">
							<Target className="w-4 h-4" />
							<span className="text-sm font-semibold">O Nosso Propósito</span>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-8 lg:gap-10">
						<div className="group bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(21,76,154,0.15)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-full -m-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<div className="relative">
								<div className="w-16 h-16 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
									<Target size={28} strokeWidth={1.5} />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-4">A Nossa Visão</h3>
								<p className="text-gray-600 leading-relaxed text-lg">
									Ser a principal plataforma automóvel de Angola, impulsionando o mercado com inovação,
									confiança e soluções digitais que aproximam pessoas e negócios, definindo o futuro da mobilidade no país.
								</p>
							</div>
						</div>
						<div className="group bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(213,17,32,0.15)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-50 to-transparent rounded-full -m-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<div className="relative">
								<div className="w-16 h-16 bg-gradient-to-br from-[#d41120] to-red-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
									<Shield size={28} strokeWidth={1.5} />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-4">A Nossa Missão</h3>
								<p className="text-gray-600 leading-relaxed text-lg">
									Simplificar o acesso a produtos e serviços automóveis, promovendo mobilidade,
									oportunidades e crescimento económico através de uma plataforma acessível, segura e transparente.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-[#d41120] mb-4">
						<Star className="w-4 h-4" />
						<span className="text-sm font-semibold">Vantagens Exclusivas</span>
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Por que escolher a Caxiauto?</h2>
					<p className="mt-4 text-lg text-gray-600">Oferecemos um ecossistema completo pensado para facilitar a sua vida automobilística.</p>
				</div>

				<dl className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
					{features.map((feature) => (
						<div key={feature.name} className="group relative bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(21,76,154,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -m-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<div className="relative">
								<div className="w-14 h-14 bg-gradient-to-br from-[#d41120] to-red-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-500">
									<feature.icon className="h-7 w-7" aria-hidden="true" />
								</div>
								<dt className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#154c9a] transition-colors">
									{feature.name}
								</dt>
								<dd className="text-base text-gray-600 leading-relaxed">{feature.description}</dd>
							</div>
						</div>
					))}
				</dl>
			</section>

			{/* CTA Section */}
			<section className="relative bg-gradient-to-br from-[#154c9a] via-[#0f3d7a] to-[#154c9a] py-20 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400 rounded-full blur-3xl"></div>
				</div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
					<div className="text-center">
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pronto para encontrar o veículo ideal?</h2>
						<p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">Explore a nossa plataforma e descubra tudo o que a Caxiauto tem para si.</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a href="/servicos/compra-de-viaturas" className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
								<Car className="w-5 h-5" />
								Explorar Veículos
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
							<a href="/servicos/pecas-e-acessorios" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm group">
								<Wrench className="w-5 h-5" />
								Ver Peças e Acessórios
								<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
