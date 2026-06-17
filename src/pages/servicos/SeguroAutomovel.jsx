import React, { useState, useEffect, useRef } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { notyf } from '../../services/api';
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
	TrendingDown,
	ArrowRight,
	Sparkles,
	Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

function useScrollReveal(threshold = 0.15) {
	const ref = useRef(null)
	const [isVisible, setIsVisible] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (isVisible) return
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.unobserve(el)
				}
			},
			{ threshold }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [threshold, isVisible])

	return [ref, isVisible]
}

export default function SeguroAutomovel() {
	useDocumentTitle('Seguro Automóvel - Caxiauto');

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [formData, setFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		tipoSeguro: '',
		tipoViatura: '',
		mensagem: ''
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await api.contactInsurance(formData);
			if (response.success) {
				notyf.success(response.msg || 'Pedido de seguro enviado com sucesso!');
				setFormData({ nome: '', email: '', telefone: '', tipoSeguro: '', tipoViatura: '', mensagem: '' });
			} else {
				notyf.error(response.msg || 'Erro ao enviar pedido de seguro');
			}
		} catch (error) {
			console.error('Erro ao enviar pedido de seguro:', error);
			notyf.error('Erro ao enviar pedido de seguro');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const steps = [
		{
			number: '01',
			title: 'Solicite o Orçamento',
			description: 'Preencha o formulário com os dados da viatura e o tipo de seguro pretendido.',
			icon: FileText,
		},
		{
			number: '02',
			title: 'Receba Propostas',
			description: 'A nossa equipa compara e apresenta as melhores opções das seguradoras parceiras.',
			icon: Scale,
		},
		{
			number: '03',
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

	const [stepsRef, stepsVisible] = useScrollReveal()
	const [typesRef, typesVisible] = useScrollReveal()
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
							<Shield className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Proteção Completa</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-6 [text-wrap:balance]">
							Seguro{' '}
							<span className="text-[#d41120]">Automóvel</span>
						</h1>

						<div className="flex justify-center mb-6">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto mb-8 leading-relaxed">
							Proteção completa para particulares e empresas. Mediamos seguros com as principais seguradoras de Angola.
						</p>

						<div className="flex flex-wrap justify-center gap-3">
							{partners.map((partner, idx) => (
								<span key={idx} className="px-4 py-2 bg-[#eef3fa] text-[#154c9a] rounded-full text-sm font-semibold font-body">
									{partner}
								</span>
							))}
						</div>
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
							Como Contratar
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

			{/* Tipos de Seguro */}
			<section ref={typesRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Coberturas Disponíveis</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Tipos de Seguro
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Através da Caxiauto, pode contratar diferentes modalidades de seguro adaptadas às suas necessidades.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-2">
						{insuranceTypes.map((type, index) => (
							<div
								key={index}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									typesVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: typesVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="flex items-start gap-6">
									<div className="w-12 h-12 bg-[#154c9a] rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
										<type.icon className="h-6 w-6" aria-hidden="true" />
									</div>
									<div className="flex-1">
										<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
											{type.title}
										</h3>
										<p className="font-body text-[#6b7280] leading-relaxed">{type.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Formulário de Pedido */}
			<section className="bg-white py-20 sm:py-28">
				<div className="mx-auto max-w-3xl px-6 lg:px-8">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-4">
							<FileText className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Pedido de Seguro</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Solicite o seu Seguro Automóvel
						</h2>
						<p className="font-body text-lg text-[#6b7280]">
							Preencha o formulário e a nossa equipa entrará em contacto para apresentar as melhores propostas das seguradoras parceiras.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e5e7eb] p-8 md:p-12">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label htmlFor="nome" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
									Nome Completo
								</label>
								<input
									type="text"
									id="nome"
									name="nome"
									value={formData.nome}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
									placeholder="Seu nome"
								/>
							</div>

							<div>
								<label htmlFor="telefone" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
									Telefone
								</label>
								<input
									type="tel"
									id="telefone"
									name="telefone"
									value={formData.telefone}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
									placeholder="+244 912 345 678"
								/>
							</div>
						</div>

						<div className="mb-6">
							<label htmlFor="email" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
								E-mail
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
								placeholder="seu@email.com"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<label htmlFor="tipoSeguro" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
									Tipo de Seguro
								</label>
								<select
									id="tipoSeguro"
									name="tipoSeguro"
									value={formData.tipoSeguro}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
								>
									<option value="">Selecione</option>
									<option value="obrigatorio">Seguro Obrigatório</option>
									<option value="completo">Seguro Completo</option>
									<option value="empresarial">Seguro Empresarial</option>
								</select>
							</div>

							<div>
								<label htmlFor="tipoViatura" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
									Tipo de Viatura
								</label>
								<select
									id="tipoViatura"
									name="tipoViatura"
									value={formData.tipoViatura}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body cursor-pointer focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
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
							<label htmlFor="mensagem" className="block text-sm font-semibold text-[#6b7280] mb-2 font-body">
								Informações Adicionais
							</label>
							<textarea
								id="mensagem"
								name="mensagem"
								value={formData.mensagem}
								onChange={handleChange}
								rows="4"
								className="w-full px-4 py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body resize-none focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20"
								placeholder="Descreva outras informações relevantes sobre a viatura ou necessidades específicas..."
							></textarea>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#154c9a] text-white font-semibold py-4 px-8 rounded-2xl hover:bg-[#0c2d5e] transition-all duration-300 shadow-lg hover:shadow-xl font-body cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Enviando...
								</span>
							) : 'Solicitar Orçamento'}
						</button>
					</form>
				</div>
			</section>

			{/* Documentos Necessários */}
			<section className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<FileCheck className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Requisitos</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Documentos Necessários
						</h2>
						<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto">
							Para contratar o seguro, tenha em mãos os seguintes documentos:
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
						{requiredDocuments.map((doc, index) => (
							<div key={index} className="bg-white p-8 rounded-2xl border border-[#e5e7eb]">
								<div className="flex items-center gap-3 mb-6">
									<FileCheck className="w-6 h-6 text-[#154c9a]" />
									<h3 className="font-display text-lg font-bold text-[#111827]">{doc.category}</h3>
								</div>
								<ul className="space-y-3">
									{doc.items.map((item, idx) => (
										<li key={idx} className="flex items-start gap-3">
											<CheckCircle2 className="w-5 h-5 text-[#154c9a] mt-0.5 flex-shrink-0" />
											<span className="font-body text-[#6b7280]">{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Informações para Cotação */}
			<section className="bg-white py-20 sm:py-28">
				<div className="mx-auto max-w-4xl px-6 lg:px-8">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<Scale className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Para Orçamento</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
							Informações Necessárias para Cotação
						</h2>
						<p className="font-body text-lg text-[#6b7280]">
							No pedido de seguro, será solicitado:
						</p>
					</div>

					<div className="bg-white rounded-2xl border border-[#e5e7eb] p-8 md:p-12">
						<ul className="space-y-4">
							{quotationInfo.map((info, index) => (
								<li key={index} className="flex items-start gap-4">
									<div className="w-8 h-8 bg-[#154c9a] text-white rounded-full flex items-center justify-center font-bold font-body flex-shrink-0 text-sm">
										{index + 1}
									</div>
									<span className="font-body text-lg text-[#6b7280] pt-1">{info}</span>
								</li>
							))}
						</ul>
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
							Vantagens de Contratar com a Caxiauto
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Não escolhe sozinho — nós ajudamos a escolher o melhor seguro para si. Compare propostas, escolha a melhor seguradora e conduza com tranquilidade.
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
							<Phone className="w-5 h-5" />
							Fale Connosco Agora
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
							Proteja o seu veículo hoje
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Solicite um orçamento gratuito e descubra as melhores propostas das seguradoras parceiras.
						</p>
						<Link
							to="/contato"
							className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-10 py-5 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group text-lg"
						>
							<Shield className="w-5 h-5" />
							Fale Connosco Agora
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
