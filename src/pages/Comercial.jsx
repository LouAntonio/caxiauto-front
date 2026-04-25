import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { 
	Rocket, 
	Clock, 
	Sparkles, 
	CheckCircle2, 
	ArrowRight, 
	Car, 
	Wrench, 
	Shield, 
	Users, 
	Zap, 
	Package, 
	GanttChartSquare,
	Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Comercial() {
	useDocumentTitle('Lançamento Caxiauto - Oferta Especial');
	const navigate = useNavigate();

	const handleStartNow = () => {
		navigate('/auth', { state: { isLogin: false } });
	};

	const ecosystem = [
		{ icon: Car, label: 'Venda de viaturas' },
		{ icon: Clock, label: 'Aluguel' },
		{ icon: Package, label: 'Peças e acessórios' },
		{ icon: Wrench, label: 'Oficinas mecânicas' },
		{ icon: Shield, label: 'Seguros' },
		{ icon: Zap, label: 'GPS e muito mais' }
	];

	const benefits = [
		{ 
			title: 'Maior visibilidade', 
			description: 'Dê ao seu negócio o destaque que ele merece no mercado digital.',
			icon: Sparkles
		},
		{ 
			title: 'Ambiente Ideal', 
			description: 'Sua marca presente no ambiente certo para o setor automotivo.',
			icon: Users
		},
		{ 
			title: 'Conexão Direta', 
			description: 'Conecte-se com clientes específicos que buscam exatamente o que você oferece.',
			icon: Zap
		},
		{ 
			title: 'Eficiência Total', 
			description: 'Plataforma simples, rápida e eficiente para gerir o seu negócio.',
			icon: CheckCircle2
		}
	];

	const plans = [
		{ name: 'Mensal', icon: GanttChartSquare },
		{ name: 'Trimestral', icon: GanttChartSquare },
		{ name: 'Semestral', icon: GanttChartSquare },
		{ name: 'Anual', icon: GanttChartSquare }
	];

	return (
		<main className="bg-white min-h-screen">
			{/* Hero Section */}
			<section className="relative py-24 px-6 overflow-hidden bg-[#154c9a] text-white">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl -mr-64 -mt-64 animate-pulse"></div>
					<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '2s' }}></div>
				</div>

				<div className="max-w-7xl mx-auto relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 mb-8 backdrop-blur-sm shadow-xl">
							<Rocket className="w-5 h-5 text-yellow-400" />
							<span className="font-bold text-sm tracking-wider uppercase">Lançamento Exclusivo</span>
						</div>
						
						<h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
							Junte-se à nova era do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">mercado automotivo</span>
						</h1>
						
						<p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed font-medium">
							A Caxiauto abre as portas para uma nova forma de vender, comprar e promover serviços automotivos — tudo em um só lugar.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<button 
								onClick={handleStartNow}
								className="bg-white text-[#154c9a] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
							>
								Começar agora
								<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
							</button>
							<Link 
								to="/como-funciona"
								className="bg-white/10 text-white border border-white/30 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
							>
								Saiba mais
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Launch Offer Banner */}
			<section className="py-12 bg-red-600 text-white relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
						<div className="flex items-center gap-4">
							<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
								<Clock className="w-10 h-10" />
							</div>
							<div className="text-left">
								<h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Oferta de Lançamento</h2>
								<p className="text-red-100 font-medium">Não perca esta oportunidade única</p>
							</div>
						</div>
						
						<div className="h-px w-24 bg-white/30 hidden md:block"></div>

						<div className="text-center md:text-left">
							<p className="text-3xl md:text-4xl font-extrabold leading-tight">
								4 Meses <span className="bg-white text-red-600 px-3 py-1 rounded-xl">Totalmente Grátis</span>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Why the offer? */}
			<section className="py-24 px-6 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
								Por que participar deste período?
							</h2>
							<div className="space-y-6">
								<div className="flex gap-4">
									<div className="w-12 h-12 bg-blue-100 text-[#154c9a] rounded-xl flex items-center justify-center shrink-0">
										<Check className="w-6 h-6" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-gray-800 mb-2">Divulgue seus serviços</h3>
										<p className="text-gray-600">Aproveite para mostrar toda a qualidade do seu negócio sem custos iniciais.</p>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="w-12 h-12 bg-blue-100 text-[#154c9a] rounded-xl flex items-center justify-center shrink-0">
										<Check className="w-6 h-6" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-gray-800 mb-2">Alcançar milhares de clientes</h3>
										<p className="text-gray-600">Sua marca será exposta para uma base crescente de clientes potenciais qualificados.</p>
									</div>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
								<h3 className="text-2xl font-bold text-[#154c9a] mb-6">Tudo o que o seu negócio precisa</h3>
								<div className="grid grid-cols-2 gap-4">
									{ecosystem.map((item, idx) => (
										<div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#154c9a] hover:bg-white transition-all">
											<item.icon className="w-6 h-6 text-[#154c9a] group-hover:scale-110 transition-transform" />
											<span className="font-semibold text-gray-700 text-sm">{item.label}</span>
										</div>
									))}
								</div>
								<p className="mt-8 text-center text-gray-500 font-medium italic">
									"Um verdadeiro ecossistema automotivo digital, criado para o seu negócio."
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Future Plans */}
			<section className="py-24 px-6 bg-white relative overflow-hidden">
				<div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -ml-48"></div>
				
				<div className="max-w-7xl mx-auto relative z-10 text-center">
					<h2 className="text-4xl font-bold text-gray-900 mb-6">Planos Futuros</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 font-medium">
						Após os 4 meses gratuitos, o acesso à plataforma será feito através de planos pagos flexíveis para se adaptar ao seu ritmo.
					</p>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{plans.map((plan, idx) => (
							<div key={idx} className="bg-gray-50 p-8 rounded-3xl border-2 border-transparent hover:border-blue-200 hover:bg-white transition-all shadow-sm hover:shadow-xl group">
								<div className="w-16 h-16 bg-blue-100 text-[#154c9a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
									<plan.icon className="w-8 h-8" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{plan.name}</h3>
							</div>
						))}
					</div>
					
					<p className="mt-12 text-gray-400 font-medium">
						(Pacotes e benefícios serão definidos em breve.)
					</p>
				</div>
			</section>

			{/* Benefits Grid */}
			<section className="py-24 px-6 bg-[#154c9a] relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">Porquê Caxiauto?</h2>
						<div className="w-24 h-1.5 bg-red-500 mx-auto rounded-full"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{benefits.map((benefit, idx) => (
							<div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/20 transition-all">
								<div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20">
									<benefit.icon className="w-8 h-8" />
								</div>
								<h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
								<p className="text-blue-100 font-medium leading-relaxed">
									{benefit.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-24 px-6 bg-white">
				<div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
					<div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

					<h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
						Comece agora e garanta <br/> seus <span className="text-red-500">4 meses grátis</span>
					</h2>
					
					<p className="text-xl text-gray-300 mb-12 font-medium">
						Faça o seu negócio na estrada do crescimento com a Caxiauto. O futuro do mercado automotivo digital está aqui.
					</p>

					<button 
						onClick={handleStartNow}
						className="bg-red-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto group"
					>
						Cadastrar-se Hoje
						<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
					</button>
					
					<p className="mt-8 text-gray-500 text-sm font-medium">
						Ao cadastrar-se, você aceita nossos termos de uso e política de privacidade.
					</p>
				</div>
			</section>
		</main>
	);
}
