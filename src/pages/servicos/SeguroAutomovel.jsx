import React, { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Shield,
	FileText,
	Users,
	Phone,
	ShieldCheck,
	Zap,
	CreditCard,
	Headphones,
	Building2,
	Car,
	Scale,
	CheckCircle2,
	AlertCircle,
	FileCheck,
	TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeguroAutomovel() {
	useDocumentTitle('Seguro Automóvel - Caxiauto');
	const [formData, setFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		tipoSeguro: '',
		tipoViatura: '',
		mensagem: ''
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Pedido de seguro:', formData);
		// Aqui você implementaria a lógica de envio
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Solicite o Orçamento',
			description: 'Preencha o formulário com os dados da viatura e o tipo de seguro pretendido.',
			icon: FileText,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Receba Propostas',
			description: 'A nossa equipa compara e apresenta as melhores opções das seguradoras parceiras.',
			icon: Scale,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Escolha e Contrate',
			description: 'Selecione a proposta ideal e nós tratamos de todo o processo de contratação.',
			icon: CheckCircle2,
		}
	];

	const insuranceTypes = [
		{
			icon: AlertCircle,
			title: 'Seguro Obrigatório',
			description: 'Responsabilidade Civil obrigatória por lei para circular em Angola.'
		},
		{
			icon: ShieldCheck,
			title: 'Seguro Contra Todos os Riscos',
			description: 'Cobertura completa contra danos próprios e de terceiros em qualquer situação.'
		},
		{
			icon: Users,
			title: 'Planos Personalizados',
			description: 'Soluções adaptadas para particulares e empresas com frotas de viaturas.'
		},
		{
			icon: Building2,
			title: 'Seguros Empresariais',
			description: 'Coberturas especiais para empresas com múltiplas viaturas e necessidades específicas.'
		}
	];

	const benefits = [
		{ icon: Building2, title: 'Parceria com Seguradoras Líderes', description: 'Mundial Seguros, ENSA, Fidelidade Angola, Nossa Seguros e outras.' },
		{ icon: Scale, title: 'Comparação de Preços', description: 'Veja várias propostas num só lugar e escolha a melhor.' },
		{ icon: Zap, title: 'Rapidez e Transparência', description: 'Processo ágil na contratação e tratamento de sinistros.' },
		{ icon: TrendingDown, title: 'Sistema Bónus-Malus', description: 'Descontos para bons condutores sem histórico de sinistros.' },
		{ icon: Car, title: 'Reboque 24h', description: 'Serviço de assistência em viagem disponível em todo o país.' },
		{ icon: CreditCard, title: 'Facilidade de Pagamento', description: 'Multicaixa, lojas e agências das seguradoras.' },
		{ icon: Headphones, title: 'Acompanhamento Completo', description: 'Suporte antes, durante e após a contratação do seguro.' },
	];

	const requiredDocuments = [
		{
			category: 'Do Proprietário',
			items: ['Cópia do Bilhete de Identidade ou Passaporte', 'Número de contribuinte (NIF)', 'Contactos (telefone e e-mail)']
		},
		{
			category: 'Da Viatura',
			items: ['Livrete ou Título único de Registo automóvel']
		},
		{
			category: 'Para Empresas',
			items: ['Cópia do Alvará ou Certidão Comercial', 'NIF da empresa', 'Identificação do representante legal']
		}
	];

	const quotationInfo = [
		'Tipo de seguro pretendido (Obrigatório ou Completo)',
		'Uso da viatura (particular, comercial, táxi, frota, etc.)',
		'Local de circulação principal',
		'Histórico de sinistros (se existir)',
		'Dados do condutor principal'
	];

	const partners = ['A Mundial Seguros', 'ENSA', 'Fidelidade Angola', 'Nossa Seguros'];

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="px-6 bg-[#154c9a] text-white relative overflow-hidden isolate h-[calc(100vh-80px)] flex items-center">
				<div
					className="absolute inset-0 -z-10 opacity-10"
					style={{
						backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
					}}
				></div>

				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10 w-full">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 mb-6 backdrop-blur-sm">
						<Shield className="w-5 h-5" />
						<span className="font-medium">Proteção Completa</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
						Seguro Automóvel
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-6">
						Proteção completa para particulares e empresas. Mediamos seguros com as principais seguradoras de Angola.
					</p>
					<div className="flex flex-wrap justify-center gap-3 text-sm">
						{partners.map((partner, idx) => (
							<span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
								{partner}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* Timeline Steps - Como Funciona */}
			<section className="py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-10">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Processo Simples</span>
						<h2 className="text-3xl font-bold text-gray-900">Como Contratar</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

			{/* Tipos de Seguro */}
			<section className="py-24 px-6 bg-white relative">
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Coberturas Disponíveis</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tipos de Seguro</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Através da Caxiauto, pode contratar diferentes modalidades de seguro adaptadas às suas necessidades.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{insuranceTypes.map((type, index) => (
							<div
								key={index}
								className="group bg-gray-50 hover:bg-white p-8 rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
							>
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#154c9a] group-hover:scale-110 group-hover:bg-[#154c9a] group-hover:text-white transition-all duration-300 border border-gray-100 flex-shrink-0">
										<type.icon size={32} />
									</div>
									<div className="flex-1">
										<h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#154c9a] transition-colors">
											{type.title}
										</h3>
										<p className="text-lg text-gray-600 leading-relaxed">
											{type.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Formulário de Pedido */}
			<section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Pedido de Seguro</span>
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Solicite o seu Seguro Automóvel</h2>
						<p className="text-lg text-gray-600">
							Preencha o formulário e a nossa equipa entrará em contacto para apresentar as melhores propostas das seguradoras parceiras.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
									Nome Completo
								</label>
								<input
									type="text"
									id="nome"
									name="nome"
									value={formData.nome}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all"
									placeholder="Seu nome"
								/>
							</div>

							<div>
								<label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
									Telefone
								</label>
								<input
									type="tel"
									id="telefone"
									name="telefone"
									value={formData.telefone}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all"
									placeholder="+244"
								/>
							</div>
						</div>

						<div className="mb-6">
							<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
								E-mail
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all"
								placeholder="seu@email.com"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label htmlFor="tipoSeguro" className="block text-sm font-semibold text-gray-700 mb-2">
									Tipo de Seguro
								</label>
								<select
									id="tipoSeguro"
									name="tipoSeguro"
									value={formData.tipoSeguro}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all cursor-pointer"
								>
									<option value="">Selecione</option>
									<option value="obrigatorio">Seguro Obrigatório</option>
									<option value="completo">Seguro Completo</option>
									<option value="empresarial">Seguro Empresarial</option>
								</select>
							</div>

							<div>
								<label htmlFor="tipoViatura" className="block text-sm font-semibold text-gray-700 mb-2">
									Tipo de Viatura
								</label>
								<select
									id="tipoViatura"
									name="tipoViatura"
									value={formData.tipoViatura}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all cursor-pointer"
								>
									<option value="">Selecione</option>
									<option value="ligeiro">Ligeiro</option>
									<option value="pesado">Pesado</option>
									<option value="moto">Moto</option>
									<option value="taxi">Táxi</option>
									<option value="frota">Frota</option>
								</select>
							</div>
						</div>

						<div className="mb-6">
							<label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
								Informações Adicionais
							</label>
							<textarea
								id="mensagem"
								name="mensagem"
								value={formData.mensagem}
								onChange={handleChange}
								rows="4"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-[#154c9a] outline-none transition-all resize-none"
								placeholder="Descreva outras informações relevantes sobre a viatura ou necessidades específicas..."
							></textarea>
						</div>

						<button
							type="submit"
							className="w-full bg-[#154c9a] text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
						>
							Solicitar Orçamento
						</button>
					</form>
				</div>
			</section>

			{/* Documentos Necessários */}
			<section className="py-24 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Requisitos</span>
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Documentos Necessários</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Para contratar o seguro, tenha em mãos os seguintes documentos:
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{requiredDocuments.map((doc, index) => (
							<div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#154c9a]/30 hover:shadow-xl transition-all duration-300">
								<div className="flex items-center gap-3 mb-6">
									<FileCheck className="w-8 h-8 text-[#154c9a]" />
									<h3 className="text-2xl font-bold text-gray-900">{doc.category}</h3>
								</div>
								<ul className="space-y-3">
									{doc.items.map((item, idx) => (
										<li key={idx} className="flex items-start gap-3">
											<CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
											<span className="text-gray-700">{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Informações para Cotação */}
			<section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Para Orçamento</span>
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Informações Necessárias para Cotação</h2>
						<p className="text-xl text-gray-600">
							No pedido de seguro, será solicitado:
						</p>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
						<ul className="space-y-4">
							{quotationInfo.map((info, index) => (
								<li key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
									<div className="w-8 h-8 bg-[#154c9a] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
										{index + 1}
									</div>
									<span className="text-lg text-gray-700 pt-1">{info}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* Vantagens - Why Choose Us */}
			<section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 bg-[#154c9a] opacity-90"></div>
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-7xl mx-auto relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Vantagens de Contratar com a Caxiauto</h2>
						<p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
							Não escolhe sozinho — nós ajudamos a escolher o melhor seguro para si. Compare propostas, escolha a melhor seguradora e conduza com tranquilidade.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{benefits.map((benefit, index) => (
							<div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
								<benefit.icon className="w-10 h-10 text-blue-200 mb-4" />
								<h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
								<p className="text-blue-100 leading-relaxed">{benefit.description}</p>
							</div>
						))}
					</div>

					<div className="text-center mt-12">
						<Link
							to="/contato"
							className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#154c9a] bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
						>
							<Phone className="w-5 h-5 mr-2" />
							Fale Connosco Agora
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
