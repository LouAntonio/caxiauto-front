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
	AlertTriangle
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { API_URL, getImageUrl } from '../../services/api';

const Veiculos = () => {
	useDocumentTitle('Meus Veículos - CaxiAuto');

	const { user } = useAuth();
	const [vehicles, setVehicles] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
	const [mediaFiles, setMediaFiles] = useState([]);
	const [livreteFile, setLivreteFile] = useState(null);
	const [newCharacteristic, setNewCharacteristic] = useState('');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmTitle, setConfirmTitle] = useState('');
	const [confirmType, setConfirmType] = useState('danger');
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		manufacturer: '',
		class: '',
		fuelType: 'gasolina',
		transmission: 'manual',
		year: '',
		kilometers: '',
		price: '',
		passangers: '',
		color: '',
		location: '',
		door: '',
		characteristics: []
	});

	// Carregar veículos do usuário
	useEffect(() => {
		if (user) {
			loadVehicles();
		}
	}, [user]);

	const loadVehicles = async () => {
		try {
			const response = await api.get('/compraveiculos?myVehicles=true');
			if (response.success) {
				setVehicles(response.data);
			}
		} catch (error) {
			console.error('Erro ao carregar veículos:', error);
		}
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

	const handleLivreteChange = (e) => {
		const file = e.target.files[0];
		setLivreteFile(file);
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
			manufacturer: '',
			class: '',
			fuelType: 'gasolina',
			transmission: 'manual',
			year: '',
			kilometers: '',
			price: '',
			passangers: '',
			color: '',
			location: '',
			door: '',
			characteristics: []
		});
		setMediaFiles([]);
		setLivreteFile(null);
		setNewCharacteristic('');
		setEditingVehicle(null);
	};

	const handleOpenModal = (vehicle = null) => {
		if (vehicle) {
			setEditingVehicle(vehicle);
			setFormData({
				name: vehicle.name || '',
				description: vehicle.description || '',
				manufacturer: vehicle.manufacturer || '',
				class: vehicle.class || '',
				fuelType: vehicle.fuelType || 'gasolina',
				transmission: vehicle.transmission || 'manual',
				year: vehicle.year || '',
				kilometers: vehicle.kilometers || '',
				price: vehicle.price || '',
				passangers: vehicle.passangers || '',
				color: vehicle.color || '',
				location: vehicle.location || '',
				door: vehicle.door || '',
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validação básica
		if (!formData.name || !formData.description || !formData.manufacturer ||
			!formData.class || !formData.year || !formData.kilometers ||
			!formData.price || !formData.passangers || !formData.color ||
			!formData.location || !formData.door) {
			setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
			return;
		}

		if (mediaFiles.length === 0 && !editingVehicle) {
			setMessage({ type: 'error', text: 'É necessário enviar pelo menos uma imagem do veículo.' });
			return;
		}

		if (!livreteFile && !editingVehicle) {
			setMessage({ type: 'error', text: 'É necessário enviar o documento do veículo (livrete).' });
			return;
		}

		setLoading(true);

		try {
			const formDataToSend = new FormData();

			// Adicionar campos do formulário
			formDataToSend.append('name', formData.name);
			formDataToSend.append('description', formData.description);
			formDataToSend.append('manufacturer', formData.manufacturer);
			formDataToSend.append('vehicleClass', formData.class);
			formDataToSend.append('fuelType', formData.fuelType);
			formDataToSend.append('transmission', formData.transmission);
			formDataToSend.append('year', formData.year);
			formDataToSend.append('kilometers', formData.kilometers);
			formDataToSend.append('price', formData.price);
			formDataToSend.append('passangers', formData.passangers);
			formDataToSend.append('color', formData.color);
			formDataToSend.append('location', formData.location);
			formDataToSend.append('door', formData.door);
			formDataToSend.append('characteristics', JSON.stringify(formData.characteristics));

			// Adicionar arquivos de mídia se houver
			if (mediaFiles.length > 0) {
				mediaFiles.forEach(file => {
					formDataToSend.append('media', file);
				});
			}

			// Adicionar livrete se houver
			if (livreteFile) {
				formDataToSend.append('livreto', livreteFile);
			}

			let response;
			if (editingVehicle) {
				// Edição - envia para rota de edição com aprovação
				response = await api.uploadPut(`/compraveiculos/${editingVehicle._id}/edit`, formDataToSend);
			} else {
				// Criação - envia normalmente
				response = await api.upload('/compraveiculos', formDataToSend);
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
				? 'Erro ao solicitar edição. Tente novamente.' 
				: 'Erro ao cadastrar veículo. Tente novamente.';
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
				const response = await api.delete(`/compraveiculos/${vehicleId}`);
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
		const newStatus = currentStatus === 'active' ? 'inativo' : 'ativo';
		setConfirmTitle('Alterar Status');
		setConfirmMessage(`Tem certeza que deseja tornar este veículo ${newStatus}?`);
		setConfirmType(currentStatus === 'active' ? 'warning' : 'success');
		setConfirmAction(() => async () => {
			try {
				const response = await api.put(`/compraveiculos/${vehicleId}/toggle-status`);
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
			{vehicles.length === 0 ? (
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
						<div key={vehicle._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
							{/* Imagem do veículo */}
							<div className="h-48 bg-gray-200 relative">
								{vehicle.mainImage ? (
									<img
										src={getImageUrl(vehicle.mainImage)}
										alt={vehicle.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Car className="w-16 h-16 text-gray-400" />
									</div>
								)}
								<div className="absolute top-3 right-3 flex gap-2">
									<div className={`px-3 py-1 rounded-full text-xs font-semibold ${
										vehicle.aproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
									}`}>
										{vehicle.aproved ? 'Aprovado' : 'Pendente'}
									</div>
									<div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
										vehicle.status === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
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
									{vehicle.manufacturer} • {vehicle.year} • {vehicle.color}
								</p>

								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Gauge className="w-4 h-4 text-[#154c9a]" />
										<span>{vehicle.kilometers ? `${vehicle.kilometers.toLocaleString()} km` : 'Não informado'}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Fuel className="w-4 h-4 text-[#154c9a]" />
										<span className="capitalize">{vehicle.fuelType}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Settings className="w-4 h-4 text-[#154c9a]" />
										<span className="capitalize">{vehicle.transmission}</span>
									</div>
									{vehicle.location && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin className="w-4 h-4 text-[#154c9a]" />
											<span>{vehicle.location}</span>
										</div>
									)}
									{vehicle.price && (
										<div className="flex items-center gap-2 text-sm font-semibold text-[#154c9a]">
											<DollarSign className="w-4 h-4" />
											<span>{vehicle.price.toLocaleString()} Kz</span>
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
											{vehicle.todaaysViewCount || 0}
										</span>
										<span className="text-gray-500">hoje</span>
									</div>
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
										onClick={() => handleToggleStatus(vehicle._id, vehicle.status)}
										className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
											vehicle.status === 'active' 
												? 'bg-orange-500 text-white hover:bg-orange-600' 
												: 'bg-green-500 text-white hover:bg-green-600'
										}`}
										title={vehicle.status === 'active' ? 'Desativar veículo' : 'Ativar veículo'}
									>
										<Power className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDelete(vehicle._id)}
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
									<input
										type="text"
										name="manufacturer"
										value={formData.manufacturer}
										onChange={handleChange}
										required
										placeholder="Ex: Toyota, Ford, Volkswagen"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Classe/Tipo */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Tipo/Classe <span className="text-red-500">*</span>
									</label>
									<select
										name="class"
										value={formData.class}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione o tipo</option>
										<option value="Sedan">Sedan</option>
										<option value="Hatchback">Hatchback</option>
										<option value="SUV">SUV</option>
										<option value="Pickup">Pickup</option>
										<option value="Van">Van</option>
										<option value="Coupe">Coupé</option>
										<option value="Conversivel">Conversível</option>
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
										<option value="gasolina">Gasolina</option>
										<option value="diesel">Diesel</option>
										<option value="elétrico">Elétrico</option>
										<option value="híbrido">Híbrido</option>
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
										<option value="manual">Manual</option>
										<option value="automática">Automática</option>
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

								{/* Localização */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Localização <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										required
										placeholder="Ex: Luanda, Angola"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
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

								{/* Livrete (PDF) */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										<FileText className="w-5 h-5 inline mr-2" />
										Livrete / Documento do Veículo (PDF) {editingVehicle ? '(opcional - envie apenas se quiser alterar)' : <span className="text-red-500">*</span>}
									</label>
									<input
										type="file"
										name="livreto"
										accept="application/pdf"
										onChange={handleLivreteChange}
										required={!editingVehicle}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-green-700"
									/>
									<p className="text-sm text-gray-500 mt-2">
										{editingVehicle 
											? 'Deixe em branco para manter o documento atual. Envie apenas se precisar atualizar o livrete.'
											: 'Upload obrigatório do livrete ou documento do veículo em PDF'}
									</p>
									{livreteFile && (
										<p className="text-sm text-green-600 mt-2 font-semibold">
											Arquivo selecionado: {livreteFile.name}
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
						<div className={`px-6 py-5 border-b ${
							confirmType === 'danger' ? 'bg-red-50 border-red-200' :
							confirmType === 'warning' ? 'bg-orange-50 border-orange-200' :
							'bg-green-50 border-green-200'
						}`}>
							<div className="flex items-center gap-3">
								<div className={`w-12 h-12 rounded-full flex items-center justify-center ${
									confirmType === 'danger' ? 'bg-red-100' :
									confirmType === 'warning' ? 'bg-orange-100' :
									'bg-green-100'
								}`}>
									<AlertTriangle className={`w-6 h-6 ${
										confirmType === 'danger' ? 'text-red-600' :
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
								className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-colors cursor-pointer ${
									confirmType === 'danger' ? 'bg-red-600 hover:bg-red-700' :
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
