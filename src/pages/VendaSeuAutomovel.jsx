import React, { useState } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
	FileText,
	CheckCircle2,
	TrendingUp,
	Users,
	Shield,
	DollarSign,
	Clock,
	Zap,
	Star,
	ThumbsUp,
	Car
} from 'lucide-react'

export default function VendaSeuAutomovel() {
	useDocumentTitle('Venda a Sua Viatura - Caxiauto')

	const [currentStep, setCurrentStep] = useState(1)

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Registe a sua viatura online',
			description: 'Preencha o formulário com todas as informações da viatura e documentos necessários.',
			icon: FileText,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'A Caxiauto valida os dados',
			description: 'Nossa equipa verifica todas as informações e aprova o anúncio rapidamente.',
			icon: CheckCircle2,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Divulgamos e gerimos interessados',
			description: 'Promovemos a sua viatura na plataforma, redes sociais e gerimos todos os contactos.',
			icon: TrendingUp,
		},
		{
			number: '04',
			label: 'PASSO',
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

	const commissions = [
		{ range: 'Até 5.000.000 Kz', percentage: '6,5%', color: 'from-blue-500 to-blue-600' },
		{ range: '6.000.000 a 10.000.000 Kz', percentage: '5%', color: 'from-blue-600 to-blue-700' },
		{ range: 'Acima de 11.000.000 Kz', percentage: '3,5%', color: 'from-blue-700 to-blue-800' },
	]

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">{/* Hero Section */}
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
						<Car className="w-5 h-5" />
						<span className="font-medium">Intermediação de Vendas</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
						VENDA A SUA VIATURA COM A CAXIAUTO
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
						Rápido • Seguro • Sem complicações
					</p>
					<p className="text-lg text-blue-50 max-w-2xl mx-auto mb-8">
						Tratamos de todo o processo por si — desde o registo até à venda final. Oferecemos um serviço completo de intermediação onde encontramos o comprador ideal para a sua viatura.
					</p>
					<a
						href="#formulario"
						className="inline-block bg-white text-[#154c9a] font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						Registar Agora
					</a>
				</div>
			</section>

			{/* Timeline Steps - Como Funciona */}
			<section className="py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Processo Simples</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Como Funciona</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Apenas 4 passos para vender a sua viatura com segurança
						</p>
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

			{/* Comissão Transparente */}
			<section className="py-24 px-6 bg-white relative">
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Preços Justos</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Comissão Transparente</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
							Só paga se vender. Sem custos de registo ou mensalidades.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						{commissions.map((item, index) => (
							<div key={index} className="relative group">
								<div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-[0_8px_30px_rgb(21,76,154,0.12)] p-8 border-2 border-blue-100/50 hover:shadow-2xl hover:border-[#154c9a]/30 transition-all duration-300 transform group-hover:-translate-y-2 text-center">
									<div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
										<DollarSign className="w-12 h-12 text-white" strokeWidth={2.5} />
									</div>
									<p className="text-gray-700 font-semibold mb-4">{item.range}</p>
									<p className="text-5xl font-black bg-gradient-to-br from-[#154c9a] to-blue-700 bg-clip-text text-transparent">{item.percentage}</p>
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						<div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
							<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
							<span className="text-gray-700 font-medium">Sem custos de registo</span>
						</div>
						<div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
							<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
							<span className="text-gray-700 font-medium">Sem mensalidades</span>
						</div>
						<div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
							<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
							<span className="text-gray-700 font-medium">Só paga se vender</span>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Grid */}
			<section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Vantagens</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Porque Vender com a Caxiauto?</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{benefits.map((benefit, index) => (
							<div key={index} className="group">
								<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#154c9a]/20 h-full">
									<div className="w-16 h-16 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
										<benefit.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#154c9a] transition-colors">
										{benefit.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">{benefit.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}
