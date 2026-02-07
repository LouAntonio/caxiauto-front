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
	AlertCircle
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Veiculos = () => {
	useDocumentTitle('Meus Veículos - CaxiAuto');

	const { user } = useAuth();
	const [vehicles, setVehicles] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [formData, setFormData] = useState({
		brand: '',
		model: '',
		year: '',
		color: '',
		plate: '',
		mileage: '',
		fuel: 'gasolina',
		transmission: 'manual',
		price: '',
		description: '',
		imageUrl: '',
		location: '',
		status: 'ativo'
	});

	// Carregar veículos do usuário
	useEffect(() => {
		if (user) {
			const allVehicles = JSON.parse(localStorage.getItem('caxiauto_vehicles') || '[]');
			const userVehicles = allVehicles.filter(v => v.userId === user.id);
			setVehicles(userVehicles);
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const resetForm = () => {
		setFormData({
			brand: '',
			model: '',
			year: '',
			color: '',
			plate: '',
			mileage: '',
			fuel: 'gasolina',
			transmission: 'manual',
			price: '',
			description: '',
			imageUrl: '',
			location: '',
			status: 'ativo'
		});
		setEditingVehicle(null);
	};

	const handleOpenModal = (vehicle = null) => {
		if (vehicle) {
			setEditingVehicle(vehicle);
			setFormData(vehicle);
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

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validação básica
		if (!formData.brand || !formData.model || !formData.year) {
			setMessage({ type: 'error', text: 'Por favor, preencha os campos obrigatórios.' });
			return;
		}

		const allVehicles = JSON.parse(localStorage.getItem('caxiauto_vehicles') || '[]');

		if (editingVehicle) {
			// Editar veículo existente
			const updatedVehicles = allVehicles.map(v => 
				v.id === editingVehicle.id ? { ...formData, id: v.id, userId: user.id, updatedAt: new Date().toISOString() } : v
			);
			localStorage.setItem('caxiauto_vehicles', JSON.stringify(updatedVehicles));
			setVehicles(updatedVehicles.filter(v => v.userId === user.id));
			setMessage({ type: 'success', text: 'Veículo atualizado com sucesso!' });
		} else {
			// Adicionar novo veículo
			const newVehicle = {
				id: Date.now().toString(),
				...formData,
				userId: user.id,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};
			allVehicles.push(newVehicle);
			localStorage.setItem('caxiauto_vehicles', JSON.stringify(allVehicles));
			setVehicles([...vehicles, newVehicle]);
			setMessage({ type: 'success', text: 'Veículo adicionado com sucesso!' });
		}

		setTimeout(() => {
			handleCloseModal();
		}, 1500);
	};

	const handleDelete = (vehicleId) => {
		if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
			const allVehicles = JSON.parse(localStorage.getItem('caxiauto_vehicles') || '[]');
			const updatedVehicles = allVehicles.filter(v => v.id !== vehicleId);
			localStorage.setItem('caxiauto_vehicles', JSON.stringify(updatedVehicles));
			setVehicles(updatedVehicles.filter(v => v.userId === user.id));
			setMessage({ type: 'success', text: 'Veículo excluído com sucesso!' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		}
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
						className="flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors shadow-md"
					>
						<Plus className="w-5 h-5" />
						Adicionar Veículo
					</button>
				</div>
			</div>

			{/* Mensagem de feedback */}
			{message.text && (
				<div className={`p-4 rounded-lg flex items-center gap-2 ${
					message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
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
						className="inline-flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors"
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
								{vehicle.imageUrl ? (
									<img
										src={vehicle.imageUrl}
										alt={`${vehicle.brand} ${vehicle.model}`}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Car className="w-16 h-16 text-gray-400" />
									</div>
								)}
								<div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
									vehicle.status === 'ativo' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
								}`}>
									{vehicle.status === 'ativo' ? 'Ativo' : 'Inativo'}
								</div>
							</div>

							{/* Informações do veículo */}
							<div className="p-5">
								<h3 className="text-xl font-bold text-gray-900 mb-1">
									{vehicle.brand} {vehicle.model}
								</h3>
								<p className="text-gray-600 mb-4 text-sm">
									{vehicle.year} • {vehicle.color}
								</p>

								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Gauge className="w-4 h-4 text-[#154c9a]" />
										<span>{vehicle.mileage ? `${vehicle.mileage} km` : 'Não informado'}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Fuel className="w-4 h-4 text-[#154c9a]" />
										<span className="capitalize">{vehicle.fuel}</span>
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
											<span>akz {vehicle.price}</span>
										</div>
									)}
								</div>

								{/* Botões de ação */}
								<div className="flex gap-2 pt-4 border-t">
									<button
										onClick={() => handleOpenModal(vehicle)}
										className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] transition-colors"
									>
										<Edit2 className="w-4 h-4" />
										Editar
									</button>
									<button
										onClick={() => handleDelete(vehicle.id)}
										className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
				<div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-gradient-to-r from-[#154c9a] to-blue-600 px-8 py-6 flex items-center justify-between">
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
								<div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${
									message.type === 'success' 
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
										name="title"
										placeholder="Ex: Toyota Corolla 2020 XEI Automático"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
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
										name="brand"
										value={formData.brand}
										onChange={handleChange}
										required
										placeholder="Ex: Toyota, Ford, Volkswagen"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Modelo */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Modelo <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="model"
										value={formData.model}
										onChange={handleChange}
										required
										placeholder="Ex: Corolla, Fiesta, Gol"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
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
										min="1900"
										max={new Date().getFullYear() + 1}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Cor */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Cor
									</label>
									<input
										type="text"
										name="color"
										value={formData.color}
										onChange={handleChange}
										placeholder="Ex: Preto, Branco, Prata"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Placa */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Placa / Matrícula
									</label>
									<input
										type="text"
										name="plate"
										value={formData.plate}
										onChange={handleChange}
										placeholder="Ex: ABC-1234"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Quilometragem */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Quilometragem (km)
									</label>
									<input
										type="number"
										name="mileage"
										value={formData.mileage}
										onChange={handleChange}
										placeholder="Ex: 50000"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Combustível */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Tipo de Combustível
									</label>
									<select
										name="fuel"
										value={formData.fuel}
										onChange={handleChange}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									>
										<option value="gasolina">Gasolina</option>
										<option value="etanol">Etanol</option>
										<option value="flex">Flex</option>
										<option value="diesel">Diesel</option>
										<option value="eletrico">Elétrico</option>
										<option value="hibrido">Híbrido</option>
										<option value="gas">Gás</option>
									</select>
								</div>

								{/* Câmbio */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Transmissão / Caixa
									</label>
									<select
										name="transmission"
										value={formData.transmission}
										onChange={handleChange}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									>
										<option value="manual">Manual</option>
										<option value="automatico">Automático</option>
										<option value="automatizado">Automatizado</option>
										<option value="cvt">CVT</option>
									</select>
								</div>

								{/* Preço */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Preço (Kz)
									</label>
									<input
										type="text"
										name="price"
										value={formData.price}
										onChange={handleChange}
										placeholder="Ex: 15.000.000"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Localização */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Localização
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										placeholder="Ex: Luanda, Angola"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									/>
								</div>

								{/* Status */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Status
									</label>
									<select
										name="status"
										value={formData.status}
										onChange={handleChange}
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all"
									>
										<option value="ativo">Ativo</option>
										<option value="inativo">Inativo</option>
									</select>
								</div>

								{/* Imagem Principal */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Imagem Principal <span className="text-red-500">*</span>
									</label>
									<input
										type="file"
										name="mainImage"
										accept="image/*"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-700"
									/>
									<p className="text-sm text-gray-500 mt-2">Selecione a imagem principal do veículo (formato: JPG, PNG, WEBP)</p>
								</div>

								{/* Galeria de Imagens */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Galeria de Imagens (mínimo 4) <span className="text-red-500">*</span>
									</label>
									<input
										type="file"
										name="gallery"
										accept="image/*"
										multiple
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#154c9a] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-700"
									/>
									<p className="text-sm text-gray-500 mt-2">Selecione no mínimo 4 imagens do veículo (formato: JPG, PNG, WEBP)</p>
								</div>

								{/* Descrição */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Descrição / Observações
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows="4"
										placeholder="Descreva as características, condições e diferenciais do veículo..."
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#154c9a] focus:border-transparent transition-all resize-none"
									/>
									<p className="text-sm text-gray-500 mt-2">Informações adicionais que possam interessar aos compradores</p>
								</div>
							</div>

							{/* Botões do formulário */}
							<div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-100">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#154c9a] to-blue-600 text-white font-semibold rounded-xl hover:from-[#123f80] hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
								>
									<Save className="w-5 h-5" />
									{editingVehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Veiculos;
