import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import {
	Car,
	Plus,
	Edit2,
	Trash2,
	X,
	Save,
	Gauge,
	Fuel,
	Settings,
	MapPin,
	AlertCircle,
	Upload,
	Power,
	Eye,
	EyeOff,
	AlertTriangle,
	Shield
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { getImageUrl } from '../../services/api';
import { publicIdFromUrl } from '../../utils/cloudinary';
import axios from 'axios';
import { VehicleCardSkeleton } from '../../components/skeletons';
import ButtonLoader from '../../components/ButtonLoader';
import VerificationWarning from '../../components/VerificationWarning';
import useVerificationCheck from '../../hooks/useVerificationCheck';
import { useMyVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle, useToggleVehicleStatus, useSwapActiveVehicle } from '../../hooks/queries/useVehicles';
import { useManufacturers, useClasses } from '../../hooks/queries/useManufacturers';
import { useSellerHome } from '../../hooks/queries/useSubscription';
import { formatKz, formatPercent } from '../../utils/format';

const Veiculos = () => {
	useDocumentTitle('Meus Veículos - CaxiAuto');

	useAuthStore();
	const { isVerified, needsVerification } = useVerificationCheck();
	const { data: allVehicles, isLoading } = useMyVehicles();
	const vehicles = (allVehicles || []).filter(v => v.type === 'SALE');
	const { data: homeData } = useSellerHome();
	const commissionRate = homeData?.commissionRate ?? 0.05;
	const { data: manufacturers } = useManufacturers();
	const { data: vehicleClasses } = useClasses();
	const createVehicle = useCreateVehicle();
	const updateVehicle = useUpdateVehicle();
	const deleteVehicle = useDeleteVehicle();
	const toggleStatus = useToggleVehicleStatus();
	const [showModal, setShowModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(new Set());
	const [mediaFiles, setMediaFiles] = useState([]);
	const [newCharacteristic, setNewCharacteristic] = useState('');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmTitle, setConfirmTitle] = useState('');
	const [confirmType, setConfirmType] = useState('danger');
	const [showSwapModal, setShowSwapModal] = useState(false);
	const [swapTarget, setSwapTarget] = useState(null);
	const swapActive = useSwapActiveVehicle();

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === 'Escape') {
				setShowModal(false);
				setShowConfirmModal(false);
				setShowSwapModal(false);
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, []);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		manufacturerId: '',
		classId: '',
		fuelType: 'GASOLINE',
		transmission: 'MANUAL',
		type: 'SALE',
		year: '',
		kilometers: '',
		price: '',
		priceRent: '',
		passangers: '',
		color: '',
		location: '',
		door: '',
		characteristics: []
	});

	// Hooks de dados gerenciados pelo TanStack Query

	const formatFuelType = (type) => {
		const map = {
			'GASOLINE': 'Gasolina',
			'DIESEL': 'Diesel',
			'ELECTRIC': 'Elétrico',
			'HYBRID': 'Híbrido'
		};
		return map[type] || type;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleMediaChange = (e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		if (files.some((f) => !f.type.startsWith('image/'))) {
			setMessage({ type: 'error', text: 'Apenas imagens são permitidas (JPG, PNG, WebP, etc.).' });
			e.target.value = '';
			return;
		}

		if (files.some((f) => f.size > 10 * 1024 * 1024)) {
			setMessage({ type: 'error', text: 'Cada imagem deve ter no máximo 10 MB.' });
			e.target.value = '';
			return;
		}

		if (files.length > 10) {
			setMessage({ type: 'error', text: 'Máximo de 10 imagens por veículo.' });
			e.target.value = '';
			return;
		}

		setMediaFiles(files);
	};

	const handleAddCharacteristic = () => {
		if (newCharacteristic.trim() && !formData.characteristics.includes(newCharacteristic.trim())) {
			setFormData(prev => ({
				...prev,
				characteristics: [...prev.characteristics, newCharacteristic.trim()]
			}));
			setNewCharacteristic('');
		}
	};

	const handleRemoveCharacteristic = (charToRemove) => {
		setFormData(prev => ({
			...prev,
			characteristics: prev.characteristics.filter(c => c !== charToRemove)
		}));
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			manufacturerId: '',
			classId: '',
			fuelType: 'GASOLINE',
			transmission: 'MANUAL',
			type: 'SALE',
			year: '',
			kilometers: '',
			price: '',
			priceRent: '',
			passangers: '',
			color: '',
			location: '',
			door: '',
			characteristics: []
		});
		setMediaFiles([]);
		setNewCharacteristic('');
		setEditingVehicle(null);
	};

	const handleOpenModal = (vehicle = null) => {
		// Bloquear criação de novos veículos se não estiver verificado
		if (!vehicle && !isVerified) {
			setMessage({
				type: 'error',
				text: 'Você precisa ter a conta verificada para adicionar novos veículos. Envie seus documentos na seção de documentos.'
			});
			return;
		}

		if (vehicle) {
			setEditingVehicle(vehicle);
			setFormData({
				name: vehicle.name || '',
				description: vehicle.description || '',
				manufacturerId: vehicle.manufacturerId || vehicle.Manufacturer?.id || '',
				classId: vehicle.classId || vehicle.Class?.id || '',
				fuelType: vehicle.fuelType || 'GASOLINE',
				transmission: vehicle.transmission || 'MANUAL',
				type: vehicle.type || 'SALE',
				year: vehicle.year || '',
				kilometers: vehicle.kilometers || '',
				price: vehicle.priceSale || '',
				priceRent: vehicle.priceRentDay || '',
				passangers: vehicle.passengerCapacity || '',
				color: vehicle.color || '',
				location: vehicle.provincia || '',
				door: vehicle.doorCount || '',
				characteristics: vehicle.characteristics || []
			});
		} else {
			resetForm();
		}
		setShowModal(true);
		setMessage({ type: '', text: '' });
	};

	const handleCloseModal = () => {
		setShowModal(false);
		resetForm();
		setMessage({ type: '', text: '' });
	};

	const uploadToCloudinary = async (file, folder) => {
		try {
			// 1. Obter assinatura do backend
			const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`);

			if (!authResponse.success) {
				throw new Error('Falha ao autorizar upload');
			}

			const { timestamp, signature, cloudname, apikey } = authResponse;

			// 2. Upload para o Cloudinary
			const formData = new FormData();
			formData.append('file', file);
			formData.append('api_key', apikey);
			formData.append('timestamp', timestamp);
			formData.append('signature', signature);
			formData.append('folder', folder);


			const { data: uploadData } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, formData);
			return uploadData.secure_url;
		} catch (error) {
			console.error('Erro no upload:', error);
			throw error;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validação básica
		if (!formData.name || !formData.description || !formData.manufacturerId ||
			!formData.classId || !formData.year || !formData.kilometers ||
			!formData.price || !formData.passangers ||
			!formData.location || !formData.door) {
			setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
			return;
		}

		if (mediaFiles.length === 0 && !editingVehicle) {
			setMessage({ type: 'error', text: 'É necessário enviar pelo menos uma imagem do veículo.' });
			return;
		}

		setLoading(true);
		setMessage({ type: 'info', text: 'Processando uploads... Por favor, aguarde.' });

		try {
			// Upload de imagens (com rollback se algum falhar)
			let uploadedImages = [];
			if (mediaFiles.length > 0) {
				const results = await Promise.allSettled(
					mediaFiles.map(file => uploadToCloudinary(file, 'sellCar'))
				);
				const failed = results.some(r => r.status === 'rejected');
				if (failed) {
					await Promise.allSettled(
						results
							.filter(r => r.status === 'fulfilled')
							.map(r => api.deleteCloudinaryResource(publicIdFromUrl(r.value)))
					);
					throw new Error('Falha ao enviar algumas imagens. Tente novamente.');
				}
				uploadedImages = results.map(r => r.value);
			}

			// Preparar dados para envio (mapeados para o schema Vehicle)
			const vehicleData = {
				name: formData.name,
				description: formData.description,
				manufacturerId: formData.manufacturerId,
				classId: formData.classId,
				fuelType: formData.fuelType,
				transmission: formData.transmission,
				type: formData.type,
				year: formData.year,
				kilometers: formData.kilometers,
				priceSale: formData.price,
				priceRentDay: formData.priceRent || null,
				passengerCapacity: formData.passangers,
				doorCount: formData.door,
				provincia: formData.location,
				characteristics: formData.characteristics,
				color: formData.color || null
			};

			// Adicionar imagem principal e galeria se houver
			if (uploadedImages.length > 0) {
				vehicleData.image = uploadedImages[0];
				vehicleData.gallery = uploadedImages.slice(1);
			}

			let response;
			if (editingVehicle) {
				response = await updateVehicle.mutateAsync({ id: editingVehicle.id, data: vehicleData });
			} else {
				response = await createVehicle.mutateAsync(vehicleData);
			}

			if (response.success) {
				const successMessage = editingVehicle
					? 'Edição solicitada com sucesso! Aguardando aprovação do administrador.'
					: response.message || 'Veículo cadastrado com sucesso! Aguardando aprovação.';

				setMessage({ type: 'success', text: successMessage });
				setTimeout(() => {
					handleCloseModal();
				}, 3000);
			} else {
				const errorMessage = editingVehicle
					? response.message || 'Erro ao solicitar edição.'
					: response.message || 'Erro ao cadastrar veículo.';
				setMessage({ type: 'error', text: errorMessage });
			}
		} catch (error) {
			console.error('Erro ao processar veículo:', error);
			const errorText = editingVehicle
				? `Erro ao solicitar edição: ${error.message}`
				: `Erro ao cadastrar veículo: ${error.message}`;
			setMessage({ type: 'error', text: errorText });
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = (vehicleId) => {
		if (actionLoading.has(`delete-${vehicleId}`)) return;
		setConfirmTitle('Excluir Veículo');
		setConfirmMessage('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.');
		setConfirmType('danger');
		setConfirmAction(() => async () => {
			setActionLoading(prev => new Set(prev).add(`delete-${vehicleId}`));
			try {
				const response = await deleteVehicle.mutateAsync(vehicleId);
				if (response.success) {
					setMessage({ type: 'success', text: 'Veículo excluído com sucesso!' });
					setTimeout(() => setMessage({ type: '', text: '' }), 3000);
				} else {
					setMessage({ type: 'error', text: response.message || 'Erro ao excluir veículo.' });
				}
			} catch (error) {
				console.error('Erro ao excluir veículo:', error);
				setMessage({ type: 'error', text: 'Erro ao excluir veículo.' });
			} finally {
				setActionLoading(prev => {
					const next = new Set(prev);
					next.delete(`delete-${vehicleId}`);
					return next;
				});
			}
		});
		setShowConfirmModal(true);
	};

	const handleToggleStatus = (vehicleId, currentStatus) => {
		if (actionLoading.has(`toggle-${vehicleId}`)) return;
		const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
		setConfirmTitle('Alterar Status');
		setConfirmMessage(`Tem certeza que deseja tornar este veículo ${newStatus === 'ACTIVE' ? 'ativo' : 'oculto'}?`);
		setConfirmType(currentStatus === 'ACTIVE' ? 'warning' : 'success');
		setConfirmAction(() => async () => {
			setActionLoading(prev => new Set(prev).add(`toggle-${vehicleId}`));
			try {
				const response = await toggleStatus.mutateAsync({ id: vehicleId, status: newStatus });
				if (response.success) {
					setMessage({ type: 'success', text: response.message || 'Status alterado com sucesso!' });
					setTimeout(() => setMessage({ type: '', text: '' }), 3000);
				} else {
					setMessage({ type: 'error', text: response.message || 'Erro ao alterar status.' });
				}
			} catch (error) {
				console.error('Erro ao alterar status:', error);
				setMessage({ type: 'error', text: 'Erro ao alterar status do veículo.' });
			} finally {
				setActionLoading(prev => {
					const next = new Set(prev);
					next.delete(`toggle-${vehicleId}`);
					return next;
				});
			}
		});
		setShowConfirmModal(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							<Car className="w-7 h-7 text-[#154c9a]" />
							Meus Veículos
						</h2>
						<p className="mt-1 text-gray-600">
							Gerencie seus veículos cadastrados
						</p>
					</div>
					<button
						onClick={() => handleOpenModal()}
						disabled={!isVerified}
						className="flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#123f80]"
						title={!isVerified ? 'Conta não verificada. Envie seus documentos para adicionar veículos.' : ''}
					>
						{!isVerified ? <Shield className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
						Adicionar Veículo
					</button>
				</div>
			</div>

			{/* Aviso de verificação */}
			{needsVerification && (
				<VerificationWarning variant="compact" />
			)}

			{/* Comissão ativa */}
			<div className="bg-[#eef3fa] border border-[#c9d9ef] rounded-lg p-5">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-start gap-3 min-w-0">
						<span className="inline-flex items-center justify-center w-9 h-9 bg-[#154c9a] text-white text-sm font-bold rounded-lg flex-shrink-0 mt-0.5">
							AKZ
						</span>
						<div>
							<p className="font-semibold text-gray-900">
								Comissão Caxiauto: {formatPercent(commissionRate)} por venda
							</p>
							<p className="text-sm text-gray-600 mt-0.5">
								A secção Stand não exige plano — a Caxiauto retém {formatPercent(commissionRate)} do valor de
								venda quando o negócio é fechado e o restante é seu.
							</p>
						</div>
					</div>
					<div className="bg-white rounded-lg border border-[#c9d9ef] px-4 py-3 text-sm">
						<p className="text-gray-500 mb-1">Exemplo de divisão</p>
						<div className="space-y-0.5 font-medium text-gray-900">
							<p>Venda: {formatKz(5000000)}</p>
							<p>Comissão ({formatPercent(commissionRate)}): −{formatKz(5000000 * commissionRate)}</p>
							<p className="text-[#154c9a]">Você recebe: {formatKz(5000000 * (1 - commissionRate))}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Mensagem de feedback */}
			{message.text && (
				<div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
				}`}>
					<AlertCircle className="w-5 h-5" />
					{message.text}
				</div>
			)}

			{/* Lista de veículos */}
			{isLoading ? (
				<VehicleCardSkeleton count={4} />
			) : vehicles.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
					<Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Nenhum veículo cadastrado
					</h3>
					<p className="text-gray-600 mb-6">
						Comece adicionando seu primeiro veículo
					</p>
					<button
						onClick={() => handleOpenModal()}
						disabled={!isVerified}
						className="inline-flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#123f80]"
					>
						{!isVerified ? <Shield className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
						Adicionar Veículo
					</button>
					{!isVerified && (
						<p className="text-sm text-yellow-700 mt-4 font-medium">
							⚠️ Você precisa enviar seus documentos para adicionar veículos.
						</p>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{vehicles.map(vehicle => (
						<div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
							{/* Imagem do veículo */}
							<div className="h-48 bg-gray-200 relative">
								{vehicle.image ? (
									<img
										src={getImageUrl(vehicle.image)}
										alt={vehicle.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Car className="w-16 h-16 text-gray-400" />
									</div>
								)}
								<div className="absolute top-3 right-3 flex gap-2">
									<div className={`px-3 py-1 rounded-full text-xs font-semibold ${vehicle.aproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
									}`}>
										{vehicle.aproved ? 'Aprovado' : 'Pendente'}
									</div>
									{vehicle.status === 'HIDDEN' && vehicle.type === 'RENT' ? (
										<div className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
											Oculto — limite do plano
										</div>
									) : (
										<div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${vehicle.status === 'ACTIVE' ? 'bg-blue-500 text-white' : vehicle.status === 'RENTED' ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'
										}`}>
											{vehicle.status === 'ACTIVE' ? <Eye className="w-3 h-3" /> : vehicle.status === 'RENTED' ? <Power className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
											{vehicle.status === 'ACTIVE' ? 'Visível' : vehicle.status === 'RENTED' ? 'Alugado' : 'Oculto'}
										</div>
									)}
								</div>
							</div>

							{/* Informações do veículo */}
							<div className="p-5">
								<h3 className="text-xl font-bold text-gray-900 mb-1">
									{vehicle.name}
								</h3>
								<p className="text-gray-600 mb-4 text-sm">
									{vehicle.Manufacturer?.name} • {vehicle.year} • {vehicle.color}
								</p>

								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Gauge className="w-4 h-4 text-[#154c9a]" />
										<span>{vehicle.kilometers ? `${vehicle.kilometers.toLocaleString()} km` : 'Não informado'}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Fuel className="w-4 h-4 text-[#154c9a]" />
										<span>{formatFuelType(vehicle.fuelType)}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Settings className="w-4 h-4 text-[#154c9a]" />
										<span className="capitalize">{vehicle.transmission}</span>
									</div>
									{vehicle.provincia && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin className="w-4 h-4 text-[#154c9a]" />
											<span>{vehicle.provincia}</span>
										</div>
									)}
									{vehicle.priceSale && (
										<div className="flex items-center gap-2 text-sm font-semibold text-[#154c9a]">
											<span className="inline-flex items-center px-1.5 py-0.5 bg-[#eef3fa] text-[#154c9a] text-xs font-bold rounded-md">AKZ</span>
											<span>{formatKz(vehicle.priceSale)}</span>
										</div>
									)}
								</div>

								{/* Divisão da comissão */}
								{vehicle.priceSale && (
									<div className="mb-4 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600">
										<span>
											Comissão ({formatPercent(commissionRate)}): {formatKz(Number(vehicle.priceSale) * commissionRate)}
										</span>
										<span className="mx-1.5 text-gray-300">|</span>
										<span className="font-semibold text-emerald-700">
											Você recebe: {formatKz(Number(vehicle.priceSale) * (1 - commissionRate))}
										</span>
									</div>
								)}

								{/* Estatísticas de visualizações */}
								<div className="flex items-center justify-between pt-3 border-t">
									<div className="flex items-center gap-2 text-sm">
										<Eye className="w-4 h-4 text-purple-500" />
										<span className="font-medium text-purple-600">
											{vehicle.viewCount || 0}
										</span>
										<span className="text-gray-500">total</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<Eye className="w-4 h-4 text-blue-500" />
										<span className="font-medium text-blue-600">
											{vehicle.todayViewCount || 0}
										</span>
										<span className="text-gray-500">hoje</span>
									</div>
								</div>

								{/* Botões de ação */}
								<div className="flex gap-2 pt-4 border-t">
									<ButtonLoader
										onClick={() => handleOpenModal(vehicle)}
										variant="primary"
										className="flex-1"
										size="sm"
									>
										<Edit2 className="w-4 h-4" />
										Editar
									</ButtonLoader>
									{vehicle.status === 'HIDDEN' && vehicle.type === 'RENT' ? (
										<ButtonLoader
											onClick={() => { setSwapTarget(vehicle); setShowSwapModal(true); }}
											variant="success"
											size="sm"
											title="Ativar este veículo (desativa outro)"
										>
											<Eye className="w-4 h-4" />
											Ativar
										</ButtonLoader>
									) : vehicle.status === 'RENTED' ? (
										<ButtonLoader
											variant="warning"
											size="sm"
											title="Veículo em aluguer — estado gerido pela plataforma"
											loading={false}
											loadingText=""
										>
											<Power className="w-4 h-4" />
											Alugado
										</ButtonLoader>
									) : (
										<ButtonLoader
											onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
											loading={actionLoading.has(`toggle-${vehicle.id}`)}
											loadingText=""
											variant={vehicle.status === 'ACTIVE' ? 'warning' : 'success'}
											size="sm"
											title={vehicle.status === 'ACTIVE' ? 'Desativar veículo' : 'Ativar veículo'}
										>
											<Power className="w-4 h-4" />
										</ButtonLoader>
									)}
									<ButtonLoader
										onClick={() => handleDelete(vehicle.id)}
										loading={actionLoading.has(`delete-${vehicle.id}`)}
										loadingText=""
										variant="danger"
										size="sm"
										title="Excluir veículo"
									>
										<Trash2 className="w-4 h-4" />
									</ButtonLoader>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal de formulário */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-gradient-to-r from-[#154c9a] to-blue-600 px-8 py-6 flex items-center justify-between z-10">
							<h2 className="text-2xl font-bold text-white flex items-center gap-3">
								<div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
									<Car className="w-6 h-6 text-white" />
								</div>
								{editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
							</h2>
							<button
								onClick={handleCloseModal}
								className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-8">
							{message.text && (
								<div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${message.type === 'success'
									? 'bg-green-50 text-green-800 border-2 border-green-200'
									: 'bg-red-50 text-red-800 border-2 border-red-200'
								}`}>
									<AlertCircle className="w-5 h-5" />
									{message.text}
								</div>
							)}

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Título do Veículo */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Título do Anúncio <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Ex: Toyota Corolla 2020 XEI Automático"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
									<p className="text-sm text-gray-500 mt-2">Título que aparecerá no anúncio do veículo</p>
								</div>

								{/* Marca */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Marca <span className="text-red-500">*</span>
									</label>
									<select
										name="manufacturerId"
										value={formData.manufacturerId}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione a marca</option>
										{manufacturers.map(m => (
											<option key={m.id} value={m.id}>{m.name}</option>
										))}
									</select>
								</div>

								{/* Classe/Tipo */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Tipo/Classe <span className="text-red-500">*</span>
									</label>
									<select
										name="classId"
										value={formData.classId}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione o tipo</option>
										{vehicleClasses.map(c => (
											<option key={c.id} value={c.id}>{c.name}</option>
										))}
									</select>
								</div>

								{/* Ano */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Ano <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="year"
										value={formData.year}
										onChange={handleChange}
										required
										placeholder="Ex: 2020"
										min="1990"
										max={new Date().getFullYear() + 1}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Cor */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Cor <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="color"
										value={formData.color}
										onChange={handleChange}
										required
										placeholder="Ex: Preto, Branco, Prata"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Número de Portas */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Número de Portas <span className="text-red-500">*</span>
									</label>
									<select
										name="door"
										value={formData.door}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione</option>
										<option value="2">2 portas</option>
										<option value="3">3 portas</option>
										<option value="4">4 portas</option>
										<option value="5">5 portas</option>
									</select>
								</div>

								{/* Número de Passageiros */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Número de Passageiros <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="passangers"
										value={formData.passangers}
										onChange={handleChange}
										required
										placeholder="Ex: 5"
										min="1"
										max="50"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Quilometragem */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Quilometragem (km) <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="kilometers"
										value={formData.kilometers}
										onChange={handleChange}
										required
										placeholder="Ex: 50000"
										min="0"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Combustível */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Tipo de Combustível <span className="text-red-500">*</span>
									</label>
									<select
										name="fuelType"
										value={formData.fuelType}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="GASOLINE">Gasolina</option>
										<option value="DIESEL">Diesel</option>
										<option value="ELECTRIC">Elétrico</option>
										<option value="HYBRID">Híbrido</option>
									</select>
								</div>

								{/* Câmbio */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Transmissão <span className="text-red-500">*</span>
									</label>
									<select
										name="transmission"
										value={formData.transmission}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="MANUAL">Manual</option>
										<option value="AUTOMATIC">Automática</option>
										<option value="SEMI_AUTOMATIC">Semi-Automática</option>
									</select>
								</div>

								{/* Preço */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Preço (Kz) <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleChange}
										required
										placeholder="Ex: 15000000"
										min="0"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Localização (Província) */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Província <span className="text-red-500">*</span>
									</label>
									<select
										name="location"
										value={formData.location}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione uma província</option>
										<option value="LUANDA">Luanda</option>
										<option value="BENGUELA">Benguela</option>
										<option value="HUAMBO">Huambo</option>
										<option value="HUILA">Huíla</option>
										<option value="CABINDA">Cabinda</option>
										<option value="NAMIBE">Namibe</option>
										<option value="BENGO">Bengo</option>
										<option value="CUANZA_NORTE">Cuanza Norte</option>
										<option value="CUANZA_SUL">Cuanza Sul</option>
										<option value="CUNENE">Cunene</option>
										<option value="BIE">Bié</option>
										<option value="MOXICO">Moxico</option>
										<option value="LUNDA_NORTE">Lunda Norte</option>
										<option value="LUNDA_SUL">Lunda Sul</option>
										<option value="UIGE">Uíge</option>
										<option value="ZAIRE">Zaire</option>
										<option value="CUANDO_CUBANGO">Cuando Cubango</option>
										<option value="MALANJE">Malanje</option>
									</select>
								</div>

								{/* Características */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Características
									</label>
									<div className="flex gap-2 mb-3">
										<input
											type="text"
											value={newCharacteristic}
											onChange={(e) => setNewCharacteristic(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCharacteristic())}
											placeholder="Ex: Ar Condicionado, Vidro Elétrico..."
											className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
										/>
										<button
											type="button"
											onClick={handleAddCharacteristic}
											className="px-6 py-3 bg-[#154c9a] text-white font-semibold rounded-xl hover:bg-[#123f80] transition-colors"
										>
											Adicionar
										</button>
									</div>

									{formData.characteristics.length > 0 && (
										<div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
											{formData.characteristics.map((char, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm shadow-sm"
												>
													{char}
													<button
														type="button"
														onClick={() => handleRemoveCharacteristic(char)}
														className="text-gray-400 hover:text-red-500 transition-colors"
													>
														<X className="w-4 h-4" />
													</button>
												</span>
											))}
										</div>
									)}
									<p className="text-sm text-gray-500 mt-2">Adicione características opcionais para valorizar seu veículo</p>
								</div>

								{/* Imagens/Mídias */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										<Upload className="w-5 h-5 inline mr-2" />
										Imagens do Veículo {editingVehicle ? '(opcional - envie apenas se quiser alterar)' : <span className="text-red-500">* (mínimo 1)</span>}
									</label>
									<input
										type="file"
										name="media"
										accept="image/*"
										multiple
										onChange={handleMediaChange}
										required={!editingVehicle}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-700"
									/>
									<p className="text-sm text-gray-500 mt-2">
										{editingVehicle
											? 'Deixe em branco para manter as imagens atuais. Se enviar novas imagens, elas substituirão as anteriores.'
											: 'Selecione até 10 imagens (JPG, PNG, WEBP, GIF). A primeira imagem será a principal.'}
									</p>
									{mediaFiles.length > 0 && (
										<p className="text-sm text-green-600 mt-2 font-semibold">
											{mediaFiles.length} arquivo(s) selecionado(s)
										</p>
									)}
								</div>

								{/* Descrição */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Descrição <span className="text-red-500">*</span>
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleChange}
										required
										rows="4"
										placeholder="Descreva as características, condições e diferenciais do veículo..."
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all resize-none"
									/>
									<p className="text-sm text-gray-500 mt-2">Informações adicionais que possam interessar aos compradores (mínimo 10 caracteres)</p>
								</div>
							</div>

							{/* Botões do formulário */}
							<div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-100">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
								>
									Cancelar
								</button>
								<ButtonLoader
									type="submit"
									loading={loading}
									loadingText="Enviando..."
									variant="primary"
									size="lg"
									disabled={!isVerified && !editingVehicle}
									className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{!isVerified && !editingVehicle ? <Shield className="w-5 h-5" /> : <Save className="w-5 h-5" />}
									{editingVehicle ? 'Salvar Alterações' : (!isVerified ? 'Conta Não Verificada' : 'Adicionar Veículo')}
								</ButtonLoader>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal de Swap */}
			{showSwapModal && swapTarget && (
				<div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
						<div className="bg-gradient-to-r from-[#154c9a] to-[#123f80] px-6 py-5 rounded-t-2xl">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold text-white">Ativar Veículo</h3>
								<button onClick={() => { setShowSwapModal(false); setSwapTarget(null); }} className="text-white/80 hover:text-white cursor-pointer">
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-4">
								Para ativar <strong>{swapTarget.name}</strong>, precisa desativar outro veículo de aluguer ativo. Selecione qual deseja desativar:
							</p>
							<div className="space-y-2 max-h-60 overflow-y-auto">
								{vehicles
									.filter(v => v.id !== swapTarget.id && v.type === 'RENT' && (v.status === 'ACTIVE'))
									.map(v => (
										<button
											key={v.id}
											onClick={async () => {
												try {
													const res = await swapActive.mutateAsync({ activateId: swapTarget.id, deactivateId: v.id });
													if (res.success) {
														setMessage({ type: 'success', text: 'Veículos trocados com sucesso!' });
														setTimeout(() => setMessage({ type: '', text: '' }), 3000);
													} else {
														setMessage({ type: 'error', text: res.message || 'Erro ao trocar' });
													}
												} catch {
													setMessage({ type: 'error', text: 'Erro ao trocar veículos' });
												}
												setShowSwapModal(false);
												setSwapTarget(null);
											}}
											className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#154c9a] hover:bg-blue-50 transition-all cursor-pointer"
										>
											<div className="flex items-center gap-3">
												<Car className="w-5 h-5 text-gray-400" />
												<div>
													<p className="font-medium text-gray-900">{v.name}</p>
													<p className="text-xs text-gray-500">{v.Manufacturer?.name} • {v.year}</p>
												</div>
											</div>
										</button>
									))}
								{vehicles.filter(v => v.id !== swapTarget.id && v.type === 'RENT' && (v.status === 'ACTIVE')).length === 0 && (
									<p className="text-gray-500 text-center py-4">Nenhum veículo de aluguer ativo disponível para desativar.</p>
								)}
							</div>
							<div className="mt-6">
								<button
									onClick={() => { setShowSwapModal(false); setSwapTarget(null); }}
									className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Modal de Confirmação */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
						<div className={`px-6 py-5 border-b ${confirmType === 'danger' ? 'bg-red-50 border-red-200' :
							confirmType === 'warning' ? 'bg-orange-50 border-orange-200' :
								'bg-green-50 border-green-200'
						}`}>
							<div className="flex items-center gap-3">
								<div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmType === 'danger' ? 'bg-red-100' :
									confirmType === 'warning' ? 'bg-orange-100' :
										'bg-green-100'
								}`}>
									<AlertTriangle className={`w-6 h-6 ${confirmType === 'danger' ? 'text-red-600' :
										confirmType === 'warning' ? 'text-orange-600' :
											'text-green-600'
									}`} />
								</div>
								<h3 className="text-xl font-bold text-gray-900">{confirmTitle}</h3>
							</div>
						</div>
						<div className="px-6 py-6">
							<p className="text-gray-700 text-base leading-relaxed">{confirmMessage}</p>
						</div>
						<div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
							<button
								onClick={() => {
									setShowConfirmModal(false);
									setConfirmAction(null);
								}}
								className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
							>
								Cancelar
							</button>
							<button
								onClick={async () => {
									if (confirmAction) {
										await confirmAction();
									}
									setShowConfirmModal(false);
									setConfirmAction(null);
								}}
								className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-colors cursor-pointer ${confirmType === 'danger' ? 'bg-red-600 hover:bg-red-700' :
									confirmType === 'warning' ? 'bg-orange-500 hover:bg-orange-600' :
										'bg-green-600 hover:bg-green-700'
								}`}
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Veiculos;
