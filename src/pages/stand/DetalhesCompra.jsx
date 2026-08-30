import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { formatNumber, toLocalDateString } from '../../utils/format'
import { recordViewOnce } from '../../utils/views'
import {
	Gauge,
	Calendar,
	MapPin,
	Droplet,
	Users,
	Cog,
	Car,
	Shield,
	User,
	ChevronLeft,
	ChevronRight,
	Phone,
	Mail,
	CheckCircle2,
	X,
	Loader2,
	Heart,
	Wallet,
	MessageSquare
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { API_URL, getImageUrl, notyf } from '../../services/api'
import useAuthStore from '../../stores/authStore'
import useChatStore from '../../stores/chatStore'
import { VehicleDetailSkeleton } from '../../components/skeletons'
import { COMPRA_INCLUDED, COMPRA_REQUIREMENTS } from '../../constants/loja'
import { useVehicle } from '../../hooks/queries/useVehicles'
import { useWishlist, useAddVehicleToWishlist, useRemoveVehicleFromWishlist } from '../../hooks/queries/useWishlist'

export default function DetalhesCompra() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuthStore()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showVisitModal, setShowVisitModal] = useState(false)

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === 'Escape') {
				setShowContactModal(false);
				setShowVisitModal(false);
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, []);
	const [error, setError] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)

	const [purchaseFormData, setPurchaseFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		formaPagamento: '',
		mensagem: ''
	})
	const [visitFormData, setVisitFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		dataVisita: '',
		horario: '',
		numPessoas: '1',
		mensagem: ''
	})
	const [purchaseLoading, setPurchaseLoading] = useState(false)
	const [visitLoading, setVisitLoading] = useState(false)
	const { createConversation: startChat, openChat } = useChatStore()

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

	useEffect(() => {
		if (!isAuthenticated) {
			return
		}

		const authContactData = getAuthContactData()

		setPurchaseFormData((previous) => ({
			...previous,
			nome: previous.nome?.trim() ? previous.nome : authContactData.nome,
			email: previous.email?.trim() ? previous.email : authContactData.email,
			telefone: previous.telefone?.trim() ? previous.telefone : authContactData.telefone
		}))

		setVisitFormData((previous) => ({
			...previous,
			nome: previous.nome?.trim() ? previous.nome : authContactData.nome,
			email: previous.email?.trim() ? previous.email : authContactData.email,
			telefone: previous.telefone?.trim() ? previous.telefone : authContactData.telefone
		}))
	}, [isAuthenticated, user?.name, user?.email, user?.phone, getAuthContactData])

	const { data: apiVehicle, isLoading, isFetched } = useVehicle(id)

	const mapVehicleData = (vehicleData) => {
		const images = []
		if (vehicleData.image) {
			images.push(getImageUrl(vehicleData.image, '/images/placeholder-car.jpg'))
		}
		if (vehicleData.gallery && vehicleData.gallery.length > 0) {
			images.push(...vehicleData.gallery.map(img => getImageUrl(img, '/images/placeholder-car.jpg')))
		}
		if (images.length === 0) {
			images.push('/images/placeholder-car.jpg')
		}

		const fuelLabels = {
			GASOLINE: 'Gasolina',
			DIESEL: 'Diesel',
			ELECTRIC: 'Elétrico',
			HYBRID: 'Híbrido'
		}
		const transmissionLabels = {
			MANUAL: 'Manual',
			AUTOMATIC: 'Automática',
			SEMI_AUTOMATIC: 'Semi-Automática'
		}

		const fullName = [
			vehicleData.Manufacturer?.name,
			vehicleData.name,
			vehicleData.Class?.name,
			vehicleData.year
		].filter(Boolean).join(' ')

		return {
			id: vehicleData.id,
			title: fullName || 'Veículo sem título',
			price: vehicleData.priceSale || 0,
			images,
			condition: vehicleData.condition
				? (vehicleData.condition === 'NEW' ? 'Novo' : 'Usado')
				: (vehicleData.kilometers === 0 ? 'Novo' : 'Usado'),
			description: vehicleData.description || 'Sem descrição disponível',
			specs: {
				km: vehicleData.kilometers
					? `${formatNumber(vehicleData.kilometers)} km`
					: 'N/A',
				year: vehicleData.year || 'N/A',
				location: vehicleData.provincia || 'N/A',
				fuel: fuelLabels[vehicleData.fuelType] || vehicleData.fuelType || 'N/A',
				transmission: transmissionLabels[vehicleData.transmission] || vehicleData.transmission || 'N/A',
				passengers: vehicleData.passengerCapacity
					? `${vehicleData.passengerCapacity} ${vehicleData.passengerCapacity === 1 ? 'lugar' : 'lugares'}`
					: 'N/A',
				doors: vehicleData.doorCount
					? `${vehicleData.doorCount} ${vehicleData.doorCount === 1 ? 'porta' : 'portas'}`
					: 'N/A'
			},
			features: vehicleData.characteristics || [],
			included: COMPRA_INCLUDED,
			requirements: COMPRA_REQUIREMENTS,
			seller: vehicleData.Seller || vehicleData.owner
		}
	}

	const vehicle = apiVehicle ? mapVehicleData(apiVehicle) : null
	const loading = isLoading

	const { data: wishlistData } = useWishlist()
	const addFavoriteMutation = useAddVehicleToWishlist()
	const removeFavoriteMutation = useRemoveVehicleFromWishlist()

	useEffect(() => {
		if (!id) {
			setError('ID do veículo não fornecido')
			return
		}
	}, [id])

	useEffect(() => {
		if (isFetched && !apiVehicle) {
			setError('Veículo não encontrado')
		} else if (apiVehicle) {
			setError(null)
			setCurrentImageIndex(0)
			if (recordViewOnce('sell', id)) {
				api.addView('sell', id).catch(viewError => {
					console.error('Erro ao registrar visualização:', viewError)
				})
			}
		}
	}, [isFetched, apiVehicle, id])

	useEffect(() => {
		if (wishlistData) {
			setIsFavorite(wishlistData.vehicles?.some(v => v.id === id) || false)
		} else {
			setIsFavorite(false)
		}
	}, [wishlistData, id])

	useDocumentTitle(
		vehicle ? `${vehicle.title} - Compra - Caxiauto` : 'Detalhes do Veículo - Caxiauto'
	)

	if (loading) {
		return <VehicleDetailSkeleton />
	}

	if (error || !vehicle) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<Car className="w-16 h-16 mx-auto text-[#e5e7eb] mb-4" />
					<h1 className="font-display text-2xl font-bold text-[#111827] mb-2">
						Veículo não encontrado
					</h1>
					<p className="font-body text-[#6b7280] mb-6">
						{error || 'O veículo que você está procurando não foi encontrado ou não está disponível.'}
					</p>
					<button
						onClick={() => navigate('/stand/compra')}
						className="bg-[#154c9a] text-white px-6 py-3 rounded-2xl hover:bg-[#0c2d5e] transition-colors font-body font-semibold cursor-pointer"
					>
						Ver outros veículos
					</button>
				</div>
			</div>
		)
	}

	const nextImage = () => {
		if (vehicle && vehicle.images && vehicle.images.length > 0) {
			setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
		}
	}

	const prevImage = () => {
		if (vehicle && vehicle.images && vehicle.images.length > 0) {
			setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
		}
	}

	const handleContact = () => {
		setShowContactModal(true)
	}

	const handleVisit = () => {
		setShowVisitModal(true)
	}

	const handlePurchaseSubmit = async (e) => {
		e.preventDefault()
		const contactData = mergeRequiredContactFields(purchaseFormData)
		if (hasMissingRequiredContact(contactData)) {
			notyf.error('Complete nome, e-mail e telefone para continuar.')
			return
		}

		setPurchaseLoading(true)
		try {
			const response = await api.contactVehiclePurchase({
				vehicleId: id,
				...purchaseFormData,
				...contactData
			})
			if (response.success) {
				notyf.success(response.message || 'Proposta enviada com sucesso!')
				setShowContactModal(false)
				setPurchaseFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					formaPagamento: '',
					mensagem: ''
				})
			} else {
				notyf.error(response.message || 'Erro ao enviar proposta')
			}
		} catch (error) {
			console.error('Erro ao enviar proposta:', error)
			notyf.error('Erro ao enviar proposta')
		} finally {
			setPurchaseLoading(false)
		}
	}

	const handleVisitSubmit = async (e) => {
		e.preventDefault()
		const contactData = mergeRequiredContactFields(visitFormData)
		if (hasMissingRequiredContact(contactData)) {
			notyf.error('Complete nome, e-mail e telefone para continuar.')
			return
		}

		setVisitLoading(true)
		try {
			const response = await api.contactVehicleVisit({
				vehicleId: id,
				...visitFormData,
				...contactData
			})
			if (response.success) {
				notyf.success(response.message || 'Pedido de visita enviado com sucesso!')
				setShowVisitModal(false)
				setVisitFormData({
					nome: isAuthenticated ? contactData.nome : '',
					email: isAuthenticated ? contactData.email : '',
					telefone: isAuthenticated ? contactData.telefone : '',
					dataVisita: '',
					horario: '',
					numPessoas: '1',
					mensagem: ''
				})
			} else {
				notyf.error(response.message || 'Erro ao enviar pedido de visita')
			}
		} catch (error) {
			console.error('Erro ao enviar pedido de visita:', error)
			notyf.error('Erro ao enviar pedido de visita')
		} finally {
			setVisitLoading(false)
		}
	}

	const formatPrice = (price) => {
		if (price === null || price === undefined || isNaN(price) || price === 0) {
			return 'Preço sob consulta'
		}
		return formatNumber(price)
	}

	const toggleFavorite = async (e) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			notyf.error('Você precisa estar logado para adicionar favoritos')
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

	return (
		<div className="min-h-screen bg-white">
			{/* Breadcrumb */}
			<div className="bg-white border-b border-[#e5e7eb] sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<nav className="flex items-center gap-2 font-body text-sm text-[#6b7280]">
						<Link to="/" className="hover:text-[#154c9a] transition-colors">Início</Link>
						<ChevronRight className="w-4 h-4" />
						<Link to="/stand/compra" className="hover:text-[#154c9a] transition-colors">Compra</Link>
						<ChevronRight className="w-4 h-4" />
						<span className="text-[#111827] font-medium">{vehicle?.title || 'Detalhes do Veículo'}</span>
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
									src={`${vehicle.images[currentImageIndex]}`}
									key={currentImageIndex}
									loading="lazy"
									alt={`${vehicle.title} - Imagem ${currentImageIndex + 1}`}
									className="w-full h-full object-cover transition-opacity duration-500"
									onError={(e) => {
										e.target.src = '/images/i10.jpg'
										console.warn(`Erro ao carregar imagem: ${e.target.src}`)
									}}
								/>

								<div className="absolute top-4 left-4">
									<span className={`px-5 py-2.5 text-sm font-bold rounded-full shadow-xl backdrop-blur-sm font-body ${vehicle.condition === 'Novo' ? 'bg-[#154c9a] text-white' : 'bg-[#d41120] text-white'
									}`}>
										{vehicle.condition}
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

							<div className="p-4 flex gap-2 overflow-x-auto">
								{vehicle.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-[#154c9a] ring-2 ring-[#154c9a]/20' : 'border-[#e5e7eb]'
										} cursor-pointer`}
									>
										<img src={`${image}`} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						</div>

						{/* Título e Especificações */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<h1 className="font-display text-3xl md:text-4xl font-bold text-[#111827] mb-6">{vehicle.title}</h1>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Gauge className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Quilometragem</span>
									<span className="font-['JetBrains_Mono',monospace] font-semibold text-[#111827]">{vehicle.specs.km}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Calendar className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Ano</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.year}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Droplet className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Combustível</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.fuel}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Cog className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Transmissão</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.transmission}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Users className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Passageiros</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.passengers}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Car className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Portas</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.doors}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<MapPin className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Localização</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.specs.location}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-[#f8f6f2] rounded-xl hover:shadow-sm transition-all group cursor-pointer">
									<Shield className="w-6 h-6 text-[#154c9a] mb-2 group-hover:scale-110 transition-transform" />
									<span className="font-body text-xs text-[#6b7280] mb-1">Condição</span>
									<span className="font-body font-semibold text-[#111827]">{vehicle.condition}</span>
								</div>
							</div>
						</div>

						{/* Descrição */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
								Descrição
							</h2>
							<p className="font-body text-[#6b7280] leading-relaxed">{vehicle.description}</p>
						</div>

						{/* Características */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
								Características e Equipamentos
							</h2>
							{vehicle.features.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{vehicle.features.map((feature, index) => (
										<div key={index} className="flex items-center gap-2 text-[#6b7280] p-2 rounded-lg hover:bg-[#f8f6f2] transition-colors group cursor-pointer">
											<CheckCircle2 className="w-5 h-5 text-[#154c9a] flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="font-body text-sm">{feature}</span>
										</div>
									))}
								</div>
							) : (
								<p className="font-body text-[#6b7280] italic">Nenhuma característica específica informada.</p>
							)}
						</div>

						{/* O que está Incluído */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
								O que está incluso
							</h2>
							<div className="space-y-3">
								{vehicle.included.map((item, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8f6f2] transition-colors group cursor-pointer">
										<Shield className="w-5 h-5 text-[#154c9a] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
										<span className="font-body text-[#6b7280]">{item}</span>
									</div>
								))}
							</div>
						</div>

						{/* Requisitos */}
						<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
							<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
								Requisitos para Compra
							</h2>
							<div className="space-y-3">
								{vehicle.requirements.map((req, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8f6f2] transition-colors group cursor-pointer">
										<CheckCircle2 className="w-5 h-5 text-[#154c9a] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
										<span className="font-body text-[#6b7280]">{req}</span>
									</div>
								))}
							</div>
						</div>

						{/* Vendedor */}
						{vehicle.seller && (
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h2 className="font-display text-2xl font-bold text-[#111827] mb-4">
									Vendedor
								</h2>
								<div className="flex items-center gap-4 p-4 bg-[#f8f6f2] rounded-xl">
									<div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden bg-[#eef3fa] flex-shrink-0">
										{vehicle.sellerLogo ? (
											<img src={vehicle.sellerLogo} alt={`Logo de ${vehicle.seller.name}`} className="w-full h-full object-contain bg-white" />
										) : (
											<User className="w-7 h-7 text-[#154c9a]" />
										)}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h3 className="font-display font-bold text-[#111827] text-lg">
												{vehicle.seller.name} {vehicle.seller.surname}
											</h3>
											{vehicle.seller.isVerified && (
												<Shield className="w-5 h-5 text-blue-500" fill="currentColor" />
											)}
										</div>
										<p className="font-body text-sm text-[#6b7280]">
											{vehicle.seller.isVerified ? 'Vendedor Verificado' : 'Vendedor'}
										</p>
										<div className="mt-2 flex flex-wrap items-center gap-1.5">
											{vehicle.sellerPremium && (
												<span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#154c9a] text-white font-body">Stand Premium</span>
											)}
											{vehicle.isCertified && (
												<span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-body">Certificação Caxiauto</span>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-16 space-y-4">
							{/* Preço */}
							<div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
								<h3 className="font-display text-lg font-bold text-[#111827] mb-4">Preço de Venda</h3>

								<div className="bg-[#f8f6f2] rounded-xl p-5 mb-6">
									<div className="text-4xl font-bold text-[#154c9a] font-price mb-1">
										{formatPrice(vehicle.price)}
									</div>
									{vehicle.price > 0 && (
										<div className="font-body text-sm text-[#6b7280]">Kz</div>
									)}
								</div>

								<button
									onClick={handleContact}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-3 cursor-pointer font-body"
								>
									Fazer Proposta
								</button>

								<button
									onClick={handleVisit}
									className="w-full bg-[#d41120] hover:bg-[#b80f1c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer font-body"
								>
									Agendar Visita
								</button>

								<button
									onClick={async () => {
										if (!isAuthenticated) { notyf.error('Faça login para enviar mensagens'); navigate('/auth'); return }
										const res = await startChat(null, vehicle?.id, null)
										if (res.success) openChat()
									}}
									className="w-full bg-[#eef3fa] hover:bg-[#dce5f5] text-[#154c9a] font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] cursor-pointer font-body flex items-center justify-center gap-2"
								>
									<MessageSquare className="w-5 h-5" />
									Negociar
								</button>
							</div>

							{/* Contato */}
							<div className="bg-[#154c9a] rounded-2xl p-6 text-white">
								<h3 className="font-display text-lg font-bold mb-4">Precisa de ajuda?</h3>
								<p className="font-body text-sm text-blue-100 mb-4">
									Nossa equipe está pronta para atendê-lo
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
										href="mailto:vendas@caxiauto.com"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Mail className="w-5 h-5" />
										<div className="font-body text-sm">
											<div className="font-medium">vendas@caxiauto.com</div>
											<div className="text-xs text-blue-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
							</div>

							{/* Por que comprar conosco? */}
							<div className="bg-[#f8f6f2] border border-[#e5e7eb] rounded-2xl p-5">
								<h3 className="flex items-center gap-2 font-display font-bold text-[#111827] mb-4">
									<Shield className="w-5 h-5 text-[#154c9a]" />
									Por que comprar conosco?
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Veículos inspecionados</span>
									</li>
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Garantia de qualidade</span>
									</li>
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Documentação completa</span>
									</li>
									<li className="flex items-start gap-3 font-body text-sm text-[#6b7280] bg-white rounded-xl p-3 shadow-sm">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span className="font-medium">Financiamento facilitado</span>
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
									Solicitar Compra
								</h3>
								<p className="text-blue-100 text-xs sm:text-sm font-body">
									Preencha os dados e entraremos em contato em breve
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handlePurchaseSubmit}
						>
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
											value={purchaseFormData.nome}
											onChange={(e) => setPurchaseFormData({ ...purchaseFormData, nome: e.target.value })}
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
												value={purchaseFormData.telefone}
												onChange={(e) => setPurchaseFormData({ ...purchaseFormData, telefone: e.target.value })}
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
												value={purchaseFormData.email}
												onChange={(e) => setPurchaseFormData({ ...purchaseFormData, email: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							<div className="pt-4 border-t border-[#e5e7eb]">
								<h4 className="font-body text-sm sm:text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
									<Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#154c9a]" />
									Detalhes do interesse
								</h4>

								<div>
									<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
										<span className="flex items-center gap-1.5">
											Forma de pagamento preferencial
											<span className="text-red-500 text-base">*</span>
										</span>
									</label>
									<select
										name="formaPagamento"
										value={purchaseFormData.formaPagamento}
										onChange={(e) => setPurchaseFormData({ ...purchaseFormData, formaPagamento: e.target.value })}
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 bg-white cursor-pointer font-body text-sm"
									>
										<option value="">Selecione uma opção</option>
										<option value="vista">Aceitar Preço — {formatPrice(vehicle.price)} Kz</option>
										<option value="financiamento">Fazer oferta (especificar na Mensagem)</option>
									</select>
								</div>
							</div>

							<div>
								<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
									Mensagem ou observações
								</label>
								<textarea
									name="mensagem"
									value={purchaseFormData.mensagem}
									onChange={(e) => setPurchaseFormData({ ...purchaseFormData, mensagem: e.target.value })}
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none resize-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
									placeholder="Conte-nos sobre suas dúvidas, forma de interesse ou outras informações..."
								/>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-[#e5e7eb] space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									disabled={purchaseLoading}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-3 sm:py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-body text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									{purchaseLoading ? (
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

			{/* Modal de Agendamento de Visita */}
			{showVisitModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowVisitModal(false);
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-slideUp">
						<div className="sticky top-0 bg-[#154c9a] px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowVisitModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-display">
									Agendar Visita
								</h3>
								<p className="text-blue-100 text-xs sm:text-sm font-body">
									{vehicle.title}
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handleVisitSubmit}
						>
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
											value={visitFormData.nome}
											onChange={(e) => setVisitFormData({ ...visitFormData, nome: e.target.value })}
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
												value={visitFormData.telefone}
												onChange={(e) => setVisitFormData({ ...visitFormData, telefone: e.target.value })}
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
												value={visitFormData.email}
												onChange={(e) => setVisitFormData({ ...visitFormData, email: e.target.value })}
												required
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							<div className="pt-4 border-t border-[#e5e7eb]">
								<h4 className="font-body text-sm sm:text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
									<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#154c9a]" />
									Data e Hora Preferencial
								</h4>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Data
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="date"
											name="dataVisita"
											value={visitFormData.dataVisita}
											onChange={(e) => setVisitFormData({ ...visitFormData, dataVisita: e.target.value })}
											required
											min={toLocalDateString(new Date())}
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 bg-white cursor-pointer font-body text-sm"
										/>
									</div>

									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Horário
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<select
											name="horario"
											value={visitFormData.horario || ''}
											onChange={(e) => setVisitFormData({ ...visitFormData, horario: e.target.value })}
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 bg-white cursor-pointer font-body text-sm"
										>
											<option value="">Selecione um horário</option>
											<option value="09:00">09:00</option>
											<option value="10:00">10:00</option>
											<option value="11:00">11:00</option>
											<option value="12:00">12:00</option>
											<option value="14:00">14:00</option>
											<option value="15:00">15:00</option>
											<option value="16:00">16:00</option>
											<option value="17:00">17:00</option>
										</select>
									</div>
								</div>

								<div className="mt-4">
									<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
										Número de pessoas
									</label>
									<select
										name="numPessoas"
										value={visitFormData.numPessoas || '1'}
										onChange={(e) => setVisitFormData({ ...visitFormData, numPessoas: e.target.value })}
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 bg-white cursor-pointer font-body text-sm"
									>
										<option value="1">1 pessoa</option>
										<option value="2">2 pessoas</option>
										<option value="3">3 pessoas</option>
										<option value="4">4 ou mais pessoas</option>
									</select>
								</div>
							</div>

							<div>
								<label className="flex items-center font-body text-xs sm:text-sm font-semibold text-[#6b7280] mb-2">
									Observações ou pedidos especiais
								</label>
								<textarea
									name="mensagem"
									value={visitFormData.mensagem}
									onChange={(e) => setVisitFormData({ ...visitFormData, mensagem: e.target.value })}
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none resize-none transition-all focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 font-body text-sm"
									placeholder="Ex: Gostaria de realizar test-drive, verificar documentação específica, etc."
								/>
							</div>

							<div className="bg-[#eef3fa] border border-[#154c9a]/20 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<CheckCircle2 className="w-5 h-5 text-[#154c9a] flex-shrink-0 mt-0.5" />
									<div className="font-body text-sm text-[#154c9a]">
										<p className="font-semibold mb-1">Confirmação de agendamento</p>
										<p className="text-[#6b7280]">
											Após enviar, nossa equipe entrará em contato para confirmar a disponibilidade e fornecer detalhes sobre a localização.
										</p>
									</div>
								</div>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-[#e5e7eb] space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									disabled={visitLoading}
									className="w-full bg-[#154c9a] hover:bg-[#0c2d5e] text-white font-bold py-3 sm:py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-body text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								>
									{visitLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
											Confirmar Agendamento
										</>
									)}
								</button>
								<button
									type="button"
									onClick={() => setShowVisitModal(false)}
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
