import React from 'react';
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
	Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GPS() {
	useDocumentTitle('Serviços GPS - Caxiauto');

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Escolha a Solução',
			description: 'Selecione o sistema GPS ideal para o seu veículo com base nas suas necessidades de rastreamento e segurança.',
			icon: Navigation,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Instalação Profissional',
			description: 'Nossa equipa técnica realiza a instalação do equipamento de forma rápida, segura e com garantia de qualidade.',
			icon: Users,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Ativação e Configuração',
			description: 'Ativamos o sistema e configuramos alertas personalizados para manter você sempre informado sobre o seu veículo.',
			icon: Smartphone,
		},
		{
			number: '04',
			label: 'PASSO',
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

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="min-h-[calc(100vh-80px)] px-6 bg-[#154c9a] text-white relative overflow-hidden isolate flex items-center justify-center">
				<div
					className="absolute inset-0 -z-10 opacity-10"
					style={{
						backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
					}}
				></div>

				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 mb-6 backdrop-blur-sm">
						<Navigation className="w-5 h-5" />
						<span className="font-medium">Rastreamento Veicular</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
						Serviços GPS
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
						Proteção e controlo inteligente para o seu veículo. Receba alertas em tempo real e tenha total segurança e tranquilidade.
					</p>
				</div>
			</section>

			{/* Timeline Steps - Como Funciona */}
			<section className="py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-10">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Como Funciona</span>
						<h2 className="text-3xl font-bold text-gray-900">Proteja o seu veículo em 4 passos</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{steps.map((step, index) => (
							<div key={step.number} className="relative group">
								<div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-[0_8px_30px_rgb(21,76,154,0.12)] p-8 border-2 border-blue-100/50 hover:shadow-2xl hover:border-[#154c9a]/30 hover:from-white hover:to-blue-50 transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
									<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -m-10 opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>

									<div className="relative mb-6 flex flex-col items-center text-center">
										<div className="w-20 h-20 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-[0_4px_20px_rgba(21,76,154,0.25)] flex flex-col items-center justify-center border-[5px] border-[#154c9a] group-hover:border-[6px] group-hover:scale-110 group-hover:shadow-[0_6px_25px_rgba(21,76,154,0.35)] transition-all duration-300 mb-4">
											<span className="text-[10px] font-bold text-[#154c9a] uppercase tracking-widest">{step.label}</span>
											<span className="text-3xl font-black bg-gradient-to-br from-[#154c9a] to-blue-700 bg-clip-text text-transparent leading-none">{step.number}</span>
										</div>

										<div className="w-16 h-16 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(21,76,154,0.3)] text-white transform group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(21,76,154,0.4)] transition-all duration-300 mb-5">
											<step.icon size={30} strokeWidth={2.5} />
										</div>

										<h3 className="text-xl font-bold text-gray-800 group-hover:text-[#154c9a] transition-colors mb-1">{step.title}</h3>
									</div>

									<p className="text-base text-gray-600 leading-relaxed font-medium text-center mt-auto">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Services Grid */}
			<section className="py-24 px-6 bg-white relative">
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Nossos Serviços</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Soluções Completas de Rastreamento</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Tecnologia avançada para manter o seu veículo sempre protegido e monitorizado.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<div
								key={index}
								className="group bg-gray-50 hover:bg-white p-8 rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-[#154c9a] group-hover:scale-110 group-hover:bg-[#154c9a] group-hover:text-white transition-all duration-300 border border-gray-100">
										<service.icon size={32} />
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#154c9a] transition-colors">
										{service.title}
									</h3>
									<p className="text-lg text-gray-600 leading-relaxed">
										{service.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* About Section */}
			<section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-12">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Sobre a Caxiauto</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Transformando a forma como você controla e protege os seus veículos
						</h2>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
						<p className="text-lg text-gray-700 leading-relaxed mb-6">
							Na Caxiauto, reunimos as melhores empresas e soluções avançadas de rastreamento veicular, garantindo segurança, controlo e monitoramento em tempo real.
						</p>
						<p className="text-lg text-gray-700 leading-relaxed mb-6">
							A nossa missão é proporcionar tranquilidade a quem compra o seu carro connosco e a todos que se preocupam com a proteção do seu veículo, sabendo exatamente onde ele está a qualquer momento.
						</p>
						<p className="text-lg text-gray-700 leading-relaxed">
							Com tecnologia moderna e atendimento de qualidade, a Caxiauto é o seu parceiro ideal em mobilidade e segurança automóvel.
						</p>
					</div>
				</div>
			</section>

			{/* Why Choose Us / Benefits */}
			<section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 bg-[#154c9a] opacity-90"></div>
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-7xl mx-auto relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Por que escolher os Serviços GPS da Caxiauto?</h2>
							<p className="text-xl text-blue-100 mb-10 leading-relaxed">
								Oferecemos tecnologia de ponta aliada a um suporte técnico excepcional, garantindo que o seu veículo esteja sempre protegido e sob controlo total.
							</p>
							<div className="flex flex-col gap-4">
								<Link
									to="/contato"
									className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#154c9a] bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 self-start w-full sm:w-auto"
								>
									Solicite o seu Orçamento
								</Link>
								<p className="text-blue-100 text-sm">
									Acreditamos em oferecer o melhor atendimento possível a todos os nossos clientes e temos prazer em receber novos parceiros.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{benefits.map((benefit, index) => (
								<div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
									<benefit.icon className="w-8 h-8 text-blue-200 mb-4" />
									<h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
									<p className="text-blue-100">{benefit.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
