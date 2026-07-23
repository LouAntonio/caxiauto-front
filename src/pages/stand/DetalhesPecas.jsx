import React, { useState, useEffect, useCallback } from 'react'
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
	Heart,
	Tag,
	MessageSquare
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { getImageUrl, notyf } from '../../services/api'
import useAuthStore from '../../stores/authStore'
import useChatStore from '../../stores/chatStore'
import { PecaDetailSkeleton } from '../../components/skeletons'
import { usePeca } from '../../hooks/queries/usePecas'
import { useWishlist, useAddPecaToWishlist, useRemovePecaFromWishlist } from '../../hooks/queries/useWishlist'

export default function DetalhesPecas() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuthStore()
	const { createConversation: startChat, openChat } = useChatStore()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
	const [requestedQuantity, setRequestedQuantity] = useState(1)
	const [error, setError] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)

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

	const getAuthContactData = useCallback(() => ({
		nome: (user?.name || '').trim(),
		email: (user?.email || '').trim(),
		telefone: (user?.phone || '').trim()
	}), [user])

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
	}, [isAuthenticated, user?.name, user?.email, user?.phone, getAuthContactData])

	const { data: peca, isLoading, isFetched } = usePeca(id)

	useEffect(() => {
		if (!id) {
			setError('ID da peça não fornecido')
			return
		}
	}, [id])

	useEffect(() => {
		if (isFetched && !peca) {
			setError('Peça não encontrada')
		} else if (peca) {
			setError(null)
			setCurrentImageIndex(0)
			api.addView('part', id).catch(viewError => {
				console.error('Erro ao registrar visualização:', viewError)
			})
		}
	}, [isFetched, peca, id])

	const { data: wishlistData } = useWishlist()
	const addFavoriteMutation = useAddPecaToWishlist()
	const removeFavoriteMutation = useRemovePecaFromWishlist()

	useEffect(() => {
		if (wishlistData) {
			setIsFavorite(wishlistData.pecas?.some(p => p.id === id) || false)
		} else {
			setIsFavorite(false)
		}
	}, [wishlistData, id])

	useDocumentTitle(
		peca ? `${peca.name} - Peças - Caxiauto` : 'Detalhes da Peça - Caxiauto'
	)

	const getAllImages = () => {
		if (!peca) return []
		const images = []
		if (peca.image) images.push(getImageUrl(peca.image, '/images/parts.jpg'))
		if (peca.gallery && peca.gallery.length > 0) {
			images.push(...peca.gallery.map(img => getImageUrl(img, '/images/parts.jpg')))
		}
		return images.length > 0 ? images : ['/images/parts.jpg']
	}

	if (isLoading) {
		return <PecaDetailSkeleton />
	}

	if (error || !peca) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<Package className="w-16 h-16 mx-auto text-[#e5e7eb] mb-4" />
					<h1 className="font-display text-2xl font-bold text-[#111827] mb-2">
						Peça não encontrada
					</h1>
					<p className="font-body text-[#6b7280] mb-6">
						{error || 'A peça que você está procurando não foi encontrada ou não está disponível.'}
					</p>
					<button
						onClick={() => navigate('/stand/pecas-acessorios')}
						className="bg-[#154c9a] text-white px-6 py-3 rounded-2xl hover:bg-[#0c2d5e] transition-colors font-body font-semibold cursor-pointer"
					>
						Ver outras peças
					</button>
				</div>
			</div>
		)
	}

	const allImages = getAllImages()

	const nextImage = () => {
		if (allImages.length > 0) {
			setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
		}
	}

	const prevImage = () => {
		if (allImages.length > 0) {
			setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
		}
	}

	const formatPrice = (price) => {
		if (price === null || price === undefined || isNaN(price) || price === 0) {
			return 'Preço sob consulta'
		}
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

	const toggleFavorite = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar aos favoritos')
			return
		}

		try {
			if (isFavorite) {
				const response = await removeFavoriteMutation.mutateAsync(id)
				if (response.success) {
					setIsFavorite(false)
					notyf.success('Removido dos favoritos')
				} else {
					notyf.error(response.message || 'Erro ao remover favorito')
				}
			} else {
				const response = await addFavoriteMutation.mutateAsync(id)
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
		}
	}

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
				notyf.success(response.message || 'Pedido de compra enviado com sucesso!')
				setShowContactModal(false)
				setPartPurchaseFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					mensagem: ''
				})
			} else {
				notyf.error(response.message || 'Erro ao enviar pedido de compra')
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
				notyf.success(response.message || 'Consulta enviada com sucesso!')
				setShowAvailabilityModal(false)
				setAvailabilityFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					mensagem: ''
				})
			} else {
				notyf.error(response.message || 'Erro ao enviar consulta')
			}
		} catch (error) {
			console.error('Erro ao enviar consulta:', error)
			notyf.error('Erro ao enviar consulta')
		} finally {
			setAvailabilityLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Breadcrumb */}
			<div className="bg-white border-b border-[#e5e7eb] sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<nav className="flex items-center gap-2 font-body text-sm text-[#6b7280]">
						<Link to="/" className="hover:text-[#154c9a] transition-colors">Início</Link>
						<ChevronRight className="w-4 h-4" />
						<Link to="/stand/pecas-acessorios" className="hover:text-[#154c9a] transition-colors">Peças e Acessórios</Link>
						<ChevronRight className="w-4 h-4" />
						<span className="text-[#111827] font-medium">{peca.name}</span>
					</nav>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Coluna Principal */}
					<div className="lg:col-span-2 space-y-6">
						{/* Galeria */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
							<div className="relative h-96 bg-gray-100">
								<img
									src={allImages[currentImageIndex]}
									key={currentImageIndex}
									loading="lazy"
									alt={`${peca.name} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-cover transition-opacity duration-500"
									onError={(e) => {
										e.target.src = '/images/parts.jpg'
										console.warn(`Erro ao carregar imagem: ${e.target.src}`)
									}}
								/>

								<div className="absolute top-4 left-4 flex gap-2 flex-wrap">
									<span className={`px-5 py-2.5 text-sm font-bold rounded-full shadow-xl backdrop-blur-sm font-body ${
										peca.condition === 'NEW' ? 'bg-[#154c9a] text-white' :
											peca.condition === 'REFURBISHED' ? 'bg-[#d41120] text-white' :
												'bg-[#d41120] text-white'
									}`}>
										{conditionLabels[peca.condition] || peca.condition}
									</span>
								</div>

								{isAuthenticated && (
									<button
										onClick={toggleFavorite}
										className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 cursor-pointer"
										aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
									>
										<Heart
											className={`w-5 h-5 transition-all duration-200 ${isFavorite
												? 'fill-red-500 text-red-500'
												: 'text-gray-600 hover:text-red-500'
											}`}
										/>
									</button>
								)}

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

								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
									{allImages.map((_, index) => (
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

							<div className="p-4 flex gap-2 overflow-x-auto">
								{allImages.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-[#154c9a] ring-2 ring-[#154c9a]/20' : 'border-[#e5e7eb]'
										} cursor-pointer`}
									>
										<img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						</div>

						{/* Informações Principais */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<div className="mb-6">
								<h1 className="font-display text-3xl md:text-4xl font-bold text-[#111827] mb-2">
									{peca.name}
								</h1>
								<p className="font-body text-[#6b7280] flex items-center gap-2">
									<Package className="w-4 h-4" />
									{peca.Categoria?.name || 'Sem categoria'}
								</p>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Shield className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Condição</span>
									<span className="font-body font-semibold text-[#111827] text-sm">{conditionLabels[peca.condition] || peca.condition}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<MapPin className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Província</span>
									<span className="font-body font-semibold text-[#111827] text-sm text-center">{formatProvincia(peca.provincia)}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Calendar className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Publicado</span>
									<span className="font-body font-semibold text-[#111827] text-sm text-center">{formatDate(peca.createdAt)}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<CheckCircle2 className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Estado</span>
									<span className="font-body font-semibold text-[#111827] text-sm">{statusLabels[peca.status] || peca.status}</span>
								</div>
							</div>
						</div>

						{/* Compatibilidade */}
						{peca.compatibility && peca.compatibility.length > 0 && (
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
									Compatibilidade
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{peca.compatibility.map((item, index) => (
										<div key={index} className="flex items-center gap-2 text-[#6b7280] p-3 rounded-lg hover:bg-[#f8f6f2] transition-colors group cursor-pointer">
											<Tag className="w-5 h-5 text-[#154c9a] flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="font-body text-sm font-medium">{item}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Vendedor (hidden) */}
						{peca.Seller && (
							<div className="hidden bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
									Vendedor
								</h2>
								<div className="flex items-center gap-4 p-4 bg-[#f8f6f2] rounded-xl">
									<div className="w-14 h-14 bg-[#eef3fa] rounded-full flex items-center justify-center">
										<User className="w-7 h-7 text-[#154c9a]" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className="font-display font-bold text-[#111827] text-lg">
												{peca.Seller.name} {peca.Seller.surname}
											</h3>
											{peca.Seller.isVerified && (
												<Shield className="w-5 h-5 text-blue-500" fill="currentColor" />
											)}
										</div>
										<p className="font-body text-sm text-[#6b7280]">
											{peca.Seller.isVerified ? 'Vendedor Verificado' : 'Vendedor'}
										</p>
									</div>
									<Link
										to={`/vendedor/${peca.Seller.id}`}
										className="flex items-center gap-1 text-[#154c9a] hover:text-[#0c2d5e] font-body text-sm font-medium"
									>
										Ver perfil
									</Link>
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-16 space-y-4">
							{/* Preço */}
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h3 className="font-display text-lg font-bold text-[#111827] mb-4">Preço</h3>

								<div className="bg-[#f8f6f2] rounded-xl p-5 mb-6">
									<div className="text-3xl font-bold text-[#154c9a] font-['JetBrains_Mono',monospace] mb-1">
										{formatPrice(peca.price)}
									</div>
									<div className="font-body text-sm text-[#6b7280">kz</div>
								</div>

								{/* Quantidade */}
								<div className="mb-6">
									<label className="font-body text-sm font-semibold text-[#6b7280] mb-2 block">Quantidade</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
											className="w-10 h-10 rounded-xl bg-[#f8f6f2] hover:bg-[#eef3fa] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-body text-lg text-[#6b7280]"
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
											className="w-20 text-center border border-[#e5e7eb] rounded-xl py-2 outline-none focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
										/>
										<button
											onClick={() => setRequestedQuantity(requestedQuantity + 1)}
											className="w-10 h-10 rounded-xl bg-[#f8f6f2] hover:bg-[#eef3fa] flex items-center justify-center transition-colors cursor-pointer font-body text-lg text-[#6b7280]"
										>
											+
										</button>
									</div>
									<p className="font-body text-xs text-[#6b7280] mt-2">Consultar disponibilidade para a quantidade desejada</p>
								</div>

								<div className="bg-[#f8f6f2] rounded-xl p-4 mb-4">
									<div className="flex justify-between items-center">
										<span className="font-body text-[#6b7280] font-medium">Total estimado:</span>
										<span className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#154c9a]">
											{formatPrice(Number(peca.price) * requestedQuantity)} kz
										</span>
									</div>
								</div>

								<button
									onClick={() => setShowContactModal(true)}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-3 cursor-pointer font-body"
								>
									Solicitar Compra
								</button>

								<button
									onClick={() => setShowAvailabilityModal(true)}
									className="w-full bg-[#d41120] hover:bg-[#b80f1c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer font-body"
								>
									Consultar Disponibilidade
								</button>

								{peca?.Seller && (
									<button
										onClick={async () => {
											if (!isAuthenticated) { notyf.error('Faça login para enviar mensagens'); navigate('/auth'); return }
											const res = await startChat(peca.Seller.id, null, peca.id)
											if (res.success) openChat()
										}}
										className="w-full bg-[#eef3fa] hover:bg-[#dce5f5] text-[#154c9a] font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] cursor-pointer font-body flex items-center justify-center gap-2 mt-3"
									>
										<MessageSquare className="w-5 h-5" />
										Falar com Vendedor
									</button>
								)}
							</div>

							{/* Informações */}
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h3 className="font-display text-lg font-bold text-[#111827] mb-4">Informações</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center py-2 border-b border-[#e5e7eb]">
										<span className="font-body text-[#6b7280] text-sm">Categoria</span>
										<span className="font-body font-medium text-[#111827] text-sm">{peca.Categoria?.name || 'N/A'}</span>
									</div>
									<div className="flex justify-between items-center py-2 border-b border-[#e5e7eb]">
										<span className="font-body text-[#6b7280] text-sm">Condição</span>
										<span className="font-body font-medium text-[#111827] text-sm">{conditionLabels[peca.condition] || 'N/A'}</span>
									</div>
									<div className="flex justify-between items-center py-2 border-b border-[#e5e7eb]">
										<span className="font-body text-[#6b7280] text-sm">Província</span>
										<span className="font-body font-medium text-[#111827] text-sm">{formatProvincia(peca.provincia)}</span>
									</div>
									<div className="flex justify-between items-center py-2">
										<span className="font-body text-[#6b7280] text-sm">Publicado em</span>
										<span className="font-body font-medium text-[#111827] text-sm">{formatDate(peca.createdAt)}</span>
									</div>
								</div>
							</div>

							{/* Compra Segura */}
							<div className="bg-[#f8f6f2] border border-[#e5e7eb] rounded-2xl p-5">
								<h3 className="flex items-center gap-2 font-display font-bold text-[#111827] mb-4">
									<Shield className="w-5 h-5 text-[#154c9a]" />
									Compra Segura
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Peças verificadas</span>
									</li>
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Contacto direto com vendedor</span>
									</li>
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Garantia de conformidade</span>
									</li>
								</ul>
							</div>

							{/* Contato */}
							<div className="bg-[#154c9a] rounded-2xl p-6 text-white">
								<h3 className="font-display text-lg font-bold mb-4">Precisa de ajuda?</h3>
								<p className="font-body text-sm text-blue-100 mb-4">
									Nossa equipe está pronta para ajudá-lo
								</p>
								<div className="space-y-3">
									<a
										href="tel:+244930723503"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Phone className="w-5 h-5" />
										<div className="font-body text-sm">
											<div className="font-medium">+244 930 723 503</div>
											<div className="text-xs text-blue-200">Ligar agora</div>
										</div>
									</a>
									<a
										href="mailto:info@caxiauto.com"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Mail className="w-5 h-5" />
										<div className="font-body text-sm">
											<div className="font-medium">info@caxiauto.com</div>
											<div className="text-xs text-blue-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal Solicitar Compra */}
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
						<div className="sticky top-0 bg-[#154c9a] px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowContactModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-display">
									Solicitar Peça
								</h3>
								<p className="text-blue-100 text-xs sm:text-sm font-body">
									Preencha os dados e entraremos em contato
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handlePartPurchaseSubmit}
						>
							<div className="bg-[#eef3fa] border border-[#154c9a]/20 rounded-xl p-4">
								<h4 className="font-display font-bold text-[#111827] mb-2">{peca.name}</h4>
								<div className="flex justify-between font-body text-sm text-[#6b7280]">
									<span>{conditionLabels[peca.condition]}</span>
									<span className="font-['JetBrains_Mono',monospace] font-bold text-[#154c9a]">{formatPrice(peca.price)} kz</span>
								</div>
							</div>

							{!isAuthenticated && (
								<div className="space-y-4">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Nome completo
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											name="nome"
											value={partPurchaseFormData.nome}
											onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, nome: e.target.value })}
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
											placeholder="Digite seu nome completo"
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
												<span className="flex items-center gap-1.5">
													Telefone
													<span className="text-red-500 text-base">*</span>
												</span>
											</label>
											<input
												type="tel"
												name="telefone"
												value={partPurchaseFormData.telefone}
												onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, telefone: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="+244 9XX XXX XXX"
											/>
										</div>

										<div>
											<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
												<span className="flex items-center gap-1.5">
													E-mail
													<span className="text-red-500 text-base">*</span>
												</span>
											</label>
											<input
												type="email"
												name="email"
												value={partPurchaseFormData.email}
												onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, email: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
									Mensagem ou observações
								</label>
								<textarea
									name="mensagem"
									value={partPurchaseFormData.mensagem}
									onChange={(e) => setPartPurchaseFormData({ ...partPurchaseFormData, mensagem: e.target.value })}
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none resize-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
									placeholder="Informações adicionais sobre sua solicitação..."
								/>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-[#e5e7eb] space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									disabled={partPurchaseLoading}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-3 sm:py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-body text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									{partPurchaseLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
											Enviar Solicitação
										</>
									)}
								</button>
								<button
									type="button"
									onClick={() => setShowContactModal(false)}
									className="w-full bg-[#f8f6f2] hover:bg-[#eef3fa] text-[#6b7280] font-semibold py-2.5 sm:py-3 rounded-2xl transition-all active:scale-[0.98] font-body text-sm sm:text-base cursor-pointer"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal Consultar Disponibilidade */}
			{showAvailabilityModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowAvailabilityModal(false);
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-slideUp">
						<div className="sticky top-0 bg-[#154c9a] px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowAvailabilityModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-display">
									Consultar Disponibilidade
								</h3>
								<p className="text-blue-100 text-xs sm:text-sm font-body">
									Entre em contato para verificar disponibilidade
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handleAvailabilitySubmit}
						>
							<div className="bg-[#eef3fa] border border-[#154c9a]/20 rounded-xl p-4">
								<h4 className="font-display font-bold text-[#111827] mb-2">{peca.name}</h4>
								<div className="space-y-1 font-body text-sm text-[#6b7280]">
									<div className="flex justify-between">
										<span>Preço:</span>
										<span className="font-['JetBrains_Mono',monospace] font-semibold text-[#154c9a]">{formatPrice(peca.price)} kz</span>
									</div>
									<div className="flex justify-between">
										<span>Província:</span>
										<span className="font-semibold text-[#111827]">{formatProvincia(peca.provincia)}</span>
									</div>
								</div>
							</div>

							<div>
								<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
									Quantidade desejada
								</label>
								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
										className="w-10 h-10 rounded-xl bg-[#f8f6f2] hover:bg-[#eef3fa] flex items-center justify-center transition-colors cursor-pointer font-body text-lg text-[#6b7280]"
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
										className="flex-1 text-center border border-[#e5e7eb] rounded-xl py-2.5 outline-none focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-lg font-semibold"
									/>
									<button
										type="button"
										onClick={() => setRequestedQuantity(requestedQuantity + 1)}
										className="w-10 h-10 rounded-xl bg-[#f8f6f2] hover:bg-[#eef3fa] flex items-center justify-center transition-colors cursor-pointer font-body text-lg text-[#6b7280]"
									>
										+
									</button>
								</div>
								<div className="bg-[#f8f6f2] rounded-xl p-3 mt-3">
									<div className="flex justify-between items-center font-body text-sm">
										<span className="text-[#6b7280]">Valor total estimado:</span>
										<span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#154c9a]">
											{formatPrice(Number(peca.price) * requestedQuantity)} kz
										</span>
									</div>
								</div>
							</div>

							{!isAuthenticated && (
								<div className="space-y-4 pt-4 border-t border-[#e5e7eb]">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Nome completo
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											name="nome"
											value={availabilityFormData.nome}
											onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, nome: e.target.value })}
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
											placeholder="Digite seu nome completo"
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
												<span className="flex items-center gap-1.5">
													Telefone
													<span className="text-red-500 text-base">*</span>
												</span>
											</label>
											<input
												type="tel"
												name="telefone"
												value={availabilityFormData.telefone}
												onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, telefone: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="+244 9XX XXX XXX"
											/>
										</div>

										<div>
											<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
												<span className="flex items-center gap-1.5">
													E-mail
													<span className="text-red-500 text-base">*</span>
												</span>
											</label>
											<input
												type="email"
												name="email"
												value={availabilityFormData.email}
												onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, email: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
									Observações ou informações adicionais
								</label>
								<textarea
									name="mensagem"
									value={availabilityFormData.mensagem}
									onChange={(e) => setAvailabilityFormData({ ...availabilityFormData, mensagem: e.target.value })}
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none resize-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
									placeholder="Ex: Necessito desta peça para um projeto específico..."
								/>
							</div>

							<div className="bg-[#eef3fa] border border-[#154c9a]/20 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<CheckCircle2 className="w-5 h-5 text-[#154c9a] flex-shrink-0 mt-0.5" />
									<div className="font-body text-sm text-[#154c9a]">
										<p className="font-semibold mb-1">Como funciona?</p>
										<p className="text-[#6b7280]">
											Após enviar sua consulta, nossa equipe verificará a disponibilidade e entrará em contato para confirmar prazos e valores.
										</p>
									</div>
								</div>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-[#e5e7eb] space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									disabled={availabilityLoading}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-3 sm:py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-body text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									{availabilityLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
											Enviar Consulta
										</>
									)}
								</button>
								<button
									type="button"
									onClick={() => setShowAvailabilityModal(false)}
									className="w-full bg-[#f8f6f2] hover:bg-[#eef3fa] text-[#6b7280] font-semibold py-2.5 sm:py-3 rounded-2xl transition-all active:scale-[0.98] font-body text-sm sm:text-base cursor-pointer"
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
