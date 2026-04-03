import React, { useState, useEffect } from 'react';
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

const VeiculosAluguel = () => {
	useDocumentTitle('Meus Veículos para Aluguel - CaxiAuto');

	const { user } = useAuth();
	const [vehicles, setVehicles] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
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
		year: '',
		kilometers: '',
		doorCount: '',
		passengerCapacity: '',
		provincia: '',
		characteristics: [],
		priceRentDay: ''
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

	const loadVehicles = async () => {
		try {
			const response = await api.get('/vehicles/my-vehicles');
			if (response.success) {
				// Filtrar apenas veículos de aluguel (RENT ou BOTH)
				const rentVehicles = (response.data || []).filter(
					v => v.type === 'RENT' || v.type === 'BOTH'
				);
				setVehicles(rentVehicles);
			}
		} catch (error) {
			console.error('Erro ao carregar veículos:', error);
		}
	};

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
			year: '',
			kilometers: '',
			doorCount: '',
			passengerCapacity: '',
			provincia: '',
			characteristics: [],
			priceRentDay: ''
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
				year: vehicle.year || '',
				kilometers: vehicle.kilometers || '',
				doorCount: vehicle.doorCount || '',
				passengerCapacity: vehicle.passengerCapacity || '',
				provincia: vehicle.provincia || '',
				characteristics: vehicle.characteristics || [],
				priceRentDay: vehicle.priceRentDay || ''
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
		const signatureResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`);
		if (!signatureResponse.success) {
			throw new Error('Não foi possível autorizar o upload.');
		}
		const { timestamp, signature, cloudname, apikey } = signatureResponse;

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
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validação básica
		if (!formData.name || !formData.description || !formData.manufacturerId ||
			!formData.classId || !formData.year || !formData.kilometers ||
			!formData.priceRentDay || !formData.provincia || !formData.doorCount || !formData.passengerCapacity) {
			setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
			return;
		}

		if (mediaFiles.length === 0 && !editingVehicle) {
			setMessage({ type: 'error', text: 'É necessário enviar pelo menos uma imagem do veículo.' });
			return;
		}

		setLoading(true);

		try {
			// Upload de imagens
			let uploadedImages = [];
			if (mediaFiles.length > 0) {
				const imageUploadPromises = mediaFiles.map(file => uploadToCloudinary(file, 'rentCar'));
				uploadedImages = await Promise.all(imageUploadPromises);
			}

			// Upload de documentos
			let uploadedDocs = [];
			if (documentsFiles.length > 0) {
				const docUploadPromises = documentsFiles.map(file => uploadToCloudinary(file, 'rentCar'));
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
				type: 'RENT',
				year: formData.year,
				kilometers: formData.kilometers,
				priceRentDay: formData.priceRentDay,
				doorCount: formData.doorCount,
				passengerCapacity: formData.passengerCapacity,
				provincia: formData.provincia,
				characteristics: formData.characteristics,
				image: uploadedImages[0],
				gallery: uploadedImages.slice(1),
				documents: uploadedDocs
			};

			let response;
			if (editingVehicle) {
				response = await api.put(`/vehicles/${editingVehicle.id}`, vehicleData);
			} else {
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
		setConfirmTitle('Excluir Veículo');
		setConfirmMessage('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.');
		setConfirmType('danger');
		setConfirmAction(() => async () => {
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
			}
		});
		setShowConfirmModal(true);
	};

	const handleToggleStatus = (vehicleId, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
		setConfirmTitle('Alterar Status');
		setConfirmMessage(`Tem certeza que deseja tornar este veículo ${newStatus === 'ACTIVE' ? 'ativo' : 'oculto'}?`);
		setConfirmType(currentStatus === 'ACTIVE' ? 'warning' : 'success');
		setConfirmAction(() => async () => {
			try {
				const response = await api.put(`/vehicles/${vehicleId}/toggle-status`, { status: newStatus });
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
							Meus Veículos para Aluguel
						</h2>
						<p className="mt-1 text-gray-600">
							Gerencie seus veículos cadastrados para aluguel
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
			{vehicles.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
					<Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Nenhum veículo cadastrado
					</h3>
					<p className="text-gray-600 mb-6">
						Comece adicionando seu primeiro veículo para aluguel
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
								<div className="absolute top-3 right-3 flex flex-col gap-2">
									<div className={`px-3 py-1 rounded-full text-xs font-semibold ${vehicle.isAproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
										}`}>
										{vehicle.isAproved ? 'Aprovado' : 'Pendente'}
									</div>
									<div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${vehicle.status === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
										}`}>
										<Eye className="w-3 h-3" />
										{vehicle.status === 'ACTIVE' ? 'Visível' : 'Oculto'}
									</div>
								</div>
							</div>

							{/* Informações do veículo */}
							<div className="p-5">
								<h3 className="text-xl font-bold text-gray-900 mb-1">
									{vehicle.name}
								</h3>
								<p className="text-gray-600 mb-4 text-sm">
									{vehicle.Manufacturer?.name} • {vehicle.year}
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
									{vehicle.priceRentDay && (
										<div className="flex items-center gap-2 text-sm font-semibold text-[#154c9a]">
											<DollarSign className="w-4 h-4" />
											<span>{Number(vehicle.priceRentDay).toLocaleString('pt-AO')} Kz/dia</span>
										</div>
									)}
								</div>

								{/* Botões de ação */}
								<div className="flex gap-2 pt-4 border-t">
									<button
										onClick={() => handleOpenModal(vehicle)}
										className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] transition-colors cursor-pointer"
									>
										<Edit2 className="w-4 h-4" />
										Editar
									</button>
									<button
										onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
										className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${vehicle.status === 'ACTIVE'
											? 'bg-gray-500 text-white hover:bg-gray-600'
											: 'bg-blue-500 text-white hover:bg-blue-600'
											}`}
										title={vehicle.status === 'ACTIVE' ? 'Ocultar veículo' : 'Ativar veículo'}
									>
										<Power className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDelete(vehicle.id)}
										className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
										title="Excluir veículo"
									>
										<Trash2 className="w-4 h-4" />
									</button>
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
										placeholder="Ex: Toyota Corolla 2020 para Aluguel"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
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

								{/* Preço por dia */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Preço por Dia (Kz) <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="priceRentDay"
										value={formData.priceRentDay}
										onChange={handleChange}
										required
										placeholder="Ex: 25000"
										min="0"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Número de Portas */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Número de Portas <span className="text-red-500">*</span>
									</label>
									<select
										name="doorCount"
										value={formData.doorCount}
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
										name="passengerCapacity"
										value={formData.passengerCapacity}
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

								{/* Transmissão */}
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

								{/* Província */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Província <span className="text-red-500">*</span>
									</label>
									<select
										name="provincia"
										value={formData.provincia}
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
											placeholder="Ex: Ar Condicionado, GPS, Bluetooth..."
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
								</div>

								{/* Imagens do Veículo */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										<Upload className="w-5 h-5 inline mr-2" />
										Imagens do Veículo {editingVehicle ? '(opcional)' : <span className="text-red-500">*</span>}
									</label>
									<input
										type="file"
										name="media"
										accept="image/*"
										multiple
										onChange={handleMediaChange}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-700"
									/>
									<p className="text-sm text-gray-500 mt-2">
										{editingVehicle
											? 'Deixe em branco para manter as imagens atuais.'
											: 'Selecione imagens (JPG, PNG, WEBP). A primeira será a principal.'}
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
										Documentos do Veículo (imagens ou PDF)
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
										Pode enviar imagens (JPG, PNG) ou PDFs do livrete, licenciamento, inspeção, etc.
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
										placeholder="Descreva as características, condições e diferenciais do veículo para aluguel..."
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all resize-none"
									/>
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
								<button
									type="submit"
									disabled={loading}
									className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#154c9a] to-blue-600 text-white font-semibold rounded-xl hover:from-[#123f80] hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
								>
									<Save className="w-5 h-5" />
									{loading ? 'Enviando...' : (editingVehicle ? 'Salvar Alterações' : 'Adicionar Veículo')}
								</button>
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

export default VeiculosAluguel;
