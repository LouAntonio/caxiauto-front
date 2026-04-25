import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Package,
	MapPin,
	ChevronLeft,
	ChevronRight,
	Phone,
	Mail,
	X,
	CheckCircle2,
	Shield,
	Calendar,
	User,
	Loader2,
	AlertCircle,
	Heart,
	Tag,
	ExternalLink
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { getImageUrl, notyf } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { PecaDetailSkeleton } from '../../components/skeletons'

export default function DetalhesPecas() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuth()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
	const [requestedQuantity, setRequestedQuantity] = useState(1)
	const [peca, setPeca] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)
	const [loadingFavorite, setLoadingFavorite] = useState(false)

	// Estados dos formulários
	const [partPurchaseFormData, setPartPurchaseFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		mensagem: ''
	})
	const [partPurchaseLoading, setPartPurchaseLoading] = useState(false)

	const [availabilityFormData, setAvailabilityFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		mensagem: ''
	})
	const [availabilityLoading, setAvailabilityLoading] = useState(false)

	const getAuthContactData = () => ({
		nome: (user?.name || '').trim(),
		email: (user?.email || '').trim(),
		telefone: (user?.phone || '').trim()
	})

	const mergeRequiredContactFields = (formData) => {
		const authContactData = getAuthContactData()
		return {
			nome: (formData.nome || authContactData.nome || '').trim(),
			email: (formData.email || authContactData.email || '').trim(),
			telefone: (formData.telefone || authContactData.telefone || '').trim()
		}
	}

	const hasMissingRequiredContact = (contactData) => {
		return !contactData.nome || !contactData.email || !contactData.telefone
	}

	const conditionLabels = {
		'NEW': 'Novo',
		'USED': 'Usado',
		'REFURBISHED': 'Recondicionado'
	}

	const statusLabels = {
		'ACTIVE': 'Disponível',
		'SOLD': 'Vendido',
		'PENDING': 'Pendente',
		'HIDDEN': 'Oculto'
	}

	// Buscar dados da peça
	useEffect(() => {
		if (!isAuthenticated) {
			return
		}

		const authContactData = getAuthContactData()

		setPartPurchaseFormData((previous) => ({
			...previous,
			nome: previous.nome?.trim() ? previous.nome : authContactData.nome,
			email: previous.email?.trim() ? previous.email : authContactData.email,
			telefone: previous.telefone?.trim() ? previous.telefone : authContactData.telefone
		}))

		setAvailabilityFormData((previous) => ({
			...previous,
			nome: previous.nome?.trim() ? previous.nome : authContactData.nome,
			email: previous.email?.trim() ? previous.email : authContactData.email,
			telefone: previous.telefone?.trim() ? previous.telefone : authContactData.telefone
		}))
	}, [isAuthenticated, user?.name, user?.email, user?.phone])

	useEffect(() => {
		const fetchPeca = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await api.getPeca(id)

				if (response.success && response.data) {
					setPeca(response.data)

					// Registrar visualização
					try {
						await api.addView('part', id)
					} catch (viewError) {
						console.error('Erro ao registrar visualização:', viewError)
					}
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
			fetchPeca()
		}
	}, [id])

	// Verificar se está nos favoritos (wishlist)
	useEffect(() => {
		const checkFavorite = async () => {
			if (!isAuthenticated || !id) {
				setIsFavorite(false)
				return
			}

			try {
				const response = await api.checkIfInWishlist('peca', id)
				if (response.success) {
					setIsFavorite(response.data || false)
				}
			} catch (error) {
				console.error('Erro ao verificar favorito:', error)
			}
		}

		checkFavorite()
	}, [id, isAuthenticated])

	useDocumentTitle(peca ? `${peca.name} - Peças - Caxiauto` : 'Carregando peça - Caxiauto')

	// Obter todas as imagens (image principal + gallery)
	const getAllImages = () => {
		if (!peca) return []
		const images = []
		if (peca.image) images.push(peca.image)
		if (peca.gallery && peca.gallery.length > 0) {
			images.push(...peca.gallery)
		}
		return images.length > 0 ? images : ['/images/parts.jpg']
	}

	const nextImage = () => {
		const images = getAllImages()
		setCurrentImageIndex((prev) => (prev + 1) % images.length)
	}

	const prevImage = () => {
		const images = getAllImages()
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO').format(Number(price))
	}

	const formatDate = (dateStr) => {
		if (!dateStr) return 'N/A'
		return new Date(dateStr).toLocaleDateString('pt-AO', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		})
	}

	const formatProvincia = (provincia) => {
		return provincia ? provincia.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''
	}

	// Toggle favorito (wishlist)
	const toggleFavorite = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar aos favoritos')
			return
		}

		if (loadingFavorite) return

		setLoadingFavorite(true)

		try {
			if (isFavorite) {
				const response = await api.removePecaFromWishlist(id)
				if (response.success) {
					setIsFavorite(false)
					notyf.success('Removido dos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao remover favorito')
				}
			} else {
				const response = await api.addPecaToWishlist(id)
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

	// Handlers dos formulários
	const handlePartPurchaseSubmit = async (e) => {
		e.preventDefault()
		const contactData = mergeRequiredContactFields(partPurchaseFormData)
		if (hasMissingRequiredContact(contactData)) {
			notyf.error('Complete nome, e-mail e telefone para continuar.')
			return
		}

		setPartPurchaseLoading(true)
		try {
			const response = await api.contactPartPurchase({
				pecaId: id,
				quantidade: requestedQuantity,
				...partPurchaseFormData,
				...contactData
			})
			if (response.success) {
				notyf.success(response.msg || 'Pedido de compra enviado com sucesso!')
				setShowContactModal(false)
				setPartPurchaseFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					mensagem: ''
				})
			} else {
				notyf.error(response.msg || 'Erro ao enviar pedido de compra')
			}
		} catch (error) {
			console.error('Erro ao enviar pedido de compra:', error)
			notyf.error('Erro ao enviar pedido de compra')
		} finally {
			setPartPurchaseLoading(false)
		}
	}

	const handleAvailabilitySubmit = async (e) => {
		e.preventDefault()
		const contactData = mergeRequiredContactFields(availabilityFormData)
		if (hasMissingRequiredContact(contactData)) {
			notyf.error('Complete nome, e-mail e telefone para continuar.')
			return
		}

		setAvailabilityLoading(true)
		try {
			const response = await api.contactPartPurchase({
				pecaId: id,
				quantidade: requestedQuantity,
				...availabilityFormData,
				...contactData,
				mensagem: `[Consulta Disponibilidade] ${availabilityFormData.mensagem || ''}`
			})
			if (response.success) {
				notyf.success(response.msg || 'Consulta enviada com sucesso!')
				setShowAvailabilityModal(false)
				setAvailabilityFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					mensagem: ''
				})
			} else {
				notyf.error(response.msg || 'Erro ao enviar consulta')
			}
		} catch (error) {
			console.error('Erro ao enviar consulta:', error)
			notyf.error('Erro ao enviar consulta')
		} finally {
			setAvailabilityLoading(false)
		}
	}

	// Estado de carregamento
	if (loading) {
		return <PecaDetailSkeleton />
	}

	// Estado de erro
	if (error || !peca) {
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

	const allImages = getAllImages()

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
						<span className="text-gray-900 font-medium">{peca.name}</span>
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
									src={getImageUrl(allImages[currentImageIndex])}
									alt={`${peca.name} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-contain p-8 transition-opacity duration-500"
								/>

								{/* Badges */}
								<div className="absolute top-4 left-4 flex gap-2 flex-wrap">
									{peca.condition === 'NEW' && (
										<span className="px-4 py-2 text-xs font-bold rounded-full shadow-lg bg-green-600 text-white">Novo</span>
									)}
									{peca.condition === 'USED' && (
										<span className="px-4 py-2 text-xs font-bold rounded-full shadow-lg bg-blue-600 text-white">Usado</span>
									)}
									{peca.condition === 'REFURBISHED' && (
										<span className="px-4 py-2 text-xs font-bold rounded-full shadow-lg bg-purple-600 text-white">Recondicionado</span>
									)}
									{peca.isFeatured && (
										<span className="px-4 py-2 text-xs font-bold rounded-full shadow-lg bg-yellow-500 text-gray-900">Destaque</span>
									)}
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
											className={`w-6 h-6 transition-all duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} ${loadingFavorite ? 'opacity-50' : ''}`}
										/>
									</button>
								)}

								{/* Navegação de Imagens */}
								{allImages.length > 1 && (
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
											{allImages.map((_, index) => (
												<button
													key={index}
													onClick={() => setCurrentImageIndex(index)}
													className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentImageIndex ? 'bg-indigo-600 w-8' : 'bg-gray-400'}`}
													aria-label={`Ir para imagem ${index + 1}`}
												/>
											))}
										</div>
									</>
								)}
							</div>

							{/* Miniaturas */}
							{allImages.length > 1 && (
								<div className="p-4 flex gap-2 overflow-x-auto">
									{allImages.map((image, index) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${index === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}
										>
											<img src={getImageUrl(image)} alt={`Miniatura ${index + 1}`} className="w-full h-full object-contain p-2" />
										</button>
									))}
								</div>
							)}
						</div>

						{/* Informações Principais */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<div className="mb-4">
								<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-2">
									{peca.name}
								</h1>
								<p className="text-gray-600 flex items-center gap-2">
									<Package className="w-4 h-4" />
									{peca.Categoria?.name || 'Sem categoria'}
								</p>
							</div>

							{/* Especificações Rápidas */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<Shield className="w-6 h-6 text-indigo-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Condição</span>
									<span className="font-semibold text-gray-900 text-sm">{conditionLabels[peca.condition] || peca.condition}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<MapPin className="w-6 h-6 text-green-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Província</span>
									<span className="font-semibold text-gray-900 text-sm text-center">{formatProvincia(peca.provincia)}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<Calendar className="w-6 h-6 text-blue-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Publicado</span>
									<span className="font-semibold text-gray-900 text-sm text-center">{formatDate(peca.createdAt)}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
									<CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
									<span className="text-xs text-gray-600 mb-1">Estado</span>
									<span className="font-semibold text-gray-900 text-sm">{statusLabels[peca.status] || peca.status}</span>
								</div>
							</div>
						</div>

						{/* Compatibilidade */}
						{peca.compatibility && peca.compatibility.length > 0 && (
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
									<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
									Compatibilidade
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{peca.compatibility.map((item, index) => (
										<div key={index} className="flex items-center gap-2 text-gray-700 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors group">
											<Tag className="w-5 h-5 text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="text-sm font-medium">{item}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Vendedor */}
						{peca.Seller && (
							<div className="hidden bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
									<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
									Vendedor
								</h2>
								<div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl">
									<div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
										<User className="w-7 h-7 text-indigo-600" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className="font-bold text-gray-900 text-lg">
												{peca.Seller.name} {peca.Seller.surname}
											</h3>
											{peca.Seller.isVerified && (
												<Shield className="w-5 h-5 text-blue-500" />
											)}
										</div>
										<p className="text-sm text-gray-600">
											{peca.Seller.isVerified ? 'Vendedor Verificado' : 'Vendedor'}
										</p>
									</div>
									<Link
										to={`/vendedor/${peca.Seller.id}`}
										className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
									>
										Ver perfil
										<ExternalLink className="w-4 h-4" />
									</Link>
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							{/* Card de Preço */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h3 className="text-lg font-bold text-gray-900 mb-2">Preço</h3>

								<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
									<div className="text-3xl font-bold text-indigo-600 mb-1">
										{formatPrice(peca.price)}
									</div>
									<div className="text-sm text-gray-600">kz</div>
								</div>

								{/* Quantidade */}
								<div className="mb-6">
									<label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											disabled={requestedQuantity <= 1}
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
											className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 outline-none"
										/>
										<button
											onClick={() => setRequestedQuantity(requestedQuantity + 1)}
											className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
										>
											+
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-2">Consultar disponibilidade para a quantidade desejada</p>
								</div>

								<div className="bg-gray-50 rounded-xl p-4 mb-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-700 font-medium">Total estimado:</span>
										<span className="text-2xl font-bold text-indigo-600">
											{formatPrice(peca.price * requestedQuantity)} kz
										</span>
									</div>
								</div>

								<button
									onClick={() => setShowContactModal(true)}
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] mb-3 cursor-pointer"
								>
									Solicitar Compra
								</button>

								<button
									onClick={() => setShowAvailabilityModal(true)}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
								>
									Consultar Disponibilidade
								</button>
							</div>

							{/* Informações Rápidas */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h3 className="text-lg font-bold text-gray-900 mb-4">Informações</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center py-2 border-b border-gray-100">
										<span className="text-gray-600 text-sm">Categoria</span>
										<span className="font-medium text-gray-900 text-sm">{peca.Categoria?.name || 'N/A'}</span>
									</div>
									<div className="flex justify-between items-center py-2 border-b border-gray-100">
										<span className="text-gray-600 text-sm">Condição</span>
										<span className="font-medium text-gray-900 text-sm">{conditionLabels[peca.condition] || 'N/A'}</span>
									</div>
									<div className="flex justify-between items-center py-2 border-b border-gray-100">
										<span className="text-gray-600 text-sm">Província</span>
										<span className="font-medium text-gray-900 text-sm">{formatProvincia(peca.provincia)}</span>
									</div>
									<div className="flex justify-between items-center py-2">
										<span className="text-gray-600 text-sm">Publicado em</span>
										<span className="font-medium text-gray-900 text-sm">{formatDate(peca.createdAt)}</span>
									</div>
								</div>
							</div>

							{/* Benefícios */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg">
								<h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
									<Shield className="w-5 h-5 text-indigo-600" />
									Compra Segura
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Peças verificadas</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Contacto direto com vendedor</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Garantia de conformidade</span>
									</li>
								</ul>
							</div>

							{/* Card de Contato */}
							<div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl shadow-xl p-6 text-white border border-indigo-400/20">
								<h3 className="text-lg font-bold mb-4">Precisa de ajuda?</h3>
								<p className="text-sm text-indigo-100 mb-4">Nossa equipe está pronta para ajudá-lo</p>
								<div className="space-y-3">
									<a href="tel:+244930723503" className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
										<Phone className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">+244 930 723 503</div>
											<div className="text-xs text-indigo-200">Ligar agora</div>
										</div>
									</a>
									<a href="mailto:info@caxiauto.com" className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
										<Mail className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">info@caxiauto.com</div>
											<div className="text-xs text-indigo-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de Contato / Solicitar Compra */}
			{showContactModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => { if (e.target === e.currentTarget) setShowContactModal(false) }}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
						<div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowContactModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>
							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Solicitar Peça</h3>
								<p className="text-indigo-100 text-xs sm:text-sm">Preencha os dados e entraremos em contato</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handlePartPurchaseSubmit}
						>
							<div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
								<h4 className="font-bold text-indigo-900 mb-2">{peca.name}</h4>
								<div className="flex justify-between text-sm text-indigo-700">
									<span>{conditionLabels[peca.condition]}</span>
									<span className="font-bold">{formatPrice(peca.price)} kz</span>
								</div>
							</div>

							{!isAuthenticated && (
								<div className="space-y-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											Nome completo <span className="text-red-500 ml-1">*</span>
										</label>
										<input type="text" name="nome" value={partPurchaseFormData.nome} onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, nome: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base" placeholder="Digite seu nome completo" />
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
												Telefone <span className="text-red-500 ml-1">*</span>
											</label>
											<input type="tel" name="telefone" value={partPurchaseFormData.telefone} onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, telefone: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base" placeholder="+244 9XX XXX XXX" />
										</div>
										<div>
											<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
												E-mail <span className="text-red-500 ml-1">*</span>
											</label>
											<input type="email" name="email" value={partPurchaseFormData.email} onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, email: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base" placeholder="seu@email.com" />
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">Mensagem ou observações</label>
								<textarea name="mensagem" value={partPurchaseFormData.mensagem} onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, mensagem: e.target.value })} rows="3" className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400 text-sm sm:text-base" placeholder="Informações adicionais sobre sua solicitação..." />
							</div>

							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button type="submit" disabled={partPurchaseLoading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
									{partPurchaseLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Mail className="w-4 h-4 sm:w-5 sm:h-5" /> Enviar Solicitação
										</>
									)}
								</button>
								<button type="button" onClick={() => setShowContactModal(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer">Cancelar</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal de Consulta de Disponibilidade */}
			{showAvailabilityModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => { if (e.target === e.currentTarget) setShowAvailabilityModal(false) }}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
						<div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowAvailabilityModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>
							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Consultar Disponibilidade</h3>
								<p className="text-green-100 text-xs sm:text-sm">Entre em contato para verificar disponibilidade</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handleAvailabilitySubmit}
						>
							<div className="bg-green-50 rounded-xl p-4 border border-green-200">
								<h4 className="font-bold text-green-900 mb-2">{peca.name}</h4>
								<div className="space-y-1 text-sm text-green-700">
									<div className="flex justify-between"><span>Preço:</span><span className="font-semibold">{formatPrice(peca.price)} kz</span></div>
									<div className="flex justify-between"><span>Província:</span><span className="font-semibold">{formatProvincia(peca.provincia)}</span></div>
								</div>
							</div>

							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">Quantidade desejada</label>
								<div className="flex items-center gap-3">
									<button type="button" onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">-</button>
									<input type="number" value={requestedQuantity} onChange={(e) => { const val = parseInt(e.target.value) || 1; if (val >= 1) setRequestedQuantity(val) }} min="1" className="flex-1 text-center border-2 border-gray-300 rounded-lg py-2.5 outline-none focus:border-green-500 font-semibold text-lg" />
									<button type="button" onClick={() => setRequestedQuantity(requestedQuantity + 1)} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">+</button>
								</div>
								<div className="bg-gray-50 rounded-lg p-3 mt-3">
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Valor total estimado:</span>
										<span className="text-lg font-bold text-green-600">{formatPrice(peca.price * requestedQuantity)} kz</span>
									</div>
								</div>
							</div>

							{!isAuthenticated && (
								<div className="space-y-4 pt-4 border-t border-gray-200">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											Nome completo <span className="text-red-500 ml-1">*</span>
										</label>
										<input type="text" name="nome" value={availabilityFormData.nome} onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, nome: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base" placeholder="Digite seu nome completo" />
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
												Telefone <span className="text-red-500 ml-1">*</span>
											</label>
											<input type="tel" name="telefone" value={availabilityFormData.telefone} onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, telefone: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base" placeholder="+244 9XX XXX XXX" />
										</div>
										<div>
											<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
												E-mail <span className="text-red-500 ml-1">*</span>
											</label>
											<input type="email" name="email" value={availabilityFormData.email} onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, email: e.target.value })} required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base" placeholder="seu@email.com" />
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">Observações ou informações adicionais</label>
								<textarea name="mensagem" value={availabilityFormData.mensagem} onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, mensagem: e.target.value })} rows="3" className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base" placeholder="Ex: Necessito desta peça para um projeto específico..." />
							</div>

							<div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
								<div className="flex items-start gap-3">
									<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<div className="text-sm text-blue-900">
										<p className="font-semibold mb-1">Como funciona?</p>
										<p className="text-blue-700">Após enviar sua consulta, nossa equipe verificará a disponibilidade e entrará em contato para confirmar prazos e valores.</p>
									</div>
								</div>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button type="submit" disabled={availabilityLoading} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
									{availabilityLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Enviar Consulta
										</>
									)}
								</button>
								<button type="button" onClick={() => setShowAvailabilityModal(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer">Cancelar</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
