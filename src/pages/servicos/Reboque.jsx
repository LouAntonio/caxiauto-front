import React from 'react';
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
	Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Reboque() {
	useDocumentTitle('Reboque - Caxiauto');

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Faça o Pedido',
			description: 'Contacte a Caxiauto através da plataforma informando sua localização e tipo de problema.',
			icon: Phone,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Localização e Conexão',
			description: 'O nosso sistema localiza a empresa de reboque mais próxima de si para garantir uma resposta imediata.',
			icon: MapPin,
		},
		{
			number: '03',
			label: 'PASSO',
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

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="py-24 px-6 bg-[#154c9a] text-white relative overflow-hidden isolate">
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
						<Truck className="w-5 h-5" />
						<span className="font-medium">Assistência 24/7</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
						Serviço de Reboque Profissional
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
						Conectamos você rapidamente aos melhores serviços de reboque da sua zona. Eficiência e segurança quando mais precisa.
					</p>
				</div>
			</section>

			{/* Timeline Steps - Como Funciona */}
			<section className="py-24 px-6 overflow-hidden">
				<div className="max-w-5xl mx-auto relative">
					<div className="text-center mb-20">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Processo Simples</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900">Como Solicitar Ajuda</h2>
					</div>

					{/* Central Line (Desktop) */}
					<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block top-32"></div>

					<div className="space-y-24">
						{steps.map((step, index) => (
							<div key={step.number} className="relative group">
								<div className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

									{/* Content Card */}
									<div className={`flex-1 w-full md:w-auto ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
										<div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden">
											<div className={`absolute top-0 w-24 h-24 bg-blue-50 rounded-full -m-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${index % 2 === 0 ? 'right-0' : 'left-0'}`}></div>

											<div className={`relative flex items-center gap-4 mb-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
												<div className="w-14 h-14 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white transform group-hover:rotate-12 transition-transform duration-300">
													<step.icon size={28} />
												</div>
												<h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#154c9a] transition-colors">{step.title}</h3>
											</div>

											<p className="text-lg text-gray-600 leading-relaxed font-medium">
												{step.description}
											</p>
										</div>
									</div>

									{/* Central Badge */}
									<div className="relative z-10 flex-shrink-0">
										<div className="w-28 h-28 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center border-[6px] border-[#154c9a] group-hover:scale-110 transition-transform duration-300">
											<span className="text-xs font-bold text-[#154c9a] uppercase tracking-widest">{step.label}</span>
											<span className="text-4xl font-black text-gray-900 leading-none mt-1">{step.number}</span>
										</div>
									</div>

									{/* Empty spacer for grid alignment */}
									<div className="flex-1 hidden md:block"></div>
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
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Assistência Completa</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Soluções versáteis para qualquer imprevisto na estrada.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{services.map((service, index) => (
							<div
								key={index}
								className="group bg-gray-50 hover:bg-white p-8 rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
							>
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#154c9a] group-hover:scale-110 group-hover:bg-[#154c9a] group-hover:text-white transition-all duration-300 border border-gray-100 flex-shrink-0">
										<service.icon size={32} />
									</div>
									<div className="flex-1">
										<h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#154c9a] transition-colors">
											{service.title}
										</h3>
										<p className="text-lg text-gray-600 leading-relaxed">
											{service.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 bg-[#154c9a] opacity-90"></div>
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-7xl mx-auto relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Por que escolher o Reboque Caxiauto?</h2>
							<p className="text-xl text-blue-100 mb-10 leading-relaxed">
								Não somos apenas mais um serviço de reboque. Somos a sua garantia de tranquilidade quando algo inesperado acontece na estrada.
							</p>
							<div className="flex flex-col gap-4">
								<Link
									to="/contato"
									className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#154c9a] bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 self-start w-full sm:w-auto"
								>
									Pedir Assistência Agora
								</Link>
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
