import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Gauge,
	Calendar,
	MapPin,
	Droplet,
	Users,
	Cog,
	Car,
	Shield,
	ChevronLeft,
	ChevronRight,
	Phone,
	Mail,
	CheckCircle2,
	X,
	Upload,
	FileText
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function DetalhesAluguel() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [selectedPeriod, setSelectedPeriod] = useState('diaria')
	const [showContactModal, setShowContactModal] = useState(false)

	// Dados do veículo (em produção, viria de uma API)
	const vehicle = {
		id: parseInt(id) || 1,
		title: 'Toyota Corolla 2024',
		price: 150000,
		images: [
			'/images/i10.jpg',
			'/images/i10.jpg',
			'/images/i10.jpg',
			'/images/i10.jpg',
			'/images/i10.jpg'
		],
		condition: 'Novo',
		description: 'Toyota Corolla 2024 em perfeito estado de conservação. Veículo completo, com todos os opcionais de fábrica. Ideal para viagens e uso diário. Manutenção em dia e documentação regular.',
		specs: {
			km: '15.000 km',
			year: 2024,
			location: 'Luanda',
			fuel: 'Gasolina',
			transmission: 'Automática',
			passengers: '5 lugares',
			color: 'Branco Pérola',
			doors: '4 portas'
		},
		features: [
			'Ar Condicionado',
			'Direção Elétrica',
			'Vidros Elétricos',
			'Travas Elétricas',
			'Alarme',
			'Som com Bluetooth',
			'Câmera de Ré',
			'Sensor de Estacionamento',
			'Airbag Duplo',
			'Freios ABS',
			'Controle de Tração',
			'Bancos em Couro'
		],
		pricing: {
			diaria: 15000,
			semanal: 90000,
			mensal: 320000
		},
		included: [
			'Seguro contra terceiros',
			'Assistência 24h',
			'Quilometragem ilimitada',
			'Manutenção preventiva'
		],
		requirements: [
			'BI ou Passaporte válido',
			'Carta de condução válida',
			'Idade mínima 18 anos'
		]
	}

	useDocumentTitle(`${vehicle.title} - Aluguel - Caxiauto`)

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
	}

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
	}

	const handleContact = () => {
		setShowContactModal(true)
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO').format(price)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
			{/* Breadcrumb */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<nav className="flex items-center gap-2 text-sm text-gray-600">
						<Link to="/" className="hover:text-indigo-600 transition-colors">Início</Link>
						<ChevronRight className="w-4 h-4" />
						<Link to="/servicos/aluguel-de-automoveis" className="hover:text-indigo-600 transition-colors">Aluguel</Link>
						<ChevronRight className="w-4 h-4" />
						<span className="text-gray-900 font-medium">{vehicle.title}</span>
					</nav>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Coluna Principal */}
					<div className="lg:col-span-2 space-y-6">
						{/* Galeria de Imagens */}
						<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
							<div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
								<img
									src={vehicle.images[currentImageIndex]}
									alt={`${vehicle.title} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-cover transition-opacity duration-500"
								/>

								{/* Badge de Condição */}
								<div className="absolute top-4 left-4">
									<span className={`px-5 py-2.5 text-sm font-bold rounded-full shadow-xl backdrop-blur-sm ${vehicle.condition === 'Novo' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white'
										}`}>
										{vehicle.condition}
									</span>
								</div>

								{/* Navegação de Imagens */}
								<button
									onClick={prevImage}
									className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110"
									aria-label="Imagem anterior"
								>
									<ChevronLeft className="w-6 h-6 text-gray-700" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110"
									aria-label="Próxima imagem"
								>
									<ChevronRight className="w-6 h-6 text-gray-700" />
								</button>

								{/* Indicadores */}
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
									{vehicle.images.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
												}`}
											aria-label={`Ir para imagem ${index + 1}`}
										/>
									))}
								</div>
							</div>

							{/* Miniaturas */}
							<div className="p-4 flex gap-2 overflow-x-auto">
								{vehicle.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
											}`}
									>
										<img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						</div>

						{/* Título e Especificações Principais */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-6">{vehicle.title}</h1>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Gauge className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Quilometragem</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.km}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Calendar className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Ano</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.year}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Droplet className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Combustível</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.fuel}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Cog className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Transmissão</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.transmission}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Users className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Passageiros</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.passengers}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Car className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Cor</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.color}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<MapPin className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Localização</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.location}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group">
									<Car className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Portas</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.doors}</span>
								</div>
							</div>
						</div>

						{/* Descrição */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Descrição
							</h2>
							<p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
						</div>

						{/* Características e Equipamentos */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Características e Equipamentos
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{vehicle.features.map((feature, index) => (
									<div key={index} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-green-50 transition-colors group">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</div>

						{/* O que está Incluído */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								O que está incluído
							</h2>
							<div className="space-y-3">
								{vehicle.included.map((item, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group">
										<Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
										<span className="text-gray-700">{item}</span>
									</div>
								))}
							</div>
						</div>

						{/* Requisitos */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Requisitos para Aluguel
							</h2>
							<div className="space-y-3">
								{vehicle.requirements.map((req, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group">
										<CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
										<span className="text-gray-700">{req}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar - Card de Preço e Contato */}
					<div className="lg:col-span-1">
						<div className="sticky top-16 space-y-4">
							{/* Card de Preços */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h3 className="text-lg font-bold text-gray-900 mb-4">Planos de Aluguel</h3>

								<div className="space-y-3 mb-6">
									<button
										onClick={() => setSelectedPeriod('diaria')}
										className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPeriod === 'diaria'
											? 'border-indigo-600 bg-indigo-50'
											: 'border-gray-200 hover:border-indigo-300'
											}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<div className="font-semibold text-gray-900">Diária</div>
												<div className="text-xs text-gray-600 mt-1">Até 24 horas</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold text-indigo-600">
													{formatPrice(vehicle.pricing.diaria)}
												</div>
												<div className="text-xs text-gray-600">Kz/dia</div>
											</div>
										</div>
									</button>

									<button
										onClick={() => setSelectedPeriod('semanal')}
										className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPeriod === 'semanal'
											? 'border-indigo-600 bg-indigo-50'
											: 'border-gray-200 hover:border-indigo-300'
											}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<div className="font-semibold text-gray-900">Semanal</div>
												<div className="text-xs text-gray-600 mt-1">7 dias</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold text-indigo-600">
													{formatPrice(vehicle.pricing.semanal)}
												</div>
												<div className="text-xs text-gray-600">Kz/semana</div>
											</div>
										</div>
										<div className="mt-2 text-xs text-green-600 font-medium">
											Economize {formatPrice(vehicle.pricing.diaria * 7 - vehicle.pricing.semanal)} Kz
										</div>
									</button>

									<button
										onClick={() => setSelectedPeriod('mensal')}
										className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPeriod === 'mensal'
											? 'border-indigo-600 bg-indigo-50'
											: 'border-gray-200 hover:border-indigo-300'
											}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<div className="font-semibold text-gray-900">Mensal</div>
												<div className="text-xs text-gray-600 mt-1">30 dias</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold text-indigo-600">
													{formatPrice(vehicle.pricing.mensal)}
												</div>
												<div className="text-xs text-gray-600">Kz/mês</div>
											</div>
										</div>
										<div className="mt-2 text-xs text-green-600 font-medium">
											Economize {formatPrice(vehicle.pricing.diaria * 30 - vehicle.pricing.mensal)} Kz
										</div>
									</button>
								</div>

								<button
									onClick={handleContact}
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
								>
									Solicitar Aluguel
								</button>

								<div className="mt-4 pt-4 border-t border-gray-200">
									<p className="text-xs text-gray-600 text-center">
										Preços sujeitos a disponibilidade. Entre em contato para mais informações.
									</p>
								</div>
							</div>

							{/* Card de Contato */}
							<div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl shadow-xl p-6 text-white border border-indigo-400/20">
								<h3 className="text-lg font-bold mb-4">Precisa de ajuda?</h3>
								<p className="text-sm text-indigo-100 mb-4">
									Nossa equipe está pronta para atendê-lo
								</p>
								<div className="space-y-3">
									<a
										href="tel:+244923456789"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Phone className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">+244 923 456 789</div>
											<div className="text-xs text-indigo-200">Ligar agora</div>
										</div>
									</a>
									<a
										href="mailto:aluguel@caxiauto.com"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Mail className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">aluguel@caxiauto.com</div>
											<div className="text-xs text-indigo-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
							</div>

							{/* Por que alugar conosco? */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
								<h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
									<svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									Por que alugar conosco?
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Sem taxas ocultas</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Seguro incluso</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Quilometragem ilimitada</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Entrega e recolha gratuitas</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de Contato */}
			{showContactModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowContactModal(false);
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-slideUp">
						{/* Header Fixo */}
						<div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowContactModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
									Solicitar Aluguel
								</h3>
								<p className="text-indigo-100 text-xs sm:text-sm">
									Preencha os dados e entraremos em contato em breve
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={(e) => {
								e.preventDefault();
								alert('Solicitação enviada com sucesso!');
								setShowContactModal(false);
							}}
						>
							{/* Informações Pessoais */}
							<div className="space-y-4">
								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										<span className="flex items-center gap-1.5">
											Nome completo
											<span className="text-red-500 text-base">*</span>
										</span>
									</label>
									<input
										type="text"
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
										placeholder="Digite seu nome completo"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Telefone
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="tel"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												E-mail
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="email"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
											placeholder="seu@email.com"
										/>
									</div>
								</div>
							</div>

							{/* Detalhes do Aluguel */}
							<div className="pt-4 border-t border-gray-200">
								<h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
									<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
									Detalhes do aluguel
								</h4>

								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										<span className="flex items-center gap-1.5">
											Período desejado
											<span className="text-red-500 text-base">*</span>
										</span>
									</label>
									<select
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 bg-white cursor-pointer text-sm sm:text-base font-medium"
										defaultValue={selectedPeriod}
									>
										<option value="diaria">
											Diária - {formatPrice(vehicle.pricing.diaria)} Kz/dia
										</option>
										<option value="semanal">
											Semanal - {formatPrice(vehicle.pricing.semanal)} Kz
										</option>
										<option value="mensal">
											Mensal - {formatPrice(vehicle.pricing.mensal)} Kz
										</option>
									</select>
									<p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
										<Shield className="w-3.5 h-3.5" />
										Seguro e assistência 24h inclusos
									</p>
								</div>

								{/* Documentos */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												<FileText className="w-4 h-4" />
												BI ou Passaporte
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<div className="relative">
											<input
												type="file"
												required
												accept=".pdf,.jpg,.jpeg,.png"
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 bg-white cursor-pointer text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
											/>
										</div>
										<p className="mt-1.5 text-xs text-gray-500">PDF, JPG ou PNG (máx. 5MB)</p>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												<FileText className="w-4 h-4" />
												Carta de Condução
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<div className="relative">
											<input
												type="file"
												required
												accept=".pdf,.jpg,.jpeg,.png"
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-gray-400 bg-white cursor-pointer text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
											/>
										</div>
										<p className="mt-1.5 text-xs text-gray-500">PDF, JPG ou PNG (máx. 5MB)</p>
									</div>
								</div>
							</div>

							{/* Mensagem */}
							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
									Mensagem ou observações
								</label>
								<textarea
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all hover:border-gray-400 text-sm sm:text-base"
									placeholder="Conte-nos sobre suas necessidades, datas específicas ou dúvidas..."
								/>
							</div>

							{/* Botões de Ação */}
							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
								>
									<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
									Enviar Solicitação
								</button>
								<button
									type="button"
									onClick={() => setShowContactModal(false)}
									className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
