import React, { useState, useEffect } from 'react'
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
	FileText,
	Wallet,
	CreditCard,
	Loader2,
	Heart
} from 'lucide-react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import api, { notyf } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function DetalhesCompra() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuth()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showVisitModal, setShowVisitModal] = useState(false)
	const [vehicle, setVehicle] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)
	const [loadingFavorite, setLoadingFavorite] = useState(false)

	// Buscar dados do veículo
	useEffect(() => {
		const fetchVehicle = async () => {
			try {
				setLoading(true)
				setError(null)
				const response = await api.get(`/compraveiculos/${id}`)

				if (response.success && response.data) {
					// Mapear os dados da API para a estrutura esperada pelo componente
					const vehicleData = response.data
					setVehicle({
						id: vehicleData._id || id,
						title: vehicleData.name || 'Veículo sem título',
						price: vehicleData.price || 0,
						images: vehicleData.mainImage
							? [vehicleData.mainImage, ...(vehicleData.images || [])]
							: ['/images/i10.jpg'],
						condition: vehicleData.year >= new Date().getFullYear() ? 'Novo' : 'Usado',
						description: vehicleData.description || 'Sem descrição disponível',
						specs: {
							km: vehicleData.kilometers
								? `${vehicleData.kilometers.toLocaleString('pt-AO')} km`
								: 'N/A',
							year: vehicleData.year || 'N/A',
							location: vehicleData.location || 'N/A',
							fuel: vehicleData.fuelType
								? vehicleData.fuelType.charAt(0).toUpperCase() + vehicleData.fuelType.slice(1)
								: 'N/A',
							transmission: vehicleData.transmission
								? vehicleData.transmission.charAt(0).toUpperCase() + vehicleData.transmission.slice(1)
								: 'N/A',
							passengers: vehicleData.passangers
								? `${vehicleData.passangers} ${vehicleData.passangers === 1 ? 'lugar' : 'lugares'}`
								: 'N/A',
							color: vehicleData.color || 'N/A',
							doors: vehicleData.door
								? `${vehicleData.door} ${vehicleData.door === 1 ? 'porta' : 'portas'}`
								: 'N/A'
						},
						features: vehicleData.characteristics || [],
						financing: {
							entry: (vehicleData.price || 0) * 0.3,
							installments: 48,
							monthlyPayment: ((vehicleData.price || 0) * 0.7) / 48
						},
						included: [
							'Garantia de fábrica 3 anos',
							'Transferência de documentação',
							'Inspeção técnica completa',
							'Assistência pós-venda'
						],
						requirements: [
							'BI ou Passaporte válido'
						],
						owner: vehicleData.owner
					})
					
					// Registrar visualização
					try {
						await api.addView('sell', id)
					} catch (viewError) {
						console.error('Erro ao registrar visualização:', viewError)
						// Não interromper o fluxo se falhar ao registrar view
					}
				} else {
					setError('Veículo não encontrado')
				}
			} catch (err) {
				console.error('Erro ao buscar veículo:', err)
				setError('Erro ao carregar os dados do veículo. Tente novamente.')
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchVehicle()
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
						.filter(fav => fav.itemType === 'sell')
						.map(fav => fav.itemId)
					setIsFavorite(favoriteIds.includes(id))
				}
			} catch (error) {
				console.error('Erro ao verificar favorito:', error)
			}
		}

		checkFavorite()
	}, [id, isAuthenticated])

	useDocumentTitle(vehicle ? `${vehicle.title} - Compra - Caxiauto` : 'Carregando... - Caxiauto')

	const nextImage = () => {
		if (vehicle && vehicle.images) {
			setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
		}
	}

	const prevImage = () => {
		if (vehicle && vehicle.images) {
			setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
		}
	}

	const handleContact = () => {
		setShowContactModal(true)
	}

	const handleVisit = () => {
		setShowVisitModal(true)
	}

	const formatPrice = (price) => {
		if (price === null || price === undefined || isNaN(price) || price === 0) {
			return 'Preço sob consulta'
		}
		return new Intl.NumberFormat('pt-AO').format(price)
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
				const response = await api.addFavorite(id, 'sell')
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

	// Estado de loading
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
					<p className="text-gray-600 text-lg">Carregando detalhes do veículo...</p>
				</div>
			</div>
		)
	}

	// Estado de erro
	if (error || !vehicle) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<X className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Veículo não encontrado</h2>
					<p className="text-gray-600 mb-6">{error || 'O veículo solicitado não está disponível.'}</p>
					<button
						onClick={() => navigate('/stand/compra')}
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
					>
						Voltar para Compra
					</button>
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
						<Link to="/stand/compra" className="hover:text-indigo-600 transition-colors">Compra</Link>
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
								{vehicle.images && vehicle.images.length > 1 && (
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
									</>
								)}

								{/* Indicadores */}
								{vehicle.images && vehicle.images.length > 1 && (
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
								)}
							</div>

							{/* Miniaturas */}
							{vehicle.images && vehicle.images.length > 1 && (
								<div className="p-4 flex gap-2 overflow-x-auto">
									{vehicle.images.map((image, index) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
												} cursor-pointer`}
										>
											<img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
										</button>
									))}
								</div>
							)}
						</div>

						{/* Título e Especificações Principais */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-6">{vehicle.title}</h1>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Gauge className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Quilometragem</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.km}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Calendar className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Ano</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.year}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Droplet className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Combustível</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.fuel}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Cog className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Transmissão</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.transmission}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Users className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Passageiros</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.passengers}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<Car className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Cor</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.color}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
									<MapPin className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs text-gray-600 mb-1">Localização</span>
									<span className="font-semibold text-gray-900">{vehicle.specs.location}</span>
								</div>
								<div className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl hover:shadow-md transition-all group cursor-pointer">
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
							{vehicle.features && vehicle.features.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{vehicle.features.map((feature, index) => (
										<div key={index} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-green-50 transition-colors group cursor-pointer">
											<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="text-sm">{feature}</span>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 italic">Nenhuma característica específica informada.</p>
							)}
						</div>

						{/* O que está Incluído */}
						<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
							<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
								O que está incluso
							</h2>
							<div className="space-y-3">
								{vehicle.included.map((item, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group cursor-pointer">
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
								Requisitos para Compra
							</h2>
							<div className="space-y-3">
								{vehicle.requirements.map((req, index) => (
									<div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group cursor-pointer">
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
							{/* Card de Preço */}
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
								<h3 className="text-lg font-bold text-gray-900 mb-2">Preço de Venda</h3>

								<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
									<div className="text-3xl font-bold text-indigo-600 mb-1">
										{formatPrice(vehicle.price)}
									</div>
									{vehicle.price > 0 && (
										<div className="text-sm text-gray-600">aKz</div>
									)}
								</div>

								<button
									onClick={handleContact}
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] mb-3 cursor-pointer"
								>
									Fazer Proposta
								</button>

								<button
									onClick={handleVisit}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
								>
									Agendar Visita
								</button>
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
										href="mailto:vendas@caxiauto.com"
										className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
									>
										<Mail className="w-5 h-5" />
										<div className="text-sm">
											<div className="font-medium">vendas@caxiauto.com</div>
											<div className="text-xs text-indigo-200">Enviar e-mail</div>
										</div>
									</a>
								</div>
							</div>

							{/* Por que comprar conosco? */}
							<div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
								<h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
									<svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									Por que comprar conosco?
								</h3>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Veículos inspecionados</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Garantia de qualidade</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="font-medium">Documentação completa</span>
									</li>
									<li className="flex items-start gap-3 text-sm text-indigo-900 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
										<svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
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
						{/* Header Fixo */}
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
									Solicitar Compra
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
							{!user && (
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
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 text-sm sm:text-base"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Interesse de Compra */}
							<div className="pt-4 border-t border-gray-200">
								<h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
									<Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
									Detalhes do interesse
								</h4>

								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										<span className="flex items-center gap-1.5">
											Forma de pagamento preferencial
											<span className="text-red-500 text-base">*</span>
										</span>
									</label>
									<select
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  bg-white cursor-pointer text-sm sm:text-base font-medium"
									>
										<option value="">Selecione uma opção</option>
										<option value="vista">Aceitar  Preço - {formatPrice(vehicle.price)} aKz</option>
										<option value="financiamento">Fazer oferta (especificar na Mensagem)</option>
									</select>
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
									placeholder="Conte-nos sobre suas dúvidas, forma de interesse ou outras informações..."
								/>
							</div>

							{/* Botões de Ação */}
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

			{/* Modal de Agendamento de Visita */}
			{showVisitModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* Header */}
						<div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 rounded-t-2xl border-b border-green-500/20">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
										<Calendar className="w-6 h-6" />
										Agendar Visita
									</h3>
									<p className="text-sm sm:text-base text-green-100 leading-relaxed">
										{vehicle.title}
									</p>
								</div>
								<button
									onClick={() => setShowVisitModal(false)}
									className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
									aria-label="Fechar"
								>
									<X className="w-5 h-5 sm:w-6 sm:h-6" />
								</button>
							</div>
						</div>

						{/* Form */}
						<form
							className="p-4 sm:p-6 space-y-6"
							onSubmit={(e) => {
								e.preventDefault();
								alert('Visita agendada com sucesso! Entraremos em contato para confirmar.');
								setShowVisitModal(false);
							}}
						>
							{/* Informações Pessoais */}
							{!user && (
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
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
												placeholder="seu@email.com"
											/>
										</div>
									</div>
								</div>
							)}

							{/* Data e Hora da Visita */}
							<div className="pt-4 border-t border-gray-200">
								<h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
									<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
									Data e Hora Preferencial
								</h4>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Data
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="date"
											required
											min={new Date().toISOString().split('T')[0]}
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 bg-white cursor-pointer text-sm sm:text-base font-medium"
										/>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Horário
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<select
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 bg-white cursor-pointer text-sm sm:text-base font-medium"
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
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										Número de pessoas
									</label>
									<select
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400 focus:border-green-500 bg-white cursor-pointer text-sm sm:text-base font-medium"
									>
										<option value="1">1 pessoa</option>
										<option value="2">2 pessoas</option>
										<option value="3">3 pessoas</option>
										<option value="4">4 ou mais pessoas</option>
									</select>
								</div>
							</div>

							{/* Observações */}
							<div>
								<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
									Observações ou pedidos especiais
								</label>
								<textarea
									rows="3"
									className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400 focus:border-green-500 text-sm sm:text-base"
									placeholder="Ex: Gostaria de realizar test-drive, verificar documentação específica, etc."
								/>
							</div>

							{/* Informação adicional */}
							<div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
									<div className="text-sm text-green-900">
										<p className="font-semibold mb-1">Confirmação de agendamento</p>
										<p className="text-green-700">
											Após enviar, nossa equipe entrará em contato para confirmar a disponibilidade e fornecer detalhes sobre a localização.
										</p>
									</div>
								</div>
							</div>

							{/* Botões de Ação */}
							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
								>
									<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
									Confirmar Agendamento
								</button>
								<button
									type="button"
									onClick={() => setShowVisitModal(false)}
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
