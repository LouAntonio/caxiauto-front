import React, { useState, useEffect } from 'react'
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
	Award,
	Loader,
	AlertCircle,
	Heart
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { getImageUrl, notyf } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function DetalhesPecas() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuth()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
	const [quantity, setQuantity] = useState(1)
	const [requestedQuantity, setRequestedQuantity] = useState(1)
	const [part, setPart] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)
	const [loadingFavorite, setLoadingFavorite] = useState(false)

	// Função para formatar dados da API para o formato do componente
	const formatPartData = (apiData) => {
		const pecaData = apiData.data

		// Formar lista de imagens
		let images = []
		if (pecaData.image) {
			images.push(getImageUrl(pecaData.image, '/images/parts.jpg'))
		}
		if (pecaData.gallery && pecaData.gallery.length > 0) {
			images = [
				...images,
				...pecaData.gallery.map(img => getImageUrl(img, '/images/parts.jpg'))
			]
		}
		if (images.length === 0) {
			images = ['/images/parts.jpg']
		}

		// Mapear especificações (se existirem)
		const specs = pecaData.spechs || {}
		const specifications = {
			'Categoria': pecaData.categoria?.nome || 'N/A',
			'Condição': pecaData.condition === 'new' ? 'Novo' : 'Usado',
			'Stock': `${pecaData.stock || 0} unidades`,
			...specs
		}

		// Mapear características
		const features = Array.isArray(pecaData.characteristics)
			? pecaData.characteristics
			: pecaData.characteristics
				? [pecaData.characteristics]
				: ['Peça de qualidade', 'Garantia de funcionamento']

		// Definir badges baseados nos dados
		const badges = []
		if (pecaData.condition === 'new') badges.push('Novo')
		if (pecaData.featured) badges.push('Destaque')
		if (pecaData.stock && pecaData.stock > 0) badges.push('Em Stock')
		if (badges.length === 0) badges.push('Disponível')

		return {
			id: pecaData._id,
			name: pecaData.nome?.charAt(0).toUpperCase() + pecaData.nome?.slice(1) || 'Peça sem nome',
			price: pecaData.price || 0,
			category: pecaData.categoria?.nome || 'Não categorizada',
			subcategory: pecaData.categoria?.descricao || '',
			brand: specs.marca || specs.Marca || 'Marca não informada',
			code: specs.codigo || specs.Código || pecaData._id?.slice(-8) || 'N/A',
			stock: pecaData.stock || 0,
			images,
			condition: pecaData.condition === 'new' ? 'Novo' : 'Usado',
			description: pecaData.descricao || 'Peça de alta qualidade para o seu veículo.',
			specifications,
			features,
			badges
		}
	}

	// Buscar dados da peça na API
	useEffect(() => {
		const fetchPart = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await api.getPeca(id)

				if (response.success && response.data) {
					const formattedPart = formatPartData(response)
					setPart(formattedPart)
				} else {
					setError('Peça não encontrada')
				}
			} catch (err) {
				console.error('Erro ao buscar peça:', err)
				setError('Erro ao carregar os dados da peça')
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchPart()
		}
	}, [id])

	// Buscar status de favorito
	useEffect(() => {
		const checkFavorite = async () => {
			if (!isAuthenticated || !id) {
				setIsFavorite(false)
				return
			}

			try {
				const response = await api.getFavorites()
				if (response.success && response.data) {
					const favoriteIds = response.data
						.filter(fav => fav.itemType === 'part')
						.map(fav => fav.itemId)
					setIsFavorite(favoriteIds.includes(id))
				}
			} catch (error) {
				console.error('Erro ao verificar favorito:', error)
			}
		}

		checkFavorite()
	}, [id, isAuthenticated])

	useDocumentTitle(part ? `${part.name} - Peças - Caxiauto` : 'Carregando peça - Caxiauto')

	const nextImage = () => {
		if (!part || !part.images) return
		setCurrentImageIndex((prev) => (prev + 1) % part.images.length)
	}

	const prevImage = () => {
		if (!part || !part.images) return
		setCurrentImageIndex((prev) => (prev - 1 + part.images.length) % part.images.length)
	}

	const handleContact = () => {
		setShowContactModal(true)
	}

	const handleAvailability = () => {
		setShowAvailabilityModal(true)
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO').format(price)
	}

	const handleQuantityChange = (delta) => {
		if (!part) return
		const newQuantity = quantity + delta
		if (newQuantity >= 1 && newQuantity <= part.stock) {
			setQuantity(newQuantity)
		}
	}

	// Função para adicionar/remover favorito
	const toggleFavorite = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos')
			return
		}

		if (loadingFavorite) return

		setLoadingFavorite(true)

		try {
			if (isFavorite) {
				const response = await api.removeFavorite(id)
				if (response.success) {
					setIsFavorite(false)
					notyf.success('Removido dos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao remover favorito')
				}
			} else {
				const response = await api.addFavorite(id, 'part')
				if (response.success) {
					setIsFavorite(true)
					notyf.success('Adicionado aos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao adicionar favorito')
				}
			}
		} catch (error) {
			console.error('Erro ao alternar favorito:', error)
			notyf.error('Erro ao processar favorito')
		} finally {
			setLoadingFavorite(false)
		}
	}

	// Estado de carregamento
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
				<div className="text-center">
					<Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-700 mb-2">Carregando detalhes da peça...</h2>
					<p className="text-gray-500">Por favor, aguarde um momento.</p>
				</div>
			</div>
		)
	}

	// Estado de erro
	if (error || !part) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						{error || 'Peça não encontrada'}
					</h2>
					<p className="text-gray-600 mb-6">
						A peça que você está procurando não foi encontrada ou ocorreu um erro ao carregá-la.
					</p>
					<div className="flex gap-4 justify-center">
						<button
							onClick={() => navigate(-1)}
							className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Voltar
						</button>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
						>
							Tentar Novamente
						</button>
					</div>
				</div>
			</div>
		)
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
						<span className="text-gray-900 font-medium">{part?.name || 'Peça'}</span>
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
									src={part.images?.[currentImageIndex] || '/images/parts.jpg'}
									alt={`${part?.name || 'Peça'} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-contain p-8 transition-opacity duration-500"
								/>

								{/* Badges */}
								<div className="absolute top-4 left-4 flex gap-2 flex-wrap">
									{part?.badges?.map((badge, index) => (
										<span
											key={index}
											className={`px-4 py-2 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${badge === 'Original' ? 'bg-blue-600 text-white' :
												badge === 'Promoção' ? 'bg-red-600 text-white' :
													'bg-green-600 text-white'
												}`}
										>
											{badge}
										</span>
									))}
								</div>

								{/* Botão de favorito */}
								{isAuthenticated && (
									<button
										onClick={toggleFavorite}
										className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
										aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
										disabled={loadingFavorite}
									>
										<Heart
											className={`w-6 h-6 transition-all duration-200 ${isFavorite
													? 'fill-red-500 text-red-500'
													: 'text-gray-600 hover:text-red-500'
												} ${loadingFavorite ? 'opacity-50' : ''}`}
										/>
									</button>
								)}

								{/* Navegação de Imagens */}
								{part?.images && part.images.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
											aria-label="Imagem anterior"
										>
											<ChevronLeft className="w-6 h-6 text-gray-700" />
										</button>
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
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
													className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentImageIndex ? 'bg-indigo-600 w-8' : 'bg-gray-400'
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
								{part?.images?.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${index === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
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
								</div>
							</div>

							{/* Especificações Rápidas */}
							<div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6">
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
							<p className="text-gray-700 leading-relaxed">{part?.description || 'Descrição não disponível.'}</p>
						</div>

						{/* Especificações Técnicas */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								Especificações Técnicas
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{part?.specifications && Object.entries(part.specifications).map(([key, value]) => (
									<div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
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
								{part?.features?.map((feature, index) => (
									<div key={index} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-green-50 transition-colors group cursor-pointer">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span className="text-sm">{feature}</span>
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
									<div className="text-sm text-gray-600">akz por unidade</div>
								</div>

								{/* Quantidade */}
								<div className="mb-6">
									<label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() => handleQuantityChange(-1)}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											disabled={quantity <= 1}
										>
											-
										</button>
										<input
											type="number"
											value={quantity}
											onChange={(e) => {
												const val = parseInt(e.target.value) || 1
												if (val >= 1 && val <= (part?.stock || 0)) setQuantity(val)
											}}
											className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 outline-none "
										/>
										<button
											onClick={() => handleQuantityChange(1)}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											disabled={quantity >= (part?.stock || 0)}
										>
											+
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-2">{part?.stock || 0} unidades disponíveis</p>
								</div>
								<div className="bg-gray-50 rounded-xl p-4 mb-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-700 font-medium">Total:</span>
										<span className="text-2xl font-bold text-indigo-600">
											{formatPrice((part?.price || 0) * quantity)} akz
										</span>
									</div>
								</div>

								<button
									onClick={handleContact}
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] mb-3 cursor-pointer"
								>
									Solicitar Compra
								</button>

								<button
									onClick={handleAvailability}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
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
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
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
									<span className="font-bold">{formatPrice(part.price * quantity)} akz</span>
								</div>
							</div>

							{/* Informações Pessoais */}
							{!user && (
								<div className="space-y-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											Nome completo <span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
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
							)}

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
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
								>
									<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
									Enviar Solicitação
								</button>
								<button
									type="button"
									onClick={() => setShowContactModal(false)}
									className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal de Consulta de Disponibilidade */}
			{showAvailabilityModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowAvailabilityModal(false)
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
						{/* Header */}
						<div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowAvailabilityModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
									Consultar Disponibilidade
								</h3>
								<p className="text-green-100 text-xs sm:text-sm">
									Solicite a quantidade desejada mesmo que não esteja em stock
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={(e) => {
								e.preventDefault()
								alert('Consulta enviada com sucesso! Entraremos em contato em breve.')
								setShowAvailabilityModal(false)
							}}
						>
							{/* Informação da Peça */}
							<div className="bg-green-50 rounded-xl p-4 border border-green-200">
								<h4 className="font-bold text-green-900 mb-2">{part.name}</h4>
								<div className="space-y-1 text-sm text-green-700">
									<div className="flex justify-between">
										<span>Stock atual:</span>
										<span className="font-semibold">{part.stock} unidades</span>
									</div>
									<div className="flex justify-between">
										<span>Preço unitário:</span>
										<span className="font-semibold">{formatPrice(part.price)} akz</span>
									</div>
								</div>
							</div>

							{/* Quantidade Desejada */}
							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
									<span className="flex items-center gap-1.5">
										Quantidade desejada
										<span className="text-red-500 text-base">*</span>
									</span>
								</label>
								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
										className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
									>
										-
									</button>
									<input
										type="number"
										value={requestedQuantity}
										onChange={(e) => {
											const val = parseInt(e.target.value) || 1
											if (val >= 1) setRequestedQuantity(val)
										}}
										min="1"
										required
										className="flex-1 text-center border-2 border-gray-300 rounded-lg py-2.5 outline-none focus:border-green-500 font-semibold text-lg"
									/>
									<button
										type="button"
										onClick={() => setRequestedQuantity(requestedQuantity + 1)}
										className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
									>
										+
									</button>
								</div>
								{requestedQuantity > part.stock && (
									<p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
										<AlertCircle className="w-3.5 h-3.5" />
										Quantidade solicitada excede o stock atual. Verificaremos a disponibilidade.
									</p>
								)}
								<div className="bg-gray-50 rounded-lg p-3 mt-3">
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Valor total estimado:</span>
										<span className="text-lg font-bold text-green-600">
											{formatPrice(part.price * requestedQuantity)} akz
										</span>
									</div>
								</div>
							</div>

							{/* Informações Pessoais */}
							{!user && (
								<div className="space-y-4 pt-4 border-t border-gray-200">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											Nome completo <span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Prazo Desejado */}
							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
									Prazo desejado para recebimento
								</label>
								<select
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 bg-white cursor-pointer text-sm sm:text-base"
								>
									<option value="">Selecione um prazo</option>
									<option value="urgente">Urgente (até 3 dias)</option>
									<option value="semana">1 semana</option>
									<option value="quinzena">15 dias</option>
									<option value="mes">1 mês</option>
									<option value="flexivel">Prazo flexível</option>
								</select>
							</div>

							{/* Mensagem */}
							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
									Observações ou informações adicionais
								</label>
								<textarea
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
									placeholder="Ex: Necessito desta peça para um projeto específico, gostaria de saber sobre desconto para quantidade, etc."
								/>
							</div>

							{/* Informação Adicional */}
							<div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
								<div className="flex items-start gap-3">
									<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<div className="text-sm text-blue-900">
										<p className="font-semibold mb-1">Como funciona?</p>
										<p className="text-blue-700">
											Após enviar sua consulta, nossa equipe verificará a disponibilidade da quantidade solicitada e entrará em contato para confirmar prazos e valores.
										</p>
									</div>
								</div>
							</div>

							{/* Botões */}
							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
								>
									<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
									Enviar Consulta
								</button>
								<button
									type="button"
									onClick={() => setShowAvailabilityModal(false)}
									className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
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
