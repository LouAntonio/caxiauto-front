import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Search, Scale, MessageCircle, ShieldCheck, ShoppingCart, Store, Wrench, Truck, Car, Users, ArrowRight, Key, GitCompare, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComoFunciona() {
	useDocumentTitle('Como Funciona - Caxiauto');

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Pesquise o que precisa',
			description: 'Utilize nossa plataforma para encontrar viaturas, peças, serviços de reboque ou opções de aluguer de viaturas.',
			icon: Search,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Compare opções e fornecedores',
			description: 'Veja diferentes alternativas, compare preços, características e escolha a melhor opção para suas necessidades.',
			icon: Scale,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Entre em contacto',
			description: 'Contacte direto com o anunciante ou prestador de serviço para tirar dúvidas e negociar os detalhes.',
			icon: MessageCircle,
		},
		{
			number: '04',
			label: 'PASSO',
			title: 'Feche negócio com segurança',
			description: 'Conclua a transação com mais segurança e praticidade através da nossa plataforma que verifica parceiros e anunciantes.',
			icon: ShieldCheck,
		}
	];

	const audience = [
		{ icon: ShoppingCart, title: 'Compradores de carros novos e usados' },
		{ icon: Store, title: 'Vendedores particulares e stands automóveis' },
		{ icon: Wrench, title: 'Oficinas e lojas de peças' },
		{ icon: Truck, title: 'Empresas de reboque' },
		{ icon: Car, title: 'Empresas que precisam de aluguer de viaturas' },
		{ icon: Users, title: 'Particulares que precisam de aluguer de viaturas' }
	];

	const aluguelSteps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Pesquise pela Viatura',
			description: 'Escolha a viatura ou pesquise por um modelo à sua escolha.',
			icon: Search,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Compare Ofertas',
			description: 'Analise preços, características e condições de diferentes veículos para encontrar a melhor opção.',
			icon: GitCompare,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Reserve com Segurança',
			description: 'Entre em contacto direto e finalize a sua reserva de forma rápida e segura.',
			icon: Key,
		},
		{
			number: '04',
			label: 'PASSO',
			title: 'Levante e Conduza',
			description: 'Receba a viatura no local combinado e desfrute da sua viagem com total tranquilidade.',
			icon: CheckCircle2,
		}
	];

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="px-6 bg-[#154c9a] text-white relative overflow-hidden isolate py-32 sm:py-44">
				<div
					className="absolute inset-0 -z-10 opacity-10"
					style={{
						backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
					}}
				></div>

				{/* Gradiente de background */}
				<div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#154c9a] via-[#0f3d7a] to-[#154c9a] opacity-90"></div>

				{/* Elementos decorativos */}
				<div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
				<div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
				<div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>

				<div className="max-w-4xl mx-auto text-center relative z-10 w-full">
					{/* Badge decorativo */}
					<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 mb-8 backdrop-blur-sm shadow-lg">
						<Sparkles className="w-5 h-5" />
						<span className="font-semibold text-sm tracking-wide uppercase">4 Passos Simples</span>
					</div>

					<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
						Como Funciona a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Caxiauto</span>
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
						A sua jornada para soluções de mobilidade simplificada em apenas 4 passos claros e eficientes.
					</p>

					{/* Scroll indicator */}
					<div className="mt-12 animate-bounce">
						<div className="w-6 h-10 mx-auto border-2 border-white/30 rounded-full flex items-start justify-center p-1">
							<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Timeline Steps */}
			<section className="py-24 px-6 overflow-hidden relative">
				<div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 -z-10"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#154c9a] mb-4">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-sm font-semibold">Passo a Passo</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">É simples e rápido</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{steps.map((step) => (
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

			{/* Audience Section */}
			<section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
				<div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-[#d41120] mb-4">
							<Users className="w-4 h-4" />
							<span className="text-sm font-semibold">Público Alvo</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Para quem é a Caxiauto?</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Conectamos todos os pontos do sector automóvel numa única plataforma integrada.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{audience.map((item) => (
							<div
								key={item.title}
								className="group relative bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(21,76,154,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -m-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="w-14 h-14 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-500">
										<item.icon size={28} />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#154c9a] transition-colors">
										{item.title}
									</h3>
									<div className="h-1 w-12 bg-gray-200 rounded-full group-hover:w-full group-hover:bg-[#154c9a]/20 transition-all duration-500"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Aluguel de Automóveis Section */}
			<section className="py-24 px-6 overflow-hidden relative">
				<div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#154c9a] mb-4">
							<Car className="w-4 h-4" />
							<span className="text-sm font-semibold">Aluguel de Automóveis</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Alugar nunca foi tão fácil</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Encontre o carro perfeito para a sua viagem, negócios ou eventos em apenas 4 passos.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{aluguelSteps.map((step) => (
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

					{/* CTA */}
					<div className="text-center mt-16">
						<Link
							to="/servicos/aluguel-de-automoveis"
							className="inline-flex items-center gap-3 bg-[#154c9a] text-white px-10 py-5 rounded-2xl font-semibold hover:bg-[#0f3d7a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-lg"
						>
							Ver Veículos Disponíveis
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>

			{/* CTA Final */}
			<section className="relative bg-gradient-to-br from-[#154c9a] via-[#0f3d7a] to-[#154c9a] py-20 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400 rounded-full blur-3xl"></div>
				</div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-blue-100 mb-6 backdrop-blur-sm">
							<Sparkles className="w-5 h-5" />
							<span className="font-semibold text-sm">Comece Agora</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pronto para explorar a Caxiauto?</h2>
						<p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">Descubra todos os serviços que temos para si e encontre a solução ideal.</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/servicos/compra-de-viaturas" className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
								<Car className="w-5 h-5" />
								Explorar Veículos
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link to="/servicos/pecas-e-acessorios" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm group">
								<Wrench className="w-5 h-5" />
								Ver Peças e Acessórios
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
