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
	const [formData, setFormData] = useState({
		// Dados do vendedor
		nomeCompleto: '',
		documento: '',
		telefone: '',
		email: '',
		tipoVendedor: '',
		// Informações da viatura
		marca: '',
		modelo: '',
		ano: '',
		versao: '',
		combustivel: '',
		caixa: '',
		quilometragem: '',
		cor: '',
		portas: '',
		tracao: '',
		estado: '',
		preco: '',
		// Documentos e imagens
		livrete: null,
		fotos: [],
		// Termos
		aceitaTermos: false
	})

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	const handleFileChange = (e) => {
		const { name, files } = e.target
		if (name === 'livrete') {
			setFormData(prev => ({ ...prev, livrete: files[0] }))
		} else if (name === 'fotos') {
			setFormData(prev => ({ ...prev, fotos: Array.from(files) }))
		}
	}

	const validateStep = (step) => {
		const requiredFields = {
			1: ['nomeCompleto', 'documento', 'telefone', 'email', 'tipoVendedor'],
			2: ['marca', 'modelo', 'ano', 'combustivel', 'caixa', 'quilometragem', 'cor', 'portas', 'estado', 'preco'],
			3: ['livrete', 'fotos'],
			4: ['aceitaTermos']
		}

		const fieldsToCheck = requiredFields[step] || []
		for (const field of fieldsToCheck) {
			if (field === 'fotos') {
				if (formData.fotos.length < 4) {
					alert('Por favor, adicione pelo menos 4 fotos da viatura.')
					return false
				}
			} else if (!formData[field]) {
				alert(`Por favor, preencha o campo ${field} obrigatório.`)
				return false
			}
		}
		return true
	}

	const nextStep = () => {
		if (validateStep(currentStep)) {
			setCurrentStep(prev => prev + 1)
			window.scrollTo({ top: document.getElementById('formulario').offsetTop - 100, behavior: 'smooth' })
		}
	}

	const prevStep = () => {
		setCurrentStep(prev => prev - 1)
		window.scrollTo({ top: document.getElementById('formulario').offsetTop - 100, behavior: 'smooth' })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Aqui você implementaria o envio do formulário
		console.log('Formulário enviado:', formData)
		alert('Registo enviado com sucesso! Entraremos em contato em breve.')
	}

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

			{/* Formulário de Registo */}
			<section className="py-24 px-6 bg-white relative" id="formulario">
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Registo</span>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Registe a Sua Viatura</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Preencha o formulário com os dados completos da viatura
						</p>
					</div>

					<div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-[0_8px_30px_rgb(21,76,154,0.12)] p-8 md:p-12 border-2 border-blue-100/50">
						<div className="mb-8">
							<div className="flex items-center justify-between mb-4">
								{['Vendedor', 'Viatura', 'Documentos', 'Confirmação'].map((stepName, idx) => {
									const stepNum = idx + 1
									const isActive = stepNum === currentStep
									const isCompleted = stepNum < currentStep

									return (
										<div key={stepNum} className="flex flex-col items-center flex-1 relative">
											<div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-300 z-10 ${isActive ? 'bg-[#154c9a] text-white scale-110 shadow-lg' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
												{isCompleted ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
											</div>
											<span className={`text-xs md:text-sm font-medium ${isActive ? 'text-[#154c9a] font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
												{stepName}
											</span>
											{/* Connectors */}
											{stepNum !== 4 && (
												<div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
											)}
										</div>
									)
								})}
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Passo 1: Dados do Vendedor */}
							{currentStep === 1 && (
								<div className="animate-in fade-in slide-in-from-right-4 duration-300">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-xl flex items-center justify-center">
											<Users className="w-6 h-6 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-800">Dados do Vendedor</h3>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Nome Completo *</label>
											<input
												type="text"
												name="nomeCompleto"
												value={formData.nomeCompleto}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Bilhete de Identidade / Passaporte *</label>
											<input
												type="text"
												name="documento"
												value={formData.documento}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
											<input
												type="tel"
												name="telefone"
												value={formData.telefone}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">E-mail *</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-gray-700 font-semibold mb-2">Tipo de Vendedor *</label>
											<select
												name="tipoVendedor"
												value={formData.tipoVendedor}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="proprietario">Proprietário</option>
												<option value="vendedor_autorizado">Vendedor Autorizado</option>
											</select>
										</div>
									</div>
								</div>
							)}

							{/* Passo 2: Informações da Viatura */}
							{currentStep === 2 && (
								<div className="animate-in fade-in slide-in-from-right-4 duration-300">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-xl flex items-center justify-center">
											<Car className="w-6 h-6 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-800">Informações da Viatura</h3>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Marca *</label>
											<input
												type="text"
												name="marca"
												value={formData.marca}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Modelo *</label>
											<input
												type="text"
												name="modelo"
												value={formData.modelo}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Ano *</label>
											<input
												type="number"
												name="ano"
												value={formData.ano}
												onChange={handleInputChange}
												required
												min="1900"
												max={new Date().getFullYear() + 1}
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Versão / Motorização</label>
											<input
												type="text"
												name="versao"
												value={formData.versao}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Tipo de Combustível *</label>
											<select
												name="combustivel"
												value={formData.combustivel}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="gasolina">Gasolina</option>
												<option value="diesel">Diesel</option>
												<option value="hibrido">Híbrido</option>
												<option value="eletrico">Elétrico</option>
												<option value="gas">Gás</option>
											</select>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Caixa *</label>
											<select
												name="caixa"
												value={formData.caixa}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="manual">Manual</option>
												<option value="automatica">Automática</option>
											</select>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Quilometragem (km) *</label>
											<input
												type="number"
												name="quilometragem"
												value={formData.quilometragem}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Cor *</label>
											<input
												type="text"
												name="cor"
												value={formData.cor}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Número de Portas *</label>
											<select
												name="portas"
												value={formData.portas}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="2">2 Portas</option>
												<option value="3">3 Portas</option>
												<option value="4">4 Portas</option>
												<option value="5">5 Portas</option>
											</select>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Tipo de Tração</label>
											<select
												name="tracao"
												value={formData.tracao}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="dianteira">Tração Dianteira</option>
												<option value="traseira">Tração Traseira</option>
												<option value="4x4">4x4 / AWD</option>
											</select>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Estado da Viatura *</label>
											<select
												name="estado"
												value={formData.estado}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											>
												<option value="">Selecione...</option>
												<option value="novo">Novo</option>
												<option value="semi-novo">Semi-novo</option>
												<option value="usado">Usado</option>
											</select>
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">Preço Pretendido (Kz) *</label>
											<input
												type="number"
												name="preco"
												value={formData.preco}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Passo 3: Documentos */}
							{currentStep === 3 && (
								<div className="animate-in fade-in slide-in-from-right-4 duration-300">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-xl flex items-center justify-center">
											<FileText className="w-6 h-6 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-800">Documentos Obrigatórios</h3>
									</div>
									<div className="space-y-4">
										<div>
											<label className="block text-gray-700 font-semibold mb-2">
												Livrete ou Título de Registo de Propriedade *
											</label>
											<input
												type="file"
												name="livrete"
												onChange={handleFileChange}
												required
												accept="image/*,.pdf"
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:cursor-pointer hover:file:bg-blue-700"
											/>
											<p className="text-sm text-gray-500 mt-2">Formatos aceitos: PDF ou imagem</p>
											{formData.livrete && <p className="text-sm text-green-600 mt-1 font-medium">✓ Ficheiro selecionado: {formData.livrete.name}</p>}
										</div>
										<div>
											<label className="block text-gray-700 font-semibold mb-2">
												Fotografias da Viatura * (mínimo 4 fotos)
											</label>
											<input
												type="file"
												name="fotos"
												onChange={handleFileChange}
												required
												multiple
												accept="image/*"
												className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:cursor-pointer hover:file:bg-blue-700"
											/>
											<p className="text-sm text-gray-500 mt-2">
												Tire fotos de diferentes ângulos: frente, traseira, laterais, interior e motor
											</p>
											{formData.fotos.length > 0 && <p className="text-sm text-green-600 mt-1 font-medium">✓ {formData.fotos.length} fotos selecionadas</p>}
										</div>
									</div>
								</div>
							)}

							{/* Passo 4: Termos e Confirmação */}
							{currentStep === 4 && (
								<div className="animate-in fade-in slide-in-from-right-4 duration-300">
									{/* Resumo */}
									<div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
										<h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Resumo dos Dados</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div>
												<p className="text-gray-500">Vendedor</p>
												<p className="font-medium text-gray-900">{formData.nomeCompleto}</p>
											</div>
											<div>
												<p className="text-gray-500">Viatura</p>
												<p className="font-medium text-gray-900">{formData.marca} {formData.modelo} ({formData.ano})</p>
											</div>
											<div>
												<p className="text-gray-500">Preço</p>
												<p className="font-medium text-gray-900">{formData.preco} Kz</p>
											</div>
											<div>
												<p className="text-gray-500">Documentos</p>
												<p className="font-medium text-gray-900">{formData.livrete ? 'Sim' : 'Não'} / {formData.fotos.length} fotos</p>
											</div>
										</div>
									</div>

									{/* Aviso */}
									<div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl mb-6">
										<div className="flex items-start gap-3">
											<Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
											<div>
												<p className="text-yellow-800 font-semibold mb-1">Atenção</p>
												<p className="text-yellow-700">
													Apenas proprietários ou vendedores autorizados podem registar viaturas.
												</p>
											</div>
										</div>
									</div>

									{/* Termos e Condições */}
									<div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 mb-6">
										<h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
											<FileText className="w-6 h-6 text-[#154c9a]" />
											Termos e Condições — Venda Connosco Caxiauto
										</h3>
										<div className="space-y-3 text-sm text-gray-700 max-h-48 overflow-y-auto mb-6 pr-2 custom-scrollbar">
											<p className="font-semibold">Ao registar uma viatura na plataforma Caxiauto, o utilizador declara que:</p>
											<p><strong>1.</strong> É o legítimo proprietário da viatura ou possui autorização legal para a venda.</p>
											<p><strong>2.</strong> Todas as informações fornecidas são verdadeiras, completas e atualizadas.</p>
											<p><strong>3.</strong> Autoriza a Caxiauto a divulgar a viatura na sua plataforma, redes sociais e canais parceiros.</p>
											<p><strong>4.</strong> Reconhece que a Caxiauto atua como intermediária de venda, não sendo a proprietária da viatura.</p>
											<p><strong>5.</strong> Aceita pagar à Caxiauto a comissão de intermediação acordada após a concretização da venda:</p>
											<ul className="ml-6 space-y-1">
												<li>6,5% para viaturas até 5.000.000 Kz</li>
												<li>5% para viaturas entre 6.000.000 Kz e 10.000.000 Kz</li>
												<li>3,5% para viaturas acima de 11.000.000 Kz</li>
											</ul>
											<p><strong>6.</strong> Concorda que a comissão só será devida quando a venda for efetivamente concluída.</p>
											<p><strong>7.</strong> Autoriza a Caxiauto a acompanhar todo o processo de negociação, contacto com compradores e entrega da viatura.</p>
											<p><strong>8.</strong> Compromete-se a informar imediatamente a Caxiauto caso a viatura seja vendida por outro meio.</p>
											<p><strong>9.</strong> A Caxiauto reserva-se o direito de recusar ou remover anúncios que não cumpram as regras da plataforma.</p>
										</div>
										<div className="flex items-start gap-3 bg-white p-4 rounded-xl">
											<input
												type="checkbox"
												name="aceitaTermos"
												checked={formData.aceitaTermos}
												onChange={handleInputChange}
												required
												className="mt-1 h-5 w-5 text-[#154c9a] focus:ring-[#154c9a] border-gray-300 rounded cursor-pointer"
											/>
											<label className="text-gray-700 font-medium cursor-pointer">
												Declaro que li e aceito os Termos e Condições da Caxiauto. *
											</label>
										</div>
									</div>
								</div>
							)}

							{/* Botões de Navegação */}
							<div className="flex justify-between items-center pt-6 border-t border-gray-100">
								{currentStep > 1 ? (
									<button
										type="button"
										onClick={prevStep}
										className="px-8 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
									>
										Voltar
									</button>
								) : (
									<div></div>
								)}

								{currentStep < 4 ? (
									<button
										type="button"
										onClick={nextStep}
										className="bg-[#154c9a] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl ml-auto"
									>
										Próximo Passo
									</button>
								) : (
									<button
										type="submit"
										className="bg-gradient-to-r from-[#154c9a] to-blue-600 hover:from-[#123a7a] hover:to-blue-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
									>
										Confirmar e Registar
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</section>

			{/* CTA Final */}
			<section className="py-24 px-6 bg-gradient-to-br from-[#154c9a] to-blue-800 text-white relative overflow-hidden">
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10">
					<Star className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
					<h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Vender?</h2>
					<p className="text-xl text-blue-100 mb-8">
						Registe agora a sua viatura e venda com tranquilidade e segurança.
					</p>
					<a
						href="#formulario"
						className="inline-block bg-white text-[#154c9a] font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						REGISTAR AGORA
					</a>
				</div>
			</section>
		</main>
	)
}
