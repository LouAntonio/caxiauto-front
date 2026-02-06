import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Package,
	Star,
	ChevronLeft,
	ChevronRight,
	Phone,
	Mail,
	X,
	CheckCircle2,
	Shield,
	Truck,
	RefreshCcw,
	Award
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function DetalhesPecas() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [quantity, setQuantity] = useState(1)

	// Dados da peça (em produção, viria de uma API)
	const part = {
		id: parseInt(id) || 1,
		name: 'Filtro de Óleo Bosch',
		price: 3200,
		category: 'Motor',
		subcategory: 'Filtros',
		brand: 'Bosch',
		code: 'BOF-3200-A',
		stock: 25,
		rating: 4.7,
		reviews: 132,
		images: [
			'/images/parts.jpg',
			'/images/parts.jpg',
			'/images/parts.jpg',
			'/images/parts.jpg'
		],
		condition: 'Novo',
		warranty: '12 meses',
		description: 'Filtro de óleo original Bosch de alta qualidade, projetado para garantir máxima proteção ao motor do seu veículo. Fabricado com materiais de primeira linha, oferece excelente filtragem e durabilidade superior. Compatível com diversos modelos de veículos.',
		specifications: {
			'Marca': 'Bosch',
			'Código': 'BOF-3200-A',
			'Aplicação': 'Motor',
			'Material': 'Celulose sintética',
			'Rosca': '3/4-16 UNF',
			'Diâmetro': '76mm',
			'Altura': '88mm',
			'Garantia': '12 meses'
		},
		compatibility: [
			'Toyota Corolla 2015-2024',
			'Honda Civic 2016-2024',
			'Nissan Sentra 2014-2023',
			'Mazda 3 2014-2024'
		],
		features: [
			'Filtragem superior',
			'Maior durabilidade',
			'Fácil instalação',
			'Testado em laboratório',
			'Certificação ISO 9001',
			'Compatibilidade garantida'
		],
		badges: ['Original', 'Promoção', 'Mais Vendida']
	}

	useDocumentTitle(`${part.name} - Peças - Caxiauto`)

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % part.images.length)
	}

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + part.images.length) % part.images.length)
	}

	const handleContact = () => {
		setShowContactModal(true)
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO').format(price)
	}

	const handleQuantityChange = (delta) => {
		const newQuantity = quantity + delta
		if (newQuantity >= 1 && newQuantity <= part.stock) {
			setQuantity(newQuantity)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
			{/* Breadcrumb */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<nav className="flex items-center gap-2 text-sm text-gray-600">
						<Link to="/" className="hover:text-indigo-600 transition-colors">Início</Link>
						<ChevronRight className="w-4 h-4" />
						<Link to="/stand/pecas-acessorios" className="hover:text-indigo-600 transition-colors">Peças e Acessórios</Link>
						<ChevronRight className="w-4 h-4" />
						<span className="text-gray-900 font-medium">{part.name}</span>
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
									src={part.images[currentImageIndex]}
									alt={`${part.name} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-contain p-8 transition-opacity duration-500"
								/>

								{/* Badges */}
								<div className="absolute top-4 left-4 flex gap-2 flex-wrap">
									{part.badges.map((badge, index) => (
										<span
											key={index}
											className={`px-4 py-2 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
												badge === 'Original' ? 'bg-blue-600 text-white' :
												badge === 'Promoção' ? 'bg-red-600 text-white' :
												'bg-green-600 text-white'
											}`}
										>
											{badge}
										</span>
									))}
								</div>

								{/* Navegação de Imagens */}
								{part.images.length > 1 && (
									<>
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
											{part.images.map((_, index) => (
												<button
													key={index}
													onClick={() => setCurrentImageIndex(index)}
													className={`w-2 h-2 rounded-full transition-all ${
														index === currentImageIndex ? 'bg-indigo-600 w-8' : 'bg-gray-400'
													}`}
													aria-label={`Ir para imagem ${index + 1}`}
												/>
											))}
										</div>
									</>
								)}
							</div>

							{/* Miniaturas */}
							<div className="p-4 flex gap-2 overflow-x-auto">
								{part.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
											index === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
										}`}
									>
										<img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-contain p-2" />
									</button>
								))}
							</div>
						</div>

						{/* Informações Principais */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-2">
										{part.name}
									</h1>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<span className="font-medium">{part.brand}</span>
										<span>•</span>
										<span>Código: {part.code}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
									<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
									<span className="font-bold text-gray-900">{part.rating}</span>
									<span className="text-sm text-gray-600">({part.reviews})</span>
								</div>
							</div>

							{/* Especificações Rápidas */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<Package className="w-6 h-6 text-indigo-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Categoria</span>
									<span className="font-semibold text-gray-900 text-sm text-center">{part.category}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Condição</span>
									<span className="font-semibold text-gray-900 text-sm">{part.condition}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<Shield className="w-6 h-6 text-indigo-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Garantia</span>
									<span className="font-semibold text-gray-900 text-sm">{part.warranty}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<Package className="w-6 h-6 text-green-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Em Estoque</span>
									<span className="font-semibold text-gray-900 text-sm">{part.stock} unidades</span>
								</div>
							</div>
						</div>

						{/* Descrição */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Descrição
							</h2>
							<p className="text-gray-700 leading-relaxed">{part.description}</p>
						</div>

						{/* Especificações Técnicas */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Especificações Técnicas
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(part.specifications).map(([key, value]) => (
									<div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors">
										<span className="font-medium text-gray-700">{key}:</span>
										<span className="text-gray-900">{value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Características */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Características
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{part.features.map((feature, index) => (
									<div key={index} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-green-50 transition-colors group">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</div>

						{/* Compatibilidade */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Veículos Compatíveis
							</h2>
							<div className="space-y-2">
								{part.compatibility.map((vehicle, index) => (
									<div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors">
										<CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
										<span className="text-gray-700">{vehicle}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar - Compra */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							{/* Card de Preço */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h3 className="text-lg font-bold text-gray-900 mb-2">Preço</h3>

								<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
									<div className="text-3xl font-bold text-indigo-600 mb-1">
										{formatPrice(part.price)}
									</div>
									<div className="text-sm text-gray-600">Kz por unidade</div>
								</div>

								{/* Quantidade */}
								<div className="mb-6">
									<label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() => handleQuantityChange(-1)}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
											disabled={quantity <= 1}
										>
											-
										</button>
										<input
											type="number"
											value={quantity}
											onChange={(e) => {
												const val = parseInt(e.target.value) || 1
												if (val >= 1 && val <= part.stock) setQuantity(val)
											}}
											className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 outline-none"
										/>
										<button
											onClick={() => handleQuantityChange(1)}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
											disabled={quantity >= part.stock}
										>
											+
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-2">{part.stock} unidades disponíveis</p>
								</div>

								{/* Preço Total */}
								<div className="bg-gray-50 rounded-xl p-4 mb-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-700 font-medium">Total:</span>
										<span className="text-2xl font-bold text-indigo-600">
											{formatPrice(part.price * quantity)} Kz
										</span>
									</div>
								</div>

								<button
									onClick={handleContact}
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] mb-3"
								>
									Solicitar Compra
								</button>

								<button
									onClick={handleContact}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
								>
									Consultar Disponibilidade
								</button>
							</div>

							{/* Benefícios */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg">
								<h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
									<Award className="w-5 h-5 text-indigo-600" />
									Vantagens
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Entrega rápida em Luanda</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Garantia de {part.warranty}</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<RefreshCcw className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Troca facilitada</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Peças originais certificadas</span>
									</li>
								</ul>
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
										href="mailto:pecas@caxiauto.com"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Mail className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">pecas@caxiauto.com</div>
											<div className="text-xs text-indigo-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
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
							setShowContactModal(false)
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
						{/* Header */}
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
									Solicitar Peça
								</h3>
								<p className="text-indigo-100 text-xs sm:text-sm">
									Preencha os dados e entraremos em contato
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={(e) => {
								e.preventDefault()
								alert('Solicitação enviada com sucesso!')
								setShowContactModal(false)
							}}
						>
							{/* Resumo do Pedido */}
							<div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
								<h4 className="font-bold text-indigo-900 mb-2">{part.name}</h4>
								<div className="flex justify-between text-sm text-indigo-700">
									<span>Quantidade: {quantity}</span>
									<span className="font-bold">{formatPrice(part.price * quantity)} Kz</span>
								</div>
							</div>

							{/* Informações Pessoais */}
							<div className="space-y-4">
								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										Nome completo <span className="text-red-500 ml-1">*</span>
									</label>
									<input
										type="text"
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
										placeholder="Digite seu nome completo"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											Telefone <span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="tel"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											E-mail <span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="email"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
											placeholder="seu@email.com"
										/>
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
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400 text-sm sm:text-base"
									placeholder="Informações adicionais sobre sua solicitação..."
								/>
							</div>

							{/* Botões */}
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
