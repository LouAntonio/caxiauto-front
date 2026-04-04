import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
	DollarSign,
	AlertCircle,
	Upload,
	FileText,
	Power,
	Eye,
	EyeOff,
	AlertTriangle,
	ImageIcon
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { API_URL, getImageUrl } from '../../services/api';
import { VehicleCardSkeleton } from '../../components/skeletons';
import ButtonLoader from '../../components/ButtonLoader';

const Veiculos = () => {
	useDocumentTitle('Meus Veículos - CaxiAuto');

	const { user } = useAuth();
	const [vehicles, setVehicles] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(new Set());
	const [isFetching, setIsFetching] = useState(false);
	const abortControllerRef = useRef(null);
	const [mediaFiles, setMediaFiles] = useState([]);
	const [documentsFiles, setDocumentsFiles] = useState([]);
	const [newCharacteristic, setNewCharacteristic] = useState('');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmTitle, setConfirmTitle] = useState('');
	const [confirmType, setConfirmType] = useState('danger');
	const [manufacturers, setManufacturers] = useState([]);
	const [vehicleClasses, setVehicleClasses] = useState([]);
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

	// Carregar veículos e dados de referência
	useEffect(() => {
		if (user) {
			loadVehicles();
		}
		loadManufacturers();
		loadClasses();
	}, [user]);

	const loadManufacturers = async () => {
		try {
			const response = await api.getManufacturers();
			if (response.success) {
				setManufacturers(response.data);
			}
		} catch (error) {
			console.error('Erro ao carregar fabricantes:', error);
		}
	};

	const loadClasses = async () => {
		try {
			const response = await api.getClasses();
			if (response.success) {
				setVehicleClasses(response.data);
			}
		} catch (error) {
			console.error('Erro ao carregar classes:', error);
		}
	};

	const loadVehicles = useCallback(async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		if (isFetching) return;

		const controller = new AbortController();
		abortControllerRef.current = controller;
		setIsFetching(true);

		try {
			const response = await api.get('/vehicles/my-vehicles');
			if (!controller.signal.aborted && response.success) {
				setVehicles(response.data);
			}
		} catch (error) {
			if (!controller.signal.aborted) {
				console.error('Erro ao carregar veículos:', error);
			}
		} finally {
			if (!controller.signal.aborted) {
				setIsFetching(false);
			}
		}
	}, [isFetching]);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

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
		const files = Array.from(e.target.files);
		setMediaFiles(files);
	};

	const handleDocumentsChange = (e) => {
		const files = Array.from(e.target.files);
		setDocumentsFiles(prev => [...prev, ...files]);
	};

	const handleRemoveDocument = (index) => {
		setDocumentsFiles(prev => prev.filter((_, i) => i !== index));
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
		setDocumentsFiles([]);
		setNewCharacteristic('');
		setEditingVehicle(null);
	};

	const handleOpenModal = (vehicle = null) => {
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


			const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json();
				throw new Error(errorData.error?.message || 'Erro no upload para Cloudinary');
			}

			const data = await uploadResponse.json();
			return data.secure_url;
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
			!formData.price || !formData.passangers || !formData.color ||
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
			// Upload de imagens
			let uploadedImages = [];
			if (mediaFiles.length > 0) {
				const imageUploadPromises = mediaFiles.map(file => uploadToCloudinary(file, 'sellCar'));
				uploadedImages = await Promise.all(imageUploadPromises);
			}

			// Upload de documentos (imagens e/ou PDFs)
			let uploadedDocs = [];
			if (documentsFiles.length > 0) {
				const docUploadPromises = documentsFiles.map(file => uploadToCloudinary(file, 'sellCar'));
				uploadedDocs = await Promise.all(docUploadPromises);
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
				characteristics: formData.characteristics
			};

			// Adicionar imagem principal e galeria se houver
			if (uploadedImages.length > 0) {
				vehicleData.image = uploadedImages[0];
				vehicleData.gallery = uploadedImages.slice(1);
			}

			// Adicionar documentos se houver
			if (uploadedDocs.length > 0) {
				vehicleData.documents = uploadedDocs;
			}

			console.log('Dados a enviar:', vehicleData);

			let response;
			if (editingVehicle) {
				// Edição - envia para rota de edição com aprovação
				response = await api.put(`/vehicles/${editingVehicle.id}`, vehicleData);
			} else {
				// Criação - envia normalmente
				response = await api.post('/vehicles', vehicleData);
			}

			if (response.success) {
				const successMessage = editingVehicle
					? 'Edição solicitada com sucesso! Aguardando aprovação do administrador.'
					: response.message || 'Veículo cadastrado com sucesso! Aguardando aprovação.';

				setMessage({ type: 'success', text: successMessage });
				await loadVehicles();
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
				const response = await api.delete(`/vehicles/${vehicleId}`);
				if (response.success) {
					setMessage({ type: 'success', text: 'Veículo excluído com sucesso!' });
					await loadVehicles();
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
		const newStatus = currentStatus === 'active' ? 'inativo' : 'ativo';
		setConfirmTitle('Alterar Status');
		setConfirmMessage(`Tem certeza que deseja tornar este veículo ${newStatus}?`);
		setConfirmType(currentStatus === 'active' ? 'warning' : 'success');
		setConfirmAction(() => async () => {
			setActionLoading(prev => new Set(prev).add(`toggle-${vehicleId}`));
			try {
				const response = await api.put(`/vehicles/${vehicleId}/toggle-status`);
				if (response.success) {
					setMessage({ type: 'success', text: response.message || 'Status alterado com sucesso!' });
					await loadVehicles();
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
						className="flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors shadow-md cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Adicionar Veículo
					</button>
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
			{isFetching ? (
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
						className="inline-flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Adicionar Veículo
					</button>
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
									<div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${vehicle.status === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
										}`}>
										{vehicle.status === 'active' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
										{vehicle.status === 'active' ? 'Visível' : 'Oculto'}
									</div>
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
											<DollarSign className="w-4 h-4" />
											<span>{vehicle.priceSale.toLocaleString()} Kz</span>
										</div>
									)}
								</div>

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
									<ButtonLoader
										onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
										loading={actionLoading.has(`toggle-${vehicle.id}`)}
										loadingText=""
										variant={vehicle.status === 'active' ? 'warning' : 'success'}
										size="sm"
										title={vehicle.status === 'active' ? 'Desativar veículo' : 'Ativar veículo'}
									>
										<Power className="w-4 h-4" />
									</ButtonLoader>
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
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCharacteristic())}
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

								{/* Documentos do Veículo (imagens + PDF) */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										<FileText className="w-5 h-5 inline mr-2" />
										Documentos do Veículo (imagens ou PDF) {editingVehicle ? '(opcional)' : <span className="text-red-500">*</span>}
									</label>
									<input
										type="file"
										name="documents"
										accept="image/*,application/pdf"
										multiple
										onChange={handleDocumentsChange}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-green-700"
									/>
									<p className="text-sm text-gray-500 mt-2">
										{editingVehicle
											? 'Envie apenas se quiser adicionar ou atualizar documentos.'
											: 'Pode enviar imagens (JPG, PNG) ou PDFs do livrete, licenciamento, inspeção, etc.'}
									</p>
									{documentsFiles.length > 0 && (
										<div className="mt-3 space-y-2">
											<p className="text-sm font-semibold text-gray-700">Ficheiros selecionados ({documentsFiles.length}):</p>
											{documentsFiles.map((file, index) => (
												<div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
													<div className="flex items-center gap-2 min-w-0 flex-1">
														{file.type === 'application/pdf' ? (
															<FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
														) : (
															<ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
														)}
														<span className="text-sm text-gray-600 truncate">{file.name}</span>
														<span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
													</div>
													<button
														type="button"
														onClick={() => handleRemoveDocument(index)}
														className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											))}
										</div>
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
									className="flex-1"
								>
									<Save className="w-5 h-5" />
									{editingVehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}
								</ButtonLoader>
							</div>
						</form>
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
